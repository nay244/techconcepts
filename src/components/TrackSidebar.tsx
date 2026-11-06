import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { trackCompletion } from '../progress/store';
import { useProgress } from '../progress/useProgress';
import './site.css';

type Focus = 'confirm' | 'button' | 'title' | null;

/**
 * The track page's left column (track-v2): "Your progress", then the page's own parts list (`children`, static).
 *
 * A first visit, the server render and blocked storage say that progress is kept in this browser. Once this
 * browser has progress in the track: "n of 20 complete" over a bar with one segment per planned lesson in its place
 * (finished in the accent, in progress in marigold: current), which lessons are in progress, and "Clear my
 * progress". Clear asks "Clear all progress on this device?" first, with Clear and Keep it. Focus moves as
 * ResetProgress's does: to the question when it opens, and back to the button on Keep it. Clear leaves no button to
 * go back to, so focus goes to the card's title, and "Progress cleared" is announced. Progress cleared elsewhere
 * (another tab) closes an open question too, and focus lost with it goes to the title.
 *
 * `lessons` is every planned lesson in track order; `known` is the page's `knownFrom(entries)`.
 */
export function TrackSidebar({
  lessons,
  known,
  children,
}: {
  lessons: Array<{ key: string; title: string }>;
  known: Record<string, number>;
  children?: ReactNode;
}) {
  const { ready, available, data, reset } = useProgress(known);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [focus, setFocus] = useState<Focus>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const question = useId();

  useEffect(() => {
    if (focus === null) return;
    ({ confirm: confirmRef, button: buttonRef, title: titleRef })[focus].current?.focus();
    setFocus(null);
  }, [focus]);

  const { finished, inProgress } = trackCompletion(
    data,
    lessons.map((l) => l.key),
  );
  const saved = ready && available && finished + inProgress > 0;

  // Progress cleared elsewhere (another tab) closes an open question; if focus went with it, it goes to the title.
  useEffect(() => {
    if (saved || !confirming) return;
    setConfirming(false);
    if (document.activeElement === null || document.activeElement === document.body) setFocus('title');
  }, [saved, confirming]);
  const status = (key: string) => (Object.hasOwn(data.lessons, key) ? data.lessons[key]!.status : null);
  const going = lessons.filter((l) => status(l.key) === 'in-progress').map((l) => l.title);

  return (
    <aside className="toc" aria-label="Your progress and the parts of this track">
      <div className="card pg">
        {saved ? (
          <>
            <p className="pg-title">
              <b>{finished}</b> of {lessons.length} complete
            </p>
            <span className="segbar" aria-hidden="true">
              {lessons.map((l) => {
                const s = status(l.key);
                return <i key={l.key} className={s === 'finished' ? 'done' : s === 'in-progress' ? 'prog' : undefined} />;
              })}
            </span>
            {going.length > 0 ? <p className="pg-note">{`${going.length} in progress: ${going.join(', ')}`}</p> : null}
            {confirming ? (
              <div ref={confirmRef} className="confirm" role="group" aria-labelledby={question} tabIndex={-1}>
                <p id={question}>Clear all progress on this device?</p>
                <div>
                  <button
                    type="button"
                    className="btn btn--small btn--primary"
                    onClick={() => {
                      setConfirming(false);
                      reset();
                      setMessage('Progress cleared');
                      setFocus('title');
                    }}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="btn btn--small"
                    onClick={() => {
                      setConfirming(false);
                      setFocus('button');
                    }}
                  >
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button
                ref={buttonRef}
                type="button"
                className="link-btn"
                onClick={() => {
                  setMessage('');
                  setConfirming(true);
                  setFocus('confirm');
                }}
              >
                Clear my progress
              </button>
            )}
          </>
        ) : (
          <>
            <p ref={titleRef} className="pg-title" tabIndex={-1}>
              Your progress
            </p>
            <p className="pg-note">Once you start a lesson, your progress is saved in this browser. There is nothing to sign up for.</p>
          </>
        )}
        <p className="sr-only" role="status">
          {message}
        </p>
      </div>
      {children}
    </aside>
  );
}

export default TrackSidebar;
