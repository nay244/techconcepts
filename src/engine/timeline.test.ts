import { expect, test } from 'vitest';
import type { LegacyLessonInput, LegacyUnitInput } from '../content/legacy';
import type { Board, Lesson, MessageEvent, SceneEvent } from '../content/schema';
import { liftedFixture, makeLesson, makeTwoUnitLesson, makeUnit } from '../content/test-fixtures';
import { applyTableEvent, initialTables } from './tables';
import {
  appliedEvents,
  deriveState,
  parseStepParam,
  positionLabel,
  positionOf,
  resumeLabel,
  slotsFor,
  stepEvents,
  type Slot,
} from './timeline';

/** Goes through the legacy schema, so a typo in a test lesson fails loudly instead of testing nothing. */
const build = (input: LegacyLessonInput): Lesson => liftedFixture(input);

/** The row the fixture's step 2 adds to the neighbor table. */
const LAPTOP_ROW = { ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' };
/** The row unit 2 of the two-unit fixture starts with, so its table differs from unit 1's. */
const PHONE_ROW = { ip: '192.168.1.20', mac: '00:00:5E:00:53:0B' };

/**
 * Two units, alpha and beta, each with the fixture's five steps:
 * m1 · m2, t-add · t-match, n1 · m3 (dropped) · m4.
 * Positions: alpha 0 Overview, 1–5 steps, 6 Learn, 7 Practice; beta 8 Overview, 9–13 steps, 14 Learn, 15 Practice.
 */
function twoUnits(): LegacyLessonInput {
  const input = makeTwoUnitLesson();
  const panel = input.units[1]!.scene.panel;
  if (panel?.type !== 'table') throw new Error('the fixture should have a table panel');
  panel.table.initialRows = [PHONE_ROW];
  return input;
}

const ONE = build(makeLesson());
const TWO = build(twoUnits());

const ids = (events: { id: string }[]) => events.map((e) => e.id);
const logIds = (lesson: Lesson, p: number, eventIndex: number) => deriveState(lesson, p, eventIndex).log.map((row) => row.eventId);

// ---------------------------------------------------------------- slots and positions

test('slotsFor lists overview, steps, learn, practice for each unit in order', () => {
  const unitSlots = (unit: number): Slot[] => [
    { unit, kind: 'overview', step: 0 },
    { unit, kind: 'step', step: 1 },
    { unit, kind: 'step', step: 2 },
    { unit, kind: 'step', step: 3 },
    { unit, kind: 'step', step: 4 },
    { unit, kind: 'step', step: 5 },
    { unit, kind: 'learn', step: 0 },
    { unit, kind: 'practice', step: 0 },
  ];
  expect(slotsFor(ONE)).toEqual(unitSlots(0));
  expect(slotsFor(TWO)).toEqual([...unitSlots(0), ...unitSlots(1)]);
});

test('slotsFor follows each unit’s own step count', () => {
  const input = twoUnits();
  input.units[1]!.steps = input.units[1]!.steps.slice(0, 4);
  const kinds = slotsFor(build(input)).map((s) => (s.kind === 'step' ? `${s.unit}:${s.step}` : `${s.unit}:${s.kind}`));
  expect(kinds).toEqual([
    '0:overview', '0:1', '0:2', '0:3', '0:4', '0:5', '0:learn', '0:practice',
    '1:overview', '1:1', '1:2', '1:3', '1:4', '1:learn', '1:practice',
  ]);
});

test('positionOf and slotsFor agree for every slot', () => {
  for (const lesson of [ONE, TWO]) {
    slotsFor(lesson).forEach((slot, p) => {
      expect(positionOf(lesson, slot.unit, slot.kind, slot.kind === 'step' ? slot.step : undefined)).toBe(p);
    });
  }
  expect(positionOf(TWO, 1, 'overview')).toBe(8);
  expect(positionOf(TWO, 1, 'step', 2)).toBe(10);
  expect(positionOf(TWO, 1, 'learn')).toBe(14);
  expect(positionOf(TWO, 1, 'practice')).toBe(15);
});

test('positionOf a step with no step number is the unit’s first step', () => {
  expect(positionOf(TWO, 1, 'step')).toBe(9);
});

test('positionOf throws for a slot the lesson does not have', () => {
  expect(() => positionOf(ONE, 1, 'overview')).toThrow(RangeError);
  expect(() => positionOf(ONE, -1, 'learn')).toThrow(RangeError);
  expect(() => positionOf(ONE, 0, 'step', 0)).toThrow(RangeError);
  expect(() => positionOf(ONE, 0, 'step', 6)).toThrow(RangeError);
  expect(() => positionOf(ONE, 0, 'step', 1.5)).toThrow(RangeError);
});

// ---------------------------------------------------------------- labels

test('every position has a label', () => {
  const steps = ['Neighbor Hello', 'Neighbor Reply', 'Table Lookup', 'Lost Message', 'Retransmission'];
  expect(slotsFor(ONE).map((_, p) => positionLabel(ONE, p))).toEqual(['Overview', ...steps, 'Learn', 'Practice']);
  expect(slotsFor(TWO).map((_, p) => positionLabel(TWO, p))).toEqual([
    'Overview', ...steps, 'Learn', 'Practice',
    'Overview', ...steps, 'Learn', 'Practice',
  ]);
});

test('a position out of range is labelled as the nearest one', () => {
  expect(positionLabel(ONE, -3)).toBe('Overview');
  expect(positionLabel(ONE, 99)).toBe('Practice');
});

test('resumeLabel in a one-unit lesson: Overview, step n of N, Learn, Practice', () => {
  expect(slotsFor(ONE).map((_, p) => resumeLabel(ONE, p))).toEqual([
    'Overview',
    'step 1 of 5',
    'step 2 of 5',
    'step 3 of 5',
    'step 4 of 5',
    'step 5 of 5',
    'Learn',
    'Practice',
  ]);
});

test('resumeLabel names the protocol in a multi-unit lesson', () => {
  const internet = build(makeLesson({ units: [makeUnit('http', { name: 'HTTP' }), makeUnit('dns', { name: 'DNS' })] }));
  expect(resumeLabel(internet, 3)).toBe('HTTP, step 3 of 5');
  expect(resumeLabel(internet, 6)).toBe('HTTP, Learn');
  expect(resumeLabel(internet, 7)).toBe('HTTP, Practice');
  expect(resumeLabel(internet, 8)).toBe('DNS, Overview');
  expect(resumeLabel(internet, 10)).toBe('DNS, step 2 of 5');
  expect(resumeLabel(internet, 14)).toBe('DNS, Learn');
  expect(resumeLabel(internet, 15)).toBe('DNS, Practice');
});

// ---------------------------------------------------------------- stepEvents

test('stepEvents gives a step its own events, and none off a step', () => {
  expect(ids(stepEvents(ONE, 2))).toEqual(['m2', 't-add']);
  expect(ids(stepEvents(ONE, 3))).toEqual(['t-match', 'n1']);
  for (const p of [0, 6, 7]) expect(stepEvents(ONE, p)).toEqual([]);
  // The lesson's own array, read-only, from the right unit.
  expect(stepEvents(TWO, 10)).toBe(TWO.units[1]!.steps[1]!.events);
  for (const p of [8, 14, 15]) expect(stepEvents(TWO, p)).toEqual([]);
});

// ---------------------------------------------------------------- deriveState

test('the Overview applies nothing: tables at their starting rows, no log, cues, board or active event', () => {
  expect(deriveState(ONE, 0, 0)).toEqual({
    unit: 0,
    slot: { unit: 0, kind: 'overview', step: 0 },
    log: [],
    tables: { t: { rows: [], highlight: null, missed: [] } },
    cues: [],
    board: null,
    active: null,
    events: [],
  });
  // The event index means nothing off a step.
  expect(deriveState(ONE, 0, 5)).toEqual(deriveState(ONE, 0, 0));
});

/**
 * An independent reference: the events of steps 1…k−1 in full and the first
 * `i` of step k, applied to fresh tables one by one.
 */
function reference(lesson: Lesson, unit: number, k: number, i: number) {
  const u = lesson.units[unit]!;
  const events: SceneEvent[] = [...u.steps.slice(0, k - 1).flatMap((s) => s.events), ...u.steps[k - 1]!.events.slice(0, i)];
  const panel = u.scene.panel;
  const defs = panel?.type === 'table' ? [panel.table] : [];
  const tables = initialTables(defs);
  for (const e of events) if (e.type === 'table') applyTableEvent(tables[e.table]!, defs.find((d) => d.id === e.table)!, e);
  return { log: events.filter((e) => e.type !== 'table').map((e) => e.id), rows: Object.fromEntries(Object.entries(tables).map(([id, t]) => [id, t.rows])) };
}

test('deriving at step 3 equals applying steps 1–2 then step 3 up to eventIndex, from scratch', () => {
  // Step 3 is t-match then n1, after m1 (step 1) and m2, t-add (step 2).
  expect(logIds(ONE, 3, 0)).toEqual(['m1', 'm2']);
  expect(deriveState(ONE, 3, 0).tables.t.rows).toEqual([LAPTOP_ROW]);
  expect(logIds(ONE, 3, 1)).toEqual(['m1', 'm2']);
  expect(logIds(ONE, 3, 2)).toEqual(['m1', 'm2', 'n1']);
  // An event index past the end is the end; a negative one is the start.
  expect(deriveState(ONE, 3, 99)).toEqual(deriveState(ONE, 3, 2));
  expect(deriveState(ONE, 3, -1)).toEqual(deriveState(ONE, 3, 0));

  // Every step and event index of both units matches the reference.
  for (const lesson of [ONE, TWO]) {
    slotsFor(lesson).forEach((slot, p) => {
      if (slot.kind !== 'step') return;
      const count = stepEvents(lesson, p).length;
      for (let i = 0; i <= count; i++) {
        const d = deriveState(lesson, p, i);
        const want = reference(lesson, slot.unit, slot.step, i);
        expect(d.log.map((row) => row.eventId)).toEqual(want.log);
        expect(Object.fromEntries(Object.entries(d.tables).map(([id, t]) => [id, t.rows]))).toEqual(want.rows);
      }
    });
  }
});

test('deriving twice, or step 3 and then step 2, gives the same answer as a fresh derivation, and never changes the lesson', () => {
  const snapshot = structuredClone(TWO);
  const fresh = deriveState(TWO, 2, 2);

  // Derive further on first, then come back: nothing carries over.
  deriveState(TWO, 3, 2);
  deriveState(TWO, 6, 0);
  expect(deriveState(TWO, 2, 2)).toEqual(fresh);
  expect(deriveState(TWO, 2, 2)).toEqual(deriveState(TWO, 2, 2));

  // Changing what a derivation returned changes neither the lesson nor the next derivation.
  const d = deriveState(TWO, 13, 1);
  d.tables.t.rows.push({ ip: 'x', mac: 'y' });
  d.tables.t.rows[0]!.mac = 'changed';
  d.log[0]!.cells.source = 'changed';
  expect(deriveState(TWO, 13, 1).tables.t.rows).toEqual([PHONE_ROW, LAPTOP_ROW]);
  expect(deriveState(TWO, 13, 1).log[0]!.cells.source).toBe('192.168.1.10');
  expect(deriveState(TWO, 8, 0).tables.t.rows).toEqual([PHONE_ROW]);

  expect(TWO).toEqual(snapshot);
});

test('units never share state: unit 2 starts from initial rows and an empty log', () => {
  // The end of unit 1 has the laptop's row and five log rows.
  expect(deriveState(TWO, 7, 0).tables.t.rows).toEqual([LAPTOP_ROW]);
  expect(deriveState(TWO, 7, 0).log).toHaveLength(5);

  const overview = deriveState(TWO, 8, 0);
  expect(overview).toMatchObject({ unit: 1, slot: { unit: 1, kind: 'overview', step: 0 }, log: [], cues: [], board: null, active: null });
  expect(overview.tables).toEqual({ t: { rows: [PHONE_ROW], highlight: null, missed: [] } });

  // Unit 2's own steps number its log from 1 and build on its own starting rows.
  const first = deriveState(TWO, 9, 1);
  expect(first.log.map((row) => [row.n, row.eventId])).toEqual([[1, 'm1']]);
  expect(deriveState(TWO, 10, 2).tables.t.rows).toEqual([PHONE_ROW, LAPTOP_ROW]);
  expect(deriveState(TWO, 14, 0).log.map((row) => row.n)).toEqual([1, 2, 3, 4, 5]);
});

test('Learn and Practice show every step applied', () => {
  const end = deriveState(ONE, 5, 1); // the last step, complete
  for (const p of [6, 7]) {
    const d = deriveState(ONE, p, 0);
    expect(d.log.map((row) => row.eventId)).toEqual(['m1', 'm2', 'n1', 'm3', 'm4']);
    expect(d.log).toEqual(end.log);
    expect(d.tables).toEqual({ t: { rows: [LAPTOP_ROW], highlight: null, missed: [] } });
    // No step is current there: nothing is highlighted, active or marked current.
    expect(d.active).toBeNull();
    expect(d.events).toEqual([]);
    expect(d.cues.map((c) => [c.eventId, c.current])).toEqual([
      ['m1', false],
      ['n1', false],
    ]);
    expect(deriveState(ONE, p, 99)).toEqual(d);
  }
  expect(deriveState(TWO, 14, 0).slot).toEqual({ unit: 1, kind: 'learn', step: 0 });
  expect(deriveState(TWO, 15, 0).slot).toEqual({ unit: 1, kind: 'practice', step: 0 });
});

test('a position out of range derives the nearest one', () => {
  expect(deriveState(ONE, -2, 0)).toEqual(deriveState(ONE, 0, 0));
  expect(deriveState(ONE, 99, 0)).toEqual(deriveState(ONE, 7, 0));
});

test('only the current step highlights a table row', () => {
  // Step 2: m2, then t-add.
  expect(deriveState(ONE, 2, 1).tables.t.highlight).toBeNull();
  expect(deriveState(ONE, 2, 2).tables.t.highlight).toEqual({ key: '192.168.1.10', type: 'added' });
  // Step 3: the add belongs to step 2 now, so the row is there but not highlighted until t-match plays.
  expect(deriveState(ONE, 3, 0).tables.t).toEqual({ rows: [LAPTOP_ROW], highlight: null, missed: [] });
  expect(deriveState(ONE, 3, 1).tables.t.highlight).toEqual({ key: '192.168.1.10', type: 'matched' });
  // A note after it leaves the highlight where it was.
  expect(deriveState(ONE, 3, 2).tables.t.highlight).toEqual({ key: '192.168.1.10', type: 'matched' });
  // Later steps have no table events, so nothing glows.
  for (const [p, i] of [[4, 0], [4, 1], [5, 1]] as const) expect(deriveState(ONE, p, i).tables.t.highlight).toBeNull();
});

test('a unit’s tables are its panel’s: one for a table, rules and conns for a rules panel, none for bits or no panel', () => {
  const rules = makeLesson();
  const unit = rules.units[0]!;
  unit.scene.panel = {
    type: 'rules',
    rules: { id: 'rules', title: 'Rules', columns: [{ key: 'n', label: '#' }], keyColumn: 'n', initialRows: [{ n: '1' }], empty: 'No rules.' },
    conns: { id: 'conns', title: 'Connections', columns: [{ key: 'who', label: 'Who' }], keyColumn: 'who', initialRows: [], empty: 'None yet.' },
  };
  unit.steps[1]!.events[1] = { type: 'table', id: 't-add', table: 'conns', op: 'add', row: { who: 'laptop' }, summary: 'Remembered.' };
  unit.steps[2]!.events[0] = { type: 'table', id: 't-match', table: 'rules', op: 'match', key: '1', summary: 'Rule 1 matches.' };
  const R = build(rules);
  expect(deriveState(R, 0, 0).tables).toEqual({
    rules: { rows: [{ n: '1' }], highlight: null, missed: [] },
    conns: { rows: [], highlight: null, missed: [] },
  });
  expect(deriveState(R, 3, 1).tables).toEqual({
    rules: { rows: [{ n: '1' }], highlight: { key: '1', type: 'matched' }, missed: [] },
    conns: { rows: [{ who: 'laptop' }], highlight: null, missed: [] },
  });

  const withoutTables = (panel: LegacyUnitInput['scene']['panel']): Lesson => {
    const input = makeLesson({ figure: 'subnet' });
    const u = input.units[0]!;
    u.scene.panel = panel;
    u.steps = u.steps.map((s) => ({ ...s, events: s.events.filter((e) => e.type !== 'table') }));
    return build(input);
  };
  for (const panel of [{ type: 'bits' as const }, null]) {
    const L = withoutTables(panel);
    expect(deriveState(L, 0, 0).tables).toEqual({});
    expect(deriveState(L, 7, 0).tables).toEqual({});
  }
});

test('message and note events add log rows numbered from 1; table events add none', () => {
  const d = deriveState(ONE, 5, 1);
  expect(d.log.map((row) => row.n)).toEqual([1, 2, 3, 4, 5]);
  expect(d.log[0]).toEqual({
    n: 1,
    eventId: 'm1',
    type: 'message',
    kind: 'request',
    outcome: 'delivered',
    from: 'laptop',
    to: 'router',
    tag: 'Hello',
    cells: { source: '192.168.1.10', destination: '192.168.1.1', size: '34 B' },
    plain: 'The laptop says hello to the router.',
  });
  expect(d.log[1]).toMatchObject({ eventId: 'm2', kind: 'response', outcome: 'delivered', from: 'router', to: 'laptop' });
  expect(d.log[2]).toEqual({
    n: 3,
    eventId: 'n1',
    type: 'note',
    kind: null,
    outcome: null,
    from: null,
    to: null,
    tag: null,
    cells: { source: '192.168.1.1' },
    plain: 'The router already knows the laptop.',
  });
  expect(d.log[3]).toMatchObject({ eventId: 'm3', outcome: 'dropped' });
  // The cells are the event's log row as written, in a copy of their own.
  const m1 = ONE.units[0]!.steps[0]!.events[0] as MessageEvent;
  expect(d.log[0]!.cells).toEqual(m1.log);
  expect(d.log[0]!.cells).not.toBe(m1.log);
});

test('a blocked message carries its outcome into the log', () => {
  const input = makeLesson();
  const m4 = input.units[0]!.steps[4]!.events[0]!;
  if (m4.type !== 'message') throw new Error('m4 should be a message');
  m4.outcome = 'blocked';
  expect(deriveState(build(input), 5, 1).log.at(-1)).toMatchObject({ eventId: 'm4', outcome: 'blocked' });
});

test('cues accumulate in order, with current marking the current step’s', () => {
  expect(deriveState(ONE, 1, 0).cues).toEqual([]);
  expect(deriveState(ONE, 1, 1).cues).toEqual([{ cue: 'glow', eventId: 'm1', current: true }]);
  expect(deriveState(ONE, 2, 0).cues).toEqual([{ cue: 'glow', eventId: 'm1', current: false }]);
  expect(deriveState(ONE, 3, 2).cues).toEqual([
    { cue: 'glow', eventId: 'm1', current: false },
    { cue: 'status', arg: 'Known neighbor', eventId: 'n1', current: true },
  ]);
  // A cue with no arg has no arg key at all.
  expect(deriveState(ONE, 1, 1).cues[0]).not.toHaveProperty('arg');
  expect(deriveState(ONE, 4, 0).cues.every((c) => !c.current)).toBe(true);
});

test('active is the last applied event of the current step, or null', () => {
  expect(deriveState(ONE, 0, 0).active).toBeNull();
  expect(deriveState(ONE, 2, 0).active).toBeNull(); // m1 is applied, but belongs to step 1
  expect(deriveState(ONE, 2, 1).active?.id).toBe('m2');
  expect(deriveState(ONE, 2, 2).active?.id).toBe('t-add'); // a table event counts too
  expect(deriveState(ONE, 3, 2).active?.id).toBe('n1');
  expect(deriveState(ONE, 6, 0).active).toBeNull();
  // It is the lesson's own event.
  expect(deriveState(ONE, 1, 1).active).toBe(ONE.units[0]!.steps[0]!.events[0]);
});

test('appliedEvents are the current step’s events up to and including active, and none before the first or off a step', () => {
  expect(appliedEvents(deriveState(ONE, 0, 0))).toEqual([]);
  expect(appliedEvents(deriveState(ONE, 2, 0))).toEqual([]);
  expect(ids(appliedEvents(deriveState(ONE, 2, 1)))).toEqual(['m2']);
  expect(ids(appliedEvents(deriveState(ONE, 2, 2)))).toEqual(['m2', 't-add']);
  expect(ids(appliedEvents(deriveState(ONE, 3, 2)))).toEqual(['t-match', 'n1']);
  expect(appliedEvents(deriveState(ONE, 6, 0))).toEqual([]);
  // The lesson's own events.
  expect(appliedEvents(deriveState(ONE, 1, 1))[0]).toBe(ONE.units[0]!.steps[0]!.events[0]);
});

test('events are the ones that play at the position', () => {
  expect(ids(deriveState(ONE, 2, 0).events)).toEqual(['m2', 't-add']);
  expect(deriveState(TWO, 11, 1).events).toBe(stepEvents(TWO, 11));
  expect(deriveState(ONE, 0, 0).events).toEqual([]);
});

test('board is the latest note board, null before any', () => {
  const B1: Board = { addr: '192.168.1.10', who: 'Laptop', prefix: null };
  const B2: Board = { addr: '192.168.1.10', who: 'Laptop', prefix: 24, mask: true, pick: 'net' };
  const input = makeLesson({ figure: 'subnet' });
  const steps = input.units[0]!.steps;
  const n1 = steps[2]!.events[1]!;
  if (n1.type !== 'note') throw new Error('n1 should be a note');
  n1.board = B1;
  steps[4]!.events.push(
    { type: 'note', id: 'n2', log: {}, plain: 'The mask marks the network part.', board: B2 },
    { type: 'note', id: 'n3', log: {}, plain: 'A note that says nothing about the bits.' },
  );
  const L = build(input);

  for (const [p, i] of [[0, 0], [1, 1], [2, 2], [3, 0], [3, 1]] as const) expect(deriveState(L, p, i).board).toBeNull();
  expect(deriveState(L, 3, 2).board).toEqual(B1);
  expect(deriveState(L, 4, 1).board).toEqual(B1); // a message does not change it
  expect(deriveState(L, 5, 1).board).toEqual(B1);
  expect(deriveState(L, 5, 2).board).toEqual(B2);
  expect(deriveState(L, 5, 3).board).toEqual(B2); // a note without a board leaves it
  expect(deriveState(L, 6, 0).board).toEqual(B2);
  expect(deriveState(L, 7, 0).board).toEqual(B2);
});

// ---------------------------------------------------------------- parseStepParam

test('parseStepParam: abc, 2.5, -1 → null; 999 → last position; 9 lands in unit 2 of the fixture', () => {
  // null means "no usable step": the console stays at the Overview.
  for (const q of ['?step=abc', '?step=2.5', '?step=-1']) {
    expect(parseStepParam(q, ONE)).toBeNull();
    expect(parseStepParam(q, TWO)).toBeNull();
    expect(slotsFor(TWO)[parseStepParam(q, TWO) ?? 0]).toEqual({ unit: 0, kind: 'overview', step: 0 });
  }

  // 999 is clamped to the last position: the last unit's Practice.
  expect(parseStepParam('?step=999', ONE)).toBe(7);
  expect(parseStepParam('?step=999', TWO)).toBe(15);
  expect(slotsFor(TWO)[15]).toEqual({ unit: 1, kind: 'practice', step: 0 });

  // A valid number counts across units: 9 is unit 2's first step.
  const p = parseStepParam('?step=9', TWO);
  expect(p).toBe(9);
  expect(slotsFor(TWO)[p!]).toEqual({ unit: 1, kind: 'step', step: 1 });
  expect(deriveState(TWO, p!, 0)).toMatchObject({ unit: 1, log: [], tables: { t: { rows: [PHONE_ROW] } } });
  expect(positionLabel(TWO, p!)).toBe('Neighbor Hello');
});

test.each([
  ['', null],
  ['?step=', null],
  ['?step=0', 0],
  ['?step=3', 3],
  ['?step=7', 7],
  ['?step=8', 7],
  ['?step=007', 7],
  ['?step=1e2', null],
  ['?step=%203', null],
  ['?step=+3', null],
  ['?other=3', null],
  ['?step=2&step=5', 2],
  ['?a=1&step=4', 4],
  ['step=3', 3],
])('parseStepParam(%j) is %j in a one-unit lesson', (q, want) => expect(parseStepParam(q, ONE)).toBe(want));
