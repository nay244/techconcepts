import { useEffect, useRef, useState } from 'react';
import { useProgress } from '../progress/useProgress';
import './site.css';

// Reset clears everything, so no lesson needs to be known. A constant keeps the
// object stable across renders.
const NO_LESSONS: Record<string, number> = {};

type Focus = 'confirm' | 'button' | null;

/**
 * "Reset progress", then an inline "Reset all progress on this device?" with
 * Reset and Cancel. Focus moves to the question, and back to the button
 * afterwards. Nothing shows while storage is blocked: there is no progress.
 */
export function ResetProgress() {
  const { ready, available, reset } = useProgress(NO_LESSONS);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [focus, setFocus] = useState<Focus>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focus === 'confirm') confirmRef.current?.focus();
    if (focus === 'button') buttonRef.current?.focus();
    setFocus(null);
  }, [focus, confirming]);

  const show = ready && available;
  return (
    <div className="reset">
      {show && !confirming ? (
        <button
          ref={buttonRef}
          type="button"
          className="btn btn--small"
          onClick={() => {
            setMessage('');
            setConfirming(true);
            setFocus('confirm');
          }}
        >
          Reset progress
        </button>
      ) : null}
      {show && confirming ? (
        <div ref={confirmRef} className="reset__confirm" role="group" aria-label="Reset all progress on this device?" tabIndex={-1}>
          <p className="reset__question" aria-hidden="true">
            Reset all progress on this device?
          </p>
          <button
            type="button"
            className="btn btn--small btn--primary"
            onClick={() => {
              reset();
              setMessage('Progress cleared');
              setConfirming(false);
              setFocus('button');
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn--small"
            onClick={() => {
              setConfirming(false);
              setFocus('button');
            }}
          >
            Cancel
          </button>
        </div>
      ) : null}
      <span role="status" className={message === '' ? undefined : 'reset__message'}>
        {message}
      </span>
    </div>
  );
}

export default ResetProgress;
