import type { SafeStorage } from '../lib/storage';

/** The one versioned localStorage record that holds all learning progress. */
export const PROGRESS_KEY = 'techconcepts:v1';

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
  version: 1;
  /** Lesson records keyed by lesson key, e.g. `networking/dhcp`. */
  lessons: Record<string, LessonProgress>;
  lastLesson: string | null;
}

export function emptyProgress(): ProgressData {
  return { version: 1, lessons: {}, lastLesson: null };
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

/**
 * Turns whatever was stored into progress data. Anything that is not the
 * current version's shape reads as empty, and a single malformed lesson record
 * is dropped without discarding the rest. Positions are kept as stored (the
 * range check needs the lesson list, so `sanitizeProgress` does it).
 */
export function parseProgress(raw: string | null): ProgressData {
  if (!raw) return emptyProgress();
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return emptyProgress();
  }
  if (!isObject(value) || value.version !== 1 || !isObject(value.lessons)) return emptyProgress();

  const lessons: [string, LessonProgress][] = [];
  for (const [key, record] of Object.entries(value.lessons)) {
    const lesson = parseLesson(record);
    if (lesson) lessons.push([key, lesson]);
  }
  return {
    version: 1,
    lessons: Object.fromEntries(lessons),
    lastLesson: typeof value.lastLesson === 'string' ? value.lastLesson : null,
  };
}

/**
 * Lesson records are looked up by own key only, so a name that every object
 * inherits (`constructor`, `toString`) is never mistaken for a lesson.
 */
function lessonOf(d: ProgressData, key: string): LessonProgress | undefined {
  return Object.hasOwn(d.lessons, key) ? d.lessons[key] : undefined;
}

/**
 * Fits saved data to the lessons that exist now. `known` maps each lesson key
 * to its last step (`maxPosition`). Records for unknown lessons are dropped, a
 * position outside `[1, max]` is clamped, and an unknown `lastLesson` becomes null.
 */
export function sanitizeProgress(d: ProgressData, known: Record<string, number>): ProgressData {
  const lessons: [string, LessonProgress][] = [];
  for (const [key, lesson] of Object.entries(d.lessons)) {
    if (!Object.hasOwn(known, key)) continue;
    const furthestPosition = Math.max(1, Math.min(lesson.furthestPosition, known[key]));
    lessons.push([key, { ...lesson, furthestPosition }]);
  }
  return {
    version: 1,
    lessons: Object.fromEntries(lessons),
    lastLesson: d.lastLesson !== null && Object.hasOwn(known, d.lastLesson) ? d.lastLesson : null,
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
  const keepStoredLast = next.lastLesson === null && stored.lastLesson !== null && !Object.hasOwn(known, stored.lastLesson);
  return {
    version: 1,
    lessons: Object.fromEntries([...kept, ...Object.entries(next.lessons)]),
    lastLesson: keepStoredLast ? stored.lastLesson : next.lastLesson,
  };
}

/**
 * Records that `key` was opened at `position` (0 is the Overview). Moving past
 * the Overview starts the lesson, reaching `maxPosition` finishes it, and a
 * finished lesson stays finished however it is opened again. Returns new data.
 */
export function recordVisit(d: ProgressData, key: string, position: number, maxPosition: number, now: Date): ProgressData {
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
  return { ...d, lessons, lastLesson: key };
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

export function loadProgress(s: SafeStorage): ProgressData {
  return parseProgress(s.get(PROGRESS_KEY));
}

/** True only when the record was actually stored. */
export function saveProgress(s: SafeStorage, d: ProgressData): boolean {
  return s.set(PROGRESS_KEY, JSON.stringify(d));
}

export function clearProgress(s: SafeStorage): void {
  s.remove(PROGRESS_KEY);
}
