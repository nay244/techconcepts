import { expect, test } from '@playwright/test';
import { checkCard, checkPhoneTable, DESKTOP, figure, onlyInDesktopDark, PHONE, playToEnd, RUN_TIMEOUT, watched, watchPanel } from './batch1';
import { collectErrors, open } from './support';

/** NAT’s page checks (design D11, §8 and prototypes/d11-cases.md): the ones that need a browser. */
const PATH = '/networking/nat';
onlyInDesktopDark(PATH);

test('at 375 the Table tab never scrolls sideways at any step, and the page never does (check 19)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const seen = await checkPhoneTable(page, PATH);
  expect(seen.noMatch).toBe(true);
  expect(seen.rows).toBe(2);
});

test('at 1440 the panel never scrolls, the phone and the stranger are on the map, and the run ends as the spec says', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  await page.setViewportSize(DESKTOP);
  const errors = collectErrors(page);
  await open(page, PATH);
  const svg = figure(page);
  await expect(svg.locator('[data-base="resolver"]').first()).toBeHidden();
  // The phone is shown, with its callout; the figure says so in words.
  expect(await svg.locator('[data-base="phone"]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display))).not.toContain('none');
  await expect(svg.locator('text', { hasText: 'Your phone' })).toBeVisible();
  await expect(svg.locator('text', { hasText: 'Someone else' })).toBeVisible();
  const words = await svg.getAttribute('aria-label');
  expect(words).toContain('a laptop, a phone and their router');
  expect(words!.endsWith('Behind the internet, someone else’s computer, on another network.')).toBe(true);
  await expect(page.locator('.tpanel__empty')).toHaveText('Empty. Nothing has gone out yet.');
  await watchPanel(page);
  await playToEnd(page);
  const seen = await watched(page);
  // At 1440×900 the lesson's table is in the guide, capped at 200px: a taller one scrolls inside itself (D19), so only the page's scroll is checked here.
  expect(seen.overflowX).toBeLessThanOrEqual(0);
  expect(seen.lit).toEqual(expect.arrayContaining(['nm-busy-phone', 'nm-nat-busy-stranger']));
  // The end: two rows, the no-match row last, "Reply received" in the done style, nothing lost or dropped.
  await expect(page.locator('.tpanel tbody tr')).toHaveCount(3);
  await expect(page.locator('.tpanel tbody tr').last()).toHaveClass(/tpanel__nomatch/);
  await expect(page.locator('#nm-lapState')).toHaveText('Reply received');
  await expect(page.locator('#nm-lapState')).toHaveClass(/done/);
  await expect(svg.locator('#nm-drop')).toHaveCSS('opacity', '0');
  await expect(svg.locator('#nm-discard')).toHaveCSS('opacity', '0');
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Packet', 'Reply']);
  expect(errors).toEqual([]);
});

for (const scheme of ['dark', 'light'] as const) {
  test(`at 375 in the ${scheme} theme the phone is about 17 × 9px and no two callouts overlap`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.emulateMedia({ colorScheme: scheme });
    await open(page, PATH);
    const box = await page.locator('svg[data-figure="net-map"] [data-base="phone"]').first().boundingBox();
    expect(box!.width).toBeGreaterThan(13);
    expect(box!.width).toBeLessThan(21);
    expect(box!.height).toBeGreaterThan(6);
    expect(box!.height).toBeLessThan(13);
    const boxes = await figure(page).evaluate((root) =>
      [...root.querySelectorAll('.nm-call')]
        .filter((el) => el.closest('[display="none"], [data-hidden]') === null && getComputedStyle(el).display !== 'none')
        .map((el) => {
          // The callout's words: its leader line is a thin diagonal whose box says nothing about where the words are.
          const rs = [...el.querySelectorAll('text')].map((t) => t.getBoundingClientRect()).filter((r) => r.width > 0);
          const mine = el.parentElement?.getAttribute('data-base') === 'phone' || el.parentElement?.getAttribute('data-layer') === 'nat:stranger';
          return [mine, Math.min(...rs.map((r) => r.left)), Math.min(...rs.map((r) => r.top)), Math.max(...rs.map((r) => r.right)), Math.max(...rs.map((r) => r.bottom))] as const;
        }),
    );
    expect(boxes.length).toBeGreaterThanOrEqual(5);
    // The phone's and the stranger's callouts clear every other (the old callouts' own boxes are as they were).
    const added = boxes.filter((b) => b[0]);
    expect(added).toHaveLength(2);
    for (const a of added) boxes.forEach((b, i) => a !== b && expect(a[1]! < b[3]! && b[1]! < a[3]! && a[2]! < b[4]! && b[2]! < a[4]!, `a new callout and callout ${i}`).toBe(false));
  });
}

test('at 375 the phone’s screen glows when the router’s reply lands on it', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  await watchPanel(page);
  await playToEnd(page);
  expect((await watched(page)).lit).toContain('nm-busy-phone');
});

test('the Networking track page shows NAT’s spot at stop 12 with its description (case 24)', async ({ page }) => {
  await checkCard(
    page,
    'nat',
    12,
    'A home router in the middle, with a laptop and a phone behind it and one cable out to the right. Over the laptop’s cable floats a tag with its private address, 192.168.1.100; over the cable out, a lit tag with the router’s public address, 198.51.100.23. A dotted arc joins them over the router.',
  );
});

test.describe('with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  for (const path of ['/', '/how-the-internet-works/what-is-ip', PATH]) {
    test(`${path}: the phone is hidden by CSS alone`, async ({ page }) => {
      await page.goto(path);
      const displays = await page.locator('[data-base="phone"]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
      expect(displays.length).toBeGreaterThan(0);
      expect(displays.every((d) => d === 'none')).toBe(true);
    });
  }
  test('NAT’s figure describes what it draws: a laptop and its router', async ({ page }) => {
    await page.goto(PATH);
    const words = await page.locator('svg[data-figure="net-map"]').first().getAttribute('aria-label');
    expect(words).toContain('a laptop and its router');
    expect(words).not.toContain('a phone');
  });
});
