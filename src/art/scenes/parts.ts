import type { FigureId, FigureParts } from './types';

/**
 * The places, cues and layers each scene figure supports, and whether it takes
 * a board. Every figure starts empty; each lesson's task fills its own figure
 * as the figure is built, so the validator only accepts what the figure can show.
 */
export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
  dhcp: { places: ['laptop', 'router', 'phone'], cues: {}, layers: [], board: false },
  subnet: {
    places: ['laptop', 'printer', 'pc', 'router', 'provider'],
    // The mockup's fx, by name: what lights, pulses, rides or spreads while a note plays (src/scenes/drivers/subnet.ts).
    cues: {
      glow: 'text',
      focus: 'text',
      'one-net': 'flag',
      cut: 'flag',
      link: 'flag',
      pulse: 'text',
      ring: 'text',
      route: 'text',
      busy: 'text',
    },
    layers: [],
    board: true,
  },
  firewall: { places: [], cues: {}, layers: [], board: false },
  'net-map': { places: [], cues: {}, layers: [], board: false },
};
