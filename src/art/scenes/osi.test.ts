import { expect, test } from 'vitest';
import { drawFigure } from './index';
import { drawOsi, type OsiSceneData } from './osi';
import { OSI_CUE_ARGS, OSI_ROUTES, OSI_STACKS, OSI_WORDS } from './osi-stacks';
import { FIGURE_PARTS } from './parts';

// No checksum against the mockup here: the port draws each block once, where the mockup drew it twice (plain and lit),
// and leaves every word to the lesson, so its markup differs from the mockup's on purpose.

/** The whole `<g>` that opens at `start`, up to its own closing tag. */
function groupAt(svg: string, start: number): string {
  const tags = /<g\b|<\/g>/g;
  tags.lastIndex = start;
  let open = 0;
  for (let m = tags.exec(svg); m; m = tags.exec(svg)) {
    open += m[0] === '</g>' ? -1 : 1;
    if (open === 0) return svg.slice(start, m.index + 4);
  }
  return svg.slice(start);
}

test('the figure names itself for its driver and keeps its ids to itself', () => {
  const { svg } = drawOsi();
  expect(svg).toMatch(/^<svg data-figure="osi" class="lm-svg osi" viewBox="[^"]+" role="img" aria-label="[^"]*\S[^"]*">/);
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.filter((id) => !id.startsWith('osi-'))).toEqual([]);
  expect(new Set(ids).size).toBe(ids.length);
});

test('the figure carries no grain and no closing tag an HTML parser would act on', () => {
  const { svg } = drawOsi();
  expect(svg).not.toMatch(/lm-grain/);
  expect(svg).not.toMatch(/<\/(script|style|body|html|head)/i);
});

test('every block, peer line, callout and the tag the driver moves is there', () => {
  const { svg } = drawOsi();
  for (const [place, count] of Object.entries(OSI_STACKS)) {
    for (let n = 1; n <= count; n++) expect(svg, `${place} ${n}`).toContain(`<g class="osi-L" id="osi-L-${place}-${n}">`);
  }
  // The router reads only the lowest three layers.
  expect(svg).not.toContain(' id="osi-L-router-4"');
  for (let n = 1; n <= 7; n++) expect(svg, `peer ${n}`).toContain(`<g class="osi-peers" id="osi-peer-${n}">`);
  expect(svg).not.toContain(' id="osi-peer-8"');
  for (const place of ['laptop', 'router', 'server']) expect(svg, place).toContain(`<g class="osi-call" id="osi-call-${place}">`);
  expect(svg).toContain('<g class="osi-tag" id="osi-tag">');
});

test('each block is drawn once', () => {
  const { svg } = drawOsi();
  for (const [place, count] of Object.entries(OSI_STACKS)) {
    for (let n = 1; n <= count; n++) {
      const group = groupAt(svg, svg.indexOf(`<g class="osi-L" id="osi-L-${place}-${n}">`));
      expect(group.match(/class="iso-solid"/g), `${place} ${n}`).toHaveLength(1);
      // Drawn unlit: the driver lights it.
      expect(group, `${place} ${n}`).not.toContain('data-lit');
    }
  }
});

test('the figure says no words of its own; each word has its slot', () => {
  const { svg } = drawOsi();
  for (const words of ['PHYSICAL', 'APPLICATION', 'Your laptop', 'Router', 'Web server', 'OSI REFERENCE MODEL']) {
    expect(svg, words).not.toContain(words);
  }
  const keys = [...svg.matchAll(/ data-label="([^"]+)"/g)].map((m) => m[1]!);
  expect(new Set(keys)).toEqual(new Set(OSI_WORDS));
  // Every slot is drawn empty.
  expect(svg.match(/data-label="[^"]+"[^>]*><\//g)).toHaveLength(keys.length);
  // A layer's word goes on every stack that has that layer, after the number the figure engraves itself.
  for (let n = 1; n <= 7; n++) {
    const stacks = Object.values(OSI_STACKS).filter((count) => count >= n).length;
    expect(keys.filter((key) => key === `layer-${n}`), `layer ${n}`).toHaveLength(stacks);
    expect(svg.split(`>${n}  <tspan data-label="layer-${n}"></tspan></text>`).length - 1, `layer ${n}`).toBe(stacks);
  }
  expect(keys.filter((key) => key === 'layer-1')).toHaveLength(3);
  expect(keys.filter((key) => key === 'layer-4')).toHaveLength(2);
  expect(svg).toMatch(/<text class="iso-face-text" data-label="plate" [^>]*><\/text>/);
});

test('the tag reads 0101', () => {
  expect(drawOsi().svg).toMatch(/<text class="osi-tag-t" [^>]*>0101<\/text>/);
});

test('the data gives the camera, the origin and the two cable rides', () => {
  const data = drawOsi().data as OsiSceneData;
  expect(data.M).toHaveLength(6);
  expect(data.O).toHaveLength(2);
  for (const v of [...data.M, ...data.O]) expect(Number.isFinite(v)).toBe(true);
  expect(Object.keys(data.routes)).toEqual([...OSI_ROUTES]);
  for (const route of Object.values(data.routes)) {
    expect(route).toHaveLength(2);
    // Each ride runs over the cable: its z is CABLE_Z + CABLE_R + 0.4.
    for (const p of route) expect(p[2]).toBe(2.8);
  }
  // From 3 units outside one footprint's corner to 3 units outside the next one's.
  expect(data.routes['laptop>router']).toEqual([
    [-42 + 17 + 3, 52 - 17 - 3, 2.8],
    [10 - 17 - 3, 0 + 17 + 3, 2.8],
  ]);
  expect(data.routes['router>server']).toEqual([
    [30, -20, 2.8],
    [42, -32, 2.8],
  ]);
});

test('the page budget has room for it', async () => {
  const { svg } = drawOsi();
  const gzipped = await new Response(new Blob([svg]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
  expect(gzipped.byteLength).toBeLessThan(100_000);
});

test('drawFigure draws the OSI scene', () => {
  expect(drawFigure('osi')).toEqual(drawOsi());
});

test('the osi figure’s parts', () => {
  expect(FIGURE_PARTS.osi).toEqual({
    places: ['laptop', 'router', 'server'],
    cues: { layer: 'text', peer: 'text' },
    args: OSI_CUE_ARGS,
    routes: OSI_ROUTES,
    words: OSI_WORDS,
    layers: [],
    board: false,
    start: false,
    labels: true,
  });
  const layersOf = (place: string, count: number) => Array.from({ length: count }, (_, i) => `${place}:${i + 1}`);
  expect(OSI_CUE_ARGS).toEqual({
    layer: [...layersOf('laptop', 7), ...layersOf('router', 3), ...layersOf('server', 7)],
    peer: ['1', '2', '3', '4', '5', '6', '7'],
  });
  expect(OSI_ROUTES).toEqual(['laptop>router', 'router>server']);
  expect(OSI_WORDS).toEqual([
    ...[1, 2, 3, 4, 5, 6, 7].map((n) => `layer-${n}`),
    'laptop',
    'laptop-sub',
    'router',
    'router-sub',
    'server',
    'server-sub',
    'plate',
  ]);
});
