// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { buildEntries, neighbors, type AvailableSummary } from '../content/registry';
import type { Lesson, SceneEvent } from '../content/schema';
import { liftedFixture, makeLesson, makeUnit } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { HOLD_MS } from '../engine/playback';
import LessonConsole from './LessonConsole';

// The lesson's flow (D14, the controls): one step at a time, Play all, Pause, replay and the forward button.
// Every event takes a second; `wait` runs the fake clock.
const still = vi.hoisted(() => ({
  create: () => ({ show() {}, play: async () => {}, destroy() {} }),
  duration: vi.fn((_event: SceneEvent): number => 1000),
}));
vi.mock('../scenes/drivers', () => ({ DRIVERS: { dhcp: still, subnet: still, firewall: still, 'net-map': still } }));

/** Positions: 0 Overview, 1–5 the steps, 6 Learn, 7 Practice. Step 1 m1; 2 m2, t-add; 3 t-match, n1; 4 m3; 5 m4. */
const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const FIREWALLS: Lesson = liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls' }));
/** Three units, filed as lesson 1 of How the Internet Works: Alpha 0–7, Beta 8–15, Gamma 16–23. */
const THREE: Lesson = liftedFixture(
  makeLesson({
    slug: 'what-is-http',
    title: 'HTTP',
    units: [makeUnit('alpha', { name: 'Alpha', group: 'core' }), makeUnit('beta', { name: 'Beta', group: 'app' }), makeUnit('gamma', { name: 'Gamma', group: 'security' })],
  }),
);
const NETWORKING = buildEntries(networkingTrack, { dhcp: DHCP, firewalls: FIREWALLS }, () => 'networking');
const TOUR = buildEntries(internetTrack, { 'what-is-http': THREE }, () => 'how-the-internet-works');
const EVENT_MS = 1000;

const navigate = vi.fn();

function consoleFor(lesson: Lesson, lastOfTrack = false) {
  const track = lesson === THREE ? internetTrack : networkingTrack;
  const entries = lesson === THREE ? TOUR : NETWORKING;
  const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === lesson.slug)!;
  return (
    <LessonConsole
      trackId={track.id}
      trackTitle={track.title}
      lesson={lesson}
      entry={entry}
      total={lastOfTrack ? entry.number : entries.length}
      next={lastOfTrack ? null : neighbors(entries, lesson.slug).next}
      nextFigure={null}
      entries={entries}
      stamp={{ checked: null, sources: 2 }}
      navigate={navigate}
    />
  );
}

/** Lets the clock run in small slices: each wait is its own act(), since React schedules the next timer only once the render a timer caused has committed. */
async function wait(ms: number): Promise<void> {
  for (let left = ms; left > 0; left -= 20) {
    await act(async () => {
      vi.advanceTimersByTime(Math.min(20, left));
    });
  }
  if (ms === 0) await act(async () => {});
}

const explanation = () => screen.getByRole('region', { name: 'Explanation' });
const kicker = () => explanation().querySelector('.explain__kicker') as HTMLElement;
const heading = () => within(explanation()).getByRole('heading', { level: 2 });
const controls = () => document.querySelector('.console__controls') as HTMLElement;
const playButton = () => controls().querySelector('.cbtn--alt') as HTMLButtonElement;
const replayButton = () => screen.getByRole('button', { name: 'Replay step' });
const forwardButton = () => controls().querySelector('.cbtn--go') as HTMLButtonElement;
const backButton = () => screen.getByRole('button', { name: 'Previous step' });
const logRows = () =>
  within(within(screen.getByRole('region', { name: 'Event log' })).getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .filter((row) => row.querySelector('[data-idle]') === null);

/** A key pressed with nothing focused, as a reader's is. */
async function keyOnPage(key: string): Promise<void> {
  (document.activeElement as HTMLElement | null)?.blur();
  await user.keyboard(key);
}

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  still.duration.mockReset().mockReturnValue(EVENT_MS);
  navigate.mockReset();
  vi.useFakeTimers();
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

/** Stubs the reader's reduced-motion setting, which can be turned off again. */
function reduceMotion(initial: boolean) {
  const state = { reduce: initial };
  vi.stubGlobal('matchMedia', (q: string) => ({
    get matches() {
      return state.reduce && q.includes('prefers-reduced-motion');
    },
    media: q,
    addEventListener() {},
    removeEventListener() {},
  }));
  return state;
}

// ---------------------------------------------------------------- 1, 2, 7: the row, its names and titles

test('1: five controls in order, all buttons; replay shows no words; no old Play, Replay or arrow', () => {
  render(consoleFor(DHCP));
  const row = [...controls().children];
  expect(row.map((el) => el.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON', 'BUTTON', 'BUTTON']);
  expect(row.map((el) => el.getAttribute('aria-label') ?? el.textContent)).toEqual(['Speed 1×. Click for 1.5×', 'Previous step', 'Play all', 'Replay step', 'Next step']);
  expect(row.map((el) => el.className.split(' ').at(-1))).toEqual(['cbtn--speed', 'cbtn--back', 'cbtn--alt', 'cbtn--replay', 'cbtn--go']);
  expect(replayButton().textContent).toBe('');
  expect(controls().querySelector('.cbtn--play')).toBeNull();
  // exact names: "Replay" and "Play" alone match nothing
  expect(screen.queryByRole('button', { name: 'Replay' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Play' })).toBeNull();
  expect(screen.queryByRole('button', { name: /Watch again|Go to Learn|Go to Practice/ })).toBeNull();
});

test('7: the titles name the keys, and Back keeps its plain accessible name', async () => {
  render(consoleFor(DHCP));
  expect(forwardButton()).toHaveAttribute('title', 'Next step (→)');
  expect(playButton()).toHaveAttribute('title', 'Play all (Space)');
  expect(backButton()).toHaveAttribute('title', 'Previous step (←)');
  expect(backButton().getAttribute('aria-label')).toBe('Previous step');
  expect(replayButton()).toHaveAttribute('title', 'Replay step');
  await user.click(playButton());
  expect(playButton()).toHaveAttribute('title', 'Pause (Space)');
  expect(playButton()).toHaveAccessibleName('Pause');
});

test('2 and 3: "Next step" through every slot, seven presses from the Overview, "Next lesson" on Practice that opens the next lesson', async () => {
  render(consoleFor(DHCP));
  const seen: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    expect(forwardButton()).toHaveAccessibleName('Next step');
    await user.click(forwardButton());
    seen.push(kicker().textContent!);
  }
  expect(seen[0]).toBe('Watch · Step 1 of 5');
  expect(seen[4]).toBe('Watch · Step 5 of 5');
  expect(seen[5]).toMatch(/^Learn/);
  expect(seen[6]).toMatch(/^Practice/);
  expect(forwardButton()).toHaveAccessibleName('Next lesson');
  expect(forwardButton().tagName).toBe('BUTTON');
  expect(forwardButton()).toHaveAttribute('title', 'Next lesson');
  await user.click(forwardButton());
  expect(navigate).toHaveBeenCalledExactlyOnceWith('/networking/firewalls');
});

test('3: Enter seven times on the focused forward button keeps the focus on it the whole way', async () => {
  render(consoleFor(DHCP));
  forwardButton().focus();
  for (let i = 0; i < 7; i += 1) {
    await user.keyboard('{Enter}');
    expect(forwardButton()).toHaveFocus();
  }
  expect(heading()).toHaveTextContent('Two questions');
  expect(forwardButton()).toHaveAccessibleName('Next lesson');
});

test('2: the same label whether Practice is reached by clicks or by ?step=7', () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=7');
  render(consoleFor(DHCP));
  expect(forwardButton()).toHaveAccessibleName('Next lesson');
});

test('2 and 19: in a lesson of three units Next step leads on from a unit’s Practice, and only the last unit’s Practice says Next lesson', async () => {
  window.history.replaceState({}, '', '/how-the-internet-works/what-is-http?step=7');
  render(consoleFor(THREE));
  expect(heading()).toHaveTextContent(/./);
  expect(forwardButton()).toHaveAccessibleName('Next step');
  expect(forwardButton()).toHaveAttribute('title', 'Next step (→)');
  // On a phone with the Log tab showing, the tabs switch to Explain first, and focus lands on the words.
  await user.click(within(screen.getByRole('group', { name: 'Show' })).getByRole('button', { name: 'Log' }));
  expect(document.querySelector('.console')).toHaveAttribute('data-tab', 'log');
  await user.click(forwardButton());
  expect(within(explanation()).getByText('Beta · Overview')).toBeInTheDocument();
  expect(document.querySelector('.console')).toHaveAttribute('data-tab', 'explain');
  expect(explanation()).toHaveFocus();
  expect(navigate).not.toHaveBeenCalled();

  window.history.replaceState({}, '', '/how-the-internet-works/what-is-http?step=23');
  render(consoleFor(THREE));
});

test('16 and 19: → on a unit’s Practice leads to the next unit’s Overview with the words focused; on the last Practice it does nothing', async () => {
  window.history.replaceState({}, '', '/how-the-internet-works/what-is-http?step=7');
  const { unmount } = render(consoleFor(THREE));
  await user.keyboard('{ArrowRight}');
  expect(within(explanation()).getByText('Beta · Overview')).toBeInTheDocument();
  expect(explanation()).toHaveFocus();
  unmount();

  // Next lesson ready, not ready, track's last: → does nothing, and never leaves the page.
  for (const [lesson, last, url] of [
    [DHCP, false, '/networking/dhcp'],
    [FIREWALLS, false, '/networking/firewalls'],
    [DHCP, true, '/networking/dhcp'],
  ] as const) {
    window.history.replaceState({}, '', `${url}?step=7`);
    const view = render(consoleFor(lesson, last));
    await user.keyboard('{ArrowRight}');
    await wait(1000);
    expect(heading()).toHaveTextContent('Two questions');
    expect(navigate).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe(url);
    view.unmount();
  }
});

test('20 and 21: with no next lesson the button is Next lesson, aria-disabled, with its reason, and a press changes nothing', async () => {
  for (const [lesson, last, title] of [
    [DHCP, true, 'There is no next lesson: this is the track’s last.'],
    [FIREWALLS, false, 'No next lesson is ready yet.'],
  ] as const) {
    window.history.replaceState({}, '', `/networking/${lesson.slug}?step=7`);
    const view = render(consoleFor(lesson, last));
    const forward = forwardButton();
    expect(forward).toHaveAccessibleName('Next lesson');
    expect(forward.tagName).toBe('BUTTON');
    expect(forward).toHaveAttribute('aria-disabled', 'true');
    expect(forward).toHaveAttribute('title', title);
    forward.focus();
    await user.click(forward);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(navigate).not.toHaveBeenCalled();
    expect(forward).toHaveFocus();
    expect(heading()).toHaveTextContent('Two questions');
    expect(playButton()).toHaveAccessibleName('Play all');
    view.unmount();
  }
});

// ---------------------------------------------------------------- 4 to 12: Play all, Pause, hand moves

test('4: on a step during its own play the button reads Play all, and pressing it runs from step 1', async () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=3');
  render(consoleFor(DHCP));
  await wait(0);
  expect(playButton()).toHaveAccessibleName('Play all');
  expect(playButton()).toHaveAttribute('title', 'Play all (Space)');
  await user.click(playButton());
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  expect(playButton()).toHaveAccessibleName('Pause');
});

test('8: Play all from the Overview holds 2600 ms between steps, stops on step 5 and never goes on to Learn', async () => {
  render(consoleFor(DHCP));
  await user.click(playButton());
  await wait(EVENT_MS);
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  await wait(HOLD_MS - 1);
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  await wait(1);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  await wait(2 * EVENT_MS + HOLD_MS + 2 * EVENT_MS + HOLD_MS + EVENT_MS + HOLD_MS + EVENT_MS);
  expect(kicker().textContent).toBe('Watch · Step 5 of 5');
  expect(playButton()).toHaveAccessibleName('Play all');
  expect(forwardButton()).toHaveAccessibleName('Next step');
  await wait(60_000);
  expect(kicker().textContent).toBe('Watch · Step 5 of 5');
});

test('9: Pause shows the step complete and the run stays stopped; Play all then starts at step 1', async () => {
  render(consoleFor(DHCP));
  await user.click(playButton());
  await wait(EVENT_MS + HOLD_MS + EVENT_MS); // step 2, one event in
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  await user.click(playButton());
  expect(playButton()).toHaveAccessibleName('Play all');
  expect(logRows()).toHaveLength(2);
  await wait(30_000);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  expect(document.querySelector('.topbar__fill')).toBeNull();
  await user.click(playButton());
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
});

test('9: Pause during the hold keeps the step that just finished', async () => {
  render(consoleFor(DHCP));
  await user.click(playButton());
  await wait(EVENT_MS + 100);
  expect(playButton()).toHaveAccessibleName('Pause');
  await user.click(playButton());
  await wait(HOLD_MS * 3);
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  expect(playButton()).toHaveAccessibleName('Play all');
});

test('10: Play all on a step, on Learn and on Practice leads to step 1 and Pause; the URL does not change', async () => {
  for (const step of [3, 6, 7]) {
    window.history.replaceState({}, '', `/networking/dhcp?step=${step}`);
    const view = render(consoleFor(DHCP));
    await wait(0);
    await user.click(playButton());
    expect(kicker().textContent).toBe('Watch · Step 1 of 5');
    expect(playButton()).toHaveAccessibleName('Pause');
    expect(forwardButton()).toHaveAccessibleName('Next step');
    view.unmount();
  }
});

test('11: every hand move during a run stops it, and nothing moves on afterwards; the speed button does not stop it', async () => {
  const moves: [string, () => Promise<void>][] = [
    ['the forward button', () => user.click(forwardButton())],
    ['→', () => keyOnPage('{ArrowRight}')],
    ['←', () => keyOnPage('{ArrowLeft}')],
    ['Back', () => user.click(backButton())],
    ['an outline item', () => user.click(within(screen.getByRole('navigation', { name: 'This lesson' })).getByRole('button', { name: /^Table Lookup/ }))],
  ];
  for (const [name, move] of moves) {
    const view = render(consoleFor(DHCP));
    await user.click(playButton());
    await wait(EVENT_MS + HOLD_MS + 100); // mid step 2
    expect(playButton(), name).toHaveAccessibleName('Pause');
    await move();
    expect(playButton(), name).toHaveAccessibleName('Play all');
    const where = kicker().textContent;
    await wait(EVENT_MS * 3);
    await wait(30_000);
    expect(kicker().textContent, name).toBe(where);
    view.unmount();
  }
  render(consoleFor(DHCP));
  await user.click(playButton());
  await user.click(screen.getByRole('button', { name: /^Speed / }));
  expect(playButton()).toHaveAccessibleName('Pause');
  await wait(EVENT_MS / 1.5 + HOLD_MS / 1.5 + 60);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
});

test('12: the forward button on the Overview shows step 1 and nothing moves on unasked', async () => {
  render(consoleFor(DHCP));
  await user.click(forwardButton());
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  await wait(30_000);
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  await user.click(forwardButton());
  await wait(2 * EVENT_MS + 30_000);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  expect(logRows()).toHaveLength(2);
  expect(playButton()).toHaveAccessibleName('Play all');
  expect(document.querySelector('.topbar__fill')).toBeNull();
});

// ---------------------------------------------------------------- 13: replay

test('13 and 13a: replay plays the current step again, in place; it is disabled where there is nothing to replay', async () => {
  render(consoleFor(DHCP));
  expect(replayButton()).toHaveAttribute('aria-disabled', 'true');
  for (let i = 0; i < 4; i += 1) await user.click(forwardButton());
  await wait(EVENT_MS);
  expect(kicker().textContent).toBe('Watch · Step 4 of 5');
  expect(logRows()).toHaveLength(4);
  expect(replayButton()).toHaveAttribute('aria-disabled', 'false');

  await user.click(replayButton());
  expect(logRows()).toHaveLength(3);
  expect(kicker().textContent).toBe('Watch · Step 4 of 5');
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(4);

  // Mid-play it starts again from the first message.
  await user.click(backButton());
  await user.click(forwardButton());
  await wait(EVENT_MS / 2);
  await user.click(replayButton());
  expect(logRows()).toHaveLength(3);
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(4);

  // Learn and Practice: disabled, and a press changes nothing and keeps the focus.
  await user.click(forwardButton());
  await user.click(forwardButton());
  expect(replayButton()).toHaveAttribute('aria-disabled', 'true');
  replayButton().focus();
  await user.click(replayButton());
  expect(replayButton()).toHaveFocus();
  expect(heading()).toHaveTextContent('What happened and why');
});

test('13a: a step with no events cannot be replayed, one with events but no message can', async () => {
  const quiet = structuredClone(DHCP);
  quiet.units[0]!.steps[0]!.events = [];
  window.history.replaceState({}, '', '/networking/dhcp?step=1');
  render(consoleFor(quiet));
  await wait(0);
  expect(replayButton()).toHaveAttribute('aria-disabled', 'true');
  await user.click(replayButton());
  expect(playButton()).toHaveAccessibleName('Play all');
});

test('13b: replay during a run stops it, replays that step, and the page stays on it', async () => {
  render(consoleFor(DHCP));
  await user.click(playButton());
  await wait(EVENT_MS + HOLD_MS + 100);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  await user.click(replayButton());
  expect(playButton()).toHaveAccessibleName('Play all');
  expect(logRows()).toHaveLength(1);
  await wait(2 * EVENT_MS);
  await wait(10_000);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  expect(logRows()).toHaveLength(2);

  // During the hold after step 1 it replays step 1, not step 2.
  await user.click(playButton());
  await wait(EVENT_MS);
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  await user.click(replayButton());
  await wait(HOLD_MS * 2);
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
});

// ---------------------------------------------------------------- 14, 15: reduced motion

test('14: under reduced motion a hand move lands the step complete at once; replay plays with its waits; the setting off plays with waits', async () => {
  const setting = reduceMotion(true);
  render(consoleFor(DHCP));
  for (let i = 0; i < 4; i += 1) await user.click(forwardButton());
  expect(kicker().textContent).toBe('Watch · Step 4 of 5');
  expect(logRows()).toHaveLength(4);
  expect(document.querySelector('.topbar__fill')).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
  await user.click(backButton());
  await user.click(forwardButton());
  expect(logRows()).toHaveLength(4);

  await user.click(replayButton());
  expect(logRows()).toHaveLength(3);
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(4);

  setting.reduce = false;
  await user.click(backButton());
  expect(kicker().textContent).toBe('Watch · Step 3 of 5');
  expect(logRows()).toHaveLength(2);
  await wait(2 * EVENT_MS);
  expect(logRows()).toHaveLength(3);
  await user.click(forwardButton());
  expect(logRows()).toHaveLength(3);
  await wait(EVENT_MS);
  expect(logRows()).toHaveLength(4);
});

test('14: a ?step= link, an outline click and Resume land complete under reduced motion', async () => {
  reduceMotion(true);
  window.history.replaceState({}, '', '/networking/dhcp?step=4');
  const { unmount } = render(consoleFor(DHCP));
  await wait(0);
  expect(logRows()).toHaveLength(4);
  await user.click(within(screen.getByRole('navigation', { name: 'This lesson' })).getByRole('button', { name: /^Table Lookup/ }));
  expect(logRows()).toHaveLength(3);
  expect(vi.getTimerCount()).toBe(0);
  unmount();
});

test('15: Play all keeps its pace under reduced motion', async () => {
  reduceMotion(true);
  render(consoleFor(DHCP));
  await user.click(playButton());
  await wait(EVENT_MS + HOLD_MS);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  await wait(2 * EVENT_MS + HOLD_MS - 1);
  expect(kicker().textContent).toBe('Watch · Step 2 of 5');
  await wait(1);
  expect(kicker().textContent).toBe('Watch · Step 3 of 5');
});

// ---------------------------------------------------------------- 16, 17, 29: keys, speed

test('16 and 17: → moves on the Overview, a step and Learn; ← from the Overview does nothing; r, R and Enter do nothing', async () => {
  render(consoleFor(DHCP));
  await user.keyboard('{ArrowLeft}');
  expect(kicker().textContent).toMatch(/^Overview|Overview/);
  await user.keyboard('rR{Enter}');
  expect(playButton()).toHaveAccessibleName('Play all');
  await user.keyboard('{ArrowRight}');
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  await user.keyboard('{ArrowLeft}');
  expect(kicker().textContent).toMatch(/Overview/);
  await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}');
  expect(heading()).toHaveTextContent('What happened and why');
});

test('17: Space starts a run and a second Space pauses it; a held Space does nothing more; Space on Practice runs from step 1', async () => {
  render(consoleFor(DHCP));
  await user.keyboard(' ');
  expect(playButton()).toHaveAccessibleName('Pause');
  await user.keyboard('{Control>} {/Control}');
  expect(playButton()).toHaveAccessibleName('Pause');
  await user.keyboard(' ');
  expect(playButton()).toHaveAccessibleName('Play all');
  // A repeat is ignored.
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', repeat: true, bubbles: true }));
  expect(playButton()).toHaveAccessibleName('Play all');
});

test('17: Space during a hand step’s own play runs from step 1, and on Practice moves to step 1', async () => {
  window.history.replaceState({}, '', '/networking/dhcp?step=3');
  const { unmount } = render(consoleFor(DHCP));
  await wait(0);
  await user.keyboard(' ');
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  unmount();

  window.history.replaceState({}, '', '/networking/dhcp?step=7');
  render(consoleFor(DHCP));
  await user.keyboard(' ');
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  expect(window.location.search).toBe('?step=7');
});

test('17: Space on the focused forward button moves one place and starts no run', async () => {
  render(consoleFor(DHCP));
  forwardButton().focus();
  await user.keyboard(' ');
  expect(kicker().textContent).toBe('Watch · Step 1 of 5');
  expect(playButton()).toHaveAccessibleName('Play all');
});

test('29: the speed button goes 1× → 1.5× → 2× → 0.5× → 1×', async () => {
  render(consoleFor(DHCP));
  const speed = () => screen.getByRole('button', { name: /^Speed / });
  const seen: string[] = [speed().getAttribute('aria-label')!];
  for (let i = 0; i < 4; i += 1) {
    await user.click(speed());
    seen.push(speed().getAttribute('aria-label')!);
  }
  expect(seen).toEqual([
    'Speed 1×. Click for 1.5×',
    'Speed 1.5×. Click for 2×',
    'Speed 2×. Click for 0.5×',
    'Speed 0.5×. Click for 1×',
    'Speed 1×. Click for 1.5×',
  ]);
});

// ---------------------------------------------------------------- the deferred parts stay

test('the empty log keeps its words, and the end row stays', () => {
  render(consoleFor(DHCP));
  expect(screen.getByText('Nothing has happened yet. Press Play to start.')).toBeInTheDocument();
  window.history.replaceState({}, '', '/networking/dhcp?step=7');
});
