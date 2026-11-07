// @ts-nocheck -- ported drawing code; the checksum test in firewall.test.ts pins its output, so it is not re-typed line by line.
// The Firewalls lesson's scene: one plate cut in two by a wall. Outside, in front: a visitor's laptop and the admin's
// laptop, out on the internet. In the wall, a gate with two barrier arms that stay down until a rule allows a visit.
// The rule list is posted on the wall beside the gate. Inside, behind the gate: the web server. Ported from the
// approved mockup's FIGS/firewall-scene.mjs (firewalls-v1.html); the drawing is identical. Its ids carry a `fw-`
// prefix, so they stay unique on the page. The driver (src/scenes/drivers/firewall.ts) sends the lit tags along the
// cables, lights the rule rows one by one, lifts the arms or shows the stop mark, and lights the server; this module
// draws them and says where they are.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import './firewall.css';

/** A point on the plate: x, y and the height z. */
type Point = [number, number, number];

/** What the driver reads: the figure's camera, its origin, where the wall stands, and the ways a tag rides. */
export interface FirewallSceneData {
  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
  M: number[];
  /** The plate's origin on screen, where the moving parts are drawn before they are moved. */
  O: [number, number];
  /** The plate's y in front of which a tag is outside the wall; behind it, the tag is drawn behind the wall. */
  wallFront: number;
  /**
   * The ways a tag rides, as points on the plate: from each laptop to the gate, where a visit waits while the rules
   * are read, and from the gate to the top of the server. A reply rides `inside`, then a laptop's way, backwards.
   */
  routes: { visitor: Point[]; admin: Point[]; inside: Point[] };
}

const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
const PL = { x: -112, y: -66, w: 224, d: 142, r: 10 };
// The wall, the gate in it, and the beam over the gate.
const WALL_Y = -12, WALL_D = 12, WALL_H = 34, GATE = 22;
const W1 = { x: -106, y: WALL_Y, w: 106 - GATE, d: WALL_D, r: 1 };
const W2 = { x: GATE, y: WALL_Y, w: 106 - GATE, d: WALL_D, r: 1 };
const BEAM = { x: -GATE - 4, y: WALL_Y - 1, w: 2 * GATE + 8, d: WALL_D + 2, r: 1 }, BEAM_H = 6;
// The barrier: a post at each side of the gate, an arm on each that swings up to let a visit through.
const ARM_Y = -7.4, ARM_D = 2.6, ARM_Z = 12, ARM_T = 2.6, ARM_L = 17;
// The rule board on the wall's outside face, right of the gate.
const BOARD = { u: 27, z: 3.4, w: 74, h: 28.6 };
// The laptops, out on the internet, and the web server, behind the gate.
const LV = { x: -102, y: 14, w: 44, d: 28, r: 4 }, LA = { x: -54, y: 44, w: 44, d: 26, r: 4 }, LZ = 3.4, LID_H = 32;
const SV = { x: -42, y: -54, w: 30, d: 24, r: 1.8 }, SV_H = 54;
const CABLE_R = 1, CABLE_Z = 1.3, RIDE = CABLE_Z + CABLE_R + 0.4;

// One camera, the same as the DHCP and Subnetting scenes'. The frame is fitted afterwards to the plate, the tallest
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

// ---------- The plate ----------
function plate(label) {
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
  over.push(k.faceTextSvg(k.sideMatrix([PL.x + PL.w - 22, PL.y + PL.d], -3.2, P, "left"), label, { size: 3.6, tone: "mid", anchor: "end" }));
  // Which side is which, engraved on the floor.
  over.push(onTopAt(0, `<text class="fw-floor" x="8" y="62">THE INTERNET</text><text class="fw-floor" x="-104" y="-56">OFFICE</text>`));
  return { under, over: over.join("") };
}

// ---------- The wall: brick seams, the rule board on the right half ----------
function wall(Wl, board) {
  const F = Wl.y + Wl.d;
  const seams = []; for (let z = 8.5; z < WALL_H; z += 8.5) seams.push(k.sideSeam(Wl, z, P, 3));
  let face = "";
  for (let r = 0; r < 4; r++) for (let u = Wl.x + (r % 2 ? 7 : 14); u < Wl.x + Wl.w - 3; u += 14) {
    if (board && u > BOARD.u - 2 && u < BOARD.u + BOARD.w + 2 && r * 8.5 < BOARD.z + BOARD.h + 1) continue;
    face += `<path class="lm-mull" d="M${n1(u)} ${n1(-(r * 8.5))}V${n1(-(r * 8.5 + 8.5))}"/>`;
  }
  if (board) face += ruleBoard();
  return S(k.slabOf(Wl, 0, WALL_H, P, 3, 0.5), { tone: "hi", inner: L(seams.join(""), { tone: "faint" }) }) + onFaceY(F, face);
}
// Three rows, read from the top. Each row has a lamp: lit while the firewall checks it, then green or red if it fits.
const BOARD_ROWS = 3;
function ruleBoard() {
  const { u, z, w, h } = BOARD;
  let out = rect("lm-inlay", u, z, w, h, 1.6);
  out += `<text class="fw-board-h" x="${n1(u + 4)}" y="${n1(-(z + h - 4.2))}">RULES · TOP DOWN</text>`;
  for (let i = 0; i < BOARD_ROWS; i++) {
    const rz = z + h - 12.4 - i * 7.2;
    out += `<g class="fw-brow" id="fw-brow-${i}">${rect("fw-brow-bg", u + 2.4, rz - 1.9, w - 4.8, 6.2, 0.8)}<circle class="fw-lamp" cx="${n1(u + 6)}" cy="${n1(-(rz + 1))}" r="1.6"/><text class="fw-brow-t" id="fw-brow-t-${i}" x="${n1(u + 9.6)}" y="${n1(-(rz - 0.2))}"></text></g>`;
  }
  return out;
}

// ---------- The gate: the beam, the light bar under it, the posts and the two arms ----------
function gate() {
  const out = [];
  // The posts, against the wall's ends.
  for (const x of byDepth([[-GATE + 2.4, ARM_Y + ARM_D / 2], [GATE - 2.4, ARM_Y + ARM_D / 2]])) out.push(S(k.slabOf({ x: x[0] - 2.4, y: ARM_Y - 1.2, w: 4.8, d: ARM_D + 2.4, r: 0.8 }, 0, ARM_Z + ARM_T + 1, P, 3, 0.4), { tone: "mid" }));
  // Down: each arm reaches halfway across. Up: it stands upright against its post.
  const armDown = (side) => { const x0 = side < 0 ? -GATE + 4.8 : 0.6; return S(k.slabOf({ x: x0, y: ARM_Y, w: ARM_L - 1.2, d: ARM_D, r: 0.8 }, ARM_Z, ARM_T, P, 3, 0.4), { tone: "hi" }); };
  const armUp = (side) => { const x0 = side < 0 ? -GATE + 4.8 : GATE - 4.8 - ARM_T; return S(k.slabOf({ x: x0, y: ARM_Y, w: ARM_T, d: ARM_D, r: 0.8 }, ARM_Z, WALL_H - ARM_Z - 0.6, P, 3, 0.4), { tone: "hi" }); };
  out.push(`<g class="fw-arm down" id="fw-arms-down">${armDown(-1)}${armDown(1)}</g>`, `<g class="fw-arm up" id="fw-arms-up" style="opacity:0">${armUp(-1)}${armUp(1)}</g>`);
  // The beam over the gate, with the light bar on its outside face: green for a visit let in, red for one turned away.
  out.push(S(k.slabOf(BEAM, WALL_H, BEAM_H, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(BEAM, WALL_H + 2, P, 3), { tone: "faint" }) }));
  out.push(onFaceY(BEAM.y + BEAM.d, rect("lm-slot", -GATE + 2, WALL_H + 1.6, 2 * GATE - 4, 2.6, 1.2) + rect("fw-bar", -GATE + 2, WALL_H + 1.6, 2 * GATE - 4, 2.6, 1.2, ' id="fw-bar"')));
  return out.join("");
}

// ---------- The laptops ----------
function laptop(LB, id, label) {
  const out = [];
  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
  const keysX = 8, keysY = 3, pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 6 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.4, r: 1 };
  out.push(S(k.slabOf(LID, LZ, LID_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = LID.x + 3, w = LID.w - 6, z0 = LZ + 3, h = LID_H - 6;
  let scr = rect("lm-void", x0, z0, w, h, 0.8) + rect("fw-glow", x0, z0, w, h, 0.8, ` id="fw-glow-${id}"`);
  scr += rect("lm-slot", x0 + 2, z0 + h - 5.2, w - 4, 3, 0.8) + `<text class="fw-scr-s" x="${n1(x0 + 4)}" y="${n1(-(z0 + h - 4.3))}">${label}</text>`;
  for (let i = 0; i < 3; i++) scr += rect("lm-slot", x0 + 3, z0 + h - 11 - i * 5, w - 6 - (i === 2 ? 10 : 0), 2.2, 0.8);
  out.push(onFaceY(LID.y + LID.d, scr));
  return out.join("");
}

// ---------- The web server: a tall cabinet, its drive bays lit while it works ----------
function server() {
  const out = [], F = SV.y + SV.d;
  out.push(S(k.slabOf({ x: SV.x - 3, y: SV.y - 3, w: SV.w + 6, d: SV.d + 6, r: 2 }, 0, 1.8, P, 3, 0.4), { tone: "lo" }));
  out.push(S(k.slabOf(SV, 1.8, SV_H - 1.8, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(SV, SV_H - 5, P, 3), { tone: "faint" }) }));
  out.push(`<g class="fw-busy" id="fw-busy-server">${S(k.slabOf(SV, 1.8, SV_H - 1.8, P, 3, 0.6), { tone: "hi", lit: true })}</g>`);
  let face = "";
  const bays = 6;
  for (let b = 0; b < bays; b++) {
    const z = SV_H - 12 - b * 6.4;
    face += rect("lm-slot", SV.x + 3, z, SV.w - 11, 3.2, 0.5) + `<circle class="lm-led${b % 2 ? "" : " on"}" id="fw-sled-${b}" cx="${n1(SV.x + SV.w - 4.4)}" cy="${n1(-(z + 1.6))}" r="0.9"/>`;
  }
  face += `<text class="fw-scr-s" x="${n1(SV.x + 3)}" y="${n1(-(SV_H - 5.6))}">WEB · 10.0.0.10</text>`;
  out.push(onFaceY(F, face));
  let vents = "";
  for (let v = 0; v < 4; v++) vents += k.lineOnTop([SV.x + 5, SV.y + 4 + v * 5], [SV.x + SV.w - 5, SV.y + 4 + v * 5], SV_H, P);
  out.push(L(vents, { tone: "lo" }));
  return out.join("");
}

// ---------- Cables ----------
// The visitor's and the admin's cables meet in front of the gate; one cable runs on through the gate to the server.
const JX = -60, GX = -4, WAIT_Y = 17;
const SVF = [SV.x + SV.w / 2, SV.y + SV.d + 1];
const CABLES = {
  visitor: [[LV.x + LV.w + 1, LV.y + 16], [JX, LV.y + 16]],
  admin: [[LA.x - 1, LA.y + 14], [JX, LA.y + 14], [JX, 26], [GX, 26], [GX, 0], [GX, WALL_Y - 2], [SVF[0] + 3, SVF[1] + 6], [SVF[0] + 3, SVF[1]]],
};
const cable = (pts) => tubeOf(tubePieces(pts.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));

// ---------- Routes: the way a tag rides. Each visit stops in front of the gate while the rules are read. ----------
const onCable = (pts) => pts.map(([x, y]) => [x, y, RIDE]);
const ROUTES = {
  visitor: [[LV.x + LV.w / 2 + 6, LV.y + LV.d - 3, LZ + 0.6], ...onCable([[LV.x + LV.w + 1, LV.y + 16], [JX, LV.y + 16], [JX, 26], [GX, 26], [GX, WAIT_Y]])],
  admin: [[LA.x + LA.w / 2 - 6, LA.y + LA.d - 3, LZ + 0.6], ...onCable([[LA.x - 1, LA.y + 14], [JX, LA.y + 14], [JX, 26], [GX, 26], [GX, WAIT_Y]])],
  inside: [...onCable([[GX, WAIT_Y], [GX, WALL_Y - 2], [SVF[0] + 3, SVF[1] + 6], [SVF[0] + 3, SVF[1] + 1.5]]), [SVF[0] + 3, SVF[1] + 1.5, SV_H - 2], [SV.x + SV.w / 2, SV.y + SV.d / 2 + 2, SV_H + 0.6]],
};
// The words on each tag. The driver finds a message's tag by these words, which are the message's own `tag`.
const TAGS = { https: "HTTPS 443", ssh: "SSH 22", telnet: "TELNET 23", reply: "REPLY 443" };

// ---------- What hides a tag once it is behind the wall ----------
// The screen outline of a box is the hull of its eight corners. A tag behind the wall is drawn through a mask that
// leaves out the walls and the beam, so it disappears behind them and shows through the gate.
function hull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]), cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}
const boxHull = (b, z0, z1) => hull(k.boxCorners(b, z0, z1).map(at));
const BEHIND = [boxHull(W1, 0, WALL_H), boxHull(W2, 0, WALL_H), boxHull(BEAM, WALL_H, WALL_H + BEAM_H)];
// World y in front of which a tag is outside; behind it, the tag goes into the masked layer.
const WALL_FRONT = WALL_Y + WALL_D;

// ---------- Callouts: few, short, outside the plate ----------
// Each callout's text boxes, measured roughly from its font, so the frame can be fitted around them.
const TEXT_W = { "fw-name": 11.5 * 0.74, "fw-sub": 13 * 0.5, "fw-addr": 12.5 * 0.6 };
function callout(boxes, anchor, [dx, dy], lines, { align = "start", id = "" } = {}) {
  const [ax, ay] = at(anchor), tx = ax + dx, ty = ay + dy;
  for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
  const ex = tx + (align === "end" ? 7 : -7);
  const lead = `<path class="fw-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "fw-lead-dot", 2)}`;
  const text = lines.map((l, i) => `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
  return `<g class="fw-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
}

// ---------- Moving parts, drawn at the origin and moved by the driver ----------
const tag = (label) => {
  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="fw-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
};
// The stop mark: a red disc with a cross, over a visit the rules turned away.
const STOP_AT = [GX, WAIT_Y, 24];
const stop = () => { const [x, y] = at(STOP_AT); return `<g class="fw-stop" id="fw-stop" style="opacity:0"><circle class="fw-stop-d" cx="${n1(x)}" cy="${n1(y)}" r="6.4"/><path class="fw-stop-x" d="M${n1(x - 2.6)} ${n1(y - 2.6)}l5.2 5.2m0 -5.2l-5.2 5.2"/></g>`; };

// ---------- The scene ----------
function sceneSvg() {
  const pl = plate("FIREWALL · FIRST MATCH WINS");
  const things = [
    { xy: [SV.x + SV.w / 2, SV.y + SV.d / 2], svg: server() },
    { xy: [W1.x + W1.w / 2, W1.y + W1.d / 2], svg: wall(W1, false) },
    { xy: [W2.x + W2.w / 2, W2.y + W2.d / 2], svg: wall(W2, true) },
    { xy: [0, WALL_Y + WALL_D / 2 + 0.5], svg: gate() },
    { xy: [LV.x + LV.w / 2, LV.y + LV.d / 2], svg: laptop(LV, "visitor", "VISITOR") },
    { xy: [LA.x + LA.w / 2, LA.y + LA.d / 2], svg: laptop(LA, "admin", "ADMIN") },
  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  const cables = cable(CABLES.visitor) + cable(CABLES.admin);
  const tags = Object.entries(TAGS).map(([key, label]) => `<g class="fw-tag" id="fw-tag-${key}" style="opacity:0">${tag(label)}</g>`).join("");
  const trail = `<polyline class="fw-trail" id="fw-trail" points="" style="opacity:0"/>`;
  const boxes = [];
  const labels = [
    callout(boxes, [LV.x, LV.y + 1, LZ + LID_H - 8], [-22, 2], [{ cls: "fw-name", text: "Visitor" }, { cls: "fw-sub", text: "on the internet" }, { cls: "fw-addr", text: "203.0.113.50" }], { align: "end", id: "fw-call-visitor" }),
    callout(boxes, [LA.x, LA.y + LA.d / 2, LZ], [-36, 30], [{ cls: "fw-name", text: "Admin" }, { cls: "fw-sub", text: "looks after the server" }, { cls: "fw-addr", text: "198.51.100.7" }], { align: "end", id: "fw-call-admin" }),
    callout(boxes, [BEAM.x + 6, BEAM.y, WALL_H + BEAM_H], [-26, -58], [{ cls: "fw-name", text: "Firewall" }, { cls: "fw-sub", text: "checks every visit at the gate" }], { align: "end", id: "fw-call-firewall" }),
    callout(boxes, [SV.x + SV.w, SV.y, SV_H], [40, -22], [{ cls: "fw-name", text: "Web server" }, { cls: "fw-addr", text: "10.0.0.10" }], { id: "fw-call-server" }),
    callout(boxes, [W2.x + BOARD.u + BOARD.w, W2.y + W2.d, BOARD.z + BOARD.h], [44, -6], [{ cls: "fw-name", text: "Rule list" }, { cls: "fw-sub", text: "read from the top" }], { id: "fw-call-rules" }),
  ].join("");
  // The frame: the plate, the tallest parts and every callout, with a margin.
  const pts = [...k.boxCorners(PL, FLOOR, 0), [SV.x, SV.y, SV_H], [SV.x + SV.w, SV.y, SV_H], [BEAM.x, BEAM.y, WALL_H + BEAM_H]].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 16;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  const mask = `<mask id="fw-behind" maskUnits="userSpaceOnUse" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="#fff"/>${BEHIND.map((h) => `<polygon points="${h.map((p) => p.map(n1).join(",")).join(" ")}" fill="#000"/>`).join("")}</mask>`;
  const body = `<defs>${mask}</defs>` + pl.under + `<g class="lm-body">${pl.over}${cables}${things.map((t) => t.svg).join("")}${trail}<g id="fw-layer-behind" mask="url(#fw-behind)"></g><g id="fw-layer-front">${tags}</g>${stop()}</g>` + labels;
  return `<svg data-figure="firewall" class="lm-svg fw" viewBox="${vb.join(" ")}" role="img" aria-label="A firewall on one plate. A wall runs across the middle with a gate in it, and two barrier arms close the gate. Outside, on the internet, are a visitor’s laptop and the admin’s laptop. The firewall’s rule list is posted on the wall beside the gate. Inside, behind the gate, stands the web server.">${body}</svg>`;
}

// What the driver needs: the camera as six numbers, the origin, where the wall stands, and the routes.
function sceneData(): FirewallSceneData {
  const o = at([0, 0, 0]), ex = at([1000, 0, 0]), ey = at([0, 1000, 0]), ez = at([0, 0, 1000]);
  const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
  const r2 = (p) => p.map((v) => +v.toFixed(2));
  return { M, O: o.map((v) => +v.toFixed(2)), wallFront: WALL_FRONT, routes: Object.fromEntries(Object.entries(ROUTES).map(([n, pts]) => [n, pts.map(r2)])) };
}

/** The Firewalls scene, drawn at build time: its SVG and the data its driver reads. */
export function drawFirewall(): DrawnFigure {
  return { svg: sceneSvg(), data: sceneData() };
}
