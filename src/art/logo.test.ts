// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { tokens } from '../styles/tokens';
import { LOGO_ACCENT, LOGO_BOX, LOGO_SHAPES, TILE, logoMark, logoTile } from './logo.ts';

/** Every number in a path, in order. */
const numbers = (d: string): number[] => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
const paths = (svg: string): string[] => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]!);

test('the mark is three shapes: the lid, the message and the tray', () => {
  expect(paths(logoMark())).toHaveLength(3);
});

test('every point of the mark, with its stroke, stays inside the box', () => {
  for (const d of paths(logoMark())) for (const n of numbers(d)) {
    expect(n).toBeGreaterThanOrEqual(0.8);
    expect(n).toBeLessThanOrEqual(LOGO_BOX - 0.8);
  }
});

test('the mark is symmetrical about its centre line', () => {
  // Each shape is given as x y pairs (the tray's V and L steps carry lone y values, so it is checked by its ends).
  const [lid, message] = paths(logoMark()).map(numbers);
  for (const shape of [lid!, message!]) {
    const xs = shape.filter((_, i) => i % 2 === 0);
    expect(Math.min(...xs) + Math.max(...xs)).toBeCloseTo(LOGO_BOX, 5);
  }
  expect(paths(logoMark())[2]).toMatch(/^M5\.5 .* 42\.5 /);
});

test('the message sits in the gap, touching neither the lid nor the tray', () => {
  const [lid, message, tray] = paths(logoMark()).map(numbers);
  const ys = (shape: number[]): number[] => shape.filter((_, i) => i % 2 === 1);
  const lidBottom = Math.max(...ys(lid!)) + 0.8;
  const messageTop = Math.min(...ys(message!)) - 0.6;
  const messageBottom = Math.max(...ys(message!)) + 0.6;
  expect(messageTop - lidBottom).toBeGreaterThan(1);
  // The tray's top edge under the message's widest point (x = 24 ± 5.5) is at 38.85 - 5.5 / 2.
  expect(38.85 - 5.5 / 2 - 0.8 - messageBottom).toBeGreaterThan(1);
  expect(tray![1]).toBe(29.6);
});

test('beside the name the mark is hidden from screen readers; alone it carries a label', () => {
  expect(logoMark()).toContain('aria-hidden="true"');
  expect(logoMark()).not.toContain('role="img"');
  expect(logoMark({ label: 'TechConcepts' })).toContain('role="img" aria-label="TechConcepts"');
  expect(logoMark({ label: 'TechConcepts' })).not.toContain('aria-hidden');
});

test('the ink follows the text colour, and the message follows --logo-accent', () => {
  const svg = logoMark();
  expect(svg.match(/fill="currentColor"/g)).toHaveLength(2);
  expect(svg).toContain(`fill="${LOGO_ACCENT}"`);
  // With no page around it, the message is the light theme's orange; the tile carries the dark theme's.
  expect(LOGO_ACCENT).toBe(`var(--logo-accent, ${tokens.light.accent})`);
  expect(TILE.accent).toBe(tokens.dark.accent);
  expect(logoMark({ mono: true }).match(/fill="currentColor"/g)).toHaveLength(3);
});

test('the tile is a whole SVG file with fixed colours and no page variables', () => {
  const svg = logoTile();
  expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 48 48">/);
  expect(svg).not.toMatch(/var\(|currentColor/);
  expect(svg).toContain(`fill="${TILE.ground}"`);
  expect(svg.match(new RegExp(`fill="${TILE.ink}"`, 'g'))).toHaveLength(2);
  expect(svg).toContain(`fill="${TILE.accent}"`);
});

test('the mark is drawn from LOGO_SHAPES, in order', () => {
  expect(paths(logoMark())).toEqual(LOGO_SHAPES.map((s) => s.d));
  expect(paths(logoTile())).toEqual(LOGO_SHAPES.map((s) => s.d));
});

test('the favicon file is the tile, byte for byte', () => {
  // public/favicon.svg is written from logoTile(); a hand edit to either one fails here.
  const file: string = readFileSync(new URL('../../public/favicon.svg', import.meta.url), 'utf8');
  expect(file).toBe(`${logoTile()}\n`);
});
