#!/usr/bin/env python3
"""Pull registry entries ({ id: ..., kind: ..., short: ..., title: ..., publisher: ..., url: ..., anchor?: ... }) out of an
analyst's report. The last entry for an id wins (the Rulings come last). Prints the ids found; used by the orchestrator."""
import re, sys, json
S = r"'((?:[^'\\]|\\.)*)'"
PAT = re.compile(r"\{\s*id:\s*" + S + r",\s*kind:\s*" + S + r",\s*short:\s*" + S + r",\s*title:\s*" + S + r",\s*publisher:\s*" + S + r",\s*url:\s*" + S + r"(?:,\s*anchor:\s*" + S + r")?\s*,?\s*\}", re.S)
def entries(path):
    out = {}
    for m in PAT.finditer(open(path, encoding='utf-8').read()):
        i, kind, short, title, pub, url, anchor = m.groups()
        out[i] = dict(id=i, kind=kind, short=short, title=title, publisher=pub, url=url, anchor=anchor)
    return out
if __name__ == '__main__':
    for p in sys.argv[1:]:
        e = entries(p)
        print(p.split('/')[-2], len(e)); print('  ' + ' '.join(e))
