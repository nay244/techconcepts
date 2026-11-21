// About's words that are worked out from the content, and its analytics sentence, checked in the page's own markup.
// The page is rendered with Astro's container (which needs this file's default node environment, and the React
// renderer for the page's ResetProgress island) and parsed with jsdom. Each expected value is worked out from the same
// sources the page uses, so a value written into the page by hand fails here once the content moves on.
// @ts-expect-error - no @types/node; vitest runs under node
import { existsSync, readFileSync } from 'node:fs';
// @ts-expect-error - no @types/node; vitest runs under node
import { execSync } from 'node:child_process';
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { expect, test, vi } from 'vitest';
import { checkedOn, getEntries, getLesson, trackTotals } from '../content/registry';
import { comingSoonTracks, plannedTracks, tracks } from '../content/tracks';
import { comingTracksSentence, factCheckSentence, sourceRows } from '../lib/about';
import About from '../pages/about.astro';
import { CARD_STACK_GRANT, GLOBAL_GRANT, BASE_LAYOUT_GRANT, COMMENT_ONLY_GRANT, INDEX_GRANT, SITE_HEADER_GRANT, TRACKS_GRANT, TRACK_PAGE_GRANT, cardStackGrant, globalGrant, pageGrant, tracksGrant } from '../lib/card-stack-guards';

// The build's analytics token, which each render here sets for itself.
const analytics = vi.hoisted(() => ({ token: undefined as string | undefined }));
vi.mock('../lib/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/analytics')>()),
  get analyticsToken() {
    return analytics.token;
  },
}));

// The number of source rows the page is given in place of the DHCP lesson's, when a test sets one.
const rows = vi.hoisted(() => ({ count: null as number | null }));
vi.mock('../lib/about', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/about')>();
  return {
    ...actual,
    sourceRows: (sources: Parameters<typeof actual.sourceRows>[0]) =>
      rows.count === null
        ? actual.sourceRows(sources)
        : Array.from({ length: rows.count }, (_, i) => ({ standard: `Standard ${i + 1}`, title: `Title ${i + 1}`, url: `https://example.com/${i + 1}` })),
  };
});

async function about(token?: string): Promise<Document> {
  analytics.token = token;
  rows.count = null;
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  return new JSDOM(await container.renderToString(About)).window.document;
}

const words = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

test('the stats count the tracks planned and the lessons ready from the content', async () => {
  const doc = await about();
  const stat = (label: string): string =>
    words([...doc.querySelectorAll('.stats > div')].find((d) => words(d.querySelector('dt')) === label)?.querySelector('dd'));

  expect(stat('tracks planned')).toBe(String(tracks.length + plannedTracks.length + comingSoonTracks.length));
  // A lesson two tracks list counts once: 20 ready in Networking, 14 in the tour, 4 shared.
  const distinct = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])));
  expect(stat('lessons ready')).toBe(String(distinct.size));
  expect(stat('lessons ready')).toBe('30');
  expect(stat('lessons ready')).not.toBe(String(trackTotals(tracks.flatMap((t) => getEntries(t.id))).available));
  expect(stat('accounts needed')).toBe('0');
});

test('the tracks still to come start with CompTIA A+, the one being written', async () => {
  const doc = await about();
  const sentence = comingTracksSentence([...plannedTracks, ...comingSoonTracks].map((t) => t.title));
  expect(sentence).toContain('CompTIA A+');
  expect(words(doc.querySelector('#what'))).toContain(sentence);
});

test('the facts section says how many lessons have passed the fact-check, and makes no claim about exam tags', async () => {
  const doc = await about();
  const slugs = [...new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : [])))];
  const checked = slugs.filter((slug) => checkedOn(slug) !== null).length;
  const facts = words(doc.querySelector('#facts'));
  expect(facts).toContain('Each lesson lists the standards it draws on under Sources at the end of Learn.');
  expect(facts).toContain(factCheckSentence(checked, slugs.length));
  expect(facts).not.toContain('exams and jobs');
  expect(facts).not.toContain('is checked against the standards');
});

test('the pace note says lessons are self-paced and gives no figure', async () => {
  const doc = await about();
  expect(words(doc.querySelector('.a-note p'))).toBe(
    'Lessons are self-paced. Take as long as you need. This browser remembers where you stopped, so you can pick up where you left off.',
  );
});

test('the analytics sentence is there only when the build was given a token', async () => {
  const sentence = 'The site counts page views with privacy-friendly analytics that use no cookies and know nothing about your progress.';
  const says = (doc: Document): boolean => [...doc.querySelectorAll('#privacy p')].some((p) => words(p) === sentence);

  expect(says(await about())).toBe(false);
  expect(says(await about('   '))).toBe(false);
  expect(says(await about('a-test-token'))).toBe(true);
});

// ---------------------------------------------------------------- Folders (D21b, B27)

const pageText = readFileSync('src/pages/about.astro', 'utf8');
const style = pageText.slice(pageText.indexOf('<style is:global>'));

/** The words of an element with the fold's two summary spans taken out, which are the only new words on the page. */
function wordsWithoutFold(el: Element, also: string[] = []): string {
  const copy = el.cloneNode(true) as Element;
  for (const gone of copy.querySelectorAll(['.a-src__closed', '.a-src__open', ...also].join(','))) gone.remove();
  return words(copy);
}

test('every sentence of today’s page is on the page, in today’s order within its section (check 1)', async () => {
  const today = JSON.parse(readFileSync('src/scripts/about-words.fixture.json', 'utf8')) as Record<string, string>;
  const doc = await about();
  // The list of sections moved into the opening; its words are the only addition there.
  expect(wordsWithoutFold(doc.querySelector('section.a-open')!, ['nav.a-toc'])).toBe(today.opening);
  const ids = [...doc.querySelectorAll('section.a-sec')].map((s) => s.id);
  expect(ids).toEqual(['what', 'lessons', 'facts', 'credits', 'privacy']);
  for (const id of ids) expect(wordsWithoutFold(doc.getElementById(id)!), id).toBe(today[id]);
});

test('the fold’s summary holds exactly its two sets of words, and its list is named for the rows it holds', async () => {
  const doc = await about();
  const summary = doc.querySelector('details.a-src__more > summary')!;
  expect([...summary.children].map((c) => [c.className, words(c)])).toEqual([
    ['a-src__closed', 'Show the other 13'],
    ['a-src__open', 'Hide the other 13'],
  ]);
  expect(doc.querySelector('details.a-src__more > ul')?.getAttribute('aria-label')).toBe('Sources 4 to 16');
});

test('one h1, five h2 that are their sections’ tabs, three h3 in the parts, and the sources’ h3 (check 2)', async () => {
  const doc = await about();
  expect(doc.querySelectorAll('h1')).toHaveLength(1);
  expect(words(doc.querySelector('h1'))).toBe('Watch it happen, then learn its name.');
  const h2s = [...doc.querySelectorAll('main h2')];
  expect(h2s.map(words)).toEqual(['What TechConcepts is', 'How a lesson works', 'Where the facts come from', 'Credits', 'Your progress stays with you']);
  for (const h2 of h2s) {
    expect(h2.classList.contains('cs-tab')).toBe(true);
    const section = h2.parentElement!;
    expect(section.firstElementChild).toBe(h2);
    expect(section.getAttribute('aria-labelledby')).toBe(h2.id);
  }
  expect([...doc.querySelectorAll('ol.a-steps h3')].map(words)).toEqual(['See it happen', 'Get the idea, then the name', 'Check yourself']);
  expect([...doc.querySelectorAll('ol.a-steps .n')].map((n) => [n.innerHTML, words(n)])).toEqual([
    ['<b>1</b> Watch', '1 Watch'],
    ['<b>2</b> Learn', '2 Learn'],
    ['<b>3</b> Practice', '3 Practice'],
  ]);
  expect(words(doc.querySelector('div.a-src h3'))).toBe('Sources in the DHCP lesson');
});

test('the counts are one card of three cells, each its figure after its words in the markup (check 3)', async () => {
  const doc = await about();
  const dl = doc.querySelector('dl.stats')!;
  expect(dl.classList.contains('cs-card')).toBe(true);
  for (const cell of dl.children) expect([...cell.children].map((c) => c.tagName)).toEqual(['DT', 'DD']);
});

test('the list of sections is a card in the opening, after the counts, with five links and no lit one (checks 4, 27)', async () => {
  const doc = await about();
  const side = doc.querySelector('.a-open__side')!;
  expect([...side.children].map((c) => c.tagName + '.' + [...c.classList].join('.'))).toEqual(['DL.stats.cs-card', 'NAV.a-toc.cs-card']);
  const nav = side.querySelector('nav')!;
  expect(nav.getAttribute('aria-label')).toBe('On this page');
  expect(words(nav.querySelector('p.a-toc__h.cs-tab'))).toBe('On this page');
  expect([...nav.querySelectorAll('a')].map((a) => [a.getAttribute('href'), words(a)])).toEqual([
    ['#what', 'What it is'],
    ['#lessons', 'How a lesson works'],
    ['#facts', 'Where the facts come from'],
    ['#credits', 'Credits'],
    ['#privacy', 'Your progress'],
  ]);
  expect(doc.querySelectorAll('[aria-current="location"]')).toHaveLength(0);
});

test('the sources show three rows and fold the rest, the same sources in the same order (check 5)', async () => {
  const doc = await about();
  const facts = doc.querySelector('.a-src')!;
  const shown = [...facts.querySelectorAll(':scope > ul > li')];
  const folded = [...facts.querySelectorAll('details.a-src__more > ul > li')];
  expect(shown).toHaveLength(3);
  expect(folded).toHaveLength(13);
  expect(doc.querySelector('details.a-src__more')?.hasAttribute('open')).toBe(false);
  const today = [...facts.querySelectorAll('a')].map((a) => [a.getAttribute('href'), words(a)]);
  const dhcp = getLesson('dhcp')!;
  const expected = sourceRows(dhcp.units.flatMap((u) => u.references)).map((r) => [r.url, r.title]);
  expect(today).toEqual(expected);
});

test.each([
  [6, 6, 0, null],
  [4, 4, 0, null],
  [7, 3, 4, 'Sources 4 to 7'],
])('with %i sources the page shows %i and folds %i (the number is the list’s length less three, not a figure written in)', async (count, shown, folded, label) => {
  analytics.token = undefined;
  rows.count = count;
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  const doc = new JSDOM(await container.renderToString(About)).window.document;
  rows.count = null;
  expect(doc.querySelectorAll('.a-src > ul > li')).toHaveLength(shown);
  expect(doc.querySelectorAll('details.a-src__more > ul > li')).toHaveLength(folded);
  if (folded === 0) expect(doc.querySelector('details')).toBeNull();
  else {
    expect(words(doc.querySelector('.a-src__closed'))).toBe(`Show the other ${folded}`);
    expect(doc.querySelector('details.a-src__more > ul')?.getAttribute('aria-label')).toBe(label);
  }
});

test('#privacy keeps its order: the words, the table, the analytics sentence, “To start fresh”, the island (check 28)', async () => {
  const doc = await about('a-test-token');
  const keep = doc.querySelector('#privacy .a-keep')!;
  expect([...keep.children].filter((c) => !['SCRIPT', 'STYLE'].includes(c.tagName)).map((c) => (c.tagName === 'ASTRO-ISLAND' ? 'island' : c.tagName === 'P' ? words(c).slice(0, 14) : c.className))).toEqual([
    'TechConcepts r',
    'a-savedbox',
    'The site count',
    'To start fresh',
    'island',
  ]);
  const table = keep.querySelector('.a-savedbox > table.a-saved')!;
  expect(words(table.querySelector('caption'))).toBe('What the site remembers');
  expect([...table.querySelectorAll('tbody tr')].map(words)).toEqual([
    'Which lessons you started and finishedThis browser only',
    'Light or dark themeThis browser only',
    'Your Practice answersNot saved at all',
  ]);
});

test('no script runs on the page but the header’s and the Reset island: the list-lighting script is gone, and so is every mention of it (check 27)', () => {
  const toc = 'src/scripts/about-' + 'toc';
  expect(existsSync(`${toc}.ts`)).toBe(false);
  expect(existsSync(`${toc}.test.ts`)).toBe(false);
  expect(pageText).not.toContain('<script');
  // The two names are split here so this file does not find itself.
  const gone = ['about-' + 'toc', 'follow' + 'Sections'].join('\\|');
  expect((execSync(`git grep -n "${gone}" -- src e2e README.md || true`, { encoding: 'utf8' }) as string).trim()).toBe('');
});

test('the page imports the Card stack stylesheet on the line after site.css (case 0.4)', () => {
  expect(pageText).toMatch(/import '\.\.\/components\/site\.css';\nimport '\.\.\/styles\/card-stack\.css';\n/);
});

test('the page’s styles: the scroll paddings, the open menu’s inside its media query, no blue links, no transition (checks 6, 17)', () => {
  expect(style).toMatch(/html\s*\{[^}]*scroll-behavior:\s*smooth;[^}]*scroll-padding-top:\s*80px;[^}]*scroll-padding-bottom:\s*12px;/);
  expect(style).toMatch(/@media \(max-width: 959px\)\s*\{\s*html:has\(#menu-panel:not\(\[hidden\]\)\)\s*\{\s*scroll-padding-top:\s*403px;/);
  expect(style.match(/403px/g)).toHaveLength(1);
  expect(style).not.toContain('var(--link)');
  expect(style).not.toMatch(/transition/);
  expect(style).not.toMatch(/position:\s*sticky/);
  expect(style).not.toMatch(/\.ab--|\.pt-|\.toc-h|\bcard\b\s*\{/);
});

test('card-stack.css changes only its opening comment (which names About and the Glossary), two reworded comments and the header and footer block (job 24); Home, the track page and the shared files are untouched, and Tracks gains one rule (case 0.1)', () => {
  const run = (cmd: string): string => (execSync(`${cmd} || true`, { encoding: 'utf8' }) as string).trim();
  const g = cardStackGrant('f30e876');
  expect(g.changed, 'lines outside the three comments that are not the old text').toEqual(CARD_STACK_GRANT.changed);
  expect(g.comments, 'the three comments: lines 1 to 4, 6 to 8, 48 to 49').toEqual(CARD_STACK_GRANT.comments);
  expect(g.frame, 'the old length, the blank line, the block begins, the block ends').toEqual(CARD_STACK_GRANT.frame);
  expect(g.markers, 'BEGIN and END once each').toEqual(CARD_STACK_GRANT.markers);
  const t = tracksGrant('f30e876');
  expect(t.hunks, 'one insertion after line 115').toEqual(TRACKS_GRANT.hunks);
  expect(t.removed, 'nothing removed').toEqual(TRACKS_GRANT.removed);
  expect(t.added, 'the track page’s open-menu rule').toEqual(TRACKS_GRANT.added);
  const home = pageGrant('f30e876', 'src/pages/index.astro');
  expect(home.hunks, 'Home: the root padding, the section margin and the demo radios (job 29)').toEqual(INDEX_GRANT.hunks);
  expect(home.removed, 'Home: the lines it lost').toEqual(INDEX_GRANT.removed);
  expect(home.added, 'Home: the lines it gained').toEqual(INDEX_GRANT.added);
  const trackPage = pageGrant('f30e876', 'src/pages/[track]/index.astro');
  expect(trackPage.hunks, 'the track page: the root’s 12px below (job 29)').toEqual(TRACK_PAGE_GRANT.hunks);
  expect(trackPage.removed, 'the track page: nothing removed').toEqual(TRACK_PAGE_GRANT.removed);
  expect(trackPage.added, 'the track page: the one declaration').toEqual(TRACK_PAGE_GRANT.added);
  const header = pageGrant('f30e876', 'src/components/SiteHeader.astro');
  expect(header.hunks, 'the header: the focusin rule (job 29, D25)').toEqual(SITE_HEADER_GRANT.hunks);
  expect(header.removed, 'the header: nothing removed').toEqual(SITE_HEADER_GRANT.removed);
  expect(header.added, 'the header: the rule’s lines').toEqual(SITE_HEADER_GRANT.added);
  const layout = pageGrant('f30e876', 'src/layouts/BaseLayout.astro');
  expect(layout.hunks, 'the layout: overHero goes (job 29, B38)').toEqual(BASE_LAYOUT_GRANT.hunks);
  expect(layout.removed, 'the layout: the lines it lost').toEqual(BASE_LAYOUT_GRANT.removed);
  expect(layout.added, 'the layout: the lines it gained').toEqual(BASE_LAYOUT_GRANT.added);
  expect(pageGrant('f30e876', 'src/components/SiteFooter.astro'), 'src/components/SiteFooter.astro: its comments only (job 29, B38)').toEqual(COMMENT_ONLY_GRANT);
  const head = readFileSync('src/styles/card-stack.css', 'utf8').split('\n').slice(0, 4).join('\n');
  expect(head).toContain('src/pages/about.astro');
  expect(head).toContain('src/pages/glossary.astro');
  expect(
    run(
      "git diff --name-only f30e876 -- 'src/pages/[track]/[lesson].astro' src/styles/tokens.ts src/layouts ':!src/layouts/BaseLayout.astro' src/components/site.css src/components/hub",
    ),
  ).toBe('');
  const gl = globalGrant('f30e876');
  expect(gl.changed, 'global.css: the reduced-motion rule’s one declaration (job 28)').toEqual(GLOBAL_GRANT.changed);
  expect(gl.sameLength, 'global.css: no line added or removed').toBe(true);
});
