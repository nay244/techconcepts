import { expect, test, vi } from 'vitest';
import { defineLesson, isDefinedLesson, LessonValidationError, validateLesson, type LessonInput } from './define';
import { checkLimits } from './limits';
import type { Backing } from './schema';
import { cite } from './sources';
import { FIXTURE_LIMITS, FIXTURE_SOURCES, liftedFixture, makeCitedLesson, makeLesson, OBJ_URL } from './test-fixtures';

// The strict path every new lesson takes: the cited shape, the citation and backing rules, and the structural rules.

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has the fixture's places and cues.
vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('./test-fixtures')).FIXTURE_PARTS }));

const issuesOf = (input: unknown): string[] => {
  try {
    validateLesson(input, FIXTURE_SOURCES);
    return [];
  } catch (e) {
    if (e instanceof LessonValidationError) return e.issues;
    throw e;
  }
};
const joined = (input: unknown): string => issuesOf(input).join('\n');

type UnitInput = LessonInput['units'][number];
const u = (l: LessonInput): UnitInput => l.units[0]!;

const NO_BACKING = 'no backing; trace it to a cited Learn statement, or flag it as an analogy or as example data.';
const vendorCite = () =>
  cite('vendor-example', 'Lease renewal', { sources: FIXTURE_SOURCES, url: 'https://learn.microsoft.com/example#lease-renewal' });

// ---------------------------------------------------------------- the fixture

test('the cited fixture is valid, comes back cited, with its sources derived', () => {
  const l = validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
  expect(l.origin).toBe('cited');
  expect(l.units[0]!.references.map((s) => s.label)).toEqual(['RFC 9999: Example Protocol', 'Example vendor: Example page']);
  expect(l.units[0]!.references.map((s) => s.url)).toEqual(['https://www.rfc-editor.org/rfc/rfc9999.html', 'https://learn.microsoft.com/example']);
});

test('the cited fixture fits Networking’s limits', () => {
  expect(checkLimits(validateLesson(makeCitedLesson(), FIXTURE_SOURCES), FIXTURE_LIMITS)).toEqual([]);
});

test('every call gives a fresh copy of the cited fixture', () => {
  const a = makeCitedLesson();
  u(a).learn.lead[0]!.text = 'changed';
  expect(u(makeCitedLesson()).learn.lead[0]!.text).not.toBe('changed');
});

// ---------------------------------------------------------------- the rules, one fault at a time

const REJECTED: [string, (l: LessonInput) => void, RegExp][] = [
  [
    'a Learn statement with no citation and no analogy flag',
    (l) => { u(l).learn.lead[0]!.cite = []; },
    /units\[0\]\.learn\.lead\[0\] \("lead-1"\): no citation; cite a source or flag it as an analogy/,
  ],
  [
    'a statement both cited and flagged',
    (l) => { u(l).learn.lead[0]!.analogy = true; },
    /units\[0\]\.learn\.lead\[0\] \("lead-1"\): both cited and flagged as an analogy/,
  ],
  [
    'a Go-deeper paragraph with no citation',
    (l) => { u(l).steps[0]!.deep[0]!.cite = []; },
    /units\[0\]\.steps\[0\]\.deep\[0\] \(step "request", Go deeper\): no citation/,
  ],
  [
    'a Practice option with no citation',
    (l) => { u(l).practice[0]!.options[1]!.cite = []; },
    /units\[0\]\.practice\[0\]\.options\[1\] \(question "q1"\): no citation/,
  ],
  [
    'an OSI layer with no citation',
    (l) => { u(l).osi = { layers: [7], cite: [] }; },
    /units\[0\]\.osi: the OSI layers \(7\) have no citation/,
  ],
  ['a step with no backing', (l) => { delete u(l).steps[0]!.backing; }, /units\[0\]\.steps\[0\] \(step "request"\): no backing; trace/],
  [
    'an event with no backing',
    (l) => { delete u(l).steps[0]!.events[0]!.backing; },
    /units\[0\]\.steps\[0\]\.events\[0\] \(event "m1"\): no backing; trace/,
  ],
  [
    'an Overview fact with no backing',
    (l) => { delete u(l).overview.facts[0]!.backing; },
    /units\[0\]\.overview\.facts\[0\] \(Overview fact "Example address"\): no backing/,
  ],
  [
    'a trace to an analogy',
    (l) => {
      u(l).learn.terms[0] = { ...u(l).learn.terms[0]!, cite: [], analogy: true };
      u(l).steps[0]!.backing = { traces: ['term-1'] };
    },
    /units\[0\]\.steps\[0\] \(step "request"\): traces "term-1", which is an analogy/,
  ],
  [
    'a trace to an unknown id',
    (l) => { u(l).steps[0]!.backing = { traces: ['nowhere'] }; },
    /units\[0\]\.steps\[0\] \(step "request"\): traces "nowhere", which is not a Learn lead or why statement/,
  ],
  [
    'a duplicate statement id',
    (l) => { u(l).learn.why[0]!.id = 'lead-1'; },
    /units\[0\]\.learn: Duplicate Learn id "lead-1" \(lead\[0\] and why\[0\]\)/,
  ],
  [
    'written references',
    (l) => { u(l).references = [{ label: 'X: Y', url: 'https://www.rfc-editor.org/' }]; },
    /units\[0\]\.references: references come from citations/,
  ],
  ['two units', (l) => { l.units.push(structuredClone(u(l))); }, /exactly one unit; this one has 2/],
  ['a "lesson 3" pointer', (l) => { u(l).learn.why[0]!.text = 'More in lesson 3.'; }, /units\[0\]\.learn\.why\[0\]\.text: says "lesson 3"/],
  [
    'an objectives document cited in content',
    (l) => { u(l).learn.facts[0]!.cite = [cite('example-objectives', '2.6', { sources: FIXTURE_SOURCES, url: OBJ_URL })]; },
    /units\[0\]\.learn\.facts\[0\] \("fact-1"\), citation 1: .*objective mapping/,
  ],
  [
    'a hand-edited citation label',
    (l) => { u(l).learn.facts[0]!.cite![0]!.label = 'RFC 1 §1'; },
    /units\[0\]\.learn\.facts\[0\] \("fact-1"\), citation 1: .*label should be "RFC 9999 §2\.2", not "RFC 1 §1"/,
  ],
];

test.each(REJECTED)('rejects %s', (_, change, message) => {
  const l = makeCitedLesson();
  change(l);
  expect(joined(l)).toMatch(message);
});

test('every problem is reported at once', () => {
  const l = makeCitedLesson();
  u(l).practice[1]!.options[1]!.cite = [];
  delete u(l).steps[3]!.events[0]!.backing;
  u(l).overview.description = 'More in lesson 3.';
  let caught: unknown;
  try {
    validateLesson(l, FIXTURE_SOURCES);
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeInstanceOf(LessonValidationError);
  const err = caught as LessonValidationError;
  expect(err.issues).toEqual([
    'units[0].practice[1].options[1] (question "q2"): no citation; cite a source at the section it comes from.',
    `units[0].steps[3].events[0] (event "m3"): ${NO_BACKING}`,
    'units[0].overview.description: says "lesson 3"; a lesson\'s number differs from track to track, so name the lesson instead.',
  ]);
  expect(err.message).toContain('"cited-lesson"');
  for (const issue of err.issues) expect(err.message).toContain(issue);
});

// ---------------------------------------------------------------- rule 1: one unit

test('a cited lesson has exactly one unit', () => {
  const l = makeCitedLesson();
  l.units.push({ ...structuredClone(u(l)), id: 'renewals' });
  expect(issuesOf(l)).toContain('A cited lesson has exactly one unit; this one has 2. Make each unit a lesson of its own.');
});

// ---------------------------------------------------------------- rule 2: references come from citations

test('the derived references replace an empty written list', () => {
  const l = makeCitedLesson();
  u(l).references = [];
  expect(validateLesson(l, FIXTURE_SOURCES).units[0]!.references).toEqual([
    { label: 'RFC 9999: Example Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9999.html' },
    { label: 'Example vendor: Example page', url: 'https://learn.microsoft.com/example' },
  ]);
});

test('the references follow reading order: OSI, then the Watch steps’ Go deeper, before Learn', () => {
  const l = makeCitedLesson();
  u(l).osi = 'spans';
  u(l).steps[0]!.deep[0]!.cite = [vendorCite()];
  expect(validateLesson(l, FIXTURE_SOURCES).units[0]!.references.map((s) => s.label)).toEqual([
    'Example vendor: Example page',
    'RFC 9999: Example Protocol',
  ]);
});

test('written references are rejected with what to do instead', () => {
  const l = makeCitedLesson();
  u(l).references = [{ label: 'RFC 9999: Example Protocol', url: 'https://www.rfc-editor.org/rfc/rfc9999.html' }];
  expect(issuesOf(l)).toEqual([
    "units[0].references: references come from citations; leave the list out, and the unit's sources are listed from what it cites.",
  ]);
});

// ---------------------------------------------------------------- rule 3: what cites

const CITED_FIELDS: [string, (l: LessonInput) => void, string, 'statement' | 'cited'][] = [
  ['a lead statement', (l) => { u(l).learn.lead[1]!.cite = []; }, 'units[0].learn.lead[1] ("lead-2")', 'statement'],
  ['a term', (l) => { u(l).learn.terms[1]!.cite = []; }, 'units[0].learn.terms[1] ("term-2")', 'statement'],
  ['the pattern', (l) => { u(l).learn.pattern.cite = []; }, 'units[0].learn.pattern ("pattern")', 'cited'],
  ['a why statement', (l) => { u(l).learn.why[0]!.cite = []; }, 'units[0].learn.why[0] ("why-1")', 'statement'],
  ['Learn’s Go deeper', (l) => { u(l).learn.deep[0]!.cite = []; }, 'units[0].learn.deep[0] ("deep-1", Learn\'s Go deeper)', 'cited'],
  ['a Learn fact', (l) => { u(l).learn.facts[1]!.cite = []; }, 'units[0].learn.facts[1] ("fact-2")', 'cited'],
  ['a step’s Go deeper', (l) => { u(l).steps[2]!.deep[0]!.cite = []; }, 'units[0].steps[2].deep[0] (step "lookup", Go deeper)', 'cited'],
  ['a Practice option', (l) => { u(l).practice[1]!.options[0]!.cite = []; }, 'units[0].practice[1].options[0] (question "q2")', 'cited'],
];

test.each(CITED_FIELDS)('%s with no citation is rejected, naming its place', (_, change, where, kind) => {
  const l = makeCitedLesson();
  change(l);
  const fix = kind === 'statement' ? 'cite a source or flag it as an analogy.' : 'cite a source at the section it comes from.';
  expect(issuesOf(l)).toContain(`${where}: no citation; ${fix}`);
});

test('a citation list left out counts as no citation', () => {
  const l = makeCitedLesson();
  delete u(l).learn.facts[1]!.cite;
  expect(issuesOf(l)).toContain('units[0].learn.facts[1] ("fact-2"): no citation; cite a source at the section it comes from.');
});

test('a lead or why statement, or a term, may be an analogy instead, with no citation', () => {
  const l = makeCitedLesson();
  u(l).learn.lead.push({ id: 'lead-3', text: 'It is a little like borrowing a library book.', analogy: true });
  u(l).learn.why.push({ id: 'why-2', text: 'Like a book back on the shelf, an address nobody renews can be lent again.', analogy: true });
  u(l).learn.terms.push({ id: 'term-4', idea: 'A library loan', name: 'Lease', analogy: true });
  const lesson = validateLesson(l, FIXTURE_SOURCES);
  expect(lesson.units[0]!.learn.why[1]).toEqual({ id: 'why-2', text: expect.any(String), cite: [], analogy: true });
});

test('the pattern, Learn facts, Go deeper and Practice options cannot be flagged as analogies', () => {
  const l = makeCitedLesson();
  Object.assign(u(l).learn.pattern, { analogy: true });
  Object.assign(u(l).learn.facts[0]!, { analogy: true });
  Object.assign(u(l).steps[0]!.deep[0]!, { analogy: true });
  Object.assign(u(l).practice[0]!.options[0]!, { analogy: true });
  expect(issuesOf(l).sort()).toEqual([
    'units[0].learn.facts[0]: Unrecognized key: "analogy"',
    'units[0].learn.pattern: Unrecognized key: "analogy"',
    'units[0].practice[0].options[0]: Unrecognized key: "analogy"',
    'units[0].steps[0].deep[0]: Unrecognized key: "analogy"',
  ]);
});

// ---------------------------------------------------------------- rule 4: the OSI badge

test('an OSI badge that spans layers needs no citation', () => {
  const l = makeCitedLesson();
  u(l).osi = 'spans';
  expect(issuesOf(l)).toEqual([]);
});

test('OSI layers with no citation are rejected with what to do', () => {
  const l = makeCitedLesson();
  u(l).osi = { layers: [2, 3] };
  expect(issuesOf(l)).toEqual([
    "units[0].osi: the OSI layers (2, 3) have no citation; cite a source that puts the unit at these layers, or make it 'spans'.",
  ]);
});

// ---------------------------------------------------------------- rule 5: backing

/** One place of each kind that needs a backing, by its name in the issue, and how to set its backing. */
const BACKED_PLACES: [string, (l: LessonInput, b: Backing | undefined) => void][] = [
  ["backing (the lesson's subtitle and summary)", (l, b) => { l.backing = b; }],
  ["units[0].backing (the unit's full name and purpose)", (l, b) => { u(l).backing = b; }],
  ['units[0].scene.backing (the scene)', (l, b) => { u(l).scene.backing = b; }],
  ['units[0].scene.packets.p1 (packet "p1")', (l, b) => { u(l).scene.packets!.p1!.backing = b; }],
  ['units[0].overview.hookBacking (the Overview hook)', (l, b) => { u(l).overview.hookBacking = b; }],
  ['units[0].overview.backing (the Overview description)', (l, b) => { u(l).overview.backing = b; }],
  ['units[0].overview.facts[1] (Overview fact "Lease time")', (l, b) => { u(l).overview.facts[1]!.backing = b; }],
  ['units[0].steps[1] (step "grant")', (l, b) => { u(l).steps[1]!.backing = b; }],
  ['units[0].steps[1].facts[0] (step "grant", fact "Address")', (l, b) => { u(l).steps[1]!.facts[0]!.backing = b; }],
  ['units[0].steps[1].events[0] (event "m2")', (l, b) => { u(l).steps[1]!.events[0]!.backing = b; }],
  ['units[0].steps[1].events[1] (event "t-add")', (l, b) => { u(l).steps[1]!.events[1]!.backing = b; }],
  ['units[0].steps[2].events[1] (event "n1")', (l, b) => { u(l).steps[2]!.events[1]!.backing = b; }],
];

test.each(BACKED_PLACES)('%s needs a backing', (where, set) => {
  const l = makeCitedLesson();
  set(l, undefined);
  expect(issuesOf(l)).toEqual([`${where}: ${NO_BACKING}`]);
});

test.each<[string, Backing]>([
  ['traces to a cited Learn statement', { traces: ['lead-1'] }],
  ['flags an analogy', { analogy: true }],
  ['flags example data', { example: true }],
])('a backing that %s is accepted in every kind of place', (_, backing) => {
  const l = makeCitedLesson();
  for (const [, set] of BACKED_PLACES) set(l, structuredClone(backing));
  expect(issuesOf(l)).toEqual([]);
});

// ---------------------------------------------------------------- rule 6: traces

test('every kind of Learn id is a trace target: statements, terms, the pattern, Go-deeper paragraphs and facts', () => {
  const l = makeCitedLesson();
  u(l).steps[0]!.backing = { traces: ['lead-2', 'term-2', 'pattern', 'why-1', 'deep-1', 'fact-3'] };
  expect(issuesOf(l)).toEqual([]);
});

test('a trace to a Learn part with no citation is rejected', () => {
  const l = makeCitedLesson();
  u(l).learn.facts[0]!.cite = [];
  expect(issuesOf(l)).toContain(
    'units[0].overview.facts[1] (Overview fact "Lease time"): traces "fact-1", which has no citation; cite it, or trace a cited Learn statement instead.',
  );
});

test('a trace to an id this lesson does not have is rejected, such as another lesson’s', () => {
  // The legacy fixture's lead statement: a real Learn id, of another lesson.
  const other = liftedFixture().units[0]!.learn.lead[0]!.id;
  const l = makeCitedLesson();
  l.backing = { traces: ['lead-1', other] };
  expect(issuesOf(l)).toEqual([
    `backing (the lesson's subtitle and summary): traces "${other}", which is not a Learn lead or why statement, term, pattern, fact or Go-deeper paragraph of this lesson; trace one of those by its id.`,
  ]);
});

test('a trace to an analogy says what to do', () => {
  const l = makeCitedLesson();
  u(l).learn.why[0] = { id: 'why-1', text: 'Like a library book, an address is lent to one borrower at a time.', analogy: true };
  expect(issuesOf(l)).toContain(
    'units[0].steps[2] (step "lookup"): traces "why-1", which is an analogy; trace a cited Learn statement instead, or flag this as an analogy too.',
  );
});

test('Learn ids are unique across statements, terms, the pattern, Go deeper and facts', () => {
  const l = makeCitedLesson();
  // Nothing traces term-2 or deep-1, so renaming them breaks no trace.
  u(l).learn.terms[1]!.id = 'pattern';
  u(l).learn.deep[0]!.id = 'lead-2';
  expect(issuesOf(l)).toEqual([
    'units[0].learn: Duplicate Learn id "pattern" (terms[1] and pattern); give each its own id.',
    'units[0].learn: Duplicate Learn id "lead-2" (lead[1] and deep[0]); give each its own id.',
  ]);
});

// ---------------------------------------------------------------- rule 7: every citation is sound

test('a citation to a source the registry does not have is rejected, naming its place', () => {
  const l = makeCitedLesson();
  u(l).learn.facts[0]!.cite = [{ source: 'nowhere', section: '1', url: 'https://www.rfc-editor.org/rfc/rfc1.html#section-1', label: 'RFC 1 §1' }];
  expect(issuesOf(l)).toEqual([
    'units[0].learn.facts[0] ("fact-1"), citation 1: Unknown source "nowhere" (section 1); add it to the source registry, or fix the id.',
  ]);
});

test('a citation of the whole document, not its section, is rejected', () => {
  const l = makeCitedLesson();
  u(l).learn.facts[1]!.cite = [{ source: 'vendor-example', section: 'Overview', url: 'https://learn.microsoft.com/example', label: 'Example vendor, Overview' }];
  expect(joined(l)).toMatch(/units\[0\]\.learn\.facts\[1\] \("fact-2"\), citation 1: .*must point at the section, not the whole document/);
});

test('citations are checked everywhere they sit: the OSI badge, Go deeper and Practice', () => {
  const l = makeCitedLesson();
  const osi = u(l).osi;
  if (osi === 'spans') throw new Error('the fixture cites its OSI layer');
  osi.cite![0]!.label = 'RFC 9999 §9';
  u(l).steps[3]!.deep[0]!.cite![0]!.source = 'rfc-example';
  u(l).practice[0]!.options[2]!.cite![0]!.section = '2.4';
  const text = joined(l);
  expect(text).toMatch(/units\[0\]\.osi, citation 1: .*label should be "RFC 9999 §1\.2", not "RFC 9999 §9"/);
  expect(text).toMatch(/units\[0\]\.steps\[3\]\.deep\[0\] \(step "renew", Go deeper\), citation 1: .*is outside the document/);
  expect(text).toMatch(/units\[0\]\.practice\[0\]\.options\[2\] \(question "q1"\), citation 1: .*URL should be .*#section-2\.4/);
});

// ---------------------------------------------------------------- rule 8: no lesson numbers

test('a lesson number is rejected wherever it sits; "lessons" with no number is fine', () => {
  const l = makeCitedLesson();
  u(l).overview.description = 'Lessons 2 and 3 come back to this.';
  u(l).steps[0]!.narrative = 'Later lessons build on this step.';
  expect(issuesOf(l)).toEqual([
    'units[0].overview.description: says "Lessons 2"; a lesson\'s number differs from track to track, so name the lesson instead.',
  ]);
});

// ---------------------------------------------------------------- rule 9: the structural rules

test('the structural rules every lesson keeps still apply', () => {
  const l = makeCitedLesson();
  l.certTags = [];
  const m1 = u(l).steps[0]!.events[0]!;
  if (m1.type === 'message') m1.from = 'mars';
  const text = joined(l);
  expect(text).toMatch(/at least 1 cert tag/);
  expect(text).toMatch(/message "m1" is sent from "mars", which the dhcp figure does not have/);
});

// ---------------------------------------------------------------- shape, and the entry point

test('a lesson in the legacy shape is rejected by the strict path, on its shape alone', () => {
  const issues = issuesOf(makeLesson());
  expect(issues.join('\n')).toMatch(/units\[0\]: Unrecognized key: "osiLayers"/);
  expect(issues.every((issue) => !/no citation|no backing/.test(issue))).toBe(true);
});

test('defineLesson returns the validated lesson', () => {
  expect(defineLesson(makeCitedLesson(), FIXTURE_SOURCES)).toEqual(validateLesson(makeCitedLesson(), FIXTURE_SOURCES));
});

test('the strict path’s lesson is a defined lesson, which the registry accepts; a copy of it is not', () => {
  const l = defineLesson(makeCitedLesson(), FIXTURE_SOURCES);
  expect(isDefinedLesson(l)).toBe(true);
  expect(isDefinedLesson(validateLesson(makeCitedLesson(), FIXTURE_SOURCES))).toBe(true);
  expect(isDefinedLesson({ ...l })).toBe(false);
});

test('defineLesson throws LessonValidationError naming the lesson', () => {
  const l = makeCitedLesson();
  delete u(l).steps[0]!.backing;
  expect(() => defineLesson(l, FIXTURE_SOURCES)).toThrow(LessonValidationError);
  expect(() => defineLesson(l, FIXTURE_SOURCES)).toThrow(/Lesson "cited-lesson" is invalid/);
});

test('without a registry, a lesson is checked against the real one, which has none of the fixture’s sources yet', () => {
  expect(() => defineLesson(makeCitedLesson())).toThrow(/Unknown source "rfc-example"/);
});
