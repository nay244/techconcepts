import type { Dispatch } from 'react';
import type { Lesson, Unit } from '../content/schema';
import { canReplay, playButton, SPEEDS, type ForwardButton, type PlaybackAction, type PlaybackState } from '../engine/playback';

export interface PlaybackControlsProps {
  lesson: Lesson;
  state: PlaybackState;
  dispatch: Dispatch<PlaybackAction>;
  /** The unit at the current position. */
  unit: Unit;
  /** What the forward button reads and leads to (`forwardButton`). */
  forward: ForwardButton;
  /** Whether it shows its short form ("Next: step 4"): where there is less room than the full form needs. */
  short: boolean;
  /** Presses the forward button: the console knows where it leads. */
  onForward(): void;
}

const ICON = {
  prev: <path d="M9 2L4 7l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  next: <path d="M5 2l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  play: <path d="M3 2l9 5-9 5z" fill="currentColor" />,
  pause: <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" />,
  replay: (
    <>
      <path d="M2.6 7.4A4.6 4.6 0 1 0 4 3.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M1.6 1.8l.9 3.2 3.1-.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof ICON }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      {ICON[name]}
    </svg>
  );
}

/**
 * The controls at the foot of the guide, left to right: the speed button, Back, the play
 * button (Play all, or Pause while a run is going), the replay icon, and the
 * forward button, the only orange one: it names the place it goes to ("Next:
 * DHCP Acknowledge", "Next lesson: Ports"). The speed button shows the speed and names the next one.
 * Presentational: the console owns what the forward button does and the keys.
 *
 * Every button that can have nothing to do says `aria-disabled` rather than
 * `disabled`: a disabled button drops its focus to the page, and these are
 * pressed again and again, so the one in hand keeps the focus and does nothing.
 */
export function PlaybackControls({ lesson, state, dispatch, unit, forward, short, onForward }: PlaybackControlsProps) {
  const atStart = state.position === 0;
  const play = playButton(state);
  const noSteps = unit.steps.length === 0;
  const replayable = canReplay(lesson, state);
  const nextSpeed = SPEEDS[(SPEEDS.indexOf(state.speed) + 1) % SPEEDS.length];
  const form = short ? 'short' : 'full';
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
        className="cbtn cbtn--back"
        aria-label="Previous step"
        title="Previous step (←)"
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
        className="cbtn cbtn--alt"
        aria-label={play.words}
        title={`${play.words} (Space)`}
        aria-disabled={noSteps}
        onClick={() => {
          if (!noSteps) dispatch({ type: 'toggle' });
        }}
      >
        <Icon name={play.icon} />
        <span className="cbtn__label" aria-hidden="true">
          {play.words}
        </span>
      </button>
      <button
        type="button"
        className="cbtn cbtn--replay"
        aria-label="Replay step"
        title="Replay step"
        aria-disabled={!replayable}
        onClick={() => {
          if (replayable) dispatch({ type: 'replay' });
        }}
      >
        <Icon name="replay" />
      </button>
      <button
        type="button"
        className="cbtn cbtn--go"
        aria-label={forward.names[form]}
        title={forward.titles[form]}
        aria-disabled={forward.disabled}
        onClick={() => {
          if (!forward.disabled) onForward();
        }}
      >
        <span className="go__label">{forward.words[form]}</span>
        <Icon name="next" />
      </button>
    </div>
  );
}

export default PlaybackControls;
