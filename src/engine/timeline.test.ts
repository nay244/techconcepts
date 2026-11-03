import { expect, test } from 'vitest';
import { validateLesson } from '../content/define';
import type { FlowScene, Lesson, MessageEvent, SceneEvent, TableEvent } from '../content/schema';
import { fixtureLesson, fixturePlaygroundLesson } from '../content/test-fixtures';
import { currentEvents, deriveState, parseStepParam, positionLabel, resumeLabel, sectionsFor } from './timeline';

const L = validateLesson(fixtureLesson()).lesson;
const S = sectionsFor(4);

/**
 * The fixture lesson with its third step's events replaced, and optionally
 * different starting rows or an extra table. Goes through validateLesson, so
 * a typo in a test event fails loudly instead of testing nothing.
 */
function lessonWith(
  stepThreeEvents: SceneEvent[],
  options: { initialRows?: Record<string, string>[]; secondTable?: boolean; stepOneEvents?: SceneEvent[] } = {},
): Lesson {
  const input = fixtureLesson();
  const scene = input.scene as FlowScene;
  if (options.initialRows) scene.tables[0]!.initialRows = options.initialRows;
  if (options.secondTable) {
    scene.tables.push({ id: 't2', actor: 'a', title: 'Second table', columns: [{ key: 'k', label: 'K' }], keyColumn: 'k', initialRows: [] });
  }
  input.steps[2]!.events = stepThreeEvents;
  if (options.stepOneEvents) input.steps[0]!.events = options.stepOneEvents;
  return validateLesson(input).lesson;
}

/** The row the fixture's step 2 adds to the neighbor table. */
const LAPTOP_ROW = { ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' };

const message = (id: string): MessageEvent => ({
  type: 'message',
  id,
  from: 'a',
  to: ['b'],
  src: '192.168.1.10',
  dst: '192.168.1.20',
  protocol: 'Demo',
  kind: 'request',
  label: id,
  summary: `${id} summary`,
  size: 34,
  time: 0,
});

// ---------------------------------------------------------------- sections and labels

test('sections', () => expect(S).toEqual({ stepCount: 4, tryIt: 5, check: 6, recap: 7, max: 7 }));

test('sections for a longer lesson', () => expect(sectionsFor(6)).toEqual({ stepCount: 6, tryIt: 7, check: 8, recap: 9, max: 9 }));

test('labels', () => {
  expect(resumeLabel(3, 6)).toBe('step 3 of 6');
  expect(resumeLabel(7, 6)).toBe('Try it');
  expect(positionLabel(L, 0)).toBe('Overview');
});

test('every position has a label', () => {
  expect([0, 1, 2, 3, 4, 5, 6, 7].map((p) => positionLabel(L, p))).toEqual([
    'Overview',
    'Say hello',
    'Get an answer',
    'Use the table',
    'When it goes wrong',
    'Try it',
    'Check yourself',
    'Recap',
  ]);
  expect([6, 7, 8, 9].map((p) => resumeLabel(p, 6))).toEqual(['step 6 of 6', 'Try it', 'Check yourself', 'Recap']);
});

// ---------------------------------------------------------------- currentEvents

test('currentEvents gives a step its own events', () => {
  expect(currentEvents(L, 2, null).map((e) => e.id)).toEqual(['m2', 'm3', 't-add']);
  expect(currentEvents(L, 2, 'c1').map((e) => e.id)).toEqual(['m2', 'm3', 't-add']);
});

test('currentEvents gives the chosen Try it variant, and nothing without a valid choice', () => {
  expect(currentEvents(L, 5, 'c2').map((e) => e.id)).toEqual(['c2-hello']);
  expect(currentEvents(L, 5, null)).toEqual([]);
  expect(currentEvents(L, 5, 'nope')).toEqual([]);
});

test('currentEvents is empty at the overview, Check and Recap', () => {
  for (const p of [0, 6, 7]) expect(currentEvents(L, p, 'c1')).toEqual([]);
});

test('a playground lesson has no events anywhere', () => {
  const P = validateLesson(fixturePlaygroundLesson()).lesson;
  for (const p of [0, 1, 2, 3, 4, 5, 6, 7]) expect(currentEvents(P, p, 'c1')).toEqual([]);
  expect(deriveState(P, 2, 0, null)).toEqual({ log: [], tables: {}, activeMessage: null, messageTotal: 0 });
});

// ---------------------------------------------------------------- deriveState

test('overview is empty', () => expect(deriveState(L, 0, 0, null)).toMatchObject({ log: [], activeMessage: null, messageTotal: 4 }));

test('overview starts every table at its initial rows with no highlight', () => {
  expect(deriveState(L, 0, 0, null).tables).toEqual({ t: { rows: [], highlight: null } });
});

test('mid-step derivation', () => {
  const d = deriveState(L, 2, 3, null); // step1 full + m2, m3, table add
  expect(d.log.map((x) => x.eventId)).toEqual(['m1', 'm2', 'm3']);
  expect(d.log[2].tableChange).toBeTruthy();
  expect(d.tables.t.rows).toHaveLength(1);
  expect(d.tables.t.highlight?.type).toBe('added');
  expect(d.activeMessage?.id).toBe('m3');
});

test('log rows are numbered from 1 and carry the message fields', () => {
  const d = deriveState(L, 2, 2, null);
  expect(d.log.map((x) => x.n)).toEqual([1, 2, 3]);
  expect(d.log[0]).toEqual({
    n: 1,
    eventId: 'm1',
    time: 0,
    src: '192.168.1.10',
    dst: '192.168.1.20',
    protocol: 'Demo',
    label: 'Hello',
    summary: 'The laptop says hello.',
    size: 34,
    kind: 'request',
    outcome: 'delivered',
    packet: 'p1',
  });
  // Optional fields are left off, not set to undefined.
  expect(d.log[1]).not.toHaveProperty('packet');
  expect(d.log[1]).not.toHaveProperty('tableChange');
});

test('highlight only for current-step table events', () => expect(deriveState(L, 3, 0, null).tables.t.highlight).toBeNull());

test('a table event in the current step sets the highlight; a message after it leaves it', () => {
  expect(deriveState(L, 3, 1, null).tables.t.highlight).toEqual({ key: '192.168.1.10', type: 'matched' });
  expect(deriveState(L, 2, 2, null).tables.t.highlight).toBeNull();
  expect(deriveState(L, 2, 3, null).tables.t.highlight).toEqual({ key: '192.168.1.10', type: 'added' });
});

test('activeMessage is the last applied message of the current step only', () => {
  expect(deriveState(L, 2, 0, null).activeMessage).toBeNull(); // m1 is applied, but belongs to step 1
  expect(deriveState(L, 2, 1, null).activeMessage?.id).toBe('m2');
  expect(deriveState(L, 3, 1, null).activeMessage).toBeNull(); // the current step has no message
});

test('dropped outcome carried into log', () => expect(deriveState(L, 4, 1, null).log.at(-1)?.outcome).toBe('dropped'));

test('check/recap show end-of-steps state without try-it', () => expect(deriveState(L, 6, 0, 'c1').log).toHaveLength(4));

test('check and recap match the end of the last step, with no highlight or active message', () => {
  for (const p of [6, 7]) {
    const d = deriveState(L, p, 0, 'c1');
    expect(d.log.map((x) => x.eventId)).toEqual(['m1', 'm2', 'm3', 'm4']);
    expect(d.tables.t.rows).toHaveLength(1);
    expect(d.tables.t.highlight).toBeNull();
    expect(d.activeMessage).toBeNull();
    expect(d.messageTotal).toBe(4);
  }
});

test('an event index past the end is the same as the end', () => {
  expect(deriveState(L, 1, 99, null)).toEqual(deriveState(L, 1, 1, null));
  expect(deriveState(L, 5, 99, 'c1')).toEqual(deriveState(L, 5, 1, 'c1'));
});

// ---------------------------------------------------------------- Try it

test('Try it applies every step plus the chosen variant, one event at a time', () => {
  const before = deriveState(L, 5, 0, 'c2');
  expect(before.log.map((x) => x.eventId)).toEqual(['m1', 'm2', 'm3', 'm4']);
  expect(before.activeMessage).toBeNull();

  const after = deriveState(L, 5, 1, 'c2');
  expect(after.log.map((x) => x.eventId)).toEqual(['m1', 'm2', 'm3', 'm4', 'c2-hello']);
  expect(after.log.at(-1)).toMatchObject({ n: 5, outcome: 'dropped' });
  expect(after.activeMessage?.id).toBe('c2-hello');
  expect(after.tables.t.rows).toHaveLength(1);
});

test('Try it without a choice shows the steps only', () => {
  const d = deriveState(L, 5, 0, null);
  expect(d.log).toHaveLength(4);
  expect(d.activeMessage).toBeNull();
  expect(d.messageTotal).toBe(4);
});

test('messageTotal counts the chosen variant at Try it so "Message n of total" never overflows', () => {
  expect(deriveState(L, 5, 1, 'c1').messageTotal).toBe(5);
  expect(deriveState(L, 5, 0, 'c2').messageTotal).toBe(5);
  expect(deriveState(L, 5, 1, 'nope').messageTotal).toBe(4);
  for (const p of [0, 1, 2, 3, 4, 6, 7]) expect(deriveState(L, p, 0, 'c1').messageTotal).toBe(4);
});

// ---------------------------------------------------------------- table operations

test('add, update, remove, clear and replace change the rows', () => {
  const tableEvent = (id: string, op: TableEvent['op'], rest: Partial<TableEvent> = {}): TableEvent => ({
    type: 'table',
    id,
    table: 't',
    op,
    summary: `${id} done`,
    ...rest,
  });
  const base = [
    { ip: '10.0.0.1', mac: 'AA' },
    { ip: '10.0.0.2', mac: 'BB' },
  ];

  // Step 2 has already added the laptop's row after the starting rows by the time step 3 plays.
  const rowsAt = (events: SceneEvent[], index: number) =>
    deriveState(lessonWith(events, { initialRows: base }), 3, index, null).tables.t.rows;

  expect(rowsAt([tableEvent('e1', 'add', { row: { ip: '10.0.0.3', mac: 'CC' } })], 1)).toEqual([...base, LAPTOP_ROW, { ip: '10.0.0.3', mac: 'CC' }]);
  expect(rowsAt([tableEvent('e1', 'update', { key: '10.0.0.2', row: { mac: 'ZZ' } })], 1)).toEqual([base[0], { ip: '10.0.0.2', mac: 'ZZ' }, LAPTOP_ROW]);
  expect(rowsAt([tableEvent('e1', 'remove', { key: '10.0.0.1' })], 1)).toEqual([base[1], LAPTOP_ROW]);
  expect(rowsAt([tableEvent('e1', 'clear')], 1)).toEqual([]);
  expect(rowsAt([tableEvent('e1', 'replace', { rows: [{ ip: '9.9.9.9', mac: 'XX' }] })], 1)).toEqual([{ ip: '9.9.9.9', mac: 'XX' }]);
  expect(rowsAt([tableEvent('e1', 'match', { key: '10.0.0.1' })], 1)).toEqual([...base, LAPTOP_ROW]);
  // Before the event has played, only step 2's add has changed the rows.
  expect(rowsAt([tableEvent('e1', 'clear')], 0)).toEqual([...base, LAPTOP_ROW]);
});

test('update and match highlight the key they name; add highlights the new row key', () => {
  const events: SceneEvent[] = [
    { type: 'table', id: 'e1', table: 't', op: 'update', key: '10.0.0.2', row: { mac: 'ZZ' }, summary: 'updated' },
    { type: 'table', id: 'e2', table: 't', op: 'match', key: '10.0.0.1', summary: 'matched' },
    { type: 'table', id: 'e3', table: 't', op: 'add', row: { ip: '10.0.0.3', mac: 'CC' }, summary: 'added' },
  ];
  const L2 = lessonWith(events, {
    initialRows: [
      { ip: '10.0.0.1', mac: 'AA' },
      { ip: '10.0.0.2', mac: 'BB' },
    ],
  });
  expect(deriveState(L2, 3, 1, null).tables.t.highlight).toEqual({ key: '10.0.0.2', type: 'updated' });
  expect(deriveState(L2, 3, 2, null).tables.t.highlight).toEqual({ key: '10.0.0.1', type: 'matched' });
  expect(deriveState(L2, 3, 3, null).tables.t.highlight).toEqual({ key: '10.0.0.3', type: 'added' });
});

test('a match that found nothing highlights an empty key', () => {
  const L2 = lessonWith([{ type: 'table', id: 'e1', table: 't', op: 'match', key: '', summary: 'no match' }]);
  expect(deriveState(L2, 3, 1, null).tables.t.highlight).toEqual({ key: '', type: 'matched' });
});

test('remove, clear and replace leave nothing to highlight, even after an earlier highlight', () => {
  const seconds: SceneEvent[] = [
    { type: 'table', id: 'e2', table: 't', op: 'remove', key: '10.0.0.1', summary: 'gone' },
    { type: 'table', id: 'e2', table: 't', op: 'clear', summary: 'cleared' },
    { type: 'table', id: 'e2', table: 't', op: 'replace', rows: [], summary: 'replaced' },
  ];
  for (const second of seconds) {
    const L2 = lessonWith([{ type: 'table', id: 'e1', table: 't', op: 'match', key: '10.0.0.1', summary: 'hit' }, second], {
      initialRows: [{ ip: '10.0.0.1', mac: 'AA' }],
    });
    expect(deriveState(L2, 3, 1, null).tables.t.highlight).toMatchObject({ type: 'matched' });
    expect(deriveState(L2, 3, 2, null).tables.t.highlight).toBeNull();
  }
});

test('each table keeps the highlight of its own last event', () => {
  const L2 = lessonWith(
    [
      { type: 'table', id: 'e1', table: 't', op: 'add', row: { ip: '10.0.0.1', mac: 'AA' }, summary: 'one' },
      { type: 'table', id: 'e2', table: 't2', op: 'add', row: { k: 'x' }, summary: 'two' },
    ],
    { secondTable: true },
  );
  const d = deriveState(L2, 3, 2, null);
  expect(d.tables.t.highlight).toEqual({ key: '10.0.0.1', type: 'added' });
  expect(d.tables.t2.highlight).toEqual({ key: 'x', type: 'added' });
  expect(deriveState(L2, 3, 1, null).tables.t2).toEqual({ rows: [], highlight: null });
});

test('table events from earlier steps change the rows but never the highlight', () => {
  const d = deriveState(L, 4, 0, null);
  expect(d.tables.t.rows).toHaveLength(1);
  expect(d.tables.t.highlight).toBeNull();
});

// ---------------------------------------------------------------- log and table changes

test('table summaries are joined onto the most recent log row', () => {
  const L2 = lessonWith([
    { type: 'table', id: 'e1', table: 't', op: 'match', key: '192.168.1.10', summary: 'Found it.' },
    message('m5'),
    { type: 'table', id: 'e2', table: 't', op: 'update', key: '192.168.1.10', row: { mac: 'ZZ' }, summary: 'Changed it.' },
  ]);
  // The match arrives before this step's first message, so it joins the previous step's last row.
  expect(deriveState(L2, 3, 1, null).log.at(-1)?.tableChange).toBe('The server remembers the laptop.; Found it.');
  const d = deriveState(L2, 3, 3, null);
  expect(d.log.map((x) => [x.eventId, x.tableChange])).toEqual([
    ['m1', undefined],
    ['m2', undefined],
    ['m3', 'The server remembers the laptop.; Found it.'],
    ['m5', 'Changed it.'],
  ]);
});

test('a table event before any message is applied to the table but not the log', () => {
  const L2 = lessonWith([{ type: 'table', id: 'e1', table: 't', op: 'match', key: 'x', summary: 'ignored' }], {
    stepOneEvents: [
      { type: 'table', id: 'first', table: 't', op: 'add', row: { ip: '10.0.0.1', mac: 'AA' }, summary: 'Remembered.' },
      message('m1'),
    ],
  });
  const early = deriveState(L2, 1, 1, null);
  expect(early.log).toEqual([]);
  expect(early.tables.t.rows).toEqual([{ ip: '10.0.0.1', mac: 'AA' }]);
  expect(early.tables.t.highlight).toEqual({ key: '10.0.0.1', type: 'added' });

  const later = deriveState(L2, 1, 2, null);
  expect(later.log).toHaveLength(1);
  expect(later.log[0]).not.toHaveProperty('tableChange');
});

// ---------------------------------------------------------------- purity

test('deriving never changes the lesson, and the same inputs give the same answer', () => {
  const L2 = lessonWith(
    [{ type: 'table', id: 'e1', table: 't', op: 'update', key: '10.0.0.1', row: { mac: 'ZZ' }, summary: 'changed' }],
    { initialRows: [{ ip: '10.0.0.1', mac: 'AA' }] },
  );
  const snapshot = structuredClone(L2);
  const first = deriveState(L2, 3, 1, null);
  expect(first.tables.t.rows).toEqual([{ ip: '10.0.0.1', mac: 'ZZ' }, LAPTOP_ROW]);
  expect(L2).toEqual(snapshot);
  expect(deriveState(L2, 3, 1, null)).toEqual(first);
  expect(deriveState(L2, 0, 0, null).tables.t.rows).toEqual([{ ip: '10.0.0.1', mac: 'AA' }]);
});

// ---------------------------------------------------------------- parseStepParam

test.each([
  ['?step=abc', null],
  ['?step=2.5', null],
  ['?step=-2', null],
  ['?step=3', 3],
  ['?step=999', 7],
  ['', null],
])('parseStepParam(%j)', (q, want) => expect(parseStepParam(q as string, S)).toBe(want));

test.each([
  ['?step=', null],
  ['?step=0', 0],
  ['?step=7', 7],
  ['?step=1e2', null],
  ['?step=%203', null],
  ['?other=3', null],
  ['?step=2&step=5', 2],
  ['?a=1&step=4', 4],
  ['step=3', 3],
])('parseStepParam(%j) is %j', (q, want) => expect(parseStepParam(q, S)).toBe(want));
