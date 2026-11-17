import { expect, test, type Locator, type Page } from '@playwright/test';
import { figureSnapshot, hydrated, kicker, logRows, nextButton, open, pageOverflow, playButton, readyLessons, replayButton, requireLessons, setSpeed, settledFrame } from './support';

/**
 * D14's control row, measured on the built site (B17): its order, sizes and places at every width, the one orange
 * button, the titles that name the keys, and the legend clear of the row when the log head is narrow (erratum E5).
 * The widths are set here, so only the d1440-dark project runs it.
 */
const LESSONS = readyLessons();
const HTTP = '/how-the-internet-works/what-is-http';
const DHCP = LESSONS.find((l) => l.slug === 'dhcp' && l.path.startsWith('/networking/'))!.path;

test.beforeEach(({}, testInfo) => test.skip(testInfo.project.name !== 'd1440-dark', 'Sets its own window sizes: d1440-dark runs it.'));

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
const boxes = (page: Page): Promise<Box[]> =>
  page.locator('.console__controls > .cbtn').evaluateAll((all) =>
    all.map((b) => {
      const r = b.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
    }),
  );
const bg = (loc: Locator): Promise<string> => loc.evaluate((el) => getComputedStyle(el).backgroundColor);

/** The forward button's words and its › fit inside it: nothing clipped (erratum E7). */
async function expectUnclipped(page: Page, where: string): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  const fit = await nextButton(page).evaluate((button) => {
    const label = button.querySelector('.go__label')!.getBoundingClientRect();
    const arrow = button.querySelector('svg')!;
    const arrowBox = arrow.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    return {
      scroll: button.scrollWidth <= button.clientWidth,
      arrowShown: getComputedStyle(arrow).display !== 'none',
      labelGap: arrowBox.left - label.right,
      arrowInset: box.right - arrowBox.right,
      labelIn: label.left >= box.left && label.right <= box.right,
    };
  });
  expect(fit.scroll, `${where}: scrollWidth`).toBe(true);
  expect(fit.labelIn, `${where}: the words are inside the button`).toBe(true);
  if (fit.arrowShown) {
    expect(fit.labelGap, `${where}: the words clear the ›`).toBeGreaterThanOrEqual(6);
    expect(fit.arrowInset, `${where}: the › is inside the button`).toBeGreaterThanOrEqual(8);
  }
}

test.describe('the row at 1440', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('1, 5 and 7: five buttons in order, sized and placed as drawn; only the forward button is orange; the titles name the keys', async ({ page }) => {
    await open(page, `${HTTP}?step=2`);
    await hydrated(page);
    await expect(kicker(page)).toContainText('Step 2 of');
    const row = page.locator('.console__controls > *');
    await expect(row).toHaveCount(5);
    const classes = await row.evaluateAll((all) => all.map((b) => `${b.tagName} ${b.className.split(' ').at(-1)}`));
    expect(classes).toEqual(['BUTTON cbtn--speed', 'BUTTON cbtn--back', 'BUTTON cbtn--alt', 'BUTTON cbtn--replay', 'BUTTON cbtn--go']);
    expect(await replayButton(page).innerText()).toBe('');

    const b = await boxes(page);
    // D19: the four are one line at the foot of the guide, and the forward button is under them, as wide as the guide.
    expect(b.map((x) => x.w)).toEqual([52, 36, 118, 36, 355]);
    expect(b.map((x) => x.h)).toEqual([34, 34, 34, 34, 40]);
    expect(b.map((x) => x.x)).toEqual([1056, 1114, 1156, 1280, 1056]);
    expect(b.map((x) => x.y).slice(0, 4)).toEqual([765, 765, 765, 765]);
    expect(b[4]!.y).toBe(805);
    expect(b[4]!.x + b[4]!.w).toBeLessThanOrEqual(1440);

    // Orange is the forward button's alone; the replay icon and the play button take the plain tile.
    const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
    const orange = await bg(nextButton(page));
    for (const loc of [page.locator('.cbtn--speed'), page.locator('.cbtn--back'), playButton(page), replayButton(page)]) {
      expect(await bg(loc)).not.toBe(orange);
    }
    expect(accent.length).toBeGreaterThan(0);
    expect(orange).toMatch(/^rgb\((240, 112, 46|176, 70, 23)\)$/); // dark #f0702e, light #b04617

    await expect(nextButton(page)).toHaveAttribute('title', 'Next: step 3, TCP Connection (→)');
    await expect(playButton(page)).toHaveAttribute('title', 'Play all (Space)');
    await expect(page.getByRole('button', { name: 'Previous step', exact: true })).toHaveAttribute('title', 'Previous step (←)');
    await expect(replayButton(page)).toHaveAttribute('title', 'Replay step');
    await expect(replayButton(page)).toHaveAttribute('aria-disabled', 'false');
  });

  test('5: in the light theme the forward button is #b04617 and the disabled Next lesson keeps its ground', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await open(page, `${HTTP}?step=1`);
    await hydrated(page);
    expect(await bg(nextButton(page))).toBe('rgb(176, 70, 23)');
    // Some ready lesson has no next lesson: its Practice shows the disabled button.
    let found = false;
    for (const lesson of LESSONS) {
      await open(page, `${lesson.path}?step=99`);
      await hydrated(page);
      await expect(kicker(page)).toContainText('Practice');
      if ((await nextButton(page).getAttribute('aria-disabled')) !== 'true') continue;
      found = true;
      expect(await bg(nextButton(page))).toBe('rgb(176, 70, 23)');
      expect(await nextButton(page).evaluate((el) => getComputedStyle(el).opacity)).toBe('0.4');
      break;
    }
    expect(found, 'a ready lesson with a disabled Next lesson').toBe(true);
  });

  test('13a: replay is disabled on the Overview, a step with nothing to replay, Learn and Practice, and enabled on a step that plays', async ({ page }) => {
    await open(page, HTTP);
    await hydrated(page);
    await expect(replayButton(page)).toHaveAttribute('aria-disabled', 'true');
    expect(await replayButton(page).evaluate((el) => getComputedStyle(el).opacity)).toBe('0.4');
    await nextButton(page).click();
    await expect(kicker(page)).toContainText('Step 1 of');
    await expect(replayButton(page)).toHaveAttribute('aria-disabled', 'true'); // HTTP's first step has no events
    await nextButton(page).click();
    await expect(replayButton(page)).toHaveAttribute('aria-disabled', 'false');
    await open(page, `${HTTP}?step=99`);
    await expect(kicker(page)).toContainText('Practice');
    await expect(replayButton(page)).toHaveAttribute('aria-disabled', 'true');
    await expect(nextButton(page)).toHaveText('Next lesson: HTTPS');
  });

  test('13: after a replay of DHCP step 4 (its table remounts) the figure equals a fresh arrival at step 4', async ({ page, context }) => {
    test.setTimeout(120_000);
    await open(page, `${DHCP}?step=4`);
    await hydrated(page);
    await setSpeed(page, '2×');
    const rows = logRows(page);
    await expect(rows).toHaveCount(4, { timeout: 30_000 });
    await page.waitForTimeout(2500);
    await replayButton(page).click();
    await expect(rows).toHaveCount(3);
    await expect(rows).toHaveCount(4, { timeout: 30_000 });
    await page.waitForTimeout(2500);
    await settledFrame(page);
    const replayed = await figureSnapshot(page);

    const fresh = await context.newPage();
    await open(fresh, `${DHCP}?step=4`);
    await hydrated(fresh);
    await setSpeed(fresh, '2×');
    await expect(logRows(fresh)).toHaveCount(4, { timeout: 30_000 });
    await fresh.waitForTimeout(2500);
    await settledFrame(fresh);
    expect(replayed).toEqual(await figureSnapshot(fresh));
  });

  test('12 and 13: nothing moves on unasked; replay refills the log one message at a time and stays on the step', async ({ page }) => {
    await open(page, HTTP);
    await hydrated(page);
    await nextButton(page).click();
    await page.waitForTimeout(4000);
    await expect(kicker(page)).toContainText('Step 1 of');
    await nextButton(page).click();
    await nextButton(page).click();
    await expect(kicker(page)).toContainText('Step 3 of');
    const rows = page.locator('.console__log tbody tr:not(:has(td[data-idle]))');
    await expect(rows).toHaveCount(5, { timeout: 30_000 });
    await expect(playButton(page)).toHaveText('Play all');
    await replayButton(page).click();
    await expect(rows).toHaveCount(2);
    await expect(rows).toHaveCount(5, { timeout: 30_000 });
    await expect(kicker(page)).toContainText('Step 3 of');
  });
});

test.describe('14: reduced motion lands a step complete at once', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  const full = (page: Page) => logRows(page);

  test('the forward button, Back then Next, a ?step= load, a press of a stop and Resume', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page, HTTP);
    await hydrated(page);
    await nextButton(page).click();
    await nextButton(page).click();
    await nextButton(page).click();
    await expect(kicker(page)).toContainText('Step 3 of');
    await expect(full(page)).toHaveCount(5, { timeout: 150 });
    // Under reduced motion the timeline draws no fill, however long it plays.
    expect(await page.evaluate(() => document.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'tl-fill').length)).toBe(0);
    await page.getByRole('button', { name: 'Previous step', exact: true }).click();
    await nextButton(page).click();
    await expect(full(page)).toHaveCount(5, { timeout: 150 });

    await open(page, `${HTTP}?step=3`);
    await hydrated(page);
    await expect(kicker(page)).toContainText('Step 3 of');
    await expect(full(page)).toHaveCount(5, { timeout: 300 });

    await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^Step 4, HTTP Exchange/ }).click();
    await expect(kicker(page)).toContainText('Step 4 of');
    const at4 = await full(page).count();
    await page.waitForTimeout(6000);
    expect(await full(page).count(), 'step 4 landed with every row').toBe(at4);
    expect(at4).toBeGreaterThanOrEqual(5);

    // Resume: the visit to step 3 was recorded.
    await open(page, `${HTTP}?step=3`);
    await expect(kicker(page)).toContainText('Step 3 of');
    await open(page, HTTP);
    await hydrated(page);
    await page.getByRole('button', { name: /^Resume at step/ }).click();
    await expect(full(page).first()).toBeVisible({ timeout: 300 });
    const resumed = await full(page).count();
    await page.waitForTimeout(6000);
    expect(await full(page).count(), 'Resume landed with every row').toBe(resumed);
  });
});

for (const width of [375, 390]) {
  test.describe(`the phone bar at ${width}`, () => {
    test.use({ viewport: { width, height: 812 }, isMobile: true, hasTouch: true });

    for (const scheme of ['light', 'dark'] as const) {
      test(`6 (${scheme}): five 48px controls at x 12, 68, 124, 180, 236; the forward button ends 12px from the edge, unclipped, on every slot and every end`, async ({ page }) => {
        test.setTimeout(120_000);
        await page.emulateMedia({ colorScheme: scheme });
        const places = [`${HTTP}`, `${HTTP}?step=3`, `${HTTP}?step=6`, ...LESSONS.map((l) => `${l.path}?step=99`)];
        for (const path of places) {
          await open(page, path);
          await hydrated(page);
          const where = `${path} at ${width}`;
          const b = await boxes(page);
          expect(b, where).toHaveLength(5);
          expect(b.map((x) => x.h), where).toEqual([48, 48, 48, 48, 48]);
          expect(b.slice(0, 4).map((x) => [x.x, x.w]), where).toEqual([[12, 48], [68, 48], [124, 48], [180, 48]]);
          expect(b[4]!.x, where).toBe(236);
          expect(b[4]!.x + b[4]!.w, where).toBe(width - 12);
          expect(b[4]!.w, where).toBe(width - 12 - 236);
          expect((await pageOverflow(page)).sideways, where).toBe(0);
          await expectUnclipped(page, where);
          // The play button shows no words on a phone; its name is Play all or Pause.
          expect(await playButton(page).evaluate((el) => el.getBoundingClientRect().width), where).toBe(48);
          await expect(playButton(page)).toHaveAccessibleName('Play all');
        }
      });
    }

    test('6: a run keeps the same places, with Pause as its name', async ({ page }) => {
      await open(page, HTTP);
      await hydrated(page);
      const before = await boxes(page);
      await playButton(page).click();
      await expect(playButton(page)).toHaveAccessibleName('Pause');
      expect(await boxes(page)).toEqual(before);
      await playButton(page).click();
    });
  });
}

for (const [width, height, forward, arrow, controls] of [
  [374, 780, 126, false, 48],
  [360, 780, 112, false, 48],
  [359, 780, 135, false, 44],
  [320, 640, 96, false, 44],
] as const) {
  test(`6a at ${width}x${height}: the forward button is ${forward}px, words centred, ${controls}px controls, "Next lesson" unclipped`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page, `${HTTP}?step=99`);
    await hydrated(page);
    await expect(nextButton(page)).toHaveText('Next lesson');
    const b = await boxes(page);
    expect(b.slice(0, 4).map((x) => [x.w, x.h])).toEqual(Array(4).fill([controls, controls]));
    expect(b[4]!.w).toBe(forward);
    await expectUnclipped(page, `${width}`);
    // Without the ›, the words are centred in the button (within 1px).
    const off = await nextButton(page).evaluate((button) => {
      const r = button.getBoundingClientRect();
      const l = button.querySelector('.go__label')!.getBoundingClientRect();
      return Math.abs((l.left + l.right) / 2 - (r.left + r.right) / 2);
    });
    expect(off, 'the words are centred').toBeLessThanOrEqual(1);
    expect(await nextButton(page).evaluate((el) => getComputedStyle(el.querySelector('svg')!).display)).toBe(arrow ? 'inline' : 'none');
    expect((await pageOverflow(page)).sideways).toBe(0);
    if (width === 320) expect(await page.locator('.console__controls').evaluate((el) => Math.round(el.getBoundingClientRect().height))).toBe(64);
    const gaps = b.slice(0, 4).map((x, i) => b[i + 1]!.x - (x.x + x.w));
    expect(gaps.every((g) => g === (width < 360 ? 6 : 8))).toBe(true);
  });
}

// D19 (H20, E5 of job 15 retired): the controls have left the log's head, so no legend is near them. From 1100px wide the
// four buttons are one line with their words (Play all 118px) and the forward button is under them; on a tablet on its side
// the five are one row of 44px buttons at the foot of the words, Play all icon-only (B23 tunes that range).
for (const [width, height] of [
  [1100, 800],
  [1120, 800],
  [1145, 800],
  [1163, 800],
  [1164, 800],
  [1165, 800],
  [1200, 800],
  [1280, 800],
  [900, 600],
  [1024, 768],
  [1099, 700],
]) {
  test(`34 at ${width}x${height}: DHCP's Learn, log open: ${width >= 1100 ? 'four buttons on a line with Play all in words, the forward button under them' : 'five 44px buttons on one row, Play all icon-only'}, nothing clipped, no legend near them`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page, `${DHCP}?step=99`);
    await hydrated(page);
    await page.getByRole('button', { name: 'Previous step', exact: true }).click();
    await expect(kicker(page)).toContainText('Learn');
    await page.locator('.log__fold').click();
    await settledFrame(page);
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const row = [...document.querySelectorAll<HTMLElement>('.console__controls > .cbtn')].map((b) => b.getBoundingClientRect());
      return {
        tops: new Set(row.slice(0, 4).map((r) => Math.round(r.top))).size,
        goTop: Math.round(row[4]!.top),
        rowBottom: Math.round(row[0]!.bottom),
        heights: row.map((r) => Math.round(r.height)),
        play: Math.round(row[2]!.width),
        inLog: document.querySelector('.log__head .console__controls') !== null,
        goClipped: (() => {
          const go = document.querySelector<HTMLElement>('.cbtn--go .go__label')!;
          return go.scrollWidth > go.clientWidth;
        })(),
      };
    });
    expect(m.inLog, 'the controls left the log head').toBe(false);
    expect(m.tops).toBe(1);
    expect(m.goClipped).toBe(false);
    if (width >= 1100) {
      expect(m.heights).toEqual([34, 34, 34, 34, 40]);
      expect(m.play).toBeGreaterThanOrEqual(118);
      expect(m.goTop).toBeGreaterThan(m.rowBottom);
    } else {
      expect(m.heights).toEqual(Array(5).fill(44));
      expect(m.play).toBe(44);
      expect(m.goTop).toBe(Math.round(m.goTop));
    }
    await expect(playButton(page)).toHaveAccessibleName('Play all');
    expect((await pageOverflow(page)).sideways).toBe(0);
  });
}

requireLessons(LESSONS);
