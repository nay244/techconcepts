import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import { getLesson } from '../content/registry';
import type { Lesson } from '../content/schema';
import { makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { tracks } from '../content/tracks';
import { resumeLabel, slotsFor } from '../engine/timeline';
import { firstSentence, logSample, resumePlaces } from './home';

// The real lessons and the small fixtures both validate: the fixtures' stand-in parts are added to the real ones.
vi.mock('../art/scenes/parts', async (importOriginal) => ({
  FIGURE_PARTS: (await import('../content/test-fixtures')).withFixtureParts(
    (await importOriginal<typeof import('../art/scenes/parts')>()).FIGURE_PARTS,
  ),
}));

const lesson = (slug: string): Lesson => {
  const found = getLesson('networking', slug);
  if (found === undefined) throw new Error(`no ${slug}`);
  return found;
};
const DHCP = lesson('dhcp');
const INTERNET = lesson('how-the-internet-works');

test('the track card carries the first sentence of the description, or all of it when it has one sentence', () => {
  expect(firstSentence(tracks[0]!.description)).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  expect(firstSentence('One sentence only.')).toBe('One sentence only.');
  expect(firstSentence('No full stop at all')).toBe('No full stop at all');
  expect(firstSentence('First. Second. Third.')).toBe('First.');
});

test('the DHCP log sample is its first four messages at Learn, the fourth current, then the next one as Later', () => {
  expect(logSample(DHCP)).toEqual({
    rows: [
      {
        n: '01',
        from: 'Laptop',
        to: 'everyone',
        kind: 'broadcast',
        tag: 'Discover',
        plain: 'The laptop shouts to everyone: can anyone give me an address?',
        current: false,
      },
      {
        n: '02',
        from: 'Router',
        to: 'Laptop',
        kind: 'response',
        tag: 'Offer',
        plain: 'The router offers 192.168.1.100, plus the other settings the laptop needs, for 24 hours.',
        current: false,
      },
      {
        n: '03',
        from: 'Laptop',
        to: 'everyone',
        kind: 'broadcast',
        tag: 'Request',
        plain: 'The laptop says yes: I’ll take 192.168.1.100 from 192.168.1.1.',
        current: false,
      },
      {
        n: '04',
        from: 'Router',
        to: 'Laptop',
        kind: 'response',
        tag: 'ACK',
        plain: 'The router confirms: 192.168.1.100 is the laptop’s for 24 hours.',
        current: true,
      },
    ],
    step: 4,
    steps: 5,
    later: { n: '05', sub: 'Halfway through, ask to keep it' },
  });
});

test('a sample with fewer messages than it asks for is refused by name', () => {
  const small = validateLesson(makeLesson()).lesson;
  expect(() => logSample(small, 40)).toThrow(/fixture-lesson.*40/);
});

test('a sample row that is a note, not a message, is refused by name', () => {
  // The fixture's log runs m1, m2, then the note n1.
  const fixture = validateLesson(makeLesson()).lesson;
  expect(() => logSample(fixture, 2)).not.toThrow();
  expect(() => logSample(fixture, 3)).toThrow(/fixture-lesson.*note/);
});

test('each place reads after "You’re on" and before "in <lesson>"; a step keeps resumeLabel’s words', () => {
  const places = resumePlaces(DHCP);
  expect(places).toEqual([
    'the Overview',
    'step 1 of 5',
    'step 2 of 5',
    'step 3 of 5',
    'step 4 of 5',
    'step 5 of 5',
    'the Learn part',
    'the Practice part',
  ]);
  slotsFor(DHCP).forEach((slot, p) => {
    if (slot.kind === 'step') expect(places[p]).toBe(resumeLabel(DHCP, p));
  });
});

test('in a lesson of many units the unit’s name says which part', () => {
  const two = validateLesson(makeTwoUnitLesson()).lesson;
  expect(resumePlaces(two)).toEqual([
    'the Alpha Overview',
    'Alpha step 1 of 5',
    'Alpha step 2 of 5',
    'Alpha step 3 of 5',
    'Alpha step 4 of 5',
    'Alpha step 5 of 5',
    'the Alpha Learn part',
    'the Alpha Practice part',
    'the Beta Overview',
    'Beta step 1 of 5',
    'Beta step 2 of 5',
    'Beta step 3 of 5',
    'Beta step 4 of 5',
    'Beta step 5 of 5',
    'the Beta Learn part',
    'the Beta Practice part',
  ]);
  // The real one too: one place for every position.
  const places = resumePlaces(INTERNET);
  expect(places).toHaveLength(slotsFor(INTERNET).length);
  expect(places[0]).toBe('the HTTP Overview');
  expect(places[1]).toBe(`HTTP step 1 of ${INTERNET.units[0]!.steps.length}`);
});
