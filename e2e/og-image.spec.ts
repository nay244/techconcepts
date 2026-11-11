import { expect, test, type Page } from '@playwright/test';
import { tokens } from '../src/styles/tokens';
import { cardPage } from '../scripts/generate-og-image.mjs';

/**
 * The share image's card (prototypes/d4-share-image.md, acceptance checks 2 to 6, 8 and 9): the card the script
 * photographs is opened here and measured. The checks that need no browser (1, 7, 10, 11) are in
 * scripts/og-image.test.mjs, so `npm test` runs without one.
 *
 * It sets its own 1200 by 630 window and does not use the site, so it runs in one project (d1440-dark;
 * playwright.config.ts has the others ignore it).
 */

const light = tokens.light;
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// One card for all six, in order: the last check hides part of it.
test.describe.configure({ mode: 'serial' });

let page: Page;
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.setContent(await cardPage());
  await page.evaluate(() => document.fonts.ready);
  // A font that fails to load falls back without a word, so check each took.
  const status = await page.evaluate(() => [...document.fonts].map((face) => `${face.family} ${face.weight} ${face.status}`));
  expect(status.length).toBeGreaterThan(0);
  expect(status.filter((s) => !s.endsWith(' loaded'))).toEqual([]);
});
test.afterAll(async () => {
  await page.close();
});

// 2, 4, 5. Boxes and type.
test('the card is 0, 0, 1200, 630', async () => {
  expect(await page.locator('#card').boundingBox()).toEqual({ x: 0, y: 0, width: 1200, height: 630 });
});

test('the name and the line are Barlow Semi Condensed 700 at the sizes the spec gives, and say the words', async ({ request }) => {
  const style = (sel: string) =>
    page.locator(sel).evaluate((el) => {
      const c = getComputedStyle(el);
      return [c.fontFamily.split(',')[0].replace(/['"]/g, ''), c.fontWeight, c.fontSize, c.lineHeight, c.letterSpacing];
    });
  expect(await style('.brand b')).toEqual(['Barlow Semi Condensed', '700', '60px', '60px', '0.3px']);
  expect(await style('.line')).toEqual(['Barlow Semi Condensed', '700', '108px', '97.2px', '-1.08px']);
  expect(await page.locator('.brand b').innerText()).toBe('TechConcepts');
  // Home's h1, in the built site, is the same sentence.
  const home = /<h1[^>]*id="home-title"[^>]*>([^<]+)<\/h1>/.exec(await (await request.get('/')).text())![1];
  expect((await page.locator('.line').innerText()).replace(/\s+/g, ' ')).toBe(home);
});

test('the mark, the line and the figure sit where the spec puts them', async () => {
  const box = async (sel: string) => (await page.locator(sel).first().boundingBox())!;
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
  const px = await page.evaluate(async (b64: string) => {
    const i = new Image();
    i.src = `data:image/png;base64,${b64}`;
    await i.decode();
    const c = new OffscreenCanvas(i.width, i.height).getContext('2d')!;
    c.drawImage(i, 0, 0);
    const at = (x: number, y: number) => Array.from(c.getImageData(x, y, 1, 1).data.slice(0, 3));
    return { ground: at(10, 10), message: at(111, 106) };
  }, png.toString('base64'));
  expect(px.ground).toEqual(rgb(light['bg-soft']));
  expect(px.message).toEqual(rgb(light.accent));
});

// 8. Nothing solid within 40px of an edge.
test('nothing drawn solid is within 40px of an edge', async () => {
  const gaps = await page.evaluate(() => {
    const out: number[] = [];
    const range = document.createRange();
    for (const el of document.querySelectorAll('.mark, .brand b, .line, .lm-body')) {
      let rects: DOMRect[];
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

