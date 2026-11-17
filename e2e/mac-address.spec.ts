import { expect, test, type Page } from '@playwright/test';
import { checkCard, checkPhoneTab, DESKTOP, onlyInDesktopDark, PHONE, playToEnd, playWatched, RUN_TIMEOUT } from './batch2';
import { collectErrors, logRows, open } from './support';

/** MAC Address's page checks (design D12, §8, §11.3 and prototypes/d12-cases.md): the ones that need a browser. */
const PATH = '/networking/mac-address';
const FIGURE = 'svg[data-figure="dhcp"]';
const WATCH = { figure: FIGURE, panel: '.tpanel' };
const FRAMES = 'A home Wi-Fi network on one plate: a laptop, a phone and a TV, and the router at the back. Beside each, its name and its MAC address.';
onlyInDesktopDark(PATH);

test('at 375 the Table tab never scrolls sideways at any step, and the page never does (check 25)', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const seen = await checkPhoneTab(page, PATH, /^Table/, WATCH);
  // No views group: the stage head goes and the figure box is about 275.
  expect(seen.figureHeight).toBeGreaterThan(265);
});

test('at 1440 the panel never scrolls, the figure box is 498, and the run ends with every verdict the table says and three log rows', async ({ page }) => {
  test.setTimeout(RUN_TIMEOUT + 30_000);
  const errors = collectErrors(page);
  const seen = await playWatched(page, PATH, DESKTOP, WATCH);
  expect(seen.panelY, 'the panel scrolls').toBeLessThanOrEqual(0);
  expect(seen.panelX).toBeLessThanOrEqual(0);
  expect(seen.figureHeight).toBeGreaterThan(496);
  const verdicts = await page.locator(`${FIGURE} .dh-v`).evaluateAll((els) => els.map((el) => [el.id, el.getAttribute('data-v'), el.textContent] as const));
  const byId = (id: string) => verdicts.find((v) => v[0] === id);
  expect(['router', 'laptop', 'phone', 'tv'].map((p) => byId(`dh-v-${p}`))).toEqual([
    ['dh-v-router', 'sent', 'Sent it'],
    ['dh-v-laptop', 'keeps', 'Keeps it'],
    ['dh-v-phone', 'ignores', 'Ignores it'],
    ['dh-v-tv', 'ignores', 'Ignores it'],
  ]);
  expect(await page.locator('.tpanel tbody tr td:nth-child(3)').allTextContents()).toEqual(['Sent it', 'Keeps it', 'Ignores it', 'Ignores it']);
  expect(await page.locator('.log__legend li').allTextContents()).toEqual(['Frame to one device', 'Frame to everyone', 'Frame back to the laptop']);
  expect(await logRows(page).count()).toBe(3);
  expect(errors).toEqual([]);
});

/** The page's own words for the setup: what is shown, hidden and said. */
async function setup(page: Page) {
  return page.locator(FIGURE).evaluate((svg) => ({
    frames: [...svg.querySelectorAll('[data-setup="frames"]')].map((g) => g.getAttribute('display')),
    addresses: [...svg.querySelectorAll('[data-setup="addresses"]')].map((g) => g.getAttribute('display')),
    ip: [(svg.querySelector('#dh-lap-ip') as SVGElement).style.opacity, (svg.querySelector('#dh-lap-noip') as SVGElement).style.opacity],
    label: svg.getAttribute('aria-label'),
  }));
}

test('H10: the built page already draws the frames setup, so with JavaScript off, and before the island loads, it is the TV and not the lease board', async ({ request, page }) => {
  const html = await (await request.get(PATH)).text();
  expect(html).not.toContain('data-setup="frames" display="none"');
  expect(html.split('<g data-setup="addresses" display="none">')).toHaveLength(4);
  expect(html).toMatch(/id="dh-lap-ip"[^>]*style="opacity:1"/);
  expect(html).toMatch(/id="dh-lap-noip" style="opacity:0"/);
  expect(html).toContain(`aria-label="${FRAMES}"`);
  // And DHCP's page is untouched.
  const dhcp = await (await request.get('/networking/dhcp')).text();
  expect(dhcp).toContain('data-setup="frames" display="none"');
  expect(dhcp).not.toContain('<g data-setup="addresses" display="none">');
  // After the island has loaded the same four things read the same.
  await page.setViewportSize(DESKTOP);
  await open(page, PATH);
  expect(await setup(page)).toEqual({ frames: [null, null], addresses: ['none', 'none', 'none'], ip: ['1', '0'], label: FRAMES });
});

test.describe('with JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  test('H10: the figure shows the TV and its callouts, and says so in words', async ({ page }) => {
    await page.goto(PATH);
    expect(await setup(page)).toEqual({ frames: [null, null], addresses: ['none', 'none', 'none'], ip: ['1', '0'], label: FRAMES });
    await expect(page.locator(`${FIGURE} text`, { hasText: 'Lease table' })).toBeHidden();
    await expect(page.locator(`${FIGURE} text`, { hasText: 'TV' }).first()).toBeVisible();
  });
});

for (const scheme of ['dark', 'light'] as const) {
  test(`at 375 in the ${scheme} theme the four callouts do not overlap, at the start and at the end`, async ({ page }) => {
    test.setTimeout(RUN_TIMEOUT + 30_000);
    await page.setViewportSize(PHONE);
    await page.emulateMedia({ colorScheme: scheme });
    await open(page, PATH);
    const boxes = () =>
      page.locator(FIGURE).evaluate((root) =>
        [...root.querySelectorAll('[data-setup="frames"] .dh-call')].map((el) => {
          const rs = [...el.querySelectorAll('text, rect')].map((t) => t.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0);
          return [Math.min(...rs.map((r) => r.left)), Math.min(...rs.map((r) => r.top)), Math.max(...rs.map((r) => r.right)), Math.max(...rs.map((r) => r.bottom))] as const;
        }),
      );
    const clear = (b: (readonly number[])[]) => {
      expect(b).toHaveLength(4);
      b.forEach((a, i) => b.forEach((c, j) => i < j && expect(a[0]! < c[2]! && c[0]! < a[2]! && a[1]! < c[3]! && c[1]! < a[3]!, `callouts ${i} and ${j}`).toBe(false)));
    };
    clear(await boxes());
    await playToEnd(page);
    clear(await boxes());
  });
}

test('the Networking track page shows MAC Address’s spot at stop 4 with its description (case 28)', async ({ page }) => {
  await checkCard(
    page,
    'mac-address',
    4,
    'A network card on short legs: a chip, contacts along its edge, a bracket with a socket and a light. Its address is on two labels side by side: the first half, 00:00:5E, is lit; the second, 00:53:10, is not.',
  );
});
