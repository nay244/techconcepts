import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { checkQuotes, keysMissingQuotes, type SourceFile } from './quotecheck';
import { pageText } from './pagetext';
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
const run = (raw: string, folder: SourceFile[]) => checkQuotes({ raw, sheet: sheet(), files: folder, today: TODAY, pageText });
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

test('an .html file is read as a reader sees it: tags gone, entities decoded, scripts and styles dropped', () => {
  const html = '<html><head><style>.x { content: "Hidden words." }</style><script>var s = "Script words.";</script></head><body><p>The <b>router</b> chooses &amp; says the&nbsp;lease &#8212; &#x41;ll</p><p>Next here.</p></body></html>';
  expect(finds(['The router chooses & says the lease - All'], html, 'rfc-example.html').issues).toEqual([]);
  expect(finds(['The router chooses & says the lease - All Next here.'], html, 'rfc-example.html').issues).toEqual([]);
  expect(finds(['Script words.'], html, 'rfc-example.html').issues).toHaveLength(1);
  expect(finds(['Hidden words.'], html, 'rfc-example.html').issues).toHaveLength(1);
});

test('the text of a page: inline tags stay inside a word, block ends and line breaks are a space, attributes give nothing', () => {
  expect(pageText('a.html', '<p>Hi</p><img alt="a > b words"><p>Next</p>')).not.toContain('b words');
  expect(pageText('a.html', '<p>Hi</p><img alt="a > b words"><p>Next</p>').replace(/\s+/g, ' ').trim()).toBe('Hi Next');
  expect(pageText('a.html', '<p><b>router</b>s</p>').trim()).toBe('routers');
  expect(pageText('a.html', 'one<br>two<div>three</div>four').replace(/\s+/g, ' ').trim()).toBe('one two three four');
});

test('a page decodes the entities a standards page uses, with or without the semicolon', () => {
  const text = pageText('a.html', '<p>a&thinsp;b &eacute; &rArr; &alpha; &AMP; &nbsp &#128512; &#x1F600;</p>');
  expect(text).toContain('a b');
  for (const decoded of ['é', '⇒', 'α', '&', '\u00A0', '😀']) expect(text).toContain(decoded);
  expect(pageText('a.html', '<p>x &AMP; y</p>')).toContain('x & y');
});

test('words only in a script, a comment, a template or a hidden element are not in the page', () => {
  const html = '<body><p>Seen words.</p><script>Script words.</script><!-- Comment words. --><template><p>Template words.</p></template><div hidden>Hidden words.</div><p hidden>More <b>hidden</b> words.</p><style>Style words.</style></body>';
  const text = pageText('a.html', html);
  expect(text).toContain('Seen words.');
  for (const gone of ['Script', 'Comment', 'Template', 'Hidden', 'hidden', 'Style']) expect(text).not.toContain(gone);
  expect(finds(['Template words.'], html, 'rfc-example.html').issues).toHaveLength(1);
});

test('two paragraphs\' words do not join', () => {
  expect(finds(['end. Start of'], '<p>The end.</p><p>Start of it</p>', 'rfc-example.html').issues).toEqual([]);
  expect(finds(['end.Start of'], '<p>The end.</p><p>Start of it</p>', 'rfc-example.html').issues).toHaveLength(1);
});

test('an .xml file is read as XML: its text with a space between elements', () => {
  expect(pageText('a.xml', '<?xml version="1.0"?><r><v>One &lt;two&gt;</v><w attr="no">three</w><![CDATA[ four]]></r>').replace(/\s+/g, ' ').trim()).toBe('One <two> three four');
});

test('a file that cannot be read as a page is a problem, not a crash', () => {
  const result = finds(['Some words here.'], '<a><b></a>', 'rfc-example.xml');
  expect(result.issues).toHaveLength(1);
  expect(result.issues[0]).toContain('rfc-example.xml');
});

test('a part matches whole words only', () => {
  expect(finds(['possible to route across them.'], 'It is impossible to route across them.').issues).toHaveLength(1);
  expect(finds(['possible to route across them.'], 'It is possible to route across them.').issues).toEqual([]);
  expect(finds(['a maximum of 25'], 'a maximum of 255 hops.').issues).toHaveLength(1);
  expect(finds(['a maximum of 25'], 'a maximum of 25 hops.').issues).toEqual([]);
  expect(finds(['The router … the lease'], 'The router never grants the release.').issues).toHaveLength(1);
  expect(finds(['The router … the lease'], 'The router never grants the lease.').issues).toEqual([]);
  expect(finds(['is not'], 'This nothing').issues).toHaveLength(1);
  expect(finds(['is not'], 'This is not it').issues).toEqual([]);
  // A part that begins or ends with punctuation has no word edge to test there.
  expect(finds(['(layer 7) and more'], 'The (layer 7) and more.').issues).toEqual([]);
});

test('each line-end break is joined or kept on its own', () => {
  expect(finds(['connection-mode service is established'], 'The connection-\nmode service is estab-\nlished here.').issues).toEqual([]);
  expect(finds(['connectionmode service is established'], 'The connection-\nmode service is estab-\nlished here.').issues).toEqual([]);
  expect(finds(['international travel here'], 'inter­\nnational travel here').issues).toEqual([]);
  expect(finds(['a well-known and international travel'], 'a well-\nknown and inter-\nnational travel').issues).toEqual([]);
  expect(finds(['a well-known and international travel'], 'a well- known and inter- national travel').issues).toHaveLength(1);
});

test('a soft hyphen inside a line is dropped, and zero-width characters too', () => {
  expect(finds(['international travel here'], 'inter­national tra​vel﻿ here').issues).toEqual([]);
});

test('ligatures are their letters; nothing else is folded: a superscript, a prime and a fraction stay', () => {
  expect(finds(['the oﬃce ﬁle ﬂow'], 'the office file flow').issues).toEqual([]);
  expect(finds(['the value 2³² is large'], 'the value 2³² is large').issues).toEqual([]);
  expect(finds(['the value 232 is large'], 'the value 2³² is large').issues).toHaveLength(1);
  expect(finds(["the x' value"], 'the x′ value').issues).toHaveLength(1);
  expect(finds(['half is 1/2 here'], 'half is ½ here').issues).toHaveLength(1);
});

test('a part of one word is a problem that says so', () => {
  const result = finds(['Router'], 'Router');
  expect(result.issues).toHaveLength(1);
  expect(result.issues[0]).toMatch(/one word/);
  expect(finds(['The router … lease'], 'The router x lease').issues[0]).toMatch(/one word/);
});

test('a passage of omission marks alone has no words to look for', () => {
  const result = finds(['… [...]'], 'anything here');
  expect(result.issues).toHaveLength(1);
  expect(result.issues[0]).toContain('no words besides its omission marks');
});

test('the omission marks are …, ..., […] and [...]', () => {
  for (const mark of ['…', '...', '[…]', '[...]']) {
    expect(finds([`The router ${mark} the lease.`], 'The router chooses, then says, the lease.').issues).toEqual([]);
  }
});

test('the record hashes each file as read, not the text taken from it', () => {
  const html = '<p>Filler words.</p>';
  const folder: SourceFile[] = [{ name: 'rfc-example.html', text: html }, { name: 'vendor-example.txt', text: 'Filler words.' }];
  const result = run(reportQuoting(), folder);
  expect(result.issues).toEqual([]);
  expect(result.record!.files['rfc-example']).toBe(sha256(html));
  expect(result.record!.files['rfc-example']).not.toBe(sha256('Filler words.'));
});

test('a header that repeats the quotes key is refused, and a header with CRLF keeps its line ending', () => {
  const once = reportQuoting();
  const twice = once.replace('"checker":', '"quotes": {"checked": "2026-01-01", "count": 1, "digest": "' + 'a'.repeat(64) + '", "files": {}},\n  "quotes": {"checked": "2026-01-01", "count": 1, "digest": "' + 'a'.repeat(64) + '", "files": {}},\n  "checker":');
  const refused = run(twice, files('x'));
  expect(refused.issues).toEqual([expect.stringContaining('"quotes" more than once')]);
  const crlf = once.replaceAll('\n', '\r\n');
  const result = run(crlf, files('x'));
  expect(result.issues).toEqual([]);
  expect(result.report!.replaceAll('\r\n', '')).not.toContain('\n');
  expect(parseReport(result.report!).header!.quotes).toEqual(result.record);
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
