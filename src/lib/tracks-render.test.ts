// The Tracks page rendered with Astro's container and parsed with jsdom (B21, prototypes/d18-cases.md): the words the
// page says, its parts and their order, its scripts and its three drawings. Vitest runs before any build, so this
// reads the render, not dist/. The page's first render is the first-visit state, as without JavaScript.
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
import Tracks from '../pages/tracks.astro';
import { homeStops } from './home';
import { SITE_HEADER_GRANT, pageGrant } from './card-stack-guards';

let html = '';
let doc: Document;
beforeAll(async () => {
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  html = await container.renderToString(Tracks);
  doc = new JSDOM(html).window.document;
});

const squash = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();
const main = (): Element => doc.querySelector('main')!;
const panels = (): Element[] => [...main().querySelectorAll('article.panel')];

const OUTRO = 'New to IT? Start with How the Internet Works, then go deeper with Networking Concepts. Every lesson is Watch, Learn, then Practice.';

describe('1. the head, the three cards, no outro, no em', () => {
  test('h1 "Pick a track" with no element in it, then a div of two paragraphs, then three articles in order', () => {
    const h1 = main().querySelector('h1')!;
    expect(h1.textContent).toBe('Pick a track');
    expect(h1.children).toHaveLength(0);
    const head = h1.parentElement!;
    const words = head.querySelector('.tp-head__words')!;
    expect([...words.children].map((el) => el.tagName)).toEqual(['P', 'P']);
    expect(squash(words.children[0]!.textContent)).toBe('Each track is a set of short visual lessons, taken in order.');
    expect(squash(words.children[1]!.textContent)).toBe(OUTRO);
    expect([...words.children[1]!.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['#how-the-internet-works', '#networking']);
    expect(panels().map((p) => p.id)).toEqual(['how-the-internet-works', 'networking', 'comptia-a-plus']);
  });

  test('the sentence occurs once in main; there is no p.outro and no em', () => {
    expect(squash(main().textContent).split(OUTRO)).toHaveLength(2);
    expect(main().querySelector('p.outro')).toBeNull();
    expect(main().querySelectorAll('em')).toHaveLength(0);
  });

  test('each name is the track’s title in one text node', () => {
    const names = panels().map((p) => p.querySelector('h2.trk__name')!);
    expect(names.map((h) => h.textContent!.trim())).toEqual(['How the Internet Works', 'Networking Concepts', 'CompTIA A+']);
    for (const h of names) expect([...(h.querySelector('a') ?? h).childNodes].filter((n) => n.nodeType === 3)).toHaveLength(1);
    // Two names link to their tracks; A+'s has no link.
    expect(names.map((h) => h.querySelector('a')?.getAttribute('href') ?? null)).toEqual(['/how-the-internet-works', '/networking', null]);
  });
});

describe('2. the tabs', () => {
  test('"Start here", "Then go deeper", "Not ready yet" in order, the card’s second child, only the first marked here', () => {
    const tabs = panels().map((p) => p.querySelector('.cs-tab')!);
    expect(tabs.map((t) => t.textContent!.trim())).toEqual(['Start here', 'Then go deeper', 'Not ready yet']);
    expect(tabs.map((t) => t.classList.contains('cs-tab--here'))).toEqual([true, false, false]);
    for (const p of panels()) {
      expect([...p.children][0]!.className).toBe('trk__art');
      expect([...p.children][1]!.classList.contains('cs-tab')).toBe(true);
      expect([...p.children][2]!.tagName).toBe('H2');
    }
  });

  test('the first two tabs are Home’s own words, from the one source', () => {
    expect(homeStops().map((s) => s.order)).toEqual(['Start here', 'Then go deeper']);
  });

  test('"Start here" occurs once and "Not ready yet" once in main on a first visit, and "First lesson" is the boxes’ kicker', () => {
    const text = squash(main().textContent);
    expect(text.split('Start here')).toHaveLength(2);
    expect(text.split('Not ready yet')).toHaveLength(2);
    expect(main().querySelector('.h-chip')).toBeNull();
    expect([...main().querySelectorAll('.upnext__k')].map((k) => k.textContent)).toEqual(['First lesson', 'First lesson']);
  });
});

describe('4. A+ has nothing to press', () => {
  test('no link, button, tabindex, strip or .btn; the note is two sentences, the first in b, with its period', () => {
    const aplus = main().querySelector('#comptia-a-plus')!;
    expect(aplus.querySelectorAll('a, button, [tabindex], .strip, .btn, input, select')).toHaveLength(0);
    expect(squash(aplus.querySelector('.trk__soon')!.textContent)).toBe('Lesson 1 is being written. Each lesson will follow the A+ exam objectives.');
    expect(aplus.querySelector('.trk__soon b')!.textContent).toBe('Lesson 1 is being written.');
    expect(aplus.classList.contains('cs-card--soon')).toBe(true);
    expect(aplus.classList.contains('cs-card--beneath')).toBe(false);
  });

  test('"Coming soon", "Lessons on the way" and a "Lesson NN ·" line are on the page nowhere', () => {
    const text = squash(main().textContent);
    expect(text).not.toContain('Coming soon');
    expect(text).not.toContain('Lessons on the way');
    expect(text).not.toMatch(/Lesson \d\d ·/);
    expect(main().querySelector('span.btn, .panel__off, .next, .lift, .panel__cta')).toBeNull();
  });
});

describe('6. scripts, templates and three drawings', () => {
  test('as many <script> elements as the page had before the change (4), and no template or slot', () => {
    // Counted on revamp at e6441c2 before the change: 4 in the container render, 4 in the built page.
    expect(html.match(/<script/g)).toHaveLength(4);
    // (The island's own runtime script names these in its code, so look for elements, not strings.)
    expect(doc.querySelectorAll('template, astro-slot, [data-astro-template]')).toHaveLength(0);
  });

  test('exactly three .lm-svg in main, one a card inside .trk__art[aria-hidden], the covers in order', () => {
    const svgs = [...main().querySelectorAll('.lm-svg')];
    expect(svgs).toHaveLength(3);
    for (const [i, svg] of svgs.entries()) {
      expect(svg.closest('.trk__art')!.getAttribute('aria-hidden')).toBe('true');
      expect(svg.closest('article')).toBe(panels()[i]);
    }
    expect(svgs.map((s) => ['lm-web', 'lm-router', 'lm-pc'].find((c) => s.classList.contains(c)))).toEqual(['lm-web', 'lm-router', 'lm-pc']);
  });

  test('each root svg is cropped like Home’s and slices from the middle: the attribute once, no nested svg touched', () => {
    for (const art of main().querySelectorAll('.trk__art')) {
      const root = art.querySelector(':scope > svg')!;
      expect(root.getAttribute('viewBox')).toBe('30 20 540 378');
      expect(root.getAttribute('preserveAspectRatio')).toBe('xMidYMid slice');
      expect(art.innerHTML.match(/preserveAspectRatio/g)).toHaveLength(1);
    }
  });

  test('every id on the page is unique, and each card is labelled by an h2 that exists', () => {
    const ids = [...doc.querySelectorAll('[id]')].map((el) => el.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const p of panels()) expect(doc.getElementById(p.getAttribute('aria-labelledby')!)?.tagName).toBe('H2');
  });

  test('the page is a fraction of its old weight: no lesson figure is sent', () => {
    expect(html.length).toBeLessThan(400_000);
  });
});

describe('the words: every text in main is the list written from §9', () => {
  test('the page says these things and no others, in this order', () => {
    const texts: string[] = [];
    const walker = doc.createTreeWalker(main(), 4);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement!;
      const t = squash(node.textContent);
      if (t === '' || parent.closest('svg,style,script') !== null) continue;
      texts.push(t);
    }
    expect(texts).toEqual([
      'Pick a track',
      'Each track is a set of short visual lessons, taken in order.',
      'New to IT? Start with',
      'How the Internet Works',
      ', then go deeper with',
      'Networking Concepts',
      '. Every lesson is Watch, Learn, then Practice.',
      'Start here',
      'How the Internet Works',
      'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.',
      '0 of 14 lessons done',
      'First lesson',
      'Lesson',
      '01',
      'HTTP',
      'Asking for web pages',
      'Start',
      'See the whole track',
      'Then go deeper',
      'Networking Concepts',
      'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
      '0 of 20 lessons done',
      'First lesson',
      'Lesson',
      '01',
      'OSI Model',
      'One big job, split into seven layers',
      'Start',
      'See the whole track',
      'Not ready yet',
      'CompTIA A+',
      'Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.',
      'Lesson 1 is being written.',
      'Each lesson will follow the A+ exam objectives.',
    ]);
  });

  test('the strip reserves the longest form of its words, per track', () => {
    expect(panels().slice(0, 2).map((p) => p.getAttribute('style'))).toEqual(['--strip-longest: "14 of 14 lessons done"', '--strip-longest: "20 of 20 lessons done"']);
  });
});

describe('the shared Card stack stylesheet', () => {
  test('is imported by Home, the Tracks page, the track page, About, the Glossary and the 404 page, and by nothing else', () => {
    const importers = (execSync("grep -rlE \"import .*card-stack\\.css\" src || true", { encoding: 'utf8' }) as string)
      .split('\n')
      .filter((f) => f !== '' && !f.endsWith('.test.ts'))
      .sort();
    expect(importers).toEqual([
      'src/pages/404.astro',
      'src/pages/[track]/index.astro',
      'src/pages/about.astro',
      'src/pages/glossary.astro',
      'src/pages/index.astro',
      'src/pages/tracks.astro',
    ]);
  });

  test('the page’s own rules reach nothing outside it: the strip, the progress logic, the tokens, the header and the footer are not in the page’s diff', () => {
    const touched = (execSync('git diff --name-only e6441c2 -- src/components/hub/TrackStrip.tsx src/components/hub/useUpNext.ts src/styles/tokens.ts src/components/SiteFooter.astro || true', { encoding: 'utf8' }) as string).trim();
    expect(touched).toBe('');
    const header = pageGrant('e6441c2', 'src/components/SiteHeader.astro');
    expect(header.hunks, 'the header: the focusin rule (job 29, D25)').toEqual(SITE_HEADER_GRANT.hunks);
    expect(header.removed, 'the header: nothing removed').toEqual(SITE_HEADER_GRANT.removed);
    expect(header.added, 'the header: the rule’s lines').toEqual(SITE_HEADER_GRANT.added);
  });

  test('shadow-sm, the "task 8" rules and the prototype’s switch are not built', () => {
    const page = readFileSync('src/pages/tracks.astro', 'utf8');
    expect(page).not.toContain('shadow-sm');
    expect(page).not.toContain('task 8');
    expect(page).not.toContain('.isl');
    expect(page).not.toContain('scroll-snap');
    expect(page).not.toContain('pl-1');
    expect(page).not.toContain('var(--link)');
  });
});
