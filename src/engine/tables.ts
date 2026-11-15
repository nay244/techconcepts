import type { Panel, Row, TableDef, TableEvent } from '../content/schema';

/**
 * The tables a unit's panel holds, which are the only tables its events may
 * change: a table panel has one, a rules panel has the rules and the
 * connections it remembers, and the bits board or no panel has none. The
 * timeline builds these tables and `define.ts` checks events against them.
 */
export function tablesOf(unit: { scene: { panel: Panel | null } }): TableDef[] {
  const panel = unit.scene.panel;
  if (panel === null) return [];
  if (panel.type === 'table') return [panel.table];
  if (panel.type === 'rules') return [panel.rules, panel.conns];
  return [];
}

/**
 * A panel table as it stands at a moment of the lesson: its rows, the row the
 * latest event of the current step points at (if any), and the keys of the
 * rows marked as a miss. A highlight lasts one step; a miss lasts until its
 * row changes again.
 */
export interface TableState {
  rows: Row[];
  highlight: { key: string; type: 'added' | 'updated' | 'matched' } | null;
  missed: string[];
  /**
   * Whose table this is now, from the latest `replace` that says (it carries over from step to step). Absent until
   * one does, and the panel shows the table's own `by` then.
   */
  by?: string;
  /**
   * What the latest event of the current step found, for a `match` with `keys`; each lasts one step, as `highlight`
   * does, and is absent otherwise. `candidates` are the rows that all match, before one wins; `matches` are the rows
   * that matched, which keep a "match" tag while the winner is highlighted; `noMatch` is the words of a match that
   * found nothing; an `add` clears `noMatch` alone.
   */
  candidates?: string[];
  matches?: string[];
  noMatch?: string;
}

/** Every table at its starting rows, keyed by table id, with no highlight and no miss. The rows are copies. */
export function initialTables(defs: TableDef[]): Record<string, TableState> {
  return Object.fromEntries(defs.map((def) => [def.id, { rows: def.initialRows.map((row) => ({ ...row })), highlight: null, missed: [] }]));
}

/**
 * Changes `state.rows` the way the event says, in place. Rows are matched on
 * the table's key column, which is all it needs of the table, so a scene
 * driver that knows only the key can use it too. `match` only looks, so it
 * changes nothing. The rows it adds are copies, so the lesson itself is never
 * changed. An add or update marks the row it leaves as a miss when the event
 * says `miss`, and clears the mark when it does not; a mark goes with its row.
 */
export function applyTableEvent(state: TableState, def: Pick<TableDef, 'keyColumn'>, e: TableEvent): void {
  const keyOf = (row: Row): string | undefined => row[def.keyColumn];
  const patch = e.row;
  if (e.op === 'add' || e.op === 'update') {
    // The row the event leaves: the one it adds, or the one it changes, under its new key if it renames it.
    const touched = e.op === 'add' ? patch?.[def.keyColumn] : (patch?.[def.keyColumn] ?? e.key);
    state.missed = state.missed.filter((key) => key !== touched && key !== e.key);
    if (e.miss === true && touched !== undefined) state.missed.push(touched);
  }
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
      // New rows, even under an old key: no mark carries over.
      state.rows = (e.rows ?? []).map((row) => ({ ...row }));
      state.missed = [];
      if (e.by !== undefined) state.by = e.by;
      break;
    case 'match':
      break;
  }
  const kept = new Set(state.rows.map(keyOf));
  state.missed = state.missed.filter((key) => kept.has(key));
}

/** The row an event points at. Removing, clearing or replacing leaves no single row to point at. */
export function highlightFor(def: TableDef, e: TableEvent): TableState['highlight'] {
  switch (e.op) {
    case 'add':
      return { key: e.row?.[def.keyColumn] ?? '', type: 'added' };
    case 'update':
      // If the update renames the row, point at the new key: the old one is gone.
      return { key: e.row?.[def.keyColumn] ?? e.key ?? '', type: 'updated' };
    case 'match':
      // A match that lists the rows that all match and picks none points at no row.
      return e.key === undefined ? null : { key: e.key, type: 'matched' };
    default:
      return null;
  }
}

/**
 * Marks the rows an event of the current step points at besides `highlight`: a `match` sets `candidates`, `matches`
 * and `noMatch` afresh (a `match` with `keys` and no `key` makes every one a candidate, and `key: ''` shows what it
 * found as `noMatch`); a `replace` clears them; other events leave them as they were. Marks are never set for an
 * earlier step's events, so each lasts one step.
 */
export function markFor(state: TableState, e: TableEvent): void {
  // An add answers a miss earlier in the step, so the no-match row goes; the other marks stay.
  if (e.op === 'add') delete state.noMatch;
  if (e.op !== 'match' && e.op !== 'replace') return;
  delete state.candidates;
  delete state.matches;
  delete state.noMatch;
  if (e.op === 'replace') return;
  if (e.keys !== undefined) state.matches = [...e.keys];
  if (e.key === undefined && e.keys !== undefined) state.candidates = [...e.keys];
  if (e.key === '') state.noMatch = e.summary;
}
