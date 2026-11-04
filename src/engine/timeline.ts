import type { Lesson, MessageEvent, MessageKind, Row, SceneEvent, TableDef, TableEvent } from '../content/schema';

/**
 * Where a learner is in a lesson. 0 is the Overview, 1..n are the steps, then
 * n+1 is Try it, n+2 is Check yourself and n+3 is the Recap.
 */
export type Position = number;

export interface Sections {
  stepCount: number;
  tryIt: Position;
  check: Position;
  recap: Position;
  max: Position;
}

export function sectionsFor(stepCount: number): Sections {
  return { stepCount, tryIt: stepCount + 1, check: stepCount + 2, recap: stepCount + 3, max: stepCount + 3 };
}

/** The heading for a position: 'Overview', a step's title, 'Try it', 'Check yourself' or 'Recap'. */
export function positionLabel(lesson: Lesson, p: Position): string {
  const s = sectionsFor(lesson.steps.length);
  if (p === s.tryIt) return 'Try it';
  if (p === s.check) return 'Check yourself';
  if (p >= s.recap) return 'Recap';
  return lesson.steps[p - 1]?.title ?? 'Overview';
}

/** Where a saved position would resume: 'step 3 of 6', 'Try it', 'Check yourself' or 'Recap'. */
export function resumeLabel(p: Position, stepCount: number): string {
  const s = sectionsFor(stepCount);
  if (p === s.tryIt) return 'Try it';
  if (p === s.check) return 'Check yourself';
  if (p >= s.recap) return 'Recap';
  return p >= 1 ? `step ${p} of ${stepCount}` : 'Overview';
}

export interface LogRow {
  n: number;
  eventId: string;
  time: number;
  /** The actor that sent the message, and the actors it was sent to and passed through: ids, not addresses. */
  from: string;
  to: string[];
  via?: string[];
  src: string;
  dst: string;
  protocol: string;
  label: string;
  summary: string;
  size: number;
  kind: MessageKind;
  outcome: 'delivered' | 'dropped';
  packet?: string;
  tableChange?: string;
}

export interface TableState {
  rows: Row[];
  highlight: { key: string; type: 'added' | 'updated' | 'matched' } | null;
}

export interface DerivedState {
  log: LogRow[];
  tables: Record<string, TableState>;
  activeMessage: MessageEvent | null;
  messageTotal: number;
}

/**
 * The events that play at a position: a step's own events, the chosen Try it
 * variant at Try it, and none anywhere else. Read-only: it is the lesson's own array.
 */
export function currentEvents(lesson: Lesson, p: Position, tryItChoice: string | null): SceneEvent[] {
  const s = sectionsFor(lesson.steps.length);
  if (p >= 1 && p <= s.stepCount) return lesson.steps[p - 1]?.events ?? [];
  if (p === s.tryIt && lesson.tryIt.mode === 'choices' && tryItChoice !== null) {
    return lesson.tryIt.choices.find((choice) => choice.id === tryItChoice)?.events ?? [];
  }
  return [];
}

const countMessages = (events: SceneEvent[]): number => events.filter((e) => e.type === 'message').length;

function logRow(e: MessageEvent, n: number): LogRow {
  return {
    n,
    eventId: e.id,
    time: e.time,
    from: e.from,
    to: [...e.to],
    ...(e.via === undefined ? {} : { via: [...e.via] }),
    src: e.src,
    dst: e.dst,
    protocol: e.protocol,
    label: e.label,
    summary: e.summary,
    size: e.size,
    kind: e.kind,
    outcome: e.outcome ?? 'delivered',
    ...(e.packet === undefined ? {} : { packet: e.packet }),
  };
}

/** Changes `state.rows` the way the event says. `match` only looks, so it changes nothing. */
function applyTableEvent(state: TableState, def: TableDef, e: TableEvent): void {
  const keyOf = (row: Row): string | undefined => row[def.keyColumn];
  const patch = e.row;
  switch (e.op) {
    case 'add':
      if (patch !== undefined) state.rows.push({ ...patch });
      break;
    case 'update':
      if (patch !== undefined) state.rows = state.rows.map((row) => (keyOf(row) === e.key ? { ...row, ...patch } : row));
      break;
    case 'remove':
      state.rows = state.rows.filter((row) => keyOf(row) !== e.key);
      break;
    case 'clear':
      state.rows = [];
      break;
    case 'replace':
      state.rows = (e.rows ?? []).map((row) => ({ ...row }));
      break;
    case 'match':
      break;
  }
}

/** The row an event points at. Removing, clearing or replacing leaves no single row to point at. */
function highlightFor(def: TableDef, e: TableEvent): TableState['highlight'] {
  switch (e.op) {
    case 'add':
      return { key: e.row?.[def.keyColumn] ?? '', type: 'added' };
    case 'update':
      // If the update renames the row, point at the new key: the old one is gone.
      return { key: e.row?.[def.keyColumn] ?? e.key ?? '', type: 'updated' };
    case 'match':
      return { key: e.key ?? '', type: 'matched' };
    default:
      return null;
  }
}

/**
 * Everything the scene shows at a moment, worked out from scratch: the events
 * of every earlier step in full, then the first `eventIndex` events of the
 * current position. Nothing carries over between calls, so stepping backwards,
 * jumping and rapid input can never leave the scene out of step with the state.
 */
export function deriveState(lesson: Lesson, p: Position, eventIndex: number, tryItChoice: string | null): DerivedState {
  const s = sectionsFor(lesson.steps.length);
  const current = currentEvents(lesson, p, tryItChoice);

  // At Check and Recap every step is applied; Try it's variant is not.
  const earlier = lesson.steps.slice(0, Math.max(0, Math.min(p - 1, s.stepCount))).flatMap((step) => step.events);
  // `group` is the step an event belongs to (-1 for the current position's own events), so a table change is only ever told with a message of its own position.
  const groups = lesson.steps.slice(0, Math.max(0, Math.min(p - 1, s.stepCount))).flatMap((step, i) => step.events.map(() => i));
  const applied = [
    ...earlier.map((event, i) => ({ event, isCurrent: false, group: groups[i]! })),
    ...current.slice(0, Math.max(0, eventIndex)).map((event) => ({ event, isCurrent: true, group: -1 })),
  ];

  const defs = new Map<string, TableDef>();
  const tables: Record<string, TableState> = {};
  if (lesson.scene.type === 'flow') {
    for (const def of lesson.scene.tables) {
      defs.set(def.id, def);
      tables[def.id] = { rows: def.initialRows.map((row) => ({ ...row })), highlight: null };
    }
  }

  const log: LogRow[] = [];
  let activeMessage: MessageEvent | null = null;
  let lastGroup: number | null = null;

  for (const { event, isCurrent, group } of applied) {
    if (event.type === 'message') {
      log.push(logRow(event, log.length + 1));
      lastGroup = group;
      if (isCurrent) activeMessage = event;
      continue;
    }

    // A table change is told alongside the message just before it. Before any message of its own position
    // (a Try it that starts by replacing the rules) it only reaches the table, not the previous position's last row.
    const last = log.at(-1);
    if (last !== undefined && lastGroup === group) last.tableChange = last.tableChange === undefined ? event.summary : `${last.tableChange}; ${event.summary}`;

    const def = defs.get(event.table);
    const state = tables[event.table];
    if (def === undefined || state === undefined) continue;
    applyTableEvent(state, def, event);
    // Only events of the current position glow: earlier steps are history.
    if (isCurrent) state.highlight = highlightFor(def, event);
  }

  let messageTotal = lesson.steps.reduce((sum, step) => sum + countMessages(step.events), 0);
  // At Try it the event card reads "Message n of total", so the variant's messages count too.
  if (p === s.tryIt) messageTotal += countMessages(current);

  return { log, tables, activeMessage, messageTotal };
}

/** The position named by `?step=`, clamped to the last one, or null when absent or not a whole number from 0 up. */
export function parseStepParam(search: string, s: Sections): Position | null {
  const raw = new URLSearchParams(search).get('step');
  // Digits only: a minus sign, a decimal point, spaces and '' all fall out here.
  if (raw === null || !/^\d+$/.test(raw)) return null;
  return Math.min(Number(raw), s.max);
}
