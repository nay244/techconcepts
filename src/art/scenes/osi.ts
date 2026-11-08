// @ts-nocheck -- ported drawing code; osi.test.ts pins what its driver relies on, so it is not re-typed line by line.
// The OSI Model lesson's scene: three stacks of layer blocks on one plate. Left, the sending laptop's seven layers;
// in the middle, a router's three; right, the web server's seven. Same layer, same height, so a layer lines up with
// its twin across the plate. A cable joins the bottoms of the stacks. Ported from the approved mockup's live figure,
// `liveSvg()` in .superpowers/brainstorm/2830-1793891117/figs/osi-scene.mjs (style A, solid blocks); its geometry,
// camera, frame and callouts are the mockup's. Two things differ on purpose. Each block is drawn once, unlit: the
// driver lights it with the kit's lit state (`data-lit`), where the mockup drew every block twice. And the figure says
// no words of its own: each word (a layer's name, a callout's lines, the plate's engraving) is an empty slot marked
// `data-label`, which the lesson's `scene.labels` fills (labels.ts). Its ids carry an `osi-` prefix, so they stay
// unique on the page. The driver (src/scenes/drivers/osi.ts) lights the blocks, shows the peer lines and sends the tag
// along the cable; this module draws them and says where they are.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import { OSI_ROUTES, OSI_STACKS } from './osi-stacks';
import './osi.css';

/** A point on the plate: x, y and the height z. */
type Point = [number, number, number];

/** What the driver reads: the figure's camera, its origin, and the two ways the tag rides the cable. */
export interface OsiSceneData {
  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
  M: number[];
  /** The plate's origin on screen, where the tag is drawn before it is moved. */
  O: [number, number];
  /** Each cable ride, start then end, on the plate: from 3 units outside one stack's footprint to 3 outside the next's. */
  routes: Record<'laptop>router' | 'router>server', [Point, Point]>;
}

const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
const PL = { x: -112, y: -74, w: 224, d: 148, r: 10 };
// The camera is fitted to the plate, as the Firewalls scene's is. The frame is fitted afterwards to the plate, the
// stacks and the callouts, which sit off the plate on the page's own background, so they read in both themes.
const P = k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
const V = G.viewOf(P);
const at = (p) => k.iso(p, P);
const depth = (p) => k.depthOf(p, P);
const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
const tubeOf = (pieces, tone = "hi") => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone })).join("");
// An engraving drawn empty, marked with the key of the word that goes in it.
const slot = (text, key) => text.replace('<text class="iso-face-text"', `<text class="iso-face-text" data-label="${key}"`);

// Same layer, same height in every stack.
const LZ = (n) => 2 + (n - 1) * 11, LH = 8;
const TOP = LZ(7) + LH;
// Narrow enough, and far enough apart, that the cable between them shows and a message can be seen riding it.
const TW = 34;
const STACKS = {
  laptop: { plan: { x: -42 - TW / 2, y: 52 - TW / 2, w: TW, d: TW, r: 2 }, layers: OSI_STACKS.laptop },
  router: { plan: { x: 10 - TW / 2, y: -TW / 2, w: TW, d: TW, r: 2 }, layers: OSI_STACKS.router },
  server: { plan: { x: 62 - TW / 2, y: -52 - TW / 2, w: TW, d: TW, r: 2 }, layers: OSI_STACKS.server },
};
const mid = (t) => [t.plan.x + t.plan.w / 2, t.plan.y + t.plan.d / 2];

// ---------- The plate ----------
function plate() {
  const under = `<path class="lm-pool" d="${k.ring(0, 0, 260, FLOOR, P, 120)}"/><path class="iso-halo" d="${k.haloOf(PL, FLOOR, PLATE_H, P)}"/>`;
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
  over.push(slot(k.faceTextSvg(k.sideMatrix([PL.x + PL.w - 22, PL.y + PL.d], -3.2, P, "left"), "", { size: 3.6, tone: "mid", anchor: "end" }), "plate"));
  return { under, over: over.join("") };
}

// ---------- The cable between the stacks, on the plate ----------
const CABLE_R = 1.1, CABLE_Z = 1.3;
const cable = () => {
  const a = STACKS.laptop.plan, r = STACKS.router.plan, b = STACKS.server.plan;
  const leg = (p, q) => tubeOf(tubePieces([[...p, CABLE_Z], [...q, CABLE_Z]], CABLE_R, P, { maxLength: 14 }));
  return { left: leg([a.x + a.w - 4, a.y + 4], [r.x + 4, r.y + r.d - 4]), right: leg([r.x + r.w - 4, r.y + 4], [b.x + 4, b.y + b.d - 4]) };
};

// ---------- A stack: blocks on a spine ----------
// Each block is the mockup's unlit block: a mid-tone slab with a seam near its top, and its number engraved on the
// front with the layer's name after it. The driver lights it by setting `data-lit` on its slab and `on` on its group;
// osi.css then hides the seam and inks the engraving dark on the lit face, as the mockup's lit block.
function stack(key) {
  const t = STACKS[key], p = t.plan, [cx, cy] = mid(t), out = [];
  out.push(S(k.slabOf(k.insetPlan(p, -2), 0, 2, P, 6, 0.5), { tone: "lo" }));
  for (let n = 1; n <= t.layers; n++) {
    const z = LZ(n);
    // The kit escapes the engraving's text, so the name's slot goes in after.
    const name = k.faceTextSvg(k.sideMatrix([p.x + 3.4, p.y + p.d], z + 2.5, P, "left"), `${n}  `, { size: 2.9, tone: "mid" }).replace(/<\/text>$/, `<tspan data-label="layer-${n}"></tspan></text>`);
    const block = S(k.slabOf(p, z, LH, P, 6, 0.9), { tone: "mid", inner: L(k.sideSeam(p, z + LH - 1.6, P, 6), { tone: "faint", className: "osi-seam" }) });
    out.push(`<g class="osi-L" id="osi-L-${key}-${n}">${block}${name}</g>`);
    // The spine between this block and the next.
    if (n < t.layers) out.push(S(k.cylinder(cx, cy, 5, z + LH, 3, P, 28), { tone: "lo" }));
  }
  return out.join("");
}

// ---------- Routes: the tag rides from 3 units outside one footprint to 3 units outside the next ----------
const RIDE = CABLE_Z + CABLE_R + 0.4;
function routes() {
  const a = STACKS.laptop.plan, r = STACKS.router.plan, b = STACKS.server.plan;
  return {
    "laptop>router": [[a.x + a.w + 3, a.y - 3, RIDE], [r.x - 3, r.y + r.d + 3, RIDE]],
    "router>server": [[r.x + r.w + 3, r.y - 3, RIDE], [b.x - 3, b.y + b.d + 3, RIDE]],
  };
}

// ---------- Callouts: few, short, outside the plate ----------
// Each line is an empty slot for the lesson's word. The frame makes room for the words the approved mockup had there,
// by their length in characters, so the layout stays the mockup's.
const TEXT_W = { "osi-name": 11.5 * 0.74, "osi-sub": 13 * 0.5 };
function callout(boxes, anchor, [dx, dy], lines, { align = "start", id }) {
  const [ax, ay] = at(anchor), tx = ax + dx, ty = ay + dy;
  for (const [i, l] of lines.entries()) { const w = l.room * TEXT_W[l.cls], x0 = align === "end" ? tx - w : align === "middle" ? tx - w / 2 : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
  const ex = tx + (align === "end" ? 7 : align === "middle" ? 0 : -7);
  const lead = `<path class="osi-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/><circle class="osi-lead-dot" cx="${n1(ax)}" cy="${n1(ay)}" r="2"/>`;
  const text = lines.map((l, i) => `<text class="${l.cls}" data-label="${l.label}" x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}"></text>`).join("");
  return `<g class="osi-call" id="${id}">${lead}${text}</g>`;
}
// A callout's two lines: the place's name, and what it does. `room` is the mockup's words' length:
// "Your laptop" / "sends", "Router" / "passes it on", "Web server" / "receives".
const lines = (place, nameRoom, subRoom) => [{ cls: "osi-name", label: place, room: nameRoom }, { cls: "osi-sub", label: `${place}-sub`, room: subRoom }];

// ---------- The scene ----------
function sceneSvg() {
  const boxes = [], pl = plate(), c = cable();
  const a = STACKS.laptop.plan, r = STACKS.router.plan, b = STACKS.server.plan;
  // Peer lines: each layer talks to its twin. Layers 1 to 3 run through the router; 4 to 7 pass over it.
  const line = (p, q) => { const [x1, y1] = at(p), [x2, y2] = at(q); return `<path class="osi-peer" d="M${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}"/>`; };
  const peerLines = [];
  for (let n = 1; n <= 7; n++) {
    const z = LZ(n) + LH / 2;
    const segs = n <= 3 ? line([a.x + a.w, a.y, z], [r.x, r.y + r.d, z]) + line([r.x + r.w, r.y, z], [b.x, b.y + b.d, z]) : line([a.x + a.w, a.y, z], [b.x, b.y + b.d, z]);
    peerLines.push(`<g class="osi-peers" id="osi-peer-${n}">${segs}</g>`);
  }
  // The tag the message rides the cable as, drawn at the origin and moved by the driver.
  const T = { x: -7, y: -4, w: 14, d: 8, r: 1.4 };
  const tag = `<g class="osi-tag" id="osi-tag">${S(k.slabOf(T, 0, 3, P, 3, 0.5), { tone: "hi", lit: true })}${onTopAt(3, `<text class="osi-tag-t" x="0" y="1.4" text-anchor="middle">0101</text>`)}</g>`;
  // Back to front: the laptop, its cable, the router, its cable, the server (all three stand on one depth line).
  const body = [pl.over, stack("laptop"), c.left, stack("router"), c.right, stack("server"), peerLines.join(""), tag].join("");
  // The router's callout sits below the plate, under the router, so the peer lines never cross it.
  const labels = [
    callout(boxes, [a.x + a.w / 2, a.y, TOP + 2], [-10, -34], lines("laptop", 11, 5), { align: "end", id: "osi-call-laptop" }),
    callout(boxes, [r.x + r.w, r.y + r.d, 0], [0, 106], lines("router", 6, 12), { align: "middle", id: "osi-call-router" }),
    callout(boxes, [b.x + b.w / 2, b.y, TOP + 2], [12, -30], lines("server", 10, 8), { id: "osi-call-server" }),
  ];
  // The frame: the plate, the tops of the stacks and every callout, with a margin.
  const pts = [...k.boxCorners(PL, FLOOR, 0), [a.x, a.y, TOP + 8], [b.x + b.w, b.y, TOP + 8], [a.x, a.y + a.d, TOP + 8], [b.x + b.w, b.y + b.d, TOP]].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 14;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  return `<svg data-figure="osi" class="lm-svg osi" viewBox="${vb.join(" ")}" role="img" aria-label="Three stacks of layers on one plate: the sending laptop's seven, a router's three, and the web server's seven, joined by a cable along the bottom.">${pl.under}<g class="lm-body">${body}</g>${labels.join("")}</svg>`;
}

// What the driver needs: the camera as six numbers, the origin, and the two rides.
function sceneData(): OsiSceneData {
  const o = at([0, 0, 0]), ex = at([1000, 0, 0]), ey = at([0, 1000, 0]), ez = at([0, 0, 1000]);
  const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
  const r2 = (p) => p.map((v) => +v.toFixed(2));
  const ride = routes();
  return { M, O: o.map((v) => +v.toFixed(2)), routes: Object.fromEntries(OSI_ROUTES.map((name) => [name, ride[name].map(r2)])) };
}

/** The OSI Model scene, drawn at build time: its SVG, its words left empty, and the data its driver reads. */
export function drawOsi(): DrawnFigure {
  return { svg: sceneSvg(), data: sceneData() };
}
