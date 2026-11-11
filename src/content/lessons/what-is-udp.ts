import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * UDP, lesson 4 of How the Internet Works’ 14. In a voice call, the laptop sends a slice of sound every 20
 * milliseconds with no handshake and no guarantee. Packet 5 is lost and nobody sends it again; Sam’s voice comes back
 * the same way, and the call app, not UDP, copes with the gap. Both ways count their packets from 1, so the table
 * hides its key: it tells its rows apart by the mockup’s own names for them, in a field no column shows.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), changed only where a source
 * does not state them. RFC 768 defines UDP, so its citations are marked as the defining standard.
 */

// ---------------------------------------------------------------- citations

const RFC768 = 'https://www.rfc-editor.org/rfc/rfc768.html';
/** RFC 768's html has no section ids, so each section is cited by a text fragment that starts in it. */
const rfc768 = (section: string, fragment: string) => cite('rfc-768', section, { url: `${RFC768}#:~:text=${fragment}`, defining: true });
const RFC768_INTRO = rfc768('Introduction', 'transaction%20oriented,%20and%20delivery');
const RFC768_DEFINED = rfc768('Introduction', 'This%20User%20Datagram');
const RFC768_FIELDS = rfc768('Fields', 'Source%20Port%20is%20an%20optional%20field');
const RFC768_LENGTH = rfc768('Fields', 'minimum%20value%20of%20the%20length');

/** RFC 1122 has no ids below its top-level sections, so its section 4.1.1 is cited by the page it starts on (77). */
const RFC1122_UDP = cite('rfc-1122', '4.1.1', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-77' });

const NIST_2_1 = cite('nist-sp800-77r1', '2.1', { url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf#page=20' });

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

const rfc8085 = (section: string) => cite('rfc-8085', section);
const rfc3550 = (section: string, defining?: true) => cite('rfc-3550', section, defining ? { defining } : {});
const rfc3551 = (section: string) => cite('rfc-3551', section);
const rfc9293 = (section: string) => cite('rfc-9293', section);
const rfc9000 = (section: string) => cite('rfc-9000', section, { defining: true });

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100:50900';
const CALL = '203.0.113.90:16384';

const voice: TableDef = {
  id: 'voice',
  title: 'Voice packets',
  by: 'in both directions',
  columns: [
    { key: 'packet', label: 'Packet' },
    { key: 'way', label: 'Way', prose: true },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'id',
  hiddenKey: true,
  initialRows: [],
  empty: 'Nothing yet. The call hasn’t started.',
};

const mockup = messagesFor(voice);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-udp',
  title: 'UDP',
  subtitle: 'Quick, no guarantees',
  level: 'beginner',
  certTags: [],
  summary:
    'UDP sends a message and forgets it: no hello, no numbering, no resending. That sounds careless, but a call or a quick lookup doesn’t need all the service TCP gives, and UDP adds almost nothing on top of IP.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'lead-2', 'why-1'] },
  units: [
    {
      id: 'udp',
      name: 'UDP',
      fullName: 'User Datagram Protocol',
      purpose: 'Quick, no guarantees',
      group: 'core',
      // No source this lesson may cite puts UDP at an OSI layer: X.200 defines layer 4, the Transport Layer, but never
      // names UDP, and the sources about UDP use the internet's own four layers (the Layer fact).
      osi: 'spans',
      backing: { traces: ['fact-5', 'why-1'] },
      scene: {
        title: 'Your voice goes out in small packets, no promises',
        views: ['network', 'sequence'],
        layers: ['udp:call'],
        labels: { laptop: 'In a call with Sam', url: 'Call' },
        start: [],
        panel: { type: 'table', table: voice },
        log: eventLog({ kind: 'dropped', label: 'Lost on the way' }),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'call', label: 'Voice server', addr: '203.0.113.90' },
        ],
        backing: { traces: ['lead-1', 'lead-3'] },
      },
      overview: {
        hook: 'UDP sends a message and forgets it: no hello, no numbering, no resending. That sounds careless, but a call or a quick lookup doesn’t need all the service TCP gives, and UDP adds almost nothing on top of IP.',
        hookBacking: { traces: ['lead-1', 'lead-2', 'why-1', 'deep-1'] },
        description:
          'TCP is like recorded delivery: signed for, and sent again if it goes missing. UDP is like a walkie-talkie. You just speak, and if a word crackles you carry on rather than go back. Here your laptop is in a voice call through a voice server, sending a small packet of sound every 20 milliseconds.',
        backing: { traces: ['lead-1', 'lead-2', 'lead-3'] },
        facts: [
          { label: 'Used for', value: 'calls, video, DNS, DHCP', backing: { traces: ['why-1', 'deep-2', 'deep-3'] } },
          { label: 'Starts with', value: 'nothing: no handshake', backing: { traces: ['lead-1', 'term-connectionless'] } },
          { label: 'Promises', value: 'none: no order, no resending', backing: { traces: ['lead-1', 'lead-2', 'deep-1'] } },
          { label: 'Header', value: '8 bytes: ports, length, checksum', backing: { traces: ['fact-1', 'deep-1'] } },
          { label: 'Layer', value: 'transport, in the internet model', backing: { traces: ['fact-6'] } },
          { label: 'This example', value: 'a voice call through 203.0.113.90', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'connectionless-send',
          title: 'Connectionless Send',
          sub: 'Just send it',
          narrative:
            'You start talking, and the call app sends the first slice of your voice straight away. There’s no hello and no waiting for “I hear you”: the very first packet already carries sound. That’s **connectionless**: UDP never sets up a line. Each packet is a **datagram**, a message that travels on its own, with addresses on it, like a postcard.',
          deep: [
            {
              text: 'The UDP header is four fields of 2 bytes each: source port, destination port, length and checksum. There’s no sequence number, no ACK and no window. The call app can add a small header of its own inside, such as RTP, with a sequence number and a timestamp, so the receiver can put packets in order and play them on time.',
              cite: [RFC768_LENGTH, rfc3550('5.1'), rfc3550('2.1'), rfc3551('4.1')],
            },
          ],
          facts: [
            { label: 'From', value: '192.168.1.100, port 50900', backing: { example: true } },
            { label: 'To', value: '203.0.113.90, port 16384', backing: { example: true } },
            { label: 'Handshake', value: 'none', backing: { traces: ['lead-1', 'term-connectionless'] } },
            { label: 'Each packet', value: '20 ms of sound', backing: { traces: ['lead-3'] } },
          ],
          events: [
            ...msgOf(
              'lead-1',
              'lead-3',
            )({
              tag: 'VOICE 1',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              time: '0.000s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: '20 milliseconds of your voice. No hello first.',
              info: 'RTP over UDP, seq 1, 20 ms of audio',
              st: 'Talking',
              rows: [{ key: 'y1', cells: ['1', 'You → server', 'Arrived'] }],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-3', 'term-connectionless', 'term-datagram'] },
        },
        {
          id: 'datagram-stream',
          title: 'Datagram Stream',
          sub: 'A steady stream, like a voice call',
          narrative:
            'While you talk, a new packet leaves every 20 milliseconds, fifty a second. Each one travels on its own. UDP sends no “got it” for any of them, and the laptop never waits to hear. A steady flow of datagrams like this is just what a call sends, and because nothing waits, the packets keep coming.',
          deep: [
            {
              text: 'Fifty packets a second is what a packet every 20 ms comes to. The packet interval sets the lowest delay a call can have: longer packets mean less header overhead, but more delay, and a loss is more noticeable. Packets also arrive after uneven delays, so the receiver uses the timestamps to rebuild the original timing.',
              cite: [rfc3551('4.2'), rfc3550('2.1')],
            },
          ],
          facts: [
            { label: 'Rate', value: 'one packet every 20 ms', backing: { traces: ['lead-3'] } },
            { label: 'Replies', value: 'no “got it” for each packet', backing: { traces: ['deep-1', 'lead-2'] } },
            { label: 'Timing', value: 'rebuilt by the receiver from timestamps', backing: { traces: ['lead-3'] } },
          ],
          events: [
            ...msgOf(
              'lead-3',
              'term-datagram',
            )({
              tag: 'VOICE 2',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.020s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: '20 milliseconds of your voice.',
              info: 'RTP over UDP, seq 2, 20 ms of audio',
              rows: [{ key: 'y2', cells: ['2', 'You → server', 'Arrived'] }],
            }),
            ...msgOf(
              'lead-3',
              'term-datagram',
            )({
              tag: 'VOICE 3',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.040s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: '20 milliseconds of your voice.',
              info: 'RTP over UDP, seq 3, 20 ms of audio',
              rows: [{ key: 'y3', cells: ['3', 'You → server', 'Arrived'] }],
            }),
            ...msgOf(
              'lead-3',
              'term-datagram',
            )({
              tag: 'VOICE 4',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.060s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: '20 milliseconds of your voice.',
              info: 'RTP over UDP, seq 4, 20 ms of audio',
              rows: [{ key: 'y4', cells: ['4', 'You → server', 'Arrived'] }],
            }),
          ],
          backing: { traces: ['lead-3', 'term-datagram', 'deep-1', 'lead-2'] },
        },
        {
          id: 'packet-loss-no-retransmission',
          title: 'Packet Loss, No Retransmission',
          sub: 'One gets lost, nobody resends',
          narrative:
            'Packet 5 is dropped on the way. With TCP, it would be sent again. With UDP, nobody resends it: there’s no ACK to miss, and resending is left to the app. Packet 6 follows 20 milliseconds later as if nothing had happened.',
          deep: [
            {
              text: 'UDP has no retransmission at all; a loss only shows up as a gap in the app’s own sequence numbers. UDP also has no congestion control, so an app that doesn’t use a congestion-controlled transport has to control its own sending rate.',
              cite: [rfc8085('3.3'), rfc8085('1'), rfc8085('3.1'), rfc3550('2.1'), RFC1122_UDP],
            },
          ],
          facts: [
            { label: 'Packet 5', value: 'lost, never resent', backing: { traces: ['lead-2', 'term-no-resend'] } },
            { label: 'Packet 6', value: 'sent next, 20 ms later', backing: { traces: ['lead-3'] } },
            { label: 'Who notices', value: 'only the app, from its own numbers', backing: { traces: ['lead-2', 'lead-3'] } },
          ],
          events: [
            ...msgOf(
              'lead-3',
              'lead-2',
              'term-no-resend',
            )({
              tag: 'VOICE 5',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              fast: true,
              lost: 0.5,
              time: '0.080s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: '20 milliseconds of your voice. This one is lost on the way.',
              info: 'RTP over UDP, seq 5 (lost)',
              rows: [{ key: 'y5', cells: ['5', 'You → server', 'Lost'], miss: true }],
            }),
            ...msgOf(
              'lead-3',
              'lead-2',
              'term-no-resend',
            )({
              tag: 'VOICE 6',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '0.100s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: 'The next 20 milliseconds, sent as usual. Nobody resends packet 5.',
              info: 'RTP over UDP, seq 6, 20 ms of audio',
              st: 'Talking, one packet lost',
              rows: [{ key: 'y6', cells: ['6', 'You → server', 'Arrived'] }],
            }),
          ],
          backing: { traces: ['lead-2', 'lead-3', 'term-no-resend', 'deep-1'] },
        },
        {
          id: 'two-way-datagrams',
          title: 'Two-Way Datagrams',
          sub: 'The other side talks back',
          narrative:
            'Sam answers, and Sam’s voice comes back the same way: packets from the voice server to your laptop, every 20 milliseconds, with no handshake and no guarantee. Each side simply sends to the other’s address and port, and listens on its own.',
          deep: [
            {
              text: 'The server sends from the port you sent to (16384) back to the port you sent from (50900). Your home router, if it does NAT, remembers that pair for a while, so replies can get back in; a NAT must not forget a UDP pair in less than two minutes, except for some well-known ports. During silences, some apps send small keep-alive messages to keep that state open.',
              cite: [RFC768_FIELDS, rfc8085('3.5'), cite('rfc-4787', '4.3')],
            },
          ],
          facts: [
            { label: 'From', value: '203.0.113.90, port 16384', backing: { example: true } },
            { label: 'To', value: '192.168.1.100, port 50900', backing: { example: true } },
            { label: 'Same rules', value: 'no handshake, no ACK', backing: { traces: ['lead-1', 'deep-1'] } },
            { label: 'Replies go to', value: 'the port the packets came from', backing: { traces: ['term-port'] } },
          ],
          events: [
            ...msgOf(
              'lead-3',
              'term-port',
            )({
              tag: 'SAM 1',
              from: 'call',
              to: 'laptop',
              proto: 'UDP',
              via: 'IP',
              kind: 'response',
              time: '0.104s',
              src: CALL,
              dst: LAPTOP,
              size: '172 B',
              sum: '20 milliseconds of Sam’s voice.',
              info: 'RTP over UDP, seq 1, 20 ms of audio',
              st: 'Sam is talking',
              known: true,
              rows: [{ key: 's1', cells: ['1', 'Server → you', 'Arrived'] }],
            }),
            ...msgOf(
              'lead-3',
              'term-port',
            )({
              tag: 'SAM 2',
              from: 'call',
              to: 'laptop',
              proto: 'UDP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.124s',
              src: CALL,
              dst: LAPTOP,
              size: '172 B',
              sum: '20 milliseconds of Sam’s voice.',
              info: 'RTP over UDP, seq 2, 20 ms of audio',
              rows: [{ key: 's2', cells: ['2', 'Server → you', 'Arrived'] }],
            }),
            ...msgOf(
              'lead-3',
              'term-port',
            )({
              tag: 'SAM 3',
              from: 'call',
              to: 'laptop',
              proto: 'UDP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '0.144s',
              src: CALL,
              dst: LAPTOP,
              size: '172 B',
              sum: '20 milliseconds of Sam’s voice.',
              info: 'RTP over UDP, seq 3, 20 ms of audio',
              rows: [{ key: 's3', cells: ['3', 'Server → you', 'Arrived'] }],
            }),
          ],
          backing: { traces: ['lead-1', 'lead-3', 'term-port', 'deep-1'] },
        },
        {
          id: 'application-level-recovery',
          title: 'Application-Level Recovery',
          sub: 'The app decides what to do',
          narrative:
            'UDP never fixes anything, so the call app does. On Sam’s side, the app can tell from the sequence numbers that packet 5 is missing. Then the server sends your app a short **report**: “1 of your last 6 packets was lost.” Your app decides what to do about it, here switching to a setting that copes better with loss. Choosing how to cope is the app’s job.',
          deep: [
            {
              text: 'RTCP receiver reports carry the fraction of packets lost and the jitter, and the sender can work out the round-trip time from them. The sender may change its transmissions based on them, for example its encoding. Some apps want full reliability over UDP and build it themselves: QUIC has its own acknowledgments and resending.',
              cite: [rfc3550('6.4.1', true), rfc3550('6', true), rfc9000('13')],
            },
          ],
          facts: [
            { label: 'Gap noticed from', value: 'the sequence numbers', backing: { traces: ['lead-3'] } },
            { label: 'Report', value: 'RTCP: how well the packets arrived', backing: { traces: ['term-report'] } },
            { label: 'The app’s fix', value: 'adapts, for example its encoding', backing: { traces: ['term-report', 'lead-2'] } },
            { label: 'Reliable over UDP', value: 'QUIC builds its own', backing: { traces: ['deep-4'] } },
          ],
          events: [
            ...msgOf(
              'term-report',
              'lead-3',
            )({
              tag: 'REPORT',
              from: 'call',
              to: 'laptop',
              proto: 'UDP',
              via: 'IP',
              kind: 'response',
              time: '0.160s',
              src: CALL,
              dst: LAPTOP,
              size: '84 B',
              sum: 'Report: 1 of your last 6 packets was lost.',
              info: 'RTCP receiver report: 1 of 6 lost, jitter 4 ms',
              rows: [{ key: 'y5', cells: ['5', 'You → server', 'Lost, noticed by Sam’s app'], miss: true }],
            }),
            ...msgOf(
              'term-report',
              'lead-2',
            )({
              tag: 'VOICE 7',
              from: 'laptop',
              to: 'call',
              proto: 'UDP',
              via: 'IP',
              kind: 'request',
              time: '0.180s',
              src: LAPTOP,
              dst: CALL,
              size: '172 B',
              sum: 'Your voice at a setting that copes better with loss.',
              info: 'RTP over UDP, seq 7, adapted encoding',
              st: 'Call adjusted',
              done: true,
              rows: [{ key: 'y7', cells: ['7', 'You → server', 'Arrived'] }],
            }),
          ],
          backing: { traces: ['lead-2', 'lead-3', 'term-report', 'deep-4'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'UDP sent your voice with no setup first and no guarantee that it arrived.',
            cite: [RFC768_INTRO, rfc8085('1')],
          },
          {
            id: 'lead-2',
            text: 'When a packet was lost, UDP did not send it again, as TCP would have. The app, not UDP, decided what to do.',
            cite: [rfc8085('3.3'), RFC1122_UDP, rfc9293('3.8.1')],
          },
          {
            id: 'lead-3',
            text: 'A call app sends its sound in small chunks, say 20 milliseconds each, one chunk to a packet. It can add a small header of its own, such as RTP, with a sequence number and a timestamp, so the receiver can spot gaps, put packets in order and play them on time.',
            cite: [rfc3550('2.1'), rfc3550('1'), rfc3551('4.2'), rfc3551('4.1')],
          },
        ],
        terms: [
          {
            id: 'term-connectionless',
            idea: 'Sending with no setup first',
            name: 'Connectionless',
            cite: [rfc8085('1'), NIST_2_1],
          },
          {
            id: 'term-datagram',
            idea: 'One message that travels on its own',
            name: 'Datagram',
            cite: [RFC768_INTRO, cite('rfc-791', '1.4')],
          },
          {
            id: 'term-port',
            idea: 'Which app on the computer it’s for',
            name: 'Port',
            cite: [RFC768_FIELDS, RFC1122_UDP],
          },
          {
            id: 'term-no-resend',
            idea: 'Lost, and not sent again',
            name: 'No retransmission',
            cite: [rfc8085('3.3'), RFC1122_UDP],
          },
          {
            id: 'term-report',
            idea: 'The app’s own note about how it went',
            name: 'Report (RTCP)',
            cite: [rfc3550('6', true), rfc3550('6.4.1', true)],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Connectionless Send', 'Datagram Stream', 'No Retransmission', 'App Recovery'],
          note: 'UDP only sends. Order, gaps and speed are all up to the app.',
          cite: [rfc8085('3.3'), rfc8085('1'), RFC1122_UDP],
        },
        why: [
          {
            id: 'why-1',
            text: 'A call, a live video or a quick lookup doesn’t need all the service TCP gives. UDP adds almost nothing on top of IP, so it can be very efficient, and each app decides how much checking it needs.',
            cite: [RFC1122_UDP, rfc8085('1'), rfc3550('1'), cite('rfc-1035', '4.2.1')],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'The UDP header is four fields of 2 bytes each: source port, destination port, length and checksum. A TCP header also carries sequence and acknowledgment numbers and a window; UDP has none of them.',
            cite: [RFC768_LENGTH, rfc9293('3.1')],
          },
          {
            id: 'deep-2',
            text: 'UDP can also send one message to many machines at once (broadcast and multicast), which TCP can’t. DHCP relies on this: a client broadcasts its first message.',
            cite: [RFC1122_UDP, rfc8085('4'), cite('rfc-2131', '3.1', { defining: true }), cite('rfc-2131', '4.1')],
          },
          {
            id: 'deep-3',
            text: 'Well-known UDP ports: 53 DNS, 67 and 68 DHCP, 123 NTP.',
            cite: [IANA_PORTS, cite('rfc-1035', '4.2.1'), cite('rfc-2131', '4.1')],
          },
          {
            id: 'deep-4',
            text: 'Some apps want full reliability over UDP and build it themselves. QUIC has its own acknowledgments and resending.',
            cite: [rfc9000('13'), rfc8085('3.3')],
          },
        ],
        facts: [
          { id: 'fact-1', label: 'Header', value: '8 bytes', cite: [RFC768_LENGTH] },
          { id: 'fact-2', label: 'Gives', value: 'ports and a checksum, nothing more', cite: [RFC1122_UDP, RFC768_FIELDS] },
          { id: 'fact-3', label: 'Ports', value: '53 DNS, 67/68 DHCP, 123 NTP', cite: [IANA_PORTS, cite('rfc-1035', '4.2.1'), cite('rfc-2131', '4.1')] },
          { id: 'fact-4', label: 'Versus TCP', value: 'less setup, but no guarantee', cite: [rfc8085('1'), RFC768_INTRO, RFC1122_UDP] },
          { id: 'fact-5', label: 'Defined in', value: 'RFC 768, User Datagram Protocol', cite: [RFC768_DEFINED] },
          { id: 'fact-6', label: 'Layer', value: 'transport, in the internet model', cite: [NIST_2_1, RFC1122_UDP] },
        ],
      },
      practice: [
        {
          id: 'lost-packet',
          prompt: 'Packet 5 of a voice call is lost. What does UDP do?',
          options: [
            { text: 'Sends it again.', feedback: 'Not quite. UDP never resends a lost packet.', cite: [rfc8085('3.3'), RFC1122_UDP] },
            {
              text: 'Pauses the call until it arrives.',
              feedback: 'Not quite. UDP has no way to pause for a lost packet. Packet 6 is sent as usual.',
              cite: [rfc8085('3.3'), RFC1122_UDP],
            },
            {
              text: 'Nothing. The app copes with the gap.',
              feedback: 'Right. UDP doesn’t resend; the call app deals with the gap or adjusts.',
              cite: [rfc8085('3.3'), RFC1122_UDP, rfc3550('6')],
            },
          ],
          answer: 2,
        },
        {
          id: 'why-udp',
          prompt: 'Why do calls use UDP instead of TCP?',
          options: [
            {
              text: 'A call doesn’t need all the service TCP gives, and UDP adds almost nothing on top of IP.',
              feedback: 'Yes. With no handshake and no resending, UDP stays light, and the app decides how much checking it needs.',
              cite: [RFC1122_UDP, rfc8085('1')],
            },
            {
              text: 'UDP is encrypted.',
              feedback: 'Not quite. UDP does not provide communications security. Apps that need it use other protocols.',
              cite: [rfc8085('6'), RFC1122_UDP],
            },
            {
              text: 'UDP never loses packets.',
              feedback: 'Not quite. UDP does not guarantee delivery, and it doesn’t resend what is lost.',
              cite: [RFC768_INTRO, rfc8085('3.3')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
