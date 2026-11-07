import { expect, test } from 'vitest';
import { applyOverrides, checkLimits, overrideSchema, unneededOverrides } from './limits';
import type { LegacyLessonInput, LegacyUnitInput } from './legacy';
import { FIXTURE_LIMITS, liftedFixture, makeLesson } from './test-fixtures';

// The numeric limits a track sets, checked on a lifted fixture: the shape every lesson reaches the registry in.

const unit = (l: LegacyLessonInput): LegacyUnitInput => l.units[0]!;
const words = (n: number) => 'word '.repeat(n).trim();
const issuesOf = (l: LegacyLessonInput) => checkLimits(liftedFixture(l), FIXTURE_LIMITS);
const joined = (l: LegacyLessonInput) => issuesOf(l).join('\n');

test('the fixture fits the limits', () => {
  expect(issuesOf(makeLesson())).toEqual([]);
});

test('a unit needs 4–6 steps', () => {
  const four = makeLesson();
  unit(four).steps = unit(four).steps.slice(0, 4);
  expect(issuesOf(four)).toEqual([]);
  const three = makeLesson();
  unit(three).steps = unit(three).steps.slice(0, 3);
  expect(joined(three)).toMatch(/4–6 steps; this one has 3/);
  const seven = makeLesson();
  const extra = (n: number) => ({ ...structuredClone(unit(seven).steps[4]!), id: `extra${n}`, events: [] });
  unit(seven).steps.push(extra(6));
  expect(issuesOf(seven)).toEqual([]);
  unit(seven).steps.push(extra(7));
  expect(joined(seven)).toMatch(/4–6 steps; this one has 7/);
});

test('a step needs 2–4 facts', () => {
  const few = makeLesson();
  unit(few).steps[0]!.facts = [{ label: 'One', value: '1' }];
  expect(joined(few)).toMatch(/Step "hello" needs 2–4 facts/);
  const many = makeLesson();
  unit(many).steps[0]!.facts = Array.from({ length: 5 }, (_, i) => ({ label: `F${i}`, value: `${i}` }));
  expect(joined(many)).toMatch(/2–4 facts/);
});

test('narratives stop at 120 words and the hook at 80, ** markers aside', () => {
  const ok = makeLesson();
  unit(ok).steps[0]!.narrative = `**${words(120)}**`;
  unit(ok).overview.hook = words(80);
  expect(issuesOf(ok)).toEqual([]);
  const long = makeLesson();
  unit(long).steps[0]!.narrative = words(121);
  unit(long).overview.hook = words(81);
  expect(joined(long)).toMatch(/121 words; the limit is 120/);
  expect(joined(long)).toMatch(/81 words; the limit is 80/);
});

test('a unit has 2–3 Practice questions', () => {
  const one = makeLesson();
  unit(one).practice = unit(one).practice.slice(0, 1);
  expect(joined(one)).toMatch(/2–3 questions/);
  const three = makeLesson();
  unit(three).practice.push({ ...structuredClone(unit(three).practice[0]!), id: 'q3' });
  expect(issuesOf(three)).toEqual([]);
  unit(three).practice.push({ ...structuredClone(unit(three).practice[0]!), id: 'q4' });
  expect(joined(three)).toMatch(/2–3 questions/);
});

test('a question has 2–4 options', () => {
  const few = makeLesson();
  unit(few).practice[1]!.options = unit(few).practice[1]!.options.slice(0, 1);
  expect(joined(few)).toMatch(/Question "q2" needs 2–4 options/);
  const many = makeLesson();
  const option = unit(many).practice[0]!.options[0]!;
  unit(many).practice[0]!.options = [option, option, option, option, option];
  expect(joined(many)).toMatch(/2–4 options/);
});

test('Learn has 3–10 terms and 2–6 pattern names', () => {
  const few = makeLesson();
  unit(few).learn.terms = unit(few).learn.terms.slice(0, 2);
  unit(few).learn.pattern.names = ['Only one'];
  expect(joined(few)).toMatch(/3–10 terms/);
  expect(joined(few)).toMatch(/2–6 names/);
  const many = makeLesson();
  const term = unit(many).learn.terms[0]!;
  unit(many).learn.terms = Array.from({ length: 11 }, () => term);
  unit(many).learn.pattern.names = Array.from({ length: 7 }, (_, i) => `Name ${i}`);
  expect(joined(many)).toMatch(/3–10 terms/);
  expect(joined(many)).toMatch(/2–6 names/);
});

test('every limit comes from the track it is checked against', () => {
  const strict = { ...FIXTURE_LIMITS, steps: { min: 5, max: 5 }, narrativeWords: 10 };
  const issues = checkLimits(liftedFixture(), strict);
  expect(issues.join('\n')).toMatch(/narrative is \d+ words; the limit is 10/);
  expect(checkLimits(liftedFixture(), { ...strict, steps: { min: 6, max: 6 } }).join('\n')).toMatch(/exactly 6 steps; this one has 5/);
});

test('a 130-word narrative fails at 120 and passes with a reasoned override', () => {
  const l = makeLesson();
  unit(l).steps[0]!.narrative = words(130);
  const long = liftedFixture(l);
  expect(checkLimits(long, FIXTURE_LIMITS)).toEqual([expect.stringMatching(/narrative is 130 words; the limit is 120/)]);
  const reasoned = { ...long, overrides: [{ limit: 'narrativeWords' as const, max: 140, reason: 'Names all four DHCP messages in one step.' }] };
  expect(checkLimits(reasoned, FIXTURE_LIMITS)).toEqual([]);
});

test('a range override sets the bounds it names and leaves the other', () => {
  const l = makeLesson();
  const u = unit(l);
  u.steps = u.steps.slice(0, 3);
  const three = liftedFixture(l);
  const lowered = { ...three, overrides: [{ limit: 'steps' as const, min: 3, reason: 'A short lesson on a single idea.' }] };
  expect(checkLimits(lowered, FIXTURE_LIMITS)).toEqual([]);
  expect(applyOverrides(FIXTURE_LIMITS, lowered.overrides).steps).toEqual({ min: 3, max: 6 });
  expect(FIXTURE_LIMITS.steps).toEqual({ min: 4, max: 6 });
});

test('Go deeper counts a block’s paragraphs together', () => {
  const lesson = liftedFixture();
  const step = lesson.units[0]!.steps[0]!;
  step.deep = [{ text: words(50), cite: [] }, { text: words(50), cite: [] }];
  expect(checkLimits(lesson, FIXTURE_LIMITS)).toEqual([expect.stringMatching(/Step "hello" Go deeper is 100 words; the limit is 90/)]);
  step.deep = [{ text: words(45), cite: [] }, { text: words(45), cite: [] }];
  expect(checkLimits(lesson, FIXTURE_LIMITS)).toEqual([]);
  lesson.units[0]!.learn.deep = [
    { id: 'a', text: words(50), cite: [] },
    { id: 'b', text: words(50), cite: [] },
  ];
  expect(checkLimits(lesson, FIXTURE_LIMITS)).toEqual([expect.stringMatching(/Learn's Go deeper is 100 words; the limit is 90/)]);
});

test('an override needs a one-line reason, and word limits take only a max', () => {
  expect(overrideSchema.safeParse({ limit: 'hookWords', max: 100, reason: 'Two\nlines' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'hookWords', max: 100, reason: 'Two\rlines' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'hookWords', max: 100, reason: 'One line.\n' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'hookWords', min: 10, reason: 'x' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'hookWords', min: 10, max: 100, reason: 'x' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'steps', max: 8, reason: '' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'steps', max: 8, reason: '   ' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'steps', reason: 'Neither bound.' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'nope', max: 8, reason: 'Unknown limit.' }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'steps', max: 8, reason: 'x'.repeat(161) }).success).toBe(false);
  expect(overrideSchema.safeParse({ limit: 'steps', max: 8, reason: ` ${'x'.repeat(160)} ` })).toMatchObject({
    success: true,
    data: { reason: 'x'.repeat(160) },
  });
});

test('an override the lesson does not need is reported', () => {
  const short = liftedFixture();
  const idle = { ...short, overrides: [{ limit: 'steps' as const, max: 8, reason: 'Room to grow.' }] };
  expect(unneededOverrides(idle, [FIXTURE_LIMITS])).toEqual([expect.stringMatching(/"fixture-lesson".*steps.*not needed/)]);

  const l = makeLesson();
  unit(l).steps[0]!.narrative = words(130);
  const needed = { ...liftedFixture(l), overrides: [{ limit: 'narrativeWords' as const, max: 140, reason: 'Names all four messages in one step.' }] };
  expect(unneededOverrides(needed, [FIXTURE_LIMITS])).toEqual([]);
  // Needed on one track is enough, but a roomier track alone would not need it.
  expect(unneededOverrides(needed, [{ ...FIXTURE_LIMITS, narrativeWords: 200 }])).toEqual([expect.stringMatching(/narrativeWords.*not needed/)]);
  expect(unneededOverrides(needed, [{ ...FIXTURE_LIMITS, narrativeWords: 200 }, FIXTURE_LIMITS])).toEqual([]);
});

test('two overrides for the same limit are reported once, naming the limit', () => {
  const doubled = {
    ...liftedFixture(),
    overrides: [
      { limit: 'hookWords' as const, max: 90, reason: 'First reason.' },
      { limit: 'hookWords' as const, max: 95, reason: 'Second reason.' },
    ],
  };
  expect(checkLimits(doubled, FIXTURE_LIMITS)).toEqual([expect.stringMatching(/"fixture-lesson".*hookWords.*more than once/)]);
});

test('an override that puts a minimum above its maximum is reported', () => {
  const crossed = { ...liftedFixture(), overrides: [{ limit: 'steps' as const, min: 7, reason: 'Wrong on purpose.' }] };
  expect(checkLimits(crossed, FIXTURE_LIMITS).join('\n')).toMatch(/steps override leaves a minimum of 7 above the maximum of 6/);
});
