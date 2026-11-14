import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary group `leases` (job 10, batch 1): DHCP and the words around it, plus Broadcast, MAC address, ARP and
 * Default gateway. Written from the analyst's report and the orchestrator's rulings in its section 7. A citation is
 * marked defining only where the document defines the thing the statement is about: RFC 2131 defines DHCP, its
 * messages, leases and renewal; RFC 2132 its options; RFC 826 ARP; RFC 1122 the IP broadcast addresses and a host's
 * choice of gateway; RFC 919 broadcasting. No allowed source defines the MAC address, so each of its statements rests on
 * two sources.
 */

const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true } : {});
const dhcp = (section: string) => rfc('rfc-2131', section, true);
const R2131_1_UNMARKED = rfc('rfc-2131', '3.1');

/** RFC 1122 has no ids below its top-level sections, so a section is cited by the page it starts on. */
const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const R1122_BROADCAST = cite('rfc-1122', '3.2.1.3', { url: `${RFC1122}#page-30`, defining: true });
const R1122_ARP = cite('rfc-1122', '2.3.2', { url: `${RFC1122}#page-22` });
const R1122_ROUTE = cite('rfc-1122', '3.3.1', { url: `${RFC1122}#page-47`, defining: true });
const R1122_DEFAULT = cite('rfc-1122', '3.3.1.2', { url: `${RFC1122}#page-48`, defining: true });

/** RFC 826 has no section ids, so each section is cited by a text fragment that starts in it. */
const arp = (section: string, fragment: string) =>
  cite('rfc-826', section, { url: `https://www.rfc-editor.org/rfc/rfc826.html#:~:text=${fragment}`, defining: true });
const ARP_ABSTRACT = arp('Abstract', 'Presented%20here%20is%20a%20protocol');
const ARP_GENERATION = arp('Packet Generation', 'As%20a%20packet%20is%20sent%20down%20through%20the%20network%20layers');
const ARP_EXAMPLE = arp('An Example', 'and%20broadcasts%20this%20packet%20to%20everybody');
const ARP_GENERATION_UNMARKED = cite('rfc-826', 'Packet Generation', {
  url: 'https://www.rfc-editor.org/rfc/rfc826.html#:~:text=It%20then%20causes%20this%20packet%20to%20be%20broadcast',
});

/** A vendor's page has no section numbers, so a section is cited by a text fragment that starts in it. */
const vendor = (source: string, base: string, section: string, text: string) => cite(source, section, { url: `${base}#:~:text=${text}` });

const NETSET_URL = 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/essential-network-settings-and-tasks-in-windows';
const MS_NETSET_DHCP = vendor('microsoft-network-settings', NETSET_URL, 'Change TCP/IP Settings', 'DHCP%20automatically%20assigns%20Internet%20Protocol');
const MS_NETSET_ROUTER = vendor(
  'microsoft-network-settings',
  NETSET_URL,
  'Change TCP/IP Settings',
  'IP%20address%20settings%20and%20DNS%20server%20address%20setting%20are%20set%20automatically',
);
const GOOGLE_LAN = vendor('google-nest-lan-ip', 'https://support.google.com/googlehome/answer/7571856', 'Set a custom LAN IP', 'customize%20your%20router%20LAN%20address');

const TROUBLE_URL = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue';
const msTrouble = (text: string) => vendor('microsoft-dhcp-troubleshoot', TROUBLE_URL, 'More information', text);
const MS_DORA = msTrouble('Broadcast-based%20DORA');
const MS_DISCOVER = msTrouble('The%20DHCP%20client%20sends%20a%20DHCP%20Discover%20broadcast');
const MS_OFFER = msTrouble('A%20DHCP%20Offer%20broadcast%20response');
const MS_REQUEST = msTrouble('The%20DHCP%20client%20broadcast%20Request%20asks');

const BASICS_URL = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/dynamic-host-configuration-protocol-basics';
const MS_BASICS_REQUEST = vendor('microsoft-dhcp-basics', BASICS_URL, 'More Information', 'Client%20Broadcast%200.0.0.0%20255.255.255.255%20DHCP%20Request');

const SERVER_URL = 'https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-top';
const msServer = (section: string, text: string) => vendor('microsoft-dhcp-server', SERVER_URL, section, text);
const MS_SERVER_POOL = msServer('Why use DHCP?', 'The%20DHCP%20server%20maintains%20a%20pool%20of%20IP%20addresses');
const MS_SERVER_DATABASE = msServer('Why use DHCP?', 'The%20DHCP%20server%20stores%20the%20configuration%20information');
const MS_SERVER_RETURNED = msServer('Why use DHCP?', 'addresses%20no%20longer%20in%20use%20are%20automatically%20returned');
const MS_SERVER_DURATION = msServer('Why use DHCP?', 'The%20lease%20duration%2C%20or%20the%20length%20of%20time');
const MS_SERVER_OPTIONS = msServer('Why use DHCP?', 'Some%20examples%20of%20DHCP%20options%20are%20Router');

const TRAINING_URL =
  'https://learn.microsoft.com/en-us/training/modules/deploy-manage-dynamic-host-configuration-protocol/2-use-dynamic-host-configuration-protocol-simplify-ip-configuration';
const training = (section: string, text: string) => vendor('microsoft-dhcp-training', TRAINING_URL, section, text);
const MS_TRAINING_LEASE = training('How DHCP works', 'Clients%20can%20use%20the%20assigned%20DHCP%20address%20for%20a%20certain%20period');
const MS_TRAINING_MANY = training('How DHCP works', 'If%20multiple%20DHCP%20servers%20receive%20the%20DHCPDISCOVER%20packet');
const MS_TRAINING_FIRST = training('How DHCP works', 'If%20the%20client%20receives%20multiple%20DHCPOFFER%20packets');
const MS_TRAINING_DECLINED = training('How DHCP works', 'This%20informs%20the%20DHCP%20servers%20that%20receive%20the%20broadcast');
const MS_TRAINING_ROUTED = training('How DHCP works', 'Because%20IP%20broadcasts%20aren%27t%20routed');
const MS_TRAINING_HALF = training('DHCP lease renewal', 'When%20the%20DHCP%20lease%20reaches%2050%20percent');
const MS_TRAINING_UNICAST = training('DHCP lease renewal', 'sends%20a%20unicast%20DHCPREQUEST');
const MS_TRAINING_LATER = training('DHCP lease renewal', 'If%20the%20DHCP%20client%20cannot%20contact%20the%20DHCP%20server');
const MS_TRAINING_RESET = training('DHCP lease renewal', 'If%20renewal%20is%20successful');

const MS_SUBNET_URL = 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting';
const MS_GATEWAY = vendor('microsoft-tcpip-subnetting', MS_SUBNET_URL, 'Default gateways', 'a%20router%20that%20is%20specified%20on%20a%20host');
const MS_ROUTE = cite('microsoft-route', 'Parameters', {
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/route_ws2008#parameters',
});
const MS_ARP = cite('microsoft-arp', 'Introduction', {
  url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp#:~:text=The%20arp%20command%20displays%20and%20modifies',
});
const MS_WIFI_RANDOM = cite('microsoft-wifi-connect', 'Random hardware addresses', {
  url: 'https://support.microsoft.com/en-us/windows/experience/connectivity-networking/connect-to-a-wi-fi-network-in-windows#random-hardware-addresses',
});

export default defineGlossaryGroup({
  id: 'leases',
  entries: [
    {
      id: 'dhcp',
      term: 'DHCP',
      also: ['Dynamic Host Configuration Protocol'],
      definition: [
        {
          id: 'dhcp-1',
          text: 'DHCP, the Dynamic Host Configuration Protocol, gives a device the settings it needs to use a network, such as an IP address, so nobody has to type them in.',
          cite: [dhcp('1'), dhcp('1.6'), MS_NETSET_DHCP],
        },
        { id: 'dhcp-2', text: 'A DHCP server lends each address for a set time, called a lease.', cite: [dhcp('2.2'), MS_TRAINING_LEASE] },
        {
          id: 'dhcp-3',
          text: 'A device gets a new address in four messages: Discover, Offer, Request and Acknowledge.',
          cite: [dhcp('3.1'), MS_DORA],
        },
      ],
    },
    {
      id: 'dhcp-server',
      term: 'DHCP server',
      definition: [
        {
          id: 'dhcp-server-1',
          text: 'A DHCP server is a device that hands out IP addresses and other network settings to DHCP clients.',
          cite: [dhcp('1.5'), dhcp('1'), MS_SERVER_POOL],
        },
        {
          id: 'dhcp-server-2',
          text: 'It keeps a record of which address it has lent to which client, and for how long.',
          cite: [dhcp('1.5'), dhcp('3.1'), dhcp('4.3.1'), MS_SERVER_DATABASE],
        },
        { id: 'dhcp-server-3', text: 'In a home, the Wi-Fi router usually does this job.', cite: [MS_NETSET_ROUTER, GOOGLE_LAN] },
      ],
      lessons: [{ lesson: 'what-is-dhcp', term: 'term-server' }],
    },
    {
      id: 'discover',
      term: 'Discover',
      also: ['DHCP Discover', 'DHCPDISCOVER'],
      definition: [
        {
          id: 'discover-1',
          text: 'A DHCP Discover (DHCPDISCOVER) is the first message a device sends to get an IP address: it broadcasts it on its local network to find DHCP servers.',
          cite: [dhcp('3.1'), MS_DISCOVER],
        },
        { id: 'discover-2', text: 'Each DHCP server that receives the Discover may answer with an Offer.', cite: [dhcp('3.1'), MS_TRAINING_MANY] },
      ],
      lessons: [
        { lesson: 'dhcp', term: 'term-discover' },
        { lesson: 'what-is-dhcp', term: 'term-discover' },
      ],
    },
    {
      id: 'offer',
      term: 'Offer',
      also: ['DHCP Offer', 'DHCPOFFER'],
      definition: [
        {
          id: 'offer-1',
          text: 'A DHCP Offer (DHCPOFFER) is the message a DHCP server sends in reply to a Discover, offering the device an available IP address and other settings.',
          cite: [dhcp('3.1'), MS_OFFER],
        },
        { id: 'offer-2', text: 'The Offer also says how long the address may be kept.', cite: [rfc('rfc-2132', '9.2', true), dhcp('4.3.1')] },
        { id: 'offer-3', text: 'A device may receive several Offers and picks one.', cite: [dhcp('3.1'), MS_TRAINING_FIRST] },
      ],
      lessons: [
        { lesson: 'dhcp', term: 'term-offer' },
        { lesson: 'what-is-dhcp', term: 'term-offer' },
      ],
    },
    {
      id: 'request',
      term: 'Request',
      also: ['DHCP Request', 'DHCPREQUEST'],
      definition: [
        {
          id: 'request-1',
          text: 'A DHCP Request (DHCPREQUEST) is the message a device sends to accept one server’s Offer and ask for that address.',
          cite: [dhcp('3.1'), MS_BASICS_REQUEST, MS_REQUEST],
        },
        {
          id: 'request-2',
          text: 'It is broadcast, so the other servers learn that their Offers were declined.',
          cite: [dhcp('3.1'), MS_TRAINING_DECLINED],
        },
        { id: 'request-3', text: 'A device also sends a Request later, to renew its lease.', cite: [dhcp('4.4.5'), MS_TRAINING_UNICAST] },
      ],
      lessons: [
        { lesson: 'dhcp', term: 'term-request' },
        { lesson: 'what-is-dhcp', term: 'term-request' },
      ],
    },
    {
      id: 'lease',
      term: 'Lease',
      definition: [
        {
          id: 'lease-1',
          text: 'A lease is the time for which a DHCP server lends an IP address to a device.',
          cite: [dhcp('2.2'), MS_TRAINING_LEASE],
        },
        {
          id: 'lease-2',
          text: 'While it lasts, the server gives that address to no other device; if it runs out, the device must stop using it and the server may reuse it.',
          cite: [dhcp('2.2'), dhcp('3.7'), MS_SERVER_RETURNED],
        },
        {
          id: 'lease-3',
          text: 'The device can ask to extend it, which is called lease renewal.',
          cite: [dhcp('2.2'), MS_SERVER_DURATION],
        },
      ],
      lessons: [
        { lesson: 'dhcp', term: 'term-lease' },
        { lesson: 'what-is-dhcp', term: 'term-lease' },
      ],
    },
    {
      id: 'lease-renewal',
      term: 'Lease renewal',
      definition: [
        {
          id: 'lease-renewal-1',
          text: 'Lease renewal is a device asking to extend its DHCP lease before it runs out.',
          cite: [dhcp('4.4.5'), MS_TRAINING_HALF],
        },
        {
          id: 'lease-renewal-2',
          text: 'By default it asks halfway through the lease; if the server that gave the address does not answer, it later asks any server.',
          cite: [dhcp('4.4.5'), MS_TRAINING_LATER],
        },
        {
          id: 'lease-renewal-3',
          text: 'Each renewal starts the lease again, so a device can keep its address for a long time.',
          cite: [dhcp('4.4.5'), MS_TRAINING_RESET],
        },
      ],
      lessons: [
        { lesson: 'what-is-dhcp', term: 'term-renewal' },
        { lesson: 'dhcp', term: 'term-renew' },
      ],
    },
    {
      id: 'broadcast',
      term: 'Broadcast',
      definition: [
        {
          id: 'broadcast-1',
          text: 'A broadcast is a message sent to every device on the local network at once.',
          cite: [R1122_BROADCAST, rfc('rfc-919', '3', true)],
        },
        {
          id: 'broadcast-2',
          text: 'A device uses one when it does not know which device can answer, as when it looks for a DHCP server, or uses ARP to find who has an IP address.',
          cite: [rfc('rfc-919', '3', true), R2131_1_UNMARKED, ARP_GENERATION_UNMARKED],
        },
        { id: 'broadcast-3', text: 'Routers normally do not pass it on to other networks.', cite: [R1122_BROADCAST, MS_TRAINING_ROUTED] },
      ],
      lessons: [
        { lesson: 'dhcp', term: 'term-broadcast' },
        { lesson: 'what-is-dhcp', term: 'term-broadcast' },
      ],
    },
    {
      id: 'mac-address',
      term: 'MAC address',
      also: ['Media Access Control address'],
      definition: [
        {
          id: 'mac-address-1',
          text: 'A MAC address (Media Access Control address) identifies a network interface, such as an Ethernet or Wi-Fi adapter, on its local network.',
          cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), rfc('rfc-9542', '1'), rfc('rfc-9542', '2.1')],
        },
        {
          id: 'mac-address-2',
          text: 'Frames on that network carry MAC addresses to say which interface they are for.',
          cite: [rfc('rfc-9724', '2.2'), rfc('rfc-9542', '3')],
        },
        {
          id: 'mac-address-3',
          text: 'Most come with one set by the maker that is unique worldwide, but a device can use a random one instead, for privacy.',
          cite: [rfc('rfc-9724', '2.1'), rfc('rfc-9724', '2.2'), MS_WIFI_RANDOM],
        },
      ],
      lessons: [{ lesson: 'what-is-ip', term: 'term-mac' }],
    },
    {
      id: 'arp',
      term: 'ARP',
      also: ['Address Resolution Protocol'],
      definition: [
        {
          id: 'arp-1',
          text: 'ARP, the Address Resolution Protocol, finds the MAC address that goes with an IPv4 address on the local network.',
          cite: [ARP_ABSTRACT, R1122_ARP, rfc('rfc-4861', '3.1'), rfc('rfc-9724', '2.1'), MS_ARP],
        },
        {
          id: 'arp-2',
          text: 'A device broadcasts a request asking who has that IP address, and the device that has it replies with its MAC address.',
          cite: [ARP_GENERATION, ARP_EXAMPLE],
        },
        { id: 'arp-3', text: 'The answer is kept in an ARP cache, so the next packet needs no new request.', cite: [ARP_EXAMPLE, MS_ARP] },
      ],
      lessons: [{ lesson: 'what-is-ip', term: 'term-arp' }],
    },
    {
      id: 'default-gateway',
      term: 'Default gateway',
      definition: [
        {
          id: 'default-gateway-1',
          text: 'A default gateway is the router a device sends packets to when their destination is not on its own network.',
          cite: [R1122_DEFAULT, R1122_ROUTE, MS_GATEWAY],
        },
        {
          id: 'default-gateway-2',
          text: 'It must be on the device’s own network, and it sends each packet on toward its destination.',
          cite: [R1122_ROUTE, R1122_DEFAULT, MS_ROUTE, MS_GATEWAY],
        },
        {
          id: 'default-gateway-3',
          text: 'DHCP can tell a device which router to use.',
          cite: [rfc('rfc-2132', '3.5', true), MS_SERVER_OPTIONS],
        },
      ],
      lessons: [
        { lesson: 'subnetting', term: 'term-gateway' },
        { lesson: 'what-is-ip', term: 'term-gateway' },
      ],
    },
  ],
});
