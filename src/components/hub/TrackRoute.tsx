import type { AvailableSummary, LessonSummary } from '../../content/registry';
import { STATUS_WORDS, lessonHref, lessonStatus } from '../../lib/hub';
import type { ReadyLesson, SoonLesson, TrackPart } from '../../lib/track';
import { resumePosition, type ProgressData } from '../../progress/store';
import '../site.css';
import './hub.css';
import { Stamp } from '../Stamp';
import PartsMarker from './PartsMarker';
import { useUpNext } from './useUpNext';

interface Props {
  parts: TrackPart[];
  entries: LessonSummary[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
}

/** The lesson's number as the chip shows it, with "Lesson " for a screen reader alone. */
function Chip({ n }: { n: string }) {
  return (
    <span className="stop__node">
      <span className="sr-only">Lesson </span>
      {n}
    </span>
  );
}

/**
 * The track page's route: each part as a stage with its lessons as numbered stops. A ready lesson is a card of words
 * only (its number, name, subtitle, status and fact-check stamp) with one link, its name, which covers the card; a
 * lesson not ready is a dashed card with no link. The page draws no lesson figure.
 *
 * The up-next stop (orange chip and wash) shows only once the visitor has started. Until progress has loaded, and
 * when storage is blocked, it shows a first visit, so the server render and the first client render match.
 */
export default function TrackRoute({ parts, entries, known }: Props) {
  const { data, current } = useUpNext(entries, known);
  const byKey = new Map(entries.map((e) => [e.key, e]));

  return (
    <div className="route">
      {parts.map((part) => (
        <section key={part.n} className="route-stage" aria-labelledby={`stage-${part.n}`}>
          <h2 className="disp" id={`stage-${part.n}`}>
            {part.title}
          </h2>
          <p className="route-stage__count">{`${part.lessons.length} ${part.lessons.length === 1 ? 'lesson' : 'lessons'}`}</p>
          <ol className="route-stops" role="list">
            {part.lessons.map((lesson) =>
              lesson.ready ? (
                <ReadyStop key={lesson.key} lesson={lesson} entry={byKey.get(lesson.key) as AvailableSummary} data={data} isNow={lesson.key === current} />
              ) : (
                <SoonStop key={lesson.key} lesson={lesson} />
              ),
            )}
          </ol>
        </section>
      ))}
    </div>
  );
}

function SoonStop({ lesson }: { lesson: SoonLesson }) {
  return (
    <li className="stop cs-card stop--soon">
      <Chip n={lesson.n} />
      <div className="stop__info">
        <h3 className="disp">{lesson.title}</h3>
        <div className="stop__foot">
          <p className="stop__state">
            <span className="stop__k">{STATUS_WORDS['not-ready']}</span>
          </p>
        </div>
      </div>
    </li>
  );
}

interface ReadyProps {
  lesson: ReadyLesson;
  entry: AvailableSummary;
  data: ProgressData;
  /** The stop to continue from, marked orange: only once the visitor has started. */
  isNow: boolean;
}

function ReadyStop({ lesson, entry, data, isNow }: ReadyProps) {
  const status = lessonStatus(entry, data);
  const href = lessonHref(entry, data);
  const position = Math.min(resumePosition(data, lesson.key) ?? 0, lesson.places.length - 1);
  const cls = status === 'done' ? ' stop--done' : isNow ? ' stop--now' : '';
  const kind = status === 'done' ? ' done' : status === 'in-progress' ? ' go' : '';
  return (
    <li className={`stop cs-card${cls}`}>
      <Chip n={lesson.n} />
      <div className="stop__info">
        <h3 className="disp">
          <a href={href}>{lesson.title}</a>
        </h3>
        <p className="stop__sub">{lesson.subtitle}</p>
        <div className="stop__foot">
          <p className="stop__state">
            <span className={`stop__k${kind}`}>{STATUS_WORDS[status]}</span>
            {status === 'in-progress' ? <PartsMarker parts={lesson.places[position]!.parts} /> : null}
          </p>
          <Stamp stamp={lesson.stamp} sources={false} />
        </div>
      </div>
    </li>
  );
}
