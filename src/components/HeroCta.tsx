import type { ReactNode } from 'react';
import { lastKnownLesson } from '../progress/resume';
import { useProgress } from '../progress/useProgress';
import './site.css';

/**
 * The hero's eyebrow and buttons, around the page's own words (`children`). The eyebrow, "Free visual lessons, no
 * sign-up", and the first button are the same for everyone: `start.label`, opening `start.href` (Home passes "Learn how
 * the Internet Works" and that lesson's page). Beside it, a first visit, and the server render, get "How a lesson
 * works"; once this browser has saved progress in a ready lesson (`lastKnownLesson`), "Browse tracks".
 * `known` is the page's `knownFrom(entries)`.
 */
export function HeroCta({
  known,
  start,
  children,
}: {
  known: Record<string, number>;
  start: { href: string; label: string };
  children?: ReactNode;
}) {
  const returning = lastKnownLesson(useProgress(known), known) !== null;

  return (
    <>
      <span className="eyebrow">
        <svg viewBox="0 0 14 10" aria-hidden="true">
          <polygon points="7,1 13,5 7,9 1,5" fill="currentColor" />
        </svg>
        Free visual lessons, no sign-up
      </span>
      {children}
      <div className="actions">
        <a className="btn btn--primary" href={start.href}>
          {start.label}
        </a>
        {returning ? (
          <a className="btn" href="#tracks">
            Browse tracks
          </a>
        ) : (
          <a className="btn" href="#how">
            How a lesson works
          </a>
        )}
      </div>
    </>
  );
}

export default HeroCta;
