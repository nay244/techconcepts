// Home rendered with Astro's container and parsed with jsdom (B20, prototypes/d17-cases.md cases 1, 2, 10 and 21): the words
// the page says, its scripts, and the key's place in it. Vitest runs before any build, so this reads the render, not dist/.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/node; vitest runs under node
import { readFileSync } from 'node:fs';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { beforeAll, describe, expect, test } from 'vitest';
import Home from '../pages/index.astro';

/** Today's words, captured from Home's render before B20: the text nodes of `main`, in the page and in its drawings. */
const TODAY = JSON.parse(readFileSync('src/lib/home-words.fixture.json', 'utf8')) as { html: string[]; svg: string[] };

let html = '';
let doc: Document;
beforeAll(async () => {
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  html = await container.renderToString(Home);
  doc = new JSDOM(html).window.document;
});

const squash = (text: string | null | undefined): string => (text ?? '').replace(/\s+/g, ' ').trim();

/** The text nodes of `main` (not its styles or scripts), split into the page's own and the drawings'. */
function textsOf(root: Element, skip: (el: Element) => boolean = () => false): { html: string[]; svg: string[] } {
  const out = { html: [] as string[], svg: [] as string[] };
  const walker = doc.createTreeWalker(root, 4);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = squash(node.textContent);
    const parent = node.parentElement!;
    if (text === '' || parent.closest('style,script') !== null || skip(parent)) continue;
    (parent.closest('svg') !== null ? out.svg : out.html).push(text);
  }
  return out;
}

describe('1. five sections in today’s order, and today’s words plus D16’s three hints and the key', () => {
  test('the h1 and the four h2s, in order', () => {
    const main = doc.querySelector('main')!;
    expect([...main.querySelectorAll('h1, h2')].map((h) => squash(h.textContent))).toEqual([
      'See how technology really works.',
      'Try one, right here',
      'Get started with the basics',
      'Where the facts come from',
      'Lift the lid',
    ]);
    expect([...main.children].filter((el) => el.tagName === 'SECTION').map((el) => el.className.split(' ')[0])).toEqual(['open', 'try', 'order', 'facts', 'close']);
  });

  test('every text in main is today’s, plus exactly the three hints, their arrows and the key', () => {
    const main = doc.querySelector('main')!;
    const now = textsOf(main, (el) => el.closest('.demo__key, .demo__hint') !== null);
    // Nothing added, nothing removed, in today's order.
    expect(now.html).toEqual(TODAY.html);
    // The drawings' words are unchanged: the key repeats the callouts, it does not take them out.
    expect(now.svg).toEqual(TODAY.svg);
    const hints = [...main.querySelectorAll('.demo__hint')].map((h) => squash(h.textContent));
    expect(hints).toEqual([
      '←→Arrow keys switch between Watch, Learn and Practice.',
      '←→Arrow keys move between the steps.',
      '↑↓Arrow keys choose an answer.',
    ]);
    expect([...main.querySelectorAll('.demo__hint kbd')].map((k) => k.textContent)).toEqual(['←', '→', '←', '→', '↑', '↓']);
  });

  test('the key’s ten texts are the drawing’s four callouts’ texts, in order, shown once in the key and still in the drawing', () => {
    const main = doc.querySelector('main')!;
    const key = [...main.querySelectorAll('.demo__key')];
    expect(key).toHaveLength(2);
    // An element's own words: the name, each line; an address that breaks at its dot is one text.
    const texts = key.flatMap((band) => [...band.querySelectorAll('.demo__call')].flatMap((call) => [...call.children].map((el) => squash(el.textContent))));
    expect(texts).toEqual([
      'Your laptop', '192.168.1.100', 'Wants example.net',
      'DNS resolver', 'turns names into numbers', '192.0.2.53',
      'The internet', 'routers pass messages along',
      'Web server', '203.0.113.80 · port 80',
    ]);
    const drawn = new Set(textsOf(main).svg);
    for (const t of texts) expect(drawn.has(t), `"${t}" is still drawn in the SVG`).toBe(true);
    // The drawing is cropped, not changed: its four callouts are where they were.
    expect(main.querySelectorAll('.demo__scene svg .nm-call').length).toBeGreaterThanOrEqual(4);
    expect(main.querySelectorAll('.demo__crop > svg')).toHaveLength(1);
    // Each address breaks only at its dot.
    expect([...main.querySelectorAll('.demo__addr > span')].map((s) => squash(s.textContent))).toEqual(['192.168.1.100', '192.0.2.53', '203.0.113.80 ·', 'port 80']);
  });
});

describe('2. two scripts and no island', () => {
  test('the page has exactly the two script elements it had, and no astro-island', () => {
    expect(html).not.toContain('astro-island');
    // The layout's two scripts (the theme and the header); the render keeps them as text.
    expect(html.match(/<script/g)).toHaveLength(2);
    expect(doc.querySelectorAll('script')).toHaveLength(2);
  });
});

describe('10. the number stays in the markup', () => {
  test('each step’s digit is in its chip, so a tick can be drawn over it without taking it out', () => {
    expect([...doc.querySelectorAll('.demo__n')].map((n) => n.textContent)).toEqual(['1', '2', '3', '4', '5']);
    expect(doc.querySelector('.demo__rows')!.getAttribute('style')).toBe('--steps:5');
    expect([...doc.querySelectorAll('.demo__row .demo__t b')].map((b) => squash(b.textContent))).toEqual(['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render Page']);
  });
});
