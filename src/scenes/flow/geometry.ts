import type { FlowScene, MessageEvent } from '../../content/schema';

export interface Point {
  x: number;
  y: number;
}

/** The network canvas is drawn on a fixed 1000 by 600 grid and scaled to fit. */
export const VIEW_WIDTH = 1000;
export const VIEW_HEIGHT = 600;

/** Radius of the disc behind each device icon. */
export const NODE_RADIUS = 38;
/** How far above a device's centre a chip rides, so a chip at rest sits on top of the device instead of hiding it. */
export const CHIP_LIFT = NODE_RADIUS + 18;
/** Closest a chip's centre may come to the top edge. */
const CHIP_TOP_MARGIN = 22;

/**
 * The points a message passes through for one of its targets: the sender, each
 * `via` actor in order, then the target, as positions on the 1000 by 600 canvas.
 * An id the scene does not have is left out; the lesson checks run at build time,
 * so a view never has to fail over one.
 */
export function pathFor(scene: FlowScene, msg: MessageEvent, to: string): Point[] {
  const actors = new Map(scene.actors.map((actor) => [actor.id, actor]));
  return [msg.from, ...(msg.via ?? []), to].flatMap((id) => {
    const actor = actors.get(id);
    return actor === undefined ? [] : [{ x: actor.x, y: actor.y }];
  });
}

/** Where a chip is drawn for a stop on the path: above the device, and never off the top of the canvas. */
export function chipSpot(stop: Point): Point {
  return { x: stop.x, y: Math.max(CHIP_TOP_MARGIN, stop.y - CHIP_LIFT) };
}

export type ChipAlign = 'start' | 'center' | 'end';

/** Within this distance of a side edge, a chip hangs inward from its spot instead of centring on it. */
const EDGE_ZONE = 150;

/**
 * How a chip sits on its spot. A chip is as wide as its label, which the canvas
 * cannot know, so near the left or right edge it grows inward and stays on the canvas.
 */
export function chipAlign(spot: Point): ChipAlign {
  if (spot.x < EDGE_ZONE) return 'start';
  return spot.x > VIEW_WIDTH - EDGE_ZONE ? 'end' : 'center';
}
