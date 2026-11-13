import { afterEach, describe, expect, test, vi } from 'vitest';
import { validateLesson } from './define';
import { makeGroup } from './glossary-fixtures';
import { defineGlossaryGroup } from './glossary-group';
import { checkGlossaryReports, checkGlossaryTies, checkGlossaryTiesOrWarn, checkUnpathedContent } from './registry';
import type { Lesson } from './schema';
import { cite, SOURCES } from './sources';
import { FIXTURE_SOURCES, makeCertTrack, makeCitedLesson } from './test-fixtures';

// The glossary against the lessons, and the registry's wiring (docs/glossary-path-spec.md §2 rules 13 and 14, §5, E5, E14;
// plan.md A5.5 to A5.7, A7.x).

// The real figures are in use here (the real registry loads), so the fixture lesson loses its cues, as in registry.test.ts.
const lessonNamed = (slug: string): Lesson => {
  const l = { ...makeCitedLesson(), slug };
  for (const u of l.units) for (const step of u.steps) for (const e of step.events) delete (e as { cues?: unknown }).cues;
  return validateLesson(l, FIXTURE_SOURCES);
};
const lessons = (): Record<string, Lesson> => ({ 'cited-lesson': lessonNamed('cited-lesson'), 'other-lesson': lessonNamed('other-lesson') });
const tie = (lesson: string, term: string) => ({ lesson, term });
type Input = ReturnType<typeof import('./glossary-fixtures').makeGroupInput>;
const group = (edit: (i: Input) => void) => makeGroup(edit);

describe('rule 13: each tie names a lesson and a term of its Learn', () => {
  test('a lesson that does not exist', () => {
    const issues = checkGlossaryTies([group((i) => (i.entries[0]!.lessons = [tie('what-is-nope', 'term-2')]))], lessons());
    expect(issues).toEqual(['glossary group "pilot", entry "lease": ties term "term-2" of lesson "what-is-nope", which no lesson has; fix the lesson\'s slug.']);
  });
  test('a term id that exists only in another lesson, and a Learn id that is not a term', () => {
    const l = lessons();
    l['other-lesson']!.units[0]!.learn.terms[0]!.id = 'term-only-here';
    expect(checkGlossaryTies([group((i) => (i.entries[0]!.lessons = [tie('cited-lesson', 'term-only-here')]))], l)).toEqual([
      expect.stringContaining('ties term "term-only-here" of lesson "cited-lesson", which is not a term of that lesson\'s Learn'),
    ]);
    for (const id of ['lead-1', 'fact-1']) {
      expect(checkGlossaryTies([group((i) => (i.entries[0]!.lessons = [tie('cited-lesson', id)]))], l)).toEqual([expect.stringContaining('which is not a term of that lesson\'s Learn')]);
    }
  });
  test('E14 a pair that matches more than one term of its lesson', () => {
    const l = lessons();
    l['cited-lesson']!.units[0]!.learn.terms[2]!.id = 'term-2';
    expect(checkGlossaryTies([group(() => {})], l)).toContainEqual(expect.stringContaining('entry "lease": ties term "term-2" of lesson "cited-lesson", which names more than one term of that lesson'));
  });
  test('a real tie is fine, in the entry and in a sense', () => expect(checkGlossaryTies([group(() => {})], lessons())).toEqual([]));
});

describe('rule 14: a lesson\'s term is tied to at most one entry or sense across the glossary', () => {
  test('the same pair in two groups, and in two senses of one entry', () => {
    const a = group(() => {});
    const b = group((i) => {
      i.id = 'second';
      i.entries = [{ id: 'borrow', term: 'Borrow', definition: [{ ...i.entries[0]!.definition![0]!, id: 'borrow-1' }], lessons: [tie('cited-lesson', 'term-2')] }];
    });
    expect(checkGlossaryTies([a, b], lessons())).toEqual([
      'glossary group "second", entry "borrow": ties term "term-2" of lesson "cited-lesson", which glossary group "pilot", entry "lease" already ties; a lesson\'s term is tied to one entry or sense.',
    ]);
    const senses = group((i) => (i.entries[1]!.senses![1]!.lessons = [tie('cited-lesson', 'term-3')]));
    expect(checkGlossaryTies([senses], lessons())).toEqual([expect.stringContaining('entry "renewal", sense "contracts": ties term "term-3"')]);
  });
  test('one term id in two lessons is two different pairs', () => {
    const g = group((i) => (i.entries[1]!.senses![1]!.lessons = [tie('other-lesson', 'term-3')]));
    expect(checkGlossaryTies([g], lessons())).toEqual([]);
  });
});

describe('refuseOrWarn: build and tests throw, astro dev warns', () => {
  afterEach(() => vi.restoreAllMocks());
  test('ties', () => {
    const bad = [group((i) => (i.entries[0]!.lessons = [tie('what-is-nope', 'term-2')]))];
    for (const mode of ['production', 'test']) expect(() => checkGlossaryTiesOrWarn(bad, lessons(), mode), mode).toThrow(/^Fact checks:\n- glossary group "pilot", entry "lease": ties/);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => checkGlossaryTiesOrWarn(bad, lessons(), 'development')).not.toThrow();
    expect(warn).toHaveBeenCalledOnce();
  });
  test('a group with no report', () => {
    const g = [group(() => {})];
    for (const mode of ['production', 'test']) expect(() => checkGlossaryReports(g, Object.values(lessons()), {}, {}, FIXTURE_SOURCES, mode), mode).toThrow(/glossary\/pilot: no fact-check report at docs\/fact-checks\/glossary\/pilot\.md/);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => checkGlossaryReports(g, Object.values(lessons()), {}, {}, FIXTURE_SOURCES, 'development')).not.toThrow();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('astro dev shows these groups anyway'));
  });
  test('an orphan report is refused, in its own folder', () => {
    expect(() => checkGlossaryReports([], [], { '../../docs/fact-checks/glossary/old.md': 'x' }, {}, FIXTURE_SOURCES, 'test')).toThrow('docs/fact-checks/glossary/old.md: a fact-check report with no glossary group "old"');
  });
  test('a tie to a lesson that is not there is reported by the report check, not thrown as a TypeError', () => {
    expect(() => checkGlossaryReports([group(() => {})], [], {}, {}, FIXTURE_SOURCES, 'test')).toThrow('glossary group "pilot": entry "lease": ties lesson "cited-lesson"');
  });
});

describe('A7: objective mappings are still refused, and only they', () => {
  test('a certification track with an objective is refused, byte for byte', () => {
    expect(() => checkUnpathedContent([makeCertTrack()], 'test')).toThrow(/^Fact checks:\n- track "example-cert", lesson "lesson-a", objective EX-101 2\.6 has no fact-check path yet: the build refuses objective mappings until one is built \(docs\/direction\.md, decision 2\.16\)/);
    expect(() => checkUnpathedContent([makeCertTrack()], 'production')).toThrow(/objective mappings/);
  });
  test('astro dev warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => checkUnpathedContent([makeCertTrack()], 'development')).not.toThrow();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('astro dev goes on'));
    warn.mockRestore();
  });
  test('no tracks give nothing', () => expect(() => checkUnpathedContent([], 'production')).not.toThrow());
});

describe('E5 the registry\'s wiring', () => {
  // The registry reads the mode it runs in: the build and the tests throw, `astro dev` only warns. Pin the mode so this block
  // holds under `vitest run --mode development` too.
  afterEach(() => {
    vi.doUnmock('./glossary');
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  const realGroup = (id: string, entry: string, term: string, tied: string) =>
    defineGlossaryGroup(
      {
        id,
        entries: [{ id: entry, term, definition: [{ id: `${entry}-1`, text: 'A GET request asks for a current representation of a resource.', cite: [cite('rfc-9110', '9.3.1', { defining: true })] }], lessons: [{ lesson: 'what-is-icmp', term: tied }] }],
      },
      SOURCES,
    );
  test('with ./glossary mocked to two groups tying one lesson term, the real registry refuses the second tie', async () => {
    const a = realGroup('first', 'ping-a', 'Ping A', 'term-ping');
    const b = realGroup('second', 'ping-b', 'Ping B', 'term-ping');
    vi.stubEnv('MODE', 'test');
    vi.resetModules();
    vi.doMock('./glossary', () => ({ GLOSSARY_GROUPS: [a, b], GLOSSARY: [...a.entries, ...b.entries] }));
    await expect(import('./registry')).rejects.toThrow(/ties term "term-ping" of lesson "what-is-icmp", which glossary group "first", entry "ping-a" already ties/);
  });
  test('with ./glossary mocked to one group, the real registry refuses for its missing report', async () => {
    const fixture = defineGlossaryGroup(
      { id: 'wiring-fixture', entries: [{ id: 'wiring-get', term: 'Wiring GET', definition: [{ id: 'wiring-get-1', text: 'A GET request asks for a current representation of a resource.', cite: [cite('rfc-9110', '9.3.1', { defining: true })] }] }] },
      SOURCES,
    );
    vi.stubEnv('MODE', 'test');
    vi.resetModules();
    vi.doMock('./glossary', () => ({ GLOSSARY_GROUPS: [fixture], GLOSSARY: fixture.entries }));
    await expect(import('./registry')).rejects.toThrow('glossary/wiring-fixture: no fact-check report at docs/fact-checks/glossary/wiring-fixture.md');
  });
  test('with the real glossary, the real registry loads', async () => {
    vi.resetModules();
    vi.doMock('./glossary', async () => vi.importActual('./glossary'));
    await expect(import('./registry')).resolves.toHaveProperty('getLesson');
  });
});

describe('the registry\'s globs', () => {
  const source = Object.values(import.meta.glob<string>('./registry.ts', { query: '?raw', import: 'default', eager: true }))[0]!;
  test('A5.5 the lesson gate\'s globs are the depth-1 ones, and a group\'s reports are read by globs of their own', () => {
    expect(source).toContain("import.meta.glob<string>(['../../docs/fact-checks/*.md', '!../../docs/fact-checks/*.recheck.md']");
    expect(source).toContain("import.meta.glob<string>('../../docs/fact-checks/*.recheck.md'");
    expect(source).toContain("import.meta.glob<string>(['../../docs/fact-checks/glossary/*.md', '!../../docs/fact-checks/glossary/*.recheck.md']");
    expect(source).toContain("import.meta.glob<string>('../../docs/fact-checks/glossary/*.recheck.md'");
    expect(source).not.toContain('fact-checks/**');
  });
});
