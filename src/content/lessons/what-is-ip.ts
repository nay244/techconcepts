import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * IP, lesson 5 of How the Internet Works’ 14. One packet to example.net: the laptop sees it isn’t local, finds the
 * router’s hardware address with ARP, labels the packet and hands it over. The router swaps the private source for
 * its public address (NAT), the routers on the way pass it along, and the reply comes back the same way.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), changed only where a source
 * does not state them. The addresses (RFC 1918 and RFC 5737), the two MAC addresses (00:00:5E:00:53:10 and
 * 00:00:5E:00:53:01, from the documentation range of RFC 9542, which obsoletes RFC 7042), example.net, 2001:db8::80
 * (RFC 3849) and the clock times are example data. No message size is shown: no source states one. The provider's
 * router has no address in IP's own messages; the Sequence view gives it 198.51.100.1, as ICMP finds it at hop 2 on
 * the same map. The analogy (the parcel) cites nothing.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 791 defines IPv4, so its citations are the defining standard. */
const ip4 = (section: string) => rfc('rfc-791', section, true);
/** RFC 8200 defines IPv6. */
const ip6 = (section: string) => rfc('rfc-8200', section, true);
/** RFC 1812 sets the requirements for IPv4 routers, so it defines what a router does with a packet. */
const router = (section: string) => rfc('rfc-1812', section, true);
const rfc1918 = (section: string) => rfc('rfc-1918', section, true);
const rfc3022 = (section: string) => rfc('rfc-3022', section);
const rfc4787 = (section: string) => rfc('rfc-4787', section);

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page the passage is on. */
const host = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });

/** RFC 826, 894 and 792 have no section ids, so each section is cited by a text fragment that starts in it. */
const textFragment = (source: string, file: string, section: string, fragment: string) =>
  cite(source, section, { url: `https://www.rfc-editor.org/rfc/${file}.html#:~:text=${fragment}`, defining: true });
const arp = (section: string, fragment: string) => textFragment('rfc-826', 'rfc826', section, fragment);
const ARP_ABSTRACT = arp('Abstract', 'Presented%20here%20is%20a%20protocol');
const ARP_GENERATION = arp('Packet Generation', 'As%20a%20packet%20is%20sent%20down%20through%20the%20network%20layers');
const ARP_RECEPTION = arp('Packet Reception', 'Send%20the%20packet%20to%20the');
const ARP_EXAMPLE = arp('An Example', 'and%20broadcasts%20this%20packet%20to%20everybody');
const ETHERNET_FRAME = textFragment('rfc-894', 'rfc894', 'Frame Format', 'IP%20datagrams%20are%20transmitted%20in%20standard%20Ethernet%20frames');
const ETHERNET_BROADCAST = textFragment('rfc-894', 'rfc894', 'Address Mappings', 'It%20should%20also%20use%20ARP');
const ICMP_DF = textFragment('rfc-792', 'rfc792', 'Destination Unreachable Message', 'Another%20case%20is%20when%20a%20datagram%20must%20be%20fragmented');

const NAT_ABSTRACT = cite('rfc-3022', 'Abstract', { url: 'https://www.rfc-editor.org/rfc/rfc3022.html#abstract' });

const IANA_TTL = cite('iana-ip-parameters', 'IP Time to Live Parameter', {
  url: 'https://www.iana.org/assignments/ip-parameters/ip-parameters.xhtml#ip-parameters-2',
  defining: true,
});
const IANA_PROTOCOLS = cite('iana-protocol-numbers', 'Assigned Internet Protocol Numbers', {
  url: 'https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml#protocol-numbers-1',
  defining: true,
});

/** No standard puts IP at an OSI layer (RFC 1122 says only that IP was the model for OSI's connectionless network protocol), so the badge rests on two vendors. */
const CLOUDFLARE = 'https://developers.cloudflare.com/fundamentals/reference/network-layers/';
const MICROSOFT = 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model';
const OSI_L3 = [
  cite('cloudflare-network-layers', 'Network Layers', { url: `${CLOUDFLARE}#:~:text=3%20Network%20layer` }),
  cite('microsoft-osi', 'Transport layer', { url: `${MICROSOFT}#transport-layer` }),
];

/** Microsoft's and Cisco's pages on the commands, each a vendor's own documentation, so neither is marked defining. */
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
const MS_ARP = cite('microsoft-arp', 'Introduction', {
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp#:~:text=The%20arp%20command%20displays%20and%20modifies',
});
const CISCO_DAI = cite('cisco-dai', 'Understanding Dynamic ARP Inspection', {
  url: 'https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-18/configuration_guide/sec/b_1718_sec_9300_cg/configuring_dynamic_arp_inspection.html#:~:text=Host%20B%20generates%20a%20broadcast%20message',
});

// ---------------------------------------------------------------- events

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

const mockup = messagesFor(written);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

const HOOK_TRACES = ['fact-label', 'term-forwarding', 'fact-hop', 'why-1', 'why-2'];

export default defineLesson({
  slug: 'what-is-ip',
  title: 'IP',
  subtitle: 'Addresses and routes',
  level: 'beginner',
  certTags: [],
  summary:
    'IP puts an address on every packet and lets routers pass it along, hop by hop, toward where it’s going. It’s what makes many separate networks act like one internet.',
  figure: 'net-map',
  backing: { traces: ['term-ip', ...HOOK_TRACES] },
  units: [
    {
      id: 'ip',
      name: 'IP',
      fullName: 'Internet Protocol',
      purpose: 'Addresses and routes',
      group: 'core',
      osi: { layers: [3], cite: OSI_L3 },
      backing: { traces: ['fact-defined', 'term-ip', 'term-forwarding', 'fact-hop'] },
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
        backing: {
          traces: ['lead-1', 'term-forwarding', 'term-gateway', 'term-routing', 'fact-hop', 'fact-nat', 'fact-arp', 'fact-label', 'fact-ttl'],
        },
      },
      overview: {
        hook: 'IP puts an address on every packet and lets routers pass it along, hop by hop, toward where it’s going. It’s what makes many separate networks act like one internet.',
        hookBacking: { traces: HOOK_TRACES },
        description:
          'It works like posting a parcel. You write the address on it and hand it to your local post office, which passes it to a bigger sorting office, and so on. Nobody on the way knows the whole route; each one only knows which way to send it next. Here your laptop sends one packet to example.net and gets a reply.',
        backing: { analogy: true },
        facts: [
          { label: 'Used for', value: 'every packet on the internet', backing: { traces: ['why-1'] } },
          { label: 'Addresses', value: 'IPv4 (like 203.0.113.80) and IPv6', backing: { traces: ['fact-ipv4', 'fact-ipv6'] } },
          { label: 'Each hop', value: 'a router picks the next one', backing: { traces: ['fact-hop'] } },
          { label: 'Promises', value: 'none: best effort', backing: { traces: ['deep-1'] } },
          { label: 'OSI layer', value: '3, network', backing: { traces: ['fact-osi'] } },
          { label: 'This example', value: '192.168.1.100 to 203.0.113.80', backing: { example: true } },
        ],
      },
      steps: [
        {
          id: 'routing-decision',
          title: 'Routing Decision',
          sub: 'Near or far?',
          narrative:
            'Your laptop has a packet for 203.0.113.80. First question: is that address on my own network? The laptop’s network is your home, 192.168.1.something. 203.0.113.80 isn’t, so the laptop can’t deliver it itself. The rule for anything outside is simple: send it to the **default gateway**, your router. Making that choice is the **routing decision**.',
          deep: [
            {
              text: 'The laptop compares the destination with its own address and subnet mask: 192.168.1.100/24 covers 192.168.1.0 to 192.168.1.255. Anything outside matches only the default route, 0.0.0.0/0, whose next hop is the gateway, 192.168.1.1. You can see the table with route print on Windows.',
              cite: [
                host('3.3.1.1', 47),
                host('3.3.1.2', 48),
                rfc('rfc-4632', '3.1', true),
                rfc('rfc-4632', '5.1', true),
                MS_ROUTE_PARAMS,
                ...ROUTE_PRINT,
              ],
            },
          ],
          facts: [
            { label: 'Destination', value: '203.0.113.80', backing: { example: true } },
            { label: 'My network', value: '192.168.1.0/24', backing: { traces: ['deep-4'] } },
            { label: 'Same network?', value: 'no', backing: { traces: ['term-routing'] } },
            { label: 'So send it to', value: 'the default gateway, 192.168.1.1', backing: { traces: ['term-gateway'] } },
          ],
          status: 'Not local: send to the router',
          idle: 'Nothing on the network yet. The laptop is working out where to send the packet.',
          events: [],
          backing: { traces: ['term-routing', 'term-gateway', 'deep-4'] },
        },
        {
          id: 'arp-resolution',
          title: 'ARP Resolution',
          sub: 'Find the router’s hardware address',
          narrative:
            'On your home network, devices don’t deliver by IP address. They use each other’s **MAC address**, a hardware number built into every network card. The laptop knows the router is 192.168.1.1, but not its MAC. So it calls out to the whole house, “Who has 192.168.1.1?”, and the router answers, “That’s me, at 00:00:5E:00:53:01.” That’s **ARP**, and a call to everyone is a **broadcast**.',
          deep: [
            {
              text: 'The ARP request goes to the broadcast MAC address ff:ff:ff:ff:ff:ff, so every device on the network reads it, and only the owner of 192.168.1.1 replies, directly. The laptop keeps the answer in its ARP cache for a short while. IPv6 does the same job with Neighbor Discovery. Forged ARP replies (ARP spoofing) can trick devices into sending their traffic to an attacker.',
              cite: [
                ETHERNET_BROADCAST,
                ARP_GENERATION,
                ARP_EXAMPLE,
                CISCO_DAI,
                host('2.3.2.1', 22),
                host('2.3.2.1', 24),
                MS_ARP,
                rfc('rfc-4861', '1', true),
                rfc('rfc-4861', '3.1', true),
                rfc('rfc-5227', '5'),
              ],
            },
          ],
          facts: [
            { label: 'Asks', value: 'who has 192.168.1.1?', backing: { traces: ['fact-arp'] } },
            { label: 'Sent to', value: 'everyone: ff:ff:ff:ff:ff:ff', backing: { traces: ['fact-arp'] } },
            { label: 'Answer', value: '00:00:5E:00:53:01', backing: { traces: ['fact-arp'] } },
            { label: 'Kept in', value: 'the ARP cache, for a short while', backing: { traces: ['fact-arp'] } },
          ],
          events: [
            ...msgOf(
              'term-arp',
              'fact-arp',
              'fact-frame',
            )({
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
              size: '—',
              sum: 'Everyone: who has 192.168.1.1?',
              info: 'ARP: who has 192.168.1.1? Tell 192.168.1.100',
              st: 'Finding the router',
            }),
            ...msgOf(
              'term-arp',
              'fact-arp',
              'fact-frame',
            )({
              tag: 'IS AT',
              from: 'router',
              to: 'laptop',
              proto: 'ARP',
              via: 'Ethernet',
              kind: 'response',
              time: '0.002s',
              src: ROUTER_MAC,
              dst: LAPTOP_MAC,
              size: '—',
              sum: 'That’s me. My hardware address is 00:00:5E:00:53:01.',
              info: 'ARP: 192.168.1.1 is at 00:00:5E:00:53:01',
              st: 'Found the router',
              known: true,
            }),
          ],
          backing: { traces: ['term-mac', 'term-arp', 'fact-arp'] },
        },
        {
          id: 'ip-encapsulation',
          title: 'IP Encapsulation',
          sub: 'Label the packet',
          narrative:
            'The packet carries an **IP header** on the front, a label with the **source address** (192.168.1.100), the **destination address** (203.0.113.80) and a **TTL**, a hop counter that starts at 64. Now the laptop wraps all that in a frame addressed to the router’s MAC, and sends it. Wrapping one layer inside another like this is **encapsulation**.',
          deep: [
            {
              text: 'An IPv4 header is 20 bytes: version, header length, total length, an ID and fragment fields, TTL, the protocol inside (6 TCP, 17 UDP, 1 ICMP), a checksum, and the two addresses. The Ethernet frame around it carries MAC addresses, which change at every hop; the IP addresses inside stay the same end to end, unless NAT changes them. A packet too big for a link is split up (fragmented), or dropped with an ICMP note if it’s marked Don’t Fragment.',
              cite: [
                ip4('3.1'),
                IANA_PROTOCOLS,
                ip4('2.2'),
                router('5.2.1.2'),
                rfc3022('1'),
                ip4('1.1'),
                ip4('2.3'),
                ICMP_DF,
              ],
            },
          ],
          facts: [
            { label: 'Source', value: '192.168.1.100', backing: { traces: ['fact-label'] } },
            { label: 'Destination', value: '203.0.113.80', backing: { traces: ['fact-label'] } },
            { label: 'TTL', value: '64', backing: { traces: ['fact-ttl'] } },
            { label: 'Frame to', value: '00:00:5E:00:53:01, the router', backing: { traces: ['fact-frame'] } },
          ],
          events: [
            ...msgOf(
              'term-ip',
              'term-header',
              'fact-ipv4',
              'fact-label',
              'fact-ttl',
              'fact-frame',
            )({
              tag: 'PACKET',
              from: 'laptop',
              to: 'router',
              proto: 'IP',
              via: 'Ethernet',
              kind: 'request',
              time: '0.003s',
              src: '192.168.1.100',
              dst: EXAMPLE,
              size: '—',
              sum: 'To 203.0.113.80, from 192.168.1.100, TTL 64. Handed to the router.',
              info: 'IPv4, TTL 64, protocol TCP',
              st: 'Packet sent to the router',
              known: true,
              rows: [{ key: '1', cells: ['Leaving the laptop', '192.168.1.100', EXAMPLE, '64'] }],
            }),
          ],
          backing: { traces: ['term-header', 'term-ttl', 'fact-label', 'fact-ttl', 'fact-frame', 'term-encapsulation'] },
        },
        {
          id: 'nat-and-forwarding',
          title: 'NAT and Forwarding',
          sub: 'Swap the address, pass it on',
          narrative:
            'Your router has a problem: 192.168.1.100 is a **private address**. Many homes use the same numbers, so the internet couldn’t send anything back to it. The router swaps it for its own **public address**, 198.51.100.23, and notes the swap so the reply can find its way home. That’s **NAT**. It takes 1 off the TTL and passes the packet on. Every router after it does the same: read the destination, pick the next router, pass it on. That’s **forwarding**.',
          deep: [
            {
              text: 'The private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. Home routers use port address translation: many devices share one public address and are told apart by port numbers in the NAT table. Each router picks the next hop by the longest matching prefix in its routing table; between providers, routes are learned with BGP. A packet whose TTL reaches 0 is dropped, which stops it looping for ever.',
              cite: [
                rfc1918('3'),
                rfc4787('3'),
                rfc3022('1'),
                rfc3022('2.2'),
                router('5.2.4.3'),
                rfc('rfc-4632', '5.1', true),
                rfc('rfc-4271', '1', true),
                router('5.3.1'),
                host('3.2.1.7', 34),
              ],
            },
          ],
          facts: [
            { label: 'Private source', value: '192.168.1.100', backing: { traces: ['fact-private', 'fact-nat'] } },
            { label: 'Swapped for', value: '198.51.100.23, the router’s public address', backing: { traces: ['fact-nat'] } },
            { label: 'Each hop', value: 'TTL − 1, then pass it on', backing: { traces: ['fact-ttl', 'fact-hop'] } },
            { label: 'Arrives with', value: 'TTL 60', backing: { traces: ['fact-ttl'] } },
          ],
          events: [
            ...msgOf(
              'term-ip',
              'term-nat',
              'fact-nat',
              'fact-ttl',
            )({
              tag: 'PACKET',
              from: 'router',
              to: 'isp',
              proto: 'IP',
              via: 'IP',
              kind: 'request',
              time: '0.004s',
              src: PUBLIC,
              dst: EXAMPLE,
              size: '—',
              sum: 'Same packet, new source: 198.51.100.23. TTL now 63.',
              info: 'NAT: 192.168.1.100 → 198.51.100.23, TTL 63',
              st: 'Router swapped the address',
              known: true,
              rows: [{ key: '2', cells: ['Leaving your router', PUBLIC, EXAMPLE, '63'] }],
            }),
            ...msgOf(
              'term-ip',
              'term-forwarding',
              'fact-hop',
              'fact-ttl',
            )({
              tag: 'PACKET',
              from: 'isp',
              to: 'web',
              proto: 'IP',
              via: 'IP',
              kind: 'request',
              time: '0.016s',
              src: PUBLIC,
              dst: EXAMPLE,
              size: '—',
              sum: 'Router by router to example.net. Each one takes 1 off the TTL.',
              info: 'Forwarded 3 more hops, arrives with TTL 60',
              st: 'Delivered to example.net',
              known: true,
              rows: [{ key: '3', cells: ['Arriving at example.net', PUBLIC, EXAMPLE, '60'] }],
            }),
          ],
          backing: { traces: ['fact-private', 'term-nat', 'fact-nat', 'fact-ttl', 'fact-hop', 'term-forwarding'] },
        },
        {
          id: 'return-routing',
          title: 'Return Routing',
          sub: 'Back, hop by hop',
          narrative:
            'example.net replies to the address it saw, 198.51.100.23, which is your router. The routers pass the reply back hop by hop. When it reaches your router, the router checks its notes, sees this reply belongs to your laptop, and swaps the destination back to 192.168.1.100. The laptop gets its answer and never knew its address was swapped.',
          deep: [
            {
              text: 'The reply’s TTL starts fresh, at the server’s own default (often 64). The way back doesn’t have to match the way out: each direction is routed on its own. NAT is also why a device at home can’t easily be reached from outside, unless the router forwards a port to it.',
              cite: [
                ip4('1.4'),
                IANA_TTL,
                rfc('rfc-6250', '3.1.1'),
                rfc('rfc-3704', '2.2'),
                rfc3022('2'),
                rfc3022('2.2'),
                rfc('rfc-4864', '5.3'),
              ],
            },
          ],
          facts: [
            { label: 'Reply to', value: '198.51.100.23', backing: { traces: ['fact-reply'] } },
            { label: 'Router swaps it to', value: '192.168.1.100', backing: { traces: ['fact-nat'] } },
            { label: 'Path back', value: 'can differ from the way out', backing: { traces: ['fact-reply'] } },
            { label: 'From outside', value: 'can’t start a conversation, unless a port is forwarded', backing: { traces: ['fact-outside'] } },
          ],
          events: [
            ...msgOf(
              'term-ip',
              'fact-ipv4',
              'fact-reply',
              'fact-ttl',
            )({
              tag: 'REPLY',
              from: 'web',
              to: 'router',
              proto: 'IP',
              via: 'IP',
              kind: 'response',
              time: '0.031s',
              src: EXAMPLE,
              dst: PUBLIC,
              size: '—',
              sum: 'A reply for 198.51.100.23, passed back router by router.',
              info: 'IPv4 reply, reaches your router with TTL 61',
              rows: [{ key: '4', cells: ['Reply, at your router', EXAMPLE, PUBLIC, '61'] }],
            }),
            ...msgOf(
              'term-ip',
              'fact-nat',
              'fact-ttl',
              'fact-frame',
              'fact-reply',
            )({
              tag: 'REPLY',
              from: 'router',
              to: 'laptop',
              proto: 'IP',
              via: 'Ethernet',
              kind: 'response',
              time: '0.032s',
              src: EXAMPLE,
              dst: '192.168.1.100',
              size: '—',
              sum: 'The router swaps the address back: this is for 192.168.1.100.',
              info: 'NAT: 198.51.100.23 → 192.168.1.100, TTL 60',
              st: 'Reply received',
              done: true,
              rows: [{ key: '5', cells: ['Reply, at the laptop', EXAMPLE, '192.168.1.100', '60'] }],
            }),
          ],
          backing: { traces: ['fact-reply', 'fact-nat', 'term-nat', 'term-forwarding', 'fact-outside'] },
        },
      ],
      learn: {
        lead: [
          { id: 'lead-1', text: 'One packet left your laptop with two addresses on it.', cite: [ip4('3.1')] },
          {
            id: 'lead-2',
            text: 'Your router relabelled it once, and every router on the way passed it along.',
            cite: [rfc3022('2.1'), rfc4787('3'), router('5.2.1.2')],
          },
        ],
        terms: [
          { id: 'term-ip', idea: 'The number that says where a device is', name: 'IP address', cite: [ip4('2.3')] },
          {
            id: 'term-routing',
            idea: 'Is it on my network, or do I send it out?',
            name: 'Routing decision',
            cite: [host('3.3.1.1', 47), ip4('1.4')],
          },
          {
            id: 'term-gateway',
            idea: 'The way out of your network: your router',
            name: 'Default gateway',
            cite: [host('3.3.1.2', 48), MS_ROUTE_PARAMS],
          },
          {
            id: 'term-mac',
            idea: 'The hardware number of a network card',
            name: 'MAC address',
            cite: [rfc('rfc-9724', '2.1'), ARP_ABSTRACT],
          },
          { id: 'term-arp', idea: '“Who has this address?”', name: 'ARP', cite: [ARP_ABSTRACT, ARP_GENERATION] },
          { id: 'term-header', idea: 'The label on the front of the packet', name: 'IP header', cite: [ip4('2.2'), ip4('1.4')] },
          {
            id: 'term-ttl',
            idea: 'The hop counter that stops loops',
            name: 'TTL',
            cite: [host('3.2.1.7', 34), router('5.3.1')],
          },
          {
            id: 'term-nat',
            idea: 'Swapping a private address for a public one',
            name: 'NAT',
            cite: [rfc3022('2.1'), rfc4787('3'), rfc1918('3')],
          },
          {
            id: 'term-forwarding',
            idea: 'Passing a packet on to the next router',
            name: 'Forwarding',
            cite: [ip4('2.4'), router('5.2.1.2')],
          },
          {
            id: 'term-encapsulation',
            idea: 'Wrapping the packet in a frame for the next link',
            name: 'Encapsulation',
            cite: [router('5.2.1.2'), ip4('2.2')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Routing Decision', 'ARP Resolution', 'Encapsulation', 'NAT', 'Forwarding'],
          note: 'An IPv4 packet you send to the internet leaves this way; ARP is skipped while the answer is in the cache. The routers on the way only forward.',
          cite: [host('3.3.1', 47), ARP_GENERATION, host('2.3.2.1', 22), router('5.2.1.2'), rfc3022('2.1'), rfc4787('3')],
        },
        why: [
          {
            id: 'why-1',
            text: 'IP is the one thing every network on the internet agrees on.',
            cite: [host('1.1.3', 10), ip4('1.4'), host('1.1.2', 7)],
          },
          {
            id: 'why-2',
            text: 'Wi-Fi, Ethernet and mobile networks all work differently underneath, but they all carry IP packets, so a packet can cross all of them to reach any public address.',
            cite: [
              host('1.1.3', 10),
              ip4('1.3'),
              rfc('rfc-9724', '2.1'),
              rfc('rfc-9724', '1'),
              ETHERNET_FRAME,
              rfc('rfc-7066', '1'),
              rfc1918('3'),
            ],
          },
        ],
        deep: [
          {
            id: 'deep-1',
            text: 'IP is best effort: it promises neither delivery nor order; TCP adds those.',
            cite: [ip4('1.4'), rfc('rfc-6250', '2'), host('1.1.3', 10), rfc('rfc-9293', '2.2', true)],
          },
          {
            id: 'deep-2',
            text: 'IPv4 has about 4.3 billion addresses, not enough for every device, which is why NAT exists.',
            cite: [ip4('2.3'), rfc('rfc-4632', '3.1', true), rfc('rfc-4864', '2.6'), rfc('rfc-4864', '1'), rfc1918('4')],
          },
          {
            id: 'deep-3',
            text: 'IPv6 uses 128-bit addresses (like 2001:db8::80), enough for every device to have its own public address, with no ARP and usually no NAT.',
            cite: [ip6('1'), rfc('rfc-4864', '4.6'), rfc('rfc-4864', '1'), rfc('rfc-4861', '3.1', true)],
          },
          {
            id: 'deep-4',
            text: 'A prefix such as 192.168.1.0/24 names a whole network; the Subnetting lesson goes further.',
            cite: [rfc('rfc-4632', '3.1', true)],
          },
        ],
        facts: [
          { id: 'fact-ipv4', label: 'IPv4', value: '32 bits, like 203.0.113.80', cite: [ip4('2.3')] },
          { id: 'fact-ipv6', label: 'IPv6', value: '128 bits, like 2001:db8::80', cite: [ip6('1')] },
          { id: 'fact-private', label: 'Private ranges', value: '10/8, 172.16/12, 192.168/16', cite: [rfc1918('3')] },
          { id: 'fact-header', label: 'Header', value: '20 bytes (IPv4), 40 (IPv6)', cite: [ip4('3.1'), ip6('1'), ip6('8.3')] },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 791 (IPv4), RFC 8200 (IPv6)', cite: [ip4('3.1'), ip6('1')] },
          { id: 'fact-osi', label: 'OSI layer', value: '3, network', cite: OSI_L3 },
          {
            id: 'fact-label',
            label: 'On the label',
            value: 'the source address, the destination address, a TTL, and the protocol inside, such as TCP (6), UDP (17) or ICMP (1)',
            cite: [ip4('3.1'), IANA_PROTOCOLS],
          },
          {
            id: 'fact-ttl',
            label: 'TTL',
            value: 'set by the sender, 64 by default; each router takes 1 off, and at 0 the packet is dropped',
            cite: [ip4('1.4'), IANA_TTL, router('5.3.1')],
          },
          {
            id: 'fact-arp',
            label: 'ARP',
            value:
              'asks everyone on the home network at once, at the broadcast address ff:ff:ff:ff:ff:ff, “who has this address?”, and gives its own; only the owner replies with its MAC address, straight back, and the answer is kept in the ARP cache for a short while',
            cite: [ARP_GENERATION, ARP_RECEPTION, ARP_EXAMPLE, ETHERNET_BROADCAST, host('2.3.2.1', 22), host('2.3.2.1', 24), MS_ARP, CISCO_DAI],
          },
          {
            id: 'fact-frame',
            label: 'On each link',
            value: 'the packet travels in a frame, such as an Ethernet or Wi-Fi frame, addressed to the next device’s MAC address; each router puts it in a new frame',
            cite: [ETHERNET_FRAME, rfc('rfc-9724', '2.1'), ip4('2.2'), router('5.2.1.2')],
          },
          {
            id: 'fact-hop',
            label: 'Each router',
            value: 'reads the destination, picks the next router from its routing table, and passes the packet on; after your router, the next is your provider’s',
            cite: [router('5.2.1.2'), rfc3022('2.2'), rfc('rfc-3704', '2.2')],
          },
          {
            id: 'fact-nat',
            label: 'NAT at home',
            value:
              'many homes use the same private addresses, which the internet doesn’t carry, so your router puts its own public address on each packet going out, notes the swap, and swaps it back on the reply',
            cite: [rfc1918('3'), rfc3022('2.1'), rfc3022('2.2'), rfc4787('3')],
          },
          {
            id: 'fact-reply',
            label: 'The reply',
            value: 'goes to the public address the server saw, with a TTL the server sets, and is routed on its own, so its path can differ from the way out',
            cite: [rfc4787('3'), rfc3022('2.2'), ip4('1.4'), rfc('rfc-6250', '3.1.1'), rfc('rfc-3704', '2.2')],
          },
          {
            id: 'fact-outside',
            label: 'From outside',
            value: 'a device at home can’t be reached first, unless the router forwards a port to it',
            cite: [rfc3022('2'), rfc3022('2.2'), rfc('rfc-6250', '3.1.1')],
          },
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
              cite: [NAT_ABSTRACT, rfc3022('2.1'), rfc4787('3')],
            },
            {
              text: 'Private addresses can’t be reached from the internet, so it puts its public one on.',
              feedback: 'Right. That’s NAT, and the router remembers the swap for the reply.',
              cite: [rfc1918('3'), rfc3022('2.1'), rfc3022('2.2'), rfc4787('3')],
            },
            {
              text: 'Every router changes it at every hop.',
              feedback: 'Not quite. Routers on the way leave the addresses alone; they change the TTL, and the checksum that covers it. Your router swaps it once.',
              cite: [rfc3022('1'), ip4('2.2'), ip4('3.1'), router('5.3.1'), rfc3022('2.1'), rfc4787('3')],
            },
          ],
          answer: 1,
        },
        {
          id: 'loops',
          prompt: 'What stops a packet from going round in circles for ever?',
          options: [
            {
              text: 'Its TTL: every router takes 1 off, and at 0 it’s dropped.',
              feedback: 'Yes. That hop counter is the TTL.',
              cite: [router('5.3.1'), host('3.2.1.7', 34)],
            },
            {
              text: 'The server sends it back.',
              feedback: 'Not quite. A looping packet never reaches the server. Its TTL runs out and a router drops it.',
              cite: [router('5.3.1'), host('3.2.1.7', 34)],
            },
            {
              text: 'ARP.',
              feedback: 'Not quite. ARP only finds hardware addresses on your own network. The TTL stops loops.',
              cite: [ARP_ABSTRACT, ARP_GENERATION, host('3.2.1.7', 34)],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
