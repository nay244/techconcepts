import { slotsFor } from '../engine/timeline';
import type { CertTag } from './certs';
import { LEGACY_LESSONS } from './legacy';
import { checkLimits, unneededOverrides } from './limits';
import type { Lesson, Track } from './schema';
import { tracks } from './tracks';

export type LessonSummary =
  | {
      available: true;
      key: string;
      trackId: string;
      slug: string;
      url: string;
      number: number;
      title: string;
      subtitle: string;
      partTitle: string;
      summary: string;
      certTags: CertTag[];
      /** Watch steps in every unit together. */
      stepCount: number;
      /** How many units the lesson has: 1 for most, one per protocol in How the Internet Works. */
      units: number;
      /** The last position in the lesson: the last unit's Practice. */
      maxPosition: number;
    }
  | {
      available: false;
      key: string;
      trackId: string;
      slug: string;
      number: number;
      title: string;
      partTitle: string;
    };

export type AvailableSummary = Extract<LessonSummary, { available: true }>;

/**
 * One entry per lesson the track plans, in track order, numbered from 1 across
 * all parts. `lessons` is keyed by slug; a planned lesson with no file is
 * returned as unavailable. Throws when a lesson is not in the track, is filed
 * under a different slug than its own, has a different title than the
 * track lists, does not fit the track's limits, or carries an override it
 * does not need.
 */
export function buildEntries(track: Track, lessons: Record<string, Lesson>): LessonSummary[] {
  const planned = new Map(track.parts.flatMap((part) => part.lessons.map((l) => [l.slug, l.title] as const)));
  for (const [slug, lesson] of Object.entries(lessons)) {
    const title = planned.get(slug);
    if (title === undefined) throw new Error(`Lesson "${slug}" is not listed in the ${track.id} track.`);
    if (lesson.slug !== slug) throw new Error(`Lesson filed as "${slug}" has the slug "${lesson.slug}"; the slug must match.`);
    if (lesson.title !== title) {
      throw new Error(`Lesson "${slug}" has the title "${lesson.title}", but the ${track.id} track lists the title "${title}".`);
    }
    const misfits = checkLimits(lesson, track.limits);
    if (misfits.length > 0) {
      throw new Error(`Lesson "${slug}" does not fit the ${track.id} track's limits:\n${misfits.map((m) => `  - ${m}`).join('\n')}`);
    }
    const unneeded = unneededOverrides(lesson, [track.limits]);
    if (unneeded.length > 0) {
      throw new Error(`Lesson "${slug}" has overrides the ${track.id} track does not need:\n${unneeded.map((m) => `  - ${m}`).join('\n')}`);
    }
  }

  const entries: LessonSummary[] = [];
  for (const part of track.parts) {
    for (const planned of part.lessons) {
      const base = {
        key: `${track.id}/${planned.slug}`,
        trackId: track.id,
        slug: planned.slug,
        number: entries.length + 1,
        title: planned.title,
        partTitle: part.title,
      };
      const lesson = Object.hasOwn(lessons, planned.slug) ? lessons[planned.slug] : undefined;
      entries.push(
        lesson === undefined
          ? { available: false, ...base }
          : {
              available: true,
              ...base,
              url: `/${track.id}/${planned.slug}`,
              subtitle: lesson.subtitle,
              summary: lesson.summary,
              certTags: lesson.certTags,
              stepCount: lesson.units.reduce((sum, u) => sum + u.steps.length, 0),
              units: lesson.units.length,
              maxPosition: slotsFor(lesson).length - 1,
            },
      );
    }
  }
  return entries;
}

/**
 * The nearest available lessons before and after `slug`, skipping planned
 * ones. `nextPlanned` is true when the entry right after `slug` exists but is
 * not available yet. An unknown slug has no neighbors.
 */
export function neighbors(
  entries: LessonSummary[],
  slug: string,
): { prev: AvailableSummary | null; next: AvailableSummary | null; nextPlanned: boolean } {
  const index = entries.findIndex((e) => e.slug === slug);
  if (index === -1) return { prev: null, next: null, nextPlanned: false };

  const isAvailable = (e: LessonSummary): e is AvailableSummary => e.available;
  const prev = entries.slice(0, index).reverse().find(isAvailable) ?? null;
  const next = entries.slice(index + 1).find(isAvailable) ?? null;
  const following = entries[index + 1];
  return { prev, next, nextPlanned: following !== undefined && !following.available };
}

/** `planned` counts every entry in the track (the "of 20" in "4 of 20 complete"). */
export function trackTotals(entries: LessonSummary[]): { available: number; planned: number } {
  return { available: entries.filter((e) => e.available).length, planned: entries.length };
}

const LESSON_PATH = /^\.\/lessons\/([^/]+)\/([^/]+)\.ts$/;

/**
 * Groups the glob result into `{ trackId: { slug: lesson } }`. The folder
 * name is the track id and the file name must equal the lesson's slug.
 */
export function groupLessonModules(modules: Record<string, Lesson>): Record<string, Record<string, Lesson>> {
  const grouped: Record<string, Record<string, Lesson>> = {};
  for (const [path, lesson] of Object.entries(modules)) {
    const match = LESSON_PATH.exec(path);
    if (match === null) throw new Error(`Unexpected lesson file path "${path}".`);
    const [, trackId, fileName] = match as unknown as [string, string, string];
    if (typeof lesson !== 'object' || lesson === null || typeof lesson.slug !== 'string') {
      throw new Error(`${path} must default-export defineLesson({ ... }).`);
    }
    if (lesson.slug !== fileName) {
      throw new Error(`${path}: the file name "${fileName}" must equal the lesson slug "${lesson.slug}".`);
    }
    (grouped[trackId] ??= {})[fileName] = lesson;
  }
  return grouped;
}

/**
 * Holds the legacy list closed: throws, naming each, when a lesson is legacy but not on `LEGACY_LESSONS`, or a slug on
 * the list has no lesson or a lesson that is cited. So the list only ever shrinks, as each lesson moves to citations.
 */
export function checkLegacyList(lessons: readonly Lesson[]): void {
  const listed: readonly string[] = LEGACY_LESSONS;
  const problems: string[] = [];
  for (const lesson of lessons) {
    if (lesson.origin === 'legacy' && !listed.includes(lesson.slug)) {
      problems.push(`"${lesson.slug}" is a legacy lesson, but it is not on the legacy list, which is closed.`);
    }
  }
  for (const slug of listed) {
    const own = lessons.filter((l) => l.slug === slug);
    if (own.length === 0) {
      problems.push(`"${slug}" is on the legacy list, but no lesson has that slug; take it off the list.`);
    } else if (own.some((l) => l.origin !== 'legacy')) {
      problems.push(`"${slug}" is on the legacy list, but its lesson is cited; take it off the list.`);
    }
  }
  if (problems.length > 0) throw new Error(`The legacy list is out of date:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
}

// Test files sit beside the lessons they cover, so they are excluded here. Only
// files directly in a track's folder are lessons: a lesson's own parts (lesson
// 1's protocols in lessons/networking/how-the-internet-works/) are not.
const modules = import.meta.glob<Lesson>(['./lessons/*/*.ts', '!./lessons/*/*.test.ts'], {
  eager: true,
  import: 'default',
});
const lessonsByTrack = groupLessonModules(modules);
checkLegacyList(Object.values(lessonsByTrack).flatMap((lessons) => Object.values(lessons)));

for (const trackId of Object.keys(lessonsByTrack)) {
  if (!tracks.some((t) => t.id === trackId)) {
    throw new Error(`src/content/lessons/${trackId} does not match any track id (${tracks.map((t) => t.id).join(', ')}).`);
  }
}

const entriesByTrack = new Map(
  tracks.map((t) => [t.id, buildEntries(t, Object.hasOwn(lessonsByTrack, t.id) ? lessonsByTrack[t.id]! : {})]),
);

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getEntries(trackId: string): LessonSummary[] {
  return entriesByTrack.get(trackId) ?? [];
}

export function getLesson(trackId: string, slug: string): Lesson | undefined {
  if (!Object.hasOwn(lessonsByTrack, trackId)) return undefined;
  const lessons = lessonsByTrack[trackId]!;
  return Object.hasOwn(lessons, slug) ? lessons[slug] : undefined;
}
