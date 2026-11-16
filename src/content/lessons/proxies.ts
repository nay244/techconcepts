import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, NoteEvent, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite } from '../sources';

/**
 * Proxies, Networking Concepts stop 18. One request for https://techconcepts.app, told three ways in turn: straight to
 * the site (the site sees your home's address); through a forward proxy your laptop is set to use (a CONNECT tunnel the
 * proxy only relays, so it cannot read the request, while the site sees the proxy's address); and through the site's own
 * reverse proxy (it holds the site's certificate, opens the seal and passes the request to the web server behind it, with
 * your address in X-Forwarded-For). One table, "What the server sees", gains a row for each way.
 *
 * RFC 9110 defines proxy, gateway (a reverse proxy), tunnel and CONNECT, RFC 9111 what a cache may keep and RFC 7239 the
 * Forwarded header; they carry the defining marker where the claim is about that thing. "Forward proxy", TLS termination,
 * X-Forwarded-For and the badge rest on passages of two publishers or more. The word "gateway" stays out of reader text
 * (the glossary's gateway is the router). TLS inspection is Learn's Go deeper only, not drawn. The addresses and ports in
 * the log are example data (RFC 5737 and RFC 1918); every time and size is a dash because no source states one. The scene
 * is the approved design's (prototypes/d15-proxies.md section 3, built as src/content/proxies-fixture.ts).
 */

// ---------------------------------------------------------------- citations

const MS_PROXY = 'https://learn.microsoft.com/en-us/microsoft-cloud/dev/dev-proxy/concepts/what-is-proxy';
const MS_WIN = 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/use-a-proxy-server-in-windows';
const MS_TLS = 'https://learn.microsoft.com/en-us/azure/application-gateway/ssl-overview';
const MS_AGW = 'https://learn.microsoft.com/en-us/azure/application-gateway/overview';
const MS_AGW_HOW = 'https://learn.microsoft.com/en-us/azure/application-gateway/how-application-gateway-works';
const PA = 'https://www.paloaltonetworks.com/cyberpedia/what-is-a-proxy-server';
const CF_HOW = 'https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/';
const CF_HEADERS = 'https://developers.cloudflare.com/fundamentals/reference/http-headers/';
const CF_GW = 'https://developers.cloudflare.com/cloudflare-one/traffic-controls/proxy/';
const CF_TLS = 'https://developers.cloudflare.com/cloudflare-one/traffic-controls/http-policies/tls-decryption/';
const CF_LAYERS = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const G_SWP = 'https://docs.cloud.google.com/secure-web-proxy/docs/overview';
const G_SWP_TLS = 'https://docs.cloud.google.com/secure-web-proxy/docs/tls-inspection-overview';
const G_HTTPS = 'https://docs.cloud.google.com/load-balancing/docs/https';
const G_CDN = 'https://docs.cloud.google.com/cdn/docs/overview';
const G_LB = 'https://docs.cloud.google.com/load-balancing/docs/load-balancing-overview';
/** A vendor's page has no section numbers, so a section is cited by a heading's id or a text fragment that starts in it. */
const at = (source: string, section: string, url: string) => cite(source, section, { url });

// The defining documents
const RFC_INTERMEDIARY = cite('rfc-9110', '3.7', { defining: true });
const RFC_CACHES_CDN = cite('rfc-9110', '3.8');
const RFC_HTTP_80 = cite('rfc-9110', '4.2.1', { defining: true });
const RFC_HTTPS_443 = cite('rfc-9110', '4.2.2', { defining: true });
const RFC_CONNECT = cite('rfc-9110', '9.3.6', { defining: true });
const RFC_SHARED_CACHE = cite('rfc-9111', '1', { defining: true });
const RFC_CACHE_STORE = cite('rfc-9111', '3', { defining: true });
const RFC_NO_STORE = cite('rfc-9111', '5.2.2.5', { defining: true });
const RFC_PRIVATE = cite('rfc-9111', '5.2.2.7', { defining: true });
const RFC_FWD_WHY = cite('rfc-7239', '1');
const RFC_FWD_HEADER = cite('rfc-7239', '4', { defining: true });
const RFC_TLS_CONF = cite('rfc-9846', '1', { defining: true });
const RFC_TLS_DATA = cite('rfc-9112', '9.7', { defining: true });
const EDGE_ICON = at(
  'microsoft-edge-secure',
  'Verify the connection icon in the address bar',
  'https://support.microsoft.com/en-us/edge/securely-browse-the-web-in-microsoft-edge#:~:text=Verify%20the%20connection%20icon%20in%20the%20address%20bar',
);
const CF_MIXED = at(
  'cloudflare-mixed-content',
  'Mixed content errors',
  'https://developers.cloudflare.com/ssl/troubleshooting/mixed-content-errors/#:~:text=Mixed%20content%20errors',
);
const RFC_TARGET = cite('rfc-9112', '3.2.1', { defining: true });
const RFC_FRESH = cite('rfc-9111', '1', { defining: true });
const RFC_GET = cite('rfc-9110', '9.3.1', { defining: true });
const RFC_OK = cite('rfc-9110', '15.3.1', { defining: true });
const RFC_NAPT = cite('rfc-3022', '2.2');
const RFC_NAT_SHARE = cite('rfc-4787', '3');
// Microsoft
const MS_WHAT = at('microsoft-what-is-proxy', 'What is a proxy?', `${MS_PROXY}#:~:text=A%20proxy%20is%20an%20intermediary%20server`);
const MS_ON_BEHALF = at('microsoft-what-is-proxy', 'What is a proxy?', `${MS_PROXY}#:~:text=a%20proxy%20acts%20on%20behalf`);
const MS_HOW = at('microsoft-what-is-proxy', 'How a proxy works', `${MS_PROXY}#how-a-proxy-works`);
const MS_FORWARD = at('microsoft-what-is-proxy', 'Forward proxy', `${MS_PROXY}#forward-proxy`);
const MS_REVERSE = at('microsoft-what-is-proxy', 'Reverse proxy', `${MS_PROXY}#reverse-proxy`);
const MS_TRANSPARENT = at('microsoft-what-is-proxy', 'Transparent proxy', `${MS_PROXY}#transparent-proxy`);
const MS_HEADERS = at('microsoft-what-is-proxy', 'Common headers and proxy considerations', `${MS_PROXY}#common-headers-and-proxy-considerations`);
const MS_WIN_SUMMARY = at('microsoft-windows-proxy', 'Summary', `${MS_WIN}#summary`);
const MS_WIN_MANUAL = at('microsoft-windows-proxy', 'To set up a proxy server connection manually', `${MS_WIN}#to-set-up-a-proxy-server-connection-manually`);
const MS_TLS_TERM = at('microsoft-app-gateway-tls', 'TLS termination', `${MS_TLS}#tls-termination`);
const MS_TLS_PERF = at('microsoft-app-gateway-tls', 'TLS termination', `${MS_TLS}#:~:text=Improved%20performance`);
const MS_TLS_ROUTING = at('microsoft-app-gateway-tls', 'TLS termination', `${MS_TLS}#:~:text=Intelligent%20routing`);
const MS_TLS_E2E = at('microsoft-app-gateway-tls', 'End-to-end TLS encryption', `${MS_TLS}#end-to-end-tls-encryption`);
const MS_AGW_L7 = at('microsoft-app-gateway', 'What is Azure Application Gateway?', `${MS_AGW}#:~:text=Application%20Gateway%20operates%20at%20the%20application%20layer`);
const MS_AGW_HEADERS = at('microsoft-app-gateway-how', 'Modifications to the request', `${MS_AGW_HOW}#modifications-to-the-request`);
// Palo Alto Networks
const PA_HOW = at('paloalto-proxy-server', 'How do proxy servers work?', `${PA}#:~:text=opens%20a%20second%20connection%20to%20the%20destination`);
const PA_REPLACES = at('paloalto-proxy-server', 'How do proxy servers work?', `${PA}#:~:text=The%20proxy%20replaces%20the%20user`);
const PA_FORWARD = at('paloalto-proxy-server', 'Forward proxy', `${PA}#:~:text=A%20forward%20proxy%20acts%20on%20behalf%20of%20the%20client`);
const PA_LOGGING = at('paloalto-proxy-server', 'Forward proxy', `${PA}#:~:text=user%20activity%20logging`);
const PA_REVERSE = at('paloalto-proxy-server', 'Reverse proxy', `${PA}#:~:text=A%20reverse%20proxy%20acts%20on%20behalf`);
const PA_REVERSE_USES = at('paloalto-proxy-server', 'Reverse proxy', `${PA}#:~:text=Reverse%20proxies%20are%20typically%20used%20for`);
const PA_TRANSPARENT = at('paloalto-proxy-server', 'Transparent proxy', `${PA}#:~:text=Transparent%20proxies%20intercept%20traffic`);
const PA_EXPLICIT = at('paloalto-proxy-server', 'Explicit proxy', `${PA}#:~:text=An%20explicit%20proxy%20requires`);
const PA_HTTP_PROXY = at('paloalto-proxy-server', 'HTTP/HTTPS proxy', `${PA}#:~:text=HTTP%20proxies%20can%20inspect%20unencrypted%20traffic`);
const PA_BASIC = at('paloalto-proxy-server', 'What are the limitations of proxy servers?', `${PA}#:~:text=Basic%20proxies`);
const PA_SEES = at('paloalto-proxy-server', 'How do proxy servers hide IP addresses?', `${PA}#:~:text=the%20destination%20server%20sees%20the%20proxy`);
const PA_TRACED = at('paloalto-proxy-server', 'Can my IP be tracked if I use a proxy?', `${PA}#:~:text=If%20the%20proxy%20logs%20your%20activity`);
const PA_NO_ENCRYPT = at('paloalto-proxy-server', 'What does a proxy server do?', `${PA}#:~:text=do%20not%20encrypt%20traffic%20by%20default`);
// Cloudflare
const CF_REVERSE = at('cloudflare-how-works', 'Cloudflare as a reverse proxy', `${CF_HOW}#cloudflare-as-a-reverse-proxy`);
const CF_XFF = at('cloudflare-http-headers', 'X-Forwarded-For', `${CF_HEADERS}#x-forwarded-for`);
const CF_GW_PROXY = at('cloudflare-gateway-proxy', 'Proxy', `${CF_GW}#:~:text=Gateway%20will%20accept%20the%20connection`);
const CF_GW_TCP = at('cloudflare-gateway-proxy', 'Proxy algorithm', `${CF_GW}#proxy-algorithm`);
const CF_TLS_HIDDEN = at('cloudflare-tls-decryption', 'TLS decryption', `${CF_TLS}#:~:text=information%20contained%20within%20HTTPS%20encryption`);
const CF_TLS_REENCRYPT = at('cloudflare-tls-decryption', 'TLS decryption', `${CF_TLS}#:~:text=When%20you%20turn%20on%20TLS%20decryption`);
const CF_TLS_TRUST = at('cloudflare-tls-decryption', 'Turn on TLS decryption', `${CF_TLS}#turn-on-tls-decryption`);
const CF_LAYER_7 = at('cloudflare-network-layers', 'Network Layers', `${CF_LAYERS}#:~:text=7%20Application%20layer`);
const CF_LAYER_4 = at('cloudflare-network-layers', 'Network Layers', `${CF_LAYERS}#:~:text=4%20Transport%20layer`);
// Google
const G_SWP_HOW = at('google-swp-overview', 'How Secure Web Proxy works', `${G_SWP}#how-swp-works`);
const G_SWP_MODES = at('google-swp-overview', 'Deployment modes', `${G_SWP}#deployment-modes`);
const G_TLS_HOW = at('google-swp-tls', 'How it works', `${G_SWP_TLS}#how_it_works`);
const G_TLS_TRUST = at('google-swp-tls', 'Client trust requirements', `${G_SWP_TLS}#client_trust_requirements`);
const G_HTTPS_PROXY = at('google-https-lb', 'Architecture', `${G_HTTPS}#component`);
const G_XFF = at('google-https-lb', 'X-Forwarded-For header', `${G_HTTPS}#x-forwarded-for_header`);
const G_BACKENDS = at('google-https-lb', 'Protocol to the backends', `${G_HTTPS}#protocol-to-backends`);
const G_CDN_WHAT = at('google-cdn-overview', 'Cloud CDN overview', `${G_CDN}#:~:text=global%20edge%20network%20to%20serve%20content`);
const G_CDN_CACHE = at('google-cdn-overview', 'Serve content from a cache', `${G_CDN}#serving-from-cache`);
const G_L7 = at('google-lb-overview', 'Application Load Balancers', `${G_LB}#application-lb`);
const G_L4_PROXY = at('google-lb-overview', 'Proxy Network Load Balancers', `${G_LB}#proxy-network-lb`);
/** The badge: Google places proxies at layers 7 and 4, Cloudflare's and Microsoft's proxies sit in those rows or at layer 7. */
const OSI_4_7 = [G_L7, G_L4_PROXY, CF_LAYER_7, CF_LAYER_4, CF_GW_PROXY, MS_AGW_L7, MS_AGW_HEADERS];

// ---------------------------------------------------------------- events

const DASH = '—';
const LAPTOP = '192.168.1.100';
const SITE = '198.51.100.7';
const PROXY = '203.0.113.30';

const traced = (...traces: string[]): Backing => ({ traces });

const msg = (
  id: string,
  from: string,
  to: string,
  tag: string,
  kind: 'request' | 'response',
  o: { proto: string; source: string; destination: string; info: string; plain: string; backing: Backing; cues?: Cue[]; fast?: boolean },
): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag,
  kind,
  ...(o.fast === true ? { fast: true } : {}),
  log: { time: DASH, source: o.source, destination: o.destination, protocol: o.proto, info: o.info, size: DASH },
  plain: o.plain,
  ...(o.cues === undefined ? {} : { cues: o.cues }),
  backing: o.backing,
});

const add = (id: string, way: string, from: string, address: string, readers: string, summary: string, backing: Backing): TableEvent => ({
  type: 'table',
  id,
  table: 'seen',
  op: 'add',
  row: { way, from, address, readers },
  summary,
  backing,
});

const reverseNote: NoteEvent = {
  type: 'note',
  id: 's4-note',
  log: { time: DASH, source: DASH, destination: DASH, protocol: DASH, info: 'The reverse proxy opens the seal: GET / for techconcepts.app', size: DASH },
  plain: 'The reverse proxy opens the seal and reads the request: GET / for techconcepts.app.',
  backing: traced('term-termination', 'fact-termination', 'term-reverse', 'fact-request'),
};

const PAGE: Cue[] = [{ cue: 'page', arg: 'text' }, { cue: 'lock' }];

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

const step1: SceneEvent[] = [
  msg('s1-get', 'laptop', 'origin', 'ENCRYPTED', 'request', {
    proto: 'TLS',
    source: `${LAPTOP}:50812`,
    destination: `${SITE}:443`,
    info: 'TLS application data (GET / inside)',
    plain: 'Your browser sends its sealed request straight to techconcepts.app.',
    backing: traced('fact-https', 'fact-here', 'fact-request'),
  }),
  add(
    's1-row',
    'Straight',
    '198.51.100.23, your home',
    'It’s the connection’s own',
    'Your browser and the site',
    'The site sees a connection from your home, 198.51.100.23.',
    traced('fact-nat', 'fact-https'),
  ),
  msg('s1-page', 'origin', 'laptop', 'ENCRYPTED', 'response', {
    proto: 'TLS',
    source: `${SITE}:443`,
    destination: `${LAPTOP}:50812`,
    info: 'TLS application data (200 OK, the page inside)',
    plain: 'The page comes back, sealed.',
    cues: PAGE,
    backing: traced('fact-https', 'fact-here', 'fact-request', 'fact-padlock'),
  }),
];

const step2: SceneEvent[] = [
  msg('s2-connect', 'laptop', 'proxy', 'CONNECT', 'request', {
    proto: 'HTTP',
    source: `${LAPTOP}:50900`,
    destination: PROXY,
    info: 'CONNECT techconcepts.app:443',
    plain: 'Your browser asks the proxy to connect it to techconcepts.app, port 443.',
    backing: traced('fact-connect', 'fact-here', 'term-forward'),
  }),
  msg('s2-tcp', 'proxy', 'origin', 'TCP', 'request', {
    proto: 'TCP',
    source: `${PROXY}:41500`,
    destination: `${SITE}:443`,
    info: 'The proxy’s own TCP connection to the site',
    plain: 'The proxy opens a connection of its own to techconcepts.app.',
    backing: traced('pattern', 'lead-1', 'fact-here'),
  }),
  msg('s2-ok', 'proxy', 'laptop', '200 OK', 'response', {
    proto: 'HTTP',
    source: PROXY,
    destination: `${LAPTOP}:50900`,
    info: '200 OK: the tunnel is open',
    plain: 'The proxy answers 200 OK: the tunnel is open.',
    cues: [{ cue: 'conn', arg: 'open laptop>proxy>origin' }],
    backing: traced('fact-connect', 'term-tunnel'),
  }),
];

const step3: SceneEvent[] = [
  msg('s3-in', 'laptop', 'proxy', 'ENCRYPTED', 'request', {
    proto: 'TLS',
    source: `${LAPTOP}:50900`,
    destination: PROXY,
    info: 'TLS application data (GET / inside), into the tunnel',
    plain: 'Your browser sends its sealed request into the tunnel.',
    backing: traced('fact-https', 'fact-connect', 'term-tunnel', 'fact-request'),
  }),
  msg('s3-out', 'proxy', 'origin', 'ENCRYPTED', 'request', {
    proto: 'TLS',
    source: `${PROXY}:41500`,
    destination: `${SITE}:443`,
    info: 'The same sealed bytes, passed on unread',
    plain: 'The proxy passes the sealed request on to techconcepts.app without reading it.',
    backing: traced('fact-https', 'term-tunnel', 'fact-connect', 'fact-here'),
  }),
  add(
    's3-row',
    'Forward proxy',
    '203.0.113.30, the proxy',
    'Not sent; the proxy knows it',
    'Your browser and the site; the proxy sees only the site’s name and port',
    'The site sees a connection from the proxy, 203.0.113.30.',
    traced('fact-sees', 'fact-knows', 'term-tunnel', 'fact-connect', 'fact-https', 'fact-passes-on'),
  ),
  msg('s3-back', 'origin', 'proxy', 'ENCRYPTED', 'response', {
    proto: 'TLS',
    source: `${SITE}:443`,
    destination: `${PROXY}:41500`,
    info: 'TLS application data (200 OK, the page inside)',
    plain: 'The sealed page comes back to the proxy.',
    fast: true,
    backing: traced('term-tunnel', 'fact-https', 'fact-here', 'fact-request'),
  }),
  msg('s3-page', 'proxy', 'laptop', 'ENCRYPTED', 'response', {
    proto: 'TLS',
    source: PROXY,
    destination: `${LAPTOP}:50900`,
    info: 'The sealed page, passed back unread',
    plain: 'The page comes back through the tunnel, still sealed.',
    cues: PAGE,
    backing: traced('term-tunnel', 'fact-https', 'fact-connect', 'fact-padlock'),
  }),
];

const step4: SceneEvent[] = [
  msg('s4-get', 'laptop', 'reverse', 'ENCRYPTED', 'request', {
    proto: 'TLS',
    source: `${LAPTOP}:50950`,
    destination: `${SITE}:443`,
    info: 'TLS application data (GET / inside)',
    plain: 'Your browser sends its sealed request to techconcepts.app: now its reverse proxy.',
    backing: traced('fact-https', 'fact-here', 'term-reverse', 'lead-2', 'fact-request'),
  }),
  reverseNote,
];

const step5: SceneEvent[] = [
  msg('s5-get', 'reverse', 'origin', 'GET /', 'request', {
    proto: 'HTTP',
    source: '10.0.0.2:40100',
    destination: '10.0.0.20:80',
    info: 'GET / with X-Forwarded-For: 198.51.100.23',
    plain: 'The reverse proxy passes your request to the web server, with your address in a header.',
    backing: traced('pattern', 'lead-1', 'fact-inside', 'term-xff', 'fact-passes-on', 'fact-request'),
  }),
  add(
    's5-row',
    'Reverse proxy',
    '10.0.0.2, the reverse proxy',
    'In X-Forwarded-For: 198.51.100.23',
    'Your browser, the reverse proxy and the server',
    'The server sees the reverse proxy, and your address in a header.',
    traced('fact-sees', 'term-xff', 'fact-passes-on', 'term-termination', 'fact-inside'),
  ),
  msg('s5-ok', 'origin', 'reverse', '200 OK', 'response', {
    proto: 'HTTP',
    source: '10.0.0.20:80',
    destination: '10.0.0.2:40100',
    info: '200 OK, and the page',
    plain: 'The web server answers the reverse proxy: 200 OK, and the page.',
    fast: true,
    backing: traced('pattern', 'fact-inside', 'fact-request'),
  }),
  msg('s5-page', 'reverse', 'laptop', 'ENCRYPTED', 'response', {
    proto: 'TLS',
    source: `${SITE}:443`,
    destination: `${LAPTOP}:50950`,
    info: 'TLS application data (200 OK, the page inside)',
    plain: 'The reverse proxy seals the page and sends it to you.',
    cues: PAGE,
    backing: traced('pattern', 'term-termination', 'fact-https', 'fact-here', 'fact-request', 'fact-padlock'),
  }),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'proxies',
  title: 'Proxies',
  subtitle: 'A go-between for your requests',
  level: 'beginner',
  certTags: [],
  summary:
    'A proxy takes your request and passes it on as its own. Watch one request go straight to a site, then through a forward proxy, then through the site’s reverse proxy, and see what the server sees each time.',
  figure: 'net-map',
  backing: { traces: ['term-proxy', 'lead-1', 'lead-2', 'fact-sees'] },
  units: [
    {
      id: 'proxies',
      name: 'Proxy',
      fullName: 'Proxy server',
      purpose: 'Passes requests on, for you or for a site',
      osi: { layers: [4, 7], cite: OSI_4_7 },
      backing: { traces: ['term-proxy', 'lead-1', 'lead-2'] },
      scene: {
        title: 'One request, three ways',
        views: ['network'],
        layers: ['proxies:site', 'proxies:proxy'],
        labels: { laptop: 'Wants techconcepts.app', url: 'techconcepts.app', router: '198.51.100.23 outside' },
        start: [{ cue: 'hide', arg: 'resolver' }],
        panel: { type: 'table', table: seen },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'Toward the site' },
            { kind: 'response', label: 'Back toward you' },
            { kind: 'note', label: 'At the reverse proxy, nothing sent' },
          ],
        },
        parties: [],
        backing: {
          traces: [
            'lead-1',
            'lead-2',
            'term-forward',
            'term-reverse',
            'term-termination',
            'fact-here',
            'fact-inside',
            'why-2',
            'fact-nat',
            'fact-sees',
            'fact-passes-on',
            'fact-https',
          ],
        },
      },
      overview: {
        hook: 'When your browser asks a site for a page, the site sees where the request came from. Put a proxy in between and that changes: the site sees the proxy instead. A forward proxy works for you, a reverse proxy for the site. Watch one request go three ways, and see who can read it each time.',
        hookBacking: { traces: ['lead-1', 'lead-2', 'fact-sees', 'fact-nat', 'fact-https', 'term-tunnel', 'term-termination'] },
        description:
          'Think of an office’s post room. Staff hand it their letters, and it sends them on under the office’s own address. A sealed envelope, it can only pass along unopened.',
        backing: { analogy: true },
        facts: [
          { label: 'Does', value: 'takes a request and passes it on, on a connection of its own', backing: { traces: ['term-proxy', 'lead-1'] } },
          { label: 'Forward proxy', value: 'works for the devices set to use it', backing: { traces: ['term-forward', 'lead-2'] } },
          { label: 'Reverse proxy', value: 'works for a site, in front of its servers', backing: { traces: ['term-reverse', 'lead-2'] } },
          { label: 'The site sees', value: 'the proxy’s address, not yours', backing: { traces: ['fact-sees'] } },
          { label: 'OSI layer', value: '7 when it reads web requests; some work at 4', backing: { traces: ['fact-osi'] } },
        ],
      },
      steps: [
        {
          id: 'straight',
          title: 'Straight to the Site',
          sub: 'The site sees your home’s address',
          narrative:
            'Your browser opens **https://techconcepts.app** on a sealed line, straight to the site at 198.51.100.7, port 443. On the way out, your home router swaps your laptop’s address for your home’s public one, 198.51.100.23. So that’s the address the site sees. Only your browser and the site can read what’s inside the seal.',
          deep: [
            {
              text: 'Every device at home goes out through your router’s one public address.',
              cite: [RFC_NAPT, RFC_NAT_SHARE],
            },
          ],
          facts: [
            { label: 'Your laptop', value: '192.168.1.100', backing: { example: true } },
            { label: 'The site sees', value: '198.51.100.23, your home’s address', backing: { traces: ['fact-nat'] } },
            { label: 'Can read the request', value: 'your browser and the site', backing: { traces: ['fact-https'] } },
            { label: 'Going to', value: 'techconcepts.app, port 443', backing: { traces: ['fact-here'] } },
          ],
          events: step1,
          backing: { traces: ['fact-here', 'fact-nat', 'fact-https'] },
          start: [{ cue: 'conn', arg: 'open laptop>origin' }, { cue: 'conn', arg: 'seal laptop>origin' }],
        },
        {
          id: 'set-to-use',
          title: 'Set to Use a Proxy',
          sub: 'CONNECT asks for a tunnel',
          narrative:
            'Now your laptop is set to use a **forward proxy**, at 203.0.113.30. Your browser no longer connects to the site itself. It asks the proxy to **CONNECT** to techconcepts.app, port 443. The proxy opens a connection of its own to the site, then answers 200 OK: the **tunnel** is open. From now on, it just passes bytes along, both ways.',
          deep: [
            {
              text: 'Your laptop knows to use the proxy because it’s set up with the proxy’s address. Organisations often set their devices up this way, to check and log their web traffic.',
              cite: [MS_WIN_SUMMARY, MS_WIN_MANUAL, RFC_INTERMEDIARY, G_SWP_HOW, G_SWP_MODES, MS_FORWARD, PA_LOGGING],
            },
          ],
          facts: [
            { label: 'The proxy', value: '203.0.113.30', backing: { example: true } },
            { label: 'Your browser asks', value: 'CONNECT techconcepts.app:443', backing: { traces: ['fact-connect', 'fact-here'] } },
            { label: 'The proxy', value: 'opens its own connection to the site', backing: { traces: ['pattern', 'lead-1'] } },
            { label: 'The answer', value: '200 OK: the tunnel is open', backing: { traces: ['fact-connect', 'term-tunnel'] } },
          ],
          events: step2,
          backing: { traces: ['term-forward', 'fact-setup', 'fact-connect', 'term-tunnel', 'pattern', 'lead-1', 'fact-here'] },
          start: [{ cue: 'fresh' }, { cue: 'show', arg: 'proxy' }],
        },
        {
          id: 'tunnel',
          title: 'A Tunnel It Can’t Read',
          sub: 'The site sees the proxy’s address',
          narrative:
            'Through the tunnel, your browser seals the line with techconcepts.app itself, then sends its request. The proxy passes the sealed bytes on without reading them. The site sees a connection from 203.0.113.30, the proxy, not from your home. But the proxy knows your address, and the site’s name: it was in your CONNECT.',
          deep: [
            {
              text: 'Over plain HTTP there’s no seal. Your browser hands the proxy the whole request, so the proxy can read it, and it can add your address in a header before passing it on.',
              cite: [PA_HTTP_PROXY, RFC_INTERMEDIARY, RFC_FWD_HEADER, CF_XFF],
            },
          ],
          facts: [
            { label: 'The site sees', value: '203.0.113.30, the proxy', backing: { traces: ['fact-sees'] } },
            { label: 'The proxy reads', value: 'nothing inside the seal', backing: { traces: ['term-tunnel', 'fact-https'] } },
            { label: 'The proxy knows', value: 'your address and the site’s name', backing: { traces: ['fact-knows'] } },
            { label: 'A proxy', value: 'doesn’t encrypt: the seal is your browser’s and the site’s', backing: { traces: ['fact-not-sealed'] } },
          ],
          events: step3,
          backing: { traces: ['term-tunnel', 'fact-connect', 'fact-https', 'fact-sees', 'fact-knows', 'fact-not-sealed', 'lead-1'] },
          start: [{ cue: 'conn', arg: 'seal laptop>proxy>origin' }],
        },
        {
          id: 'reverse-proxy',
          title: 'A Proxy for the Site',
          sub: 'The reverse proxy opens the seal',
          narrative:
            'Now there’s no proxy on your side, but techconcepts.app has a **reverse proxy** in front of its server. The site’s address, 198.51.100.7, now leads to the reverse proxy, and the web server sits behind it. The reverse proxy holds the site’s certificate, so your sealed line ends there. It opens the seal and reads your request.',
          deep: [
            {
              text: 'Ending HTTPS at the reverse proxy saves the servers behind it that work, and lets the reverse proxy read each request to choose where it goes.',
              cite: [MS_TLS_PERF, MS_TLS_ROUTING, CF_REVERSE, G_HTTPS_PROXY],
            },
          ],
          facts: [
            { label: 'techconcepts.app’s address', value: '198.51.100.7, now the reverse proxy’s', backing: { traces: ['term-reverse', 'lead-2'] } },
            { label: 'Your sealed line', value: 'ends at the reverse proxy', backing: { traces: ['term-termination', 'fact-termination'] } },
            { label: 'The web server', value: 'behind it, at 10.0.0.20', backing: { traces: ['why-2', 'term-reverse'] } },
          ],
          events: step4,
          backing: { traces: ['term-reverse', 'lead-2', 'why-2', 'term-termination', 'fact-termination'] },
          start: [
            { cue: 'fresh' },
            { cue: 'hide', arg: 'proxy' },
            { cue: 'hide', arg: 'direct' },
            { cue: 'show', arg: 'reverse' },
            { cue: 'conn', arg: 'open laptop>reverse' },
            { cue: 'conn', arg: 'seal laptop>reverse' },
          ],
        },
        {
          id: 'passed-on',
          title: 'Passed to the Server',
          sub: 'Your address goes along in a header',
          narrative:
            'The reverse proxy passes your request to the web server on a connection of its own, as plain HTTP. So the server sees the reverse proxy’s address, 10.0.0.2. Your address goes along in a header, **X-Forwarded-For**: 198.51.100.23. The page comes back the same way, and the reverse proxy seals it for you.',
          deep: [
            {
              text: 'A reverse proxy can keep a copy of the page and give it to the next reader without asking the server, but only if the site’s response allows it. A response marked no-store or private isn’t kept for others.',
              cite: [RFC_CACHE_STORE, RFC_NO_STORE, RFC_PRIVATE, RFC_FRESH, G_CDN_CACHE],
            },
          ],
          facts: [
            { label: 'The server sees', value: '10.0.0.2, the reverse proxy', backing: { traces: ['fact-sees'] } },
            { label: 'Your address', value: 'in X-Forwarded-For: 198.51.100.23', backing: { traces: ['term-xff', 'fact-passes-on'] } },
            { label: 'Inside the site', value: 'plain HTTP, to port 80', backing: { traces: ['fact-inside'] } },
            { label: 'A reverse proxy can also', value: 'spread requests over servers, or answer from a copy', backing: { traces: ['why-2', 'fact-cache'] } },
          ],
          events: step5,
          backing: { traces: ['pattern', 'lead-1', 'fact-sees', 'fact-inside', 'term-xff', 'fact-passes-on', 'term-termination', 'fact-cache'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'A **proxy** is a go-between. Your request goes to the proxy, and the proxy opens a connection of its own to the site and passes the request on. So the site sees the proxy’s address, not yours.',
            cite: [RFC_INTERMEDIARY, MS_WHAT, PA_HOW, G_SWP_MODES, CF_GW_PROXY, RFC_FWD_WHY, PA_SEES],
          },
          {
            id: 'lead-2',
            text: 'A **forward proxy** works for the people whose devices are set to use it. A **reverse proxy** works for a site: it stands in front of the site’s servers.',
            cite: [RFC_INTERMEDIARY, MS_ON_BEHALF, MS_FORWARD, MS_REVERSE, PA_FORWARD, PA_REVERSE, CF_REVERSE],
          },
          {
            id: 'lead-3',
            text: 'Think of an office’s post room. Staff hand it their letters, and it sends them on under the office’s own address. A sealed envelope, it can only pass along unopened.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-proxy',
            idea: 'A go-between that takes your request and passes it on, on a connection of its own',
            name: 'Proxy (proxy server)',
            cite: [RFC_INTERMEDIARY, MS_WHAT, PA_HOW, G_SWP_MODES, CF_GW_PROXY, MS_WIN_SUMMARY],
          },
          {
            id: 'term-forward',
            idea: 'A proxy that devices are set to use, working for them on the way out',
            name: 'Forward proxy',
            cite: [RFC_INTERMEDIARY, MS_FORWARD, PA_FORWARD, PA_EXPLICIT, MS_WIN_MANUAL],
          },
          {
            id: 'term-reverse',
            idea: 'A proxy in front of a site’s servers, working for the site: requests for the site reach it first',
            name: 'Reverse proxy',
            cite: [RFC_INTERMEDIARY, MS_REVERSE, PA_REVERSE, CF_REVERSE],
          },
          {
            id: 'term-tunnel',
            idea: 'A connection a proxy only relays, both ways, without reading or changing it. A CONNECT request asks for one',
            name: 'Tunnel',
            cite: [RFC_INTERMEDIARY, RFC_CONNECT],
          },
          {
            id: 'term-xff',
            idea: 'A header in which a proxy writes the address a request came from. The standard form is called Forwarded',
            name: 'X-Forwarded-For',
            cite: [RFC_FWD_HEADER, RFC_FWD_WHY, CF_XFF, MS_HEADERS, MS_AGW_HEADERS, G_XFF],
          },
          {
            id: 'term-termination',
            idea: 'A reverse proxy that holds the site’s certificate ends your HTTPS connection itself: it opens what you send and seals what it sends back, so it can read the request',
            name: 'TLS termination',
            cite: [MS_TLS_TERM, G_HTTPS_PROXY, PA_REVERSE_USES, MS_REVERSE, CF_REVERSE],
          },
          {
            id: 'term-cache',
            idea: 'Copies of answers kept to answer the next request, when the response allows it',
            name: 'Cache',
            cite: [RFC_SHARED_CACHE, RFC_CACHE_STORE, G_CDN_CACHE],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Take the request', 'Allow or block it', 'Open its own connection', 'Pass the answer back'],
          note: 'What a proxy does with a request, forward or reverse. Its own connection is a new TCP connection to the server. Through a tunnel it can’t read the request, so it only connects and passes the sealed bytes both ways.',
          cite: [RFC_INTERMEDIARY, RFC_CONNECT, MS_WHAT, MS_HOW, G_SWP_HOW, G_SWP_MODES, CF_GW_PROXY, CF_GW_TCP, CF_REVERSE, PA_HOW],
        },
        why: [
          {
            id: 'why-1',
            text: 'Organisations use a forward proxy to control and log their people’s web traffic, and to share one cache.',
            cite: [RFC_INTERMEDIARY, MS_FORWARD, G_SWP_HOW, PA_LOGGING],
          },
          {
            id: 'why-2',
            text: 'Sites use a reverse proxy to spread requests over several servers, to answer from copies, to handle HTTPS for their servers, and so readers never need the servers’ own addresses.',
            cite: [RFC_INTERMEDIARY, MS_REVERSE, CF_REVERSE, PA_REVERSE_USES],
          },
        ],
        deep: [
          {
            id: 'deep-inspect',
            text: 'Some organisations have their proxy open HTTPS to check it. The proxy then shows your browser a certificate of its own for each site, which works only on devices set up to trust the organisation.',
            cite: [G_TLS_HOW, G_TLS_TRUST, CF_TLS_REENCRYPT, CF_TLS_TRUST, PA_HTTP_PROXY],
          },
          {
            id: 'deep-cdn',
            text: 'A content delivery network (CDN) is the same idea on a large scale: reverse proxies in many places, each keeping copies of a site’s pages near the readers there.',
            cite: [RFC_CACHES_CDN, CF_REVERSE, G_CDN_WHAT],
          },
          {
            id: 'deep-transparent',
            text: 'Some networks put a proxy in the way without your device being set to use one. It’s called a transparent, or interception, proxy.',
            cite: [RFC_INTERMEDIARY, MS_TRANSPARENT, PA_TRANSPARENT],
          },
        ],
        facts: [
          {
            id: 'fact-sees',
            label: 'The site sees',
            value: 'the proxy’s address, not yours: the connection is the proxy’s',
            cite: [RFC_FWD_WHY, PA_SEES, PA_REPLACES, RFC_INTERMEDIARY],
          },
          {
            id: 'fact-knows',
            label: 'The proxy sees',
            value: 'your address, and the name and port of each site you ask for, and it can log them',
            cite: [RFC_CONNECT, MS_FORWARD, PA_TRACED, PA_LOGGING],
          },
          {
            id: 'fact-passes-on',
            label: 'Your address',
            value: 'still reaches the site if a proxy that reads the request writes it in a header',
            cite: [RFC_FWD_HEADER, CF_XFF, MS_HEADERS],
          },
          {
            id: 'fact-not-sealed',
            label: 'Does a proxy encrypt?',
            value: 'no; over HTTPS the seal is your browser’s and the site’s',
            cite: [PA_NO_ENCRYPT, PA_BASIC, RFC_CONNECT, RFC_TLS_CONF],
          },
          {
            id: 'fact-connect',
            label: 'HTTPS through a forward proxy',
            value: 'an HTTP CONNECT request for the site’s name and port; a 2xx answer, such as 200 OK; then a tunnel, sealed end to end by HTTPS, that the proxy only relays',
            cite: [RFC_CONNECT, RFC_INTERMEDIARY],
          },
          {
            id: 'fact-https',
            label: 'HTTPS',
            value: 'sends every HTTP message encrypted, as TLS application data, so only its two ends, your browser and the site, can read what’s inside',
            cite: [RFC_TLS_DATA, RFC_TLS_CONF, RFC_HTTPS_443, CF_TLS_HIDDEN],
          },
          {
            id: 'fact-here',
            label: 'The site here',
            value: 'techconcepts.app, over HTTPS to port 443',
            cite: [RFC_HTTPS_443],
          },
          {
            id: 'fact-termination',
            label: 'A reverse proxy',
            value: 'can hold the site’s certificate and open HTTPS itself',
            cite: [MS_TLS_TERM, G_HTTPS_PROXY, CF_REVERSE, PA_REVERSE_USES],
          },
          {
            id: 'fact-inside',
            label: 'Behind a reverse proxy',
            value: 'plain HTTP to port 80, or sealed again: the site chooses',
            cite: [MS_TLS_TERM, MS_TLS_E2E, G_BACKENDS, RFC_HTTP_80],
          },
          {
            id: 'fact-cache',
            label: 'Copies',
            value: 'only when the response lets it be kept: one marked no-store or private isn’t kept for others',
            cite: [RFC_CACHE_STORE, RFC_NO_STORE, RFC_PRIVATE, G_CDN_CACHE],
          },
          {
            id: 'fact-nat',
            label: 'Your home router',
            value: 'swaps your laptop’s private address for your home’s public one, the address seen outside',
            cite: [RFC_NAPT, RFC_NAT_SHARE],
          },
          {
            id: 'fact-setup',
            label: 'A forward proxy is used by',
            value: 'devices set up with its address',
            cite: [RFC_INTERMEDIARY, MS_WIN_SUMMARY, MS_WIN_MANUAL, G_SWP_MODES, PA_EXPLICIT],
          },
          {
            id: 'fact-osi',
            label: 'OSI layer',
            value: '7 when it reads web requests; some work at 4',
            cite: OSI_4_7,
          },
          {
            id: 'fact-request',
            label: 'An HTTP page request',
            value: 'GET asks for a page, and GET / for the page at the site’s bare address; the answer 200 OK sends it back',
            cite: [RFC_GET, RFC_OK, RFC_TARGET],
          },
          {
            id: 'fact-padlock',
            label: 'The padlock',
            value: 'your browser shows it when the page came over HTTPS from a site with a valid certificate',
            cite: [EDGE_ICON, CF_MIXED],
          },
        ],
      },
      practice: [
        {
          id: 'who-sees',
          prompt: 'Your laptop uses a forward proxy to open an HTTPS site. Which is true?',
          options: [
            {
              text: 'The site sees the proxy’s address. The proxy sees the site’s name, but can’t read your request.',
              feedback: 'Right. The proxy opens its own connection, so the site sees the proxy. It learns the site’s name from your CONNECT, but your request is sealed by HTTPS.',
              cite: [RFC_CONNECT, RFC_FWD_WHY, PA_SEES, RFC_TLS_CONF],
            },
            {
              text: 'The proxy encrypts your request, so no one can tell which site you visit.',
              feedback: 'Not quite. A proxy doesn’t encrypt: the seal is HTTPS’s. And the proxy itself sees which site you asked for.',
              cite: [PA_NO_ENCRYPT, PA_BASIC, RFC_CONNECT, RFC_TLS_CONF],
            },
            {
              text: 'The site still sees your home’s address.',
              feedback: 'Not quite. The site’s connection comes from the proxy, so it sees the proxy’s address. Yours only reaches it if a proxy writes it in a header, and a tunnel can’t.',
              cite: [RFC_FWD_WHY, PA_SEES, RFC_FWD_HEADER, RFC_INTERMEDIARY, CF_XFF],
            },
          ],
          answer: 0,
        },
        {
          id: 'reverse',
          prompt: 'techconcepts.app puts a reverse proxy in front of its web server. Whom does the reverse proxy work for?',
          options: [
            {
              text: 'The site. It takes readers’ requests and passes each to a server behind it.',
              feedback: 'Right. A reverse proxy works for the site. It can also end HTTPS, spread requests over several servers, and answer from copies the site allows.',
              cite: [RFC_INTERMEDIARY, MS_REVERSE, PA_REVERSE, CF_REVERSE, PA_REVERSE_USES, RFC_CACHE_STORE],
            },
            {
              text: 'The readers. It hides their addresses from the site.',
              feedback: 'Not quite. It works for the site, and it can pass each reader’s address on to the server in a header such as X-Forwarded-For.',
              cite: [RFC_FWD_HEADER, MS_AGW_HEADERS, CF_XFF, G_XFF, MS_REVERSE],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
