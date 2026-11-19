// The track page rendered with Astro's container and parsed with jsdom (B25, prototypes/d20-cases.md checks 1 to 8, 27):
// the page's shape and order, its words, its parts and their counts, its one link a lesson, no drawing, its scripts and
// the props its islands are sent. Vitest runs before any build, so this reads the render, not dist/. The first render
// is a first visit, as without JavaScript.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/node; vitest runs under node
import { execSync } from 'node:child_process';
// @ts-expect-error - no @types/node; vitest runs under node
import { readFileSync } from 'node:fs';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, test } from 'vitest';
import { getEntries } from '../content/registry';
import { internetTrack, networkingTrack } from '../content/tracks';
import TrackPage from '../pages/[track]/index.astro';
import { expectCardStackGrant } from './card-stack-guards';

const TRACKS = [
  { track: networkingTrack, lessons: 20, parts: 6, end: 'New to IT? How the Internet Works is the gentler start.', to: '/how-the-internet-works', words: '20 of 20 lessons done' },
  { track: internetTrack, lessons: 14, parts: 6, end: 'Ready for more? Networking Concepts goes deeper.', to: '/networking', words: '14 of 14 lessons done' },
];

const squash = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

/** Astro's island props: `[0, value]` for a value, `[1, [...]]` for a list, each object's values wrapped the same way. */
function decode(v: unknown): unknown {
  if (!Array.isArray(v)) {
    // The attribute's own object: each prop's value is wrapped.
    if (v !== null && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, decode(x)]));
    return v;
  }
  const [kind, value] = v as [number, unknown];
  if (kind === 1) return (value as unknown[]).map(decode);
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, x]) => [k, decode(x)]));
  }
  return value;
}

const pages = new Map<string, { html: string; doc: Document }>();
beforeAll(async () => {
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  for (const { track } of TRACKS) {
    const html = await container.renderToString(TrackPage, { props: { track }, params: { track: track.id } });
    pages.set(track.id, { html, doc: new JSDOM(html).window.document });
  }
});

describe.each(TRACKS)('$track.id', ({ track, lessons, parts, end, to, words }) => {
  const page = () => pages.get(track.id)!;
  const main = () => page().doc.querySelector('main')!;

  test('1. main holds one div.wrap.tk with the crumb, h1, lede, strip, card, route and last line, in that order, and no em and no box', () => {
    expect(main().children.length).toBe([...main().children].filter((el) => el.tagName !== 'SCRIPT').length);
    const wrap = main().querySelector(':scope > div.wrap.tk')!;
    expect(wrap).not.toBeNull();
    const order = [...wrap.querySelectorAll('nav.crumbs, h1, p.lede, .strip, .upnext, div.route, p.route__end')].map((el) => (el.tagName === 'NAV' ? 'nav.crumbs' : el.tagName === 'H1' ? 'h1' : '.' + el.className.split(' ')[0]));
    expect(order).toEqual(['nav.crumbs', 'h1', '.lede', '.strip', '.upnext', '.route', '.route__end']);
    expect(main().querySelectorAll('em')).toHaveLength(0);
    expect(page().doc.querySelector('.routebox, .routebox__in, .side-now, main .site-foot')).toBeNull();
    // The footer is the layout's, after main; the body carries no class.
    expect(main().nextElementSibling!.matches('footer.site-foot')).toBe(true);
    expect(page().doc.body.hasAttribute('class')).toBe(false);
    expect(main().id).toBe('main');
  });

  test('1. the h1 is the title in one text node; the crumb is Tracks, a hidden slash, then the title as the current page', () => {
    const h1 = main().querySelector('h1')!;
    expect(h1.childNodes).toHaveLength(1);
    expect(h1.textContent).toBe(track.title);
    const crumb = main().querySelector('nav.crumbs')!;
    expect(crumb.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(crumb.querySelector('a')).toHaveProperty('textContent', 'Tracks');
    expect(crumb.querySelector('a')!.getAttribute('href')).toBe('/tracks');
    expect(crumb.querySelector('.sep')!.getAttribute('aria-hidden')).toBe('true');
    expect(crumb.querySelector('[aria-current="page"]')!.textContent).toBe(track.title);
    expect(main().querySelector('p.lede')!.textContent).toBe(track.description);
  });

  test('2. six parts, in order, each with its count; one stop a lesson in the track’s order', () => {
    const sections = [...main().querySelectorAll('section.route-stage')];
    expect(sections).toHaveLength(parts);
    expect(sections.map((s) => s.querySelector('h2')!.textContent)).toEqual(track.parts.map((p) => p.title));
    for (const [i, s] of sections.entries()) {
      const h2 = s.querySelector('h2')!;
      expect(s.getAttribute('aria-labelledby')).toBe(h2.id);
      const n = track.parts[i]!.lessons.length;
      expect(h2.nextElementSibling!.textContent).toBe(`${n} ${n === 1 ? 'lesson' : 'lessons'}`);
      expect(h2.nextElementSibling!.className).toBe('route-stage__count');
    }
    const stops = [...main().querySelectorAll('li.stop')];
    expect(stops).toHaveLength(lessons);
    expect(stops.map((li) => li.querySelector('h3')!.textContent)).toEqual(track.parts.flatMap((p) => p.lessons.map((l) => l.title)));
    expect(main().querySelector('header.route-stage__head, .route-stage__mark')).toBeNull();
  });

  test('3. each stop has one link, in its h3, to its lesson; no button; a chip reading "Lesson NN"; a subtitle; one status; one stamp', () => {
    const entries = getEntries(track.id);
    for (const [i, li] of [...main().querySelectorAll('li.stop')].entries()) {
      const entry = entries[i]!;
      expect(li.querySelectorAll('a'), entry.title).toHaveLength(1);
      expect(li.querySelector('h3 a')!.getAttribute('href')).toBe(entry.available ? entry.url : null);
      expect(li.querySelectorAll('button, .btn'), entry.title).toHaveLength(0);
      expect(li.querySelector('span.stop__node')!.textContent).toBe(`Lesson ${String(entry.number).padStart(2, '0')}`);
      expect(li.querySelector('p.stop__sub')!.textContent).toBe(entry.available ? entry.subtitle : null);
      expect(li.querySelectorAll('.stop__k')).toHaveLength(1);
      expect(li.querySelector('.stop__k')!.textContent).toBe('Not started');
      expect(squash(li.querySelector('.stamp')!.textContent)).toMatch(/^Checked \d{1,2} [A-Z][a-z]{2} \d{4}$/);
    }
  });

  test('4. the up-next card is the first-visit render: First lesson, ahead, Start; "Start here" is only in the lede', () => {
    const card = main().querySelector('.upnext')!;
    expect(card.getAttribute('data-kind')).toBe('start');
    expect(card.querySelector('.upnext__k')!.textContent).toBe('First lesson');
    expect(card.querySelector('.upnext__n')!.getAttribute('data-state')).toBe('ahead');
    expect(card.querySelector('.upnext__n')!.textContent).toBe('Lesson 01');
    expect(card.querySelector('a.btn.btn--primary.upnext__btn')!.textContent).toBe('Start');
    for (const el of main().querySelectorAll('*')) {
      if (el.closest('p.lede') !== null || el.closest('script, style') !== null) continue;
      if (el.children.length === 0) expect(el.textContent, el.className).not.toContain('Start here');
    }
  });

  test('5. main holds one .btn, the card’s, and no button', () => {
    expect(main().querySelectorAll('.btn')).toHaveLength(1);
    expect(main().querySelector('.btn')!.classList.contains('upnext__btn')).toBe(true);
    expect(main().querySelectorAll('button')).toHaveLength(0);
  });

  test('6. the last line reads as written, with one space round its link', () => {
    const p = main().querySelector('p.route__end')!;
    expect(p.textContent!.replace(/^\s+|\s+$/g, '')).toBe(end);
    expect(p.querySelectorAll('a')).toHaveLength(1);
    expect(p.querySelector('a')!.getAttribute('href')).toBe(to);
  });

  test('7. no lesson figure and no slot: the only svgs are the stamps’ ticks; no astro-slot, no template; four scripts', () => {
    expect(main().querySelectorAll('svg')).toHaveLength(lessons);
    for (const svg of main().querySelectorAll('svg')) expect(svg.closest('.stamp')).not.toBeNull();
    expect(main().querySelector('svg.name-tile, .lm-svg, svg[role="img"], .nt-full, [data-art], .stop__slot, .stop__art, .side-now__art')).toBeNull();
    // (Astro's island script names `astro-slot` in its own text, so the element is what is looked for.)
    expect(page().html).not.toMatch(/<astro-(static-)?slot/);
    expect(page().html).not.toContain('<template');
    expect(page().html).not.toMatch(/<template[^>]*data-astro-template/);
    expect(page().html.match(/<script/g)).toHaveLength(4);
  });

  test('8. the islands are sent no summary, meta, metaLabel, tags or note; and what they read is there', () => {
    const islands = [...page().doc.querySelectorAll('astro-island')];
    expect(islands).toHaveLength(2);
    expect(page().html).not.toMatch(/&quot;(summary|meta|metaLabel|tags|note)&quot;:/);
    const props = islands.map((el) => decode(JSON.parse(el.getAttribute('props')!)) as Record<string, any>);
    for (const p of props) {
      expect(p.entries).toHaveLength(lessons);
      for (const e of p.entries) {
        for (const key of ['key', 'available', 'url', 'maxPosition', 'number', 'title', 'subtitle']) expect(e, `${e.title} ${key}`).toHaveProperty(key);
      }
    }
    const route = props.find((p) => p.parts !== undefined)!;
    expect(route.parts).toHaveLength(parts);
    for (const part of route.parts) {
      for (const l of part.lessons) {
        for (const key of ['n', 'key', 'number', 'title', 'subtitle', 'ready', 'stamp', 'places']) expect(l, `${l.title} ${key}`).toHaveProperty(key);
        for (const place of l.places) expect(Object.keys(place)).toEqual(['parts']);
      }
    }
  });

  test('strip: the words keep their longest form, set on the page', () => {
    const wrap = main().querySelector('.wrap.tk')!;
    expect(wrap.getAttribute('style')).toBe(`--strip-longest: "${words}"`);
    expect(main().querySelector('.strip__w')!.textContent).toBe(`0 of ${lessons} lessons done`);
  });
});

describe('the files the page changes', () => {
  const read = (path: string): string => readFileSync(path, 'utf8') as string;
  const page = read('src/pages/[track]/index.astro');

  test('the page imports neither lessonFigure nor figures, and the Lesson page still draws a figure', () => {
    expect(page).not.toMatch(/lessonFigure|figures/);
    expect(read('src/pages/[track]/[lesson].astro')).toMatch(/lessonFigure|figures/);
  });

  test('the page asks for no split, no footer={false} and no Footer of its own; the layout has no split prop', () => {
    expect(page).not.toMatch(/\bsplit\b|footer=\{false\}|SiteFooter|routebox/);
    expect(read('src/layouts/BaseLayout.astro')).not.toMatch(/\bsplit\b/);
    const left = (execSync('grep -rnE "\\bsplit\\b" src/pages src/layouts src/styles | grep -v "\\.split(" || true', { encoding: 'utf8' }) as string).trim();
    expect(left).toBe('');
  });

  test('the scroll padding is 80px, and 341px only while the menu is open below 960px (H10); the not-ready square’s rule is :not([data-state]) (H6)', () => {
    expect(page).toMatch(/:global\(html\)\s*\{\s*scroll-padding-top: 80px;/);
    expect(page).toMatch(/@media \(max-width: 959px\)\s*\{\s*:global\(html:has\(#menu-panel:not\(\[hidden\]\)\)\)\s*\{\s*scroll-padding-top: 341px;/);
    expect(page).toContain(':global(.strip__sq i:not([data-state]))');
    expect(page).not.toContain("[data-state='']");
  });

  test('the rail’s offsets are the corrected ones (E4): the chip’s middle on the line', () => {
    expect(page).toMatch(/\.stop__node\)\s*\{[^}]*left: -58px/);
    expect(page).toMatch(/\.stop\)::before\s*\{[^}]*left: -24px/);
  });

  test('card-stack.css changes only its opening comment, two reworded comments and the header and footer block (job 24), and names no part of the track page (check 27)', () => {
    // e6441c2 predates the file (the old guard's whole-file hunk passed on nothing); 1d8e446 is the last commit that holds it as it was.
    expectCardStackGrant('1d8e446');
    expect(read('src/styles/card-stack.css')).not.toMatch(/\.tk\b|\.stop\b|\.route\b|\.upnext\b|\.strip\b|\.wlp\b/);
  });

  test('hub.css holds the strip’s seven rules and .wholetrack, and none of the rest (check 27)', () => {
    const css = read('src/components/hub/hub.css');
    const selectors = [...css.matchAll(/^([^\s/{][^{]*)\{/gm)].map((m) => m[1]!.trim());
    expect(selectors).toEqual([
      '.strip',
      '.strip__sq',
      '.strip__sq i',
      ".strip__sq i[data-state='ready']",
      ".strip__sq i[data-state='done']",
      ".strip__sq i[data-state='current']",
      '.strip__w',
      '.wholetrack',
      '.wholetrack:hover',
    ]);
    expect(css).not.toMatch(/wlp|panel__cta|\.next|side-now|\.route|\.stop/);
  });

  test('the islands take no art props and no children, and BorrowedArt is gone', () => {
    for (const file of ['src/components/hub/TrackSide.tsx', 'src/components/hub/TrackRoute.tsx']) {
      const src = read(file);
      expect(src, file).not.toMatch(/art\$\{number\}|BorrowedArt|children|data-art|side-now|stop__art|stop__slot/);
    }
    expect(read('src/components/hub/TrackSide.tsx')).not.toContain('lessonLine');
    // The Lesson page keeps lessonLine and the "Up next" kicker.
    expect(read('src/lesson/Explanation.tsx')).toMatch(/lessonLine/);
  });
});
