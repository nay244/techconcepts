import { expect, test } from 'vitest';
import { DEFAULT_DEPS, runFactCheck } from './cli';

// The command as it runs: the real lessons and report files, read without the registry, whose build gate would refuse
// a cited lesson that has no report yet.

test('an unknown slug fails', async () => {
  expect(await runFactCheck(['no-such-lesson'])).toEqual({ code: 1, out: 'No lesson "no-such-lesson".' });
  expect(await runFactCheck(['../registry'])).toEqual({ code: 1, out: 'No lesson "../registry".' });
});

test('the default file reader has no report at a missing path', () => {
  expect(DEFAULT_DEPS.readFile('docs/fact-checks/no-such-lesson.md')).toBeUndefined();
});
