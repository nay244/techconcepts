import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * TCP, lesson 3 of How the Internet Works’ 14. The laptop and the web server shake hands, then the page comes
 * back in three pieces. The second is lost on the way; the laptop holds the third, says exactly what it is
 * missing, gets the lost piece again, and the connection closes.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols.mjs), changed only where a source does
 * not state them. The addresses, the client's port 50422, the times, the 120-byte request and the page's three pieces
 * of 4380 bytes are example data (RFC 5737 and RFC 1918 addresses, an ephemeral port, made-up numbers): no source
 * states them, and the scene's events carry them beside the claims they trace to. No message size is shown: no
 * source states one. The analogy (numbered postcards) cites nothing.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 9293 defines TCP, so its citations are the defining standard. */
const tcp = (section: string) => rfc('rfc-9293', section, true);
const RFC9293_ABSTRACT = cite('rfc-9293', 'Abstract', {
  url: 'https://www.rfc-editor.org/rfc/rfc9293.html#abstract',
  defining: true,
});

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

const CLOUDFLARE = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const MS_LB = 'https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-overview';
/** Azure's page says each half in its own place: "Layer 4 TCP or UDP traffic" in the introduction, "layer 4 of the OSI model" in the section. */
const AZURE_TCP = cite('microsoft-azure-lb', 'Introduction', {
  url: `${MS_LB}#:~:text=distribute%20Layer%204%20TCP%20or%20UDP%20traffic`,
});
const AZURE_L4 = cite('microsoft-azure-lb', 'How Azure Load Balancer distributes Layer 4 traffic', {
  url: `${MS_LB}#:~:text=Azure%20Load%20Balancer%20operates%20at%20layer%204`,
});
/** No standard puts TCP at an OSI layer (RFC 9293 calls it a transport-layer protocol of the internet's stack), so the badge rests on two vendors. */
const OSI_L4 = [
  cite('cloudflare-network-layers', 'Network Layers', {
    url: `${CLOUDFLARE}#:~:text=4%20Transport%20layer`,
  }),
  AZURE_TCP,
  AZURE_L4,
];

const AZURE_TUNING = 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-tcpip-performance-tuning';
const AZURE_MSS = cite('microsoft-azure-tcpip-tuning', 'TCP MSS window scaling and PMTUD', {
  url: `${AZURE_TUNING}#tcp-mss-window-scaling-and-pmtud`,
});

/** HTTP/3 is the exception to "pages ride on TCP", as What is HTTP teaches. */
const HTTP3 = [rfc('rfc-9114', '1', true), rfc('rfc-9000', '1')];

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50422';
const WEB = '203.0.113.80:80';

const pieces: TableDef = {
  id: 'pieces',
  title: 'What the laptop has',
  by: 'pieces of the page',
  columns: [
    { key: 'piece', label: 'Piece' },
    { key: 'bytes', label: 'Bytes' },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'piece',
  initialRows: [],
  empty: 'Nothing yet. No data has arrived.',
};

const mockup = messagesFor(pieces);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-tcp',
  title: 'TCP',
  subtitle: 'Delivery you can count on',
  level: 'beginner',
  certTags: [],
  summary:
    'The internet carries everything in small pieces and makes no promises about them. Pieces can get lost, arrive twice or come out of order. TCP makes it reliable anyway: it numbers every byte, checks what arrived and sends again whatever didn’t.',
  figure: 'net-map',
  backing: {
    traces: ['lead-1', 'fact-network', 'term-seq', 'term-ack', 'term-retransmission'],
  },
  units: [
    {
      id: 'tcp',
      name: 'TCP',
      fullName: 'Transmission Control Protocol',
      purpose: 'Delivery you can count on',
      group: 'core',
      osi: { layers: [4], cite: OSI_L4 },
      backing: { traces: ['fact-defined', 'lead-1'] },
      scene: {
        title: 'A page arrives whole, though a piece got lost',
        views: ['network', 'sequence'],
        layers: ['tcp:web'],
        labels: { laptop: 'Wants a page', url: 'example.net' },
        start: [],
        panel: { type: 'table', table: pieces },
        log: eventLog({ kind: 'dropped', label: 'Lost on the way' }),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'web', label: 'Web server', addr: '203.0.113.80' },
        ],
        backing: {
          traces: ['lead-1', 'fact-used', 'fact-loss', 'fact-segment', 'fact-numbers', 'term-retransmission'],
        },
      },
      overview: {
        hook: 'The internet carries everything in small pieces and makes no promises about them. Pieces can get lost, arrive twice or come out of order. TCP makes it reliable anyway: it numbers every byte, checks what arrived and sends again whatever didn’t.',
        hookBacking: {
          traces: ['lead-1', 'fact-network', 'fact-rides', 'term-seq', 'term-ack', 'term-retransmission'],
        },
        description:
          'It’s like sending a long letter as numbered postcards, with the other side writing back “got everything up to card 12”. If card 13 never comes, you send it again.',
        backing: { analogy: true },
        facts: [
          {
            label: 'Used for',
            value: 'things that must arrive whole: web pages (except over HTTP/3), email, files',
            backing: { traces: ['fact-used'] },
          },
          {
            label: 'Starts with',
            value: 'a three-way handshake',
            backing: { traces: ['term-handshake', 'fact-handshake'] },
          },
          {
            label: 'Promises',
            value: 'every byte, in order, once',
            backing: { traces: ['fact-promises', 'lead-1'] },
          },
          {
            label: 'Pieces',
            value: 'segments, usually up to 1460 bytes of data',
            backing: { traces: ['term-segment', 'fact-segment'] },
          },
          {
            label: 'OSI layer',
            value: '4, transport',
            backing: { traces: ['fact-osi'] },
          },
          {
            label: 'This example',
            value: 'a page from example.net, port 80',
            backing: { traces: ['fact-used', 'fact-ports'] },
          },
        ],
      },
      steps: [
        {
          id: 'three-way-handshake',
          title: 'Three-Way Handshake',
          sub: 'Hello, hello back, OK',
          narrative:
            'Before any data moves, both sides make sure they can hear each other. The laptop says hello and gives a starting number. The server says hello back with its own number and confirms it heard. The laptop confirms too. That’s the **three-way handshake**, and after it there’s a **connection**: an agreed, two-way line.',
          deep: [
            {
              text: 'SYN means synchronize: each side picks a random starting sequence number, so stray or forged pieces don’t fit.',
              cite: [tcp('3.1'), tcp('3.4.1')],
            },
            {
              text: 'SYN-ACK carries the server’s number and acknowledges the laptop’s; the final ACK completes it.',
              cite: [tcp('3.5')],
            },
            {
              text: 'Sending floods of SYNs and never finishing is an attack called a SYN flood.',
              cite: [rfc('rfc-4987', '1'), rfc('rfc-9293', '7')],
            },
          ],
          facts: [
            {
              label: 'From',
              value: '192.168.1.100, port 50422',
              backing: { example: true },
            },
            {
              label: 'To',
              value: '203.0.113.80, port 80',
              backing: { traces: ['fact-ports'] },
            },
            {
              label: 'Messages',
              value: 'SYN, SYN-ACK, ACK',
              backing: { traces: ['term-handshake', 'fact-handshake'] },
            },
            {
              label: 'Costs',
              value: 'one round trip before any data',
              backing: { traces: ['fact-handshake'] },
            },
          ],
          events: [
            ...msgOf(
              'term-handshake',
              'fact-handshake',
              'fact-numbers',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'SYN',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.000s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Hello. My numbers start here.',
              info: 'SYN, seq 0',
              st: 'Saying hello',
            }),
            ...msgOf(
              'term-handshake',
              'fact-handshake',
              'fact-numbers',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'SYN-ACK',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              time: '0.032s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Hello back. I heard you, and mine start here.',
              info: 'SYN-ACK, seq 0, ack 1',
            }),
            ...msgOf(
              'term-handshake',
              'fact-handshake',
              'fact-numbers',
              'term-ack',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'ACK',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.032s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Heard you too. We’re connected.',
              info: 'ACK, ack 1: connection open',
              st: 'Connected',
              known: true,
              conn: ['open', 'laptop>web'],
            }),
          ],
          backing: {
            traces: ['term-handshake', 'fact-handshake', 'fact-numbers', 'term-seq', 'lead-1'],
          },
        },
        {
          id: 'sequence-and-acknowledgement',
          title: 'Sequence and Acknowledgement',
          sub: 'The other side says what arrived',
          narrative:
            'The laptop sends its request for the page, 120 bytes long. TCP numbers every byte, so these are bytes 1 to 120. The server writes back: “got everything up to 120.” That reply is an **acknowledgement**, an **ACK**, and the byte numbers are **sequence numbers**. Nothing counts as delivered until it’s acknowledged.',
          deep: [
            {
              text: 'Sequence numbers count bytes, not pieces, and really start from the random number chosen in the handshake; here they start at 1 to stay readable.',
              cite: [tcp('3.1'), tcp('3.4'), tcp('3.4.1')],
            },
            {
              text: 'The ACK number is the next byte expected, so ACK 121 means bytes 1 to 120 arrived.',
              cite: [tcp('3.1')],
            },
            {
              text: 'If no ACK comes back in time, the sender assumes the piece was lost and sends it again.',
              cite: [tcp('3.10.8'), rfc('rfc-6298', '2', true)],
            },
          ],
          facts: [
            {
              label: 'Request',
              value: 'bytes 1–120',
              backing: { traces: ['term-seq', 'fact-numbers'] },
            },
            {
              label: 'ACK',
              value: '121: “send byte 121 next”',
              backing: { traces: ['term-ack', 'fact-numbers'] },
            },
            {
              label: 'Waits for an ACK',
              value: 'longer than a round trip (by the standard, at least 1 second)',
              backing: { traces: ['fact-timer'] },
            },
            {
              label: 'No ACK in time',
              value: 'send it again',
              backing: { traces: ['fact-timer'] },
            },
          ],
          events: [
            ...msgOf(
              'term-seq',
              'fact-numbers',
              'fact-used',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'BYTES 1–120',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.033s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Here are bytes 1 to 120: a request for the page.',
              info: 'seq 1, 120 bytes (the page request)',
              st: 'Sent the request',
              known: true,
            }),
            ...msgOf(
              'term-ack',
              'fact-numbers',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'ACK 121',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              time: '0.065s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Got everything up to byte 120.',
              info: 'ACK 121',
            }),
          ],
          backing: {
            traces: ['term-seq', 'term-ack', 'fact-numbers', 'fact-used', 'fact-timer', 'lead-1'],
          },
        },
        {
          id: 'packet-loss',
          title: 'Packet Loss',
          sub: 'Piece 2 never arrives',
          narrative:
            'The server sends the page back in three pieces of 1460 bytes, called **segments**. Piece 1 arrives. Piece 2 is dropped on the way, perhaps by a busy router. Piece 3 arrives. The laptop can’t pass piece 3 to the browser yet, or the page would have a hole in it, so it holds on to it and waits.',
          deep: [
            {
              text: 'Routers drop packets when their queues are full. That’s normal, not a fault.',
              cite: [rfc('rfc-7567', '2'), rfc('rfc-5681', '3'), rfc('rfc-2914', '6.1')],
            },
            {
              text: 'The receiver keeps out-of-order segments in a buffer, and its window tells the sender how much more it can take, so a fast sender can’t swamp a slow receiver. That’s flow control.',
              cite: [tcp('3.10.7.4'), tcp('3.8.6'), tcp('3.9.1.4'), rfc('rfc-2018', '3'), rfc('rfc-5681', '3.1')],
            },
          ],
          facts: [
            {
              label: 'Piece 1',
              value: 'bytes 1–1460, arrived',
              backing: { traces: ['fact-segment', 'fact-numbers'] },
            },
            {
              label: 'Piece 2',
              value: 'bytes 1461–2920, lost',
              backing: {
                traces: ['fact-segment', 'fact-numbers', 'fact-loss'],
              },
            },
            {
              label: 'Piece 3',
              value: 'bytes 2921–4380, arrived and held',
              backing: {
                traces: ['fact-segment', 'fact-numbers', 'fact-hold'],
              },
            },
            {
              label: 'Segment size',
              value: 'up to 1460 bytes of data',
              backing: { traces: ['fact-segment'] },
            },
          ],
          events: [
            ...msgOf(
              'term-segment',
              'fact-segment',
              'fact-numbers',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'PIECE 1',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              time: '0.071s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Bytes 1 to 1460, the start of the page.',
              info: 'seq 1, 1460 bytes',
              st: 'Receiving the page',
              rows: [{ key: '1', cells: ['1', '1–1460', 'Arrived'] }],
            }),
            ...msgOf(
              'term-segment',
              'fact-segment',
              'fact-numbers',
              'fact-loss',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'PIECE 2',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              lost: 0.55,
              time: '0.071s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Bytes 1461 to 2920. This one is lost on the way.',
              info: 'seq 1461, 1460 bytes (lost)',
            }),
            ...msgOf(
              'term-segment',
              'fact-segment',
              'fact-numbers',
              'fact-loss',
              'fact-hold',
              'fact-network',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'PIECE 3',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              time: '0.072s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Bytes 2921 to 4380. It arrives, but there’s a gap before it.',
              info: 'seq 2921, 1460 bytes (out of order)',
              st: 'Piece 2 is missing',
              rows: [
                { key: '2', cells: ['2', '1461–2920', 'Missing'], miss: true },
                { key: '3', cells: ['3', '2921–4380', 'Arrived, held'] },
              ],
            }),
          ],
          backing: {
            traces: ['term-segment', 'fact-segment', 'fact-numbers', 'fact-loss', 'fact-hold', 'fact-network'],
          },
        },
        {
          id: 'duplicate-ack-and-sack',
          title: 'Duplicate ACK and SACK',
          sub: '“I’m missing a bit”',
          narrative:
            'The laptop tells the server exactly where it stands: “I still need byte 1461, but I have 2921 to 4380.” It’s the same ACK number it sent after piece 1, so it’s a **duplicate ACK**, and the note about what did arrive is a **selective acknowledgement**, a **SACK**. Now the server knows precisely what to send.',
          deep: [
            {
              text: 'After piece 1 the laptop had already sent ACK 1461.',
              cite: [tcp('3.8'), tcp('3.8.6.3')],
            },
            {
              text: 'Three duplicate ACKs make the sender resend at once instead of waiting for its timer (fast retransmit). Today’s TCPs also use time (RACK): a piece still missing a short while after a later one arrived counts as lost, so here one duplicate ACK is enough.',
              cite: [
                rfc('rfc-5681', '3.2', true),
                rfc('rfc-8985', '1', true),
                rfc('rfc-8985', '3.3.1', true),
                cite('rfc-8985', 'Acknowledgments', {
                  url: 'https://www.rfc-editor.org/rfc/rfc8985.html#name-acknowledgments',
                  defining: true,
                }),
              ],
            },
            {
              text: 'SACK lists the ranges received, so only the gap is resent.',
              cite: [rfc('rfc-2018', '1', true), rfc('rfc-2018', '3', true)],
            },
            {
              text: 'Loss is also a sign of a crowded network, so TCP slows down for a while, then speeds up again: congestion control.',
              cite: [rfc('rfc-5681', '3.2', true), rfc('rfc-5681', '3.1', true), rfc('rfc-5681', '3', true), rfc('rfc-2914', '3.2')],
            },
          ],
          facts: [
            {
              label: 'ACK',
              value: '1461, again',
              backing: { traces: ['term-dupack', 'term-ack', 'fact-numbers'] },
            },
            {
              label: 'SACK',
              value: '2921–4380 received',
              backing: { traces: ['term-sack'] },
            },
            {
              label: 'Means',
              value: 'resend bytes 1461–2920 only',
              backing: { traces: ['term-sack', 'fact-fast', 'lead-1'] },
            },
            {
              label: 'Also',
              value: 'the server sends slower for a while',
              backing: { traces: ['deep-congestion'] },
            },
          ],
          events: [
            ...msgOf(
              'term-dupack',
              'term-sack',
              'term-ack',
              'fact-numbers',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'ACK 1461',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.073s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Still waiting for byte 1461. I already have 2921 to 4380.',
              info: 'ACK 1461 (duplicate), SACK 2921–4380',
            }),
          ],
          backing: {
            traces: ['term-ack', 'term-dupack', 'term-sack', 'fact-numbers', 'fact-fast', 'deep-congestion'],
          },
        },
        {
          id: 'retransmission',
          title: 'Retransmission',
          sub: 'Then the page is whole',
          narrative:
            'The server sends piece 2 again. This time it arrives, the hole is filled, and the laptop passes all 4380 bytes to the browser, in order. Then it confirms: “got everything up to 4380.” Sending a lost piece again is a **retransmission**. The browser never knew anything went wrong.',
          deep: [
            {
              text: 'Only the missing segment was resent, not the whole page.',
              cite: [rfc('rfc-2018', '1', true), rfc('rfc-2018', '3', true)],
            },
            {
              text: 'Without SACK, the sender might resend everything after the gap.',
              cite: [rfc('rfc-2018', '1', true)],
            },
            {
              text: 'Retransmission costs about one extra round trip, and loss also makes TCP slow down, which is why lossy networks are slow even when nothing is lost for good.',
              cite: [rfc('rfc-8985', '1.1'), rfc('rfc-2018', '1'), rfc('rfc-5681', '3.2')],
            },
          ],
          facts: [
            {
              label: 'Resent',
              value: 'bytes 1461–2920',
              backing: {
                traces: ['term-retransmission', 'fact-fast', 'fact-numbers'],
              },
            },
            {
              label: 'ACK',
              value: '4381: all 4380 bytes in',
              backing: { traces: ['term-ack', 'fact-numbers'] },
            },
            {
              label: 'To the browser',
              value: 'all 4380 bytes, in order',
              backing: { traces: ['fact-hold', 'lead-1'] },
            },
            {
              label: 'Extra time',
              value: 'about one round trip',
              backing: { traces: ['fact-cost'] },
            },
          ],
          events: [
            ...msgOf(
              'term-retransmission',
              'fact-fast',
              'term-seq',
              'fact-numbers',
              'fact-segment',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'PIECE 2',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              time: '0.106s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'Bytes 1461 to 2920, sent again.',
              info: 'seq 1461, 1460 bytes (retransmission)',
              rows: [
                { key: '2', cells: ['2', '1461–2920', 'Arrived (resent)'] },
                { key: '3', cells: ['3', '2921–4380', 'Arrived'] },
              ],
            }),
            ...msgOf(
              'term-ack',
              'fact-numbers',
              'fact-hold',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'ACK 4381',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.106s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Got everything up to byte 4380.',
              info: 'ACK 4381',
              st: 'Page complete',
              done: true,
            }),
          ],
          backing: {
            traces: ['term-retransmission', 'fact-fast', 'fact-hold', 'fact-cost', 'term-ack', 'fact-numbers', 'lead-1', 'why-1'],
          },
        },
        {
          id: 'connection-teardown',
          title: 'Connection Teardown',
          sub: 'Saying goodbye',
          narrative:
            'With the page done, the laptop closes the line politely: “I’m finished.” The server agrees and says it’s finished too, and the laptop confirms. Closing on purpose with **FIN** messages means neither side is left waiting for data that will never come.',
          deep: [
            {
              text: 'Each direction closes on its own, so a close is often four messages (FIN, ACK, FIN, ACK); here the server combines its ACK and its FIN.',
              cite: [tcp('3.6.1'), tcp('3.6'), tcp('3.10.7.4')],
            },
            {
              text: 'The side that closes first waits a short while (TIME-WAIT) in case its last ACK got lost.',
              cite: [tcp('3.10.7.4'), tcp('3.6.1')],
            },
            {
              text: 'An RST message ends a connection abruptly instead.',
              cite: [tcp('3.6')],
            },
          ],
          facts: [
            {
              label: 'Messages',
              value: 'FIN, FIN-ACK, ACK',
              backing: { traces: ['term-fin', 'fact-close'] },
            },
            {
              label: 'Each direction',
              value: 'closes on its own',
              backing: { traces: ['fact-close'] },
            },
            {
              label: 'Abrupt end',
              value: 'RST',
              backing: { traces: ['fact-close', 'fact-flags'] },
            },
            {
              label: 'Afterwards',
              value: 'TIME-WAIT, twice the 2-minute segment lifetime (4 minutes by the standard)',
              backing: { traces: ['fact-timewait'] },
            },
          ],
          events: [
            ...msgOf(
              'term-fin',
              'fact-close',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'FIN',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.204s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'I’m finished.',
              info: 'FIN',
            }),
            ...msgOf(
              'term-fin',
              'fact-close',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'FIN-ACK',
              from: 'web',
              to: 'laptop',
              proto: 'TCP',
              via: 'IP',
              kind: 'response',
              time: '0.236s',
              src: WEB,
              dst: LAPTOP,
              size: '—',
              sum: 'OK. I’m finished too.',
              info: 'FIN, ACK',
            }),
            ...msgOf(
              'term-fin',
              'term-ack',
              'fact-close',
              'fact-rides',
              'fact-ports',
              'lead-1',
            )({
              tag: 'ACK',
              from: 'laptop',
              to: 'web',
              proto: 'TCP',
              via: 'IP',
              kind: 'request',
              time: '0.236s',
              src: LAPTOP,
              dst: WEB,
              size: '—',
              sum: 'Goodbye.',
              info: 'ACK: connection closed',
              st: 'Closed, page complete',
              done: true,
              conn: ['close', 'laptop>web'],
            }),
          ],
          backing: {
            traces: ['term-fin', 'fact-close', 'fact-timewait', 'fact-flags', 'lead-1'],
          },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'TCP turned a network that loses things into a line you can count on: every byte numbered, every arrival confirmed, and the one lost piece sent again.',
            cite: [tcp('2.2'), tcp('3.4')],
          },
        ],
        terms: [
          {
            id: 'term-handshake',
            idea: 'Hello, hello back, OK',
            name: 'Three-way handshake',
            cite: [tcp('3.5'), tcp('3.4.1')],
          },
          {
            id: 'term-segment',
            idea: 'One piece of the data',
            name: 'Segment',
            cite: [tcp('4')],
          },
          {
            id: 'term-seq',
            idea: 'The number on every byte',
            name: 'Sequence number',
            cite: [tcp('3.4')],
          },
          {
            id: 'term-ack',
            idea: '“Got everything up to here”',
            name: 'ACK',
            cite: [tcp('4'), tcp('3.4')],
          },
          {
            id: 'term-dupack',
            idea: 'The same ACK again: something’s missing',
            name: 'Duplicate ACK',
            cite: [rfc('rfc-5681', '2', true), rfc('rfc-5681', '3.2')],
          },
          {
            id: 'term-sack',
            idea: '“Here’s what did arrive”',
            name: 'SACK',
            cite: [rfc('rfc-2018', '1', true), rfc('rfc-2018', '3', true)],
          },
          {
            id: 'term-retransmission',
            idea: 'Sending a lost piece again',
            name: 'Retransmission',
            cite: [tcp('3.8'), tcp('2.2')],
          },
          {
            id: 'term-fin',
            idea: 'Closing the line on purpose',
            name: 'FIN',
            cite: [tcp('3.1'), tcp('4'), tcp('3.6')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Handshake', 'Sequence', 'Acknowledge', 'Retransmit', 'Teardown'],
          note: 'A TCP connection goes this way, though Retransmit comes only when a piece is lost, and an RST can end it abruptly instead. The middle three repeat for as long as data flows.',
          cite: [tcp('3.5'), tcp('3.4'), tcp('3.8'), tcp('3.6')],
        },
        why: [
          {
            id: 'why-1',
            text: 'Without TCP, every app would have to notice lost pieces and fix them itself. With it, the browser just asks for a page and gets all of it, in order, even though the network underneath dropped part of it.',
            cite: [rfc('rfc-8085', '3.3'), tcp('2.2')],
          },
        ],
        deep: [
          {
            id: 'deep-speed',
            text: 'TCP also manages speed. Flow control stops a fast sender swamping a slow receiver (the window).',
            cite: [tcp('3.8.6'), tcp('3.9.1.4'), rfc('rfc-5681', '3.1')],
          },
          {
            id: 'deep-congestion',
            text: 'Congestion control backs off when packets are lost and speeds up when they aren’t, so everyone shares the network fairly.',
            cite: [rfc('rfc-5681', '3.2', true), rfc('rfc-5681', '3.1', true), rfc('rfc-2914', '3.2'), rfc('rfc-8085', '1')],
          },
          {
            id: 'deep-header',
            text: 'The header is 20 to 60 bytes: ports, sequence and ACK numbers, flags (such as SYN, ACK, FIN and RST), window and checksum.',
            cite: [tcp('3.1'), tcp('3.7.1'), rfc('rfc-2018', '3')],
          },
        ],
        facts: [
          {
            id: 'fact-flags',
            label: 'Some flags',
            value: 'SYN, ACK, FIN, RST, PSH, URG',
            cite: [tcp('3.1')],
          },
          {
            id: 'fact-header',
            label: 'Header',
            value: '20–60 bytes',
            cite: [tcp('3.1'), tcp('3.7.1'), rfc('rfc-2018', '3')],
          },
          {
            id: 'fact-ports',
            label: 'Common ports',
            value: '80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP',
            cite: [IANA_PORTS],
          },
          {
            id: 'fact-vs-udp',
            label: 'Versus UDP',
            value: 'slower to start, but nothing goes missing',
            cite: [rfc('rfc-8085', '1'), rfc('rfc-8085', '3'), tcp('3.8')],
          },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 9293, Transmission Control Protocol',
            cite: [RFC9293_ABSTRACT],
          },
          {
            id: 'fact-rides',
            label: 'Rides on',
            value: 'IP; each segment is sent inside an IP datagram',
            cite: [tcp('2.2')],
          },
          {
            id: 'fact-used',
            label: 'Used for',
            value: 'things that must arrive whole: web pages (except over HTTP/3), email, files',
            cite: [
              rfc('rfc-9110', '4.3.2', true),
              rfc('rfc-9112', '9', true),
              rfc('rfc-5321', '4.5.4.2', true),
              rfc('rfc-959', '8', true),
              rfc('rfc-8085', '3.3'),
              tcp('2.2'),
              ...HTTP3,
            ],
          },
          {
            id: 'fact-promises',
            label: 'Promises',
            value: 'every byte, in order, once',
            cite: [tcp('2.2'), tcp('3.4')],
          },
          {
            id: 'fact-segment',
            label: 'Pieces',
            value: 'segments, usually up to 1460 bytes of data',
            cite: [tcp('3.7.1'), AZURE_MSS],
          },
          {
            id: 'fact-osi',
            label: 'OSI layer',
            value: '4, transport',
            cite: OSI_L4,
          },
          {
            id: 'fact-network',
            label: 'The network',
            value: 'carries pieces and makes no promises: a piece can be lost, arrive twice or come out of order',
            cite: [rfc('rfc-791', '1.4', true), tcp('3.8'), rfc('rfc-8085', '3.3'), rfc('rfc-5681', '3.2')],
          },
          {
            id: 'fact-handshake',
            label: 'Opens with',
            value:
              'a three-way handshake (SYN, SYN-ACK, ACK), which sets up a connection, an agreed two-way line; data is handed over only after it, one round trip later',
            cite: [tcp('3.5'), tcp('4'), tcp('2.2'), rfc('rfc-7413', '1')],
          },
          {
            id: 'fact-numbers',
            label: 'Starting numbers',
            value:
              'Each side’s starting number is chosen in the handshake and is hard to guess; the example shows it as 0. The SYN uses that number up, so the first byte of data is number 1, and an ACK names the next byte expected.',
            cite: [tcp('3.1'), tcp('3.4'), tcp('3.4.1')],
          },
          {
            id: 'fact-timer',
            label: 'No ACK in time',
            value:
              'when the sender’s timer runs out it sends the piece again; the timer is longer than a round trip, by the standard at least 1 second',
            cite: [rfc('rfc-6298', '2', true), rfc('rfc-8985', '1.1'), tcp('3.10.8')],
          },
          {
            id: 'fact-loss',
            label: 'A lost piece',
            value:
              'can be lost on the way, perhaps dropped by a busy router whose queue is full. That’s normal, not a fault: TCP takes it as a sign of a crowded network.',
            cite: [rfc('rfc-7567', '2'), tcp('3.8'), rfc('rfc-5681', '3', true), rfc('rfc-2914', '6.1')],
          },
          {
            id: 'fact-hold',
            label: 'Held pieces',
            value: 'TCP delivers bytes in order, so when one piece is lost, the data behind it waits until it is sent again.',
            cite: [tcp('2.2'), tcp('3.10.7.4')],
          },
          {
            id: 'fact-fast',
            label: 'Fast resend',
            value:
              'Three duplicate ACKs make the sender resend at once instead of waiting for its timer (fast retransmit). Today’s TCPs also use time: once a piece sent later has arrived, an earlier piece still missing a short while after is treated as lost and sent again (RACK). So here one duplicate ACK with its SACK is enough.',
            cite: [
              rfc('rfc-5681', '3.2', true),
              rfc('rfc-8985', '1', true),
              rfc('rfc-8985', '3.3.1', true),
              rfc('rfc-8985', '3.1', true),
              cite('rfc-8985', 'Acknowledgments', {
                url: 'https://www.rfc-editor.org/rfc/rfc8985.html#name-acknowledgments',
                defining: true,
              }),
            ],
          },
          {
            id: 'fact-cost',
            label: 'Retransmission',
            value:
              'costs about one extra round trip, and loss also makes TCP slow down, which is why lossy networks are slow even when nothing is lost for good.',
            cite: [rfc('rfc-8985', '1.1'), rfc('rfc-2018', '1'), rfc('rfc-5681', '3.2')],
          },
          {
            id: 'fact-close',
            label: 'Closing',
            value:
              'each direction closes on its own: each side sends a FIN (“no more data from me”) and the other ACKs it, often four messages; a side can send its ACK with its own FIN (FIN-ACK), making three. An RST ends a connection at once.',
            cite: [tcp('3.6.1'), tcp('3.6'), tcp('3.10.7.4'), tcp('3.1'), tcp('3.8')],
          },
          {
            id: 'fact-timewait',
            label: 'TIME-WAIT',
            value: 'twice the 2-minute segment lifetime (4 minutes by the standard)',
            cite: [tcp('3.4.2'), tcp('3.10.7.4')],
          },
        ],
      },
      practice: [
        {
          id: 'what-is-resent',
          prompt: 'Piece 2 of 3 is lost on the way. What does the server send again?',
          options: [
            {
              text: 'All three pieces.',
              feedback: 'Not quite. The laptop said exactly what it had, so the server only resends the gap.',
              cite: [rfc('rfc-2018', '1', true), rfc('rfc-2018', '3', true)],
            },
            {
              text: 'Only piece 2.',
              feedback: 'Right. The duplicate ACK and the SACK told it piece 2 was the only gap.',
              cite: [rfc('rfc-2018', '1', true), rfc('rfc-5681', '3.2')],
            },
            {
              text: 'Nothing. The page just has a gap.',
              feedback: 'Not quite. TCP never hands over a page with a hole in it. It resends the missing piece.',
              cite: [tcp('2.2'), tcp('3.10.7.4'), tcp('3.8')],
            },
          ],
          answer: 1,
        },
        {
          id: 'handshake-for',
          prompt: 'What is the three-way handshake for?',
          options: [
            {
              text: 'Both sides confirm they can hear each other and agree on starting numbers.',
              feedback: 'Yes. After it, both know the line works both ways.',
              cite: [tcp('3.4.1'), tcp('3.5')],
            },
            {
              text: 'It encrypts the connection.',
              feedback: 'Not quite. Encryption is TLS’s job, after the handshake. TCP’s handshake just opens the line.',
              cite: [rfc('rfc-9293', '7'), rfc('rfc-9110', '4.3.3')],
            },
            {
              text: 'It finds the server’s address.',
              feedback: 'Not quite. That’s DNS, before TCP starts. The handshake checks both sides can hear each other.',
              cite: [rfc('rfc-1034', '5.2.1', true), rfc('rfc-9110', '4.3.2', true), tcp('3.4.1')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
