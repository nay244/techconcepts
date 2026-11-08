import { expect, test } from 'vitest';
import { getLesson } from '../registry';
import { CANARY_FAULTS, CANARY_LESSON, CANARY_SOURCES } from './canary/lesson';
import { CANARY_SLUG, DEFAULT_DEPS, canaryReportPath } from './cli';
import { parseReport } from './report';
import { claimSheet } from './sheet';

// The canary (fact-checker design §9): a true DHCP lesson with five planted faults, citing real sources. The real
// fact-checker's report on it must flag every fault and pass everything else.

const sheet = () => claimSheet(CANARY_LESSON, CANARY_SOURCES);

test('the canary is a valid cited lesson outside the site', () => {
  expect(CANARY_LESSON.slug).toBe(CANARY_SLUG);
  expect(CANARY_LESSON.origin).toBe('cited');
  expect(getLesson(CANARY_SLUG)).toBeUndefined();
});

test('every planted fault is a key of its sheet', () => {
  const keys = sheet().items.map((i) => i.key);
  expect(Object.keys(CANARY_FAULTS)).toHaveLength(5);
  for (const key of Object.keys(CANARY_FAULTS)) expect(keys).toContain(key);
});

test('the canary report matches the canary and flags every planted fault', () => {
  const raw = DEFAULT_DEPS.readFile(canaryReportPath);
  expect(raw, `no report at ${canaryReportPath}; dispatch the fact-checker with "Check lesson ${CANARY_SLUG}."`).toBeDefined();
  const { header, issues } = parseReport(raw!);
  expect(issues).toEqual([]);
  expect(header!.hash).toBe(sheet().hash);
  for (const item of sheet().items) {
    const verdict = header!.verdicts[item.key];
    if (Object.hasOwn(CANARY_FAULTS, item.key)) expect(verdict, `planted fault: ${CANARY_FAULTS[item.key]}`).not.toBe('✅');
    else expect(verdict, `a correct item: ${item.key}`).toBe('✅');
  }
});
