import { resumePosition, type ProgressData } from './store';
import type { UseProgress } from './useProgress';

/** A ready lesson, as a hero needs it to say where a returning visitor is. */
export interface ResumeLesson {
  key: string;
  title: string;
  url: string;
  /**
   * Where each position is, worded to follow "You’re on": 'step 3 of 5', 'the Learn part', 'the DNS Overview'
   * (`resumePlaces(lesson)`, worked out at build time).
   */
  places: string[];
}

/** Where a returning visitor is in their last lesson, and how to go on. */
export interface Resume<L extends ResumeLesson> {
  lesson: L;
  finished: boolean;
  /** The position to go on from: the saved step, or 0 (the Overview) for a lesson finished or only opened. */
  position: number;
  /** How far through the lesson, from 0 to 1, for a progress ring. */
  share: number;
  /** "You’re on <place> in <lesson>", or "You finished <lesson>". */
  where: string;
  /** The lesson, at the saved step when there is one. */
  href: string;
}

/**
 * A returning visitor's last lesson: once this browser has saved progress in a lesson the page knows, the last lesson
 * opened, if the page knows it. Null for a first visit, until progress has loaded, and while storage is blocked.
 * `known` is the page's `knownFrom(entries)`, as given to `useProgress`.
 */
export function lastKnownLesson(
  { ready, available, data }: Pick<UseProgress, 'ready' | 'available' | 'data'>,
  known: Record<string, number>,
): string | null {
  // Only a record for a lesson this page knows counts: one no track lists yet is kept in storage, but is not progress here.
  const saved = ready && available && Object.keys(data.lessons).some((key) => Object.hasOwn(known, key));
  return saved && data.lastLesson !== null && Object.hasOwn(known, data.lastLesson) ? data.lastLesson : null;
}

/**
 * Where a returning visitor is (launch spec §10.1): their `lastKnownLesson`, if it is one of `lessons`. A lesson in
 * progress goes on from its saved step; a lesson finished, or only opened, from its Overview. Null whenever
 * `lastKnownLesson` is.
 */
export function resumeOf<L extends ResumeLesson>(
  progress: Pick<UseProgress, 'ready' | 'available' | 'data'>,
  lessons: L[],
  known: Record<string, number>,
): Resume<L> | null {
  const { data } = progress;
  const key = lastKnownLesson(progress, known);
  const lesson = key === null ? undefined : lessons.find((l) => l.key === key);
  if (lesson === undefined) return null;

  const record = recordOf(data, lesson.key);
  const finished = record?.status === 'finished';
  const position = finished || record === undefined ? 0 : (resumePosition(data, lesson.key) ?? 0);
  // `lesson` is in `known`: useProgress reads any other last lesson as none.
  const share = finished ? 1 : position / known[lesson.key]!;
  return {
    lesson,
    finished,
    position,
    share,
    where: finished ? `You finished ${lesson.title}` : `You’re on ${lesson.places[position]} in ${lesson.title}`,
    href: position === 0 ? lesson.url : `${lesson.url}?step=${position}`,
  };
}

function recordOf(data: ProgressData, key: string) {
  return Object.hasOwn(data.lessons, key) ? data.lessons[key] : undefined;
}
