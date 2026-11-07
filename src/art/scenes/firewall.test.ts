import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
import { drawFirewall, type FirewallSceneData } from './firewall';
import { drawFigure } from './index';
import { FIGURE_PARTS } from './parts';

// SHA-256 of the mockup's figure, recorded once by a one-off script (never read by this test) from
// FIGS/firewall-scene.mjs: `sceneSvg()` after normaliseFigure(), and `JSON.stringify(sceneData())`.
// firewalls-v1.html embeds the same figure and data.
const EXPECTED = {
  svg: 'eb46d254d5aca356ca10d99d1849c400c9d31d0f4ed2b983e50c1841558dee62',
  data: 'd917259e6230ee6c7fb0879cfe442047453714c3ef150649658527f8aa7b5c85',
};

test('drawFirewall matches the mockup scene', async () => {
  const { svg, data } = drawFirewall();
  expect(await sha256(normaliseFigure(svg))).toBe(EXPECTED.svg);
  expect(await sha256(JSON.stringify(data))).toBe(EXPECTED.data);
});

test('the figure names itself for its driver and keeps its ids to itself', () => {
  const { svg } = drawFirewall();
  expect(svg).toMatch(/^<svg data-figure="firewall" class="lm-svg fw" viewBox="[^"]+" role="img" aria-label="[^"]*\S[^"]*">/);
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.filter((id) => !id.startsWith('fw-'))).toEqual([]);
  expect(new Set(ids).size).toBe(ids.length);
});

test('the figure carries no grain and no closing tag an HTML parser would act on', () => {
  const { svg } = drawFirewall();
  expect(svg).not.toMatch(/lm-grain/);
  expect(svg).not.toMatch(/<\/(script|style|body|html|head)/i);
});

// The checksum renames ids, so it would not notice two tags swapping places: each id must carry its own words.
test.each([
  ['https', 'HTTPS 443'],
  ['ssh', 'SSH 22'],
  ['telnet', 'TELNET 23'],
  ['reply', 'REPLY 443'],
])('#fw-tag-%s carries the words %s', (id, words) => {
  const { svg } = drawFirewall();
  const start = svg.indexOf(` id="fw-tag-${id}"`);
  expect(start).toBeGreaterThan(-1);
  const end = svg.indexOf(' id="fw-tag-', start + 1);
  const group = svg.slice(start, end === -1 ? svg.indexOf('</g><g class="fw-stop"', start) : end);
  expect([...group.matchAll(/<text class="fw-tag-t"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])).toEqual([words]);
});

test('the parts the driver moves are there: the board’s three empty rows, the arms, the bar, the stop, the trail and both layers', () => {
  const { svg } = drawFirewall();
  for (const id of ['fw-arms-down', 'fw-arms-up', 'fw-bar', 'fw-stop', 'fw-trail', 'fw-busy-server', 'fw-glow-visitor', 'fw-glow-admin']) {
    expect(svg, id).toContain(` id="${id}"`);
  }
  for (const id of ['visitor', 'admin', 'firewall', 'server', 'rules']) expect(svg, id).toContain(` id="fw-call-${id}"`);
  // The board is written by the driver, from the rule list the lesson's panel holds.
  for (const i of [0, 1, 2]) expect(svg).toContain(`<text class="fw-brow-t" id="fw-brow-t-${i}" `);
  expect(svg).not.toContain(' id="fw-brow-3"');
  expect([...svg.matchAll(/<text class="fw-brow-t"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])).toEqual(['', '', '']);
  // Every tag starts in the front layer; the masked layer behind the wall starts empty.
  expect(svg).toContain('<g id="fw-layer-behind" mask="url(#fw-behind)"></g><g id="fw-layer-front"><g class="fw-tag" id="fw-tag-https"');
  expect(svg).toContain('<mask id="fw-behind" ');
  for (const words of ['THE INTERNET', 'OFFICE', 'RULES · TOP DOWN', 'FIREWALL · FIRST MATCH WINS']) expect(svg).toContain(words);
});

test('the data gives the camera, the origin, the wall’s front and three routes that meet at the gate', () => {
  const data = drawFirewall().data as FirewallSceneData;
  expect(data.M).toHaveLength(6);
  expect(data.O).toHaveLength(2);
  expect(data.wallFront).toBe(0);
  expect(Object.keys(data.routes)).toEqual(['visitor', 'admin', 'inside']);
  const { visitor, admin, inside } = data.routes;
  // A visit waits at the gate, in front of the wall, where the way inside begins; the way inside ends behind it.
  expect(visitor.at(-1)).toEqual(inside[0]);
  expect(admin.at(-1)).toEqual(inside[0]);
  expect(inside[0]![1]).toBeGreaterThan(data.wallFront);
  expect(inside.at(-1)![1]).toBeLessThan(data.wallFront);
  for (const p of [...visitor, ...admin]) expect(p[1]).toBeGreaterThan(data.wallFront);
});

test('drawFigure draws the Firewalls scene', () => {
  expect(drawFigure('firewall')).toEqual(drawFirewall());
});

test('the firewall figure names its four places and its rules cue, and takes no board and no start', () => {
  expect(FIGURE_PARTS.firewall).toEqual({ places: ['visitor', 'admin', 'firewall', 'web'], cues: { rules: 'text' }, layers: [], board: false, start: false });
});
