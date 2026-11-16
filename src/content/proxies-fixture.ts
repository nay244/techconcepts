import { eventLog } from './helpers/internet-events';
import whatIsHttps from './lessons/what-is-https';
import type { Cue, Lesson, MessageEvent, NoteEvent, SceneEvent, TableDef, TableEvent, Unit } from './schema';

/**
 * Proxies' Watch scene as the design spec writes it (prototypes/d15-proxies.md §3), for the tests of what B18a builds:
 * What is HTTPS's lesson with this unit swapped in, so the figure's parts, the driver, the panel and the log are all
 * driven by the same scene. Every word is the spec's placeholder; the lesson itself (src/content/lessons/proxies.ts) is
 * the author's. Test-only: nothing imports it into the site.
 */

const seen: TableDef = {
  id: 'seen',
  title: 'What the server sees',
  columns: [
    { key: 'way', label: 'Way' },
    { key: 'from', label: 'Connection from' },
    { key: 'address', label: 'Your address', prose: true },
    { key: 'readers', label: 'Who can read the request', prose: true },
  ],
  keyColumn: 'way',
  initialRows: [],
  empty: 'Nothing sent yet.',
};

const LAPTOP = '192.168.1.100';
const SITE = '198.51.100.7';
const PROXY = '203.0.113.30';

const msg = (id: string, from: string, to: string, tag: string, kind: 'request' | 'response', o: { proto: string; source: string; destination: string; info: string; plain?: string; cues?: Cue[]; fast?: boolean }): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag,
  kind,
  ...(o.fast === true ? { fast: true } : {}),
  log: { time: '—', source: o.source, destination: o.destination, protocol: o.proto, info: o.info, size: '—' },
  plain: o.plain ?? o.info,
  ...(o.cues === undefined ? {} : { cues: o.cues }),
});

const add = (id: string, way: string, from: string, address: string, readers: string): TableEvent => ({
  type: 'table',
  id,
  table: 'seen',
  op: 'add',
  row: { way, from, address, readers },
  summary: `Added to What the server sees: ${way}, ${from}, ${address}, ${readers}.`,
});

const reverseNote: NoteEvent = {
  type: 'note',
  id: 's4-note',
  log: { time: '—', source: '—', destination: '—', protocol: '—', info: 'The reverse proxy opens the seal: GET / for techconcepts.app', size: '—' },
  plain: 'The reverse proxy opens the seal and reads the request: GET / for techconcepts.app.',
};

const PAGE: Cue[] = [{ cue: 'page', arg: 'text' }, { cue: 'lock' }];

/** The five steps' own starts and events, in §3's order. */
export const proxiesSteps: { start?: Cue[]; events: SceneEvent[] }[] = [
  {
    start: [{ cue: 'conn', arg: 'open laptop>origin' }, { cue: 'conn', arg: 'seal laptop>origin' }],
    events: [
      msg('s1-get', 'laptop', 'origin', 'ENCRYPTED', 'request', { proto: 'TLS', source: `${LAPTOP}:50812`, destination: `${SITE}:443`, info: 'TLS application data (GET / inside)' }),
      add('s1-row', 'Straight', '198.51.100.23, your home', 'It’s the connection’s own', 'Your browser and the site'),
      msg('s1-page', 'origin', 'laptop', 'ENCRYPTED', 'response', { proto: 'TLS', source: `${SITE}:443`, destination: `${LAPTOP}:50812`, info: 'TLS application data (200 OK, the page inside)', cues: PAGE }),
    ],
  },
  {
    start: [{ cue: 'fresh' }, { cue: 'show', arg: 'proxy' }],
    events: [
      msg('s2-connect', 'laptop', 'proxy', 'CONNECT', 'request', { proto: 'HTTP', source: `${LAPTOP}:50900`, destination: PROXY, info: 'CONNECT techconcepts.app:443' }),
      msg('s2-tcp', 'proxy', 'origin', 'TCP', 'request', { proto: 'TCP', source: `${PROXY}:41500`, destination: `${SITE}:443`, info: 'The proxy’s own TCP connection to the site' }),
      msg('s2-ok', 'proxy', 'laptop', '200 OK', 'response', { proto: 'HTTP', source: PROXY, destination: `${LAPTOP}:50900`, info: '200 OK: the tunnel is open', cues: [{ cue: 'conn', arg: 'open laptop>proxy>origin' }] }),
    ],
  },
  {
    start: [{ cue: 'conn', arg: 'seal laptop>proxy>origin' }],
    events: [
      msg('s3-in', 'laptop', 'proxy', 'ENCRYPTED', 'request', { proto: 'TLS', source: `${LAPTOP}:50900`, destination: PROXY, info: 'TLS application data (GET / inside), into the tunnel' }),
      msg('s3-out', 'proxy', 'origin', 'ENCRYPTED', 'request', { proto: 'TLS', source: `${PROXY}:41500`, destination: `${SITE}:443`, info: 'The same sealed bytes, passed on unread' }),
      add('s3-row', 'Forward proxy', '203.0.113.30, the proxy', 'Not sent; the proxy knows it', 'Your browser and the site; the proxy sees only the site’s name'),
      msg('s3-back', 'origin', 'proxy', 'ENCRYPTED', 'response', { proto: 'TLS', source: `${SITE}:443`, destination: `${PROXY}:41500`, info: 'TLS application data (200 OK, the page inside)', plain: 'The sealed page comes back to the proxy.', fast: true }),
      msg('s3-page', 'proxy', 'laptop', 'ENCRYPTED', 'response', { proto: 'TLS', source: PROXY, destination: `${LAPTOP}:50900`, info: 'The sealed page, passed back unread', cues: PAGE }),
    ],
  },
  {
    start: [{ cue: 'fresh' }, { cue: 'hide', arg: 'proxy' }, { cue: 'hide', arg: 'direct' }, { cue: 'show', arg: 'reverse' }, { cue: 'conn', arg: 'open laptop>reverse' }, { cue: 'conn', arg: 'seal laptop>reverse' }],
    events: [
      msg('s4-get', 'laptop', 'reverse', 'ENCRYPTED', 'request', { proto: 'TLS', source: `${LAPTOP}:50950`, destination: `${SITE}:443`, info: 'TLS application data (GET / inside)' }),
      reverseNote,
    ],
  },
  {
    events: [
      msg('s5-get', 'reverse', 'origin', 'GET /', 'request', { proto: 'HTTP', source: '10.0.0.2:40100', destination: '10.0.0.20:80', info: 'GET / with X-Forwarded-For: 198.51.100.23' }),
      add('s5-row', 'Reverse proxy', '10.0.0.2, the reverse proxy', 'In X-Forwarded-For: 198.51.100.23', 'Your browser, the reverse proxy and the server'),
      msg('s5-ok', 'origin', 'reverse', '200 OK', 'response', { proto: 'HTTP', source: '10.0.0.20:80', destination: '10.0.0.2:40100', info: '200 OK, and the page', plain: 'The web server answers the reverse proxy: 200 OK, and the page.', fast: true }),
      msg('s5-page', 'reverse', 'laptop', 'ENCRYPTED', 'response', { proto: 'TLS', source: `${SITE}:443`, destination: `${LAPTOP}:50950`, info: 'TLS application data (200 OK, the page inside)', cues: PAGE }),
    ],
  },
];

const scene = (): Unit['scene'] => ({
  title: 'One request, three ways',
  views: ['network'],
  layers: ['proxies:site', 'proxies:proxy'],
  labels: { laptop: 'Wants techconcepts.app', url: 'techconcepts.app', router: '198.51.100.23 outside' },
  start: [{ cue: 'hide', arg: 'resolver' }],
  panel: { type: 'table', table: structuredClone(seen) },
  log: {
    ...eventLog(),
    legend: [
      { kind: 'request', label: 'Toward the site' },
      { kind: 'response', label: 'Back toward you' },
      { kind: 'note', label: 'At the reverse proxy, nothing sent' },
    ],
  },
  parties: [],
});

/** A fresh copy of Proxies' lesson as the fixture: What is HTTPS's, with its unit's scene and steps replaced. */
export function proxiesFixture(): Lesson {
  const lesson = structuredClone(whatIsHttps);
  const unit = lesson.units[0]!;
  const template = unit.steps[0]!;
  lesson.slug = 'proxies-fixture';
  unit.scene = scene();
  unit.steps = proxiesSteps.map(({ start, events }, i) => {
    const step = { ...structuredClone(template), id: `step-${i + 1}`, title: `Step ${i + 1}`, events: structuredClone(events) };
    delete step.status;
    if (start !== undefined) step.start = structuredClone(start);
    return step;
  });
  return lesson;
}
