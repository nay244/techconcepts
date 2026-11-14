import { defineGlossaryGroup } from '../glossary-group';
import { cite } from '../sources';

/**
 * The glossary group subnets (job 10, batch 2): ten entries on how an IP address is cut into a network part and a host part.
 * Written from the analyst's report and the orchestrator's rulings in it. RFC 950, 1122, 1812 (as cited here), 3021 and 4632
 * are cited by section; RFC 1122 and RFC 950 have no ids below their top-level sections, so a section is cited by the page it
 * starts on. A citation is marked defining only where the document defines the thing the statement is about; the two vendors'
 * pages (Microsoft, Cisco) are never marked.
 */

const rfc = (source: string, section: string, defining = false) => cite(source, section, defining ? { defining: true as const } : {});
const r1122 = (section: string, page: number) =>
  cite('rfc-1122', section, { url: `https://www.rfc-editor.org/rfc/rfc1122.html#page-${page}`, defining: true });
const r950 = (section: string, page: number) =>
  cite('rfc-950', section, { url: `https://www.rfc-editor.org/rfc/rfc950.html#page-${page}`, defining: true });

const MICROSOFT = 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcpip-addressing-and-subnetting';
const ms = (section: string, heading: string) => cite('microsoft-tcpip-subnetting', section, { url: `${MICROSOFT}#${heading}` });
const MS_HOSTS = ms('IP addresses, networks and hosts', 'ip-addresses-networks-and-hosts');
const MS_GLOSSARY = ms('Glossary', 'glossary');
const MS_MASK = ms('Subnet mask', 'subnet-mask');
const MS_SUBNETTING = ms('Subnetting', 'subnetting');
const MS_GATEWAYS = ms('Default gateways', 'default-gateways');
const MS_INCORRECT = ms('Incorrect IP address', 'incorrect-ip-address');

const CISCO_SUBNETS = 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html';
const CISCO_QUANTITIES = 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13790-8.html';
const CISCO_31BIT = cite('cisco-ip-subnets', '31-bit Subnets', { url: `${CISCO_SUBNETS}#:~:text=A%2030-bit%20subnet%20mask%20allows%20for%20four` });
const CISCO_BACKGROUND = cite('cisco-host-subnet-quantities', 'Background Information', { url: `${CISCO_QUANTITIES}#:~:text=An%20IP%20address%20is%2032%20bits%20long` });
const CISCO_TABLES = cite('cisco-host-subnet-quantities', 'Subnetting and Tables', { url: `${CISCO_QUANTITIES}#:~:text=As%20a%20concept%2C%20subnetting%20divides%20the%20network` });
const CISCO_EXAMPLE = cite('cisco-host-subnet-quantities', 'Subnet Example', { url: `${CISCO_QUANTITIES}#:~:text=A%20host%20portion%20with%20all%20zeros` });

const X200 = 'https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-X.200-199407-I!!PDF-E&type=items';
const x200 = (section: string, page: number) => cite('itu-x200', section, { url: `${X200}#page=${page}`, defining: true });

const RFC4949_BIT = cite('rfc-4949', '4', { url: 'https://www.rfc-editor.org/rfc/rfc4949.html#page-36' });
const FIPS197_BIT = cite('nist-fips-197', '2.1', { url: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197-upd1.pdf#page=10' });
const X200_LAYERS = x200('6.1.2', 32);
const CISCO_ADDRESSES = cite('cisco-ip-subnets', 'Understand IP Addresses', { url: `${CISCO_SUBNETS}#:~:text=The%20address%20is%20made%20up%20of%2032%20binary%20bits` });
const MS_OSI_PHYSICAL = cite('microsoft-osi', 'Physical layer', {
  url: 'https://learn.microsoft.com/en-us/windows-hardware/drivers/network/windows-network-architecture-and-the-osi-model#physical-layer',
});

export default defineGlossaryGroup({
  id: 'subnets',
  entries: [
    {
      id: 'bit',
      term: 'Bit',
      also: ['Binary digit'],
      definition: [
        { id: 'bit-1', text: 'A bit, short for binary digit, is a single digit that is either 0 or 1.', cite: [RFC4949_BIT, FIPS197_BIT] },
        {
          id: 'bit-2',
          text: 'An IPv4 address is 32 bits long, usually written as four numbers of 8 bits each, from 0 to 255.',
          cite: [rfc('rfc-791', '2.3', true), MS_HOSTS, MS_GLOSSARY, rfc('rfc-4632', '3.1'), CISCO_ADDRESSES],
        },
        {
          id: 'bit-3',
          text: 'The Physical Layer, layer 1 of the OSI model, sends data as bits over a physical medium.',
          cite: [x200('7.7.2', 53), X200_LAYERS, MS_OSI_PHYSICAL],
        },
      ],
    },
    {
      id: 'subnet',
      term: 'Subnet',
      also: ['Subnetwork'],
      definition: [
        {
          id: 'subnet-1',
          text: 'A subnet, or subnetwork, is a smaller network made by dividing a larger network’s block of IP addresses.',
          cite: [r950('Overview', 1), MS_GLOSSARY],
        },
        { id: 'subnet-2', text: 'Subnets let one block of addresses serve several physical networks.', cite: [r950('1', 3), MS_SUBNETTING] },
        {
          id: 'subnet-3',
          text: 'Devices on the same subnet send to each other directly; traffic for another subnet goes through a router.',
          cite: [r1122('3.3.1.1', 47), MS_GATEWAYS],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-subnet' }],
    },
    {
      id: 'subnet-mask',
      term: 'Subnet mask',
      definition: [
        {
          id: 'subnet-mask-1',
          text: 'A subnet mask is a 32-bit number with a 1 for each network bit of an IP address, then a 0 for each host bit.',
          cite: [r950('2.2', 7), r1122('3.3.1.1', 47), MS_MASK, MS_GLOSSARY, rfc('rfc-1812', '2.2.5.2')],
        },
        { id: 'subnet-mask-2', text: 'The mask 255.255.255.0, for example, is 24 ones then 8 zeros.', cite: [rfc('rfc-4632', '3.1', true), MS_MASK] },
        {
          id: 'subnet-mask-3',
          text: 'A device uses it to tell whether an address is on its own network or must be reached through its default gateway.',
          cite: [r1122('3.3.1.1', 47), MS_MASK, MS_GATEWAYS],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-mask' }],
    },
    {
      id: 'prefix-length',
      term: 'Prefix length',
      definition: [
        {
          id: 'prefix-length-1',
          text: 'The prefix length is the number of 1 bits in a subnet mask, written after a slash at the end of an address, as in 192.168.99.0/24.',
          cite: [rfc('rfc-4632', '3.1', true), rfc('rfc-1812', '2.2.5.1')],
        },
        {
          id: 'prefix-length-2',
          text: 'It says how many of the address’s first bits are the network portion; the rest are the host portion.',
          cite: [rfc('rfc-4632', '3.1', true), MS_MASK],
        },
        {
          id: 'prefix-length-3',
          text: 'So /24 means the same as the subnet mask 255.255.255.0.',
          cite: [rfc('rfc-4632', '3.1', true), MS_MASK, rfc('rfc-1812', '2.2.5.2')],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-prefix' }],
    },
    {
      id: 'network-portion',
      term: 'Network portion',
      definition: [
        {
          id: 'network-portion-1',
          text: 'The network portion is the first part of an IP address: it says which network the address belongs to.',
          cite: [rfc('rfc-4632', '3.1', true), MS_HOSTS, MS_GLOSSARY],
        },
        {
          id: 'network-portion-2',
          text: 'Devices on the same network have the same network portion, and routers use it to get a packet to the right network.',
          cite: [r1122('3.3.1.1', 47), MS_HOSTS, MS_INCORRECT, rfc('rfc-1812', '2.2.5.1'), CISCO_BACKGROUND],
        },
        {
          id: 'network-portion-3',
          text: 'The subnet mask, or the prefix length, says where it ends.',
          cite: [rfc('rfc-4632', '3.1', true), MS_MASK],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-network' }],
    },
    {
      id: 'host-portion',
      term: 'Host portion',
      definition: [
        {
          id: 'host-portion-1',
          text: 'The host portion is the rest of an IP address, after the network portion: it says which device, or host, on that network the address belongs to.',
          cite: [rfc('rfc-4632', '3.1', true), MS_HOSTS, MS_GLOSSARY],
        },
        {
          id: 'host-portion-2',
          text: 'Normally, a host portion of all 0s or all 1s is kept for the network address or the broadcast address, so a /24 has 254 addresses for devices.',
          cite: [cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-31', defining: true }), rfc('rfc-3021', '2.1', true), MS_SUBNETTING, rfc('rfc-4632', '2')],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-host' }],
    },
    {
      id: 'network-address',
      term: 'Network address',
      senses: [
        {
          id: 'subnetting',
          label: 'In subnetting',
          definition: [
            {
              id: 'network-address-subnetting-1',
              text: 'In subnetting, the network address is the first address of a network or subnet: its host portion is all 0s.',
              cite: [MS_GLOSSARY, MS_SUBNETTING, rfc('rfc-3021', '1'), CISCO_EXAMPLE],
            },
            {
              id: 'network-address-subnetting-2',
              text: 'It stands for the network itself, so it is normally not given to any device.',
              cite: [MS_SUBNETTING, cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-31', defining: true }), rfc('rfc-3021', '2.1', true), rfc('rfc-3021', '1'), CISCO_EXAMPLE],
            },
          ],
          lessons: [{ lesson: 'subnetting', term: 'term-netaddr' }],
        },
        {
          id: 'osi',
          label: 'In the OSI model',
          definition: [
            {
              id: 'network-address-osi-1',
              text: 'In the OSI model, a network address is the address the Network Layer, layer 3, uses to identify each end system.',
              cite: [x200('7.5.3.2', 46), X200_LAYERS],
            },
            {
              id: 'network-address-osi-2',
              text: 'Layer 3 finds a route between network addresses, so data can cross several networks on the way.',
              cite: [x200('7.5.4.2.1', 48), x200('7.5.2.3', 45), X200_LAYERS],
            },
          ],
        },
      ],
    },
    {
      id: 'broadcast-address',
      term: 'Broadcast address',
      definition: [
        {
          id: 'broadcast-address-1',
          text: 'A broadcast address is the last address of a network or subnet: its host portion is all 1s.',
          cite: [cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-30', defining: true }), rfc('rfc-919', '7', true), MS_GLOSSARY, MS_SUBNETTING],
        },
        {
          id: 'broadcast-address-2',
          text: 'A packet sent to it goes to every device on that network.',
          cite: [rfc('rfc-919', '7', true), cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-30', defining: true }), MS_SUBNETTING],
        },
        {
          id: 'broadcast-address-3',
          text: 'It is normally not given to any device; 255.255.255.255 is a separate broadcast address that reaches only the local network.',
          cite: [
            cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-30', defining: true }),
            cite('rfc-1122', '3.2.1.3', { url: 'https://www.rfc-editor.org/rfc/rfc1122.html#page-31', defining: true }),
            rfc('rfc-919', '7', true),
            rfc('rfc-3021', '2.1', true),
            MS_SUBNETTING,
          ],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-broadcast' }],
    },
    {
      id: 'borrowing-bits',
      term: 'Borrowing bits',
      definition: [
        {
          id: 'borrowing-bits-1',
          text: 'Borrowing bits is making subnets by turning some of the host portion’s bits into network bits, with a longer subnet mask.',
          cite: [r950('1', 3), r950('2.1', 5), MS_SUBNETTING, CISCO_TABLES],
        },
        {
          id: 'borrowing-bits-2',
          text: 'Each bit borrowed doubles the number of subnets and halves their size: 2 bits of a /24 make four subnets of 64 addresses.',
          cite: [rfc('rfc-4632', '3.1', true), MS_SUBNETTING, CISCO_EXAMPLE],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-borrow' }],
    },
    {
      id: 'point-to-point-link',
      term: 'Point-to-point link',
      definition: [
        {
          id: 'point-to-point-link-1',
          text: 'A point-to-point link connects exactly two devices, such as two routers, so whatever one end sends, the other receives.',
          cite: [rfc('rfc-4861', '2.2'), rfc('rfc-3021', '1'), CISCO_31BIT],
        },
        {
          id: 'point-to-point-link-2',
          text: 'In IPv4 it is often given its own /30 subnet: four addresses, two of them usable, one for each end.',
          cite: [rfc('rfc-3021', '1'), rfc('rfc-4632', '3.1', true), rfc('rfc-1812', '2.2.7'), CISCO_31BIT],
        },
        {
          id: 'point-to-point-link-3',
          text: 'A /31 subnet, with exactly two addresses and no network or broadcast address, uses two addresses instead of four.',
          cite: [rfc('rfc-3021', '2.1', true), rfc('rfc-3021', '1'), rfc('rfc-4632', '3.1', true), CISCO_31BIT],
        },
      ],
      lessons: [{ lesson: 'subnetting', term: 'term-p2p' }],
    },
  ],
});
