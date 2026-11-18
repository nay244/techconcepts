import { expect, test, type Page } from '@playwright/test';
// @ts-expect-error - no @types/node in this project; the e2e files run under node
import { readFileSync } from 'node:fs';
// @ts-expect-error - no @types/node in this project; the e2e files run under node
import { gzipSync } from 'node:zlib';
import { hydrated, open, readyLessons, requireLessons, settledFrame, transitionsDone } from './support';

/**
 * The track page in the Card stack, layout 1, Route (job 21, B25; prototypes/d20-track-page-card-stack.md §11 and
 * prototypes/d20-cases.md): what a person sees and a script cannot fake. Progress is seeded as an earlier visit left it,
 * before the page loads. Every read after a state, scroll or focus change waits with `transitionsDone`.
 */

const lessons = readyLessons();
requireLessons(lessons);

type Rec = { status: 'finished' | 'in-progress'; furthestPosition: number; lastOpened?: string };
type Seed = Record<string, Rec>;
const slugsOf = (track: string): string[] => lessons.filter((l) => l.path.startsWith(`/${track}/`)).map((l) => l.slug);
const finished = (slugs: string[]): Seed => Object.fromEntries(slugs.map((s) => [s, { status: 'finished' as const, furthestPosition: 99 }]));
const record = (seed: Seed, last: string | null): string =>
  JSON.stringify({
    version: 2,
    lessons: Object.fromEntries(Object.entries(seed).map(([k, v]) => [k, { status: v.status, furthestPosition: v.furthestPosition, lastOpened: v.lastOpened ?? '2026-11-05T12:00:00Z' }])),
    lastLesson: last,
    lastTrack: null,
  });
const seedInit = (page: Page, seed: Seed, last: string | null = null) =>
  page.addInitScript((value) => window.localStorage.setItem('techconcepts:v2', value), record(seed, last));

const HIW = 'how-the-internet-works';
const NET = 'networking';
const TRACKS = [
  { id: HIW, path: `/${HIW}`, lessons: 14, title: 'How the Internet Works' },
  { id: NET, path: `/${NET}`, lessons: 20, title: 'Networking Concepts' },
] as const;

const S1: Seed = { ...finished(['what-is-http', 'what-is-https', 'what-is-tcp']), 'what-is-udp': { status: 'in-progress', furthestPosition: 4 } };
const S2: Seed = finished(['what-is-http', 'what-is-https', 'what-is-tcp']);
const S3 = (track: string): Seed => finished(slugsOf(track));
const S6: Seed = {
  'what-is-tcp': { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-05T10:00:00Z' },
  'what-is-dns': { status: 'in-progress', furthestPosition: 2, lastOpened: '2026-11-05T11:00:00Z' },
};
/** The first ten lessons of the track finished, the eleventh in progress ("10 of N"). */
const S7 = (track: string): Seed => {
  const slugs = slugsOf(track);
  return { ...finished(slugs.slice(0, 10)), [slugs[10]!]: { status: 'in-progress', furthestPosition: 2 } };
};

/** The colour a token resolves to, through a probe. */
const token = (page: Page, name: string): Promise<string> =>
  page.evaluate((n) => {
    const d = document.createElement('div');
    document.body.append(d);
    d.style.color = `var(${n})`;
    const c = getComputedStyle(d).color;
    d.remove();
    return c;
  }, name);

/** Waits for fonts and a settled frame, then for every transition to end. */
const settle = async (page: Page): Promise<void> => {
  await page.evaluate(() => document.fonts.ready);
  await settledFrame(page);
  await transitionsDone(page);
};
/** A page with its progress loaded: islands hydrated and settled. */
async function visit(page: Page, path: string, seed?: Seed, last: string | null = null): Promise<void> {
  if (seed !== undefined) await seedInit(page, seed, last);
  await open(page, path);
  await settle(page);
}

const VIEWS = [
  ['1440', { width: 1440, height: 900 }],
  ['375', { width: 375, height: 812 }],
] as const;
const desktopOnly = { isMobile: false, hasTouch: false } as const;

// ---------------------------------------------------------------- what the page says (checks 4, 5, 8, 10 to 13)

for (const [vname, viewport] of VIEWS) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`what the page says, ${vname} ${colorScheme}`, () => {
      test.use({ viewport, colorScheme, ...desktopOnly });

      for (const t of TRACKS) {
        const states = [
          { name: 'S0 first visit', seed: {} as Seed, tab: 'First lesson', btn: 'Start', chip: 'ahead', here: false },
          { name: 'S1 part way', seed: S1, tab: 'Up next', btn: t.id === HIW ? 'Continue' : 'Start', chip: 'here', here: true },
          { name: 'S3 finished', seed: S3(t.id), tab: '✓ Done so far', btn: 'Watch again', chip: 'done', here: false },
        ];
        for (const st of states) {
          test(`${t.id} ${st.name}: the tab, the chip, the one button, "Start here" only in the lede`, async ({ page }) => {
            await visit(page, t.path, st.seed);
            const card = page.locator('main .upnext');
            await expect(card.locator('.upnext__k')).toHaveText(st.tab);
            await expect(card.locator('.upnext__k')).toHaveClass(st.here ? /\bcs-tab--here\b/ : /^(?!.*cs-tab--here)/);
            await expect(card.locator('.upnext__n')).toHaveAttribute('data-state', st.chip);
            await expect(card.locator('.upnext__n')).toHaveText(/^Lesson \d\d$/);
            await expect(card.locator('.upnext__btn')).toHaveText(st.btn);
            // One filled button on the page, an a, as wide as the card's inside.
            await expect(page.locator('main .btn')).toHaveCount(1);
            await expect(page.locator('main button')).toHaveCount(0);
            await expect(page.locator('main .btn')).toHaveClass(/\bupnext__btn\b/);
            const w = await page.evaluate(() => {
              const c = document.querySelector('.upnext')!;
              return { btn: document.querySelector('.upnext__btn')!.getBoundingClientRect().width, inside: c.clientWidth - 36 };
            });
            expect(Math.abs(w.btn - w.inside)).toBeLessThanOrEqual(1);
            // "Start here" is on the page only in How the Internet Works' description.
            const found = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => el.children.length === 0 && /Start here/.test(el.textContent ?? '')).map((el) => el.className || el.tagName));
            expect(found).toEqual(t.id === HIW ? ['lede'] : []);
            if (t.id === HIW) await expect(page.locator('main .lede')).toContainText('Start here if you are new to IT');
          });
        }
      }
    });
  }
}

test.describe('the way in leads where progress says, on the built pages (check 8)', () => {
  test.use({ viewport: { width: 1440, height: 900 }, ...desktopOnly });
  const href = (page: Page) => page.locator('main .upnext__btn').getAttribute('href');

  test('S1: Continue to UDP at step 4 on How the Internet Works; Start to OSI Model on Networking, which counts the shared HTTP and HTTPS', async ({ page }) => {
    await visit(page, `/${HIW}`, S1, 'what-is-udp');
    expect(await href(page)).toBe(`/${HIW}/what-is-udp?step=4`);
    await expect(page.locator('main .upnext__t')).toHaveText('UDP');
    await expect(page.locator('main .upnext__n')).toHaveText('Lesson 04');
    await expect(page.locator('main .upnext__s')).toHaveText('Quick, no guarantees');
    await expect(page.locator('main .strip__w')).toHaveText('3 of 14 lessons done');
    await page.goto(`/${NET}`);
    await hydrated(page);
    await settle(page);
    await expect(page.locator('main .strip__w')).toHaveText('2 of 20 lessons done');
    await expect(page.locator('main .upnext__btn')).toHaveText('Start');
    expect(await href(page)).toBe('/networking/osi-model');
    await expect(page.locator('main .upnext__n')).toHaveText('Lesson 01');
    await expect(page.locator('main .upnext__k')).toHaveText('Up next');
  });

  test('S4: a shared lesson in progress is Lesson 01 in the tour and Lesson 14 in Networking, each Continue to its own track', async ({ page }) => {
    const seed: Seed = { 'what-is-http': { status: 'in-progress', furthestPosition: 2 } };
    await visit(page, `/${HIW}`, seed, 'what-is-http');
    await expect(page.locator('main .upnext__n')).toHaveText('Lesson 01');
    expect(await href(page)).toBe(`/${HIW}/what-is-http?step=2`);
    await page.goto(`/${NET}`);
    await hydrated(page);
    await settle(page);
    await expect(page.locator('main .upnext__n')).toHaveText('Lesson 14');
    expect(await href(page)).toBe('/networking/what-is-http?step=2');
  });

  test('S3: Watch again goes to the last lesson, the same address as its own stop; a lesson in progress at 99 resumes at its last step, not 99', async ({ page }) => {
    await visit(page, `/${HIW}`, S3(HIW), 'what-is-tls');
    const btn = (await href(page))!;
    expect(btn).toBe(`/${HIW}/what-is-tls`);
    await expect(page.locator('main .upnext__t')).toHaveText('TLS/SSL');
    expect(await page.locator('main li.stop h3 a').last().getAttribute('href')).toBe(btn);
    // The step is kept within the lesson: a record at 99 gives the lesson's own last step.
    const ctx = await page.context().browser()!.newContext({ viewport: { width: 1440, height: 900 } });
    const page2 = await ctx.newPage();
    await visit(page2, `/${HIW}`, { 'what-is-tls': { status: 'in-progress', furthestPosition: 99 } }, 'what-is-tls');
    const resume = (await page2.locator('main .upnext__btn').getAttribute('href'))!;
    expect(resume).toMatch(new RegExp(`^/${HIW}/what-is-tls\\?step=\\d+$`));
    expect(resume).not.toContain('step=99');
    expect(await page2.locator('main li.stop h3 a').last().getAttribute('href')).toBe(resume);
    await ctx.close();
  });

  test('S2: one lesson finished and the next not started: Start to it, with no step', async ({ page }) => {
    await visit(page, `/${HIW}`, S2, 'what-is-tcp');
    await expect(page.locator('main .upnext__n')).toHaveText('Lesson 04');
    await expect(page.locator('main .upnext__btn')).toHaveText('Start');
    expect(await href(page)).toBe(`/${HIW}/what-is-udp`);
    const udp = page.locator('main li.stop', { hasText: 'UDP' });
    await expect(udp).toHaveClass(/\bstop--now\b/);
    await expect(udp.locator('.stop__k')).toHaveText('Not started');
    await expect(udp.locator('.wlp')).toHaveCount(0);
    const tcp = page.locator('main li.stop', { hasText: 'TCP' }).first();
    await expect(tcp).toHaveClass(/\bstop--done\b/);
    await expect(tcp.locator('.stop__k')).toHaveText('✓ Done');
  });

  test('S1: UDP’s stop is the up-next one with its marks, the rest plain; S6: only the lesson opened last is up next', async ({ page, browser }) => {
    await visit(page, `/${HIW}`, S1, 'what-is-udp');
    const udp = page.locator('main li.stop', { hasText: 'UDP' });
    await expect(udp).toHaveClass(/\bstop--now\b/);
    await expect(udp.locator('.stop__k')).toHaveText('In progress');
    await expect(udp.locator('.stop__k')).toHaveClass(/\bgo\b/);
    await expect(udp.locator('.wlp')).toHaveAttribute('aria-label', /^In progress, at (Watch|Learn|Practice)$/);
    await expect(udp.locator('.wlp__p')).toHaveText(['Watch', 'Learn', 'Practice']);
    await expect(udp.locator('.wlp__p.is-now')).toHaveCount(1);
    await expect(udp.locator('h3 a')).toHaveAttribute('href', `/${HIW}/what-is-udp?step=4`);
    await expect(page.locator('main li.stop--now')).toHaveCount(1);
    await expect(page.locator('main .strip__sq i[data-state="current"]')).toHaveCount(1);

    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page2 = await ctx.newPage();
    await visit(page2, `/${HIW}`, S6, 'what-is-dns');
    await expect(page2.locator('main li.stop--now h3')).toHaveText('DNS');
    const tcp = page2.locator('main li.stop', { hasText: 'TCP' }).first();
    await expect(tcp).not.toHaveClass(/stop--now/);
    await expect(tcp.locator('.stop__k')).toHaveText('In progress');
    await expect(tcp.locator('.wlp')).toHaveCount(1);
    expect(await tcp.evaluate((el) => getComputedStyle(el).backgroundImage)).toBe('none');
    await ctx.close();
  });
});

// ---------------------------------------------------------------- no JavaScript (check 15)

for (const t of TRACKS) {
  for (const [vname, viewport] of VIEWS) {
    for (const [cname, scheme] of [['light', 'light'], ['dark by the system', 'dark']] as const) {
      test.describe(`JavaScript off, ${t.id} ${vname} ${cname}`, () => {
        test.use({ viewport, colorScheme: scheme, javaScriptEnabled: false, ...desktopOnly });
        test('the page is the first-visit state in full, the links work, the theme button is hidden, the edges are the ink', async ({ page, request }) => {
          await page.goto(t.path);
          await expect(page.locator('main .upnext__k')).toHaveText('First lesson');
          await expect(page.locator('main .upnext__n')).toHaveAttribute('data-state', 'ahead');
          await expect(page.locator('main .upnext__n')).toHaveText('Lesson 01');
          await expect(page.locator('main .upnext__btn')).toHaveText('Start');
          await expect(page.locator('main .strip__sq i[data-state="ready"]')).toHaveCount(t.lessons);
          await expect(page.locator('main .strip__sq i[data-state="current"]')).toHaveCount(0);
          await expect(page.locator('main .strip__w')).toHaveText(`0 of ${t.lessons} lessons done`);
          await expect(page.locator('main li.stop .stop__k')).toHaveText(Array(t.lessons).fill('Not started'));
          await expect(page.locator('main .stop--now, main .stop--done, main .wlp')).toHaveCount(0);
          await expect(page.locator('main li.stop a')).toHaveCount(t.lessons);
          await expect(page.locator('main li.stop')).toHaveCount(t.lessons);
          await expect(page.locator('main button:visible')).toHaveCount(0);
          await expect(page.locator('.site-head .theme-toggle')).toBeHidden();
          // Every lesson link works: follow three.
          const hrefs = await page.locator('main li.stop h3 a').evaluateAll((a) => a.map((x) => (x as HTMLAnchorElement).getAttribute('href')!));
          for (const h of [hrefs[0]!, hrefs[Math.floor(hrefs.length / 2)]!, hrefs.at(-1)!]) {
            const res = await request.get(h);
            expect(res.status(), h).toBe(200);
          }
          expect(await page.locator('main .upnext__btn').getAttribute('href')).toBe(hrefs[0]);
          // Card edges and the button's edge are the ink (the dark-by-system twin of the token).
          const ink = await token(page, scheme === 'dark' ? '--ink' : '--ink-strong');
          const edges = await page.evaluate(() => [document.querySelector('.upnext')!, document.querySelector('li.stop')!, document.querySelector('.upnext__btn')!].map((el) => getComputedStyle(el).borderTopColor));
          expect(edges).toEqual([ink, ink, ink]);
        });
      });
    }
  }
}

test.describe('JavaScript off, the side column sticks and the route sits at its right', () => {
  test.use({ javaScriptEnabled: false, ...desktopOnly });
  for (const [w, h] of [[1024, 768], [1440, 900]] as const) {
    test(`${w} x ${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      for (const t of TRACKS) {
        await page.goto(t.path);
        const g = await page.evaluate(() => ({
          pos: getComputedStyle(document.querySelector('.side')!).position,
          side: document.querySelector('.side')!.getBoundingClientRect().right,
          route: document.querySelector('.route')!.getBoundingClientRect().left,
          down: document.documentElement.scrollHeight - innerHeight,
        }));
        expect(g.pos, t.id).toBe('sticky');
        expect(g.route, t.id).toBeGreaterThan(g.side);
        expect(g.down, t.id).toBeGreaterThan(0);
      }
    });
  }
});

// ---------------------------------------------------------------- storage blocked (S5, S5b) and heights (check 16)

const STORAGE_BLOCKED = {
  S5: () => {
    Storage.prototype.getItem = () => {
      throw new DOMException('denied', 'SecurityError');
    };
  },
  S5b: () => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('denied', 'SecurityError');
      },
    });
  },
} as const;

test.describe('what moves when progress loads (check 16)', () => {
  test.use({ ...desktopOnly });

  const boxes = (page: Page) =>
    page.evaluate(() => {
      const r = (el: Element) => {
        const b = el.getBoundingClientRect();
        return [Math.round(b.top + scrollY), Math.round(b.height * 10) / 10] as [number, number];
      };
      return {
        stops: [...document.querySelectorAll('li.stop')].map(r),
        upnext: r(document.querySelector('.upnext')!),
        strip: r(document.querySelector('.strip')!),
        page: document.documentElement.scrollHeight,
      };
    });

  for (const t of TRACKS) {
    for (const [w, h, grows] of [[700, 900, 0], [768, 1024, 0], [1024, 700, 0], [1200, 800, 0], [1440, 900, 0], [375, 812, 22], [390, 844, 22], [320, 640, 44]] as const) {
      test(`${t.id} ${w} wide: the server's render against the hydrated one, with a lesson in progress: ${grows === 0 ? 'nothing moves' : `its stop grows ${grows}px and what is below it moves down by it`}`, async ({ page }) => {
        const seed: Seed = t.id === HIW ? S1 : { subnetting: { status: 'in-progress', furthestPosition: 3 } };
        const growing = t.id === HIW ? 'UDP' : 'Subnetting';
        await page.setViewportSize({ width: w, height: h });
        await seedInit(page, seed, t.id === HIW ? 'what-is-udp' : 'subnetting');
        // The islands' scripts are held, so the first read is the server's render; they are let go after it.
        let release!: () => void;
        const gate = new Promise<void>((resolve) => (release = resolve));
        await page.route(/\/_astro\/Track(Side|Route)[^/]*\.js/, async (route) => {
          await gate;
          await route.continue();
        });
        await page.goto(t.path, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('astro-island[ssr]').first()).toBeAttached();
        await page.evaluate(() => document.fonts.ready);
        await settledFrame(page);
        const before = await boxes(page);
        release();
        await hydrated(page);
        await settle(page);
        const after = await boxes(page);
        expect(after.upnext[1], '.upnext').toBe(before.upnext[1]);
        expect(after.strip[1], '.strip').toBe(before.strip[1]);
        expect(Math.abs(after.upnext[0] - before.upnext[0])).toBeLessThanOrEqual(1);
        const i = (await page.locator('li.stop h3').allTextContents()).indexOf(growing);
        expect(i).toBeGreaterThanOrEqual(0);
        const tol = grows === 0 ? 1 : 2;
        for (const [n, [top, height]] of after.stops.entries()) {
          const [bt, bh] = before.stops[n]!;
          if (n < i) expect(Math.abs(top - bt), `stop ${n} above`).toBeLessThanOrEqual(1);
          if (n === i) expect(Math.abs(height - bh - grows), 'the stop in progress').toBeLessThanOrEqual(tol);
          if (n > i) expect(Math.abs(top - bt - grows), `stop ${n} below`).toBeLessThanOrEqual(tol);
        }
        expect(Math.abs(after.page - before.page - grows), 'the page').toBeLessThanOrEqual(tol);
      });
    }
  }

  // The strip's words keep their width: S0 against S7 against S3 at the widths where the longest form wrapped (H2).
  for (const [id, widths] of [[HIW, [392, 393, 395, 397, 398, 399]], [NET, [473, 476, 480, 481, 482]]] as const) {
    test(`H2: ${id}'s strip is as tall for 0, 10 and every lesson done, at ${widths.join(', ')} wide`, async ({ browser }) => {
      const heightsAt = async (seed: Seed, w: number) => {
        const ctx = await browser.newContext({ viewport: { width: w, height: 852 }, ...desktopOnly });
        const page = await ctx.newPage();
        await visit(page, `/${id}`, seed, null);
        const out = await page.evaluate(() => ({ strip: document.querySelector('.strip')!.getBoundingClientRect().height, page: document.documentElement.scrollHeight }));
        await ctx.close();
        return out;
      };
      for (const w of widths) {
        const s0 = await heightsAt({}, w);
        const s3 = await heightsAt(S3(id), w);
        const s7 = await heightsAt(S7(id), w);
        expect(Math.abs(s3.strip - s0.strip), `${w} S3`).toBeLessThanOrEqual(1);
        expect(Math.abs(s7.strip - s0.strip), `${w} S7`).toBeLessThanOrEqual(1);
        expect(Math.abs(s3.page - s0.page), `${w} S3 page`).toBeLessThanOrEqual(1);
      }
    });
  }

  for (const t of TRACKS) {
    for (const w of [320, 375, 390, 768, 1440]) {
      test(`${t.id} at ${w}: the page is as tall on a first visit, finished, storage blocked (both ways) and with JavaScript off`, async ({ browser }) => {
        const read = async (setup: (page: Page) => Promise<void>, js = true) => {
          const ctx = await browser.newContext({ viewport: { width: w, height: w === 1440 ? 900 : 812 }, javaScriptEnabled: js, ...desktopOnly });
          const page = await ctx.newPage();
          await setup(page);
          await page.goto(t.path);
          if (js) {
            await hydrated(page);
            await settle(page);
          } else {
            // No script: the frame wait runs in the page, so only fonts and the transitions are waited for.
            await page.evaluate(() => document.fonts.ready);
            await transitionsDone(page);
          }
          const hh = await page.evaluate(() => document.documentElement.scrollHeight);
          await ctx.close();
          return hh;
        };
        const base = await read(async () => {});
        expect(Math.abs((await read(async (p) => void (await seedInit(p, S3(t.id), null)))) - base), 'finished').toBeLessThanOrEqual(1);
        expect(Math.abs((await read(async (p) => void (await p.addInitScript(STORAGE_BLOCKED.S5)))) - base), 'S5').toBeLessThanOrEqual(1);
        expect(Math.abs((await read(async (p) => void (await p.addInitScript(STORAGE_BLOCKED.S5b)))) - base), 'S5b').toBeLessThanOrEqual(1);
        expect(Math.abs((await read(async () => {}, false)) - base), 'no JS').toBeLessThanOrEqual(1);
      });
    }
  }

  test('with storage blocked the page shows a first visit and no error', async ({ browser }) => {
    for (const blocked of [STORAGE_BLOCKED.S5, STORAGE_BLOCKED.S5b]) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.addInitScript(blocked);
      await open(page, `/${NET}`);
      await expect(page.locator('main .upnext__k')).toHaveText('First lesson');
      await expect(page.locator('main .strip__w')).toHaveText('0 of 20 lessons done');
      expect(errors).toEqual([]);
      await ctx.close();
    }
  });

  test('the up-next card is 186px for every lesson of both tracks put up next, in each kind, at 320 and 1440', async ({ browser }) => {
    test.setTimeout(480_000);
    for (const w of [320, 1440]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w === 320 ? 640 : 900 }, ...desktopOnly });
      for (const t of TRACKS) {
        const slugs = slugsOf(t.id);
        for (const [i, slug] of slugs.entries()) {
          // The lessons before it finished and it in progress; then it not started.
          for (const kind of ['progress', 'start'] as const) {
            const seed: Seed = { ...finished(slugs.slice(0, i)) };
            if (kind === 'progress') seed[slug] = { status: 'in-progress', furthestPosition: 2 };
            const page = await ctx.newPage();
            await seedInit(page, seed, slug);
            await page.goto(t.path);
            await hydrated(page);
            await settledFrame(page);
            const h = await page.locator('main .upnext').evaluate((el) => el.getBoundingClientRect().height);
            expect(Math.abs(h - 186), `${t.id} ${slug} ${kind} at ${w}`).toBeLessThanOrEqual(1);
            await page.close();
          }
        }
      }
      await ctx.close();
    }
  });
});

// ---------------------------------------------------------------- the look (checks 17 to 25)

for (const [vname, viewport] of VIEWS) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`the look, ${vname} ${colorScheme}`, () => {
      test.use({ viewport, colorScheme, ...desktopOnly });

      for (const t of TRACKS) {
        test(`${t.id}: the up-next card, a stop, the chips, the strip, the wash, the links`, async ({ page }) => {
          await visit(page, t.path, S1, 'what-is-udp');
          const edge = await token(page, '--cs-edge');
          const card = await token(page, '--cs-card');
          const here = await token(page, '--cs-here');
          const hereInk = await token(page, '--cs-here-ink');
          const done = await token(page, '--cs-done');
          const inkStrong = await token(page, '--ink-strong');

          // 17: the up-next card.
          const up = await page.locator('.upnext').evaluate((el) => {
            const s = getComputedStyle(el);
            const tab = el.querySelector('.upnext__k')!;
            const ts = getComputedStyle(tab);
            const tr = tab.getBoundingClientRect();
            const er = el.getBoundingClientRect();
            const hit = document.elementFromPoint(tr.left + tr.width / 2, tr.top + tr.height / 2);
            const marker = getComputedStyle(tab, '::before');
            return {
              borders: [s.borderTopStyle, s.borderRightStyle, s.borderBottomStyle, s.borderLeftStyle],
              width: s.borderTopWidth,
              color: s.borderTopColor,
              radii: [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius].join(' '),
              shadow: s.boxShadow,
              tabH: tr.height,
              tabBottomBorder: ts.borderBottomWidth,
              tabFoot: Math.abs(tr.bottom - (er.top + 2)),
              tabLeft: Math.abs(tr.left - er.left),
              hit: hit === tab || tab.contains(hit),
              marker: `${marker.width} ${marker.height}`,
              markerBg: marker.backgroundColor,
              left: er.left,
              boxWidth: er.width,
            };
          });
          expect(up.borders).toEqual(['solid', 'solid', 'solid', 'solid']);
          expect(up.width).toBe('2px');
          expect(up.color).toBe(edge);
          expect(up.radii).toBe('0px 10px 10px 10px');
          const stack = vname === '375' ? '4px' : '6px';
          expect(up.shadow).toContain(`${stack} ${stack} 0px -2px`);
          expect(up.shadow).toContain(`${stack} ${stack} 0px 0px`);
          expect(Math.abs(up.tabH - 34)).toBeLessThanOrEqual(0.5);
          expect(up.tabBottomBorder).toBe('0px');
          expect(up.tabFoot).toBeLessThanOrEqual(2);
          expect(up.tabLeft).toBeLessThanOrEqual(1);
          expect(up.hit, 'the tab is on top of the card').toBe(true);
          expect(up.marker).toBe('9px 9px');
          expect(up.markerBg).toBe(here);
          if (vname === '375') expect(Math.abs(up.left - 14)).toBeLessThanOrEqual(1);
          else expect(up.boxWidth).toBeLessThanOrEqual(480);

          // 18, 19, 22: stops and chips.
          const stops = await page.locator('li.stop').evaluateAll((els) =>
            els.map((el) => {
              const s = getComputedStyle(el);
              const n = el.querySelector('.stop__node')!;
              const ns = getComputedStyle(n);
              const nr = n.getBoundingClientRect();
              return {
                title: el.querySelector('h3')!.textContent!,
                cls: el.className,
                border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor} ${s.borderTopLeftRadius}`,
                bg: s.backgroundColor,
                img: s.backgroundImage,
                shadow: s.boxShadow,
                h: el.getBoundingClientRect().height,
                chip: { w: nr.width, h: nr.height, bw: ns.borderTopWidth, bc: ns.borderTopColor, bg: ns.backgroundColor, color: ns.color, size: ns.fontSize, shown: (n.textContent ?? '') !== '' && ns.color !== 'rgba(0, 0, 0, 0)' },
              };
            }),
          );
          for (const s of stops) {
            expect(s.border, s.title).toBe(`2px solid ${edge} 10px`);
            expect(s.bg, s.title).toBe(card);
            expect(s.shadow, s.title).toBe('none');
            const isNow = /stop--now/.test(s.cls);
            const isDone = /stop--done/.test(s.cls);
            expect([s.chip.w, s.chip.h, s.chip.bw, s.chip.bc, s.chip.size, s.chip.shown], s.title).toEqual([34, 34, '2px', edge, '14px', true]);
            expect(s.chip.bg, `${s.title} chip ground`).toBe(isNow ? here : isDone ? done : card);
            expect(s.chip.color, `${s.title} chip number`).toBe(isNow ? hereInk : isDone ? card : inkStrong);
            // 22: the wash on the up-next stop alone.
            if (isNow) expect(s.img, s.title).toMatch(/^linear-gradient\(/);
            else expect(s.img, s.title).toBe('none');
          }
          expect(stops.filter((s) => /stop--now/.test(s.cls))).toHaveLength(1);
          expect(Math.abs(stops[0]!.h - (vname === '1440' ? 81 : 110)), 'a stop').toBeLessThanOrEqual(2);

          // 19 for the card's chip.
          const cardChip = await page.locator('.upnext__n').evaluate((el) => {
            const s = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return [r.width, r.height, s.borderTopWidth, s.backgroundColor, s.color, s.fontSize];
          });
          expect(cardChip).toEqual([34, 34, '2px', here, hereInk, '14px']);

          // 21: the strip.
          const sq = await page.locator('.strip__sq i').evaluateAll((els) =>
            els.map((el) => {
              const s = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              return { state: el.getAttribute('data-state'), w: r.width, h: r.height, bg: s.backgroundColor, ring: s.boxShadow, op: s.opacity };
            }),
          );
          for (const q of sq) {
            expect(q.w).toBe(10);
            expect(q.op).toBe('1');
            expect(q.ring).toContain('inset');
            expect(q.ring).toContain(edge);
            if (q.state === 'ready') expect(q.bg).toBe('rgba(0, 0, 0, 0)');
            if (q.state === 'done') expect(q.bg).toBe(done);
            if (q.state === 'current') {
              expect(q.bg).toBe(here);
              expect(q.h).toBe(14);
            } else expect(q.h).toBe(10);
          }
          const sw = await page.locator('.strip__w').evaluate((el) => {
            const s = getComputedStyle(el);
            return [s.fontFamily, s.fontSize, s.color, s.fontVariantNumeric];
          });
          expect(sw[0]!.toLowerCase()).toContain('atkinson hyperlegible next');
          expect(sw[0]!.toLowerCase()).not.toContain('mono');
          expect(sw[1]).toBe('15px');
          expect(sw[2]).toBe(await token(page, '--muted'));
          expect(sw[3]).toContain('tabular-nums');
          // A row of squares is 14px tall in every state.
          expect(await page.locator('.strip__sq').evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(14);

          // 24: every link in main that is not the button is underlined and none is the link colour.
          const link = await token(page, '--link');
          const links = await page.locator('main a:not(.btn)').evaluateAll((els) =>
            els.map((el) => {
              const s = getComputedStyle(el);
              return { text: el.textContent!, line: s.textDecorationLine, dec: s.textDecorationColor, color: s.color };
            }),
          );
          expect(links.length).toBeGreaterThan(5);
          for (const l of links) {
            expect(l.line, l.text).toContain('underline');
            expect(l.dec, l.text).not.toMatch(/rgba\(\d+, \d+, \d+, 0\)$/);
            expect(l.color, l.text).not.toBe(link);
          }
          // Hover on a stop, anywhere on the card, turns its name's underline to the name's colour.
          const stop = page.locator('li.stop:not(.stop--now)').nth(1);
          await stop.scrollIntoViewIfNeeded();
          await settle(page);
          const box = (await stop.boundingBox())!;
          await page.mouse.move(box.x + box.width - 8, box.y + box.height - 8);
          await settle(page);
          const hover = await stop.locator('h3 a').evaluate((el) => [getComputedStyle(el).textDecorationColor, getComputedStyle(el).color]);
          expect(hover[0]).toBe(hover[1]);
        });
      }

      test('the button: 48px, a 2px edge, the offset, pressed in; and the focus ring keeps its 8px corners', async ({ page }) => {
        await visit(page, `/${NET}`);
        const btn = page.locator('.upnext__btn');
        const edge = await token(page, '--cs-edge');
        const read = () =>
          btn.evaluate((el) => {
            const s = getComputedStyle(el);
            return { h: el.getBoundingClientRect().height, bw: s.borderTopWidth, bc: s.borderTopColor, r: s.borderTopLeftRadius, shadow: s.boxShadow, tf: s.transform };
          });
        const rest = await read();
        expect(rest.h).toBeGreaterThanOrEqual(48);
        expect(rest.bw).toBe('2px');
        expect(rest.bc).toBe(edge);
        expect(rest.r).toBe('8px');
        expect(rest.shadow).toContain('3px 3px 0px 0px');
        const b = (await btn.boundingBox())!;
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
        await page.mouse.down();
        await settle(page);
        const pressed = await read();
        expect(pressed.tf).toBe('matrix(1, 0, 0, 1, 2, 2)');
        expect(pressed.shadow).toContain('1px 1px 0px 0px');
        // Let go away from the link, so no navigation starts.
        await page.mouse.move(2, 2);
        await page.mouse.up();
        await settle(page);
        const back = await read();
        expect(back.tf).toBe('none');
        expect(back.shadow).toContain('3px 3px 0px 0px');
        // By keyboard: the focus ring keeps the button's 8px corners.
        await page.locator('main .crumbs a').focus();
        await page.keyboard.press('Tab');
        await settle(page);
        await expect(btn).toBeFocused();
        const f = await btn.evaluate((el) => [getComputedStyle(el).borderTopLeftRadius, getComputedStyle(el).outlineWidth, getComputedStyle(el).outlineStyle]);
        expect(f[0]).toBe('8px');
        expect(parseFloat(f[1]!)).toBeGreaterThanOrEqual(2);
        expect(f[2]).not.toBe('none');
      });

      test('the crumb and the last line: 3px corners on keyboard focus', async ({ page }) => {
        await visit(page, `/${HIW}`);
        // The skip link, then the crumb: the first stop in main, reached by keyboard.
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab');
        await settle(page);
        await expect(page.locator('main .crumbs a')).toBeFocused();
        expect(await page.locator('main .crumbs a').evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe('3px');
        await page.locator('main li.stop h3 a').last().focus();
        await page.keyboard.press('Tab');
        await settle(page);
        await expect(page.locator('main .route__end a')).toBeFocused();
        expect(await page.locator('main .route__end a').evaluate((el) => getComputedStyle(el).borderTopLeftRadius)).toBe('3px');
      });
    });
  }
}

// ---------------------------------------------------------------- the rail (check 20) and the phone card (check 35)

test.describe('the rail and the phone cards', () => {
  test.use({ ...desktopOnly });
  for (const t of TRACKS) {
    for (const w of [700, 768, 1024, 1440]) {
      test(`${t.id} at ${w}: the rail, each part's square, each chip on the rail and level with its card, joined by a bar`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: 900 });
        await visit(page, t.path);
        const edge = await token(page, '--cs-edge');
        const hair = await token(page, '--cs-hair');
        const g = await page.evaluate(() => {
          const route = document.querySelector('.route')!;
          const rr = route.getBoundingClientRect();
          const rs = getComputedStyle(route, '::before');
          const railMid = rr.left + parseFloat(rs.left) + parseFloat(rs.width) / 2;
          const squares = [...document.querySelectorAll('.route-stage h2')].map((h) => {
            const r = h.getBoundingClientRect();
            const s = getComputedStyle(h, '::before');
            return { w: s.width, h: s.height, bg: s.backgroundColor, mid: r.left + parseFloat(s.left) + parseFloat(s.width) / 2 };
          });
          const stops = [...document.querySelectorAll('li.stop')].map((li) => {
            const lr = li.getBoundingClientRect();
            const nr = li.querySelector('.stop__node')!.getBoundingClientRect();
            const b = getComputedStyle(li, '::before');
            return { midX: nr.left + nr.width / 2, midY: nr.top + nr.height / 2, cardMid: lr.top + lr.height / 2, bar: [b.width, b.height, b.backgroundColor], barLeft: lr.left + 2 + parseFloat(b.left), chipRight: nr.right, cardLeft: lr.left };
          });
          return { railW: rs.width, railBg: rs.backgroundColor, railMid, squares, stops };
        });
        expect(g.railW).toBe('2px');
        expect(g.railBg).toBe(hair);
        for (const s of g.squares) {
          expect([s.w, s.h, s.bg]).toEqual(['16px', '16px', edge]);
          expect(Math.abs(s.mid - g.railMid)).toBeLessThanOrEqual(1);
        }
        for (const s of g.stops) {
          // E4: the chip's middle is on the rail's.
          expect(Math.abs(s.midX - g.railMid)).toBeLessThanOrEqual(1);
          expect(Math.abs(s.midY - s.cardMid)).toBeLessThanOrEqual(1);
          // The bar runs from the chip's right edge to the card's left edge: 22px since the chip moved 2px left (E4).
          expect(s.bar).toEqual(['22px', '2px', edge]);
          expect(Math.abs(s.barLeft - s.chipRight)).toBeLessThanOrEqual(1);
          expect(Math.abs(s.barLeft + 22 - s.cardLeft)).toBeLessThanOrEqual(1);
        }
      });
    }
    for (const w of [699, 375, 320]) {
      test(`${t.id} at ${w}: no rail, no square, no bar; the chip is inside its card 16px from its edge; cards sit 14px in`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: 800 });
        await visit(page, t.path);
        const g = await page.evaluate(() => {
          const content = (el: Element, pseudo: string) => getComputedStyle(el, pseudo).content;
          const stops = [...document.querySelectorAll('li.stop')].map((li) => {
            const lr = li.getBoundingClientRect();
            const nr = li.querySelector('.stop__node')!.getBoundingClientRect();
            return { left: lr.left, right: lr.right, chipLeft: nr.left - lr.left, chipTop: nr.top - lr.top, bar: content(li, '::before') };
          });
          const left = (sel: string) => document.querySelector(sel)!.getBoundingClientRect().left;
          return {
            rail: content(document.querySelector('.route')!, '::before'),
            square: content(document.querySelector('.route-stage h2')!, '::before'),
            stops,
            iw: innerWidth,
            h1: left('main h1'),
            lede: left('main .lede'),
            h2: left('.route-stage h2'),
            up: document.querySelector('.upnext')!.getBoundingClientRect().toJSON() as { left: number; right: number },
          };
        });
        expect(g.rail).toBe('none');
        expect(g.square).toBe('none');
        for (const s of g.stops) {
          expect(s.bar).toBe('none');
          expect(Math.abs(s.chipLeft - 16)).toBeLessThanOrEqual(1);
          expect(Math.abs(s.chipTop - 14)).toBeLessThanOrEqual(1);
        }
        if (w < 699) {
          for (const s of g.stops) {
            expect(Math.abs(s.left - 14)).toBeLessThanOrEqual(1);
            expect(Math.abs(s.right - (g.iw - 14))).toBeLessThanOrEqual(1);
          }
          expect(Math.abs(g.up.left - 14)).toBeLessThanOrEqual(1);
          expect(g.up.right + 4).toBeLessThanOrEqual(g.iw);
          for (const x of [g.h1, g.lede, g.h2]) expect(Math.abs(x - 32)).toBeLessThanOrEqual(1);
        }
      });
    }
  }
  test('699 against 700: the one has no rail and its chip inside, the other the rail; no sideways scroll at either', async ({ page }) => {
    for (const w of [699, 700]) {
      await page.setViewportSize({ width: w, height: 800 });
      await visit(page, `/${NET}`);
      const g = await page.evaluate(() => ({ rail: getComputedStyle(document.querySelector('.route')!, '::before').content, sw: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      expect(g.rail, `${w}`).toBe(w === 699 ? 'none' : '""');
      expect(g.sw, `${w}`).toBe(0);
    }
  });
});

// ---------------------------------------------------------------- stop forms and heights (checks 18, 33)

test.describe('a stop and the page, by width', () => {
  test.use({ ...desktopOnly });
  const FORMS = [
    { w: 1440, h: 81 },
    { w: 1200, h: 81 },
    { w: 1024, h: 108 },
    { w: 768, h: 81 },
    { w: 700, h: 108 },
    { w: 375, h: 110 },
  ];
  for (const t of TRACKS) {
    for (const f of FORMS) {
      test(`${t.id} at ${f.w}: a stop is ${f.h}px, and its words sit as drawn`, async ({ page }) => {
        await page.setViewportSize({ width: f.w, height: 900 });
        await visit(page, t.path);
        const hs = await page.locator('li.stop').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
        for (const h of hs) expect(Math.abs(h - f.h)).toBeLessThanOrEqual(2);
        const first = await page.locator('li.stop').first().evaluate((li) => {
          const r = (sel: string) => li.querySelector(sel)!.getBoundingClientRect().toJSON() as { left: number; right: number; top: number };
          const lr = li.getBoundingClientRect();
          const pr = parseFloat(getComputedStyle(li.querySelector('.stop__info')!).paddingRight);
          return { h3: r('h3'), sub: r('.stop__sub'), state: r('.stop__state'), stamp: r('.stamp'), inner: lr.right - 2 - pr };
        });
        if (f.w === 1440 || f.w === 1200 || f.w === 768) {
          expect(Math.abs(first.h3.left - first.sub.left)).toBeLessThanOrEqual(1);
          expect(Math.abs(first.state.right - first.inner)).toBeLessThanOrEqual(1);
          expect(Math.abs(first.stamp.right - first.inner)).toBeLessThanOrEqual(1);
          expect(first.state.top).toBeLessThan(first.stamp.top);
        } else if (f.w === 1024 || f.w === 700) {
          expect(Math.abs(first.state.top - first.stamp.top)).toBeLessThanOrEqual(3);
          expect(first.state.left).toBeLessThan(first.stamp.left);
        }
      });
    }
  }
  test('at 320 a stop is 110px, or 132px where the subtitle takes two lines (eight of Networking’s)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await visit(page, `/${NET}`);
    const hs = await page.locator('li.stop').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)));
    const kinds = hs.map((h) => (Math.abs(h - 110) <= 2 ? 110 : Math.abs(h - 132) <= 2 ? 132 : h));
    expect(new Set(kinds)).toEqual(new Set([110, 132]));
    expect(kinds.filter((k) => k === 132)).toHaveLength(8);
  });

  const HEIGHTS: [number, number, number, number][] = [
    // [width, height, How the Internet Works, Networking]
    [1440, 900, 2365, 2910],
    [375, 812, 3499, 4330],
    [320, 640, 3652, 4686],
    [390, 844, 3474, 4305],
  ];
  for (const [w, h, hiw, net] of HEIGHTS) {
    test(`page height, a first visit, light, at ${w} x ${h}: ${hiw} and ${net}`, async ({ browser }) => {
      for (const [id, want] of [[HIW, hiw], [NET, net]] as const) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: 'light', ...desktopOnly });
        const page = await ctx.newPage();
        await visit(page, `/${id}`);
        const got = await page.evaluate(() => document.documentElement.scrollHeight);
        expect(Math.abs(got - want), `${id} ${w}: ${got}`).toBeLessThanOrEqual(40);
        await ctx.close();
      }
    });
  }
});

// ---------------------------------------------------------------- the side column and the window (checks 34, 29)

test.describe('the window scrolls and the side column sticks', () => {
  test.use({ ...desktopOnly });
  for (const t of TRACKS) {
    for (const [w, h] of [[1440, 900], [1280, 720], [1200, 700], [1024, 700], [1920, 1080]] as const) {
      for (const seedName of ['S0', 'S1'] as const) {
        test(`${t.id} at ${w} x ${h}, ${seedName}: the button is on screen below the header at every step and holds still once stuck`, async ({ page }) => {
          await page.setViewportSize({ width: w, height: h });
          await visit(page, t.path, seedName === 'S1' ? S1 : undefined, seedName === 'S1' ? 'what-is-udp' : null);
          const pos = await page.locator('.side').evaluate((el) => [getComputedStyle(el).position, getComputedStyle(el).top]);
          expect(pos).toEqual(['sticky', '92px']);
          const side = (await page.locator('.side').boundingBox())!;
          await page.mouse.move(side.x + 40, side.y + 120);
          await page.mouse.wheel(0, 600);
          await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
          await page.evaluate(() => window.scrollTo(0, 0));
          await settle(page);
          const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
          let stuck: number | null = null;
          let past = false;
          const steps = Array.from({ length: Math.ceil(max / 150) + 1 }, (_, i) => Math.min(i * 150, max));
          for (const y of steps) {
            await page.evaluate((to) => window.scrollTo(0, to), y);
            await settle(page);
            const r = await page.evaluate(() => {
              const b = document.querySelector('.upnext__btn')!.getBoundingClientRect();
              return { top: b.top, bottom: b.bottom, head: document.querySelector('.site-head')!.getBoundingClientRect().bottom, ih: innerHeight, lastIn: [...document.querySelectorAll('li.stop')].at(-1)!.getBoundingClientRect().bottom <= innerHeight };
            });
            expect(r.top, `y ${y}`).toBeGreaterThanOrEqual(r.head - 1);
            expect(r.bottom, `y ${y}`).toBeLessThanOrEqual(r.ih);
            if (y > 16 && !r.lastIn && !past) {
              stuck ??= r.top;
              expect(Math.abs(r.top - stuck), `y ${y}`).toBeLessThanOrEqual(1);
            }
            if (r.lastIn) past = true;
          }
          expect(stuck).not.toBeNull();
        });
      }
    }
  }
  test('where the screen is under 700px tall the column scrolls with the page; at 700 it sticks; in one column it never sticks, and the route is 40px under the head', async ({ page }) => {
    const pos = async (w: number, h: number) => {
      await page.setViewportSize({ width: w, height: h });
      await visit(page, `/${NET}`);
      return page.locator('.side').evaluate((el) => getComputedStyle(el).position);
    };
    expect(await pos(1440, 700)).toBe('sticky');
    expect(await pos(1440, 699)).toBe('static');
    expect(await pos(1024, 650)).toBe('static');
    expect(await pos(1440, 600)).toBe('static');
    expect(await pos(1023, 900)).toBe('static');
    const gap = await page.evaluate(() => document.querySelector('.route')!.getBoundingClientRect().top - document.querySelector('.side')!.getBoundingClientRect().bottom);
    expect(Math.round(gap)).toBe(40);
  });
  test('Page Down and Space scroll the window at 1440 x 900, and a focused stop is brought on screen', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visit(page, `/${NET}`);
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await settle(page);
    await page.keyboard.press('Space');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    await page.locator('li.stop', { hasText: 'Load Balancers' }).locator('h3 a').focus();
    await settle(page);
    await expect(page.locator('li.stop', { hasText: 'Load Balancers' })).toBeInViewport({ ratio: 1 });
  });
  test('no sideways scroll at any of eighteen widths from 320 to 1440 in three states, and nothing in main scrolls on its own', async ({ browser }) => {
    test.setTimeout(300_000);
    const widths = [320, 359, 360, 375, 390, 393, 699, 700, 767, 768, 860, 861, 1023, 1024, 1199, 1200, 1280, 1440];
    for (const t of TRACKS) {
      for (const seed of [{} as Seed, S1, S3(t.id)]) {
        const ctx = await browser.newContext({ viewport: { width: 320, height: 800 }, colorScheme: 'light', ...desktopOnly });
        const page = await ctx.newPage();
        await visit(page, t.path, seed, null);
        for (const w of widths) {
          await page.setViewportSize({ width: w, height: 800 });
          await settle(page);
          for (const atEnd of [false, true]) {
            await page.evaluate((end) => window.scrollTo(0, end ? document.documentElement.scrollHeight : 0), atEnd);
            await settledFrame(page);
            const r = await page.evaluate(() => {
              const root = document.documentElement;
              const over = [...document.querySelectorAll('main *')].filter((el) => el.getBoundingClientRect().right > root.clientWidth + 0.5).map((el) => el.className || el.tagName);
              const scrolls = [...document.querySelectorAll('main *')].filter((el) => ['auto', 'scroll'].includes(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight).map((el) => el.className || el.tagName);
              return { sw: root.scrollWidth - root.clientWidth, over, scrolls };
            });
            expect(r, `${t.id} ${w}`).toEqual({ sw: 0, over: [], scrolls: [] });
          }
        }
        await ctx.close();
      }
    }
  });
});

// ---------------------------------------------------------------- header and footer, the open menu, scroll padding (checks 26, 28)

test.describe('the header and the footer are the site’s', () => {
  test.use({ ...desktopOnly });
  for (const [vname, viewport] of VIEWS) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`/networking and /about have the same header and footer, ${vname} ${colorScheme}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport, colorScheme, ...desktopOnly });
        const page = await ctx.newPage();
        const props = ['backgroundColor', 'borderBottomColor', 'borderBottomWidth', 'borderTopColor', 'borderTopWidth', 'color', 'borderTopLeftRadius', 'paddingTop', 'paddingBottom'];
        const grab = async (path: string) => {
          await open(page, path);
          return page.evaluate((p) => {
            const pick = (el: Element | null) => (el === null ? null : Object.fromEntries(p.map((k) => [k, (getComputedStyle(el) as unknown as Record<string, string>)[k]])));
            return {
              head: pick(document.querySelector('.site-head')),
              nav: pick(document.querySelector('.site-head a[href="/glossary"]')),
              brand: pick(document.querySelector('.site-head .brand')),
              foot: pick(document.querySelector('.site-foot')),
              footLink: pick(document.querySelector('.site-foot a:not(.brand)')),
            };
          }, props);
        };
        expect(await grab('/networking')).toEqual(await grab('/about'));
        await ctx.close();
      });
    }
  }
  test('the header is sticky at every width, and the footer follows main at the end of the page', async ({ page }) => {
    for (const w of [375, 1023, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 800 });
      for (const t of TRACKS) {
        await open(page, t.path);
        expect(await page.locator('.site-head').evaluate((el) => getComputedStyle(el).position), `${t.id} ${w}`).toBe('sticky');
        const g = await page.evaluate(() => ({ next: document.querySelector('main')!.nextElementSibling!.matches('footer.site-foot'), full: document.querySelector('.site-foot')!.getBoundingClientRect().width === document.documentElement.clientWidth }));
        expect(g).toEqual({ next: true, full: true });
      }
    }
  });
  for (const w of [320, 375, 390, 959]) {
    test(`the open menu is 329px at ${w}, and the root's scroll padding follows it`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 800 });
      await open(page, `/${NET}`);
      const padding = () => page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);
      expect(await padding()).toBe('80px');
      await page.locator('#menu').click();
      await settle(page);
      const h = await page.locator('.site-head').evaluate((el) => el.getBoundingClientRect().height);
      expect(Math.abs(h - 329)).toBeLessThanOrEqual(2);
      expect(await padding()).toBe('341px');
      await page.keyboard.press('Escape');
      await settle(page);
      expect(await padding()).toBe('80px');
    });
  }
  test('with JavaScript off the menu never opens and the padding stays 80px', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`/${NET}`);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe('80px');
    await expect(page.locator('#menu-panel')).toBeHidden();
    await ctx.close();
  });
  test('H10: the menu opened at 900 and the window widened to 1200: the padding is 80px and Tab from the header lands the crumb near the top', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await open(page, `/${NET}`);
    await page.locator('#menu').click();
    await settle(page);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe('341px');
    await page.setViewportSize({ width: 1200, height: 800 });
    await settle(page);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop)).toBe('80px');
    // The closed header: 68px and its 1px edge.
    expect(Math.round(await page.locator('.site-head').evaluate((el) => el.getBoundingClientRect().height))).toBeLessThanOrEqual(69);
    await page.locator('.site-head .brand').focus();
    for (let i = 0; i < 12 && !(await page.evaluate(() => document.activeElement?.closest('main') != null)); i += 1) await page.keyboard.press('Tab');
    await settle(page);
    expect(await page.locator('main .crumbs a').evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(200);
  });
});

// ---------------------------------------------------------------- the keyboard (checks 30 to 32)

interface Stop {
  name: string;
  clearTop: number;
  clearBottom: number;
  isStop: boolean;
}
/** The focused element in main: its name, and how far its ring is under the header's foot and above the window's. */
const focusRead = (page: Page): Promise<Stop | null> =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (el === null || el.closest('main') === null) return null;
    const li = el.closest('li.stop');
    const box = (li ?? el).getBoundingClientRect();
    const cs = getComputedStyle(li ?? el);
    const grow = li !== null ? 5 : (parseFloat(cs.outlineWidth) || 0) + (parseFloat(cs.outlineOffset) || 0);
    const head = document.querySelector('.site-head')!.getBoundingClientRect().bottom;
    return { name: (el.textContent ?? '').trim().slice(0, 30), clearTop: box.top - grow - head, clearBottom: innerHeight - (box.bottom + grow), isStop: li !== null };
  });

async function walk(page: Page, menu: boolean): Promise<{ forward: Stop[]; back: Stop[] }> {
  if (menu) {
    await page.locator('#menu').click();
    await settle(page);
    await page.locator('#menu').focus();
  } else {
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  }
  const forward: Stop[] = [];
  for (let i = 0; i < 120; i += 1) {
    await page.keyboard.press('Tab');
    await settle(page);
    if (await page.evaluate(() => document.activeElement?.closest('footer') != null)) break;
    const r = await focusRead(page);
    if (r !== null) forward.push(r);
  }
  // From the footer's first link back to the crumb.
  await page.locator('.site-foot a').first().focus();
  const back: Stop[] = [];
  for (let i = 0; i < 120; i += 1) {
    await page.keyboard.press('Shift+Tab');
    await settle(page);
    const r = await focusRead(page);
    if (r !== null) back.push(r);
    if (r?.name === 'Tracks') break;
  }
  return { forward, back };
}

test.describe('Tab and Shift+Tab never leave focus under the header', () => {
  test.use({ ...desktopOnly });
  test.setTimeout(240_000);
  const sizes = [[320, 640], [375, 812], [390, 844], [1440, 900], [1024, 700]] as const;
  for (const t of TRACKS) {
    for (const [w, h] of sizes) {
      test(`${t.id} at ${w} x ${h}, the menu closed, with a lesson in progress`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await visit(page, t.path, S1, 'what-is-udp');
        const { forward, back } = await walk(page, false);
        // The crumb, the button, one link a lesson, the last line's link.
        expect(forward).toHaveLength(t.lessons + 3);
        expect(forward[0]!.name).toBe('Tracks');
        expect(forward.slice(2, -1).every((s) => s.isStop)).toBe(true);
        for (const s of forward) {
          expect(s.clearTop, `forward ${s.name}`).toBeGreaterThanOrEqual(0);
          expect(s.clearBottom, `forward ${s.name}`).toBeGreaterThanOrEqual(0);
        }
        for (const s of back) {
          expect(s.clearTop, `back ${s.name}`).toBeGreaterThanOrEqual(0);
          expect(s.clearBottom, `back ${s.name}`).toBeGreaterThanOrEqual(0);
        }
        expect(back.at(-1)!.name).toBe('Tracks');
        expect(back).toHaveLength(t.lessons + 3);
      });
    }
  }
  for (const t of TRACKS) {
    for (const [w, h] of [[320, 640], [375, 812], [390, 844]] as const) {
      test(`${t.id} at ${w} x ${h}, the menu open: no focused element in main is under the open header`, async ({ page }) => {
        await page.setViewportSize({ width: w, height: h });
        await visit(page, t.path, S1, 'what-is-udp');
        const { forward, back } = await walk(page, true);
        expect(forward.length).toBeGreaterThanOrEqual(t.lessons + 3);
        for (const s of [...forward, ...back]) {
          expect(s.clearTop, s.name).toBeGreaterThanOrEqual(0);
          expect(s.clearBottom, s.name).toBeGreaterThanOrEqual(0);
        }
        const head = await page.locator('.site-head').evaluate((el) => el.getBoundingClientRect().height);
        expect(Math.abs(head - 329)).toBeLessThanOrEqual(2);
      });
    }
  }
  test('the skip link is the first Tab, and Enter on it then Tab lands on the crumb, clear of the header', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await visit(page, `/${NET}`);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await settle(page);
    await expect(page.locator('main .crumbs a')).toBeFocused();
    const r = await focusRead(page);
    expect(r!.clearTop).toBeGreaterThanOrEqual(0);
  });
  test('at 1440 x 900 and 1024 x 700 the button is in the sticky column: Shift+Tab from the first lesson reaches it and the crumb, wholly on screen', async ({ page }) => {
    for (const [w, h] of [[1440, 900], [1024, 700]] as const) {
      await page.setViewportSize({ width: w, height: h });
      await visit(page, `/${NET}`);
      await page.locator('li.stop h3 a').first().focus();
      await settle(page);
      const yFirst = await page.evaluate(() => scrollY);
      await page.keyboard.press('Shift+Tab');
      await settle(page);
      await expect(page.locator('.upnext__btn')).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await settle(page);
      await expect(page.locator('main .crumbs a')).toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBeLessThanOrEqual(yFirst);
      for (const sel of ['main .crumbs a', '.upnext__btn']) {
        const r = await page.locator(sel).evaluate((el) => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom, head: document.querySelector('.site-head')!.getBoundingClientRect().bottom, ih: innerHeight }));
        expect(r.top, `${w} ${sel}`).toBeGreaterThanOrEqual(r.head);
        expect(r.bottom, `${w} ${sel}`).toBeLessThanOrEqual(r.ih);
      }
    }
  });
  test('the page sets no scroll behaviour of its own: focus and scrollTo move the window at once', async ({ page }) => {
    for (const t of TRACKS) {
      await open(page, t.path);
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), t.id).toBe('auto');
    }
  });
});

test.describe('a card is one target (check 32)', () => {
  test.use({ ...desktopOnly });
  for (const [vname, viewport] of VIEWS) {
    test.describe(vname, () => {
      test.use({ viewport });
      test('a keyboard focus rings the whole card and the link has no ring; a click anywhere on the card opens its lesson', async ({ page }) => {
        await visit(page, `/${NET}`);
        const focus = await token(page, '--focus');
        const stop = page.locator('li.stop').nth(3);
        await page.locator('li.stop h3 a').nth(2).focus();
        await page.keyboard.press('Tab');
        await settle(page);
        const read = await stop.evaluate((li) => {
          const s = getComputedStyle(li);
          const a = getComputedStyle(li.querySelector('h3 a')!);
          return { ring: [s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset], link: a.outlineStyle };
        });
        expect(read.ring).toEqual(['solid', '2px', focus, '3px']);
        expect(read.link).toBe('none');
        // Clicks: the subtitle, the stamp, the status word and the card's lower right corner.
        for (const sel of ['.stop__sub', '.stamp', '.stop__k', null] as const) {
          await page.goto(`/${NET}`);
          await hydrated(page);
          await settle(page);
          const li = page.locator('li.stop').nth(3);
          await li.scrollIntoViewIfNeeded();
          // A real click at a point on the card: the link's overlay covers it.
          const b = (await (sel === null ? li : li.locator(sel)).boundingBox())!;
          await (sel === null ? page.mouse.click(b.x + b.width - 4, b.y + b.height - 4) : page.mouse.click(b.x + b.width / 2, b.y + b.height / 2));
          await expect(page).toHaveURL(/\/networking\/mac-address/);
        }
        // The chip beside the card (at 1440, on the rail, outside it) opens nothing; on a phone it is inside the card and opens it.
        await page.goto(`/${NET}`);
        await hydrated(page);
        await page.locator('li.stop').nth(3).scrollIntoViewIfNeeded();
        const chip = (await page.locator('li.stop').nth(3).locator('.stop__node').boundingBox())!;
        await page.mouse.click(chip.x + chip.width / 2, chip.y + chip.height / 2);
        if (vname === '375') await expect(page).toHaveURL(/\/networking\/mac-address/);
        else await expect(page).toHaveURL(/\/networking$/);
      });
      test('the accessibility tree names a stop by its lesson alone, and the headings are one h1, six h2 and one h3 a lesson', async ({ page }) => {
        await visit(page, `/${NET}`, S1, 'subnetting');
        const main = page.locator('main');
        expect(await main.getByRole('heading', { level: 1 }).count()).toBe(1);
        expect(await main.getByRole('heading', { level: 2 }).count()).toBe(6);
        expect(await main.getByRole('heading', { level: 3 }).count()).toBe(20);
        await expect(page.getByRole('link', { name: 'OSI Model', exact: true })).toHaveCount(1);
        const li = page.locator('li.stop').first();
        const texts = await li.evaluate((el) => [...el.querySelectorAll('.stop__node, h3, .stop__sub, .stop__k, .stamp')].map((x) => (x.textContent ?? '').replace(/\s+/g, ' ').trim()));
        expect(texts[0]).toBe('Lesson 01');
        expect(texts[1]).toBe('OSI Model');
        expect(texts[3]).toMatch(/^(Not started|✓ Done|In progress)$/);
        expect(texts[4]).toMatch(/^Checked/);
      });
    });
  }
});

// ---------------------------------------------------------------- contrast (check 25)

for (const [vname, viewport] of VIEWS) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`contrast, ${vname} ${colorScheme}`, () => {
      test.use({ viewport, colorScheme, ...desktopOnly });
      for (const [sname, seed] of [['S0', undefined], ['S1', S1], ['S3', S3(NET)]] as const) {
        test(`${sname}: every word in main is at least 4.5:1 on what is under it; the lowest pairs are at their figures`, async ({ page }) => {
          await visit(page, `/${NET}`, seed, null);
          const result = await page.evaluate(() => {
            type RGBA = [number, number, number, number];
            const parse = (c: string): RGBA => {
              const m = c.match(/[\d.]+/g)!.map(Number);
              return [m[0]!, m[1]!, m[2]!, m[3] ?? 1];
            };
            const over = (top: RGBA, under: RGBA): RGBA => {
              const a = top[3] + under[3] * (1 - top[3]);
              if (a === 0) return [0, 0, 0, 0];
              return [0, 1, 2].map((i) => (top[i]! * top[3] + under[i]! * under[3] * (1 - top[3])) / a).concat(a) as RGBA;
            };
            const lum = ([r, g, b]: RGBA) => {
              const f = (v: number) => {
                const s = v / 255;
                return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
              };
              return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
            };
            const ratio = (a: RGBA, b: RGBA) => {
              const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
              return (x! + 0.05) / (y! + 0.05);
            };
            /** The ground under an element: each ancestor's colour (and the wash's) composited over the next. */
            const groundOf = (el: Element): RGBA => {
              const layers: RGBA[] = [];
              for (let n: Element | null = el; n !== null; n = n.parentElement) {
                const s = getComputedStyle(n);
                const bg = parse(s.backgroundColor);
                const img = s.backgroundImage.match(/rgba?\([^)]*\)/);
                if (img !== null) layers.push(parse(img[0]));
                if (bg[3] > 0) layers.push(bg);
                if (bg[3] === 1) break;
              }
              let out: RGBA = parse(getComputedStyle(document.documentElement).backgroundColor);
              if (out[3] === 0) out = [255, 255, 255, 1];
              for (const l of layers.reverse()) out = over(l, out);
              return out;
            };
            const lows: { what: string; ratio: number }[] = [];
            const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
            let node: Node | null;
            while ((node = walker.nextNode())) {
              const el = node.parentElement!;
              if (el.closest('script, style, .sr-only') !== null || (node.textContent ?? '').trim() === '') continue;
              const g = groundOf(el);
              lows.push({ what: (node.textContent ?? '').trim().slice(0, 30), ratio: ratio(over(parse(getComputedStyle(el).color), g), g) });
            }
            const named: Record<string, number> = {};
            const pair = (name: string, sel: string, prop: 'color' | 'stroke') => {
              const el = document.querySelector(sel);
              if (el === null) return;
              const g = groundOf(el);
              named[name] = ratio(over(parse(getComputedStyle(el)[prop]), g), g);
            };
            pair('stamp tick', '.stamp svg', 'stroke');
            pair('done chip number', '.stop--done .stop__node', 'color');
            pair('h1', 'main h1', 'color');
            pair('lede', '.lede', 'color');
            pair('progress words', '.strip__w', 'color');
            pair('subtitle', '.stop:not(.stop--now) .stop__sub', 'color');
            pair('subtitle on the wash', '.stop--now .stop__sub', 'color');
            pair('button words', '.upnext__btn', 'color');
            pair('status done', '.stop__k.done', 'color');
            return { lows, named };
          });
          for (const l of result.lows) expect(l.ratio, l.what).toBeGreaterThanOrEqual(4.5 - 0.01);
          const light = colorScheme === 'light';
          const figures: Record<string, [number, number]> = {
            h1: [14.51, 17.05],
            lede: [10.45, 11.59],
            'progress words': [5.03, 6.83],
            subtitle: [6.02, 6.14],
            'button words': [5.62, 6.4],
          };
          if (sname === 'S1') figures['subtitle on the wash'] = [5.21, 5.18];
          for (const [name, [l, d]] of Object.entries(figures)) expect(result.named[name]!, name).toBeGreaterThanOrEqual((light ? l : d) - 0.05);
          if (sname === 'S3') {
            expect(result.named['done chip number']!).toBeGreaterThanOrEqual((light ? 4.64 : 9.17) - 0.05);
            expect(result.named['status done']!).toBeGreaterThanOrEqual((light ? 5.7 : 9.87) - 0.05);
          }
          if (result.named['stamp tick'] !== undefined) expect(result.named['stamp tick']).toBeGreaterThanOrEqual(3);
        });
      }
    });
  }
}

// ---------------------------------------------------------------- the way into the page (check 36)

test.describe('ways into the page', () => {
  test.use({ viewport: { width: 1440, height: 900 }, ...desktopOnly });
  test('from a lesson the Lesson page’s crumb lands on the track at the top, with the h1 in view', async ({ page }) => {
    await open(page, '/networking/dhcp');
    await page.locator('.top__trk a.track__title').click();
    await expect(page).toHaveURL(/\/networking$/);
    await hydrated(page);
    await settle(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  });
  test('from the end of the last lesson "Back to the track" lands on the track at the top', async ({ page }) => {
    await open(page, '/networking/vpn?step=999');
    const back = page.getByRole('link', { name: 'Back to the track' });
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL(/\/networking$/);
    await hydrated(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
  test('from Tracks, Networking’s name opens the page at the top', async ({ page }) => {
    await open(page, '/tracks');
    await page.locator('main article.panel#networking h2 a').click();
    await expect(page).toHaveURL(/\/networking$/);
    await hydrated(page);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
  test('the old address forwards, and the lessons are listed from the page’s HTML (one link a lesson)', async ({ page, request }) => {
    for (const p of ['/networking/how-the-internet-works', '/networking/how-the-internet-works?step=7', '/networking/how-the-internet-works/']) {
      await page.goto(p);
      await expect(page).toHaveURL(/\/how-the-internet-works$/);
    }
    const html = await (await request.get(`/${NET}`)).text();
    const found = new Set([...html.matchAll(/href="(\/networking\/[a-z0-9-]+)"/g)].map((m) => m[1]!));
    expect(found.size).toBe(20);
  });
});

// ---------------------------------------------------------------- the built files (checks 7, 8, 9)

test.describe('the built pages', () => {
  const read = (id: string): string => readFileSync(`dist/${id}/index.html`, 'utf8') as string;
  const gz = (html: string): number => (gzipSync(html) as { length: number }).length;
  test('Networking is at most 16 KB gzipped and How the Internet Works at most 13 KB (the build’s own measure)', () => {
    expect(gz(read(NET))).toBeLessThanOrEqual(16_000);
    expect(gz(read(HIW))).toBeLessThanOrEqual(13_000);
  });
  for (const t of TRACKS) {
    test(`${t.id}: four scripts, no template, no figure, no box, and none of the dropped props`, () => {
      const html = read(t.id);
      // The layout's own drawing defs and styles name lm-svg, so the figures are looked for inside main.
      const main = /<main[\s\S]*<\/main>/.exec(html)![0];
      expect(html.match(/<script/g)).toHaveLength(4);
      for (const gone of ['<template', 'name-tile', 'lm-svg', 'routebox', 'side-now', '<astro-slot', '<astro-static-slot']) expect(main, gone).not.toContain(gone);
      expect(html).not.toMatch(/<template|<astro-(static-)?slot/);
      expect(html).not.toMatch(/&quot;(summary|meta|metaLabel|tags|note)&quot;:/);
      // What the islands read is there.
      for (const key of ['available', 'url', 'maxPosition', 'number', 'subtitle', 'stamp', 'places']) expect(html, key).toContain(`&quot;${key}&quot;:`);
    });
  }
});
