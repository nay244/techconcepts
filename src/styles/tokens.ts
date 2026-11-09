import type { Theme } from '../lib/theme';

export type TokenName =
  | 'bg'
  | 'bg-soft'
  | 'ground'
  | 'ground-dot'
  | 'card'
  | 'card-2'
  | 'tile'
  | 'line'
  | 'line-strong'
  | 'ink'
  | 'ink-strong'
  | 'muted'
  | 'accent'
  | 'accent-ink'
  | 'accent-soft'
  | 'accent-line'
  | 'here'
  | 'here-soft'
  | 'focus'
  | 'dot'
  | 'shadow-sm'
  | 'shadow-lg'
  | 'btn-shadow'
  | 'request'
  | 'response'
  | 'control'
  | 'broadcast'
  | 'allowed'
  | 'allowed-text'
  | 'blocked'
  | 'encrypted'
  | 'selected';

/**
 * The eight semantic hues each keep one meaning in every scene of every track:
 * request, response, control (handshakes), broadcast, allowed, blocked,
 * encrypted and selected. They are checked for contrast and mutual distinctness
 * in tokens.test.ts. Colour is never the only signal: scenes always pair it
 * with a label, icon or text.
 *
 * Surfaces, ink, accent and the first five hues are the approved mockups'
 * values (home-v6, track-v2, firewalls-v1); `here` is darkened in the light
 * theme so it reaches 4.5:1 on white and on the figures' background (`--fig-bg`
 * in lumen.css, where a current callout's name sits): the mockups' #a66900 at
 * the same hue, darker, is #9b6200 (5.07:1 on white, 4.51:1 on #eef2f7). The
 * mockups do not define control, encrypted or selected, so those three are
 * chosen here.
 *
 * `allowed-text` is the green for words (done, seen, right, new), and `allowed`
 * stays for fills, strokes and borders, as the mockups draw them. Light
 * `allowed` reaches 4.5:1 only on white, so the text token is `allowed` moved
 * 15% toward `ink-strong`, written out as a value like every other token:
 * `color-mix(in srgb, allowed 85%, ink-strong)` is #1f7247 light (5.2:1 or
 * more on every ground words sit on) and #75db9c dark.
 */
export const tokens: Record<Theme, Record<TokenName, string>> = {
  light: {
    bg: '#ffffff',
    'bg-soft': '#f4f7fb',
    ground: '#f4f7fb',
    'ground-dot': 'rgba(31, 99, 192, 0.13)',
    card: '#ffffff',
    'card-2': '#f8fafd',
    tile: '#eef3f9',
    line: 'rgba(11, 26, 51, 0.10)',
    'line-strong': 'rgba(11, 26, 51, 0.18)',
    ink: '#3a4860',
    'ink-strong': '#0b1a33',
    muted: '#5a6780',
    accent: '#1f63c0',
    'accent-ink': '#ffffff',
    'accent-soft': 'rgba(31, 99, 192, 0.07)',
    'accent-line': 'rgba(31, 99, 192, 0.22)',
    here: '#9b6200',
    'here-soft': 'rgba(214, 146, 20, 0.12)',
    focus: '#0b1a33',
    dot: 'rgba(31, 99, 192, 0.16)',
    'shadow-sm': '0 1px 2px rgba(11, 26, 51, 0.04), 0 8px 24px -12px rgba(11, 26, 51, 0.16)',
    'shadow-lg': '0 1px 2px rgba(11, 26, 51, 0.05), 0 28px 56px -28px rgba(11, 26, 51, 0.30)',
    'btn-shadow': '0 10px 24px -12px rgba(31, 99, 192, 0.75)',
    request: '#1f63c0',
    response: '#b4540a',
    control: '#6d42b8',
    broadcast: '#b23a8e',
    allowed: '#23824a',
    'allowed-text': '#1f7247',
    blocked: '#c22f2b',
    encrypted: '#0d7a86',
    selected: '#7a7410',
  },
  dark: {
    bg: '#060c17',
    'bg-soft': '#0a1322',
    ground: '#060c17',
    'ground-dot': 'rgba(127, 176, 234, 0.13)',
    card: '#0c1728',
    'card-2': '#0a1424',
    tile: '#142339',
    line: 'rgba(127, 176, 234, 0.13)',
    'line-strong': 'rgba(127, 176, 234, 0.24)',
    ink: '#c3d1e6',
    'ink-strong': '#f2f7ff',
    muted: '#93a8c6',
    accent: '#5aa9ff',
    'accent-ink': '#04101f',
    'accent-soft': 'rgba(90, 169, 255, 0.09)',
    'accent-line': 'rgba(90, 169, 255, 0.30)',
    here: '#f5b83d',
    'here-soft': 'rgba(245, 184, 61, 0.12)',
    focus: '#ffffff',
    dot: 'rgba(127, 176, 234, 0.16)',
    'shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.3), 0 12px 32px -16px rgba(0, 0, 0, 0.6)',
    'shadow-lg': '0 1px 2px rgba(0, 0, 0, 0.3), 0 30px 60px -28px rgba(0, 0, 0, 0.75)',
    'btn-shadow': '0 10px 28px -12px rgba(90, 169, 255, 0.6)',
    request: '#5aa9ff',
    response: '#ff9f5a',
    control: '#b697ff',
    broadcast: '#ff7fc4',
    allowed: '#5fd68a',
    'allowed-text': '#75db9c',
    blocked: '#ff7a7a',
    encrypted: '#4fd6e6',
    selected: '#e8d95c',
  },
};

function declarations(theme: Theme): string {
  const lines = Object.entries(tokens[theme]).map(([name, value]) => `  --${name}: ${value};`);
  return [`  color-scheme: ${theme};`, ...lines].join('\n');
}

/**
 * CSS custom properties for both themes, keyed the way the mockups key them
 * (light on `:root` and `[data-theme="light"]`, dark on `[data-theme="dark"]`).
 * With no `data-theme` (JavaScript off) the page follows `prefers-color-scheme`;
 * an explicit `data-theme` (boot script or toggle) wins in both directions: the
 * media rule only matches `:root:not([data-theme])`, and the explicit dark block
 * comes last.
 */
export function tokensToCss(): string {
  const dark = declarations('dark');
  return [
    `:root,\n[data-theme="light"] {\n${declarations('light')}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n${dark.replace(/^/gm, '  ')}\n  }\n}`,
    `[data-theme="dark"] {\n${dark}\n}`,
  ].join('\n');
}
