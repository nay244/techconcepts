import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary group packets (job 10, batch 1): twelve entries on the units of data and the devices that move them.
 * Written from the analyst's report and the orchestrator's rulings in it. RFC 1122, 792, 768 and 894 have no section
 * anchors in their html, so a section is cited by the page it starts on or by a text fragment. A citation is marked
 * defining only where the document defines the thing the statement is about.
 */

const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const r1122 = (section: string, page: number, defining?: true) =>
  cite('rfc-1122', section, { url: `${RFC1122}#page-${page}`, ...(defining ? { defining } : {}) });
const R1122_SEGMENT = r1122('1.3.3', 17);
const R1122_PACKET = r1122('1.3.3', 18);
const R1122_ROUTING = r1122('3.3.1', 47, true);
const R1122_LOCAL = r1122('3.3.1.1', 47, true);

const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
const x200 = (section: string, page: number) => cite('itu-x200', section, { url: `${X200}#page=${page}`, defining: true });
const X200_PCI = x200('5.6.1.1', 19);
const X200_USER = x200('5.6.1.2', 19);
const X200_PDU = x200('5.6.1.3', 19);
const X200_FIG9 = x200('5.6.2', 20);
const X200_SDU3 = x200('5.8.8.1.3', 27);
const X200_SDU4 = x200('5.8.8.1.4', 27);

const NIST = 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf';
const NIST_2_1 = cite('nist-sp800-77r1', '2.1', { url: `${NIST}#page=20` });
const NIST_FN6 = cite('nist-sp800-77r1', '2.1, footnote 6', { url: `${NIST}#page=20` });

const MS_OSI = cite('microsoft-osi', 'Data link layer', {
  url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model#data-link-layer',
});
const R894_FRAME = cite('rfc-894', 'Frame Format', { url: 'https://www.rfc-editor.org/rfc/rfc894.html#:~:text=IP%20datagrams%20are%20transmitted%20in%20standard%20Ethernet%20frames' });

const R768 = 'https://www.rfc-editor.org/rfc/rfc768.html';
const R768_FIELDS = cite('rfc-768', 'Fields', { url: `${R768}#:~:text=Length%20is%20the%20length%20in%20octets%20of%20this%20user%20datagram`, defining: true });
const R768_INTRO = cite('rfc-768', 'Introduction', { url: `${R768}#:~:text=delivery%20and%20duplicate%20protection%20are%20not%20guaranteed`, defining: true });

const R792 = 'https://www.rfc-editor.org/rfc/rfc792.html';
const R792_INTRO_ERR = cite('rfc-792', 'Introduction', { url: `${R792}#:~:text=Occasionally%20a%20gateway%20or%20destination%20host`, defining: true });
const R792_INTRO_FEEDBACK = cite('rfc-792', 'Introduction', { url: `${R792}#:~:text=provide%20feedback%20about%20problems`, defining: true });
const R792_INTRO_GATEWAY = cite('rfc-792', 'Introduction', { url: `${R792}#:~:text=The%20network%20connecting%20devices%20are%20called%20Gateways` });

const rfc791 = (section: string) => cite('rfc-791', section, { defining: true });
const rfc1812 = (section: string, defining = false) => cite('rfc-1812', section, defining ? { defining: true } : {});
const rfc8200 = (section: string) => cite('rfc-8200', section, { defining: true });
const rfc9293 = (section: string, defining = false) => cite('rfc-9293', section, defining ? { defining: true } : {});
const rfc9110 = (section: string) => cite('rfc-9110', section, { defining: true });

export default defineGlossaryGroup({
  id: 'packets',
  entries: [
    {
      id: 'protocol-data-unit',
      term: 'Protocol data unit',
      also: ['PDU'],
      definition: [
        {
          id: 'protocol-data-unit-1',
          text: 'A protocol data unit (PDU) is a unit of data defined by a protocol at one layer: that layer’s control information plus any data it carries for the layer above.',
          cite: [X200_PDU, X200_PCI, X200_USER, X200_FIG9],
        },
        { id: 'protocol-data-unit-2', text: 'The layer below carries the PDU as its own data.', cite: [X200_SDU3, X200_SDU4, NIST_2_1] },
        {
          id: 'protocol-data-unit-3',
          text: 'In the Internet’s protocols, TCP’s unit of data is called a segment and IP’s a datagram.',
          cite: [R1122_SEGMENT, R1122_PACKET, rfc9293('4', true), rfc791('1.1')],
        },
      ],
    },
    {
      id: 'header',
      term: 'Header',
      also: ['Header field'],
      senses: [
        {
          id: 'layer',
          label: 'In the layer model',
          definition: [
            {
              id: 'header-layer-1',
              text: 'A header is control information, such as addresses, that a protocol puts at the front of the data it carries.',
              cite: [rfc9293('4'), NIST_FN6],
            },
            {
              id: 'header-layer-2',
              text: 'As data passes down the layers, they add their own headers, so a frame starts with a link-layer header, then an IP header, then a TCP header.',
              cite: [NIST_2_1, R1122_PACKET, R1122_SEGMENT],
            },
          ],
          lessons: [{ lesson: 'osi-model', term: 'term-header' }],
        },
        {
          id: 'http',
          label: 'In HTTP',
          definition: [
            {
              id: 'header-http-1',
              text: 'In HTTP, header fields (headers, for short) are name and value pairs sent before the content of a request or a response.',
              cite: [rfc9110('6.3'), rfc9110('5')],
            },
            { id: 'header-http-2', text: 'They can describe the sender or the content, change what the message means, or add context.', cite: [rfc9110('6.3')] },
          ],
          lessons: [{ lesson: 'what-is-http', term: 'term-headers' }],
        },
      ],
    },
    {
      id: 'frame',
      term: 'Frame',
      definition: [
        {
          id: 'frame-1',
          text: 'A frame is the unit of data that a link layer protocol, such as Ethernet, sends: a link-layer header followed by a packet.',
          cite: [R1122_PACKET, MS_OSI, R894_FRAME],
        },
        {
          id: 'frame-2',
          text: 'A router takes the packet out of the frame it arrived in and sends it on in a new frame for the next link.',
          cite: [rfc1812('1', true), rfc1812('5.2.1.2', true), rfc791('2.2')],
        },
      ],
    },
    {
      id: 'packet',
      term: 'Packet',
      definition: [
        {
          id: 'packet-1',
          text: 'A packet is the unit of data at IP’s layer: an IP header followed by data.',
          cite: [R1122_PACKET, rfc8200('2')],
        },
        {
          id: 'packet-2',
          text: 'It may be a whole IP datagram, or a fragment of one that was split to cross a network that only takes smaller packets.',
          cite: [R1122_PACKET, rfc791('1.4')],
        },
        { id: 'packet-3', text: 'Routers forward packets from network to network toward their destination.', cite: [rfc8200('2'), NIST_2_1] },
      ],
    },
    {
      id: 'segment',
      term: 'Segment',
      definition: [
        {
          id: 'segment-1',
          text: 'A segment is the unit of data TCP sends: a TCP header followed by application data.',
          cite: [R1122_SEGMENT, rfc9293('4', true)],
        },
        {
          id: 'segment-2',
          text: 'TCP splits an application’s stream of bytes into segments, and each segment travels inside an IP datagram.',
          cite: [rfc9293('3.7'), rfc9293('2.2', true), R1122_SEGMENT],
        },
      ],
      lessons: [{ lesson: 'what-is-tcp', term: 'term-segment' }],
    },
    {
      id: 'datagram',
      term: 'Datagram',
      definition: [
        {
          id: 'datagram-1',
          text: 'A datagram is a message that travels on its own: the network handles each one separately, with no connection set up first.',
          cite: [rfc791('1.4'), rfc1812('2.2.1'), rfc9293('4')],
        },
        {
          id: 'datagram-2',
          text: 'IP’s unit of data is the IP datagram, and UDP’s messages are user datagrams.',
          cite: [R1122_PACKET, rfc791('1.1'), R768_FIELDS],
        },
        {
          id: 'datagram-3',
          text: 'Delivery is not guaranteed: a datagram may arrive damaged, duplicated, out of order or not at all.',
          cite: [rfc1812('2.2.1'), R768_INTRO],
        },
      ],
      lessons: [{ lesson: 'what-is-udp', term: 'term-datagram' }],
    },
    {
      id: 'ip',
      term: 'IP',
      also: ['Internet Protocol'],
      definition: [
        {
          id: 'ip-1',
          text: 'IP, the Internet Protocol, carries datagrams from a source host to a destination host across interconnected networks, using the addresses in their headers.',
          cite: [rfc791('1.2'), rfc791('1.4'), rfc1812('2.2.1')],
        },
        {
          id: 'ip-2',
          text: 'It does not guarantee delivery: protocols above it, such as TCP, provide reliability when it is needed.',
          cite: [rfc1812('2.2.1'), rfc791('1.2')],
        },
        { id: 'ip-3', text: 'IPv6 is the newer version, designed as the successor to IPv4.', cite: [rfc8200('1')] },
      ],
    },
    {
      id: 'ip-header',
      term: 'IP header',
      definition: [
        {
          id: 'ip-header-1',
          text: 'The IP header is the control information at the front of an IP packet, before the data it carries.',
          cite: [rfc791('2.2'), R1122_PACKET],
        },
        {
          id: 'ip-header-2',
          text: 'It holds the source and destination addresses, the Time to Live (Hop Limit in IPv6) and a number naming the protocol of the data inside.',
          cite: [rfc791('3.1'), rfc8200('3')],
        },
        { id: 'ip-header-3', text: 'Routers read it to decide where to send the packet next.', cite: [rfc1812('1', true), rfc791('1.4')] },
      ],
      lessons: [{ lesson: 'what-is-ip', term: 'term-header' }],
    },
    {
      id: 'router',
      term: 'Router',
      definition: [
        {
          id: 'router-1',
          text: 'A router is a device that connects two or more networks and forwards IP packets between them.',
          cite: [rfc1812('2.2.3', true), rfc8200('2')],
        },
        {
          id: 'router-2',
          text: 'It reads each packet’s IP header, then sends the packet on in a new frame for the next link.',
          cite: [rfc1812('1', true), rfc1812('5.2.1.2', true), rfc791('2.2')],
        },
        { id: 'router-3', text: 'Older documents call routers gateways.', cite: [rfc1812('2.2.3'), R792_INTRO_GATEWAY] },
      ],
    },
    {
      id: 'forwarding',
      term: 'Forwarding',
      definition: [
        {
          id: 'forwarding-1',
          text: 'Forwarding is what a router does with a packet that is not addressed to it: it sends the packet on toward its destination.',
          cite: [rfc1812('5.2.1.1', true), rfc8200('2')],
        },
        {
          id: 'forwarding-2',
          text: 'It looks up the destination in its routing table to choose the next hop: the next router or, on the last hop, the destination host.',
          cite: [rfc1812('2.2.3', true), rfc1812('5.2.1.2', true)],
        },
      ],
      lessons: [{ lesson: 'what-is-ip', term: 'term-forwarding' }],
    },
    {
      id: 'routing-decision',
      term: 'Routing decision',
      definition: [
        {
          id: 'routing-decision-1',
          text: 'A routing decision is the choice IP makes, for each packet it sends, of where the packet goes next.',
          cite: [R1122_ROUTING, rfc791('1.4')],
        },
        {
          id: 'routing-decision-2',
          text: 'A host first checks whether the destination is on its own connected network: if so, it sends the packet straight there; if not, to a router.',
          cite: [R1122_ROUTING, R1122_LOCAL, rfc1812('2.2.3')],
        },
        { id: 'routing-decision-3', text: 'A router decides by looking up the destination in its routing table.', cite: [rfc1812('5.2.1.2', true)] },
      ],
      lessons: [{ lesson: 'what-is-ip', term: 'term-routing' }],
    },
    {
      id: 'icmp',
      term: 'ICMP',
      also: ['Internet Control Message Protocol'],
      definition: [
        {
          id: 'icmp-1',
          text: 'ICMP, the Internet Control Message Protocol, lets a router or the destination host send messages back to the source, for example to report an error in handling a datagram.',
          cite: [R792_INTRO_ERR, rfc1812('2.2.1')],
        },
        {
          id: 'icmp-2',
          text: 'It is part of IP and travels inside IP datagrams; it gives feedback about problems but does not make IP reliable.',
          cite: [R792_INTRO_FEEDBACK, rfc1812('2.2.1')],
        },
        { id: 'icmp-3', text: 'IPv6 has its own version, ICMPv6.', cite: [cite('rfc-4443', '2', { defining: true })] },
      ],
    },
  ],
});
