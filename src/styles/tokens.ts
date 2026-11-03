import type { Theme } from '../lib/theme';

export type TokenName =
  | 'bg'
  | 'panel'
  | 'panel-raised'
  | 'line'
  | 'line-strong'
  | 'ink'
  | 'ink-strong'
  | 'ink-muted'
  | 'request'
  | 'response'
  | 'control'
  | 'broadcast'
  | 'allowed'
  | 'blocked'
  | 'encrypted'
  | 'selected'
  | 'focus';

/**
 * The eight semantic hues each keep one meaning in every scene of every track:
 * request, response, control (handshakes), broadcast, allowed, blocked,
 * encrypted and selected. They sit about 45 degrees apart in OKLCH and are
 * checked for contrast and mutual distinctness in tokens.test.ts. Colour is
 * never the only signal: scenes always pair it with a label, icon or text.
 *
 * Surfaces are neutral graphite (dark) and warm paper (light), deliberately
 * not navy, so the site does not echo Protocol Explorer.
 */
export const tokens: Record<Theme, Record<TokenName, string>> = {
  dark: {
    bg: '#111416',
    panel: '#181c1f',
    'panel-raised': '#20252a',
    line: '#2d343a',
    'line-strong': '#434d56',
    ink: '#d6dce0',
    'ink-strong': '#f4f6f7',
    'ink-muted': '#9ca8b1',
    request: '#59aaf8',
    response: '#f99f55',
    control: '#aa88ef',
    broadcast: '#f17dbe',
    allowed: '#67d283',
    blocked: '#ef6567',
    encrypted: '#4fcbdb',
    selected: '#ead65f',
    focus: '#ffffff',
  },
  light: {
    bg: '#f1efea',
    panel: '#faf9f6',
    'panel-raised': '#ffffff',
    line: '#d8d4cb',
    'line-strong': '#b3ad9f',
    ink: '#262b30',
    'ink-strong': '#0e1215',
    'ink-muted': '#575f67',
    request: '#1f68bc',
    response: '#b55b0d',
    control: '#734dbe',
    broadcast: '#ae4090',
    allowed: '#2a824a',
    blocked: '#c42942',
    encrypted: '#187f90',
    selected: '#8a8419',
    focus: '#000000',
  },
};

function declarations(theme: Theme): string {
  const lines = Object.entries(tokens[theme]).map(([name, value]) => `  --${name}: ${value};`);
  return [`  color-scheme: ${theme};`, ...lines].join('\n');
}

/**
 * CSS custom properties for both themes. Selection order:
 *   1. `data-theme` on the root element wins, set by the boot script or the toggle.
 *   2. With no `data-theme` (JavaScript off), follow `prefers-color-scheme`.
 *   3. Otherwise dark, the site default.
 */
export function tokensToCss(): string {
  const light = declarations('light');
  return [
    `:root {\n${declarations('dark')}\n}`,
    `@media (prefers-color-scheme: light) {\n  :root:not([data-theme]) {\n${light.replace(/^/gm, '  ')}\n  }\n}`,
    `:root[data-theme="dark"] {\n${declarations('dark')}\n}`,
    `:root[data-theme="light"] {\n${light}\n}`,
  ].join('\n');
}
