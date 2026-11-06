import { expect, test } from 'vitest';
import type { TableDef } from '../schema';
import { eventLog, messagesFor, type MockupMessage } from './internet-events';

const pieces: TableDef = {
  id: 'pieces',
  title: 'What the laptop has',
  columns: [
    { key: 'piece', label: 'Piece' },
    { key: 'bytes', label: 'Bytes' },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'piece',
  initialRows: [],
  empty: 'Nothing yet.',
};

/** A message as the mockup writes it, with only what every message has. */
function mockup(o: Partial<MockupMessage> = {}): MockupMessage {
  return {
    tag: 'SYN',
    from: 'laptop',
    to: 'web',
    proto: 'TCP',
    via: 'IP',
    kind: 'request',
    time: '0.000s',
    src: '192.168.1.100:50422',
    dst: '203.0.113.80:80',
    size: '74 B',
    sum: 'Hello. My numbers start here.',
    info: 'SYN, seq 0',
    ...o,
  };
}

test('msg turns a mockup message into a message event: its tag, places, carrier, log row and plain words', () => {
  const msg = messagesFor(pieces);
  expect(msg(mockup())).toEqual([
    {
      type: 'message',
      id: 'm1',
      from: 'laptop',
      to: 'web',
      tag: 'SYN',
      kind: 'request',
      over: 'IP',
      log: { time: '0.000s', source: '192.168.1.100:50422', destination: '203.0.113.80:80', protocol: 'TCP', info: 'SYN, seq 0', size: '74 B' },
      plain: 'Hello. My numbers start here.',
    },
  ]);
  // Each message of the unit takes the next number.
  expect(msg(mockup({ tag: 'SYN-ACK', kind: 'response', fast: true }))[0]).toMatchObject({ id: 'm2', kind: 'response', fast: true });
  // Another unit counts from 1 again.
  expect(messagesFor(pieces)(mockup())[0]!.id).toBe('m1');
});

test('a broadcast is a message of kind broadcast, and a lost one is dropped where the mockup loses it', () => {
  const msg = messagesFor(null);
  expect(msg(mockup({ bcast: true }))[0]).toMatchObject({ kind: 'broadcast' });
  expect(msg(mockup({ lost: 0.55 }))[0]).toMatchObject({ outcome: 'dropped', dropAt: 0.55 });
  expect(msg(mockup())[0]).not.toHaveProperty('outcome');
});

test('what a message changes once it lands becomes the network map’s cues, in one order', () => {
  const msg = messagesFor(null);
  const cues = (o: Partial<MockupMessage>) => msg(mockup(o))[0]!;
  expect(cues({ st: 'Connected', known: true, conn: ['open', 'laptop>web'] })).toMatchObject({
    cues: [{ cue: 'status', arg: 'Connected' }, { cue: 'status-known' }, { cue: 'conn', arg: 'open laptop>web' }],
  });
  expect(cues({ st: 'Page loaded', done: true, page: 'full', conn: ['seal', 'laptop>web'] })).toMatchObject({
    cues: [{ cue: 'status', arg: 'Page loaded' }, { cue: 'status-done' }, { cue: 'conn', arg: 'seal laptop>web' }, { cue: 'page', arg: 'full' }],
  });
  // FTP's data line is the connection's second line.
  expect(cues({ conn: ['close', 'laptop>files', 'data'] })).toMatchObject({ cues: [{ cue: 'conn', arg: 'close laptop>files data' }] });
  // A letter on a tray, the padlock, and the laptop's address texts.
  expect(cues({ hold: { out: false, in: true } })).toMatchObject({ cues: [{ cue: 'tray', arg: 'out off' }, { cue: 'tray', arg: 'in on' }] });
  expect(cues({ hold: { lock: true }, addr: '192.168.1.100', url: 'Connected' })).toMatchObject({
    cues: [{ cue: 'lock' }, { cue: 'addr', arg: '192.168.1.100' }, { cue: 'url', arg: 'Connected' }],
  });
  // A message that changes nothing carries no cues at all.
  expect(cues({})).not.toHaveProperty('cues');
});

test('each row a message brings adds a row to the table, and a row it brings again changes that row', () => {
  const msg = messagesFor(pieces);
  const first = msg(mockup({ tag: 'PIECE 1', rows: [{ key: '1', cells: ['1', '1–1460', 'Arrived'] }] }));
  expect(first).toHaveLength(2);
  expect(first[1]).toEqual({
    type: 'table',
    id: 'pieces-1',
    table: 'pieces',
    op: 'add',
    row: { piece: '1', bytes: '1–1460', status: 'Arrived' },
    summary: 'Added to What the laptop has: 1, 1–1460, Arrived.',
  });
  const third = msg(
    mockup({
      tag: 'PIECE 3',
      rows: [
        { key: '2', cells: ['2', '1461–2920', 'Missing'], miss: true },
        { key: '3', cells: ['3', '2921–4380', 'Arrived, held'] },
      ],
    }),
  );
  expect(third.map((e) => e.id)).toEqual(['m2', 'pieces-2', 'pieces-3']);
  expect(third[1]).toMatchObject({ op: 'add', row: { piece: '2', status: 'Missing' }, miss: true });
  expect(third[1]!.type === 'table' && third[1]!.summary).toBe('Added to What the laptop has: 2, 1461–2920, Missing. A miss.');
  expect(third[2]).not.toHaveProperty('miss');
  const resent = msg(mockup({ tag: 'PIECE 2', rows: [{ key: '2', cells: ['2', '1461–2920', 'Arrived (resent)'] }] }));
  expect(resent[1]).toEqual({
    type: 'table',
    id: 'pieces-4',
    table: 'pieces',
    op: 'update',
    key: '2',
    row: { piece: '2', bytes: '1461–2920', status: 'Arrived (resent)' },
    summary: 'Changed in What the laptop has: 2, 1461–2920, Arrived (resent).',
  });
});

test('msg fails loudly for what the map or the table cannot show', () => {
  const msg = messagesFor(pieces);
  expect(() => messagesFor(null)(mockup({ rows: [{ key: '1', cells: ['1', '1–1460', 'Arrived'] }] }))).toThrow(/no table/);
  expect(() => msg(mockup({ tag: 'X', rows: [{ key: '1', cells: ['1', 'Arrived'] }] }))).toThrow(/2 cells.*3 columns/);
  // Two rows the mockup tells apart must differ in the table's key column, or an update could not find its row.
  msg(mockup({ rows: [{ key: 'y1', cells: ['1', '1–1460', 'Arrived'] }] }));
  expect(() => msg(mockup({ rows: [{ key: 's1', cells: ['1', '1–1460', 'Arrived'] }] }))).toThrow(
    'duplicate key in column "Piece": row "s1" has "1", and so does row "y1".',
  );
  // Known and done style the status the same message sets.
  expect(() => msg(mockup({ known: true }))).toThrow(/known.*st/);
  expect(() => msg(mockup({ done: true }))).toThrow(/done.*st/);
  // The map can light the padlock, not take it away.
  expect(() => msg(mockup({ hold: { lock: false } }))).toThrow(/padlock/);
});

test('eventLog is the packet log of internet-v2.html: its columns and widths, Info wrapping in the rest, and the legend', () => {
  const log = eventLog();
  expect(log.title).toBe('Event log');
  expect(log.columns.map((c) => [c.key, c.label, c.width ?? null, c.prose ?? false])).toEqual([
    ['time', 'Time', 100, false],
    ['source', 'Source', 176, false],
    ['destination', 'Destination', 176, false],
    ['protocol', 'Protocol', 84, false],
    ['info', 'Info', null, true],
    ['size', 'Size', 76, false],
  ]);
  expect(log.legend).toEqual([
    { kind: 'request', label: 'Request' },
    { kind: 'response', label: 'Reply' },
  ]);
  expect(eventLog({ kind: 'dropped', label: 'Lost on the way' }).legend.at(-1)).toEqual({ kind: 'dropped', label: 'Lost on the way' });
  // Every call is its own copy.
  expect(eventLog()).not.toBe(eventLog());
  expect(eventLog().columns).not.toBe(eventLog().columns);
});
