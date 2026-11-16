import { expect, test, type Page } from '@playwright/test';
import { spot } from '../src/art/figures/spots';
import { checkCard, DESKTOP, figure, onlyInDesktopDark, PHONE, playToEnd, RUN_TIMEOUT } from './batch1';
import { collectErrors, kicker, lessonCard, open, pageOverflow, playButton } from './support';

/**
 * Proxies' page checks (design D15a, prototypes/d15-proxies-cases.md, the [browser] cases 14, 20, 20b, 20c, 21 and the
 * JavaScript-off case): the map's proxy and reverse proxy at each step, the callouts and the sideways scroll at both
 * sizes and themes, the tunnel under the proxy's box, the log and the frames of each start, the track card, and the
 * figure with JavaScript off.
 *
 * Each test sets its own window or theme, so the window-bound ones run in d1440-dark only (`onlyInDesktopDark`).
 */
const PATH = '/networking/proxies';
const CARD_SUB = 'A go-between for your requests';
const ariaOf = (kind: Parameters<typeof spot>[0]): string => spot(kind).match(/aria-label="([^"]*)"/)![1]!;
const PROXY_STEPS = [2, 3];
const REVERSE_STEPS = [4, 5];

onlyInDesktopDark(PATH);

/** The outline's item for a step: 1 to 5 (index 0 is the Overview). */
const stepItem = (page: Page, step: number) => page.locator('.console__outline .outline__list .outline__item').nth(step);

/** The Steps tab, where the outline is at 375 (an outline click at 375 moves to the Explain tab, so each step is opened from it). */
const stepsTab = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: 'Steps', exact: true });

/** Opens a step from the outline, from the Steps tab at 375. */
async function openStep(page: Page, step: number, phone: boolean): Promise<void> {
  if (phone) await stepsTab(page).click();
  await stepItem(page, step).click();
  await expect(kicker(page)).toContainText(`Step ${step} of 5`);
}

/** How many of the map's proxy and reverse boxes have a box to draw (a hidden one has none). */
const shown = (page: Page) =>
  page.evaluate(() => {
    const drawn = (base: string) =>
      [...document.querySelectorAll(`svg[data-figure="net-map"] [data-base="${base}"]`)].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length;
    return { proxy: drawn('proxy'), reverse: drawn('reverse') };
  });

/** Every callout the map draws now, as the union of its words' boxes (its leader line says nothing about the words). */
const calloutBoxes = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<SVGElement>('svg[data-figure="net-map"] .nm-call')]
      .filter((el) => el.closest('[display="none"], [data-hidden]') === null && getComputedStyle(el).display !== 'none')
      .map((el) => {
        const rs = [...el.querySelectorAll('text')].map((t) => t.getBoundingClientRect()).filter((r) => r.width > 0);
        return {
          text: (el.textContent ?? '').trim().slice(0, 40),
          left: Math.min(...rs.map((r) => r.left)),
          top: Math.min(...rs.map((r) => r.top)),
          right: Math.max(...rs.map((r) => r.right)),
          bottom: Math.max(...rs.map((r) => r.bottom)),
        };
      })
      .filter((b) => Number.isFinite(b.left)),
  );

/** The address texts drawn now, and how tall each box is. */
const addressHeights = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<SVGElement>('svg[data-figure="net-map"] .nm-addr')]
      .filter((el) => el.closest('[display="none"], [data-hidden]') === null)
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0)
      .map((r) => r.height),
  );

test('14 at 1440: from the outline, the proxy shows at steps 2 and 3, the reverse proxy at 4 and 5, and going back from 4 to 3 shows the proxy', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  for (const step of [1, 2, 3, 4, 5]) {
    await stepItem(page, step).click();
    await expect(kicker(page)).toContainText(`Step ${step} of 5`);
    const want = { proxy: PROXY_STEPS.includes(step) ? 5 : 0, reverse: REVERSE_STEPS.includes(step) ? 3 : 0 };
    await expect.poll(() => shown(page), `step ${step}`).toEqual(want);
  }
  await stepItem(page, 4).click();
  await expect(kicker(page)).toContainText('Step 4 of 5');
  await stepItem(page, 3).click();
  await expect(kicker(page)).toContainText('Step 3 of 5');
  await expect.poll(() => shown(page), 'step 3, after step 4').toEqual({ proxy: 5, reverse: 0 });
});

test('14 at 375: from the Steps tab, the outline shows the same proxy and reverse boxes at each step', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT);
  await page.setViewportSize(PHONE);
  await open(page, PATH);
  for (const step of [1, 2, 3, 4, 5]) {
    await openStep(page, step, true);
    await expect.poll(() => shown(page), `step ${step} at 375`).toEqual({ proxy: PROXY_STEPS.includes(step) ? 5 : 0, reverse: REVERSE_STEPS.includes(step) ? 3 : 0 });
  }
});

for (const [name, size] of [['1440 × 900', DESKTOP], ['375 × 812', PHONE]] as const) {
  for (const scheme of ['dark', 'light'] as const) {
    test(`20 at ${name} in the ${scheme} theme: at every step's end the page does not scroll sideways, no two visible callouts overlap, and at 375 the address text is 9px or more`, async ({ page }) => {
      test.setTimeout(RUN_TIMEOUT);
      await page.setViewportSize(size);
      await page.emulateMedia({ colorScheme: scheme });
      const errors = collectErrors(page);
      await open(page, PATH);
      const phone = size === PHONE;
      for (const step of [1, 2, 3, 4, 5]) {
        await openStep(page, step, phone);
        await expect.poll(async () => (await pageOverflow(page)).sideways, `step ${step} sideways`).toBe(0);
        // The two pairs the design names: the forward proxy's callout against the internet's, the reverse proxy's against the web server's.
        const boxes = await calloutBoxes(page);
        for (const [one, other] of [
          ['Forward proxy', 'The internet'],
          ['Reverse proxy', 'Web server10.0.0.20'],
        ] as const) {
          const a = boxes.find((b) => b.text.startsWith(one));
          const b = boxes.find((c) => c.text.startsWith(other));
          if (a === undefined || b === undefined) continue;
          const overlap = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
          expect(overlap, `step ${step}: "${a.text}" and "${b.text}" overlap`).toBe(false);
        }
        // The address text's box is 9px, to within the rounding of the browser's layout.
        if (phone) for (const h of await addressHeights(page)) expect(h, `step ${step}: address text at 375`).toBeGreaterThan(8.9);
      }
      expect(errors).toEqual([]);
    });
  }
}

test('20b: a hidden proxy or reverse box renders nothing, and at steps 2 and 3 the box covers the tunnel where they meet', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  for (const step of [1, 4, 5]) {
    await stepItem(page, step).click();
    await expect(kicker(page)).toContainText(`Step ${step} of 5`);
    const displays = await figure(page).locator('[data-base][data-hidden]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
    expect(displays.length, `step ${step}: hidden boxes`).toBeGreaterThan(0);
    expect(displays.every((d) => d === 'none'), `step ${step}: every hidden box has display none`).toBe(true);
  }
  await stepItem(page, 3).click();
  await expect(kicker(page)).toContainText('Step 3 of 5');
  // The element at the centre of the forward proxy's box is the box itself, not the tunnel's line under it.
  const hit = await figure(page).locator('[data-base="proxy"]').evaluateAll((els) => {
    const drawn = els.find((el) => el.getBoundingClientRect().width > 0);
    if (drawn === undefined) return null;
    const r = drawn.getBoundingClientRect();
    const at = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { inBox: at?.closest('[data-base="proxy"]') !== null && at !== null, onLine: at?.closest('.nm-conn') !== null && at !== null };
  });
  expect(hit).toEqual({ inBox: true, onLine: false });
});

test('20c: Play all runs to the end with 14 log rows; the first frame of step 2 has no page, and the first frame of step 4 has the reverse box', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  // Records, on each frame, the kicker's step and what the map shows, the first time each step is on screen.
  await page.evaluate(() => {
    const first: Record<string, { page: string[]; proxy: number; reverse: number }> = {};
    (window as unknown as { __first: typeof first }).__first = first;
    const tick = () => {
      const k = document.querySelector('.console__explain .explain__kicker')?.textContent ?? '';
      const m = /Step (\d) of 5/.exec(k);
      if (m !== null && first[m[1]!] === undefined) {
        const drawn = (base: string) =>
          [...document.querySelectorAll(`svg[data-figure="net-map"] [data-base="${base}"]`)].filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }).length;
        first[m[1]!] = {
          page: [...document.querySelectorAll<SVGElement>('#nm-page [data-part="text"]')].map((el) => el.style.opacity),
          proxy: drawn('proxy'),
          reverse: drawn('reverse'),
        };
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await playToEnd(page);
  await expect(page.locator('.log__table tbody tr:not(:has(.log__idle))')).toHaveCount(14);
  const first = await page.evaluate(() => (window as unknown as { __first: Record<string, { page: string[]; proxy: number; reverse: number }> }).__first);
  expect(first['2']!.page.length, 'the page has text parts').toBeGreaterThan(0);
  expect(first['2']!.page.every((o) => o === '0'), 'no page at the first frame of step 2').toBe(true);
  expect(first['2']!.proxy, 'the proxy shows at the first frame of step 2').toBe(5);
  expect(first['4']!.reverse, 'the reverse box shows at the first frame of step 4').toBe(3);
  expect(await playButton(page).textContent()).toBe('Play all');
});

for (const scheme of ['dark', 'light'] as const) {
  test(`21 in the ${scheme} theme: the Proxies card on /networking shows the spot, its title and subtitle, at stop 18`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await checkCard(page, 'proxies', 18, ariaOf('proxies'));
    const card = lessonCard(page, 'proxies');
    await expect(card.locator('h3')).toHaveText('Proxies');
    await expect(card).toContainText(CARD_SUB);
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the figure is drawn, its proxy and reverse layers are hidden by CSS, and the page says it needs JavaScript', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(PATH);
    await expect(figure(page)).toBeVisible();
    const displays = await figure(page).locator('[data-base="proxy"], [data-base="reverse"]').evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
    expect(displays.length).toBeGreaterThan(0);
    expect(displays.every((d) => d === 'none')).toBe(true);
    const notes = await page.locator('noscript').evaluateAll((els) => els.map((el) => el.textContent ?? ''));
    expect(notes).toContain('This lesson needs JavaScript to play.');
  });
});
