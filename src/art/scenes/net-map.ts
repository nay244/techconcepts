// @ts-nocheck -- ported drawing code; the checksum test in net-map.test.ts pins its output, so it is not re-typed line by line.
// How the Internet Works' network map: your home on the left (the laptop and its router), the internet in the middle
// (five routers joined by cables), the DNS resolver behind it with its card-index drawer, and on the right the servers
// each protocol talks to. Ported from the approved mockup's FIGS/net-map.mjs (internet-v2.html); the drawing is
// identical. The mockup swaps one protocol's servers into the map as the learner moves; this map draws every
// protocol's servers at once (net-map-layers.ts), each in hidden `<g data-layer="<protocol>:<site>">` groups, and the
// driver (src/scenes/drivers/net-map.ts) shows the ones a unit names, rides the tags along the cables and lights
// the parts. Its ids carry an `nm-` prefix, so they stay unique on the page.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import { NAME_SERVER_SITES, NET_MAP_BASE_PLACES, NET_MAP_LAPTOP_ADDR, NET_MAP_LAYERS, NET_MAP_TAG_MAX } from './net-map-layers';
import './net-map.css';

/** What the driver reads: the figure's camera, where the broadcast ring spreads, and every route along the cables. */
export interface NetMapData {
  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
  M: number[];
  /** Where the plate's origin is on screen. A tag is drawn there and moved from it; trails and lines are drawn in the figure's own frame. */
  O: [number, number];
  /** The height of the cables' tops: trails and lit connections are drawn along the cables at this height. */
  TZ: number;
  /** The broadcast ring: the home plate's middle on screen, the origin it is drawn at, and its radius before it spreads. */
  ring: { at: [number, number]; o: [number, number]; r: number };
  /**
   * Each trip a message can make, keyed `<from>><to>`, as points (x, y, z) on the plates: along the cables, climbing
   * over each router it passes. Every ordered pair of places a protocol uses has one.
   */
  routes: Record<string, [number, number, number][]>;
}

const PLATE_H = 7, FOOT_H = 3, FLOOR = -PLATE_H - FOOT_H;
const IP = { x: -52, y: -44, w: 104, d: 88, r: 9 };
const HP = { x: -134, y: 57, w: 84, d: 70, r: 8 };
const RP = { x: -118, y: -114, w: 64, d: 54, r: 7 };
// Places for the servers on the right: E for one big plate, NE and SE for two smaller ones.
const SLOT = { E: { x: 50, y: -127, w: 84, d: 70, r: 8 }, NE: { x: -30, y: -200, w: 64, d: 54, r: 7 }, SE: { x: 140, y: -26, w: 64, d: 54, r: 7 } };
const LB = { x: -127, y: 88, w: 46, d: 30, r: 3.5 }, LZ = 3.2, LID_H = 31;
const HR = { x: -90, y: 62, w: 32, d: 18, r: 3 }, RZ = 2, RT = RZ + 9;
const PUCK_R = 7, PUCK_H = 4.6;
const N = { isp: [-30, 26], a: [-28, -20], b: [6, 4], c: [32, -24], d: [28, 26] };
const LINKS = [["isp", "a"], ["isp", "b"], ["isp", "d"], ["a", "b"], ["b", "c"], ["b", "d"], ["c", "d"]];
const CB = { x: -104, y: -106, w: 34, d: 26, r: 2 }, CB_H = 28, DRAWERS = [2.4, 10.4, 18.4], DRW_H = 6.8, DRW_OUT = 11;

// One camera for every scene, the same scale as the DHCP lesson.
const P = k.fitProjection(k.boxCorners({ x: -112, y: -80, w: 224, d: 160 }, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
const V = G.viewOf(P);
const at = (p) => k.iso(p, P);
const depth = (p) => k.depthOf(p, P);
const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
const tubeOf = (pieces, tone = "hi") => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone })).join("");
const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"${extra}/>`;
const rel = (p, o) => ({ ...o, x: p.x + o.x, y: p.y + o.y });

// ---------- Plates ----------
function plate(p, label) {
  const under = `<path class="iso-halo" d="${k.haloOf(p, FLOOR, PLATE_H, P)}"/>`;
  const over = [];
  for (const [x, y] of byDepth(k.corners(p, 13))) {
    over.push(S(k.cylinder(x, y, 4.8, FLOOR, 1.2, P, 24), { tone: "lo" }));
    over.push(S(k.cylinder(x, y, 3.6, FLOOR + 1.2, FOOT_H - 1.2, P, 24), { tone: "mid" }));
  }
  over.push(S(k.slabOf(p, -PLATE_H, PLATE_H, P, 8, 1.2), { tone: "mid", inner: L(k.sideSeam(p, -PLATE_H + 2, P, 8), { tone: "faint" }) }));
  over.push(L(k.planOutline(k.insetPlan(p, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(p, 9);
  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 18)).join(""), { tone: "lo" }));
  over.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.6, tone: "mid" }));
  over.push(k.faceTextSvg(k.sideMatrix([p.x + p.w - 12, p.y + p.d], -4.4, P, "left"), label, { size: 3.4, tone: "mid", anchor: "end" }));
  return { under, over: over.join("") };
}

// ---------- Home: the laptop and its router ----------
function laptop(id, bar) {
  const out = [];
  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
  const keysX = 9, keysY = 3, pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 6 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  out.push(L(k.planOutline({ x: LB.x + LB.w / 2 - 8, y: LB.y + 8 + keysY * pitch, w: 16, d: LB.d - 12 - keysY * pitch, r: 1.2 }, LZ, P, 3), { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.6, r: 1 };
  out.push(S(k.slabOf(LID, LZ, LID_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = LID.x + 3, w = LID.w - 6, z0 = LZ + 3, h = LID_H - 6, bh = 4.4, g = 1.4;
  let scr = rect("lm-void", x0, z0, w, h, 0.8) + rect("nm-glow", x0, z0, w, h, 0.8, ` id="${id}-busy-laptop"`);
  scr += rect("lm-slot", x0 + g, z0 + h - bh + 0.4, w - 2 * g, bh - 1.4, 0.8) + `<text class="nm-url" id="${id}-url" x="${n1(x0 + g + 2)}" y="${n1(-(z0 + h - bh + 1.3))}">${bar}</text>`;
  // The page, in two parts: its text arrives first, its picture after.
  const top = z0 + h - bh - g, px = (u, z, ww, hh, part, cls = "") => rect("nm-px" + (cls ? " " + cls : ""), u, z, ww, hh, 0.5, ` data-part="${part}"`);
  let page = rect("nm-page-bg", x0 + g, z0 + g, w - 2 * g, h - bh - g, 0.6, ' data-part="text"');
  page += px(x0 + g + 1, top - 4.6, 24, 3, "text") + px(x0 + g + 1, top - 8, 17, 1.3, "text", "soft");
  for (let i = 0; i < 4; i++) page += px(x0 + g + 16, top - 12 - i * 3.3, w - 2 * g - 18 - (i === 3 ? 6 : 0), 1.3, "text", "soft");
  page += px(x0 + g + 1, z0 + g + 1, 13, top - 10.6 - z0 - g - 1, "pic");
  scr += `<g id="${id}-page">${page}</g>`;
  const lx = x0 + w - g - 4.4, lz = z0 + h - bh + 0.7;
  scr += `<g class="nm-hold" id="${id}-hold-lock">${rect("nm-lock", lx, lz, 2.8, 1.7, 0.3)}<path class="nm-lock-arc" d="M${n1(lx + 0.6)} ${n1(-(lz + 1.7))}v-0.5a0.8 0.8 0 0 1 1.6 0v0.5"/></g>`;
  out.push(onFaceY(LID.y + LID.d, scr));
  return out.join("");
}
function homeRouter(id) {
  const out = [], R = HR, RF = R.y + R.d;
  for (const [x, y] of byDepth(k.corners(R, 5))) out.push(S(k.cylinder(x, y, 2, 0, RZ, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(R, RZ + 3, P, 5), { tone: "faint" }) }));
  out.push(`<g class="nm-busy" id="${id}-busy-router">${S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", lit: true })}</g>`);
  for (let i = 0; i < 4; i++) out.push(L(k.planOutline({ x: R.x + 8 + i * 6, y: R.y + 5, w: 2.4, d: R.d - 10, r: 1.2 }, RT, P, 3), { tone: "lo" }));
  for (const [x, y] of byDepth([[R.x + 5, R.y + 4], [R.x + R.w - 5, R.y + 4]])) {
    out.push(S(k.cylinder(x, y, 2, RT, 2.2, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 1.3, RT + 2.2, 20, P, 16), { tone: "hi", crease: "none" }));
  }
  out.push(`<g class="lm-leds">${[0, 1, 2, 3].map((i) => dot(at([R.x + 7 + i * 5.6, RF, RZ + 4.6]), "lm-led" + (i === 0 ? " on" : ""), 1.1, ` id="${id}-home-led-${i}"`)).join("")}</g>`);
  return out.join("");
}

// ---------- The internet: routers that pass messages along ----------
function puck([x, y], name) {
  const out = [];
  out.push(S(k.cylinder(x, y, PUCK_R + 1, 0, 1.1, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, PUCK_R, 1.1, PUCK_H - 1.1, P, 32, 0.5), { tone: "hi" }));
  out.push(`<g class="nm-busy" id="${ID}-busy-${name}">${S(k.cylinder(x, y, PUCK_R, 1.1, PUCK_H - 1.1, P, 32, 0.5), { tone: "hi", lit: true })}</g>`);
  const a = 4.8, hd = 1.6, arrows = [];
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const tip = [x + dx * a, y + dy * a], base = [x + dx * 1.4, y + dy * 1.4], px = -dy, py = dx;
    arrows.push(k.lineOnTop(base, tip, PUCK_H, P));
    arrows.push(k.lineOnTop(tip, [tip[0] - dx * hd + px * hd, tip[1] - dy * hd + py * hd], PUCK_H, P), k.lineOnTop(tip, [tip[0] - dx * hd - px * hd, tip[1] - dy * hd - py * hd], PUCK_H, P));
  }
  out.push(L(arrows.join(""), { tone: "mid" }));
  out.push(`<g class="lm-leds">${dot(at([x + PUCK_R * Math.SQRT1_2, y + PUCK_R * Math.SQRT1_2, 2.6]), "lm-led", 1)}</g>`);
  return out.join("");
}

// ---------- The DNS resolver: a card index of names and their numbers ----------
function cabinet(id) {
  const out = [], F = CB.y + CB.d;
  out.push(S(k.slabOf({ x: CB.x - 2, y: CB.y - 2, w: CB.w + 4, d: CB.d + 4, r: 2.4 }, 0, 1.6, P, 3, 0.4), { tone: "lo" }));
  out.push(S(k.slabOf(CB, 1.6, CB_H - 1.6, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(CB, CB_H - 3, P, 3), { tone: "faint" }) }));
  const front = (z) => rect("lm-inlay", CB.x + 3, z, CB.w - 6, DRW_H, 0.8) + rect("lm-slot", CB.x + CB.w / 2 - 4, z + 1.4, 8, 1.6, 0.8) + rect("lm-slot", CB.x + 6, z + 4, 6, 1.6, 0.4);
  out.push(onFaceY(F, DRAWERS.map(front).join("")));
  out.push(L([0, 1, 2].map((i) => k.lineOnTop([CB.x + 6, CB.y + 7 + i * 4], [CB.x + CB.w - 8 - i * 5, CB.y + 7 + i * 4], CB_H, P)).join(""), { tone: "lo" }));
  // While it looks a name up: the top drawer out, the card standing up, the lamp on.
  const z = DRAWERS[2], OUT = { x: CB.x + 3, y: F, w: CB.w - 6, d: DRW_OUT, r: 0.6 };
  let open = S(k.slabOf(OUT, z, DRW_H, P, 3, 0.4), { tone: "hi" });
  open += onFaceY(F + DRW_OUT, rect("lm-slot", CB.x + CB.w / 2 - 4, z + 1.4, 8, 1.6, 0.8) + rect("lm-slot", CB.x + 6, z + 4, 6, 1.6, 0.4));
  const CARD = { x: CB.x + 9, y: F + 4, w: 15, d: 1.2, r: 0.3 };
  open += S(k.slabOf(CARD, z + DRW_H, 8, P, 2, 0.2), { tone: "hi", lit: true });
  open += onFaceY(CARD.y + CARD.d, rect("lm-slot lm-on-lit", CARD.x + 2, z + DRW_H + 4.6, 9, 1.2, 0.4) + rect("lm-slot lm-on-lit", CARD.x + 2, z + DRW_H + 2, 11, 1.2, 0.4));
  open += `<g class="lm-leds">${dot(at([CB.x + CB.w, CB.y + 6, CB_H - 5]), "lm-led on", 1.1)}</g>`;
  out.push(`<g class="nm-busy" id="${id}-busy-resolver">${open}</g>`);
  return out.join("");
}

// ---------- Servers ----------
function rack(R, i) {
  const out = [], F = R.y + R.d;
  out.push(S(k.slabOf(R, 0, R.h, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(R, 3, P, 3), { tone: "faint" }) }));
  let face = "";
  const bays = Math.floor((R.h - 8) / 7);
  for (let b = 0; b < bays; b++) {
    const z = R.h - 5 - (b + 1) * 7 + 1.4;
    face += rect("lm-slot", R.x + 3, z, R.w - 6, 5, 0.6) + `<circle class="lm-led${(b + i) % 3 === 0 ? " on" : ""}" cx="${n1(R.x + R.w - 5.4)}" cy="${n1(-(z + 2.5))}" r="1"/>`;
  }
  out.push(onFaceY(F, face));
  let vents = "";
  for (let v = 0; v < 4; v++) vents += k.lineOnTop([R.x + 5, R.y + 6 + v * 5], [R.x + R.w - 5, R.y + 6 + v * 5], R.h, P);
  out.push(L(vents, { tone: "lo" }));
  return out.join("");
}
// A name server: one slim tower, its name engraved low on the front, and a lit band near the top while it answers.
function tower(T, id, site, name) {
  const out = [S(k.slabOf(T, 0, T.h, P, 3, 0.5), { tone: "hi", inner: L(k.sideSeam(T, 3, P, 3), { tone: "faint" }) })];
  let face = rect("lm-slot", T.x + 2.5, T.h - 7, T.w - 5, 3, 0.6);
  for (let i = 0; i < Math.floor((T.h - 22) / 5); i++) face += rect("lm-slot", T.x + 2.5, T.h - 13 - i * 5, T.w - 5, 2, 0.4);
  face += `<g class="nm-busy" id="${id}-busy-${site}">${rect("nm-band", T.x + 2.5, T.h - 7, T.w - 5, 3, 0.6)}</g>`;
  out.push(onFaceY(T.y + T.d, face));
  out.push(k.faceTextSvg(k.sideMatrix([T.x + T.w / 2, T.y + T.d], 3.2, P, "left"), name, { size: 3.2, tone: "mid", anchor: "middle" }));
  return out.join("");
}
// A tray on a mail server, and the letter that waits on it.
function tray(T, id, site) {
  const out = [S(k.slabOf(T, 0, 2.4, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(T, 1, P, 3), { tone: "faint" }) })];
  out.push(`<g class="nm-busy" id="${id}-busy-${site}">${S(k.slabOf(T, 0, 2.4, P, 3, 0.4), { tone: "hi", lit: true })}</g>`);
  const E = { x: T.x + 4, y: T.y + 3, w: T.w - 8, d: T.d - 6, r: 0.6 };
  const flap = L(k.lineOnTop([E.x, E.y], [E.x + E.w / 2, E.y + E.d * 0.55], 3.6, P) + k.lineOnTop([E.x + E.w, E.y], [E.x + E.w / 2, E.y + E.d * 0.55], 3.6, P), { tone: "lo" });
  out.push(`<g class="nm-hold" id="${id}-hold-${site}">${S(k.slabOf(E, 2.4, 1.2, P, 2, 0.2), { tone: "hi", lit: true })}${flap}</g>`);
  return out.join("");
}

// ---------- Cables, and the routes along them ----------
const CABLE_R = 1, CABLE_Z = 1.3, TZ = CABLE_Z + CABLE_R, RIDE = 2.6, HOP = PUCK_H + 1.6;
const cable = (route) => tubeOf(tubePieces(route.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));
const LAP_OUT = [LB.x + LB.w + 2, LB.y + 18], HR_IN = [HR.x + 12, HR.y + HR.d + 2], HR_OUT = [HR.x + HR.w + 2, HR.y + 9];
const DNS_IN = [CB.x + CB.w + 3, CB.y + 18];
// Each place: where a message stops, the way from there to its first router, and which router that is.
const BASE_SITES = {
  laptop: { end: [LB.x + LB.w - 4, LB.y + 18, LZ + 1], leg: [[...LAP_OUT, RIDE], [...HR_IN, RIDE], [HR.x + HR.w / 2, HR.y + HR.d / 2, RT + 3], [...HR_OUT, RIDE]], puck: "isp" },
  router: { end: [HR.x + HR.w / 2, HR.y + HR.d / 2, RT + 3], leg: [[...HR_OUT, RIDE]], puck: "isp" },
  resolver: { end: [CB.x + CB.w - 2, CB.y + 18, 4], leg: [[...DNS_IN, RIDE]], puck: "a" },
  // The routers themselves, by their names in N: a message can stop on top of one (traceroute, NAT).
  ...Object.fromEntries(Object.keys(N).map((n) => [n, { puck: n, router: true }])),
};
// The shortest way between two routers on the internet plate.
function hops(a, b) {
  const prev = { [a]: null }, q = [a];
  while (q.length) { const n = q.shift(); if (n === b) break; for (const [x, y] of LINKS) for (const [u, v] of [[x, y], [y, x]]) if (u === n && !(v in prev)) { prev[v] = n; q.push(v); } }
  const path = []; for (let n = b; n; n = prev[n]) path.unshift(n);
  return path;
}
function ride(stops) {
  const pts = [], node = (s) => (typeof s === "string" ? N[s] : s);
  stops.forEach((s, i) => {
    const p = node(s);
    if (typeof s !== "string") return pts.push([p[0], p[1], p[2] ?? RIDE]);
    const near = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [p[0] + (dx / l) * (PUCK_R + 3), p[1] + (dy / l) * (PUCK_R + 3), RIDE]; };
    if (i > 0) pts.push(near(node(stops[i - 1])));
    pts.push([p[0], p[1], HOP]);
    if (i < stops.length - 1) pts.push(near(node(stops[i + 1])));
  });
  return pts;
}
// From one place to another along the cables, hopping over every router between. The home router is a place too:
// messages to it from the laptop stay at home.
function route(sites, from, to) {
  const A = sites[from], B = sites[to];
  if (!A || !B) throw new Error(`no route ${from} → ${to}`);
  let pts;
  if ((from === "laptop" && to === "router") || (from === "router" && to === "laptop")) {
    const L0 = BASE_SITES.laptop, out = [L0.end, ...L0.leg.slice(0, 3)];
    pts = from === "laptop" ? out : [...out].reverse();
  } else {
    const mid = A.puck === B.puck ? [A.puck] : hops(A.puck, B.puck);
    const head = A.router ? [] : [A.end, ...A.leg], tail = B.router ? [] : [...[...B.leg].reverse(), B.end];
    pts = ride([...head, ...mid, ...tail]);
  }
  return pts.map((q) => q.map((v) => +v.toFixed(2)));
}

// ---------- The kinds of server plate ----------
// Each returns its objects, its cables, its places (for routes) and its callout. A server's callout sits under the
// right-hand plate unless the plate puts it somewhere else.
const SERVER_AT = [396, 234];
const callTo = (o, anchor, lines) => ({ anchor, at: o.at || SERVER_AT, align: o.align, lines: lines || o.lines });
const KINDS = {
  // A web server: two racks at the back, the page on its dock.
  web(p, id, o) {
    const racks = [rel(p, { x: 8, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: 36, y: 4, w: 28, d: 30, r: 2, h: 50 })];
    const DK = rel(p, { x: 16, y: 41, w: 46, d: 14, r: 2 }), PG = { x: DK.x + 3, y: DK.y + 3, w: DK.w - 6, d: DK.d - 6, r: 1 }, IN = [DK.x - 3, DK.y + DK.d / 2];
    let dock = S(k.slabOf(DK, 0, 3, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(DK, 1.2, P, 3), { tone: "faint" }) });
    dock += S(k.slabOf(PG, 3, 2, P, 3, 0.4), { tone: "hi" }) + L([0, 1, 2].map((i) => k.lineOnTop([PG.x + 4, PG.y + 2.4 + i * 2.4], [PG.x + PG.w - 6 - i * 6, PG.y + 2.4 + i * 2.4], 5, P)).join(""), { tone: "lo" });
    dock += `<g class="nm-busy" id="${id}-busy-${o.site}">${S(k.slabOf(PG, 3, 2, P, 3, 0.4), { tone: "hi", lit: true })}</g>`;
    return {
      things: [...racks.map((R, i) => ({ xy: [R.x + R.w / 2, R.y + R.d / 2], svg: rack(R, i) })), { xy: [DK.x + DK.w / 2, DK.y + DK.d / 2], svg: dock }],
      cables: [[N.c, IN]],
      sites: { [o.site]: { end: [DK.x + 8, DK.y + DK.d / 2, 3.4], leg: [[...IN, RIDE]], puck: "c" } },
      callouts: [callTo(o, [DK.x + DK.w, DK.y + DK.d, 3])],
      tall: [[racks[1].x, racks[1].y, racks[1].h]],
    };
  },
  // The name servers DNS asks in turn: the root, the servers for .app, and the site's own.
  names(p, id, o) {
    const T = [{ x: 6, h: 44, name: "ROOT" }, { x: 34, h: 34, name: ".APP" }, { x: 62, h: 26, name: "NS1" }]
      .map((t, i) => ({ ...rel(p, { x: t.x, y: 28, w: 14, d: 14, r: 1.4 }), h: t.h, site: NAME_SERVER_SITES[i], name: t.name }));
    const J = [p.x + 10, p.y + p.d - 10], IN = [p.x + 13, p.y + p.d + 3];
    const sites = {};
    for (const t of T) { const f = [t.x + t.w / 2, t.y + t.d + 3]; sites[t.site] = { end: [f[0], t.y + t.d + 0.5, 3], leg: [[...f, RIDE], [...J, RIDE], [...IN, RIDE]], puck: "c" }; }
    return {
      things: T.map((t) => ({ xy: [t.x + t.w / 2, t.y + t.d / 2], svg: tower(t, id, t.site, t.name) })),
      cables: [[N.c, IN, J], ...T.map((t) => [J, [t.x + t.w / 2, t.y + t.d + 3], [t.x + t.w / 2, t.y + t.d + 0.5]])],
      sites, callouts: [callTo(o, [p.x + p.w - 10, p.y + p.d, 0])], tall: [[T[0].x, T[0].y, T[0].h]],
    };
  },
  // A mail server: a rack at the back, and the tray at the front where letters wait.
  mail(p, id, o) {
    const R = rel(p, { x: p.w - 30, y: 6, w: 22, d: 22, r: 2, h: 34 }), TR = rel(p, { x: 14, y: p.d - 26, w: 24, d: 16, r: 1.6 });
    const F = [TR.x + TR.w / 2, TR.y + TR.d + 2], IN = [F[0], p.y + p.d + 3];
    return {
      things: [{ xy: [R.x + R.w / 2, R.y + R.d / 2], svg: rack(R, 1) }, { xy: [TR.x + TR.w / 2, TR.y + TR.d / 2], svg: tray(TR, id, o.site) }],
      cables: [[N[o.puck], IN, F]],
      sites: { [o.site]: { end: [TR.x + TR.w / 2, TR.y + TR.d / 2, 3], leg: [[...F, RIDE], [...IN, RIDE]], puck: o.puck } },
      callouts: [callTo(o, o.anchorTop ? [R.x + R.w, R.y, R.h] : [p.x + p.w - 8, p.y + p.d, 0])],
      tall: [[R.x, R.y, R.h]],
    };
  },
  // Any other server: two racks, and a pad at the front that lights while it works.
  host(p, id, o) {
    const racks = [rel(p, { x: p.w - 58, y: 6, w: 24, d: 26, r: 2, h: 40 }), rel(p, { x: p.w - 30, y: 4, w: 24, d: 30, r: 2, h: 46 })];
    const PD = rel(p, { x: 14, y: p.d - 24, w: 22, d: 14, r: 2 }), F = [PD.x + PD.w / 2, PD.y + PD.d + 2], IN = [F[0], p.y + p.d + 3];
    let pad = S(k.slabOf(PD, 0, 2.4, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(PD, 1, P, 3), { tone: "faint" }) });
    pad += `<g class="nm-busy" id="${id}-busy-${o.site}">${S(k.slabOf(PD, 0, 2.4, P, 3, 0.4), { tone: "hi", lit: true })}</g>`;
    return {
      things: [...racks.map((R, i) => ({ xy: [R.x + R.w / 2, R.y + R.d / 2], svg: rack(R, i) })), { xy: [PD.x + PD.w / 2, PD.y + PD.d / 2], svg: pad }],
      cables: [[N.c, IN, F]],
      sites: { [o.site]: { end: [PD.x + PD.w / 2, PD.y + PD.d / 2, 3], leg: [[...F, RIDE], [...IN, RIDE]], puck: "c" } },
      callouts: [callTo(o, [p.x + p.w - 8, p.y + p.d, 0])],
      tall: [[racks[1].x, racks[1].y, racks[1].h]],
    };
  },
};

// ---------- Callouts: few, short, outside the plates ----------
const TEXT_W = { "nm-name": 12 * 0.74, "nm-sub": 13 * 0.5, "nm-addr": 12.5 * 0.6, "nm-state": 13 * 0.52 };
function calloutSvg(c, boxes) {
  const [ax, ay] = at(c.anchor), [tx, ty] = c.at, align = c.align || "start", LH = 16;
  for (const [i, l] of c.lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * LH - 12, x0 + w, ty + i * LH + 4]); }
  const ex = tx + (align === "end" ? 7 : -7);
  const lead = `<path class="nm-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "nm-lead-dot", 2)}`;
  const text = c.lines.map((l, i) => `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * LH)}" text-anchor="${align}">${l.text}</text>`).join("");
  return `<g class="nm-call">${lead}${text}</g>`;
}

// ---------- Moving parts, drawn at the origin and moved by the driver ----------
const ID = "nm";
// A tag for a label of `n` characters, its words left for the driver: one for each length, as only one rides at a time.
function tag(n) {
  const w = n * 2.9 + 8, T = { x: -w / 2, y: -5, w, d: 10, r: 1.4 }, TH = 3.2;
  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="nm-tag-t" x="0" y="1.5" text-anchor="middle"></text>`);
}
// The carrier under the tag ("TCP"), on the floor just in front of it. A site addition: the mockup's tags carry none.
const OVER = `<g id="${ID}-over" style="opacity:0">${onTopAt(0, `<text class="nm-over-t" x="0" y="9" text-anchor="middle"></text>`)}</g>`;
// Where a lost message stops: a ring with a cross, and the word LOST on it (a site addition), so colour is never the only sign.
const DROP = `<g class="nm-drop" id="${ID}-drop" style="opacity:0"><circle r="7"/><path d="M-3.2 -3.2L3.2 3.2M3.2 -3.2L-3.2 3.2"/><rect class="nm-drop-pill" x="9" y="-5.5" width="27" height="11" rx="5.5"/><text class="nm-drop-t" x="22.5" y="2.8" text-anchor="middle">LOST</text></g>`;

// ---------- The parts every protocol shares: home, the internet, the resolver ----------
function buildBase() {
  const plates = [plate(RP, "RESOLVER · 192.0.2.53"), plate(HP, "YOUR HOME · 192.168.1.0/24"), plate(IP, "THE INTERNET")];
  const cables = [cable([LAP_OUT, HR_IN]), cable([HR_OUT, N.isp]), cable([N.a, DNS_IN]), ...LINKS.map(([a, b]) => cable([N[a], N[b]]))];
  const things = [
    { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop(ID, "") }, { xy: [HR.x + HR.w / 2, HR.y + HR.d / 2], svg: homeRouter(ID) },
    ...Object.entries(N).map(([n, xy]) => ({ xy, svg: puck(xy, n) })), { xy: [CB.x + CB.w / 2, CB.y + CB.d / 2], svg: cabinet(ID) },
  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  const pts = [RP, HP, IP].flatMap((p) => k.boxCorners(p, FLOOR, 0)).concat([[CB.x, CB.y, CB_H], [HR.x + 5, HR.y + 4, RT + 22]]).map(at);
  return {
    under: `<path class="lm-pool" d="${k.ring(-6, -10, 250, FLOOR, P, 120)}"/>` + plates.map((p) => p.under).join(""),
    plates: plates.map((p) => p.over).join(""), cables: cables.join(""), things: things.map((t) => t.svg).join(""), pts,
  };
}

// The callouts every protocol shares: the laptop's (its address and status line, which the driver writes), the
// resolver's and the internet's, and the home router's, hidden until a unit's labels give it its lines.
function baseCallouts() {
  return [
    { anchor: [LB.x + 2, LB.y + 1, LZ + LID_H - 2], at: [-64, 30], lines: [{ cls: "nm-name", text: "Your laptop" }, { cls: "nm-addr", text: NET_MAP_LAPTOP_ADDR, id: `${ID}-lapAddr` }, { cls: "nm-state", text: "", id: `${ID}-lapState` }] },
    { anchor: [CB.x + CB.w, CB.y, CB_H], at: [190, -30], align: "end", lines: [{ cls: "nm-name", text: "DNS resolver" }, { cls: "nm-sub", text: "turns names into numbers" }, { cls: "nm-addr", text: "192.0.2.53" }] },
    { anchor: [N.d[0] + 4, N.d[1] + PUCK_R, 1], at: [200, 232], align: "end", lines: [{ cls: "nm-name", text: "The internet" }, { cls: "nm-sub", text: "routers pass messages along" }] },
    { anchor: [HR.x + HR.w, HR.y + HR.d, RT], at: [-64, 262], lines: [{ cls: "nm-name", text: "Your router" }, { cls: "nm-addr", text: "", id: `${ID}-router-1` }, { cls: "nm-addr", text: "", id: `${ID}-router-2` }] },
  ];
}

// ---------- One server plate: its parts in each group, its places, and the points the frame must hold ----------
function serverLayer(key, s) {
  const protocol = key.split(":")[0];
  const p = SLOT[s.slot], part = KINDS[s.kind](p, `${ID}-${protocol}`, s), pl = plate(p, s.label);
  const things = [...part.things].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  const boxes = [], calls = part.callouts.map((c) => calloutSvg(c, boxes)).join("");
  const pts = [...part.tall, ...k.boxCorners(p, FLOOR, 0)].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  return {
    key, protocol, sites: part.sites, pts,
    parts: { under: pl.under, plates: pl.over, cables: part.cables.map((c) => cable(c)).join(""), things: things.map((t) => t.svg).join(""), calls },
  };
}

const ARIA = "A network map. On the left, your home: a laptop and its router. In the middle, the internet: five routers joined by cables. Behind it, the DNS resolver, a card-index cabinet. On the right, the servers this protocol talks to.";
const RING_R = 10, RING_AT = at([HP.x + HP.w / 2, HP.y + HP.d / 2, 0]);

function mapSvg() {
  const base = buildBase();
  const layers = Object.entries(NET_MAP_LAYERS).map(([key, s]) => serverLayer(key, s));
  const boxes = [], calls = baseCallouts().map((c) => calloutSvg(c, boxes));
  const shared = `${calls.slice(0, 3).join("")}<g id="${ID}-router" display="none">${calls[3]}</g>`;
  // One frame for every protocol, so the map never jumps in size between them: everything any of them shows.
  const pts = [...base.pts, ...boxes.flatMap(([x0, y0, x1, y1]) => [[x0, y0], [x1, y1]]), ...layers.flatMap((l) => l.pts), ...[SLOT.E, SLOT.SE].flatMap((p) => k.boxCorners(p, FLOOR, 0)).map(at)];
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]), PAD = 18;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  const slot = (name) => layers.map((l) => `<g data-layer="${l.key}" display="none">${l.parts[name]}</g>`).join("");
  const tags = Array.from({ length: NET_MAP_TAG_MAX }, (_, i) => `<g class="nm-tag" id="${ID}-tag-${i + 1}" style="opacity:0">${tag(i + 1)}</g>`).join("");
  const svg = `<svg data-figure="net-map" class="lm-svg nm" viewBox="${vb.join(" ")}" role="img" aria-label="${ARIA}">${base.under}<g id="${ID}-l-under">${slot("under")}</g>` +
    `<g class="lm-body"><g id="${ID}-l-plates">${slot("plates")}</g>${base.plates}<g id="${ID}-ring" style="opacity:0"><path class="nm-ring" d="${k.ring(0, 0, RING_R, 0, P, 72)}"/></g>${base.cables}<g id="${ID}-l-cables">${slot("cables")}</g><g id="${ID}-conns"></g>` +
    `<polyline class="nm-trail-edge" id="${ID}-trail-edge" points="" style="opacity:0"/><polyline class="nm-trail" id="${ID}-trail" points="" style="opacity:0"/>${base.things}<g id="${ID}-l-things">${slot("things")}</g><g id="${ID}-l-tags">${tags}${OVER}</g>${DROP}</g><g id="${ID}-l-calls">${shared}${slot("calls")}</g></svg>`;
  return { svg, layers };
}

// Every ordered pair of places each protocol uses: home, the internet, the resolver, and its own servers. A site
// drawn by several protocols (six draw the web server) stands in the same place in each, so one route serves them all.
function routesOf(layers) {
  const sites = { ...BASE_SITES };
  for (const l of layers) {
    for (const [name, site] of Object.entries(l.sites)) {
      if (name in sites && JSON.stringify(sites[name]) !== JSON.stringify(site)) throw new Error(`${l.key} puts "${name}" somewhere else.`);
      sites[name] = site;
    }
  }
  const routes = {}, byProtocol = new Map();
  for (const l of layers) byProtocol.set(l.protocol, [...(byProtocol.get(l.protocol) ?? []), ...Object.keys(l.sites)]);
  for (const own of byProtocol.values()) {
    const places = [...NET_MAP_BASE_PLACES, ...own];
    for (const from of places) for (const to of places) if (from !== to) routes[`${from}>${to}`] ??= route(sites, from, to);
  }
  return routes;
}

// The camera as six numbers and the origin, so the driver places moving parts with the figure's own numbers.
function camera() {
  const o = at([0, 0, 0]), ex = at([1000, 0, 0]), ey = at([0, 1000, 0]), ez = at([0, 0, 1000]);
  return { M: [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000], O: o.map((v) => +v.toFixed(2)), TZ, ring: { at: RING_AT.map((v) => +v.toFixed(2)), o: o.map((v) => +v.toFixed(2)), r: RING_R } };
}

/** The network map, drawn at build time: its SVG and the data its driver reads. */
export function drawNetMap(): DrawnFigure {
  const { svg, layers } = mapSvg();
  const data: NetMapData = { ...camera(), routes: routesOf(layers) };
  return { svg, data };
}
