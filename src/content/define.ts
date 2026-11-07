import type { z } from 'zod';
import { FIGURE_PARTS } from '../art/scenes/parts';
import type { FigureParts } from '../art/scenes/types';
import { tablesOf } from '../engine/tables';
import { formatBytes } from '../lib/format';
import {
  trackSchema,
  type Cue,
  type Lesson,
  type Row,
  type SceneEvent,
  type TableDef,
  type TableEvent,
  type Track,
  type Unit,
} from './schema';
import { countWords } from './words';

const MAX_NARRATIVE_WORDS = 120;
const MAX_HOOK_WORDS = 80;
/** Longer titles overflow the net-map figure's fixed frame. */
const MAX_NET_MAP_TITLE = 51;

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

/** "units[0].steps[1].narrative: ..." from a zod issue. */
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

/** True when `n` is from `min` to `max`, both included. */
function inRange(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}

/** The rows a unit's table events give the table `id`, whole: each row an add brings, and each a replace brings. */
function rowsGivenTo(u: Unit, id: string): Row[] {
  const events = u.steps.flatMap((step) => step.events).filter((e): e is TableEvent => e.type === 'table' && e.table === id);
  return events.flatMap((e) => (e.op === 'add' ? [e.row ?? {}] : e.op === 'replace' ? (e.rows ?? []) : []));
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

/** What a unit's events are checked against. */
interface UnitContext {
  figure: Lesson['figure'];
  parts: FigureParts;
  unit: Unit;
  /** The unit's log columns an event may write: all but `plain` (the event's own `plain`) and `#` (the console's). */
  logKeys: Set<string>;
  tables: TableDef[];
  issues: string[];
}

// ---------------------------------------------------------------- unit rules

/**
 * Today's content limits for one unit (`at` names it in each issue): step, fact, question, option, term and pattern
 * counts, narrative and hook words, and at least one reference. The legacy path runs them until each track carries
 * its own limits (direction doc §4.4).
 */
export function checkUnitLimits(u: Unit, at: string, multiUnit: boolean, issues: string[]): void {
  if (!inRange(u.steps.length, 4, 6)) issues.push(`${at}: a unit needs 4–6 steps; this one has ${u.steps.length}.`);

  for (const step of u.steps) {
    if (!inRange(step.facts.length, 2, 4)) {
      issues.push(`${at}: Step "${step.id}" needs 2–4 facts; it has ${step.facts.length}.`);
    }
    const words = countWords(step.narrative);
    if (words > MAX_NARRATIVE_WORDS) {
      issues.push(`${at}: Step "${step.id}" narrative is ${words} words; the limit is ${MAX_NARRATIVE_WORDS} words.`);
    }
  }

  const hookWords = countWords(u.overview.hook);
  if (hookWords > MAX_HOOK_WORDS) {
    issues.push(`${at}: the overview hook is ${hookWords} words; the limit is ${MAX_HOOK_WORDS} words.`);
  }

  const questions = u.practice.length;
  if (multiUnit && questions !== 2) {
    issues.push(`${at}: in a lesson of many units, Practice needs exactly 2 questions per unit; this one has ${questions}.`);
  } else if (!multiUnit && !inRange(questions, 2, 3)) {
    issues.push(`${at}: Practice needs 2–3 questions; this unit has ${questions}.`);
  }
  for (const q of u.practice) {
    if (!inRange(q.options.length, 2, 4)) {
      issues.push(`${at}: Question "${q.id}" needs 2–4 options; it has ${q.options.length}.`);
    }
    if (q.answer < 0 || q.answer >= q.options.length) {
      issues.push(`${at}: Question "${q.id}" has answer ${q.answer}, but it has ${q.options.length} options (answers count from 0).`);
    }
  }

  if (!inRange(u.learn.terms.length, 3, 10)) {
    issues.push(`${at}: Learn needs 3–10 terms; this unit has ${u.learn.terms.length}.`);
  }
  if (!inRange(u.learn.pattern.names.length, 2, 6)) {
    issues.push(`${at}: Learn's pattern needs 2–6 names; this unit has ${u.learn.pattern.names.length}.`);
  }
  if (u.references.length < 1) issues.push(`${at}: a unit needs at least 1 reference.`);
}

function checkScene(c: UnitContext, at: string): void {
  const { unit: u, parts, figure, issues } = c;
  const scene = u.scene;

  for (const party of scene.parties) {
    if (!parts.places.includes(party.place)) {
      issues.push(`${at}: party "${party.label}" stands at place "${party.place}", which the ${figure} figure does not have.`);
    }
  }
  // Views are ['network'] or ['network', 'sequence'], so two views means the Sequence view is on.
  if (scene.views.length > 1 && scene.parties.length < 2) {
    issues.push(`${at}: the Sequence view needs at least 2 parties; this scene has ${scene.parties.length}.`);
  }
  for (const layer of scene.layers) {
    if (!parts.layers.includes(layer)) issues.push(`${at}: layer "${layer}" is not one the ${figure} figure has.`);
  }
  checkStart(c, at);
  if (figure === 'net-map' && scene.title.length > MAX_NET_MAP_TITLE) {
    issues.push(`${at}: the scene title is ${scene.title.length} characters; the limit is ${MAX_NET_MAP_TITLE} on the net-map figure.`);
  }

  for (const id of duplicates(c.tables.map((t) => t.id))) issues.push(`${at}: Duplicate table id "${id}".`);
  for (const table of c.tables) {
    // Rows are told apart by the key column: one of the table's columns or, for a table that says its key is
    // hidden, a field every row carries that no column shows.
    const shown = table.columns.some((column) => column.key === table.keyColumn);
    if (table.hiddenKey !== true) {
      if (!shown) issues.push(`${at}: table "${table.id}" key column "${table.keyColumn}" is not one of its columns.`);
      continue;
    }
    if (shown) issues.push(`${at}: table "${table.id}" hides its key, and key column "${table.keyColumn}" is one of its columns.`);
    if ([...table.initialRows, ...rowsGivenTo(u, table.id)].some((row) => row[table.keyColumn] === undefined)) {
      issues.push(`${at}: table "${table.id}" hides its key column "${table.keyColumn}", and not every row carries it.`);
    }
  }

  if (scene.log.columns.some((column) => column.key === '#')) {
    issues.push(`${at}: the log has a column keyed "#", but "#" is added by the console; leave it out.`);
  }

  for (const [id, packet] of Object.entries(scene.packets ?? {})) {
    const total = packet.layers.reduce((sum, layer) => sum + layer.size, 0);
    if (packet.size !== total) {
      issues.push(`${at}: Packet "${id}" size ${packet.size} does not equal the sum of its layer sizes (${total}).`);
    }
  }
}

/** The status cues: a start may not carry one, since it is settled before each step's own status and would beat it. */
const STATUS_CUES: readonly string[] = ['status', 'status-known', 'status-done'];

/**
 * A scene's start: only on a figure whose driver shows one (as a board is), then cues the figure has, and no
 * status, which is each step's own.
 */
function checkStart(c: UnitContext, at: string): void {
  const { start } = c.unit.scene;
  if (start.length === 0) return;
  if (!c.parts.start) {
    c.issues.push(`${at}: the scene has a start, but the ${c.figure} figure takes none.`);
    return;
  }
  const where = `${at}: the scene's start`;
  checkCues(start, where, c);
  for (const { cue } of start) {
    if (STATUS_CUES.includes(cue)) c.issues.push(`${where}: cue "${cue}" sets the status, and a start may not; each step sets its own.`);
  }
}

function checkCues(cues: Cue[] | undefined, where: string, c: UnitContext): void {
  for (const { cue, arg } of cues ?? []) {
    const type = Object.hasOwn(c.parts.cues, cue) ? c.parts.cues[cue] : undefined;
    if (type === undefined) c.issues.push(`${where}: cue "${cue}" is not one the ${c.figure} figure has.`);
    else if (type === 'text' && arg === undefined) c.issues.push(`${where}: cue "${cue}" needs an arg.`);
    else if (type === 'flag' && arg !== undefined) c.issues.push(`${where}: cue "${cue}" is a flag and takes no arg.`);
  }
}

function checkLogRow(log: Row, where: string, c: UnitContext): void {
  for (const key of Object.keys(log)) {
    if (key === '#') c.issues.push(`${where}: log key "#" is added by the console; leave it out.`);
    else if (key === 'plain') c.issues.push(`${where}: log key "plain" comes from the event's own "plain"; leave it out of log.`);
    else if (!c.logKeys.has(key)) {
      c.issues.push(`${where}: log key "${key}" is not a column of the unit's log (${[...c.logKeys].join(', ')}).`);
    }
  }
}

function checkEvent(e: SceneEvent, at: string, c: UnitContext): void {
  const { issues, figure } = c;

  if (e.type === 'table') {
    const where = `${at}: table event "${e.id}"`;
    if (!c.tables.some((t) => t.id === e.table)) {
      const names = c.tables.map((t) => `"${t.id}"`).join(', ');
      issues.push(`${where} names table "${e.table}", which the unit's panel does not have (${names === '' ? 'none' : names}).`);
    }
    // "Present" means not undefined: an empty key is a valid match that found nothing.
    for (const field of TABLE_OP_FIELDS[e.op]) {
      if (e[field] === undefined) issues.push(`${where} (${e.op}) needs "${field}".`);
    }
    // Only a row an event adds or changes can be marked as a miss.
    if (e.miss !== undefined && e.op !== 'add' && e.op !== 'update') {
      issues.push(`${where} (${e.op}) has "miss"; only an add or an update marks its row as a miss.`);
    }
    return;
  }

  const where = `${at}: ${e.type} "${e.id}"`;
  checkLogRow(e.log, where, c);
  checkCues(e.cues, where, c);

  if (e.type === 'note') {
    if (e.board !== undefined && !c.parts.board) issues.push(`${where} has a board, but the ${figure} figure has none.`);
    // A glyph's colour and shape never say what it is alone: the legend says it in words.
    if (e.glyph !== undefined && !c.unit.scene.log.legend.some((entry) => entry.kind === e.glyph)) {
      issues.push(`${where} draws the ${e.glyph} glyph, which the unit's log legend does not explain.`);
    }
    return;
  }

  const place = (role: string, id: string) => {
    if (!c.parts.places.includes(id)) issues.push(`${where} ${role} "${id}", which the ${figure} figure does not have.`);
  };
  place('is sent from', e.from);
  place('is sent to', e.to);

  if (e.outcome === 'dropped' && e.dropAt === undefined) issues.push(`${where} is dropped, so it needs "dropAt".`);
  if (e.outcome !== 'dropped' && e.dropAt !== undefined) issues.push(`${where} has "dropAt" but is not dropped.`);

  const panel = c.unit.scene.panel;
  if (e.check !== undefined) {
    if (panel?.type !== 'rules') issues.push(`${where}: check needs a rules panel.`);
    else if (e.check.table !== panel.rules.id) {
      issues.push(`${where}: check names table "${e.check.table}", not the rules table "${panel.rules.id}".`);
    }
  }
  if (e.known !== undefined) {
    if (panel?.type !== 'rules') issues.push(`${where}: known needs a rules panel.`);
    else if (e.known.table !== panel.conns.id) {
      issues.push(`${where}: known names table "${e.known.table}", not the conns table "${panel.conns.id}".`);
    }
  }

  if (e.packet !== undefined) {
    const packets = c.unit.scene.packets ?? {};
    const packet = Object.hasOwn(packets, e.packet) ? packets[e.packet] : undefined;
    if (packet === undefined) issues.push(`${where} names unknown packet "${e.packet}".`);
    else if (e.log.size !== undefined && e.log.size !== formatBytes(packet.size)) {
      issues.push(`${where}: log size "${e.log.size}" does not match packet "${e.packet}" (${formatBytes(packet.size)}).`);
    }
  }
}

function checkUnit(l: Lesson, u: Unit, issues: string[]): void {
  const at = `Unit "${u.id}"`;
  for (const id of duplicates(u.steps.map((s) => s.id))) issues.push(`${at}: Duplicate step id "${id}".`);
  for (const id of duplicates(u.practice.map((q) => q.id))) issues.push(`${at}: Duplicate question id "${id}".`);

  const c: UnitContext = {
    figure: l.figure,
    parts: FIGURE_PARTS[l.figure],
    unit: u,
    logKeys: new Set(u.scene.log.columns.map((column) => column.key).filter((key) => key !== 'plain' && key !== '#')),
    tables: tablesOf(u),
    issues,
  };
  checkScene(c, at);

  // Events share one id space across the unit's steps.
  const owner = new Map<string, string>();
  for (const step of u.steps) {
    for (const e of step.events) {
      const first = owner.get(e.id);
      if (first !== undefined) {
        const where = first === step.id ? `twice in step "${first}"` : `in steps "${first}" and "${step.id}"`;
        issues.push(`${at}: Duplicate event id "${e.id}" ${where}; event ids must be unique across a unit's steps.`);
      } else {
        owner.set(e.id, step.id);
      }
      checkEvent(e, `${at}, step "${step.id}"`, c);
    }
  }
}

// ---------------------------------------------------------------- public API

/**
 * Parses a lesson's shape with `schema`, or throws one LessonValidationError naming every shape problem (a missing
 * field, a wrong type, a key the schema does not know) with its path. Shape problems are reported on their own,
 * because the rules after them need a well-formed lesson to compare against.
 */
export function parseLessonShape<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new LessonValidationError(parsed.error.issues.map(describeZodIssue), slugOf(input));
  return parsed.data;
}

/**
 * The structural rules every lesson keeps, whichever path it came by, as readable issues (empty when it has none): a
 * cert tag; unique unit, step, question, event and table ids; and a scene, events, tables and cues that fit the
 * lesson's figure and each other.
 */
export function checkStructure(lesson: Lesson): string[] {
  const issues: string[] = [];
  if (lesson.certTags.length < 1) issues.push('A lesson needs at least 1 cert tag.');
  for (const id of duplicates(lesson.units.map((u) => u.id))) issues.push(`Duplicate unit id "${id}".`);
  for (const u of lesson.units) checkUnit(lesson, u, issues);
  return issues;
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
