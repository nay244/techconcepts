import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * Glossary group `transport` (job 10, batch 1): TCP, UDP, TCP connection, three-way handshake, sequence number, ACK
 * (in TCP and in DHCP), retransmission, connectionless and jitter. Written from the analyst's report and the
 * orchestrator's rulings. RFC 9293 defines TCP, RFC 768 defines UDP and RFC 2131 defines DHCP's messages, so their
 * citations are marked defining; RFC 6298 and RFC 5681 define when TCP resends. No standard defines "jitter" or
 * "connectionless" as a general word, so neither entry marks a citation. RFC 768 has no section ids, so it is cited by
 * heading with a text fragment; RFC 1122 by the page its section starts on.
 */

const tcp = (section: string) => cite('rfc-9293', section, { defining: true });
const R9293_1 = cite('rfc-9293', '1', { url: 'https://www.rfc-editor.org/rfc/rfc9293.html#section-1', defining: true });

const RFC768 = 'https://www.rfc-editor.org/rfc/rfc768.html';
const rfc768 = (section: string, fragment: string) => cite('rfc-768', section, { url: `${RFC768}#:~:text=${fragment}`, defining: true });
const R768_DEFINED = rfc768('Introduction', 'This%20User%20Datagram');
const R768_NOT_GUARANTEED = rfc768('Introduction', 'transaction%20oriented,%20and%20delivery');
const R768_USE_TCP = rfc768('Introduction', 'Applications%20requiring%20ordered%20reliable');

const RFC1122 = 'https://www.rfc-editor.org/rfc/rfc1122.html';
const R1122_113 = cite('rfc-1122', '1.1.3', { url: `${RFC1122}#page-9` });
const R1122_411 = cite('rfc-1122', '4.1.1', { url: `${RFC1122}#page-77` });

const rfc8085 = (section: string) => cite('rfc-8085', section);
const NIST_2_1 = cite('nist-sp800-77r1', '2.1', { url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-77r1.pdf#page=20' });

const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
/** X.200 section 5.3.3.3 is on PDF page 15. */
const X200_CONNECTIONLESS = cite('itu-x200', '5.3.3.3', { url: `${X200}#page=15` });

const G114 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-G.114-200305-I!!PDF-E&type=items';
/** G.114's Annex A.3, "Delay due to IP delay variation buffer", is on PDF page 13. */
const G114_A3 = cite('itu-g114', 'Annex A.3', { url: `${G114}#page=13` });

const MS_DHCP = 'https://learn.microsoft.com/en-us/windows-server/troubleshoot/dynamic-host-configuration-protocol-basics';
const MS_DHCPACK = cite('microsoft-dhcp-basics', 'DHCPACK', { url: `${MS_DHCP}#dhcpack` });

export default defineGlossaryGroup({
  id: 'transport',
  entries: [
    {
      id: 'tcp',
      term: 'TCP',
      also: ['Transmission Control Protocol'],
      definition: [
        {
          id: 'tcp-1',
          text: 'TCP (Transmission Control Protocol) is a transport protocol that gives programs a reliable, in-order stream of bytes, sent over IP.',
          cite: [tcp('2.2'), R9293_1, R1122_113],
        },
        { id: 'tcp-2', text: 'It opens a connection before data flows, numbers every byte and sends again whatever is lost.', cite: [tcp('2.2'), tcp('3.4')] },
        { id: 'tcp-3', text: 'Port numbers tell apart the programs using it.', cite: [tcp('2.2')] },
      ],
    },
    {
      id: 'udp',
      term: 'UDP',
      also: ['User Datagram Protocol'],
      definition: [
        {
          id: 'udp-1',
          text: 'UDP (User Datagram Protocol) is a transport protocol that lets a program send a message, a datagram, to another program over IP with a minimum of machinery.',
          cite: [R768_DEFINED],
        },
        {
          id: 'udp-2',
          text: 'It sets up no connection, and delivery, order and protection from duplicates are not guaranteed.',
          cite: [R768_NOT_GUARANTEED, rfc8085('1'), rfc8085('3.3')],
        },
        { id: 'udp-3', text: 'Programs that need those use TCP, or provide them themselves.', cite: [R768_USE_TCP, rfc8085('3.3'), R1122_411] },
      ],
    },
    {
      id: 'tcp-connection',
      term: 'TCP connection',
      definition: [
        {
          id: 'tcp-connection-1',
          text: 'A TCP connection is a path for data that two programs set up through TCP before they exchange data.',
          cite: [tcp('4'), tcp('3.8')],
        },
        { id: 'tcp-connection-2', text: 'It is identified by the IP address and port at each end.', cite: [tcp('4')] },
        {
          id: 'tcp-connection-3',
          text: 'It is opened by the three-way handshake, carries data both ways, and is closed when they are done.',
          cite: [tcp('3.5'), tcp('2.2'), tcp('3.6')],
        },
      ],
      lessons: [{ lesson: 'what-is-http', term: 'term-tcp' }],
    },
    {
      id: 'three-way-handshake',
      term: 'Three-way handshake',
      definition: [
        {
          id: 'three-way-handshake-1',
          text: 'The three-way handshake is how TCP opens a connection: a SYN, a SYN and ACK in reply, then an ACK.',
          cite: [tcp('3.5')],
        },
        {
          id: 'three-way-handshake-2',
          text: 'Through it, each side tells the other the sequence number it will start from and confirms the other’s.',
          cite: [tcp('3.4.1')],
        },
        { id: 'three-way-handshake-3', text: 'It also stops an old, delayed request from opening a connection by mistake.', cite: [tcp('3.5')] },
      ],
      lessons: [{ lesson: 'what-is-tcp', term: 'term-handshake' }],
    },
    {
      id: 'sequence-number',
      term: 'Sequence number',
      definition: [
        {
          id: 'sequence-number-1',
          text: 'In TCP, every byte of data sent over a connection has a sequence number, and each segment carries the number of its first byte.',
          cite: [tcp('3.4'), tcp('3.1')],
        },
        {
          id: 'sequence-number-2',
          text: 'The numbers let the receiver acknowledge what arrived, notice what is missing and put the bytes in order.',
          cite: [tcp('3.4'), cite('rfc-9293', '2.2'), cite('rfc-9293', '3.10.7.4'), R1122_113],
        },
        { id: 'sequence-number-3', text: 'Each side chooses its own starting number when the connection opens.', cite: [tcp('3.4.1')] },
      ],
      lessons: [{ lesson: 'what-is-tcp', term: 'term-seq' }],
    },
    {
      id: 'ack',
      term: 'ACK',
      also: ['DHCPACK'],
      senses: [
        {
          id: 'tcp',
          label: 'In TCP',
          definition: [
            {
              id: 'ack-tcp-1',
              text: 'In TCP, ACK (acknowledge) is a flag in a segment’s header: the segment’s acknowledgment number gives the next byte the sender expects.',
              cite: [tcp('4'), tcp('3.1')],
            },
            { id: 'ack-tcp-2', text: 'That confirms that every byte before it has arrived.', cite: [tcp('3.4')] },
            { id: 'ack-tcp-3', text: 'Once a connection is open, every segment carries one.', cite: [tcp('3.1'), tcp('3.8')] },
          ],
          lessons: [{ lesson: 'what-is-tcp', term: 'term-ack' }],
        },
        {
          id: 'dhcp',
          label: 'In DHCP',
          definition: [
            {
              id: 'ack-dhcp-1',
              text: 'In DHCP, the ACK (DHCPACK) is the message a DHCP server sends to confirm a client’s request for an address.',
              cite: [cite('rfc-2131', '3.1', { defining: true }), MS_DHCPACK],
            },
            {
              id: 'ack-dhcp-2',
              text: 'It carries the address the client may now use, its other settings and how long the lease lasts.',
              cite: [cite('rfc-2131', '3.1', { defining: true }), MS_DHCPACK],
            },
          ],
          lessons: [
            { lesson: 'dhcp', term: 'term-ack' },
            { lesson: 'what-is-dhcp', term: 'term-ack' },
          ],
        },
      ],
    },
    {
      id: 'retransmission',
      term: 'Retransmission',
      definition: [
        {
          id: 'retransmission-1',
          text: 'Retransmission is sending data again because it seems to have been lost.',
          cite: [tcp('3.8'), cite('rfc-5681', '3.2', { defining: true })],
        },
        {
          id: 'retransmission-2',
          text: 'TCP resends a segment when no acknowledgment for it arrives before a timer runs out, or sooner when duplicate ACKs show it is missing.',
          cite: [cite('rfc-6298', '5', { defining: true }), cite('rfc-5681', '3.2', { defining: true }), cite('rfc-6298', '1')],
        },
        {
          id: 'retransmission-3',
          text: 'UDP does not retransmit: a program that needs lost data sent again must do it itself.',
          cite: [rfc8085('3.3'), R1122_411],
        },
      ],
      lessons: [{ lesson: 'what-is-tcp', term: 'term-retransmission' }],
    },
    {
      id: 'connectionless',
      term: 'Connectionless',
      definition: [
        {
          id: 'connectionless-1',
          text: 'Connectionless describes sending data without first setting up a connection: each message carries everything needed to deliver it and is handled on its own.',
          cite: [X200_CONNECTIONLESS, rfc8085('1')],
        },
        { id: 'connectionless-2', text: 'UDP and IP work this way; TCP is connection-oriented.', cite: [R1122_113, NIST_2_1] },
        {
          id: 'connectionless-3',
          text: 'With no setup or teardown, there is less overhead and little to keep track of.',
          cite: [rfc8085('1'), X200_CONNECTIONLESS],
        },
      ],
      lessons: [{ lesson: 'what-is-udp', term: 'term-connectionless' }],
    },
    {
      id: 'jitter',
      term: 'Jitter',
      definition: [
        {
          id: 'jitter-1',
          text: 'Jitter is variation in delay: packets of the same stream take different times to arrive, because they meet queues of different lengths or take different routes.',
          cite: [G114_A3, cite('rfc-3550', '6.4.1')],
        },
        {
          id: 'jitter-2',
          text: 'Voice calls smooth it out with a jitter buffer at the receiver, and a packet that arrives too late to be played is thrown away.',
          cite: [G114_A3, cite('rfc-3611', '4.7')],
        },
      ],
      lessons: [{ lesson: 'what-is-udp', term: 'term-jitter' }],
    },
  ],
});
