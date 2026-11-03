import { expect, test } from 'vitest';
import { contrastRatio, hexToRgb } from '../lib/contrast';
import { tokens, tokensToCss } from './tokens';

const SEMANTIC = ['request', 'response', 'control', 'broadcast', 'allowed', 'blocked', 'encrypted', 'selected'] as const;

// Perceptual colour distance in OKLab. Used to prove the eight semantic hues
// can be told apart, not just that each one is readable.
function oklab(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function distance(a: string, b: string): number {
  const [l1, a1, b1] = oklab(a);
  const [l2, a2, b2] = oklab(b);
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2);
}

test('contrastRatio sanity', () => expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0));

test('contrastRatio is symmetric and 1:1 for identical colours', () => {
  expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5);
  expect(contrastRatio('#336699', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#336699'), 10);
});

test('contrastRatio accepts three-digit hex', () => {
  expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 0);
});

for (const theme of ['light', 'dark'] as const) {
  const t = tokens[theme];
  test(`${theme}: text tokens meet 4.5:1 on bg and panel`, () => {
    for (const ink of ['ink', 'ink-strong', 'ink-muted'] as const)
      for (const bg of ['bg', 'panel', 'panel-raised'] as const)
        expect(contrastRatio(t[ink], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
  test(`${theme}: semantic tokens meet 3:1 on panel`, () => {
    for (const k of [...SEMANTIC, 'focus'] as const) expect(contrastRatio(t[k], t.panel)).toBeGreaterThanOrEqual(3);
  });
  test(`${theme}: semantic tokens also meet 3:1 on bg and panel-raised`, () => {
    for (const k of [...SEMANTIC, 'focus'] as const)
      for (const bg of ['bg', 'panel-raised'] as const) expect(contrastRatio(t[k], t[bg])).toBeGreaterThanOrEqual(3);
  });
  test(`${theme}: the eight semantic hues are clearly distinct from each other`, () => {
    for (let i = 0; i < SEMANTIC.length; i++)
      for (let j = i + 1; j < SEMANTIC.length; j++) {
        const d = distance(t[SEMANTIC[i]], t[SEMANTIC[j]]);
        expect(d, `${SEMANTIC[i]} vs ${SEMANTIC[j]}`).toBeGreaterThanOrEqual(0.1);
      }
  });
  test(`${theme}: every token is a six-digit hex colour`, () => {
    for (const v of Object.values(t)) expect(v).toMatch(/^#[0-9a-f]{6}$/);
  });
  test(`${theme}: no Protocol Explorer colors`, () => {
    const banned = ['#0b1020', '#0f1628', '#3c649f', '#afc4f2', '#1f5fe0', '#00ef98', '#f8b900'];
    expect(
      Object.values(t)
        .map((v) => v.toLowerCase())
        .filter((v) => banned.includes(v)),
    ).toEqual([]);
  });
}

test('both themes define the same token names', () => {
  expect(Object.keys(tokens.light).sort()).toEqual(Object.keys(tokens.dark).sort());
});

test('tokensToCss covers both themes and the no-JS fallback', () => {
  const css = tokensToCss();
  expect(css).toContain('[data-theme="dark"]');
  expect(css).toContain('[data-theme="light"]');
  expect(css).toContain('prefers-color-scheme');
  expect(css).toContain('--request:');
});

test('tokensToCss emits every token as a custom property in both themes', () => {
  const css = tokensToCss();
  for (const theme of ['light', 'dark'] as const)
    for (const [name, value] of Object.entries(tokens[theme])) expect(css).toContain(`--${name}: ${value};`);
});

test('tokensToCss defaults to dark and only switches to light on request', () => {
  const css = tokensToCss();
  // Without data-theme (no JS) the page is dark unless the OS asks for light.
  expect(css).toMatch(/:root\s*\{[^}]*color-scheme: dark/);
  expect(css).toMatch(/@media \(prefers-color-scheme: light\)\s*\{\s*:root:not\(\[data-theme\]\)/);
});
