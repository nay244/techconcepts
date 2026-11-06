import { expect, test } from 'vitest';
import { sha256, withoutGrain } from '../../test/figure-hash';
import { COVER_IDS, cover, coverStill } from './covers.ts';
import { HERO_WEB, heroWebSvg } from './hero-web.ts';
import { internetThumb } from './internet-thumb.ts';
import { SPOTS, spot } from './spots.ts';

const ALL = (): string[] => [...COVER_IDS.map(cover), ...SPOTS.map(spot), heroWebSvg(), internetThumb()];

test('every figure has role="img" and a non-empty aria-label', () => {
  for (const s of ALL()) {
    expect(s).toMatch(/^<svg[^>]* role="img"/);
    expect(s).toMatch(/aria-label="[^"]+"/);
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

// The figures match the mockups. Each value is the SHA-256 of the reference figure after normalise(), recorded once
// by a one-off script from the approved mockup scripts and pages (never read by this test):
//   cover:*       the figures embedded in illustrations-v3.html (build3.mjs / covers.mjs)
//   spot:*        spots.mjs
//   hero-web*     hero-web.mjs heroSvg() and heroData()
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
  'spot:watch': 'b0a517894e64f146f1a7060c7c5c4163801f74c954703beb08ea5f2aad207cb5',
  'spot:learn': 'f48b830a8519b1d2c7f2d69bdc5fd5ea12a334eb33555ee9b71e0c859dedf66e',
  'spot:practice': '3d5e9a1240082e5e5d920c4b69bae94c3ea2be1bf0e4394e6e4de204c794dc30',
  'spot:subnet': '841d398bd78c4e35fc5f47fea35060e97ddad297312b9138429c778cc083ba1b',
  'spot:dhcp': 'f78beddc71e112c7aa568d07a3a9d4e24a5acdc31dcc58147b3ab59421177a21',
  'spot:firewall': 'c7f5b530c8e16a31768015820a41134c4c55f6ad47e6d6e1d5cf6f857340f368',
  'hero-web': '00847544a78e5bdb839cecc17586f305e1f75fb75416ecd5b0fe2d448c9c81bf',
  'hero-web-data': 'ee57f4896264baaf7022b4b7d0dbe2c63fd8a695216149d1462d99a13b292ea5',
  'internet-thumb': '4fe3a6139382805d18be7e4692e5e3609ea7c477463311dd7078d071d616e04f',
};

test('the figures match the mockups', async () => {
  const actual: Record<string, string> = {};
  for (const id of COVER_IDS) actual[`cover:${id}`] = await sha(cover(id));
  for (const kind of SPOTS) actual[`spot:${kind}`] = await sha(spot(kind));
  actual['hero-web'] = await sha(heroWebSvg());
  const { DRAW, T, PATH, ZERO, TAG_DY } = HERO_WEB;
  actual['hero-web-data'] = await sha256(JSON.stringify({ DRAW, T, PATH, ZERO, TAG_DY }));
  actual['internet-thumb'] = await sha(internetThumb());
  expect(actual).toEqual(EXPECTED);
});

test('the hero caption has one line for each moment', () => {
  expect(HERO_WEB.STEPS).toHaveLength(6);
  HERO_WEB.STEPS.forEach(([title, text]) => {
    expect(title).not.toBe('');
    expect(text).not.toBe('');
  });
});
