import type { LessonSummary } from '../content/registry';
import type { LessonProgress } from '../progress/store';

/** The words shown beside a lesson that has saved progress. */
export const STATUS_TEXT: Record<LessonProgress['status'], string> = { finished: 'Finished', 'in-progress': 'In progress' };

/** Consecutive entries that share a part, in order. */
export function byPart(entries: LessonSummary[]): { title: string; entries: LessonSummary[] }[] {
  const parts: { title: string; entries: LessonSummary[] }[] = [];
  for (const entry of entries) {
    const last = parts.at(-1);
    if (last?.title === entry.partTitle) last.entries.push(entry);
    else parts.push({ title: entry.partTitle, entries: [entry] });
  }
  return parts;
}

/** What `useProgress` needs: each available lesson's key and last position. */
export function knownFrom(entries: LessonSummary[]): Record<string, number> {
  return Object.fromEntries(entries.flatMap((e) => (e.available ? [[e.key, e.maxPosition] as const] : [])));
}

/** 'beginner' as 'Beginner'. */
export function levelLabel(level: string): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
