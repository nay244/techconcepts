import { LEGACY_PROGRESS_KEY, PROGRESS_KEY, type LessonProgress } from '../progress/store';

/** One lesson's saved progress, as a test sets it up: how far the learner got. */
export type SeedLesson = Pick<LessonProgress, 'status' | 'furthestPosition'>;

const SEEDED_AT = '2026-11-05T12:00:00Z';

const withDate = (lessons: Record<string, SeedLesson>) =>
  Object.fromEntries(Object.entries(lessons).map(([key, lesson]) => [key, { ...lesson, lastOpened: SEEDED_AT }]));

/**
 * Writes progress into localStorage as an earlier visit would have left it: each lesson's record, keyed by its slug,
 * and the lesson opened last (with the track it was opened in). Every record gets the same `lastOpened`, which
 * nothing reads back.
 */
export function seedProgress(lessons: Record<string, SeedLesson>, lastLesson: string | null = null, lastTrack: string | null = null): void {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 2, lessons: withDate(lessons), lastLesson, lastTrack }));
}

/** Writes progress the way the site did before progress followed the lesson: records keyed `<track>/<slug>`, under `techconcepts:v1`. */
export function seedV1Progress(lessons: Record<string, SeedLesson>, lastLesson: string | null = null): void {
  window.localStorage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify({ version: 1, lessons: withDate(lessons), lastLesson }));
}
