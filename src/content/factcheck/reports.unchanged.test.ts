import { expect, test } from 'vitest';
import { getLesson } from '../registry';
import { SOURCES } from '../sources';
import { checkFactChecks } from './gate';
import { itemsToJudge } from './recheck';
import { parseRecheck, parseReport } from './report';
import { claimSheet, itemHashes } from './sheet';

// Check 1 (plan.md A1.1 to A1.3): the path for glossary groups changes nothing a lesson's report rests on. Every real
// lesson's sheet still has the hash its report (or its re-check) was written at, and every re-check still judges what it did.

const reports = import.meta.glob<string>(['../../../docs/fact-checks/*.md', '!../../../docs/fact-checks/*.recheck.md'], { query: '?raw', import: 'default', eager: true });
const rechecks = import.meta.glob<string>('../../../docs/fact-checks/*.recheck.md', { query: '?raw', import: 'default', eager: true });
const slugOf = (path: string, suffix: string) => path.slice(path.lastIndexOf('/') + 1, -suffix.length);
const fullBySlug = Object.fromEntries(Object.entries(reports).map(([p, raw]) => [slugOf(p, '.md'), raw]));
const reBySlug = Object.fromEntries(Object.entries(rechecks).map(([p, raw]) => [slugOf(p, '.recheck.md'), raw]));
const slugs = Object.keys(fullBySlug).sort();
const sheet = (slug: string) => claimSheet(getLesson(slug)!, SOURCES);

test('there are twenty-eight lesson reports and twelve re-checks', () => {
  expect(slugs).toHaveLength(28);
  expect(Object.keys(reBySlug)).toHaveLength(12);
});

test('A1.1 each lesson\'s sheet hash equals its re-check\'s hash where there is one, else its report\'s', () => {
  for (const slug of slugs) {
    const re = reBySlug[slug];
    const expected = re === undefined ? parseReport(fullBySlug[slug]!).header!.hash : parseRecheck(re).header!.hash;
    expect(sheet(slug).hash, slug).toBe(expected);
  }
});

test('A1.2 where a report with no re-check has an items record, itemHashes equals it exactly', () => {
  let stamped = 0;
  for (const slug of slugs.filter((s) => reBySlug[s] === undefined)) {
    const items = parseReport(fullBySlug[slug]!).header!.items;
    if (items === undefined) continue;
    stamped++;
    expect(itemHashes(sheet(slug)), slug).toEqual(items);
  }
  expect(stamped).toBeGreaterThan(0);
});

test('A1.3 each of the ten re-check pairs judges exactly the keys its re-check gave verdicts for, in order', () => {
  for (const slug of Object.keys(reBySlug)) {
    const full = parseReport(fullBySlug[slug]!).header!;
    const judge = itemsToJudge(full.items!, sheet(slug)).judge;
    expect(judge, slug).toEqual(Object.keys(parseRecheck(reBySlug[slug]!).header!.verdicts));
  }
});

test('every one of them passes the gate untouched', () => {
  const lessons = slugs.map((s) => getLesson(s)!);
  expect(checkFactChecks(lessons, reports, SOURCES, rechecks)).toEqual([]);
});
