import { maskFromPrefix } from './subnet';

/** An IPv4 address as an unsigned 32-bit number. Always normalise with `>>> 0`. */
export type IPv4 = number;

export type ParseResult = { ok: true; value: IPv4 } | { ok: false; error: string };

export const IPV4_ERROR = 'Not a valid IPv4 address. Use four numbers from 0 to 255, like 192.168.1.10.';

// "0" or a number without leading zeros, 1-3 ASCII digits.
const OCTET = /^(?:0|[1-9][0-9]{0,2})$/;
const PREFIX = /^(?:0|[1-9][0-9]?)$/;

export function parseIPv4(input: string): ParseResult {
  const parts = input.trim().split('.');
  if (parts.length !== 4) return { ok: false, error: IPV4_ERROR };

  let value = 0;
  for (const part of parts) {
    if (!OCTET.test(part)) return { ok: false, error: IPV4_ERROR };
    const octet = Number(part);
    if (octet > 255) return { ok: false, error: IPV4_ERROR };
    value = value * 256 + octet;
  }
  return { ok: true, value: value >>> 0 };
}

export function formatIPv4(ip: IPv4): string {
  return [24, 16, 8, 0].map((shift) => (ip >>> shift) & 255).join('.');
}

export function toOctetBits(ip: IPv4): [string, string, string, string] {
  const [a, b, c, d] = [24, 16, 8, 0].map((shift) => ((ip >>> shift) & 255).toString(2).padStart(8, '0'));
  return [a!, b!, c!, d!];
}

/**
 * True when `ip` falls inside `cidr` (for example "198.51.100.0/24").
 * Throws an Error when `cidr` is malformed. An `ip` that does not parse
 * is simply not contained, so it returns false.
 */
export function cidrContains(cidr: string, ip: string): boolean {
  const parts = cidr.trim().split('/');
  const base = parts.length === 2 ? parseIPv4(parts[0]!) : null;
  const prefixText = parts[1]?.trim();
  if (!base?.ok || prefixText === undefined || !PREFIX.test(prefixText) || Number(prefixText) > 32) {
    throw new Error(`Invalid CIDR "${cidr}". Use an address and a prefix from 0 to 32, like 198.51.100.0/24.`);
  }

  const candidate = parseIPv4(ip);
  if (!candidate.ok) return false;

  const mask = maskFromPrefix(Number(prefixText));
  return ((base.value & mask) >>> 0) === ((candidate.value & mask) >>> 0);
}
