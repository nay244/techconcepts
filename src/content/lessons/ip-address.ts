import { defineLesson } from '../define';
import type { Backing, Cue, NoteEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * IP Address, Networking Concepts lesson 3. The office floor Subnetting draws, before it is cut: the Sales laptop's
 * address in decimal and in bits, the printer beside it (both private), the office router with a private address
 * inside and a public one (a documentation stand-in) on its link, the laptop's loopback address, and, rewound to the
 * moment the laptop joined, 0.0.0.0 sent to 255.255.255.255.
 *
 * The scene is the approved design's (prototypes/d12-batch-2.md sections 2.8, 2.9, 3.1 and 7): every event is a note,
 * the kinds are the log's Kind column, and every board has no prefix. The addresses 192.168.1.10, .20, .1, 203.0.113.6
 * and 203.0.113.5 (RFC 1918 and RFC 5737) are example data, as the figure draws them. 127.0.0.1, 0.0.0.0,
 * 255.255.255.255 and 169.254.x.x are facts and trace. The binary is the engine's conversion of 192.168.1.10. RFC 791
 * defines the address, RFC 1918 the private ranges, RFC 1122 and RFC 919 the special addresses a host handles, RFC 3927
 * link-local, RFC 5737 the documentation blocks, RFC 6890 the registry; the vendor pages carry no defining marker. No
 * standard places IP addresses at an OSI layer, so the badge rests on the two vendors What is IP cites. The analogy
 * (room numbers) cites nothing. Classes A, B and C are not taught: RFC 4632 replaced them.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 791 defines IPv4 and its addresses. */
const ip4 = (section: string) => rfc('rfc-791', section, true);
const rfc919 = (section: string) => rfc('rfc-919', section, true);
const rfc1918 = (section: string) => rfc('rfc-1918', section, true);
const rfc2663 = (section: string) => rfc('rfc-2663', section);
const rfc3927 = (section: string) => rfc('rfc-3927', section, true);
const rfc4632 = (section: string) => rfc('rfc-4632', section, true);
const rfc5737 = (section: string) => rfc('rfc-5737', section, true);
const rfc6890 = (section: string) => rfc('rfc-6890', section, true);
const rfc8200 = (section: string) => rfc('rfc-8200', section, true);

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it starts on. */
const host = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });
/** Section 3.2.1.3 lists (a) 0.0.0.0 and (c) the limited broadcast on page 30, and (g) loopback on page 31. */
const THIS_HOST = host('3.2.1.3', 30);
const LOOPBACK = host('3.2.1.3', 31);
const MULTIHOMED = host('3.3.4.1', 60);

/** NIST SP 800-41 Rev. 1, by the PDF page. A guide to firewalls, not the standard for addresses: no marker. */
const NIST_PDF = SOURCES['nist-sp800-41r1']!.url;
const NIST_PUBLIC = cite('nist-sp800-41r1', '3.2', { url: `${NIST_PDF}#page=25` });
const NIST_LOOPBACK = cite('nist-sp800-41r1', '4.1.1', { url: `${NIST_PDF}#page=28` });
const NIST_RANGES = cite('nist-sp800-41r1', '4.1.1', { url: `${NIST_PDF}#page=29` });

/** IANA's registry as it is kept now: its table by block and its header by column. A registry, not a standard: no marker. */
const IANA = 'https://www.iana.org/assignments/iana-ipv4-special-registry';
const iana = (block: string) => cite('iana-ipv4-special', `Registry table: ${block}`, { url: `${IANA}#table-iana-ipv4-special-registry-1` });
const IANA_HEADER = cite('iana-ipv4-special', 'Registry header: the columns', { url: `${IANA}#iana-ipv4-special-registry-1` });

/** Cisco's page has no heading ids, so a section is cited by a text fragment that starts in it. A vendor's own page: no marker. */
const CISCO_SUBNETS = SOURCES['cisco-ip-subnets']!.url;
const CISCO_ADDRESSES = cite('cisco-ip-subnets', 'Understand IP Addresses', { url: `${CISCO_SUBNETS}#:~:text=The%20address%20is%20made%20up%20of%2032%20binary%20bits` });
/** Microsoft's page, by heading. */
const MS_SUBNETTING = SOURCES['microsoft-tcpip-subnetting']!.url;
const ms = (section: string, heading: string) => cite('microsoft-tcpip-subnetting', section, { url: `${MS_SUBNETTING}#${heading}` });
const MS_ADDRESSES = ms('IP addresses: networks and hosts', 'ip-addresses-networks-and-hosts');
const MS_GLOSSARY = ms('Glossary', 'glossary');
const MS_MASK = ms('Subnet mask', 'subnet-mask');
const MS_IPCONFIG = cite('microsoft-ipconfig', 'Introduction', {
  url: `${SOURCES['microsoft-ipconfig']!.url}#:~:text=Used%20without%20parameters`,
});
const MS_IPCONFIG_ALL = cite('microsoft-ipconfig', 'Syntax', { url: `${SOURCES['microsoft-ipconfig']!.url}#syntax` });

/** No standard puts IP addresses at an OSI layer, so the badge rests on two vendors, as What is IP's and Subnetting's do. */
const CLOUDFLARE = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const MICROSOFT_OSI = 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model';
const OSI_L3 = [
  cite('cloudflare-network-layers', 'Network Layers', { url: `${CLOUDFLARE}#:~:text=3%20Network%20layer` }),
  cite('microsoft-osi', 'Transport layer', { url: `${MICROSOFT_OSI}#transport-layer` }),
];

// ---------------------------------------------------------------- events

const traced = (...traces: string[]): Backing => ({ traces });
const cues = (o: Record<string, string>): Cue[] => Object.entries(o).map(([cue, arg]) => ({ cue, arg }));

/** One note: the address the board shows, the log's three cells, and the Learn parts that state them. */
function note(o: {
  id: string;
  glyph?: NoteEvent['glyph'];
  cues: Record<string, string>;
  board: { addr: string; who: string; third?: { who: string; addr: string } };
  cells: { addr: string; kind: string; plain: string };
  traces: string[];
}): NoteEvent {
  return {
    type: 'note',
    id: o.id,
    glyph: o.glyph ?? 'request',
    log: { addr: o.cells.addr, kind: o.cells.kind },
    plain: o.cells.plain,
    cues: cues(o.cues),
    // No board has a prefix (no marks), and the third row stays a plain second address.
    board: { addr: o.board.addr, who: o.board.who, prefix: null, ...(o.board.third === undefined ? {} : { third: { ...o.board.third, mode: 'cmp' as const } }) },
    backing: traced(...o.traces),
  };
}

const LAPTOP = '192.168.1.10';
const PRINTER = '192.168.1.20';
const ROUTER_INSIDE = '192.168.1.1';
const ROUTER_LINK = '203.0.113.6';
const DASH = '—';

const step1: NoteEvent[] = [
  note({
    id: 's1-n1',
    cues: { glow: 'laptop', focus: 'sales' },
    board: { addr: LAPTOP, who: 'Sales laptop' },
    cells: { addr: LAPTOP, kind: DASH, plain: 'Four octets, 32 bits' },
    traces: ['term-ip', 'fact-ipv4', 'term-octet', 'fact-binary'],
  }),
];

const step2: NoteEvent[] = [
  note({
    id: 's2-n1',
    cues: { focus: 'sales', pulse: 'onenet' },
    board: { addr: LAPTOP, who: 'Sales laptop', third: { who: 'Printer', addr: PRINTER } },
    cells: { addr: LAPTOP, kind: 'private', plain: 'In 192.168.0.0/16' },
    traces: ['term-private', 'fact-private'],
  }),
  note({
    id: 's2-n2',
    cues: { focus: 'sales', pulse: 'onenet' },
    board: { addr: LAPTOP, who: 'Sales laptop', third: { who: 'Printer', addr: PRINTER } },
    cells: { addr: PRINTER, kind: 'private', plain: 'Same network, 192.168.1.0/24' },
    traces: ['term-private', 'fact-private', 'fact-network-part'],
  }),
];

const step3: NoteEvent[] = [
  note({
    id: 's3-n1',
    cues: { focus: 'router' },
    board: { addr: ROUTER_INSIDE, who: 'Router, inside', third: { who: 'Router, link', addr: ROUTER_LINK } },
    cells: { addr: ROUTER_INSIDE, kind: 'private', plain: 'The router’s inside address' },
    traces: ['term-private', 'fact-private', 'fact-several'],
  }),
  note({
    id: 's3-n2',
    glyph: 'response',
    cues: { route: 'link', busy: 'provider', focus: 'provider' },
    board: { addr: ROUTER_INSIDE, who: 'Router, inside', third: { who: 'Router, link', addr: ROUTER_LINK } },
    cells: { addr: ROUTER_LINK, kind: 'public (an example)', plain: 'Toward the provider, 203.0.113.5' },
    traces: ['term-public', 'fact-several', 'fact-documentation'],
  }),
];

const step4: NoteEvent[] = [
  note({
    id: 's4-n1',
    cues: { glow: 'laptop', focus: 'sales' },
    board: { addr: LAPTOP, who: 'Sales laptop', third: { who: 'Loopback', addr: '127.0.0.1' } },
    cells: { addr: '127.0.0.1', kind: 'special: loopback', plain: 'Stays inside the laptop' },
    traces: ['term-special', 'term-loopback', 'fact-loopback', 'fact-several'],
  }),
];

const step5: NoteEvent[] = [
  note({
    id: 's5-n1',
    glyph: 'broadcast',
    cues: { ring: 'all' },
    board: { addr: '0.0.0.0', who: 'No address', third: { who: 'Everyone here', addr: '255.255.255.255' } },
    cells: { addr: '0.0.0.0 → 255.255.255.255', kind: 'special', plain: 'Everyone on this network' },
    traces: ['term-special', 'fact-this-host', 'term-broadcast', 'fact-broadcast'],
  }),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'ip-address',
  title: 'IP Address',
  subtitle: 'Where a device is, and what kind',
  level: 'beginner',
  certTags: [],
  summary: 'Read an IP address in decimal and in bits, then tell private, public and special addresses apart.',
  figure: 'subnet',
  backing: traced('term-ip', 'lead-1', 'lead-2', 'term-dotted', 'term-binary'),
  units: [
    {
      id: 'ip-address',
      name: 'IP Address',
      fullName: 'Internet Protocol address',
      purpose: 'Saying where a device is',
      osi: { layers: [3], cite: OSI_L3 },
      backing: traced('fact-stands-for', 'term-ip'),
      scene: {
        title: 'The office’s addresses',
        views: ['network'],
        layers: [],
        labels: {},
        start: [],
        panel: { type: 'bits' },
        log: {
          title: 'Addresses',
          idle: 'No address read yet. Press Play, or pick a step.',
          columns: [
            { key: 'addr', label: 'Address', width: 230, strong: true },
            { key: 'kind', label: 'Kind', width: 160, strong: true, prose: true },
            { key: 'plain', label: 'In plain words', prose: true },
          ],
          legend: [
            { kind: 'request', label: 'Address read' },
            { kind: 'response', label: 'Sent' },
            { kind: 'broadcast', label: 'Broadcast' },
          ],
        },
        parties: [],
        backing: traced('fact-network-part', 'fact-documentation', 'term-private', 'lead-1', 'term-broadcast'),
      },
      overview: {
        hook: 'The Sales laptop’s address is 192.168.1.10: four numbers from 0 to 255, which can also be written as 32 ones and zeros. Some addresses are private and reused by many networks, some are public and unique on the internet, and a few are set aside for one special job, like 127.0.0.1, which never leaves the device.',
        hookBacking: traced('term-ip', 'fact-ipv4', 'term-binary', 'term-private', 'term-public', 'term-special', 'fact-loopback'),
        description: 'An IP address says where a device is. Read it in decimal or in bits, then ask what kind it is: private, public or special.',
        backing: traced('term-ip', 'term-dotted', 'term-binary', 'lead-2', 'pattern'),
        facts: [
          { label: 'Size', value: '32 bits (IPv4)', backing: traced('fact-ipv4') },
          { label: 'Written as', value: 'four numbers, each 0 to 255', backing: traced('fact-ipv4', 'term-dotted') },
          { label: 'Private ranges', value: '10/8, 172.16/12, 192.168/16', backing: traced('fact-private') },
          { label: 'Special, for example', value: '127.0.0.1, 255.255.255.255', backing: traced('fact-loopback', 'fact-broadcast', 'term-special') },
          { label: 'OSI layer', value: '3, network', backing: traced('fact-osi') },
          { label: 'Defined in', value: 'RFC 791', backing: traced('fact-defined') },
        ],
      },
      steps: [
        {
          id: 'four-numbers',
          title: 'Four numbers, 32 bits',
          sub: 'Decimal and binary',
          narrative:
            'The Sales laptop’s **IP address** is 192.168.1.10: the number that says where it is on the network. It’s four numbers with dots between them, written in **dotted decimal**. Each number is an **octet**, 8 bits, so it runs from 0 to 255. Under the map, the same address is shown in **binary**, 32 ones and zeros: 192 is 11000000, 168 is 10101000, 1 is 00000001 and 10 is 00001010.',
          deep: [
            {
              text: 'IPv6, the newer version, makes addresses 128 bits long instead of 32.',
              cite: [rfc8200('1')],
            },
          ],
          facts: [
            { label: 'Address', value: LAPTOP, backing: { example: true } },
            { label: 'Written as', value: 'four numbers, each 0 to 255', backing: traced('fact-ipv4', 'term-dotted') },
            { label: 'In bits', value: '32, in four octets of 8', backing: traced('fact-ipv4', 'term-octet', 'fact-binary') },
            { label: 'How many there are', value: 'about 4.3 billion', backing: traced('fact-count') },
          ],
          events: step1,
          backing: traced('term-ip', 'term-dotted', 'term-octet', 'term-binary', 'fact-ipv4', 'fact-binary', 'fact-count', 'lead-1'),
        },
        {
          id: 'private',
          title: 'Private: inside the office',
          sub: 'Reused by many networks',
          narrative:
            'The printer beside the laptop is 192.168.1.20. Both addresses are in 192.168.0.0/16, one of the ranges set aside for private networks, so both are **private addresses**. Any home or office may use them without asking anyone, so many networks reuse the same numbers, and private addresses aren’t carried across the internet. Inside one network, each is used once. The two also share their first part, 192.168.1, because they’re on the same network: 192.168.1.0/24 names that whole network, its first 24 bits. Where that line falls isn’t written in the address; Subnetting shows how it’s set.',
          deep: [
            {
              text: 'The other two private ranges are 10.0.0.0/8 and 172.16.0.0/12.',
              cite: [rfc1918('3'), NIST_RANGES],
            },
          ],
          facts: [
            { label: 'Range', value: '192.168.0.0/16, private', backing: traced('fact-private', 'term-private') },
            { label: 'Used by', value: 'many networks at once', backing: traced('term-private', 'why-1') },
            { label: 'Across the internet', value: 'not carried', backing: traced('term-private') },
            { label: 'Network', value: '192.168.1.0/24', backing: traced('fact-network-part') },
          ],
          events: step2,
          backing: traced('term-private', 'fact-private', 'why-1', 'fact-network-part', 'deep-1'),
        },
        {
          id: 'router',
          title: 'One router, two addresses',
          sub: 'Private inside, public outside',
          narrative:
            'The office router has two addresses, one for each side: 192.168.1.1 on the office network, private like the rest, and 203.0.113.6 on its link to the provider’s router, 203.0.113.5. An address belongs to a connection, so a device with two connections has two addresses. A **public address** is unique on the whole internet and handed out through a registry. 203.0.113.6 stands in for one: it’s from a range set aside for examples like this one, which isn’t used on the internet itself.',
          deep: [
            {
              text: 'A host with more than one address is called multihomed.',
              cite: [MULTIHOMED, ip4('2.3')],
            },
          ],
          facts: [
            { label: 'Inside', value: '192.168.1.1, private', backing: traced('fact-several', 'term-private', 'fact-private') },
            { label: 'On the link', value: '203.0.113.6, public here', backing: traced('term-public', 'fact-several', 'fact-documentation') },
            { label: 'Really from', value: '203.0.113.0/24, set aside for examples', backing: traced('fact-documentation') },
          ],
          events: step3,
          backing: traced('fact-several', 'term-public', 'term-private', 'fact-private', 'fact-documentation'),
        },
        {
          id: 'loopback',
          title: 'Loopback: 127.0.0.1',
          sub: 'It never leaves the laptop',
          narrative:
            'Back at the laptop. Besides 192.168.1.10, it has another address: 127.0.0.1, its **loopback address**. Anything the laptop sends there stays inside the laptop and never goes out on the network, so nothing moves on the map. Every address that starts with 127 works the same way. It’s a **special-purpose address**: one of the blocks set aside for one job, which IANA lists.',
          deep: [
            {
              text: 'IANA’s registry lists loopback as 127.0.0.0/8, the block RFC 1122 sets aside.',
              cite: [iana('127.0.0.0/8 Loopback'), LOOPBACK],
            },
          ],
          facts: [
            { label: 'Address', value: '127.0.0.1', backing: traced('fact-loopback') },
            { label: 'Block', value: '127.0.0.0/8', backing: traced('fact-loopback') },
            { label: 'On the network', value: 'never', backing: traced('term-loopback') },
          ],
          events: step4,
          backing: traced('term-loopback', 'fact-loopback', 'term-special', 'fact-several'),
        },
        {
          id: 'no-address',
          title: 'No address yet: 0.0.0.0 to everyone',
          sub: 'Two more special addresses',
          narrative:
            'Rewind to the moment the laptop joined the network, before it had 192.168.1.10. A device with no address yet sends from 0.0.0.0, which means “this host on this network”. It sends to 255.255.255.255, the **limited broadcast**: every device on this network gets it, and routers don’t pass it on. A device that doesn’t know its network yet can use it to ask a server. If nothing hands it an address, it may give itself a **link-local** address, 169.254.x.x, which only reaches its neighbours.',
          deep: [
            {
              text: 'Link-local addresses suit networks where no other way of configuring addresses is available.',
              cite: [rfc3927('1'), iana('169.254.0.0/16 Link Local')],
            },
          ],
          facts: [
            { label: 'From', value: '0.0.0.0, no address yet', backing: traced('fact-this-host') },
            { label: 'To', value: '255.255.255.255, everyone on this network', backing: traced('fact-broadcast', 'term-broadcast') },
            { label: 'If nothing hands it one', value: '169.254.x.x, neighbours only', backing: traced('fact-link-local', 'term-link-local') },
          ],
          events: step5,
          backing: traced('fact-this-host', 'term-broadcast', 'fact-broadcast', 'term-link-local', 'fact-link-local', 'term-special'),
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'An IP address is the number that says where a device is on a network. An IPv4 address is 32 bits, written as four numbers from 0 to 255, like 192.168.1.10.',
            cite: [ip4('2.3'), CISCO_ADDRESSES, MS_ADDRESSES],
          },
          {
            id: 'lead-2',
            text: 'Some addresses are private, reused inside many networks; some are public, unique on the internet; and some blocks are set aside for one special job.',
            cite: [rfc1918('3'), rfc2663('2.7'), rfc6890('1'), IANA_HEADER, NIST_PUBLIC],
          },
          {
            id: 'lead-3',
            text: 'Like room numbers: every building has a Room 101, but each building’s street address is unique, and a few numbers, like the front desk’s, mean the same thing everywhere.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-ip',
            idea: 'The number that says where a device is',
            name: 'IP address',
            cite: [ip4('2.3'), CISCO_ADDRESSES, MS_ADDRESSES],
          },
          {
            id: 'term-dotted',
            idea: 'Four numbers with dots between them, like 192.168.1.10',
            name: 'Dotted decimal',
            cite: [CISCO_ADDRESSES, MS_ADDRESSES],
          },
          {
            id: 'term-octet',
            idea: 'One of the four numbers: 8 bits, from 0 to 255',
            name: 'Octet',
            cite: [ip4('2.3'), CISCO_ADDRESSES, MS_GLOSSARY],
          },
          {
            id: 'term-binary',
            idea: 'The same address written as 32 ones and zeros',
            name: 'Binary',
            cite: [MS_ADDRESSES, CISCO_ADDRESSES],
          },
          {
            id: 'term-private',
            idea: 'An address from the ranges set aside for private networks, reused by many networks, unique only inside its own, and not carried across the internet',
            name: 'Private address',
            cite: [rfc1918('3'), NIST_RANGES],
          },
          {
            id: 'term-public',
            idea: 'An address that is unique on the whole internet, handed out through registries and providers; a home or office router usually has one, on its outside',
            name: 'Public address',
            cite: [rfc2663('2.7'), rfc('rfc-1918', '3'), rfc('rfc-4632', '3.1'), NIST_PUBLIC],
          },
          {
            id: 'term-special',
            idea: 'A block set aside for one job, which IANA lists: 127.0.0.0/8, 0.0.0.0 and 255.255.255.255 among them',
            name: 'Special-purpose address',
            cite: [rfc6890('1'), IANA_HEADER, iana('0.0.0.0/32, 127.0.0.0/8, 255.255.255.255/32')],
          },
          {
            id: 'term-loopback',
            idea: 'An address that never leaves the device: any address starting 127',
            name: 'Loopback address',
            cite: [LOOPBACK, iana('127.0.0.0/8 Loopback'), NIST_LOOPBACK, NIST_RANGES],
          },
          {
            id: 'term-broadcast',
            idea: '255.255.255.255: every device on this network, and no farther',
            name: 'Limited broadcast',
            cite: [THIS_HOST, rfc919('7'), iana('255.255.255.255/32 Limited Broadcast')],
          },
          {
            id: 'term-link-local',
            idea: 'An address a device may give itself when nothing hands it one; it only reaches its neighbours',
            name: 'Link-local address',
            cite: [rfc3927('1'), iana('169.254.0.0/16 Link Local')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Private', 'Public', 'Loopback', 'Limited broadcast', 'Link-local', 'Documentation'],
          note: 'Six of the kinds of IPv4 address this lesson meets. IANA’s list of special-purpose blocks has more.',
          cite: [rfc1918('3'), rfc2663('2.7'), LOOPBACK, THIS_HOST, rfc919('7'), rfc3927('1'), rfc5737('3'), rfc6890('1'), iana('203.0.113.0/24 Documentation (TEST-NET-3)')],
        },
        why: [
          {
            id: 'why-1',
            text: 'Private ranges let every home and office number its own devices without asking anyone, and reuse the same numbers.',
            cite: [rfc1918('3'), rfc2663('2.8')],
          },
          {
            id: 'why-2',
            text: 'Special-purpose blocks are set aside by the IETF and listed in one place, IANA’s registry, so everyone can look up what each one is for.',
            cite: [rfc6890('1'), IANA_HEADER],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'Where the network part ends isn’t written in the address: a mask, or the /24 after a prefix, says so. The Subnetting lesson shows how.',
            cite: [rfc4632('3.1'), MS_MASK],
          },
          {
            id: 'deep-2',
            text: 'Old guides sort addresses into classes A, B and C. Since CIDR, classes no longer decide which bits are the network part.',
            cite: [rfc4632('3.1'), MS_MASK],
          },
        ],
        facts: [
          {
            id: 'fact-ipv4',
            label: 'IPv4 address',
            value: '32 bits: four octets of 8 bits, each 0 to 255',
            cite: [ip4('2.3'), CISCO_ADDRESSES, MS_GLOSSARY],
          },
          {
            id: 'fact-binary',
            label: 'In binary',
            value: '192.168.1.10 is 11000000.10101000.00000001.00001010',
            cite: [MS_ADDRESSES, CISCO_ADDRESSES],
          },
          { id: 'fact-count', label: 'How many', value: '2^32, about 4.3 billion', cite: [ip4('2.3'), rfc4632('3.1')] },
          {
            id: 'fact-network-part',
            label: 'Network part',
            value: 'a prefix such as 192.168.1.0/24 names a whole network; the addresses on it share those first 24 bits',
            cite: [rfc4632('3.1'), MS_ADDRESSES],
          },
          {
            id: 'fact-several',
            label: 'Addresses per device',
            value: 'a device can have several: an address is given to a connection, so two connections mean two addresses',
            cite: [ip4('2.3'), MULTIHOMED, MS_IPCONFIG, MS_IPCONFIG_ALL],
          },
          { id: 'fact-private', label: 'Private ranges', value: '10/8, 172.16/12, 192.168/16', cite: [rfc1918('3'), NIST_RANGES] },
          {
            id: 'fact-loopback',
            label: 'Loopback',
            value: '127.0.0.0/8, such as 127.0.0.1: never leaves the device',
            cite: [LOOPBACK, iana('127.0.0.0/8 Loopback'), NIST_LOOPBACK, NIST_RANGES],
          },
          {
            id: 'fact-this-host',
            label: '0.0.0.0',
            value: '“this host on this network”: sent only as a source, by a device that doesn’t have its address yet',
            cite: [THIS_HOST, iana('0.0.0.0/32 This host on this network')],
          },
          {
            id: 'fact-broadcast',
            label: '255.255.255.255',
            value: 'everyone on this network; routers don’t pass it on; a device that doesn’t know its network yet can use it to ask a server',
            cite: [THIS_HOST, rfc919('7'), iana('255.255.255.255/32 Limited Broadcast')],
          },
          {
            id: 'fact-link-local',
            label: '169.254.0.0/16',
            value: 'a device may give itself one when nothing hands it an address; it only reaches its neighbours',
            cite: [rfc3927('1'), iana('169.254.0.0/16 Link Local')],
          },
          {
            id: 'fact-documentation',
            label: 'For examples',
            value: '192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24: not used on the internet itself',
            cite: [rfc5737('3'), rfc5737('4'), iana('203.0.113.0/24 Documentation (TEST-NET-3)')],
          },
          { id: 'fact-ipv6', label: 'IPv6', value: '128 bits, like 2001:db8::80', cite: [rfc8200('1')] },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 791 (IPv4 addresses); RFC 1918 (private); RFC 6890 and IANA’s registry (special)',
            cite: [ip4('2.3'), rfc1918('3'), rfc6890('1'), IANA_HEADER],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '3, network', cite: OSI_L3 },
          { id: 'fact-stands-for', label: 'Stands for', value: 'Internet Protocol address', cite: [ip4('1.1'), ip4('2.3'), MS_IPCONFIG] },
        ],
      },
      practice: [
        {
          id: 'which-private',
          prompt: 'Which of these is a private address?',
          options: [
            {
              text: '192.168.1.20',
              feedback: 'Right. It’s in 192.168.0.0/16, a private range.',
              cite: [rfc1918('3'), NIST_RANGES],
            },
            {
              text: '203.0.113.6',
              feedback: 'Not quite. 203.0.113.x is set aside for examples. It isn’t one of the private ranges.',
              cite: [rfc5737('3'), iana('203.0.113.0/24 Documentation (TEST-NET-3)'), rfc1918('3')],
            },
            {
              text: '127.0.0.1',
              feedback: 'Not quite. That’s loopback: it never leaves the device.',
              cite: [LOOPBACK, iana('127.0.0.0/8 Loopback'), NIST_LOOPBACK],
            },
          ],
          answer: 0,
        },
        {
          id: 'not-an-address',
          prompt: 'Which of these can’t be an IPv4 address?',
          options: [
            {
              text: '192.168.1.256',
              feedback: 'Right. Each number is 8 bits, so it stops at 255.',
              cite: [ip4('2.3'), CISCO_ADDRESSES, MS_GLOSSARY],
            },
            {
              text: '10.0.0.1',
              feedback: 'Not quite. It’s a real address, from a private range.',
              cite: [rfc1918('3'), NIST_RANGES],
            },
            {
              text: '255.255.255.255',
              feedback: 'Not quite. It’s real: the limited broadcast, everyone on this network.',
              cite: [THIS_HOST, rfc919('7')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
