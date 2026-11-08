import { expect, test } from 'vitest';
import { startLesson } from './start';

test('the site starts at the first lesson of the first track', () => {
  expect(startLesson()).toMatchObject({ url: '/how-the-internet-works/what-is-http', title: 'HTTP' });
});
