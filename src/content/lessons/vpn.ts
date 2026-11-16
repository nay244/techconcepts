import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * VPN, Networking Concepts stop 20, the track's last. In a café you open example.net without a VPN, and someone listening
 * on its Wi-Fi could read the request and the page. You turn an IPsec VPN on: IKE sets up a tunnel to a VPN server and the
 * server gives your laptop an address on its side. Your next request is sealed by ESP inside a packet addressed to the VPN
 * server, so the café sees only that you are talking to it. The server unwraps it and sends it on as plain HTTP from the
 * address it gave you, and the page comes back through the tunnel. Last, an HTTPS request stays sealed past the server too.
 *
 * What a VPN is for, its kinds and who can read what rest on NIST SP 800-77r1 plus a vendor, two publishers each. Every
 * mechanism (the tunnel's two headers, ESP's sealing, IKE's keys and the address the server gives, UDP port 4500 behind a
 * NAT) is defined by RFC 4301, 4303, 7296 and 3948, marked defining; TLS and HTTP are RFC 9846 and 9110. No vendor page is
 * marked defining. The addresses and client ports in the log are example data (RFC 5737 and RFC 1918; made-up ports);
 * every time and size is a dash because no source gives one. The scene is the approved design's
 * (prototypes/d15-vpn.md); its events, cues and table are src/content/vpn-fixture.ts's, with their backing added.
 */

// ---------------------------------------------------------------- citations

const d = (source: string, section: string) => cite(source, section, { defining: true });
const NIST_77 = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';
const nist77 = (section: string, page: number) => cite('nist-sp800-77r1', section, { url: `${NIST_77}#page=${page}` });
/** A vendor’s page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });
const at = (source: string, section: string, id: string) => cite(source, section, { url: `${SOURCES[source]!.url}#${id}` });

// IPsec, TLS and HTTP: the defining documents
const IPSEC_BOUNDARY = d('rfc-4301', '3.1');      // I-5
const IPSEC_ESP = d('rfc-4301', '3.2');           // I-5
const IPSEC_TUNNEL = d('rfc-4301', '4.1');        // I-9, I-10
const ESP_SERVICES = d('rfc-4303', '1');          // I-11
const ESP_TUNNEL = d('rfc-4303', '3.1.2');        // I-9, I-10, I-16
const ESP_RECEIVER = d('rfc-4303', '3.4.4.1');    // I-12, I-14
const IKE_JOB = d('rfc-7296', '1');               // I-5, I-6
const IKE_REMOTE = d('rfc-7296', '1.1.3');        // I-7, I-8, I-9, I-12, I-15
const IKE_EXCHANGES = d('rfc-7296', '1.2');       // I-6
const IKE_PORT = d('rfc-7296', '2');              // I-8
const IKE_ADDRESS = d('rfc-7296', '2.19');        // I-7
const IKE_NAT = d('rfc-7296', '2.23');            // I-8
const ESP_UDP = d('rfc-3948', '1');               // I-8
const TLS_ENDS = d('rfc-9846', '1');              // I-2, I-16 (What is HTTPS's lead-2)
const HTTP_80 = d('rfc-9110', '4.2.1');           // I-22
const HTTPS_443 = d('rfc-9110', '4.2.2');         // I-22, I-20
// NIST SP 800-77r1 (printed page + 17) and SP 800-123 (as Firewalls cites it)
const NIST_EXEC = nist77('Executive Summary', 8); // I-5, I-11, I-21
const NIST_VPN = nist77('2.3', 25);               // I-3, I-5
const NIST_KEYS = nist77('2.3.3', 26);            // I-6
const NIST_GATEWAYS = nist77('2.4.1', 28);        // I-18
const NIST_REMOTE = nist77('2.4.2', 30);          // I-13, I-17, I-18, I-19
const NIST_DECRYPTED = nist77('2.4.2', 31);       // I-12, I-13, I-14, I-15
const NIST_TUNNEL = nist77('4.1.1', 54);          // I-9, I-10
const NIST_UDP = nist77('4.2.1', 60);              // I-8
const NIST_LINK = nist77('8.1', 103);             // I-21
const NIST_WIFI = nist77('8.1.1', 104);           // I-1
const NIST_TLS_VPN = nist77('8.2', 105);          // I-20, I-21
const NIST_SSTP = nist77('8.2.1', 105);           // I-20
const NIST_OPENVPN = nist77('8.2.3', 106);        // I-20
const NIST_WIREGUARD = nist77('8.3', 106);        // I-20
const NIST_SERVER_SECURITY = cite('nist-sp800-123', '6.5', { url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-123.pdf#page=48' }); // I-16, I-19
// Cisco
const CISCO_VPN = vendor('cisco-what-is-vpn', 'What is a virtual private network (VPN)?', 'is an encrypted connection over the Internet from a device to a network'); // I-3
const CISCO_EAVESDROP = vendor('cisco-what-is-vpn', 'What is a virtual private network (VPN)?', 'It prevents unauthorized people from eavesdropping'); // I-1
const CISCO_WORKS = vendor('cisco-what-is-vpn', 'How does a virtual private network (VPN) work?', 'A VPN extends a corporate network through encrypted connections'); // I-13, I-19
const CISCO_TUNNEL = vendor('cisco-what-is-vpn', 'Is VPN traffic encrypted?', 'an encrypted connection across the Internet known as a tunnel'); // I-9
const CISCO_REMOTE = vendor('cisco-what-is-vpn', 'Remote access', 'A remote access VPN securely connects a device outside the corporate office'); // I-18
const CISCO_SITE = vendor('cisco-what-is-vpn', 'Site-to-site', 'connects the corporate office to branch offices over the Internet'); // I-18
const CISCO_WIFI_VPN = vendor('cisco-wifi-security', 'Virtual private networks (VPNs)', 'VPNs are another source of Wi-Fi network security'); // I-1
const CISCO_WIFI_ADDRESS = vendor('cisco-wifi-security', 'Virtual private networks (VPNs)', 'by using a virtual IP address it assigns'); // I-7
// Palo Alto Networks
const PA_PERSONAL = vendor('paloalto-what-is-vpn', 'How does a VPN work?', 'routes it through a remote server operated by the VPN provider'); // I-4
const PA_BUSINESS = vendor('paloalto-what-is-vpn', 'How does a VPN work?', 'That client establishes a secure connection to a VPN gateway'); // I-4
const PA_NEW_ADDRESS = vendor('paloalto-what-is-vpn', 'How does a VPN work?', 'That server assigns a new IP address to the user'); // I-7
const PA_PUBLIC_WIFI = vendor('paloalto-what-is-vpn', 'Personal VPN benefits', 'Public networks are often unsecured'); // I-1
const PA_SITE = vendor('paloalto-what-is-vpn', 'Site-to-site VPN', 'connects two or more networks over the internet'); // I-18
const PA_REMOTE = vendor('paloalto-what-is-vpn', 'Remote access VPN', 'This allows remote employees to access apps'); // I-19
const PA_SSL_VPN = vendor('paloalto-what-is-vpn', 'SSL VPN', 'An SSL VPN uses the Secure Sockets Layer'); // I-20
const PA_IKE = vendor('paloalto-what-is-vpn', 'Internet Protocol Security (IPsec)', 'It also uses Internet Key Exchange (IKE) to establish encryption keys'); // I-5
const PA_SSTP = vendor('paloalto-what-is-vpn', 'Secure Socket Tunneling Protocol (SSTP)', 'Because it relies on the same port used for HTTPS traffic'); // I-20
const PA_OPENVPN = vendor('paloalto-what-is-vpn', 'OpenVPN', 'OpenVPN is a flexible open'); // I-20
const PA_WIREGUARD = vendor('paloalto-what-is-vpn', 'WireGuard', 'WireGuard is a modern'); // I-20
const PA_WIREGUARD_UDP = vendor('paloalto-what-is-vpn', 'WireGuard', 'It uses UDP for fast'); // I-20
const PA_TUNNEL = vendor('paloalto-vpn-tunnel', 'What Is a VPN Tunnel?', 'A VPN tunnel is a secure'); // I-3
const PA_TO_SERVER = vendor('paloalto-vpn-tunnel', '2. Establishment of an encrypted tunnel', 'This encryption shields the internet traffic'); // I-13
const PA_DECRYPT = vendor('paloalto-vpn-tunnel', '4. Decryption at the VPN server', 'The VPN server receives the encrypted data'); // I-12
const PA_RETURN = vendor('paloalto-vpn-tunnel', "5. Return of data to the user's device", 'Data sent from the internet back to the user'); // I-7, I-15
const PA_SPLIT = vendor('paloalto-vpn-tunnel', 'What Is VPN Split Tunneling?', 'VPN split tunneling is a feature'); // I-17
const PA_ENCAPSULATE = vendor('paloalto-vpn-tunnel', 'How is tunneling accomplished in a VPN?', 'tunneling is accomplished by encapsulating'); // I-9
const PA_TUNNEL_MODE = vendor('paloalto-ipsec', 'IPsec Tunnel Mode', 'Tunnel Mode encapsulates the entire IP packet'); // I-9
const PA_PORTS = vendor('paloalto-ipsec', 'IPSec Ports', 'UDP port 500 for initiating connections'); // I-8
const PA_LAYERS = vendor('paloalto-ipsec', 'IPsec vs. SSL VPN', 'IPsec VPNs encrypt at the network layer'); // I-21
// Microsoft
const MS_COFFEE = at('microsoft-windows-vpn', 'Summary', 'summary'); // I-1
const MS_VPN_PROFILE = at('microsoft-windows-vpn', 'Create a VPN profile', 'create-a-vpn-profile'); // I-3, I-4
const MS_P2S = at('microsoft-azure-vpn-p2s', 'What protocol does P2S use?', 'protocol'); // I-20
const MS_SSTP = vendor('microsoft-ms-sstp', '1.3 Overview', 'This protocol provides an encrypted tunnel'); // I-20
const MS_KINDS = at('microsoft-azure-network-best-practices', 'Disable RDP and SSH access to virtual machines', 'disable-rdp-and-ssh-access-to-virtual-machines'); // I-18, I-19
const MS_VPN = vendor('microsoft-azure-network-best-practices', 'Disable RDP and SSH access to virtual machines', 'Point-to-site VPN is more secure than direct RDP or SSH connections'); // I-19; Firewalls' MS_VPN
const EDGE_HTTP = cite('microsoft-edge-https-first', 'What are HTTP and HTTPS?', { url: 'https://support.microsoft.com/en-us/edge/secure-your-web-browsing-with-https-first-mode-in-microsoft-edge#:~:text=What%20are%20HTTP%20and%20HTTPS' }); // I-2; What is HTTPS's EDGE_HTTP
// Google
const CHROME_SYMBOLS = cite('google-chrome-secure', 'What each security symbol means', { url: 'https://support.google.com/chrome/answer/95617#:~:text=What%20each%20security%20symbol%20means' }); // I-2; What is HTTPS's CHROME_SYMBOLS
const G_VPN = vendor('google-cloud-vpn', 'Cloud VPN overview', 'one VPN gateway handling encryption'); // I-18
const HTTP_GET = d('rfc-9110', '9.3.1');          // fact-get
const HTTP_REQUEST_LINE = d('rfc-9112', '3');     // fact-get
const HTTP_TARGET = d('rfc-9112', '3.2.1');       // fact-get

// ---------------------------------------------------------------- events

const DASH = '—';
const CAFE = 'On the café’s Wi-Fi';
const SERVER = 'The VPN server';
const AFTER = 'After the VPN server';
const LAPTOP = '192.168.1.100';
const VPN = '203.0.113.40';
const VPN_OUT = '203.0.113.41';
const WEB = '203.0.113.80';

const traced = (...traces: string[]): Backing => ({ traces });

const msg = (
  id: string,
  from: string,
  to: string,
  tag: string,
  kind: 'request' | 'response',
  o: { proto: string; source: string; destination: string; info: string; plain: string; cues?: Cue[]; backing: Backing },
): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag,
  kind,
  log: { time: DASH, source: o.source, destination: o.destination, protocol: o.proto, info: o.info, size: DASH },
  plain: o.plain,
  ...(o.cues === undefined ? {} : { cues: o.cues }),
  backing: o.backing,
});

/** A row of the table changes in place; a readable one carries the mark, a sealed one has none. */
const update = (id: string, who: string, to: string, read: string, readable: boolean, summary: string, backing: Backing): TableEvent => ({
  type: 'table',
  id,
  table: 'who-reads',
  op: 'update',
  key: who,
  row: { who, to, read },
  miss: readable,
  summary,
  backing,
});

const status = (arg: string): Cue => ({ cue: 'status', arg });

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

const step1: SceneEvent[] = [
  msg('s1-get', 'laptop', 'web', 'GET /', 'request', {
    proto: 'HTTP',
    source: `${LAPTOP}:50422`,
    destination: `${WEB}:80`,
    info: 'Plain HTTP: anyone on the way could read it',
    plain: 'Your laptop asks example.net for its page, in plain HTTP.',
    cues: [{ cue: 'listener', arg: 'reads' }, status('Readable on the café’s Wi-Fi')],
    backing: traced('fact-get', 'fact-here', 'fact-https', 'fact-wifi', 'why-1'),
  }),
  update('s1-row', CAFE, 'example.net', 'Yes: the request and the page', true, 'Someone on the café’s Wi-Fi can read your request.', traced('fact-wifi', 'fact-https', 'why-1')),
  msg('s1-page', 'web', 'laptop', 'PAGE', 'response', {
    proto: 'HTTP',
    source: `${WEB}:80`,
    destination: `${LAPTOP}:50422`,
    info: 'The page, in plain HTTP',
    plain: 'The page comes back, in plain HTTP.',
    cues: [{ cue: 'page', arg: 'text' }],
    backing: traced('fact-here', 'fact-https'),
  }),
];

const step2: SceneEvent[] = [
  msg('s2-init', 'laptop', 'vpn', 'IKE_SA_INIT', 'request', {
    proto: 'IKE',
    source: `${LAPTOP}:500`,
    destination: `${VPN}:500`,
    info: 'Let’s agree on keys',
    plain: 'Your laptop asks the VPN server to agree on keys.',
    cues: [{ cue: 'conn', arg: 'open laptop>vpn tunnel' }, status('Setting up the tunnel')],
    backing: traced('term-ike', 'term-tunnel', 'term-vpn-server', 'fact-setup', 'fact-ports'),
  }),
  msg('s2-init-back', 'vpn', 'laptop', 'IKE_SA_INIT', 'response', {
    proto: 'IKE',
    source: `${VPN}:500`,
    destination: `${LAPTOP}:500`,
    info: 'Keys agreed; there’s a NAT in the way, so carry on at port 4500',
    plain: 'The server agrees, and both find a NAT in the way.',
    backing: traced('term-ike', 'fact-setup', 'fact-ports', 'fact-nat'),
  }),
  msg('s2-auth', 'laptop', 'vpn', 'IKE_AUTH', 'request', {
    proto: 'IKE',
    source: `${LAPTOP}:4500`,
    destination: `${VPN}:4500`,
    info: 'Encrypted: who I am, and may I have an address?',
    plain: 'Your laptop proves who it is, encrypted, and asks for an address.',
    backing: traced('term-ike', 'fact-setup', 'fact-address', 'fact-ports'),
  }),
  msg('s2-auth-back', 'vpn', 'laptop', 'IKE_AUTH', 'response', {
    proto: 'IKE',
    source: `${VPN}:4500`,
    destination: `${LAPTOP}:4500`,
    info: 'Encrypted: who I am; your address is 203.0.113.41',
    plain: 'The server proves who it is and gives your laptop 203.0.113.41.',
    cues: [{ cue: 'conn', arg: 'seal laptop>vpn tunnel' }, status('Tunnel ready')],
    backing: traced('term-ike', 'term-tunnel', 'fact-setup', 'fact-address', 'fact-ports'),
  }),
];

const step3: SceneEvent[] = [
  msg('s3-esp', 'laptop', 'vpn', 'ESP', 'request', {
    proto: 'ESP',
    source: `${LAPTOP}:4500`,
    destination: `${VPN}:4500`,
    info: 'Outside: to the VPN server. Inside, sealed: GET / to example.net',
    plain: 'Your request, sealed inside a packet addressed to the VPN server.',
    cues: [{ cue: 'listener', arg: 'outside' }, status('Sealed in the tunnel')],
    backing: traced('term-esp', 'term-tunnel', 'term-vpn-server', 'fact-outer', 'fact-inner', 'fact-get', 'fact-nat', 'fact-ports', 'lead-1'),
  }),
  update('s3-row', CAFE, `${VPN}, the VPN server`, 'No: sealed', false, 'Someone on the café’s Wi-Fi now sees only that you’re talking to the VPN server.', traced('fact-outer', 'fact-inner', 'term-vpn-server', 'lead-1')),
];

const step4: SceneEvent[] = [
  update('s4-server', SERVER, 'example.net', 'Yes, once it unwraps it', true, 'The VPN server unwraps your request and can read it.', traced('fact-server-reads', 'term-vpn-server', 'fact-ends')),
  msg('s4-get', 'vpn-out', 'web', 'GET /', 'request', {
    proto: 'HTTP',
    source: `${VPN_OUT}:50423`,
    destination: `${WEB}:80`,
    info: 'Unwrapped: plain HTTP again, from the VPN’s address',
    plain: 'The VPN server sends your request on to example.net.',
    cues: [status('Plain again past the VPN server')],
    backing: traced('fact-get', 'fact-here', 'fact-address', 'fact-ends', 'lead-2', 'term-vpn-server'),
  }),
  update('s4-after', AFTER, 'example.net', 'Yes: plain HTTP again', true, 'After the VPN server, anyone on the way could read it.', traced('fact-ends', 'fact-https', 'lead-2')),
  msg('s4-page', 'web', 'vpn-out', 'PAGE', 'response', {
    proto: 'HTTP',
    source: `${WEB}:80`,
    destination: `${VPN_OUT}:50423`,
    info: 'The page, to the VPN’s address',
    plain: 'example.net replies to 203.0.113.41, so the page goes to the VPN server.',
    backing: traced('fact-here', 'fact-address', 'fact-reply', 'term-vpn-server'),
  }),
  msg('s4-esp', 'vpn', 'laptop', 'ESP', 'response', {
    proto: 'ESP',
    source: `${VPN}:4500`,
    destination: `${LAPTOP}:4500`,
    info: 'Outside: from the VPN server. Inside, sealed: the page',
    plain: 'The server seals the page and sends it back through the tunnel.',
    cues: [{ cue: 'page', arg: 'text' }],
    backing: traced('term-esp', 'term-tunnel', 'term-vpn-server', 'fact-outer', 'fact-inner', 'fact-reply', 'fact-nat', 'fact-ports'),
  }),
];

const step5: SceneEvent[] = [
  msg('s5-esp', 'laptop', 'vpn', 'ESP', 'request', {
    proto: 'ESP',
    source: `${LAPTOP}:4500`,
    destination: `${VPN}:4500`,
    info: 'Outside: to the VPN server. Inside, sealed twice: an HTTPS request',
    plain: 'Your HTTPS request, sealed again inside a packet to the VPN server.',
    cues: [{ cue: 'url', arg: 'https://example.net' }, status('Sealed all the way to the site')],
    backing: traced('term-esp', 'term-tunnel', 'term-vpn-server', 'fact-outer', 'fact-inner', 'fact-https', 'fact-here', 'fact-nat', 'fact-ports'),
  }),
  update('s5-server', SERVER, 'example.net', 'No: sealed by HTTPS', false, 'The VPN server unwraps it, and finds it still sealed by HTTPS.', traced('fact-https', 'fact-server-reads', 'term-vpn-server')),
  msg('s5-https', 'vpn-out', 'web', 'HTTPS', 'request', {
    proto: 'HTTPS',
    source: `${VPN_OUT}:50424`,
    destination: `${WEB}:443`,
    info: 'Still sealed by HTTPS: the VPN server can’t read it',
    plain: 'The VPN server sends it on, still sealed by HTTPS.',
    backing: traced('fact-https', 'fact-here', 'fact-address', 'fact-server-reads', 'term-vpn-server'),
  }),
  update('s5-after', AFTER, 'example.net', 'No: sealed by HTTPS', false, 'After the VPN server, it stays sealed by HTTPS.', traced('fact-https', 'fact-ends')),
  msg('s5-https-back', 'web', 'vpn-out', 'HTTPS', 'response', {
    proto: 'HTTPS',
    source: `${WEB}:443`,
    destination: `${VPN_OUT}:50424`,
    info: 'The page, sealed by HTTPS',
    plain: 'example.net sends the page back, sealed by HTTPS.',
    backing: traced('fact-https', 'fact-here', 'fact-address', 'term-vpn-server'),
  }),
  msg('s5-esp-back', 'vpn', 'laptop', 'ESP', 'response', {
    proto: 'ESP',
    source: `${VPN}:4500`,
    destination: `${LAPTOP}:4500`,
    info: 'Outside: from the VPN server. Inside, sealed twice: the page',
    plain: 'The page comes back through the tunnel, still sealed by HTTPS inside.',
    cues: [{ cue: 'lock' }, { cue: 'page', arg: 'text' }],
    backing: traced('term-esp', 'term-tunnel', 'term-vpn-server', 'fact-outer', 'fact-inner', 'fact-https', 'fact-reply', 'fact-nat', 'fact-ports'),
  }),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'vpn',
  title: 'VPN',
  subtitle: 'A sealed tunnel, as far as the VPN server',
  level: 'beginner',
  certTags: [],
  summary:
    'A VPN seals what goes through its tunnel to a VPN server, so on the café’s Wi-Fi it shows only that you’re talking to the server. Watch the tunnel being set up, a request wrapped and unwrapped, and why HTTPS still matters past the server.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'lead-2', 'term-ike', 'fact-ends', 'fact-https', 'why-1'] },
  units: [
    {
      id: 'vpn',
      name: 'VPN',
      fullName: 'Virtual private network',
      purpose: 'Seals your traffic as far as a VPN server',
      osi: 'spans',
      backing: { traces: ['term-vpn', 'fact-name', 'lead-1', 'fact-ends'] },
      scene: {
        title: 'Sealed from your laptop to the VPN server',
        views: ['network'],
        layers: ['vpn:vpn', 'vpn:web'],
        labels: { laptop: CAFE, url: 'example.net' },
        start: [{ cue: 'hide', arg: 'resolver' }, { cue: 'show', arg: 'cafe' }],
        panel: { type: 'table', table: whoReads },
        log: eventLog(),
        parties: [],
        backing: {
          traces: [
            'why-1', 'fact-wifi', 'lead-1', 'lead-2', 'term-vpn-server', 'term-tunnel', 'term-ike', 'fact-setup', 'fact-here', 'fact-https',
            'fact-reply', 'fact-outer', 'fact-inner', 'fact-server-reads', 'fact-ends',
          ],
        },
      },
      overview: {
        hook: 'On a café’s Wi-Fi you can’t tell who is listening. A VPN wraps what you send through it in a sealed packet addressed to a VPN server, so all the café sees of it is that you’re talking to the server. But the seal ends at the server: from there your request goes on as it would have without the VPN. Watch both, and see why HTTPS still matters.',
        hookBacking: { traces: ['why-1', 'lead-1', 'lead-2', 'fact-outer', 'fact-ends', 'fact-https'] },
        description:
          'Think of putting your postcard in a sealed envelope addressed to a friend, who opens it and posts the postcard on. Until your friend, everyone sees only the envelope; after, it’s a postcard again. HTTPS is the locked box: it stays shut the whole way.',
        backing: { analogy: true },
        facts: [
          { label: 'Does', value: 'seals your traffic in a tunnel to a VPN server', backing: { traces: ['lead-1', 'term-tunnel'] } },
          { label: 'Protects', value: 'your device to the VPN server, not beyond', backing: { traces: ['fact-ends'] } },
          { label: 'The network you’re on sees', value: 'for traffic in the tunnel, only that you’re talking to the VPN server', backing: { traces: ['fact-outer'] } },
          { label: 'Kinds include', value: 'remote access (device to network) and site-to-site (network to network)', backing: { traces: ['term-remote-access', 'term-site-to-site'] } },
          { label: 'One way to build it', value: 'IPsec, with IKE and ESP', backing: { traces: ['term-ipsec', 'term-ike', 'term-esp'] } },
        ],
      },
      steps: [
        {
          id: 'plain-cafe',
          title: 'Plain HTTP on Café Wi-Fi',
          sub: 'Without a VPN, someone listening could read it',
          narrative:
            'You’re in a café, on its Wi-Fi, and you open example.net. Your laptop sends a plain HTTP request over the Wi-Fi and on across the internet. Someone listening on the café’s network, or anyone on the way, could read it: which site you asked for, what you asked, and the page that comes back.',
          deep: [
            {
              text: 'On Wi-Fi you don’t run, such as a café’s or a hotel’s, security guides advise using a VPN. It seals what you send through it before it leaves your laptop, as far as the VPN server.',
              cite: [NIST_WIFI, PA_PUBLIC_WIFI, CISCO_WIFI_VPN, NIST_REMOTE],
            },
          ],
          facts: [
            { label: 'Your request', value: 'plain HTTP to example.net, port 80', backing: { traces: ['fact-here', 'fact-https', 'fact-get'] } },
            { label: 'Someone on the café’s Wi-Fi', value: 'could read it, and the page', backing: { traces: ['fact-wifi', 'fact-https', 'why-1'] } },
            { label: 'On Wi-Fi you don’t run', value: 'you can’t tell who is listening', backing: { traces: ['fact-wifi'] } },
          ],
          events: step1,
          backing: { traces: ['why-1', 'fact-wifi', 'fact-https', 'fact-here', 'fact-get'] },
        },
        {
          id: 'ike',
          title: 'IKE: Setting Up the Tunnel',
          sub: 'Your laptop and the VPN server agree on keys',
          narrative:
            'Now you turn the VPN on. Your laptop and the VPN server, at 203.0.113.40, first agree on secret keys, in a way someone listening can’t work out. Then each proves who it is, already encrypted, and the server gives your laptop an address on its side: 203.0.113.41. This is **IKE**, the part of **IPsec** that sets up the **tunnel**.',
          deep: [
            {
              text: 'Here a NAT is in the way: it swaps your laptop’s address and port for its own. So IKE moves to UDP port 4500, and the sealed packets that follow travel inside UDP there too, which a NAT can pass.',
              cite: [IKE_NAT, ESP_UDP, NIST_UDP],
            },
          ],
          facts: [
            { label: 'IKE', value: 'agrees on keys, then each side proves who it is', backing: { traces: ['term-ike', 'fact-setup'] } },
            { label: 'Someone listening', value: 'can’t work out the keys being agreed', backing: { traces: ['fact-setup'] } },
            { label: 'Your address on the VPN’s side', value: '203.0.113.41', backing: { traces: ['fact-address'] } },
            { label: 'Ports', value: 'UDP 500, then 4500 because a NAT is in the way', backing: { traces: ['fact-ports', 'fact-nat'] } },
          ],
          events: step2,
          backing: { traces: ['term-vpn-server', 'term-ipsec', 'term-ike', 'term-tunnel', 'fact-setup', 'fact-address', 'fact-ports', 'fact-nat'] },
        },
        {
          id: 'esp',
          title: 'ESP: Wrapped and Sealed',
          sub: 'One packet inside another',
          narrative:
            'You open example.net again. This time your laptop wraps the request: the whole packet, from 203.0.113.41 to example.net, is encrypted and put inside a new packet addressed to the VPN server. That’s **ESP**. Someone listening on the café’s Wi-Fi sees only the outside: a packet from you to 203.0.113.40. Where it’s really going, and what it says, stay sealed.',
          deep: [
            {
              text: 'This is IPsec’s tunnel mode. ESP encrypts the whole original packet, its header too, and the new header names only the tunnel’s two ends. ESP also adds a check, so the VPN server can tell if anything was changed.',
              cite: [ESP_TUNNEL, ESP_SERVICES, NIST_TUNNEL],
            },
          ],
          facts: [
            { label: 'Outside', value: 'from your laptop to the VPN server; not sealed', backing: { traces: ['fact-outer'] } },
            { label: 'Inside, sealed', value: 'your request, from 203.0.113.41 to example.net', backing: { traces: ['fact-inner', 'fact-address'] } },
            { label: 'Someone on the café’s Wi-Fi', value: 'sees only that you’re talking to the VPN server', backing: { traces: ['fact-outer', 'lead-1'] } },
            { label: 'It travels', value: 'inside UDP, port 4500', backing: { traces: ['fact-nat', 'fact-ports'] } },
          ],
          events: step3,
          backing: { traces: ['term-esp', 'term-tunnel', 'term-vpn-server', 'fact-outer', 'fact-inner', 'fact-address', 'fact-get', 'fact-nat', 'fact-ports', 'lead-1'] },
        },
        {
          id: 'out-of-the-tunnel',
          title: 'Out of the Tunnel',
          sub: 'The VPN server sends it on',
          narrative:
            'At the VPN server, the tunnel ends. The server takes off the outer packet, decrypts your request and sends it on to example.net, just as it would have gone without a VPN: plain HTTP. The site sees it come from 203.0.113.41, the VPN’s address. From here, whoever runs the VPN server and anyone on the way can read it. The page comes back the same way, through the tunnel to you.',
          deep: [
            {
              text: 'Some VPNs send all your traffic through the tunnel, as here. Others send only work traffic, and the rest goes straight to the internet from the café: that’s a split tunnel.',
              cite: [NIST_REMOTE, PA_SPLIT],
            },
          ],
          facts: [
            { label: 'The VPN server', value: 'unwraps your request, so it can read it', backing: { traces: ['fact-server-reads', 'term-vpn-server'] } },
            { label: 'From there to the site', value: 'plain HTTP, as without a VPN', backing: { traces: ['fact-ends', 'fact-here', 'lead-2'] } },
            { label: 'The site sees you as', value: '203.0.113.41, the VPN’s address', backing: { traces: ['fact-address'] } },
            { label: 'The page', value: 'comes back through the tunnel', backing: { traces: ['fact-reply'] } },
          ],
          events: step4,
          backing: { traces: ['lead-2', 'term-vpn-server', 'fact-ends', 'fact-server-reads', 'fact-address', 'fact-reply', 'fact-here', 'fact-get', 'fact-https'] },
        },
        {
          id: 'https-matters',
          title: 'HTTPS Still Matters',
          sub: 'Sealed past the VPN server too',
          narrative:
            'Now you open https://example.net. HTTPS seals the request between your browser and the site, and the VPN wraps it again for the trip to the VPN server. When the server unwraps it, it can see which address you’re reaching but can’t read the page, and nor can anyone after it. The VPN protects the café’s stretch, as far as the VPN server. HTTPS protects the whole way to the site.',
          deep: [
            {
              text: 'Whoever runs the VPN server, your work or a VPN service you pay for, can see what the café could have seen without it. Using a VPN moves who can watch; HTTPS still matters.',
              cite: [ESP_RECEIVER, NIST_DECRYPTED, MS_VPN_PROFILE, PA_PERSONAL, TLS_ENDS],
            },
          ],
          facts: [
            { label: 'With HTTPS', value: 'only your browser and the site can read the page', backing: { traces: ['fact-https'] } },
            { label: 'The VPN server sees', value: 'which address you reach, not the page', backing: { traces: ['fact-server-reads', 'fact-https'] } },
            { label: 'The VPN protects', value: 'your laptop to the VPN server', backing: { traces: ['fact-ends', 'lead-2'] } },
            { label: 'HTTPS protects', value: 'your browser to the site', backing: { traces: ['fact-https'] } },
          ],
          events: step5,
          backing: { traces: ['fact-https', 'fact-server-reads', 'fact-ends', 'fact-whose', 'lead-2', 'fact-here', 'fact-reply', 'fact-address', 'term-vpn-server'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'A **VPN** gives your device a sealed **tunnel** to a VPN server. What you send through it is encrypted whole and put inside a new packet addressed to the server, so the network you’re on sees only that you’re talking to the VPN server.',
            cite: [CISCO_VPN, PA_TUNNEL, NIST_REMOTE, ESP_TUNNEL, IPSEC_TUNNEL, IKE_REMOTE, NIST_TUNNEL, PA_TUNNEL_MODE],
          },
          {
            id: 'lead-2',
            text: 'The tunnel ends at the VPN server. The server unwraps your packets and sends them on as they would have gone without a VPN, so from there on they’re as readable as before, unless HTTPS seals them.',
            cite: [ESP_RECEIVER, IKE_REMOTE, NIST_DECRYPTED, PA_DECRYPT, TLS_ENDS],
          },
          {
            id: 'lead-3',
            text: 'Think of putting your postcard in a sealed envelope addressed to a friend, who opens it and posts the postcard on. Until your friend, everyone sees only the envelope; after, it’s a postcard again. HTTPS is the locked box: it stays shut the whole way.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-vpn',
            idea: 'An encrypted connection over the internet, from your device to a VPN server and the network behind it',
            name: 'VPN (virtual private network)',
            cite: [CISCO_VPN, NIST_VPN, PA_TUNNEL],
          },
          {
            id: 'term-vpn-server',
            idea: 'The tunnel’s far end: it unwraps your packets and sends them on',
            name: 'VPN server (VPN gateway)',
            cite: [NIST_REMOTE, NIST_DECRYPTED, PA_DECRYPT, PA_BUSINESS, IKE_REMOTE, ESP_RECEIVER],
          },
          {
            id: 'term-tunnel',
            idea: 'Each packet sealed whole inside a new packet addressed to the tunnel’s far end',
            name: 'Tunnel',
            cite: [ESP_TUNNEL, IPSEC_TUNNEL, NIST_TUNNEL, PA_TUNNEL_MODE, CISCO_TUNNEL, PA_ENCAPSULATE],
          },
          {
            id: 'term-ipsec',
            idea: 'Standard protocols that protect IP packets, used to build VPNs',
            name: 'IPsec',
            cite: [IPSEC_BOUNDARY, IPSEC_ESP, NIST_VPN, NIST_EXEC],
          },
          {
            id: 'term-ike',
            idea: 'IPsec’s setup: the two ends agree on keys and prove who they are',
            name: 'IKE (Internet Key Exchange)',
            cite: [IKE_JOB, IKE_EXCHANGES, NIST_EXEC, PA_IKE],
          },
          {
            id: 'term-esp',
            idea: 'IPsec’s sealing: each packet encrypted, with a check that shows any change',
            name: 'ESP (Encapsulating Security Payload)',
            cite: [ESP_SERVICES, ESP_TUNNEL, IPSEC_ESP, NIST_EXEC],
          },
          {
            id: 'term-remote-access',
            idea: 'One device to a network, like your laptop to your work’s network',
            name: 'Remote access VPN',
            cite: [NIST_REMOTE, CISCO_REMOTE, MS_KINDS],
          },
          {
            id: 'term-site-to-site',
            idea: 'One network to another, like a branch office to its headquarters',
            name: 'Site-to-site VPN',
            cite: [NIST_GATEWAYS, CISCO_SITE, PA_SITE, MS_KINDS, G_VPN],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Agree on keys', 'Prove who you are', 'Wrap and seal', 'Unwrap at the VPN server', 'Send it on'],
          note: 'What an IPsec VPN does, in the order this lesson shows it. The sealing ends at the VPN server; HTTPS, if used, goes on to the site.',
          cite: [IKE_EXCHANGES, NIST_KEYS, NIST_EXEC, ESP_TUNNEL, NIST_TUNNEL, ESP_RECEIVER, PA_DECRYPT, IKE_REMOTE, NIST_DECRYPTED, TLS_ENDS],
        },
        why: [
          {
            id: 'why-1',
            text: 'On a network you don’t run, such as a café’s Wi-Fi, you can’t tell who is listening. A VPN keeps what you send through it sealed until it reaches the VPN server.',
            cite: [NIST_WIFI, PA_PUBLIC_WIFI, CISCO_WIFI_VPN, MS_COFFEE, CISCO_EAVESDROP, NIST_REMOTE, PA_TO_SERVER],
          },
          {
            id: 'why-2',
            text: 'A remote access VPN also lets you use your work’s network from outside, as if you were there.',
            cite: [CISCO_WORKS, PA_REMOTE, NIST_REMOTE],
          },
        ],
        deep: [
          {
            id: 'deep-protocols',
            text: 'IPsec is one way to build a VPN. Others use TLS, the protection behind HTTPS, often on port 443: OpenVPN and Microsoft’s SSTP are two. WireGuard is a newer one that runs over UDP.',
            cite: [NIST_TLS_VPN, MS_P2S, PA_SSL_VPN, HTTPS_443, PA_SSTP, MS_SSTP, NIST_SSTP, NIST_OPENVPN, PA_OPENVPN, NIST_WIREGUARD, PA_WIREGUARD, PA_WIREGUARD_UDP],
          },
          {
            id: 'deep-admin',
            text: 'A company can let staff reach its servers from outside only through its VPN, so logins aren’t open to the whole internet. Staff then sign in twice: once to the VPN, then to the server.',
            cite: [MS_VPN, MS_KINDS, NIST_SERVER_SECURITY, NIST_REMOTE],
          },
        ],
        facts: [
          {
            id: 'fact-wifi',
            label: 'On Wi-Fi you don’t run',
            value: 'you can’t tell who is listening; security guides advise a VPN',
            cite: [NIST_WIFI, PA_PUBLIC_WIFI, CISCO_WIFI_VPN, MS_COFFEE],
          },
          {
            id: 'fact-https',
            label: 'Plain HTTP',
            value: 'anyone on the way could read it; HTTPS lets only your browser and the site read it',
            cite: [EDGE_HTTP, CHROME_SYMBOLS, TLS_ENDS],
          },
          {
            id: 'fact-setup',
            label: 'Setting up (IKE)',
            value: 'IKE_SA_INIT: agree on keys someone listening can’t work out; then IKE_AUTH: each side proves who it is, already encrypted',
            cite: [IKE_EXCHANGES, NIST_KEYS, IKE_JOB],
          },
          {
            id: 'fact-address',
            label: 'Your address on the VPN’s side',
            value: 'the VPN server gives you one during IKE’s setup, in IKE_AUTH; your packets inside the tunnel carry it as their source, and sites see your requests come from it',
            cite: [IKE_REMOTE, IKE_ADDRESS, PA_NEW_ADDRESS, CISCO_WIFI_ADDRESS],
          },
          {
            id: 'fact-ports',
            label: 'IPsec’s ports',
            value: 'normally UDP 500 to start; UDP 4500 once a NAT is found in the way',
            cite: [IKE_PORT, IKE_NAT, NIST_UDP, PA_PORTS],
          },
          {
            id: 'fact-nat',
            label: 'Behind a NAT',
            value: 'IKE and ESP travel inside UDP, so the NAT can swap their address and port',
            cite: [IKE_NAT, ESP_UDP, IKE_REMOTE, NIST_UDP],
          },
          {
            id: 'fact-outer',
            label: 'Outside header',
            value: 'from your device to the VPN server; not sealed',
            cite: [IPSEC_TUNNEL, IKE_REMOTE, ESP_TUNNEL, NIST_TUNNEL],
          },
          {
            id: 'fact-inner',
            label: 'Inside, sealed',
            value: 'your whole original packet: where it’s going and what it says',
            cite: [ESP_TUNNEL, NIST_TUNNEL, PA_TUNNEL_MODE],
          },
          {
            id: 'fact-ends',
            label: 'The VPN protects',
            value: 'from your device to the VPN server, not beyond it',
            cite: [NIST_DECRYPTED, NIST_REMOTE, IKE_REMOTE, PA_TO_SERVER, PA_DECRYPT],
          },
          {
            id: 'fact-server-reads',
            label: 'Whoever runs the VPN server',
            value: 'can see what it unwraps: where you go, and what you send unless HTTPS seals it',
            cite: [ESP_RECEIVER, ESP_TUNNEL, NIST_DECRYPTED, TLS_ENDS],
          },
          {
            id: 'fact-reply',
            label: 'Replies',
            value: 'go to the VPN server, which sends them back through the tunnel',
            cite: [IKE_REMOTE, NIST_DECRYPTED, PA_RETURN],
          },
          {
            id: 'fact-whose',
            label: 'Your VPN server',
            value: 'your work’s, or a VPN service’s you pay for',
            cite: [MS_VPN_PROFILE, PA_PERSONAL, PA_BUSINESS],
          },
          {
            id: 'fact-here',
            label: 'The web requests here',
            value: 'HTTP to port 80; HTTPS to port 443',
            cite: [HTTP_80, HTTPS_443],
          },
          {
            id: 'fact-layers',
            label: 'Layer',
            value: 'depends on the VPN: IPsec works at the network layer; TLS-based VPNs higher up',
            cite: [NIST_EXEC, NIST_TLS_VPN, NIST_LINK, PA_LAYERS],
          },
          {
            id: 'fact-get',
            label: 'A web request',
            value: 'GET asks the site for a page; the path after it, here /, says which',
            cite: [HTTP_GET, HTTP_REQUEST_LINE, HTTP_TARGET],
          },
          {
            id: 'fact-name',
            label: 'Stands for',
            value: 'virtual private network',
            cite: [CISCO_VPN, NIST_VPN],
          },
        ],
      },
      practice: [
        {
          id: 'past-the-server',
          prompt: 'You’re on café Wi-Fi with your VPN on for all your traffic, and you open a plain http:// page. Where could someone read your request?',
          options: [
            {
              text: 'At the VPN server, and on the way from it to the site.',
              feedback: 'Right. The tunnel ends at the VPN server. From there the request goes on as plain HTTP, just as it would without a VPN.',
              cite: [NIST_DECRYPTED, IKE_REMOTE, ESP_RECEIVER, PA_DECRYPT],
            },
            {
              text: 'Nowhere: the VPN seals it all the way.',
              feedback: 'Not quite. The VPN seals it only as far as the VPN server. HTTPS would seal it all the way to the site.',
              cite: [NIST_DECRYPTED, PA_TO_SERVER, TLS_ENDS],
            },
            {
              text: 'On the café’s Wi-Fi.',
              feedback: 'Not quite. On the café’s Wi-Fi it’s inside the tunnel: someone listening sees only that you’re talking to the VPN server.',
              cite: [IPSEC_TUNNEL, IKE_REMOTE, NIST_TUNNEL],
            },
          ],
          answer: 0,
        },
        {
          id: 'what-the-cafe-sees',
          prompt: 'Your VPN is on for all your traffic. What can someone listening on the café’s Wi-Fi see?',
          options: [
            {
              text: 'That you’re talking to the VPN server, but not which sites you reach or what you send.',
              feedback: 'Right. The outside header names only your laptop and the VPN server; the rest is sealed inside.',
              cite: [IKE_REMOTE, ESP_TUNNEL, NIST_TUNNEL],
            },
            {
              text: 'Nothing at all.',
              feedback: 'Not quite. The outside header isn’t sealed, so they can see that you’re talking to the VPN server.',
              cite: [IPSEC_TUNNEL, NIST_TUNNEL],
            },
            {
              text: 'Everything, just as without a VPN.',
              feedback: 'Not quite. Inside the tunnel, where your packets go and what they say are encrypted.',
              cite: [ESP_TUNNEL, NIST_TUNNEL, PA_TUNNEL_MODE],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
