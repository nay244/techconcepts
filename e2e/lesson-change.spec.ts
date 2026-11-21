import { expect, test, type BrowserContext, type Page, type Request, type Route } from '@playwright/test';
import { collectErrors, hydrated, nextButton, open, playButton, settledFrame, speedButton, viewSwitch } from './support';

/**
 * A lesson change in the page (job 30, B44, D26 variant A "Cut"): from one lesson to another of the same track that
 * draws the same figure, the console swaps the lesson in place: the same document, the same drawing node, the address
 * and the head moved to the new lesson's, progress as a load records it. Every other change, and every swap that cannot
 * be made, is the browser's own page load.
 *
 * Run in d1440-dark and reduced-motion (the behaviour projects); each describe sets its own window size. The data's
 * address is `/<track>/<slug>.json` (B43); the tests hold, fail and delay it with `page.route`.
 */
test.beforeEach(({ page: _page }, testInfo) => {
  test.skip(!['d1440-dark', 'reduced-motion'].includes(testInfo.project.name), 'A lesson change is checked in d1440-dark and reduced-motion.');
});

const HTIW = '/how-the-internet-works';
const TCP = `${HTIW}/what-is-tcp`;
const UDP = `${HTIW}/what-is-udp`;
/** How the Internet Works, in order (14 lessons). */
const HTIW_ORDER = ['what-is-ip', 'what-is-dns', 'what-is-tcp', 'what-is-udp', 'what-is-http', 'what-is-https', 'what-is-dhcp', 'what-is-icmp', 'what-is-smtp', 'what-is-imap', 'what-is-pop3', 'what-is-ftp', 'what-is-ssh', 'what-is-tls'];
/** Networking's lessons that draw `net-map`, in the track's order: each is opened from the one before by the outline. */
const NET_MAP_NETWORKING = ['ports', 'tcp-udp', 'nat', 'what-is-dns', 'what-is-http', 'what-is-https', 'what-is-tls', 'proxies', 'vpn', 'packets', 'arp', 'router'];

// ---------------------------------------------------------------- helpers

const row = (page: Page, slug: string) => page.locator(`.console__track a.outline__lesson[href$="/${slug}"]`);
/** Opens the part a lesson is in, when it is folded, and presses the lesson's row. */
async function pressRow(page: Page, slug: string): Promise<void> {
  const link = row(page, slug);
  if (!(await link.isVisible())) await page.locator('.console__track details:has(a[href$="/' + slug + '"]) > summary').click();
  await link.click();
}
const sheetRow = (page: Page, slug: string) => page.locator(`.outline__dialog a.outline__lesson[href$="/${slug}"]`);
const live = (page: Page) => page.locator('.console [data-announce]');
const jsonOf = (slug: string) => `**/${slug}.json`;

/** Opens a lesson and puts the marks a swap must keep (a window value, the drawing node) on the page. */
async function openMarked(page: Page, path: string): Promise<void> {
  await open(page, path);
  await page.evaluate(() => {
    const w = window as unknown as { __mark: number; __svg: Element | null; __pushes: number; __dp: boolean[] };
    w.__mark = 1;
    w.__svg = document.querySelector('svg[data-figure]');
    w.__pushes = 0;
    const push = history.pushState.bind(history);
    history.pushState = (...args: Parameters<History['pushState']>) => {
      w.__pushes += 1;
      push(...args);
    };
    w.__dp = [];
    document.addEventListener('click', (e) => w.__dp.push(e.defaultPrevented));
  });
}

/** Whether the page is still the document it was, with the drawing node it started with. */
const sameDocument = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __mark?: number; __svg?: Element | null };
    return {
      mark: w.__mark === 1,
      navigations: performance.getEntriesByType('navigation').length,
      svg: w.__svg !== undefined && w.__svg === document.querySelector('svg[data-figure]'),
      svgCount: document.querySelectorAll('svg[data-figure]').length,
      slot: document.querySelectorAll('astro-slot[name="figure"]').length,
    };
  });

/** Presses Next until the forward button says "Next lesson": the lesson's Practice. */
async function walkToPractice(page: Page): Promise<void> {
  for (let i = 0; i < 30; i += 1) {
    const words = (await nextButton(page).textContent()) ?? '';
    if (words.startsWith('Next lesson')) return;
    await nextButton(page).click();
  }
  throw new Error('The lesson has no end.');
}

/** Waits until the figure has stopped animating and the scene has played, so two pages can be compared. */
async function settle(page: Page): Promise<void> {
  await expect(playButton(page)).toHaveText('Play all');
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length), { timeout: 15_000 }).toBe(0);
  await settledFrame(page);
}

/** What a lesson page is, as far as a reader can tell it from another: the console's markup, the drawing and the head. Left out are what E65 leaves out. */
async function snapshot(page: Page) {
  return page.evaluate(() => {
    const meta = (selector: string, attribute: string) => document.head.querySelector(selector)?.getAttribute(attribute) ?? null;
    const declarations = (el: Element) => {
      const s = (el as HTMLElement).style;
      return [...Array(s.length).keys()].map((i) => `${s[i]}:${s.getPropertyValue(s[i]!)}`).sort().join(';');
    };
    const clone = document.querySelector('.console')!.cloneNode(true) as Element;
    clone.querySelectorAll('[data-announce]').forEach((e) => (e.textContent = ''));
    clone.querySelectorAll('details').forEach((d) => d.removeAttribute('open'));
    // A <noscript> is the server's markup for a reader without scripts; React does not update it, and a reader with scripts never sees it.
    clone.querySelectorAll('noscript').forEach((n) => (n.textContent = ''));
    clone.querySelectorAll('h1.top__name').forEach((h) => h.removeAttribute('tabindex'));
    clone.querySelectorAll('[style]').forEach((e) => e.setAttribute('style', declarations(e)));
    // Server markup separates adjacent texts with comments; a page React made has none. The words are the same.
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const comments: Node[] = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    comments.forEach((c) => c.parentNode?.removeChild(c));
    clone.normalize();
    // The order attributes were written in is not a difference a reader can see.
    clone.querySelectorAll('*').forEach((e) => {
      const attrs = [...e.attributes].map((a) => [a.name, a.value] as const).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0));
      for (const [name] of attrs) e.removeAttribute(name);
      for (const [name, value] of attrs) e.setAttribute(name, value);
    });
    const svg = clone.querySelector('svg[data-figure]');
    return {
      console: clone.outerHTML,
      svg: svg === null ? '' : svg.outerHTML,
      head: {
        title: document.title,
        description: meta('meta[name="description"]', 'content'),
        ogTitle: meta('meta[property="og:title"]', 'content'),
        ogDescription: meta('meta[property="og:description"]', 'content'),
        ogUrl: meta('meta[property="og:url"]', 'content'),
        ogImage: meta('meta[property="og:image"]', 'content'),
        ogImageAlt: meta('meta[property="og:image:alt"]', 'content'),
        canonical: meta('link[rel="canonical"]', 'href'),
      },
      path: location.pathname,
    };
  });
}

/** A first sentence of difference between two long strings, so a failure says where. */
function firstDifference(a: string, b: string): string {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i += 1;
  return i === a.length && i === b.length ? '' : `at ${i}: swapped "${a.slice(Math.max(0, i - 60), i + 120)}" / fresh "${b.slice(Math.max(0, i - 60), i + 120)}"`;
}

/** A second page of the same browser context, loaded fresh at `path`: the lesson as a load shows it (E65), with the same progress. */
async function freshAt(context: BrowserContext, path: string): Promise<Page> {
  const fresh = await context.newPage();
  await open(fresh, path);
  await settledFrame(fresh);
  return fresh;
}

async function expectEqualToFresh(page: Page, context: BrowserContext, label: string, walked: boolean): Promise<void> {
  const path = new URL(page.url()).pathname;
  const fresh = await freshAt(context, path);
  if (walked) {
    await walkToPractice(fresh);
    await settle(fresh);
  }
  const [a, b] = [await snapshot(page), await snapshot(fresh)];
  await fresh.close();
  expect(a.head, `${label}: head`).toStrictEqual(b.head);
  expect(a.path, label).toBe(b.path);
  expect(firstDifference(a.svg, b.svg), `${label}: the drawing`).toBe('');
  expect(firstDifference(a.console, b.console), `${label}: the console`).toBe('');
}

/** Holds a lesson's data for `ms` before it is answered (never, with `Infinity`). */
async function hold(page: Page, slug: string, ms: number): Promise<{ answered: () => number | null; started: () => number | null }> {
  let answered: number | null = null;
  let started: number | null = null;
  await page.route(jsonOf(slug), async (route: Route) => {
    started ??= Date.now();
    if (ms === Infinity) return; // never answered
    await new Promise((r) => setTimeout(r, ms));
    answered = Date.now();
    await route.continue();
  });
  return { answered: () => answered, started: () => started };
}

/** The `.json` requests a page makes, by path. */
function watchJson(page: Page): string[] {
  const seen: string[] = [];
  page.on('request', (r: Request) => {
    if (new URL(r.url()).pathname.endsWith('.json')) seen.push(new URL(r.url()).pathname);
  });
  return seen;
}

/** Installs, in the page, a log of when the signal, the tape and the live region's words appear and go, in ms from the press (`__t0`). */
async function recordMarks(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as { __t0: number; __log: { t: number; what: string }[]; __ever: Set<string> };
    w.__log = [];
    w.__ever = new Set();
    const note = (what: string) => w.__log.push({ t: Math.round(performance.now() - w.__t0), what });
    const seen = { signal: false, tape: false };
    const check = () => {
      const signal = document.querySelector('.console .signal') !== null;
      const tape = document.querySelector('.console .tape') !== null;
      if (signal !== seen.signal) note(signal ? 'signal+' : 'signal-');
      if (tape !== seen.tape) note(tape ? 'tape+' : 'tape-');
      seen.signal = signal;
      seen.tape = tape;
      const text = document.querySelector('.console [data-announce]')?.textContent ?? '';
      if (text.startsWith('Opening')) w.__ever.add(text);
    };
    new MutationObserver(check).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true });
  });
}

/** Presses a control from inside the page (so the press time is exact) and starts the clock. */
async function press(page: Page, selector: string): Promise<void> {
  await page.evaluate((s) => {
    (window as unknown as { __t0: number }).__t0 = performance.now();
    (document.querySelector(s) as HTMLElement).click();
  }, selector);
}

const times = (page: Page) => page.evaluate(() => (window as unknown as { __log: { t: number; what: string }[] }).__log);

/** The first time `what` happened, or null. */
const first = (log: { t: number; what: string }[], what: string): number | null => log.find((e) => e.what === what)?.t ?? null;

// ================================================================ the swap, and what it keeps

test.describe('a swap at 1440', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('TCP to UDP by the outline row: one document, the same drawing node, the lesson, the head, the address, the line (B44-0.1, 2.1, 3.1, 6.1, D-12, D-19, D-22)', async ({ page }) => {
    const errors = collectErrors(page);
    const json = watchJson(page);
    await openMarked(page, TCP);
    expect(json, 'a first visit fetches no lesson data (B44-1.4)').toStrictEqual([]);
    await page.waitForTimeout(3000);
    expect(json).toStrictEqual([]);
    const length = await page.evaluate(() => history.length);

    await row(page, 'what-is-udp').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await expect(live(page)).toHaveText('UDP. Lesson 4 of 14. Overview.');

    expect(await sameDocument(page)).toStrictEqual({ mark: true, navigations: 1, svg: true, svgCount: 1, slot: 1 });
    expect(await page.evaluate(() => history.length)).toBe(length + 1);
    expect(await page.evaluate(() => (window as unknown as { __pushes: number }).__pushes)).toBe(1);
    expect(json, 'only the pressed lesson fetched, no other lesson ahead (B44-1.5)').toStrictEqual([`${UDP}.json`]);
    expect(await page.title()).toBe('UDP · TechConcepts');
    await expect(page.locator('h1.top__name:visible')).toHaveText('UDP');
    await expect(row(page, 'what-is-udp')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('.console__track a[aria-current="page"]')).toHaveCount(1);
    await expect(page.locator('.console__track [data-going]')).toHaveCount(0);
    // Focus: the row pressed, with its ring after a keyboard press (D-12).
    await expect(row(page, 'what-is-udp')).toBeFocused();
    expect(await row(page, 'what-is-udp').evaluate((el) => el.matches(':focus-visible'))).toBe(true);
    // The head of UDP's own page (B44-3.1).
    const head = await page.evaluate(() => ({
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    }));
    expect(head.ogTitle).toBe('UDP · TechConcepts');
    expect(head.canonical).toBe(`https://techconcepts.app${UDP}`);
    expect(head.ogUrl).toBe(head.canonical);
    expect(head.description).toBe(head.ogDescription);
    expect(head.description!.length).toBeGreaterThan(20);
    expect(errors).toStrictEqual([]);

    // Back and Forward: the same document and node; focus on the lesson's name, with a tabindex only while it holds focus (D-17).
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${TCP}$`));
    await expect(live(page)).toHaveText('TCP. Lesson 3 of 14. Overview.');
    expect(await sameDocument(page)).toStrictEqual({ mark: true, navigations: 1, svg: true, svgCount: 1, slot: 1 });
    expect(await page.title()).toBe('TCP · TechConcepts');
    await expect(page.locator('h1.top__name:visible')).toBeFocused();
    await expect(page.locator('h1.top__name:visible')).toHaveAttribute('tabindex', '-1');
    await page.keyboard.press('Tab');
    await expect(page.locator('h1.top__name[tabindex]')).toHaveCount(0);
    await page.goForward();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await expect(live(page)).toHaveText('UDP. Lesson 4 of 14. Overview.');
    expect(await sameDocument(page)).toStrictEqual({ mark: true, navigations: 1, svg: true, svgCount: 1, slot: 1 });
    // A hash entry is not a lesson change (B44-6.6): no fetch, nothing announced anew.
    const before = json.length;
    await page.locator('a.skip-link').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    expect(json.length).toBe(before);
    expect((await sameDocument(page)).navigations).toBe(1);
  });

  test('a reload at the new address is UDP\'s own page, equal to a fresh load (B44-6.7, 3.4)', async ({ page, context }) => {
    await openMarked(page, TCP);
    await row(page, 'what-is-udp').click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await expectEqualToFresh(page, context, 'TCP to UDP', false);
    await page.reload();
    await hydrated(page);
    expect(await page.title()).toBe('UDP · TechConcepts');
    expect((await sameDocument(page)).mark).toBe(false);
    await expect(page.locator('.console__track a[aria-current="page"]')).toHaveText(/UDP/);
  });

  test('the drawing is kept and is the new lesson\'s: VPN to Packets in Networking describes Packets, not VPN (B44-2.3); the hidden strips go back as drawn (E65)', async ({ page, context }) => {
    await openMarked(page, '/networking/vpn');
    await pressRow(page, 'packets');
    await expect(page).toHaveURL(/\/networking\/packets$/);
    expect(await sameDocument(page)).toMatchObject({ mark: true, svg: true, svgCount: 1 });
    const label = await page.locator('svg[data-figure]').getAttribute('aria-label');
    const fresh = await freshAt(context, '/networking/packets');
    expect(label).toBe(await fresh.locator('svg[data-figure]').getAttribute('aria-label'));
    await fresh.close();
    // Packets labels routers b, c and d; ARP none: the strips are hidden and as drawn (E65).
    await pressRow(page, 'arp');
    await expect(page).toHaveURL(/\/networking\/arp$/);
    expect(await sameDocument(page)).toMatchObject({ svg: true });
    await settle(page);
    await expectEqualToFresh(page, context, 'Packets to ARP', false);
  });

  test('the draw-in does not play again on a swap: no running animation, the drawing is fully there in the swap\'s first frame (B44-2.4)', async ({ page }) => {
    await openMarked(page, TCP);
    await page.waitForTimeout(1000);
    const seen = await page.evaluate(
      () =>
        new Promise<{ opacity: string; animations: number }>((resolve) => {
          const svg = document.querySelector('svg[data-figure]')!;
          const check = () => {
            if (location.pathname.endsWith('what-is-udp')) resolve({ opacity: getComputedStyle(svg).opacity, animations: svg.getAnimations().filter((a) => a.playState === 'running').length });
            else requestAnimationFrame(check);
          };
          (document.querySelector('.console__track a[href$="what-is-udp"]') as HTMLElement).click();
          check();
        }),
    );
    expect(seen).toStrictEqual({ opacity: '1', animations: 0 });
  });
});
