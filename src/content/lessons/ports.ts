import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, MessageEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * Ports, Networking Concepts lesson 10. One server, example.net, listens on TCP ports 22, 80 and 443. The laptop opens
 * a connection to each from a temporary port of its own and each is answered by the program listening there; a fourth
 * connection, to port 3389, finds nobody listening and is answered with a reset; then the server's owner turns on
 * Remote Desktop, the port opens and the same knock is answered.
 *
 * The scene is the approved design's (prototypes/d11-batch-1.md section 3.2, with the spec review's errata E4 and E5:
 * Ports' messages carry no `over`, and no step sets `status`, so the status line moves by the `status` cues alone).
 * The addresses (RFC 1918 and RFC 5737), the server's three listening programs and the laptop's temporary ports are
 * example data; the log's times and sizes are dashes because no source states one for this story. The laptop's side
 * of each message is written as the laptop sent it, as What is TCP does; Go deeper says the server sees the home
 * router's address. RFC 9293 defines TCP's ports, the handshake and the reset; RFC 768 UDP's port fields; RFC 6335 the
 * port number ranges. Vendor pages carry no defining marker. No standard places ports at an OSI layer, so the badge
 * rests on two vendors' pages. IANA's registry is cited only for its note and the ranges: its page is paginated, so
 * each port number rests on the RFC that names it and on Microsoft and Cloudflare for 3389.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 9293 defines TCP, so its citations are the defining standard. */
const tcp = (section: string) => rfc('rfc-9293', section, true);
/** RFC 6335 defines the port number ranges (section 6) and the registry's procedures. */
const ranges = (section: string) => rfc('rfc-6335', section, true);
/** RFC 9110 defines HTTP's default ports, and RFC 4253 SSH's. */
const http = (section: string) => rfc('rfc-9110', section, true);
const ssh = (section: string) => rfc('rfc-4253', section, true);

const RFC6335_ABSTRACT = cite('rfc-6335', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc6335.html#abstract', defining: true });

/** RFC 768's html has no section ids, so its Fields section is cited by a text fragment that starts in it. */
const RFC768_FIELDS = cite('rfc-768', 'Fields', {
  url: 'https://www.rfc-editor.org/rfc/rfc768.html#:~:text=Source%20Port%20is%20an%20optional%20field',
  defining: true,
});

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it starts on. */
const RFC1122_UDP_PORT = cite('rfc-1122', '4.1.3.1', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-77', defining: true });
/** RFC 792's html has only page ids. */
const ICMP_UNREACHABLE = cite('rfc-792', 'Destination Unreachable Message, page 4', { url: 'https://www.rfc-editor.org/rfc/rfc792.html#page-4', defining: true });

/** NIST SP 800-41 Rev. 1 has no section anchors, so section 2 is cited by the PDF page its passage is on. */
const NIST_PORTS = cite('nist-sp800-41r1', '2', { url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf#page=11' });

/** IANA's registry page lists the table 25 rows at a time; its note, above the table, states the ranges. */
const IANA_NOTE = cite('iana-ports', 'Note', { url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#service-names-port-numbers' });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const MS_NETSTAT = vendor('microsoft-netstat', 'Parameters', 'Displays all active TCP connections and the TCP and UDP ports');
const BSD_NETSTAT = vendor('openbsd-man-netstat', 'DESCRIPTION', 'With the default display, show only listening sockets');
const MS_RDP_PORT = vendor('microsoft-rdp-port', 'Change the Remote Desktop listening port on your computer', 'Remote Desktop allows remote connections to computers running Windows');
const MS_RDP_NEW_PORT = vendor('microsoft-rdp-port', 'Test the new Remote Desktop listening port', 'The next time you connect to this computer');
const MS_RDP_ENABLE = vendor('microsoft-rdp-enable', 'Enable Remote Desktop on your PC', 'Enabling Remote Desktop opens a port on your PC');
const MS_RDP_PREREQ = vendor('microsoft-rdp-enable', 'Prerequisites', 'Remote Desktop connections are allowed through the remote PC');
const CF_RDP_PORT = vendor('cloudflare-rdp-browser', '4. Create an Access application', 'enter the RDP listening port');
const MS_DYNAMIC = vendor('microsoft-dynamic-ports', 'The default dynamic port range for TCP/IP has changed since Windows Vista and in Windows Server 2008', 'Microsoft has increased the dynamic client port range for outgoing connections');
const MS_DYNAMIC_OLD = vendor('microsoft-dynamic-ports', 'The default dynamic port range for TCP/IP has changed since Windows Vista and in Windows Server 2008', 'This is a change from the configuration of earlier versions of Windows');
const MS_REFUSED = vendor('microsoft-winsock-errors', 'WSAECONNREFUSED', 'No connection could be made because the target computer actively refused it');
const PALO_RANGE = vendor('paloalto-port-scan', 'What is a Port Scan?', 'They are numbered from 0 to 65535');
const PALO_WELL_KNOWN = vendor('paloalto-port-scan', 'What is a Port Scan?', 'Ports 0 to 1023 are identified as the');
const PALO_OPEN = vendor('paloalto-port-scan', 'What is a Port Scan?', 'Running a port scan on a network or server reveals which ports are open and listening');
const PALO_HANDSHAKE = vendor('paloalto-port-scan', 'Types of Port Scans', 'This SYN, SYN-ACK, ACK exchange comprises a TCP handshake');
const PALO_RST = vendor('paloalto-port-scan', 'Types of Port Scans', 'For example, a closed port that receives an unsolicited FIN packet');
const PALO_CLOSED = vendor('paloalto-port-scan', 'Port Scanning Results', 'The target network/server has received the request, but no service is listening');
const PALO_FILTERED = vendor('paloalto-port-scan', 'Port Scanning Results', 'Typically, packets sent to filtered ports will not receive a response');
const CISCO_BLOCK = vendor('cisco-fmc-access-rules', 'Access control rule blocking actions', 'Block and Block with reset actions immediately stop traffic from entering the network');
const PALO_L4 = vendor('paloalto-layer-3-vs-7', 'What is the difference between Layer 7 and Layer 4 firewall?', 'whereas layer 4 firewalls filter traffic based on transport layer information');
const PALO_PORT_80 = vendor('paloalto-port-scan', 'What is a Port Scan?', 'Port 80 (TCP)');
const CF_HTTP_PORTS = cite('cloudflare-network-ports', 'Network ports compatible with Cloudflare’s proxy', { url: 'https://developers.cloudflare.com/fundamentals/reference/network-ports/#network-ports-compatible-with-cloudflares-proxy' });
const CF_SSH_22 = vendor('cloudflare-network-ports', 'How to enable Cloudflare’s proxy for additional ports', 'you have an SSH server that listens for incoming connections on port 22');
const PALO_BLOCK_OPEN = vendor('paloalto-port-scan', 'Port Scanning Results', 'blocking open ports with firewalls');
const MS_WF_PORTS = vendor('microsoft-windows-firewall', 'Firewall rules', 'For transport layer protocols, TCP and UDP, you can specify ports or port ranges');

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100';
const WEB = '203.0.113.80';

const traced = (...traces: string[]): Backing => ({ traces });

const listening: TableDef = {
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

/** The laptop's SYN: TCP's first message, from a temporary port to the server's port. */
const syn = (id: string, laptopPort: number, port: number, plain: string, extra: string[] = []): MessageEvent => ({
  type: 'message',
  id,
  from: 'laptop',
  to: 'server',
  tag: 'SYN',
  kind: 'request',
  log: { time: '—', source: `${LAPTOP}:${laptopPort}`, destination: `${WEB}:${port}`, protocol: 'TCP', info: `SYN to port ${port}`, size: '—' },
  plain,
  backing: traced('fact-handshake', 'fact-defined', 'term-temporary', 'fact-two-ports', 'fact-common', 'deep-nat', ...extra),
});

/** The server's answer from the listening program: SYN-ACK, from its port back to the port the SYN came from. */
const synAck = (id: string, laptopPort: number, port: number, plain: string, status: string): MessageEvent => ({
  type: 'message',
  id,
  from: 'server',
  to: 'laptop',
  tag: 'SYN-ACK',
  kind: 'response',
  log: { time: '—', source: `${WEB}:${port}`, destination: `${LAPTOP}:${laptopPort}`, protocol: 'TCP', info: `SYN-ACK from port ${port}`, size: '—' },
  plain,
  cues: [{ cue: 'status', arg: status }, { cue: 'status-done' }],
  backing: traced('fact-handshake', 'fact-defined', 'term-temporary', 'fact-two-ports', 'fact-common', 'deep-nat'),
});

const listens = (id: string, key: string, summary: string): TableEvent => ({
  type: 'table',
  id,
  table: 'listening-ports',
  op: 'match',
  key,
  summary,
  backing: traced('term-listen', 'fact-common', 'fact-see'),
});

const step1: SceneEvent[] = [
  syn('s1-syn', 50422, 80, 'Your laptop sends a SYN from temporary port 50422 to port 80 on example.net.'),
  listens('s1-match', 'TCP 80', 'The web server is listening on port 80.'),
  synAck('s1-synack', 50422, 80, 'The web server answers with a SYN-ACK, from port 80 back to port 50422.', 'Connected to port 80'),
];

const step2: SceneEvent[] = [
  syn('s2-syn', 50423, 443, 'Your laptop sends a SYN from a new temporary port, 50423, to port 443.', ['fact-temporary']),
  listens('s2-match', 'TCP 443', 'The web server is listening on port 443 too.'),
  synAck('s2-synack', 50423, 443, 'The web server answers with a SYN-ACK, from port 443 back to port 50423.', 'Connected to port 443'),
];

const step3: SceneEvent[] = [
  syn('s3-syn', 50431, 22, 'Your SSH app’s own temporary port, 50431, sends a SYN to port 22.'),
  listens('s3-match', 'TCP 22', 'The SSH server is listening on port 22.'),
  synAck('s3-synack', 50431, 22, 'The SSH server answers with a SYN-ACK, from port 22 back to port 50431.', 'SSH app: connected to port 22'),
];

const step4: SceneEvent[] = [
  syn('s4-syn', 50440, 3389, 'Your Remote Desktop app sends a SYN from temporary port 50440 to port 3389. It arrives.'),
  {
    type: 'table',
    id: 's4-nomatch',
    table: 'listening-ports',
    op: 'match',
    key: '',
    summary: 'Nothing is listening on 3389.',
    backing: traced('term-listen', 'term-closed', 'fact-closed'),
  },
  {
    type: 'message',
    id: 's4-rst',
    from: 'server',
    to: 'laptop',
    tag: 'RST',
    kind: 'control',
    log: { time: '—', source: `${WEB}:3389`, destination: `${LAPTOP}:50440`, protocol: 'TCP', info: 'RST: nothing listening on 3389', size: '—' },
    plain: 'Nothing is listening on port 3389, so the server answers with a reset (RST) instead of a SYN-ACK.',
    cues: [{ cue: 'status', arg: 'Refused: nothing listening on 3389' }],
    backing: traced('term-reset', 'term-closed', 'fact-closed', 'fact-two-ports', 'fact-common', 'fact-defined', 'term-temporary', 'deep-nat'),
  },
];

const step5: SceneEvent[] = [
  {
    type: 'table',
    id: 's5-add',
    table: 'listening-ports',
    op: 'add',
    row: { port: 'TCP 3389', program: 'Remote Desktop' } satisfies Row,
    summary: 'Remote Desktop is now listening on 3389.',
    backing: traced('term-open', 'term-listen', 'fact-common'),
  },
  syn('s5-syn', 50441, 3389, 'Your Remote Desktop app tries again, from a new temporary port, 50441, to port 3389.', ['fact-temporary']),
  listens('s5-match', 'TCP 3389', 'Remote Desktop is listening on port 3389.'),
  synAck('s5-synack', 50441, 3389, 'Remote Desktop answers with a SYN-ACK, from port 3389 back to port 50441.', 'Connected to port 3389'),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'ports',
  title: 'Ports',
  subtitle: 'Many programs, one address',
  level: 'beginner',
  certTags: [],
  summary:
    'One address can run many services. Each one listens on its own port, and the port number in a message says which one it is for. Watch your laptop try four ports on one server: three answer, and one has nobody listening until the server opens it.',
  figure: 'net-map',
  backing: { traces: ['why-1', 'term-port', 'term-listen', 'term-closed', 'term-open'] },
  units: [
    {
      id: 'ports',
      name: 'Ports',
      fullName: 'Ports',
      purpose: 'Telling which program a message is for',
      osi: { layers: [4], cite: [PALO_L4, MS_WF_PORTS] },
      backing: { traces: ['term-port', 'fact-defined'] },
      scene: {
        title: 'One address, many ports',
        views: ['network'],
        layers: ['ports:server'],
        labels: { laptop: 'Opening connections' },
        start: [{ cue: 'hide', arg: 'resolver' }],
        panel: { type: 'table', table: listening },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'Request' },
            { kind: 'response', label: 'Reply' },
            { kind: 'control', label: 'Reset' },
          ],
        },
        parties: [],
        backing: {
          traces: ['term-port', 'term-listen', 'term-connection', 'term-closed', 'term-open', 'fact-common', 'fact-see', 'fact-closed', 'fact-defined', 'pattern', 'fact-two-ports', 'term-reset', 'fact-handshake'],
        },
      },
      overview: {
        hook: 'One computer can run a web server, an SSH server and Remote Desktop at the same address. How does each message reach the right one? By its port number. Watch your laptop try four of one server’s ports: three answer, one refuses, until the server opens it.',
        hookBacking: { traces: ['why-1', 'term-port', 'fact-common', 'term-listen', 'term-closed', 'term-open'] },
        description:
          'A port number in a message says which program it is for. A server listens on its own ports, and a TCP connection request to a port with nothing listening is answered with a reset.',
        backing: { traces: ['lead-1', 'term-port', 'term-listen', 'fact-closed'] },
        facts: [
          { label: 'Port numbers', value: '0 to 65535', backing: { traces: ['fact-numbers'] } },
          { label: 'Common ports', value: '22 SSH, 80 HTTP, 443 HTTPS, 3389 Remote Desktop', backing: { traces: ['fact-common'] } },
          { label: 'Nothing listening (TCP)', value: 'the server answers with a reset (RST)', backing: { traces: ['fact-closed'] } },
          { label: 'OSI layer', value: '4, transport', backing: { traces: ['fact-osi'] } },
          { label: 'Defined in', value: 'RFC 9293 and RFC 768', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'port-80',
          title: 'Port 80: the web’s door',
          sub: 'The web server answers',
          narrative:
            'Your browser wants a page from example.net. Your laptop picks a **temporary port**, 50422, for its own side of the connection, and sends a SYN, the first message of a TCP connection, to 203.0.113.80, port 80. At the server, the destination port says which program the message is for. The web server is **listening** on port 80, so the SYN reaches it, and it answers SYN-ACK, from port 80 back to port 50422. Your laptop hands that answer to the browser.',
          deep: [
            {
              text: 'A port is not a plug on the back of a computer. It is only a number in the message.',
              cite: [tcp('3.1'), rfc('rfc-6335', '3')],
            },
          ],
          facts: [
            { label: 'Laptop’s port', value: '50422, a temporary port', backing: { traces: ['term-temporary', 'fact-temporary'] } },
            { label: 'Server’s port', value: '80, where the web server is listening', backing: { traces: ['fact-common', 'term-listen'] } },
            { label: 'The answer goes to', value: 'port 50422, the port the SYN came from', backing: { traces: ['fact-two-ports'] } },
          ],
          events: step1,
          backing: { traces: ['term-port', 'term-listen', 'term-temporary', 'fact-two-ports', 'fact-common', 'fact-handshake', 'deep-nat'] },
        },
        {
          id: 'port-443',
          title: 'Port 443: same server, another door',
          sub: 'A second connection',
          narrative:
            'You open the secure version of the site. Your browser starts a second **connection**, from a new temporary port, 50423, to port 443. A connection is known by both addresses and both ports, so the server can tell your two connections apart: their ports differ. The web server is listening on 443 too, so it answers with a SYN-ACK.',
          deep: [
            {
              text: 'One server port can carry many connections at once. Each is told apart by the other end’s address and port.',
              cite: [tcp('4'), rfc('rfc-6335', '3')],
            },
          ],
          facts: [
            { label: 'New connection', value: 'from port 50423 to port 443', backing: { traces: ['term-temporary', 'fact-common'] } },
            { label: 'Two connections', value: 'told apart by their ports: 50422 to 80, and 50423 to 443', backing: { traces: ['term-connection'] } },
            { label: 'Port 443', value: 'HTTPS, the secure web', backing: { traces: ['fact-common'] } },
          ],
          events: step2,
          backing: { traces: ['term-connection', 'term-temporary', 'fact-temporary', 'term-listen', 'fact-common', 'fact-handshake'] },
        },
        {
          id: 'port-22',
          title: 'Port 22: a different program',
          sub: 'The SSH server answers',
          narrative:
            'Now you open an SSH app. It gets its own temporary port, 50431, and sends a SYN to port 22. A different program is listening there, the SSH server, so the SYN goes to it and not to the web server. The SYN-ACK comes back to port 50431, so your laptop hands it to the SSH app, not to the browser.',
          deep: [
            {
              text: 'SSH’s port, 22, is registered with IANA and officially assigned for SSH.',
              cite: [ssh('4.1')],
            },
          ],
          facts: [
            { label: 'Laptop’s port', value: '50431, the SSH app’s own temporary port', backing: { traces: ['term-temporary', 'fact-common'] } },
            { label: 'Server’s port', value: '22, where the SSH server is listening', backing: { traces: ['fact-common', 'term-listen'] } },
            { label: 'Not the web server', value: 'each program listens on its own port', backing: { traces: ['why-1'] } },
          ],
          events: step3,
          backing: { traces: ['term-port', 'term-listen', 'term-temporary', 'fact-two-ports', 'fact-common', 'fact-handshake', 'why-1'] },
        },
        {
          id: 'port-3389',
          title: 'Port 3389: nobody home',
          sub: 'Nothing is listening',
          narrative:
            'Now you try Remote Desktop, whose port is 3389. Your laptop sends a SYN to port 3389, from temporary port 50440. The SYN arrives, but nothing is listening on 3389: the table has no row for it, so it is a **closed port**. The server answers with a **reset**, RST, instead of a SYN-ACK. Your Remote Desktop app reports that the connection was refused.',
          deep: [
            {
              text: 'TCP’s standard says a reset is sent whenever a segment arrives that apparently is not intended for the current connection. A SYN that does not match an existing connection is rejected this way.',
              cite: [tcp('3.5.2')],
            },
          ],
          facts: [
            { label: 'Server’s port', value: '3389, Remote Desktop’s port', backing: { traces: ['fact-common'] } },
            { label: 'Listening on 3389', value: 'nothing', backing: { traces: ['term-closed', 'term-listen'] } },
            { label: 'The answer', value: 'RST, a reset', backing: { traces: ['term-reset', 'fact-closed'] } },
            { label: 'Your app reports', value: 'connection refused', backing: { traces: ['fact-closed'] } },
          ],
          events: step4,
          backing: { traces: ['term-closed', 'term-reset', 'term-listen', 'term-temporary', 'fact-closed', 'fact-common', 'fact-handshake', 'fact-see'] },
        },
        {
          id: 'open-port',
          title: 'Open the port',
          sub: 'Remote Desktop starts listening',
          narrative:
            'The server’s owner turns on Remote Desktop. It starts listening on port 3389, so the port is now **open**. You try again, from a new temporary port, 50441. This time the SYN finds a program listening, and Remote Desktop answers with a SYN-ACK.',
          deep: [
            {
              text: 'A port number is an agreement, not a rule. Remote Desktop can be moved off 3389, and then clients must name the new port when they connect.',
              cite: [MS_RDP_NEW_PORT, rfc('rfc-6335', '3'), rfc('rfc-6335', '9')],
            },
          ],
          facts: [
            { label: 'Remote Desktop', value: 'now listening on port 3389', backing: { traces: ['term-open', 'term-listen'] } },
            { label: 'Port 3389', value: 'open', backing: { traces: ['term-open'] } },
            { label: 'The answer', value: 'SYN-ACK, not RST', backing: { traces: ['fact-handshake', 'fact-closed'] } },
          ],
          events: step5,
          backing: { traces: ['term-open', 'term-listen', 'term-temporary', 'fact-temporary', 'fact-common', 'fact-handshake'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'An IP address gets a message to the right computer. A port number says which program on that computer the message is for.',
            cite: [tcp('2.2'), NIST_PORTS, rfc('rfc-791', '1.1', true)],
          },
          {
            id: 'lead-2',
            text: 'Think of the address as a building and each port as a door number. The building is the same, and each door leads to a different office. Knock on a door with nobody behind it and you hear “nobody here”.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-port',
            idea: 'The number that says which program or service on a computer a message is for',
            name: 'Port',
            cite: [tcp('2.2'), rfc('rfc-6335', '3'), NIST_PORTS, IANA_NOTE],
          },
          {
            id: 'term-listen',
            idea: 'A program waiting for connections on its port',
            name: 'Listening',
            cite: [tcp('3.3.2'), NIST_PORTS, cite('microsoft-netstat', 'netstat', { url: `${SOURCES['microsoft-netstat']!.url}#:~:text=Displays%20active%20TCP%20connections` })],
          },
          {
            id: 'term-well-known',
            idea: 'The standard ports, 0 to 1023, that IANA assigns to common services',
            name: 'Well-known ports',
            cite: [ranges('6'), IANA_NOTE, PALO_WELL_KNOWN],
          },
          {
            id: 'term-temporary',
            idea: 'The port your device picks for its own side of a connection, so answers can come back to it',
            name: 'Temporary (ephemeral) port',
            cite: [rfc('rfc-6056', '1'), rfc('rfc-6335', '8.1.2'), MS_DYNAMIC, NIST_PORTS],
          },
          {
            id: 'term-connection',
            idea: 'One conversation, known by both addresses and both ports',
            name: 'Connection',
            cite: [tcp('4'), rfc('rfc-6335', '3'), NIST_PORTS],
          },
          {
            id: 'term-open',
            idea: 'A port with a program listening on it',
            name: 'Open port',
            cite: [rfc('rfc-9293', '3.9.1.1'), MS_RDP_ENABLE, PALO_OPEN],
          },
          {
            id: 'term-closed',
            idea: 'A port with nothing listening on it: a connection to it is refused',
            name: 'Closed port',
            cite: [rfc('rfc-9293', '3.5.2'), PALO_CLOSED, MS_REFUSED],
          },
          {
            id: 'term-reset',
            idea: 'The TCP message a closed port sends back',
            name: 'Reset (RST)',
            cite: [tcp('3.5.2'), tcp('3.10.7.1'), PALO_RST],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Read the destination port', 'Find who is listening', 'Hand it over: SYN-ACK', 'Nobody? Send RST'],
          note: 'What a server’s TCP does with each new connection request, in outline.',
          cite: [tcp('3.3.2'), tcp('3.10.7.1'), tcp('3.10.7.2'), NIST_PORTS],
        },
        why: [
          {
            id: 'why-1',
            text: 'One computer can run many services at the same address. Each listens on its own port, and the port number in a message says which one it is for.',
            cite: [rfc('rfc-6335', '3'), tcp('2.2'), NIST_PORTS, IANA_NOTE],
          },
          {
            id: 'why-2',
            text: 'Services usually sit on fixed, well-known ports, so a client knows where to knock. The client’s side usually needs no fixed number: its system picks a free temporary port, and the answer comes back to it.',
            cite: [rfc('rfc-6056', '1'), rfc('rfc-6335', '8.1.2'), NIST_PORTS, MS_DYNAMIC],
          },
        ],
        deep: [
          {
            id: 'deep-firewall',
            text: 'A firewall can block a port even while a program listens on it. Then there is often no answer at all, not a reset.',
            cite: [MS_RDP_PREREQ, PALO_FILTERED, CISCO_BLOCK, PALO_BLOCK_OPEN],
          },
          {
            id: 'deep-udp',
            text: 'UDP has ports too. A message to a UDP port that nobody listens on may get an ICMP “port unreachable” message back.',
            cite: [RFC1122_UDP_PORT, ICMP_UNREACHABLE],
          },
          {
            id: 'deep-nat',
            text: 'On the way out, your home router swaps your laptop’s address, and often its port, for its own, so the server sees the router’s address. The NAT lesson shows how.',
            cite: [rfc('rfc-3022', '2.2'), rfc('rfc-4787', '3')],
          },
        ],
        facts: [
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 9293 (TCP) and RFC 768 (UDP); IANA keeps the list of port numbers (RFC 6335)',
            cite: [tcp('2.2'), RFC768_FIELDS, RFC6335_ABSTRACT, IANA_NOTE],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '4, transport', cite: [PALO_L4, MS_WF_PORTS] },
          { id: 'fact-numbers', label: 'Port numbers', value: '0 to 65535', cite: [tcp('3.1'), rfc('rfc-6335', '3'), PALO_RANGE] },
          {
            id: 'fact-two-ports',
            label: 'Every TCP or UDP message',
            value: 'carries two port numbers: a destination port, which says which service it is for, and a source port, which says where answers should go',
            cite: [tcp('3.1'), RFC768_FIELDS, NIST_PORTS],
          },
          {
            id: 'fact-common',
            label: 'Common ports',
            value: '22 SSH, 80 HTTP (the web), 443 HTTPS (the secure web), 3389 Remote Desktop',
            cite: [ssh('4.1'), http('4.2.1'), http('4.2.2'), MS_RDP_PORT, CF_RDP_PORT, PALO_PORT_80, CF_HTTP_PORTS, CF_SSH_22],
          },
          {
            id: 'fact-ranges',
            label: 'Number ranges',
            value: '0-1023 well-known, 1024-49151 registered, 49152-65535 dynamic (never assigned)',
            cite: [ranges('6'), IANA_NOTE, PALO_WELL_KNOWN],
          },
          {
            id: 'fact-temporary',
            label: 'Temporary ports',
            value: 'picked by your device for each new connection, often from 49152-65535; some systems use other ranges',
            cite: [rfc('rfc-6056', '1'), rfc('rfc-6056', '2.1'), rfc('rfc-6056', '3.2'), MS_DYNAMIC, MS_DYNAMIC_OLD],
          },
          {
            id: 'fact-handshake',
            label: 'Opening a TCP connection',
            value: 'SYN, SYN-ACK, ACK',
            cite: [tcp('3.5'), PALO_HANDSHAKE],
          },
          {
            id: 'fact-closed',
            label: 'Nothing listening (TCP)',
            value: 'the server answers with a reset (RST), and your app reports the connection refused',
            cite: [tcp('3.5.2'), tcp('3.10.7.1'), MS_REFUSED, cite('openbsd-man-connect', 'ERRORS', { url: 'https://man.openbsd.org/connect#ECONNREFUSED' })],
          },
          {
            id: 'fact-see',
            label: 'See your own',
            value: 'the netstat command can list the ports your computer is listening on',
            cite: [MS_NETSTAT, BSD_NETSTAT],
          },
        ],
      },
      practice: [
        {
          id: 'closed-port',
          prompt: 'Your Remote Desktop app sends a SYN to 203.0.113.80, port 3389, but nothing on the server is listening there. What comes back?',
          options: [
            {
              text: 'A reset (RST): the connection is refused.',
              feedback: 'Right. With nothing listening, the server’s TCP answers with a reset, and your app reports the connection refused.',
              cite: [tcp('3.5.2'), MS_REFUSED],
            },
            {
              text: 'Nothing at all.',
              feedback: 'Not quite. A closed port answers with a reset. Silence is what you often get when a firewall blocks the port.',
              cite: [tcp('3.5.2'), PALO_FILTERED],
            },
            {
              text: 'The web server on port 80 answers instead.',
              feedback: 'Not quite. The port says which program a message is for, and a message for 3389 is not for the program on port 80.',
              cite: [tcp('2.2'), NIST_PORTS, http('4.2.1')],
            },
          ],
          answer: 0,
        },
        {
          id: 'reply-port',
          prompt: 'Your browser connects from port 50423 to example.net’s port 443. Which port does the server’s answer go to?',
          options: [
            {
              text: '50423, the port it came from.',
              feedback: 'Yes. The answer goes from the server’s port, 443, back to your temporary port, so your laptop knows it is for the browser.',
              cite: [tcp('4'), NIST_PORTS],
            },
            {
              text: '443.',
              feedback: 'Not quite. 443 is the server’s own port. The answer goes to the other end of the connection: your port, 50423.',
              cite: [tcp('4'), NIST_PORTS],
            },
            {
              text: '80, the web’s usual port.',
              feedback: 'Not quite. This connection is to 443, and the answer goes back to the port it came from, 50423.',
              cite: [tcp('4'), NIST_PORTS, http('4.2.1')],
            },
          ],
          answer: 0,
        },
        {
          id: 'which-port',
          prompt: 'A web server is waiting for HTTPS visitors. Which port is it listening on, by default?',
          options: [
            {
              text: '443',
              feedback: 'Right. 443 is the standard port for HTTPS.',
              cite: [http('4.2.2')],
            },
            {
              text: '80',
              feedback: 'Not quite. 80 is for plain HTTP; HTTPS uses 443.',
              cite: [http('4.2.1'), http('4.2.2')],
            },
            {
              text: '22',
              feedback: 'Not quite. 22 is SSH’s port.',
              cite: [ssh('4.1')],
            },
            {
              text: '3389',
              feedback: 'Not quite. 3389 is Remote Desktop’s port.',
              cite: [MS_RDP_PORT, CF_RDP_PORT],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
