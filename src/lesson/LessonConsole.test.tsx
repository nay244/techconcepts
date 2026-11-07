// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { buildEntries, neighbors, type AvailableSummary } from '../content/registry';
import type { Lesson, SceneEvent } from '../content/schema';
import { liftedFixture, makeLesson, makeUnit, makeUnitWithTwoTableChanges } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import { HOLD_MS } from '../engine/playback';
import { THEME_KEY } from '../lib/theme';
import { PROGRESS_KEY } from '../progress/store';
import { seedProgress, type SeedLesson } from '../test/progress';
import LessonConsole from './LessonConsole';

// Every figure's driver gives every event the same second, so these tests time the console, not a figure. (A test
// may give table changes no time, as the real drivers do.)
const still = vi.hoisted(() => ({
  create: () => ({ show() {}, play: async () => {}, destroy() {} }),
  duration: vi.fn((_event: SceneEvent): number => 1000),
}));
vi.mock('../scenes/drivers', () => ({ DRIVERS: { dhcp: still, subnet: still, firewall: still, 'net-map': still } }));

/**
 * The fixture unit, filed as DHCP (lesson 10) and Firewalls (lesson 17) in the
 * networking track. Positions: 0 Overview, 1–5 the steps (Neighbor Hello,
 * Neighbor Reply, Table Lookup, Lost Message, Retransmission), 6 Learn, 7 Practice.
 */
const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const FIREWALLS: Lesson = liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls' }));
/** Lesson 1, of three units: Alpha 0–7, Beta 8–15, Gamma 16–23 (each Overview, 5 steps, Learn, Practice). */
const THREE: Lesson = liftedFixture(
  makeLesson({
    slug: 'how-the-internet-works',
    title: 'How the Internet Works',
    units: [
      makeUnit('alpha', { name: 'Alpha', group: 'core' }),
      makeUnit('beta', { name: 'Beta', group: 'app' }),
      makeUnit('gamma', { name: 'Gamma', group: 'security' }),
    ],
  }),
);
/** DHCP with two table changes in a row in Neighbor Reply and in Table Lookup (`makeUnitWithTwoTableChanges`). */
const TWO_TABLE_CHANGES: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP', units: [makeUnitWithTwoTableChanges()] }));
const entries = buildEntries(networkingTrack, { dhcp: DHCP, firewalls: FIREWALLS, 'how-the-internet-works': THREE });
const KEY = 'networking/dhcp';
/** Every event's wait in these tests: the stand-in drivers' duration. */
const EVENT_MS = 1000;

function consoleFor(lesson: Lesson = DHCP, figureData?: unknown) {
  const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === lesson.slug)!;
  return (
    <LessonConsole
      trackId="networking"
      trackTitle="Networking Concepts"
      lesson={lesson}
      entry={entry}
      total={entries.length}
      next={neighbors(entries, lesson.slug).next}
      entries={entries}
      figureData={figureData}
    />
  );
}

const renderConsole = (lesson: Lesson = DHCP) => render(consoleFor(lesson));

function stored(): { lessons: Record<string, { status: string; furthestPosition: number }>; lastLesson: string | null } {
  return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? 'null');
}

/** DHCP's saved progress, opened last. */
const save = (record: SeedLesson) => seedProgress({ [KEY]: record }, KEY);

/**
 * Lets the playback timers run for `ms`. Each wait is its own act(): React
 * schedules the next timer only once the render a timer caused has committed.
 */
async function wait(ms: number): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

const topBar = () => screen.getByRole('banner');
const explanation = () => screen.getByRole('region', { name: 'Explanation' });
const heading = () => within(explanation()).getByRole('heading', { level: 2 });
const playButton = () => screen.getByRole('button', { name: /^(Play|Pause|Replay|Watch again)$/ });
/** The log's rows, without its header row. A lone "nothing yet" row counts as none. */
function logRows(): HTMLElement[] {
  const table = within(screen.getByRole('region', { name: 'Event log' })).getByRole('table');
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .filter((row) => row.querySelector('[data-idle]') === null);
}

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  still.duration.mockReset().mockReturnValue(EVENT_MS);
  vi.useFakeTimers();
  // Testing Library drains pending timers after each user-event call only when it sees Jest's fake
  // timers; with Vitest's it would wait forever. This tells it how to advance Vitest's clock.
  vi.stubGlobal('jest', { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) });
  user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  window.localStorage.clear();
  window.history.replaceState({}, '', '/networking/dhcp');
  document.documentElement.dataset.theme = 'dark';
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  window.history.replaceState({}, '', '/');
});

test('renders the Overview first, then follows ?step= after mount', async () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=3');
  const errors = vi.spyOn(console, 'error');

  // The server's render, which a ?step= link cannot change: the Overview.
  const container = document.createElement('div');
  container.innerHTML = renderToString(consoleFor());
  document.body.append(container);
  expect(within(container).getByRole('heading', { level: 2, name: 'Neighbor table' })).toBeInTheDocument();
  expect(within(container).queryByRole('heading', { name: 'Table Lookup' })).toBeNull();

  // Hydrated, it matches that render, then moves to step 3.
  let root!: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, consoleFor());
  });
  expect(within(container).getByRole('heading', { level: 2, name: 'Table Lookup' })).toBeInTheDocument();
  expect(errors).not.toHaveBeenCalled();

  act(() => root.unmount());
  container.remove();
});

test('the top bar says Step 2 of 5, never the step title', async () => {
  renderConsole();
  expect(within(topBar()).getByText('Overview')).toBeInTheDocument();
  await user.keyboard('{ArrowRight}{ArrowRight}');
  expect(heading()).toHaveTextContent('Neighbor Reply');
  expect(within(topBar()).getByText('Step 2 of 5')).toBeInTheDocument();
  expect(within(topBar()).queryByText(/Neighbor Reply/)).toBeNull();
  // Breadcrumb, lesson number and the unit's OSI layer.
  expect(within(topBar()).getByRole('heading', { level: 1, name: 'DHCP' })).toBeInTheDocument();
  expect(within(topBar()).getByRole('link', { name: 'Networking Concepts' })).toHaveAttribute('href', '/networking');
  expect(within(topBar()).getByText('Lesson 10 of 20')).toBeInTheDocument();
  expect(within(topBar()).getByText('OSI layer 2, Data link')).toBeInTheDocument();
});

test('a lesson of many units gives its OSI layer by number only, so its long title fits the bar', () => {
  renderConsole(THREE);
  expect(within(topBar()).getByText('OSI layer 2')).toBeInTheDocument();
  expect(within(topBar()).queryByText(/Data link/)).toBeNull();
});

test('the empty log says the unit’s words at the Overview, and a quiet step says its own', async () => {
  const idle = () => within(screen.getByRole('region', { name: 'Event log' })).getByRole('cell').textContent;
  const unit = makeUnit();
  const withIdle = (log: Partial<typeof unit.scene.log>, firstIdle: string | undefined) =>
    liftedFixture(
      makeLesson({
        slug: 'dhcp',
        title: 'DHCP',
        units: [
          {
            ...unit,
            scene: { ...unit.scene, log: { ...unit.scene.log, ...log } },
            steps: [{ ...unit.steps[0]!, idle: firstIdle }, ...unit.steps.slice(1)],
          },
        ],
      }),
    );

  // Lesson 1's way: only the quiet first step has words, so the Overview keeps the console's own.
  const quiet = render(consoleFor(withIdle({}, 'Nothing on the network yet.')));
  expect(idle()).toBe('Nothing has happened yet. Press Play to start.');
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  expect(idle()).toBe('Nothing on the network yet.');
  quiet.unmount();

  // Subnetting's and Firewalls' way: the log has words of its own, from the Overview on.
  render(consoleFor(withIdle({ idle: 'Nothing has reached the firewall yet.' }, undefined)));
  expect(idle()).toBe('Nothing has reached the firewall yet.');
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  expect(idle()).toBe('Nothing has reached the firewall yet.');
});

test('ArrowRight walks Overview → steps → Learn → Practice and records progress; Practice finishes the lesson', async () => {
  renderConsole();
  expect(heading()).toHaveTextContent('Neighbor table');
  // Opening the lesson records it as the last one, without starting it.
  expect(stored().lastLesson).toBe(KEY);
  expect(stored().lessons[KEY]).toBeUndefined();

  const titles = ['Neighbor Hello', 'Neighbor Reply', 'Table Lookup', 'Lost Message', 'Retransmission'];
  for (const [i, title] of titles.entries()) {
    await user.keyboard('{ArrowRight}');
    expect(heading()).toHaveTextContent(title);
    expect(within(explanation()).getByText(`Watch · Step ${i + 1} of 5`)).toBeInTheDocument();
    expect(stored().lessons[KEY]).toMatchObject({ status: 'in-progress', furthestPosition: i + 1 });
  }

  await user.keyboard('{ArrowRight}');
  expect(heading()).toHaveTextContent('What happened and why');
  expect(within(topBar()).getByText('Learn')).toBeInTheDocument();
  expect(stored().lessons[KEY]).toMatchObject({ status: 'in-progress', furthestPosition: 6 });

  await user.keyboard('{ArrowRight}');
  expect(heading()).toHaveTextContent('Two questions');
  expect(within(topBar()).getByText('Practice')).toBeInTheDocument();
  expect(stored().lessons[KEY]).toMatchObject({ status: 'finished', furthestPosition: 7 });

  // ← goes back, and the lesson stays finished.
  await user.keyboard('{ArrowLeft}');
  expect(heading()).toHaveTextContent('What happened and why');
  expect(stored().lessons[KEY]).toMatchObject({ status: 'finished' });
});

test('Play runs the steps: the log fills step by step and the button says Pause, then Replay', async () => {
  renderConsole();
  expect(playButton()).toHaveAccessibleName('Play');
  expect(logRows()).toHaveLength(0);

  await user.click(playButton());
  expect(playButton()).toHaveAccessibleName('Pause');
  expect(heading()).toHaveTextContent('Neighbor Hello');

  // Step 1 plays m1, then holds before step 2.
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(1);
  await wait(HOLD_MS);
  expect(heading()).toHaveTextContent('Neighbor Reply');
  expect(playButton()).toHaveAccessibleName('Pause');
  // Step 2: m2, then a table change that adds no row, then the hold.
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(2);
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(2);
  await wait(HOLD_MS);
  // Step 3: a table match, then the note n1.
  expect(heading()).toHaveTextContent('Table Lookup');
  await wait(EVENT_MS);
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(3);
  // Step 4: m3, which is lost on the way.
  await wait(HOLD_MS);
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(4);
  // Step 5, the last: m4, and the run ends.
  await wait(HOLD_MS);
  await wait(EVENT_MS);
  expect(heading()).toHaveTextContent('Retransmission');
  expect(logRows()).toHaveLength(5);
  expect(playButton()).toHaveAccessibleName('Replay');
});

test('each event waits as long as the figure’s driver takes to play it', async () => {
  const data = { routes: {} };
  still.duration.mockReturnValue(2500);
  render(consoleFor(DHCP, data));
  await user.click(playButton());
  expect(still.duration).toHaveBeenLastCalledWith(DHCP.units[0]!.steps[0]!.events[0], data);
  await wait(2400);
  expect(logRows()).toHaveLength(0);
  await wait(100);
  expect(logRows()).toHaveLength(1);
});

test('on Learn the button says Watch again', async () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=6');
  renderConsole();
  expect(heading()).toHaveTextContent('What happened and why');
  expect(playButton()).toHaveAccessibleName('Watch again');
  // It runs the unit's steps from the first.
  await user.click(playButton());
  expect(heading()).toHaveTextContent('Neighbor Hello');
  expect(playButton()).toHaveAccessibleName('Pause');
});

test('the speed button cycles and names the next speed', async () => {
  renderConsole();
  const speed = () => screen.getByRole('button', { name: /^Speed / });
  expect(speed()).toHaveTextContent('1×');
  expect(speed()).toHaveAccessibleName('Speed 1×. Click for 1.5×');
  await user.click(speed());
  expect(speed()).toHaveTextContent('1.5×');
  expect(speed()).toHaveAccessibleName('Speed 1.5×. Click for 2×');
  await user.click(speed());
  expect(speed()).toHaveAccessibleName('Speed 2×. Click for 0.5×');
  await user.click(speed());
  expect(speed()).toHaveAccessibleName('Speed 0.5×. Click for 1×');
  await user.click(speed());
  expect(speed()).toHaveAccessibleName('Speed 1×. Click for 1.5×');
});

test('the end row names the next ready lesson, or says the last ready one for now', async () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=7');
  const { unmount } = renderConsole();
  expect(within(explanation()).getByText(/Next ready lesson:/)).toHaveTextContent(
    'That’s the whole lesson. Next ready lesson: Firewalls, lesson 17.',
  );
  expect(within(explanation()).getByRole('link', { name: 'Go to Firewalls' })).toHaveAttribute('href', '/networking/firewalls');
  unmount();

  window.history.replaceState({}, '', '/networking/firewalls?step=7');
  renderConsole(FIREWALLS);
  expect(within(explanation()).getByText(/last ready one/)).toHaveTextContent(
    'That’s the whole lesson, and the last ready one for now. Lessons 18 to 20 are coming soon.',
  );
  expect(within(explanation()).getByRole('link', { name: 'Back to the track' })).toHaveAttribute('href', '/networking');
});

test('a saved lesson offers Resume at its furthest step; a finished one says Finished', async () => {
  save({ status: 'in-progress', furthestPosition: 2 });
  const { unmount } = renderConsole();
  await user.click(screen.getByRole('button', { name: 'Resume at step 2 of 5' }));
  expect(heading()).toHaveTextContent('Neighbor Reply');
  unmount();

  save({ status: 'finished', furthestPosition: 7 });
  renderConsole();
  expect(within(explanation()).getByText('Finished')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /^Resume at/ })).toBeNull();
});

test('a ?step= link hides the resume button', () => {
  save({ status: 'in-progress', furthestPosition: 2 });
  window.history.replaceState({}, '', '/networking/dhcp?step=0');
  renderConsole();
  expect(heading()).toHaveTextContent('Neighbor table');
  expect(screen.queryByRole('button', { name: /^Resume at/ })).toBeNull();
});

test('a polite live region announces the step title and the latest message in plain words', async () => {
  renderConsole();
  const live = document.querySelector('[aria-live="polite"][data-announce]')!;
  expect(live).toHaveTextContent('Overview');
  await user.keyboard('{ArrowRight}');
  expect(live).toHaveTextContent(/^Neighbor Hello\.?$/);
  await wait(EVENT_MS);
  expect(live).toHaveTextContent('Neighbor Hello. The laptop says hello to the router.');
  // Step 2 starts without step 1's message.
  await user.keyboard('{ArrowRight}');
  expect(live).not.toHaveTextContent('The laptop says hello');
});

test("a change only the table shows is announced after the message before it, not instead of it, though it takes no time", async () => {
  // As in every real driver, a table change plays at once: it lands a moment after the message it follows.
  still.duration.mockImplementation((event) => (event.type === 'table' ? 0 : EVENT_MS));
  renderConsole();
  const live = document.querySelector('[aria-live="polite"][data-announce]')!;
  // Neighbor Reply: the router's answer, and then the row it adds, which only the table shows.
  await user.keyboard('{ArrowRight}{ArrowRight}');
  expect(live).toHaveTextContent(/^Neighbor Reply\.?$/);
  await wait(EVENT_MS);
  await wait(0);
  expect(logRows()).toHaveLength(2);
  expect(live).toHaveTextContent(/^Neighbor Reply\. The router answers the laptop\. The router remembers the laptop\.$/);
  // Table Lookup: the table's match, at once, then a note. The note is the latest row, so the match is not repeated.
  await user.keyboard('{ArrowRight}');
  await wait(0);
  expect(live).toHaveTextContent(/^Table Lookup\. The router finds the laptop in its table\.$/);
  await wait(EVENT_MS);
  expect(live).toHaveTextContent(/^Table Lookup\. The router already knows the laptop\.$/);
});

test('two table changes in a row are both announced, in order', async () => {
  still.duration.mockImplementation((event) => (event.type === 'table' ? 0 : EVENT_MS));
  render(consoleFor(TWO_TABLE_CHANGES));
  const live = document.querySelector('[aria-live="polite"][data-announce]')!;
  // Neighbor Reply: the answer, then two changes; Table Lookup: two changes, then a note.
  await user.keyboard('{ArrowRight}{ArrowRight}');
  await wait(EVENT_MS);
  await wait(0);
  await wait(0);
  expect(live).toHaveTextContent(
    /^Neighbor Reply\. The router answers the laptop\. The router remembers the laptop\. The router checks the row it wrote$/,
  );
  await user.keyboard('{ArrowRight}');
  await wait(0);
  await wait(0);
  expect(live).toHaveTextContent(/^Table Lookup\. The router finds the laptop in its table\. The row is still there\.$/);
});

test('a jump announces no table change, as it announces no message: only where it lands', async () => {
  renderConsole();
  const live = document.querySelector('[aria-live="polite"][data-announce]')!;
  const outline = screen.getByRole('navigation', { name: 'This lesson' });
  // Lost Message comes after both of the table's changes (Neighbor Reply's add and Table Lookup's match).
  await user.click(within(outline).getByRole('button', { name: /^Lost Message/ }));
  expect(live).toHaveTextContent(/^Lost Message\.?$/);
  await user.click(within(outline).getByRole('button', { name: /^Neighbor Reply/ }));
  expect(live).toHaveTextContent(/^Neighbor Reply\.?$/);
  await user.click(within(outline).getByRole('button', { name: /^Table Lookup/ }));
  expect(live).toHaveTextContent(/^Table Lookup\.?$/);
  await user.click(within(outline).getByRole('button', { name: /^What happened and why/ }));
  expect(live).toHaveTextContent(/^Learn$/);
});

test('the Light/Dark switch shows the theme in effect and saves a choice', async () => {
  renderConsole();
  const group = within(topBar()).getByRole('group', { name: 'Theme' });
  expect(within(group).getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  expect(within(group).getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'false');
  await user.click(within(group).getByRole('button', { name: 'Light' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
  expect(within(group).getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');
});

test('the track progress counts finished lessons out of 20', () => {
  save({ status: 'finished', furthestPosition: 7 });
  renderConsole();
  expect(within(topBar()).getByText('1 of 20 complete')).toBeInTheDocument();
});

test('the outline moves the lesson, and All 20 lessons opens the track list in a dialog', async () => {
  renderConsole();
  const outline = screen.getByRole('navigation', { name: 'This lesson' });
  await user.click(within(outline).getByRole('button', { name: /^Table Lookup/ }));
  expect(heading()).toHaveTextContent('Table Lookup');
  expect(within(outline).getByRole('button', { name: /^Table Lookup/ })).toHaveAttribute('aria-current', 'step');

  await user.click(within(outline).getByRole('button', { name: 'All 20 lessons' }));
  const dialog = screen.getByRole('dialog', { name: 'All 20 lessons' });
  expect(within(dialog).getByRole('link', { name: /Firewalls/ })).toHaveAttribute('href', '/networking/firewalls');
  expect(within(dialog).getByRole('link', { name: /DHCP/ })).toHaveAttribute('aria-current', 'page');
  expect(within(dialog).getAllByText('Coming soon')).toHaveLength(17);
  await user.click(within(dialog).getByRole('button', { name: 'Close' }));
  expect(dialog).not.toHaveAttribute('open');
});

test('Space plays and pauses, and is left alone on a button', async () => {
  renderConsole();
  await user.keyboard(' ');
  expect(playButton()).toHaveAccessibleName('Pause');
  await user.keyboard(' ');
  expect(playButton()).toHaveAccessibleName('Play');
  expect(heading()).toHaveTextContent('Neighbor Hello');

  screen.getByRole('button', { name: /^Speed / }).focus();
  await user.keyboard('{ArrowRight}');
  expect(heading()).toHaveTextContent('Neighbor Hello');
});

test('after Resume or the end row’s next unit, focus lands on the explanation, not the page', async () => {
  save({ status: 'in-progress', furthestPosition: 2 });
  const { unmount } = renderConsole();
  await user.click(screen.getByRole('button', { name: 'Resume at step 2 of 5' }));
  expect(heading()).toHaveTextContent('Neighbor Reply');
  expect(explanation()).toHaveFocus();
  unmount();

  window.history.replaceState({}, '', '/networking/how-the-internet-works?step=7');
  renderConsole(THREE);
  await user.click(within(explanation()).getByRole('button', { name: 'Go to Beta' }));
  expect(within(explanation()).getByText('Beta · Overview')).toBeInTheDocument();
  expect(explanation()).toHaveFocus();
});

test('Next and Previous keep their focus at either end and do nothing there', async () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=6');
  renderConsole();
  const next = screen.getByRole('button', { name: 'Next step' });
  await user.click(next);
  expect(heading()).toHaveTextContent('Two questions');
  expect(next).toHaveFocus();
  expect(next).toHaveAttribute('aria-disabled', 'true');
  await user.click(next);
  expect(heading()).toHaveTextContent('Two questions');
  expect(next).toHaveFocus();

  // Space and the arrows are the console's, and a focused button keeps them for itself.
  const previous = screen.getByRole('button', { name: 'Previous step' });
  expect(previous).toHaveAttribute('aria-disabled', 'false');
  for (let i = 0; i < 7; i += 1) await user.click(previous);
  expect(heading()).toHaveTextContent('Neighbor table');
  expect(previous).toHaveFocus();
  expect(previous).toHaveAttribute('aria-disabled', 'true');
  await user.click(previous);
  expect(heading()).toHaveTextContent('Neighbor table');
  expect(previous).toHaveFocus();
});

test('the outline ticks only the units the learner has opened on this page', async () => {
  const { unmount } = renderConsole(THREE);
  const outline = screen.getByRole('navigation', { name: '3 protocols' });
  const row = (name: string) => within(outline).getByRole('button', { name: new RegExp(`^${name} `) });

  // Straight from Alpha to Gamma: Alpha is ticked, Beta, passed over, is not.
  await user.click(row('Gamma'));
  expect(row('Gamma')).toHaveAttribute('aria-current', 'true');
  expect(row('Alpha')).toHaveAttribute('data-state', 'seen');
  expect(row('Beta')).not.toHaveAttribute('data-state');
  // Back to Beta: Gamma is ticked now too, and Beta is current.
  await user.click(row('Beta'));
  expect(row('Gamma')).toHaveAttribute('data-state', 'seen');
  expect(row('Alpha')).toHaveAttribute('data-state', 'seen');
  expect(row('Beta')).toHaveAttribute('aria-current', 'true');
  // Nothing of it is saved.
  expect(window.localStorage.getItem(PROGRESS_KEY)).not.toMatch(/seen|gamma/i);
  unmount();

  // A link into Gamma: Alpha was only the server's first render, so it is not ticked.
  window.history.replaceState({}, '', '/networking/how-the-internet-works?step=16');
  renderConsole(THREE);
  expect(within(explanation()).getByText('Gamma · Overview')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Beta / }));
  expect(screen.getByRole('button', { name: /^Gamma / })).toHaveAttribute('data-state', 'seen');
  expect(screen.getByRole('button', { name: /^Alpha / })).not.toHaveAttribute('data-state');
});

test('Practice picks are still there after a visit elsewhere, are gone on reload, and are never saved', async () => {
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  window.history.replaceState({}, '', '/networking/dhcp?step=7');
  const { unmount } = renderConsole();
  const option = () => within(explanation()).getAllByRole('button', { name: /Every message it receives/ })[0]!;
  await user.click(option());
  expect(option()).toHaveAttribute('aria-pressed', 'true');
  expect(within(explanation()).getByText('Not quite.', { selector: 'b' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Previous step' }));
  expect(heading()).toHaveTextContent('What happened and why');
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  expect(heading()).toHaveTextContent('Two questions');
  expect(option()).toHaveAttribute('aria-pressed', 'true');
  expect(within(explanation()).getByText('Not quite.', { selector: 'b' })).toBeInTheDocument();

  // Only progress is ever written, never a pick.
  for (const [key, value] of setItem.mock.calls) {
    expect(key).toBe(PROGRESS_KEY);
    expect(value).not.toMatch(/Every message|picked|answer/);
  }
  unmount();

  renderConsole();
  expect(heading()).toHaveTextContent('Two questions');
  expect(option()).toHaveAttribute('aria-pressed', 'false');
  expect(within(explanation()).queryByText('Not quite.')).toBeNull();
});
