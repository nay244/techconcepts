import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
import { drawFigure } from './index';
import { FIGURE_PARTS } from './parts';
import { drawSubnet } from './subnet';

// SHA-256 of the mockup's figure, recorded once by a one-off script (never read by this test) from
// FIGS/subnet-scene.mjs: `sceneSvg()` after normaliseFigure(), and `JSON.stringify(sceneData())`.
// subnet-v1.html embeds the same figure and data.
const EXPECTED = {
  svg: '8a1dc6f1dbc74a5f1a599e11e70462bc08ac482671fa0298967474350ce93b44',
  data: 'ddfcd76a5252ca6e52642c03c888814f885a5dbc8eb90b19b7a0209bef63dfa6',
};

test('drawSubnet matches the mockup scene', async () => {
  const { svg, data } = drawSubnet();
  expect(await sha256(normaliseFigure(svg))).toBe(EXPECTED.svg);
  expect(await sha256(JSON.stringify(data))).toBe(EXPECTED.data);
});

test('the figure names itself for its driver and keeps its ids to itself', () => {
  const { svg } = drawSubnet();
  expect(svg).toMatch(/^<svg data-figure="subnet" class="lm-svg sn" viewBox="[^"]+" role="img" aria-label="[^"]*\S[^"]*">/);
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.filter((id) => !id.startsWith('sn-'))).toEqual([]);
  expect(new Set(ids).size).toBe(ids.length);
});

test('the figure carries no grain and no closing tag an HTML parser would act on', () => {
  const { svg } = drawSubnet();
  expect(svg).not.toMatch(/lm-grain/);
  expect(svg).not.toMatch(/<\/(script|style|body|html|head)/i);
});

// The checksum renames ids, so it would not notice two tags swapping places: each id must carry its own words.
test.each([
  ['local', 'TO .20'],
  ['remote', 'TO .70'],
  ['link', 'TO .5'],
])('#sn-tag-%s carries the words %s', (id, words) => {
  const { svg } = drawSubnet();
  const start = svg.indexOf(` id="sn-tag-${id}"`);
  expect(start).toBeGreaterThan(-1);
  const end = svg.indexOf(' id="sn-tag-', start + 1);
  const group = svg.slice(start, end === -1 ? undefined : end);
  expect([...group.matchAll(/<text class="sn-tag-t"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])).toEqual([words]);
});

test('each team’s callout carries its own name and network', () => {
  const { svg } = drawSubnet();
  for (const [team, name] of [
    ['sales', 'Sales'],
    ['design', 'Design'],
    ['servers', 'Servers'],
    ['guests', 'Guest Wi-Fi'],
  ]) {
    const start = svg.indexOf(`<g class="sn-call" id="sn-call-${team}">`);
    expect(start, team).toBeGreaterThan(-1);
    const group = svg.slice(start, svg.indexOf('</g>', start));
    expect(group).toContain(`<text class="sn-name"`);
    expect(group).toContain(`>${name}</text>`);
    expect(group).toContain(` id="sn-net-${team}"`);
  }
});

test('the data gives the driver the camera, the origin, three routes and two rings', () => {
  const { data } = drawSubnet();
  const d = data as { M: number[]; O: number[]; routes: Record<string, number[][]>; rings: Record<string, number> };
  expect(d.M).toHaveLength(6);
  expect(d.O).toHaveLength(2);
  expect(Object.keys(d.routes)).toEqual(['local', 'remote', 'link']);
  for (const route of Object.values(d.routes)) for (const point of route) expect(point).toHaveLength(3);
  expect(d.rings).toEqual({ all: 250, design: 120 });
});

test('FIGURE_PARTS.subnet lists the places, the mockup’s fx as cues, and the board', () => {
  expect(FIGURE_PARTS.subnet).toEqual({
    places: ['laptop', 'printer', 'pc', 'router', 'provider'],
    cues: {
      glow: 'text',
      focus: 'text',
      'one-net': 'flag',
      cut: 'flag',
      link: 'flag',
      pulse: 'text',
      ring: 'text',
      route: 'text',
      busy: 'text',
    },
    layers: [],
    board: true,
    start: false,
  });
});

test('drawFigure draws the Subnetting scene', () => {
  expect(drawFigure('subnet')).toEqual(drawSubnet());
});
