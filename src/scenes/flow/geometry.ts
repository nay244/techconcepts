import type { Actor, FlowScene, MessageEvent } from '../../content/schema';
import type { LogRow } from '../../engine/timeline';

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

export interface ArrowSpan {
  /** Lifeline indices (positions in `scene.actors`) the arrow runs between, `lo <= hi`. */
  lo: number;
  hi: number;
  /** Which end carries the arrowhead; `both` when the sender sits between its targets, `self` when there is no other target. */
  direction: 'right' | 'left' | 'both' | 'self';
  /** Targets inside the span, each marked with a dot because the arrowhead is already on a farther one. */
  stops: number[];
}

/**
 * Where a sequence arrow runs, from the row's actor ids: from the sender to the
 * farthest of its targets, reaching every target on the way. A `via` actor is
 * only passed through, so it has no say in the span and gets no mark. An id the
 * scene lacks is left out (lessons are checked when built, so this is only a
 * guard); a sender that is also a target is not counted as one.
 */
export function arrowSpan(actors: Actor[], row: Pick<LogRow, 'from' | 'to'>): ArrowSpan {
  const indexOf = (id: string) => actors.findIndex((actor) => actor.id === id);
  const from = Math.max(0, indexOf(row.from));
  const targets = [...new Set(row.to.map(indexOf).filter((i) => i >= 0 && i !== from))];
  if (targets.length === 0) return { lo: from, hi: from, direction: 'self', stops: [] };

  const lo = Math.min(from, ...targets);
  const hi = Math.max(from, ...targets);
  return {
    lo,
    hi,
    direction: lo === from ? 'right' : hi === from ? 'left' : 'both',
    stops: targets.filter((i) => i > lo && i < hi),
  };
}
