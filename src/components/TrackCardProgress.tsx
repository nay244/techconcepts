import { trackCompletion } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import './site.css';

/**
 * The foot of Home's Networking card. A first visit, and the server render, read "4 of 20 lessons ready, 124 min"
 * and "Open track"; once this browser has progress in the track it reads "n of 20 done, m in progress" over a bar
 * of one segment per planned lesson (done first, then in progress), and "Continue".
 *
 * `known` maps each ready lesson's key to its last position (`knownFrom(entries)`); `totals` is `trackTotals(entries)`.
 */
export function TrackCardProgress({
  known,
  totals,
}: {
  known: Record<string, number>;
  totals: { available: number; planned: number; minutes: number };
}) {
  const { ready, available, data } = useProgress(known);
  const { finished, inProgress } = trackCompletion(data, Object.keys(known));

  if (!ready || !available || finished + inProgress === 0) {
    return (
      <>
        <span className="meta">{`${totals.available} of ${totals.planned} lessons ready, ${totals.minutes} min`}</span>
        <span className="go">Open track</span>
      </>
    );
  }
  return (
    <>
      <span className="segbar" aria-hidden="true">
        {Array.from({ length: totals.planned }, (_, i) => (
          <i key={i} className={i < finished ? 'done' : i < finished + inProgress ? 'prog' : undefined} />
        ))}
      </span>
      <span className="meta">{`${finished} of ${totals.planned} done, ${inProgress} in progress`}</span>
      <span className="go">Continue</span>
    </>
  );
}

export default TrackCardProgress;
