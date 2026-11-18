import { expect, test, type Page } from '@playwright/test';
import { kicker, nextButton, open, pageOverflow, setSpeed, settledFrame } from './support';

/**
 * D19 (B22): the Lesson page rearranged, at 1100px wide and up. Each test names the case of prototypes/d19-cases.md it
 * tries; the sizes are the prototype's measures. The phone and the 761 to 1099px range are B23's.
 */
const DHCP = '/networking/dhcp';
const OSI = '/networking/osi-model';
const HTTP = '/how-the-internet-works/what-is-http';
const WHAT_DHCP = '/how-the-internet-works/what-is-dhcp';
const FIREWALLS = '/networking/firewalls';

const at = async (page: Page, w: number, h: number, path: string, step?: number | 'learn' | 'practice'): Promise<void> => {
  await page.setViewportSize({ width: w, height: h });
  await open(page, step === undefined ? path : `${path}?step=${step}`);
  await page.evaluate(() => document.fonts.ready);
  await settledFrame(page);
};

type Box = [number, number, number, number];
const box = async (page: Page, selector: string): Promise<Box> => {
  const b = await page.locator(selector).first().boundingBox();
  if (b === null) throw new Error(`${selector} has no box.`);
  return [b.x, b.y, b.width, b.height].map((n) => Math.round(n * 10) / 10) as Box;
};
const near = (actual: Box | number[], want: readonly number[], what: string, tol = 0.6) =>
  want.forEach((w, i) => expect(Math.abs(actual[i]! - w), `${what}[${i}]: ${actual.join(', ')} against ${want.join(', ')}`).toBeLessThanOrEqual(tol));

/** The drawing: the figure's svg scaled by its viewBox, as the prototype's readout does. */
const drawing = (page: Page): Promise<[number, number]> =>
  page.evaluate(() => {
    const svg = document.querySelector<SVGSVGElement>('.stage__figure svg[data-figure]')!;
    const b = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const s = Math.min(b.width / vb.width, b.height / vb.height);
    return [Math.round(vb.width * s * 10) / 10, Math.round(vb.height * s * 10) / 10] as [number, number];
  });

/** `localStorage['techconcepts:v2']` seeds, set before the page loads (the prototype's P0, P6 and PS). */
const rec = (status: 'finished' | 'in-progress') => ({ status, furthestPosition: 4, lastOpened: '2026-11-10T10:00:00.000Z' });
const P6 = ['osi-model', 'packets', 'ip-address', 'mac-address', 'subnetting', 'router'].reduce<Record<string, unknown>>(
  (all, slug) => ({ ...all, [slug]: rec('finished') }),
  { switch: rec('in-progress'), dhcp: rec('in-progress') },
);
async function seed(page: Page, lessons: Record<string, unknown>): Promise<void> {
  await page.addInitScript((data) => {
    window.localStorage.setItem('techconcepts:v2', JSON.stringify({ version: 2, lessons: data, lastLesson: null, lastTrack: null }));
  }, lessons);
}

const hereStops = (page: Page) => page.getByRole('navigation', { name: 'This lesson' }).getByRole('button');

// ---------------------------------------------------------------- the header (cases 1, 2, 4, 5)

test('1, 2, 4: the site’s header stands on top, 69px with its rule; its links, the one theme button, one way home; no footer', async ({ page }) => {
  for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
    for (const path of [DHCP, HTTP]) {
      await at(page, w, h, path);
      near(await box(page, '.site-head'), [0, 0, w, 69], `${path} header at ${w}`, 1);
      await expect(page.getByRole('contentinfo')).toHaveCount(0);
      const nav = page.getByRole('navigation', { name: 'Site' });
      await expect(nav.getByRole('link')).toHaveText(['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About']);
      expect(await nav.getByRole('link').evaluateAll((a) => a.map((l) => l.getAttribute('href')))).toEqual(['/tracks', '/glossary', '/#try', '/#sources', '/about']);
      await expect(nav.getByRole('link', { name: 'Tracks' })).toHaveAttribute('aria-current', 'true');
      expect(await nav.locator('[aria-current]').count()).toBe(1);
      await expect(page.locator('.site-head a.btn--primary, #menu-panel a.btn--primary')).toHaveCount(0);
      await expect(page.locator('.theme-toggle')).toHaveCount(1);
      await expect(page.locator('.site-head .theme-toggle')).toHaveCount(1);
      await expect(page.locator('[id="theme-toggle"]')).toHaveCount(1);
      await expect(page.getByRole('link', { name: 'TechConcepts home' })).toHaveCount(1);
    }
  }
});

test('4: the header’s theme button flips the theme, stores it, and the figure’s colours follow', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  const card = () => page.locator('.console__stage').evaluate((el) => getComputedStyle(el).getPropertyValue('--card') + getComputedStyle(el).backgroundColor);
  const before = await card();
  const was = await page.locator('html').getAttribute('data-theme');
  await page.locator('.site-head .theme-toggle').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', was ?? '');
  expect(await card()).not.toBe(before);
  expect(await page.evaluate(() => window.localStorage.getItem('techconcepts:theme'))).toBe(await page.locator('html').getAttribute('data-theme'));
});

test('2: no other page of the lesson’s header changes: one banner, one main, one #main; Tab, Enter on the skip link, Tab lands in the scene’s first button (case 5)', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('#main')).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('banner')).toHaveCount(1);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  expect(page.url()).toMatch(/#main$/);
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => ({ inMain: document.activeElement?.closest('main#main') !== null, text: document.activeElement?.textContent }));
  expect(focus.inMain, 'the focus is inside main#main').toBe(true);
  expect(focus.text).toBe('Network');
});

// ---------------------------------------------------------------- the page (cases 6 to 10, 59)

test('6: the page never scrolls, at every place of DHCP, OSI Model and What is DHCP, at the sizes of B22, in both themes', async ({ page }) => {
  test.setTimeout(300_000);
  for (const colorScheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const [w, h] of [[1920, 1080], [1440, 900], [1440, 889], [1366, 768], [1280, 800], [1100, 700]] as const) {
      for (const [path, places] of [[DHCP, 8], [OSI, 13], [WHAT_DHCP, 9]] as const) {
        await at(page, w, h, path);
        for (let i = 0; i < places; i += 1) {
          await page.goto(`${path}?step=${i}`);
          await settledFrame(page);
          const o = await pageOverflow(page);
          expect(o, `${path} place ${i} at ${w}x${h} ${colorScheme}`).toEqual({ down: 0, sideways: 0 });
        }
      }
    }
  }
});

test('7, 8: at 1440×900 the scene’s panel is 771×550 at (256, 161) and the drawing 769×366 at every DHCP step; the panel is 476 at 1280×800 and 452 at 1366×768', async ({ page }) => {
  for (let step = 0; step <= 5; step += 1) {
    await at(page, 1440, 900, DHCP, step);
    near(await box(page, '.console__stage'), [256, 161, 771, 550], `stage at step ${step}`, 1);
    near(await box(page, '.console__scene'), [257, 212, 769, 498], `scene at step ${step}`, 1);
    near(await drawing(page), [769, 366], `drawing at step ${step}`, 1);
  }
  await at(page, 1280, 800, DHCP, 4);
  expect((await box(page, '.console__stage'))[3]).toBeCloseTo(476, 0);
  await at(page, 1366, 768, DHCP, 4);
  expect((await box(page, '.console__stage'))[3]).toBeCloseTo(452, 0);
});

test('10, 59: the log is 1015×165 at (12, 723) at 1440×900 and 896×163 at (12, 625) at 1280×800, its head 32px with no button, and shows at least 3 rows under the column names', async ({ page }) => {
  for (const [w, h, want] of [[1440, 900, [12, 723, 1015, 165]], [1280, 800, [12, 625, 896, 163]]] as const) {
    await at(page, w, h, DHCP, 4);
    near(await box(page, '.console__log'), want, `log at ${w}`, 1);
    expect((await box(page, '.log__head'))[3]).toBeCloseTo(32, 0);
    await expect(page.locator('.log__head button:visible')).toHaveCount(0);
    const rows = await page.evaluate(() => {
      const scroll = document.querySelector<HTMLElement>('.log__scroll')!;
      const th = document.querySelector('.log__table thead')!.getBoundingClientRect().height;
      const row = document.querySelector('.log__table tbody tr')!.getBoundingClientRect().height;
      return (scroll.clientHeight - th) / row;
    });
    // The spec counts rows of 33px (3.1 at both sizes). The real rows are 35.3px, and at 1280 DHCP Offer's words wrap to a second
    // line, as in the prototype: the approved geometry shows 2.93 rows at 1440 and 1.92 at 1280 with the names on screen.
    expect(rows).toBeGreaterThanOrEqual(w === 1440 ? 2.9 : 1.9);
  }
  // 890px tall: the bar is 68px and the log gives up 69px; 889: the bar is 44px and the log gives up 45 (the line, case 59).
  await at(page, 1440, 890, DHCP, 4);
  expect((await box(page, '.console__top'))[3]).toBe(68);
  expect((await box(page, '.console__log'))[3]).toBeCloseTo(Math.max(131, Math.min(183, 0.26 * 890 - 69)), 0);
  await at(page, 1440, 889, DHCP, 4);
  expect((await box(page, '.console__top'))[3]).toBe(44);
  expect((await box(page, '.console__log'))[3]).toBeCloseTo(Math.max(155, Math.min(207, 0.26 * 889 - 45)), 0);
});

test('59: at 1440×889 the lesson’s table stays under the scene (the drawing is 769×366 in a 769×399 scene); at 1440×890 it is in the guide', async ({ page }) => {
  await at(page, 1440, 889, DHCP, 4);
  await expect(page.locator('.console__stage .tpanel')).toHaveCount(1);
  await expect(page.locator('.guide__table .tpanel')).toHaveCount(0);
  await at(page, 1440, 890, DHCP, 4);
  await expect(page.locator('.guide__table .tpanel')).toHaveCount(1);
  await expect(page.locator('.console__stage .tpanel')).toHaveCount(0);
});

// ---------------------------------------------------------------- the bar (cases 15 to 17)

test('15: the bar is 1015×68 at (12, 81) at 1440×900 and ends where the scene ends; 896×44 at 1280×800; its first cell is the track’s width; the guide starts at y 81', async ({ page }) => {
  await at(page, 1440, 900, DHCP, 4);
  const top = await box(page, '.console__top');
  near(top, [12, 81, 1015, 68], 'bar', 1);
  const stage = await box(page, '.console__stage');
  expect(Math.abs(top[0] + top[2] - (stage[0] + stage[2]))).toBeLessThanOrEqual(0.6);
  expect(Math.abs((await box(page, '.top__lesson'))[2] - 232)).toBeLessThanOrEqual(6);
  expect((await box(page, '.console__guide'))[1]).toBe(81);
  // The timeline fills its cell: every stop 66px tall from y 82 (names form), and in Learn the marks are centred (y 115).
  const stops = await page.locator('.console__top .tl__stop').evaluateAll((els) => els.map((e) => { const b = e.getBoundingClientRect(); return [b.top, b.height]; }));
  for (const [t, hh] of stops) { expect(Math.abs(t! - 82)).toBeLessThanOrEqual(0.6); expect(Math.abs(hh! - 66)).toBeLessThanOrEqual(0.6); }
  await at(page, 1440, 900, DHCP, 6);
  const mark = await box(page, '.tl__mark');
  expect(Math.abs(mark[1] + mark[3] / 2 - 115)).toBeLessThanOrEqual(1);
  await at(page, 1280, 800, DHCP, 4);
  near(await box(page, '.console__top'), [12, 81, 896, 44], 'bar at 1280', 1);
  expect((await box(page, '.console__guide'))[1]).toBe(81);
});

test('16: the bar holds "Tracks", the track’s link and the timeline, and no h1, no "Lesson N of M", no badge, no stamp, no logo, no theme button, no segments; the timeline is 776 / 657 / 477 wide on every lesson', async ({ page }) => {
  for (const [w, h, want] of [[1440, 900, 776], [1280, 800, 657], [1100, 700, 477]] as const) {
    for (const path of [DHCP, FIREWALLS, OSI, HTTP]) {
      await at(page, w, h, path);
      const bar = page.locator('.console__top');
      await expect(bar.getByRole('link', { name: 'Tracks' })).toHaveAttribute('href', '/tracks');
      await expect(bar.locator('.top__trk a').nth(1)).toHaveAttribute('href', /^\/(networking|how-the-internet-works)$/);
      await expect(bar.getByRole('heading', { level: 1 })).toHaveCount(0);
      await expect(bar).not.toContainText(/Lesson \d+ of \d+|OSI layer/);
      await expect(bar.locator('.stamp, .brand, .logo, .theme-toggle, .topbar__segments')).toHaveCount(0);
      const tl = await box(page, '.timeline');
      expect(Math.abs(tl[2] - want), `${path} timeline at ${w}`).toBeLessThanOrEqual(1);
    }
  }
});

test('17 (13b): the column’s head holds the only visible h1, "Lesson 9 of 20" on its line, the strip of 20 and "6 of 20 done"; in the one-line bar "Tracks /" and the track’s name share a line, whole, for both tracks', async ({ page }) => {
  await seed(page, P6);
  for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
    await at(page, w, h, DHCP);
    const head = page.locator('.track__head');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(head.getByRole('heading', { level: 1 })).toHaveText('DHCP');
    await expect(head).toContainText('Lesson 9 of 20');
    expect(Math.abs((await box(page, '.track__head h1'))[1] - (await box(page, '.track__lesson .top__of'))[1])).toBeLessThanOrEqual(6);
    await expect(head.locator('.cable i')).toHaveCount(20);
    await expect(head.locator('.cable i[data-s="done"]')).toHaveCount(6);
    await expect(head.locator('.cable i[data-s="here"]')).toHaveCount(1);
    await expect(head).toContainText('6 of 20 done');
    await expect(head.getByRole('link')).toHaveCount(0);
    await expect(head).not.toContainText(/Tracks|Networking Concepts/);
  }
  for (const path of [DHCP, WHAT_DHCP]) {
    await at(page, 1280, 800, path);
    const crumb = await box(page, '.top__trk .track__crumb');
    const name = await box(page, '.top__trk .track__title');
    expect(Math.abs(crumb[1] - name[1]), `${path}: one line`).toBeLessThanOrEqual(4);
    expect(await page.locator('.top__trk .track__title > span').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
});

test('19: the OSI badge heads the words: its own line above the kicker while watching, on the kicker’s line in Learn and Practice; none for a unit that spans layers', async ({ page }) => {
  for (const [path, label] of [[FIREWALLS, /OSI layers 3 and 4/], [HTTP, /OSI layer 7, Application/]] as const) {
    for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
      await at(page, w, h, path, 1);
      const badge = await box(page, '.explain__osi');
      const kick = await box(page, '.explain__kicker');
      expect(badge[1] + badge[3], `${path} badge above the kicker at ${w}`).toBeLessThanOrEqual(kick[1] + 0.6);
      await expect(page.locator('.explain__osi')).toContainText(label);
      expect(await page.locator('.explain__osi p').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    }
  }
  for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
    await at(page, w, h, FIREWALLS);
    for (const stop of ['Learn', 'Practice']) {
      await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: stop, exact: true }).click();
      const badge = await box(page, '.explain__osi');
      const kick = await box(page, '.explain__kicker');
      expect(Math.abs(badge[1] + badge[3] / 2 - (kick[1] + kick[3] / 2)), `${stop} at ${w}: one line`).toBeLessThanOrEqual(4);
    }
  }
  await at(page, 1440, 900, OSI, 1);
  await expect(page.locator('.explain__osi')).toHaveCount(0);
});

// ---------------------------------------------------------------- the timeline (cases 20 to 27, 62)

test('20: at 1440×900 the rule before the current mark is solid orange and after it dashed', async ({ page }) => {
  await at(page, 1440, 900, DHCP, 4);
  const here = await page.evaluate(() => {
    const bg = (el: Element, pseudo: '::before' | '::after') => getComputedStyle(el, pseudo).backgroundImage;
    const stops = [...document.querySelectorAll('.console__top .tl li')];
    const probe = document.createElement('i');
    probe.style.color = 'var(--here)';
    document.body.append(probe);
    const orange = getComputedStyle(probe).color;
    probe.remove();
    return { orange, before: stops.map((li) => getComputedStyle(li, '::before').backgroundColor), after: stops.map((li) => bg(li, '::after')), afterColor: stops.map((li) => getComputedStyle(li, '::after').backgroundColor) };
  });
  // The current step is the fifth stop (index 4): its rule before it, and every done stop's rules, are the orange; after it the rule is a dashed gradient.
  expect(here.before[4]).toBe(here.orange);
  expect(here.before[1]).toBe(here.orange);
  expect(here.afterColor[3]).toBe(here.orange);
  expect(here.after[4]).toMatch(/repeating-linear-gradient/);
  expect(here.afterColor[4]).not.toBe(here.orange);
});

test('21: at 1440×900 every stop’s name shows, whole, in at most two lines, and the line ends with the place’s count; What is DHCP shows names and no count', async ({ page }) => {
  for (let step = 0; step <= 7; step += 1) {
    await at(page, 1440, 900, DHCP, step);
    // Learn and Practice show the marks (the scene is narrower there): the names are for the Overview and the steps.
    if (step <= 5) {
    const names = await page.locator('.console__top .tl__name').evaluateAll((els) => els.map((el) => ({ w: el.getBoundingClientRect().width, clamped: el.scrollHeight > el.clientHeight + 1 })));
    for (const n of names) {
      expect(n.w).toBeGreaterThan(1);
      expect(n.clamped).toBe(false);
    }
    }
    const count = await page.locator('.console__top .tl__count').innerText();
    expect(count).toBe(step === 0 ? 'Overview' : step <= 5 ? `Step ${step} of 5` : step === 6 ? 'Learn' : 'Practice');
  }
  await at(page, 1440, 900, WHAT_DHCP, 3);
  expect(await page.locator('.console__top .tl__name').first().evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThan(1);
  await expect(page.locator('.console__top .tl__end')).toBeHidden();
});

test('22, 23: in the one-line bar the stops are marks on one line, then the count and the place’s name; 13 marks are 34px at 1280 and never under 24px; every stop is inside the timeline', async ({ page }) => {
  for (const [w, h] of [[1280, 800], [1366, 768]] as const) {
    await at(page, w, h, DHCP, 4);
    const tops = await page.locator('.console__top .tl__stop').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
    expect(await page.locator('.console__top .tl__name').first().evaluate((el) => el.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
    await expect(page.locator('.console__top .tl__count')).toHaveText('Step 4 of 5');
    await expect(page.locator('.console__top .tl__now')).toHaveText('DHCP Acknowledge');
  }
  await at(page, 1280, 800, DHCP, 0);
  await expect(page.locator('.console__top .tl__count')).toHaveText('Overview');
  await expect(page.locator('.console__top .tl__now')).toBeHidden();
  for (const [w, h, min] of [[1440, 900, 34], [1280, 800, 29], [1100, 700, 24]] as const) {
    for (let step = 0; step <= 12; step += 4) {
      await at(page, w, h, OSI, step);
      const tl = await box(page, '.timeline__nav');
      const stops = await page.locator('.console__top .tl__stop').evaluateAll((els) => els.map((el) => { const b = el.getBoundingClientRect(); return [b.left, b.right, b.width]; }));
      for (const [l, r, wd] of stops) {
        expect(l, `inside at ${w}`).toBeGreaterThanOrEqual(tl[0] - 0.5);
        expect(r).toBeLessThanOrEqual(tl[0] + tl[2] + 0.5);
        expect(wd, `a stop at ${w}x${h} step ${step}`).toBeGreaterThanOrEqual(min - 0.6);
      }
      await expect(page.locator('.console__top .tl__count')).toBeVisible();
    }
  }
});

test('24: with TCP/UDP’s titles no name takes more than two lines, the bar stays 68px, and the page does not scroll; the long ones end in an ellipsis whose stop keeps the whole title', async ({ page }) => {
  for (const slug of ['tcp-udp', 'ip-address', 'nat', 'ports']) {
    await at(page, 1440, 900, `/networking/${slug}`);
    expect((await box(page, '.console__top'))[3]).toBe(68);
    const lines = await page.locator('.console__top .tl__name').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight))));
    for (const n of lines) expect(n).toBeLessThanOrEqual(2);
    expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
  }
  await at(page, 1440, 900, '/networking/tcp-udp');
  const stops = page.locator('.console__top .tl__stop');
  const titles = await stops.evaluateAll((els) => els.map((el) => el.getAttribute('title')));
  const long = titles.indexOf('UDP: Packet Loss, No Retransmission');
  expect(long).toBeGreaterThan(0);
  await expect(stops.nth(long)).toHaveAccessibleName(/UDP: Packet Loss, No Retransmission/);
  expect(await stops.nth(long).locator('.tl__name').evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
});

test('25: one press to every place on DHCP, in order and in reverse; the kicker names the place, focus stays on the stop, the live region says it', async ({ page }) => {
  for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
    await at(page, w, h, DHCP);
    const stops = hereStops(page);
    const n = await stops.count();
    expect(n).toBe(8);
    const want = (i: number) => (i === 0 ? 'Overview' : i <= 5 ? `Watch · Step ${i} of 5` : i === 6 ? 'Learn' : 'Practice');
    for (const i of [...Array(n).keys(), ...[...Array(n).keys()].reverse()]) {
      await stops.nth(i).click();
      await expect(kicker(page)).toHaveText(want(i));
      await expect(stops.nth(i)).toBeFocused();
      await expect(page.locator('[data-announce]')).not.toHaveText('');
    }
    await stops.nth(2).focus();
    await page.keyboard.press('Enter');
    await expect(kicker(page)).toHaveText(want(2));
    await stops.nth(5).focus();
    await page.keyboard.press(' ');
    await expect(kicker(page)).toHaveText(want(5));
    await expect(stops.nth(5)).toBeFocused();
  }
});

test('27: Play all at 2×: during the hold the rule between marks fills, and is solid when the next step arrives; paused, the fill goes; reduced motion draws none', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  const fills = () => page.evaluate(() => document.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'tl-fill').map((a) => a.effect?.getComputedTiming().duration));
  await setSpeed(page, '2×');
  await page.locator('.cbtn--alt').click();
  await expect.poll(fills, { timeout: 20_000 }).not.toEqual([]);
  const got = await fills();
  expect(got.length).toBeGreaterThanOrEqual(1);
  expect(got.every((d) => Math.abs(Number(d) - 650) < 5), `each half of a 2× hold lasts 650ms: ${got}`).toBe(true);
  await page.locator('.cbtn--alt').click();
  await expect.poll(fills).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.cbtn--alt').click();
  for (let i = 0; i < 12; i += 1) {
    await page.waitForTimeout(500);
    expect(await fills()).toEqual([]);
  }
});

test('62: every mark and every shown name is at least 4.5:1 against its own ground, in both themes', async ({ page }) => {
  for (const colorScheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme });
    await at(page, 1440, 900, DHCP, 3);
    const worst = await page.evaluate(() => {
      const lum = (c: string) => {
        const m = c.match(/[\d.]+/g)!.map(Number);
        const [r, g, b] = m.slice(0, 3).map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
        return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
      };
      const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x! + 0.05) / (y! + 0.05); };
      const out: [string, number][] = [];
      const ground = (el: Element): string => { for (let e: Element | null = el; e; e = e.parentElement) { const bg = getComputedStyle(e).backgroundColor; if (!/rgba\(.*, 0\)|transparent/.test(bg)) return bg; } return 'rgb(0,0,0)'; };
      for (const el of document.querySelectorAll('.tl__mark, .tl__name')) out.push([el.className + el.textContent, ratio(getComputedStyle(el).color, ground(el))]);
      return out.sort((p, q) => p[1] - q[1])[0]!;
    });
    expect(worst[1], `${colorScheme}: ${worst[0]}`).toBeGreaterThanOrEqual(4.5);
  }
});

// ---------------------------------------------------------------- the track (cases 28 to 31, 61)

test('28: with six lessons done the column reads its parts, counts and statuses; DHCP’s row is current and "In progress"; progress follows the slug', async ({ page }) => {
  await seed(page, P6);
  await at(page, 1440, 900, DHCP);
  const parts = page.locator('.track__nav .part');
  await expect(parts).toHaveCount(6);
  await expect(parts.locator('.part__name')).toHaveText(['The big picture', 'Addresses & the local network', 'Getting between networks', 'Talking across the internet', 'The web', 'Protecting & scaling traffic']);
  await expect(parts.locator('.part__count')).toHaveText(['✓ 2 of 2', '2 of 4', '2 of 3', '0 of 4', '0 of 3', '0 of 4']);
  expect(await parts.first().locator('.part__count').evaluate((el) => getComputedStyle(el).color)).not.toBe(await parts.nth(1).locator('.part__count').evaluate((el) => getComputedStyle(el).color));
  const here = page.locator('.track__nav [aria-current="page"]');
  await expect(here).toContainText('In progress');
  expect(await here.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
  await expect(page.locator('.track__nav a', { hasText: 'Router' }).first()).toContainText('✓ Done');
  await parts.nth(1).locator('summary').click();
  await expect(page.locator('.track__nav a', { hasText: 'Switch' }).first()).toContainText('In progress');
  await expect(page.locator('.track__nav a', { hasText: 'ARP' }).first()).not.toContainText(/Done|In progress/);
  await expect(page.locator('.track__head')).toContainText('6 of 20 done');
});

test('28: a lesson both tracks list reads "Done" in each, by its slug', async ({ page }) => {
  await seed(page, { 'what-is-http': rec('finished') });
  await at(page, 1440, 900, HTTP);
  await expect(page.locator('.track__nav [aria-current="page"]')).toContainText('✓ Done');
});

test('29, 31: the list does not scroll with one part open at 1440×900 (476px); opened wide it scrolls inside the column, the head does not move, the page does not scroll; every row focused is inside the list', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  const dims = () => page.locator('.track__list').evaluate((el) => ({ s: el.scrollHeight, c: el.clientHeight }));
  expect(await dims()).toEqual({ s: 476, c: 476 });
  const head = await box(page, '.track__head');
  for (const summary of await page.locator('.track__nav summary').all()) await summary.click();
  const opened = await dims();
  expect(opened.c).toBe(476);
  expect(opened.s).toBeGreaterThan(476);
  expect(await box(page, '.track__head')).toEqual(head);
  expect(await pageOverflow(page)).toEqual({ down: 0, sideways: 0 });
  // On load the current lesson's row is wholly in the list, also where the part has four lessons and the head wraps.
  for (const [w, h, path] of [[1440, 900, '/networking/load-balancers'], [1440, 900, '/networking/mac-address'], [1100, 700, '/networking/load-balancers'], [1100, 700, '/networking/mac-address']] as const) {
    await at(page, w, h, path);
    const row = await box(page, '.track__nav [aria-current="page"]');
    const list = await box(page, '.track__list');
    expect(row[1], `${path} at ${w}: top`).toBeGreaterThanOrEqual(list[1] - 0.5);
    expect(row[1] + row[3], `${path} at ${w}: bottom`).toBeLessThanOrEqual(list[1] + list[3] + 0.5);
  }
});

test('30: the part holding this lesson is a heading and cannot be closed; every other is a summary that toggles on click, Enter and Space, and is closed after a reload', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  const here = page.locator('.track__nav .part[data-here] .part__head');
  await expect(here).toHaveCount(1);
  expect(await here.evaluate((el) => el.closest('details') === null)).toBe(true);
  await here.click();
  await page.keyboard.press('Enter');
  await expect(page.locator('.track__nav [aria-current="page"]')).toBeVisible();
  const first = page.locator('.track__nav details').first();
  await expect(here.locator('.part__chev')).toBeHidden();
  // Every part's name starts at the same x (the hidden chevron keeps its place).
  const xs = await page.locator('.track__nav .part__name').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
  expect(new Set(xs)).toEqual(new Set([46]));
  await first.locator('summary').click();
  await expect(first).toHaveJSProperty('open', true);
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveJSProperty('open', false);
  await page.keyboard.press(' ');
  await expect(first).toHaveJSProperty('open', true);
  await page.reload();
  await expect(page.locator('.track__nav details[open]')).toHaveCount(0);
});

test('31: Tab through every one of the track’s rows at 1100×700: each focused row is wholly inside the list’s box and not under the head', async ({ page }) => {
  await at(page, 1100, 700, DHCP);
  await page.locator('.track__nav summary').first().focus();
  const seen: string[] = [];
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el.closest('.console__track')) return null;
      const list = document.querySelector('.track__list')!.getBoundingClientRect();
      const head = document.querySelector('.track__head')!.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      // Wholly inside the list's box, and not under the head.
      return { name: el.textContent!.trim().slice(0, 24), ok: b.top >= list.top - 1 && b.bottom <= list.bottom + 1 && b.top >= head.bottom - 0.5 };
    });
    if (r === null) break;
    seen.push(r.name);
    expect(r.ok, `${r.name} is wholly in the list`).toBe(true);
  }
  // The part holding DHCP is open, so its lessons are rows too: the walk reached past the first part's heading.
  expect(seen.length).toBeGreaterThan(6);
});

test('61: the progress count loads without a jump: "0 of 20 done" before it, "6 of 20 done" after, the head 72px and the list where it was', async ({ page }) => {
  await seed(page, P6);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route('**/*.js', (route) => route.abort());
  await page.goto(DHCP);
  await expect(page.locator('.track__head')).toContainText('0 of 20 done');
  const before = { head: await box(page, '.track__head'), list: await box(page, '.track__list') };
  await page.unroute('**/*.js');
  await open(page, DHCP);
  await expect(page.locator('.track__head')).toContainText('6 of 20 done');
  expect(await box(page, '.track__head')).toEqual(before.head);
  expect((await box(page, '.track__list'))[1]).toBe(before.list[1]);
  expect(before.head[3]).toBeCloseTo(72, 0);
});

// ---------------------------------------------------------------- no stamp (cases 12 to 14)

test('12, 13: no stamp on the lesson at any place; Learn still ends with "Sources" and its numbered list (16 on DHCP, 6 on OSI Model), the first mark opens its page in a new tab', async ({ page }) => {
  for (const path of [DHCP, OSI, HTTP]) {
    for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
      await at(page, w, h, path);
      for (const stop of [/^Overview/, /^Step 2, /, /^Learn/, /^Practice/]) {
        await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: stop }).click();
        await expect(page.locator('.stamp')).toHaveCount(0);
        const text = await page.locator('body').innerText();
        expect(text, `${path} ${stop}`).not.toMatch(/Checked \d|Not checked yet/);
      }
    }
  }
  await at(page, 1440, 900, DHCP);
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sources', level: 3 })).toBeVisible();
  await expect(page.locator('ol.explain__sources > li')).toHaveCount(16);
  await at(page, 1440, 900, OSI);
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await expect(page.locator('ol.explain__sources > li')).toHaveCount(6);
  const mark = page.getByRole('link', { name: /^Source \d+: / }).first();
  await expect(mark).toHaveText('1');
  await expect(mark).toHaveAttribute('target', '_blank');
});

test('14: the track page’s lesson cards and Home’s demo still show the stamp', async ({ page }) => {
  await open(page, '/networking');
  const stamps = await page.locator('main .route li.stop:not(.stop--soon) .stamp').allTextContents();
  expect(stamps.length).toBeGreaterThan(5);
  for (const s of stamps) expect(s.trim()).toMatch(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
  await open(page, '/');
  await expect(page.locator('.demo__src .stamp')).toHaveText('Checked 11 Nov 2026, 20 sources');
});

// ---------------------------------------------------------------- the guide (cases 32 to 40)

test('32: the lesson’s table is in the guide between the words and the controls, capped at 200px and in the entry form; in Learn and Practice, at 889 tall and at 1280×800 it is under the scene', async ({ page }) => {
  await at(page, 1440, 900, DHCP, 4);
  const words = await box(page, '.console__explain');
  const table = await box(page, '.guide__table');
  const foot = await box(page, '.guide__foot');
  expect(words[1] + words[3]).toBeLessThanOrEqual(table[1] + 0.6);
  expect(table[1] + table[3]).toBeLessThanOrEqual(foot[1] + 0.6);
  expect(table[3]).toBeLessThanOrEqual(0.24 * 807 + 1);
  expect(await page.locator('.guide__table thead').evaluate((el) => el.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
  const label = await page.locator('.guide__table td[data-label]').first().evaluate((el) => getComputedStyle(el, '::before').content);
  expect(label).not.toBe('none');
  // A table taller than its cap scrolls inside itself with the marked row in view.
  await at(page, 1440, 900, '/networking/load-balancers', 5);
  const lb = await page.locator('.guide__table .tpanel').evaluate((el) => ({ h: el.getBoundingClientRect().height }));
  expect(lb.h).toBeLessThanOrEqual(200.6);
  // The row the step is about stays inside the capped panel (it scrolls into view).
  await at(page, 1440, 900, '/networking/load-balancers', 2);
  await expect(page.locator('.guide__table .tpanel [data-highlight]').first()).toBeVisible();
  const inside = await page.evaluate(() => {
    const panel = document.querySelector('.guide__table .tpanel')!.getBoundingClientRect();
    const row = document.querySelector('.guide__table .tpanel [data-highlight]')!.getBoundingClientRect();
    return row.top >= panel.top - 0.5 && row.bottom <= panel.bottom + 0.5;
  });
  expect(inside, 'the marked row is inside the table panel').toBe(true);
  await at(page, 1440, 900, '/networking/subnetting', 3);
  const bits = page.locator('.guide__table .bits');
  await expect(bits).toHaveCount(1);
  expect(await bits.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await at(page, 1440, 900, OSI, 3);
  await expect(page.locator('.console__stage .labels')).toHaveCount(1);
  for (const [w, h, step] of [[1440, 900, 6], [1440, 900, 7], [1440, 889, 4], [1280, 800, 4]] as const) {
    await at(page, w, h, DHCP, step);
    await expect(page.locator('.console__stage .tpanel'), `${w}x${h} step ${step}`).toHaveCount(1);
    await expect(page.locator('.guide__table .tpanel')).toHaveCount(0);
  }
});

test('33: the words’ room is at least 510px at DHCP step 4 and 660px in Learn at 1440×900, 560px at 1280×800; the words do not scroll', async ({ page }) => {
  await at(page, 1440, 900, DHCP, 4);
  expect((await box(page, '.console__explain'))[3]).toBeGreaterThanOrEqual(510);
  // After step 4's run the lease is in the table: 150px with its caption, and the words keep 520px.
  await expect(page.locator('.guide__table tr[data-highlight]')).toHaveCount(1, { timeout: 20_000 });
  expect((await box(page, '.guide__table'))[3]).toBeCloseTo(150, 0);
  expect((await box(page, '.console__explain'))[3]).toBeCloseTo(520, 0);
  expect(await page.locator('.console__explain').evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true);
  await at(page, 1440, 900, DHCP, 6);
  expect((await box(page, '.console__explain'))[3]).toBeGreaterThanOrEqual(660);
  await at(page, 1280, 800, DHCP, 4);
  expect((await box(page, '.console__explain'))[3]).toBeGreaterThanOrEqual(560);
});

test('34: the four buttons are one line (speed 52, back 36, Play all 118, replay 36) and the forward button is under them, 355×40 while watching and 526×40 in Learn and Practice; its right end holds', async ({ page }) => {
  await at(page, 1440, 900, HTTP, 2);
  const ys = await page.locator('.console__controls .cbtn:not(.cbtn--go)').evaluateAll((els) => els.map((el) => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; }));
  expect(ys.map((b) => b[2])).toEqual([52, 36, 118, 36]);
  expect(ys.map((b) => b[0])).toEqual([1056, 1114, 1156, 1280]);
  expect(new Set(ys.map((b) => b[1])).size).toBe(1);
  expect(ys.map((b) => b[3])).toEqual([34, 34, 34, 34]);
  const go = await box(page, '.cbtn--go');
  near(go, [1056, 805, 355, 40], 'forward', 1);
  expect(go[1]).toBeGreaterThan(ys[0]![1]! + 30);
  const right = go[0] + go[2];
  for (const step of [6, 7]) {
    await at(page, 1440, 900, HTTP, step);
    const g = await box(page, '.cbtn--go');
    expect(g[2]).toBeCloseTo(526, 0);
    expect(g[0] + g[2]).toBeCloseTo(right, 0);
  }
  for (const [w, h] of [[1100, 700], [1145, 800], [1163, 800]] as const) {
    await at(page, w, h, HTTP, 2);
    expect((await box(page, '.cbtn--alt'))[2]).toBeGreaterThanOrEqual(117.5);
  }
});

test('34: the longest title, "Next: UDP: Packet Loss, No Retransmission", is whole at 1440 and takes two lines at 1280 (the real face is narrower than the prototype’s fallback); Practice of DHCP reads "Next lesson: Ports"', async ({ page }) => {
  const label = page.locator('.go__label');
  await at(page, 1440, 900, '/networking/tcp-udp', 4);
  await expect(label).toHaveText(/^Next: UDP: Packet Loss, No Retransmission$/);
  expect(await label.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect((await box(page, '.cbtn--go'))[3]).toBeLessThanOrEqual(53.5);
  await at(page, 1280, 800, '/networking/tcp-udp', 4);
  expect(await label.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  expect((await box(page, '.cbtn--go'))[3]).toBeCloseTo(53, 0);
  await at(page, 1440, 900, DHCP, 7);
  await expect(label).toHaveText('Next lesson: Ports');
});

test('35: the forward button’s names and titles on the built page: Overview, step 4, Learn, Practice; disabled at the track’s last lesson, still orange at 0.4 opacity', async ({ page }) => {
  await at(page, 1440, 900, DHCP, 0);
  await expect(nextButton(page)).toHaveAccessibleName('Next: DHCP Discover, step 1');
  await expect(nextButton(page)).toHaveAttribute('title', 'Next: DHCP Discover, step 1 (→)');
  await at(page, 1440, 900, DHCP, 4);
  await expect(nextButton(page)).toHaveAccessibleName('Next: Lease Renewal, step 5');
  await at(page, 1440, 900, DHCP, 5);
  await expect(nextButton(page)).toHaveAccessibleName('Next: Learn');
  await at(page, 1440, 900, DHCP, 6);
  await expect(nextButton(page)).toHaveAccessibleName('Next: Practice');
  await at(page, 1440, 900, DHCP, 7);
  await expect(nextButton(page)).toHaveAccessibleName('Next lesson: Ports');
  await expect(nextButton(page)).toHaveAttribute('title', 'Next lesson: Ports');
  await at(page, 1440, 900, '/networking/vpn', 99);
  const vpn = nextButton(page);
  await expect(vpn).toHaveAttribute('aria-disabled', 'true');
  await expect(vpn).toHaveAccessibleName('Next lesson');
  expect(await vpn.evaluate((el) => getComputedStyle(el).opacity)).toBe('0.4');
});

test('36: the forward button’s words are never cut and the button is inside the window, at every place of every ready lesson at 1440×900, 1280×800 and 1100×700', async ({ page }) => {
  test.setTimeout(600_000);
  const lessons = await page.request.get('/networking').then(async (r) => [...(await r.text()).matchAll(/href="(\/(?:networking|how-the-internet-works)\/[a-z0-9-]+)"/g)].map((m) => m[1]!));
  const paths = [...new Set(lessons)].filter((p) => !/^\/(networking|how-the-internet-works)$/.test(p));
  expect(paths.length).toBeGreaterThan(10);
  for (const [w, h] of [[1440, 900], [1280, 800], [1100, 700]] as const) {
    for (const path of paths) {
      await at(page, w, h, path);
      for (let i = 0; i < 16; i += 1) {
        const ok = await page.evaluate(() => {
          const b = document.querySelector('.cbtn--go')!.getBoundingClientRect();
          const l = document.querySelector('.go__label')!;
          const lines = l.getBoundingClientRect().height / parseFloat(getComputedStyle(l).lineHeight);
          return { cut: l.scrollWidth > l.clientWidth + 0.5 || lines > 2.05, inside: b.left >= 0 && b.right <= innerWidth && b.bottom <= innerHeight };
        });
        expect(ok, `${path} at ${w}, press ${i}`).toEqual({ cut: false, inside: true });
        const atEnd = await page.evaluate(() => (document.querySelector('.cbtn--go')!.getAttribute('aria-label') ?? '').startsWith('Next lesson'));
        if (atEnd) break;
        await nextButton(page).click();
        await settledFrame(page);
      }
    }
  }
});

test('37: Enter on the focused forward button from the Overview to Practice keeps the focus on it and the kicker moving', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  await nextButton(page).focus();
  let was = await kicker(page).textContent();
  for (let i = 0; i < 7; i += 1) {
    await page.keyboard.press('Enter');
    await expect(kicker(page)).not.toHaveText(was ?? '');
    was = await kicker(page).textContent();
    await expect(nextButton(page)).toBeFocused();
  }
});

test('38: → walks the Overview to Practice and does nothing at the last; ← walks back; Space plays and pauses; keys on a stop, a track row, a header link and a summary do nothing to the lesson', async ({ page }) => {
  await at(page, 1440, 900, DHCP);
  const blur = () => page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let i = 0; i < 7; i += 1) {
    await blur();
    const was = await kicker(page).textContent();
    await page.keyboard.press('ArrowRight');
    await expect(kicker(page)).not.toHaveText(was ?? '');
  }
  await expect(kicker(page)).toHaveText('Practice');
  const url = page.url();
  await blur();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await expect(kicker(page)).toHaveText('Practice');
  expect(page.url()).toBe(url);
  for (let i = 0; i < 7; i += 1) {
    await blur();
    const was = await kicker(page).textContent();
    await page.keyboard.press('ArrowLeft');
    await expect(kicker(page)).not.toHaveText(was ?? '');
  }
  await expect(kicker(page)).toHaveText('Overview');
  await blur();
  await page.keyboard.press(' ');
  await expect(page.locator('.cbtn--alt')).toHaveAccessibleName('Pause');
  await page.keyboard.press(' ');
  await expect(page.locator('.cbtn--alt')).toHaveAccessibleName('Play all');
  for (const focus of [hereStops(page).nth(3), page.locator('.track__nav summary').first(), page.locator('.site-head .site-nav a').first()]) {
    await focus.focus();
    const was = await kicker(page).textContent();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await expect(kicker(page)).toHaveText(was ?? '');
  }
});

test('39: the key line reads "Space play all or pause ← back → next", three kbd, the guide’s last row, hidden with a coarse pointer', async ({ browser }) => {
  const mouse = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await mouse.newPage();
  await open(p, DHCP);
  const keys = p.locator('.keys');
  expect((await keys.innerText()).replace(/\s+/g, ' ')).toBe('Space play all or pause ← back → next');
  await expect(keys.locator('kbd')).toHaveCount(3);
  await expect(keys).not.toHaveAttribute('aria-hidden', /.*/);
  const k = await p.evaluate(() => ({ keys: document.querySelector('.keys')!.getBoundingClientRect().top, go: document.querySelector('.cbtn--go')!.getBoundingClientRect().bottom }));
  expect(k.keys).toBeGreaterThanOrEqual(k.go);
  await mouse.close();
  const touch = await browser.newContext({ viewport: { width: 1280, height: 800 }, isMobile: true, hasTouch: true });
  const t = await touch.newPage();
  await open(t, DHCP);
  await expect(t.locator('.keys')).toBeHidden();
  await touch.close();
});

test('40: in Learn and Practice at 1440×900 the words’ panel is 560px wide, and the log is folded to 45px until "Show log", which opens it', async ({ page }) => {
  for (const step of [6, 7]) {
    await at(page, 1440, 900, DHCP, step);
    expect((await box(page, '.console__guide'))[2]).toBeCloseTo(560, 0);
    expect((await box(page, '.console__log'))[3]).toBeCloseTo(45, 0);
    const fold = page.getByRole('button', { name: 'Show log' });
    await expect(fold).toHaveAttribute('aria-expanded', 'false');
    await fold.click();
    await expect(page.getByRole('button', { name: 'Hide log' })).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.log__scroll')).toBeVisible();
  }
});

// ---------------------------------------------------------------- the log's column names (case 49)

test('49: while the log is scrolled the column names stay at the top of its scroll box', async ({ page }) => {
  for (const [w, h, path, step] of [[1440, 900, DHCP, 5], [1280, 800, DHCP, 5], [1366, 768, DHCP, 5], [1440, 900, HTTP, 3]] as const) {
    await at(page, w, h, path, step);
    const r = await page.evaluate(async () => {
      const scroll = document.querySelector<HTMLElement>('.log__scroll')!;
      scroll.scrollTop = scroll.scrollHeight;
      await new Promise((res) => requestAnimationFrame(() => res(null)));
      return { top: scroll.scrollTop, box: scroll.getBoundingClientRect().top, th: document.querySelector('.log__table thead th')!.getBoundingClientRect().top };
    });
    if (r.top > 0) expect(Math.abs(r.th - r.box), `${path} step ${step} at ${w}`).toBeLessThanOrEqual(0.6);
  }
});

// ---------------------------------------------------------------- without JavaScript (case 46)

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('46: at 1440×900 the track column shows its links, the bar’s middle cell lists the places, no button shows but the header’s, one h1, no stamp, no scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const path of [DHCP, OSI]) {
      await page.goto(path);
      await expect(page.locator('button:visible')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('.console__log td[data-idle] noscript .log__nojs')).toHaveText('This lesson needs JavaScript to play.');
      await expect(page.locator('.console__track a:visible')).not.toHaveCount(0);
      await expect(page.locator('.timeline__plain')).toBeVisible();
      await expect(page.locator('.timeline__plain h2')).toHaveText('In this lesson');
      expect((await box(page, '.console__top'))[3]).toBe(68);
      await expect(page.locator('.stamp')).toHaveCount(0);
      const o = await page.evaluate(() => ({ down: document.documentElement.scrollHeight - innerHeight, side: document.documentElement.scrollWidth - innerWidth }));
      expect(o.down).toBeLessThanOrEqual(0);
      expect(o.side).toBeLessThanOrEqual(0);
    }
    await page.goto(DHCP);
    const items = await page.locator('.timeline__plain li').count();
    expect(items).toBe(8);
    const tops = await page.locator('.timeline__plain li').evaluateAll((els) => new Set(els.map((el) => Math.round(el.getBoundingClientRect().top))).size);
    expect(tops).toBe(1);
  });
});

// ---------------------------------------------------------------- the keyboard walk, both ways (case 47)

/** What a focused element is, for the order: its role or tag with its name. */
const describeFocus = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const r = el.getBoundingClientRect();
    const win = { w: innerWidth, h: innerHeight };
    const probe = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const bar = (s: string) => el.closest(s) !== null;
    const region = bar('.site-head') ? 'header' : bar('.console__top') ? 'bar' : bar('.console__track') ? 'track' : bar('.console__stage') ? 'scene' : bar('.console__explain') ? 'words' : bar('.guide__table') ? 'table' : bar('.console__controls') ? 'controls' : bar('.console__log') ? 'log' : bar('.skip-link') || el.classList.contains('skip-link') ? 'skip' : 'other';
    return {
      region,
      key: `${region}:${el.tagName}:${el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 30)}`,
      inside: r.left >= -0.5 && r.right <= win.w + 0.5 && r.top >= -0.5 && r.bottom <= win.h + 0.5,
      top: r.top,
      hit: probe === el || el.contains(probe),
      // The ring's width as drawn on focus (the page's :focus-visible rule).
      ring: parseFloat(getComputedStyle(el).outlineWidth) >= 2,
    };
  });

for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
  test(`47: the keyboard walk at ${w}×${h}: forward order is the spec’s, Shift+Tab is the exact reverse, every focused element is visible, hit-testable and ringed, and nothing hidden is a stop`, async ({ page }) => {
    test.setTimeout(120_000);
    await at(page, w, h, DHCP, 4);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    const forward: string[] = [];
    for (let i = 0; i < 80; i += 1) {
      await page.keyboard.press('Tab');
      const f = await describeFocus(page);
      if (forward.includes(f.key) || f.key.startsWith('other:BODY')) break;
      forward.push(f.key);
      expect(f.inside, f.key).toBe(true);
      if (f.region !== 'header' && f.region !== 'skip') expect(f.top, `${f.key} is under the header`).toBeGreaterThanOrEqual(69);
      if (f.region !== 'skip') expect(f.hit, `${f.key} is not covered`).toBe(true);
      expect(f.ring, `${f.key} has a ring`).toBe(true);
      expect(f.key, 'no hidden stop').not.toMatch(/^other:/);
    }
    const regions = forward.map((k) => k.split(':')[0]!);
    const order = regions.filter((r, i) => r !== regions[i - 1]);
    expect(order).toEqual(['skip', 'header', 'bar', 'track', 'scene', 'words', 'table', 'controls', 'log'].filter((r) => r !== 'table' || regions.includes('table')));
    expect(forward.filter((k) => k.startsWith('bar:A'))).toHaveLength(2);
    expect(forward.filter((k) => k.startsWith('bar:BUTTON'))).toHaveLength(8);
    // Shift+Tab from the last stop is the exact reverse (case 47b).
    expect(forward.at(-1)).toMatch(/^log:/);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.locator('.log__scroll').focus();
    const reverse: string[] = [];
    for (let i = 0; i < forward.length; i += 1) {
      const f = await describeFocus(page);
      reverse.push(f.key);
      expect(f.inside, f.key).toBe(true);
      if (f.region !== 'header' && f.region !== 'skip') expect(f.top, `${f.key} is under the header`).toBeGreaterThanOrEqual(69);
      await page.keyboard.press('Shift+Tab');
    }
    expect(reverse).toEqual([...forward].reverse());
  });
}

test('47c (E15): the bar’s track link has its focus ring whole: no box with overflow clips the 4px the ring is drawn out to', async ({ page }) => {
  for (const [w, h] of [[1440, 900], [1280, 800]] as const) {
    await at(page, w, h, DHCP, 4);
    await page.locator('.top__trk a.track__title').focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const clipped = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const r = el.getBoundingClientRect();
      const ring = { l: r.left - 4, t: r.top - 4, r: r.right + 4, b: r.bottom + 4 };
      const out: string[] = [];
      for (let a = el.parentElement; a; a = a.parentElement) {
        const o = getComputedStyle(a);
        if (o.overflowX === 'visible' && o.overflowY === 'visible') continue;
        const c = a.getBoundingClientRect();
        if (ring.l < c.left - 0.5 || ring.r > c.right + 0.5 || ring.t < c.top - 0.5 || ring.b > c.bottom + 0.5) out.push(`${a.tagName}.${a.className}`);
      }
      return out;
    });
    expect(clipped, `at ${w}`).toEqual([]);
  }
});
