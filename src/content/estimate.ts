import type { Lesson } from './schema';

/** Reading speed the estimate assumes. */
export const WORDS_PER_MINUTE = 200;
/** Time to look at a step's picture besides reading it. */
export const MINUTES_PER_STEP = 0.5;
/** Fixed time for the Try it step. */
export const TRY_IT_MINUTES = 2;
/** Fixed time for Check yourself. */
export const CHECK_MINUTES = 1;
/** A lesson longer than this fails the build. */
export const MAX_MINUTES = 15;
/** A lesson longer than this builds, but warns. */
export const WARN_MINUTES = 12;

/** Words are whitespace-separated tokens. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

/**
 * The words a learner reads: the overview hook and description, every step
 * narrative, the Try it prompt and explanations, every question with its
 * options and explanation, and the takeaways. Titles, labels, fact tables and
 * summaries are glanced at, not read, so they are not counted.
 */
export function countLessonWords(l: Lesson): number {
  const parts: string[] = [l.overview.hook, l.overview.description];
  for (const step of l.steps) parts.push(step.narrative);

  parts.push(l.tryIt.prompt);
  if (l.tryIt.mode === 'choices') for (const choice of l.tryIt.choices) parts.push(choice.explanation);
  else parts.push(l.tryIt.explanation);

  for (const q of l.check) parts.push(q.prompt, ...q.options, q.explanation);
  parts.push(...l.recap.takeaways);

  return parts.reduce((total, part) => total + countWords(part), 0);
}

/** Words ÷ 200, plus 0.5 per step, 2 for Try it and 1 for Check yourself, rounded up. */
export function estimateMinutes(l: Lesson): number {
  const words = countLessonWords(l);
  return Math.ceil(words / WORDS_PER_MINUTE + MINUTES_PER_STEP * l.steps.length + TRY_IT_MINUTES + CHECK_MINUTES);
}
