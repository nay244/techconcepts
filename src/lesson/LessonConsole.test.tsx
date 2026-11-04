// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { buildEntries, neighbors, type AvailableSummary } from '../content/registry';
import type { Lesson, LessonInput, Track } from '../content/schema';
import { fixtureLesson, fixturePlaygroundLesson } from '../content/test-fixtures';
import { EVENT_DURATION_MS } from '../engine/playback';
import { PROGRESS_KEY } from '../progress/store';
import LessonConsole from './LessonConsole';

const L: Lesson = validateLesson(fixtureLesson()).lesson;
const P: Lesson = validateLesson(fixturePlaygroundLesson()).lesson;

const track: Track = {
  id: 'demo',
  title: 'Demo track',
  description: 'A track used only by tests.',
  level: 'beginner',
  parts: [
    {
      id: 'first',
      title: 'First part',
      lessons: [
        { slug: 'fixture-lesson', title: 'Fixture lesson' },
        { slug: 'fixture-playground', title: 'Fixture playground' },
      ],
    },
    { id: 'second', title: 'Second part', lessons: [{ slug: 'later', title: 'A later lesson' }] },
  ],
};

/** The fixture with its own changes, validated like a real lesson. */
function variant(change: (input: LessonInput) => void): Lesson {
  const input = fixtureLesson();
  change(input);
  return validateLesson(input).lesson;
}

function renderConsole(lesson: Lesson = L) {
  const entries = buildEntries(track, { 'fixture-lesson': L, 'fixture-playground': P, [lesson.slug]: lesson });
  const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === lesson.slug)!;
  const { prev, next, nextPlanned } = neighbors(entries, lesson.slug);
  return render(
    <LessonConsole
      trackId="demo"
      trackTitle="Demo track"
      lesson={lesson}
      entry={entry}
      total={entries.length}
      prev={prev}
      next={next}
      nextPlanned={nextPlanned}
      entries={entries}
    />,
  );
}

const KEY = 'demo/fixture-lesson';

function saveRecord(record: { status: 'in-progress' | 'finished'; furthestPosition: number }, key = KEY): void {
  const data = { version: 1, lessons: { [key]: { ...record, lastOpened: '2026-11-01T09:00:00.000Z' } }, lastLesson: key };
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function stored(): { lessons: Record<string, { status: string; furthestPosition: number }>; lastLesson: string | null } {
  return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null');
}

/** Lets the playback timer run for `ms`. */
async function wait(ms: number): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

const outline = () => screen.getAllByRole('navigation', { name: 'Lesson outline' })[0]!;
const playButton = () => screen.getByRole('button', { name: /^(Play|Pause) \(Space\)$/ });
const inspector = () => screen.queryByRole('region', { name: 'Packet inspector' });

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  vi.useFakeTimers();
  // Testing Library drains pending timers after each user-event call only when it sees Jest's fake
  // timers; with Vitest's it would wait forever. This tells it how to advance Vitest's clock.
  vi.stubGlobal('jest', { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) });
  user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.history.replaceState({}, '', '/');
});

// ------------------------------------------------------------ the brief's cases

test('renders the Overview first', () => {
  renderConsole();
  expect(screen.getByRole('heading', { level: 2, name: 'Neighbor table' })).toBeInTheDocument();
  expect(screen.queryByText(/^STEP \d OF 4$/)).not.toBeInTheDocument();
  expect(within(outline()).getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'step');
});

test('Space on the page starts playback', async () => {
  renderConsole();
  expect(document.activeElement).toBe(document.body);
  await user.keyboard(' ');
  expect(playButton()).toHaveAccessibleName('Pause (Space)');
});

test('Space while the focus is in the Check yourself radio group does not move or play the lesson', async () => {
  renderConsole();
  await user.click(within(outline()).getByRole('button', { name: 'Check yourself' }));
  screen.getAllByRole('radio')[0]!.focus();
  await user.keyboard(' ');
  // Without the guard, Space at Check yourself (which has nothing to play) would carry on to the Recap.
  expect(screen.getByRole('heading', { name: 'Check yourself' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Recap' })).not.toBeInTheDocument();
  expect(playButton()).toHaveAccessibleName('Play (Space)');
});

test('ArrowRight moves to step 1', async () => {
  renderConsole();
  await user.keyboard('{ArrowRight}');
  expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
});

test('opening Details, then pressing Escape, closes the inspector', async () => {
  renderConsole();
  await user.keyboard('{ArrowRight}');
  await wait(EVENT_DURATION_MS.message);
  await user.click(screen.getByRole('button', { name: 'Details' }));
  expect(inspector()).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Hello frame' })).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(inspector()).not.toBeInTheDocument();
});

test('?step=3 opens step 3 after mount', () => {
  window.history.replaceState({}, '', '?step=3');
  renderConsole();
  expect(screen.getByText('STEP 3 OF 4')).toBeInTheDocument();
});

test('jumping to the Recap saves the lesson as finished', async () => {
  renderConsole();
  await user.click(within(outline()).getByRole('button', { name: 'Recap' }));
  expect(stored().lessons[KEY]).toMatchObject({ status: 'finished', furthestPosition: 7 });
});

test('a saved in-progress lesson offers "Resume at step 2 of 4" on the Overview', async () => {
  saveRecord({ status: 'in-progress', furthestPosition: 2 });
  renderConsole();
  await user.click(screen.getByRole('button', { name: 'Resume at step 2 of 4' }));
  expect(screen.getByText('STEP 2 OF 4')).toBeInTheDocument();
});

// ------------------------------------------------------------ progress

describe('progress', () => {
  test('opening the lesson records it as the last lesson, without starting it', () => {
    renderConsole();
    expect(stored().lastLesson).toBe(KEY);
    expect(stored().lessons[KEY]).toBeUndefined();
  });

  test('moving past the Overview starts the lesson', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowRight}');
    expect(stored().lessons[KEY]).toMatchObject({ status: 'in-progress', furthestPosition: 2 });
  });

  test('a ?step deep link hides the resume button', () => {
    saveRecord({ status: 'in-progress', furthestPosition: 2 });
    window.history.replaceState({}, '', '?step=0');
    renderConsole();
    expect(screen.getByRole('heading', { level: 2, name: 'Neighbor table' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Resume at/ })).not.toBeInTheDocument();
  });

  test('a finished lesson shows "Finished" on its Overview instead of a resume button', () => {
    saveRecord({ status: 'finished', furthestPosition: 7 });
    renderConsole();
    expect(within(screen.getByRole('region', { name: 'Explanation' })).getByText('Finished')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Resume at/ })).not.toBeInTheDocument();
  });

  test('a lesson with nothing saved offers no resume', () => {
    renderConsole();
    expect(screen.queryByRole('button', { name: /^Resume at/ })).not.toBeInTheDocument();
  });
});

// ------------------------------------------------------------ keyboard

describe('keyboard', () => {
  test('ArrowLeft goes back a step', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowLeft}');
    expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
  });

  test('arrow keys with a modifier are left to the browser', async () => {
    renderConsole();
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}');
    await user.keyboard('{Meta>}{ArrowRight}{/Meta}');
    expect(screen.queryByText('STEP 1 OF 4')).not.toBeInTheDocument();
  });

  test('shortcuts are ignored while a button has focus', async () => {
    renderConsole();
    await user.click(within(outline()).getByRole('button', { name: 'Step 2: Get an answer' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('STEP 2 OF 4')).toBeInTheDocument();
  });

  /** Gives a panel the overflow a browser would measure; jsdom lays nothing out. */
  function overflow(panel: HTMLElement, sizes: { scrollWidth?: number; scrollHeight?: number }): void {
    panel.style.overflowX = 'auto';
    panel.style.overflowY = 'auto';
    const all = { clientWidth: 300, scrollWidth: 300, clientHeight: 200, scrollHeight: 200, ...sizes };
    for (const [name, value] of Object.entries(all)) Object.defineProperty(panel, name, { configurable: true, value });
  }

  test('Space in an explanation that scrolls is left to it; the arrows still move', async () => {
    renderConsole();
    const explanation = screen.getByRole('region', { name: 'Explanation' });
    overflow(explanation, { scrollHeight: 900 });
    explanation.focus();
    await user.keyboard(' ');
    expect(playButton()).toHaveAccessibleName('Play (Space)');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
  });

  test('the arrows in an event log that scrolls sideways are left to it; Space still plays', async () => {
    renderConsole();
    const log = screen.getByRole('region', { name: 'Event log' });
    overflow(log, { scrollWidth: 1024 });
    log.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.queryByText('STEP 1 OF 4')).not.toBeInTheDocument();
    await user.keyboard(' ');
    expect(playButton()).toHaveAccessibleName('Pause (Space)');
  });

  test('a focused panel with nothing to scroll leaves the keys to the lesson', async () => {
    renderConsole();
    const explanation = screen.getByRole('region', { name: 'Explanation' });
    overflow(explanation, {});
    explanation.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
  });
});

// ------------------------------------------------------------ top bar

describe('top bar', () => {
  test('links the wordmark home and shows where the learner is', () => {
    renderConsole();
    const bar = screen.getByRole('banner');
    expect(within(bar).getByRole('link', { name: 'TechConcepts' })).toHaveAttribute('href', '/');
    expect(within(bar).getByRole('link', { name: 'Demo track' })).toHaveAttribute('href', '/demo');
    expect(within(bar).getByRole('heading', { level: 1, name: 'Fixture lesson' })).toBeInTheDocument();
    expect(bar.querySelector('.topbar__crumbs')).toHaveTextContent('Demo track › Fixture lesson');
    expect(within(bar).getByText('Lesson 1 of 3')).toBeInTheDocument();
    expect(within(bar).getByRole('group', { name: 'Color theme' })).toBeInTheDocument();
  });

  test('fills one step segment for each step reached', async () => {
    renderConsole();
    const segments = () => screen.getByRole('img', { name: /^Step progress/ });
    expect(segments()).toHaveAccessibleName('Step progress: 0 of 4');
    expect(segments().querySelectorAll('[data-filled="true"]')).toHaveLength(0);
    expect(segments().children).toHaveLength(4);
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(segments()).toHaveAccessibleName('Step progress: 2 of 4');
    expect(segments().querySelectorAll('[data-filled="true"]')).toHaveLength(2);
    await user.click(within(outline()).getByRole('button', { name: 'Try it' }));
    expect(segments().querySelectorAll('[data-filled="true"]')).toHaveLength(4);
  });

  test('shows the OSI layer, as a range when the lesson spans several', () => {
    const { unmount } = renderConsole();
    expect(screen.getByText('OSI L2')).toBeInTheDocument();
    unmount();
    renderConsole(variant((input) => (input.osiLayers = [4, 3])));
    expect(screen.getByText('OSI L3–L4')).toBeInTheDocument();
  });

  test('shows no OSI chip when the lesson names no layer', () => {
    renderConsole(variant((input) => (input.osiLayers = [])));
    expect(screen.queryByText(/^OSI L/)).not.toBeInTheDocument();
  });
});

// ------------------------------------------------------------ outline

describe('outline', () => {
  test('lists the Overview, each step, Try it, Check yourself and the Recap, and jumps to the one clicked', async () => {
    renderConsole();
    const names = [
      'Overview',
      'Step 1: Say hello',
      'Step 2: Get an answer',
      'Step 3: Use the table',
      'Step 4: When it goes wrong',
      'Try it',
      'Check yourself',
      'Recap',
    ];
    expect(within(outline()).getAllByRole('button')).toEqual(names.map((name) => within(outline()).getByRole('button', { name })));
    await user.click(within(outline()).getByRole('button', { name: 'Step 3: Use the table' }));
    expect(screen.getByText('STEP 3 OF 4')).toBeInTheDocument();
    expect(within(outline()).getByRole('button', { name: 'Step 3: Use the table' })).toHaveAttribute('aria-current', 'step');
    expect(within(outline()).getByRole('button', { name: 'Overview' })).not.toHaveAttribute('aria-current');
  });

  test('lists every lesson in the track by part, with progress said in words', () => {
    saveRecord({ status: 'in-progress', furthestPosition: 1 }, 'demo/fixture-playground');
    renderConsole();
    const list = within(outline()).getByText('All lessons').closest('details')!;
    expect(list).not.toHaveAttribute('open');
    expect(within(list).getByRole('heading', { name: 'First part' })).toBeInTheDocument();
    expect(within(list).getByRole('heading', { name: 'Second part' })).toBeInTheDocument();
    expect(within(list).getByRole('link', { name: /Fixture lesson/ })).toHaveAttribute('aria-current', 'page');
    const playground = within(list).getByRole('link', { name: /Fixture playground/ });
    expect(playground).toHaveAttribute('href', '/demo/fixture-playground');
    expect(playground).toHaveTextContent('In progress');
    const later = within(list).getByText('A later lesson').closest('li')!;
    expect(later).toHaveTextContent('Coming soon');
    expect(within(later).queryByRole('link')).not.toBeInTheDocument();
  });

  test('marks a finished lesson "Finished" in the list', async () => {
    renderConsole();
    await user.click(within(outline()).getByRole('button', { name: 'Recap' }));
    const list = within(outline()).getByText('All lessons').closest('details')!;
    expect(within(list).getByRole('link', { name: /Fixture lesson/ })).toHaveTextContent('Finished');
  });
});

// ------------------------------------------------------------ center and inspector

describe('scene', () => {
  test('offers a view toggle when the scene has more than one view', async () => {
    renderConsole();
    const views = screen.getByRole('group', { name: 'View' });
    expect(within(views).getByRole('button', { name: 'Network' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: /^Network diagram/ })).toBeInTheDocument();
    await user.click(within(views).getByRole('button', { name: 'Sequence' }));
    expect(screen.getByRole('region', { name: 'Sequence diagram' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /^Network diagram/ })).not.toBeInTheDocument();
  });

  test('has no view toggle when the scene has one view', () => {
    renderConsole(variant((input) => input.scene.type === 'flow' && (input.scene.views = ['sequence'])));
    expect(screen.queryByRole('group', { name: 'View' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Sequence diagram' })).toBeInTheDocument();
  });

  test('shows each device table', () => {
    renderConsole();
    expect(screen.getByRole('region', { name: 'Neighbor table · Server' })).toBeInTheDocument();
  });

  test('passes reduced motion on to the network view', async () => {
    const reduce = (matches: boolean) =>
      vi.stubGlobal(
        'matchMedia',
        vi.fn((media: string) => ({ matches, media, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
      );
    const chip = () => screen.getByRole('button', { name: /^Hello, to Server/ });

    reduce(false);
    const { unmount } = renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    expect(chip()).toHaveAttribute('data-animated', 'true');
    unmount();

    reduce(true);
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    expect(chip()).toHaveAttribute('data-animated', 'false');
  });

  test('the explanation of a Try it choice waits until it has played', async () => {
    renderConsole();
    await user.click(within(outline()).getByRole('button', { name: 'Try it' }));
    await user.click(screen.getByRole('button', { name: 'The server' }));
    expect(screen.queryByText('The address matches the server, so the message arrives.')).not.toBeInTheDocument();
    await wait(EVENT_DURATION_MS.message);
    expect(screen.getByText('The address matches the server, so the message arrives.')).toBeInTheDocument();
  });

  test('the Recap links to the next lesson in the track', async () => {
    renderConsole();
    await user.click(within(outline()).getByRole('button', { name: 'Recap' }));
    expect(screen.getByRole('link', { name: 'Next: Fixture playground' })).toHaveAttribute('href', '/demo/fixture-playground');
  });
});

describe('inspector', () => {
  /** Step 4's lost hello carries the same packet as step 1's hello, so rows 1 and 4 have packets and 2 and 3 do not. */
  const twoPackets = () =>
    variant((input) => {
      const lost = input.steps[3]!.events[0]!;
      if (lost.type === 'message') lost.packet = 'p1';
    });

  async function openFirstPacketAtStep4(): Promise<void> {
    await user.click(within(outline()).getByRole('button', { name: 'Step 4: When it goes wrong' }));
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getAllByRole('button', { name: 'Details' })[0]!);
  }

  test('replaces the scene, and moves focus into it', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.queryByRole('img', { name: /^Network diagram/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'View' })).not.toBeInTheDocument();
    expect(inspector()).toContainElement(document.activeElement as HTMLElement);
  });

  test('Close inspector brings the scene back and returns focus to Details', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getByRole('button', { name: 'Details' }));
    await user.click(screen.getByRole('button', { name: /Close inspector/ }));
    expect(inspector()).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: /^Network diagram/ })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Details' }));
  });

  test('Escape closes it even while one of its buttons has focus', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getByRole('button', { name: 'Details' }));
    screen.getByRole('button', { name: /Close inspector/ }).focus();
    await user.keyboard('{Escape}');
    expect(inspector()).not.toBeInTheDocument();
  });

  test('opens from the chip in the network view', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getByRole('button', { name: /^Hello, to Server/ }));
    expect(within(inspector()!).getByText('0.000s · 192.168.1.10 → 192.168.1.20 · Demo · 34 B')).toBeInTheDocument();
  });

  test('previous and next move between log rows that have packets', async () => {
    renderConsole(twoPackets());
    await openFirstPacketAtStep4();
    const panel = () => inspector()!;
    expect(within(panel()).getByText(/^0\.000s/)).toBeInTheDocument();
    expect(within(panel()).queryByRole('button', { name: 'Previous packet' })).not.toBeInTheDocument();

    await user.click(within(panel()).getByRole('button', { name: 'Next packet' }));
    expect(within(panel()).getByText(/^5\.000s/)).toBeInTheDocument();
    expect(within(panel()).queryByRole('button', { name: 'Next packet' })).not.toBeInTheDocument();
    // The button that was pressed is gone, so focus lands on the other one, not on the page.
    expect(document.activeElement).toBe(within(panel()).getByRole('button', { name: 'Previous packet' }));

    await user.click(within(panel()).getByRole('button', { name: 'Previous packet' }));
    expect(within(panel()).getByText(/^0\.000s/)).toBeInTheDocument();
  });

  test('moving to another step closes it', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getByRole('button', { name: 'Details' }));
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    expect(inspector()).not.toBeInTheDocument();
    expect(screen.getByText('STEP 2 OF 4')).toBeInTheDocument();
  });

  test('a step change made from inside it puts focus back on Details, not on the page', async () => {
    renderConsole();
    await user.keyboard('{ArrowRight}');
    await wait(EVENT_DURATION_MS.message);
    await user.click(screen.getByRole('button', { name: 'Details' }));
    expect(inspector()).toContainElement(document.activeElement as HTMLElement);
    // Focus is on the inspector's section, which is not a button, so the arrow is the lesson's.
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('STEP 2 OF 4')).toBeInTheDocument();
    expect(inspector()).not.toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getAllByRole('button', { name: 'Details' })[0]);
  });

  test('opening it pauses playback', async () => {
    renderConsole(twoPackets());
    await user.click(within(outline()).getByRole('button', { name: 'Step 4: When it goes wrong' }));
    await user.click(screen.getAllByRole('button', { name: 'Details' })[0]!);
    expect(playButton()).toHaveAccessibleName('Play (Space)');
  });
});

// ------------------------------------------------------------ playground

describe('playground lessons', () => {
  const slider = () => screen.getByRole('slider', { name: 'Prefix length' });

  test('show the subnet canvas and the current values, with step buttons but nothing to play', () => {
    renderConsole(P);
    expect(screen.getByRole('region', { name: 'Subnet playground' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Current values' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous step' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next step' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^(Play|Pause) \(Space\)$/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Replay step' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Speed' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Event log' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'View' })).not.toBeInTheDocument();
  });

  test('follow each step preset, locked until Try it', async () => {
    renderConsole(P);
    expect(slider()).toHaveValue('24');
    expect(slider()).toBeDisabled();
    await user.click(within(outline()).getByRole('button', { name: 'Step 2: Where it splits' }));
    expect(slider()).toHaveValue('26');
    expect(slider()).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Compare with' })).toBeDisabled();
  });

  test('Try it starts from the last step preset, unlocked, and its edits are dropped on leaving', async () => {
    renderConsole(P);
    await user.click(within(outline()).getByRole('button', { name: 'Try it' }));
    expect(slider()).toHaveValue('16');
    expect(slider()).toBeEnabled();
    expect(screen.getByRole('textbox', { name: 'IP address' })).toBeEnabled();
    expect(screen.getByRole('textbox', { name: 'Compare with' })).toBeEnabled();

    fireEvent.change(slider(), { target: { value: '28' } });
    expect(slider()).toHaveValue('28');

    // Check yourself shares the last step's preset, but shows it, not the learner's edit.
    await user.click(within(outline()).getByRole('button', { name: 'Check yourself' }));
    expect(slider()).toHaveValue('16');
    expect(slider()).toBeDisabled();

    await user.click(within(outline()).getByRole('button', { name: 'Try it' }));
    expect(slider()).toHaveValue('16');
  });

  // jsdom does not move a range input on arrow keys, so this checks the console leaves the key alone.
  test('arrow keys on the slider are left to it: the step stays and the key is not cancelled', async () => {
    renderConsole(P);
    await user.click(within(outline()).getByRole('button', { name: 'Try it' }));
    slider().focus();
    expect(fireEvent.keyDown(slider(), { key: 'ArrowRight' })).toBe(true);
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('heading', { name: 'Try it' })).toBeInTheDocument();
    expect(slider()).toHaveValue('16');
  });

  test('Previous step and Next step move between positions', async () => {
    renderConsole(P);
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    expect(slider()).toHaveValue('26');
    await user.click(screen.getByRole('button', { name: 'Previous step' }));
    expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
  });

  test('Space does nothing, and is left to the page; the arrows still move between positions', async () => {
    renderConsole(P);
    expect(fireEvent.keyDown(document.body, { key: ' ' })).toBe(true);
    expect(screen.queryByText(/^STEP \d OF 4$/)).not.toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('STEP 1 OF 4')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.queryByText(/^STEP \d OF 4$/)).not.toBeInTheDocument();
  });

  test('read in the order a phone shows them: canvas, explanation, then the readout and its step buttons', () => {
    const { container } = renderConsole(P);
    const main = container.querySelector('main')!;
    const order = [
      screen.getByRole('region', { name: 'Subnet playground' }),
      screen.getByRole('region', { name: 'Explanation' }),
      screen.getByRole('region', { name: 'Current values' }),
    ];
    for (const panel of order) expect(main).toContainElement(panel);
    expect(order[0]!.compareDocumentPosition(order[1]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(order[1]!.compareDocumentPosition(order[2]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('the comparison is with the controls in the canvas, and its result stays one live region from step to step', async () => {
    renderConsole(P);
    const canvas = screen.getByRole('region', { name: 'Subnet playground' });
    const readout = screen.getByRole('region', { name: 'Current values' });
    expect(within(canvas).getByRole('textbox', { name: 'Compare with' })).toBeInTheDocument();
    expect(within(canvas).getByRole('status')).toBeInTheDocument();
    expect(within(readout).queryByRole('textbox', { name: 'Compare with' })).not.toBeInTheDocument();

    const status = screen.getByRole('status');
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByRole('status')).toBe(status);
  });

  test('the explanation stays the same element from step to step', async () => {
    renderConsole(P);
    const explanation = screen.getByRole('region', { name: 'Explanation' });
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    await user.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByRole('region', { name: 'Explanation' })).toBe(explanation);
  });
});

// ------------------------------------------------------------ live region

describe('live region at the non-step positions', () => {
  /** The polite region that announces the position. */
  const live = () => document.querySelector<HTMLElement>('.explain__live')!;

  async function fromLastStep(presses: number): Promise<void> {
    window.history.replaceState({}, '', '?step=4');
    renderConsole();
    await user.keyboard('{ArrowRight}'.repeat(presses));
  }

  test('Try it is announced with its prompt', async () => {
    await fromLastStep(1);
    expect(live()).toHaveTextContent('Try it. Which address should the laptop send to?');
  });

  test('Check yourself is announced', async () => {
    await fromLastStep(2);
    expect(live()).toHaveTextContent('Check yourself');
  });

  test('the Recap is announced', async () => {
    await fromLastStep(3);
    expect(live()).toHaveTextContent('Recap');
  });

  test('the cue is visually hidden and the panel is not repeated inside the region', async () => {
    await fromLastStep(1);
    const cue = within(live()).getByText(/^Try it\./);
    expect(cue).toHaveClass('sr-only');
    expect(within(live()).queryByRole('radio')).not.toBeInTheDocument();
  });
});
