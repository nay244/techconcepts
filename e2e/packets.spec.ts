import { expect, test, type Page } from '@playwright/test';
import { spot } from '../src/art/figures/spots';
import { checkCard, DESKTOP, PHONE, playToEnd, tableTab, watchPanel, watched } from './batch1';
import { open, pageOverflow } from './support';

/**
 * Packets' page checks (design D13, prototypes/d13-packets-cases.md, checks 19, 21 and 22; the cases the builder left to
 * the e2e specs): the lesson's view, the width at 375 and 1440 in both themes, the contrast of a parked tag's words, and
 * the card on the track page. The lesson's own event times are pinned in src/scenes/drivers/net-map.packets.test.ts.
 *
 * The width and contrast checks set their own window size and theme, so they run once, in d1440-dark.
 */
const PATH = '/networking/packets';
const CARD_SUB = 'Cut up, sent apart, put back together';
const ariaOf = (kind: Parameters<typeof spot>[0]): string => spot(kind).match(/aria-label="([^"]*)"/)![1]!;

test.beforeEach(async ({}, info) => {
  test.skip(info.project.name !== 'd1440-dark', 'These tests set their own window and theme; they run in d1440-dark only.');
});

/** Watches the page's width from here on, a frame at a time: the widest the document got past the window. */
function watchSideways(page: Page): Promise<void> {
  return page.evaluate(() => {
    const seen = { sideways: 0, docWidth: 0, innerWidth: window.innerWidth };
    (window as unknown as { __side: typeof seen }).__side = seen;
    const tick = () => {
      const root = document.scrollingElement ?? document.documentElement;
      seen.sideways = Math.max(seen.sideways, root.scrollWidth - root.clientWidth);
      seen.docWidth = Math.max(seen.docWidth, root.scrollWidth);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/**
 * The lowest contrast ratio of a parked tag's words against its own tile, a frame at a time. The words' fill and the
 * tile's fill are the computed `fill` of `.nm-park .nm-tag-t` and of the `.iso-top` in the same `.nm-park`.
 */
function watchContrast(page: Page): Promise<void> {
  return page.evaluate(() => {
    const seen = { min: Infinity, pairs: 0 };
    (window as unknown as { __contrast: typeof seen }).__contrast = seen;
    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
    };
    const rgbOf = (fill: string): number[] | null => {
      const m = fill.match(/\d+(\.\d+)?/g);
      return m !== null && m.length >= 3 ? m.slice(0, 3).map(Number) : null;
    };
    const tick = () => {
      for (const words of document.querySelectorAll<SVGElement>('.nm-park .nm-tag-t')) {
        const tile = words.closest('.nm-park')?.querySelector<SVGElement>('.iso-top');
        if (tile === null || tile === undefined) continue;
        const a = rgbOf(getComputedStyle(words).fill);
        const b = rgbOf(getComputedStyle(tile).fill);
        if (a === null || b === null) continue;
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
        seen.min = Math.min(seen.min, (hi + 0.05) / (lo + 0.05));
        seen.pairs++;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const contrastSeen = (page: Page) => page.evaluate(() => (window as unknown as { __contrast: { min: number; pairs: number } }).__contrast);
const sidewaysSeen = (page: Page) =>
  page.evaluate(() => (window as unknown as { __side: { sideways: number; docWidth: number; innerWidth: number } }).__side);

test('21a: at 375 and 1440, light and dark, the page never scrolls sideways at any step, and the table never does at 375', async ({ page }) => {
  test.setTimeout(600_000);
  for (const size of [PHONE, DESKTOP]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.setViewportSize(size);
      await page.emulateMedia({ colorScheme });
      await open(page, PATH);
      if (size === PHONE) await tableTab(page).click();
      await watchSideways(page);
      if (size === PHONE) await watchPanel(page);
      await playToEnd(page);
      const side = await sidewaysSeen(page);
      const where = `${size.width}px ${colorScheme}`;
      expect(side.sideways, `the page scrolls sideways at ${where}`).toBeLessThanOrEqual(0);
      expect(side.docWidth, `the document is wider than the window at ${where}`).toBeLessThanOrEqual(side.innerWidth);
      if (size === PHONE) {
        const seen = await watched(page);
        expect(seen.overflowX, `the table scrolls sideways at ${where}`).toBeLessThanOrEqual(0);
      }
      expect(await pageOverflow(page), where).toEqual({ down: 0, sideways: 0 });
    }
  }
});

test('21b: a parked tag’s words are at least 4.5 to 1 against its tile, in both themes', async ({ page }) => {
  test.setTimeout(600_000);
  await page.setViewportSize(DESKTOP);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await open(page, PATH);
    await watchContrast(page);
    await playToEnd(page);
    const seen = await contrastSeen(page);
    expect(seen.pairs, `no parked tag was measured in ${colorScheme}`).toBeGreaterThan(0);
    expect(seen.min, `the lowest contrast in ${colorScheme}`).toBeGreaterThanOrEqual(4.5);
  }
});

test('19a: Packets has no Network / Sequence switch, and its page shows the network figure', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await expect(page.locator('[aria-label="View"]')).toHaveCount(0);
  await expect(page.locator('svg[data-figure="net-map"]')).toBeVisible();
});

test('22a: on /networking, Packets’ card holds its spot, the title and the sub, in stop 2’s slot', async ({ page }) => {
  await checkCard(page, 'packets', 2, ariaOf('packets'));
  const card = page.locator('main .route li.stop:not(.stop--soon)', { has: page.locator('h3 a[href$="/packets"]') });
  await expect(card.locator('h3')).toHaveText('Packets');
  await expect(card).toContainText(CARD_SUB);
});
