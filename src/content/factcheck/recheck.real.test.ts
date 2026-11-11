import { expect, test } from 'vitest';
import { getLesson } from '../registry';
import { DEFAULT_DEPS, runFactCheck } from './cli';
import { parseReport } from './report';
import { claimSheet, itemHashes, limitsHash } from './sheet';
import { withoutRecords } from './test-helpers';
import { SOURCES } from '../sources';

// G4 on real content: the OSI Model lesson and its report, read as the command reads them (the real figures, no mock).

const PATH = 'docs/fact-checks/osi-model.md';
const sheet = () => claimSheet(getLesson('osi-model')!, SOURCES);

test('real 1: the OSI Model report passes the gate untouched, and its sheet hash is the one it was checked at', async () => {
  expect(await runFactCheck(['osi-model', '--check'])).toEqual({ code: 0, out: `Report OK: ${PATH}` });
  expect(sheet().hash).toBe('cd9b1cf300b223c033e80d8ec558bb4e2e08a0a8a347260bced718087c91cb6a');
  expect(parseReport(DEFAULT_DEPS.readFile(PATH)!).header!.items).toBeUndefined();
});

test('real 2: --stamp on a copy of the OSI Model report writes items (127 keys) and limits and changes no other byte', async () => {
  const original = DEFAULT_DEPS.readFile(PATH)!;
  const written: Record<string, string> = {};
  const run = await runFactCheck(['osi-model', '--stamp'], { ...DEFAULT_DEPS, writeFile: (to, text) => void (written[to] = text) });
  expect(run).toEqual({ code: 0, out: `Stamped: the items record (127 items) and the limits hash are written to ${PATH}` });
  const stamped = written[PATH]!;
  const items = parseReport(stamped).header!.items!;
  expect(Object.keys(items)).toHaveLength(127);
  expect(items).toEqual(itemHashes(sheet()));
  expect(parseReport(stamped).header!.limits).toBe(limitsHash(sheet().overrides));
  expect(withoutRecords(stamped)).toBe(original);
  expect(parseReport(stamped).header).toEqual({ ...parseReport(original).header, items, limits: limitsHash(sheet().overrides) });
});

test('real 3: a stamped OSI Model report still passes the gate\'s own function, and an unchanged lesson has nothing to re-check', async () => {
  const written: Record<string, string> = {};
  await runFactCheck(['osi-model', '--stamp'], { ...DEFAULT_DEPS, writeFile: (to, text) => void (written[to] = text) });
  const deps = { ...DEFAULT_DEPS, readFile: (path: string) => (path === PATH ? written[PATH] : DEFAULT_DEPS.readFile(path)) };
  expect(await runFactCheck(['osi-model', '--check'], deps)).toEqual({ code: 0, out: `Report OK: ${PATH}` });
  const recheck = await runFactCheck(['osi-model', '--recheck'], deps);
  expect(recheck.code).toBe(1);
  expect(recheck.out).toContain('Nothing changed');
});
