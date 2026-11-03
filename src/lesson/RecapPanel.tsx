import { CERT_TAGS } from '../content/certs';
import type { AvailableSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import './lesson.css';

export interface RecapPanelProps {
  lesson: Lesson;
  prev: AvailableSummary | null;
  next: AvailableSummary | null;
  /** True when the track lists a lesson after this one that has not been written yet. */
  nextPlanned: boolean;
  /** Where "Back to the track" goes, for the last lesson written. */
  trackUrl: string;
}

/**
 * The Recap: the takeaways, who the lesson is relevant for, its references, and
 * the way on. The next lesson is a link; with none written yet it says one is
 * coming (if the track plans it), and otherwise the way on is back to the track.
 */
export function RecapPanel({ lesson, prev, next, nextPlanned, trackUrl }: RecapPanelProps) {
  return (
    <div className="recap">
      <h2 className="lesson-panel__title">Recap</h2>
      <ul className="recap__takeaways">
        {lesson.recap.takeaways.map((takeaway, i) => (
          <li key={i}>{takeaway}</li>
        ))}
      </ul>

      {lesson.certTags.length > 0 ? (
        <div className="recap__section">
          <p className="recap__label">Relevant for:</p>
          <ul className="recap__tags">
            {lesson.certTags.map((tag) => (
              <li key={tag}>{CERT_TAGS[tag]}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {lesson.references.length > 0 ? (
        <div className="recap__section">
          <h3 className="recap__label">References</h3>
          <ul className="recap__references">
            {lesson.references.map((reference) => (
              <li key={reference.url}>
                <a href={reference.url} target="_blank" rel="noopener">
                  {reference.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <nav className="recap__nav" aria-label="Lesson navigation">
        {next !== null ? (
          <a className="recap__button" href={next.url}>
            {`Next: ${next.title}`}
          </a>
        ) : nextPlanned ? (
          <p className="recap__soon">Next lesson coming soon</p>
        ) : (
          <a className="recap__button" href={trackUrl}>
            Back to the track
          </a>
        )}
        {prev !== null ? (
          <a className="recap__prev" href={prev.url}>
            {`Previous: ${prev.title}`}
          </a>
        ) : null}
      </nav>
    </div>
  );
}

export default RecapPanel;
