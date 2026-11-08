import { expect, test } from 'vitest';
import { parseReport } from './report';

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

test('a source listed twice is unreadable, so a later "current" cannot hide a stale one', () => {
  const twice = { ...header, sources: [{ ...header.sources[0]!, current: false }, header.sources[0]!] };
  expect(parseReport(report(twice)).issues).toEqual([expect.stringContaining('"rfc-example" more than once')]);
});
