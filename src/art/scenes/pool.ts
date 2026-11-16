// @ts-nocheck -- drawing code in the scenes' own style; the checksum test in pool.test.ts pins its output, so it is not typed line by line.
// The Load Balancers lesson's scene: one plate, drawn as a bow tie of cables. In front, out on the internet, three
// readers' laptops; their cables meet at the load balancer in the middle, the one address they all use. Behind it, in
// the pool, three servers, A, B and C, each cabled to the balancer. Each server carries its last two health checks as
// two lamps on its front, and a chip on its top for every request the balancer has passed it. The driver
// (src/scenes/drivers/pool.ts) rides the tags along the cables, stops each request on the balancer while it picks a
// server, lights the lamps from the pool table and stacks the chips; this module draws them and says where they are.
// Its ids carry a `pl-` prefix, so they stay unique on the page.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import { POOL_CHIPS, POOL_READERS, POOL_SERVERS } from './pool-parts';
import './pool.css';

/** A point on the plate: x, y and the height z. */
type Point = [number, number, number];


/** What the driver reads: the camera, its origin, and the legs a tag rides. */
export interface PoolSceneData {
  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
  M: number[];
  /** The plate's origin on screen, where the moving parts are drawn before they are moved. */
  O: [number, number];
  /**
   * The legs a tag rides, as points on the plate. A reader's leg runs from its screen along its cable to the top of the
   * balancer, where a request waits while the balancer picks; a server's leg runs from the top of the balancer along
   * that server's cable to the top of its chip stack. A request rides its reader's leg, then its server's; a check
   * rides a server's leg; an answer rides it backwards.
   */
  legs: Record<(typeof POOL_READERS)[number] | (typeof POOL_SERVERS)[number], Point[]>;
}

const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
const PL = { x: -112, y: -80, w: 224, d: 160, r: 10 };
// The pool, at the back: three server cabinets in a row, inside an engraved outline.
const SV_W = 30, SV_D = 22, SV_H = 44, SV_PITCH = 54, SV_Y = -70, SV_X0 = -48;
const SV = POOL_SERVERS.map((_, i) => ({ x: SV_X0 + i * SV_PITCH, y: SV_Y, w: SV_W, d: SV_D, r: 1.8 }));
const POOL = { x: SV_X0 - 9, y: SV_Y - 5, w: 2 * SV_PITCH + SV_W + 18, d: SV_D + 16, r: 4 };
// The balancer, in the middle: a low box on a plinth, one port in front, three behind.
const BL = { x: -14, y: -26, w: 54, d: 24, r: 2.6 }, BL_Z = 2, BL_H = 17;
const BL_IN = [BL.x + 12, BL.y + BL.d];
const BL_OUT = [BL.x + 12, BL.x + 27, BL.x + 42].map((x) => [x, BL.y]);
const BL_TOP = [BL.x + BL.w / 2, BL.y + BL.d / 2, BL_H + 1.2];
// The readers, in front: three laptops in a row, their screens facing out.
const LP_W = 38, LP_D = 24, LP_Z = 3, LP_LID = 25, LP_Y = 50;
const LP = POOL_READERS.map((_, i) => ({ x: -94 + i * 62, y: LP_Y, w: LP_W, d: LP_D, r: 3.4 }));
const CABLE_R = 1, CABLE_Z = 1.3, RIDE = CABLE_Z + CABLE_R + 0.4;
// A chip on a server's top for each request it has been passed.
const CHIP = { w: 16, d: 11, h: 1.8, gap: 0.6 };

// One camera, the same as the DHCP and network map scenes'. The frame is fitted afterwards to the plate, the tallest
// parts and the callouts, which sit off the plate on the page's own background, so they read in both themes.
const P = k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
const V = G.viewOf(P);
const at = (p) => k.iso(p, P);
const depth = (p) => k.depthOf(p, P);
const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
const tubeOf = (pieces, tone = "hi") => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone })).join("");
const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"${extra}/>`;
const upper = (id) => id.toUpperCase();

// ---------- The plate ----------
function plate(label) {
  const under = `<path class="lm-pool" d="${k.ring(0, 0, 250, FLOOR, P, 120)}"/><path class="iso-halo" d="${k.haloOf(PL, FLOOR, PLATE_H, P)}"/>`;
  const over = [];
  for (const [x, y] of byDepth(k.corners(PL, 18))) {
    over.push(S(k.cylinder(x, y, 6, FLOOR, 1.3, P, 28), { tone: "lo" }));
    over.push(S(k.cylinder(x, y, 4.6, FLOOR + 1.3, FOOT_H - 1.3, P, 28), { tone: "mid" }));
  }
  over.push(S(k.slabOf(PL, -PLATE_H, PLATE_H, P, 8, 1.3), { tone: "mid", inner: L(k.sideSeam(PL, -PLATE_H + 2.2, P, 8), { tone: "faint" }) }));
  over.push(L(k.planOutline(k.insetPlan(PL, 4), 0, P), { tone: "lo" }));
  const screws = k.corners(PL, 9);
  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2.1, 0, P, 18)).join(""), { tone: "lo" }));
  over.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.6, tone: "mid" }));
  over.push(k.faceTextSvg(k.sideMatrix([PL.x + PL.w - 22, PL.y + PL.d], -3.2, P, "left"), label, { size: 3.6, tone: "mid", anchor: "end" }));
  // The pool's outline on the floor, and which side is which, engraved.
  over.push(L(k.planOutline(POOL, 0, P, 4), { tone: "lo", dashed: true }));
  over.push(onTopAt(0, `<text class="pl-floor" x="${POOL.x + POOL.w - 3}" y="${POOL.y + POOL.d - 3}" text-anchor="end">THE POOL</text><text class="pl-floor" x="${LP[0].x}" y="${LP_Y + LP_D + 8}">THE INTERNET</text>`));
  return { under, over: over.join("") };
}

// ---------- A reader's laptop ----------
function laptop(LB, id, label) {
  const out = [];
  out.push(S(k.slabOf(LB, 0, LP_Z, P, 5, 0.8), { tone: "hi" }));
  const keysX = 7, keysY = 3, pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 5 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LP_Z, P, 3);
  out.push(L(keys, { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.2, r: 1 };
  out.push(S(k.slabOf(LID, LP_Z, LP_LID, P, 3, 0.5), { tone: "hi" }));
  const x0 = LID.x + 2.6, w = LID.w - 5.2, z0 = LP_Z + 2.6, h = LP_LID - 5.2;
  let scr = rect("lm-void", x0, z0, w, h, 0.8) + rect("pl-glow", x0, z0, w, h, 0.8, ` id="pl-glow-${id}"`);
  scr += rect("lm-slot", x0 + 2, z0 + h - 5, w - 4, 3, 0.8) + `<text class="pl-scr-s" x="${n1(x0 + 3.6)}" y="${n1(-(z0 + h - 4.1))}">${label}</text>`;
  for (let i = 0; i < 3; i++) scr += rect("lm-slot", x0 + 3, z0 + h - 10.4 - i * 4.4, w - 6 - (i === 2 ? 9 : 0), 2, 0.8);
  out.push(onFaceY(LID.y + LID.d, scr));
  return out.join("");
}

// ---------- The load balancer: one port in front, three behind, its address on its face ----------
function balancer() {
  const out = [], F = BL.y + BL.d;
  out.push(S(k.slabOf({ x: BL.x - 3, y: BL.y - 3, w: BL.w + 6, d: BL.d + 6, r: 3 }, 0, BL_Z, P, 4, 0.5), { tone: "lo" }));
  out.push(S(k.slabOf(BL, BL_Z, BL_H - BL_Z, P, 4, 0.7), { tone: "hi", inner: L(k.sideSeam(BL, BL_Z + 3.2, P, 4), { tone: "faint" }) }));
  // Vents on the top, at the back.
  for (let i = 0; i < 6; i++) out.push(L(k.planOutline({ x: BL.x + 6 + i * 6.4, y: BL.y + 3, w: 2.4, d: 7, r: 1.2 }, BL_H, P, 3), { tone: "lo" }));
  // The front: the port the internet comes in on, the address in a window, and a light for each server it can pick.
  let face = rect("lm-slot", BL_IN[0] - 4, BL_Z + 2.6, 8, 5.4, 0.8) + rect("lm-inlay", BL_IN[0] - 4.8, BL_Z + 1.8, 9.6, 7, 1);
  face += rect("lm-void", BL.x + 20, BL_Z + 6, 30, 7, 0.8) + `<text class="pl-scr" x="${n1(BL.x + 35)}" y="${n1(-(BL_Z + 8.2))}" text-anchor="middle">203.0.113.80</text>`;
  POOL_SERVERS.forEach((s, i) => {
    const u = BL.x + 26 + i * 8;
    face += `<circle class="lm-led" id="pl-pick-${s}" cx="${n1(u)}" cy="${n1(-(BL_Z + 2.8))}" r="1.1"/><text class="pl-led-t" x="${n1(u + 1.8)}" y="${n1(-(BL_Z + 1.9))}">${upper(s)}</text>`;
  });
  out.push(onFaceY(F, face));
  return out.join("");
}

// ---------- A server: a cabinet with its letter, its two health lamps, drive bays, and its chips on top ----------
function server(s, B) {
  const out = [], F = B.y + B.d;
  out.push(S(k.slabOf({ x: B.x - 2.6, y: B.y - 2.6, w: B.w + 5.2, d: B.d + 5.2, r: 2 }, 0, 1.8, P, 3, 0.4), { tone: "lo" }));
  out.push(S(k.slabOf(B, 1.8, SV_H - 1.8, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, SV_H - 9, P, 3), { tone: "faint" }) }));
  let face = `<text class="pl-letter" x="${n1(B.x + 3.4)}" y="${n1(-(SV_H - 7.6))}">${upper(s)}</text>`;
  // The last two health checks, the older on the left: each lamp is green for an answer in time, red for none.
  face += rect("lm-inlay", B.x + B.w - 15, SV_H - 8.2, 12.4, 5.6, 2.8);
  face += [0, 1].map((n) => `<circle class="pl-lamp" id="pl-lamp-${s}-${n}" data-check="ok" cx="${n1(B.x + B.w - 12.2 + n * 6.8)}" cy="${n1(-(SV_H - 5.4))}" r="1.9"/>`).join("");
  for (let b = 0; b < 4; b++) {
    const z = SV_H - 15 - b * 6;
    face += rect("lm-slot", B.x + 3, z, B.w - 10, 3, 0.5) + `<circle class="lm-led${b === 0 ? " on" : ""}" cx="${n1(B.x + B.w - 4.4)}" cy="${n1(-(z + 1.5))}" r="0.8"/>`;
  }
  out.push(onFaceY(F, face));
  let vents = "";
  for (let v = 0; v < 3; v++) vents += k.lineOnTop([B.x + 4, B.y + 4 + v * 3.2], [B.x + 9, B.y + 4 + v * 3.2], SV_H, P);
  out.push(L(vents, { tone: "lo" }));
  // The chips: hidden until the pool table gives the server requests; the newest one lights while its request lands.
  const cx = B.x + B.w / 2 + 2, cy = B.y + B.d / 2;
  for (let i = 0; i < POOL_CHIPS; i++) {
    const C = { x: cx - CHIP.w / 2, y: cy - CHIP.d / 2, w: CHIP.w, d: CHIP.d, r: 1.2 }, z = SV_H + i * (CHIP.h + CHIP.gap);
    out.push(`<g class="pl-chip" id="pl-chip-${s}-${i}" style="opacity:0">${S(k.slabOf(C, z, CHIP.h, P, 3, 0.4), { tone: "mid" })}</g>`);
    out.push(`<g class="pl-chip-lit" id="pl-chip-lit-${s}-${i}" style="opacity:0">${S(k.slabOf(C, z, CHIP.h, P, 3, 0.4), { tone: "hi", lit: true })}</g>`);
  }
  return out.join("");
}
const chipTop = (B) => [B.x + B.w / 2 + 2, B.y + B.d / 2, SV_H + POOL_CHIPS * (CHIP.h + CHIP.gap) + 1];

// ---------- Cables: a bow tie, three readers in to one balancer, one balancer out to three servers ----------
const IN = LP.map((B) => [[B.x + B.w / 2, B.y - 1], [B.x + B.w / 2, LP_Y - 12], [BL_IN[0], LP_Y - 12], [BL_IN[0], BL_IN[1] + 3]]);
const OUT = SV.map((B, i) => [[BL_OUT[i][0], BL_OUT[i][1] - 3], [BL_OUT[i][0], -36 - i * 3], [B.x + B.w / 2, -36 - i * 3], [B.x + B.w / 2, B.y + B.d + 3]]);
const cable = (pts) => tubeOf(tubePieces(pts.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));

// ---------- Legs: the way a tag rides ----------
const onCable = (pts) => pts.map(([x, y]) => [x, y, RIDE]);
const LEGS = {
  ...Object.fromEntries(POOL_READERS.map((r, i) => {
    const B = LP[i];
    return [r, [[B.x + B.w / 2, B.y - 3, LP_LID + 4], [B.x + B.w / 2, B.y - 3, RIDE], ...onCable(IN[i]), [BL_IN[0], BL.y + BL.d + 1, BL_H + 1.2], BL_TOP]];
  })),
  ...Object.fromEntries(POOL_SERVERS.map((s, i) => {
    const B = SV[i];
    return [s, [BL_TOP, [BL_OUT[i][0], BL.y - 1, BL_H + 1.2], ...onCable(OUT[i]), [B.x + B.w / 2, B.y + B.d + 3, SV_H + 2], chipTop(B)]];
  })),
};

// ---------- Callouts: few, short, outside the plate ----------
const TEXT_W = { "pl-name": 11.5 * 0.74, "pl-sub": 13 * 0.5, "pl-addr": 12.5 * 0.6 };
function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } = {}) {
  const [ax, ay] = at(anchor);
  for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
  const ex = tx + (align === "end" ? 7 : -7);
  const lead = `<path class="pl-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "pl-lead-dot", 2)}`;
  const text = lines.map((l, i) => l.svg ? l.svg(tx, ty + i * 16, align) : `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
  return `<g class="pl-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
}
// A server's health, as the driver writes it from the pool table: a small square, then the table's words.
const health = (s) => ({
  cls: "pl-sub", text: "1 check missed",
  svg: (x, y) => `<g class="pl-health" id="pl-health-${s}" data-health="healthy"><rect class="pl-health-mark" x="${n1(x)}" y="${n1(y - 9)}" width="8" height="8" rx="1"/><text class="pl-health-t" id="pl-health-t-${s}" x="${n1(x + 12)}" y="${n1(y)}">Healthy</text></g>`,
});

// ---------- Moving parts, drawn at the origin and moved by the driver ----------
const TAGS = ["REQUEST", "CHECK", "OK"];
const tag = (label) => {
  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="pl-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
};
// Over a server that does not answer a check in time: a dashed ring around where the check waits.
const quiet = (s, B) => { const [x, y] = at(chipTop(B)); return `<g class="pl-quiet" id="pl-quiet-${s}" style="opacity:0"><circle class="pl-quiet-r" cx="${n1(x)}" cy="${n1(y - 2)}" r="13"/></g>`; };
// Over the balancer's port for a server it skips: a small red stop mark.
const skip = (s, i) => { const [x, y] = at([BL_OUT[i][0], BL.y - 4, BL_H + 6]); return `<g class="pl-skip" id="pl-skip-${s}" style="opacity:0"><circle class="pl-skip-d" cx="${n1(x)}" cy="${n1(y)}" r="5"/><path class="pl-skip-x" d="M${n1(x - 2)} ${n1(y - 2)}l4 4m0 -4l-4 4"/></g>`; };

// ---------- The scene ----------
function sceneSvg() {
  const pl = plate("ONE ADDRESS · THREE SERVERS");
  const things = [
    ...SV.map((B, i) => ({ xy: [B.x + B.w / 2, B.y + B.d / 2], svg: server(POOL_SERVERS[i], B) })),
    { xy: [BL.x + BL.w / 2, BL.y + BL.d / 2], svg: balancer() },
    ...LP.map((B, i) => ({ xy: [B.x + B.w / 2, B.y + B.d / 2], svg: laptop(B, POOL_READERS[i], ["YOU", "READER 2", "READER 3"][i]) })),
  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  const cables = [...IN, ...OUT].map(cable).join("");
  const tags = TAGS.map((l) => `<g class="pl-tag" id="pl-tag-${l.toLowerCase()}" style="opacity:0">${tag(l)}</g>`).join("");
  const trail = `<polyline class="pl-trail" id="pl-trail" points="" style="opacity:0"/>`;
  const boxes = [];
  const labels = [
    ...SV.map((B, i) => {
      const s = POOL_SERVERS[i];
      const [cx, cy] = at([SV[2].x + SV[2].w, SV[2].y, SV_H]);
      return callout(boxes, [B.x + B.w, B.y, SV_H - 3], [cx + 40, cy - 112 + i * 62], [{ cls: "pl-name", text: `Server ${upper(s)}` }, { cls: "pl-addr", text: `10.0.0.1${i + 1}` }, health(s)], { id: `pl-call-${s}` });
    }),
    callout(boxes, [BL.x + BL.w, BL.y + BL.d, BL_H], [at([BL.x + BL.w, BL.y + BL.d, BL_H])[0] + 70, at([BL.x + BL.w, BL.y + BL.d, BL_H])[1] + 40], [{ cls: "pl-name", text: "Load balancer" }, { cls: "pl-addr", text: "example.net" }, { cls: "pl-addr", text: "203.0.113.80" }], { id: "pl-call-balancer" }),
    ...LP.map((B, i) => {
      const r = POOL_READERS[i], [ax, ay] = at([B.x, B.y + B.d, LP_Z]);
      return callout(boxes, [B.x, B.y + B.d, LP_Z], [ax - 18, ay + 30 + i * 4], [{ cls: "pl-name", text: ["You", "Reader 2", "Reader 3"][i] }], { align: "end", id: `pl-call-${r}` });
    }),
  ].join("");
  // The frame: the plate, the tallest parts and every callout, with a margin.
  const pts = [...k.boxCorners(PL, FLOOR, 0), ...SV.map(chipTop)].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 16;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  const marks = SV.map((B, i) => quiet(POOL_SERVERS[i], B) + skip(POOL_SERVERS[i], i)).join("");
  const body = pl.under + `<g class="lm-body">${pl.over}${cables}${things.map((t) => t.svg).join("")}${trail}${tags}${marks}</g>` + labels;
  return `<svg data-figure="pool" class="lm-svg pl" viewBox="${vb.join(" ")}" role="img" aria-label="${POOL_DESCRIPTION}">${body}</svg>`;
}

/** The figure's description, for a screen reader. */
export const POOL_DESCRIPTION = "A load balancer on one plate. In front, out on the internet, three readers’ laptops, their cables meeting at the balancer in the middle, whose address all three use. Behind it, in the pool, three servers, A, B and C, each cabled to the balancer, each with two lamps for its last two health checks.";

// What the driver needs: the camera as six numbers, the origin, and the legs.
function sceneData(): PoolSceneData {
  const o = at([0, 0, 0]), ex = at([1000, 0, 0]), ey = at([0, 1000, 0]), ez = at([0, 0, 1000]);
  const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
  const r2 = (p) => p.map((v) => +v.toFixed(2));
  return { M, O: o.map((v) => +v.toFixed(2)), legs: Object.fromEntries(Object.entries(LEGS).map(([n, pts]) => [n, pts.map(r2)])) };
}

/** The Load Balancers scene, drawn at build time: its SVG and the data its driver reads. */
export function drawPool(): DrawnFigure {
  return { svg: sceneSvg(), data: sceneData() };
}
