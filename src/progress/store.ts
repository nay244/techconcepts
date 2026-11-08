import type { SafeStorage } from '../lib/storage';
import { splitInternet } from './internet-split';

/** The one versioned localStorage record that holds all learning progress, keyed by lesson slug. */
export const PROGRESS_KEY = 'techconcepts:v2';
/** The record earlier visits left, keyed `track/slug`. It is read and merged in, and removed only after a v2 save. */
export const LEGACY_PROGRESS_KEY = 'techconcepts:v1';

export interface LessonProgress {
  status: 'in-progress' | 'finished';
  /**
   * The furthest position reached, counting across every unit as the timeline does. Position 0, the first unit's
   * Overview, is never recorded; every later one is, a later unit's Overview included.
   */
  furthestPosition: number;
  /** ISO timestamp of the last time the lesson was opened. */
  lastOpened: string;
}

export interface ProgressData {
  version: 2;
  /** Lesson records keyed by lesson slug, e.g. `dhcp`: progress follows the lesson, whichever track it was opened in. */
  lessons: Record<string, LessonProgress>;
  lastLesson: string | null;
  /** The track `lastLesson` was opened in; null when that is not known. It travels with `lastLesson`. */
  lastTrack: string | null;
}

export function emptyProgress(): ProgressData {
  return { version: 2, lessons: {}, lastLesson: null, lastTrack: null };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseLesson(value: unknown): LessonProgress | null {
  if (!isObject(value)) return null;
  const { status, furthestPosition, lastOpened } = value;
  if (status !== 'in-progress' && status !== 'finished') return null;
  if (typeof furthestPosition !== 'number' || !Number.isInteger(furthestPosition)) return null;
  if (typeof lastOpened !== 'string') return null;
  return { status, furthestPosition, lastOpened };
}

/** The valid lesson records of a stored `lessons` object, one by one; a malformed record is dropped alone. */
function parseLessons(lessons: Record<string, unknown>): [string, LessonProgress][] {
  const out: [string, LessonProgress][] = [];
  for (const [key, record] of Object.entries(lessons)) {
    const lesson = parseLesson(record);
    if (lesson) out.push([key, lesson]);
  }
  return out;
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Turns whatever was stored under the v2 key into progress data. Anything that is not the v2 shape reads as empty,
 * and a single malformed lesson record is dropped without discarding the rest. Positions are kept as stored (the
 * range check needs the lesson list, so `sanitizeProgress` does it).
 */
export function parseProgress(raw: string | null): ProgressData {
  const value = parseJson(raw);
  if (!isObject(value) || value.version !== 2 || !isObject(value.lessons)) return emptyProgress();
  const lastLesson = typeof value.lastLesson === 'string' ? value.lastLesson : null;
  return {
    version: 2,
    lessons: Object.fromEntries(parseLessons(value.lessons)),
    lastLesson,
    lastTrack: lastLesson !== null && typeof value.lastTrack === 'string' ? value.lastTrack : null,
  };
}

/** A lesson's slug and, when the key was exactly `track/slug`, its track. Any other key is kept as it was, from its last `/` on. */
function splitV1Key(key: string): { slug: string; track: string | null } {
  const at = key.lastIndexOf('/');
  if (at === -1) return { slug: key, track: null };
  const slug = key.slice(at + 1);
  // Nothing after the slash: keep the whole key rather than lose the record under an empty name.
  if (slug === '') return { slug: key, track: null };
  const track = key.slice(0, at);
  return { slug, track: track !== '' && !track.includes('/') ? track : null };
}

/** Lesson records of both, a lesson in both merged. */
function mergeLessons(a: Record<string, LessonProgress>, b: Record<string, LessonProgress>): Record<string, LessonProgress> {
  const merged = new Map<string, LessonProgress>(Object.entries(a));
  for (const [slug, record] of Object.entries(b)) {
    const have = merged.get(slug);
    merged.set(slug, have === undefined ? record : mergeRecords(have, record));
  }
  return Object.fromEntries(merged);
}

/**
 * Reads what the earlier version left under `techconcepts:v1`: its parser (a malformed record is dropped alone), then
 * every `track/slug` key becomes its slug (a key without `/` is kept), and two tracks' records of one lesson merge.
 * `lastLesson` becomes a slug and `lastTrack` its track, or null when the old value named no single track.
 */
export function migrateV1(raw: string | null): ProgressData {
  const value = parseJson(raw);
  if (!isObject(value) || value.version !== 1 || !isObject(value.lessons)) return emptyProgress();

  // A Map, so a lesson named `__proto__` stays an ordinary entry; two tracks' records of one lesson merge in place.
  const merged = new Map<string, LessonProgress>();
  for (const [key, record] of parseLessons(value.lessons)) {
    const slug = splitV1Key(key).slug;
    const have = merged.get(slug);
    merged.set(slug, have === undefined ? record : mergeRecords(have, record));
  }
  const lessons = Object.fromEntries(merged);
  if (typeof value.lastLesson !== 'string') return { version: 2, lessons, lastLesson: null, lastTrack: null };
  const { slug, track } = splitV1Key(value.lastLesson);
  return { version: 2, lessons, lastLesson: slug, lastTrack: track };
}

function timeOf(iso: string): number {
  return Date.parse(iso);
}

/**
 * One lesson's record from two: finished if either is, the larger furthest position, the later `lastOpened`
 * (compared as dates; the stored text is kept, and a date that does not parse yields to the other).
 */
export function mergeRecords(a: LessonProgress, b: LessonProgress): LessonProgress {
  const ta = timeOf(a.lastOpened);
  const tb = timeOf(b.lastOpened);
  const lastOpened = Number.isNaN(tb) || (!Number.isNaN(ta) && ta >= tb) ? a.lastOpened : b.lastOpened;
  return {
    status: a.status === 'finished' || b.status === 'finished' ? 'finished' : 'in-progress',
    furthestPosition: Math.max(a.furthestPosition, b.furthestPosition),
    lastOpened,
  };
}

/**
 * Every lesson of both, a lesson in both merged. `lastLesson` and `lastTrack` stay a pair: they come from `primary`
 * unless it has no last lesson, and then from `other`.
 */
export function combineProgress(primary: ProgressData, other: ProgressData): ProgressData {
  const from = primary.lastLesson !== null ? primary : other;
  return { version: 2, lessons: mergeLessons(primary.lessons, other.lessons), lastLesson: from.lastLesson, lastTrack: from.lastTrack };
}

/**
 * Lesson records are looked up by own key only, so a name that every object
 * inherits (`constructor`, `toString`) is never mistaken for a lesson.
 */
function lessonOf(d: ProgressData, key: string): LessonProgress | undefined {
  return Object.hasOwn(d.lessons, key) ? d.lessons[key] : undefined;
}

/**
 * Fits saved data to the lessons that exist now. `known` maps each lesson slug to its last step (`maxPosition`).
 * A position outside `[1, max]` is clamped for a known lesson. A record for a lesson not in `known` is kept
 * exactly as it is, because unlisted is not gone. An unknown `lastLesson` becomes null, with its `lastTrack`.
 */
export function sanitizeProgress(d: ProgressData, known: Record<string, number>): ProgressData {
  const lessons: [string, LessonProgress][] = [];
  for (const [key, lesson] of Object.entries(d.lessons)) {
    if (!Object.hasOwn(known, key)) {
      lessons.push([key, lesson]);
      continue;
    }
    const furthestPosition = Math.max(1, Math.min(lesson.furthestPosition, known[key]!));
    lessons.push([key, { ...lesson, furthestPosition }]);
  }
  const lastKnown = d.lastLesson !== null && Object.hasOwn(known, d.lastLesson);
  return {
    version: 2,
    lessons: Object.fromEntries(lessons),
    lastLesson: lastKnown ? d.lastLesson : null,
    lastTrack: lastKnown ? d.lastTrack : null,
  };
}

/**
 * Combines what is stored with `next`, a sanitized view that was changed. Only
 * the lessons in `known` are `next`'s to decide; every other saved record is
 * kept exactly as stored, because a lesson that is unlisted for now (another
 * track, a draft, a rollback) is ignored, not deleted. A stored `lastLesson`
 * that is not known also survives when `next` names none.
 */
export function mergeProgress(stored: ProgressData, next: ProgressData, known: Record<string, number>): ProgressData {
  const kept = Object.entries(stored.lessons).filter(([key]) => !Object.hasOwn(known, key));
  const decided = Object.entries(next.lessons).filter(([key]) => Object.hasOwn(known, key));
  const keepStoredLast = next.lastLesson === null && stored.lastLesson !== null && !Object.hasOwn(known, stored.lastLesson);
  const from = keepStoredLast ? stored : next;
  return {
    version: 2,
    lessons: Object.fromEntries([...kept, ...decided]),
    lastLesson: from.lastLesson,
    lastTrack: from.lastTrack,
  };
}

/**
 * Records that lesson `key` (its slug) was opened in track `trackId` at `position` (0 is the Overview). Moving past
 * the Overview starts the lesson, reaching `maxPosition` finishes it, and a
 * finished lesson stays finished however it is opened again. Returns new data.
 */
export function recordVisit(d: ProgressData, key: string, trackId: string, position: number, maxPosition: number, now: Date): ProgressData {
  const existing = lessonOf(d, key);
  const lastOpened = now.toISOString();

  let lessons = d.lessons;
  if (position >= 1) {
    lessons = {
      ...d.lessons,
      [key]: {
        status: existing?.status === 'finished' || position === maxPosition ? 'finished' : 'in-progress',
        furthestPosition: Math.max(existing?.furthestPosition ?? 0, position),
        lastOpened,
      },
    };
  } else if (existing) {
    lessons = { ...d.lessons, [key]: { ...existing, lastOpened } };
  }
  return { ...d, lessons, lastLesson: key, lastTrack: trackId };
}

/** The step to offer "Resume at step N" for: only a lesson still in progress has one. */
export function resumePosition(d: ProgressData, key: string): number | null {
  const lesson = lessonOf(d, key);
  return lesson?.status === 'in-progress' ? lesson.furthestPosition : null;
}

export function trackCompletion(d: ProgressData, keys: string[]): { finished: number; inProgress: number } {
  let finished = 0;
  let inProgress = 0;
  for (const key of keys) {
    const status = lessonOf(d, key)?.status;
    if (status === 'finished') finished += 1;
    else if (status === 'in-progress') inProgress += 1;
  }
  return { finished, inProgress };
}

/**
 * What is stored under v2, with whatever v1 still holds merged in (an old tab may have written it since), and the
 * old Networking lesson 1 split into the How the Internet Works lessons that replaced it.
 */
export function loadProgress(s: SafeStorage): ProgressData {
  return splitInternet(combineProgress(parseProgress(s.get(PROGRESS_KEY)), migrateV1(s.get(LEGACY_PROGRESS_KEY))));
}

/**
 * True only when the v2 record was actually stored. v1 is removed only after that, so a failed write loses nothing.
 * `d` must come from `loadProgress` (merged with v1), because a successful save removes v1.
 */
export function saveProgress(s: SafeStorage, d: ProgressData): boolean {
  if (!s.set(PROGRESS_KEY, JSON.stringify(d))) return false;
  s.remove(LEGACY_PROGRESS_KEY);
  return true;
}

export function clearProgress(s: SafeStorage): void {
  s.remove(PROGRESS_KEY);
  s.remove(LEGACY_PROGRESS_KEY);
}
