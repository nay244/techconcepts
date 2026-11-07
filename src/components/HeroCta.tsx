import type { ReactNode } from 'react';
import { resumeOf, type ResumeLesson } from '../progress/resume';
import { useProgress } from '../progress/useProgress';
import './site.css';

export type { ResumeLesson };

const RING = 2 * Math.PI * 7.5;

/**
 * The hero's eyebrow and buttons, around the page's own words (`children`). A first visit, and the server render,
 * get "Free visual lessons, no sign-up", "Start learning" and "How a lesson works". Once this browser has saved
 * progress in a ready lesson, a visitor whose last lesson is ready gets where they are in it, "You’re on <place> in
 * <lesson>" ("You finished <lesson>" once it is finished), and "Continue <lesson>" first (launch spec §10.1).
 * `known` is the page's `knownFrom(entries)`.
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
  const resume = resumeOf(useProgress(known), lessons, known);

  if (resume === null) {
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

  // Where they are, with the ring filled as far as they have come; a finished lesson has it full.
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
            strokeDasharray={`${(RING * resume.share).toFixed(1)} 100`}
            transform="rotate(-90 10 10)"
            strokeLinecap="round"
          />
        </svg>
        {resume.where}
      </span>
      {children}
      <div className="actions">
        <a className="btn btn--primary" href={resume.href}>
          {`Continue ${resume.lesson.title}`}
        </a>
        <a className="btn" href="#tracks">
          Browse tracks
        </a>
      </div>
    </>
  );
}

export default HeroCta;
