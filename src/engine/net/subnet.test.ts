import { expect, test } from 'vitest';
import { formatIPv4, parseIPv4 } from './ipv4';
import { sameSubnet, subnetInfo } from './subnet';

const ip = (s: string) => {
  const r = parseIPv4(s);
  if (!r.ok) throw new Error(s);
  return r.value;
};

test.each([
  ['192.168.1.10', 24, '255.255.255.0', '192.168.1.0', '192.168.1.255', '192.168.1.1', '192.168.1.254', 254, 256],
  ['192.168.1.70', 26, '255.255.255.192', '192.168.1.64', '192.168.1.127', '192.168.1.65', '192.168.1.126', 62, 64],
  ['10.0.0.5', 30, '255.255.255.252', '10.0.0.4', '10.0.0.7', '10.0.0.5', '10.0.0.6', 2, 4],
  ['172.16.5.4', 16, '255.255.0.0', '172.16.0.0', '172.16.255.255', '172.16.0.1', '172.16.255.254', 65534, 65536],
  ['10.0.0.4', 31, '255.255.255.254', '10.0.0.4', '10.0.0.5', '10.0.0.4', '10.0.0.5', 2, 2],
  ['10.0.0.4', 32, '255.255.255.255', '10.0.0.4', '10.0.0.4', '10.0.0.4', '10.0.0.4', 1, 1],
  ['8.8.8.8', 0, '0.0.0.0', '0.0.0.0', '255.255.255.255', '0.0.0.1', '255.255.255.254', 4294967294, 4294967296],
])('subnetInfo(%s/%i)', (addr, p, mask, net, bc, first, last, usable, total) => {
  const i = subnetInfo(ip(addr), p);
  expect([i.mask, i.network, i.broadcast, i.firstHost, i.lastHost].map(formatIPv4)).toEqual([mask, net, bc, first, last]);
  expect([i.usableHosts, i.totalAddresses]).toEqual([usable, total]);
});

test.each([33, -1, 24.5, NaN])('subnetInfo rejects prefix %s', (p) =>
  expect(() => subnetInfo(ip('10.0.0.1'), p)).toThrow(RangeError),
);

test('sameSubnet', () => {
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 26)).toBe(false);
  expect(sameSubnet(ip('192.168.1.10'), ip('192.168.1.70'), 24)).toBe(true);
});
