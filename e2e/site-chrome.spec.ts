import { expect, test, type Page } from '@playwright/test';
import { gzipSize } from '../scripts/check-budgets.mjs';
import { STOPS } from './site-chrome-stops';
import { open, pageOverflow, scrollSettled, settledFrame, transitionsDone } from './support';

/*
 * The site's header and footer in the Card stack look (job 24, B29; prototypes/d23-header-footer.md and
 * prototypes/d23-cases.md, whose case numbers the tests carry). The seven pages that import card-stack.css and the
 * Lesson page, which does not. Every case sets its own size and colour scheme. A read after a state, scroll, focus or
 * theme change waits with `transitionsDone`; a test that opens the menu first waits for the header's script (the theme
 * button's label becomes "Switch to … theme"), then for the panel (E10).
 */

const PAGE_PROJECTS = ['d1440-light', 'd1440-dark', 'reduced-motion'];
const SEVEN = ['/', '/tracks', '/how-the-internet-works', '/networking', '/about', '/glossary', '/does-not-exist'];
const LESSON = '/networking/dhcp';
const SCHEMES = ['light', 'dark'] as const;
type Scheme = (typeof SCHEMES)[number];
const EDGE = { light: 'rgb(18, 23, 27)', dark: 'rgb(198, 205, 209)' } as const;
const GROUND = { light: 'rgb(228, 231, 232)', dark: 'rgb(16, 19, 21)' } as const;
const PAPER_DARK = 'rgb(26, 30, 33)';
const START_SHADOW = { light: 'rgb(18, 23, 27) 3px 3px 0px 0px', dark: 'rgb(198, 205, 209) 3px 3px 0px 0px' } as const;
/** Pages whose header has no Start learning. */
const NO_START = ['/tracks', '/how-the-internet-works', '/networking'];
/** The strip's link that wears "here", by path. */
const HERE: Record<string, string> = { '/tracks': 'Tracks', '/how-the-internet-works': 'Tracks', '/networking': 'Tracks', '/about': 'About', '/glossary': 'Glossary' };
const SIZES_WALK: Array<[number, number]> = [[320, 640], [375, 812], [390, 844], [959, 900], [960, 900], [1440, 900]];

test.describe('the header and the footer in the Card stack look', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!PAGE_PROJECTS.includes(testInfo.project.name), 'runs in the 1440 projects and reduced-motion');
  });

  // ------------------------------------------------------------ helpers

  const near = (a: number, b: number, tol: number, msg: string): void => expect(Math.abs(a - b), `${msg}: ${a} against ${b}`).toBeLessThanOrEqual(tol);

  /** The header's module has run when the theme button's label names the theme it switches to. */
  const headerReady = (page: Page): Promise<void> => expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', /^Switch to (light|dark) theme$/);
  /** Sets the window and scheme, opens the page, and waits for fonts and for the header's script. */
  async function visit(page: Page, path: string, width: number, height: number, scheme: Scheme, scripts = true): Promise<void> {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width, height });
    await open(page, path);
    await page.evaluate(() => document.fonts.ready);
    if (scripts) await headerReady(page);
    await transitionsDone(page);
  }
  async function openMenu(page: Page): Promise<void> {
    await headerReady(page);
    await page.locator('#menu').click();
    await expect(page.locator('#menu-panel')).toBeVisible();
    await transitionsDone(page);
  }
  const box = (page: Page, sel: string, nth = 0) =>
    page.locator(sel).nth(nth).evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    });
  const css = (page: Page, sel: string, props: string[], pseudo = '') =>
    page.locator(sel).first().evaluate(
      (el, [ps, pe]) => {
        const cs = getComputedStyle(el, pe === '' ? null : pe);
        return Object.fromEntries((ps as string[]).map((p) => [p, cs.getPropertyValue(p)]));
      },
      [props, pseudo] as [string[], string],
    );
  /** A colour token as the page computes it, through a probe element (so a test compares colours, not names). */
  const tok = (page: Page, expr: string, prop = 'background-color'): Promise<string> =>
    page.evaluate(
      ([e, p]) => {
        const el = document.createElement('i');
        el.style.setProperty(p!, e!);
        document.body.append(el);
        const v = getComputedStyle(el).getPropertyValue(p!);
        el.remove();
        return v;
      },
      [expr, prop],
    );
  const edges = (page: Page, sel: string, prop: 'width' | 'style' | 'color') =>
    page.locator(sel).first().evaluate((el, p) => ['top', 'right', 'bottom', 'left'].map((s) => getComputedStyle(el).getPropertyValue(`border-${s}-${p}`)), prop);
  const scrollTo = async (page: Page, y: number): Promise<void> => {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await scrollSettled(page);
    await transitionsDone(page);
  };
  /** How many lines an element's words take: the distinct tops of a range over its content (a box has one rect however its words wrap). */
  const textLines = (page: Page, sel: string): Promise<number> =>
    page.locator(sel).first().evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top))).size;
    });
  const blur = (page: Page): Promise<void> => page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

  // ------------------------------------------------------------ 0. what the build may not change

  test('63: the Lesson page reads no Card stack; the seven pages do (check 24)', async ({ page }) => {
    for (const path of [LESSON, '/how-the-internet-works/what-is-http', '/networking/subnetting']) {
      await visit(page, path, 1440, 900, 'light');
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-edge')), path).toBe('');
      const html = await (await page.request.get(path)).text();
      expect(html, path).not.toContain('card-stack');
      expect(html, path).not.toContain('--cs-');
    }
    for (const path of SEVEN) {
      await visit(page, path, 1440, 900, 'light');
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-edge')), path).not.toBe('');
    }
  });

  // ------------------------------------------------------------ 1. words and structure

  test('9 and 10: the words, the links and the names for assistive technology are today’s, on the seven pages', async ({ page }) => {
    const LINKS = [['Tracks', '/tracks'], ['Glossary', '/glossary'], ['How a lesson works', '/#try'], ['Sources', '/#sources'], ['About', '/about']];
    const FOOT = [['TechConcepts', '/'], ['How the Internet Works', '/how-the-internet-works'], ['Networking Concepts', '/networking'], ['All tracks', '/tracks'], ['Glossary', '/glossary'], ['How a lesson works', '/#try'], ['About', '/about']];
    for (const path of SEVEN) {
      for (const [w, h] of [[1440, 900], [375, 812]] as const) {
        await visit(page, path, w, h, 'light');
        if (w === 375) await openMenu(page);
        const start = NO_START.includes(path) ? [] : [['Start learning', '/tracks']];
        const read = (sel: string) => page.locator(sel).evaluateAll((as) => as.map((a) => [(a.textContent ?? '').trim(), a.getAttribute('href'), a.getAttribute('aria-current')]));
        const current = (label: string): string | null => (HERE[path] !== label ? null : path === '/tracks' || path === '/glossary' || path === '/about' ? 'page' : 'true');
        const expectLinks = LINKS.map(([t, hr]) => [t, hr, current(t!)]);
        expect(await read('.site-head nav.site-nav a'), `${path} strip`).toEqual(expectLinks);
        expect(await read('.site-head #menu-panel a'), `${path} panel`).toEqual([...expectLinks, ...start.map(([t, hr]) => [t, hr, null])]);
        expect(await read('.site-head .head-end a.btn'), `${path} row`).toEqual(start.map(([t, hr]) => [t, hr, null]));
        expect((await read('.site-head a.brand'))[0]?.slice(0, 2), path).toEqual(['TechConcepts', '/']);
        expect(await read('.site-foot a'), `${path} footer`).toEqual(FOOT.map(([t, hr]) => [t, hr, null]));
        const foot = await page.locator('.site-foot').evaluate((el) => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim());
        expect(foot, path).toBe('TechConcepts Guided visual lessons on how technology works. Learn How the Internet Works Networking Concepts All tracks Glossary How a lesson works Site About Your progress is saved only in this browser.');
      }
    }
    await visit(page, '/about', 1440, 900, 'light');
    await expect(page.getByRole('link', { name: 'TechConcepts home' })).toHaveCount(2);
    await expect(page.getByRole('navigation', { name: 'Site', exact: true })).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await visit(page, '/about', 375, 812, 'dark');
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toHaveCount(1);
    const menu = page.getByRole('button', { name: 'Menu' });
    await expect(menu).toHaveAttribute('aria-controls', 'menu-panel');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Site menu' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test('11: the scripts on each page are revamp’s', async ({ page }) => {
    const COUNTS: Record<string, number> = { '/': 2, '/glossary': 2, '/does-not-exist': 2, '/tracks': 4, '/how-the-internet-works': 4, '/networking': 4, '/about': 4, [LESSON]: 4 };
    for (const [path, n] of Object.entries(COUNTS)) {
      const html = await (await page.request.get(path)).text();
      expect(html.split('<script').length - 1, path).toBe(n);
    }
  });

  // ------------------------------------------------------------ 2. heights

  test('12: the header is 69px closed, at the top and scrolled, on the seven pages at six widths, light and dark', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const path of SEVEN) {
        await visit(page, path, 1440, 900, scheme);
        for (const [w, h] of [[320, 640], [375, 812], [390, 844], [959, 900], [960, 900], [1440, 900]] as const) {
          await page.setViewportSize({ width: w, height: h });
          await transitionsDone(page);
          await scrollTo(page, 0);
          near((await box(page, '.site-head')).height, 69, 0.5, `${path} ${w} top ${scheme}`);
          await scrollTo(page, 600);
          near((await box(page, '.site-head')).height, 69, 0.5, `${path} ${w} scrolled ${scheme}`);
        }
      }
    }
  });

  test('13: open the header is 391px (329 without Start learning), the panel 322 and 260; Escape closes it and focus returns', async ({ page }) => {
    // 56 visits (two schemes, four widths, seven pages), each opening the menu and closing it with Escape, whose transitions run in real time:
    // about 26s alone, against Playwright's 30s default, which a full run's load overran (job 25).
    test.setTimeout(120_000);
    for (const scheme of SCHEMES) {
      for (const [w, h] of [[320, 640], [375, 812], [390, 844], [959, 900]] as const) {
        for (const path of SEVEN) {
          await visit(page, path, w, h, scheme);
          await openMenu(page);
          const noStart = NO_START.includes(path);
          near((await box(page, '.site-head')).height, noStart ? 329 : 391, 0.5, `${path} ${w} header ${scheme}`);
          near((await box(page, '#menu-panel')).height, noStart ? 260 : 322, 0.5, `${path} ${w} panel ${scheme}`);
          await page.keyboard.press('Escape');
          await transitionsDone(page);
          near((await box(page, '.site-head')).height, 69, 0.5, `${path} ${w} after Escape`);
          await expect(page.locator('#menu-panel')).toBeHidden();
          await expect(page.locator('#menu')).toBeFocused();
        }
      }
    }
    await visit(page, '/', 375, 812, 'light');
    await openMenu(page);
    await page.locator('#menu-panel a', { hasText: 'Sources' }).click();
    await expect(page.locator('#menu-panel')).toBeHidden();
    await transitionsDone(page);
    near((await box(page, '.site-head')).height, 69, 0.5, 'after a link to the same page');
  });

  test('14: opened at 900, widened to 1000 and narrowed again: the state is kept, the panel is not shown above the break', async ({ page }) => {
    await visit(page, '/about', 900, 800, 'light');
    await openMenu(page);
    await page.setViewportSize({ width: 1000, height: 800 });
    await transitionsDone(page);
    near((await box(page, '.site-head')).height, 69, 0.5, '1000');
    await expect(page.locator('.menu-btn')).toBeHidden();
    await expect(page.locator('.site-nav')).toBeVisible();
    expect((await css(page, '#menu-panel', ['display'])).display).toBe('none');
    await page.setViewportSize({ width: 900, height: 800 });
    await transitionsDone(page);
    near((await box(page, '.site-head')).height, 391, 0.5, 'narrowed');
  });

  test('15: the scroll paddings, closed and with the menu open (H5)', async ({ page }) => {
    const read = () => page.evaluate(() => ({ top: getComputedStyle(document.documentElement).scrollPaddingTop, bottom: getComputedStyle(document.documentElement).scrollPaddingBottom }));
    const closed: Record<string, [string, string]> = { '/': ['80px', '12px'], '/tracks': ['80px', '12px'], '/how-the-internet-works': ['80px', '12px'], '/networking': ['80px', '12px'], '/about': ['80px', '12px'], '/glossary': ['80px', '12px'], '/does-not-exist': ['80px', '12px'], [LESSON]: ['69px', 'auto'] };
    const opened: Record<string, string> = { '/': '403px', '/tracks': '341px', '/how-the-internet-works': '341px', '/networking': '341px', '/about': '403px', '/glossary': '403px', '/does-not-exist': '403px' };
    for (const [path, [top, bottom]] of Object.entries(closed)) {
      await visit(page, path, 375, 812, 'light');
      expect(await read(), `${path} closed`).toEqual({ top, bottom });
      if (path === LESSON) continue;
      await openMenu(page);
      expect((await read()).top, `${path} open`).toBe(opened[path]);
      await page.setViewportSize({ width: 1440, height: 900 });
      await transitionsDone(page);
      expect((await read()).top, `${path} opened at 375, then 1440`).toBe('80px');
    }
    await visit(page, '/tracks', 959, 900, 'light');
    await openMenu(page);
    expect((await read()).top, '/tracks opened at 959').toBe('341px');
    await page.setViewportSize({ width: 960, height: 900 });
    await transitionsDone(page);
    expect((await read()).top, '/tracks opened at 959, then 960').toBe('80px');
  });

  test('16: the Glossary’s sticky bars sit under a 2px edge', async ({ page }) => {
    for (const scheme of SCHEMES) {
      await visit(page, '/glossary', 375, 812, scheme);
      const y = await page.evaluate(() => [...document.querySelectorAll('.gl-bar')][2]!.getBoundingClientRect().top + window.scrollY + 160);
      await scrollTo(page, y);
      const bar = await page.evaluate(() => {
        const stuck = [...document.querySelectorAll<HTMLElement>('.gl-bar')].find((b) => Math.abs(b.getBoundingClientRect().top - 68) < 1);
        if (!stuck) return null;
        const h2 = stuck.querySelector('h2')!.getBoundingClientRect();
        const at = document.elementFromPoint(h2.left + h2.width / 2, h2.top + h2.height / 2);
        return { top: stuck.getBoundingClientRect().top, h2Top: h2.top, inTab: at !== null && stuck.contains(at) };
      });
      expect(bar, `a bar is stuck at 375 ${scheme}`).not.toBeNull();
      near(bar!.top, 68, 0.5, 'bar top');
      expect(bar!.h2Top).toBeGreaterThanOrEqual(69 - 0.5);
      expect(bar!.inTab).toBe(true);
      await visit(page, '/glossary', 1440, 900, scheme);
      await scrollTo(page, 2000);
      const az = await page.evaluate(() => {
        const a = document.querySelector<HTMLElement>('.gl-az')!;
        return { top: a.getBoundingClientRect().top, key: a.querySelector('.gl-key')!.getBoundingClientRect().top, pos: getComputedStyle(a).position };
      });
      expect(az.pos).toBe('sticky');
      near(az.top, 68, 0.5, 'az top');
      expect(az.key).toBeGreaterThanOrEqual(69 - 0.5);
    }
  });

  test('17: Home’s anchors land 88px under the window’s top', async ({ page }) => {
    for (const [w, h] of [[375, 812], [1440, 900]] as const) {
      for (const hash of ['#try', '#sources']) {
        await visit(page, '/', w, h, 'light');
        await page.evaluate((id) => document.querySelector(id)!.scrollIntoView({ behavior: 'instant' }), hash);
        await scrollSettled(page);
        await transitionsDone(page);
        const read = await page.evaluate((id) => ({ top: document.querySelector(id)!.getBoundingClientRect().top, atEnd: window.scrollY + innerHeight >= document.documentElement.scrollHeight - 1, foot: document.querySelector('.site-head')!.getBoundingClientRect().bottom }), hash);
        if (read.atEnd) expect(read.top, `${hash} at ${w}, at the end`).toBeGreaterThanOrEqual(read.foot);
        else near(read.top, 88, 1, `${hash} at ${w}`);
      }
    }
  });

  test('18: the footer’s heights, light the same as dark', async ({ page }) => {
    const FOOT: Array<[number, number, number]> = [[320, 640, 629], [375, 812, 582], [390, 844, 557], [720, 900, 507], [721, 900, 401], [959, 900, 376], [960, 900, 376], [1440, 900, 376]];
    for (const path of SEVEN) {
      for (const [w, h, expected] of FOOT) {
        const read: number[] = [];
        for (const scheme of SCHEMES) {
          await visit(page, path, w, h, scheme);
          read.push((await box(page, '.site-foot')).height);
        }
        near(read[0]!, expected, 2, `${path} ${w} footer`);
        near(read[0]!, read[1]!, 0.5, `${path} ${w} light against dark`);
      }
    }
  });

  test('19: each page grows by the footer\'s growth: +29 up to 720px, +5 from 721px (Home within 3, the others within 2)', async ({ page }) => {
    test.setTimeout(120_000);
    // revamp's scrollHeight (13af135, built, light, first visit) at 320, 375, 390, 720, 721, 959, 960 and 1440.
    const BASE: Record<string, number[]> = {
      '/': [4696, 4490, 4471, 5029, 4957, 3211, 3212, 3621],
      '/tracks': [2533, 2368, 2343, 1953, 1902, 1946, 1946, 1599],
      '/how-the-internet-works': [3652, 3499, 3474, 3261, 3210, 2841, 2841, 2365],
      '/networking': [4686, 4330, 4305, 3971, 3921, 3387, 3387, 2910],
      '/about': [6344, 5587, 5377, 4295, 4244, 3450, 3451, 3364],
      '/glossary': [52004, 45324, 43702, 33092, 33042, 26353, 26191, 20300],
      '/does-not-exist': [1430, 1423, 1409, 1418, 1367, 1088, 1088, 1201],
    };
    const SIZES: Array<[number, number]> = [[320, 640], [375, 812], [390, 844], [720, 900], [721, 900], [959, 900], [960, 900], [1440, 900]];
    for (const path of SEVEN) {
      for (const [i, [w, h]] of SIZES.entries()) {
        await visit(page, path, w, h, 'light');
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        near(height - BASE[path]![i]!, w <= 720 ? 29 : 5, path === '/' ? 3 : 2, `${path} ${w}: the page's growth`);
      }
    }
  });

  test('20: no sideways scroll, closed and open, at the top and the foot', async ({ page }) => {
    test.setTimeout(240_000);
    const WIDE = [...Array.from({ length: 11 }, (_, i) => 320 + i * 8), 512, 640, 719, 720, 721, 768, 896, 959, 960, 1024, 1152, 1280, 1408, 1440];
    const FEW = [320, 341, 342, 375, 959, 960, 1440];
    for (const [path, widths] of [['/about', WIDE], ['/tracks', WIDE], ['/', FEW], ['/glossary', FEW], ['/does-not-exist', FEW], ['/how-the-internet-works', FEW], ['/networking', FEW]] as const) {
      await visit(page, path, 1440, 900, 'light');
      for (const w of widths) {
        await page.setViewportSize({ width: w, height: 800 });
        await transitionsDone(page);
        await scrollTo(page, 0);
        expect((await pageOverflow(page)).sideways, `${path} ${w} top`).toBe(0);
        await scrollTo(page, 1e6);
        expect((await pageOverflow(page)).sideways, `${path} ${w} foot`).toBe(0);
        if (w < 960) {
          await scrollTo(page, 0);
          await openMenu(page);
          expect((await pageOverflow(page)).sideways, `${path} ${w} open`).toBe(0);
          await page.keyboard.press('Escape');
          await transitionsDone(page);
        }
      }
    }
  });

  // ------------------------------------------------------------ 3. the header's look

  test('21 and 22: the ground, the edge and the row', async ({ page }) => {
    test.setTimeout(180_000);
    for (const scheme of SCHEMES) {
      for (const path of SEVEN) {
        for (const w of [375, 1440]) {
          await visit(page, path, w, 900, scheme);
          for (const y of [0, 600]) {
            await scrollTo(page, y);
            const head = await css(page, '.site-head', ['background-color', 'backdrop-filter', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color', 'position', 'top', 'z-index']);
            const body = await css(page, 'body', ['background-color']);
            expect(head['background-color'], `${path} ${w} ${scheme}: the header's ground is the page's`).toBe(body['background-color']);
            expect(head['background-color']).toBe(GROUND[scheme]);
            expect(head['backdrop-filter']).toBe('none');
            expect([head['border-bottom-width'], head['border-bottom-style'], head['border-bottom-color']]).toEqual(['2px', 'solid', EDGE[scheme]]);
            expect([head.position, head.top, head['z-index']]).toEqual(['sticky', '0px', '20']);
          }
          const inHead = await page.evaluate(() => document.elementFromPoint(200, 34)?.closest('.site-head') != null);
          expect(inHead, `${path} ${w}: the header is on top of a card passing under it`).toBe(true);
          const row = await css(page, '.site-head .wrap', ['height', 'padding-top', 'padding-bottom']);
          expect([row.height, row['padding-top'], row['padding-bottom']]).toEqual(['67px', '1px', '0px']);
        }
      }
    }
    await visit(page, '/about', 1440, 900, 'light');
    for (const [w, pad] of [[320, 21], [330, 26], [341, 31.5], [342, 32], [375, 32], [959, 32], [960, 32], [1440, 32]] as const) {
      await page.setViewportSize({ width: w, height: 800 });
      await transitionsDone(page);
      const p = await page.locator('.site-head .wrap').evaluate((el) => ({ l: parseFloat(getComputedStyle(el).paddingLeft), r: parseFloat(getComputedStyle(el).paddingRight) }));
      near(p.l, pad, 0.25, `${w} left padding`);
      near(p.r, pad, 0.25, `${w} right padding`);
      const wrap = await box(page, '.site-head .wrap');
      near((await box(page, '.site-head .brand')).left, wrap.left + pad, 0.5, `${w} the brand's left`);
      if (w < 960) near(w - (await box(page, '#menu')).right, pad, 0.5, `${w} the menu button from the right`);
    }
  });

  test('23, 24, 25: the square buttons, the icon that follows the theme, the hover', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const [w, h] of [[320, 640], [375, 812], [959, 900], [960, 900], [1440, 900]] as const) {
        await visit(page, '/about', w, h, scheme);
        const edge = await tok(page, 'var(--cs-edge)');
        const card = await tok(page, 'var(--cs-card)');
        const ink = await tok(page, 'var(--ink-strong)', 'color');
        for (const sel of w < 960 ? ['#theme-toggle', '#menu'] : ['#theme-toggle']) {
          const b = await box(page, sel);
          near(b.width, 44, 0.25, `${sel} ${w} width`);
          near(b.height, 44, 0.25, `${sel} ${w} height`);
          expect(b.top, `${sel} ${w}: top`).toBe(12);
          expect(await edges(page, sel, 'width'), sel).toEqual(['2px', '2px', '2px', '2px']);
          expect(await edges(page, sel, 'color'), sel).toEqual([edge, edge, edge, edge]);
          const c = await css(page, sel, ['border-top-left-radius', 'background-color', 'color', 'box-shadow']);
          expect([c['border-top-left-radius'], c['background-color'], c.color, c['box-shadow']], `${sel} ${w} ${scheme}`).toEqual(['8px', card, ink, 'none']);
          const svg = await box(page, `${sel} svg`, sel === '#theme-toggle' ? (scheme === 'light' ? 0 : 1) : 0);
          near(svg.width, 20, 0.25, 'the icon');
          near(svg.height, 20, 0.25, 'the icon');
        }
      }
      await visit(page, '/about', 1440, 900, scheme);
      expect((await css(page, '#theme-toggle .i-moon', ['display'])).display === 'none', `${scheme}: the moon is hidden`).toBe(scheme === 'dark');
      expect((await css(page, '#theme-toggle .i-sun', ['display'])).display === 'none', `${scheme}: the sun is hidden`).toBe(scheme === 'light');
      await page.locator('#theme-toggle').click();
      await transitionsDone(page);
      expect((await css(page, '#theme-toggle .i-moon', ['display'])).display === 'none', `${scheme}: after a click the moon is`).toBe(scheme === 'light');
      await visit(page, '/tracks', 1440, 900, scheme);
      const t = await box(page, '#theme-toggle');
      near(t.left, 1296, 0.5, 'the theme button is last on Tracks');
      near(t.right, 1340, 0.5, 'the theme button is last on Tracks');
      await page.locator('#theme-toggle').hover();
      await transitionsDone(page);
      expect((await css(page, '#theme-toggle', ['background-color']))['background-color'], `hover ${scheme}`).toBe(await tok(page, 'var(--cs-quiet)'));
    }
  });

  test('26: the open menu button is filled and stays filled under the mouse', async ({ page }) => {
    for (const scheme of SCHEMES) {
      await visit(page, '/about', 375, 812, scheme);
      const edge = await tok(page, 'var(--cs-edge)');
      const card = await tok(page, 'var(--cs-card)');
      const quiet = await tok(page, 'var(--cs-quiet)');
      const cardInk = await tok(page, 'var(--cs-card)', 'color');
      await openMenu(page);
      let c = await css(page, '#menu', ['background-color', 'color']);
      expect([c['background-color'], c.color]).toEqual([edge, cardInk]);
      await page.locator('#menu').hover();
      await transitionsDone(page);
      c = await css(page, '#menu', ['background-color']);
      expect(c['background-color'], 'hovered while open').toBe(edge);
      await page.locator('#menu').click();
      await transitionsDone(page);
      expect((await css(page, '#menu', ['background-color']))['background-color'], 'closed by a click, mouse still on it').toBe(quiet);
      await page.mouse.move(5, 400);
      await transitionsDone(page);
      expect((await css(page, '#menu', ['background-color']))['background-color']).toBe(card);
      await page.locator('#menu').click();
      await expect(page.locator('#menu-panel')).toBeVisible();
      await page.mouse.move(5, 700);
      await page.keyboard.press('Escape');
      await transitionsDone(page);
      expect((await css(page, '#menu', ['background-color']))['background-color'], 'closed by Escape').toBe(card);
    }
  });

  test('27, 28: Start learning in the row, and pressed', async ({ page }) => {
    const reduced = (): Promise<boolean> => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    for (const scheme of SCHEMES) {
      for (const path of ['/', '/about', '/glossary', '/does-not-exist']) {
        for (const w of [960, 1440]) {
          await visit(page, path, w, 900, scheme);
          const sel = '.site-head .head-end a.btn';
          const b = await box(page, sel);
          near(b.height, 44, 0.25, `${path} ${w} height`);
          near(b.width, 130.5, 0.5, `${path} ${w} width`);
          near(b.right + 3, w === 960 ? 928 : 1340, 0.5, `${path} ${w} right`);
          expect(await textLines(page, sel), `${path} ${w}: one line`).toBe(1);
          const edge = await tok(page, 'var(--cs-edge)');
          expect(await edges(page, sel, 'width')).toEqual(['2px', '2px', '2px', '2px']);
          expect(await edges(page, sel, 'color')).toEqual([edge, edge, edge, edge]);
          const c = await css(page, sel, ['border-top-left-radius', 'background-color', 'color', 'box-shadow', 'font-weight', 'font-size', 'line-height', 'font-family', 'white-space', 'padding', 'margin-right']);
          expect(c['border-top-left-radius']).toBe('8px');
          expect(c['background-color']).toBe(await tok(page, 'var(--cs-act)'));
          expect(c.color).toBe(await tok(page, 'var(--cs-act-ink)', 'color'));
          expect(c['box-shadow']).toBe(START_SHADOW[scheme]);
          expect([c['font-weight'], c['font-size'], c['line-height']]).toEqual(['600', '17px', '20.4px']);
          expect(c['font-family']).toContain('Barlow Semi Condensed');
          expect([c['white-space'], c.padding, c['margin-right']]).toEqual(['nowrap', '0px 16px', '3px']);
          if (w === 1440 && path === '/about') {
            await page.locator(sel).hover();
            await transitionsDone(page);
            expect((await css(page, sel, ['background-color']))['background-color'], 'hovered').toBe(await tok(page, 'color-mix(in srgb, var(--cs-act) 88%, var(--cs-edge))'));
            const rest = await box(page, sel);
            await page.mouse.down();
            await transitionsDone(page);
            const down = await box(page, sel);
            near(down.left - rest.left, 2, 0.25, 'pressed right');
            near(down.top - rest.top, 2, 0.25, 'pressed down');
            const p = await css(page, sel, ['box-shadow', 'transform', 'transition-duration']);
            expect(p['box-shadow']).toBe(`${EDGE[scheme]} 1px 1px 0px 0px`);
            expect(p.transform).not.toBe('none');
            expect(p.transform).not.toContain('0.97');
            // Under reduced motion global.css gives every element one duration (0s: no transition at all), so the computed list has one entry.
            expect(p['transition-duration']).toBe((await reduced()) ? '0s' : '0.08s, 0.08s');
            await page.mouse.move(5, 400);
            await page.mouse.up();
            await transitionsDone(page);
            const back = await box(page, sel);
            near(back.left, rest.left, 0.25, 'back to rest');
            near(back.top, rest.top, 0.25, 'back to rest');
          }
        }
      }
    }
  });

  test('29 and 30: the strip, and where you are', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const w of [960, 1440]) {
        await visit(page, '/about', w, 900, scheme);
        const nav = '.site-nav';
        const n = await box(page, nav);
        near(n.height, 44, 0.25, 'the strip');
        near(n.width, 470.6, 0.5, 'the strip’s width');
        near((n.left + n.right) / 2, w / 2, 0.5, 'the strip is centred');
        const edge = await tok(page, 'var(--cs-edge)');
        expect(await edges(page, nav, 'width')).toEqual(['2px', '2px', '2px', '2px']);
        expect(await edges(page, nav, 'color')).toEqual([edge, edge, edge, edge]);
        const c = await css(page, nav, ['border-top-left-radius', 'background-color', 'box-shadow', 'padding', 'gap']);
        expect([c['border-top-left-radius'], c['background-color'], c['box-shadow'], c.padding, c.gap]).toEqual(['8px', await tok(page, 'var(--cs-card)'), 'none', '2px', '2px']);
        const links = await page.locator(`${nav} a`).evaluateAll((as) =>
          as.map((a) => {
            const cs = getComputedStyle(a);
            return { text: a.textContent, h: a.getBoundingClientRect().height, padding: cs.padding, radius: cs.borderTopLeftRadius, weight: cs.fontWeight, size: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing, family: cs.fontFamily, color: cs.color, ws: cs.whiteSpace };
          }),
        );
        const ink = await tok(page, 'var(--ink)', 'color');
        for (const l of links) {
          near(l.h, 36, 0.25, l.text!);
          expect([l.padding, l.radius, l.weight, l.size, l.lh, l.ws]).toEqual(['0px 12px', '4px', '600', '16px', '16px', 'nowrap']);
          expect(l.ls).toBe('0.16px');
          expect(l.family).toContain('Barlow Semi Condensed');
          if (l.text !== 'About') expect(l.color).toBe(ink);
        }
        await page.locator(`${nav} a`, { hasText: 'Tracks' }).hover();
        await transitionsDone(page);
        const hv = await css(page, `${nav} a[href="/tracks"]`, ['background-color', 'color']);
        expect([hv['background-color'], hv.color]).toEqual([await tok(page, 'var(--cs-quiet)'), await tok(page, 'var(--ink-strong)', 'color')]);
      }
    }
    for (const scheme of SCHEMES) {
      for (const [path, label, current] of [['/about', 'About', 'page'], ['/tracks', 'Tracks', 'page'], ['/networking', 'Tracks', 'true'], ['/how-the-internet-works', 'Tracks', 'true'], ['/glossary', 'Glossary', 'page']] as const) {
        await visit(page, path, 1440, 900, scheme);
        const link = page.locator('.site-nav a', { hasText: label, hasNotText: 'How' });
        await expect(link).toHaveAttribute('aria-current', current);
        const c = await link.evaluate((a) => {
          const cs = getComputedStyle(a);
          const b = getComputedStyle(a, '::before');
          const range = document.createRange();
          range.selectNodeContents(a.lastChild!);
          const bef = { content: b.content, w: parseFloat(b.width), h: parseFloat(b.height), radius: b.borderTopLeftRadius, bg: b.backgroundColor, shadow: b.boxShadow };
          const others = [...a.parentElement!.querySelectorAll('a')].filter((x) => x !== a).map((x) => getComputedStyle(x, '::before').content);
          return { bg: cs.backgroundColor, shadow: cs.boxShadow, color: cs.color, bef, textLeft: range.getBoundingClientRect().left, a: a.getBoundingClientRect(), others };
        });
        expect(c.bg).toBe(await tok(page, 'var(--cs-here-wash)'));
        expect(c.shadow).toBe('none');
        expect(c.color).toBe(await tok(page, 'var(--ink-strong)', 'color'));
        expect(c.bef.content).toBe('""');
        expect([c.bef.w, c.bef.h, c.bef.radius, c.bef.bg]).toEqual([9, 9, '2px', await tok(page, 'var(--cs-here)')]);
        expect(c.bef.shadow).toBe(`${EDGE[scheme]} 0px 0px 0px 1.5px`);
        // The marker's right edge is 8px left of the word: the link's 12px of padding, the 9px marker, the 8px gap.
        near(c.textLeft - (c.a.left + 12 + 9), 8, 0.5, `${path}: the marker's gap`);
        expect(c.others.every((x) => x === 'none'), path).toBe(true);
      }
    }
    for (const path of ['/', '/does-not-exist']) {
      await visit(page, path, 375, 812, 'light');
      await openMenu(page);
      expect(await page.locator('.site-head [aria-current]').count(), path).toBe(0);
      expect(await page.locator('.site-head a').evaluateAll((as) => as.filter((a) => getComputedStyle(a, '::before').content !== 'none').length), path).toBe(0);
    }
  });

  test('31: nothing wraps or overlaps at 960px', async ({ page }) => {
    for (const path of ['/about', '/', '/tracks']) {
      await visit(page, path, 960, 900, 'light');
      const read = await page.evaluate(() => {
        const q = (s: string): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(s)];
        // The lines of an element's words: the distinct tops of a range over its content (a box has one rect however its words wrap).
        const lines = (els: HTMLElement[]): number[] =>
          els.map((e) => {
            const range = document.createRange();
            range.selectNodeContents(e);
            return new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top))).size;
          });
        const r = (s: string): DOMRect => document.querySelector(s)!.getBoundingClientRect();
        const start = document.querySelector<HTMLElement>('.head-end a.btn');
        const wrap = document.querySelector('.site-head .wrap')!;
        return {
          lines: [...lines(q('.site-head .brand b')), ...lines(q('.site-nav a')), ...(start ? lines([start]) : [])],
          brandToNav: r('.site-nav').left - r('.site-head .brand').right,
          navToTheme: r('#theme-toggle').left - r('.site-nav').right,
          themeToStart: start ? start.getBoundingClientRect().left - r('#theme-toggle').right : null,
          inside: r('.site-head .head-end').right <= wrap.getBoundingClientRect().right - parseFloat(getComputedStyle(wrap).paddingRight) + 3.5,
        };
      });
      expect(read.lines.every((n) => n === 1), path).toBe(true);
      expect(read.brandToNav, path).toBeGreaterThanOrEqual(16 - 0.5);
      expect(read.navToTheme, path).toBeGreaterThanOrEqual(16 - 0.5);
      if (read.themeToStart !== null) near(read.themeToStart, 10, 0.5, `${path} theme to Start learning`);
      expect(read.inside, path).toBe(true);
    }
  });

  test('32 and 33: the open menu', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const [w, h] of [[320, 640], [375, 812], [959, 900]] as const) {
        for (const path of ['/about', '/tracks']) {
          await visit(page, path, w, h, scheme);
          await openMenu(page);
          const side = w === 320 ? 21 : 32;
          const hair = await tok(page, 'var(--cs-hair)');
          const p = await css(page, '#menu-panel', ['border-top-width', 'border-top-style', 'border-top-color', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']);
          expect([p['border-top-width'], p['border-top-style'], p['border-top-color'], p['padding-top'], p['padding-bottom']]).toEqual(['1px', 'solid', hair, '8px', '18px']);
          near(parseFloat(p['padding-left']!), side, 0.25, `${w} panel left padding`);
          near(parseFloat(p['padding-right']!), side, 0.25, `${w} panel right padding`);
          const rows = await page.locator('#menu-panel a:not(.btn)').evaluateAll((as) =>
            as.map((a) => {
              const cs = getComputedStyle(a);
              const range = document.createRange();
              range.selectNodeContents(a.lastChild!);
              const r = a.getBoundingClientRect();
              return { h: r.height, left: r.left, right: r.right, top: r.top, bottom: r.bottom, bb: `${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`, size: cs.fontSize, lh: cs.lineHeight, weight: cs.fontWeight, ls: cs.letterSpacing, family: cs.fontFamily, color: cs.color, current: a.hasAttribute('aria-current'), textLeft: range.getBoundingClientRect().left };
            }),
          );
          expect(rows).toHaveLength(5);
          const ink = await tok(page, 'var(--ink-strong)', 'color');
          rows.forEach((r, i) => {
            near(r.h, 45, 0.25, `${path} ${w} row ${i}`);
            expect(r.bb).toBe(`1px solid ${hair}`);
            expect([r.size, r.lh, r.ls, r.color]).toEqual(['18px', '21.6px', '0.18px', ink]);
            expect(r.family).toContain('Barlow Semi Condensed');
            expect(r.weight).toBe(r.current ? '700' : '600');
            if (i > 0) near(r.top - rows[i - 1]!.bottom, 2, 0.25, 'rows 2px apart');
            near(r.left, side, 0.5, 'the rows’ left line');
            // The marker is 9px wide and 10px before the word.
            if (r.current) near(r.textLeft - r.left, 9 + 10, 0.5, 'the marker 10px before the word');
          });
          near((await box(page, '.site-head .brand')).left, side, 0.5, 'the brand’s left line');
          if (path === '/about') {
            const s = await box(page, '#menu-panel a.btn');
            near(s.height, 48, 0.25, 'Start learning in the panel');
            near(s.left, side, 0.5, 'Start learning’s left line');
            if (w === 375) near(s.width, 308, 0.5, 'Start learning is 308 wide');
            near(s.right + 3, rows[0]!.right, 0.5, 'its offset edge ends on the rows’ line');
            expect(await edges(page, '#menu-panel a.btn', 'width')).toEqual(['2px', '2px', '2px', '2px']);
            const sc = await css(page, '#menu-panel a.btn', ['color', 'margin-top']);
            expect([sc.color, sc['margin-top']]).toEqual([await tok(page, 'var(--cs-act-ink)', 'color'), '12px']);
          } else {
            await expect(page.locator('#menu-panel .btn')).toHaveCount(0);
            const head = await box(page, '.site-head');
            near(head.bottom - 2 - rows[4]!.bottom, 18, 0.5, 'the last link’s foot above the header’s edge');
          }
        }
      }
    }
  });

  test('34: below 342px the header’s side padding gives way evenly', async ({ page }) => {
    await visit(page, '/about', 320, 640, 'light');
    near((await box(page, '.site-head .brand')).left, 21, 0.25, 'brand');
    near(320 - (await box(page, '#menu')).right, 21, 0.25, 'menu');
    const theme = await box(page, '#theme-toggle');
    const menu = await box(page, '#menu');
    near(theme.left, 201, 0.5, 'theme left');
    near(theme.right, 245, 0.5, 'theme right');
    near(menu.left, 255, 0.5, 'menu left');
    near(menu.right, 299, 0.5, 'menu right');
    expect(theme.left - (await box(page, '.site-head .brand')).right).toBeGreaterThanOrEqual(16 - 0.5);
    near(await page.locator('main .wrap').first().evaluate((el) => el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft)), 32, 0.5, 'the page’s own column');
    await page.setViewportSize({ width: 342, height: 640 });
    await transitionsDone(page);
    near((await box(page, '.site-head .brand')).left, 32, 0.25, 'brand at 342');
    near(342 - (await box(page, '#menu')).right, 32, 0.25, 'menu at 342');
  });

  test('35, 36, 37: the skip link is over the header when focused', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const [w, h] of [[320, 640], [375, 812], [1440, 900]] as const) {
        // The Lesson page keeps Patch but its link is lifted the same (B30): it is asserted with the seven.
        for (const path of [...SEVEN, LESSON]) {
          await visit(page, path, w, h, scheme);
          await page.keyboard.press('Tab');
          const link = page.locator('a.skip-link');
          await expect(link).toBeFocused();
          await expect.poll(async () => Math.abs((await box(page, 'a.skip-link')).top - 8) < 0.5 && (await link.evaluate((a) => a.matches(':focus')))).toBe(true);
          await transitionsDone(page);
          const top = await page.evaluate(() => {
            const a = document.querySelector('a.skip-link')!;
            const r = a.getBoundingClientRect();
            const at = (x: number, y: number): boolean => a.contains(document.elementFromPoint(x, y));
            return { centre: at(r.left + r.width / 2, r.top + r.height / 2), tl: at(r.left + 2, r.top + 2), br: at(r.right - 2, r.bottom - 2), z: getComputedStyle(a).zIndex };
          });
          expect(top, `${path} ${w} ${scheme}`).toEqual({ centre: true, tl: true, br: true, z: '21' });
        }
      }
    }
    // 37: its look is global.css's, the Lesson page's focused link wears the same; only its layer differs.
    const read = async (path: string) => {
      await visit(page, path, 375, 812, 'light');
      await page.keyboard.press('Tab');
      await expect(page.locator('a.skip-link')).toBeFocused();
      await expect.poll(async () => Math.abs((await box(page, 'a.skip-link')).top - 8) < 0.5).toBe(true);
      await transitionsDone(page);
      return { c: await css(page, 'a.skip-link', ['padding', 'border-top-width', 'border-top-style', 'background-color', 'color', 'border-top-left-radius', 'z-index']), b: await box(page, 'a.skip-link') };
    };
    const about = await read('/about');
    const lesson = await read(LESSON);
    expect([about.c['z-index'], lesson.c['z-index']]).toEqual(['21', '21']);
    expect({ ...about.c, 'z-index': '' }).toEqual({ ...lesson.c, 'z-index': '' });
    near(about.b.width, lesson.b.width, 0.5, 'skip link width');
    near(about.b.height, lesson.b.height, 0.5, 'skip link height');
  });

  // ------------------------------------------------------------ 4. the footer

  test('38, 39, 40, 41: the footer', async ({ page }) => {
    test.setTimeout(180_000);
    for (const scheme of SCHEMES) {
      for (const path of SEVEN) {
        for (const [w, h] of [[1440, 900], [960, 900], [721, 900], [720, 900], [375, 812], [320, 640]] as const) {
          await visit(page, path, w, h, scheme);
          const f = await css(page, '.site-foot', ['background-color', 'border-top-width', 'border-top-style', 'border-top-color', 'border-right-width', 'border-bottom-width', 'border-left-width', 'margin-top']);
          expect([f['background-color'], f['border-top-width'], f['border-top-style'], f['border-top-color']], `${path} ${w}`).toEqual([await tok(page, 'var(--cs-card)'), '2px', 'solid', await tok(page, 'var(--cs-edge)')]);
          expect([f['border-right-width'], f['border-bottom-width'], f['border-left-width']]).toEqual(['0px', '0px', '0px']);
          expect(f['margin-top'], `${path} ${w}`).toBe(w >= 721 ? '128px' : '96px');
          const cols = await page.locator('.site-foot .foot-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').map(parseFloat));
          expect(cols.length, `${path} ${w} columns`).toBe(w >= 721 ? 3 : 2);
          if (w === 1440) cols.forEach((t, i) => near(t, [588, 294, 294][i]!, 1, '1440 tracks'));
          if (w <= 720) near((await box(page, '.site-foot .foot-grid > div', 0)).width, (await box(page, '.site-foot .foot-grid')).width, 0.5, 'the first column across both');
          const p = await css(page, '.site-foot .foot-grid p', ['color', 'font-size']);
          expect([p.color, p['font-size']]).toEqual([await tok(page, 'var(--ink)', 'color'), '15.5px']);
          const hd = await css(page, '.site-foot .foot-grid h3', ['margin-bottom', 'font-weight', 'font-size', 'font-family', 'color']);
          expect([hd['margin-bottom'], hd['font-weight'], hd['font-size'], hd.color]).toEqual(['10px', '600', '17px', await tok(page, 'var(--ink-strong)', 'color')]);
          expect(hd['font-family']).toContain('Barlow');
          const links = await page.locator('.site-foot .foot-grid ul a').evaluateAll((as) =>
            as.map((a) => {
              const cs = getComputedStyle(a);
              return { color: cs.color, size: cs.fontSize, display: cs.display, padding: cs.padding, h: a.getBoundingClientRect().height, top: a.getBoundingClientRect().top, text: a.textContent };
            }),
          );
          const ink = await tok(page, 'var(--ink)', 'color');
          const extra = w >= 721 ? 8 : 20;
          links.forEach((l, i) => {
            expect([l.color, l.size, l.display, l.padding], `${path} ${w} ${l.text}`).toEqual([ink, '15.5px', 'inline-block', w >= 721 ? '4px 0px' : '10px 0px']);
            const lines = Math.round((l.h - extra) / 24.8);
            near(l.h, 24.8 * lines + extra, 0.25, `${path} ${w} ${l.text} height`);
            if (i > 0 && i < 5 && lines === 1 && links[i - 1]!.h === l.h) near(l.top - links[i - 1]!.top, w >= 721 ? 34.8 : 44.8, 0.25, 'targets apart');
          });
          const base = await css(page, '.site-foot .foot-base', ['border-top-width', 'border-top-style', 'border-top-color', 'color', 'font-size']);
          expect([base['border-top-width'], base['border-top-style'], base['border-top-color'], base.color, base['font-size']]).toEqual(['1px', 'solid', await tok(page, 'var(--cs-hair)'), await tok(page, 'var(--muted)', 'color'), '14px']);
        }
      }
    }
    await visit(page, '/about', 390, 844, 'light');
    expect(await textLines(page, '.site-foot a[href="/networking"]'), 'Networking Concepts on one line at 390').toBe(1);
    await visit(page, '/about', 1440, 900, 'light');
    const link = page.locator('.site-foot .foot-grid ul a', { hasText: 'Glossary' });
    await link.hover();
    await transitionsDone(page);
    const hv = await link.evaluate((a) => {
      const cs = getComputedStyle(a);
      return [cs.color, cs.textDecorationLine, cs.textDecorationThickness, cs.textUnderlineOffset];
    });
    expect(hv).toEqual([await tok(page, 'var(--ink-strong)', 'color'), 'underline', '2px', '4px']);
  });

  // ------------------------------------------------------------ 5. contrast and forced colours

  test('42: contrast, light and dark', async ({ page }) => {
    const ratios = () =>
      page.evaluate(() => {
        const px = (c: string, over?: string): number[] => {
          const cv = document.createElement('canvas');
          cv.width = cv.height = 1;
          const x = cv.getContext('2d', { willReadFrequently: true })!;
          if (over) {
            x.fillStyle = over;
            x.fillRect(0, 0, 1, 1);
          }
          x.fillStyle = c;
          x.fillRect(0, 0, 1, 1);
          const d = x.getImageData(0, 0, 1, 1).data;
          return [d[0]!, d[1]!, d[2]!];
        };
        const lum = ([r, g, b]: number[]): number => {
          const f = (v: number): number => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
        };
        const ratio = (a: number[], b: number[]): number => {
          const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (hi! + 0.05) / (lo! + 0.05);
        };
        const rgb = (a: number[]): string => `rgb(${a.join(',')})`;
        const tokenColour = (n: string): string => {
          const d = document.createElement('i');
          d.style.backgroundColor = `var(${n})`;
          document.body.append(d);
          const v = getComputedStyle(d).backgroundColor;
          d.remove();
          return v;
        };
        /** The colour behind an element: every ancestor's background composited, root first. */
        const behind = (el: Element): number[] => {
          const chain: string[] = [];
          for (let e: Element | null = el; e; e = e.parentElement) chain.unshift(getComputedStyle(e).backgroundColor);
          let g = px('rgb(255,255,255)');
          for (const c of chain) g = px(c, rgb(g));
          return g;
        };
        const q = (s: string): Element => document.querySelector(s)!;
        const out: Record<string, number> = {};
        for (const s of ['.site-head .brand b', '.site-nav a[href="/tracks"]', '.site-nav a[aria-current]', '.head-end a.btn', '.site-foot .brand b', '.site-foot .foot-grid h3', '.site-foot .foot-grid p', '.site-foot .foot-grid ul a', '.site-foot .foot-base']) {
          const ground = behind(q(s));
          out[`text ${s}`] = ratio(px(getComputedStyle(q(s)).color, rgb(ground)), ground);
        }
        const ground = px(getComputedStyle(document.body).backgroundColor);
        const card = px(tokenColour('--cs-card'));
        const wash = behind(q('.site-nav a[aria-current]'));
        const marker = getComputedStyle(q('.site-nav a[aria-current]'), '::before').backgroundColor;
        const tokenOn = (n: string, over: number[]): number => ratio(px(tokenColour(n), rgb(over)), over);
        out['edge on the ground'] = tokenOn('--cs-edge', ground);
        out['edge on the paper'] = tokenOn('--cs-edge', card);
        out['marker on the wash'] = ratio(px(marker, rgb(wash)), wash);
        out['marker on the ground'] = ratio(px(marker, rgb(ground)), ground);
        out['Start learning fill on the ground'] = ratio(px(tokenColour('--cs-act')), ground);
        out['focus ring on the ground'] = tokenOn('--focus', ground);
        out['focus ring on the paper'] = tokenOn('--focus', card);
        return out;
      });
    for (const scheme of SCHEMES) {
      await visit(page, '/about', 1440, 900, scheme);
      for (const [name, r] of Object.entries(await ratios())) expect(r, `${scheme}: ${name}`).toBeGreaterThanOrEqual(/^(edge|marker|Start|focus)/.test(name) ? 3 : 4.5);
      await page.locator('.site-nav a[href="/tracks"]').hover();
      await transitionsDone(page);
      const hov = await page.evaluate(() => {
        const a = document.querySelector('.site-nav a[href="/tracks"]')!;
        const cv = document.createElement('canvas').getContext('2d')!;
        const lum = (c: string): number => {
          cv.fillStyle = '#000';
          cv.fillStyle = c;
          const m = /^#(..)(..)(..)$/.exec(cv.fillStyle)!;
          const f = (v: string): number => {
            const n = parseInt(v, 16) / 255;
            return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(m[1]!) + 0.7152 * f(m[2]!) + 0.0722 * f(m[3]!);
        };
        const [hi, lo] = [lum(getComputedStyle(a).color), lum(getComputedStyle(a).backgroundColor)].sort((x, y) => y - x);
        return (hi! + 0.05) / (lo! + 0.05);
      });
      expect(hov, `${scheme}: a hovered strip link`).toBeGreaterThanOrEqual(4.5);
      await visit(page, '/about', 375, 812, scheme);
      await openMenu(page);
      const rows = await page.evaluate(() => {
        const cv = document.createElement('canvas').getContext('2d')!;
        const lum = (c: string): number => {
          cv.fillStyle = '#000';
          cv.fillStyle = c;
          const m = /^#(..)(..)(..)$/.exec(cv.fillStyle)!;
          const f = (v: string): number => {
            const n = parseInt(v, 16) / 255;
            return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
          };
          return 0.2126 * f(m[1]!) + 0.7152 * f(m[2]!) + 0.0722 * f(m[3]!);
        };
        const ground = getComputedStyle(document.body).backgroundColor;
        return [...document.querySelectorAll('#menu-panel a:not(.btn)')].map((a) => {
          const [hi, lo] = [lum(getComputedStyle(a).color), lum(ground)].sort((x, y) => y - x);
          return (hi! + 0.05) / (lo! + 0.05);
        });
      });
      rows.forEach((r) => expect(r, `${scheme}: a panel row`).toBeGreaterThanOrEqual(4.5));
    }
  });

  test('43: forced colours keep the borders and the names (H12)', async ({ browser }) => {
    for (const [w, h] of [[1440, 900], [375, 812]] as const) {
      const ctx = await browser.newContext({ forcedColors: 'active', viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await open(page, '/about');
      await headerReady(page);
      if (w === 375) await openMenu(page);
      for (const s of w === 1440 ? ['.site-nav', '#theme-toggle', '.head-end a.btn'] : ['#theme-toggle', '#menu']) {
        const c = await css(page, s, ['border-top-width', 'border-top-color']);
        expect(c['border-top-width'], s).toBe('2px');
        expect(c['border-top-color'], s).not.toBe('rgba(0, 0, 0, 0)');
      }
      expect((await css(page, '.site-head', ['border-bottom-width']))['border-bottom-width']).toBe('2px');
      await expect(page.locator('.site-head a[aria-current]').first()).toHaveAttribute('aria-current', 'page');
      if (w === 375) await expect(page.locator('#menu')).toHaveAttribute('aria-expanded', 'true');
      await ctx.close();
    }
  });

  // ------------------------------------------------------------ 6. keyboard walks

  interface Stop {
    where: 'skip' | 'head' | 'main' | 'foot';
    name: string;
    under: boolean;
    cutFoot: boolean;
    cut: boolean;
  }
  /** The focused element: where it is, its name, and its ring (its box grown by the outline's width and offset) against the header and the window. */
  const readStop = (page: Page): Promise<Stop> =>
    page.evaluate(() => {
      const focused = document.activeElement as HTMLElement;
      // A demo radio is drawn nowhere (opacity 0): its ring is the one a reader sees, on the visible element it stands for (case 28);
      // the stop keeps the radio's name. Hidden panes keep a ring at 0,0, so only an element with a box counts.
      const el = focused.matches('.demo__in')
        ? ([...document.querySelectorAll<HTMLElement>('main .demo *')].find((e) => e !== focused && getComputedStyle(e).outlineStyle !== 'none' && e.getClientRects().length > 0) ?? focused)
        : focused;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const grow = cs.outlineStyle === 'none' ? 5 : parseFloat(cs.outlineWidth) + parseFloat(cs.outlineOffset);
      const head = document.querySelector('.site-head')!.getBoundingClientRect();
      const where = focused.classList.contains('skip-link') ? 'skip' : el.closest('.site-head') ? 'head' : el.closest('.site-foot') ? 'foot' : 'main';
      const top = r.top - grow;
      const bottom = r.bottom + grow;
      return {
        where,
        name: (focused.getAttribute('aria-label') ?? (focused.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40)) || focused.tagName,
        under: where !== 'head' && where !== 'skip' && top < head.bottom - 0.5,
        cutFoot: bottom > innerHeight + 0.5,
        cut: r.left - grow < -0.5 || r.right + grow > innerWidth + 0.5 || top < -0.5 || bottom > innerHeight + 0.5,
      } as Stop;
    });
  const press = async (page: Page, key: 'Tab' | 'Shift+Tab', scripts = true): Promise<Stop> => {
    await page.keyboard.press(key);
    // A smooth scroll begins on the frame after the key; animation frames never come with scripts off, and the page has no smooth scroll then.
    if (scripts) await settledFrame(page);
    await scrollSettled(page); // About scrolls smoothly: wait for the scroll, then for the transitions
    await transitionsDone(page);
    return readStop(page);
  };
  /** Tab from the page's top (or from the open menu button) to the footer's last link, then Shift+Tab back to the header. */
  async function walk(page: Page, path: string, w: number, h: number, scheme: Scheme, menuOpen = false): Promise<{ forth: Stop[]; back: Stop[] }> {
    await visit(page, path, w, h, scheme);
    if (menuOpen) {
      await openMenu(page);
      await page.locator('#menu').focus();
    } else await blur(page);
    const forth: Stop[] = [];
    const last = page.locator('.site-foot a[href="/about"]');
    for (let i = 0; i < 1500; i++) {
      forth.push(await press(page, 'Tab'));
      if (await last.evaluate((a) => a === document.activeElement)) break;
    }
    const back: Stop[] = [];
    for (let i = 0; i < 1500; i++) {
      const s = await press(page, 'Shift+Tab');
      back.push(s);
      if (s.where === 'skip' || (s.where === 'head' && (menuOpen ? s.name === 'Menu' : s.name === 'TechConcepts home'))) break;
    }
    return { forth, back };
  }
  const NAMES = (stops: Stop[]): string => stops.filter((s) => s.where !== 'skip').map((s) => `${s.where}:${s.name}`).join('|');
  const tally = (stops: Stop[]) => ({ under: stops.filter((s) => s.under).length, cutFoot: stops.filter((s) => s.cutFoot).length, headerCut: stops.filter((s) => s.where === 'head' && s.cut).length, mainStops: stops.filter((s) => s.where === 'main').length });

  const WALK_PAGES: Array<{ path: string; label: string }> = [
    { path: '/about', label: 'About' },
    { path: '/does-not-exist', label: '404' },
    { path: '/tracks', label: 'Tracks' },
    { path: '/networking', label: 'networking' },
    { path: '/how-the-internet-works', label: 'how-the-internet-works' },
    { path: '/', label: 'Home' },
  ];
  for (const { path, label } of WALK_PAGES) {
    test(`44 to 49: the keyboard walk on ${label}, closed and open`, async ({ page }, testInfo) => {
      test.setTimeout(300_000);
      for (const [w, h] of SIZES_WALK) {
        for (const menuOpen of w < 960 ? [false, true] : [false]) {
          const { forth, back } = await walk(page, path, w, h, 'light', menuOpen);
          const all = [...forth, ...back];
          const t = tally(all);
          const key = `${label} ${w}x${h} ${menuOpen ? 'open' : 'closed'}`;
          // B37-H3 (D25's unit, B42, asserts these): with the menu open on Home, the demo's step radios can sit under the open header at
          // 320 x 640 and 959 x 900 (two stops each), and at 320 x 640 the Watch tab's too (one). Counted, not asserted, and only these.
          const exempt = (s: Stop): boolean => path === '/' && menuOpen && ((w === 320 && h === 640) || (w === 959 && h === 900)) && (/^Watch, step \d/.test(s.name) || (w === 320 && s.name === 'Watch part'));
          const stepsUnderMenu = all.filter((s) => s.under && exempt(s)).length;
          console.log(`WALK ${testInfo.project.name} ${key} ${JSON.stringify({ ...t, stepsUnderMenu, underNames: all.filter((s) => s.under).map((s) => s.name), stops: `${forth.length}+${back.length}`, names: NAMES(all) })}`);
          // The stops, in order, are revamp's (case 44, 49): a stop that goes missing or moves is seen here.
          expect(NAMES(all), `${key}: the stops and their order`).toBe(STOPS[key]);
          expect(forth.some((s) => s.where === 'main'), `${key}: the walk enters main`).toBe(true);
          expect(forth[forth.length - 1]!.name, key).toBe('About');
          // Soft, so a red run still walks every size and logs its counts (the report sets them against revamp's).
          expect.soft(t.headerCut, `${key}: no header stop's ring is cut`).toBe(0);
          expect.soft(t.under - stepsUnderMenu, `${key}: no stop under the header`).toBe(0);
          expect.soft(t.cutFoot, `${key}: no stop cut at the foot`).toBe(0);
        }
      }
    });
  }

  test('45: the Glossary’s walk (about 500 stops each way)', async ({ page }, testInfo) => {
    test.setTimeout(900_000);
    for (const [w, h, menuOpen] of [[320, 640, false], [320, 640, true], [375, 812, false], [375, 812, true], [960, 900, false], [1440, 900, false]] as const) {
      const { forth, back } = await walk(page, '/glossary', w, h, 'light', menuOpen);
      const all = [...forth, ...back];
      const t = tally(all);
      const key = `glossary ${w}x${h} ${menuOpen ? 'open' : 'closed'}`;
      console.log(`WALK ${testInfo.project.name} ${key} ${JSON.stringify({ ...t, stops: `${forth.length}+${back.length}`, names: NAMES(all) })}`);
      expect(forth.filter((s) => s.where === 'main').length, key).toBeGreaterThan(100);
      expect(t.headerCut, key).toBe(0);
      expect(t.under, `${key}: no stop under the header`).toBe(0);
      expect(t.cutFoot, `${key}: no stop cut at the foot`).toBe(0);
    }
  });

  test('50 and 51: the header’s own stops, in order, and into and out of the open panel', async ({ page }) => {
    const headNames = async (menuOpen: boolean, path: string, w: number): Promise<string[]> => {
      await visit(page, path, w, 900, 'light');
      if (menuOpen) {
        await openMenu(page);
        await page.locator('#menu').focus();
      } else await blur(page);
      const names: string[] = [];
      for (let i = 0; i < 14; i++) {
        const s = await press(page, 'Tab');
        if (s.where === 'main') break;
        names.push(s.where === 'skip' ? 'skip' : s.name);
      }
      return names;
    };
    const five = ['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About'];
    expect(await headNames(false, '/about', 1440)).toEqual(['skip', 'TechConcepts home', ...five, 'Switch to dark theme', 'Start learning']);
    expect(await headNames(false, '/tracks', 1440)).toEqual(['skip', 'TechConcepts home', ...five, 'Switch to dark theme']);
    expect(await headNames(false, '/about', 960)).toEqual(['skip', 'TechConcepts home', ...five, 'Switch to dark theme', 'Start learning']);
    expect(await headNames(false, '/about', 959)).toEqual(['skip', 'TechConcepts home', 'Switch to dark theme', 'Menu']);
    expect(await headNames(true, '/about', 375)).toEqual([...five, 'Start learning']);
    expect(await headNames(true, '/tracks', 375)).toEqual(five);
    // At 1440 a focused strip link's ring lies inside the header.
    await visit(page, '/about', 1440, 900, 'light');
    await page.locator('.site-nav a').first().focus();
    await page.keyboard.press('Tab');
    await transitionsDone(page);
    const ring = await page.evaluate(() => {
      const el = document.activeElement!;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const g = parseFloat(cs.outlineWidth) + parseFloat(cs.outlineOffset);
      return { top: r.top - g, bottom: r.bottom + g };
    });
    near(ring.top, 11, 0.5, 'the ring’s top');
    near(ring.bottom, 57, 0.5, 'the ring’s bottom');
    // 51: into and out of the open panel
    await visit(page, '/about', 375, 812, 'light');
    await openMenu(page);
    await page.locator('#menu').focus();
    expect((await press(page, 'Tab')).name).toBe('Tracks');
    expect((await press(page, 'Shift+Tab')).name).toBe('Menu');
    await press(page, 'Tab');
    await page.keyboard.press('Escape');
    await transitionsDone(page);
    await expect(page.locator('#menu-panel')).toBeHidden();
    await expect(page.locator('#menu')).toBeFocused();
    expect((await readStop(page)).cut).toBe(false);
  });

  test('52: the walks in dark', async ({ page }) => {
    test.setTimeout(240_000);
    for (const path of ['/about', '/tracks']) {
      const { forth, back } = await walk(page, path, 375, 812, 'dark');
      const t = tally([...forth, ...back]);
      expect(t.under, path).toBe(0);
      expect(t.headerCut, path).toBe(0);
      expect(forth.some((s) => s.where === 'main'), path).toBe(true);
    }
  });

  test('53 and 54: the ring and its corners; a click draws no ring', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const w of [1440, 375]) {
        await visit(page, '/about', w, 900, scheme);
        const focus = await tok(page, 'var(--focus)', 'outline-color');
        const sels: Array<[string, string]> = w === 1440 ? [['.site-head .brand', '4px'], ['.site-nav a', '4px'], ['#theme-toggle', '8px'], ['.head-end a.btn', '8px'], ['.site-foot .foot-grid ul a', '4px'], ['.site-foot .brand', '4px']] : [['.site-head .brand', '4px'], ['#theme-toggle', '8px'], ['#menu', '8px'], ['.site-foot .foot-grid ul a', '4px']];
        const byKeyboard = async (s: string): Promise<void> => {
          await page.locator(s).first().focus();
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          await transitionsDone(page);
        };
        for (const [s, r] of sels) {
          await byKeyboard(s);
          const c = await page.evaluate(() => {
            const cs = getComputedStyle(document.activeElement!);
            return { w: cs.outlineWidth, st: cs.outlineStyle, col: cs.outlineColor, off: cs.outlineOffset, r: cs.borderTopLeftRadius };
          });
          expect([c.w, c.st, c.off], `${s} ${w} ${scheme}`).toEqual(['2px', 'solid', '3px']);
          expect(c.col, s).toBe(focus);
          expect(c.r, `${s} ${w}`).toBe(r);
        }
        if (w === 375) {
          await openMenu(page);
          for (const s of ['#menu-panel a:not(.btn)', '#menu-panel a.btn']) {
            await byKeyboard(s);
            expect(await page.evaluate(() => getComputedStyle(document.activeElement!).borderTopLeftRadius), s).toBe(s.endsWith('a.btn') ? '8px' : '4px');
          }
        }
      }
    }
    await visit(page, '/about', 1440, 900, 'light');
    const b = await box(page, '.head-end a.btn');
    await page.mouse.move(b.left + b.width / 2, b.top + b.height / 2);
    await page.mouse.down();
    await transitionsDone(page);
    expect(await page.evaluate(() => [document.activeElement === document.querySelector('.head-end a.btn'), document.activeElement!.matches(':focus-visible')])).toEqual([true, false]);
    await page.mouse.move(5, 400);
    await page.mouse.up();
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('35 (B30, scripts off): the Lesson page’s skip link is over the header when focused', async ({ page }) => {
      for (const [w, h] of [[375, 812], [1440, 900]] as const) {
        await page.setViewportSize({ width: w, height: h });
        await page.goto(LESSON);
        await transitionsDone(page);
        await page.keyboard.press('Tab');
        await expect(page.locator('a.skip-link')).toBeFocused();
        await expect.poll(async () => Math.abs((await box(page, 'a.skip-link')).top - 8) < 0.5).toBe(true);
        await transitionsDone(page);
        const top = await page.evaluate(() => {
          const a = document.querySelector('a.skip-link')!;
          const r = a.getBoundingClientRect();
          const at = (x: number, y: number): boolean => a.contains(document.elementFromPoint(x, y));
          return { centre: at(r.left + r.width / 2, r.top + r.height / 2), tl: at(r.left + 2, r.top + 2), br: at(r.right - 2, r.bottom - 2), z: getComputedStyle(a).zIndex };
        });
        expect(top, `${w}`).toEqual({ centre: true, tl: true, br: true, z: '21' });
      }
    });

    test('55: the walk', async ({ page }) => {
      const five = ['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About'];
      for (const [path, w, h] of [['/about', 1440, 900], ['/tracks', 1440, 900], ['/about', 375, 812], ['/tracks', 375, 812]] as const) {
        await page.setViewportSize({ width: w, height: h });
        await page.goto(path);
        await transitionsDone(page);
        const names: string[] = [];
        let first: Stop | undefined;
        for (let i = 0; i < 60; i++) {
          const s = await press(page, 'Tab', false);
          if (s.where === 'main') {
            first = s;
            break;
          }
          names.push(s.where === 'skip' ? 'skip' : s.name);
        }
        expect(first, `${path} ${w}: the walk reaches main`).toBeDefined();
        expect(first!.under, `${path} ${w}: the first stop of main is not under the header`).toBe(false);
        expect(names, `${path} ${w}`).toEqual(w === 1440 ? ['skip', 'TechConcepts home', ...five, ...(path === '/about' ? ['Start learning'] : [])] : ['skip', 'TechConcepts home', 'Menu']);
        if (w === 375) {
          await page.locator('#menu').focus();
          await page.keyboard.press('Enter');
          await transitionsDone(page);
          await expect(page.locator('#menu-panel')).toBeHidden();
        }
      }
    });

    test('60: the header and the footer on the seven pages', async ({ page }) => {
      for (const path of SEVEN) {
        for (const w of [375, 1440]) {
          await page.setViewportSize({ width: w, height: 900 });
          await page.goto(path);
          await transitionsDone(page);
          near((await box(page, '.site-head')).height, 69, 0.5, `${path} ${w} header`);
          expect((await css(page, '.theme-toggle', ['display'])).display, `${path} ${w}`).toBe('none');
          if (w === 375) {
            const m = await box(page, '#menu');
            near(m.width, 44, 0.25, 'the menu button');
            near(m.height, 44, 0.25, 'the menu button');
            expect((await css(page, '#menu-panel', ['display'])).display).toBe('none');
          } else {
            near((await box(page, '.site-nav')).height, 44, 0.25, 'the strip without JS');
            if (!NO_START.includes(path)) near((await box(page, '.head-end a.btn')).height, 44, 0.25, 'Start learning without JS');
          }
          const f = await css(page, '.site-foot', ['border-top-width', 'margin-top']);
          expect([f['border-top-width'], f['margin-top']]).toEqual(['2px', w >= 721 ? '128px' : '96px']);
          expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBeNull();
        }
      }
    });

    test('20: no sideways scroll without JavaScript, at the top and the foot', async ({ page }) => {
      // pageOverflow waits two animation frames, which never come with scripts off (as not-found.spec.ts says): read the widths directly.
      const sideways = () => page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
      for (const path of SEVEN) {
        for (const w of [320, 1440]) {
          await page.setViewportSize({ width: w, height: 800 });
          await page.goto(path);
          await transitionsDone(page);
          expect(await sideways(), `${path} ${w} top`).toBe(0);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          expect(await sideways(), `${path} ${w} foot`).toBe(0);
        }
      }
    });

    test('57: dark from the system', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      for (const [path, w] of [['/about', 375], ['/about', 1440], ['/tracks', 375], ['/tracks', 1440]] as const) {
        await page.setViewportSize({ width: w, height: 900 });
        await page.goto(path);
        await transitionsDone(page);
        expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBeNull();
        expect(await css(page, '.site-head', ['background-color', 'border-bottom-color'])).toEqual({ 'background-color': GROUND.dark, 'border-bottom-color': EDGE.dark });
        expect(await css(page, '.site-nav', ['border-top-color', 'background-color'])).toEqual({ 'border-top-color': EDGE.dark, 'background-color': PAPER_DARK });
        expect(await css(page, '.site-foot', ['border-top-color', 'background-color'])).toEqual({ 'border-top-color': EDGE.dark, 'background-color': PAPER_DARK });
      }
    });
  });

  // ------------------------------------------------------------ 7. theme, the script, reduced motion

  test('56: the theme flipped by the button', async ({ page }) => {
    await visit(page, '/about', 1440, 900, 'light');
    const read = async (scheme: Scheme) => {
      await transitionsDone(page);
      expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(scheme);
      expect(await css(page, '.site-head', ['background-color', 'border-bottom-color'])).toEqual({ 'background-color': GROUND[scheme], 'border-bottom-color': EDGE[scheme] });
      expect((await css(page, '.site-nav', ['border-top-color']))['border-top-color']).toBe(EDGE[scheme]);
      expect((await css(page, '#theme-toggle', ['border-top-color']))['border-top-color']).toBe(EDGE[scheme]);
      if ((await page.locator('.head-end a.btn').count()) > 0) expect((await css(page, '.head-end a.btn', ['box-shadow']))['box-shadow']).toBe(START_SHADOW[scheme]);
      expect(await css(page, '.site-foot', ['border-top-color', 'background-color'])).toEqual({ 'border-top-color': EDGE[scheme], 'background-color': scheme === 'dark' ? PAPER_DARK : await tok(page, 'var(--cs-card)') });
    };
    await page.locator('#theme-toggle').click();
    await read('dark');
    await page.reload();
    await headerReady(page);
    await read('dark');
    await open(page, '/tracks');
    await headerReady(page);
    await read('dark');
    await page.locator('#theme-toggle').click();
    await read('light');
  });

  test('58: a saved light theme on a dark system', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('techconcepts:theme', 'light'));
    await visit(page, '/about', 1440, 900, 'dark');
    expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('light');
    expect(await css(page, '.site-head', ['background-color', 'border-bottom-color'])).toEqual({ 'background-color': GROUND.light, 'border-bottom-color': EDGE.light });
  });

  test('59: before the header’s script has run', async ({ page }) => {
    for (const scheme of SCHEMES) {
      for (const w of [375, 1440]) {
        let release: () => void = () => undefined;
        const gate = new Promise<void>((resolve) => (release = resolve));
        await page.route(/SiteHeader.*\.js/, async (route) => {
          await gate;
          await route.continue();
        });
        await page.emulateMedia({ colorScheme: scheme });
        await page.setViewportSize({ width: w, height: 812 });
        await page.goto('/about', { waitUntil: 'commit' });
        await expect(page.locator('#theme-toggle')).toBeAttached();
        await page.evaluate(() => document.fonts.ready);
        const t = await box(page, '#theme-toggle');
        near(t.width, 44, 0.25, 'theme width');
        near(t.height, 44, 0.25, 'theme height');
        await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-label', 'Switch theme');
        expect((await css(page, scheme === 'light' ? '.i-moon' : '.i-sun', ['display'])).display).not.toBe('none');
        expect((await css(page, scheme === 'light' ? '.i-sun' : '.i-moon', ['display'])).display).toBe('none');
        if (w === 375) {
          await page.locator('#menu').click();
          await expect(page.locator('#menu-panel')).toBeHidden();
          near((await box(page, '.site-head')).height, 69, 0.5, 'closed');
        }
        release();
        await headerReady(page);
        if (w === 375) {
          await page.locator('#menu').click();
          await expect(page.locator('#menu-panel')).toBeVisible();
        }
        await page.unroute(/SiteHeader.*\.js/);
      }
    }
  });

  test('61: reduced motion changes no box and nothing in the header or footer is moving', async ({ browser }) => {
    for (const w of [375, 1440]) {
      const boxes: Record<string, number[][]> = {};
      for (const motion of ['reduce', 'no-preference'] as const) {
        const ctx = await browser.newContext({ reducedMotion: motion, viewport: { width: w, height: 812 } });
        const page = await ctx.newPage();
        await open(page, '/about');
        await headerReady(page);
        if (w === 375) await openMenu(page);
        boxes[motion] = [];
        for (const s of ['.site-head .brand', '.site-nav', '.site-nav a', '#theme-toggle', '.head-end a.btn', '#menu', '#menu-panel', '#menu-panel a', '.site-foot .foot-grid ul a']) {
          boxes[motion]!.push(await page.locator(s).evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0).flatMap((r) => [r.left, r.top, r.width, r.height])));
        }
        if (w === 1440) {
          const dur = await page.evaluate(() => ({ start: getComputedStyle(document.querySelector('.head-end a.btn')!).transitionDuration, theme: getComputedStyle(document.querySelector('#theme-toggle')!).transitionDuration }));
          expect(dur.start, motion).toBe(motion === 'reduce' ? '0s' : '0.08s, 0.08s');
          expect(dur.theme, motion).toBe(motion === 'reduce' ? '0s' : '0.12s, 0.15s');
        }
        expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a.effect as KeyframeEffect | null)?.target?.closest('.site-head, .site-foot')).length), `${motion} ${w}: nothing in the header or footer is moving`).toBe(0);
        await ctx.close();
      }
      boxes.reduce!.forEach((list, i) => list.forEach((v, j) => near(v, boxes['no-preference']![i]![j]!, 0.5, `${w}: box ${i}.${j}`)));
    }
  });

  // ------------------------------------------------------------ 8. the Lesson page

  test('62: the Lesson page’s header computes today’s Patch', async ({ page }) => {
    const GROUND_88 = { light: 'color(srgb 0.894118 0.905882 0.909804 / 0.88)', dark: 'color(srgb 0.0627451 0.0745098 0.0823529 / 0.88)' } as const;
    const HAIR = { light: '1px solid rgba(18, 23, 27, 0.14)', dark: '1px solid rgba(243, 245, 246, 0.1)' } as const;
    const INSET = { light: 'rgba(18, 23, 27, 0.34) 0px 0px 0px 1px inset', dark: 'rgba(243, 245, 246, 0.26) 0px 0px 0px 1px inset' } as const;
    const UNDERLINE = { light: 'rgb(176, 70, 23) 0px -2px 0px 0px inset', dark: 'rgb(240, 112, 46) 0px -2px 0px 0px inset' } as const;
    const BTN = { light: '1px solid rgba(18, 23, 27, 0.34)', dark: '1px solid rgba(243, 245, 246, 0.26)' } as const;
    for (const scheme of SCHEMES) {
      await visit(page, LESSON, 1440, 900, scheme);
      const head = await css(page, '.site-head', ['background-color', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color']);
      expect(`${head['border-bottom-width']} ${head['border-bottom-style']} ${head['border-bottom-color']}`).toBe(HAIR[scheme]);
      expect(head['background-color']).toBe(GROUND_88[scheme]);
      near((await box(page, '.site-head')).height, 69, 0.5, 'header');
      const wrap = await css(page, '.site-head .wrap', ['height', 'padding-top']);
      expect([wrap.height, wrap['padding-top']]).toEqual(['68px', '0px']);
      near((await box(page, '.site-nav')).height, 38, 0.5, 'the pill');
      const nav = await css(page, '.site-nav', ['box-shadow', 'padding']);
      expect([nav['box-shadow'], nav.padding]).toEqual([INSET[scheme], '3px']);
      near((await box(page, '.site-nav a[href="/tracks"]')).height, 32, 0.5, 'the Tracks link');
      await expect(page.locator('.site-nav a[href="/tracks"]')).toHaveAttribute('aria-current', 'true');
      const tc = await css(page, '.site-nav a[href="/tracks"]', ['box-shadow', 'border-top-left-radius']);
      expect([tc['box-shadow'], tc['border-top-left-radius']]).toEqual([UNDERLINE[scheme], '2px']);
      expect((await css(page, '.site-nav a[href="/tracks"]', ['content'], '::before')).content).toBe('none');
      const t = await box(page, '#theme-toggle');
      near(t.width, 40, 0.5, 'theme');
      near(t.height, 40, 0.5, 'theme');
      const tt = await css(page, '#theme-toggle', ['border-top-width', 'border-top-style', 'border-top-color', 'border-top-left-radius']);
      expect(`${tt['border-top-width']} ${tt['border-top-style']} ${tt['border-top-color']}`).toBe(BTN[scheme]);
      expect(tt['border-top-left-radius']).toBe('4px');
      await expect(page.locator('.head-end a.btn')).toHaveCount(0);
      expect((await css(page, 'a.skip-link', ['z-index']))['z-index']).toBe('21');
    }
    for (const scheme of SCHEMES) {
      await visit(page, LESSON, 375, 812, scheme);
      await openMenu(page);
      await page.mouse.move(5, 700);
      await transitionsDone(page);
      expect((await css(page, '#menu', ['background-color']))['background-color']).toBe(scheme === 'light' ? 'rgb(250, 251, 250)' : PAPER_DARK);
      near((await box(page, '#menu')).width, 40, 0.5, 'menu button');
      const panel = await css(page, '#menu-panel', ['position', 'padding']);
      expect([panel.position, panel.padding]).toEqual(['absolute', '8px 16px 16px']);
      near((await box(page, '#menu-panel')).height, 260.95, 0.5, 'the panel');
      near((await box(page, '#menu-panel a')).height, 45.39, 0.5, 'a row');
      const rc = await css(page, '#menu-panel a', ['font-weight', 'font-size', 'line-height', 'font-family', 'padding']);
      expect([rc['font-weight'], rc['font-size'], rc['line-height'], rc.padding]).toEqual(['600', '17px', '20.4px', '12px 4px']);
      expect(rc['font-family']).toContain('Atkinson Hyperlegible Next');
      near((await box(page, '.site-head')).height, 69, 0.5, 'the header stays 69');
    }
  });

  // ------------------------------------------------------------ 10. weight

  test('73: the weight, and the one stylesheet (check 26, H1 answer A)', async ({ page }) => {
    // revamp's gzipped HTML (13af135), as gzipSize in scripts/check-budgets.mjs counts it.
    const BASE_GZIP: Record<string, number> = { '/': 119398, '/tracks': 59914, '/how-the-internet-works': 9133, '/networking': 10795, '/about': 52413, '/glossary': 35555, '/does-not-exist': 32310 };
    const sheets = new Set<string>();
    for (const path of SEVEN) {
      const html = await (await page.request.get(path)).text();
      const links = [...html.matchAll(/<link rel="stylesheet" href="(\/_astro\/card-stack\.[\w-]+\.css)"/g)].map((m) => m[1]!);
      expect(links, `${path}: one Card stack stylesheet`).toHaveLength(1);
      sheets.add(links[0]!);
      if (BASE_GZIP[path] !== undefined) expect(gzipSize(html), `${path} gzipped`).toBeLessThanOrEqual(BASE_GZIP[path]! + 700);
    }
    expect(sheets.size).toBe(1);
    expect((await (await page.request.get([...sheets][0]!)).text()).length, 'the Card stack stylesheet').toBeLessThan(7000);
    for (const path of [LESSON, '/how-the-internet-works/what-is-http', '/networking/subnetting']) {
      expect(await (await page.request.get(path)).text(), path).not.toMatch(/\/_astro\/card-stack\./);
    }
  });
});
