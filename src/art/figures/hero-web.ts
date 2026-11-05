// The home hero's figure: the How the Web Works cover, drawn large. Ported from the approved mockups' hero-web.mjs
// (heroSvg, heroData and the caption steps in its page script); the drawing is identical. Movement is Task 17's.
import { at as atFig, base, n1 } from '../common.ts';
import { webDrawing } from './covers.ts';

const VW = 1280;
const VH = 720;
// The cover's own 600 x 420 frame, scaled and placed in the hero's 1280 x 720 frame.
const FIG = { s: 1.16, x: 579, y: 70 };
type Anchor = [number, number, number];
const put = ([x, y]: number[]): number[] => [FIG.x + FIG.s * x!, FIG.y + FIG.s * y!];
const at = (p: Anchor): number[] => put(atFig(p));
const pin = (ms: number, inner: string): string => `<g class="hin" data-in="${Math.round(ms)}">${inner}</g>`;

const FIGURE = webDrawing();
const ZERO = atFig([0, 0, 0]);
if (!/data-part="cart"/.test(FIGURE.svg) || !/data-part="sleds"/.test(FIGURE.svg)) throw new Error('web figure parts missing');
if ((FIGURE.svg.match(/class="lm-px/g) || []).length !== 9) throw new Error('expected 9 page blocks');

// Timeline (ms): draw in, send the request, the server finds the page, the reply rides back, the browser draws it.
const DRAW = 1300;
const req = 1700;
const at_ = req + 2600; // the request reaches the server
const back = at_ + 1500; // the reply leaves
const home = back + 2600; // the reply reaches the laptop
const draw = home + 150; // the browser starts drawing
const done = draw + 1900; // the page is whole
const T = { req, at: at_, back, home, draw, done, end: done + 1800 };

const TAG_DY = -24;
const TAG_W = 44;
const TAG_H = 13;
const tagSvg = `<g class="hw-tag" id="hw-tag" style="opacity:0"><rect x="${-TAG_W / 2}" y="${-TAG_H / 2}" width="${TAG_W}" height="${TAG_H}" rx="${TAG_H / 2}"/><text id="hw-tag-t" x="0" y="3.2" text-anchor="middle">GET /</text></g>`;

function callout(anchor: Anchor, dx: number, dy: number, lines: string[], ms: number): string {
  const [ax, ay] = at(anchor) as [number, number];
  const tx = ax + dx;
  const ty = ay + dy;
  const ex = tx + 6; // every callout here is right-aligned
  const lead = `<path class="hl-lead" d="M${n1(ax)} ${n1(ay)}L${n1(ex)} ${n1(ty - 4)}"/><circle class="hl-lead-dot" cx="${n1(ax)}" cy="${n1(ay)}" r="2"/>`;
  const text = lines
    .map((l, i) => `<text class="${i ? 'hl-sub' : 'hl-name'}" x="${n1(tx)}" y="${n1(ty + i * 17)}" text-anchor="end">${l}</text>`)
    .join('');
  return pin(ms, `<g class="hl-call">${lead}${text}</g>`);
}
// Where the callouts point: the top of the laptop's lid, and the top of the server cabinet.
const ANCHOR: Record<'laptop' | 'server', Anchor> = { laptop: [-80, -8.5, 50.5], server: [62, -43, 66] };

export interface HeroWebData {
  DRAW: number;
  T: Record<'req' | 'at' | 'back' | 'home' | 'draw' | 'done' | 'end', number>;
  /** The shuttle's path on screen, in the cover's frame. */
  PATH: number[][];
  ZERO: number[];
  TAG_DY: number;
  /** The caption under the hero: [short title, sentence], one per moment. */
  STEPS: Array<[string, string]>;
}

export const HERO_WEB: HeroWebData = {
  DRAW,
  T,
  PATH: FIGURE.path,
  ZERO: ZERO.map((v) => +v.toFixed(1)),
  TAG_DY,
  STEPS: [
    ['How a web page loads', 'Your browser is about to ask a web server for a page.'],
    ['Step 1 of 4', 'Your browser sends a request to the web server: “Please send me the page.”'],
    ['Step 2 of 4', 'The web server finds the page you asked for.'],
    ['Step 3 of 4', 'It sends the page back to you as a reply.'],
    ['Step 4 of 4', 'Your browser draws the page on your screen.'],
    ['Loaded', 'That request and reply are called HTTP. Every web page loads this way.'],
  ],
};

export function heroWebSvg(): string {
  const plate = base('HTTP · GET / · 200');
  const fig = `<g transform="translate(${FIG.x} ${FIG.y}) scale(${FIG.s})">${pin(0, plate.under)}${pin(150, `<g class="lm-body">${plate.over}${FIGURE.svg}</g>`)}${tagSvg}</g>`;
  const labels = [
    callout(ANCHOR.laptop, -34, -58, ['Your browser', 'asks for a page'], 800),
    callout(ANCHOR.server, 46, -84, ['Web server', 'sends the page back'], 1000),
  ].join('');
  const aria =
    "How a web page loads. Your browser, on a laptop, sends a request along a track to a web server. The server finds the page, the reply rides back along the track, and the browser draws the page on the laptop's screen.";
  return `<svg id="scene" class="lm-svg lm-hero" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${aria}">${fig}${labels}</svg>`;
}
