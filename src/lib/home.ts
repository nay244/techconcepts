// Home's words and pictures, worked out from the tracks and lessons when the page is built: the small lesson a visitor
// can try on the page, and the tracks to begin with. Nothing here runs in the browser, and nothing here reads
// progress: a returning visitor sees the same page.
import type { CoverId } from '../art/figures/covers';
import { drawNetMap, type NetMapData } from '../art/scenes/net-map';
import { getEntries, getLesson, trackTotals, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { positionOf } from '../engine/timeline';
import { numberedSources } from '../lesson/sourceNumbers';
import { lessonStamp } from './checked';
import type { LessonStamp } from './stamp';
import { firstSentence } from './text';
import { TRACK_COVERS } from './tracks-page';

// ---------------------------------------------------------------- the lesson you can try on Home

export interface HomeDemoStep {
  n: number;
  id: string;
  title: string;
  sub: string;
  narrative: string;
  /** What the step sends, in order: who to whom, and the words on the message. */
  messages: { from: string; to: string; tag: string; kind: string }[];
  /** What the scene shows for the step: whether a way across the map is lit, and the ids of the parts at work. */
  lights: { trail: boolean; busy: string[] };
}

export interface HomeDemo {
  /** The lesson the demo is a part of, and where the whole of it is. */
  lesson: { title: string; fullName: string; url: string; number: number; track: string };
  /** Every Watch step, in the lesson's own words. */
  steps: HomeDemoStep[];
  learn: {
    lead: string;
    terms: { idea: string; name: string }[];
    /** Every source, in the order the Lesson page numbers them: its short name, its full label and where it is. */
    sources: HomeSource[];
    /** Whether the lesson numbers its sources (a lesson that cites nothing yet does not). */
    numbered: boolean;
    /** The lesson's stamp: the day it was checked, or null, and how many sources it lists in all. */
    stamp: LessonStamp;
  };
  /** The same exchange with the line sealed: the next lesson, in its own words. */
  sealed: { title: string; lead: string; url: string; number: number };
  /** The lesson's first question. Each choice explains itself; one is right. */
  practice: { prompt: string; options: { text: string; feedback: string; right: boolean }[] };
  /** The lesson's map with only its own layer, and one lit way drawn in for each step that sends something. */
  scene: string;
  /** The full lesson, opened at its first step, its Learn part and its Practice part. */
  parts: { watch: string; learn: string; practice: string };
  /** The first Watch step (counted from 1) in which the page on the laptop shows its words, and the first its pictures. */
  page: { words: number; pictures: number };
  /** The drawing's four callouts, for the phone's key: the drawing's own words, in two bands (D16 §2.2.3). */
  key: HomeKey;
  /** The part of the map a phone shows, and the map's own frame (D16 §2.2.2). */
  crop: HomeCrop;
}

/** One line of a callout, by the drawing's own kind: an address, a sub-line, or the laptop's state. */
export interface KeyLine {
  kind: 'addr' | 'sub' | 'state';
  text: string;
}

/** A callout moved out of the drawing into the key: its name and its lines; `end` for the right-aligned ones. */
export interface KeyCall {
  name: string;
  lines: KeyLine[];
  end: boolean;
}

export interface HomeKey {
  above: KeyCall[];
  below: KeyCall[];
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HomeCrop extends Box {
  /** The SVG's own viewBox, which the crop does not change. */
  view: Box;
}

export interface HomeSource {
  name: string;
  label: string;
  url: string;
}

/** A source's short name: its label up to the first ": ". A label with no ": " is its own name. */
export function sourceName(label: string): string {
  const at = label.indexOf(': ');
  return at === -1 ? label : label.slice(0, at);
}

/** A lesson with this many sources or fewer shows them all. */
const SHOW_ALL = 6;
/** A longer list shows this many and folds the rest. */
const SHOWN = 3;

/** The sources Learn shows, and the ones it folds behind "Show the other N" (never fewer than 4). */
export function foldSources<T>(sources: T[]): { shown: T[]; folded: T[] } {
  return sources.length <= SHOW_ALL ? { shown: sources, folded: [] } : { shown: sources.slice(0, SHOWN), folded: sources.slice(SHOWN) };
}

/** Where the page on the laptop is lit: Watch steps from a start on, and then Learn and Practice. */
export interface Lit {
  steps: number[];
  parts: ('learn' | 'practice')[];
}

/** The page stays once drawn: its words from step `words` on and its pictures from step `pictures` on, through Learn and Practice. */
export function litSteps(page: { words: number; pictures: number }, last: number): { words: Lit; pictures: Lit } {
  const from = (first: number): Lit => ({ steps: Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => first + i), parts: ['learn', 'practice'] });
  return { words: from(page.words), pictures: from(page.pictures) };
}

/**
 * The part of the map a phone shows, in the map's own units: lesson 1's layer, with every trail, every busy part and the
 * page on the laptop inside it and a few units to spare (D16 §2.2.2, measured). The SVG's viewBox is not changed.
 */
export const CROP: Box = { x: -78, y: -22, w: 604, h: 232 };

/** The four callouts the phone's key repeats, by the drawing's own first line, with the band each belongs to. */
const KEY_CALLS = [
  { name: 'Your laptop', band: 'above', end: false },
  { name: 'DNS resolver', band: 'above', end: false },
  { name: 'The internet', band: 'below', end: true },
  { name: 'Web server', band: 'below', end: true },
] as const;

const LINE_KINDS: Record<string, KeyLine['kind']> = { 'nm-addr': 'addr', 'nm-sub': 'sub', 'nm-state': 'state' };

const unescape = (text: string): string => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** The map's own frame, read from the drawing. */
export function viewBoxOf(svg: string): Box {
  const m = /viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/.exec(svg);
  if (m === null) throw new Error("The network map has no viewBox for Home's demo to crop.");
  return { x: Number(m[1]), y: Number(m[2]), w: Number(m[3]), h: Number(m[4]) };
}

/**
 * The key's words and the leaders' starts, read out of the drawn callouts (the four `<g class="nm-call">` groups whose
 * first `<text>` is in KEY_CALLS), so the key cannot drift from the drawing. Throws when one of the four is missing.
 */
export function readKey(svg: string): { key: HomeKey; dots: { cx: number; cy: number; band: 'above' | 'below' }[] } {
  const drawn = [...svg.matchAll(/<g class="nm-call">(.*?)<\/g>/g)].map((g) => {
    const texts = [...g[1]!.matchAll(/<text class="(nm-[a-z]+)"[^>]*>([^<]*)<\/text>/g)]
      .map((t) => ({ cls: t[1]!, text: unescape(t[2]!) }))
      .filter((t) => t.text !== '');
    const dot = /<circle class="nm-lead-dot" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/.exec(g[1]!);
    return { texts, dot };
  });
  const key: HomeKey = { above: [], below: [] };
  const dots: { cx: number; cy: number; band: 'above' | 'below' }[] = [];
  for (const call of KEY_CALLS) {
    const found = drawn.find((d) => d.texts[0]?.text === call.name);
    if (found === undefined || found.dot === null) throw new Error(`The network map has no "${call.name}" callout for Home's phone key.`);
    key[call.band].push({
      name: call.name,
      end: call.end,
      lines: found.texts.slice(1).map((t) => ({ kind: LINE_KINDS[t.cls] ?? 'sub', text: t.text })),
    });
    dots.push({ cx: Number(found.dot[1]), cy: Number(found.dot[2]), band: call.band });
  }
  return { key, dots };
}

/** A leader for each callout: a vertical line from its own lead dot to the crop's edge, and a dot at the start. */
function leaders(dots: { cx: number; cy: number; band: 'above' | 'below' }[]): string {
  const edge = { above: CROP.y, below: CROP.y + CROP.h };
  const body = dots.map(({ cx, cy, band }) => `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)}V${edge[band]}"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3"/>`).join('');
  return `<g class="home-leads" aria-hidden="true">${body}</g>`;
}

/** The CSS that crops the drawing to CROP on a phone: a box of the crop's shape, the SVG wider and shifted inside it. */
export function cropCss(crop: HomeCrop): string {
  const { view } = crop;
  return (
    `.demo .demo__scene .demo__crop{overflow:hidden;aspect-ratio:${crop.w} / ${crop.h}}` +
    `.demo .demo__scene .demo__crop > svg{width:calc(100% * ${view.w} / ${crop.w});max-width:none;max-height:none;` +
    `margin:calc(-100% * ${crop.y - view.y} / ${crop.w}) 0 0 calc(-100% * ${crop.x - view.x} / ${crop.w})}`
  );
}

/** The driver's own trail and its edge, where the demo's lit ways are drawn in beside them (src/art/scenes/net-map.ts). */
const TRAIL = '<polyline class="nm-trail" id="nm-trail" points="" style="opacity:0"/>';

const escape = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Writes words into one of the map's empty text slots, by its id. On a lesson page the driver does this when it
 * starts (src/scenes/drivers/net-map.ts); Home's copy has no driver, so its words go in when the page is built.
 */
function write(svg: string, id: string, words: string): string {
  const slot = new RegExp(`(<text\\b[^>]*\\sid="${id}"[^>]*>)(</text>)`);
  if (!slot.test(svg)) throw new Error(`The network map has no empty #${id} for Home's demo to write in.`);
  return svg.replace(slot, (_whole, open: string, close: string) => `${open}${escape(words)}${close}`);
}

/** A lead's statements as the Learn part shows them (src/lesson/Explanation.tsx): their texts, one space between. */
export function leadText(lead: { text: string }[]): string {
  return lead.map((statement) => statement.text).join(' ');
}

/** How many ideas the Learn part lists: enough to show the pattern, the idea first and then its name. */
const TERMS = 6;

/**
 * The lesson a visitor can try on Home: lesson 1, HTTP. Every Watch step of how a web page arrives, its Learn part
 * and its first question, each word of it the lesson's own; and a pointer to the sealed version, HTTPS, the lesson
 * after it. Throws when a lesson is not ready, or is not drawn on the network map.
 */
export function homeDemo(slug = 'what-is-http', sealedSlug = 'what-is-https'): HomeDemo {
  const track = tracks[0]!;
  const entries = getEntries(track.id);
  const entryOf = (s: string): AvailableSummary => {
    const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === s);
    if (entry === undefined) throw new Error(`Home's demo needs the ${track.id}/${s} lesson, and it is not ready.`);
    return entry;
  };
  const [entry, sealedEntry] = [entryOf(slug), entryOf(sealedSlug)];
  const [lesson, sealedLesson] = [getLesson(slug)!, getLesson(sealedSlug)!];
  if (lesson.figure !== 'net-map') throw new Error(`Home's demo lights the network map; ${slug} draws "${lesson.figure}".`);
  const unit = lesson.units[0]!;
  const question = unit.practice[0];
  if (question === undefined) throw new RangeError(`Home's demo ends on a question; "${slug}" has none.`);

  const figure = drawNetMap(unit.scene.layers);
  const { M, O, TZ, routes } = figure.data as NetMapData;
  const labelOf = new Map(unit.scene.parties.map((p) => [p.place, p.label]));
  const named = (place: string): string => labelOf.get(place) ?? place;
  // A place's light: the map's own for home, the resolver and the routers; a server's is named for its layer.
  const layerOf = new Map(unit.scene.layers.map((key) => [key.split(':')[1]!, key.split(':')[0]!]));
  const busyOf = (place: string): string => (layerOf.has(place) ? `nm-${layerOf.get(place)}-busy-${place}` : `nm-busy-${place}`);

  const trails: string[] = [];
  const steps = unit.steps.map((step, i): HomeDemoStep => {
    const sent = step.events.filter((e) => e.type === 'message');
    const first = sent[0];
    if (first !== undefined) {
      const route = routes[`${first.from}>${first.to}`];
      if (route === undefined) throw new Error(`The map has no way from ${first.from} to ${first.to} for Home's demo.`);
      // Along the cables' tops, in the figure's own frame, as the driver draws a trail.
      const points = route.map(([x, y]) => `${(O[0] + M[0]! * x + M[1]! * y + M[2]! * TZ).toFixed(1)},${(O[1] + M[3]! * x + M[4]! * y + M[5]! * TZ).toFixed(1)}`).join(' ');
      trails.push(`<polyline class="nm-trail home-trail" data-step="${i + 1}" points="${points}"/>`);
    }
    // The laptop is at work in every step; so is whoever it is talking to.
    const busy = [...new Set(['laptop', ...sent.flatMap((e) => [e.from, e.to])])].map(busyOf);
    return {
      n: i + 1,
      id: step.id,
      title: step.title,
      sub: step.sub,
      narrative: step.narrative,
      messages: sent.map((e) => ({ from: named(e.from), to: named(e.to), tag: e.tag, kind: e.kind })),
      lights: { trail: first !== undefined, busy },
    };
  });

  // The page on the laptop follows the lesson's own cues, whatever step they fall in.
  const cued = (match: (arg: string | undefined) => boolean): number => unit.steps.findIndex((step) => step.events.some((e) => ('cues' in e ? e.cues ?? [] : []).some((c) => c.cue === 'page' && match(c.arg)))) + 1;
  const page = { words: cued(() => true), pictures: cued((arg) => arg === 'full') };
  if (page.words === 0) throw new Error(`Home's demo draws the page on the laptop from the lesson's cues; ${slug} has no page cue.`);
  if (page.pictures === 0) throw new Error(`Home's demo draws the page's pictures from the lesson's cues; ${slug} has no page: 'full' cue.`);

  // The words the lesson gives the laptop: what it wants, and the address in its browser.
  const labels = unit.scene.labels;
  const drawn = write(write(figure.svg, 'nm-lapState', labels.laptop ?? ''), 'nm-url', labels.url ?? '');
  if (!drawn.includes(TRAIL)) throw new Error("The network map's trail is not where Home's demo draws beside it.");
  const listed = numberedSources(unit);
  const stamp = lessonStamp(lesson);
  if (stamp.sources !== listed.list.length) {
    throw new Error(`Home's demo lists ${listed.list.length} sources for ${slug}, and the lesson's stamp says ${stamp.sources}.`);
  }
  const at = (kind: 'step' | 'learn' | 'practice'): string => `${entry.url}?step=${positionOf(lesson, 0, kind)}`;
  const { key, dots } = readKey(drawn);
  const withTrails = drawn.replace(TRAIL, `${TRAIL}${trails.join('')}`);
  return {
    lesson: { title: lesson.title, fullName: unit.fullName, url: entry.url, number: entry.number, track: track.title },
    steps,
    learn: {
      lead: leadText(unit.learn.lead),
      terms: unit.learn.terms.slice(0, TERMS).map((t) => ({ idea: t.idea, name: t.name })),
      sources: listed.list.map((r) => ({ name: sourceName(r.label), label: r.label, url: r.url })),
      numbered: listed.numberOf.size > 0,
      stamp,
    },
    sealed: { title: sealedLesson.title, lead: leadText(sealedLesson.units[0]!.learn.lead), url: sealedEntry.url, number: sealedEntry.number },
    practice: { prompt: question.prompt, options: question.options.map((o, i) => ({ text: o.text, feedback: o.feedback, right: i === question.answer })) },
    scene: withTrails.replace(/<\/svg>\s*$/, `${leaders(dots)}</svg>`),
    parts: { watch: at('step'), learn: at('learn'), practice: at('practice') },
    page,
    key,
    crop: { ...CROP, view: viewBoxOf(drawn) },
  };
}

// ---------------------------------------------------------------- the demo's states, as CSS

/** The demo's three radio groups, in the order of its tabs. */
export const PARTS = ['watch', 'learn', 'practice'] as const;
/** The groups that are Tab stops and are heard, by the part on show (D16 §2.4: a group not on show is not a stop). */
const GROUPS_SHOWN: Record<(typeof PARTS)[number], string[]> = { watch: ['step'], learn: [], practice: ['answer'] };

const UI = '.demo__ui';
const when = (...ids: string[]): string => `${ids.map((id) => `#${id}:checked`).join(' ~ ')} ~ ${UI}`;
const ring = (offset: number): string => `outline:2px solid var(--focus);outline-offset:${offset}px`;
const focus = (id: string, offset = 2): string => `#${id}:focus-visible ~ ${UI} label[for="${id}"]{${ring(offset)}}`;

/**
 * The demo's states, as CSS. The demo is three groups of radio buttons (the part, the step, the answer) that come before
 * its panel, so a checked button can show, hide and light things in the panel with the sibling selector alone. The
 * scene's own parts are switched the same way; where its driver would set an inline `opacity:0`, the rule is !important.
 * The looks (the colours) are tokens of the Card stack (src/styles/card-stack.css); the rules here decide only what shows.
 */
export function demoCss(demo: HomeDemo): string {
  const last = demo.steps.length;
  // Before any step: no way is lit, and the laptop's screen is empty. (The map is drawn with the page loaded, and a
  // lesson's driver clears it when it starts; here the first rule does.)
  const css: string[] = ['.home-trail{opacity:0;transition:opacity 200ms ease}', `${UI} #nm-page [data-part]{opacity:0}`];
  // A group whose part is not on show is not a Tab stop. `visibility`, not `display`: it keeps its checked state.
  const hidden = PARTS.flatMap((part) => ['step', 'answer'].filter((g) => !GROUPS_SHOWN[part].includes(g)).map((g) => `#demo-${part}:checked ~ .demo__in--${g}`));
  css.push(`${hidden.join(',')}{visibility:hidden}`);
  for (const part of PARTS) {
    const id = `demo-${part}`;
    css.push(`${when(id)} .demo__pane--${part}{display:${part === 'watch' ? 'contents' : 'block'}}`);
    // The tab on show: taller, bold, joined to the card, and marked.
    css.push(`${when(id)} .demo__parts label[for="${id}"]{z-index:1;height:calc(var(--tab) + 2px);border-bottom:0;background:var(--cs-card);color:var(--ink-strong);font-weight:700}`);
    css.push(`${when(id)} .demo__parts label[for="${id}"]::before{display:block}`);
    css.push(focus(id, -7));
  }
  for (const step of demo.steps) {
    const id = `demo-s${step.n}`;
    css.push(`${when(id)} .demo__say--${step.n}{display:block}`);
    css.push(`${when(id)} .demo__next--${step.n}{display:inline-flex}`);
    css.push(`${when(id)} .demo__row[for="${id}"]{border-color:var(--cs-edge);background:var(--cs-here-wash)}`);
    css.push(`${when(id)} .demo__row[for="${id}"] .demo__n{--tile-bg:var(--cs-here);background:var(--cs-here);color:var(--cs-here-ink);border-color:var(--cs-edge)}`);
    // The steps before the one you are on are done: a tick, drawn, in place of the number (which stays in the markup).
    for (const done of demo.steps.filter((s) => s.n < step.n)) {
      css.push(`${when(id)} .demo__row[for="demo-s${done.n}"] .demo__n{background:var(--cs-card);border-color:var(--cs-edge);color:var(--ink-strong);font-size:0}`);
      css.push(`${when(id)} .demo__row[for="demo-s${done.n}"] .demo__n::after{display:block}`);
    }
    css.push(`${when(id)} .demo__row[for="${id}"] .demo__t{display:block}`);
    css.push(focus(id));
    // On a phone a row is display: contents and draws no ring, so its tile does.
    css.push(`@media (max-width: 860px){#${id}:focus-visible ~ ${UI} .demo__row[for="${id}"] .demo__n{${ring(2)}}}`);
    // The way the step's messages take lights up, and so does everything at work on it.
    if (step.lights.trail) css.push(`${when('demo-watch', id)} .home-trail[data-step="${step.n}"]{opacity:.9}`);
    css.push(`${step.lights.busy.map((busy) => `${when('demo-watch', id)} #${busy}`).join(',')}{opacity:1}`);
  }
  // The page on the laptop follows the lesson's own cues, and stays through Learn and Practice.
  const lit = litSteps(demo.page, last);
  const litWhen = (on: Lit): string[] => [...on.steps.map((n) => when('demo-watch', `demo-s${n}`)), ...on.parts.map((part) => when(`demo-${part}`))];
  css.push(`${litWhen(lit.words).map((s) => `${s} #nm-page [data-part="text"]`).join(',')}{opacity:1!important}`);
  css.push(`${litWhen(lit.pictures).map((s) => `${s} #nm-page [data-part="pic"]`).join(',')}{opacity:1!important}`);
  demo.practice.options.forEach((option, i) => {
    const id = `demo-a${i + 1}`;
    css.push(`${when(id)} .demo__why--${i + 1}{display:block}`);
    // An answer picked is pressed in. The right one's ring is filled with a tick; any other holds a dot.
    css.push(`${when(id)} .demo__pick[for="${id}"]{border-color:var(--cs-edge);background:var(--cs-quiet);box-shadow:1px 1px 0 var(--cs-edge);transform:translate(2px,2px)}`);
    if (option.right) {
      css.push(`${when(id)} .demo__pick[for="${id}"]::before{border-color:var(--cs-done);background:var(--cs-done)}`);
      css.push(`${when(id)} .demo__pick[for="${id}"]::after{left:19px;width:11px;height:6px;margin-top:-5px;border:solid var(--cs-card);border-width:0 0 2.5px 2.5px;transform:rotate(-45deg)}`);
    } else {
      css.push(`${when(id)} .demo__pick[for="${id}"]::after{left:20px;width:8px;height:8px;margin-top:-4px;border-radius:50%;background:var(--cs-edge)}`);
    }
    css.push(focus(id));
  });
  // A phone shows the drawing cropped to lesson 1's layer, its callouts in the key.
  css.push(`@media (max-width: 860px){${cropCss(demo.crop)}}`);
  return css.join('\n');
}

// ---------------------------------------------------------------- the basics, in order

export interface HomeStop {
  id: string;
  title: string;
  /** Its place in the order a beginner takes the tracks. */
  order: string;
  blurb: string;
  /** Its panel on the Tracks page. */
  href: string;
  cover: CoverId;
  /** "14 lessons", or "8 of 20 lessons ready". */
  count: string;
  lessons: { ready: number; planned: number };
}

/** The order words, by place: the beginner entry, then the depth. */
const ORDER = ['Start here', 'Then go deeper'] as const;

/**
 * Home's stops along the cable: every track that has lessons, in the site's order. A track still being written is
 * not listed here; the Tracks page has it. Only numbers the tracks give: no progress, no exams.
 */
export function homeStops(): HomeStop[] {
  return tracks.map((track, i): HomeStop => {
    const cover = TRACK_COVERS[track.id];
    if (cover === undefined) throw new Error(`The ${track.id} track has no cover for Home.`);
    const { available, planned } = trackTotals(getEntries(track.id));
    return {
      id: track.id,
      title: track.title,
      order: ORDER[i] ?? ORDER[ORDER.length - 1]!,
      blurb: firstSentence(track.description),
      href: `/tracks#${track.id}`,
      cover,
      count: available === planned ? `${planned} lessons` : `${available} of ${planned} lessons ready`,
      lessons: { ready: available, planned },
    };
  });
}
