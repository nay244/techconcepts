import { expect, test } from 'vitest';
import { checkStructure } from './define';
import { routerFixture } from './router-fixture';
import type { Lesson, MessageEvent, SceneEvent, TableEvent } from './schema';
import { sceneEventSchema, tableEventSchema } from './schema';

// D10 / B12's schema and validator rules (prototypes/d10-cases.md, schema 1 to 4), with the real figure parts.

const issues = (mutate: (l: Lesson) => void): string => {
  const lesson = routerFixture();
  mutate(lesson);
  return checkStructure(lesson).join('\n');
};
const events = (l: Lesson): SceneEvent[] => l.units[0]!.steps.flatMap((s) => s.events);
const tableEvent = (l: Lesson, id: string): TableEvent => events(l).find((e) => e.id === id) as TableEvent;
const unit = (l: Lesson) => l.units[0]!;

test('Router’s unit passes the structural check as the spec writes it', () => {
  expect(checkStructure(routerFixture())).toEqual([]);
});

const base = { type: 'table', id: 't', table: 'routes', summary: 's' } as const;

test('the schema takes `by`, `keys` and the dropped glyph', () => {
  expect(tableEventSchema.safeParse({ ...base, op: 'replace', rows: [], by: 'kept by me' }).success).toBe(true);
  expect(tableEventSchema.safeParse({ ...base, op: 'match', keys: ['a', 'b'] }).success).toBe(true);
  expect(tableEventSchema.safeParse({ ...base, op: 'match', keys: ['a'] }).success).toBe(false);
  const note = { type: 'note', id: 'n', log: {}, plain: 'p' };
  expect(sceneEventSchema.safeParse({ ...note, glyph: 'dropped' }).success).toBe(true);
  expect(sceneEventSchema.safeParse({ ...note, glyph: 'blocked' }).success).toBe(false);
});

test('`by` is for a replace: a match, an add and an update with it fail', () => {
  expect(issues(() => {})).toBe('');
  expect(issues((l) => Object.assign(tableEvent(l, 's1-match'), { by: 'x' }))).toContain('(match) has "by"');
  expect(issues((l) => Object.assign(tableEvent(l, 's1-match'), { op: 'add', row: { network: 'n', hop: 'h' }, key: undefined, by: 'x' }))).toContain('(add) has "by"');
  expect(issues((l) => Object.assign(tableEvent(l, 's1-match'), { op: 'update', key: 'k', row: { hop: 'h' }, by: 'x' }))).toContain('(update) has "by"');
});

test('`keys` is for a match, and names two different rows; a winner is one of them; a match names something', () => {
  expect(issues((l) => Object.assign(tableEvent(l, 's1-table'), { keys: ['a', 'b'] }))).toContain('(replace) has "keys"');
  expect(issues((l) => Object.assign(tableEvent(l, 's3-candidates'), { keys: ['x', 'x'] }))).toContain('lists "x" twice');
  expect(issues((l) => Object.assign(tableEvent(l, 's3-winner'), { key: '198.51.100.0/24' }))).toContain('not one of its "keys"');
  expect(issues((l) => delete tableEvent(l, 's3-candidates').keys)).toContain('needs "key" or "keys"');
  // A match that found nothing is `key: ''` alone, and passes.
  expect(issues(() => {})).toBe('');
});

test('a note’s dropped glyph needs a legend entry that explains it', () => {
  expect(issues((l) => (unit(l).scene.log.legend = unit(l).scene.log.legend.filter((e) => e.kind !== 'dropped')))).toContain('draws the dropped glyph, which the unit\'s log legend does not explain');
});

test('the cue `hide` takes only the resolver, and only at the start', () => {
  expect(issues((l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'a' }]))).toContain('cue "hide" takes "resolver", not "a"');
  expect(issues((l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }, { cue: 'hide', arg: 'resolver' }]))).toBe('');
  expect(issues((l) => (events(l).find((e) => e.id === 's5-drop') as { cues: unknown[] }).cues.push({ cue: 'hide', arg: 'resolver' }))).toContain('is for a scene\'s start');
});

test('the cue `drop` takes a router and goes on an event, once', () => {
  expect(issues((l) => (events(l).find((e) => e.id === 's5-drop') as { cues: unknown[] }).cues.splice(0, 1, { cue: 'drop', arg: 'resolver' }))).toContain('cue "drop" arg "resolver" is not one the net-map figure can show');
  expect(issues((l) => (events(l).find((e) => e.id === 's5-drop') as { cues: unknown[] }).cues.splice(0, 1, { cue: 'drop', arg: 'd' }))).toBe('');
  expect(issues((l) => (events(l).find((e) => e.id === 's5-drop') as { cues: unknown[] }).cues.push({ cue: 'drop', arg: 'b' }))).toContain('at most one "drop"');
  expect(issues((l) => (unit(l).scene.start = [{ cue: 'drop', arg: 'a' }]))).toContain('the start cannot drop');
});

test('a message to or from the hidden resolver fails', () => {
  expect(issues((l) => Object.assign(events(l).find((e) => e.id === 's2-packet') as MessageEvent, { to: 'resolver' }))).toContain('which the scene\'s start hides');
  expect(issues((l) => Object.assign(events(l).find((e) => e.id === 's2-packet') as MessageEvent, { from: 'resolver' }))).toContain('which the scene\'s start hides');
});
