// The 404 page in the Card stack look (job 23, D22, B28): what is rendered, what is written, and what the build may not touch.
// Cases are numbered as in prototypes/d22-cases.md.
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { execSync } from 'node:child_process';
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, test } from 'vitest';
import { pageFigure } from '../art/figures/pages';
import { startLesson } from './start';
import NotFound from '../pages/404.astro';
import { CARD_STACK_GRANT, GLOBAL_GRANT, INDEX_GRANT, TRACKS_GRANT, TRACK_PAGE_GRANT, cardStackGrant, globalGrant, pageGrant, tracksGrant } from './card-stack-guards';

/** The commit D22 was approved and frozen at: every "untouched" and "unchanged" below is read against it. */
const BASE = '1d8e446';
const run = (cmd: string): string => (execSync(`${cmd} || true`, { encoding: 'utf8' }) as string).trim();
const source: string = readFileSync('src/pages/404.astro', 'utf8');
const style = source.slice(source.indexOf('<style>') + 7, source.indexOf('</style>'));
const stripped = style.replace(/\/\*[\s\S]*?\*\//g, '');
const ruleOf = (css: string, selector: string): string => {
  const at = css.indexOf(`${selector} {`);
  expect(at, `${selector} is in the style text`).toBeGreaterThanOrEqual(0);
  return css.slice(css.indexOf('{', at) + 1, css.indexOf('}', at));
};

// Copied from src/lib/home.test.ts (case 5, H7): a colour value in some CSS or script. Comments are not read.
const NAMED = ('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan ' +
  'darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
  'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender ' +
  'lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue ' +
  'lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose ' +
  'moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue ' +
  'saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' ');
const NAMED_RE = new RegExp(`(?<![\\w-])(${NAMED.join('|')})(?![\\w-])`, 'i');
const HEX_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|hwb\(|lab\(|lch\(|oklab\(|oklch\(/;

/** The colour values in some CSS or script: a hex, a colour function, or a named colour. Comments are not read. */
function colourValues(text: string): string[] {
  const bare = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
  return bare.split('\n').flatMap((line) => [HEX_RE.exec(line)?.[0], NAMED_RE.exec(line)?.[1]].filter((v): v is string => v !== undefined));
}

const words = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
let html = '';
let doc: Document;
beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(NotFound);
  doc = new JSDOM(html).window.document;
});

describe('0. what the build may not change', () => {
  test('1: the shared files are untouched', () => {
    expect(
      run(
        `git diff --name-only ${BASE} -- 'src/pages/[track]/[lesson].astro' src/pages/about.astro src/pages/glossary.astro src/layouts src/components/SiteHeader.astro src/components/SiteFooter.astro src/components/site.css src/styles/tokens.ts src/art e2e/support.ts`,
      ),
    ).toBe('');
  });

  test('1a: global.css changes the reduced-motion rule’s one declaration and nothing else (job 28)', () => {
    const g = globalGrant(BASE);
    expect(g.changed).toEqual(GLOBAL_GRANT.changed);
    expect(g.sameLength, 'no line added or removed').toBe(true);
  });

  test('1b: tracks.astro gains the track page’s open-menu rule and nothing else (job 24)', () => {
    const t = tracksGrant(BASE);
    expect(t.hunks, 'one insertion after line 115').toEqual(TRACKS_GRANT.hunks);
    expect(t.removed, 'nothing removed').toEqual(TRACKS_GRANT.removed);
    expect(t.added, 'the track page’s open-menu rule').toEqual(TRACKS_GRANT.added);
  });

  test('1c: Home and the track page change their scroll paddings and margins and nothing else (job 29)', () => {
    const home = pageGrant(BASE, 'src/pages/index.astro');
    expect(home.hunks, 'Home: the root padding, the section margin and the demo radios (job 29)').toEqual(INDEX_GRANT.hunks);
    expect(home.removed, 'Home: the lines it lost').toEqual(INDEX_GRANT.removed);
    expect(home.added, 'Home: the lines it gained').toEqual(INDEX_GRANT.added);
    const trackPage = pageGrant(BASE, 'src/pages/[track]/index.astro');
    expect(trackPage.hunks, 'the track page: the root’s 12px below (job 29)').toEqual(TRACK_PAGE_GRANT.hunks);
    expect(trackPage.removed, 'the track page: nothing removed').toEqual(TRACK_PAGE_GRANT.removed);
    expect(trackPage.added, 'the track page: the one declaration').toEqual(TRACK_PAGE_GRANT.added);
  });

  test('2: card-stack.css changes only its opening comment, two reworded comments and the header and footer block (job 24); the opening comment stays four lines and names six importers', () => {
    const g = cardStackGrant(BASE);
    expect(g.changed, 'lines outside the three comments that are not the old text').toEqual(CARD_STACK_GRANT.changed);
    expect(g.comments, 'the three comments: lines 1 to 4, 6 to 8, 48 to 49').toEqual(CARD_STACK_GRANT.comments);
    expect(g.frame, 'the old length, the blank line, the block begins, the block ends').toEqual(CARD_STACK_GRANT.frame);
    expect(g.markers, 'BEGIN and END once each').toEqual(CARD_STACK_GRANT.markers);
    const head = (readFileSync('src/styles/card-stack.css', 'utf8') as string).split('\n').slice(0, 4).join('\n');
    for (const page of ['src/pages/index.astro', 'src/pages/tracks.astro', 'src/pages/[track]/index.astro', 'src/pages/about.astro', 'src/pages/glossary.astro', 'src/pages/404.astro']) expect(head, page).toContain(page);
  });

  test('3: the page imports card-stack.css on the line after site.css, once, and site.css stays', () => {
    const lines = source.split('\n');
    const site = lines.indexOf("import '../components/site.css';");
    expect(site).toBeGreaterThan(-1);
    expect(lines[site + 1]).toBe("import '../styles/card-stack.css';");
    expect(source.match(/^import .*card-stack\.css/gm)).toHaveLength(1);
    expect(readFileSync('src/layouts/BaseLayout.astro', 'utf8')).not.toContain('card-stack.css');
  });

  test('4: the markup, the frontmatter and the layout call change by one class only (notfound__art gains cs-card)', () => {
    const before: string[] = (execSync(`git show ${BASE}:src/pages/404.astro`, { encoding: 'utf8' }) as string).split('\n').slice(0, 32);
    const after: string[] = source.split('\n').slice(0, 33).filter((l: string) => l !== "import '../styles/card-stack.css';");
    const differing = after.map((l: string, i: number) => [l, before[i]]).filter(([a, b]) => a !== b);
    expect(differing).toEqual([['    <div class="notfound__art cs-card">', '    <div class="notfound__art">']]);
  });

  test('5: no script, no blue link, no transition or animation, no colour value in the page’s own code (check 14, H7)', () => {
    expect(source).not.toContain('<script');
    expect(stripped).not.toContain('var(--link)');
    expect(stripped).not.toMatch(/transition|animation/);
    const code = source.slice(0, source.indexOf('<BaseLayout')) + style;
    expect(colourValues(code)).toEqual([]);
    // The scan can fail: the same scan on the file with a colour written into the chip finds it.
    expect(colourValues(code.replace('.notfound__code {', '.notfound__code {\n    color: #fff;'))).toEqual(['#fff']);
  });

  test('6: pages.ts and its test are untouched (check 31)', () => {
    expect(run(`git diff --name-only ${BASE} -- src/art/figures/pages.ts src/art/figures/pages.test.ts`)).toBe('');
  });

  test('61: no expect( is dropped from the four tests changed on purpose (the file list is a merge-time check, in the review)', () => {
    for (const file of ['e2e/about.spec.ts', 'e2e/glossary.spec.ts', 'e2e/tracks-card-stack.spec.ts', 'src/lib/tracks-render.test.ts']) {
      const lines = run(`git diff -U0 ${BASE} -- ${file}`).split('\n');
      const count = (mark: string): number => lines.filter((l) => l.startsWith(mark) && !l.startsWith(`${mark}${mark}${mark}`) && l.includes('expect(')).length;
      expect(count('-'), file).toBeLessThanOrEqual(count('+'));
    }
  });
});

describe('1. words and structure', () => {
  const body = (): Element => doc.querySelector('.notfound__words')!;

  test('10: the five children of .notfound__words, in order, with the six strings; the link is built from startLesson()', () => {
    expect([...body().children].map((c) => `${c.tagName.toLowerCase()}${c.className === '' ? '' : `.${c.className}`}`)).toEqual(['p.notfound__code', 'h1', 'p.notfound__lede', 'p.notfound__actions', 'p.notfound__why']);
    const lesson = startLesson();
    expect([...body().children].map((c) => (c.matches('.notfound__actions') ? [...c.querySelectorAll('a')].map((a) => words(a)).join(' ') : words(c)))).toEqual([
      'Error 404',
      "That page isn't here",
      'The link may be old, or the address may have a typo.',
      'Go to Home See the tracks',
      `The server is working, but it has nothing at this address. That is what the number 404 means. Lesson ${lesson.number}, ${lesson.title} shows where it comes from.`,
    ]);
    const link = body().querySelector('.notfound__why a')!;
    expect(link.getAttribute('href')).toBe(lesson.url);
    expect(words(link)).toBe(`Lesson ${lesson.number}, ${lesson.title}`);
    expect([...body().querySelectorAll('.notfound__actions a')].map((a) => a.getAttribute('href'))).toEqual(['/', '/tracks']);
  });

  test('14: the figure is the drawing, once, inside div.notfound__art.cs-card, and is its only child (check 4, H5)', () => {
    const figure = pageFigure('notFound');
    expect(html.split(figure)).toHaveLength(2);
    const open = html.search(/<div class="notfound__art cs-card"/);
    expect(open).toBeGreaterThan(-1);
    const at = html.indexOf(figure);
    expect(at).toBeGreaterThan(open);
    const art = doc.querySelector('div.notfound__art.cs-card')!;
    expect(art.children).toHaveLength(1);
    const svg = art.children[0]!;
    expect(svg.matches('svg.lm-svg.lm-notfound')).toBe(true);
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe(new JSDOM(figure).window.document.querySelector('svg')!.getAttribute('aria-label'));
    // The text between the card's tag and the figure holds nothing else: no <figure>, no <title>.
    expect(html.slice(open, at)).not.toMatch(/<figure|<title/);
  });
});

describe('5. focus: the two root rules, as written (case 42)', () => {
  test('the page’s scroll padding: 80px above and 12px below; the 403px of the open menu sits inside a media query at 959px', () => {
    const at = stripped.indexOf(':global(html) {');
    expect(at).toBeGreaterThan(-1);
    const root = stripped.slice(stripped.indexOf('{', at) + 1, stripped.indexOf('}', at));
    expect(root).toMatch(/scroll-padding-top:\s*80px/);
    expect(root).toMatch(/scroll-padding-bottom:\s*12px/);
    const open = stripped.indexOf(':global(html:has(#menu-panel:not([hidden])))');
    expect(open).toBeGreaterThan(-1);
    const media = stripped.lastIndexOf('@media', open);
    expect(stripped.slice(media, open)).toMatch(/^@media \(max-width: 959px\)\s*\{\s*$/);
    expect(stripped.slice(media, open).match(/\}/g)).toBeNull();
    const rule = stripped.slice(open, stripped.indexOf('}', open) + 1);
    expect(rule).toMatch(/scroll-padding-top:\s*403px/);
    expect(stripped.match(/403px/g)).toHaveLength(1);
    expect(stripped).not.toContain('scroll-behavior');
  });

  test('the page’s own rules are the prototype’s Part 2: the frame, the chip, the heading, the buttons’ row, the paragraph and the card', () => {
    expect(ruleOf(stripped, '.notfound')).toMatch(/gap:\s*clamp\(20px, 4vw, 64px\)/);
    expect(ruleOf(stripped, '.notfound')).toMatch(/padding-block:\s*clamp\(20px, 5vw, 64px\)/);
    expect(ruleOf(stripped, '.notfound__code')).toMatch(/border:\s*2px solid var\(--cs-edge\)/);
    expect(ruleOf(stripped, '.notfound h1')).toMatch(/text-wrap:\s*balance/);
    expect(ruleOf(stripped, '.notfound__actions')).toMatch(/padding:\s*0 var\(--cs-off\) var\(--cs-off\) 0/);
    expect(ruleOf(stripped, '.notfound__why')).toMatch(/border-top:\s*1px solid var\(--cs-hair\)/);
    expect(ruleOf(stripped, '.notfound__art')).toMatch(/overflow:\s*hidden/);
    expect(stripped).not.toContain('.notfound__why a');
  });
});
