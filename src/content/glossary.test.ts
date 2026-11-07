import { expect, test } from 'vitest';
import { defineGlossary, GLOSSARY, type GlossaryEntryInput } from './glossary';
import { cite } from './sources';
import { FIXTURE_SOURCES, OBJ_URL } from './test-fixtures';

/** A valid entry: one statement, cited at RFC 9999 §2.1. */
const lease = (over: Partial<GlossaryEntryInput> = {}): GlossaryEntryInput => ({
  id: 'lease',
  term: 'Lease',
  definition: [{ id: 'd1', text: 'An address lent to a device for a set time.', cite: [cite('rfc-example', '2.1', { sources: FIXTURE_SOURCES })] }],
  ...over,
});
/** An analogy statement: it may leave out its citation list, which parses to empty. */
const analogy = { id: 'd2', text: 'Like borrowing a book.', analogy: true as const };

test('a cited entry is valid and comes back as written', () => {
  expect(defineGlossary([lease()], FIXTURE_SOURCES)).toEqual([lease()]);
});

test('a definition needs a cited statement', () => {
  expect(() =>
    defineGlossary([{ id: 'lease', term: 'Lease', definition: [{ id: 'd1', text: 'Like borrowing a book.', cite: [], analogy: true }] }], FIXTURE_SOURCES),
  ).toThrow(/entry "lease": the definition needs at least one cited statement; an analogy alone cannot define a term\./);
});

test('an analogy may help a cited definition, and comes back with an empty citation list', () => {
  const [entry] = defineGlossary([lease({ definition: [...lease().definition, analogy] })], FIXTURE_SOURCES);
  expect(entry!.definition[1]).toEqual({ ...analogy, cite: [] });
});

test('every statement is cited or flagged as an analogy, never both', () => {
  const none = lease({ definition: [...lease().definition, { id: 'd2', text: 'It ends unless renewed.', cite: [] }] });
  expect(() => defineGlossary([none], FIXTURE_SOURCES)).toThrow(
    /entry "lease": definition\[1\] \("d2"\): no citation; cite a source or flag it as an analogy\./,
  );
  const both = lease({ definition: [{ ...lease().definition[0]!, analogy: true }] });
  expect(() => defineGlossary([both], FIXTURE_SOURCES)).toThrow(/entry "lease": definition\[0\] \("d1"\): both cited and flagged as an analogy/);
});

test('ids are unique', () => {
  expect(() => defineGlossary([lease(), lease({ term: 'Address lease' })], FIXTURE_SOURCES)).toThrow(
    /Duplicate glossary id "lease"; give each entry its own id\./,
  );
});

test('terms are unique ignoring case', () => {
  expect(() => defineGlossary([lease(), lease({ id: 'lease-2', term: 'lease' })], FIXTURE_SOURCES)).toThrow(
    /entry "lease-2" defines "lease", which entry "lease" already defines as "Lease"; terms are unique ignoring case, so keep one entry per term\./,
  );
});

test('every citation is checked: content only, and as the registry builds it', () => {
  const objectives = lease({ definition: [{ id: 'd1', text: 'Exam objective 2.6.', cite: [cite('example-objectives', '2.6', { sources: FIXTURE_SOURCES, url: OBJ_URL })] }] });
  expect(() => defineGlossary([objectives], FIXTURE_SOURCES)).toThrow(/entry "lease": definition\[0\] \("d1"\), citation 1: .*objective mapping/);
  const edited = lease();
  edited.definition[0]!.cite![0]!.label = 'RFC 1 §1';
  expect(() => defineGlossary([edited], FIXTURE_SOURCES)).toThrow(/citation 1: .*label should be "RFC 9999 §2\.1", not "RFC 1 §1"/);
  const unknown = lease();
  unknown.definition[0]!.cite![0]!.source = 'nowhere';
  expect(() => defineGlossary([unknown], FIXTURE_SOURCES)).toThrow(
    'entry "lease": definition[0] ("d1"), citation 1: Unknown source "nowhere" (section 2.1); add it to the source registry, or fix the id.',
  );
});

test('the shape is checked: a bad id, an empty term, no definition, an unknown key', () => {
  const bad: GlossaryEntryInput = Object.assign(lease(), { id: 'Lease', term: ' ', definition: [] }, { note: 'x' });
  let message = '';
  try {
    defineGlossary([bad], FIXTURE_SOURCES);
  } catch (e) {
    message = (e as Error).message;
  }
  expect(message).toMatch(/entry "Lease": id must be lowercase words joined by hyphens/);
  expect(message).toMatch(/entry "Lease": term must not be empty/);
  expect(message).toMatch(/entry "Lease": definition .*1/);
  expect(message).toMatch(/entry "Lease": .*"note"/);
});

test('every problem is reported in one error', () => {
  const uncited = lease({ id: 'renewal', term: 'Renewal', definition: [{ id: 'd1', text: 'Keeping it longer.', cite: [] }] });
  let caught: unknown;
  try {
    defineGlossary([lease(), lease({ id: 'lease-2', term: 'LEASE' }), lease({ term: 'Address lease' }), uncited], FIXTURE_SOURCES);
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeInstanceOf(Error);
  expect((caught as Error).message).toBe(
    [
      'Invalid glossary:',
      '- entry "lease-2" defines "LEASE", which entry "lease" already defines as "Lease"; terms are unique ignoring case, so keep one entry per term.',
      '- Duplicate glossary id "lease"; give each entry its own id.',
      '- entry "renewal": definition[0] ("d1"): no citation; cite a source or flag it as an analogy.',
      '- entry "renewal": the definition needs at least one cited statement; an analogy alone cannot define a term.',
    ].join('\n'),
  );
});

test('the glossary starts empty and valid', () => {
  expect(GLOSSARY).toEqual([]);
});
