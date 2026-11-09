import type { AvailableSummary, LessonSummary } from '../content/registry';
import type { LessonProgress, ProgressData } from '../progress/store';
import { resumePosition } from '../progress/store';

/** Where a lesson stands for this visitor. */
export type LessonStatus = 'not-started' | 'in-progress' | 'done' | 'not-ready';

/** The words shown for each status. */
export const STATUS_WORDS: Record<LessonStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  done: '✓ Done',
  'not-ready': 'Not ready yet',
};

/** The progress record for a lesson key; an inherited name such as `constructor` is not a record. */
function recordOf(data: ProgressData, key: string): LessonProgress | undefined {
  return Object.hasOwn(data.lessons, key) ? data.lessons[key] : undefined;
}

/** The status of one lesson: an unavailable lesson is always not ready, whatever the records say. */
export function lessonStatus(entry: LessonSummary, data: ProgressData): LessonStatus {
  if (!entry.available) return 'not-ready';
  const record = recordOf(data, entry.key);
  if (!record) return 'not-started';
  return record.status === 'finished' ? 'done' : 'in-progress';
}

/** How the up-next lesson is framed: the first visit, the next step, or everything ready finished. */
export type UpNextKind = 'start' | 'next' | 'done-so-far';

/** The lesson to point a visitor at, and how to frame it. */
export interface UpNext {
  entry: AvailableSummary;
  kind: UpNextKind;
}

/**
 * The lesson to do next in a track. The in-progress lesson opened last wins; otherwise the first ready lesson not
 * finished; otherwise the last ready lesson. Kind is `start` when no ready lesson has a record, `done-so-far` when all
 * ready lessons are finished, else `next`. Null only when no lesson is ready. Records for other lessons are ignored.
 */
export function upNext(entries: LessonSummary[], data: ProgressData): UpNext | null {
  const ready = entries.filter((e): e is AvailableSummary => e.available);
  if (ready.length === 0) return null;
  let latest: { entry: AvailableSummary; opened: string } | null = null;
  let anyRecord = false;
  for (const entry of ready) {
    const record = recordOf(data, entry.key);
    if (!record) continue;
    anyRecord = true;
    if (record.status === 'in-progress' && (latest === null || record.lastOpened > latest.opened)) {
      latest = { entry, opened: record.lastOpened };
    }
  }
  if (latest) return { entry: latest.entry, kind: 'next' };
  const first = ready.find((e) => recordOf(data, e.key)?.status !== 'finished');
  if (first) return { entry: first, kind: anyRecord ? 'next' : 'start' };
  return { entry: ready[ready.length - 1], kind: 'done-so-far' };
}

/** How one square of the track strip looks. */
export type StripState = 'done' | 'current' | 'ready' | '';

/**
 * One state per entry, in order: finished is done; the `current` key is current; other ready lessons are ready;
 * lessons not ready are blank. Pass the up-next key as `current` only when its kind is not `start`.
 */
export function stripStates(entries: LessonSummary[], data: ProgressData, current: string | null): StripState[] {
  return entries.map((entry): StripState => {
    if (!entry.available) return '';
    if (lessonStatus(entry, data) === 'done') return 'done';
    return entry.key === current ? 'current' : 'ready';
  });
}

/** The strip caption, such as `1 of 19 lessons done · 4 ready`; the ready count appears only when some lessons are not ready. */
export function stripWords(entries: LessonSummary[], data: ProgressData): string {
  const total = entries.length;
  const done = entries.filter((e) => lessonStatus(e, data) === 'done').length;
  const readyCount = entries.filter((e) => e.available).length;
  const base = `${done} of ${total} lessons done`;
  return readyCount < total ? `${base} · ${readyCount} ready` : base;
}

/** The link for a lesson: a lesson in progress resumes at its furthest step, kept within the lesson. */
export function lessonHref(entry: AvailableSummary, data: ProgressData): string {
  const position = resumePosition(data, entry.key);
  if (position === null || position <= 0) return entry.url;
  return `${entry.url}?step=${Math.min(position, entry.maxPosition)}`;
}

/** The button verb for a status. */
export function actionLabel(status: LessonStatus): 'Start' | 'Continue' | 'Watch again' {
  if (status === 'in-progress') return 'Continue';
  if (status === 'done') return 'Watch again';
  return 'Start';
}

/** The small heading above the up-next lesson. */
export const UP_NEXT_KICKER: Record<UpNextKind, string> = {
  start: 'Start here',
  next: 'Up next',
  'done-so-far': '✓ Done so far',
};
