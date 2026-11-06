import type { Board, Lesson, MessageKind, Row, SceneEvent, TableDef, Unit } from '../content/schema';
import { applyTableEvent, highlightFor, initialTables, type TableState } from './tables';

/**
 * Where a learner is in a lesson: a flat index over every unit's slots. Each
 * unit has an Overview, its Watch steps, Learn and Practice, in that order, so
 * a one-unit lesson of 5 steps runs from 0 (Overview) to 7 (Practice), and in
 * a lesson of many units the next unit's Overview follows the last one's Practice.
 */
export type Position = number;

export type SlotKind = 'overview' | 'step' | 'learn' | 'practice';

/** What a position shows. `unit` counts from 0; `step` counts from 1 for a step and is 0 otherwise. */
export interface Slot {
  unit: number;
  kind: SlotKind;
  step: number;
}

/** Every position of the lesson, in order: per unit, the Overview, each step, Learn, then Practice. */
export function slotsFor(lesson: Lesson): Slot[] {
  return lesson.units.flatMap((u, unit): Slot[] => [
    { unit, kind: 'overview', step: 0 },
    ...u.steps.map((_, i): Slot => ({ unit, kind: 'step', step: i + 1 })),
    { unit, kind: 'learn', step: 0 },
    { unit, kind: 'practice', step: 0 },
  ]);
}

/**
 * The position of a unit's slot. `step` counts from 1 and is read only for a
 * step; left out, it is the unit's first step. Throws a RangeError for a slot
 * the lesson does not have.
 */
export function positionOf(lesson: Lesson, unit: number, kind: SlotKind, step = 1): Position {
  const u = lesson.units[unit];
  if (!Number.isInteger(unit) || u === undefined) {
    throw new RangeError(`Lesson "${lesson.slug}" has no unit ${unit} (it has ${lesson.units.length}, counting from 0).`);
  }
  const start = lesson.units.slice(0, unit).reduce((sum, x) => sum + x.steps.length + 3, 0);
  switch (kind) {
    case 'overview':
      return start;
    case 'step':
      if (!Number.isInteger(step) || step < 1 || step > u.steps.length) {
        throw new RangeError(`Unit "${u.id}" has no step ${step} (it has ${u.steps.length}, counting from 1).`);
      }
      return start + step;
    case 'learn':
      return start + u.steps.length + 1;
    case 'practice':
      return start + u.steps.length + 2;
  }
}

/** The slot at `p`. A position out of range (or not a whole number) is read as the nearest one. */
function slotAt(lesson: Lesson, p: Position): Slot {
  const slots = slotsFor(lesson);
  const index = Number.isNaN(p) ? 0 : Math.min(Math.max(Math.trunc(p), 0), slots.length - 1);
  return slots[index]!;
}

/** The heading for a position: 'Overview', the step's title, 'Learn' or 'Practice'. */
export function positionLabel(lesson: Lesson, p: Position): string {
  const slot = slotAt(lesson, p);
  switch (slot.kind) {
    case 'overview':
      return 'Overview';
    case 'step':
      return lesson.units[slot.unit]!.steps[slot.step - 1]!.title;
    case 'learn':
      return 'Learn';
    case 'practice':
      return 'Practice';
  }
}

/**
 * Where a saved position would resume: 'Overview', 'step 3 of 6', 'Learn' or
 * 'Practice'. In a lesson of many units the unit's name comes first:
 * 'DNS, step 2 of 5', 'DNS, Learn'.
 */
export function resumeLabel(lesson: Lesson, p: Position): string {
  const slot = slotAt(lesson, p);
  const u = lesson.units[slot.unit]!;
  const where =
    slot.kind === 'step'
      ? `step ${slot.step} of ${u.steps.length}`
      : slot.kind === 'overview'
        ? 'Overview'
        : slot.kind === 'learn'
          ? 'Learn'
          : 'Practice';
  return lesson.units.length > 1 ? `${u.name}, ${where}` : where;
}

/** One row of the log under the scene: a message or a note, in the order they played. */
export interface LogRow {
  /** Counts from 1 within the unit. */
  n: number;
  eventId: string;
  type: 'message' | 'note';
  /** The message's kind; null for a note. */
  kind: MessageKind | null;
  /** The message's outcome ('delivered' when it names none); null for a note. */
  outcome: 'delivered' | 'dropped' | 'blocked' | null;
  /** The places a message travels between; null for a note. */
  from: string | null;
  to: string | null;
  /** The words on a message's tag, which the Sequence view's arrow carries; null for a note. */
  tag: string | null;
  /** The event's `log` row as written, by column key. The console adds `#`; the `plain` column reads `plain`. */
  cells: Row;
  plain: string;
}

/** A cue that has played, in order. `current` marks the cues of the step being shown. */
export interface AppliedCue {
  cue: string;
  arg?: string;
  eventId: string;
  current: boolean;
}

/**
 * Everything the scene, its panel and the log show at a moment. `board`,
 * `active` and `events` are the lesson's own objects: read them, never change them.
 */
export interface DerivedState {
  /** The unit being shown, counting from 0. */
  unit: number;
  slot: Slot;
  log: LogRow[];
  /** The unit's panel tables by id. */
  tables: Record<string, TableState>;
  cues: AppliedCue[];
  /** The latest board a note has shown, or null before any. */
  board: Board | null;
  /** The last applied event of the current step, or null (always null off a step). */
  active: SceneEvent | null;
  /** The events that play at this position: `stepEvents`. */
  events: SceneEvent[];
}

/**
 * The events that play at a position: a step's own events, and none at an
 * Overview, Learn or Practice. Read-only: it is the lesson's own array.
 */
export function stepEvents(lesson: Lesson, p: Position): SceneEvent[] {
  return eventsOf(lesson, slotAt(lesson, p));
}

function eventsOf(lesson: Lesson, slot: Slot): SceneEvent[] {
  return slot.kind === 'step' ? lesson.units[slot.unit]!.steps[slot.step - 1]!.events : [];
}

/**
 * The tables a unit's events change: the ones its scene's panel holds. A table
 * panel has one, a rules panel has the rules and the connections it remembers,
 * and the bits board or no panel has none. (`define.ts` checks events against the same list.)
 */
function unitTables(u: Unit): TableDef[] {
  const panel = u.scene.panel;
  if (panel === null) return [];
  if (panel.type === 'table') return [panel.table];
  if (panel.type === 'rules') return [panel.rules, panel.conns];
  return [];
}

function logRow(e: Exclude<SceneEvent, { type: 'table' }>, n: number): LogRow {
  const cells = { ...e.log };
  if (e.type === 'note') {
    return { n, eventId: e.id, type: 'note', kind: null, outcome: null, from: null, to: null, tag: null, cells, plain: e.plain };
  }
  return {
    n,
    eventId: e.id,
    type: 'message',
    kind: e.kind,
    outcome: e.outcome ?? 'delivered',
    from: e.from,
    to: e.to,
    tag: e.tag,
    cells,
    plain: e.plain,
  };
}

/**
 * Everything shown at position `p` after the first `eventIndex` events of its
 * step have played, worked out from scratch on every call. Nothing carries
 * over between calls, so stepping backwards, jumping and rapid input can never
 * leave the scene out of step with the state, and the lesson is never changed.
 *
 * Only the current unit's events count. At its Overview nothing is applied; at
 * step k, steps 1…k−1 in full, then the first `eventIndex` events of step k; at
 * Learn and Practice, every step. Messages and notes add log rows, table events
 * change the tables (and highlight a row only when they belong to the current
 * step), and cues build up in order. A position out of range is read as the
 * nearest one, and `eventIndex` is held between 0 and the step's event count.
 */
export function deriveState(lesson: Lesson, p: Position, eventIndex: number): DerivedState {
  const slot = slotAt(lesson, p);
  const u = lesson.units[slot.unit]!;
  const events = eventsOf(lesson, slot);

  // Steps before the current one apply in full: none at the Overview, all of them at Learn and Practice.
  const fullSteps = slot.kind === 'overview' ? 0 : slot.kind === 'step' ? slot.step - 1 : u.steps.length;
  const applied = [
    ...u.steps.slice(0, fullSteps).flatMap((step) => step.events.map((event) => ({ event, current: false }))),
    ...events.slice(0, Math.max(0, eventIndex)).map((event) => ({ event, current: true })),
  ];

  const defs = unitTables(u);
  // Fresh tables every time: applyTableEvent changes them in place.
  const tables = initialTables(defs);
  const log: LogRow[] = [];
  const cues: AppliedCue[] = [];
  let board: Board | null = null;
  let active: SceneEvent | null = null;

  for (const { event, current } of applied) {
    if (current) active = event;

    if (event.type === 'table') {
      const def = defs.find((d) => d.id === event.table);
      const state = Object.hasOwn(tables, event.table) ? tables[event.table] : undefined;
      if (def === undefined || state === undefined) continue;
      applyTableEvent(state, def, event);
      // Only the current step's changes glow: earlier steps are history.
      if (current) state.highlight = highlightFor(def, event);
      continue;
    }

    log.push(logRow(event, log.length + 1));
    for (const { cue, arg } of event.cues ?? []) {
      cues.push({ cue, ...(arg === undefined ? {} : { arg }), eventId: event.id, current });
    }
    // A note without a board leaves the board as it was.
    if (event.type === 'note' && event.board !== undefined) board = event.board;
  }

  return { unit: slot.unit, slot, log, tables, cues, board, active, events };
}

/**
 * The position named by `?step=`, clamped to the last one (the last unit's
 * Practice), or null when it is absent or not a whole number from 0 up. The
 * number counts across units, so in a lesson of many units it can land in any
 * of them. Null means the console stays at the Overview.
 */
export function parseStepParam(search: string, lesson: Lesson): Position | null {
  const raw = new URLSearchParams(search).get('step');
  // Digits only: a minus sign, a decimal point, spaces and '' all fall out here.
  if (raw === null || !/^\d+$/.test(raw)) return null;
  return Math.min(Number(raw), slotsFor(lesson).length - 1);
}
