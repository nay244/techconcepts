import { expect, test, type Page } from '@playwright/test';
import {
  SITE_PAGES,
  collectErrors,
  hydrated,
  isPhone,
  kicker,
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
const networkingCard = (page: Page) => page.locator('.tracks a.card.track.ready');
const lessonCard = (page: Page, title: string) =>
  page.locator('main li.lesson', { has: page.locator('a.l-link', { hasText: new RegExp(`^${title}$`) }) });
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

test.describe('desktop', () => {
  test.beforeEach(({}, testInfo) => test.skip(isPhone(testInfo), 'The phone project only loads and scrolls each page.'));

  requireLessons(LESSONS);

  test.describe('Home', () => {
    test('is titled TechConcepts and says "4 of 20 lessons ready, 124 min"', async ({ page }) => {
      await open(page, '/');
      await expect(page).toHaveTitle('TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(networkingCard(page)).toHaveAttribute('href', '/networking');
      await expect(networkingCard(page).locator('.meta')).toHaveText('4 of 20 lessons ready, 124 min');
      await expect(networkingCard(page).locator('.go')).toHaveText('Open track');
      // A first visit starts at the track's first ready lesson.
      await expect(heroStart(page)).toHaveText('Start learning');
      await expect(heroStart(page)).toHaveAttribute('href', LESSONS[0]!.path);
    });

    test('coming-soon track cards are not links', async ({ page }) => {
      await open(page, '/');
      const soon = page.locator('.tracks .card.track.later');
      await expect(soon).toHaveCount(5);
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

  test.describe('Track page', () => {
    test('lists 20 lessons, 16 of them Coming soon, with lesson 1 first and its "14 protocols"', async ({ page }) => {
      await open(page, '/networking');
      await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('.stats')).toContainText(/lessons planned\s*20/);
      await expect(page.locator('.stats')).toContainText(/ready now\s*4/);
      await expect(page.locator('.stats')).toContainText(/minutes in all\s*124/);

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
      await expect(first.locator('.l-meta li')).toContainText(['96 min', '14 protocols']);
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

  test('finishing DHCP shows Finished on the track and Continue on Home, and Clear my progress clears both', async ({ page }) => {
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp');
    expect(dhcp, 'DHCP is a ready lesson').toBeDefined();
    await finishLesson(page, dhcp!.path);

    await open(page, '/networking');
    const card = lessonCard(page, 'DHCP');
    await expect(card.locator('.badge')).toHaveText('Finished');
    await expect(page.locator('.toc .pg-title')).toHaveText('1 of 20 complete');

    await open(page, '/');
    await expect(heroStart(page)).toHaveText('Continue DHCP');
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
    await expect(heroStart(page)).toHaveText('Start learning');
    await expect(networkingCard(page).locator('.meta')).toHaveText('4 of 20 lessons ready, 124 min');
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
    await expect(heroStart(page)).toHaveText('Start learning');
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

test.describe('phone', () => {
  test.beforeEach(({}, testInfo) => test.skip(!isPhone(testInfo), 'Only the phone project loads and scrolls each page.'));

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
