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
    // useId's ids count the components a page has made; a swapped page's are not a fresh page's. The pairs still match.
    // (Done on the text below.)
    // The order attributes were written in is not a difference a reader can see.
    clone.querySelectorAll('*').forEach((e) => {
      const attrs = [...e.attributes].map((a) => [a.name, a.value] as const).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0));
      for (const [name] of attrs) e.removeAttribute(name);
      for (const [name, value] of attrs) e.setAttribute(name, value);
    });
    const svg = clone.querySelector('svg[data-figure]');
    const ids = (html: string) => html.replace(/_r[0-9a-z]+_[0-9a-z_-]*/g, '_ID_');
    return {
      console: ids(clone.outerHTML),
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

// ================================================================ a swapped lesson is a loaded one (decision 5)

test.describe('equality along the tracks', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test.setTimeout(600_000);

  test('along all 14 lessons of How the Internet Works by "Next lesson": at the Overview and walked to the last position, equal to a fresh load (B44-3.5)', async ({ page, context }) => {
    const errors = collectErrors(page);
    // The track's order, read from the page: the lesson links in the column's lesson links, folded parts included.
    await open(page, TCP);
    const order = await page.evaluate(() => [...document.querySelectorAll('.console__track a.outline__lesson')].map((a) => a.getAttribute('href')!.split('/').pop()!));
    expect(order).toHaveLength(14);
    await openMarked(page, `${HTIW}/${order[0]}`);
    const HTIW_ORDER = order;
    let swaps = 0;
    for (let i = 0; i < HTIW_ORDER.length; i += 1) {
      const slug = HTIW_ORDER[i]!;
      if (i > 0) await expectEqualToFresh(page, context, `${HTIW_ORDER[i - 1]} to ${slug}, Overview`, false);
      await walkToPractice(page);
      await settle(page);
      if (i > 0) await expectEqualToFresh(page, context, `${slug}, walked`, true);
      if (i === HTIW_ORDER.length - 1) break;
      await nextButton(page).click();
      await expect(page).toHaveURL(new RegExp(`/${HTIW_ORDER[i + 1]}$`));
      swaps += 1;
    }
    expect(swaps).toBe(13);
    expect(await sameDocument(page)).toStrictEqual({ mark: true, navigations: 1, svg: true, svgCount: 1, slot: 1 });
    expect(errors).toStrictEqual([]);
  });

  test('across Networking\'s 12 net-map lessons by the outline: equal to a fresh load, the document and the drawing node kept (B44-3.5)', async ({ page, context }) => {
    const errors = collectErrors(page);
    await openMarked(page, `/networking/${NET_MAP_NETWORKING[0]}`);
    for (let i = 1; i < NET_MAP_NETWORKING.length; i += 1) {
      const slug = NET_MAP_NETWORKING[i]!;
      await walkToPractice(page);
      await settle(page);
      await pressRow(page, slug);
      await expect(page).toHaveURL(new RegExp(`/networking/${slug}$`));
      await expectEqualToFresh(page, context, `Networking ${NET_MAP_NETWORKING[i - 1]} to ${slug}, Overview`, false);
      await walkToPractice(page);
      await settle(page);
      await expectEqualToFresh(page, context, `Networking ${slug}, walked`, true);
    }
    expect(await sameDocument(page)).toMatchObject({ mark: true, navigations: 1, svg: true, svgCount: 1 });
    expect(errors).toStrictEqual([]);
  });

  test('the longer old lesson: TCP walked to its end, "Next lesson": UDP opens at its Overview, no error, its words (B44-3.6)', async ({ page }) => {
    const errors = collectErrors(page);
    await openMarked(page, TCP);
    await walkToPractice(page);
    await nextButton(page).click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Overview');
    await expect(page.locator('.console__explain .explain__title')).toHaveText('UDP');
    expect(errors).toStrictEqual([]);
  });

  test('a lesson listed in both tracks keeps the address under the track it is read in; the canonical is the home\'s (B44-0.6, 3.2)', async ({ page }) => {
    await openMarked(page, '/networking/nat');
    await pressRow(page, 'what-is-dns');
    await expect(page).toHaveURL(/\/networking\/what-is-dns$/);
    expect(await page.evaluate(() => document.querySelector('link[rel="canonical"]')!.getAttribute('href'))).toBe(`https://techconcepts.app${HTIW}/what-is-dns`);
    expect(await page.evaluate(() => document.querySelector('meta[property="og:url"]')!.getAttribute('content'))).toBe(`https://techconcepts.app${HTIW}/what-is-dns`);
    await expect(live(page)).toHaveText('DNS. Lesson 13 of 20. Overview.');
    // Same lesson in the other track's address is another page: the number is that track's.
    await expect(page.locator('.console__track .top__of, .track__lesson .top__of')).toHaveText('Lesson 13 of 20');
  });
});

// ================================================================ what carries over and what starts again

test.describe('state', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('Play all running when UDP is pressed: UDP is idle at its Overview and no timer of TCP\'s run reaches it (B44-4.1, D-28)', async ({ page }) => {
    await openMarked(page, TCP);
    await playButton(page).click();
    await expect(playButton(page)).toHaveText('Pause');
    await row(page, 'what-is-udp').click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await expect(playButton(page)).toHaveText('Play all');
    await page.waitForTimeout(3000);
    await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Overview');
    await expect(playButton(page)).toHaveText('Play all');
  });

  test('?step= in the old address: the swap opens the Overview at the lesson\'s own address, offers Resume when UDP has a place, never deep-links (B44-4.2, 4.3, 6.5)', async ({ page }) => {
    // UDP has a place of its own: step 2, kept from an earlier visit.
    await page.addInitScript(() => {
      if (localStorage.getItem('techconcepts:v2') === null) {
        const d = { version: 2, lessons: { 'what-is-udp': { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-01T00:00:00.000Z' } }, lastLesson: 'what-is-udp', lastTrack: 'how-the-internet-works' };
        localStorage.setItem('techconcepts:v2', JSON.stringify(d));
      }
    });
    await openMarked(page, `${TCP}?step=3`);
    await expect(page.locator('.console__explain .explain__kicker')).toContainText('Step 3');
    await walkToPractice(page);
    await nextButton(page).click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    expect(new URL(page.url()).search).toBe('');
    await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Overview');
    await expect(page.getByRole('button', { name: /^Resume at / })).toBeVisible();
    // Back onto TCP's address: the Overview, the lesson's own address (E66), no jump to step 3.
    await page.goBack();
    await expect(page.locator('.console__explain .explain__title')).toHaveText('TCP');
    await expect(page.locator('.console__explain .explain__kicker')).toHaveText('Overview');
    expect(new URL(page.url()).search).toBe('');
    expect((await sameDocument(page)).navigations).toBe(1);
  });

  test('Practice picks start again both ways (B44-4.4)', async ({ page }) => {
    await openMarked(page, TCP);
    await walkToPractice(page);
    await page.locator('.practice__option').first().click();
    await expect(page.locator('.practice__option[aria-pressed="true"]')).toHaveCount(1);
    await nextButton(page).click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await walkToPractice(page);
    await expect(page.locator('.practice__option[aria-pressed="true"]')).toHaveCount(0);
    await page.goBack();
    await expect(page.locator('.console__explain .explain__title')).toHaveText('TCP');
    await walkToPractice(page);
    await expect(page.locator('.practice__option[aria-pressed="true"]')).toHaveCount(0);
  });

  test('speed and the chosen view carry over; a lesson with no Sequence shows Network and the choice comes back (B44-5.1, 5.2, D-25)', async ({ page }) => {
    await openMarked(page, TCP);
    await speedButton(page).click(); // 1× to 1.5×
    await expect(speedButton(page)).toHaveText('1.5×');
    await viewSwitch(page).getByRole('button', { name: 'Sequence' }).click();
    await row(page, 'what-is-udp').click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await expect(speedButton(page)).toHaveText('1.5×');
    await expect(speedButton(page)).toHaveAccessibleName('Speed 1.5×. Click for 2×');
    await expect(viewSwitch(page).getByRole('button', { name: 'Sequence' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.stage__figure')).toBeHidden();
    // Choose Network, then compare with a fresh UDP (the drawing was not touched while hidden).
    await viewSwitch(page).getByRole('button', { name: 'Network' }).click();
    // Networking: TCP/UDP has Sequence; NAT has none (Network shown), and DNS brings Sequence back.
    await page.goto('/networking/tcp-udp');
    await hydrated(page);
    await viewSwitch(page).getByRole('button', { name: 'Sequence' }).click();
    await pressRow(page, 'nat');
    await expect(page).toHaveURL(/\/networking\/nat$/);
    await expect(viewSwitch(page)).toHaveCount(0);
    await expect(page.locator('.stage__figure')).toBeVisible();
    await pressRow(page, 'what-is-dns');
    await expect(page).toHaveURL(/\/networking\/what-is-dns$/);
    await expect(viewSwitch(page).getByRole('button', { name: 'Sequence' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('definitions, the deeper box and the log fold start closed in the next lesson; the outline\'s folds carry (B44-5.4, 5.5, D-27)', async ({ page }) => {
    await openMarked(page, `${HTIW}/what-is-https`);
    // Open the "Email" part of the column, then change.
    const email = page.locator('.console__track details', { has: page.locator('summary', { hasText: /Email/i }) }).first();
    if (await email.count()) await email.locator('summary').click();
    await walkToPractice(page);
    const terms = page.locator('.explain__term');
    if (await terms.count()) await terms.first().click();
    await nextButton(page).click();
    await expect(page).toHaveURL(/\/what-is-tcp$/);
    if (await email.count()) await expect(email).toHaveAttribute('open', '');
    await walkToPractice(page);
    await expect(page.locator('.explain__term[aria-expanded="true"]')).toHaveCount(0);
    await expect(page.locator('.console__log .log__fold[aria-expanded="true"]')).toHaveCount(0);
    // The part that held HTTPS is a fold now, open; the one holding TCP is the plain section (D-27).
    const parts = await page.evaluate(() => ({ details: [...document.querySelectorAll('.console__track details.part')].map((d) => d.hasAttribute('open')), sections: document.querySelectorAll('.console__track section.part').length }));
    expect(parts.sections).toBe(1);
  });

  test('progress: a swap records the visit as a load does, and counting goes on (B44-6.2, 6.3, D-22)', async ({ page }) => {
    await openMarked(page, TCP);
    await walkToPractice(page);
    await nextButton(page).click();
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    const store = () =>
      page.evaluate(() => {
        const d = JSON.parse(localStorage.getItem('techconcepts:v2') ?? '{}');
        return { lastLesson: d.lastLesson, lastTrack: d.lastTrack, tcp: d.lessons?.['what-is-tcp']?.status ?? null, udp: d.lessons?.['what-is-udp'] ?? null };
      });
    expect(await store()).toMatchObject({ lastLesson: 'what-is-udp', lastTrack: 'how-the-internet-works', tcp: 'finished', udp: null });
    await nextButton(page).click(); // step 1
    await expect.poll(async () => (await store()).udp?.status).toBe('in-progress');
    await walkToPractice(page);
    await expect.poll(async () => (await store()).udp?.status).toBe('finished');
    await expect(row(page, 'what-is-udp').locator('.outline__lesson-status')).toContainText('Done');
    await expect(page.locator('.track__got').first()).toContainText('2 of 14 done');
    // TCP's row: its own status (D-22); the strip's orange segment is the 4th.
    await expect(row(page, 'what-is-tcp').locator('.outline__lesson-status')).toContainText('Done');
    expect(await page.locator('.track__got .cable i[data-s="here"]').evaluate((el) => [...el.parentElement!.children].indexOf(el))).toBe(3);
  });

  test('the current lesson\'s own row is a page load; the track crumb is a page load (B44-6.9, 0.4, D-23)', async ({ page }) => {
    const json = watchJson(page);
    await openMarked(page, TCP);
    await Promise.all([page.waitForURL(`**${TCP}`), page.waitForEvent('framenavigated'), row(page, 'what-is-tcp').click()]);
    await hydrated(page);
    expect((await sameDocument(page)).mark).toBe(false);
    await openMarked(page, TCP);
    await Promise.all([page.waitForURL('**/tracks'), page.locator('.top__trk a, .console__top a[href="/tracks"]').first().click()]);
    expect(json).toStrictEqual([]);
  });
});

// ================================================================ which changes swap, which load a page (decision 1, 2, 7)

test.describe('what is not a swap', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  /** Presses with `action` and expects a page load of `path`, with no data fetched and no mark ever drawn. */
  async function expectLoad(page: Page, path: string, action: () => Promise<void>, json: string[]): Promise<void> {
    await page.evaluate(() => {
      (window as unknown as { __t0: number }).__t0 = performance.now();
    });
    await recordMarks(page);
    const navigated = page.waitForEvent('framenavigated', (f) => f === page.mainFrame() && new URL(f.url()).pathname === path);
    await action();
    await navigated;
    expect(json, 'no lesson data fetched').toStrictEqual([]);
  }

  test('another drawing is a page load: Subnetting to Router by "Next lesson", Switch to ARP by the row, IP Address to MAC Address, TLS/SSL to Firewalls by "Next lesson" and the card, Load Balancers beside Proxies (B44-0.2, 0.3, 0.5, D-30)', async ({ page }) => {
    const json = watchJson(page);
    // Subnetting (subnet) to Router (net-map) by "Next lesson".
    await open(page, '/networking/subnetting');
    await walkToPractice(page);
    await expectLoad(page, '/networking/router', () => nextButton(page).click(), json);
    // Switch (switch) to ARP (net-map) by the outline row.
    await open(page, '/networking/switch');
    await expectLoad(page, '/networking/arp', () => pressRow(page, 'arp'), json);
    // IP Address (subnet) to MAC Address (dhcp).
    await open(page, '/networking/ip-address');
    await expectLoad(page, '/networking/mac-address', () => pressRow(page, 'mac-address'), json);
    // TLS/SSL (net-map) to Firewalls (firewall): "Next lesson", then the Up next card.
    await open(page, '/networking/what-is-tls');
    await walkToPractice(page);
    await expectLoad(page, '/networking/firewalls', () => nextButton(page).click(), json);
    await open(page, '/networking/what-is-tls');
    await walkToPractice(page);
    await expectLoad(page, '/networking/firewalls', () => page.locator('a.upnext').click(), json);
    // Proxies (net-map) and the next lesson, Load Balancers (pool): the rule is the drawing, not the neighbour.
    await open(page, '/networking/proxies');
    await expectLoad(page, '/networking/load-balancers', () => pressRow(page, 'load-balancers'), json);
    // The track crumb and the track title are page loads.
    await open(page, TCP);
    await expectLoad(page, HTIW, () => page.locator('.console__top a.track__title').click(), json);
  });

  test('the rule is the figure, not adjacency: Networking\'s ARP row pressed at Packets is a swap (B44-0.5)', async ({ page }) => {
    await openMarked(page, '/networking/packets');
    await pressRow(page, 'arp');
    await expect(page).toHaveURL(/\/networking\/arp$/);
    expect((await sameDocument(page)).navigations).toBe(1);
  });

  test('Networking: Ports to TCP/UDP and TCP/UDP to NAT swap (D-30)', async ({ page }) => {
    await openMarked(page, '/networking/ports');
    await pressRow(page, 'tcp-udp');
    await expect(page).toHaveURL(/\/networking\/tcp-udp$/);
    await expect(live(page)).toHaveText('TCP/UDP. Lesson 11 of 20. Overview.');
    await pressRow(page, 'nat');
    await expect(page).toHaveURL(/\/networking\/nat$/);
    expect((await sameDocument(page)).navigations).toBe(1);
  });

  test('a modified press is the browser\'s own: Ctrl, Cmd, Shift, Alt and a middle click on a row and on the card; "Next lesson" with a modifier is today\'s load in the same tab (B44-7.1, 7.3, E71)', async ({ page }) => {
    const json = watchJson(page);
    // A modified click is dispatched into the page (a real Ctrl-click is a context menu on macOS); `dispatchEvent` says whether it was cancelled.
    // The browser then does what it does with it (a new tab, a window, a load), so each starts from a fresh page.
    for (const key of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey'] as const) {
      await openMarked(page, TCP);
      const prevented = await page.evaluate((k) => {
        const link = document.querySelector('.console__track a[href$="what-is-udp"]')!;
        return !link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, [k]: true }));
      }, key);
      expect(prevented, `${key}-click on the row`).toBe(false);
      await page.waitForTimeout(300);
      for (const other of page.context().pages()) if (other !== page) await other.close();
    }
    // The Up next card, modified.
    await openMarked(page, TCP);
    await walkToPractice(page);
    const cardPrevented = await page.evaluate(() => !document.querySelector('a.upnext')!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, shiftKey: true })));
    expect(cardPrevented).toBe(false);
    for (const other of page.context().pages()) if (other !== page) await other.close();
    // A middle click raises `auxclick`, which the console never listens to.
    await openMarked(page, TCP);
    await row(page, 'what-is-udp').click({ button: 'middle' });
    await page.waitForTimeout(150);
    for (const other of page.context().pages()) if (other !== page) await other.close();
    expect(json).toStrictEqual([]);
    expect(await page.evaluate(() => (window as unknown as { __pushes: number }).__pushes)).toBe(0);
    expect(new URL(page.url()).pathname).toBe(TCP);
    await walkToPractice(page);
    // "Next lesson" with Shift: a page load in this tab (today's), not a swap.
    const loaded = page.waitForEvent('framenavigated', (f) => f === page.mainFrame() && new URL(f.url()).pathname === UDP);
    await nextButton(page).click({ modifiers: ['Shift'] });
    await loaded;
    expect(json).toStrictEqual([]);
  });

  test('a click another handler has prevented is left alone (B44-7.4)', async ({ page }) => {
    const json = watchJson(page);
    await openMarked(page, TCP);
    await page.evaluate(() => {
      document.querySelector('.console__track')!.addEventListener('click', (e) => e.preventDefault(), true);
    });
    await row(page, 'what-is-udp').click();
    await page.waitForTimeout(300);
    expect(json).toStrictEqual([]);
    expect(new URL(page.url()).pathname).toBe(TCP);
  });

  test('Enter on a row and Space on "Next lesson" swap (B44-7.2)', async ({ page }) => {
    await openMarked(page, TCP);
    await row(page, 'what-is-udp').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${UDP}$`));
    await walkToPractice(page);
    await nextButton(page).focus();
    await page.keyboard.press('Space');
    await expect(page).toHaveURL(/what-is-ip$/);
    expect((await sameDocument(page)).navigations).toBe(1);
    // "Next lesson": the same button keeps focus, named for the next place (D-16, E69).
    await expect(nextButton(page)).toBeFocused();
    await expect(nextButton(page)).toHaveAccessibleName(/^Next: .+, step 1$/);
  });

  test('a press before the island listens is a page load with no data fetched; without JavaScript the row is a plain link (B44-1.2, 1.3)', async ({ page, browser }) => {
    const json = watchJson(page);
    // Hold the console's script.
    await page.route('**/_astro/LessonConsole.*.js', async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });
    await page.goto(TCP, { waitUntil: 'domcontentloaded' });
    const loaded = page.waitForEvent('framenavigated', (f) => f === page.mainFrame() && new URL(f.url()).pathname === UDP);
    await row(page, 'what-is-udp').click();
    await loaded;
    expect(json).toStrictEqual([]);
    // JavaScript off.
    const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const bare = await plain.newPage();
    const bareJson = watchJson(bare);
    await bare.goto(TCP);
    await bare.locator('.console__track a.outline__lesson[href$="what-is-udp"]').click();
    await expect(bare).toHaveURL(new RegExp(`${UDP}$`));
    expect(bareJson).toStrictEqual([]);
    await plain.close();
  });
});
