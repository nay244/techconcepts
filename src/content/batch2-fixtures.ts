import { eventLog } from './helpers/internet-events';
import whatIsIp from './lessons/what-is-ip';
import type { Cue, Lesson, MessageEvent, NoteEvent, Row, SceneEvent, TableDef, TableEvent, Unit } from './schema';

/**
 * The three units of D12's batch 2 as the design spec writes them (prototypes/d12-batch-2.md §3, §7 and §11, the
 * scene data in prototypes/d12-batch-2.html, and the spec review's errata in prototypes/d12-cases.md), for the tests of
 * what B14 builds: What is IP's lesson with each unit swapped in, so the figure's parts, the driver, the panel and the
 * log are driven by the same scene. Every word the spec does not set (steps, narrative, summaries, log info) is a
 * placeholder from the analysts' outlines: the lessons (src/content/lessons/{ip-address,mac-address,tcp-udp}.ts) are
 * the authors'. No test pins a placeholder word (E11), only §7's design copy, the MAC addresses, the addresses and the
 * cell words. Test-only: nothing imports it into the site.
 */

interface Fixture {
  slug: string;
  figure: Lesson['figure'];
  scene: Unit['scene'];
  steps: { title: string; events: SceneEvent[] }[];
}

const DASH = '—';
const row = (r: Row): Row => ({ ...r });
const table = (id: string, op: TableEvent['op'], tableId: string, summary: string, o: Partial<TableEvent> = {}): TableEvent => ({ type: 'table', id, table: tableId, op, summary, ...o });

function lessonOf(f: Fixture): Lesson {
  const lesson = structuredClone(whatIsIp);
  lesson.figure = f.figure;
  const unit = lesson.units[0]!;
  const template = unit.steps[0]!;
  lesson.slug = f.slug;
  unit.scene = structuredClone(f.scene);
  unit.steps = f.steps.map((s, i) => ({ ...structuredClone(template), id: `step-${i + 1}`, title: s.title, events: structuredClone(s.events) }));
  for (const step of unit.steps) delete step.status;
  return lesson;
}

// ---------------------------------------------------------------- IP Address (§3.1, §2.8)

const cues = (o: Record<string, string>): Cue[] => Object.entries(o).map(([cue, arg]) => ({ cue, arg }));
interface IpNote {
  id: string;
  glyph?: NoteEvent['glyph'];
  cues: Record<string, string>;
  board: { addr: string; who: string; third?: { who: string; addr: string } };
  cells: { addr: string; kind: string; plain: string };
}
const ipNote = (n: IpNote): NoteEvent => ({
  type: 'note',
  id: n.id,
  glyph: n.glyph ?? 'request',
  log: { addr: n.cells.addr, kind: n.cells.kind },
  plain: n.cells.plain,
  cues: cues(n.cues),
  // Every board has prefix null (no marks), and the third row stays a plain second address.
  board: { addr: n.board.addr, who: n.board.who, prefix: null, ...(n.board.third === undefined ? {} : { third: { ...n.board.third, mode: 'cmp' as const } }) },
});

const ip: Fixture = {
  slug: 'ip-fixture',
  figure: 'subnet',
  scene: {
    title: 'The office’s addresses',
    views: ['network'],
    layers: [],
    labels: {},
    start: [],
    panel: { type: 'bits' },
    log: {
      title: 'Addresses',
      idle: 'No address read yet. Press Play, or pick a step.',
      columns: [
        { key: 'addr', label: 'Address', width: 230, strong: true },
        { key: 'kind', label: 'Kind', width: 160, strong: true, prose: true },
        { key: 'plain', label: 'In plain words', prose: true },
      ],
      legend: [
        { kind: 'request', label: 'Address read' },
        { kind: 'response', label: 'Sent' },
        { kind: 'broadcast', label: 'Broadcast' },
      ],
    },
    parties: [],
  },
  steps: [
    {
      title: 'Four numbers, 32 bits',
      events: [ipNote({ id: 's1-n1', cues: { glow: 'laptop', focus: 'sales' }, board: { addr: '192.168.1.10', who: 'Sales laptop' }, cells: { addr: '192.168.1.10', kind: DASH, plain: 'Four octets, 32 bits' } })],
    },
    {
      title: 'Private: inside the office',
      events: [
        ipNote({ id: 's2-n1', cues: { focus: 'sales', pulse: 'onenet' }, board: { addr: '192.168.1.10', who: 'Sales laptop', third: { who: 'Printer', addr: '192.168.1.20' } }, cells: { addr: '192.168.1.10', kind: 'private', plain: 'In 192.168.0.0/16' } }),
        ipNote({ id: 's2-n2', cues: { focus: 'sales', pulse: 'onenet' }, board: { addr: '192.168.1.10', who: 'Sales laptop', third: { who: 'Printer', addr: '192.168.1.20' } }, cells: { addr: '192.168.1.20', kind: 'private', plain: 'Same network, 192.168.1.0/24' } }),
      ],
    },
    {
      title: 'One router, two addresses',
      events: [
        ipNote({ id: 's3-n1', cues: { focus: 'router' }, board: { addr: '192.168.1.1', who: 'Router, inside', third: { who: 'Router, link', addr: '203.0.113.6' } }, cells: { addr: '192.168.1.1', kind: 'private', plain: 'The router’s inside address' } }),
        ipNote({ id: 's3-n2', glyph: 'response', cues: { route: 'link', busy: 'provider', focus: 'provider' }, board: { addr: '192.168.1.1', who: 'Router, inside', third: { who: 'Router, link', addr: '203.0.113.6' } }, cells: { addr: '203.0.113.6', kind: 'public (an example)', plain: 'Toward the provider, 203.0.113.5' } }),
      ],
    },
    {
      title: 'Loopback: 127.0.0.1',
      events: [ipNote({ id: 's4-n1', cues: { glow: 'laptop', focus: 'sales' }, board: { addr: '192.168.1.10', who: 'Sales laptop', third: { who: 'Loopback', addr: '127.0.0.1' } }, cells: { addr: '127.0.0.1', kind: 'special: loopback', plain: 'Stays inside the laptop' } })],
    },
    {
      title: 'No address yet: 0.0.0.0 to everyone',
      events: [ipNote({ id: 's5-n1', glyph: 'broadcast', cues: { ring: 'all' }, board: { addr: '0.0.0.0', who: 'No address', third: { who: 'Everyone here', addr: '255.255.255.255' } }, cells: { addr: '0.0.0.0 → 255.255.255.255', kind: 'special', plain: 'Everyone on this network' } })],
    },
  ],
};

// ---------------------------------------------------------------- MAC Address (§3.2, §11.1)

export const MAC_OF = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', phone: '00:00:5E:00:53:11', tv: '00:00:5E:00:53:12' } as const;
type Device = keyof typeof MAC_OF;
const DEVICES: [string, Device][] = [['Router', 'router'], ['Laptop', 'laptop'], ['Phone', 'phone'], ['TV', 'tv']];

export const framesTable: TableDef = {
  id: 'frames',
  title: 'Who keeps the frame',
  by: 'each device decides for itself',
  columns: [
    { key: 'device', label: 'Device', prose: true },
    { key: 'mac', label: 'MAC address' },
    { key: 'frame', label: 'This frame', prose: true },
  ],
  keyColumn: 'mac',
  initialRows: DEVICES.map(([device, place]) => row({ device, mac: MAC_OF[place], frame: DASH })),
  empty: 'Nothing here yet.',
};

const frameMsg = (id: string, m: { kind: MessageEvent['kind']; from: Device; to: Device; tag: string; destination: string; info: string }): MessageEvent => ({
  type: 'message',
  id,
  from: m.from,
  to: m.to,
  tag: m.tag,
  kind: m.kind,
  log: { time: DASH, source: MAC_OF[m.from], destination: m.destination, protocol: 'Wi-Fi', info: m.info, size: DASH },
  plain: m.info,
});
const keeps = (id: string, who: Device, word: string): TableEvent => table(id, 'update', 'frames', `The ${who} says: ${word}.`, { key: MAC_OF[who], row: row({ frame: word }) });
/** After each frame, one replace: the sender "Sent it", every other row "Hears it", as the ride leaves the figure (§11.1). */
const heard = (id: string, sender: Device, summary: string): TableEvent =>
  table(id, 'replace', 'frames', summary, { rows: DEVICES.map(([device, place]) => row({ device, mac: MAC_OF[place], frame: place === sender ? 'Sent it' : 'Hears it' })) });

const mac: Fixture = {
  slug: 'mac-fixture',
  figure: 'dhcp',
  scene: {
    title: 'One frame on a home Wi-Fi',
    views: ['network'],
    layers: [],
    labels: {},
    start: [{ cue: 'frames' }],
    panel: { type: 'table', table: structuredClone(framesTable) },
    log: {
      title: 'Event log',
      columns: [
        { key: 'time', label: 'Time', width: 100 },
        { key: 'source', label: 'Source', width: 150 },
        { key: 'destination', label: 'Destination', width: 172 },
        { key: 'protocol', label: 'Protocol', width: 84 },
        { key: 'info', label: 'Info', prose: true },
        { key: 'size', label: 'Size', width: 64 },
      ],
      legend: [
        { kind: 'request', label: 'Frame to one device' },
        { kind: 'broadcast', label: 'Frame to everyone' },
        { kind: 'response', label: 'Frame back to the laptop' },
      ],
    },
    parties: [],
  },
  steps: [
    {
      title: 'Everyone hears it',
      events: [
        frameMsg('s1-frame', { kind: 'request', from: 'laptop', to: 'router', tag: 'FRAME', destination: MAC_OF.router, info: 'Frame to 00:00:5E:00:53:01 (the router), carrying a packet for example.net' }),
        heard('s1-heard', 'laptop', 'Every device hears the frame: the router, the phone and the TV.'),
      ],
    },
    { title: 'Only the match keeps it', events: [keeps('s2-router', 'router', 'Keeps it'), keeps('s2-phone', 'phone', 'Ignores it'), keeps('s2-tv', 'tv', 'Ignores it')] },
    { title: 'Two halves', events: [table('s3-match', 'match', 'frames', 'The laptop’s address: 00:00:5E, the OUI, then 00:53:10, this card.', { key: MAC_OF.laptop })] },
    {
      title: 'To everyone',
      events: [
        frameMsg('s4-frame', { kind: 'broadcast', from: 'router', to: 'laptop', tag: 'TO ALL', destination: 'ff:ff:ff:ff:ff:ff', info: 'Frame to ff:ff:ff:ff:ff:ff (everyone)' }),
        heard('s4-heard', 'router', 'Every device hears the router’s frame: the laptop, the phone and the TV.'),
        keeps('s4-laptop', 'laptop', 'Keeps it'),
        keeps('s4-phone', 'phone', 'Keeps it'),
        keeps('s4-tv', 'tv', 'Keeps it'),
      ],
    },
    {
      title: 'A new frame from the router',
      events: [
        frameMsg('s5-frame', { kind: 'response', from: 'router', to: 'laptop', tag: 'FRAME', destination: MAC_OF.laptop, info: 'Frame to 00:00:5E:00:53:10 (the laptop), carrying example.net’s reply' }),
        heard('s5-heard', 'router', 'Every device hears the router’s frame: the laptop, the phone and the TV.'),
        keeps('s5-laptop', 'laptop', 'Keeps it'),
        keeps('s5-phone', 'phone', 'Ignores it'),
        keeps('s5-tv', 'tv', 'Ignores it'),
      ],
    },
  ],
};

// ---------------------------------------------------------------- TCP/UDP (§3.3, §2.2 variant A)

const LAPTOP = '192.168.1.100';
const WEB = '203.0.113.80';
const VOICE = '203.0.113.90';

export const arrivedTable: TableDef = {
  id: 'arrived',
  title: 'What your laptop got',
  by: 'the page over TCP, then Sam’s voice over UDP',
  columns: [
    { key: 'piece', label: 'Piece' },
    { key: 'page', label: 'Page, over TCP', prose: true },
    { key: 'sam', label: 'Sam’s voice, over UDP', prose: true },
  ],
  keyColumn: 'piece',
  initialRows: [],
  empty: 'Nothing yet.',
};

interface Piece {
  id: string;
  over: 'TCP' | 'UDP';
  from: string;
  to: string;
  tag: string;
  kind: MessageEvent['kind'];
  info: string;
  dropAt?: number;
  cues?: Cue[];
}
const piece = (p: Piece): MessageEvent => {
  const out = p.from === 'laptop';
  const mine = p.over === 'TCP' ? `${LAPTOP}:50422` : `${LAPTOP}:50900`;
  const theirs = p.over === 'TCP' ? `${WEB}:80` : `${VOICE}:16384`;
  return {
    type: 'message',
    id: p.id,
    from: p.from,
    to: p.to,
    tag: p.tag,
    kind: p.kind,
    over: p.over,
    ...(p.dropAt === undefined ? {} : { outcome: 'dropped' as const, dropAt: p.dropAt }),
    log: { time: DASH, source: out ? mine : theirs, destination: out ? theirs : mine, protocol: p.over, info: p.info, size: DASH },
    plain: p.info,
    ...(p.cues === undefined ? {} : { cues: p.cues }),
  };
};
const status = (text: string, ...flags: ('status-known' | 'status-done')[]): Cue[] => [{ cue: 'status', arg: text }, ...flags.map((cue) => ({ cue }))];
const got = (id: string, op: 'add' | 'update', key: string, cells: Row): TableEvent => table(id, op, 'arrived', `Piece ${key}: ${Object.values(cells).join(', ')}.`, op === 'add' ? { row: row(cells) } : { key, row: row(cells) });

const tcpUdp: Fixture = {
  slug: 'tcp-udp-fixture',
  figure: 'net-map',
  scene: {
    title: 'A page, then a call',
    views: ['network', 'sequence'],
    layers: ['tcp:web', 'tcp-udp:voice'],
    labels: { laptop: 'Wants a page, then a call', url: 'example.net' },
    start: [{ cue: 'hide', arg: 'resolver' }],
    panel: { type: 'table', table: structuredClone(arrivedTable) },
    log: {
      ...eventLog(),
      legend: [
        { kind: 'request', label: 'Sent by your laptop' },
        { kind: 'response', label: 'Sent to your laptop' },
        { kind: 'dropped', label: 'Lost on the way' },
      ],
    },
    parties: [
      { place: 'laptop', label: 'Laptop', addr: LAPTOP },
      { place: 'web', label: 'Web server', addr: WEB },
      { place: 'voice', label: 'Voice server', addr: VOICE },
    ],
  },
  steps: [
    {
      title: 'TCP: Three-Way Handshake',
      events: [
        piece({ id: 's1-syn', over: 'TCP', from: 'laptop', to: 'web', tag: 'SYN', kind: 'request', info: 'SYN: hello', cues: status('Saying hello') }),
        piece({ id: 's1-synack', over: 'TCP', from: 'web', to: 'laptop', tag: 'SYN-ACK', kind: 'response', info: 'SYN-ACK: hello back' }),
        piece({ id: 's1-ack', over: 'TCP', from: 'laptop', to: 'web', tag: 'ACK', kind: 'request', info: 'ACK: connection open', cues: [{ cue: 'conn', arg: 'open laptop>web' }, ...status('Connected', 'status-known')] }),
      ],
    },
    {
      title: 'TCP: Packet Loss',
      events: [
        piece({ id: 's2-req', over: 'TCP', from: 'laptop', to: 'web', tag: 'REQUEST', kind: 'request', info: 'Request for the page' }),
        piece({ id: 's2-p1', over: 'TCP', from: 'web', to: 'laptop', tag: 'PIECE 1', kind: 'response', info: 'Piece 1 of the page' }),
        got('s2-g1', 'add', '1', { piece: '1', page: 'Arrived', sam: DASH }),
        piece({ id: 's2-p2', over: 'TCP', from: 'web', to: 'laptop', tag: 'PIECE 2', kind: 'response', info: 'Piece 2 (lost)', dropAt: 0.55 }),
        piece({ id: 's2-p3', over: 'TCP', from: 'web', to: 'laptop', tag: 'PIECE 3', kind: 'response', info: 'Piece 3: there’s a gap before it', cues: status('Piece 2 is missing') }),
        got('s2-g2', 'add', '2', { piece: '2', page: 'Missing', sam: DASH }),
        got('s2-g3', 'add', '3', { piece: '3', page: 'Arrived, waiting', sam: DASH }),
        piece({ id: 's2-ack', over: 'TCP', from: 'laptop', to: 'web', tag: 'ACK', kind: 'request', info: 'ACK: got everything up to the end of piece 1' }),
      ],
    },
    {
      title: 'TCP: Retransmission',
      events: [
        piece({ id: 's3-p2', over: 'TCP', from: 'web', to: 'laptop', tag: 'PIECE 2', kind: 'response', info: 'Piece 2, sent again' }),
        got('s3-g2', 'update', '2', { page: 'Arrived, sent again' }),
        got('s3-g3', 'update', '3', { page: 'Arrived' }),
        piece({ id: 's3-ack', over: 'TCP', from: 'laptop', to: 'web', tag: 'ACK', kind: 'request', info: 'ACK: got everything up to the end of piece 3', cues: [...status('Page complete', 'status-done'), { cue: 'page', arg: 'text' }] }),
      ],
    },
    {
      title: 'UDP: Connectionless Send',
      events: [
        piece({ id: 's4-v1', over: 'UDP', from: 'laptop', to: 'voice', tag: 'VOICE 1', kind: 'request', info: 'Your voice, packet 1: no handshake first', cues: [{ cue: 'url', arg: 'Call' }, ...status('In a call with Sam', 'status-known')] }),
        piece({ id: 's4-s1', over: 'UDP', from: 'voice', to: 'laptop', tag: 'SAM 1', kind: 'response', info: 'Sam’s voice, packet 1' }),
        got('s4-g1', 'update', '1', { sam: 'Arrived' }),
      ],
    },
    {
      title: 'UDP: Packet Loss, No Retransmission',
      events: [
        piece({ id: 's5-s2', over: 'UDP', from: 'voice', to: 'laptop', tag: 'SAM 2', kind: 'response', info: 'Sam’s voice, packet 2 (lost)', dropAt: 0.5 }),
        got('s5-g2', 'update', '2', { sam: 'Lost' }),
        piece({ id: 's5-s3', over: 'UDP', from: 'voice', to: 'laptop', tag: 'SAM 3', kind: 'response', info: 'Sam’s voice, packet 3', cues: status('Talking, one packet lost') }),
        got('s5-g3', 'update', '3', { sam: 'Arrived, straight to the app' }),
      ],
    },
  ],
};

export const ipFixture = (): Lesson => lessonOf(ip);
export const macFixture = (): Lesson => lessonOf(mac);
export const tcpUdpFixture = (): Lesson => lessonOf(tcpUdp);
export const batch2Fixtures = { ip: ipFixture, mac: macFixture, 'tcp-udp': tcpUdpFixture };
