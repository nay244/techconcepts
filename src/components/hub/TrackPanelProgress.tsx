import type { ReactNode } from 'react';
import type { LessonSummary } from '../../content/registry';
import { UP_NEXT_KICKER, actionLabel, lessonHref, lessonLine, lessonStatus, stripStates, stripWords, upNext } from '../../lib/hub';
import { emptyProgress } from '../../progress/store';
import { useProgress } from '../../progress/useProgress';
import '../site.css';
import TrackStrip from './TrackStrip';

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
  const { ready, available, data: stored } = useProgress(known);
  const data = ready && available ? stored : emptyProgress();
  const next = upNext(entries, data);
  const current = next !== null && next.kind !== 'start' ? next.entry.key : null;

  let cta: ReactNode = null;
  let card: ReactNode = null;
  if (next !== null) {
    const { entry, kind } = next;
    const href = lessonHref(entry, data);
    const label = kind === 'start' ? 'Start' : kind === 'done-so-far' ? 'Watch again' : actionLabel(lessonStatus(entry, data));
    cta = (
      <div className="panel__cta">
        <a className="btn btn--primary" href={href}>
          {label}
        </a>
        <a className="wholetrack" href={trackUrl}>
          See the whole track
        </a>
      </div>
    );
    card = (
      <a className="next lift" href={href}>
        <span className="next__art l-art" aria-hidden="true">
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
