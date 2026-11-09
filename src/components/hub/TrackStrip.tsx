import type { StripState } from '../../lib/hub';
import './hub.css';

export default function TrackStrip({ states, words }: { states: StripState[]; words: string }) {
  return (
    <div className="strip">
      <span className="strip__sq" aria-hidden="true">
        {states.map((state, i) => (
          <i key={i} data-state={state || undefined} />
        ))}
      </span>
      <span className="strip__w">{words}</span>
    </div>
  );
}
