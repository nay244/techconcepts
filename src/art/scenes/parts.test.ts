import { expect, test } from 'vitest';
import { figureIdSchema } from '../../content/schema';
import { FIGURE_PARTS } from './parts';

test('FIGURE_PARTS has an entry for each figure id the schema accepts, and no other', () => {
  expect(Object.keys(FIGURE_PARTS).sort()).toEqual([...figureIdSchema.options].sort());
  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'subnet']);
});

test('every figure’s parts are well formed', () => {
  for (const parts of Object.values(FIGURE_PARTS)) {
    expect(Array.isArray(parts.places)).toBe(true);
    expect(Array.isArray(parts.layers)).toBe(true);
    expect(typeof parts.board).toBe('boolean');
    for (const type of Object.values(parts.cues)) expect(['flag', 'text']).toContain(type);
    expect(new Set(parts.places).size).toBe(parts.places.length);
    expect(new Set(parts.layers).size).toBe(parts.layers.length);
  }
});
