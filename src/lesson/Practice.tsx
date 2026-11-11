import { useId } from 'react';
import type { Question } from '../content/schema';
import { Marks, type Numbers } from './Marks';
import { Rich } from './Rich';

const LETTERS = 'ABCDEFGH';
const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/** 'Three questions': Practice's title, in words as the mockups write it. */
export function questionsTitle(count: number): string {
  const word = NUMBER_WORDS[count] ?? String(count);
  return `${word} ${count === 1 ? 'question' : 'questions'}`;
}

/** The words a feedback line may open with, which are shown in bold. */
const LEADS = ['Right.', 'That’s it.', 'Yes.', 'Not quite.'];
const NOT_QUITE = 'Not quite.';

/**
 * The feedback's opening word and the rest. A wrong pick always opens with
 * "Not quite.", so the mark never rests on colour alone, even if the author's
 * feedback does not start with it.
 */
function splitFeedback(feedback: string, right: boolean): { lead: string | null; rest: string } {
  const lead = LEADS.find((l) => feedback.startsWith(l));
  if (lead !== undefined) return { lead, rest: feedback.slice(lead.length).trimStart() };
  return { lead: right ? null : NOT_QUITE, rest: feedback };
}

/** Question id to the index of the option picked. */
export type Picks = Readonly<Record<string, number>>;

export interface PracticeProps {
  questions: Question[];
  picked: Picks;
  onPick(questionId: string, option: number): void;
  /** The unit's source numbers (`numberedSources`), for the marks after a feedback. */
  numbers: Numbers;
}

/**
 * Practice's questions. Picking an option shows its feedback at once and marks
 * it right or "Not quite"; another pick replaces it. The console holds the picks
 * in memory, so they are still there after a visit elsewhere in the lesson, and
 * gone on reload: nothing is scored, counted, stored or sent anywhere.
 */
export function Practice({ questions, picked, onPick, numbers }: PracticeProps) {
  const id = useId();

  return (
    <ol className="practice">
      {questions.map((question, qi) => {
        const choice = Object.hasOwn(picked, question.id) ? picked[question.id] : undefined;
        const chosen = choice === undefined ? undefined : question.options[choice];
        const right = choice === question.answer;
        const feedback = chosen === undefined ? null : splitFeedback(chosen.feedback, right);
        const promptId = `${id}-${qi}`;
        return (
          <li key={question.id} className="practice__question">
            <p className="practice__prompt" id={promptId}>
              <span className="practice__number" aria-hidden="true">
                {qi + 1}
              </span>
              <span>
                <Rich text={question.prompt} />
              </span>
            </p>
            <div className="practice__options" role="group" aria-labelledby={promptId}>
              {question.options.map((option, oi) => (
                <button
                  key={oi}
                  type="button"
                  className="practice__option"
                  aria-pressed={choice === oi}
                  data-result={choice === oi ? (right ? 'right' : 'wrong') : undefined}
                  onClick={() => onPick(question.id, oi)}
                >
                  <span className="practice__letter">{LETTERS[oi]}</span>
                  <span>
                    <Rich text={option.text} />
                  </span>
                </button>
              ))}
            </div>
            {/* The words are always in the page, so the feedback added to them is announced. The marks stay outside the live region. */}
            <p className="practice__feedback" data-result={feedback === null ? undefined : right ? 'right' : 'wrong'}>
              <span className="practice__say" aria-live="polite">
                {feedback === null ? null : (
                  <>
                    {feedback.lead === null ? null : <b>{feedback.lead}</b>}
                    {feedback.lead === null ? '' : ' '}
                    <Rich text={feedback.rest} />
                  </>
                )}
              </span>
              {chosen === undefined ? null : <Marks cite={chosen.cite} numbers={numbers} />}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default Practice;
