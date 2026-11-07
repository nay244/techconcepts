// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Question } from '../content/schema';
import { liftedFixture } from '../content/test-fixtures';
import { Practice, type Picks } from './Practice';

const questions = liftedFixture().units[0]!.practice;

/** Practice with its picks held the way the console holds them: in memory. */
function Harness({ questions: qs }: { questions: Question[] }) {
  const [picked, setPicked] = useState<Picks>({});
  return <Practice questions={qs} picked={picked} onPick={(id, option) => setPicked((p) => ({ ...p, [id]: option }))} />;
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** The question whose prompt starts with `prompt`, as its list item. */
const question = (prompt: RegExp) => screen.getByText(prompt).closest('li')!;

test('Practice shows the chosen option’s feedback, and nothing is saved', async () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  const { container } = render(<Harness questions={questions} />);
  const q1 = question(/^What does the router store/);
  const options = within(q1).getAllByRole('button');
  expect(options.map((o) => o.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'false']);
  expect(within(q1).queryByText(/Not quite|Right\./)).toBeNull();

  // A wrong pick says "Not quite" in bold, with the option's own feedback, at once.
  await userEvent.click(within(q1).getByRole('button', { name: /Every message it receives/ }));
  expect(options[0]).toHaveAttribute('aria-pressed', 'true');
  expect(options[0]).toHaveAttribute('data-result', 'wrong');
  expect(within(q1).getByText('Not quite.', { selector: 'b' })).toBeInTheDocument();
  expect(within(q1).getByText(/It keeps one row per neighbor, not a copy/)).toBeInTheDocument();

  // Another pick replaces it.
  await userEvent.click(within(q1).getByRole('button', { name: /A row for each neighbor/ }));
  expect(options[0]).toHaveAttribute('aria-pressed', 'false');
  expect(options[1]).toHaveAttribute('aria-pressed', 'true');
  expect(options[1]).toHaveAttribute('data-result', 'right');
  expect(within(q1).getByText('Right.', { selector: 'b' })).toBeInTheDocument();
  expect(within(q1).queryByText(/Not quite/)).toBeNull();

  // The other question is untouched, nothing is counted, and nothing is stored.
  expect(within(question(/^Why keep a table/)).queryByText(/Right\.|Not quite/)).toBeNull();
  expect(container).not.toHaveTextContent(/\d+ (of|\/) \d+|score/i);
  expect(setItem).not.toHaveBeenCalled();
  expect(window.localStorage).toHaveLength(0);
});

test('a wrong pick always reads Not quite, even when its feedback does not start with it', async () => {
  const custom: Question[] = [
    {
      id: 'q',
      prompt: 'Which one is the router?',
      options: [
        { text: 'The phone', feedback: 'The phone only uses addresses.', cite: [] },
        { text: 'The box by the door', feedback: 'That’s it. It hands out the addresses.', cite: [] },
      ],
      answer: 1,
    },
  ];
  render(<Harness questions={custom} />);
  await userEvent.click(screen.getByRole('button', { name: /The phone/ }));
  expect(screen.getByText('Not quite.', { selector: 'b' })).toBeInTheDocument();
  expect(screen.getByText(/The phone only uses addresses\./)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /The box by the door/ }));
  expect(screen.getByText('That’s it.', { selector: 'b' })).toBeInTheDocument();
});
