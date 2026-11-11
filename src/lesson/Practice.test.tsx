// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { Question } from '../content/schema';
import { liftedFixture } from '../content/test-fixtures';
import { getLesson } from '../content/registry';
import { Practice, type Picks } from './Practice';
import { numberedSources } from './sourceNumbers';

const questions = liftedFixture().units[0]!.practice;

/** Practice with its picks held the way the console holds them: in memory. */
function Harness({ questions: qs, numbers = new Map() }: { questions: Question[]; numbers?: ReadonlyMap<string, number> }) {
  const [picked, setPicked] = useState<Picks>({});
  return <Practice questions={qs} picked={picked} onPick={(id, option) => setPicked((p) => ({ ...p, [id]: option }))} numbers={numbers} />;
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

// ---------------------------------------------------------------- source numbers in the feedback (D1 §6, checks 7 to 9)

const OSI = getLesson('osi-model')!.units[0]!;
const DHCP_UNIT = getLesson('dhcp')!.units[0]!;

/** OSI Model's marks by question and option (D1 §6): the numbers, in order. */
const OSI_MARKS: string[][][] = [
  [['1', '3', '4'], ['1'], ['1']],
  [['1', '3'], ['1'], ['1', '3']],
  [['1'], ['1'], ['1'], ['1']],
];

test('every OSI Model option shows the source numbers D1 lists, after its feedback, as links to the cited places', async () => {
  render(<Harness questions={OSI.practice} numbers={numberedSources(OSI).numberOf} />);
  const items = screen.getAllByRole('listitem').filter((li) => li.classList.contains('practice__question'));
  expect(items).toHaveLength(OSI_MARKS.length);
  for (const [qi, perOption] of OSI_MARKS.entries()) {
    for (const [oi, expected] of perOption.entries()) {
      await userEvent.click(within(items[qi]!).getAllByRole('button')[oi]!);
      const feedback = items[qi]!.querySelector('.practice__feedback')!;
      const marks = feedback.querySelector('sup.explain__marks');
      const links = [...(marks?.querySelectorAll('a') ?? [])];
      expect(links.map((a) => a.textContent), `question ${qi + 1}, option ${oi + 1}`).toEqual(expected);
      for (const a of links) {
        expect(a).toHaveAttribute('target', '_blank');
        expect(a.getAttribute('href')).toMatch(/^https:/);
        expect(a.getAttribute('aria-label')).toMatch(/^Source \d+: .+ \(opens in a new tab\)$/);
      }
      // The marks come after the words, and outside them.
      if (marks !== null) expect(feedback.lastElementChild).toBe(marks);
    }
  }
});

test('OSI Model question 1, option A: mark 1 opens X.200 at page 19, mark 3 names two places, mark 4 opens RFC 1122', async () => {
  render(<Harness questions={OSI.practice} numbers={numberedSources(OSI).numberOf} />);
  const q1 = screen.getAllByRole('listitem').find((li) => li.classList.contains('practice__question'))!;
  await userEvent.click(within(q1).getAllByRole('button')[0]!);
  const [one, three, four] = [...q1.querySelectorAll('.practice__feedback a')];
  expect(one!.getAttribute('href')).toMatch(/#page=19$/);
  expect(one!.getAttribute('aria-label')).toBe('Source 1: ITU-T X.200, 5.6.1.3 (opens in a new tab)');
  expect(three!.getAttribute('href')).toMatch(/#page=20$/);
  expect(three!.getAttribute('title')).toContain(';');
  expect(four!.getAttribute('href')).toMatch(/#page-17$/);
});

test('DHCP’s Practice shows no link in any feedback', async () => {
  render(<Harness questions={DHCP_UNIT.practice} numbers={numberedSources(DHCP_UNIT).numberOf} />);
  for (const [qi, question] of DHCP_UNIT.practice.entries()) {
    const item = screen.getAllByRole('listitem').filter((li) => li.classList.contains('practice__question'))[qi]!;
    for (const oi of question.options.keys()) {
      await userEvent.click(within(item).getAllByRole('button')[oi]!);
      expect(item.querySelectorAll('.practice__feedback a')).toHaveLength(0);
    }
  }
});

test('the live region is the words alone; the feedback has none, holds no link inside the words, and is empty before a pick', async () => {
  render(<Harness questions={OSI.practice} numbers={numberedSources(OSI).numberOf} />);
  const q1 = screen.getAllByRole('listitem').find((li) => li.classList.contains('practice__question'))!;
  const feedback = q1.querySelector('.practice__feedback')!;
  const say = feedback.querySelector('.practice__say')!;
  expect(say).toHaveAttribute('aria-live', 'polite');
  expect(feedback).not.toHaveAttribute('aria-live');
  expect(say).toBeEmptyDOMElement();
  expect(feedback.querySelector('a')).toBeNull();
  await userEvent.click(within(q1).getAllByRole('button')[0]!);
  expect(say.textContent).not.toBe('');
  expect(say.querySelector('a')).toBeNull();
});
