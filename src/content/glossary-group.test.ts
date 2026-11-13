import { describe, expect, test } from 'vitest';
import { GLOSSARY_DEFINITION_WORDS, defineGlossaryGroup, glossaryWords, type GlossaryGroupInput } from './glossary-group';
import { defining, makeGroup, makeGroupInput, statement } from './glossary-fixtures';
import { cite } from './sources';
import { FIXTURE_SOURCES, OBJ_URL } from './test-fixtures';

// The rules inside one group (docs/glossary-path-spec.md §2, rules 1 to 10, with E13). Each has a test that breaks it and a
// test that keeps it. The old shape `{ id, term, definition }` with analogy statements is gone with the old define function: its
// tests are rewritten here (cited, two sources, ids, terms, citations, shape, every problem at once) or moved to
// glossary.test.ts (ids and terms unique across groups); the analogy tests are removed, since a glossary statement cannot be an analogy.

type Input = ReturnType<typeof makeGroupInput>;
const refuses = (edit: (i: Input) => void, pattern: RegExp | string) => {
  const input = makeGroupInput();
  edit(input);
  expect(() => defineGlossaryGroup(input, FIXTURE_SOURCES)).toThrow(pattern);
};
const accepts = (edit: (i: Input) => void) => expect(() => makeGroup(edit)).not.toThrow();
const lease = (i: Input) => i.entries[0]!;
const renewal = (i: Input) => i.entries[1]!;
const words = (n: number) => Array.from({ length: n }, (_, k) => `w${k}`).join(' ');

test('a valid group comes back as written, with its citations', () => {
  const g = makeGroup();
  expect(g.id).toBe('pilot');
  expect(g.entries.map((e) => e.id)).toEqual(['lease', 'renewal']);
  expect(g.entries[0]!.definition![0]!.cite![0]!.label).toBe('RFC 9999 §2.1');
});

describe('R1: the shape is strict, ids are slugs', () => {
  test('an unknown key is refused on the group, an entry, a sense, a statement and a tie', () => {
    refuses((i) => Object.assign(i, { note: 'x' }), /Glossary group "pilot" is invalid[\s\S]*"note"/);
    refuses((i) => Object.assign(lease(i), { note: 'x' }), /entry "lease"[\s\S]*"note"/);
    refuses((i) => Object.assign(renewal(i).senses![0]!, { also: ['x'] }), /entry "renewal", sense "dhcp"[\s\S]*"also"/);
    refuses((i) => Object.assign(lease(i).definition![0]!, { analogy: true }), /entry "lease", statement "lease-1"[\s\S]*"analogy"/);
    refuses((i) => Object.assign(lease(i).lessons![0]!, { sense: 'x' }), /entry "lease"[\s\S]*"sense"/);
    refuses((i) => Object.assign(i, { overrides: [] }), /"overrides"/);
  });
  test('ids that are not slugs are refused: entry, sense, statement and group', () => {
    refuses((i) => (lease(i).id = 'ttl_dns'), /id must be lowercase words joined by hyphens/);
    refuses((i) => (renewal(i).senses![0]!.id = 'In-IP'), /sense "In-IP"[\s\S]*lowercase words/);
    refuses((i) => (lease(i).definition![0]!.id = 'S1'), /statement "S1"[\s\S]*lowercase words/);
    refuses((i) => (i.id = 'Pilot'), /Glossary group "Pilot" is invalid[\s\S]*lowercase words/);
  });
  test('slugs like ttl-dns, dns and s-1 are fine', () => {
    accepts((i) => {
      lease(i).id = 'ttl-dns';
      renewal(i).senses![0]!.id = 'dns';
      lease(i).definition![0]!.id = 's-1';
    });
  });
  test('an empty term and a missing definition part are shape problems', () => {
    refuses((i) => (lease(i).term = ' '), /entry "lease": term must not be empty/);
  });
});

describe('R2: exactly one of definition and senses; senses has 2 or more', () => {
  test('both, neither, and one sense are refused', () => {
    refuses((i) => (lease(i).senses = renewal(i).senses), /entry "lease": has both definition and senses/);
    refuses((i) => delete lease(i).definition, /entry "lease": has neither definition nor senses/);
    refuses((i) => (renewal(i).senses = [renewal(i).senses![0]!]), /entry "renewal": senses has 1 item; an entry with senses has at least 2/);
  });
  test('two senses and no definition is fine', () => accepts(() => {}));
});

describe('R3: a definition has 1 to 3 statements', () => {
  test('none, four, and four in one sense are refused', () => {
    refuses((i) => (lease(i).definition = []), /entry "lease": the definition has 0 statements; a definition has 1 to 3/);
    refuses((i) => (lease(i).definition = ['a', 'b', 'c', 'd'].map((k) => statement(`s-${k}`))), /entry "lease": the definition has 4 statements/);
    refuses((i) => (renewal(i).senses![0]!.definition = ['a', 'b', 'c', 'd'].map((k) => statement(`s-${k}`))), /entry "renewal", sense "dhcp": the definition has 4 statements/);
  });
  test('exactly 3 and exactly 1 are fine', () => {
    accepts((i) => (lease(i).definition = ['a', 'b', 'c'].map((k) => statement(`s-${k}`, 'Short.'))));
    accepts((i) => (lease(i).definition = [statement('only')]));
  });
});

describe('R4: every statement cites, by the two-source rule, with citations the registry builds', () => {
  test('an empty cite list is refused (a lesson statement would default it)', () => {
    refuses((i) => (lease(i).definition![0]!.cite = []), /entry "lease", statement "lease-1": no citation/);
    refuses((i) => delete (lease(i).definition![0]! as { cite?: unknown }).cite, /statement "lease-1": no citation/);
  });
  test('one citation not marked defining rests on one source', () => {
    refuses((i) => (lease(i).definition![0]!.cite = [cite('rfc-example', '2.1', { sources: FIXTURE_SOURCES })]), /statement "lease-1": rests on one source/);
  });
  test('two pages of one vendor count once', () => {
    const page = (fragment: string) => cite('vendor-example', fragment, { sources: FIXTURE_SOURCES, url: `https://learn.microsoft.com/example#${fragment}` });
    refuses((i) => (lease(i).definition![0]!.cite = [page('a'), page('b')]), /rests on one source/);
  });
  test('an objectives source is refused for content', () => {
    refuses((i) => (lease(i).definition![0]!.cite = [cite('example-objectives', '2.6', { sources: FIXTURE_SOURCES, url: OBJ_URL })]), /statement "lease-1", citation 1: .*objective mapping/);
  });
  test('a hand-built citation whose label or url differs from cite() is refused', () => {
    refuses((i) => (lease(i).definition![0]!.cite![0]!.label = 'RFC 1 §1'), /citation 1: .*label should be "RFC 9999 §2\.1", not "RFC 1 §1"/);
    refuses((i) => (lease(i).definition![0]!.cite![0]!.url = 'https://www.rfc-editor.org/rfc/rfc9999.html#section-9'), /citation 1: .*URL should be/);
  });
  test('a source not in the registry passed is refused', () => {
    refuses((i) => (lease(i).definition![0]!.cite![0]!.source = 'nowhere'), 'Unknown source "nowhere" (section 2.1); add it to SOURCES in src/content/sources.ts, or fix the id.');
  });
  test('one defining citation, two different sources, and another registry passed in are fine', () => {
    accepts(() => {});
    const two = [cite('rfc-example', '2.1', { sources: FIXTURE_SOURCES }), cite('vendor-example', 'x', { sources: FIXTURE_SOURCES, url: 'https://learn.microsoft.com/example#x' })];
    accepts((i) => (lease(i).definition![0]!.cite = two));
  });
});

describe('R5: a definition is at most 60 words', () => {
  test('the limit is one constant, 60', () => expect(GLOSSARY_DEFINITION_WORDS).toBe(60));
  test('61 words across three statements is refused, naming group, entry and the count', () => {
    refuses((i) => (lease(i).definition = [statement('a', words(30)), statement('b', words(20)), statement('c', words(11))]), /Glossary group "pilot" is invalid:\n- entry "lease": the definition is 61 words; the limit is 60/);
    refuses((i) => (renewal(i).senses![1]!.definition = [statement('x1', words(61))]), /entry "renewal", sense "contracts": the definition is 61 words/);
  });
  test('exactly 60 across three is fine, and two senses of 60 each are not summed', () => {
    accepts((i) => (lease(i).definition = [statement('a', words(30)), statement('b', words(20)), statement('c', words(10))]));
    accepts((i) => {
      renewal(i).senses![0]!.definition = [statement('x1', words(60))];
      renewal(i).senses![1]!.definition = [statement('x2', words(60))];
    });
  });
  test('a word is a run of non-space characters', () => {
    expect(glossaryWords('TCP/IP')).toBe(1);
    expect(glossaryWords('a — b')).toBe(3);
    expect(glossaryWords('  a   b  ')).toBe(2);
    expect(glossaryWords('a\tb\nc')).toBe(3);
    expect(glossaryWords('   ')).toBe(0);
    accepts((i) => (lease(i).definition = [statement('a', `${words(58)} TCP/IP  \n — `)]));
    refuses((i) => (lease(i).definition = [statement('a', `${words(59)} TCP/IP  \n — x`)]), /is 62 words/);
  });
  test('there is no override key', () => refuses((i) => Object.assign(lease(i), { overrides: [{ limit: 'words' }] }), /"overrides"/));
});

describe('R6: text is plain', () => {
  test('** is refused in a term, a spelling, a label and a statement', () => {
    refuses((i) => (lease(i).term = 'Le**ase'), /entry "lease": term: has "\*\*"/);
    refuses((i) => (lease(i).also = ['**x**']), /entry "lease": also\[0\]: has "\*\*"/);
    refuses((i) => (renewal(i).senses![0]!.label = 'In **DHCP**'), /sense "dhcp": label: has "\*\*"/);
    refuses((i) => (lease(i).definition![0]!.text = 'A **bold** word.'), /statement "lease-1": has "\*\*"/);
  });
  test('a single * is fine', () => accepts((i) => (lease(i).definition![0]!.text = 'A * wildcard matches anything.')));
});

describe('R7: labels', () => {
  test('a 7-word label, labels equal ignoring case, and two senses of one id are refused', () => {
    refuses((i) => (renewal(i).senses![0]!.label = 'one two three four five six seven'), /sense "dhcp": the label is 7 words; the limit is 6/);
    refuses((i) => ((renewal(i).senses![0]!.label = 'In IP'), (renewal(i).senses![1]!.label = 'in ip')), /sense "contracts": the label "in ip" is already another sense's label/);
    refuses((i) => (renewal(i).senses![1]!.id = 'dhcp'), /entry "renewal", sense "dhcp": Duplicate sense id "dhcp"/);
  });
  test('a 6-word label is fine, and sense id ip in two different entries is fine', () => {
    accepts((i) => (renewal(i).senses![0]!.label = 'one two three four five six'));
    accepts((i) => {
      renewal(i).senses![0]!.id = 'ip';
      lease(i).definition = undefined;
      lease(i).lessons = undefined;
      lease(i).senses = [
        { id: 'ip', label: 'In IP', definition: [statement('l-ip')] },
        { id: 'dns', label: 'In DNS', definition: [statement('l-dns')] },
      ];
    });
  });
});

describe('R8: statement ids and entry ids are unique in the group', () => {
  test('the same statement id in two entries, or in an entry and a sense, is refused', () => {
    refuses((i) => (renewal(i).senses![0]!.definition[0]!.id = 'lease-1'), /Duplicate statement id "lease-1" in the group/);
    refuses((i) => (lease(i).definition![1]!.id = 'lease-1'), /Duplicate statement id "lease-1"/);
  });
  test('two entries with one id are refused', () => refuses((i) => (renewal(i).id = 'lease'), /Duplicate entry id "lease"/));
  test('the same statement id in two different groups is fine', () => {
    expect(() => makeGroup()).not.toThrow();
    expect(() => makeGroup((i) => (i.id = 'other'))).not.toThrow();
  });
});

describe('R9: spellings', () => {
  test('the term itself, a repeat ignoring case, outer spaces and an empty list are refused', () => {
    refuses((i) => (lease(i).also = ['Lease']), /the spelling "Lease" is the entry's own term/);
    refuses((i) => (lease(i).also = ['Address lease', 'address LEASE']), /the spelling "address LEASE" is listed twice/);
    refuses((i) => (lease(i).also = ['lease']), /own term/);
    refuses((i) => (lease(i).also = ['Lease ']), /own term/);
    refuses((i) => (lease(i).also = []), /entry "lease": also is empty/);
  });
  test('another spelling is fine', () => accepts((i) => (lease(i).also = ['Time to live'])));
});

describe('R10: lessons ties', () => {
  test('an empty list, a pair twice, lessons on an entry with senses, and a non-slug lesson are refused', () => {
    refuses((i) => (lease(i).lessons = []), /entry "lease": lessons is empty/);
    refuses((i) => (lease(i).lessons = [{ lesson: 'cited-lesson', term: 'term-2' }, { lesson: 'cited-lesson', term: 'term-2' }]), /the tie to term "term-2" of lesson "cited-lesson" is listed twice/);
    refuses((i) => (renewal(i).lessons = [{ lesson: 'cited-lesson', term: 'term-3' }]), /entry "renewal": lessons sits on the entry, which has senses/);
    refuses((i) => (lease(i).lessons = [{ lesson: 'What-is-ip', term: 'term-2' }]), /lesson must be lowercase words/);
    refuses((i) => (renewal(i).senses![0]!.lessons = []), /entry "renewal", sense "dhcp": lessons is empty/);
  });
  test('one lesson with two different terms, and lessons on each sense, are fine', () => {
    accepts((i) => (lease(i).lessons = [{ lesson: 'cited-lesson', term: 'term-1' }, { lesson: 'cited-lesson', term: 'term-2' }]));
    accepts((i) => (renewal(i).senses![1]!.lessons = [{ lesson: 'cited-lesson', term: 'term-1' }]));
  });
});

test('every problem is reported in one error, each naming group, entry and part', () => {
  const input = makeGroupInput();
  lease(input).definition = ['a', 'b', 'c', 'd'].map((k) => statement(`s-${k}`, words(20)));
  renewal(input).senses![1]!.label = renewal(input).senses![0]!.label;
  let message = '';
  try {
    defineGlossaryGroup(input, FIXTURE_SOURCES);
  } catch (e) {
    message = (e as Error).message;
  }
  expect(message).toContain('Glossary group "pilot" is invalid:');
  expect(message).toContain('entry "lease": the definition has 4 statements');
  expect(message).toContain('entry "lease": the definition is 80 words');
  expect(message).toContain('entry "renewal", sense "contracts": the label');
});

test('a bad shape names the entry by id, or by place when it has none', () => {
  const input = makeGroupInput() as unknown as { entries: Record<string, unknown>[] };
  delete input.entries[1]!.id;
  expect(() => defineGlossaryGroup(input as unknown as GlossaryGroupInput, FIXTURE_SOURCES)).toThrow(/entry #2: id/);
});

test('defining() builds the citation the registry builds', () => expect(defining('2.1')).toEqual(cite('rfc-example', '2.1', { sources: FIXTURE_SOURCES, defining: true })));
