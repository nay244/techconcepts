// @ts-nocheck -- ported drawing code; the checksum test in subnet.test.ts pins its output, so it is not re-typed line by line.
// The Subnetting lesson's scene: one office floor. Four teams each have a pad with a switch: Sales, Design, Servers and
// the guest Wi-Fi. The office router stands at the back with a cable to every switch, and the provider's router beside
// it on a link of its own. Ported from the approved mockup's FIGS/subnet-scene.mjs (subnet-v1.html); the drawing is
// identical. Its ids already carry an `sn-` prefix, so they stay unique on the page. The driver
// (src/scenes/drivers/subnet.ts) lights the lines round the floor or each pad, spreads the broadcast rings and sends
// the lit tags along the cables; this module draws them and says where they are.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import './subnet.css';

/** What the driver reads: the figure's camera, the tags' ways along the cables, and how far each broadcast ring spreads. */
export interface SubnetSceneData {
  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
  M: number[];
  /** Where the plate's origin is on screen. A tag is drawn there and moved from it; the trail is drawn in the figure's own frame. */
  O: [number, number];
  /** Each tag's way, as points (x, y, z) on the plate: laptop to printer, laptop to the Design PC, office router to the provider's. */
  routes: Record<'local' | 'remote' | 'link', [number, number, number][]>;
  /** Each broadcast ring's widest radius on the floor: the whole floor, or the Design pad. */
  rings: Record<'all' | 'design', number>;
}

const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
const PL = { x: -112, y: -80, w: 224, d: 160, r: 10 };
const PAD_H = 2.4;
const PADS = {
  sales: { x: -104, y: -44, w: 98, d: 54, r: 4 },
  design: { x: 6, y: -44, w: 98, d: 54, r: 4 },
  servers: { x: -104, y: 18, w: 98, d: 54, r: 4 },
  guests: { x: 6, y: 18, w: 98, d: 54, r: 4 },
};
// The whole floor the four pads stand on: one network until it is cut.
const FLOORZONE = { x: -108, y: -48, w: 216, d: 124, r: 7 };
const R = { x: -30, y: -76, w: 44, d: 18, r: 3 }, RZ = 2, RT = 12;
const PR = { x: 58, y: -76, w: 16, d: 18, r: 2 }, PR_H = 30;
const SW_H = 4, CABLE_R = 1, CABLE_Z = 1.3, RIDE = CABLE_Z + CABLE_R + 0.4, ON_PAD = PAD_H + 0.6;
// Where each switch sits: the middle of its pad's back edge.
const SW = { sales: [-55, -38], design: [55, -38], servers: [-55, 24], guests: [55, 24] };
// The devices that matter: the Sales laptop, the Sales printer and the Design PC.
const LT = { x: -96, y: -24, w: 24, d: 16, r: 2 }, LT_Z = 1.8, LT_LID = 15;
const PRN = { x: -36, y: -24, w: 22, d: 16, r: 1.6 }, PRN_H = 9;
const PC = [24, -16];

// One camera for the scene, the same as the DHCP lesson's. The frame is fitted afterwards to the plate and its
// callouts, which sit off the plate, on the page's own background, so they read in both themes.
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
const glow = (pad, u, z, w, h, rx, id) => rect("sn-glow", u, z, w, h, rx, ` data-pad="${pad}"${id ? ` id="${id}"` : ""}`);

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
  return { under, over: over.join("") };
}

// ---------- A pad: one team's patch of floor, with the lit line it gets once it is a subnet of its own ----------
function pad(name) {
  const p = PADS[name];
  return S(k.slabOf(p, 0, PAD_H, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(p, 1, P, 4), { tone: "faint" }) }) +
    `<path class="sn-line sn-padline" id="sn-padline-${name}" d="${k.planOutline(k.insetPlan(p, 2.4), PAD_H, P)}"/>`;
}

// ---------- The devices ----------
function switchBox(name) {
  const [cx, cy] = SW[name], B = { x: cx - 12, y: cy - 4, w: 24, d: 8, r: 1.2 }, F = B.y + B.d;
  const out = [S(k.slabOf(B, PAD_H, SW_H, P, 3, 0.5), { tone: "hi", inner: L(k.sideSeam(B, PAD_H + 1.2, P, 3), { tone: "faint" }) })];
  let face = "";
  for (let i = 0; i < 6; i++) face += rect("lm-slot", B.x + 3 + i * 3.2, PAD_H + 0.9, 2.2, 1.7, 0.3);
  out.push(onFaceY(F, face));
  out.push(`<g class="lm-leds">${[0, 1, 2].map((i) => dot(at([B.x + 4 + i * 6.4, F, PAD_H + SW_H - 0.9]), "lm-led" + (i < 2 ? " on" : ""), 0.7)).join("")}</g>`);
  out.push(L([0, 1, 2].map((i) => k.lineOnTop([B.x + 6, B.y + 2 + i * 2], [B.x + B.w - 6, B.y + 2 + i * 2], PAD_H + SW_H, P)).join(""), { tone: "lo" }));
  return out.join("");
}
function accessPoint(name) {
  const [cx, cy] = SW[name], Z = PAD_H, H = 3;
  const out = [S(k.cylinder(cx, cy, 7, Z, 1, P, 32), { tone: "lo" }), S(k.cylinder(cx, cy, 6, Z + 1, H, P, 32, 0.5), { tone: "hi" })];
  const arc = (r) => { const pts = []; for (let i = 0; i <= 14; i++) { const a = Math.PI * 0.25 + (Math.PI / 2) * (i / 14); pts.push([cx + r * Math.cos(a) - 0.8, cy + r * Math.sin(a) - 3.4]); } return k.onTop(pts, Z + 1 + H, P); };
  out.push(L([2, 3.6].map(arc).join(""), { tone: "mid" }), D([at([cx - 0.8, cy - 3.4, Z + 1 + H])], { size: 0.8, tone: "mid" }));
  out.push(`<g class="lm-leds">${dot(at([cx + 6 * Math.SQRT1_2, cy + 6 * Math.SQRT1_2, Z + 2.4]), "lm-led on", 0.8)}</g>`);
  return out.join("");
}
function laptop() {
  const out = [], Z = PAD_H;
  out.push(S(k.slabOf(LT, Z, LT_Z, P, 4, 0.6), { tone: "hi" }));
  let keys = "";
  const pitch = (LT.w - 6) / 7;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) keys += k.planOutline({ x: LT.x + 3 + c * pitch, y: LT.y + 4 + r * pitch, w: pitch - 0.7, d: pitch - 0.7, r: 0.4 }, Z + LT_Z, P, 3);
  out.push(L(keys, { tone: "lo" }));
  const LID = { x: LT.x + 0.5, y: LT.y, w: LT.w - 1, d: 1.6, r: 0.6 };
  out.push(S(k.slabOf(LID, Z + LT_Z, LT_LID, P, 3, 0.4), { tone: "hi" }));
  const x0 = LID.x + 1.8, w = LID.w - 3.6, z0 = Z + LT_Z + 1.8, h = LT_LID - 3.6;
  let scr = rect("lm-void", x0, z0, w, h, 0.6) + glow("sales", x0, z0, w, h, 0.6, "sn-glow-laptop");
  scr += `<text class="sn-scr" x="${n1(x0 + w / 2)}" y="${n1(-(z0 + h / 2 - 1.6))}" text-anchor="middle">.10</text>`;
  out.push(onFaceY(LID.y + LID.d, scr));
  return out.join("");
}
// A desk computer: a screen on a stand, and a keyboard in front.
function monitor([cx, cy], pad, id, label) {
  const out = [], Z = PAD_H;
  out.push(S(k.slabOf({ x: cx - 5, y: cy - 3.4, w: 10, d: 6, r: 1 }, Z, 1, P, 3, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: cx - 1.2, y: cy - 1.6, w: 2.4, d: 2, r: 0.4 }, Z + 1, 3.4, P, 2, 0.2), { tone: "mid" }));
  const SC = { x: cx - 9, y: cy - 2.8, w: 18, d: 1.6, r: 0.5 }, z0 = Z + 4.2, H = 11;
  out.push(S(k.slabOf(SC, z0, H, P, 3, 0.3), { tone: "hi" }));
  let scr = rect("lm-void", SC.x + 1.4, z0 + 1.4, SC.w - 2.8, H - 2.8, 0.5) + glow(pad, SC.x + 1.4, z0 + 1.4, SC.w - 2.8, H - 2.8, 0.5, id);
  if (label) scr += `<text class="sn-scr" x="${n1(cx)}" y="${n1(-(z0 + H / 2 - 1.6))}" text-anchor="middle">${label}</text>`;
  out.push(onFaceY(SC.y + SC.d, scr));
  out.push(S(k.slabOf({ x: cx - 7, y: cy + 4.4, w: 14, d: 4.6, r: 0.8 }, Z, 0.9, P, 3, 0.3), { tone: "hi" }));
  return out.join("");
}
function printer() {
  const out = [], Z = PAD_H, F = PRN.y + PRN.d;
  out.push(S(k.slabOf(PRN, Z, PRN_H, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(PRN, Z + 3.2, P, 3), { tone: "faint" }) }));
  out.push(`<g class="sn-busy" id="sn-busy-printer">${S(k.slabOf(PRN, Z, PRN_H, P, 3, 0.6), { tone: "hi", lit: true })}</g>`);
  out.push(L(k.planOutline({ x: PRN.x + 4, y: PRN.y + 3, w: PRN.w - 8, d: 4, r: 0.6 }, Z + PRN_H, P, 3), { tone: "lo" }));
  // The paper that comes out when something is printed, and the tray it lands in.
  out.push(onFaceY(F, rect("lm-slot", PRN.x + 4, Z + 4.4, PRN.w - 8, 1.4, 0.5) + rect("lm-inlay", PRN.x + PRN.w - 7, Z + 6.2, 4, 2, 0.4) + glow("sales", PRN.x + PRN.w - 7, Z + 6.2, 4, 2, 0.4)));
  out.push(S(k.slabOf({ x: PRN.x + 4, y: F, w: PRN.w - 8, d: 4, r: 0.4 }, Z + 2, 0.6, P, 2, 0.2), { tone: "mid" }));
  return out.join("");
}
function server(x, y, h, i) {
  const T = { x, y, w: 16, d: 16, r: 1.4 }, Z = PAD_H, F = T.y + T.d;
  const out = [S(k.slabOf(T, Z, h, P, 3, 0.5), { tone: "hi", inner: L(k.sideSeam(T, Z + 2.4, P, 3), { tone: "faint" }) })];
  let face = rect("lm-slot", T.x + 2.4, Z + h - 5.4, T.w - 4.8, 2.6, 0.5) + glow("servers", T.x + 2.4, Z + h - 5.4, T.w - 4.8, 2.6, 0.5);
  for (let b = 0; b < Math.floor((h - 9) / 4); b++) {
    const z = Z + h - 10 - b * 4;
    face += rect("lm-slot", T.x + 2.4, z, T.w - 7.4, 2, 0.4) + `<circle class="lm-led${(b + i) % 3 === 0 ? " on" : ""}" cx="${n1(T.x + T.w - 3.2)}" cy="${n1(-(z + 1))}" r="0.7"/>`;
  }
  out.push(onFaceY(F, face));
  let vents = "";
  for (let v = 0; v < 3; v++) vents += k.lineOnTop([T.x + 4, T.y + 4 + v * 4], [T.x + T.w - 4, T.y + 4 + v * 4], Z + h, P);
  out.push(L(vents, { tone: "lo" }));
  return out.join("");
}
// A phone or a tablet, standing in a little dock.
function handheld([cx, cy], wide) {
  const out = [], Z = PAD_H, w = wide ? 15 : 7.4, h = wide ? 11 : 13.4;
  out.push(S(k.slabOf({ x: cx - w / 2 - 1.6, y: cy - 3, w: w + 3.2, d: 6, r: 1.2 }, Z, 1.4, P, 3, 0.3), { tone: "mid" }));
  const B = { x: cx - w / 2, y: cy - 1.2, w, d: 1.4, r: 0.6 };
  out.push(S(k.slabOf(B, Z + 1.4, h, P, 3, 0.3), { tone: "hi" }));
  out.push(onFaceY(B.y + B.d, rect("lm-void", B.x + 0.9, Z + 2.8, w - 1.8, h - 2.8, 0.6) + glow("guests", B.x + 0.9, Z + 2.8, w - 1.8, h - 2.8, 0.6)));
  return out.join("");
}

// ---------- The routers ----------
function officeRouter() {
  const out = [], F = R.y + R.d;
  for (const [x, y] of byDepth(k.corners(R, 5))) out.push(S(k.cylinder(x, y, 2, 0, RZ, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(R, RZ + 3, P, 5), { tone: "faint" }) }));
  out.push(`<g class="sn-busy" id="sn-busy-router">${S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", lit: true })}</g>`);
  for (let i = 0; i < 6; i++) out.push(L(k.planOutline({ x: R.x + 6 + i * 5.4, y: R.y + 4, w: 2.2, d: R.d - 8, r: 1.1 }, RT, P, 3), { tone: "lo" }));
  // One port for each team's switch, and the lights above them.
  let face = "";
  for (const u of PORTS_U) face += rect("lm-slot", u - 1.8, RZ + 2, 3.6, 2.6, 0.4);
  out.push(onFaceY(F, face));
  out.push(`<g class="lm-leds">${PORTS_U.map((u, i) => dot(at([u, F, RZ + 7]), "lm-led", 0.9, ` id="sn-rled-${i}"`)).join("")}${dot(at([R.x + R.w - 5, F, RZ + 7]), "lm-led on", 0.9)}</g>`);
  return out.join("");
}
// The provider's end of the line: a standing box, its own link to the office router.
function providerRouter() {
  const out = [], F = PR.y + PR.d;
  out.push(S(k.slabOf({ x: PR.x - 3, y: PR.y - 2, w: PR.w + 6, d: PR.d + 4, r: 2 }, 0, 1.6, P, 3, 0.4), { tone: "lo" }));
  out.push(S(k.slabOf(PR, 1.6, PR_H - 1.6, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(PR, PR_H - 4, P, 3), { tone: "faint" }) }));
  out.push(`<g class="sn-busy" id="sn-busy-provider">${S(k.slabOf(PR, 1.6, PR_H - 1.6, P, 3, 0.6), { tone: "hi", lit: true })}</g>`);
  let face = "";
  for (let i = 0; i < 3; i++) face += rect("lm-slot", PR.x + 3 + i * 3.8, 6, 1.8, 14, 0.9);
  out.push(onFaceY(F, face));
  out.push(`<g class="lm-leds">${[0, 1, 2].map((i) => dot(at([PR.x + 4 + i * 4, F, PR_H - 5]), "lm-led" + (i === 0 ? " on" : ""), 0.9, i ? ` id="sn-pled-${i}"` : "")).join("")}</g>`);
  out.push(k.faceTextSvg(k.sideMatrix([PR.x + PR.w / 2, F], 2.6, P, "left"), "ISP", { size: 2.8, tone: "mid", anchor: "middle" }));
  return out.join("");
}

// ---------- Cables ----------
const PORTS_U = [-24, -3, 3, 10]; // sales, servers, guests, design: where each cable leaves the router's front
const RF = R.y + R.d + 0.5;
const CABLES = {
  sales: [[-24, RF], [-24, -51], [-55, -51], [-55, -44]],
  design: [[10, RF], [10, -51], [55, -51], [55, -44]],
  servers: [[-3, RF], [-3, 14], [-55, 14], [-55, 18]],
  guests: [[3, RF], [3, 14], [55, 14], [55, 18]],
};
const LINK = [[R.x + R.w + 0.5, -67], [PR.x - 3.5, -67]];
const cable = (pts) => tubeOf(tubePieces(pts.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));

// ---------- Routes: the way a tag rides, laptop to printer, laptop to the Design PC, router to the provider ----------
const SW_TOP = (n) => [SW[n][0], SW[n][1], PAD_H + SW_H + 1.4];
const ROUTER_TOP = [R.x + R.w / 2 + 2, R.y + R.d / 2, RT + 1.2];
const LT_OUT = [LT.x + LT.w / 2, LT.y + LT.d + 1, PAD_H + LT_Z + 0.4];
const toSwitch = (n, from) => [[from[0], SW[n][1] + 7, ON_PAD], [SW[n][0] - 5, SW[n][1] + 6, ON_PAD], SW_TOP(n)];
const fromSwitch = (n, to) => [[SW[n][0] + 5, SW[n][1] + 6, ON_PAD], [to[0], SW[n][1] + 7, ON_PAD]];
const onCable = (pts) => pts.map(([x, y]) => [x, y, RIDE]);
const ROUTES = {
  local: [LT_OUT, ...toSwitch("sales", LT_OUT), ...fromSwitch("sales", [PRN.x + PRN.w / 2]), [PRN.x + PRN.w / 2, PRN.y + 4, PAD_H + PRN_H + 0.6]],
  remote: [LT_OUT, ...toSwitch("sales", LT_OUT), [SW.sales[0], -45.5, RIDE], ...onCable([...CABLES.sales].reverse().slice(1, -1)), [-24, RF + 1, RIDE], ROUTER_TOP,
    [10, RF + 1, RIDE], ...onCable(CABLES.design.slice(1, -1)), [SW.design[0], -45.5, RIDE], SW_TOP("design"), ...fromSwitch("design", PC).slice(0, 1), [PC[0] + 4, SW.design[1] + 7, ON_PAD], [PC[0], PC[1] + 9, PAD_H + 1.4]],
  link: [ROUTER_TOP, [R.x + R.w + 1, -67, RIDE], [PR.x - 4, -67, RIDE], [PR.x + PR.w / 2, PR.y + PR.d / 2, PR_H + 1.2]],
};
const TAGS = { local: "TO .20", remote: "TO .70", link: "TO .5" };
const RINGS = { all: { at: [LT.x + LT.w / 2, LT.y + LT.d / 2], max: 250, clip: FLOORZONE }, design: { at: PC, max: 120, clip: k.insetPlan(PADS.design, 1.2) } };

// ---------- Callouts: few, short, outside the plate ----------
// Each callout's text boxes, measured roughly from its font, so the frame can be fitted around them.
const TEXT_W = { "sn-name": 11.5 * 0.74, "sn-sub": 13 * 0.5, "sn-addr": 12.5 * 0.6, "sn-net": 12.5 * 0.62 };
function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } = {}) {
  const [ax, ay] = at(anchor);
  for (const [i, l] of lines.entries()) { const w = (l.w || l.text.length) * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
  const ex = tx + (align === "end" ? 7 : -7);
  const lead = `<path class="sn-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "sn-lead-dot", 2)}`;
  const text = lines.map((l, i) => `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
  return `<g class="sn-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
}
// Each team's network, which the driver rewrites once the floor is cut into four.
const net = (name) => ({ cls: "sn-net", text: "192.168.1.0/24", id: "sn-net-" + name, w: 16 });

// ---------- Moving parts, drawn at the origin and moved by the driver ----------
const tag = (label) => {
  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="sn-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
};

// ---------- The scene ----------
function sceneSvg() {
  const pl = plate("OFFICE · 192.168.1.0/24");
  const things = [
    { xy: [R.x + R.w / 2, R.y + R.d / 2], svg: officeRouter() },
    { xy: [PR.x + PR.w / 2, PR.y + PR.d / 2], svg: providerRouter() },
    { xy: SW.sales, svg: switchBox("sales") }, { xy: SW.design, svg: switchBox("design") }, { xy: SW.servers, svg: switchBox("servers") }, { xy: SW.guests, svg: accessPoint("guests") },
    { xy: [LT.x + LT.w / 2, LT.y + LT.d / 2], svg: laptop() },
    { xy: [-58, -16], svg: monitor([-58, -16], "sales") },
    { xy: [PRN.x + PRN.w / 2, PRN.y + PRN.d / 2], svg: printer() },
    { xy: PC, svg: monitor(PC, "design", "sn-glow-pc", ".70") },
    { xy: [54, -16], svg: monitor([54, -16], "design") }, { xy: [84, -16], svg: monitor([84, -16], "design") },
    ...[[-96, 44, 21], [-76, 44, 17], [-56, 44, 21]].map(([x, y, h], i) => ({ xy: [x + 8, y + 8], svg: server(x, y, h, i) })),
    { xy: [30, 48], svg: handheld([30, 48]) }, { xy: [52, 50], svg: handheld([52, 50]) }, { xy: [78, 48], svg: handheld([78, 48], true) },
  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  // The floor: the one lit line round the whole office, the four pads, the cables, then the broadcast rings on top of them.
  const oneNet = `<path class="sn-line" id="sn-onenet" d="${k.planOutline(FLOORZONE, 0, P)}"/>`;
  const pads = Object.keys(PADS).map(pad).join("");
  const cables = cable(CABLES.sales) + cable(CABLES.design) + cable(CABLES.servers) + cable(CABLES.guests) + cable(LINK);
  const link = `<path class="sn-link" id="sn-link" d="${k.pathOf(LINK.map(([x, y]) => at([x, y, CABLE_Z + CABLE_R])))}"/>`;
  const clips = Object.entries(RINGS).map(([n, r]) => `<clipPath id="sn-clip-${n}"><path d="${k.planOutline(r.clip, PAD_H, P)}"/></clipPath>`).join("");
  const rings = Object.entries(RINGS).map(([n, r]) => `<g clip-path="url(#sn-clip-${n})"><g id="sn-ring-${n}" style="opacity:0">${onTopAt(PAD_H, `<circle class="sn-ring" id="sn-ring-${n}-a" cx="${r.at[0]}" cy="${r.at[1]}" r="1"/><circle class="sn-ring soft" id="sn-ring-${n}-b" cx="${r.at[0]}" cy="${r.at[1]}" r="1"/>`)}</g></g>`).join("");
  const tags = Object.entries(TAGS).map(([route, label]) => `<g class="sn-tag" id="sn-tag-${route}" style="opacity:0">${tag(label)}</g>`).join("");
  const trail = `<polyline class="sn-trail" id="sn-trail" points="" style="opacity:0"/>`;
  const boxes = [];
  const labels = [
    callout(boxes, [LT.x, LT.y, PAD_H + LT_Z + LT_LID], [118, -2], [{ cls: "sn-name", text: "Sales" }, { cls: "sn-addr", text: "Laptop 192.168.1.10" }, { cls: "sn-addr", text: "Printer 192.168.1.20" }, net("sales")], { align: "end", id: "sn-call-sales" }),
    callout(boxes, [R.x + 4, R.y + 2, RT], [236, -14], [{ cls: "sn-name", text: "Office router" }, { cls: "sn-sub", text: "the way out of each network" }, { cls: "sn-addr", text: "203.0.113.6 on the link" }], { id: "sn-call-router" }),
    callout(boxes, [PR.x + PR.w, PR.y, PR_H], [432, 36], [{ cls: "sn-name", text: "Provider’s router" }, { cls: "sn-addr", text: "203.0.113.5 on the link" }], { id: "sn-call-provider" }),
    callout(boxes, [PC[0] + 9, PC[1] - 2.8, PAD_H + 15.2], [456, 136], [{ cls: "sn-name", text: "Design" }, { cls: "sn-addr", text: "PC 192.168.1.70" }, net("design")], { id: "sn-call-design" }),
    callout(boxes, [-90, 72, PAD_H], [128, 262], [{ cls: "sn-name", text: "Servers" }, { cls: "sn-addr", text: "Server 192.168.1.130" }, net("servers")], { align: "end", id: "sn-call-servers" }),
    callout(boxes, [96, 72, PAD_H], [306, 272], [{ cls: "sn-name", text: "Guest Wi-Fi" }, { cls: "sn-addr", text: "Phone 192.168.1.200" }, net("guests")], { id: "sn-call-guests" }),
  ].join("");
  // The frame: the plate, the tallest parts and every callout, with a margin.
  const pts = [...k.boxCorners(PL, FLOOR, 0), [PR.x, PR.y, PR_H]].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 16;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  const body = `<defs>${clips}</defs>` + pl.under + `<g class="lm-body">${pl.over}${oneNet}${pads}${cables}${link}${rings}${things.map((t) => t.svg).join("")}${trail}${tags}</g>` + labels;
  return `<svg data-figure="subnet" class="lm-svg sn" viewBox="${vb.join(" ")}" role="img" aria-label="An office floor on one plate: four teams, Sales, Design, Servers and the guest Wi-Fi, each on its own pad with a switch. The office router at the back has a cable to every switch, and a link to the provider’s router beside it.">${body}</svg>`;
}

// What the driver needs: the camera as six numbers, the origin, the routes and the rings.
function sceneData(): SubnetSceneData {
  const o = at([0, 0, 0]), ex = at([1000, 0, 0]), ey = at([0, 1000, 0]), ez = at([0, 0, 1000]);
  const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
  const r2 = (p) => p.map((v) => +v.toFixed(2));
  return { M, O: o.map((v) => +v.toFixed(2)), routes: Object.fromEntries(Object.entries(ROUTES).map(([n, pts]) => [n, pts.map(r2)])), rings: Object.fromEntries(Object.entries(RINGS).map(([n, r]) => [n, r.max])) };
}

/** The Subnetting scene, drawn at build time: its SVG and the data its driver reads. */
export function drawSubnet(): DrawnFigure {
  return { svg: sceneSvg(), data: sceneData() };
}
