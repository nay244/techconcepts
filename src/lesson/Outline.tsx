import type { LessonSummary } from '../content/registry';
import type { Lesson } from '../content/schema';
import type { Sections } from '../engine/timeline';
import { byPart, STATUS_TEXT } from '../lib/entries';
import type { LessonProgress, ProgressData } from '../progress/store';

export interface OutlineProps {
  lesson: Lesson;
  sections: Sections;
  position: number;
  onJump(position: number): void;
  /** Every lesson in the track, planned ones included, in track order. */
  entries: LessonSummary[];
  /** The key of the lesson on this page. */
  currentKey: string;
  progress: ProgressData;
}

function statusOf(progress: ProgressData, key: string): LessonProgress['status'] | null {
  return Object.hasOwn(progress.lessons, key) ? progress.lessons[key]!.status : null;
}

function LessonLink({ entry, current, status }: { entry: LessonSummary; current: boolean; status: LessonProgress['status'] | null }) {
  const body = (
    <>
      <span className="outline__lesson-num" aria-hidden="true">
        {entry.number}
      </span>
      <span className="outline__lesson-title">{entry.title}</span>
      {entry.available ? (
        status === null ? null : (
          <span className="outline__marker" data-status={status}>
            <span className="sr-only">, </span>
            {STATUS_TEXT[status]}
          </span>
        )
      ) : (
        <span className="outline__marker" data-status="soon">
          <span className="sr-only">, </span>
          Coming soon
        </span>
      )}
    </>
  );
  return entry.available ? (
    <a className="outline__lesson" href={entry.url} aria-current={current ? 'page' : undefined}>
      {body}
    </a>
  ) : (
    <span className="outline__lesson" data-available="false">
      {body}
    </span>
  );
}

/**
 * The lesson outline: a button for the Overview, each step, Try it, Check
 * yourself and the Recap, with the current one marked (a filled dot, a bar and
 * `aria-current`, so it is not told by colour). Below it, a collapsible list of
 * every lesson in the track, grouped by part, saying "Finished" or "In
 * progress" in words once progress has loaded.
 */
export function Outline({ lesson, sections, position, onJump, entries, currentKey, progress }: OutlineProps) {
  const items: { position: number; label: string; step?: number }[] = [
    { position: 0, label: 'Overview' },
    ...lesson.steps.map((step, i) => ({ position: i + 1, label: step.title, step: i + 1 })),
    { position: sections.tryIt, label: 'Try it' },
    { position: sections.check, label: 'Check yourself' },
    { position: sections.recap, label: 'Recap' },
  ];

  return (
    <nav className="outline" aria-label="Lesson outline">
      <h2 className="console__label">Lesson</h2>
      <ol className="outline__items" role="list">
        {items.map((item) => (
          <li key={item.position}>
            <button
              type="button"
              className="outline__item"
              aria-current={item.position === position ? 'step' : undefined}
              // "Step 2: Offer" rather than the bare "2 Offer" on screen. Set outright, as engines
              // disagree on the spaces when a name is pieced together from visually hidden text.
              aria-label={item.step === undefined ? undefined : `Step ${item.step}: ${item.label}`}
              onClick={() => onJump(item.position)}
            >
              <span className="outline__dot" aria-hidden="true" />
              {item.step === undefined ? null : (
                <span className="outline__num" aria-hidden="true">
                  {item.step}
                </span>
              )}
              <span className="outline__text">{item.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <details className="outline__lessons">
        <summary>All lessons</summary>
        {byPart(entries).map((part) => (
          <div key={part.title} className="outline__part">
            <h3 className="outline__part-title">{part.title}</h3>
            <ol className="outline__list" role="list">
              {part.entries.map((entry) => (
                <li key={entry.key}>
                  <LessonLink entry={entry} current={entry.key === currentKey} status={statusOf(progress, entry.key)} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </details>
    </nav>
  );
}

export default Outline;
