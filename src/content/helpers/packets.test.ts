import { describe, expect, test } from 'vitest';
import type { Field, Layer } from '../schema';
import { dhcpLayer, ethernetLayer, ipv4Layer, packet, udpLayer } from './packets';

const MAC = '00:00:5E:00:53:10';

const discover = () =>
  packet({
    name: 'DHCP Discover',
    summary: 's',
    layers: [
      ethernetLayer({ src: MAC, dst: 'ff:ff:ff:ff:ff:ff', type: 'IPv4' }),
      ipv4Layer({ src: '0.0.0.0', dst: '255.255.255.255', protocol: 'UDP', ttl: 64, totalLength: 328 }),
      udpLayer({ srcPort: 68, dstPort: 67, length: 308 }),
      dhcpLayer({ messageType: 'DISCOVER', xid: '0x3903F326', clientMac: MAC, broadcastFlag: true, options: [] }),
    ],
  });

const ipv4 = (o: Partial<Parameters<typeof ipv4Layer>[0]> = {}) =>
  ipv4Layer({ src: '0.0.0.0', dst: '255.255.255.255', protocol: 'UDP', ttl: 64, totalLength: 328, ...o });
const dhcp = (o: Partial<Parameters<typeof dhcpLayer>[0]> = {}) =>
  dhcpLayer({ messageType: 'DISCOVER', xid: '0x3903F326', clientMac: MAC, broadcastFlag: true, options: [], ...o });

const fieldOf = (layer: Layer, name: string): Field => {
  const found = layer.fields.find((f) => f.name === name);
  if (!found) throw new Error(`no field "${name}" in ${layer.name}: ${layer.fields.map((f) => f.name).join(', ')}`);
  return found;
};
const valueOf = (layer: Layer, name: string) => fieldOf(layer, name).value;
const namesOf = (layer: Layer) => layer.fields.map((f) => f.name);
const examplesOf = (layer: Layer) => layer.fields.filter((f) => f.example).map((f) => f.name);

// ------------------------------------------------------------ the brief

test('DHCP frame is 342 bytes', () => {
  const p = discover();
  expect(p.size).toBe(342);
  expect(p.layers.map((l) => l.size)).toEqual([14, 20, 8, 300]);
});

test('length mismatch throws', () =>
  expect(() =>
    packet({
      name: 'x',
      summary: 's',
      layers: [ipv4Layer({ src: '0.0.0.0', dst: '255.255.255.255', protocol: 'UDP', ttl: 64, totalLength: 999 }), udpLayer({ srcPort: 68, dstPort: 67, length: 8 })],
    }),
  ).toThrow(/IPv4/));

test('every helper field explains itself', () => expect(discover().layers.flatMap((l) => l.fields).every((f) => f.explain)).toBe(true));

// ------------------------------------------------------------ packet()

describe('packet', () => {
  test('layers are named Ethernet, IPv4, UDP and DHCP, and each has a summary', () => {
    const { layers } = discover();
    expect(layers.map((l) => l.name)).toEqual(['Ethernet', 'IPv4', 'UDP', 'DHCP']);
    expect(layers.every((l) => l.summary.trim() !== '')).toBe(true);
  });

  test('only IPv4 and UDP declare a length, and it is the one the lesson passed in', () => {
    expect(discover().layers.map((l) => l.declaredLength)).toEqual([undefined, 328, 308, undefined]);
  });

  test('passes name, summary and layers through, and seenAt only when given', () => {
    const layers = [ethernetLayer({ src: MAC, dst: MAC, type: 'IPv4' })];
    const plain = packet({ name: 'n', summary: 'sum', layers });
    expect(plain).toEqual({ name: 'n', summary: 'sum', size: 14, layers });
    expect(Object.hasOwn(plain, 'seenAt')).toBe(false);
    expect(packet({ name: 'n', summary: 'sum', seenAt: 'On the wire', layers }).seenAt).toBe('On the wire');
  });

  test('size is the sum of the layer sizes, with or without declared lengths', () => {
    expect(packet({ name: 'n', summary: 's', layers: [ethernetLayer({ src: MAC, dst: MAC, type: 'IPv4' }), dhcp()] }).size).toBe(314);
  });

  test('a declared length counts its own layer and the layers after it, not the ones before', () => {
    // IPv4 carries UDP (8) and DHCP (300), 20 + 8 + 300 = 328; Ethernet before it is not counted.
    expect(() => discover()).not.toThrow();
    // Leaving the DHCP layer off makes IPv4 and UDP both wrong.
    expect(() =>
      packet({ name: 'n', summary: 's', layers: [ipv4(), udpLayer({ srcPort: 68, dstPort: 67, length: 308 })] }),
    ).toThrow(/IPv4/);
  });

  test('a wrong UDP length names UDP, and the message says what it declared and what it found', () => {
    const wrong = () =>
      packet({ name: 'n', summary: 's', layers: [ipv4(), udpLayer({ srcPort: 68, dstPort: 67, length: 300 }), dhcp()] });
    expect(wrong).toThrow(/UDP/);
    expect(wrong).toThrow(/300/);
    expect(wrong).toThrow(/308/);
  });

  test('the first layer that is wrong is the one named', () => {
    expect(() =>
      packet({ name: 'n', summary: 's', layers: [ipv4({ totalLength: 99 }), udpLayer({ srcPort: 1, dstPort: 2, length: 99 }), dhcp()] }),
    ).toThrow(/IPv4/);
  });

  test('a packet whose layers declare nothing is accepted', () => {
    expect(packet({ name: 'n', summary: 's', layers: [dhcp()] }).size).toBe(300);
  });
});

// ------------------------------------------------------------ Ethernet

describe('ethernetLayer', () => {
  const layer = ethernetLayer({ src: MAC, dst: 'ff:ff:ff:ff:ff:ff', type: 'IPv4' });

  test('is 14 bytes: destination, source and EtherType, in wire order', () => {
    expect(layer.size).toBe(14);
    expect(namesOf(layer)).toEqual(['Destination MAC', 'Source MAC', 'EtherType']);
    expect(layer.declaredLength).toBeUndefined();
  });

  test('shows the addresses it was given and EtherType 0x0800 for IPv4', () => {
    expect(valueOf(layer, 'Destination MAC')).toBe('ff:ff:ff:ff:ff:ff');
    expect(valueOf(layer, 'Source MAC')).toBe(MAC);
    expect(valueOf(layer, 'EtherType')).toBe('0x0800 (IPv4)');
  });

  test('says a broadcast destination means every device, and a unicast one does not', () => {
    expect(fieldOf(layer, 'Destination MAC').explain).toMatch(/every device/i);
    const unicast = ethernetLayer({ src: MAC, dst: '00:00:5E:00:53:11', type: 'IPv4' });
    expect(fieldOf(unicast, 'Destination MAC').explain).not.toMatch(/every device/i);
  });

  test('has no example values', () => expect(examplesOf(layer)).toEqual([]));
});

// ------------------------------------------------------------ IPv4

describe('ipv4Layer', () => {
  test('is 20 bytes and declares the total length it was given', () => {
    const layer = ipv4();
    expect(layer.size).toBe(20);
    expect(layer.declaredLength).toBe(328);
    expect(ipv4({ totalLength: 1500 }).declaredLength).toBe(1500);
  });

  test('lists the twelve header fields in wire order', () => {
    expect(namesOf(ipv4())).toEqual([
      'Version',
      'Header length (IHL)',
      'Type of service (DSCP/ECN)',
      'Total length',
      'Identification',
      'Flags',
      'Fragment offset',
      'Time to live (TTL)',
      'Protocol',
      'Header checksum',
      'Source IP address',
      'Destination IP address',
    ]);
  });

  test('version 4, a 20-byte header, the lesson-supplied length, TTL and addresses', () => {
    const layer = ipv4({ src: '192.168.1.1', dst: '192.168.1.100', ttl: 128, totalLength: 328 });
    expect(valueOf(layer, 'Version')).toBe('4');
    expect(valueOf(layer, 'Header length (IHL)')).toBe('5 (20 bytes)');
    expect(valueOf(layer, 'Total length')).toBe('328 bytes');
    expect(valueOf(layer, 'Time to live (TTL)')).toBe('128');
    expect(valueOf(layer, 'Source IP address')).toBe('192.168.1.1');
    expect(valueOf(layer, 'Destination IP address')).toBe('192.168.1.100');
  });

  test('protocol 17 is UDP and 6 is TCP', () => {
    expect(valueOf(ipv4({ protocol: 'UDP' }), 'Protocol')).toBe('17 (UDP)');
    expect(valueOf(ipv4({ protocol: 'TCP' }), 'Protocol')).toBe('6 (TCP)');
  });

  test('marks only the identification and the checksum as examples', () => {
    expect(examplesOf(ipv4())).toEqual(['Identification', 'Header checksum']);
  });

  test('uses the identification it is given, or a default', () => {
    expect(valueOf(ipv4({ identification: '0x00ff' }), 'Identification')).toBe('0x00ff');
    expect(valueOf(ipv4(), 'Identification')).toMatch(/^0x[0-9a-f]{4}$/);
  });

  test('computes the real header checksum (values cross-checked against an independent calculation)', () => {
    // Version 4, IHL 5, no flags, UDP, TTL 64, length 328, identification 0x1c46.
    expect(valueOf(ipv4({ identification: '0x1c46' }), 'Header checksum')).toBe('0x5d60');
    expect(valueOf(ipv4({ src: '192.168.1.1', identification: '0x1c46' }), 'Header checksum')).toBe('0x9bb6');
  });

  test('the displayed header sums to 0xFFFF, which is how a receiver verifies a checksum', () => {
    const layer = ipv4({ src: '192.168.1.100', dst: '192.168.1.1', ttl: 63, totalLength: 1500, identification: '0xbeef' });
    const hex = (name: string) => Number.parseInt(valueOf(layer, name).slice(2, 6), 16);
    const octets = (name: string) => valueOf(layer, name).split('.').map(Number);
    const [s, d] = [octets('Source IP address'), octets('Destination IP address')] as [number[], number[]];
    const words = [
      0x4500,
      1500,
      hex('Identification'),
      0,
      (Number(valueOf(layer, 'Time to live (TTL)')) << 8) | 17,
      hex('Header checksum'),
      (s[0]! << 8) | s[1]!,
      (s[2]! << 8) | s[3]!,
      (d[0]! << 8) | d[1]!,
      (d[2]! << 8) | d[3]!,
    ];
    let sum = words.reduce((a, w) => a + w, 0);
    while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
    expect(sum).toBe(0xffff);
  });

  test('explains the special addresses a DHCP client uses', () => {
    const layer = ipv4();
    expect(fieldOf(layer, 'Source IP address').explain).toMatch(/no address yet/i);
    expect(fieldOf(layer, 'Destination IP address').explain).toMatch(/every device/i);
    const ordinary = ipv4({ src: '192.168.1.100', dst: '192.168.1.1' });
    expect(fieldOf(ordinary, 'Source IP address').explain).not.toMatch(/no address yet/i);
    expect(fieldOf(ordinary, 'Destination IP address').explain).not.toMatch(/every device/i);
  });

  test('rejects an address that is not IPv4, naming it', () => {
    expect(() => ipv4({ src: '192.168.1' })).toThrow(/192\.168\.1/);
    expect(() => ipv4({ dst: '256.1.1.1' })).toThrow(/256\.1\.1\.1/);
  });

  test('rejects an identification that is not 0x followed by up to four hex digits', () => {
    for (const bad of ['7238', '0x12345', '0xZZ', '']) expect(() => ipv4({ identification: bad }), bad).toThrow(/identification/i);
  });

  test.each([
    ['ttl', { ttl: 256 }],
    ['ttl', { ttl: -1 }],
    ['ttl', { ttl: 1.5 }],
    ['totalLength', { totalLength: 19 }],
    ['totalLength', { totalLength: 65536 }],
  ] as const)('rejects an out-of-range %s', (name, override) => {
    expect(() => ipv4(override)).toThrow(new RegExp(name));
  });
});

// ------------------------------------------------------------ UDP

describe('udpLayer', () => {
  const layer = udpLayer({ srcPort: 68, dstPort: 67, length: 308 });

  test('is 8 bytes and declares the length it was given', () => {
    expect(layer.size).toBe(8);
    expect(layer.declaredLength).toBe(308);
    expect(namesOf(layer)).toEqual(['Source port', 'Destination port', 'Length', 'Checksum']);
  });

  test('glosses the DHCP ports and leaves other ports bare', () => {
    expect(valueOf(layer, 'Source port')).toBe('68 (DHCP client)');
    expect(valueOf(layer, 'Destination port')).toBe('67 (DHCP server)');
    expect(valueOf(udpLayer({ srcPort: 50000, dstPort: 53, length: 8 }), 'Source port')).toBe('50000');
    expect(valueOf(udpLayer({ srcPort: 50000, dstPort: 53, length: 8 }), 'Destination port')).toBe('53 (DNS)');
  });

  test('shows the length in bytes', () => expect(valueOf(layer, 'Length')).toBe('308 bytes'));

  test('marks only the checksum as an example', () => expect(examplesOf(layer)).toEqual(['Checksum']));

  test.each([
    ['srcPort', { srcPort: 65536 }],
    ['dstPort', { dstPort: -1 }],
    ['length', { length: 7 }],
    ['length', { length: 65536 }],
  ] as const)('rejects an out-of-range %s', (name, override) => {
    expect(() => udpLayer({ srcPort: 68, dstPort: 67, length: 308, ...override })).toThrow(new RegExp(name));
  });
});

// ------------------------------------------------------------ DHCP

describe('dhcpLayer', () => {
  test('is 300 bytes (the BOOTP minimum, padding included) and declares no length', () => {
    const layer = dhcp();
    expect(layer.size).toBe(300);
    expect(layer.declaredLength).toBeUndefined();
  });

  test('lists the fixed BOOTP fields, the message type, then the end marker and padding', () => {
    expect(namesOf(dhcp())).toEqual([
      'Operation (op)',
      'Hardware type (htype)',
      'Hardware address length (hlen)',
      'Hops',
      'Transaction ID (xid)',
      'Seconds elapsed (secs)',
      'Flags',
      'Client IP address (ciaddr)',
      'Your IP address (yiaddr)',
      'Next server IP address (siaddr)',
      'Relay agent IP address (giaddr)',
      'Client MAC address (chaddr)',
      'Server name and boot file (sname, file)',
      'Magic cookie',
      'DHCP message type (option 53)',
      'End of options (option 255)',
      'Padding',
    ]);
  });

  test.each([
    ['DISCOVER', '1 (BOOTREQUEST)', '1 (DISCOVER)'],
    ['OFFER', '2 (BOOTREPLY)', '2 (OFFER)'],
    ['REQUEST', '1 (BOOTREQUEST)', '3 (REQUEST)'],
    ['ACK', '2 (BOOTREPLY)', '5 (ACK)'],
  ] as const)('a %s is operation %s and option 53 value %s', (messageType, op, option53) => {
    const layer = dhcp({ messageType });
    expect(valueOf(layer, 'Operation (op)')).toBe(op);
    expect(valueOf(layer, 'DHCP message type (option 53)')).toBe(option53);
  });

  test('each message type explains what it is for', () => {
    const types = ['DISCOVER', 'OFFER', 'REQUEST', 'ACK'] as const;
    const explanations = types.map((messageType) => fieldOf(dhcp({ messageType }), 'DHCP message type (option 53)').explain);
    expect(new Set(explanations).size).toBe(4);
  });

  test('carries the constants of a DHCP message on Ethernet: htype 1, hlen 6, hops 0, secs 0, no next server or relay', () => {
    const layer = dhcp();
    expect(valueOf(layer, 'Hardware type (htype)')).toBe('1 (Ethernet)');
    expect(valueOf(layer, 'Hardware address length (hlen)')).toBe('6');
    expect(valueOf(layer, 'Hops')).toBe('0');
    expect(valueOf(layer, 'Seconds elapsed (secs)')).toBe('0');
    expect(valueOf(layer, 'Next server IP address (siaddr)')).toBe('0.0.0.0');
    expect(valueOf(layer, 'Relay agent IP address (giaddr)')).toBe('0.0.0.0');
  });

  test('the magic cookie is 0x63825363, which is 99.130.83.99', () => {
    expect(valueOf(dhcp(), 'Magic cookie')).toBe('0x63825363');
    expect(fieldOf(dhcp(), 'Magic cookie').explain).toContain('99.130.83.99');
  });

  test('shows the transaction ID and client MAC it was given', () => {
    const layer = dhcp({ xid: '0xA1B2C3D4', clientMac: '00:00:5E:00:53:11' });
    expect(valueOf(layer, 'Transaction ID (xid)')).toBe('0xA1B2C3D4');
    expect(valueOf(layer, 'Client MAC address (chaddr)')).toBe('00:00:5E:00:53:11');
  });

  test('the broadcast flag is bit 0x8000', () => {
    expect(valueOf(dhcp({ broadcastFlag: true }), 'Flags')).toBe('0x8000 (broadcast)');
    expect(valueOf(dhcp({ broadcastFlag: false }), 'Flags')).toBe('0x0000 (unicast)');
  });

  test('the flags explanation reads differently for the client that sets the flag and the server that copies it', () => {
    const explain = (messageType: 'DISCOVER' | 'OFFER', broadcastFlag: boolean) =>
      fieldOf(dhcp({ messageType, broadcastFlag }), 'Flags').explain;
    expect(explain('DISCOVER', true)).toMatch(/^The client asks/);
    expect(explain('OFFER', true)).toMatch(/^Copied from the client's request/);
    expect(new Set([explain('DISCOVER', true), explain('DISCOVER', false), explain('OFFER', true), explain('OFFER', false)]).size).toBe(4);
  });

  test('ciaddr and yiaddr default to 0.0.0.0 and show the addresses when given', () => {
    expect(valueOf(dhcp(), 'Client IP address (ciaddr)')).toBe('0.0.0.0');
    expect(valueOf(dhcp(), 'Your IP address (yiaddr)')).toBe('0.0.0.0');
    const layer = dhcp({ messageType: 'OFFER', ciaddr: '192.168.1.100', yiaddr: '192.168.1.101' });
    expect(valueOf(layer, 'Client IP address (ciaddr)')).toBe('192.168.1.100');
    expect(valueOf(layer, 'Your IP address (yiaddr)')).toBe('192.168.1.101');
  });

  test('marks only the transaction ID as an example', () => expect(examplesOf(dhcp())).toEqual(['Transaction ID (xid)']));

  test('puts the lesson options after the message type and before the end marker, unchanged', () => {
    const options: Field[] = [
      { name: 'Subnet mask (option 1)', value: '255.255.255.0', explain: 'The size of the local network.' },
      { name: 'Router (option 3)', value: '192.168.1.1', explain: 'The default gateway.' },
    ];
    const layer = dhcp({ messageType: 'OFFER', options });
    const names = namesOf(layer);
    expect(names.slice(names.indexOf('DHCP message type (option 53)'))).toEqual([
      'DHCP message type (option 53)',
      'Subnet mask (option 1)',
      'Router (option 3)',
      'End of options (option 255)',
      'Padding',
    ]);
    expect(layer.fields).toEqual(expect.arrayContaining(options));
    expect(layer.size).toBe(300);
  });
});
