import type { ReactNode } from 'react';
import type { LessonSummary } from '../../content/registry';
import { UP_NEXT_KICKER, lessonLine, stripStates, stripWords } from '../../lib/hub';
import '../site.css';
import './hub.css';
import TrackStrip from './TrackStrip';
import { useUpNext } from './useUpNext';

interface Props {
  entries: LessonSummary[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
  /** Unused; the page's default slot. */
  children?: ReactNode;
  /** Each ready lesson's figure, static HTML the page passes in as a slot named after the lesson's number. */
  [art: `art${number}`]: ReactNode;
}

/**
 * The track page's left column below the title: the lesson-square strip and the one card for the lesson to take
 * next, with a full-width Start / Continue / Watch again button. The route beside it reads the same hook, so the two
 * always agree on the lesson up next.
 *
 * Until progress has loaded, and when storage is blocked, it shows the first-visit render, so the server render and
 * the first client render match. A first visit shows no amber square. With no ready lesson only the strip is drawn.
 */
export default function TrackSide(props: Props) {
  const { entries, known } = props;
  const { data, next, current, label, href } = useUpNext(entries, known);

  return (
    <>
      <TrackStrip states={stripStates(entries, data, current)} words={stripWords(entries, data)} />
      {next !== null ? (
        <div className="side-now">
          {/* Keyed by lesson: Astro's slot wrapper never re-renders, so a new lesson's figure needs a fresh mount. */}
          <div key={next.entry.key} className="side-now__art l-art" aria-hidden="true">
            {props[`art${next.entry.number}`]}
          </div>
          <div className="side-now__body">
            <span className={next.kind === 'start' ? 'side-now__k' : 'side-now__k go'}>{UP_NEXT_KICKER[next.kind]}</span>
            <b className="side-now__t disp">{next.entry.title}</b>
            <span className="side-now__s">{lessonLine(next.entry)}</span>
            <a className="btn btn--primary side-now__btn" href={href!}>
              {label}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
