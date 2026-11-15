import { defineLesson } from '../define';
import type { Backing, MessageEvent, Row, SceneEvent, TableDef, TableEvent } from '../schema';
import { cite, SOURCES } from '../sources';

/**
 * MAC Address, Networking Concepts lesson 4. A home Wi-Fi with a router, a laptop, a phone and a TV. The laptop sends a
 * frame to the router: every device in range hears it, and only the router, whose MAC address is on it, keeps it. The
 * laptop's own address splits into two halves, an organization's number (the OUI) and the number of one card. Then the
 * router sends a frame to everyone (ff:ff:ff:ff:ff:ff): every device keeps it. Last, example.net's reply comes back from
 * the router in a new frame for the laptop, with the router's and the laptop's MAC addresses on it, never example.net's.
 *
 * The scene is the approved design's (prototypes/d12-batch-2.md sections 3.2, 7 and 11, with the errata in
 * prototypes/d12-cases.md): the dhcp figure with the `frames` start, the "Who keeps the frame" table, and after each
 * frame one `replace` that shows who heard it. The MAC addresses (RFC 9542 section 2.1.4's documentation range, the TV's
 * 00:00:5E:00:53:12 new), example.net and the router, laptop, phone and TV are example data; the log's times and sizes
 * are dashes because no source states one for this story. No randomized address is shown in Watch: RFC 9542 reserves
 * no example value with the local bit set. RFC 894 defines the broadcast mapping and RFC 9542 sections 1.3 and 2.1.4
 * the values it assigns; the IEEE tutorial and FAQ are the IEEE Registration Authority's guidance, not IEEE Std 802, so
 * they carry no defining marker, and no vendor page does. No standard places MAC addresses at an OSI layer, so the badge
 * rests on two vendors' pages.
 */

// ---------------------------------------------------------------- citations

const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});

/** A vendor's or the IEEE's page has no section numbers, so a section is cited by a text fragment that starts in it. None is the defining standard. */
const vendor = (source: string, section: string, text: string) =>
  cite(source, section, { url: `${SOURCES[source]!.url}#:~:text=${encodeURIComponent(text).replaceAll('-', '%2D')}` });

/** The IEEE tutorial is a PDF with no section ids: a page of it is cited by its heading and its page. */
const eui = (heading: string, page: number) => cite('ieee-eui-guidelines', heading, { url: `${SOURCES['ieee-eui-guidelines']!.url}#page=${page}` });
const EUI_OUI = eui('IEEE-Administered organizational identifiers: OUI and CID', 2);
const EUI_BITS = eui('Extended Unique Identifiers', 6);
const EUI_HEX = eui('EUI Structure and Representation', 9);
const EUI_ALL = eui('Unassigned and NULL EUI values', 11);

const FAQ = 'ieee-ra-faq';
const FAQ_OUI = vendor(FAQ, 'What is an Organizationally Unique Identifier (OUI)?', 'An OUI is a 24-bit');
const FAQ_MAC = vendor(FAQ, 'What is an Organizationally Unique Identifier (OUI)?', 'the Ethernet MAC Address is an EUI-48');
const FAQ_BLOCKS = vendor(FAQ, 'How can I obtain a universally unique MAC/Ethernet address?', 'Blocks of universally unique MAC addresses');
const FAQ_SINGLE = vendor(FAQ, 'How can I obtain a universally unique MAC/Ethernet address?', 'Individual (i.e., single) addresses');
const FAQ_STD = vendor(FAQ, 'What standards are involved with EUI-48, EUI-64, OUI and CID assignments?', 'provides general descriptions on use of EUI-48');
const FAQ_COLON = vendor(FAQ, 'What is an Individual Address Block (IAB)?', 'the OUI value 00:50:C2');
const IEEE_802 = vendor('ieee-802-2024', 'IEEE 802-2024', 'specifies the structure of IEEE 802 MAC addresses');

const ETHERNET_FRAME = cite('rfc-894', 'Frame Format', {
  url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=IP%20datagrams%20are%20transmitted%20in%20standard%20Ethernet%20frames',
  defining: true,
});
const ETHERNET_BROADCAST = cite('rfc-894', 'Address Mappings', {
  url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=The%20broadcast%20Internet%20address',
  defining: true,
});
/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it starts on. */
const host = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });

const CISCO = 'cisco-arp-config';
const CISCO_NAME = vendor(CISCO, 'Address Resolution Protocol', 'also known as Media Access Control (MAC) address');
const CISCO_BURNED = vendor(CISCO, 'Layer 2 and Layer 3 Addressing', 'burned in');
const CISCO_LAYERS = vendor(CISCO, 'Layer 2 and Layer 3 Addressing', 'Layer 2 addresses are used for local transmissions');
const CISCO_L2 = vendor(CISCO, 'Layer 2 and Layer 3 Addressing', 'IP addressing occurs at Layer 2');
const CISCO_REMOTE = vendor(CISCO, 'Overview of the Address Resolution Protocol', 'When the destination device lies on a remote network');
const CISCO_HOP = vendor(CISCO, 'ARP Caching', 'Because the mapping of IP addresses to media access control');

const PALO = 'paloalto-layer-7';
const PALO_L2 = vendor(PALO, 'Meet the Layers of the OSI Model', 'Layer 2 - The Data Link Layer');
const PALO_HEADER = vendor(PALO, 'Encapsulation Process (Data Flow Downwards)', 'adding MAC addresses in its header');
const PALO_REMOVES = vendor(PALO, 'De-Encapsulation Process (Data Flow Upwards)', 'removes the MAC addresses');

const MS_FILTER = cite('microsoft-ndis-packet-filter', 'Remarks', { url: `${SOURCES['microsoft-ndis-packet-filter']!.url}#remarks` });
const MS_RANDOM = cite('microsoft-wifi-connect', 'Random hardware addresses', { url: `${SOURCES['microsoft-wifi-connect']!.url}#random-hardware-addresses` });
const BPF = cite('openbsd-man-bpf-4', 'BIOCPROMISC', { url: `${SOURCES['openbsd-man-bpf-4']!.url}#BIOCPROMISC` });
const IFCONFIG = cite('openbsd-man-ifconfig-8', 'lladdr', { url: `${SOURCES['openbsd-man-ifconfig-8']!.url}#lladdr` });

/** No standard places MAC addresses at an OSI layer, so the badge rests on two vendors (Cisco and Palo Alto Networks). */

// ---------------------------------------------------------------- events

const MAC = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', phone: '00:00:5E:00:53:11', tv: '00:00:5E:00:53:12' } as const;
type Device = keyof typeof MAC;
const DEVICES: [string, Device][] = [['Router', 'router'], ['Laptop', 'laptop'], ['Phone', 'phone'], ['TV', 'tv']];
const DASH = '—';

const frames: TableDef = {
  id: 'frames',
  title: 'Who keeps the frame',
  by: 'each device decides for itself',
  columns: [
    { key: 'device', label: 'Device', prose: true },
    { key: 'mac', label: 'MAC address' },
    { key: 'frame', label: 'This frame', prose: true },
  ],
  keyColumn: 'mac',
  initialRows: DEVICES.map(([device, place]): Row => ({ device, mac: MAC[place], frame: DASH })),
  empty: 'Nothing here yet.',
};

const traced = (...traces: string[]): Backing => ({ traces });

const frameMsg = (
  id: string,
  m: { kind: MessageEvent['kind']; from: Device; to: Device; tag: string; destination: string; info: string; backing: Backing },
): MessageEvent => ({
  type: 'message',
  id,
  from: m.from,
  to: m.to,
  tag: m.tag,
  kind: m.kind,
  log: { time: DASH, source: MAC[m.from], destination: m.destination, protocol: 'Wi-Fi', info: m.info, size: DASH },
  plain: m.info,
  backing: m.backing,
});
const table = (id: string, op: TableEvent['op'], summary: string, backing: Backing, o: Partial<TableEvent> = {}): TableEvent => ({
  type: 'table',
  id,
  table: 'frames',
  op,
  summary,
  backing,
  ...o,
});
/** One word in one device's "This frame" cell. */
const keeps = (id: string, who: Device, word: 'Keeps it' | 'Ignores it', backing: Backing): TableEvent =>
  table(id, 'update', `The ${who} says: ${word}.`, backing, { key: MAC[who], row: { frame: word } });
/** After each frame, one replace: the sender "Sent it", every other row "Hears it". */
const heard = (id: string, sender: Device, summary: string): TableEvent =>
  table(id, 'replace', summary, traced('fact-hear', 'fact-frame'), {
    rows: DEVICES.map(([device, place]): Row => ({ device, mac: MAC[place], frame: place === sender ? 'Sent it' : 'Hears it' })),
  });

const step1: SceneEvent[] = [
  frameMsg('s1-frame', {
    kind: 'request',
    from: 'laptop',
    to: 'router',
    tag: 'FRAME',
    destination: MAC.router,
    info: `Frame to ${MAC.router} (the router), carrying a packet for example.net`,
    backing: traced('term-frame', 'term-mac', 'fact-frame', 'fact-local'),
  }),
  heard('s1-heard', 'laptop', 'Every device hears the frame: the router, the phone and the TV.'),
];
const step2: SceneEvent[] = [
  keeps('s2-router', 'router', 'Keeps it', traced('fact-keep', 'pattern')),
  keeps('s2-phone', 'phone', 'Ignores it', traced('fact-keep', 'pattern')),
  keeps('s2-tv', 'tv', 'Ignores it', traced('fact-keep', 'pattern')),
];
const step3: SceneEvent[] = [
  table('s3-match', 'match', 'The laptop’s address: 00:00:5E, the OUI, then 00:53:10, this card.', traced('term-oui', 'fact-halves', 'fact-size'), { key: MAC.laptop }),
];
const step4: SceneEvent[] = [
  frameMsg('s4-frame', {
    kind: 'broadcast',
    from: 'router',
    to: 'laptop',
    tag: 'TO ALL',
    destination: 'ff:ff:ff:ff:ff:ff',
    info: 'Frame to ff:ff:ff:ff:ff:ff (everyone)',
    backing: traced('term-frame', 'term-mac', 'term-broadcast', 'fact-broadcast', 'fact-frame'),
  }),
  heard('s4-heard', 'router', 'Every device hears the router’s frame: the laptop, the phone and the TV.'),
  keeps('s4-laptop', 'laptop', 'Keeps it', traced('fact-broadcast', 'fact-keep')),
  keeps('s4-phone', 'phone', 'Keeps it', traced('fact-broadcast', 'fact-keep')),
  keeps('s4-tv', 'tv', 'Keeps it', traced('fact-broadcast', 'fact-keep')),
];
const step5: SceneEvent[] = [
  frameMsg('s5-frame', {
    kind: 'response',
    from: 'router',
    to: 'laptop',
    tag: 'FRAME',
    destination: MAC.laptop,
    info: `Frame to ${MAC.laptop} (the laptop), carrying example.net’s reply`,
    backing: traced('term-frame', 'term-mac', 'fact-frame', 'fact-local'),
  }),
  heard('s5-heard', 'router', 'Every device hears the router’s frame: the laptop, the phone and the TV.'),
  keeps('s5-laptop', 'laptop', 'Keeps it', traced('fact-keep', 'pattern')),
  keeps('s5-phone', 'phone', 'Ignores it', traced('fact-keep', 'pattern')),
  keeps('s5-tv', 'tv', 'Ignores it', traced('fact-keep', 'pattern')),
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'mac-address',
  title: 'MAC Address',
  subtitle: 'The address on every frame',
  level: 'beginner',
  certTags: [],
  summary:
    'Watch a frame cross your home Wi-Fi: every device hears it, and only the one whose MAC address is on it keeps it. Then see what the address’s two halves mean.',
  figure: 'dhcp',
  backing: { traces: ['lead-1', 'fact-hear', 'fact-keep', 'fact-halves', 'term-mac', 'term-frame'] },
  units: [
    {
      id: 'mac-address',
      name: 'MAC address',
      fullName: 'Media Access Control address',
      purpose: 'Saying which device a frame is for',
      osi: { layers: [2], cite: [CISCO_L2, PALO_L2] },
      backing: { traces: ['term-mac', 'fact-name', 'term-frame', 'why-1', 'fact-defined'] },
      scene: {
        title: 'One frame on a home Wi-Fi',
        views: ['network'],
        layers: [],
        labels: {},
        start: [{ cue: 'frames' }],
        panel: { type: 'table', table: frames },
        log: {
          title: 'Event log',
          columns: [
            { key: 'time', label: 'Time', width: 100 },
            { key: 'source', label: 'Source', width: 150 },
            { key: 'destination', label: 'Destination', width: 172 },
            { key: 'protocol', label: 'Protocol', width: 84 },
            { key: 'info', label: 'Info', prose: true },
            { key: 'size', label: 'Size', width: 64 },
          ],
          legend: [
            { kind: 'request', label: 'Frame to one device' },
            { kind: 'broadcast', label: 'Frame to everyone' },
            { kind: 'response', label: 'Frame back to the laptop' },
          ],
        },
        parties: [],
        backing: { traces: ['term-mac', 'term-frame', 'term-broadcast', 'fact-hear', 'fact-keep'] },
      },
      overview: {
        hook: 'Your phone, your laptop and your TV share one Wi-Fi, and every device in range hears every frame sent on it. So each frame names the device it’s for by its MAC address, the hardware number of its network card. The device whose address is on it keeps it, and the others ignore it, unless it’s sent to everyone.',
        hookBacking: { traces: ['fact-hear', 'fact-keep', 'term-mac', 'term-frame', 'term-broadcast', 'why-1'] },
        description:
          'A MAC address is 48 bits: an organization’s number from the IEEE, then that organization’s number for one card. It only matters on your own network.',
        backing: { traces: ['fact-size', 'fact-halves', 'fact-local'] },
        facts: [
          { label: 'Length', value: '48 bits, six pairs of hex digits', backing: { traces: ['fact-size'] } },
          { label: 'First half', value: 'the organization’s number (OUI)', backing: { traces: ['term-oui', 'fact-halves'] } },
          { label: 'Everyone', value: 'ff:ff:ff:ff:ff:ff', backing: { traces: ['term-broadcast'] } },
          { label: 'Reaches', value: 'only your own network', backing: { traces: ['fact-local'] } },
          { label: 'OSI layer', value: '2, data link', backing: { traces: ['fact-osi'] } },
          { label: 'Defined in', value: 'IEEE Std 802', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'everyone-hears',
          title: 'Everyone hears it',
          sub: 'A frame for the router',
          narrative:
            'Your laptop has a packet for example.net. That’s beyond your home network, so it goes to your router first, in a **frame**. On the front of the frame are two **MAC addresses**: the router’s, 00:00:5E:00:53:01, where it’s going, and the laptop’s own, 00:00:5E:00:53:10, where it’s from. The laptop sends it over the Wi-Fi. Wi-Fi is radio, so every device in range hears the frame: the router, the phone and the TV.',
          deep: [
            {
              text: 'Anybody in radio range can see a Wi-Fi device’s MAC address, and some places might use it to track movement.',
              cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), MS_RANDOM],
            },
          ],
          facts: [
            { label: 'To', value: `${MAC.router}, the router`, backing: { traces: ['term-mac', 'fact-frame'] } },
            { label: 'From', value: `${MAC.laptop}, the laptop`, backing: { traces: ['term-mac', 'fact-frame'] } },
            { label: 'Heard by', value: 'every device in range', backing: { traces: ['fact-hear'] } },
          ],
          events: step1,
          backing: { traces: ['fact-local', 'term-frame', 'term-mac', 'fact-frame', 'fact-hear'] },
        },
        {
          id: 'only-the-match',
          title: 'Only the match keeps it',
          sub: 'Is it mine?',
          narrative:
            'Each device reads the frame’s destination and compares it with its own MAC address. The router’s matches, so the router keeps the frame and reads the packet inside. The phone’s and the TV’s don’t match, so they ignore it. A frame sent to one device’s address is kept by that device alone.',
          deep: [
            {
              text: 'A card can be set to keep every frame it hears, not just its own, as a capture tool does.',
              cite: [BPF, MS_FILTER],
            },
          ],
          facts: [
            { label: 'Router', value: 'keeps it: its address is on the frame', backing: { traces: ['fact-keep', 'pattern'] } },
            { label: 'Phone and TV', value: 'ignore it', backing: { traces: ['fact-keep', 'pattern'] } },
            { label: 'Kept by', value: 'the device whose address is the destination', backing: { traces: ['fact-keep'] } },
          ],
          events: step2,
          backing: { traces: ['pattern', 'fact-keep', 'lead-1'] },
        },
        {
          id: 'two-halves',
          title: 'Two halves',
          sub: 'Reading an address',
          narrative:
            'Look at the laptop’s address, 00:00:5E:00:53:10. It’s 48 bits, written as six pairs of hex digits. The first half, 00:00:5E, is an **OUI**: a number the **IEEE Registration Authority** gives an organization, on a real card usually its maker. The second half, 00:53:10, is the number that organization gave this one card. Together they make an address meant to be unique. These addresses are made up: 00:00:5E is IANA’s, which sets some aside for examples.',
          deep: [
            {
              text: 'Some organizations get a smaller block of addresses, with a longer first part and a shorter second one.',
              cite: [rfc('rfc-9542', '2.1'), FAQ_SINGLE],
            },
          ],
          facts: [
            { label: 'First half', value: '00:00:5E, the OUI', backing: { traces: ['term-oui', 'fact-halves', 'fact-example'] } },
            { label: 'Second half', value: '00:53:10, this card’s number', backing: { traces: ['fact-halves'] } },
            { label: 'Length', value: '48 bits, six pairs', backing: { traces: ['fact-size'] } },
          ],
          events: step3,
          backing: { traces: ['fact-size', 'term-oui', 'term-ra', 'fact-halves', 'why-2', 'fact-example'] },
        },
        {
          id: 'to-everyone',
          title: 'To everyone',
          sub: 'ff:ff:ff:ff:ff:ff',
          narrative:
            'Sometimes a device has something for everyone on the network. It sends one frame to the **broadcast address**, ff:ff:ff:ff:ff:ff, which means everyone. Here your router does. Every device hears it, and this time every device keeps it and reads it. What each one does next depends on what’s inside: a device can read it and find nothing for it.',
          deep: [
            {
              text: 'Another bit marks a group address; a device keeps a group frame only for groups it has joined.',
              cite: [rfc('rfc-9542', '2.1.1'), EUI_BITS, MS_FILTER],
            },
          ],
          facts: [
            { label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff', backing: { traces: ['term-broadcast', 'fact-broadcast'] } },
            { label: 'Kept by', value: 'every device', backing: { traces: ['fact-broadcast'] } },
            { label: 'Then', value: 'each reads what’s inside', backing: { traces: ['fact-broadcast'] } },
          ],
          events: step4,
          backing: { traces: ['term-broadcast', 'fact-broadcast', 'fact-hear', 'fact-keep'] },
        },
        {
          id: 'new-frame',
          title: 'A new frame from the router',
          sub: 'MAC addresses stay home',
          narrative:
            'example.net’s reply reaches your router. The router puts it in a new frame for your laptop: to 00:00:5E:00:53:10, from the router’s own 00:00:5E:00:53:01. example.net’s MAC address isn’t on it: each network a packet crosses puts it in a new frame, with that network’s MAC addresses. The phone and the TV hear this frame too, and ignore it. The laptop keeps it.',
          deep: [
            {
              text: 'At each hop, a router finds the link-layer address of the next hop and puts the packet in a new frame for that link.',
              cite: [rfc('rfc-1812', '5.2.1.2', true), ETHERNET_FRAME],
            },
          ],
          facts: [
            { label: 'From', value: `${MAC.router}, the router`, backing: { traces: ['term-mac', 'fact-frame'] } },
            { label: 'To', value: `${MAC.laptop}, the laptop`, backing: { traces: ['term-mac', 'fact-frame'] } },
            { label: 'example.net’s MAC address', value: 'not on it', backing: { traces: ['fact-local'] } },
          ],
          events: step5,
          backing: { traces: ['fact-local', 'fact-frame', 'fact-keep', 'fact-hear'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'On your home network, every frame names the MAC address it’s for. Every device in range hears it. The device with that address keeps it, every device keeps it when it’s sent to the broadcast address, and the rest ignore it.',
            cite: [rfc('rfc-9542', '3'), rfc('rfc-9724', '2.1'), MS_FILTER, BPF, ETHERNET_BROADCAST],
          },
          {
            id: 'lead-2',
            text: 'Like post dropped in a shared hallway: everyone sees each envelope, only the person named on it takes it in, and a letter to all residents goes in with everyone.',
            analogy: true,
          },
        ],
        terms: [
          {
            id: 'term-mac',
            idea: 'The hardware number of a network card',
            name: 'MAC address',
            cite: [rfc('rfc-9724', '2.1'), CISCO_NAME, FAQ_MAC],
          },
          {
            id: 'term-frame',
            idea: 'What a packet travels in across your own network, with the MAC address it’s for and the one it’s from at the front',
            name: 'Frame',
            cite: [rfc('rfc-9542', '3'), ETHERNET_FRAME, PALO_HEADER],
          },
          {
            id: 'term-broadcast',
            idea: 'The address that means every device on the network: ff:ff:ff:ff:ff:ff',
            name: 'Broadcast address',
            cite: [ETHERNET_BROADCAST, EUI_ALL],
          },
          {
            id: 'term-oui',
            idea: 'The first half: the number the IEEE Registration Authority gives an organization, such as a card’s maker',
            name: 'OUI (organizationally unique identifier)',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9542', '2.1'), FAQ_OUI, EUI_OUI],
          },
          {
            id: 'term-ra',
            idea: 'Who hands out the first halves, in blocks',
            name: 'IEEE Registration Authority',
            cite: [rfc('rfc-9542', '1.2'), FAQ_BLOCKS],
          },
          {
            id: 'term-random',
            idea: 'An address a device makes up and uses instead of its card’s own, so it’s harder to track',
            name: 'Randomized MAC address',
            cite: [rfc('rfc-9724', '2.2'), MS_RANDOM, IFCONFIG],
          },
          {
            id: 'term-local',
            idea: 'An address set by the device or the network, not by a maker; one bit in the first byte says so',
            name: 'Locally administered address',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9542', '2.1.1'), EUI_BITS],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Hear the frame', 'Read the destination', 'Mine or everyone’s? Keep it', 'Not mine? Ignore it'],
          note: 'What every device on the Wi-Fi does with each frame it hears.',
          cite: [rfc('rfc-9724', '2.1'), MS_FILTER, BPF, ETHERNET_BROADCAST, EUI_ALL],
        },
        why: [
          {
            id: 'why-1',
            text: 'Many devices share one Wi-Fi and hear every frame, so each frame has to say which device it’s for.',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), rfc('rfc-9542', '3'), PALO_L2, CISCO_LAYERS],
          },
          {
            id: 'why-2',
            text: 'The IEEE gives each organization its own first half, and the organization numbers each card once, so no two cards should end up with the same address.',
            cite: [rfc('rfc-9724', '2.1'), FAQ_OUI, EUI_BITS],
          },
        ],
        deep: [
          {
            id: 'deep-random',
            text: 'Many phones and laptops now use a randomized address on each Wi-Fi network, so they’re harder to track. It has the local bit set, the second-lowest bit of the first byte.',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), rfc('rfc-9724', '7'), rfc('rfc-9542', '2.1.1'), MS_RANDOM],
          },
          {
            id: 'deep-blocks',
            text: 'Some organizations get a smaller block of addresses, with a longer first part and a shorter second one.',
            cite: [rfc('rfc-9542', '2.1'), FAQ_SINGLE],
          },
          {
            id: 'deep-spoof',
            text: 'A MAC address can be changed with a setting, so it isn’t proof of which device sent a frame.',
            cite: [rfc('rfc-9542', '6'), IFCONFIG],
          },
        ],
        facts: [
          { id: 'fact-defined', label: 'Defined in', value: 'IEEE Std 802 (now IEEE 802-2024), which sets out how MAC addresses are built', cite: [IEEE_802, rfc('rfc-9542', '2'), FAQ_STD] },
          { id: 'fact-osi', label: 'OSI layer', value: '2, data link', cite: [CISCO_L2, PALO_L2] },
          { id: 'fact-name', label: 'Stands for', value: 'Media Access Control', cite: [rfc('rfc-9542', '1.1'), CISCO_NAME] },
          {
            id: 'fact-size',
            label: 'Size',
            value: '48 bits, written as six pairs of hex digits, such as 00:00:5E:00:53:10, with colons or hyphens between them',
            cite: [rfc('rfc-9542', '1.1'), rfc('rfc-9542', '2.1'), EUI_HEX, IFCONFIG, FAQ_COLON],
          },
          {
            id: 'fact-halves',
            label: 'Two halves',
            value:
              'the first three pairs: the organization’s number (OUI) from the IEEE Registration Authority, on a card usually its maker’s; the last three: that organization’s number for the card',
            cite: [rfc('rfc-9724', '2.1'), FAQ_OUI, EUI_OUI, EUI_BITS, CISCO_BURNED],
          },
          {
            id: 'fact-frame',
            label: 'On your network',
            value: 'each packet travels in a frame, such as a Wi-Fi or Ethernet frame, that names the MAC address it’s for and the one it’s from',
            cite: [rfc('rfc-9542', '3'), ETHERNET_FRAME, rfc('rfc-9724', '2.2'), PALO_HEADER],
          },
          {
            id: 'fact-hear',
            label: 'On Wi-Fi',
            value: 'every device in range hears each frame, and can read its MAC addresses',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), MS_FILTER],
          },
          {
            id: 'fact-keep',
            label: 'Kept by',
            value: 'the device whose MAC address is the frame’s destination; the others ignore it',
            cite: [MS_FILTER, BPF, rfc('rfc-919', '3')],
          },
          {
            id: 'fact-broadcast',
            label: 'Sent to everyone',
            value: 'ff:ff:ff:ff:ff:ff, the broadcast address: every device on the network keeps it and reads it, and acts on it only if what’s inside is for it',
            cite: [ETHERNET_BROADCAST, EUI_ALL, rfc('rfc-919', '1')],
          },
          {
            id: 'fact-local',
            label: 'Reaches',
            value:
              'only your own network: a packet for anywhere farther goes to your router in a frame for the router’s MAC address, and the router sends it on in a new frame',
            cite: [host('3.3.1', 47), rfc('rfc-1812', '5.2.1.2', true), CISCO_REMOTE, CISCO_HOP, PALO_REMOVES],
          },
          {
            id: 'fact-random',
            label: 'Not always the card’s own',
            value: 'a device can use another address instead, often a randomized one for each Wi-Fi network',
            cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), rfc('rfc-9724', '7'), MS_RANDOM, IFCONFIG],
          },
          {
            id: 'fact-example',
            label: 'This lesson’s addresses',
            value: 'made up: 00:00:5E:00:53:00 to 00:00:5E:00:53:FF are set aside for examples, under IANA’s OUI, 00:00:5E',
            cite: [rfc('rfc-9542', '1.3', true), rfc('rfc-9542', '2.1.4', true)],
          },
        ],
      },
      practice: [
        {
          id: 'one-device',
          prompt: 'Your router sends a frame to 00:00:5E:00:53:11, your phone’s MAC address. Your TV is on the same Wi-Fi. What does the TV do?',
          options: [
            {
              text: 'Hears it, and ignores it.',
              feedback: 'Right. Every device in range hears the frame, but it’s addressed to the phone, so the TV ignores it.',
              cite: [rfc('rfc-9724', '2.1'), MS_FILTER, BPF],
            },
            {
              text: 'Keeps it and reads it.',
              feedback: 'Not quite. A device keeps a frame sent to its own MAC address or to the broadcast address. This one is the phone’s.',
              cite: [MS_FILTER, BPF, ETHERNET_BROADCAST],
            },
            {
              text: 'Never hears it: the frame goes only to the phone.',
              feedback: 'Not quite. Wi-Fi is radio, so every device in range hears the frame. The TV just doesn’t keep it.',
              cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), MS_FILTER],
            },
          ],
          answer: 0,
        },
        {
          id: 'everyone',
          prompt: 'Your router sends a frame to ff:ff:ff:ff:ff:ff. Which devices keep it?',
          options: [
            {
              text: 'Every device on the network.',
              feedback: 'Right. ff:ff:ff:ff:ff:ff is the broadcast address: it means everyone.',
              cite: [ETHERNET_BROADCAST, EUI_ALL],
            },
            {
              text: 'Only the device that answers it.',
              feedback: 'Not quite. Every device keeps a broadcast and reads it. Whether any of them answers depends on what’s inside.',
              cite: [ETHERNET_BROADCAST, EUI_ALL, rfc('rfc-919', '1')],
            },
            {
              text: 'None: no device has that address.',
              feedback: 'Not quite. No device has it as its own, but it means everyone, so every device keeps it.',
              cite: [EUI_ALL, ETHERNET_BROADCAST, MS_FILTER],
            },
          ],
          answer: 0,
        },
        {
          id: 'first-half',
          prompt: 'Your laptop’s MAC address is 00:00:5E:00:53:10. What does its first half, 00:00:5E, tell you?',
          options: [
            {
              text: 'Which organization the IEEE Registration Authority gave that block of addresses to.',
              feedback: 'Right. It’s an OUI. On a real card it’s usually the maker’s; this one is IANA’s, set aside for examples.',
              cite: [rfc('rfc-9724', '2.1'), FAQ_OUI, rfc('rfc-9542', '1.3', true)],
            },
            {
              text: 'Which Wi-Fi network the laptop is on.',
              feedback: 'Not quite. The first half is an organization’s number from the IEEE.',
              cite: [rfc('rfc-9724', '2.1'), FAQ_OUI],
            },
            {
              text: 'Nothing: the whole address is random.',
              feedback: 'Not quite. A card’s own address has two halves, the organization’s and the card’s. A device can use a randomized one instead, but this is the card’s own.',
              cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), MS_RANDOM],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
