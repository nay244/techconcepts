import { expect, test } from 'vitest';
import type { Row, TableDef, TableEvent } from '../content/schema';
import { applyTableEvent, highlightFor, initialTables, tablesOf, type TableState } from './tables';

const def: TableDef = {
  id: 't',
  title: 'Neighbor table',
  columns: [
    { key: 'ip', label: 'IP address' },
    { key: 'mac', label: 'MAC address' },
  ],
  keyColumn: 'ip',
  initialRows: [
    { ip: '10.0.0.1', mac: 'AA' },
    { ip: '10.0.0.2', mac: 'BB' },
  ],
  empty: 'Empty.',
};

const event = (op: TableEvent['op'], rest: Partial<TableEvent> = {}): TableEvent => ({
  type: 'table',
  id: 'e',
  table: 't',
  op,
  summary: 'changed',
  ...rest,
});

/** The rows after applying `e` to the table's starting rows. */
function rowsAfter(e: TableEvent): Row[] {
  const state = initialTables([def]).t!;
  applyTableEvent(state, def, e);
  return state.rows;
}

const [first, second] = def.initialRows as [Row, Row];

// ---------------------------------------------------------------- initialTables

test('initialTables starts every table at its own copy of its initial rows, with no highlight', () => {
  const other: TableDef = { ...def, id: 'u', initialRows: [] };
  const tables = initialTables([def, other]);
  expect(tables).toEqual({ t: { rows: def.initialRows, highlight: null, missed: [] }, u: { rows: [], highlight: null, missed: [] } });
  tables.t!.rows[0]!.mac = 'ZZ';
  tables.t!.rows.push({ ip: 'x' });
  expect(def.initialRows).toEqual([first, second]);
  expect(first.mac).toBe('AA');
});

test('initialTables of no tables is empty', () => expect(initialTables([])).toEqual({}));

// ---------------------------------------------------------------- tablesOf

test("tablesOf is the tables a unit's panel holds: a table panel's one, a rules panel's rules and connections, else none", () => {
  const conns: TableDef = { ...def, id: 'conns', initialRows: [] };
  expect(tablesOf({ scene: { panel: { type: 'table', table: def } } })).toEqual([def]);
  expect(tablesOf({ scene: { panel: { type: 'rules', rules: def, conns } } })).toEqual([def, conns]);
  expect(tablesOf({ scene: { panel: { type: 'bits' } } })).toEqual([]);
  expect(tablesOf({ scene: { panel: null } })).toEqual([]);
});

// ---------------------------------------------------------------- applyTableEvent

test('add appends a copy of the row', () => {
  const row = { ip: '10.0.0.3', mac: 'CC' };
  const rows = rowsAfter(event('add', { row }));
  expect(rows).toEqual([first, second, row]);
  rows[2]!.mac = 'changed';
  expect(row.mac).toBe('CC');
});

test('update merges the row into the one with the key, and can rename it', () => {
  expect(rowsAfter(event('update', { key: '10.0.0.2', row: { mac: 'ZZ' } }))).toEqual([first, { ip: '10.0.0.2', mac: 'ZZ' }]);
  expect(rowsAfter(event('update', { key: '10.0.0.2', row: { ip: '10.0.0.9' } }))).toEqual([first, { ip: '10.0.0.9', mac: 'BB' }]);
  expect(rowsAfter(event('update', { key: 'nobody', row: { mac: 'ZZ' } }))).toEqual([first, second]);
});

test('remove drops the row with the key', () => {
  expect(rowsAfter(event('remove', { key: '10.0.0.1' }))).toEqual([second]);
});

test('clear empties the table, and replace swaps in copies of new rows', () => {
  expect(rowsAfter(event('clear'))).toEqual([]);
  const rows = [{ ip: '9.9.9.9', mac: 'XX' }];
  const after = rowsAfter(event('replace', { rows }));
  expect(after).toEqual(rows);
  after[0]!.mac = 'changed';
  expect(rows[0]!.mac).toBe('XX');
});

test('match only looks, so it changes nothing', () => {
  expect(rowsAfter(event('match', { key: '10.0.0.1' }))).toEqual([first, second]);
});

test('applying never changes the table definition or the event', () => {
  const e = event('update', { key: '10.0.0.1', row: { mac: 'ZZ' } });
  const before = { def: structuredClone(def), e: structuredClone(e) };
  const state: TableState = initialTables([def]).t!;
  applyTableEvent(state, def, e);
  applyTableEvent(state, def, event('add', { row: { ip: '10.0.0.3', mac: 'CC' } }));
  expect({ def, e }).toEqual(before);
});

// ---------------------------------------------------------------- highlightFor

test('add highlights the new row’s key; update the new key if it renamed the row, else the key it named', () => {
  expect(highlightFor(def, event('add', { row: { ip: '10.0.0.3', mac: 'CC' } }))).toEqual({ key: '10.0.0.3', type: 'added' });
  expect(highlightFor(def, event('update', { key: '10.0.0.2', row: { mac: 'ZZ' } }))).toEqual({ key: '10.0.0.2', type: 'updated' });
  expect(highlightFor(def, event('update', { key: '10.0.0.2', row: { ip: '10.0.0.9' } }))).toEqual({ key: '10.0.0.9', type: 'updated' });
});

test('match highlights the key it names, and an empty key when it found nothing', () => {
  expect(highlightFor(def, event('match', { key: '10.0.0.1' }))).toEqual({ key: '10.0.0.1', type: 'matched' });
  expect(highlightFor(def, event('match', { key: '' }))).toEqual({ key: '', type: 'matched' });
});

test('remove, clear and replace leave no single row to highlight', () => {
  expect(highlightFor(def, event('remove', { key: '10.0.0.1' }))).toBeNull();
  expect(highlightFor(def, event('clear'))).toBeNull();
  expect(highlightFor(def, event('replace', { rows: [] }))).toBeNull();
});

// ---------------------------------------------------------------- misses

/** The table's state after `events`, applied in order to its starting rows. */
function stateAfter(...events: TableEvent[]): TableState {
  const state = initialTables([def]).t!;
  for (const e of events) applyTableEvent(state, def, e);
  return state;
}

const missing = event('add', { row: { ip: '10.0.0.3', mac: '?' }, miss: true });

test('initialTables starts every table with no row marked as a miss', () => {
  expect(initialTables([def]).t!.missed).toEqual([]);
});

test('an add or update with miss marks its row, by key, until the row changes again without it', () => {
  expect(stateAfter(missing).missed).toEqual(['10.0.0.3']);
  // Another row coming in leaves the mark where it is.
  expect(stateAfter(missing, event('add', { row: { ip: '10.0.0.4', mac: 'DD' } })).missed).toEqual(['10.0.0.3']);
  // The row filled in at last: the mark goes, as the mockup's new row replaces the old one.
  expect(stateAfter(missing, event('update', { key: '10.0.0.3', row: { mac: 'CC' } })).missed).toEqual([]);
  // An update can mark a row that was not a miss, and a renamed row keeps its mark under its new key.
  expect(stateAfter(event('update', { key: '10.0.0.2', row: { mac: '?' }, miss: true })).missed).toEqual(['10.0.0.2']);
  expect(stateAfter(missing, event('update', { key: '10.0.0.3', row: { ip: '10.0.0.9' }, miss: true })).missed).toEqual(['10.0.0.9']);
});

test('a mark goes with its row: removed, cleared or replaced rows keep none, and an update that finds no row marks nothing', () => {
  expect(stateAfter(missing, event('remove', { key: '10.0.0.3' })).missed).toEqual([]);
  expect(stateAfter(missing, event('clear')).missed).toEqual([]);
  expect(stateAfter(missing, event('replace', { rows: [{ ip: '10.0.0.3', mac: 'CC' }] })).missed).toEqual([]);
  expect(stateAfter(missing, event('match', { key: '10.0.0.3' })).missed).toEqual(['10.0.0.3']);
  expect(stateAfter(event('update', { key: 'nobody', row: { mac: '?' }, miss: true })).missed).toEqual([]);
});

test('a miss is a mark of its own, not a highlight: the row it adds is still highlighted as added', () => {
  expect(highlightFor(def, missing)).toEqual({ key: '10.0.0.3', type: 'added' });
});
