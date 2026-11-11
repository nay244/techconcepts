import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { checkQuotes, keysMissingQuotes, sourceText, type SourceFile } from './quotecheck';
import { keysNeedingQuotes, parseQuotes, quotesDigest } from './quotes';
import { parseReport } from './report';
import { sha256 } from './sha256';
import { claimSheet } from './sheet';
import { reportFor, type LooseHeader } from './test-helpers';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const sheet = () => claimSheet(validateLesson(makeCitedLesson(), FIXTURE_SOURCES), FIXTURE_SOURCES);
const TODAY = '2026-11-11';
/**
 * A report in which every passing item with citations quotes its first citation: `passages` gives the passage for
 * a key (as lines), and every other item quotes `Filler words.`.
 */
function reportQuoting(passages: Record<string, string[]> = {}, edit: (h: LooseHeader) => unknown = () => {}): string {
  const s = sheet();
  const lines: string[] = [];
  for (const key of keysNeedingQuotes(s)) {
    const c = s.items.find((i) => i.key === key)!.cite[0]!;
    lines.push('', `### ${key} — ✅`, '', `- \`${c.source}\` §${c.section}`, ...(passages[key] ?? ['Filler words.']).map((l) => `  > ${l}`));
  }
  return reportFor(s, (h) => void edit(h)) + lines.join('\n') + '\n';
}
/** The folder's files: the one source `rfc-example` holds `text`, the other holds the filler. */
const files = (text: string, name = 'rfc-example.txt'): SourceFile[] => [
  { name, text: `${text} Filler words.` },
  { name: 'vendor-example.txt', text: 'Filler words.' },
];
const run = (raw: string, folder: SourceFile[]) => checkQuotes({ raw, sheet: sheet(), files: folder, today: TODAY });
/** The first rfc-example item quotes `passage`; `text` is that source's text. */
const rfcKey = () => sheet().items.find((i) => i.cite[0]?.source === 'rfc-example')!.key;
const finds = (passage: string[], text: string, name?: string) => run(reportQuoting({ [rfcKey()]: passage }), files(text, name));

test('a passage is found as it is', () => {
  const result = finds(['The router chooses the lease.'], 'Before. The router chooses the lease. After.');
  expect(result.issues).toEqual([]);
});

test('a passage is found across a line break', () => {
  expect(finds(['The router chooses the lease.'], 'The router\n   chooses\r\nthe lease.').issues).toEqual([]);
});

test('a word broken by a hyphen at a line end is found joined', () => {
  expect(finds(['The international router.'], 'The inter-\nnational router.').issues).toEqual([]);
  expect(finds(['The inter­national router.'], 'The international router.').issues).toEqual([]);
});

test('a real hyphen at a line end is found unjoined', () => {
  expect(finds(['A well-known router.'], 'A well-\nknown router.').issues).toEqual([]);
});

test('curly quotes, dashes, a non-breaking space and a ligature are evened out', () => {
  expect(finds(['The router\'s "lease" - and the office.'], 'The router’s “lease” — and the oﬃce.').issues).toEqual([]);
  expect(finds(['The router’s “lease” — and the office.'], 'The router\'s "lease" - and the office.').issues).toEqual([]);
});

test('an ellipsis joins parts found in order', () => {
  for (const mark of ['…', '...', '[…]']) {
    expect(finds([`The router ${mark} the lease.`], 'The router chooses, then says, the lease.').issues).toEqual([]);
  }
});

test('parts out of order are not found, and the problem says which part', () => {
  const key = rfcKey();
  const result = finds(['the lease … The router'], 'The router chooses the lease.');
  expect(result.issues).toHaveLength(1);
  expect(result.issues[0]).toContain(`"${key}"`);
  expect(result.issues[0]).toContain('rfc-example');
  expect(result.issues[0]).toContain('part 2');
  expect(result.issues[0]).toContain('The router');
});

test('a passage whose case differs is not found', () => {
  const result = finds(['the router chooses the lease.'], 'The router chooses the lease.');
  expect(result.issues).toHaveLength(1);
  expect(result.issues[0]).toContain('the router chooses the lease.');
  expect(result.issues[0]).toContain('§');
});

test('a passage missing from a one-part quote names no part', () => {
  const result = finds(['Words that are not there.'], 'The router chooses the lease.');
  expect(result.issues[0]).toMatch(/not found/);
  expect(result.issues[0]).not.toContain('part 1');
});

test('an .html file gives its text: tags gone, entities decoded, scripts and styles dropped', () => {
  const html = '<html><head><style>.x { content: "Hidden words." }</style><script>var s = "Script words.";</script></head><body><p>The <b>router</b> chooses &amp; says the&nbsp;lease &#8212; &#x41;ll</p><p>Next.</p></body></html>';
  expect(finds(['The router chooses & says the lease - All'], html, 'rfc-example.html').issues).toEqual([]);
  expect(finds(['The router chooses & says the lease - All Next.'], html, 'rfc-example.html').issues).toEqual([]);
  expect(finds(['Script words.'], html, 'rfc-example.html').issues).toHaveLength(1);
  expect(finds(['Hidden words.'], html, 'rfc-example.html').issues).toHaveLength(1);
});

test('an .xml file gives its text the same way', () => {
  expect(sourceText('a.xml', '<?xml version="1.0"?><r><v>One &lt;two&gt;</v><![CDATA[ three]]></r>')).toBe('One <two> three');
});

test('a source with no file in the folder is a problem naming the files looked for', () => {
  const result = run(reportQuoting(), [{ name: 'vendor-example.txt', text: 'Filler words.' }]);
  expect(result.issues).toEqual([expect.stringContaining('rfc-example.txt, rfc-example.html or rfc-example.xml')]);
  expect(result.issues[0]).toContain('"rfc-example"');
});

test('a source with two files is a problem naming both', () => {
  const result = run(reportQuoting(), [...files('x'), { name: 'rfc-example.html', text: 'x' }]);
  expect(result.issues).toHaveLength(1);
  expect(result.issues[0]).toContain('rfc-example.txt');
  expect(result.issues[0]).toContain('rfc-example.html');
});

test('a report whose quotes cannot be read gives the parser\'s problems as they are', () => {
  const raw = reportQuoting() + '\n### nonsense heading\n';
  expect(run(raw, files('x')).issues).toEqual(parseQuotes(raw, sheet()).issues);
});

test('a passing claim with citations and no quote is a problem, and the rule is exported', () => {
  const s = sheet();
  const [skipped] = keysNeedingQuotes(s);
  const raw = reportQuoting().replace(new RegExp(`### ${skipped!.replace(/[[\]().]/g, '\\$&')} — ✅\\n\\n- [^\\n]*\\n  > [^\\n]*\\n`), '');
  const result = run(raw, files('x'));
  expect(result.issues).toEqual([expect.stringContaining(`"${skipped}"`)]);
  const parsed = parseQuotes(raw, s).quotes!;
  expect(keysMissingQuotes(s, parseReport(raw).header!.verdicts, parsed)).toEqual([skipped]);
  // A ⚠️ item may go without.
  const weak = keysMissingQuotes(s, { ...parseReport(raw).header!.verdicts, [skipped!]: '⚠️' }, parsed);
  expect(weak).toEqual([]);
});

test('the record has the right count, digest and file hashes, and the rest of the report is the same bytes', () => {
  const raw = reportQuoting();
  const folder = files('x');
  const result = run(raw, folder);
  expect(result.issues).toEqual([]);
  const quotes = parseQuotes(raw, sheet()).quotes!;
  expect(result.record).toEqual({
    checked: TODAY,
    count: quotes.length,
    digest: quotesDigest(quotes),
    files: { 'rfc-example': sha256(folder[0]!.text), 'vendor-example': sha256('Filler words.') },
  });
  expect(parseReport(result.report!).header!.quotes).toEqual(result.record);
  expect(result.report!.replace(/,\n {2}"quotes": \{[\s\S]*?\n {2}\}(?=\n\})/, '')).toBe(raw);
});

test('an earlier record is replaced', () => {
  const stale = reportQuoting({}, (h) => void (h.quotes = { checked: '2026-01-01', count: 1, digest: 'a'.repeat(64), files: {} }));
  const result = run(stale, files('x'));
  expect(result.issues).toEqual([]);
  expect(result.report!.match(/"quotes"/g)).toHaveLength(1);
  expect(parseReport(result.report!).header!.quotes).toEqual(result.record);
  expect(result.report!.split('"quotes"')[0]).toBe(stale.split('"quotes"')[0]);
  expect(result.report!.slice(result.report!.indexOf('```\n', result.report!.indexOf('"quotes"')))).toBe(stale.slice(stale.indexOf('```\n', stale.indexOf('"quotes"'))));
});

test('an earlier record in the middle of the header is replaced too', () => {
  const stale = reportQuoting({}, (h) => {
    h.quotes = { checked: '2026-01-01', count: 1, digest: 'a'.repeat(64), files: {} };
    const slug = h.slug;
    delete h.slug;
    h.slug = slug;
  });
  const result = run(stale, files('x'));
  expect(result.issues).toEqual([]);
  expect(parseReport(result.report!).header!.quotes).toEqual(result.record);
  expect(result.report!.match(/"quotes"/g)).toHaveLength(1);
});

test('nothing is written when one quote fails', () => {
  const result = run(reportQuoting({ [rfcKey()]: ['Not in the source.'] }), files('x'));
  expect(result.issues).toHaveLength(1);
  expect('report' in result && result.report !== undefined).toBe(false);
});
