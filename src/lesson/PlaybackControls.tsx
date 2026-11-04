import type { Dispatch, ReactNode } from 'react';
import type { PlaybackAction, PlaybackState } from '../engine/playback';
import './lesson.css';

export type PlaybackControlsProps =
  | {
      /** The full set, for a scene that plays: speed, previous, play or pause, next and replay. */
      variant?: 'playback';
      state: PlaybackState;
      /** Whether the current position has events to play. Without any, there is nothing to replay. */
      hasEvents: boolean;
      dispatch: Dispatch<PlaybackAction>;
    }
  | {
      /** Previous and next only, for a scene with nothing to play (a playground, ruling R29). */
      variant: 'steps';
      dispatch: Dispatch<PlaybackAction>;
    };

const SPEEDS = [
  { speed: 0.5, label: '0.5×' },
  { speed: 1, label: '1×' },
  { speed: 2, label: '2×' },
] as const;

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const ICONS = {
  prev: (
    <Icon>
      <path d="M3 2.5h2v11H3zM13 2.5v11L5.5 8z" fill="currentColor" />
    </Icon>
  ),
  play: (
    <Icon>
      <path d="M4 2.5v11L13 8z" fill="currentColor" />
    </Icon>
  ),
  pause: (
    <Icon>
      <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />
    </Icon>
  ),
  next: (
    <Icon>
      <path d="M11 2.5h2v11h-2zM3 2.5v11L10.5 8z" fill="currentColor" />
    </Icon>
  ),
  replay: (
    <Icon>
      <path
        d="M13 8a5 5 0 1 1-1.6-3.7M11.8 1.8v2.9H8.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  ),
};

function StepButton({ direction, dispatch }: { direction: 'prev' | 'next'; dispatch: Dispatch<PlaybackAction> }) {
  const label = direction === 'prev' ? 'Previous step' : 'Next step';
  return (
    <button type="button" className="playback__button" aria-label={label} title={label} onClick={() => dispatch({ type: direction })}>
      {ICONS[direction]}
    </button>
  );
}

/**
 * Speed, previous, play or pause, next and replay; or, as `variant="steps"`,
 * previous and next alone. Presentational: it sends actions to `dispatch` and
 * owns no keyboard shortcut (the console does). The icon buttons are named by
 * aria-label, with the same words as a tooltip.
 */
export function PlaybackControls(props: PlaybackControlsProps) {
  const { dispatch } = props;
  if (props.variant === 'steps') {
    return (
      <div className="playback" data-variant="steps">
        <div className="playback__buttons">
          <StepButton direction="prev" dispatch={dispatch} />
          <StepButton direction="next" dispatch={dispatch} />
        </div>
      </div>
    );
  }
  const { state, hasEvents } = props;
  const playLabel = state.playing ? 'Pause (Space)' : 'Play (Space)';
  return (
    <div className="playback">
      <div className="playback__speeds" role="group" aria-label="Speed">
        {SPEEDS.map(({ speed, label }) => (
          <button
            key={speed}
            type="button"
            className="playback__speed"
            aria-pressed={state.speed === speed}
            onClick={() => dispatch({ type: 'speed', speed })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="playback__buttons">
        <StepButton direction="prev" dispatch={dispatch} />
        <button
          type="button"
          className="playback__button playback__button--primary"
          aria-label={playLabel}
          title={playLabel}
          onClick={() => dispatch({ type: 'toggle' })}
        >
          {state.playing ? ICONS.pause : ICONS.play}
        </button>
        <StepButton direction="next" dispatch={dispatch} />
        <button
          type="button"
          className="playback__button"
          aria-label="Replay step"
          title="Replay step"
          disabled={!hasEvents}
          onClick={() => dispatch({ type: 'replay' })}
        >
          {ICONS.replay}
        </button>
      </div>
    </div>
  );
}

export default PlaybackControls;
