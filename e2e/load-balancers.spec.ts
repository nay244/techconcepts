import { expect, test, type Page } from '@playwright/test';
import { spot } from '../src/art/figures/spots';
import { checkCard, DESKTOP, PHONE, playToEnd, RUN_TIMEOUT, watchPanel, watched } from './batch1';
import { collectErrors, hydrated, lessonCard, open, pageOverflow, playButton } from './support';

/**
 * Load Balancers' page checks (design D13, prototypes/d13-load-balancers-cases.md, the builder's list E1 to E7): the
 * figure's size at 1440 and at 375, no sideways scroll, a reduced-motion run, the theme colours, the track card at
 * stop 19, the figure with JavaScript off, and the keyboard and screen reader.
 *
 * Each test sets its own window or theme, so these run once, in d1440-dark. The page reads its theme when it loads, so
 * each theme is opened afresh.
 */
const PATH = '/networking/load-balancers';
const CARD_SUB = 'One address, many servers';
const ariaOf = (kind: Parameters<typeof spot>[0]): string => spot(kind).match(/aria-label="([^"]*)"/)![1]!;
const pool = (page: Page) => page.locator('svg[data-figure="pool"]');

test.beforeEach(async ({}, info) => {
  test.skip(info.project.name !== 'd1440-dark', 'These tests set their own window and theme; they run in d1440-dark only.');
});

/** The smallest and the largest the stage's box got, in CSS px, a frame at a time, and the widest the document got. */
function watchStage(page: Page): Promise<void> {
  return page.evaluate(() => {
    const seen = { minW: Infinity, maxW: 0, minH: Infinity, maxH: 0, sideways: 0 };
    (window as unknown as { __stage: typeof seen }).__stage = seen;
    const tick = () => {
      const box = document.querySelector('.stage__figure');
      if (box !== null && box.getBoundingClientRect().width > 0) {
        const r = box.getBoundingClientRect();
        seen.minW = Math.min(seen.minW, r.width);
        seen.maxW = Math.max(seen.maxW, r.width);
        seen.minH = Math.min(seen.minH, r.height);
        seen.maxH = Math.max(seen.maxH, r.height);
      }
      const root = document.scrollingElement ?? document.documentElement;
      seen.sideways = Math.max(seen.sideways, root.scrollWidth - root.clientWidth);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
const stageSeen = (page: Page) =>
  page.evaluate(() => (window as unknown as { __stage: { minW: number; maxW: number; minH: number; maxH: number; sideways: number } }).__stage);

/**
 * B's health is "Unhealthy" only part of the way through the run (the table ends Healthy again), so the watch records,
 * at the first frame each shows it: the table cell that reads "Unhealthy" (found), and the figure's health word that
 * does (its weight and its fill), with the blocked colour to compare with.
 */
interface Unhealthy {
  tableFound: boolean;
  wordFound: boolean;
  wordBold: number;
  wordFill: string;
  blocked: string;
}
function watchUnhealthy(page: Page): Promise<void> {
  return page.evaluate(() => {
    const seen: Unhealthy = { tableFound: false, wordFound: false, wordBold: 0, wordFill: '', blocked: '' };
    (window as unknown as { __unhealthy: Unhealthy }).__unhealthy = seen;
    const probe = document.createElement('span');
    probe.style.color = 'var(--blocked)';
    document.body.append(probe);
    seen.blocked = getComputedStyle(probe).color;
    probe.remove();
    const tick = () => {
      if (!seen.tableFound) {
        seen.tableFound = [...document.querySelectorAll<HTMLElement>('.tpanel td, .tpanel th')].some((el) => el.textContent?.trim() === 'Unhealthy');
      }
      if (!seen.wordFound) {
        const word = [...document.querySelectorAll<SVGElement>('svg[data-figure="pool"] .pl-health-t')].find((el) => el.textContent?.trim() === 'Unhealthy');
        if (word !== undefined) {
          const style = getComputedStyle(word);
          seen.wordFound = true;
          seen.wordBold = Number(style.fontWeight);
          seen.wordFill = style.fill;
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
const unhealthySeen = (page: Page): Promise<Unhealthy> => page.evaluate(() => (window as unknown as { __unhealthy: Unhealthy }).__unhealthy);

/** The computed fills of the lamps and of the health words, as the page draws them now. */
const paint = (page: Page) =>
  page.evaluate(() => ({
    // The fixed lamps (.pl-lamp: allowed, denied, idle) keep their colours in both themes; the pick lights follow the lit tokens (H10).
    lamps: [...document.querySelectorAll<SVGElement>('svg[data-figure="pool"] .pl-lamp')].map((el) => getComputedStyle(el).fill),
    healthText: [...document.querySelectorAll<SVGElement>('svg[data-figure="pool"] .pl-health-t')].map((el) => getComputedStyle(el).fill),
  }));

test('E1: at 1440 the stage is 733 wide and 347 tall (±4) at every step, the table never scrolls, and the run ends with 19 log rows', async ({ page }) => {
  test.setTimeout(600_000);
  for (const colorScheme of ['dark', 'light'] as const) {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ colorScheme });
    await open(page, PATH);
    // At 1440 the console shows the table beside the figure, with no tab to open.
    await expect(page.locator('.tpanel')).toBeVisible();
    await watchStage(page);
    await watchPanel(page);
    await playToEnd(page);
    const sized = await stageSeen(page);
    expect(Math.round(sized.minW), `the stage's width at 1440 ${colorScheme}`).toBe(733);
    expect(Math.round(sized.maxW), `the stage's width at 1440 ${colorScheme}`).toBe(733);
    expect(sized.minH, `the stage's height at 1440 ${colorScheme}`).toBeGreaterThanOrEqual(343);
    expect(sized.maxH, `the stage's height at 1440 ${colorScheme}`).toBeLessThanOrEqual(351);
    const seen = await watched(page);
    expect(seen.overflowY, `the table scrolls down at 1440 ${colorScheme}`).toBeLessThanOrEqual(0);
    await expect(page.locator('.log__table tbody tr:not(:has(.log__idle))')).toHaveCount(19);
  }
});

test('E2: at 375 the stage is 375 wide and 275 tall (±4), and the page and each tab never scroll sideways', async ({ page }) => {
  test.setTimeout(600_000);
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  for (const tab of [/^Explain/, /^Log/, /^Table/]) {
    await page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: tab }).click();
    await watchStage(page);
    await watchPanel(page);
    await playToEnd(page);
    const sized = await stageSeen(page);
    const where = `on the ${tab.source} tab at 375`;
    expect(Math.round(sized.minW), `the stage's width ${where}`).toBe(375);
    expect(sized.minH, `the stage's height ${where}`).toBeGreaterThanOrEqual(271);
    expect(sized.maxH, `the stage's height ${where}`).toBeLessThanOrEqual(279);
    expect(sized.sideways, `the page scrolls sideways ${where}`).toBeLessThanOrEqual(0);
    expect((await watched(page)).overflowX, `the panel scrolls sideways ${where}`).toBeLessThanOrEqual(0);
    expect(await pageOverflow(page), where).toEqual({ down: 0, sideways: 0 });
  }
});

test('E3: a reduced-motion run plays to the end and settles on Play all', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const errors = collectErrors(page);
  await page.setViewportSize(DESKTOP);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, PATH);
  await playToEnd(page);
  await expect(playButton(page)).toHaveText('Play all');
  expect(errors).toEqual([]);
});

test('E4: the lamps look the same in both themes, the health words change, and "Unhealthy" is bold in the blocked colour', async ({ page }) => {
  test.setTimeout(600_000);
  const seenIn: Partial<Record<'dark' | 'light', Awaited<ReturnType<typeof paint>> & Unhealthy>> = {};
  for (const colorScheme of ['dark', 'light'] as const) {
    await page.setViewportSize(DESKTOP);
    await page.emulateMedia({ colorScheme });
    await open(page, PATH);
    await expect(page.locator('.tpanel')).toBeVisible();
    const fills = await paint(page);
    await watchUnhealthy(page);
    await playToEnd(page);
    seenIn[colorScheme] = { ...fills, ...(await unhealthySeen(page)) };
  }
  const dark = seenIn.dark!;
  const light = seenIn.light!;
  expect(light.lamps.length, 'the lamps').toBeGreaterThan(0);
  expect(light.lamps, 'each lamp’s fill, in light against dark').toEqual(dark.lamps);
  expect(light.healthText.length, 'the health words').toBeGreaterThan(0);
  expect(light.healthText, 'the health words’ fill changes with the theme').not.toEqual(dark.healthText);
  for (const [name, seen] of [['dark', dark], ['light', light]] as const) {
    expect(seen.wordFound, `"Unhealthy" shows on the figure during the run, in ${name}`).toBe(true);
    expect(seen.wordBold, `"Unhealthy" is bold in ${name}`).toBeGreaterThanOrEqual(600);
    expect(seen.wordFill, `"Unhealthy" is the blocked colour in ${name}`).toBe(seen.blocked);
  }
});

test('E5: on /networking, stop 19 is Load Balancers, with its spot, its one-line sub and Start', async ({ page }) => {
  await checkCard(page, 'load-balancers', 19, ariaOf('load-balancers'));
  const card = lessonCard(page, 'load-balancers');
  await expect(card.locator('h3')).toHaveText('Load Balancers');
  await expect(card).toContainText(CARD_SUB);
  await expect(card.locator('.stop__acts .btn')).toHaveText('Start');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('E6: the figure shows its Overview, the table has its three Healthy rows, and no console error', async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize(DESKTOP);
    await page.goto(PATH);
    await expect(pool(page)).toBeVisible();
    await expect(page.locator('.tpanel tbody tr', { hasText: 'Healthy' })).toHaveCount(3);
    expect(errors).toEqual([]);
  });
});

test('E7: the figure is one labelled image, the live region carries the events, and B’s "Unhealthy" is text', async ({ page }) => {
  test.setTimeout(600_000);
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  await expect(pool(page)).toHaveAttribute('role', 'img');
  await expect(pool(page)).toHaveAttribute('aria-label', /.+/);
  await watchUnhealthy(page);
  await hydrated(page);
  await playToEnd(page);
  expect((await unhealthySeen(page)).tableFound, '"Unhealthy" is text in the table during the run').toBe(true);
  await expect(page.locator('[aria-live]').filter({ hasText: /\S/ }).first()).not.toBeEmpty();
});
