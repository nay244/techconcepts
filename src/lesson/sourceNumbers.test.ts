import { expect, test } from 'vitest';
import { getLesson } from '../content/registry';
import { liftedFixture } from '../content/test-fixtures';
import { numberedSources, sourceMarks } from './sourceNumbers';

const osi = getLesson('osi-model')!.units[0]!;
// A lesson that cites nothing: a lifted fixture (every real lesson cites).
const uncited = liftedFixture().units[0]!;

test('a cited lesson’s sources are numbered in the order Learn first cites them', () => {
  const { list, numberOf } = numberedSources(osi);
  // Every source the lesson lists, each once.
  expect(list).toHaveLength(osi.references.length);
  expect(new Set(list)).toEqual(new Set(osi.references));
  expect([...numberOf.values()]).toEqual(list.map((_, i) => i + 1));
  // Reading Learn top to bottom, a new number is always the next one.
  const { lead, terms, pattern, why, deep, facts } = osi.learn;
  let highest = 0;
  for (const part of [...lead, ...terms, pattern, ...why, ...deep, ...facts]) {
    for (const mark of sourceMarks(part.cite, numberOf)) {
      expect(mark.n).toBeLessThanOrEqual(highest + 1);
      highest = Math.max(highest, mark.n);
    }
  }
  expect(highest).toBeGreaterThan(1);
});

test('a claim gets one mark for each source, which opens the first place it cites there and names them all', () => {
  const { numberOf } = numberedSources(osi);
  const claim = osi.learn.lead.find((s) => s.id === 'lead-2')!;
  const marks = sourceMarks(claim.cite, numberOf);
  expect(marks.map((m) => m.n)).toEqual([...marks.map((m) => m.n)].sort((a, b) => a - b));
  expect(marks).toHaveLength(new Set(claim.cite.map((c) => c.source)).size);
  const x200 = marks.find((m) => m.n === numberOf.get('itu-x200'))!;
  expect(x200.url).toBe(claim.cite[0]!.url);
  expect(x200.places).toBe('ITU-T X.200, 1.1; ITU-T X.200, 1.2; ITU-T X.200, 5.2.2.3; ITU-T X.200, 5.2.2.5; ITU-T X.200, 6.2.1');
});

test('a lesson that cites nothing yet keeps its list as written, with no numbers and no marks', () => {
  const { list, numberOf } = numberedSources(uncited);
  expect(list).toEqual(uncited.references);
  expect(numberOf.size).toBe(0);
  expect(sourceMarks(uncited.learn.lead[0]!.cite, numberOf)).toEqual([]);
});
