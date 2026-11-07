import { eventLog, messagesFor } from '../../../helpers/internet-events';
import type { LegacyUnitInput } from '../../../legacy';
import type { TableDef } from '../../../schema';

/**
 * IP, protocol 5 of How the Internet Works’ 14. One packet to example.net: the laptop sees it isn’t local, finds the
 * router’s hardware address with ARP, labels the packet and hands it over. The router swaps the private source for
 * its public address (NAT), the routers on the way pass it along, and the reply comes back the same way.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), ported as written, but for
 * the two MAC addresses: the mockup's 02:1a:2b:3c:4d:5e (the laptop) and 02:aa:bb:cc:dd:01 (the router) are
 * 00:00:5E:00:53:10 and 00:00:5E:00:53:01 here, from the documentation range every lesson uses (RFC 7042), and the
 * same two devices' in lesson 10. The provider's router has no address in IP's own messages; the Sequence view gives
 * it 198.51.100.1, as ICMP finds it at hop 2 on the same map.
 */

const LAPTOP_MAC = '00:00:5E:00:53:10';
const ROUTER_MAC = '00:00:5E:00:53:01';
const PUBLIC = '198.51.100.23';
const EXAMPLE = '203.0.113.80';

const written: TableDef = {
  id: 'written',
  title: 'What’s written on the packet',
  by: 'as it travels',
  columns: [
    { key: 'where', label: 'Where' },
    { key: 'from', label: 'From' },
    { key: 'to', label: 'To' },
    { key: 'ttl', label: 'TTL' },
  ],
  keyColumn: 'where',
  initialRows: [],
  empty: 'No packet yet. The laptop is deciding where to send it.',
};

const msg = messagesFor(written);

const ip: LegacyUnitInput = {
  id: 'ip',
  name: 'IP',
  fullName: 'Internet Protocol',
  purpose: 'Addresses and routes',
  group: 'core',
  osiLayers: [3],
  references: [{ label: 'RFC 791: Internet Protocol', url: 'https://www.rfc-editor.org/rfc/rfc791' }],
  scene: {
    title: 'One packet, passed from router to router',
    views: ['network', 'sequence'],
    layers: ['ip:web'],
    labels: { laptop: 'Sending a packet', url: 'example.net', router: '192.168.1.1 inside\n198.51.100.23 outside' },
    start: [],
    panel: { type: 'table', table: written },
    log: eventLog({ kind: 'broadcast', label: 'Broadcast to everyone' }),
    parties: [
      { place: 'laptop', label: 'Laptop', addr: '192.168.1.100' },
      { place: 'router', label: 'Your router', addr: '192.168.1.1' },
      { place: 'isp', label: 'Provider’s router', addr: '198.51.100.1' },
      { place: 'web', label: 'example.net', addr: '203.0.113.80' },
    ],
  },
  overview: {
    hook: 'IP puts an address on every packet and lets routers pass it along, hop by hop, toward where it’s going. It’s what makes thousands of separate networks act like one internet.',
    description:
      'It works like posting a parcel. You write the address on it and hand it to your local post office, which passes it to a bigger sorting office, and so on. Nobody on the way knows the whole route; each one only knows which way to send it next. Here your laptop sends one packet to example.net and gets a reply.',
    facts: [
      { label: 'Used for', value: 'every packet on the internet' },
      { label: 'Addresses', value: 'IPv4 (like 203.0.113.80) and IPv6' },
      { label: 'Each hop', value: 'a router picks the next one' },
      { label: 'Promises', value: 'none: best effort' },
      { label: 'OSI layer', value: '3, network' },
      { label: 'This example', value: '192.168.1.100 to 203.0.113.80' },
    ],
  },
  steps: [
    {
      id: 'routing-decision',
      title: 'Routing Decision',
      sub: 'Near or far?',
      narrative:
        'Your laptop has a packet for 203.0.113.80. First question: is that address on my own network? The laptop’s network is your home, 192.168.1.something. 203.0.113.80 isn’t, so the laptop can’t deliver it itself. The rule for anything outside is simple: send it to the **default gateway**, your router. Making that choice is the **routing decision**.',
      deep: 'The laptop compares the destination with its own address and subnet mask: 192.168.1.100/24 covers 192.168.1.0 to 192.168.1.255. Anything outside matches only the default route, 0.0.0.0/0, whose next hop is the gateway, 192.168.1.1. You can see the table with route print on Windows or ip route on Linux.',
      facts: [
        { label: 'Destination', value: '203.0.113.80' },
        { label: 'My network', value: '192.168.1.0/24' },
        { label: 'Same network?', value: 'no' },
        { label: 'So send it to', value: 'the default gateway, 192.168.1.1' },
      ],
      status: 'Not local: send to the router',
      idle: 'Nothing on the network yet. The laptop is working out where to send the packet.',
      events: [],
    },
    {
      id: 'arp-resolution',
      title: 'ARP Resolution',
      sub: 'Find the router’s hardware address',
      narrative:
        'On your home network, devices don’t deliver by IP address. They use each other’s **MAC address**, a hardware number built into every network card. The laptop knows the router is 192.168.1.1, but not its MAC. So it calls out to the whole house, “Who has 192.168.1.1?”, and the router answers, “That’s me, at 00:00:5E:00:53:01.” That’s **ARP**, and a call to everyone is a **broadcast**.',
      deep: 'The ARP request goes to the broadcast MAC address ff:ff:ff:ff:ff:ff, so every device on the network reads it, and only the owner of 192.168.1.1 replies, directly. The laptop keeps the answer in its ARP cache for a few minutes (arp -a shows it). IPv6 does the same job with Neighbor Discovery. Forged ARP replies (ARP spoofing) can trick devices into sending their traffic to an attacker.',
      facts: [
        { label: 'Asks', value: 'who has 192.168.1.1?' },
        { label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff' },
        { label: 'Answer', value: '00:00:5E:00:53:01' },
        { label: 'Kept in', value: 'the ARP cache, a few minutes' },
      ],
      events: [
        ...msg({
          tag: 'WHO HAS?',
          from: 'laptop',
          to: 'router',
          proto: 'ARP',
          via: 'Ethernet',
          kind: 'request',
          bcast: true,
          time: '0.000s',
          src: LAPTOP_MAC,
          dst: 'ff:ff:ff:ff:ff:ff',
          size: '42 B',
          sum: 'Everyone: who has 192.168.1.1?',
          info: 'ARP: who has 192.168.1.1? Tell 192.168.1.100',
          st: 'Finding the router',
        }),
        ...msg({
          tag: 'IS AT',
          from: 'router',
          to: 'laptop',
          proto: 'ARP',
          via: 'Ethernet',
          kind: 'response',
          time: '0.002s',
          src: ROUTER_MAC,
          dst: LAPTOP_MAC,
          size: '42 B',
          sum: 'That’s me. My hardware address is 00:00:5E:00:53:01.',
          info: 'ARP: 192.168.1.1 is at 00:00:5E:00:53:01',
          st: 'Found the router',
          known: true,
        }),
      ],
    },
    {
      id: 'ip-encapsulation',
      title: 'IP Encapsulation',
      sub: 'Label the packet',
      narrative:
        'Now the laptop packs the data up. It puts an **IP header** on the front, a label with the **source address** (192.168.1.100), the **destination address** (203.0.113.80) and a **TTL**, a hop counter that starts at 64. Then it wraps all that in a frame addressed to the router’s MAC, and sends it. Wrapping one layer inside another like this is **encapsulation**.',
      deep: 'An IPv4 header is 20 bytes: version, header length, total length, an ID and fragment fields, TTL, the protocol inside (6 TCP, 17 UDP, 1 ICMP), a checksum, and the two addresses. The Ethernet frame around it carries MAC addresses, which change at every hop; the IP addresses inside stay the same end to end, unless NAT changes them. A packet too big for a link is split up (fragmented), or dropped with an ICMP note if it’s marked Don’t Fragment.',
      facts: [
        { label: 'Source', value: '192.168.1.100' },
        { label: 'Destination', value: '203.0.113.80' },
        { label: 'TTL', value: '64' },
        { label: 'Frame to', value: '00:00:5E:00:53:01, the router' },
      ],
      events: [
        ...msg({
          tag: 'PACKET',
          from: 'laptop',
          to: 'router',
          proto: 'IP',
          via: 'Ethernet',
          kind: 'request',
          time: '0.003s',
          src: '192.168.1.100',
          dst: EXAMPLE,
          size: '60 B',
          sum: 'To 203.0.113.80, from 192.168.1.100, TTL 64. Handed to the router.',
          info: 'IPv4, TTL 64, protocol TCP, 60 bytes',
          st: 'Packet sent to the router',
          known: true,
          rows: [{ key: '1', cells: ['Leaving the laptop', '192.168.1.100', EXAMPLE, '64'] }],
        }),
      ],
    },
    {
      id: 'nat-and-forwarding',
      title: 'NAT and Forwarding',
      sub: 'Swap the address, pass it on',
      narrative:
        'Your router has a problem: 192.168.1.100 is a **private address**. Thousands of homes use the same numbers, so the internet couldn’t send anything back to it. The router swaps it for its own **public address**, 198.51.100.23, and notes the swap so the reply can find its way home. That’s **NAT**. It takes 1 off the TTL and passes the packet on. Every router after it does the same: read the destination, pick the next router, pass it on. That’s **forwarding**.',
      deep: 'The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Home routers use port address translation: many devices share one public address and are told apart by port numbers in the NAT table. Each router picks the next hop by the longest matching prefix in its routing table; between providers, routes are learned with BGP. A packet whose TTL reaches 0 is dropped, which stops it looping for ever.',
      facts: [
        { label: 'Private source', value: '192.168.1.100' },
        { label: 'Swapped for', value: '198.51.100.23, the router’s public address' },
        { label: 'Each hop', value: 'TTL − 1, then pass it on' },
        { label: 'Arrives with', value: 'TTL 60' },
      ],
      events: [
        ...msg({
          tag: 'PACKET',
          from: 'router',
          to: 'isp',
          proto: 'IP',
          via: 'IP',
          kind: 'request',
          time: '0.004s',
          src: PUBLIC,
          dst: EXAMPLE,
          size: '60 B',
          sum: 'Same packet, new source: 198.51.100.23. TTL now 63.',
          info: 'NAT: 192.168.1.100 → 198.51.100.23, TTL 63',
          st: 'Router swapped the address',
          known: true,
          rows: [{ key: '2', cells: ['Leaving your router', PUBLIC, EXAMPLE, '63'] }],
        }),
        ...msg({
          tag: 'PACKET',
          from: 'isp',
          to: 'web',
          proto: 'IP',
          via: 'IP',
          kind: 'request',
          time: '0.016s',
          src: PUBLIC,
          dst: EXAMPLE,
          size: '60 B',
          sum: 'Router by router to example.net. Each one takes 1 off the TTL.',
          info: 'Forwarded 3 more hops, arrives with TTL 60',
          st: 'Delivered to example.net',
          known: true,
          rows: [{ key: '3', cells: ['Arriving at example.net', PUBLIC, EXAMPLE, '60'] }],
        }),
      ],
    },
    {
      id: 'return-routing',
      title: 'Return Routing',
      sub: 'Back the same way',
      narrative:
        'example.net replies to the address it saw, 198.51.100.23, which is your router. The routers pass the reply back hop by hop. When it reaches your router, the router checks its notes, sees this reply belongs to your laptop, and swaps the destination back to 192.168.1.100. The laptop gets its answer and never knew its address was swapped.',
      deep: 'The reply’s TTL starts fresh, at the server’s own default (often 64). The way back doesn’t have to match the way out: each direction is routed on its own. NAT is also why a device at home can’t easily be reached from outside, unless the router forwards a port to it.',
      facts: [
        { label: 'Reply to', value: '198.51.100.23' },
        { label: 'Router swaps it to', value: '192.168.1.100' },
        { label: 'Path back', value: 'often the same, not always' },
        { label: 'From outside', value: 'can’t start a conversation, unless a port is forwarded' },
      ],
      events: [
        ...msg({
          tag: 'REPLY',
          from: 'web',
          to: 'router',
          proto: 'IP',
          via: 'IP',
          kind: 'response',
          time: '0.031s',
          src: EXAMPLE,
          dst: PUBLIC,
          size: '60 B',
          sum: 'A reply for 198.51.100.23, passed back router by router.',
          info: 'IPv4 reply, reaches your router with TTL 61',
          rows: [{ key: '4', cells: ['Reply, at your router', EXAMPLE, PUBLIC, '61'] }],
        }),
        ...msg({
          tag: 'REPLY',
          from: 'router',
          to: 'laptop',
          proto: 'IP',
          via: 'Ethernet',
          kind: 'response',
          time: '0.032s',
          src: EXAMPLE,
          dst: '192.168.1.100',
          size: '60 B',
          sum: 'The router swaps the address back: this is for 192.168.1.100.',
          info: 'NAT: 198.51.100.23 → 192.168.1.100, TTL 60',
          st: 'Reply received',
          done: true,
          rows: [{ key: '5', cells: ['Reply, at the laptop', EXAMPLE, '192.168.1.100', '60'] }],
        }),
      ],
    },
  ],
  learn: {
    lead: 'One packet left your laptop with two addresses on it. Your router relabelled it once, and every router on the way passed it along.',
    terms: [
      { idea: 'The number that says where a device is', name: 'IP address' },
      { idea: 'Is it on my network, or do I send it out?', name: 'Routing decision' },
      { idea: 'The way out of your network: your router', name: 'Default gateway' },
      { idea: 'The hardware number of a network card', name: 'MAC address' },
      { idea: '“Who has this address?”', name: 'ARP' },
      { idea: 'The label on the front of the packet', name: 'IP header' },
      { idea: 'The hop counter that stops loops', name: 'TTL' },
      { idea: 'Swapping a private address for a public one', name: 'NAT' },
      { idea: 'Passing a packet on to the next router', name: 'Forwarding' },
    ],
    pattern: {
      names: ['Routing Decision', 'ARP Resolution', 'Encapsulation', 'NAT', 'Forwarding'],
      note: 'Every packet you send leaves this way. The routers on the way only forward.',
    },
    why: 'IP is the one thing every network on the internet agrees on. Wi-Fi, fibre and mobile networks all work differently underneath, but they all carry IP packets, so a packet can cross all of them to reach any address.',
    deep: 'IP is best effort: it promises neither delivery nor order; TCP adds those. IPv4 has about 4.3 billion addresses, not enough for every device, which is why NAT exists. IPv6 uses 128-bit addresses (like 2001:db8::80), enough for every device to have its own public address, with no ARP and usually no NAT. A prefix such as 192.168.1.0/24 names a whole network; the Subnetting lesson goes further.',
    facts: [
      { label: 'IPv4', value: '32 bits, like 203.0.113.80' },
      { label: 'IPv6', value: '128 bits, like 2001:db8::80' },
      { label: 'Private ranges', value: '10/8, 172.16/12, 192.168/16' },
      { label: 'Header', value: '20 bytes (IPv4), 40 (IPv6)' },
      { label: 'Defined in', value: 'RFC 791 (IPv4), RFC 8200 (IPv6)' },
    ],
  },
  practice: [
    {
      id: 'source-swap',
      prompt: 'Why does your router change the packet’s source address?',
      options: [
        {
          text: 'To hide what’s inside the packet.',
          feedback: 'Not quite. NAT doesn’t encrypt anything. It swaps a private address for a public one.',
        },
        {
          text: 'Private addresses can’t be reached from the internet, so it puts its public one on.',
          feedback: 'Right. That’s NAT, and the router remembers the swap for the reply.',
        },
        {
          text: 'Every router changes it at every hop.',
          feedback: 'Not quite. Routers on the way leave the addresses alone and only change the TTL. Your router swaps it once.',
        },
      ],
      answer: 1,
    },
    {
      id: 'loops',
      prompt: 'What stops a packet from going round in circles for ever?',
      options: [
        { text: 'Its TTL: every router takes 1 off, and at 0 it’s dropped.', feedback: 'Yes. That hop counter is the TTL.' },
        {
          text: 'The server sends it back.',
          feedback: 'Not quite. A looping packet never reaches the server. Its TTL runs out and a router drops it.',
        },
        { text: 'ARP.', feedback: 'Not quite. ARP only finds hardware addresses on your own network. The TTL stops loops.' },
      ],
      answer: 0,
    },
  ],
};

export default ip;
