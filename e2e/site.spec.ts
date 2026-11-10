import { expect, test, type Locator, type Page } from '@playwright/test';
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
/** The Tracks page's panels, one per track, in Home's order. */
const trackPanels = (page: Page) => page.locator('main article.panel');
const panelOf = (page: Page, id: string) => page.locator(`main article.panel#${id}`);
const headerTracksLink = (page: Page) => page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Tracks', exact: true });
/** The track page's route: every lesson the track lists, ready or not, as a stop in its part, in order. */
const routeStops = (page: Page) => page.locator('main .route .route-stage li.stop');
const readyStops = (page: Page) => page.locator('main .route li.stop:not(.stop--soon)');
const soonStops = (page: Page) => page.locator('main .route li.stop--soon');
const stageTitles = (page: Page) => page.locator('main .route .route-stage h2');
/** The track page's scroll pane, which holds the route, the closing line and the footer. */
const routeBox = (page: Page) => page.locator('main .routebox');
/** The track page's side card: the strip's words and the up-next card's button. */
const stripWords = (page: Page) => page.locator('main .side .strip__w');
const sideButton = (page: Page) => page.locator('main .side .side-now__btn');
/** A stop's status words: Not started, In progress, ✓ Done or Not ready yet. */
const stateOf = (stop: Locator) => stop.locator('.stop__k');

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
    test("Tracks: How the Internet Works then Networking then A+, each panel id'd for Home's links", async ({ page }) => {
      await open(page, '/tracks');
      await expect(page).toHaveTitle('Tracks · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pick a track');
      await expect(page.locator('main')).toContainText('Each track is a set of short visual lessons, taken in order.');
      expect(await trackPanels(page).evaluateAll((panels) => panels.map((p) => p.id))).toEqual(['how-the-internet-works', 'networking', 'comptia-a-plus']);
      await expect(trackPanels(page).getByRole('heading', { level: 2 })).toHaveText(['How the Internet Works', 'Networking Concepts', 'CompTIA A+']);
      // A track's name links to its page; A+ has no page yet.
      await expect(panelOf(page, 'how-the-internet-works').getByRole('heading', { level: 2 }).getByRole('link')).toHaveAttribute('href', INTERNET_TRACK);
      await expect(panelOf(page, 'networking').getByRole('heading', { level: 2 }).getByRole('link')).toHaveAttribute('href', '/networking');
      await expect(panelOf(page, 'comptia-a-plus').getByRole('heading', { level: 2 }).getByRole('link')).toHaveCount(0);
      for (const id of ['how-the-internet-works', 'networking']) {
        await expect(panelOf(page, id).getByRole('link', { name: 'See the whole track', exact: true }), id).toHaveAttribute('href', `/${id}`);
      }

      // The closing line points a newcomer at the first two panels.
      const outro = page.locator('main .outro');
      await expect(outro).toHaveText(
        'New to IT? Start with How the Internet Works, then go deeper with Networking Concepts. Every lesson is Watch, Learn, then Practice.',
      );
      await expect(outro.getByRole('link', { name: 'How the Internet Works', exact: true })).toHaveAttribute('href', '#how-the-internet-works');
      await expect(outro.getByRole('link', { name: 'Networking Concepts', exact: true })).toHaveAttribute('href', '#networking');

      // Home's links land each panel clear of the sticky header, once any smooth scroll has settled.
      await open(page, '/tracks#networking');
      const measure = () =>
        page.evaluate(() => {
          const panel = document.querySelector('#networking')!.getBoundingClientRect();
          const head = document.querySelector('.site-head')!.getBoundingClientRect();
          return { y: window.scrollY, panelTop: panel.top, headBottom: head.bottom };
        });
      await expect
        .poll(async () => {
          const a = await measure();
          await page.waitForTimeout(120);
          const b = await measure();
          return a.y === b.y && b.y > 0;
        }, { message: '#networking settles' })
        .toBe(true);
      const at = await measure();
      expect(at.panelTop, "the Networking panel's top is below the header").toBeGreaterThanOrEqual(at.headBottom);

      await panelOf(page, 'networking').getByRole('heading', { level: 2 }).getByRole('link').click();
      await expect(page).toHaveURL(/\/networking$/);
    });

    test('Tracks: first visit says Start and Start here, the strip reads "0 of 19 lessons done · 4 ready"', async ({ page }) => {
      await open(page, '/tracks');
      const internet = panelOf(page, 'how-the-internet-works');
      const networking = panelOf(page, 'networking');
      await expect(internet.locator('.strip__w')).toHaveText('0 of 14 lessons done');
      await expect(networking.locator('.strip__w')).toHaveText('0 of 19 lessons done · 4 ready');
      await expect(internet.locator('.strip__sq i')).toHaveCount(14);
      await expect(networking.locator('.strip__sq i')).toHaveCount(19);
      // A first visit has no square marked current.
      await expect(page.locator('main .strip__sq i[data-state="current"]')).toHaveCount(0);

      const firstNetworking = NETWORKING_LESSONS[0]!.path;
      for (const [panel, first] of [
        [internet, START_PATH],
        [networking, firstNetworking],
      ] as const) {
        await expect(panel.locator('.panel__cta .btn')).toHaveText('Start');
        await expect(panel.locator('.panel__cta .btn')).toHaveAttribute('href', first);
        const card = panel.locator('a.next');
        await expect(card.locator('.next__k')).toHaveText('Start here');
        await expect(card).toHaveAttribute('href', first);
        await expect(card.locator('.next__art svg')).toHaveCount(1);
      }
      await expect(internet.locator('a.next .next__t')).toHaveText('HTTP');
      await expect(internet.locator('a.next .next__s')).toHaveText(/^Lesson 01 · /);
      // Nothing on the page offers to go on from somewhere.
      await expect(page.getByRole('link', { name: /continue|resume/i })).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(/Last opened|Up next|%/);

      await networking.locator('a.next').click();
      await expect(page).toHaveURL(new RegExp(`${firstNetworking}$`));
      await expect(kicker(page)).toHaveText('Overview');
    });

    test('Tracks: A+ is Not ready yet with no lesson link', async ({ page }) => {
      await open(page, '/tracks');
      const aplus = panelOf(page, 'comptia-a-plus');
      await expect(aplus.getByRole('heading', { level: 2 })).toHaveText('CompTIA A+');
      await expect(aplus).toContainText('Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.');
      await expect(aplus.locator('.h-chip')).toHaveText('Not ready yet');
      const soon = aplus.getByText('Lessons on the way', { exact: true });
      // A plain span, not a control: nothing to press and nothing to focus.
      expect(await soon.evaluate((el) => el.tagName)).toBe('SPAN');
      await expect(soon).not.toHaveAttribute('role');
      await expect(soon).not.toHaveAttribute('tabindex');
      const card = aplus.locator('.next');
      await expect(card.locator('.next__k')).toHaveText('Coming soon');
      await expect(card.locator('.next__t')).toHaveText('Lesson 1 is being written');
      await expect(card.locator('.next__s')).toHaveText('Each lesson will follow the A+ exam objectives.');
      await expect(card.locator('.next__art svg')).toHaveCount(1);
      await expect(card).not.toHaveClass(/\blift\b/);
      // No link and no control anywhere in the panel, and no strip: A+ has no lessons yet.
      await expect(aplus.locator('a, button, [tabindex]')).toHaveCount(0);
      await expect(aplus.locator('.strip')).toHaveCount(0);
    });
  });

  test.describe('Track page', () => {
    test('Track page: Networking lists 19 stops in its parts, 15 Not ready yet, OSI Model first ready with Start', async ({ page }) => {
      await open(page, '/networking');
      await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Networking Concepts');
      // The last word of the title is in the accent.
      await expect(page.locator('h1 em')).toHaveText('Concepts');

      // Every lesson is a stop inside its part, and each part counts its own stops.
      await expect(routeStops(page)).toHaveCount(19);
      for (const stage of await page.locator('main .route .route-stage').all()) {
        const n = await stage.locator('li.stop').count();
        await expect(stage.locator('.route-stage__head p')).toHaveText(`${n} ${n === 1 ? 'lesson' : 'lessons'}`);
      }
      await expect(readyStops(page)).toHaveCount(4);
      await expect(soonStops(page)).toHaveCount(15);
      await expect(soonStops(page).locator('a')).toHaveCount(0);
      for (const stop of await soonStops(page).all()) await expect(stateOf(stop)).toHaveText('Not ready yet');

      // A first visit: OSI Model is the first ready stop, Not started, and its Start is the route's one primary button.
      const first = readyStops(page).first();
      await expect(first.locator('h3')).toHaveText('OSI Model');
      await expect(stateOf(first)).toHaveText('Not started');
      await expect(first.locator('.stop__acts .btn')).toHaveText('Start');
      await expect(first.locator('.stop__acts .btn')).toHaveAttribute('href', OSI_PATH);
      await expect(first.locator('.stop__acts .btn')).toHaveClass(/\bbtn--primary\b/);
      await expect(page.locator('main .route .btn--primary')).toHaveCount(1);
      await expect(page.locator('main .side .side-now__k')).toHaveText('Start here');
      await expect(sideButton(page)).toHaveText('Start');
      await expect(sideButton(page)).toHaveAttribute('href', OSI_PATH);
      await expect(stripWords(page)).toHaveText('0 of 19 lessons done · 4 ready');

      // Gone: the cover, the counts, the exam chips and Clear my progress. Nothing on the page is a button.
      await expect(page.locator('main .cover, main .stats, main .toolbar')).toHaveCount(0);
      await expect(page.locator('main button')).toHaveCount(0);

      // After the last stop, the line about the lessons still to come, then the way to the gentler track.
      await expect(page.locator('main .route__end')).toHaveText(
        'Lessons not ready yet stay on the route, so you can see what is coming. New to IT? How the Internet Works is the gentler start.',
      );
      await expect(page.locator('main .route__end a')).toHaveAttribute('href', INTERNET_TRACK);
    });

    test('Track page: How the Internet Works has six parts and a name tile on each of 14 stops', async ({ page }) => {
      await open(page, INTERNET_TRACK);
      await expect(page).toHaveTitle('How the Internet Works · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the Internet Works');
      await expect(page.locator('h1 em')).toHaveText('Works');
      await expect(stageTitles(page)).toHaveText(INTERNET_PARTS);

      await expect(routeStops(page)).toHaveCount(14);
      await expect(soonStops(page)).toHaveCount(0);
      for (const stop of await readyStops(page).all()) await expect(stop.locator('.stop__art svg.name-tile')).toHaveCount(1);
      await expect(lessonCard(page, 'what-is-tls').locator('.name-tile')).toHaveAttribute('aria-label', 'Transport Layer Security (SSL is its old name)');
      await expect(lessonCard(page, 'what-is-tls').locator('.nt-full')).toHaveCount(2);
      // The side card starts with HTTP.
      await expect(sideButton(page)).toHaveText('Start');
      await expect(sideButton(page)).toHaveAttribute('href', START_PATH);
      await expect(stripWords(page)).toHaveText('0 of 14 lessons done');

      // Every lesson is ready, so the closing line only points on to Networking.
      await expect(page.locator('main .route__end')).toHaveText('Ready for more? Networking Concepts goes deeper.');
      await expect(page.locator('main .route__end a')).toHaveAttribute('href', '/networking');
    });

    test("Track page: at 1440×900 the window does not scroll; the route scrolls to its last stop and the side card's button does not move", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, '/networking');
      const before = await sideButton(page).boundingBox();
      expect(before, 'the side card has a button').not.toBeNull();
      expect((await pageOverflow(page)).down, 'the page fits the window').toBe(0);
      // The route is longer than its pane, so it has somewhere to scroll.
      const pane = await routeBox(page).evaluate((el) => ({ scroll: el.scrollHeight, client: el.clientHeight }));
      expect(pane.scroll).toBeGreaterThan(pane.client);

      // Wheel over the route until it reaches its end.
      const box = (await routeBox(page).boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await expect
        .poll(async () => {
          await page.mouse.wheel(0, 1200);
          return routeBox(page).evaluate((el) => Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1);
        })
        .toBe(true);
      await settledFrame(page);
      await expect(routeStops(page).last()).toBeInViewport();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(await sideButton(page).boundingBox()).toEqual(before);
      await expect(page.locator('header.site-head')).toBeInViewport();
    });

    test("Track page: at 1280×720 the side card's button is in view", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      for (const path of ['/networking', INTERNET_TRACK]) {
        await open(page, path);
        // On a short screen the card drops its figure, so its button fits.
        await expect(page.locator('main .side .side-now__art'), path).toBeHidden();
        await expect(sideButton(page), path).toBeInViewport({ ratio: 1 });
        expect(await page.evaluate(() => window.scrollY), path).toBe(0);
      }
    });

    test('Track page: ?for=network-plus lists every lesson, no error', async ({ page }) => {
      const errors = collectErrors(page);
      await open(page, '/networking?for=network-plus');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Networking Concepts');
      await expect(routeStops(page)).toHaveCount(19);
      await expect(readyStops(page)).toHaveCount(NETWORKING_LESSONS.length);
      await expect(page.locator('main button')).toHaveCount(0);
      expect(errors).toEqual([]);
    });

    test('Track page: breadcrumb Tracks goes to /tracks', async ({ page }) => {
      await open(page, '/networking');
      const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
      await expect(crumbs).toHaveText(/^Tracks\s*\/\s*Networking Concepts$/);
      expect(((await crumbs.textContent()) ?? '').split('/')).toHaveLength(2);
      await expect(crumbs.locator('[aria-current="page"]')).toHaveText('Networking Concepts');
      await crumbs.getByRole('link', { name: 'Tracks', exact: true }).click();
      await expect(page).toHaveURL(/\/tracks$/);
    });

    test('the old lesson address forwards to the track', async ({ page }) => {
      for (const path of ['/networking/how-the-internet-works', '/networking/how-the-internet-works?step=7', '/networking/how-the-internet-works/']) {
        await page.goto(path);
        await expect(page, path).toHaveURL(/\/how-the-internet-works$/);
        await expect(page.getByRole('heading', { level: 1 }), path).toHaveText('How the Internet Works');
      }
    });
  });

  test('finishing DHCP shows ✓ Done on the track and 1 of 19 done on Tracks, leaves Home as it was, and Reset progress on About clears them', async ({ page }) => {
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp');
    expect(dhcp, 'DHCP is a ready lesson').toBeDefined();
    await finishLesson(page, dhcp!.path);

    await open(page, '/networking');
    const card = lessonCard(page, 'dhcp');
    await expect(stateOf(card)).toHaveText('✓ Done');
    await expect(card.locator('.stop__acts .btn')).toHaveText('Watch again');
    await expect(stripWords(page)).toHaveText('1 of 19 lessons done · 4 ready');

    await open(page, '/');
    // Home shows no progress: a returning visitor sees the same hero and the same track cards as a first visit.
    await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(heroStart(page)).toHaveText(HERO_START);
    await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    await expect(trackCards(page).locator('.home-track__count')).toHaveText(['14 lessons', '4 of 19 lessons ready', 'Lessons on the way']);
    await expect(trackCards(page).nth(1).locator('.home-track__go')).toHaveText('See the lessons →');

    // On Tracks, Networking's strip counts DHCP done, and its panel moves on to the next lesson not done; How the
    // Internet Works still reads as a first visit.
    await open(page, '/tracks');
    const networking = panelOf(page, 'networking');
    await expect(networking.locator('.strip__w')).toHaveText('1 of 19 lessons done · 4 ready');
    await expect(networking.locator('.strip__sq i[data-state="done"]')).toHaveCount(1);
    await expect(networking.locator('a.next .next__k')).toHaveText('Up next');
    // The next lesson is the first ready one in the track's order that is not done: here, the first that is not DHCP.
    const nextUp = NETWORKING_LESSONS.find((lesson) => lesson.slug !== 'dhcp')!;
    await expect(networking.locator('a.next .next__t')).toHaveText(nextUp.title);
    await expect(networking.locator('a.next')).toHaveAttribute('href', nextUp.path);
    await expect(networking.locator('.panel__cta .btn')).toHaveText('Start');
    await expect(networking.locator('.panel__cta .btn')).toHaveAttribute('href', nextUp.path);
    await expect(panelOf(page, 'how-the-internet-works').locator('.strip__w')).toHaveText('0 of 14 lessons done');
    await expect(panelOf(page, 'how-the-internet-works').locator('a.next .next__k')).toHaveText('Start here');

    // Clearing progress lives on About now; the track page reads as a first visit after it.
    await open(page, '/about');
    await page.getByRole('button', { name: 'Reset progress' }).click();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.locator('.a-reset [role="status"]')).toHaveText('Progress cleared');
    await open(page, '/networking');
    await expect(stateOf(card)).toHaveText('Not started');
    await expect(stripWords(page)).toHaveText('0 of 19 lessons done · 4 ready');

    await open(page, '/');
    await expect(heroChip(page)).toHaveText('Free visual lessons, no sign-up');
    await expect(trackCards(page).nth(1).locator('.home-track__count')).toHaveText('4 of 19 lessons ready');
    await open(page, '/tracks');
    await expect(panelOf(page, 'networking').locator('.strip__w')).toHaveText('0 of 19 lessons done · 4 ready');
    await expect(panelOf(page, 'networking').locator('a.next .next__k')).toHaveText('Start here');
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
    await expect(stateOf(lessonCard(page, 'dhcp'))).toHaveText('✓ Done');

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
    for (const slug of ['what-is-http', 'what-is-https', 'what-is-tcp']) await expect(stateOf(lessonCard(page, slug)), slug).toHaveText('✓ Done');
    await expect(stateOf(lessonCard(page, 'what-is-udp'))).toHaveText('In progress');
    await expect(stateOf(lessonCard(page, 'what-is-ip'))).toHaveText('Not started');
    await expect(stripWords(page)).toHaveText('3 of 14 lessons done');
    // The side card goes on where they were, and the route rings UDP's stop.
    await expect(page.locator('main .side .side-now__t')).toHaveText('UDP');
    await expect(sideButton(page)).toHaveText('Continue');
    await expect(sideButton(page)).toHaveAttribute('href', '/how-the-internet-works/what-is-udp?step=4');
    await expect(lessonCard(page, 'what-is-udp')).toHaveClass(/\bstop--now\b/);

    // Tracks goes on where they were too: How the Internet Works' panel continues UDP; Networking reads as a first visit.
    await open(page, '/tracks');
    const internet = panelOf(page, 'how-the-internet-works');
    await expect(internet.locator('.strip__w')).toHaveText('3 of 14 lessons done');
    await expect(internet.locator('.panel__cta .btn')).toHaveText('Continue');
    await expect(internet.locator('.panel__cta .btn')).toHaveAttribute('href', '/how-the-internet-works/what-is-udp?step=4');
    await expect(internet.locator('a.next .next__k')).toHaveText('Up next');
    await expect(internet.locator('a.next .next__t')).toHaveText('UDP');
    // The card's figure follows: UDP's name tile, not the first visit's HTTP.
    await expect(internet.locator('a.next .next__art svg.name-tile')).toHaveAttribute('aria-label', 'User Datagram Protocol');
    await expect(internet.locator('.strip__sq i[data-state="current"]')).toHaveCount(1);
    await expect(panelOf(page, 'networking').locator('.strip__w')).toHaveText('0 of 19 lessons done · 4 ready');
    await expect(panelOf(page, 'networking').locator('.panel__cta .btn')).toHaveText('Start');

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

  test('every lesson is listed and the first ready one says Start', async ({ page }) => {
    await page.goto('/networking');
    // Each part, each stop and each ready lesson's link shows, with nothing left to filter or clear.
    expect(NETWORKING_LESSONS.length).toBeGreaterThan(0);
    await expect(routeStops(page)).toHaveCount(19);
    for (const stop of await routeStops(page).all()) await expect(stop).toBeVisible();
    for (const stage of await page.locator('main .route-stage').all()) await expect(stage).toBeVisible();
    for (const lesson of NETWORKING_LESSONS) {
      await expect(lessonCard(page, lesson.slug), lesson.title).toBeVisible();
      await expect(lessonCard(page, lesson.slug).locator('h3 a'), lesson.title).toHaveAttribute('href', lesson.path);
    }
    // The server render is a first visit: the first ready stop and the side card both say Start.
    const first = readyStops(page).first();
    await expect(first.locator('.stop__acts .btn')).toHaveText('Start');
    await expect(first.locator('.stop__acts .btn')).toHaveAttribute('href', NETWORKING_LESSONS[0]!.path);
    await expect(sideButton(page)).toHaveText('Start');
    await expect(sideButton(page)).toHaveAttribute('href', NETWORKING_LESSONS[0]!.path);
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
