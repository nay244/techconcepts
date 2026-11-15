import { eventLog } from './helpers/internet-events';
import whatIsIp from './lessons/what-is-ip';
import type { Cue, Lesson, MessageEvent, Row, SceneEvent, TableDef, TableEvent, Unit } from './schema';

/**
 * The three units of D11's batch 1 as the design spec writes them (prototypes/d11-batch-1.md §3, with the spec review's
 * errata in prototypes/d11-cases.md), for the tests of what B13 builds: What is IP's lesson with each unit swapped in,
 * so the figure's parts, the driver, the panel and the log are driven by the same scene. Every word the spec does not
 * set is a placeholder: the lessons (src/content/lessons/{arp,ports,nat}.ts) are the authors'. No step sets
 * `status` (E5): the status line moves by `status` cues alone. Ports and NAT set no `over` (E4). Test-only: nothing
 * imports it into the site.
 */

interface Fixture {
  slug: string;
  scene: Unit['scene'];
  steps: { title: string; events: SceneEvent[] }[];
}

const row = (r: Row): Row => ({ ...r });
const table = (id: string, op: TableEvent['op'], tableId: string, summary: string, o: Partial<TableEvent> = {}): TableEvent => ({ type: 'table', id, table: tableId, op, summary, ...o });

interface Msg {
  from: string;
  to: string;
  tag: string;
  kind?: MessageEvent['kind'];
  protocol: string;
  time?: string;
  source: string;
  destination: string;
  info: string;
  over?: string;
  fast?: boolean;
  cues?: Cue[];
}
const msg = (id: string, m: Msg): MessageEvent => ({
  type: 'message',
  id,
  from: m.from,
  to: m.to,
  tag: m.tag,
  kind: m.kind ?? 'request',
  ...(m.over === undefined ? {} : { over: m.over }),
  ...(m.fast === true ? { fast: true } : {}),
  log: { time: m.time ?? '—', source: m.source, destination: m.destination, protocol: m.protocol, info: m.info, size: '—' },
  plain: m.info,
  ...(m.cues === undefined ? {} : { cues: m.cues }),
});
const status = (text: string, ...flags: ('status-known' | 'status-done')[]): Cue[] => [{ cue: 'status', arg: text }, ...flags.map((cue) => ({ cue }))];

function lessonOf(f: Fixture): Lesson {
  const lesson = structuredClone(whatIsIp);
  const unit = lesson.units[0]!;
  const template = unit.steps[0]!;
  lesson.slug = f.slug;
  unit.scene = structuredClone(f.scene);
  unit.steps = f.steps.map((s, i) => ({ ...structuredClone(template), id: `step-${i + 1}`, title: s.title, events: structuredClone(s.events) }));
  for (const step of unit.steps) delete step.status;
  return lesson;
}

const LAPTOP = '192.168.1.100';
const WEB = '203.0.113.80';
const hideResolver: Cue = { cue: 'hide', arg: 'resolver' };

// ---------------------------------------------------------------- ARP (§3.1)

export const arpCache: TableDef = {
  id: 'arp-cache',
  title: 'ARP cache',
  by: 'kept by your laptop',
  columns: [
    { key: 'ip', label: 'IP address' },
    { key: 'mac', label: 'MAC address' },
  ],
  keyColumn: 'ip',
  initialRows: [],
  empty: 'Empty. Nothing learned yet.',
};

const L_MAC = '00:00:5E:00:53:10';
const R_MAC = '00:00:5E:00:53:01';
const arpMiss = (id: string): TableEvent => table(id, 'match', 'arp-cache', 'Nothing for 192.168.1.1 in the cache.', { key: '' });
const arpAdd = (id: string): TableEvent => table(id, 'add', 'arp-cache', `Added to the cache: 192.168.1.1 is at ${R_MAC}.`, { row: row({ ip: '192.168.1.1', mac: R_MAC }) });
const arpAsk = (id: string, time: string): MessageEvent =>
  msg(id, { from: 'laptop', to: 'router', tag: 'WHO HAS?', kind: 'broadcast', protocol: 'ARP', over: 'Ethernet', time, source: L_MAC, destination: 'ff:ff:ff:ff:ff:ff', info: 'ARP: who has 192.168.1.1? Tell 192.168.1.100', cues: status('Finding the router') });
const arpAnswer = (id: string, time: string): MessageEvent =>
  msg(id, { from: 'router', to: 'laptop', tag: 'IS AT', kind: 'response', protocol: 'ARP', over: 'Ethernet', time, source: R_MAC, destination: L_MAC, info: `ARP: 192.168.1.1 is at ${R_MAC}`, cues: status('Found the router', 'status-known') });

const arp: Fixture = {
  slug: 'arp-fixture',
  scene: {
    title: 'Finding the router’s hardware address',
    views: ['network'],
    layers: ['ip:web'],
    labels: { laptop: 'Has a packet for example.net', router: '192.168.1.1\n00:00:5E:00:53:01' },
    start: [hideResolver],
    panel: { type: 'table', table: structuredClone(arpCache) },
    log: {
      ...eventLog(),
      legend: [
        { kind: 'broadcast', label: 'Broadcast to everyone' },
        { kind: 'response', label: 'Reply' },
        { kind: 'request', label: 'Packet' },
      ],
    },
    parties: [],
  },
  steps: [
    { title: 'Who has 192.168.1.1?', events: [arpMiss('s1-miss'), arpAsk('s1-ask', '0.000s')] },
    { title: 'Only the owner answers', events: [arpAnswer('s2-answer', '0.002s')] },
    {
      title: 'The cache fills',
      events: [
        arpAdd('s3-add'),
        msg('s3-packet', { from: 'laptop', to: 'router', tag: 'PACKET', protocol: 'IP', over: 'Ethernet', time: '0.003s', source: L_MAC, destination: R_MAC, info: `Frame to ${R_MAC}, carrying the packet for ${WEB}`, cues: status('Sent to the router') }),
      ],
    },
    {
      title: 'Send again: the cache answers',
      events: [
        table('s4-hit', 'match', 'arp-cache', `In the cache: 192.168.1.1 is at ${R_MAC}.`, { key: '192.168.1.1' }),
        msg('s4-packet', { from: 'laptop', to: 'router', tag: 'PACKET', protocol: 'IP', over: 'Ethernet', source: L_MAC, destination: R_MAC, info: `Cache hit: straight to ${R_MAC}, no ARP needed`, cues: status('Sent: no question needed') }),
      ],
    },
    {
      title: 'The entry runs out: ask again',
      events: [table('s5-remove', 'remove', 'arp-cache', 'The entry ran out and is removed.', { key: '192.168.1.1' }), arpMiss('s5-miss'), arpAsk('s5-ask', '—'), arpAnswer('s5-answer', '—'), arpAdd('s5-add')],
    },
  ],
};

// ---------------------------------------------------------------- Ports (§3.2)

export const listening: TableDef = {
  id: 'listening-ports',
  title: 'Listening ports',
  by: 'on example.net (203.0.113.80)',
  columns: [
    { key: 'port', label: 'Port' },
    { key: 'program', label: 'Program', prose: true },
  ],
  keyColumn: 'port',
  initialRows: [
    { port: 'TCP 22', program: 'SSH server' },
    { port: 'TCP 80', program: 'Web server (HTTP)' },
    { port: 'TCP 443', program: 'Web server (HTTPS)' },
  ],
  empty: 'Nothing is listening.',
};

const syn = (id: string, laptopPort: number, port: number): MessageEvent =>
  msg(id, { from: 'laptop', to: 'server', tag: 'SYN', protocol: 'TCP', source: `${LAPTOP}:${laptopPort}`, destination: `${WEB}:${port}`, info: `SYN to port ${port}` });
const synAck = (id: string, laptopPort: number, port: number, text: string): MessageEvent =>
  msg(id, { from: 'server', to: 'laptop', tag: 'SYN-ACK', kind: 'response', protocol: 'TCP', source: `${WEB}:${port}`, destination: `${LAPTOP}:${laptopPort}`, info: `SYN-ACK from port ${port}`, cues: status(text, 'status-done') });
const listens = (id: string, key: string, summary: string): TableEvent => table(id, 'match', 'listening-ports', summary, { key });

const ports: Fixture = {
  slug: 'ports-fixture',
  scene: {
    title: 'One address, many ports',
    views: ['network'],
    layers: ['ports:server'],
    labels: { laptop: 'Opening connections' },
    start: [hideResolver],
    panel: { type: 'table', table: structuredClone(listening) },
    log: {
      ...eventLog(),
      legend: [
        { kind: 'request', label: 'Request' },
        { kind: 'response', label: 'Reply' },
        { kind: 'control', label: 'Reset' },
      ],
    },
    parties: [],
  },
  steps: [
    { title: 'Port 80: the web’s door', events: [syn('s1-syn', 50422, 80), listens('s1-match', 'TCP 80', 'The web server is listening on port 80.'), synAck('s1-synack', 50422, 80, 'Connected to port 80')] },
    { title: 'Port 443: same server, another door', events: [syn('s2-syn', 50423, 443), listens('s2-match', 'TCP 443', 'The web server is listening on port 443 too.'), synAck('s2-synack', 50423, 443, 'Connected to port 443')] },
    { title: 'Port 22: a different program', events: [syn('s3-syn', 50431, 22), listens('s3-match', 'TCP 22', 'The SSH server is listening on port 22.'), synAck('s3-synack', 50431, 22, 'SSH app: connected to port 22')] },
    {
      title: 'Port 3389: nobody home',
      events: [
        syn('s4-syn', 50440, 3389),
        table('s4-nomatch', 'match', 'listening-ports', 'Nothing is listening on 3389.', { key: '' }),
        msg('s4-rst', { from: 'server', to: 'laptop', tag: 'RST', kind: 'control', protocol: 'TCP', source: `${WEB}:3389`, destination: `${LAPTOP}:50440`, info: 'RST: nothing listening on 3389', cues: status('Refused: nothing listening on 3389') }),
      ],
    },
    {
      title: 'Open the port',
      events: [
        table('s5-add', 'add', 'listening-ports', 'Remote Desktop is now listening on 3389.', { row: row({ port: 'TCP 3389', program: 'Remote Desktop' }) }),
        syn('s5-syn', 50441, 3389),
        listens('s5-match', 'TCP 3389', 'Remote Desktop is listening on port 3389.'),
        synAck('s5-synack', 50441, 3389, 'Connected to port 3389'),
      ],
    },
  ],
};

// ---------------------------------------------------------------- NAT (§3.3)

export const natTable: TableDef = {
  id: 'nat-table',
  title: 'NAT table',
  by: 'kept by your router, 198.51.100.23 outside',
  columns: [
    { key: 'inside', label: 'Inside' },
    { key: 'out', label: 'Outside port' },
  ],
  keyColumn: 'out',
  initialRows: [],
  empty: 'Empty. Nothing has gone out yet.',
};

const PUBLIC = '198.51.100.23';
const STRANGER = '192.0.2.66';
const natOut = (id: string, from: string, inside: string, o: Partial<Msg>): MessageEvent =>
  msg(id, { from, to: 'router', tag: 'PACKET', protocol: 'TCP', source: inside, destination: `${WEB}:80`, info: `To example.net, port 80, from temporary port ${inside.split(':')[1]}`, ...o });
const natReply = (id: string, to: string, destination: string, info: string, o: Partial<Msg> = {}): MessageEvent =>
  msg(id, { from: to === 'router' ? 'web' : 'router', to, tag: 'REPLY', kind: 'response', protocol: 'TCP', source: `${WEB}:80`, destination, info, ...o });
const natMatch = (id: string, key: string, summary: string): TableEvent => table(id, 'match', 'nat-table', summary, { key });
const LAPTOP_ROW = row({ inside: `${LAPTOP}:50422`, out: '61023' });
const PHONE_ROW = row({ inside: '192.168.1.101:50613', out: '63847' });

const nat: Fixture = {
  slug: 'nat-fixture',
  scene: {
    title: 'Sharing one public address',
    views: ['network'],
    layers: ['tcp:web', 'nat:stranger'],
    labels: { laptop: 'Opening example.net', router: '192.168.1.1 inside\n198.51.100.23 outside' },
    start: [hideResolver, { cue: 'show', arg: 'phone' }],
    panel: { type: 'table', table: structuredClone(natTable) },
    log: {
      ...eventLog(),
      legend: [
        { kind: 'request', label: 'Packet' },
        { kind: 'response', label: 'Reply' },
      ],
    },
    parties: [],
  },
  steps: [
    {
      title: 'Out: a new address and port',
      events: [
        natOut('s1-out', 'laptop', `${LAPTOP}:50422`, {}),
        table('s1-add', 'add', 'nat-table', 'Written: 192.168.1.100:50422 goes out as port 61023.', { row: LAPTOP_ROW }),
        msg('s1-onward', { from: 'router', to: 'web', tag: 'PACKET', protocol: 'TCP', source: `${PUBLIC}:61023`, destination: `${WEB}:80`, info: `NAT: ${LAPTOP}:50422 → ${PUBLIC}:61023`, cues: status('Router swapped the address and port') }),
      ],
    },
    {
      title: 'Back: the table knows',
      events: [
        natReply('s2-in', 'router', `${PUBLIC}:61023`, 'Reply to the router’s public address, port 61023'),
        natMatch('s2-match', '61023', 'Port 61023 is the laptop’s: 192.168.1.100:50422.'),
        natReply('s2-back', 'laptop', `${LAPTOP}:50422`, `NAT: ${PUBLIC}:61023 → ${LAPTOP}:50422`, { cues: status('Reply received', 'status-done') }),
      ],
    },
    {
      title: 'A second device, same site',
      events: [
        natOut('s3-out', 'phone', '192.168.1.101:50613', {}),
        table('s3-add', 'add', 'nat-table', 'Written: 192.168.1.101:50613 goes out as port 63847.', { row: PHONE_ROW }),
        msg('s3-onward', { from: 'router', to: 'web', tag: 'PACKET', protocol: 'TCP', source: `${PUBLIC}:63847`, destination: `${WEB}:80`, info: `NAT: 192.168.1.101:50613 → ${PUBLIC}:63847` }),
      ],
    },
    {
      title: 'One address, told apart by port',
      events: [
        natReply('s4-in', 'router', `${PUBLIC}:63847`, 'Reply to the router’s public address, port 63847'),
        natMatch('s4-match', '63847', 'Port 63847 is the phone’s: 192.168.1.101:50613.'),
        natReply('s4-phone', 'phone', '192.168.1.101:50613', `NAT: ${PUBLIC}:63847 → 192.168.1.101:50613`),
        natReply('s4-in2', 'router', `${PUBLIC}:61023`, 'Reply to the router’s public address, port 61023', { fast: true }),
        natMatch('s4-match2', '61023', 'Port 61023 is the laptop’s: 192.168.1.100:50422.'),
        natReply('s4-laptop', 'laptop', `${LAPTOP}:50422`, `NAT: ${PUBLIC}:61023 → ${LAPTOP}:50422`, { fast: true }),
      ],
    },
    {
      title: 'Nobody asked: no row, nowhere to go',
      events: [
        msg('s5-stranger', { from: 'stranger', to: 'router', tag: 'PACKET', protocol: 'TCP', source: `${STRANGER}:51200`, destination: `${PUBLIC}:80`, info: 'No row for port 80: not passed in' }),
        table('s5-nomatch', 'match', 'nat-table', 'No row for port 80: nothing at home asked for this.', { key: '' }),
      ],
    },
  ],
};

export const arpFixture = (): Lesson => lessonOf(arp);
export const portsFixture = (): Lesson => lessonOf(ports);
export const natFixture = (): Lesson => lessonOf(nat);
export const batch1Fixtures = { arp: arpFixture, ports: portsFixture, nat: natFixture };
