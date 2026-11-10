// Home's words and pictures that are worked out from the tracks and lessons when the page is built: the track cards,
// the OSI Model sheet "from the inside" with its links into each part, and where a returning visitor is (the track
// page). Nothing here runs in the browser.
import type { CoverId } from '../art/figures/covers';
import { drawFigure } from '../art/scenes';
import { fillLabels } from '../art/scenes/labels';
import { getEntries, getLesson, getTrack, trackTotals, type AvailableSummary } from '../content/registry';
import type { Cue, Lesson } from '../content/schema';
import { plannedTracks, tracks } from '../content/tracks';
import { positionOf, resumeLabel, slotsFor } from '../engine/timeline';
import { levelLabel } from './entries';
import { STATUS_WORDS } from './hub';
import { firstSentence } from './text';
import { TRACK_COVERS } from './tracks-page';

const two = (n: number): string => String(n).padStart(2, '0');

// ---------------------------------------------------------------- track cards

export interface HomeTrackCard {
  id: string;
  title: string;
  /** The track's panel on Tracks, `/tracks#<id>`, for a track with lessons and one without alike. */
  href: string;
  cover: CoverId;
  /** The small labels over the title: a plain one is grey, the others in the accent. */
  chips: { text: string; plain: boolean }[];
  blurb: string;
  /** '14 lessons' when all are ready, '4 of 19 lessons ready' when some are, 'Lessons on the way' when none are. */
  count: string;
  /** The words on the card's button. */
  go: string;
  /** False for a track with no lessons yet. */
  ready: boolean;
}

/**
 * Home's three cards: every track with lessons in the site's order, the first flagged "Start here", then each planned
 * track. Only numbers the tracks give: no progress, no exams.
 */
export function homeTrackCards(): HomeTrackCard[] {
  const ready = tracks.map((track, i): HomeTrackCard => {
    const cover = TRACK_COVERS[track.id];
    if (cover === undefined) throw new Error(`The ${track.id} track has no cover for Home's card.`);
    const { available, planned } = trackTotals(getEntries(track.id));
    const chips = [{ text: levelLabel(track.level), plain: false }];
    if (i === 0) chips.push({ text: 'Start here', plain: true });
    return {
      id: track.id,
      title: track.title,
      href: `/tracks#${track.id}`,
      cover,
      chips,
      blurb: firstSentence(track.description),
      count: available === planned ? `${planned} lessons` : `${available} of ${planned} lessons ready`,
      go: 'See the lessons →',
      ready: true,
    };
  });
  const later = plannedTracks.map(
    (track): HomeTrackCard => ({
      id: track.id,
      title: track.title,
      href: `/tracks#${track.id}`,
      cover: track.cover,
      chips: [{ text: STATUS_WORDS['not-ready'], plain: true }],
      blurb: track.blurb,
      count: 'Lessons on the way',
      go: 'See the track',
      ready: false,
    }),
  );
  return [...ready, ...later];
}

// ---------------------------------------------------------------- a lesson from the inside

/**
 * The OSI Model figure lit as the lesson's driver lights it for these cues (src/scenes/drivers/osi.ts): each `layer`
 * cue's block takes `on` on its group and the kit's lit state (`data-lit`) on its slab, and its machine's callout turns
 * current (`focus`). Other cues (`peer`) are left alone. Throws for a block the figure does not have.
 */
export function osiLitAt(svg: string, cues: readonly Cue[]): string {
  let out = svg;
  for (const { cue, arg = '' } of cues) {
    if (cue !== 'layer') continue;
    const [place, n] = arg.split(':');
    const group = `<g class="osi-L" id="osi-L-${place}-${n}">`;
    const slab = '<g class="iso-solid"';
    const at = out.indexOf(group);
    if (at === -1 || !out.startsWith(slab, at + group.length)) throw new Error(`The OSI figure has no block #osi-L-${place}-${n} to light.`);
    out = `${out.slice(0, at)}<g class="osi-L on" id="osi-L-${place}-${n}">${slab} data-lit=""${out.slice(at + group.length + slab.length)}`;
    const call = `<g class="osi-call" id="osi-call-${place}">`;
    if (out.includes(call)) out = out.replace(call, `<g class="osi-call focus" id="osi-call-${place}">`);
  }
  return out;
}

export interface InsideSheet {
  /** 'Networking Concepts · lesson 1'. */
  label: string;
  title: string;
  /** The lesson's page in the track, where it opens at its Overview. */
  url: string;
  /** The Overview's opening words, with the lesson's `**bold**` marks left for the page to set. */
  hook: string;
  /** The scene's title, 'Your laptop to a web server'. */
  scene: string;
  /** The first Watch steps: their number (two digits), technical title and plain-words subtitle. */
  steps: { n: string; title: string; sub: string }[];
  /** The lesson's figure, its words written in and lit as its first step leaves it. */
  figure: string;
  /** The lesson's page at its first Watch step, its Learn and its Practice. */
  parts: { watch: string; learn: string; practice: string };
}

/**
 * A lesson as Home shows it "from the inside": OSI Model of Networking Concepts unless told otherwise, from its first
 * unit. Throws when the lesson is not ready in that track, or has fewer Watch steps than the sheet shows.
 */
export function insideSheet(trackId = 'networking', slug = 'osi-model', count = 3): InsideSheet {
  const track = getTrack(trackId);
  const entry = getEntries(trackId).find((e): e is AvailableSummary => e.available && e.slug === slug);
  const lesson: Lesson | undefined = getLesson(slug);
  if (track === undefined || entry === undefined || lesson === undefined) {
    throw new Error(`Home's inside sheet needs the ${trackId}/${slug} lesson, and it is not ready.`);
  }
  if (lesson.figure !== 'osi') throw new Error(`Home's inside sheet lights the OSI figure; ${slug} draws "${lesson.figure}".`);
  const unit = lesson.units[0]!;
  if (unit.steps.length < count) throw new RangeError(`Lesson "${slug}" has ${unit.steps.length} Watch steps; the sheet shows ${count}.`);
  // As the driver draws a step once it has played: what the step's last note or message lights.
  const landed = unit.steps[0]!.events.filter((e) => e.type === 'note' || e.type === 'message').at(-1);
  const cues = landed?.cues ?? [];
  const at = (kind: 'step' | 'learn' | 'practice'): string => `${entry.url}?step=${positionOf(lesson, 0, kind)}`;
  return {
    label: `${track.title} · lesson ${entry.number}`,
    title: lesson.title,
    url: entry.url,
    hook: unit.overview.hook,
    scene: unit.scene.title,
    steps: unit.steps.slice(0, count).map((s, i) => ({ n: two(i + 1), title: s.title, sub: s.sub })),
    figure: osiLitAt(fillLabels(drawFigure(lesson.figure).svg, unit.scene.labels), cues),
    parts: { watch: at('step'), learn: at('learn'), practice: at('practice') },
  };
}

// ---------------------------------------------------------------- where a returning visitor is

/**
 * Where each position of a lesson is, worded to sit in "You’re on … in <lesson>": a step keeps resumeLabel's words
 * ('step 3 of 5'), and the other parts are named ('the Overview', 'the Learn part', 'the Practice part'). In a lesson
 * of many units the unit's name says which: 'DNS step 2 of 5', 'the DNS Overview', 'the DNS Learn part'.
 */
export function resumePlaces(lesson: Lesson): string[] {
  const many = lesson.units.length > 1;
  return slotsFor(lesson).map((slot, p) => {
    const u = lesson.units[slot.unit]!;
    const unit = many ? `${u.name} ` : '';
    switch (slot.kind) {
      case 'overview':
        return `the ${unit}Overview`;
      case 'step':
        return many ? `${unit}step ${slot.step} of ${u.steps.length}` : resumeLabel(lesson, p);
      case 'learn':
        return `the ${unit}Learn part`;
      case 'practice':
        return `the ${unit}Practice part`;
    }
  });
}
