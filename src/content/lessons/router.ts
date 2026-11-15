import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, MessageEvent, NoteEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * Router, Networking Concepts lesson 8. One packet from the laptop to example.net crosses four routers, each looking
 * the destination up in its own routing table and choosing only the next hop (RFC 1812); the provider's router shows
 * the longest matching route winning; a second packet, to an address no route covers, is dropped at router a, which
 * has no default route, and a destination unreachable message comes back (RFC 1812 section 4.3.3.1).
 *
 * The scene is the approved design's (prototypes/d10-router.md). The addresses (RFC 1918 and RFC 5737), the routers
 * a to d and the tables of the provider's router, router a and router c are example data, and so is the TTL the
 * laptop starts with; the log's times and sizes are dashes because no source states one for this story. RFC 1812
 * defines what an IPv4 router does; RFC 4632 the prefix notation and the default route 0.0.0.0/0; RFC 1122 what a
 * host does; RFC 792 the destination unreachable message. Vendor pages carry no defining marker. No standard places
 * a router at an OSI layer, so the badge rests on two vendors' pages.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 1812 sets the requirements for IPv4 routers, so it defines what a router does with a packet. */
const router = (section: string) => rfc('rfc-1812', section, true);
/** RFC 791 defines IPv4, and RFC 4632 the prefix notation. */
const ip4 = (section: string) => rfc('rfc-791', section, true);
const cidr = (section: string) => rfc('rfc-4632', section, true);

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it starts on. */
const host = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });

/** RFC 792's html has only page ids, so each section is cited by the page it starts on. */
const RFC792 = 'https://www.rfc-editor.org/rfc/rfc792.html';
const ICMP_UNREACHABLE = cite('rfc-792', 'Destination Unreachable Message, page 4', { url: `${RFC792}#page-4`, defining: true });
const ICMP_TYPES = cite('rfc-792', 'Summary of Message Types', { url: `${RFC792}#page-20`, defining: true });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

const MICROSOFT_SUBNETTING = 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting';
const MS_GATEWAY = cite('microsoft-tcpip-subnetting', 'Default gateways', { url: `${MICROSOFT_SUBNETTING}#default-gateways` });

/** Microsoft's and Cisco's pages on the commands, as What is IP cites them. */
const ROUTE_PRINT = [
  cite('microsoft-route', 'Introduction', { url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008#:~:text=Displays%20and%20modifies%20the%20entries' }),
  cite('microsoft-route', 'Examples', { url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008#examples' }),
  cite('cisco-route-command', 'Use the Route Command', {
    url: 'https://www.cisco.com/c/en/us/support/docs/voice-unified-communications/unified-intelligent-contact-management-enterprise/20524-route-command.html#:~:text=In%20order%20to%20view%20the%20entire%20contents',
  }),
];
const MS_ROUTE_PARAMS = cite('microsoft-route', 'Parameters', {
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008#parameters',
});

const CISCO_TABLE = vendor('cisco-how-router-works', 'Creating a routing table', 'When routers receive IP packets that need to be forwarded');
const CISCO_PREFIX = vendor('cisco-route-selection', 'Prefix Lengths', 'Longer prefixes are always preferred');
const CISCO_DEFAULT = vendor('cisco-gateway-last-resort', 'Background Information', 'Default routes are used to direct packets');
const CISCO_STUB = vendor('cisco-gateway-last-resort', 'Background Information', 'Default routes are invaluable in topologies');
const CISCO_L3 = vendor('cisco-what-is-routing', 'What are switches and routers?', 'A Layer 3 router uniquely identifies');
const PALO_L3 = vendor('paloalto-layer-3-vs-7', 'What is a layer 3 firewall (network firewall)?', 'A layer 3 firewall, also known as a network firewall');

// ---------------------------------------------------------------- events

const LAPTOP = '192.168.1.100';
const PUBLIC = '198.51.100.23';
const WEB = '203.0.113.80';
const LOST = '192.0.2.77';

const routes: TableDef = {
  id: 'routes',
  title: 'Routing table',
  columns: [
    { key: 'network', label: 'Network' },
    { key: 'hop', label: 'Next hop' },
  ],
  keyColumn: 'network',
  initialRows: [],
  empty: 'Each device on the way shows its routing table here, in turn.',
};

const row = (network: string, hop: string): Row => ({ network, hop });
const traced = (...traces: string[]): Backing => ({ traces });

const replace = (id: string, by: string, rows: Row[], summary: string, backing: Backing): TableEvent => ({
  type: 'table',
  id,
  table: 'routes',
  op: 'replace',
  by,
  rows,
  summary,
  backing,
});
const match = (id: string, summary: string, o: { key?: string; keys?: string[] }, backing: Backing): TableEvent => ({
  type: 'table',
  id,
  table: 'routes',
  op: 'match',
  summary,
  backing,
  ...o,
});

/** An IPv4 packet. No source states its size, and no clock time belongs to the story, so those cells are dashes. */
const packet = (
  id: string,
  from: string,
  to: string,
  o: Partial<MessageEvent> & { source: string; destination: string; info: string; plain: string; protocol?: string; backing: Backing },
): MessageEvent => {
  const { source, destination, info, protocol = 'IPv4', ...rest } = o;
  return {
    type: 'message',
    id,
    from,
    to,
    tag: 'PACKET',
    kind: 'request',
    log: { time: '—', source, destination, protocol, info, size: '—' },
    ...rest,
  };
};

const droppedAtA: NoteEvent = {
  type: 'note',
  id: 's5-drop',
  glyph: 'dropped',
  log: { time: '—', source: 'router a', destination: '—', protocol: '—', info: 'No route for 192.0.2.77: packet dropped', size: '—' },
  plain: 'Router a has no route for 192.0.2.77, not even a default route, so it drops the packet.',
  cues: [{ cue: 'drop', arg: 'a' }],
  backing: traced('fact-no-route', 'term-unreachable'),
};

const step1: SceneEvent[] = [
  replace(
    's1-table',
    'kept by your laptop',
    [row('192.168.1.0/24', 'directly (this network)'), row('0.0.0.0/0', '192.168.1.1 (default gateway)')],
    'Your laptop’s routing table: its own network, and a default route to the gateway.',
    traced('fact-host-table', 'term-connected', 'term-default-route', 'term-gateway'),
  ),
  match('s1-match', 'Only the default route, 0.0.0.0/0, matches 203.0.113.80.', { key: '0.0.0.0/0' }, traced('term-default-route', 'fact-default')),
  packet('s1-packet', 'laptop', 'router', {
    source: LAPTOP,
    destination: WEB,
    info: 'To 203.0.113.80, via the default gateway, TTL 64',
    plain: 'The laptop sends the packet to its default gateway, your router.',
    backing: traced('term-gateway', 'term-default-route', 'fact-host-table', 'fact-ttl', 'term-ttl', 'fact-defined'),
  }),
];

const step2: SceneEvent[] = [
  replace(
    's2-table',
    'kept by your router',
    [row('192.168.1.0/24', 'directly (home)'), row('198.51.100.0/24', 'directly (link to provider)'), row('0.0.0.0/0', '198.51.100.1 (provider’s router)')],
    'Your router’s routing table: your home, the link to your provider, and a default route.',
    traced('term-routing-table', 'term-connected', 'term-default-route', 'fact-home'),
  ),
  match('s2-match', 'Only the default route matches: next hop 198.51.100.1.', { key: '0.0.0.0/0' }, traced('term-default-route', 'fact-default', 'term-next-hop')),
  packet('s2-packet', 'router', 'isp', {
    source: PUBLIC,
    destination: WEB,
    info: 'Default route: to the provider’s router, TTL 63',
    plain: 'Your router lowers the TTL, puts its own public address as the source, and passes the packet to the provider’s router.',
    backing: traced('term-default-route', 'fact-home', 'fact-ttl', 'term-ttl', 'deep-nat', 'term-next-hop', 'fact-defined'),
  }),
];

const step3: SceneEvent[] = [
  replace(
    's3-table',
    'kept by your provider’s router',
    [row('198.51.100.0/24', 'directly (link to your router)'), row('203.0.113.0/24', 'router b'), row('0.0.0.0/0', 'router a')],
    'The provider’s router has its own routing table.',
    traced('term-routing-table', 'term-route', 'term-connected', 'term-default-route', 'fact-home'),
  ),
  match(
    's3-candidates',
    'Two routes match 203.0.113.80: 203.0.113.0/24 and 0.0.0.0/0.',
    { keys: ['203.0.113.0/24', '0.0.0.0/0'] },
    traced('term-route', 'term-longest-match', 'term-default-route', 'fact-default'),
  ),
  match(
    's3-winner',
    'The longer one, 203.0.113.0/24, wins: next hop router b.',
    { key: '203.0.113.0/24', keys: ['203.0.113.0/24', '0.0.0.0/0'] },
    traced('term-longest-match', 'fact-match', 'term-next-hop'),
  ),
  packet('s3-packet', 'isp', 'b', {
    source: PUBLIC,
    destination: WEB,
    info: 'Longest match: 203.0.113.0/24, to router b, TTL 62',
    plain: 'The provider’s router passes the packet to router b.',
    backing: traced('term-longest-match', 'fact-match', 'term-next-hop', 'fact-ttl', 'term-ttl', 'deep-nat', 'fact-defined'),
  }),
];

const step4: SceneEvent[] = [
  replace(
    's4-table',
    'kept by router c',
    [row('203.0.113.0/24', 'directly (example.net’s network)'), row('0.0.0.0/0', 'router b')],
    'Router c’s routing table.',
    traced('term-routing-table', 'term-connected', 'term-default-route'),
  ),
  packet('s4-to-c', 'b', 'c', {
    source: PUBLIC,
    destination: WEB,
    info: 'To router c, TTL 61',
    plain: 'Router b looks the destination up in its own table and passes the packet to router c.',
    backing: traced('fact-hop', 'term-next-hop', 'fact-ttl', 'term-ttl', 'deep-nat', 'fact-defined'),
  }),
  match('s4-match', '203.0.113.0/24 matches: example.net’s network, connected directly.', { key: '203.0.113.0/24' }, traced('term-connected', 'term-next-hop')),
  packet('s4-delivered', 'c', 'web', {
    source: PUBLIC,
    destination: WEB,
    info: 'Delivered to 203.0.113.80, TTL 60',
    plain: 'Router c is plugged into example.net’s network, so the next hop is the server itself.',
    cues: [{ cue: 'status', arg: 'Delivered' }, { cue: 'status-done' }],
    backing: traced('term-connected', 'term-next-hop', 'fact-ttl', 'term-ttl', 'deep-nat', 'fact-defined'),
  }),
];

const step5: SceneEvent[] = [
  replace(
    's5-table',
    'kept by router a',
    [row('203.0.113.0/24', 'router b'), row('198.51.100.0/24', 'provider’s router')],
    'Router a’s routing table: no default route.',
    traced('term-routing-table', 'fact-no-route'),
  ),
  packet('s5-to-isp', 'laptop', 'isp', {
    fast: true,
    source: PUBLIC,
    destination: LOST,
    info: 'To 192.0.2.77, by default routes to the provider’s router, TTL 63',
    plain: 'The laptop’s second packet goes to your router, which passes it to the provider’s router by its default route.',
    backing: traced('term-gateway', 'term-default-route', 'fact-home', 'deep-nat', 'fact-ttl', 'term-ttl', 'fact-defined'),
  }),
  packet('s5-to-a', 'isp', 'a', {
    source: PUBLIC,
    destination: LOST,
    info: 'Default route: to router a, TTL 62',
    plain: 'The provider’s router has no more specific route for 192.0.2.77, so its default route sends the packet to router a.',
    backing: traced('term-default-route', 'fact-default', 'fact-ttl', 'term-ttl', 'deep-nat', 'fact-defined'),
  }),
  match('s5-nomatch', 'No route in router a’s table covers 192.0.2.77.', { key: '' }, traced('fact-no-route', 'term-routing-table')),
  droppedAtA,
  packet('s5-icmp', 'a', 'laptop', {
    kind: 'control',
    tag: 'UNREACHABLE',
    protocol: 'ICMP',
    source: 'router a',
    destination: PUBLIC,
    info: 'Destination unreachable: network unreachable (type 3, code 0)',
    plain: 'Router a sends a destination unreachable message back. It comes to your router’s public address, and your router passes it to the laptop.',
    cues: [{ cue: 'status', arg: 'No route: dropped' }],
    backing: traced('fact-no-route', 'term-unreachable', 'deep-nat'),
  }),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'router',
  title: 'Router',
  subtitle: 'Passing packets between networks',
  level: 'beginner',
  certTags: [],
  summary:
    'Follow one packet across the internet, router by router. Each router looks at where the packet is going, checks its own routing table and picks only the next hop.',
  figure: 'net-map',
  backing: { traces: ['term-router', 'term-routing-table', 'term-next-hop', 'fact-hop', 'why-1'] },
  units: [
    {
      id: 'router',
      name: 'Router',
      fullName: 'Router',
      purpose: 'Passing packets between networks',
      osi: { layers: [3], cite: [CISCO_L3, PALO_L3] },
      backing: { traces: ['term-router', 'fact-defined'] },
      scene: {
        title: 'Sending a packet',
        views: ['network'],
        layers: ['ip:web'],
        labels: { laptop: 'Sending a packet', router: '192.168.1.1 inside\n198.51.100.23 outside', isp: 'provider', a: 'a', b: 'b', c: 'c', d: 'd' },
        start: [{ cue: 'hide', arg: 'resolver' }],
        panel: { type: 'table', table: routes },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'Packet' },
            { kind: 'control', label: 'Error message' },
            { kind: 'dropped', label: 'Dropped' },
          ],
        },
        parties: [],
        backing: {
          traces: ['term-router', 'term-routing-table', 'term-gateway', 'term-default-route', 'term-connected', 'term-next-hop', 'fact-home', 'fact-defined', 'fact-no-route', 'term-unreachable', 'deep-nat'],
        },
      },
      overview: {
        hook: 'A router passes a packet on from one network to the next. Each router on the way looks at where the packet is going, checks its own list of routes and picks only the next stop. Your home router is one of them.',
        hookBacking: { traces: ['term-router', 'term-routing-table', 'term-next-hop', 'why-1', 'fact-home'] },
        description:
          'The internet is many networks joined together. Routers are the joins. Your laptop hands a packet to your router, and from there each router sends it one hop closer, until the last router delivers it.',
        backing: { traces: ['lead-1', 'term-router', 'term-next-hop', 'fact-hop'] },
        facts: [
          { label: 'Joins', value: 'two or more networks', backing: { traces: ['term-router'] } },
          { label: 'Each hop', value: 'reads the destination, picks the next hop from its routing table', backing: { traces: ['fact-hop'] } },
          { label: 'When nothing else fits', value: 'the default route, 0.0.0.0/0', backing: { traces: ['fact-default'] } },
          { label: 'No route at all', value: 'dropped, with a destination unreachable message back', backing: { traces: ['fact-no-route'] } },
          { label: 'OSI layer', value: '3, network', backing: { traces: ['fact-osi'] } },
          { label: 'Defined in', value: 'RFC 1812', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'near-or-far',
          title: 'Near or Far?',
          sub: 'The laptop’s choice',
          narrative:
            'Your laptop has a packet for 203.0.113.80. It keeps a tiny routing table: one row for its own network, 192.168.1.0/24, and a **default route**, 0.0.0.0/0, that points at the **default gateway**, 192.168.1.1, your router. 203.0.113.80 is not on the laptop’s own network, so only the default route fits. The laptop hands the packet to the gateway.',
          deep: [
            {
              text: 'The laptop compares the destination with its own address and subnet mask. If the bits the mask picks out match, the destination is on its own network and the packet goes straight there.',
              cite: [host('3.3.1.1', 47)],
            },
          ],
          facts: [
            { label: 'Destination', value: WEB, backing: { example: true } },
            { label: 'On my network?', value: 'no', backing: { traces: ['term-gateway', 'lead-1'] } },
            { label: 'Route that fits', value: '0.0.0.0/0, the default route', backing: { traces: ['term-default-route', 'fact-default'] } },
            { label: 'Next hop', value: '192.168.1.1, the default gateway', backing: { traces: ['fact-host-table', 'term-gateway', 'term-next-hop'] } },
          ],
          status: 'Not on my network: send to the gateway',
          events: step1,
          backing: { traces: ['term-gateway', 'term-default-route', 'fact-host-table', 'fact-default', 'lead-1'] },
        },
        {
          id: 'one-way-out',
          title: 'One Way Out',
          sub: 'Your router’s table',
          narrative:
            'Your router reads the destination, 203.0.113.80, and looks it up in its own routing table. Two networks are **directly connected** to it: your home, and the link to your provider. 203.0.113.80 is on neither, so only the default route fits, and it points at the provider’s router, 198.51.100.1. Your home has one way out, so one route covers everything outside. The router lowers the TTL, swaps the source address for its own public one, and passes the packet on.',
          deep: [
            {
              text: 'A route’s next hop is the next router, or, when the destination is on a network the router is plugged into, the destination itself.',
              cite: [router('2.2.3'), router('5.2.4')],
            },
          ],
          facts: [
            { label: 'Connected', value: '192.168.1.0/24 and 198.51.100.0/24', backing: { traces: ['term-connected'] } },
            { label: 'Route that fits', value: '0.0.0.0/0, next hop 198.51.100.1', backing: { traces: ['term-default-route', 'fact-home', 'term-next-hop'] } },
            { label: 'Source now', value: '198.51.100.23, your router’s public address', backing: { traces: ['deep-nat'] } },
          ],
          events: step2,
          backing: { traces: ['fact-hop', 'term-routing-table', 'term-connected', 'term-default-route', 'fact-home', 'fact-ttl', 'deep-nat', 'term-next-hop'] },
        },
        {
          id: 'most-specific',
          title: 'Most Specific Route',
          sub: 'The provider’s router',
          narrative:
            'The provider’s router has a routing table of its own. Two of its routes fit 203.0.113.80: the default route, 0.0.0.0/0, which leads to router a, and 203.0.113.0/24, which leads to router b. When several routes fit, the one with the **longest prefix**, the most specific, wins. A /24 is longer than a /0, so the packet goes to router b.',
          deep: [
            {
              text: 'A route fits when the first bits of the destination, as many as the route’s prefix length, are the same as the route’s network. The default route has length 0, so it fits every address.',
              cite: [router('5.2.4.3')],
            },
          ],
          facts: [
            { label: 'Routes that fit', value: '203.0.113.0/24 and 0.0.0.0/0', backing: { traces: ['term-route', 'term-default-route'] } },
            { label: 'Winner', value: '203.0.113.0/24, the longest prefix', backing: { traces: ['term-longest-match', 'fact-match'] } },
            { label: 'Next hop', value: 'router b', backing: { traces: ['term-next-hop', 'term-route'] } },
          ],
          events: step3,
          backing: { traces: ['term-routing-table', 'term-route', 'term-longest-match', 'fact-match', 'term-default-route'] },
        },
        {
          id: 'hop-by-hop',
          title: 'Hop by Hop',
          sub: 'Router b, then router c',
          narrative:
            'Router b looks up 203.0.113.80 in its own table and sends the packet on to router c. Router c is plugged straight into example.net’s network, 203.0.113.0/24, so its next hop is the server itself. No router planned the whole trip. Each one picked only the next hop, for this packet on its own, and each one lowered the TTL.',
          deep: [
            {
              text: 'Before passing the packet on, a router finds the link-layer address of the next hop and puts the packet in a new frame for that link.',
              cite: [router('5.2.1.2')],
            },
          ],
          facts: [
            { label: 'Router b', value: 'looks up the destination, sends it to router c', backing: { traces: ['fact-hop'] } },
            { label: 'Router c', value: 'directly connected to 203.0.113.0/24', backing: { traces: ['term-connected'] } },
            { label: 'Last next hop', value: 'the server itself, 203.0.113.80', backing: { traces: ['term-next-hop'] } },
          ],
          events: step4,
          backing: { traces: ['fact-hop', 'term-next-hop', 'term-connected', 'why-1', 'fact-ttl'] },
        },
        {
          id: 'no-route',
          title: 'No Route',
          sub: 'Router a',
          narrative:
            'The laptop sends a second packet, to 192.0.2.77. Your router and the provider’s router pass it on by their default routes. Router a has no default route, and none of its routes fits, so it cannot pass the packet on. It drops it and sends back a **destination unreachable** message: network unreachable. The message comes back to your router’s public address, and your router passes it to the laptop.',
          deep: [
            {
              text: 'A router can limit how many error messages like this it sends.',
              cite: [router('4.3.2.8')],
            },
          ],
          facts: [
            { label: 'Router a’s table', value: 'no default route', backing: { traces: ['fact-no-route'] } },
            { label: 'The packet', value: 'dropped', backing: { traces: ['fact-no-route'] } },
            { label: 'The message', value: 'ICMP destination unreachable, type 3, code 0', backing: { traces: ['fact-no-route', 'term-unreachable'] } },
            { label: 'Back to', value: 'your router, then the laptop', backing: { traces: ['deep-nat'] } },
          ],
          events: step5,
          backing: { traces: ['term-unreachable', 'fact-no-route', 'term-default-route', 'deep-nat'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'A packet from your laptop goes to your router, then router by router, and each router only chooses where to send it next.',
            cite: [host('3.3.1', 47), router('2.2.3')],
          },
        ],
        terms: [
          {
            id: 'term-router',
            idea: 'A device that joins two or more networks and passes IP packets between them',
            name: 'Router',
            cite: [router('2.2.3'), ip4('2.4')],
          },
          {
            id: 'term-gateway',
            idea: 'The router your device sends to for anything outside its own network',
            name: 'Default gateway',
            cite: [host('3.3.1.2', 48), MS_GATEWAY],
          },
          {
            id: 'term-routing-table',
            idea: 'A router’s list of networks, with where to send packets for each',
            name: 'Routing table',
            cite: [router('2.2.3'), router('5.2.1.2'), CISCO_TABLE],
          },
          {
            id: 'term-route',
            idea: 'One row: a network, written as a prefix like 203.0.113.0/24, and its next hop',
            name: 'Route',
            cite: [router('5.2.4.3'), cidr('3.1'), MS_ROUTE_PARAMS],
          },
          {
            id: 'term-next-hop',
            idea: 'Where the packet goes next: the next router, or on the last hop the destination itself',
            name: 'Next hop',
            cite: [router('2.2.3'), router('5.2.4')],
          },
          {
            id: 'term-connected',
            idea: 'A network the router is plugged straight into; it delivers to devices there directly',
            name: 'Directly connected',
            cite: [router('5.2.4.2'), MS_ROUTE_PARAMS],
          },
          {
            id: 'term-default-route',
            idea: 'The route that matches every address, 0.0.0.0/0, used when nothing more specific does',
            name: 'Default route',
            cite: [router('5.2.4.3'), cidr('5.1'), CISCO_DEFAULT],
          },
          {
            id: 'term-longest-match',
            idea: 'When several routes match, the one with the longest prefix, the most specific, wins',
            name: 'Longest prefix match',
            cite: [router('5.2.4.3'), cidr('5.1'), CISCO_PREFIX],
          },
          {
            id: 'term-ttl',
            idea: 'The hop counter that stops loops',
            name: 'TTL',
            cite: [host('3.2.1.7', 34), router('5.3.1')],
          },
          {
            id: 'term-unreachable',
            idea: '“I can’t deliver this”: the message sent back when no route matches',
            name: 'Destination unreachable',
            cite: [router('4.3.3.1'), ICMP_UNREACHABLE],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Read the destination', 'Find the route', 'Lower the TTL', 'Pass it on'],
          note: 'What every router does with each packet, in outline: the longest matching route picks the next hop.',
          cite: [router('5.2.1'), router('5.2.1.1'), router('5.2.1.2'), router('5.2.4.3')],
        },
        why: [
          {
            id: 'why-1',
            text: 'No router has to plan the whole trip. Each one only picks the next hop, and it does that for every packet separately.',
            cite: [router('2.2.3'), ip4('1.4')],
          },
          {
            id: 'why-2',
            text: 'A default route means a router doesn’t need to list every network in the world. Your home has one way out, so your router needs only one route for everything outside.',
            cite: [CISCO_STUB, rfc('rfc-1812', '5.2.4.3'), rfc('rfc-1812', '7.5.2'), rfc('rfc-1812', '2.3'), rfc('rfc-3022', '2.2')],
          },
        ],
        deep: [
          {
            id: 'deep-metric',
            text: 'Between equally long matches from the same source, a cost number, the metric, breaks the tie: the lowest wins.',
            cite: [router('5.2.4.3'), MS_ROUTE_PARAMS],
          },
          {
            id: 'deep-sources',
            text: 'A router learns routes from the networks it is plugged into, from routes an administrator types in, and from routing protocols that routers use to tell each other what they can reach.',
            cite: [router('2.2.3'), router('7.4'), router('5.2.4.2')],
          },
          {
            id: 'deep-nat',
            text: 'Your home router also swaps the laptop’s private address for its own public one on the way out, and back on anything that returns, error messages included.',
            cite: [rfc('rfc-3022', '2.2'), rfc('rfc-3022', '4.3'), rfc('rfc-4787', '3'), rfc('rfc-5508', '4.2.1')],
          },
        ],
        facts: [
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 1812, Requirements for IP Version 4 Routers', cite: [router('1')] },
          { id: 'fact-osi', label: 'OSI layer', value: '3, network', cite: [CISCO_L3, PALO_L3] },
          {
            id: 'fact-host-table',
            label: 'On your laptop',
            value: 'a tiny routing table: its own network, reached directly, and a default route to the gateway; route print shows it on Windows',
            cite: [MS_ROUTE_PARAMS, ...ROUTE_PRINT, host('3.3.1', 47), rfc('rfc-4632', '3.1')],
          },
          {
            id: 'fact-default',
            label: 'Default route',
            value: '0.0.0.0/0: matches every address, so it’s used only when nothing more specific matches',
            cite: [router('5.2.4.3'), cidr('3.1'), cidr('5.1')],
          },
          { id: 'fact-match', label: 'Which route wins', value: 'the longest matching prefix', cite: [router('5.2.4.3'), cidr('5.1'), CISCO_PREFIX] },
          {
            id: 'fact-hop',
            label: 'Each router',
            value: 'reads the destination, picks the next hop from its routing table, and passes the packet on',
            cite: [router('5.2.1.2'), CISCO_TABLE],
          },
          {
            id: 'fact-ttl',
            label: 'TTL',
            value: 'set by the sender; each router takes at least 1 off, and at 0 the packet is dropped',
            cite: [ip4('1.4'), host('3.2.1.7', 34), router('5.3.1')],
          },
          {
            id: 'fact-home',
            label: 'Your home router',
            value: 'has one way out, its link to your provider, so one default route covers everything outside',
            cite: [CISCO_STUB, rfc('rfc-1812', '7.5.2'), rfc('rfc-1812', '2.3'), rfc('rfc-3022', '2.2')],
          },
          {
            id: 'fact-no-route',
            label: 'No route at all',
            value:
              'a router with no route, not even a default route, drops the packet and sends back an ICMP destination unreachable message (type 3, code 0: network unreachable)',
            cite: [router('4.3.3.1'), router('5.2.4.3'), ICMP_UNREACHABLE, ICMP_TYPES],
          },
          { id: 'fact-gateway-name', label: 'Why “gateway”', value: 'older documents call routers gateways', cite: [router('2.2.3')] },
        ],
      },
      practice: [
        {
          id: 'where-first',
          prompt: 'Your laptop (192.168.1.100, on 192.168.1.0/24) has a packet for 203.0.113.80. Where does it send it first?',
          options: [
            {
              text: 'To its default gateway, your router.',
              feedback: 'Right. 203.0.113.80 isn’t on the laptop’s own network, so only its default route matches, and that points at the gateway.',
              cite: [host('3.3.1', 47), host('3.3.1.2', 48), MS_GATEWAY, cite('microsoft-route', 'Examples', { url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008#examples' })],
            },
            {
              text: 'Straight to 203.0.113.80.',
              feedback: 'Not quite. Only an address on the laptop’s own network gets a packet directly. This one is outside it, so it goes to the gateway.',
              cite: [host('3.3.1.1', 47)],
            },
            {
              text: 'To every device on the network at once.',
              feedback: 'Not quite. The laptop knows its default gateway, so it sends the packet to that one router.',
              cite: [host('3.3.1.2', 48), MS_GATEWAY],
            },
          ],
          answer: 0,
        },
        {
          id: 'which-route',
          prompt: 'A router’s table has 0.0.0.0/0 → router a, and 203.0.113.0/24 → router b. A packet arrives for 203.0.113.80. Where does it go?',
          options: [
            {
              text: 'Router b: 203.0.113.0/24 is the longer match.',
              feedback: 'Yes. Both routes match, and the most specific one, with the longest prefix, wins.',
              cite: [router('5.2.4.3'), cidr('5.1')],
            },
            {
              text: 'Router a: the default route comes first.',
              feedback: 'Not quite. The default route matches everything, but its prefix is the shortest. It’s only used when nothing more specific matches.',
              cite: [router('5.2.4.3')],
            },
            {
              text: 'Both, one copy each.',
              feedback: 'Not quite. The router sends a packet to one next hop, the one the longest matching route names.',
              cite: [router('2.2.3'), router('5.2.4.3')],
            },
          ],
          answer: 0,
        },
        {
          id: 'no-route',
          prompt: 'A router has no route for a packet’s destination, not even a default route. What happens?',
          options: [
            {
              text: 'It drops the packet and sends the sender a destination unreachable message.',
              feedback: 'Right: network unreachable.',
              cite: [router('4.3.3.1'), router('5.2.4.3')],
            },
            {
              text: 'It sends the packet back to the sender.',
              feedback: 'Not quite. The packet is dropped; only a short ICMP message goes back.',
              cite: [router('5.2.4.3'), ICMP_UNREACHABLE],
            },
            {
              text: 'It sends it to every router it knows, to be safe.',
              feedback: 'Not quite. A router doesn’t guess: with no matching route, it drops the packet.',
              cite: [router('5.2.4.3')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
