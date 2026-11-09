import type { PartMark } from '../../lib/track';
import './hub.css';

const NAMES = ['Watch', 'Learn', 'Practice'] as const;

export default function PartsMarker({ parts }: { parts: [PartMark, PartMark, PartMark] }) {
  const now = parts.indexOf('now');
  const label = now === -1 ? 'In progress' : `In progress, at ${NAMES[now]}`;
  return (
    <span className="wlp" role="img" aria-label={label}>
      {NAMES.map((name, i) => (
        <span key={name} className={`wlp__p${parts[i] === 'done' ? ' is-done' : parts[i] === 'now' ? ' is-now' : ''}`}>
          <i />
          {name}
        </span>
      ))}
    </span>
  );
}
