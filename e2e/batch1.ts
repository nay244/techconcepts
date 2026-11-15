import { expect, test, type Page } from '@playwright/test';
import { collectErrors, hydrated, lessonCard, open, pageOverflow, playButton, setSpeed } from './support';

/**
 * What ARP's, Ports' and NAT's page checks share (design D11, prototypes/d11-batch-1.md §8 and the attack cases in
 * prototypes/d11-cases.md, on router.spec.ts's model): each runs in the d1440-dark project only, sets its own window
 * sizes, and skips itself while its lesson has no page.
 */
export const PHONE = { width: 375, height: 812 };
export const DESKTOP = { width: 1440, height: 900 };
export const RUN_TIMEOUT = 150_000;

/** The describe-level setup of a per-lesson spec. */
export function onlyInDesktopDark(path: string): void {
  test.beforeEach(async ({ request }, info) => {
    test.skip(info.project.name !== 'd1440-dark', 'These tests set their own window; they run in d1440-dark only.');
    test.skip((await request.get(path)).status() === 404, `${path} has no page yet.`);
  });
}

export const tableTab = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Table/ });
export const figure = (page: Page) => page.locator('svg[data-figure="net-map"]');

/** Plays the unit at 2× from its Overview, and waits for the run to end on Replay. */
export async function playToEnd(page: Page): Promise<void> {
  await setSpeed(page, '2×');
  await playButton(page).click();
  await expect(playButton(page)).toHaveText('Pause');
  await expect(playButton(page)).toHaveText('Replay', { timeout: RUN_TIMEOUT });
}

export interface Seen {
  overflowX: number;
  overflowY: number;
  noMatch: boolean;
  pageSideways: number;
  /** The most rows the table had at once, and the largest the figure's box got in height. */
  rows: number;
  /** The ids of the map's lights seen on at any frame. */
  lit: string[];
  /** The smallest the figure's box ever was, in CSS px. */
  figureHeight: number;
}

/** Watches the page from here on, a frame at a time, and reports what it saw of the table panel and the map. */
export function watchPanel(page: Page): Promise<void> {
  return page.evaluate(() => {
    const seen: Seen = { overflowX: 0, overflowY: 0, noMatch: false, pageSideways: 0, rows: 0, lit: [], figureHeight: Infinity };
    (window as unknown as { __watch: Seen }).__watch = seen;
    const tick = () => {
      const panel = document.querySelector<HTMLElement>('.tpanel');
      if (panel !== null) {
        seen.overflowX = Math.max(seen.overflowX, panel.scrollWidth - panel.clientWidth);
        seen.overflowY = Math.max(seen.overflowY, panel.scrollHeight - panel.clientHeight);
        seen.noMatch ||= panel.querySelector('tr.tpanel__nomatch') !== null;
        seen.rows = Math.max(seen.rows, panel.querySelectorAll('tbody tr:not(.tpanel__nomatch):not(:has(.tpanel__empty))').length);
      }
      for (const el of document.querySelectorAll('svg[data-figure="net-map"] .on[id]')) if (!seen.lit.includes(el.id)) seen.lit.push(el.id);
      const svg = document.querySelector('svg[data-figure="net-map"]');
      if (svg !== null) seen.figureHeight = Math.min(seen.figureHeight, svg.getBoundingClientRect().height);
      const root = document.scrollingElement ?? document.documentElement;
      seen.pageSideways = Math.max(seen.pageSideways, root.scrollWidth - root.clientWidth);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
export const watched = (page: Page): Promise<Seen> => page.evaluate(() => (window as unknown as { __watch: Seen }).__watch);

/** Check 19 at 375: in the Table tab, at every step, the panel never scrolls sideways and the page never does. */
export async function checkPhoneTable(page: Page, path: string): Promise<Seen> {
  await page.setViewportSize(PHONE);
  await open(page, path);
  await tableTab(page).click();
  await watchPanel(page);
  await playToEnd(page);
  const seen = await watched(page);
  expect(seen.overflowX, 'the panel scrolls sideways').toBeLessThanOrEqual(0);
  expect(seen.pageSideways, 'the page scrolls sideways').toBeLessThanOrEqual(0);
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
  return seen;
}

/** Case 24 on the track page: the lesson's card at its stop, with the spec's words. */
export async function checkCard(page: Page, slug: string, stop: number, aria: string): Promise<void> {
  await page.setViewportSize(DESKTOP);
  const errors = collectErrors(page);
  await page.goto('/networking');
  await hydrated(page);
  const card = lessonCard(page, slug);
  await expect(card).toHaveCount(1);
  await expect(card.locator('svg[role="img"]')).toHaveAttribute('aria-label', aria);
  const stops = page.locator('main .route li.stop');
  expect(await stops.evaluateAll((els, el) => els.indexOf(el as HTMLElement), await card.elementHandle())).toBe(stop - 1);
  expect(errors).toEqual([]);
}
