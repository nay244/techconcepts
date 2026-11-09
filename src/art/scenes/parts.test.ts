import { expect, test } from 'vitest';
import { figureIdSchema } from '../../content/schema';
import { FIGURE_PARTS } from './parts';

test('FIGURE_PARTS has an entry for each figure id the schema accepts, and no other', () => {
  expect(Object.keys(FIGURE_PARTS).sort()).toEqual([...figureIdSchema.options].sort());
  expect(Object.keys(FIGURE_PARTS).sort()).toEqual(['dhcp', 'firewall', 'net-map', 'osi', 'subnet']);
});

test('every figure’s parts are well formed', () => {
  for (const parts of Object.values(FIGURE_PARTS)) {
    expect(Array.isArray(parts.places)).toBe(true);
    expect(Array.isArray(parts.layers)).toBe(true);
    expect(typeof parts.board).toBe('boolean');
    for (const type of Object.values(parts.cues)) expect(['flag', 'text']).toContain(type);
    expect(new Set(parts.places).size).toBe(parts.places.length);
    expect(new Set(parts.layers).size).toBe(parts.layers.length);
    // The optional lists, where a figure has them: args only for its text cues, routes between its places.
    for (const [cue, args] of Object.entries(parts.args ?? {})) {
      expect(parts.cues[cue]).toBe('text');
      expect(args.length).toBeGreaterThan(0);
      expect(new Set(args).size).toBe(args.length);
    }
    for (const route of parts.routes ?? []) {
      const [from, to, ...rest] = route.split('>');
      expect(rest).toEqual([]);
      expect(parts.places).toContain(from);
      expect(parts.places).toContain(to);
    }
    if (parts.words) expect(new Set(parts.words).size).toBe(parts.words.length);
    if (parts.labels !== undefined) expect(parts.labels).toBe(true);
  }
});
