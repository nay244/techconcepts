import { expect, test, type Browser, type Page } from '@playwright/test';
import { gzipSize } from '../scripts/check-budgets.mjs';
import { clippingContainers, pageOverflow, transitionsDone } from './support';

// The 404 page in the Card stack look (job 23, D22: prototypes/d22-404.md, its cases and errata E1 to E10 in
// prototypes/d22-cases.md). Cases are numbered as there. What needs no browser (the page's words from the render, the
// figure's bytes, the style text, the diff guards) is in src/lib/not-found-page.test.ts.

/** E10: the 1440 projects and reduced-motion; every test sets its own window size and colour scheme. */
const PROJECTS = ['d1440-light', 'd1440-dark', 'reduced-motion'];
const MISSING = '/does-not-exist';
const DEEP = '/a/b/c/does-not-exist';
const SCHEMES = ['light', 'dark'] as const;
type Scheme = (typeof SCHEMES)[number];
const SIZES = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
] as const;
const SIX = [
  'Error 404',
  "That page isn't here",
  'The link may be old, or the address may have a typo.',
  'Go to Home See the tracks',
  'The server is working, but it has nothing at this address. That is what the number 404 means. Lesson 1, HTTP shows where it comes from.',
];
/** The open menu's panel, as the header renders it: the five links, then Start learning. */
const PANEL = ['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About', 'Start learning'];
const STOPS = ['Go to Home', 'See the tracks', 'Lesson 1, HTTP'];

/** The contrast reader of glossary.spec.ts: the WCAG ratio of two colours, each a CSS colour string (a canvas reads any syntax the page computes). */
const CONTRAST_JS = `
  const px = (c, over) => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 1;
    const x = cv.getContext('2d', { willReadFrequently: true });
    if (over) { x.fillStyle = over; x.fillRect(0, 0, 1, 1); }
    x.fillStyle = c; x.fillRect(0, 0, 1, 1);
    const d = x.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
  const rgb = (a) => 'rgb(' + a.join(',') + ')';
`;

test.beforeEach(async ({}, testInfo) => {
  test.skip(!PROJECTS.includes(testInfo.project.name), 'runs in the 1440 projects and reduced-motion');
});

/** Sets the window and the scheme, opens the page and waits for its fonts. */
async function visit(page: Page, path: string, width = 1440, height = 900, colorScheme: Scheme = 'light'): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ colorScheme });
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

/** A token as the page paints it, in `property`, resolved through a probe element inside `parent`. */
const probe = (page: Page, expr: string, property = 'color', parent = 'body'): Promise<string> =>
  page.evaluate(
    ([e, p, where]) => {
      const el = document.createElement('div');
      document.querySelector(where!)!.append(el);
      (el.style as unknown as Record<string, string>)[p!] = e!;
      const value = (getComputedStyle(el) as unknown as Record<string, string>)[p!]!;
      el.remove();
      return value;
    },
    [expr, property, parent],
  );

const style = (page: Page, selector: string, props: string[]): Promise<Record<string, string>> =>
  page.evaluate(
    ([sel, list]) => {
      const c = getComputedStyle(document.querySelector(sel as string)!);
      return Object.fromEntries((list as string[]).map((p) => [p, c.getPropertyValue(p)]));
    },
    [selector, props] as const,
  );

type Box = { x: number; y: number; width: number; height: number; right: number; bottom: number };
const box = (page: Page, selector: string, nth = 0): Promise<Box> =>
  page.evaluate(
    ([sel, n]) => {
      const r = document.querySelectorAll(sel as string)[n as number]!.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    },
    [selector, nth] as const,
  );
const near = (actual: number, expected: number, tolerance: number, label: string): void => {
  expect(Math.abs(actual - expected), `${label}: ${actual} is not ${expected} ± ${tolerance}`).toBeLessThanOrEqual(tolerance);
};
const BUTTONS = '.notfound__actions .btn';

// ---------------------------------------------------------------- the pages that keep Patch

test('8: the Lesson page keeps Patch: --cs-edge empty, scroll padding 69px, its first button has no shadow', async ({ page }) => {
  await visit(page, '/networking/dhcp');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-edge').trim())).toBe('');
  expect((await style(page, 'html', ['scroll-padding-top']))['scroll-padding-top']).toBe('69px');
  const shadow = await page.evaluate(() => {
    const b = document.querySelector('main .btn');
    return b === null ? 'none' : getComputedStyle(b).boxShadow;
  });
  expect(shadow).toBe('none');
});

// ---------------------------------------------------------------- 1. words and structure

test.describe('words and structure', () => {
  for (const path of [MISSING, DEEP]) {
    test(`9: the six strings, in order, and nothing else in main (${path})`, async ({ page }) => {
      await visit(page, path);
      const read = await page.evaluate(() => {
        const words = (el: Element): string => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
        const wordsEl = document.querySelector('.notfound__words')!;
        const frame = document.querySelector('.notfound')!;
        return {
          blocks: [...wordsEl.children].map(words),
          frame: [...frame.children].map((c) => c.className),
          main: [...document.querySelector('main')!.children].map((c) => c.className),
        };
      });
      expect(read.blocks).toEqual(SIX);
      expect(read.frame).toEqual(['notfound__words', 'notfound__art cs-card']);
      expect(read.main).toEqual(['wrap notfound']);
    });

    test(`11: status 404, title, description, no canonical, one h1 (${path})`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const response = await page.goto(path);
      expect(response!.status()).toBe(404);
      await expect(page).toHaveTitle('Page not found · TechConcepts');
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBe('That page does not exist. Head back to the TechConcepts home page or the tracks.');
      expect(await page.locator('link[rel="canonical"]').count()).toBe(0);
      expect(await page.locator('main h1').count()).toBe(1);
      expect(await page.locator('main h2, main h3, main h4, main h5, main h6').count()).toBe(0);
    });
  }

  test('12: three links, in order, as written; each works from the deep address', async ({ page }) => {
    await visit(page, DEEP);
    const hrefs = await page.locator('main a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(['/', '/tracks', '/how-the-internet-works/what-is-http']);
    for (const [index, path] of ['/', '/tracks', '/how-the-internet-works/what-is-http'].entries()) {
      await visit(page, DEEP);
      const [response] = await Promise.all([page.waitForResponse((r) => new URL(r.url()).pathname === path && r.request().resourceType() === 'document'), page.locator('main a').nth(index).click()]);
      expect(response.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(path);
      await expect(page.locator('h1').first()).toBeAttached();
    }
  });

  test('13: the page whole at the deep address: no error but its own 404, no failed request, the face loaded, the menu opens', async ({ page }) => {
    const errors: string[] = [];
    const failed: string[] = [];
    const assets: string[] = [];
    page.on('pageerror', (e) => errors.push(`page error: ${e.message}`));
    page.on('console', (m) => {
      // E4: the one message whose URL is the document's own address.
      if (m.type() === 'error' && !(/status of 404/.test(m.text()) && new URL(m.location().url).pathname === DEEP)) errors.push(`console error: ${m.text()} (${m.location().url})`);
    });
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('response', (r) => {
      if (new URL(r.url()).pathname.startsWith('/_astro/') && r.status() !== 200 && r.status() !== 304) assets.push(`${r.status()} ${r.url()}`);
    });
    for (const [width, height] of [[375, 812], [1440, 900]] as const) {
      await visit(page, DEEP, width, height);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-edge').trim())).not.toBe('');
      expect(await page.evaluate(() => [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Barlow Semi Condensed' && f.status === 'loaded'))).toBe(true);
      await expect(page.getByRole('img', { name: /Port 404 is empty and its light is off/ })).toBeVisible();
    }
    await visit(page, DEEP, 375, 812);
    await page.locator('#menu').click();
    await expect(page.locator('#menu-panel')).toBeVisible();
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
    expect(assets, 'every /_astro/ response is 200 (304 when the second visit is cached)').toEqual([]);
  });

  test('15: the figure has one name, and its card adds nothing a screen reader hears', async ({ page }) => {
    await visit(page, MISSING);
    const main = page.locator('main');
    expect(await main.getByRole('img').count()).toBe(1);
    await expect(main.getByRole('img')).toHaveAccessibleName(/Port 404 is empty and its light is off/);
    const card = await page.locator('.notfound__art').evaluate((el) => ['role', 'aria-label', 'tabindex'].map((a) => el.hasAttribute(a)));
    expect(card).toEqual([false, false, false]);
  });

  test('16: two scripts: the theme boot script and the header module', async ({ page }) => {
    const html = await (await page.request.get(MISSING)).text();
    const scripts = html.match(/<script\b[^>]*>/g) ?? [];
    expect(scripts).toHaveLength(2);
    expect(scripts.filter((s) => /type="module"/.test(s))).toHaveLength(1);
    expect(scripts.filter((s) => !/ src=/.test(s))).toHaveLength(1);
    expect(scripts.find((s) => /type="module"/.test(s))).toMatch(/src="\/_astro\/SiteHeader\.astro_astro_type_script_index_0_lang\.[^"]+\.js"/);
  });

  for (const size of [SIZES[1], SIZES[4]]) {
    for (const colorScheme of SCHEMES) {
      test(`17: the header and the footer are as on Tracks in style, as on About in words, at ${size.width}, ${colorScheme}`, async ({ page }) => {
        const props = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'paddingTop', 'paddingLeft', 'borderBottomWidth', 'borderBottomColor', 'borderTopColor', 'letterSpacing', 'textDecorationLine', 'textDecorationColor'] as const;
        const read = async (path: string) => {
          await visit(page, path, size.width, size.height, colorScheme);
          return page.evaluate((list) => {
            const pick = (sel: string) => {
              const c = getComputedStyle(document.querySelector(sel)!);
              return Object.fromEntries(list.map((k) => [k, c[k]]));
            };
            const links = (sel: string) => [...document.querySelectorAll(`${sel} a`)].map((a) => a.getAttribute('href'));
            const words = (sel: string) => (document.querySelector(sel) as HTMLElement).innerText.replace(/\s+/g, ' ').trim();
            return {
              styles: { head: pick('.site-head'), brand: pick('.brand'), glossary: pick('.site-head a[href="/glossary"]'), foot: pick('.site-foot'), footLink: pick('.site-foot a[href="/about"]') },
              words: { head: words('.site-head'), foot: words('.site-foot'), headLinks: links('.site-head'), footLinks: links('.site-foot') },
            };
          }, props);
        };
        const mine = await read(MISSING);
        expect(mine.styles).toEqual((await read('/tracks')).styles);
        expect(mine.words).toEqual((await read('/about')).words);
        await visit(page, MISSING, size.width, size.height, colorScheme);
        expect(await page.locator('.site-head [aria-current="page"]').count()).toBe(0);
        // Start learning: in the header's end at 1440, in the menu's panel at 375.
        if (size.width === 1440) await expect(page.locator('.head-end').getByText('Start learning')).toBeVisible();
        else await expect(page.locator('#menu-panel').getByText('Start learning')).toHaveCount(1);
      });
    }
  }
});

// ---------------------------------------------------------------- 2. look, light and dark

for (const colorScheme of SCHEMES) {
  test.describe(`the look, ${colorScheme}`, () => {
    test('19: the page reads the Card stack, here and at the deep address', async ({ page }) => {
      for (const path of [MISSING, DEEP]) {
        await visit(page, path, 1440, 900, colorScheme);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-edge').trim())).not.toBe('');
      }
    });

    test('20: the card is flat paper with a 2px hard edge', async ({ page }) => {
      await visit(page, MISSING, 1440, 900, colorScheme);
      const edge = await probe(page, 'var(--cs-edge)', 'borderTopColor');
      const c = await style(page, '.notfound__art', ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-style', 'border-left-style', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color', 'border-top-left-radius', 'background-color', 'box-shadow', 'padding-top', 'padding-left', 'overflow-x', 'overflow-y']);
      for (const side of ['top', 'right', 'bottom', 'left']) {
        expect(c[`border-${side}-width`]).toBe('2px');
        expect(c[`border-${side}-color`]).toBe(edge);
      }
      expect(c['border-top-style']).toBe('solid');
      expect(c['border-left-style']).toBe('solid');
      expect(c['border-top-left-radius']).toBe('10px');
      expect(c['background-color']).toBe(await probe(page, 'var(--cs-card)', 'backgroundColor'));
      expect(c['box-shadow']).toBe('none');
      expect([c['padding-top'], c['padding-left'], c['overflow-x'], c['overflow-y']]).toEqual(['0px', '0px', 'hidden', 'hidden']);
      const card = await box(page, '.notfound__art');
      const svg = await box(page, '.notfound__art svg');
      near(svg.width, card.width - 4, 0.5, 'svg width');
      near(svg.height, card.height - 4, 0.5, 'svg height');
    });

    test('21: the buttons at rest: 48px, 2px edge, 8px corners, 18px 600, a 3px offset edge, the filled one orange', async ({ page }) => {
      await visit(page, MISSING, 1440, 900, colorScheme);
      const edge = await probe(page, 'var(--cs-edge)', 'borderTopColor');
      const props = ['height', 'border-top-width', 'border-top-color', 'border-bottom-color', 'border-top-left-radius', 'font-size', 'font-weight', 'box-shadow', 'background-color', 'color'];
      const home = await style(page, `${BUTTONS}:nth-child(1)`, props);
      const tracks = await style(page, `${BUTTONS}:nth-child(2)`, props);
      for (const b of [home, tracks]) {
        near(parseFloat(b.height!), 48, 0.5, 'height');
        expect(b['border-top-width']).toBe('2px');
        expect(b['border-top-color']).toBe(edge);
        expect(b['border-top-left-radius']).toBe('8px');
        expect([b['font-size'], b['font-weight']]).toEqual(['18px', '600']);
        expect(b['box-shadow']).toMatch(/3px 3px 0px 0px/);
        expect(b['box-shadow']).toContain(edge);
      }
      expect(home['background-color']).toBe(await probe(page, 'var(--cs-act)', 'backgroundColor'));
      expect(home.color).toBe(await probe(page, 'var(--cs-act-ink)'));
      expect(tracks['background-color']).toBe(await probe(page, 'var(--cs-card)', 'backgroundColor'));
      expect(tracks.color).toBe(await probe(page, 'var(--ink-strong)'));
    });

    test('24: the chip: 86 by 30, a 2px edge, 6px corners, the tabs’ type, 12px above the heading', async ({ page }) => {
      await visit(page, MISSING, 1440, 900, colorScheme);
      const c = await style(page, '.notfound__code', ['height', 'width', 'padding-left', 'padding-right', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'background-color', 'color', 'font-family', 'font-weight', 'font-size', 'letter-spacing']);
      near(parseFloat(c.height!), 30, 0.5, 'height');
      near(parseFloat(c.width!), 86, 1, 'width');
      expect([c['padding-left'], c['padding-right'], c['border-top-width'], c['border-top-left-radius']]).toEqual(['10px', '10px', '2px', '6px']);
      expect(c['border-top-color']).toBe(await probe(page, 'var(--cs-edge)', 'borderTopColor'));
      expect(c['background-color']).toBe(await probe(page, 'var(--cs-card)', 'backgroundColor'));
      expect(c.color).toBe(await probe(page, 'var(--ink-strong)'));
      expect(c['font-family']).toMatch(/^"?Barlow Semi Condensed/);
      expect([c['font-weight'], c['font-size'], c['letter-spacing']]).toEqual(['600', '16px', '0.16px']);
      near((await box(page, '.notfound h1')).y - (await box(page, '.notfound__code')).bottom, 12, 1, 'chip to heading');
    });

    test('25: the link is ink, underlined in the line colour', async ({ page }) => {
      await visit(page, MISSING, 1440, 900, colorScheme);
      const c = await style(page, '.notfound__why a', ['color', 'text-decoration-line', 'text-decoration-color']);
      expect(c.color).toBe(await probe(page, 'var(--ink-strong)'));
      expect(c.color).not.toBe(await probe(page, 'var(--link)'));
      expect(c['text-decoration-line']).toBe('underline');
      expect(c['text-decoration-color']).toBe(await probe(page, 'var(--line-strong)'));
      expect((await style(page, '.notfound__why', ['color'])).color).toBe(await probe(page, 'var(--ink)'));
      await page.locator('.notfound__why a').hover();
      await transitionsDone(page);
      const hovered = await style(page, '.notfound__why a', ['color', 'text-decoration-color']);
      expect(hovered['text-decoration-color']).toBe(hovered.color);
    });

    test('26: the figure is re-tinted and still: no glow, no rings, seven orange lights, nothing animating', async ({ page }) => {
      await visit(page, MISSING, 1440, 900, colorScheme);
      const read = await page.evaluate(() => {
        const main = document.querySelector('main')!;
        const mc = getComputedStyle(main);
        return {
          pool: mc.getPropertyValue('--pool-op').trim(),
          halo: mc.getPropertyValue('--halo-op').trim(),
          orbits: [...main.querySelectorAll('.lm-orbit')].map((o) => getComputedStyle(o).display),
          animationName: getComputedStyle(main.querySelector('svg')!).animationName,
          animations: main.getAnimations({ subtree: true }).length,
          lit: [...main.querySelectorAll('.lm-led.on')].map((o) => getComputedStyle(o).filter),
        };
      });
      expect([read.pool, read.halo]).toEqual(['0', '0']);
      expect(read.orbits.length).toBeGreaterThan(0);
      expect(read.orbits.every((d) => d === 'none')).toBe(true);
      expect(read.animationName).toBe('none');
      expect(read.animations).toBe(0);
      expect(read.lit).toHaveLength(7);
      expect(read.lit.every((f) => f === 'none')).toBe(true);
      const here = await probe(page, 'var(--cs-here)', 'color', 'main');
      expect(await probe(page, 'var(--lit-a)', 'color', 'main')).toBe(here);
      expect(await probe(page, 'var(--lit-b)', 'color', 'main')).toBe(here);
    });

    test('27: contrast: words 4.5 or more on their own ground, edges 3 or more against the page', async ({ page }) => {
      await visit(page, MISSING, 1440, 900, colorScheme);
      const read = await page.evaluate((js) => {
        const make = new Function(`${js}
          const groundOf = (el) => { const chain = []; for (let e = el; e; e = e.parentElement) chain.unshift(getComputedStyle(e).backgroundColor);
            let ground = px('rgb(255,255,255)'); for (const c of chain) ground = px(c, rgb(ground)); return ground; };
          const words = (el) => { const ground = groundOf(el); return ratio(px(getComputedStyle(el).color, rgb(ground)), ground); };
          const edge = (el) => ratio(px(getComputedStyle(el).borderTopColor), groundOf(el.parentElement));
          return { words, edge };`) as () => { words: (el: Element) => number; edge: (el: Element) => number };
        const { words, edge } = make();
        const q = (s: string) => document.querySelector(s)!;
        return {
          words: Object.fromEntries(['.notfound h1', '.notfound__lede', '.notfound__code', '.notfound__actions .btn--primary', '.notfound__actions .btn:not(.btn--primary)', '.notfound__why', '.notfound__why a'].map((s) => [s, words(q(s))])),
          edges: { card: edge(q('.notfound__art')), chip: edge(q('.notfound__code')) },
        };
      }, CONTRAST_JS);
      for (const [selector, ratio] of Object.entries(read.words)) expect(ratio, selector).toBeGreaterThanOrEqual(4.5);
      for (const [name, ratio] of Object.entries(read.edges)) expect(ratio, name).toBeGreaterThanOrEqual(3);
    });
  });
}

test.describe('pressed and hover', () => {
  for (const [index, name] of ['Go to Home', 'See the tracks'].entries()) {
    test(`22: ${name} moves 2px down and right when pressed, and its offset edge closes to 1px`, async ({ page }) => {
      await visit(page, MISSING, 1440, 900, 'dark');
      const button = page.locator(BUTTONS).nth(index);
      const rest = await box(page, BUTTONS, index);
      await page.mouse.move(rest.x + rest.width / 2, rest.y + rest.height / 2);
      await page.mouse.down();
      await transitionsDone(page);
      const pressed = await box(page, BUTTONS, index);
      near(pressed.x - rest.x, 2, 0.5, 'x');
      near(pressed.y - rest.y, 2, 0.5, 'y');
      expect(await button.evaluate((el) => getComputedStyle(el).boxShadow)).toMatch(/1px 1px 0px 0px/);
      await page.mouse.move(5, 5);
      await page.mouse.up();
      await transitionsDone(page);
      const back = await box(page, BUTTONS, index);
      near(back.x - rest.x, 0, 0.5, 'x back');
      near(back.y - rest.y, 0, 0.5, 'y back');
      expect(await button.evaluate((el) => getComputedStyle(el).boxShadow)).toMatch(/3px 3px 0px 0px/);
    });
  }

  test('23: hover: the paper button turns quiet, the filled one mixes 12% of the edge in', async ({ page }) => {
    await visit(page, MISSING);
    await page.locator(BUTTONS).nth(1).hover();
    await transitionsDone(page);
    expect((await style(page, `${BUTTONS}:nth-child(2)`, ['background-color']))['background-color']).toBe(await probe(page, 'var(--cs-quiet)', 'backgroundColor'));
    await page.locator(BUTTONS).nth(0).hover();
    await transitionsDone(page);
    expect((await style(page, `${BUTTONS}:nth-child(1)`, ['background-color']))['background-color']).toBe(await probe(page, 'color-mix(in srgb, var(--cs-act) 88%, var(--cs-edge))', 'backgroundColor'));
  });
});

test.describe('dark edges (check 14)', () => {
  const edges = (page: Page) =>
    page.evaluate(() => ['.notfound__art', '.notfound__code', '.notfound__actions .btn:nth-child(1)', '.notfound__actions .btn:nth-child(2)'].map((s) => getComputedStyle(document.querySelector(s)!).borderTopColor));
  test('28: dark through the system and through the toggle: every edge is the ink, not the strong ink', async ({ page }) => {
    await visit(page, MISSING, 1440, 900, 'dark');
    const ink = await probe(page, 'var(--ink)');
    expect(ink).not.toBe(await probe(page, 'var(--ink-strong)'));
    expect(await edges(page)).toEqual([ink, ink, ink, ink]);
    await visit(page, MISSING, 1440, 900, 'light');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await transitionsDone(page);
    expect(await edges(page)).toEqual([ink, ink, ink, ink]);
  });

  test('29: dark with JavaScript off: the :root:not([data-theme]) rules carry it', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark', viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(MISSING);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.hasAttribute('data-theme'))).toBe(false);
    const ink = await probe(page, 'var(--ink)');
    expect((await edges(page))[0]).toBe(ink);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('#main .lm-svg')!).getPropertyValue('--anatomy-hi').trim())).toBe('#f3f5f6');
    await context.close();
  });
});

// ---------------------------------------------------------------- 3. width

test.describe('width', () => {
  for (const colorScheme of SCHEMES) {
    test(`30: no sideways scroll at every width from 320 to 1440, at the top and at the foot, the menu open below 960, ${colorScheme}`, async ({ page }) => {
      test.setTimeout(480_000);
      const widths = new Set<number>([860, 861, 959, 960]);
      for (let w = 320; w <= 400; w++) widths.add(w);
      for (let w = 416; w <= 1440; w += 16) widths.add(w);
      await visit(page, MISSING, 320, 700, colorScheme);
      for (const width of [...widths].sort((a, b) => a - b)) {
        await page.setViewportSize({ width, height: 700 });
        await page.evaluate(() => window.scrollTo(0, 0));
        expect((await pageOverflow(page)).sideways, `${width} top`).toBe(0);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        expect((await pageOverflow(page)).sideways, `${width} foot`).toBe(0);
        if (width < 960) {
          await page.locator('#menu').click();
          await transitionsDone(page);
          expect((await pageOverflow(page)).sideways, `${width} menu open`).toBe(0);
          await page.locator('#menu').click();
          await transitionsDone(page);
        }
      }
      for (const width of [320, 1440]) {
        await visit(page, DEEP, width, 700, colorScheme);
        expect((await pageOverflow(page)).sideways, `deep ${width}`).toBe(0);
      }
    });
  }

  test('31: the order flips at 860: one row at 861, the figure first at 860', async ({ page }) => {
    await visit(page, MISSING, 861, 900);
    const words = await box(page, '.notfound__words');
    const card = await box(page, '.notfound__art');
    expect(card.x).toBeGreaterThan(words.right);
    expect(Math.min(card.bottom, words.bottom)).toBeGreaterThan(Math.max(card.y, words.y));
    await visit(page, MISSING, 860, 900);
    expect((await box(page, '.notfound__art')).bottom).toBeLessThan((await box(page, '.notfound__code')).y);
  });

  test('32: at 1440 the card is 690 by 505, 64px under the header, the words centred on it', async ({ page }) => {
    await visit(page, MISSING, 1440, 900);
    const card = await box(page, '.notfound__art');
    const words = await box(page, '.notfound__words');
    near(card.width, 690, 1, 'card width');
    near(card.height, 505, 1, 'card height');
    near(card.x, 650, 1, 'card x');
    near(card.y - (await box(page, '.site-head')).bottom, 64, 1, 'card under the header');
    near(words.width, 493, 1, 'words width');
    near(words.x, 100, 1, 'words x');
    near(words.y + words.height / 2, card.y + card.height / 2, 1, 'centres');
    const a = await box(page, BUTTONS, 0);
    const b = await box(page, BUTTONS, 1);
    near(a.width, 131, 1, 'home width');
    near(b.width, 153, 1, 'tracks width');
    near(a.height, 48, 1, 'height');
    expect(a.y).toBe(b.y);
    near(b.x - a.right, 12, 1, 'gap');
  });

  for (const [size, widths] of [[SIZES[0], [109, 132]], [SIZES[1], [137, 159]], [SIZES[2], [144, 167]]] as const) {
    test(`33: at ${size.width} the two buttons share a row, ${widths.join(' and ')} wide, the offset edge on the column’s line`, async ({ page }) => {
      await visit(page, MISSING, size.width, size.height);
      const a = await box(page, BUTTONS, 0);
      const b = await box(page, BUTTONS, 1);
      expect(a.y).toBe(b.y);
      near(a.width, widths[0], 1, 'home');
      near(b.width, widths[1], 1, 'tracks');
      near(b.right + 3, (await box(page, '.notfound__words')).right, 0.5, 'right edge + offset');
      for (const n of [0, 1]) expect(await page.locator(BUTTONS).nth(n).evaluate((el) => [getComputedStyle(el).paddingLeft, getComputedStyle(el).paddingRight])).toEqual(['8px', '8px']);
    });
  }

  test('34: the 480px cap sits on the card, the buttons’ row and the paragraph, below 861 only', async ({ page }) => {
    await visit(page, MISSING, 768, 1024);
    const card = await box(page, '.notfound__art');
    near(card.width, 480, 1, 'card');
    near(card.height, 352, 1, 'card height');
    near(card.x, 32, 1, 'card x');
    near((await box(page, '.notfound__actions')).right, 512, 0.5, 'actions right');
    near((await box(page, BUTTONS, 0)).width, 221, 1, 'home');
    near((await box(page, BUTTONS, 1)).width, 244, 1, 'tracks');
    near((await box(page, '.notfound__why')).width, 480, 0.5, 'why');
    expect(await style(page, '.notfound__why', ['border-top-width', 'border-top-color'])).toEqual({ 'border-top-width': '1px', 'border-top-color': await probe(page, 'var(--cs-hair)', 'borderTopColor') });
    near((await box(page, '.notfound__lede')).width, 570, 1, 'lede');
    await visit(page, MISSING, 544, 900);
    near((await box(page, '.notfound__art')).width, 480, 1, '544');
    await visit(page, MISSING, 543, 900);
    near((await box(page, '.notfound__art')).width, 479, 1, '543');
    await visit(page, MISSING, 861, 900);
    near((await box(page, '.notfound__art')).width, 445, 1, '861');
  });

  test('35: the heading breaks as "That page / isn’t here" at 320 to 390 and 861 up, and sits on one line between', async ({ page }) => {
    const lines = (): Promise<{ lines: number; firstLine: boolean }> =>
      page.evaluate(() => {
        const h = document.querySelector('.notfound h1')!;
        const lineHeight = parseFloat(getComputedStyle(h).fontSize) * 0.94;
        const text = h.firstChild as Text;
        const top = (from: number, to: number): number[] => {
          const range = document.createRange();
          range.setStart(text, from);
          range.setEnd(text, to);
          return [...range.getClientRects()].map((r) => r.top);
        };
        const that = top(0, 'That page'.length);
        const rest = top('That page '.length, text.length);
        // "That page" is one box on the first line, and the rest starts on a line below it.
        return { lines: Math.round(h.getBoundingClientRect().height / lineHeight), firstLine: that.length === 1 && rest.length >= 1 && Math.min(...rest) > that[0]! + lineHeight / 2 };
      });
    for (const width of [320, 375, 390, 408, 861, 1440]) {
      await visit(page, MISSING, width, 900);
      const r = await lines();
      expect(r.lines, `${width} lines`).toBe(2);
      expect(r.firstLine, `${width} "That page" on the first line`).toBe(true);
    }
    for (const width of [409, 545, 768, 860]) {
      await visit(page, MISSING, width, 900);
      const r = await lines();
      expect(r.lines, `${width} lines`).toBe(1);
      expect(r.firstLine, `${width} one line: nothing below "That page"`).toBe(false);
    }
  });

  test('36: both ways out are on the first screen at 320 by 640', async ({ page }) => {
    await visit(page, MISSING, 320, 640);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    near((await box(page, '.notfound__actions')).bottom, 570, 4, 'actions foot');
    for (const n of [0, 1]) {
      const b = await box(page, BUTTONS, n);
      expect(b.bottom + 3).toBeLessThanOrEqual(640);
      expect(b.right + 3).toBeLessThanOrEqual(320);
    }
  });

  for (const width of [375, 1440]) {
    test(`37: the vertical rhythm at ${width}: 16 under the heading, 20 under the lede, 28 from the buttons to the rule, 16 of padding`, async ({ page }) => {
      await visit(page, MISSING, width, width === 375 ? 812 : 900);
      const h1 = await box(page, '.notfound h1');
      const lede = await box(page, '.notfound__lede');
      const actions = await box(page, '.notfound__actions');
      const why = await box(page, '.notfound__why');
      near(lede.y - h1.bottom, 16, 1, 'lede');
      near(actions.y - lede.bottom, 20, 1, 'actions');
      near(why.y - actions.bottom, 25, 1, 'why');
      near(why.y - (await box(page, BUTTONS, 0)).bottom, 28, 1, 'why from the buttons');
      expect((await style(page, '.notfound__why', ['padding-top']))['padding-top']).toBe('16px');
    });
  }

  test('38: a large type size wraps the buttons, one to a row, and does not overflow', async ({ page }) => {
    await visit(page, MISSING, 320, 640);
    await page.addStyleTag({ content: 'main .btn { font-size: 30px }' });
    const a = await box(page, BUTTONS, 0);
    const b = await box(page, BUTTONS, 1);
    expect(b.y).toBeGreaterThan(a.bottom - 1);
    const row = (await box(page, '.notfound__actions')).width - 3;
    near(a.width, row, 1, 'home');
    near(b.width, row, 1, 'tracks');
    expect((await pageOverflow(page)).sideways).toBe(0);
  });
});

// ---------------------------------------------------------------- 4. heights and weight

test.describe('heights and weight', () => {
  const HEIGHTS: Array<[number, number, number]> = [[1440, 900, 1206], [768, 1024, 1381], [390, 844, 1438], [375, 812, 1452], [320, 640, 1459]];
  test('39: the page’s height at five sizes, light and dark the same', async ({ page }) => {
    for (const [width, height, expected] of HEIGHTS) {
      const read: number[] = [];
      for (const colorScheme of SCHEMES) {
        await visit(page, MISSING, width, height, colorScheme);
        read.push(await page.evaluate(() => document.documentElement.scrollHeight));
      }
      near(read[0]!, expected, 20, `${width} light`);
      expect(read[1], `${width} dark equals light`).toBe(read[0]);
    }
  });

  test('40: the page weighs under 33,000 bytes gzipped', async ({ page }) => {
    const body = await (await page.request.get(MISSING)).text();
    const size = gzipSize(body);
    expect(size, `the 404's HTML is ${size} bytes gzipped`).toBeLessThan(33_000);
  });
});

// ---------------------------------------------------------------- 5. focus: the scroll padding

test.describe('the scroll padding', () => {
  const padding = (page: Page) => page.evaluate(() => [getComputedStyle(document.documentElement).scrollPaddingTop, getComputedStyle(document.documentElement).scrollPaddingBottom]);

  test('43: 80px above and 12px below; the open menu makes it 403px below 960; closed and Escape bring it back', async ({ page }) => {
    for (const [width, height] of [[1440, 900], [375, 812]] as const) {
      await visit(page, MISSING, width, height);
      expect(await padding(page)).toEqual(['80px', '12px']);
    }
    for (const width of [320, 375, 390, 768, 959]) {
      await visit(page, MISSING, width, 800);
      await page.locator('#menu').click();
      await transitionsDone(page);
      expect((await padding(page))[0], `${width} open`).toBe('403px');
      await page.locator('#menu').click();
      await transitionsDone(page);
      expect((await padding(page))[0], `${width} closed`).toBe('80px');
      await page.locator('#menu').click();
      await transitionsDone(page);
      await page.keyboard.press('Escape');
      await transitionsDone(page);
      expect((await padding(page))[0], `${width} escape`).toBe('80px');
      expect(await page.evaluate(() => document.activeElement?.id)).toBe('menu');
    }
    await visit(page, MISSING, 900, 800);
    await page.locator('#menu').click();
    await transitionsDone(page);
    expect((await padding(page))[0]).toBe('403px');
    await page.setViewportSize({ width: 1000, height: 800 });
    await transitionsDone(page);
    expect((await padding(page))[0]).toBe('80px');
  });

  test('44: the padding reaches only this page', async ({ page }) => {
    const at = async (path: string) => {
      await visit(page, path);
      return padding(page);
    };
    expect((await at('/'))[0]).toBe('auto');
    expect(await at('/tracks')).toEqual(['80px', 'auto']);
    expect((await at('/networking/dhcp'))[0]).toBe('69px');
    expect(await at('/about')).toEqual(['80px', '12px']);
    expect(await at('/glossary')).toEqual(['80px', '12px']);
  });

  test('45: the open header is 391px tall here', async ({ page }) => {
    for (const width of [320, 375, 390, 768]) {
      await visit(page, MISSING, width, 900);
      await page.locator('#menu').click();
      await transitionsDone(page);
      near((await box(page, '.site-head')).height, 391, 1, `${width}`);
    }
  });

  test('49: the scroll is instant', async ({ page }) => {
    await visit(page, MISSING);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  });
});

// ---------------------------------------------------------------- 6. keyboard walks

interface Stop {
  name: string;
  above: number;
  below: number;
  left: number;
  right: number;
  hit: boolean;
  outline: string[];
  clipped: string[];
}

/**
 * A real walk with Tab, then back with Shift+Tab, from `.brand` (menu closed) or from `#menu` (open): the stops in main,
 * with the clear above and below each one's ring (its box grown by 5px), and the names met in the open menu's panel.
 * The "nothing is drawn on it" read is taken at the element's first line box (E3).
 */
async function walk(page: Page, menuOpen: boolean): Promise<{ going: Stop[]; coming: Stop[]; panel: string[]; panelOpenAtEnd: boolean }> {
  if (menuOpen) {
    await page.locator('#menu').click();
    await transitionsDone(page);
    await page.locator('#menu').focus();
  } else {
    await page.locator('.site-head .brand').focus();
  }
  await transitionsDone(page);
  const panel: string[] = [];
  const read = async () => {
    const base = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const head = document.querySelector('.site-head')!.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const first = el.getClientRects()[0] ?? r;
      const hit = document.elementFromPoint(first.left + first.width / 2, first.top + 4);
      const c = getComputedStyle(el);
      const footLinks = document.querySelectorAll('.site-foot a');
      return {
        inMain: el.closest('main') !== null,
        inHead: el.closest('header') !== null,
        last: el === footLinks[footLinks.length - 1],
        panelName: el.closest('#menu-panel') !== null ? (el.textContent ?? '').trim() : null,
        stop: {
          name: (el.textContent ?? '').trim(),
          above: r.top - 5 - head.bottom,
          below: window.innerHeight - (r.bottom + 5),
          left: r.left - 5,
          right: window.innerWidth - (r.right + 5),
          hit: hit !== null && (hit === el || el.contains(hit)),
          outline: [c.outlineStyle, c.outlineWidth, c.outlineColor, c.outlineOffset, c.borderTopLeftRadius],
          clipped: [] as string[],
        } satisfies Stop,
      };
    });
    if (base.inMain) {
      // The element's box (clippingContainers) and its ring's box, the box grown by 5px: no clipping ancestor may cut either.
      const rings = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const r = el.getBoundingClientRect();
        const cut: string[] = [];
        for (let node = el.parentElement; node !== null; node = node.parentElement) {
          const c = getComputedStyle(node);
          if ([c.overflowX, c.overflowY].some((v) => v !== 'visible')) {
            const room = node.getBoundingClientRect();
            if (r.top - 5 < room.top - 0.5 || r.bottom + 5 > room.bottom + 0.5 || r.left - 5 < room.left - 0.5 || r.right + 5 > room.right + 0.5) cut.push(`ring cut by ${node.className || node.tagName}`);
          }
        }
        return cut;
      });
      base.stop.clipped = [...(await clippingContainers(page.locator(':focus'))), ...rings];
    }
    return base;
  };
  const press = async (key: string): Promise<void> => {
    await page.keyboard.press(key);
    await transitionsDone(page);
  };
  const going: Stop[] = [];
  for (let i = 0; i < 30; i++) {
    await press('Tab');
    const r = await read();
    if (r.panelName !== null) panel.push(r.panelName);
    if (r.inMain) going.push(r.stop);
    if (r.last) break;
  }
  const coming: Stop[] = [];
  for (let i = 0; i < 30; i++) {
    await press('Shift+Tab');
    const r = await read();
    if (r.inMain) coming.push(r.stop);
    if (r.inHead) break;
  }
  const panelOpenAtEnd = await page.evaluate(() => !document.querySelector('#menu-panel')!.hasAttribute('hidden'));
  return { going, coming, panel, panelOpenAtEnd };
}

function clear(stops: Stop[], label: string): void {
  for (const s of stops) {
    expect(s.above, `${label} ${s.name} clear above`).toBeGreaterThanOrEqual(0);
    expect(s.below, `${label} ${s.name} clear below`).toBeGreaterThanOrEqual(0);
    expect(s.left, `${label} ${s.name} left`).toBeGreaterThanOrEqual(0);
    expect(s.right, `${label} ${s.name} right`).toBeGreaterThanOrEqual(0);
    expect(s.hit, `${label} ${s.name} nothing drawn on it`).toBe(true);
  }
}

test.describe('keyboard walks', () => {
  for (const size of SIZES) {
    test(`46: menu closed at ${size.width}, light: three stops each way, every ring clear of the header and the window`, async ({ page }) => {
      await visit(page, MISSING, size.width, size.height);
      const w = await walk(page, false);
      expect(w.going.map((s) => s.name)).toEqual(STOPS);
      expect(w.coming.map((s) => s.name)).toEqual([...STOPS].reverse());
      clear([...w.going, ...w.coming], `${size.width}`);
    });
  }

  for (const size of SIZES.filter((s) => s.width < 960)) {
    test(`47: menu open at ${size.width}: six panel links, then three stops, to the footer and back; the panel stays open`, async ({ page }) => {
      await visit(page, MISSING, size.width, size.height);
      const w = await walk(page, true);
      expect(w.panel).toEqual(PANEL);
      expect(w.going.map((s) => s.name)).toEqual(STOPS);
      expect(w.coming.map((s) => s.name)).toEqual([...STOPS].reverse());
      clear([...w.going, ...w.coming], `${size.width} open`);
      expect(w.panelOpenAtEnd).toBe(true);
    });
  }

  test('48: the walks in dark, at 375: the same stops and reads', async ({ page }) => {
    await visit(page, MISSING, 375, 812, 'dark');
    const closed = await walk(page, false);
    expect(closed.going.map((s) => s.name)).toEqual(STOPS);
    expect(closed.coming.map((s) => s.name)).toEqual([...STOPS].reverse());
    clear([...closed.going, ...closed.coming], 'dark closed');
    await visit(page, MISSING, 375, 812, 'dark');
    const open = await walk(page, true);
    expect(open.panel).toEqual(PANEL);
    expect(open.going.map((s) => s.name)).toEqual(STOPS);
    expect(open.coming.map((s) => s.name)).toEqual([...STOPS].reverse());
    clear([...open.going, ...open.coming], 'dark open');
  });

  for (const size of [SIZES[0], SIZES[4]]) {
    for (const colorScheme of SCHEMES) {
      test(`50: each stop shows its whole 2px ring in --focus, 3px out, at ${size.width}, ${colorScheme}`, async ({ page }) => {
        await visit(page, MISSING, size.width, size.height, colorScheme);
        const focus = await probe(page, 'var(--focus)', 'outlineColor');
        const w = await walk(page, false);
        expect(w.going.map((s) => s.name)).toEqual(STOPS);
        for (const s of [...w.going, ...w.coming]) {
          expect(s.outline.slice(0, 4), s.name).toEqual(['solid', '2px', focus, '3px']);
          expect(s.clipped, s.name).toEqual([]);
        }
        for (const s of w.going.slice(0, 2)) expect(s.outline[4], s.name).toBe('8px');
      });
    }
  }

  test('51: a click draws no ring', async ({ page }) => {
    await visit(page, MISSING);
    const b = await box(page, BUTTONS, 1);
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await transitionsDone(page);
    expect(await page.evaluate(() => [document.activeElement?.textContent?.trim(), document.activeElement?.matches(':focus-visible')])).toEqual(['See the tracks', false]);
  });

  for (const size of [SIZES[0], SIZES[4]]) {
    test(`52: the skip link is the first stop and "Go to Home" the next, its ring below the header, at ${size.width}`, async ({ page }) => {
      await visit(page, MISSING, size.width, size.height);
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.textContent?.trim())).toBe('Skip to content');
      await page.keyboard.press('Enter');
      await transitionsDone(page);
      await page.keyboard.press('Tab');
      await transitionsDone(page);
      expect(await page.evaluate(() => document.activeElement?.textContent?.trim())).toBe('Go to Home');
      const [ring, head] = await page.evaluate(() => [document.activeElement!.getBoundingClientRect().top - 5, document.querySelector('.site-head')!.getBoundingClientRect().bottom]);
      expect(ring).toBeGreaterThanOrEqual(head!);
    });
  }
});

// ---------------------------------------------------------------- reduced motion

test('53: under reduced motion the page looks the same, nothing animates, and the press is not tweened', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'reduced-motion', 'compares reduced motion with no preference');
  const read = async (reducedMotion: 'reduce' | 'no-preference', width: number, height: number) => {
    const context = await browser.newContext({ reducedMotion, viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(MISSING);
    await page.evaluate(() => document.fonts.ready);
    const out = await page.evaluate(() => {
      const r = (s: string) => {
        const b = document.querySelector(s)!.getBoundingClientRect();
        return [b.x, b.y, b.width, b.height];
      };
      return {
        boxes: ['.notfound__art', '.notfound__code', '.notfound h1', '.notfound__actions .btn:nth-child(1)', '.notfound__actions .btn:nth-child(2)', '.notfound__why'].map(r),
        animations: document.querySelector('main')!.getAnimations({ subtree: true }).length,
        duration: getComputedStyle(document.querySelector('.notfound__actions .btn')!).transitionDuration,
      };
    });
    await context.close();
    return out;
  };
  for (const [width, height] of [[375, 812], [1440, 900]] as const) {
    const reduce = await read('reduce', width, height);
    const none = await read('no-preference', width, height);
    reduce.boxes.forEach((b, i) => b.forEach((v, j) => near(v, none.boxes[i]![j]!, 0.5, `${width} box ${i}`)));
    expect([reduce.animations, none.animations]).toEqual([0, 0]);
    // The site's rule sets one duration for every property, so the computed list can be one value long.
    expect(reduce.duration.split(', ').every((d) => d === '0s')).toBe(true);
    expect(none.duration).toBe('0.08s, 0.08s');
  }
});

// ---------------------------------------------------------------- JavaScript off

async function noScript(browser: Browser, width: number, height: number, path = MISSING): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height }, colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  return { page, close: () => context.close() };
}

test.describe('JavaScript off', () => {
  test('54: the page whole without JavaScript', async ({ browser }) => {
    for (const [width, height, expected] of [[320, 640, 1459], [375, 812, 1452], [1440, 900, 1206]] as const) {
      const { page, close } = await noScript(browser, width, height);
      const read = await page.evaluate(() => ({
        blocks: [...document.querySelector('.notfound__words')!.children].map((c) => (c as HTMLElement).innerText.replace(/\s+/g, ' ').trim()),
        edge: getComputedStyle(document.documentElement).getPropertyValue('--cs-edge').trim(),
        card: getComputedStyle(document.querySelector('.notfound__art')!).borderTopWidth,
        cardEdge: getComputedStyle(document.querySelector('.notfound__art')!).borderTopColor,
        shadows: [...document.querySelectorAll('.notfound__actions .btn')].map((b) => getComputedStyle(b).boxShadow),
        padding: getComputedStyle(document.documentElement).scrollPaddingTop,
        panelHidden: document.querySelector('#menu-panel')!.hasAttribute('hidden'),
        height: document.documentElement.scrollHeight,
      }));
      expect(read.blocks, `${width}`).toEqual(SIX);
      expect(read.edge).not.toBe('');
      expect(read.card).toBe('2px');
      const edge = await probe(page, 'var(--cs-edge)', 'borderTopColor');
      expect(read.cardEdge).toBe(edge);
      expect(read.shadows).toHaveLength(2);
      for (const shadow of read.shadows) {
        expect(shadow).toMatch(/3px 3px 0px 0px/);
        expect(shadow).toContain(edge);
      }
      expect([read.padding, read.panelHidden]).toEqual(['80px', true]);
      near(read.height, expected, 20, `${width} height`);
      await expect(page.locator('.site-head .theme-toggle')).toBeHidden();
      await page.evaluate(() => window.scrollTo(0, 0));
      // pageOverflow waits two animation frames, which never come with scripts off: read the widths directly.
      const sideways = () => page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
      expect(await sideways(), `${width} top`).toBe(0);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      expect(await sideways(), `${width} foot`).toBe(0);
      await close();
    }
  });

  test('55: the walk without JavaScript: the same three stops each way', async ({ browser }) => {
    for (const [width, height] of [[375, 812], [1440, 900]] as const) {
      const { page, close } = await noScript(browser, width, height);
      const w = await walk(page, false);
      expect(w.going.map((s) => s.name), `${width}`).toEqual(STOPS);
      expect(w.coming.map((s) => s.name), `${width}`).toEqual([...STOPS].reverse());
      clear([...w.going, ...w.coming], `${width} no script`);
      await close();
    }
  });

  test('56: the deep address without JavaScript: the same three hrefs, the figure, the display face', async ({ browser }) => {
    const { page, close } = await noScript(browser, 375, 812, DEEP);
    expect(await page.locator('main a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))).toEqual(['/', '/tracks', '/how-the-internet-works/what-is-http']);
    await expect(page.getByRole('img', { name: /Port 404 is empty/ })).toBeVisible();
    expect(await page.evaluate(() => [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Barlow Semi Condensed' && f.status === 'loaded'))).toBe(true);
    await close();
  });
});
