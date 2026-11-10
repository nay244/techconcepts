// Home's words and pictures, worked out from the tracks and lessons when the page is built: the small lesson a visitor
// can try on the page, and the tracks to begin with. Nothing here runs in the browser, and nothing here reads
// progress: a returning visitor sees the same page.
import type { CoverId } from '../art/figures/covers';
import { drawNetMap, type NetMapData } from '../art/scenes/net-map';
import { getEntries, getLesson, trackTotals, type AvailableSummary } from '../content/registry';
import { tracks } from '../content/tracks';
import { positionOf } from '../engine/timeline';
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
  learn: { lead: string; terms: { idea: string; name: string }[]; sources: { label: string; url: string }[] };
  /** The same exchange with the line sealed: the next lesson, in its own words. */
  sealed: { title: string; lead: string; url: string; number: number };
  /** The lesson's first question. Each choice explains itself; one is right. */
  practice: { prompt: string; options: { text: string; feedback: string; right: boolean }[] };
  /** The lesson's map with only its own layer, and one lit way drawn in for each step that sends something. */
  scene: string;
  /** The full lesson, opened at its first step, its Learn part and its Practice part. */
  parts: { watch: string; learn: string; practice: string };
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

  // The words the lesson gives the laptop: what it wants, and the address in its browser.
  const labels = unit.scene.labels;
  const drawn = write(write(figure.svg, 'nm-lapState', labels.laptop ?? ''), 'nm-url', labels.url ?? '');
  if (!drawn.includes(TRAIL)) throw new Error("The network map's trail is not where Home's demo draws beside it.");
  const at = (kind: 'step' | 'learn' | 'practice'): string => `${entry.url}?step=${positionOf(lesson, 0, kind)}`;
  return {
    lesson: { title: lesson.title, fullName: unit.fullName, url: entry.url, number: entry.number, track: track.title },
    steps,
    learn: {
      lead: unit.learn.lead[0]!.text,
      terms: unit.learn.terms.slice(0, TERMS).map((t) => ({ idea: t.idea, name: t.name })),
      sources: unit.references.map((r) => ({ label: r.label, url: r.url })),
    },
    sealed: { title: sealedLesson.title, lead: sealedLesson.units[0]!.learn.lead[0]!.text, url: sealedEntry.url, number: sealedEntry.number },
    practice: { prompt: question.prompt, options: question.options.map((o, i) => ({ text: o.text, feedback: o.feedback, right: i === question.answer })) },
    scene: drawn.replace(TRAIL, `${TRAIL}${trails.join('')}`),
    parts: { watch: at('step'), learn: at('learn'), practice: at('practice') },
  };
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
  /** "14 lessons", or "4 of 19 lessons ready". */
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
