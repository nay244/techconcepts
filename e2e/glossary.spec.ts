import { expect, test, type Page } from '@playwright/test';
import { hydrated, kicker, open, pageOverflow, settledFrame } from './support';
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

test.beforeEach(async ({}, testInfo) => {
  // One desktop project of each theme is enough: every test sets its own window size.
  test.skip(!['d1440-light', 'd1440-dark'].includes(testInfo.project.name), 'runs in the 1440 projects');
});

const box = async (page: Page, selector: string) => (await page.locator(selector).first().boundingBox())!;
const top = async (page: Page, selector: string) => (await box(page, selector)).y;

test.describe('the Glossary page', () => {
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
    await expect(page.locator('#ttl .gl-row--tracks')).toHaveText(['Described in How the Internet Works', 'Described in How the Internet Works']);
    await expect(page.locator('main')).not.toContainText('Taught in');
    expect(await page.locator('.gl-row').evaluateAll((rows) => rows.filter((r) => /lesson/i.test(r.textContent ?? '')).length)).toBe(0);
  });

  test('"See TTL" puts #ttl in the address and the entry under every sticky foot', async ({ page }) => {
    for (const size of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(size);
      await page.goto('/glossary');
      await page.locator('#time-to-live').getByRole('link', { name: 'TTL' }).click();
      await expect(page).toHaveURL(/\/glossary#ttl$/);
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
      await page.goto('/glossary#ttl');
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
    // 375: the bar of the last letter is 68 to 80px from the top; Tab then focuses "All letters" in it.
    await page.locator(`a.gl-key[href="${last}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${last}$`));
    const bar = (await box(page, `${last} .gl-bar`)).y;
    expect(bar).toBeGreaterThanOrEqual(68);
    expect(bar).toBeLessThanOrEqual(80);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.closest('section.gl-letter')?.id)).toBe(last.slice(1));
    expect(await page.evaluate(() => document.activeElement?.textContent)).toBe('All letters');
    // 1440: the bar is below the foot of the keys, and Tab focuses the first link inside the letter's list.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/glossary');
    await page.locator(`a.gl-key[href="${last}"]`).click();
    const keysFoot = await box(page, '.gl-az');
    expect(await top(page, `${last} .gl-bar`)).toBeGreaterThanOrEqual(keysFoot.y + keysFoot.height);
    await page.keyboard.press('Tab');
    const first = await page.locator(`${last} dl a`).first().evaluate((a) => a.outerHTML);
    expect(await page.evaluate(() => document.activeElement?.outerHTML)).toBe(first);
    await expect(page.locator('.gl-up').first()).toBeHidden();
  });

  test('scrolled into the middle of the last letter at 375, its bar sticks at 68px and "All letters" brings the keys back', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/glossary');
    const last = (await page.locator('section.gl-letter').last().getAttribute('id'))!;
    const section = page.locator(`#${last}`);
    await section.evaluate((s) => window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY + s.getBoundingClientRect().height / 2));
    await settledFrame(page);
    const bar = page.locator(`#${last} .gl-bar`);
    expect(Math.abs((await bar.boundingBox())!.y - 68)).toBeLessThanOrEqual(1);
    await bar.getByRole('link', { name: 'All letters' }).click();
    await expect(page.locator('#letters')).toBeInViewport();
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
    await page.goto('/glossary');
    let p = await parts();
    expect(p.name.y).toBeLessThan(p.def.y);
    expect(p.def.y).toBeLessThan(p.src.y);
    expect(p.src.y).toBeLessThan(p.tracks.y);
    await page.setViewportSize({ width: 768, height: 900 });
    p = await parts();
    expect(p.name.x).toBeLessThan(p.def.x);
    expect(Math.abs(p.name.y - p.def.y)).toBeLessThan(40);
    expect(p.src.y).toBeGreaterThan(p.def.y + p.def.height - 1);
    await page.setViewportSize({ width: 1440, height: 900 });
    p = await parts();
    expect(p.name.x).toBeLessThan(p.def.x);
    expect(p.def.x).toBeLessThan(p.src.x);
    expect(Math.abs(p.name.y - p.def.y)).toBeLessThan(40);
    expect(Math.abs(p.src.y - p.def.y)).toBeLessThan(40);
    expect(p.def.width).toBeLessThanOrEqual(612.5);
    await page.setViewportSize({ width: 960, height: 900 });
    expect((await box(page, '#ping dt')).width).toBeCloseTo(220, 0);
    await page.setViewportSize({ width: 1200, height: 900 });
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
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
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
    const links = await page.locator('a').evaluateAll((as) => as.map((a) => {
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
