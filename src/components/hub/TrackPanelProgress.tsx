import { UP_NEXT_KICKER, stripStates, stripWords } from '../../lib/hub';
import type { LessonSummary } from '../../content/registry';
import '../site.css';
import TrackStrip from './TrackStrip';
import { useUpNext } from './useUpNext';

interface Props {
  entries: LessonSummary[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
  /** The track's own page, for "See the whole track". */
  trackUrl: string;
}

/** The lesson's number chip: not started yet, you are here, done. */
const CHIP = { start: 'ahead', next: 'here', 'done-so-far': 'done' } as const;

/**
 * What a track's card shows of this visitor's progress: the lesson-square strip, and the box for the lesson to take
 * next with its way in (the Start / Continue / Watch again button and "See the whole track"). Both are the card's own
 * grid items: the page's island wrapper is `display: contents`.
 *
 * Until progress has loaded, and when storage is blocked, it shows the first-visit render, so the server render and
 * the first client render match. A first visit shows no orange square. With no ready lesson only the strip is drawn.
 */
export default function TrackPanelProgress({ entries, known, trackUrl }: Props) {
  const { data, next, current, label, href } = useUpNext(entries, known);

  return (
    <>
      <TrackStrip states={stripStates(entries, data, current)} words={stripWords(entries, data)} />
      {next !== null && (
        <div className="upnext" data-kind={next.kind}>
          <p className="upnext__k">{UP_NEXT_KICKER[next.kind]}</p>
          <p className="upnext__l">
            <span className="upnext__n" data-state={CHIP[next.kind]}>
              <span className="sr-only">Lesson </span>
              {String(next.entry.number).padStart(2, '0')}
            </span>
            <b className="upnext__t">{next.entry.title}</b>
          </p>
          <p className="upnext__s">{next.entry.subtitle}</p>
          <p className="upnext__go">
            <a className="btn btn--primary" href={href!}>
              {label}
            </a>
            <a className="wholetrack" href={trackUrl}>
              See the whole track
            </a>
          </p>
        </div>
      )}
    </>
  );
}
