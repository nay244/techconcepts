import { expect, test } from 'vitest';
import { validateLesson } from '../content/define';
import type { FlowScene, Lesson } from '../content/schema';
import { fixtureLesson } from '../content/test-fixtures';
import { deriveState } from '../engine/timeline';
import { eventCard, kindLabel } from './eventCard';

const L: Lesson = validateLesson(fixtureLesson()).lesson;
const labels: Record<string, string> = { a: 'Laptop', b: 'Server' };
const actorLabel = (id: string) => labels[id] ?? id;

test('describes the message that just played, with its position in the lesson', () => {
  const card = eventCard(deriveState(L, 1, 1, null), actorLabel);
  expect(card).not.toBeNull();
  expect(card).toEqual({
    label: 'Hello',
    kind: 'request',
    dropped: false,
    route: 'Laptop → Server',
    summary: 'The laptop says hello.',
    meta: 'Message 1 of 4 · Demo · 34 B',
  });
});

test('the route names the actors, not their addresses', () => {
  const card = eventCard(deriveState(L, 1, 1, null), actorLabel);
  expect(card?.route).toContain('→');
  expect(card?.route).not.toContain('192.168');
});

test('counts messages across earlier steps: the first message of step 2 is message 2', () => {
  expect(eventCard(deriveState(L, 2, 1, null), actorLabel)?.meta).toBe('Message 2 of 4 · Demo · 60 B');
});

test('a message sent to more than one actor is a broadcast', () => {
  const input = fixtureLesson();
  const first = input.steps[0]!.events[0]!;
  if (first.type !== 'message') throw new Error('fixture changed: step 1 should start with a message');
  first.to = ['b', 'a'];
  const lesson = validateLesson(input).lesson;
  const card = eventCard(deriveState(lesson, 1, 1, null), actorLabel);
  expect(card?.route).toBe('Laptop → everyone (broadcast)');
  expect(card?.route.endsWith('(broadcast)')).toBe(true);
});

test('a dropped message is marked as dropped', () => {
  const card = eventCard(deriveState(L, 4, 1, null), actorLabel);
  expect(card?.dropped).toBe(true);
  expect(card?.label).toBe('Lost hello');
});

test('shows the latest message when a step has played several', () => {
  const card = eventCard(deriveState(L, 2, 3, null), actorLabel);
  expect(card?.label).toBe('Thanks');
  expect(card?.meta).toBe('Message 3 of 4 · Demo · 60 B');
});

test('counts the chosen Try it variant in the total', () => {
  const card = eventCard(deriveState(L, 5, 1, 'c1'), actorLabel);
  expect(card?.label).toBe('Hello');
  expect(card?.meta).toBe('Message 5 of 5 · Demo · 34 B');
});

test('there is no card on the Overview', () => {
  expect(eventCard(deriveState(L, 0, 0, null), actorLabel)).toBeNull();
});

test('there is no card before a step has played anything', () => {
  expect(eventCard(deriveState(L, 1, 0, null), actorLabel)).toBeNull();
});

test('there is no card for a step whose events are table changes only', () => {
  expect(eventCard(deriveState(L, 3, 1, null), actorLabel)).toBeNull();
});

test('there is no card at Check yourself or the Recap', () => {
  expect(eventCard(deriveState(L, 6, 0, null), actorLabel)).toBeNull();
  expect(eventCard(deriveState(L, 7, 0, null), actorLabel)).toBeNull();
});

// ---------------------------------------------------------------- kindLabel

const legend = (L.scene as FlowScene).legend;

test('kindLabel prefers the lesson legend', () => {
  expect(kindLabel('request', [{ kind: 'request', label: 'DNS query' }])).toBe('DNS query');
});

test('kindLabel falls back to a plain-English word when the legend has no entry', () => {
  expect(kindLabel('control', legend)).toBe('Control');
  expect(kindLabel('broadcast', [])).toBe('Broadcast');
  expect(kindLabel('encrypted', [])).toBe('Encrypted');
  expect(kindLabel('request', [])).toBe('Request');
  expect(kindLabel('response', [])).toBe('Response');
});
