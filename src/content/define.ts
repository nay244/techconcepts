import type { z } from 'zod';
import { FIGURE_PARTS } from '../art/scenes/parts';
import type { FigureParts } from '../art/scenes/types';
import { tablesOf } from '../engine/tables';
import { checkCitedRules, citationsOf } from './cited';
import { checkCitation, SOURCES, sourceListOf, type SourceRegistry } from './sources';
import { formatBytes } from '../lib/format';
import {
  lessonSchema,
  trackSchema,
  type CertificationTrack,
  type Cue,
  type Lesson,
  type Row,
  type SceneEvent,
  type TableDef,
  type TableEvent,
  type Track,
  type Unit,
} from './schema';

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
  if (parts.words !== undefined) {
    for (const word of parts.words) {
      if (!Object.hasOwn(scene.labels, word)) issues.push(`${at}: the scene's labels need "${word}" for the ${figure} figure.`);
    }
    for (const word of Object.keys(scene.labels)) {
      if (!parts.words.includes(word)) issues.push(`${at}: the scene's labels give "${word}", which the ${figure} figure does not show.`);
    }
  }
  if (scene.panel?.type === 'labels' && !parts.labels) {
    issues.push(`${at}: the labels panel needs a figure that shows a message's headers; the ${figure} figure does not.`);
  }
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
    else if (type === 'text' && arg !== undefined) {
      const allowed = Object.hasOwn(c.parts.args ?? {}, cue) ? c.parts.args![cue] : undefined;
      if (allowed === undefined || allowed.includes(arg)) continue;
      if (allowed.length > 4) {
        c.issues.push(`${where}: cue "${cue}" arg "${arg}" is not one the ${c.figure} figure can show.`);
      } else {
        const quoted = allowed.map((a) => `"${a}"`);
        const list = quoted.length === 1 ? quoted[0]! : `${quoted.slice(0, -1).join(', ')} or ${quoted.at(-1)}`;
        c.issues.push(`${where}: cue "${cue}" takes ${list}, not "${arg}".`);
      }
    }
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

  if (e.labels !== undefined) {
    if (!c.parts.labels) issues.push(`${where} has labels, but the ${figure} figure shows none.`);
    else if (c.unit.scene.panel?.type !== 'labels') issues.push(`${where} has labels, but the unit's panel is not a labels panel.`);
  }

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
  if (c.parts.routes !== undefined && !c.parts.routes.includes(`${e.from}>${e.to}`)) {
    issues.push(`${where} rides from "${e.from}" to "${e.to}", a way the ${figure} figure does not have.`);
  }

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
  for (const q of u.practice) {
    if (q.answer < 0 || q.answer >= q.options.length) {
      issues.push(`${at}: Question "${q.id}" has answer ${q.answer}, but it has ${q.options.length} options (answers count from 0).`);
    }
  }

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
 * The lessons a validator has returned, each with what it was checked against: the source registry for a cited
 * lesson, 'legacy' for the legacy path. The registry accepts only these, and only a cited lesson checked against the
 * real `SOURCES`, so no lesson file can skip the rules or bring its own sources.
 */
const defined = new WeakMap<object, SourceRegistry | 'legacy'>();

/**
 * @internal Only the two lesson paths call it: records a lesson that `validateLesson` (with the registry it used) or
 * `validateLegacyLesson` (with 'legacy') has just checked, and returns it. A lesson file never calls it.
 */
export function markDefined(lesson: Lesson, checkedAgainst: SourceRegistry | 'legacy'): Lesson {
  defined.set(lesson, checkedAgainst);
  return lesson;
}

/**
 * What a validator checked `l` against when it returned `l`: the source registry of a cited lesson, or 'legacy'.
 * Undefined for anything a validator did not return, such as a copy or a lesson built by hand.
 */
export function definedWith(l: unknown): SourceRegistry | 'legacy' | undefined {
  return typeof l === 'object' && l !== null ? defined.get(l) : undefined;
}

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
 * cert tag (a legacy lesson may have none until its audit maps them: How the Internet Works' 14 protocols, split from
 * one lesson whose tags not every protocol earns); unique unit, step, question, event and table ids; at most one
 * override per limit; and a scene, events, tables and cues that fit the lesson's figure and each other.
 */
export function checkStructure(lesson: Lesson): string[] {
  const issues: string[] = [];
  if (lesson.certTags.length < 1 && lesson.origin !== 'legacy') issues.push('A lesson needs at least 1 cert tag.');
  for (const id of duplicates(lesson.units.map((u) => u.id))) issues.push(`Duplicate unit id "${id}".`);
  for (const limit of duplicates(lesson.overrides.map((o) => o.limit))) {
    issues.push(`Lesson "${lesson.slug}" overrides the ${limit} limit more than once; keep one override, with one reason.`);
  }
  for (const u of lesson.units) checkUnit(lesson, u, issues);
  return issues;
}

/**
 * What a cited lesson file writes. Its references are left out (they are listed from its citations); citation lists,
 * overrides and a scene's layers, labels and start may be.
 */
export type LessonInput = z.input<typeof lessonSchema>;

/**
 * Checks a lesson in the cited shape against `sources` and returns it, origin 'cited', with each unit's references
 * listed from its citations in reading order. Its shape first (alone, as `parseLessonShape` reports it); then,
 * together, the cited rules (`cited.ts`: one unit, no written references, citations, the OSI badge, backing and
 * traces, sound citations, no lesson numbers) and the structural rules every lesson keeps (`checkStructure`). Throws
 * one LessonValidationError listing every problem. The numeric limits are the track's, checked in the registry.
 * Records `sources` with the lesson: the registry accepts a cited lesson only when that is the real `SOURCES`, so
 * another list is for tests alone.
 */
export function validateLesson(input: unknown, sources: SourceRegistry = SOURCES): Lesson {
  const lesson: Lesson = { ...parseLessonShape(lessonSchema, input), origin: 'cited' };
  const issues = [...checkCitedRules(lesson, sources), ...checkStructure(lesson)];
  if (issues.length > 0) throw new LessonValidationError(issues, lesson.slug);
  const units = lesson.units.map((u) => ({ ...u, references: sourceListOf(citationsOf(u), sources) }));
  return markDefined({ ...lesson, units }, sources);
}

/**
 * The entry point for every new lesson file: it validates at import against `SOURCES`, the real registry, so a bad
 * lesson, or one citing a source not in `SOURCES`, fails the build.
 */
export function defineLesson(input: LessonInput): Lesson {
  return validateLesson(input, SOURCES);
}

/** Issues with a certification track's pin and the objectives its lessons map to. */
function checkCertification(t: CertificationTrack, sources: SourceRegistry): string[] {
  const issues: string[] = [];
  const { exam } = t;
  const source = Object.hasOwn(sources, exam.source) ? sources[exam.source] : undefined;
  if (source === undefined) {
    issues.push(`The exam source "${exam.source}" is not in the source registry.`);
  } else {
    if (source.kind !== 'cert-objectives') {
      issues.push(`The exam source "${exam.source}" is a source of kind "${source.kind}", not cert-objectives.`);
    }
    if (source.version !== exam.version) {
      issues.push(
        `The track pins exam version "${exam.version}", but the registry's "${exam.source}" is version "${source.version ?? 'unversioned'}"; ` +
          'pin the version the registry holds, or update the registry first.',
      );
    }
  }
  for (const part of t.parts) {
    for (const lesson of part.lessons) {
      const seen = new Set<string>();
      for (const o of lesson.objectives) {
        const at = `Lesson "${lesson.slug}", objective ${o.exam} ${o.objective}`;
        if (!exam.codes.includes(o.exam)) {
          issues.push(`${at}: "${o.exam}" is not one of the track's exam codes (${exam.codes.join(', ')}).`);
        }
        if (seen.has(`${o.exam} ${o.objective}`)) issues.push(`Lesson "${lesson.slug}" lists objective ${o.exam} ${o.objective} twice.`);
        seen.add(`${o.exam} ${o.objective}`);
        if (o.cite.source !== exam.source) {
          issues.push(`${at}: the citation is from "${o.cite.source}", but the track's objectives document is "${exam.source}".`);
        }
        if (o.cite.section !== o.objective) {
          issues.push(`${at}: the citation is at section ${o.cite.section}, but the objective is ${o.objective}; cite the objective's own section.`);
        }
        for (const problem of checkCitation(o.cite, sources, 'objectives')) issues.push(`${at}: ${problem}`);
      }
    }
  }
  return issues;
}

/**
 * Validates a track's shape, that part ids and lesson slugs are unique and, for a certification track, its pin and
 * the objectives its lessons map to, checked against `sources`. Throws one Error listing every problem. The registry
 * checks every track again against the real `SOURCES` (`checkTracks`), so another list is for tests alone.
 */
export function defineTrack(t: Track, sources: SourceRegistry = SOURCES): Track {
  const parsed = trackSchema.safeParse(t);
  const issues = parsed.success ? [] : parsed.error.issues.map(describeZodIssue);
  if (parsed.success) {
    for (const id of duplicates(parsed.data.parts.map((p) => p.id))) issues.push(`Duplicate part id "${id}".`);
    const slugs = parsed.data.parts.flatMap((p) => p.lessons.map((x) => x.slug));
    for (const slug of duplicates(slugs)) issues.push(`Duplicate lesson slug "${slug}".`);
    if (parsed.data.type === 'certification') issues.push(...checkCertification(parsed.data, sources));
  }
  if (!parsed.success || issues.length > 0) {
    const name = typeof t?.id === 'string' ? ` "${t.id}"` : '';
    throw new Error(`Track${name} is invalid:\n${issues.map((issue) => `  - ${issue}`).join('\n')}`);
  }
  return parsed.data;
}
