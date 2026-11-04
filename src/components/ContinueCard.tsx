import { useMemo } from 'react';
import type { AvailableSummary } from '../content/registry';
import { resumeLabel } from '../engine/timeline';
import { resumePosition, trackCompletion } from '../progress/store';
import { knownFrom } from '../lib/entries';
import { useProgress } from '../progress/useProgress';
import './site.css';

/**
 * "Continue: DHCP · step 2 of 5", with the track's progress. It renders
 * nothing until progress has loaded, when storage is blocked, or when the last
 * lesson is not one of `entries`; the server render is therefore empty.
 */
export function ContinueCard({ entries, planned }: { entries: AvailableSummary[]; planned: number }) {
  const known = useMemo(() => knownFrom(entries), [entries]);
  const { ready, available, data } = useProgress(known);
  if (!ready || !available || data.lastLesson === null) return null;
  const entry = entries.find((e) => e.key === data.lastLesson);
  if (entry === undefined) return null;

  const position = resumePosition(data, entry.key);
  const { finished } = trackCompletion(
    data,
    entries.map((e) => e.key),
  );
  return (
    <a className="continue-card" href={position === null ? entry.url : `${entry.url}?step=${position}`}>
      <span className="continue-card__title">
        {`Continue: ${entry.title}`}
        {position === null ? '' : ` · ${resumeLabel(position, entry.stepCount)}`}
      </span>
      {' '}
      <span className="continue-card__meta">{`${finished} of ${planned} complete`}</span>
    </a>
  );
}

export default ContinueCard;
