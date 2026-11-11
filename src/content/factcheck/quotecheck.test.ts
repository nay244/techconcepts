import { expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { checkQuotes, keysMissingQuotes, type SourceFile } from './quotecheck';
import { pageText } from './pagetext';
import { keysNeedingQuotes, parseQuotes, quotesDigest } from './quotes';
import { checkReport } from './gate';
import { parseReport } from './report';
import { sha256 } from './sha256';
import { claimSheet } from './sheet';
import { reportFor, reportQuoting as reportQuotingFor, withoutRecords, type LooseHeader } from './test-helpers';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

const sheet = () => claimSheet(validateLesson(makeCitedLesson(), FIXTURE_SOURCES), FIXTURE_SOURCES);
const TODAY = '2026-11-11';
const reportQuoting = (passages: Record<string, string[]> = {}, edit: (h: LooseHeader) => unknown = () => {}) => reportQuotingFor(sheet(), passages, edit);
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

test('a part does not start or end inside a word broken at a line end', () => {
  expect(finds(['national travel here'], 'inter-\nnational travel here').issues).toHaveLength(1);
  expect(finds(['national travel here'], 'inter\u00AD\nnational travel here').issues).toHaveLength(1);
  expect(finds(['see the inter'], 'see the inter-\nnational').issues).toHaveLength(1);
  expect(finds(['see the international'], 'see the inter-\nnational').issues).toEqual([]);
  expect(finds(['see the inter-national'], 'see the inter-\nnational').issues).toEqual([]);
  expect(finds(['mode service is established'], 'The connection-mode service is established').issues).toEqual([]);
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
  // The report's hash is the sheet's, so the items record and the limits hash are written too (G4).
  expect(withoutRecords(result.report!).replace(/,\n {2}"quotes": \{[\s\S]*?\n {2}\}(?=\n\})/, '')).toBe(raw);
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

// ---------------------------------------------------------------- after the second review

const found = (passage: string[], text: string, name?: string) => finds(passage, text, name).issues.length === 0;

test('a number is not cut short at a decimal point or a thousands separator', () => {
  expect(found(['an MTU of 1'], 'It has an MTU of 1,500 bytes.')).toBe(false);
  expect(found(['a maximum of 2'], 'It waits a maximum of 2.5 seconds.')).toBe(false);
  expect(found(['500 bytes long'], 'An MTU of 1,500 bytes long.')).toBe(false);
  // A number that ends a sentence, or a list, is whole.
  expect(found(['a maximum of 2'], 'It waits a maximum of 2. Then it stops.')).toBe(true);
  expect(found(['layers 1, 2'], 'It names layers 1, 2 and 3.')).toBe(true);
});

test('a superscript or subscript on a page does not run into the digits beside it', () => {
  const page = '<p>There are 2<sup>32</sup> addresses and H<sub>2</sub>O here.</p>';
  expect(pageText('a.html', page)).toContain('2^32 addresses');
  expect(pageText('a.html', page)).toContain('H_2O');
  expect(found(['There are 232 addresses'], page, 'rfc-example.html')).toBe(false);
  expect(found(['There are 2^32 addresses'], page, 'rfc-example.html')).toBe(true);
});

test('only a hyphen or a soft hyphen breaks a word at a line end: a dash there is a dash', () => {
  expect(found(['all of the layer'], 'It covers all of the layer—\nthat is, every one.')).toBe(true);
  expect(found(['all of the layer'], 'It covers all of the layer–\nthat is, every one.')).toBe(true);
  // Every dash is still a hyphen when the passage and the source write it differently.
  expect(found(['the layer - that is'], 'It covers the layer — that is, every one.')).toBe(true);
  expect(found(['minus −5 and ﹣5'], 'It is minus -5 and -5 today.')).toBe(true);
});

test('a passage too long to be a quote is refused with a plain message, not a crash', () => {
  const long = Array.from({ length: 500 }, (_, i) => `word${i}`).join(' ');
  const result = finds([long], `Start. ${long} End.`);
  expect(result.issues).toEqual([expect.stringContaining('longer than')]);
  expect(result.issues[0]!.length).toBeLessThan(400);
});

test('a passage, like each of its parts, is at least two words, and a mark is not a word', () => {
  expect(finds(['Router'], 'Router chooses.').issues).toEqual([expect.stringContaining('one word')]);
  expect(finds(['- x'], 'It is - x here.').issues).toEqual([expect.stringContaining('one word')]);
});

test('an accent written as a combining mark is the same letter, and is still a letter at a word’s edge', () => {
  expect(found(['the café opens'], 'Today the café opens early.')).toBe(true);
  expect(found(['a cafe'], 'It is a café here.')).toBe(false);
});

test('on a page a line break in the source is a space, so a hyphen before it is not a word break; in <pre> it is', () => {
  expect(found(['an international body'], '<p>It is an inter-\nnational body.</p>', 'rfc-example.html')).toBe(false);
  expect(found(['an international body'], '<pre>It is an inter-\nnational body.</pre>', 'rfc-example.html')).toBe(true);
});

test('what a reader does not see on a page is not its text: display:none, noscript, an svg’s title', () => {
  const page = '<p>Seen words here.</p><p style="display: none">Unseen style words.</p><noscript>Unseen noscript words.</noscript><svg><title>Unseen title words.</title><desc>Unseen desc words.</desc></svg><p aria-hidden="true">Seen decorative words.</p>';
  const text = pageText('a.html', page);
  expect(text).toContain('Seen words here.');
  expect(text).toContain('Seen decorative words.');
  expect(text).not.toMatch(/Unseen/);
});

test('a record is dated the later of today and the header\'s day, so a header a day ahead still passes the gate', () => {
  const raw = reportQuoting();
  const behind = checkQuotes({ raw, sheet: sheet(), files: files('x'), today: '2026-11-07', pageText });
  expect(behind.issues).toEqual([]);
  expect(behind.record!.checked).toBe('2026-11-08');
  expect(checkReport(sheet(), behind.report, 'docs/fact-checks/cited-lesson.md')).toEqual([]);
  expect(run(raw, files('x')).record!.checked).toBe(TODAY);
});

test('a header dated two days or more ahead is not followed: the record says today, and the gate refuses it by name', () => {
  // The header says 2026-11-08; today is three days before. One day ahead is a timezone; three is a mistake.
  const early = checkQuotes({ raw: reportQuoting(), sheet: sheet(), files: files('x'), today: '2026-11-05', pageText });
  expect(early.issues).toEqual([]);
  expect(early.record!.checked).toBe('2026-11-05');
  expect(checkReport(sheet(), early.report, 'docs/fact-checks/cited-lesson.md')).toEqual([expect.stringContaining('before the report was checked on 2026-11-08')]);
  // Across a month's end, one day ahead is still one day.
  const monthEnd = reportQuoting({}, (h) => void (h.checked = '2026-12-01'));
  expect(checkQuotes({ raw: monthEnd, sheet: sheet(), files: files('x'), today: '2026-11-30', pageText }).record!.checked).toBe('2026-12-01');
  expect(checkQuotes({ raw: monthEnd, sheet: sheet(), files: files('x'), today: '2026-11-29', pageText }).record!.checked).toBe('2026-11-29');
});
