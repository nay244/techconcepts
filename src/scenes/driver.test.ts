import { expect, test } from 'vitest';
import type { Lesson } from '../content/schema';
import { makeTwoUnitLesson } from '../content/test-fixtures';
import { deriveState, positionOf, type SlotKind } from '../engine/timeline';
import { landedEvent, sceneViewOf } from './driver';

/** The two-unit fixture, with its first unit's steps 2 and 4 setting the laptop's status as they start. */
function lessonWithStatuses(): Lesson {
  const lesson = makeTwoUnitLesson() as Lesson;
  lesson.units[0]!.steps[1]!.status = 'Asking';
  lesson.units[0]!.steps[3]!.status = 'Waiting';
  return lesson;
}

function viewAt(lesson: Lesson, unit: number, kind: SlotKind, step = 1, played = 0) {
  return sceneViewOf(lesson.units[unit]!, deriveState(lesson, positionOf(lesson, unit, kind, step), played));
}

test('the status is the latest one a step has set as it starts: none at the Overview or before any step sets one', () => {
  const lesson = lessonWithStatuses();
  expect(viewAt(lesson, 0, 'overview').status).toBeNull();
  expect(viewAt(lesson, 0, 'step', 1).status).toBeNull();
  // As soon as the step starts, before any of its events has played.
  expect(viewAt(lesson, 0, 'step', 2).status).toBe('Asking');
  // A step that sets none keeps the one before it, as the mockup's laptop does.
  expect(viewAt(lesson, 0, 'step', 3).status).toBe('Asking');
  expect(viewAt(lesson, 0, 'step', 4).status).toBe('Waiting');
  expect(viewAt(lesson, 0, 'step', 5, 1).status).toBe('Waiting');
  // Learn and Practice come after every step.
  expect(viewAt(lesson, 0, 'learn').status).toBe('Waiting');
  expect(viewAt(lesson, 0, 'practice').status).toBe('Waiting');
  // Each unit has its own steps: the second unit's set none.
  expect(viewAt(lesson, 1, 'step', 4).status).toBeNull();
});

test('a scene view carries the unit’s layers, labels and start with the derived moment', () => {
  const lesson = lessonWithStatuses();
  const unit = lesson.units[0]!;
  unit.scene.layers = ['web'];
  unit.scene.labels = { laptop: 'Wants a page' };
  unit.scene.start = [{ cue: 'glow' }];
  const derived = deriveState(lesson, positionOf(lesson, 0, 'step', 2), 1);
  expect(sceneViewOf(unit, derived)).toEqual({
    unit: 0,
    layers: ['web'],
    labels: { laptop: 'Wants a page' },
    start: [{ cue: 'glow' }],
    status: 'Asking',
    cues: derived.cues,
    tables: derived.tables,
    board: derived.board,
    active: derived.active,
    landed: unit.steps[1]!.events[0],
  });
});

test('landed is the latest message or note of the step so far: a table event it brings does not take its place', () => {
  const lesson = makeTwoUnitLesson() as Lesson;
  const steps = lesson.units[0]!.steps;
  const landed = (step: number, played: number) => viewAt(lesson, 0, 'step', step, played).landed;
  // Step 2: a message, then the table event it brings. The message stays the one that landed.
  const [message, table] = steps[1]!.events;
  expect(table!.type).toBe('table');
  expect(landed(2, 0)).toBeNull();
  expect(landed(2, 1)).toBe(message);
  expect(landed(2, 2)).toBe(message);
  expect(viewAt(lesson, 0, 'step', 2, 2).active).toBe(table);
  // Step 3: a table event first lands nothing; the note after it does.
  expect(landed(3, 1)).toBeNull();
  expect(landed(3, 2)).toBe(steps[2]!.events[1]);
  // A step starts with nothing landed, whatever the step before it left; off a step nothing is.
  expect(landed(4, 0)).toBeNull();
  for (const kind of ['overview', 'learn', 'practice'] as const) expect(viewAt(lesson, 0, kind).landed, kind).toBeNull();
  // The panel reads it from the derived state alone.
  const derived = deriveState(lesson, positionOf(lesson, 0, 'step', 2), 2);
  expect(landedEvent(derived)).toBe(message);
});

test('the start is the unit’s own at every position, Overview to Practice, and not among the cues that have played', () => {
  const lesson = lessonWithStatuses();
  lesson.units[0]!.scene.start = [{ cue: 'tray', arg: 'mail on' }];
  for (const [kind, step] of [['overview', 1], ['step', 1], ['step', 5], ['learn', 1], ['practice', 1]] as const) {
    const view = viewAt(lesson, 0, kind, step);
    expect(view.start, `${kind} ${step}`).toEqual([{ cue: 'tray', arg: 'mail on' }]);
    expect(view.cues.some((c) => c.cue === 'tray'), `${kind} ${step}`).toBe(false);
  }
  // A unit that gives none starts with nothing.
  expect(viewAt(lesson, 1, 'overview').start).toEqual([]);
});
