// The track page's words that are worked out from the track and its lessons when the page is built: the
// parts and their lessons as the cards show them, the exam chips, and what a returning visitor's card and the hero's
// resume card say at each position of a lesson. Nothing here runs in the browser.
import { CERT_TAGS, type CertTag } from '../content/certs';
import type { AvailableSummary, LessonSummary } from '../content/registry';
import type { Lesson, Track } from '../content/schema';
import { slotsFor } from '../engine/timeline';

const two = (n: number): string => String(n).padStart(2, '0');

/** One of a card's Watch, Learn and Practice marks: done, the one the visitor is on, or not reached. */
export type PartMark = 'done' | 'now' | '';

/** What a lesson's card shows while a visitor is part way through it at one position. */
export interface CardPlace {
  /** Watch, Learn and Practice. */
  parts: [PartMark, PartMark, PartMark];
  /** Where they are, in words: 'Watch, step 3 of 5', 'Learn'; a lesson of several units names the unit first. */
  note: string;
}

/** A lesson still to come: a compact row with its number and title. */
export interface SoonLesson {
  ready: false;
  key: string;
  /** Its number in the track, two digits. */
  n: string;
  title: string;
}

/** A ready lesson, as its card shows it. */
export interface ReadyLesson {
  ready: true;
  key: string;
  /** Its number in the track, two digits; `number` names the slot its figure comes in (`art<number>`). */
  n: string;
  number: number;
  title: string;
  url: string;
  subtitle: string;
  summary: string;
  /** '14 protocols' for a lesson of several units, then the names of its exams. */
  meta: string[];
  /** What `meta` holds, for screen readers: protocols and exams, or exams alone. */
  metaLabel: 'Protocols and exams' | 'Exams';
  /** Its exams, for the filter. */
  tags: CertTag[];
  /** For each position, what the card says while the lesson is in progress there (`cardPlaces`). */
  places: CardPlace[];
}

export interface TrackPart {
  /** Counting from 1. */
  n: number;
  title: string;
  /** How many of its lessons are ready. */
  ready: number;
  lessons: Array<ReadyLesson | SoonLesson>;
}

/**
 * The track's parts in order, each with its lessons as the page shows them. `entries` is the registry's
 * `getEntries(track.id)`; `lessonOf` finds a ready entry's lesson.
 */
export function trackParts(track: Track, entries: LessonSummary[], lessonOf: (entry: AvailableSummary) => Lesson): TrackPart[] {
  return track.parts.map((part, i) => {
    const lessons = part.lessons.map((planned): ReadyLesson | SoonLesson => {
      const entry = entries.find((e) => e.slug === planned.slug);
      if (entry === undefined) throw new Error(`The ${track.id} track lists "${planned.slug}", which has no entry.`);
      if (!entry.available) return { ready: false, key: entry.key, n: two(entry.number), title: entry.title };
      const protocols = entry.units > 1 ? [`${entry.units} protocols`] : [];
      return {
        ready: true,
        key: entry.key,
        n: two(entry.number),
        number: entry.number,
        title: entry.title,
        url: entry.url,
        subtitle: entry.subtitle,
        summary: entry.summary,
        meta: [...protocols, ...entry.certTags.map((t) => CERT_TAGS[t])],
        metaLabel: protocols.length > 0 ? 'Protocols and exams' : 'Exams',
        tags: entry.certTags,
        places: cardPlaces(lessonOf(entry)),
      };
    });
    return { n: i + 1, title: part.title, ready: lessons.filter((l) => l.ready).length, lessons };
  });
}

/** The exams some ready lesson helps with, in the usual order: one filter chip each. */
export function presentTags(entries: LessonSummary[]): CertTag[] {
  const present = new Set(entries.flatMap((e) => (e.available ? e.certTags : [])));
  return (Object.keys(CERT_TAGS) as CertTag[]).filter((tag) => present.has(tag));
}

/**
 * For each position of a lesson, the card's Watch, Learn and Practice marks and where the visitor is, in words. A
 * unit's Overview reaches none of the three yet; a step is part way through Watch; Learn has Watch done; Practice has
 * Watch and Learn done.
 */
export function cardPlaces(lesson: Lesson): CardPlace[] {
  const many = lesson.units.length > 1;
  return slotsFor(lesson).map((slot): CardPlace => {
    const u = lesson.units[slot.unit]!;
    const unit = many ? `${u.name}: ` : '';
    switch (slot.kind) {
      case 'overview':
        return { parts: ['', '', ''], note: `${unit}Overview` };
      case 'step':
        return { parts: ['now', '', ''], note: `${unit}Watch, step ${slot.step} of ${u.steps.length}` };
      case 'learn':
        return { parts: ['done', 'now', ''], note: `${unit}Learn` };
      case 'practice':
        return { parts: ['done', 'done', 'now'], note: `${unit}Practice` };
    }
  });
}

/** For each position of a lesson, the sub-heading of the step a visitor resumes at there; null away from a step. */
export function nextUps(lesson: Lesson): Array<string | null> {
  return slotsFor(lesson).map((slot) => (slot.kind === 'step' ? lesson.units[slot.unit]!.steps[slot.step - 1]!.sub : null));
}
