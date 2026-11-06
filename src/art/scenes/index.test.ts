import { expect, test } from 'vitest';
import { figureIdSchema } from '../../content/schema';
import { drawFigure } from './index';
import type { FigureId } from './types';

// Now that all four exist: each lesson's figure is one image to assistive technology, names itself for its driver,
// and has no film grain (ruling R2).
test('every scene figure draws with data-figure, role="img", a non-empty aria-label and no grain', () => {
  const ids = figureIdSchema.options as readonly FigureId[];
  expect([...ids].sort()).toEqual(['dhcp', 'firewall', 'net-map', 'subnet']);
  for (const id of ids) {
    const { svg } = drawFigure(id);
    const root = /^<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
    expect(root, id).toContain(` data-figure="${id}"`);
    expect(root, id).toContain(' role="img"');
    expect(/ aria-label="([^"]*)"/.exec(root)?.[1]?.trim() ?? '', id).not.toBe('');
    expect(svg, id).not.toMatch(/lm-grain/);
  }
});
