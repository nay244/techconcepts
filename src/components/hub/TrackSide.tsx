import { UP_NEXT_KICKER, stripStates, stripWords } from '../../lib/hub';
import type { LessonSummary } from '../../content/registry';
import '../site.css';
import './hub.css';
import TrackStrip from './TrackStrip';
import { useUpNext } from './useUpNext';

interface Props {
  entries: LessonSummary[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
}

/** The lesson's number chip: not started yet, you are here, done. */
const CHIP = { start: 'ahead', next: 'here', 'done-so-far': 'done' } as const;

/**
 * The track page's head below the title: the lesson-square strip and the one card for the lesson to take next, whose
 * index tab is its kicker and whose full-width Start / Continue / Watch again button is the page's one filled button.
 * The route beside it reads the same hook, so the two always agree on the lesson up next. The page draws no lesson
 * figure, so nothing here is borrowed from the route.
 *
 * Until progress has loaded, and when storage is blocked, it shows the first-visit render, so the server render and
 * the first client render match. A first visit shows no orange square. With no ready lesson only the strip is drawn.
 */
export default function TrackSide({ entries, known }: Props) {
  const { data, next, current, label, href } = useUpNext(entries, known);

  return (
    <>
      <TrackStrip states={stripStates(entries, data, current)} words={stripWords(entries, data)} />
      {next !== null ? (
        <div className="upnext cs-card cs-card--beneath" data-kind={next.kind}>
          <p className={next.kind === 'next' ? 'upnext__k cs-tab cs-tab--here' : 'upnext__k cs-tab'}>{UP_NEXT_KICKER[next.kind]}</p>
          <p className="upnext__l">
            <span className="upnext__n" data-state={CHIP[next.kind]}>
              <span className="sr-only">Lesson </span>
              {String(next.entry.number).padStart(2, '0')}
            </span>
            <b className="upnext__t">{next.entry.title}</b>
          </p>
          <p className="upnext__s">{next.entry.subtitle}</p>
          <a className="btn btn--primary upnext__btn" href={href!}>
            {label}
          </a>
        </div>
      ) : null}
    </>
  );
}
