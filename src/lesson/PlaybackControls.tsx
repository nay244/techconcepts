import type { Dispatch, ReactNode } from 'react';
import type { PlaybackAction, PlaybackState } from '../engine/playback';
import './lesson.css';

export interface PlaybackControlsProps {
  state: PlaybackState;
  /** Whether the current position has events to play. Without any, there is nothing to replay. */
  hasEvents: boolean;
  dispatch: Dispatch<PlaybackAction>;
}

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

/**
 * Speed, previous, play or pause, next and replay. Presentational: it sends
 * actions to `dispatch` and owns no keyboard shortcut (the console does). The
 * icon buttons are named by aria-label, with the same words as a tooltip.
 */
export function PlaybackControls({ state, hasEvents, dispatch }: PlaybackControlsProps) {
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
        <button
          type="button"
          className="playback__button"
          aria-label="Previous step"
          title="Previous step"
          onClick={() => dispatch({ type: 'prev' })}
        >
          {ICONS.prev}
        </button>
        <button
          type="button"
          className="playback__button playback__button--primary"
          aria-label={playLabel}
          title={playLabel}
          onClick={() => dispatch({ type: 'toggle' })}
        >
          {state.playing ? ICONS.pause : ICONS.play}
        </button>
        <button
          type="button"
          className="playback__button"
          aria-label="Next step"
          title="Next step"
          onClick={() => dispatch({ type: 'next' })}
        >
          {ICONS.next}
        </button>
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
