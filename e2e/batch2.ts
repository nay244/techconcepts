import { expect, type Page } from '@playwright/test';
import { DESKTOP, PHONE, playToEnd, RUN_TIMEOUT } from './batch1';
import { open, pageOverflow } from './support';

export { checkCard, DESKTOP, onlyInDesktopDark, PHONE, playToEnd, RUN_TIMEOUT } from './batch1';

/**
 * What IP Address's, MAC Address's and TCP/UDP's page checks share (design D12, prototypes/d12-batch-2.md §8 and the
 * B14b cases of prototypes/d12-cases.md, on batch1.ts's model): a watcher that reads, a frame at a time, how far the
 * lesson's panel and its labels overflow, how small the figure's box gets, and how far the page scrolls sideways.
 */
export interface Watched {
  panelX: number;
  panelY: number;
  labelX: number;
  pageSideways: number;
  /** The smallest the figure's box ever was, in CSS px. */
  figureHeight: number;
  figureWidth: number;
}

export function watch(page: Page, o: { figure: string; panel: string; labels?: string }): Promise<void> {
  return page.evaluate((spec) => {
    const seen: Watched = { panelX: 0, panelY: 0, labelX: 0, pageSideways: 0, figureHeight: Infinity, figureWidth: Infinity };
    (window as unknown as { __w2: Watched }).__w2 = seen;
    const tick = () => {
      const panel = document.querySelector<HTMLElement>(spec.panel);
      if (panel !== null && panel.getBoundingClientRect().width > 0) {
        seen.panelX = Math.max(seen.panelX, panel.scrollWidth - panel.clientWidth);
        seen.panelY = Math.max(seen.panelY, panel.scrollHeight - panel.clientHeight);
      }
      if (spec.labels !== undefined) {
        for (const el of document.querySelectorAll<HTMLElement>(spec.labels)) if (el.getBoundingClientRect().width > 0) seen.labelX = Math.max(seen.labelX, el.scrollWidth - el.clientWidth);
      }
      const svg = document.querySelector(spec.figure);
      if (svg !== null) {
        const r = svg.getBoundingClientRect();
        seen.figureHeight = Math.min(seen.figureHeight, r.height);
        seen.figureWidth = Math.min(seen.figureWidth, r.width);
      }
      const root = document.scrollingElement ?? document.documentElement;
      seen.pageSideways = Math.max(seen.pageSideways, root.scrollWidth - root.clientWidth);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, o);
}
export const watchedNow = (page: Page): Promise<Watched> => page.evaluate(() => (window as unknown as { __w2: Watched }).__w2);

/** Opens `path` at `size` on the lesson's own tab, watches, plays to the end and returns what was seen. */
export async function playWatched(page: Page, path: string, size: { width: number; height: number }, o: { figure: string; panel: string; labels?: string; tab?: RegExp }): Promise<Watched> {
  await page.setViewportSize(size);
  await open(page, path);
  if (o.tab !== undefined) await page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: o.tab }).click();
  await watch(page, o);
  await playToEnd(page);
  return watchedNow(page);
}

/** At 375 the lesson's fourth tab never scrolls sideways at any step, and nor does the page (check 25). */
export async function checkPhoneTab(page: Page, path: string, tab: RegExp, o: { figure: string; panel: string; labels?: string }): Promise<Watched> {
  const seen = await playWatched(page, path, PHONE, { ...o, tab });
  expect(seen.panelX, 'the tab scrolls sideways').toBeLessThanOrEqual(0);
  expect(seen.pageSideways, 'the page scrolls sideways').toBeLessThanOrEqual(0);
  expect(seen.labelX, 'a label is cut').toBeLessThanOrEqual(0);
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
  return seen;
}
