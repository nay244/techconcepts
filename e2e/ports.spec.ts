import { expect, test } from '@playwright/test';
import { checkCard, checkPhoneTable, DESKTOP, figure, onlyInDesktopDark, playToEnd, RUN_TIMEOUT, watched, watchPanel } from './batch1';
import { collectErrors, open, setSpeed } from './support';

/** Ports’ page checks (design D11, §8 and prototypes/d11-cases.md): the ones that need a browser. */
const PATH = '/networking/ports';
onlyInDesktopDark(PATH);

test('at 375 the Table tab never scrolls sideways at any step, and the page never does (check 19)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const seen = await checkPhoneTable(page, PATH);
  expect(seen.noMatch).toBe(true);
  expect(seen.rows).toBe(4);
});

test('at 1440 the panel never scrolls, the map is never under 316px tall, and the run ends as the spec says', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  await page.setViewportSize(DESKTOP);
  const errors = collectErrors(page);
  await open(page, PATH);
  const svg = figure(page);
  await expect(svg.locator('[data-base="resolver"]').first()).toBeHidden();
  expect(await svg.locator('[data-base="phone"]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display))).toEqual(['none', 'none']);
  await expect(page.locator('.tpanel__by')).toHaveText(/example\.net \(203\.0\.113\.80\)/);
  await expect(page.locator('.tpanel tbody tr')).toHaveCount(3);
  await watchPanel(page);
  await playToEnd(page);
  const seen = await watched(page);
  expect(seen.overflowY, 'the panel scrolls').toBeLessThanOrEqual(0);
  expect(seen.overflowX).toBeLessThanOrEqual(0);
  // Step 4's three rows and the no-match row make the smallest map: at least 316px tall.
  expect(seen.figureHeight).toBeGreaterThanOrEqual(316);
  expect(seen.noMatch).toBe(true);
  // Nothing is lost on this map: no LOST mark, no DROPPED mark, and the server's light came on.
  await expect(svg.locator('#nm-drop')).toHaveCSS('opacity', '0');
  await expect(svg.locator('#nm-discard')).toHaveCSS('opacity', '0');
  expect(seen.lit).toContain('nm-ports-busy-server');
  // At the end: four rows, TCP 3389 last and matched, no no-match row.
  const rows = page.locator('.tpanel tbody tr');
  await expect(rows).toHaveCount(4);
  await expect(rows.last()).toHaveAttribute('data-highlight', 'matched');
  await expect(rows.last()).toContainText('TCP 3389');
  await expect(page.locator('tr.tpanel__nomatch')).toHaveCount(0);
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Request', 'Reply', 'Reset']);
  expect(errors).toEqual([]);
});

test('the Networking track page shows Ports’ spot at stop 10 with its description (case 24)', async ({ page }) => {
  await checkCard(
    page,
    'ports',
    10,
    'A tall server with four numbered doors down its front: 22, 80, 443 and 3389. A light beside the first three is on; 3389’s is dark. A lit packet is halfway through door 80.',
  );
});

test('step 4 ends with the no-match row under the three rows, and the figure is at least 316px tall there', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  await page.setViewportSize(DESKTOP);
  await open(page, `${PATH}?step=4`);
  // Step 4 plays on arrival.
  await setSpeed(page, '2×');
  await expect(page.locator('tr.tpanel__nomatch')).toHaveCount(1, { timeout: 60_000 });
  await expect(page.locator('.tpanel tbody tr')).toHaveCount(4);
  expect((await figure(page).boundingBox())!.height).toBeGreaterThanOrEqual(316);
});
