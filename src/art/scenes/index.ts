import { drawDhcp } from './dhcp';
import { drawFirewall } from './firewall';
import { drawNetMap } from './net-map';
import { drawSubnet } from './subnet';
import type { DrawnFigure, FigureId } from './types';

/** How each scene figure is drawn. Each lesson's task adds its own (Tasks 10–16). */
const DRAW: Partial<Record<FigureId, () => DrawnFigure>> = {
  dhcp: drawDhcp,
  subnet: drawSubnet,
  firewall: drawFirewall,
  'net-map': drawNetMap,
};

/**
 * Draws a scene figure at build time: its SVG markup and the data its driver
 * reads. Throws for a figure that has not been built yet, so a lesson on it
 * stops the build instead of shipping an empty scene.
 */
export function drawFigure(id: FigureId): DrawnFigure {
  const draw = DRAW[id];
  if (draw === undefined) throw new Error(`The "${id}" scene figure is not drawn yet.`);
  return draw();
}
