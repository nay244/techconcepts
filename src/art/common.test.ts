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

  test('lumen.css has no lm-grain rule and keeps the figure tokens', () => {
    expect(css).not.toMatch(/grain/i);
    expect(css).toContain('--lit-a: #a8e8ff');
    expect(css).toContain('--lit-b: #2f7bff');
    expect(css).toContain('--pool: #2f7bff');
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{ \.lm-svg \{ animation: none/);
  });

  test('a figure draws in to its own opacity, so a dimmed one (a coming-soon track cover) stays dimmed', () => {
    // An end keyframe of opacity 1, held by the fill, beat Home's `.track.later .art .lm-svg { opacity: .82 }`.
    const keyframes = /@keyframes lm-draw-in \{(.*)\}\n/.exec(css)?.[1] ?? '';
    expect(keyframes).toMatch(/from \{ opacity: 0; transform: translateY\(6px\); \}/);
    expect(keyframes).not.toMatch(/\bto\b|100%/);
  });

  test('theme variables follow the system without a data-theme attribute, and explicit themes win', () => {
    expect(css).toMatch(/:root, \[data-theme="light"\] \{ --pool-op: \.5; --halo: #3d4a5e;/);
    expect(css).toMatch(
      /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme\]\) \{ --pool-op: 1; --halo: #000; --halo-op: \.9; --fig-bg: #070d18;/,
    );
    expect(css).toMatch(/\n\[data-theme="dark"\] \{ --pool-op: 1; --halo: #000;/);
    // the light-only orbit colour applies with no attribute only when the system is not dark
    expect(css).toMatch(
      /@media not \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme\]\) \.lm-orbit \{ stroke: #b4bfce; \}\s*\}/,
    );
    expect(css.match(/\[data-theme="light"\] \.lm-orbit/g)).toHaveLength(1);
  });
});
