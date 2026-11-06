import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
import { drawDhcp } from './dhcp';
import { drawFigure } from './index';

// SHA-256 of the mockup's figure, recorded once by a one-off script (never read by this test) from
// FIGS/dhcp-scene.mjs: `sceneSvg({ macL: '00:00:5E:00:53:10', macP: '00:00:5E:00:53:11' })` after
// normaliseFigure(), and `JSON.stringify(sceneData())`. lesson-v3.html embeds the same figure and data.
const EXPECTED = {
  svg: '8414027cdbc30bd69f0625f4ed8131ec66881fe8f653307ce8548b21531b28e0',
  data: '969cd64971249ef70365653b9e9669592bf68884e6514a078030a6c21f75409a',
};

test('drawDhcp matches the mockup scene', async () => {
  const { svg, data } = drawDhcp();
  expect(await sha256(normaliseFigure(svg))).toBe(EXPECTED.svg);
  expect(await sha256(JSON.stringify(data))).toBe(EXPECTED.data);
});

test('the figure names itself for its driver and keeps its ids to itself', () => {
  const { svg } = drawDhcp();
  expect(svg).toMatch(/^<svg data-figure="dhcp" class="lm-svg dh" viewBox="[^"]+" role="img" aria-label="[^"]+">/);
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  expect(ids.length).toBeGreaterThan(0);
  expect(ids.filter((id) => !id.startsWith('dh-'))).toEqual([]);
  expect(new Set(ids).size).toBe(ids.length);
});

test('the figure carries no grain and no closing tag an HTML parser would act on', () => {
  const { svg } = drawDhcp();
  expect(svg).not.toMatch(/lm-grain/);
  expect(svg).not.toMatch(/<\/(script|style|body|html|head)/i);
});

test('drawFigure draws the DHCP scene', () => {
  expect(drawFigure('dhcp')).toEqual(drawDhcp());
});
