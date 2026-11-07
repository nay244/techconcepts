import { z } from 'zod';
import { checkStructure, LessonValidationError, markDefined, parseLessonShape } from './define';
import { text } from './primitives';
import {
  certTagSchema,
  factSchema,
  figureIdSchema,
  lessonSchema,
  sceneEventSchema,
  slugSchema,
  sourceSchema,
  unitSceneSchema,
  unitSchema,
  type Lesson,
  type Unit,
} from './schema';

/**
 * The legacy path: the four ready lessons as they were written before citations, in today's authoring shape, with
 * today's checks. Each is lifted into the runtime (cited) shape with empty citations and no backing, so the site
 * shows it exactly as before. Every other lesson is written in the cited shape.
 */

/** The ready lessons written before citations. Closed: §10 tasks 4–6 remove each slug as it migrates; task 6 deletes this file. */
export const LEGACY_LESSONS = ['how-the-internet-works', 'subnetting', 'dhcp', 'firewalls'] as const;

// The parts of today's authoring shape that the cited shape changes. Everything else (the scene, its panels and log,
// the events and packets) is the runtime schema's own.

const legacyStepSchema = z.strictObject({
  id: text,
  /** A Title Case technical term, such as 'DHCP Discover'. */
  title: text,
  /** The same step in plain words. */
  sub: text,
  narrative: text,
  /** Go deeper: exam-level detail, closed by default. */
  deep: text,
  facts: z.array(factSchema),
  events: z.array(sceneEventSchema),
  status: text.optional(),
  /** What the log says while it is empty at this step. */
  idle: text.optional(),
});

const legacyLearnSchema = z.strictObject({
  lead: text,
  /** Everyday idea first, then its name. */
  terms: z.array(z.strictObject({ idea: text, name: text })),
  /** The steps by their technical names, and a note on the pattern. */
  pattern: z.strictObject({ names: z.array(text), note: text }),
  why: text,
  deep: text,
  facts: z.array(factSchema),
});

const legacyQuestionSchema = z.strictObject({
  id: text,
  prompt: text,
  options: z.array(z.strictObject({ text, feedback: text })),
  /** Index of the right option, from 0. */
  answer: z.number().int(),
});

const legacyUnitSchema = z.strictObject({
  id: slugSchema,
  name: text,
  fullName: text,
  /** One line on what the unit is for (lesson 1's protocol rows). */
  purpose: text,
  /** Lesson 1's outline filters. */
  group: unitSchema.shape.group,
  /** OSI layers the unit touches, 1 (physical) to 7 (application). May be empty. */
  osiLayers: z.array(z.number().int().min(1).max(7)),
  /** At least one per unit (`checkLegacyRules`). */
  references: z.array(sourceSchema),
  scene: unitSceneSchema,
  overview: z.strictObject({ hook: text, description: text, facts: z.array(factSchema) }),
  steps: z.array(legacyStepSchema),
  learn: legacyLearnSchema,
  practice: z.array(legacyQuestionSchema),
});

/** Today's authoring shape: Learn's lead, why and Go deeper and each step's Go deeper as one string, OSI layers as a list. */
export const legacyLessonSchema = z.strictObject({
  slug: slugSchema,
  title: text,
  subtitle: text,
  level: lessonSchema.shape.level,
  certTags: z.array(certTagSchema),
  summary: text,
  figure: figureIdSchema,
  units: z.array(legacyUnitSchema).min(1),
});

/** What a legacy lesson file writes: a scene's `layers`, `labels` and `start` may be left out. */
export type LegacyLessonInput = z.input<typeof legacyLessonSchema>;
export type LegacyUnitInput = LegacyLessonInput['units'][number];

type LegacyLesson = z.output<typeof legacyLessonSchema>;
type LegacyUnit = LegacyLesson['units'][number];

function liftUnit(u: LegacyUnit): Unit {
  const { osiLayers, overview, steps, learn, practice, ...rest } = u;
  return {
    ...rest,
    osi: osiLayers.length === 0 ? 'spans' : { layers: osiLayers, cite: [] },
    overview,
    steps: steps.map(({ deep, ...step }) => ({ ...step, deep: [{ text: deep, cite: [] }] })),
    learn: {
      lead: [{ id: 'lead', text: learn.lead, cite: [] }],
      terms: learn.terms.map((term, i) => ({ id: `term-${i + 1}`, ...term, cite: [] })),
      pattern: { id: 'pattern', ...learn.pattern, cite: [] },
      why: [{ id: 'why', text: learn.why, cite: [] }],
      deep: [{ id: 'deep', text: learn.deep, cite: [] }],
      facts: learn.facts.map((fact, i) => ({ ...fact, id: `fact-${i + 1}`, cite: [] })),
    },
    practice: practice.map((q) => ({ ...q, options: q.options.map((option) => ({ ...option, cite: [] })) })),
  };
}

/**
 * A parsed legacy lesson in the runtime shape, every word as written: each string of Learn and each step's Go deeper
 * becomes a one-item list, Learn's parts get ids, citation lists are empty, an empty OSI list becomes 'spans', and
 * nothing gets a backing.
 */
export function liftLegacy(parsed: LegacyLesson): Lesson {
  return { ...parsed, units: parsed.units.map(liftUnit), overrides: [], origin: 'legacy' };
}

/**
 * The rules only the legacy path keeps, as readable issues: at least 1 reference per unit, and exactly 2 Practice
 * questions per unit in a lesson of several units. The numeric limits belong to the track the lesson is in
 * (`limits.ts`); the registry checks them.
 */
function checkLegacyRules(lesson: Lesson): string[] {
  const issues: string[] = [];
  const multiUnit = lesson.units.length > 1;
  for (const u of lesson.units) {
    const at = `Unit "${u.id}"`;
    if (u.references.length < 1) issues.push(`${at}: a unit needs at least 1 reference.`);
    if (multiUnit && u.practice.length !== 2) {
      issues.push(`${at}: in a lesson of many units, Practice needs exactly 2 questions per unit; this one has ${u.practice.length}.`);
    }
  }
  return issues;
}

/**
 * Checks a legacy lesson and returns it lifted: its shape first (alone, as `parseLessonShape` reports it), then the
 * structural rules every lesson keeps, then the legacy-only rules. Throws one LessonValidationError listing every problem.
 */
export function validateLegacyLesson(input: unknown): Lesson {
  const lesson = liftLegacy(parseLessonShape(legacyLessonSchema, input));
  const issues = [...checkStructure(lesson), ...checkLegacyRules(lesson)];
  if (issues.length > 0) throw new LessonValidationError(issues, lesson.slug);
  return markDefined(lesson);
}

/** The entry point for the ready lessons' files: only a listed slug may use it, and it validates at import, so a bad lesson fails the build. */
export function defineLegacyLesson(input: LegacyLessonInput): Lesson {
  if (!(LEGACY_LESSONS as readonly string[]).includes(input.slug)) {
    throw new LessonValidationError(
      [`"${input.slug}" is not on the legacy list, which is closed: a new lesson is written in the cited shape.`],
      input.slug,
    );
  }
  return validateLegacyLesson(input);
}
