import { expect, test, type Page } from '@playwright/test';
import { spot } from '../src/art/figures/spots';
import { checkCard, DESKTOP, PHONE, playToEnd, RUN_TIMEOUT, tableTab, watchPanel, watched } from './batch1';
import { collectErrors, open, pageOverflow, playButton } from './support';

/**
 * Switch's page checks (design D13, prototypes/d13-switch-cases.md, checks 15 and 16, JavaScript off, and the Sequence
 * switch, 31): the page's width at 375 and 1440 in both themes, the callouts' text, the sizes at 375, the track card,
 * the figure with JavaScript off, and a reduced-motion run.
 *
 * The window and the theme are set by each test, so these run once, in d1440-dark.
 */
const PATH = '/networking/switch';
const ariaOf = (kind: Parameters<typeof spot>[0]): string => spot(kind).match(/aria-label="([^"]*)"/)![1]!;
const figure = (page: Page) => page.locator('svg[data-figure="switch"]');

test.beforeEach(async ({}, info) => {
  test.skip(info.project.name !== 'd1440-dark', 'These tests set their own window and theme; they run in d1440-dark only.');
});

/** Watches the document's width from here on, a frame at a time. */
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
const sidewaysSeen = (page: Page) =>
  page.evaluate(() => (window as unknown as { __side: { sideways: number; docWidth: number; innerWidth: number } }).__side);

/** The count of pairs of callout text boxes, from different callouts, that overlap, once the page has settled. */
const calloutOverlaps = (page: Page): Promise<number> =>
  page.evaluate(() => {
    const callouts = [...document.querySelectorAll<SVGGElement>('.sw-call')];
    const boxes = callouts.map((c) => [...c.querySelectorAll('text')].map((t) => t.getBoundingClientRect()));
    let overlaps = 0;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        for (const a of boxes[i]!) {
          for (const b of boxes[j]!) {
            if (a.width > 0 && b.width > 0 && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) overlaps++;
          }
        }
      }
    }
    return overlaps;
  });

/** The smallest rendered font size, in CSS px, of the callouts' MAC words and of their names. */
const calloutSizes = (page: Page): Promise<{ mac: number; name: number }> =>
  page.evaluate(() => {
    const svg = document.querySelector<SVGSVGElement>('svg[data-figure="switch"]')!;
    const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    const texts = [...document.querySelectorAll<SVGTextElement>('svg[data-figure="switch"] .sw-call text')];
    const size = (t: SVGTextElement) => parseFloat(getComputedStyle(t).fontSize) * scale;
    const mac = texts.filter((t) => /MAC/.test(t.textContent ?? '')).map(size);
    const name = [...document.querySelectorAll<SVGTextElement>('svg[data-figure="switch"] .sw-name')].map(size);
    return { mac: Math.min(...mac), name: Math.min(...name) };
  });

test('15a: at 375 and 1440, light and dark, every step played and every step opened: the page never scrolls sideways, the callouts do not overlap, and at 375 the table never does', async ({ page }) => {
  test.setTimeout(600_000);
  for (const size of [PHONE, DESKTOP]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      const where = `${size.width}px ${colorScheme}`;
      await page.setViewportSize(size);
      await page.emulateMedia({ colorScheme });
      await open(page, PATH);
      if (size === PHONE) await tableTab(page).click();
      await watchSideways(page);
      if (size === PHONE) await watchPanel(page);
      await playToEnd(page);
      const side = await sidewaysSeen(page);
      expect(side.sideways, `the page scrolls sideways at ${where}`).toBeLessThanOrEqual(0);
      expect(side.docWidth, `the document is wider than the window at ${where}`).toBeLessThanOrEqual(side.innerWidth);
      expect(await calloutOverlaps(page), `callout text overlaps at ${where}`).toBe(0);
      if (size === PHONE) {
        const seen = await watched(page);
        expect(seen.overflowX, `the table scrolls sideways at ${where}`).toBeLessThanOrEqual(0);
      }
      expect(await pageOverflow(page), where).toEqual({ down: 0, sideways: 0 });
    }
  }
});

test('15c: the callouts are as large as §4.2 says: at 375 the MAC words are at least 6.6px and the names 6.0px, and at 1440 the drawing is 733 wide', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  const phone = await calloutSizes(page);
  expect(phone.mac, 'the MAC words at 375').toBeGreaterThanOrEqual(6.6);
  expect(phone.name, 'the names at 375').toBeGreaterThanOrEqual(6.0);
  await page.setViewportSize(DESKTOP);
  const box = await figure(page).boundingBox();
  expect(Math.round(box!.width), 'the drawing at 1440').toBe(733);
});

test('16: the Networking track page shows the switch’s spot at stop 05, in both themes', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await checkCard(page, 'switch', 5, ariaOf('switch'));
  }
});

test('31: Switch has no Network / Sequence switch', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await expect(page.locator('[aria-label="View"]')).toHaveCount(0);
  await expect(figure(page)).toBeVisible();
});

test('a reduced-motion run plays to the end and settles on Play all', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const errors = collectErrors(page);
  await page.setViewportSize(DESKTOP);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, PATH);
  await playToEnd(page);
  await expect(playButton(page)).toHaveText('Play all');
  expect(errors).toEqual([]);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('30: the figure shows its Overview with its label; no view, trace or cable of step 5 shows; the chips read PORT 1 to PORT 4', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(PATH);
    await expect(figure(page)).toHaveAttribute('role', 'img');
    await expect(figure(page)).toHaveAttribute('aria-label', /.+/);
    await expect(page.locator('.sw-v').first()).toBeHidden();
    await expect(page.locator('svg[data-figure="switch"] .sw-trace[data-on]')).toHaveCount(0);
    await expect(page.locator('#sw-cable-laptop-5')).toBeHidden();
    for (const n of [1, 2, 3, 4]) await expect(page.locator('svg[data-figure="switch"]')).toContainText(`PORT ${n}`);
    // Found by its class: Playwright's text matching skips what is inside a <noscript> (lesson.spec.ts says the same).
    await expect(page.locator('.console__log td[data-idle] noscript .log__nojs')).toHaveText('This lesson needs JavaScript to play.');
  });
});
