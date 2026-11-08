// @ts-nocheck -- ported drawing code; the checksum tests in figures.test.ts pin its output, so it is not re-typed line by line.
// The track covers, drawn at build time with the Anatomy kit. Six are ported from the approved mockups' figs
// (covers.mjs for the four newer covers, build3.mjs for the router and the padlock); the drawing is identical.
// The A+ cover was drawn later, here, in the same style.
// Film grain is left out. `data-part` hooks stay in `cover()` so a page can move the figure; stills drop them.
import { k, G, W, H, P, at, S, L, D, n1, byDepth, poly, tubeOf, onFaceY, onFaceX, tubePieces, base } from '../common.ts';
import { scopeIds } from '../ids.ts';

const dot = ([x, y], cls, part = "", r = 1.2, extra = "") => `<circle class="${cls}"${part ? ` data-part="${part}"` : ""}${extra} cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`;
// A rectangle on a vertical face, given in world units: left edge u, bottom z, width, height.
const rect = (cls, u, z, w, h, rx = 0.6) => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"/>`;
const zero = at([0, 0, 0]);
const screenPath = (route) => G.resample(route, 1).map((p) => { const s = at([p[0], p[1], 0]); return [+(s[0] - zero[0]).toFixed(1), +(s[1] - zero[1]).toFixed(1)]; });

// ---------- The web: a laptop asks a server for a page (How the Internet Works's card on Home) ----------
function web() {
  const out = [];
  // Laptop: base, keyboard, trackpad, lid. Its screen shows a browser; the page is drawn when the reply arrives.
  const LB = { x: -100, y: -10, w: 78, d: 54, r: 5 }, LZ = 4.5;
  out.push(S(k.slabOf(LB, 0, LZ, P, 6, 1), { tone: "hi", inner: L(k.sideSeam(LB, 1.6, P, 6), { tone: "faint" }) }));
  const KX = LB.x + 7, KY = LB.y + 8, KS = 5.4;
  let keys = "";
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) keys += k.planOutline({ x: KX + c * KS, y: KY + r * KS, w: 4.5, d: 4.5, r: 0.8 }, LZ, P, 3);
  keys += k.planOutline({ x: KX + 3 * KS, y: KY + 4 * KS, w: 6 * KS - 0.9, d: 4.5, r: 0.8 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  out.push(L(k.planOutline({ x: LB.x + 26, y: LB.y + 37, w: 26, d: 11, r: 1.6 }, LZ, P, 3), { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 3, r: 1.2 }, LT = LZ + 46, LF = LID.y + LID.d;
  out.push(S(k.slabOf(LID, LZ, LT - LZ, P, 3, 0.6), { tone: "hi" }));
  const DX = LID.x + 4, DW = LID.w - 8, DZ = LZ + 4, DH = 39;
  let scr = rect("lm-void", DX, DZ, DW, DH, 1);
  scr += [0, 1, 2].map((i) => `<circle class="lm-dotc" cx="${n1(DX + 2.6 + i * 2.4)}" cy="${n1(-(DZ + DH - 2.2))}" r="0.7"/>`).join("");
  scr += rect("lm-inlay", DX + 10, DZ + DH - 3.7, DW - 12, 3, 1.5);
  scr += `<text class="lm-url" x="${n1(DX + 12)}" y="${n1(-(DZ + DH - 2.85))}">techconcepts.app</text>`;
  const blocks = [[DX + 2, DZ + 30.8, DW - 4, 2.6], [DX + 2, DZ + 17, 28, 12, "soft"], [DX + 33, DZ + 27.6, DW - 37, 1.4], [DX + 33, DZ + 24.6, DW - 37, 1.4], [DX + 33, DZ + 21.6, DW - 37, 1.4], [DX + 33, DZ + 18.6, 20, 1.4], [DX + 2, DZ + 2.5, 19.6, 11.6], [DX + 24.2, DZ + 2.5, 19.6, 11.6], [DX + 46.4, DZ + 2.5, 19.6, 11.6]];
  scr += blocks.map(([x, z, w, h, soft]) => rect("lm-px" + (soft ? " soft" : ""), x, z, w, h, 0.5)).join("");
  out.push(onFaceY(LF, scr));
  out.push(D([at([LID.x + LID.w / 2, LF, LT - 1.6])], { size: 0.5, tone: "mid" }));

  // Server cabinet: three units, each with a drive slot, vents and a light; vents down the side.
  const SR = { x: 34, y: -64, w: 40, d: 42, r: 3 }, ST = 66, SF = SR.y + SR.d, SX = SR.x + SR.w;
  for (const [x, y] of byDepth(k.corners(SR, 6))) out.push(S(k.cylinder(x, y, 2.6, 0, 3, P, 18), { tone: "lo" }));
  out.push(S(k.slabOf(SR, 3, ST - 3, P, 4, 1), { tone: "hi", inner: L(k.sideSeam(SR, 24, P, 4) + k.sideSeam(SR, 45, P, 4), { tone: "faint" }) }));
  out.push(D(k.dotGrid(SR.x + 6, SR.y + 6, 6, 6, 5.6, ST, P), { size: 0.7, tone: "lo" }));
  let front = "";
  const sleds = [];
  for (const b of [3, 24, 45]) {
    front += rect("lm-void", SR.x + 5, b + 8.5, 22, 3.4) + rect("lm-slot", SR.x + 5, b + 15, 22, 1, 0.5) + rect("lm-slot", SR.x + 5, b + 17.2, 22, 1, 0.5);
    sleds.push(at([SR.x + 33, SF, b + 10.2]));
  }
  out.push(onFaceY(SF, front));
  out.push(`<g class="lm-leds" data-part="sleds">${sleds.map((p) => dot(p, "lm-led on")).join("")}</g>`);
  let side = "";
  for (let i = 0; i < 7; i++) side += rect("lm-slot", -SF + 5 + i * 5, 12, 2, 44, 1);
  out.push(onFaceX(SX, side));

  // The track: two pads, sleepers, buffer stops, and one rail with a bend, from the laptop to the server.
  const RY = 30, RX = 52, X0 = -10, Y1 = -12, RZ = 1.9;
  const route = G.fillet([[X0, RY, RZ], [RX, RY, RZ], [RX, Y1, RZ]], 12, 10);
  out.push(S(k.slabOf({ x: -20, y: 23, w: 14, d: 14, r: 2 }, 0, 0.8, P, 3, 0.3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: 44, y: -21, w: 16, d: 13, r: 2 }, 0, 0.8, P, 3, 0.3), { tone: "lo" }));
  const sleepers = [];
  for (let x = -2; x <= RX - 14; x += 7) sleepers.push({ x: x - 1.1, y: RY - 4, w: 2.2, d: 8, r: 0.4 });
  for (let y = RY - 14; y >= Y1 + 6; y -= 7) sleepers.push({ x: RX - 4, y: y - 1.1, w: 8, d: 2.2, r: 0.4 });
  byDepth(sleepers.map((s) => [s.x + s.w / 2, s.y + s.d / 2, s])).forEach(([, , s]) => out.push(S(k.slabOf(s, 0, 0.8, P, 2), { tone: "mid", crease: "none" })));
  out.push(S(k.slabOf({ x: 49, y: -20.5, w: 6, d: 3, r: 0.6 }, 0.8, 4.2, P, 2, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -19, y: 27, w: 3, d: 6, r: 0.6 }, 0.8, 4.2, P, 2, 0.3), { tone: "mid" }));
  out.push(`<g>${tubeOf(tubePieces(route, 1.1, P, { maxLength: 18 }))}</g>`);

  // The shuttle (the coloured part), carrying a sealed request. Its screen path is worked out here, once.
  const cart = S(k.slabOf({ x: -4.5, y: -4.5, w: 9, d: 9, r: 1.2 }, RZ + 1.1, 5.2, P, 3, 0.5), { tone: "hi", lit: true })
    + S(k.slabOf({ x: -3.4, y: -2.6, w: 6.8, d: 5.2, r: 0.4 }, RZ + 6.3, 0.7, P, 2), { tone: "mid", crease: "none" })
    + L(k.onTop([[-3.4, -2.6], [0, 0.8], [3.4, -2.6]], RZ + 7, P), { tone: "hi" });
  const path = screenPath(route);
  out.push(`<g data-part="cart" transform="translate(${path[0][0]} ${path[0][1]})">${cart}</g>`);

  return { svg: out.join(""), path };
}

// Moves a whole scene on the plate. A move in the world is a plain move on screen, so the parts inside keep their own coordinates.
const shift = (by, svg) => `<g transform="${k.translateAlong(P, by)}">${svg}</g>`;

// ---------- AI Concepts: a machine that learns to sort cards by their shape ----------
function sorter() {
  const out = [];
  const M = { x: -40, y: -40, w: 56, d: 50, r: 5 }, MT = 44, MF = M.y + M.d, MR = M.x + M.w;
  const BZ = 10, LY = -26, LD = 20, CY = LY + LD / 2;
  const belt = (b) => S(k.slabOf(b, 0, BZ, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(b, BZ - 2.4, P, 3), { tone: "faint" }) })
    + L(k.planOutline(k.insetPlan(b, 2), BZ, P, 3), { tone: "lo" })
    + L(Array.from({ length: Math.floor((b.w - 6) / 6) }, (_, i) => k.lineOnTop([b.x + 5 + i * 6, b.y + 2.6], [b.x + 5 + i * 6, b.y + b.d - 2.6], BZ, P)).join(""), { tone: "faint" });
  // A card: flat, with its shape printed on top. minX cuts it off at the machine's side while it comes out.
  const card = (cx, cy, z, kind, lit, minX = -1e9) => {
    const x0 = Math.max(minX, cx - 6), x1 = cx + 6;
    if (x1 - x0 < 0.4) return "";
    let s = S(k.slabOf({ x: x0, y: cy - 5, w: x1 - x0, d: 10, r: 0.8 }, z, 1.2, P, 3, 0.3), { tone: "hi", lit });
    if (cx - 3.4 >= minX) s += L(kind === "circle" ? k.ring(cx, cy, 2.6, z + 1.2, P, 24) : k.onTop([[cx - 2.8, cy + 2.2], [cx + 2.8, cy + 2.2], [cx, cy - 2.8]], z + 1.2, P, true), { tone: "mid", className: lit ? "lm-sym-lit" : "" });
    return s;
  };
  // In: a belt behind the machine on the left. It is drawn first, so the machine hides where it goes in.
  out.push(belt({ x: -102, y: LY, w: 64, d: LD, r: 2 }));
  out.push(`<g data-part="in-card">${card(-84, CY, BZ, "circle", true)}</g>`);
  // The machine: a grid of weights on top, three dials on the front, a slot on the side.
  for (const [x, y] of byDepth(k.corners(M, 7))) out.push(S(k.cylinder(x, y, 3, 0, 3, P, 18), { tone: "lo" }));
  out.push(S(k.slabOf(M, 3, MT - 3, P, 6, 1), { tone: "hi", inner: L(k.sideSeam(M, MT - 6, P, 6), { tone: "faint" }) }));
  const SX = [-30, -18, -6, 6], SY = [-31, -20.4, -9.8, 0.8];
  let net = "";
  for (let r = 0; r < 3; r++) for (const a of SX) for (const b of SX) net += k.lineOnTop([a, SY[r]], [b, SY[r + 1]], MT, P);
  out.push(L(net, { tone: "faint" }));
  out.push(L(SY.flatMap((y) => SX.map((x) => k.ring(x, y, 2.2, MT, P, 16))).join(""), { tone: "lo" }));
  out.push(`<g class="lm-leds" data-part="studs">${SY.flatMap((y) => SX.map((x) => dot(at([x, y, MT]), "lm-led", "", 1.1))).join("")}</g>`);
  const DIAL = [[-28, 24], [-12, 24], [4, 24]], A0 = [-20, 30, 10], NR = 3.8;
  let panel = rect("lm-inlay", -37, 15, 50, 19, 1.5);
  for (const [cx, cz] of DIAL) for (let a = -120; a <= 120; a += 40) { const t = (a * Math.PI) / 180; panel += `<path class="lm-tick" d="M${n1(cx + 6.3 * Math.sin(t))} ${n1(-cz - 6.3 * Math.cos(t))}L${n1(cx + 7.3 * Math.sin(t))} ${n1(-cz - 7.3 * Math.cos(t))}"/>`; }
  for (let i = 0; i < 5; i++) panel += rect("lm-slot", -36 + i * 10, 7.5, 7, 1.2, 0.6);
  out.push(onFaceY(MF, panel));
  for (const [cx, cz] of DIAL) { const F = G.frameAlong([cx, MF, cz], [0, 1, 0]); out.push(S(G.disc(0, 1.2, 5.4, F, P), { tone: "mid" }), L(G.circleOf(F, 1.2, 4.4, P, 40), { tone: "lo" })); }
  out.push(onFaceY(MF + 1.2, DIAL.map(([cx, cz], i) => { const t = (A0[i] * Math.PI) / 180; return `<line class="lm-needle" data-part="needle-${i}" x1="${cx}" y1="${-cz}" x2="${n1(cx + NR * Math.sin(t))}" y2="${n1(-cz - NR * Math.cos(t))}"/>`; }).join("")));
  out.push(D(DIAL.map(([cx, cz]) => at([cx, MF + 1.2, cz])), { size: 0.8, tone: "hi" }));
  out.push(onFaceX(MR, rect("lm-void", -LY - LD - 1, BZ - 0.2, LD + 2, 4.8, 0.8) + [30, 33, 36].map((z) => rect("lm-slot", -5, z, 40, 1.2, 0.6)).join("")));
  // Out: a belt to a turntable, then a tray for each shape.
  out.push(belt({ x: MR, y: LY, w: 40, d: LD, r: 2 }));
  const TB = { x: 56, y: LY, w: 22, d: LD, r: 2 };
  out.push(S(k.slabOf(TB, 0, BZ, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(TB, BZ - 2.4, P, 3), { tone: "faint" }) }));
  out.push(L(k.ring(67, CY, 6.5, BZ, P, 40) + k.ring(67, CY, 1.4, BZ, P, 16), { tone: "lo" }));
  const tray = (T, id, sym, part) => {
    const I = k.insetPlan(T, 1.8), Z = 6, F = 1.5, open = k.planOutline(I, Z, P, 3), cx = T.x + T.w / 2;
    return S(k.slabOf(T, 0, Z, P, 3, 0.5), { tone: "hi" })
      + `<clipPath id="${id}"><path d="${open}"/></clipPath><g clip-path="url(#${id})">`
      + poly([[I.x, I.y, F], [I.x + I.w, I.y, F], [I.x + I.w, I.y + I.d, F], [I.x, I.y + I.d, F]], "lm-floor")
      + poly([[I.x, I.y, F], [I.x + I.w, I.y, F], [I.x + I.w, I.y, Z], [I.x, I.y, Z]], "lm-wall2")
      + poly([[I.x, I.y, F], [I.x, I.y + I.d, F], [I.x, I.y + I.d, Z], [I.x, I.y, Z]], "lm-wall")
      + `</g><g data-part="${part}" clip-path="url(#${id})"></g>` + L(open, { tone: "lo" })
      + onFaceY(T.y + T.d, sym === "circle" ? `<circle class="lm-sym" cx="${cx}" cy="-3" r="1.6"/>` : `<path class="lm-sym" d="M${cx - 1.9} -1.4L${cx + 1.9} -1.4L${cx} -4.6Z"/>`);
  };
  out.push(tray({ x: 80, y: -27, w: 22, d: 22, r: 2 }, "ai-ta", "circle", "file-a"));
  out.push(tray({ x: 56, y: -3, w: 22, d: 22, r: 2 }, "ai-tb", "triangle", "file-b"));
  out.push(`<g data-part="out-card"></g>`);

  return shift([0, 12, 0], out.join(""));
}

// ---------- Privilege Escalation: a level 1 badge calls the lift to floor 3, and the alarm catches it ----------
function lift() {
  const out = [];
  const B = { x: -24, y: -58, w: 72, d: 52, r: 3 }, BF = B.y + B.d, BR = B.x + B.w;
  const FLOORS = [3, 28.2, 53.4], FH = 24, ROOF = 77.4;
  const win = (u, z, w, h) => rect("lm-void", u, z, w, h, 0.5) + `<path class="lm-mull" d="M${n1(u + w / 2)} ${n1(-(z + h))}V${n1(-z)}M${n1(u)} ${n1(-(z + h / 2))}H${n1(u + w)}"/>`;
  for (let i = 0; i < 3; i++) {
    const z0 = FLOORS[i];
    out.push(S(k.slabOf(B, z0, FH, P, 4, 0.5), { tone: "hi" }));
    let f = [-20, -10.5, 26, 35.5].map((u) => win(u, z0 + 7, 7, 12)).join("");
    f += rect("lm-face", 3, z0 + 1.5, 16, 19, 0.4) + `<path class="lm-mull" d="M11 ${n1(-(z0 + 20.5))}V${n1(-(z0 + 1.5))}"/>`;
    out.push(onFaceY(BF, f));
    out.push(onFaceX(BR, [10, 20.5, 31, 41.5].map((u) => win(u, z0 + 7, 7, 12)).join("")));
    if (i < 2) out.push(S(k.slabOf(k.insetPlan(B, -1.2), z0 + FH, 1.2, P, 4, 0.3), { tone: "mid" }));
  }
  out.push(dot(at([11, BF, FLOORS[2] + 22.4]), "lm-warn", "warn3", 1));
  out.push(S(k.slabOf(k.insetPlan(B, -0.8), ROOF, 1.6, P, 4, 0.4), { tone: "mid" }));
  const RT = ROOF + 1.6;
  // On the roof: a cooling unit with a fan, and the alarm beacon.
  out.push(S(k.slabOf({ x: 24, y: -46, w: 18, d: 16, r: 1.4 }, RT, 7, P, 3, 0.5), { tone: "hi" }));
  out.push(L(k.ring(33, -38, 5.2, RT + 7, P, 32) + k.ring(33, -38, 1.2, RT + 7, P, 12) + [0, 60, 120, 180, 240, 300].map((a) => { const t = (a * Math.PI) / 180; return k.lineOnTop([33 + 1.4 * Math.cos(t), -38 + 1.4 * Math.sin(t)], [33 + 4.8 * Math.cos(t), -38 + 4.8 * Math.sin(t)], RT + 7, P); }).join(""), { tone: "lo" }));
  out.push(S(k.cylinder(10, -16, 3.4, RT, 1.6, P, 24), { tone: "mid" }));
  out.push(S(k.cylinder(10, -16, 2.4, RT + 1.6, 4.4, P, 24, 0.4), { tone: "hi", className: "lm-alarm" }).replace('class="iso-solid lm-alarm"', 'class="iso-solid lm-alarm" data-part="alarm"'));
  // The lift: two rails, a crossbar and pulley, a cable, and the car (the coloured part).
  for (const x of [-0.8, 21.2]) out.push(S(k.slabOf({ x, y: BF, w: 1.6, d: 2.4, r: 0.4 }, 0, ROOF + 5, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -1.6, y: BF - 0.2, w: 25.2, d: 2.8, r: 0.6 }, ROOF + 5, 2.4, P, 2, 0.3), { tone: "mid" }));
  const PUL = G.frameAlong([11, BF + 2.6, ROOF + 2.2], [0, 1, 0]);
  out.push(S(G.disc(0, 1.4, 2.6, PUL, P), { tone: "mid" }), D([at([11, BF + 4, ROOF + 2.2])], { size: 0.5, tone: "hi" }));
  const CAR = { x: 2, y: BF + 2.6, w: 18, d: 12, r: 1.2 }, CZ = 4, CH = 19;
  const c1 = at([11, BF + 8.6, ROOF - 0.4]), c2 = at([11, BF + 8.6, CZ + CH + 1.4]);
  out.push(`<line class="lm-cable" data-part="cable" x1="${n1(c1[0])}" y1="${n1(c1[1])}" x2="${n1(c2[0])}" y2="${n1(c2[1])}"/>`);
  out.push(`<g data-part="car">${S(k.slabOf(CAR, CZ, CH, P, 3, 0.6), { tone: "hi", lit: true })}${onFaceY(CAR.y + CAR.d, rect("lm-void", 5, CZ + 5, 12, 11, 0.6) + `<path class="lm-mull" d="M5 ${-(CZ + 8)}H17"/>`)}${S(k.slabOf({ x: 9, y: BF + 6.6, w: 4, d: 4, r: 0.6 }, CZ + CH, 1.4, P, 2), { tone: "mid" })}</g>`);
  // The badge reader on a post, with a light for each floor, and the badge waiting in its holder.
  out.push(S(k.cylinder(-70, 34, 4.4, 0, 1.4, P, 24), { tone: "lo" }), S(k.cylinder(-70, 34, 1.8, 1.4, 20.6, P, 16), { tone: "mid", crease: "none" }));
  const RB = { x: -78, y: 30, w: 16, d: 8, r: 1.4 }, RF = RB.y + RB.d;
  out.push(S(k.slabOf(RB, 22, 16, P, 3, 0.6), { tone: "hi" }));
  out.push(onFaceY(RF, rect("lm-inlay", -76, 25, 8, 10, 1) + `<circle class="lm-sym" cx="-72" cy="-30" r="1.6"/><circle class="lm-sym" cx="-72" cy="-30" r="3"/>`));
  out.push(`<g class="lm-leds">${[27, 30.5, 34].map((z, i) => dot(at([-65.5, RF, z]), "lm-led", "f" + (i + 1), 0.9)).join("")}${dot(at([-72, RF, 36.6]), "lm-led", "tap", 0.7)}</g>`);
  out.push(D([27, 30.5, 34].flatMap((z, i) => Array.from({ length: i + 1 }, (_, j) => at([-63.6 + j * 1.1, RF, z]))), { size: 0.35, tone: "hi" }));
  out.push(S(k.slabOf({ x: -79, y: 52, w: 14, d: 6, r: 1.2 }, 0, 3.2, P, 3, 0.4), { tone: "mid" }), L(k.lineOnTop([-77, 55], [-67, 55], 3.2, P), { tone: "lo" }));
  const BG = { x: -77, y: 54.4, w: 10, d: 1.2, r: 0.6 };
  out.push(`<g data-part="badge">${S(k.slabOf(BG, 3.2, 14, P, 2), { tone: "hi" })}${onFaceY(BG.y + BG.d, rect("lm-badge", -76.2, 4, 8.4, 12.4, 0.5) + `<circle class="lm-void" cx="-72" cy="-15" r="0.7"/>` + rect("lm-slot", -74.3, 9.4, 4.6, 4.4, 0.3) + `<text class="lm-lvl" x="-72" y="-5.2" text-anchor="middle">L1</text>`)}</g>`);
  const UP = FLOORS[2] - FLOORS[0];

  return shift([0, 8, 0], out.join(""));
}

// ---------- Threat & Vulnerability Management: scan the wall, rank the cracks, patch the worst first ----------
function scanner() {
  const out = [];
  const FOOT = { x: -84, y: -60, w: 152, d: 24, r: 3 }, WALL = { x: -78, y: -54, w: 140, d: 10, r: 2 }, WF = WALL.y + WALL.d, WT = 66;
  out.push(S(k.slabOf(FOOT, 0, 3, P, 6, 0.6), { tone: "mid" }));
  out.push(S(k.slabOf(WALL, 3, WT - 3, P, 4, 0.8), { tone: "hi", inner: L(k.sideSeam(WALL, WT - 5, P, 4), { tone: "faint" }) }));
  const tile = (c, r) => ({ x: WALL.x + 4 + c * 27, z: 7 + r * 19.4, w: 24, h: 16 });
  const BAD = [[1, 2, 3], [3, 0, 2], [4, 1, 1]];
  const CRACK = [[4, 3], [9, 6.5], [8, 9], [14, 11], [13, 13.5]];
  let face = "";
  const screws = [], leds = [];
  for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) {
    const t = tile(c, r), i = BAD.findIndex(([bc, br]) => bc === c && br === r);
    face += rect("lm-face", t.x, t.z, t.w, t.h, 0.8);
    if (i >= 0) face += `<rect class="lm-hl" data-bad="${i}" data-sev="${BAD[i][2]}" x="${n1(t.x - 0.6)}" y="${n1(-(t.z + t.h + 0.6))}" width="${t.w + 1.2}" height="${t.h + 1.2}" rx="1.2"/>`;
    if (i >= 0) face += `<polyline class="lm-crack" points="${CRACK.map(([du, dv], j) => `${n1(t.x + (i === 1 ? t.w - du : du) + (j % 2) * 0.6)},${n1(-(t.z + t.h) + dv)}`).join(" ")}"/>`;
    screws.push(...[[1.8, 1.8], [t.w - 1.8, 1.8], [1.8, t.h - 1.8]].map(([du, dz]) => at([t.x + du, WF, t.z + dz])));
    leds.push(dot(at([t.x + t.w - 2.6, WF, t.z + t.h - 2.6]), "lm-sev", "", 1.2, i >= 0 ? ` data-bad="${i}" data-sev="${BAD[i][2]}"` : ""));
  }
  out.push(onFaceY(WF, face), D(screws, { size: 0.45, tone: "mid" }), `<g>${leds.join("")}</g>`);
  BAD.forEach(([c, r], i) => {
    const t = tile(c, r), pl = { x: t.x + 2, y: WF, w: 20, d: 1.2, r: 0.6 };
    out.push(`<g data-part="patch-${i}" style="opacity:0">${S(k.slabOf(pl, t.z + 2, 12, P, 2, 0.3), { tone: "hi", className: "lm-patch" })}${D(k.corners({ x: pl.x, y: 0, w: pl.w, d: 12 }, 1.6).map(([x, dz]) => at([x, WF + 1.2, t.z + 2 + dz])), { size: 0.45, tone: "hi" })}</g>`);
  });
  const HX0 = -62, HZ0 = 25.5;
  out.push(onFaceY(WF, `<line class="lm-beam" data-part="beam" x1="${HX0}" y1="-5" x2="${HX0}" y2="-64" style="opacity:0"/>`));
  // The gantry: two posts and a rail along the top, then the moving carriage, rod and scanner head.
  for (const x of [WALL.x - 2, WALL.x + WALL.w + 2]) out.push(S(k.cylinder(x, WF + 4.5, 2, 3, WT - 3, P, 16), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: WALL.x - 4, y: WF + 3, w: WALL.w + 8, d: 3, r: 1 }, WT, 3, P, 3, 0.4), { tone: "hi" }));
  const ROD_Y = WF + 8.5, RAIL_TOP = WT + 3;
  if (ROD_Y !== -35.5 || RAIL_TOP !== 69) throw new Error("rod constants out of step");
  const rod = (x, z) => S(k.cylinder(x, -35.5, 0.9, z + 9, 60 - z, P, 12), { tone: "mid", crease: "none" });
  out.push(`<g data-part="head">${S(k.slabOf({ x: HX0 - 5.5, y: WF + 4.5, w: 11, d: 8, r: 1.6 }, HZ0, 9, P, 3, 0.6), { tone: "hi", lit: true })}${onFaceY(WF + 12.5, rect("lm-void", HX0 - 3.5, HZ0 + 5.4, 7, 1.6, 0.8))}</g>`);
  out.push(`<g data-part="rod">${rod(HX0, HZ0)}</g>`);
  out.push(`<g data-part="carriage">${S(k.slabOf({ x: HX0 - 6, y: WF + 1.5, w: 12, d: 10, r: 1.4 }, RAIL_TOP, 4.5, P, 3, 0.5), { tone: "mid" })}${onFaceY(WF + 11.5, `<circle class="lm-inlay" cx="${HX0 - 3}" cy="-71.2" r="1.2"/><circle class="lm-inlay" cx="${HX0 + 3}" cy="-71.2" r="1.2"/>`)}</g>`);
  // The console in front: the ranked list of what the scan found.
  const C = { x: -25, y: 14, w: 50, d: 32, r: 4 }, CT = 12;
  out.push(S(k.slabOf(C, 0, CT, P, 4, 0.8), { tone: "hi", inner: L(k.sideSeam(C, 3, P, 4), { tone: "faint" }) }));
  out.push(`<path class="lm-void" d="${k.planOutline(k.insetPlan(C, 4), CT, P, 3)}"/>`);
  out.push(L(k.lineOnTop([C.x + 7, C.y + 7.5], [C.x + 43, C.y + 7.5], CT, P), { tone: "lo" }));
  const LEN = [30, 20, 11];
  BAD.forEach(([, , sev], i) => {
    const ry = C.y + 12 + i * 6.5, x0 = C.x + 12;
    out.push(`<g class="lm-row" data-part="row-${i}">${dot(at([C.x + 8, ry, CT]), "lm-sev on", "", 1.1, ` data-sev="${sev}"`)}${poly([[x0, ry - 1.1, CT], [x0 + LEN[i], ry - 1.1, CT], [x0 + LEN[i], ry + 1.1, CT], [x0, ry + 1.1, CT]], "lm-bar").replace("<polygon", `<polygon data-sev="${sev}"`)}</g>`);
  });
  for (let j = 0; j < 3; j++) { const F = G.frameAlong([C.x + 34 + j * 5, C.y + C.d, 6], [0, 1, 0]); out.push(S(G.disc(0, 0.8, 1.5, F, P), { tone: "mid" })); }
  const TARGETS = BAD.map(([c, r]) => { const t = tile(c, r); return { x: t.x + t.w / 2, z: t.z + t.h / 2 - 4.5 }; });

  return shift([0, 8, 0], out.join(""));
}


// ---------- Networking: a home router, with packets arriving from the modem ----------
function router() {
  const out = [];
  const R = { x: -26, y: -34, w: 100, d: 58, r: 8 }, RZ = 2.4, RT = 17, RF = R.y + R.d;
  const M = { x: -100, y: -24, w: 30, d: 42, r: 5 }, MZ = 3, MT = 58, MF = M.y + M.d;
  // Modem: plinth, tower, vents, lights, port.
  out.push(S(k.slabOf(k.insetPlan(M, -2.2), 0, MZ, P, 6, 0.6), { tone: "lo" }));
  out.push(S(k.slabOf(M, MZ, MT - MZ, P, 6, 1), { tone: "hi", inner: L(k.sideSeam(M, MT - 5, P, 6), { tone: "faint" }) }));
  out.push(D(k.dotGrid(M.x + 7, M.y + 7, 4, 7, 4.4, MT, P), { size: 0.75, tone: "lo" }));
  out.push(onFaceY(MF, `<rect class="lm-inlay" x="${M.x + 5}" y="${-(MT - 6)}" width="${M.w - 10}" height="${MT - 6 - 16}" rx="2.5"/>`));
  const mled = [MT - 14, MT - 19, MT - 24].map((z) => at([M.x + M.w - 9, MF, z]));
  out.push(`<g class="lm-leds">${mled.map(([x, y], i) => `<circle class="lm-led${i < 2 ? " on" : ""}" cx="${n1(x)}" cy="${n1(y)}" r="1.5"/>`).join("")}</g>`);
  out.push(onFaceY(MF, `<rect class="lm-void" x="${M.x + 8}" y="-12.4" width="6.4" height="4.8" rx="0.8"/>`));
  // Router: feet, body with a lid seam, vents, a label plate and screws on top.
  for (const [x, y] of byDepth(k.corners(R, 10))) out.push(S(k.cylinder(x, y, 3.2, 0, RZ, P, 20), { tone: "lo" }));
  out.push(S(k.slabOf(R, RZ, RT - RZ, P, 8, 1.2), { tone: "hi", inner: L(k.sideSeam(R, 6, P, 8), { tone: "faint" }) }));
  for (let i = 0; i < 7; i++) out.push(L(k.planOutline({ x: R.x + 12 + i * 7.5, y: R.y + 9, w: 3.4, d: 26, r: 1.7 }, RT, P, 4), { tone: "lo" }));
  const tag = { x: R.x + 70, y: R.y + 12, w: 20, d: 30, r: 2 };
  out.push(S(k.slabOf(tag, RT, 0.7, P, 3), { tone: "lo", crease: "none" }));
  out.push([14, 11, 8].map((len, i) => L(k.lineOnTop([tag.x + 6 + i * 4, tag.y + 6], [tag.x + 6 + i * 4, tag.y + 6 + len + 6], RT + 0.7, P), { tone: "mid" })).join(""));
  out.push(D(k.corners(R, 4.5).map(([x, y]) => at([x, y, RT])), { size: 0.55, tone: "mid" }));
  // Two antennas on hinge blocks at the back.
  for (const [x, y] of byDepth([[R.x + 12, R.y + 8], [R.x + R.w - 12, R.y + 8]])) {
    out.push(S(k.slabOf({ x: x - 4, y: y - 3.5, w: 8, d: 7, r: 1.4 }, RT, 3.4, P, 3, 0.4), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 2.8, RT + 3.4, 3.6, P, 20), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 2.2, RT + 7, 40, P, 20), { tone: "hi", crease: "none", inner: L([18, 30].map((z) => k.sideArc(x, y, 2.2, RT + 7 + z, P, 12)).join(""), { tone: "faint" }) }));
    out.push(S(k.cylinder(x, y, 2.5, RT + 47, 2.6, P, 20, 0.4), { tone: "mid" }));
  }
  // Front panel: status lights on the left, ports on the right.
  const leds = [0, 1, 2, 3, 4].map((i) => at([R.x + 10 + i * 6.5, RF, 11.5]));
  out.push(`<g class="lm-leds" data-part="rleds">${leds.map(([x, y], i) => `<circle class="lm-led${i === 0 ? " on" : ""}" cx="${n1(x)}" cy="${n1(y)}" r="1.4"/>`).join("")}</g>`);
  out.push(onFaceY(RF, `<rect class="lm-inlay" x="${R.x + 6}" y="-14.2" width="34" height="5.4" rx="2.7"/>`
    + [0, 1, 2, 3].map((i) => `<rect class="lm-void" x="${30 + i * 9}" y="-10.6" width="6.4" height="5" rx="0.8"/>`).join("")));
  // Plugs in the modem's port and the router's first port, and the cable between them, resting on the plate.
  const plug = (x, y, z) => S(k.slabOf({ x: x - 3.4, y, w: 6.8, d: 6, r: 0.9 }, z - 2.6, 5.2, P, 3, 0.4), { tone: "mid" }) + S(k.slabOf({ x: x - 2.2, y: y + 6, w: 4.4, d: 2.6, r: 1 }, z - 1.8, 3.6, P, 3), { tone: "lo" });
  const mx = M.x + 11.2, rx = 33.2;
  out.push(plug(mx, MF, 10), plug(rx, RF, 8.1));
  const route = G.fillet([[mx, MF + 8.6, 10], [mx, MF + 18, 10], [mx, MF + 27, 1.6], [rx, MF + 27, 1.6], [rx, RF + 15, 8.1], [rx, RF + 8.6, 8.1]], 5, 9, { P, tube: 1.6 });
  out.push(`<g>${tubeOf(tubePieces(route, 1.6, P, { maxLength: 24 }))}</g>`);
  // Packets ride the cable from the modem to the router. Their screen path is worked out here, once.
  const zero = at([0, 0, 0]);
  const path = G.resample(route, 1.2).map((p) => { const s = at([p[0], p[1], p[2] + 1.8]); return [+(s[0] - zero[0]).toFixed(1), +(s[1] - zero[1]).toFixed(1)]; });
  const cube = S(k.slabOf({ x: -2.8, y: -2.8, w: 5.6, d: 5.6, r: 0.8 }, 0, 5.6, P, 3, 0.5), { tone: "hi", lit: true });
  out.push(`<g data-part="packets">${[0, 1, 2].map(() => `<g class="lm-pkt" style="opacity:0">${cube}</g>`).join("")}</g>`);
  return { svg: out.join(""), path };
}


// ---------- Cryptography: a padlock that only opens for its key ----------
function padlock() {
  const out = [];
  const B = { x: -34, y: -15, w: 68, d: 30, r: 7 }, BZ = 2.2, BT = 52, BF = B.y + B.d;
  const LEG = 19, LR = 4.4, HOLE = 5.8, TOP = BT + 36, LIFT = 12;
  out.push(S(k.slabOf(k.insetPlan(B, -3), 0, BZ, P, 8, 0.6), { tone: "lo" }));
  // A laminated body: thin steel plates, one seam per plate.
  const seams = []; for (let z = BZ + 4; z < BT - 2; z += 4) seams.push(k.sideSeam(B, z, P, 8));
  out.push(S(k.slabOf(B, BZ, BT - BZ, P, 8, 1.2), { tone: "hi", inner: L(seams.join(""), { tone: "faint" }) }));
  for (const x of [-LEG, LEG]) { out.push(`<path class="lm-void" d="${k.ring(x, 0, HOLE, BT, P, 32)}"/>`); out.push(L(k.ring(x, 0, HOLE + 1.4, BT, P, 32), { tone: "lo" })); }
  out.push(D([[-4, 0], [4, 0]].map(([x, y]) => at([x, y, BT])), { size: 0.6, tone: "mid" }));
  // The shackle is one bent bar. Whatever is below the top plate is hidden by a clip that stays put while it lifts.
  const bar = G.fillet([[-LEG, 0, BT - 18], [-LEG, 0, TOP], [LEG, 0, TOP], [LEG, 0, BT - 5]], LEG, 14, { P, tube: LR });
  const below = (x) => {
    const ring = []; for (let i = 0; i < 64; i++) { const a = (i / 64) * Math.PI * 2; ring.push(at([x + LR * 1.03 * Math.cos(a), LR * 1.03 * Math.sin(a), BT])); }
    const left = ring.reduce((m, p, i) => (p[0] < ring[m][0] ? i : m), 0), right = ring.reduce((m, p, i) => (p[0] > ring[m][0] ? i : m), 0);
    const walk = (step) => { const o = []; for (let i = left; ; i = (i + step + 64) % 64) { o.push(ring[i]); if (i === right) break; } return o; };
    const a = walk(1), b = walk(-1), mean = (l) => l.reduce((s, p) => s + p[1], 0) / l.length;
    const lower = mean(a) > mean(b) ? a : b;
    return `M${lower.map((p) => p.map(n1).join(" ")).join("L")}L${n1(ring[right][0])} ${H + 80}L${n1(ring[left][0])} ${H + 80}Z`;
  };
  out.push(`<clipPath id="pl-clip"><path clip-rule="evenodd" d="M-80 -80H${W + 80}V${H + 80}H-80Z${below(-LEG)}${below(LEG)}"/></clipPath>`);
  out.push(`<g clip-path="url(#pl-clip)"><g data-part="shackle">${tubeOf(tubePieces(bar, LR, P, { maxLength: 14 }))}</g></g>`);
  // Keyhole on a round boss on the front: a round top for the blade, a slot below for its teeth.
  const KZ = 24, BOSS = G.frameAlong([0, BF, KZ - 2], [0, 1, 0]), FACE = BF + 1.4;
  out.push(S(G.disc(0, 1.4, 8.6, BOSS, P), { tone: "mid" }));
  out.push(L(G.circleOf(BOSS, 1.4, 6.8, P, 48), { tone: "lo" }));
  out.push(onFaceY(FACE, `<circle class="lm-void" cx="0" cy="${-KZ}" r="2.5"/><rect class="lm-void" x="-1.1" y="${-KZ}" width="2.2" height="7.4" rx="1"/>`));
  out.push(D([-6.2, 6.2].map((dx) => at([dx, FACE, KZ - 2])), { size: 0.55, tone: "mid" }));
  // The key: a bow and a cut blade, waiting on a little cradle in front of the lock.
  const KEY_TIP = 40, BLADE = 26, SHOULDER = KEY_TIP + BLADE, IN = SHOULDER - FACE - 0.4, BOW_R = 9.4;
  out.push(S(k.cylinder(0, SHOULDER + 1.4, 1.6, 0, KZ - BOW_R - 1.6, P, 16), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: -4.2, y: SHOULDER - 0.2, w: 8.4, d: 3.2, r: 1 }, KZ - BOW_R - 1.6, 1.6, P, 3, 0.4), { tone: "mid" }));
  const BOW = G.frameAlong([0, SHOULDER, KZ], [0, 1, 0]);
  const bow = S(G.ringBand(0, 2.6, 3.2, BOW_R, BOW, P), { tone: "hi", lit: true }) + `<path class="lm-see" d="${G.circleOf(BOW, 2.6, 3.2, P, 32)}"/>` + L(G.circleOf(BOW, 2.6, 7.2, P, 48), { tone: "lo" });
  // Rebuilt every frame while the key moves; only the part outside the lock is drawn.
  const blade = (tip) => {
    const from = Math.max(FACE, tip), end = tip + BLADE;
    if (end - from < 0.4) return "";
    let s = "";
    [[3, 3.4], [9, 2.2], [15, 3]].forEach(([dy, h]) => {
      const y0 = Math.max(from, tip + dy), y1 = tip + dy + 4;
      if (y1 - y0 > 0.3) s += S(k.slabOf({ x: -1.1, y: y0, w: 2.2, d: y1 - y0, r: 0.4 }, KZ - 2.2 - h, h, P, 2), { tone: "hi", lit: true });
    });
    return s + S(k.slabOf({ x: -1.3, y: from, w: 2.6, d: end - from, r: 0.5 }, KZ - 2.2, 4.4, P, 2, 0.3), { tone: "hi", lit: true });
  };
  out.push(`<g data-part="blade">${blade(KEY_TIP)}</g><g data-part="bow">${bow}</g>`);
  return out.join("");
}

// ---------- CompTIA A+: an open PC tower, one memory stick being pressed into place ----------
// Drawn for the Tracks page after the six mockup covers, with the same kit, plate and camera. The near side (x = CX)
// is open. The camera looks down at 30°, so the lid hides the top of the inside and the front panel hides its front:
// the parts sit low and toward the back, where the opening shows them. They are drawn back to front, then the lid and
// the front panel over them.
function pcTower() {
  const out = [];
  const CA = { x: -40, y: -46, w: 40, d: 92, r: 3 }, FZ = 3, TOP = 92, WALL = 2.4;
  const CX = CA.x + CA.w, CF = CA.y + CA.d, IN = CA.x + WALL, BACK = CA.y + WALL, FRONT = CF - WALL, FLOOR_Z = FZ + WALL;
  // Feet, then the far wall, the back wall and the floor of the case.
  for (const [x, y] of byDepth(k.corners(CA, 7))) out.push(S(k.cylinder(x, y, 3, 0, FZ, P, 18), { tone: "lo" }));
  out.push(S(k.slabOf({ x: CA.x, y: CA.y, w: WALL, d: CA.d - WALL, r: 0.6 }, FZ, TOP - FZ, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: IN, y: CA.y, w: CA.w - WALL, d: WALL, r: 0.6 }, FZ, TOP - FZ, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: IN, y: BACK, w: CA.w - WALL, d: FRONT - BACK, r: 0.6 }, FZ, WALL, P, 2), { tone: "mid" }));
  // The power supply at the bottom of the back, its vents toward the opening.
  const PSU = { x: IN, y: BACK, w: 30, d: 30, r: 1.2 };
  out.push(S(k.slabOf(PSU, FLOOR_Z, 18, P, 3, 0.4), { tone: "mid" }));
  let vents = "";
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) vents += `<circle class="lm-dotc" cx="${n1(-(PSU.y + 5 + c * 4))}" cy="${n1(-(FLOOR_Z + 5 + r * 4))}" r="0.9"/>`;
  out.push(onFaceX(PSU.x + PSU.w, vents));
  // The motherboard on the far wall, above the power supply, with one long expansion slot.
  const MB = { x: IN, y: BACK + 1, w: 1.4, d: 66, r: 0.4 }, ON = MB.x + MB.w;
  out.push(S(k.slabOf(MB, 24, 62, P, 2), { tone: "lo", crease: "none" }));
  out.push(S(k.slabOf({ x: ON, y: BACK + 6, w: 2, d: 34, r: 0.4 }, 28, 2.6, P, 2), { tone: "mid", crease: "none" }));
  // The processor's cooler: a finned block standing off the board, its fan facing the opening.
  const HS = { x: ON, y: BACK + 2, w: 15, d: 18, r: 1 }, HZ = 44, HH = 18;
  out.push(S(k.slabOf(HS, HZ, HH, P, 3, 0.4), { tone: "hi", inner: L([48, 52, 56, 60].map((z) => k.sideSeam(HS, z, P, 3)).join(""), { tone: "faint" }) }));
  const fy = HS.y + HS.d / 2, fz = HZ + HH / 2;
  out.push(onFaceX(HS.x + HS.w, `<circle class="lm-void" cx="${n1(-fy)}" cy="${-fz}" r="7.4"/>` + [0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * Math.PI * 2; return `<path class="lm-slot" d="M${n1(-fy)} ${-fz}L${n1(-fy + 6.4 * Math.cos(a))} ${n1(-fz + 6.4 * Math.sin(a))}"/>`; }).join("") + `<circle class="lm-dotc" cx="${n1(-fy)}" cy="${-fz}" r="1.6"/>`));
  // Two memory slots in front of the cooler. The far stick is seated; the near one, lit, is on its way in.
  const RZ = 36, RH = 30;
  const slot = (y) => S(k.slabOf({ x: ON, y, w: 2.6, d: 3.2, r: 0.4 }, RZ - 2, RH + 4, P, 2), { tone: "lo", crease: "none" });
  const stick = (y, gap, lit) => {
    const s = { x: ON + 0.6 + gap, y: y + 0.7, w: 11, d: 1.8, r: 0.3 };
    const chips = [0, 1, 2, 3].map((i) => rect("lm-inlay", s.x + 2.4, RZ + 3 + i * 7.4, 6, 5, 0.6)).join("");
    return S(k.slabOf(s, RZ, RH, P, 2), { tone: "hi", lit, crease: "none" }) + onFaceY(s.y + s.d, chips);
  };
  out.push(slot(-20), stick(-20, 0, false), slot(-8), stick(-8, 5, true));
  // A drive on the floor, in front of the power supply.
  const SSD = { x: IN + 10, y: -12, w: 22, d: 26, r: 1 };
  out.push(S(k.slabOf(SSD, FLOOR_Z, 4.2, P, 3, 0.4), { tone: "hi" }));
  out.push(L(k.planOutline(k.insetPlan(SSD, 3), FLOOR_Z + 4.2, P, 3), { tone: "lo" }));
  // The lid with its vents, then the front panel: a drive bay, the power button and its light, two ports, an intake.
  out.push(S(k.slabOf({ x: CA.x, y: CA.y, w: CA.w, d: CA.d - WALL, r: 0.8 }, TOP, WALL, P, 3, 0.4), { tone: "hi" }));
  out.push(D(k.dotGrid(CA.x + 8, CA.y + 16, 6, 12, 5, TOP + WALL, P), { size: 0.6, tone: "lo" }));
  out.push(S(k.slabOf({ x: CA.x, y: FRONT, w: CA.w, d: WALL, r: 0.6 }, FZ, TOP + WALL - FZ, P, 2, 0.4), { tone: "hi" }));
  const mid = CA.x + CA.w / 2;
  out.push(onFaceY(CF, rect("lm-inlay", CA.x + 6, TOP - 24, CA.w - 12, 14, 2) + rect("lm-slot", CA.x + 9, TOP - 17, CA.w - 18, 1.4, 0.6)
    + `<circle class="lm-void" cx="${n1(mid)}" cy="${-(TOP - 38)}" r="3.4"/>`
    + rect("lm-void", mid - 8, TOP - 54, 5, 2.2, 0.5) + rect("lm-void", mid + 3, TOP - 54, 5, 2.2, 0.5)
    + rect("lm-void", CA.x + 8, 12, CA.w - 16, 2.4, 1) + rect("lm-void", CA.x + 8, 17, CA.w - 16, 2.4, 1)));
  out.push(`<g class="lm-leds">${dot(at([mid, CF, TOP - 45]), "lm-led on", "", 1.3)}</g>`);
  // On the plate in front of the open side: a screwdriver and the two screws that held the side on.
  const SD = { x: 34, y: 30, w: 20, d: 7, r: 3.2 };
  out.push(S(k.slabOf(SD, 0, 7, P, 6, 1), { tone: "mid", inner: L([1.8, 3.5, 5.2].map((dy) => k.lineOnTop([SD.x + 4, SD.y + dy], [SD.x + SD.w - 4, SD.y + dy], 7, P)).join(""), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: SD.x + SD.w, y: SD.y + 2.6, w: 26, d: 1.8, r: 0.6 }, 2.6, 1.8, P, 2), { tone: "hi", crease: "none" }));
  for (const [x, y] of byDepth([[86, 10], [95, 17]])) {
    out.push(S(k.cylinder(x, y, 2.4, 0, 1.6, P, 18), { tone: "hi" }));
    out.push(L(k.lineOnTop([x - 1.4, y], [x + 1.4, y], 1.6, P) + k.lineOnTop([x, y - 1.4], [x, y + 1.4], 1.6, P), { tone: "lo" }));
  }
  return out.join("");
}

// ---------- The covers ----------
export const COVER_IDS = ['networking', 'web', 'crypto', 'ai', 'privesc', 'tvm', 'aplus'] as const;
export type CoverId = (typeof COVER_IDS)[number];

const frame = (id: string, label: string, body: string, aria: string): string => {
  const plate = base(label);
  return k.figureSvg({ width: W, height: H, label: aria, body: `${plate.under}<g>${plate.over}${body}</g>`, className: `lm-svg lm-${id}` });
};

/** What each cover shows, in words: the figure's own label, and the description a page can give it elsewhere. */
const DESCRIBE: Record<CoverId, string> = {
  networking: "A home router on a plate, with two antennas and a row of lights. A cable runs across the plate from a modem into the router's first port.",
  web: "A laptop on a plate, its screen showing an empty browser window. A small track with one bend runs from the laptop to a server cabinet at the back, and a shuttle waits at the laptop's end.",
  crypto: 'A padlock made of stacked steel plates, its shackle closed. Its key waits on a small stand in front of the keyhole.',
  ai: 'A boxy machine with a grid of lights on top and three dials on the front. A belt carries a card into its left side, and another belt leads out of its right side to two trays, one marked with a circle and one with a triangle.',
  privesc: 'A three-storey building with a lift on its front and an alarm light on the roof. In front stands a badge reader with a light for each floor, and a level 1 badge waits in its holder.',
  tvm: 'A wall of fifteen panels, three of them cracked. A scanner head hangs from a rail along the top of the wall, and a console in front lists what it finds.',
  aplus: 'An open PC tower on a plate, its side taken off. Inside are a fan, a drive and two memory sticks, one of them lit as it is pressed into place. A screwdriver lies in front.',
};

const DRAW: Record<CoverId, () => string> = {
  networking: () => frame('router', 'LAN · 192.168.1.1', router().svg, DESCRIBE.networking),
  web: () => frame('web', 'HTTP · GET / · 200', web().svg, DESCRIBE.web),
  crypto: () => frame('lock', 'KEY 0x2F · 128-BIT', padlock(), DESCRIBE.crypto),
  ai: () => frame('ai', 'MODEL · 16 WEIGHTS', sorter(), DESCRIBE.ai),
  privesc: () => frame('lift', 'ACCESS · LEVEL 1', lift(), DESCRIBE.privesc),
  tvm: () => frame('scan', 'SCAN · 15 PANELS', scanner(), DESCRIBE.tvm),
  aplus: () => frame('pc', 'RAM · 2 × 8 GB', pcTower(), DESCRIBE.aplus),
};

/** A cover's description in words, the same as its figure's label. */
export const coverDescription = (id: CoverId): string => DESCRIBE[id];

/** The cover as drawn in the mockup, with its `data-part` hooks, so a page can animate it. */
export const cover = (id: CoverId): string => DRAW[id]();

/** A still copy of a cover: no hooks, and every id tagged so two copies on a page never share one. */
export const coverStill = (id: CoverId, tag: string): string => scopeIds(cover(id), tag);

/** The web cover's body and the shuttle's path on screen (in the cover's own frame); the home hero rides it. */
export const webDrawing = (): { svg: string; path: number[][] } => web();

/** The router cover's body and the packets' path on screen (in the cover's own frame); the track page sends them along it. */
export const routerDrawing = (): { svg: string; path: number[][] } => router();
