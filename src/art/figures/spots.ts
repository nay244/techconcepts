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

// ---------- Lesson 07, Subnetting: one network cut into four smaller ones ----------
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

// ---------- Lesson 09, DHCP: the router hands the laptop its address ----------
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

// ---------- Lesson 16, Firewalls: a wall with a gate, a list of rules, one packet let through ----------
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

export const SPOTS = ['watch', 'learn', 'practice', 'subnet', 'dhcp', 'firewall'] as const;
export type SpotKind = (typeof SPOTS)[number];

const DRAW: Record<SpotKind, () => string> = { watch, learn, practice, subnet, dhcp, firewall };

/** A small figure, cropped close to its plate. */
export const spot = (kind: SpotKind): string => DRAW[kind]();
