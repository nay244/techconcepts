import { formatIPv4, parseIPv4, toOctetBits, type IPv4 } from '../../engine/net/ipv4';
import { maskFromPrefix, sameSubnet, subnetInfo, type SubnetInfo } from '../../engine/net/subnet';
import { calc, checkStated, subnetValue, type Stated } from '../helpers/subnet-events';
import { defineLesson } from '../define';
import type { Backing, Board, Cue, NoteEvent } from '../schema';
import { cite } from '../sources';

/**
 * Subnetting, lesson 7 of 20. An office cuts its one /24 into four /26s, one
 * per team: the learner sees an address split
 * into its network and host parts, works out the mask, the network and
 * broadcast addresses and the usable addresses, borrows 2 bits to cut the
 * floor, checks whether two devices are on the same subnet, and ends on a /30
 * link to the provider.
 *
 * The words are the approved mockup's (subnet-v1.html), changed only where a
 * source does not state them. The addresses (RFC 1918 and RFC 5737) are example
 * data, and the analogies (the street, the card with holes) cite nothing.
 * Every number is the
 * engine's (src/engine/net): each log row is worked out by `calc`, the boards
 * take their network and broadcast rows from the engine, the bare values (the
 * scene's title, the facts, Practice's number options) are worked out here, and
 * `STATED` pins each number a sentence states to the place it is written,
 * checked against the engine as the lesson loads, so a wrong one stops the build.
 */

// ------------------------------------------------------------------ citations

/** A citation of one section of an RFC, optionally marked as the defining standard, optionally at a named fragment. */
const rfc = (source: string, section: string, defining = false, fragment?: string) =>
  cite(source, section, {
    ...(fragment === undefined ? {} : { url: `https://www.rfc-editor.org/rfc/${source.replace('-', '')}.html#${fragment}` }),
    ...(defining ? { defining: true as const } : {}),
  });
/** RFC 1122 and RFC 950 have no ids below their top-level sections, so a section is cited by the page it starts on. */
const host = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });
const rfc950 = (section: string, page: number, defining = true) =>
  cite('rfc-950', section, { url: `https://www.rfc-editor.org/rfc/rfc950.html#page-${page}`, ...(defining ? { defining: true as const } : {}) });
/** RFC 1122 where it does not define the thing claimed (the OSI layer). */
const hostPlain = (section: string, page: number) => cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}` });
/** RFC 826 has no section ids, so a section is cited by a text fragment that starts in it. */
const ARP_GENERATION = cite('rfc-826', 'Packet Generation', {
  url: 'https://www.rfc-editor.org/rfc/rfc826.html#:~:text=As%20a%20packet%20is%20sent%20down%20through%20the%20network%20layers',
  defining: true,
});

/** Microsoft's page, by heading. A vendor's own documentation, so none is marked defining. */
const MICROSOFT_SUBNETTING = 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting';
const ms = (section: string, heading: string) => cite('microsoft-tcpip-subnetting', section, { url: `${MICROSOFT_SUBNETTING}#${heading}` });

/** Cisco's two pages have no heading ids to cite, so each section is cited by a text fragment that starts in it. */
const CISCO_SUBNETS = 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html';
const CISCO_QUANTITIES = 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13790-8.html';
const CISCO_ADDRESSES = cite('cisco-ip-subnets', 'Understand IP Addresses', { url: `${CISCO_SUBNETS}#:~:text=The%20address%20is%20made%20up%20of%2032%20binary%20bits` });
const CISCO_MASKS = cite('cisco-ip-subnets', 'Network Masks', { url: `${CISCO_SUBNETS}#:~:text=Any%20address%20bits%20which%20have%20corresponding%20mask%20bits` });
const CISCO_SUBNETTING = cite('cisco-ip-subnets', 'Understand Subnetting', { url: `${CISCO_SUBNETS}#:~:text=Each%20data%20link%20on%20a%20network%20must%20have` });
const CISCO_EXERCISE = cite('cisco-ip-subnets', 'Sample Exercise 1', { url: `${CISCO_SUBNETS}#:~:text=Look%20at%20the%20address%20bits%20that%20have` });
const CISCO_VLSM = cite('cisco-ip-subnets', 'VLSM', { url: `${CISCO_SUBNETS}#:~:text=Variable%20Length%20Subnet%20Masks` });
const CISCO_CIDR = cite('cisco-ip-subnets', 'CIDR', { url: `${CISCO_SUBNETS}#:~:text=Length%20means%20the%20number%20of%20left-most` });
const CISCO_31BIT = cite('cisco-ip-subnets', '31-bit Subnets', { url: `${CISCO_SUBNETS}#:~:text=A%2030-bit%20subnet%20mask%20allows%20for%20four` });
const CISCO_BACKGROUND = cite('cisco-host-subnet-quantities', 'Background Information', { url: `${CISCO_QUANTITIES}#:~:text=An%20IP%20address%20is%2032%20bits%20long` });
const CISCO_SUBNETTING_TABLES = cite('cisco-host-subnet-quantities', 'Subnetting and Tables', { url: `${CISCO_QUANTITIES}#:~:text=As%20a%20concept%2C%20subnetting%20divides%20the%20network` });
const CISCO_TABLE = cite('cisco-host-subnet-quantities', 'Class C Host/Subnet Table', { url: `${CISCO_QUANTITIES}#:~:text=Class%20C%20Host%2FSubnet%20Table` });
const CISCO_QUANTITIES_B = cite('cisco-host-subnet-quantities', 'Class B Host/Subnet Table', { url: `${CISCO_QUANTITIES}#:~:text=Class%20B%20Host%2FSubnet%20Table` });
const CISCO_EXAMPLE = cite('cisco-host-subnet-quantities', 'Subnet Example', { url: `${CISCO_QUANTITIES}#:~:text=A%20host%20portion%20with%20all%20zeros` });

/** No standard puts IP at an OSI layer, so the badge rests on two vendors, as What is IP's does. */
const CLOUDFLARE = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const MICROSOFT_OSI = 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model';
const OSI_L3 = [
  cite('cloudflare-network-layers', 'Network Layers', { url: `${CLOUDFLARE}#:~:text=3%20Network%20layer` }),
  cite('microsoft-osi', 'Transport layer', { url: `${MICROSOFT_OSI}#transport-layer` }),
];

/** A backing that traces to cited Learn parts. */
const traces = (...ids: string[]): Backing => ({ traces: ids });

// ------------------------------------------------------------------ the office

/** The office's addresses: the devices the lesson follows, and the office router's end of the link to the provider. */
const LAPTOP = '192.168.1.10';
const PRINTER = '192.168.1.20';
const DESIGN_PC = '192.168.1.70';
const OFFICE_ROUTER_LINK = '203.0.113.6';

/** The floor is one /24; step 4 cuts it into /26s, one per team; the link to the provider is a /30. */
const FLOOR = 24;
const CUT = 26;
const LINK = 30;
/** The prefix RFC 3021 lets a two-router link use instead. */
const RFC_3021_LINK = 31;
/** The prefixes Learn's facts list, from /25 to the link's /30. */
const LEARN_PREFIXES = [25, 26, 27, 28, 29, 30];

function parse(addr: string): IPv4 {
  const parsed = parseIPv4(addr);
  if (!parsed.ok) throw new Error(`Subnetting: "${addr}" is not an address.`);
  return parsed.value;
}
const info = (addr: string, prefix: number): SubnetInfo => subnetInfo(parse(addr), prefix);
const network = (addr: string, prefix: number): string => formatIPv4(info(addr, prefix).network);
const broadcast = (addr: string, prefix: number): string => formatIPv4(info(addr, prefix).broadcast);
const bitsOf = (value: IPv4): string => toOctetBits(value).join('');
/** An address's last number, as the lesson writes it: ".64". */
const last = (value: IPv4): string => `.${value & 255}`;
const mask = (prefix: number): string => formatIPv4(maskFromPrefix(prefix));
const ones = (prefix: number): number => [...bitsOf(maskFromPrefix(prefix))].filter((b) => b === '1').length;
const zeros = (prefix: number): number => [...bitsOf(maskFromPrefix(prefix))].filter((b) => b === '0').length;
/** Any address will do for a count: every subnet of a prefix has as many addresses. */
const total = (prefix: number): number => subnetInfo(0, prefix).totalAddresses;
const usable = (prefix: number): number => subnetInfo(0, prefix).usableHosts;
const hostBits = (prefix: number): number => ADDRESS_BITS - prefix;

/** An address is 32 bits, four octets of 8, each from 0 to 255. */
const ADDRESS_BITS = bitsOf(0).length;
const OCTET_BITS = toOctetBits(0)[0].length;
const OCTET_MIN = parseInt(toOctetBits(0)[0], 2);
const OCTET_MAX = parseInt(toOctetBits(0xffffffff)[0], 2);
/** What a host bit is set to in the network address, and in the broadcast address. */
const NETWORK_BIT = bitsOf(info(LAPTOP, FLOOR).network).at(-1)!;
const BROADCAST_BIT = bitsOf(info(LAPTOP, FLOOR).broadcast).at(-1)!;
/** A mask's bit for the network part, and for the host part. */
const MASK_NETWORK_BIT = bitsOf(maskFromPrefix(FLOOR))[0]!;
const MASK_HOST_BIT = bitsOf(maskFromPrefix(FLOOR)).at(-1)!;

const floor = info(LAPTOP, FLOOR);
const sales = info(LAPTOP, CUT);
const design = info(DESIGN_PC, CUT);
const link = info(OFFICE_ROUTER_LINK, LINK);
/** The provider's router, at the other end of the link. */
const PROVIDER_LINK = formatIPv4(link.firstHost);
/** The two addresses every ordinary subnet keeps back: its network and broadcast addresses. */
const KEPT_BACK = floor.totalAddresses - floor.usableHosts;
/** Every subnet of the cut floor: one per team. */
const cutSubnets = Array.from({ length: floor.totalAddresses / sales.totalAddresses }, (_, i) =>
  subnetInfo(floor.network + i * sales.totalAddresses, CUT),
);
/** The bits an address has where the cut borrowed them: "00" for the laptop, "01" for the Design PC. */
const borrowed = (addr: string): string => bitsOf(parse(addr)).slice(FLOOR, CUT);
/** Every value the borrowed bits can take: 00, 01, 10 and 11. */
const borrowedValues = cutSubnets.map((s) => bitsOf(s.network).slice(FLOOR, CUT));
const ORDINALS = ['first', 'second', 'third', 'fourth'];
const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four'];
/** A superscript power, as the facts write 2⁸. */
const superscript = (n: number): string => [...String(n)].map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');
/** "1, 2 and 3". */
const list = (items: string[]): string => `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

const laptop = parse(LAPTOP);
const printer = parse(PRINTER);
const designPc = parse(DESIGN_PC);
const matches = (a: IPv4, b: IPv4, prefix: number, yes: string, no: string): string => (sameSubnet(a, b, prefix) ? yes : no);
/** Which of the cut floor's subnets the Design PC is in, counting from 0. */
const designIndex = cutSubnets.findIndex((s) => s.network === design.network);
/** The floor, as the scene's title and the overview write it: 192.168.1.0/24. */
const FLOOR_CIDR = `${formatIPv4(floor.network)}/${FLOOR}`;
/** A bit has two values: a /31's one host bit makes 2 addresses. The base of "2 to the power of the host bits". */
const BIT_VALUES = total(ADDRESS_BITS - 1);
/** The router takes the first address of each subnet, so the laptop's default gateway is the Sales subnet's first. */
const GATEWAY = formatIPv4(sales.firstHost);
/** One more bit borrowed than the cut: Practice's wrong answer, a /27's usable count. */
const NEXT_CUT = CUT + 1;
/** The documentation block the link's addresses come from (RFC 5737's TEST-NET-3), a /24. */
const DOCUMENTATION_PREFIX = 24;

// ------------------------------------------------------------------ the boards

const LAPTOP_BOARD = { addr: LAPTOP, who: 'Laptop' };
const DESIGN_PC_BOARD = { addr: DESIGN_PC, who: 'Design PC' };
const LINK_BOARD = { addr: OFFICE_ROUTER_LINK, who: 'Office router' };
/** The laptop's address at /24, for the portions the words name. */
const floorBoard: Board = { ...LAPTOP_BOARD, prefix: FLOOR };

/** A note comparing the board's address with its third row: the row says whether the network parts match, as the engine finds. */
function compare(o: { id: string; plain: string; board: Board; cues?: Cue[]; traces: string[] }): NoteEvent {
  const { board } = o;
  if (board.third?.mode !== 'cmp' || board.prefix === null) throw new Error(`Subnetting: "${o.id}" compares nothing.`);
  const same = sameSubnet(parse(board.addr), parse(board.third.addr), board.prefix);
  return calc({ ...o, row: same ? 'Same subnet' : 'Different subnet', shown: 'compared' });
}

const subnetting = defineLesson({
  slug: 'subnetting',
  title: 'Subnetting',
  subtitle: 'Splitting networks into smaller ones',
  level: 'beginner',
  certTags: ['network-plus', 'ccna'],
  summary:
    'See how one big network is cut into smaller ones, how many devices fit in each, and how a device tells whether another device is its neighbour.',
  figure: 'subnet',
  backing: traces('term-subnet', 'fact-usable', 'lead-2'),
  units: [
    {
      id: 'subnetting',
      name: 'Subnetting',
      fullName: 'Cutting one network into smaller ones',
      purpose: 'One network, cut into four',
      osi: { layers: [3], cite: [...OSI_L3, hostPlain('3.2.1.3', 31), rfc950('2.1', 6, false)] },
      backing: traces('term-subnet', 'lead-1'),
      scene: {
        title: `Office network · ${FLOOR_CIDR}`,
        views: ['network'],
        panel: { type: 'bits' },
        log: {
          title: 'Working',
          idle: 'Nothing worked out yet. Press Play, or pick a step.',
          columns: [
            { key: 'worked', label: 'Worked out', width: 176, prose: true, strong: true },
            { key: 'value', label: 'Value', width: 190, strong: true },
            { key: 'prefix', label: 'Prefix', width: 76 },
            { key: 'plain', label: 'In plain words', prose: true },
          ],
          legend: [
            { kind: 'request', label: 'Worked out' },
            { kind: 'response', label: 'Sent' },
            { kind: 'broadcast', label: 'Broadcast' },
          ],
        },
        parties: [],
        backing: traces('fact-examples', 'fact-cidr', 'lead-1'),
      },
      overview: {
        hook: 'An office has one block of addresses and four teams: Sales, Design, the servers, and the guest Wi-Fi. It wants each kept to itself, so a guest’s phone can’t wander onto the servers. It cuts its one network into four smaller ones, one for each team.',
        hookBacking: traces('why-1', 'term-subnet', 'lead-1'),
        description:
          'Every IP address has two parts: which network, then which device. A number called the subnet mask says where one part ends and the other begins. Move that line, and one network becomes several. Subnetting comes down to moving a line and counting.',
        backing: traces('term-network', 'term-host', 'term-mask', 'term-borrow', 'term-subnet', 'fact-usable'),
        facts: [
          { label: 'Written as', value: FLOOR_CIDR, backing: traces('fact-cidr') },
          { label: 'Mask', value: mask(FLOOR), backing: traces('fact-cidr', 'term-mask') },
          {
            label: 'Usable addresses',
            value: `${BIT_VALUES} to the power of the host bits, minus ${KEPT_BACK}, up to a /${LINK}`,
            backing: traces('fact-usable'),
          },
          {
            label: 'Addresses here',
            value: 'private (192.168.x.x) and documentation (203.0.113.x) examples',
            backing: traces('fact-examples'),
          },
          { label: 'Defined in', value: 'RFC 950, RFC 4632', backing: traces('fact-defined') },
        ],
      },
      steps: [
        {
          id: 'portions',
          title: 'Network and Host Portions',
          sub: 'Which network, then which device',
          narrative:
            'Think of an address like 12 Oak Street: the street, then the house. An IP address works the same way. The Sales laptop is 192.168.1.10. The first three numbers, 192.168.1, say which network it’s on, and they’re the same for every device in this office. The last number, 10, says which device it is. The first part is the **network portion**, and the second is the **host portion**. A host is any device with an address. Under the map, the same address is written the way a computer reads it: 32 ones and zeros, called bits.',
          deep: [
            {
              text: 'Each of the four numbers is one byte: 8 bits, so it runs from 0 to 255. 192 is 11000000 and 10 is 00001010. Nothing in the address itself says where the network part ends. That is the mask’s job, in the next step.',
              cite: [rfc('rfc-791', '2.3', true), CISCO_ADDRESSES, ms('IP addresses, networks and hosts', 'ip-addresses-networks-and-hosts'), ms('Subnet mask', 'subnet-mask'), rfc('rfc-4632', '3.1', true), ms('Glossary', 'glossary')],
            },
          ],
          facts: [
            { label: 'Address', value: formatIPv4(laptop), backing: { example: true } },
            {
              label: 'Network portion',
              value: `${subnetValue('network-part', floorBoard)} (the first ${FLOOR} bits)`,
              backing: traces('term-network', 'term-prefix', 'fact-cidr'),
            },
            {
              label: 'Host portion',
              value: `${subnetValue('host-part', floorBoard)} (the last ${hostBits(FLOOR)} bits)`,
              backing: traces('term-host', 'term-prefix', 'fact-cidr'),
            },
            {
              label: 'Whole address',
              value: `${ADDRESS_BITS} bits, in ${NUMBER_WORDS[ADDRESS_BITS / OCTET_BITS]} groups of ${OCTET_BITS}`,
              backing: traces('fact-bits'),
            },
          ],
          events: [
            calc({
              id: 'address',
              row: 'Address',
              shown: 'address',
              plain: 'The Sales laptop’s address, in bits',
              board: { ...LAPTOP_BOARD, prefix: null },
              cues: [
                { cue: 'glow', arg: 'laptop' },
                { cue: 'focus', arg: 'sales' },
              ],
              traces: ['fact-bits'],
            }),
            calc({
              id: 'network-part',
              row: 'Network portion',
              shown: 'network-part',
              plain: 'Which network: the same for the whole office',
              board: { ...LAPTOP_BOARD, prefix: FLOOR, pick: 'net' },
              cues: [{ cue: 'one-net' }, { cue: 'pulse', arg: 'onenet' }],
              traces: ['term-network', 'term-prefix', 'fact-cidr'],
            }),
            calc({
              id: 'host-part',
              row: 'Host portion',
              shown: 'host-part',
              plain: 'Which device: the laptop',
              board: { ...LAPTOP_BOARD, prefix: FLOOR, pick: 'host' },
              cues: [
                { cue: 'glow', arg: 'laptop' },
                { cue: 'focus', arg: 'sales' },
              ],
              traces: ['term-host', 'term-prefix', 'fact-cidr'],
            }),
          ],
          backing: traces('term-network', 'term-host', 'fact-bits', 'term-prefix', 'fact-examples', 'fact-cidr'),
        },
        {
          id: 'subnet-mask',
          title: 'Subnet Mask',
          sub: 'A number marks where the network ends',
          narrative:
            'How does the laptop know where the network part ends? Picture a card with holes in it, laid over the address. The bits under the holes are the network part, and the covered ones are the host part. That card is the **subnet mask**: a 1 for every network bit and a 0 for every host bit. 255.255.255.0 is 24 ones, then 8 zeros. People usually just count the ones and write the count after a slash: 192.168.1.10/24. That count is the **prefix length**.',
          deep: [
            {
              text: 'Writing /24 is called CIDR notation, from Classless Inter-Domain Routing. A mask’s ones always come first and never mix with its zeros, so the prefix length says everything the mask does. Common pairs: /8 is 255.0.0.0, /16 is 255.255.0.0 and /24 is 255.255.255.0.',
              cite: [
                rfc('rfc-4632', '3.1', true),
                rfc('rfc-4632', 'Abstract', true, 'abstract'),
                rfc('rfc-1812', '2.2.5.1'),
                rfc('rfc-1812', '2.2.5.2'),
                ms('Subnet mask', 'subnet-mask'),
                CISCO_CIDR,
                CISCO_MASKS,
              ],
            },
          ],
          facts: [
            { label: 'Mask', value: mask(FLOOR), backing: traces('term-mask', 'fact-cidr') },
            { label: 'In bits', value: toOctetBits(maskFromPrefix(FLOOR)).join('.'), backing: traces('term-mask', 'fact-cidr') },
            { label: 'Prefix length', value: `/${FLOOR} (${ones(FLOOR)} ones)`, backing: traces('term-prefix', 'fact-cidr') },
            { label: 'Written', value: `${formatIPv4(laptop)}/${FLOOR}`, backing: traces('term-prefix', 'fact-cidr') },
          ],
          events: [
            calc({
              id: 'mask-24',
              row: 'Subnet mask',
              shown: 'mask',
              plain: '24 ones, then 8 zeros',
              board: { ...LAPTOP_BOARD, prefix: FLOOR, mask: true, pick: 'mask' },
              traces: ['term-mask', 'term-prefix', 'fact-cidr'],
            }),
            calc({
              id: 'prefix-24',
              row: 'Prefix length',
              shown: 'prefix',
              plain: 'Written 192.168.1.10/24',
              board: { ...LAPTOP_BOARD, prefix: FLOOR, mask: true, pick: 'line' },
              cues: [{ cue: 'pulse', arg: 'onenet' }],
              traces: ['term-prefix', 'fact-cidr'],
            }),
          ],
          backing: traces('term-mask', 'term-prefix', 'fact-cidr', 'fact-examples'),
        },
        {
          id: 'network-broadcast',
          title: 'Network and Broadcast Addresses',
          sub: 'Two addresses are kept back',
          narrative:
            'A street has a name of its own, and a loudspeaker every house can hear. A network keeps two addresses back in the same way. Set every host bit to 0 and you get 192.168.1.0, the network’s own name: the **network address**. Set every host bit to 1 and you get 192.168.1.255, the address every device hears at once: the **broadcast address**. Watch the laptop send to it: the whole floor hears. Neither can be given to a device, so 8 host bits make 256 addresses, minus 2: 254 for devices.',
          deep: [
            {
              text: 'Up to a /30, the number of usable addresses is 2 to the power of the host bits, minus 2. A broadcast reaches every device on the network, which is how DHCP finds a server and ARP finds a neighbour’s hardware address. Routers don’t pass broadcasts on, so a broadcast never leaves its network.',
              cite: [
                CISCO_EXAMPLE,
                rfc('rfc-3021', '2.1', true),
                ms('Subnetting', 'subnetting'),
                rfc('rfc-1812', '4.2.2.11'),
                rfc('rfc-2131', '3.1', true),
                ARP_GENERATION,
                rfc('rfc-1812', '5.3.5.1', true),
                rfc('rfc-2644', '3', true),
              ],
            },
          ],
          facts: [
            { label: 'Network address', value: formatIPv4(floor.network), backing: traces('term-netaddr', 'fact-cidr') },
            { label: 'Broadcast address', value: formatIPv4(floor.broadcast), backing: traces('term-broadcast', 'fact-cidr') },
            {
              label: 'Usable addresses',
              value: `${floor.usableHosts} (${BIT_VALUES}${superscript(hostBits(FLOOR))} − ${KEPT_BACK})`,
              backing: traces('fact-usable', 'lead-1', 'fact-cidr'),
            },
            {
              label: 'Usable range',
              value: `${formatIPv4(floor.firstHost)} to ${formatIPv4(floor.lastHost)}`,
              backing: traces('term-netaddr', 'term-broadcast', 'fact-usable', 'fact-cidr'),
            },
          ],
          events: [
            calc({
              id: 'network-24',
              row: 'Network address',
              shown: 'network',
              plain: 'Host bits all 0: the network’s own name',
              board: { ...LAPTOP_BOARD, prefix: FLOOR, mask: true, third: { who: 'Network', addr: network(LAPTOP, FLOOR), mode: 'net' } },
              cues: [{ cue: 'pulse', arg: 'onenet' }],
              traces: ['term-netaddr', 'term-prefix', 'fact-cidr'],
            }),
            calc({
              id: 'broadcast-24',
              row: 'Broadcast address',
              shown: 'broadcast',
              plain: 'Host bits all 1: the whole floor hears it',
              board: {
                ...LAPTOP_BOARD,
                prefix: FLOOR,
                mask: true,
                third: { who: 'Broadcast', addr: broadcast(LAPTOP, FLOOR), mode: 'bcast' },
              },
              cues: [
                { cue: 'ring', arg: 'all' },
                { cue: 'glow', arg: 'laptop' },
                { cue: 'focus', arg: 'sales' },
              ],
              traces: ['term-broadcast', 'term-prefix', 'fact-cidr'],
            }),
            calc({
              id: 'usable-24',
              row: 'Usable addresses',
              shown: 'usable-count',
              plain: '256 addresses, minus those two: .1 to .254',
              board: {
                ...LAPTOP_BOARD,
                prefix: FLOOR,
                mask: true,
                third: { who: 'Broadcast', addr: broadcast(LAPTOP, FLOOR), mode: 'bcast' },
                pick: 'host',
              },
              traces: ['fact-usable', 'lead-1', 'term-netaddr', 'term-broadcast', 'term-prefix', 'fact-cidr'],
            }),
          ],
          backing: traces('term-netaddr', 'term-broadcast', 'fact-usable', 'lead-1', 'term-prefix', 'fact-examples', 'fact-cidr'),
        },
        {
          id: 'borrowing-bits',
          title: 'Borrowing Bits',
          sub: 'Move the line right for smaller networks',
          narrative:
            'The office wants each team on a network of its own. So the line moves right by 2 bits, and the mask grows from /24 to /26. Those 2 bits used to name devices. Now they name a smaller network. That is called **borrowing bits**. 2 bits can be 00, 01, 10 or 11, so the one network becomes 4 **subnets** of 64 addresses each, starting at .0, .64, .128 and .192. The Design PC, 192.168.1.70, has 01 in those bits, so it’s in the second subnet, 192.168.1.64. Now when it broadcasts, only Design hears.',
          deep: [
            {
              text: 'Each borrowed bit doubles the number of subnets and halves their size. At /26 the 6 host bits give 64 addresses, 62 of them usable. The mask’s last number, 192, is 256 minus 64, the block size, and every subnet starts at a multiple of it. The router now needs an address in each subnet: here .1, .65, .129 and .193.',
              cite: [
                CISCO_SUBNETTING,
                rfc('rfc-1812', '2.2.7'),
                rfc('rfc-4632', '3.1', true),
                CISCO_TABLE,
                ms('Subnetting', 'subnetting'),
              ],
            },
          ],
          facts: [
            { label: 'Mask', value: `${mask(CUT)} (/${CUT})`, backing: traces('fact-26', 'term-mask') },
            {
              label: `Cut from one /${FLOOR}`,
              value: `${cutSubnets.length} subnets of ${sales.totalAddresses} addresses`,
              backing: traces('fact-borrow', 'fact-26', 'term-subnet', 'term-prefix', 'fact-cidr'),
            },
            {
              label: 'Design’s subnet',
              value: `${formatIPv4(design.network)} to ${formatIPv4(design.broadcast)}`,
              backing: traces('term-subnet', 'term-netaddr', 'term-broadcast', 'deep-block'),
            },
            {
              label: 'Usable addresses',
              value: `${design.usableHosts} (${formatIPv4(design.firstHost)} to ${formatIPv4(design.lastHost)})`,
              backing: traces('fact-26', 'fact-usable', 'deep-block'),
            },
          ],
          events: [
            calc({
              id: 'mask-26',
              row: 'Subnet mask',
              shown: 'mask',
              plain: '2 host bits borrowed for the network',
              board: { ...LAPTOP_BOARD, prefix: CUT, borrow: FLOOR, mask: true, pick: 'borrow' },
              cues: [{ cue: 'cut' }],
              traces: ['term-borrow', 'term-mask', 'term-prefix', 'fact-26'],
            }),
            calc({
              id: 'subnets-26',
              row: 'Subnets',
              shown: 'subnets',
              plain: 'Starting at .0, .64, .128 and .192',
              board: { ...LAPTOP_BOARD, prefix: CUT, borrow: FLOOR, mask: true, pick: 'borrow' },
              cues: [{ cue: 'pulse', arg: 'pads' }],
              traces: ['term-subnet', 'term-borrow', 'term-prefix', 'fact-borrow', 'fact-26', 'deep-block'],
            }),
            calc({
              id: 'network-26',
              row: 'Network address',
              shown: 'network',
              plain: 'The Design PC, .70, has 01 in the borrowed bits',
              board: {
                ...DESIGN_PC_BOARD,
                prefix: CUT,
                borrow: FLOOR,
                mask: true,
                third: { who: 'Network', addr: network(DESIGN_PC, CUT), mode: 'net' },
                pick: 'borrow',
              },
              cues: [
                { cue: 'glow', arg: 'pc' },
                { cue: 'focus', arg: 'design' },
              ],
              traces: ['term-netaddr', 'term-borrow', 'term-prefix', 'deep-block'],
            }),
            calc({
              id: 'broadcast-26',
              row: 'Broadcast address',
              shown: 'broadcast',
              plain: 'Host bits all 1: only Design hears it',
              board: {
                ...DESIGN_PC_BOARD,
                prefix: CUT,
                borrow: FLOOR,
                mask: true,
                third: { who: 'Broadcast', addr: broadcast(DESIGN_PC, CUT), mode: 'bcast' },
              },
              cues: [
                { cue: 'ring', arg: 'design' },
                { cue: 'glow', arg: 'pc' },
                { cue: 'focus', arg: 'design' },
              ],
              traces: ['term-broadcast', 'term-prefix', 'why-1'],
            }),
          ],
          backing: traces(
            'term-borrow',
            'term-subnet',
            'fact-borrow',
            'fact-26',
            'deep-block',
            'term-netaddr',
            'term-broadcast',
            'why-1',
            'term-mask',
            'term-prefix',
            'fact-cidr',
          ),
        },
        {
          id: 'local-remote',
          title: 'Local vs. Remote Delivery',
          sub: 'Same subnet: direct. Different: the router',
          narrative:
            'Before it sends anything, the laptop checks: is the other device on my subnet? It lays its mask over both addresses and compares the network parts. The printer, 192.168.1.20, matches, so the laptop sends straight to it. That’s **local delivery**. The Design PC, 192.168.1.70, doesn’t match: the borrowed bits differ, 00 against 01. So the laptop hands the message to the router, its way out, called the **default gateway**.',
          deep: [
            {
              text: 'The comparison is a bitwise AND: each address with the laptop’s own mask. If the results match, the laptop finds the printer’s hardware address with ARP and sends to it directly. If not, it sends to its default gateway, 192.168.1.1, and the router passes it on. At /24 the same two addresses would be on one network and talk directly.',
              cite: [
                rfc950('2.2', 7),
                CISCO_EXERCISE,
                host('3.3.1.1', 47),
                ARP_GENERATION,
                host('3.3.1.2', 48),
                ms('Default gateways', 'default-gateways'),
                ms('Subnetting', 'subnetting'),
              ],
            },
          ],
          facts: [
            {
              label: 'Laptop',
              value: `${formatIPv4(laptop)}, in ${formatIPv4(sales.network)}/${CUT}`,
              backing: traces('term-subnet', 'term-prefix', 'fact-cidr', 'deep-block'),
            },
            {
              label: 'Printer',
              value: `${formatIPv4(printer)}: ${matches(laptop, printer, CUT, 'same subnet, sent directly', 'another subnet, sent via the router')}`,
              backing: traces('lead-2', 'deep-block'),
            },
            {
              label: 'Design PC',
              value: `${formatIPv4(designPc)}: in ${formatIPv4(design.network)}/${CUT}, ${matches(laptop, designPc, CUT, 'sent directly', 'sent via the router')}`,
              backing: traces('lead-2', 'term-gateway', 'term-subnet', 'term-prefix', 'deep-block'),
            },
            { label: 'Default gateway', value: GATEWAY, backing: traces('term-gateway') },
          ],
          events: [
            compare({
              id: 'same-subnet',
              plain: 'Network parts match: straight to the printer',
              board: { ...LAPTOP_BOARD, prefix: CUT, borrow: FLOOR, mask: true, third: { who: 'Printer', addr: PRINTER, mode: 'cmp' } },
              cues: [
                { cue: 'route', arg: 'local' },
                { cue: 'busy', arg: 'printer' },
                { cue: 'focus', arg: 'sales' },
              ],
              traces: ['lead-2', 'term-prefix'],
            }),
            compare({
              id: 'different-subnet',
              plain: 'Network parts differ: sent via the router',
              board: { ...LAPTOP_BOARD, prefix: CUT, borrow: FLOOR, mask: true, third: { who: 'Design PC', addr: DESIGN_PC, mode: 'cmp' } },
              cues: [
                { cue: 'route', arg: 'remote' },
                { cue: 'busy', arg: 'pc' },
                { cue: 'focus', arg: 'router' },
              ],
              traces: ['lead-2', 'term-gateway', 'term-prefix', 'deep-block'],
            }),
          ],
          backing: traces('lead-2', 'term-gateway', 'term-borrow', 'deep-block'),
        },
        {
          id: 'point-to-point',
          title: 'Point-to-Point Subnet',
          sub: 'A /30 holds exactly two devices',
          narrative:
            'Some networks are tiny on purpose. The office router has one cable to its internet provider’s router, and that cable needs exactly two addresses, one for each end. A /30 leaves 2 host bits: 4 addresses. Take away the network and broadcast addresses and 2 are left, just right. Here the link is 203.0.113.4/30. The provider’s router is 203.0.113.5 and the office router is 203.0.113.6. A tiny subnet like this, joining two routers, is a **point-to-point** link, and it wastes very few addresses.',
          deep: [
            {
              text: 'The link’s network address is 203.0.113.4 and its broadcast address is 203.0.113.7. Routers may instead use a /31 for links like this: RFC 3021 lets both of its 2 addresses be used, with no network or broadcast address. 203.0.113.0/24 is set aside for documentation, so these addresses are examples.',
              cite: [
                ms('Glossary', 'glossary'),
                rfc('rfc-3021', '2.1', true),
                CISCO_31BIT,
                rfc('rfc-5737', '3', true),
              ],
            },
          ],
          facts: [
            { label: 'Mask', value: `${mask(LINK)} (/${LINK})`, backing: traces('fact-30', 'term-mask') },
            {
              label: 'This subnet',
              value: `${formatIPv4(link.network)} to ${formatIPv4(link.broadcast)}`,
              backing: traces('term-netaddr', 'term-broadcast', 'fact-30', 'deep-block'),
            },
            {
              label: 'Usable addresses',
              value: `${link.usableHosts} (${formatIPv4(link.firstHost)} and ${formatIPv4(link.lastHost)})`,
              backing: traces('fact-30', 'term-p2p'),
            },
            { label: 'Typical use', value: 'a link between two routers', backing: traces('term-p2p') },
          ],
          events: [
            calc({
              id: 'mask-30',
              row: 'Subnet mask',
              shown: 'mask',
              plain: '30 network bits, 2 host bits',
              board: { ...LINK_BOARD, prefix: LINK, mask: true, pick: 'host' },
              cues: [{ cue: 'link' }, { cue: 'focus', arg: 'router' }],
              traces: ['term-mask', 'term-prefix', 'fact-30', 'term-p2p'],
            }),
            calc({
              id: 'network-30',
              row: 'Network address',
              shown: 'network',
              plain: 'Broadcast is 203.0.113.7, so two are left',
              board: {
                ...LINK_BOARD,
                prefix: LINK,
                mask: true,
                third: { who: 'Network', addr: network(OFFICE_ROUTER_LINK, LINK), mode: 'net' },
              },
              cues: [{ cue: 'pulse', arg: 'link' }],
              traces: ['term-netaddr', 'term-broadcast', 'term-prefix', 'fact-30', 'fact-examples', 'deep-block'],
            }),
            calc({
              id: 'usable-30',
              row: 'Usable addresses',
              shown: 'usable-pair',
              plain: 'One for each end of the link',
              board: { ...LINK_BOARD, prefix: LINK, mask: true, third: { who: 'Provider', addr: PROVIDER_LINK, mode: 'cmp' } },
              cues: [
                { cue: 'route', arg: 'link' },
                { cue: 'busy', arg: 'provider' },
                { cue: 'focus', arg: 'provider' },
              ],
              traces: ['term-p2p', 'term-prefix', 'fact-30', 'fact-examples'],
            }),
          ],
          backing: traces('term-p2p', 'fact-30', 'term-netaddr', 'term-broadcast', 'why-2', 'fact-examples', 'fact-usable', 'deep-block'),
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'One office, one block of 256 addresses, cut into four smaller networks, one for each team. Here is what each part was, and what it’s called.',
            cite: [rfc('rfc-4632', '3.1', true), ms('Subnetting', 'subnetting')],
          },
          {
            id: 'lead-2',
            text: 'Before it sends, a device lays its mask over its own address and the other one, a bitwise AND, and compares the network parts. If they match, the device finds the other’s hardware address with ARP and sends to it directly: that is local delivery. If not, it sends to its default gateway.',
            cite: [host('3.3.1.1', 47), rfc950('2.2', 7), ARP_GENERATION, ms('Default gateways', 'default-gateways')],
          },
        ],
        terms: [
          {
            id: 'term-network',
            idea: 'The part of an address that says which network, the same for every device on it',
            name: 'Network portion',
            cite: [ms('IP addresses, networks and hosts', 'ip-addresses-networks-and-hosts'), CISCO_BACKGROUND],
          },
          {
            id: 'term-host',
            idea: 'The part that says which device, or host: any device with an address',
            name: 'Host portion',
            cite: [ms('IP addresses, networks and hosts', 'ip-addresses-networks-and-hosts'), CISCO_BACKGROUND, ms('Glossary', 'glossary')],
          },
          {
            id: 'term-mask',
            idea: 'The card laid over the address: a 1 for each network bit and a 0 for each host bit',
            name: 'Subnet mask',
            cite: [CISCO_MASKS, rfc950('2.2', 7)],
          },
          {
            id: 'term-prefix',
            idea: 'Counting the mask’s ones and writing them after a slash',
            name: 'Prefix length',
            cite: [rfc('rfc-1812', '2.2.5.1'), rfc('rfc-4632', '3.1', true)],
          },
          {
            id: 'term-netaddr',
            idea: 'The network’s own name: every host bit 0',
            name: 'Network address',
            cite: [ms('Glossary', 'glossary'), CISCO_EXAMPLE],
          },
          {
            id: 'term-broadcast',
            idea: 'The address every device on the network hears: every host bit 1',
            name: 'Broadcast address',
            cite: [ms('Glossary', 'glossary'), rfc('rfc-1812', '5.3.5'), ms('Subnetting', 'subnetting')],
          },
          {
            id: 'term-subnet',
            idea: 'A smaller network cut out of a bigger one',
            name: 'Subnet',
            cite: [ms('Glossary', 'glossary'), CISCO_SUBNETTING_TABLES],
          },
          {
            id: 'term-borrow',
            idea: 'Turning host bits into network bits to make smaller networks',
            name: 'Borrowing bits',
            cite: [CISCO_SUBNETTING_TABLES, ms('Subnetting', 'subnetting')],
          },
          {
            id: 'term-gateway',
            idea: 'The router a device sends to when the other address is on another subnet',
            name: 'Default gateway',
            cite: [host('3.3.1.2', 48), ms('Default gateways', 'default-gateways')],
          },
          {
            id: 'term-p2p',
            idea: 'A tiny subnet with exactly two usable addresses, one for each end of a link, such as between two routers',
            name: 'Point-to-point /30',
            cite: [rfc('rfc-3021', '1'), CISCO_31BIT],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Subnet Mask', 'Network Address', 'Broadcast Address', 'Usable Addresses'],
          note: 'Any address, any prefix up to /30: work these four out in this order. Steps 2 and 3 did it for a /24, step 4 for a /26 and step 6 for a /30.',
          cite: [ms('Subnet mask', 'subnet-mask'), ms('Glossary', 'glossary'), ms('Subnetting', 'subnetting'), CISCO_EXAMPLE],
        },
        why: [
          {
            id: 'why-1',
            text: 'Subnets keep groups apart. A guest’s phone can’t reach the servers unless the router lets it, and one team’s broadcasts don’t disturb the others.',
            cite: [
              CISCO_SUBNETTING,
              host('3.3.1.1', 47),
              rfc('rfc-1812', '5.3.9', true),
              rfc('rfc-1812', '5.3.5.1', true),
              rfc('rfc-2644', '3', true),
            ],
          },
          {
            id: 'why-2',
            text: 'They also stop addresses going to waste: a link between two routers needs 2 addresses, not 254.',
            cite: [CISCO_VLSM, rfc('rfc-3021', '1'), rfc('rfc-4632', '2'), CISCO_31BIT, CISCO_QUANTITIES_B],
          },
        ],
        deep: [
          {
            id: 'deep-block',
            text: 'From /24 on, each prefix has a block size: 256 minus the mask’s last number below 255. Subnets start at multiples of it. To find which subnet an address is in, round its last number down to a multiple of the block size: at /26, .70 rounds down to .64. The broadcast address is the next subnet’s start, minus 1.',
            cite: [rfc('rfc-4632', '3.1', true), ms('Subnetting', 'subnetting')],
          },
        ],
        facts: [
          ...LEARN_PREFIXES.map((p) => ({
            id: `fact-${p}`,
            label: `/${p}`,
            value: `${mask(p)}: ${total(p)} addresses, ${usable(p)} usable`,
            cite: [rfc('rfc-4632', '3.1', true), CISCO_TABLE],
          })),
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: `RFC 950 (subnets), RFC 4632 (CIDR), RFC 3021 (/${RFC_3021_LINK} links)`,
            cite: [rfc950('Overview', 1), rfc('rfc-4632', 'Abstract', true, 'abstract'), rfc('rfc-3021', 'Abstract', true, 'abstract')],
          },
          {
            id: 'fact-bits',
            label: 'An address',
            value: `${ADDRESS_BITS} bits: ${NUMBER_WORDS[ADDRESS_BITS / OCTET_BITS]} numbers of ${OCTET_BITS} bits, each ${OCTET_MIN} to ${OCTET_MAX}`,
            cite: [rfc('rfc-791', '2.3', true), CISCO_ADDRESSES, ms('Glossary', 'glossary')],
          },
          {
            id: 'fact-usable',
            label: 'Usable addresses',
            value: `${BIT_VALUES} to the power of the host bits, minus ${KEPT_BACK}, up to a /${LINK}: the network and broadcast addresses are kept back`,
            cite: [CISCO_EXAMPLE, rfc('rfc-1812', '4.2.2.11'), rfc('rfc-4632', '2')],
          },
          {
            id: 'fact-borrow',
            label: 'Each borrowed bit',
            value: `doubles the subnets and halves their size: ${CUT - FLOOR} borrowed bits can be ${borrowedValues.slice(0, -1).join(', ')} or ${borrowedValues.at(-1)}, which makes ${cutSubnets.length} subnets`,
            cite: [CISCO_SUBNETTING, CISCO_EXAMPLE, rfc('rfc-4632', '3.1', true), ms('Subnetting', 'subnetting')],
          },
          {
            id: 'fact-examples',
            label: 'Example addresses',
            value: '192.168.x.x is private; 203.0.113.x is for documentation',
            cite: [rfc('rfc-1918', '3', true), rfc('rfc-5737', '3', true)],
          },
          {
            id: 'fact-cidr',
            label: 'Written as',
            value: `an address, a slash and the prefix length: ${FLOOR_CIDR} has the mask ${mask(FLOOR)}, ${ones(FLOOR)} ones then ${zeros(FLOOR)} zeros`,
            cite: [rfc('rfc-4632', '3.1', true), CISCO_CIDR, ms('Subnet mask', 'subnet-mask')],
          },
          {
            id: 'fact-osi',
            label: 'OSI layer',
            value: '3, network: subnetting is part of how IP addresses work',
            cite: [...OSI_L3, hostPlain('3.2.1.3', 31), rfc950('2.1', 6, false)],
          },
        ],
      },
      practice: [
        {
          id: 'usable-26',
          prompt: 'How many devices can have an address in a /26 subnet?',
          options: [
            {
              text: String(total(CUT)),
              feedback:
                'Not quite. 64 is how many addresses a /26 has. Two of them are kept back, the network and broadcast addresses, so 62 are left for devices.',
              cite: [rfc('rfc-4632', '3.1', true), rfc('rfc-1812', '4.2.2.11'), CISCO_TABLE, CISCO_EXAMPLE],
            },
            {
              text: String(usable(CUT)),
              feedback: 'Right. A /26 leaves 6 host bits: 64 addresses. Take away the network and broadcast addresses and 62 are left.',
              cite: [rfc('rfc-4632', '3.1', true), rfc('rfc-1812', '4.2.2.11'), CISCO_TABLE, CISCO_EXAMPLE],
            },
            {
              text: String(usable(NEXT_CUT)),
              feedback: 'Not quite. 30 is a /27. A /26 has 6 host bits: 64 addresses, minus 2, is 62.',
              cite: [rfc('rfc-4632', '3.1', true), rfc('rfc-1812', '4.2.2.11'), CISCO_TABLE, CISCO_EXAMPLE],
            },
          ],
          answer: 1,
        },
        {
          id: 'via-router',
          prompt: 'At /26, the laptop 192.168.1.10 sends to 192.168.1.70. Where does the message go first?',
          options: [
            {
              text: 'To the router, because the network parts differ.',
              feedback:
                'Right. Under a /26 mask the borrowed bits differ, 00 against 01, so they’re on different subnets. The laptop hands the message to its default gateway.',
              cite: [host('3.3.1.1', 47), host('3.3.1.2', 48), ms('Subnetting', 'subnetting'), ms('Default gateways', 'default-gateways')],
            },
            {
              text: 'Straight to 192.168.1.70, because both start 192.168.1.',
              feedback:
                'Not quite. That would be true at /24. At /26 the network part takes 2 more bits, and those differ, so the message goes via the router.',
              cite: [ms('Subnetting', 'subnetting'), host('3.3.1.1', 47)],
            },
            {
              text: 'To every device, as a broadcast.',
              feedback:
                'Not quite. A broadcast is for when you don’t know who to ask. The laptop knows the address. It only checks whether to send directly or via the router.',
              cite: [rfc('rfc-919', '3', true), host('3.3.1.1', 47)],
            },
          ],
          answer: 0,
        },
        {
          id: 'why-30',
          prompt: 'Why does the link between the office router and the provider’s router use a /30?',
          options: [
            {
              text: 'A smaller subnet makes the link faster.',
              feedback:
                'Not quite. A subnet’s size only sets how many addresses it has. The link uses a /30 because it needs exactly 2 addresses.',
              cite: [rfc('rfc-4632', '3.1', true), rfc('rfc-3021', '1'), CISCO_31BIT],
            },
            {
              text: 'It keeps the guest Wi-Fi off the link.',
              feedback:
                'Not quite. Keeping guests out is the router’s job. The /30 is about size: the link has two ends, so it needs exactly 2 addresses.',
              cite: [rfc('rfc-1812', '5.3.9', true), host('3.3.1.1', 47), rfc('rfc-3021', '1'), CISCO_31BIT],
            },
            {
              text: 'It has exactly 2 usable addresses, one for each end.',
              feedback:
                'Yes. A /30 has 4 addresses: the network, the broadcast, and 2 for devices. A link has two ends, so neither usable address goes to waste.',
              cite: [rfc('rfc-3021', '1'), CISCO_31BIT],
            },
          ],
          answer: 2,
        },
      ],
    },
  ],
});

// ------------------------------------------------------------------ the numbers the words state

/**
 * Every number the lesson's sentences state, pinned to the place it is written
 * (a `learnerProse` place): the phrase as written, with enough of its sentence
 * round the number to stand for that place, and the engine's own wording of
 * it. `checkStated` finds each phrase, whole, in the place it names and in no
 * other place a learner reads, and never in a log cell or a board, which the
 * engine fills itself. Bare values (the scene's title, the facts, Practice's
 * number options) are not here: the lesson works them out above.
 */
const step = (id: string, field: string): string => `steps.${id}.${field}`;
const plainOf = (stepId: string, eventId: string): string => `steps.${stepId}.events.${eventId}.plain`;
const question = (id: string, field: string): string => `practice.${id}.${field}`;

export const STATED: Stated[] = [
  // Step 1, Network and Host Portions.
  {
    at: step('portions', 'narrative'),
    text: 'The Sales laptop is 192.168.1.10.',
    value: () => `The Sales laptop is ${formatIPv4(laptop)}.`,
  },
  {
    at: step('portions', 'narrative'),
    text: 'The first three numbers, 192.168.1, say',
    value: () => `The first ${NUMBER_WORDS[FLOOR / OCTET_BITS]} numbers, ${subnetValue('network-part', floorBoard)}, say`,
  },
  {
    at: step('portions', 'narrative'),
    text: 'The last number, 10, says',
    value: () => `The last number, ${subnetValue('host-part', floorBoard)}, says`,
  },
  { at: step('portions', 'narrative'), text: '32 ones and zeros', value: () => `${ADDRESS_BITS} ones and zeros` },
  {
    at: step('portions', 'deep'),
    text: 'one byte: 8 bits, so it runs from 0 to 255',
    value: () => `one byte: ${OCTET_BITS} bits, so it runs from ${OCTET_MIN} to ${OCTET_MAX}`,
  },
  {
    at: step('portions', 'deep'),
    text: '192 is 11000000 and 10 is 00001010',
    value: () => `${laptop >>> 24} is ${toOctetBits(laptop)[0]} and ${laptop & 255} is ${toOctetBits(laptop)[3]}`,
  },

  // Step 2, Subnet Mask.
  {
    at: step('subnet-mask', 'narrative'),
    text: 'a 1 for every network bit and a 0 for every host bit',
    value: () => `a ${MASK_NETWORK_BIT} for every network bit and a ${MASK_HOST_BIT} for every host bit`,
  },
  {
    at: step('subnet-mask', 'narrative'),
    text: '255.255.255.0 is 24 ones, then 8 zeros',
    value: () => `${mask(FLOOR)} is ${ones(FLOOR)} ones, then ${zeros(FLOOR)} zeros`,
  },
  // The log row's plain words say it too, within the narrative's sentence.
  {
    at: [step('subnet-mask', 'narrative'), plainOf('subnet-mask', 'mask-24')],
    text: '24 ones, then 8 zeros',
    value: () => `${ones(FLOOR)} ones, then ${zeros(FLOOR)} zeros`,
  },
  {
    at: step('subnet-mask', 'narrative'),
    text: 'after a slash: 192.168.1.10/24',
    value: () => `after a slash: ${formatIPv4(laptop)}/${ones(FLOOR)}`,
  },
  { at: step('subnet-mask', 'deep'), text: 'Writing /24 is called', value: () => `Writing /${FLOOR} is called` },
  {
    at: step('subnet-mask', 'deep'),
    text: 'Common pairs: /8 is 255.0.0.0, /16 is 255.255.0.0 and /24 is 255.255.255.0.',
    value: () => `Common pairs: ${list([8, 16, FLOOR].map((p) => `/${p} is ${mask(p)}`))}.`,
  },
  { at: plainOf('subnet-mask', 'prefix-24'), text: 'Written 192.168.1.10/24', value: () => `Written ${formatIPv4(laptop)}/${FLOOR}` },

  // Step 3, Network and Broadcast Addresses.
  {
    at: step('network-broadcast', 'narrative'),
    text: 'Set every host bit to 0 and you get 192.168.1.0',
    value: () => `Set every host bit to ${NETWORK_BIT} and you get ${formatIPv4(floor.network)}`,
  },
  {
    at: step('network-broadcast', 'narrative'),
    text: 'Set every host bit to 1 and you get 192.168.1.255',
    value: () => `Set every host bit to ${BROADCAST_BIT} and you get ${formatIPv4(floor.broadcast)}`,
  },
  {
    at: step('network-broadcast', 'narrative'),
    text: '8 host bits make 256 addresses, minus 2: 254 for devices',
    value: () =>
      `${hostBits(FLOOR)} host bits make ${floor.totalAddresses} addresses, minus ${KEPT_BACK}: ${floor.usableHosts} for devices`,
  },
  {
    at: step('network-broadcast', 'deep'),
    text: 'Up to a /30, the number of usable addresses is 2 to the power of the host bits, minus 2.',
    value: () => `Up to a /${LINK}, the number of usable addresses is ${BIT_VALUES} to the power of the host bits, minus ${KEPT_BACK}.`,
  },
  {
    at: plainOf('network-broadcast', 'network-24'),
    text: 'Host bits all 0: the network’s own name',
    value: () => `Host bits all ${NETWORK_BIT}: the network’s own name`,
  },
  {
    at: plainOf('network-broadcast', 'broadcast-24'),
    text: 'Host bits all 1: the whole floor hears it',
    value: () => `Host bits all ${BROADCAST_BIT}: the whole floor hears it`,
  },
  {
    at: plainOf('network-broadcast', 'usable-24'),
    text: '256 addresses, minus those two: .1 to .254',
    value: () =>
      `${floor.totalAddresses} addresses, minus those ${NUMBER_WORDS[KEPT_BACK]}: ${last(floor.firstHost)} to ${last(floor.lastHost)}`,
  },

  // Step 4, Borrowing Bits.
  {
    at: step('borrowing-bits', 'narrative'),
    text: 'the line moves right by 2 bits, and the mask grows from /24 to /26',
    value: () => `the line moves right by ${CUT - FLOOR} bits, and the mask grows from /${FLOOR} to /${CUT}`,
  },
  {
    at: step('borrowing-bits', 'narrative'),
    text: 'Those 2 bits used to name devices',
    value: () => `Those ${CUT - FLOOR} bits used to name devices`,
  },
  {
    at: step('borrowing-bits', 'narrative'),
    text: '2 bits can be 00, 01, 10 or 11, so the one network becomes 4 **subnets** of 64 addresses each, starting at .0, .64, .128 and .192',
    value: () =>
      `${CUT - FLOOR} bits can be ${borrowedValues.slice(0, -1).join(', ')} or ${borrowedValues.at(-1)}, so the one network becomes ` +
      `${cutSubnets.length} **subnets** of ${sales.totalAddresses} addresses each, starting at ${list(cutSubnets.map((s) => last(s.network)))}`,
  },
  {
    at: step('borrowing-bits', 'narrative'),
    text: 'The Design PC, 192.168.1.70, has 01 in those bits, so it’s in the second subnet, 192.168.1.64.',
    value: () =>
      `The Design PC, ${formatIPv4(designPc)}, has ${borrowed(DESIGN_PC)} in those bits, so it’s in the ${ORDINALS[designIndex]} subnet, ${formatIPv4(design.network)}.`,
  },
  {
    at: step('borrowing-bits', 'deep'),
    text: 'At /26 the 6 host bits give 64 addresses, 62 of them usable.',
    value: () => `At /${CUT} the ${hostBits(CUT)} host bits give ${sales.totalAddresses} addresses, ${sales.usableHosts} of them usable.`,
  },
  {
    at: step('borrowing-bits', 'deep'),
    text: 'The mask’s last number, 192, is 256 minus 64, the block size',
    value: () => `The mask’s last number, ${maskFromPrefix(CUT) & 255}, is ${OCTET_MAX + 1} minus ${sales.totalAddresses}, the block size`,
  },
  {
    at: step('borrowing-bits', 'deep'),
    text: 'here .1, .65, .129 and .193',
    value: () => `here ${list(cutSubnets.map((s) => last(s.firstHost)))}`,
  },
  {
    at: plainOf('borrowing-bits', 'mask-26'),
    text: '2 host bits borrowed for the network',
    value: () => `${CUT - FLOOR} host bits borrowed for the network`,
  },
  {
    at: plainOf('borrowing-bits', 'subnets-26'),
    text: 'Starting at .0, .64, .128 and .192',
    value: () => `Starting at ${list(cutSubnets.map((s) => last(s.network)))}`,
  },
  {
    at: plainOf('borrowing-bits', 'network-26'),
    text: 'The Design PC, .70, has 01 in the borrowed bits',
    value: () => `The Design PC, ${last(designPc)}, has ${borrowed(DESIGN_PC)} in the borrowed bits`,
  },
  {
    at: plainOf('borrowing-bits', 'broadcast-26'),
    text: 'Host bits all 1: only Design hears it',
    value: () => `Host bits all ${bitsOf(design.broadcast).at(-1)}: only Design hears it`,
  },

  // Step 5, Local vs. Remote Delivery.
  {
    at: step('local-remote', 'narrative'),
    text: 'The printer, 192.168.1.20, matches',
    value: () => `The printer, ${formatIPv4(printer)}, ${matches(laptop, printer, CUT, 'matches', 'doesn’t match')}`,
  },
  {
    at: step('local-remote', 'narrative'),
    text: 'The Design PC, 192.168.1.70, doesn’t match: the borrowed bits differ, 00 against 01.',
    value: () =>
      `The Design PC, ${formatIPv4(designPc)}, ${matches(laptop, designPc, CUT, 'matches', 'doesn’t match')}: the borrowed bits ` +
      `${borrowed(LAPTOP) === borrowed(DESIGN_PC) ? 'match' : 'differ'}, ${borrowed(LAPTOP)} against ${borrowed(DESIGN_PC)}.`,
  },
  { at: step('local-remote', 'deep'), text: 'its default gateway, 192.168.1.1, and', value: () => `its default gateway, ${GATEWAY}, and` },
  {
    at: step('local-remote', 'deep'),
    text: 'At /24 the same two addresses would be on one network',
    value: () => `At /${FLOOR} the same two addresses would be ${matches(laptop, designPc, FLOOR, 'on one network', 'on two networks')}`,
  },

  // Step 6, Point-to-Point Subnet.
  {
    at: step('point-to-point', 'sub'),
    text: 'A /30 holds exactly two devices',
    value: () => `A /${LINK} holds exactly ${NUMBER_WORDS[link.usableHosts]} devices`,
  },
  {
    at: step('point-to-point', 'narrative'),
    text: 'A /30 leaves 2 host bits: 4 addresses. Take away the network and broadcast addresses and 2 are left, just right.',
    value: () =>
      `A /${LINK} leaves ${hostBits(LINK)} host bits: ${link.totalAddresses} addresses. ` +
      `Take away the network and broadcast addresses and ${link.usableHosts} are left, just right.`,
  },
  {
    at: step('point-to-point', 'narrative'),
    text: 'Here the link is 203.0.113.4/30.',
    value: () => `Here the link is ${formatIPv4(link.network)}/${LINK}.`,
  },
  {
    at: step('point-to-point', 'narrative'),
    text: 'The provider’s router is 203.0.113.5 and the office router is 203.0.113.6.',
    value: () => `The provider’s router is ${PROVIDER_LINK} and the office router is ${formatIPv4(parse(OFFICE_ROUTER_LINK))}.`,
  },
  {
    at: step('point-to-point', 'deep'),
    text: 'The link’s network address is 203.0.113.4 and its broadcast address is 203.0.113.7.',
    value: () => `The link’s network address is ${formatIPv4(link.network)} and its broadcast address is ${formatIPv4(link.broadcast)}.`,
  },
  {
    at: step('point-to-point', 'deep'),
    text: 'a /31 for links like this: RFC 3021 lets both of its 2 addresses be used',
    value: () => `a /${RFC_3021_LINK} for links like this: RFC 3021 lets both of its ${usable(RFC_3021_LINK)} addresses be used`,
  },
  {
    at: step('point-to-point', 'deep'),
    text: '203.0.113.0/24 is set aside for documentation',
    value: () => `${network(OFFICE_ROUTER_LINK, DOCUMENTATION_PREFIX)}/${DOCUMENTATION_PREFIX} is set aside for documentation`,
  },
  {
    at: plainOf('point-to-point', 'mask-30'),
    text: '30 network bits, 2 host bits',
    value: () => `${LINK} network bits, ${hostBits(LINK)} host bits`,
  },
  {
    at: plainOf('point-to-point', 'network-30'),
    text: 'Broadcast is 203.0.113.7, so two are left',
    value: () => `Broadcast is ${broadcast(OFFICE_ROUTER_LINK, LINK)}, so ${NUMBER_WORDS[link.usableHosts]} are left`,
  },

  // Learn.
  { at: 'learn.lead', text: 'one block of 256 addresses', value: () => `one block of ${floor.totalAddresses} addresses` },
  {
    at: 'learn.terms.2.idea',
    text: 'a 1 for each network bit and a 0 for each host bit',
    value: () => `a ${MASK_NETWORK_BIT} for each network bit and a ${MASK_HOST_BIT} for each host bit`,
  },
  { at: 'learn.terms.4.idea', text: 'own name: every host bit 0', value: () => `own name: every host bit ${NETWORK_BIT}` },
  { at: 'learn.terms.5.idea', text: 'hears: every host bit 1', value: () => `hears: every host bit ${BROADCAST_BIT}` },
  { at: 'learn.terms.9.name', text: 'Point-to-point /30', value: () => `Point-to-point /${LINK}` },
  { at: 'learn.pattern.note', text: 'any prefix up to /30', value: () => `any prefix up to /${LINK}` },
  {
    at: 'learn.pattern.note',
    text: 'did it for a /24, step 4 for a /26 and step 6 for a /30.',
    value: () => `did it for a /${FLOOR}, step 4 for a /${CUT} and step 6 for a /${LINK}.`,
  },
  { at: 'learn.why', text: 'needs 2 addresses, not 254.', value: () => `needs ${link.usableHosts} addresses, not ${floor.usableHosts}.` },
  {
    at: 'learn.deep',
    text: 'From /24 on, each prefix has a block size: 256 minus the mask’s last number below 255',
    value: () => `From /${FLOOR} on, each prefix has a block size: ${OCTET_MAX + 1} minus the mask’s last number below ${OCTET_MAX}`,
  },
  {
    at: 'learn.deep',
    text: 'at /26, .70 rounds down to .64',
    value: () => `at /${CUT}, ${last(designPc)} rounds down to ${last(design.network)}`,
  },
  {
    at: 'learn.deep',
    text: 'the next subnet’s start, minus 1',
    value: () => `the next subnet’s start, minus ${cutSubnets[designIndex + 1]!.network - design.broadcast}`,
  },

  // Practice.
  {
    at: question('usable-26', 'prompt'),
    text: 'an address in a /26 subnet?',
    value: () => `an address in a /${CUT} subnet?`,
  },
  {
    at: question('usable-26', 'options.0.feedback'),
    text: '64 is how many addresses a /26 has',
    value: () => `${total(CUT)} is how many addresses a /${CUT} has`,
  },
  {
    at: question('usable-26', 'options.0.feedback'),
    text: 'so 62 are left for devices',
    value: () => `so ${usable(CUT)} are left for devices`,
  },
  {
    at: question('usable-26', 'options.1.feedback'),
    text: 'A /26 leaves 6 host bits: 64 addresses.',
    value: () => `A /${CUT} leaves ${hostBits(CUT)} host bits: ${total(CUT)} addresses.`,
  },
  {
    at: question('usable-26', 'options.1.feedback'),
    text: 'broadcast addresses and 62 are left.',
    value: () => `broadcast addresses and ${usable(CUT)} are left.`,
  },
  { at: question('usable-26', 'options.2.feedback'), text: '30 is a /27', value: () => `${usable(NEXT_CUT)} is a /${NEXT_CUT}` },
  {
    at: question('usable-26', 'options.2.feedback'),
    text: 'A /26 has 6 host bits: 64 addresses, minus 2, is 62.',
    value: () => `A /${CUT} has ${hostBits(CUT)} host bits: ${total(CUT)} addresses, minus ${KEPT_BACK}, is ${usable(CUT)}.`,
  },
  {
    at: question('via-router', 'prompt'),
    text: 'At /26, the laptop 192.168.1.10 sends to 192.168.1.70.',
    value: () => `At /${CUT}, the laptop ${formatIPv4(laptop)} sends to ${formatIPv4(designPc)}.`,
  },
  {
    at: question('via-router', 'options.0.feedback'),
    text: 'Under a /26 mask the borrowed bits differ, 00 against 01',
    value: () =>
      `Under a /${CUT} mask the borrowed bits ${borrowed(LAPTOP) === borrowed(DESIGN_PC) ? 'match' : 'differ'}, ${borrowed(LAPTOP)} against ${borrowed(DESIGN_PC)}`,
  },
  {
    at: question('via-router', 'options.1.text'),
    text: 'Straight to 192.168.1.70, because both start 192.168.1.',
    value: () =>
      `Straight to ${formatIPv4(designPc)}, because both start ${subnetValue('network-part', { ...DESIGN_PC_BOARD, prefix: FLOOR })}.`,
  },
  {
    at: question('via-router', 'options.1.feedback'),
    text: 'That would be true at /24. At /26 the network part takes 2 more bits',
    value: () => `That would be true at /${FLOOR}. At /${CUT} the network part takes ${CUT - FLOOR} more bits`,
  },
  { at: question('why-30', 'prompt'), text: 'provider’s router use a /30?', value: () => `provider’s router use a /${LINK}?` },
  {
    at: question('why-30', 'options.0.feedback'),
    text: 'The link uses a /30 because it needs exactly 2 addresses.',
    value: () => `The link uses a /${LINK} because it needs exactly ${link.usableHosts} addresses.`,
  },
  {
    at: question('why-30', 'options.1.feedback'),
    text: 'The /30 is about size: the link has two ends, so it needs exactly 2 addresses.',
    value: () => `The /${LINK} is about size: the link has two ends, so it needs exactly ${link.usableHosts} addresses.`,
  },
  {
    at: question('why-30', 'options.2.text'),
    text: 'It has exactly 2 usable addresses, one for each end.',
    value: () => `It has exactly ${link.usableHosts} usable addresses, one for each end.`,
  },
  {
    at: question('why-30', 'options.2.feedback'),
    text: 'A /30 has 4 addresses: the network, the broadcast, and 2 for devices.',
    value: () => `A /${LINK} has ${link.totalAddresses} addresses: the network, the broadcast, and ${link.usableHosts} for devices.`,
  },
];

export default subnetting;

// The words state only numbers the engine works out: a wrong one stops the build here.
checkStated(subnetting, STATED);
