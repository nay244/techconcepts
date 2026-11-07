import { expect, test, type Page } from '@playwright/test';
import {
  clippingContainers,
  collectErrors,
  expectLessonShape,
  figureSnapshot,
  kicker,
  logRows,
  moveBy,
  nextButton,
  open,
  pageOverflow,
  playButton,
  position,
  pressKey,
  readyLessons,
  requireLessons,
  setSpeed,
  settledFrame,
  stepCount,
  viewSwitch,
  type Position,
  type ReadyLesson,
} from './support';

/** The ready lessons, as the built track page links to them. Every check below runs for each of them. */
const LESSONS = readyLessons();
requireLessons(LESSONS);

/** Subnetting's Watch is about the address itself, so it has no Network / Sequence switch (spec §6.3, §12). */
const NO_SEQUENCE = new Set(['subnetting']);

/** How long a Play run may take: the longest first unit runs about 46 s at 1× and 23 s at 2×. */
const RUN_TIMEOUT = 120_000;

/**
 * The checks of how playback behaves (switching views mid-run, storage blocked) do not depend on the window's size,
 * so they run once with motion and once with reduced motion. Everything about layout runs at every desktop size.
 */
const BEHAVIOUR_PROJECTS = new Set(['d1440-dark', 'reduced-motion']);
const behaviourOnly = (projectName: string): void =>
  test.skip(!BEHAVIOUR_PROJECTS.has(projectName), 'Playback behaviour is checked in d1440-dark and reduced-motion.');

/** How many units the lesson has: a lesson of many lists one outline row per unit, a lesson of one lists its parts. */
async function unitCount(page: Page): Promise<number> {
  return Math.max(1, await page.locator('.console__outline .outline__unit').count());
}

/** Plays the first unit at 2× from where the page is, and waits for the run to end on Replay. */
async function playToReplay(page: Page): Promise<void> {
  await setSpeed(page, '2×');
  await playButton(page).click();
  await expect(playButton(page)).toHaveText('Pause');
  await expect(playButton(page)).toHaveText('Replay', { timeout: RUN_TIMEOUT });
}

/** What the page shows that is too big for the window, at the kicker's position; null when nothing is. */
async function overflowAt(page: Page, where: string): Promise<string | null> {
  const { down, sideways } = await pageOverflow(page);
  return down === 0 && sideways === 0 ? null : `${where}: the page scrolls ${down}px down and ${sideways}px sideways`;
}

for (const lesson of LESSONS) {
  test.describe(lesson.title, () => {
    test.describe.configure({ timeout: 180_000 });

    test('→ walks Overview, every step, Learn and Practice, ← walks back, and the page never scrolls', async ({ page }) => {
      const errors = collectErrors(page);
      await open(page, lesson.path);
      const units = await unitCount(page);
      const sequence = !NO_SEQUENCE.has(lesson.slug);

      const problems: string[] = [];
      /** At every position: the page fits the window, and the scene's view switch is there or not, as the lesson has it. */
      const check = (at: Position): Position => {
        if (at.down > 0 || at.sideways > 0) problems.push(`${at.kicker}: the page scrolls ${at.down}px down and ${at.sideways}px sideways`);
        if (at.viewSwitches !== (sequence ? 1 : 0)) problems.push(`${at.kicker}: the Network / Sequence switch is ${sequence ? 'missing' : 'there'}`);
        return at;
      };
      let at = check(await position(page));
      const forward = [at.kicker];
      while (!at.atEnd) {
        at = check(await pressKey(page, 'ArrowRight'));
        forward.push(at.kicker);
        expect(forward.length, 'the walk ends').toBeLessThan(400);
      }
      expect(expectLessonShape(forward)).toBe(units);

      const back = [at.kicker];
      while (!at.atStart) {
        at = check(await pressKey(page, 'ArrowLeft'));
        back.push(at.kicker);
        expect(back.length, 'the walk back ends').toBeLessThanOrEqual(forward.length);
      }
      expect(back).toEqual([...forward].reverse());
      expect(problems).toEqual([]);
      expect(errors).toEqual([]);
    });

    test('the outline reaches every place, and so does the next button, in the same order', async ({ page }) => {
      const errors = collectErrors(page);
      await open(page, lesson.path);
      const outline = page.locator('.console__outline');
      const units = outline.locator('.outline__unit');
      const unitTotal = await units.count();

      const visited = [(await kicker(page).textContent()) ?? ''];
      /** Clicks each place of the open unit after its Overview, which is where the walk already is. */
      const clickParts = async (items: ReturnType<Page['locator']>): Promise<void> => {
        const count = await items.count();
        await expect(items.first()).toHaveAttribute('aria-current', 'step');
        for (let i = 1; i < count; i += 1) {
          visited.push((await moveBy(page, () => items.nth(i).click())).kicker);
          await expect(items.nth(i)).toHaveAttribute('aria-current', 'step');
        }
      };
      if (unitTotal === 0) {
        await clickParts(outline.locator('.outline__list .outline__item'));
      } else {
        for (let u = 0; u < unitTotal; u += 1) {
          if (u > 0) visited.push((await moveBy(page, () => units.nth(u).click())).kicker);
          await expect(units.nth(u)).toHaveAttribute('aria-current', 'true');
          await clickParts(outline.locator('.outline__parts .outline__item'));
        }
      }
      expect(expectLessonShape(visited)).toBe(Math.max(1, unitTotal));

      await open(page, lesson.path);
      let at = await position(page);
      const byNext = [at.kicker];
      while (!at.atEnd) {
        at = await moveBy(page, () => nextButton(page).click());
        byNext.push(at.kicker);
        expect(byNext.length, 'the walk ends').toBeLessThanOrEqual(visited.length);
      }
      expect(byNext).toEqual(visited);
      expect(errors).toEqual([]);
    });

    test('Play runs every step of the unit to the last, then says Replay, with the log filled', async ({ page }) => {
      const errors = collectErrors(page);
      await open(page, lesson.path);
      const steps = await stepCount(page);
      await expect(logRows(page)).toHaveCount(0);
      await playToReplay(page);
      await expect(kicker(page)).toContainText(`Step ${steps} of ${steps}`);
      // Every step's segment is passed, and the last is current.
      const segments = page.locator('.topbar__segments .topbar__group').first().locator('.topbar__step');
      for (let i = 0; i < steps - 1; i += 1) await expect(segments.nth(i)).toHaveAttribute('data-state', 'done');
      await expect(segments.nth(steps - 1)).toHaveAttribute('data-state', 'current');
      expect(await logRows(page).count()).toBeGreaterThanOrEqual(steps);
      await expect(page.locator('.console__log td[data-idle]')).toHaveCount(0);
      // The scene at its fullest, with every row its tables get, still fits the window.
      expect(await overflowAt(page, 'the end of the run')).toBeNull();
      expect(errors).toEqual([]);
    });

    test('fits one screen, and the explanation scrolls inside itself', async ({ page }) => {
      await open(page, lesson.path);
      const explanation = page.getByRole('region', { name: 'Explanation' });
      expect(['auto', 'scroll']).toContain(await explanation.evaluate((el) => getComputedStyle(el).overflowY));
      expect(await overflowAt(page, 'Overview')).toBeNull();

      // Learn with Go deeper open is the longest explanation: it scrolls inside its panel, and the page does not.
      const steps = await stepCount(page);
      await open(page, `${lesson.path}?step=${steps + 1}`);
      await expect(kicker(page)).toContainText('Learn');
      await explanation.locator('summary', { hasText: 'Go deeper' }).click();
      await expect(explanation.locator('.explain__sources')).toBeVisible();
      const room = await explanation.evaluate((el) => ({ content: el.scrollHeight, box: el.clientHeight }));
      expect(room.content, 'Learn with Go deeper open is taller than its panel').toBeGreaterThan(room.box);
      await explanation.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      await expect.poll(() => explanation.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
      expect(await overflowAt(page, 'Learn, Go deeper open')).toBeNull();

      // The track's whole list, open over the console, does not make the page scroll either.
      await page.getByRole('button', { name: /^All \d+ lessons$/ }).click();
      await expect(page.getByRole('dialog', { name: /^All \d+ lessons$/ })).toBeVisible();
      expect(await overflowAt(page, 'All lessons open')).toBeNull();
    });

    test(`the Network / Sequence switch is ${NO_SEQUENCE.has(lesson.slug) ? 'hidden' : 'there, and switching views mid-run and back leaves the scene settled'}`, async ({
      page,
      context,
    }, testInfo) => {
      const errors = collectErrors(page);
      await open(page, lesson.path);
      if (NO_SEQUENCE.has(lesson.slug)) {
        await expect(viewSwitch(page)).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Sequence', exact: true })).toHaveCount(0);
        return;
      }
      await expect(viewSwitch(page)).toHaveCount(1);
      behaviourOnly(testInfo.project.name);
      const network = viewSwitch(page).getByRole('button', { name: 'Network', exact: true });
      const sequence = viewSwitch(page).getByRole('button', { name: 'Sequence', exact: true });
      const figure = page.locator('.stage__figure');
      await expect(network).toHaveAttribute('aria-pressed', 'true');

      // Mid-run: the first message has landed and the run is still going.
      await setSpeed(page, '2×');
      await playButton(page).click();
      await expect(logRows(page).first()).toBeVisible({ timeout: RUN_TIMEOUT });
      await expect(playButton(page)).toHaveText('Pause');
      const landed = await logRows(page).count();
      await sequence.click();
      await expect(sequence).toHaveAttribute('aria-pressed', 'true');
      await expect(figure).toBeHidden();
      await expect(page.locator('.console__scene .seq')).toBeVisible();
      // The run goes on while the Sequence view shows it.
      await expect.poll(() => logRows(page).count(), { timeout: RUN_TIMEOUT }).toBeGreaterThan(landed);
      await network.click();
      await expect(figure).toBeVisible();
      await expect(page.locator('.console__scene .seq')).toHaveCount(0);
      await expect(playButton(page)).toHaveText('Replay', { timeout: RUN_TIMEOUT });
      await settledFrame(page);
      const switched = await figureSnapshot(page);

      // A run of the last step on a page that never switched views ends on the same scene.
      const steps = await stepCount(page);
      const fresh = await context.newPage();
      const freshErrors = collectErrors(fresh);
      await open(fresh, `${lesson.path}?step=${steps}`);
      await expect(kicker(fresh)).toContainText(`Step ${steps} of ${steps}`);
      await playToReplay(fresh);
      await expect(logRows(fresh)).toHaveCount(await logRows(page).count());
      await settledFrame(fresh);
      expect(switched).toEqual(await figureSnapshot(fresh));
      expect([...errors, ...freshErrors]).toEqual([]);
    });

    test('with localStorage throwing, the lesson still plays end to end', async ({ page }, testInfo) => {
      behaviourOnly(testInfo.project.name);
      await page.addInitScript(() =>
        Object.defineProperty(window, 'localStorage', {
          get() {
            throw new DOMException('blocked', 'SecurityError');
          },
        }),
      );
      const errors = collectErrors(page);
      await open(page, lesson.path);
      expect(
        await page.evaluate(() => {
          try {
            return window.localStorage === null;
          } catch {
            return 'throws';
          }
        }),
      ).toBe('throws');
      await playToReplay(page);
      expect(await logRows(page).count()).toBeGreaterThan(0);
      let at = await position(page);
      for (let moves = 0; !at.atEnd; moves += 1) {
        at = await pressKey(page, 'ArrowRight');
        expect(moves, 'the walk ends').toBeLessThan(400);
      }
      await expect(kicker(page)).toContainText('Practice');
      // Practice still answers.
      await page.locator('.console__explain .practice__option').first().click();
      await expect(page.locator('.console__explain .practice__feedback').first()).not.toBeEmpty();
      expect(errors).toEqual([]);
    });
  });
}

test.describe('lesson specifics', () => {
  test.describe.configure({ timeout: 180_000 });

  test('a lesson page names its canonical URL, the same address as og:url', async ({ page }) => {
    // The configured site (astro.config), not baseURL: og:url has always been built on it.
    const canonical = new URL('/networking/dhcp', 'https://techconcepts.app').href;
    await page.goto('/networking/dhcp');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical);
  });

  /** A lesson the brief names, found among the ready ones. */
  function lessonNamed(slug: string): ReadyLesson {
    const lesson = LESSONS.find((l) => l.slug === slug);
    if (lesson === undefined) throw new Error(`${slug} is not among the ready lessons the track page links to.`);
    return lesson;
  }

  test('reduced motion: a Play run takes as long as it does with motion (DHCP)', async ({ browser, page }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'Compares the reduced-motion project with a normal run.');
    const dhcp = lessonNamed('dhcp');
    /** One run of the lesson's first unit at 1×, from Play to Replay, measured in the page. */
    async function runTime(p: Page): Promise<number> {
      await open(p, dhcp.path);
      await p.evaluate(() => {
        const button = document.querySelector('.console__controls .cbtn--play')!;
        const w = window as unknown as { runStart: number; runEnd: Promise<number> };
        w.runEnd = new Promise((resolve) => {
          new MutationObserver(() => {
            if (button.textContent?.includes('Replay')) resolve(performance.now());
          }).observe(button, { subtree: true, characterData: true, childList: true });
        });
        button.addEventListener('click', () => (w.runStart = performance.now()), { once: true, capture: true });
      });
      await playButton(p).click();
      await expect(playButton(p)).toHaveText('Replay', { timeout: RUN_TIMEOUT });
      return p.evaluate(async () => {
        const w = window as unknown as { runStart: number; runEnd: Promise<number> };
        return Math.round((await w.runEnd) - w.runStart);
      });
    }
    const { baseURL, viewport } = testInfo.project.use;
    const normalContext = await browser.newContext({ baseURL, viewport, reducedMotion: 'no-preference' });
    const normalPage = await normalContext.newPage();
    expect(await normalPage.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    const normal = await runTime(normalPage);
    await normalContext.close();
    const reduced = await runTime(page);
    const note = `${dhcp.title}'s first unit, Play to Replay at 1×: ${normal} ms with motion, ${reduced} ms with reduced motion`;
    testInfo.annotations.push({ type: 'run time', description: note });
    // As long as normal: within a quarter either way.
    expect(Math.abs(reduced - normal) / normal).toBeLessThanOrEqual(0.25);
  });

  test('DHCP: a focused lease table keeps focus while playback adds a row to it', async ({ page }) => {
    const dhcp = lessonNamed('dhcp');
    // Step 4 plays the Acknowledge, then a table event that remounts the lease table with its new row.
    await open(page, `${dhcp.path}?step=4`);
    const table = page.getByRole('region', { name: 'DHCP lease table' });
    const lease = table.getByRole('cell', { name: '192.168.1.100' });
    // The row must arrive after the focus, or the remount is never tested.
    await expect(lease).toHaveCount(0);
    await table.focus();
    await expect(lease).toBeVisible({ timeout: 30_000 });
    await expect(table).toBeFocused();
  });

  test("DHCP: the Acknowledge step, once played, announces the ACK's words and then the lease table's change", async ({ page }) => {
    const dhcp = lessonNamed('dhcp');
    // Step 4 plays the Acknowledge, then the table change, which the real driver gives no time.
    await open(page, `${dhcp.path}?step=4`);
    await expect(page.locator('[aria-live="polite"][data-announce]')).toHaveText(
      'DHCP Acknowledge. The router confirms: 192.168.1.100 is the laptop’s for 24 hours. ' +
        'The router writes down that 192.168.1.100 belongs to the laptop for 24 hours.',
      { timeout: 30_000 },
    );
  });

  test('Firewalls: the matched rule row is in view at every step', async ({ page }) => {
    const firewalls = lessonNamed('firewalls');
    // Each step's visit and the rule that decides it (the list is reordered before step 6); step 5's reply is let
    // through as a connection the firewall remembers, without reading the rules.
    const expected: ({ rule: string; state: 'allow' | 'deny' } | 'known')[] = [
      { rule: '1', state: 'allow' },
      { rule: '3', state: 'deny' },
      { rule: '2', state: 'allow' },
      { rule: '3', state: 'deny' },
      'known',
      { rule: '1', state: 'deny' },
    ];
    await open(page, firewalls.path);
    expect(await stepCount(page)).toBe(expected.length);
    await setSpeed(page, '2×');
    for (const [i, match] of expected.entries()) {
      const where = `step ${i + 1}`;
      // Moving to a step plays it.
      await moveBy(page, () => nextButton(page).click());
      const target =
        match === 'known'
          ? page.locator('.rpanel .rpanel__chip[data-known]')
          : page.locator('.rpanel tbody tr[data-state="allow"], .rpanel tbody tr[data-state="deny"]');
      await expect(target, where).toHaveCount(1, { timeout: 30_000 });
      if (match !== 'known') {
        await expect(target, where).toHaveAttribute('data-state', match.state);
        await expect(target.locator('td').first(), where).toHaveText(match.rule);
      }
      await expect(target, where).toBeInViewport({ ratio: 1 });
      expect(await clippingContainers(target), where).toEqual([]);
      expect(await overflowAt(page, where)).toBeNull();
    }
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every lesson says it needs JavaScript to play, and shows no control that cannot work', async ({ page }) => {
    for (const lesson of LESSONS) {
      await page.goto(lesson.path);
      const where = lesson.title;
      // Found by its class: Playwright's text matching skips what is inside a <noscript>.
      const note = page.locator('.console__log td[data-idle] noscript .log__nojs');
      await expect(note, where).toBeVisible();
      await expect(note, where).toHaveText('This lesson needs JavaScript to play.');
      await expect(page.locator('.console__log .log__idle-words'), where).toBeHidden();
      // No button works without JavaScript, so none shows: the theme and view switches, playback, the outline's places.
      await expect(page.locator('button:visible'), where).toHaveCount(0);
      // The outline goes whole, so no empty "This lesson" landmark is left, but it keeps its cell in the grid.
      const outline = page.locator('nav.console__outline');
      await expect(outline, where).toBeHidden();
      await expect(page.getByRole('navigation', { name: /^(This lesson|\d+ protocols)$/ }), where).toHaveCount(0);
      expect((await outline.boundingBox())?.width ?? 0, `${where}: the outline's cell`).toBeGreaterThan(100);
      // The Overview's words, the figure and the way back to the track stay.
      await expect(page.locator('.console__explain .explain__title'), where).toBeVisible();
      await expect(page.locator('.console__stage svg[data-figure]'), where).toBeVisible();
      await expect(page.locator('.topbar__crumb a'), where).toBeVisible();
      // The page does not scroll. (Measured at once: with JavaScript off no frame callback runs, so overflowAt cannot wait.)
      const overflow = await page.evaluate(() => {
        const root = document.scrollingElement ?? document.documentElement;
        return [root.scrollHeight - window.innerHeight, root.scrollWidth - window.innerWidth].map((n) => Math.max(0, n));
      });
      expect(overflow, `${where}: [down, sideways]`).toEqual([0, 0]);
    }
  });
});
