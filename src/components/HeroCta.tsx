import { useMemo, type ReactNode } from 'react';
import { resumePosition } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import './site.css';

/** A ready lesson, as the hero needs it to say where a returning visitor is. */
export interface ResumeLesson {
  key: string;
  title: string;
  url: string;
  /** `resumeLabel(lesson, p)` for every position p, worked out at build time: 'step 3 of 5', 'DNS, Learn'. */
  places: string[];
}

const RING = 2 * Math.PI * 7.5;

/**
 * The hero's eyebrow and buttons, around the page's own words (`children`). A first visit, and the server render,
 * get "Free visual lessons, no sign-up", "Start learning" and "See the lessons". A returning visitor, whose last
 * lesson has saved progress, gets where they are and "Continue <lesson>" first (launch spec §10.1).
 */
export function HeroCta({
  lessons,
  startUrl,
  lessonsUrl,
  children,
}: {
  lessons: ResumeLesson[];
  startUrl: string;
  lessonsUrl: string;
  children?: ReactNode;
}) {
  const known = useMemo(() => Object.fromEntries(lessons.map((l) => [l.key, l.places.length - 1])), [lessons]);
  const { ready, available, data } = useProgress(known);
  const last = ready && available ? lessons.find((l) => l.key === data.lastLesson) : undefined;
  const record = last !== undefined && Object.hasOwn(data.lessons, last.key) ? data.lessons[last.key] : undefined;

  if (last === undefined || record === undefined) {
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
          <a className="btn" href={lessonsUrl}>
            See the lessons
          </a>
        </div>
      </>
    );
  }

  // A finished lesson has no step to resume: it is continued from its start, and its ring is full.
  const position = resumePosition(data, last.key);
  const where = position === null ? `You finished ${last.title}` : `You’re on ${last.places[position]} in ${last.title}`;
  const share = (position ?? last.places.length - 1) / (last.places.length - 1);
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
        {where}
      </span>
      {children}
      <div className="actions">
        <a className="btn btn--primary" href={position === null ? last.url : `${last.url}?step=${position}`}>
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
