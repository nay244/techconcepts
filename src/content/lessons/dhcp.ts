import { formatBytes, formatTime } from '../../lib/format';
import { dhcpLayer, ethernetLayer, ipv4Layer, packet, udpLayer } from '../helpers/packets';
import { defineLegacyLesson } from '../legacy';
import type { Field, MessageEvent, MessageKind, Packet, TableEvent } from '../schema';

/**
 * DHCP, lesson 9 of 19. A laptop joins a home Wi-Fi network and gets its
 * settings from the router in four messages (RFC 2131), keeps them for a lease
 * and renews at half-time (section 4.4.5). The phone on the same Wi-Fi hears
 * the broadcasts and ignores them.
 *
 * The words are the approved mockup's (lesson-v3.html). The frames are the
 * live lesson's: values that would differ in a real capture (transaction IDs,
 * identification numbers, checksums) are examples, and each frame has its own.
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
}

/** Every message is a 342-byte frame: Ethernet 14 + IPv4 20 + UDP 8 + the 300-byte DHCP message. */
function frame(o: FrameSpec): Packet {
  return packet({
    name: o.name,
    summary: o.summary,
    seenAt: o.seenAt,
    layers: [
      ethernetLayer({ src: o.srcMac, dst: o.dstMac, type: 'IPv4' }),
      ipv4Layer({ src: o.srcIp, dst: o.dstIp, protocol: 'UDP', ttl: 64, totalLength: 328, identification: o.identification }),
      udpLayer({ srcPort: o.fromClient ? 68 : 67, dstPort: o.fromClient ? 67 : 68, length: 308 }),
      dhcpLayer(o.dhcp),
    ],
  });
}

// One transaction ID per exchange: the laptop's first exchange, then its renewal.
const XID_LAPTOP = '0x3903F326';
const XID_RENEW = '0x7B2C91A4';

const packets = {
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
    seenAt: 'Captured on the Wi-Fi 3 milliseconds after the Discover, on its way from the router.',
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
} satisfies Record<string, Packet>;

// --------------------------------------------------------------------- events

/** A DHCP message. Its log row's size is its frame's, so the two always agree. */
function message(o: {
  id: string;
  from: 'laptop' | 'router';
  to: 'laptop' | 'router';
  tag: string;
  kind: MessageKind;
  time: string;
  src: string;
  dst: string;
  info: string;
  plain: string;
  packet: keyof typeof packets;
}): MessageEvent {
  const { id, from, to, tag, kind, time, src, dst, info, plain, packet } = o;
  return {
    type: 'message',
    id,
    from,
    to,
    tag,
    kind,
    packet,
    log: { time, source: src, destination: dst, protocol: 'DHCP', info, size: formatBytes(packets[packet].size) },
    plain,
  };
}

const leaseAdded: TableEvent = {
  type: 'table',
  id: 'lease-add',
  table: 'leases',
  op: 'add',
  row: { ip: LAPTOP_IP, mac: LAPTOP_MAC, device: 'Laptop', expires: 'in 24 h' },
  summary: 'The router writes down that 192.168.1.100 belongs to the laptop for 24 hours.',
};

const leaseRenewed: TableEvent = {
  type: 'table',
  id: 'lease-renew',
  table: 'leases',
  op: 'update',
  key: LAPTOP_IP,
  row: { expires: 'in 24 h (renewed)' },
  summary: 'The router moves the expiry forward by a full lease.',
};

// ------------------------------------------------------------------- lesson

export default defineLegacyLesson({
  slug: 'dhcp',
  title: 'DHCP',
  subtitle: 'Getting an address automatically',
  level: 'beginner',
  certTags: ['a-plus', 'network-plus', 'ccna', 'helpdesk'],
  summary:
    'Watch a laptop join a Wi-Fi network and get an address, plus the other settings it needs to go online, from the router in four short messages.',
  figure: 'dhcp',
  units: [
    {
      id: 'dhcp',
      name: 'DHCP',
      fullName: 'Dynamic Host Configuration Protocol',
      purpose: 'How a device gets its address',
      osiLayers: [7],
      references: [
        { label: 'RFC 2131: Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' },
        { label: 'RFC 2132: DHCP Options and BOOTP Vendor Extensions', url: 'https://www.rfc-editor.org/rfc/rfc2132' },
      ],
      scene: {
        title: 'Home Wi-Fi network',
        views: ['network', 'sequence'],
        panel: {
          type: 'table',
          table: {
            id: 'leases',
            title: 'DHCP lease table',
            by: 'kept by the router',
            columns: [
              { key: 'ip', label: 'IP address' },
              { key: 'mac', label: 'MAC address' },
              { key: 'device', label: 'Device', prose: true },
              { key: 'expires', label: 'Expires', prose: true },
            ],
            keyColumn: 'ip',
            initialRows: [],
            empty: 'Empty. No device has an address yet.',
          },
        },
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
            { kind: 'broadcast', label: 'Broadcast to everyone' },
            { kind: 'response', label: 'Reply from the DHCP server' },
            { kind: 'request', label: 'Request to one device' },
          ],
        },
        parties: [
          { place: 'laptop', label: 'Laptop', addr: LAPTOP_MAC },
          { place: 'router', label: 'Router', addr: ROUTER_IP },
          { place: 'phone', label: 'Phone', addr: PHONE_MAC },
        ],
        packets,
      },
      overview: {
        hook: 'When you join a Wi-Fi network, your device needs an address so messages can find it, like a room number in a hotel. You don’t make one up. You ask the front desk, and they hand you a free one. DHCP is that front desk. It’s why you never type an address in yourself.',
        description:
          'DHCP hands each new device the few things it needs to start talking on a network. Your router usually does this job. It lends addresses out for a while, and keeps a list of who has which one.',
        facts: [
          { label: 'Layer', value: 'Application (7)' },
          { label: 'Ports', value: 'UDP 67 (server), UDP 68 (client)' },
          { label: 'Hands out', value: 'IP address, subnet mask, default gateway, DNS server' },
          { label: 'Exchange', value: 'Discover, Offer, Request, Acknowledge' },
          { label: 'Lease', value: 'Renewed at half its length' },
          { label: 'Defined in', value: 'RFC 2131, RFC 2132' },
        ],
      },
      steps: [
        {
          id: 'discover',
          title: 'DHCP Discover',
          sub: 'The laptop asks: is anyone there?',
          narrative:
            'Your laptop just joined the Wi-Fi, but it has no address yet. It doesn’t know who to ask, so it shouts to everyone on the network at once: “Can anyone give me an address?” That shout is called a **Discover**. Every device hears it. The phone hears it too, but it isn’t the one that hands out addresses, so it ignores it.',
          deep: 'The shout is a broadcast to 255.255.255.255, sent from 0.0.0.0 (“I have no address yet”) to UDP port 67, where DHCP servers listen. Lessons 10 and 11 cover ports and UDP.',
          facts: [
            { label: 'From', value: '0.0.0.0, UDP port 68' },
            { label: 'To', value: '255.255.255.255, UDP port 67' },
            { label: 'Ethernet destination', value: 'ff:ff:ff:ff:ff:ff (everyone)' },
            { label: 'Laptop MAC', value: '00:00:5E:00:53:10' },
          ],
          events: [
            message({
              id: 'msg-discover',
              from: 'laptop',
              to: 'router',
              tag: 'Discover',
              kind: 'broadcast',
              time: formatTime(0),
              src: `${NO_ADDRESS}:68`,
              dst: `${EVERYONE}:67`,
              info: 'DHCP Discover: can anyone give me an address?',
              plain: 'The laptop shouts to everyone: can anyone give me an address?',
              packet: 'discover',
            }),
          ],
        },
        {
          id: 'offer',
          title: 'DHCP Offer',
          sub: 'The router offers a free address',
          narrative:
            'The router is the one that hands out addresses. It hears the shout, picks a free address, 192.168.1.100, and offers it to the laptop. With it come a few other settings the laptop will need, and a time limit: it can keep the address for 24 hours. That’s the **Offer**.',
          deep: 'Along with the address, the Offer carries a subnet mask, a default gateway and a DNS server (lessons 7 and 13). It names the laptop’s MAC address, which is how the phone knows the Offer isn’t for it.',
          facts: [
            { label: 'Address offered', value: '192.168.1.100' },
            { label: 'Subnet mask', value: '255.255.255.0' },
            { label: 'Gateway and DNS', value: '192.168.1.1 (the router, for both)' },
            { label: 'Lease', value: '86400 seconds (24 hours)' },
          ],
          events: [
            message({
              id: 'msg-offer',
              from: 'router',
              to: 'laptop',
              tag: 'Offer',
              kind: 'response',
              time: formatTime(0.003),
              src: `${ROUTER_IP}:67`,
              dst: `${EVERYONE}:68`,
              info: 'DHCP Offer: you can have 192.168.1.100 for 24 hours',
              plain: 'The router offers 192.168.1.100, plus the other settings the laptop needs, for 24 hours.',
              packet: 'offer',
            }),
          ],
        },
        {
          id: 'request',
          title: 'DHCP Request',
          sub: 'The laptop says yes, please',
          narrative:
            'The laptop answers: “Yes, I’ll take 192.168.1.100.” It still shouts this to everyone, not just the router. That’s on purpose: if a second router had offered an address too, it now knows it wasn’t picked. This answer is called a **Request**.',
          deep: 'The Request is still sent from 0.0.0.0, because the address isn’t the laptop’s until the router confirms. A field called the server identifier says whose offer won, so any other DHCP server can free up the address it offered.',
          facts: [
            { label: 'Address requested', value: '192.168.1.100' },
            { label: 'Server chosen', value: '192.168.1.1 (server identifier)' },
            { label: 'Sent from', value: '0.0.0.0, still no address' },
          ],
          events: [
            message({
              id: 'msg-request',
              from: 'laptop',
              to: 'router',
              tag: 'Request',
              kind: 'broadcast',
              time: formatTime(0.006),
              src: `${NO_ADDRESS}:68`,
              dst: `${EVERYONE}:67`,
              info: 'DHCP Request: I’ll take 192.168.1.100, please',
              plain: 'The laptop says yes: I’ll take 192.168.1.100 from 192.168.1.1.',
              packet: 'request',
            }),
          ],
        },
        {
          id: 'acknowledge',
          title: 'DHCP Acknowledge',
          sub: 'The router says: it’s yours',
          narrative:
            'The router confirms: “192.168.1.100 is yours for 24 hours.” Then it writes it down in its lease table, a list of which device has which address. That list is how two devices never end up with the same address. Now the laptop can go online. These four messages are often called DORA: Discover, Offer, Request, **Acknowledge**.',
          deep: 'The confirmation is called an ACK. The lease table usually sits behind your router’s “connected devices” page.',
          facts: [
            { label: 'Address', value: '192.168.1.100' },
            { label: 'Lease', value: '24 hours' },
            { label: 'Lease table row', value: '192.168.1.100, 00:00:5E:00:53:10, Laptop' },
          ],
          events: [
            message({
              id: 'msg-ack',
              from: 'router',
              to: 'laptop',
              tag: 'ACK',
              kind: 'response',
              time: formatTime(0.009),
              src: `${ROUTER_IP}:67`,
              dst: `${EVERYONE}:68`,
              info: 'DHCP Acknowledge: 192.168.1.100 is yours',
              plain: 'The router confirms: 192.168.1.100 is the laptop’s for 24 hours.',
              packet: 'ack',
            }),
            leaseAdded,
          ],
        },
        {
          id: 'renew',
          title: 'Lease Renewal',
          sub: 'Halfway through, ask to keep it',
          narrative:
            'The address is only borrowed, like a hotel room. Halfway through the 24 hours, the laptop asks the router directly: “Can I keep my address a bit longer?” The router says yes, and the clock starts again. No shouting this time: the laptop knows exactly who to ask. This is called a **Renew**.',
          deep: 'Renewal happens at half the lease, 43,200 seconds here. If the router stays silent, the laptop asks any server at 87.5% of the lease, and if the lease runs out it starts again with a Discover. On Windows, ipconfig /renew does this on demand.',
          facts: [
            { label: 'Renews at', value: '43200 seconds (half of 86400)' },
            { label: 'Sent to', value: '192.168.1.1, UDP port 67, directly' },
            { label: 'New expiry', value: 'in 24 h (renewed)' },
          ],
          events: [
            message({
              id: 'msg-renew-request',
              from: 'laptop',
              to: 'router',
              tag: 'Renew',
              kind: 'request',
              time: formatTime(RENEW_SECONDS),
              src: `${LAPTOP_IP}:68`,
              dst: `${ROUTER_IP}:67`,
              info: 'DHCP Request: can I keep 192.168.1.100?',
              plain: 'Halfway through, the laptop asks the router directly: can I keep my address?',
              packet: 'renew-request',
            }),
            message({
              id: 'msg-renew-ack',
              from: 'router',
              to: 'laptop',
              tag: 'ACK',
              kind: 'response',
              time: formatTime(RENEW_SECONDS + 0.004),
              src: `${ROUTER_IP}:67`,
              dst: `${LAPTOP_IP}:68`,
              info: 'DHCP Acknowledge: yes, for another 24 hours',
              plain: 'The router says yes, and the 24 hours start again.',
              packet: 'renew-ack',
            }),
            leaseRenewed,
          ],
        },
      ],
      learn: {
        lead: 'Your laptop joined the Wi-Fi with no address. Four short messages later it had one, borrowed from the router for 24 hours. Here is what each part was, and what it’s called.',
        terms: [
          { idea: 'Shouting to every device on the network at once, because you don’t know who to ask', name: 'Broadcast' },
          { idea: 'Asking: can anyone give me an address?', name: 'Discover' },
          { idea: 'The router suggesting a free address, with a time limit', name: 'Offer' },
          { idea: 'Saying yes to that address, out loud, so every router knows', name: 'Request' },
          { idea: 'The router confirming the address is yours', name: 'Acknowledge' },
          { idea: 'The router’s list of which device has which address', name: 'Lease table' },
          { idea: 'Borrowing an address for a set time', name: 'Lease' },
          { idea: 'Asking to keep it a while longer, halfway through', name: 'Renew' },
        ],
        pattern: {
          names: ['Discover', 'Offer', 'Request', 'Acknowledge'],
          note: 'Remember the first four in order: Discover, Offer, Request, Acknowledge.',
        },
        why: 'Without DHCP you would type an address into every device yourself, and two devices could end up with the same one. The router keeps the list, so that never happens.',
        deep: 'DHCP messages travel over UDP. Before it has an address, a device sends from 0.0.0.0 to 255.255.255.255, the address that means everyone on this network. The client renews at half the lease, often called T1. If its own server stays silent, it asks any server at 87.5% of the lease, called T2.',
        facts: [
          { label: 'Ports', value: 'UDP 67 (server), UDP 68 (client)' },
          { label: 'First messages', value: 'from 0.0.0.0 to 255.255.255.255' },
          { label: 'Renew (T1)', value: 'at 50% of the lease' },
          { label: 'Rebind (T2)', value: 'at 87.5% of the lease' },
          { label: 'No server answers', value: 'Windows gives itself 169.254.x.x (APIPA)' },
          { label: 'Defined in', value: 'RFC 2131, RFC 2132' },
        ],
      },
      practice: [
        {
          id: 'why-shout',
          prompt: 'The laptop has just joined the Wi-Fi. Why does it shout its first message to everyone?',
          options: [
            {
              text: 'It doesn’t know yet who hands out addresses.',
              feedback:
                'Right. With no address and no idea which device is the router, shouting to everyone is the only way to reach it. That shout is the Discover.',
            },
            {
              text: 'Shouting is faster than asking one device.',
              feedback: 'Not quite. Speed isn’t the reason. The laptop shouts because it doesn’t know yet who hands out addresses.',
            },
            {
              text: 'So the phone can answer if the router is busy.',
              feedback:
                'Not quite. The phone doesn’t hand out addresses, so it ignores the shout. The laptop shouts because it doesn’t know yet who to ask.',
            },
          ],
          answer: 0,
        },
        {
          id: 'no-repeats',
          prompt: 'How does the router make sure two devices never get the same address?',
          options: [
            {
              text: 'It gives every device the same address, then changes it later.',
              feedback:
                'Not quite. Two devices with the same address would get each other’s messages. The router keeps a list and only offers addresses that are free.',
            },
            {
              text: 'It writes each loan in its lease table, and only offers addresses that are free.',
              feedback: 'That’s it. The lease table is the router’s list of who has which address.',
            },
            {
              text: 'It asks the phone which addresses are taken.',
              feedback: 'Not quite. The phone doesn’t keep track of addresses. The router does, in its lease table.',
            },
          ],
          answer: 1,
        },
        {
          id: 'when-renew',
          prompt: 'The laptop borrowed its address for 24 hours. When does it first ask to keep it?',
          options: [
            {
              text: 'After about 12 hours, halfway through.',
              feedback: 'Yes. Asking halfway leaves plenty of time if the router doesn’t answer. That’s a Renew.',
            },
            {
              text: 'Only once the 24 hours have run out.',
              feedback: 'Not quite. Waiting until the end could leave the laptop without an address for a while. It asks halfway through.',
            },
            {
              text: 'Every time it sends a message.',
              feedback: 'Not quite. That would be a lot of asking. It asks once, halfway through the 24 hours.',
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
