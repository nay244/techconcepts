import { describe, expect, test } from 'vitest';
import { formatIPv4, parseIPv4, toOctetBits } from '../../../engine/net/ipv4';
import { maskFromPrefix, sameSubnet, subnetInfo } from '../../../engine/net/subnet';
import { countWords, estimateMinutes } from '../../estimate';
import { getEntries } from '../../registry';
import subnetting from './subnetting';

const s = subnetting;

/** The subnet maths for step `i`'s preset address and prefix. */
const info = (i: number) => {
  const p = s.steps[i]!.preset!;
  const r = parseIPv4(p.address);
  if (!r.ok) throw new Error(`Step ${i + 1}: "${p.address}" is not an address.`);
  return subnetInfo(r.value, p.prefix);
};

const ip = (text: string) => {
  const r = parseIPv4(text);
  if (!r.ok) throw new Error(`"${text}" is not an address.`);
  return r.value;
};

/** Everything a step tells the learner: its narrative and its facts. */
const spoken = (i: number) => [s.steps[i]!.narrative, ...s.steps[i]!.facts.map((f) => `${f.label}: ${f.value}`)].join('\n');

/** Every dotted-quad address in `text`. */
const addressesIn = (text: string) => text.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) ?? [];

/** Every "/NN" prefix in `text`. */
const prefixesIn = (text: string) => [...text.matchAll(/\/(\d{1,2})\b/g)].map((m) => Number(m[1]));

// ------------------------------------------------------------ the brief's tests

test('budget', () => expect(estimateMinutes(s)).toBeLessThanOrEqual(15));

test('stays under the 12-minute warning', () => expect(estimateMinutes(s)).toBeLessThanOrEqual(12));

test('step 3 numbers', () => {
  const i = info(2);
  expect([formatIPv4(i.network), formatIPv4(i.broadcast), i.usableHosts]).toEqual(['192.168.1.0', '192.168.1.255', 254]);
  expect(s.steps[2]!.narrative).toContain('254');
});

test('step 4 numbers', () => {
  const i = info(3);
  expect([formatIPv4(i.network), i.usableHosts]).toEqual(['192.168.1.64', 62]);
  expect(s.steps[3]!.narrative).toContain('62');
});

test('step 5 compare is different', () => {
  const p = s.steps[4]!.preset!;
  const a = parseIPv4(p.address);
  const b = parseIPv4(p.compare!);
  if (!a.ok || !b.ok) throw new Error('Step 5 needs two valid addresses.');
  expect(sameSubnet(a.value, b.value, p.prefix)).toBe(false);
});

test('step 6 numbers', () => {
  expect(info(5).usableHosts).toBe(2);
  expect(s.steps[5]!.narrative).toContain('2 usable');
});

test('check answer for /26 is 62', () => expect(s.check[0]!.options[s.check[0]!.answer]).toContain('62'));

// ------------------------------------------------------------ shape and meta

test('a playground lesson with six steps and a free Try it', () => {
  expect(s.scene).toEqual({ type: 'playground', playground: 'subnet' });
  expect(s.steps).toHaveLength(6);
  expect(s.tryIt.mode).toBe('free');
  expect(s.check).toHaveLength(3);
  expect(s.recap.takeaways).toHaveLength(3);
});

test('track entry is available as lesson 7', () =>
  expect(getEntries('networking').find((e) => e.slug === 'subnetting')).toMatchObject({ available: true, number: 7 }));

test('meta follows the brief', () => {
  expect(s).toMatchObject({ slug: 'subnetting', title: 'Subnetting', subtitle: 'Splitting networks into smaller ones', osiLayers: [3] });
  expect(s.certTags).toEqual(['network-plus', 'ccna']);
  expect(s.references.map((r) => r.url)).toEqual(['https://www.rfc-editor.org/rfc/rfc950', 'https://www.rfc-editor.org/rfc/rfc4632']);
  expect(s.references.map((r) => r.label)).toEqual([
    expect.stringContaining('RFC 950'),
    expect.stringContaining('RFC 4632'),
  ]);
});

test('overview facts follow the brief', () => {
  const fact = (label: string) => s.overview.facts.find((f) => f.label === label)?.value;
  expect(fact('Written as')).toBe('192.168.1.0/24');
  expect(fact('Mask')).toBe('255.255.255.0');
  expect(fact('Usable hosts')).toBe('2 to the power of host bits, minus 2 (for /30 and bigger)');
  expect(fact('Defined in')).toBe('RFC 950, RFC 4632');
});

test('the overview example is the lesson\'s own: 192.168.1.0/24 has the mask 255.255.255.0', () => {
  expect(formatIPv4(maskFromPrefix(24))).toBe('255.255.255.0');
  expect(formatIPv4(subnetInfo(ip('192.168.1.0'), 24).network)).toBe('192.168.1.0');
});

// ------------------------------------------------------------ presets

test('each step starts the playground from its brief preset', () => {
  expect(s.steps.map((x) => [x.title, x.preset])).toEqual([
    ['An address has two parts', { address: '192.168.1.10', prefix: 24 }],
    ['The mask draws the line', { address: '192.168.1.10', prefix: 24 }],
    ['Network, broadcast and hosts', { address: '192.168.1.10', prefix: 24 }],
    ['Borrowing bits', { address: '192.168.1.70', prefix: 26 }],
    ['Same subnet or not?', { address: '192.168.1.10', prefix: 26, compare: '192.168.1.70' }],
    ['Tiny subnets', { address: '10.0.0.5', prefix: 30 }],
  ]);
});

test('only private addresses appear anywhere in the steps, as the example-data rule requires', () => {
  const found = s.steps.flatMap((_, i) => addressesIn(spoken(i)));
  expect(found.length).toBeGreaterThan(0);
  for (const address of found) {
    const isPrivate = /^(192\.168\.|10\.|255\.255\.255\.)/.test(address);
    expect(isPrivate, address).toBe(true);
  }
});

// ------------------------------------------------------------ every number a step states

describe('step 1 and 2: two parts, and the mask that divides them', () => {
  test('192.168.1.10/24 splits into 24 network bits and 8 host bits', () => {
    const i = info(0);
    expect(i.prefix).toBe(24);
    expect(32 - i.prefix).toBe(8);
    expect(formatIPv4(i.network)).toBe('192.168.1.0');
    expect(ip('192.168.1.10') & 255).toBe(10);
  });

  test('step 1 says the network part is the first three numbers and the host part is 10', () => {
    expect(spoken(0)).toContain('192.168.1');
    expect(s.steps[0]!.facts.map((f) => f.value).join('\n')).toMatch(/24 bits/);
    expect(s.steps[0]!.facts.map((f) => f.value).join('\n')).toMatch(/8 bits/);
    expect(s.steps[0]!.facts.map((f) => f.value).join('\n')).toMatch(/\b32 bits\b/);
  });

  test('255.255.255.0 is 24 ones then 8 zeros', () => {
    const mask = info(1).mask;
    expect(formatIPv4(mask)).toBe('255.255.255.0');
    expect(toOctetBits(mask).join('.')).toBe('11111111.11111111.11111111.00000000');
    expect(s.steps[1]!.narrative).toContain('255.255.255.0');
    expect(s.steps[1]!.narrative).toMatch(/24 ones/);
    expect(s.steps[1]!.narrative).toMatch(/8 zeros/);
    expect(s.steps[1]!.facts.map((f) => f.value)).toContain('11111111.11111111.11111111.00000000');
  });
});

describe('step 3: network, broadcast and hosts at /24', () => {
  test('256 addresses, 254 usable, from .1 to .254', () => {
    const i = info(2);
    expect(i.totalAddresses).toBe(256);
    expect([formatIPv4(i.firstHost), formatIPv4(i.lastHost)]).toEqual(['192.168.1.1', '192.168.1.254']);
    expect(s.steps[2]!.narrative).toContain('256');
    expect(s.steps[2]!.narrative).toContain('192.168.1.1 to 192.168.1.254');
    expect(s.steps[2]!.narrative).toMatch(/8 host bits/);
    expect(s.steps[2]!.narrative).toContain('2 to the power of 8');
  });
});

describe('step 4: borrowing two bits from the /24', () => {
  test('4 subnets of 64 addresses, and the address sits in the one that starts at .64', () => {
    const i = info(3);
    expect(i.totalAddresses).toBe(64);
    expect(2 ** (26 - 24)).toBe(4);
    expect(256 / 4).toBe(64);
    expect([formatIPv4(i.network), formatIPv4(i.broadcast)]).toEqual(['192.168.1.64', '192.168.1.127']);
    expect([formatIPv4(i.firstHost), formatIPv4(i.lastHost)]).toEqual(['192.168.1.65', '192.168.1.126']);
    expect(32 - i.prefix).toBe(6);
    expect(s.steps[3]!.narrative).toContain('4 subnets');
    expect(s.steps[3]!.narrative).toContain('64 addresses');
    expect(s.steps[3]!.narrative).toContain('192.168.1.64');
  });

  test('the four subnets start at .0, .64, .128 and .192', () => {
    const starts = [0, 1, 2, 3].map((n) => formatIPv4(subnetInfo(ip('192.168.1.0') + n * 64, 26).network));
    expect(starts).toEqual(['192.168.1.0', '192.168.1.64', '192.168.1.128', '192.168.1.192']);
    expect(s.steps[3]!.narrative).toMatch(/192\.168\.1\.0, \.64, \.128 and \.192/);
  });

  test('the facts name the /26 mask and the subnet\'s range', () => {
    expect(formatIPv4(maskFromPrefix(26))).toBe('255.255.255.192');
    const values = s.steps[3]!.facts.map((f) => f.value).join('\n');
    expect(values).toContain('255.255.255.192');
    expect(values).toContain('192.168.1.64 to 192.168.1.127');
    expect(values).toContain('192.168.1.65 to 192.168.1.126');
  });
});

describe('step 5: the same two addresses at /26 and at /24', () => {
  const a = ip('192.168.1.10');
  const b = ip('192.168.1.70');

  test('different at /26, and each is in the subnet the lesson names', () => {
    expect(sameSubnet(a, b, 26)).toBe(false);
    expect(formatIPv4(subnetInfo(a, 26).network)).toBe('192.168.1.0');
    expect(formatIPv4(subnetInfo(b, 26).network)).toBe('192.168.1.64');
    expect(s.steps[4]!.narrative).toContain('192.168.1.0');
    expect(s.steps[4]!.narrative).toContain('192.168.1.64');
    expect(s.steps[4]!.narrative).toMatch(/different subnets/i);
  });

  test('the same two would share a subnet at /24, and the narrative says so', () => {
    expect(sameSubnet(a, b, 24)).toBe(true);
    expect(s.steps[4]!.narrative).toMatch(/At \/24/);
  });

  test('the router pointer is to lesson 8, and DHCP is lesson 9', () => {
    expect(s.steps[4]!.narrative).toMatch(/lesson 8/);
    expect(getEntries('networking').find((e) => e.slug === 'router')?.number).toBe(8);
    expect(getEntries('networking').find((e) => e.slug === 'dhcp')?.number).toBe(9);
    expect(getEntries('networking').find((e) => e.slug === 'ip-address')?.number).toBe(3);
  });
});

describe('step 6: a /30', () => {
  test('4 addresses, 2 usable, network .4 with hosts .5 and .6', () => {
    const i = info(5);
    expect(i.totalAddresses).toBe(4);
    expect(32 - i.prefix).toBe(2);
    expect([formatIPv4(i.network), formatIPv4(i.firstHost), formatIPv4(i.lastHost), formatIPv4(i.broadcast)]).toEqual([
      '10.0.0.4',
      '10.0.0.5',
      '10.0.0.6',
      '10.0.0.7',
    ]);
    expect(formatIPv4(maskFromPrefix(30))).toBe('255.255.255.252');
    const text = spoken(5);
    expect(text).toContain('10.0.0.4');
    expect(text).toContain('10.0.0.5');
    expect(text).toContain('10.0.0.6');
    expect(text).toContain('255.255.255.252');
    expect(s.steps[5]!.narrative).toMatch(/2 host bits/);
    expect(s.steps[5]!.narrative).toContain('2 to the power of 2');
  });
});

/**
 * A guard on every number the lesson states: any address or prefix a step
 * mentions has to be one the engine produces for that step (or a named extra).
 */
describe('every address and prefix a step states is one the engine computes for it', () => {
  const extras: Record<number, { addresses: string[]; prefixes: number[] }> = {
    0: { addresses: [], prefixes: [] },
    1: { addresses: [], prefixes: [] },
    2: { addresses: [], prefixes: [] },
    // The four /26 subnets of the /24, and the /24 they were cut from.
    3: { addresses: ['192.168.1.0', '192.168.1.128', '192.168.1.192', '255.255.255.192'], prefixes: [24] },
    // The second address's subnet, and the /24 the same two would share.
    4: { addresses: ['192.168.1.64'], prefixes: [24] },
    5: { addresses: ['255.255.255.252'], prefixes: [] },
  };

  test.each([0, 1, 2, 3, 4, 5])('step %i', (i) => {
    const p = s.steps[i]!.preset!;
    const n = info(i);
    const allowed = new Set([
      p.address,
      ...(p.compare === undefined ? [] : [p.compare]),
      formatIPv4(n.mask),
      formatIPv4(n.network),
      formatIPv4(n.broadcast),
      formatIPv4(n.firstHost),
      formatIPv4(n.lastHost),
      ...extras[i]!.addresses,
    ]);
    for (const address of addressesIn(spoken(i))) expect(allowed.has(address), `step ${i + 1} states ${address}`).toBe(true);
    const allowedPrefixes = new Set([p.prefix, ...extras[i]!.prefixes]);
    for (const prefix of prefixesIn(spoken(i))) expect(allowedPrefixes.has(prefix), `step ${i + 1} states /${prefix}`).toBe(true);
  });

  test.each([0, 1, 2, 3, 4, 5])('step %i: every count it states (hosts, host bits, ones, zeros, addresses) matches its preset', (i) => {
    const n = info(i);
    const text = spoken(i);
    const counts = (pattern: RegExp) => [...text.matchAll(pattern)].map((m) => Number(m[1]!.replaceAll(',', '')));
    for (const v of counts(/(\d[\d,]*) usable hosts?\b/g)) expect(v).toBe(n.usableHosts);
    for (const v of counts(/(\d+) host bits\b/g)) expect(v).toBe(32 - n.prefix);
    for (const v of counts(/(\d+) ones\b/g)) expect(v).toBe(n.prefix);
    for (const v of counts(/(\d+) zeros\b/g)) expect(v).toBe(32 - n.prefix);
    for (const v of counts(/(\d+) addresses\b/g)) expect(v).toBe(n.totalAddresses);
    const usable = s.steps[i]!.facts.find((fact) => fact.label === 'Usable hosts');
    if (usable !== undefined) expect(Number.parseInt(usable.value, 10)).toBe(n.usableHosts);
  });

  test('steps 3, 4 and 6 state their usable-host count in words, not just inside an address', () => {
    expect(s.steps[2]!.narrative).toContain('254 usable hosts');
    expect(s.steps[3]!.narrative).toContain('62 usable hosts');
    expect(s.steps[5]!.narrative).toContain('2 usable hosts');
  });

  test('the usable-hosts rule 2 to the power of h, minus 2, holds for every prefix in the playground range', () => {
    for (let prefix = 16; prefix <= 30; prefix += 1) {
      const n = subnetInfo(ip('10.0.0.1'), prefix);
      expect(n.totalAddresses).toBe(2 ** (32 - prefix));
      expect(n.usableHosts).toBe(n.totalAddresses - 2);
    }
  });
});

// ------------------------------------------------------------ Try it

describe('Try it', () => {
  test('is free-form, invites /16 to /30 and lists three things to notice', () => {
    expect(s.tryIt.mode).toBe('free');
    if (s.tryIt.mode !== 'free') return;
    expect(s.tryIt.prompt).toContain('/16');
    expect(s.tryIt.prompt).toContain('/30');
    expect(s.tryIt.explanation).toMatch(/\bFirst\b/);
    expect(s.tryIt.explanation).toMatch(/\bSecond\b/);
    expect(s.tryIt.explanation).toMatch(/\bThird\b/);
    expect(s.tryIt.prompt).toContain('Compare with');
  });

  test('each step to the left of the slider doubles the addresses in a subnet', () => {
    for (let prefix = 17; prefix <= 30; prefix += 1) {
      const wider = subnetInfo(ip('192.168.1.10'), prefix - 1).totalAddresses;
      const narrower = subnetInfo(ip('192.168.1.10'), prefix).totalAddresses;
      expect(wider).toBe(2 * narrower);
    }
    // The example in the explanation.
    expect(subnetInfo(ip('192.168.1.10'), 24).totalAddresses).toBe(256);
    expect(subnetInfo(ip('192.168.1.10'), 23).totalAddresses).toBe(512);
    if (s.tryIt.mode === 'free') {
      expect(s.tryIt.explanation).toContain('256');
      expect(s.tryIt.explanation).toContain('512');
    }
  });

  test('changing only the last number leaves the network address alone until it crosses into the next block', () => {
    const at = (last: number) => formatIPv4(subnetInfo(ip(`192.168.1.${last}`), 26).network);
    expect([at(64), at(100), at(127)]).toEqual(['192.168.1.64', '192.168.1.64', '192.168.1.64']);
    expect(at(128)).toBe('192.168.1.128');
  });

  test('192.168.1.10 and 192.168.1.70 share a subnet up to /25 and split at /26', () => {
    const shared = [];
    for (let prefix = 16; prefix <= 30; prefix += 1) shared.push(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), prefix));
    expect(shared.indexOf(false) + 16).toBe(26);
    expect(shared.slice(0, 10).every(Boolean)).toBe(true); // /16 through /25
    expect(shared.slice(10).every((x) => !x)).toBe(true); // /26 through /30
    if (s.tryIt.mode === 'free') {
      expect(s.tryIt.explanation).toContain('192.168.1.10');
      expect(s.tryIt.explanation).toContain('192.168.1.70');
      expect(s.tryIt.explanation).toContain('/25');
      expect(s.tryIt.explanation).toContain('/26');
    }
  });

  test('the prompt starts from the last step, 10.0.0.5/30, and says so', () => {
    expect(s.steps.at(-1)!.preset).toEqual({ address: '10.0.0.5', prefix: 30 });
    if (s.tryIt.mode === 'free') expect(s.tryIt.prompt).toMatch(/\/30 link/);
  });
});

// ------------------------------------------------------------ Check yourself

describe('Check yourself', () => {
  test('/26 leaves 6 host bits: 64 addresses, 62 usable; the other options are the near misses', () => {
    const n = subnetInfo(ip('192.168.1.0'), 26);
    expect([32 - 26, n.totalAddresses, n.usableHosts]).toEqual([6, 64, 62]);
    expect(subnetInfo(ip('192.168.1.0'), 25).usableHosts).toBe(126);
    expect(subnetInfo(ip('192.168.1.0'), 27).usableHosts).toBe(30);
    const q = s.check[0]!;
    expect(q.options).toEqual(['30', '62', '64', '126']);
    expect(q.explanation).toContain('64');
    expect(q.explanation).toContain('62');
    expect(q.explanation).toContain('126');
    expect(q.explanation).toContain('/25');
    expect(q.explanation).toContain('30');
    expect(q.explanation).toContain('/27');
  });

  test('192.168.1.10 and 192.168.1.70 are on the same /24: the answer is yes', () => {
    expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 24)).toBe(true);
    const q = s.check[1]!;
    expect(q.prompt).toContain('192.168.1.10');
    expect(q.prompt).toContain('192.168.1.70');
    expect(q.options[q.answer]).toMatch(/^Yes/);
    for (const [index, option] of q.options.entries()) if (index !== q.answer) expect(option).not.toMatch(/^Yes/);
  });

  test('the /30 question is about links between routers, and a /30 has 2 usable hosts', () => {
    expect(info(5).usableHosts).toBe(2);
    const q = s.check[2]!;
    expect(q.prompt).toContain('/30');
    expect(q.options[q.answer]).toMatch(/routers/);
    expect(q.explanation).toContain('2 usable');
    for (const [index, option] of q.options.entries()) if (index !== q.answer) expect(option).not.toMatch(/routers/);
  });

  test('the right answer is not always in the same place, and not always the longest option', () => {
    expect(new Set(s.check.map((q) => q.answer)).size).toBeGreaterThan(1);
    const longest = s.check.filter((q) => {
      const lengths = q.options.map((o) => o.length);
      const max = Math.max(...lengths);
      return q.options[q.answer]!.length === max && lengths.filter((n) => n === max).length === 1;
    });
    expect(longest.length).toBeLessThanOrEqual(1);
  });

  test('every question has distinct options and a real explanation', () => {
    for (const q of s.check) {
      expect(new Set(q.options).size).toBe(q.options.length);
      expect(countWords(q.explanation)).toBeGreaterThan(10);
    }
  });
});

// ------------------------------------------------------------ what the lesson says about reserved addresses

describe('the usable-hosts rule is stated only for the range the lesson covers', () => {
  const everything = () => [
    s.overview.hook,
    s.overview.description,
    ...s.overview.facts.map((f) => `${f.label}: ${f.value}`),
    ...s.steps.flatMap((x) => [x.title, x.subtitle, x.narrative, ...x.facts.map((f) => `${f.label}: ${f.value}`)]),
    s.tryIt.prompt,
    s.tryIt.mode === 'free' ? s.tryIt.explanation : '',
    ...s.check.flatMap((q) => [q.prompt, ...q.options, q.explanation]),
    ...s.recap.takeaways,
  ];

  test('takeaway 2 gives the rule for ordinary subnets (/30 and bigger) and pins its three numbers', () => {
    const takeaway = s.recap.takeaways[1]!;
    expect(takeaway).toMatch(/ordinary subnets \(\/30 and bigger/);
    expect(takeaway).toMatch(/254 usable in a \/24, 62 in a \/26, 2 in a \/30/);
    // The three numbers are what the engine says.
    expect([24, 26, 30].map((prefix) => subnetInfo(ip('10.0.0.1'), prefix).usableHosts)).toEqual([254, 62, 2]);
  });

  test('the step 3 subtitle and the overview fact carry the same scope', () => {
    expect(s.steps[2]!.subtitle).toBe('Two addresses in an ordinary subnet are reserved');
    expect(s.overview.facts.find((f) => f.label === 'Usable hosts')?.value).toMatch(/\(for \/30 and bigger\)$/);
  });

  test('no text claims the rule for "every subnet", and none mentions /31 or /32, which the slider does not reach', () => {
    for (const text of everything()) {
      expect(text).not.toMatch(/\bevery subnet\b/i);
      expect(text).not.toMatch(/\/(31|32)\b/);
    }
  });

  test('outside the rule: a /31 has 2 usable hosts and a /32 has 1, so the scope matters', () => {
    expect(subnetInfo(ip('10.0.0.0'), 31).usableHosts).toBe(2);
    expect(subnetInfo(ip('10.0.0.0'), 32).usableHosts).toBe(1);
    expect(subnetInfo(ip('10.0.0.0'), 30).usableHosts).toBe(2 ** 2 - 2);
  });
});

describe('terms and analogy', () => {
  test('"host bit" is defined at first use, in step 2, and not again in step 3', () => {
    expect(s.steps[0]!.narrative).not.toMatch(/host bit/);
    expect(s.steps[1]!.narrative).toContain('a 1 for every network bit (a bit in the network part) and a 0 for every host bit (a bit in the host part)');
    expect(s.steps[2]!.narrative).not.toMatch(/\(each bit/);
  });

  test('step 1 does not teach that the first three numbers are always the network', () => {
    expect(s.steps[0]!.narrative).not.toMatch(/first three numbers/);
    expect(s.steps[0]!.narrative).toContain('the next step shows what decides where the line falls');
  });

  test('the street analogy is one analogy: a subnet is a street, a /30 is a short lane, and no "neighborhood" or "private lane"', () => {
    expect(s.steps[3]!.narrative).toContain("Each subnet is its own street: a router doesn't pass its broadcasts on to the next one.");
    expect(s.steps[3]!.narrative).not.toMatch(/\bnever\b/);
    expect(s.steps[5]!.narrative).toContain('a short lane with exactly two houses');
    for (const step of s.steps) expect(step.narrative).not.toMatch(/neighborhood|private lane/);
  });

  test('CIDR is expanded where it is first used, and the lesson is named for subnetting, not for CIDR', () => {
    expect(s.steps[1]!.narrative).toContain('(CIDR notation, from Classless Inter-Domain Routing)');
    expect(s.overview.fullName).toBe('Subnetwork addressing');
  });

  test('wording: "Neither can be given to a device", and the split is "once the prefix reaches /26 or more"', () => {
    expect(s.steps[2]!.narrative).toContain('Neither can be given to a device');
    expect(s.check[1]!.explanation).toContain('once the prefix reaches /26 or more');
  });
});

// ------------------------------------------------------------ voice

describe('voice and wording', () => {
  const allText = () => [
    s.overview.hook,
    s.overview.description,
    ...s.steps.flatMap((x) => [x.title, x.subtitle, x.narrative, ...x.facts.map((f) => f.value)]),
    s.tryIt.prompt,
    s.tryIt.mode === 'free' ? s.tryIt.explanation : '',
    ...s.check.flatMap((q) => [q.prompt, ...q.options, q.explanation]),
    ...s.recap.takeaways,
  ];

  test('no gamification words', () => {
    for (const text of allText()) expect(text).not.toMatch(/\b(points|score|scores|badge|badges|streak|xp|mission complete|level up|unlock)\b/i);
  });

  test('narratives and the hook stay inside the word limits', () => {
    for (const step of s.steps) expect(countWords(step.narrative), step.id).toBeLessThanOrEqual(120);
    expect(countWords(s.overview.hook)).toBeLessThanOrEqual(80);
  });

  test('points to the lessons that teach what it borrows: addresses and binary in 3, routers in 8, DHCP in 9', () => {
    const narratives = s.steps.map((x) => x.narrative).join('\n');
    expect(narratives).toMatch(/lesson 3\b/);
    expect(narratives).toMatch(/lesson 8\b/);
    if (/\bDHCP\b/.test(narratives)) expect(narratives).toMatch(/lesson 9\b/);
  });

  test('each step is about one thing: it has its own title and a subtitle', () => {
    expect(new Set(s.steps.map((x) => x.title)).size).toBe(6);
    for (const step of s.steps) {
      expect(step.subtitle.length).toBeGreaterThan(0);
      expect(step.facts.length).toBeGreaterThanOrEqual(2);
      expect(step.facts.length).toBeLessThanOrEqual(4);
    }
  });
});
