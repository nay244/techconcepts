import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { pageText } from './pagetext';
import { checkQuotes, stampItems, type SourceFile } from './quotecheck';
import { parseQuotes } from './quotes';
import { parseRecheck, parseReport } from './report';
import { claimSheet, itemHashes } from './sheet';
import { recheckReportFor, recordedReportFor, stampedReportFor } from './test-helpers';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

// G4: the quote check and the quote parser for a re-check report, and the items record the quote check writes.

const lesson = (): Lesson => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const sheet = () => claimSheet(lesson(), FIXTURE_SOURCES);
const TODAY = '2026-11-11';
const folder: SourceFile[] = [
  { name: 'rfc-example.txt', text: 'Some Filler words. here' },
  { name: 'vendor-example.txt', text: 'Filler words.' },
];
const run = (raw: string, recheck = false, s = sheet()) => checkQuotes({ raw, sheet: s, files: folder, today: TODAY, pageText, ...(recheck ? { recheck: true as const } : {}) });

/** Two cited items to judge, one quoting each source: their keys. */
const judged = () => ['rfc-example', 'vendor-example'].map((id) => sheet().items.find((i) => i.cite.length > 0 && i.cite[0]!.source === id)!.key);
const other = () => sheet().items.find((i) => i.cite.length > 0 && !judged().includes(i.key))!;

describe('the quote parser on a re-check report', () => {
  const parse = (raw: string) => parseQuotes(raw, sheet(), 'recheck');

  test('quote 1: the quotes of the items it judged are read', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged());
    expect(parse(raw).issues).toEqual([]);
    expect(parse(raw).quotes!.map((q) => q.key)).toEqual(judged());
  });

  test('quote 2: a quote under a key it did not judge is a problem, though the sheet has the key', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged()) + ['', `### ${other().key} — ✅`, '', `- \`${other().cite[0]!.source}\` §${other().cite[0]!.section}`, '  > Filler words.', ''].join('\n');
    expect(parse(raw).issues).toEqual([expect.stringContaining(`"${other().key}" is not an item this re-check judged`)]);
  });

  test('quote 3: a quote from a source or section the item does not cite is a problem, as in a full report', () => {
    const key = judged()[0]!;
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged()).replace(/(- `rfc-example` §)[^\n]*/, '$19.9.9');
    expect(parse(raw).issues).toEqual([expect.stringContaining('this item does not cite')]);
    expect(key).toBeDefined();
  });

  test('quote 4: the verdict in a heading must be the header\'s, as in a full report', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged()).replace(`### ${judged()[0]!} — ✅`, `### ${judged()[0]!} — ⚠️`);
    expect(parse(raw).issues).toEqual([expect.stringContaining('is headed ⚠️')]);
  });

  test('quote 5: a full report is not read as a re-check, nor a re-check as a full report', () => {
    expect(parse(recordedReportFor(sheet())).issues).not.toEqual([]);
    expect(parseQuotes(recheckReportFor(sheet(), 'c'.repeat(64), judged()), sheet()).issues).not.toEqual([]);
  });
});

describe('the quote parser on a full report that has a re-check beside it', () => {
  test('quote 6: its headings are its own verdict keys, which the lesson may no longer have, and its citations are not compared to the lesson', () => {
    // The lesson changed: the full report's quotes are under keys that the sheet of today no longer lists.
    const full = recordedReportFor(sheet());
    const moved = { ...sheet(), items: sheet().items.map((i) => ({ ...i, key: i.key + ' (old)', cite: [] })) };
    expect(parseQuotes(full, moved, 'recorded').issues).toEqual([]);
    expect(parseQuotes(full, moved, 'recorded').quotes).toHaveLength(parseQuotes(full, sheet()).quotes!.length);
    expect(parseQuotes(full, moved).issues).not.toEqual([]);
  });

  test('quote 7: a heading for a key the full report has no verdict for is still a problem', () => {
    const full = recordedReportFor(sheet()) + ['', '### nowhere — ✅', '', '- `rfc-example` §1', '  > Filler words.', ''].join('\n');
    expect(parseQuotes(full, sheet(), 'recorded').issues).toEqual([expect.stringContaining('"nowhere"')]);
  });

  test('quote 8: the quote\'s own form is still checked (a ">" line outside a quote)', () => {
    const full = recordedReportFor(sheet()) + '\n> stray\n';
    expect(parseQuotes(full, sheet(), 'recorded').issues).not.toEqual([]);
  });
});

describe('the quote check on a re-check report', () => {
  test('quote check 1: it finds its quotes, and writes its own record into its header', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged(), (h) => { delete h.quotes; });
    const result = run(raw, true);
    expect(result.issues).toEqual([]);
    const header = parseRecheck(result.report!).header!;
    expect(header.quotes).toMatchObject({ checked: TODAY, count: 2 });
    expect(Object.keys(header.quotes!.files)).toEqual(['rfc-example', 'vendor-example']);
  });

  test('quote check 2: it writes no items record, and every other byte of the report is as it was', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged(), (h) => { delete h.quotes; });
    const result = run(raw, true);
    expect(result.items).toBeUndefined();
    expect(result.report).not.toContain('"items"');
    expect(result.report!.replace(/,\n {2}"quotes": \{[\s\S]*?\n {2}\}(?=\n\})/, '')).toBe(raw);
  });

  test('quote check 3: a quote under a key it did not judge is refused, and nothing is written', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged()) + ['', `### ${other().key} — ✅`, '', `- \`${other().cite[0]!.source}\` §${other().cite[0]!.section}`, '  > Filler words.', ''].join('\n');
    const result = run(raw, true);
    expect(result.report).toBeUndefined();
    expect(result.issues).toEqual([expect.stringContaining('not an item this re-check judged')]);
  });

  test('quote check 4: only its own quotes are searched, so a source it does not quote needs no file', () => {
    const only = [judged()[0]!];
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), only);
    const rfc = sheet().items.find((i) => i.key === only[0])!.cite[0]!.source;
    const result = checkQuotes({ raw, sheet: sheet(), files: folder.filter((f) => f.name.startsWith(rfc)), today: TODAY, pageText, recheck: true });
    expect(result.issues).toEqual([]);
    expect(Object.keys(result.record!.files)).toEqual([rfc]);
  });

  test('quote check 5: a judged item that passes and cites, with no quote, is a problem', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged()).replace(/\n### [^\n]* — ✅\n\n- [^\n]*\n {2}> [^\n]*\n/, '\n');
    expect(run(raw, true).issues).toEqual([expect.stringContaining('passes (✅) and cites sources but has no quote')]);
  });

  test('quote check 6: an item not judged needs no quote, though it cites', () => {
    const raw = recheckReportFor(sheet(), 'c'.repeat(64), judged());
    expect(sheet().items.filter((i) => i.cite.length > 0).length).toBeGreaterThan(judged().length);
    expect(run(raw, true).issues).toEqual([]);
  });

  test('quote check 7: a re-check report is not checked as a full one, and the other way round', () => {
    expect(run(recheckReportFor(sheet(), 'c'.repeat(64), judged())).issues).not.toEqual([]);
    expect(run(recordedReportFor(sheet()), true).issues).not.toEqual([]);
  });
});

describe('the items record the quote check writes on a full report', () => {
  const plain = () => recordedReportFor(sheet(), (h) => { delete h.quotes; });

  test('items 1: when the report\'s hash is the sheet\'s hash, the record is written, key to hash, for every item', () => {
    const result = run(plain());
    expect(result.issues).toEqual([]);
    expect(result.items).toEqual(itemHashes(sheet()));
    expect(parseReport(result.report!).header!.items).toEqual(itemHashes(sheet()));
  });

  test('items 2: when the report\'s hash is not the sheet\'s, the quotes record is written and no items record', () => {
    const stale = recordedReportFor(sheet(), (h) => { delete h.quotes; h.hash = 'f'.repeat(64); });
    const result = run(stale);
    expect(result.issues).toEqual([]);
    expect(result.items).toBeUndefined();
    expect(parseReport(result.report!).header!.items).toBeUndefined();
    expect(parseReport(result.report!).header!.quotes).toBeDefined();
  });

  test('items 3: every other byte of the report is as it was', () => {
    const raw = plain();
    const out = run(raw).report!;
    const stripped = out.replace(/,\n {2}"quotes": \{[\s\S]*?\n {2}\},\n {2}"items": \{[\s\S]*?\n {2}\}(?=\n\})/, '');
    expect(stripped).toBe(raw);
  });

  test('items 4: running it again gives the same text, and an earlier items record is replaced in place', () => {
    const once = run(plain()).report!;
    expect(run(once).report).toBe(once);
    const wrong = recordedReportFor(sheet(), (h) => { h.items = { title: '0'.repeat(64) }; h.quotes = { checked: '2026-11-08', count: 0, digest: '0'.repeat(64), files: {} }; });
    expect(parseReport(run(wrong).report!).header!.items).toEqual(itemHashes(sheet()));
  });

  test('items 5: a CRLF report keeps its line ends', () => {
    const crlf = plain().replace(/\n/g, '\r\n');
    const out = run(crlf).report!;
    expect(out.replace(/\r\n/g, '')).not.toContain('\n');
    expect(parseReport(out).header!.items).toEqual(itemHashes(sheet()));
  });

  test('items 6: a quote problem writes nothing, the items record included', () => {
    const result = checkQuotes({ raw: plain(), sheet: sheet(), files: [{ name: 'rfc-example.txt', text: 'Nothing here' }, folder[1]!], today: TODAY, pageText });
    expect(result.report).toBeUndefined();
  });
});

describe('stamping a report', () => {
  test('stamp 1: stampItems writes the items record and no other byte changes', () => {
    const raw = recordedReportFor(sheet());
    const out = stampItems(raw, itemHashes(sheet()));
    expect(parseReport(out).header!.items).toEqual(itemHashes(sheet()));
    expect(out.replace(/,\n {2}"items": \{[\s\S]*?\n {2}\}(?=\n\})/, '')).toBe(raw);
  });

  test('stamp 2: stamping a stamped report changes nothing', () => {
    const stamped = stampedReportFor(sheet());
    expect(stampItems(stamped, itemHashes(sheet()))).toBe(stamped);
  });
});
