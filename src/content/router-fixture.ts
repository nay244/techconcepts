import { eventLog } from './helpers/internet-events';
import whatIsIp from './lessons/what-is-ip';
import type { Lesson, MessageEvent, NoteEvent, Row, SceneEvent, TableDef, TableEvent, Unit } from './schema';

/**
 * Router's unit as the design spec writes it (prototypes/d10-router.md §3), for the tests of what B12 builds: What is
 * IP's lesson with this unit swapped in, so the figure's parts, the driver, the panel and the log are all driven by
 * the same scene. Every word is the spec's placeholder; the lesson itself (src/content/lessons/router.ts) is the
 * author's. Test-only: nothing imports it into the site.
 */

export const routes: TableDef = {
  id: 'routes',
  title: 'Routing table',
  columns: [
    { key: 'network', label: 'Network' },
    { key: 'hop', label: 'Next hop' },
  ],
  keyColumn: 'network',
  initialRows: [],
  empty: 'Each device on the way shows its routing table here, in turn.',
};

const row = (network: string, hop: string): Row => ({ network, hop });

const replace = (id: string, by: string, rows: Row[], summary: string): TableEvent => ({ type: 'table', id, table: 'routes', op: 'replace', by, rows, summary });
const match = (id: string, summary: string, o: { key?: string; keys?: string[] }): TableEvent => ({ type: 'table', id, table: 'routes', op: 'match', summary, ...o });

const msg = (id: string, from: string, to: string, o: Partial<MessageEvent> & { source: string; destination: string; info: string; protocol?: string }): MessageEvent => {
  const { source, destination, info, protocol = 'IPv4', ...rest } = o;
  return {
    type: 'message',
    id,
    from,
    to,
    tag: 'PACKET',
    kind: 'request',
    log: { time: '—', source, destination, protocol, info, size: '—' },
    plain: info,
    ...rest,
  };
};

const LAPTOP = '192.168.1.100';
const PROVIDER = '198.51.100.23';
const WEB = '203.0.113.80';
const LOST = '192.0.2.77';

const note: NoteEvent = {
  type: 'note',
  id: 's5-drop',
  glyph: 'dropped',
  log: { time: '—', source: 'router a', destination: '—', protocol: '—', info: 'No route for 192.0.2.77: packet dropped', size: '—' },
  plain: 'Router a has no route for 192.0.2.77 and drops the packet.',
  cues: [{ cue: 'drop', arg: 'a' }],
};

export const stepEvents: SceneEvent[][] = [
  [
    replace('s1-table', 'kept by your laptop', [row('192.168.1.0/24', 'directly (this network)'), row('0.0.0.0/0', '192.168.1.1 (default gateway)')], 'Your laptop’s routing table: two routes.'),
    match('s1-match', 'Only the default route, 0.0.0.0/0, matches 203.0.113.80.', { key: '0.0.0.0/0' }),
    msg('s1-packet', 'laptop', 'router', { source: LAPTOP, destination: WEB, info: 'To 203.0.113.80, via the default gateway, TTL 64' }),
  ],
  [
    replace(
      's2-table',
      'kept by your router',
      [row('192.168.1.0/24', 'directly (home)'), row('198.51.100.0/24', 'directly (link to provider)'), row('0.0.0.0/0', '198.51.100.1 (provider’s router)')],
      'Your router’s routing table: three routes.',
    ),
    match('s2-match', 'Only the default route matches: next hop 198.51.100.1.', { key: '0.0.0.0/0' }),
    msg('s2-packet', 'router', 'isp', { source: PROVIDER, destination: WEB, info: 'Default route: to the provider’s router, TTL 63' }),
  ],
  [
    replace(
      's3-table',
      'kept by your provider’s router',
      [row('198.51.100.0/24', 'directly (customers)'), row('203.0.113.0/24', 'router b'), row('0.0.0.0/0', 'router a')],
      'Your provider’s router’s routing table.',
    ),
    match('s3-candidates', 'Two routes match 203.0.113.80: 203.0.113.0/24 and 0.0.0.0/0.', { keys: ['203.0.113.0/24', '0.0.0.0/0'] }),
    match('s3-winner', 'The longer one, 203.0.113.0/24, wins: next hop router b.', { key: '203.0.113.0/24', keys: ['203.0.113.0/24', '0.0.0.0/0'] }),
    msg('s3-packet', 'isp', 'b', { source: PROVIDER, destination: WEB, info: 'Longest match: 203.0.113.0/24, to router b, TTL 62' }),
  ],
  [
    replace('s4-table', 'kept by router c', [row('203.0.113.0/24', 'directly (example.net’s network)'), row('0.0.0.0/0', 'router b')], 'Router c’s routing table.'),
    msg('s4-to-c', 'b', 'c', { source: PROVIDER, destination: WEB, info: 'To router c, TTL 61' }),
    match('s4-match', '203.0.113.0/24 matches: example.net’s network, connected directly.', { key: '203.0.113.0/24' }),
    msg('s4-delivered', 'c', 'web', { source: PROVIDER, destination: WEB, info: 'Delivered to 203.0.113.80, TTL 60', cues: [{ cue: 'status', arg: 'Delivered' }, { cue: 'status-done' }] }),
  ],
  [
    replace('s5-table', 'kept by router a', [row('203.0.113.0/24', 'router b'), row('198.51.100.0/24', 'provider’s router')], 'Router a’s routing table: no default route.'),
    msg('s5-to-isp', 'laptop', 'isp', { fast: true, source: PROVIDER, destination: LOST, info: 'To 192.0.2.77, by default routes to the provider’s router, TTL 63' }),
    msg('s5-to-a', 'isp', 'a', { source: PROVIDER, destination: LOST, info: 'Default route: to router a, TTL 62' }),
    match('s5-nomatch', 'No route in router a’s table covers 192.0.2.77.', { key: '' }),
    note,
    msg('s5-icmp', 'a', 'laptop', {
      kind: 'control',
      tag: 'UNREACHABLE',
      protocol: 'ICMP',
      source: 'router a',
      destination: PROVIDER,
      info: 'Destination unreachable: network unreachable (type 3, code 0)',
      cues: [{ cue: 'status', arg: 'No route: dropped' }],
    }),
  ],
];
const scene = (): Unit['scene'] => ({
  title: 'Sending a packet',
  views: ['network'],
  layers: ['ip:web'],
  labels: { laptop: 'Sending a packet', router: '192.168.1.1 inside\n198.51.100.23 outside', isp: 'provider', a: 'a', b: 'b', c: 'c', d: 'd' },
  start: [{ cue: 'hide', arg: 'resolver' }],
  panel: { type: 'table', table: structuredClone(routes) },
  log: {
    ...eventLog(),
    legend: [
      { kind: 'request', label: 'Packet' },
      { kind: 'control', label: 'Error message' },
      { kind: 'dropped', label: 'Dropped' },
    ],
  },
  parties: [],
});

/** A fresh copy of Router's lesson as the fixture: What is IP's, with its unit's scene and steps replaced. */
export function routerFixture(): Lesson {
  const lesson = structuredClone(whatIsIp);
  const unit = lesson.units[0]!;
  const template = unit.steps[0]!;
  lesson.slug = 'router-fixture';
  unit.scene = scene();
  unit.steps = stepEvents.map((events, i) => ({
    ...structuredClone(template),
    id: `step-${i + 1}`,
    title: `Step ${i + 1}`,
    events: structuredClone(events),
    ...(i === 0 ? { status: 'Not on my network: send to the gateway' } : {}),
  }));
  for (const step of unit.steps.slice(1)) delete step.status;
  return lesson;
}
