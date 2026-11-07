import { expect, test } from 'vitest';
import {
  countUnitWords,
  countWords,
  estimateMinutes,
  estimateUnitMinutes,
  MAX_MINUTES,
  MINUTES_PER_STEP,
  PRACTICE_MINUTES,
  PRACTICE_MINUTES_PER_UNIT,
  WARN_MINUTES,
  WORDS_PER_MINUTE,
} from './estimate';
import { lessonSchema, type Lesson, type Unit } from './schema';
import { makeLesson, makeUnit } from './test-fixtures';

/** Shape-checked only: the estimate reads a Lesson, and these tests break the limits on purpose. */
const parse = (input: ReturnType<typeof makeLesson>): Lesson => lessonSchema.parse(input);
const w = (n: number) => 'w '.repeat(n).trim();

/**
 * A unit with `steps` Watch steps whose counted words total exactly `total`:
 * every counted field holds one word and the overview description the rest.
 */
function unitWith(total: number, steps: number, id = 'u'): Unit {
  const unit = parse(makeLesson({ units: [makeUnit(id)] })).units[0]!;
  const template = unit.steps[0]!;
  unit.steps = Array.from({ length: steps }, (_, i) => ({ ...structuredClone(template), id: `s${i}` }));
  unit.overview.hook = w(1);
  for (const step of unit.steps) step.narrative = w(1);
  unit.learn.lead = w(1);
  unit.learn.terms = unit.learn.terms.map(() => ({ idea: w(1), name: w(1) }));
  unit.learn.pattern.note = w(1);
  unit.learn.why = w(1);
  for (const q of unit.practice) {
    q.prompt = w(1);
    q.options = q.options.map(() => ({ text: w(1), feedback: w(1) }));
  }
  unit.overview.description = '';
  unit.overview.description = w(total - countUnitWords(unit));
  return unit;
}

test('the constants', () => {
  expect([WORDS_PER_MINUTE, MINUTES_PER_STEP, PRACTICE_MINUTES, PRACTICE_MINUTES_PER_UNIT, MAX_MINUTES, WARN_MINUTES]).toEqual([
    200, 0.5, 1, 0.5, 15, 12,
  ]);
});

test('countWords counts whitespace-separated tokens', () => {
  expect(countWords('')).toBe(0);
  expect(countWords('   \n\t ')).toBe(0);
  expect(countWords('one')).toBe(1);
  expect(countWords('  two   words\nand\tmore ')).toBe(4);
});

test('countWords ignores ** markers', () => expect(countWords('a **Discover** b.')).toBe(3));

test('a ** marker on its own is not a word', () => expect(countWords('a ** b **')).toBe(2));

// FIGS/minutes.mjs, the spec's method, turns each tag into a space, so the punctuation after a bold term is a word.
test('a ** marker counts as a space, as FIGS/minutes.mjs counts a tag', () => expect(countWords('**client**,')).toBe(2));

test('countUnitWords counts exactly the read fields', () => {
  const unit = parse(makeLesson()).units[0]!;
  const fifty = w(50);

  // Read: one word in each.
  unit.overview.hook = w(1);
  unit.overview.description = w(1);
  for (const step of unit.steps) step.narrative = w(1);
  unit.learn.lead = w(1);
  unit.learn.terms = [
    { idea: w(1), name: w(1) },
    { idea: w(1), name: w(1) },
    { idea: w(1), name: w(1) },
  ];
  unit.learn.pattern.note = w(1);
  unit.learn.why = w(1);
  for (const q of unit.practice) {
    q.prompt = w(1);
    q.options = q.options.map(() => ({ text: w(1), feedback: w(1) }));
  }

  // Not read: titles, subs, Go deeper, facts, labels and the log.
  unit.name = fifty;
  unit.fullName = fifty;
  unit.purpose = fifty;
  unit.references[0]!.label = fifty;
  unit.scene.title = fifty;
  unit.scene.log.idle = fifty;
  unit.overview.facts[0]!.value = fifty;
  for (const step of unit.steps) {
    step.title = fifty;
    step.sub = fifty;
    step.deep = fifty;
    step.facts[0]!.value = fifty;
    step.idle = fifty;
    step.status = fifty;
    for (const e of step.events) if (e.type !== 'table') e.plain = fifty;
  }
  unit.learn.pattern.names = [fifty, fifty];
  unit.learn.deep = fifty;
  unit.learn.facts[0]!.value = fifty;

  const options = unit.practice.reduce((n, q) => n + q.options.length, 0);
  // hook, description, five narratives, lead, 3 × (idea + name), note, why, then each question and its options.
  const expected = 2 + 5 + 1 + 6 + 2 + unit.practice.length + 2 * options;
  expect(countUnitWords(unit)).toBe(expected);
});

test('one unit: ceil(words/200 + 0.5 × steps + 1)', () => {
  const unit = unitWith(816, 5);
  expect(countUnitWords(unit)).toBe(816);
  const lesson: Lesson = { ...parse(makeLesson()), units: [unit] };
  // 816 / 200 + 2.5 + 1 = 7.58
  expect(estimateMinutes(lesson)).toBe(8);
  expect(estimateUnitMinutes(unit, PRACTICE_MINUTES)).toBe(8);
});

test('a unit with half a minute of Practice', () => {
  // 600 / 200 + 2 + 0.5 = 5.5
  expect(estimateUnitMinutes(unitWith(600, 4), PRACTICE_MINUTES_PER_UNIT)).toBe(6);
  // 700 / 200 + 2 + 0.5 = 6: a whole number stays as it is.
  expect(estimateUnitMinutes(unitWith(700, 4), PRACTICE_MINUTES_PER_UNIT)).toBe(6);
});

test('many units: ceil(Σ/200 + 0.5 × Σsteps + 0.5 × units)', () => {
  // 14 units, 78 steps (eight of 6 and six of 5), 9829 words: lesson 1's numbers.
  const units = Array.from({ length: 14 }, (_, i) => unitWith(i === 0 ? 703 : 702, i < 8 ? 6 : 5, `u${i}`));
  expect(units.reduce((n, u) => n + countUnitWords(u), 0)).toBe(9829);
  expect(units.reduce((n, u) => n + u.steps.length, 0)).toBe(78);
  const lesson: Lesson = { ...parse(makeLesson()), units };
  // 49.145 + 39 + 7 = 95.145
  expect(estimateMinutes(lesson)).toBe(96);
  // Rounding each unit up first would overstate it.
  expect(units.reduce((n, u) => n + estimateUnitMinutes(u, PRACTICE_MINUTES_PER_UNIT), 0)).toBeGreaterThan(96);
});
