import { expect, test } from 'vitest';
import { LEGACY_LESSONS } from '../legacy';
import { DEFAULT_DEPS, runFactCheck } from './cli';

// The command as it runs: the real lessons and report files, read without the registry, whose build gate would refuse
// a cited lesson that has no report yet.

// A lesson still on the legacy list; once the list is empty the case is skipped (plan.md, job 8).
const LISTED = (LEGACY_LESSONS as readonly string[])[0];

test.skipIf(LISTED === undefined)('a legacy lesson is refused', async () => {
  expect(await runFactCheck([LISTED!])).toEqual({
    code: 1,
    out: `"${LISTED}" is still on the legacy list; move it to the cited shape before checking it (docs/content-model.md §4).`,
  });
});

test('an unknown slug fails', async () => {
  expect(await runFactCheck(['no-such-lesson'])).toEqual({ code: 1, out: 'No lesson "no-such-lesson".' });
  expect(await runFactCheck(['../registry'])).toEqual({ code: 1, out: 'No lesson "../registry".' });
});

test('the default file reader has no report at a missing path', () => {
  expect(DEFAULT_DEPS.readFile('docs/fact-checks/no-such-lesson.md')).toBeUndefined();
});
