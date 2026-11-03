import { expect, test } from 'vitest';
import { validateLesson } from './define';
import { countLessonWords, countWords, estimateMinutes } from './estimate';
import { fixtureLesson } from './test-fixtures';

const validated = () => validateLesson(fixtureLesson()).lesson;

test('countWords counts whitespace-separated tokens', () => {
  expect(countWords('')).toBe(0);
  expect(countWords('   \n\t ')).toBe(0);
  expect(countWords('one')).toBe(1);
  expect(countWords('  two   words\nand\tmore ')).toBe(4);
  expect(countWords('word '.repeat(121))).toBe(121);
});

// fixed overhead = 0.5×steps + 2 (Try it) + 1 (Check yourself)
test('estimate formula', () => {
  const l = validated();
  const w = countLessonWords(l);
  expect(estimateMinutes(l)).toBe(Math.ceil(w / 200 + 0.5 * l.steps.length + 3));
});

test('estimate rounds up, and grows with steps and words', () => {
  const l = validated();
  const base = estimateMinutes(l);
  l.check[0]!.explanation = 'word '.repeat(400);
  expect(estimateMinutes(l)).toBeGreaterThanOrEqual(base + 2);
  expect(Number.isInteger(estimateMinutes(l))).toBe(true);
});

test('the fixture is a realistic short lesson: 180–280 counted words, 160+ outside check[0]', () => {
  const l = validated();
  const total = countLessonWords(l);
  expect(total).toBeGreaterThanOrEqual(180);
  expect(total).toBeLessThanOrEqual(280);
  expect(total - countWords(l.check[0]!.explanation)).toBeGreaterThanOrEqual(160);
  expect(estimateMinutes(l)).toBeLessThan(12);
});

// Every counted part gets its own word count, so the total can only match if
// each one is included exactly once.
test('countLessonWords counts exactly the prose a learner reads', () => {
  const l = validated();
  if (l.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  const words = (n: number) => 'w '.repeat(n).trim();

  l.overview.hook = words(1);
  l.overview.description = words(2);
  l.steps.forEach((s, i) => (s.narrative = words(i === 0 ? 3 : 4)));
  l.tryIt.prompt = words(5);
  l.tryIt.choices[0]!.explanation = words(6);
  l.tryIt.choices[1]!.explanation = words(7);
  l.check[0]!.prompt = words(8);
  l.check[0]!.options = [words(9), words(10)];
  l.check[0]!.explanation = words(11);
  l.check[1]!.prompt = words(12);
  l.check[1]!.options = [words(13), words(14), words(15)];
  l.check[1]!.explanation = words(16);
  l.recap.takeaways = [words(17), words(18), words(19)];

  // Prose that is not counted: titles, labels, facts, summaries.
  l.title = words(50);
  l.subtitle = words(50);
  l.summary = words(50);
  l.overview.name = words(50);
  l.overview.fullName = words(50);
  l.overview.facts[0]!.value = words(50);
  l.steps[0]!.title = words(50);
  l.steps[0]!.facts[0]!.value = words(50);
  l.tryIt.choices[0]!.label = words(50);

  const narratives = 3 + 4 + 4 + 4;
  const expected = 1 + 2 + narratives + 5 + 6 + 7 + (8 + 9 + 10 + 11) + (12 + 13 + 14 + 15 + 16) + (17 + 18 + 19);
  expect(countLessonWords(l)).toBe(expected);
});

test('a free Try it counts its prompt and its explanation', () => {
  const l = validated();
  const before = countLessonWords(l);
  const choiceWords =
    l.tryIt.mode === 'choices'
      ? countWords(l.tryIt.prompt) + l.tryIt.choices.reduce((n, c) => n + countWords(c.explanation), 0)
      : 0;
  l.tryIt = { mode: 'free', prompt: 'one two three', explanation: 'four five' };
  expect(countLessonWords(l)).toBe(before - choiceWords + 5);
});
