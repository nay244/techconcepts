import type { Theme } from '../lib/theme';

export type TokenName =
  | 'bg'
  | 'bg-soft'
  | 'ground'
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
  | 'here-ink'
  | 'link'
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
 * The Patch look (docs/direction.md §6): a faceplate-grey ground, graphite ink, and the colours of the cable pairs.
 *
 * One orange. `accent` (the thing to do) and `here` (the place you are) are the same colour, and it is used for
 * nothing else. It is also drawn as words, so in the light theme it is the brightest orange that still reaches
 * 4.5:1 on the page ground: the prototype's #c8501a, 12% toward black. Links are the blue pair, `link`.
 *
 * `bg-soft` is the page ground and `bg` is a panel, so anything laid on either is checked against the right one.
 * Panels and the ground are close in tone on purpose; `line-strong` draws the edge between them. There are no
 * resting shadows: `shadow-sm` and `btn-shadow` paint nothing, and `shadow-lg` is kept for what floats over the
 * page. They are a zero-size transparent shadow, not the keyword `none`, because rules list them beside a hover
 * ring, and `none` in a list voids the whole declaration.
 *
 * The eight semantic hues each keep one meaning in every scene of every track: request, response, control
 * (handshakes), broadcast, allowed, blocked, encrypted and selected. They are checked for contrast and for being
 * told apart, from each other and from the orange, in tokens.test.ts. Colour is never the only signal: scenes
 * always pair it with a label, icon or text. Two moved with the look: `response` is the brown pair, because its
 * old orange is now the accent's; light `blocked` is crimson, a step further from the orange.
 *
 * `allowed-text` is the green for words (done, seen, right, new), and `allowed` stays for fills, strokes and
 * borders. The text token is `allowed` moved 15% toward `ink-strong`, written out as a value like every other
 * token: `color-mix(in srgb, allowed 85%, ink-strong)`.
 */
export const tokens: Record<Theme, Record<TokenName, string>> = {
  light: {
    bg: '#fafbfa',
    'bg-soft': '#e4e7e8',
    ground: '#e4e7e8',
    card: '#fafbfa',
    'card-2': '#f2f4f4',
    tile: '#eaeded',
    line: 'rgba(18, 23, 27, 0.14)',
    'line-strong': 'rgba(18, 23, 27, 0.34)',
    ink: '#2b3238',
    'ink-strong': '#12171b',
    muted: '#57626a',
    accent: '#b04617',
    'accent-ink': '#ffffff',
    'accent-soft': 'rgba(176, 70, 23, 0.08)',
    'accent-line': 'rgba(176, 70, 23, 0.32)',
    here: '#b04617',
    'here-soft': 'rgba(176, 70, 23, 0.10)',
    'here-ink': '#ffffff',
    link: '#1b56b0',
    focus: '#12171b',
    dot: 'rgba(18, 23, 27, 0.14)',
    'shadow-sm': '0 0 0 0 transparent',
    'shadow-lg': '0 24px 48px -24px rgba(18, 23, 27, 0.35)',
    'btn-shadow': '0 0 0 0 transparent',
    request: '#1f63c0',
    response: '#7a4a2b',
    control: '#6d42b8',
    broadcast: '#b23a8e',
    allowed: '#23824a',
    'allowed-text': '#207243',
    blocked: '#bd2140',
    encrypted: '#0d7a86',
    selected: '#7a7410',
  },
  dark: {
    bg: '#1a1e21',
    'bg-soft': '#101315',
    ground: '#101315',
    card: '#1a1e21',
    'card-2': '#161a1d',
    tile: '#22272b',
    line: 'rgba(243, 245, 246, 0.10)',
    'line-strong': 'rgba(243, 245, 246, 0.26)',
    ink: '#c6cdd1',
    'ink-strong': '#f3f5f6',
    // A shade lighter than the prototype's #8e989e, which fell to 4.46:1 on a firewall rule's green tint.
    muted: '#949ea4',
    accent: '#f0702e',
    'accent-ink': '#1c0c03',
    'accent-soft': 'rgba(240, 112, 46, 0.12)',
    'accent-line': 'rgba(240, 112, 46, 0.38)',
    here: '#f0702e',
    'here-soft': 'rgba(240, 112, 46, 0.13)',
    'here-ink': '#1c0c03',
    link: '#86b4ff',
    focus: '#ffffff',
    dot: 'rgba(243, 245, 246, 0.14)',
    'shadow-sm': '0 0 0 0 transparent',
    'shadow-lg': '0 24px 48px -24px rgba(0, 0, 0, 0.8)',
    'btn-shadow': '0 0 0 0 transparent',
    request: '#5aa9ff',
    response: '#cfa37c',
    control: '#b697ff',
    broadcast: '#ff7fc4',
    allowed: '#5fd68a',
    'allowed-text': '#75db9a',
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
