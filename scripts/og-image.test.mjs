import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { tokens } from '../src/styles/tokens.ts';
import { LOGO_SHAPES } from '../src/art/logo.ts';
import { PAGE_FIGURES } from '../src/art/figures/pages.ts';
import { cardPage } from './generate-og-image.mjs';

const light = tokens.light;
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/* The checks that photograph or measure the card (2 to 6, 8, 9) are in e2e/og-image.spec.ts: `npm test` needs no browser. */
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

// 1. The file.
test('public/og-default.png is a PNG, 1200 by 630, under 300 KB', () => {
  const png = readFileSync(new URL('../public/og-default.png', import.meta.url));
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  expect(png.length).toBeLessThan(300 * 1024);
});

test('the script names the card it draws and still relies on type stripping', () => {
  const src = read('./generate-og-image.mjs');
  expect(src).toMatch(/type stripping/);
  expect(src).not.toMatch(/Atkinson Hyperlegible Next/);
});

// 7. Contrast.
test('the words reach 4.5 to 1 against the ground', () => {
  expect(contrast(light['ink-strong'], light['bg-soft'])).toBeGreaterThanOrEqual(4.5);
});

// 10. The repo's drawings.
test("the card's HTML holds the logo's three paths and the figure Home draws", async () => {
  const html = await cardPage();
  for (const s of LOGO_SHAPES) expect(html).toContain(`<path d="${s.d}"`);
  expect(html).toContain(PAGE_FIGURES.inside());
});

// 11. Every page names the image.
test('every page\'s og:image still names /og-default.png', () => {
  const layout = read('../src/layouts/BaseLayout.astro');
  expect(layout).toMatch(/image = '\/og-default\.png'/);
  expect(layout).toMatch(/<meta property="og:image" content=\{imageUrl\} \/>/);
});
