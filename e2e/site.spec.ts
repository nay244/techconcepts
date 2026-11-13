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
    await expect(page.locator('.console__outline')).toBeVisible();
    await expect(page.locator('.console__explain')).toBeVisible();
    await expect(page.locator('.console__log')).toBeVisible();
  });

  test('a checked lesson says so in its top bar, numbers its sources, and each claim opens the place it cites', async ({ page }) => {
    const osi = LESSONS.find((l) => l.slug === 'osi-model')!;
    await open(page, osi.path);
    const stamp = page.locator('.console__top .stamp');
    await expect(stamp).toHaveText(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}, 6 sources$/);
    await expect(stamp).toHaveAttribute('href', '/about#facts');

    await page.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^What happened and why/ }).click();
    await expect(kicker(page)).toHaveText('Learn');
    const words = page.locator('.console__explain');
    // The sources are at the foot of Learn, in view without opening Go deeper, under the same stamp.
    const foot = words.locator('.explain__foot');
    await expect(foot.locator('.stamp')).toHaveText(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
    const listed = foot.locator('ol.explain__sources > li');
    const count = await listed.count();
    expect((await stamp.textContent())!).toContain(`, ${count} sources`);
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

  test('the header links are Tracks, Glossary, How a lesson works, Sources and About, and the menu lists the same five', async ({ page }) => {
    for (const { path } of SITE_PAGES) {
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
    for (const { path } of SITE_PAGES) {
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
    for (const { path } of SITE_PAGES) {
      await page.setViewportSize({ width: 959, height: 800 });
      await open(page, path);
      await expect(page.locator('.menu-btn'), path).toBeVisible();
      await expect(page.locator('.site-nav'), path).toBeHidden();
      await page.setViewportSize({ width: 960, height: 800 });
      await expect(page.locator('.menu-btn'), path).toBeHidden();
      await expect(page.locator('.site-nav'), path).toBeVisible();
      for (const box of await page.locator('.site-nav a').evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height))) expect(Math.round(box), path).toBe(32);
      const start = page.locator('.site-head .head-end a.btn--primary');
      if (['/tracks', '/networking', INTERNET_TRACK].includes(path)) await expect(start, path).toHaveCount(0);
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
    // The side card was given only HTTP's name tile; UDP's is a copy of the one on UDP's stop.
    await expect(page.locator('main .side .side-now__art svg.name-tile')).toHaveAttribute('aria-label', 'User Datagram Protocol');
    await expect(lessonCard(page, 'what-is-udp').locator('.stop__art svg.name-tile')).toHaveAttribute('aria-label', 'User Datagram Protocol');
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
  /** Plays the current step until the lesson's table has a row the step marked, or the rules show a check. */
  async function played(page: Page, marked: string): Promise<void> {
    await playButton(page).click();
    await expect(page.locator(marked).first()).toBeAttached({ timeout: 15_000 });
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
          await tab(page, 'Table').click();
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
          await playButton(page).click();
          await expect(page.locator('.tpanel tbody tr[data-highlight]').first()).toBeAttached({ timeout: 15_000 });
          await tab(page, 'Table').click();
          expect(await page.locator('.tpanel__table').evaluate((el) => getComputedStyle(el).display)).toBe('table');
          expect(await page.locator('.tpanel').evaluate((el) => el.scrollWidth - el.clientWidth)).toBe(0);
        });

        test('8 and 9: the mark says the table changed until the reader looks; Back and Next keep the tab', async ({ page }) => {
          await goTo(page, bySlug('dhcp').path, 4);
          const table = page.getByRole('button', { name: /^Table/ });
          await expect(table).toHaveAccessibleName('Table');
          await expect(table).not.toHaveAttribute('aria-label');
          await playButton(page).click();
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
          await playButton(page).click();
          await expect(playButton(page)).toContainText(/Play|Resume|Continue/);
          await expect(page.getByRole('button', { name: 'Rules, changed' })).toBeVisible();
          await page.getByRole('button', { name: 'Rules, changed' }).click();
          const seen = await page.evaluate(() => (window as unknown as { __scrolled: string[] }).__scrolled);
          expect(seen.length).toBeGreaterThan(0);
          expect(seen.at(-1)).toContain('Fits → deny');
        });

        test('10 and 11: the log’s values start at one x on every row, and the short ones share the last line', async ({ page }) => {
          await goTo(page, bySlug('dhcp').path, 5);
          await playButton(page).click();
          await expect(page.locator('.console__controls .cbtn--play')).toContainText(/Replay|Watch again|Play/, { timeout: 30_000 });
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
          await playButton(page).click();
          await expect(page.locator('.console__controls .cbtn--play')).toContainText(/Replay|Watch again|Play/, { timeout: 30_000 });
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
          await playButton(page).click();
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
        test('no tabs shown, the table under the scene, the Overview’s stamp only in the top bar', async ({ page }) => {
          await open(page, bySlug('dhcp').path);
          expect(await boxOf(page, '.console__tabs')).toBeNull();
          const scene = (await boxOf(page, '.console__scene'))!;
          expect((await boxOf(page, '.console__stage .tpanel'))!.top).toBeGreaterThanOrEqual(scene.bottom);
          expect(await boxOf(page, '.explain__lead .stamp')).toBeNull();
          if (width === 1440) expect(await boxOf(page, '.console__top .stamp')).not.toBeNull();
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
  async function lessonFoot(page: Page): Promise<{ hrefs: string[]; labels: string[]; stamp: string; top: string }> {
    const context = await page.context().browser()!.newContext({ viewport: { width: 1440, height: 900 } });
    const lesson = await context.newPage();
    try {
      await open(lesson, `${new URL(page.url()).origin}${HTTP_PATH}`);
      const top = squash(await lesson.locator('.console__top .stamp').innerText());
      await lesson.getByRole('navigation', { name: 'This lesson' }).getByRole('button', { name: /^What happened and why/ }).click();
      await expect(kicker(lesson)).toHaveText('Learn');
      const items = lesson.locator('.console__explain .explain__foot ol.explain__sources > li');
      const hrefs = await items.locator('a').evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
      const labels = await items.locator('a').evaluateAll((links) => links.map((a) => a.firstChild?.textContent ?? ''));
      return { hrefs, labels, stamp: squash(await lesson.locator('.console__explain .explain__foot .stamp').innerText()), top };
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
    // The demo clips what overflows it, so the document never widens for the block: nothing in the block may reach past the demo's edge either.
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
          expect(foot.top).toBe(STAMP);
          expect(foot.stamp.startsWith('Checked 11 Nov 2026')).toBe(true);
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
