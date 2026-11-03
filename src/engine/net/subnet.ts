import type { IPv4 } from './ipv4';

export interface SubnetInfo {
  prefix: number;
  mask: IPv4;
  network: IPv4;
  broadcast: IPv4;
  firstHost: IPv4;
  lastHost: IPv4;
  usableHosts: number;
  totalAddresses: number;
}

function assertPrefix(prefix: number): void {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new RangeError(`Prefix length must be an integer from 0 to 32, got ${prefix}.`);
  }
}

export function maskFromPrefix(prefix: number): IPv4 {
  assertPrefix(prefix);
  // A shift by 32 wraps to a shift by 0 in JavaScript, so /0 is its own case.
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

export function subnetInfo(ip: IPv4, prefix: number): SubnetInfo {
  const mask = maskFromPrefix(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  // RFC 3021: a /31 is a point-to-point link where both addresses are hosts.
  // A /32 is a single host. Otherwise the network and broadcast addresses are reserved.
  if (prefix >= 31) {
    return { prefix, mask, network, broadcast, firstHost: network, lastHost: broadcast, usableHosts: totalAddresses, totalAddresses };
  }
  return {
    prefix,
    mask,
    network,
    broadcast,
    firstHost: network + 1,
    lastHost: broadcast - 1,
    usableHosts: totalAddresses - 2,
    totalAddresses,
  };
}

export function sameSubnet(a: IPv4, b: IPv4, prefix: number): boolean {
  const mask = maskFromPrefix(prefix);
  return ((a & mask) >>> 0) === ((b & mask) >>> 0);
}
