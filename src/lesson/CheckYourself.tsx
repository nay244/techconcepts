import { useId, useState } from 'react';
import type { Question } from '../content/schema';
import './lesson.css';

/**
 * The Check yourself questions. Choosing an option shows at once whether it was
 * right and why, and the choice can be changed. Answers live in this component's
 * state only: nothing is stored, counted or sent anywhere (spec §10.5).
 */
export function CheckYourself({ questions }: { questions: Question[] }) {
  const group = useId();
  /** Question id to the index of the option chosen. */
  const [answers, setAnswers] = useState<Record<string, number>>({});

  return (
    <div className="check">
      <h2 className="lesson-panel__title">Check yourself</h2>
      {questions.map((question) => {
        const picked = answers[question.id];
        return (
          <fieldset key={question.id} className="check__question" role="radiogroup">
            <legend>{question.prompt}</legend>
            {question.options.map((option, i) => (
              <label key={i} className="check__option">
                <input
                  type="radio"
                  name={`${group}-${question.id}`}
                  checked={picked === i}
                  onChange={() => setAnswers((current) => ({ ...current, [question.id]: i }))}
                />
                <span>{option}</span>
              </label>
            ))}
            {/* Always in the page, so a result added to it is announced. */}
            <div className="check__feedback" aria-live="polite">
              {picked === undefined ? null : (
                <p>
                  <strong>{picked === question.answer ? 'Correct.' : 'Not quite.'}</strong> {question.explanation}
                </p>
              )}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export default CheckYourself;
