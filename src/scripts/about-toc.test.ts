// About's "On this page" list, run against the About page's own markup. The page is rendered with Astro's container
// (which needs this file's default node environment, and the React renderer for the page's ResetProgress island)
// and parsed with jsdom. jsdom lays nothing out, so each test lays the page out itself: where each section starts,
// how tall the window and the page are, and how far the page has scrolled.
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
// @ts-expect-error - no @types/jsdom in this project; jsdom is already here for the component tests
import { JSDOM } from 'jsdom';
import { beforeAll, expect, test, vi } from 'vitest';
import About from '../pages/about.astro';
import { followSections, markSectionInView } from './about-toc';

let html = '';

beforeAll(async () => {
  const container = await AstroContainer.create({ renderers: await loadRenderers([getContainerRenderer()]) });
  html = await container.renderToString(About);
});

/** A jsdom window: its own Event, which its dispatchEvent needs, besides the usual window. */
type PageWindow = Window & { Event: typeof Event };

interface Page {
  win: PageWindow;
  doc: Document;
  nav: HTMLElement;
  links: HTMLAnchorElement[];
  sections: HTMLElement[];
}

function page(): Page {
  const win = new JSDOM(html).window as PageWindow;
  const doc = win.document;
  const nav = doc.querySelector<HTMLElement>('nav[aria-label="On this page"]')!;
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a')];
  const sections = links.map((a) => doc.getElementById(a.hash.slice(1))!);
  return { win, doc, nav, links, sections };
}

/**
 * Lays the page out: each section's top on the page (`tops`, in the list's order), the window's height and the
 * page's. Returns `scroll(y)`, which moves the page to `y` and tells it, as the browser does.
 */
function lay({ win, doc, sections }: Page, tops: number[], view = 800, height = 4000): (y: number) => void {
  const set = (target: object, key: string, value: number): void => {
    Object.defineProperty(target, key, { value, configurable: true });
  };
  set(win, 'innerHeight', view);
  set(doc.documentElement, 'scrollHeight', height);
  set(win, 'scrollY', 0);
  sections.forEach((section, i) => {
    section.getBoundingClientRect = () => ({ top: tops[i]! - win.scrollY }) as DOMRect;
  });
  return (y) => {
    set(win, 'scrollY', y);
    win.dispatchEvent(new win.Event('scroll'));
  };
}

const marked = (links: HTMLAnchorElement[]): string[] => links.filter((a) => a.hasAttribute('aria-current')).map((a) => a.textContent ?? '');

// Where the five sections start on a laid-out page 4000px tall, read through an 800px window: it can scroll 3200px.
const TOPS = [600, 1400, 2400, 2900, 3400];

test('the server renders the list as plain links to the five sections, none of them marked', () => {
  const { links, sections } = page();
  expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
    ['What it is', '#what'],
    ['How a lesson works', '#lessons'],
    ['Where the facts come from', '#facts'],
    ['Credits', '#credits'],
    ['Your progress', '#privacy'],
  ]);
  expect(sections.map((s) => s?.querySelector('h2')?.textContent)).toEqual([
    'What TechConcepts is',
    'How a lesson works',
    'Where the facts come from',
    'Credits',
    'Your progress stays with you',
  ]);
  expect(marked(links)).toEqual([]);
});

test('the section whose top has come up under the header is marked, one link at a time', () => {
  const p = page();
  const { win, links, sections } = p;
  const scroll = lay(p, TOPS);
  const at = (y: number): string[] => {
    scroll(y);
    markSectionInView(links, sections);
    return marked(links);
  };

  // At the top no section has reached the line under the header yet, so the first is the one being read.
  expect(at(0)).toEqual(['What it is']);
  expect(links[0]!.getAttribute('aria-current')).toBe('location');
  // The second section's top is 141px down the window: not yet. At 140px it is.
  expect(at(1400 - 141)).toEqual(['What it is']);
  expect(at(1400 - 140)).toEqual(['How a lesson works']);
  expect(at(2400 - 100)).toEqual(['Where the facts come from']);
  expect(at(2900 - 20)).toEqual(['Credits']);
  // Back up the page, the mark follows.
  expect(at(1500)).toEqual(['How a lesson works']);
  expect(at(0)).toEqual(['What it is']);
  expect(win.scrollY).toBe(0);
});

test('at the bottom of the page the last link is marked, though its section never reaches the header', () => {
  const p = page();
  const { links, sections } = p;
  const scroll = lay(p, TOPS);
  const at = (y: number): string[] => {
    scroll(y);
    markSectionInView(links, sections);
    return marked(links);
  };

  // At 3195px the window's foot is 5px short of the page's: Credits is still the one being read.
  expect(at(3195)).toEqual(['Credits']);
  // Within 4px of the foot counts as the bottom; the last section's top is still 200px down the window.
  expect(at(3196)).toEqual(['Your progress']);
  expect(at(3200)).toEqual(['Your progress']);
});

test('following the page marks a link at once and on every scroll, and stopping leaves no listener behind', () => {
  const p = page();
  const { win, nav, links } = p;
  const scroll = lay(p, TOPS);
  scroll(2400 - 100);
  const added = vi.spyOn(win, 'addEventListener');
  const removed = vi.spyOn(win, 'removeEventListener');

  const stop = followSections(nav);
  expect(marked(links)).toEqual(['Where the facts come from']);
  scroll(1500);
  expect(marked(links)).toEqual(['How a lesson works']);
  scroll(3200);
  expect(marked(links)).toEqual(['Your progress']);

  stop();
  expect(added.mock.calls.length).toBeGreaterThan(0);
  for (const [type, listener] of added.mock.calls) {
    expect(removed.mock.calls.some(([t, l]) => t === type && l === listener)).toBe(true);
  }
  // Stopped, it no longer follows the page.
  scroll(0);
  expect(marked(links)).toEqual(['Your progress']);
});

test('a link to a section that is not on the page is named, and nothing is marked', () => {
  const { doc, nav, links } = page();
  doc.getElementById('credits')!.remove();
  expect(() => followSections(nav)).toThrow('"On this page" links to #credits, which is not on the page.');
  expect(marked(links)).toEqual([]);
});
