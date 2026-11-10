import type { LessonSummary } from '../../content/registry';
import { actionLabel, lessonHref, lessonStatus, upNext, type UpNext } from '../../lib/hub';
import { emptyProgress, type ProgressData } from '../../progress/store';
import { useProgress } from '../../progress/useProgress';

export interface UpNextView {
  /** The progress to draw from: a first visit until it has loaded, and whenever storage is unavailable. */
  data: ProgressData;
  /** The lesson to take next and how to frame it; null when no lesson is ready. */
  next: UpNext | null;
  /** The key the strip and the route mark as current: the up-next lesson, but not on a first visit. */
  current: string | null;
  /** The button's words for the up-next lesson: Start, Continue or Watch again; null when no lesson is ready. */
  label: 'Start' | 'Continue' | 'Watch again' | null;
  /** Where the button goes; null when no lesson is ready. */
  href: string | null;
}

/**
 * What every hub island shows of this visitor's progress, worked out once so the side card, the route and the
 * Tracks panel always agree on the lesson up next. Until progress has loaded, and when storage is blocked, it is
 * the first-visit view, so the server render and the first client render match.
 */
export function useUpNext(entries: LessonSummary[], known: Record<string, number>): UpNextView {
  const { ready, available, data: stored } = useProgress(known);
  const data = ready && available ? stored : emptyProgress();
  const next = upNext(entries, data);
  if (next === null) return { data, next, current: null, label: null, href: null };
  const { entry, kind } = next;
  return {
    data,
    next,
    current: kind === 'start' ? null : entry.key,
    label: kind === 'start' ? 'Start' : kind === 'done-so-far' ? 'Watch again' : actionLabel(lessonStatus(entry, data)),
    href: lessonHref(entry, data),
  };
}
