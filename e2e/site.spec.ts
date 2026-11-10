import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  SITE_PAGES,
  collectErrors,
  hydrated,
  kicker,
  lessonCard,
  logRows,
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

const heroStart = (page: Page) => page.locator('main .open .open__acts .btn--primary');
/** The three plain facts under Home's buttons: the page a returning visitor sees is the same one. */
const homeFacts = (page: Page) => page.locator('main .open .open__facts');
const HOME_FACTS = 'Free. No account. Your progress stays in this browser.';
/** The hero's first button, for every visitor: it always opens How the Internet Works' first lesson. */
const HERO_START = 'Start with lesson 1: HTTP';
/** Where every Start button leads: the first lesson of the first track. */
const START_PATH = '/how-the-internet-works/what-is-http';
const INTERNET_TRACK = '/how-the-internet-works';
const INTERNET_PARTS = ['Loading a web page', 'Getting the data there', 'Behind the scenes', 'Email', 'Files and remote control', 'The seal'];
/** Home's track cards: one link each, to the track's panel on Tracks. */
/** Home's tracks to begin with, in order along the cable. */
const trackCards = (page: Page) => page.locator('main .cable > li.leg');
/** Home's small lesson: lesson 1, HTTP, and the words it is showing. */
const demo = (page: Page) => page.locator('main .demo');

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
    test('Home: one heading, the start button opens the first lesson, and See the tracks opens /tracks', async ({ page }) => {
      await open(page, '/');
      await expect(page).toHaveTitle('TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('See how technology really works.');
      await expect(homeFacts(page)).toHaveText(HOME_FACTS);
      await expect(heroStart(page)).toHaveText(HERO_START);
      await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
      await expect(page.locator('main .open').getByRole('link', { name: 'See the tracks', exact: true })).toHaveAttribute('href', '/tracks');
      // The page's sections, in order.
      await expect(page.locator('main').getByRole('heading', { level: 2 })).toHaveText([
        'Try one, right here',
        'Get started with the basics',
        'Where the facts come from',
        'Lift the lid',
      ]);

      await heroStart(page).click();
      await expect(page).toHaveURL(new RegExp(`${START_PATH}$`));
      await expect(kicker(page)).toHaveText('Overview');
    });

    test('Home: How a lesson works and Sources each land their section clear of the sticky header', async ({ page }) => {
      const nav = page.getByRole('navigation', { name: 'Site', exact: true });
      const links = [
        { id: 'try', link: nav.getByRole('link', { name: 'How a lesson works', exact: true }) },
        { id: 'sources', link: nav.getByRole('link', { name: 'Sources', exact: true }) },
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

    test('Home: the demo steps through how a web page arrives over HTTP, lighting the way each message takes', async ({ page }) => {
      await open(page, '/');
      const d = demo(page);
      const scene = d.locator('svg[data-figure="net-map"]');
      await expect(scene).toBeVisible();
      const opacity = (selector: string) => scene.locator(selector).first().evaluate((el) => getComputedStyle(el).opacity);
      await expect(d.locator('.demo__row b')).toHaveText(['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render Page']);
      // The map shows this lesson's server and the address the visitor types, with no driver to put them there.
      await expect(scene).toContainText('Web server');
      await expect(scene.locator('#nm-url')).toHaveText('example.net');

      // Step 1: typing the address sends nothing, so no way is lit and no message is listed.
      await expect(d.locator('.demo__say:visible')).toHaveCount(1);
      await expect(d.locator('.demo__say:visible')).toContainText('You type example.net and press Enter');
      await expect(d.locator('.demo__msgs:visible')).toHaveCount(0);
      for (const step of [2, 3, 4, 5]) expect(await opacity(`.home-trail[data-step="${step}"]`)).toBe('0');
      expect(await opacity('#nm-page [data-part="text"]')).toBe('0');

      // Step 2: the laptop asks the resolver, and the way between them lights up.
      await d.locator('.demo__next:visible').click();
      await expect(page.locator('#demo-s2')).toBeChecked();
      await expect(d.locator('.demo__msgs:visible li')).toHaveText([/Laptop to DNS resolver\s*LOOKUP/, /DNS resolver to Laptop\s*ANSWER/]);
      await expect.poll(() => opacity('.home-trail[data-step="2"]')).not.toBe('0');
      await expect.poll(() => opacity('#nm-busy-resolver')).toBe('1');

      // Step 3: the connection to the web server. Only one way is lit at a time.
      await d.locator('.demo__next:visible').click();
      await expect.poll(() => opacity('.home-trail[data-step="3"]')).not.toBe('0');
      await expect.poll(() => opacity('.home-trail[data-step="2"]')).toBe('0');
      await expect.poll(() => opacity('#nm-http-busy-web')).toBe('1');

      // Step 4: the request and its answer; the page's words reach the laptop.
      await d.locator('.demo__next:visible').click();
      await expect(d.locator('.demo__msgs:visible b')).toHaveText(['GET /', '200 OK']);
      await expect.poll(() => opacity('#nm-page [data-part="text"]')).toBe('1');
      expect(await opacity('#nm-page [data-part="pic"]')).toBe('0');

      // Step 5: the browser fetches the rest, and the page is whole.
      await d.locator('.demo__next:visible').click();
      await expect(page.locator('#demo-s5')).toBeChecked();
      await expect.poll(() => opacity('#nm-page [data-part="pic"]')).toBe('1');
      await expect(d.locator('.demo__say:visible')).toHaveCount(1);
      await expect(d.locator('.demo__next:visible')).toHaveText('Go to Learn');
    });

    test('Home: the demo’s Learn part names the ideas, points on to HTTPS and links its sources; Practice explains each answer', async ({ page }) => {
      await open(page, '/');
      const d = demo(page);
      await d.locator('.demo__parts label', { hasText: 'Learn' }).click();
      await expect(page.locator('#demo-learn')).toBeChecked();
      await expect(d.locator('.demo__pane--watch')).toBeHidden();
      await expect(d.locator('.demo__pane--learn .demo__lead')).toContainText('A web page is a conversation in plain text.');
      await expect(d.locator('.demo__terms dd')).toContainText(['Client', 'URL', 'IP address']);
      // The same exchange with the line sealed is the next lesson.
      const sealed = d.locator('.demo__sealed');
      await expect(sealed).toContainText('And HTTPS?');
      await expect(sealed).toContainText('HTTPS is HTTP with one extra job before the asking: seal the line.');
      await expect(sealed.getByRole('link')).toHaveText('Lesson 2: HTTPS');
      await expect(sealed.getByRole('link')).toHaveAttribute('href', '/how-the-internet-works/what-is-https');
      const sources = d.locator('.demo__src a');
      await expect(sources).toHaveText(['RFC 9110: HTTP Semantics', 'RFC 9112: HTTP/1.1']);
      await expect(sources.first()).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc9110');

      await d.locator('.demo__pane--learn .demo__next').click();
      await expect(page.locator('#demo-practice')).toBeChecked();
      await expect(d.locator('.demo__pane--practice .demo__lead')).toContainText('The server replies 404. What does that mean?');
      // No answer is given until one is chosen, and nothing is scored.
      await expect(d.locator('.demo__why:visible')).toHaveCount(0);
      await d.locator('.demo__pick').nth(1).click();
      await expect(d.locator('.demo__why:visible')).toHaveCount(1);
      await expect(d.locator('.demo__why:visible')).toContainText('Not quite.');
      await d.locator('.demo__pick').nth(0).click();
      await expect(d.locator('.demo__why:visible')).toHaveCount(1);
      await expect(d.locator('.demo__why:visible')).toContainText('Right.');
      await expect(d.locator('.demo__after')).toContainText('Nothing is scored.');
      await expect(page.locator('main')).not.toContainText(/score:|points|streak/i);

      const whole = d.getByRole('link', { name: 'Open the whole lesson', exact: true });
      await expect(whole).toHaveAttribute('href', START_PATH);
      await whole.click();
      await expect(page).toHaveURL(new RegExp(`${START_PATH}$`));
      await expect(kicker(page)).toHaveText('Overview');
    });

    test('Home: the demo works from the keyboard, and each control has a name', async ({ page }) => {
      await open(page, '/');
      const d = demo(page);
      await expect(page.getByRole('radio', { name: 'Watch part', exact: true })).toBeChecked();
      await expect(page.getByRole('radio', { name: 'Watch, step 1 of 5: Client Request', exact: true })).toBeChecked();
      await page.locator('#demo-s1').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#demo-s2')).toBeChecked();
      await expect(d.locator('.demo__say:visible')).toContainText('example.net');
      await expect(d.locator('.demo__msgs:visible li')).toHaveCount(2);
      // The focused step shows where the keyboard is.
      expect(await d.locator('.demo__row[for="demo-s2"]').evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
      await page.locator('#demo-watch').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#demo-learn')).toBeChecked();
      await expect(d.locator('.demo__pane--learn')).toBeVisible();
      await expect(page.getByRole('radio', { name: /^Answer: / })).toHaveCount(3);
    });

    test('Home: the two tracks to begin with, in order, each linking to its Tracks panel, with no exam tags', async ({ page }) => {
      await open(page, '/');
      // Only tracks with lessons: the one still being written is on the Tracks page, not here.
      await expect(trackCards(page)).toHaveCount(2);
      await expect(trackCards(page).locator('h3')).toHaveText(['How the Internet Works', 'Networking Concepts']);
      await expect(page.locator('main .order')).not.toContainText('CompTIA');
      await expect(trackCards(page).locator('.leg__order')).toHaveText(['Start here', 'Then go deeper']);
      expect(await trackCards(page).locator('h3 a').evaluateAll((links) => links.map((a) => a.getAttribute('href')))).toEqual([
        '/tracks#how-the-internet-works',
        '/tracks#networking',
      ]);
      await expect(trackCards(page).locator('.leg__count')).toHaveText(['14 lessons', '4 of 19 lessons ready']);
      // One segment per planned lesson, the ready ones filled.
      await expect(trackCards(page).nth(0).locator('.leg__run i[data-ready]')).toHaveCount(14);
      await expect(trackCards(page).nth(1).locator('.leg__run i')).toHaveCount(19);
      await expect(trackCards(page).nth(1).locator('.leg__run i[data-ready]')).toHaveCount(4);
      // Nothing on Home shows progress or an exam to filter by.
      await expect(page.locator('main a[href*="?for="]')).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(/Network\+|Security\+|CCNA|lessons done|in progress/i);

      await trackCards(page).nth(1).locator('h3 a').click();
      await expect(page).toHaveURL(/\/tracks#networking$/);
    });

    test('Home: says how many lessons have been checked, and links to how a lesson is made', async ({ page }) => {
      await open(page, '/');
      const facts = page.locator('main #sources');
      await expect(facts.getByRole('heading', { level: 2 })).toHaveText('Where the facts come from');
      await expect(facts).toContainText(/So far \d+ of \d+ lessons ha(s|ve) also been through an independent check/);
      await expect(facts).not.toContainText(/every lesson is checked|all lessons are checked/i);
      await expect(facts.getByRole('link', { name: 'How a lesson is made and checked', exact: true })).toHaveAttribute('href', '/about#facts');
      // The figure is decoration here: the words carry the meaning.
      await expect(facts.locator('.facts__art[aria-hidden="true"] > svg')).toHaveCount(1);
    });

    test('Home: no Continue or resume link', async ({ page }) => {
      const resume = /continue|resume|pick up where|watch again|where you left/i;
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
      // The demo starts over too: it keeps nothing.
      await expect(page.locator('#demo-s1')).toBeChecked();
    });
  });

  test('on a desktop the lesson shows its three parts at once, and the phone tabs are not there', async ({ page }) => {
    await open(page, LESSONS.find((l) => l.slug === 'dhcp')!.path);
    await expect(page.locator('.console__tabs')).toBeHidden();
    await expect(page.locator('.console__outline')).toBeVisible();
    await expect(page.locator('.console__explain')).toBeVisible();
    await expect(page.locator('.console__log')).toBeVisible();
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

  test("the header's theme button switches the theme, saves it, and names the theme it switches to", async ({ page }) => {
    await open(page, '/');
    const html = page.locator('html');
    const before = (await html.getAttribute('data-theme')) === 'light' ? 'light' : 'dark';
    const after = before === 'dark' ? 'light' : 'dark';
    const button = page.locator('.site-head .theme-toggle');
    await expect(button).toHaveAccessibleName(`Switch to ${after} theme`);
    await button.click();
    await expect(html).toHaveAttribute('data-theme', after);
    await expect(button).toHaveAccessibleName(`Switch to ${before} theme`);
    expect(await page.evaluate(() => window.localStorage.getItem('techconcepts:theme'))).toBe(after);
    // The choice holds on the next page, where the button is wired afresh.
    await open(page, '/about');
    await expect(html).toHaveAttribute('data-theme', after);
    await expect(page.locator('.site-head .theme-toggle')).toHaveAccessibleName(`Switch to ${before} theme`);
  });

  test('the header links are Tracks, How a lesson works, Sources and About', async ({ page }) => {
    for (const { path } of SITE_PAGES) {
      await open(page, path);
      const nav = page.getByRole('navigation', { name: 'Site', exact: true });
      await expect(nav.getByRole('link'), path).toHaveText(['Tracks', 'How a lesson works', 'Sources', 'About']);
      expect(await nav.getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href'))), path).toEqual(['/tracks', '/#try', '/#sources', '/about']);
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
    await expect(homeFacts(page)).toHaveText(HOME_FACTS);
    await expect(heroStart(page)).toHaveText(HERO_START);
    await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    await expect(trackCards(page).locator('.leg__count')).toHaveText(['14 lessons', '4 of 19 lessons ready']);

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
    await expect(homeFacts(page)).toHaveText(HOME_FACTS);
    await expect(trackCards(page).nth(1).locator('.leg__count')).toHaveText('4 of 19 lessons ready');
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
    await expect(homeFacts(page)).toHaveText(HOME_FACTS);
    await expect(trackCards(page).nth(0).locator('.leg__count')).toHaveText('14 lessons');
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
    await expect(homeFacts(page)).toHaveText(HOME_FACTS);
  });

  test('/does-not-exist serves the 404 page, with the site header and footer', async ({ page }) => {
    const response = await page.goto('/does-not-exist');
    expect(response?.status()).toBe(404);
    await hydrated(page);
    await expect(page).toHaveTitle('Page not found · TechConcepts');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("That page isn't here");
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: 'Go to Home', exact: true })).toHaveAttribute('href', '/');
    await expect(main.getByRole('link', { name: 'See the tracks', exact: true })).toHaveAttribute('href', '/tracks');
    // The page says what the number means, and points at the lesson it comes from.
    await expect(main).toContainText('The server is working, but it has nothing at this address.');
    await expect(main.getByRole('link', { name: 'Lesson 1, HTTP', exact: true })).toHaveAttribute('href', START_PATH);
    // The figure is the page's picture of it: a panel of ports with port 404 unlinked.
    await expect(main.getByRole('img', { name: /Port 404 is empty and its light is off/ })).toBeVisible();
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

  test('Home’s demo needs no script: it steps, shows Learn and answers a question', async ({ page }) => {
    await page.goto('/');
    const d = demo(page);
    await expect(d.locator('.demo__say:visible')).toContainText('You type example.net and press Enter');
    await d.locator('.demo__next:visible').click();
    await expect(d.locator('.demo__msgs:visible li')).toHaveCount(2);
    await expect.poll(() => d.locator('.home-trail[data-step="2"]').evaluate((el) => getComputedStyle(el).opacity)).not.toBe('0');
    await d.locator('.demo__parts label', { hasText: 'Practice' }).click();
    await d.locator('.demo__pick').nth(0).click();
    await expect(d.locator('.demo__why:visible')).toContainText('Right.');
  });
});

test.describe('phone', { tag: '@phone' }, () => {
  requireLessons(LESSONS);

  for (const { name, path } of SITE_PAGES) {
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

  // ---------------------------------------------------------------- the lesson on a phone (docs/direction.md §7)

  /** Where a part of the console is on screen, or null when it is not shown. */
  const boxOf = (page: Page, selector: string) =>
    page.locator(selector).evaluate((el) => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return null;
      const b = el.getBoundingClientRect();
      return { top: Math.round(b.top), bottom: Math.round(b.bottom), height: Math.round(b.height) };
    });
  const tab = (page: Page, name: 'Explain' | 'Steps' | 'Log') => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name, exact: true });

  for (const lesson of LESSONS) {
    test(`${lesson.path} fits one phone screen: the scene on top, the controls at the bottom, and no page scroll`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(lesson.path);
      expect(response?.status()).toBe(200);
      await hydrated(page);
      await page.waitForLoadState('load');
      const screen = page.viewportSize()!;
      const overflow = await pageOverflow(page);
      expect(overflow.down, 'the page is no taller than the screen').toBeLessThanOrEqual(1);
      expect(overflow.sideways, 'the page is no wider than the screen').toBeLessThanOrEqual(1);

      // The scene is in the top half, at least a quarter of the screen tall.
      const scene = (await boxOf(page, '.console__scene'))!;
      expect(scene.top).toBeLessThan(screen.height * 0.15);
      expect(scene.bottom).toBeLessThan(screen.height * 0.5);
      expect(scene.height).toBeGreaterThan(screen.height * 0.25);
      // Back, Play and Next are at the foot of the screen, each big enough for a thumb.
      const controls = (await boxOf(page, '.console__controls'))!;
      expect(controls.bottom).toBe(screen.height);
      for (const button of await page.locator('.console__controls button').all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      // One part shows under the tabs, the words first; the other two wait.
      await expect(tab(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
      expect(await boxOf(page, '.console__explain')).not.toBeNull();
      expect(await boxOf(page, '.console__outline')).toBeNull();
      expect(await boxOf(page, '.console__log')).toBeNull();
      await expect(kicker(page)).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('a lesson on a phone: the tabs show the steps and the log, a step chosen returns to the words, and the scene never moves', async ({ page }) => {
    const dhcp = LESSONS.find((l) => l.slug === 'dhcp')!;
    await open(page, dhcp.path);
    const sceneAt = async () => (await boxOf(page, '.console__scene'))!.top;
    const top = await sceneAt();

    await tab(page, 'Steps').click();
    expect(await boxOf(page, '.console__outline')).not.toBeNull();
    expect(await boxOf(page, '.console__explain')).toBeNull();
    expect(await sceneAt()).toBe(top);
    await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^DHCP Offer/ }).click();
    // Choosing a step goes there and shows its words.
    await expect(tab(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
    await expect(kicker(page)).toHaveText('Watch · Step 2 of 5');
    await expect(page.locator('.topbar__where')).toBeVisible();
    await expect(page.locator('.topbar__where')).toHaveText('Step 2 of 5');

    // Next works from the foot of the screen whichever part is showing, and the log fills.
    await tab(page, 'Log').click();
    expect(await boxOf(page, '.console__log')).not.toBeNull();
    await moveBy(page, () => nextButton(page).click());
    await expect(page.locator('.topbar__where')).toHaveText('Step 3 of 5');
    await expect(logRows(page).first()).toBeVisible();
    // A row is a stacked entry: its cells sit inside the screen's width, each with its column's name.
    const row = logRows(page).first();
    expect((await row.boundingBox())!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(await row.locator('td[data-label]').first().evaluate((td) => getComputedStyle(td, '::before').content)).toMatch(/^"[A-Z]/);
    await expect(page.getByRole('table', { name: 'Event log' }).getByRole('row').first()).toBeAttached();
    expect(await sceneAt()).toBe(top);
    expect((await pageOverflow(page)).down).toBeLessThanOrEqual(1);
  });

  test('a lesson on a phone: in Learn the scene gives way to the words, which scroll inside themselves', async ({ page }) => {
    const dhcp = LESSONS.find((l) => l.slug === 'dhcp')!;
    await open(page, dhcp.path);
    const watching = (await boxOf(page, '.console__scene'))!.height;
    await tab(page, 'Steps').click();
    await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^What happened and why/ }).click();
    await expect(kicker(page)).toHaveText('Learn');
    await expect.poll(async () => (await boxOf(page, '.console__scene'))!.height).toBeLessThan(watching * 0.7);
    const words = page.locator('.console__explain');
    expect(await words.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    expect((await pageOverflow(page)).down).toBeLessThanOrEqual(1);
    // The controls are still at the foot.
    expect((await boxOf(page, '.console__controls'))!.bottom).toBe(page.viewportSize()!.height);
  });
});
