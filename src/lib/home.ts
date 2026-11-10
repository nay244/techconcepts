// Home's words and pictures, worked out from the tracks and lessons when the page is built: the small lesson a visitor
// can try on the page, the questions that open a lesson, and the tracks in order. Nothing here runs in the browser,
// and nothing here reads progress: a returning visitor sees the same page.
import type { CoverId } from '../art/figures/covers';
import { drawFigure } from '../art/scenes';
import type { DhcpSceneData } from '../art/scenes/dhcp';
import { fillLabels } from '../art/scenes/labels';
import { getEntries, getLesson, trackTotals, type AvailableSummary } from '../content/registry';
import { plannedTracks, tracks } from '../content/tracks';
import { positionOf } from '../engine/timeline';
import { STATUS_WORDS } from './hub';
import { firstSentence } from './text';
import { TRACK_COVERS } from './tracks-page';

const two = (n: number): string => String(n).padStart(2, '0');

// ---------------------------------------------------------------- the lesson you can try on Home

export interface HomeDemo {
  /** The lesson the demo is a part of, and where the whole of it is. */
  lesson: { title: string; fullName: string; url: string; number: number; track: string };
  /** The Watch steps shown, in the lesson's own words. */
  steps: { n: number; id: string; title: string; sub: string; narrative: string }[];
  learn: { lead: string; terms: { idea: string; name: string }[]; sources: { label: string; url: string }[] };
  /** The lesson's first question. Each choice explains itself; one is right. */
  practice: { prompt: string; options: { text: string; feedback: string; right: boolean }[] };
  /** The lesson's scene, as its page draws it before anything has played. */
  scene: string;
  /** Where each step's message tag sits on the scene, in the drawing's own units from its origin. */
  tags: { step: number; id: string; x: number; y: number }[];
  /** The full lesson, opened at its first step, its Learn part and its Practice part. */
  parts: { watch: string; learn: string; practice: string };
}

/** How many Watch steps the demo shows: the four messages that get the laptop its address. */
const DEMO_STEPS = 4;
/** How far along its way through the air each step's tag is drawn, of 32. The last has landed at the laptop. */
const TAG_AT = [16, 16, 16, 2] as const;

/**
 * The lesson a visitor can try on Home: DHCP's first four Watch steps, its Learn part and its first question, every
 * word of it the lesson's own. Throws when the lesson is not ready, is not drawn on the DHCP scene, or is too short.
 */
export function homeDemo(trackId = 'networking', slug = 'dhcp'): HomeDemo {
  const track = tracks.find((t) => t.id === trackId);
  const entry = getEntries(trackId).find((e): e is AvailableSummary => e.available && e.slug === slug);
  const lesson = getLesson(slug);
  if (track === undefined || entry === undefined || lesson === undefined) throw new Error(`Home's demo needs the ${trackId}/${slug} lesson, and it is not ready.`);
  if (lesson.figure !== 'dhcp') throw new Error(`Home's demo steps the DHCP scene; ${slug} draws "${lesson.figure}".`);
  const unit = lesson.units[0]!;
  const question = unit.practice[0];
  if (unit.steps.length < DEMO_STEPS || question === undefined) throw new RangeError(`Home's demo needs ${DEMO_STEPS} Watch steps and a question; "${slug}" is short of them.`);

  const figure = drawFigure(lesson.figure);
  const { M, arc } = figure.data as DhcpSceneData;
  const steps = unit.steps.slice(0, DEMO_STEPS);
  const at = (kind: 'step' | 'learn' | 'practice'): string => `${entry.url}?step=${positionOf(lesson, 0, kind)}`;
  return {
    lesson: { title: lesson.title, fullName: unit.fullName, url: entry.url, number: entry.number, track: track.title },
    steps: steps.map((s, i) => ({ n: i + 1, id: s.id, title: s.title, sub: s.sub, narrative: s.narrative })),
    learn: {
      lead: unit.learn.lead[0]!.text,
      terms: unit.learn.terms.slice(0, 5).map((t) => ({ idea: t.idea, name: t.name })),
      sources: unit.references.map((r) => ({ label: r.label, url: r.url })),
    },
    practice: { prompt: question.prompt, options: question.options.map((o, i) => ({ text: o.text, feedback: o.feedback, right: i === question.answer })) },
    scene: fillLabels(figure.svg, unit.scene.labels),
    tags: steps.map((s, i) => {
      // The scene's camera as the driver uses it: a point's place on screen, from the drawing's origin.
      const [x, y, z] = arc[TAG_AT[i]!]!;
      return { step: i + 1, id: s.id === 'acknowledge' ? 'ack' : s.id, x: +(M[0]! * x + M[1]! * y + M[2]! * z).toFixed(1), y: +(M[3]! * x + M[4]! * y + M[5]! * z).toFixed(1) };
    }),
    parts: { watch: at('step'), learn: at('learn'), practice: at('practice') },
  };
}

// ---------------------------------------------------------------- questions that open a lesson

export interface HomeQuestion {
  question: string;
  /** The lesson that answers it: its name, the one line the track gives it, its number and its address. */
  name: string;
  purpose: string;
  number: string;
  url: string;
}

/** Something a beginner may have wondered, and the first-track lesson whose opening answers it. */
const QUESTIONS: readonly { slug: string; question: string }[] = [
  { slug: 'what-is-dns', question: 'How does a website’s name turn into a number?' },
  { slug: 'what-is-https', question: 'Who can read a web page on its way to you?' },
  { slug: 'what-is-smtp', question: 'Where does an email go when you press Send?' },
  { slug: 'what-is-tcp', question: 'What if part of a message gets lost on the way?' },
];

/** Home's questions, each with the ready lesson of the first track that it opens. Throws when one is not ready. */
export function homeQuestions(): HomeQuestion[] {
  const first = tracks[0]!;
  const entries = getEntries(first.id);
  return QUESTIONS.map(({ slug, question }) => {
    const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === slug);
    const lesson = getLesson(slug);
    if (entry === undefined || lesson === undefined) throw new Error(`Home asks a question the ${first.id}/${slug} lesson answers, and it is not ready.`);
    return { question, name: entry.title, purpose: lesson.units[0]!.purpose, number: two(entry.number), url: entry.url };
  });
}

// ---------------------------------------------------------------- the tracks, in order

export interface HomeStop {
  id: string;
  title: string;
  /** Its place in the order a beginner takes the tracks. */
  order: string;
  blurb: string;
  /** Its panel on the Tracks page. */
  href: string;
  cover: CoverId;
  /** "14 lessons", "4 of 19 lessons ready", or the not-ready word for a track with none yet. */
  count: string;
  lessons: { ready: number; planned: number };
  ready: boolean;
}

/** The order words, by place: the beginner entry, the depth, and the certification track being written. */
const ORDER = ['Start here', 'Then go deeper', 'For the exam'] as const;

/**
 * Home's stops along the cable: every track with lessons in the site's order, then each planned track. Only numbers
 * the tracks give: no progress, no exams.
 */
export function homeStops(): HomeStop[] {
  const ready = tracks.map((track): Omit<HomeStop, 'order'> => {
    const cover = TRACK_COVERS[track.id];
    if (cover === undefined) throw new Error(`The ${track.id} track has no cover for Home.`);
    const { available, planned } = trackTotals(getEntries(track.id));
    return {
      id: track.id,
      title: track.title,
      blurb: firstSentence(track.description),
      href: `/tracks#${track.id}`,
      cover,
      count: available === planned ? `${planned} lessons` : `${available} of ${planned} lessons ready`,
      lessons: { ready: available, planned },
      ready: true,
    };
  });
  const later = plannedTracks.map(
    (track): Omit<HomeStop, 'order'> => ({
      id: track.id,
      title: track.title,
      blurb: track.blurb,
      href: `/tracks#${track.id}`,
      cover: track.cover,
      count: STATUS_WORDS['not-ready'],
      lessons: { ready: 0, planned: 0 },
      ready: false,
    }),
  );
  return [...ready, ...later].map((stop, i) => ({ ...stop, order: ORDER[i] ?? ORDER[ORDER.length - 1]! }));
}
