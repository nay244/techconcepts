import { expect, test } from 'vitest';
import { parseRecheck, parseReport } from './report';

const header = {
  slug: 'cited-lesson',
  hash: 'a'.repeat(64),
  checked: '2026-11-08',
  checker: 'claude-opus-5-5',
  verdicts: { title: '✅', 'units[0].name': '⚠️', 'units[0].osi': '❌' },
  sources: [{ id: 'rfc-example', current: true, checked: '2026-11-08', note: 'Not obsoleted.' }],
  overrides: [],
};
const report = (h: unknown, eol = '\n') => ['# Fact check', '', '```json fact-check', JSON.stringify(h, null, 2), '```', '', 'Body.'].join(eol);

test('a well-formed header parses', () => {
  expect(parseReport(report(header))).toEqual({ header, issues: [] });
});

test('CRLF line endings parse', () => {
  expect(parseReport(report(header, '\r\n')).issues).toEqual([]);
});

test('a missing fence is unreadable', () => {
  expect(parseReport('# Fact check\n\nNo header here.\n').issues).toEqual([expect.stringContaining('```json fact-check')]);
});

test('bad JSON is unreadable', () => {
  const raw = '```json fact-check\n{ "slug": \n```\n';
  expect(parseReport(raw).issues).toEqual([expect.stringContaining('JSON')]);
});

test('an unknown header key is unreadable', () => {
  expect(parseReport(report({ ...header, verdict: 'all good' })).issues).not.toEqual([]);
});

test('a header missing a field is unreadable', () => {
  const { checker: _, ...rest } = header;
  expect(parseReport(report(rest)).issues).toEqual([expect.stringContaining('checker')]);
});

test('a verdict key written twice is unreadable, so a later ✅ cannot hide a ❌', () => {
  const raw = report(header).replace('"title": "✅",', '"title": "❌",\n    "title": "✅",');
  expect(JSON.parse(raw.split('```json fact-check\n')[1]!.split('\n```')[0]!).verdicts.title).toBe('✅');
  expect(parseReport(raw).issues).toEqual([expect.stringContaining('"title" more than once')]);
});

test('a header field written twice is unreadable, so a later one cannot replace an earlier', () => {
  const raw = report(header).replace('"checker":', '"checked": "2026-01-01",\n  "checker":');
  expect(parseReport(raw).issues).toEqual([expect.stringContaining('"checked" more than once')]);
  const nested = report({ ...header, sources: [{ ...header.sources[0]! }, { ...header.sources[0]!, id: 'other' }] });
  expect(parseReport(nested).issues).toEqual([]);
});

test('a source listed twice is unreadable, so a later "current" cannot hide a stale one', () => {
  const twice = { ...header, sources: [{ ...header.sources[0]!, current: false }, header.sources[0]!] };
  expect(parseReport(report(twice)).issues).toEqual([expect.stringContaining('"rfc-example" more than once')]);
});

// G4: the items record on a full report, and the re-check report's own header.

const hex = (c: string) => c.repeat(64);

test('items record 1: a full report may carry an items record of key to 64 hex, and may go without', () => {
  const items = { title: hex('a'), 'units[0].name': hex('b') };
  expect(parseReport(report({ ...header, items }))).toEqual({ header: { ...header, items }, issues: [] });
  expect(parseReport(report(header)).header!.items).toBeUndefined();
});

test('items record 2: a hash that is not 64 lowercase hex, or a value that is not a hash, is unreadable', () => {
  for (const bad of ['abc', hex('A'), hex('a') + 'a', 7, null]) {
    expect(parseReport(report({ ...header, items: { title: bad } })).issues, String(bad)).toEqual([expect.stringContaining('items')]);
  }
  expect(parseReport(report({ ...header, items: [hex('a')] })).issues).toEqual([expect.stringContaining('items')]);
});

const recheck = { slug: 'cited-lesson', base: hex('c'), hash: hex('a'), checked: '2026-11-11', checker: 'claude-opus-5-5', verdicts: { title: '✅' }, sources: [] };

test('re-check header 1: slug, base, hash, checked, checker, verdicts and sources parse, and a quotes record may follow', () => {
  expect(parseRecheck(report(recheck))).toEqual({ header: recheck, issues: [] });
  const quotes = { checked: '2026-11-11', count: 1, digest: hex('d'), files: { 'rfc-example': hex('e') } };
  expect(parseRecheck(report({ ...recheck, quotes })).header!.quotes).toEqual(quotes);
});

test('re-check header 2: it needs a base of 64 hex', () => {
  const { base: _, ...rest } = recheck;
  expect(parseRecheck(report(rest)).issues).toEqual([expect.stringContaining('base')]);
  expect(parseRecheck(report({ ...recheck, base: 'abc' })).issues).toEqual([expect.stringContaining('base')]);
});

test('re-check header 3: it has no overrides and no items record, and nothing else unknown', () => {
  expect(parseRecheck(report({ ...recheck, overrides: [] })).issues).toEqual([expect.stringContaining('overrides')]);
  expect(parseRecheck(report({ ...recheck, items: {} })).issues).not.toEqual([]);
  expect(parseRecheck(report({ ...recheck, extra: 1 })).issues).not.toEqual([]);
});

test('re-check header 4: a full report is not a re-check, and a re-check is not a full report', () => {
  expect(parseRecheck(report(header)).issues).not.toEqual([]);
  expect(parseReport(report(recheck)).issues).not.toEqual([]);
});

test('re-check header 5: a verdict key or a header field written twice is unreadable here too', () => {
  const twice = report(recheck).replace('"title": "✅"', '"title": "❌",\n    "title": "✅"');
  expect(parseRecheck(twice).issues).toEqual([expect.stringContaining('"title" more than once')]);
  const field = report(recheck).replace('"checker":', '"checked": "2026-01-01",\n  "checker":');
  expect(parseRecheck(field).issues).toEqual([expect.stringContaining('"checked" more than once')]);
  expect(parseRecheck('# no header').issues).toEqual([expect.stringContaining('```json fact-check')]);
});

test('items record 3: the same key in verdicts and in items is not a repeat, and a key written twice in items is unreadable', () => {
  const items = { title: hex('a'), 'units[0].name': hex('b') };
  expect(parseReport(report({ ...header, items })).issues).toEqual([]);
  const twice = report({ ...header, items }).replace(`"title": "${hex('a')}"`, `"title": "${hex('0')}",\n    "title": "${hex('a')}"`);
  expect(parseReport(twice).issues).toEqual([expect.stringContaining('its header\'s items list "title" more than once')]);
});
