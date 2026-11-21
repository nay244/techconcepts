import { expect, test, type Page } from '@playwright/test';
import { collectErrors, hydrated, pageOverflow, settledFrame } from './support';

/**
 * The lesson between 761px and 1099px wide (prototypes/d3-lesson-tablet.md, acceptance checks 1 to 22, as D19 changes them,
 * prototypes/d19-lesson-layout.md and d19-cases.md): an upright window or one under 900px wide gets the phone layout,
 * grown (the header, the bar, the scene, the stops row, three tabs, the words, the controls); a window on its side from
 * 900px gets the desktop layout with no track column, no tabs, the bar over the scene and the controls one row at the foot
 * of the words; under 600px tall, or without JavaScript, the page stays stacked.
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
const boxOf = async (page: Page, selector: string): Promise<Box | null> =>
  (await page.locator(selector).count()) === 0 ? null : page.locator(selector).first().evaluate((el) => {
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
      expectBox(await boxOf(page, '.console__stage'), [0, 113, 768, 410], 'the stage');
      const svg = await svgBox(page);
      expect(Math.round(svg!.w)).toBe(768);
      expect(Math.abs(svg!.h - 369)).toBeLessThanOrEqual(1);
      // DHCP has a table of its own: a third tab (D2); the Steps tab's job is the stops row's (D19).
      expect(await visibleTabs(page)).toEqual(['Explain', 'Log', 'Table']);
      expect(await shown(page, '.console__track')).toBe(false);
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

    test('6 at 768x1024: the bar holds the h1, the place and the lessons button; the header’s brand word shows; no stamp, no OSI badge', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(await shown(page, '.console__top h1')).toBe(true);
      expect(await shown(page, '.console__top .top__where')).toBe(true);
      expect(await shown(page, '.console__top .top__lessons')).toBe(true);
      expect(await shown(page, '.site-head .brand b')).toBe(true);
      expect(await shown(page, '.console__top .tl')).toBe(false);
      expect(await shown(page, '.timeline--row .tl')).toBe(true);
      expect(await page.locator('.stamp').count()).toBe(0);
      expect(await shown(page, '.explain__osi')).toBe(false);
      await openAt(page, '/networking/firewalls?step=2', [768, 1024], theme);
      expect(await shown(page, '.explain__osi')).toBe(false);
    });

    test('7 at 768x1024: a stop shows its place’s words, Log shows the log', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
      await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^Step 3, DHCP Request/ }).click();
      await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
      expect(await shown(page, '.console__explain')).toBe(true);
      await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Watch · Step 3 of 5');
      await tabButton(page, 'Log').click();
      await expect.poll(() => shown(page, '.console__log')).toBe(true);
      expect(await shown(page, '.console__explain')).toBe(false);
      // A stop keeps the tab that is open (E25), as Next and Back do.
      await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^Step 4, DHCP Acknowledge/ }).click();
      await expect(tabButton(page, 'Log')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.top__where')).toHaveText('Step 4 of 5');
    });

    test('8 at 768x1024 in Learn: no page scroll, the scene is 184px tall, the scene and the controls are in view', async ({ page }) => {
      await openAt(page, `${DHCP}?step=6`, [768, 1024], theme);
      await noPageScroll(page);
      expectBox(await boxOf(page, '.console__stage'), [0, 113, 768, 184], 'the stage in Learn');
      expect(await inView(page, '.console__scene')).toBe(true);
      expect(await inView(page, '.console__controls')).toBe(true);
    });

    for (const [size, drawing] of [
      [[761, 1024], undefined],
      [[899, 1200], undefined],
      [[1024, 1366], [1024, 505]],
    ] as const) {
      test(`9 at ${size.join('x')}: one screen, three tabs shown, the track and the log not`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=2`, [size[0], size[1]], theme);
        await noPageScroll(page);
        expect(await inView(page, '.console__scene')).toBe(true);
        expect(await inView(page, '.console__controls')).toBe(true);
        expect(await visibleTabs(page)).toEqual(['Explain', 'Log', 'Table']);
        expect(await shown(page, '.console__track')).toBe(false);
        expect(await shown(page, '.console__log')).toBe(false);
        expect(await shown(page, '.console__explain')).toBe(true);
        if (drawing !== undefined) {
          const svg = await svgBox(page);
          expect(Math.abs(svg!.w - drawing[0]!)).toBeLessThanOrEqual(1);
          expect(Math.abs(svg!.h - drawing[1]!)).toBeLessThanOrEqual(1);
        }
      });
    }

    // ---------------------------------------------------------------- Layout 2: the desktop layout, no track column and no tabs

    test('10, 11, 12 at 1024x768: one screen; the panels where D19 puts them; no tabs; the bar over the scene', async ({ page }) => {
      const errors = collectErrors(page);
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      await noPageScroll(page);
      expect(await inView(page, '.console__scene')).toBe(true);
      expect(await inView(page, '.console__controls')).toBe(true);
      expectBox(await boxOf(page, '.console__top'), [12, 81, 640, 44], 'the bar');
      expectBox(await boxOf(page, '.console__stage'), [12, 137, 640, 452], 'the stage');
      expectBox(await boxOf(page, '.console__guide'), [664, 81, 348, 508], 'the guide');
      expectBox(await boxOf(page, '.console__explain'), [665, 82, 346, 437], 'the words');
      expectBox(await boxOf(page, '.console__log'), [12, 601, 1000, 155], 'the log');
      // The drawing's box is 638 wide and, once the step has put its row in the table under the scene, 300px tall as the prototype
      // measures it (the spec's 304 is the box before the table has its row); it never gets smaller than today's 638 x 300.
      await expect.poll(async () => Math.round((await svgBox(page))!.h)).toBe(300);
      expect(Math.round((await svgBox(page))!.w)).toBe(638);
      expect(await shown(page, '.console__tabs')).toBe(false);
      expect(await visibleTabs(page)).toEqual([]);
      expect(await shown(page, '.console__track')).toBe(false);
      await expect(page.locator('.log__head button:visible')).toHaveCount(0);
      expect(errors).toEqual([]);
    });

    test('13 at 1024x768: a stop in the bar goes to its place and the words stay', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      for (const part of ['.console__log', '.console__scene', '.console__controls']) expect(await inView(page, part)).toBe(true);
      await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^Step 5, Lease Renewal/ }).click();
      expect(await shown(page, '.console__explain')).toBe(true);
      await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Watch · Step 5 of 5');
    });

    test('14 at 1024x768: the five controls are one row at the foot of the words, 44px tall, Play all icon-only, the forward button the rest', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      const sizes = await page.locator('.console__controls .cbtn').evaluateAll((all) => all.map((b) => b.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height })));
      expect(sizes).toHaveLength(5);
      for (const s of sizes) {
        expect(Math.round(s.h)).toBe(44);
        expect(s.w).toBeGreaterThanOrEqual(43.5);
        expect(s.y).toBe(sizes[0]!.y);
      }
      expect(Math.round(sizes[2]!.w), 'Play all is icon-only').toBe(44);
      expect(Math.round(sizes[4]!.w), 'the forward button has what the four leave').toBe(114);
      expect(Math.round(sizes[4]!.x)).toBe(881);
      // The row is at the foot of the words, under them.
      const words = (await boxOf(page, '.console__explain'))!;
      expect(sizes[0]!.y).toBeGreaterThanOrEqual(words.y + words.h - 1);
    });

    for (const width of [1024, 900]) {
      test(`15 at ${width}x768: the lesson's name is whole in the bar, the brand word shows in the header, and the bar has no number, no track link and no stamp; the marks show`, async ({ page }) => {
        for (const path of [DHCP, '/networking/load-balancers', '/networking/mac-address', '/networking/osi-model']) {
          await openAt(page, `${path}?step=2`, [width, 768], theme);
          const h1 = await page.getByRole('heading', { level: 1 }).evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
          expect(h1.scroll, path).toBeLessThanOrEqual(h1.client);
        }
        await openAt(page, `${DHCP}?step=2`, [width, 768], theme);
        expect(await shown(page, '.site-head .brand b')).toBe(true);
        expect(await shown(page, '.console__top a[href="/tracks"]')).toBe(false);
        expect(await shown(page, '.console__top .top__of')).toBe(false);
        expect(await page.locator('.stamp').count()).toBe(0);
        expect(await shown(page, '.console__top .tl')).toBe(true);
        // DHCP spans layers, so it has no badge; Firewalls (layers 3 and 4) has one at the head of the words while watching.
        expect(await shown(page, '.explain__osi')).toBe(false);
        await openAt(page, '/networking/firewalls?step=2', [width, 768], theme);
        expect(await shown(page, '.explain__osi')).toBe(true);
        const badge = (await boxOf(page, '.explain__osi'))!;
        const words = (await boxOf(page, '.console__explain'))!;
        expect(badge.y, 'the badge is the first thing in the words').toBeLessThan(words.y + 40);
      });
    }

    for (const step of [6, 7]) {
      // Learn and Practice have D1's words column here: 504px, the tabs on it at the same right edge.
      test(`16 at 1024x768, ?step=${step}: one screen, no tabs, the words 504px wide, the bar across the page`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=${step}`, [1024, 768], theme);
        await noPageScroll(page);
        expect(await inView(page, '.console__scene')).toBe(true);
        expect(await inView(page, '.console__controls')).toBe(true);
        expect(await visibleTabs(page)).toEqual([]);
        expect(await shown(page, '.console__tabs')).toBe(false);
        expectBox(await boxOf(page, '.console__top'), [12, 81, 1000, 44], 'the bar across the page');
        expect(Math.round((await boxOf(page, '.console__guide'))!.w)).toBe(504);
        expect(Math.round((await boxOf(page, '.console__explain'))!.y)).toBe(138);
      });
    }

    for (const size of [
      [900, 700],
      [1099, 800],
    ] as const) {
      test(`17 at ${size.join('x')}: one screen, no tabs`, async ({ page }) => {
        await openAt(page, `${DHCP}?step=2`, [size[0], size[1]], theme);
        await noPageScroll(page);
        expect(await inView(page, '.console__scene')).toBe(true);
        expect(await inView(page, '.console__controls')).toBe(true);
        expect(await shown(page, '.console__tabs')).toBe(false);
        // The guide is 348px wide, against the window's right edge less 12px, from the header down.
        const guide = (await boxOf(page, '.console__guide'))!;
        expectBox(guide, [size[0] - 12 - 348, 81, 348, guide.h], 'the guide');
      });
    }

    test('18: Log (or Table) chosen upright, then turned on its side: the words are shown (no tabs there); turned back, Explain is pressed', async ({ page }) => {
      for (const chosen of ['Log', 'Table']) {
        await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
        await tabButton(page, chosen).click();
        await expect(tabButton(page, chosen)).toHaveAttribute('aria-pressed', 'true');
        await page.setViewportSize({ width: 1024, height: 768 });
        expect(await shown(page, '.console__tabs')).toBe(false);
        expect(await shown(page, '.console__explain')).toBe(true);
        // And the table is on screen, under the scene, as on a desktop.
        expect(await inView(page, '.tpanel')).toBe(true);
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(tabButton(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
      }
    });

    // Under reduced motion the turn paints the page as it is now, in the frame it turns (job 28, B34): global.css's 0.01ms transitions
    // painted every property at its old value for one frame, so the table sat at 34% (Table) or 12% (Log) in view, below the scene.
    // An IntersectionObserver's entries are computed just before paint, so it sees each frame the reader would. Its thresholds
    // include 1 and values under both wrong ratios; the entries from the turn on are the ones at the new window's width.
    test('18, the frame: the table is wholly in view in every frame from the turn, with Log and with Table chosen', async ({ page }) => {
      for (const chosen of ['Log', 'Table']) {
        await openAt(page, `${DHCP}?step=2`, [768, 1024], theme);
        await tabButton(page, chosen).click();
        await expect(tabButton(page, chosen)).toHaveAttribute('aria-pressed', 'true');
        await settledFrame(page);
        await page.evaluate(() => {
          const w = window as unknown as { __io: { rw: number | undefined; r: number; y: number }[]; __tp: Element | null };
          w.__io = [];
          w.__tp = document.querySelector('.tpanel');
          new IntersectionObserver(
            (entries) => {
              for (const e of entries) w.__io.push({ rw: e.rootBounds?.width, r: Math.round(e.intersectionRatio * 1000) / 1000, y: Math.round(e.boundingClientRect.y) });
            },
            { threshold: [0, 0.05, 0.25, 0.5, 0.75, 0.99, 1] },
          ).observe(w.__tp!);
        });
        // It is watching: the observer has delivered its first entry, for the upright window.
        await expect.poll(() => page.evaluate(() => (window as unknown as { __io: unknown[] }).__io.length), { message: `${chosen}: the first entry` }).toBeGreaterThan(0);
        const before = await page.evaluate(() => (window as unknown as { __io: unknown[] }).__io.length);
        await page.setViewportSize({ width: 1024, height: 768 });
        for (let i = 0; i < 4; i++) await settledFrame(page);
        const seen = await page.evaluate(() => {
          const w = window as unknown as { __io: { rw: number | undefined; r: number; y: number }[]; __tp: Element | null };
          return { entries: w.__io.slice(), same: w.__tp !== null && w.__tp.isConnected && w.__tp === document.querySelector('.tpanel') };
        });
        expect(seen.same, `${chosen}: the table it watched is the page's table`).toBe(true);
        const after = seen.entries.slice(before);
        expect(after.filter((e) => e.r < 1), `${chosen}: a frame after the turn drew the table partly out of view: ${JSON.stringify(after)}`).toEqual([]);
        // With Log chosen the table was hidden upright, so showing it is a crossing: one entry, whole, at the new width.
        if (chosen === 'Log') expect(after.map((e) => [e.rw, e.r]), 'Log: one entry, whole').toEqual([[1024, 1]]);
      }
    });

    test('focus at 1024x768: the ring of a stop is drawn, and no box with overflow cuts the 4px it is drawn out to', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [1024, 768], theme);
      for (const name of [/^Step 2, /, /^Step 4, /]) {
        const stop = page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name });
        await stop.focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        await expect(stop).toBeFocused();
        const r = await stop.evaluate((el) => {
          const s = getComputedStyle(el);
          const b = el.getBoundingClientRect();
          const ring = { l: b.left - 4, t: b.top - 4, r: b.right + 4, b: b.bottom + 4 };
          const cut: string[] = [];
          for (let a = el.parentElement; a; a = a.parentElement) {
            const o = getComputedStyle(a);
            if (o.overflowX === 'visible' && o.overflowY === 'visible') continue;
            const c = a.getBoundingClientRect();
            if (ring.l < c.left - 0.5 || ring.r > c.right + 0.5 || ring.t < c.top - 0.5 || ring.b > c.bottom + 0.5) cut.push(`${a.tagName}.${a.className}`);
          }
          return { style: s.outlineStyle, width: parseFloat(s.outlineWidth), cut };
        });
        expect(r.style, `${name}'s outline`).not.toBe('none');
        expect(r.width).toBeGreaterThanOrEqual(2);
        expect(r.cut, `${name}: the ring is whole`).toEqual([]);
      }
    });

    test('Overview at 768x1024 and at 1024x768: the lesson page has no stamp anywhere (D19, 2.97)', async ({ page }) => {
      for (const size of [[768, 1024], [1024, 768]] as const) {
        await openAt(page, DHCP, [size[0], size[1]], theme);
        expect(await page.locator('.stamp').count(), `at ${size.join('x')}`).toBe(0);
        await expect(page.locator('body')).not.toContainText(/Checked \d|Not checked yet/);
      }
    });

    // ---------------------------------------------------------------- the edges

    test('19: 760x1024 is the phone layout as it was, and 1100x800 the desktop layout', async ({ page }) => {
      await openAt(page, `${DHCP}?step=2`, [760, 1024], theme);
      await noPageScroll(page);
      // 34% of the window, not the grown 40%, from y 105 (the 36px bar); the stops row is shown, three tabs, no stamp.
      expectBox(await boxOf(page, '.console__stage'), [0, 105, 760, Math.round(1024 * 0.34)], 'the stage');
      expect(await shown(page, '.timeline--row .tl')).toBe(true);
      expect(await page.locator('.stamp').count()).toBe(0);
      expect(await visibleTabs(page)).toHaveLength(3);
      await openAt(page, `${DHCP}?step=2`, [1100, 800], theme);
      expect(await shown(page, '.console__tabs')).toBe(false);
      expect(await shown(page, '.console__track')).toBe(true);
      expect(await shown(page, '.console__log')).toBe(true);
      expect(await shown(page, '.site-head .brand b')).toBe(true);
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

    test('20 at 1024x599: the stacked page, the table under the scene, no stamp', async ({ page }) => {
      await openAt(page, DHCP, [1024, 599], theme);
      expect(await shown(page, '.console__tabs')).toBe(false);
      const scene = (await boxOf(page, '.console__scene'))!;
      const table = (await boxOf(page, '.console__stage .tpanel'))!;
      expect(table, 'the lesson\'s table is shown').not.toBeNull();
      expect(table.y).toBeGreaterThanOrEqual(scene.y + scene.h - 1);
      expect(await page.locator('.stamp').count()).toBe(0);
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

/**
 * B39 (job 29): the forward button's fit commits in the frame its size changes. Two probes, each made after hydration and
 * made again right before each resize, so each runs after the page's own ResizeObserver (observers run in the order they were
 * made): an IntersectionObserver rooted on the button sees a cut label or arrow (ratio under 1); a ResizeObserver reads
 * whether the form shown is the one that fits, as the page's check does. An entry for a button that is not rendered
 * (the layout changes at 1100px and hides it: its root has no box) is not a frame a reader sees, and is skipped. Neither reads text in an IntersectionObserver callback.
 */
type FitRec = { k: 'io' | 'ro'; r?: number; fits?: boolean; full?: boolean; t: string; room?: number };
const FIT_LESSONS = [
  '/networking/dhcp?step=2',
  '/networking/firewalls?step=2',
  '/networking/load-balancers?step=1',
  '/how-the-internet-works/what-is-https?step=3',
  '/networking/subnetting?step=1',
  '/networking/proxies?step=3',
];
const frames = (page: Page, n: number) =>
  page.evaluate((count) => new Promise<void>((done) => { let i = 0; const f = () => (++i >= count ? done() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const installFitProbe = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __fit?: { io: IntersectionObserver; ro: ResizeObserver; rec: unknown[] } };
    w.__fit?.io.disconnect();
    w.__fit?.ro.disconnect();
    const button = document.querySelector<HTMLElement>('.cbtn--go')!;
    const label = button.querySelector<HTMLElement>('.go__label')!;
    const arrow = button.querySelector<SVGElement>('svg')!;
    const rec: unknown[] = [];
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.target.isConnected && e.rootBounds !== null && e.rootBounds.width > 0) rec.push({ k: 'io', r: e.intersectionRatio, t: e.target === arrow ? 'arrow' : label.textContent }); },
      { root: button, threshold: [0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99, 1] },
    );
    io.observe(label);
    io.observe(arrow);
    const ro = new ResizeObserver(() => {
      const measure = button.querySelector<HTMLElement>('.go__measure');
      if (!measure) return;
      const s = getComputedStyle(button);
      const room = button.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
      rec.push({ k: 'ro', fits: measure.getBoundingClientRect().width <= room + 0.5, full: label.textContent === measure.textContent, t: label.textContent, room: Math.round(room) });
    });
    ro.observe(button);
    w.__fit = { io, ro, rec };
  });
const takeFit = (page: Page) => page.evaluate(() => (window as unknown as { __fit: { rec: FitRec[] } }).__fit.rec.splice(0));

test.describe('B39: the forward button fits in the frame its size changes', () => {
  test.setTimeout(120_000);
  for (const path of FIT_LESSONS) {
    for (const [from, to] of [
      [[768, 1024], [1024, 768]],
      [[1024, 768], [768, 1024]],
    ] as const) {
      test(`5-7 ${path} ${from.join('x')} -> ${to.join('x')}`, async ({ page }) => {
        await page.setViewportSize({ width: from[0], height: from[1] });
        await page.goto(path);
        await hydrated(page);
        await page.evaluate(() => document.fonts.ready);
        await frames(page, 3);
        await installFitProbe(page);
        await frames(page, 2);
        const init = await takeFit(page);
        const before = await page.locator('.cbtn--go .go__label').textContent();
        await page.setViewportSize({ width: to[0], height: to[1] });
        await frames(page, 4);
        const after = await takeFit(page);
        // Not vacuous: the probe watched (the first entry, ratio 1), the form changed, the late observer fired.
        expect(init.some((r) => r.k === 'io' && r.r === 1), 'io saw the button whole before the turn').toBe(true);
        expect(await page.locator('.cbtn--go .go__label').textContent(), 'the form changed').not.toBe(before);
        const ros = after.filter((r) => r.k === 'ro');
        expect(ros.length, 'the late observer fired after the resize').toBeGreaterThan(0);
        // The verdicts.
        expect(after.filter((r) => r.k === 'io' && r.r! < 0.999).map((r) => `${r.r!.toFixed(2)} ${r.t}`), 'cut label or arrow painted').toEqual([]);
        expect(ros.filter((r) => r.fits !== r.full).map((r) => `fits=${r.fits} shown="${r.t}" room=${r.room}`), 'the wrong form painted').toEqual([]);
      });
    }
  }

  test('9 the sweep 1120 -> 740 -> 1120 by 7px: no cut and no wrong frame', async ({ page }) => {
    await page.setViewportSize({ width: 1120, height: 900 });
    await page.goto(FIT_LESSONS[0]);
    await hydrated(page);
    await page.evaluate(() => document.fonts.ready);
    await frames(page, 3);
    const widths: number[] = [];
    for (let x = 1120; x >= 740; x -= 7) widths.push(x);
    for (let x = 740; x <= 1120; x += 7) widths.push(x);
    const bad: string[] = [];
    for (const x of widths) {
      await frames(page, 2);
      await installFitProbe(page);
      await frames(page, 2);
      await takeFit(page);
      await page.setViewportSize({ width: x, height: 900 });
      await frames(page, 4);
      for (const r of await takeFit(page)) {
        if (r.k === 'io' && r.r! < 0.999) bad.push(`${x} cut ${r.r} ${r.t}`);
        if (r.k === 'ro' && r.fits !== r.full) bad.push(`${x} wrong ${r.t}`);
      }
    }
    expect(bad).toEqual([]);
  });

  test('2 focus stays on the forward button across a turn', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(FIT_LESSONS[0]);
    await hydrated(page);
    await frames(page, 3);
    await page.locator('.cbtn--go').focus();
    await page.evaluate(() => { (window as unknown as { __go: Element | null }).__go = document.activeElement; });
    const nameBefore = await page.locator('.cbtn--go').getAttribute('aria-label');
    await page.setViewportSize({ width: 1024, height: 768 });
    await frames(page, 4);
    const r = await page.evaluate(() => ({ same: document.activeElement === (window as unknown as { __go: Element }).__go, name: document.activeElement?.getAttribute('aria-label'), label: document.activeElement?.querySelector('.go__label')?.textContent }));
    expect(r.same).toBe(true);
    expect(r.name, 'the name follows the form shown, in the same commit').not.toBe(nameBefore);
    expect(r.label).not.toBeNull();
  });
});
