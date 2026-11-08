import { trackCompletion } from '../progress/store';
import { useProgress } from '../progress/useProgress';

/** The ring's radius in its 20 × 20 box; the filled arc is this circle's circumference times finished ÷ planned. */
const R = 7.5;

/**
 * What a Tracks page card adds once this browser has progress in its track: a "Last opened" tab when the track holds
 * the lesson opened last, and a ring filled by finished ÷ planned with "n of N done" (or "n in progress" when none is
 * finished yet). The server render, a first visit and blocked storage show nothing, so the static card stands alone.
 *
 * `known` maps each ready lesson's key to its last position (`knownFrom(entries)`); `planned` is the track's planned
 * lesson count.
 */
export function TrackCardStatus({ trackId, known, planned }: { trackId: string; known: Record<string, number>; planned: number }) {
  const { ready, available, data } = useProgress(known);
  if (!ready || !available) return null;

  const here = data.lastTrack === trackId && data.lastLesson !== null && data.lastLesson in known;
  const { finished, inProgress } = trackCompletion(data, Object.keys(known));
  const started = finished + inProgress > 0;
  if (!here && !started) return null;

  const arc = planned > 0 ? ((2 * Math.PI * R * finished) / planned).toFixed(1) : '0.0';
  return (
    <>
      {here && <span className="tab-here">Last opened</span>}
      {started && (
        <span className="ring">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r={R} fill="none" stroke="var(--line-strong)" strokeWidth="2.6" />
            {/* Butt caps while nothing is finished: a round cap would draw a dot on an empty ring. */}
            <circle
              cx="10"
              cy="10"
              r={R}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.6"
              strokeDasharray={`${arc} 100`}
              strokeLinecap={finished > 0 ? 'round' : 'butt'}
              transform="rotate(-90 10 10)"
            />
          </svg>
          {finished > 0 ? `${finished} of ${planned} done` : `${inProgress} in progress`}
        </span>
      )}
    </>
  );
}

export default TrackCardStatus;
