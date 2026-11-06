import type { ReactNode } from 'react';
import { resumePosition } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import './site.css';

/** A ready lesson, as the hero needs it to say where a returning visitor is. */
export interface ResumeLesson {
  key: string;
  title: string;
  url: string;
  /**
   * Where each position is, worded to follow "You’re on": 'step 3 of 5', 'the Learn part', 'the DNS Overview'
   * (`resumePlaces(lesson)`, worked out at build time).
   */
  places: string[];
}

const RING = 2 * Math.PI * 7.5;

/**
 * The hero's eyebrow and buttons, around the page's own words (`children`). A first visit, and the server render,
 * get "Free visual lessons, no sign-up", "Start learning" and "How a lesson works". Once this browser has saved
 * progress in a ready lesson, a visitor whose last lesson is ready gets where they are in it, "You’re on <place> in
 * <lesson>", and "Continue <lesson>" first (launch spec §10.1). `known` is the page's `knownFrom(entries)`.
 */
export function HeroCta({
  lessons,
  known,
  startUrl,
  children,
}: {
  lessons: ResumeLesson[];
  known: Record<string, number>;
  startUrl: string;
  children?: ReactNode;
}) {
  const { ready, available, data } = useProgress(known);
  const saved = ready && available && Object.keys(data.lessons).length > 0;
  const last = saved ? lessons.find((l) => l.key === data.lastLesson) : undefined;

  if (last === undefined) {
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
          <a className="btn btn--primary" href={startUrl}>
            Start learning
          </a>
          <a className="btn" href="#how">
            How a lesson works
          </a>
        </div>
      </>
    );
  }

  // Where they are: the step to resume at; a finished lesson, where it ended; a lesson only opened, its Overview.
  const record = Object.hasOwn(data.lessons, last.key) ? data.lessons[last.key] : undefined;
  const position = record === undefined ? 0 : (resumePosition(data, last.key) ?? record.furthestPosition);
  // `last` is in `known`: useProgress reads any other last lesson as none.
  const share = position / known[last.key]!;
  return (
    <>
      <span className="eyebrow back">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="var(--line-strong)" strokeWidth="2.6" />
          <circle
            cx="10"
            cy="10"
            r="7.5"
            fill="none"
            stroke="var(--here)"
            strokeWidth="2.6"
            strokeDasharray={`${(RING * share).toFixed(1)} 100`}
            transform="rotate(-90 10 10)"
            strokeLinecap="round"
          />
        </svg>
        {`You’re on ${last.places[position]} in ${last.title}`}
      </span>
      {children}
      <div className="actions">
        <a className="btn btn--primary" href={position === 0 ? last.url : `${last.url}?step=${position}`}>
          {`Continue ${last.title}`}
        </a>
        <a className="btn" href="#tracks">
          Browse tracks
        </a>
      </div>
    </>
  );
}

export default HeroCta;
