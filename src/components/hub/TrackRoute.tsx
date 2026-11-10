import type { ReactNode } from 'react';
import type { AvailableSummary, LessonSummary } from '../../content/registry';
import { STATUS_WORDS, actionLabel, lessonHref, lessonStatus } from '../../lib/hub';
import type { ReadyLesson, SoonLesson, TrackPart } from '../../lib/track';
import { resumePosition, type ProgressData } from '../../progress/store';
import '../site.css';
import PartsMarker from './PartsMarker';
import { useUpNext } from './useUpNext';

interface Props {
  parts: TrackPart[];
  entries: LessonSummary[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
  /** Unused; the page's default slot. */
  children?: ReactNode;
  /** Each ready lesson's figure, static HTML the page passes in as a slot named after the lesson's number. */
  [art: `art${number}`]: ReactNode;
}

/** A part's name with its last word in the accent. */
function Named({ title }: { title: string }) {
  const cut = title.lastIndexOf(' ');
  return (
    <>
      {title.slice(0, cut + 1)}
      <em>{title.slice(cut + 1)}</em>
    </>
  );
}

/**
 * The track page's route: each part as a stage with its lessons as numbered stops. A ready lesson is a tile with its
 * figure, status, title, subtitle and one button; a lesson not ready is a short outline tile.
 *
 * The up-next stop (amber circle and tile ring) shows only once the visitor has started; on a first visit the first
 * ready stop's button is primary instead. Until progress has loaded, and when storage is blocked, it shows that first
 * visit, so the server render and the first client render match.
 */
export default function TrackRoute(props: Props) {
  const { parts, entries, known } = props;
  const { data, next, current } = useUpNext(entries, known);
  const byKey = new Map(entries.map((e) => [e.key, e]));

  return (
    <div className="route">
      {parts.map((part) => (
        <section key={part.n} className="route-stage" aria-labelledby={`stage-${part.n}`}>
          <header className="route-stage__head">
            <span className="route-stage__mark" aria-hidden="true" />
            <h2 className="disp" id={`stage-${part.n}`}>
              <Named title={part.title} />
            </h2>
            <p>{`${part.lessons.length} ${part.lessons.length === 1 ? 'lesson' : 'lessons'}`}</p>
          </header>
          <ol className="route-stops">
            {part.lessons.map((lesson) =>
              lesson.ready ? (
                <ReadyStop
                  key={lesson.key}
                  lesson={lesson}
                  entry={byKey.get(lesson.key) as AvailableSummary}
                  data={data}
                  isNow={lesson.key === current}
                  isNext={lesson.key === next?.entry.key}
                  art={props[`art${lesson.number}`]}
                />
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
    <li className="stop stop--soon">
      <span className="stop__node">{lesson.n}</span>
      <div className="stop__tile">
        <span className="stop__art" aria-hidden="true">
          <span>{lesson.n}</span>
        </span>
        <div className="stop__info">
          <span className="stop__k">{STATUS_WORDS['not-ready']}</span>
          <h3 className="disp">{lesson.title}</h3>
        </div>
      </div>
    </li>
  );
}

interface ReadyProps {
  lesson: ReadyLesson;
  entry: AvailableSummary;
  data: ProgressData;
  /** The stop to continue from, marked amber: only once the visitor has started. */
  isNow: boolean;
  /** The lesson up next, whose button is primary. */
  isNext: boolean;
  art: ReactNode;
}

function ReadyStop({ lesson, entry, data, isNow, isNext, art }: ReadyProps) {
  const status = lessonStatus(entry, data);
  const href = lessonHref(entry, data);
  const position = Math.min(resumePosition(data, lesson.key) ?? 0, lesson.places.length - 1);
  const cls = status === 'done' ? ' stop--done' : isNow ? ' stop--now' : '';
  const kind = status === 'done' ? ' done' : status === 'in-progress' ? ' go' : '';
  return (
    <li className={`stop${cls}`}>
      <span className="stop__node">{lesson.n}</span>
      <div className="stop__tile">
        <a className="stop__art l-art" href={href} tabIndex={-1} aria-hidden="true">
          {/* Keyed by lesson, as the side card's is: a slot's HTML is never re-rendered, so it needs a fresh mount. */}
          <span key={lesson.key} className="stop__slot">
            {art}
          </span>
        </a>
        <div className="stop__info">
          <p className="stop__state">
            <span className={`stop__k${kind}`}>{STATUS_WORDS[status]}</span>
            {status === 'in-progress' ? <PartsMarker parts={lesson.places[position]!.parts} /> : null}
          </p>
          <h3 className="disp">
            <a href={href}>{lesson.title}</a>
          </h3>
          <p className="stop__sub">{lesson.subtitle}</p>
          <div className="stop__acts">
            <a className={isNext ? 'btn btn--primary btn--small' : 'btn btn--small'} href={href}>
              {actionLabel(status)}
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
