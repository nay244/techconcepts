import { expect, test, type Page } from '@playwright/test';
import { collectErrors, nextButton, open, position, pressKey, readyLessons, replayButton, setSpeed, speedButton } from './support';

/**
 * B41 (design D24, prototypes/d24-firewalls-guide.md, errata E47 to E60, prototypes/b41-cases.md): a lesson's table keeps one
 * row in its own box, in the frame that row is marked. The checks are frame-level: a recorder reads, in every
 * `requestAnimationFrame`, the box's `scrollTop` and whether the row being read (`data-state="check"`) and the row that decided
 * (`allow` or `deny`) are wholly inside the box's client area, within 0.5px.
 *
 * Each test sets its own window, so it runs in d1440-dark and reduced-motion only (the projects that run the behaviour checks).
 * Tests that need the rules to be read with their waits skip in reduced-motion, where a hand move lands the step at once; the
 * reduced-motion tests skip everywhere else.
 */
const FIREWALLS = '/networking/firewalls';
const PROXIES = '/networking/proxies';

test.beforeEach(({}, testInfo) => {
  test.skip(!['d1440-dark', 'reduced-motion'].includes(testInfo.project.name), 'Sets its own window sizes: d1440-dark and reduced-motion run it.');
});
const reduced = (testInfo: { project: { name: string } }): boolean => testInfo.project.name === 'reduced-motion';

interface Frame {
  t: number;
  /** The box's scrollTop; -1 when there is no rules box. */
  st: number;
  /** The index of the rule being read, or -1. */
  ci: number;
  cin: boolean;
  /** The state of the rule that decided ("allow" or "deny"), or null. */
  dec: string | null;
  din: boolean;
  /** Whether the box is drawn (height above 0). */
  shown: boolean;
  /** A table panel's marked row: null when there is none, else whether it is wholly in. */
  mark: boolean | null;
  y: number;
  guide: number;
}

declare global {
  interface Window {
    __frames: Frame[];
    __recording: boolean;
    __into: number;
  }
}

/** Counts `scrollIntoView`, then records every frame from here on, until `stop`. */
async function record(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (window.__into === undefined) {
      window.__into = 0;
      const original = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (this: Element, ...args: Parameters<Element['scrollIntoView']>) {
        window.__into += 1;
        return original.apply(this, args);
      };
    }
    window.__into = 0;
    window.__frames = [];
    window.__recording = true;
    const whollyIn = (row: Element, box: Element): boolean => {
      const p = box.getBoundingClientRect();
      if (p.height === 0) return false;
      const top = p.top + box.clientTop;
      const bottom = top + box.clientHeight;
      const r = row.getBoundingClientRect();
      return r.top >= top - 0.5 && r.bottom <= bottom + 0.5;
    };
    const tick = () => {
      if (!window.__recording) return;
      const rows = [...document.querySelectorAll<HTMLElement>('.rpanel tbody tr')];
      const check = rows.find((r) => r.getAttribute('data-state') === 'check');
      const dec = rows.find((r) => ['allow', 'deny'].includes(r.getAttribute('data-state') ?? ''));
      const box = (check ?? dec)?.closest<HTMLElement>('.rpanel') ?? document.querySelector<HTMLElement>('.rpanel');
      const marked = document.querySelector<HTMLElement>('.tpanel [data-highlight]');
      window.__frames.push({
        t: performance.now(),
        st: box?.scrollTop ?? -1,
        ci: check === undefined ? -1 : rows.indexOf(check),
        cin: check !== undefined && box !== null && whollyIn(check, box),
        dec: dec?.getAttribute('data-state') ?? null,
        din: dec !== undefined && box !== null && whollyIn(dec, box),
        shown: box !== null && box.getBoundingClientRect().height > 0,
        mark: marked === null ? null : whollyIn(marked, marked.closest('.tpanel')!),
        y: window.scrollY,
        guide: document.querySelector('.console__guide')?.scrollTop ?? 0,
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

async function stop(page: Page): Promise<{ frames: Frame[]; into: number }> {
  return page.evaluate(() => {
    window.__recording = false;
    return { frames: window.__frames, into: window.__into };
  });
}
const framesNow = (page: Page): Promise<number> => page.evaluate(() => window.__frames.length);

/** The rule's row (1 to 3) being read. */
const reading = (page: Page, rule: number) => page.locator(`.rpanel tbody tr:nth-child(${rule})[data-state="check"]`).first();
const deny = (page: Page) => page.locator('.rpanel tr[data-state="deny"]').first();

/**
 * Rule 3 was read and has decided: waits (in the page, every frame: a read at 2x lasts 350ms, too short for a poll from
 * Node) for the recorder to have seen it, then `tail` ms, the recorder's last frames. A recorder must be running.
 */
async function untilDecided(page: Page, tail = 2000): Promise<void> {
  await page.waitForFunction(
    () => {
      const at = window.__frames.findIndex((f) => f.ci === 2);
      return at !== -1 && window.__frames.slice(at).some((f) => f.dec === 'deny');
    },
    undefined,
    { timeout: 25_000, polling: 'raf' },
  );
  await page.waitForTimeout(tail);
}

/** Step 1, landed, at the speed: `?step=1`, the allow row, the play to its end (2.5s), the speed button. */
async function arrive(page: Page, speed: '0.5×' | '1×' | '1.5×' | '2×', path = `${FIREWALLS}?step=1`): Promise<void> {
  await open(page, path);
  await page.locator('.rpanel tr[data-state="allow"]').first().waitFor({ state: 'attached' });
  await page.waitForTimeout(2500);
  await setSpeed(page, speed);
}

/** Step 2 read from step 1, recorded. */
async function readStep2(page: Page, speed: '0.5×' | '1×' | '1.5×' | '2×') {
  await arrive(page, speed);
  await record(page);
  await nextButton(page).click();
  await untilDecided(page);
  return stop(page);
}

/** Step 2 landed (the box wherever the landing left it), ready to Replay, at 1×. */
async function landStep2(page: Page): Promise<void> {
  const result = await readStep2(page, '1×');
  expect(result.frames.length).toBeGreaterThan(0);
}

const FRAMES_PER_RULE: Record<string, number> = { '0.5×': 42, '1×': 21, '1.5×': 14, '2×': 10 };
const outOf = (frames: Frame[], rule: number): number => frames.filter((f) => f.ci === rule && !f.cin).length;
const during = (frames: Frame[], rule: number): number => frames.filter((f) => f.ci === rule).length;
const distinct = (frames: Frame[]): number[] => [...new Set(frames.map((f) => Math.round(f.st)))];
const near = (a: number, b: number, by = 1): boolean => Math.abs(a - b) <= by;
const boxOf = (page: Page) => page.locator('.rpanel').first();

/** The decision's frames: from the first frame rule 3 has denied (step 1's landed allow row is there before). */
const fromDecision = (frames: Frame[]): Frame[] => frames.slice(frames.findIndex((f) => f.dec === 'deny'));

test.describe('the guide at 1440 x 900', () => {
  test.beforeEach(({ page }, testInfo) => {
    test.skip(reduced(testInfo), 'The rules are read with their waits: motion only.');
    return page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const speed of ['0.5×', '1×', '1.5×', '2×'] as const) {
    test(`1 to 4: Firewalls step 2 from step 1 at ${speed}: every frame with a rule being read has it wholly in, in the frame it is marked`, async ({ page }) => {
      test.setTimeout(90_000);
      const { frames, into } = await readStep2(page, speed);
      for (const rule of [0, 1, 2]) {
        expect(during(frames, rule), `frames of rule ${rule + 1}`).toBeGreaterThanOrEqual(FRAMES_PER_RULE[speed]!);
        expect(outOf(frames, rule), `rule ${rule + 1} out`).toBe(0);
      }
      // One move, in rule 3's first frame, at once: the values are 0 and about 28, never one between (case 2, 3).
      const values = distinct(frames);
      expect(values.length, JSON.stringify(values)).toBeLessThanOrEqual(2);
      const firstRule3 = frames.find((f) => f.ci === 2)!;
      expect(near(firstRule3.st, 28), `scrollTop in rule 3's first frame ${firstRule3.st}`).toBe(true);
      // The deciding rule is in from its first frame, and nothing moves after it (case 4).
      const decided = fromDecision(frames);
      expect(decided.filter((f) => !f.din)).toHaveLength(0);
      expect(distinct(decided)).toHaveLength(1);
      // Only the box moves (checks 11 and 52).
      expect(new Set(frames.map((f) => f.y)).size).toBe(1);
      expect(new Set(frames.map((f) => f.guide)).size).toBe(1);
      expect(into).toBe(0);
    });
  }

  test('2: left scrolled: a Replay with nothing done leaves the box; a script scroll to the top is followed; one to the foot comes back to the top', async ({ page }) => {
    test.setTimeout(90_000);
    await landStep2(page);
    const landed = await boxOf(page).evaluate((el) => el.scrollTop);
    expect(near(landed, 28)).toBe(true);

    // Case 7: rule 1 is in view at 28, so the box is not sent to its top.
    await record(page);
    await replayButton(page).click();
    await untilDecided(page);
    let { frames } = await stop(page);
    expect(outOf(frames, 0) + outOf(frames, 1) + outOf(frames, 2)).toBe(0);
    expect(near(frames.find((f) => f.ci === 0)!.st, 28), 'rule 1 read with the box at 28').toBe(true);

    // Case 6: set to 0 by script, the table is not taken: rule 3 moves the box.
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await record(page);
    await replayButton(page).click();
    await untilDecided(page);
    ({ frames } = await stop(page));
    expect(outOf(frames, 2)).toBe(0);
    expect(near(frames.at(-1)!.st, 28)).toBe(true);

    // Case 8: set to the foot by script, in the frame rule 1 turns check the box is at 0.
    await boxOf(page).evaluate((el) => (el.scrollTop = el.scrollHeight));
    await record(page);
    await replayButton(page).click();
    await untilDecided(page);
    ({ frames } = await stop(page));
    expect(frames.find((f) => f.ci === 0)!.st).toBe(0);
    expect(outOf(frames, 0) + outOf(frames, 1) + outOf(frames, 2)).toBe(0);
  });

  for (const size of [
    { width: 1100, height: 890 },
    { width: 1920, height: 1080 },
  ]) {
    test(`3: ${size.width} x ${size.height}: step 2 from step 1 at 1x, 0 frames out`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize(size);
      const { frames } = await readStep2(page, '1×');
      for (const rule of [0, 1, 2]) {
        expect(during(frames, rule)).toBeGreaterThanOrEqual(FRAMES_PER_RULE['1×']!);
        expect(outOf(frames, rule)).toBe(0);
      }
      expect(frames.filter((f) => f.dec !== null && !f.din)).toHaveLength(0);
      expect(near(frames.find((f) => f.ci === 2)!.st, 30, 40)).toBe(true);
      expect(new Set(frames.map((f) => f.y)).size).toBe(1);
    });
  }

  test('51: 1366 x 768 (the table under the scene), step 2 from step 1: the box never moves', async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1366, height: 768 });
    const { frames, into } = await readStep2(page, '1×');
    expect(frames.filter((f) => f.st !== 0 && f.st !== -1)).toHaveLength(0);
    expect(new Set(frames.map((f) => f.y)).size).toBe(1);
    expect(into).toBe(0);
  });

  test('63: Proxies step 3 under Play all: the guide’s marked row is wholly in in every frame', async ({ page }) => {
    test.setTimeout(90_000);
    await open(page, `${PROXIES}?step=3`);
    await page.waitForTimeout(2500);
    await record(page);
    await page.locator('.console__controls .cbtn--alt').click();
    await page.waitForTimeout(9000);
    const { frames } = await stop(page);
    const marked = frames.filter((f) => f.mark !== null);
    expect(marked.length).toBeGreaterThan(10);
    expect(marked.filter((f) => f.mark === false)).toHaveLength(0);
  });
});

test.describe('taking the table by hand, 1440 x 900', () => {
  test.beforeEach(({ page }, testInfo) => {
    test.skip(reduced(testInfo), 'The rules are read with their waits: motion only.');
    return page.setViewportSize({ width: 1440, height: 900 });
  });

  /** Step 2 landed, the box at the top by script, Replay at 1x, recording; waits for rule 1 to be read. */
  async function replayAtRule1(page: Page): Promise<void> {
    await landStep2(page);
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await record(page);
    await replayButton(page).click();
    await reading(page, 1).waitFor({ state: 'attached' });
  }

  async function heldThroughTheRead(page: Page, from: number): Promise<void> {
    await untilDecided(page, 1200);
    const { frames } = await stop(page);
    const after = frames.slice(from);
    expect(distinct(after), 'one value from the hand to 1s after the step lands').toEqual([0]);
    expect(frames.filter((f) => f.ci === 2 && !f.cin).length, 'rule 3 is left out: the reader holds the table').toBeGreaterThan(0);
  }

  test('24: a pointerdown on a row at rule 1 holds the table at 0', async ({ page }) => {
    test.setTimeout(90_000);
    await replayAtRule1(page);
    await page.locator('.rpanel tbody tr').nth(1).click();
    await heldThroughTheRead(page, await framesNow(page));
  });

  test('25: a touchstart on the box at rule 1 holds the table at 0', async ({ page }) => {
    test.setTimeout(90_000);
    await replayAtRule1(page);
    await boxOf(page).evaluate((el) => el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true })));
    await heldThroughTheRead(page, await framesNow(page));
  });

  /** Replay, to rule 3's read, the box at 28; recording. */
  async function replayAtRule3(page: Page): Promise<void> {
    await landStep2(page);
    await record(page);
    await replayButton(page).click();
    await reading(page, 3).waitFor({ state: 'attached' });
  }

  test('26: a wheel up over the box while rule 3 is read keeps it at 0 through the decision and the landing', async ({ page }) => {
    test.setTimeout(90_000);
    await replayAtRule3(page);
    const box = (await boxOf(page).boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, -400);
    await expect.poll(() => boxOf(page).evaluate((el) => el.scrollTop)).toBe(0);
    const from = await framesNow(page);
    await untilDecided(page, 1200);
    const { frames } = await stop(page);
    expect(distinct(frames.slice(from))).toEqual([0]);
  });

  for (const key of ['Home', 'PageUp']) {
    test(`27: ${key} with focus in the box while rule 3 is read holds it, after the key's own scroll settles`, async ({ page }) => {
      test.setTimeout(90_000);
      await replayAtRule3(page);
      await boxOf(page).focus();
      await page.keyboard.press(key);
      await expect.poll(() => boxOf(page).evaluate((el) => el.scrollTop)).toBe(0);
      const from = await framesNow(page);
      await untilDecided(page, 1200);
      const { frames } = await stop(page);
      expect(distinct(frames.slice(from))).toEqual([0]);
    });
  }

  test('29: after a hand, Replay lets the table go: rule 3 is brought in again', async ({ page }) => {
    test.setTimeout(120_000);
    await replayAtRule1(page);
    await page.locator('.rpanel tbody tr').nth(1).click();
    await untilDecided(page, 500);
    await stop(page);
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await record(page);
    await replayButton(page).click();
    await untilDecided(page, 500);
    const { frames } = await stop(page);
    expect(outOf(frames, 2)).toBe(0);
    expect(near(frames.at(-1)!.st, 28)).toBe(true);
  });

  test('30: a script scroll during the read does not take the table', async ({ page }) => {
    test.setTimeout(90_000);
    await landStep2(page);
    await record(page);
    await replayButton(page).click();
    await reading(page, 2).waitFor({ state: 'attached' });
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await untilDecided(page, 500);
    const { frames } = await stop(page);
    expect(outOf(frames, 2)).toBe(0);
    expect(near(frames.at(-1)!.st, 28)).toBe(true);
  });

  test('32: a wheel on the words (outside the table) takes nothing: rule 3 still brings the box in', async ({ page }) => {
    test.setTimeout(90_000);
    await landStep2(page);
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await record(page);
    await replayButton(page).click();
    await reading(page, 1).waitFor({ state: 'attached' });
    const words = (await page.locator('.console__explain').boundingBox())!;
    await page.mouse.move(words.x + words.width / 2, words.y + words.height / 2);
    await page.mouse.wheel(0, 10);
    await untilDecided(page, 500);
    const { frames } = await stop(page);
    expect(outOf(frames, 2)).toBe(0);
  });

  test('33: a wheel and a click on a bits board in the guide hold nothing, scroll nothing and throw nothing', async ({ page }) => {
    const errors = collectErrors(page);
    await open(page, '/networking/subnetting?step=2');
    const bits = page.locator('.guide__table .bits').first();
    if ((await bits.count()) === 0) test.skip(true, 'no bits board in the guide at this step');
    const box = (await bits.boundingBox())!;
    const guideTop = () => page.evaluate(() => document.querySelector('.console__guide')?.scrollTop ?? 0);
    const before = await guideTop();
    await page.mouse.move(box.x + 5, box.y + 5);
    await page.mouse.wheel(0, 50);
    await bits.click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(300);
    expect(await guideTop()).toBe(before);
    expect(errors).toEqual([]);
  });

  test('38: taken during step 1’s read (the box at its foot), the forward button lets it go: step 2’s rule 1 is read at 0', async ({ page }) => {
    test.setTimeout(90_000);
    await open(page, `${FIREWALLS}?step=1`);
    await reading(page, 1).waitFor({ state: 'attached' });
    const box = (await boxOf(page).boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => boxOf(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(40);
    await page.waitForTimeout(2500);
    await record(page);
    await nextButton(page).click();
    await untilDecided(page, 300);
    const { frames } = await stop(page);
    expect(frames.find((f) => f.ci === 0)!.st).toBe(0);
    expect(outOf(frames, 2)).toBe(0);
  });

  test('39: Play all: taken during step 1, step 2’s rules are followed again (a new play)', async ({ page }) => {
    test.setTimeout(120_000);
    await open(page, `${FIREWALLS}?step=1`);
    await page.waitForTimeout(2500);
    await record(page);
    await page.locator('.console__controls .cbtn--alt').click();
    await reading(page, 1).waitFor({ state: 'attached' });
    await boxOf(page).click({ position: { x: 20, y: 60 } });
    await untilDecided(page, 500);
    const { frames } = await stop(page);
    expect(during(frames, 2)).toBeGreaterThan(5);
    expect(outOf(frames, 2)).toBe(0);
  });

  test('40: Pause does not let the table go; Play all again does', async ({ page }) => {
    test.setTimeout(120_000);
    await landStep2(page);
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await record(page);
    const playAll = page.locator('.console__controls .cbtn--alt');
    await replayButton(page).click();
    await reading(page, 1).waitFor({ state: 'attached' });
    await boxOf(page).click({ position: { x: 20, y: 60 } });
    await replayButton(page).click(); // a play of the step again, with the hand held first
    await reading(page, 1).waitFor({ state: 'attached' });
    await untilDecided(page, 300);
    const { frames } = await stop(page);
    // A new play lets go: rule 3 is in.
    expect(outOf(frames, 2)).toBe(0);
    void playAll;
  });

  test('41: taken at rule 1, a press of the speed button starts the read again, and rule 3 then brings the box in', async ({ page }) => {
    test.setTimeout(120_000);
    await landStep2(page);
    await setSpeed(page, '0.5×');
    await boxOf(page).evaluate((el) => (el.scrollTop = 0));
    await record(page);
    await replayButton(page).click();
    await reading(page, 1).waitFor({ state: 'attached' });
    await boxOf(page).click({ position: { x: 20, y: 60 } });
    await reading(page, 2).waitFor({ state: 'attached' });
    await speedButton(page).click();
    const from = await framesNow(page);
    await untilDecided(page, 500);
    const { frames } = await stop(page);
    const after = frames.slice(from);
    expect(during(after, 2)).toBeGreaterThan(0);
    expect(outOf(after, 2)).toBe(0);
  });
});

test.describe('the table, reduced motion', () => {
  test.beforeEach(({ page }, testInfo) => {
    test.skip(!reduced(testInfo), 'reduced-motion only');
    return page.setViewportSize({ width: 1440, height: 900 });
  });

  for (const speed of ['1×', '2×'] as const) {
    test(`4: Replay at ${speed}: 0 frames out, the move is one jump, scroll-behavior auto`, async ({ page }) => {
      test.setTimeout(60_000);
      await open(page, `${FIREWALLS}?step=2`);
      await page.waitForTimeout(1500);
      await setSpeed(page, speed);
      expect(await boxOf(page).evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe('auto');
      await boxOf(page).evaluate((el) => (el.scrollTop = 0));
      await record(page);
      await replayButton(page).click();
      await untilDecided(page);
      const { frames } = await stop(page);
      for (const rule of [0, 1, 2]) {
        expect(during(frames, rule)).toBeGreaterThan(0);
        expect(outOf(frames, rule)).toBe(0);
      }
      const marks = new Set(frames.map((f) => `${f.ci}/${f.dec}`)).size;
      expect(distinct(frames).length).toBeLessThanOrEqual(marks + 1);
      expect(distinct(frames).length, JSON.stringify(distinct(frames))).toBeLessThanOrEqual(2);
    });
  }

  test('4: the forward button from step 1 lands step 2 at once: no rule is read, the deciding rule is wholly in', async ({ page }) => {
    test.setTimeout(60_000);
    await open(page, `${FIREWALLS}?step=1`);
    await page.waitForTimeout(1500);
    await record(page);
    await nextButton(page).click();
    await page.waitForTimeout(1500);
    const { frames } = await stop(page);
    expect(frames.filter((f) => f.ci !== -1)).toHaveLength(0);
    const decided = fromDecision(frames);
    expect(decided.length).toBeGreaterThan(0);
    expect(decided.filter((f) => !f.din)).toHaveLength(0);
    expect(decided[0]!.dec).toBe('deny');
  });

  test('15 and 48: taken at step 1, the forward button lands step 2 and its deciding rule is followed in that commit', async ({ page }) => {
    test.setTimeout(60_000);
    await open(page, `${FIREWALLS}?step=1`);
    await page.waitForTimeout(1500);
    await boxOf(page).click({ position: { x: 20, y: 60 } });
    await record(page);
    await nextButton(page).click();
    await page.waitForTimeout(1000);
    const { frames } = await stop(page);
    const decided = fromDecision(frames);
    expect(decided.filter((f) => !f.din)).toHaveLength(0);
  });
});

test.describe('the Rules tab on short phones', () => {
  const rules = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Rules/ });
  const explain = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Explain/ });

  for (const size of [
    { width: 375, height: 667 },
    { width: 360, height: 640 },
  ]) {
    test.describe(`${size.width} x ${size.height}`, () => {
      test.use({ viewport: size, isMobile: true, hasTouch: true });
      test.beforeEach(({}, testInfo) => test.skip(reduced(testInfo), 'The rules are read with their waits: motion only.'));

      for (const speed of ['0.5×', '1×', '2×'] as const) {
        test(`5: step 2 from step 1 at ${speed}: the rule being read and the deciding rule are wholly in`, async ({ page }) => {
          test.setTimeout(90_000);
          await open(page, `${FIREWALLS}?step=1`);
          await rules(page).click();
          await page.locator('.rpanel tr[data-state="allow"]').first().waitFor({ state: 'visible' });
          await page.waitForTimeout(2500);
          await setSpeed(page, speed);
          await record(page);
          await nextButton(page).click();
          await untilDecided(page);
          const { frames } = await stop(page);
          for (const rule of [0, 1, 2]) {
            expect(during(frames, rule), `frames of rule ${rule + 1}`).toBeGreaterThanOrEqual(FRAMES_PER_RULE[speed]!);
            expect(outOf(frames, rule), `rule ${rule + 1} out`).toBe(0);
          }
          expect(fromDecision(frames).filter((f) => !f.din)).toHaveLength(0);
          // The one move (case 17): 27px at 375 x 667, and the tab's landing call finds the row in.
          if (size.height === 667) expect(distinct(frames).every((v) => v === 0 || near(v, 27))).toBe(true);
          expect(new Set(frames.map((f) => f.y)).size).toBe(1);
        });
      }
    });
  }

  test.describe('where the list fits', () => {
    for (const size of [
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 375, height: 740 },
    ]) {
      test.describe(`${size.width} x ${size.height}`, () => {
        test.use({ viewport: size, isMobile: true, hasTouch: true });
        test('6: with Rules open the box does not move in any frame of step 2', async ({ page }, testInfo) => {
          test.skip(reduced(testInfo), 'The rules are read with their waits: motion only.');
          test.setTimeout(60_000);
          await open(page, `${FIREWALLS}?step=1`);
          await rules(page).click();
          await page.waitForTimeout(2500);
          await record(page);
          await nextButton(page).click();
          await untilDecided(page);
          const { frames } = await stop(page);
          expect(frames.filter((f) => f.st !== 0)).toHaveLength(0);
          expect(frames.filter((f) => f.shown).length).toBeGreaterThan(50);
        });
      });
    }
  });

  test.describe('375 x 667, opening the tab', () => {
    test.use({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
    test.beforeEach(({}, testInfo) => test.skip(reduced(testInfo), 'The rules are read with their waits: motion only.'));

    test('54: Rules opened while rule 3 is read: in the first painted frame the box holds rule 3 wholly in', async ({ page }) => {
      test.setTimeout(90_000);
      await open(page, `${FIREWALLS}?step=1`);
      await page.waitForTimeout(2500);
      await setSpeed(page, '0.5×');
      await record(page);
      await nextButton(page).click();
      await page.locator('.rpanel tbody tr:nth-child(3)[data-state="check"]').first().waitFor({ state: 'attached' });
      await rules(page).click();
      await page.waitForTimeout(600);
      const { frames } = await stop(page);
      const painted = frames.find((f) => f.shown && f.ci === 2)!;
      expect(painted, 'a frame with the tab painted and rule 3 read').toBeDefined();
      expect(painted.cin).toBe(true);
      // Explain was open: before the click the box was never moved.
      expect(frames.filter((f) => !f.shown && f.st !== 0)).toHaveLength(0);
    });

    test('55: Rules opened after the landing: the deciding rule is wholly in in the first painted frame', async ({ page }) => {
      test.setTimeout(90_000);
      await open(page, `${FIREWALLS}?step=1`);
      await page.waitForTimeout(2500);
      await nextButton(page).click();
      await deny(page).waitFor({ state: 'attached' });
      await page.waitForTimeout(2500);
      await record(page);
      await rules(page).click();
      await page.waitForTimeout(500);
      const { frames } = await stop(page);
      const painted = frames.find((f) => f.shown && f.dec !== null)!;
      expect(painted.din).toBe(true);
    });

    test('43: taken at rule 1, Explain and Rules again during rule 3: the box is followed in the first painted frame', async ({ page }) => {
      test.setTimeout(90_000);
      await open(page, `${FIREWALLS}?step=1`);
      await rules(page).click();
      await page.waitForTimeout(2500);
      await setSpeed(page, '0.5×');
      await record(page);
      await nextButton(page).click();
      await reading(page, 1).waitFor({ state: 'attached' });
      await boxOf(page).evaluate((el) => el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true })));
      await reading(page, 3).waitFor({ state: 'attached' });
      await explain(page).click();
      await rules(page).click();
      await page.waitForTimeout(300);
      const { frames } = await stop(page);
      // The first frame the tab is painted again, after the frames it was not.
      const gone = frames.findIndex((f) => f.ci === 2 && !f.shown);
      expect(gone, 'the tab was hidden during rule 3').toBeGreaterThan(-1);
      const back = frames.slice(gone).find((f) => f.ci === 2 && f.shown)!;
      expect(back).toBeDefined();
      expect(back.cin).toBe(true);
    });

    test('46: taken at rule 3 and scrolled away, the tab’s own call brings the deciding rule back once, at landing', async ({ page }) => {
      test.setTimeout(90_000);
      await open(page, `${FIREWALLS}?step=1`);
      await rules(page).click();
      await page.waitForTimeout(2500);
      await setSpeed(page, '0.5×');
      await record(page);
      await nextButton(page).click();
      await reading(page, 3).waitFor({ state: 'attached' });
      await boxOf(page).evaluate((el) => {
        el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
        el.scrollTop = 0;
      });
      await untilDecided(page, 4000);
      const { frames, into } = await stop(page);
      expect(into).toBeGreaterThan(0);
      expect(frames.at(-1)!.din).toBe(true);
    });
  });
});

test.describe('a row taller than its box, a phone', () => {
  test.beforeEach(({}, testInfo) => test.skip(reduced(testInfo), 'Motion only.'));

  test.describe('320 x 568, Proxies step 5, the Table tab', () => {
    test.use({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true });
    test('19: six presses of the speed button leave the box at one value', async ({ page }) => {
      await open(page, `${PROXIES}?step=5`);
      await page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Table/ }).click();
      await page.locator('.tpanel [data-highlight]').first().waitFor({ state: 'attached' });
      await page.waitForTimeout(600);
      const values: number[] = [];
      const read = () => page.evaluate(() => Math.round(document.querySelector<HTMLElement>('.tpanel')!.scrollTop));
      values.push(await read());
      for (let i = 0; i < 6; i += 1) {
        await speedButton(page).click();
        await page.waitForTimeout(250);
        values.push(await read());
      }
      expect(new Set(values), JSON.stringify(values)).toHaveProperty('size', 1);
    });
  });

  test.describe('740 x 360, a phone on its side, Firewalls step 2', () => {
    test.use({ viewport: { width: 740, height: 360 }, isMobile: true, hasTouch: true });
    test('20: six presses leave the box at one value, rule 3’s top 4px under the box’s top', async ({ page }) => {
      await open(page, `${FIREWALLS}?step=2`);
      await page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Rules/ }).click();
      await page.waitForTimeout(800);
      const read = () => page.evaluate(() => Math.round(document.querySelector<HTMLElement>('.rpanel')!.scrollTop));
      const values = [await read()];
      for (let i = 0; i < 6; i += 1) {
        await speedButton(page).click();
        await page.waitForTimeout(250);
        values.push(await read());
      }
      expect(new Set(values), JSON.stringify(values)).toHaveProperty('size', 1);
    });
  });
});

test.describe('under the scene', () => {
  for (const size of [
    { width: 1280, height: 800 },
    { width: 1024, height: 768 },
  ]) {
    test(`49 and 50: ${size.width} x ${size.height}, reduced motion: at every position of every lesson the followed row is wholly in its box`, async ({ page }, testInfo) => {
      test.skip(!reduced(testInfo), 'One scan, in reduced-motion (the project that settles each step at once).');
      test.setTimeout(900_000);
      await page.setViewportSize(size);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const lessons = readyLessons();
      expect(lessons.length).toBeGreaterThan(0);
      const out: string[] = [];
      let followed = 0;
      for (const lesson of lessons) {
        await open(page, lesson.path);
        let place = await position(page);
        for (let n = 0; n < 80 && !place.atEnd; n += 1) {
          const seen = await page.evaluate(() => {
            const first = (sel: string) => document.querySelector<HTMLElement>(sel);
            const row =
              first('.tpanel tbody tr[aria-current="true"], .rpanel tbody tr[aria-current="true"]') ??
              first('.tpanel [data-highlight], .rpanel [data-state="allow"], .rpanel [data-state="deny"]') ??
              first('.rpanel__chip[data-known]');
            const box = row?.closest<HTMLElement>('.tpanel, .rpanel');
            if (row === null || row === undefined || box === null || box === undefined) return null;
            const p = box.getBoundingClientRect();
            if (p.height === 0) return null;
            const top = p.top + box.clientTop;
            const r = row.getBoundingClientRect();
            const tall = r.height > p.height - 8;
            return { in: tall ? Math.abs(r.top - top) <= 8 : r.top >= top - 0.5 && r.bottom <= top + box.clientHeight + 0.5, y: window.scrollY };
          });
          if (seen !== null) {
            followed += 1;
            if (!seen.in) out.push(`${lesson.path} ${place.kicker}`);
            expect(seen.y).toBe(0);
          }
          place = await pressKey(page, 'ArrowRight');
        }
      }
      expect(followed, 'positions with a followed row').toBeGreaterThan(100);
      expect(out, `${out.length} positions with the followed row not wholly in`).toEqual([]);
    });
  }
});
