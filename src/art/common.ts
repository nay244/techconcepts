// Shared by every figure: the kit, one camera and scale, drawing helpers, and the plate.
// Ported from the approved mockups' figs/common.mjs; the drawing is identical.
import * as k from './kit/iso-kit.ts';
import type { Flat, LineStyle, Plan, Point3, SolidPaths, SolidStyle } from './kit/iso-kit.ts';
import * as G from './kit/lathe.mjs';
import { tubePieces, tubeSvg } from './kit/tube.mjs';

export { k, G, tubePieces, tubeSvg };

export const W = 600;
export const H = 420;
export const PLATE: Plan = { x: -112, y: -74, w: 224, d: 148, r: 10 };
export const PLATE_H = 9;
export const FOOT_H = 4;
export const FLOOR = -PLATE_H - FOOT_H;

/** A tube piece as `tubePieces` returns it; only what the helpers read is named. */
export interface TubePiece {
  mid: [number, number, number];
  [key: string]: unknown;
}

// One camera and one scale for the whole set, so the figures read as a family.
export const P = k.fitProjection(
  [...k.boxCorners(PLATE, FLOOR, 0), [-40, -40, 104], [40, -40, 104], [0, 0, 104]],
  W,
  H,
  { pad: 26, azimuth: 45 },
);
export const V = G.viewOf(P) as [number, number, number];

export const at = (p: Point3): Flat => k.iso(p, P);
export const S = (paths: SolidPaths, o?: SolidStyle): string => k.solidSvg(paths, o);
export const L = (d: string, o?: LineStyle): string => k.lineSvg(d, o);
export const D = (list: Array<Flat | Point3>, o?: { size?: number; tone?: k.Tone; pulse?: boolean }): string => k.dotsSvg(list, o);
export const n1 = (v: number): string => (Math.round(v * 10) / 10).toString();
export const depth = (p: Point3): number => k.depthOf(p, P);
export const byDepth = <T extends readonly number[]>(list: readonly T[]): T[] =>
  [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
export const pts = (list: Point3[]): string => list.map((p) => at(p).map(n1).join(',')).join(' ');
export const poly = (list: Point3[], cls: string): string => `<polygon class="${cls}" points="${pts(list)}"/>`;
export const tubeOf = (pieces: TubePiece[]): string =>
  pieces
    .sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V))
    .map((p) => tubeSvg(p, { tone: 'hi' }))
    .join('');

// Draw on the vertical face y = Y (the front-left face): local (u, v) is world (u, Y, -v).
export const faceY = (Y: number): string => k.sideMatrix([0, Y], 0, P, 'left');
export const onFaceY = (Y: number, inner: string): string => `<g transform="${faceY(Y)}">${inner}</g>`;
// Draw on the vertical face x = X (the front-right face): local (u, v) is world (X, -u, -v).
export const faceX = (X: number): string => k.sideMatrix([X, 0], 0, P, 'right');
export const onFaceX = (X: number, inner: string): string => `<g transform="${faceX(X)}">${inner}</g>`;
// Draw flat on a top surface at height Z: local (u, v) is world (u, v, Z).
export const onTopAt = (Z: number, inner: string): string => `<g transform="${k.topMatrix([0, 0], Z, P, 'x')}">${inner}</g>`;

// ---------- The plate every figure stands on ----------
// "under" is soft and see-through (the glow pool, the orbit rings, the halo); "over" is the solid plate.
export function base(label: string): { under: string; over: string } {
  const under = [
    `<path class="lm-pool" d="${k.ring(0, 0, 170, FLOOR, P, 120)}"/>`,
    L(k.ring(0, 0, 138, FLOOR, P, 120), { tone: 'faint', className: 'lm-orbit' }),
    L(k.ring(0, 0, 118, FLOOR, P, 120), { tone: 'faint', className: 'lm-orbit lm-orbit2' }),
    `<path class="iso-halo" d="${k.haloOf(PLATE, FLOOR, PLATE_H, P)}"/>`,
  ].join('');
  const over: string[] = [];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    over.push(S(k.cylinder(x, y, 6.4, FLOOR, 1.4, P, 28), { tone: 'lo' }));
    over.push(S(k.cylinder(x, y, 4.8, FLOOR + 1.4, FOOT_H - 1.4, P, 28), { tone: 'mid' }));
  }
  over.push(
    S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), {
      tone: 'mid',
      inner: L(k.sideSeam(PLATE, -PLATE_H + 2.2, P, 8), { tone: 'faint' }),
    }),
  );
  over.push(L(k.planOutline(k.insetPlan(PLATE, 6), 0, P), { tone: 'lo' }));
  const screws = k.corners(PLATE, 11);
  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2.3, 0, P, 18)).join(''), { tone: 'lo' }));
  over.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.6, tone: 'mid' }));
  // One tiny engraved label, on the plate's front edge.
  over.push(
    k.faceTextSvg(k.sideMatrix([PLATE.x + PLATE.w - 24, PLATE.y + PLATE.d], -3.4, P, 'left'), label, {
      size: 3.4,
      tone: 'mid',
      anchor: 'end',
    }),
  );
  return { under, over: over.join('') };
}
