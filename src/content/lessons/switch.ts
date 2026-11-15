import { defineLesson } from '../define';
import { eventLog } from '../helpers/internet-events';
import type { Backing, MessageEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * Switch, Networking Concepts lesson 5. Four devices on cables are plugged into one switch with five ports. Its MAC table
 * starts empty. The laptop's frame for the printer finds no match, so the switch floods it out of every port but the
 * laptop's, and learns the laptop is on port 2. The printer's reply goes out of port 2 only, and teaches the switch the
 * printer's port. The router's broadcast goes out of every other port, and every device keeps it. Last, the laptop's
 * cable moves to port 5, and its next frame is all the switch needs to learn the move.
 *
 * The scene is the approved design's (prototypes/d13-switch.md): the `switch` figure with the `flood` and `plug laptop 5`
 * cues and the "MAC table" panel. The MAC addresses (RFC 9542 section 2.1.4's documentation range), the device names, the
 * port numbers and the dashes in the log are example data. No standard readable for free defines a switch: IEEE 802.1Q
 * is behind a sign-in and its page is a summary, RFC 4762 defines VPLS and RFC 5556 is a problem statement, so no
 * citation here is marked defining. Every claim rests on two publishers.
 */

// ---------------------------------------------------------------- citations

const rfc = (source: string, section: string) => cite(source, section);

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });
/** An OpenBSD man page names a section by its own id. */
const man = (source: string, id: string) => cite(source, id, { url: `${SOURCES[source]!.url}#${id}` });

const eui = (heading: string, page: number) => cite('ieee-eui-guidelines', heading, { url: `${SOURCES['ieee-eui-guidelines']!.url}#page=${page}` });
const EUI_ALL = eui('Unassigned and NULL EUI values', 11);

const ETHERNET_FRAME = cite('rfc-894', 'Frame Format', {
  url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=IP%20datagrams%20are%20transmitted%20in%20standard%20Ethernet%20frames',
});
const ETHERNET_BROADCAST = cite('rfc-894', 'Address Mappings', {
  url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=The%20broadcast%20Internet%20address',
});
const PALO_HEADER = vendor('paloalto-layer-7', 'Encapsulation Process (Data Flow Downwards)', 'adding MAC addresses in its header');
const MS_FILTER = cite('microsoft-ndis-packet-filter', 'Remarks', { url: `${SOURCES['microsoft-ndis-packet-filter']!.url}#remarks` });
const BPF = cite('openbsd-man-bpf-4', 'BIOCPROMISC', { url: `${SOURCES['openbsd-man-bpf-4']!.url}#BIOCPROMISC` });

const FLOODING = 'cisco-unicast-flooding';
const CISCO_FLOOD = vendor(FLOODING, 'Causes of Flooding', 'except the port it was received on');
const CISCO_NORMAL = vendor(FLOODING, 'Problem Definition', 'Limited flooding is part of the normal switching process');
const CISCO_ARP_FLOOD = vendor(FLOODING, 'Cause 1: Asymmetric Routing', 'Switch A will flood this packet to VLAN 1');
const CISCO_AGE_OUT = vendor(FLOODING, 'Cause 1: Asymmetric Routing', 'this forwarding entry will eventually age out');

const C9300 = 'cisco-9300-mac-table';
const C9300_TABLE = vendor(C9300, 'MAC Address Table', 'The MAC address table contains address information');
const C9300_AGES = vendor(C9300, 'MAC Address Table', 'A source MAC address that the device learns and then ages');
const C9300_LEARN = vendor(C9300, 'MAC Address Table Creation', 'learning the source address of packets');
const C9300_ONLY = vendor(C9300, 'MAC Address Table Creation', 'forwards the packet only to the port associated');
const C9300_SAME = vendor(C9300, 'MAC Address Table Creation', 'the packet is filtered and not forwarded');
const C9300_MANY = vendor(C9300, 'MAC Address Table Creation', 'With multiple MAC addresses supported on all ports');
const C9300_DEFAULTS = vendor(C9300, 'Default MAC Address Table Settings', 'Automatically learned');
const C9300_TYPE = vendor(C9300, 'MAC Address Table', 'the type (static or dynamic)');
const C9300_AGE_TIME = vendor(C9300, 'Changing the Address Aging Time', 'The range is 10 to 1000000 seconds');
const C9300_MOVE = vendor(C9300, 'Configuring MAC Address Move Notification Traps', 'a MAC address moves from one port to another');

const HOW = 'cisco-network-switch-how';
const CISCO_HOW_DEVICES = vendor(HOW, 'Introduction', 'They connect multiple devices');
const CISCO_HOW_WIRED = vendor(HOW, 'How to setup a network switch with a router?', 'that have a wired connection');
const CISCO_HOW_PLUG = vendor(HOW, 'Unmanaged switches', 'simply plug them in and they work');
const CISCO_HOW_ROUTER = vendor(HOW, 'What is a router and how does it work in a network?', 'routers allow different networks to communicate');
const CISCO_HOW_MANY = vendor(HOW, 'Network hubs and switches', 'A large network may include multiple switches');

const ARP = 'cisco-arp-config';
const CISCO_HUB = vendor(ARP, 'Devices That Do Not Use ARP', 'do not maintain an address table');
const CISCO_SW_L2 = vendor(ARP, 'Devices That Do Not Use ARP', 'Layer 2 switches determine which port');
const CISCO_SW_L3 = vendor(ARP, 'Devices That Do Not Use ARP', 'Layer 3 switches are routers');

const PALO = 'paloalto-l2-interface';
const PALO_SECTION = 'Configure a Layer 2 Interface';
const PALO_SWITCH = vendor(PALO, PALO_SECTION, 'so it can act as a switch');
const PALO_OSI = vendor(PALO, PALO_SECTION, 'at Layer 2 of the OSI model');
const PALO_EMPTY = vendor(PALO, PALO_SECTION, 'The firewall begins with an empty MAC table');
const PALO_FLOOD = vendor(PALO, PALO_SECTION, 'it broadcasts the frame to all of its Layer 2');
const PALO_LEARN = vendor(PALO, PALO_SECTION, 'The firewall puts source address');
const PALO_DROPS = vendor(PALO, PALO_SECTION, 'so it drops the frame');

const CF = 'cloudflare-network-switch';
const CF_FLOOD_SECTION = 'How do network switches know the MAC addresses of the devices in their network?';
const CF_FLOOD = vendor(CF, CF_FLOOD_SECTION, 'all other computers on the network (except Computer A)');
const CF_LEARN = vendor(CF, CF_FLOOD_SECTION, 'It records Computer A');
const CF_START = vendor(CF, CF_FLOOD_SECTION, 'has not yet created its CAM table');
const CF_L2 = vendor(CF, 'What is a layer 2 switch? What is a layer 3 switch?', 'Most switches, however, are layer 2 switches');
const CF_L3 = vendor(CF, 'What is a layer 2 switch? What is a layer 3 switch?', 'layer 3 switches forward data based on the destination IP address');
const CF_ROUTER = vendor(CF, 'What is the difference between a switch and a router?', 'Routers do this by connecting with different networks');

const BRIDGE = man('openbsd-man-bridge-4', 'DESCRIPTION');
const IFC_LEARN = man('openbsd-man-ifconfig-8', 'learn');
const IFC_DISCOVER = man('openbsd-man-ifconfig-8', 'discover');
const IFC_TIMEOUT = man('openbsd-man-ifconfig-8', 'timeout');

const ARP_EXAMPLE = cite('rfc-826', 'An Example', { url: 'https://www.rfc-editor.org/rfc/rfc826.html#:~:text=and%20broadcasts%20this%20packet%20to%20everybody' });

const IEEE_1Q = vendor('ieee-802-1q-2022', 'IEEE 802.1Q-2022', 'the operation of MAC Bridges and VLAN Bridges');

// ---------------------------------------------------------------- events

const MAC = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', tv: '00:00:5E:00:53:12', printer: '00:00:5E:00:53:13' } as const;
type Device = keyof typeof MAC;
const ALL = 'ff:ff:ff:ff:ff:ff';
const DASH = '—';

const macTable: TableDef = {
  id: 'mac-table',
  title: 'MAC table',
  by: 'kept by the switch',
  columns: [{ key: 'port', label: 'Port', width: 64 }, { key: 'mac', label: 'MAC address' }],
  keyColumn: 'mac',
  initialRows: [],
  empty: 'Empty: the switch hasn’t learned any address yet',
};

const traced = (...traces: string[]): Backing => ({ traces });

const frame = (
  id: string,
  m: { kind: MessageEvent['kind']; from: Device; to: Device | 'all'; info: string; backing: Backing; cues?: MessageEvent['cues'] },
): MessageEvent => ({
  type: 'message',
  id,
  from: m.from,
  to: m.to,
  tag: m.to === 'all' ? 'TO ALL' : 'FRAME',
  kind: m.kind,
  log: { time: DASH, source: MAC[m.from], destination: m.to === 'all' ? ALL : MAC[m.to], protocol: 'Ethernet', info: m.info, size: DASH },
  plain: m.info,
  ...(m.cues ? { cues: m.cues } : {}),
  backing: m.backing,
});
const tableEvent = (id: string, summary: string, backing: Backing, o: Partial<TableEvent> = {}): TableEvent => ({
  type: 'table',
  id,
  table: 'mac-table',
  op: 'match',
  summary,
  backing,
  ...o,
}) as TableEvent;

const step1 = [
  frame('s1-frame', {
    kind: 'request',
    from: 'laptop',
    to: 'printer',
    info: `Frame for ${MAC.printer}: no match, so flooded out of ports 1, 3 and 4`,
    backing: traced('term-frame', 'term-switch', 'term-port', 'term-flood', 'fact-unknown', 'pattern'),
    cues: [{ cue: 'flood' }],
  }),
  tableEvent('s1-match', `The switch finds no entry for ${MAC.printer}.`, traced('pattern', 'fact-unknown', 'fact-start', 'term-table'), { key: '' }),
];
const step2 = [
  tableEvent('s2-add', `The switch writes ${MAC.laptop} beside port 2.`, traced('term-learn', 'fact-learn', 'term-table', 'term-port'), {
    op: 'add',
    row: { port: '2', mac: MAC.laptop },
  }),
];
const step3 = [
  frame('s3-frame', {
    kind: 'response',
    from: 'printer',
    to: 'laptop',
    info: `Frame for ${MAC.laptop}: in the table, port 2`,
    backing: traced('term-frame', 'term-switch', 'term-port', 'fact-known', 'pattern'),
  }),
  tableEvent('s3-add', `The switch writes ${MAC.printer} beside port 4.`, traced('term-learn', 'fact-learn', 'term-table', 'term-port'), {
    op: 'add',
    row: { port: '4', mac: MAC.printer },
  }),
  tableEvent('s3-match', `The switch finds ${MAC.laptop} on port 2.`, traced('fact-known', 'pattern', 'term-table', 'term-port'), { key: MAC.laptop }),
];
const step4 = [
  frame('s4-frame', {
    kind: 'broadcast',
    from: 'router',
    to: 'all',
    info: `Frame to ${ALL} (everyone), out of ports 2, 3 and 4`,
    backing: traced('term-frame', 'term-switch', 'term-port', 'term-broadcast', 'fact-broadcast', 'fact-router'),
  }),
  tableEvent('s4-add', `The switch writes ${MAC.router} beside port 1.`, traced('term-learn', 'fact-learn', 'term-table', 'term-port'), {
    op: 'add',
    row: { port: '1', mac: MAC.router },
  }),
];
const step5 = [
  frame('s5-frame', {
    kind: 'request',
    from: 'laptop',
    to: 'router',
    info: `Frame for ${MAC.router}: in the table, port 1`,
    backing: traced('term-frame', 'term-switch', 'term-port', 'fact-known', 'fact-move', 'fact-router'),
    cues: [{ cue: 'plug', arg: 'laptop 5' }],
  }),
  tableEvent('s5-update', `The switch now has ${MAC.laptop} on port 5.`, traced('fact-move', 'term-learn', 'term-table', 'term-port'), {
    op: 'update',
    key: MAC.laptop,
    row: { port: '5' },
  }),
  tableEvent('s5-match', `The switch finds ${MAC.router} on port 1.`, traced('fact-known', 'pattern', 'term-table', 'term-port'), { key: MAC.router }),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'switch',
  title: 'Switch',
  subtitle: 'Learning which device is on which port',
  level: 'beginner',
  certTags: [],
  summary:
    'Watch a switch start with an empty table, flood a frame it can’t place, learn where each device is plugged in, and then send frames out of one port only.',
  figure: 'switch',
  backing: { traces: ['term-learn', 'term-table', 'fact-start', 'term-flood', 'fact-learn', 'fact-known'] },
  units: [
    {
      id: 'switch',
      name: 'Switch',
      fullName: 'Network switch',
      purpose: 'Passing frames between the devices of one network',
      osi: { layers: [2], cite: [CISCO_SW_L2, CF_L2, PALO_OSI] },
      backing: { traces: ['term-switch'] },
      scene: {
        title: 'Four devices on one switch',
        views: ['network'],
        layers: [],
        labels: {},
        start: [],
        panel: { type: 'table', table: macTable },
        log: {
          ...eventLog(),
          legend: [
            { kind: 'request', label: 'Frame for one device' },
            { kind: 'broadcast', label: 'Frame for everyone' },
            { kind: 'response', label: 'The reply' },
          ],
        },
        parties: [],
        backing: { traces: ['term-switch', 'term-port', 'term-table', 'term-learn', 'term-flood'] },
      },
      overview: {
        hook: 'On Wi-Fi, every device in range hears each frame. Plug a laptop, a TV and a printer into a switch, and at first it has no idea which is where. So a frame for a device it doesn’t know goes out of every other port. But every frame also says who sent it, and from that the switch learns who is on which port. Soon a frame for one device goes down that device’s cable only.',
        hookBacking: { traces: ['fact-wifi', 'term-switch', 'fact-start', 'fact-unknown', 'fact-learn', 'fact-known'] },
        description:
          'A switch connects the devices of one wired network. It learns which MAC address is on which port, and floods a frame when it doesn’t know.',
        backing: { traces: ['term-switch', 'term-table', 'term-learn', 'term-flood'] },
        facts: [
          { label: 'Learns from', value: 'the sender’s address on each frame', backing: { traces: ['fact-learn'] } },
          { label: 'Known address', value: 'out of one port only', backing: { traces: ['fact-known'] } },
          { label: 'Unknown address', value: 'a copy out of every other port', backing: { traces: ['fact-unknown'] } },
          { label: 'OSI layer', value: '2, data link', backing: { traces: ['fact-osi'] } },
          { label: 'Defined in', value: 'IEEE 802.1Q', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'no-match',
          title: 'No match, so it floods',
          sub: 'An empty table',
          narrative:
            'Four devices are plugged into a **switch**, each by its own cable: the router into port 1, the laptop port 2, the TV port 3 and the printer port 4. The switch’s **MAC table** is empty: it has no idea who is where. The laptop sends a frame to the printer, 00:00:5E:00:53:13. The switch looks the address up and finds no match, so it **floods** the frame: a copy out of every port except the one it came in on. The printer sees its own address and keeps the frame. The router and the TV ignore it.',
          deep: [
            {
              text: 'Flooding like this is a normal part of a switch’s work, not a fault.',
              cite: [CISCO_NORMAL, rfc('rfc-4762', '4.1')],
            },
          ],
          facts: [
            { label: 'Looking for', value: `${MAC.printer}, the printer`, backing: { traces: ['term-frame', 'term-table'] } },
            { label: 'In the table', value: 'no match', backing: { traces: ['fact-start', 'fact-unknown'] } },
            { label: 'Sent out of', value: 'ports 1, 3 and 4: every port but the laptop’s', backing: { traces: ['term-flood', 'fact-unknown', 'term-port'] } },
            { label: 'Kept by', value: 'the printer', backing: { traces: ['fact-keep'] } },
          ],
          events: step1,
          backing: { traces: ['term-switch', 'term-port', 'term-frame', 'term-table', 'term-flood', 'fact-start', 'fact-unknown', 'fact-keep', 'fact-router', 'pattern'] },
        },
        {
          id: 'learns-the-sender',
          title: 'It learns the sender',
          sub: 'Port 2 is 00:00:5E:00:53:10',
          narrative:
            'That frame told the switch something else: who sent it. Its source address is the laptop’s, 00:00:5E:00:53:10, and it came in on port 2. So the switch writes 00:00:5E:00:53:10 in its table beside port 2. Nobody set this up. A switch **learns** where each device is from the frames that device sends.',
          deep: [
            {
              text: 'Entries a switch learns like this are called dynamic; some switches also let you add static ones.',
              cite: [C9300_TYPE, C9300_AGES, IFC_DISCOVER],
            },
          ],
          facts: [
            { label: 'Learned from', value: 'the frame’s source address', backing: { traces: ['fact-learn', 'term-frame'] } },
            { label: 'On port', value: '2, where the frame came in', backing: { traces: ['fact-learn', 'term-port'] } },
            { label: 'Set up by', value: 'nobody: the switch learns it', backing: { traces: ['why-2', 'term-learn'] } },
          ],
          events: step2,
          backing: { traces: ['term-learn', 'fact-learn', 'why-2', 'term-table', 'term-port', 'term-frame'] },
        },
        {
          id: 'straight-to-one-port',
          title: 'Straight to one port',
          sub: 'The printer replies',
          narrative:
            'The printer replies to the laptop. Its frame comes in on port 4, so the switch learns that too: 00:00:5E:00:53:13 is on port 4. Then it looks up the destination, the laptop’s 00:00:5E:00:53:10, and finds it: port 2. It sends the frame out of port 2 only. The router and the TV don’t get a copy.',
          deep: [
            {
              text: 'If a frame’s destination is on the port it came in on, the switch drops it: that device has had its chance to see it already.',
              cite: [C9300_SAME, BRIDGE],
            },
          ],
          facts: [
            { label: 'Learned', value: `${MAC.printer} on port 4`, backing: { traces: ['fact-learn', 'term-port'] } },
            { label: 'Found', value: `${MAC.laptop} on port 2`, backing: { traces: ['fact-known', 'term-table'] } },
            { label: 'Sent out of', value: 'port 2 only', backing: { traces: ['fact-known', 'why-1'] } },
          ],
          events: step3,
          backing: { traces: ['fact-learn', 'fact-known', 'pattern', 'why-1', 'term-table', 'term-port', 'term-frame'] },
        },
        {
          id: 'to-everyone',
          title: 'To everyone, every port',
          sub: 'ff:ff:ff:ff:ff:ff',
          narrative:
            'Now your router sends a frame to the **broadcast address**, ff:ff:ff:ff:ff:ff, which means everyone. A switch sends a broadcast out of every port except the one it came in on, so the laptop, the TV and the printer each get a copy, and each keeps it. Like any frame, it also tells the switch who sent it: the router is on port 1.',
          deep: [
            {
              text: 'ARP, which finds a device’s MAC address, sends its question as a broadcast, so a switch floods it out of every other port.',
              cite: [ARP_EXAMPLE, CISCO_ARP_FLOOD],
            },
          ],
          facts: [
            { label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff', backing: { traces: ['term-broadcast', 'fact-broadcast'] } },
            { label: 'Sent out of', value: 'ports 2, 3 and 4', backing: { traces: ['fact-broadcast', 'term-port'] } },
            { label: 'Kept by', value: 'every device', backing: { traces: ['fact-broadcast', 'fact-keep'] } },
            { label: 'Learned', value: `${MAC.router} on port 1`, backing: { traces: ['fact-learn', 'term-port'] } },
          ],
          events: step4,
          backing: { traces: ['term-broadcast', 'fact-broadcast', 'fact-keep', 'fact-learn', 'fact-router', 'term-port', 'term-frame'] },
        },
        {
          id: 'moved',
          title: 'Moved? It learns again',
          sub: 'The laptop on port 5',
          narrative:
            'Someone moves the laptop’s cable from port 2 to port 5. When the laptop next sends a frame, this time to the router, it comes in on port 5. So the switch’s table now has 00:00:5E:00:53:10 on port 5. The router is in the table, on port 1, so the frame goes out of port 1 only. The table keeps up with the move by itself.',
          deep: [
            {
              text: 'The table forgets quietly too: an entry the switch hasn’t heard from for a while is dropped, and the device’s next frame puts it back.',
              cite: [C9300_AGES, IFC_TIMEOUT],
            },
          ],
          facts: [
            { label: 'Laptop now on', value: 'port 5', backing: { traces: ['fact-move', 'term-port'] } },
            { label: 'Learned from', value: 'its next frame', backing: { traces: ['fact-move', 'fact-learn'] } },
            { label: 'Sent out of', value: 'port 1 only', backing: { traces: ['fact-known', 'term-port'] } },
          ],
          events: step5,
          backing: { traces: ['fact-move', 'fact-learn', 'fact-known', 'why-2', 'fact-router', 'term-port', 'term-table', 'term-frame'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'A switch connects the devices of one wired network. From each frame that comes in, it learns which MAC address is on which port. A frame for an address it has learned goes out of that one port; a frame for an address it hasn’t learned, or for everyone, goes out of every port except the one it came in on.',
            cite: [C9300_LEARN, C9300_ONLY, BRIDGE, CISCO_FLOOD, CF_FLOOD, rfc('rfc-4762', '4.1'), CISCO_HOW_DEVICES, CISCO_HOW_WIRED],
          },
          {
            id: 'lead-2',
            text: 'Like a new porter in an office building: until he knows where someone sits, he calls their name down every corridor. Once he has seen which corridor they come from, he walks straight there.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-switch',
            idea: 'A box that connects the devices of one network: each plugs into a port with a cable, and the switch passes Ethernet frames between them',
            name: 'Switch',
            cite: [CISCO_HOW_DEVICES, CISCO_HOW_WIRED, BRIDGE, rfc('rfc-5556', '2')],
          },
          {
            id: 'term-port',
            idea: 'A socket on the switch where a device’s cable plugs in',
            name: 'Port',
            cite: [C9300_MANY, rfc('rfc-5556', '3.1'), PALO_SWITCH],
          },
          {
            id: 'term-frame',
            idea: 'What a packet travels in across your own network, with the MAC address it’s for and the one it’s from at the front',
            name: 'Frame',
            cite: [rfc('rfc-9542', '3'), ETHERNET_FRAME, PALO_HEADER],
          },
          {
            id: 'term-table',
            idea: 'The switch’s list of which MAC address is on which port',
            name: 'MAC table',
            cite: [C9300_TABLE, BRIDGE, PALO_LEARN],
          },
          {
            id: 'term-learn',
            idea: 'Noting each incoming frame’s source MAC address beside the port it came in on',
            name: 'Learning',
            cite: [C9300_LEARN, BRIDGE, IFC_LEARN, PALO_LEARN],
          },
          {
            id: 'term-flood',
            idea: 'Sending a copy of a frame out of every port except the one it came in on, when the switch doesn’t know which port leads to its destination',
            name: 'Flooding',
            cite: [CISCO_FLOOD, CF_FLOOD, BRIDGE, IFC_DISCOVER, rfc('rfc-4762', '4.1')],
          },
          {
            id: 'term-broadcast',
            idea: 'The address that means every device on the network: ff:ff:ff:ff:ff:ff',
            name: 'Broadcast address',
            cite: [ETHERNET_BROADCAST, EUI_ALL],
          },
          {
            id: 'term-age',
            idea: 'Dropping a table entry the switch hasn’t heard from for a while',
            name: 'Ageing out',
            cite: [C9300_AGES, IFC_TIMEOUT, CISCO_AGE_OUT],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Note the sender’s port', 'Look up the destination', 'Found it: out of that one port', 'No match, or for everyone: out of every other port'],
          note: 'What a switch does with each frame that comes in.',
          cite: [C9300_LEARN, C9300_ONLY, BRIDGE, CISCO_FLOOD, CF_FLOOD, rfc('rfc-4762', '4.1')],
        },
        why: [
          {
            id: 'why-1',
            text: 'A switch learns where each device is so that a frame for one device goes down that device’s cable alone, not to everyone.',
            cite: [C9300_ONLY, BRIDGE, rfc('rfc-5556', '3.2')],
          },
          {
            id: 'why-2',
            text: 'Nobody fills the table in: you plug the devices in, and the switch learns the rest from the frames they send.',
            cite: [CISCO_HOW_PLUG, C9300_DEFAULTS, rfc('rfc-5556', '3.2'), PALO_EMPTY],
          },
        ],
        deep: [
          {
            id: 'deep-hub',
            text: 'A hub, the box switches replaced, keeps no table and learns nothing.',
            cite: [CISCO_HUB, BRIDGE, rfc('rfc-5556', '2')],
          },
          {
            id: 'deep-many',
            text: 'One port can lead to another switch, so the table can list several addresses on one port.',
            cite: [C9300_MANY, BRIDGE, CISCO_HOW_MANY],
          },
          {
            id: 'deep-age',
            text: 'How long is “a while”? It can be changed, and the default differs: 300 seconds on Cisco’s Catalyst 9300 switches, 240 on OpenBSD’s bridge.',
            cite: [C9300_AGE_TIME, IFC_TIMEOUT],
          },
          {
            id: 'deep-l3',
            text: 'Some switches, called layer 3 switches, can also route using IP addresses.',
            cite: [CISCO_SW_L3, CF_L3],
          },
        ],
        facts: [
          { id: 'fact-start', label: 'At the start', value: 'the MAC table is empty', cite: [PALO_EMPTY, C9300_DEFAULTS, CF_START] },
          {
            id: 'fact-learn',
            label: 'Learns from',
            value: 'the source MAC address of each frame that comes in, beside the port it came in on',
            cite: [C9300_LEARN, BRIDGE, IFC_LEARN, PALO_LEARN, CF_LEARN],
          },
          { id: 'fact-known', label: 'Address in the table', value: 'the frame goes out of that one port only', cite: [C9300_ONLY, BRIDGE] },
          {
            id: 'fact-unknown',
            label: 'Address not in the table',
            value: 'the switch floods the frame: a copy out of every port except the one it came in on',
            cite: [CISCO_FLOOD, CF_FLOOD, BRIDGE, PALO_FLOOD, rfc('rfc-4762', '4.1')],
          },
          {
            id: 'fact-broadcast',
            label: 'Broadcast',
            value: 'ff:ff:ff:ff:ff:ff goes out of every port except the one it came in on, so every device gets a copy',
            cite: [rfc('rfc-4762', '4.1'), CISCO_ARP_FLOOD, IFC_DISCOVER, EUI_ALL],
          },
          {
            id: 'fact-keep',
            label: 'Each device',
            value: 'keeps a frame for its own MAC address or for everyone, and ignores the rest',
            cite: [PALO_DROPS, MS_FILTER, BPF],
          },
          {
            id: 'fact-age',
            label: 'Old entries',
            value: 'an entry the switch hasn’t heard from for a while ages out; the device’s next frame puts it back',
            cite: [C9300_AGES, IFC_TIMEOUT, CISCO_AGE_OUT],
          },
          {
            id: 'fact-move',
            label: 'A device moves',
            value: 'the switch updates its entry from the first frame the device sends on its new port',
            cite: [rfc('rfc-5556', '3.1'), C9300_MOVE, C9300_LEARN],
          },
          {
            id: 'fact-router',
            label: 'Switch or router',
            value: 'a switch connects the devices of one network; a router joins networks',
            cite: [CISCO_HOW_ROUTER, rfc('rfc-1812', '2.2.3'), CF_ROUTER],
          },
          {
            id: 'fact-wifi',
            label: 'On Wi-Fi',
            value: 'every device in range hears each frame, and can read its MAC addresses',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), MS_FILTER],
          },
          { id: 'fact-osi', label: 'OSI layer', value: '2, data link', cite: [CISCO_SW_L2, CF_L2, PALO_OSI] },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'IEEE 802.1Q, which calls a switch a bridge',
            cite: [IEEE_1Q, rfc('rfc-4762', '4.2'), rfc('rfc-5556', '2.5')],
          },
        ],
      },
      practice: [
        {
          id: 'unknown-tv',
          prompt: 'The switch’s table has the router, the laptop and the printer, but not the TV: the TV hasn’t sent anything yet. The laptop sends a frame to the TV. What does the switch do?',
          options: [
            {
              text: 'It floods it: a copy out of every port except the laptop’s.',
              feedback: 'Right. The TV’s address isn’t in the table, so the switch can’t tell which port leads to it. The TV keeps its copy; the others ignore theirs.',
              cite: [CISCO_FLOOD, CF_FLOOD, BRIDGE, PALO_DROPS],
            },
            {
              text: 'It drops it, because the TV isn’t in its table.',
              feedback: 'No. A switch doesn’t drop a frame for an address it hasn’t learned: it floods it, so the frame still reaches the TV.',
              cite: [CISCO_FLOOD, BRIDGE, IFC_DISCOVER],
            },
            {
              text: 'It sends it out of the TV’s port only.',
              feedback: 'It would if it knew which port that was. It learns a device’s port from the frames that device sends, and the TV hasn’t sent one.',
              cite: [C9300_LEARN, BRIDGE, PALO_LEARN],
            },
          ],
          answer: 0,
        },
        {
          id: 'broadcast-ports',
          prompt: 'A switch has five ports with a device on each. The device on port 1 sends a frame to ff:ff:ff:ff:ff:ff. Which ports does the switch send it out of?',
          options: [
            {
              text: 'Ports 2, 3, 4 and 5.',
              feedback: 'Right. A broadcast goes out of every port except the one it came in on, and every device keeps it.',
              cite: [rfc('rfc-4762', '4.1'), CISCO_ARP_FLOOD, IFC_DISCOVER],
            },
            {
              text: 'Only the ports whose devices are in its table.',
              feedback: 'No. A broadcast goes out of every port except the one it came in on, whatever is in the table.',
              cite: [rfc('rfc-4762', '4.1'), IFC_DISCOVER, C9300_ONLY],
            },
            {
              text: 'None: no device has that address.',
              feedback: 'No device has it, but it means everyone: the switch sends it out of every other port, and every device keeps it.',
              cite: [ETHERNET_BROADCAST, EUI_ALL, rfc('rfc-4762', '4.1')],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
