// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { normaliseFigure, sha256 } from '../../test/figure-hash';
import { ADDRESSES_OPEN, FRAME_TAG_OPEN, FRAMES_OPEN, groupsOf, inDocumentOrder, TO_ALL_TAG_OPEN, withoutFrames } from '../../test/svg-groups';
import { drawDhcp, type DhcpSceneData } from './dhcp';
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
  // D12's frames groups come out whole first, then the three `addresses` wrappers are unwrapped; the data loses `ringAt` and `places`.
  expect(await sha256(normaliseFigure(withoutFrames(svg)))).toBe(EXPECTED.svg);
  const { ringAt, places, ...mockup } = data as DhcpSceneData;
  expect(ringAt && places).toBeTruthy();
  expect(await sha256(JSON.stringify(mockup))).toBe(EXPECTED.data);
});

// D12 / B14, attack cases 3 to 6: the file is the art, and the code emits it.
const HEADER = '<svg xmlns="http://www.w3.org/2000/svg" class="lm-svg dh" viewBox="-73 -30 668 318">';

test('prototypes/d12-part-frames.svg is the frames groups the plate draws, whole and in document order', () => {
  const { svg } = drawDhcp();
  const found = [FRAMES_OPEN, FRAME_TAG_OPEN, TO_ALL_TAG_OPEN].flatMap((open) => groupsOf(svg, open).groups);
  // Two setups (the TV, then the callouts), and one group for each tag; opened in this order they would not be the document's.
  expect(found).toHaveLength(4);
  expect(groupsOf(svg, FRAMES_OPEN).groups).toHaveLength(2);
  const file: string = readFileSync('prototypes/d12-part-frames.svg', 'utf8');
  expect(file.startsWith(HEADER)).toBe(true);
  expect(file.endsWith('</svg>\n')).toBe(true);
  expect(file.slice(HEADER.length, -'</svg>\n'.length)).toBe(inDocumentOrder(svg, found).join(''));
  // The callouts come after the tags in the document, whatever order they were opened in.
  expect(inDocumentOrder(svg, found)).toEqual([found[0], found[2], found[3], found[1]]);
});

test('the plate has three addresses wrappers, which hold what DHCP draws and nothing the frames setup does', () => {
  const { svg } = drawDhcp();
  const { groups } = groupsOf(svg, ADDRESSES_OPEN);
  expect(groups).toHaveLength(3);
  const all = groups.join('');
  for (const id of ['dh-lease-row', 'dh-laptop-ip', 'dh-ignore']) expect(all).toContain(` id="${id}"`);
  for (const id of ['dh-tv-glow', 'dh-v-tv', 'dh-split']) expect(all).not.toContain(` id="${id}"`);
});

test('the plate keeps its frame, and each new id is there once', () => {
  const { svg } = drawDhcp();
  expect(svg).toContain('viewBox="-73 -30 668 318"');
  const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  for (const id of ['dh-tv-glow', 'dh-tag-frame', 'dh-tag-to-all', 'dh-v-router', 'dh-v-laptop', 'dh-v-phone', 'dh-v-tv', 'dh-mac-laptop', 'dh-split']) {
    expect(ids.filter((x) => x === id), id).toHaveLength(1);
  }
});

test('the ring starts at the laptop or the router, and each device stands where the ring reaches it', () => {
  const data = drawDhcp().data as DhcpSceneData;
  expect(data.ringAt).toEqual({ laptop: [-67, 23], router: [-11, -49] });
  expect(data.places.tv).toEqual([65, -62.5]);
  expect(data.places.phone).toEqual([66, 34.6]);
  expect(data.places.laptop).toEqual(data.ringAt.laptop);
  expect(data.places.router).toEqual(data.ringAt.router);
});

test('the frames setup is hidden in the drawing, and the drawing’s own words are DHCP’s', () => {
  const { svg } = drawDhcp();
  expect(svg).toContain('aria-label="A home Wi-Fi network on one plate: a laptop with no address yet, a phone, and the router that hands out addresses, with its lease table beside it."');
  expect(svg).toContain('<g data-setup="frames" display="none">');
});

test('the figure names itself for its driver and keeps its ids to itself', () => {
  const { svg } = drawDhcp();
  expect(svg).toMatch(/^<svg data-figure="dhcp" class="lm-svg dh" viewBox="[^"]+" role="img" aria-label="[^"]*\S[^"]*">/);
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

// The checksum renames ids, so it would not notice two tags swapping places: each id must carry its own word.
test.each([
  ['discover', 'DISCOVER'],
  ['offer', 'OFFER'],
  ['request', 'REQUEST'],
  ['ack', 'ACK'],
  ['renew', 'RENEW'],
  ['frame', 'FRAME'],
  ['to-all', 'TO ALL'],
])('#dh-tag-%s carries the word %s', (id, word) => {
  const { svg } = drawDhcp();
  const start = svg.indexOf(` id="dh-tag-${id}"`);
  expect(start).toBeGreaterThan(-1);
  const end = svg.indexOf(' id="dh-tag-', start + 1);
  const group = svg.slice(start, end === -1 ? undefined : end);
  expect([...group.matchAll(/<text class="dh-tag-t"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])).toEqual([word]);
});

test('drawFigure draws the DHCP scene', () => {
  expect(drawFigure('dhcp')).toEqual(drawDhcp());
});
