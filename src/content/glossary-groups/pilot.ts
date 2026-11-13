import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary pilot group (job 9): the ten terms of What is ICMP, plus IP address. Written from the analyst's report
 * and the orchestrator's rulings in its section 7. RFC 792 and RFC 1122
 * have no section anchors in their html, so each section is cited by the page it starts on, as What is ICMP does.
 * A citation is marked defining only where the document defines the thing the statement is about.
 */

const RFC792 = 'https://www.rfc-editor.org/rfc/rfc792.html';
const rfc792 = (section: string, page: number) => cite('rfc-792', section, { url: `${RFC792}#page-${page}`, defining: true });
const R792_ECHO = rfc792('Echo or Echo Reply Message, page 14', 14);
const R792_ECHO_DATA = rfc792('Echo or Echo Reply Message, page 15', 15);
const R792_DU = rfc792('Destination Unreachable Message, page 4', 4);
const R792_DU_HOST = rfc792('Destination Unreachable Message, page 5', 5);
const R792_TE = rfc792('Time Exceeded Message, page 6', 6);
/** The Introduction is on page 1, which has no id, so it is cited by a text fragment; it does not define packet loss, so it is not marked. */
const R792_INTRO = cite('rfc-792', 'Introduction', { url: `${RFC792}#:~:text=Some%20datagrams%20may%20still%20be%20undelivered` });

const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const R1122_ECHO = cite('rfc-1122', '3.2.2.6', { url: `${RFC1122}#page-42` });
const R1122_TTL = cite('rfc-1122', '3.2.1.7', { url: `${RFC1122}#page-34` });

const rfc1812 = (section: string, defining = false) => cite('rfc-1812', section, defining ? { defining: true } : {});
const R1812_TTL = rfc1812('5.3.1', true);
const rfc791 = (section: string) => cite('rfc-791', section, { defining: true });
const rfc2151 = (section: string) => cite('rfc-2151', section);

const MSP = 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ping';
const MS_PING = cite('microsoft-ping', 'Introduction', { url: `${MSP}#:~:text=Verifies%20IP` });
const MS_PING_PARAMS = cite('microsoft-ping', 'Parameters', { url: `${MSP}#parameters` });
const MST = 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tracert';
const MS_TRACERT = cite('microsoft-tracert', 'Introduction', { url: `${MST}#:~:text=This%20diagnostic%20tool%20determines%20the%20path` });
const AZURE_TUNING = 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-tcpip-performance-tuning';
const AZURE_PING = cite('microsoft-azure-tcpip-tuning', 'Measure round-trip time and packet loss', { url: `${AZURE_TUNING}#measure-round-trip-time-and-packet-loss` });
const AZURE_LATENCY = cite('microsoft-azure-tcpip-tuning', 'Internet performance considerations', { url: `${AZURE_TUNING}#internet-performance-considerations` });

const CP = 'https://www.cisco.com/c/en/us/support/docs/ios-nx-os-software/ios-software-releases-121-mainline/12778-ping-traceroute.html';
const CISCO_PING = cite('cisco-ping-traceroute', 'Ping Command', { url: `${CP}#:~:text=The%20ping%20command%20first%20sends` });
const CISCO_TRACE = cite('cisco-ping-traceroute', 'Traceroute Command', { url: `${CP}#:~:text=The%20traceroute%20command%20is%20used%20to%20discover` });
const CISCO_PERF = cite('cisco-ping-traceroute', 'Performance', { url: `${CP}#:~:text=required%20to%20send%20an%20echo%20packet%20and%20get%20an%20answer%20back` });

const G114 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-G.114-200305-I!!PDF-E&type=items';
/** G.114's section 1, Introduction, is on PDF page 7. */
const G114_INTRO = cite('itu-g114', '1', { url: `${G114}#page=7` });

const MS_SUBNET = cite('microsoft-tcpip-subnetting', 'IP addresses: Networks and hosts', {
  url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting#:~:text=An%20IP%20address%20is%20a%2032-bit%20number',
});

export default defineGlossaryGroup({
  id: 'pilot',
  entries: [
    {
      id: 'echo-request',
      term: 'Echo request',
      definition: [
        { id: 'echo-request-1', text: 'An echo request is an ICMP message that asks the device it is sent to for an answer.', cite: [R792_ECHO, R1122_ECHO] },
        {
          id: 'echo-request-2',
          text: 'The device sends back an echo reply carrying the same data, which shows that it can be reached.',
          cite: [R792_ECHO_DATA, R1122_ECHO, rfc2151('3.2')],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-echo-request' }],
    },
    {
      id: 'echo-reply',
      term: 'Echo reply',
      definition: [
        { id: 'echo-reply-1', text: 'An echo reply is the ICMP message a device sends back when it receives an echo request.', cite: [R792_ECHO, R1122_ECHO] },
        {
          id: 'echo-reply-2',
          text: 'It carries the request’s data back to the sender, which learns that the device was reached and how long the answer took.',
          cite: [R792_ECHO_DATA, MS_PING, CISCO_PERF],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-echo-reply' }],
    },
    {
      id: 'ping',
      term: 'Ping',
      definition: [
        {
          id: 'ping-1',
          text: 'Ping is a tool that sends ICMP echo requests to a device and shows each echo reply that comes back, with the time it took.',
          cite: [MS_PING, rfc2151('3.2'), CISCO_PING],
        },
        {
          id: 'ping-2',
          text: 'It tells you whether the device can be reached, the round-trip time and how many packets were lost.',
          cite: [rfc2151('3.2'), AZURE_PING, CISCO_PING],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-ping' }],
    },
    {
      id: 'latency',
      term: 'Latency',
      definition: [
        { id: 'latency-1', text: 'Latency is the delay data meets on its way across a network.', cite: [G114_INTRO, AZURE_LATENCY] },
        {
          id: 'latency-2',
          text: 'It can be measured one way, or there and back as the round-trip time, which is what ping shows for each reply.',
          cite: [G114_INTRO, AZURE_PING, CISCO_PERF],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-latency' }],
    },
    {
      id: 'ttl',
      term: 'TTL',
      also: ['Time to Live'],
      senses: [
        {
          id: 'ip',
          label: 'In IP packets',
          definition: [
            {
              id: 'ttl-ip-1',
              text: 'The TTL (Time to Live) is a number in every IPv4 packet’s header, set by the sender.',
              cite: [rfc791('3.1'), rfc791('1.4')],
            },
            {
              id: 'ttl-ip-2',
              text: 'Each router that passes the packet on lowers it by at least one, and at zero the packet is thrown away, so it cannot circle the network forever.',
              cite: [R1812_TTL, R1122_TTL],
            },
            { id: 'ttl-ip-3', text: 'IPv6 calls the same field the Hop Limit.', cite: [cite('rfc-8200', '3', { defining: true })] },
          ],
          lessons: [
            { lesson: 'what-is-icmp', term: 'term-ttl' },
            { lesson: 'what-is-ip', term: 'term-ttl' },
          ],
        },
        {
          id: 'dns',
          label: 'In DNS',
          definition: [
            {
              id: 'ttl-dns-1',
              text: 'In DNS, the TTL (Time to Live) is the number of seconds a record may be kept in a cache before the source has to be asked again.',
              cite: [cite('rfc-8767', '4', { defining: true }), cite('rfc-1034', '3.6', { defining: true })],
            },
            { id: 'ttl-dns-2', text: 'The administrator of the domain’s zone sets it.', cite: [cite('rfc-1034', '3.6', { defining: true })] },
          ],
          lessons: [{ lesson: 'what-is-dns', term: 'term-ttl' }],
        },
      ],
    },
    {
      id: 'time-exceeded',
      term: 'Time exceeded',
      definition: [
        {
          id: 'time-exceeded-1',
          text: 'Time exceeded is the ICMP message a router sends back to a packet’s sender when it throws the packet away because its TTL ran out.',
          cite: [R792_TE, rfc1812('5.2.7.3', true)],
        },
        { id: 'time-exceeded-2', text: 'Traceroute depends on these messages.', cite: [R1812_TTL] },
        {
          id: 'time-exceeded-3',
          text: 'A host may also send one when it gives up putting a split packet back together.',
          cite: [R792_TE],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-time-exceeded' }],
    },
    {
      id: 'traceroute',
      term: 'Traceroute',
      definition: [
        {
          id: 'traceroute-1',
          text: 'Traceroute is a tool that shows the route packets take to a device, one router at a time.',
          cite: [rfc2151('3.4'), MS_TRACERT, CISCO_TRACE],
        },
        {
          id: 'traceroute-2',
          text: 'It sends probes with a TTL of 1, then 2, then 3, and each router where a probe’s TTL runs out sends back a time exceeded message, so the routers appear in order.',
          cite: [MS_TRACERT, CISCO_TRACE, rfc1812('5.3.1')],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-traceroute' }],
    },
    {
      id: 'destination-unreachable',
      term: 'Destination unreachable',
      definition: [
        {
          id: 'destination-unreachable-1',
          text: 'Destination unreachable is the ICMP message sent back to a packet’s sender when the packet cannot be delivered.',
          cite: [rfc1812('5.2.7.1', true), R792_DU_HOST],
        },
        {
          id: 'destination-unreachable-2',
          text: 'A router sends it when it has no route to the destination; the destination itself sends it when nothing there is using the protocol or port the packet was for.',
          cite: [R792_DU, R792_DU_HOST, rfc1812('5.2.7.1', true)],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-unreachable' }],
    },
    {
      id: 'packet-loss',
      term: 'Packet loss',
      definition: [
        {
          id: 'packet-loss-1',
          text: 'Packet loss is packets that are sent but never arrive.',
          cite: [cite('rfc-7680', '2.4'), R792_INTRO],
        },
        {
          id: 'packet-loss-2',
          text: 'Ping shows it as the share of its echo requests that got no reply in time, such as 1 lost out of 6.',
          cite: [rfc2151('3.2'), MS_PING_PARAMS, CISCO_PING],
        },
      ],
      lessons: [{ lesson: 'what-is-icmp', term: 'term-loss' }],
    },
    {
      id: 'ip-address',
      term: 'IP address',
      definition: [
        {
          id: 'ip-address-1',
          text: 'An IP address is the number the Internet Protocol uses to say where a device is on a network, so packets can be delivered to it.',
          cite: [rfc791('2.3'), rfc791('1.4'), MS_SUBNET],
        },
        {
          id: 'ip-address-2',
          text: 'It belongs to one network connection, so a device with several connections has several addresses.',
          cite: [cite('rfc-8200', '2', { defining: true }), rfc791('2.3')],
        },
        {
          id: 'ip-address-3',
          text: 'It is unique within its own network; private addresses are reused on other networks.',
          cite: [MS_SUBNET, cite('rfc-1918', '3')],
        },
      ],
      lessons: [
        { lesson: 'dhcp', term: 'term-ip' },
        { lesson: 'what-is-dhcp', term: 'term-ip' },
        { lesson: 'what-is-http', term: 'term-ip' },
        { lesson: 'what-is-ip', term: 'term-ip' },
      ],
    },
  ],
});
