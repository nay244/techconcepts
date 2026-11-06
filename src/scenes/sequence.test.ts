// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { contrastRatio } from '../lib/contrast';
import { tokens } from '../styles/tokens';

/* The Sequence view's colours, read from its stylesheet: each word it draws must be readable where it sits. */
const sequenceCss: string = readFileSync(new URL('./sequence.css', import.meta.url), 'utf8');
const lumenCss: string = readFileSync(new URL('../art/lumen.css', import.meta.url), 'utf8');

/** The token a rule in sequence.css fills its shapes or words with. */
function fillOf(selector: string): keyof (typeof tokens)['light'] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rule = new RegExp(`(?:^|\\n)${escaped}\\s*(?:,[^{]*)?\\{([^}]*)\\}`).exec(sequenceCss);
  const fill = rule === null ? null : /fill:\s*var\(--([\w-]+)\)/.exec(rule[1]!);
  if (fill === null) throw new Error(`No fill for ${selector} in sequence.css.`);
  return fill[1] as keyof (typeof tokens)['light'];
}

/** The figure's background in a theme, from lumen.css. */
function figBg(theme: 'light' | 'dark'): string {
  const match = new RegExp(`\\[data-theme="${theme}"\\]\\s*\\{[^}]*--fig-bg:\\s*(#[0-9a-f]{3,6})`, 'i').exec(lumenCss);
  if (match === null) throw new Error(`No --fig-bg for ${theme} in lumen.css.`);
  return match[1]!;
}

test('every word the Sequence view draws reaches 4.5:1 on what it sits on, in both themes', () => {
  const onFigure = [
    '.seq__name',
    '.seq__addr',
    '.seq__n',
    '.seq__tag',
    '.seq__decision',
    ".seq__row[data-outcome='blocked'] .seq__decision",
  ];
  // A decision that let the message through is in ink: the word says Allowed, so it needs no colour of its own.
  expect(fillOf('.seq__decision')).toBe('ink');
  expect(fillOf(".seq__row[data-outcome='blocked'] .seq__decision")).toBe('blocked');
  expect(fillOf('.seq__note')).toBe('tile');
  for (const theme of ['light', 'dark'] as const) {
    const t = tokens[theme];
    for (const selector of onFigure)
      expect(contrastRatio(t[fillOf(selector)], figBg(theme)), `${selector} in ${theme}`).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(t[fillOf('.seq__note-text')], t[fillOf('.seq__note')]), `note text in ${theme}`).toBeGreaterThanOrEqual(4.5);
  }
});
