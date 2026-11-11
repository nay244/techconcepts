import { expect, test, type Page } from '@playwright/test';
import { collectErrors, hydrated, pageOverflow, settledFrame } from './support';

/**
 * The lesson between 761px and 1099px wide (prototypes/d3-lesson-tablet.md, acceptance checks 1 to 22): an upright
 * window or one under 900px wide gets the phone layout, grown; a window on its side from 900px gets the desktop
 * layout with the outline folded into a tab; under 600px tall, or without JavaScript, the page stays stacked.
 *
 * The spec sets each window size and theme itself, so it runs in one project (`tablet`; playwright.config.ts has
 * the others ignore it). Sizes are within 1px.
 */

const DHCP = '/networking/dhcp';
const THEMES = ['light', 'dark'] as const;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Opens a lesson at a window size, in a theme, and waits until it has settled. */
async function openAt(page: Page, path: string, size: [number, number], theme: (typeof THEMES)[number]): Promise<void> {
  await page.setViewportSize({ width: size[0], height: size[1] });
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.goto(path);
  await hydrated(page);
  await settledFrame(page);
}

/** An element's box, or null when it is not shown. */
const boxOf = (page: Page, selector: string): Promise<Box | null> =>
  page.locator(selector).first().evaluate((el) => {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return null;
    const b = el.getBoundingClientRect();
    if (b.width === 0 && b.height === 0) return null;
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });

const shown = async (page: Page, selector: string) => (await boxOf(page, selector)) !== null;

/** Whether an element's box is wholly inside the window. */
async function inView(page: Page, selector: string): Promise<boolean> {
  const b = await boxOf(page, selector);
  const { width, height } = page.viewportSize()!;
  return b !== null && b.x >= -1 && b.y >= -1 && b.x + b.w <= width + 1 && b.y + b.h <= height + 1;
}

function expectBox(actual: Box | null, expected: [number, number, number, number], label: string): void {
  expect(actual, `${label} is shown`).not.toBeNull();
  const got = [actual!.x, actual!.y, actual!.w, actual!.h].map(Math.round);
  for (const [i, want] of expected.entries()) expect(Math.abs(got[i]! - want), `${label} is at ${expected.join(', ')}, not ${got.join(', ')}`).toBeLessThanOrEqual(1);
}

const tabs = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button');
const tabButton = (page: Page, name: string) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name, exact: true });
const visibleTabs = (page: Page) => tabs(page).evaluateAll((all) => all.filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.textContent));
// The drawing's box is the figure's (the svg inside it keeps its own proportions): the spec's "svg's box".
const svgBox = (page: Page) => boxOf(page, '.console__scene .stage__figure');
const noPageScroll = async (page: Page) => expect((await pageOverflow(page)).down, 'the page does not scroll').toBeLessThanOrEqual(1);

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    // ---------------------------------------------------------------- Layout 1: the phone layout, grown

    test('1, 2, 3 at 768x1024: one screen, the scene 410px tall under the bar, three tabs, the explanation on show', async ({ page }) => {
      const errors = collectErrors(page);
      await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
      await noPageScroll(page);
      expect(await inView(page, '.console__scene')).toBe(true);
      expect(await inView(page, '.console__controls')).toBe(true);
      expectBox(await boxOf(page, '.console__stage'), [0, 52, 768, 410], 'the stage');
      const svg = await svgBox(page);
      expect(Math.round(svg!.w)).toBe(768);
      expect(Math.abs(svg!.h - 369)).toBeLessThanOrEqual(1);
      // DHCP has a table of its own: a fourth tab (D2).
      expect(await visibleTabs(page)).toEqual(['Explain', 'Steps', 'Log', 'Table']);
      expect(await shown(page, '.console__outline')).toBe(false);
      expect(await shown(page, '.console__log')).toBe(false);
      expect(await shown(page, '.console__explain')).toBe(true);
      expect(errors).toEqual([]);
    });

    test('4 and 5 at 768x1024: the words are a 520px column that holds 80 characters a line or fewer; the controls share it', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
      expect(Math.round((await boxOf(page, '.explain__narr'))!.w), 'the words are 520px wide').toBe(520);
      expect(Math.round((await boxOf(page, '.explain__narr'))!.x), 'and start at 124px').toBe(124);
      // The longest rendered line, counted character by character as reading.spec.ts does.
      const longest = await page.locator('.explain__narr').first().evaluate((root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        const lines: number[] = [];
        let top = Number.NaN;
        for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
          const text = node.textContent ?? '';
          for (let i = 0; i < text.length; i++) {
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getBoundingClientRect();
            if (rect.width === 0) continue;
            if (Number.isNaN(top) || Math.abs(rect.top - top) > 8) {
              lines.push(0);
              top = rect.top;
            }
            lines[lines.length - 1]!++;
          }
        }
        return Math.max(...lines);
      });
      expect(longest, 'the longest line of the words').toBeLessThanOrEqual(80);
      const buttons = await page.locator('.console__controls button').evaluateAll((all) =>
        all.map((b) => {
          const r = b.getBoundingClientRect();
          return { left: Math.round(r.left), right: Math.round(r.right), height: Math.round(r.height) };
        }),
      );
      expect(Math.min(...buttons.map((b) => b.left))).toBe(124);
      expect(Math.max(...buttons.map((b) => b.right))).toBe(644);
      for (const b of buttons) expect(b.height).toBe(48);
    });

    test('6 at 768x1024: the top bar shows the segments and the stamp, and not the brand word, the OSI chips or the crumbs', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
      expect(await shown(page, '.topbar__segments')).toBe(true);
      expect(await shown(page, '.topbar__crumb .stamp')).toBe(true);
      expect(await shown(page, '.topbar__brand b')).toBe(false);
      expect(await shown(page, '.topbar__osi')).toBe(false);
      expect(await shown(page, '.topbar__crumb > a[href="/tracks"]')).toBe(false);
      expect(await shown(page, '.topbar__crumb > a:not([href="/tracks"]):not(.stamp)')).toBe(false);
    });

    test('7 at 768x1024: Steps shows the outline, a step chosen shows its words, Log shows the log', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
      await tabButton(page, 'Steps').click();
      expect(await shown(page, '.console__outline')).toBe(true);
      expect(await shown(page, '.console__explain')).toBe(false);
      await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^DHCP Request/ }).click();
      await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
      expect(await shown(page, '.console__explain')).toBe(true);
      await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Watch · Step 3 of 5');
      await tabButton(page, 'Log').click();
      await expect.poll(() => shown(page, '.console__log')).toBe(true);
      expect(await shown(page, '.console__explain')).toBe(false);
    });

    test('8 at 768x1024 in Learn: no page scroll, the scene is 184px tall, the scene and the controls are in view', async ({ page }) => {
      await openAt(page, `${DHCP}?step=6`, [768, 1024], theme);
      await noPageScroll(page);
      expect(Math.abs((await boxOf(page, '.console__stage'))!.h - 184)).toBeLessThanOrEqual(1);
      expect(await inView(page, '.console__scene')).toBe(true);
      expect(await inView(page, '.console__controls')).toBe(true);
    });

    for (const [size, drawing] of [
      [[761, 1024], undefined],
      [[899, 1200], undefined],
      [[1024, 1366], [1024, 505]],
    ] as const) {
      test(`9 at ${size.join('x')}: one screen, three tabs shown, the outline and the log not`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=2`, [size[0], size[1]], theme);
        await noPageScroll(page);
        expect(await inView(page, '.console__scene')).toBe(true);
        expect(await inView(page, '.console__controls')).toBe(true);
        expect((await visibleTabs(page)).slice(0, 3)).toEqual(['Explain', 'Steps', 'Log']);
        expect(await shown(page, '.console__outline')).toBe(false);
        expect(await shown(page, '.console__log')).toBe(false);
        expect(await shown(page, '.console__explain')).toBe(true);
        if (drawing !== undefined) {
          const svg = await svgBox(page);
          expect(Math.abs(svg!.w - drawing[0]!)).toBeLessThanOrEqual(1);
          expect(Math.abs(svg!.h - drawing[1]!)).toBeLessThanOrEqual(1);
        }
      });
    }

    // ---------------------------------------------------------------- Layout 2: the desktop layout, the outline in a tab

    test('10, 11, 12 at 1024x768: one screen; the panels where the design puts them; two tabs', async ({ page }) => {
      const errors = collectErrors(page);
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      await noPageScroll(page);
      expect(await inView(page, '.console__scene')).toBe(true);
      expect(await inView(page, '.console__controls')).toBe(true);
      expectBox(await boxOf(page, '.console__stage'), [12, 92, 640, 452], 'the stage');
      expectBox(await boxOf(page, '.console__explain'), [664, 140, 348, 404], 'the explanation');
      expectBox(await boxOf(page, '.console__log'), [12, 556, 1000, 200], 'the log');
      const svg = await svgBox(page);
      expect(Math.abs(svg!.w - 638)).toBeLessThanOrEqual(1);
      expect(Math.abs(svg!.h - 300)).toBeLessThanOrEqual(1);
      expectBox(await boxOf(page, '.console__tabs'), [664, 92, 348, 48], 'the tabs');
      expect(await visibleTabs(page)).toEqual(['Explain', 'Steps']);
      await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
      expect(await shown(page, '.console__outline')).toBe(false);
      expect(errors).toEqual([]);
    });

    test('13 at 1024x768: Steps shows the outline in the explanation\'s place; a step chosen returns to the words', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      await tabButton(page, 'Steps').click();
      expectBox(await boxOf(page, '.console__outline'), [664, 140, 348, 404], 'the outline');
      expect(await shown(page, '.console__explain')).toBe(false);
      for (const part of ['.console__log', '.console__scene', '.console__controls']) expect(await inView(page, part)).toBe(true);
      await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^Lease Renewal/ }).click();
      await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
      expect(await shown(page, '.console__explain')).toBe(true);
      await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Watch · Step 5 of 5');
    });

    test('14 at 1024x768: Back, Play, Next and the speed button are 44px tall and at least 44px wide', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      const sizes = await page.locator('.console__controls .cbtn').evaluateAll((all) => all.map((b) => b.getBoundingClientRect()).map((r) => ({ w: r.width, h: r.height })));
      expect(sizes.length).toBeGreaterThanOrEqual(4);
      for (const s of sizes) {
        expect(Math.round(s.h)).toBe(44);
        expect(s.w).toBeGreaterThanOrEqual(43.5);
      }
    });

    for (const width of [1024, 900]) {
      test(`15 at ${width}x768: the lesson's name is whole, and the brand word, "Tracks" and the number give way`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=2`, [width, 768], theme);
        const h1 = await page.locator('.topbar__crumb h1').evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
        expect(h1.scroll).toBeLessThanOrEqual(h1.client);
        expect(await shown(page, '.topbar__brand b')).toBe(false);
        expect(await shown(page, '.topbar__crumb > a[href="/tracks"]')).toBe(false);
        expect(await shown(page, '.topbar__crumb > em')).toBe(false);
        expect(await shown(page, '.topbar__crumb > a[href*="networking"]')).toBe(true);
        expect(await shown(page, '.topbar__crumb .stamp')).toBe(true);
        expect(await shown(page, '.topbar__segments')).toBe(true);
        expect(await shown(page, '.topbar__osi')).toBe(true);
      });
    }

    for (const step of [6, 7]) {
      test(`16 at 1024x768, ?step=${step}: one screen, two tabs`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=${step}`, [1024, 768], theme);
        await noPageScroll(page);
        expect(await inView(page, '.console__scene')).toBe(true);
        expect(await inView(page, '.console__controls')).toBe(true);
        expect(await visibleTabs(page)).toEqual(['Explain', 'Steps']);
        expectBox(await boxOf(page, '.console__tabs'), [664, 92, 348, 48], 'the tabs');
        await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
        expect(await shown(page, '.console__outline')).toBe(false);
      });
    }

    for (const size of [
      [900, 700],
      [1099, 800],
    ] as const) {
      test(`17 at ${size.join('x')}: one screen, two tabs`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=2`, [size[0], size[1]], theme);
        await noPageScroll(page);
        expect(await inView(page, '.console__scene')).toBe(true);
        expect(await inView(page, '.console__controls')).toBe(true);
        expect(await visibleTabs(page)).toEqual(['Explain', 'Steps']);
        // The words column is 348px wide, against the window's right edge less 12px.
        expectBox(await boxOf(page, '.console__tabs'), [size[0] - 12 - 348, 92, 348, 48], 'the tabs');
        await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
        expect(await shown(page, '.console__outline')).toBe(false);
      });
    }

    test('18: Log (or Table) chosen upright, then turned on its side: the explanation is shown and Explain is pressed', async ({ page }) => {
      for (const chosen of ['Log', 'Table']) {
        await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
        await tabButton(page, chosen).click();
        await expect(tabButton(page, chosen)).toHaveAttribute('aria-pressed', 'true');
        await page.setViewportSize({ width: 1024, height: 768 });
        await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
        expect(await shown(page, '.console__explain')).toBe(true);
        // And the table is on screen, under the scene, as on a desktop.
        expect(await inView(page, '.tpanel')).toBe(true);
      }
    });

    test('focus at 1024x768: the ring of Explain and of Steps is drawn, and inside the tab row', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      for (const name of ['Explain', 'Steps']) {
        await tabButton(page, name).focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await expect(tabButton(page, name)).toBeFocused();
        await expect.poll(() => tabButton(page, name).evaluate((el) => getComputedStyle(el).outlineOffset)).toBe('-3px');
        const r = await tabButton(page, name).evaluate((el) => {
          const s = getComputedStyle(el);
          const b = el.getBoundingClientRect();
          const row = el.parentElement!.getBoundingClientRect();
          const offset = parseFloat(s.outlineOffset);
          const width = parseFloat(s.outlineWidth);
          return {
            focused: document.activeElement === el,
            style: s.outlineStyle,
            width,
            // The ring's outer edge, from the button's box and the computed offset.
            left: b.left - offset - width,
            right: b.right + offset + width,
            top: b.top - offset - width,
            bottom: b.bottom + offset + width,
            row: { left: row.left, right: row.right, top: row.top, bottom: row.bottom },
          };
        });
        expect(r.focused, `${name} has focus`).toBe(true);
        expect(r.style, `${name}'s outline`).not.toBe('none');
        expect(r.width).toBeGreaterThan(0);
        expect(r.left, `${name}: ring inside the row, left`).toBeGreaterThanOrEqual(r.row.left - 1);
        expect(r.right, `${name}: ring inside the row, right`).toBeLessThanOrEqual(r.row.right + 1);
        expect(r.top, `${name}: ring inside the row, top`).toBeGreaterThanOrEqual(r.row.top - 1);
        expect(r.bottom, `${name}: ring inside the row, bottom`).toBeLessThanOrEqual(r.row.bottom + 1);
      }
    });

    test('Overview at 768x1024: the stamp is on the kicker\'s line and in the top bar, with the same words', async ({ page }) => {
      await openAt(page, DHCP, [768, 1024], theme);
      const lead = await boxOf(page, '.explain__lead .stamp');
      const kicker = await boxOf(page, '.explain__lead .explain__kicker');
      expect(lead, 'the stamp in the Overview is shown').not.toBeNull();
      expect(kicker).not.toBeNull();
      const mid = lead!.y + lead!.h / 2;
      expect(mid).toBeGreaterThanOrEqual(kicker!.y - 1);
      expect(mid).toBeLessThanOrEqual(kicker!.y + kicker!.h + 1);
      expect(await shown(page, '.topbar__crumb .stamp')).toBe(true);
      const words = async (sel: string) => ((await page.locator(sel).first().textContent()) ?? '').replace(/\s+/g, ' ').trim();
      expect(await words('.explain__lead .stamp')).toBe(await words('.topbar__crumb .stamp'));
      expect(await words('.topbar__crumb .stamp')).not.toBe('');
    });

    test('Overview at 1024x768: the stamp is in the top bar and not on the first line', async ({ page }) => {
      await openAt(page, DHCP, [1024, 768], theme);
      expect(await shown(page, '.topbar__crumb .stamp')).toBe(true);
      expect(await boxOf(page, '.explain__lead .stamp')).toBeNull();
    });

    // ---------------------------------------------------------------- the edges

    test('19: 760x1024 is the phone layout as it was, and 1100x800 the desktop layout', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [760, 1024], theme);
      await noPageScroll(page);
      // 34% of the window, not the grown 40%; the stamp and the segments stay out of the bar.
      expect(Math.abs((await boxOf(page, '.console__stage'))!.h - Math.round(1024 * 0.34))).toBeLessThanOrEqual(1);
      expect(await shown(page, '.topbar__segments')).toBe(false);
      expect(await shown(page, '.topbar__crumb .stamp')).toBe(false);
      expect(await visibleTabs(page)).toHaveLength(4);
      await openAt(page, `${DHCP}?step=2`, [1100, 800], theme);
      expect(await shown(page, '.console__tabs')).toBe(false);
      expect(await shown(page, '.console__outline')).toBe(true);
      expect(await shown(page, '.console__log')).toBe(true);
      expect(await shown(page, '.topbar__brand b')).toBe(true);
    });

    for (const size of [
      [844, 390],
      [1000, 599],
    ] as const) {
      test(`20 at ${size.join('x')}: the stacked page`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=2`, [size[0], size[1]], theme);
        expect(await shown(page, '.console__tabs')).toBe(false);
        expect((await pageOverflow(page)).down).toBeGreaterThan(1);
      });
    }

    test('20 at 1024x599: the stacked page, the table under the scene, no stamp on the Overview\'s first line', async ({ page }) => {
      await openAt(page, DHCP, [1024, 599], theme);
      expect(await shown(page, '.console__tabs')).toBe(false);
      const scene = (await boxOf(page, '.console__scene'))!;
      const table = (await boxOf(page, '.console__stage .tpanel'))!;
      expect(table, 'the lesson\'s table is shown').not.toBeNull();
      expect(table.y).toBeGreaterThanOrEqual(scene.y + scene.h - 1);
      expect(await boxOf(page, '.explain__lead .stamp')).toBeNull();
    });

    for (const size of [
      [768, 1024],
      [1024, 768],
    ] as const) {
      test(`22 at ${size.join('x')}: OSI Model, Subnetting and Firewalls fit one screen`, async ({ page }) => {
        for (const path of ['/networking/osi-model?step=3', '/networking/subnetting?step=2', '/networking/firewalls?step=2']) {
          await openAt(page, path, [size[0], size[1]], theme);
          await noPageScroll(page);
          expect(await inView(page, '.console__scene'), `${path}: the scene`).toBe(true);
          expect(await inView(page, '.console__controls'), `${path}: the controls`).toBe(true);
        }
      });
    }
  });
}

for (const theme of THEMES) test.describe(`with JavaScript off, ${theme} theme`, () => {
  test.use({ javaScriptEnabled: false });
  for (const size of [
    [768, 1024],
    [1024, 768],
  ] as const) {
    test(`21 at ${size.join('x')}: the stacked page`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width: size[0], height: size[1] });
      await page.goto(`${DHCP}?step=2`);
      await page.waitForLoadState('load');
      // Nothing runs on the page, so the measures are read without waiting for a frame.
      expect(await shown(page, '.console__tabs')).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeGreaterThan(size[1] + 1);
    });
  }
});
