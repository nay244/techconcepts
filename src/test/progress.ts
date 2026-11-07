import { PROGRESS_KEY, type LessonProgress } from '../progress/store';

/** One lesson's saved progress, as a test sets it up: how far the learner got. */
export type SeedLesson = Pick<LessonProgress, 'status' | 'furthestPosition'>;

/**
 * Writes progress into localStorage as an earlier visit would have left it: each lesson's record, keyed
 * `<track>/<slug>`, and the lesson opened last. Every record gets the same `lastOpened`, which nothing reads back.
 */
export function seedProgress(lessons: Record<string, SeedLesson>, lastLesson: string | null = null): void {
  const full = Object.fromEntries(Object.entries(lessons).map(([key, lesson]) => [key, { ...lesson, lastOpened: '2026-11-05T12:00:00Z' }]));
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 1, lessons: full, lastLesson }));
}
