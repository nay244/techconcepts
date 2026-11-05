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
/** The device text as designed, in canvas units: the label's size and each address line's. It is never drawn smaller. */
export const LABEL_SIZE = 20;
export const ADDRESS_SIZE = 16;
/** The least a device's label and its addresses may measure on screen, in CSS pixels (ruling R28). */
export const MIN_LABEL_PX = 12;
export const MIN_ADDRESS_PX = 11;
/** How far a line's box reaches above and below its baseline, per unit of font size (1.025 and 0.275, rounded up; measured on the previous typeface, to recheck against Atkinson). */
const ASCENT = 1.05;
const DESCENT = 0.3;
/** Space between the disc and the label's box, and between one line's box and the next. */
const TEXT_GAP = 2;

export interface DeviceText {
  /** Font sizes, in canvas units. */
  label: number;
  address: number;
  /** Baselines below the device's centre: the label's, then the first address line's. */
  labelY: number;
  firstAddressY: number;
  /** From one address line's baseline to the next. */
  lineHeight: number;
}

const roundUp = (value: number): number => Math.ceil(value * 10) / 10;
const round1 = (value: number): number => Math.round(value * 10) / 10;

/**
 * The text under each device, for a canvas drawn at `scale` screen pixels per
 * canvas unit. A small canvas would shrink the designed sizes past reading, so
 * the text grows in canvas units until it measures MIN_LABEL_PX and
 * MIN_ADDRESS_PX on screen; a large canvas keeps the designed sizes. The lines
 * are spaced so their boxes never touch the disc or each other. A scale that is
 * not known yet (before the canvas is on screen) gives the designed layout.
 */
export function deviceText(scale: number | null): DeviceText {
  const known = scale !== null && Number.isFinite(scale) && scale > 0;
  const label = known ? Math.max(LABEL_SIZE, roundUp(MIN_LABEL_PX / scale)) : LABEL_SIZE;
  const address = known ? Math.max(ADDRESS_SIZE, roundUp(MIN_ADDRESS_PX / scale)) : ADDRESS_SIZE;
  const labelY = round1(NODE_RADIUS + TEXT_GAP + label * ASCENT);
  return {
    label,
    address,
    labelY,
    firstAddressY: round1(labelY + label * DESCENT + TEXT_GAP + address * ASCENT),
    lineHeight: round1(address * (ASCENT + DESCENT) + TEXT_GAP),
  };
}

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
