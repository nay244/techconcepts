import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { evenWhitespace, keysNeedingQuotes, parseQuotes, quotesDigest, type Quote } from './quotes';
import { parseReport } from './report';
import { claimSheet } from './sheet';
import { reportFor, type LooseHeader } from './test-helpers';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const sheet = () => claimSheet(validateLesson(makeCitedLesson(), FIXTURE_SOURCES), FIXTURE_SOURCES);
/** A claim item with a citation, and one of its citations. */
const claim = () => {
  const item = sheet().items.find((i) => i.kind === 'claim' && i.cite.length >= 2)!;
  return { item, key: item.key, first: item.cite[0]!, second: item.cite.find((c) => c.source !== item.cite[0]!.source) ?? item.cite[1]! };
};
/** A report with a valid header (every item ✅, unless `edit` changes it) and the given lines as its body. */
const body = (...lines: string[]) => report((h) => h, ...lines);
const report = (edit: (h: LooseHeader) => unknown, ...lines: string[]) => reportFor(sheet(), (h) => void edit(h)) + ['', ...lines, ''].join('\n');
const issues = (raw: string) => parseQuotes(raw, sheet()).issues;
/** An item that cites, and one that cites nothing. */
const bare = () => sheet().items.find((i) => i.kind === 'traced')!;

test('a well-formed report parses to its quotes in order', () => {
  const { key, first, second } = claim();
  const traced = sheet().items.find((i) => i.kind === 'traced')!;
  const raw = body(
    `### ${key} — ✅`,
    '',
    `- \`${first.source}\` §${first.section} `,
    '  > The Reference Model contains seven layers: a) the Application Layer (layer 7);',
    '  > …   g) the Physical Layer (layer 1).',
    `- \`${second.source}\` §${second.section}`,
    '  > Second   passage.',
    '- Note: Community sources only.',
    '',
    `### ${traced.key} — ✅`,
    '',
    'Traces the claim above.',
    '',
    '## The sources',
    '',
    '- anything here is left alone',
  );
  expect(parseQuotes(raw, sheet())).toEqual({
    quotes: [
      { key, source: first.source, section: first.section, passage: 'The Reference Model contains seven layers: a) the Application Layer (layer 7); … g) the Physical Layer (layer 1).' },
      { key, source: second.source, section: second.section, passage: 'Second passage.' },
    ],
    issues: [],
  });
});

test('CRLF line endings parse', () => {
  const { key, first } = claim();
  const raw = body(`### ${key} — ✅`, `- \`${first.source}\` §${first.section}`, '  > Words.').replaceAll('\n', '\r\n');
  expect(parseQuotes(raw, sheet()).quotes).toEqual([{ key, source: first.source, section: first.section, passage: 'Words.' }]);
});

test('a heading for an item that quotes nothing needs no quotes', () => {
  const traced = sheet().items.find((i) => i.kind === 'traced')!;
  expect(parseQuotes(body(`### ${traced.key} — ✅`, '', 'Traced.'), sheet())).toEqual({ quotes: [], issues: [] });
});

test('a heading whose key is not on the sheet is named', () => {
  expect(issues(body('### units[9].nope — ✅', '- `rfc-example` §1', '  > Words.'))).toEqual([
    expect.stringMatching(/"units\[9\]\.nope" is not an item on the claim sheet; .*heading/),
  ]);
});

test('a source the item does not cite is named', () => {
  const { key, item } = claim();
  const [problem] = issues(body(`### ${key} — ✅`, '- `unlisted-source` §1', '  > Words.'));
  expect(problem).toContain(`"${key}"`);
  expect(problem).toContain('unlisted-source');
  expect(problem).toContain(`cites ${item.cite[0]!.source}`);
});

test('a section the item does not cite in that source is named', () => {
  const { key, first } = claim();
  const [problem] = issues(body(`### ${key} — ✅`, `- \`${first.source}\` §99.99`, '  > Words.'));
  expect(problem).toContain(`"${key}"`);
  expect(problem).toContain(`section this item does not cite in ${first.source}`);
  expect(problem).toContain(`§${first.section}`);
});

test('a quote with no ">" line is named', () => {
  const { key, first } = claim();
  expect(issues(body(`### ${key} — ✅`, `- \`${first.source}\` §${first.section}`, '', 'Some words.'))).toEqual([
    expect.stringContaining('has no passage'),
  ]);
});

test('a quote with an empty passage is named', () => {
  const { key, first } = claim();
  expect(issues(body(`### ${key} — ✅`, `- \`${first.source}\` §${first.section}`, '  >   '))).toEqual([expect.stringContaining('has an empty passage')]);
});

test('a bullet that is not a quote and not a Note is named', () => {
  const { key } = claim();
  const found = issues(body(`### ${key} — ✅`, '- Currency: not obsoleted.'));
  expect(found).toEqual([expect.stringContaining('does not begin "Note:"')]);
  expect(found[0]).toContain(`"${key}"`);
});

test('a bullet outside a claim heading is left alone', () => {
  expect(parseQuotes(body('## The sources', '- Currency: fine.'), sheet())).toEqual({ quotes: [], issues: [] });
});

test('the header takes a quote record, and only a well-formed one', () => {
  const record = { checked: '2026-11-11', count: 2, digest: 'a'.repeat(64), files: { 'rfc-example': 'b'.repeat(64) } };
  const withRecord = (quotes: unknown) => parseReport(reportFor(sheet(), (h) => void (h.quotes = quotes)));
  expect(withRecord(record).header?.quotes).toEqual(record);
  expect(parseReport(reportFor(sheet())).header?.quotes).toBeUndefined();
  expect(withRecord({ ...record, digest: 'A'.repeat(64) }).issues).toEqual([expect.stringContaining('quotes.digest')]);
  expect(withRecord({ ...record, count: -1 }).issues).not.toEqual([]);
  expect(withRecord({ ...record, files: { x: 'short' } }).issues).not.toEqual([]);
  expect(withRecord({ ...record, extra: 1 }).issues).not.toEqual([]);
  expect(withRecord({ ...record, checked: 'yesterday' }).issues).not.toEqual([]);
});

const q = (over: Partial<Quote> = {}): Quote => ({ key: 'k', source: 'rfc-example', section: '1', passage: 'one two three', ...over });

test('the digest is stable under whitespace in a passage', () => {
  expect(quotesDigest([q({ passage: ' one\n  two\tthree ' })])).toBe(quotesDigest([q()]));
  expect(evenWhitespace(' a \n b ')).toBe('a b');
  expect(quotesDigest([q()])).toMatch(/^[0-9a-f]{64}$/);
});

test('the digest changes with a word, a section, a source, the order or a key', () => {
  const base = quotesDigest([q(), q({ key: 'j' })]);
  expect(quotesDigest([q({ passage: 'one two four' }), q({ key: 'j' })])).not.toBe(base);
  expect(quotesDigest([q({ section: '2' }), q({ key: 'j' })])).not.toBe(base);
  expect(quotesDigest([q({ source: 'vendor-example' }), q({ key: 'j' })])).not.toBe(base);
  expect(quotesDigest([q({ key: 'j' }), q()])).not.toBe(base);
  expect(quotesDigest([q({ key: 'kk' }), q({ key: 'j' })])).not.toBe(base);
});

// The amended form (plan.md, after B1's first review).

test('a section is everything after the section sign, so a name ending in parentheses is read whole', () => {
  const s = sheet();
  const item = s.items.find((i) => i.cite.length > 0)!;
  const c = item.cite[0]!;
  const edited = { ...s, items: s.items.map((i) => (i === item ? { ...i, cite: [{ ...c, section: 'Table 1 (continued)' }] } : i)) };
  const raw = body(`### ${item.key} — ✅`, `- \`${c.source}\` §Table 1 (continued)`, '  > Words.');
  expect(parseQuotes(raw, edited).issues).toEqual([]);
  expect(parseQuotes(raw, edited).quotes).toEqual([{ key: item.key, source: c.source, section: 'Table 1 (continued)', passage: 'Words.' }]);
  const { key, first } = claim();
  expect(issues(body(`### ${key} — ✅`, `- \`${first.source}\` §${first.section} (a note)`, '  > Words.'))).toEqual([expect.stringContaining('section')]);
});

const quoteAt = (extra: string[]) => {
  const { key, first } = claim();
  return { key, raw: body(`### ${key} — ✅`, `- \`${first.source}\` §${first.section}`, '  > Words.', ...extra) };
};

test('a ">" line after a blank line, under a note or under plain text is named', () => {
  for (const extra of [['', '> stray'], ['- Note: a comment', '  > stray'], ['Text: "x"', '> stray']]) {
    const { key, raw } = quoteAt(extra);
    const found = issues(raw);
    expect(found, extra.join('|')).toEqual([expect.stringContaining('">" line')]);
    expect(found[0]).toContain(`"${key}"`);
  }
  const { key } = claim();
  expect(issues(body(`### ${key} — ✅`, '> before any quote'))).toEqual([expect.stringContaining('">" line')]);
});

test('plain text lines under a claim heading are allowed', () => {
  const { raw } = quoteAt(['', 'Text: "A device asks to renew."', '- Note: fine.']);
  expect(issues(raw)).toEqual([]);
});

test('an indented, nested, numbered or "+" bullet is named, and so is a "*" bullet', () => {
  const { key } = claim();
  for (const bullet of ['  - Note: nested', '    - `rfc-example` §1', '1. Note: numbered', '1) Note: numbered', '+ Note: plus', '* Note: star']) {
    const found = issues(body(`### ${key} — ✅`, bullet));
    expect(found, bullet).toEqual([expect.stringContaining('starts its line with "- "')]);
    expect(found[0]).toContain(`"${key}"`);
  }
});

test('a heading deeper than ### under a claim heading is named', () => {
  const { key } = claim();
  expect(issues(body(`### ${key} — ✅`, '#### Currency'))).toEqual([expect.stringContaining(`"${key}"`)]);
});

test('a ### heading that is not "### <key> — <verdict>" is named', () => {
  const { key } = claim();
  expect(issues(body(`### ${key} - ✅`))).toEqual([expect.stringContaining('verdict')]);
  expect(issues(body(`### ${key} — fine`))).toEqual([expect.stringContaining('verdict')]);
  expect(issues(body(`### ${key}`))).toEqual([expect.stringContaining('verdict')]);
});

test('a key that appears twice is named', () => {
  const { key } = claim();
  expect(issues(body(`### ${key} — ✅`, '', `### ${key} — ✅`))).toEqual([expect.stringContaining(`"${key}" has two headings`)]);
});

test("a heading's verdict that differs from the header's is named", () => {
  const { key } = claim();
  const raw = body(`### ${key} — ⚠️`);
  const found = issues(raw);
  expect(found).toEqual([expect.stringContaining('⚠️')]);
  expect(found[0]).toContain(`"${key}"`);
  expect(found[0]).toContain('✅');
});

test('a header that cannot be read gives its own problems', () => {
  expect(issues('# Fact check\n\n### title — ✅\n')).toEqual([expect.stringContaining('no header')]);
});

test('a key that itself contains " — " is read whole', () => {
  const item = { ...sheet().items[0]!, key: 'units[0].a — b (x)' };
  const edited = { ...sheet(), items: [item, ...sheet().items.slice(1)] };
  const raw = reportFor(edited) + `\n### ${item.key} — ✅\n`;
  expect(parseQuotes(raw, edited)).toEqual({ quotes: [], issues: [] });
});

test('a quote under an item that cites nothing says to write a note', () => {
  const item = bare();
  const found = issues(body(`### ${item.key} — ✅`, '- `rfc-example` §1', '  > Words.'));
  expect(found).toEqual([expect.stringContaining('cites nothing')]);
  expect(found[0]).toContain('Note:');
  expect(found[0]).toContain(`"${item.key}"`);
});

test('keysNeedingQuotes lists the items that have citations, in sheet order', () => {
  const s = sheet();
  expect(keysNeedingQuotes(s)).toEqual(s.items.filter((i) => i.cite.length > 0).map((i) => i.key));
  expect(keysNeedingQuotes(s)).not.toContain(bare().key);
  expect(keysNeedingQuotes(s).length).toBeGreaterThan(0);
});
