import type { Row, TableDef, TableEvent } from '../content/schema';

/**
 * A panel table as it stands at a moment of the lesson: its rows, and the row
 * the latest event of the current step points at (if any).
 */
export interface TableState {
  rows: Row[];
  highlight: { key: string; type: 'added' | 'updated' | 'matched' } | null;
}

/** Every table at its starting rows, keyed by table id, with no highlight. The rows are copies. */
export function initialTables(defs: TableDef[]): Record<string, TableState> {
  return Object.fromEntries(defs.map((def) => [def.id, { rows: def.initialRows.map((row) => ({ ...row })), highlight: null }]));
}

/**
 * Changes `state.rows` the way the event says, in place. Rows are matched on
 * the table's key column, which is all it needs of the table, so a scene
 * driver that knows only the key can use it too. `match` only looks, so it
 * changes nothing. The rows it adds are copies, so the lesson itself is never
 * changed.
 */
export function applyTableEvent(state: TableState, def: Pick<TableDef, 'keyColumn'>, e: TableEvent): void {
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
export function highlightFor(def: TableDef, e: TableEvent): TableState['highlight'] {
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
