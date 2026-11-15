// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
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
  // Drawn for Lesson 08, Router (D10), on 2026-11-14; pinned from its own render, which equals the approved prototype's (the next test).
  'spot:router': 'ca8cae37e086a144dc1c5b49badfdd3f8c6a175297b456f08e098eb112a9dce8',
  // Drawn for ARP, Ports and NAT (D11), on 2026-11-14; pinned from their own renders, which equal prototypes/d11-*-spot.svg (the next tests).
  'spot:arp': 'e09f1f5e2492d4cfdbe20c21bf1916fea07eddb7ad37fcfcd796a8bea16cfafd',
  'spot:ports': '25309fc97cf788731f193bc04a9a0a8ee04f7bf6b10f602d178452d497ccc7ab',
  'spot:nat': '1bac1fc6ef5f054d4797175939a21cde2428349def83216f046f37099fa4d5a0',
  // Drawn for IP Address, MAC Address and TCP/UDP (D12), on 2026-11-15; pinned from their own renders, which equal prototypes/d12-*-spot.svg (the last test).
  'spot:ip-address': 'ae81fd3287d6d09e4ebfe178cd104ce7144a2ea73f3abd48950584c1aa4b7c04',
  'spot:mac-address': '9461b5d34cf6ed4fa1c9aae8ed313544e10d187db0df080e5742b5a036484a35',
  'spot:tcp-udp': '486e78bbae5a044469392f3e4f94cf0ef43d5b1ed566c73aade52acb9cfe9e0c',
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

test('the Router spot is one round router with a lit packet and a three-row table with one light on', () => {
  const svg = spot('router');
  expect(svg).toContain('aria-label="A round router where three cables meet, one coming in and two going out. A lit packet travels down one of the ways out. In front stands its routing table, three routes long, with the route it chose marked."');
  expect(svg).toContain('ROUTING TABLE · NEXT HOP');
  // One lit part: the packet slab.
  expect((svg.match(/data-lit/g) ?? []).length).toBe(1);
  // One light on at the router's front and one in the table's rows: the chosen route's.
  expect((svg.match(/class="lm-led on"/g) ?? []).length).toBe(2);
  expect(svg.match(/<text class="lm-rule"[^>]*>[^<]*</g)!.map((t) => t.replace(/.*>([^<]*)</, '$1'))).toEqual(['198.51.100.0/24', '203.0.113.0/24', '0.0.0.0/0']);
  expect(svg).toMatch(/viewBox="36 44 528 372"/);
});

test('the Router spot is the approved prototype’s art, tag for tag', () => {
  const proto: string = readFileSync('prototypes/d10-router.html', 'utf8');
  const theirs = /<svg xmlns="http:\/\/www.w3.org\/2000\/svg" class="iso-svg lm-svg lm-router"[\s\S]*?<\/svg>/.exec(proto)![0];
  // The prototype's copy carries the xmlns attribute a page needs and an inline figure does not; nothing else differs.
  const lines = (svg: string): string[] => svg.replace(' xmlns="http://www.w3.org/2000/svg"', '').replace(' iso-svg', '').split('><');
  expect(lines(spot('router'))).toEqual(lines(theirs));
});

// D11 / B13, attack cases 1 and 25: the three spots are the approved files, byte for byte, with one lit part each.
test.each([
  ['arp', 2, 'A laptop at the front sends dotted waves across the plate to three devices: a phone, a printer and a router. Only the router answers: a lit card rises from it, marked IS AT.'],
  ['ports', 3, 'A tall server with four numbered doors down its front: 22, 80, 443 and 3389. A light beside the first three is on; 3389’s is dark. A lit packet is halfway through door 80.'],
  ['nat', 3, 'A home router in the middle, with a laptop and a phone behind it and one cable out to the right. Over the laptop’s cable floats a tag with its private address, 192.168.1.100; over the cable out, a lit tag with the router’s public address, 198.51.100.23. A dotted arc joins them over the router.'],
] as const)('the %s spot is prototypes/d11-%s-spot.svg, with one lit part, its lights and its words', (kind, leds, aria) => {
  const file: string = readFileSync(`prototypes/d11-${kind}-spot.svg`, 'utf8');
  expect(`${spot(kind)}\n`).toBe(file);
  const svg = spot(kind);
  expect((svg.match(/data-lit/g) ?? []).length).toBe(1);
  expect((svg.match(/class="lm-led on"/g) ?? []).length).toBe(leds);
  expect(svg).toContain(`aria-label="${aria}"`);
  expect(svg).toMatch(/viewBox="36 44 528 372"/);
});

// D12 / B14, attack cases 1 and 29: the three spots are the approved files, byte for byte, with one lit part each.
test.each([
  ['ip-address', 0, 'An address laid out as four tiles on a plate, 192, 168, 1 and 10, with a dot between each. Under each number its 8 bits are engraved. The first tile, 192 over 11000000, is lit.', 'FOUR OCTETS · 32 BITS'],
  ['mac-address', 1, 'A network card on short legs: a chip, contacts along its edge, a bracket with a socket and a light. Its address is on two labels side by side: the first half, 00:00:5E, is lit; the second, 00:53:10, is not.', 'OUI · THIS CARD'],
  ['tcp-udp', 0, 'Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.', 'TCP · UDP'],
] as const)('the %s spot is prototypes/d12-%s-spot.svg, with one lit part, its lights and its words', (kind, leds, aria, plate) => {
  const file: string = readFileSync(`prototypes/d12-${kind}-spot.svg`, 'utf8');
  expect(`${spot(kind)}\n`).toBe(file);
  const svg = spot(kind);
  expect((svg.match(/data-lit/g) ?? []).length).toBe(1);
  expect((svg.match(/class="lm-led on"/g) ?? []).length).toBe(leds);
  expect(svg).toContain(`aria-label="${aria}"`);
  expect(svg).toContain(plate);
  expect(svg).toMatch(/viewBox="36 44 528 372"/);
});
