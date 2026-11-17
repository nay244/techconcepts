import type { Lesson, Unit } from '../content/schema';
import { holding, type PlaybackState } from '../engine/playback';
import type { Position, Slot } from '../engine/timeline';
import { placeLabel } from './placeLabel';
import { Timeline, positionsOf } from './Timeline';

export interface TopBarProps {
  lesson: Lesson;
  trackTitle: string;
  trackUrl: string;
  /** The lesson's number in the track, counting planned lessons too. */
  number: number;
  /** Every lesson the track plans, written or not: the "20" in "Lesson 10 of 20". */
  total: number;
  state: PlaybackState;
  /** What the current position shows, and its unit (the console's derived state). */
  slot: Slot;
  unit: Unit;
  /** With less motion asked for, a hold does not fill the rule between two marks. */
  reducedMotion: boolean;
  /** Goes to a place (a stop of the timeline). */
  onGo(position: Position): void;
  /** Opens the lessons sheet (the button under 1100px wide). */
  onOpenLessons(): void;
}

const LIST_ICON = (
  <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <path d="M2 3.5h10M2 7h10M2 10.5h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * The lesson's bar, under the site's header: over the track column, "Tracks /" and the track's name (both links); over
 * the scene, the timeline of the lesson's places with its count. It holds no mark, no theme button and no stamp: the
 * site's header has the first two and the lesson page shows no stamp.
 *
 * Under 1100px there is no track column, so the first cell holds the lesson's name (the page's `h1` at those widths;
 * the column's head holds it from 1100px, and CSS shows exactly one of the two), and the button "9 of 20" opens the
 * lessons sheet. The bar is a `div`: the site's header is the page's one banner.
 */
export function TopBar({ lesson, trackTitle, trackUrl, number, total, state, slot, unit, reducedMotion, onGo, onOpenLessons }: TopBarProps) {
  const hold = reducedMotion ? null : holding(state);
  return (
    <div className="console__panel console__top">
      <div className="top__lesson">
        <h1 className="top__name" title={lesson.title}>
          {lesson.title}
        </h1>
        <span className="top__where">{placeLabel(unit, slot)}</span>
        <p className="top__trk">
          <span className="track__crumb">
            <a href="/tracks">Tracks</a> <span aria-hidden="true">/</span>
          </span>
          <a className="track__title" href={trackUrl}>
            <span>{trackTitle}</span>
          </a>
        </p>
      </div>
      <Timeline
        units={lesson.units}
        unitIndex={slot.unit}
        positions={positionsOf(lesson, slot.unit, unit.steps.length)}
        position={state.position}
        slot={slot}
        onGo={onGo}
        hold={hold}
      />
      <button
        type="button"
        className="cbtn top__lessons"
        aria-haspopup="dialog"
        aria-label={`${number} of ${total}: all ${total} lessons, this is lesson ${number}`}
        onClick={onOpenLessons}
      >
        {LIST_ICON}
        <span aria-hidden="true">{`${number} of ${total}`}</span>
      </button>
    </div>
  );
}

export default TopBar;
