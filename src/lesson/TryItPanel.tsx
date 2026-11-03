import { useId } from 'react';
import type { TryIt } from '../content/schema';
import './lesson.css';

export interface TryItPanelProps {
  tryIt: TryIt;
  /** The id of the choice being shown, or null before the learner picks one. */
  chosen: string | null;
  /** True once the chosen choice's events have all played. */
  done: boolean;
  onChoose(id: string): void;
}

/**
 * The Try it step. With choices, the learner picks one and watches the scene
 * play it; its explanation arrives once it has played out, in a live region so
 * it is announced. A free-form Try it (a playground) has no choices: the
 * learner works in the scene, and the explanation waits under a disclosure.
 */
export function TryItPanel({ tryIt, chosen, done, onChoose }: TryItPanelProps) {
  const promptId = useId();

  if (tryIt.mode === 'free') {
    return (
      <div className="tryit">
        <h2 className="lesson-panel__title">Try it</h2>
        <p className="tryit__prompt">{tryIt.prompt}</p>
        <details className="tryit__notice">
          <summary>What to notice</summary>
          <p>{tryIt.explanation}</p>
        </details>
      </div>
    );
  }

  const picked = tryIt.choices.find((choice) => choice.id === chosen);
  return (
    <div className="tryit">
      <h2 className="lesson-panel__title">Try it</h2>
      <p className="tryit__prompt" id={promptId}>
        {tryIt.prompt}
      </p>
      <div className="tryit__choices" role="group" aria-labelledby={promptId}>
        {tryIt.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className="tryit__choice"
            aria-pressed={choice.id === chosen}
            onClick={() => onChoose(choice.id)}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <div className="tryit__outcome" aria-live="polite">
        {done && picked !== undefined ? <p>{picked.explanation}</p> : null}
      </div>
    </div>
  );
}

export default TryItPanel;
