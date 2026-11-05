import type { FigureId, FigureParts } from './types';

/**
 * The places, cues and layers each scene figure supports, and whether it takes
 * a board. Every figure starts empty; each lesson's task fills its own figure
 * as the figure is built, so the validator only accepts what the figure can show.
 */
export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
  dhcp: { places: [], cues: {}, layers: [], board: false },
  subnet: { places: [], cues: {}, layers: [], board: false },
  firewall: { places: [], cues: {}, layers: [], board: false },
  'net-map': { places: [], cues: {}, layers: [], board: false },
};
