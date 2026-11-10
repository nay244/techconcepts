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

test('the page ground is faceplate grey in light and graphite in dark, and the inks read on it', () => {
  expect(tokens.light.ground).toBe('#e4e7e8');
  expect(tokens.dark.ground).toBe('#101315');
  // Patch has no dot grid: the ground is plain.
  expect(Object.keys(tokens.light)).not.toContain('ground-dot');
  for (const theme of ['light', 'dark'] as const) {
    for (const name of ['ink', 'ink-strong', 'muted'] as const) {
      expect(contrastRatio(tokens[theme][name], tokens[theme].ground), `${name} on ground, ${theme}`).toBeGreaterThanOrEqual(4.5);
    }
  }
});

const MIN_DISTANCE = 0.08;

const SITE = [
  'bg', 'bg-soft', 'card', 'card-2', 'tile', 'line', 'line-strong', 'ink', 'ink-strong', 'muted', 'accent', 'accent-ink',
  'accent-soft', 'accent-line', 'here', 'here-soft', 'here-ink', 'link', 'focus', 'dot', 'shadow-sm', 'shadow-lg', 'btn-shadow',
  'allowed-text',
] as const;

/**
 * Every token words are drawn in: the three inks, the orange (the current place, and the thing to do), the blue of
 * a link, the green that says done or right (its text token) and the blocked red (DENY, Lost, Blocked).
 */
const TEXT = ['ink', 'ink-strong', 'muted', 'accent', 'link', 'allowed-text', 'blocked', 'here'] as const;

/**
 * Every ground words sit on, in a theme: the page and card surfaces, the figures' background, and the marigold tint
 * on each surface it is laid on: the page (the track page's Resume) and a card (the console's current place and
 * current lesson, a lesson card's In progress).
 */
function grounds(theme: 'light' | 'dark'): Record<string, string> {
  const t = tokens[theme];
  return {
    bg: t.bg,
    // The page ground itself: bg-soft is the same colour, so words on the bare page are covered.
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

test('the Patch palette is used as recorded in the direction doc', () => {
  expect(tokens.light).toMatchObject({ bg: '#fafbfa', card: '#fafbfa', 'ink-strong': '#12171b', accent: '#b04617', here: '#b04617', link: '#1b56b0', allowed: '#23824a', request: '#1f63c0', response: '#7a4a2b', broadcast: '#b23a8e' });
  expect(tokens.dark).toMatchObject({ bg: '#1a1e21', card: '#1a1e21', 'ink-strong': '#f3f5f6', accent: '#f0702e', here: '#f0702e', link: '#86b4ff', allowed: '#5fd68a', request: '#5aa9ff', response: '#cfa37c', broadcast: '#ff7fc4' });
});

test('one orange: the accent and the current place are the same colour, and the page ground is bg-soft', () => {
  for (const theme of ['light', 'dark'] as const) {
    expect(tokens[theme].here, theme).toBe(tokens[theme].accent);
    expect(tokens[theme]['bg-soft'], theme).toBe(tokens[theme].ground);
  }
});

test('the orange is told apart from every lesson colour, the blocked red most of all (OKLab distance >= 0.08)', () => {
  for (const theme of ['light', 'dark'] as const)
    for (const k of SEMANTIC) expect(distance(tokens[theme].accent, tokens[theme][k]), `accent vs ${k}, ${theme}`).toBeGreaterThanOrEqual(0.08);
});

test('a panel is told apart from the page ground by its edge: the strong line reaches 1.8:1 on both', () => {
  // The surfaces are close in tone on purpose (faceplate on faceplate); the strong line carries the edge.
  for (const theme of ['light', 'dark'] as const) {
    const t = tokens[theme];
    for (const ground of [t.ground, t.card]) expect(contrastRatio(over(t['line-strong'], ground), ground), `line-strong on ${ground}, ${theme}`).toBeGreaterThanOrEqual(1.8);
  }
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
        expect(distance(t[a], t[b]), `${a} vs ${b}`).toBeGreaterThanOrEqual(MIN_DISTANCE);
      }
  });
}

// Green words take allowed-text: the allowed hue moved 15% toward the strongest ink, which keeps them AA on the tints
// and on the figures' background. allowed stays as the mockups have it, for fills, strokes and borders.
test('allowed-text is the allowed green moved 15% toward ink-strong, in both themes', () => {
  expect(tokens.light['allowed-text']).toBe('#207243');
  expect(tokens.dark['allowed-text']).toBe('#75db9a');
  for (const theme of ['light', 'dark'] as const) {
    const t = tokens[theme];
    expect(t['allowed-text'], theme).toBe(mix(t.allowed, t['ink-strong'], 85));
  }
});

test('blocked is red in both themes', () => {
  expect(tokens.dark.blocked).toBe('#ff7a7a');
  // Crimson, a step away from the orange, so "blocked" and "you are here" are not confused.
  expect(tokens.light.blocked).toBe('#bd2140');
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

// A rule may list a shadow token beside another shadow (a hover ring, then the resting shadow). The keyword `none`
// is not allowed in such a list: it would void the whole declaration, ring and all.
test('no shadow token is the keyword none', () => {
  for (const theme of ['light', 'dark'] as const)
    for (const name of ['shadow-sm', 'shadow-lg', 'btn-shadow'] as const) expect(tokens[theme][name], `${name}, ${theme}`).not.toBe('none');
});

