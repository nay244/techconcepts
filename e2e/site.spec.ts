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

/** The ready lessons, as the built track pages link to them. */
const LESSONS = readyLessons();
/** The ready lessons of Networking Concepts, the track with exam tags to filter by. */
const NETWORKING_LESSONS = LESSONS.filter((lesson) => lesson.path.startsWith('/networking/'));
/** Every page of the site: the six outside the lessons, then each ready lesson. */
const ALL_PAGES = [...SITE_PAGES, ...LESSONS.map((lesson) => ({ name: lesson.slug, path: lesson.path }))];

const heroStart = (page: Page) => page.locator('.hero .actions .btn--primary');
const heroEyebrow = (page: Page) => page.locator('.hero .eyebrow');
/** The hero's first button, for every visitor: it always opens How the Internet Works' first lesson. */
const HERO_START = 'Learn how the Internet Works';
/** Where every Start button leads: the first lesson of the first track. */
const START_PATH = '/how-the-internet-works/what-is-http';
const INTERNET_TRACK = '/how-the-internet-works';
const INTERNET_PARTS = ['Loading a web page', 'Getting the data there', 'Behind the scenes', 'Email', 'Files and remote control', 'The seal'];
const trackCards = (page: Page) => page.locator('.tracks > li > .card.track');
const networkingCard = (page: Page) => page.locator('.tracks a.card.track.ready[href="/networking"]');
/** Every lesson the track lists, ready or not, in the order it lists them. */
/** The Tracks page's cards: a link for a track with lessons, a plain card for one still being written. */
const tracksPageCards = (page: Page) => page.locator('.tp-grid > li > .tcard');
const headerTracksLink = (page: Page) => page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Tracks', exact: true });
const trackItems = (page: Page) => page.locator('main ol.lessons > li, main ol.soon-list > li');
const trackEyebrow = (page: Page) => page.locator('.t-hero .eyebrow');
const partTitles = (page: Page) => page.getByRole('navigation', { name: 'Parts of this track' }).locator('a > span:nth-child(2)');

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
    test('is titled TechConcepts and says "3 of 19 lessons ready"', async ({ page }) => {
      await open(page, '/');
      await expect(page).toHaveTitle('TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(networkingCard(page)).toHaveAttribute('href', '/networking');
      await expect(networkingCard(page).locator('.meta')).toHaveText('3 of 19 lessons ready');
      await expect(networkingCard(page).locator('.go')).toHaveText('Open track');
      await expect(heroStart(page)).toHaveText(HERO_START);
      await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    });

    test('the first track card is How the Internet Works, opening its track with 14 of 14 lessons ready; then Networking', async ({ page }) => {
      await open(page, '/');
      const first = trackCards(page).nth(0);
      await expect(first).toHaveAttribute('href', INTERNET_TRACK);
      await expect(first.locator('h3')).toHaveText('How the Internet Works');
      await expect(first.locator('.badge')).toHaveText('Beginner');
      await expect(first.locator('.meta')).toHaveText('14 of 14 lessons ready');
      await expect(first.locator('.go')).toHaveText('Open track');
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

  test('Home, Tracks, the track pages and About show no time figure', async ({ page }) => {
    for (const path of ['/', '/tracks', INTERNET_TRACK, '/networking', '/about']) {
      await open(page, path);
      await expect(page.locator('body')).not.toContainText(/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i);
    }
  });

  test('the header’s Tracks link and the footer’s All tracks link open /tracks on every page; Tracks is current on /tracks and the track pages', async ({ page }) => {
    // Every page with the site header and footer; lessons have neither.
    for (const { path } of SITE_PAGES) {
      await open(page, path);
      await expect(headerTracksLink(page), path).toHaveAttribute('href', '/tracks');
      await expect(page.getByRole('contentinfo').getByRole('link', { name: 'All tracks', exact: true }), path).toHaveAttribute('href', '/tracks');
      // "page" only where the link is this very page; on a track page, inside the Tracks section, it is "true".
      const current = path === '/tracks' ? 'page' : path === '/networking' || path === INTERNET_TRACK ? 'true' : null;
      if (current) await expect(headerTracksLink(page), path).toHaveAttribute('aria-current', current);
      else await expect(headerTracksLink(page), path).not.toHaveAttribute('aria-current');
    }
    await open(page, '/');
    await headerTracksLink(page).click();
    await expect(page).toHaveURL(/\/tracks$/);
  });

  test('on every page Start learning opens the first lesson, and the footer lists How the Internet Works above Networking', async ({ page }) => {
    for (const { path } of SITE_PAGES) {
      await open(page, path);
      await expect(page.locator('.site-head .head-end a.btn--primary'), path).toHaveText('Start learning');
      await expect(page.locator('.site-head .head-end a.btn--primary'), path).toHaveAttribute('href', START_PATH);
      await expect(page.locator('#menu-panel a.btn--primary'), path).toHaveAttribute('href', START_PATH);
      const footer = page.getByRole('contentinfo');
      await expect(footer.getByRole('link', { name: 'How the Internet Works', exact: true }), path).toHaveAttribute('href', INTERNET_TRACK);
      const order = await footer.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
      expect(order.indexOf(INTERNET_TRACK), path).toBeLessThan(order.indexOf('/networking'));
    }
  });

  test.describe('Tracks page', () => {
    test('How the Internet Works comes first, flagged Start here; Networking has "19 lessons · 3 ready"; A+ is no link and says "Being written"', async ({ page }) => {
      await open(page, '/tracks');
      await expect(page).toHaveTitle('Tracks · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pick a track');
      await expect(tracksPageCards(page).getByRole('heading', { level: 2 })).toHaveText(['How the Internet Works', 'Networking Concepts', 'CompTIA A+']);

      const internet = tracksPageCards(page).nth(0);
      await expect(internet).toHaveAttribute('href', INTERNET_TRACK);
      await expect(internet.locator('.kind')).toHaveText('Concept track · Beginner');
      await expect(internet.locator('.count')).toHaveText('14 lessons · 14 ready');
      await expect(internet.locator('.flag.start')).toHaveText('Start here');
      // Only the first card says where to start.
      await expect(page.locator('.tp-grid .flag.start')).toHaveCount(1);

      const networking = tracksPageCards(page).nth(1);
      await expect(networking).toHaveAttribute('href', '/networking');
      await expect(networking.locator('.kind')).toHaveText('Concept track · Beginner');
      await expect(networking.locator('.count')).toHaveText('19 lessons · 3 ready');
      await expect(networking.locator('.flag')).toHaveCount(0);
      // A first visit: no tab, no ring.
      await expect(page.locator('.tp-grid').locator('.tab-here, .ring')).toHaveCount(0);

      const aplus = tracksPageCards(page).nth(2);
      await expect(aplus.locator('.kind')).toHaveText('Certification track · Beginner');
      await expect(aplus.getByRole('heading', { level: 2 })).toHaveText('CompTIA A+');
      await expect(aplus.locator('.flag')).toHaveText('Being written');
      await expect(aplus.locator('.count')).toHaveText('No lessons yet');
      expect(await aplus.evaluate((el) => el.tagName === 'DIV' && el.closest('a') === null && el.querySelector('a') === null)).toBe(true);

      await networking.click();
      await expect(page).toHaveURL(/\/networking$/);
    });

    test('the track page’s breadcrumb steps back to Tracks', async ({ page }) => {
      await open(page, '/networking');
      const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(crumbs.getByRole('listitem')).toHaveText(['Home', 'Tracks', 'Networking Concepts']);
      await crumbs.getByRole('link', { name: 'Tracks', exact: true }).click();
      await expect(page).toHaveURL(/\/tracks$/);
    });
  });

  test.describe('Track page', () => {
    test('Networking is Track 2 and has 19 lessons, 16 of them Coming soon, with Subnetting the first ready', async ({ page }) => {
      await open(page, '/networking');
      await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(trackEyebrow(page)).toHaveText('Track 2 · Beginner');
      await expect(page.locator('.cover .c-fig')).toHaveText('Track 2');
      await expect(page.locator('[data-router-cover]')).toHaveCount(1);
      await expect(page.locator('.stats')).toContainText(/lessons planned\s*19/);
      await expect(page.locator('.stats')).toContainText(/ready now\s*3/);
      await expect(page.locator('.stats')).not.toContainText(/minutes in all/);
      // Part 1 lost How the Internet Works: both its lessons are still to come.
      await expect(page.locator('main section.part').first().locator('.part-c')).toHaveText('2 lessons, coming soon');

      await expect(trackItems(page)).toHaveCount(19);
      await expect(page.locator('main li.lesson')).toHaveCount(3);
      const soon = page.locator('main ol.lessons > li.soon-row, main ol.soon-list > li');
      await expect(soon).toHaveCount(16);
      await expect(soon.locator('a')).toHaveCount(0);
      for (const row of await page.locator('main li.soon-row').all()) await expect(row.locator('.badge')).toHaveText('Coming soon');
      for (const list of await page.locator('main ol.soon-list').all()) {
        await expect(list.locator('xpath=ancestor::section[1]').locator('.part-c')).toContainText('coming soon');
      }

      const first = page.locator('main li.lesson').first();
      await expect(first.locator('.l-num')).toHaveText('Lesson 07');
      await expect(first.locator('a.l-link')).toHaveText('Subnetting');
      // The list is named for what it holds: a one-unit lesson's card lists only exams.
      await expect(first.getByRole('list', { name: 'Exams', exact: true })).toBeVisible();
      const dhcp = trackItems(page).filter({ has: page.getByRole('link', { name: 'DHCP', exact: true }) });
      await expect(dhcp.getByRole('list', { name: 'Exams', exact: true })).toBeVisible();
    });

    test('How the Internet Works: Track 1, the web cover, six parts, a name tile on each of 14 lessons', async ({ page }) => {
      await open(page, INTERNET_TRACK);
      await expect(page).toHaveTitle('How the Internet Works · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the Internet Works');
      await expect(trackEyebrow(page)).toHaveText('Track 1 · Beginner');
      await expect(page.locator('.cover .c-fig')).toHaveText('Track 1');
      await expect(page.locator('.cover .c-title')).toHaveText('How the Internet Works');
      // A still cover: the click-to-send-packets cover stays Networking's.
      await expect(page.locator('[data-router-cover]')).toHaveCount(0);
      await expect(page.locator('.cover .stage svg')).toHaveAttribute('role', 'img');
      await expect(page.locator('.stats')).toContainText(/lessons planned\s*14/);
      await expect(page.locator('.stats')).toContainText(/ready now\s*14/);
      await expect(partTitles(page)).toHaveText(INTERNET_PARTS);
      await expect(page.getByRole('link', { name: 'Start with HTTP' })).toHaveAttribute('href', START_PATH);

      const cards = page.locator('main li.lesson');
      await expect(cards).toHaveCount(14);
      for (const card of await cards.all()) await expect(card.locator('.l-art svg.name-tile')).toHaveCount(1);
      // No exam tags until each lesson's audit: no empty lists, and nothing to filter by.
      await expect(page.locator('main ul.l-meta')).toHaveCount(0);
      await expect(page.locator('main .toolbar')).toHaveCount(0);
      await expect(lessonCard(page, 'what-is-tls').locator('.name-tile')).toHaveAttribute('aria-label', 'Transport Layer Security (SSL is its old name)');
      await expect(lessonCard(page, 'what-is-tls').locator('.nt-full')).toHaveCount(2);
    });

    test('the old lesson address forwards to the track', async ({ page }) => {
      for (const path of ['/networking/how-the-internet-works', '/networking/how-the-internet-works?step=7', '/networking/how-the-internet-works/']) {
        await page.goto(path);
        await expect(page, path).toHaveURL(/\/how-the-internet-works$/);
        await expect(page.getByRole('heading', { level: 1 }), path).toHaveText('How the Internet Works');
      }
    });

    test('?for= filters the lessons, the chips keep the URL in step, and an unknown value shows everything', async ({ page }) => {
      await open(page, '/networking?for=security-plus');
      await expect(page.getByRole('button', { name: 'CompTIA Security+', exact: true })).toHaveAttribute('aria-pressed', 'true');
      const shown = page.locator('main li.lesson');
      await expect(shown).not.toHaveCount(0);
      const count = await shown.count();
      expect(count).toBeLessThan(NETWORKING_LESSONS.length);
      for (const card of await shown.all()) await expect(card.locator('.l-meta')).toContainText('CompTIA Security+');
      await expect(page.locator('main li.soon-row, main ol.soon-list > li')).toHaveCount(0);
      await expect(page.locator('.toolbar .showing')).toHaveText(`Showing ${count} ${count === 1 ? 'lesson' : 'lessons'} for CompTIA Security+.`);

      await page.getByRole('button', { name: 'All', exact: true }).click();
      await expect(page).toHaveURL(/\/networking$/);
      await expect(trackItems(page)).toHaveCount(19);
      await page.getByRole('button', { name: 'CompTIA Network+', exact: true }).click();
      await expect(page).toHaveURL(/\?for=network-plus$/);

      await open(page, '/networking?for=bogus');
      await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await expect(trackItems(page)).toHaveCount(19);
    });
  });

  test('finishing DHCP shows Finished on the track, on Home and on Tracks, and Clear my progress clears them', async ({ page }) => {
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp');
    expect(dhcp, 'DHCP is a ready lesson').toBeDefined();
    await finishLesson(page, dhcp!.path);

    await open(page, '/networking');
    const card = lessonCard(page, 'dhcp');
    await expect(card.locator('.badge')).toHaveText('Finished');
    await expect(page.locator('.toc .pg-title')).toHaveText('1 of 19 complete');

    await open(page, '/');
    await expect(heroEyebrow(page)).toHaveText('You finished DHCP');
    // The hero's button stays the same for a returning visitor.
    await expect(heroStart(page)).toHaveText(HERO_START);
    await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    await expect(networkingCard(page).locator('.meta')).toHaveText('1 of 19 done, 0 in progress');
    await expect(networkingCard(page).locator('.go')).toHaveText('Continue');
    // How the Internet Works has no progress, so its card still reads as a first visit.
    await expect(trackCards(page).nth(0).locator('.meta')).toHaveText('14 of 14 lessons ready');

    // DHCP was opened last, in Networking: its card on Tracks wears the tab and fills its ring by 1 of 19.
    await open(page, '/tracks');
    await expect(tracksPageCards(page).nth(1).locator('.tab-here')).toHaveText('Last opened');
    await expect(tracksPageCards(page).nth(1).locator('.ring')).toHaveText('1 of 19 done');
    await expect(tracksPageCards(page).nth(0).locator('.tab-here, .ring')).toHaveCount(0);
    await expect(tracksPageCards(page).nth(2).locator('.tab-here, .ring')).toHaveCount(0);

    await open(page, '/networking');
    await page.getByRole('button', { name: 'Clear my progress' }).click();
    await expect(page.getByRole('group', { name: 'Clear all progress on this device?' })).toBeFocused();
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Progress cleared' })).toHaveCount(1);
    await expect(card.locator('.badge')).toHaveCount(0);
    await expect(page.locator('.toc .pg-title')).toHaveText('Your progress');

    await open(page, '/');
    await expect(heroEyebrow(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(networkingCard(page).locator('.meta')).toHaveText('3 of 19 lessons ready');
    await open(page, '/tracks');
    await expect(page.locator('.tp-grid').locator('.tab-here, .ring')).toHaveCount(0);
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

  test('a visitor partway through the old lesson keeps their place', async ({ page }) => {
    // One goto first, then seed: an init script would put the old record back on every navigation.
    await page.goto('/');
    const old = JSON.stringify({
      version: 2,
      lessons: { 'how-the-internet-works': { status: 'in-progress', furthestPosition: 30, lastOpened: '2026-11-06T11:00:00.000Z' } },
      lastLesson: 'how-the-internet-works',
      lastTrack: 'networking',
    });
    await page.evaluate((value) => window.localStorage.setItem('techconcepts:v2', value), old);

    // Step 30 of the old lesson was step 4 of UDP: HTTP, HTTPS and TCP before it are finished.
    await open(page, INTERNET_TRACK);
    for (const slug of ['what-is-http', 'what-is-https', 'what-is-tcp']) await expect(lessonCard(page, slug).locator('.badge'), slug).toHaveText('Finished');
    await expect(lessonCard(page, 'what-is-udp').locator('.badge')).toHaveText('In progress');
    await expect(lessonCard(page, 'what-is-ip').locator('.badge')).toHaveCount(0);
    await expect(page.locator('.toc .pg-title')).toHaveText('3 of 14 complete');
    // The track's hero goes on where they were.
    await expect(page.getByRole('link', { name: 'Continue UDP' })).toHaveAttribute('href', '/how-the-internet-works/what-is-udp?step=4');

    await open(page, '/tracks');
    await expect(tracksPageCards(page).nth(0).locator('.tab-here')).toHaveText('Last opened');
    await expect(tracksPageCards(page).nth(0).locator('.ring')).toHaveText('3 of 14 done');
    await expect(tracksPageCards(page).nth(1).locator('.tab-here, .ring')).toHaveCount(0);

    await open(page, '/');
    await expect(heroEyebrow(page)).toHaveText('You’re on step 4 of 5 in UDP');
    await expect(trackCards(page).nth(0).locator('.meta')).toHaveText('3 of 14 done, 1 in progress');
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
    expect(NETWORKING_LESSONS.length).toBeGreaterThan(0);
    for (const lesson of NETWORKING_LESSONS) {
      await expect(lessonCard(page, lesson.slug), lesson.title).toBeVisible();
      await expect(lessonCard(page, lesson.slug).locator('a.l-link'), lesson.title).toBeVisible();
    }
    const items = trackItems(page);
    expect(await items.count()).toBeGreaterThan(NETWORKING_LESSONS.length);
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
