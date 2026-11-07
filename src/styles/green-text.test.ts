// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { contrastRatio } from '../lib/contrast';
import { mix, over } from '../test/paint';
import { tokens } from './tokens';

/*
 * Green words say done, seen, right or new. They are drawn in --allowed-text, the green moved a little toward the
 * strongest ink, so they reach 4.5:1 on every ground they sit on. --allowed itself is for fills, strokes and borders.
 * Each rule is read from its stylesheet and checked on each ground it can sit on, in both themes.
 */
const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');

const SOURCES = {
  'dhcp.css': read('../art/scenes/dhcp.css'),
  'net-map.css': read('../art/scenes/net-map.css'),
  'console.css': read('../lesson/console.css'),
  'site.css': read('../components/site.css'),
  'HeroWeb.astro': read('../components/HeroWeb.astro'),
  'about.astro': read('../pages/about.astro'),
};
type Source = keyof typeof SOURCES;
type Theme = 'light' | 'dark';

const lumenCss = read('../art/lumen.css');

/** The figures' background in a theme, from lumen.css. */
function figBg(theme: Theme): string {
  const match = new RegExp(`\\[data-theme="${theme}"\\]\\s*\\{[^}]*--fig-bg:\\s*(#[0-9a-f]{3,6})`, 'i').exec(lumenCss);
  if (match === null) throw new Error(`No --fig-bg for ${theme} in lumen.css.`);
  return match[1]!;
}

/** The declarations of the rule whose selector is exactly `selector`. */
function rule(source: Source, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const found = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(SOURCES[source]);
  if (found === null) throw new Error(`No rule for ${selector} in ${source}.`);
  return found[1]!;
}

interface GreenText {
  source: Source;
  selector: string;
  /** Each ground the words can sit on, by name. */
  grounds(theme: Theme): Record<string, string>;
}

const GREEN_TEXT: GreenText[] = [
  // The figures' callouts sit on the figures' background: DHCP's new address, and a protocol's "done" state on the map.
  { source: 'dhcp.css', selector: '.dh .dh-call .dh-addr.new', grounds: (theme) => ({ 'figure background': figBg(theme) }) },
  { source: 'net-map.css', selector: '.nm .nm-call .nm-state.done', grounds: (theme) => ({ 'figure background': figBg(theme) }) },
  // A right option's letter, on the option's own green tint over the card.
  {
    source: 'console.css',
    selector: ".practice__option[data-result='right'] .practice__letter",
    grounds: (theme) => ({ 'right option': mix(tokens[theme].allowed, tokens[theme].card, 10) }),
  },
  // "Right." in the feedback under the options, on the Explanation panel.
  { source: 'console.css', selector: '.practice__feedback b', grounds: (theme) => ({ card: tokens[theme].card }) },
  // "Finished" in the All lessons list: on the dialog, on a row under the pointer, and on the current lesson's row.
  {
    source: 'console.css',
    selector: ".outline__lesson-status[data-status='finished']",
    grounds: (theme) => {
      const t = tokens[theme];
      return { card: t.card, 'row on hover': t.tile, 'current row': over(t['here-soft'], t.card) };
    },
  },
  // The outline's ticks: a seen unit's number and a done place's mark, on the panel and on a row under the pointer.
  {
    source: 'console.css',
    selector: ".outline__unit[data-state='seen'] .outline__unit-n",
    grounds: (theme) => ({ card: tokens[theme].card, 'row on hover': tokens[theme].tile }),
  },
  {
    source: 'console.css',
    selector: ".outline__item[data-state='done'] .outline__mark",
    grounds: (theme) => ({ card: tokens[theme].card, 'row on hover': tokens[theme].tile }),
  },
  // "Finished" above a finished lesson's Overview, on the Explanation panel.
  { source: 'console.css', selector: '.explain__finished', grounds: (theme) => ({ card: tokens[theme].card }) },
  // A lesson card's Finished badge, on its own green tint over the card.
  { source: 'site.css', selector: '.badge.done', grounds: (theme) => ({ badge: mix(tokens[theme].allowed, tokens[theme].card, 10) }) },
  // Home's hero caption when its walk-through is done: the caption box is the card at 80% over the hero and its glow.
  {
    source: 'HeroWeb.astro',
    selector: '.hud.done .hud-step',
    grounds: (theme) => {
      const t = tokens[theme];
      return { caption: mix(t.card, over(t['hero-glow'], t['hero-bg']), 80) };
    },
  },
  // About's "Progress reset" status, on the page.
  { source: 'about.astro', selector: ".a-reset [role='status']", grounds: (theme) => ({ bg: tokens[theme].bg }) },
];

test('the tinted grounds are the ones the CSS paints', () => {
  expect(rule('console.css', ".practice__option[data-result='right']")).toMatch(/background:\s*color-mix\(in srgb, var\(--allowed\) 10%, var\(--card\)\)/);
  expect(rule('site.css', '.badge.done')).toMatch(/background:\s*color-mix\(in srgb, var\(--allowed\) 10%, transparent\)/);
  expect(rule('HeroWeb.astro', '.hud')).toMatch(/background:\s*color-mix\(in srgb, var\(--card\) 80%, transparent\)/);
  expect(rule('console.css', ".outline__lesson[aria-current='page']")).toMatch(/background:\s*var\(--here-soft\)/);
});

test.each(GREEN_TEXT.map((g) => [`${g.source} ${g.selector}`, g] as const))('%s is in --allowed-text, at 4.5:1 on every ground in both themes', (_, g) => {
  expect(rule(g.source, g.selector)).toMatch(/(?:^|[\s;{])(?:color|fill):\s*var\(--allowed-text\)/);
  for (const theme of ['light', 'dark'] as const)
    for (const [name, ground] of Object.entries(g.grounds(theme)))
      expect(contrastRatio(tokens[theme]['allowed-text'], ground), `${name} (${ground}) in ${theme}`).toBeGreaterThanOrEqual(4.5);
});

/** Every stylesheet and Astro component in src, by its path from src. */
const STYLES: string[] = (readdirSync(new URL('..', import.meta.url), { recursive: true }) as string[])
  .filter((path) => /\.(css|astro)$/.test(path))
  .sort();

/** `var(--allowed)` itself, or a color-mix() of it. */
const ALLOWED = String.raw`(?:var\(--allowed\)|color-mix\([^;]*var\(--allowed\)[^;]*\))`;

test('no words anywhere are drawn in --allowed: a colour, or the fill of a rule that sets a font, takes --allowed-text', () => {
  expect(STYLES).toContain('lesson/console.css');
  const colour = new RegExp(`(?:^|[\\s;{])color:\\s*${ALLOWED}`);
  const fill = new RegExp(`(?:^|[\\s;{])fill:\\s*${ALLOWED}`);
  for (const path of STYLES) {
    const text = read(`../${path}`);
    expect(text, path).not.toMatch(colour);
    for (const [, body] of text.matchAll(/\{([^{}]*)\}/g)) if (/(?:^|[\s;{])font[\w-]*\s*:/.test(body!)) expect(body, path).not.toMatch(fill);
  }
});
