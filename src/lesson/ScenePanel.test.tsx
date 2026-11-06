// @vitest-environment jsdom
import { act, render, screen, within } from '@testing-library/react';
import { useMemo } from 'react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import type { Lesson } from '../content/schema';
import { makeLesson, makeUnit } from '../content/test-fixtures';
import { pendingEvent, type PlaybackState } from '../engine/playback';
import { deriveState } from '../engine/timeline';
import type { PanelMark, PlayOptions, SceneView } from '../scenes/driver';
import { UnitPanel } from './panels/UnitPanel';
import { ScenePanel } from './ScenePanel';

// No lesson files exist yet, so the lessons are fixtures, which validate against the stand-in figure parts.
vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../content/test-fixtures')).FIXTURE_PARTS }));

/** One stand-in driver for every figure, whose calls the tests read. */
const fake = vi.hoisted(() => {
  const driver = { show: vi.fn(), play: vi.fn(), destroy: vi.fn() };
  return { driver, module: { create: vi.fn(() => driver), duration: vi.fn(() => 1000) } };
});
vi.mock('../scenes/drivers', () => ({
  DRIVERS: { dhcp: fake.module, subnet: fake.module, firewall: fake.module, 'net-map': fake.module },
}));

// The real panel, watched: the marks it is handed are what the learner would see.
vi.mock('./panels/UnitPanel', async (importOriginal) => {
  const real = await importOriginal<typeof import('./panels/UnitPanel')>();
  return { ...real, UnitPanel: vi.fn(real.UnitPanel) };
});

/**
 * The fixture unit. Positions: 0 Overview, 1 Neighbor Hello (m1), 2 Neighbor
 * Reply (m2, t-add), 3 Table Lookup (t-match, n1), 4 Lost Message (m3),
 * 5 Retransmission (m4), 6 Learn, 7 Practice.
 */
const LESSON: Lesson = validateLesson(makeLesson()).lesson;
const DATA = { routes: { a: [[0, 0]] } };
const FIGURE = <svg data-figure="dhcp" role="img" aria-label="Fixture figure" />;

const at = (position: number, eventIndex: number, mode: PlaybackState['mode'], speed: PlaybackState['speed'] = 1): PlaybackState => ({
  position,
  eventIndex,
  mode,
  ended: false,
  speed,
});

/** The panel as the console renders it: the derived state is worked out again only when the position or event changes. */
function Harness({ s, lesson, reducedMotion, data }: { s: PlaybackState; lesson: Lesson; reducedMotion: boolean; data: unknown }) {
  const derived = useMemo(() => deriveState(lesson, s.position, s.eventIndex), [lesson, s.position, s.eventIndex]);
  return (
    <ScenePanel
      unit={lesson.units[derived.unit]!}
      figure={FIGURE}
      figureData={data}
      derived={derived}
      playback={s}
      reducedMotion={reducedMotion}
    />
  );
}

const panel = (s: PlaybackState, lesson: Lesson = LESSON, reducedMotion = false, data: unknown = DATA) => (
  <Harness s={s} lesson={lesson} reducedMotion={reducedMotion} data={data} />
);

const shown = (): SceneView[] => fake.driver.show.mock.calls.map(([view]) => view as SceneView);
const plays = () => fake.driver.play.mock.calls as [unknown, SceneView, PlayOptions][];
const lastPlay = () => plays().at(-1)!;
const marksOnPanel = (): readonly PanelMark[] => vi.mocked(UnitPanel).mock.lastCall![0].marks;
/** The marks on the panel in each render since `from` renders had been made. */
const marksSince = (from: number): (readonly PanelMark[])[] => vi.mocked(UnitPanel).mock.calls.slice(from).map(([props]) => props.marks);
const sequence = () => screen.queryByRole('img', { name: 'The messages so far, as a sequence' });

beforeEach(() => {
  vi.clearAllMocks();
  // Each test starts from the plain stand-in: no implementation a test set is left behind.
  for (const fn of [fake.driver.show, fake.driver.play, fake.driver.destroy, fake.module.create]) fn.mockReset();
  fake.module.create.mockImplementation(() => fake.driver);
  fake.driver.play.mockResolvedValue(undefined);
});

test('ScenePanel calls show on every change, and aborts the running play when the learner moves', () => {
  const order: string[] = [];
  fake.driver.show.mockImplementation(() => order.push('show'));
  fake.driver.play.mockImplementation(async (_event: unknown, _view: SceneView, o: PlayOptions) => {
    order.push('play');
    o.signal.addEventListener('abort', () => order.push('abort'));
  });

  // Step 1 starts playing m1: the driver is made on the figure, shows the settled scene, then plays.
  const s1 = at(1, 0, 'step');
  const { rerender, container } = render(panel(s1));
  expect(fake.module.create).toHaveBeenCalledTimes(1);
  expect(fake.module.create).toHaveBeenCalledWith(container.querySelector('svg[data-figure="dhcp"]'), DATA);
  expect(order).toEqual(['show', 'play']);
  expect(shown()[0]).toEqual({
    unit: 0,
    layers: [],
    labels: {},
    start: [],
    status: null,
    cues: [],
    tables: { t: { rows: [], highlight: null, missed: [] } },
    board: null,
    active: null,
  });
  const [event, view, options] = lastPlay();
  expect(event).toBe(pendingEvent(LESSON, s1));
  expect(view).toBe(shown()[0]);
  expect(options).toMatchObject({ speed: 1, reducedMotion: false });
  expect(options.signal.aborted).toBe(false);

  // The same state again changes nothing.
  rerender(panel(s1));
  expect(order).toEqual(['show', 'play']);

  // The tick applies m1: the play is over, the scene settles on it, and nothing is left to play.
  rerender(panel(at(1, 1, 'idle')));
  expect(options.signal.aborted).toBe(true);
  expect(order).toEqual(['show', 'play', 'abort', 'show']);
  expect(shown().at(-1)!.cues).toEqual([{ cue: 'glow', eventId: 'm1', current: true }]);
  expect(shown().at(-1)!.active).toBe(LESSON.units[0]!.steps[0]!.events[0]);

  // Step 2 plays m2; the learner moves to step 4 halfway through, at double speed with less motion.
  rerender(panel(at(2, 0, 'step')));
  const second = lastPlay()[2];
  order.length = 0;
  rerender(panel(at(4, 0, 'step', 2), LESSON, true));
  expect(second.signal.aborted).toBe(true);
  expect(order).toEqual(['abort', 'show', 'play']);
  expect(shown().at(-1)!.tables.t!.rows).toEqual([{ ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' }]);
  const [moved, , fast] = lastPlay();
  expect(moved).toBe(pendingEvent(LESSON, at(4, 0, 'step')));
  expect(fast).toMatchObject({ speed: 2, reducedMotion: true });
  expect(fast.signal.aborted).toBe(false);
});

test('a new speed restarts the play, as it restarts the wait', () => {
  const { rerender } = render(panel(at(1, 0, 'step')));
  const first = lastPlay()[2];
  rerender(panel(at(1, 0, 'step', 1.5)));
  expect(first.signal.aborted).toBe(true);
  expect(plays()).toHaveLength(2);
  expect(lastPlay()[2]).toMatchObject({ speed: 1.5 });
});

test('marks a driver reports reach the panel while the event plays and clear when it is applied', () => {
  const { rerender } = render(panel(at(3, 0, 'step')));
  expect(marksOnPanel()).toEqual([]);
  const { onMark, signal } = lastPlay()[2];

  act(() => onMark!({ row: 0, state: 'check' }));
  act(() => onMark!({ row: 0, state: 'miss' }));
  act(() => onMark!({ row: 1, state: 'deny' }));
  expect(marksOnPanel()).toEqual([
    { row: 0, state: 'check' },
    { row: 0, state: 'miss' },
    { row: 1, state: 'deny' },
  ]);

  // The tick applies the event: its marks go in the very render that applies it, and a late mark from its play is ignored.
  const renders = vi.mocked(UnitPanel).mock.calls.length;
  rerender(panel(at(3, 1, 'step')));
  expect(signal.aborted).toBe(true);
  expect(marksSince(renders).length).toBeGreaterThan(0);
  for (const marks of marksSince(renders)) expect(marks).toEqual([]);
  act(() => onMark!({ row: 2, state: 'check' }));
  expect(marksOnPanel()).toEqual([]);
});

test('switching to Sequence and back re-shows the settled Network state', async () => {
  const user = userEvent.setup();
  const { rerender, container } = render(panel(at(2, 0, 'step')));
  const figureBox = container.querySelector('svg[data-figure]')!.parentElement!;
  const playing = lastPlay()[2];
  expect(sequence()).toBeNull();

  const views = screen.getByRole('group', { name: 'View' });
  await user.click(within(views).getByRole('button', { name: 'Sequence' }));
  expect(within(views).getByRole('button', { name: 'Sequence' })).toHaveAttribute('aria-pressed', 'true');
  expect(within(views).getByRole('button', { name: 'Network' })).toHaveAttribute('aria-pressed', 'false');
  expect(playing.signal.aborted).toBe(true);
  expect(figureBox).not.toBeVisible();
  // The rows equal the log: m1 from step 1 so far.
  expect(sequence()).toBeInTheDocument();
  expect([...container.querySelectorAll('[data-row]')].map((g) => g.getAttribute('data-row'))).toEqual(['m1']);

  // m2 is applied while the Sequence view is up: the rows follow, and the hidden figure is left alone.
  const before = { shows: shown().length, plays: plays().length };
  rerender(panel(at(2, 1, 'step')));
  expect([...container.querySelectorAll('[data-row]')].map((g) => g.getAttribute('data-row'))).toEqual(['m1', 'm2']);
  expect(shown()).toHaveLength(before.shows);
  expect(plays()).toHaveLength(before.plays);

  // Back on Network: the figure shows the state as it now stands, settled; the event in flight is not replayed.
  await user.click(within(views).getByRole('button', { name: 'Network' }));
  expect(figureBox).toBeVisible();
  expect(sequence()).toBeNull();
  expect(shown()).toHaveLength(before.shows + 1);
  expect(shown().at(-1)).toEqual(expect.objectContaining({ unit: 0, active: LESSON.units[0]!.steps[1]!.events[0] }));
  expect(plays()).toHaveLength(before.plays);

  // The next event plays as usual.
  rerender(panel(at(2, 2, 'step')));
  expect(plays()).toHaveLength(before.plays);
  rerender(panel(at(4, 0, 'step')));
  expect(plays()).toHaveLength(before.plays + 1);
});

test('the toggle is hidden when views has only network', () => {
  const unit = makeUnit();
  const lesson = validateLesson(makeLesson({ units: [{ ...unit, scene: { ...unit.scene, views: ['network'] } }] })).lesson;
  render(panel(at(0, 0, 'idle'), lesson));
  expect(screen.queryByRole('group', { name: 'View' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Sequence' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Home network' })).toBeInTheDocument();
});

test('shows the scene title, the figure and the unit’s table under it', () => {
  render(panel(at(2, 2, 'idle')));
  const scene = screen.getByRole('region', { name: 'Home network' });
  expect(within(scene).getByRole('img', { name: 'Fixture figure' })).toBeInTheDocument();
  const table = within(scene).getByRole('region', { name: 'Neighbor table' });
  expect(within(table).getByRole('cell', { name: /192\.168\.1\.10/ })).toBeInTheDocument();
  expect(table.querySelector('tr[data-highlight="added"]')).not.toBeNull();
});

test('without a figure there is no driver, and the rest still shows', () => {
  const derived = deriveState(LESSON, 1, 0);
  render(
    <ScenePanel unit={LESSON.units[0]!} figure={null} figureData={null} derived={derived} playback={at(1, 0, 'step')} reducedMotion={false} />,
  );
  expect(fake.module.create).not.toHaveBeenCalled();
  expect(screen.getByRole('region', { name: 'Neighbor table' })).toBeInTheDocument();
});

test('leaving the page aborts the play, then lets the driver go', () => {
  const order: string[] = [];
  fake.driver.play.mockImplementation(async (_event: unknown, _view: SceneView, o: PlayOptions) => {
    o.signal.addEventListener('abort', () => order.push('abort'));
  });
  fake.driver.destroy.mockImplementation(() => order.push('destroy'));
  const { unmount } = render(panel(at(1, 0, 'step')));
  const playing = lastPlay()[2];
  unmount();
  expect(playing.signal.aborted).toBe(true);
  expect(order).toEqual(['abort', 'destroy']);
});

test('new figure data aborts the play, remakes the driver and shows the scene as it stands, without a replay', () => {
  const order: string[] = [];
  fake.driver.show.mockImplementation(() => order.push('show'));
  fake.driver.play.mockImplementation(async (_event: unknown, _view: SceneView, o: PlayOptions) => {
    order.push('play');
    o.signal.addEventListener('abort', () => order.push('abort'));
  });
  fake.driver.destroy.mockImplementation(() => order.push('destroy'));
  fake.module.create.mockImplementation(() => {
    order.push('create');
    return fake.driver;
  });

  const s = at(2, 1, 'step');
  const { rerender, container } = render(panel(s));
  expect(order).toEqual(['create', 'show', 'play']);
  const playing = lastPlay()[2];
  order.length = 0;

  const next = { routes: { b: [[1, 1]] } };
  rerender(panel(s, LESSON, false, next));
  expect(playing.signal.aborted).toBe(true);
  expect(order).toEqual(['abort', 'destroy', 'create', 'show']);
  expect(fake.module.create).toHaveBeenLastCalledWith(container.querySelector('svg[data-figure="dhcp"]'), next);
  // The state as it stands: m2 applied, t-add still to come.
  expect(shown().at(-1)).toBe(shown().at(-2));
  expect(shown().at(-1)!.active).toBe(LESSON.units[0]!.steps[1]!.events[0]);
  expect(plays()).toHaveLength(1);
});

test('a driver whose play fails is caught, and the panel carries on', async () => {
  const error = new Error('The figure has no such part.');
  const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
  fake.driver.play.mockRejectedValueOnce(error);
  const { rerender } = render(panel(at(1, 0, 'step')));
  await act(async () => {});
  expect(logged).toHaveBeenCalledWith(expect.any(String), error);

  // A play that throws before it returns a promise is caught too.
  fake.driver.play.mockImplementationOnce(() => {
    throw error;
  });
  rerender(panel(at(2, 0, 'step')));
  await act(async () => {});
  expect(logged).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('region', { name: 'Neighbor table' })).toBeInTheDocument();

  // The next event plays as usual.
  rerender(panel(at(2, 1, 'step')));
  expect(plays()).toHaveLength(3);
  logged.mockRestore();
});
