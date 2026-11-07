import { drawDhcp } from './dhcp';
import { drawFirewall } from './firewall';
import { drawNetMap } from './net-map';
import { drawSubnet } from './subnet';
import type { DrawnFigure, FigureId } from './types';

/** How each scene figure is drawn. Every figure a lesson can name has its drawer here, and the compiler checks it. */
const DRAW: Record<FigureId, () => DrawnFigure> = {
  dhcp: drawDhcp,
  subnet: drawSubnet,
  firewall: drawFirewall,
  'net-map': drawNetMap,
};

/** Draws a scene figure at build time: its SVG markup and the data its driver reads. */
export function drawFigure(id: FigureId): DrawnFigure {
  return DRAW[id]();
}
