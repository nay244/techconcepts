import { parseIPv4 } from '../engine/net/ipv4';
import { countWords, estimateMinutes, MAX_MINUTES, WARN_MINUTES } from './estimate';
import {
  lessonSchema,
  trackSchema,
  type FlowScene,
  type Lesson,
  type LessonInput,
  type SceneEvent,
  type TableEvent,
  type Track,
} from './schema';

const MAX_NARRATIVE_WORDS = 120;
const MAX_HOOK_WORDS = 80;
const MIN_PRESET_PREFIX = 16;
const MAX_PRESET_PREFIX = 30;

export class LessonValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[], lessonSlug?: string) {
    const who = lessonSlug === undefined ? 'Lesson' : `Lesson "${lessonSlug}"`;
    super(`${who} is invalid:\n${issues.map((issue) => `  - ${issue}`).join('\n')}`);
    this.name = 'LessonValidationError';
    this.issues = issues;
  }
}

// ---------------------------------------------------------------- helpers

/** "steps[0].narrative: ..." from a zod issue. */
function describeZodIssue(issue: { path: PropertyKey[]; message: string }): string {
  const where = issue.path.reduce<string>(
    (acc, part) => (typeof part === 'number' ? `${acc}[${part}]` : acc === '' ? String(part) : `${acc}.${String(part)}`),
    '',
  );
  return where === '' ? issue.message : `${where}: ${issue.message}`;
}

/** Each value that appears more than once, once. */
function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) (seen.has(value) ? repeated : seen).add(value);
  return [...repeated];
}

function slugOf(input: unknown): string | undefined {
  if (typeof input === 'object' && input !== null && 'slug' in input && typeof input.slug === 'string') return input.slug;
  return undefined;
}

// ---------------------------------------------------------------- cross-field rules

function checkGeneral(l: Lesson, issues: string[]): void {
  if (l.steps.length < 4 || l.steps.length > 6) {
    issues.push(`A lesson needs 4–6 steps; this one has ${l.steps.length}.`);
  }
  for (const id of duplicates(l.steps.map((s) => s.id))) issues.push(`Duplicate step id "${id}".`);

  for (const step of l.steps) {
    if (step.facts.length < 2 || step.facts.length > 4) {
      issues.push(`Step "${step.id}" needs 2–4 facts; it has ${step.facts.length}.`);
    }
    const words = countWords(step.narrative);
    if (words > MAX_NARRATIVE_WORDS) {
      issues.push(`Step "${step.id}" narrative is ${words} words; the limit is ${MAX_NARRATIVE_WORDS} words.`);
    }
  }

  const hookWords = countWords(l.overview.hook);
  if (hookWords > MAX_HOOK_WORDS) {
    issues.push(`The overview hook is ${hookWords} words; the limit is ${MAX_HOOK_WORDS} words.`);
  }

  if (l.check.length < 2 || l.check.length > 3) {
    issues.push(`Check yourself needs 2–3 questions; this lesson has ${l.check.length}.`);
  }
  for (const id of duplicates(l.check.map((q) => q.id))) issues.push(`Duplicate question id "${id}".`);
  for (const q of l.check) {
    if (q.options.length < 2 || q.options.length > 4) {
      issues.push(`Question "${q.id}" needs 2–4 options; it has ${q.options.length}.`);
    }
    if (q.answer < 0 || q.answer >= q.options.length) {
      issues.push(`Question "${q.id}" has answer ${q.answer}, but it has ${q.options.length} options (answers count from 0).`);
    }
  }

  if (l.recap.takeaways.length !== 3) {
    issues.push(`The recap needs exactly 3 takeaways; this lesson has ${l.recap.takeaways.length}.`);
  }
  if (l.references.length < 1) issues.push('A lesson needs at least 1 reference.');
  if (l.certTags.length < 1) issues.push('A lesson needs at least 1 cert tag.');
}

/** Which optional table-event fields each op reads. `clear` reads none. */
const TABLE_OP_FIELDS: Record<TableEvent['op'], ('row' | 'rows' | 'key')[]> = {
  add: ['row'],
  update: ['key', 'row'],
  remove: ['key'],
  match: ['key'],
  replace: ['rows'],
  clear: [],
};

function checkEvent(e: SceneEvent, where: string, scene: FlowScene, issues: string[]): void {
  const actors = new Set(scene.actors.map((a) => a.id));

  if (e.type === 'message') {
    const unknown = (role: string, id: string) => {
      if (!actors.has(id)) issues.push(`${where}: message "${e.id}" ${role} unknown actor "${id}".`);
    };
    unknown('is sent from', e.from);
    for (const id of e.to) unknown('is sent to', id);
    for (const id of e.via ?? []) unknown('travels via', id);

    if (e.packet !== undefined) {
      if (!Object.hasOwn(scene.packets, e.packet)) {
        issues.push(`${where}: message "${e.id}" references unknown packet "${e.packet}".`);
      } else if (scene.packets[e.packet]!.size !== e.size) {
        issues.push(
          `${where}: message "${e.id}" size ${e.size} does not match packet "${e.packet}" size ${scene.packets[e.packet]!.size}.`,
        );
      }
    }
    return;
  }

  if (!scene.tables.some((t) => t.id === e.table)) {
    issues.push(`${where}: table event "${e.id}" references unknown table "${e.table}".`);
  }
  // "Present" means not undefined: an empty key is a valid match that found nothing.
  for (const field of TABLE_OP_FIELDS[e.op]) {
    if (e[field] === undefined) issues.push(`${where}: table event "${e.id}" (${e.op}) needs "${field}".`);
  }
}

function checkFlow(l: Lesson, scene: FlowScene, issues: string[]): void {
  const actors = new Set(scene.actors.map((a) => a.id));

  for (const id of duplicates(scene.actors.map((a) => a.id))) issues.push(`Duplicate actor id "${id}".`);
  for (const id of duplicates(scene.links.map((x) => x.id))) issues.push(`Duplicate link id "${id}".`);
  for (const id of duplicates(scene.tables.map((t) => t.id))) issues.push(`Duplicate table id "${id}".`);

  for (const link of scene.links) {
    for (const end of ['from', 'to'] as const) {
      if (!actors.has(link[end])) issues.push(`Link "${link.id}" references unknown actor "${link[end]}" (${end}).`);
    }
  }
  for (const table of scene.tables) {
    if (!actors.has(table.actor)) issues.push(`Table "${table.id}" is on unknown actor "${table.actor}".`);
    if (!table.columns.some((c) => c.key === table.keyColumn)) {
      issues.push(`Table "${table.id}" key column "${table.keyColumn}" is not one of its columns.`);
    }
  }
  for (const [id, packet] of Object.entries(scene.packets)) {
    const total = packet.layers.reduce((sum, layer) => sum + layer.size, 0);
    if (packet.size !== total) {
      issues.push(`Packet "${id}" size ${packet.size} does not equal the sum of its layer sizes (${total}).`);
    }
  }

  // Step events share one id space. Try it choices are alternatives that never
  // play together, so they only need to avoid the steps' ids and their own.
  const stepEventOwner = new Map<string, string>();
  for (const step of l.steps) {
    if (step.events.length === 0) issues.push(`Step "${step.id}" needs at least one event.`);
    if (step.preset !== undefined) issues.push(`Step "${step.id}" has a preset, which only playground lessons use.`);
    for (const e of step.events) {
      const owner = stepEventOwner.get(e.id);
      if (owner !== undefined) {
        const where = owner === step.id ? `twice in step "${owner}"` : `in steps "${owner}" and "${step.id}"`;
        issues.push(`Duplicate event id "${e.id}" ${where}; event ids must be unique across all steps.`);
      } else {
        stepEventOwner.set(e.id, step.id);
      }
      checkEvent(e, `Step "${step.id}"`, scene, issues);
    }
  }

  if (l.tryIt.mode !== 'choices') {
    issues.push('A flow lesson\'s Try it must use "choices" mode.');
    return;
  }
  const { choices } = l.tryIt;
  if (choices.length < 2 || choices.length > 4) {
    issues.push(`Try it needs 2–4 choices; this lesson has ${choices.length}.`);
  }
  for (const id of duplicates(choices.map((c) => c.id))) issues.push(`Duplicate Try it choice id "${id}".`);
  for (const choice of choices) {
    const own = new Set<string>();
    for (const e of choice.events) {
      if (own.has(e.id)) issues.push(`Try it choice "${choice.id}" repeats event id "${e.id}".`);
      else if (stepEventOwner.has(e.id)) {
        issues.push(`Try it choice "${choice.id}" event id "${e.id}" is already used by a step event.`);
      }
      own.add(e.id);
      checkEvent(e, `Try it choice "${choice.id}"`, scene, issues);
    }
  }
}

function checkPlayground(l: Lesson, issues: string[]): void {
  for (const step of l.steps) {
    if (step.events.length > 0) {
      issues.push(`Step "${step.id}" must have no events; a playground step is driven by its preset.`);
    }
    const preset = step.preset;
    if (preset === undefined) {
      issues.push(`Step "${step.id}" needs a preset (an address and a prefix).`);
      continue;
    }
    if (preset.prefix < MIN_PRESET_PREFIX || preset.prefix > MAX_PRESET_PREFIX) {
      issues.push(
        `Step "${step.id}" preset prefix /${preset.prefix} is outside /${MIN_PRESET_PREFIX}–/${MAX_PRESET_PREFIX}.`,
      );
    }
    if (!parseIPv4(preset.address).ok) {
      issues.push(`Step "${step.id}" preset address "${preset.address}" is not a valid IPv4 address.`);
    }
    if (preset.compare !== undefined && !parseIPv4(preset.compare).ok) {
      issues.push(`Step "${step.id}" preset compare "${preset.compare}" is not a valid IPv4 address.`);
    }
  }
  if (l.tryIt.mode !== 'free') issues.push('A playground lesson\'s Try it must use "free" mode.');
}

// ---------------------------------------------------------------- public API

/**
 * Checks a lesson and returns it with any warnings. Throws one
 * LessonValidationError listing every problem found. Shape problems (a missing
 * field, a wrong type) are reported first on their own, because the rules
 * below need a well-formed lesson to compare against.
 */
export function validateLesson(input: unknown): { lesson: Lesson; warnings: string[] } {
  const parsed = lessonSchema.safeParse(input);
  if (!parsed.success) throw new LessonValidationError(parsed.error.issues.map(describeZodIssue), slugOf(input));
  const lesson = parsed.data;

  const issues: string[] = [];
  checkGeneral(lesson, issues);
  if (lesson.scene.type === 'flow') checkFlow(lesson, lesson.scene, issues);
  else checkPlayground(lesson, issues);

  const minutes = estimateMinutes(lesson);
  if (minutes > MAX_MINUTES) {
    issues.push(`This lesson takes about ${minutes} minutes to get through; the limit is ${MAX_MINUTES} minutes. Trim the prose or split the lesson.`);
  }
  if (issues.length > 0) throw new LessonValidationError(issues, lesson.slug);

  const warnings =
    minutes > WARN_MINUTES
      ? [`This lesson takes about ${minutes} minutes, over the ${WARN_MINUTES}-minute target. Consider trimming it.`]
      : [];
  return { lesson, warnings };
}

/** The entry point for lesson files: validates at import, so a bad lesson fails the build. */
export function defineLesson(input: LessonInput): Lesson {
  const { lesson, warnings } = validateLesson(input);
  for (const warning of warnings) console.warn(`[lesson ${lesson.slug}] ${warning}`);
  return lesson;
}

/** Validates a track's shape and that part ids and lesson slugs are unique. */
export function defineTrack(t: Track): Track {
  const parsed = trackSchema.safeParse(t);
  const issues = parsed.success ? [] : parsed.error.issues.map(describeZodIssue);
  if (parsed.success) {
    for (const id of duplicates(parsed.data.parts.map((p) => p.id))) issues.push(`Duplicate part id "${id}".`);
    const slugs = parsed.data.parts.flatMap((p) => p.lessons.map((x) => x.slug));
    for (const slug of duplicates(slugs)) issues.push(`Duplicate lesson slug "${slug}".`);
  }
  if (!parsed.success || issues.length > 0) {
    const name = typeof t?.id === 'string' ? ` "${t.id}"` : '';
    throw new Error(`Track${name} is invalid:\n${issues.map((issue) => `  - ${issue}`).join('\n')}`);
  }
  return parsed.data;
}
