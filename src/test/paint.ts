import { hexToRgb } from '../lib/contrast';

const toHex = (channels: number[]): string => `#${channels.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/** What `color-mix(in srgb, a share%, b)` paints, for two opaque hex colours. `share` is a's part, from 0 to 100. */
export function mix(a: string, b: string, share: number): string {
  const [x, y] = [hexToRgb(a), hexToRgb(b)];
  return toHex([0, 1, 2].map((i) => x[i]! * (share / 100) + y[i]! * (1 - share / 100)));
}

/**
 * What a colour paints over an opaque hex ground: an `rgba(r, g, b, a)` token blends in by its alpha, and a hex
 * colour covers the ground. (`color-mix(in srgb, c n%, transparent)` over a ground is `mix(c, ground, n)`.)
 */
export function over(color: string, ground: string): string {
  const rgba = /^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)$/.exec(color.trim());
  if (rgba === null) return toHex(hexToRgb(color));
  return mix(toHex([1, 2, 3].map((i) => Number(rgba[i]))), ground, Number(rgba[4]) * 100);
}
