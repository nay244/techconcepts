import { parseIPv4 } from '../../engine/net/ipv4';
import type { Field, Layer, Packet } from '../schema';

/**
 * Builders for the layers of a packet, so a lesson's frames are accurate by
 * construction: header sizes are fixed, the declared lengths are checked
 * against the layers they cover, and every field explains itself in one plain
 * sentence. Values that differ in every real capture (identification,
 * checksums, transaction IDs) are marked `example: true`; protocol constants
 * are not.
 */

const ETHERNET_BYTES = 14;
const IPV4_BYTES = 20;
const UDP_BYTES = 8;
/** The BOOTP message DHCP grew out of is 300 bytes: 236 of header, 4 of magic cookie, and 60 for options and padding. */
const DHCP_BYTES = 300;

const BROADCAST_MAC = 'ff:ff:ff:ff:ff:ff';
const NO_ADDRESS = '0.0.0.0';
const BROADCAST_IP = '255.255.255.255';

const hex = (n: number, digits: number): string => `0x${n.toString(16).padStart(digits, '0')}`;

/** Throws when a lesson passes a value the wire format cannot hold, so the mistake fails the build. */
function assertWhole(helper: string, name: string, value: number, min: number, max: number): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${helper}: ${name} must be a whole number from ${min} to ${max}, not ${value}.`);
  }
}

// ---------------------------------------------------------------- Ethernet

const ETHERTYPES = { IPv4: 0x0800 } as const;

export function ethernetLayer(o: { src: string; dst: string; type: 'IPv4' }): Layer {
  const toEveryone = o.dst.toLowerCase() === BROADCAST_MAC;
  return {
    name: 'Ethernet',
    size: ETHERNET_BYTES,
    summary: 'Gets the frame to the right device on the local network, using MAC addresses.',
    fields: [
      {
        name: 'Destination MAC',
        value: o.dst,
        explain: toEveryone
          ? 'All ones is the broadcast address: every device on this network picks the frame up.'
          : 'The hardware address of the device this frame is for.',
      },
      { name: 'Source MAC', value: o.src, explain: 'The hardware address of the device that sent the frame.' },
      {
        name: 'EtherType',
        value: `${hex(ETHERTYPES[o.type], 4)} (${o.type})`,
        explain: 'Says what the frame carries; 0x0800 means an IPv4 packet.',
      },
    ],
  };
}

// -------------------------------------------------------------------- IPv4

const IP_PROTOCOLS = { TCP: 6, UDP: 17 } as const;
/** Shown when a lesson does not choose one. The value is arbitrary: it differs in every real capture. */
const DEFAULT_IDENTIFICATION = '0x1c46';

/** The checksum of RFC 1071: add 16-bit words, fold the carries back in, then invert. */
function checksum16(words: number[]): number {
  let sum = words.reduce((total, word) => total + word, 0);
  while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
  return ~sum & 0xffff;
}

function addressWords(helper: string, name: string, address: string): [number, number] {
  const parsed = parseIPv4(address);
  if (!parsed.ok) throw new Error(`${helper}: ${name} "${address}" is not an IPv4 address.`);
  return [parsed.value >>> 16, parsed.value & 0xffff];
}

function sourceNote(address: string): string {
  return address === NO_ADDRESS
    ? '0.0.0.0 means "this device, with no address yet"; a device uses it until it is given a real one.'
    : 'The address of the device that sent the packet.';
}

function destinationNote(address: string): string {
  return address === BROADCAST_IP
    ? '255.255.255.255 means "every device on this network"; routers do not pass it on.'
    : 'The address of the device the packet is for.';
}

export function ipv4Layer(o: {
  src: string;
  dst: string;
  protocol: 'TCP' | 'UDP';
  ttl: number;
  totalLength: number;
  identification?: string;
}): Layer {
  const identification = o.identification ?? DEFAULT_IDENTIFICATION;
  if (!/^0x[0-9a-f]{1,4}$/i.test(identification)) {
    throw new Error(`ipv4Layer: identification must be 0x followed by up to four hex digits, not "${identification}".`);
  }
  assertWhole('ipv4Layer', 'ttl', o.ttl, 0, 255);
  assertWhole('ipv4Layer', 'totalLength', o.totalLength, IPV4_BYTES, 0xffff);
  const protocol = IP_PROTOCOLS[o.protocol];

  // Version 4 and a 5-word header, no priority marking, no flags, offset 0, and the checksum field as zero.
  const checksum = checksum16([
    0x4500,
    o.totalLength,
    Number.parseInt(identification, 16),
    0x0000,
    (o.ttl << 8) | protocol,
    0x0000,
    ...addressWords('ipv4Layer', 'src', o.src),
    ...addressWords('ipv4Layer', 'dst', o.dst),
  ]);

  return {
    name: 'IPv4',
    size: IPV4_BYTES,
    summary: 'Addresses the packet for its journey, using IP addresses.',
    declaredLength: o.totalLength,
    fields: [
      { name: 'Version', value: '4', explain: 'Which version of IP this is: 4.' },
      {
        name: 'Header length (IHL)',
        value: '5 (20 bytes)',
        explain: 'Counted in 4-byte words: 5 words is 20 bytes, the shortest an IPv4 header can be.',
      },
      {
        name: 'Type of service (DSCP/ECN)',
        value: '0x00',
        explain: 'Lets a network treat some traffic as more urgent; 0 means no special treatment.',
      },
      {
        name: 'Total length',
        value: `${o.totalLength} bytes`,
        explain: 'The size of this whole IP packet in bytes: this header plus everything it carries.',
      },
      {
        name: 'Identification',
        value: identification,
        explain: 'A number that helps put the pieces back together if the packet is split; it usually changes with each packet.',
        example: true,
      },
      {
        name: 'Flags',
        value: 'none set',
        explain: "Bits that control splitting a packet into pieces, such as Don't Fragment; none are set here.",
      },
      {
        name: 'Fragment offset',
        value: '0',
        explain: 'Where this piece fits in the original packet; 0 because the packet was not split.',
      },
      {
        name: 'Time to live (TTL)',
        value: String(o.ttl),
        explain: 'Each router lowers this by one and drops the packet at zero, so a lost packet cannot wander forever.',
      },
      {
        name: 'Protocol',
        value: `${protocol} (${o.protocol})`,
        explain: `Says which protocol the packet carries: ${protocol} means ${o.protocol}.`,
      },
      {
        name: 'Header checksum',
        value: hex(checksum, 4),
        explain: 'A check number that lets each device along the way spot a damaged header.',
        example: true,
      },
      { name: 'Source IP address', value: o.src, explain: sourceNote(o.src) },
      { name: 'Destination IP address', value: o.dst, explain: destinationNote(o.dst) },
    ],
  };
}

// --------------------------------------------------------------------- UDP

const PORT_NAMES: Record<number, string> = { 53: 'DNS', 67: 'DHCP server', 68: 'DHCP client' };
/** Shown for the UDP checksum, which covers the data too, so a header-only helper cannot work it out. */
const EXAMPLE_UDP_CHECKSUM = '0x8d2f';

function portValue(port: number): string {
  const name = PORT_NAMES[port];
  return name === undefined ? String(port) : `${port} (${name})`;
}

export function udpLayer(o: { srcPort: number; dstPort: number; length: number }): Layer {
  assertWhole('udpLayer', 'srcPort', o.srcPort, 0, 0xffff);
  assertWhole('udpLayer', 'dstPort', o.dstPort, 0, 0xffff);
  assertWhole('udpLayer', 'length', o.length, UDP_BYTES, 0xffff);
  return {
    name: 'UDP',
    size: UDP_BYTES,
    summary: 'Sends the data to the right program using port numbers, with no connection set up first.',
    declaredLength: o.length,
    fields: [
      {
        name: 'Source port',
        value: portValue(o.srcPort),
        explain: 'The port the sender is using; replies come back to it.',
      },
      {
        name: 'Destination port',
        value: portValue(o.dstPort),
        explain: 'The port that picks which program on the receiving device gets the data.',
      },
      {
        name: 'Length',
        value: `${o.length} bytes`,
        explain: 'The size of this UDP header (8 bytes) plus the data it carries.',
      },
      {
        name: 'Checksum',
        value: EXAMPLE_UDP_CHECKSUM,
        explain: 'A check number over the header and the data, so the receiver can spot damage.',
        example: true,
      },
    ],
  };
}

// -------------------------------------------------------------------- DHCP

type DhcpMessageType = 'DISCOVER' | 'OFFER' | 'REQUEST' | 'ACK';

/** `op` is 1 (BOOTREQUEST) for messages from a client and 2 (BOOTREPLY) for a server's; `code` is the value of option 53. */
const DHCP_MESSAGES: Record<DhcpMessageType, { op: 1 | 2; code: number; summary: string; explain: string }> = {
  DISCOVER: {
    op: 1,
    code: 1,
    summary: 'A device with no address asks any DHCP server on the network for one.',
    explain: 'The client is looking for any DHCP server that can give it an address.',
  },
  OFFER: {
    op: 2,
    code: 2,
    summary: 'A DHCP server offers an address and the settings that go with it.',
    explain: 'A server is offering the client an address and settings.',
  },
  REQUEST: {
    op: 1,
    code: 3,
    summary: 'The client asks to use the address it was offered, or to keep the one it has.',
    explain: 'The client is asking to use an offered address, or to renew the one it has.',
  },
  ACK: {
    op: 2,
    code: 5,
    summary: "The server confirms the address is the client's to use for the length of the lease.",
    explain: 'The server confirms the lease: the client may use the address.',
  },
};

/** The flag lives in the client's request and the server copies it into its reply, so each direction reads differently. */
function flagsNote(broadcast: boolean, fromClient: boolean): string {
  if (fromClient) {
    return broadcast
      ? 'The client asks for the reply to be broadcast, because it cannot receive a direct one before it has an address.'
      : 'Not set: the client can take a reply sent straight to it.';
  }
  return broadcast
    ? "Copied from the client's request: it asked for the reply to be broadcast, so the server broadcasts it."
    : 'Not set: the client did not ask for a broadcast, so the server may reply straight to it.';
}

export function dhcpLayer(o: {
  messageType: DhcpMessageType;
  xid: string;
  clientMac: string;
  ciaddr?: string;
  yiaddr?: string;
  broadcastFlag: boolean;
  /** Options after the message type, such as subnet mask or lease time. The lesson explains each one. */
  options: Field[];
}): Layer {
  const message = DHCP_MESSAGES[o.messageType];
  return {
    name: 'DHCP',
    size: DHCP_BYTES,
    summary: message.summary,
    fields: [
      {
        name: 'Operation (op)',
        value: message.op === 1 ? '1 (BOOTREQUEST)' : '2 (BOOTREPLY)',
        explain: '1 marks a message from a client; 2 marks a reply from a server.',
      },
      { name: 'Hardware type (htype)', value: '1 (Ethernet)', explain: 'The kind of network hardware the client uses; 1 is Ethernet.' },
      {
        name: 'Hardware address length (hlen)',
        value: '6',
        explain: "How long the client's hardware (MAC) address is in bytes; 6 for Ethernet.",
      },
      { name: 'Hops', value: '0', explain: 'Counts the relays a message has passed through; 0 means it has not crossed one.' },
      {
        name: 'Transaction ID (xid)',
        value: o.xid,
        explain: 'A random number the client picks so it can match each reply to its own request.',
        example: true,
      },
      {
        name: 'Seconds elapsed (secs)',
        value: '0',
        explain: 'How many seconds the client has been trying to get an address; 0 at the start.',
      },
      {
        name: 'Flags',
        value: o.broadcastFlag ? '0x8000 (broadcast)' : '0x0000 (unicast)',
        explain: flagsNote(o.broadcastFlag, message.op === 1),
      },
      {
        name: 'Client IP address (ciaddr)',
        value: o.ciaddr ?? NO_ADDRESS,
        explain: "The client's own address, filled in only when it already has one; otherwise 0.0.0.0.",
      },
      {
        name: 'Your IP address (yiaddr)',
        value: o.yiaddr ?? NO_ADDRESS,
        explain: 'The address the server is giving "you", the client; 0.0.0.0 in a message from the client.',
      },
      {
        name: 'Next server IP address (siaddr)',
        value: NO_ADDRESS,
        explain: 'Names the next server to contact when a device boots over the network; 0.0.0.0 means unused.',
      },
      {
        name: 'Relay agent IP address (giaddr)',
        value: NO_ADDRESS,
        explain: 'Set only when a relay agent forwards the message from another network; 0.0.0.0 means no relay.',
      },
      {
        name: 'Client MAC address (chaddr)',
        value: o.clientMac,
        explain: "The client's hardware address, so the server knows who is asking.",
      },
      {
        name: 'Server name and boot file (sname, file)',
        value: 'empty',
        explain: 'Two text fields, 192 bytes in all, for network booting; they are left empty here.',
      },
      {
        name: 'Magic cookie',
        value: '0x63825363',
        explain: 'A fixed marker (99.130.83.99) that says the options which follow are DHCP options.',
      },
      {
        name: 'DHCP message type (option 53)',
        value: `${message.code} (${o.messageType})`,
        explain: message.explain,
      },
      ...o.options,
      { name: 'End of options (option 255)', value: '255', explain: 'Marks the end of the options.' },
      {
        name: 'Padding',
        value: 'zeros',
        explain: 'Empty bytes that fill the message out to 300 bytes, the minimum size of BOOTP, the protocol DHCP grew out of.',
      },
    ],
  };
}

// ------------------------------------------------------------------ packet

const totalSize = (layers: Layer[]): number => layers.reduce((sum, layer) => sum + layer.size, 0);

/**
 * Assembles a packet. Its size is the sum of its layers, and a layer that
 * declares a length (IPv4's total length, UDP's length) must declare exactly
 * the bytes from that layer to the end, or the lesson fails to build.
 */
export function packet(o: { name: string; summary: string; seenAt?: string; layers: Layer[] }): Packet {
  o.layers.forEach((layer, i) => {
    if (layer.declaredLength === undefined) return;
    const covered = totalSize(o.layers.slice(i));
    if (layer.declaredLength !== covered) {
      throw new Error(
        `${layer.name} declares a length of ${layer.declaredLength} bytes, but it and the layers after it add up to ${covered} bytes.`,
      );
    }
  });
  return {
    name: o.name,
    summary: o.summary,
    ...(o.seenAt === undefined ? {} : { seenAt: o.seenAt }),
    size: totalSize(o.layers),
    layers: o.layers,
  };
}
