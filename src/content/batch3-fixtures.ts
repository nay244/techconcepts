import { eventLog } from './helpers/internet-events';
import { SWITCH_DEVICES } from '../art/scenes/switch-parts';
import { lessonOf, type Fixture } from './batch2-fixtures';
import type { Cue, Lesson, MessageEvent, NoteEvent, Row, TableDef, TableEvent } from './schema';

/**
 * The scenes of D13's batch 3 as the design specs write them (prototypes/d13-packets.md section 3 and the scene data in
 * prototypes/d13-packets.html, with the spec review's errata in prototypes/d13-packets-cases.md), for the tests of what
 * B15a, B15b and B15c build: What is IP's lesson with each scene swapped in, so the figure's parts, the driver, the panel
 * and the log are driven by the same scene. Every word the spec does not set (steps, narrative, summaries, log info) is a
 * placeholder from the analysts' outlines: the lessons (src/content/lessons/{packets,switch,load-balancers}.ts) are the
 * authors'. No test pins a placeholder word (E5), only the design copy, the tags, the places and the bays. Test-only:
 * nothing imports it into the site.
 */

const DASH = '—';

// ---------------------------------------------------------------- Packets (d13-packets.md section 3)

const LAPTOP = '192.168.1.100:50422';
const WEB = '203.0.113.80:80';

export const piecesTable: TableDef = {
  id: 'pieces',
  title: 'What your laptop has',
  by: 'kept by your laptop’s TCP',
  columns: [
    { key: 'piece', label: 'Piece' },
    { key: 'bytes', label: 'Bytes' },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'piece',
  initialRows: [],
  empty: 'Nothing yet.',
};

const BYTES: Record<number, string> = { 1: '1–1,460', 2: '1,461–2,920', 3: '2,921–4,380', 4: '4,381–5,840' };
const row = (piece: number, status: string): Row => ({ piece: String(piece), bytes: BYTES[piece]!, status });
const park = (place: string, bay: number, tag: string): Cue => ({ cue: 'park', arg: `${place} ${bay} ${tag}` });
const status = (text: string, ...flags: ('status-known' | 'status-done')[]): Cue[] => [{ cue: 'status', arg: text }, ...flags.map((cue) => ({ cue }))];

/** A TCP message of the Packets scene: proto TCP, time and size dashes, no `over`. */
const seg = (id: string, m: { from: string; to: string; tag: string; kind: MessageEvent['kind']; info: string; via?: string; cues?: Cue[] }): MessageEvent => ({
  type: 'message',
  id,
  from: m.from,
  to: m.to,
  tag: m.tag,
  kind: m.kind,
  ...(m.via === undefined ? {} : { via: m.via }),
  log: { time: DASH, source: m.from === 'laptop' ? LAPTOP : WEB, destination: m.from === 'laptop' ? WEB : LAPTOP, protocol: 'TCP', info: m.info, size: DASH },
  plain: m.info,
  ...(m.cues === undefined ? {} : { cues: m.cues }),
});
const note = (id: string, src: string, info: string, cues: Cue[]): NoteEvent => ({
  type: 'note',
  id,
  log: { time: DASH, source: src, destination: DASH, protocol: 'TCP', info, size: DASH },
  plain: info,
  cues,
});
const add = (id: string, piece: number, word: string): TableEvent => ({ type: 'table', id, table: 'pieces', op: 'add', row: row(piece, word), summary: `Piece ${piece}: ${word}.` });

const packets: Fixture = {
  slug: 'packets-fixture',
  figure: 'net-map',
  scene: {
    title: 'A page in four pieces',
    views: ['network'],
    layers: ['tcp:web'],
    labels: { laptop: 'Wants a page', url: 'example.net', b: 'b', c: 'c', d: 'd' },
    start: [{ cue: 'hide', arg: 'resolver' }],
    panel: { type: 'table', table: structuredClone(piecesTable) },
    log: {
      ...eventLog(),
      legend: [
        { kind: 'request', label: 'Sent by your laptop' },
        { kind: 'response', label: 'Sent to your laptop' },
        { kind: 'note', label: 'TCP at one end, nothing sent' },
      ],
    },
    parties: [],
  },
  steps: [
    {
      title: 'Segmentation',
      events: [
        seg('s1-req', { from: 'laptop', to: 'web', tag: 'REQUEST', kind: 'request', info: 'Asks for the home page, index.html', cues: status('Asking for the page') }),
        note('s1-cut', WEB, 'TCP cuts 5,840 bytes into 4 pieces', [1, 2, 3, 4].map((n) => park('web', n, `PIECE ${n}`)).concat(status('Cut into 4 pieces'))),
      ],
    },
    {
      title: 'Packet Headers',
      events: [
        seg('s2-p1', { from: 'web', to: 'laptop', tag: 'PIECE 1', kind: 'response', info: 'Piece 1: bytes 1–1,460', cues: [park('laptop', 1, 'PIECE 1'), ...status('Piece 1 arrived')] }),
        add('s2-t1', 1, 'Arrived'),
      ],
    },
    {
      title: 'Forwarding',
      events: [seg('s3-p2', { from: 'web', to: 'b', tag: 'PIECE 2', kind: 'response', info: 'Piece 2: bytes 1,461–2,920', cues: [park('b', 1, 'PIECE 2'), ...status('Piece 2 on its way')] })],
    },
    {
      title: 'Route Change',
      events: [
        seg('s4-p3', { from: 'web', to: 'laptop', via: 'd', tag: 'PIECE 3', kind: 'response', info: 'Piece 3: bytes 2,921–4,380, the new way', cues: [park('laptop', 3, 'PIECE 3'), ...status('Out of order: piece 2 not here yet')] }),
        add('s4-t3', 3, 'Arrived early, waiting'),
        seg('s4-p4', { from: 'web', to: 'laptop', via: 'd', tag: 'PIECE 4', kind: 'response', info: 'Piece 4: bytes 4,381–5,840', cues: [park('laptop', 4, 'PIECE 4')] }),
        add('s4-t4', 4, 'Arrived early, waiting'),
        seg('s4-p2', { from: 'b', to: 'laptop', tag: 'PIECE 2', kind: 'response', info: 'Piece 2 arrives last', cues: [park('laptop', 2, 'PIECE 2'), ...status('All 4 pieces here')] }),
        add('s4-t2', 2, 'Arrived last'),
      ],
    },
    {
      title: 'In-Order Delivery',
      events: [
        { type: 'table', id: 's5-order', table: 'pieces', op: 'replace', rows: [1, 2, 3, 4].map((n) => row(n, 'In order')), summary: 'Your laptop’s TCP puts the pieces in order: 1, 2, 3, 4.' },
        note('s5-done', LAPTOP, 'TCP hands bytes 1–5,840 to the browser, in order', [{ cue: 'unpark', arg: 'laptop' }, { cue: 'page', arg: 'text' }, ...status('Page complete', 'status-done')]),
      ],
    },
  ],
};

export const packetsFixture = (): Lesson => lessonOf(packets);

// ---------------------------------------------------------------- Switch (d13-switch.md section 3)

type SwDevice = keyof typeof SWITCH_DEVICES;
const SW_ALL = 'ff:ff:ff:ff:ff:ff';

const swFrame = (id: string, from: SwDevice, to: SwDevice | 'all', o: Partial<MessageEvent> = {}): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag: to === 'all' ? 'TO ALL' : 'FRAME',
  kind: to === 'all' ? 'broadcast' : 'request',
  log: { time: DASH, source: SWITCH_DEVICES[from], destination: to === 'all' ? SW_ALL : SWITCH_DEVICES[to], protocol: 'Ethernet', info: `Frame ${id}`, size: DASH },
  plain: `Frame ${id}.`,
  ...o,
});
const swTable = (id: string, o: Partial<TableEvent>): TableEvent => ({ type: 'table', id, table: 'mac-table', op: 'match', summary: `Table ${id}.`, ...o }) as TableEvent;

export const macTable: TableDef = {
  id: 'mac-table',
  title: 'MAC table',
  by: 'kept by the switch',
  columns: [{ key: 'port', label: 'Port', width: 64 }, { key: 'mac', label: 'MAC address' }],
  keyColumn: 'mac',
  initialRows: [],
  empty: 'Empty: the switch hasn’t learned any address yet',
};

const switchLesson: Fixture = {
  slug: 'switch-fixture',
  figure: 'switch',
  scene: {
    title: 'Four devices on one switch',
    views: ['network'],
    layers: [],
    labels: {},
    start: [],
    panel: { type: 'table', table: structuredClone(macTable) },
    log: {
      ...eventLog(),
      legend: [
        { kind: 'request', label: 'Frame for one device' },
        { kind: 'broadcast', label: 'Frame for everyone' },
        { kind: 'response', label: 'The reply' },
      ],
    },
    parties: [],
  },
  steps: [
    { title: 'Step 1', events: [swFrame('s1-frame', 'laptop', 'printer', { cues: [{ cue: 'flood' }] }), swTable('s1-match', { key: '' })] },
    { title: 'Step 2', events: [swTable('s2-add', { op: 'add', row: { port: '2', mac: SWITCH_DEVICES.laptop } })] },
    {
      title: 'Step 3',
      events: [
        swFrame('s3-frame', 'printer', 'laptop', { kind: 'response' }),
        swTable('s3-add', { op: 'add', row: { port: '4', mac: SWITCH_DEVICES.printer } }),
        swTable('s3-match', { key: SWITCH_DEVICES.laptop }),
      ],
    },
    { title: 'Step 4', events: [swFrame('s4-frame', 'router', 'all'), swTable('s4-add', { op: 'add', row: { port: '1', mac: SWITCH_DEVICES.router } })] },
    {
      title: 'Step 5',
      events: [
        swFrame('s5-frame', 'laptop', 'router', { cues: [{ cue: 'plug', arg: 'laptop 5' }] }),
        swTable('s5-update', { op: 'update', key: SWITCH_DEVICES.laptop, row: { port: '5' } }),
        swTable('s5-match', { key: SWITCH_DEVICES.router }),
      ],
    },
  ],
};

export const switchFixture = (): Lesson => lessonOf(switchLesson);
export const batch3Fixtures = { packets: packetsFixture, switch: switchFixture };
