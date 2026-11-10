// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { contrastRatio, hexToRgb } from '../lib/contrast';
import { mix, over } from '../test/paint';
import { tokens, tokensToCss } from './tokens';

const lumenCss: string = readFileSync(new URL('../art/lumen.css', import.meta.url), 'utf8');

/** The figures' background in a theme, from lumen.css: the ground a figure's callouts sit on. */
function figBg(theme: 'light' | 'dark'): string {
  const match = new RegExp(`\\[data-theme="${theme}"\\]\\s*\\{[^}]*--fig-bg:\\s*(#[0-9a-f]{3,6})`, 'i').exec(lumenCss);
  if (match === null) throw new Error(`No --fig-bg for ${theme} in lumen.css.`);
  return match[1]!;
}

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

test('ground and its dots are defined for both themes', () => {
  expect(tokens.light.ground).toBe('#f4f7fb');
  expect(tokens.dark.ground).toBe('#060c17');
  expect(tokens.light['ground-dot']).toBe('rgba(31, 99, 192, 0.13)');
  expect(tokens.dark['ground-dot']).toBe('rgba(127, 176, 234, 0.13)');
  for (const theme of ['light', 'dark'] as const) {
    for (const name of ['ink', 'ink-strong', 'muted'] as const) {
      expect(contrastRatio(tokens[theme][name], tokens[theme].ground), `${name} on ground, ${theme}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});

const MIN_DISTANCE = 0.08;
// Ruling R4: the one exception. Light response and blocked are fixed by the approved mockups and are 0.077 apart.
const EXCEPTION = { theme: 'light', a: 'response', b: 'blocked', min: 0.07 } as const;

const SITE = [
  'bg', 'bg-soft', 'card', 'card-2', 'tile', 'line', 'line-strong', 'ink', 'ink-strong', 'muted', 'accent', 'accent-ink',
  'accent-soft', 'accent-line', 'here', 'here-soft', 'here-ink', 'focus', 'dot', 'shadow-sm', 'shadow-lg', 'btn-shadow',
  'allowed-text',
] as const;

/**
 * Every token words are drawn in: the three inks, the accent (links), the green that says done or right (its text
 * token), the blocked red (DENY, Lost, Blocked) and marigold (the current place).
 */
const TEXT = ['ink', 'ink-strong', 'muted', 'accent', 'allowed-text', 'blocked', 'here'] as const;

/**
 * Every ground words sit on, in a theme: the page and card surfaces, the figures' background, and the marigold tint
 * on each surface it is laid on: the page (the track page's Resume) and a card (the console's current place and
 * current lesson, a lesson card's In progress).
 */
function grounds(theme: 'light' | 'dark'): Record<string, string> {
  const t = tokens[theme];
  return {
    bg: t.bg,
    'bg-soft': t['bg-soft'],
    card: t.card,
    'card-2': t['card-2'],
    tile: t.tile,
    'fig-bg': figBg(theme),
    'here-soft on bg': over(t['here-soft'], t.bg),
    'here-soft on card': over(t['here-soft'], t.card),
  };
}

/**
 * Pairs that never meet on the site, each with the reason, as `'<text> on <ground>'`. None today: Home's hero, whose
 * welcome-back eyebrow was the one marigold tint with ink-strong words, went with the insideout redesign.
 */
const NEVER_MEET: Record<string, string> = {};

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
  expect(tokens.light).toMatchObject({ bg: '#ffffff', 'ink-strong': '#0b1a33', accent: '#1f63c0', here: '#9b6200', allowed: '#23824a', request: '#1f63c0', response: '#b4540a', broadcast: '#b23a8e' });
  expect(tokens.dark).toMatchObject({ bg: '#060c17', 'ink-strong': '#f2f7ff', accent: '#5aa9ff', here: '#f5b83d', allowed: '#5fd68a', request: '#5aa9ff', response: '#ff9f5a', broadcast: '#ff7fc4' });
});

for (const theme of ['light', 'dark'] as const) {
  const t = tokens[theme];
  test(`${theme}: ink, muted, accent, here and every semantic token reach 4.5:1 on bg and card`, () => {
    for (const k of ['ink', 'ink-strong', 'muted', 'accent', 'here', ...SEMANTIC] as const)
      for (const bg of ['bg', 'card'] as const) expect(contrastRatio(t[k], t[bg]), `${k} on ${bg}`).toBeGreaterThanOrEqual(4.5);
  });
  // Ruling R1, amended: a figure's current callout name is drawn in `here` on the figures' background.
  test(`${theme}: here reaches 4.5:1 on the figures' background (lumen.css --fig-bg)`, () => {
    expect(contrastRatio(t.here, figBg(theme)), `here on ${figBg(theme)}`).toBeGreaterThanOrEqual(4.5);
  });
  // Every text token on every ground words sit on, so a tinted ground cannot slip a colour below AA unseen.
  test(`${theme}: every text token reaches 4.5:1 on every ground words sit on`, () => {
    for (const k of TEXT)
      for (const [name, ground] of Object.entries(grounds(theme))) {
        if (Object.hasOwn(NEVER_MEET, `${k} on ${name}`)) continue;
        expect(contrastRatio(t[k], ground), `${k} on ${name} (${ground})`).toBeGreaterThanOrEqual(4.5);
      }
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

// Green words take allowed-text: the allowed hue moved 15% toward the strongest ink, which keeps them AA on the tints
// and on the figures' background. allowed stays as the mockups have it, for fills, strokes and borders.
test('allowed-text is the allowed green moved 15% toward ink-strong, in both themes', () => {
  expect(tokens.light['allowed-text']).toBe('#1f7247');
  expect(tokens.dark['allowed-text']).toBe('#75db9c');
  for (const theme of ['light', 'dark'] as const) {
    const t = tokens[theme];
    expect(t['allowed-text'], theme).toBe(mix(t.allowed, t['ink-strong'], 85));
  }
});

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
