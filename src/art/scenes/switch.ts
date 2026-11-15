// @ts-nocheck -- drawing code in the family's style; the checksum test in switch.test.ts pins its output, so it is not re-typed line by line.
// The Switch lesson's scene: one wired home network on a plate. A five-port switch stands at the back, and four
// devices are plugged into it by cables: the router (port 1), the laptop (2), the TV (3) and the printer (4); port 5
// is free. Its ids carry an `sw-` prefix, so they stay unique on the page. The driver (src/scenes/drivers/switch.ts)
// rides the tags along the cables, lights the ports, swaps the laptop's cable from port 2 to port 5 and writes each
// device's verdict; this module draws them and says where they are.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import { SWITCH_DESCRIPTION, SWITCH_DEVICES, SWITCH_PLUGS } from './switch-parts';
import './switch.css';

/** What the driver reads: the cables as lines on screen, where each tag stops, and the tags' sizes. */
export interface SwitchSceneData {
  /**
   * Each cable's way on screen, in the figure's own frame, from the device's socket (first point) to the switch's
   * port (last point), at the height the tags ride. Keyed by the device and its port, `laptop:2`.
   */
  cables: Record<string, [number, number][]>;
}

const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
const PL = { x: -116, y: -84, w: 232, d: 168, r: 10 };

// The switch: a long low box at the back, its five ports on the front face (y = SW.y + SW.d).
const SW = { x: -62, y: -66, w: 116, d: 30, r: 3 }, SW_FOOT = 1.6, SW_H = 19;
const SW_F = SW.y + SW.d, SW_T = SW_FOOT + SW_H;
const PORT = { w: 13, h: 10, z: 3.4 }, PORT_PITCH = 19.5;
/** Each port's centre along the face (x), 1 to 5. */
const PORT_X = [1, 2, 3, 4, 5].map((n) => SW.x + 24 + (n - 1) * PORT_PITCH);
const PORT_Z = PORT.z + PORT.h / 2;

// The devices.
const RT = { x: -112, y: -70, w: 40, d: 24, r: 4 }, RT_Z = 2, RT_T = RT_Z + 10;
const LB = { x: -106, y: 30, w: 54, d: 38, r: 4 }, LZ = 3.6, LID_H = 36;
const TV = { x: 26, y: 64, w: 50, d: 3, r: 1 }, TV_Z = 7, TV_H = 30, TVF = { x: 41, y: 59, w: 20, d: 13, r: 2 };
const PR = { x: 68, y: -10, w: 40, d: 32, r: 3 }, PR_H = 16;

// One camera for the scene. The frame is fitted afterwards to the plate and its callouts, which sit off the plate,
// on the page's own background, so they read in both themes.
const P = k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
const V = G.viewOf(P);
const at = (p) => k.iso(p, P);
const depth = (p) => k.depthOf(p, P);
const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
const onFaceX = (X, inner) => `<g transform="${k.sideMatrix([X, 0], 0, P, "right")}">${inner}</g>`;
const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"${extra}/>`;

// ---------- The plate ----------
function plate(label) {
  const under = `<path class="lm-pool" d="${k.ring(0, 0, 250, FLOOR, P, 120)}"/><path class="iso-halo" d="${k.haloOf(PL, FLOOR, PLATE_H, P)}"/>`;
  const over = [];
  for (const [x, y] of byDepth(k.corners(PL, 18))) {
    over.push(S(k.cylinder(x, y, 6, FLOOR, 1.3, P, 28), { tone: "lo" }));
    over.push(S(k.cylinder(x, y, 4.6, FLOOR + 1.3, FOOT_H - 1.3, P, 28), { tone: "mid" }));
  }
  over.push(S(k.slabOf(PL, -PLATE_H, PLATE_H, P, 8, 1.3), { tone: "mid", inner: L(k.sideSeam(PL, -PLATE_H + 2.2, P, 8), { tone: "faint" }) }));
  over.push(L(k.planOutline(k.insetPlan(PL, 6), 0, P), { tone: "lo" }));
  const screws = k.corners(PL, 11);
  over.push(L(screws.map(([x, y]) => k.ring(x, y, 2.3, 0, P, 18)).join(""), { tone: "lo" }));
  over.push(D(screws.map(([x, y]) => k.iso([x, y, 0], P)), { size: 0.6, tone: "mid" }));
  over.push(k.faceTextSvg(k.sideMatrix([PL.x + PL.w - 22, PL.y + PL.d], -3.2, P, "left"), label, { size: 3.6, tone: "mid", anchor: "end" }));
  return { under, over: over.join("") };
}

// ---------- The switch: five ports in a row, a light over each, and its number ----------
function theSwitch() {
  const out = [];
  for (const [x, y] of byDepth(k.corners(SW, 6))) out.push(S(k.cylinder(x, y, 2.4, 0, SW_FOOT, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(SW, SW_FOOT, SW_H, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(SW, SW_FOOT + 2.6, P, 5), { tone: "faint" }) }));
  // Vents along the top's back half.
  let vents = "";
  for (let i = 0; i < 14; i++) vents += k.planOutline({ x: SW.x + 30 + i * 5.4, y: SW.y + 5, w: 2.2, d: 10, r: 1.1 }, SW_T, P, 3);
  out.push(L(vents, { tone: "lo" }));
  // The face: a power light at the left end, then each port: its number and its light over a socket.
  let face = `<circle class="lm-led on" cx="${n1(SW.x + 8)}" cy="${n1(-(SW_T - 5))}" r="1.3"/>` + rect("lm-slot", SW.x + 5, SW_T - 9.5, 7, 1.4, 0.7);
  PORT_X.forEach((cx, i) => {
    const x0 = cx - PORT.w / 2;
    face += rect("lm-inlay", x0 - 1, PORT.z - 1, PORT.w + 2, PORT.h + 2, 1.2);
    face += rect("lm-void", x0, PORT.z, PORT.w, PORT.h, 0.6);
    // The latch's notch at the socket's foot, and the gold contacts at its top.
    face += rect("lm-slot", cx - 3, PORT.z - 0.01, 6, 2.4, 0.3);
    for (let c = 0; c < 6; c++) face += rect("sw-pin", x0 + 2.2 + c * 1.6, PORT.z + PORT.h - 2.4, 0.8, 2, 0.1);
    face += `<text class="sw-num" x="${n1(x0 - 0.4)}" y="${n1(-(PORT.z + PORT.h + 2.2))}">${i + 1}</text>`;
    face += `<circle class="lm-led" id="sw-led-${i + 1}" cx="${n1(cx + PORT.w / 2 - 1.6)}" cy="${n1(-(PORT.z + PORT.h + 4.2))}" r="1.3"/>`;
  });
  out.push(onFaceY(SW_F, face));
  return out.join("");
}

// ---------- The router: a wired box with its lights, and one socket the cable comes from ----------
function router() {
  const out = [], RF = RT.y + RT.d;
  for (const [x, y] of byDepth(k.corners(RT, 5))) out.push(S(k.cylinder(x, y, 2, 0, RT_Z, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(RT, RT_Z, RT_T - RT_Z, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(RT, RT_Z + 3, P, 5), { tone: "faint" }) }));
  for (let i = 0; i < 4; i++) out.push(L(k.planOutline({ x: RT.x + 7 + i * 6, y: RT.y + 5, w: 2.4, d: RT.d - 10, r: 1.2 }, RT_T, P, 3), { tone: "lo" }));
  const face = [0, 1, 2].map((i) => `<circle class="lm-led${i === 0 ? " on" : ""}"${i > 0 ? ` id="sw-rt-led-${i}"` : ""} cx="${n1(RT.x + 6 + i * 5)}" cy="${n1(-(RT_Z + 6))}" r="1.1"/>`).join("")
    + rect("lm-inlay", RT.x + RT.w - 14, RT_Z + 1.6, 10, 6.4, 1) + rect("lm-void", RT.x + RT.w - 13, RT_Z + 2.4, 8, 4.8, 0.5);
  out.push(onFaceY(RF, face));
  return out.join("");
}

// ---------- The laptop: base, keys, and its lid, the screen facing you ----------
function laptop() {
  const out = [];
  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
  // Its status light, on the base's front: on while it keeps a frame.
  out.push(onFaceY(LB.y + LB.d, `<circle class="lm-led" id="sw-led-laptop" cx="${n1(LB.x + LB.w - 6)}" cy="${n1(-LZ / 2)}" r="1.1"/>`));
  const keysX = 9, keysY = 3, pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 7 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  out.push(L(k.planOutline({ x: LB.x + LB.w / 2 - 9, y: LB.y + 9 + keysY * pitch, w: 18, d: LB.d - 13 - keysY * pitch, r: 1.2 }, LZ, P, 3), { tone: "lo" }));
  // Its network socket, on the right side, where the cable goes in.
  out.push(onFaceX(LB.x + LB.w, rect("lm-void", -(LB.y + 16), 0.8, 7, 2.2, 0.4)));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.6, r: 1 };
  out.push(S(k.slabOf(LID, LZ, LID_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = LID.x + 3, w = LID.w - 6, z0 = LZ + 3, h = LID_H - 6;
  let scr = rect("lm-void", x0, z0, w, h, 0.8);
  for (let i = 0; i < 3; i++) scr += rect("lm-slot", x0 + 4, z0 + h - 6 - i * 4.4, w - 12 - (i === 2 ? 10 : 0), 1.8, 0.8);
  out.push(onFaceY(LID.y + LID.d, scr));
  return out.join("");
}

// ---------- The TV: a panel on a foot ----------
function tv() {
  const out = [];
  out.push(S(k.slabOf(TVF, 0, 1.6, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(TVF, 0.6, P, 3), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: TVF.x + TVF.w / 2 - 3, y: TV.y - 2.2, w: 6, d: 2.2, r: 0.6 }, 1.6, TV_Z - 1.6, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf(TV, TV_Z, TV_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = TV.x + 1.8, w = TV.w - 3.6, z0 = TV_Z + 2.6, h = TV_H - 4.4;
  let scr = rect("lm-void", x0, z0, w, h, 0.6);
  scr += rect("lm-slot", x0 + 3, z0 + h - 5, 14, 1.6, 0.8) + rect("lm-slot", x0 + 3, z0 + h - 8.4, 22, 1.6, 0.8);
  // Its status light, under the screen: on while it keeps a frame.
  scr += `<circle class="lm-led" id="sw-led-tv" cx="${n1(TV.x + TV.w - 3.4)}" cy="${n1(-(TV_Z + 1.3))}" r="1.1"/>`;
  out.push(onFaceY(TV.y + TV.d, scr));
  return out.join("");
}

// ---------- The printer: a box with a paper tray in, a sheet out on top, and a small panel ----------
function printer() {
  const out = [], PF = PR.y + PR.d;
  out.push(S(k.slabOf(PR, 0, PR_H, P, 4, 0.8), { tone: "hi", inner: L(k.sideSeam(PR, 4, P, 4), { tone: "faint" }) }));
  // The output tray, a shallow dip on top, with a sheet in it.
  const TRAY = { x: PR.x + 5, y: PR.y + 5, w: PR.w - 16, d: PR.d - 12, r: 1.4 };
  out.push(L(k.planOutline(TRAY, PR_H, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf({ x: TRAY.x + 3, y: TRAY.y + 2, w: TRAY.w - 6, d: TRAY.d - 4, r: 0.4 }, PR_H, 0.6, P, 3, 0.2), { tone: "hi", crease: "none" }));
  // The panel at the top's right: a light and two buttons.
  out.push(D([at([PR.x + PR.w - 6, PR.y + 8, PR_H]), at([PR.x + PR.w - 6, PR.y + 13, PR_H])], { size: 1.1, tone: "mid" }));
  // The front: the paper drawer, its handle, and the slot the paper comes out of.
  const face = rect("lm-slot", PR.x + 6, PR_H - 4.4, PR.w - 12, 1.6, 0.8) + rect("lm-inlay", PR.x + 4, 1.6, PR.w - 8, 7.4, 1) + rect("lm-slot", PR.x + PR.w / 2 - 6, 4.2, 12, 1.6, 0.8)
    // Its status light, on the front: on while it keeps a frame.
    + `<circle class="lm-led" id="sw-led-printer" cx="${n1(PR.x + PR.w - 4)}" cy="${n1(-(PR_H - 7.6))}" r="1.1"/>`;
  out.push(onFaceY(PF, face));
  return out.join("");
}

// ---------- Cables: each from a device's socket to its port, as it lies on the plate ----------
const CABLE_R = 1.1, CABLE_Z = 1.3, TZ = CABLE_Z + CABLE_R + 2.2;
/** Rounds each corner of a way on the plate, so a cable bends rather than kinks. */
function bend(points, r = 6) {
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const ra = Math.min(r, la / 2) / la, rc = Math.min(r, lc / 2) / lc;
    const p0 = [b[0] + (a[0] - b[0]) * ra, b[1] + (a[1] - b[1]) * ra, b[2] + (a[2] - b[2]) * ra];
    const p2 = [b[0] + (c[0] - b[0]) * rc, b[1] + (c[1] - b[1]) * rc, b[2] + (c[2] - b[2]) * rc];
    for (let s = 0; s <= 6; s++) {
      const t = s / 6, u = 1 - t;
      out.push([0, 1, 2].map((j) => u * u * p0[j] + 2 * u * t * b[j] + t * t * p2[j]));
    }
  }
  out.push(points.at(-1));
  return out;
}
// The way each cable lies, from the device to the port: on the floor, then up to the socket at each end.
const portAt = (n) => [PORT_X[n - 1], SW_F, PORT_Z];
const LAP_OUT = [[LB.x + LB.w, LB.y + 19.5, 1.9], [LB.x + LB.w + 6, LB.y + 19.5, CABLE_Z]];
const LIFT = CABLE_Z + 2.6;
const ROUTES = {
  "router:1": [[RT.x + RT.w - 9, RT.y + RT.d, RT_Z + 5], [RT.x + RT.w - 9, RT.y + RT.d + 5, CABLE_Z], [RT.x + RT.w - 9, -22, CABLE_Z], [PORT_X[0], -22, CABLE_Z], [PORT_X[0], SW_F + 6, CABLE_Z], portAt(1)],
  "laptop:2": [...LAP_OUT, [PORT_X[1], LB.y + 19.5, CABLE_Z], [PORT_X[1], SW_F + 6, CABLE_Z], portAt(2)],
  "tv:3": [[TVF.x + TVF.w / 2, TVF.y - 1, 2], [TVF.x + TVF.w / 2, TVF.y - 6, CABLE_Z], [TVF.x + TVF.w / 2, 30, CABLE_Z], [PORT_X[2], 30, CABLE_Z], [PORT_X[2], SW_F + 6, CABLE_Z], portAt(3)],
  "printer:4": [[PR.x, PR.y + 16, 3], [PR.x - 6, PR.y + 16, CABLE_Z], [PORT_X[3], PR.y + 16, CABLE_Z], [PORT_X[3], SW_F + 6, CABLE_Z], portAt(4)],
  // Step 5: the laptop's cable moved to port 5. It lies over the TV's and the printer's cables where it crosses them.
  "laptop:5": [...LAP_OUT, [-30, LB.y + 19.5, CABLE_Z], [-30, 16, CABLE_Z], [-10, 16, CABLE_Z], [-4, 16, LIFT], [PORT_X[4], 16, LIFT], [PORT_X[4], 0, LIFT], [PORT_X[4], -8, CABLE_Z], [PORT_X[4], SW_F + 6, CABLE_Z], portAt(5)],
};
const lay = (route) => bend(route);
const piecesOf = (route) => tubePieces(lay(route), CABLE_R, P, { maxLength: 12 });
const tubesOf = (pieces) => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone: "hi" })).join("");
// The plug at the port end: a short block with its boot, as it sits in the socket.
function plug(n) {
  const x = PORT_X[n - 1];
  return S(k.slabOf({ x: x - 5, y: SW_F, w: 10, d: 6, r: 1 }, PORT.z + 1.2, PORT.h - 2.4, P, 3, 0.4), { tone: "mid" });
}

// ---------- The callouts: name, MAC address and what the device did with the frame ----------
const TEXT_W = { "sw-name": 12 * 0.74, "sw-sub": 13 * 0.5, "sw-addr": 12.5 * 0.6 };
function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } = {}) {
  const [ax, ay] = at(anchor);
  for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
  const ex = tx + (align === "end" ? 7 : -7);
  const lead = `<path class="sw-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "sw-lead-dot", 2)}`;
  const text = lines.map((l, i) => l.svg ? l.svg(tx, ty + i * 16, align) : `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
  return `<g class="sw-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
}
// The name line: the device's name, then its port in a small square the driver changes when the cable moves.
const named = (place, name) => ({
  cls: "sw-name", text: `${name}   PORT 0`,
  svg: (x, y, align) => {
    const port = `<tspan class="sw-port" id="sw-port-${place}">PORT ${SWITCH_PLUGS[place]}</tspan>`;
    return `<text class="sw-name" x="${n1(x)}" y="${n1(y)}" text-anchor="${align}">${name}  ${port}</text>`;
  },
});
// A verdict, as MAC Address draws it: a small square, then the words, which the driver writes.
const verdict = (place) => ({
  cls: "sw-sub", text: "Ignores it   ",
  svg: (x, y, align) => {
    const mx = align === "end" ? x - 8 : x, tx = align === "end" ? x - 12 : x + 12;
    return `<g class="sw-v" id="sw-v-${place}"><rect class="sw-v-mark" x="${n1(mx)}" y="${n1(y - 9)}" width="8" height="8" rx="1"/><path class="sw-v-slash" d="M${n1(mx + 1.5)} ${n1(y - 2.5)}l5 -5"/><text class="sw-v-t" x="${n1(tx)}" y="${n1(y)}" text-anchor="${align}"></text></g>`;
  },
});

// ---------- Moving parts, drawn at the origin and moved by the driver ----------
// A tag for each frame that can be on the cables at once: the frame itself, and up to three copies of it.
const TAGS = [["frame", "FRAME"], ["to-all", "TO ALL"], ["copy-1", "COPY"], ["copy-2", "COPY"], ["copy-3", "COPY"], ["to-all-1", "TO ALL"], ["to-all-2", "TO ALL"], ["to-all-3", "TO ALL"]];
const tag = (label) => {
  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="sw-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
};

// ---------- The scene ----------
function sceneSvg() {
  const pl = plate("HOME NETWORK · ONE SWITCH, FIVE PORTS");
  const fixed = ["router:1", "tv:3", "printer:4"].flatMap((r) => piecesOf(ROUTES[r]));
  // The laptop's two cables, each in a group of its own, so the driver can show the one in use.
  const lap2 = `<g class="sw-cable" id="sw-cable-laptop-2">${tubesOf(piecesOf(ROUTES["laptop:2"]))}</g>`;
  const lap5 = `<g class="sw-cable" id="sw-cable-laptop-5" display="none">${tubesOf(piecesOf(ROUTES["laptop:5"]))}</g>`;
  // The plugs sit in front of the switch's face: the laptop's in port 2, or in port 5 once it has moved.
  const plugs = [1, 3, 4].map(plug).join("") + `<g class="sw-cable" id="sw-plug-laptop-2">${plug(2)}</g><g class="sw-cable" id="sw-plug-laptop-5" display="none">${plug(5)}</g>`;
  const things = [
    { xy: [SW.x + SW.w / 2, SW.y + SW.d / 2], svg: theSwitch() + plugs },
    { xy: [RT.x + RT.w / 2, RT.y + RT.d / 2], svg: router() },
    { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop() },
    { xy: [TV.x + TV.w / 2, TV.y + TV.d / 2], svg: tv() },
    { xy: [PR.x + PR.w / 2, PR.y + PR.d / 2], svg: printer() },
  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  // The traces: where a frame has been, along each cable, drawn by the driver; under the tags.
  const traces = `<g id="sw-traces">${Object.keys(ROUTES).map((r) => `<polyline class="sw-trace" id="sw-trace-${r.replace(":", "-")}" points=""/>`).join("")}</g>`;
  const tags = TAGS.map(([id, label]) => `<g class="sw-tag" id="sw-tag-${id}" style="opacity:0">${tag(label)}</g>`).join("");
  const boxes = [];
  const calls = [
    callout(boxes, [RT.x + 4, RT.y + 8, RT_T], [66, 34], [named("router", "Router"), { cls: "sw-addr", text: SWITCH_DEVICES.router }, verdict("router")], { align: "end" }),
    callout(boxes, [LB.x + 2, LB.y + LB.d, 0], [150, 262], [named("laptop", "Laptop"), { cls: "sw-addr", text: SWITCH_DEVICES.laptop }, verdict("laptop")], { align: "end" }),
    callout(boxes, [TV.x + TV.w, TV.y, TV_Z + TV_H], [330, 266], [named("tv", "TV"), { cls: "sw-addr", text: SWITCH_DEVICES.tv }, verdict("tv")]),
    callout(boxes, [PR.x + PR.w, PR.y + 6, PR_H], [458, 196], [named("printer", "Printer"), { cls: "sw-addr", text: SWITCH_DEVICES.printer }, verdict("printer")]),
    callout(boxes, [SW.x + SW.w - 10, SW.y + 6, SW_T], [434, 60], [{ cls: "sw-name", text: "Switch" }, { cls: "sw-sub", text: "keeps the MAC table" }]),
  ].join("");
  // The tags are drawn at the plate's origin and moved to points on screen, so their group takes that origin off.
  const O = at([0, 0, 0]);
  // The frame: the plate, the tallest parts and every callout, with a margin.
  const pts = [...k.boxCorners(PL, FLOOR, 0), [LB.x, LB.y, LZ + LID_H], [TV.x, TV.y, TV_Z + TV_H]].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 18;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  const body = pl.under + `<g class="lm-body">${pl.over}${tubesOf(fixed)}${lap2}${lap5}${traces}${things.map((t) => t.svg).join("")}<g id="sw-tags" transform="translate(${n1(-O[0])} ${n1(-O[1])})">${tags}</g></g>` + calls;
  return `<svg data-figure="switch" class="lm-svg sw" viewBox="${vb.join(" ")}" role="img" aria-label="${SWITCH_DESCRIPTION}">${body}</svg>`;
}

// What the driver needs: each cable as a line on screen at the tags' height.
function sceneData(): SwitchSceneData {
  const flat = (route) => lay(route).map(([x, y, z]) => at([x, y, Math.max(z, CABLE_Z) + TZ - CABLE_Z]).map((v) => +v.toFixed(1)));
  return { cables: Object.fromEntries(Object.entries(ROUTES).map(([name, route]) => [name, flat(route)])) };
}

/** The Switch scene, drawn at build time: its SVG and the data its driver reads. */
export function drawSwitch(): DrawnFigure {
  return { svg: sceneSvg(), data: sceneData() };
}
