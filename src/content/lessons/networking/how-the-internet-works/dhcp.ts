import { eventLog, messagesFor } from '../../../helpers/internet-events';
import type { LegacyUnitInput } from '../../../legacy';
import type { TableDef } from '../../../schema';

/**
 * DHCP, protocol 7 of How the Internet Works’ 14. The laptop joins the Wi-Fi with no address, and the router lends
 * it one in four messages, Discover, Offer, Request and Acknowledge, then renews the lease halfway through. Lesson 10
 * teaches DHCP in full. This part overlaps it, and the overlap stays as it is for now (owner: deferred).
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), ported as written, but for
 * the laptop's MAC address: the mockup's 02:1a:2b:3c:4d:5e is 00:00:5E:00:53:10 here, from the documentation range
 * every lesson uses (RFC 7042), and the same laptop's in lesson 10. With no IP address until the end, the laptop goes
 * by it in the Sequence view, as in lesson 10.
 */

const LAPTOP = '192.168.1.100:68';
const ROUTER = '192.168.1.1:67';
const EVERYONE = '255.255.255.255:67';
const NO_ADDRESS = '0.0.0.0:68';

const settings: TableDef = {
  id: 'settings',
  title: 'Your laptop’s settings',
  by: 'from the router',
  columns: [
    { key: 'setting', label: 'Setting' },
    { key: 'value', label: 'Value' },
    { key: 'status', label: 'Status', prose: true },
  ],
  keyColumn: 'setting',
  initialRows: [],
  empty: 'Nothing yet. The laptop has no settings for this network.',
};

const msg = messagesFor(settings);

const dhcp: LegacyUnitInput = {
  id: 'dhcp',
  name: 'DHCP',
  fullName: 'Dynamic Host Configuration Protocol',
  purpose: 'Getting an address',
  group: 'app',
  osiLayers: [7],
  references: [{ label: 'RFC 2131: Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' }],
  scene: {
    title: 'Your laptop joins the network and gets an address',
    views: ['network', 'sequence'],
    layers: [],
    labels: { laptop: 'Joining the Wi-Fi', laptopAddr: 'no address yet', url: 'No network', router: '192.168.1.1\nhands out addresses' },
    start: [],
    panel: { type: 'table', table: settings },
    log: eventLog({ kind: 'broadcast', label: 'Broadcast to everyone' }),
    parties: [
      { place: 'laptop', label: 'Laptop', addr: '00:00:5E:00:53:10' },
      { place: 'router', label: 'Your router', addr: '192.168.1.1' },
    ],
  },
  overview: {
    hook: 'A device that joins a network has no address yet. DHCP is how it gets one: it calls out, the router offers an address, and the device takes it for a while. The DHCP lesson, lesson 10, goes further.',
    description:
      'It’s like arriving at a hotel. You don’t pick your own room: you ask at the desk, they offer one, you say yes, and they give you the key for a set number of nights. Here your laptop joins your home Wi-Fi, and your router is the desk.',
    facts: [
      { label: 'Used for', value: 'giving devices an address when they join' },
      { label: 'Ports', value: 'UDP 67 (server), 68 (client)' },
      { label: 'Messages', value: 'Discover, Offer, Request, Acknowledge' },
      { label: 'Also hands out', value: 'the router’s and resolver’s addresses' },
      { label: 'OSI layer', value: '7, application' },
      { label: 'This example', value: 'your laptop joining 192.168.1.0/24' },
    ],
  },
  steps: [
    {
      id: 'client-initialization',
      title: 'Client Initialization',
      sub: 'No address yet',
      narrative:
        'You open your laptop and it joins the Wi-Fi. It’s connected, but it can’t talk to anyone yet: it has no **IP address**, and it doesn’t know where the router or the DNS resolver are. The laptop is the **client** here, and it needs a **DHCP server** to give it all of that. In a home, the server is the router.',
      deep: 'With no address, the client uses 0.0.0.0 as its source and sends to 255.255.255.255, the broadcast address. It may remember its last address on this network and ask for that one again. If nobody answers at all, it gives itself a link-local address in 169.254.0.0/16, which only works with its neighbours.',
      facts: [
        { label: 'Laptop’s address', value: 'none yet (0.0.0.0)' },
        { label: 'Knows the router?', value: 'no' },
        { label: 'Needs', value: 'an address, mask, router and DNS' },
        { label: 'Server here', value: 'your home router' },
      ],
      status: 'On the Wi-Fi, can’t talk yet',
      idle: 'Nothing on the network yet. The laptop has no address to send from.',
      events: [],
    },
    {
      id: 'dhcp-discover',
      title: 'DHCP Discover',
      sub: 'Shout for one',
      narrative:
        'The laptop doesn’t know who hands out addresses, so it calls out to the whole network at once: “I’m new here. Can anyone give me an address?” A message to everyone is a **broadcast**, and this one is a **DHCP Discover**. Every device on the network hears it, but only a DHCP server will answer.',
      deep: 'Discover goes from 0.0.0.0:68 to 255.255.255.255:67 over UDP, and carries the laptop’s MAC address so the server can tell clients apart. Broadcasts don’t cross routers, so a network whose server is elsewhere needs a DHCP relay (on Cisco, ip helper-address).',
      facts: [
        { label: 'From', value: '0.0.0.0, port 68' },
        { label: 'To', value: 'everyone: 255.255.255.255, port 67' },
        { label: 'Carries', value: 'the laptop’s MAC address' },
        { label: 'Over', value: 'UDP' },
      ],
      events: [
        ...msg({
          tag: 'DISCOVER',
          from: 'laptop',
          to: 'router',
          proto: 'DHCP',
          via: 'UDP',
          kind: 'request',
          bcast: true,
          time: '0.000s',
          src: NO_ADDRESS,
          dst: EVERYONE,
          size: '342 B',
          sum: 'Everyone: I’m new here. Can anyone give me an address?',
          info: 'DHCP Discover, from 00:00:5E:00:53:10',
          st: 'Asking for an address',
        }),
      ],
    },
    {
      id: 'dhcp-offer',
      title: 'DHCP Offer',
      sub: 'The router offers',
      narrative:
        'The router hears it and picks a free address from its pool: 192.168.1.100. It answers with a **DHCP Offer**: “You can have 192.168.1.100. I’m your router, at 192.168.1.1, and for names, ask 192.0.2.53.” Nothing is final yet. It’s an offer, and the router holds the address for a moment while the laptop decides.',
      deep: 'The Offer carries the address (yiaddr), the subnet mask, the default gateway, the DNS servers and the lease time, here 24 hours. Servers may broadcast the Offer or send it straight to the client’s MAC. A network can have more than one DHCP server, so a client may get several offers; it takes one.',
      facts: [
        { label: 'Offers', value: '192.168.1.100' },
        { label: 'Mask', value: '255.255.255.0' },
        { label: 'Router and DNS', value: '192.168.1.1, 192.0.2.53' },
        { label: 'Lease', value: '24 hours' },
      ],
      events: [
        ...msg({
          tag: 'OFFER',
          from: 'router',
          to: 'laptop',
          proto: 'DHCP',
          via: 'UDP',
          kind: 'response',
          time: '0.004s',
          src: ROUTER,
          dst: LAPTOP,
          size: '342 B',
          sum: 'You can have 192.168.1.100. I’m your router, and ask 192.0.2.53 for names.',
          info: 'DHCP Offer: 192.168.1.100, lease 24 h',
          st: 'Offered 192.168.1.100',
          rows: [
            { key: 'ip', cells: ['Address', '192.168.1.100', 'Offered'] },
            { key: 'mask', cells: ['Mask', '255.255.255.0', 'Offered'] },
            { key: 'gw', cells: ['Router', '192.168.1.1', 'Offered'] },
            { key: 'dns', cells: ['DNS', '192.0.2.53', 'Offered'] },
            { key: 'lease', cells: ['Lease', '24 hours', 'Offered'] },
          ],
        }),
      ],
    },
    {
      id: 'dhcp-request',
      title: 'DHCP Request',
      sub: 'Say yes, out loud',
      narrative:
        'The laptop answers: “Yes please, I’ll take 192.168.1.100 from 192.168.1.1.” It says it to everyone, as a broadcast again. That way, if any other server made an offer, it hears that its offer wasn’t taken and can give that address to someone else. This is the **DHCP Request**.',
      deep: 'The Request still comes from 0.0.0.0, because the laptop can’t use the address until the server confirms it. It names the chosen server (option 54, server identifier) and the address it wants (option 50, requested IP address).',
      facts: [
        { label: 'From', value: '0.0.0.0, port 68' },
        { label: 'To', value: 'everyone, port 67' },
        { label: 'Asks for', value: '192.168.1.100' },
        { label: 'Names the server', value: '192.168.1.1' },
      ],
      events: [
        ...msg({
          tag: 'REQUEST',
          from: 'laptop',
          to: 'router',
          proto: 'DHCP',
          via: 'UDP',
          kind: 'request',
          bcast: true,
          time: '0.006s',
          src: NO_ADDRESS,
          dst: EVERYONE,
          size: '350 B',
          sum: 'Everyone: I’ll take 192.168.1.100, from 192.168.1.1.',
          info: 'DHCP Request: 192.168.1.100, server 192.168.1.1',
          st: 'Accepting 192.168.1.100',
          rows: [{ key: 'ip', cells: ['Address', '192.168.1.100', 'Requested'] }],
        }),
      ],
    },
    {
      id: 'dhcp-acknowledge',
      title: 'DHCP Acknowledge',
      sub: 'It’s yours',
      narrative:
        'The router confirms with a **DHCP Acknowledge**: “It’s yours for 24 hours.” The laptop sets itself up with the address, the mask, the router and the DNS resolver, and it’s on the network. The 24 hours is the **lease**: the address is lent, not given.',
      deep: 'After the ACK, many clients send an ARP probe for their new address, to make sure nobody else is using it. If the server can’t give the address after all, it replies with a DHCPNAK and the client starts again from Discover. The four messages, Discover, Offer, Request, Acknowledge, are often remembered as DORA.',
      facts: [
        { label: 'Address', value: '192.168.1.100, for 24 hours' },
        { label: 'Router', value: '192.168.1.1' },
        { label: 'DNS', value: '192.0.2.53' },
        { label: 'Four messages', value: 'Discover, Offer, Request, Ack (DORA)' },
      ],
      events: [
        ...msg({
          tag: 'ACK',
          from: 'router',
          to: 'laptop',
          proto: 'DHCP',
          via: 'UDP',
          kind: 'response',
          time: '0.009s',
          src: ROUTER,
          dst: LAPTOP,
          size: '342 B',
          sum: 'It’s yours for 24 hours.',
          info: 'DHCP ACK: 192.168.1.100, lease 24 h',
          st: 'On the network',
          done: true,
          addr: '192.168.1.100',
          url: 'Connected',
          rows: [
            { key: 'ip', cells: ['Address', '192.168.1.100', 'In use'] },
            { key: 'mask', cells: ['Mask', '255.255.255.0', 'In use'] },
            { key: 'gw', cells: ['Router', '192.168.1.1', 'In use'] },
            { key: 'dns', cells: ['DNS', '192.0.2.53', 'In use'] },
            { key: 'lease', cells: ['Lease', '24 hours', 'In use'] },
          ],
        }),
      ],
    },
    {
      id: 'lease-renewal',
      title: 'Lease Renewal',
      sub: 'Ask to keep it',
      narrative:
        'Halfway through the lease, after 12 hours, the laptop asks to keep its address. This time it knows exactly who to ask, so it doesn’t shout: it asks the router directly. The router says yes, and the 24 hours start again. As long as the laptop stays on the network, its address doesn’t change. That’s **lease renewal**.',
      deep: 'Renewal starts at T1, half the lease, with a Request sent straight to the server. If the server doesn’t answer, the client broadcasts to any server at T2, seven-eighths of the lease. If the lease runs out, it must stop using the address and start again from Discover. A device leaving politely sends a DHCPRELEASE.',
      facts: [
        { label: 'Renews at', value: 'half the lease: 12 hours' },
        { label: 'Sent to', value: 'the router directly, 192.168.1.1' },
        { label: 'If no answer', value: 'ask anyone, at 7/8 of the lease' },
        { label: 'Lease', value: 'back to 24 hours' },
      ],
      events: [
        ...msg({
          tag: 'REQUEST',
          from: 'laptop',
          to: 'router',
          proto: 'DHCP',
          via: 'UDP',
          kind: 'request',
          time: '12 h',
          src: LAPTOP,
          dst: ROUTER,
          size: '350 B',
          sum: 'Can I keep 192.168.1.100?',
          info: 'DHCP Request (renewal): 192.168.1.100',
          st: 'Renewing the lease',
          known: true,
        }),
        ...msg({
          tag: 'ACK',
          from: 'router',
          to: 'laptop',
          proto: 'DHCP',
          via: 'UDP',
          kind: 'response',
          time: '12 h',
          src: ROUTER,
          dst: LAPTOP,
          size: '342 B',
          sum: 'Yes. Another 24 hours.',
          info: 'DHCP ACK: lease renewed, 24 h',
          st: 'Lease renewed',
          done: true,
          rows: [{ key: 'lease', cells: ['Lease', '24 hours, renewed', 'In use'] }],
        }),
      ],
    },
  ],
  learn: {
    lead: 'Four messages took the laptop from a stranger to a member of the network, and two more keep it there.',
    terms: [
      { idea: 'The device asking for an address', name: 'DHCP client' },
      { idea: 'The one handing addresses out, here your router', name: 'DHCP server' },
      { idea: 'A message to everyone on the network', name: 'Broadcast' },
      { idea: '“Can anyone give me an address?”', name: 'Discover' },
      { idea: '“You can have this one”', name: 'Offer' },
      { idea: '“Yes please, I’ll take it”', name: 'Request' },
      { idea: '“It’s yours”', name: 'Acknowledge' },
      { idea: 'How long the address is lent for', name: 'Lease' },
    ],
    pattern: {
      names: ['Discover', 'Offer', 'Request', 'Acknowledge'],
      note: 'DORA: every device that joins a network goes this way. A renewal is just the last two again.',
    },
    why: 'Without DHCP, someone would have to type an address, mask, router and resolver into every phone, laptop and TV, and make sure no two clashed. DHCP does it in a second, and takes addresses back from devices that leave.',
    deep: 'Servers hand out addresses from a pool (a scope), and can reserve one for a particular MAC so a printer always gets the same address. On bigger networks, a relay on each router forwards broadcasts to a central server. DHCP snooping on switches blocks rogue servers. IPv6 can use DHCPv6, or let devices make their own address (SLAAC). The DHCP lesson, lesson 10, goes further.',
    facts: [
      { label: 'Ports', value: 'UDP 67 (server), 68 (client)' },
      { label: 'Messages', value: 'Discover, Offer, Request, Ack, plus NAK, Release' },
      { label: 'Renewal', value: 'at 50% of the lease, then 87.5%' },
      { label: 'No server?', value: '169.254.x.x, neighbours only' },
      { label: 'Defined in', value: 'RFC 2131' },
    ],
  },
  practice: [
    {
      id: 'broadcast-discover',
      prompt: 'Why does the laptop broadcast its Discover?',
      options: [
        {
          text: 'It doesn’t know who the DHCP server is yet.',
          feedback: 'Right. With no address and no server to ask, it calls out to everyone.',
        },
        { text: 'Broadcasts are faster.', feedback: 'Not quite. It broadcasts because it has nobody to address yet.' },
        { text: 'To tell everyone its new address.', feedback: 'Not quite. It has no address yet. That’s what it’s asking for.' },
      ],
      answer: 0,
    },
    {
      id: 'renewal',
      prompt: 'Twelve hours into a 24-hour lease, what does the laptop do?',
      options: [
        {
          text: 'Gives the address back.',
          feedback: 'Not quite. It only gives it back if it leaves. Halfway through, it asks to keep it.',
        },
        {
          text: 'Asks the router directly to keep its address.',
          feedback: 'Yes. That’s a renewal: a direct Request, and an ACK starts the lease again.',
        },
        { text: 'Broadcasts a new Discover.', feedback: 'Not quite. It knows its server now, so it asks it directly.' },
      ],
      answer: 1,
    },
  ],
};

export default dhcp;
