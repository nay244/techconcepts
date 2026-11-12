import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * ICMP, lesson 8 of How the Internet Works’ 14. Ping asks example.net whether it is there. Traceroute sends probes
 * with a TTL of 1, 2, 3 and so on, and the router where each runs out sends back “time exceeded”, so the probes stop
 * on the routers one hop further each time, and light them. Last, a ping to an address where nobody is comes back
 * unreachable.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), changed only where a source
 * does not state them. RFC 792 defines ICMP, so its citations are marked as the defining standard; no vendor page is.
 * The addresses (RFC 1918 and RFC 5737), example.net, the clock times, the round-trip times and the ping's id and
 * sequence numbers are example data. No message size is shown: no source states one. The doctor’s check-up
 * (Overview description) is an analogy and cites nothing. The probes of steps 3 to 5 are echo requests, as Windows’
 * tracert sends them, so the last hop answers with an echo reply.
 */

// ---------------------------------------------------------------- citations

const RFC792 = 'https://www.rfc-editor.org/rfc/rfc792.html';
/** RFC 792’s html has only page ids (#page-N, at the top of page N), so each section is cited by the page it starts on. */
const rfc792 = (section: string, page: number) => cite('rfc-792', section, { url: `${RFC792}#page-${page}`, defining: true });
/** The Introduction is on page 1, which has no id, so it is cited by a text fragment. */
const R792_INTRO = cite('rfc-792', 'Introduction', { url: `${RFC792}#:~:text=Occasionally%20a%20gateway`, defining: true });
const R792_FORMAT = rfc792('Message Formats, page 2', 2);
const R792_SOURCE = rfc792('Message Formats, page 3', 3);
const R792_DU = rfc792('Destination Unreachable Message, page 4', 4);
const R792_DU_HOST = rfc792('Destination Unreachable Message, page 5', 5);
const R792_TE = rfc792('Time Exceeded Message, page 6', 6);
const R792_REDIRECT = rfc792('Redirect Message, page 12', 12);
const R792_ECHO = rfc792('Echo or Echo Reply Message, page 14', 14);
const R792_ECHO_DATA = rfc792('Echo or Echo Reply Message, page 15', 15);

/** RFC 1122 has no ids below its top-level sections, so each section is cited by the page it starts on. */
const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const rfc1122 = (section: string, page: number) => cite('rfc-1122', section, { url: `${RFC1122}#page-${page}` });
const R1122_ERROR = rfc1122('3.2.2', 38);
const R1122_PORT = cite('rfc-1122', '3.2.2.1', { url: `${RFC1122}#page-40`, defining: true });
const R1122_ECHO = rfc1122('3.2.2.6', 42);

/** RFC 1812 defines what an IPv4 router must do, RFC 791 the TTL field, RFC 1034 what a resolver does. */
const rfc1812 = (section: string, defining = false) => cite('rfc-1812', section, defining ? { defining: true } : {});
const rfc2151 = (section: string) => cite('rfc-2151', section);
const rfc4890 = (section: string) => cite('rfc-4890', section);
const rfc9099 = (section: string) => cite('rfc-9099', section);
const rfc2923 = (section: string) => cite('rfc-2923', section);
const rfc1191 = (section: string) => cite('rfc-1191', section);
const RFC791_TTL = cite('rfc-791', '3.1', { defining: true });
const RFC791_TTL_SET = cite('rfc-791', '1.4', { defining: true });
const RFC1034_DNS = cite('rfc-1034', '5.2.1', { defining: true });
/** RFC 4443 defines ICMPv6, RFC 4861 Neighbor Discovery. */
const rfc4443 = (section: string) => cite('rfc-4443', section, { defining: true });
const rfc4861 = (section: string) => cite('rfc-4861', section, { defining: true });

/** The IANA registries define the assigned numbers. */
const IANA_ICMP = 'https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml';
const IANA_TYPES = cite('iana-icmp-parameters', 'ICMP Type Numbers', { url: `${IANA_ICMP}#icmp-parameters-types`, defining: true });
const IANA_CODES_3 = cite('iana-icmp-parameters', 'Type 3 — Destination Unreachable', { url: `${IANA_ICMP}#icmp-parameters-codes-3`, defining: true });
const IANA_CODES_11 = cite('iana-icmp-parameters', 'Type 11 — Time Exceeded', { url: `${IANA_ICMP}#icmp-parameters-codes-11`, defining: true });
const IANA_PROTO = cite('iana-protocol-numbers', 'Assigned Internet Protocol Numbers', {
  url: 'https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml#protocol-numbers-1',
  defining: true,
});
const IANA_TTL = cite('iana-ip-parameters', 'IP Time to Live Parameter', {
  url: 'https://www.iana.org/assignments/ip-parameters/ip-parameters.xhtml#ip-parameters-2',
  defining: true,
});

/** The vendors’ own pages. None is the defining standard. */
const MSP = 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping';
const MS_PING = cite('microsoft-ping', 'Introduction', { url: `${MSP}#:~:text=Verifies%20IP` });
const MS_PING_OUT = cite('microsoft-ping', 'Example of the ping command output', { url: `${MSP}#example-of-the-ping-command-output` });
const MST = 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tracert';
const MS_TRACERT = cite('microsoft-tracert', 'Introduction', { url: `${MST}#:~:text=This%20diagnostic%20tool%20determines%20the%20path` });
const MS_TRACERT_PARAMS = cite('microsoft-tracert', 'Parameters', { url: `${MST}#parameters` });
const AZURE_TUNING = 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-tcpip-performance-tuning';
const AZURE_PING = cite('microsoft-azure-tcpip-tuning', 'Measure round-trip time and packet loss', {
  url: `${AZURE_TUNING}#measure-round-trip-time-and-packet-loss`,
});
const AZURE_PMTUD = cite('microsoft-azure-tcpip-tuning', 'TCP MSS window scaling and PMTUD', {
  url: `${AZURE_TUNING}#tcp-mss-window-scaling-and-pmtud`,
});
const CP = 'https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-software-releases-121-mainline/12778-ping-traceroute.html';
const CISCO_PING = cite('cisco-ping-traceroute', 'Ping Command', { url: `${CP}#:~:text=The%20ping%20command%20first%20sends` });
const CISCO_TRACE = cite('cisco-ping-traceroute', 'Traceroute Command', { url: `${CP}#:~:text=The%20traceroute%20command%20is%20used%20to%20discover` });
const CISCO_CHARS = cite('cisco-ping-traceroute', 'IP Traceroute Text Characters', { url: `${CP}#:~:text=IP%20Traceroute%20Text%20Characters` });
const CISCO_PERF = cite('cisco-ping-traceroute', 'Performance', {
  url: `${CP}#:~:text=required%20to%20send%20an%20echo%20packet%20and%20get%20an%20answer%20back`,
});
const CISCO_ACL = cite('cisco-ping-traceroute', 'Access List Command', { url: `${CP}#:~:text=implicit%20deny%20all` });
const CISCO_DOWN = cite('cisco-ping-traceroute', 'Interface Down', { url: `${CP}#:~:text=the%20problem%20is%20between%20Router2%20and%20Router3` });
const CT = 'https://www.cisco.com/c/en/us/support/docs/ip/ip-routed-protocols/22826-traceroute.html';
const CISCO_OS_WIN = cite('cisco-traceroute-os', 'Microsoft Windows', { url: `${CT}#:~:text=The%20MS%20Windows%20tracert%20command%20uses%20ICMP%20echo%20request` });
const CISCO_OS_GEN = cite('cisco-traceroute-os', 'General Operation', { url: `${CT}#:~:text=When%20a%20router%20in%20the%20middle%20of%20the%20path` });
const PA = 'https://docs.paloaltonetworks.com/ngfw/networking/session-settings-and-timeouts/icmp';
const PALO_LAYER = cite('paloalto-icmp', 'ICMP', { url: `${PA}#:~:text=operates%20at%20the%20Network%20layer` });
const PALO_USE = cite('paloalto-icmp', 'ICMP', { url: `${PA}#:~:text=diagnostic%20and%20control%20purposes` });
const PALO_DROP = cite('paloalto-icmp', 'ICMP', { url: `${PA}#:~:text=drop%20certain%20types%20of%20packets` });
const CF = 'https://www.cloudflare.com/learning/ddos/glossary/internet-control-message-protocol-icmp/';
const CF_LAYER = cite('cloudflare-icmp', 'What is ICMP?', { url: `${CF}#:~:text=network%20layer%20protocol` });

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100';
const EXAMPLE = '203.0.113.80';

const answers: TableDef = {
  id: 'answers',
  title: 'What came back',
  by: 'for each probe',
  columns: [
    { key: 'probe', label: 'Probe' },
    { key: 'from', label: 'From' },
    { key: 'answer', label: 'Answer', prose: true },
    { key: 'time', label: 'Time' },
  ],
  keyColumn: 'probe',
  initialRows: [],
  empty: 'Nothing yet. No probe has been sent.',
};

const mockup = messagesFor(answers);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-icmp',
  title: 'ICMP',
  subtitle: 'Network check-ups',
  level: 'beginner',
  certTags: [],
  summary:
    'ICMP is how the network reports problems and answers check-ups. Ping uses it to ask “are you there?”, and traceroute uses it to find every router on the way.',
  figure: 'net-map',
  backing: { traces: ['lead-1', 'lead-2', 'term-ping', 'term-echo-request', 'term-traceroute', 'fact-used'] },
  units: [
    {
      id: 'icmp',
      name: 'ICMP',
      fullName: 'Internet Control Message Protocol',
      purpose: 'Network check-ups',
      group: 'core',
      // No standard puts ICMP at an OSI layer (RFC 792 and RFC 1812 use the internet's own layers), so the badge rests
      // on two vendors' own pages.
      osi: { layers: [3], cite: [PALO_LAYER, CF_LAYER] },
      backing: { traces: ['fact-defined', 'lead-1', 'fact-used', 'term-ping'] },
      scene: {
        title: 'Ping and traceroute check the way to example.net',
        views: ['network', 'sequence'],
        layers: ['icmp:web'],
        labels: { laptop: 'Running ping', url: 'Terminal' },
        start: [],
        panel: { type: 'table', table: answers },
        log: eventLog(),
        parties: [
          { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
          { place: 'router', label: 'Your router', addr: '192.168.1.1' },
          { place: 'isp', label: 'Provider’s router', addr: '198.51.100.1' },
          { place: 'b', label: 'Core router', addr: '198.51.100.129' },
          { place: 'c', label: 'example.net’s router', addr: '203.0.113.1' },
          { place: 'web', label: 'example.net', addr: '203.0.113.80' },
        ],
        backing: { traces: ['term-ping', 'term-traceroute', 'fact-traceroute'] },
      },
      overview: {
        hook: 'ICMP is how the network reports problems and answers check-ups. Ping uses it to ask “are you there?”, and traceroute uses it to find every router on the way.',
        hookBacking: { traces: ['lead-1', 'lead-2', 'term-ping', 'term-echo-request', 'term-traceroute'] },
        description:
          'It’s like a doctor’s check-up for the network. Ping taps on a door and times how long the answer takes. Traceroute walks the corridor, knocking on every door on the way. And when a packet can’t be delivered, ICMP is how the network can send back a note to say why. Here you check the way from your laptop to example.net.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'tests and error notes', backing: { traces: ['fact-used', 'lead-1'] } },
          { label: 'Tools', value: 'ping, traceroute', backing: { traces: ['fact-tools'] } },
          {
            label: 'Messages here',
            value: 'echo request and reply, time exceeded, unreachable',
            backing: { traces: ['term-echo-request', 'term-echo-reply', 'term-time-exceeded', 'term-unreachable', 'fact-types'] },
          },
          { label: 'Ports', value: 'none: it rides on IP', backing: { traces: ['fact-ports', 'fact-rides'] } },
          { label: 'OSI layer', value: '3, network', backing: { traces: ['fact-osi'] } },
          { label: 'This example', value: 'the way to example.net', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'echo-request',
          title: 'Echo Request',
          sub: 'Are you there?',
          narrative:
            'You want to know if example.net can be reached, so you type ping example.net in a terminal. Ping sends a tiny message that only says “are you there?” It isn’t asking for a page. It’s a check-up, an **ICMP echo request**. ICMP is the network’s own messaging system, for tests and for reporting problems.',
          deep: [
            {
              text: 'Ping first finds the name’s address.',
              cite: [MS_PING, rfc2151('3.2')],
            },
            {
              text: 'ICMP sits directly on IP (protocol number 1), with no ports of its own. An echo request is type 8, code 0, with an ID and a sequence number so replies can be matched up.',
              cite: [R792_FORMAT, R792_ECHO, R792_ECHO_DATA, IANA_PROTO, IANA_TYPES],
            },
            {
              text: 'Ping sends a series of them and times each reply.',
              cite: [rfc2151('3.2'), CISCO_PING, MS_PING],
            },
            {
              text: 'Firewalls can block pings, so no reply doesn’t always mean the server is down.',
              cite: [rfc2923('3'), PALO_DROP, CISCO_ACL],
            },
          ],
          facts: [
            { label: 'Command', value: 'ping example.net', backing: { traces: ['term-ping', 'fact-tools'] } },
            { label: 'Message', value: 'ICMP echo request, type 8', backing: { traces: ['term-echo-request', 'fact-echo', 'fact-types', 'fact-rides'] } },
            { label: 'Ports', value: 'none: ICMP rides on IP', backing: { traces: ['fact-ports', 'fact-rides'] } },
            { label: 'To', value: '203.0.113.80', backing: { example: true } },
          ],
          events: [
            ...msgOf(
              'term-echo-request',
              'term-ping',
              'fact-echo',
              'fact-rides',
            )({
              tag: 'ECHO REQUEST',
              from: 'laptop',
              to: 'web',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              time: '0.000s',
              src: LAPTOP,
              dst: EXAMPLE,
              size: '—',
              sum: 'Are you there?',
              info: 'Echo request, id 1, seq 1',
              st: 'Pinging example.net',
            }),
          ],
          backing: { traces: ['lead-1', 'fact-used', 'term-ping', 'term-echo-request', 'fact-echo'] },
        },
        {
          id: 'echo-reply',
          title: 'Echo Reply',
          sub: 'Yes, and how long it took',
          narrative:
            'example.net answers straight back with an **echo reply**: “Yes, I’m here,” carrying back the same data it was sent. Ping times the round trip: 31 milliseconds there and back. That time is the **latency**. A few pings in a row also show whether any go missing, which is **packet loss**.',
          deep: [
            {
              text: 'An echo reply is type 0.',
              cite: [R792_ECHO, IANA_TYPES],
            },
            {
              text: 'Ping also shows the reply’s TTL, here 60: it probably started at 64 and crossed 4 routers.',
              cite: [MS_PING_OUT, rfc2151('3.2'), IANA_TTL, rfc1812('5.3.1', true)],
            },
            {
              text: 'At the end, ping prints the minimum, average and maximum times and the loss.',
              cite: [rfc2151('3.2'), CISCO_PING, AZURE_PING],
            },
          ],
          facts: [
            { label: 'Answer', value: 'ICMP echo reply, type 0', backing: { traces: ['term-echo-reply', 'fact-types', 'fact-rides'] } },
            { label: 'Round trip', value: '31 ms', backing: { traces: ['term-latency'] } },
            { label: 'Reply’s TTL', value: '60, so 4 routers away', backing: { traces: ['fact-ttl', 'term-ttl'] } },
            { label: 'Lost', value: '0 of 1', backing: { traces: ['term-loss'] } },
          ],
          events: [
            ...msgOf(
              'term-echo-reply',
              'fact-echo',
              'fact-rides',
              'fact-ttl',
              'term-latency',
            )({
              tag: 'ECHO REPLY',
              from: 'web',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              time: '0.031s',
              src: EXAMPLE,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I’m here.',
              info: 'Echo reply, seq 1, TTL 60, 31 ms',
              st: 'Reply in 31 ms',
              known: true,
              rows: [{ key: 'ping', cells: ['ping', EXAMPLE, 'Echo reply', '31 ms'] }],
            }),
          ],
          backing: { traces: ['term-echo-reply', 'term-ping', 'term-latency', 'term-loss', 'fact-echo'] },
        },
        {
          id: 'time-exceeded-hop-1',
          title: 'Time Exceeded, Hop 1',
          sub: 'Stop after one hop',
          narrative:
            'Ping says the server is there, but not how the packets get there. For that there’s **traceroute**, and it uses a trick with the **TTL**, the hop counter on every packet. It sends a probe with a TTL of just 1. The first router takes 1 off, reaches 0, and has to drop it. Routers are polite about it: they send back a note, “**time exceeded**”, from their own address. Now we know hop 1: your router.',
          deep: [
            {
              text: 'Time exceeded is ICMP type 11, code 0, and it carries the start of the dropped packet so the sender can match it up.',
              cite: [R792_TE, R1122_ERROR, IANA_CODES_11],
            },
            {
              text: 'The classic traceroute, and Cisco’s, sends UDP probes; tracert on Windows sends echo requests.',
              cite: [rfc2151('3.4'), CISCO_TRACE, MS_TRACERT, CISCO_OS_WIN],
            },
            {
              text: 'Each hop is usually probed three times, which is why each line shows three times.',
              cite: [rfc2151('3.4'), CISCO_TRACE],
            },
          ],
          facts: [
            { label: 'Probe', value: 'TTL 1', backing: { traces: ['fact-traceroute'] } },
            { label: 'Dropped by', value: 'your router, 192.168.1.1', backing: { traces: ['fact-ttl', 'fact-traceroute'] } },
            { label: 'Answer', value: 'ICMP time exceeded, type 11', backing: { traces: ['term-time-exceeded', 'fact-types', 'fact-rides'] } },
            { label: 'Time', value: '1 ms', backing: { example: true } },
          ],
          events: [
            ...msgOf(
              'fact-traceroute',
              'fact-tracert',
              'term-echo-request',
              'fact-rides',
              'term-ttl',
            )({
              tag: 'TTL 1',
              from: 'laptop',
              to: 'router',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              time: '1.000s',
              src: LAPTOP,
              dst: EXAMPLE,
              size: '—',
              sum: 'To example.net, with a TTL of 1.',
              info: 'Echo request, TTL 1',
              st: 'Tracing the route',
            }),
            ...msgOf(
              'term-time-exceeded',
              'fact-types',
              'fact-traceroute',
              'fact-ttl',
              'fact-rides',
            )({
              tag: 'TIME EXCEEDED',
              from: 'router',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              time: '1.001s',
              src: '192.168.1.1',
              dst: LAPTOP,
              size: '—',
              sum: 'Your TTL ran out here, at 192.168.1.1.',
              info: 'Time exceeded (TTL 0 in transit), from 192.168.1.1',
              st: 'Hop 1: your router',
              known: true,
              rows: [{ key: 'h1', cells: ['TTL 1', '192.168.1.1', 'Time exceeded', '1 ms'] }],
            }),
          ],
          backing: { traces: ['term-echo-reply', 'term-traceroute', 'term-ttl', 'fact-ttl', 'fact-traceroute', 'term-time-exceeded'] },
        },
        {
          id: 'time-exceeded-hop-2',
          title: 'Time Exceeded, Hop 2',
          sub: 'Stop after two',
          narrative:
            'Next probe: TTL 2. Your router takes 1 off and passes it on. The next router, your provider’s, takes off the last one and sends back its own time exceeded note. Hop 2 found. Each probe gets one router further than the last.',
          deep: [
            {
              text: 'Each time is a round trip to that hop: a rough idea of the delay.',
              cite: [CISCO_PERF, rfc2151('3.4')],
            },
            {
              text: 'A router set not to send ICMP shows as * * * in traceroute, but the hops after it still appear.',
              cite: [MS_TRACERT, CISCO_CHARS, rfc1812('5.2.7.3')],
            },
          ],
          facts: [
            { label: 'Probe', value: 'TTL 2', backing: { traces: ['fact-traceroute'] } },
            { label: 'Dropped by', value: 'your provider’s router, 198.51.100.1', backing: { traces: ['fact-ttl', 'fact-traceroute'] } },
            { label: 'Time', value: '9 ms', backing: { example: true } },
            { label: 'Pattern', value: 'each probe one hop further', backing: { traces: ['fact-traceroute', 'term-traceroute'] } },
          ],
          events: [
            ...msgOf(
              'fact-traceroute',
              'fact-tracert',
              'term-echo-request',
              'fact-rides',
              'term-ttl',
            )({
              tag: 'TTL 2',
              from: 'laptop',
              to: 'isp',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              time: '2.000s',
              src: LAPTOP,
              dst: EXAMPLE,
              size: '—',
              sum: 'To example.net, with a TTL of 2.',
              info: 'Echo request, TTL 2',
            }),
            ...msgOf(
              'term-time-exceeded',
              'fact-types',
              'fact-traceroute',
              'fact-ttl',
              'fact-rides',
            )({
              tag: 'TIME EXCEEDED',
              from: 'isp',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              time: '2.009s',
              src: '198.51.100.1',
              dst: LAPTOP,
              size: '—',
              sum: 'Your TTL ran out here, at 198.51.100.1.',
              info: 'Time exceeded (TTL 0 in transit), from 198.51.100.1',
              st: 'Hop 2: your provider',
              known: true,
              rows: [{ key: 'h2', cells: ['TTL 2', '198.51.100.1', 'Time exceeded', '9 ms'] }],
            }),
          ],
          backing: { traces: ['fact-ttl', 'fact-traceroute', 'term-time-exceeded', 'term-traceroute'] },
        },
        {
          id: 'traceroute',
          title: 'Traceroute',
          sub: 'Every router on the way',
          narrative:
            'Traceroute keeps going: TTL 3, TTL 4, each probe stopping one router further along. The TTL 5 probe has hops to spare, so it reaches example.net itself, which answers with an echo reply instead. That’s the whole path, router by router, with how long each took. When a site is slow, its times give a rough idea of the delay on the way.',
          deep: [
            {
              text: 'Each line of output is one hop: its address (and name, if it has one) and three round-trip times.',
              cite: [rfc2151('3.4'), MS_TRACERT_PARAMS, CISCO_CHARS, CISCO_TRACE],
            },
          ],
          facts: [
            { label: 'Hops', value: '5, counting example.net', backing: { traces: ['fact-traceroute', 'fact-tracert'] } },
            { label: 'Path', value: 'your router, provider, core, example.net’s router', backing: { traces: ['fact-traceroute', 'term-traceroute'] } },
            { label: 'Last answer', value: 'echo reply from 203.0.113.80', backing: { traces: ['fact-tracert', 'term-echo-reply'] } },
            { label: 'Tools', value: 'traceroute, tracert', backing: { traces: ['fact-tools'] } },
          ],
          events: [
            ...msgOf(
              'fact-traceroute',
              'fact-tracert',
              'term-echo-request',
              'fact-rides',
              'term-ttl',
            )({
              tag: 'TTL 3',
              from: 'laptop',
              to: 'b',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '3.000s',
              src: LAPTOP,
              dst: EXAMPLE,
              size: '—',
              sum: 'To example.net, with a TTL of 3.',
              info: 'Echo request, TTL 3',
            }),
            ...msgOf(
              'term-time-exceeded',
              'fact-types',
              'fact-traceroute',
              'fact-ttl',
              'fact-rides',
            )({
              tag: 'TIME EXCEEDED',
              from: 'b',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '3.018s',
              src: '198.51.100.129',
              dst: LAPTOP,
              size: '—',
              sum: 'Your TTL ran out here, at 198.51.100.129.',
              info: 'Time exceeded (TTL 0 in transit), from 198.51.100.129',
              rows: [{ key: 'h3', cells: ['TTL 3', '198.51.100.129', 'Time exceeded', '18 ms'] }],
            }),
            ...msgOf(
              'fact-traceroute',
              'fact-tracert',
              'term-echo-request',
              'fact-rides',
              'term-ttl',
            )({
              tag: 'TTL 4',
              from: 'laptop',
              to: 'c',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '4.000s',
              src: LAPTOP,
              dst: EXAMPLE,
              size: '—',
              sum: 'To example.net, with a TTL of 4.',
              info: 'Echo request, TTL 4',
            }),
            ...msgOf(
              'term-time-exceeded',
              'fact-types',
              'fact-traceroute',
              'fact-ttl',
              'fact-rides',
            )({
              tag: 'TIME EXCEEDED',
              from: 'c',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              fast: true,
              time: '4.027s',
              src: '203.0.113.1',
              dst: LAPTOP,
              size: '—',
              sum: 'Your TTL ran out here, at 203.0.113.1.',
              info: 'Time exceeded (TTL 0 in transit), from 203.0.113.1',
              rows: [{ key: 'h4', cells: ['TTL 4', '203.0.113.1', 'Time exceeded', '27 ms'] }],
            }),
            ...msgOf(
              'fact-traceroute',
              'fact-tracert',
              'term-echo-request',
              'fact-rides',
              'term-ttl',
            )({
              tag: 'TTL 5',
              from: 'laptop',
              to: 'web',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              fast: true,
              time: '5.000s',
              src: LAPTOP,
              dst: EXAMPLE,
              size: '—',
              sum: 'To example.net, with a TTL of 5.',
              info: 'Echo request, TTL 5',
            }),
            ...msgOf(
              'term-echo-reply',
              'fact-tracert',
              'fact-traceroute',
              'fact-rides',
              'term-latency',
            )({
              tag: 'ECHO REPLY',
              from: 'web',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              time: '5.031s',
              src: EXAMPLE,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes, I’m here: you’ve reached example.net.',
              info: 'Echo reply, from 203.0.113.80',
              st: 'Route found: 5 hops',
              done: true,
              rows: [{ key: 'h5', cells: ['TTL 5', EXAMPLE, 'Echo reply', '31 ms'] }],
            }),
          ],
          backing: { traces: ['fact-traceroute', 'fact-tracert', 'term-traceroute', 'term-echo-reply', 'term-latency', 'why-1'] },
        },
        {
          id: 'destination-unreachable',
          title: 'Destination Unreachable',
          sub: 'Nobody’s listening',
          narrative:
            'Last, you ping an address where nothing exists: 203.0.113.99. The packet gets as far as the router in front of that network, which looks for the machine, can’t find it, and sends back a **destination unreachable** note. That’s ICMP’s other job: when something goes wrong, the network can tell the sender, though some packets are still lost without a note.',
          deep: [
            {
              text: 'Destination unreachable is type 3, with a code for why: 0 network unreachable, 1 host unreachable, 3 port unreachable (nothing listening on that UDP port), 4 fragmentation needed (used to find the largest packet a path can carry).',
              cite: [R792_DU, IANA_CODES_3, rfc1812('5.2.7.1'), R1122_PORT, rfc1191('2'), AZURE_PMTUD],
            },
            {
              text: 'Here, host unreachable comes once the router has asked for the machine with ARP and had no answer.',
              cite: [rfc1812('3.3.2', true), rfc1812('5.2.7.1', true)],
            },
            {
              text: 'Firewalls often block ICMP, but blocking type 3 code 4 breaks path MTU discovery.',
              cite: [rfc2923('3'), AZURE_PMTUD, rfc1191('2')],
            },
          ],
          facts: [
            { label: 'Pinged', value: '203.0.113.99, nobody there', backing: { traces: ['term-ping', 'fact-unreachable'] } },
            { label: 'Answer from', value: 'example.net’s router, 203.0.113.1', backing: { traces: ['fact-unreachable'] } },
            { label: 'Message', value: 'type 3, host unreachable', backing: { traces: ['fact-types', 'fact-unreachable'] } },
            { label: 'Other codes', value: 'network, port, fragmentation needed', backing: { traces: ['fact-unreachable'] } },
          ],
          events: [
            ...msgOf(
              'term-echo-request',
              'term-ping',
              'fact-rides',
              'fact-echo',
            )({
              tag: 'ECHO REQUEST',
              from: 'laptop',
              to: 'c',
              proto: 'ICMP',
              via: 'IP',
              kind: 'request',
              time: '9.000s',
              src: LAPTOP,
              dst: '203.0.113.99',
              size: '—',
              sum: 'To 203.0.113.99. Is anyone there?',
              info: 'Echo request to 203.0.113.99',
              st: 'Pinging 203.0.113.99',
            }),
            ...msgOf(
              'term-unreachable',
              'fact-unreachable',
              'fact-types',
              'fact-rides',
            )({
              tag: 'UNREACHABLE',
              from: 'c',
              to: 'laptop',
              proto: 'ICMP',
              via: 'IP',
              kind: 'response',
              time: '12.027s',
              src: '203.0.113.1',
              dst: LAPTOP,
              size: '—',
              sum: 'Nobody is at 203.0.113.99. I can’t deliver this.',
              info: 'Destination unreachable (host unreachable), from 203.0.113.1',
              st: '203.0.113.99 unreachable',
              known: true,
              rows: [{ key: 'u', cells: ['ping .99', '203.0.113.1', 'Unreachable', '3 s'], miss: true }],
            }),
          ],
          backing: { traces: ['lead-2', 'term-ping', 'term-unreachable', 'fact-unreachable'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'ICMP is how the network talks about itself: “are you there?”, “yes”, “your packet ran out of hops here”, “I can’t deliver this”.',
            cite: [R792_INTRO, rfc1812('4.3.1')],
          },
          {
            id: 'lead-2',
            text: 'When something goes wrong, the network can tell the sender, though some packets are still lost without a note.',
            cite: [R792_INTRO],
          },
        ],
        terms: [
          { id: 'term-echo-request', idea: '“Are you there?”', name: 'Echo request', cite: [R1122_ECHO, R792_ECHO] },
          { id: 'term-echo-reply', idea: '“Yes, I’m here”', name: 'Echo reply', cite: [R1122_ECHO, R792_ECHO_DATA] },
          { id: 'term-ping', idea: 'The tool that sends those', name: 'Ping', cite: [MS_PING, rfc2151('3.2'), CISCO_PING] },
          { id: 'term-latency', idea: 'How long there and back', name: 'Latency (round-trip time)', cite: [AZURE_PING, CISCO_PERF, MS_PING] },
          { id: 'term-ttl', idea: 'The hop counter on every packet', name: 'TTL', cite: [RFC791_TTL, rfc1812('5.3.1', true)] },
          { id: 'term-time-exceeded', idea: '“Your packet ran out of hops here”', name: 'Time exceeded', cite: [R792_TE, rfc1812('5.3.1', true)] },
          { id: 'term-traceroute', idea: 'Listing every router on the way', name: 'Traceroute', cite: [rfc2151('3.4'), MS_TRACERT, CISCO_TRACE] },
          { id: 'term-unreachable', idea: '“I can’t deliver this”', name: 'Destination unreachable', cite: [rfc1812('5.2.7.1', true), R792_DU_HOST] },
          { id: 'term-loss', idea: 'Pings that never come back', name: 'Packet loss', cite: [CISCO_PING, rfc2151('3.2'), AZURE_PING] },
        ],
        pattern: {
          id: 'pattern',
          names: ['Echo Request', 'Echo Reply', 'Time Exceeded', 'Unreachable'],
          note: 'Ping uses the first two. Traceroute uses time exceeded, one hop at a time.',
          cite: [MS_PING, CISCO_PING, MS_TRACERT, CISCO_TRACE, rfc1812('5.3.1')],
        },
        why: [
          {
            id: 'why-1',
            text: 'When something on the network fails, you need to find where. Ping answers “can I reach it, and how fast?”, traceroute answers “which way, and where does it slow down?”, and the error notes tell senders why a packet didn’t arrive.',
            cite: [MS_PING, rfc2151('3.2'), MS_TRACERT, rfc2151('3.4'), CISCO_PERF, rfc1812('5.2.7.1', true)],
          },
        ],
        deep: [
          {
            id: 'deep-types',
            text: 'ICMP types worth knowing: 0 echo reply, 3 destination unreachable, 5 redirect, 8 echo request, 11 time exceeded.',
            cite: [R792_ECHO, R792_DU, R792_REDIRECT, R792_TE, IANA_TYPES],
          },
          {
            id: 'deep-ports',
            text: 'ICMP has no ports of its own; an echo’s identifier is used like one.',
            cite: [R792_FORMAT, R792_ECHO_DATA],
          },
          {
            id: 'deep-firewalls',
            text: 'Because it can be used to map a network, many firewalls limit it.',
            cite: [rfc4890('3.2'), rfc4890('3'), rfc9099('2.1.4'), PALO_DROP],
          },
          {
            id: 'deep-ipv6',
            text: 'IPv6 uses ICMPv6, which also takes over ARP’s job.',
            cite: [rfc4443('2'), rfc4861('3.1')],
          },
        ],
        facts: [
          {
            id: 'fact-types',
            label: 'Types',
            value: '0 reply, 3 unreachable, 8 request, 11 time exceeded (code 0: the TTL ran out in transit)',
            cite: [R792_ECHO, R792_DU, R792_TE, IANA_TYPES, IANA_CODES_11],
          },
          {
            id: 'fact-ports',
            label: 'Ports',
            value: 'none of its own; an echo’s identifier is used like one',
            cite: [R792_FORMAT, R792_ECHO_DATA],
          },
          { id: 'fact-rides', label: 'Rides on', value: 'IP, protocol 1', cite: [R792_FORMAT, IANA_PROTO] },
          {
            id: 'fact-tools',
            label: 'Tools',
            value: 'ping, traceroute, tracert',
            cite: [MS_PING, MS_TRACERT, rfc2151('3.2'), rfc2151('3.4'), CISCO_TRACE],
          },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 792', cite: [R792_INTRO, IANA_PROTO] },
          {
            id: 'fact-echo',
            label: 'Echo request',
            value: 'type 8, code 0, with an identifier and a sequence number that come back in the reply, so ping can match them; the reply carries back the same data',
            cite: [R792_ECHO, R792_ECHO_DATA],
          },
          {
            id: 'fact-ttl',
            label: 'TTL',
            value: 'set by the sender, 64 by default; each router takes 1 off, and at 0 the packet is dropped',
            cite: [RFC791_TTL_SET, IANA_TTL, rfc1812('5.3.1', true)],
          },
          {
            id: 'fact-traceroute',
            label: 'How traceroute works',
            value:
              'probes with a TTL of 1, then 2, 3 and so on; the router where each runs out sends back time exceeded from its own address',
            cite: [MS_TRACERT, CISCO_TRACE, rfc2151('3.4'), CISCO_OS_GEN, rfc1812('5.3.1'), rfc1812('4.3.2.4'), R792_SOURCE],
          },
          {
            id: 'fact-tracert',
            label: 'How tracert works',
            value: 'tracert on Windows sends echo requests, and the destination answers the last with an echo reply',
            cite: [MS_TRACERT, CISCO_OS_WIN, rfc4890('1')],
          },
          {
            id: 'fact-unreachable',
            label: 'Destination unreachable',
            value:
              'type 3, with a code for why (0 network, 1 host, 3 port, 4 fragmentation needed); a host unreachable comes from the last router when the machine doesn’t answer ARP',
            cite: [R792_DU, rfc1812('5.2.7.1', true), rfc1812('4.3.3.1', true), rfc1812('3.3.2', true)],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '3, network', cite: [PALO_LAYER, CF_LAYER] },
          { id: 'fact-used', label: 'Used for', value: 'tests and error notes', cite: [rfc1812('4.3.1'), PALO_USE] },
        ],
      },
      practice: [
        {
          id: 'traceroute',
          prompt: 'How does traceroute find each router on the way?',
          options: [
            {
              text: 'It asks DNS for the list.',
              feedback: 'Not quite. DNS turns names into addresses. Traceroute finds the routers itself, one hop at a time.',
              cite: [RFC1034_DNS, MS_TRACERT, CISCO_TRACE],
            },
            {
              text: 'It sends probes with TTL 1, 2, 3 and so on, and each router where one runs out replies.',
              feedback: 'Right. Each time exceeded note comes from the next router along.',
              cite: [MS_TRACERT, CISCO_TRACE, rfc2151('3.4'), rfc1812('5.3.1', true)],
            },
            {
              text: 'Each router adds its name to the ping.',
              feedback: 'Not quite. Traceroute learns each router from the time exceeded note it sends back when a probe’s TTL runs out there.',
              cite: [MS_TRACERT, CISCO_TRACE, rfc1812('5.3.1', true)],
            },
          ],
          answer: 1,
        },
        {
          id: 'no-reply',
          prompt: 'A ping gets no reply. What can you be sure of?',
          options: [
            {
              text: 'The server is switched off.',
              feedback: 'Not quite. Firewalls can block pings, so a server that is on may still not answer.',
              cite: [rfc2923('3'), PALO_DROP, CISCO_ACL],
            },
            {
              text: 'Your internet is down.',
              feedback: 'Not quite. Other sites might answer fine. One silent ping doesn’t tell you that.',
              cite: [CISCO_DOWN, MS_PING],
            },
            {
              text: 'Only that no reply came back. It could be one of several things.',
              feedback: 'Yes. It may be down, unreachable, or just ignoring pings. Traceroute helps narrow it down.',
              cite: [rfc2151('3.2'), CISCO_PING, rfc1812('5.2.7.1', true), rfc1812('4.3.3.6'), CISCO_ACL, CISCO_TRACE, rfc2151('3.4')],
            },
          ],
          answer: 2,
        },
      ],
    },
  ],
});
