// @ts-nocheck -- ported drawing code; the checksum tests in figures.test.ts pin its output, so it is not re-typed line by line.
// Small figures for the home and track pages: the three parts of a lesson, and the three ready lessons.
// Same camera, scale and plate as the track covers, so they read as one family. Each is still: one coloured part, no motion.
import { k, G, P, W, H, at, S, L, D, n1, byDepth, poly, tubeOf, onFaceY, onFaceX, onTopAt, tubePieces, base } from "../common.ts";

const rect = (cls, u, z, w, h, rx = 0.6) => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"/>`;
const dot = ([x, y], cls, r = 1.2) => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`;
const lines = (list, z, tone = "lo", className) => L(list.map(([a, b]) => k.lineOnTop(a, b, z, P)).join(""), { tone, className });

// A thumbnail: the plate and what stands on it, cropped close so it reads at card size.
const CROP = "36 44 528 372";
const figure = (id, label, body, aria) => {
  const plate = base(label);
  return k.figureSvg({ width: W, height: H, label: aria, body: `${plate.under}<g class="lm-body">${plate.over}${body}</g>`, className: `lm-svg lm-${id}` }).replace(`viewBox="0 0 ${W} ${H}"`, `viewBox="${CROP}"`);
};

// A laptop seen from the front-left: base, keys, lid. Returns the drawing and where its screen is.
function laptop(LB, lidH, { keysX = 8, keysY = 3 } = {}) {
  const out = [], LZ = 3.4;
  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
  const pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 6 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  out.push(L(k.planOutline({ x: LB.x + LB.w / 2 - 8, y: LB.y + 8 + keysY * pitch, w: 16, d: LB.d - 12 - keysY * pitch, r: 1.2 }, LZ, P, 3), { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.4, r: 1 };
  out.push(S(k.slabOf(LID, LZ, lidH, P, 3, 0.5), { tone: "hi" }));
  return { svg: out.join(""), face: LID.y + LID.d, x0: LID.x + 3, w: LID.w - 6, z0: LZ + 3, h: lidH - 6 };
}

// A home router: feet, body, two antennas at the back, lights on the front.
function router(R, { lit = [0] } = {}) {
  const out = [], RZ = 2, RT = RZ + 9, RF = R.y + R.d;
  for (const [x, y] of byDepth(k.corners(R, 5))) out.push(S(k.cylinder(x, y, 2, 0, RZ, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(R, RZ + 3, P, 5), { tone: "faint" }) }));
  for (let i = 0; i < 4; i++) out.push(L(k.planOutline({ x: R.x + 8 + i * 6, y: R.y + 6, w: 2.4, d: R.d - 12, r: 1.2 }, RT, P, 3), { tone: "lo" }));
  for (const [x, y] of byDepth([[R.x + 6, R.y + 5], [R.x + R.w - 6, R.y + 5]])) {
    out.push(S(k.cylinder(x, y, 2, RT, 2.4, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 1.4, RT + 2.4, 24, P, 16), { tone: "hi", crease: "none" }));
  }
  out.push(`<g class="lm-leds">${[0, 1, 2, 3].map((i) => dot(at([R.x + 7 + i * 5, RF, RZ + 5]), "lm-led" + (lit.includes(i) ? " on" : ""), 1.1)).join("")}</g>`);
  return out.join("");
}

// ---------- Watch: two devices pass a message, and a pad steps through it ----------
function watch() {
  const out = [];
  const lap = laptop({ x: -98, y: -44, w: 50, d: 34, r: 4 }, 30);
  out.push(lap.svg, onFaceY(lap.face, rect("lm-void", lap.x0, lap.z0, lap.w, lap.h, 0.8) + rect("lm-slot", lap.x0 + 4, lap.z0 + lap.h - 6, 22, 1.6, 0.8) + rect("lm-slot", lap.x0 + 4, lap.z0 + lap.h - 10, 30, 1.6, 0.8)));
  out.push(tubeOf(tubePieces([[-48, -26, 1.4], [44, -26, 1.4]], 1.2, P, { maxLength: 16 })));
  out.push(router({ x: 44, y: -44, w: 48, d: 30, r: 5 }, { lit: [0, 1] }));
  // The message, caught mid-cable: the coloured part.
  out.push(S(k.slabOf({ x: -8, y: -31, w: 12, d: 10, r: 1.2 }, 2.6, 5, P, 3, 0.5), { tone: "hi", lit: true }));
  out.push(lines([[[-6.2, -29.2], [-2, -25.4]], [[-2, -25.4], [2.2, -29.2]]], 7.6, "lo", "lm-sym-lit"));
  // The step pad: back, play, forward, and four step lights, two of them done.
  const PD = { x: -42, y: 16, w: 84, d: 32, r: 5 }, PZ = 6;
  out.push(S(k.slabOf(PD, 0, PZ, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(PD, 2, P, 5), { tone: "faint" }) }));
  for (const x of [-24, 0, 24]) out.push(S(k.cylinder(x, 30, 6, PZ, 1.8, P, 28, 0.4), { tone: "mid" }));
  const T = PZ + 1.8;
  out.push(L(k.onTop([[-21.5, 27.5], [-21.5, 32.5], [-26.5, 30]], T, P, true) + k.onTop([[2.5, 30], [-2, 27], [-2, 33]], T, P, true) + k.onTop([[21.5, 27.5], [21.5, 32.5], [26.5, 30]], T, P, true), { tone: "hi" }));
  out.push(`<g class="lm-leds">${[-12, -4, 4, 12].map((x, i) => dot(at([x, PD.y + PD.d, 3]), "lm-led" + (i < 2 ? " on" : ""), 1.1)).join("")}</g>`);
  return figure("watch", "WATCH · STEP 2 OF 4", out.join(""), "A laptop and a router joined by a cable, with a message caught halfway along it. In front, a pad with back, play and forward buttons, and four step lights, two of them lit.");
}

// ---------- Learn: an open book, a note that names the idea, a pencil ----------
function learn() {
  const out = [];
  out.push(S(k.slabOf({ x: -68, y: -46, w: 136, d: 84, r: 3 }, 0, 2.2, P, 4, 0.5), { tone: "mid" }));
  const page = (x) => S(k.slabOf({ x, y: -43, w: 62, d: 78, r: 1.5 }, 2.2, 5, P, 3, 0.4), { tone: "hi", inner: L([3.6, 5].map((z) => k.sideSeam({ x, y: -43, w: 62, d: 78, r: 1.5 }, z, P, 3)).join(""), { tone: "faint" }) });
  out.push(page(-64), page(2));
  const PT = 7.2;
  // Left page: a heading and lines of plain words.
  out.push(lines([[[-56, -34], [-26, -34]]], PT, "mid"));
  out.push(lines([-26, -20, -14, -8, -2, 4, 10, 16, 22].map((y, i) => [[-56, y], [-10 - (i % 3) * 7, y]]), PT));
  // Right page: a little diagram, two boxes and an arrow, then more lines.
  out.push(L(k.planOutline({ x: 10, y: -36, w: 14, d: 10, r: 1 }, PT, P, 3) + k.planOutline({ x: 40, y: -36, w: 14, d: 10, r: 1 }, PT, P, 3) + k.lineOnTop([26, -31], [38, -31], PT, P) + k.onTop([[35, -33], [38, -31], [35, -29]], PT, P), { tone: "lo" }));
  out.push(lines([22, 28].map((y, i) => [[10, y], [52 - i * 10, y]]), PT));
  // The note: the coloured part. The idea comes first, then its name.
  const N = { x: 14, y: -18, w: 32, d: 24, r: 1 };
  out.push(S(k.slabOf(N, PT, 1.2, P, 3, 0.3), { tone: "hi", lit: true }));
  out.push(lines([[[18, -12], [36, -12]], [[18, -6], [40, -6]], [[18, 0], [30, 0]]], PT + 1.2, "lo", "lm-sym-lit"));
  // A ribbon hanging off the front, and a pencil.
  out.push(S(k.slabOf({ x: -38, y: 34, w: 5, d: 14, r: 0.4 }, 0, 0.6, P, 2), { tone: "mid", crease: "none" }));
  const F = G.frameAlong([18, 52, 2.6], [1, 0, 0]);
  out.push(S(G.disc(0, 42, 2.6, F, P), { tone: "hi" }), S(G.disc(42, 48, 2.6, F, P), { tone: "mid" }), L(G.circleOf(F, 42, 2.6, P, 24), { tone: "lo" }));
  return figure("learn", "LEARN · PLAIN WORDS", out.join(""), "An open book with lines of text and a small diagram. A coloured note lies on the right page, and a pencil rests in front.");
}

// ---------- Practice: a question board, with the chosen answer lit ----------
function practice() {
  const out = [];
  for (const x of [-56, 42]) out.push(S(k.slabOf({ x, y: -50, w: 14, d: 34, r: 2 }, 0, 2.4, P, 3, 0.4), { tone: "mid" }));
  const B = { x: -64, y: -38, w: 128, d: 8, r: 2 }, BF = B.y + B.d;
  out.push(S(k.slabOf(B, 2.4, 66, P, 3, 0.6), { tone: "hi" }));
  let face = rect("lm-inlay", -56, 54, 112, 11, 1.4) + rect("lm-slot", -51, 60, 70, 1.6, 0.8) + rect("lm-slot", -51, 56.6, 46, 1.6, 0.8);
  for (const z of [40, 12]) face += rect("lm-face", -54, z, 108, 9, 1.4) + `<circle class="lm-sym" cx="-48" cy="${-(z + 4.5)}" r="2"/>` + rect("lm-slot", -42, z + 3.7, 40 + (z === 12 ? 12 : 0), 1.6, 0.8);
  out.push(onFaceY(BF, face));
  // The answer you picked: raised and lit, with a tick.
  const A = { x: -54, y: BF, w: 108, d: 2.4, r: 1 };
  out.push(S(k.slabOf(A, 26, 9, P, 3, 0.4), { tone: "hi", lit: true }));
  out.push(onFaceY(BF + 2.4, `<path class="lm-tick-ok" d="M-50.5 -30.4L-48.4 -28.4L-44.6 -32.6"/>` + rect("lm-slot lm-on-lit", -40, 29.7, 46, 1.6, 0.8)));
  return figure("practice", "PRACTICE · 3 QUESTIONS", out.join(""), "A standing board with a question at the top and three answers. The middle answer is raised and lit, with a tick beside it.");
}

// ---------- Lesson 08, Subnetting: one network cut into four smaller ones ----------
function subnet() {
  const out = [];
  const pads = [[-80, -52], [6, -52], [-80, 6], [6, 6]].map(([x, y]) => ({ x, y, w: 74, d: 46, r: 4 }));
  // Cables from the router in the middle to each smaller network.
  const hub = [-3, 1.2];
  out.push(tubeOf([[-18, -12], [18, -12], [-18, 14], [18, 14]].flatMap(([x, y]) => tubePieces([[hub[0], hub[1], 1.3], [x, y, 1.3]], 1, P, { maxLength: 14 }))));
  for (const p of byDepth(pads.map((p) => [p.x + p.w / 2, p.y + p.d / 2, p])).map((e) => e[2])) {
    out.push(S(k.slabOf(p, 0, 2.6, P, 4, 0.5), { tone: "mid" }), L(k.planOutline(k.insetPlan(p, 3), 2.6, P, 3), { tone: "lo" }));
  }
  const spots = (p) => [[p.x + 12, p.y + 10], [p.x + 36, p.y + 10], [p.x + 58, p.y + 10], [p.x + 24, p.y + 28], [p.x + 48, p.y + 28]];
  const devices = pads.flatMap((p, pi) => spots(p).map(([x, y], i) => [x, y, pi === 0 && i === 3]));
  for (const [x, y, lit] of byDepth(devices)) {
    out.push(S(k.slabOf({ x: x - 4.5, y: y - 4.5, w: 9, d: 9, r: 1.2 }, 2.6, 8, P, 3, 0.4), { tone: "hi", lit }));
    if (!lit) out.push(dot(at([x + 2.4, y + 4.5, 6.6]), "lm-led on", 0.8));
  }
  out.push(S(k.cylinder(hub[0], hub[1], 7.4, 0, 2, P, 32), { tone: "lo" }), S(k.cylinder(hub[0], hub[1], 6, 2, 6, P, 32, 0.5), { tone: "hi" }), L(k.ring(hub[0], hub[1], 3.6, 8, P, 24), { tone: "lo" }));
  return figure("subnet", "192.168.1.0/24 → 4 × /26", out.join(""), "Four small networks, each on its own pad with five devices, joined by cables to one router in the middle. One device on the back left pad is lit.");
}

// ---------- Lesson 10, DHCP: the router hands the laptop its address ----------
function dhcp() {
  const out = [];
  out.push(router({ x: 22, y: -56, w: 58, d: 32, r: 5 }, { lit: [0, 1, 2] }));
  // The address on its way, along a dotted arc from the router to the laptop.
  const arc = []; for (let i = 0; i <= 24; i++) { const s = i / 24; arc.push([40 - 98 * s, -30 + 52 * s, 16 + 20 * Math.sin(Math.PI * s)]); }
  out.push(L(k.pathOf(arc.map(at)), { tone: "hi", dotted: true }));
  const lap = laptop({ x: -88, y: 4, w: 54, d: 36, r: 4 }, 32);
  out.push(lap.svg, onFaceY(lap.face, rect("lm-void", lap.x0, lap.z0, lap.w, lap.h, 0.8) + `<text class="lm-addr" x="${n1(lap.x0 + 4)}" y="${n1(-(lap.z0 + lap.h - 6))}">IP ?</text>`));
  const TG = { x: -27, y: -10.5, w: 36, d: 13, r: 2 }, TZ = 33;
  out.push(`<path class="lm-shadow" d="${k.planOutline({ x: TG.x + 4, y: TG.y + 2, w: TG.w - 4, d: TG.d - 2, r: 3 }, 0, P, 4)}"/>`);
  out.push(S(k.slabOf(TG, TZ, 2.4, P, 3, 0.5), { tone: "hi", lit: true }));
  out.push(onTopAt(TZ + 2.4, `<text class="lm-tagt" x="${TG.x + 3}" y="${TG.y + 8.4}">192.168.1.100</text>`));
  return figure("dhcp", "DHCP · 192.168.1.100", out.join(""), "A Wi-Fi router at the back and a laptop at the front. Between them, a lit tag with the address 192.168.1.100 floats along a dotted arc toward the laptop.");
}

// ---------- Lesson 17, Firewalls: a wall with a gate, a list of rules, one packet let through ----------
function firewall() {
  const out = [];
  const brick = (Wl) => {
    const seams = []; for (let z = 8; z < 40; z += 8) seams.push(k.sideSeam(Wl, z, P, 3));
    let face = ""; for (let r = 0; r < 5; r++) for (let u = Wl.x + (r % 2 ? 6 : 12); u < Wl.x + Wl.w - 2; u += 12) face += `<path class="lm-mull" d="M${n1(u)} ${-(r * 8)}V${-(r * 8 + 8)}"/>`;
    return S(k.slabOf(Wl, 0, 40, P, 3, 0.5), { tone: "hi", inner: L(seams.join(""), { tone: "faint" }) }) + onFaceY(Wl.y + Wl.d, face);
  };
  const W1 = { x: -98, y: -20, w: 76, d: 12, r: 1 }, W2 = { x: 22, y: -20, w: 76, d: 12, r: 1 };
  out.push(brick(W1));
  // The packet the rules let in, passing through the gate: the coloured part.
  out.push(S(k.slabOf({ x: -5, y: -18, w: 10, d: 10, r: 1.2 }, 0, 9, P, 3, 0.5), { tone: "hi", lit: true }), onTopAt(9, `<text class="lm-pkt-t lm-on-lit" x="-4" y="-11.4">443</text>`));
  out.push(brick(W2));
  out.push(S(k.slabOf({ x: -24, y: -21, w: 48, d: 14, r: 1 }, 40, 6, P, 3, 0.5), { tone: "mid" }));
  // The rules, on the wall: read from the top down, first match wins.
  const R = W2.y + W2.d;
  let rules = rect("lm-inlay", 30, 8, 60, 26, 1.6);
  [["1", "ALLOW 443", "ok"], ["2", "DENY 23", "no"], ["3", "DENY ALL", "no"]].forEach(([n, t, c], i) => {
    const z = 27 - i * 7.4;
    rules += `<circle class="lm-rule-${c}" cx="36" cy="${-(z + 1.2)}" r="1.5"/><text class="lm-rule" x="40" y="${-z}">${n}  ${t}</text>`;
  });
  out.push(onFaceY(R, rules));
  // A packet the rules turned away, stopped in front of the wall.
  out.push(S(k.slabOf({ x: -58, y: 24, w: 10, d: 10, r: 1.2 }, 0, 9, P, 3, 0.5), { tone: "hi" }), onTopAt(9, `<text class="lm-pkt-t" x="-55.4" y="30.6">23</text>`));
  out.push(`<g class="lm-stop">${dot(at([-53, 29, 16]), "lm-rule-no", 2.2)}<path class="lm-x" d="M${n1(at([-53, 29, 16])[0] - 1.1)} ${n1(at([-53, 29, 16])[1] - 1.1)}l2.2 2.2m0 -2.2l-2.2 2.2"/></g>`);
  return figure("wall", "RULES · TOP DOWN", out.join(""), "A brick wall with a gate in the middle and a list of three rules on its right half. A lit packet marked 443 passes through the gate; a packet marked 23 waits outside with a red stop mark.");
}

// ---------- Lesson 01, OSI Model: seven blocks in a stack, layer 4 lit ----------
function osi() {
  const out = [], BP = { x: -32, y: -22, w: 64, d: 44, r: 4 }, LH = 8, STEP = 10;
  out.push(S(k.slabOf(k.insetPlan(BP, -3), 0, 2, P, 6, 0.5), { tone: "lo" }));
  for (let n = 1; n <= 7; n++) {
    const z = 2 + (n - 1) * STEP, lit = n === 4;
    const slab = lit ? S(k.slabOf(BP, z, LH, P, 6, 0.9), { tone: "hi", lit: true }) : S(k.slabOf(BP, z, LH, P, 6, 0.9), { tone: "mid", inner: L(k.sideSeam(BP, z + LH - 1.6, P, 6), { tone: "faint" }) });
    const num = onFaceY(BP.y + BP.d, `<text class="lm-pkt-t${lit ? " lm-on-lit" : ""}" x="${BP.x + 6}" y="${n1(-(z + 2.6))}">${n}</text>`);
    out.push(`<g class="lm-osi-block" data-layer="${n}">${slab}${num}</g>`);
  }
  return figure("osi", "OSI · SEVEN LAYERS", out.join(""), "A stack of seven solid blocks, one for each layer, numbered 1 at the bottom to 7 at the top. Block 4 is lit.");
}

// ---------- Lesson 08, Router: a packet takes one of two ways out, and the table says which ----------
function routerSpot() {
  const out = [], C = [14, -22], R = 25, RH = 12, CZ = 1.6;
  // Three cables where they meet: one in from the left edge, two out, to the back edge and the right edge.
  out.push(tubeOf([[[-112, C[1]], [C[0] - R - 2, C[1]]], [[C[0], C[1] - R - 2], [C[0], -74]], [[C[0] + R + 2, C[1]], [112, C[1]]]].flatMap(([a, b]) => tubePieces([[...a, CZ], [...b, CZ]], 1.9, P, { maxLength: 16 }))));
  // The router: a round body, a ring and four arrows pointing out on its top, three lights on its front, the middle one on.
  out.push(S(k.cylinder(C[0], C[1], R + 2.4, 0, 2, P, 48), { tone: "lo" }), S(k.cylinder(C[0], C[1], R, 2, RH, P, 48, 0.8), { tone: "hi" }));
  const arrows = [];
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const tip = [C[0] + dx * 16, C[1] + dy * 16], base = [C[0] + dx * 4, C[1] + dy * 4], px = -dy, py = dx, hd = 4.6;
    arrows.push(k.lineOnTop(base, tip, RH + 2, P), k.lineOnTop(tip, [tip[0] - dx * hd + px * hd, tip[1] - dy * hd + py * hd], RH + 2, P), k.lineOnTop(tip, [tip[0] - dx * hd - px * hd, tip[1] - dy * hd - py * hd], RH + 2, P));
  }
  out.push(L(k.ring(C[0], C[1], 21.5, RH + 2, P, 48) + arrows.join(""), { tone: "mid" }));
  out.push(`<g class="lm-leds">${[25, 45, 65].map((deg) => { const t = (deg * Math.PI) / 180; return dot(at([C[0] + R * Math.cos(t), C[1] + R * Math.sin(t), 6]), "lm-led" + (deg === 45 ? " on" : ""), 1.2); }).join("")}</g>`);
  // The packet on the way out to the right: the lit part.
  out.push(S(k.slabOf({ x: 64, y: -30, w: 22, d: 16, r: 1.6 }, 3.4, 7, P, 3, 0.6), { tone: "hi", lit: true }));
  // The routing table, standing in front on two feet: three routes, the chosen one's light on.
  const B = { x: -96, y: 26, w: 92, d: 7, r: 1 }, BH = 40, FT = 2.4;
  for (const x of [B.x + 3, B.x + B.w - 15]) out.push(S(k.slabOf({ x, y: B.y - 7, w: 12, d: 21, r: 1.6 }, 0, FT, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf(B, FT, BH, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, FT + BH - 3, P, 3), { tone: "faint" }) }));
  let face = rect("lm-inlay", B.x + 4, 7, B.w - 8, 32, 1.6) + rect("lm-slot", B.x + 9, 37.6, 34, 1.6, 0.8);
  ["198.51.100.0/24", "203.0.113.0/24", "0.0.0.0/0"].forEach((name, i) => {
    const z = 31.3 - i * 8.4;
    face += `<circle class="lm-led${i === 1 ? " on" : ""}" cx="${n1(B.x + 11)}" cy="${n1(-z)}" r="1.7"/><text class="lm-rule" x="${n1(B.x + 16)}" y="${n1(-(z - 1.3))}">${name}</text>` + rect("lm-slot", B.x + 64, z - 1.5, 20, 1.8, 0.9);
  });
  out.push(onFaceY(B.y + B.d, face));
  return figure("router", "ROUTING TABLE · NEXT HOP", out.join(""), "A round router where three cables meet, one coming in and two going out. A lit packet travels down one of the ways out. In front stands its routing table, three routes long, with the route it chose marked.");
}

// ---------- Lesson 06, ARP: the laptop asks everyone, and only the router answers ----------
function arpSpot() {
  const out = [], C = [-50, 4];
  // The question, spreading over the plate from the laptop: three dotted waves, towards the devices at the back.
  for (const r of [36, 62, 88]) {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const a = ((-80 + (110 * i) / 32) * Math.PI) / 180, x = C[0] + r * Math.cos(a), y = C[1] + r * Math.sin(a);
      if (Math.abs(x) < 104 && Math.abs(y) < 66) pts.push(at([x, y, 0.4]));
    }
    out.push(L(k.pathOf(pts), { tone: "hi", dotted: true }));
  }
  // Three devices hear it: a phone on its dock and a printer, which stay dark, and the router, which answers.
  const things = [];
  const DK = { x: 74, y: -28, w: 28, d: 16, r: 3 }, PH = { x: 78, y: -25, w: 20, d: 3.4, r: 1.4 };
  let ph = S(k.slabOf(DK, 0, 3, P, 4, 0.5), { tone: "mid", inner: L(k.sideSeam(DK, 1.2, P, 4), { tone: "faint" }) }) + S(k.slabOf(PH, 3, 38, P, 3, 0.5), { tone: "hi" });
  ph += onFaceY(PH.y + PH.d, rect("lm-void", PH.x + 1.6, 6.4, PH.w - 3.2, 31, 1.2) + rect("lm-slot", PH.x + PH.w / 2 - 3, 38.6, 6, 1.2, 0.6));
  things.push([DK.x + DK.w / 2, DK.y + DK.d / 2, ph]);
  const PR = { x: 44, y: 20, w: 52, d: 38, r: 3 }, PZ = 18;
  let pr = S(k.slabOf(PR, 0, PZ, P, 4, 0.6), { tone: "hi", inner: L(k.sideSeam(PR, 5, P, 4), { tone: "faint" }) });
  pr += S(k.slabOf({ x: PR.x + 8, y: PR.y + 5, w: PR.w - 16, d: 16, r: 0.8 }, PZ, 1.6, P, 3, 0.3), { tone: "mid" }) + lines([[[PR.x + 12, PR.y + 28], [PR.x + PR.w - 12, PR.y + 28]]], PZ);
  pr += onFaceY(PR.y + PR.d, rect("lm-slot", PR.x + 8, 9, PR.w - 16, 2.2, 1.1) + `<circle class="lm-led" cx="${n1(PR.x + PR.w - 7)}" cy="-4" r="1.2"/>`);
  things.push([PR.x + PR.w / 2, PR.y + PR.d / 2, pr]);
  things.push([16, -55, router({ x: -14, y: -70, w: 60, d: 30, r: 5 }, { lit: [0, 1] })]);
  for (const [, , svg] of byDepth(things)) out.push(svg);
  // The answer, lifted off the router on its way back to the laptop: the lit part.
  const TG = { x: -6, y: -42, w: 34, d: 13, r: 2 }, TZ = 40;
  out.push(`<path class="lm-shadow" d="${k.planOutline({ x: TG.x + 3, y: TG.y + 2, w: TG.w - 4, d: TG.d - 2, r: 3 }, 0, P, 4)}"/>`);
  out.push(S(k.slabOf(TG, TZ, 2.4, P, 3, 0.5), { tone: "hi", lit: true }));
  out.push(onTopAt(TZ + 2.4, `<text class="lm-tagt" x="${TG.x + 4}" y="${TG.y + 8.2}">IS AT</text>`));
  // The laptop that asked, in front: its screen still waiting.
  const lap = laptop({ x: -106, y: 2, w: 58, d: 38, r: 4 }, 34);
  out.push(lap.svg, onFaceY(lap.face, rect("lm-void", lap.x0, lap.z0, lap.w, lap.h, 0.8) + `<text class="lm-addr" x="${n1(lap.x0 + 4)}" y="${n1(-(lap.z0 + lap.h - 6))}">WHO HAS?</text>`));
  return figure("arp", "WHO HAS 192.168.1.1?", out.join(""), "A laptop at the front sends dotted waves across the plate to three devices: a phone, a printer and a router. Only the router answers: a lit card rises from it, marked IS AT.");
}

// ---------- Lesson 10, Ports: one server, a door for each program, a packet at one of them ----------
function portsSpot() {
  const out = [];
  // The cable in from the left edge, along the floor to the server's foot.
  out.push(tubeOf(tubePieces([[-112, 24, 1.6], [-28, 24, 1.6], [-28, -4, 1.6]], 1.9, P, { maxLength: 16 })));
  // The server: one tall box, its front a column of numbered doors, a light beside each. A program listens behind
  // every lit one; 3389’s is dark.
  const B = { x: -40, y: -52, w: 84, d: 42, r: 2.4 }, BH = 78, F = B.y + B.d;
  out.push(S(k.slabOf({ x: B.x - 3, y: B.y - 3, w: B.w + 6, d: B.d + 6, r: 3 }, 0, 2, P, 3, 0.4), { tone: "lo" }));
  out.push(S(k.slabOf(B, 2, BH, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(B, BH - 3, P, 3), { tone: "faint" }) }));
  out.push(lines([0, 1, 2, 3, 4].map((i) => [[B.x + 10, B.y + 8 + i * 6], [B.x + B.w - 10, B.y + 8 + i * 6]]), BH + 2));
  let face = "";
  ["22", "80", "443", "3389"].forEach((n, i) => {
    const z = 64 - i * 15;
    face += rect("lm-inlay", B.x + 5, z - 5, B.w - 10, 12, 1.6) + `<text class="lm-rule" x="${n1(B.x + 10)}" y="${n1(-(z - 0.2))}">${n}</text>` + rect("lm-slot", B.x + 30, z - 1.4, 36, 3.8, 1.4) + `<circle class="lm-led${i < 3 ? " on" : ""}" cx="${n1(B.x + B.w - 10)}" cy="${n1(-(z + 0.5))}" r="1.6"/>`;
  });
  out.push(onFaceY(F, face));
  // A packet, half through the door marked 80: the lit part.
  out.push(S(k.slabOf({ x: B.x + 34, y: F - 5, w: 28, d: 14, r: 1 }, 48, 3, P, 3, 0.4), { tone: "hi", lit: true }));
  return figure("ports", "ONE ADDRESS · MANY PORTS", out.join(""), "A tall server with four numbered doors down its front: 22, 80, 443 and 3389. A light beside the first three is on; 3389’s is dark. A lit packet is halfway through door 80.");
}

// ---------- Lesson 12, NAT: the router swaps the inside address for its own on the way out ----------
function natSpot() {
  const out = [];
  // The home side's cable from the laptop to the router's front, and the one way out, to the right edge.
  out.push(tubeOf([[[-58, 24], [-4, 24], [-4, -4]], [[44, -22], [112, -22]]].flatMap((list) => tubePieces(list.map(([x, y]) => [x, y, 1.4]), 1.5, P, { maxLength: 16 }))));
  // Two at home share it: a phone on its dock at the back, and the laptop.
  const DK = { x: -96, y: -62, w: 22, d: 13, r: 3 }, PH = { x: -92.5, y: -59.4, w: 15, d: 2.8, r: 1.1 };
  out.push(S(k.slabOf(DK, 0, 2.6, P, 4, 0.5), { tone: "mid" }), S(k.slabOf(PH, 2.6, 30, P, 3, 0.5), { tone: "hi" }), onFaceY(PH.y + PH.d, rect("lm-void", PH.x + 1.2, 5.4, PH.w - 2.4, 24.4, 1) + rect("lm-slot", PH.x + PH.w / 2 - 2, 30.6, 4, 1, 0.5)));
  out.push(router({ x: -20, y: -40, w: 62, d: 34, r: 5 }, { lit: [0, 1, 2] }));
  const lap = laptop({ x: -108, y: 6, w: 50, d: 34, r: 4 }, 30, { keysX: 7 });
  out.push(lap.svg, onFaceY(lap.face, rect("lm-void", lap.x0, lap.z0, lap.w, lap.h, 0.8) + rect("lm-slot", lap.x0 + 3, lap.z0 + lap.h - 5, 18, 1.4, 0.7) + rect("lm-slot", lap.x0 + 3, lap.z0 + lap.h - 8.4, 26, 1.4, 0.7)));
  // The swap, as a dotted arc over the router, from the inside address to the outside one.
  const arc = []; for (let i = 0; i <= 24; i++) { const s = i / 24; arc.push([-20 + 78 * s, 11.5 - 40 * s, 27.4 + 16 * Math.sin(Math.PI * s)]); }
  out.push(L(k.pathOf(arc.map(at)), { tone: "hi", dotted: true }));
  const tag = (T, z, text, lit) => S(k.slabOf(T, z, 2.4, P, 3, 0.5), { tone: "hi", lit }) + onTopAt(z + 2.4, `<text class="${lit ? "lm-tagt" : "lm-pkt-t"}" x="${T.x + 3}" y="${T.y + 7.4}">${text}</text>`);
  // Inside, over the laptop's cable: its private address. Outside, over the cable out: the router's public one, lit.
  out.push(tag({ x: -56, y: 6, w: 36, d: 11, r: 2 }, 25, "192.168.1.100", false));
  out.push(`<path class="lm-shadow" d="${k.planOutline({ x: 62, y: -30, w: 32, d: 9, r: 3 }, 0, P, 4)}"/>`);
  out.push(tag({ x: 58, y: -34, w: 38, d: 11, r: 2 }, 25, "198.51.100.23", true));
  return figure("nat", "PRIVATE IN · PUBLIC OUT", out.join(""), "A home router in the middle, with a laptop and a phone behind it and one cable out to the right. Over the laptop’s cable floats a tag with its private address, 192.168.1.100; over the cable out, a lit tag with the router’s public address, 198.51.100.23. A dotted arc joins them over the router.");
}

// IP Address: the address as a plate of four octet tiles, a dot between each, its bits engraved under each number.
function ipSpot() {
  const out = [], TZ = 3, TH = 24, TW = 40, TD = 26, Y = -16;
  const BASE = { x: -102, y: Y - 6, w: 204, d: TD + 16, r: 3 };
  out.push(S(k.slabOf(BASE, 0, TZ, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(BASE, 1.2, P, 3), { tone: "faint" }) }));
  const tiles = [["192", "11000000"], ["168", "10101000"], ["1", "00000001"], ["10", "00001010"]];
  tiles.forEach(([dec, bits], i) => {
    const x = -96 + i * 50, T = { x, y: Y, w: TW, d: TD, r: 1.6 }, F = Y + TD, lit = i === 0;
    out.push(S(k.slabOf(T, TZ, TH, P, 3, 0.6), { tone: "hi", lit }));
    out.push(k.faceTextSvg(k.sideMatrix([x + TW / 2, F], TZ + 11.6, P, "left"), dec, { size: 10, anchor: "middle" }));
    out.push(onFaceY(F, (lit ? "" : rect("lm-inlay", x + 3, TZ + 1.6, TW - 6, 5, 1)) + `<text class="${lit ? "lm-tagt" : "lm-rule"}" x="${n1(x + TW / 2)}" y="${n1(-(TZ + 2.8))}" text-anchor="middle">${bits}</text>`));
    // The dot after each of the first three numbers: dotted decimal.
    if (i < 3) out.push(S(k.cylinder(x + TW + 5, F + 6, 2.2, TZ, 3, P, 20), { tone: "mid" }));
  });
  return figure("ip-address", "FOUR OCTETS · 32 BITS", out.join(""), "An address laid out as four tiles on a plate, 192, 168, 1 and 10, with a dot between each. Under each number its 8 bits are engraved. The first tile, 192 over 11000000, is lit.");
}

// MAC Address: a network card, its address on two labels side by side: the organization's half, lit, and the card's own.
function macSpot() {
  const out = [], B = { x: -72, y: -46, w: 160, d: 70, r: 2.4 }, BZ = 6, BH = 3;
  for (const [x, y] of [[B.x + 20, B.y + 14], [B.x + B.w - 20, B.y + 14], [B.x + 20, B.y + B.d - 12], [B.x + B.w - 20, B.y + B.d - 12]]) out.push(S(k.cylinder(x, y, 2.6, 0, BZ, P, 20), { tone: "lo" }));
  // The bracket at the left end, behind the board: a socket for the cable, and two lights, the link light on.
  const K = { x: B.x - 7, y: B.y + 4, w: 4, d: B.d - 8, r: 0.6 }, KH = 30;
  out.push(S(k.slabOf(K, 0, KH, P, 3, 0.4), { tone: "hi", inner: L(k.sideSeam(K, KH - 3, P, 3), { tone: "faint" }) }));
  const KF = K.x + K.w, J = { y: K.y + 30, z: 13, w: 16, h: 12 };
  out.push(onFaceX(KF, rect("lm-inlay", -(J.y + J.w), J.z, J.w, J.h, 1.2) + rect("lm-void", -(J.y + J.w - 3), J.z + 2, J.w - 6, J.h - 5, 0.6) + rect("lm-slot", -(J.y + J.w / 2 + 2.5), J.z + J.h - 3.2, 5, 1.6, 0.4)));
  out.push(`<g class="lm-leds">${dot(at([KF, J.y + 3, 18]), "lm-led on", 1.3)}${dot(at([KF, J.y + 3, 13.5]), "lm-led", 1.3)}</g>`);
  out.push(S(k.slabOf(B, BZ, BH, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(B, BZ + 1, P, 3), { tone: "faint" }) }));
  const T = BZ + BH;
  // The contacts along its front edge, where it plugs in.
  let edge = "";
  for (let i = 0; i < 24; i++) edge += rect("lm-slot", B.x + 40 + i * 4.4, BZ + 0.6, 2.6, 1.8, 0.3);
  out.push(onFaceY(B.y + B.d, edge));
  // The chip at the back, its traces to the contacts.
  const C = { x: B.x + 20, y: B.y + 8, w: 30, d: 26, r: 1.4 };
  out.push(lines([0, 1, 2, 3].map((i) => [[C.x + C.w + 2, C.y + 5 + i * 5.4], [C.x + C.w + 14, C.y + 5 + i * 5.4]]).concat([0, 1, 2, 3, 4].map((i) => [[C.x + 5 + i * 5, C.y + C.d + 2], [C.x + 5 + i * 5, B.y + B.d - 4]])), T));
  out.push(S(k.slabOf(C, T, 4, P, 3, 0.5), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(C, 4), T + 4, P, 3), { tone: "mid" }));
  // The address, on two labels with a gap between: the organization's number (lit), then this card's.
  const tag = (L0, text, lit) => S(k.slabOf(L0, T, 2.4, P, 3, 0.4), { tone: "hi", lit }) + onTopAt(T + 2.4, `<text class="${lit ? "lm-tagt" : "lm-pkt-t"}" x="${n1(L0.x + 4.6)}" y="${n1(L0.y + 9.4)}">${text}</text>`);
  out.push(tag({ x: B.x + 70, y: B.y + 34, w: 31, d: 15, r: 1.4 }, "00:00:5E", true));
  out.push(tag({ x: B.x + 106, y: B.y + 34, w: 31, d: 15, r: 1.4 }, "00:53:10", false));
  return figure("mac-address", "OUI · THIS CARD", out.join(""), "A network card on short legs: a chip, contacts along its edge, a bracket with a socket and a light. Its address is on two labels side by side: the first half, 00:00:5E, is lit; the second, 00:53:10, is not.");
}

// TCP/UDP: two lanes. TCP's three pieces go out and a lit acknowledgement comes back; UDP's go out with piece 2
// missing, and nothing comes back.
function tcpUdpSpot() {
  const out = [], LW = 200, LD = 38, LZ = 3, PZ = LZ, PH = 7;
  const lanes = [{ y: -50, name: "TCP" }, { y: 6, name: "UDP" }];
  const pkt = (x, y, text, lit = false) => S(k.slabOf({ x, y, w: 22, d: 15, r: 1.6 }, PZ, PH, P, 3, 0.5), { tone: "hi", lit }) + onTopAt(PZ + PH, `<text class="${lit ? "lm-tagt" : "lm-pkt-t"}" x="${n1(x + 11)}" y="${n1(y + 9.6)}" text-anchor="middle">${text}</text>`);
  for (const { y, name } of lanes) {
    const R = { x: -100, y, w: LW, d: LD, r: 3 };
    out.push(S(k.slabOf(R, 0, LZ, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(R, 1.2, P, 3), { tone: "faint" }) }));
    out.push(L(k.planOutline(k.insetPlan(R, 3), LZ, P, 3), { tone: "lo" }));
    out.push(k.faceTextSvg(k.sideMatrix([R.x + 5, y + LD], 0.6, P, "left"), name, { size: 3.4, tone: "mid" }));
    // The way out, along the lane's front half.
    out.push(lines([-90, 76].flatMap((x) => [[[x, y + 24], [x + 4, y + 28]], [[x + 4, y + 28], [x, y + 32]]]), LZ, "mid"));
  }
  // TCP: pieces 1 to 3 on their way out; the acknowledgement on its way back, along the lane's back half, lit.
  [-52, -22, 8].forEach((x, i) => out.push(pkt(x, -30, String(i + 1))));
  out.push(lines([[[46, -42], [42, -38]], [[42, -38], [46, -34]]], LZ, "mid"));
  out.push(pkt(52, -46, "ACK", true));
  // UDP: pieces 1 and 3 on their way, an empty place where 2 was lost, and nothing on the way back.
  out.push(pkt(-52, 26, "1"), pkt(8, 26, "3"));
  out.push(L(k.planOutline({ x: -22, y: 26, w: 22, d: 15, r: 1.6 }, LZ, P, 3), { tone: "mid", dotted: true }));
  return figure("tcp-udp", "TCP · UDP", out.join(""), "Two lanes on one plate. On the lane marked TCP, pieces 1, 2 and 3 head out and a lit acknowledgement comes back. On the lane marked UDP, pieces 1 and 3 head out with an empty place between them where 2 was lost, and nothing comes back.");
}

export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall', 'osi', 'router', 'arp', 'ports', 'nat', 'ip-address', 'mac-address', 'tcp-udp'] as const;
export type SpotKind = (typeof SPOTS)[number];

const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall, osi, router: routerSpot, arp: arpSpot, ports: portsSpot, nat: natSpot, 'ip-address': ipSpot, 'mac-address': macSpot, 'tcp-udp': tcpUdpSpot };

/** A small figure, cropped close to its plate. */
export const spot = (kind: SpotKind): string => DRAW[kind]();
