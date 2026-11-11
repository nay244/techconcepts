import { readFileSync, statSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { tokens } from '../src/styles/tokens.ts';
import { LOGO_SHAPES } from '../src/art/logo.ts';
import { PAGE_FIGURES } from '../src/art/figures/pages.ts';
import { cardPage, openCard } from './generate-og-image.mjs';

const light = tokens.light;
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

let browser;
let page;
beforeAll(async () => {
  browser = await chromium.launch();
  page = await openCard(browser);
}, 60_000);
afterAll(async () => {
  await browser?.close();
});

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

// 2, 4, 5. Boxes and type.
test('the card is 0, 0, 1200, 630', async () => {
  expect(await page.locator('#card').boundingBox()).toEqual({ x: 0, y: 0, width: 1200, height: 630 });
});

test('the name and the line are Barlow Semi Condensed 700 at the sizes the spec gives, and say the words', async () => {
  const style = (sel) =>
    page.locator(sel).evaluate((el) => {
      const c = getComputedStyle(el);
      return [c.fontFamily.split(',')[0].replace(/['"]/g, ''), c.fontWeight, c.fontSize, c.lineHeight, c.letterSpacing];
    });
  expect(await style('.brand b')).toEqual(['Barlow Semi Condensed', '700', '60px', '60px', '0.3px']);
  expect(await style('.line')).toEqual(['Barlow Semi Condensed', '700', '108px', '97.2px', '-1.08px']);
  expect(await page.locator('.brand b').innerText()).toBe('TechConcepts');
  // Home's h1 is the same sentence.
  const home = /<h1 id="home-title">([^<]+)<\/h1>/.exec(read('../src/pages/index.astro'))[1];
  expect((await page.locator('.line').innerText()).replace(/\s+/g, ' ')).toBe(home);
});

test('the mark, the line and the figure sit where the spec puts them', async () => {
  const box = (sel) => page.locator(sel).first().boundingBox();
  const mark = await box('.mark');
  expect([mark.x, mark.y, mark.width, mark.height]).toEqual([72, 60, 78, 78]);
  const line = await box('.line');
  expect(line.x).toBe(72);
  expect(line.y + line.height).toBeCloseTo(566, 0);
  const svg = await box('.art svg');
  expect([svg.x, svg.y, svg.width]).toEqual([552, 80, 640]);
});

// 6. Colours, in the photograph.
test('the ground and the mark are the light theme tokens in the photograph', async () => {
  const png = await page.screenshot({ type: 'png' });
  const px = await page.evaluate(async (b64) => {
    const i = new Image();
    i.src = `data:image/png;base64,${b64}`;
    await i.decode();
    const c = new OffscreenCanvas(i.width, i.height).getContext('2d');
    c.drawImage(i, 0, 0);
    const at = (x, y) => Array.from(c.getImageData(x, y, 1, 1).data.slice(0, 3));
    return { ground: at(10, 10), message: at(111, 106) };
  }, png.toString('base64'));
  expect(px.ground).toEqual(rgb(light['bg-soft']));
  expect(px.message).toEqual(rgb(light.accent));
});

// 7. Contrast.
test('the words reach 4.5 to 1 against the ground', () => {
  expect(contrast(light['ink-strong'], light['bg-soft'])).toBeGreaterThanOrEqual(4.5);
});

// 8. Nothing solid within 40px of an edge.
test('nothing drawn solid is within 40px of an edge', async () => {
  const gaps = await page.evaluate(() => {
    const out = [];
    const range = document.createRange();
    for (const el of document.querySelectorAll('.mark, .brand b, .line, .lm-body')) {
      let rects;
      if (el.classList.contains('line') || el.tagName === 'B') {
        range.selectNodeContents(el);
        rects = [...range.getClientRects()];
      } else rects = [el.getBoundingClientRect()];
      for (const r of rects) out.push(Math.min(r.left, r.top, 1200 - r.right, 630 - r.bottom));
    }
    return out;
  });
  expect(gaps.length).toBeGreaterThan(3);
  expect(Math.min(...gaps)).toBeGreaterThanOrEqual(40);
});

// 9. The figure is present and whole: the draw-in is stopped.
test('the figure is drawn at full opacity, and hiding .lm-body changes the photograph', async () => {
  expect(await page.locator('.lm-svg').evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  const clip = { x: 587, y: 91, width: 570, height: 444 };
  const before = await page.screenshot({ clip });
  await page.addStyleTag({ content: '.lm-body { visibility: hidden !important; }' });
  const after = await page.screenshot({ clip });
  expect(before.equals(after)).toBe(false);
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
