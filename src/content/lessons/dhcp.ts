import { formatTime } from '../../lib/format';
import { defineLesson } from '../define';
import type { MessageEvent, MessageKind, TableEvent } from '../schema';
import { cite } from '../sources';

/**
 * DHCP, lesson 9 of 19. A laptop joins a home Wi-Fi network and gets its
 * settings from the router in four messages (RFC 2131), keeps them for a lease
 * and renews at half-time (section 4.4.5). The phone on the same Wi-Fi hears
 * the broadcasts and ignores them.
 *
 * The words are the approved mockup's (lesson-v3.html), changed only where a source does not state them. The
 * addresses (RFC 1918), the MAC addresses (the documentation range 00:00:5E:00:53:xx), the 24-hour lease and its 12
 * hours, and the times in the log are example data, and the scene's events carry them beside the claims they trace
 * to. No message size is shown: no source states one. The hotel desk is an analogy and cites nothing. No source
 * places DHCP at an OSI layer, so the badge spans.
 */

// ---------------------------------------------------------------- citations

/** A citation of one numbered section of an RFC, optionally marked as the defining standard. */
const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
/** RFC 2131 defines DHCP, and RFC 2132 its options, so their citations are the defining standard. */
const dhcp = (section: string) => rfc('rfc-2131', section, true);
const opt = (section: string) => rfc('rfc-2132', section, true);

/** RFC 1122 has no ids below its top-level sections, so its section 3.2.1.3 is cited by the page it starts on (30). */
const RFC1122_ADDRESSES = cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-30' });

/** The same section, marked as the defining standard for the term Broadcast: RFC 1122 defines the IP broadcast addresses. */
const RFC1122_BROADCAST = cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-30', defining: true });

/** RFC 894 maps the broadcast Internet address to the broadcast Ethernet address, under "Address Mappings". */
const ETHERNET_BROADCAST = cite('rfc-894', 'Address Mappings', { url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=The%20broadcast%20Internet%20address', defining: true });

const abstractOf = (source: string, number: string, defining = false) =>
  cite(source, 'Abstract', { url: `https://www.rfc-editor.org/rfc/rfc${number}.html#abstract`, ...(defining ? { defining: true as const } : {}) });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const MS_NETSET = vendor(
  'microsoft-network-settings',
  'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows',
  'Change TCP/IP Settings',
  'IP%20address%20settings%20and%20DNS%20server%20address%20setting%20are%20set%20automatically',
);
const GOOGLE_LAN = vendor(
  'google-nest-lan-ip',
  'https://support.google.com/googlehome/answer/7571856',
  'Set a custom LAN IP',
  'customize%20your%20router%20LAN%20address',
);

const MS_TROUBLE_URL = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue';
const msTrouble = (text: string) => vendor('microsoft-dhcp-troubleshoot', MS_TROUBLE_URL, 'More information', text);
const MS_DORA = msTrouble('Broadcast-based%20DORA');
const MS_PORTS = msTrouble('All%20communication%20is%20done%20on%20UDP%20ports%2067%20and%2068');
const MS_T1 = msTrouble('renew%20the%20IP%20address%20assignment%20after%2050%20percent');
const MS_T2 = msTrouble('sent%20after%2087.5%20percent');

const MS_BASICS_URL = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/dynamic-host-configuration-protocol-basics';
const msBasics = (section: string, text: string) => vendor('microsoft-dhcp-basics', MS_BASICS_URL, section, text);
const MS_BASICS_MAC = msBasics('DHCPDISCOVER', 'identifies%20the%20client%20in%20two%20places');
const MS_BASICS_OFFER = msBasics('DHCPOFFER', 'Note%20the%20CHADDR%20field');
const MS_BASICS_ZERO = msBasics('DHCPREQUEST', 'The%20client%20retains%200.0.0.0');

const MS_SERVER_URL = 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top';
const msServer = (text: string) => vendor('microsoft-dhcp-server', MS_SERVER_URL, 'Why use DHCP?', text);
const MS_MANUAL = msServer('Without%20DHCP,%20IP%20addresses%20for%20new%20computers');
const MS_DATABASE = msServer('The%20DHCP%20server%20stores%20the%20configuration%20information');

const MS_TRAINING_URL =
  'https://learn.microsoft.com/en-us/training/modules/deploy-manage-dynamic-host-configuration-protocol/2-use-dynamic-host-configuration-protocol-simplify-ip-configuration';
const MS_TRAINING_UNICAST = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'DHCP lease renewal', 'sends%20a%20unicast%20DHCPREQUEST');
const MS_TRAINING_RESET = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'DHCP lease renewal', 'If%20renewal%20is%20successful');

const MS_IPCONFIG_RENEW = vendor(
  'microsoft-ipconfig',
  'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig',
  'Parameters',
  'Renews%20DHCP%20configuration%20for%20all%20adapters',
);

const CISCO_URL = 'https://www.cisco.com/c/en/us/support/docs/ip/dynamic-address-allocation-resolution/27470-100.html';
const cisco = (section: string, text: string) => vendor('cisco-dhcp-troubleshoot', CISCO_URL, section, text);
const CISCO_OFFER_OPTIONS = cisco('DHCPOFFER', 'The%20subnet%20mask%20and%20default%20gateway%20are%20specified');
const CISCO_OFFER_CHADDR = cisco('DHCPOFFER', 'includes%20the%20client%20hardware%20address%20in%20the%20chaddr%20field');
const CISCO_LEASE_DB = cisco('DHCPACK', 'Meanwhile,%20the%20DHCP%20server%20stores%20the%20lease');
const CISCO_RENEW = cisco('Renew the Lease', 'When%20one%20half%20of%20the%20lease%20time');
const CISCO_REBIND = cisco('Renew the Lease', 'it%20attempts%20to%20renew%20the%20address%20from%20any%20DHCP%20server');
const CISCO_IPCONFIG = cisco('C. Verify Issue as a Startup Problem', 'Issue%20the%20command%20ipconfig/renew');

const CANONICAL_URL = 'https://canonical.com/blog/basic-dhcp-concepts';
const CANONICAL_DORA = vendor('canonical-dhcp-concepts', CANONICAL_URL, 'The network version of DORA', 'The%20DHCP%20negotiation%20process%20is%20known%20as%20DORA');
const CANONICAL_IGNORE = vendor('canonical-dhcp-concepts', CANONICAL_URL, 'The network version of DORA', 'Every%20machine%20on%20the%20network%20will%20see%20the%20packet');

// ------------------------------------------------------------------ constants

const LAPTOP_MAC = '00:00:5E:00:53:10';
const PHONE_MAC = '00:00:5E:00:53:11';

const NO_ADDRESS = '0.0.0.0';
const EVERYONE = '255.255.255.255';
const ROUTER_IP = '192.168.1.1';
const LAPTOP_IP = '192.168.1.100';

/** The lease in the example: 24 hours. The client renews at half of it (T1, RFC 2131 section 4.4.5). */
const LEASE_SECONDS = 86400;
const RENEW_SECONDS = LEASE_SECONDS / 2;

// --------------------------------------------------------------------- events

/** A DHCP message. No source states a DHCP message's size, so every log row's size is a dash. */
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
  traces: string[];
}): MessageEvent {
  const { id, from, to, tag, kind, time, src, dst, info, plain, traces } = o;
  return {
    type: 'message',
    id,
    from,
    to,
    tag,
    kind,
    log: { time, source: src, destination: dst, protocol: 'DHCP', info, size: '—' },
    plain,
    backing: { traces },
  };
}

const leaseAdded: TableEvent = {
  type: 'table',
  id: 'lease-add',
  table: 'leases',
  op: 'add',
  row: { ip: LAPTOP_IP, mac: LAPTOP_MAC, device: 'Laptop', expires: 'in 24 h' },
  summary: 'The router writes down that 192.168.1.100 belongs to the laptop for 24 hours.',
  backing: { traces: ['term-lease-table', 'term-lease', 'fact-mac'] },
};

const leaseRenewed: TableEvent = {
  type: 'table',
  id: 'lease-renew',
  table: 'leases',
  op: 'update',
  key: LAPTOP_IP,
  row: { expires: 'in 24 h (renewed)' },
  summary: 'The router moves the expiry forward by a full lease.',
  backing: { traces: ['deep-3', 'term-lease-table', 'term-lease'] },
};

// ------------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'dhcp',
  title: 'DHCP',
  subtitle: 'Getting an address automatically',
  level: 'beginner',
  certTags: ['a-plus', 'network-plus', 'ccna', 'helpdesk'],
  summary:
    'Watch a laptop join a Wi-Fi network and get an address, plus the other settings it needs to go online, from the router in four short messages.',
  figure: 'dhcp',
  backing: { traces: ['term-ip', 'fact-settings', 'fact-home', 'pattern', 'fact-ack', 'why-1'] },
  units: [
    {
      id: 'dhcp',
      name: 'DHCP',
      fullName: 'Dynamic Host Configuration Protocol',
      purpose: 'How a device gets its address',
      osi: 'spans',
      backing: { traces: ['fact-name', 'fact-defined', 'fact-settings'] },
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
            empty: 'Empty. No leases yet.',
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
        backing: {
          traces: ['fact-home', 'term-lease-table', 'term-broadcast', 'fact-replies', 'deep-3', 'fact-first', 'fact-ack', 'fact-ignore', 'fact-mac', 'term-ip', 'term-lease'],
        },
      },
      overview: {
        hook: 'When you join a Wi-Fi network, your device needs an address so messages can find it, like a room number in a hotel. You don’t make one up. You ask the front desk, and they hand you a free one. DHCP is that front desk. It’s why you never type an address in yourself.',
        hookBacking: { traces: ['term-ip', 'fact-home', 'term-offer', 'why-1'] },
        description:
          'DHCP hands each new device the few things it needs to start talking on a network. Your router usually does this job. It lends addresses out for a while, and keeps a list of who has which one.',
        backing: { traces: ['fact-settings', 'fact-home', 'term-lease', 'term-lease-table'] },
        facts: [
          { label: 'Ports', value: 'UDP 67 (server), UDP 68 (client)', backing: { traces: ['fact-ports'] } },
          { label: 'Hands out', value: 'IP address, subnet mask, default gateway, DNS server', backing: { traces: ['fact-settings'] } },
          { label: 'Exchange', value: 'Discover, Offer, Request, Acknowledge', backing: { traces: ['pattern'] } },
          { label: 'Lease', value: 'Renewed at half its length', backing: { traces: ['fact-t1', 'term-lease'] } },
          { label: 'Defined in', value: 'RFC 2131, RFC 2132', backing: { traces: ['fact-defined'] } },
        ],
      },
      steps: [
        {
          id: 'discover',
          title: 'DHCP Discover',
          sub: 'The laptop asks: is anyone there?',
          narrative:
            'Your laptop just joined the Wi-Fi, but it has no address yet. It doesn’t know who to ask, so it shouts to everyone on the network at once: “Can anyone give me an address?” That shout is called a **Discover**. Every device hears it. The phone hears it too, but it isn’t the one that hands out addresses, so it ignores it.',
          deep: [
            {
              text: 'The shout is a broadcast to 255.255.255.255, sent from 0.0.0.0 (“I have no address yet”) to UDP port 67, where DHCP servers listen.',
              cite: [dhcp('4.1'), dhcp('4.4.1'), RFC1122_ADDRESSES],
            },
          ],
          facts: [
            { label: 'From', value: '0.0.0.0, UDP port 68', backing: { traces: ['fact-first', 'fact-ports'] } },
            { label: 'To', value: '255.255.255.255, UDP port 67', backing: { traces: ['fact-first', 'fact-ports'] } },
            { label: 'MAC destination', value: 'ff:ff:ff:ff:ff:ff (everyone)', backing: { traces: ['fact-link', 'term-broadcast'] } },
            { label: 'Laptop MAC', value: LAPTOP_MAC, backing: { traces: ['fact-mac'] } },
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
              traces: ['term-discover', 'term-broadcast', 'fact-first', 'fact-ports', 'fact-ignore', 'fact-defined'],
            }),
          ],
          backing: { traces: ['term-discover', 'term-broadcast', 'fact-first', 'fact-ignore', 'deep-2'] },
        },
        {
          id: 'offer',
          title: 'DHCP Offer',
          sub: 'The router offers a free address',
          narrative:
            'The router is the one that hands out addresses. It hears the shout, picks a free address, 192.168.1.100, and offers it to the laptop. With it come a few other settings the laptop will need, and a time limit: it can keep the address for 24 hours. That’s the **Offer**.',
          deep: [
            {
              text: 'Along with the address, the Offer carries a subnet mask, a default gateway and a DNS server. It names the laptop’s MAC address, which is how the phone knows the Offer isn’t for it.',
              cite: [dhcp('3.1'), opt('3.3'), opt('3.5'), opt('3.8'), CISCO_OFFER_OPTIONS, dhcp('2'), dhcp('4.4.1'), CISCO_OFFER_CHADDR, MS_BASICS_OFFER],
            },
          ],
          facts: [
            { label: 'Address offered', value: LAPTOP_IP, backing: { traces: ['term-offer', 'fact-settings'] } },
            { label: 'Subnet mask', value: '255.255.255.0', backing: { traces: ['fact-settings'] } },
            { label: 'Gateway', value: '192.168.1.1 (the router)', backing: { traces: ['fact-settings', 'fact-home'] } },
            { label: 'Lease', value: '86400 seconds (24 hours)', backing: { traces: ['term-lease', 'fact-settings'] } },
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
              traces: ['term-offer', 'fact-replies', 'fact-ports', 'fact-settings', 'term-lease', 'fact-home', 'fact-defined'],
            }),
          ],
          backing: { traces: ['term-offer', 'fact-home', 'fact-settings', 'term-lease'] },
        },
        {
          id: 'request',
          title: 'DHCP Request',
          sub: 'The laptop says yes, please',
          narrative:
            'The laptop answers: “Yes, I’ll take 192.168.1.100.” It still shouts this to everyone, not just the router. That’s on purpose: if a second router had offered an address too, it now knows it wasn’t picked. This answer is called a **Request**.',
          deep: [
            {
              text: 'The Request is still sent from 0.0.0.0, because the address isn’t the laptop’s until the router confirms. A field called the server identifier says whose offer won, so any other DHCP server can free up the address it offered.',
              cite: [dhcp('4.1'), dhcp('3.1'), opt('9.7'), MS_BASICS_ZERO],
            },
          ],
          facts: [
            { label: 'Address requested', value: LAPTOP_IP, backing: { traces: ['fact-request'] } },
            { label: 'Server chosen', value: '192.168.1.1 (server identifier)', backing: { traces: ['fact-request'] } },
            { label: 'Sent from', value: '0.0.0.0, still no address', backing: { traces: ['fact-first', 'fact-request', 'deep-2'] } },
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
              traces: ['term-request', 'fact-request', 'fact-first', 'fact-ports', 'term-broadcast', 'fact-ignore', 'fact-defined'],
            }),
          ],
          backing: { traces: ['term-request', 'fact-request', 'term-broadcast'] },
        },
        {
          id: 'acknowledge',
          title: 'DHCP Acknowledge',
          sub: 'The router says: it’s yours',
          narrative:
            'The router confirms: “192.168.1.100 is yours for 24 hours.” It also writes it down in its lease table, a list of which device has which address. That list is how two devices never end up with the same address. Now the laptop can go online. These four messages are often called DORA: Discover, Offer, Request, **Acknowledge**.',
          deep: [
            {
              text: 'The confirmation is called an ACK.',
              cite: [dhcp('3.1')],
            },
          ],
          facts: [
            { label: 'Address', value: LAPTOP_IP, backing: { traces: ['term-ack'] } },
            { label: 'Lease', value: '24 hours', backing: { traces: ['term-lease'] } },
            { label: 'Lease table row', value: `${LAPTOP_IP}, ${LAPTOP_MAC}, Laptop`, backing: { traces: ['term-lease-table', 'fact-mac'] } },
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
              traces: ['term-ack', 'fact-replies', 'fact-ports', 'term-lease', 'fact-home', 'fact-defined'],
            }),
            leaseAdded,
          ],
          backing: { traces: ['term-ack', 'term-lease', 'term-lease-table', 'why-2', 'fact-ack', 'pattern'] },
        },
        {
          id: 'renew',
          title: 'Lease Renewal',
          sub: 'Halfway through, ask to keep it',
          narrative:
            'The address is only borrowed, like a hotel room. Halfway through the 24 hours, the laptop asks the router directly: “Can I keep my address a bit longer?” The router says yes, and the clock starts again. No shouting this time: the laptop knows exactly who to ask. This is called a **Renew**.',
          deep: [
            {
              text: 'Renewal happens at half the lease, 43,200 seconds here. If the router stays silent, the laptop asks any server at 87.5% of the lease, and if the lease runs out it starts again with a Discover. On Windows, ipconfig /renew does this on demand.',
              cite: [dhcp('4.4.5'), dhcp('4.4.1'), CISCO_RENEW, MS_T2, CISCO_REBIND, MS_IPCONFIG_RENEW, CISCO_IPCONFIG],
            },
          ],
          facts: [
            { label: 'Renews at', value: '43200 seconds (half of 86400)', backing: { traces: ['fact-t1', 'deep-3'] } },
            { label: 'Sent to', value: '192.168.1.1, UDP port 67, directly', backing: { traces: ['deep-3', 'fact-ports', 'fact-home'] } },
            { label: 'New expiry', value: 'in 24 h (renewed)', backing: { traces: ['term-lease', 'deep-3'] } },
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
              traces: ['deep-3', 'fact-t1', 'term-renew', 'term-request', 'fact-ports', 'fact-ack', 'fact-home', 'fact-defined'],
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
              traces: ['deep-3', 'term-ack', 'fact-replies', 'fact-ports', 'term-lease', 'fact-home', 'fact-defined'],
            }),
            leaseRenewed,
          ],
          backing: { traces: ['term-lease', 'term-renew', 'deep-3', 'fact-t1', 'term-broadcast', 'fact-home'] },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'Your laptop joined the Wi-Fi with no address. Four short messages later it had one, borrowed from the router for 24 hours. Here is what each part was, and what it’s called.',
            cite: [dhcp('3.1'), dhcp('2.2'), MS_NETSET, GOOGLE_LAN],
          },
        ],
        terms: [
          {
            id: 'term-broadcast',
            idea: 'Shouting to every device on the network at once, because you don’t know who to ask',
            name: 'Broadcast',
            cite: [RFC1122_BROADCAST, dhcp('4.4.4')],
          },
          { id: 'term-discover', idea: 'Asking: can anyone give me an address?', name: 'Discover', cite: [dhcp('3.1')] },
          { id: 'term-offer', idea: 'The router suggesting a free address, with a time limit', name: 'Offer', cite: [dhcp('3.1'), opt('9.2'), MS_NETSET, GOOGLE_LAN] },
          { id: 'term-request', idea: 'Saying yes to that address, out loud, so every router knows', name: 'Request', cite: [dhcp('3.1'), opt('9.7'), MS_NETSET, GOOGLE_LAN] },
          { id: 'term-ack', idea: 'The router confirming the address is yours', name: 'Acknowledge (ACK)', cite: [dhcp('3.1'), MS_NETSET, GOOGLE_LAN] },
          {
            id: 'term-lease-table',
            idea: 'The router’s list of which device has which address',
            name: 'Lease table',
            cite: [dhcp('1.5'), dhcp('3.1'), CISCO_LEASE_DB, MS_DATABASE, MS_NETSET, GOOGLE_LAN],
          },
          { id: 'term-lease', idea: 'Borrowing an address for a set time', name: 'Lease', cite: [dhcp('2.2')] },
          {
            id: 'term-renew',
            idea: 'Asking to keep it a while longer, halfway through',
            name: 'Renew',
            cite: [dhcp('4.4.5'), dhcp('2.2')],
          },
          {
            id: 'term-ip',
            idea: 'The laptop’s own number on the network, so messages can find it',
            name: 'IP address',
            cite: [rfc('rfc-791', '2.3', true), rfc('rfc-2131', '1.5')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Discover', 'Offer', 'Request', 'Acknowledge'],
          note: 'DORA: remember the first four in order: Discover, Offer, Request, Acknowledge.',
          cite: [dhcp('3.1'), MS_DORA, CANONICAL_DORA],
        },
        why: [
          {
            id: 'why-1',
            text: 'Without DHCP you would type an address into every device yourself, and two devices could end up with the same one.',
            cite: [dhcp('1.6'), MS_MANUAL, rfc('rfc-5227', '1', true)],
          },
          {
            id: 'why-2',
            text: 'The router keeps the list, so that never happens.',
            cite: [dhcp('1.6'), dhcp('2.2'), CISCO_LEASE_DB, MS_NETSET, GOOGLE_LAN],
          },
        ],
        deep: [
          { id: 'deep-1', text: 'DHCP messages travel over UDP.', cite: [dhcp('4.1')] },
          {
            id: 'deep-2',
            text: 'Before it has an address, a device sends from 0.0.0.0 to 255.255.255.255, the address that means everyone on this network.',
            cite: [dhcp('4.1'), dhcp('4.4.1'), RFC1122_ADDRESSES],
          },
          {
            id: 'deep-3',
            text: 'The client renews at half the lease, often called T1, with a Request sent straight to its server; the server’s ACK starts the lease again.',
            cite: [dhcp('4.4.5'), MS_TRAINING_UNICAST, MS_TRAINING_RESET, CISCO_RENEW],
          },
          {
            id: 'deep-4',
            text: 'If its own server stays silent, it asks any server at 87.5% of the lease, called T2.',
            cite: [dhcp('4.4.5'), MS_T2, CISCO_REBIND],
          },
        ],
        facts: [
          { id: 'fact-ports', label: 'Ports', value: 'UDP 67 (server), UDP 68 (client)', cite: [dhcp('4.1'), MS_PORTS] },
          {
            id: 'fact-first',
            label: 'First messages',
            value: 'from 0.0.0.0 to 255.255.255.255',
            cite: [dhcp('4.1'), dhcp('4.4.1'), RFC1122_ADDRESSES],
          },
          { id: 'fact-t1', label: 'Renew (T1)', value: 'at 50% of the lease', cite: [dhcp('4.4.5'), opt('9.11'), MS_T1] },
          { id: 'fact-t2', label: 'Rebind (T2)', value: 'at 87.5% of the lease', cite: [dhcp('4.4.5'), opt('9.12'), MS_T2] },
          {
            id: 'fact-no-server',
            label: 'No server answers',
            value: 'the device may give itself a 169.254.x.x address, which only reaches its neighbours',
            cite: [abstractOf('rfc-3927', '3927', true), rfc('rfc-3927', '1', true)],
          },
          { id: 'fact-defined', label: 'Defined in', value: 'RFC 2131, RFC 2132', cite: [dhcp('1'), opt('1')] },
          {
            id: 'fact-home',
            label: 'In a home',
            value: 'the Wi-Fi router is the DHCP server, with a pool of addresses to lend',
            cite: [MS_NETSET, GOOGLE_LAN],
          },
          {
            id: 'fact-settings',
            label: 'Hands out',
            value: 'an IP address, the subnet mask, the default gateway (the router) and the DNS server, with a lease time',
            cite: [dhcp('3.1'), opt('3.3'), opt('3.5'), opt('3.8'), opt('9.2'), CISCO_OFFER_OPTIONS],
          },
          {
            id: 'fact-mac',
            label: 'MAC address',
            value: 'every message names the laptop’s hardware address, so the server can tell clients apart and the laptop knows a reply is for it',
            cite: [dhcp('4.4.1'), dhcp('2'), dhcp('3.1'), MS_BASICS_MAC, CISCO_OFFER_CHADDR],
          },
          {
            id: 'fact-replies',
            label: 'Replies',
            value: 'from port 67 to port 68, sent straight to the laptop at the offered address, or broadcast',
            cite: [dhcp('4.1'), MS_PORTS],
          },
          {
            id: 'fact-request',
            label: 'The Request',
            value: 'is broadcast from 0.0.0.0 and names the chosen server (option 54, server identifier) and the address (option 50); other servers take back their offers',
            cite: [dhcp('3.1'), dhcp('4.1'), opt('9.7'), opt('9.1'), MS_BASICS_ZERO],
          },
          {
            id: 'fact-ack',
            label: 'After the ACK',
            value: 'the client uses the address and settings; not before',
            cite: [dhcp('3.1'), MS_BASICS_ZERO],
          },
          {
            id: 'fact-ignore',
            label: 'Who answers',
            value: 'only a DHCP server; the other devices that hear a broadcast, like the phone, ignore it',
            cite: [dhcp('1'), CANONICAL_IGNORE, RFC1122_ADDRESSES],
          },
          {
            id: 'fact-link',
            label: 'On the link',
            value: 'the broadcast goes to the hardware address ff:ff:ff:ff:ff:ff, which means everyone',
            cite: [dhcp('4.4.1'), ETHERNET_BROADCAST],
          },
          {
            id: 'fact-name',
            label: 'Stands for',
            value: 'Dynamic Host Configuration Protocol, the way a device gets its address and other settings',
            cite: [abstractOf('rfc-2131', '2131', true), dhcp('1'), dhcp('1.5')],
          },
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
              cite: [dhcp('4.4.4'), dhcp('3.1'), RFC1122_ADDRESSES, MS_NETSET, GOOGLE_LAN],
            },
            {
              text: 'Shouting is faster than asking one device.',
              feedback: 'Not quite. Speed isn’t the reason. The laptop shouts because it doesn’t know yet who hands out addresses.',
              cite: [dhcp('4.4.4'), dhcp('3.1')],
            },
            {
              text: 'So the phone can answer if the router is busy.',
              feedback:
                'Not quite. The phone doesn’t hand out addresses, so it ignores the shout. The laptop shouts because it doesn’t know yet who to ask.',
              cite: [dhcp('1'), CANONICAL_IGNORE, dhcp('4.4.4')],
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
                'Not quite. Two devices with the same address couldn’t both work properly. The router keeps a list and only offers addresses that are free.',
              cite: [rfc('rfc-5227', '2.4', true), dhcp('3.1'), dhcp('1.5'), MS_NETSET, GOOGLE_LAN],
            },
            {
              text: 'It writes each loan in its lease table, and only offers addresses that are free.',
              feedback: 'That’s it. The lease table is the router’s list of who has which address.',
              cite: [dhcp('3.1'), dhcp('1.5'), CISCO_LEASE_DB, MS_NETSET, GOOGLE_LAN],
            },
            {
              text: 'It asks the phone which addresses are taken.',
              feedback: 'Not quite. The phone doesn’t keep track of addresses. The router does, in its lease table.',
              cite: [dhcp('1.5'), dhcp('1'), CISCO_LEASE_DB, MS_NETSET, GOOGLE_LAN],
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
              cite: [dhcp('4.4.5'), MS_T1, MS_NETSET, GOOGLE_LAN],
            },
            {
              text: 'Only once the 24 hours have run out.',
              feedback: 'Not quite. Waiting until the end could leave the laptop without an address for a while. It asks halfway through.',
              cite: [dhcp('4.4.5'), MS_T1],
            },
            {
              text: 'Every time it sends a message.',
              feedback: 'Not quite. That would be a lot of asking. It first asks halfway through the 24 hours.',
              cite: [dhcp('4.4.5'), MS_T1],
            },
          ],
          answer: 0,
        },
      ],
    },
  ],
});
