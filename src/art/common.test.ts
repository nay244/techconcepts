// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { FLOOR, PLATE, PLATE_H, FOOT_H, H, W, at, base, n1 } from './common';
import { lumenDefs } from './defs';

const css: string = readFileSync(new URL('./lumen.css', import.meta.url), 'utf8');

describe('shared figure helpers', () => {
  test('the camera matches the mockups', () => {
    expect(at([0, 0, 0]).map(n1)).toEqual(['300', '248.9']);
    expect(at([100, 0, 0]).map(n1)).toEqual(['433.2', '315.5']);
    expect(at([0, 0, 50]).map(n1)).toEqual(['300', '167.4']);
  });

  test('the canvas and plate constants are the mockups', () => {
    expect([W, H]).toEqual([600, 420]);
    expect(PLATE).toEqual({ x: -112, y: -74, w: 224, d: 148, r: 10 });
    expect([PLATE_H, FOOT_H, FLOOR]).toEqual([9, 4, -13]);
  });

  test('base() draws a plate with four screws and one engraved label', () => {
    const { under, over } = base('NET');
    const screws = over.match(/<g class="iso-dots"[^>]*>(.*?)<\/g>/)?.[1] ?? '';
    expect(screws.match(/<circle /g)).toHaveLength(4);
    expect(over.match(/<text /g)).toHaveLength(1);
    expect(over).toContain('>NET</text>');
    expect(under).toContain('class="lm-pool"');
    expect(under).toContain('class="iso-halo"');
  });

  test('lumenDefs has the six gradients and no grain filter', () => {
    const defs = lumenDefs();
    for (const id of ['lm-top', 'lm-s0', 'lm-s1', 'lm-s2', 'lm-s3', 'lm-pool-g']) {
      expect(defs).toContain(`id="${id}"`);
    }
    expect(defs.match(/<(linear|radial)Gradient/g)).toHaveLength(6);
    expect(defs).not.toMatch(/filter|grain/i);
    expect(defs.startsWith('<svg class="lm-defs"')).toBe(true);
  });

  test('lumen.css has no lm-grain rule, and the lit part is the orange pair in both themes', () => {
    expect(css).not.toMatch(/grain/i);
    expect(css).toMatch(/:root, \[data-theme="light"\] \{ --lit-a: #ffc48f; --lit-b: #d9541c; --pool: #e8651f;/);
    expect(css).toMatch(/\n\[data-theme="dark"\] \{ --lit-a: #ffd3a8; --lit-b: #f0702e; --pool: #f0702e;/);
    // The old blue is gone everywhere.
    expect(css).not.toMatch(/#2f7bff|#a8e8ff/i);
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{ \.lm-svg \{ animation: none/);
  });

  test('figures are porcelain in the light theme and charcoal in the dark one, from one drawing', () => {
    // The base block is the light set; the dark set is applied by the system with no data-theme, and by an explicit dark.
    expect(css).toMatch(/\.lm-svg \{\n[^}]*--anatomy-paper: #f6f7f6; --anatomy-face: #ffffff;/);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\) \{[^@]*:root:not\(\[data-theme\]\) \.lm-svg \{ --anatomy-paper: #1c1f22;/);
    expect(css).toMatch(/\n\[data-theme="dark"\] \.lm-svg \{ --anatomy-paper: #1c1f22;/);
    // An explicit light theme on a dark system keeps the base set: nothing re-applies the dark one to it.
    expect(css).not.toMatch(/\[data-theme="light"\] \.lm-svg/);
  });

  test('a figure draws in to its own opacity, so a dimmed one (a coming-soon track cover) stays dimmed', () => {
    // An end keyframe of opacity 1, held by the fill, beat Home's `.track.later .art .lm-svg { opacity: .82 }`.
    const keyframes = /@keyframes lm-draw-in \{(.*)\}\n/.exec(css)?.[1] ?? '';
    expect(keyframes).toMatch(/from \{ opacity: 0; transform: translateY\(6px\); \}/);
    expect(keyframes).not.toMatch(/\bto\b|100%/);
  });

  test('theme variables follow the system without a data-theme attribute, and explicit themes win', () => {
    expect(css).toMatch(/:root, \[data-theme="light"\] \{[^}]*--pool-op: \.38; --halo: #5b666e;/);
    expect(css).toMatch(
      /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme\]\) \{[^}]*--pool-op: \.9; --halo: #000; --halo-op: \.9; --fig-bg: #0d1012;/,
    );
    expect(css).toMatch(/\n\[data-theme="dark"\] \{[^}]*--pool-op: \.9; --halo: #000;/);
    // the light-only orbit colour applies with no attribute only when the system is not dark
    expect(css).toMatch(
      /@media not \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme\]\) \.lm-orbit \{ stroke: #b3bcc0; \}\s*\}/,
    );
    expect(css.match(/\[data-theme="light"\] \.lm-orbit/g)).toHaveLength(1);
  });
});
