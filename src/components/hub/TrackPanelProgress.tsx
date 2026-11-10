import type { ReactNode } from 'react';
import type { LessonSummary } from '../../content/registry';
import { UP_NEXT_KICKER, lessonLine, stripStates, stripWords } from '../../lib/hub';
import '../site.css';
import TrackStrip from './TrackStrip';
import { useUpNext } from './useUpNext';

interface Props {
  entries: LessonSummary[];
  /** The page's `knownFrom(entries)`. */
  known: Record<string, number>;
  /** The track's own page, for "See the whole track". */
  trackUrl: string;
  /** Unused; the page's default slot. */
  children?: ReactNode;
  /** Each ready lesson's figure, static HTML the page passes in as a slot named after the lesson's number. */
  [art: `art${number}`]: ReactNode;
}

/**
 * What a track's panel shows of this visitor's progress: the lesson-square strip, the Start / Continue / Watch again
 * button with "See the whole track", and the card for the lesson to take next.
 *
 * Until progress has loaded, and when storage is blocked, it shows the first-visit render, so the server render and
 * the first client render match. A first visit shows no amber square. With no ready lesson only the strip is drawn.
 */
export default function TrackPanelProgress(props: Props) {
  const { entries, known, trackUrl } = props;
  const { data, next, current, label, href } = useUpNext(entries, known);

  let cta: ReactNode = null;
  let card: ReactNode = null;
  if (next !== null) {
    const { entry, kind } = next;
    cta = (
      <div className="panel__cta">
        <a className="btn btn--primary" href={href!}>
          {label}
        </a>
        <a className="wholetrack" href={trackUrl}>
          See the whole track
        </a>
      </div>
    );
    card = (
      <a className="next lift" href={href!}>
        {/* Keyed by lesson: Astro's slot wrapper never re-renders, so a new lesson's figure needs a fresh mount. */}
        <span key={entry.key} className="next__art l-art" aria-hidden="true">
          {props[`art${entry.number}`]}
        </span>
        <span>
          <span className={kind === 'start' ? 'next__k' : 'next__k go'}>{UP_NEXT_KICKER[kind]}</span>
          <b className="next__t disp">{entry.title}</b>
          <span className="next__s">{lessonLine(entry)}</span>
        </span>
      </a>
    );
  }

  return (
    <>
      <TrackStrip states={stripStates(entries, data, current)} words={stripWords(entries, data)} />
      {cta}
      {card}
    </>
  );
}
