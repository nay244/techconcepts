import { expect, test } from '@playwright/test';
import { checkCard, checkPhoneTab, DESKTOP, onlyInDesktopDark, playWatched, RUN_TIMEOUT } from './batch2';
import { collectErrors, logRows, viewSwitch } from './support';

/** TCP/UDP's page checks (design D12, §8 and prototypes/d12-cases.md): the ones that need a browser. */
const PATH = '/networking/tcp-udp';
const WATCH = { figure: 'svg[data-figure="net-map"]', panel: '.tpanel' };
onlyInDesktopDark(PATH);

test('at 375 the Table tab never scrolls sideways at any step, and the page never does (check 25)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const seen = await checkPhoneTab(page, PATH, /^Table/, WATCH);
  // The Network / Sequence switch takes room: the figure box is about 235.
  expect(seen.figureHeight).toBeGreaterThan(225);
});

test('at 1440 the panel never scrolls, the figure box keeps 346, the voice plate is on the map, and the run ends as the spec says', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const errors = collectErrors(page);
  const seen = await playWatched(page, PATH, DESKTOP, WATCH);
  expect(seen.panelY, 'the panel scrolls').toBeLessThanOrEqual(0);
  expect(seen.panelX).toBeLessThanOrEqual(0);
  expect(seen.figureHeight).toBeGreaterThan(344);
  const svg = page.locator(WATCH.figure);
  await expect(svg.locator('[data-layer="tcp-udp:voice"] text', { hasText: 'Voice server' })).toBeVisible();
  await expect(svg.locator('[data-layer="tcp-udp:voice"] text', { hasText: '203.0.113.90 · port 16384' })).toBeVisible();
  expect(await svg.getAttribute('aria-label')).toMatch(/Behind the internet, the voice server the call goes through\.$/);
  await expect(svg.locator('[data-base="resolver"]').first()).toBeHidden();
  // The end: three rows, side by side, the connection still lit, the page on the laptop's screen, nothing marked.
  await expect(page.locator('.tpanel tbody tr')).toHaveCount(3);
  await expect(page.locator('.tpanel [data-miss]')).toHaveCount(0);
  await expect(page.locator('#nm-lapState')).toHaveText('Talking, one packet lost');
  await expect(svg.locator('.nm-conn')).toHaveCount(1);
  await expect(svg.locator('#nm-page [data-part="text"]').first()).toHaveCSS('opacity', '1');
  await expect(svg.locator('#nm-drop')).toHaveCSS('opacity', '0');
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Sent by your laptop', 'Sent to your laptop', 'Lost on the way']);
  expect(await logRows(page).count()).toBe(14);
  await expect(page.locator('.console__log tbody tr[data-outcome="dropped"]')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('TCP/UDP has the Network and Sequence views', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await expect(viewSwitch(page)).toBeVisible();
  await expect(viewSwitch(page).getByRole('button')).toHaveText(['Network', 'Sequence']);
});

test('the Networking track page shows TCP/UDP’s spot at stop 11 with its description (case 28)', async ({ page }) => {
  await checkCard(
    page,
    'tcp-udp',
    11,
    'Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.',
  );
});
