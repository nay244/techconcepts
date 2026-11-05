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

const MIN_DISTANCE = 0.08;
// Ruling R4: the one exception. Light response and blocked are fixed by the approved mockups and are 0.077 apart.
const EXCEPTION = { theme: 'light', a: 'response', b: 'blocked', min: 0.07 } as const;

const SITE = [
  'bg', 'bg-soft', 'card', 'card-2', 'tile', 'line', 'line-strong', 'ink', 'ink-strong', 'muted', 'accent', 'accent-ink',
  'accent-soft', 'accent-line', 'here', 'here-soft', 'focus', 'dot', 'hero-bg', 'hero-glow', 'shadow-sm', 'shadow-lg', 'btn-shadow',
] as const;

test('contrastRatio sanity', () => expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0));

test('contrastRatio is symmetric and 1:1 for identical colours', () => {
  expect(contrastRatio('#336699', '#336699')).toBeCloseTo(1, 5);
  expect(contrastRatio('#336699', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#336699'), 10);
});

test('contrastRatio accepts three-digit hex', () => {
  expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 0);
});

test('every theme defines the same tokens, including the eight semantic ones', () => {
  expect(Object.keys(tokens.light).sort()).toEqual(Object.keys(tokens.dark).sort());
  for (const k of [...SITE, ...SEMANTIC]) expect(Object.keys(tokens.light)).toContain(k);
});

test('the mockup palette is used as given', () => {
  expect(tokens.light).toMatchObject({ bg: '#ffffff', 'ink-strong': '#0b1a33', accent: '#1f63c0', here: '#a66900', allowed: '#23824a', request: '#1f63c0', response: '#b4540a', broadcast: '#b23a8e' });
  expect(tokens.dark).toMatchObject({ bg: '#060c17', 'ink-strong': '#f2f7ff', accent: '#5aa9ff', here: '#f5b83d', allowed: '#5fd68a', request: '#5aa9ff', response: '#ff9f5a', broadcast: '#ff7fc4' });
});

for (const theme of ['light', 'dark'] as const) {
  const t = tokens[theme];
  test(`${theme}: ink, muted, accent, here and every semantic token reach 4.5:1 on bg and card`, () => {
    for (const k of ['ink', 'ink-strong', 'muted', 'accent', 'here', ...SEMANTIC] as const)
      for (const bg of ['bg', 'card'] as const) expect(contrastRatio(t[k], t[bg]), `${k} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  });
  test(`${theme}: focus reaches 3:1 on bg`, () => {
    expect(contrastRatio(t.focus, t.bg)).toBeGreaterThanOrEqual(3);
  });
  test(`${theme}: the eight semantic hues stay apart (OKLab distance >= 0.08)`, () => {
    for (let i = 0; i < SEMANTIC.length; i++)
      for (let j = i + 1; j < SEMANTIC.length; j++) {
        const [a, b] = [SEMANTIC[i], SEMANTIC[j]];
        const isException = theme === EXCEPTION.theme && a === EXCEPTION.a && b === EXCEPTION.b;
        expect(distance(t[a], t[b]), `${a} vs ${b}`).toBeGreaterThanOrEqual(isException ? EXCEPTION.min : MIN_DISTANCE);
      }
  });
}

test('blocked is red in both themes', () => {
  expect(tokens.dark.blocked).toBe('#ff7a7a');
  expect(tokens.light.blocked).toBe('#c22f2b');
});

test('tokensToCss emits [data-theme="dark"] and a light block that also covers :root', () => {
  const css = tokensToCss();
  expect(css).toMatch(/:root,\s*\[data-theme="light"\]\s*\{/);
  expect(css).toContain('\n[data-theme="dark"] {');
  for (const theme of ['light', 'dark'] as const)
    for (const [name, value] of Object.entries(tokens[theme])) expect(css).toContain(`--${name}: ${value};`);
});

// Ruling R5: with no data-theme (JavaScript off) the page follows the system; an explicit data-theme wins both ways.
test('tokensToCss follows prefers-color-scheme only when data-theme is absent, and data-theme wins', () => {
  const css = tokensToCss();
  const block = (theme: 'light' | 'dark') => Object.entries(tokens[theme]).map(([n, v]) => `--${n}: ${v};`).join('\n  ');
  const lightAt = css.indexOf(':root,\n[data-theme="light"] {');
  const mediaAt = css.indexOf('@media (prefers-color-scheme: dark) {');
  const darkAt = css.indexOf('\n[data-theme="dark"] {');
  // Order matters: the explicit dark block comes last so it beats the media rule at equal specificity.
  expect(lightAt).toBe(0);
  expect(mediaAt).toBeGreaterThan(lightAt);
  expect(darkAt).toBeGreaterThan(mediaAt);
  // No data-theme + dark preference: the media rule is scoped to :root:not([data-theme]) and carries the dark values.
  const media = css.slice(mediaAt, darkAt);
  expect(media).toContain(':root:not([data-theme]) {');
  expect(media).toContain('color-scheme: dark;');
  for (const [n, v] of Object.entries(tokens.dark)) expect(media).toContain(`--${n}: ${v};`);
  // data-theme="light" with a dark preference: the media rule cannot match it, so the light block stands.
  expect(css.slice(lightAt, mediaAt)).toContain(block('light'));
  expect(css.slice(darkAt)).toContain(block('dark'));
});
