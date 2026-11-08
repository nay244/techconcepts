import { expect, test, type Page } from '@playwright/test';
import {
  SITE_PAGES,
  collectErrors,
  hydrated,
  kicker,
  lessonCard,
  moveBy,
  nextButton,
  open,
  pageOverflow,
  readyLessons,
  requireLessons,
  settledFrame,
} from './support';

/** The ready lessons, as the built track page links to them. */
const LESSONS = readyLessons();
/** Every page of the site: the four outside the lessons, then each ready lesson. */
const ALL_PAGES = [...SITE_PAGES, ...LESSONS.map((lesson) => ({ name: lesson.slug, path: lesson.path }))];

const heroStart = (page: Page) => page.locator('.hero .actions .btn--primary');
const heroEyebrow = (page: Page) => page.locator('.hero .eyebrow');
/** The hero's first button, for every visitor: it always opens How the Internet Works. */
const HERO_START = 'Learn how the Internet Works';
const INTERNET_PATH = '/networking/how-the-internet-works';
const trackCards = (page: Page) => page.locator('.tracks > li > .card.track');
const networkingCard = (page: Page) => page.locator('.tracks a.card.track.ready[href="/networking"]');
/** Every lesson the track lists, ready or not, in the order it lists them. */
const trackItems = (page: Page) => page.locator('main ol.lessons > li, main ol.soon-list > li');

/** Walks a lesson with the next button to its last position, its last Practice, where it counts as finished. */
async function finishLesson(page: Page, path: string): Promise<void> {
  await open(page, path);
  for (let i = 0; i < 400 && (await nextButton(page).getAttribute('aria-disabled')) !== 'true'; i += 1) {
    await moveBy(page, () => nextButton(page).click());
  }
  await expect(kicker(page)).toContainText('Practice');
}

// The desktop projects run this block and the phone project the next, by its @phone tag (playwright.config.ts).
test.describe('desktop', () => {
  requireLessons(LESSONS);

  test.describe('Home', () => {
    test('is titled TechConcepts and says "4 of 20 lessons ready"', async ({ page }) => {
      await open(page, '/');
      await expect(page).toHaveTitle('TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(networkingCard(page)).toHaveAttribute('href', '/networking');
      await expect(networkingCard(page).locator('.meta')).toHaveText('4 of 20 lessons ready');
      await expect(networkingCard(page).locator('.go')).toHaveText('Open track');
      await expect(heroStart(page)).toHaveText(HERO_START);
      await expect(heroStart(page)).toHaveAttribute('href', INTERNET_PATH);
    });

    test('the first track card is How the Internet Works, ready, opening the lesson; then Networking', async ({ page }) => {
      await open(page, '/');
      const first = trackCards(page).nth(0);
      await expect(first).toHaveAttribute('href', INTERNET_PATH);
      await expect(first.locator('h3')).toHaveText('How the Internet Works');
      await expect(first.locator('.badge')).toHaveText('Beginner');
      await expect(first.locator('.meta')).toHaveText('Lesson 1, 14 protocols');
      await expect(first.locator('.go')).toHaveText('Open lesson');
      await expect(trackCards(page).nth(1)).toHaveAttribute('href', '/networking');
      await expect(page.locator('.tracks')).not.toContainText('How the Web Works');
    });

    test('coming-soon track cards are not links', async ({ page }) => {
      await open(page, '/');
      const soon = page.locator('.tracks .card.track.later');
      await expect(soon).toHaveCount(4);
      await expect(trackCards(page)).toHaveCount(6);
      for (const card of await soon.all()) {
        await expect(card.locator('.badge')).toHaveText('Coming soon');
        await expect(card.locator('a')).toHaveCount(0);
        expect(await card.evaluate((el) => el.closest('a') === null)).toBe(true);
      }
    });

    test('each exam tag links to the track filtered by it with ?for=', async ({ page }) => {
      await open(page, '/');
      const tags = await page.locator('.exams a').evaluateAll((links) =>
        links.map((a) => ({ name: a.textContent?.trim() ?? '', href: a.getAttribute('href') ?? '' })),
      );
      expect(tags.length).toBe(6);
      for (const tag of tags) {
        expect(tag.href, tag.name).toMatch(/^\/networking\?for=[a-z-]+$/);
        await open(page, tag.href);
        await expect(page.getByRole('button', { name: tag.name, exact: true })).toHaveAttribute('aria-pressed', 'true');
      }
    });
  });

  test('the skip link is the first stop on every page, and reaches the main region', async ({ page }) => {
    for (const { path } of ALL_PAGES) {
      await open(page, path);
      await page.keyboard.press('Tab');
      const skip = page.getByRole('link', { name: 'Skip to content' });
      await expect(skip, path).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page, path).toHaveURL(/#main$/);
      // The next stop after the jump is inside the main region.
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.activeElement?.closest('main#main') !== null), path).toBe(true);
    }
  });

  test('Home, the track page and About show no time figure', async ({ page }) => {
    for (const path of ['/', '/networking', '/about']) {
      await open(page, path);
      await expect(page.locator('body')).not.toContainText(/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i);
    }
  });

  test.describe('Track page', () => {
    test('lists 20 lessons, 16 of them Coming soon, with lesson 1 first and its "14 protocols"', async ({ page }) => {
      await open(page, '/networking');
      await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('.stats')).toContainText(/lessons planned\s*20/);
      await expect(page.locator('.stats')).toContainText(/ready now\s*4/);
      await expect(page.locator('.stats')).not.toContainText(/minutes in all/);

      await expect(trackItems(page)).toHaveCount(20);
      await expect(page.locator('main li.lesson')).toHaveCount(4);
      const soon = page.locator('main ol.lessons > li.soon-row, main ol.soon-list > li');
      await expect(soon).toHaveCount(16);
      await expect(soon.locator('a')).toHaveCount(0);
      for (const row of await page.locator('main li.soon-row').all()) await expect(row.locator('.badge')).toHaveText('Coming soon');
      for (const list of await page.locator('main ol.soon-list').all()) {
        await expect(list.locator('xpath=ancestor::section[1]').locator('.part-c')).toContainText('coming soon');
      }

      const first = trackItems(page).first();
      await expect(first.locator('.l-num')).toHaveText('Lesson 01');
      await expect(first.locator('a.l-link')).toHaveText('How the Internet Works');
      await expect(first.locator('.l-meta li').first()).toHaveText('14 protocols');
      // The list is named for what it holds: a one-unit lesson's card lists only exams.
      await expect(first.getByRole('list', { name: 'Protocols and exams', exact: true })).toBeVisible();
      const dhcp = trackItems(page).filter({ has: page.getByRole('link', { name: 'DHCP', exact: true }) });
      await expect(dhcp.getByRole('list', { name: 'Exams', exact: true })).toBeVisible();
    });

    test('?for= filters the lessons, the chips keep the URL in step, and an unknown value shows everything', async ({ page }) => {
      await open(page, '/networking?for=security-plus');
      await expect(page.getByRole('button', { name: 'CompTIA Security+', exact: true })).toHaveAttribute('aria-pressed', 'true');
      const shown = page.locator('main li.lesson');
      await expect(shown).not.toHaveCount(0);
      const count = await shown.count();
      expect(count).toBeLessThan(LESSONS.length);
      for (const card of await shown.all()) await expect(card.locator('.l-meta')).toContainText('CompTIA Security+');
      await expect(page.locator('main li.soon-row, main ol.soon-list > li')).toHaveCount(0);
      await expect(page.locator('.toolbar .showing')).toHaveText(`Showing ${count} ${count === 1 ? 'lesson' : 'lessons'} for CompTIA Security+.`);

      await page.getByRole('button', { name: 'All', exact: true }).click();
      await expect(page).toHaveURL(/\/networking$/);
      await expect(trackItems(page)).toHaveCount(20);
      await page.getByRole('button', { name: 'CompTIA Network+', exact: true }).click();
      await expect(page).toHaveURL(/\?for=network-plus$/);

      await open(page, '/networking?for=bogus');
      await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(trackItems(page)).toHaveCount(20);
    });
  });

  test('finishing DHCP shows Finished on the track and on Home, and Clear my progress clears both', async ({ page }) => {
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp');
    expect(dhcp, 'DHCP is a ready lesson').toBeDefined();
    await finishLesson(page, dhcp!.path);

    await open(page, '/networking');
    const card = lessonCard(page, 'dhcp');
    await expect(card.locator('.badge')).toHaveText('Finished');
    await expect(page.locator('.toc .pg-title')).toHaveText('1 of 20 complete');

    await open(page, '/');
    // The hero's eyebrow and first button stay the same for a returning visitor; only the second button changes.
    await expect(heroEyebrow(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(page.locator('.hero').getByRole('link', { name: 'Browse tracks' })).toHaveAttribute('href', '#tracks');
    await expect(heroStart(page)).toHaveText(HERO_START);
    await expect(heroStart(page)).toHaveAttribute('href', INTERNET_PATH);
    await expect(networkingCard(page).locator('.meta')).toHaveText('1 of 20 done, 0 in progress');
    await expect(networkingCard(page).locator('.go')).toHaveText('Continue');

    await open(page, '/networking');
    await page.getByRole('button', { name: 'Clear my progress' }).click();
    await expect(page.getByRole('group', { name: 'Clear all progress on this device?' })).toBeFocused();
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Progress cleared' })).toHaveCount(1);
    await expect(card.locator('.badge')).toHaveCount(0);
    await expect(page.locator('.toc .pg-title')).toHaveText('Your progress');

    await open(page, '/');
    await expect(heroEyebrow(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(networkingCard(page).locator('.meta')).toHaveText('4 of 20 lessons ready');
  });

  test('progress saved before this update still shows, then moves to the new record', async ({ page }) => {
    // One goto first, then seed: an init script would put the old record back on every navigation.
    await page.goto('/');
    const v1 = JSON.stringify({
      version: 1,
      lastLesson: 'networking/dhcp',
      lessons: { 'networking/dhcp': { status: 'finished', furthestPosition: 7, lastOpened: '2026-11-06T10:00:00.000Z' } },
    });
    await page.evaluate((value) => window.localStorage.setItem('techconcepts:v1', value), v1);

    await open(page, '/networking');
    await expect(lessonCard(page, 'dhcp')).toContainText('Finished');

    await open(page, '/networking/subnetting?step=1');
    await expect
      .poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem('techconcepts:v2') ?? '{}').lessons?.subnetting?.status))
      .toBe('in-progress');
    expect(await page.evaluate(() => window.localStorage.getItem('techconcepts:v1'))).toBeNull();
    const v2 = JSON.parse((await page.evaluate(() => window.localStorage.getItem('techconcepts:v2')))!);
    expect(v2.lessons.dhcp.status).toBe('finished');
    expect(v2.lastTrack).toBe('networking');
  });

  test('About states where progress lives, credits the inspirations and the kit, and resets', async ({ page }) => {
    // Some progress to reset: one step into DHCP.
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp')!;
    await open(page, dhcp.path);
    await moveBy(page, () => nextButton(page).click());

    await open(page, '/about');
    await expect(page).toHaveTitle('About · TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const privacy = page.locator('#privacy');
    await expect(privacy).toContainText('saved only in this browser, on this device, and never sent to a server');
    const saved = privacy.getByRole('table', { name: 'What the site remembers' });
    await expect(saved.getByRole('row', { name: /Which lessons you started and finished/ })).toContainText('This browser only');
    await expect(saved.getByRole('row', { name: /Light or dark theme/ })).toContainText('This browser only');
    await expect(saved.getByRole('row', { name: /Your Practice answers/ })).toContainText('Not saved at all');
    // The e2e build has no analytics token, so there is no sentence about analytics.
    await expect(page.locator('main')).not.toContainText('page views');

    const credits = page.locator('#credits');
    await expect(credits).toContainText('Protocol Explorer');
    await expect(credits).toContainText('TryHackMe');
    await expect(credits).toContainText('Anatomy, an open-source isometric kit by wheresryan22, used under the MIT licence');
    await expect(credits).toContainText('Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono');

    await page.getByRole('button', { name: 'Reset progress' }).click();
    await expect(page.getByRole('group', { name: 'Reset all progress on this device?' })).toBeFocused();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.locator('.a-reset [role="status"]')).toHaveText('Progress cleared');
    await expect(page.getByRole('button', { name: 'Reset progress' })).toBeFocused();

    await open(page, '/');
    await expect(heroEyebrow(page)).toHaveText('Free visual lessons, no sign-up');
  });

  test('/does-not-exist serves the 404 page, with the site header and footer', async ({ page }) => {
    const response = await page.goto('/does-not-exist');
    expect(response?.status()).toBe(404);
    await hydrated(page);
    await expect(page).toHaveTitle('Page not found · TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("That page isn't here");
    await expect(page.getByRole('link', { name: 'Go to Home' })).toHaveAttribute('href', '/');
    await expect(page.getByRole('link', { name: 'Browse Networking Concepts' })).toHaveAttribute('href', '/networking');
    await expect(page.locator('header.site-head')).toBeVisible();
    await expect(page.locator('footer.site-foot')).toBeVisible();
  });

  test('no page carries an analytics script without a token', async ({ page }) => {
    for (const { path } of ALL_PAGES) {
      await page.goto(path);
      await expect(page.locator('script[src*="cloudflareinsights"], script[data-cf-beacon]'), path).toHaveCount(0);
    }
  });

  test('no page scrolls sideways, at the top or at the bottom', async ({ page }) => {
    for (const { path } of ALL_PAGES) {
      await open(page, path);
      expect((await pageOverflow(page)).sideways, `${path} at the top`).toBe(0);
      await page.evaluate(() => window.scrollTo(0, (document.scrollingElement ?? document.documentElement).scrollHeight));
      expect((await pageOverflow(page)).sideways, `${path} at the bottom`).toBe(0);
    }
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test("no page shows the header's theme toggle, which needs JavaScript to work", async ({ page }) => {
    for (const { path } of SITE_PAGES) {
      await page.goto(path);
      await expect(page.locator('.site-head .theme-toggle'), path).toHaveCount(1);
      await expect(page.locator('.site-head .theme-toggle'), path).toBeHidden();
    }
  });

  test('the track page hides its exam chips, which need JavaScript to filter, and still shows every lesson', async ({ page }) => {
    await page.goto('/networking');
    // The chips are on the page, and none of them shows; nor does their label or the line that counts what they show.
    expect(await page.locator('main button.chip').count()).toBeGreaterThan(1);
    await expect(page.locator('main button.chip:visible')).toHaveCount(0);
    await expect(page.getByText('Show lessons for')).toBeHidden();
    await expect(page.locator('main .showing')).toBeHidden();
    // Everything the chips would filter is still there: each part, each ready lesson's card, each lesson to come.
    expect(LESSONS.length).toBeGreaterThan(0);
    for (const lesson of LESSONS) {
      await expect(lessonCard(page, lesson.slug), lesson.title).toBeVisible();
      await expect(lessonCard(page, lesson.slug).locator('a.l-link'), lesson.title).toBeVisible();
    }
    const items = trackItems(page);
    expect(await items.count()).toBeGreaterThan(LESSONS.length);
    for (const item of await items.all()) await expect(item).toBeVisible();
    for (const part of await page.locator('main section.part').all()) await expect(part).toBeVisible();
    // No control is left that cannot work.
    await expect(page.locator('button:visible')).toHaveCount(0);
  });
});

test.describe('phone', { tag: '@phone' }, () => {
  requireLessons(LESSONS);

  for (const { name, path } of ALL_PAGES) {
    test(`${path} loads and scrolls with no errors`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(path);
      expect(response?.status()).toBe(name === '404' ? 404 : 200);
      await hydrated(page);
      await page.waitForLoadState('load');
      const height = await page.evaluate(() => (document.scrollingElement ?? document.documentElement).scrollHeight);
      expect(height, 'the page is taller than the screen').toBeGreaterThan(page.viewportSize()!.height);

      // A wheel scroll moves the page, and the page can be scrolled to its end.
      await page.mouse.move(100, 400);
      await page.mouse.wheel(0, 600);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      await page.evaluate(() => window.scrollTo(0, (document.scrollingElement ?? document.documentElement).scrollHeight));
      await settledFrame(page);
      const end = await page.evaluate(() => window.scrollY + window.innerHeight);
      expect(end).toBeGreaterThanOrEqual(height - 1);
      await page.evaluate(() => window.scrollTo(0, 0));
      await settledFrame(page);
      expect(errors).toEqual([]);
    });
  }
});
