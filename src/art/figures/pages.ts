// Figures for the site's own pages, drawn for the revamp (docs/direction.md §8): one object per idea, bigger and
// denser than the small lesson figures, on the family's one plate and camera. Each is still, with one lit part.
// The subjects are ours; the three reference drawings the owner supplied set the finish only.
import { k, G, P, W, H, at, S, L, D, n1, byDepth, tubeOf, onFaceY, tubePieces, base } from '../common.ts';
import type { TubePiece } from '../common.ts';
import type { Plan, Plane, Point3, Tone } from '../kit/iso-kit.ts';

/** A rectangle on a vertical face: `u` along the face, `z` up from the floor. */
const rect = (cls: string, u: number, z: number, w: number, h: number, rx = 0.6): string =>
  `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"/>`;
/** A word a machine carries on a vertical face, centred on `u`. */
const word = (cls: string, u: number, z: number, text: string): string =>
  `<text class="${cls}" text-anchor="middle" x="${n1(u)}" y="${n1(-z)}">${text}</text>`;
const led = (p: Point3, on: boolean, r = 1.2): string => {
  const [x, y] = at(p);
  return `<circle class="lm-led${on ? ' on' : ''}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`;
};
/** Straight lines on a flat top at height `z`. */
const lines = (list: Array<[Plane, Plane]>, z: number, tone: Tone = 'lo', className?: string): string =>
  L(list.map(([a, b]) => k.lineOnTop(a, b, z, P)).join(''), { tone, className });
const slab = (plan: Plan, z: number, h: number, tone: Tone = 'hi', o: { lit?: boolean; seams?: number[]; bevel?: number; steps?: number } = {}): string =>
  S(k.slabOf(plan, z, h, P, o.steps ?? 4, o.bevel ?? 0.5), {
    tone,
    lit: o.lit,
    inner: o.seams ? L(o.seams.map((s) => k.sideSeam(plan, s, P, o.steps ?? 4)).join(''), { tone: 'faint' }) : '',
  });
const post = (x: number, y: number, r: number, z: number, h: number, tone: Tone = 'mid'): string => S(k.cylinder(x, y, r, z, h, P, 20), { tone, crease: 'none' });
// The kit's pipe helpers are plain JavaScript, so their types are whatever the checker infers; these two say what
// they take and give back.
/** A route with its corners rounded, kept clear of the view direction for a cable of radius `tube`. */
const fillet = (route: Point3[], radius: number, tube: number): Point3[] =>
  (G.fillet as unknown as (points: Point3[], radius: number, perArc: number, o: { P: typeof P; tube: number }) => Point3[])(route, radius, 8, { P, tube });
const cables = (routes: Point3[][], radius: number): string =>
  tubeOf(routes.flatMap((route) => tubePieces(route, radius, P, { maxLength: 18 }) as unknown as TubePiece[]));

// The plate and what stands on it, cropped close so the object fills the frame.
const CROP = '36 30 528 386';
const figure = (id: string, label: string, body: string, aria: string, crop = CROP): string => {
  const plate = base(label);
  return k
    .figureSvg({ width: W, height: H, label: aria, body: `${plate.under}<g class="lm-body">${plate.over}${body}</g>`, className: `lm-svg lm-${id}` })
    .replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="${crop}"`);
};

// ---------- Not found: a patch panel with every port linked but one, and the cable that stops short of it ----------
function notFound(): string {
  const out: string[] = [];
  const PN: Plan = { x: -94, y: -56, w: 188, d: 18, r: 2 };
  const FACE = PN.y + PN.d;
  const Z0 = 14;
  const TOP = 60;
  const portX = (i: number): number => -77 + i * 22;
  const MISSING = 3;
  // Two stands, then the panel on them.
  for (const x of [-88, 74]) out.push(slab({ x, y: PN.y - 3, w: 14, d: PN.d + 6, r: 2 }, 0, Z0, 'mid', { seams: [4] }));
  out.push(slab(PN, Z0, TOP - Z0, 'hi', { seams: [Z0 + 3, TOP - 3], bevel: 0.8 }));
  out.push(D(k.dotGrid(PN.x + 10, PN.y + 5, 18, 2, 10, TOP, P), { size: 0.55, tone: 'lo' }));
  // The face: a strip of port numbers, eight sockets, and a mounting screw in each corner.
  let face = rect('lm-inlay', -88, 45, 176, 10, 1.2);
  for (let i = 0; i < 8; i++) {
    const x = portX(i);
    face += word('lm-pkt-t', x, 48.2, `40${i + 1}`);
    face += rect('lm-void', x - 7, 23, 14, 13, 1.4) + rect('lm-void', x - 2.8, 36, 5.6, 2.6, 0.6);
  }
  for (const [u, z] of [[-90.5, 19], [90.5, 19], [-90.5, 56], [90.5, 56]]) face += `<circle class="lm-dotc" cx="${u}" cy="${-z}" r="1.1"/>`;
  out.push(onFaceY(FACE, face));
  // A link light under every socket. Port 404's is dark.
  out.push(`<g class="lm-leds">${Array.from({ length: 8 }, (_, i) => led([portX(i), FACE, 18.4], i !== MISSING, 1.25)).join('')}</g>`);
  // Seven cables: a boot at the socket, down to the plate, forward into the cable bar.
  const BAR: Plan = { x: -92, y: 44, w: 184, d: 12, r: 3 };
  const linked = Array.from({ length: 8 }, (_, i) => i).filter((i) => i !== MISSING);
  for (const i of linked) out.push(slab({ x: portX(i) - 5, y: FACE, w: 10, d: 8, r: 1 }, 24.5, 9.5, 'mid'));
  const run = (x: number): Point3[] =>
    fillet([[x, FACE + 8, 29.2], [x, FACE + 17, 29.2], [x, FACE + 26, 1.7], [x, BAR.y + 1, 1.7]], 6, 1.7);
  // The eighth cable comes out of the bar, wanders, and stops short: its plug lies on the plate, lit.
  const lx = portX(MISSING);
  const loose = fillet([[lx, BAR.y + 1, 1.7], [lx, 30, 1.7], [lx - 10, 20, 1.7], [lx - 10, 8, 1.7], [lx, -2, 1.7], [lx, -6, 1.7]], 5, 1.7);
  out.push(cables([...linked.map((i) => run(portX(i))), loose], 1.7));
  const PLUG: Plan = { x: lx - 6.5, y: -26, w: 13, d: 20, r: 1.4 };
  out.push(slab(PLUG, 0, 9, 'hi', { lit: true, bevel: 0.9 }));
  out.push(lines([[[lx - 3.6, -24.5], [lx - 3.6, -18]], [[lx - 1.2, -24.5], [lx - 1.2, -18]], [[lx + 1.2, -24.5], [lx + 1.2, -18]], [[lx + 3.6, -24.5], [lx + 3.6, -18]], [[lx - 4, -13], [lx + 4, -13]]], 9, 'lo', 'lm-sym-lit'));
  // The cable bar across the front, a slot over each cable.
  out.push(slab(BAR, 0, 9, 'hi', { seams: [3], bevel: 0.8 }));
  out.push(L(Array.from({ length: 8 }, (_, i) => k.planOutline({ x: portX(i) - 4, y: BAR.y + 3, w: 8, d: 6, r: 2 }, 9, P, 4)).join(''), { tone: 'lo' }));
  return figure(
    'notfound',
    'PORT 404 · NO LINK',
    out.join(''),
    'A patch panel with eight numbered ports, 401 to 408. Seven have a cable plugged in and a link light on. Port 404 is empty and its light is off; its cable stops short on the plate, the plug lying loose.',
  );
}

// ---------- Sources: a claim on the page, under a loupe, beside the standards it was checked against ----------
function sources(): string {
  const out: string[] = [];
  // Three bound standards, stacked, each with its page edges and a name on its spine.
  const books: Array<[Plan, number, number, string]> = [
    [{ x: -100, y: -58, w: 70, d: 104, r: 2 }, 0, 13, 'RFC 2131'],
    [{ x: -97, y: -54, w: 66, d: 97, r: 2 }, 13, 11, 'RFC 2132'],
    [{ x: -99, y: -56, w: 68, d: 100, r: 2 }, 24, 12, 'RFC 791'],
  ];
  for (const [plan, z, h, name] of books) {
    out.push(slab(plan, z, h, 'hi', { seams: [z + 2.2, z + h - 2.2], bevel: 0.6 }));
    const front = plan.y + plan.d;
    const pages = Array.from({ length: Math.floor((h - 6) / 1.4) }, (_, i) => rect('lm-slot', plan.x + 26, z + 3.2 + i * 1.4, plan.w - 30, 0.35, 0));
    out.push(onFaceY(front, rect('lm-inlay', plan.x + 4, z + 3, 20, h - 6, 0.8) + word('lm-pkt-t', plan.x + 14, z + h / 2 - 1.2, name) + pages.join('')));
  }
  const [top, tz, th] = books[2]!;
  out.push(L(k.planOutline(k.insetPlan(top, 5), tz + th, P, 4), { tone: 'lo' }));
  out.push(L(k.planOutline({ x: top.x + 14, y: top.y + 18, w: top.w - 28, d: 22, r: 1.4 }, tz + th, P, 4), { tone: 'mid' }));
  out.push(lines([26, 32].map((dy) => [[top.x + 19, top.y + dy], [top.x + top.w - 19 - (dy - 26) * 2, top.y + dy]] as [Plane, Plane]), tz + th));
  out.push(lines([[[top.x + 24, top.y + top.d - 16], [top.x + top.w - 24, top.y + top.d - 16]]], tz + th, 'faint'));
  // The report: a board, a sheet, lines of plain words. One claim is lit, with its source number beside it.
  const BOARD: Plan = { x: -18, y: -50, w: 114, d: 96, r: 3 };
  out.push(slab(BOARD, 0, 3.4, 'mid', { bevel: 0.6 }));
  const SHEET = k.insetPlan(BOARD, 4);
  out.push(slab(SHEET, 3.4, 1.6, 'hi', { bevel: 0.2 }));
  const PZ = 5;
  out.push(S(k.slabOf({ x: SHEET.x + 34, y: SHEET.y - 1.5, w: 30, d: 8, r: 1.6 }, PZ, 3.2, P, 4, 0.5), { tone: 'mid' }));
  out.push(lines([[[SHEET.x + 8, SHEET.y + 15], [SHEET.x + 52, SHEET.y + 15]]], PZ, 'mid'));
  const rows = [24, 31, 38, 59, 66, 73, 80];
  out.push(lines(rows.map((dy, i) => [[SHEET.x + (dy > 60 ? 42 : 8), SHEET.y + dy], [SHEET.x + SHEET.w - 12 - (i % 3) * 9, SHEET.y + dy]] as [Plane, Plane]), PZ));
  const CLAIM: Plan = { x: SHEET.x + 6, y: SHEET.y + 44, w: 62, d: 9, r: 1.4 };
  out.push(slab(CLAIM, PZ, 1.6, 'hi', { lit: true, bevel: 0.3 }));
  out.push(lines([[[CLAIM.x + 4, CLAIM.y + 3], [CLAIM.x + 50, CLAIM.y + 3]], [[CLAIM.x + 4, CLAIM.y + 6], [CLAIM.x + 36, CLAIM.y + 6]]], PZ + 1.6, 'lo', 'lm-sym-lit'));
  out.push(L(k.planOutline({ x: CLAIM.x + CLAIM.w + 4, y: CLAIM.y + 1, w: 7, d: 7, r: 1 }, PZ, P, 3), { tone: 'mid' }));
  // A stand loupe over the end of the claim: three feet, a barrel, a lens.
  const [cx, cy] = [CLAIM.x + CLAIM.w + 20, CLAIM.y + 4];
  for (const a of [0.4, 2.5, 4.6]) out.push(post(cx + 12 * Math.cos(a), cy + 12 * Math.sin(a), 1.3, PZ, 9, 'mid'));
  out.push(S(k.cylinder(cx, cy, 15, PZ + 9, 7, P, 44, 0.8), { tone: 'hi', inner: L(k.knurl(cx, cy, 15, PZ + 10.5, PZ + 14.5, 40, P), { tone: 'faint' }) }));
  out.push(L(k.ring(cx, cy, 11.5, PZ + 16, P, 44) + k.ring(cx, cy, 13.2, PZ + 16, P, 44), { tone: 'mid' }));
  out.push(L(k.onTop([[cx - 7, cy - 3], [cx - 3, cy - 7]], PZ + 16, P) + k.onTop([[cx - 4.5, cy + 0.5], [cx + 0.5, cy - 4.5]], PZ + 16, P), { tone: 'hi' }));
  // In front: the check stamp on its pad, and the mark it left at the foot of the sheet.
  const MARK: Plan = { x: SHEET.x + 8, y: SHEET.y + 66, w: 28, d: 16, r: 2 };
  out.push(L(k.planOutline(MARK, PZ, P, 4) + k.planOutline(k.insetPlan(MARK, 2), PZ, P, 4), { tone: 'mid' }));
  out.push(`<path class="lm-tick-ok" d="${k.onTop([[MARK.x + 8, MARK.y + 8], [MARK.x + 12, MARK.y + 12], [MARK.x + 20, MARK.y + 4]], PZ, P)}"/>`);
  const PAD: Plan = { x: 62, y: 52, w: 40, d: 20, r: 3 };
  out.push(slab(PAD, 0, 5, 'mid', { seams: [2], bevel: 0.6 }));
  out.push(`<path class="lm-void" d="${k.planOutline(k.insetPlan(PAD, 3), 5, P, 4)}"/>`);
  const ST: Plan = { x: PAD.x + 7, y: PAD.y + 3.5, w: 26, d: 13, r: 1.6 };
  out.push(slab(ST, 5, 6, 'hi', { bevel: 0.6 }));
  out.push(post(ST.x + ST.w / 2, ST.y + ST.d / 2, 3.2, 11, 13, 'mid'));
  out.push(S(k.cylinder(ST.x + ST.w / 2, ST.y + ST.d / 2, 6.2, 24, 7, P, 28, 1.6), { tone: 'hi', inner: L(k.knurl(ST.x + ST.w / 2, ST.y + ST.d / 2, 6.2, 25.5, 29.5, 22, P), { tone: 'faint' }) }));
  return figure(
    'sources',
    'CHECKED · 2 SOURCES',
    out.join(''),
    'A report sheet on a board, one line of it lit and marked with a source number, a small loupe standing over the end of that line. Beside the sheet, three bound standards are stacked. In front, a stamp rests on its ink pad, and its tick is on the foot of the sheet.',
  );
}

// ---------- Not ready yet: a lesson on the assembly stand, its next layer still on the hoist ----------
function notReady(): string {
  const out: string[] = [];
  const STAND: Plan = { x: -66, y: -44, w: 88, d: 78, r: 4 };
  const LEFT: Plane = [-82, -5];
  const RIGHT: Plane = [38, -5];
  const BEAM_Z = 84;
  // The far post of the hoist, with its foot.
  out.push(S(k.cylinder(LEFT[0], LEFT[1], 7, 0, 3, P, 28, 0.6), { tone: 'mid' }), post(LEFT[0], LEFT[1], 3, 3, BEAM_Z - 3, 'hi'));
  // The stand, a ruler along its front edge, and the two layers already in place.
  out.push(slab(STAND, 0, 7, 'mid', { seams: [2.4], bevel: 0.8 }));
  const ticks = k.topTicks(STAND.x + 6, STAND.x + STAND.w - 6, 4, 5, STAND.y + STAND.d - 1.5, 7, [2, 4], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));
  const LAYER: Plan = { x: -56, y: -36, w: 68, d: 58, r: 4 };
  for (const [z, n] of [[7, 1], [18, 2]] as const) {
    out.push(slab(LAYER, z, 11, 'hi', { seams: [z + 3], bevel: 0.8 }));
    out.push(onFaceY(LAYER.y + LAYER.d, rect('lm-inlay', LAYER.x + 6, z + 3.4, 12, 5.4, 0.8) + word('lm-pkt-t', LAYER.x + 12, z + 4.6, `0${n}`) + rect('lm-slot', LAYER.x + 24, z + 5.4, 34, 1.4, 0.7)));
  }
  // Four locating pins stand ready for the next layer.
  for (const [x, y] of byDepth(k.corners(LAYER, 9))) out.push(post(x, y, 1.5, 29, 4, 'mid'));
  out.push(L(k.planOutline(k.insetPlan(LAYER, 5), 29, P, 4), { tone: 'lo' }));
  // The next layer, lit, hangs from the hoist on two slings.
  const NEXT_Z = 46;
  out.push(slab(LAYER, NEXT_Z, 11, 'hi', { lit: true, bevel: 0.8 }));
  out.push(onFaceY(LAYER.y + LAYER.d, word('lm-pkt-t lm-on-lit', LAYER.x + 12, NEXT_Z + 3.6, '03') + rect('lm-slot lm-on-lit', LAYER.x + 24, NEXT_Z + 4.4, 34, 1.4, 0.7)));
  const HOOK: Plane = [LAYER.x + LAYER.w / 2, -5];
  for (const dx of [-22, 22]) out.push(L(k.segment([HOOK[0] + dx, HOOK[1], NEXT_Z + 11], [HOOK[0], HOOK[1], BEAM_Z - 14], P), { tone: 'hi' }));
  out.push(D([at([HOOK[0] - 22, HOOK[1], NEXT_Z + 11]), at([HOOK[0] + 22, HOOK[1], NEXT_Z + 11])], { size: 0.9, tone: 'mid' }));
  out.push(post(HOOK[0], HOOK[1], 1, BEAM_Z - 14, 9, 'hi'), S(k.cylinder(HOOK[0], HOOK[1], 2.6, BEAM_Z - 16.5, 2.5, P, 16), { tone: 'mid' }));
  // The near post, then the beam across both, and the trolley that carries the hook.
  out.push(S(k.cylinder(RIGHT[0], RIGHT[1], 7, 0, 3, P, 28, 0.6), { tone: 'mid' }), post(RIGHT[0], RIGHT[1], 3, 3, BEAM_Z - 3, 'hi'));
  const BEAM: Plan = { x: LEFT[0] - 7, y: -9, w: RIGHT[0] - LEFT[0] + 14, d: 8, r: 1.6 };
  out.push(slab({ x: HOOK[0] - 8, y: -11, w: 16, d: 12, r: 1.6 }, BEAM_Z - 5, 5, 'mid'));
  out.push(slab(BEAM, BEAM_Z, 7, 'hi', { seams: [BEAM_Z + 2.2], bevel: 0.6 }));
  const rule = k.topTicks(BEAM.x + 8, BEAM.x + BEAM.w - 8, 4, 5, BEAM.y + BEAM.d - 1, BEAM_Z + 7, [1.6, 3.2], P);
  out.push(L(rule.minor, { tone: 'lo' }), L(rule.major, { tone: 'mid' }));
  // A tray of what is still to fit: two small parts, a spare pin, four screws.
  const TRAY: Plan = { x: 44, y: 22, w: 58, d: 42, r: 4 };
  out.push(slab(TRAY, 0, 3.4, 'mid', { bevel: 0.6 }), L(k.planOutline(k.insetPlan(TRAY, 4), 3.4, P, 4), { tone: 'lo' }));
  out.push(slab({ x: 52, y: 30, w: 20, d: 12, r: 1.6 }, 3.4, 5, 'hi'), slab({ x: 76, y: 28, w: 16, d: 16, r: 1.6 }, 3.4, 7, 'hi', { seams: [6] }));
  out.push(post(60, 52, 1.5, 3.4, 4, 'mid'));
  for (const [x, y] of byDepth([[74, 50], [80, 54], [86, 50], [92, 54]] as Plane[])) {
    out.push(S(k.cylinder(x, y, 2, 3.4, 1.4, P, 16), { tone: 'hi' }));
    out.push(lines([[[x - 1.2, y], [x + 1.2, y]]], 4.8));
  }
  return figure(
    'notready',
    'LESSON · IN ASSEMBLY',
    out.join(''),
    'An assembly stand under a small hoist. Two numbered layers of a lesson are already stacked on the stand; the third, lit, hangs from the hoist above them, about to be lowered onto four locating pins. A tray in front holds the parts still to fit.',
  );
}

// ---------- Inside: a router with its lid lifted off, and one message on its way across the board ----------
function inside(): string {
  const out: string[] = [];
  const R: Plan = { x: -78, y: -50, w: 156, d: 100, r: 9 };
  const TRAY_Z = 4;
  const RIM = 18;
  const LID_Z = 72;
  for (const [x, y] of byDepth(k.corners(R, 12))) out.push(S(k.cylinder(x, y, 4, 0, TRAY_Z, P, 20), { tone: 'lo' }));
  // The lower half: a tray with a seam, and the dark board lying in it.
  out.push(slab(R, TRAY_Z, RIM - TRAY_Z, 'hi', { seams: [TRAY_Z + 4], bevel: 1, steps: 8 }));
  const BOARD = k.insetPlan(R, 7);
  out.push(`<path class="lm-void" d="${k.planOutline(BOARD, RIM, P, 8)}"/>`);
  const BZ = RIM;
  // What stands on the board. The lid hides the far corner, so the story is laid out along the two near edges:
  // sockets on the near-left edge, the switch chip behind them, the processor on the right.
  const PORTS: Plan = { x: -52, y: 26, w: 104, d: 13, r: 1.2 };
  const SW: Plan = { x: -22, y: -22, w: 26, d: 26, r: 1.6 };
  const CPU: Plan = { x: 28, y: -30, w: 34, d: 34, r: 2 };
  const MEM: Plan = { x: 32, y: 12, w: 30, d: 12, r: 1.2 };
  const PWR: Plan = { x: -62, y: -20, w: 16, d: 30, r: 1.4 };
  const socketX = (i: number): number => PORTS.x + 15.5 + i * 24;
  // Traces, flat on the board: each socket back toward the switch chip, a bus to the processor, lanes to memory.
  const trace = (list: Plane[]): string => k.onTop(list, BZ + 0.2, P);
  const WAY = 1;
  out.push(
    L(
      [0, 1, 2, 3].map((i) => trace([[socketX(i), PORTS.y], [socketX(i), 16 - i * 2], [SW.x + 5 + i * 5.4, 16 - i * 2], [SW.x + 5 + i * 5.4, SW.y + SW.d]])).join('') +
        [0, 4, 8, 12].map((d) => trace([[SW.x + SW.w, SW.y + 5 + d], [CPU.x, SW.y + 5 + d]])).join('') +
        [0, 4, 8, 12, 16].map((d) => trace([[CPU.x + 8 + d, CPU.y + CPU.d], [CPU.x + 8 + d, MEM.y]])).join('') +
        trace([[PWR.x + PWR.w, PWR.y + 8], [SW.x, PWR.y + 8]]) +
        trace([[PWR.x + PWR.w, PWR.y + 14], [SW.x - 6, PWR.y + 14], [SW.x - 6, 22], [PORTS.x + 4, 22], [PORTS.x + 4, PORTS.y]]),
      { tone: 'mid' },
    ),
  );
  out.push(D([0, 1, 2, 3].map((i) => at([SW.x + 5 + i * 5.4, 16 - i * 2, BZ + 0.2])), { size: 0.7, tone: 'mid' }));
  // The far parts first.
  out.push(slab(PWR, BZ, 7, 'mid', { bevel: 0.5 }), L(k.planOutline(k.insetPlan(PWR, 3), BZ + 7, P, 4), { tone: 'lo' }));
  for (const [x, y] of byDepth([[-40, -34], [-32, -36], [-48, -36]] as Plane[])) out.push(S(k.cylinder(x, y, 3, BZ, 6, P, 18, 0.5), { tone: 'mid' }));
  out.push(slab(SW, BZ, 4.4, 'hi', { bevel: 0.5 }), L(k.planOutline(k.insetPlan(SW, 3), BZ + 4.4, P, 4), { tone: 'lo' }));
  out.push(D(k.dotGrid(SW.x + 7, SW.y + 7, 4, 4, 4, BZ + 4.4, P), { size: 0.45, tone: 'lo' }));
  // The processor under a finned heat spreader.
  out.push(slab(CPU, BZ, 7, 'hi', { seams: [BZ + 2], bevel: 0.6 }));
  out.push(lines([5, 9, 13, 17, 21, 25, 29].map((d) => [[CPU.x + 4, CPU.y + d], [CPU.x + CPU.w - 4, CPU.y + d]] as [Plane, Plane]), BZ + 7, 'lo'));
  // The message: one lit block on its trace, halfway from a socket to the switch chip.
  const mx = SW.x + 5 + WAY * 5.4;
  out.push(slab({ x: mx - 5, y: 5, w: 10, d: 8, r: 1.2 }, BZ + 0.2, 5, 'hi', { lit: true, bevel: 0.5 }));
  out.push(lines([[[mx - 2.4, 7.4], [mx, 9.6]], [[mx, 9.6], [mx + 2.4, 7.4]]], BZ + 5.2, 'lo', 'lm-sym-lit'));
  // Memory, a crystal, and the row of sockets along the near edge, their openings facing out.
  out.push(slab(MEM, BZ, 3.4, 'hi', { bevel: 0.4 }), D(k.dotGrid(MEM.x + 5, MEM.y + 4, 6, 2, 4, BZ + 3.4, P), { size: 0.45, tone: 'lo' }));
  out.push(slab({ x: 8, y: 18, w: 14, d: 6, r: 2.6 }, BZ, 3, 'hi'));
  out.push(slab(PORTS, BZ, 11, 'mid', { seams: [BZ + 8.6], bevel: 0.5 }));
  out.push(onFaceY(PORTS.y + PORTS.d, [0, 1, 2, 3].map((i) => rect('lm-void', socketX(i) - 6.5, BZ + 1.8, 13, 6.4, 0.8)).join('')));
  out.push(`<g class="lm-leds">${[0, 1, 2, 3].map((i) => led([socketX(i), PORTS.y + PORTS.d, BZ + 9.8], i === WAY, 0.9)).join('')}</g>`);
  // Four guide rods hold the lid up; the far three are drawn before the lid, the near one after.
  const rods = byDepth(k.corners(R, 12));
  for (const [x, y] of rods.slice(0, 3)) out.push(post(x, y, 1.2, RIM, LID_Z - RIM, 'mid'));
  // The lid: vents, two antennas, and the row of lights on its front edge.
  out.push(slab(R, LID_Z, 8, 'hi', { seams: [LID_Z + 3], bevel: 1, steps: 8 }));
  out.push(L(Array.from({ length: 7 }, (_, i) => k.planOutline({ x: -30 + i * 9, y: -30, w: 3, d: 46, r: 1.5 }, LID_Z + 8, P, 3)).join(''), { tone: 'lo' }));
  out.push(L(k.planOutline(k.insetPlan(R, 6), LID_Z + 8, P, 8), { tone: 'faint' }));
  for (const [x, y] of byDepth([[R.x + 14, R.y + 10], [R.x + R.w - 14, R.y + 10]] as Plane[])) {
    out.push(S(k.cylinder(x, y, 3.2, LID_Z + 8, 3, P, 18), { tone: 'mid' }));
    out.push(S(k.cylinder(x, y, 1.9, LID_Z + 11, 20, P, 18), { tone: 'hi', crease: 'none' }));
  }
  out.push(`<g class="lm-leds">${[0, 1, 2, 3, 4].map((i) => led([-24 + i * 8, R.y + R.d, LID_Z + 4], i < 2, 1.2)).join('')}</g>`);
  const [nx, ny] = rods[3]!;
  out.push(post(nx, ny, 1.2, RIM, LID_Z - RIM, 'mid'));
  return figure(
    'inside',
    'LID OFF · 1 MESSAGE',
    out.join(''),
    'A home router with its lid lifted clear on four thin rods, so the board inside shows: a row of sockets along the near edge, a switch chip behind them, a processor under a finned plate, memory and a power block, joined by traces. One small lit block, a message, sits on the trace from a socket to the switch chip.',
    '30 0 540 420',
  );
}

/** The page figures, by name. */
export const PAGE_FIGURES = { inside, sources, notFound, notReady } as const;
export type PageFigure = keyof typeof PAGE_FIGURES;

/** A page figure, cropped close to its plate. */
export const pageFigure = (name: PageFigure): string => PAGE_FIGURES[name]();
