import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, Cue, MessageEvent, NoteEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite } from '../sources';

/**
 * Packets, Networking Concepts lesson 2. Your browser asks example.net for its home page, a file of 5,840 bytes. The
 * server's TCP cuts it into four segments of up to 1,460 bytes (RFC 9293 section 3.7, RFC 8900 section 4.1); each goes in
 * a packet whose IP header says where it is from and where it is going (RFC 791 section 3.1). The packets travel on their
 * own, usually the same way (RFC 791 section 1.4, RFC 1122 section 1.3.3, RFC 2991 section 3). Then the route changes:
 * pieces 3 and 4 take the new way through router d and reach the laptop before piece 2, which is held up on the old way
 * through router b, not lost (RFC 8085 section 3.3). The laptop's TCP holds 3 and 4 and, when 2 arrives, hands the browser
 * the bytes in order (RFC 9293 sections 3.10 and 3.10.7.4).
 *
 * The scene is the approved design's (prototypes/d13-packets.md): parked tags (`park`, `unpark`) and a message `via` a
 * router. The addresses (RFC 1918 and RFC 5737), the laptop's port 50422, the file index.html and its 5,840 bytes are
 * example data; the log's times and sizes are dashes because no source states one for this story. RFC 9293 defines TCP,
 * RFC 791 and RFC 8200 IP, RFC 1812 what a router does; RFC 8900, RFC 2991, RFC 8085, RFC 1191, NIST and the vendor
 * pages carry no defining marker. No standard places a packet at an OSI layer, so the badge rests on two vendors' pages
 * with NIST added, as IP Address's and What is IP's do.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 9293 defines TCP, RFC 791 IPv4, RFC 8200 IPv6. */
const tcp = (section: string) => rfc('rfc-9293', section, true);
const ip4 = (section: string) => rfc('rfc-791', section, true);
const ip6 = (section: string) => rfc('rfc-8200', section, true);
/** RFC 1812 sets the requirements for IPv4 routers, so it defines what a router does with a packet. */
const ROUTERS_EACH = rfc('rfc-1812', '2.4', true);
const RFC8900_TCP = rfc('rfc-8900', '4.1');

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page the passage is on. */
const R1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const RFC1122_INDEPENDENT = cite('rfc-1122', '1.1.2', { url: `${R1122}#page-7` });
const RFC1122_DELIVERY = cite('rfc-1122', '1.1.3', { url: `${R1122}#page-10` });
const RFC1122_PACKET = cite('rfc-1122', '1.3.3', { url: `${R1122}#page-18` });
/** "Path" and "MTU" are both on page 19. */
const RFC1122_PATH_MTU = cite('rfc-1122', '1.3.3', { url: `${R1122}#page-19` });
const RFC894_MAX = cite('rfc-894', 'Frame Format', {
  url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=the%20maximum%20length%20of%20an%20IP%20datagram',
});

/** NIST's PDFs have no section anchors, so a section is cited by the PDF page its passage is on. */
const NIST41 = 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-41r1.pdf';
const NIST_IP_LAYER = cite('nist-sp800-41r1', '2', { url: `${NIST41}#page=11` });
const NIST_ADDRESSES = cite('nist-sp800-41r1', '2.1.1', { url: `${NIST41}#page=12` });
const NIST_FOOTNOTE_6 = cite('nist-sp800-77r1', '2.1, footnote 6', { url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf#page=20' });

/** Vendor pages: the section ids are on the pages. None is the defining standard. */
const AZ = 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-tcpip-performance-tuning';
const AZURE_MTU = cite('microsoft-azure-tcpip-tuning', 'MTU', { url: `${AZ}#mtu` });
const AZURE_MSS = cite('microsoft-azure-tcpip-tuning', 'TCP MSS window scaling and PMTUD', { url: `${AZ}#tcp-mss-window-scaling-and-pmtud` });
const AZURE_FRAG = cite('microsoft-azure-tcpip-tuning', 'Azure and fragmentation', { url: `${AZ}#azure-and-fragmentation` });
const MS_TRANSPORT = cite('microsoft-osi', 'Transport layer', {
  url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model#transport-layer',
});
const CEF = 'https://www.cisco.com/en/US/docs/ios-xml/ios/ipswitch_cef/configuration/15-0sy/isw-cef-load-balancing.html';
const CISCO_PER_DEST = cite('cisco-cef-load-balancing', 'Per-Destination Load Balancing', { url: `${CEF}#GUID-303F07B8-A52B-4BD3-A1F8-54DF24493D8E` });
const CISCO_PER_PACKET = cite('cisco-cef-load-balancing', 'Per-Packet Load Balancing', { url: `${CEF}#GUID-C725A4B8-9263-4D2C-95FB-F31D14E477C4` });
/** Cisco's routing page has no heading ids, so the section is cited by a text fragment. */
const CISCO_DYNAMIC = cite('cisco-what-is-routing', 'Large intra-domain networks', {
  url: 'https://www.cisco.com/site/us/en/learn/topics/networking/what-is-routing.html#:~:text=keeps%20itself%20up%2Dto%2Ddate%20automatically',
});
/** The badge: IP Address's and What is IP's set, with NIST's "routes packets" added. */
const OSI_L3_PACKETS = [
  cite('cloudflare-network-layers', 'Network Layers', { url: 'https://developers.cloudflare.com/fundamentals/reference/network-layers/#:~:text=3%20Network%20layer' }),
  MS_TRANSPORT,
  NIST_IP_LAYER,
];

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50422';
const WEB = '203.0.113.80:80';
const DASH = '—';

const pieces: TableDef = {
  id: 'pieces',
  title: 'What your laptop has',
  by: 'kept by your laptop’s TCP',
  columns: [
    { key: 'piece', label: 'Piece' },
    { key: 'bytes', label: 'Bytes' },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'piece',
  initialRows: [],
  empty: 'Nothing yet.',
};

const traced = (...traces: string[]): Backing => ({ traces });
const BYTES: Record<number, string> = { 1: '1–1,460', 2: '1,461–2,920', 3: '2,921–4,380', 4: '4,381–5,840' };
const row = (piece: number, status: string): Row => ({ piece: String(piece), bytes: BYTES[piece]!, status });
const park = (place: string, bay: number, tag: string): Cue => ({ cue: 'park', arg: `${place} ${bay} ${tag}` });
const status = (text: string, ...flags: ('status-known' | 'status-done')[]): Cue[] => [{ cue: 'status', arg: text }, ...flags.map((cue) => ({ cue }))];

/** A TCP message of the story: proto TCP, time and size dashes (no source states one for this story), no `over`. */
const seg = (m: { id: string; from: string; to: string; tag: string; kind: MessageEvent['kind']; info: string; plain: string; via?: string; cues?: Cue[]; backing: Backing }): MessageEvent => ({
  type: 'message',
  id: m.id,
  from: m.from,
  to: m.to,
  tag: m.tag,
  kind: m.kind,
  ...(m.via === undefined ? {} : { via: m.via }),
  log: { time: DASH, source: m.from === 'laptop' ? LAPTOP : WEB, destination: m.from === 'laptop' ? WEB : LAPTOP, protocol: 'TCP', info: m.info, size: DASH },
  plain: m.plain,
  ...(m.cues === undefined ? {} : { cues: m.cues }),
  backing: m.backing,
});
/** TCP's own work at one host: nothing is sent. */
const note = (id: string, src: string, info: string, plain: string, cues: Cue[], backing: Backing): NoteEvent => ({
  type: 'note',
  id,
  log: { time: DASH, source: src, destination: DASH, protocol: 'TCP', info, size: DASH },
  plain,
  cues,
  backing,
});
const add = (id: string, piece: number, word: string, summary: string, backing: Backing): TableEvent => ({
  type: 'table',
  id,
  table: 'pieces',
  op: 'add',
  row: row(piece, word),
  summary,
  backing,
});

const step1: SceneEvent[] = [
  seg({
    id: 's1-req',
    from: 'laptop',
    to: 'web',
    tag: 'REQUEST',
    kind: 'request',
    info: 'Asks for the home page, index.html',
    plain: 'Your browser asks example.net for its home page.',
    cues: status('Asking for the page'),
    backing: traced('fact-ports', 'lead-1'),
  }),
  note(
    's1-cut',
    WEB,
    'TCP cuts 5,840 bytes into 4 pieces',
    'The server’s TCP cuts the file into four segments.',
    [1, 2, 3, 4].map((n) => park('web', n, `PIECE ${n}`)).concat(status('Cut into 4 pieces')),
    traced('fact-who-cuts', 'fact-piece-size', 'term-segment', 'fact-ports'),
  ),
];

const step2: SceneEvent[] = [
  seg({
    id: 's2-p1',
    from: 'web',
    to: 'laptop',
    tag: 'PIECE 1',
    kind: 'response',
    info: 'Piece 1: bytes 1–1,460',
    plain: 'Piece 1 arrives, with its headers: from the server, to your laptop, bytes 1 to 1,460.',
    cues: [park('laptop', 1, 'PIECE 1'), ...status('Piece 1 arrived')],
    backing: traced('fact-ip-header', 'fact-tcp-header', 'fact-ports', 'term-sequence', 'term-packet', 'fact-piece-size'),
  }),
  add('s2-t1', 1, 'Arrived', 'Piece 1: arrived.', traced('fact-tcp-header', 'term-sequence', 'fact-piece-size')),
];

const step3: SceneEvent[] = [
  seg({
    id: 's3-p2',
    from: 'web',
    to: 'b',
    tag: 'PIECE 2',
    kind: 'response',
    info: 'Piece 2: bytes 1,461–2,920',
    plain: 'Piece 2 takes the same way as piece 1, through router b.',
    cues: [park('b', 1, 'PIECE 2'), ...status('Piece 2 on its way')],
    backing: traced('fact-on-its-own', 'fact-same-way', 'fact-ports', 'fact-tcp-header', 'term-sequence', 'fact-piece-size'),
  }),
];

const step4: SceneEvent[] = [
  seg({
    id: 's4-p3',
    from: 'web',
    to: 'laptop',
    via: 'd',
    tag: 'PIECE 3',
    kind: 'response',
    info: 'Piece 3: bytes 2,921–4,380, the new way',
    plain: 'Piece 3 takes the new way, through router d, and reaches your laptop before piece 2.',
    cues: [park('laptop', 3, 'PIECE 3'), ...status('Out of order: piece 2 not here yet')],
    backing: traced('fact-routes-change', 'fact-out-of-order', 'fact-ports', 'fact-tcp-header', 'term-sequence', 'fact-piece-size'),
  }),
  add('s4-t3', 3, 'Arrived early, waiting', 'Piece 3: arrived early, waiting.', traced('fact-back-in-order', 'fact-out-of-order')),
  seg({
    id: 's4-p4',
    from: 'web',
    to: 'laptop',
    via: 'd',
    tag: 'PIECE 4',
    kind: 'response',
    info: 'Piece 4: bytes 4,381–5,840',
    plain: 'Piece 4 takes the new way too, and arrives early.',
    cues: [park('laptop', 4, 'PIECE 4')],
    backing: traced('fact-routes-change', 'fact-out-of-order', 'fact-ports', 'fact-tcp-header', 'term-sequence', 'fact-piece-size'),
  }),
  add('s4-t4', 4, 'Arrived early, waiting', 'Piece 4: arrived early, waiting.', traced('fact-back-in-order', 'fact-out-of-order')),
  seg({
    id: 's4-p2',
    from: 'b',
    to: 'laptop',
    tag: 'PIECE 2',
    kind: 'response',
    info: 'Piece 2 arrives last',
    plain: 'Piece 2, held up on the old way, arrives last.',
    cues: [park('laptop', 2, 'PIECE 2'), ...status('All 4 pieces here')],
    backing: traced('fact-out-of-order', 'fact-routes-change', 'fact-ports', 'fact-tcp-header', 'term-sequence', 'fact-piece-size'),
  }),
  add('s4-t2', 2, 'Arrived last', 'Piece 2: arrived last.', traced('fact-out-of-order', 'fact-back-in-order')),
];

const step5: SceneEvent[] = [
  {
    type: 'table',
    id: 's5-order',
    table: 'pieces',
    op: 'replace',
    rows: [1, 2, 3, 4].map((n) => row(n, 'In order')),
    summary: 'Your laptop’s TCP puts the pieces in order: 1, 2, 3, 4.',
    backing: traced('fact-back-in-order', 'fact-tcp-header', 'term-sequence'),
  },
  note(
    's5-done',
    LAPTOP,
    'TCP hands bytes 1–5,840 to the browser, in order',
    'Your laptop’s TCP puts the four pieces back in order and hands over the page.',
    [{ cue: 'unpark', arg: 'laptop' }, { cue: 'page', arg: 'text' }, ...status('Page complete', 'status-done')],
    traced('fact-back-in-order', 'fact-ports', 'fact-piece-size'),
  ),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'packets',
  title: 'Packets',
  subtitle: 'Cut up, sent apart, put back together',
  level: 'beginner',
  certTags: [],
  summary:
    'A file too big for one packet is cut into pieces. Each travels in its own packet, with a header that says where it’s from and where it’s going, and the far end puts them back in order. Watch a page arrive in four pieces, two of them early.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'fact-out-of-order', 'fact-back-in-order'] },
  units: [
    {
      id: 'packets',
      name: 'Packets',
      fullName: 'Packets and segments',
      purpose: 'Data in small pieces, each with its own addresses',
      osi: { layers: [3], cite: OSI_L3_PACKETS },
      backing: { traces: ['term-packet', 'term-segment', 'lead-1', 'fact-ip-header'] },
      scene: {
        title: 'A page in four pieces',
        views: ['network'],
        layers: ['tcp:web'],
        labels: { laptop: 'Wants a page', url: 'example.net', b: 'b', c: 'c', d: 'd' },
        start: [{ cue: 'hide', arg: 'resolver' }],
        panel: { type: 'table', table: pieces },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'Sent by your laptop' },
            { kind: 'response', label: 'Sent to your laptop' },
            { kind: 'note', label: 'TCP at one end, nothing sent' },
          ],
        },
        parties: [],
        backing: { traces: ['lead-1', 'fact-ports', 'fact-who-cuts', 'fact-on-its-own', 'fact-back-in-order'] },
      },
      overview: {
        hook: 'A file too big for one packet can’t cross a network in one go. TCP cuts it into pieces, and each goes in a packet with a header that says where it’s from and where it’s going. Each packet travels on its own, so the pieces don’t always arrive in the order they were sent. Watch a page arrive in four pieces, two of them early, and get put back in order.',
        hookBacking: { traces: ['lead-1', 'why-1', 'fact-out-of-order', 'fact-back-in-order'] },
        description:
          'It’s like posting a long letter as numbered pages in separate envelopes. Each envelope has both addresses on it, they may not arrive in the order you posted them, and the page numbers tell the reader how to put the letter back together.',
        backing: { analogy: true },
        facts: [
          { label: 'Each piece', value: 'up to 1,460 bytes of data', backing: { traces: ['fact-piece-size'] } },
          { label: 'Each packet carries', value: 'where it’s from and where it’s going', backing: { traces: ['fact-ip-header'] } },
          { label: 'Travels', value: 'on its own, usually the same way as the rest', backing: { traces: ['fact-on-its-own', 'fact-same-way'] } },
          { label: 'Put back in order by', value: 'TCP at the receiver', backing: { traces: ['fact-back-in-order'] } },
          { label: 'OSI layer', value: '3, network', backing: { traces: ['fact-osi'] } },
        ],
      },
      steps: [
        {
          id: 'segmentation',
          title: 'Segmentation',
          sub: 'Too big for one packet',
          narrative:
            'Your browser asks example.net for its home page, a file of 5,840 bytes. That’s too big for one packet: on most links, a packet can be at most 1,500 bytes, the link’s **MTU**. So the server’s **TCP** cuts the file’s bytes into pieces called **segments**, each up to 1,460 bytes of data. This file makes four. A bigger file just makes more.',
          deep: [
            {
              text: 'The 1,460 is the link’s 1,500 bytes minus a 20-byte IP header and a 20-byte TCP header. Options in the TCP header make it longer, and the data a little shorter.',
              cite: [tcp('3.7.1'), AZURE_MSS, ip4('3.1')],
            },
          ],
          facts: [
            { label: 'File', value: 'index.html, 5,840 bytes', backing: { example: true } },
            { label: 'Largest packet', value: '1,500 bytes on most links', backing: { traces: ['fact-mtu'] } },
            { label: 'Each piece', value: 'up to 1,460 bytes of data', backing: { traces: ['fact-piece-size'] } },
            { label: 'Pieces', value: '4 here; a 1,460,000-byte photo would make 1,000', backing: { traces: ['fact-piece-size'] } },
          ],
          events: step1,
          backing: { traces: ['term-mtu', 'fact-mtu', 'why-1', 'term-segment', 'fact-who-cuts', 'fact-piece-size', 'fact-ports', 'pattern', 'lead-1'] },
        },
        {
          id: 'packet-headers',
          title: 'Packet Headers',
          sub: 'From, to, and which bytes',
          narrative:
            'Each segment gets a **TCP header**: the two ports, and the number of its first byte, so your laptop can tell where it fits. Then IP puts it in a **packet**, with an **IP header** in front: the address it’s from, 203.0.113.80, and the address it’s going to, your laptop’s. Every packet carries its own addresses. Piece 1 sets off and arrives.',
          deep: [
            {
              text: 'An IPv4 header is at least 20 bytes. Besides the two addresses, it says how long the packet is and which protocol is inside it, here TCP.',
              cite: [ip4('3.1'), tcp('2.2')],
            },
          ],
          facts: [
            { label: 'From', value: '203.0.113.80, port 80', backing: { traces: ['fact-ip-header', 'fact-ports'] } },
            { label: 'To', value: 'your laptop, port 50422', backing: { traces: ['fact-ip-header', 'fact-ports'] } },
            { label: 'Piece 1', value: 'bytes 1–1,460', backing: { traces: ['fact-tcp-header', 'term-sequence'] } },
            { label: 'A packet', value: 'an IP header, then the segment', backing: { traces: ['term-packet', 'term-segment', 'fact-who-cuts'] } },
          ],
          events: step2,
          backing: { traces: ['term-header', 'term-packet', 'term-sequence', 'fact-ip-header', 'fact-tcp-header', 'fact-ports', 'fact-who-cuts', 'term-segment', 'lead-1'] },
        },
        {
          id: 'forwarding',
          title: 'Forwarding',
          sub: 'Each packet goes on its own',
          narrative:
            'Piece 2 sets off after it. Each packet travels on its own: there’s no connection inside the network. Every router on the way reads the packet’s destination address and sends it on toward it, deciding again for every packet. Packets of one download usually all go the same way, and so far they do, through router b.',
          deep: [
            {
              text: 'Where a router has two equally good ways, it picks one for each conversation, using the packets’ addresses, and keeps to it, so its pieces stay in order.',
              cite: [rfc('rfc-8900', '3.5'), rfc('rfc-2991', '3'), CISCO_PER_DEST],
            },
          ],
          facts: [
            { label: 'Each packet', value: 'travels on its own', backing: { traces: ['fact-on-its-own', 'term-datagram'] } },
            { label: 'Every router', value: 'reads the destination and sends it on', backing: { traces: ['fact-on-its-own'] } },
            { label: 'One download', value: 'usually one way', backing: { traces: ['fact-same-way'] } },
          ],
          events: step3,
          backing: { traces: ['term-datagram', 'fact-on-its-own', 'fact-same-way', 'fact-ports', 'pattern', 'lead-1'] },
        },
        {
          id: 'route-change',
          title: 'Route Change',
          sub: 'Two pieces overtake one',
          narrative:
            'Then the route changes: router c starts sending your laptop’s packets through router d instead. Pieces 3 and 4 take the new way and reach your laptop first, while piece 2 is held up on the old one. They’ve arrived **out of order**: 1, 3, 4. Your laptop’s TCP keeps 3 and 4 aside, because piece 2’s bytes go before theirs. Then piece 2 arrives.',
          deep: [
            {
              text: 'Routes change when a link or a router fails, and routers keep their routes up to date by themselves. While a route changes, the internet can hold up some packets more than others.',
              cite: [rfc('rfc-8900', '2.1'), ROUTERS_EACH, CISCO_DYNAMIC, rfc('rfc-8085', '3.3'), rfc('rfc-1812', '2.2.3', true), rfc('rfc-2991', '3')],
            },
          ],
          facts: [
            { label: 'Arrived', value: 'pieces 1, 3, 4, then 2', backing: { traces: ['fact-out-of-order'] } },
            { label: 'Why', value: 'the route changed on the way', backing: { traces: ['fact-routes-change', 'fact-out-of-order'] } },
            { label: 'Pieces 3 and 4', value: 'kept aside until piece 2 came', backing: { traces: ['fact-back-in-order'] } },
            { label: 'The new way', value: 'through router d', backing: { traces: ['fact-routes-change'] } },
          ],
          events: step4,
          backing: { traces: ['fact-routes-change', 'fact-out-of-order', 'fact-back-in-order', 'fact-ip-promises', 'fact-ports', 'fact-tcp-header', 'term-sequence', 'fact-piece-size', 'lead-1'] },
        },
        {
          id: 'in-order-delivery',
          title: 'In-Order Delivery',
          sub: 'Put back together',
          narrative:
            'With piece 2 in, the gap is filled. Your laptop’s TCP puts the bytes back in order by their numbers, 1 to 5,840, and hands the whole page to the browser. The browser just gets the bytes, in order, and never knows they came out of order. IP promised no order; TCP, at your end, put it right.',
          deep: [
            {
              text: 'Along the way, your laptop’s TCP also tells the server what has arrived. If a piece never came, the server would send that one piece again, not the whole file.',
              cite: [tcp('3.4'), tcp('3.8'), rfc('rfc-6298', '5', true)],
            },
          ],
          facts: [
            { label: 'The browser got', value: 'all 5,840 bytes, in order', backing: { traces: ['fact-back-in-order'] } },
            { label: 'Who put them in order', value: 'TCP on your laptop', backing: { traces: ['fact-back-in-order'] } },
            { label: 'IP itself', value: 'promises no order', backing: { traces: ['fact-ip-promises'] } },
          ],
          events: step5,
          backing: { traces: ['fact-back-in-order', 'fact-ip-promises', 'fact-tcp-header', 'term-sequence', 'fact-ports', 'fact-piece-size', 'pattern', 'why-2', 'lead-1'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'Data crosses a network in small pieces. TCP cuts an app’s bytes into segments, and each one travels in a packet whose header says where it’s from and where it’s going. Every packet travels on its own, and at the far end TCP puts the pieces back in order.',
            cite: [tcp('2.2'), tcp('3.7'), tcp('3.10'), ip4('1.4'), ip4('3.1'), RFC8900_TCP, rfc('rfc-1191', '1'), NIST_IP_LAYER, NIST_ADDRESSES, MS_TRANSPORT],
          },
          {
            id: 'lead-2',
            text: 'It’s like posting a long letter as numbered pages in separate envelopes. Each envelope has both addresses on it, they may not arrive in the order you posted them, and the page numbers tell the reader how to put the letter back together.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-packet',
            idea: 'An IP header followed by data',
            name: 'Packet',
            cite: [RFC1122_PACKET, ip4('3.1'), NIST_FOOTNOTE_6],
          },
          {
            id: 'term-header',
            idea: 'The label at the front: where it’s from, where it’s going, and more',
            name: 'Header',
            cite: [ip4('3.1'), ip6('3'), NIST_ADDRESSES, NIST_FOOTNOTE_6],
          },
          {
            id: 'term-segment',
            idea: 'One piece of the data, with TCP’s header',
            name: 'Segment',
            cite: [tcp('4'), tcp('3.7'), RFC8900_TCP],
          },
          {
            id: 'term-mtu',
            idea: 'The biggest packet a link can carry',
            name: 'MTU (maximum transmission unit)',
            cite: [RFC1122_PATH_MTU, rfc('rfc-8900', '2.1'), AZURE_MTU],
          },
          {
            id: 'term-sequence',
            idea: 'The number of a piece’s first byte',
            name: 'Sequence number',
            cite: [tcp('3.1'), tcp('3.4')],
          },
          {
            id: 'term-datagram',
            idea: 'A packet that travels on its own, with no connection set up',
            name: 'Datagram',
            cite: [ip4('1.4'), ROUTERS_EACH, RFC1122_INDEPENDENT],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Cut into segments', 'Add the headers', 'Send each on its own', 'Put back in order'],
          note: 'What happens to a file on its way. TCP cuts and puts back, at the two ends; IP carries each packet, and every router on the way passes it on.',
          cite: [RFC8900_TCP, tcp('3.7'), tcp('3.10'), ip4('1.4'), ROUTERS_EACH],
        },
        why: [
          {
            id: 'why-1',
            text: 'A link carries packets only up to its MTU, 1,500 bytes on Ethernet and on most networks, so anything bigger goes in pieces. TCP sizes its pieces to fit.',
            cite: [rfc('rfc-8900', '2.1'), RFC894_MAX, AZURE_MTU, tcp('3.7'), rfc('rfc-1191', '1')],
          },
          {
            id: 'why-2',
            text: 'If one piece goes missing, TCP sends just that piece again, not the whole file.',
            cite: [tcp('3.8'), rfc('rfc-6298', '5', true)],
          },
        ],
        deep: [
          {
            id: 'deep-fragments',
            text: 'IP can also split a packet that’s too big for the next link into fragments, which the destination puts back together. That’s fragile, so TCP picks piece sizes that avoid it. In IPv6, routers never split packets; only the sender can.',
            cite: [ip4('2.3'), ip4('3.2'), ip6('4.5'), rfc('rfc-8900', '1'), tcp('3.7.2'), AZURE_FRAG],
          },
        ],
        facts: [
          {
            id: 'fact-mtu',
            label: 'Largest packet (MTU)',
            value: '1,500 bytes on Ethernet and on most networks',
            cite: [RFC894_MAX, AZURE_MTU, RFC1122_PATH_MTU],
          },
          {
            id: 'fact-piece-size',
            label: 'Each piece',
            value: 'up to 1,460 bytes of data on a 1,500-byte link: the MTU minus a 20-byte IP header and a 20-byte TCP header',
            cite: [tcp('3.7.1'), AZURE_MSS, ip4('3.1')],
          },
          {
            id: 'fact-who-cuts',
            label: 'Who cuts the data',
            value: 'TCP, into segments; IP puts each segment in a packet',
            cite: [tcp('2.2'), tcp('3.7'), RFC8900_TCP, AZURE_MSS],
          },
          {
            id: 'fact-ip-header',
            label: 'IP header',
            value: 'the address it’s from and the address it’s going to, among other fields',
            cite: [ip4('3.1'), ip6('3'), NIST_ADDRESSES],
          },
          {
            id: 'fact-tcp-header',
            label: 'TCP header',
            value: 'the two ports, and the number of the piece’s first byte, which tells the receiver where the piece fits',
            cite: [tcp('3.1'), tcp('3.4'), tcp('3.10')],
          },
          {
            id: 'fact-on-its-own',
            label: 'Each packet',
            value: 'travels on its own: every router reads its destination and sends it on, deciding for each packet',
            cite: [ip4('1.4'), ROUTERS_EACH, RFC1122_INDEPENDENT, NIST_IP_LAYER],
          },
          {
            id: 'fact-same-way',
            label: 'One download’s packets',
            value: 'usually all take the same way',
            cite: [RFC1122_PATH_MTU, rfc('rfc-2991', '3'), CISCO_PER_DEST],
          },
          {
            id: 'fact-routes-change',
            label: 'Routes',
            value: 'can change while packets travel, for example when a link or a router fails',
            cite: [rfc('rfc-8900', '2.1'), ROUTERS_EACH, CISCO_DYNAMIC],
          },
          {
            id: 'fact-out-of-order',
            label: 'Out of order',
            value: 'when packets of one download take different ways, as when a route changes, some can be held up and a later one can arrive first',
            cite: [rfc('rfc-8085', '3.3'), rfc('rfc-2991', '2'), rfc('rfc-2991', '3'), CISCO_PER_PACKET],
          },
          {
            id: 'fact-ip-promises',
            label: 'IP itself',
            value: 'promises no order and no delivery: packets may arrive out of order, or not at all',
            cite: [RFC1122_DELIVERY, ip4('1.2'), rfc('rfc-1812', '2.2.1'), MS_TRANSPORT],
          },
          {
            id: 'fact-back-in-order',
            label: 'Put back in order by',
            value: 'TCP at the receiver: it holds pieces that come early and hands the bytes on in order, so the app just gets the bytes',
            cite: [tcp('2.2'), tcp('3.10'), tcp('3.10.7.4'), tcp('3.7'), MS_TRANSPORT],
          },
          {
            id: 'fact-ports',
            label: 'Ports here',
            value: 'the web server’s TCP port 80; your laptop’s side uses a port of its own',
            cite: [rfc('rfc-9110', '4.2.1', true), NIST_IP_LAYER, tcp('2.2')],
          },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 791 (IPv4) and RFC 8200 (IPv6); TCP’s segments in RFC 9293',
            cite: [ip4('1.1'), ip6('1'), tcp('4')],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '3, network', cite: OSI_L3_PACKETS },
        ],
      },
      practice: [
        {
          id: 'who-cuts',
          prompt: 'Your browser downloads a 5,840-byte page from a web server. What cuts it into pieces that fit in packets?',
          options: [
            {
              text: 'TCP on the server, into segments of up to 1,460 bytes.',
              feedback: 'Right. TCP cuts the stream of bytes into segments sized to fit the link, and IP puts each one in a packet.',
              cite: [tcp('3.7'), tcp('3.7.1'), RFC8900_TCP, AZURE_MSS],
            },
            {
              text: 'IP, which cuts the file into packets.',
              feedback: 'Not quite. IP carries each segment in a packet. IP can split a packet that’s too big for a link, but TCP sizes its pieces so that isn’t needed.',
              cite: [tcp('2.2'), ip4('2.3'), tcp('3.7.2'), RFC8900_TCP],
            },
            {
              text: 'Each router on the way, to fit its next link.',
              feedback: 'Not quite. The server’s TCP cuts the data before it leaves, sized for the way ahead, and routers just pass each packet on.',
              cite: [tcp('3.7'), tcp('3.7.2'), ip6('4.5'), ROUTERS_EACH],
            },
          ],
          answer: 0,
        },
        {
          id: 'early-pieces',
          prompt: 'Pieces 3 and 4 of a page reach your laptop before piece 2. What happens?',
          options: [
            {
              text: 'Your laptop’s TCP holds 3 and 4, and when 2 arrives, hands the bytes on in order.',
              feedback: 'Right. TCP numbers every byte, holds pieces that come early, and hands the bytes to the browser in order.',
              cite: [tcp('3.4'), tcp('3.10'), tcp('3.10.7.4'), MS_TRANSPORT],
            },
            {
              text: 'The browser gets them as they come, and the page is jumbled.',
              feedback: 'Not quite. TCP hands the browser the bytes in order, so it never sees them out of order.',
              cite: [tcp('2.2'), tcp('3.10'), MS_TRANSPORT],
            },
            {
              text: 'IP puts them back in order on the way.',
              feedback: 'Not quite. IP promises no order: each packet travels on its own. Putting the pieces back in order is TCP’s job, at your end.',
              cite: [RFC1122_DELIVERY, ip4('1.2'), ip4('1.4'), tcp('3.10')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
