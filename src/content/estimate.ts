import type { Lesson, Unit } from './schema';

/** Reading speed the estimate assumes. */
export const WORDS_PER_MINUTE = 200;
/** Time to watch a step's scene besides reading it. */
export const MINUTES_PER_STEP = 0.5;
/** Fixed time for Practice in a lesson of one unit. */
export const PRACTICE_MINUTES = 1;
/** Fixed time for each unit's Practice in a lesson of many units (two questions each). */
export const PRACTICE_MINUTES_PER_UNIT = 0.5;
/** A lesson (or, in a lesson of many units, a unit) longer than this fails the build. */
export const MAX_MINUTES = 15;
/** A one-unit lesson longer than this builds, but warns. */
export const WARN_MINUTES = 12;

/**
 * Words are whitespace-separated tokens. `**` marks a key term and is not a
 * word: it counts as a space, as FIGS/minutes.mjs (the spec's method) counts a
 * tag, so the punctuation after a key term ("**client**,") is a word of its own.
 */
export function countWords(text: string): number {
  const trimmed = text.replaceAll('**', ' ').trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
}

/**
 * The words a learner reads in a unit: the overview hook and description,
 * every step's narrative, Learn's lead, each term's idea and name, the
 * pattern note and why, and every question with its options and feedback.
 * Titles, sub lines, Go deeper, facts and labels are glanced at, not read, so
 * they are not counted.
 */
export function countUnitWords(u: Unit): number {
  const parts: string[] = [u.overview.hook, u.overview.description];
  for (const step of u.steps) parts.push(step.narrative);
  parts.push(u.learn.lead);
  for (const term of u.learn.terms) parts.push(term.idea, term.name);
  parts.push(u.learn.pattern.note, u.learn.why);
  for (const q of u.practice) {
    parts.push(q.prompt);
    for (const option of q.options) parts.push(option.text, option.feedback);
  }
  return parts.reduce((total, part) => total + countWords(part), 0);
}

/** Words ÷ 200, plus 0.5 per Watch step, plus `practiceMinutes`, rounded up. */
export function estimateUnitMinutes(u: Unit, practiceMinutes: number): number {
  return Math.ceil(countUnitWords(u) / WORDS_PER_MINUTE + MINUTES_PER_STEP * u.steps.length + practiceMinutes);
}

/**
 * A one-unit lesson: its unit with 1 minute of Practice. A lesson of many
 * units adds every unit's words and steps first, with half a minute of
 * Practice per unit, and rounds up once.
 */
export function estimateMinutes(l: Lesson): number {
  const [only] = l.units;
  if (l.units.length === 1 && only !== undefined) return estimateUnitMinutes(only, PRACTICE_MINUTES);
  const words = l.units.reduce((sum, u) => sum + countUnitWords(u), 0);
  const steps = l.units.reduce((sum, u) => sum + u.steps.length, 0);
  return Math.ceil(words / WORDS_PER_MINUTE + MINUTES_PER_STEP * steps + PRACTICE_MINUTES_PER_UNIT * l.units.length);
}
