import type { Dispatch } from 'react';
import type { Lesson, Unit } from '../content/schema';
import { playLabel, SPEEDS, type PlaybackAction, type PlaybackState } from '../engine/playback';
import type { Position } from '../engine/timeline';

export interface PlaybackControlsProps {
  lesson: Lesson;
  state: PlaybackState;
  dispatch: Dispatch<PlaybackAction>;
  /** The unit at the current position. */
  unit: Unit;
  /** The lesson's last position (its last unit's Practice). */
  last: Position;
}

const ICON = {
  prev: <path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  next: <path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  play: <path d="M3 2l9 5-9 5z" fill="currentColor" />,
  pause: <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" />,
};

function Icon({ name }: { name: keyof typeof ICON }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      {ICON[name]}
    </svg>
  );
}

/**
 * The log header's controls: the speed button, previous, Play and next. The
 * speed button shows the speed and names the next one; Play's words come from
 * `playLabel` (Play, Pause, Replay or Watch again). Presentational: the console
 * owns the keyboard shortcuts.
 *
 * Previous and Next say `aria-disabled` at either end rather than `disabled`:
 * a disabled button drops its focus to the page, and these are pressed again
 * and again, so the one in hand keeps the focus and simply does nothing.
 */
export function PlaybackControls({ lesson, state, dispatch, unit, last }: PlaybackControlsProps) {
  const atStart = state.position === 0;
  const atEnd = state.position >= last;
  const label = playLabel(lesson, state);
  const nextSpeed = SPEEDS[(SPEEDS.indexOf(state.speed) + 1) % SPEEDS.length];
  const speedLabel = `Speed ${state.speed}×. Click for ${nextSpeed}×`;

  return (
    <div className="console__controls">
      <button
        type="button"
        className="cbtn cbtn--speed"
        aria-label={speedLabel}
        title={speedLabel}
        onClick={() => dispatch({ type: 'cycleSpeed' })}
      >
        {`${state.speed}×`}
      </button>
      <button
        type="button"
        className="cbtn"
        aria-label="Previous step"
        title="Previous step"
        aria-disabled={atStart}
        onClick={() => {
          if (!atStart) dispatch({ type: 'prev' });
        }}
      >
        <Icon name="prev" />
      </button>
      {/* A unit with no Watch steps has nothing to play. */}
      <button
        type="button"
        className="cbtn cbtn--play"
        disabled={unit.steps.length === 0}
        onClick={() => dispatch({ type: 'toggle' })}
      >
        <Icon name={label === 'Pause' ? 'pause' : 'play'} />
        <span>{label}</span>
      </button>
      <button
        type="button"
        className="cbtn"
        aria-label="Next step"
        title="Next step"
        aria-disabled={atEnd}
        onClick={() => {
          if (!atEnd) dispatch({ type: 'next' });
        }}
      >
        <Icon name="next" />
      </button>
    </div>
  );
}

export default PlaybackControls;
