import { expect, test, type JSHandle, type Page } from '@playwright/test';
// @ts-expect-error - no @types/node in this project; the e2e files run under node
import { readFileSync } from 'node:fs';
// @ts-expect-error - no @types/node in this project; the e2e files run under node
import { gzipSync } from 'node:zlib';
import { hydrated, kicker, open, pageOverflow, settledFrame, transitionsDone } from './support';
import { tracks } from '../src/content/tracks';
import pilot from '../src/content/glossary-groups/pilot';

// The Glossary page and a term's definition in Learn (prototypes/d9-glossary.md as prototypes/d9a-glossary-independent.md amends it;
// errata E1 to E11 and B8a's E1 to E8 in plan.md). The
// data-exact parts of the page's checks (counts, every entry's words, every source link) run in Vitest
// (`src/lib/glossary-page.test.ts`), since the specs cannot load the glossary (E2); this file keeps what needs a browser,
// on the entries the spec names: ping, ttl, time-to-live, ip-address, packet-loss.

const ICMP = '/how-the-internet-works/what-is-icmp';
const ICMP_LEARN = `${ICMP}?step=7`;
const TCP_LEARN = '/how-the-internet-works/what-is-tcp?step=7';
const NINE = [
  ['“Are you there?”', 'Echo request'],
  ['“Yes, I’m here”', 'Echo reply'],
  ['The tool that sends those', 'Ping'],
  ['How long there and back', 'Latency (round-trip time)'],
  ['The hop counter on every packet', 'TTL'],
  ['“Your packet ran out of hops here”', 'Time exceeded'],
  ['Listing every router on the way', 'Traceroute'],
  ['“I can’t deliver this”', 'Destination unreachable'],
  ['Pings that never come back', 'Packet loss'],
] as const;
/** The pilot group's entry ids, from the group itself; the checks that mean the pilot filter by them, since the page holds every group's rows. */
const PILOT_IDS = pilot.entries.map((e) => e.id);
const PING_TEXT = /^Ping is a tool that sends .* were lost\.$/;

/** The page's tests run in the two 1440 projects and in `reduced-motion` (job 22, D21 cases E7); every test sets its own window size. */
const PAGE_PROJECTS = ['d1440-light', 'd1440-dark', 'reduced-motion'];
/** The Learn tests keep the two 1440 projects. */
const LEARN_PROJECTS = ['d1440-light', 'd1440-dark'];

const box = async (page: Page, selector: string) => (await page.locator(selector).first().boundingBox())!;
const top = async (page: Page, selector: string) => (await box(page, selector)).y;

test.describe('the Glossary page', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!PAGE_PROJECTS.includes(testInfo.project.name), 'runs in the 1440 projects and reduced-motion');
  });

  test('answers 200 with its title, one h1 and a stamp that links to About', async ({ page }) => {
    const response = await page.goto('/glossary');
    expect(response!.status()).toBe(200);
    await expect(page).toHaveTitle('Glossary · TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Glossary');
    const stamp = page.locator('.gl-stamp a');
    await expect(stamp).toHaveAttribute('href', '/about#facts');
    // The count is the page's own entries.
    const entries = await page.locator('.gl-entry:not(.gl-entry--see)').count();
    await expect(stamp).toHaveText(new RegExp(`^${entries} terms checked, the latest on \\d{1,2} [A-Z][a-z]{2} 20\\d\\d$`));
  });

  test('14 and 16: the page links to no lesson and no track; "Described in" rows are plain text (E5: hrefs resolved)', async ({ page }) => {
    await page.goto('/glossary');
    const ids = tracks.map((t) => t.id);
    const refused = await page.locator('main a').evaluateAll((as, ids) => as.filter((a) => {
      const u = new URL(a.getAttribute('href')!, location.href);
      if (u.origin !== location.origin) return false;
      const p = u.pathname.replace(/\/+$/, '');
      return p === '/tracks' || p.startsWith('/tracks/') || ids.some((id) => p === `/${id}` || p.startsWith(`/${id}/`));
    }).map((a) => a.outerHTML), ids);
    expect(refused).toEqual([]);
    expect(await page.locator('main a').count()).toBeGreaterThan(40);
    await expect(page.locator('#ping .gl-row--tracks')).toHaveText('Described in How the Internet Works');
    await expect(page.locator('#ping .gl-row--tracks a')).toHaveCount(0);
    await expect(page.locator('.gl-row--tracks a, .gl-row--tracks [href], .gl-row--tracks [title]')).toHaveCount(0);
    await expect(page.locator('#ip-address .gl-row--tracks')).toHaveText('Described in How the Internet Works, Networking Concepts');
    await expect(page.locator('#ttl .gl-row--tracks')).toHaveText(['Described in How the Internet Works', 'Described in How the Internet Works, Networking Concepts']);
    // The shared DNS lesson is in both tracks, so what it describes names both (E5).
    await expect(page.locator('#root-server .gl-row--tracks')).toHaveText('Described in How the Internet Works, Networking Concepts');
    await expect(page.locator('main')).not.toContainText('Taught in');
    expect(await page.locator('.gl-row').evaluateAll((rows) => rows.filter((r) => /lesson/i.test(r.textContent ?? '')).length)).toBe(0);
  });

  test('"See TTL" puts #ttl in the address and the entry under every sticky foot', async ({ page }) => {
    for (const size of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(size);
      await settle(page);
      await page.goto('/glossary');
      await page.locator('#time-to-live').getByRole('link', { name: 'TTL' }).click();
      await expect(page).toHaveURL(/\/glossary#ttl$/);
      await transitionsDone(page);
      await settledFrame(page);
      await expect(page.locator('#ttl')).toBeInViewport();
      expect(await top(page, '#ttl')).toBeGreaterThan(await stickyFoot(page));
    }
  });

  /** The foot of whatever sticks at the top: the header, and the letter's bar (below 1280px) or the keys (from 1280px). */
  async function stickyFoot(page: Page): Promise<number> {
    const header = await box(page, '.site-head');
    const wide = (page.viewportSize()?.width ?? 0) >= 1280;
    // Below 1280px the bar that sticks is the one of the letter the target is in, not the first letter's.
    const second = wide
      ? await box(page, '.gl-az')
      : (await page.evaluate(() => {
          const r = (document.querySelector(location.hash || '#ttl')!.closest('section')!.querySelector('.gl-bar') as HTMLElement).getBoundingClientRect();
          return { y: r.y, height: r.height };
        }));
    return Math.max(header.y + header.height, second.y + second.height);
  }

  test('landing on #ttl at 375 and 1440: below the sticky foot, within the first screen, tinted', async ({ page }) => {
    for (const size of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(size);
      await transitionsDone(page);
      await settledFrame(page);
      await page.goto('/glossary#ttl');
      await transitionsDone(page);
      await settledFrame(page);
      const t = await top(page, '#ttl');
      expect(t).toBeGreaterThan(await stickyFoot(page) - 1);
      expect(t).toBeLessThan(size.height);
      const [entry, body] = await Promise.all([page.locator('#ttl').evaluate((e) => getComputedStyle(e).backgroundColor), page.evaluate(() => getComputedStyle(document.body).backgroundColor)]);
      expect(entry).not.toBe(body);
      await expect(page.locator('#ttl')).toHaveCSS('box-shadow', /inset/);
    }
  });

  test('the keys are the letters that have a term, and a key lands the letter under the sticky parts', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/glossary');
    const keys = await page.locator('a.gl-key').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(keys).toEqual(await page.locator('section.gl-letter').evaluateAll((s) => s.map((x) => `#${x.id}`)));
    // 13 or more letters: the rest of A to Z is dashed (0–9 counts as one of the 13 but is not one of A to Z); fewer: none is.
    const sections = await page.locator('section.gl-letter').evaluateAll((s) => s.map((x) => x.id));
    const alphabet = sections.filter((id) => id !== 'letter-0-9').length;
    await expect(page.locator('.gl-key--none')).toHaveCount(sections.length >= 13 ? 26 - alphabet : 0);
    const last = keys[keys.length - 1]!;
    // 375: the bar of the last letter is wholly below the header's foot (69px) and within 1px of 80px (the page's scroll
    // padding; the scroll is a whole pixel while the section's top is not, so 79.5 to 80.5); Tab then focuses "All letters" in it.
    await page.locator(`a.gl-key[href="${last}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${last}$`));
    await transitionsDone(page);
    await settledFrame(page);
    const bar = (await box(page, `${last} .gl-bar`)).y;
    expect(bar).toBeGreaterThanOrEqual(68);
    expect(bar).toBeLessThanOrEqual(81);
    await page.keyboard.press('Tab');
    await transitionsDone(page);
    await settledFrame(page);
    expect(await page.evaluate(() => document.activeElement?.closest('section.gl-letter')?.id)).toBe(last.slice(1));
    expect(await page.evaluate(() => document.activeElement?.textContent)).toBe('All letters');
    // 1440: the bar is below the foot of the keys, and Tab focuses the first link inside the letter's list.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/glossary');
    await page.locator(`a.gl-key[href="${last}"]`).click();
    await transitionsDone(page);
    await settledFrame(page);
    const keysFoot = await box(page, '.gl-az');
    expect(await top(page, `${last} .gl-bar`)).toBeGreaterThanOrEqual(keysFoot.y + keysFoot.height);
    await page.keyboard.press('Tab');
    await transitionsDone(page);
    await settledFrame(page);
    const first = await page.locator(`${last} dl a`).first().evaluate((a) => a.outerHTML);
    expect(await page.evaluate(() => document.activeElement?.outerHTML)).toBe(first);
    await expect(page.locator('.gl-up').first()).toBeHidden();
  });

  test('no sideways scroll, at the top and at the foot, at every width', async ({ page }) => {
    for (const width of [320, 375, 768, 959, 960, 1280, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/glossary');
      expect((await pageOverflow(page)).sideways, `${width} top`).toBe(0);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      expect((await pageOverflow(page)).sideways, `${width} foot`).toBe(0);
    }
  });

  test('the words: no time figure on the page', async ({ page }) => {
    await page.goto('/glossary');
    await expect(page.locator('body')).not.toContainText(/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i);
  });

  test('layout: stacked at 375, beside the name at 768, a ledger of three columns at 1440', async ({ page }) => {
    const parts = async () => {
      const at = async (sel: string) => box(page, `#ping ${sel}`);
      return { name: await at('.gl-name'), def: await at('.gl-def'), src: await at('.gl-foot .gl-row:nth-child(1)'), tracks: await at('.gl-foot .gl-row--tracks') };
    };
    await page.setViewportSize({ width: 375, height: 812 });
    await transitionsDone(page);
    await settledFrame(page);
    await page.goto('/glossary');
    let p = await parts();
    expect(p.name.y).toBeLessThan(p.def.y);
    expect(p.def.y).toBeLessThan(p.src.y);
    expect(p.src.y).toBeLessThan(p.tracks.y);
    await page.setViewportSize({ width: 768, height: 900 });
    await transitionsDone(page);
    await settledFrame(page);
    p = await parts();
    expect(p.name.x).toBeLessThan(p.def.x);
    expect(Math.abs(p.name.y - p.def.y)).toBeLessThan(40);
    expect(p.src.y).toBeGreaterThan(p.def.y + p.def.height - 1);
    await page.setViewportSize({ width: 1440, height: 900 });
    await transitionsDone(page);
    await settledFrame(page);
    p = await parts();
    expect(p.name.x).toBeLessThan(p.def.x);
    expect(p.def.x).toBeLessThan(p.src.x);
    expect(Math.abs(p.name.y - p.def.y)).toBeLessThan(40);
    expect(Math.abs(p.src.y - p.def.y)).toBeLessThan(40);
    expect(p.def.width).toBeLessThanOrEqual(612.5);
    await page.setViewportSize({ width: 960, height: 900 });
    await transitionsDone(page);
    await settledFrame(page);
    expect((await box(page, '#ping dt')).width).toBeCloseTo(220, 0);
    await page.setViewportSize({ width: 1200, height: 900 });
    await transitionsDone(page);
    await settledFrame(page);
    const dd = await box(page, '#ping dd');
    expect((await box(page, '#ping dt')).width).toBeCloseTo(280, 0);
    expect((await box(page, '#ping .gl-foot')).width).toBeCloseTo(300, 0);
    expect(dd.width).toBeGreaterThan(300);
  });

  test.describe('as a touch screen', () => {
    test.use({ hasTouch: true, isMobile: true });
    for (const width of [375, 768]) {
      test(`at ${width}: every link in a row, the stamp and "All letters" are 44px or more, and no two link boxes overlap`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/glossary');
        const boxes = await page.locator('.gl-row a, .gl-stamp a, .gl-up').evaluateAll((as) => as.map((a) => [...a.getClientRects()].map((r) => ({ x: r.x, y: r.y + scrollY, w: r.width, h: r.height }))));
        // Every row link, the stamp and "All letters" (one for each letter); the page's own count, not a typed one.
        expect(boxes.length).toBe(await page.locator('.gl-row a').count() + 1 + (await page.locator('.gl-up').count()));
        expect(await page.locator('.gl-row a').count()).toBeGreaterThan(40);
        for (const rects of boxes) for (const r of rects) expect(r.h).toBeGreaterThanOrEqual(43.9);
        const flat = boxes.flat();
        for (let i = 0; i < flat.length; i++) {
          for (let j = i + 1; j < flat.length; j++) {
            const a = flat[i]!;
            const b = flat[j]!;
            const overlap = a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;
            expect(overlap, `${i} and ${j}`).toBe(false);
          }
        }
      });
    }
    for (const width of [375, 768]) {
      test(`at ${width}: each "Described in" row holds no link and is 26px on one line, 20px more for each line it wraps to`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/glossary');
        const rows = await page.locator('.gl-row--tracks').evaluateAll((els) =>
          els.map((el) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
            return { h: el.getBoundingClientRect().height, lines, links: el.querySelectorAll('a').length, id: el.closest('.gl-entry')!.id };
          }),
        );
        // The pilot's rows are 11; the page holds every group's, and the height rule is for each of them.
        expect(rows.filter((r) => PILOT_IDS.includes(r.id))).toHaveLength(11);
        for (const r of rows) {
          expect(r.links).toBe(0);
          expect(Math.abs(r.h - (26 + 20 * (r.lines - 1))), JSON.stringify(r)).toBeLessThanOrEqual(1);
        }
        const ping = rows.find((r) => r.id === 'ping')!;
        expect(ping.h).toBeCloseTo(26, 0);
        // The "(±1)" of the spec: IP address's row wraps to two lines at 375 (46px).
        if (width === 375) expect(rows.find((r) => r.id === 'ip-address')!.h).toBeCloseTo(46, 0);
      });
    }
    test('at 1024 a touch screen keeps 44px', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/glossary');
      for (const h of await page.locator('.gl-row a').evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(43.9);
    });
    test('the keys are 44px tall and at least 44px wide at 375, and "All letters" 44px', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/glossary');
      for (const r of await page.locator('a.gl-key').evaluateAll((as) => as.map((a) => a.getBoundingClientRect()))) {
        expect(r.height).toBeGreaterThanOrEqual(44);
        expect(r.width).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test('with a mouse at 1440 the links close up to 26px, a pointer’s to 34px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/glossary');
    for (const h of await page.locator('#ping .gl-row a').evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height))) expect(h).toBeCloseTo(26, 0);
    expect((await box(page, '#time-to-live .gl-row a')).height).toBeCloseTo(34, 0);
  });

  test('with a mouse at 1440 a "Described in" row is 26px (46px for IP address, two lines), 4px under the Sources row, its names --ink, 600, no underline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/glossary');
    expect((await box(page, '#ping .gl-row--tracks')).height).toBeCloseTo(26, 0);
    expect((await box(page, '#ip-address .gl-row--tracks')).height).toBeCloseTo(46, 0);
    const sources = await box(page, '#ping .gl-foot .gl-row:nth-child(1)');
    expect((await box(page, '#ping .gl-row--tracks')).y).toBeCloseTo(sources.y + sources.height + 4, 0);
    const style = await page.locator('#ping .gl-tracks').evaluate((e) => {
      const c = getComputedStyle(e);
      const also = getComputedStyle(document.querySelector('#ttl .gl-also b')!);
      return { color: c.color, ink: also.color, weight: c.fontWeight, decoration: c.textDecorationLine, label: getComputedStyle(e.previousElementSibling!).color, muted: getComputedStyle(e.closest('.gl-row')!).color };
    });
    expect(style.color).toBe(style.ink);
    expect(style.weight).toBe('600');
    expect(style.decoration).toBe('none');
    expect(style.label).toBe(style.muted);
  });

  test('without JavaScript the page is the same page: main’s HTML is equal, a key, #ttl and "See TTL" work, storage is untouched', async ({ browser, baseURL }) => {
    const viewport = { width: 1440, height: 900 };
    const on = await browser.newContext({ baseURL, viewport });
    const onPage = await on.newPage();
    await onPage.goto('/glossary');
    const html = await onPage.locator('main').innerHTML();
    await on.close();
    expect(html).not.toContain('astro-island');
    expect(html).not.toContain('<script');

    const off = await browser.newContext({ baseURL, viewport, javaScriptEnabled: false });
    const page = await off.newPage();
    await page.goto('/glossary');
    expect(await page.locator('main').innerHTML()).toBe(html);
    // The key and the landing are the browser's own.
    const last = (await page.locator('a.gl-key').last().getAttribute('href'))!;
    await page.locator(`a.gl-key[href="${last}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${last}$`));
    await page.goto('/glossary#ttl');
    expect(await top(page, '#ttl')).toBeGreaterThan(await stickyFoot(page) - 1);
    await page.goto('/glossary');
    await page.locator('#time-to-live').getByRole('link', { name: 'TTL' }).click();
    await expect(page).toHaveURL(/#ttl$/);
    expect(await top(page, '#ttl')).toBeGreaterThan(await stickyFoot(page) - 1);
    await off.close();
  });

  test('loading the page leaves localStorage as it was', async ({ page }) => {
    await page.goto('/about');
    await page.evaluate(() => localStorage.setItem('seed', '1'));
    const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
    await page.goto('/glossary');
    expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()))).toBe(before);
  });
});

// ---------------------------------------------------------------- the Card stack look (job 22, B26; prototypes/d21-glossary.md §11, prototypes/d21-cases.md)

/** The page's own gate for the Card stack tests: the two 1440 projects and reduced-motion (D21 cases E7). */
const SIZES = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
] as const;

/** A token's colour, resolved through a probe element (the computed colour is what the page paints). */
const token = (page: Page, name: string): Promise<string> =>
  page.evaluate((n) => {
    const d = document.createElement('div');
    document.body.append(d);
    d.style.color = `var(${n})`;
    const c = getComputedStyle(d).color;
    d.remove();
    return c;
  }, name);

/** Two frames, no running transition: the read that follows sees the settled page. */
const settle = async (page: Page): Promise<void> => {
  await transitionsDone(page);
  await settledFrame(page);
};

/** The foot of what is stuck at the window's top for `selector`: the header, plus the letter's bar (below 1280px) or the keys (from 1280px). */
const footFor = (page: Page, selector: string): Promise<number> =>
  page.evaluate((sel) => {
    const e = document.querySelector(sel)!;
    let foot = document.querySelector('.site-head')!.getBoundingClientRect().bottom;
    if (innerWidth >= 1280) {
      // The keys count once they are stuck under the header, not while they stand in the page's flow below the head.
      const keys = document.querySelector('.gl-az')!.getBoundingClientRect();
      if (!e.closest('.gl-az') && keys.top <= foot + 1) foot = Math.max(foot, keys.bottom);
    } else {
      const bar = e.closest('section.gl-letter')?.querySelector('.gl-bar');
      if (bar && !bar.contains(e)) foot = Math.max(foot, bar.getBoundingClientRect().bottom);
    }
    return foot;
  }, selector);

/** The WCAG contrast of two colours: each a CSS colour string, the first drawn over the second (a canvas reads any colour syntax the page computes). */
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

/** The contrast of the words in `selector` over the paper they sit on (every ancestor's background composited, root first). */
const contrastOf = (page: Page, selector: string, _wash?: boolean): Promise<number> =>
  page.evaluate(([sel, js]) => {
    const run = new Function('el', `${js}
      const chain = []; for (let e = el; e; e = e.parentElement) chain.unshift(getComputedStyle(e).backgroundColor);
      let ground = px('rgb(255,255,255)');
      for (const c of chain) ground = px(c, rgb(ground));
      const text = px(getComputedStyle(el).color, rgb(ground));
      return ratio(text, ground);`) as (el: Element) => number;
    return run(document.querySelector(sel)!);
  }, [selector, CONTRAST_JS] as const);

/** The contrast of one token over another (a token's colour is resolved as the page paints it). */
const contrastTokens = (page: Page, a: string, b: string): Promise<number> =>
  page.evaluate(([x, y, js]) => {
    const run = new Function('x', 'y', `${js}
      const probe = (n) => { const d = document.createElement('div'); document.body.append(d); d.style.color = 'var(' + n + ')'; const c = getComputedStyle(d).color; d.remove(); return c; };
      const ground = px(probe(y));
      return ratio(px(probe(x), rgb(ground)), ground);`) as (x: string, y: string) => number;
    return run(x, y);
  }, [a, b, CONTRAST_JS] as const);

test.describe('the Glossary in the Card stack look', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!PAGE_PROJECTS.includes(testInfo.project.name), 'runs in the 1440 projects and reduced-motion');
  });

  // ---- 0.2 to 0.5, G-17: what the page gains and what it must not

  test('the scroll padding is the Glossary’s alone: 80px and 12px here, auto on Home, 80px on Tracks, 69px on a lesson', async ({ page }) => {
    const padding = async (path: string) => {
      await page.goto(path);
      return page.evaluate(() => {
        const c = getComputedStyle(document.documentElement);
        return [c.scrollPaddingTop, c.scrollPaddingBottom, c.scrollBehavior];
      });
    };
    expect(await padding('/glossary')).toEqual(['80px', '12px', 'auto']);
    expect((await padding('/'))[0]).toBe('auto');
    expect((await padding('/tracks'))[0]).toBe('80px');
    expect((await padding('/networking/dhcp'))[0]).toBe('69px');
  });

  test('--cs-edge is set on /glossary and on no page that does not import the stylesheet', async ({ page }) => {
    const edge = async (path: string) => {
      await page.goto(path);
      return page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cs-edge').trim());
    };
    expect(await edge('/glossary')).not.toBe('');
    expect(await edge('/does-not-exist')).toBe('');
    expect(await edge('/networking/dhcp')).toBe('');
  });

  for (const size of [SIZES[1], SIZES[5]]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`the header and the footer are as on Tracks, at ${size.width}, ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize(size);
        await page.emulateMedia({ colorScheme });
        const read = async (path: string) => {
          await page.goto(path);
          return page.evaluate(() => {
            const props = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'paddingTop', 'paddingLeft', 'borderBottomWidth', 'borderBottomColor', 'borderTopColor', 'letterSpacing', 'textDecorationLine', 'textDecorationColor'] as const;
            const pick = (sel: string) => {
              const el = document.querySelector(sel)!;
              const c = getComputedStyle(el);
              return Object.fromEntries(props.map((k) => [k, c[k]]));
            };
            return { head: pick('.site-head'), brand: pick('.brand'), foot: pick('.site-foot'), footLink: pick('.site-foot a[href="/about"]') };
          });
        };
        expect(await read('/glossary')).toEqual(await read('/tracks'));
      });
    }
  }

  test('the skip link is the first stop, and after it the stamp is the next, its ring below the header', async ({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await page.goto('/glossary');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.textContent?.trim())).toBe('Skip to content');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await settle(page);
    expect(await page.evaluate(() => document.activeElement?.matches('.gl-stamp a'))).toBe(true);
    expect(await page.evaluate(() => document.activeElement!.getBoundingClientRect().top - 5 >= document.querySelector('.site-head')!.getBoundingClientRect().bottom)).toBe(true);
  });

  test('the stamp is 44px tall at 320 and 375, and its tick keeps --allowed-text', async ({ page }) => {
    for (const size of [SIZES[0], SIZES[1]]) {
      await page.setViewportSize(size);
      await page.goto('/glossary');
      expect((await box(page, '.gl-stamp a')).height).toBeCloseTo(44, 0);
    }
    const tick = await page.evaluate(() => {
      const t = document.querySelector('.gl-stamp .stamp svg, .gl-stamp .stamp [class*="tick"]') as Element | null;
      return t ? getComputedStyle(t).color : null;
    });
    if (tick !== null) expect(tick).toBe(await token(page, '--allowed-text'));
  });

  // ---- G-3, G-4, G-5, G-6

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`no sideways scroll at 18 widths, at the top and at the foot, ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto('/glossary');
      for (const width of [320, 359, 360, 374, 375, 390, 599, 600, 639, 640, 768, 959, 960, 1199, 1200, 1279, 1280, 1440]) {
        await page.setViewportSize({ width, height: 800 });
        await page.evaluate(() => window.scrollTo(0, 0));
        expect((await pageOverflow(page)).sideways, `${width} top`).toBe(0);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        expect((await pageOverflow(page)).sideways, `${width} foot`).toBe(0);
      }
    });
  }

  test('no sideways scroll with JavaScript off, at 320, 375 and 1440', async ({ browser, baseURL }) => {
    for (const width of [320, 375, 1440]) {
      const ctx = await browser.newContext({ baseURL, viewport: { width, height: 800 }, javaScriptEnabled: false });
      const page = await ctx.newPage();
      await page.goto('/glossary');
      // Scripts are off, so the overflow is read from the page's own numbers, polled from Node.
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${width}`).toBeLessThanOrEqual(0);
      await ctx.close();
    }
  });

  test('page height in layout 1, light, within 1%: the measures of the spec, and a short letter is not padded', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    const heights: Array<[number, number, number]> = [[1440, 900, 20300], [768, 1024, 30972], [390, 844, 43702], [375, 812, 45324], [320, 640, 52004]];
    for (const [width, height, want] of heights) {
      await page.setViewportSize({ width, height });
      await page.goto('/glossary');
      await page.evaluate(() => document.fonts.ready);
      const got = await page.evaluate(() => document.documentElement.scrollHeight);
      expect(Math.abs(got - want) / want, `${width}: ${got} against ${want}`).toBeLessThanOrEqual(0.01);
    }
    for (const [width, height, want] of [[375, 812, 94], [1440, 900, 84]] as const) {
      await page.setViewportSize({ width, height });
      await page.goto('/glossary');
      const last = (await page.locator('section.gl-letter').last().boundingBox())!.height;
      expect(Math.abs(last - want), `last letter at ${width}: ${last}`).toBeLessThanOrEqual(1);
    }
  });

  test('every key is 44px tall at every width; 44px wide or more at the widths the spec names', async ({ page }) => {
    for (const width of [320, 359, 360, 374, 375, 600, 708, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/glossary');
      const rects = await page.locator('.gl-key').evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
      expect(rects).toHaveLength(26);
      for (const r of rects) expect(r.height, `${width} tall`).toBeCloseTo(44, 0);
      // Widths from 600 to 707 are under 44px (D21 cases T2, E13: recorded, not asserted); 1280 and 1440 hold 26 in a row.
      if (![600].includes(width)) for (const r of rects) expect(r.width, `${width} wide`).toBeGreaterThanOrEqual(43.9);
    }
  });

  test('a pointer is one line: 45px at 375, 35px at 1440 with a mouse, 55px at 768; the 48 together 2,270px; "See" stays with its link at 320', async ({ page }) => {
    const line = async (id: string) =>
      page.evaluate((i) => {
        const row = document.getElementById(i)!;
        const name = row.querySelector('.gl-name')!;
        const see = row.querySelector('.gl-see')!;
        // A text baseline: where a zero-size inline-block put first in the element rests.
        const base = (el: Element) => {
          const probe = document.createElement('span');
          probe.style.cssText = 'display:inline-block;width:0;height:0';
          el.prepend(probe);
          const y = probe.getBoundingClientRect().bottom;
          probe.remove();
          return y;
        };
        return { h: row.getBoundingClientRect().height, name: base(name), see: base(see), };
      }, id);
    await page.setViewportSize(SIZES[1]);
    await page.goto('/glossary');
    const a = await line('address-resolution-protocol');
    expect(Math.abs(a.h - 45)).toBeLessThanOrEqual(1);
    expect(Math.abs(a.name - a.see)).toBeLessThanOrEqual(1);
    const total = await page.locator('.gl-entry--see').evaluateAll((els) => els.reduce((n, e) => n + e.getBoundingClientRect().height, 0));
    expect(Math.abs(total - 2270) / 2270).toBeLessThanOrEqual(0.02);
    await page.setViewportSize(SIZES[0]);
    await settle(page);
    for (const h of await page.locator('.gl-entry--see').evaluateAll((els) => els.map((e) => [e.id, e.querySelector('.gl-see')!.getClientRects().length]))) expect((h as [string, number])[1]).toBeGreaterThan(0);
    // At 320 the two longest spellings wrap to two lines (99px, as drawn); "See" and its link are one line box.
    const widest = await page.locator('.gl-entry--see').evaluateAll((els) => Math.max(...els.map((e) => e.getBoundingClientRect().height)));
    expect(widest).toBeLessThanOrEqual(100);
    await page.setViewportSize(SIZES[1]);
    await settle(page);
    // At 375 the longest wrap to 73px.
    expect(await page.locator('.gl-entry--see').evaluateAll((els) => Math.max(...els.map((e) => e.getBoundingClientRect().height)))).toBeLessThanOrEqual(74);
    await page.setViewportSize(SIZES[5]);
    await settle(page);
    expect(Math.abs((await line('address-resolution-protocol')).h - 35)).toBeLessThanOrEqual(1);
    await page.setViewportSize(SIZES[3]);
    await settle(page);
    expect(Math.abs((await line('address-resolution-protocol')).h - 55)).toBeLessThanOrEqual(1.5);
  });

  // ---- G-7: where anchors land

  for (const size of SIZES) {
    test(`a key, "See TTL" and a typed address land under every sticky foot at ${size.width}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/glossary');
      const wide = size.width >= 1280;
      const ids = await page.locator('section.gl-letter').evaluateAll((s) => s.map((x) => x.id));
      const letters = ['letter-a', 'letter-d', 'letter-j', ids[ids.length - 1]!];
      for (const id of letters) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator(`a.gl-key[href="#${id}"]`).click();
        await settle(page);
        const m = await page.evaluate((i) => {
          const bar = document.querySelector(`#${i} .gl-bar`)!.getBoundingClientRect();
          const root = document.scrollingElement!;
          return { top: bar.top, bottom: bar.bottom, ended: root.scrollTop >= root.scrollHeight - innerHeight - 1, head: document.querySelector('.site-head')!.getBoundingClientRect().bottom, keys: document.querySelector('.gl-az')!.getBoundingClientRect().bottom, h: innerHeight };
        }, id);
        const foot = wide ? Math.max(m.head, m.keys) : m.head;
        expect(m.top, `${id} bar below the foot`).toBeGreaterThanOrEqual(foot - 0.5);
        expect(m.bottom, `${id} bar in the window`).toBeLessThanOrEqual(m.h);
        if (!m.ended) expect(Math.abs(m.top - (wide ? 138 : 80)), `${id} bar at ${m.top}`).toBeLessThanOrEqual(1);
      }
      if (!wide) {
        // "All letters" in a bar brings the keys back, 84px from the top.
        await page.locator('#letter-d .gl-up').click();
        await settle(page);
        expect(Math.abs((await top(page, '#letters')) - 84)).toBeLessThanOrEqual(1);
      } else {
        await page.goto('/glossary#letters');
        await settle(page);
        expect(Math.abs((await top(page, '.gl-az')) - 68)).toBeLessThanOrEqual(1);
      }
      await page.goto('/glossary');
      await page.locator('#time-to-live').getByRole('link', { name: 'TTL' }).click();
      await settle(page);
      await expect(page).toHaveURL(/#ttl$/);
      const t = await top(page, '#ttl');
      expect(Math.abs(t - (wide ? 146 : 136)), `#ttl at ${t}`).toBeLessThanOrEqual(1);
      expect(t).toBeLessThan(size.height);
      await expect(page.locator('#ttl')).toHaveCSS('box-shadow', /inset/);
      for (const id of ['web-address', 'a-record', 'url', 'ping']) {
        await page.goto(`/glossary#${id}`);
        await settle(page);
        expect(await top(page, `#${id}`), id).toBeGreaterThanOrEqual((await footFor(page, `#${id}`)) - 0.5);
      }
    });
  }

  for (const size of [SIZES[1], SIZES[5]]) {
    test(`every entry id, every letter id and every pointer lands clear of the sticky parts at ${size.width}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto('/glossary');
      const bad = await page.evaluate(async () => {
        const raf2 = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
        const wide = innerWidth >= 1280;
        const root = document.scrollingElement!;
        const footOf = (el: Element, isLetter: boolean) => {
          let foot = document.querySelector('.site-head')!.getBoundingClientRect().bottom;
          if (wide) foot = Math.max(foot, document.querySelector('.gl-az')!.getBoundingClientRect().bottom);
          else if (!isLetter) foot = Math.max(foot, el.closest('section')!.querySelector('.gl-bar')!.getBoundingClientRect().bottom);
          return foot;
        };
        const out: string[] = [];
        const ids = [...document.querySelectorAll('.gl-entry, section.gl-letter')].map((e) => ({ id: e.id, letter: e.matches('section') }));
        for (const { id, letter } of ids) {
          location.hash = id;
          await raf2();
          const el = document.getElementById(id)!;
          const r = el.getBoundingClientRect();
          const ended = root.scrollTop >= root.scrollHeight - innerHeight - 1;
          if (!(r.top >= footOf(el, letter) - 0.5 && (r.top < innerHeight || ended))) out.push(`${id} at ${Math.round(r.top)}`);
        }
        for (const a of [...document.querySelectorAll<HTMLAnchorElement>('.gl-entry--see .gl-see a')]) {
          a.click();
          await raf2();
          const id = a.getAttribute('href')!.slice(1);
          const el = document.getElementById(id);
          if (location.hash !== `#${id}` || !el || el.getBoundingClientRect().top < footOf(el, false) - 0.5) out.push(`pointer to ${id}`);
        }
        return out;
      });
      expect(bad).toEqual([]);
    });
  }

  test('with JavaScript off a key, #ttl, #letters and the last letter land as with it on', async ({ browser, baseURL }) => {
    for (const size of [SIZES[1], SIZES[5]]) {
      const ctx = await browser.newContext({ baseURL, viewport: size, javaScriptEnabled: false });
      const page = await ctx.newPage();
      // Scripts are off, so only boxes are read (a page.evaluate waits on a page that runs nothing).
      const wide = size.width >= 1280;
      const barFoot = async (id: string) => (await box(page, `#${id} .gl-bar`)).y + (await box(page, `#${id} .gl-bar`)).height;
      const head = async () => (await box(page, '.site-head')).y + (await box(page, '.site-head')).height;
      await page.goto('/glossary#ttl');
      expect(await top(page, '#ttl')).toBeGreaterThanOrEqual(wide ? (await box(page, '.gl-az')).y + (await box(page, '.gl-az')).height - 0.5 : await barFoot('letter-t'));
      await page.goto('/glossary#letter-w');
      expect(await top(page, '#letter-w .gl-bar')).toBeGreaterThanOrEqual((await head()) - 0.5);
      await page.goto('/glossary#letters');
      expect(await top(page, '#letters')).toBeGreaterThanOrEqual(wide ? 60 : 80);
      await ctx.close();
    }
  });

  // ---- G-8: the bar (the three tests that replace the old :143)

  for (const size of [SIZES[1], SIZES[0], SIZES[2]]) {
    test.describe(`the bar at ${size.width} × ${size.height}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(size);
        await page.goto('/glossary');
      });

      test('a long letter’s bar sticks at 68px: the tallest section, its middle at the window’s top', async ({ page }) => {
        const tallest = await page.locator('section.gl-letter').evaluateAll((s) => s.reduce((a, b) => (b.getBoundingClientRect().height > a.getBoundingClientRect().height ? b : a)).id);
        await page.evaluate((id) => {
          const s = document.getElementById(id)!;
          window.scrollTo(0, s.getBoundingClientRect().top + scrollY + s.getBoundingClientRect().height / 2);
        }, tallest);
        await settle(page);
        expect(Math.abs((await top(page, `#${tallest} .gl-bar`)) - 68)).toBeLessThanOrEqual(1);
      });

      test('the last letter’s bar is reachable and works: its key puts it below the header, and its "All letters" brings the keys back', async ({ page }) => {
        const last = (await page.locator('section.gl-letter').last().getAttribute('id'))!;
        await page.locator(`a.gl-key[href="#${last}"]`).click();
        await settle(page);
        const bar = await box(page, `#${last} .gl-bar`);
        const head = await box(page, '.site-head');
        expect(bar.y).toBeGreaterThanOrEqual(head.y + head.height);
        expect(bar.y + bar.height).toBeLessThanOrEqual(size.height);
        await page.locator(`#${last} .gl-up`).click();
        await settle(page);
        await expect(page.locator('#letters')).toBeInViewport();
      });

      test('the last letter’s bar leaves with its card, and is never over another letter’s rows', async ({ page }) => {
        expect(await barLeavesBadly(page)).toEqual([]);
      });
    });
  }

  /** From 200px above the last section to the page's end in 8px steps: where the bar is, against where it should be. */
  async function barLeavesBadly(page: Page): Promise<string[]> {
    return page.evaluate(async () => {
      const raf2 = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      const section = document.querySelector('section.gl-letter:last-of-type')!;
      const bar = section.querySelector('.gl-bar')!;
      const start = section.getBoundingClientRect().top + scrollY - 200;
      const end = document.documentElement.scrollHeight - innerHeight;
      const bad: string[] = [];
      for (let y = start; y <= end + 8; y += 8) {
        window.scrollTo(0, Math.min(y, end));
        await raf2();
        const s = section.getBoundingClientRect();
        const b = bar.getBoundingClientRect();
        const stuck = s.bottom - 68 >= b.height;
        const want = stuck ? Math.max(68, s.top) : s.bottom - b.height;
        if (Math.abs(b.top - want) > 1) bad.push(`scroll ${Math.round(y)}: bar top ${b.top.toFixed(1)}, want ${want.toFixed(1)}`);
      }
      return bad;
    });
  }

  test('the bar test can fail: a bar that never leaves its section is caught, and so is a short letter asked to hold the bar', async ({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await page.goto('/glossary');
    await page.addStyleTag({ content: '.gl-bar { position: fixed !important; top: 68px !important; left: 0; right: 0 }' });
    expect((await barLeavesBadly(page)).length).toBeGreaterThan(0);
    await page.goto('/glossary');
    const last = (await page.locator('section.gl-letter').last().getAttribute('id'))!;
    await page.evaluate((id) => {
      const s = document.getElementById(id)!;
      window.scrollTo(0, s.getBoundingClientRect().top + scrollY + s.getBoundingClientRect().height / 2);
    }, last);
    await settle(page);
    expect(Math.abs((await top(page, `#${last} .gl-bar`)) - 68), 'the old :143 premise, a short letter held at 68px').toBeGreaterThan(1);
  });

  test('while a bar is stuck its rows pass under it, and the tab and rule are one piece with the card', async ({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await page.goto('/glossary');
    await page.evaluate(() => window.scrollTo(0, document.getElementById('letter-a')!.getBoundingClientRect().top + scrollY + 400));
    await settle(page);
    expect(await page.evaluate(() => !!document.elementFromPoint(20, 100)?.closest('.gl-bar'))).toBe(true);
    for (const size of [SIZES[0], SIZES[1], SIZES[3], SIZES[5]]) {
      await page.setViewportSize(size);
      await page.goto('/glossary');
      const m = await page.evaluate(() => {
        const bar = document.querySelector('#letter-a .gl-bar') as HTMLElement;
        const after = getComputedStyle(bar, '::after');
        const b = bar.getBoundingClientRect();
        const dl = document.querySelector('#letter-a dl.gl-list')!.getBoundingClientRect();
        const h2 = bar.querySelector('h2')!.getBoundingClientRect();
        return { left: b.left + parseFloat(after.left), right: b.left + parseFloat(after.left) + parseFloat(after.width), dlLeft: dl.left, dlRight: dl.right, h2Bottom: h2.bottom, barBottom: b.bottom, position: getComputedStyle(bar).position, top: getComputedStyle(bar).top, up: getComputedStyle(bar.querySelector('.gl-up')!).display };
      });
      expect(m.left, `${size.width} left`).toBeCloseTo(m.dlLeft, 0);
      expect(m.right, `${size.width} right`).toBeCloseTo(m.dlRight, 0);
      expect(m.h2Bottom).toBeCloseTo(m.barBottom, 0);
      if (size.width >= 1280) {
        expect(m.position).toBe('relative');
        expect(m.up).toBe('none');
      } else {
        expect(m.position).toBe('sticky');
        expect(m.top).toBe('68px');
      }
    }
  });

  // ---- G-11: scroll padding and the open header

  test('with the menu open the scroll padding is 403px and the header 391px, below 960px; Escape closes it', async ({ page }) => {
    for (const width of [320, 375, 390, 768, 959]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/glossary');
      await page.click('#menu');
      await settle(page);
      expect(Math.abs((await box(page, '.site-head')).height - 391), `${width} header`).toBeLessThanOrEqual(1);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop), `${width}`).toBe('403px');
      await page.keyboard.press('Escape');
      await settle(page);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop), `${width} closed`).toBe('80px');
    }
  });

  test('the 403px padding does not outlive the menu on a wide window (an open menu at 900, the window widened to 1200)', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/glossary');
    await page.click('#menu');
    await settle(page);
    await page.setViewportSize({ width: 1200, height: 800 });
    await settle(page);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe('80px');
  });

  test('with JavaScript off the padding is 80px and the menu button does nothing', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ baseURL, viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/glossary');
    await page.click('#menu');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe('80px');
    await ctx.close();
  });

  // ---- G-12: colour and edges

  for (const view of [
    { name: '1440 light', size: SIZES[5], colorScheme: 'light', js: true },
    { name: '375 light', size: SIZES[1], colorScheme: 'light', js: true },
    { name: '1440 dark', size: SIZES[5], colorScheme: 'dark', js: true },
    { name: '375 dark', size: SIZES[1], colorScheme: 'dark', js: true },
    { name: '1440 dark, JavaScript off', size: SIZES[5], colorScheme: 'dark', js: false },
  ] as const) {
    test(`the parts wear the Card stack: links, edges, keys, the tab, the note; ${view.name}`, async ({ browser, baseURL }) => {
      const ctx = await browser.newContext({ baseURL, viewport: view.size, colorScheme: view.colorScheme, javaScriptEnabled: view.js, reducedMotion: 'no-preference' });
      const page = await ctx.newPage();
      await page.goto('/glossary');
      const t = {
        edge: await token(page, '--cs-edge'),
        ink: await token(page, '--ink'),
        strong: await token(page, '--ink-strong'),
        link: await token(page, '--link'),
        hair: await token(page, '--cs-hair'),
        card: await token(page, '--cs-card'),
        muted: await token(page, '--muted'),
      };
      if (view.colorScheme === 'dark') expect(t.edge).toBe(t.ink);
      const s = await page.evaluate(() => {
        const g = (sel: string, pseudo?: string) => getComputedStyle(document.querySelector(sel)!, pseudo);
        const src = g('#ping a.gl-src');
        const see = g('#time-to-live .gl-see a');
        const list = g('#letter-a dl.gl-list');
        const tab = g('#letter-a .gl-bar h2');
        const key = g('a.gl-key');
        const none = g('span.gl-key--none');
        const rule = g('#letter-a .gl-bar', '::after');
        const name = g('#ping .gl-name');
        const up = document.querySelector('.gl-up');
        const underline = (c: CSSStyleDeclaration) => ({ line: c.textDecorationLine, lineColor: c.textDecorationColor, thickness: c.textDecorationThickness, offset: c.textUnderlineOffset });
        return {
          src: { ...underline(src), color: src.color },
          see: { ...underline(see), color: see.color },
          up: up && getComputedStyle(up).display !== 'none' ? { ...underline(getComputedStyle(up)), color: getComputedStyle(up).color } : null,
          list: [list.borderLeftWidth, list.borderRightWidth, list.borderBottomWidth, list.borderTopWidth, list.borderLeftStyle, list.borderLeftColor, list.borderBottomColor, list.borderBottomLeftRadius, list.borderBottomRightRadius, list.backgroundColor],
          tab: [tab.borderLeftWidth, tab.borderRightWidth, tab.borderTopWidth, tab.borderBottomWidth, tab.borderTopColor, tab.borderTopLeftRadius, tab.borderTopRightRadius, tab.backgroundColor],
          key: [key.borderTopWidth, key.borderTopColor, key.borderTopLeftRadius, key.backgroundColor, key.borderTopStyle],
          none: [none.borderTopStyle, none.backgroundColor, none.color, none.borderTopColor],
          rule: [rule.backgroundColor, rule.height],
          name: [name.borderTopWidth, name.backgroundColor],
          note: g('.gl-note').color,
        };
      });
      for (const link of [s.src, s.see, ...(s.up ? [s.up] : [])]) {
        expect(link.color).toBe(t.strong);
        expect(link.color).not.toBe(t.link);
        expect(link.line).toContain('underline');
        expect(link.lineColor).toBe(t.hair);
        expect(link.thickness).toBe('1.5px');
        expect(link.offset).toBe('3px');
      }
      expect(s.src.color).toBe(t.strong);
      for (const link of [s.src, s.see]) expect(link.color).toBe(t.strong);
      expect(s.src.color).not.toBe(t.link);
      expect(s.list.slice(0, 4)).toEqual(['2px', '2px', '2px', '0px']);
      expect(s.list[4]).toBe('solid');
      expect(s.list[5]).toBe(t.edge);
      expect(s.list[6]).toBe(t.edge);
      expect(s.list.slice(7, 9)).toEqual(['10px', '10px']);
      expect(s.tab.slice(0, 3)).toEqual(['2px', '2px', '2px']);
      expect(s.tab[3]).toBe('0px');
      expect(s.tab[4]).toBe(t.edge);
      expect(s.tab.slice(5, 7)).toEqual(['8px', '8px']);
      expect(s.tab[7]).toBe(t.card);
      expect(s.list[9]).toBe(t.card);
      expect(s.key[0]).toBe('2px');
      expect(s.key[1]).toBe(t.edge);
      expect(s.key[2]).toBe('8px');
      expect(s.key[3]).toBe(t.card);
      expect(s.none[0]).toBe('dashed');
      expect(s.none[1]).toBe('rgba(0, 0, 0, 0)');
      expect(s.none[2]).toBe(t.muted);
      expect(s.rule).toEqual([t.edge, '2px']);
      expect(s.name).toEqual(['0px', 'rgba(0, 0, 0, 0)']);
      expect(s.note).toBe(t.ink);
      // The underline's own colour: --cs-hair, on a source link, a pointer's link and "All letters".
      expect(await page.evaluate(() => getComputedStyle(document.querySelector('#ping a.gl-src')!).textDecorationColor)).toBe(t.hair);
      expect(await page.evaluate(() => getComputedStyle(document.querySelector('#time-to-live .gl-see a')!).textDecorationColor)).toBe(t.hair);
      if (s.up) expect(await page.evaluate(() => getComputedStyle(document.querySelector('.gl-up')!).textDecorationColor)).toBe(t.hair);
      await ctx.close();
    });
  }

  test('a link’s underline turns to the words’ colour on hover; a key turns --cs-quiet, moves 1px when pressed, and has no transition', async ({ page }, testInfo) => {
    // Under reduced motion every change runs a 0.01ms transition (global.css), so a read before the wait can see one: the running-transition reads are the 1440 projects'.
    const running = testInfo.project.name !== 'reduced-motion';
    await page.setViewportSize(SIZES[1]);
    await page.goto('/glossary');
    for (const sel of ['#ping a.gl-src', '#time-to-live .gl-see a', '#letter-a .gl-up']) {
      await page.locator(sel).first().scrollIntoViewIfNeeded();
      await page.locator(sel).first().hover();
      await settle(page);
      const m = await page.locator(sel).first().evaluate((e) => ({ line: getComputedStyle(e).textDecorationColor, color: getComputedStyle(e).color }));
      expect(m.line, sel).toBe(m.color);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const key = page.locator('a.gl-key').nth(3);
    await key.hover();
    // Read before the wait: a transition left on the key is running now and gone after the wait.
    if (running) expect(await key.evaluate((e) => e.getAnimations().length), 'no transition on hover').toBe(0);
    await settle(page);
    expect(await key.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(await token(page, '--cs-quiet'));
    expect(await key.evaluate((e) => e.getAnimations().length)).toBe(0);
    await page.mouse.down();
    if (running) expect(await key.evaluate((e) => e.getAnimations().length), 'no transition when pressed').toBe(0);
    await settle(page);
    expect(await key.evaluate((e) => getComputedStyle(e).transform)).toBe('matrix(1, 0, 0, 1, 1, 1)');
    expect(await key.evaluate((e) => e.getAnimations().length)).toBe(0);
    await page.mouse.up();
  });

  test('landed on: the row’s paper turns --cs-here-wash and a 4px --cs-here bar runs down its left edge', async ({ page }) => {
    await page.goto('/glossary#ttl');
    await settle(page);
    const here = await token(page, '--cs-here');
    const wash = await token(page, '--cs-here-wash');
    const m = await page.locator('#ttl').evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, shadow: getComputedStyle(e).boxShadow }));
    expect(m.bg).toBe(wash);
    expect(m.shadow).toBe(`${here} 4px 0px 0px 0px inset`);
  });

  // ---- G-13: contrast, from what is drawn

  for (const colorScheme of ['light', 'dark'] as const) {
    for (const size of [SIZES[1], SIZES[5]]) {
      test(`contrast: every pair of the spec's §8 holds, ${size.width}, ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize(size);
        await page.emulateMedia({ colorScheme });
        await page.goto('/glossary');
        await page.evaluate(() => document.fonts.ready);
        await settle(page);
        const run = (sel: string, wash?: boolean) => contrastOf(page, sel, wash);
        const light = colorScheme === 'light';
        const rows: Array<[string, string, number, boolean?]> = [
          ['h1, the lead', 'h1', light ? 14.51 : 17.05],
          ['', '.gl-lead', light ? 14.51 : 17.05],
          ['the note', '.gl-note', light ? 10.45 : 11.59],
          ['the stamp', '.gl-stamp a', light ? 10.45 : 11.59],
          ['a key', 'a.gl-key', light ? 17.39 : 15.34],
          ['the tab', '#letter-a .gl-bar h2', light ? 17.39 : 15.34],
          ['a term', '#ping .gl-name', light ? 17.39 : 15.34],
          ['a definition', '#ping .gl-def', light ? 17.39 : 15.34],
          ['a source link', '#ping a.gl-src', light ? 17.39 : 15.34],
          ['a pointer’s link', '#address-resolution-protocol .gl-see a', light ? 17.39 : 15.34],
          ['an empty key', 'span.gl-key--none > span[aria-hidden]', light ? 5.03 : 6.83],
          ['Also called', '#ttl .gl-also', light ? 6.02 : 6.14],
          ['Sources', '#ping .gl-row .gl-label', light ? 6.02 : 6.14],
          ['the spellings', '#ttl .gl-also b', light ? 12.53 : 10.43],
          ['the tracks', '#ping .gl-tracks', light ? 12.53 : 10.43],
          ['All letters, the bar', '.gl-up', light ? 14.51 : 17.05],
        ];
        for (const [name, sel, want] of rows) {
          if (sel === '.gl-up' && size.width >= 1280) continue;
          const got = await run(sel);
          expect(got, `${name || sel}: ${got.toFixed(2)} against ${want}`).toBeGreaterThanOrEqual(want - 0.1);
        }
        // Every word on the first three letters' cards, and the head, reads at 4.5:1 or more.
        const words = await page.evaluate(() => [...document.querySelectorAll('.gl-head *, #letter-a *, #letter-d *, #letters *')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? '').trim() !== '') && e.getClientRects().length > 0 && !e.closest('.sr-only')).map((e, i) => { e.setAttribute('data-ct', String(i)); return i; }));
        let lowest = 99;
        for (const i of words) lowest = Math.min(lowest, await run(`[data-ct="${i}"]`));
        expect(lowest).toBeGreaterThanOrEqual(4.5);
        // Not words: the edges against the ground at 3:1, the focus ring on the ground, the card and the wash.
        for (const [a, b] of [['--cs-edge', '--ground'], ['--focus', '--ground'], ['--focus', '--cs-card'], ['--cs-here', '--cs-card']] as const) {
          expect(await contrastTokens(page, a, b), `${a} on ${b}`).toBeGreaterThanOrEqual(3);
        }
        await page.goto('/glossary#ttl');
        await settle(page);
        for (const [sel, want] of [['#ttl .gl-name', light ? 15.08 : 12.87], ['#ttl .gl-def', light ? 15.08 : 12.87], ['#ttl a.gl-src', light ? 15.08 : 12.87], ['#ttl .gl-tracks', light ? 10.86 : 8.75], ['#ttl .gl-also', light ? 5.22 : 5.15], ['#ttl .gl-row .gl-label', light ? 5.22 : 5.15]] as const) {
          const got = await run(sel);
          // The wash is blended over the card paper it sits on, as drawn: the spec's figures are 0.12 higher for the name and the definition.
          expect(got, `landed on ${sel}: ${got.toFixed(2)}`).toBeGreaterThanOrEqual(want - 0.2);
        }
        expect(await contrastTokens(page, '--focus', '--cs-here-wash')).toBeGreaterThanOrEqual(3);
      });
    }
  }

  test('a mouse click on a source link and on a key draws no focus ring (:focus-visible only)', async ({ page }) => {
    await page.setViewportSize(SIZES[1]);
    await page.goto('/glossary');
    for (const sel of ['a.gl-key', '#ping a.gl-src']) {
      const link = page.locator(sel).first();
      await link.scrollIntoViewIfNeeded();
      // The click is held back from following the link (a source would open a tab and take the focus away); the mouse press still focuses it.
      await link.evaluate((e) => e.addEventListener('click', (ev) => ev.preventDefault()));
      await link.click();
      await settle(page);
      expect(await link.evaluate((e) => [e === document.activeElement, getComputedStyle(e).outlineStyle])).toEqual([true, 'none']);
    }
  });

  // ---- the keyboard: checks 9 and 10, cases K-1 and K-2

  for (const size of [SIZES[0], SIZES[1], SIZES[2], SIZES[3], SIZES[5]]) {
    for (const menu of size.width < 960 ? [false, true] : [false]) {
      test(`keyboard at ${size.width} × ${size.height}, menu ${menu ? 'open' : 'closed'}: no ring under the header, a stuck bar or the keys, none cut by the window's foot`, async ({ page }) => {
        test.setTimeout(240_000);
        await page.setViewportSize(size);
        await page.goto('/glossary');
        if (menu) {
          await page.click('#menu');
          await settle(page);
        }
        const failures: string[] = [];
        const names = await page.locator('section.gl-letter').evaluateAll((s) => s.map((x) => x.id));
        const lastId = names[names.length - 1]!;
        const nextOf = (id: string) => names[names.indexOf(id) + 1];
        const prevOf = (id: string) => names[names.indexOf(id) - 1];
        const visibleLinks = (id: string) => page.evaluate((i) => [...document.querySelectorAll(`#${i} a`)].filter((a) => a.getClientRects().length > 0).length, id);
        const stopHandle = (id: string, which: 'first' | 'last') =>
          page.evaluateHandle(([i, w]) => {
            const links = [...document.querySelectorAll(`#${i} a`)].filter((a) => a.getClientRects().length > 0);
            return w === 'first' ? links[0]! : links[links.length - 1]!;
          }, [id, which] as const);
        const press = async (key: string) => {
          await page.keyboard.press(key);
          await settle(page);
        };
        /** Reads the focused stop: nothing when it is outside main, else what is wrong with it. */
        const readStop = () =>
          page.evaluate(() => {
            const e = document.activeElement as HTMLElement;
            if (!e || !e.closest('main')) return null;
            const cs = getComputedStyle(e);
            const grow = Math.max(0, (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0));
            const r = e.getBoundingClientRect();
            let foot = document.querySelector('.site-head')!.getBoundingClientRect().bottom;
            if (innerWidth >= 1280) {
              const keys = document.querySelector('.gl-az')!.getBoundingClientRect();
              if (!e.closest('.gl-az') && keys.top <= foot + 1) foot = Math.max(foot, keys.bottom);
            } else {
              const bar = e.closest('section.gl-letter')?.querySelector('.gl-bar');
              if (bar && !bar.contains(e)) foot = Math.max(foot, bar.getBoundingClientRect().bottom);
            }
            const hit = document.elementFromPoint(r.left + Math.min(r.width / 2, 12), r.top + 4);
            const name = (e.textContent ?? '').trim().slice(0, 24) || e.className;
            const problems: string[] = [];
            if (r.top - grow < foot - 0.01) problems.push(`ring top ${(r.top - grow).toFixed(1)} under the foot ${foot.toFixed(1)}`);
            if (r.bottom + grow > innerHeight + 0.01) problems.push(`ring foot ${(r.bottom + grow).toFixed(1)} below the window ${innerHeight}`);
            if (!hit || !(e === hit || e.contains(hit))) problems.push('something else is drawn over its top edge');
            return { name, problems };
          });
        /** Presses `key` until `target` has focus; every stop in main is read. Returns how many stops in main it passed (the target included). */
        const walk = async (key: string, target: JSHandle, label: string, limit: number) => {
          let stops = 0;
          for (let i = 0; i < limit; i += 1) {
            await press(key);
            const stop = await readStop();
            if (stop) {
              stops += 1;
              if (stop.problems.length) failures.push(`${label}: "${stop.name}" ${stop.problems.join('; ')}`);
            }
            if (await target.evaluate((el: Element) => el === document.activeElement)) return stops;
          }
          failures.push(`${label}: never reached its end in ${limit} presses`);
          return stops;
        };
        const focusHandle = async (h: JSHandle) => {
          await h.evaluate((el: HTMLElement) => el.focus());
          await settle(page);
        };

        // The way into main: from the header (the open menu's links first) to the stamp.
        const stamp = await page.locator('.gl-stamp a').elementHandle();
        await page.locator(menu ? '#menu' : '.site-head .brand').focus();
        let entered = 0;
        while (!(await page.evaluate(() => document.activeElement?.closest('main') !== null && document.activeElement?.closest('main') !== undefined)) && entered < 14) {
          await press('Tab');
          entered += 1;
        }
        expect(await stamp!.evaluate((el) => el === document.activeElement), 'the stamp is the first stop in main').toBe(true);
        const stampStop = await readStop();
        if (stampStop?.problems.length) failures.push(`the stamp ${stampStop.problems.join('; ')}`);
        const firstOfB = await stopHandle(nextOf(names[0]!)!, 'first');
        const letterA = await visibleLinks(names[0]!);
        // (a) the stamp, the keys and A, to B's first stop.
        expect(await walk('Tab', firstOfB, 'forward through A', letterA + 22 + 6), 'stops from the stamp to B').toBe(20 + letterA + 1);
        // (a') and back, from B's first stop to the stamp.
        await focusHandle(firstOfB);
        expect(await walk('Shift+Tab', stamp!, 'back through A', letterA + 22 + 6), 'stops from B back to the stamp').toBe(letterA + 20 + 1);
        for (const id of ['letter-d', 'letter-j', lastId]) {
          const own = await visibleLinks(id);
          const before = await stopHandle(prevOf(id)!, 'last');
            await focusHandle(before);
          if (id === lastId) {
            const foot = await page.locator('.site-foot a').first().elementHandle();
            expect(await walk('Tab', foot!, `forward through ${id}`, own + 4), `${id} stops to the footer`).toBe(own + 0);
            await focusHandle(foot!);
            expect(await walk('Shift+Tab', before, `back through ${id}`, own + 4), `${id} stops back`).toBe(own + 1);
          } else {
            const after = await stopHandle(nextOf(id)!, 'first');
            expect(await walk('Tab', after, `forward through ${id}`, own + 4), `${id} stops forward`).toBe(own + 1);
            await focusHandle(after);
            expect(await walk('Shift+Tab', before, `back through ${id}`, own + 4), `${id} stops back`).toBe(own + 1);
          }
        }
        expect(failures).toEqual([]);
      });
    }
  }

  // ---- the page's weight and markup, from the built files

  test('the built page: `main` has no script and no component styling hook, two scripts in all, 36 KB gzipped at most', () => {
    const html = readFileSync('dist/glossary/index.html', 'utf8') as string;
    const main = /<main[\s\S]*<\/main>/.exec(html)![0];
    expect(main).not.toContain('<script');
    expect(main).not.toContain('astro-island');
    expect(main).not.toContain('data-astro-cid');
    for (const part of ['gl-az__all', 'gl-key--all', 'gl-key--first']) expect(main, part).not.toContain(part);
    expect(html.match(/<script/g)?.length).toBe(2);
    const gz = (gzipSync(html) as { length: number }).length;
    expect(gz, `${gz} bytes`).toBeLessThanOrEqual(36_000);
  });
});

// ---------------------------------------------------------------- a term's definition in Learn

const terms = (page: Page) => page.getByRole('list', { name: 'Terms' });
const termButton = (page: Page, name: string) => terms(page).getByRole('button', { name, exact: true });

async function learn(page: Page, path = ICMP_LEARN): Promise<void> {
  await page.goto(path);
  await hydrated(page);
  await expect(kicker(page)).toHaveText(/Learn$/);
}
/** The definition a name's button controls. */
const definition = (page: Page, name: string) => page.locator('.explain__terms > li', { has: page.getByRole('button', { name, exact: true }) }).locator('.explain__def');
const rect = (page: Page, selector: string) => page.locator(selector).first().evaluate((e) => {
  const r = e.getBoundingClientRect();
  return [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 10) / 10);
});

test.describe('Learn with definitions', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!LEARN_PROJECTS.includes(testInfo.project.name), 'runs in the 1440 projects');
  });

  test('25: the nine ideas and the nine names are today’s, in order, each idea with its source numbers', async ({ page }) => {
    await learn(page);
    const rows = terms(page).locator('> li');
    await expect(rows).toHaveCount(9);
    for (const [i, [idea, name]] of NINE.entries()) {
      await expect(rows.nth(i).locator('.explain__idea')).toContainText(idea);
      expect((await rows.nth(i).locator('.explain__idea').evaluate((e) => e.firstChild?.textContent)) ?? '').toBe(idea);
      await expect(rows.nth(i).locator('.explain__term')).toHaveText(name);
      expect(await rows.nth(i).locator('.explain__marks a').count(), name).toBeGreaterThanOrEqual(2);
    }
    expect(await terms(page).locator('.explain__marks a').evaluateAll((as) => as.every((a) => /^\d+$/.test(a.textContent ?? '') && a.getAttribute('target') === '_blank'))).toBe(true);
  });

  test('26 and 27: the hint stands once right before the list; nine closed buttons, each controlling a hidden element', async ({ page }) => {
    await learn(page);
    await expect(page.getByText('Press a name for its definition.')).toHaveCount(1);
    expect(await page.locator('.explain__hint').evaluate((h) => h.nextElementSibling?.matches('ol.explain__terms'))).toBe(true);
    const buttons = terms(page).getByRole('button');
    await expect(buttons).toHaveCount(9);
    for (const [i, [, name]] of NINE.entries()) {
      const button = buttons.nth(i);
      await expect(button).toHaveText(name);
      await expect(button).toHaveAttribute('aria-expanded', 'false');
      const id = (await button.getAttribute('aria-controls'))!;
      await expect(page.locator(`#${id}`)).toBeHidden();
      expect(await page.locator(`#${id}`).evaluate((e) => e.hasAttribute('hidden'))).toBe(true);
    }
    await expect(page.locator('.explain__def-text:visible')).toHaveCount(0);
  });

  // Rows no approved entry ties (S12 §A.3): TCP's Duplicate ACK, SACK and FIN. The half about a lesson with no tied term at all is
  // `Explanation.test.tsx`'s (a fixture), since every ready lesson is to have a tie once the glossary is done.
  test('26: a row no entry ties has no attribute and no button, and its markup is today’s: an idea and a name', async ({ page }) => {
    await learn(page, TCP_LEARN);
    for (const name of ['Duplicate ACK', 'SACK', 'FIN']) {
      const row = terms(page).locator('> li', { has: page.locator('.explain__term', { hasText: new RegExp(`^${name}$`) }) });
      await expect(row).toHaveCount(1);
      const shape = await row.evaluate((li) => ({ attrs: li.getAttributeNames(), kids: [...li.children].map((c) => c.className), buttons: li.querySelectorAll('button').length }));
      expect(shape, name).toEqual({ attrs: [], kids: ['explain__idea', 'explain__term'], buttons: 0 });
    }
  });

  test('28: Ping opens to its definition and the sources named, and nothing else; again closes; Ping and Traceroute can both be open', async ({ page }) => {
    await learn(page);
    const ping = termButton(page, 'Ping');
    await ping.click();
    await expect(ping).toHaveAttribute('aria-expanded', 'true');
    const def = definition(page, 'Ping');
    await expect(def.locator('.explain__def-text')).toHaveText(PING_TEXT);
    await expect(def.locator('.explain__def-src')).toHaveText('Sources Microsoft ping, RFC 2151, Cisco ping and traceroute, Microsoft Azure TCP/IP tuning');
    await expect(def.locator('.explain__def-src a')).toHaveCount(0);
    expect(await def.evaluate((e) => [...e.children].map((c) => c.className))).toEqual(['explain__def-text', 'explain__def-src']);
    await expect(def.locator('a, button, input, select, textarea, [tabindex], [contenteditable]')).toHaveCount(0);
    await expect(def).not.toContainText('glossary');
    await expect(terms(page).getByRole('button', { expanded: true })).toHaveCount(1);
    await termButton(page, 'Traceroute').click();
    await expect(terms(page).getByRole('button', { expanded: true })).toHaveCount(2);
    await ping.click();
    await expect(ping).toHaveAttribute('aria-expanded', 'false');
    await expect(def).toBeHidden();
  });

  test('28: an open definition stays open through Practice and back; a reload closes all and saves nothing', async ({ page }) => {
    await learn(page);
    await page.evaluate(() => localStorage.setItem('seed', '1'));
    await termButton(page, 'Ping').click();
    const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
    await page.getByRole('button', { name: 'Next: Practice', exact: true }).click();
    await expect(kicker(page)).not.toHaveText(/Learn$/);
    await page.getByRole('button', { name: 'Previous step', exact: true }).click();
    await expect(kicker(page)).toHaveText(/Learn$/);
    await expect(termButton(page, 'Ping')).toHaveAttribute('aria-expanded', 'true');
    // The reader's visit is recorded by the console as before; opening a definition adds nothing of its own.
    const keys = (json: string) => (JSON.parse(json) as [string, string][]).map(([k]) => k).filter((k) => !k.includes('progress'));
    expect(keys(await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort())))).toEqual(keys(before));
    await page.reload();
    await hydrated(page);
    for (const b of await terms(page).getByRole('button').all()) await expect(b).toHaveAttribute('aria-expanded', 'false');
  });

  test('29: pressing the row on its words opens it; pressing a source number opens the source and not the definition', async ({ page, context }) => {
    await learn(page);
    const idea = terms(page).locator('> li').nth(0).locator('.explain__idea');
    const r = (await idea.boundingBox())!;
    await page.mouse.click(r.x + r.width / 2, r.y + 4);
    await expect(termButton(page, 'Echo request')).toHaveAttribute('aria-expanded', 'true');
    await termButton(page, 'Echo request').click();
    const popup = context.waitForEvent('page');
    await terms(page).locator('> li').nth(0).locator('.explain__marks a').first().click();
    await (await popup).close();
    await expect(termButton(page, 'Echo request')).toHaveAttribute('aria-expanded', 'false');
  });

  test('30: the ICMP lesson shows TTL’s IP sense only; the DNS lesson shows the DNS sense; its other rows are today’s', async ({ page }) => {
    await learn(page);
    await termButton(page, 'TTL').click();
    const def = definition(page, 'TTL');
    await expect(def.locator('.explain__def-sense')).toHaveText('In IP packets');
    await expect(def.locator('.explain__def-text')).toContainText('every IPv4 packet’s header');
    await expect(page.locator('body')).not.toContainText('In DNS, the TTL');
    await learn(page, '/how-the-internet-works/what-is-dns?step=6');
    await termButton(page, 'TTL').click();
    await expect(definition(page, 'TTL').locator('.explain__def-sense')).toHaveText('In DNS');
    await expect(definition(page, 'TTL').locator('.explain__def-text')).toContainText('In DNS, the TTL');
    await expect(page.locator('body')).not.toContainText('every IPv4 packet’s header');
  });

  test('31: Latency keeps the lesson’s name on the tape, and its definition is the entry Latency’s text (E2: read from /glossary)', async ({ page }) => {
    await page.goto('/glossary');
    const entryText = await page.locator('#latency .gl-def').textContent();
    expect(entryText).toBeTruthy();
    await learn(page);
    await termButton(page, 'Latency (round-trip time)').click();
    const def = definition(page, 'Latency (round-trip time)');
    await expect(def.locator('.explain__def-text')).toHaveText(entryText!);
    await expect(def.getByRole('link')).toHaveCount(0);
  });

  test('32: a tied row has data-def and a button, a row no entry ties has neither and no min-height and keeps its 42.2px at 1440', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // The DNS lesson: TTL is tied by the pilot; whatever else is tied, a row has a button exactly when it has data-def.
    await learn(page, '/how-the-internet-works/what-is-dns?step=6');
    const rows = await terms(page).locator('> li').evaluateAll((lis) => lis.map((li) => ({ def: li.getAttribute('data-def'), button: li.querySelector('button') !== null, min: getComputedStyle(li).minHeight, text: li.querySelector('.explain__term')?.textContent })));
    const tied = rows.filter((r) => r.def !== null);
    expect(tied.map((r) => r.text)).toContain('TTL');
    for (const r of rows) expect(r.button, r.text ?? '').toBe(r.def !== null);
    for (const r of rows.filter((x) => x.def === null)) expect(['0px', 'auto'], r.text ?? '').toContain(r.min);
    // A row no entry ties (TCP's Duplicate ACK): one line, 42.2px, as before any definition existed.
    await learn(page, TCP_LEARN);
    const untied = terms(page).locator('> li', { has: page.locator('.explain__term', { hasText: /^Duplicate ACK$/ }) });
    expect(await untied.getAttribute('data-def')).toBeNull();
    expect(await untied.evaluate((li) => getComputedStyle(li).minHeight)).toBe('0px');
    expect((await untied.boundingBox())!.height).toBeGreaterThan(41.7);
    expect((await untied.boundingBox())!.height).toBeLessThan(42.7);
  });

  test('33: no lesson links to the glossary: with all nine open no link reaches /glossary, and "in the glossary" is nowhere (E4: hrefs resolved)', async ({ page }) => {
    await learn(page);
    for (const b of await terms(page).getByRole('button').all()) await b.click();
    await expect(terms(page).getByRole('button', { expanded: true })).toHaveCount(9);
    // The console's links: the site's header, over it, has a Glossary link of its own.
    const links = await page.locator('.console a').evaluateAll((as) => as.map((a) => {
      const u = new URL(a.getAttribute('href') ?? '', location.href);
      return { href: a.getAttribute('href'), origin: u.origin === location.origin, path: u.pathname };
    }));
    expect(links.length).toBeGreaterThan(0);
    expect(links.filter((l) => l.origin && (l.path === '/glossary' || l.path.startsWith('/glossary/'))).map((l) => l.href)).toEqual([]);
    await expect(page.locator('body')).not.toContainText('in the glossary');
    // The Cloudflare sources whose address holds "glossary" are not this site's pages, and stay.
    expect(links.some((l) => !l.origin && /glossary/.test(l.href ?? ''))).toBe(true);
  });

  test('34: Tab reaches the button, Enter opens it and focus stays, the next Tab leaves the row (Latency’s first source number), Space toggles (E6)', async ({ page }) => {
    await learn(page);
    const ping = termButton(page, 'Ping');
    await ping.focus();
    await page.keyboard.press('Enter');
    await expect(ping).toHaveAttribute('aria-expanded', 'true');
    expect(await page.evaluate(() => document.activeElement?.textContent)).toBe('Ping');
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => {
      const row = document.activeElement!.closest('li');
      const ping = [...document.querySelectorAll('button.explain__term')].find((b) => b.textContent === 'Ping')!.closest('li')!;
      return { sameRow: row === ping, text: document.activeElement!.textContent, inLatency: row === ping.nextElementSibling };
    })).toEqual({ sameRow: false, text: '4', inLatency: true });
    await page.keyboard.press('Shift+Tab');
    await expect(ping).toBeFocused();
    await page.keyboard.press('Space');
    await expect(ping).toHaveAttribute('aria-expanded', 'false');
    // Tab from the last mark of Ping's row reaches Ping's button.
    await page.locator('.explain__terms > li').nth(2).locator('.explain__marks a').last().focus();
    await page.keyboard.press('Tab');
    await expect(ping).toBeFocused();
  });

  for (const size of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    test(`35: with all nine open at ${size.width}, the window does not scroll and the panels stay where they were`, async ({ page }) => {
      await page.setViewportSize(size);
      await learn(page);
      const before = [await rect(page, '.console__explain'), await rect(page, '.console__stage')];
      for (const b of await terms(page).getByRole('button').all()) await b.click();
      await expect(terms(page).getByRole('button', { expanded: true })).toHaveCount(9);
      await page.locator('.console__explain').evaluate((e) => (e.scrollTop = e.scrollHeight));
      await settledFrame(page);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect([await rect(page, '.console__explain'), await rect(page, '.console__stage')]).toEqual(before);
      expect(await page.locator('.console__explain').evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(true);
    });
  }

  test('35: the Explanation panel does not scroll sideways at 320, 768 by 1024 and 1024 by 768 with a definition open', async ({ page }) => {
    for (const size of [{ width: 320, height: 700 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
      await page.setViewportSize(size);
      await learn(page);
      await termButton(page, 'Destination unreachable').click();
      const panel = page.locator('.console__explain');
      expect(await panel.evaluate((e) => e.scrollWidth <= e.clientWidth), `${size.width}`).toBe(true);
      expect((await pageOverflow(page)).sideways).toBe(0);
    }
  });

  test('28: an open definition ends 9px above the next row, at 1440 with a mouse', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await learn(page);
    await termButton(page, 'Ping').click();
    await expect(definition(page, 'Ping')).toHaveCSS('margin-bottom', '9px');
  });

  test.describe('as a touch screen at 375', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });
    test('36: the row’s first 44px is the button’s target, the list’s width', async ({ page }) => {
      await learn(page);
      // Packet loss's row is 61px at 375, so the point 46px down is inside the row but past the button's 44px target.
      const row = terms(page).locator('> li').nth(8);
      await row.evaluate((e) => e.scrollIntoView({ block: 'center' }));
      const r = (await row.boundingBox())!;
      const hits = (x: number, y: number) => page.evaluate(([px, py]) => { const el = document.elementFromPoint(px!, py!); return el?.closest('button.explain__term')?.textContent === 'Packet loss'; }, [x, y]);
      expect(await hits(r.x + 2, r.y + 43)).toBe(true);
      expect(await hits(r.x + r.width - 2, r.y + 1)).toBe(true);
      expect(await hits(r.x + 2, r.y + 46)).toBe(false);
    });
    test('28: an open definition ends 9px above the next row on a touch screen', async ({ page }) => {
      await learn(page);
      await termButton(page, 'Ping').click();
      await expect(definition(page, 'Ping')).toHaveCSS('margin-bottom', '9px');
    });
  });
});
