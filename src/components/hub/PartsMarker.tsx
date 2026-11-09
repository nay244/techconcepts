import type { PartMark } from '../../lib/track';
import './hub.css';

const NAMES = ['Watch', 'Learn', 'Practice'] as const;
const PART_CLASS: Record<PartMark, string> = { done: ' is-done', now: ' is-now', '': '' };

export default function PartsMarker({ parts }: { parts: [PartMark, PartMark, PartMark] }) {
  const now = parts.indexOf('now');
  const label = now === -1 ? 'In progress' : `In progress, at ${NAMES[now]}`;
  return (
    <span className="wlp" role="img" aria-label={label}>
      {NAMES.map((name, i) => (
        <span key={name} className={`wlp__p${PART_CLASS[parts[i]]}`}>
          <i />
          {name}
        </span>
      ))}
    </span>
  );
}
