import { expect, test, type Locator, type Page } from '@playwright/test';
import { clippingContainers, kicker, moveBy, nextButton, open, pageOverflow, position, readyLessons, requireLessons, settledFrame } from './support';

/**
 * D19 (B23): the Lesson page on a phone and from 761px to 1099px wide. Each test names the case of
 * prototypes/d19-cases.md it tries; the sizes are the prototype's measures. The header, the shared parts and 1100px and up
 * are B22's (lesson-layout.spec.ts); tablet.spec.ts, site.spec.ts's @phone tests, controls.spec.ts and reading.spec.ts
 * carry the cases that changed an older spec.
 */
const DHCP = '/networking/dhcp';
const OSI = '/networking/osi-model';
const WHAT_DHCP = '/how-the-internet-works/what-is-dhcp';
const HTTP = '/how-the-internet-works/what-is-http';
const TCP_UDP = '/networking/tcp-udp';
const FIREWALLS = '/networking/firewalls';
const SUBNETTING = '/networking/subnetting';
const PROXIES = '/networking/proxies';

const LESSONS = readyLessons();
requireLessons(LESSONS);

const at = async (page: Page, w: number, h: number, path: string, step?: number | 'learn' | 'practice'): Promise<void> => {
  await page.setViewportSize({ width: w, height: h });
  await open(page, step === undefined ? path : `${path}?step=${step === 'learn' ? 6 : step === 'practice' ? 7 : step}`);
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

/** `localStorage['techconcepts:v2']` seeds, set before the page loads (the prototype's P6). */
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

/** The stops a reader can see: the timeline's buttons that are not under a `display: none` copy. */
const stops = (page: Page): Locator => page.getByRole('navigation', { name: 'This lesson' }).getByRole('button');
const stopNamed = (page: Page, name: RegExp): Locator => page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name });
const tabsGroup = (page: Page): Locator => page.getByRole('group', { name: 'Show', exact: true });

const SMALL = [[1099, 800], [1024, 768], [959, 700], [900, 600], [768, 1024], [375, 812], [360, 640], [320, 568]] as const;

// ---------------------------------------------------------------- the header (cases 1, 3, 5, 51)

test('1: the site’s header is at y 0, 69px tall with its rule, at 1024×768, 768×1024 and 375×812; no footer', async ({ page }) => {
  for (const [w, h] of [[1024, 768], [768, 1024], [375, 812]] as const) {
    await at(page, w, h, DHCP);
    near(await box(page, '.site-head'), [0, 0, w, 69], `header at ${w}`, 1);
    await expect(page.getByRole('contentinfo')).toHaveCount(0);
  }
});

for (const colorScheme of ['dark', 'light'] as const) {
  test(`3, 51 (${colorScheme}): the header’s menu lies over the lesson at 375×812, 768×1024 and 959×700: five links hit-test to themselves, an opaque panel, no page scroll, nothing moves; Escape, a second press and a link close it`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    for (const [w, h] of [[375, 812], [768, 1024], [959, 700]] as const) {
      await at(page, w, h, DHCP, 2);
      await expect(page.locator('.site-head .theme-toggle')).toBeVisible();
      const menu = page.locator('#menu');
      await expect(menu).toBeVisible();
      const sceneBefore = await box(page, '.console__scene');
      await menu.click();
      const panel = page.locator('#menu-panel');
      await expect(panel).toBeVisible();
      await settledFrame(page);
      await expect(panel.getByRole('link')).toHaveCount(5);
      const panelBox = await box(page, '#menu-panel');
      expect(panelBox[1], `the panel starts at the header's foot at ${w}`).toBeGreaterThanOrEqual(67.5);
      expect(panelBox[1]).toBeLessThanOrEqual(69.5);
      const covered = await panel.getByRole('link').evaluateAll((links) =>
        links.map((a) => {
          const r = a.getBoundingClientRect();
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return hit === a || a.contains(hit);
        }),
      );
      expect(covered, `${w}: every link is on top`).toEqual([true, true, true, true, true]);
      expect(await panel.evaluate((el) => /rgba?\((\d+), (\d+), (\d+)(, ([\d.]+))?\)/.exec(getComputedStyle(el).backgroundColor)?.[5] ?? '1')).toBe('1');
      expect(await pageOverflow(page), `${w}: the page does not scroll`).toEqual({ down: 0, sideways: 0 });
      near(await box(page, '.console__scene'), sceneBefore, `${w}: nothing moved`);
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      await expect(menu).toBeFocused();
      await menu.click();
      await expect(panel).toBeVisible();
      await menu.click();
      await expect(panel).toBeHidden();
      await menu.click();
      await page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault(), true));
      await panel.getByRole('link').first().click();
      await expect(panel).toBeHidden();
    }
  });
}

for (const [w, h] of [[1024, 768], [375, 812]] as const) {
  test(`5 at ${w}×${h}: one main, one #main, one banner; Tab, Enter on the skip link, Tab lands in the scene’s Network button`, async ({ page }) => {
    await at(page, w, h, DHCP);
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
}

// ---------------------------------------------------------------- the page (cases 6, 8)

test('6: the page never scrolls at any place of DHCP, OSI Model, TCP, What is DHCP, Firewalls and Subnetting, at 1099×800 to 320×568, in both themes, with Go deeper open, the sheet open, the menu open', async ({ page }) => {
  test.setTimeout(1_200_000);
  const pages = [[DHCP, 8], [OSI, 13], [TCP_UDP, 8], [WHAT_DHCP, 9], [FIREWALLS, 9], [SUBNETTING, 9]] as const;
  for (const colorScheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const [w, h] of SMALL) {
      for (const [path, places] of pages) {
        await at(page, w, h, path);
        for (let i = 0; i < places; i += 1) {
          await page.goto(`${path}?step=${i}`);
          await settledFrame(page);
          expect(await pageOverflow(page), `${path} place ${i} at ${w}x${h} ${colorScheme}`).toEqual({ down: 0, sideways: 0 });
        }
      }
      // Learn with Go deeper open; the sheet; the menu.
      await at(page, w, h, DHCP, 'learn');
      const deeper = page.locator('.explain__deeper summary').first();
      if ((await deeper.count()) > 0) {
        await deeper.click();
        expect(await pageOverflow(page), `Go deeper open at ${w}x${h} ${colorScheme}`).toEqual({ down: 0, sideways: 0 });
      }
      await page.locator('.top__lessons').click();
      await expect(page.getByRole('dialog', { name: 'All 20 lessons' })).toBeVisible();
      expect(await pageOverflow(page), `the sheet at ${w}x${h} ${colorScheme}`).toEqual({ down: 0, sideways: 0 });
      await page.keyboard.press('Escape');
      if (w < 960) {
        await page.locator('#menu').click();
        expect(await pageOverflow(page), `the menu at ${w}x${h} ${colorScheme}`).toEqual({ down: 0, sideways: 0 });
      }
    }
  }
});

test('8: the scene’s panel is 452px tall at 1024×768', async ({ page }) => {
  await at(page, 1024, 768, DHCP, 2);
  near(await box(page, '.console__stage'), [12, 137, 640, 452], 'the stage');
});

// ---------------------------------------------------------------- no stamp (case 12)

test('12: no .stamp and neither "Checked" nor "Not checked yet" on DHCP, OSI Model and What is HTTP at 1024×768, 768×1024 and 375×812, at the Overview, a step, Learn and Practice', async ({ page }) => {
  test.setTimeout(240_000);
  for (const [w, h] of [[1024, 768], [768, 1024], [375, 812]] as const) {
    for (const path of [DHCP, OSI, HTTP]) {
      for (const place of [0, 2, 'learn', 'practice'] as const) {
        await at(page, w, h, path, place);
        await expect(page.locator('.stamp'), `${path} ${place} at ${w}`).toHaveCount(0);
        expect(await page.locator('body').innerText(), `${path} ${place} at ${w}`).not.toMatch(/Checked \d|Not checked yet/);
      }
    }
  }
});

// ---------------------------------------------------------------- one h1, the sheet (cases 18, 41)

test('18: under 1100px the bar holds the lesson’s name as the page’s only h1; at 1440×900 the column’s head holds it; the sheet’s head reads Tracks /, the track, the strip and "6 of 20 done"', async ({ page }) => {
  await seed(page, P6);
  for (const [w, h] of [[1024, 768], [900, 600], [768, 1024], [375, 812]] as const) {
    await at(page, w, h, DHCP);
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1, `at ${w}`).toHaveCount(1);
    await expect(h1).toHaveText('DHCP');
    expect(await h1.evaluate((el) => el.closest('.console__top') !== null), `at ${w}: in the bar`).toBe(true);
    await page.locator('.top__lessons').click();
    const sheet = page.getByRole('dialog', { name: 'All 20 lessons' });
    await expect(sheet).toBeVisible();
    await expect(sheet.locator('.track__head .track__crumb')).toHaveText('Tracks /');
    await expect(sheet.locator('.track__head .track__title')).toHaveText('Networking Concepts');
    await expect(sheet.locator('.track__head .cable i')).toHaveCount(20);
    await expect(sheet.locator('.track__head')).toContainText('6 of 20 done');
    await page.keyboard.press('Escape');
  }
  await at(page, 1440, 900, DHCP);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  expect(await page.getByRole('heading', { level: 1 }).evaluate((el) => el.closest('.console__track') !== null)).toBe(true);
});

for (const [w, h, tall] of [[1024, 768, 34], [375, 812, 28]] as const) {
  test(`41 at ${w}×${h}: the bar’s button reads "9 of 20", opens a modal sheet at the left edge with every part open, and Escape, Close and the backdrop close it with focus back`, async ({ page }) => {
    await seed(page, P6);
    await at(page, w, h, DHCP);
    const button = page.getByRole('button', { name: '9 of 20: all 20 lessons, this is lesson 9', exact: true });
    await expect(button).toHaveText('9 of 20');
    expect((await box(page, '.top__lessons'))[3], 'the button’s height').toBe(tall);
    for (const how of ['Escape', 'Close', 'backdrop'] as const) {
      await button.click();
      const sheet = page.getByRole('dialog', { name: 'All 20 lessons' });
      await expect(sheet).toBeVisible();
      const sb = await sheet.boundingBox();
      expect(sb!.x, 'at the left edge').toBe(0);
      expect(sb!.width, 'up to 448px wide').toBeLessThanOrEqual(448);
      await expect(sheet.locator('details'), 'every part is open: none is a details').toHaveCount(0);
      await expect(sheet.locator('section.part')).toHaveCount(6);
      const rows = await sheet.locator('.outline__lesson').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(rows.length, 'the track’s 20 lessons').toBe(20);
      for (const r of rows) expect(r, 'rows are 44px tall').toBe(44);
      await expect(sheet.locator('[aria-current="page"]')).toHaveCount(1);
      const close = sheet.getByRole('button', { name: /Close/ });
      expect((await close.boundingBox())!.height).toBe(44);
      if (how === 'Escape') await page.keyboard.press('Escape');
      else if (how === 'Close') await close.click();
      else if (w === 1024) await page.mouse.click(600, 400);
      else continue; // a phone's sheet is as wide as the window: no backdrop to press
      await expect(sheet).toBeHidden();
      await expect(button, `after ${how}`).toBeFocused();
    }
  });
}

// ---------------------------------------------------------------- the stops (cases 23, 25, 52, 64)

for (const [w, h] of [[1024, 768], [900, 600], [768, 1024], [375, 812], [360, 640], [320, 568]] as const) {
  test(`23 at ${w}×${h}: OSI Model’s 13 stops are inside the timeline, none under ${w === 320 ? '22.8' : '24'}px wide, and the count shows where the bar has one`, async ({ page }) => {
    test.setTimeout(120_000);
    for (let i = 0; i < 13; i += 1) {
      await at(page, w, h, OSI, i);
      const all = stops(page);
      await expect(all).toHaveCount(13);
      const m = await all.evaluateAll((els) => {
        const timeline = els[0]!.closest('.timeline')!.getBoundingClientRect();
        return els.map((el) => {
          const r = el.getBoundingClientRect();
          return { w: r.width, inside: r.left >= timeline.left - 0.5 && r.right <= timeline.right + 0.5 };
        });
      });
      for (const s of m) {
        expect(s.inside, `place ${i}: a stop is inside the timeline`).toBe(true);
        expect(s.w, `place ${i}: a stop's width`).toBeGreaterThanOrEqual(w === 320 ? 22.7 : 23.9);
      }
      if (w === 1024 || w === 900) {
        const count = page.locator('.console__top .tl__count');
        await expect(count).toBeVisible();
        expect(await count.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      }
    }
  });
}

for (const [w, h, where] of [[1024, 768, 'the bar'], [375, 812, 'the stops row']] as const) {
  test(`25 at ${w}×${h} (${where}): one press reaches every place of DHCP, What is DHCP and OSI Model, in order and in reverse; the kicker names it, the pressed stop keeps focus, the live region says it; Enter and Space work`, async ({ page }) => {
    test.setTimeout(240_000);
    for (const path of [DHCP, WHAT_DHCP, OSI]) {
      await at(page, w, h, path);
      const n = await stops(page).count();
      const steps = n - 3;
      const expectAt = async (i: number) => {
        const k = i === 0 ? /^Overview$/ : i <= steps ? new RegExp(`Step ${i} of ${steps}$`) : i === steps + 1 ? /Learn$/ : /Practice$/;
        await expect(kicker(page), `${path} place ${i}`).toHaveText(k);
        const target = await stops(page).nth(i).getAttribute('data-target');
        expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.target ?? null), `${path} place ${i}: focus stays`).toBe(target);
        const said = (await page.locator('[data-announce]').textContent()) ?? '';
        expect(said.length, `${path} place ${i}: the live region speaks`).toBeGreaterThan(0);
      };
      for (let i = 1; i < n; i += 1) {
        await stops(page).nth(i).click();
        await expectAt(i);
      }
      for (let i = n - 2; i >= 0; i -= 1) {
        await stops(page).nth(i).click();
        await expectAt(i);
      }
      await stops(page).nth(2).focus();
      await page.keyboard.press('Enter');
      await expectAt(2);
      await stops(page).nth(4).focus();
      await page.keyboard.press('Space');
      await expectAt(4);
    }
  });
}

test('52, 28c at 375×812: with the Log tab and with the Table tab open a stop goes to its place and the tab stays', async ({ page }) => {
  await at(page, 375, 812, DHCP, 1);
  for (const tab of ['Log', 'Table'] as const) {
    await tabsGroup(page).getByRole('button', { name: new RegExp(`^${tab}`) }).click();
    for (const [name, where] of [[/^Step 4, /, 'Watch · Step 4 of 5'], [/^Step 2, /, 'Watch · Step 2 of 5'], [/^Learn$/, 'Learn'], [/^Overview/, 'Overview']] as const) {
      await stopNamed(page, name).click();
      await expect(tabsGroup(page).getByRole('button', { name: new RegExp(`^${tab}`) })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.top__where')).toHaveText(where === 'Watch · Step 4 of 5' ? 'Step 4 of 5' : where === 'Watch · Step 2 of 5' ? 'Step 2 of 5' : where);
    }
  }
});

test('64 at 375×812: the stops row is 36px between the scene and the tabs, every stop at least 35px tall, the current mark orange; a press moves the place and not the scene; the names are visually hidden', async ({ page }) => {
  await at(page, 375, 812, DHCP, 3);
  const row = await box(page, '.timeline--row');
  const scene = await box(page, '.console__stage');
  const tabs = await box(page, '.console__tabs');
  near(row, [0, scene[1] + scene[3], 375, 36], 'the row');
  expect(Math.abs(row[1] + row[3] - tabs[1])).toBeLessThanOrEqual(0.6);
  const dims = await stops(page).evaluateAll((els) => els.map((el) => ({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height })));
  expect(dims).toHaveLength(8);
  for (const d of dims) expect(d.h).toBeGreaterThanOrEqual(35);
  expect(dims[0]!.w).toBeGreaterThanOrEqual(43.8);
  const here = stopNamed(page, /^Step 3, /);
  await expect(here).toHaveAttribute('aria-current', 'step');
  const ground = await here.locator('.tl__mark').evaluate((el) => getComputedStyle(el).backgroundColor);
  const orange = await page.evaluate(() => {
    const p = document.createElement('i');
    p.style.color = getComputedStyle(document.querySelector('.console')!).getPropertyValue('--here');
    document.body.append(p);
    const c = getComputedStyle(p).color;
    p.remove();
    return c;
  });
  expect(ground).toBe(orange);
  const names = await stops(page).locator('.tl__name').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  for (const nw of names) expect(nw, 'the names are visually hidden').toBeLessThanOrEqual(1.5);
  await expect(stopNamed(page, /^Step 2, DHCP Offer, done$/)).toHaveCount(1);
  const before = await box(page, '.console__scene');
  await stopNamed(page, /^Step 5, /).click();
  await expect(kicker(page)).toHaveText('Watch · Step 5 of 5');
  near(await box(page, '.console__scene'), before, 'the scene never moves');
});

// ---------------------------------------------------------------- the phone (cases 43, 45)

test('43 at 375×812 on DHCP step 4: header 0 to 69, bar to 105, scene to 381, stops row to 417, tabs to 461, words to 748 (287px), controls to 812; OSI Model’s tabs are Explain and Log', async ({ page }) => {
  await at(page, 375, 812, DHCP, 4);
  near(await box(page, '.site-head'), [0, 0, 375, 69], 'header', 1);
  near(await box(page, '.console__top'), [0, 69, 375, 36], 'bar');
  near(await box(page, '.console__stage'), [0, 105, 375, 276], 'scene');
  near(await box(page, '.timeline--row'), [0, 381, 375, 36], 'stops row');
  near(await box(page, '.console__tabs'), [0, 417, 375, 44], 'tabs');
  near(await box(page, '.console__explain'), [0, 461, 375, 287], 'words');
  near(await box(page, '.console__controls'), [0, 748, 375, 64], 'controls');
  await expect(tabsGroup(page).getByRole('button')).toHaveText(['Explain', 'Log', 'Table']);
  await at(page, 375, 812, DHCP, 'learn');
  near(await box(page, '.console__explain'), [0, 331, 375, 417], 'words in Learn', 1);
  await at(page, 375, 812, OSI, 3);
  await expect(tabsGroup(page).getByRole('button')).toHaveText(['Explain', 'Log']);
});

for (const [w, h] of [[375, 812], [360, 640]] as const) {
  test(`43 at ${w}×${h}: with OSI Model’s 13 places every stop is at least 24px wide and 35px tall`, async ({ page }) => {
    await at(page, w, h, OSI, 3);
    const dims = await stops(page).evaluateAll((els) => els.map((el) => ({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height })));
    expect(dims).toHaveLength(13);
    for (const d of dims) {
      expect(d.w).toBeGreaterThanOrEqual(w === 360 ? 25.7 : 26.9);
      expect(d.h).toBeGreaterThanOrEqual(35);
    }
  });
}

test('45 at 375×812: the forward button reads "Next: step 5", "Next: Learn", "Next: Practice" and "Next lesson", with no chevron; at 320×568 on OSI Model step 9 "Next: step 10" is whole in its 96px', async ({ page }) => {
  const label = page.locator('.console__controls .go__label');
  for (const [step, words] of [[4, 'Next: step 5'], [5, 'Next: Learn'], ['learn', 'Next: Practice'], ['practice', 'Next lesson']] as const) {
    await at(page, 375, 812, DHCP, step);
    await expect(label).toHaveText(words);
    expect(await nextButton(page).evaluate((el) => getComputedStyle(el.querySelector('svg')!).display)).toBe('none');
  }
  await at(page, 390, 844, DHCP, 4);
  expect(await nextButton(page).evaluate((el) => getComputedStyle(el.querySelector('svg')!).display)).toBe('none');
  await at(page, 320, 568, OSI, 9);
  await expect(label).toHaveText('Next: step 10');
  const m = await label.evaluate((el) => ({ cut: el.scrollWidth > el.clientWidth, button: el.closest('button')!.getBoundingClientRect().width }));
  expect(m.cut).toBe(false);
  expect(Math.round(m.button)).toBe(96);
});

// ---------------------------------------------------------------- the forward button's words (cases 36, 37)

for (const [w, h] of [[1024, 768], [900, 600], [768, 1024], [375, 812], [360, 640], [320, 568]] as const) {
  test(`36 at ${w}×${h}: at every place of every ready lesson the forward button’s words are whole on one line and the button is inside the window`, async ({ page }) => {
    test.setTimeout(1_500_000);
    await page.setViewportSize({ width: w, height: h });
    for (const lesson of LESSONS) {
      await open(page, lesson.path);
      await page.evaluate(() => document.fonts.ready);
      for (let guard = 0; guard < 40; guard += 1) {
        await settledFrame(page);
        const m = await page.evaluate(() => {
          const button = document.querySelector<HTMLElement>('.console__controls .cbtn--go')!;
          const label = button.querySelector<HTMLElement>('.go__label')!;
          const r = button.getBoundingClientRect();
          const l = label.getBoundingClientRect();
          return {
            text: label.textContent,
            cut: label.scrollWidth > label.clientWidth,
            lines: l.height / parseFloat(getComputedStyle(label).fontSize),
            inside: r.left >= -0.5 && r.right <= innerWidth + 0.5 && r.top >= -0.5 && r.bottom <= innerHeight + 0.5,
          };
        });
        const where = `${lesson.slug} at ${w}x${h}: "${m.text}"`;
        expect(m.cut, `${where} is cut`).toBe(false);
        expect(m.inside, `${where} is outside the window`).toBe(true);
        expect(m.lines, `${where} takes two lines`).toBeLessThan(1.9);
        const here = await position(page);
        if (here.atEnd) break;
        await moveBy(page, () => nextButton(page).click());
      }
    }
  });
}

test('36: Proxies’ Practice, "Next lesson: Load Balancers", is full where it fits (1024×768) and short ("Next lesson") at 900×600', async ({ page }) => {
  await at(page, 1024, 768, PROXIES);
  await page.goto(`${PROXIES}?step=99`);
  await settledFrame(page);
  const label = page.locator('.console__controls .go__label');
  await expect(label).toHaveText('Next lesson: Load Balancers');
  await page.setViewportSize({ width: 900, height: 600 });
  await settledFrame(page);
  await expect(label).toHaveText('Next lesson');
  await expect(nextButton(page)).toHaveAccessibleName('Next lesson: Load Balancers');
});

for (const [w, h] of [[1024, 768], [375, 812]] as const) {
  test(`37 at ${w}×${h}: Enter on the focused forward button from the Overview to Practice keeps focus on it and moves the kicker${w === 1024 ? '; the words go from full to short on the way' : ''}`, async ({ page }) => {
    await at(page, w, h, DHCP);
    await nextButton(page).focus();
    const seen: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      const before = (await kicker(page).textContent()) ?? '';
      await page.keyboard.press('Enter');
      await expect(kicker(page)).not.toHaveText(before);
      await settledFrame(page);
      await expect(nextButton(page), `press ${i + 1}`).toBeFocused();
      seen.push((await page.locator('.console__controls .go__label').textContent()) ?? '');
    }
    await expect(kicker(page)).toHaveText(/Practice$/);
    if (w === 1024) {
      expect(seen[3], 'step 4').toBe('Next: step 5');
      expect(seen[5], 'Learn').toBe('Next: Practice');
      expect(seen[6], 'Practice').toMatch(/^Next lesson/);
    } else {
      expect(seen).toEqual(['Next: step 2', 'Next: step 3', 'Next: step 4', 'Next: step 5', 'Next: Learn', 'Next: Practice', 'Next lesson']);
    }
  });
}

// ---------------------------------------------------------------- turning a tablet (case 60)

test('60: turning a tablet keeps focus on the forward button and on a stop, which moves between the bar and the row under the scene', async ({ page }) => {
  await at(page, 1024, 768, DHCP, 2);
  await nextButton(page).focus();
  await page.setViewportSize({ width: 768, height: 1024 });
  await settledFrame(page);
  await expect(nextButton(page)).toBeFocused();
  await page.setViewportSize({ width: 1024, height: 768 });
  await settledFrame(page);
  await expect(nextButton(page)).toBeFocused();

  await stopNamed(page, /^Step 3, /).focus();
  expect(await page.evaluate(() => document.activeElement?.closest('.console__top') !== null)).toBe(true);
  await page.setViewportSize({ width: 768, height: 1024 });
  await settledFrame(page);
  await expect(stopNamed(page, /^Step 3, /)).toBeFocused();
  expect(await page.evaluate(() => document.activeElement?.closest('.timeline--row') !== null), 'it is the row’s stop').toBe(true);
  await page.setViewportSize({ width: 1024, height: 768 });
  await settledFrame(page);
  await expect(stopNamed(page, /^Step 3, /)).toBeFocused();
  expect(await page.evaluate(() => document.activeElement?.closest('.console__top') !== null), 'it is the bar’s stop').toBe(true);
});

// ---------------------------------------------------------------- without JavaScript (case 46)

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  for (const [w, h] of [[1024, 768], [375, 812]] as const) {
    test(`46 at ${w}×${h}: the stacked page keeps the header’s and the track’s links, lists the places under "In this lesson" after the Overview’s words, and shows no button (but the header’s menu under 960px), no stamp`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      for (const path of [DHCP, OSI]) {
        await page.goto(path);
        const buttons = await page.locator('button:visible').evaluateAll((els) => els.map((el) => el.id));
        expect(buttons, `${path} at ${w}`).toEqual(w < 960 ? ['menu'] : []);
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        await expect(page.locator('.console__log td[data-idle] noscript .log__nojs')).toHaveText('This lesson needs JavaScript to play.');
        await expect(page.locator('.console__explain .explain__title')).toBeVisible();
        await expect(page.locator('.console__stage svg[data-figure]')).toBeVisible();
        if (w >= 960) {
          const hrefs = await page.locator('.site-head nav a').evaluateAll((a) => a.map((l) => l.getAttribute('href')));
          expect(hrefs.slice(0, 5)).toEqual(['/tracks', '/glossary', '/#try', '/#sources', '/about']);
        }
        await expect(page.locator('.stamp')).toHaveCount(0);
        // The track's lessons are links at the foot of the stacked page: the part with this lesson open, the others details.
        expect(await page.locator('.console__track a:visible').count(), `${path}: the track’s links`).toBeGreaterThanOrEqual(2);
        expect(await page.locator('.console__track details').count(), `${path}: the other parts`).toBe(5);
        expect(await page.locator('.console__track a[aria-current="page"]').count()).toBe(1);
        // The places, one a line, after the Overview's words.
        const plain = page.locator('.timeline__stack');
        await expect(plain.locator('h2')).toHaveText('In this lesson');
        const tops = await plain.locator('li').evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
        expect(new Set(tops).size, `${path}: one place a line`).toBe(tops.length);
        const words = (await plain.boundingBox())!;
        const overview = (await page.locator('.console__explain').boundingBox())!;
        expect(words.y, 'after the Overview’s words').toBeGreaterThanOrEqual(overview.y + overview.height - 1);
        await expect(page.locator('.top__lessons')).toBeHidden();
        await expect(page.getByRole('navigation', { name: 'This lesson' })).toHaveCount(0);
      }
    });
  }
});

// ---------------------------------------------------------------- the keyboard walks (cases 47, 48)

const describeFocus = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const r = el.getBoundingClientRect();
    // A link that wraps has a box per line: the first line's is the one to press.
    const line = el.getClientRects()[0] ?? r;
    const probe = document.elementFromPoint(line.left + line.width / 2, line.top + line.height / 2);
    const within = (s: string) => el.closest(s) !== null;
    const controlsTop = document.querySelector('.console__controls')?.getBoundingClientRect().top ?? innerHeight;
    const region = within('.skip-link') || el.classList.contains('skip-link') ? 'skip' : within('.site-head') ? 'header' : within('.console__top') ? 'bar' : within('.console__track') ? 'track' : within('.timeline--row') ? 'row' : within('.console__tabs') ? 'tabs' : within('.console__stage') ? 'scene' : within('.console__explain') ? 'words' : within('.guide__table') ? 'table' : within('.console__controls') ? 'controls' : within('.console__log') ? 'log' : 'other';
    return {
      region,
      key: `${region}:${el.tagName}:${el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 30)}`,
      inside: r.left >= -0.5 && r.right <= innerWidth + 0.5 && r.top >= -0.5 && r.bottom <= innerHeight + 0.5,
      top: r.top,
      bottom: r.bottom,
      controlsTop,
      hit: probe === el || el.contains(probe),
      ring: parseFloat(getComputedStyle(el).outlineWidth) >= 2,
    };
  });

for (const [w, h, order] of [
  [1024, 768, ['skip', 'header', 'bar', 'scene', 'words', 'controls', 'log']],
  [768, 1024, ['skip', 'header', 'bar', 'scene', 'row', 'tabs', 'words', 'controls']],
  [375, 812, ['skip', 'header', 'bar', 'scene', 'row', 'tabs', 'words', 'controls']],
] as const) {
  test(`47 at ${w}×${h}: the forward order is the spec’s, Shift+Tab is the exact reverse, every focused element is visible, hit-testable, ringed and clear of the header and the pinned parts, and nothing hidden is a stop`, async ({ page }) => {
    test.setTimeout(240_000);
    for (const [path, place] of [[DHCP, 4], [DHCP, 'learn'], [DHCP, 'practice'], [OSI, 4]] as const) {
      await at(page, w, h, path, place);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const forward: string[] = [];
      const pinned = w < 900 || h > w;
      for (let i = 0; i < 90; i += 1) {
        await page.keyboard.press('Tab');
        const f = await describeFocus(page);
        if (f.region === 'skip' && forward.length > 0) break;
        if (f.key.startsWith('other:BODY')) break;
        forward.push(f.key);
        const where = `${path} ${place} at ${w}: ${f.key}`;
        expect(f.inside, where).toBe(true);
        if (f.region !== 'header' && f.region !== 'skip') expect(f.top, `${where} is under the header`).toBeGreaterThanOrEqual(69);
        if (pinned && f.region !== 'controls' && f.region !== 'skip' && f.region !== 'header' && f.region !== 'bar') {
          expect(f.bottom, `${where} is under the controls`).toBeLessThanOrEqual(f.controlsTop + 0.5);
        }
        if (f.region !== 'skip') expect(f.hit, `${where} is covered`).toBe(true);
        expect(f.ring, `${where} has no ring`).toBe(true);
        expect(f.region, `${where}: no hidden stop`).not.toBe('other');
        expect(await clippingContainers(page.locator(':focus')), `${where} is clipped`).toEqual([]);
      }
      const regions = forward.map((k) => k.split(':')[0]!);
      const seen = regions.filter((r, i) => r !== regions[i - 1]);
      expect(seen, `${path} ${place} at ${w}`).toEqual(order.filter((r) => path !== OSI || r !== 'scene'));
      // Shift+Tab from the end is the exact reverse.
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const reverse: string[] = [];
      for (let i = 0; i < forward.length; i += 1) {
        await page.keyboard.press('Shift+Tab');
        reverse.push((await describeFocus(page)).key);
      }
      expect(reverse, `${path} ${place} at ${w}`).toEqual([...forward].reverse());
    }
  });
}

for (const [w, h, js] of [[1024, 768, false], [375, 812, false], [1024, 599, true], [844, 390, true]] as const) {
  test.describe(`48: the stacked page at ${w}×${h}, JavaScript ${js ? 'on' : 'off'}`, () => {
    test.use({ javaScriptEnabled: js });
    test('Shift+Tab from the end to the skip link never leaves a focused element under the sticky header', async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      if (js) await open(page, DHCP);
      else await page.goto(DHCP);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      const seen: string[] = [];
      for (let i = 0; i < 160; i += 1) {
        await page.keyboard.press('Shift+Tab');
        const f = await describeFocus(page);
        if (f.region === 'skip') break;
        if (f.region !== 'header') {
          seen.push(`${f.key}@${Math.round(f.top)}`);
          // A box taller than the window (the words' panel on the stacked page) cannot show its top and its foot at once.
          if (f.bottom - f.top <= h - 69) expect(f.top, `${f.key} is under the header`).toBeGreaterThanOrEqual(68.5);
        }
      }
      expect(seen.length, 'the walk met the lesson').toBeGreaterThan(3);
    });
  });
}
