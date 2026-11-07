import { slotsFor } from '../engine/timeline';
import type { CertTag } from './certs';
import { isDefinedLesson } from './define';
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
      /** The one address search engines should index: the first listing track's URL for the lesson, `/<home track>/<slug>`. */
      canonical: string;
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
 * all parts. `lessons` is keyed by slug and holds every lesson file; a planned
 * lesson with no file is returned as unavailable. `homeOf(slug)` is the first
 * track, in `tracks` order, that lists the slug: its URL is the lesson's canonical
 * one. Throws when a lesson is not in this track, is filed under a different slug
 * than its own, has a different title than the track lists, or does not fit the
 * track's limits. (Whether any track lists a lesson, and whether its overrides are
 * needed across every listing track, is `checkListings`.)
 */
export function buildEntries(track: Track, lessons: Record<string, Lesson>, homeOf: (slug: string) => string): LessonSummary[] {
  const planned = new Map(track.parts.flatMap((part) => part.lessons.map((l) => [l.slug, l.title] as const)));
  for (const [slug, lesson] of Object.entries(lessons)) {
    const title = planned.get(slug);
    // A lesson another track lists is not an error here; only a lesson no track lists is (`checkListings`).
    if (title === undefined) continue;
    if (lesson.slug !== slug) throw new Error(`Lesson filed as "${slug}" has the slug "${lesson.slug}"; the slug must match.`);
    if (lesson.title !== title) {
      throw new Error(`Lesson "${slug}" has the title "${lesson.title}", but the ${track.id} track lists the title "${title}".`);
    }
    const misfits = checkLimits(lesson, track.limits);
    if (misfits.length > 0) {
      throw new Error(`Lesson "${slug}" does not fit the ${track.id} track's limits:\n${misfits.map((m) => `  - ${m}`).join('\n')}`);
    }
  }

  const entries: LessonSummary[] = [];
  for (const part of track.parts) {
    for (const planned of part.lessons) {
      const base = {
        key: planned.slug,
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
              canonical: `/${homeOf(planned.slug)}/${planned.slug}`,
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

const LESSON_PATH = /^\.\/lessons\/([^/]+)\.ts$/;

/**
 * Keys the glob result by slug. A lesson is a file directly in `lessons/`, and the file name must equal the lesson's
 * slug. Each lesson must be the one `defineLesson` or `defineLegacyLesson` returned, so a lesson file cannot skip the
 * rules (direction doc §3.4: the build fails if a lesson is missing a citation).
 */
export function lessonsFromModules(modules: Record<string, Lesson>): Record<string, Lesson> {
  const bySlug: Record<string, Lesson> = {};
  for (const [path, lesson] of Object.entries(modules)) {
    const match = LESSON_PATH.exec(path);
    if (match === null) throw new Error(`Unexpected lesson file path "${path}".`);
    const [, fileName] = match as unknown as [string, string];
    if (typeof lesson !== 'object' || lesson === null || typeof lesson.slug !== 'string') {
      throw new Error(`${path} must default-export defineLesson({ ... }), or defineLegacyLesson({ ... }) for a lesson on the legacy list.`);
    }
    if (!isDefinedLesson(lesson)) {
      throw new Error(
        `${path}: the lesson was not made with defineLesson (or defineLegacyLesson for a lesson on the legacy list); wrap it so every rule runs.`,
      );
    }
    if (lesson.slug !== fileName) {
      throw new Error(`${path}: the file name "${fileName}" must equal the lesson slug "${lesson.slug}".`);
    }
    bySlug[fileName] = lesson;
  }
  return bySlug;
}

/**
 * The tracks, in order, that list `slug`.
 */
function listingTracks(slug: string, trackList: readonly Track[]): Track[] {
  return trackList.filter((t) => t.parts.some((part) => part.lessons.some((l) => l.slug === slug)));
}

/**
 * Throws when a lesson file is listed by no track, or carries an override that no listing track needs (a lesson in
 * several tracks keeps an override while any one of them needs it).
 */
export function checkListings(lessons: Record<string, Lesson>, trackList: readonly Track[]): void {
  for (const [slug, lesson] of Object.entries(lessons)) {
    const listing = listingTracks(slug, trackList);
    if (listing.length === 0) throw new Error(`Lesson "${slug}" is not listed in any track.`);
    const unneeded = unneededOverrides(lesson, listing.map((t) => t.limits));
    if (unneeded.length > 0) {
      throw new Error(
        `Lesson "${slug}" has overrides the ${listing.map((t) => t.id).join(', ')} track${listing.length > 1 ? 's do' : ' does'} not need:\n${unneeded.map((m) => `  - ${m}`).join('\n')}`,
      );
    }
  }
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

// Test files sit beside the lessons they cover, so they are excluded here. Only files directly in `lessons/` are
// lessons: a lesson's own parts (lesson 1's protocols in lessons/how-the-internet-works/) are not.
const modules = import.meta.glob<Lesson>(['./lessons/*.ts', '!./lessons/*.test.ts'], {
  eager: true,
  import: 'default',
});
const lessonsBySlug = lessonsFromModules(modules);
checkLegacyList(Object.values(lessonsBySlug));
checkListings(lessonsBySlug, tracks);

/** The tracks that list a lesson, in `tracks` order; empty for a slug no track lists. */
export function tracksOf(slug: string): Track[] {
  return listingTracks(slug, tracks);
}

const homeOf = (slug: string): string => tracksOf(slug)[0]!.id;

const entriesByTrack = new Map(tracks.map((t) => [t.id, buildEntries(t, lessonsBySlug, homeOf)]));

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getEntries(trackId: string): LessonSummary[] {
  return entriesByTrack.get(trackId) ?? [];
}

export function getLesson(slug: string): Lesson | undefined {
  return Object.hasOwn(lessonsBySlug, slug) ? lessonsBySlug[slug] : undefined;
}
