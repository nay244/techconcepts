// @ts-nocheck -- ported drawing code; the checksum tests in figures.test.ts pin its output, so it is not re-typed line by line.
// The still thumbnail for How the Internet Works: the retired home hero (home, the internet and the web server on three
// plates) with its labels taken off and the page drawn on the laptop's screen. Ported from the approved mockups' figs
// (hero.mjs, with the changes track2.mjs's internetArt() makes); the drawing is identical.
import { k, G, tubePieces, tubeSvg, S, L, D, n1 } from "../common.ts";

const VW = 1280, VH = 720;
const PLATE_H = 7, FOOT_H = 3, FLOOR = -PLATE_H - FOOT_H;
// The plates run corner to corner: home at the back left, the internet in the middle, the server at the front right.
const HP = { x: -226, y: 20, w: 126, d: 104, r: 8 };
const IP = { x: -52, y: -54, w: 176, d: 134, r: 10 };
const SP = { x: 164, y: -116, w: 112, d: 112, r: 8 };
const LB = { x: -216, y: 70, w: 56, d: 38, r: 4 }, LID_H = 36;
const HR = { x: -152, y: 38, w: 40, d: 24, r: 4 };
const RACKS = [{ x: 178, y: -102, w: 28, d: 30, r: 2, h: 50 }, { x: 210, y: -106, w: 30, d: 34, r: 2, h: 58 }, { x: 244, y: -102, w: 26, d: 30, r: 2, h: 44 }];
const DOCK = { x: 200, y: -42, w: 52, d: 14, r: 2 }, DOCK_H = 3;
const PUCK_R = 8, PUCK_H = 5;
const N = { isp: [-28, 50], a: [-22, 8], b: [42, 66], c: [32, 30], d: [36, -26], e: [96, 46], edge: [110, -20] };
const LINKS = [["isp", "a"], ["isp", "c"], ["isp", "b"], ["a", "c"], ["a", "d"], ["c", "d"], ["b", "c"], ["c", "e"], ["b", "e"], ["c", "edge"], ["d", "edge"], ["e", "edge"]];

// One camera for the scene, fitted to the top of the frame. The words sit bottom left and the caption bottom right.
const FIT = [HP, IP, SP].flatMap((p) => k.boxCorners(p, FLOOR, 0));
FIT.push(...k.boxCorners(RACKS[1], 0, 66), [LB.x, LB.y, LID_H + 30], [HR.x, HR.y, 30]);
const BOX = { x: 64, y: -30, w: 1150, h: 560 };
const P = k.fitProjection(FIT, BOX.w, BOX.h, { pad: 0, azimuth: 45 });
const SHIFT = [BOX.x, BOX.y];
const V = G.viewOf(P);
const at = (p) => { const [x, y] = k.iso(p, P); return [x + SHIFT[0], y + SHIFT[1]]; };
const depth = (p) => k.depthOf(p, P);
const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
const onFaceX = (X, inner) => `<g transform="${k.sideMatrix([X, 0], 0, P, "right")}">${inner}</g>`;
const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
const tubeOf = (pieces, tone = "hi") => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone })).join("");
const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
const dot = ([x, y], cls, r = 1.2) => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`;
const pin = (ms, inner, cls = "") => `<g class="hin${cls ? " " + cls : ""}" data-in="${Math.round(ms)}">${inner}</g>`;
// Everything is drawn in the kit's frame and shifted once, so the page script can place moving parts with the same numbers.
const wrap = (inner) => `<g transform="translate(${SHIFT[0]} ${SHIFT[1]})">${inner}</g>`;

// ---------- The plates ----------
function plate(p, label, ms) {
  const under = `<path class="iso-halo" d="${k.haloOf(p, FLOOR, PLATE_H, P)}"/>`;
  const over = [];
  for (const [x, y] of [...k.corners(p, 14)].sort((a, b) => depth([...a, 0]) - depth([...b, 0]))) {
    over.push(S(k.cylinder(x, y, 5, FLOOR, 1.2, P, 24), { tone: "lo" }));
    over.push(S(k.cylinder(x, y, 3.8, FLOOR + 1.2, FOOT_H - 1.2, P, 24), { tone: "mid" }));
  }
  over.push(S(k.slabOf(p, -PLATE_H, PLATE_H, P, 8, 1.2), { tone: "mid", inner: L(k.sideSeam(p, -PLATE_H + 2, P, 8), { tone: "faint" }) }));
  over.push(L(k.planOutline(k.insetPlan(p, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(p, 9);
  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 18)).join(""), { tone: "lo" }));
  over.push(D(screws.map(([x, y]) => k.iso([x, y, 0], P)), { size: 0.6, tone: "mid" }));
  over.push(k.faceTextSvg(k.sideMatrix([p.x + p.w - 16, p.y + p.d], -4.6, P, "left"), label, { size: 3.6, tone: "mid", anchor: "end" }));
  return { under: pin(ms, under), over: pin(ms, over.join("")) };
}

// ---------- Things on the plates ----------
function laptop() {
  const out = [], LZ = 3.6;
  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
  const keysX = 9, keysY = 3, pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 7 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  out.push(L(k.planOutline({ x: LB.x + LB.w / 2 - 9, y: LB.y + 9 + keysY * pitch, w: 18, d: LB.d - 13 - keysY * pitch, r: 1.2 }, LZ, P, 3), { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.6, r: 1 };
  out.push(S(k.slabOf(LID, LZ, LID_H, P, 3, 0.5), { tone: "hi" }));
  // The screen: an address bar, four places for the four pieces, and the page once it is whole.
  const x0 = LID.x + 3, w = LID.w - 6, z0 = LZ + 3, h = LID_H - 6, face = LID.y + LID.d;
  const bar = 5, gap = 1.6, sw = (w - 3 * gap) / 2, sh = (h - bar - 3 * gap) / 2;
  let scr = rect("lm-void", x0, z0, w, h, 0.8);
  scr += rect("lm-slot", x0 + gap, z0 + h - bar + 0.6, w - 2 * gap, bar - 1.6, 0.8) + `<text class="hl-url" x="${n1(x0 + gap + 2.4)}" y="${n1(-(z0 + h - bar + 1.7))}">techconcepts.app</text>`;
  const slot = (i) => { const c = i % 2, r = Math.floor(i / 2); return [x0 + gap + c * (sw + gap), z0 + gap + (1 - r) * (sh + gap)]; };
  scr += `<g id="scr-wait" style="opacity:0">${[0, 1, 2, 3].map((i) => rect("lm-inlay", ...slot(i), sw, sh, 0.8)).join("")}</g>`;
  scr += [0, 1, 2, 3].map((i) => { const [u, z] = slot(i); return `<g id="slot-${i}" style="opacity:0">${rect("hl-slot", u, z, sw, sh, 0.8)}<text class="hl-slot-n" x="${n1(u + sw / 2)}" y="${n1(-(z + sh / 2 - 2.4))}" text-anchor="middle">${i + 1}</text></g>`; }).join("");
  // The page, whole: a heading, a picture and some lines of text.
  const px = (u, z, ww, hh, cls = "") => rect("hl-px" + (cls ? " " + cls : ""), u, z, ww, hh, 0.5);
  const top = z0 + h - bar - gap;
  let page = px(x0 + gap + 1, top - 5, 30, 3.2) + px(x0 + gap + 1, top - 8.6, 22, 1.4, "soft");
  page += px(x0 + gap + 1, z0 + gap + 1, 18, top - 11 - z0 - gap - 1, "soft");
  for (let i = 0; i < 4; i++) page += px(x0 + gap + 22, top - 13 - i * 3.6, w - 2 * gap - 24 - (i === 3 ? 8 : 0), 1.4, "soft");
  scr += `<g id="scr-page">${rect("hl-page-bg", x0 + gap, z0 + gap, w - 2 * gap, h - bar - gap, 0.6)}${page}</g>`;
  out.push(onFaceY(face, scr));
  return out.join("");
}

function homeRouter() {
  const out = [], R = HR, RZ = 2, RT = RZ + 10, RF = R.y + R.d;
  for (const [x, y] of [...k.corners(R, 5)].sort((a, b) => depth([...a, 0]) - depth([...b, 0]))) out.push(S(k.cylinder(x, y, 2, 0, RZ, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(R, RZ + 3, P, 5), { tone: "faint" }) }));
  for (let i = 0; i < 4; i++) out.push(L(k.planOutline({ x: R.x + 8 + i * 6, y: R.y + 6, w: 2.4, d: R.d - 12, r: 1.2 }, RT, P, 3), { tone: "lo" }));
  for (const [x, y] of [[R.x + 6, R.y + 5], [R.x + R.w - 6, R.y + 5]].sort((a, b) => depth([...a, 0]) - depth([...b, 0]))) {
    out.push(S(k.cylinder(x, y, 2, RT, 2.4, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 1.4, RT + 2.4, 24, P, 16), { tone: "hi", crease: "none" }));
  }
  out.push(`<g class="lm-leds" id="home-leds">${[0, 1, 2, 3].map((i) => dot(k.iso([R.x + 8 + i * 6, RF, RZ + 5], P), "lm-led" + (i === 0 ? " on" : ""), 1.2)).join("")}</g>`);
  return out.join("");
}

// A router on the internet: a low puck with a light on its front.
function puck([x, y], id) {
  const out = [];
  out.push(S(k.cylinder(x, y, PUCK_R + 1, 0, 1.2, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, PUCK_R, 1.2, PUCK_H - 1.2, P, 32, 0.5), { tone: "hi" }));
  // Four arrows on the lid, the usual sign for a router.
  const a = 5.6, hd = 1.9, arrows = [];
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const tip = [x + dx * a, y + dy * a], base = [x + dx * 1.6, y + dy * 1.6];
    arrows.push(k.lineOnTop(base, tip, PUCK_H, P));
    const px = -dy, py = dx;
    arrows.push(k.lineOnTop(tip, [tip[0] - dx * hd + px * hd, tip[1] - dy * hd + py * hd], PUCK_H, P), k.lineOnTop(tip, [tip[0] - dx * hd - px * hd, tip[1] - dy * hd - py * hd], PUCK_H, P));
  }
  out.push(L(arrows.join(""), { tone: "mid" }));
  const f = [x + PUCK_R * Math.SQRT1_2, y + PUCK_R * Math.SQRT1_2, 3];
  out.push(`<g class="lm-leds">${dot(k.iso(f, P), "lm-led", 1.1).replace("<circle", `<circle id="led-${id}"`)}</g>`);
  return out.join("");
}

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

function dock() {
  const out = [];
  out.push(S(k.slabOf(DOCK, 0, DOCK_H, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(DOCK, 1.2, P, 3), { tone: "faint" }) }));
  // The page, waiting on the server. When the request arrives it is cut into four numbered pieces.
  out.push(`<g id="dock-page">${S(k.slabOf({ x: DOCK.x + 3, y: DOCK.y + 3, w: DOCK.w - 6, d: DOCK.d - 6, r: 1 }, DOCK_H, 2, P, 3, 0.4), { tone: "hi" })}${L(
    [0, 1, 2].map((i) => k.lineOnTop([DOCK.x + 7, DOCK.y + 5.5 + i * 2.6], [DOCK.x + DOCK.w - 9 - i * 6, DOCK.y + 5.5 + i * 2.6], DOCK_H + 2, P)).join(""), { tone: "lo" })}</g>`);
  return out.join("");
}

// ---------- Cables ----------
const CABLE_R = 1.1, CABLE_Z = 1.4, RIDE = 2.6, HOP = PUCK_H + 1.6;
const cable = (route) => tubeOf(tubePieces(route.map(([x, y]) => [x, y, CABLE_Z]), CABLE_R, P, { maxLength: 14 }));
const LAP_END = [-156, 90], HOME_IN = [-112, 50], HOME_OUT = [-142, 64], LANE = -20, DOCK_Y = DOCK.y + DOCK.d / 2;
function cables() {
  const out = [];
  for (const [a, b] of LINKS) out.push(cable([N[a], N[b]]));
  out.push(cable([HOME_IN, N.isp]));
  out.push(cable([LAP_END, HOME_OUT]));
  out.push(cable([N.edge, [DOCK.x + DOCK.w + 6, LANE]]));
  return out.join("");
}

// ---------- The trips ----------
// A route through named stops. Packets ride on the cable and hop over each router on the way.
function ride(stops) {
  const pts = [];
  const node = (s) => (typeof s === "string" ? N[s] : s);
  for (let i = 0; i < stops.length; i++) {
    const s = stops[i], p = node(s);
    if (typeof s === "string") {
      const prev = i > 0 ? node(stops[i - 1]) : null, next = i < stops.length - 1 ? node(stops[i + 1]) : null;
      const near = (q) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [p[0] + (dx / l) * 12, p[1] + (dy / l) * 12, RIDE]; };
      if (prev) pts.push(near(prev));
      pts.push([p[0], p[1], HOP]);
      if (next) pts.push(near(next));
    } else pts.push([p[0], p[1], p[2] ?? RIDE]);
  }
  return pts;
}
const HOME_HOP = [HR.x + HR.w / 2, HR.y + HR.d / 2, 15];
const toHome = (via) => ["edge", ...via, "isp", HOME_IN, HOME_HOP, HOME_OUT, [...LAP_END, RIDE]];
const DOCK_AT = [0, 1, 2, 3].map((i) => DOCK.x + 6 + i * 12);
const fromDock = (i) => [[DOCK_AT[i], DOCK_Y, DOCK_H], [DOCK_AT[i], LANE, RIDE]];
const TRIPS = [
  { id: "req", pts: ride([[...LAP_END, RIDE], HOME_OUT, HOME_HOP, HOME_IN, "isp", "c", "edge", [DOCK.x + DOCK.w / 2, LANE, RIDE], [DOCK.x + DOCK.w / 2, DOCK_Y, DOCK_H]]) },
  { id: "p0", n: 1, pts: [...fromDock(0), ...ride(toHome(["d", "a"]))] },
  { id: "p1", n: 2, pts: [...fromDock(1), ...ride(toHome(["c"]))] },
  { id: "p2", n: 3, pts: [...fromDock(2), ...ride(toHome(["e", "b"]))] },
  { id: "p3", n: 4, pts: [...fromDock(3), ...ride(toHome(["c"]))] },
];
const planLen = (pts) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// ---------- Timeline (ms) ----------
// Draw in, ask, cut, send, deliver out of order, done. It stops on the last frame.
const DRAW = 2900;
const T = { req: 3200 };
TRIPS[0].start = T.req; TRIPS[0].dur = 2300;
T.split = T.req + TRIPS[0].dur + 250;
T.send = T.split + 900;
const sendAt = [0, 260, 520, 780], durs = [3100, 2000, 3300, 2100];
TRIPS.slice(1).forEach((tr, i) => { tr.start = T.send + sendAt[i]; tr.dur = durs[i]; });
for (const tr of TRIPS) { tr.len = planLen(tr.pts); tr.end = tr.start + tr.dur; }
const arrive = TRIPS.slice(1).map((tr) => tr.end).sort((a, b) => a - b);
T.firstDel = arrive[0]; T.done = arrive[3] + 500; T.end = T.done + 1800;
const order = TRIPS.slice(1).sort((a, b) => a.end - b.end).map((tr) => tr.n).join(",");
if (order !== "2,4,1,3") throw new Error("arrival order is " + order);

// ---------- Moving parts, drawn at the origin and moved by the page script ----------
const PK = 10, PKH = 8;
function packetSvg(tr) {
  if (tr.id === "req") {
    const R = { x: -6, y: -4.5, w: 12, d: 9, r: 1.4 };
    return S(k.slabOf(R, 0, 6, P, 3, 0.5), { tone: "hi", className: "hl-req" }) + onTopAt(6, `<text class="hl-req-t" x="0" y="1.4" text-anchor="middle">GET</text>`);
  }
  const R = { x: -PK / 2, y: -PK / 2, w: PK, d: PK, r: 1.4 };
  return S(k.slabOf(R, 0, PKH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(PKH, `<text class="hl-num" x="0" y="2.4" text-anchor="middle">${tr.n}</text>`);
}

// ---------- The scene ----------
function heroSvg() {
  const plates = [plate(HP, "YOUR HOME NETWORK", 0), plate(SP, "TECHCONCEPTS.APP", 260), plate(IP, "THE INTERNET", 520)];
  const things = [];
  const put = (xy, svg, ms) => things.push({ d: depth([...xy, 0]), svg: pin(ms, svg) });
  put([LB.x + LB.w / 2, LB.y + LB.d / 2], laptop(), 1000);
  put([HR.x + HR.w / 2, HR.y + HR.d / 2], homeRouter(), 1150);
  Object.entries(N).forEach(([id, xy], i) => put(xy, puck(xy, id), 900 + i * 90));
  RACKS.forEach((R, i) => put([R.x + R.w / 2, R.y + R.d / 2], rack(R, i), 1100 + i * 120));
  put([DOCK.x + DOCK.w / 2, DOCK.y + DOCK.d / 2], dock(), 1500);
  things.sort((a, b) => a.d - b.d);
  const pool = `<path class="lm-pool" d="${k.ring(20, -10, 330, FLOOR, P, 120)}"/>` + L(k.ring(20, -10, 290, FLOOR, P, 160), { tone: "faint", className: "lm-orbit" });
  // Trails: each trip leaves a line along the cables it used.
  const trails = TRIPS.map((tr) => `<polyline class="hl-trail${tr.id === "req" ? " req" : ""}" id="tr-${tr.id}" points="" style="opacity:0"/>`).join("");
  const movers = TRIPS.map((tr) => `<g class="hl-pkt" id="pk-${tr.id}" style="opacity:0">${packetSvg(tr)}</g>`).join("");
  const body = wrap(pool + plates.map((p) => p.under).join("") + `<g class="lm-body">${plates.map((p) => p.over).join("")}${pin(1300, cables())}${trails}${things.map((t) => t.svg).join("")}${movers}</g>`);
  const aria = "How this page reached you. Your laptop asks the TechConcepts web server for the page. The server cuts the page into four numbered packets. They cross the internet by three different routes and arrive out of order, and your laptop uses the numbers to put the page back together.";
  return `<svg id="scene" class="lm-svg lm-hero" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${aria}">${body}</svg>`;
}

/** The internet thumbnail: ids prefixed `la-`, cropped close, with its own description. */
export function internetThumb(): string {
  return heroSvg()
    .replace(/ id="([^"]+)"/g, ' id="la-$1"')
    .replace(/url\(#(?!lm-)([^)]+)\)/g, 'url(#la-$1)')
    .replace(/viewBox="0 0 1280 720"/, 'viewBox="40 36 1198 476"')
    .replace(
      /aria-label="[^"]*"/,
      'aria-label="Three plates on a diagonal: a home with a laptop and a Wi-Fi router, the internet as a web of routers, and a web server, joined by cables."',
    );
}
