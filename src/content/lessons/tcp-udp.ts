import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite } from '../sources';

/**
 * TCP/UDP, Networking Concepts lesson 11. Your browser fetches a page from example.net over TCP: a handshake first,
 * then three pieces; piece 2 is lost, piece 3 waits, the ACK says what is missing, piece 2 is sent again and the page is
 * whole (RFC 9293 sections 3.4, 3.5, 3.8). Then you are in a call with Sam over UDP: no handshake, packets straight away;
 * Sam's packet 2 is lost, nobody sends it again, packet 3 goes straight to the call app and the call goes on (RFC 768,
 * RFC 8085 section 3.3). Both losses land at the laptop, so one table, "What your laptop got", shows both lanes.
 *
 * The scene is the approved design's (prototypes/d12-batch-2.md sections 3.3, 2.2 variant A, 2.7 and 7): the web server
 * and the voice server stand on the map together for the whole unit, and the steps run TCP first, then UDP, in turn.
 * The addresses (RFC 1918 and RFC 5737), the laptop's ports 50422 and 50900, the call server's port 16384 and Sam are
 * example data; the log's times and sizes are dashes because no source states one for this story, and a made-up time
 * would read as a speed comparison. RFC 9293 defines TCP and RFC 768 UDP; RFC 1122, RFC 8085, RFC 7413 and the vendor
 * and NIST pages carry no defining marker. No standard places TCP or UDP at an OSI layer, so the badge rests on two
 * vendors' pages, as What is TCP's and What is UDP's do.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 9293 defines TCP, so its citations are the defining standard. */
const tcp = (section: string) => rfc('rfc-9293', section, true);
const RFC9293_ABSTRACT = cite('rfc-9293', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc9293.html#abstract', defining: true });

const RFC768 = 'https://www.rfc-editor.org/rfc/rfc768.html';
/** RFC 768's html has no section ids, so each section is cited by a text fragment that starts in it. It defines UDP. */
const rfc768 = (section: string, fragment: string) => cite('rfc-768', section, { url: `${RFC768}#:~:text=${fragment}`, defining: true });
const RFC768_INTRO = rfc768('Introduction', 'transaction%20oriented,%20and%20delivery');
const RFC768_DEFINED = rfc768('Introduction', 'This%20User%20Datagram');
const RFC768_FIELDS = rfc768('Fields', 'Source%20Port%20is%20an%20optional%20field');
const RFC768_LENGTH = rfc768('Fields', 'minimum%20value%20of%20the%20length');

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it is on: 1.1.3 on page 9, 4.1.1 on page 77. */
const RFC1122_SUITE = cite('rfc-1122', '1.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-9' });
const RFC1122_UDP = cite('rfc-1122', '4.1.1', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-77' });

/** NIST's PDFs have no section anchors, so a section is cited by the PDF page its passage is on. */
const NIST_TRANSPORT = cite('nist-sp800-41r1', '2', { url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf#page=11' });
const NIST_TCP_UDP = cite('nist-sp800-41r1', '4.1.3', { url: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf#page=31' });
const NIST_2_1 = cite('nist-sp800-77r1', '2.1', { url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf#page=20' });

/** Vendor pages: the section ids are on the pages. None is the defining standard. */
const MS_SOCKET_PARAMS = cite('microsoft-winsock-socket', 'Parameters', { url: 'https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-socket#parameters' });
const MS_SOCKET_REMARKS = cite('microsoft-winsock-socket', 'Remarks', { url: 'https://learn.microsoft.com/en-us/windows/win32/api/winsock2/nf-winsock2-socket#remarks' });
const MS_TIMEDOUT = cite('microsoft-winsock-errors', 'WSAETIMEDOUT', { url: 'https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-error-codes-2#WSAETIMEDOUT' });
const BSD_SOCKET = cite('openbsd-man-socket', 'DESCRIPTION', { url: 'https://man.openbsd.org/socket#DESCRIPTION' });
const MS_TEAMS = cite('microsoft-teams-network', 'Network optimization', { url: 'https://learn.microsoft.com/en-us/microsoftteams/prepare-network#network-optimization' });

const CLOUDFLARE = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const MS_LB = 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview';
/** Azure's page says each half in its own place: "Layer 4 TCP or UDP traffic" in the introduction, "layer 4 of the OSI model" in the section. */
const AZURE_TCP_UDP = cite('microsoft-azure-lb', 'Introduction', { url: `${MS_LB}#:~:text=distribute%20Layer%204%20TCP%20or%20UDP%20traffic` });
const AZURE_L4 = cite('microsoft-azure-lb', 'How Azure Load Balancer distributes Layer 4 traffic', {
  url: `${MS_LB}#:~:text=Azure%20Load%20Balancer%20operates%20at%20layer%204`,
});
const OSI_L4 = [cite('cloudflare-network-layers', 'Network Layers', { url: `${CLOUDFLARE}#:~:text=4%20Transport%20layer` }), AZURE_TCP_UDP, AZURE_L4];

const G114 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-G.114-200305-I!!PDF-E&type=items';
/** G.114's Annex A.3, "Delay due to IP delay variation buffer", is on PDF page 13. */
const G114_A3 = cite('itu-g114', 'Annex A.3', { url: `${G114}#page=13` });
/** Late data is useless in a live call: G.114 (discarded as lost), RFC 8836 (commonly useless), RFC 8834 (a resend must arrive in time). */
const LATE = [G114_A3, rfc('rfc-8836', '1'), rfc('rfc-8834', '6.1')];

/** HTTP/3 is the exception to "pages ride on TCP", as What is TCP and What is HTTP teach. */
const HTTP3 = [rfc('rfc-9114', '1', true), rfc('rfc-9000', '1')];

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100';
const WEB = '203.0.113.80';
const VOICE = '203.0.113.90';
const DASH = '—';

const arrived: TableDef = {
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

const traced = (...traces: string[]): Backing => ({ traces });
const status = (text: string, ...flags: ('status-known' | 'status-done')[]): Cue[] => [{ cue: 'status', arg: text }, ...flags.map((cue) => ({ cue }))];

interface Piece {
  id: string;
  over: 'TCP' | 'UDP';
  from: string;
  to: string;
  tag: string;
  kind: MessageEvent['kind'];
  info: string;
  plain: string;
  dropAt?: number;
  cues?: Cue[];
  backing: Backing;
}
/** One message of the story. The laptop's side is written as the laptop sent it. No source states a size, and no clock time belongs to it, so those cells are dashes. */
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
    plain: p.plain,
    ...(p.cues === undefined ? {} : { cues: p.cues }),
    backing: p.backing,
  };
};

const got = (id: string, op: 'add' | 'update', key: string, cells: Row, summary: string, backing: Backing): TableEvent =>
  op === 'add' ? { type: 'table', id, table: 'arrived', op, row: cells, summary, backing } : { type: 'table', id, table: 'arrived', op, key, row: cells, summary, backing };

const step1: SceneEvent[] = [
  piece({
    id: 's1-syn',
    over: 'TCP',
    from: 'laptop',
    to: 'web',
    tag: 'SYN',
    kind: 'request',
    info: 'SYN: hello',
    plain: 'Hello. Let’s set up a connection.',
    cues: status('Saying hello'),
    backing: traced('term-handshake', 'term-connection', 'fact-setup', 'fact-used', 'fact-ports'),
  }),
  piece({
    id: 's1-synack',
    over: 'TCP',
    from: 'web',
    to: 'laptop',
    tag: 'SYN-ACK',
    kind: 'response',
    info: 'SYN-ACK: hello back',
    plain: 'Hello back. I got your hello.',
    backing: traced('term-handshake', 'term-connection', 'fact-setup', 'fact-used', 'fact-ports'),
  }),
  piece({
    id: 's1-ack',
    over: 'TCP',
    from: 'laptop',
    to: 'web',
    tag: 'ACK',
    kind: 'request',
    info: 'ACK: connection open',
    plain: 'OK. The connection is open.',
    cues: [{ cue: 'conn', arg: 'open laptop>web' }, ...status('Connected', 'status-known')],
    backing: traced('term-handshake', 'term-connection', 'fact-setup', 'fact-used', 'fact-ports'),
  }),
];

const step2: SceneEvent[] = [
  piece({
    id: 's2-req',
    over: 'TCP',
    from: 'laptop',
    to: 'web',
    tag: 'REQUEST',
    kind: 'request',
    info: 'Request for the page',
    plain: 'Your laptop asks for the page.',
    backing: traced('fact-used', 'fact-ports', 'term-connection'),
  }),
  piece({
    id: 's2-p1',
    over: 'TCP',
    from: 'web',
    to: 'laptop',
    tag: 'PIECE 1',
    kind: 'response',
    info: 'Piece 1 of the page',
    plain: 'The server sends the page in pieces. Piece 1 arrives.',
    backing: traced('fact-used', 'fact-ports', 'deep-messages'),
  }),
  got('s2-g1', 'add', '1', { piece: '1', page: 'Arrived', sam: DASH }, 'Piece 1 of the page arrived.', traced('fact-tcp-gives', 'deep-messages')),
  piece({
    id: 's2-p2',
    over: 'TCP',
    from: 'web',
    to: 'laptop',
    tag: 'PIECE 2',
    kind: 'response',
    info: 'Piece 2 (lost)',
    plain: 'Piece 2 is lost on the way, perhaps dropped by a busy router.',
    dropAt: 0.55,
    backing: traced('fact-loss', 'fact-used', 'fact-ports'),
  }),
  piece({
    id: 's2-p3',
    over: 'TCP',
    from: 'web',
    to: 'laptop',
    tag: 'PIECE 3',
    kind: 'response',
    info: 'Piece 3: there’s a gap before it',
    plain: 'Piece 3 arrives, but piece 2 is missing before it.',
    cues: status('Piece 2 is missing'),
    backing: traced('fact-hold', 'fact-loss', 'fact-used', 'fact-ports'),
  }),
  got('s2-g2', 'add', '2', { piece: '2', page: 'Missing', sam: DASH }, 'Piece 2 of the page is missing.', traced('fact-loss', 'fact-hold')),
  got('s2-g3', 'add', '3', { piece: '3', page: 'Arrived, waiting', sam: DASH }, 'Piece 3 of the page arrived, and is waiting for piece 2.', traced('fact-hold')),
  piece({
    id: 's2-ack',
    over: 'TCP',
    from: 'laptop',
    to: 'web',
    tag: 'ACK',
    kind: 'request',
    info: 'ACK: got everything up to the end of piece 1',
    plain: 'The laptop’s ACK says “got everything up to the end of piece 1”: piece 2 is missing.',
    backing: traced('term-ack', 'fact-resend', 'fact-used', 'fact-ports'),
  }),
];

const step3: SceneEvent[] = [
  piece({
    id: 's3-p2',
    over: 'TCP',
    from: 'web',
    to: 'laptop',
    tag: 'PIECE 2',
    kind: 'response',
    info: 'Piece 2, sent again',
    plain: 'The server sends piece 2 again. This time it arrives.',
    backing: traced('term-retransmission', 'fact-resend', 'fact-used', 'fact-ports'),
  }),
  got('s3-g2', 'update', '2', { page: 'Arrived, sent again' }, 'Piece 2 of the page arrived, sent again.', traced('term-retransmission', 'fact-resend')),
  got('s3-g3', 'update', '3', { page: 'Arrived' }, 'Piece 3 of the page is no longer waiting: it goes to the browser after piece 2.', traced('fact-hold', 'fact-tcp-gives')),
  piece({
    id: 's3-ack',
    over: 'TCP',
    from: 'laptop',
    to: 'web',
    tag: 'ACK',
    kind: 'request',
    info: 'ACK: got everything up to the end of piece 3',
    plain: 'All three pieces are here, in order. The laptop says “got everything”.',
    cues: [...status('Page complete', 'status-done'), { cue: 'page', arg: 'text' }],
    backing: traced('term-ack', 'fact-tcp-gives', 'fact-hold', 'fact-used', 'fact-ports'),
  }),
];

const step4: SceneEvent[] = [
  piece({
    id: 's4-v1',
    over: 'UDP',
    from: 'laptop',
    to: 'voice',
    tag: 'VOICE 1',
    kind: 'request',
    info: 'Your voice, packet 1: no handshake first',
    plain: 'Your voice goes out as soon as you speak. There is no handshake first.',
    cues: [{ cue: 'url', arg: 'Call' }, ...status('In a call with Sam', 'status-known')],
    backing: traced('fact-used', 'term-connectionless', 'term-datagram', 'fact-setup', 'fact-ports'),
  }),
  piece({
    id: 's4-s1',
    over: 'UDP',
    from: 'voice',
    to: 'laptop',
    tag: 'SAM 1',
    kind: 'response',
    info: 'Sam’s voice, packet 1',
    plain: 'Sam’s voice comes back the same way, one datagram at a time.',
    backing: traced('fact-used', 'term-datagram', 'fact-ports'),
  }),
  got('s4-g1', 'update', '1', { sam: 'Arrived' }, 'Sam’s voice, packet 1, arrived.', traced('fact-used', 'term-datagram')),
];

const step5: SceneEvent[] = [
  piece({
    id: 's5-s2',
    over: 'UDP',
    from: 'voice',
    to: 'laptop',
    tag: 'SAM 2',
    kind: 'response',
    info: 'Sam’s voice, packet 2 (lost)',
    plain: 'Sam’s packet 2 is lost on the way, perhaps dropped by a busy router.',
    dropAt: 0.5,
    backing: traced('fact-loss', 'fact-lost', 'fact-used', 'fact-ports'),
  }),
  got('s5-g2', 'update', '2', { sam: 'Lost' }, 'Sam’s voice, packet 2, was lost.', traced('fact-loss', 'fact-lost')),
  piece({
    id: 's5-s3',
    over: 'UDP',
    from: 'voice',
    to: 'laptop',
    tag: 'SAM 3',
    kind: 'response',
    info: 'Sam’s voice, packet 3',
    plain: 'Packet 3 goes straight to the call app, with no waiting.',
    cues: status('Talking, one packet lost'),
    backing: traced('fact-lost', 'why-2', 'fact-used', 'fact-ports'),
  }),
  got('s5-g3', 'update', '3', { sam: 'Arrived, straight to the app' }, 'Sam’s voice, packet 3, arrived and went straight to the call app.', traced('fact-lost', 'why-2')),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'tcp-udp',
  title: 'TCP/UDP',
  subtitle: 'Every byte in order, or just send',
  level: 'beginner',
  certTags: [],
  summary:
    'TCP sets up a connection, checks that every piece arrived and sends again whatever didn’t. UDP just sends: no setup, no resending. Watch one piece go missing in each: TCP fills the gap, UDP carries on without it.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'fact-lost', 'fact-used'] },
  units: [
    {
      id: 'tcp-udp',
      name: 'TCP/UDP',
      fullName: 'Transmission Control Protocol and User Datagram Protocol',
      purpose: 'Two ways to carry an app’s data',
      osi: { layers: [4], cite: OSI_L4 },
      backing: { traces: ['fact-stands-for', 'lead-1', 'fact-two'] },
      scene: {
        title: 'A page, then a call',
        views: ['network', 'sequence'],
        layers: ['tcp:web', 'tcp-udp:voice'],
        labels: { laptop: 'Wants a page, then a call', url: 'example.net' },
        start: [{ cue: 'hide', arg: 'resolver' }],
        panel: { type: 'table', table: arrived },
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
        backing: { traces: ['lead-1', 'fact-used', 'fact-ports', 'fact-loss', 'fact-lost', 'term-handshake'] },
      },
      overview: {
        hook: 'An app’s data usually travels over TCP or UDP. TCP sets up a connection, checks that every piece arrived and sends again whatever didn’t. UDP just sends: no setup, no resending. Watch one piece go missing in each. TCP fills the gap and the page arrives whole; UDP carries on without it, and the call goes on.',
        hookBacking: { traces: ['lead-1', 'fact-two', 'term-ack', 'fact-lost', 'fact-used'] },
        description:
          'TCP is like sending a long letter as numbered postcards and asking “got them all?”; anything missing is sent again. UDP is like a walkie-talkie: you just speak, and a crackled word is gone.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'TCP: web pages (except HTTP/3), email, files. UDP: typically calls and DNS lookups', backing: { traces: ['fact-used'] } },
          { label: 'Before any data', value: 'TCP: a handshake. UDP: nothing', backing: { traces: ['fact-setup'] } },
          { label: 'A lost piece', value: 'TCP sends it again; UDP doesn’t', backing: { traces: ['fact-lost'] } },
          { label: 'OSI layer', value: '4, transport', backing: { traces: ['fact-osi'] } },
          { label: 'Defined in', value: 'RFC 9293 (TCP) and RFC 768 (UDP)', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'handshake',
          title: 'TCP: Three-Way Handshake',
          sub: 'Hello, hello back, OK',
          narrative:
            'Your browser wants a page from example.net, and web pages usually travel over **TCP**. Before any data moves, TCP sets up a **connection** with a **three-way handshake**. The laptop says hello (SYN), the server says hello back (SYN-ACK), and the laptop says OK (ACK). Now the connection is open. That cost one round trip before the page could even be asked for.',
          deep: [
            {
              text: 'SYN means synchronize: each side tells the other the number its bytes start from, and the other acknowledges it.',
              cite: [tcp('3.5'), tcp('3.4.1')],
            },
          ],
          facts: [
            { label: 'Messages', value: 'SYN, SYN-ACK, ACK', backing: { traces: ['term-handshake', 'fact-setup'] } },
            { label: 'Costs', value: 'one round trip before any data', backing: { traces: ['fact-setup'] } },
            { label: 'To', value: '203.0.113.80, port 80', backing: { traces: ['fact-ports'] } },
            { label: 'From', value: '192.168.1.100, port 50422', backing: { example: true } },
          ],
          events: step1,
          backing: { traces: ['term-handshake', 'term-connection', 'fact-setup', 'fact-ports', 'fact-used', 'lead-1'] },
        },
        {
          id: 'tcp-loss',
          title: 'TCP: Packet Loss',
          sub: 'One piece goes missing',
          narrative:
            'The laptop asks for the page, and the server sends it in pieces. Piece 1 arrives. Piece 2 is lost on the way, perhaps dropped by a busy router. Piece 3 arrives, but TCP hands bytes to the browser in order, so piece 3 has to wait. The laptop’s **acknowledgement** (ACK) still says “got everything up to the end of piece 1”: piece 2 is missing.',
          deep: [
            {
              text: 'An ACK names the next byte the laptop expects. While piece 2 is missing, every ACK names the same byte, which tells the server a piece is missing.',
              cite: [tcp('3.4'), rfc('rfc-5681', '3.2', true)],
            },
          ],
          facts: [
            { label: 'Piece 2', value: 'lost on the way', backing: { traces: ['fact-loss'] } },
            { label: 'Piece 3', value: 'arrived, waiting for piece 2', backing: { traces: ['fact-hold'] } },
            { label: 'The ACK says', value: 'got everything up to the end of piece 1', backing: { traces: ['term-ack'] } },
          ],
          events: step2,
          backing: { traces: ['term-ack', 'fact-loss', 'fact-hold', 'fact-resend', 'fact-used', 'fact-ports', 'deep-messages', 'lead-1'] },
        },
        {
          id: 'retransmission',
          title: 'TCP: Retransmission',
          sub: 'Sent again, then the page is whole',
          narrative:
            'The ACK told the server that piece 2 never arrived, so it sends piece 2 again: a **retransmission**. This time it arrives. The gap is filled, and the laptop hands all three pieces to the browser, in order, then confirms: “got everything”. The cost was the wait: piece 3 sat at the laptop until piece 2 came back.',
          deep: [
            {
              text: 'If no ACK came back at all, the server’s timer would run out and it would send the piece again anyway. And if the other end never answered, TCP would give up after a while and tell the app the connection failed.',
              cite: [rfc('rfc-6298', '5', true), tcp('3.8.3'), MS_SOCKET_REMARKS],
            },
          ],
          facts: [
            { label: 'Sent again', value: 'piece 2', backing: { traces: ['term-retransmission', 'fact-resend'] } },
            { label: 'Waited', value: 'piece 3, until piece 2 arrived', backing: { traces: ['fact-hold'] } },
            { label: 'The browser got', value: 'all three pieces, in order', backing: { traces: ['fact-tcp-gives', 'fact-hold'] } },
          ],
          events: step3,
          backing: { traces: ['term-retransmission', 'fact-resend', 'fact-hold', 'fact-tcp-gives', 'term-ack', 'fact-used', 'fact-ports', 'lead-1'] },
        },
        {
          id: 'udp-send',
          title: 'UDP: Connectionless Send',
          sub: 'No hello, just send',
          narrative:
            'Now you join a call with Sam. A call usually sends its sound over **UDP**. There’s no handshake: your first packet already carries sound. That’s **connectionless**: UDP never sets up a line. Each packet is a **datagram**, a message that travels on its own. Sam’s voice comes back the same way.',
          deep: [
            {
              text: 'UDP’s header is four 2-byte fields: source port, destination port, length and checksum. There’s no sequence number, no ACK and no window.',
              cite: [RFC768_LENGTH, tcp('3.1')],
            },
          ],
          facts: [
            { label: 'Handshake', value: 'none', backing: { traces: ['term-connectionless', 'fact-setup'] } },
            { label: 'Each packet', value: 'a datagram, on its own', backing: { traces: ['term-datagram'] } },
            { label: 'Header', value: '8 bytes: ports, length, checksum', backing: { traces: ['fact-headers'] } },
            { label: 'To', value: '203.0.113.90, port 16384', backing: { example: true } },
          ],
          events: step4,
          backing: { traces: ['term-connectionless', 'term-datagram', 'fact-setup', 'fact-headers', 'fact-used', 'fact-ports', 'lead-1'] },
        },
        {
          id: 'udp-loss',
          title: 'UDP: Packet Loss, No Retransmission',
          sub: 'Lost, and nobody sends it again',
          narrative:
            'Sam’s packet 2 is lost on the way, perhaps dropped by a busy router. UDP doesn’t send it again: there’s no ACK to notice it’s missing. Packet 3 goes straight to the call app, with no waiting. The app has to cope with the gap itself, and the call goes on. In a call, a resend would only help if it arrived in time to be played.',
          deep: [
            {
              text: 'UDP also has no congestion control, so it is up to the app to keep from overloading the network.',
              cite: [rfc('rfc-8085', '1'), RFC1122_UDP],
            },
          ],
          facts: [
            { label: 'Sam’s packet 2', value: 'lost, never sent again', backing: { traces: ['fact-lost'] } },
            { label: 'Packet 3', value: 'handed to the app at once', backing: { traces: ['fact-lost'] } },
            { label: 'Who copes', value: 'the call app', backing: { traces: ['why-2'] } },
          ],
          events: step5,
          backing: { traces: ['fact-lost', 'fact-loss', 'fact-headers', 'why-2', 'term-datagram', 'fact-used', 'fact-ports', 'lead-1'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'TCP and UDP both carry an app’s data from port to port. TCP sets up a connection, numbers the bytes and sends again whatever is lost, so the app gets every byte in order, or hears that the connection failed. UDP just sends each message on its own: no setup, no resending.',
            cite: [tcp('2.2'), tcp('3.4'), tcp('3.8'), tcp('3.8.3'), RFC768_INTRO, RFC768_FIELDS, rfc('rfc-8085', '1'), rfc('rfc-8085', '3.3'), MS_SOCKET_PARAMS, MS_SOCKET_REMARKS, BSD_SOCKET],
          },
          {
            id: 'lead-2',
            text: 'TCP is like sending a long letter as numbered postcards and asking “got them all?”; anything missing is sent again. UDP is like a walkie-talkie: you just speak, and a crackled word is gone.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-connection',
            idea: 'An agreed two-way line, set up before any data moves',
            name: 'Connection',
            cite: [tcp('3.5'), tcp('2.2'), MS_SOCKET_REMARKS, BSD_SOCKET],
          },
          {
            id: 'term-handshake',
            idea: 'Hello, hello back, OK',
            name: 'Three-way handshake',
            cite: [tcp('3.5')],
          },
          {
            id: 'term-ack',
            idea: '“Got everything up to here”',
            name: 'Acknowledgement (ACK)',
            cite: [tcp('3.4'), tcp('3.1')],
          },
          {
            id: 'term-retransmission',
            idea: 'Sending a lost piece again',
            name: 'Retransmission',
            cite: [tcp('3.8'), tcp('2.2')],
          },
          {
            id: 'term-flow-control',
            idea: 'The receiver saying how much more it can take',
            name: 'Flow control',
            cite: [tcp('3.8.6'), RFC1122_SUITE],
          },
          {
            id: 'term-connectionless',
            idea: 'Sending with no setup first',
            name: 'Connectionless',
            cite: [rfc('rfc-8085', '1'), NIST_2_1, RFC1122_SUITE, MS_SOCKET_PARAMS],
          },
          {
            id: 'term-datagram',
            idea: 'One message that travels on its own',
            name: 'Datagram',
            cite: [RFC768_INTRO, MS_SOCKET_PARAMS, BSD_SOCKET],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['TCP: set up a connection', 'TCP: acknowledge', 'TCP: resend what’s lost', 'UDP: just send', 'UDP: the app copes'],
          note: 'What each does, in the order this lesson shows it. TCP resends only when a piece is lost.',
          cite: [tcp('3.5'), tcp('3.4'), tcp('3.8'), RFC768_INTRO, rfc('rfc-8085', '3.3'), RFC1122_UDP],
        },
        why: [
          {
            id: 'why-1',
            text: 'Apps that need every byte, in order, such as a web page, an email or a file, usually use TCP. They pay with a round trip to set up, and a wait whenever a piece is lost.',
            cite: [RFC768_INTRO, rfc('rfc-8085', '3.3'), rfc('rfc-7413', '1'), tcp('2.2'), tcp('3.10.7.4'), NIST_TCP_UDP, rfc('rfc-9112', '9', true), rfc('rfc-5321', '4.5.4.2', true), rfc('rfc-959', '8', true)],
          },
          {
            id: 'why-2',
            text: 'Apps for which late is as bad as lost, such as a call, often use UDP. A resend would only help if it arrived in time to be played. UDP resends nothing and holds nothing back, and the app deals with whatever else it needs itself.',
            cite: [rfc('rfc-8085', '3.3'), RFC1122_UDP, ...LATE, rfc('rfc-3550', '1'), MS_TEAMS, tcp('2.2'), tcp('3.10.7.4')],
          },
        ],
        deep: [
          {
            id: 'deep-quic',
            text: 'QUIC, which carries HTTP/3, runs over UDP and does its own acknowledgements and resending, so a lost packet holds up only the streams whose data it carried.',
            cite: [rfc('rfc-9000', '1', true), rfc('rfc-9000', '13', true), rfc('rfc-9114', '1.2')],
          },
          {
            id: 'deep-dns',
            text: 'DNS asks over UDP and asks again if no answer comes. It uses TCP too, for big answers and for copying whole zones.',
            cite: [rfc('rfc-1035', '4.2', true), rfc('rfc-1035', '4.2.1', true), rfc('rfc-7766', '5'), NIST_TCP_UDP],
          },
          {
            id: 'deep-messages',
            text: 'UDP keeps each message whole. TCP is one stream of bytes, so it may split or join what the app wrote.',
            cite: [tcp('3.7'), RFC768_INTRO, rfc('rfc-8085', '1'), BSD_SOCKET],
          },
        ],
        facts: [
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 9293 (TCP) and RFC 768 (UDP)',
            cite: [RFC9293_ABSTRACT, RFC768_DEFINED],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '4, transport', cite: OSI_L4 },
          {
            id: 'fact-two',
            label: 'Both',
            value: 'carry an app’s data from a port on one computer to a port on another; they are the two common transport protocols',
            cite: [RFC1122_SUITE, NIST_TRANSPORT, tcp('2.2'), RFC768_FIELDS],
          },
          {
            id: 'fact-tcp-gives',
            label: 'TCP gives',
            value: 'a connection, every byte in order, acknowledgements and resending, and flow control',
            cite: [tcp('2.2'), tcp('3.4'), tcp('3.8'), tcp('3.8.6'), RFC1122_SUITE, MS_SOCKET_PARAMS, BSD_SOCKET],
          },
          {
            id: 'fact-udp-gives',
            label: 'UDP gives',
            value: 'ports and a checksum: no setup, no resending and no promise of order; each message travels whole, on its own',
            cite: [RFC768_INTRO, RFC768_FIELDS, RFC1122_UDP, rfc('rfc-8085', '3.3'), rfc('rfc-8085', '1'), MS_SOCKET_PARAMS, BSD_SOCKET],
          },
          {
            id: 'fact-setup',
            label: 'Before any data',
            value: 'TCP: a three-way handshake (SYN, SYN-ACK, ACK), one round trip. UDP: nothing',
            cite: [tcp('3.5'), rfc('rfc-7413', '1'), RFC768_INTRO, rfc('rfc-8085', '1')],
          },
          {
            id: 'fact-loss',
            label: 'Losing a packet',
            value: 'can happen on the way, perhaps because a busy router’s queue is full. That’s normal, not a fault',
            cite: [rfc('rfc-7567', '2'), tcp('3.8'), rfc('rfc-5681', '3', true), rfc('rfc-2914', '6.1')],
          },
          {
            id: 'fact-resend',
            label: 'How TCP knows a piece is lost',
            value: 'its ACKs keep naming the missing bytes, or its timer runs out with no ACK; then it sends the piece again',
            cite: [rfc('rfc-5681', '3.2', true), rfc('rfc-6298', '5', true), tcp('3.8'), rfc('rfc-8985', '1', true)],
          },
          {
            id: 'fact-hold',
            label: 'Held pieces',
            value: 'TCP delivers bytes in order, so when one piece is lost, the data behind it waits until it is sent again.',
            cite: [tcp('2.2'), tcp('3.10.7.4')],
          },
          {
            id: 'fact-lost',
            label: 'A lost piece',
            value: 'TCP sends it again, and the data behind it waits. UDP doesn’t, and the data behind it goes straight to the app',
            cite: [tcp('3.8'), tcp('2.2'), tcp('3.10.7.4'), RFC768_INTRO, rfc('rfc-8085', '3.3'), rfc('rfc-9114', '1.1')],
          },
          {
            id: 'fact-fail',
            label: 'If the other end stops answering',
            value: 'TCP gives up after a while, closes the connection and tells the app it failed',
            cite: [tcp('3.8.3'), MS_SOCKET_REMARKS, BSD_SOCKET, MS_TIMEDOUT],
          },
          {
            id: 'fact-used',
            label: 'Used for',
            value: 'TCP: web pages (except over HTTP/3), email, files. UDP: typically a call’s sound and DNS lookups, and QUIC, which carries HTTP/3',
            cite: [
              rfc('rfc-9110', '4.3.2', true),
              rfc('rfc-9112', '9', true),
              rfc('rfc-5321', '4.5.4.2', true),
              rfc('rfc-959', '8', true),
              rfc('rfc-8085', '3.3'),
              tcp('2.2'),
              ...HTTP3,
              NIST_TCP_UDP,
              rfc('rfc-3550', '1'),
              MS_TEAMS,
              rfc('rfc-1035', '4.2', true),
            ],
          },
          {
            id: 'fact-headers',
            label: 'Header',
            value:
              'UDP: 8 bytes, holding the source port, destination port, length and checksum. TCP’s is bigger: it also has sequence and acknowledgement numbers and a window, which UDP’s doesn’t',
            cite: [RFC768_LENGTH, RFC768_FIELDS, tcp('3.1')],
          },
          {
            id: 'fact-ports',
            label: 'Ports here',
            value: 'a destination port names the service listening there, such as the web’s TCP port 80; a source port is usually the port on your own computer that replies go to',
            cite: [rfc('rfc-9110', '4.2.1', true), NIST_TRANSPORT, NIST_TCP_UDP, RFC768_FIELDS],
          },
          { id: 'fact-stands-for', label: 'Stands for', value: 'Transmission Control Protocol and User Datagram Protocol', cite: [RFC9293_ABSTRACT, RFC768_DEFINED] },
        ],
      },
      practice: [
        {
          id: 'drop-both',
          prompt: 'A piece of a web page (over TCP) and a packet of a call (over UDP) are both lost on the way. What happens next?',
          options: [
            {
              text: 'TCP sends the page’s piece again; the call’s packet stays lost.',
              feedback: 'Right. TCP sends again whatever isn’t acknowledged. UDP doesn’t resend; the call app has to cope with the gap.',
              cite: [tcp('3.8'), rfc('rfc-8085', '3.3'), RFC768_INTRO],
            },
            {
              text: 'Both are sent again.',
              feedback: 'Not quite. UDP doesn’t send a lost packet again, and TCP does.',
              cite: [rfc('rfc-8085', '3.3'), RFC1122_UDP, tcp('3.8')],
            },
            {
              text: 'Both stay lost.',
              feedback: 'Not quite. TCP’s ACKs show the gap, and the server sends the piece again.',
              cite: [tcp('3.8'), rfc('rfc-5681', '3.2', true)],
            },
          ],
          answer: 0,
        },
        {
          id: 'which-call',
          prompt: 'A call app wants Sam’s voice to play on time, and can live with a tiny gap. Which does it usually use?',
          options: [
            {
              text: 'UDP.',
              feedback: 'Right. With UDP nothing waits for a lost packet, and in a call, late is as bad as lost.',
              cite: [...LATE, rfc('rfc-3550', '1'), MS_TEAMS, rfc('rfc-8085', '3.3')],
            },
            {
              text: 'TCP.',
              feedback: 'Not quite. TCP would make everything behind a lost piece wait until it was sent again, and by then its moment to be played may have passed.',
              cite: [tcp('2.2'), tcp('3.10.7.4'), G114_A3, rfc('rfc-8836', '1')],
            },
          ],
          answer: 0,
        },
        {
          id: 'promise',
          prompt: 'Does TCP guarantee that your data arrives?',
          options: [
            {
              text: 'No. It sends again whatever is lost, but if the other end stops answering, it gives up and tells the app.',
              feedback: 'Right. The app gets every byte in order, or hears that the connection failed.',
              cite: [tcp('3.8.3'), MS_SOCKET_REMARKS, BSD_SOCKET],
            },
            {
              text: 'Yes, always.',
              feedback: 'Not quite. TCP can’t deliver to a computer that has stopped answering. After enough failed resends it closes the connection and tells the app.',
              cite: [tcp('3.8.3'), MS_SOCKET_REMARKS, MS_TIMEDOUT],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
