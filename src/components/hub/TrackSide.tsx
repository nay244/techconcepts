import { useEffect, useRef, type ReactNode } from 'react';
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
  /** The first-visit lesson's figure, static HTML the page passes in as a slot named after the lesson's number. Any other lesson's figure is borrowed from the route on the same page. */
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
/**
 * The figure of a lesson the page gave this card no copy of: a copy of the one the route shows for the same lesson
 * (TrackRoute marks each with data-art). The page hands the card only the first-visit figure, so the page's HTML holds
 * each figure once; a returning visitor's lesson is further along the route, which is already on the page.
 * Without a route on the page, or without that stop, the frame stays empty.
 */
function BorrowedArt({ number }: { number: number }) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const source = document.querySelector(`.stop__slot[data-art="${number}"]`);
    if (frame.current === null || source === null) return;
    // On the built page the figure sits inside Astro's slot wrapper; the copy takes what is inside it, not the wrapper.
    const from = source.querySelector(':scope > astro-slot, :scope > astro-static-slot') ?? source;
    frame.current.replaceChildren(...Array.from(from.childNodes, (node) => node.cloneNode(true)));
  }, [number]);
  // No React children: what the effect puts here is the frame's own, and React leaves it alone.
  return <div ref={frame} className="side-now__art l-art" aria-hidden="true" />;
}

export default function TrackSide(props: Props) {
  const { entries, known } = props;
  const { data, next, current, label, href } = useUpNext(entries, known);

  return (
    <>
      <TrackStrip states={stripStates(entries, data, current)} words={stripWords(entries, data)} />
      {next !== null ? (
        <div className="side-now">
          {/* Keyed by lesson: Astro's slot wrapper never re-renders, so a new lesson's figure needs a fresh mount.
              The page gives this card the first-visit lesson's figure; any other lesson's is borrowed from the route. */}
          {props[`art${next.entry.number}`] !== undefined ? (
            <div key={next.entry.key} className="side-now__art l-art" aria-hidden="true">
              {props[`art${next.entry.number}`]}
            </div>
          ) : (
            <BorrowedArt key={next.entry.key} number={next.entry.number} />
          )}
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
