import { expect, test } from 'vitest';
import { LessonValidationError } from './define';
import { defineLegacyLesson, LEGACY_LESSONS, legacyLessonSchema } from './legacy';
import { liftedFixture, makeLesson, makeUnit } from './test-fixtures';

// A slug still on the list, for the cases that need one; once the list is empty they are skipped (plan.md, job 8).
const LISTED = (LEGACY_LESSONS as readonly string[])[0];

test('the legacy list holds only Networking lessons not yet moved: every lesson of How the Internet Works has moved, and it may only shrink', () => {
  expect(['dhcp', 'firewalls', 'subnetting']).toEqual(expect.arrayContaining([...LEGACY_LESSONS]));
});

test('lifting keeps every word and adds empty citations', () => {
  const input = makeLesson();
  const l = liftedFixture(input);
  expect(l.origin).toBe('legacy');
  expect(l.units[0]!.learn.lead).toEqual([{ id: 'lead', text: input.units[0]!.learn.lead, cite: [] }]);
  expect(l.units[0]!.steps[0]!.deep).toEqual([{ text: input.units[0]!.steps[0]!.deep, cite: [] }]);
  expect(l.units[0]!.learn.terms.map((t) => t.id)).toEqual(input.units[0]!.learn.terms.map((_, i) => `term-${i + 1}`));
});

test('every changed field lifts as the mapping says, the rest stays as written, and nothing gets a backing', () => {
  const input = makeLesson();
  const u = input.units[0]!;
  const l = liftedFixture(input);
  const lifted = l.units[0]!;
  expect(lifted.learn).toEqual({
    lead: [{ id: 'lead', text: u.learn.lead, cite: [] }],
    terms: u.learn.terms.map((t, i) => ({ id: `term-${i + 1}`, ...t, cite: [] })),
    pattern: { id: 'pattern', ...u.learn.pattern, cite: [] },
    why: [{ id: 'why', text: u.learn.why, cite: [] }],
    deep: [{ id: 'deep', text: u.learn.deep, cite: [] }],
    facts: u.learn.facts.map((f, i) => ({ ...f, id: `fact-${i + 1}`, cite: [] })),
  });
  expect(lifted.steps.map((s) => s.deep)).toEqual(u.steps.map((s) => [{ text: s.deep, cite: [] }]));
  expect(lifted.practice.map((q) => q.options)).toEqual(u.practice.map((q) => q.options.map((o) => ({ ...o, cite: [] }))));
  // Overview and Watch step facts, the references, the scene and the events are as written.
  expect(lifted.overview).toEqual(u.overview);
  expect(lifted.steps.map((s) => [s.facts, s.events])).toEqual(u.steps.map((s) => [s.facts, s.events]));
  expect(lifted.references).toEqual(u.references);
  expect(lifted.scene).toEqual(u.scene);
  expect(lifted).not.toHaveProperty('osiLayers');
  expect(l).toMatchObject({ slug: input.slug, title: input.title, subtitle: input.subtitle, summary: input.summary });
  expect(JSON.stringify(l)).not.toContain('backing');
});

test('an empty osiLayers lifts to spans', () => {
  const spans = liftedFixture(makeLesson({ units: [makeUnit('neighbors', { osiLayers: [] })] }));
  expect(spans.units[0]!.osi).toBe('spans');
  const seven = liftedFixture(makeLesson({ units: [makeUnit('neighbors', { osiLayers: [7] })] }));
  expect(seven.units[0]!.osi).toEqual({ layers: [7], cite: [] });
});

test('only listed slugs may use the legacy path', () => {
  expect(() => defineLegacyLesson({ ...makeLesson(), slug: 'osi-model' })).toThrow(/osi-model.*not on the legacy list/);
});

test('a legacy lesson lifts with no overrides', () => {
  expect(liftedFixture().overrides).toEqual([]);
  expect(legacyLessonSchema.safeParse({ ...makeLesson(), overrides: [] }).success).toBe(false);
});

test('the list is checked before anything else', () => {
  // A lesson off the list is refused for that alone, however broken it is.
  let caught: unknown;
  try {
    defineLegacyLesson({ ...makeLesson(), slug: 'osi-model', units: [] });
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeInstanceOf(LessonValidationError);
  const issues = (caught as LessonValidationError).issues;
  expect(issues).toHaveLength(1);
  expect(issues[0]).toMatch(/osi-model.*not on the legacy list/);
});

test.skipIf(LISTED === undefined)('a listed lesson is still checked in full', () => {
  const broken = () => defineLegacyLesson({ ...makeLesson(), slug: LISTED!, units: [] });
  expect(broken).toThrow(LessonValidationError);
  expect(broken).toThrow(/units/);
});
