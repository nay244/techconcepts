import { expect, test } from 'vitest';
import { internetTrack, networkingTrack } from '../content/tracks';
import { firstSentence } from './text';

test('the track card carries the first sentence of the description, or all of it when it has one sentence', () => {
  expect(firstSentence(networkingTrack.description)).toBe(
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it.',
  );
  expect(firstSentence(internetTrack.description)).toBe(
    'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each.',
  );
  expect(firstSentence('One sentence only.')).toBe('One sentence only.');
  expect(firstSentence('No full stop at all')).toBe('No full stop at all');
  expect(firstSentence('First. Second. Third.')).toBe('First.');
});
