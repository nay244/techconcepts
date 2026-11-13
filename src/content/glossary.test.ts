import { describe, expect, test } from 'vitest';
import { GLOSSARY, GLOSSARY_GROUPS, checkGlossaryGroups, groupsFromModules } from './glossary';
import { makeGroup, statement } from './glossary-fixtures';
import { FIXTURE_SOURCES } from './test-fixtures';

// Loading the group files, and the rules that span groups (docs/glossary-path-spec.md §2, 11 and 12; E11). The rules inside
// a group are in glossary-group.test.ts, the ties to lessons in registry.glossary.test.ts.

const group = (id: string, entries: { id: string; term: string; also?: string[] }[]) =>
  makeGroup((i) => {
    i.id = id;
    i.entries = entries.map((e) => ({ ...e, definition: [statement(`${id}-${e.id}-1`)] }));
  });

describe('loading', () => {
  test('with no group file, the glossary and its groups are empty and valid', () => {
    expect(groupsFromModules({})).toEqual([]);
    expect(GLOSSARY_GROUPS).toEqual([]);
    expect(GLOSSARY).toEqual([]);
  });

  test('every entry comes in group order, then file order', () => {
    const a = group('a', [{ id: 'one', term: 'One' }, { id: 'two', term: 'Two' }]);
    const b = group('b', [{ id: 'three', term: 'Three' }]);
    const loaded = groupsFromModules({ './glossary-groups/b.ts': b, './glossary-groups/a.ts': a }, FIXTURE_SOURCES);
    expect(loaded.map((g) => g.id)).toEqual(['b', 'a']);
    expect(loaded.flatMap((g) => g.entries.map((e) => e.id))).toEqual(['three', 'one', 'two']);
  });

  test('E11: a file whose name is not its group id is refused, naming the file', () => {
    expect(() => groupsFromModules({ './glossary-groups/pilot.ts': group('pilot-1', [{ id: 'one', term: 'One' }]) }, FIXTURE_SOURCES)).toThrow(
      './glossary-groups/pilot.ts: the file name "pilot" must equal the group id "pilot-1".',
    );
  });

  test('E11: a default export that is a plain object, or not made with defineGlossaryGroup, is refused, naming the file', () => {
    const plain = { id: 'pilot', entries: [] } as never;
    expect(() => groupsFromModules({ './glossary-groups/pilot.ts': plain }, FIXTURE_SOURCES)).toThrow('./glossary-groups/pilot.ts: the group was not made with defineGlossaryGroup; wrap it so every rule runs.');
    expect(() => groupsFromModules({ './glossary-groups/pilot.ts': undefined as never }, FIXTURE_SOURCES)).toThrow('./glossary-groups/pilot.ts must default-export defineGlossaryGroup({ ... }).');
  });

  test('E11: a group defined against another source list is refused, naming the file; one against SOURCES is accepted', () => {
    const fixture = group('pilot', [{ id: 'one', term: 'One' }]);
    expect(() => groupsFromModules({ './glossary-groups/pilot.ts': fixture })).toThrow('./glossary-groups/pilot.ts: the group was checked against a different source list');
    expect(() => groupsFromModules({ './glossary-groups/pilot.ts': fixture }, FIXTURE_SOURCES)).not.toThrow();
  });

  test('a path that is not a file directly in glossary-groups/ is refused', () => {
    expect(() => groupsFromModules({ './glossary-groups/old/x.ts': group('x', [{ id: 'one', term: 'One' }]) }, FIXTURE_SOURCES)).toThrow('Unexpected glossary group file path');
  });
});

describe('R11: group ids and entry ids are unique across groups', () => {
  test('entry ttl in group a and in group b is refused, naming both groups', () => {
    const issues = checkGlossaryGroups([group('a', [{ id: 'ttl', term: 'TTL' }]), group('b', [{ id: 'ttl', term: 'Hop limit' }])]);
    expect(issues).toEqual(['Entry id "ttl" is in group "a" and in group "b"; entry ids are unique across the glossary.']);
  });
  test('entry ttl and entry ttl-dns are fine', () => {
    expect(checkGlossaryGroups([group('a', [{ id: 'ttl', term: 'TTL' }]), group('b', [{ id: 'ttl-dns', term: 'TTL in DNS' }])])).toEqual([]);
  });
  test('two groups with one id are refused', () => {
    expect(checkGlossaryGroups([group('a', [{ id: 'one', term: 'One' }]), group('a', [{ id: 'two', term: 'Two' }])])).toEqual(['Duplicate glossary group id "a" (2 groups); give each group its own id.']);
  });
});

describe('R12: every name is unique across the glossary, ignoring case and outer spaces', () => {
  test('a term in one group and a spelling in another are refused', () => {
    const issues = checkGlossaryGroups([group('a', [{ id: 'ttl', term: 'TTL' }]), group('b', [{ id: 'hop', term: 'Hop limit', also: [' ttl'] }])]);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain('The name " ttl" (entry "hop" of group "b") is already the name "TTL" of entry "ttl" of group "a"');
  });
  test('one entry\'s term equal to another\'s spelling, ignoring case, is refused, in one group too', () => {
    const issues = checkGlossaryGroups([group('a', [{ id: 'one', term: 'Alpha' }, { id: 'two', term: 'Beta', also: ['ALPHA'] }])]);
    expect(issues).toHaveLength(1);
  });
  test('IP address and IP-address are different names', () => {
    expect(checkGlossaryGroups([group('a', [{ id: 'one', term: 'IP address' }, { id: 'two', term: 'IP-address' }])])).toEqual([]);
  });
  test('the loader throws with every issue listed', () => {
    const a = group('a', [{ id: 'ttl', term: 'TTL' }]);
    const b = group('b', [{ id: 'ttl', term: 'ttl' }]);
    expect(() => groupsFromModules({ './glossary-groups/a.ts': a, './glossary-groups/b.ts': b }, FIXTURE_SOURCES)).toThrow(/^Invalid glossary:\n- Entry id "ttl" is in group "a" and in group "b"[\s\S]*\n- The name "ttl"/);
  });
});

test('the old shape is gone: the old define function no longer exists', async () => {
  const module = (await import('./glossary')) as Record<string, unknown>;
  expect(module['define' + 'Glossary']).toBeUndefined();
});
