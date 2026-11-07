import { z } from 'zod';
import type { Lesson } from './schema';
import { countWords } from './words';

/**
 * The numeric content limits a track sets for its lessons (direction doc §4.4), and the reasoned overrides a lesson
 * may carry. A track file holds the defaults; a lesson that needs more room says why in one line.
 */

const range = z
  .strictObject({ min: z.int().min(0), max: z.int().min(1) })
  .refine((r) => r.min <= r.max, 'min must not exceed max');

export const limitsSchema = z.strictObject({
  /** Watch steps in a unit. */
  steps: range,
  /** Facts beside one Watch step. */
  factsPerStep: range,
  /** Practice questions in a unit. */
  practiceQuestions: range,
  optionsPerQuestion: range,
  learnTerms: range,
  patternNames: range,
  /** Words in one Watch step's narrative. */
  narrativeWords: z.int().min(1),
  /** Words in a unit's overview hook. */
  hookWords: z.int().min(1),
  /** Words in one Go deeper block: the paragraphs of a block count together. */
  deepWords: z.int().min(1),
});
export type Limits = z.infer<typeof limitsSchema>;
export type LimitName = keyof Limits;

const RANGE_LIMITS = ['steps', 'factsPerStep', 'practiceQuestions', 'optionsPerQuestion', 'learnTerms', 'patternNames'] as const;
const WORD_LIMITS = ['narrativeWords', 'hookWords', 'deepWords'] as const;
const LIMIT_NAMES = [...RANGE_LIMITS, ...WORD_LIMITS] as const;

const isWordLimit = (limit: LimitName): limit is (typeof WORD_LIMITS)[number] => (WORD_LIMITS as readonly string[]).includes(limit);

/** What a lesson says to leave a track's default: the limit, the new bound or bounds, and one line of why. */
export const overrideSchema = z
  .strictObject({
    limit: z.enum(LIMIT_NAMES),
    min: z.int().min(0).optional(),
    max: z.int().min(1).optional(),
    reason: z
      .string()
      .regex(/^[^\r\n]*$/, 'must be one line')
      .pipe(z.string().trim().min(1, 'must not be empty').max(160, 'must be at most 160 characters')),
  })
  .superRefine((o, ctx) => {
    if (o.min === undefined && o.max === undefined) ctx.addIssue({ code: 'custom', message: 'needs a min or a max' });
    if (isWordLimit(o.limit) && o.min !== undefined) {
      ctx.addIssue({ code: 'custom', path: ['min'], message: `${o.limit} is a ceiling, so it takes only a max` });
    }
  });
export type Override = z.infer<typeof overrideSchema>;

/** The limits with each override's bounds in place of the track's. */
export function applyOverrides(limits: Limits, overrides: Override[]): Limits {
  const result: Limits = structuredClone(limits);
  for (const o of overrides) {
    if (isWordLimit(o.limit)) {
      if (o.max !== undefined) result[o.limit] = o.max;
    } else {
      const bounds = result[o.limit];
      if (o.min !== undefined) bounds.min = o.min;
      if (o.max !== undefined) bounds.max = o.max;
    }
  }
  return result;
}

const inRange = (n: number, r: { min: number; max: number }): boolean => n >= r.min && n <= r.max;
const rangeText = (r: { min: number; max: number }): string => (r.min === r.max ? `exactly ${r.max}` : `${r.min}–${r.max}`);

/** Words in one Go deeper block, its paragraphs together. */
const blockWords = (paragraphs: { text: string }[]): number => paragraphs.reduce((sum, p) => sum + countWords(p.text), 0);

/** Every unit against `limits` as they stand, as readable issues. */
function unitIssues(lesson: Lesson, limits: Limits): string[] {
  const issues: string[] = [];
  for (const u of lesson.units) {
    const at = `Unit "${u.id}"`;
    if (!inRange(u.steps.length, limits.steps)) {
      issues.push(`${at}: needs ${rangeText(limits.steps)} steps; this one has ${u.steps.length}.`);
    }
    for (const step of u.steps) {
      const here = `${at}: Step "${step.id}"`;
      if (!inRange(step.facts.length, limits.factsPerStep)) {
        issues.push(`${here} needs ${rangeText(limits.factsPerStep)} facts; it has ${step.facts.length}.`);
      }
      const narrative = countWords(step.narrative);
      if (narrative > limits.narrativeWords) {
        issues.push(`${here} narrative is ${narrative} words; the limit is ${limits.narrativeWords}.`);
      }
      const deep = blockWords(step.deep);
      if (deep > limits.deepWords) issues.push(`${here} Go deeper is ${deep} words; the limit is ${limits.deepWords}.`);
    }

    const hook = countWords(u.overview.hook);
    if (hook > limits.hookWords) issues.push(`${at}: the overview hook is ${hook} words; the limit is ${limits.hookWords}.`);

    if (!inRange(u.practice.length, limits.practiceQuestions)) {
      issues.push(`${at}: Practice needs ${rangeText(limits.practiceQuestions)} questions; this unit has ${u.practice.length}.`);
    }
    for (const q of u.practice) {
      if (!inRange(q.options.length, limits.optionsPerQuestion)) {
        issues.push(`${at}: Question "${q.id}" needs ${rangeText(limits.optionsPerQuestion)} options; it has ${q.options.length}.`);
      }
    }

    if (!inRange(u.learn.terms.length, limits.learnTerms)) {
      issues.push(`${at}: Learn needs ${rangeText(limits.learnTerms)} terms; this unit has ${u.learn.terms.length}.`);
    }
    if (!inRange(u.learn.pattern.names.length, limits.patternNames)) {
      issues.push(`${at}: Learn's pattern needs ${rangeText(limits.patternNames)} names; this unit has ${u.learn.pattern.names.length}.`);
    }
    const learnDeep = blockWords(u.learn.deep);
    if (learnDeep > limits.deepWords) {
      issues.push(`${at}: Learn's Go deeper is ${learnDeep} words; the limit is ${limits.deepWords}.`);
    }
  }
  return issues;
}

/**
 * Every unit against the limits after the lesson's own overrides, as readable issues (empty when it fits). Also
 * reports a limit overridden twice, and an override that leaves a range with its minimum above its maximum. Go deeper
 * counts the words of one block's paragraphs together.
 */
export function checkLimits(lesson: Lesson, limits: Limits): string[] {
  const issues: string[] = [];
  const seen = new Set<LimitName>();
  const repeated = new Set<LimitName>();
  for (const o of lesson.overrides) (seen.has(o.limit) ? repeated : seen).add(o.limit);
  for (const limit of repeated) {
    issues.push(`Lesson "${lesson.slug}" overrides the ${limit} limit more than once; keep one override, with one reason.`);
  }

  const applied = applyOverrides(limits, lesson.overrides);
  for (const name of RANGE_LIMITS) {
    if (applied[name].min > applied[name].max) {
      issues.push(`Lesson "${lesson.slug}": its ${name} override leaves a minimum of ${applied[name].min} above the maximum of ${applied[name].max}.`);
    }
  }
  return [...issues, ...unitIssues(lesson, applied)];
}

/** Overrides the lesson would still fit every one of these tracks' limits without, as messages. */
export function unneededOverrides(lesson: Lesson, limitsOfTracks: Limits[]): string[] {
  return lesson.overrides
    .filter((o) => {
      const others = lesson.overrides.filter((other) => other !== o);
      return limitsOfTracks.every((limits) => unitIssues(lesson, applyOverrides(limits, others)).length === 0);
    })
    .map((o) => `Lesson "${lesson.slug}": the ${o.limit} override is not needed, because the lesson fits without it; remove it.`);
}
