import { expect, test } from 'vitest';
import { PAGE_FIGURES, pageFigure } from './pages.ts';
import type { PageFigure } from './pages.ts';

const NAMES = Object.keys(PAGE_FIGURES) as PageFigure[];

/** An aria-label with words in it: a label of only spaces says nothing. */
const LABEL = /aria-label="[^"]*\S[^"]*"/;

test('there are four page figures', () => {
  expect(NAMES).toEqual(['inside', 'sources', 'notFound', 'notReady']);
});

test('every page figure has role="img" and an aria-label that describes it in a sentence or more', () => {
  for (const name of NAMES) {
    const svg = pageFigure(name);
    expect(svg).toMatch(/^<svg[^>]* role="img"/);
    expect(svg).toMatch(LABEL);
    expect(svg.match(/aria-label="([^"]*)"/)![1]!.length).toBeGreaterThan(80);
  }
});

test('every page figure stands on the shared plate, cropped, with one engraved label', () => {
  for (const name of NAMES) {
    const svg = pageFigure(name);
    expect(svg).toContain('class="iso-svg lm-svg lm-');
    expect(svg).not.toContain('viewBox="0 0 600 420"');
    // The plate's glow pool and both orbit rings, drawn once.
    expect(svg.match(/class="lm-pool"/g)).toHaveLength(1);
    expect(svg.match(/lm-orbit lm-orbit2/g)).toHaveLength(1);
  }
});

test('every page figure has exactly one lit part, the thing to look at', () => {
  // A lit solid is the kit's data-lit group; lights (lm-led) are not parts.
  for (const name of NAMES) expect(pageFigure(name).match(/data-lit/g), name).toHaveLength(1);
});

test('no page figure carries film grain, an id, or a closing tag an HTML parser would act on', () => {
  for (const name of NAMES) {
    const svg = pageFigure(name);
    expect(svg).not.toMatch(/lm-grain/);
    // No ids of its own, so two copies can share a page; the gradients it points at are the shared lm- ones.
    expect(svg).not.toMatch(/ id="/);
    expect([...svg.matchAll(/url\(#([^)]+)\)/g)].every((m) => m[1]!.startsWith('lm-'))).toBe(true);
    expect(svg).not.toMatch(/<\/(script|style|body|html|head)/i);
  }
});

test('the not-found figure numbers its ports 401 to 408 and leaves only port 404 without a link light', () => {
  const svg = pageFigure('notFound');
  for (let n = 401; n <= 408; n++) expect(svg).toContain(`>${n}</text>`);
  expect(svg.match(/class="lm-led on"/g)).toHaveLength(7);
  expect(svg.match(/class="lm-led"/g)).toHaveLength(1);
});

test('a figure is the same drawing every time it is asked for', () => {
  for (const name of NAMES) expect(pageFigure(name)).toBe(pageFigure(name));
});
