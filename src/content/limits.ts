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

const LIMIT_NAMES = limitsSchema.keyof().options;
const WORD_LIMITS = ['narrativeWords', 'hookWords', 'deepWords'] as const;
type WordLimit = (typeof WORD_LIMITS)[number];
type RangeLimit = Exclude<LimitName, WordLimit>;
const RANGE_LIMITS: RangeLimit[] = LIMIT_NAMES.filter((name): name is RangeLimit => !isWordLimit(name));

function isWordLimit(limit: LimitName): limit is WordLimit {
  return (WORD_LIMITS as readonly string[]).includes(limit);
}

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
/** A range limit is checked unless an override has crossed it. */
const fails = (skip: ReadonlySet<LimitName>, name: RangeLimit, n: number, limits: Limits): boolean => !skip.has(name) && !inRange(n, limits[name]);
const rangeText = (r: { min: number; max: number }): string => (r.min === r.max ? `exactly ${r.max}` : `${r.min}–${r.max}`);

/** Words in one Go deeper block, its paragraphs together. */
const blockWords = (paragraphs: { text: string }[]): number => paragraphs.reduce((sum, p) => sum + countWords(p.text), 0);

/** Every unit against `limits` as they stand, as readable issues. */
function unitIssues(lesson: Lesson, limits: Limits, skip: ReadonlySet<LimitName> = new Set()): string[] {
  const issues: string[] = [];
  for (const u of lesson.units) {
    const at = `Unit "${u.id}"`;
    if (fails(skip, 'steps', u.steps.length, limits)) {
      issues.push(`${at}: needs ${rangeText(limits.steps)} steps; this one has ${u.steps.length} (steps).`);
    }
    for (const step of u.steps) {
      const here = `${at}: Step "${step.id}"`;
      if (fails(skip, 'factsPerStep', step.facts.length, limits)) {
        issues.push(`${here} needs ${rangeText(limits.factsPerStep)} facts; it has ${step.facts.length} (factsPerStep).`);
      }
      const narrative = countWords(step.narrative);
      if (narrative > limits.narrativeWords) {
        issues.push(`${here} narrative is ${narrative} words; the limit is ${limits.narrativeWords} (narrativeWords).`);
      }
      const deep = blockWords(step.deep);
      if (deep > limits.deepWords) issues.push(`${here} Go deeper is ${deep} words; the limit is ${limits.deepWords} (deepWords).`);
    }

    const hook = countWords(u.overview.hook);
    if (hook > limits.hookWords) issues.push(`${at}: the overview hook is ${hook} words; the limit is ${limits.hookWords} (hookWords).`);

    if (fails(skip, 'practiceQuestions', u.practice.length, limits)) {
      issues.push(`${at}: Practice needs ${rangeText(limits.practiceQuestions)} questions; this unit has ${u.practice.length} (practiceQuestions).`);
    }
    for (const q of u.practice) {
      if (fails(skip, 'optionsPerQuestion', q.options.length, limits)) {
        issues.push(`${at}: Question "${q.id}" needs ${rangeText(limits.optionsPerQuestion)} options; it has ${q.options.length} (optionsPerQuestion).`);
      }
    }

    if (fails(skip, 'learnTerms', u.learn.terms.length, limits)) {
      issues.push(`${at}: Learn needs ${rangeText(limits.learnTerms)} terms; this unit has ${u.learn.terms.length} (learnTerms).`);
    }
    if (fails(skip, 'patternNames', u.learn.pattern.names.length, limits)) {
      issues.push(`${at}: Learn's pattern needs ${rangeText(limits.patternNames)} names; this unit has ${u.learn.pattern.names.length} (patternNames).`);
    }
    const learnDeep = blockWords(u.learn.deep);
    if (learnDeep > limits.deepWords) {
      issues.push(`${at}: Learn's Go deeper is ${learnDeep} words; the limit is ${limits.deepWords} (deepWords).`);
    }
  }
  return issues;
}

/**
 * Every unit against the limits after the lesson's own overrides, as readable issues (empty when it fits). An override
 * that leaves a range with its minimum above its maximum is reported alone, and that limit is not checked further. Go
 * deeper counts the words of one block's paragraphs together. Each message ends with the limit's key, which an override names.
 */
export function checkLimits(lesson: Lesson, limits: Limits): string[] {
  const applied = applyOverrides(limits, lesson.overrides);
  const issues: string[] = [];
  const crossed = new Set<LimitName>();
  for (const name of RANGE_LIMITS) {
    if (applied[name].min > applied[name].max) {
      crossed.add(name);
      issues.push(`Lesson "${lesson.slug}": its ${name} override leaves a minimum of ${applied[name].min} above the maximum of ${applied[name].max}.`);
    }
  }
  return [...issues, ...unitIssues(lesson, applied, crossed)];
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
