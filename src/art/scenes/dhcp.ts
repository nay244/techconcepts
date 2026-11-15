// @ts-nocheck -- ported drawing code; the checksum test in dhcp.test.ts pins its output, so it is not re-typed line by line.
// The DHCP lesson's scene: one home Wi-Fi plate. The router stands at the back with its lease table beside it, the
// laptop that needs an address on the left, and the phone that overhears on the right. Ported from the approved
// mockup's FIGS/dhcp-scene.mjs (lesson-v3.html); the drawing is identical. Its ids carry a `dh-` prefix, so they stay
// unique on the page. The driver (src/scenes/drivers/dhcp.ts) flies the message tag, spreads the broadcast ring and
// lights the parts; this module draws them and says where they are.
import type { DrawnFigure } from './types';
import { k, G, S, L, D, n1, tubePieces, tubeSvg } from '../common.ts';
import { FRAMES_DESCRIPTION } from './dhcp-frames';
import './dhcp.css';

/** What the driver reads: the figure's camera, the message's way through the air, and how far a broadcast ring spreads. */
export interface DhcpSceneData {
  /** The camera as six numbers: on screen, x = M[0]·x + M[1]·y + M[2]·z and y = M[3]·x + M[4]·y + M[5]·z, from the origin. */
  M: number[];
  /** The tag's way from the laptop up and over to the router, as 33 points (x, y, z) on the plate. A reply runs it backwards. */
  arc: [number, number, number][];
  /** The broadcast ring's widest radius on the floor. */
  ringMax: number;
  /** For the frames setup (MAC Address): where the ring starts for each sender, and where each device stands, on the plate. */
  ringAt: Record<'laptop' | 'router', [number, number]>;
  places: Record<'laptop' | 'router' | 'phone' | 'tv', [number, number]>;
}

const LAPTOP_MAC = "00:00:5E:00:53:10";
const PHONE_MAC = "00:00:5E:00:53:11";
// The frames setup (MAC Address): the router's own MAC address and a TV's. The TV stands where the lease table does.
const ROUTER_MAC = "00:00:5E:00:53:01";
const TV_MAC = "00:00:5E:00:53:12";

const PLATE_H = 8, FOOT_H = 3.4, FLOOR = -PLATE_H - FOOT_H;
const PL = { x: -112, y: -80, w: 224, d: 160, r: 10 };
const LB = { x: -96, y: 2, w: 58, d: 42, r: 4 }, LZ = 3.6, LID_H = 38;
const R = { x: -42, y: -66, w: 62, d: 34, r: 5 }, RZ = 2.4, RT = RZ + 11;
const LG = { x: 38, y: -66, w: 54, d: 8, r: 1.4 }, LG_Z = 2.6, LG_H = 44;
const PD = { x: 52, y: 30, w: 28, d: 16, r: 3 }, PD_H = 3;
const PH = { x: 57, y: 33, w: 18, d: 3.2, r: 1.4 }, PH_H = 36;
const TV = { x: 40, y: -64, w: 50, d: 3, r: 1 }, TV_Z = 7, TV_H = 30, TVF = { x: 55, y: -70, w: 20, d: 13, r: 2 };

// One camera for the scene. The frame is fitted afterwards to the plate and its callouts, which sit off the plate,
// on the page's own background, so they read in both themes.
const P = k.fitProjection(k.boxCorners(PL, FLOOR, 0), 448, 300, { pad: 0, azimuth: 45 });
const SHIFT = [0, 0];
const V = G.viewOf(P);
const at = (p) => { const [x, y] = k.iso(p, P); return [x + SHIFT[0], y + SHIFT[1]]; };
const depth = (p) => k.depthOf(p, P);
const byDepth = (list) => [...list].sort((a, b) => depth([a[0], a[1], 0]) - depth([b[0], b[1], 0]));
const onFaceY = (Y, inner) => `<g transform="${k.sideMatrix([0, Y], 0, P, "left")}">${inner}</g>`;
const onTopAt = (Z, inner) => `<g transform="${k.topMatrix([0, 0], Z, P, "x")}">${inner}</g>`;
const tubeOf = (pieces, tone = "hi") => pieces.sort((a, b) => G.dot3(a.mid, V) - G.dot3(b.mid, V)).map((p) => tubeSvg(p, { tone })).join("");
const rect = (cls, u, z, w, h, rx = 0.6, extra = "") => `<rect class="${cls}" x="${n1(u)}" y="${n1(-(z + h))}" width="${n1(w)}" height="${n1(h)}" rx="${rx}"${extra}/>`;
const dot = ([x, y], cls, r = 1.2, extra = "") => `<circle class="${cls}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"${extra}/>`;
const wrap = (inner) => `<g transform="translate(${SHIFT[0]} ${SHIFT[1]})">${inner}</g>`;

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

// ---------- The laptop: no address yet, then its address on its screen ----------
function laptop() {
  const out = [];
  out.push(S(k.slabOf(LB, 0, LZ, P, 5, 0.8), { tone: "hi" }));
  const keysX = 9, keysY = 3, pitch = (LB.w - 10) / keysX;
  let keys = "";
  for (let r = 0; r < keysY; r++) for (let c = 0; c < keysX; c++) keys += k.planOutline({ x: LB.x + 5 + c * pitch, y: LB.y + 7 + r * pitch, w: pitch - 1, d: pitch - 1, r: 0.6 }, LZ, P, 3);
  out.push(L(keys, { tone: "lo" }));
  out.push(L(k.planOutline({ x: LB.x + LB.w / 2 - 9, y: LB.y + 9 + keysY * pitch, w: 18, d: LB.d - 13 - keysY * pitch, r: 1.2 }, LZ, P, 3), { tone: "lo" }));
  const LID = { x: LB.x + 1, y: LB.y, w: LB.w - 2, d: 2.6, r: 1 };
  out.push(S(k.slabOf(LID, LZ, LID_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = LID.x + 3, w = LID.w - 6, z0 = LZ + 3, h = LID_H - 6;
  let scr = rect("lm-void", x0, z0, w, h, 0.8);
  scr += rect("dh-glow", x0, z0, w, h, 0.8, ' id="dh-lap-glow"');
  // A Wi-Fi bar across the top, then the address, or the lack of one.
  scr += rect("lm-slot", x0 + 2, z0 + h - 5.4, w - 4, 3.2, 0.8) + `<text class="dh-scr-s" x="${n1(x0 + 4)}" y="${n1(-(z0 + h - 4.4))}">WI-FI · HOME</text>`;
  scr += `<text class="dh-scr" id="dh-lap-noip" x="${n1(x0 + w / 2)}" y="${n1(-(z0 + h / 2 - 4))}" text-anchor="middle">NO IP YET</text>`;
  scr += `<text class="dh-scr lit" id="dh-lap-ip" x="${n1(x0 + w / 2)}" y="${n1(-(z0 + h / 2 - 4))}" text-anchor="middle" style="opacity:0">192.168.1.100</text>`;
  out.push(onFaceY(LID.y + LID.d, scr));
  return out.join("");
}

// ---------- The router: the one that hands out addresses ----------
function router() {
  const out = [], RF = R.y + R.d;
  for (const [x, y] of byDepth(k.corners(R, 5))) out.push(S(k.cylinder(x, y, 2.2, 0, RZ, P, 16), { tone: "lo" }));
  out.push(S(k.slabOf(R, RZ, RT - RZ, P, 5, 0.8), { tone: "hi", inner: L(k.sideSeam(R, RZ + 3.4, P, 5), { tone: "faint" }) }));
  // Vents at the back, the Wi-Fi sign at the front.
  for (let i = 0; i < 5; i++) out.push(L(k.planOutline({ x: R.x + 9 + i * 6, y: R.y + 6, w: 2.4, d: 11, r: 1.2 }, RT, P, 3), { tone: "lo" }));
  const wc = [R.x + R.w - 16, R.y + R.d - 6];
  const arc = (r) => { const pts = []; for (let i = 0; i <= 14; i++) { const a = -Math.PI * 0.75 + (Math.PI / 2) * (i / 14); pts.push([wc[0] + r * Math.cos(a), wc[1] + r * Math.sin(a)]); } return k.onTop(pts, RT, P); };
  out.push(L([4, 8, 12].map(arc).join(""), { tone: "mid" }), D([k.iso([wc[0], wc[1], RT], P)], { size: 1, tone: "mid" }));
  for (const [x, y] of byDepth([[R.x + 7, R.y + 5], [R.x + R.w - 7, R.y + 5]])) {
    out.push(S(k.cylinder(x, y, 2.2, RT, 2.6, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 1.5, RT + 2.6, 26, P, 16), { tone: "hi", crease: "none" }));
  }
  out.push(`<g class="lm-leds">${[0, 1, 2, 3].map((i) => dot(k.iso([R.x + 8 + i * 6, RF, RZ + 5.6], P), "lm-led" + (i === 0 ? " on" : ""), 1.2, ` id="dh-led-${i}"`)).join("")}</g>`);
  return out.join("");
}

// ---------- The lease table: the router's list of who has which address ----------
const ROW_W = LG.w - 10;
function leaseBoard() {
  const out = [], F = LG.y + LG.d;
  out.push(S(k.slabOf({ x: LG.x - 3, y: LG.y - 3, w: LG.w + 6, d: LG.d + 9, r: 2 }, 0, LG_Z, P, 3, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf(LG, LG_Z, LG_H - LG_Z, P, 3, 0.6), { tone: "hi", inner: L(k.sideSeam(LG, LG_Z + 3, P, 3), { tone: "faint" }) }));
  let face = rect("lm-inlay", LG.x + 4, LG_H - 12, LG.w - 8, 8, 1.2) + `<text class="dh-board-h" x="${n1(LG.x + 7)}" y="${n1(-(LG_H - 9.4))}">LEASES</text>`;
  const rowZ = (i) => LG_H - 22 - i * 9;
  for (let i = 0; i < 3; i++) face += rect("lm-slot", LG.x + 5, rowZ(i), ROW_W, 6, 0.8);
  // Row 1 lights once the router writes the laptop down.
  face += `<g id="dh-lease-row" style="opacity:0">${rect("dh-row", LG.x + 5, rowZ(0), ROW_W, 6, 0.8)}<text class="dh-row-t" x="${n1(LG.x + 8)}" y="${n1(-(rowZ(0) + 1.7))}">.100  LAPTOP</text></g>`;
  out.push(onFaceY(F, face));
  return out.join("");
}

// ---------- The phone: on the same Wi-Fi, so it hears every shout ----------
function phone() {
  const out = [];
  out.push(S(k.slabOf(PD, 0, PD_H, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(PD, 1.2, P, 4), { tone: "faint" }) }));
  out.push(S(k.slabOf(PH, PD_H, PH_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = PH.x + 1.6, w = PH.w - 3.2, z0 = PD_H + 3, h = PH_H - 7;
  let scr = rect("lm-void", x0, z0, w, h, 1.2) + rect("dh-glow", x0, z0, w, h, 1.2, ' id="dh-ph-glow"');
  scr += rect("lm-slot", x0 + w / 2 - 3, z0 + h + 1.4, 6, 1.4, 0.7);
  for (let i = 0; i < 3; i++) scr += rect("lm-slot", x0 + 2.4, z0 + h - 7 - i * 4.2, w - 4.8 - (i === 2 ? 4 : 0), 1.8, 0.8);
  out.push(onFaceY(PH.y + PH.d, scr));
  return out.join("");
}

// ---------- The TV: on the same Wi-Fi, in the frames setup only, where the lease table stands in DHCP's ----------
function tv() {
  const out = [];
  out.push(S(k.slabOf(TVF, 0, 1.6, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(TVF, 0.6, P, 3), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: TVF.x + TVF.w / 2 - 3, y: TV.y - 2.2, w: 6, d: 2.2, r: 0.6 }, 1.6, TV_Z - 1.6, P, 3, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf(TV, TV_Z, TV_H, P, 3, 0.5), { tone: "hi" }));
  const x0 = TV.x + 1.8, w = TV.w - 3.6, z0 = TV_Z + 2.6, h = TV_H - 4.4;
  let scr = rect("lm-void", x0, z0, w, h, 0.6) + rect("dh-glow", x0, z0, w, h, 0.6, ' id="dh-tv-glow"');
  scr += rect("lm-slot", x0 + 3, z0 + h - 5, 14, 1.6, 0.8) + rect("lm-slot", x0 + 3, z0 + h - 8.4, 22, 1.6, 0.8);
  scr += `<circle class="lm-led on" cx="${n1(TV.x + TV.w - 3)}" cy="${n1(-(TV_Z + 1.3))}" r="0.7"/>`;
  out.push(onFaceY(TV.y + TV.d, scr));
  return out.join("");
}

// The lease table belongs to the router: a short cable joins them.
const cable = () => tubeOf(tubePieces([[R.x + R.w, R.y + 16, 1.4], [LG.x - 3, R.y + 16, 1.4]], 1.1, P, { maxLength: 14 }));

// ---------- Callouts: few, short, outside the plate ----------
// Each callout's text boxes, measured roughly from its font, so the frame can be fitted around them.
const TEXT_W = { "dh-name": 12 * 0.74, "dh-sub": 13 * 0.5, "dh-addr": 12.5 * 0.6, "dh-addr none": 13 * 0.5, "dh-ignore": 13 * 0.5 };
function callout(boxes, anchor, [tx, ty], lines, { align = "start", id = "" } = {}) {
  const [ax, ay] = at(anchor);
  for (const [i, l] of lines.entries()) { const w = l.text.length * TEXT_W[l.cls], x0 = align === "end" ? tx - w : tx; boxes.push([x0, ty + i * 16 - 12, x0 + w, ty + i * 16 + 4]); }
  const ex = tx + (align === "end" ? 7 : -7);
  const lead = `<path class="dh-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/>${dot([ax, ay], "dh-lead-dot", 2)}`;
  const text = lines.map((l, i) => l.svg ? l.svg(tx, ty + i * 16, align) : `<text class="${l.cls}"${l.id ? ` id="${l.id}"` : ""} x="${n1(tx)}" y="${n1(ty + i * 16)}" text-anchor="${align}">${l.text}</text>`).join("");
  return `<g class="dh-call"${id ? ` id="${id}"` : ""}>${lead}${text}</g>`;
}

// ---------- The frames setup's callout lines ----------
// What a device did with the frame in the air, as the driver writes it from the "Who keeps the frame" table: a small
// square, then the words. The square stands before the words, or after them on a callout whose lines end at its x.
const verdict = (place) => ({
  cls: "dh-sub", text: "Ignores it   ",
  svg: (x, y, align) => {
    const mx = align === "end" ? x - 8 : x, tx = align === "end" ? x - 12 : x + 12;
    return `<g class="dh-v" id="dh-v-${place}"><rect class="dh-v-mark" x="${n1(mx)}" y="${n1(y - 9)}" width="8" height="8" rx="1"/><path class="dh-v-slash" d="M${n1(mx + 1.5)} ${n1(y - 2.5)}l5 -5"/><text class="dh-v-t" x="${n1(tx)}" y="${n1(y)}" text-anchor="${align}"></text></g>`;
  },
});
// The laptop's MAC address in two halves, the organization's number (OUI) and this card's number. The driver lights the
// first half and shows the brackets and their words for a step (the `split` cue), in place of the verdict line.
const MAC_CH = 12.5 * 0.6;
const splitMac = (mac) => ({
  cls: "dh-addr", text: mac,
  svg: (x, y) => {
    const [a, b] = [mac.slice(0, 8), mac.slice(9)], x0 = x - mac.length * MAC_CH, aMid = x0 + 4 * MAC_CH, bMid = x - 4 * MAC_CH;
    const bracket = (cx) => `<path class="dh-bracket" d="M${n1(cx - 28)} ${n1(y + 4)}v3h56v-3"/>`;
    const text = `<text class="dh-addr" id="dh-mac-laptop" x="${n1(x)}" y="${n1(y)}" text-anchor="end"><tspan class="dh-oui">${a}</tspan>:${b}</text>`;
    const words = `<text class="dh-half" x="${n1(aMid)}" y="${n1(y + 18)}" text-anchor="middle">OUI</text><text class="dh-half" x="${n1(bMid)}" y="${n1(y + 18)}" text-anchor="middle">this card</text>`;
    return text + `<g class="dh-split" id="dh-split">${bracket(aMid)}${bracket(bMid)}${words}</g>`;
  },
});

// ---------- Moving parts, drawn at the origin and moved by the driver ----------
const LABELS = ["DISCOVER", "OFFER", "REQUEST", "ACK", "RENEW", "FRAME", "TO ALL"];
const tagId = (label) => `dh-tag-${label.toLowerCase().replace(" ", "-")}`;
const tag = (label) => {
  const w = label.length * 3.3 + 10, T = { x: -w / 2, y: -6, w, d: 12, r: 1.6 }, TH = 3.6;
  return S(k.slabOf(T, 0, TH, P, 3, 0.5), { tone: "hi", lit: true }) + onTopAt(TH, `<text class="dh-tag-t" x="0" y="1.9" text-anchor="middle">${label}</text>`);
};
const shadow = `<path class="lm-shadow" d="${k.planOutline({ x: -14, y: -5, w: 28, d: 10, r: 4 }, 0, P, 4)}"/>`;

// The message's way through the air, laptop to router. The driver runs it backwards for the router's replies.
const A = [LB.x + LB.w / 2, LB.y + 4, LZ + LID_H + 8], B = [R.x + R.w / 2 - 4, R.y + R.d / 2 + 2, RT + 9];
const ARC = [];
for (let i = 0; i <= 32; i++) { const s = i / 32; ARC.push([A[0] + (B[0] - A[0]) * s, A[1] + (B[1] - A[1]) * s, A[2] + (B[2] - A[2]) * s + 34 * Math.sin(Math.PI * s)]); }
const RING_AT = [LB.x + LB.w / 2, LB.y + LB.d / 2], RING_MAX = 230;
// In the frames setup the ring starts at whoever sends, the laptop or the router, and reaches each device in turn.
const ROUTER_AT = [R.x + R.w / 2, R.y + R.d / 2];
const PLACES = { laptop: RING_AT, router: ROUTER_AT, phone: [PH.x + PH.w / 2, PH.y + PH.d / 2], tv: [TV.x + TV.w / 2, TV.y + TV.d / 2] };

// ---------- The scene ----------
function sceneSvg() {
  const pl = plate("HOME WI-FI · 192.168.1.0/24");
  const things = [
    { xy: [LB.x + LB.w / 2, LB.y + LB.d / 2], svg: laptop() },
    { xy: [R.x + R.w / 2, R.y + R.d / 2], svg: router() },
    { xy: [LG.x + LG.w / 2, LG.y + LG.d / 2], svg: `<g data-setup="addresses">${leaseBoard()}</g>` },
    { xy: [PD.x + PD.w / 2, PD.y + PD.d / 2], svg: phone() },
    { xy: [(R.x + R.w + LG.x) / 2, R.y + 16], svg: `<g data-setup="addresses">${cable()}</g>` },
    { xy: [TV.x + TV.w / 2, TV.y + TV.d / 2], svg: `<g data-setup="frames" display="none">${tv()}</g>` },
  ].sort((a, b) => depth([...a.xy, 0]) - depth([...b.xy, 0]));
  // Floor layers: the broadcast ring and the tag's shadow, clipped to the plate so objects stand on top of them.
  const clip = `<clipPath id="dh-clip"><path d="${k.planOutline(k.insetPlan(PL, 2), 0, P)}"/></clipPath>`;
  const floor = `<g clip-path="url(#dh-clip)"><g id="dh-ring-g" style="opacity:0">${onTopAt(0, `<circle class="dh-ring" id="dh-ring" cx="${RING_AT[0]}" cy="${RING_AT[1]}" r="1"/><circle class="dh-ring soft" id="dh-ring2" cx="${RING_AT[0]}" cy="${RING_AT[1]}" r="1"/>`)}</g><g id="dh-tag-shadow" style="opacity:0">${shadow}</g></g>`;
  const arc = `<g id="dh-arc" style="opacity:0">${L(k.pathOf(ARC.map((p) => k.iso(p, P))), { tone: "hi", dotted: true })}</g>`;
  const tags = LABELS.map((l) => `<g class="dh-tag" id="${tagId(l)}" style="opacity:0">${tag(l)}</g>`).join("");
  const boxes = [];
  const labels = `<g data-setup="addresses">` + [
    callout(boxes, [R.x + 7, R.y + 5, RT + 28.6], [290, 0], [{ cls: "dh-name", text: "Router" }, { cls: "dh-sub", text: "hands out addresses" }, { cls: "dh-addr", text: "192.168.1.1" }]),
    callout(boxes, [LG.x + LG.w, LG.y, LG_H], [440, 66], [{ cls: "dh-name", text: "Lease table" }, { cls: "dh-sub", text: "who has which address" }]),
    callout(boxes, [LB.x, LB.y + 1, LZ + LID_H - 14], [72, 44], [{ cls: "dh-name", text: "Laptop" }, { cls: "dh-addr", text: LAPTOP_MAC }, { cls: "dh-addr none", text: "No IP address yet", id: "dh-laptop-ip" }], { align: "end" }),
    callout(boxes, [PH.x + PH.w, PH.y, PD_H + PH_H - 4], [432, 206], [{ cls: "dh-name", text: "Phone" }, { cls: "dh-addr", text: PHONE_MAC }, { cls: "dh-ignore", text: "Hears it, ignores it", id: "dh-ignore" }]),
  ].join("") + `</g>`;
  // The frames setup: each device's name, its MAC address and what it did with the frame; the TV where the lease table's callout is.
  const frames = `<g data-setup="frames" display="none">` + [
    callout(boxes, [R.x + 7, R.y + 5, RT + 28.6], [290, 0], [{ cls: "dh-name", text: "Router" }, { cls: "dh-addr", text: ROUTER_MAC }, verdict("router")]),
    callout(boxes, [TV.x + TV.w, TV.y, TV_Z + TV_H], [440, 66], [{ cls: "dh-name", text: "TV" }, { cls: "dh-addr", text: TV_MAC }, verdict("tv")]),
    callout(boxes, [LB.x, LB.y + 1, LZ + LID_H - 14], [72, 44], [{ cls: "dh-name", text: "Laptop" }, splitMac(LAPTOP_MAC), verdict("laptop")], { align: "end" }),
    callout(boxes, [PH.x + PH.w, PH.y, PD_H + PH_H - 4], [432, 206], [{ cls: "dh-name", text: "Phone" }, { cls: "dh-addr", text: PHONE_MAC }, verdict("phone")]),
  ].join("") + `</g>`;
  // The frame: the plate, the tallest parts and every callout, with a margin.
  const pts = [...k.boxCorners(PL, FLOOR, 0), [R.x + 7, R.y + 5, RT + 28.6]].map(at);
  for (const [x0, y0, x1, y1] of boxes) pts.push([x0, y0], [x1, y1]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), PAD = 18;
  const vb = [Math.min(...xs) - PAD, Math.min(...ys) - PAD, Math.max(...xs) - Math.min(...xs) + 2 * PAD, Math.max(...ys) - Math.min(...ys) + 2 * PAD].map((v) => Math.round(v));
  const body = wrap(clip + pl.under + `<g class="lm-body">${pl.over}${floor}${things.map((t) => t.svg).join("")}${arc}${tags}</g>`) + labels + frames;
  return `<svg data-figure="dhcp" class="lm-svg dh" viewBox="${vb.join(" ")}" role="img" aria-label="A home Wi-Fi network on one plate: a laptop with no address yet, a phone, and the router that hands out addresses, with its lease table beside it.">${body}</svg>`;
}

// What the driver needs: the camera as six numbers, the arc, and the ring.
function sceneData(): DhcpSceneData {
  const o = k.iso([0, 0, 0], P), ex = k.iso([1000, 0, 0], P), ey = k.iso([0, 1000, 0], P), ez = k.iso([0, 0, 1000], P);
  const M = [(ex[0] - o[0]) / 1000, (ey[0] - o[0]) / 1000, (ez[0] - o[0]) / 1000, (ex[1] - o[1]) / 1000, (ey[1] - o[1]) / 1000, (ez[1] - o[1]) / 1000];
  const r2 = (p) => p.map((v) => +v.toFixed(2));
  return { M, arc: ARC.map(r2), ringMax: RING_MAX, ringAt: { laptop: r2(RING_AT), router: r2(ROUTER_AT) }, places: Object.fromEntries(Object.entries(PLACES).map(([n, p]) => [n, r2(p)])) };
}

/** The DHCP scene, drawn at build time: its SVG and the data its driver reads. */
export function drawDhcp(): DrawnFigure {
  return { svg: sceneSvg(), data: sceneData() };
}

/**
 * The drawn figure as MAC Address's frames setup shows it, for the page's static markup (the driver applies the same
 * on show): the TV and the frames callouts in, DHCP's lease board, cable and callouts out, the laptop online, and the
 * figure's own description. It throws if the drawing does not hold each part the stated number of times, so a
 * redrawn figure cannot skip one in silence.
 */
export function framesSetup(svg: string): string {
  const swap = (from: string, to: string, count: number): void => {
    const found = svg.split(from).length - 1;
    if (found !== count) throw new Error(`The frames setup expects ${count} of ${from} in the DHCP figure, and found ${found}.`);
    svg = svg.replaceAll(from, to);
  };
  swap('<g data-setup="frames" display="none">', '<g data-setup="frames">', 2);
  swap('<g data-setup="addresses">', '<g data-setup="addresses" display="none">', 3);
  const ip = /(id="dh-lap-ip"[^>]*?)style="opacity:0"/g;
  if ((svg.match(ip) ?? []).length !== 1) throw new Error('The frames setup expects the laptop\'s address on its screen, hidden, once in the DHCP figure.');
  svg = svg.replace(ip, '$1style="opacity:1"');
  swap('id="dh-lap-noip"', 'id="dh-lap-noip" style="opacity:0"', 1);
  const label = /aria-label="[^"]*"/;
  if (!label.test(svg)) throw new Error('The DHCP figure has no aria-label for the frames setup to replace.');
  return svg.replace(label, `aria-label="${FRAMES_DESCRIPTION}"`);
}
