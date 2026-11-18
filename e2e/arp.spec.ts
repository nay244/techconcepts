import { expect, test } from '@playwright/test';
import { checkCard, checkPhoneTable, DESKTOP, figure, onlyInDesktopDark, playToEnd, RUN_TIMEOUT, watched, watchPanel } from './batch1';
import { collectErrors, open, logRows } from './support';

/** ARP's page checks (design D11, §8 and prototypes/d11-cases.md): the ones that need a browser. */
const PATH = '/networking/arp';
onlyInDesktopDark(PATH);

test('at 375 the Table tab never scrolls sideways at any step, and the page never does (check 19)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const seen = await checkPhoneTable(page, PATH);
  expect(seen.noMatch).toBe(true);
});

test('at 1440 the panel never scrolls, the router names its hardware address, and the run ends with one row and no no-match row', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  await page.setViewportSize(DESKTOP);
  const errors = collectErrors(page);
  await open(page, PATH);
  const svg = figure(page);
  // The resolver is off the map and no phone is shown: this scene is one laptop and one router.
  await expect(svg.locator('[data-base="resolver"]').first()).toBeHidden();
  expect(await svg.locator('[data-base="phone"]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display))).toEqual(['none', 'none']);
  await expect(page.locator('#nm-router-1')).toHaveText('192.168.1.1');
  await expect(page.locator('#nm-router-2')).toHaveText('00:00:5E:00:53:01');
  await expect(page.locator('.tpanel__empty')).toHaveText('Empty. Nothing learned yet.');
  await watchPanel(page);
  await playToEnd(page);
  const seen = await watched(page);
  // At 1440×900 the lesson's table is in the guide, capped at 200px: a taller one scrolls inside itself (D19), so only the page's scroll is checked here.
  expect(seen.overflowX).toBeLessThanOrEqual(0);
  expect(seen.noMatch).toBe(true);
  // At the end: one row, new, and no no-match row left under it.
  await expect(page.locator('.tpanel tbody tr')).toHaveCount(1);
  await expect(page.locator('.tpanel tbody tr')).toHaveAttribute('data-highlight', 'added');
  await expect(page.locator('tr.tpanel__nomatch')).toHaveCount(0);
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Broadcast to everyone', 'Reply', 'Packet']);
  expect(await logRows(page).count()).toBe(6);
  expect(errors).toEqual([]);
});

test('the Networking track page shows ARP’s spot at stop 6 with its description (case 24)', async ({ page }) => {
  await checkCard(
    page,
    'arp',
    6,
    'A laptop at the front sends dotted waves across the plate to three devices: a phone, a printer and a router. Only the router answers: a lit card rises from it, marked IS AT.',
  );
});
