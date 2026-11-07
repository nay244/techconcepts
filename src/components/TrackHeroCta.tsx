import { resumeOf, type ResumeLesson } from '../progress/resume';
import { useProgress } from '../progress/useProgress';
import './site.css';

/** A ready lesson, as the track's hero needs it: where each position is, and the step resumed at each one. */
export interface TrackResumeLesson extends ResumeLesson {
  /** For each position, the sub-heading of the step it resumes at; null away from a step (`nextUps(lesson)`). */
  next: Array<string | null>;
}

const RING = 2 * Math.PI * 16;

/**
 * The track hero's buttons (track-v2). A first visit, and the server render, get "Start with <first ready lesson>" and
 * "See all lessons". A returning visitor (the same rule as Home's hero) gets "Continue <lesson>", and under the buttons
 * a card that says where they are, with a ring in marigold, and the step they will pick up at.
 * `known` is the page's `knownFrom(entries)`.
 */
export function TrackHeroCta({
  lessons,
  known,
  start,
}: {
  lessons: TrackResumeLesson[];
  known: Record<string, number>;
  start: { title: string; url: string };
}) {
  const resume = resumeOf(useProgress(known), lessons, known);

  if (resume === null) {
    return (
      <div className="actions">
        <a className="btn btn--primary" href={start.url}>
          {`Start with ${start.title}`}
        </a>
        <a className="btn" href="#lessons">
          See all lessons
        </a>
      </div>
    );
  }

  const next = resume.finished ? null : resume.lesson.next[resume.position];
  return (
    <>
      <div className="actions">
        <a className="btn btn--primary" href={resume.href}>
          {`Continue ${resume.lesson.title}`}
        </a>
        <a className="btn" href="#lessons">
          See all lessons
        </a>
      </div>
      <a className="resume" href={resume.href}>
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line-strong)" strokeWidth="3" />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="var(--here)"
            strokeWidth="3"
            strokeDasharray={`${(RING * resume.share).toFixed(1)} 200`}
            transform="rotate(-90 20 20)"
            strokeLinecap="round"
          />
        </svg>
        <b>{resume.where}</b>
        {next ? <span>{`Next up: ${next}`}</span> : null}
      </a>
    </>
  );
}

export default TrackHeroCta;
