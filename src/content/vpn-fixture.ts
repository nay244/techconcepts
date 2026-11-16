import { eventLog } from './helpers/internet-events';
import whatIsHttps from './lessons/what-is-https';
import type { Cue, Lesson, MessageEvent, SceneEvent, TableDef, TableEvent, Unit } from './schema';

/**
 * VPN's Watch scene as the design spec writes it (prototypes/d15-vpn.md §3, with E23), for the tests of what B18b
 * builds: What is HTTPS's lesson with this unit swapped in, so the figure's parts, the driver, the panel and the log
 * are all driven by the same scene. Every word is the spec's placeholder; the lesson itself (src/content/lessons/vpn.ts)
 * is the author's. Test-only: nothing imports it into the site.
 */

const CAFE = 'On the café’s Wi-Fi';
const SERVER = 'The VPN server';
const AFTER = 'After the VPN server';
const DASH = '—';

const whoReads: TableDef = {
  id: 'who-reads',
  title: 'Who can read your request',
  columns: [
    { key: 'who', label: 'Who' },
    { key: 'to', label: 'Sees it going to' },
    { key: 'read', label: 'Can read it?', prose: true },
  ],
  keyColumn: 'who',
  markLabel: 'readable',
  initialRows: [CAFE, SERVER, AFTER].map((who) => ({ who, to: DASH, read: DASH })),
  empty: 'Nobody yet.',
};

const LAPTOP = '192.168.1.100';
const VPN = '203.0.113.40';
const VPN_OUT = '203.0.113.41';
const WEB = '203.0.113.80';

const msg = (id: string, from: string, to: string, tag: string, kind: 'request' | 'response', o: { proto: string; source: string; destination: string; info: string; plain: string; cues?: Cue[] }): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag,
  kind,
  log: { time: DASH, source: o.source, destination: o.destination, protocol: o.proto, info: o.info, size: DASH },
  plain: o.plain,
  ...(o.cues === undefined ? {} : { cues: o.cues }),
});

/** A row of the table changes in place; a readable one carries the mark, a sealed one has none (`miss: false`). */
const update = (id: string, who: string, to: string, read: string, readable: boolean, summary: string): TableEvent => ({
  type: 'table',
  id,
  table: 'who-reads',
  op: 'update',
  key: who,
  row: { who, to, read },
  miss: readable,
  summary,
});

const status = (arg: string): Cue => ({ cue: 'status', arg });

/** The five steps' events, in §3's order. */
export const vpnSteps: { events: SceneEvent[] }[] = [
  {
    events: [
      msg('s1-get', 'laptop', 'web', 'GET /', 'request', { proto: 'HTTP', source: `${LAPTOP}:50422`, destination: `${WEB}:80`, info: 'Plain HTTP: anyone on the way could read it', plain: 'Your laptop asks example.net for its page, in plain HTTP.', cues: [{ cue: 'listener', arg: 'reads' }, status('Readable on the café’s Wi-Fi')] }),
      update('s1-row', CAFE, 'example.net', 'Yes: the request and the page', true, 'Someone on the café’s Wi-Fi can read your request.'),
      msg('s1-page', 'web', 'laptop', 'PAGE', 'response', { proto: 'HTTP', source: `${WEB}:80`, destination: `${LAPTOP}:50422`, info: 'The page, in plain HTTP', plain: 'The page comes back, in plain HTTP.', cues: [{ cue: 'page', arg: 'text' }] }),
    ],
  },
  {
    events: [
      msg('s2-init', 'laptop', 'vpn', 'IKE_SA_INIT', 'request', { proto: 'IKE', source: `${LAPTOP}:500`, destination: `${VPN}:500`, info: 'Let’s agree on keys', plain: 'Your laptop asks the VPN server to agree on keys.', cues: [{ cue: 'conn', arg: 'open laptop>vpn tunnel' }, status('Setting up the tunnel')] }),
      msg('s2-init-back', 'vpn', 'laptop', 'IKE_SA_INIT', 'response', { proto: 'IKE', source: `${VPN}:500`, destination: `${LAPTOP}:500`, info: 'Keys agreed; there’s a NAT in the way, so carry on at port 4500', plain: 'The server agrees, and both see the café’s router in the way.' }),
      msg('s2-auth', 'laptop', 'vpn', 'IKE_AUTH', 'request', { proto: 'IKE', source: `${LAPTOP}:4500`, destination: `${VPN}:4500`, info: 'Encrypted: who I am, and may I have an address?', plain: 'Your laptop proves who it is, encrypted, and asks for an address.' }),
      msg('s2-auth-back', 'vpn', 'laptop', 'IKE_AUTH', 'response', { proto: 'IKE', source: `${VPN}:4500`, destination: `${LAPTOP}:4500`, info: 'Encrypted: who I am; your address is 203.0.113.41', plain: 'The server proves who it is and gives your laptop 203.0.113.41.', cues: [{ cue: 'conn', arg: 'seal laptop>vpn tunnel' }, status('Tunnel ready')] }),
    ],
  },
  {
    events: [
      msg('s3-esp', 'laptop', 'vpn', 'ESP', 'request', { proto: 'ESP', source: `${LAPTOP}:4500`, destination: `${VPN}:4500`, info: 'Outside: to the VPN server. Inside, sealed: GET / to example.net', plain: 'Your request, sealed inside a packet addressed to the VPN server.', cues: [{ cue: 'listener', arg: 'outside' }, status('Sealed in the tunnel')] }),
      update('s3-row', CAFE, `${VPN}, the VPN server`, 'No: sealed', false, 'Someone on the café’s Wi-Fi now sees only that you’re talking to the VPN server.'),
    ],
  },
  {
    events: [
      update('s4-server', SERVER, 'example.net', 'Yes, once it unwraps it', true, 'The VPN server unwraps your request and can read it.'),
      msg('s4-get', 'vpn-out', 'web', 'GET /', 'request', { proto: 'HTTP', source: `${VPN_OUT}:50423`, destination: `${WEB}:80`, info: 'Unwrapped: plain HTTP again, from the VPN’s address', plain: 'The VPN server sends your request on to example.net.', cues: [status('Plain again past the VPN server')] }),
      update('s4-after', AFTER, 'example.net', 'Yes: plain HTTP again', true, 'After the VPN server, anyone on the way could read it.'),
      msg('s4-page', 'web', 'vpn-out', 'PAGE', 'response', { proto: 'HTTP', source: `${WEB}:80`, destination: `${VPN_OUT}:50423`, info: 'The page, to the VPN’s address', plain: 'example.net replies to 203.0.113.41, so the page goes to the VPN server.' }),
      msg('s4-esp', 'vpn', 'laptop', 'ESP', 'response', { proto: 'ESP', source: `${VPN}:4500`, destination: `${LAPTOP}:4500`, info: 'Outside: from the VPN server. Inside, sealed: the page', plain: 'The server seals the page and sends it back through the tunnel.', cues: [{ cue: 'page', arg: 'text' }] }),
    ],
  },
  {
    events: [
      msg('s5-esp', 'laptop', 'vpn', 'ESP', 'request', { proto: 'ESP', source: `${LAPTOP}:4500`, destination: `${VPN}:4500`, info: 'Outside: to the VPN server. Inside, sealed twice: an HTTPS request', plain: 'Your HTTPS request, sealed again inside a packet to the VPN server.', cues: [{ cue: 'url', arg: 'https://example.net' }, status('Sealed all the way to the site')] }),
      update('s5-server', SERVER, 'example.net', 'No: sealed by HTTPS', false, 'The VPN server unwraps it, and finds it still sealed by HTTPS.'),
      msg('s5-https', 'vpn-out', 'web', 'HTTPS', 'request', { proto: 'HTTPS', source: `${VPN_OUT}:50424`, destination: `${WEB}:443`, info: 'Still sealed by HTTPS: the VPN server can’t read it', plain: 'The VPN server sends it on, still sealed by HTTPS.' }),
      update('s5-after', AFTER, 'example.net', 'No: sealed by HTTPS', false, 'After the VPN server, it stays sealed by HTTPS.'),
      msg('s5-https-back', 'web', 'vpn-out', 'HTTPS', 'response', { proto: 'HTTPS', source: `${WEB}:443`, destination: `${VPN_OUT}:50424`, info: 'The page, sealed by HTTPS', plain: 'example.net sends the page back, sealed by HTTPS.' }),
      msg('s5-esp-back', 'vpn', 'laptop', 'ESP', 'response', { proto: 'ESP', source: `${VPN}:4500`, destination: `${LAPTOP}:4500`, info: 'Outside: from the VPN server. Inside, sealed twice: the page', plain: 'The page comes back through the tunnel, still sealed by HTTPS inside.', cues: [{ cue: 'lock' }, { cue: 'page', arg: 'text' }] }),
    ],
  },
];

const scene = (): Unit['scene'] => ({
  title: 'Sealed from your laptop to the VPN server',
  views: ['network'],
  layers: ['vpn:vpn', 'vpn:web'],
  labels: { laptop: CAFE, url: 'example.net' },
  start: [{ cue: 'hide', arg: 'resolver' }, { cue: 'show', arg: 'cafe' }],
  panel: { type: 'table', table: structuredClone(whoReads) },
  log: eventLog(),
  parties: [],
});

/** A fresh copy of VPN's lesson as the fixture: What is HTTPS's, with its unit's scene and steps replaced. */
export function vpnFixture(): Lesson {
  const lesson = structuredClone(whatIsHttps);
  const unit = lesson.units[0]!;
  const template = unit.steps[0]!;
  lesson.slug = 'vpn-fixture';
  unit.scene = scene();
  unit.steps = vpnSteps.map(({ events }, i) => {
    const step = { ...structuredClone(template), id: `step-${i + 1}`, title: `Step ${i + 1}`, events: structuredClone(events) };
    delete step.status;
    delete step.start;
    return step;
  });
  return lesson;
}
