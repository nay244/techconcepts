import { defineLesson } from '../define';
import { eventLog, messagesFor, type MockupMessage } from '../helpers/internet-events';
import type { Backing, SceneEvent, TableDef } from '../schema';
import { cite } from '../sources';

/**
 * DHCP, lesson 7 of How the Internet Works’ 14. The laptop joins the Wi-Fi with no address, and the router lends
 * it one in four messages, Discover, Offer, Request and Acknowledge, then renews the lease halfway through.
 * Networking Concepts' DHCP lesson teaches DHCP in full. This tour lesson overlaps it on purpose (direction doc §4.5):
 * it says what DHCP is for, and the Networking lesson how it works.
 *
 * The words are the approved mockup's (internet-v2.html, from FIGS/protocols-core.mjs), changed only where a source
 * does not state them. The addresses (RFC 1918 and RFC 5737), the laptop's MAC address 00:00:5E:00:53:10 (the
 * documentation range every lesson uses), the 24-hour lease and its 12 hours, and the times in the log are example
 * data, and the scene's events carry them beside the claims they trace to. No message size is shown: no source states
 * one. With no IP address until the end, the laptop goes by its MAC address in the Sequence view. The analogy (the
 * hotel desk) cites nothing. No source places DHCP at an OSI layer, so the badge spans.
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

const IANA_PORTS = cite('iana-ports', 'Registry', {
  url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml#table-service-names-port-numbers',
  defining: true,
});

const IANA_DHCP = 'https://www.iana.org/assignments/bootp-dhcp-parameters/bootp-dhcp-parameters.xhtml';
const IANA_MESSAGE_TYPES = cite('iana-dhcp-parameters', 'DHCP Message Type 53 Values', { url: `${IANA_DHCP}#message-type-53`, defining: true });
const IANA_OPTIONS = cite('iana-dhcp-parameters', 'BOOTP Vendor Extensions and DHCP Options', { url: `${IANA_DHCP}#options`, defining: true });

const abstractOf = (source: string, number: string, defining = false) =>
  cite(source, 'Abstract', { url: `https://www.rfc-editor.org/rfc/rfc${number}.html#abstract`, ...(defining ? { defining: true as const } : {}) });

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const MS_NETSET_URL = 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows';
const MS_NETSET = vendor(
  'microsoft-network-settings',
  MS_NETSET_URL,
  'Change TCP/IP Settings',
  'IP%20address%20settings%20and%20DNS%20server%20address%20setting%20are%20set%20automatically',
);
const GOOGLE_LAN_URL = 'https://support.google.com/googlehome/answer/7571856';
const GOOGLE_LAN = vendor('google-nest-lan-ip', GOOGLE_LAN_URL, 'Set a custom LAN IP', 'customize%20your%20router%20LAN%20address');
const GOOGLE_RES_URL = 'https://support.google.com/googlehome/answer/6274660';
const GOOGLE_RES = vendor(
  'google-nest-dhcp-reservation',
  GOOGLE_RES_URL,
  'Set DHCP IP reservation or a Static IP address for a device',
  'When%20you%20use%20DHCP%20IP%20reservation',
);
const GOOGLE_RES_WHY = vendor(
  'google-nest-dhcp-reservation',
  GOOGLE_RES_URL,
  'Why use DHCP IP reservation or Static IP',
  'sometimes,%20you%20want%20devices%20to%20always%20have%20the%20same%20IP%20address',
);

const MS_TROUBLE_URL = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue';
const msTrouble = (text: string) => vendor('microsoft-dhcp-troubleshoot', MS_TROUBLE_URL, 'More information', text);
const MS_DORA = msTrouble('Broadcast-based%20DORA');
const MS_PORTS = msTrouble('All%20communication%20is%20done%20on%20UDP%20ports%2067%20and%2068');
const MS_RELAY = msTrouble('A%20DHCP%20relay%20agent');
const MS_APIPA = msTrouble('client%20is%20likely%20configured%20to%20use%20an%20APIPA%20address');
const MS_T1 = msTrouble('renew%20the%20IP%20address%20assignment%20after%2050%20percent');
const MS_T2 = msTrouble('sent%20after%2087.5%20percent');

const MS_BASICS_URL = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/dynamic-host-configuration-protocol-basics';
const msBasics = (section: string, text: string) => vendor('microsoft-dhcp-basics', MS_BASICS_URL, section, text);
const MS_BASICS_DISCOVER = msBasics('DHCPDISCOVER', 'In%20the%20IP%20section');
const MS_BASICS_MAC = msBasics('DHCPDISCOVER', 'identifies%20the%20client%20in%20two%20places');
const MS_BASICS_HOLD = msBasics('DHCPREQUEST', 'may%20be%20holding%20a%20reservation');
const MS_BASICS_ZERO = msBasics('DHCPREQUEST', 'The%20client%20retains%200.0.0.0');
const MS_BASICS_REMEMBER = msBasics('DHCPACK', 'If%20the%20client%20has%20previously%20had%20a%20DHCP%20assigned');

const MS_SERVER_URL = 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top';
const msServer = (text: string) => vendor('microsoft-dhcp-server', MS_SERVER_URL, 'Why use DHCP?', text);
const MS_POOL = msServer('The%20DHCP%20server%20maintains%20a%20pool%20of%20IP%20addresses');
const MS_RESERVED = msServer('Reserved%20IP%20addresses%20associated%20with%20particular%20DHCP%20clients');
const MS_MANUAL = msServer('Without%20DHCP,%20IP%20addresses%20for%20new%20computers');
const MS_OPTIONS = msServer('Some%20examples%20of%20DHCP%20options');
const MS_RECLAIM = msServer('addresses%20no%20longer%20in%20use%20are%20automatically%20returned');
const MS_SERVER_RELAY = vendor(
  'microsoft-dhcp-server',
  MS_SERVER_URL,
  'Benefits of DHCP Server',
  'The%20forwarding%20of%20initial%20DHCP%20messages',
);

const MS_QUICK_URL = 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server';
const MS_SCOPE = vendor('microsoft-dhcp-quickstart', MS_QUICK_URL, 'Configure an IPv4 scope', 'Scopes%20are%20used%20to%20indicate');
const MS_RESERVATIONS = vendor('microsoft-dhcp-quickstart', MS_QUICK_URL, 'Manage reservations', 'Reservations%20are%20stored%20using');

const MS_TRAINING_URL =
  'https://learn.microsoft.com/en-us/training/modules/deploy-manage-dynamic-host-configuration-protocol/2-use-dynamic-host-configuration-protocol-simplify-ip-configuration';
const MS_TRAINING_RELAY = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'How DHCP works', 'Because%20IP%20broadcasts%20aren');
const MS_TRAINING_OFFERS = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'How DHCP works', 'If%20the%20client%20receives%20multiple');
const MS_TRAINING_UNICAST = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'DHCP lease renewal', 'sends%20a%20unicast%20DHCPREQUEST');
const MS_TRAINING_SAME = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'DHCP lease renewal', 'same%20DHCP-assigned%20IP%20address');
const MS_TRAINING_RESET = vendor('microsoft-dhcp-training', MS_TRAINING_URL, 'DHCP lease renewal', 'If%20renewal%20is%20successful');

const PALO_MESSAGES_URL = 'https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-networking-admin/dhcp/dhcp-messages';
const PALO_RELAY = vendor('paloalto-dhcp-messages', PALO_MESSAGES_URL, 'DHCP Messages', 'If%20there%20is%20no%20DHCP%20server%20on%20its%20subnet');
const PALO_OVERVIEW_URL = 'https://docs.paloaltonetworks.com/pan-os/11-1/pan-os-networking-admin/dhcp/dhcp-overview';
const PALO_OVERVIEW = vendor('paloalto-dhcp-overview', PALO_OVERVIEW_URL, 'DHCP', 'A%20device%20acting%20as%20a%20DHCP%20relay%20agent');

const CISCO_SERVER_URL = 'https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/ip-addressing/b-ip-addressing/m_config-dhcp-server-xe.html';
/** On Cisco's page the sentence closes the section "Prerequisites for Configuring the DHCP Server". */
const CISCO_HELPER = vendor(
  'cisco-dhcp-server',
  CISCO_SERVER_URL,
  'Prerequisites for Configuring the DHCP Server',
  'The%20Cisco%20DHCP%20relay%20agent%20is%20enabled',
);
const CISCO_TROUBLE_URL = 'https://www.cisco.com/c/en/us/support/docs/ip/dynamic-address-allocation-resolution/27470-100.html';
const CISCO_HELPER_2 = vendor(
  'cisco-dhcp-troubleshoot',
  CISCO_TROUBLE_URL,
  'Configure DHCP/BootP Relay Agent Feature on Cisco IOS® Router',
  'To%20forward%20the%20BootP/DHCP%20request',
);
const CISCO_SCOPE = vendor('cisco-dhcp-troubleshoot', CISCO_TROUBLE_URL, 'Appendix A: Cisco IOS DHCP Sample Configuration', 'DHCP%20pool%20(scope)%20name');

const CANONICAL_DORA = vendor(
  'canonical-dhcp-concepts',
  'https://canonical.com/blog/basic-dhcp-concepts',
  'The network version of DORA',
  'The%20DHCP%20negotiation%20process%20is%20known%20as%20DORA',
);

// ---------------------------------------------------------------- events

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

const mockup = messagesFor(settings);

/** The mockup's messages for one step, each message and each table row it brings tracing to the same Learn parts. */
const msgOf =
  (...traces: string[]) =>
  (m: MockupMessage): SceneEvent[] => {
    const backing: Backing = { traces };
    return mockup(m).map((e) => ({ ...e, backing }));
  };

// ---------------------------------------------------------------- lesson

export default defineLesson({
  slug: 'what-is-dhcp',
  title: 'DHCP',
  subtitle: 'Getting an address',
  level: 'beginner',
  certTags: [],
  summary:
    'A device that joins a network has no address yet. DHCP is how it gets one: it calls out, the router offers an address, and the device takes it for a while. Networking Concepts has a DHCP lesson that goes further.',
  figure: 'net-map',
  backing: {
    traces: ['term-client', 'fact-first', 'term-discover', 'term-offer', 'term-lease', 'fact-home', 'fact-settings'],
  },
  units: [
    {
      id: 'dhcp',
      name: 'DHCP',
      fullName: 'Dynamic Host Configuration Protocol',
      purpose: 'Getting an address',
      group: 'app',
      osi: 'spans',
      backing: { traces: ['fact-defined', 'term-client', 'fact-settings'] },
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
        backing: {
          traces: [
            'term-client',
            'term-server',
            'term-broadcast',
            'fact-home',
            'fact-first',
            'fact-settings',
            'fact-request',
            'fact-ack',
          ],
        },
      },
      overview: {
        hook: 'A device that joins a network has no address yet. DHCP is how it gets one: it calls out, the router offers an address, and the device takes it for a while. Networking Concepts has a DHCP lesson that goes further.',
        hookBacking: {
          traces: ['fact-first', 'term-client', 'term-discover', 'term-offer', 'term-lease', 'fact-home'],
        },
        description:
          'It’s like arriving at a hotel. You don’t pick your own room: you ask at the desk, they offer one, you say yes, and they give you the key for a set number of nights. Here your laptop joins your home Wi-Fi, and your router is the desk.',
        backing: { analogy: true },
        facts: [
          {
            label: 'Used for',
            value: 'giving devices an address when they join',
            backing: { traces: ['term-client', 'fact-settings'] },
          },
          {
            label: 'Ports',
            value: 'UDP 67 (server), 68 (client)',
            backing: { traces: ['fact-ports'] },
          },
          {
            label: 'Messages',
            value: 'Discover, Offer, Request, Acknowledge',
            backing: { traces: ['pattern', 'fact-messages'] },
          },
          {
            label: 'Also hands out',
            value: 'the router’s and resolver’s addresses',
            backing: { traces: ['fact-settings'] },
          },
          {
            label: 'This example',
            value: 'your laptop joining 192.168.1.0/24',
            backing: { example: true },
          },
        ],
      },
      steps: [
        {
          id: 'client-initialization',
          title: 'Client Initialization',
          sub: 'No address yet',
          narrative:
            'You open your laptop and it joins the Wi-Fi. It’s connected, but it can’t talk to anyone yet: it has no **IP address**, and it doesn’t know where the router or the DNS resolver are. The laptop is the **client** here, and it needs a **DHCP server** to give it all of that. In a home, the server is the router.',
          deep: [
            {
              text: 'With no address, the client uses 0.0.0.0 as its source and sends to 255.255.255.255, the broadcast address.',
              cite: [dhcp('4.1'), dhcp('4.4.1'), RFC1122_ADDRESSES],
            },
            {
              text: 'It may remember its last address on this network and ask for that one again.',
              cite: [dhcp('3.2'), dhcp('4.4.2'), MS_BASICS_REMEMBER],
            },
            {
              text: 'If nobody answers at all, it gives itself a link-local address in 169.254.0.0/16, which only works with its neighbours.',
              cite: [abstractOf('rfc-3927', '3927', true), rfc('rfc-3927', '1', true), MS_APIPA],
            },
          ],
          facts: [
            {
              label: 'Laptop’s address',
              value: 'none yet (0.0.0.0)',
              backing: { traces: ['fact-first'] },
            },
            {
              label: 'Knows the router?',
              value: 'no',
              backing: { traces: ['fact-first', 'fact-settings'] },
            },
            {
              label: 'Needs',
              value: 'an address, mask, router and DNS',
              backing: { traces: ['fact-settings'] },
            },
            {
              label: 'Server here',
              value: 'your home router',
              backing: { traces: ['fact-home'] },
            },
          ],
          status: 'On the Wi-Fi, can’t talk yet',
          idle: 'Nothing on the network yet. The laptop has no address to send from.',
          events: [],
          backing: {
            traces: ['term-ip', 'term-client', 'term-server', 'fact-home', 'fact-first', 'fact-settings'],
          },
        },
        {
          id: 'dhcp-discover',
          title: 'DHCP Discover',
          sub: 'Shout for one',
          narrative:
            'The laptop doesn’t know who hands out addresses, so it calls out to the whole network at once: “I’m new here. Can anyone give me an address?” A message to everyone is a **broadcast**, and this one is a **DHCP Discover**. Every device on the network hears it, but only a DHCP server will answer.',
          deep: [
            {
              text: 'Discover goes from 0.0.0.0:68 to 255.255.255.255:67 over UDP, and carries the laptop’s MAC address so the server can tell clients apart.',
              cite: [dhcp('4.1'), dhcp('4.4.1'), dhcp('4.2'), IANA_PORTS, MS_PORTS, MS_BASICS_DISCOVER, MS_BASICS_MAC],
            },
            {
              text: 'Broadcasts don’t cross routers, so a network whose server is elsewhere needs a DHCP relay (on Cisco, ip helper-address).',
              cite: [RFC1122_ADDRESSES, dhcp('1'), dhcp('1.5'), MS_TRAINING_RELAY, MS_RELAY, PALO_RELAY, CISCO_HELPER, CISCO_HELPER_2],
            },
          ],
          facts: [
            {
              label: 'From',
              value: '0.0.0.0, port 68',
              backing: { traces: ['fact-first', 'fact-ports'] },
            },
            {
              label: 'To',
              value: 'everyone: 255.255.255.255, port 67',
              backing: { traces: ['fact-first', 'fact-ports', 'term-broadcast'] },
            },
            {
              label: 'Carries',
              value: 'the laptop’s MAC address',
              backing: { traces: ['fact-discover'] },
            },
            {
              label: 'Over',
              value: 'UDP',
              backing: { traces: ['fact-ports'] },
            },
          ],
          events: [
            ...msgOf(
              'term-discover',
              'term-broadcast',
              'fact-first',
              'fact-ports',
              'fact-discover',
              'fact-defined',
            )({
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
              size: '—',
              sum: 'Everyone: I’m new here. Can anyone give me an address?',
              info: 'DHCP Discover, from 00:00:5E:00:53:10',
              st: 'Asking for an address',
            }),
          ],
          backing: {
            traces: ['term-discover', 'term-broadcast', 'term-server', 'fact-first', 'fact-ports', 'fact-discover'],
          },
        },
        {
          id: 'dhcp-offer',
          title: 'DHCP Offer',
          sub: 'The router offers',
          narrative:
            'The router hears it and picks a free address from its pool: 192.168.1.100. It answers with a **DHCP Offer**: “You can have 192.168.1.100. I’m your router, at 192.168.1.1, and for names, ask 192.0.2.53.” Nothing is final yet. It’s an offer, and the router holds the address for a moment while the laptop decides.',
          deep: [
            {
              text: 'The Offer carries the address (yiaddr), the subnet mask, the default gateway, the DNS servers and the lease time, here 24 hours.',
              cite: [dhcp('3.1'), dhcp('4.3.1'), opt('3.3'), opt('3.5'), opt('3.8'), opt('9.2'), MS_OPTIONS],
            },
            {
              text: 'Servers may broadcast the Offer or send it straight to the client’s MAC.',
              cite: [dhcp('4.1')],
            },
            {
              text: 'A network can have more than one DHCP server, so a client may get several offers; it takes one.',
              cite: [dhcp('1.6'), dhcp('3.1'), dhcp('4.4.1'), MS_TRAINING_OFFERS],
            },
          ],
          facts: [
            {
              label: 'Offers',
              value: '192.168.1.100',
              backing: { traces: ['term-offer', 'fact-settings'] },
            },
            {
              label: 'Mask',
              value: '255.255.255.0',
              backing: { traces: ['fact-settings'] },
            },
            {
              label: 'Router and DNS',
              value: '192.168.1.1, 192.0.2.53',
              backing: { traces: ['fact-settings', 'fact-home'] },
            },
            {
              label: 'Lease',
              value: '24 hours',
              backing: { traces: ['term-lease', 'fact-settings'] },
            },
          ],
          events: [
            ...msgOf(
              'term-offer',
              'fact-ports',
              'fact-replies',
              'fact-settings',
              'fact-offer',
              'term-lease',
              'fact-home',
              'fact-defined',
            )({
              tag: 'OFFER',
              from: 'router',
              to: 'laptop',
              proto: 'DHCP',
              via: 'UDP',
              kind: 'response',
              time: '0.004s',
              src: ROUTER,
              dst: LAPTOP,
              size: '—',
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
          backing: {
            traces: ['deep-pool', 'term-offer', 'fact-settings', 'fact-offer', 'fact-home', 'term-lease'],
          },
        },
        {
          id: 'dhcp-request',
          title: 'DHCP Request',
          sub: 'Say yes, out loud',
          narrative:
            'The laptop answers: “Yes please, I’ll take 192.168.1.100 from 192.168.1.1.” It says it to everyone, as a broadcast again. That way, if any other server made an offer, it hears that its offer wasn’t taken and can give that address to someone else. This is the **DHCP Request**.',
          deep: [
            {
              text: 'The Request still comes from 0.0.0.0, because the laptop can’t use the address until the server confirms it.',
              cite: [dhcp('4.1'), dhcp('4.4.1'), MS_BASICS_ZERO],
            },
            {
              text: 'It names the chosen server (option 54, server identifier) and the address it wants (option 50, requested IP address).',
              cite: [dhcp('4.3.2'), dhcp('3.1'), opt('9.7'), opt('9.1'), IANA_OPTIONS],
            },
          ],
          facts: [
            {
              label: 'From',
              value: '0.0.0.0, port 68',
              backing: { traces: ['fact-first', 'fact-ports'] },
            },
            {
              label: 'To',
              value: 'everyone, port 67',
              backing: { traces: ['fact-first', 'fact-ports', 'term-broadcast'] },
            },
            {
              label: 'Asks for',
              value: '192.168.1.100',
              backing: { traces: ['fact-request'] },
            },
            {
              label: 'Names the server',
              value: '192.168.1.1',
              backing: { traces: ['fact-request'] },
            },
          ],
          events: [
            ...msgOf(
              'term-request',
              'term-broadcast',
              'fact-first',
              'fact-ports',
              'fact-request',
              'fact-defined',
            )({
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
              size: '—',
              sum: 'Everyone: I’ll take 192.168.1.100, from 192.168.1.1.',
              info: 'DHCP Request: 192.168.1.100, server 192.168.1.1',
              st: 'Accepting 192.168.1.100',
              rows: [{ key: 'ip', cells: ['Address', '192.168.1.100', 'Requested'] }],
            }),
          ],
          backing: {
            traces: ['term-request', 'term-broadcast', 'fact-request', 'fact-first', 'fact-ports'],
          },
        },
        {
          id: 'dhcp-acknowledge',
          title: 'DHCP Acknowledge',
          sub: 'It’s yours',
          narrative:
            'The router confirms with a **DHCP Acknowledge**: “It’s yours for 24 hours.” The laptop sets itself up with the address, the mask, the router and the DNS resolver, and it’s on the network. The 24 hours is the **lease**: the address is lent, not given.',
          deep: [
            {
              text: 'After the ACK, many clients send an ARP probe for their new address, to make sure nobody else is using it.',
              cite: [dhcp('3.1'), dhcp('2.2'), rfc('rfc-5227', '2.1', true)],
            },
            {
              text: 'If the server can’t give the address after all, it replies with a DHCPNAK and the client starts again from Discover.',
              cite: [dhcp('3.1')],
            },
            {
              text: 'The four messages, Discover, Offer, Request, Acknowledge, are often remembered as DORA.',
              cite: [dhcp('3.1'), MS_DORA, CANONICAL_DORA],
            },
          ],
          facts: [
            {
              label: 'Address',
              value: '192.168.1.100, for 24 hours',
              backing: { traces: ['fact-settings', 'term-lease', 'fact-ack'] },
            },
            {
              label: 'Router',
              value: '192.168.1.1',
              backing: { traces: ['fact-settings'] },
            },
            {
              label: 'DNS',
              value: '192.0.2.53',
              backing: { traces: ['fact-settings'] },
            },
            {
              label: 'Four messages',
              value: 'Discover, Offer, Request, Ack (DORA)',
              backing: { traces: ['pattern'] },
            },
          ],
          events: [
            ...msgOf(
              'term-ack',
              'term-lease',
              'fact-ports',
              'fact-replies',
              'fact-ack',
              'fact-settings',
              'fact-home',
              'fact-defined',
            )({
              tag: 'ACK',
              from: 'router',
              to: 'laptop',
              proto: 'DHCP',
              via: 'UDP',
              kind: 'response',
              time: '0.009s',
              src: ROUTER,
              dst: LAPTOP,
              size: '—',
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
          backing: {
            traces: ['term-ack', 'term-lease', 'fact-ack', 'fact-settings', 'pattern'],
          },
        },
        {
          id: 'lease-renewal',
          title: 'Lease Renewal',
          sub: 'Ask to keep it',
          narrative:
            'Halfway through the lease, after 12 hours, the laptop asks to keep its address. This time it knows exactly who to ask, so it doesn’t shout: it asks the router directly. The router says yes, and the 24 hours start again. As long as the laptop stays on the network, its address doesn’t change. That’s **lease renewal**.',
          deep: [
            {
              text: 'Renewal starts at T1, half the lease, with a Request sent straight to the server.',
              cite: [dhcp('4.4.5')],
            },
            {
              text: 'If the server doesn’t answer, the client broadcasts to any server at T2, seven-eighths of the lease.',
              cite: [dhcp('4.4.5'), MS_T2],
            },
            {
              text: 'If the lease runs out, it must stop using the address and start again from Discover.',
              cite: [dhcp('4.4.5'), dhcp('4.4.1')],
            },
            {
              text: 'A device leaving politely sends a DHCPRELEASE.',
              cite: [dhcp('4.4.6'), dhcp('3.1')],
            },
          ],
          facts: [
            {
              label: 'Renews at',
              value: 'half the lease: 12 hours',
              backing: { traces: ['fact-renewal', 'term-lease'] },
            },
            {
              label: 'Sent to',
              value: 'the router directly, 192.168.1.1',
              backing: { traces: ['fact-renewal', 'fact-home'] },
            },
            {
              label: 'If no answer',
              value: 'ask anyone, at 7/8 of the lease',
              backing: { traces: ['fact-renewal'] },
            },
            {
              label: 'Lease',
              value: 'back to 24 hours',
              backing: { traces: ['fact-renewal', 'term-lease'] },
            },
          ],
          events: [
            ...msgOf(
              'term-request',
              'term-renewal',
              'fact-renewal',
              'fact-ports',
              'fact-home',
              'fact-defined',
            )({
              tag: 'REQUEST',
              from: 'laptop',
              to: 'router',
              proto: 'DHCP',
              via: 'UDP',
              kind: 'request',
              time: '12 h',
              src: LAPTOP,
              dst: ROUTER,
              size: '—',
              sum: 'Can I keep 192.168.1.100?',
              info: 'DHCP Request (renewal): 192.168.1.100',
              st: 'Renewing the lease',
              known: true,
            }),
            ...msgOf(
              'term-ack',
              'term-renewal',
              'fact-renewal',
              'fact-ports',
              'fact-replies',
              'fact-home',
              'fact-defined',
            )({
              tag: 'ACK',
              from: 'router',
              to: 'laptop',
              proto: 'DHCP',
              via: 'UDP',
              kind: 'response',
              time: '12 h',
              src: ROUTER,
              dst: LAPTOP,
              size: '—',
              sum: 'Yes. Another 24 hours.',
              info: 'DHCP ACK: lease renewed, 24 h',
              st: 'Lease renewed',
              done: true,
              rows: [{ key: 'lease', cells: ['Lease', '24 hours, renewed', 'In use'] }],
            }),
          ],
          backing: {
            traces: ['term-renewal', 'fact-renewal', 'fact-same', 'term-lease', 'term-request', 'fact-home'],
          },
        },
      ],
      learn: {
        lead: [
          {
            id: 'lead-1',
            text: 'Four messages took the laptop from a stranger to a member of the network, and two more keep it there.',
            cite: [dhcp('3.1'), dhcp('4.4.5')],
          },
        ],
        terms: [
          {
            id: 'term-client',
            idea: 'The device asking for an address',
            name: 'DHCP client',
            cite: [dhcp('1.5')],
          },
          {
            id: 'term-server',
            idea: 'The one handing addresses out, here your router',
            name: 'DHCP server',
            cite: [dhcp('1.5'), MS_NETSET, GOOGLE_LAN],
          },
          {
            id: 'term-broadcast',
            idea: 'A message to everyone on the network',
            name: 'Broadcast',
            cite: [RFC1122_BROADCAST, rfc('rfc-2131', '3.1')],
          },
          {
            id: 'term-discover',
            idea: '“Can anyone give me an address?”',
            name: 'Discover',
            cite: [dhcp('3.1')],
          },
          {
            id: 'term-offer',
            idea: '“You can have this one”',
            name: 'Offer',
            cite: [dhcp('3.1')],
          },
          {
            id: 'term-request',
            idea: '“Yes please, I’ll take it”',
            name: 'Request',
            cite: [dhcp('3.1')],
          },
          {
            id: 'term-ack',
            idea: '“It’s yours”',
            name: 'Acknowledge',
            cite: [dhcp('3.1')],
          },
          {
            id: 'term-lease',
            idea: 'How long the address is lent for',
            name: 'Lease',
            cite: [dhcp('2.2')],
          },
          {
            id: 'term-ip',
            idea: 'The laptop’s own number on the network, so messages can find it',
            name: 'IP address',
            cite: [rfc('rfc-791', '2.3', true), rfc('rfc-2131', '1.5')],
          },
          {
            id: 'term-renewal',
            idea: 'Asking to keep the address, before the lease runs out',
            name: 'Lease renewal',
            cite: [dhcp('2.2'), dhcp('4.4.5')],
          },
        ],
        pattern: {
          id: 'pattern',
          names: ['Discover', 'Offer', 'Request', 'Acknowledge'],
          note: 'DORA: a device getting a new address goes this way. A renewal is just the last two again.',
          cite: [dhcp('3.1'), dhcp('3.2'), dhcp('4.4.5'), MS_DORA, CANONICAL_DORA],
        },
        why: [
          {
            id: 'why-1',
            text: 'Without DHCP, someone would have to type an address, mask, router and resolver into every phone, laptop and TV, and make sure no two clashed.',
            cite: [dhcp('1'), dhcp('1.6'), MS_MANUAL],
          },
          {
            id: 'why-2',
            text: 'DHCP does it automatically, and takes addresses back from devices that leave.',
            cite: [dhcp('1.6'), dhcp('1'), dhcp('2.2'), MS_RECLAIM],
          },
        ],
        deep: [
          {
            id: 'deep-pool',
            text: 'Servers hand out addresses from a pool (a scope), and can reserve one for a particular MAC so a printer always gets the same address.',
            cite: [dhcp('4.3.1'), MS_POOL, MS_RESERVED, MS_RESERVATIONS, MS_SCOPE, CISCO_SCOPE, GOOGLE_RES, GOOGLE_RES_WHY],
          },
          {
            id: 'deep-relay',
            text: 'On bigger networks, a relay on each router forwards broadcasts to a central server.',
            cite: [dhcp('1'), dhcp('1.5'), MS_TRAINING_RELAY, MS_SERVER_RELAY, PALO_OVERVIEW, PALO_RELAY],
          },
          {
            id: 'deep-snooping',
            text: 'DHCP snooping on switches blocks rogue servers.',
            cite: [abstractOf('rfc-7610', '7610'), rfc('rfc-7513', '4.3.3')],
          },
          {
            id: 'deep-ipv6',
            text: 'IPv6 can use DHCPv6, or let devices make their own address (SLAAC).',
            cite: [abstractOf('rfc-9915', '9915', true), rfc('rfc-4862', '1', true)],
          },
        ],
        facts: [
          {
            id: 'fact-ports',
            label: 'Ports',
            value: 'UDP 67 (server), 68 (client)',
            cite: [IANA_PORTS, dhcp('4.1')],
          },
          {
            id: 'fact-messages',
            label: 'Messages',
            value: 'Discover, Offer, Request, Ack, plus others such as NAK and Release',
            cite: [dhcp('3.1'), opt('9.6'), IANA_MESSAGE_TYPES],
          },
          {
            id: 'fact-renewal',
            label: 'Renewal',
            value:
              'at 50% of the lease, a Request straight to the server, whose ACK starts the lease again; with no answer, a broadcast to any server at 87.5%',
            cite: [dhcp('4.4.5'), MS_T1, MS_T2, MS_TRAINING_UNICAST, MS_TRAINING_RESET],
          },
          {
            id: 'fact-no-server',
            label: 'No server?',
            value: '169.254.x.x, neighbours only',
            cite: [abstractOf('rfc-3927', '3927', true), rfc('rfc-3927', '1', true), rfc('rfc-3927', '2.7', true), MS_APIPA],
          },
          {
            id: 'fact-defined',
            label: 'Defined in',
            value: 'RFC 2131, Dynamic Host Configuration Protocol',
            cite: [dhcp('1')],
          },
          {
            id: 'fact-home',
            label: 'In a home',
            value: 'the Wi-Fi router is the DHCP server, with a pool of addresses to lend',
            cite: [MS_NETSET, GOOGLE_LAN],
          },
          {
            id: 'fact-first',
            label: 'Before it has an address',
            value: 'a client has no address to talk from and doesn’t know the server, so it calls out from 0.0.0.0 to 255.255.255.255, everyone on its network',
            cite: [dhcp('4.1'), dhcp('4.4.1'), dhcp('4.4.4'), RFC1122_ADDRESSES],
          },
          {
            id: 'fact-settings',
            label: 'Hands out',
            value: 'what a new device needs and doesn’t have yet: an IP address, the subnet mask, the router and the DNS server, with a lease time',
            cite: [dhcp('3.1'), dhcp('4.3.1'), dhcp('1.6'), opt('3.3'), opt('3.5'), opt('3.8'), opt('9.2')],
          },
          {
            id: 'fact-discover',
            label: 'The Discover carries',
            value: 'the laptop’s MAC address, so the server can tell clients apart',
            cite: [dhcp('4.4.1'), dhcp('4.2'), MS_BASICS_MAC],
          },
          {
            id: 'fact-replies',
            label: 'Replies',
            value: 'from port 67 to port 68, sent straight to the laptop at the offered address, or broadcast',
            cite: [dhcp('4.1'), IANA_PORTS, MS_PORTS],
          },
          {
            id: 'fact-offer',
            label: 'An Offer',
            value: 'isn’t final; the server holds the address while the client decides',
            cite: [dhcp('4.3.2'), dhcp('4.3.1'), MS_BASICS_HOLD],
          },
          {
            id: 'fact-request',
            label: 'The Request',
            value:
              'is broadcast from 0.0.0.0 and names the chosen server (option 54) and the address (option 50); other servers take back their offers',
            cite: [dhcp('3.1'), dhcp('4.3.2'), dhcp('4.1'), opt('9.7'), opt('9.1'), IANA_OPTIONS],
          },
          {
            id: 'fact-ack',
            label: 'After the ACK',
            value: 'the client uses the address and settings; not before',
            cite: [dhcp('3.1'), dhcp('4.4.1'), MS_BASICS_ZERO],
          },
          {
            id: 'fact-same',
            label: 'Same address',
            value: 'a client that keeps renewing keeps the same address',
            cite: [dhcp('2.2'), MS_TRAINING_SAME],
          },
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
              cite: [dhcp('4.4.4'), dhcp('4.1'), RFC1122_ADDRESSES],
            },
            {
              text: 'Broadcasts are faster.',
              feedback: 'Not quite. It broadcasts because it has nobody to address yet.',
              cite: [dhcp('4.4.4'), dhcp('3.1')],
            },
            {
              text: 'To tell everyone its new address.',
              feedback: 'Not quite. It has no address yet. That’s what it’s asking for.',
              cite: [dhcp('4.1'), dhcp('3.1')],
            },
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
              cite: [dhcp('4.4.6'), dhcp('4.4.5')],
            },
            {
              text: 'Asks the router directly to keep its address.',
              feedback: 'Yes. That’s a renewal: a direct Request, and an ACK starts the lease again.',
              cite: [dhcp('4.4.5'), MS_TRAINING_UNICAST, MS_TRAINING_RESET],
            },
            {
              text: 'Broadcasts a new Discover.',
              feedback: 'Not quite. It knows its server now, so it asks it directly.',
              cite: [dhcp('4.4.4'), dhcp('4.1'), dhcp('4.4.5')],
            },
          ],
          answer: 1,
        },
      ],
    },
  ],
});
