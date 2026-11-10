import { expect, test } from 'vitest';
import { sha256, withoutGrain } from '../../test/figure-hash';
import { COVER_IDS, cover, coverStill } from './covers.ts';
import { internetThumb } from './internet-thumb.ts';
import { SPOTS, spot } from './spots.ts';

const ALL = (): string[] => [...COVER_IDS.map(cover), ...SPOTS.map(spot), internetThumb()];

/** An aria-label with words in it: a label of only spaces says nothing. */
const LABEL = /aria-label="[^"]*\S[^"]*"/;

test('every figure has role="img" and an aria-label with words in it', () => {
  expect('<svg aria-label="   ">').not.toMatch(LABEL);
  for (const s of ALL()) {
    expect(s).toMatch(/^<svg[^>]* role="img"/);
    expect(s).toMatch(LABEL);
  }
});

test('no figure carries film grain', () => ALL().forEach((s) => expect(s).not.toMatch(/lm-grain/)));

test('no figure holds a closing tag an HTML parser would act on', () =>
  ALL().forEach((s) => expect(s).not.toMatch(/<\/(script|style|body|html|head)/i)));

test('two still copies of the same cover share no ids', () => {
  const ids = (s: string): string[] => [...s.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]!);
  for (const id of COVER_IDS) {
    const a = ids(coverStill(id, 'a'));
    const b = ids(coverStill(id, 'b'));
    expect(a.filter((x) => b.includes(x))).toEqual([]);
    expect(new Set(a).size).toBe(a.length);
  }
  // A still copy has no animation hooks; the live cover keeps them.
  expect(coverStill('networking', 'a')).not.toMatch(/data-part/);
  expect(cover('networking')).toMatch(/data-part="packets"/);
});

test('the A+ cover is a figure on the shared plate, with one lit part and its label', () => {
  const svg = cover('aplus');
  expect(svg).toContain('class="iso-svg lm-svg lm-pc');
  expect(svg).toContain('RAM · 2 × 8 GB');
  expect(svg).toMatch(/data-lit/);
  expect(svg).not.toMatch(/feTurbulence|grain/i);
});

// The figures match the mockups. Each value is the SHA-256 of the reference figure after normalise(), recorded once
// by a one-off script from the approved mockup scripts and pages (never read by this test):
//   cover:*       the figures embedded in illustrations-v3.html (build3.mjs / covers.mjs)
//   spot:*        spots.mjs
//   internet-thumb the internet art embedded in track-v2.html (track2.mjs internetArt() over hero.mjs)
// withoutGrain() drops film grain (R2); the drawing is otherwise identical.
const sha = (s: string): Promise<string> => sha256(withoutGrain(s));

const EXPECTED: Record<string, string> = {
  'cover:networking': '8be680954b9566dc0a465d828a79c3595dcc33329452055b2f642265f84aac9a',
  'cover:web': '6ee66e201526e1252f4da806aec8b8d8a1f7e748d2f21de55b7efc36caa15606',
  'cover:crypto': 'b160f0827da4f809ad6e58aa8d1ade3bb6c1eb65780b1ac905985215cd3cf4ec',
  'cover:ai': '4898d061e7ef0672f9709fe222ac857f22eab89b59dc9453d769e8ebb85e7e03',
  'cover:privesc': '81e6e65ad37084cc84eac7e142a95f36c07ef9b85040ba3bb9d629ad98733256',
  'cover:tvm': 'd1a9387a16b7fac9f941ac61588f2681f7422e189d80d0b9fc5169645a2f65d1',
  // Drawn for the Tracks page on 2026-11-07, after the six mockup covers; pinned from its own first approved render.
  'cover:aplus': 'fa694d51b69b6eb9ce3fea6ad1f361e2c2160b4f029340f71ecb8092b24fcc11',
  'spot:watch': 'b0a517894e64f146f1a7060c7c5c4163801f74c954703beb08ea5f2aad207cb5',
  'spot:learn': 'f48b830a8519b1d2c7f2d69bdc5fd5ea12a334eb33555ee9b71e0c859dedf66e',
  'spot:practice': '3d5e9a1240082e5e5d920c4b69bae94c3ea2be1bf0e4394e6e4de204c794dc30',
  'spot:subnet': '841d398bd78c4e35fc5f47fea35060e97ddad297312b9138429c778cc083ba1b',
  'spot:dhcp': 'f78beddc71e112c7aa568d07a3a9d4e24a5acdc31dcc58147b3ab59421177a21',
  'spot:firewall': 'c7f5b530c8e16a31768015820a41134c4c55f6ad47e6d6e1d5cf6f857340f368',
  // Drawn for Lesson 01, OSI Model, on 2026-11-08; pinned from its own first approved render.
  'spot:osi': '3d050c2938f6823ac7d302fa9c204e46d64333d703b838f9a82c2bedc7ac19cc',
  'internet-thumb': '4fe3a6139382805d18be7e4692e5e3609ea7c477463311dd7078d071d616e04f',
};

test('the figures match the mockups', async () => {
  const actual: Record<string, string> = {};
  for (const id of COVER_IDS) actual[`cover:${id}`] = await sha(cover(id));
  for (const kind of SPOTS) actual[`spot:${kind}`] = await sha(spot(kind));
  actual['internet-thumb'] = await sha(internetThumb());
  expect(actual).toEqual(EXPECTED);
});

test('the OSI spot is seven numbered blocks with block 4 lit', () => {
  const svg = spot('osi');
  const blocks = svg.split('<g class="lm-osi-block"').slice(1);
  expect(blocks).toHaveLength(7);
  expect((svg.match(/data-lit/g) ?? []).length).toBe(1);
  expect(blocks[3]).toMatch(/data-lit/);
  blocks.forEach((b, i) => expect(b).toContain(`>${i + 1}</text>`));
  expect(svg).toContain('OSI · SEVEN LAYERS');
  expect(svg).toContain('aria-label="A stack of seven solid blocks, one for each layer, numbered 1 at the bottom to 7 at the top. Block 4 is lit."');
});
