import { expect, test } from 'vitest';
import { estimateMinutes } from '../../estimate';
import { getEntries } from '../../registry';
import type { MessageEvent, Packet } from '../../schema';
import dhcp from './dhcp';

const flow = () => {
  if (dhcp.scene.type !== 'flow') throw new Error('The DHCP lesson must be a flow scene.');
  return dhcp.scene;
};

/** Every message in the lesson: the steps first, then each Try it choice. */
const stepMessages = () => dhcp.steps.flatMap((s) => s.events).filter((e): e is MessageEvent => e.type === 'message');
const tryItMessages = () => {
  if (dhcp.tryIt.mode !== 'choices') throw new Error('The DHCP lesson uses choices.');
  return dhcp.tryIt.choices.flatMap((c) => c.events).filter((e): e is MessageEvent => e.type === 'message');
};

test('valid and within budget', () => {
  expect(estimateMinutes(dhcp)).toBeLessThanOrEqual(15);
  expect(dhcp.steps).toHaveLength(5);
});

test('stays under the 12-minute warning', () => expect(estimateMinutes(dhcp)).toBeLessThanOrEqual(12));

test('accuracy anchors', () => {
  const msgs = dhcp.steps.flatMap((s) => s.events).filter((e) => e.type === 'message') as MessageEvent[];
  expect(msgs[0]).toMatchObject({ src: '0.0.0.0:68', dst: '255.255.255.255:67', kind: 'broadcast' });
  expect(msgs.every((m) => m.size === 342)).toBe(true);
  expect(msgs.find((m) => m.time === 43200)).toMatchObject({ src: '192.168.1.100:68', dst: '192.168.1.1:67' });
  expect(dhcp.overview.facts.find((f) => f.label === 'Ports')?.value).toBe('UDP 67 (server), UDP 68 (client)');
});

test('track entry is available as lesson 9', () =>
  expect(getEntries('networking').find((e) => e.slug === 'dhcp')).toMatchObject({ available: true, number: 9 }));

// ------------------------------------------------------------ the exchange

test('the four steps of the first exchange follow Discover, Offer, Request, Acknowledge at the brief times', () => {
  const first = stepMessages().slice(0, 4);
  expect(first.map((m) => [m.label, m.time, m.src, m.dst])).toEqual([
    ['Discover', 0, '0.0.0.0:68', '255.255.255.255:67'],
    ['Offer', 0.004, '192.168.1.1:67', '255.255.255.255:68'],
    ['Request', 0.006, '0.0.0.0:68', '255.255.255.255:67'],
    ['Acknowledge', 0.009, '192.168.1.1:67', '255.255.255.255:68'],
  ]);
  expect(first.map((m) => m.kind)).toEqual(['broadcast', 'response', 'broadcast', 'response']);
});

test('broadcasts reach the router and the phone; replies to 255.255.255.255 reach the laptop and the phone', () => {
  const [discover, offer, request, ack] = stepMessages();
  expect(discover!.from).toBe('laptop');
  expect(discover!.to).toEqual(['router', 'phone']);
  expect(request!.to).toEqual(['router', 'phone']);
  expect(offer!.from).toBe('router');
  expect(offer!.to).toEqual(['laptop', 'phone']);
  expect(ack!.to).toEqual(['laptop', 'phone']);
});

test('the renew is unicast at half of the 24-hour lease', () => {
  const [renewRequest, renewAck] = stepMessages().slice(-2);
  expect(renewRequest).toMatchObject({
    from: 'laptop',
    to: ['router'],
    src: '192.168.1.100:68',
    dst: '192.168.1.1:67',
    time: 43200,
  });
  expect(renewAck).toMatchObject({ from: 'router', to: ['laptop'], src: '192.168.1.1:67', dst: '192.168.1.100:68' });
  expect(renewAck!.time).toBeGreaterThan(43200);
  expect(43200).toBe(86400 / 2);
});

test('the lease table starts empty, gains the laptop at the Acknowledge, and the renew updates that row', () => {
  const table = flow().tables.find((t) => t.id === 'leases');
  expect(table).toMatchObject({ actor: 'router', keyColumn: 'ip', initialRows: [] });
  expect(table!.columns.map((c) => c.label)).toEqual(['IP', 'MAC', 'Device', 'Expires']);

  const tableEvents = dhcp.steps.flatMap((s) => s.events).filter((e) => e.type === 'table');
  expect(tableEvents).toHaveLength(2);
  expect(tableEvents[0]).toMatchObject({
    table: 'leases',
    op: 'add',
    row: { ip: '192.168.1.100', mac: '00:00:5E:00:53:10', device: 'Laptop', expires: 'in 24 h' },
  });
  expect(tableEvents[1]).toMatchObject({
    table: 'leases',
    op: 'update',
    key: '192.168.1.100',
    row: { expires: 'in 24 h (renewed)' },
  });
});

test('the Offer and the Acknowledge carry the settings, and both name the same address', () => {
  const dhcpFields = (id: string) => flow().packets[id]!.layers.find((l) => l.name === 'DHCP')!.fields;
  const value = (id: string, name: string) => dhcpFields(id).find((f) => f.name === name)?.value;
  for (const id of ['offer', 'ack']) {
    expect(value(id, 'Your IP address (yiaddr)')).toBe('192.168.1.100');
    expect(value(id, 'Subnet mask (option 1)')).toBe('255.255.255.0');
    expect(value(id, 'Router (option 3)')).toBe('192.168.1.1');
    expect(value(id, 'DNS server (option 6)')).toBe('192.168.1.1');
    expect(value(id, 'Server identifier (option 54)')).toBe('192.168.1.1');
    expect(value(id, 'IP address lease time (option 51)')).toMatch(/^86400 /);
  }
  expect(value('request', 'Requested IP address (option 50)')).toBe('192.168.1.100');
  expect(value('request', 'Server identifier (option 54)')).toBe('192.168.1.1');
  // A renewing client already owns its address: ciaddr carries it, and options 50 and 54 stay out (RFC 2131 4.3.2).
  expect(value('renew-request', 'Client IP address (ciaddr)')).toBe('192.168.1.100');
  expect(value('renew-request', 'Requested IP address (option 50)')).toBeUndefined();
  expect(value('renew-request', 'Server identifier (option 54)')).toBeUndefined();
});

test('one transaction ID per exchange, and a new one for the renew and for the phone', () => {
  const xid = (id: string) =>
    flow()
      .packets[id]!.layers.find((l) => l.name === 'DHCP')!
      .fields.find((f) => f.name === 'Transaction ID (xid)')!.value;
  expect(new Set(['discover', 'offer', 'request', 'ack'].map(xid)).size).toBe(1);
  expect(new Set(['renew-request', 'renew-ack'].map(xid)).size).toBe(1);
  expect(xid('renew-request')).not.toBe(xid('discover'));
  expect(xid('normal-discover')).not.toBe(xid('discover'));
  expect(new Set(['normal-discover', 'normal-offer', 'normal-request', 'normal-ack'].map(xid)).size).toBe(1);
  expect(xid('pool-full-discover')).toBe(xid('pool-full-discover-retry'));
});

// ------------------------------------------------------------ the frames

test('every message has a packet, and every packet is a 342-byte frame (IPv4 total length 328, UDP length 308)', () => {
  const messages = [...stepMessages(), ...tryItMessages()];
  expect(messages.every((m) => m.packet !== undefined && Object.hasOwn(flow().packets, m.packet))).toBe(true);
  expect(messages.every((m) => m.size === 342)).toBe(true);
  for (const p of Object.values(flow().packets)) {
    expect(p.size).toBe(342);
    expect(p.layers.map((l) => [l.name, l.size, l.declaredLength])).toEqual([
      ['Ethernet', 14, undefined],
      ['IPv4', 20, 328],
      ['UDP', 8, 308],
      ['DHCP', 300, undefined],
    ]);
  }
});

test('every packet says where it was seen, in a full sentence', () => {
  for (const [id, p] of Object.entries(flow().packets)) {
    expect(p.seenAt, id).toMatch(/^[A-Z].*\.$/);
  }
});

const layerOf = (p: Packet, name: string) => p.layers.find((l) => l.name === name)!;
const fieldValue = (p: Packet, layer: string, field: string) => layerOf(p, layer).fields.find((f) => f.name === field)?.value;

test('every frame has its own IPv4 identification', () => {
  const ids = Object.entries(flow().packets).map(([id, p]) => [id, fieldValue(p, 'IPv4', 'Identification')] as const);
  expect(ids.every(([, value]) => typeof value === 'string' && /^0x[0-9a-f]{4}$/i.test(value))).toBe(true);
  expect(new Set(ids.map(([, value]) => value)).size).toBe(ids.length);
});

test('each message pairs its addresses with its packet: IP and port in the event, the same in the frame', () => {
  for (const m of [...stepMessages(), ...tryItMessages()]) {
    const p = flow().packets[m.packet!]!;
    const [srcIp, srcPort] = m.src.split(':');
    const [dstIp, dstPort] = m.dst.split(':');
    expect(fieldValue(p, 'IPv4', 'Source IP address'), m.id).toBe(srcIp);
    expect(fieldValue(p, 'IPv4', 'Destination IP address'), m.id).toBe(dstIp);
    expect(fieldValue(p, 'UDP', 'Source port'), m.id).toMatch(new RegExp(`^${srcPort} `));
    expect(fieldValue(p, 'UDP', 'Destination port'), m.id).toMatch(new RegExp(`^${dstPort} `));
  }
});

test('a broadcast goes to the broadcast MAC; a unicast goes to the other device\'s MAC', () => {
  const dstMac = (id: string) => fieldValue(flow().packets[id]!, 'Ethernet', 'Destination MAC');
  for (const id of ['discover', 'offer', 'request', 'ack']) expect(dstMac(id), id).toBe('ff:ff:ff:ff:ff:ff');
  expect(dstMac('renew-request')).toBe('00:00:5E:00:53:01');
  expect(dstMac('renew-ack')).toBe('00:00:5E:00:53:10');
});

// ------------------------------------------------------------ option budget

/**
 * The BOOTP layer is 300 bytes: 236 of header, 4 of magic cookie and 60 for
 * options and padding. Option 53 (3 bytes) and the end marker (1 byte) always
 * take their share, which leaves 56 bytes for the options a lesson adds.
 */
const LESSON_OPTION_BUDGET = 60 - 3 - 1;
/** Data bytes per address (RFC 2132): options 1, 3, 6, 50 and 54 hold addresses, 51 holds a 32-bit number of seconds. */
const OPTION_DATA_BYTES: Record<number, (value: string) => number> = {
  1: () => 4,
  3: (value) => 4 * value.split(',').length,
  6: (value) => 4 * value.split(',').length,
  50: () => 4,
  51: () => 4,
  54: () => 4,
};

test('a resent Discover keeps its transaction ID and reports the 4 seconds the phone has been trying', () => {
  const secs = (id: string) => fieldValue(flow().packets[id]!, 'DHCP', 'Seconds elapsed (secs)');
  expect(secs('pool-full-discover')).toBe('0');
  expect(secs('pool-full-discover-retry')).toBe('4');
});

test('the options in every DHCP layer fit the 56 bytes a 300-byte layer leaves for them', () => {
  for (const [id, p] of Object.entries(flow().packets)) {
    const options = layerOf(p, 'DHCP').fields.flatMap((f) => {
      const code = /\(option (\d+)\)/.exec(f.name)?.[1];
      return code === undefined || code === '53' || code === '255' ? [] : [{ code: Number(code), value: f.value }];
    });
    const bytes = options.map((o) => {
      const dataBytes = OPTION_DATA_BYTES[o.code];
      if (dataBytes === undefined) throw new Error(`${id}: add the size of option ${o.code} to this test.`);
      return 2 + dataBytes(o.value); // code and length, then the data
    });
    expect(
      bytes.reduce((sum, n) => sum + n, 0),
      `${id} options`,
    ).toBeLessThanOrEqual(LESSON_OPTION_BUDGET);
  }
  // The Offer is the longest: five options of 6 bytes each.
  expect(layerOf(flow().packets['offer']!, 'DHCP').fields.filter((f) => /\(option (?!53|255)\d+\)/.test(f.name))).toHaveLength(5);
});

// ------------------------------------------------------------ try it

test('Try it offers the two brief choices, with event ids that never collide with a step', () => {
  if (dhcp.tryIt.mode !== 'choices') throw new Error('choices expected');
  expect(dhcp.tryIt.choices.map((c) => [c.id, c.label])).toEqual([
    ['normal', 'Connect the phone'],
    ['pool-full', 'Shrink the pool to one address, then connect the phone'],
  ]);
  const stepIds = new Set(dhcp.steps.flatMap((s) => s.events.map((e) => e.id)));
  for (const choice of dhcp.tryIt.choices) {
    for (const e of choice.events) {
      expect(e.id.startsWith(`${choice.id}-`), e.id).toBe(true);
      expect(stepIds.has(e.id)).toBe(false);
    }
  }
});

test('connecting the phone is a full exchange that ends with a lease for 192.168.1.101', () => {
  if (dhcp.tryIt.mode !== 'choices') throw new Error('choices expected');
  const normal = dhcp.tryIt.choices.find((c) => c.id === 'normal')!;
  const messages = normal.events.filter((e): e is MessageEvent => e.type === 'message');
  expect(messages.map((m) => m.label)).toEqual(['Discover', 'Offer', 'Request', 'Acknowledge']);
  expect(messages.every((m) => m.size === 342)).toBe(true);
  expect(messages[0]).toMatchObject({ from: 'phone', src: '0.0.0.0:68', dst: '255.255.255.255:67' });
  expect(normal.events.at(-1)).toMatchObject({
    type: 'table',
    op: 'add',
    table: 'leases',
    row: { ip: '192.168.1.101', mac: '00:00:5E:00:53:11', device: 'Phone' },
  });
});

test('with the pool full, the phone asks at 60 s and again at 64 s, and no Offer ever comes', () => {
  if (dhcp.tryIt.mode !== 'choices') throw new Error('choices expected');
  const full = dhcp.tryIt.choices.find((c) => c.id === 'pool-full')!;
  expect(full.events.every((e) => e.type === 'message')).toBe(true);
  const messages = full.events as MessageEvent[];
  expect(messages.map((m) => [m.label, m.time, m.src, m.dst])).toEqual([
    ['Discover', 60, '0.0.0.0:68', '255.255.255.255:67'],
    ['Discover (retry)', 64, '0.0.0.0:68', '255.255.255.255:67'],
  ]);
  expect(messages.some((m) => m.src.startsWith('192.168.1.1:'))).toBe(false);
  expect(full.explanation).toMatch(/169\.254/);
  expect(full.explanation).toMatch(/APIPA|link-local/);
});

test('the pool-full explanation says a 169.254 address cannot reach the router, the laptop or the internet', () => {
  if (dhcp.tryIt.mode !== 'choices') throw new Error('choices expected');
  const { explanation } = dhcp.tryIt.choices.find((c) => c.id === 'pool-full')!;
  // A self-assigned address talks only to other self-assigned devices (RFC 3927); the router and laptop are on 192.168.1.0/24.
  expect(explanation).toMatch(/only with other devices that also gave themselves one/);
  expect(explanation).toMatch(/can't reach the router, the laptop or the internet/);
  expect(explanation).not.toMatch(/reaches devices on the same/i);
});

// ------------------------------------------------------------ meta, check

test('meta follows the brief', () => {
  expect(dhcp).toMatchObject({
    slug: 'dhcp',
    title: 'DHCP',
    subtitle: 'Getting an address automatically',
    level: 'beginner',
    osiLayers: [7],
  });
  expect(dhcp.certTags).toEqual(['a-plus', 'network-plus', 'ccna', 'helpdesk']);
  expect(dhcp.references.map((r) => r.label.slice(0, 8))).toEqual(['RFC 2131', 'RFC 2132', 'RFC 3927']);
  expect(dhcp.references.map((r) => r.url)).toEqual([
    'https://www.rfc-editor.org/rfc/rfc2131',
    'https://www.rfc-editor.org/rfc/rfc2132',
    'https://www.rfc-editor.org/rfc/rfc3927',
  ]);
});

test('overview facts follow the brief', () => {
  expect(dhcp.overview.facts).toEqual([
    { label: 'Layer', value: 'Application (7)' },
    { label: 'Ports', value: 'UDP 67 (server), UDP 68 (client)' },
    { label: 'Hands out', value: 'IP address, subnet mask, default gateway, DNS server' },
    { label: 'Exchange', value: 'Discover, Offer, Request, Acknowledge' },
    { label: 'Lease', value: 'Renewed at half its length' },
    { label: 'Defined in', value: 'RFC 2131, RFC 2132' },
  ]);
});

test('the scene is a flow with the laptop, the phone and the DHCP server joined by Wi-Fi', () => {
  const scene = flow();
  expect(scene.views).toEqual(['network', 'sequence']);
  expect(scene.actors.map((a) => [a.id, a.label])).toEqual([
    ['laptop', 'Laptop'],
    ['router', 'Router · DHCP server'],
    ['phone', 'Phone'],
  ]);
  // Both clients show their MAC address, the one address a device has before DHCP gives it an IP.
  expect(scene.actors.find((a) => a.id === 'laptop')!.addresses).toEqual(['00:00:5E:00:53:10']);
  expect(scene.actors.find((a) => a.id === 'phone')!.addresses).toEqual(['00:00:5E:00:53:11']);
  expect(scene.actors.find((a) => a.id === 'router')!.addresses).toEqual(['192.168.1.1']);
  expect(scene.links.map((l) => [l.from, l.to, l.medium])).toEqual([
    ['laptop', 'router', 'wireless'],
    ['phone', 'router', 'wireless'],
  ]);
  expect(scene.legend).toEqual([
    { kind: 'broadcast', label: 'Broadcast to everyone' },
    { kind: 'response', label: 'Reply from the DHCP server' },
    { kind: 'request', label: 'Request' },
  ]);
});

test('Check yourself asks the three brief questions, and UDP 67 is the answer to the first', () => {
  expect(dhcp.check).toHaveLength(3);
  const first = dhcp.check[0]!;
  expect([...first.options].sort()).toEqual(['TCP 53', 'TCP 67', 'UDP 67', 'UDP 68']);
  expect(first.options[first.answer]).toBe('UDP 67');
  expect(dhcp.check[1]!.prompt).toMatch(/255\.255\.255\.255/);
  expect(dhcp.check[2]!.prompt).toMatch(/169\.254\.20\.5/);
});

test('a 169.254 address means no answer from a DHCP server, not an unreachable one (the pool-full Discover does arrive)', () => {
  const q3 = dhcp.check[2]!;
  expect(q3.options[q3.answer]).toBe('It got no answer from a DHCP server and gave itself an address');
  const prose = [q3.options.join(' '), q3.explanation, dhcp.recap.takeaways.join(' ')].join(' ');
  expect(prose).not.toMatch(/could not reach/i);
  expect(dhcp.recap.takeaways[2]).toMatch(/got no answer from a DHCP server/);
});

test('the Renew step covers the rebinding step at 87.5% of the lease before the lease runs out', () => {
  const renew = dhcp.steps.find((s) => s.id === 'renew')!;
  expect(renew.narrative).toMatch(/87\.5% of the lease the laptop broadcasts its Request to any server/);
  // The order the narrative tells it in: renew at half, rebind at 87.5%, then start over with a Discover.
  const at = (text: string) => renew.narrative.indexOf(text);
  expect(at('Halfway through the lease')).toBeLessThan(at('87.5%'));
  expect(at('87.5%')).toBeLessThan(at('starts again with a Discover'));
});

test('the Offer step opens with the analogy and says what a pool is where it first uses the word', () => {
  const offer = dhcp.steps.find((s) => s.id === 'offer')!;
  expect(offer.narrative).toMatch(/^A hotel clerk/);
  expect(offer.narrative.indexOf('pool (the addresses it can give out)')).toBeGreaterThan(-1);
  // The one place "pool" is used in a step before the Offer would be the Discover step; it must not appear there.
  expect(dhcp.steps.find((s) => s.id === 'discover')!.narrative).not.toMatch(/\bpool\b/);
});

test('the Request and Acknowledge steps open with the hotel analogy, then name the message', () => {
  const request = dhcp.steps.find((s) => s.id === 'request')!;
  const ack = dhcp.steps.find((s) => s.id === 'acknowledge')!;
  expect(request.narrative).toMatch(/^Back at the front desk, the guest says which key they'll take: the laptop accepts with a Request/);
  expect(ack.narrative).toMatch(/^The clerk writes the booking down and hands the key over: the server confirms with an Acknowledge, or ACK/);
});

test('ports and UDP point ahead to lessons 10 and 11, and Q1 does not claim TCP 53 for DNS', () => {
  const discover = dhcp.steps.find((s) => s.id === 'discover')!;
  expect(discover.narrative).toMatch(/lessons 10 and 11 cover ports and UDP/);
  const q1 = dhcp.check[0]!;
  expect(q1.explanation).toMatch(/Port 53 belongs to DNS \(lesson 13\)/);
  expect(q1.explanation).not.toMatch(/TCP 53/);
});

test('no gamification language anywhere in the lesson', () => {
  const text = JSON.stringify(dhcp.steps) + JSON.stringify(dhcp.tryIt) + JSON.stringify(dhcp.check) + JSON.stringify(dhcp.recap);
  expect(text.match(/\b(points|scores?|scored|badges?|streaks?|mission complete|xp)\b/i)?.[0]).toBeUndefined();
});
