import { expect, test } from 'vitest';
import { IPV4_ERROR, cidrContains, formatIPv4, parseIPv4, toOctetBits } from './ipv4';

const ip = (s: string) => {
  const r = parseIPv4(s);
  if (!r.ok) throw new Error(s);
  return r.value;
};

test('parses and formats', () => {
  expect(parseIPv4('192.168.1.10')).toEqual({ ok: true, value: 3232235786 });
  expect(parseIPv4('  10.0.0.1 ')).toEqual({ ok: true, value: 167772161 });
  expect(formatIPv4(4294967295)).toBe('255.255.255.255');
  expect(formatIPv4(0)).toBe('0.0.0.0');
});

test.each(['192.168.1.256', '192.168.1', '192.168.01.1', '1.2.3.4.5', '', 'abc', '1..2.3', '-1.2.3.4', '+1.2.3.4', '1.2.3.4 5', '١.2.3.4'])(
  'rejects %j with the standard message',
  (s) => expect(parseIPv4(s)).toEqual({ ok: false, error: IPV4_ERROR }),
);

test('octet bits', () => expect(toOctetBits(ip('192.168.1.10'))).toEqual(['11000000', '10101000', '00000001', '00001010']));

test('cidrContains', () => {
  expect(cidrContains('198.51.100.0/24', '198.51.100.7')).toBe(true);
  expect(cidrContains('198.51.100.7/32', '198.51.100.8')).toBe(false);
  expect(() => cidrContains('198.51.100.0/33', '198.51.100.7')).toThrow();
});

test.each(['', 'abc', '198.51.100.0', '198.51.100.0/', '198.51.100.0/08', '198.51.100.0/-1', '198.51.100.0/24/8', '198.51.100/24', '300.1.1.1/24'])(
  'cidrContains throws on the malformed CIDR %j',
  (cidr) => expect(() => cidrContains(cidr, '198.51.100.7')).toThrow(Error),
);

test('cidrContains edge cases', () => {
  expect(cidrContains('0.0.0.0/0', '203.0.113.9')).toBe(true);
  expect(cidrContains('198.51.100.0/24', '198.51.101.7')).toBe(false);
  expect(cidrContains('198.51.100.0/24', 'not an ip')).toBe(false);
});
