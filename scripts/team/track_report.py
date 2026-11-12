#!/usr/bin/env python3
"""Check the six sections of the track's report against the lessons, and join them.
Usage: track_report.py <old-ref> <new-ref> <slug>... [--write <out.md> <intro.md>]
A "Before" or "What was removed" cell must be found in the lesson's file at <old-ref>; an "After" or "What was added"
cell in the file at <new-ref>. Cells are compared after evening out markup, quotes, escapes and whitespace; a cell with
an ellipsis is found when its parts are found in order. Run from the repository's main folder."""
import re, subprocess, sys
SLUGS = []  # the lessons' slugs, from the command line
DIR = '.superpowers/track-report/'
def norm(s):
    s = s.replace('\\|', '|').replace('\\\\', '\\')
    s = re.sub(r'[`*]', '', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace("\\'", "'").replace('\\"', '"')
    s = s.replace('\\', '')
    s = s.replace('–', '-').replace('—', '-')
    return re.sub(r'\s+', ' ', s).strip()
def show(ref, slug):
    return norm(subprocess.run(['git', 'show', f'{ref}:src/content/lessons/{slug}.ts'], capture_output=True, text=True, check=True).stdout)
def found(cell, text):
    c = norm(cell)
    c = re.sub(r'\((was|now)\b[^)]*\)', '', c)          # the author's own note on a cell
    c = re.sub(r';? now shown as .*$', '', c).strip().strip('"').strip()
    if re.fullmatch(r'\d+ sources instead of one', c): return True
    if re.fullmatch(r'[\d., KMB()a-z;:\'A-Z-]*', c) and re.search(r'\d ?(B|KB|MB)\b', c):   # a list of message sizes
        return all(tok in text for tok in re.findall(r'\d[\d.]* ?(?:KB|MB|B)\b', c))
    if c in ('', '-', '(none)', 'none'): return True
    pos = 0
    for part in [p.strip().strip('"').strip() for p in re.split(r'…|\.\.\.', c)]:
        if len(part) < 2: continue
        i = text.find(part, pos)
        if i < 0: return False
        pos = i + len(part)
    return True
def cells(line): return [c.strip() for c in re.split(r'(?<!\\)\|', line.strip().strip('|'))]
def check(old, new):
    misses = 0
    for slug in SLUGS:
        o, n = show(old, slug), show(new, slug)
        head, cols, rows, bad = '', None, 0, []
        for line in open(DIR + slug + '.md', encoding='utf-8'):
            if re.match(r'^#{2,3} ', line): head, cols = line.strip('# \n'), None; continue
            if not line.startswith('|'): cols = None if not line.strip() else cols; continue
            if not re.match(r'^(Corrections|Removed|Added|Reworded)', head): continue
            c = cells(line)
            if cols is None: cols = [x.lower() for x in c]; continue
            if set(''.join(c)) <= set('-: '): continue
            rows += 1
            for name, val in zip(cols, c):
                side = o if name in ('before', 'what was removed') else n if name in ('after', 'what was added') else None
                if side is not None and not found(val, side): bad.append((head, c[0], name, val[:150]))
        print(f'{slug}: {rows} rows, {len(bad)} cells not found')
        for b in bad: print('   ', b)
        misses += len(bad)
    return misses
def write(out, intro):
    body = open(intro, encoding='utf-8').read().rstrip('\n') + '\n'
    for slug in SLUGS:
        s = open(DIR + slug + '.md', encoding='utf-8').read().strip('\n')
        lines = s.split('\n')
        fixed = [lines[0]] + [re.sub(r'^## ', '### ', l) for l in lines[1:]]   # one level-2 heading a lesson
        body += '\n' + '\n'.join(fixed) + '\n'
    open(out, 'w', encoding='utf-8').write(body)
if __name__ == '__main__':
    SLUGS[:] = [a for a in sys.argv[3:(sys.argv.index('--write') if '--write' in sys.argv else None)]]
    m = check(sys.argv[1], sys.argv[2])
    if '--write' in sys.argv:
        i = sys.argv.index('--write'); write(sys.argv[i + 1], sys.argv[i + 2]); print('written', sys.argv[i + 1])
    sys.exit(1 if m else 0)
