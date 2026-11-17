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
  playButton,
  position,
  readyLessons,
  requireLessons,
  setSpeed,
  settledFrame,
  viewSwitch,
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

/** Walks a lesson with the forward button to its last position, its last Practice ("Next lesson"), where it counts as finished. */
async function finishLesson(page: Page, path: string): Promise<void> {
  await open(page, path);
  // Stops at the last Practice: the kicker reads "Practice" and the forward button's name starts "Next lesson".
  for (let i = 0; i < 400 && !(await position(page)).atEnd; i += 1) {
    await moveBy(page, () => nextButton(page).click());
  }
  await expect(kicker(page)).toContainText('Practice');
}

// The desktop projects run this block and the phone project the next, by its @phone tag (playwright.config.ts).
test.describe('desktop', () => {
  requireLessons(LESSONS);

  test('the share image has its description: og:image:alt once, straight after og:image, on a page of every template', async ({ page }) => {
    const words = 'TechConcepts. See how technology really works. A home router with its lid lifted, one message lit on the board inside.';
    // Home, the tracks page, a track, About, a lesson, and the 404 page.
    for (const path of ['/', '/tracks', '/networking', '/about', '/networking/dhcp', '/this-page-does-not-exist']) {
      await page.goto(path);
      await hydrated(page);
      await expect(page.locator('meta[property="og:image:alt"]'), path).toHaveCount(1);
      await expect(page.locator('meta[property="og:image"] + meta[property="og:image:alt"]'), path).toHaveAttribute('content', words);
    }
  });

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
      await expect(d.locator('.demo__say:visible')).toContainText('You type http://example.net and press Enter');
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

      // Step 4: the request and its answer. The lesson draws the page's words in step 5, so the laptop's page is still empty.
      await d.locator('.demo__next:visible').click();
      await expect(d.locator('.demo__msgs:visible b')).toHaveText(['GET /', '200 OK']);

      // Step 5: the page arrives, words and pictures together (the lesson's own cues: direction 2.23).
      await d.locator('.demo__next:visible').click();
      await expect(page.locator('#demo-s5')).toBeChecked();
      await expect.poll(() => opacity('#nm-page [data-part="text"]')).toBe('1');
      await expect.poll(() => opacity('#nm-page [data-part="pic"]')).toBe('1');
      // Back to step 4, the figure's parts fade out over 200ms: both the words and the pictures go.
      await d.locator('.demo__row[for="demo-s4"]').click();
      await expect(page.locator('#demo-s4')).toBeChecked();
      await expect.poll(() => opacity('#nm-page [data-part="text"]')).toBe('0');
      await expect.poll(() => opacity('#nm-page [data-part="pic"]')).toBe('0');
      await d.locator('.demo__row[for="demo-s5"]').click();
      await expect(page.locator('#demo-s5')).toBeChecked();
      await expect(d.locator('.demo__say:visible')).toHaveCount(1);
      await expect(d.locator('.demo__next:visible')).toHaveText('Go to Learn');
    });

    test('Home: the demo’s Learn part names the ideas, points on to HTTPS and links its sources; Practice explains each answer', async ({ page }) => {
      await open(page, '/');
      const d = demo(page);
      await d.locator('.demo__parts label', { hasText: 'Learn' }).click();
      await expect(page.locator('#demo-learn')).toBeChecked();
      await expect(d.locator('.demo__pane--watch')).toBeHidden();
      await expect(d.locator('.demo__pane--learn .demo__lead')).toContainText('In HTTP/1.1, getting a web page is a conversation in plain text.');
      await expect(d.locator('.demo__terms dd')).toContainText(['Client', 'URL', 'IP address']);
      // The same exchange with the line sealed is the next lesson.
      const sealed = d.locator('.demo__sealed');
      await expect(sealed).toContainText('And HTTPS?');
      await expect(sealed).toContainText('HTTPS is HTTP with one extra job before the asking: seal the line.');
      await expect(sealed.getByRole('link')).toHaveText('Lesson 2: HTTPS');
      await expect(sealed.getByRole('link')).toHaveAttribute('href', '/how-the-internet-works/what-is-https');
      // The sources are the block D5 designed (the cases below, in "H1"); here, that the first is the lesson's first.
      await expect(d.locator('.demo__src .stamp')).toHaveText('Checked 11 Nov 2026, 20 sources');
      const sources = d.locator('.demo__src a:visible');
      await expect(sources).toHaveText(['RFC 9114', 'RFC 9110', 'RFC 3986']);
      await expect(sources.first()).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc9114.html');

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
      // A group whose part is not on show is not offered: the answers are heard in Practice only (B20, case 29).
      await expect(page.getByRole('radio', { name: /^Answer: / })).toHaveCount(0);
      await page.locator('#demo-learn').focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('#demo-practice')).toBeChecked();
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
      await expect(trackCards(page).locator('.leg__count')).toHaveText(['14 lessons', '20 lessons']);
      // One segment per planned lesson, the ready ones filled.
      await expect(trackCards(page).nth(0).locator('.leg__run i[data-ready]')).toHaveCount(14);
      await expect(trackCards(page).nth(1).locator('.leg__run i')).toHaveCount(20);
      await expect(trackCards(page).nth(1).locator('.leg__run i[data-ready]')).toHaveCount(20);
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
      // Since batch 5 every lesson is checked, and the sentence says so (src/lib/about.ts).
      await expect(facts).toContainText(/So far \d+ of \d+ lessons ha(s|ve) also been through an independent check|Every lesson has also been through an independent check/);
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
    await expect(page.locator('.console__track')).toBeVisible();
    await expect(page.locator('.console__explain')).toBeVisible();
    await expect(page.locator('.console__log')).toBeVisible();
  });

  test('the lesson page shows no stamp (2.97): its Learn numbers its sources, and each claim opens the place it cites', async ({ page }) => {
    const osi = LESSONS.find((l) => l.slug === 'osi-model')!;
    await open(page, osi.path);
    await expect(page.locator('.stamp')).toHaveCount(0);
    await expect(page.locator('.console__top')).not.toContainText(/Checked|Not checked yet/);

    await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: 'Learn', exact: true }).click();
    await expect(kicker(page)).toHaveText('Learn');
    const words = page.locator('.console__explain');
    // The sources are at the foot of Learn, in view without opening Go deeper, with no stamp over them.
    const foot = words.locator('.explain__foot');
    await expect(foot.locator('.stamp')).toHaveCount(0);
    const listed = foot.locator('ol.explain__sources > li');
    const count = await listed.count();
    expect(count).toBe(6);
    await expect(listed.first().getByRole('link')).toHaveAttribute('href', /^https:\/\/www\.itu\.int\//);
    // The first claim's number is 1, and it opens a page of that document, in a new tab.
    const marks = words.getByRole('link', { name: /^Source \d+: / });
    await expect(marks.first()).toHaveText('1');
    await expect(marks.first()).toHaveAttribute('href', /^https:\/\/www\.itu\.int\/.*#page=\d+$/);
    await expect(marks.first()).toHaveAttribute('target', '_blank');
    // Every number in the words is one the list has.
    const numbers = (await marks.allTextContents()).map(Number);
    expect(numbers.length).toBeGreaterThan(10);
    expect(Math.max(...numbers)).toBeLessThanOrEqual(count);
    expect(new Set(numbers).size).toBeGreaterThan(1);
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
    for (const path of ['/', '/tracks', INTERNET_TRACK, '/networking', '/about', '/glossary']) {
      await open(page, path);
      await expect(page.locator('body')).not.toContainText(/\b\d+ ?min\b|\bminutes\b|one sitting|Short guided/i);
    }
  });

  test('the header’s Tracks link and the footer’s All tracks link open /tracks on every page; Tracks is current on /tracks and the track pages', async ({ page }) => {
    // Every page has the site header; a lesson has no footer (one screen) and is inside the Tracks section, so "true".
    for (const { path } of ALL_PAGES) {
      await open(page, path);
      await expect(headerTracksLink(page), path).toHaveAttribute('href', '/tracks');
      const isLesson = LESSONS.some((l) => l.path === path);
      if (isLesson) await expect(page.getByRole('contentinfo'), path).toHaveCount(0);
      else await expect(page.getByRole('contentinfo').getByRole('link', { name: 'All tracks', exact: true }), path).toHaveAttribute('href', '/tracks');
      // "page" only where the link is this very page; on a track page, inside the Tracks section, it is "true".
      const current = path === '/tracks' ? 'page' : path === '/networking' || path === INTERNET_TRACK || isLesson ? 'true' : null;
      if (current) await expect(headerTracksLink(page), path).toHaveAttribute('aria-current', current);
      else await expect(headerTracksLink(page), path).not.toHaveAttribute('aria-current');
    }
    await open(page, '/');
    await headerTracksLink(page).click();
    await expect(page).toHaveURL(/\/tracks$/);
  });

  test('Start learning opens /tracks on Home, About and 404, and is absent on Tracks and the track pages; the footer lists How the Internet Works above Networking', async ({ page }) => {
    const hasNoStart = ['/tracks', '/networking', INTERNET_TRACK, ...LESSONS.map((l) => l.path)];
    for (const { path } of ALL_PAGES) {
      await open(page, path);
      if (hasNoStart.includes(path)) {
        await expect(page.locator('.site-head a.btn--primary, #menu-panel a.btn--primary'), path).toHaveCount(0);
      } else {
        await expect(page.locator('.site-head .head-end a.btn--primary'), path).toHaveText('Start learning');
        await expect(page.locator('.site-head .head-end a.btn--primary'), path).toHaveAttribute('href', '/tracks');
        await expect(page.locator('#menu-panel a.btn--primary'), path).toHaveAttribute('href', '/tracks');
      }
      // A lesson has no footer.
      if (LESSONS.some((l) => l.path === path)) continue;
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

  test('the header links are Tracks, Glossary, How a lesson works, Sources and About, and the menu lists the same five', async ({ page }) => {
    for (const { path } of ALL_PAGES) {
      await open(page, path);
      const nav = page.getByRole('navigation', { name: 'Site', exact: true });
      await expect(nav.getByRole('link'), path).toHaveText(['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About']);
      expect(await nav.getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href'))), path).toEqual(['/tracks', '/glossary', '/#try', '/#sources', '/about']);
      await expect(nav.getByRole('link', { name: 'Practice' }), path).toHaveCount(0);
      // The phone's menu is drawn from the same list, in the same order (its panel is hidden until opened).
      const menu = page.locator('#menu-panel');
      expect(await menu.locator('a:not(.btn)').evaluateAll((as) => as.map((a) => a.textContent)), path).toEqual(['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About']);
      expect(await menu.locator('a:not(.btn)').evaluateAll((as) => as.map((a) => a.getAttribute('href'))), path).toEqual(['/tracks', '/glossary', '/#try', '/#sources', '/about']);
    }
  });

  test('Glossary is current ("page") on /glossary and nowhere else', async ({ page }) => {
    for (const { path } of ALL_PAGES) {
      await open(page, path);
      const link = page.getByRole('navigation', { name: 'Site', exact: true }).getByRole('link', { name: 'Glossary', exact: true });
      if (path === '/glossary') await expect(link, path).toHaveAttribute('aria-current', 'page');
      else await expect(link, path).not.toHaveAttribute('aria-current');
    }
  });

  test('the footer lists Glossary after All tracks and opens /glossary on every page', async ({ page }) => {
    for (const { path } of SITE_PAGES) {
      await open(page, path);
      const footer = page.getByRole('contentinfo');
      await expect(footer.getByRole('link', { name: 'Glossary', exact: true }), path).toHaveAttribute('href', '/glossary');
      const learn = footer.locator('div:has(> h3:text-is("Learn")) > ul a');
      expect(await learn.evaluateAll((as) => as.map((a) => a.getAttribute('href'))), path).toEqual(['/how-the-internet-works', '/networking', '/tracks', '/glossary', '/#try']);
    }
    await open(page, '/');
    await page.getByRole('contentinfo').getByRole('link', { name: 'Glossary', exact: true }).click();
    await expect(page).toHaveURL(/\/glossary$/);
  });

  test('the menu button takes over at 959px and the row of five shows at 960px, on every page', async ({ page }) => {
    for (const { path } of ALL_PAGES) {
      await page.setViewportSize({ width: 959, height: 800 });
      await open(page, path);
      await expect(page.locator('.menu-btn'), path).toBeVisible();
      await expect(page.locator('.site-nav'), path).toBeHidden();
      await page.setViewportSize({ width: 960, height: 800 });
      await expect(page.locator('.menu-btn'), path).toBeHidden();
      await expect(page.locator('.site-nav'), path).toBeVisible();
      for (const box of await page.locator('.site-nav a').evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height))) expect(Math.round(box), path).toBe(32);
      const start = page.locator('.site-head .head-end a.btn--primary');
      if (['/tracks', '/networking', INTERNET_TRACK, ...LESSONS.map((l) => l.path)].includes(path)) await expect(start, path).toHaveCount(0);
      else expect((await start.boundingBox())!.width, path).toBeGreaterThanOrEqual(122);
    }
  });

  test('at 959px the opened menu lists the five, then Start learning where the page has it', async ({ page }) => {
    await page.setViewportSize({ width: 959, height: 800 });
    await open(page, '/glossary');
    await page.locator('#menu').click();
    await expect(page.locator('#menu-panel a')).toHaveText(['Tracks', 'Glossary', 'How a lesson works', 'Sources', 'About', 'Start learning']);
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

      // The order to take the tracks in is said before the cards, in the head, and points a newcomer at the first two (D18).
      const order = page.locator('main .tp-head__words p').nth(1);
      await expect(order).toHaveText(
        'New to IT? Start with How the Internet Works, then go deeper with Networking Concepts. Every lesson is Watch, Learn, then Practice.',
      );
      await expect(order.getByRole('link', { name: 'How the Internet Works', exact: true })).toHaveAttribute('href', '#how-the-internet-works');
      await expect(order.getByRole('link', { name: 'Networking Concepts', exact: true })).toHaveAttribute('href', '#networking');
      await expect(page.locator('main .outro')).toHaveCount(0);
      await expect(page.locator('main em')).toHaveCount(0);

      // Home's links land each panel clear of the sticky header, once any smooth scroll has settled.
      await open(page, '/tracks#networking');
      const measure = () =>
        page.evaluate(() => {
          const panel = document.querySelector('#networking .cs-tab')!.getBoundingClientRect();
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
      expect(at.panelTop, "the Networking card's tab is below the header").toBeGreaterThanOrEqual(at.headBottom);

      await panelOf(page, 'networking').getByRole('heading', { level: 2 }).getByRole('link').click();
      await expect(page).toHaveURL(/\/networking$/);
    });

    test('Tracks: first visit says Start and First lesson, the strip reads "0 of 20 lessons done"', async ({ page }) => {
      await open(page, '/tracks');
      const internet = panelOf(page, 'how-the-internet-works');
      const networking = panelOf(page, 'networking');
      await expect(internet.locator('.strip__w')).toHaveText('0 of 14 lessons done');
      await expect(networking.locator('.strip__w')).toHaveText('0 of 20 lessons done');
      await expect(internet.locator('.strip__sq i')).toHaveCount(14);
      await expect(networking.locator('.strip__sq i')).toHaveCount(20);
      // A first visit has no square marked current.
      await expect(page.locator('main .strip__sq i[data-state="current"]')).toHaveCount(0);

      const firstNetworking = NETWORKING_LESSONS[0]!.path;
      for (const [panel, first] of [
        [internet, START_PATH],
        [networking, firstNetworking],
      ] as const) {
        await expect(panel.locator('.upnext .btn')).toHaveText('Start');
        await expect(panel.locator('.upnext .btn')).toHaveAttribute('href', first);
        // On a first visit the box says "First lesson": "Start here" is the first track's tab, and means the track.
        await expect(panel.locator('.upnext__k')).toHaveText('First lesson');
        await expect(panel.locator('.upnext__n')).toHaveText('Lesson 01');
        await expect(panel.locator('.upnext')).not.toHaveText(/Start here/);
        await expect(panel.locator('.upnext .lm-svg')).toHaveCount(0);
      }
      await expect(page.locator('main .cs-tab').first()).toHaveText('Start here');
      await expect(internet.locator('.upnext__t')).toHaveText('HTTP');
      await expect(internet.locator('.upnext__s')).toHaveText('Asking for web pages');
      // Nothing on the page offers to go on from somewhere.
      await expect(page.getByRole('link', { name: /continue|resume/i })).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(/Last opened|Up next|%/);

      await networking.locator('.upnext .btn').click();
      await expect(page).toHaveURL(new RegExp(`${firstNetworking}$`));
      await expect(kicker(page)).toHaveText('Overview');
    });

    test('Tracks: A+ is Not ready yet with no lesson link', async ({ page }) => {
      await open(page, '/tracks');
      const aplus = panelOf(page, 'comptia-a-plus');
      await expect(aplus.getByRole('heading', { level: 2 })).toHaveText('CompTIA A+');
      await expect(aplus).toContainText('Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.');
      await expect(aplus.locator('.cs-tab')).toHaveText('Not ready yet');
      await expect(aplus.locator('.trk__soon')).toHaveText('Lesson 1 is being written. Each lesson will follow the A+ exam objectives.');
      await expect(page.locator('main')).not.toContainText('Coming soon');
      await expect(page.locator('main')).not.toContainText('Lessons on the way');
      await expect(aplus.locator('.btn, .panel__off, .next')).toHaveCount(0);
      // No link and no control anywhere in the panel, and no strip: A+ has no lessons yet.
      await expect(aplus.locator('a, button, [tabindex]')).toHaveCount(0);
      await expect(aplus.locator('.strip')).toHaveCount(0);
    });
  });

  test.describe('Track page', () => {
    test('Track page: Networking lists 20 stops in its parts, all ready, OSI Model first with Start', async ({ page }) => {
      await open(page, '/networking');
      await expect(page).toHaveTitle('Networking Concepts · TechConcepts');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Networking Concepts');
      // The last word of the title is in the accent.
      await expect(page.locator('h1 em')).toHaveText('Concepts');

      // Every lesson is a stop inside its part, and each part counts its own stops.
      await expect(routeStops(page)).toHaveCount(20);
      for (const stage of await page.locator('main .route .route-stage').all()) {
        const n = await stage.locator('li.stop').count();
        await expect(stage.locator('.route-stage__head p')).toHaveText(`${n} ${n === 1 ? 'lesson' : 'lessons'}`);
      }
      await expect(readyStops(page)).toHaveCount(20);
      await expect(readyStops(page).locator('h3')).toHaveText(['OSI Model', 'Packets', 'IP Address', 'MAC Address', 'Switch', 'ARP', 'Subnetting', 'Router', 'DHCP', 'Ports', 'TCP/UDP', 'NAT', 'DNS', 'HTTP', 'HTTPS', 'TLS/SSL', 'Firewalls', 'Proxies', 'Load Balancers', 'VPN']);
      // The four lessons Networking shares with the tour link to Networking's own pages.
      await expect(lessonCard(page, 'what-is-dns').locator('h3 a')).toHaveAttribute('href', '/networking/what-is-dns');
      await expect(soonStops(page)).toHaveCount(0);

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
      await expect(stripWords(page)).toHaveText('0 of 20 lessons done');

      // Gone: the cover, the counts, the exam chips and Clear my progress. Nothing on the page is a button.
      await expect(page.locator('main .cover, main .stats, main .toolbar')).toHaveCount(0);
      await expect(page.locator('main button')).toHaveCount(0);

      // After the last stop, the way to the gentler track; the line about lessons still to come is shown only while one is not ready.
      await expect(page.locator('main .route__end')).toHaveText('New to IT? How the Internet Works is the gentler start.');
      await expect(page.locator('main .route__end a')).toHaveAttribute('href', INTERNET_TRACK);
    });

    test('Track page: every ready stop says its lesson is checked, with the day', async ({ page }) => {
      await open(page, '/networking');
      await expect(lessonCard(page, 'osi-model').locator('.stamp')).toHaveText(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
      for (const lesson of NETWORKING_LESSONS) {
        await expect(lessonCard(page, lesson.slug).locator('.stamp'), lesson.slug).toHaveText(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
      }
      await expect(page.locator('main .route li.stop:not(.stop--soon) .stamp')).toHaveCount(NETWORKING_LESSONS.length);
      await expect(page.locator('main .route li.stop--soon .stamp')).toHaveCount(0);
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
      await expect(routeStops(page)).toHaveCount(20);
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

  test('About counts a lesson two tracks list once: 30 lessons ready', async ({ page }) => {
    await open(page, '/about');
    await expect(page.locator('.stats > div', { has: page.locator('dt', { hasText: 'lessons ready' }) }).locator('dd')).toHaveText('30');
  });

  test.describe('lessons Networking shares with the tour', () => {
    test('a shared lesson under /networking/ counts in Networking: Lesson 13 of 20, the tour copy 6 of 14', async ({ page }) => {
      await open(page, '/networking/what-is-dns');
      // At 1440 the lesson's place is the track column's head, and the track's lessons are the column (no "All 20 lessons" button).
      await expect(page.getByText('Lesson 13 of 20', { exact: true })).toBeVisible();
      await expect(page.locator('.console__track nav [aria-current="page"]')).toContainText('DNS');
      await expect(page.getByRole('link', { name: /Tracks/ }).first()).toBeVisible();
      await expect(page.locator('a[href="/networking"]').first()).toBeVisible();
      await open(page, '/how-the-internet-works/what-is-dns');
      await expect(page.getByText('Lesson 6 of 14', { exact: true })).toBeVisible();
    });

    test('Up next follows the track the lesson is read in', async ({ page }) => {
      await open(page, '/networking/subnetting?step=99');
      await expect(page.getByRole('link', { name: /Router/ }).filter({ has: page.locator('svg') }).first()).toHaveAttribute('href', '/networking/router');
      await open(page, '/networking/dhcp?step=99');
      await expect(page.getByRole('link', { name: /Ports/ }).filter({ has: page.locator('svg') }).first()).toHaveAttribute('href', '/networking/ports');
      // D12's three, and batch 3's: OSI Model → Packets → IP Address → MAC Address → Switch → ARP, and Ports → TCP/UDP → NAT.
      for (const [from, to, name] of [['osi-model', 'packets', /Packets/], ['packets', 'ip-address', /IP Address/], ['ip-address', 'mac-address', /MAC Address/], ['mac-address', 'switch', /Switch/], ['switch', 'arp', /ARP/], ['ports', 'tcp-udp', /TCP\/UDP/], ['tcp-udp', 'nat', /NAT/]] as const) {
        await open(page, `/networking/${from}?step=99`);
        await expect(page.getByRole('link', { name }).filter({ has: page.locator('svg') }).first()).toHaveAttribute('href', `/networking/${to}`);
      }
      await open(page, '/networking/what-is-tls?step=99');
      await expect(page.getByRole('link', { name: /Firewalls/ }).first()).toHaveAttribute('href', '/networking/firewalls');
      await open(page, '/how-the-internet-works/what-is-tls?step=99');
      await expect(page.getByText('the last lesson of this track')).toBeVisible();
      await expect(page.locator('a[href="/networking/firewalls"]')).toHaveCount(0);
      // The Up next chain runs firewalls → proxies → load-balancers → vpn; VPN is the track's last lesson (stop 20).
      await open(page, '/networking/firewalls?step=99');
      await expect(page.getByRole('link', { name: /Proxies/ }).first()).toHaveAttribute('href', '/networking/proxies');
      await open(page, '/networking/proxies?step=99');
      await expect(page.getByRole('link', { name: /Load Balancers/ }).first()).toHaveAttribute('href', '/networking/load-balancers');
      await open(page, '/networking/load-balancers?step=99');
      await expect(page.getByRole('link', { name: /VPN/ }).first()).toHaveAttribute('href', '/networking/vpn');
      await open(page, '/networking/vpn?step=99');
      await expect(page.getByText('the last lesson of this track')).toBeVisible();
    });

    test('the old Networking addresses for them are gone', async ({ page }) => {
      for (const slug of ['dns', 'tls', 'http-https']) {
        const response = await page.goto(`/networking/${slug}`);
        expect(response?.status(), slug).toBe(404);
      }
    });

    test('progress is by lesson: finishing DNS in the tour counts it in Networking, and opening it there makes Networking the last track', async ({ page }) => {
      await finishLesson(page, '/how-the-internet-works/what-is-dns');
      await open(page, '/networking');
      await expect(stripWords(page)).toHaveText('1 of 20 lessons done');
      await expect(stateOf(lessonCard(page, 'what-is-dns'))).toHaveText('✓ Done');
      await open(page, '/networking/what-is-dns');
      const stored = await page.evaluate(() => Object.entries(window.localStorage).map(([k, v]) => `${k}=${v}`).join('\n'));
      expect(stored).toMatch(/"lastTrack":\s*"networking"/);
    });
  });

  test('finishing DHCP shows ✓ Done on the track and 1 of 20 done on Tracks, leaves Home as it was, and Reset progress on About clears them', async ({ page }) => {
    const dhcp = LESSONS.find((lesson) => lesson.slug === 'dhcp');
    expect(dhcp, 'DHCP is a ready lesson').toBeDefined();
    await finishLesson(page, dhcp!.path);

    await open(page, '/networking');
    const card = lessonCard(page, 'dhcp');
    await expect(stateOf(card)).toHaveText('✓ Done');
    await expect(card.locator('.stop__acts .btn')).toHaveText('Watch again');
    await expect(stripWords(page)).toHaveText('1 of 20 lessons done');

    await open(page, '/');
    // Home shows no progress: a returning visitor sees the same hero and the same track cards as a first visit.
    await expect(homeFacts(page)).toHaveText(HOME_FACTS);
    await expect(heroStart(page)).toHaveText(HERO_START);
    await expect(heroStart(page)).toHaveAttribute('href', START_PATH);
    await expect(trackCards(page).locator('.leg__count')).toHaveText(['14 lessons', '20 lessons']);

    // On Tracks, Networking's strip counts DHCP done, and its panel moves on to the next lesson not done; How the
    // Internet Works still reads as a first visit.
    await open(page, '/tracks');
    const networking = panelOf(page, 'networking');
    await expect(networking.locator('.strip__w')).toHaveText('1 of 20 lessons done');
    await expect(networking.locator('.strip__sq i[data-state="done"]')).toHaveCount(1);
    await expect(networking.locator('.upnext__k')).toHaveText('Up next');
    // The next lesson is the first ready one in the track's order that is not done: here, the first that is not DHCP.
    const nextUp = NETWORKING_LESSONS.find((lesson) => lesson.slug !== 'dhcp')!;
    await expect(networking.locator('.upnext__t')).toHaveText(nextUp.title);
    await expect(networking.locator('.upnext .btn')).toHaveText('Start');
    await expect(networking.locator('.upnext .btn')).toHaveAttribute('href', nextUp.path);
    await expect(panelOf(page, 'how-the-internet-works').locator('.strip__w')).toHaveText('0 of 14 lessons done');
    await expect(panelOf(page, 'how-the-internet-works').locator('.upnext__k')).toHaveText('First lesson');

    // Clearing progress lives on About now; the track page reads as a first visit after it.
    await open(page, '/about');
    await page.getByRole('button', { name: 'Reset progress' }).click();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.locator('.a-reset [role="status"]')).toHaveText('Progress cleared');
    await open(page, '/networking');
    await expect(stateOf(card)).toHaveText('Not started');
    await expect(stripWords(page)).toHaveText('0 of 20 lessons done');

    await open(page, '/');
    await expect(homeFacts(page)).toHaveText(HOME_FACTS);
    await expect(trackCards(page).nth(1).locator('.leg__count')).toHaveText('20 lessons');
    await open(page, '/tracks');
    await expect(panelOf(page, 'networking').locator('.strip__w')).toHaveText('0 of 20 lessons done');
    await expect(panelOf(page, 'networking').locator('.upnext__k')).toHaveText('First lesson');
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
    // The side card was given only HTTP's name tile; UDP's is a copy of the one on UDP's stop.
    await expect(page.locator('main .side .side-now__art svg.name-tile')).toHaveAttribute('aria-label', 'User Datagram Protocol');
    await expect(lessonCard(page, 'what-is-udp').locator('.stop__art svg.name-tile')).toHaveAttribute('aria-label', 'User Datagram Protocol');
    await expect(sideButton(page)).toHaveText('Continue');
    await expect(sideButton(page)).toHaveAttribute('href', '/how-the-internet-works/what-is-udp?step=4');
    await expect(lessonCard(page, 'what-is-udp')).toHaveClass(/\bstop--now\b/);

    // Tracks goes on where they were too: How the Internet Works' panel continues UDP; Networking counts HTTP and HTTPS done, as they are its lessons too.
    await open(page, '/tracks');
    const internet = panelOf(page, 'how-the-internet-works');
    await expect(internet.locator('.strip__w')).toHaveText('3 of 14 lessons done');
    await expect(internet.locator('.upnext .btn')).toHaveText('Continue');
    await expect(internet.locator('.upnext .btn')).toHaveAttribute('href', '/how-the-internet-works/what-is-udp?step=4');
    await expect(internet.locator('.upnext__k')).toHaveText('Up next');
    await expect(internet.locator('.upnext__n')).toHaveText('Lesson 04');
    await expect(internet.locator('.upnext__t')).toHaveText('UDP');
    await expect(internet.locator('.strip__sq i[data-state="current"]')).toHaveCount(1);
    // HTTP and HTTPS are also Networking's lessons, and progress is by lesson, so Networking counts them done (E6).
    await expect(panelOf(page, 'networking').locator('.strip__w')).toHaveText('2 of 20 lessons done');
    await expect(panelOf(page, 'networking').locator('.upnext .btn')).toHaveText('Start');

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
    for (const { path } of ALL_PAGES) {
      await page.goto(path);
      await expect(page.locator('.site-head .theme-toggle'), path).toHaveCount(1);
      await expect(page.locator('.site-head .theme-toggle'), path).toBeHidden();
    }
  });

  test('every lesson is listed and the first ready one says Start', async ({ page }) => {
    await page.goto('/networking');
    // Each part, each stop and each ready lesson's link shows, with nothing left to filter or clear.
    expect(NETWORKING_LESSONS.length).toBeGreaterThan(0);
    await expect(routeStops(page)).toHaveCount(20);
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
    await expect(d.locator('.demo__say:visible')).toContainText('You type http://example.net and press Enter');
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
  const tab = (page: Page, name: 'Explain' | 'Steps' | 'Log' | 'Table' | 'Rules' | 'Bits') => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name, exact: true });

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
    // Three parts for every lesson, and a fourth for the lesson's own table (D2).
    await expect(page.getByRole('group', { name: 'Show', exact: true }).getByRole('button')).toHaveText(['Explain', 'Steps', 'Log', 'Table']);

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

  test('a lesson on a phone: the stamp and the numbered sources are at the foot of Learn, with nothing wider than the screen', async ({ page }) => {
    const osi = LESSONS.find((l) => l.slug === 'osi-model')!;
    await open(page, osi.path);
    // The compact top bar has no room for the stamp.
    await expect(page.locator('.console__top .stamp')).toBeHidden();
    await tab(page, 'Steps').click();
    await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^What happened and why/ }).click();
    const foot = page.locator('.console__explain .explain__foot');
    await foot.scrollIntoViewIfNeeded();
    await expect(foot.locator('.stamp')).toHaveText(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
    await expect(foot.locator('ol.explain__sources > li').first()).toBeVisible();
    expect(await page.locator('.console__explain').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect((await pageOverflow(page)).down).toBeLessThanOrEqual(1);
  });

  // ---------------------------------------------------------------- D2: the leftovers (prototypes/d2-lesson-phone.md)

  const bySlug = (slug: string) => LESSONS.find((l) => l.slug === slug)!;
  /** The drawing's height while watching, and while reading Learn or Practice on OSI Model (D2's measurements), by screen height. */
  const SCENE = { 812: { watching: 235, reading: 145 }, 844: { watching: 246, reading: 151 } } as const;
  const names = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button');
  /** Goes to a place in the lesson: a position's number, or 'learn' or 'practice'. */
  async function goTo(page: Page, path: string, where: number | 'learn' | 'practice'): Promise<void> {
    if (where === 0) return open(page, path);
    await open(page, `${path}?step=${where === 'learn' || where === 'practice' ? 99 : where}`);
    await expect(kicker(page)).toHaveText(where === 'learn' ? /Practice/ : where === 'practice' ? /Practice/ : /Step \d+ of \d+/);
    if (where === 'learn') await moveBy(page, () => page.getByRole('button', { name: 'Previous step', exact: true }).click());
    if (where === 'learn') await expect(kicker(page)).toHaveText(/Learn/);
  }
  /** The Table tab, named "Table, changed" while the step that has played has changed the table and the reader has not looked. */
  const tableTab = (page: Page) => page.getByRole('group', { name: 'Show', exact: true }).getByRole('button', { name: /^Table/ });
  /** Waits for the step, which plays on arrival, to give the lesson's table a row it marked, or the rules a check. */
  async function played(page: Page, marked: string): Promise<void> {
    await expect(page.locator(marked).first()).toBeAttached({ timeout: 15_000 });
  }
  /** Plays all of the unit at 2× and waits for the run to end on its last step. */
  async function runAll(page: Page): Promise<void> {
    await setSpeed(page, '2×');
    await playButton(page).click();
    await expect(playButton(page)).toHaveText('Pause');
    await expect(playButton(page)).toHaveText('Play all', { timeout: 90_000 });
  }
  /** Where a log cell's value starts: after its name, in the 84px column (the cell is a grid). */
  const valueX = (cell: Locator) =>
    cell.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const columns = getComputedStyle(el).gridTemplateColumns.split(' ');
      const x = Math.round(box.left + parseFloat(columns[0]!));
      // A cell that is no longer a grid has no name column: NaN would make every cell "line up".
      if (!Number.isFinite(x)) throw new Error(`"${el.getAttribute('data-label')}" has no name column: ${getComputedStyle(el).gridTemplateColumns}`);
      return x;
    });

  for (const screen of [
    { width: 375, height: 812 },
    { width: 390, height: 844 },
  ]) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test.describe(`D2 at ${screen.width}x${screen.height}, ${colorScheme}`, () => {
        test.use({ viewport: screen, colorScheme });

        test('1 and 2: the page and the scene scroll nowhere, from the first frame, on every slot of four lessons', async ({ page }) => {
          test.setTimeout(300_000);
          // Samples the stage's overflow on every frame of the first 700 ms of each load (the figure draws in then).
          await page.addInitScript(() => {
            const worst = { value: 0 };
            (window as unknown as { __stageWorst: typeof worst }).__stageWorst = worst;
            const start = performance.now();
            const tick = () => {
              const el = document.querySelector('.console__stage');
              if (el) worst.value = Math.max(worst.value, Math.abs(el.scrollHeight - el.clientHeight));
              if (performance.now() - start < 700) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
          for (const slug of ['dhcp', 'osi-model', 'firewalls', 'subnetting']) {
            // How many slots the lesson has: walk Next from the start to the end.
            await open(page, bySlug(slug).path);
            let slots = 1;
            for (let at = await position(page); !at.atEnd; slots += 1) at = await moveBy(page, () => nextButton(page).click());
            expect(slots, slug).toBeGreaterThan(5);
            for (let n = 0; n < slots; n += 1) {
              await open(page, `${bySlug(slug).path}?step=${n}`);
              await page.waitForFunction(() => performance.now() > 800);
              const early = await page.evaluate(() => (window as unknown as { __stageWorst: { value: number } }).__stageWorst.value);
              expect(early, `${slug} slot ${n}: the stage while the page loads`).toBe(0);
              expect(await pageOverflow(page), `${slug} slot ${n}: the page`).toEqual({ down: 0, sideways: 0 });
              const stage = await page.locator('.console__stage').evaluate((el) => ({ scroll: el.scrollHeight, client: el.clientHeight }));
              expect(stage.scroll, `${slug} slot ${n}: the stage at rest`).toBe(stage.client);
            }
          }
        });

        test('3: the fourth tab is named for the lesson’s own panel; OSI Model has three', async ({ page }) => {
          for (const [slug, last] of [['dhcp', 'Table'], ['firewalls', 'Rules'], ['subnetting', 'Bits']] as const) {
            await open(page, bySlug(slug).path);
            await expect(names(page)).toHaveText(['Explain', 'Steps', 'Log', last]);
          }
          await open(page, bySlug('osi-model').path);
          await expect(names(page)).toHaveText(['Explain', 'Steps', 'Log']);
        });

        test('4: each tab shows its part and only its part, and the scene does not move', async ({ page }) => {
          await open(page, bySlug('dhcp').path);
          const parts = { Explain: '.console__explain', Steps: '.console__outline', Log: '.console__log', Table: '.tpanel' } as const;
          const sceneBox = async () => (await boxOf(page, '.console__scene'))!;
          const before = await sceneBox();
          for (const [name, shown] of Object.entries(parts)) {
            await tab(page, name as keyof typeof parts).click();
            for (const [other, selector] of Object.entries(parts)) {
              const visible = (await boxOf(page, selector)) !== null;
              expect(visible, `${name} is chosen: ${other}`).toBe(other === name);
              await expect(tab(page, other as keyof typeof parts)).toHaveAttribute('aria-pressed', other === name ? 'true' : 'false');
            }
            expect(shown).toBeTruthy();
            expect(await sceneBox()).toEqual(before);
          }
        });

        test('5: DHCP’s lease table is whole in its tab, its names beside values that start at one x', async ({ page }) => {
          await goTo(page, bySlug('dhcp').path, 4);
          await played(page, '.tpanel tr[data-highlight]');
          await tableTab(page).click();
          const table = page.locator('.tpanel');
          const box = (await boxOf(page, '.tpanel'))!;
          const tabsBottom = (await boxOf(page, '.console__tabs'))!.bottom;
          const controlsTop = (await boxOf(page, '.console__controls'))!.top;
          expect(box.top).toBeGreaterThanOrEqual(tabsBottom - 1);
          expect(box.bottom).toBeLessThanOrEqual(controlsTop + 1);
          expect(await table.evaluate((el) => ({ down: el.scrollHeight - el.clientHeight, sideways: el.scrollWidth - el.clientWidth }))).toEqual({ down: 0, sideways: 0 });
          // The step may still be playing its last events: wait for the lease to be in the table.
          const cells = table.locator('tbody tr').first().locator('td[data-label]');
          await expect(cells).toHaveCount(4);
          const labels = await cells.evaluateAll((els) => els.map((el) => getComputedStyle(el, '::before').content));
          expect(labels).toEqual(['"IP address"', '"MAC address"', '"Device"', '"Expires"']);
          const x = await Promise.all((await cells.all()).map(valueX));
          expect(new Set(x).size).toBe(1);
        });

        test('5: a row’s tag is under its value, not under the name (ICMP’s probe that got no answer)', async ({ page }) => {
          await goTo(page, bySlug('what-is-icmp').path, 'learn');
          await tab(page, 'Table').click();
          const cell = page.locator('.tpanel tr[data-miss] td[data-label]').first();
          const tag = cell.locator('.tpanel__miss');
          await expect(tag).toBeVisible();
          expect((await tag.boundingBox())!.x).toBeGreaterThanOrEqual(await valueX(cell));
        });

        test('6: Firewalls’ rules, step 2: three rules and the connections it remembers are in view, and rule 3 fits → deny', async ({ page }) => {
          await goTo(page, bySlug('firewalls').path, 2);
          await played(page, '.rpanel tr[data-state="deny"]');
          await tab(page, 'Rules').click();
          const panel = page.locator('.rpanel');
          expect(await panel.evaluate((el) => ({ down: el.scrollHeight - el.clientHeight, sideways: el.scrollWidth - el.clientWidth }))).toEqual({ down: 0, sideways: 0 });
          await expect(panel.locator('tbody tr')).toHaveCount(3);
          await expect(panel.locator('tbody tr').nth(2)).toContainText('Fits → deny');
          const bottom = (await boxOf(page, '.rpanel__conns'))!.bottom;
          expect(bottom).toBeLessThanOrEqual((await boxOf(page, '.console__controls'))!.top);
        });

        test('7: a table of three columns is still a table in its tab, with no sideways scroll', async ({ page }) => {
          await goTo(page, bySlug('what-is-tcp').path, 3);
          await expect(page.locator('.tpanel tbody tr[data-highlight]').first()).toBeAttached({ timeout: 15_000 });
          await tableTab(page).click();
          expect(await page.locator('.tpanel__table').evaluate((el) => getComputedStyle(el).display)).toBe('table');
          expect(await page.locator('.tpanel').evaluate((el) => el.scrollWidth - el.clientWidth)).toBe(0);
        });

        test('8 and 9: the mark says the table changed until the reader looks; Back and Next keep the tab', async ({ page }) => {
          await goTo(page, bySlug('dhcp').path, 4);
          const table = page.getByRole('button', { name: /^Table/ });
          await expect(table).toHaveAccessibleName('Table');
          await expect(table).not.toHaveAttribute('aria-label');
          await expect(table).toHaveAccessibleName('Table, changed', { timeout: 15_000 });
          await expect(table).toHaveAttribute('aria-label', 'Table, changed');
          await expect(table).toHaveText('Table');
          await expect(page.locator('.tab__mark')).toHaveCount(1);
          await table.click();
          await expect(page.locator('.tab__mark')).toHaveCount(0);
          await expect(table).not.toHaveAttribute('aria-label');
          await tab(page, 'Explain').click();
          await expect(page.locator('.tab__mark')).toHaveCount(0);
          await expect(table).toHaveAccessibleName('Table');
          await expect(table).not.toHaveAttribute('aria-label');
          // Back and Next keep the chosen tab.
          await table.click();
          await moveBy(page, () => page.getByRole('button', { name: 'Previous step', exact: true }).click());
          await expect(table).toHaveAttribute('aria-pressed', 'true');
          await moveBy(page, () => nextButton(page).click());
          await expect(table).toHaveAttribute('aria-pressed', 'true');
          // A step that has not changed the table has no mark; choosing a step in Steps returns to the words.
          await tab(page, 'Steps').click();
          await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^DHCP Offer/ }).click();
          await expect(tab(page, 'Explain')).toHaveAttribute('aria-pressed', 'true');
          await expect(page.locator('.tab__mark')).toHaveCount(0);
        });

        test('8: the Bits tab never shows the mark, however the board changes', async ({ page }) => {
          for (const where of [1, 2, 3, 4]) {
            await goTo(page, bySlug('subnetting').path, where);
            await playButton(page).click();
            // The board is set by notes as the step plays (and playback goes on to the next step): the tab is never marked.
            for (let i = 0; i < 8; i += 1) {
              await page.waitForTimeout(500);
              await expect(page.getByRole('button', { name: /^Bits/ })).toHaveAccessibleName('Bits');
              await expect(page.locator('.tab__mark')).toHaveCount(0);
            }
          }
        });

        test('8: opening the Rules tab brings the rule that decided into view (rule 3 on step 2), not the first rule', async ({ page }) => {
          await page.addInitScript(() => {
            const seen: string[] = [];
            (window as unknown as { __scrolled: string[] }).__scrolled = seen;
            Element.prototype.scrollIntoView = function (this: Element) {
              seen.push(this.textContent ?? '');
            };
          });
          await goTo(page, bySlug('firewalls').path, 2);
          await played(page, '.rpanel tr[data-state="deny"]');
          await expect(page.getByRole('button', { name: 'Rules, changed' })).toBeVisible();
          await page.getByRole('button', { name: 'Rules, changed' }).click();
          const seen = await page.evaluate(() => (window as unknown as { __scrolled: string[] }).__scrolled);
          expect(seen.length).toBeGreaterThan(0);
          expect(seen.at(-1)).toContain('Fits → deny');
        });

        test('10 and 11: the log’s values start at one x on every row, and the short ones share the last line', async ({ page }) => {
          test.setTimeout(240_000);
          await goTo(page, bySlug('dhcp').path, 5);
          await runAll(page);
          await tab(page, 'Log').click();
          const rows = await logRows(page).all();
          expect(rows.length).toBeGreaterThan(2);
          const xs: number[] = [];
          for (const row of rows) {
            for (const label of ['Source', 'Destination']) xs.push(await valueX(row.locator(`td[data-label="${label}"]`)));
          }
          expect(new Set(xs).size, `DHCP: ${xs.join(', ')}`).toBe(1);
          for (const row of rows) {
            const short = row.locator('td.log__short');
            await expect(short).toHaveCount(3);
            // DHCP's sizes are dashes since batch 5: no source states a DHCP message's size.
            await expect(short).toHaveText([/^\d[\d.]* ?s$/, /^DHCP/, '—']);
            const tops = await short.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
            expect(new Set(tops).size).toBe(1);
            // They are the row's last line: each sits below the Info words, and the row ends with them.
            const info = (await row.locator('td.log__prose').last().boundingBox())!;
            const rowBox = (await row.boundingBox())!;
            for (const box of await short.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()))) {
              expect(Math.round(box.top)).toBeGreaterThanOrEqual(Math.round(info.y + info.height));
              expect(Math.round(box.bottom)).toBeLessThanOrEqual(Math.round(rowBox.y + rowBox.height));
            }
          }
          expect(await page.locator('.log__scroll').evaluate((el) => el.scrollWidth - el.clientWidth)).toBe(0);

          await goTo(page, bySlug('firewalls').path, 6);
          await runAll(page);
          await tab(page, 'Log').click();
          const fx: Record<string, number[]> = { Source: [], Destination: [], Service: [], Decision: [] };
          for (const row of await logRows(page).all()) {
            for (const label of Object.keys(fx)) fx[label]!.push(await valueX(row.locator(`td[data-label="${label}"]`)));
          }
          const all = Object.values(fx).flat();
          expect(all.length).toBeGreaterThan(4);
          expect(new Set(all).size, `Firewalls: ${JSON.stringify(fx)}`).toBe(1);
        });

        test('12: only a lesson with the Network and Sequence switch has a band above its scene', async ({ page }) => {
          for (const slug of ['osi-model', 'subnetting']) {
            await open(page, bySlug(slug).path);
            expect(await boxOf(page, '.stage__head'), slug).toBeNull();
          }
          for (const slug of ['dhcp', 'firewalls']) {
            await open(page, bySlug(slug).path);
            expect((await boxOf(page, '.stage__head'))!.height, slug).toBe(40);
            await expect(viewSwitch(page)).toBeVisible();
          }
        });

        test('13 and 14: OSI Model’s message strip is pinned under the scene while watching, and gone while reading', async ({ page }) => {
          const expected = SCENE[screen.height as 812 | 844];
          await goTo(page, bySlug('osi-model').path, 6);
          await expect.poll(async () => page.locator('.labels-chip:not(.is-data)').count(), { timeout: 30_000 }).toBeGreaterThanOrEqual(6);
          const strip = (await boxOf(page, '.console__stage .labels'))!;
          expect(strip.height).toBe(40);
          expect(strip.bottom).toBeLessThanOrEqual((await boxOf(page, '.console__stage'))!.bottom);
          // One line: the chips share a top. (The note at the right is cut, not wrapped into view, when they leave it no room.)
          expect((await boxOf(page, '.labels-row'))!.height).toBe(30);
          const inRow = await page.locator('.labels-title, .labels-chip').evaluateAll((els) => {
            const row = document.querySelector('.labels-row')!.getBoundingClientRect();
            return els.every((el) => el.getBoundingClientRect().top >= row.top - 1 && el.getBoundingClientRect().bottom <= row.bottom + 1);
          });
          expect(inRow, 'the title and every chip are inside the one line').toBe(true);
          expect((await boxOf(page, '.console__scene'))!.height).toBe(expected.watching);

          for (const where of ['learn', 'practice'] as const) {
            await goTo(page, bySlug('osi-model').path, where);
            expect(await boxOf(page, '.console__stage .labels'), where).toBeNull();
            expect((await boxOf(page, '.console__scene'))!.height, where).toBe(expected.reading);
          }
        });

        test('15: the stamp ends the Overview’s first line, and is not on a step', async ({ page }) => {
          for (const slug of ['osi-model', 'dhcp', 'firewalls', 'subnetting']) {
            await open(page, bySlug(slug).path);
            const lead = page.locator('.console__explain .explain__lead');
            const stamp = lead.locator('a.stamp');
            await expect(stamp).toBeVisible();
            const k = (await kicker(page).boundingBox())!;
            const s = (await stamp.boundingBox())!;
            expect(Math.abs(s.y + s.height / 2 - (k.y + k.height / 2)), `${slug}: one line`).toBeLessThan(8);
            expect(s.x).toBeGreaterThan(k.x + k.width);
            expect(s.x + s.width).toBeLessThanOrEqual(screen.width);
            expect(s.height).toBeGreaterThanOrEqual(24);
            expect(await stamp.textContent()).toMatch(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}, \d+ sources?$/);
            // Its words are the top bar's, which is in the page and hidden at this width.
            expect(await stamp.textContent(), slug).toBe(await page.locator('.console__top .stamp').textContent());
            await expect(stamp).toHaveAttribute('href', '/about#facts');
          }
          await goTo(page, bySlug('dhcp').path, 2);
          await expect(page.locator('.console__explain .stamp')).toHaveCount(0);
        });
      });
    }
  }

  test.describe('D2 on a wider screen, and with scripts off', () => {
    test.describe('JavaScript off at 375px: the page is as before', () => {
      test.use({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
      test('no tabs, the table under the scene, no stamp in the Overview', async ({ page }) => {
        await page.goto(bySlug('dhcp').path);
        expect(await boxOf(page, '.console__tabs')).toBeNull();
        await expect(page.locator('.console__stage .tpanel')).toBeVisible();
        const scene = (await boxOf(page, '.console__scene'))!;
        const table = (await boxOf(page, '.tpanel'))!;
        expect(table.top).toBeGreaterThanOrEqual(scene.bottom);
        expect(await boxOf(page, '.explain__lead .stamp')).toBeNull();
      });
    });
    // 1024px has its own layout since B3 (tablet.spec.ts); the desktop starts at 1100px.
    for (const width of [1100, 1440]) {
      test.describe(`${width}px with scripts on: the page is as before`, () => {
        test.use({ viewport: { width, height: 900 }, isMobile: false, hasTouch: false });
        test('no tabs shown, the table in the guide (890px tall and up), no stamp anywhere', async ({ page }) => {
          await open(page, bySlug('dhcp').path);
          expect(await boxOf(page, '.console__tabs')).toBeNull();
          expect(await boxOf(page, '.console__stage .tpanel')).toBeNull();
          expect(await boxOf(page, '.guide__table .tpanel')).not.toBeNull();
          expect(await boxOf(page, '.stamp')).toBeNull();
        });
      });
    }
  });
});

// ---------------------------------------------------------------- H1: Home follows the cited lesson (prototypes/d5-home-sources.md, variant A)

test.describe('H1: Home’s Learn part, the lesson’s stamp and sources, and the page on the laptop', () => {
  const HTTP_PATH = '/how-the-internet-works/what-is-http';
  const STAMP = 'Checked 11 Nov 2026, 20 sources';
  const sizes = [
    { width: 375, height: 812 },
    { width: 1440, height: 900 },
  ];
  const src = (page: Page) => page.locator('main .demo .demo__src');
  const summary = (page: Page) => page.locator('main .demo .demo__src summary');
  const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

  /** Home with its Learn part showing: the part buttons are labels of radio buttons, so no script is needed. */
  async function learn(page: Page): Promise<void> {
    await page.goto('/');
    await demo(page).locator('.demo__parts label', { hasText: 'Learn' }).click();
    await expect(page.locator('#demo-learn')).toBeChecked();
    await expect(src(page)).toBeVisible();
  }
  const heightOf = async (locator: Locator): Promise<number> => (await locator.boundingBox())!.height;

  /** The links at the foot of the lesson's own Learn part, read in a window of its own with scripts on. */
  async function lessonFoot(page: Page): Promise<{ hrefs: string[]; labels: string[] }> {
    const context = await page.context().browser()!.newContext({ viewport: { width: 1440, height: 900 } });
    const lesson = await context.newPage();
    try {
      await open(lesson, `${new URL(page.url()).origin}${HTTP_PATH}`);
      // The lesson page shows no stamp (2.97): only the sources are compared with Home's block.
      await lesson.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: 'Learn', exact: true }).click();
      await expect(kicker(lesson)).toHaveText('Learn');
      const items = lesson.locator('.console__explain .explain__foot ol.explain__sources > li');
      const hrefs = await items.locator('a').evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
      const labels = await items.locator('a').evaluateAll((links) => links.map((a) => a.firstChild?.textContent ?? ''));
      expect(await lesson.locator('.stamp').count()).toBe(0);
      return { hrefs, labels };
    } finally {
      await context.close();
    }
  }

  /** Case 15: closed, three links; open, twenty; closed again, the block is as tall as it was. */
  async function openAndClose(page: Page): Promise<void> {
    const links = src(page).locator('a:visible');
    await expect(links).toHaveCount(3);
    await expect(summary(page)).toHaveText('Show the other 17', { useInnerText: true });
    const first = await heightOf(src(page));
    await summary(page).click();
    await expect(links).toHaveCount(20);
    await expect(summary(page)).toHaveText('Hide the other 17', { useInnerText: true });
    await summary(page).click();
    await expect(links).toHaveCount(3);
    await expect(summary(page)).toHaveText('Show the other 17', { useInnerText: true });
    expect(await heightOf(src(page))).toBe(first);
  }

  /** Case 18: Tab from the HTTPS link through sources 1 to 3 to the control; Enter opens, Space closes. */
  async function keyboard(page: Page): Promise<void> {
    const where = () => page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return { text: el.textContent?.replace(/\s+/g, ' ').trim() ?? '', tag: el.tagName, folded: el.closest('.demo__more > ol, .demo__more > ul') !== null };
    });
    await page.locator('.demo__sealed a').focus();
    for (const name of ['RFC 9114', 'RFC 9110', 'RFC 3986']) {
      await page.keyboard.press('Tab');
      expect((await where()).text).toBe(name);
    }
    await page.keyboard.press('Tab');
    expect(await where()).toMatchObject({ tag: 'SUMMARY', folded: false });
    await page.keyboard.press('Enter');
    await expect(summary(page)).toHaveText('Hide the other 17', { useInnerText: true });
    await page.keyboard.press('Tab');
    expect(await where()).toMatchObject({ tag: 'A', text: 'RFC 791', folded: true });
    expect((await page.evaluate(() => document.activeElement!.getAttribute('title')))!.length).toBeGreaterThan(5);
    await page.keyboard.press('Shift+Tab');
    expect((await where()).tag).toBe('SUMMARY');
    await page.keyboard.press('Space');
    await expect(summary(page)).toHaveText('Show the other 17', { useInnerText: true });
    await page.keyboard.press('Tab');
    expect((await where()).folded).toBe(false);
  }

  /** Case 22: the page is not wider than the window, closed and open. */
  async function noSideways(page: Page): Promise<void> {
    const wide = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    // The card does not clip what overflows it (its cards beneath lie outside its box), so nothing in the block may reach past the card's edge: the document never widens for it.
    const clipped = () => page.evaluate(() => {
      const edge = document.querySelector('main .demo')!.getBoundingClientRect().right;
      return [...document.querySelectorAll('.demo__src a, .demo__src .stamp, .demo__src summary')].filter((el) => el.getBoundingClientRect().right > edge + 0.5).length;
    });
    expect(await wide()).toBe(0);
    expect(await clipped()).toBe(0);
    await summary(page).click();
    await expect(summary(page)).toHaveText('Hide the other 17', { useInnerText: true });
    expect(await wide()).toBe(0);
    expect(await clipped()).toBe(0);
  }

  for (const size of sizes) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test.describe(`${size.width}x${size.height}, ${colorScheme}, scripts on`, () => {
        test.use({ viewport: size, colorScheme, isMobile: false, hasTouch: false });

        test('the block is the lesson’s stamp, then its sources: 20 in all, 3 shown, the rest behind one control', async ({ page }) => {
          await learn(page);
          const stamp = src(page).locator('.stamp');
          await expect(stamp).toHaveText(STAMP);
          expect(await stamp.evaluate((el) => el.tagName)).toBe('SPAN');
          await expect(src(page).locator('a')).toHaveCount(20);
          await expect(src(page)).not.toContainText('Sources:');
          expect(squash(await src(page).innerText())).toBe(`${STAMP} 1 RFC 9114 2 RFC 9110 3 RFC 3986 Show the other 17`);
        });

        test('it opens in place and closes to the height it had', async ({ page }) => {
          await learn(page);
          await openAndClose(page);
        });

        test('open, the numbers run 1 to 20 and the lists say what they are', async ({ page }) => {
          await learn(page);
          await summary(page).click();
          const nums = await src(page).locator('.demo__num').allTextContents();
          expect(nums).toEqual(Array.from({ length: 20 }, (_, i) => String(i + 1)));
          const lists = src(page).locator('ol.demo__list');
          await expect(lists.nth(0)).toHaveAttribute('aria-label', 'Sources');
          await expect(lists.nth(1)).toHaveAttribute('aria-label', 'Sources 4 to 20');
          await expect(lists.nth(1)).toHaveAttribute('start', '4');
        });

        test('each link goes where the lesson’s own list goes, in order, with its full label as the title', async ({ page }) => {
          await learn(page);
          const foot = await lessonFoot(page);
          const links = src(page).locator('a');
          const hrefs = await links.evaluateAll((a) => a.map((el) => (el as HTMLAnchorElement).href));
          expect(hrefs).toEqual(foot.hrefs);
          expect(hrefs).toHaveLength(20);
          expect(await links.evaluateAll((a) => a.map((el) => el.getAttribute('title')))).toEqual(foot.labels);
          expect(await links.last().getAttribute('title')).toMatch(/^RFC 6335: /);
          expect(await links.evaluateAll((a) => a.filter((el) => el.hasAttribute('target')).length)).toBe(0);
        });

        test('from the HTTPS link the keyboard reaches 1, 2, 3, the control, and then the folded sources only when open', async ({ page }) => {
          await learn(page);
          await keyboard(page);
        });

        test('no sideways scroll, closed or open', async ({ page }) => {
          await learn(page);
          await noSideways(page);
        });
      });
    }

    test.describe(`${size.width}x${size.height}: sizes`, () => {
      test.use({ viewport: size, isMobile: false, hasTouch: false });

      test('touch targets and the block’s height', async ({ page }) => {
        await learn(page);
        const phone = size.width === 375;
        // Closed, the block is at most 115px tall on a phone and 99px on a desktop.
        expect(await heightOf(src(page))).toBeLessThanOrEqual(phone ? 115 : 99);
        for (const state of ['closed', 'open']) {
          if (state === 'open') await summary(page).click();
          expect(await heightOf(summary(page)), `the control, ${state}`).toBeGreaterThanOrEqual(44);
          if (phone) {
            const heights = await src(page).locator('a:visible').evaluateAll((a) => a.map((el) => el.getBoundingClientRect().height));
            expect(heights.length).toBe(state === 'open' ? 20 : 3);
            for (const h of heights) expect(h).toBeGreaterThanOrEqual(44);
          }
        }
      });
    });
  }

  test.describe('scripts off', () => {
    for (const size of sizes) {
      test.describe(`${size.width}x${size.height}`, () => {
        test.use({ viewport: size, javaScriptEnabled: false, isMobile: false, hasTouch: false });
        test('it opens and closes, the keyboard works, and nothing scrolls sideways', async ({ page }) => {
          await learn(page);
          await openAndClose(page);
          await keyboard(page);
          await page.reload();
          await demo(page).locator('.demo__parts label', { hasText: 'Learn' }).click();
          await noSideways(page);
        });
      });
    }
  });

  // Case 21: the shown list is three across and the folded one two across up to 860px; from 861 the folded list is three.
  for (const width of [375, 768, 860, 861, 1440]) {
    test.describe(`columns at ${width}px`, () => {
      test.use({ viewport: { width, height: 900 }, isMobile: false, hasTouch: false });
      test('three across, and two or three across when folded', async ({ page }) => {
        await learn(page);
        await summary(page).click();
        const across = (list: Locator) => list.locator('li').evaluateAll((li) => new Set(li.map((el) => Math.round(el.getBoundingClientRect().left))).size);
        const lists = src(page).locator('ol.demo__list');
        expect(await across(lists.nth(0))).toBe(3);
        expect(await across(lists.nth(1))).toBe(width <= 860 ? 2 : 3);
        if (width <= 860) {
          for (const h of await src(page).locator('a').evaluateAll((a) => a.map((el) => el.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(44);
        }
      });
    });
  }

  test('the lesson’s words are quoted as the lesson has them', async ({ page }) => {
    await page.goto('/');
    const d = demo(page);
    await expect(d.locator('.demo__say:visible')).toContainText('You type http://example.net and press Enter');
    await d.locator('.demo__parts label', { hasText: 'Learn' }).click();
    await expect(d.locator('.demo__pane--learn .demo__lead')).toContainText('In HTTP/1.1, getting a web page is a conversation in plain text.');
    expect(await page.locator('main .demo').textContent()).not.toContain('HyperText');
    await page.goto(HTTP_PATH);
    await expect(page.locator('body')).toContainText('Hypertext Transfer Protocol');
  });

  test('Home has no island, and as many script elements as before H1 (two)', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).not.toContain('astro-island');
    expect(html.match(/<script/g)).toHaveLength(2);
  });

  test.describe('the page on the laptop', () => {
    test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });
    const part = (page: Page, which: 'text' | 'pic') => demo(page).locator(`svg[data-figure="net-map"] #nm-page [data-part="${which}"]`).first().evaluate((el) => getComputedStyle(el).opacity);

    test('empty through step 4, drawn in step 5, and empty again going back to step 4', async ({ page }) => {
      await page.goto('/');
      const d = demo(page);
      for (const n of [1, 2, 3]) {
        await d.locator(`.demo__row[for="demo-s${n}"]`).click();
        await expect(page.locator(`#demo-s${n}`)).toBeChecked();
        expect(await part(page, 'text'), `words at step ${n}`).toBe('0');
        expect(await part(page, 'pic'), `pictures at step ${n}`).toBe('0');
      }
      await d.locator('.demo__row[for="demo-s5"]').click();
      await expect.poll(() => part(page, 'text')).toBe('1');
      await expect.poll(() => part(page, 'pic')).toBe('1');
      await d.locator('.demo__row[for="demo-s4"]').click();
      await expect(page.locator('#demo-s4')).toBeChecked();
      await expect.poll(() => part(page, 'text')).toBe('0');
      await expect.poll(() => part(page, 'pic')).toBe('0');
    });

    test('choosing Learn straight from step 1, then Practice, keeps the page drawn', async ({ page }) => {
      await page.goto('/');
      const d = demo(page);
      await d.locator('.demo__parts label', { hasText: 'Learn' }).click();
      await expect.poll(() => part(page, 'text')).toBe('1');
      await expect.poll(() => part(page, 'pic')).toBe('1');
      await d.locator('.demo__parts label', { hasText: 'Practice' }).click();
      await expect.poll(() => part(page, 'text')).toBe('1');
      await expect.poll(() => part(page, 'pic')).toBe('1');
    });
  });
});

// ---------------------------------------------------------------- B20: Home in the Card stack look (prototypes/d17-cases.md)
// Each test names its case. Every window is set by the test itself (the phone project's 390 is not the spec's 375), and every
// measure is taken after the fonts are ready and with the smooth scroll off.

type B20Cfg = { width: number; height: number; scheme: 'light' | 'dark' };
const B20_CFGS: B20Cfg[] = [
  { width: 375, height: 812, scheme: 'light' },
  { width: 375, height: 812, scheme: 'dark' },
  { width: 1440, height: 900, scheme: 'light' },
  { width: 1440, height: 900, scheme: 'dark' },
];
const EDGE = { light: 'rgb(18, 23, 27)', dark: 'rgb(198, 205, 209)' } as const;

/** Home, with the fonts ready and no smooth scrolling to wait for. */
async function b20Home(page: Page, scripts = true): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  // A page with its scripts off cannot take a style tag: those tests wait for Home's smooth scroll to settle instead.
  if (scripts) await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
}
/** A token's colour, resolved through a probe element (never by string-matching getPropertyValue). */
const b20Tok = (page: Page, name: string): Promise<string> =>
  page.evaluate((n) => {
    const probe = document.createElement('i');
    probe.style.color = `var(--${n})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
const b20Css = (loc: Locator, prop: string, pseudo: string | null = null): Promise<string> =>
  loc.evaluate((el, a) => getComputedStyle(el, a[1]).getPropertyValue(a[0]), [prop, pseudo] as const);
const b20Rect = (loc: Locator) =>
  loc.evaluate((el) => {
    const b = el.getBoundingClientRect();
    return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height };
  });
/** Checks a radio by a script click: no focus ring, no scroll, a state to measure from. */
const b20Pick = (page: Page, id: string): Promise<void> => page.evaluate((i) => (document.getElementById(i) as HTMLInputElement).click(), id);
const b20Scroll = (page: Page, y: number): Promise<void> => page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
/** Scrolls so `.demo`'s top is `at` pixels from the window's top. */
const b20DemoAt = async (page: Page, at: number): Promise<void> => {
  const top = await page.evaluate(() => document.querySelector('main .demo')!.getBoundingClientRect().top + window.scrollY);
  await b20Scroll(page, top - at);
};
/** Waits for a scroll in flight to finish (a page with its scripts off has Home's smooth scroll on). */
async function b20Settle(page: Page): Promise<void> {
  let last = -1;
  for (let i = 0; i < 40; i += 1) {
    const now = await page.evaluate(() => window.scrollY);
    if (now === last) return;
    last = now;
    await page.waitForTimeout(80);
  }
}
const b20Sides = (loc: Locator, pseudo: string | null = null) =>
  loc.evaluate(
    (el, ps) => {
      const cs = getComputedStyle(el, ps);
      return (['Top', 'Right', 'Bottom', 'Left'] as const).map((s) => [cs.getPropertyValue(`border-${s.toLowerCase()}-width`), cs.getPropertyValue(`border-${s.toLowerCase()}-style`), cs.getPropertyValue(`border-${s.toLowerCase()}-color`)]);
    },
    pseudo,
  );
/** Every displayed `main .btn`: its height, borders, shadow and primary-ness. */
const b20Buttons = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('main .btn')]
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const cs = getComputedStyle(el);
        return { text: el.textContent!.trim(), primary: el.classList.contains('btn--primary'), height: el.getBoundingClientRect().height, borders: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth], shadow: cs.boxShadow, inDemo: el.closest('.demo') !== null, inLeg: el.closest('.leg') !== null, inFacts: el.closest('.facts__grid') !== null, inClose: el.closest('.close__grid') !== null };
      }),
  );

test.describe('B20: Home in the Card stack look', () => {
  for (const cfg of B20_CFGS) {
    const phone = cfg.width === 375;
    test.describe(`${cfg.width}x${cfg.height}, ${cfg.scheme}`, () => {
      test.use({ viewport: { width: cfg.width, height: cfg.height }, colorScheme: cfg.scheme, isMobile: false, hasTouch: false });

      test('3: the header is the same on Home and on /about: the page’s look is scoped to the page', async ({ page }) => {
        const read = async (path: string) => {
          await page.goto(path);
          await page.evaluate(() => document.fonts.ready);
          return page.evaluate(() => {
            const head = document.querySelector('.site-head')!;
            const nav = head.querySelector('nav.site-nav')!;
            const link = nav.querySelector('a[href="/glossary"]')!;
            const start = head.querySelector('.wrap a.btn--primary')!;
            const pick = (el: Element, props: string[]) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el).getPropertyValue(p)]));
            return {
              head: pick(head, ['background-color', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color']),
              nav: pick(nav, ['border-top-width', 'border-top-color', 'border-top-left-radius', 'box-shadow', 'background-color']),
              link: pick(link, ['border-top-left-radius', 'box-shadow', 'background-color', 'border-top-width']),
              start: pick(start, ['background-color', 'border-top-left-radius', 'box-shadow', 'border-top-width', 'border-top-color', 'transform', 'font-size']),
              startText: start.textContent,
            };
          });
        };
        const home = await read('/');
        const about = await read('/about');
        expect(home.startText).toBe('Start learning');
        expect(home).toEqual(about);
        // The nearest leak: a rule written as `.btn` inside :global(...) gives the header's button the page's offset edge.
        expect(home.start['box-shadow']).toBe('none');
        expect(home.start['border-top-width']).toBe('1px');
      });

      test('4: one ground from the header down: main is clear, and no rule is drawn above the opening', async ({ page }) => {
        await b20Home(page);
        const r = await page.evaluate(() => {
          const rgb = (c: string): number[] => {
            const m = /^rgba?\(([^)]+)\)$/.exec(c);
            if (m !== null) return m[1]!.split(/[ ,/]+/).slice(0, 3).map(Number);
            const s = /^color\(srgb ([^)]+)\)$/.exec(c)!;
            return s[1]!.split(/[ /]+/).slice(0, 3).map((v) => Math.round(Number(v) * 255));
          };
          const head = document.querySelector('.site-head')!.getBoundingClientRect();
          const h1 = document.querySelector('main h1')!.getBoundingClientRect();
          const between = [...document.querySelectorAll('main *')].filter((el) => el.closest('svg') === null).filter((el) => {
            const b = el.getBoundingClientRect();
            return b.height > 0 && b.top >= head.bottom - 0.5 && b.bottom <= h1.top + 0.5;
          });
          return {
            head: rgb(getComputedStyle(document.querySelector('.site-head')!).backgroundColor),
            body: rgb(getComputedStyle(document.body).backgroundColor),
            main: getComputedStyle(document.querySelector('main')!).backgroundColor,
            between: between.map((el) => ({ tag: el.className, borders: ['Top', 'Right', 'Bottom', 'Left'].map((s) => getComputedStyle(el).getPropertyValue(`border-${s.toLowerCase()}-width`)), bg: getComputedStyle(el).backgroundColor })),
            tryHead: getComputedStyle(document.querySelector('.try__head')!).borderTopWidth,
          };
        });
        r.head.forEach((v, i) => expect(Math.abs(v - r.body[i]!), 'the header and the page share a ground').toBeLessThanOrEqual(1));
        expect(r.main).toBe('rgba(0, 0, 0, 0)');
        for (const el of r.between) {
          expect(el.borders.every((w) => w === '0px'), `${el.tag} draws no rule`).toBe(true);
          expect(el.bg).toBe('rgba(0, 0, 0, 0)');
        }
        expect(r.tryHead, 'no rule over “Try one”').toBe('0px');
      });

      test('5: a card has a 2px solid edge in the edge colour and a 10px corner; the demo’s top corners are square on a phone', async ({ page }) => {
        await b20Home(page);
        const edge = await b20Tok(page, 'cs-edge');
        expect(edge).toBe(EDGE[cfg.scheme]);
        const cards: [string, Locator, string | null][] = [
          ['.demo::before', page.locator('main .demo'), '::before'],
          ['.leg 1', page.locator('main .leg').nth(0), null],
          ['.leg 2', page.locator('main .leg').nth(1), null],
          ['.facts__grid', page.locator('main .facts__grid'), null],
          ['.close__grid', page.locator('main .close__grid'), null],
        ];
        for (const [name, loc, pseudo] of cards) {
          for (const side of await b20Sides(loc, pseudo)) expect(side, name).toEqual(['2px', 'solid', edge]);
        }
        const radii = (loc: Locator, pseudo: string | null = null) =>
          loc.evaluate((el, ps) => { const cs = getComputedStyle(el, ps); return [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius]; }, pseudo);
        expect(await radii(page.locator('main .demo'), '::before'), 'the demo card').toEqual(phone ? ['0px', '0px', '10px', '10px'] : ['10px', '10px', '10px', '10px']);
        for (const i of [0, 1]) expect(await radii(page.locator('main .leg').nth(i)), `.leg ${i + 1}: the tab stands at the top-left`).toEqual(['0px', '10px', '10px', '10px']);
        expect(await radii(page.locator('main .facts__grid'))).toEqual(['10px', '10px', '10px', '10px']);
        expect(await radii(page.locator('main .close__grid'))).toEqual(['10px', '10px', '10px', '10px']);
      });

      test('6: two cards beneath the demo, one beneath each track, none beneath the facts and the close', async ({ page }) => {
        await b20Home(page);
        const demo = page.locator('main .demo');
        const card = await b20Tok(page, 'cs-card');
        const edge = await b20Tok(page, 'cs-edge');
        const stack = phone ? 4 : 6;
        expect(await b20Css(demo, 'box-shadow', '::before')).toBe(`${card} ${stack}px ${stack}px 0px -2px, ${edge} ${stack}px ${stack}px 0px 0px`);
        const after = await demo.evaluate((el) => {
          const cs = getComputedStyle(el, '::after');
          return { display: cs.display, position: cs.position, image: cs.backgroundImage, right: parseFloat(cs.right), bottom: parseFloat(cs.bottom), border: cs.borderTopWidth, edge: cs.borderTopColor, zIndex: cs.zIndex };
        });
        expect(after.display).not.toBe('none');
        expect(after.position).toBe('absolute');
        expect(after.image.startsWith('conic-gradient(')).toBe(true);
        expect(after.image).toContain(edge);
        expect(after.image).toContain(card);
        expect(after.border).toBe('2px');
        expect(after.edge).toBe(edge);
        // Its right and bottom edges lie 12px (1440) or 8px (375) beyond the card's: the grid area ends 2px inside the demo's right edge.
        expect(after.right, 'right inset').toBe(-(2 * stack + 2));
        expect(after.bottom, 'bottom inset').toBe(-2 * stack);
        // The exposed strip is the demo's own to hit-test, not the next section's.
        await b20DemoAt(page, 100);
        const box = await b20Rect(demo);
        const hit = await page.evaluate(([x, y]) => document.elementsFromPoint(x!, y!)[0]!.className, [box.right + 2 * stack - 3, box.top + box.height / 2] as const);
        expect(hit).toContain('demo');
        for (const side of ['overflow-x', 'overflow-y']) expect(await b20Css(demo, side), `the stack lies outside the demo's box: ${side}`).toBe('visible');
        for (const i of [0, 1]) {
          const leg = page.locator('main .leg').nth(i);
          expect(await b20Css(leg, 'box-shadow')).toBe(`${card} ${stack}px ${stack}px 0px -2px, ${edge} ${stack}px ${stack}px 0px 0px`);
          expect(await b20Css(leg, 'content', '::after'), 'no second card under a track').toBe('none');
        }
        for (const sel of ['main .facts__grid', 'main .close__grid']) expect(await b20Css(page.locator(sel), 'box-shadow'), sel).toBe('none');
      });

      test('6: the dithered card covers nothing: the real element is hit first at the scene, the first row, Next and the tabs', async ({ page }) => {
        await b20Home(page);
        await b20DemoAt(page, 70);
        const probes: [string, string][] = [['.demo__scene', ''], ['.demo__row[for="demo-s1"] .demo__n', ''], ['.demo__next--1', ''], ['.demo__parts label[for="demo-learn"]', '']];
        for (const [sel] of probes) {
          const ok = await page.evaluate((s) => {
            const el = document.querySelector(s)!;
            const b = el.getBoundingClientRect();
            const first = document.elementsFromPoint(b.left + b.width / 2, Math.min(b.top + b.height / 2, innerHeight - 4))[0]!;
            return el === first || el.contains(first);
          }, sel);
          expect(ok, `${sel} is hit first`).toBe(true);
        }
      });

      test('7: every button is at least 48px tall with a 2px border and a 3px offset edge; pressed it is 1px and moved 2px', async ({ page }) => {
        await b20Home(page);
        const check = async () => {
          for (const b of await b20Buttons(page)) {
            expect(b.height, `${b.text} is at least 48px tall`).toBeGreaterThanOrEqual(48);
            expect(b.borders, `${b.text}'s border`).toEqual(['2px', '2px', '2px', '2px']);
            expect(b.shadow, `${b.text}'s offset edge`).toMatch(/ 3px 3px 0px 0px$/);
          }
        };
        await check();
        expect((await b20Buttons(page)).map((b) => b.text)).toEqual(['Start with lesson 1: HTTP', 'See the tracks', 'Next step', 'Start with lesson 1: HTTP']);
        await b20Pick(page, 'demo-learn');
        await check();
        expect((await b20Buttons(page)).map((b) => b.text)).toContain('Go to Practice');
        await b20Pick(page, 'demo-watch');
        // The hidden Next labels are not buttons on show: only one is displayed.
        expect((await b20Buttons(page)).filter((b) => b.text === 'Next step')).toHaveLength(1);
      });

      test('7: a pressed button has the 1px shadow and has moved 2px, with and without reduced motion; the old scale is gone', async ({ page }) => {
        for (const reducedMotion of ['no-preference', 'reduce'] as const) {
          await page.emulateMedia({ reducedMotion });
          await b20Home(page);
          for (const sel of ['main .demo__next:visible', 'main .open .btn--primary', 'main .open .btn:not(.btn--primary)']) {
            const btn = page.locator(sel).first();
            await btn.scrollIntoViewIfNeeded();
            const box = (await btn.boundingBox())!;
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await expect.poll(() => b20Css(btn, 'box-shadow'), { message: `${sel} pressed (${reducedMotion})` }).toMatch(/ 1px 1px 0px 0px$/);
            await expect.poll(() => b20Css(btn, 'transform')).toBe('matrix(1, 0, 0, 1, 2, 2)');
            // Let go away from the button, so nothing is clicked and the page stays.
            await page.mouse.move(2, 2);
            await page.mouse.up();
            await expect.poll(() => b20Css(btn, 'transform')).toBe('none');
            await expect.poll(() => b20Css(btn, 'box-shadow')).toMatch(/ 3px 3px 0px 0px$/);
          }
        }
      });

      test('8: one filled button showing per card, in every state of the demo', async ({ page }) => {
        await b20Home(page);
        const primaries = () => page.evaluate(() => {
          const shown = [...document.querySelectorAll<HTMLElement>('main .btn--primary')].filter((el) => el.getClientRects().length > 0);
          const count = (sel: string) => shown.filter((el) => el.closest(sel) !== null).length;
          return { demo: count('.demo'), close: count('.close__grid'), legs: count('.leg'), facts: count('.facts__grid'), open: shown.filter((el) => el.closest('.open') !== null).length, plain: [...document.querySelectorAll<HTMLElement>('main .open .btn:not(.btn--primary)')].length };
        });
        const states: [string, string, number][] = [['demo-s1', '', 1], ['demo-s2', '', 1], ['demo-s3', '', 1], ['demo-s4', '', 1], ['demo-s5', '', 1], ['demo-learn', '', 1], ['demo-practice', '', 0]];
        for (const [id, , want] of states) {
          await b20Pick(page, id);
          const p = await primaries();
          expect(p.demo, `inside the demo at ${id}`).toBe(want);
          expect(p.close).toBe(1);
          expect(p.legs).toBe(0);
          expect(p.facts).toBe(0);
          expect(p.open, 'the opening has one filled button').toBe(1);
          expect(p.plain, 'and one plain').toBe(1);
        }
      });

      test('9: the tab on show is 52px tall, bold, joined to the card and marked; the others are 46px, 600, edged, and unmarked', async ({ page }) => {
        await b20Home(page);
        await b20DemoAt(page, 100);
        const parts = ['watch', 'learn', 'practice'];
        for (const on of parts) {
          await b20Pick(page, `demo-${on}`);
          const demoBox = await b20Rect(page.locator('main .demo'));
          for (const part of parts) {
            const label = page.locator(`main .demo__parts label[for="demo-${part}"]`);
            const box = await b20Rect(label);
            const shown = part === on;
            expect(box.height, `${part} tab, ${on} on show`).toBeCloseTo(shown ? 52 : 46, 0);
            expect(await b20Css(label, 'font-weight')).toBe(shown ? '700' : '600');
            expect(await b20Css(label, 'border-bottom-width')).toBe(shown ? '0px' : '2px');
            expect(await b20Css(label, 'display', '::before')).toBe(shown ? 'block' : 'none');
            if (shown) {
              expect(await b20Css(label, 'width', '::before')).toBe('9px');
              expect(await b20Css(label, 'height', '::before')).toBe('9px');
              // The card's top edge does not show under the tab on show.
              const hit = await page.evaluate(([x, y]) => (document.elementFromPoint(x!, y!) as HTMLElement).closest('label')?.getAttribute('for'), [box.left + box.width / 2, box.bottom - 1] as const);
              expect(hit).toBe(`demo-${part}`);
            }
            // Every tab stands on the card's top edge, overlapping it by 2px.
            expect(box.bottom - demoBox.top, `${part} tab's foot`).toBeCloseTo(52, 0);
          }
        }
      });

      test('9: the tabs line up with the card: the first tab’s left edge is the scene’s rule (1440), or three equal tabs span the card (375)', async ({ page }) => {
        await b20Home(page);
        const tabs = await Promise.all([0, 1, 2].map((i) => b20Rect(page.locator('main .demo__parts label').nth(i))));
        if (phone) {
          const widths = tabs.map((t) => t.width);
          for (const w of widths) expect(w).toBeCloseTo(widths[0]!, 0);
          const demo = await b20Rect(page.locator('main .demo'));
          expect(tabs[0]!.left, 'the first tab carries the card’s left edge up').toBeCloseTo(demo.left, 0);
          expect(tabs[2]!.right, 'the last tab carries the right edge up').toBeCloseTo(demo.right, 0);
          expect(Math.abs(tabs[1]!.left - tabs[0]!.right), 'neighbours share an edge').toBeLessThanOrEqual(2.5);
        } else {
          const scene = await b20Rect(page.locator('main .demo__scene'));
          expect(Math.abs(tabs[0]!.left - (scene.right - 2)), 'the first tab’s left edge runs down into the rule').toBeLessThanOrEqual(1);
        }
      });

      test('10: the step on show is the here chip on an edged, washed row; steps behind are ticked; steps ahead keep their number', async ({ page }) => {
        await b20Home(page);
        const here = await b20Tok(page, 'cs-here');
        const hereInk = await b20Tok(page, 'cs-here-ink');
        const card = await b20Tok(page, 'cs-card');
        const edge = await b20Tok(page, 'cs-edge');
        const done = await b20Tok(page, 'cs-done');
        const wash = await b20Tok(page, 'cs-here-wash');
        for (let n = 1; n <= 5; n += 1) {
          await b20Pick(page, `demo-s${n}`);
          for (let i = 1; i <= 5; i += 1) {
            const chip = page.locator(`main .demo__row[for="demo-s${i}"] .demo__n`);
            const row = page.locator(`main .demo__row[for="demo-s${i}"]`);
            const label = `step ${i} with step ${n} on show`;
            if (i === n) {
              expect(await b20Css(chip, 'background-color'), `${label}: chip`).toBe(here);
              expect(await b20Css(chip, 'color'), label).toBe(hereInk);
              expect(await b20Css(chip, 'display', '::after'), label).toBe('none');
              if (!phone) {
                expect(await b20Css(row, 'border-top-color'), `${label}: row edge`).toBe(edge);
                expect(await b20Css(row, 'background-color'), `${label}: row wash`).toBe(wash);
              }
            } else {
              expect(await b20Css(chip, 'background-color'), label).toBe(card);
              if (!phone) {
                expect(await b20Css(row, 'border-top-color'), label).toBe('rgba(0, 0, 0, 0)');
                expect(await b20Css(row, 'background-color'), label).toBe('rgba(0, 0, 0, 0)');
              }
              if (i < n) {
                expect(await b20Css(chip, 'font-size'), `${label}: its number is hidden`).toBe('0px');
                expect(await b20Css(chip, 'display', '::after'), label).toBe('block');
                expect(await b20Css(chip, 'border-left-width', '::after')).toBe('3px');
                expect(await b20Css(chip, 'border-bottom-width', '::after')).toBe('3px');
                expect(await b20Css(chip, 'border-top-width', '::after')).toBe('0px');
                expect(await b20Css(chip, 'border-left-color', '::after'), label).toBe(done);
              } else {
                expect(await b20Css(chip, 'font-size'), `${label}: its number shows`).toBe(phone ? '16px' : '14px');
                expect(await b20Css(chip, 'display', '::after'), label).toBe('none');
              }
            }
          }
        }
        // The washed row composites to the prototype's drawn colour on the card (light).
        if (!phone && cfg.scheme === 'light') {
          await b20Pick(page, 'demo-s1');
          const m = /rgba\(176, 70, 23, ([\d.]+)\)/.exec(wash)!;
          const a = Number(m[1]);
          expect([176, 70, 23].map((c, i) => Math.round(c * a + [250, 251, 250][i]! * (1 - a)))).toEqual([243, 233, 227]);
        }
      });

      test('11: a request has a 5px bar in the request colour and a response in the response colour; no other thing on the page has either', async ({ page }) => {
        await b20Home(page);
        const request = await b20Tok(page, 'cs-request');
        const response = await b20Tok(page, 'cs-response');
        expect(request).toBe(cfg.scheme === 'light' ? 'rgb(31, 99, 192)' : 'rgb(90, 169, 255)');
        for (const n of [2, 3, 4, 5]) {
          await b20Pick(page, `demo-s${n}`);
          const bars = await page.locator(`main .demo__say--${n} li`).evaluateAll((els) => els.map((el) => [el.getAttribute('data-kind'), getComputedStyle(el).borderLeftWidth, getComputedStyle(el).borderLeftColor]));
          expect(bars.length).toBeGreaterThanOrEqual(2);
          for (const [kind, width, color] of bars) {
            expect(width).toBe('5px');
            expect(color, `${kind} bar`).toBe(kind === 'request' ? request : response);
          }
        }
        // Every element in main, hidden ones too: only the 11 message bars carry either colour.
        const hits = await page.evaluate(([a, b]) => {
          const out: string[] = [];
          for (const el of document.querySelectorAll('main *')) {
            const cs = getComputedStyle(el);
            const props: [string, string][] = [['color', cs.color], ['background-color', cs.backgroundColor], ['fill', cs.fill], ['stroke', cs.stroke], ['stop-color', cs.stopColor]];
            if (cs.outlineStyle !== 'none') props.push(['outline-color', cs.outlineColor]);
            for (const s of ['top', 'right', 'bottom', 'left']) if (parseFloat(cs.getPropertyValue(`border-${s}-width`)) > 0) props.push([`border-${s}-color`, cs.getPropertyValue(`border-${s}-color`)]);
            for (const [p, v] of props) if (v === a || v === b) out.push(`${el.tagName.toLowerCase()}${el.getAttribute('data-kind') ? `[${el.getAttribute('data-kind')}]` : ''}.${(el.getAttribute('class') ?? '').toString()} ${p}`);
          }
          return out;
        }, [request, response] as const);
        expect(hits, hits.join('\n')).toHaveLength(11);
        for (const h of hits) expect(h).toMatch(/^li\[(request|response)\]\.\s*border-left-color$/);
      });

      test('12: no link on Home is the blue link colour, and each is underlined in a visible colour', async ({ page }) => {
        await b20Home(page);
        const blue = await b20Tok(page, 'link');
        const links = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLAnchorElement>('main a')].map((a) => {
            const cs = getComputedStyle(a);
            return { text: a.textContent!.trim().slice(0, 30), btn: a.classList.contains('btn'), color: cs.color, line: cs.textDecorationLine, decoration: cs.textDecorationColor, where: a.closest('.demo__pane') === null ? 'page' : 'pane' };
          }),
        );
        expect(links.length).toBeGreaterThan(8);
        for (const l of links) {
          expect(l.color, `${l.text} is ink, not the link blue`).not.toBe(blue);
          if (!l.btn) {
            expect(l.line, `${l.text} is underlined`).toContain('underline');
            expect(l.decoration, `${l.text}'s underline shows`).not.toBe('rgba(0, 0, 0, 0)');
          }
        }
        // Hovering a track's title turns its underline to the link's own colour, not the orange.
        await page.locator('main .leg h3 a').first().scrollIntoViewIfNeeded();
        await page.locator('main .leg h3 a').first().hover();
        const title = page.locator('main .leg h3 a').first();
        await expect.poll(async () => (await b20Css(title, 'text-decoration-color')) === (await b20Css(title, 'color'))).toBe(true);
      });

      test('13: an answer picked is pressed in; the right one’s ring is filled with a tick, a wrong one’s holds a dot', async ({ page }) => {
        await b20Home(page);
        await b20Pick(page, 'demo-practice');
        const card = await b20Tok(page, 'cs-card');
        const quiet = await b20Tok(page, 'cs-quiet');
        const edge = await b20Tok(page, 'cs-edge');
        const done = await b20Tok(page, 'cs-done');
        const pick = (n: number) => page.locator(`main .demo__pick[for="demo-a${n}"]`);
        const feedback = (n: number) => page.locator(`main .demo__why--${n}`);
        await pick(2).click();
        await expect.poll(() => b20Css(pick(2), 'transform')).toBe('matrix(1, 0, 0, 1, 2, 2)');
        expect(await b20Css(pick(2), 'box-shadow')).toBe(`${edge} 1px 1px 0px 0px`);
        expect(await b20Css(pick(2), 'background-color')).toBe(quiet);
        expect(await b20Css(pick(2), 'background-color', '::before'), 'a wrong answer’s ring is not green').toBe(card);
        expect(await b20Css(pick(2), 'width', '::after')).toBe('8px');
        expect(await b20Css(pick(2), 'height', '::after')).toBe('8px');
        expect(await b20Css(pick(2), 'border-top-left-radius', '::after')).toBe('50%');
        expect(await b20Css(pick(2), 'background-color', '::after')).toBe(edge);
        expect(await b20Css(feedback(2), 'border-left-width')).toBe('5px');
        expect(await b20Css(feedback(2), 'border-left-color')).toBe(edge);
        expect(await b20Css(feedback(2), 'background-color')).toBe(quiet);
        // The unpicked keep the offset edge and no transform.
        for (const n of [1, 3]) {
          expect(await b20Css(pick(n), 'box-shadow')).toBe(`${edge} 3px 3px 0px 0px`);
          expect(await b20Css(pick(n), 'transform')).toBe('none');
        }
        await pick(1).click();
        await expect.poll(() => b20Css(pick(1), 'transform')).toBe('matrix(1, 0, 0, 1, 2, 2)');
        expect(await b20Css(pick(1), 'background-color', '::before')).toBe(done);
        expect(await b20Css(pick(1), 'border-top-color', '::before')).toBe(done);
        // The tick's 2.5px line is drawn at 2px on a screen of one pixel a pixel: a border is rounded down to whole device pixels.
        expect(await b20Css(pick(1), 'border-left-width', '::after')).toBe('2px');
        expect(await b20Css(pick(1), 'border-bottom-width', '::after')).toBe('2px');
        expect(await b20Css(pick(1), 'border-left-color', '::after')).toBe(card);
        expect(await b20Css(pick(1), 'transform', '::after')).not.toBe('none');
        expect(await b20Css(feedback(1), 'border-left-color')).toBe(done);
        expect(await b20Css(pick(2), 'transform'), 'the wrong one springs back').toBe('none');
      });

      test('14: every figure has no glow, no rings and no fade-in; the lit way is the here colour; the shared gradients are lit with it', async ({ page }) => {
        await b20Home(page);
        const card = await b20Tok(page, 'cs-card');
        const here = await b20Tok(page, 'cs-here');
        const figs = page.locator('main svg.lm-svg');
        expect(await figs.count()).toBe(5);
        const read = await figs.evaluateAll((els) => els.map((el) => { const cs = getComputedStyle(el); return [cs.getPropertyValue('--pool-op').trim(), cs.getPropertyValue('--halo-op').trim(), cs.animationName, cs.getPropertyValue('--fig-bg').trim()]; }));
        for (const [pool, halo, anim] of read) { expect(pool).toBe('0'); expect(halo).toBe('0'); expect(anim).toBe('none'); }
        // --fig-bg is the card's token, whatever it resolves to.
        expect(await page.evaluate(() => { const i = document.createElement('i'); i.style.backgroundColor = 'var(--fig-bg)'; document.querySelector('main')!.append(i); const c = getComputedStyle(i).backgroundColor; i.remove(); return c; })).toBe(card);
        for (const display of await page.locator('main .lm-orbit, main .nm-glow').evaluateAll((els) => els.map((el) => getComputedStyle(el).display))) expect(display).toBe('none');
        expect(await page.locator('main .lm-orbit').count()).toBeGreaterThan(0);
        expect(await page.locator('main .nm-glow').count()).toBeGreaterThan(0);
        for (const filter of await page.locator('main .lm-led.on').evaluateAll((els) => els.map((el) => getComputedStyle(el).filter))) expect(filter).toBe('none');
        // The anatomy tint wins over lumen.css in this theme (the dark one reads the media query or data-theme, whichever the browser took).
        const tint = await figs.first().evaluate((el) => { const cs = getComputedStyle(el); const paper = document.createElement('i'); paper.style.color = 'var(--anatomy-paper)'; el.append(paper); const p = getComputedStyle(paper).color; paper.remove(); return { hi: cs.getPropertyValue('--anatomy-hi').trim(), face: cs.getPropertyValue('--anatomy-face').trim(), weight: parseFloat(cs.getPropertyValue('--anatomy-weight')), paper: p }; });
        expect(tint).toEqual(cfg.scheme === 'light' ? { hi: '#12171b', face: '#fff', weight: 0.9, paper: card } : { hi: '#f3f5f6', face: '#1f2428', weight: 0.9, paper: card });
        // The lit parts of the track covers and `inside` share the gradients in .lm-defs, outside main.
        expect(await page.locator('.lm-defs stop.la').first().evaluate((el) => getComputedStyle(el).stopColor)).toBe(here);
        if (!phone) {
          await b20Pick(page, 'demo-s3');
          const trail = page.locator('main .home-trail[data-step="3"]');
          await expect.poll(() => b20Css(trail, 'stroke')).toBe(here);
          expect(await b20Css(trail, 'stroke-width')).toBe('3.5px');
          expect(await b20Css(trail, 'filter')).toBe('none');
        }
      });

      test('14: the figures’ tint is the page’s own: a lesson page keeps its glow, its fade-in and its gradients', async ({ page }) => {
        // Home's re-tint must not leak. (Run once per window; the lesson page is Patch's.)
        await page.goto('/how-the-internet-works/what-is-http');
        await page.evaluate(() => document.fonts.ready);
        expect(await page.locator('.lm-defs stop.la').first().evaluate((el) => getComputedStyle(el).stopColor)).toBe(cfg.scheme === 'light' ? 'rgb(255, 196, 143)' : 'rgb(255, 211, 168)');
        const lesson = page.locator('main svg.lm-svg').first();
        expect(await lesson.evaluate((el) => getComputedStyle(el).animationName)).toBe('lm-draw-in');
        expect(await page.locator('main .nm-trail').first().evaluate((el) => getComputedStyle(el).filter)).toContain('drop-shadow');
        expect(await page.evaluate(() => getComputedStyle(document.querySelector('main')!).getPropertyValue('--fig-bg').trim())).toBe(cfg.scheme === 'light' ? '#eef1f1' : '#0d1012');
      });
    });
  }
});

// ---- the colour of what is read, and the pairs §8 names ----

/** rgb()/rgba()/color(srgb) as [r, g, b, a]. */
const b20Parse = (c: string): [number, number, number, number] => {
  const m = /^rgba?\(([^)]+)\)$/.exec(c);
  if (m !== null) {
    const v = m[1]!.split(/[ ,/]+/).map(Number);
    return [v[0]!, v[1]!, v[2]!, v[3] ?? 1];
  }
  const s = /^color\(srgb ([^)]+)\)$/.exec(c)!;
  const v = s[1]!.split(/[ /]+/).map(Number);
  return [Math.round(v[0]! * 255), Math.round(v[1]! * 255), Math.round(v[2]! * 255), v[3] ?? 1];
};
const b20Lum = ([r, g, b]: number[]): number => {
  const f = (v: number): number => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!);
};
const b20Ratio = (a: number[], b: number[]): number => {
  const [hi, lo] = [b20Lum(a), b20Lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};
const b20Over = (fg: number[], bg: number[]): number[] => [0, 1, 2].map((i) => Math.round(fg[i]! * fg[3]! + bg[i]! * (1 - fg[3]!)));

/**
 * Every displayed, visible text of `main` outside the drawings, with its colour and the colour behind it: found by walking up
 * and compositing, and inside the demo the card's paper (the card is a pseudo-element, so there is no element to find).
 */
const b20Texts = (page: Page, cardColor: string, groundColor: string) =>
  page.evaluate(
    ([card, ground]) => {
      const parse = (c: string): number[] => {
        const m = /^rgba?\(([^)]+)\)$/.exec(c);
        if (m !== null) { const v = m[1]!.split(/[ ,/]+/).map(Number); return [v[0]!, v[1]!, v[2]!, v[3] ?? 1]; }
        const s = /^color\(srgb ([^)]+)\)$/.exec(c)!;
        const v = s[1]!.split(/[ /]+/).map(Number);
        return [Math.round(v[0]! * 255), Math.round(v[1]! * 255), Math.round(v[2]! * 255), v[3] ?? 1];
      };
      const over = (fg: number[], bg: number[]): number[] => [0, 1, 2].map((i) => fg[i]! * fg[3]! + bg[i]! * (1 - fg[3]!)).concat([1]);
      const lum = ([r, g, b]: number[]): number => { const f = (v: number): number => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!); };
      const backdrop = (el: Element): number[] => {
        const layers: number[][] = [];
        let base = parse(ground!);
        for (let node: Element | null = el; node !== null; node = node.parentElement) {
          if (node.classList.contains('demo')) { base = parse(card!); break; }
          const bg = parse(getComputedStyle(node).backgroundColor);
          if (bg[3]! > 0) layers.push(bg);
          if (bg[3]! >= 1) { layers.pop(); base = bg; break; }
        }
        return layers.reduceRight((under, layer) => over(layer, under), base);
      };
      const out: { text: string; ratio: number; size: string }[] = [];
      const seen = new Set<Element>();
      const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n !== null; n = walker.nextNode()) {
        const el = n.parentElement!;
        if (seen.has(el) || (n.textContent ?? '').trim() === '' || el.closest('svg, style, script') !== null) continue;
        const cs = getComputedStyle(el);
        if (el.getClientRects().length === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
        seen.add(el);
        const bg = backdrop(el);
        const fg = over(parse(cs.color), bg);
        const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x) as [number, number];
        out.push({ text: (n.textContent ?? '').trim().slice(0, 40), ratio: (a + 0.05) / (b + 0.05), size: cs.fontSize });
      }
      return out;
    },
    [cardColor, groundColor] as const,
  );

test.describe('B20: contrast, sizes and the page at every width', () => {
  for (const cfg of B20_CFGS) {
    const phone = cfg.width === 375;
    test.describe(`${cfg.width}x${cfg.height}, ${cfg.scheme}`, () => {
      test.use({ viewport: { width: cfg.width, height: cfg.height }, colorScheme: cfg.scheme, isMobile: false, hasTouch: false });

      test('16: every word on the page is at least 4.5:1 against what is behind it, in Watch, Learn and Practice with a wrong pick', async ({ page }) => {
        await b20Home(page);
        const card = await b20Tok(page, 'cs-card');
        const ground = await b20Tok(page, 'ground');
        const states: [string, () => Promise<void>][] = [
          ['Watch, step 1', async () => undefined],
          ['Watch, step 3', () => b20Pick(page, 'demo-s3')],
          ['Learn', () => b20Pick(page, 'demo-learn')],
          ['Practice, a wrong pick', async () => { await b20Pick(page, 'demo-practice'); await b20Pick(page, 'demo-a2'); }],
        ];
        for (const [name, set] of states) {
          await set();
          const texts = await b20Texts(page, card, ground);
          expect(texts.length, name).toBeGreaterThan(20);
          for (const t of texts) expect(t.ratio, `${name}: "${t.text}" (${t.size})`).toBeGreaterThanOrEqual(4.5);
        }
      });

      test('16: the pairs of §8 hold their figures (to 0.05): the filled button, the sub-line, the chip, the marker, the tick, the bars and the edge', async ({ page }) => {
        await b20Home(page);
        const t = async (n: string) => b20Parse(await b20Tok(page, n));
        const [cardColor, groundColor] = await Promise.all(['cs-card', 'ground'].map(t));
        // A colour with some alpha is read as drawn: over the paper (the ground for the edge).
        const drawn = async (n: string, under: number[]) => b20Over(await t(n), under);
        const [act, actInk, here, muted, done, request, response] = await Promise.all(['cs-act', 'cs-act-ink', 'cs-here', 'muted', 'cs-done', 'cs-request', 'cs-response'].map((n) => drawn(n, cardColor!)));
        const edge = await drawn('cs-edge', groundColor!);
        const card = cardColor;
        const ground = groundColor;
        const row = b20Over(await t('cs-here-wash'), card!);
        const light = cfg.scheme === 'light';
        const want: [string, number, number][] = [
          ['filled button: words on fill', b20Ratio(actInk!, act!), light ? 5.62 : 6.4],
          ['step sub-line on the wash', b20Ratio(muted!, row), light ? 5.22 : 5.15],
          ['here chip against its row', b20Ratio(here!, row), light ? 4.7 : 4.73],
          ['here marker against its tab', b20Ratio(here!, card!), light ? 5.42 : 5.64],
          ['done tick on paper', b20Ratio(done!, card!), light ? 4.64 : 9.17],
          ['request bar on a card', b20Ratio(request!, card!), light ? 5.62 : 6.83],
          ['response bar on a card', b20Ratio(response!, card!), light ? 7.12 : 7.34],
          ['card edge on the ground', b20Ratio(edge!, ground!), light ? 14.51 : 11.59],
        ];
        for (const [name, got, figure] of want) expect(got, name).toBeGreaterThanOrEqual(figure - 0.05);
      });

      test('31 and 32: the demo’s height through its states, and the touch sizes', async ({ page }) => {
        await b20Home(page);
        const demo = page.locator('main .demo');
        if (!phone) {
          const heights: [string, number][] = [['demo-s1', 625], ['demo-s2', 685], ['demo-s3', 750], ['demo-s4', 762], ['demo-s5', 790], ['demo-learn', 745], ['demo-practice', 555]];
          for (const [id, want] of heights) {
            await b20Pick(page, id);
            expect(Math.abs((await b20Rect(demo)).height - want), `${id}: ${want}`).toBeLessThanOrEqual(2);
          }
        } else {
          await b20Pick(page, 'demo-watch');
          await b20Pick(page, 'demo-s1');
          for (let i = 0; i < 3; i += 1) expect(Math.abs((await b20Rect(page.locator('main .demo__parts label').nth(i))).height - (i === 0 ? 52 : 46)), `tab ${i}`).toBeLessThanOrEqual(0.5);
          for (let i = 1; i <= 5; i += 1) expect(Math.abs((await b20Rect(page.locator(`main .demo__row[for="demo-s${i}"] .demo__n`))).height - 46), `tile ${i}`).toBeLessThanOrEqual(0.5);
          expect((await b20Rect(page.locator('main .demo__next:visible'))).height).toBeGreaterThanOrEqual(48);
          await b20Pick(page, 'demo-learn');
          expect((await b20Rect(page.locator('main .demo__more > summary'))).height).toBeGreaterThanOrEqual(44);
          await page.locator('main .demo__more > summary').click();
          for (const h of await page.locator('main .demo__src a:visible').evaluateAll((a) => a.map((el) => el.getBoundingClientRect().height))) expect(h).toBeGreaterThanOrEqual(44);
          await b20Pick(page, 'demo-practice');
          for (let i = 1; i <= 3; i += 1) expect((await b20Rect(page.locator(`main .demo__pick[for="demo-a${i}"]`))).height, `answer ${i}`).toBeGreaterThanOrEqual(48);
        }
      });
    });
  }

  for (const scheme of ['light', 'dark'] as const) {
    for (const width of [320, 375, 768, 1440]) {
      test.describe(`17: ${width}px wide, ${scheme}`, () => {
        test.use({ viewport: { width, height: width === 1440 ? 900 : 800 }, colorScheme: scheme, isMobile: false, hasTouch: false });
        test('there is no sideways scroll at the top and the foot of the page, in Watch, Learn with its sources open, and Practice', async ({ page }) => {
          await b20Home(page);
          const wide = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          const sweep = async (name: string) => {
            await b20Scroll(page, 0);
            expect(await wide(), `${name}, top`).toBe(0);
            await b20Scroll(page, 99999);
            expect(await wide(), `${name}, foot`).toBe(0);
          };
          await sweep('Watch');
          await b20Pick(page, 'demo-learn');
          await page.locator('main .demo__more > summary').click();
          await sweep('Learn, sources open');
          if (width === 320) {
            const edge = await page.evaluate(() => document.querySelector('main .demo')!.getBoundingClientRect().right);
            const past = await page.evaluate((e) => [...document.querySelectorAll('.demo__src a, .demo__src .stamp, .demo__src summary')].filter((el) => el.getBoundingClientRect().right > e + 0.5).length, edge);
            expect(past, 'nothing in the sources reaches past the card').toBe(0);
          }
          await b20Pick(page, 'demo-practice');
          await b20Pick(page, 'demo-a1');
          await sweep('Practice');
        });
      });
    }
  }

  for (const width of [375, 390]) {
    for (const scheme of ['light', 'dark'] as const) {
      test.describe(`18: ${width}px, ${scheme}`, () => {
        test.use({ viewport: { width, height: 844 }, colorScheme: scheme, isMobile: false, hasTouch: false });
        test('every card’s edge is 14px from the screen’s and the first words inside it start at 32px', async ({ page }) => {
          await b20Home(page);
          const lefts = await page.evaluate(() => {
            return {
              demo: document.querySelector('main .demo')!.getBoundingClientRect().left,
              legs: [...document.querySelectorAll('main .leg')].map((e) => e.getBoundingClientRect().left),
              facts: document.querySelector('main .facts__grid')!.getBoundingClientRect().left,
              close: document.querySelector('main .close__grid')!.getBoundingClientRect().left,
              words: {
                demo: document.querySelector('main .demo__key b')!.getBoundingClientRect().left,
                legs: [...document.querySelectorAll('main .leg h3 a')].map((e) => e.getBoundingClientRect().left),
                facts: document.querySelector('main .facts h2')!.getBoundingClientRect().left,
                close: document.querySelector('main .close h2')!.getBoundingClientRect().left,
              },
            };
          });
          for (const x of [lefts.demo, ...lefts.legs, lefts.facts, lefts.close]) expect(Math.abs(x - 14)).toBeLessThanOrEqual(1);
          for (const x of [lefts.words.demo, ...lefts.words.legs, lefts.words.facts, lefts.words.close]) expect(Math.abs(x - 32)).toBeLessThanOrEqual(1);
        });
      });
    }
  }

  for (const scheme of ['light', 'dark'] as const) {
    test.describe(`19: 1440x900 at the top, ${scheme}`, () => {
      test.use({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, isMobile: false, hasTouch: false });
      test('the tabs and at least 280px of the demo card are on screen', async ({ page }) => {
        await b20Home(page);
        const tab = await b20Rect(page.locator('main .demo__parts label').first());
        const demo = await b20Rect(page.locator('main .demo'));
        expect(await page.evaluate(() => scrollY)).toBe(0);
        expect(tab.top).toBeGreaterThanOrEqual(69);
        expect(tab.bottom).toBeLessThanOrEqual(900);
        expect(900 - (demo.top + 50), 'the card on screen').toBeGreaterThanOrEqual(280);
      });
    });
  }
});

// ---- D16's fixes in D17: the phone's key, the page that stays put, the keyboard ----

test.describe('B20: the phone’s key and leaders, the drawn callouts (cases 20 and 21)', () => {
  for (const scheme of ['light', 'dark'] as const) {
    for (const size of [{ width: 375, height: 812, min: 0.55 }, { width: 320, height: 640, min: 0.46 }]) {
      test.describe(`${size.width}px, ${scheme}`, () => {
        test.use({ viewport: { width: size.width, height: size.height }, colorScheme: scheme, isMobile: false, hasTouch: false });

        test('20: the key is ten texts at 12px or more in the drawing’s order, with four leaders; the drawn callouts are gone; the drawing is big enough', async ({ page }) => {
          await b20Home(page);
          const read = await page.evaluate(() => {
            const shown = [...document.querySelectorAll<HTMLElement>('.demo__key b, .demo__key .demo__addr, .demo__key span:not(.demo__addr), .demo__key i')].filter((el) => !el.parentElement!.classList.contains('demo__addr') && el.getClientRects().length > 0);
            const order = [...document.querySelectorAll('.demo__key .demo__call')].flatMap((c) => [...c.children].map((el) => el.textContent!.replace(/\s+/g, ' ').trim()));
            return {
              sizes: shown.map((el) => [el.textContent!.trim(), parseFloat(getComputedStyle(el).fontSize)] as const),
              order,
              calls: document.querySelectorAll('.demo__call').length,
              leaders: [...document.querySelectorAll('.home-leads path')].filter((p) => p.getClientRects().length > 0).length,
              drawn: [...document.querySelectorAll('.demo__scene .nm-call')].map((g) => getComputedStyle(g).display),
              scale: document.querySelector('.demo__crop > svg')!.getBoundingClientRect().width / 685,
              keyDisplay: [...document.querySelectorAll('.demo__key')].map((k) => getComputedStyle(k).display),
            };
          });
          expect(read.order).toEqual(['Your laptop', '192.168.1.100', 'Wants example.net', 'DNS resolver', 'turns names into numbers', '192.0.2.53', 'The internet', 'routers pass messages along', 'Web server', '203.0.113.80 · port 80']);
          expect(read.sizes.length).toBeGreaterThanOrEqual(10);
          for (const [text, size12] of read.sizes) expect(size12, text).toBeGreaterThanOrEqual(12);
          expect(read.calls).toBe(4);
          expect(read.leaders).toBe(4);
          expect(read.drawn.length).toBeGreaterThan(0);
          for (const d of read.drawn) expect(d).toBe('none');
          expect(read.scale, 'the drawing’s px a unit').toBeGreaterThanOrEqual(size.min);
          for (const d of read.keyDisplay) expect(d).toBe('grid');
        });

        test('20: at each step every lit way, every busy part and the page on the laptop are inside the crop', async ({ page }) => {
          test.skip(size.width === 320, 'measured at 375 (D16 check 4)');
          await b20Home(page);
          for (let n = 1; n <= 5; n += 1) {
            await b20Pick(page, `demo-s${n}`);
            await page.waitForTimeout(260);
            const r = await page.evaluate(() => {
              const crop = document.querySelector('.demo__crop')!.getBoundingClientRect();
              // The busy parts are glows, which this look switches off (display: none): a part that draws nothing has no box to hold.
              const lit = [...document.querySelectorAll<SVGGraphicsElement | HTMLElement>('.demo__crop .home-trail, .demo__crop [id*="busy"], .demo__crop #nm-page, .demo__crop .lm-body')].filter((el) => Number(getComputedStyle(el).opacity) > 0.5 && el.getClientRects().length > 0);
              return { crop: [crop.left, crop.top, crop.right, crop.bottom], lit: lit.map((el) => { const b = el.getBoundingClientRect(); return [el.id || el.getAttribute('data-step') || el.getAttribute('class'), b.left, b.top, b.right, b.bottom] as const; }) };
            });
            expect(r.lit.length, `something is lit at step ${n}`).toBeGreaterThanOrEqual(n === 1 ? 1 : 2);
            for (const [name, l, t, rr, bb] of r.lit) {
              expect(l, `${name} at step ${n}`).toBeGreaterThanOrEqual(r.crop[0]! - 0.5);
              expect(t, `${name} at step ${n}`).toBeGreaterThanOrEqual(r.crop[1]! - 0.5);
              expect(rr, `${name} at step ${n}`).toBeLessThanOrEqual(r.crop[2]! + 0.5);
              expect(bb, `${name} at step ${n}`).toBeLessThanOrEqual(r.crop[3]! + 0.5);
            }
          }
        });

        test('20: each leader lands on its label', async ({ page }) => {
          await b20Home(page);
          const r = await page.evaluate(() => {
            const calls = [...document.querySelectorAll('.demo__call')].map((c) => { const b = c.getBoundingClientRect(); return { left: b.left, right: b.right, end: c.classList.contains('demo__call--end'), name: c.querySelector('b')!.textContent! }; });
            const leaders = [...document.querySelectorAll('.home-leads path')].map((p) => { const b = p.getBoundingClientRect(); return b.left; });
            return { calls, leaders };
          });
          expect(r.leaders).toHaveLength(4);
          r.calls.forEach((c, i) => {
            const x = r.leaders[i]!;
            expect(x, `${c.name}'s leader`).toBeGreaterThanOrEqual(c.left - 0.5);
            expect(x, `${c.name}'s leader`).toBeLessThanOrEqual(c.right + (c.end ? 8 : 0.5));
          });
        });
      });
    }
  }

  test.describe('1440: the key is off and the callouts are drawn, 12px or more', () => {
    for (const scheme of ['light', 'dark'] as const) {
      test(`20: the drawn callout names are at least 12px on screen (${scheme}), and the breakpoint is 860`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.emulateMedia({ colorScheme: scheme });
        await b20Home(page);
        const read = await page.evaluate(() => ({
          key: [...document.querySelectorAll('.demo__key')].map((k) => getComputedStyle(k).display),
          names: [...document.querySelectorAll<SVGTextElement>('.demo__scene .nm-call .nm-name')].filter((t) => ['Your laptop', 'DNS resolver', 'The internet', 'Web server'].includes(t.textContent!)).map((t) => ({ name: t.textContent, size: parseFloat(getComputedStyle(t).fontSize) * t.getScreenCTM()!.a, shown: getComputedStyle(t.closest('.nm-call')!).display })),
        }));
        expect(read.key).toEqual(['none', 'none']);
        expect(read.names).toHaveLength(4);
        for (const n of read.names) { expect(n.shown).not.toBe('none'); expect(n.size, n.name!).toBeGreaterThanOrEqual(12); }
        for (const [width, key] of [[861, 'none'], [860, 'grid']] as const) {
          await page.setViewportSize({ width, height: 900 });
          expect(await page.evaluate(() => getComputedStyle(document.querySelector('.demo__key')!).display), `${width}px`).toBe(key);
          expect(await page.evaluate(() => getComputedStyle(document.querySelector('.demo__scene .nm-call')!).display) === 'none', `${width}px: the drawn callouts`).toBe(key === 'grid');
        }
      });
    }
  });

  test.describe('9: at 861 and above the tabs stand clear of the heading and its line', () => {
    for (const width of [861, 960, 1024, 1280, 1920]) {
      test(`the tabs do not touch “Try one” or its intro at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await b20Home(page);
        const r = await page.evaluate(() => {
          const box = (el: Element) => { const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
          const range = (el: Element) => { const rg = document.createRange(); rg.selectNodeContents(el); return [...rg.getClientRects()].map((b) => ({ l: b.left, t: b.top, r: b.right, b: b.bottom })); };
          return { tabs: [...document.querySelectorAll('.demo__parts label')].map(box), text: [...range(document.querySelector('.try__head h2')!), ...range(document.querySelector('.try__head p')!)], head: box(document.querySelector('.try__head')!), wrap: box(document.querySelector('.try')!) };
        });
        for (const tab of r.tabs) for (const t of r.text) expect(tab.l >= t.r || tab.r <= t.l || tab.t >= t.b || tab.b <= t.t, 'a tab overlaps the heading text').toBe(true);
        expect(Math.round((r.head.r - r.head.l) / (r.wrap.r - r.wrap.l - 64) * 100)).toBeGreaterThanOrEqual(56);
        expect(Math.round((r.head.r - r.head.l) / (r.wrap.r - r.wrap.l - 64) * 100)).toBeLessThanOrEqual(58);
      });
    }
  });
});

test.describe('B20: a tap or a click moves nothing (cases 22 to 26)', () => {
  /** A real pointer click at the middle of an element, not a locator click with its own scroll into view. */
  const tapAt = async (page: Page, loc: Locator): Promise<void> => {
    await b20Settle(page);
    // Only an element out of the window (or under the header) is scrolled to: the taps of cases 22 to 26 are all on screen, so they move nothing.
    await loc.evaluate((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight + 0.5) el.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
    const b = (await loc.boundingBox())!;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  };
  const say = (page: Page) => page.locator('main .demo__say:visible');
  const y = async (page: Page): Promise<number> => {
    await b20Settle(page);
    return page.evaluate(() => window.scrollY);
  };

  for (const width of [375, 390]) {
    for (const scheme of ['light', 'dark'] as const) {
      for (const scripts of [true, false]) {
        if (!scripts && (width === 390 || scheme === 'dark')) continue;
        test.describe(`${width}x812, ${scheme}${scripts ? '' : ', JavaScript off'}`, () => {
          test.use({ viewport: { width, height: width === 375 ? 812 : 844 }, colorScheme: scheme, isMobile: false, hasTouch: false, javaScriptEnabled: scripts });

          test('22: four Nexts, Learn, Practice, an answer and the Watch tab move the page not at all, and leave the narration and Next in view', async ({ page }) => {
            const h = width === 375 ? 812 : 844;
            await b20Home(page, scripts);
            await b20DemoAt(page, 70);
            const start = await y(page);
            for (let i = 1; i <= 4; i += 1) {
              await tapAt(page, page.locator('main .demo__next:visible'));
              await expect(page.locator(`#demo-s${i + 1}`)).toBeChecked();
              expect(await y(page), `after Next ${i}`).toBe(start);
              const say1 = await b20Rect(say(page));
              const next = await b20Rect(page.locator('main .demo__next:visible'));
              expect(say1.top, `the narration after Next ${i}`).toBeGreaterThanOrEqual(69);
              expect(say1.top).toBeLessThanOrEqual(h);
              expect(next.top).toBeGreaterThanOrEqual(69);
              expect(next.bottom).toBeLessThanOrEqual(h);
            }
            await tapAt(page, page.locator('main .demo__next:visible'));
            await expect(page.locator('#demo-learn')).toBeChecked();
            expect(await y(page), 'after Go to Learn').toBe(start);
            await tapAt(page, page.locator('main .demo__next:visible'));
            await expect(page.locator('#demo-practice')).toBeChecked();
            expect(await y(page), 'after Go to Practice').toBe(start);
            await tapAt(page, page.locator('main .demo__pick').nth(2));
            await expect(page.locator('#demo-a3')).toBeChecked();
            expect(await y(page), 'after the third answer').toBe(start);
            await tapAt(page, page.locator('main .demo__parts label[for="demo-watch"]'));
            await expect(page.locator('#demo-watch')).toBeChecked();
            expect(await y(page), 'after the Watch tab').toBe(start);
          });

          test('23 and 24: a tile checks its step and moves nothing; Next with the narration under the header brings it back clear of it', async ({ page }) => {
            const h = width === 375 ? 812 : 844;
            await b20Home(page, scripts);
            await b20DemoAt(page, 70);
            const start = await y(page);
            await tapAt(page, page.locator('main .demo__row[for="demo-s4"] .demo__n'));
            await expect(page.locator('#demo-s4')).toBeChecked();
            expect(await y(page)).toBe(start);
            const top = (await b20Rect(say(page))).top;
            expect(top).toBeGreaterThanOrEqual(69);
            expect(top).toBeLessThanOrEqual(h);
            // Back to step 1, the narration's top at y 40 (under the header), then Next.
            await tapAt(page, page.locator('main .demo__row[for="demo-s1"] .demo__n'));
            const say1 = await page.evaluate(() => document.querySelector('.demo__say--1')!.getBoundingClientRect().top + window.scrollY);
            await b20Scroll(page, say1 - 40);
            await tapAt(page, page.locator('main .demo__next:visible'));
            await expect(page.locator('#demo-s2')).toBeChecked();
            await b20Settle(page);
            expect((await b20Rect(page.locator('main .demo__say--2'))).top, 'the new narration is clear of the header').toBeGreaterThanOrEqual(69);
          });
        });
      }
    }
  }

  for (const scheme of ['light', 'dark'] as const) {
    test.describe(`25: 375x812, ${scheme}: Next sticks to the window's foot`, () => {
      test.use({ viewport: { width: 375, height: 812 }, colorScheme: scheme, isMobile: false, hasTouch: false });
      test('Watch’s Next and Learn’s Go to Practice are sticky with their bottom at 812 while the card’s end is below', async ({ page }) => {
        await b20Home(page);
        for (const part of ['watch', 'learn']) {
          // At step 4 the card is 974px tall: its end is below the window with its middle at the window's.
          if (part === 'watch') await b20Pick(page, 'demo-s4');
          await b20Pick(page, `demo-${part}`);
          const demoBox = await page.evaluate(() => { const b = document.querySelector('main .demo')!.getBoundingClientRect(); return b.top + scrollY + b.height / 2; });
          await b20Scroll(page, demoBox - 406);
          const nexts = page.locator(`main .demo__pane--${part} > .demo__nexts`);
          expect(await b20Css(nexts, 'position'), part).toBe('sticky');
          const box = await b20Rect(nexts);
          expect(Math.abs(box.bottom - 812), `${part}: the bar's bottom`).toBeLessThanOrEqual(1);
          expect((await b20Rect(page.locator('main .demo'))).bottom, 'the card goes on below the window').toBeGreaterThan(812);
        }
      });
    });
    test.describe(`26: 1440x900, ${scheme}: five Nexts move nothing, and Next is not sticky`, () => {
      test.use({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, isMobile: false, hasTouch: false });
      test('four Next steps and Go to Learn leave scrollY where it was', async ({ page }) => {
        await b20Home(page);
        await b20DemoAt(page, 70);
        const start = await y(page);
        expect(await b20Css(page.locator('main .demo__pane--watch > .demo__nexts'), 'position')).toBe('static');
        for (let i = 1; i <= 5; i += 1) {
          await tapAt(page, page.locator('main .demo__next:visible'));
          await expect(page.locator(i < 5 ? `#demo-s${i + 1}` : '#demo-learn')).toBeChecked();
          expect(await y(page), `after Next ${i}`).toBe(start);
        }
      });
    });
  }
});

test.describe('B20: the keyboard (cases 27 to 30)', () => {
  const tapAt = async (page: Page, loc: Locator): Promise<void> => {
    await b20Settle(page);
    // Only an element out of the window (or under the header) is scrolled to: the taps of cases 22 to 26 are all on screen, so they move nothing.
    await loc.evaluate((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < 70 || r.bottom > innerHeight + 0.5) el.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
    const b = (await loc.boundingBox())!;
    await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
  };
  /** Where the focus is: an input's id, or a link's words. */
  const where = (page: Page): Promise<string> => page.evaluate(() => { const el = document.activeElement as HTMLElement; return el.tagName === 'INPUT' ? el.id : (el.textContent ?? '').replace(/\s+/g, ' ').trim(); });
  const tabs = async (page: Page, n: number, key = 'Tab'): Promise<string[]> => {
    const out: string[] = [];
    for (let i = 0; i < n; i += 1) { await page.keyboard.press(key); out.push(await where(page)); }
    return out;
  };
  const visibleHints = (page: Page): Promise<string[]> => page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.demo__hint')].filter((h) => getComputedStyle(h).display !== 'none').map((h) => h.className.replace('demo__hint ', '')));

  const matrix: { width: number; height: number; scheme: 'light' | 'dark'; scripts: boolean }[] = [];
  for (const [width, height] of [[375, 812], [1440, 900]] as const) for (const scheme of ['light', 'dark'] as const) for (const scripts of [true, false]) matrix.push({ width, height, scheme, scripts });

  for (const m of matrix) {
    const phone = m.width === 375;
    test.describe(`${m.width}x${m.height}, ${m.scheme}${m.scripts ? '' : ', JavaScript off'}`, () => {
      test.use({ viewport: { width: m.width, height: m.height }, colorScheme: m.scheme, isMobile: false, hasTouch: false, javaScriptEnabled: m.scripts });

      test('27: Tab from “HTTP” stops only where something shows: the part, the checked step or answer, then the next link; Shift+Tab walks back', async ({ page }) => {
        await b20Home(page, m.scripts);
        const http = page.locator('main .try__head a');
        const from = async (part: string) => {
          await tapAt(page, page.locator(`main .demo__parts label[for="demo-${part}"]`));
          await http.focus();
        };
        await from('watch');
        expect(await tabs(page, 3)).toEqual(['demo-watch', 'demo-s1', 'How the Internet Works']);
        expect(await tabs(page, 3, 'Shift+Tab')).toEqual(['demo-s1', 'demo-watch', 'HTTP']);
        // A chosen step is the stop.
        await tapAt(page, page.locator('main .demo__row[for="demo-s3"] .demo__n'));
        await http.focus();
        expect(await tabs(page, 2)).toEqual(['demo-watch', 'demo-s3']);
        await from('learn');
        expect(await tabs(page, 2)).toEqual(['demo-learn', 'Lesson 2: HTTPS']);
        expect(await tabs(page, 2, 'Shift+Tab')).toEqual(['demo-learn', 'HTTP']);
        await from('practice');
        expect(await tabs(page, 3)).toEqual(['demo-practice', 'demo-a1', 'Open the whole lesson']);
        expect(await tabs(page, 3, 'Shift+Tab')).toEqual(['demo-a1', 'demo-practice', 'HTTP']);
        await tapAt(page, page.locator('main .demo__pick[for="demo-a2"]'));
        await http.focus();
        expect(await tabs(page, 2)).toEqual(['demo-practice', 'demo-a2']);
      });

      test('28: each radio stop rings what the reader sees, inside the window, with its own hint and no other', async ({ page }) => {
        await b20Home(page, m.scripts);
        const http = page.locator('main .try__head a');
        const ringed = async (sel: string, offset: string) => {
          // With scripts off the page's own smooth scroll is on: let a focus's scroll finish before measuring.
          if (!m.scripts) await page.waitForTimeout(500);
          const el = page.locator(sel);
          expect(await b20Css(el, 'outline-style'), `${sel} is ringed`).toBe('solid');
          expect(await b20Css(el, 'outline-offset'), `${sel}'s ring`).toBe(offset);
          const box = await b20Rect(el);
          expect(box.top, sel).toBeGreaterThanOrEqual(69);
          expect(box.bottom, sel).toBeLessThanOrEqual(m.height);
        };
        const hintOnScreen = async (cls: string) => {
          if (!m.scripts) await page.waitForTimeout(500);
          expect(await visibleHints(page)).toEqual([cls]);
          const box = await b20Rect(page.locator(`main .${cls.replace(' ', '.')}`));
          expect(box.top, `${cls} below the header`).toBeGreaterThanOrEqual(69);
          expect(box.bottom, `${cls} above the window's foot`).toBeLessThanOrEqual(m.height);
        };
        await http.focus();
        expect(await visibleHints(page), 'no keyboard focus in the demo: no hint').toEqual([]);
        await page.keyboard.press('Tab');
        await ringed('main .demo__parts label[for="demo-watch"]', '-7px');
        await hintOnScreen('demo__hint--part');
        await page.keyboard.press('Tab');
        await ringed(phone ? 'main .demo__row[for="demo-s1"] .demo__n' : 'main .demo__row[for="demo-s1"]', '2px');
        await hintOnScreen('demo__hint--step');
        await b20Scroll(page, 0);
        await tapAt(page, page.locator('main .demo__parts label[for="demo-practice"]'));
        await http.focus();
        await page.keyboard.press('Tab');
        await ringed('main .demo__parts label[for="demo-practice"]', '-7px');
        await page.keyboard.press('Tab');
        await ringed('main .demo__pick[for="demo-a1"]', '2px');
        await hintOnScreen('demo__hint--answer');
        // After a pointer click on a tab, a step and an option, no hint shows.
        await tapAt(page, page.locator('main .demo__parts label[for="demo-watch"]'));
        expect(await visibleHints(page)).toEqual([]);
        await tapAt(page, page.locator('main .demo__row[for="demo-s2"] .demo__n'));
        expect(await visibleHints(page)).toEqual([]);
        await tapAt(page, page.locator('main .demo__parts label[for="demo-practice"]'));
        await tapAt(page, page.locator('main .demo__pick[for="demo-a3"]'));
        expect(await visibleHints(page)).toEqual([]);
      });
    });
  }

  for (const size of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
    test.describe(`29 and 30: ${size.width}px`, () => {
      test.use({ viewport: size, isMobile: false, hasTouch: false });

      test('29: a screen reader is offered 5 steps and no answers in Watch, none of either in Learn, and 3 answers in Practice', async ({ page }) => {
        await b20Home(page);
        const counts = async () => [await page.getByRole('radio', { name: /^Watch, step / }).count(), await page.getByRole('radio', { name: /^Answer: / }).count()];
        expect(await counts()).toEqual([5, 0]);
        await b20Pick(page, 'demo-learn');
        expect(await counts()).toEqual([0, 0]);
        await b20Pick(page, 'demo-practice');
        expect(await counts()).toEqual([0, 3]);
      });

      test('30: step 5 and a picked answer survive a change of part, and the page on the laptop stays drawn', async ({ page }) => {
        await b20Home(page);
        const part = (which: 'text' | 'pic') => page.locator(`main svg[data-figure="net-map"] #nm-page [data-part="${which}"]`).first().evaluate((el) => getComputedStyle(el).opacity);
        await b20Pick(page, 'demo-s5');
        await b20Pick(page, 'demo-practice');
        await b20Pick(page, 'demo-a2');
        await expect(page.locator('#demo-s5')).toBeChecked();
        await expect.poll(() => part('text')).toBe('1');
        await expect.poll(() => part('pic')).toBe('1');
        await b20Pick(page, 'demo-watch');
        await expect(page.locator('#demo-s5')).toBeChecked();
        await b20Pick(page, 'demo-practice');
        await expect(page.locator('#demo-a2')).toBeChecked();
        await expect(page.locator('main .demo__why--2')).toBeVisible();
        await expect(page.locator('#demo-s5')).toBeChecked();
        await expect.poll(() => part('text')).toBe('1');
        await expect.poll(() => part('pic')).toBe('1');
      });
    });
  }
});

test.describe('B20: JavaScript off, and the theme paths (cases 5 and 33)', () => {
  for (const size of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
    test.describe(`33: ${size.width}px, scripts off`, () => {
      test.use({ viewport: size, javaScriptEnabled: false, isMobile: false, hasTouch: false });
      test('the demo steps, lights step 2’s way, shows Learn and answers a question', async ({ page }) => {
        await page.goto('/');
        const d = demo(page);
        await d.locator('.demo__next:visible').click();
        await expect(page.locator('#demo-s2')).toBeChecked();
        await expect.poll(() => d.locator('.home-trail[data-step="2"]').evaluate((el) => getComputedStyle(el).opacity)).not.toBe('0');
        await d.locator('.demo__parts label', { hasText: 'Learn' }).click();
        await expect(d.locator('.demo__pane--learn')).toBeVisible();
        await d.locator('.demo__parts label', { hasText: 'Practice' }).click();
        await d.locator('.demo__pick').nth(0).click();
        await expect(d.locator('.demo__why:visible')).toContainText('Right.');
        expect(await b20Css(d.locator('.demo__pick').nth(0), 'background-color', '::before')).toBe(await b20Tok(page, 'cs-done'));
      });
    });
  }

  test.describe('5: the edge in the dark, on every path to it', () => {
    test.describe('dark, JavaScript off: the media query alone', () => {
      test.use({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', javaScriptEnabled: false, isMobile: false, hasTouch: false });
      test('the card edge and the figures’ tint are the dark ones', async ({ page }) => {
        await page.goto('/');
        expect(await page.evaluate(() => document.documentElement.hasAttribute('data-theme'))).toBe(false);
        const edge = await b20Tok(page, 'cs-edge');
        expect(edge).toBe(EDGE.dark);
        for (const side of await b20Sides(page.locator('main .demo'), '::before')) expect(side).toEqual(['2px', 'solid', edge]);
        const tint = await page.locator('main svg.lm-svg').first().evaluate((el) => { const cs = getComputedStyle(el); return [cs.getPropertyValue('--anatomy-hi').trim(), cs.getPropertyValue('--anatomy-face').trim(), cs.getPropertyValue('--anatomy-weight').trim()]; });
        expect([tint[0], tint[1], parseFloat(tint[2]!)]).toEqual(['#f3f5f6', '#1f2428', 0.9]);
        const paper = await page.locator('main svg.lm-svg').first().evaluate((el) => { const i = document.createElement('i'); i.style.color = 'var(--anatomy-paper)'; el.append(i); const c = getComputedStyle(i).color; i.remove(); return c; });
        expect(paper).toBe(await b20Tok(page, 'cs-card'));
      });
    });
    test.describe('light chosen while the system is dark', () => {
      test.use({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', isMobile: false, hasTouch: false });
      test('the edge is the light one', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('techconcepts:theme', 'light'));
        await page.reload();
        expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
        expect(await b20Tok(page, 'cs-edge')).toBe(EDGE.light);
        for (const side of await b20Sides(page.locator('main .demo'), '::before')) expect(side).toEqual(['2px', 'solid', EDGE.light]);
        const tint = await page.locator('main svg.lm-svg').first().evaluate((el) => getComputedStyle(el).getPropertyValue('--anatomy-hi').trim());
        expect(tint).toBe('#12171b');
      });
    });
    test.describe('dark chosen, JavaScript on', () => {
      test.use({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', isMobile: false, hasTouch: false });
      test('the edge is the ink, the tint is the dark one', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.setItem('techconcepts:theme', 'dark'));
        await page.reload();
        expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
        expect(await b20Tok(page, 'cs-edge')).toBe(EDGE.dark);
        expect(await page.locator('main svg.lm-svg').first().evaluate((el) => getComputedStyle(el).getPropertyValue('--anatomy-hi').trim())).toBe('#f3f5f6');
      });
    });
  });
});

test.describe('B20: the cards’ shadow steps from 4px to 6px between 860 and 861px (case 6)', () => {
  for (const [width, stack] of [[860, 4], [861, 6]] as const) {
    test(`6: at ${width}px the demo’s card beneath shows ${stack}px, and so does a track’s`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await b20Home(page);
      const card = await b20Tok(page, 'cs-card');
      const edge = await b20Tok(page, 'cs-edge');
      const want = `${card} ${stack}px ${stack}px 0px -2px, ${edge} ${stack}px ${stack}px 0px 0px`;
      expect(await b20Css(page.locator('main .demo'), 'box-shadow', '::before')).toBe(want);
      expect(await b20Css(page.locator('main .leg').first(), 'box-shadow')).toBe(want);
    });
  }
});
