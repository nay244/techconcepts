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

const heroStart = (page: Page) => page.locator('.hero .hero-actions .btn--primary');
const heroChip = (page: Page) => page.locator('.hero .hero-chip');
/** The hero's first button, for every visitor: it always opens How the Internet Works' first lesson. */
const HERO_START = 'Learn how the Internet Works';
/** Where every Start button leads: the first lesson of the first track. */
const START_PATH = '/how-the-internet-works/what-is-http';
const INTERNET_TRACK = '/how-the-internet-works';
const INTERNET_PARTS = ['Loading a web page', 'Getting the data there', 'Behind the scenes', 'Email', 'Files and remote control', 'The seal'];
/** Home's track cards: one link each, to the track's panel on Tracks. */
const trackCards = (page: Page) => page.locator('#tracks .home-tracks > li > a.home-track');
/** The lesson Home shows from the inside, and links into at each of its parts. */
const OSI_PATH = '/networking/osi-model';
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
    test('Home: hero button opens the first lesson; See a lesson goes to #inside', async ({ page }) => {
      await open(page, '/');
      await expect(page).toHaveTitle('TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('See how technology really works.');
      await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
      // Three covers stand beside the words, as decoration only.
      await expect(page.locator('.hero .hero-art[aria-hidden="true"] > svg')).toHaveCount(3);
      await expect(heroStart(page)).toHaveText(HERO_START);
      await expect(heroStart(page)).toHaveAttribute('href', START_PATH);

      const see = page.locator('.hero').getByRole('link', { name: 'See a lesson', exact: true });
      await expect(see).toHaveAttribute('href', '#inside');
      await see.click();
      await expect(page).toHaveURL(/\/#inside$/);
      await expect(page.locator('#inside')).toBeInViewport();

      await open(page, '/');
      await heroStart(page).click();
      await expect(page).toHaveURL(new RegExp(`${START_PATH}$`));
      await expect(kicker(page)).toHaveText('Overview');
    });

    test('Home: How it works, Questions and See a lesson each land their section clear of the sticky header', async ({ page }) => {
      const nav = page.getByRole('navigation', { name: 'Site', exact: true });
      const links = [
        { id: 'how', link: nav.getByRole('link', { name: 'How it works', exact: true }) },
        { id: 'faq', link: nav.getByRole('link', { name: 'Questions', exact: true }) },
        { id: 'inside', link: page.locator('.hero').getByRole('link', { name: 'See a lesson', exact: true }) },
      ];
      for (const { id, link } of links) {
        await open(page, '/');
        await link.click();
        await expect(page).toHaveURL(new RegExp(`/#${id}$`));
        // Wait for the scroll to settle (it is smooth, except under reduced motion), with the heading on screen.
        const measure = () =>
          page.evaluate((sectionId) => {
            const h2 = document.querySelector(`#${sectionId} h2`)!.getBoundingClientRect();
            const head = document.querySelector('.site-head')!.getBoundingClientRect();
            return { y: window.scrollY, h2Top: h2.top, h2Bottom: h2.bottom, headBottom: head.bottom, height: window.innerHeight };
          }, id);
        await expect
          .poll(async () => {
            const a = await measure();
            await page.waitForTimeout(120);
            const b = await measure();
            return a.y === b.y && b.y > 0 && b.h2Bottom <= b.height;
          }, { message: `#${id} settles on screen` })
          .toBe(true);
        const at = await measure();
        expect(at.h2Top, `#${id}'s heading starts below the header`).toBeGreaterThanOrEqual(at.headBottom);
      }
    });

    test('Home: three track cards in order, linking to their Tracks panels, with no exam tags', async ({ page }) => {
      await open(page, '/');
      await expect(page.locator('#tracks').getByRole('heading', { level: 2 })).toHaveText('Choose where to start.');
      await expect(trackCards(page)).toHaveCount(3);
      await expect(trackCards(page).locator('h3')).toHaveText(['How the Internet Works', 'Networking Concepts', 'CompTIA A+']);
      expect(await trackCards(page).evaluateAll((cards) => cards.map((a) => a.getAttribute('href')))).toEqual([
        '/tracks#how-the-internet-works',
        '/tracks#networking',
        '/tracks#comptia-a-plus',
      ]);
      await expect(trackCards(page).locator('.home-track__count')).toHaveText(['14 lessons', '4 of 19 lessons ready', 'Lessons on the way']);
      await expect(trackCards(page).locator('.home-track__go')).toHaveText(['See the lessons →', 'See the lessons →', 'See the track']);
      await expect(trackCards(page).nth(0).locator('.h-chip')).toHaveText(['Beginner', 'Start here']);
      await expect(trackCards(page).nth(1).locator('.h-chip')).toHaveText(['Beginner']);
      await expect(trackCards(page).nth(2).locator('.h-chip')).toHaveText(['Not ready yet']);
      // Each card is one link, and nothing on Home shows progress or an exam to filter by.
      for (const card of await trackCards(page).all()) await expect(card.locator('a, button')).toHaveCount(0);
      await expect(page.locator('main a[href*="?for="]')).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(/Network\+|Security\+|CCNA|lessons done|in progress/i);

      // The card hover (spec §5.7): under the pointer a card takes the 1.5px ring in the accent, which no style of the
      // page's own may cancel.
      const accent = await page.evaluate(() => {
        const probe = document.body.appendChild(document.createElement('i'));
        probe.style.color = 'var(--accent)';
        const colour = getComputedStyle(probe).color;
        probe.remove();
        return colour;
      });
      const first = trackCards(page).nth(0);
      await first.hover();
      await expect.poll(() => first.evaluate((el) => getComputedStyle(el).boxShadow)).toContain(`${accent} 0px 0px 0px 1.5px inset`);

      await trackCards(page).nth(1).click();
      await expect(page).toHaveURL(/\/tracks#networking$/);
    });

    test('Home: the inside sheet shows OSI Model’s first three steps and opens the lesson', async ({ page }) => {
      await open(page, '/');
      const inside = page.locator('#inside');
      await expect(inside.getByRole('heading', { level: 2 })).toHaveText('See a lesson from the inside.');
      await expect(inside.locator('.sheet__label')).toHaveText('Networking Concepts · lesson 1');
      await expect(inside.getByRole('heading', { level: 3 })).toHaveText('OSI Model');
      await expect(inside.locator('.sheet__hook')).toContainText('The OSI model splits it into seven smaller jobs');
      const steps = inside.locator('.sheet__steps > li');
      await expect(steps.locator('.n')).toHaveText(['01', '02', '03']);
      await expect(steps.locator('.t')).toHaveText(['Application Layer', 'Presentation Layer', 'Session Layer']);
      await expect(steps.locator('.s')).toHaveText([
        'The message enters at the top',
        'Both ends agree how the data is written',
        'Opens the conversation and keeps it in order',
      ]);
      // The lesson's own figure, with its words in place and the first step's block lit: layer 7 on the laptop.
      const figure = inside.locator('svg[data-figure="osi"]');
      await expect(figure).toBeVisible();
      await expect(figure).toContainText('APPLICATION');
      await expect(figure.locator('.osi-L.on')).toHaveCount(1);
      await expect(figure.locator('#osi-L-laptop-7')).toHaveClass(/\bon\b/);

      const whole = inside.getByRole('link', { name: 'Open the whole lesson →' });
      await expect(whole).toHaveAttribute('href', OSI_PATH);
      await whole.click();
      await expect(page).toHaveURL(new RegExp(`${OSI_PATH}$`));
      await expect(kicker(page)).toHaveText('Overview');
    });

    test('Home: Watch, Learn and Practice buttons open OSI Model at step 1, Learn and Practice', async ({ page }) => {
      await open(page, '/');
      const how = page.locator('#how');
      await expect(how.getByRole('heading', { level: 2 })).toHaveText('Watch, learn, then practice.');
      await expect(how.getByRole('heading', { level: 3 })).toHaveText(['Watch it happen', 'Learn what happened', 'Practice what stuck']);
      await expect(how.getByRole('link', { name: 'See a Watch part →' })).toHaveAttribute('href', `${OSI_PATH}?step=1`);
      const parts = [
        ['See a Watch part →', /^Watch · Step 1 of \d+$/],
        ['See a Learn part →', /^Learn$/],
        ['See a Practice part →', /^Practice$/],
      ] as const;
      for (const [name, place] of parts) {
        await open(page, '/');
        const button = page.locator('#how').getByRole('link', { name });
        await expect(button, name).toHaveAttribute('href', new RegExp(`^${OSI_PATH}\\?step=\\d+$`));
        await button.click();
        await expect(kicker(page), name).toHaveText(place);
      }
    });

    test('Home: no Continue or resume link', async ({ page }) => {
      const resume = /continue|resume|pick up|watch again|where you left/i;
      await open(page, '/');
      await expect(page.getByRole('link', { name: resume })).toHaveCount(0);
      await expect(page.getByRole('button', { name: resume })).toHaveCount(0);
      // A returning visitor gets the same Home: one step into DHCP, then back.
      const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp')!;
      await open(page, dhcp.path);
      await moveBy(page, () => nextButton(page).click());
      await open(page, '/');
      await expect(page.getByRole('link', { name: resume })).toHaveCount(0);
      await expect(page.getByRole('button', { name: resume })).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(/You’re on|lessons done|in progress/i);
      await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    });

    test('Home: the questions, the first one open, and Practice is not scored', async ({ page }) => {
      await open(page, '/');
      const faq = page.locator('#faq');
      await expect(faq.getByRole('heading', { level: 2 })).toHaveText('Questions');
      await expect(faq.locator('details > summary')).toHaveText(['Where do I start?', 'Do I need an account?', 'Where do the facts come from?', 'Is Practice scored?']);
      await expect(faq.locator('details[open]')).toHaveCount(1);
      await expect(faq.locator('details').first()).toHaveAttribute('open', '');
      await expect(faq.locator('details').last()).toContainText('No. Practice is just for you. Nothing is scored or saved.');
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

  test('Start learning opens /tracks on Home, About and 404, and is absent on Tracks and the track pages; the footer lists How the Internet Works above Networking', async ({ page }) => {
    const hasNoStart = ['/tracks', '/networking', INTERNET_TRACK];
    for (const { path } of SITE_PAGES) {
      await open(page, path);
      if (hasNoStart.includes(path)) {
        await expect(page.locator('.site-head a.btn--primary'), path).toHaveCount(0);
      } else {
        await expect(page.locator('.site-head .head-end a.btn--primary'), path).toHaveText('Start learning');
        await expect(page.locator('.site-head .head-end a.btn--primary'), path).toHaveAttribute('href', '/tracks');
        await expect(page.locator('#menu-panel a.btn--primary'), path).toHaveAttribute('href', '/tracks');
      }
      const footer = page.getByRole('contentinfo');
      await expect(footer.getByRole('link', { name: 'How the Internet Works', exact: true }), path).toHaveAttribute('href', INTERNET_TRACK);
      const order = await footer.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href')));
      expect(order.indexOf(INTERNET_TRACK), path).toBeLessThan(order.indexOf('/networking'));
    }
  });

  test('the header links are Tracks, How it works, Questions and About', async ({ page }) => {
    for (const { path } of SITE_PAGES) {
      await open(page, path);
      const nav = page.getByRole('navigation', { name: 'Site', exact: true });
      await expect(nav.getByRole('link'), path).toHaveText(['Tracks', 'How it works', 'Questions', 'About']);
      expect(await nav.getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href'))), path).toEqual(['/tracks', '/#how', '/#faq', '/about']);
      await expect(nav.getByRole('link', { name: 'Practice' }), path).toHaveCount(0);
    }
  });

  test.describe('Tracks page', () => {
    test('How the Internet Works comes first, flagged Start here; Networking has "19 lessons · 4 ready"; A+ is no link and says "Being written"', async ({ page }) => {
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
      await expect(networking.locator('.count')).toHaveText('19 lessons · 4 ready');
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
    test('Networking is Track 2 and has 19 lessons, 15 of them Coming soon, with OSI Model the first ready', async ({ page }) => {
      await open(page, '/networking');
      await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(trackEyebrow(page)).toHaveText('Track 2 · Beginner');
      await expect(page.locator('.cover .c-fig')).toHaveText('Track 2');
      await expect(page.locator('[data-router-cover]')).toHaveCount(1);
      await expect(page.locator('.stats')).toContainText(/lessons planned\s*19/);
      await expect(page.locator('.stats')).toContainText(/ready now\s*4/);
      await expect(page.locator('.stats')).not.toContainText(/minutes in all/);
      // Part 1 lost How the Internet Works: OSI Model is ready, the other lesson is still to come.
      await expect(page.locator('main section.part').first().locator('.part-c')).toHaveText('1 of 2 ready');

      await expect(trackItems(page)).toHaveCount(19);
      await expect(page.locator('main li.lesson')).toHaveCount(4);
      const soon = page.locator('main ol.lessons > li.soon-row, main ol.soon-list > li');
      await expect(soon).toHaveCount(15);
      await expect(soon.locator('a')).toHaveCount(0);
      for (const row of await page.locator('main li.soon-row').all()) await expect(row.locator('.badge')).toHaveText('Coming soon');
      for (const list of await page.locator('main ol.soon-list').all()) {
        await expect(list.locator('xpath=ancestor::section[1]').locator('.part-c')).toContainText('coming soon');
      }

      const first = page.locator('main li.lesson').first();
      await expect(first.locator('.l-num')).toHaveText('Lesson 01');
      await expect(first.locator('a.l-link')).toHaveText('OSI Model');
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

  test('finishing DHCP shows Finished on the track and on Tracks, leaves Home as it was, and Clear my progress clears them', async ({ page }) => {
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp');
    expect(dhcp, 'DHCP is a ready lesson').toBeDefined();
    await finishLesson(page, dhcp!.path);

    await open(page, '/networking');
    const card = lessonCard(page, 'dhcp');
    await expect(card.locator('.badge')).toHaveText('Finished');
    await expect(page.locator('.toc .pg-title')).toHaveText('1 of 19 complete');

    await open(page, '/');
    // Home shows no progress: a returning visitor sees the same hero and the same track cards as a first visit.
    await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(heroStart(page)).toHaveText(HERO_START);
    await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    await expect(trackCards(page).locator('.home-track__count')).toHaveText(['14 lessons', '4 of 19 lessons ready', 'Lessons on the way']);
    await expect(trackCards(page).nth(1).locator('.home-track__go')).toHaveText('See the lessons →');

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
    await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(trackCards(page).nth(1).locator('.home-track__count')).toHaveText('4 of 19 lessons ready');
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

    // Home says nothing of where they are: its first track card reads as on a first visit.
    await open(page, '/');
    await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(trackCards(page).nth(0).locator('.home-track__count')).toHaveText('14 lessons');
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
    await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
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
