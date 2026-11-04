import { useMemo } from 'react';
import type { LessonSummary } from '../content/registry';
import { knownFrom } from '../lib/entries';
import { trackCompletion } from '../progress/store';
import type { ProgressData } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import './site.css';

export function useTrackProgress(entries: LessonSummary[]) {
  // Memoized: `known` is a new object per render otherwise.
  const known = useMemo(() => knownFrom(entries), [entries]);
  return useProgress(known);
}

/**
 * "3 of 19 complete" plus one bar segment per planned lesson. The block is
 * always in the layout; it is only hidden until progress has loaded, or when
 * storage is blocked, so the page does not jump.
 */
export function ProgressSummary({
  entries,
  planned,
  data,
  shown,
}: {
  entries: LessonSummary[];
  planned: number;
  data: ProgressData;
  shown: boolean;
}) {
  const { finished } = trackCompletion(
    data,
    entries.map((e) => e.key),
  );
  return (
    <div className="progress-line" data-shown={shown}>
      <p className="progress-line__text">{shown ? `${finished} of ${planned} complete` : ' '}</p>
      <ol className="progress-bar" role="list" aria-hidden="true">
        {Array.from({ length: planned }, (_, i) => {
          const entry = entries[i];
          const status = entry !== undefined && Object.hasOwn(data.lessons, entry.key) ? data.lessons[entry.key]!.status : 'none';
          return <li key={i} data-status={shown ? status : 'none'} />;
        })}
      </ol>
    </div>
  );
}

/** The Home card's progress line, on its own. */
export function TrackProgress({ entries, planned }: { entries: LessonSummary[]; planned: number }) {
  const { ready, available, data } = useTrackProgress(entries);
  return <ProgressSummary entries={entries} planned={planned} data={data} shown={ready && available} />;
}

export default TrackProgress;
