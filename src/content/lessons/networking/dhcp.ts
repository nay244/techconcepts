import { defineLesson } from '../../define';
import { dhcpLayer, ethernetLayer, ipv4Layer, packet, udpLayer } from '../../helpers/packets';
import type { Field, Layer, MessageEvent, MessageKind, Packet, SceneEvent } from '../../schema';

/**
 * DHCP, lesson 9 of 19. A laptop joins a home Wi-Fi network and gets its
 * settings in four messages (RFC 2131), keeps them for a lease and renews at
 * half-time (section 4.4.5); the Try it connects a phone, then shows what
 * happens when the pool has no address left (RFC 3927).
 *
 * Values that would differ in a real capture (transaction IDs, identification
 * numbers, checksums) are examples, and each frame has its own.
 */

// ------------------------------------------------------------------ constants

const ROUTER_MAC = '00:00:5E:00:53:01';
const LAPTOP_MAC = '00:00:5E:00:53:10';
const PHONE_MAC = '00:00:5E:00:53:11';
const EVERYONE_MAC = 'ff:ff:ff:ff:ff:ff';

const NO_ADDRESS = '0.0.0.0';
const EVERYONE = '255.255.255.255';
const ROUTER_IP = '192.168.1.1';
const LAPTOP_IP = '192.168.1.100';
const PHONE_IP = '192.168.1.101';

/** The lease in the example: 24 hours. The client renews at half of it (T1, RFC 2131 section 4.4.5). */
const LEASE_SECONDS = 86400;
const RENEW_SECONDS = LEASE_SECONDS / 2;

// -------------------------------------------------------------------- options

const subnetMask: Field = {
  name: 'Subnet mask (option 1)',
  value: '255.255.255.0',
  explain: 'Says how much of an address names the network: 255.255.255.0 means the first three numbers do.',
};
const routerOption: Field = {
  name: 'Router (option 3)',
  value: ROUTER_IP,
  explain: 'The default gateway: where the client sends anything meant for another network.',
};
const dnsOption: Field = {
  name: 'DNS server (option 6)',
  value: ROUTER_IP,
  explain: 'The server the client asks to turn names into addresses; at home it is often the router itself.',
};
const leaseTime: Field = {
  name: 'IP address lease time (option 51)',
  value: `${LEASE_SECONDS} seconds (24 hours)`,
  explain: 'How long the client may keep the address before it has to renew it.',
};
const serverIdentifier: Field = {
  name: 'Server identifier (option 54)',
  value: ROUTER_IP,
  explain: 'The address of the DHCP server this message is about, so a client can tell servers apart if several answer.',
};
const requestedAddress = (address: string): Field => ({
  name: 'Requested IP address (option 50)',
  value: address,
  explain: 'The address the client is asking for: the one it was just offered.',
});

/** What a server sends in an Offer and in an Acknowledge. */
const settings: Field[] = [subnetMask, routerOption, dnsOption, leaseTime, serverIdentifier];

// -------------------------------------------------------------------- packets

interface FrameSpec {
  name: string;
  summary: string;
  seenAt: string;
  srcMac: string;
  dstMac: string;
  srcIp: string;
  dstIp: string;
  /** Clients send from UDP 68 to 67; servers send from 67 to 68. */
  fromClient: boolean;
  /** A different number in every frame, as in a real capture. */
  identification: string;
  dhcp: Parameters<typeof dhcpLayer>[0];
  /** Seconds the client has been trying; `dhcpLayer` writes 0, which is right for a first attempt. */
  secs?: number;
}

/** The same layer with a different "seconds elapsed" value, for a message the client sends again. */
function withSeconds(layer: Layer, secs: number): Layer {
  const name = 'Seconds elapsed (secs)';
  if (!layer.fields.some((field) => field.name === name)) throw new Error(`The DHCP layer has no "${name}" field to change.`);
  return { ...layer, fields: layer.fields.map((field) => (field.name === name ? { ...field, value: String(secs) } : field)) };
}

/** Every message is a 342-byte frame: Ethernet 14 + IPv4 20 + UDP 8 + the 300-byte DHCP message. */
function frame(o: FrameSpec): Packet {
  const dhcp = dhcpLayer(o.dhcp);
  return packet({
    name: o.name,
    summary: o.summary,
    seenAt: o.seenAt,
    layers: [
      ethernetLayer({ src: o.srcMac, dst: o.dstMac, type: 'IPv4' }),
      ipv4Layer({ src: o.srcIp, dst: o.dstIp, protocol: 'UDP', ttl: 64, totalLength: 328, identification: o.identification }),
      udpLayer({ srcPort: o.fromClient ? 68 : 67, dstPort: o.fromClient ? 67 : 68, length: 308 }),
      o.secs === undefined ? dhcp : withSeconds(dhcp, o.secs),
    ],
  });
}

// One transaction ID per exchange: the laptop's first exchange, its renewal, and each of the phone's.
const XID_LAPTOP = '0x3903F326';
const XID_RENEW = '0x7B2C91A4';
const XID_PHONE = '0x5E81D0C7';
const XID_PHONE_POOL_FULL = '0xA2D4096E';

const packets: Record<string, Packet> = {
  // ---- the laptop joins the network
  discover: frame({
    name: 'DHCP Discover',
    summary: "The laptop's first message on the network: a broadcast asking any DHCP server for an address.",
    seenAt: 'Captured on the Wi-Fi as the laptop joins the network.',
    srcMac: LAPTOP_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: NO_ADDRESS,
    dstIp: EVERYONE,
    fromClient: true,
    identification: '0x5a1c',
    dhcp: { messageType: 'DISCOVER', xid: XID_LAPTOP, clientMac: LAPTOP_MAC, broadcastFlag: true, options: [] },
  }),
  offer: frame({
    name: 'DHCP Offer',
    summary: 'The router offers the laptop an address and the settings that go with it.',
    seenAt: 'Captured on the Wi-Fi 4 milliseconds after the Discover, on its way from the router.',
    srcMac: ROUTER_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: ROUTER_IP,
    dstIp: EVERYONE,
    fromClient: false,
    identification: '0x2f08',
    dhcp: { messageType: 'OFFER', xid: XID_LAPTOP, clientMac: LAPTOP_MAC, yiaddr: LAPTOP_IP, broadcastFlag: true, options: settings },
  }),
  request: frame({
    name: 'DHCP Request',
    summary: 'The laptop accepts the offer and names the server and the address it chose.',
    seenAt: 'Captured on the Wi-Fi as the laptop accepts the offer.',
    srcMac: LAPTOP_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: NO_ADDRESS,
    dstIp: EVERYONE,
    fromClient: true,
    identification: '0x5a1d',
    dhcp: {
      messageType: 'REQUEST',
      xid: XID_LAPTOP,
      clientMac: LAPTOP_MAC,
      broadcastFlag: true,
      options: [requestedAddress(LAPTOP_IP), serverIdentifier],
    },
  }),
  ack: frame({
    name: 'DHCP Acknowledge',
    summary: "The router confirms the lease: the address is the laptop's to use.",
    seenAt: 'Captured on the Wi-Fi as the router confirms the lease.',
    srcMac: ROUTER_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: ROUTER_IP,
    dstIp: EVERYONE,
    fromClient: false,
    identification: '0x2f09',
    dhcp: { messageType: 'ACK', xid: XID_LAPTOP, clientMac: LAPTOP_MAC, yiaddr: LAPTOP_IP, broadcastFlag: true, options: settings },
  }),

  // ---- half the lease later: the laptop renews, straight to the server
  'renew-request': frame({
    name: 'DHCP Request (renew)',
    summary: 'The laptop asks the server that gave it the address to let it keep the address.',
    seenAt: 'Captured on the Wi-Fi 12 hours into the lease, as the laptop renews.',
    srcMac: LAPTOP_MAC,
    dstMac: ROUTER_MAC,
    srcIp: LAPTOP_IP,
    dstIp: ROUTER_IP,
    fromClient: true,
    identification: '0x8b50',
    // A renewing client already owns its address, so it states it in ciaddr and leaves options 50 and 54 out (RFC 2131 section 4.3.2).
    dhcp: { messageType: 'REQUEST', xid: XID_RENEW, clientMac: LAPTOP_MAC, ciaddr: LAPTOP_IP, broadcastFlag: false, options: [] },
  }),
  'renew-ack': frame({
    name: 'DHCP Acknowledge (renew)',
    summary: 'The router agrees and starts a fresh lease.',
    seenAt: 'Captured on the Wi-Fi as the router extends the lease.',
    srcMac: ROUTER_MAC,
    dstMac: LAPTOP_MAC,
    srcIp: ROUTER_IP,
    dstIp: LAPTOP_IP,
    fromClient: false,
    identification: '0x3a47',
    dhcp: {
      messageType: 'ACK',
      xid: XID_RENEW,
      clientMac: LAPTOP_MAC,
      ciaddr: LAPTOP_IP,
      yiaddr: LAPTOP_IP,
      broadcastFlag: false,
      options: settings,
    },
  }),

  // ---- Try it, "Connect the phone"
  'normal-discover': frame({
    name: 'DHCP Discover (phone)',
    summary: "The phone's broadcast asking any DHCP server for an address.",
    seenAt: 'Captured on the Wi-Fi as the phone joins the network.',
    srcMac: PHONE_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: NO_ADDRESS,
    dstIp: EVERYONE,
    fromClient: true,
    identification: '0x6c40',
    dhcp: { messageType: 'DISCOVER', xid: XID_PHONE, clientMac: PHONE_MAC, broadcastFlag: true, options: [] },
  }),
  'normal-offer': frame({
    name: 'DHCP Offer (phone)',
    summary: 'The router offers the phone the next free address and the same settings.',
    seenAt: "Captured on the Wi-Fi 4 milliseconds after the phone's Discover.",
    srcMac: ROUTER_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: ROUTER_IP,
    dstIp: EVERYONE,
    fromClient: false,
    identification: '0x2f9a',
    dhcp: { messageType: 'OFFER', xid: XID_PHONE, clientMac: PHONE_MAC, yiaddr: PHONE_IP, broadcastFlag: true, options: settings },
  }),
  'normal-request': frame({
    name: 'DHCP Request (phone)',
    summary: 'The phone accepts the offer and names the server and the address it chose.',
    seenAt: 'Captured on the Wi-Fi as the phone accepts the offer.',
    srcMac: PHONE_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: NO_ADDRESS,
    dstIp: EVERYONE,
    fromClient: true,
    identification: '0x6c41',
    dhcp: {
      messageType: 'REQUEST',
      xid: XID_PHONE,
      clientMac: PHONE_MAC,
      broadcastFlag: true,
      options: [requestedAddress(PHONE_IP), serverIdentifier],
    },
  }),
  'normal-ack': frame({
    name: 'DHCP Acknowledge (phone)',
    summary: "The router confirms the lease: the address is the phone's to use.",
    seenAt: "Captured on the Wi-Fi as the router confirms the phone's lease.",
    srcMac: ROUTER_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: ROUTER_IP,
    dstIp: EVERYONE,
    fromClient: false,
    identification: '0x2f9b',
    dhcp: { messageType: 'ACK', xid: XID_PHONE, clientMac: PHONE_MAC, yiaddr: PHONE_IP, broadcastFlag: true, options: settings },
  }),

  // ---- Try it, "Shrink the pool to one address": the phone asks, and no Offer ever comes
  'pool-full-discover': frame({
    name: 'DHCP Discover (phone)',
    summary: "The phone's broadcast asking any DHCP server for an address.",
    seenAt: 'Captured on the Wi-Fi as the phone joins the network; the router has no free address to offer.',
    srcMac: PHONE_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: NO_ADDRESS,
    dstIp: EVERYONE,
    fromClient: true,
    identification: '0x6d12',
    dhcp: { messageType: 'DISCOVER', xid: XID_PHONE_POOL_FULL, clientMac: PHONE_MAC, broadcastFlag: true, options: [] },
  }),
  'pool-full-discover-retry': frame({
    name: 'DHCP Discover (phone, second try)',
    summary: 'The same Discover sent again, because nothing answered the first one.',
    seenAt: 'Captured on the Wi-Fi 4 seconds after the first Discover; still no Offer.',
    srcMac: PHONE_MAC,
    dstMac: EVERYONE_MAC,
    srcIp: NO_ADDRESS,
    dstIp: EVERYONE,
    fromClient: true,
    identification: '0x6d13',
    // A resend keeps the transaction ID and reports how long the client has been trying.
    dhcp: { messageType: 'DISCOVER', xid: XID_PHONE_POOL_FULL, clientMac: PHONE_MAC, broadcastFlag: true, options: [] },
    secs: 4,
  }),
};

// --------------------------------------------------------------------- events

/** A DHCP message: protocol and size come from the lesson, the size from the frame it carries. */
function message(o: {
  id: string;
  from: string;
  to: string[];
  via?: string[];
  src: string;
  dst: string;
  kind: MessageKind;
  label: string;
  summary: string;
  time: number;
  packet: string;
}): MessageEvent {
  return { type: 'message', protocol: 'DHCP', size: packets[o.packet]!.size, ...o };
}

/**
 * Frames between two Wi-Fi clients pass through the router, which is also the
 * access point, so a broadcast from one client to the other goes via it.
 */
const THROUGH_ROUTER = ['router'];

const leaseRow = (ip: string, mac: string, device: string) => ({ ip, mac, device, expires: 'in 24 h' });

const discoverEvents: SceneEvent[] = [
  message({
    id: 'msg-discover',
    from: 'laptop',
    to: ['router', 'phone'],
    via: THROUGH_ROUTER,
    src: `${NO_ADDRESS}:68`,
    dst: `${EVERYONE}:67`,
    kind: 'broadcast',
    label: 'Discover',
    summary: 'The laptop has no address, so it calls out to everyone: is there a DHCP server here?',
    time: 0,
    packet: 'discover',
  }),
];

const offerEvents: SceneEvent[] = [
  message({
    id: 'msg-offer',
    from: 'router',
    to: ['laptop', 'phone'],
    src: `${ROUTER_IP}:67`,
    dst: `${EVERYONE}:68`,
    kind: 'response',
    label: 'Offer',
    summary: 'The router offers 192.168.1.100, with a subnet mask, a gateway, a DNS server and a 24-hour lease.',
    time: 0.004,
    packet: 'offer',
  }),
];

const requestEvents: SceneEvent[] = [
  message({
    id: 'msg-request',
    from: 'laptop',
    to: ['router', 'phone'],
    via: THROUGH_ROUTER,
    src: `${NO_ADDRESS}:68`,
    dst: `${EVERYONE}:67`,
    kind: 'broadcast',
    label: 'Request',
    summary: 'The laptop accepts the offer from 192.168.1.1 and asks to use 192.168.1.100.',
    time: 0.006,
    packet: 'request',
  }),
];

const ackEvents: SceneEvent[] = [
  message({
    id: 'msg-ack',
    from: 'router',
    to: ['laptop', 'phone'],
    src: `${ROUTER_IP}:67`,
    dst: `${EVERYONE}:68`,
    kind: 'response',
    label: 'Acknowledge',
    summary: "The router confirms the lease: 192.168.1.100 is the laptop's for 24 hours.",
    time: 0.009,
    packet: 'ack',
  }),
  {
    type: 'table',
    id: 'lease-add',
    table: 'leases',
    op: 'add',
    row: leaseRow(LAPTOP_IP, LAPTOP_MAC, 'Laptop'),
    summary: 'The router writes down that 192.168.1.100 belongs to the laptop for 24 hours.',
  },
];

const renewEvents: SceneEvent[] = [
  message({
    id: 'msg-renew-request',
    from: 'laptop',
    to: ['router'],
    src: `${LAPTOP_IP}:68`,
    dst: `${ROUTER_IP}:67`,
    kind: 'request',
    label: 'Request (renew)',
    summary: 'Half the lease has passed, so the laptop asks the router directly to let it keep 192.168.1.100.',
    time: RENEW_SECONDS,
    packet: 'renew-request',
  }),
  message({
    id: 'msg-renew-ack',
    from: 'router',
    to: ['laptop'],
    src: `${ROUTER_IP}:67`,
    dst: `${LAPTOP_IP}:68`,
    kind: 'response',
    label: 'Acknowledge (renew)',
    summary: 'The router agrees, and the 24 hours start over.',
    time: RENEW_SECONDS + 0.004,
    packet: 'renew-ack',
  }),
  {
    type: 'table',
    id: 'lease-renew',
    table: 'leases',
    op: 'update',
    key: LAPTOP_IP,
    row: { expires: 'in 24 h (renewed)' },
    summary: 'The router moves the expiry forward by a full lease.',
  },
];

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'dhcp',
  title: 'DHCP',
  subtitle: 'Getting an address automatically',
  level: 'beginner',
  osiLayers: [7],
  certTags: ['a-plus', 'network-plus', 'ccna', 'helpdesk'],
  summary:
    'Watch a laptop join a Wi-Fi network and get its IP address, subnet mask, gateway and DNS server from the router in four short messages.',
  references: [
    { label: 'RFC 2131: Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' },
    { label: 'RFC 2132: DHCP Options and BOOTP Vendor Extensions', url: 'https://www.rfc-editor.org/rfc/rfc2132' },
    { label: 'RFC 3927: Dynamic Configuration of IPv4 Link-Local Addresses', url: 'https://www.rfc-editor.org/rfc/rfc3927' },
  ],

  overview: {
    hook: "When you check in to a hotel, you don't invent a room number. You ask the front desk, the clerk hands you a key to a free room, and the hotel writes down that it's yours until checkout. Your phone and laptop do the same whenever they join a network, in a few milliseconds. That front desk is DHCP, and it's why you never type an IP address in at home.",
    name: 'DHCP',
    fullName: 'Dynamic Host Configuration Protocol',
    description:
      'DHCP gives a device everything it needs to talk on a network: an IP address, a subnet mask, a default gateway and a DNS server. A DHCP server, usually your router, lends these out for a set time, a lease, and keeps a table of who holds what. Watch a laptop join a home Wi-Fi network, then see what happens when addresses run out.',
    facts: [
      { label: 'Layer', value: 'Application (7)' },
      { label: 'Ports', value: 'UDP 67 (server), UDP 68 (client)' },
      { label: 'Hands out', value: 'IP address, subnet mask, default gateway, DNS server' },
      { label: 'Exchange', value: 'Discover, Offer, Request, Acknowledge' },
      { label: 'Lease', value: 'Renewed at half its length' },
      { label: 'Defined in', value: 'RFC 2131, RFC 2132' },
    ],
  },

  scene: {
    type: 'flow',
    views: ['network', 'sequence'],
    actors: [
      { id: 'laptop', kind: 'laptop', label: 'Laptop', addresses: [], x: 200, y: 400 },
      { id: 'router', kind: 'router', label: 'Router · DHCP server', addresses: [ROUTER_IP], x: 500, y: 200 },
      { id: 'phone', kind: 'phone', label: 'Phone', addresses: [PHONE_MAC], x: 800, y: 400 },
    ],
    links: [
      { id: 'laptop-router', from: 'laptop', to: 'router', medium: 'wireless' },
      { id: 'phone-router', from: 'phone', to: 'router', medium: 'wireless' },
    ],
    tables: [
      {
        id: 'leases',
        actor: 'router',
        title: 'DHCP lease table',
        columns: [
          { key: 'ip', label: 'IP' },
          { key: 'mac', label: 'MAC' },
          { key: 'device', label: 'Device' },
          { key: 'expires', label: 'Expires' },
        ],
        keyColumn: 'ip',
        initialRows: [],
      },
    ],
    packets,
    legend: [
      { kind: 'broadcast', label: 'Broadcast to everyone' },
      { kind: 'response', label: 'Reply from the DHCP server' },
      { kind: 'request', label: 'Request' },
    ],
  },

  steps: [
    {
      id: 'discover',
      title: 'Discover',
      subtitle: 'A device with no address calls out',
      narrative:
        "You've just joined the Wi-Fi, and your laptop has a problem: it has no IP address and doesn't know who to ask. So it does what you would in a hotel lobby with no desk in sight: it calls out to the whole room. That call is a Discover. It goes to 255.255.255.255, the broadcast address, so every device on the network receives it, and it's aimed at UDP port 67, where DHCP servers listen (lessons 10 and 11 cover ports and UDP). The laptop sends it from 0.0.0.0, which means \"I have no address yet\". The phone hears it too, but nothing on the phone listens on port 67, so it ignores it.",
      facts: [
        { label: 'From', value: '0.0.0.0, UDP port 68' },
        { label: 'To', value: '255.255.255.255, UDP port 67' },
        { label: 'Ethernet destination', value: 'ff:ff:ff:ff:ff:ff (everyone)' },
        { label: 'Laptop MAC', value: LAPTOP_MAC },
      ],
      events: discoverEvents,
    },
    {
      id: 'offer',
      title: 'Offer',
      subtitle: 'The server proposes an address and settings',
      narrative:
        "A hotel clerk hears a guest ask for a room and slides a key across the desk. The router, which runs a DHCP server, does the same: it hears the Discover, picks a free address from its pool (the addresses it can give out), 192.168.1.100, and answers with an Offer. The Offer carries the whole kit: a subnet mask, a default gateway, a DNS server (it turns names into addresses; more in lesson 13) and the lease length, here 24 hours. The laptop has no address yet, so the Offer is broadcast too, though a client that can take a direct reply gets it directly. The phone ignores it: the Offer names the laptop's MAC address.",
      facts: [
        { label: 'Address offered', value: LAPTOP_IP },
        { label: 'Subnet mask', value: '255.255.255.0' },
        { label: 'Gateway and DNS server', value: '192.168.1.1 (the router, for both)' },
        { label: 'Lease', value: `${LEASE_SECONDS} seconds (24 hours)` },
      ],
      events: offerEvents,
    },
    {
      id: 'request',
      title: 'Request',
      subtitle: 'The device says which offer it takes',
      narrative:
        "The laptop accepts with a Request: \"I'll take 192.168.1.100, from the server at 192.168.1.1.\" You might expect this to go straight to the router, but it's another broadcast from 0.0.0.0, on purpose. If a second DHCP server had also sent an Offer, this broadcast tells it, \"you weren't chosen, so free up the address you offered.\" The server identifier inside the message says whose offer won. Until the server confirms, the address isn't the laptop's to use, so it still sends from 0.0.0.0.",
      facts: [
        { label: 'Address requested', value: LAPTOP_IP },
        { label: 'Server chosen', value: `${ROUTER_IP} (server identifier)` },
        { label: 'Sent from', value: '0.0.0.0, still no address' },
      ],
      events: requestEvents,
    },
    {
      id: 'acknowledge',
      title: 'Acknowledge',
      subtitle: 'The server confirms and writes it down',
      narrative:
        "The server confirms with an Acknowledge, or ACK: the address is yours for 24 hours. It also writes a row in its lease table, the register of which IP address belongs to which MAC address until the lease runs out. That register is how the router never gives one address to two devices, and it usually sits behind a router's \"connected devices\" page. The laptop then applies the ACK's address, mask, gateway and DNS server and can talk normally. Discover, Offer, Request, Acknowledge: you'll hear this called DORA.",
      facts: [
        { label: 'Address', value: LAPTOP_IP },
        { label: 'Lease', value: '24 hours' },
        { label: 'Lease table row', value: `${LAPTOP_IP} · ${LAPTOP_MAC} · Laptop` },
      ],
      events: ackEvents,
    },
    {
      id: 'renew',
      title: 'Renew',
      subtitle: 'Halfway through the lease, ask to keep it',
      narrative:
        "An address is a loan, like a hotel stay, so it has to be renewed. Halfway through the lease, at 12 hours (43,200 seconds), the laptop sends a Request straight to the server that gave it the address. No broadcast this time: it has an address to send from and knows the server. It puts that address in a field called ciaddr, and the server's ACK starts a fresh 24 hours. If the server stays silent, at 87.5% of the lease the laptop broadcasts its Request to any server, and if the lease runs out it drops the address and starts again with a Discover. On Windows, ipconfig /renew asks for this on demand.",
      facts: [
        { label: 'Renews at', value: `${RENEW_SECONDS} seconds (half of ${LEASE_SECONDS})` },
        { label: 'Sent to', value: '192.168.1.1, UDP port 67, directly' },
        { label: 'Client IP (ciaddr)', value: LAPTOP_IP },
        { label: 'New expiry', value: 'in 24 h (renewed)' },
      ],
      events: renewEvents,
    },
  ],

  tryIt: {
    mode: 'choices',
    prompt: 'A phone joins the same Wi-Fi. Pick a scenario, then watch the messages and the lease table.',
    choices: [
      {
        id: 'normal',
        label: 'Connect the phone',
        events: [
          message({
            id: 'normal-discover',
            from: 'phone',
            to: ['router', 'laptop'],
            via: THROUGH_ROUTER,
            src: `${NO_ADDRESS}:68`,
            dst: `${EVERYONE}:67`,
            kind: 'broadcast',
            label: 'Discover',
            summary: 'The phone calls out for a DHCP server, just as the laptop did.',
            time: 60,
            packet: 'normal-discover',
          }),
          message({
            id: 'normal-offer',
            from: 'router',
            to: ['phone', 'laptop'],
            src: `${ROUTER_IP}:67`,
            dst: `${EVERYONE}:68`,
            kind: 'response',
            label: 'Offer',
            summary: 'The router offers the next free address, 192.168.1.101.',
            time: 60.004,
            packet: 'normal-offer',
          }),
          message({
            id: 'normal-request',
            from: 'phone',
            to: ['router', 'laptop'],
            via: THROUGH_ROUTER,
            src: `${NO_ADDRESS}:68`,
            dst: `${EVERYONE}:67`,
            kind: 'broadcast',
            label: 'Request',
            summary: 'The phone accepts 192.168.1.101 from the server at 192.168.1.1.',
            time: 60.006,
            packet: 'normal-request',
          }),
          message({
            id: 'normal-ack',
            from: 'router',
            to: ['phone', 'laptop'],
            src: `${ROUTER_IP}:67`,
            dst: `${EVERYONE}:68`,
            kind: 'response',
            label: 'Acknowledge',
            summary: "The router confirms the lease: 192.168.1.101 is the phone's for 24 hours.",
            time: 60.009,
            packet: 'normal-ack',
          }),
          {
            type: 'table',
            id: 'normal-lease-add',
            table: 'leases',
            op: 'add',
            row: leaseRow(PHONE_IP, PHONE_MAC, 'Phone'),
            summary: 'The router writes down that 192.168.1.101 belongs to the phone for 24 hours.',
          },
        ],
        explanation:
          "The phone runs the same four steps with its own transaction ID, and the router offers the next free address, 192.168.1.101. The laptop hears every broadcast and ignores it, because each message names the phone's MAC address. The lease table now holds two rows, and while both leases last, neither address goes to anyone else.",
      },
      {
        id: 'pool-full',
        label: 'Shrink the pool to one address, then connect the phone',
        events: [
          message({
            id: 'pool-full-discover',
            from: 'phone',
            to: ['router', 'laptop'],
            via: THROUGH_ROUTER,
            src: `${NO_ADDRESS}:68`,
            dst: `${EVERYONE}:67`,
            kind: 'broadcast',
            label: 'Discover',
            summary: 'The phone calls out for a DHCP server. The router has no free address, so it stays silent.',
            time: 60,
            packet: 'pool-full-discover',
          }),
          message({
            id: 'pool-full-discover-retry',
            from: 'phone',
            to: ['router', 'laptop'],
            via: THROUGH_ROUTER,
            src: `${NO_ADDRESS}:68`,
            dst: `${EVERYONE}:67`,
            kind: 'broadcast',
            label: 'Discover (retry)',
            summary: 'Nothing answered after about 4 seconds, so the phone asks again.',
            time: 64,
            packet: 'pool-full-discover-retry',
          }),
        ],
        explanation:
          "With a pool of one, the laptop's lease already uses the only address, so the router has nothing to offer the phone and stays silent. The phone asks again after about 4 seconds, then waits longer between tries. When it gives up, it can give itself an address starting 169.254 (APIPA, or link-local, RFC 3927). That address works only with other devices that also gave themselves one, so the phone can't reach the router, the laptop or the internet. A helpdesk tech who sees a 169.254 address should check the DHCP server: is it running, can the device reach it, and has its pool run out?",
      },
    ],
  },

  check: [
    {
      id: 'server-port',
      prompt: 'Which port does a DHCP server listen on?',
      options: ['UDP 68', 'UDP 67', 'TCP 67', 'TCP 53'],
      answer: 1,
      explanation:
        "Servers listen on UDP 67 and clients send from UDP 68. DHCP uses UDP because a broadcast needs no connection first, and the client has no address to open one from. Port 53 belongs to DNS (lesson 13).",
    },
    {
      id: 'why-broadcast',
      prompt: 'Why does the Discover go to 255.255.255.255?',
      options: [
        'Broadcasts arrive faster than messages to one device',
        'It is the address of the DHCP server',
        "The laptop doesn't know where the server is, so it asks everyone",
      ],
      answer: 2,
      explanation:
        "255.255.255.255 means every device on this network. The laptop has no address and doesn't know a server's, so calling out to everyone is its only option. Routers don't forward it, so the call stays local.",
    },
    {
      id: 'link-local',
      prompt: 'A user tells your helpdesk their laptop has the address 169.254.20.5. What does that most likely mean?',
      options: [
        'It received a lease from the DHCP server',
        'It got no answer from a DHCP server and gave itself an address',
        'It is connected straight to the internet',
      ],
      answer: 1,
      explanation:
        "Addresses starting 169.254 are self-assigned (link-local). The laptop asked for a lease, got no Offer, and picked one itself. Check the Wi-Fi or cable, then whether the DHCP server is running and has addresses left.",
    },
  ],

  recap: {
    takeaways: [
      'DHCP gives a new device its IP address, subnet mask, default gateway and DNS server automatically.',
      'Discover, Offer, Request, Acknowledge: clients use UDP port 68 and servers UDP port 67, and the first messages are broadcasts because the client has no address yet.',
      'An address is a lease, renewed halfway through. An address starting 169.254 means the device got no answer from a DHCP server.',
    ],
  },
});
