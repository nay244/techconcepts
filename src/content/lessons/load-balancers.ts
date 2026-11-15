import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, NoteEvent, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite } from '../sources';

/**
 * Load Balancers, Networking Concepts stop 19. A site, example.net, puts a load balancer in front of three servers, A, B
 * and C. Readers use one address, the balancer's; it passes each new request on to one server of its pool, here in turn
 * (round robin, one way among several). It also checks every server again and again. Server B stops answering, is marked
 * unhealthy after two missed checks in a row, and is skipped while A and C carry the readers; it comes back after two
 * passed checks in a row. The two in a row are this balancer's setting (example data): Learn says "a set number".
 *
 * No standard defines a load balancer, so every claim rests on passages of two publishers among Microsoft, Cloudflare
 * and Google, and none is marked defining. The one defining citation is RFC 9110 section 4.2.1 for "web pages over HTTP,
 * to port 80". The addresses and ports in the log are example data (RFC 5737 and RFC 1918); every time and size is a dash
 * because no source states one for this story, and the check's source is a dash because who sends a probe differs by
 * product. The scene is the approved design's (prototypes/d13-load-balancers.md): no reply is drawn.
 */

// ---------------------------------------------------------------- citations

const MS_LB = 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview';
const MS_PARTS = 'https://learn.microsoft.com/en-us/azure/load-balancer/components';
const MS_PROBES = 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview';
const MS_DIST = 'https://learn.microsoft.com/en-us/azure/load-balancer/distribution-mode-concepts';
const MS_AGW = 'https://learn.microsoft.com/en-us/azure/application-gateway/overview';
const MS_AGW_HOW = 'https://learn.microsoft.com/en-us/azure/application-gateway/how-application-gateway-works';
const CF_PARTS = 'https://developers.cloudflare.com/load-balancing/understand-basics/load-balancing-components/';
const CF_HEALTH = 'https://developers.cloudflare.com/load-balancing/understand-basics/health-details/';
const CF_LOR = 'https://developers.cloudflare.com/load-balancing/understand-basics/traffic-steering/origin-level-steering/least-outstanding-requests-pools/';
const CF_MAINT = 'https://developers.cloudflare.com/load-balancing/additional-options/planned-maintenance/';
const CF_PROXY = 'https://developers.cloudflare.com/load-balancing/understand-basics/proxy-modes/';
const G_LB = 'https://docs.cloud.google.com/load-balancing/docs/load-balancing-overview';
const G_HC = 'https://docs.cloud.google.com/load-balancing/docs/health-check-concepts';
const G_BS = 'https://docs.cloud.google.com/load-balancing/docs/backend-service';
/** A vendor's page has no section numbers, so a section is cited by a heading's id or a text fragment that starts in it. */
const at = (source: string, section: string, url: string) => cite(source, section, { url });

// Microsoft
const AZ_INTRO = at('microsoft-azure-lb', 'Introduction', `${MS_LB}#:~:text=Azure%20Load%20Balancer%20is%20a%20cloud%20service`);
const AZ_TCP_UDP = at('microsoft-azure-lb', 'Introduction', `${MS_LB}#:~:text=distribute%20Layer%204%20TCP%20or%20UDP%20traffic`);
const AZ_L4 = at('microsoft-azure-lb', 'How Azure Load Balancer distributes Layer 4 traffic', `${MS_LB}#:~:text=Azure%20Load%20Balancer%20operates%20at%20layer%204`);
const AZ_CONTACT = at('microsoft-azure-lb', 'How Azure Load Balancer distributes Layer 4 traffic', `${MS_LB}#:~:text=single%20point%20of%20contact`);
const AZ_WHY = at('microsoft-azure-lb', 'Why use Azure Load Balancer?', `${MS_LB}#why-use-azure-load-balancer`);
const AZ_HEALTHY_ONLY = at('microsoft-azure-lb', 'Core capabilities', `${MS_LB}#core-capabilities`);
const AZC_FRONTEND = at('microsoft-azure-lb-components', 'Frontend IP configuration', `${MS_PARTS}#:~:text=The%20frontend%20IP%20configuration%20is`);
const AZC_MAPS = at('microsoft-azure-lb-components', 'Frontend IP configuration', `${MS_PARTS}#:~:text=A%20public%20load%20balancer%20maps`);
const AZC_POOL = at('microsoft-azure-lb-components', 'Backend pool', `${MS_PARTS}#backend-pool`);
const AZP_INTRO = at('microsoft-azure-lb-probes', 'Azure Load Balancer health probes', `${MS_PROBES}#:~:text=An%20Azure%20Load%20Balancer%20health%20probe`);
const AZP_PROPERTIES = at('microsoft-azure-lb-probes', 'Probe properties', `${MS_PROBES}#probe-properties`);
const AZP_PROTOCOL = at('microsoft-azure-lb-probes', 'Probe protocol', `${MS_PROBES}#probe-protocol`);
const AZP_DOWN = at('microsoft-azure-lb-probes', 'Probe down behavior', `${MS_PROBES}#probe-down-behavior`);
const AZP_BACK = at('microsoft-azure-lb-probes', 'Probe interval & timeout', `${MS_PROBES}#probe-interval--timeout`);
const AZP_THRESHOLD = at('microsoft-azure-lb-probes', 'Probe threshold', `${MS_PROBES}#probe-threshold`);
const AZP_FIREWALL = at('microsoft-azure-lb-probes', 'Probe source IP address', `${MS_PROBES}#probe-source-ip-address`);
const AZ_HASH = at('microsoft-azure-lb-distribution', 'Hash based', `${MS_DIST}#hash-based`);
const AZ_SESSION = at('microsoft-azure-lb-distribution', 'Session persistence', `${MS_DIST}#session-persistence`);
const AGW_L7 = at('microsoft-app-gateway', 'What is Azure Application Gateway?', `${MS_AGW}#:~:text=Application%20Gateway%20operates%20at%20the%20application%20layer`);
const AGW_PATHS = at('microsoft-app-gateway', 'What is Azure Application Gateway?', `${MS_AGW}#:~:text=with%20/images%20in%20the%20URL`);
const AGW_ROUND_ROBIN = at('microsoft-app-gateway-how', 'How an application gateway routes a request', `${MS_AGW_HOW}#how-an-application-gateway-routes-a-request`);
// Cloudflare
const CF_POOLS = at('cloudflare-lb-components', 'Pools', `${CF_PARTS}#pools`);
const CF_ENDPOINTS = at('cloudflare-lb-components', 'Endpoints', `${CF_PARTS}#endpoints`);
const CF_MONITORS = at('cloudflare-lb-components', 'Monitors', `${CF_PARTS}#monitors`);
const CF_UNHEALTHY = at('cloudflare-lb-health', 'How an endpoint becomes unhealthy', `${CF_HEALTH}#how-an-endpoint-becomes-unhealthy`);
const CF_LEAST = at('cloudflare-lb-lor', 'Least Outstanding Requests', `${CF_LOR}#:~:text=Least%20Outstanding%20Requests%20steering%20allows`);
const CF_MAINT_NOTE = at('cloudflare-lb-maintenance', 'Perform planned maintenance', `${CF_MAINT}#:~:text=Existing%20connections%20are%20not%20terminated`);
const CF_L7 = at('cloudflare-lb-proxy-modes', 'Layer 7 load balancing', `${CF_PROXY}#:~:text=Layer%207%20load%20balancers%20direct%20traffic`);
const CF_BENEFITS = at('cloudflare-lb-proxy-modes', 'Benefits', `${CF_PROXY}#benefits`);
const CF_L4 = at('cloudflare-lb-proxy-modes', 'Layer 4 load balancing', `${CF_PROXY}#layer-4-load-balancing`);
// Google
const G_SPREAD = at('google-lb-overview', 'Cloud Load Balancing overview', `${G_LB}#:~:text=A%20load%20balancer%20distributes%20user%20traffic`);
const G_FRONTEND = at('google-lb-overview', 'Key features of Cloud Load Balancing', `${G_LB}#key-features`);
const G_L7 = at('google-lb-overview', 'Application Load Balancers', `${G_LB}#application-lb`);
const G_L4 = at('google-lb-overview', 'Network Load Balancers', `${G_LB}#network-lb`);
const G_HC_INTRO = at('google-health-checks', 'Health checks overview', `${G_HC}#:~:text=Based%20on%20a%20configurable%20number`);
const G_PROBE = at('google-health-checks', 'Health checks overview', `${G_HC}#:~:text=Each%20connection%20attempt%20is%20called%20a%20probe`);
const G_PROBES = at('google-health-checks', 'Probes', `${G_HC}#probes`);
const G_HEALTH_STATE = at('google-health-checks', 'Health state', `${G_HC}#health_state`);
const G_HTTP_OK = at('google-health-checks', 'Success criteria for HTTP, HTTPS, and HTTP/2', `${G_HC}#criteria-protocol-http`);
const G_TCP = at('google-health-checks', 'Success criteria for SSL and TCP', `${G_HC}#criteria-protocol-ssl-tcp`);
const G_FIREWALL = at('google-health-checks', 'Importance of firewall rules', `${G_HC}#importance_of_firewall_rules`);
const G_ROUND_ROBIN = at('google-backend-service', 'Load balancing locality policy', `${G_BS}#lb-locality-policy`);
const G_AFFINITY = at('google-backend-service', 'Session affinity', `${G_BS}#session_affinity`);
/** The one defining citation: RFC 9110 defines the http scheme and its default port. */
const HTTP_80 = cite('rfc-9110', '4.2.1', { defining: true });
/** The badge: three publishers place load balancers at layer 4 and at layer 7, by number. */
const OSI_4_7 = [AZ_L4, AGW_L7, CF_L4, CF_L7, G_L4, G_L7];

// ---------------------------------------------------------------- events

const DASH = '—';
const BAL = '203.0.113.80:80';
const ADDR = { A: '10.0.0.11', B: '10.0.0.12', C: '10.0.0.13' } as const;
type Server = keyof typeof ADDR;

const traced = (...traces: string[]): Backing => ({ traces });

const request = (id: string, from: string, to: string, src: string, info: string, plain: string, backing: Backing, cues?: Cue[]): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag: 'REQUEST',
  kind: 'request',
  ...(cues === undefined ? {} : { cues }),
  log: { time: DASH, source: src, destination: BAL, protocol: 'HTTP', info, size: DASH },
  plain,
  backing,
});
const REQ = ['lead-1', 'fact-what', 'fact-address', 'fact-here'];
const check = (id: string, s: Server, fast = false): MessageEvent => ({
  type: 'message',
  id,
  from: 'balancer',
  to: s.toLowerCase(),
  tag: 'CHECK',
  kind: 'control',
  ...(fast ? { fast: true } : {}),
  log: { time: DASH, source: DASH, destination: `${ADDR[s]}:80`, protocol: 'HTTP', info: 'Health check: answer OK, in time', size: DASH },
  plain: `The balancer checks server ${s}.`,
  backing: traced('term-health-check', 'fact-checks', 'lead-2', 'fact-private', 'fact-here'),
});
const ok = (id: string, s: Server): MessageEvent => ({
  type: 'message',
  id,
  from: s.toLowerCase(),
  to: 'balancer',
  tag: 'OK',
  kind: 'response',
  log: { time: DASH, source: `${ADDR[s]}:80`, destination: DASH, protocol: 'HTTP', info: `Server ${s}: OK`, size: DASH },
  plain: `Server ${s} answers OK, in time.`,
  backing: traced('term-health-check', 'fact-checks', 'fact-private', 'fact-here'),
});
const silent = (id: string, s: Server, info: string, backing: Backing): NoteEvent => ({
  type: 'note',
  id,
  cues: [{ cue: 'no-answer', arg: s.toLowerCase() }],
  log: { time: DASH, source: DASH, destination: DASH, protocol: DASH, info, size: DASH },
  plain: `${info}.`,
  backing,
});
const row = (id: string, s: Server, health: string, requests: number, summary: string, backing: Backing, miss = false): TableEvent => ({
  type: 'table',
  id,
  table: 'pool',
  op: 'update',
  key: s,
  row: { server: s, address: ADDR[s], health, requests: String(requests) },
  ...(miss ? { miss: true } : {}),
  summary,
  backing,
});
/** A new request count on a healthy server. */
const COUNT = traced('lead-1', 'fact-what', 'fact-private', 'fact-back');

const pool: TableDef = {
  id: 'pool',
  title: 'The pool',
  by: 'kept by the balancer',
  keyColumn: 'server',
  markLabel: 'unhealthy',
  empty: 'No servers yet.',
  columns: [
    { key: 'server', label: 'Server' },
    { key: 'address', label: 'Address' },
    { key: 'health', label: 'Health', prose: true },
    { key: 'requests', label: 'Requests' },
  ],
  initialRows: (['A', 'B', 'C'] as const).map((s) => ({ server: s, address: ADDR[s], health: 'Healthy', requests: '0' })),
};

const step1: SceneEvent[] = [
  request('s1-req', 'laptop', 'a', '198.51.100.23:61023', 'Your request, passed to server A', 'You ask example.net for its page; the balancer passes it to server A.', traced(...REQ)),
  row('s1-a', 'A', 'Healthy', 1, 'Server A has one request.', COUNT),
];

const step2: SceneEvent[] = [
  request('s2-req-b', 'reader2', 'b', '198.51.100.41:50100', 'Reader 2’s request, passed to server B', 'Reader 2 asks for the page; the balancer passes it to server B.', traced(...REQ, 'term-round-robin')),
  row('s2-b', 'B', 'Healthy', 1, 'Server B has one request.', COUNT),
  request('s2-req-c', 'reader3', 'c', '192.0.2.25:52317', 'Reader 3’s request, passed to server C', 'Reader 3 asks for the page; the balancer passes it to server C.', traced(...REQ, 'term-round-robin')),
  row('s2-c', 'C', 'Healthy', 1, 'Server C has one request.', COUNT),
];

const step3: SceneEvent[] = [
  check('s3-chk-a', 'A'),
  ok('s3-ok-a', 'A'),
  check('s3-chk-b', 'B'),
  silent('s3-quiet-1', 'B', 'No answer from B in time', traced('fact-checks', 'term-health-check')),
  row('s3-b1', 'B', '1 check missed', 1, 'Server B missed a check.', traced('fact-threshold', 'fact-checks', 'fact-private', 'lead-1')),
  check('s3-chk-b2', 'B', true),
  silent('s3-quiet-2', 'B', 'No answer from B again: two in a row', traced('fact-checks', 'fact-threshold')),
  row('s3-b2', 'B', 'Unhealthy', 1, 'Server B is marked unhealthy.', traced('term-unhealthy', 'fact-threshold', 'fact-private', 'lead-1'), true),
];

const step4: SceneEvent[] = [
  request('s4-req-a', 'laptop', 'a', '198.51.100.23:61024', 'Your next request, passed to server A', 'You ask for the page again; the balancer passes it to server A.', traced(...REQ, 'term-round-robin')),
  row('s4-a2', 'A', 'Healthy', 2, 'Server A has two requests.', COUNT),
  request(
    's4-req-c',
    'reader2',
    'c',
    '198.51.100.41:50101',
    'B’s turn: B is unhealthy, so to server C',
    'It’s B’s turn, but B is unhealthy, so the balancer passes Reader 2’s request to server C.',
    traced(...REQ, 'term-round-robin', 'term-unhealthy', 'fact-unhealthy'),
    [{ cue: 'skip', arg: 'b' }],
  ),
  row('s4-c2', 'C', 'Healthy', 2, 'Server C has two requests.', COUNT),
  request('s4-req-a3', 'reader3', 'a', '192.0.2.25:52318', 'Reader 3’s request, passed to server A', 'Reader 3 asks again; the balancer passes it to server A.', traced(...REQ, 'term-round-robin')),
  row('s4-a3', 'A', 'Healthy', 3, 'Server A has three requests.', COUNT),
  check('s4-chk-b', 'B', true),
  silent('s4-quiet', 'B', 'No answer from B', traced('fact-checks', 'fact-back')),
];

const step5: SceneEvent[] = [
  check('s5-chk-1', 'B'),
  ok('s5-ok-1', 'B'),
  row('s5-b1', 'B', '1 check passed', 1, 'Server B passed one check; it is still unhealthy.', traced('fact-back', 'term-unhealthy', 'fact-private', 'lead-1'), true),
  check('s5-chk-2', 'B'),
  ok('s5-ok-2', 'B'),
  row('s5-b2', 'B', 'Healthy', 1, 'Server B is healthy again.', traced('fact-back', 'fact-private', 'lead-1')),
  request('s5-req-b', 'reader2', 'b', '198.51.100.41:50102', 'B’s turn: passed to server B', 'It’s B’s turn again; the balancer passes Reader 2’s request to server B.', traced(...REQ, 'term-round-robin', 'fact-back')),
  row('s5-b3', 'B', 'Healthy', 2, 'Server B has two requests.', COUNT),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'load-balancers',
  title: 'Load Balancers',
  subtitle: 'One address, many servers',
  level: 'beginner',
  certTags: [],
  summary:
    'A load balancer gives readers one address and passes each request to a server in its pool. It checks every server, too. Watch one server fail its checks, get skipped, and come back.',
  figure: 'pool',
  backing: { traces: ['lead-1', 'lead-2', 'fact-address', 'fact-unhealthy', 'fact-back'] },
  units: [
    {
      id: 'load-balancers',
      name: 'Load Balancer',
      fullName: 'Load balancer',
      purpose: 'Spreads requests across a pool of servers',
      osi: { layers: [4, 7], cite: OSI_4_7 },
      backing: { traces: ['term-load-balancer', 'lead-1', 'fact-what'] },
      scene: {
        title: 'example.net’s three servers',
        views: ['network'],
        layers: [],
        labels: {},
        start: [],
        panel: { type: 'table', table: pool },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'A reader’s request' },
            { kind: 'control', label: 'Health check' },
            { kind: 'response', label: 'Answer to a check' },
            { kind: 'note', label: 'No answer in time' },
          ],
        },
        parties: [],
        backing: { traces: ['lead-1', 'fact-what', 'fact-address', 'term-pool', 'fact-private', 'term-health-check', 'fact-checks', 'term-unhealthy', 'fact-here'] },
      },
      overview: {
        hook: 'One server can only take so many readers at once, and any server can fail. So example.net puts a load balancer in front of three servers. Readers use one address, the balancer passes each request to a server, and it checks every server again and again. Watch one fail its checks, get skipped, and come back.',
        hookBacking: { traces: ['lead-1', 'lead-2', 'why-1', 'why-2', 'fact-unhealthy', 'fact-back'] },
        description: 'Think of a supermarket with one person at the front pointing each shopper to a till. A till whose light is off is skipped until it comes back on.',
        backing: { analogy: true },
        facts: [
          { label: 'Does', value: 'passes each new request to a server in its pool', backing: { traces: ['fact-what'] } },
          { label: 'Readers use', value: 'one address, the balancer’s', backing: { traces: ['fact-address'] } },
          { label: 'Checks', value: 'every server, again and again', backing: { traces: ['fact-checks', 'lead-2'] } },
          { label: 'A failing server', value: 'gets no new requests until it passes again', backing: { traces: ['fact-unhealthy', 'fact-back'] } },
          { label: 'OSI layer', value: '4 or 7, depending on the balancer', backing: { traces: ['fact-osi'] } },
        ],
      },
      steps: [
        {
          id: 'one-address',
          title: 'One Address, Three Servers',
          sub: 'You reach the balancer, not a server',
          narrative:
            'You ask example.net for its page. Its address, 203.0.113.80, belongs to a **load balancer**, not to a server. Behind it are three servers, A, B and C: its **pool**. They have private addresses, so readers only ever use the balancer’s. The balancer passes your request on to server A, and A sends you the page.',
          deep: [
            {
              text: 'The balancer’s address is called its frontend. The servers behind it don’t need public addresses of their own, because readers only ever use the frontend’s.',
              cite: [AZC_FRONTEND, AZC_POOL, G_FRONTEND, CF_BENEFITS],
            },
          ],
          facts: [
            { label: 'Readers use', value: 'one address, 203.0.113.80', backing: { traces: ['fact-address'] } },
            { label: 'Behind it', value: 'a pool of three servers', backing: { traces: ['term-pool', 'lead-1'] } },
            { label: 'The servers’ addresses', value: 'private: 10.0.0.11 to 10.0.0.13', backing: { traces: ['fact-private'] } },
            { label: 'Your request went to', value: 'server A', backing: { traces: ['lead-1', 'fact-what'] } },
          ],
          events: step1,
          backing: { traces: ['lead-1', 'term-load-balancer', 'term-pool', 'fact-address', 'fact-private', 'fact-what', 'fact-here'] },
        },
        {
          id: 'spread',
          title: 'Spread Across the Pool',
          sub: 'Each new request to the next server',
          narrative:
            'Two more readers ask for the page. This balancer takes the servers in turn, called **round robin**: the next request goes to B, the one after to C. That’s one way to spread the load. Other balancers favour the servers with fewer requests in progress, or pick by a hash of each connection. Either way, no one server gets every reader.',
          deep: [
            {
              text: 'With a hash, the balancer mixes a connection’s five values (both addresses, both ports and the protocol) into a number that picks the server. The same five values give the same server, so the whole connection stays there.',
              cite: [AZ_HASH, G_AFFINITY],
            },
          ],
          facts: [
            { label: 'This balancer picks', value: 'in turn: A, then B, then C', backing: { traces: ['term-round-robin'] } },
            { label: 'Other ways', value: 'favour fewer requests in progress, or hash the connection', backing: { traces: ['term-least-requests', 'term-hash', 'fact-methods'] } },
            { label: 'Each server has', value: 'one request', backing: { traces: ['lead-1'] } },
          ],
          events: step2,
          backing: { traces: ['term-round-robin', 'term-least-requests', 'term-hash', 'fact-methods', 'lead-1', 'why-1', 'fact-here'] },
        },
        {
          id: 'health-check-fails',
          title: 'A Health Check Fails',
          sub: 'Server B stops answering',
          narrative:
            'All the while, the balancer sends each server a **health check**: a request for a page that must come back OK, in time. A answers OK. Then B stops answering. This balancer waits for two missed checks in a row before it acts. B misses the next one too, so the balancer marks it **unhealthy**.',
          deep: [
            {
              text: 'How often to check, and how many missed checks in a row count, are settings chosen by whoever runs the balancer. A check can also be just opening a connection, with no request for a page.',
              cite: [AZP_PROPERTIES, G_HC_INTRO, G_PROBES, AZP_PROTOCOL, G_TCP],
            },
          ],
          facts: [
            { label: 'Checks', value: 'every server, again and again', backing: { traces: ['term-health-check', 'fact-checks', 'lead-2'] } },
            { label: 'A check fails when', value: 'no OK comes back in time', backing: { traces: ['fact-checks'] } },
            { label: 'This balancer acts after', value: 'two missed checks in a row', backing: { traces: ['fact-threshold'] } },
            { label: 'Server B', value: 'unhealthy', backing: { traces: ['term-unhealthy'] } },
          ],
          events: step3,
          backing: { traces: ['term-health-check', 'term-unhealthy', 'fact-checks', 'fact-threshold', 'lead-2', 'fact-here'] },
        },
        {
          id: 'skipped',
          title: 'Skipped While Unhealthy',
          sub: 'New requests go to A and C',
          narrative:
            'B is unhealthy, so it gets no new requests. You ask for the page again, and the balancer passes it to A. The next request would be B’s turn, so the balancer skips B and sends it to C, and the one after goes to A. Readers still get the page from A and C. The checks to B carry on.',
          deep: [
            {
              text: 'Marking B unhealthy stops new requests to it. Connections already open to B usually aren’t cut at once by the balancer: they carry on until they close.',
              cite: [AZP_DOWN, G_HEALTH_STATE, CF_MAINT_NOTE],
            },
          ],
          facts: [
            { label: 'Server B', value: 'gets no new requests', backing: { traces: ['term-unhealthy', 'fact-unhealthy'] } },
            { label: 'B’s turn', value: 'skipped: the request goes to C', backing: { traces: ['term-round-robin', 'fact-unhealthy'] } },
            { label: 'Readers', value: 'still get the page, from A and C', backing: { traces: ['why-2'] } },
            { label: 'Checks to B', value: 'carry on', backing: { traces: ['fact-back'] } },
          ],
          events: step4,
          backing: { traces: ['term-unhealthy', 'fact-unhealthy', 'term-round-robin', 'why-2', 'fact-back', 'fact-checks', 'fact-here'] },
        },
        {
          id: 'healthy-again',
          title: 'Healthy Again',
          sub: 'B passes its checks and gets its turn',
          narrative:
            'B is working again and answers its next check OK. One good check isn’t enough here either: this balancer waits for two in a row. B passes the next one too, and the balancer marks it healthy. The next request is B’s turn, so it goes to B. All three servers share the work again.',
          deep: [
            {
              text: 'Some balancers can also be set to send one reader’s requests to the same server every time. It’s called session affinity.',
              cite: [AZ_SESSION, G_AFFINITY],
            },
          ],
          facts: [
            { label: 'B is healthy after', value: 'two good checks in a row', backing: { traces: ['fact-back'] } },
            { label: 'The next request', value: 'B’s turn, so to B', backing: { traces: ['term-round-robin'] } },
            { label: 'The pool', value: 'three healthy servers again', backing: { traces: ['lead-1', 'fact-back'] } },
          ],
          events: step5,
          backing: { traces: ['fact-back', 'term-round-robin', 'lead-1', 'lead-2', 'fact-here'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'A **load balancer** stands in front of a group of servers, its **pool**, and gives readers one address to use. It passes each new request on to one of the servers, so no one server has to carry all the traffic.',
            cite: [AZ_INTRO, AZ_CONTACT, AZC_POOL, G_SPREAD, G_FRONTEND, CF_POOLS, AGW_ROUND_ROBIN],
          },
          {
            id: 'lead-2',
            text: 'It also checks every server again and again. A server that fails its checks gets no new requests until it passes them again.',
            cite: [AZP_INTRO, AZP_BACK, G_HEALTH_STATE, CF_MONITORS, CF_MAINT_NOTE],
          },
          {
            id: 'lead-3',
            text: 'Think of a supermarket with one person at the front pointing each shopper to a till. A till whose light is off is skipped until it comes back on.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-load-balancer',
            idea: 'One address in front of several servers, passing each new request to one of them',
            name: 'Load balancer',
            cite: [AZ_INTRO, AZ_CONTACT, G_SPREAD, G_FRONTEND],
          },
          {
            id: 'term-pool',
            idea: 'The group of servers that share the work',
            name: 'Pool (backend pool)',
            cite: [AZC_POOL, CF_POOLS],
          },
          {
            id: 'term-health-check',
            idea: 'A small test sent to each server again and again: does it answer, in time?',
            name: 'Health check (probe)',
            cite: [AZP_INTRO, AZP_PROTOCOL, G_PROBE, CF_UNHEALTHY, CF_MONITORS],
          },
          {
            id: 'term-unhealthy',
            idea: 'Failed its checks, so it gets no new requests',
            name: 'Unhealthy',
            cite: [AZP_THRESHOLD, AZP_INTRO, G_HEALTH_STATE, CF_MAINT_NOTE],
          },
          {
            id: 'term-round-robin',
            idea: 'Each new request to the next healthy server, in turn',
            name: 'Round robin',
            cite: [AGW_ROUND_ROBIN, G_ROUND_ROBIN],
          },
          {
            id: 'term-least-requests',
            idea: 'Favouring the servers with fewer requests in progress',
            name: 'Least outstanding requests',
            cite: [CF_LEAST, G_ROUND_ROBIN],
          },
          {
            id: 'term-hash',
            idea: 'Picking the server from a hash of the connection’s addresses, ports and protocol, so the whole connection goes to one server',
            name: 'Five-tuple hash',
            cite: [AZ_HASH, G_AFFINITY],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Arrive at one address', 'Pass to a healthy server', 'Check every server', 'Skip a failing one', 'Use it again once it passes'],
          note: 'What a load balancer does, in the order this lesson shows it. The checks never stop: they go on alongside the requests.',
          cite: [AZ_CONTACT, G_FRONTEND, AGW_ROUND_ROBIN, G_ROUND_ROBIN, AZP_INTRO, AZP_THRESHOLD, G_HEALTH_STATE, CF_UNHEALTHY],
        },
        why: [
          {
            id: 'why-1',
            text: 'One server can be overwhelmed by too many readers at once. With a balancer in front, a site serves more readers by adding servers to the pool.',
            cite: [AZC_POOL, AZ_WHY, G_SPREAD, CF_LEAST],
          },
          {
            id: 'why-2',
            text: 'If one server fails, the others keep serving, so readers still reach the site.',
            cite: [AZ_WHY, AZ_HEALTHY_ONLY, G_FRONTEND, G_HEALTH_STATE, CF_MAINT_NOTE],
          },
        ],
        deep: [
          {
            id: 'deep-layers',
            text: 'Some balancers work at layer 4 and spread TCP or UDP traffic. Others work at layer 7 and read each web request, so they can send requests for /images to some servers and /video to others.',
            cite: [AZ_TCP_UDP, AZ_L4, AGW_L7, AGW_PATHS, CF_L4, CF_L7, G_L4, G_L7],
          },
          {
            id: 'deep-firewall',
            text: 'The checks have to get through any firewall in front of the servers. If a firewall blocks them, a server that works is still marked unhealthy.',
            cite: [AZP_FIREWALL, G_FIREWALL],
          },
          {
            id: 'deep-open',
            text: 'Marking a server unhealthy stops new requests to it. Connections already open to it usually carry on until they close.',
            cite: [AZP_DOWN, G_HEALTH_STATE, CF_MAINT_NOTE],
          },
        ],
        facts: [
          {
            id: 'fact-what',
            label: 'What it does',
            value: 'passes each new request to one server in its pool',
            cite: [AZ_INTRO, AZ_CONTACT, AGW_ROUND_ROBIN, G_SPREAD],
          },
          {
            id: 'fact-address',
            label: 'Readers use',
            value: 'one address, the balancer’s, called its frontend',
            cite: [AZ_CONTACT, AZC_FRONTEND, G_FRONTEND, CF_BENEFITS],
          },
          {
            id: 'fact-private',
            label: 'The servers',
            value: 'can have private addresses: readers only use the balancer’s',
            cite: [AZC_POOL, AZC_MAPS, CF_BENEFITS, CF_ENDPOINTS],
          },
          {
            id: 'fact-methods',
            label: 'How it picks a server',
            value: 'depends on the balancer: in turn (round robin), favouring fewer requests in progress, or by a hash of the connection',
            cite: [AGW_ROUND_ROBIN, G_ROUND_ROBIN, CF_LEAST, AZ_HASH, G_AFFINITY],
          },
          {
            id: 'fact-checks',
            label: 'A health check',
            value: 'a new connection, or a request for a page that must come back OK; either way, in time',
            cite: [AZP_PROTOCOL, G_HTTP_OK, G_TCP, CF_UNHEALTHY],
          },
          {
            id: 'fact-threshold',
            label: 'Marked unhealthy',
            value: 'after a set number of checks in a row fail; the number is a setting',
            cite: [AZP_PROPERTIES, AZP_THRESHOLD, G_HC_INTRO, G_HEALTH_STATE, CF_UNHEALTHY],
          },
          {
            id: 'fact-unhealthy',
            label: 'An unhealthy server',
            value: 'gets no new requests; the healthy servers take them',
            cite: [AZP_INTRO, AZ_HEALTHY_ONLY, G_HEALTH_STATE, CF_MAINT_NOTE, AGW_ROUND_ROBIN],
          },
          {
            id: 'fact-back',
            label: 'Getting back',
            value: 'the checks go on; after a set number pass in a row, it is healthy and gets new requests again',
            cite: [AZP_BACK, AZP_THRESHOLD, G_HEALTH_STATE, CF_UNHEALTHY],
          },
          {
            id: 'fact-here',
            label: 'The requests here',
            value: 'web pages over HTTP, to port 80',
            cite: [HTTP_80],
          },
          {
            id: 'fact-osi',
            label: 'OSI layer',
            value: '4 or 7, depending on the balancer',
            cite: OSI_4_7,
          },
        ],
      },
      practice: [
        {
          id: 'skipped',
          prompt: 'Server B has failed its health checks and is marked unhealthy. Where does the next new request go?',
          options: [
            {
              text: 'To a healthy server, A or C.',
              feedback: 'Right. An unhealthy server gets no new requests; the healthy servers take them.',
              cite: [AZP_INTRO, G_HEALTH_STATE, CF_MAINT_NOTE],
            },
            {
              text: 'To B, if it’s B’s turn.',
              feedback: 'Not quite. The balancer skips a server marked unhealthy and passes the request to a healthy one.',
              cite: [AGW_ROUND_ROBIN, G_ROUND_ROBIN, AZP_INTRO],
            },
            {
              text: 'Nowhere: the site is down until B is fixed.',
              feedback: 'Not quite. The other servers keep serving, which is one reason to have a pool.',
              cite: [AZ_WHY, G_HEALTH_STATE, CF_MAINT_NOTE],
            },
          ],
          answer: 0,
        },
        {
          id: 'in-turn',
          prompt: 'Do all load balancers send requests to their servers in turn?',
          options: [
            {
              text: 'No. In turn is one way; others favour servers with fewer requests in progress, or pick by a hash of the connection.',
              feedback: 'Right. How a balancer picks a server depends on the balancer, and on how it’s set up.',
              cite: [AGW_ROUND_ROBIN, G_ROUND_ROBIN, CF_LEAST, AZ_HASH, G_AFFINITY, AZ_SESSION],
            },
            {
              text: 'Yes, always in turn.',
              feedback: 'Not quite. Some do, but others favour the servers with fewer requests in progress, or pick by a hash so a whole connection stays on one server.',
              cite: [CF_LEAST, G_ROUND_ROBIN, AZ_HASH, G_AFFINITY],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
