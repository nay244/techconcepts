import { expect, test } from 'vitest';
import { GLOSSARY, GLOSSARY_GROUPS } from '../glossary';

// This test file and glossary-groups/old/decoy.ts sit where group files go. Neither is a group: if the glob took the
// decoy, importing glossary would throw; if it took this file, which has no default export, it would refuse it.

test('a test file and a file in a folder under glossary-groups/ are not groups', () => {
  expect(GLOSSARY_GROUPS.some((g) => g.id === 'loading' || g.id === 'decoy')).toBe(false);
  expect(GLOSSARY).toEqual(GLOSSARY_GROUPS.flatMap((g) => g.entries));
});
