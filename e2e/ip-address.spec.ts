import { expect, test } from '@playwright/test';
import { checkCard, checkPhoneTab, DESKTOP, onlyInDesktopDark, playWatched, RUN_TIMEOUT } from './batch2';
import { collectErrors, logRows } from './support';

/** IP Address's page checks (design D12, §8 and prototypes/d12-cases.md): the ones that need a browser. */
const PATH = '/networking/ip-address';
const WATCH = { figure: 'svg[data-figure="subnet"]', panel: '.bits', labels: '.bits__label' };
onlyInDesktopDark(PATH);

test('at 375 the Bits tab never scrolls sideways at any step, no label is cut, and the page never scrolls (checks 21 and 25)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const seen = await checkPhoneTab(page, PATH, /^Bits/, WATCH);
  // The figure box is Subnetting's: 375 wide, about 275 tall.
  expect(seen.figureHeight).toBeGreaterThan(265);
});

test('at 1440 the board never scrolls, no label is cut, the figure box keeps its 396, and the run ends on seven log rows (checks 21 and §4.2)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const errors = collectErrors(page);
  const seen = await playWatched(page, PATH, DESKTOP, WATCH);
  expect(seen.panelY, 'the board scrolls').toBeLessThanOrEqual(0);
  expect(seen.panelX).toBeLessThanOrEqual(0);
  expect(seen.labelX, 'a label is cut').toBeLessThanOrEqual(0);
  expect(seen.figureHeight).toBeGreaterThan(390);
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Address read', 'Sent', 'Broadcast']);
  expect(await logRows(page).count()).toBe(7);
  expect(errors).toEqual([]);
});

test('the Networking track page shows IP Address’s spot at stop 3 with its description (case 28)', async ({ page }) => {
  await checkCard(page, 'ip-address', 3, 'An address laid out as four tiles on a plate, 192, 168, 1 and 10, with a dot between each. Under each number its 8 bits are engraved. The first tile, 192 over 11000000, is lit.');
});
