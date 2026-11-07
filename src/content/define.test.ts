import { afterEach, expect, test, vi } from 'vitest';
import { defineLesson, defineTrack, LessonValidationError, validateLesson } from './define';
import type { LessonInput } from './schema';
import { makeLesson, makeTwoUnitLesson, makeUnit, type UnitInput } from './test-fixtures';

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has
// places, a flag cue and a text cue, layers, and a board on `subnet` only.
vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('./test-fixtures')).FIXTURE_PARTS }));

const issuesOf = (input: unknown): string[] => {
  try {
    validateLesson(input);
    return [];
  } catch (e) {
    if (e instanceof LessonValidationError) return e.issues;
    throw e;
  }
};
const joined = (input: unknown): string => issuesOf(input).join('\n');

afterEach(() => {
  vi.restoreAllMocks();
});

// Shorthand for reaching into the first unit and its events.
const unit = (l: LessonInput, i = 0): UnitInput => l.units[i]!;
const ev = (l: LessonInput, step: number, i: number): any => unit(l).steps[step]!.events[i];
const words = (n: number) => 'word '.repeat(n).trim();

/** The fixture with a rules panel, as Firewalls has: a rule list and the connections it remembers. */
function withRulesPanel(): LessonInput {
  const l = makeLesson();
  const columns = [
    { key: 'n', label: '#' },
    { key: 'action', label: 'Action' },
  ];
  unit(l).scene.panel = {
    type: 'rules',
    rules: { id: 'rules', title: 'Rules', columns, keyColumn: 'n', initialRows: [{ n: '1', action: 'ALLOW' }], empty: 'No rules.' },
    conns: { id: 'conns', title: 'Connections it remembers', columns: [{ key: 'who', label: 'Who' }], keyColumn: 'who', initialRows: [], empty: 'None yet.' },
  };
  // The fixture's table events name table `t`, which a rules panel does not have.
  for (const step of unit(l).steps) step.events = step.events.filter((e) => e.type !== 'table');
  return l;
}

// ---------------------------------------------------------------- the fixtures

test('a valid one-unit lesson passes and comes back unchanged', () => {
  const input = makeLesson();
  const { lesson } = validateLesson(input);
  expect(lesson).toEqual(input);
});

test('the two-unit fixture is valid, and every call gives a fresh copy', () => {
  expect(issuesOf(makeTwoUnitLesson())).toEqual([]);
  const a = makeLesson();
  unit(a).steps[0]!.title = 'changed';
  unit(a).practice[0]!.options.push({ text: 'extra', feedback: 'extra' });
  const b = makeLesson();
  expect(unit(b).steps[0]!.title).not.toBe('changed');
  expect(unit(b).practice[0]!.options).toHaveLength(3);
});

test('layers and labels default to empty', () => {
  const input = makeLesson();
  delete (unit(input).scene as any).layers;
  delete (unit(input).scene as any).labels;
  const { lesson } = validateLesson(input);
  expect(lesson.units[0]!.scene.layers).toEqual([]);
  expect(lesson.units[0]!.scene.labels).toEqual({});
});

// ---------------------------------------------------------------- shape

test('a lesson with Try, check or recap fields is rejected as a shape error', () => {
  const lesson = makeLesson() as any;
  lesson.tryIt = { mode: 'free', prompt: 'Try it.', explanation: 'It works.' };
  lesson.check = [];
  lesson.recap = { takeaways: ['one', 'two', 'three'] };
  const issues = issuesOf(lesson);
  for (const key of ['tryIt', 'check', 'recap']) expect(issues.join('\n')).toMatch(new RegExp(`Unrecognized key.*"${key}"`));

  const inUnit = makeLesson() as any;
  inUnit.units[0].check = [];
  expect(issuesOf(inUnit)).toContainEqual(expect.stringMatching(/^units\[0\]: .*Unrecognized key.*"check"/));
});

test('an unknown key anywhere is named with its path', () => {
  const step = makeLesson() as any;
  step.units[0].steps[0].subtitle = 'typo';
  expect(issuesOf(step)).toContainEqual(expect.stringMatching(/^units\[0\]\.steps\[0\]: .*Unrecognized key.*"subtitle"/));
  const event = makeLesson();
  ev(event, 0, 0).outcom = 'dropped';
  expect(issuesOf(event)).toContainEqual(expect.stringMatching(/^units\[0\]\.steps\[0\]\.events\[0\]: .*"outcom"/));
});

test('rejects input that is not an object, and names every shape problem', () => {
  expect(issuesOf(null).length).toBeGreaterThan(0);
  const l = makeLesson() as any;
  delete l.summary;
  l.level = 'expert';
  l.figure = 'teapot';
  const text = joined(l);
  for (const field of ['summary', 'level', 'figure']) expect(text).toMatch(new RegExp(field));
});

test('text fields must hold more than whitespace, and sources must be https', () => {
  const blank = makeLesson();
  unit(blank).steps[0]!.deep = '   ';
  expect(joined(blank)).toMatch(/steps\[0\]\.deep: must not be empty/);
  const http = makeLesson();
  unit(http).references[0]!.url = 'http://www.rfc-editor.org/rfc/rfc826';
  expect(joined(http)).toMatch(/references/);
});

test('rejects an unknown cert tag, a bad slug and a unit id that is not a slug', () => {
  const tag = makeLesson();
  (tag.certTags as string[]).push('mcse');
  expect(joined(tag)).toMatch(/certTags/);
  expect(joined(makeLesson({ slug: 'Not A Slug' }))).toMatch(/slug/);
  expect(joined(makeLesson({ units: [makeUnit('Not a slug')] }))).toMatch(/units\[0\]\.id/);
});

test('views are network, or network and sequence', () => {
  const l = makeLesson();
  (unit(l).scene as any).views = ['sequence'];
  expect(joined(l)).toMatch(/views/);
});

test('a message is dropped at 0.1 to 0.9 of the way', () => {
  const l = makeLesson();
  ev(l, 3, 0).dropAt = 0.95;
  expect(joined(l)).toMatch(/dropAt/);
});

test('a board prefix is a whole number from 0 to 32, or null', () => {
  const at = (prefix: unknown) => {
    const l = makeLesson({ figure: 'subnet' });
    ev(l, 2, 1).board = { addr: '192.168.1.10', who: 'Laptop', prefix };
    return issuesOf(l);
  };
  expect(at(null)).toEqual([]);
  expect(at(32)).toEqual([]);
  expect(at(33).join()).toMatch(/prefix/);
  expect(at(24.5).join()).toMatch(/prefix/);
});

// ---------------------------------------------------------------- every issue at once

test('reports every broken rule together', () => {
  const l = makeLesson();
  unit(l).steps = unit(l).steps.slice(0, 3);
  ev(l, 0, 0).from = 'mars';
  ev(l, 0, 0).cues = [{ cue: 'status' }];
  ev(l, 1, 0).log.colour = 'blue';
  let caught: unknown;
  try {
    validateLesson(l);
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeInstanceOf(LessonValidationError);
  const err = caught as LessonValidationError;
  expect(err.issues).toHaveLength(4);
  expect(err.issues[0]).toMatch(/4–6 steps/);
  expect(err.issues.join('\n')).toMatch(/"mars"/);
  expect(err.issues.join('\n')).toMatch(/cue "status" needs an arg/);
  expect(err.issues.join('\n')).toMatch(/"colour"/);
  expect(err.message).toContain(l.slug);
  for (const issue of err.issues) expect(err.message).toContain(issue);
});

// ---------------------------------------------------------------- limits

test('a unit needs 4–6 steps', () => {
  const four = makeLesson();
  unit(four).steps = unit(four).steps.slice(0, 4);
  expect(issuesOf(four)).toEqual([]);
  const seven = makeLesson();
  const extra = (n: number) => ({ ...structuredClone(unit(seven).steps[4]!), id: `extra${n}`, events: [] });
  unit(seven).steps.push(extra(6));
  expect(issuesOf(seven)).toEqual([]);
  unit(seven).steps.push(extra(7));
  expect(joined(seven)).toMatch(/4–6 steps; this one has 7/);
});

test('a step needs 2–4 facts', () => {
  const few = makeLesson();
  unit(few).steps[0]!.facts = [{ label: 'One', value: '1' }];
  expect(joined(few)).toMatch(/Step "hello" needs 2–4 facts/);
  const many = makeLesson();
  unit(many).steps[0]!.facts = Array.from({ length: 5 }, (_, i) => ({ label: `F${i}`, value: `${i}` }));
  expect(joined(many)).toMatch(/2–4 facts/);
});

test('narratives stop at 120 words and the hook at 80, ** markers aside', () => {
  const ok = makeLesson();
  unit(ok).steps[0]!.narrative = `**${words(120)}**`;
  unit(ok).overview.hook = words(80);
  expect(issuesOf(ok)).toEqual([]);
  const long = makeLesson();
  unit(long).steps[0]!.narrative = words(121);
  unit(long).overview.hook = words(81);
  expect(joined(long)).toMatch(/121 words; the limit is 120/);
  expect(joined(long)).toMatch(/81 words; the limit is 80/);
});

test('a one-unit lesson has 2–3 Practice questions', () => {
  const one = makeLesson();
  unit(one).practice = unit(one).practice.slice(0, 1);
  expect(joined(one)).toMatch(/2–3 questions/);
  const three = makeLesson();
  unit(three).practice.push({ ...structuredClone(unit(three).practice[0]!), id: 'q3' });
  expect(issuesOf(three)).toEqual([]);
  unit(three).practice.push({ ...structuredClone(unit(three).practice[0]!), id: 'q4' });
  expect(joined(three)).toMatch(/2–3 questions/);
});

test('a question has 2–4 options and an answer that points at one', () => {
  const few = makeLesson();
  unit(few).practice[1]!.options = unit(few).practice[1]!.options.slice(0, 1);
  expect(joined(few)).toMatch(/Question "q2" needs 2–4 options/);
  const many = makeLesson();
  const option = unit(many).practice[0]!.options[0]!;
  unit(many).practice[0]!.options = [option, option, option, option, option];
  expect(joined(many)).toMatch(/2–4 options/);
  for (const answer of [3, -1]) {
    const l = makeLesson();
    unit(l).practice[0]!.answer = answer;
    expect(joined(l)).toMatch(/Question "q1" has answer/);
  }
  const frac = makeLesson();
  unit(frac).practice[0]!.answer = 0.5;
  expect(joined(frac)).toMatch(/answer/);
});

test('Learn has 3–10 terms and 2–6 pattern names', () => {
  const few = makeLesson();
  unit(few).learn.terms = unit(few).learn.terms.slice(0, 2);
  unit(few).learn.pattern.names = ['Only one'];
  expect(joined(few)).toMatch(/3–10 terms/);
  expect(joined(few)).toMatch(/2–6 names/);
  const many = makeLesson();
  const term = unit(many).learn.terms[0]!;
  unit(many).learn.terms = Array.from({ length: 11 }, () => term);
  unit(many).learn.pattern.names = Array.from({ length: 7 }, (_, i) => `Name ${i}`);
  expect(joined(many)).toMatch(/3–10 terms/);
  expect(joined(many)).toMatch(/2–6 names/);
});

test('each unit needs a reference and the lesson a cert tag', () => {
  const noRef = makeTwoUnitLesson();
  unit(noRef, 1).references = [];
  expect(joined(noRef)).toMatch(/Unit "beta".*at least 1 reference/);
  expect(joined(makeLesson({ certTags: [] }))).toMatch(/cert tag/);
});

// ---------------------------------------------------------------- ids

test('ids are unique: units, steps, events across a unit and questions', () => {
  expect(joined(makeLesson({ units: [makeUnit('same'), makeUnit('same')] }))).toMatch(/Duplicate unit id "same"/);

  const step = makeLesson();
  unit(step).steps[1]!.id = 'hello';
  expect(joined(step)).toMatch(/Duplicate step id "hello"/);

  const event = makeLesson();
  ev(event, 1, 0).id = 'm1';
  expect(joined(event)).toMatch(/event id "m1"/);

  const question = makeLesson();
  unit(question).practice[1]!.id = 'q1';
  expect(joined(question)).toMatch(/Duplicate question id "q1"/);
});

test('event and step ids may repeat across units', () => {
  expect(issuesOf(makeTwoUnitLesson())).toEqual([]);
});

// ---------------------------------------------------------------- places, cues, layers, board

test('a message from a place the figure does not have is named in the issue', () => {
  const to = makeLesson();
  ev(to, 0, 0).to = 'mars';
  expect(joined(to)).toMatch(/message "m1" is sent to "mars", which the dhcp figure does not have/);
  const party = makeLesson();
  unit(party).scene.parties[1]!.place = 'moon';
  expect(joined(party)).toMatch(/"moon"/);
});

test('cues must be the figure’s, with an arg exactly when they take text', () => {
  const unknown = makeLesson();
  ev(unknown, 0, 0).cues = [{ cue: 'sparkle' }];
  expect(joined(unknown)).toMatch(/cue "sparkle"/);
  const flagArg = makeLesson();
  ev(flagArg, 0, 0).cues = [{ cue: 'glow', arg: 'bright' }];
  expect(joined(flagArg)).toMatch(/cue "glow" .*no arg/);
  const noteCue = makeLesson();
  ev(noteCue, 2, 1).cues = [{ cue: 'status' }];
  expect(joined(noteCue)).toMatch(/note "n1".*cue "status" needs an arg/);
});

test('a scene’s start is cues the figure has, checked as an event’s are, on a figure that takes one', () => {
  // The fixture's net-map takes a start, as the real one does.
  const ok = makeLesson({ figure: 'net-map' });
  unit(ok).scene.start = [{ cue: 'glow' }];
  expect(issuesOf(ok)).toEqual([]);
  const unknown = makeLesson({ figure: 'net-map' });
  unit(unknown).scene.start = [{ cue: 'sparkle' }];
  expect(issuesOf(unknown)).toEqual([expect.stringMatching(/^Unit "neighbors": the scene's start: cue "sparkle" is not one the net-map figure has\.$/)]);
  const flagArg = makeLesson({ figure: 'net-map' });
  unit(flagArg).scene.start = [{ cue: 'glow', arg: 'bright' }];
  expect(joined(flagArg)).toMatch(/the scene's start: cue "glow" is a flag and takes no arg/);
  // A figure whose driver never reads a start would show nothing of it, so it is refused, as a board is.
  const dhcp = makeLesson();
  unit(dhcp).scene.start = [{ cue: 'glow' }];
  expect(issuesOf(dhcp)).toEqual(['Unit "neighbors": the scene has a start, but the dhcp figure takes none.']);
  const subnet = makeLesson({ figure: 'subnet' });
  unit(subnet).scene.start = [{ cue: 'glow' }];
  expect(issuesOf(subnet)).toEqual(['Unit "neighbors": the scene has a start, but the subnet figure takes none.']);
});

test('a start sets no status: each step’s own status comes after it, and a status cue in the start would beat them all', () => {
  for (const cue of [{ cue: 'status', arg: 'Waiting' }, { cue: 'status-known' }, { cue: 'status-done' }]) {
    const l = makeLesson({ figure: 'net-map' });
    unit(l).scene.start = [{ cue: 'glow' }, cue];
    expect(issuesOf(l), cue.cue).toContain(
      `Unit "neighbors": the scene's start: cue "${cue.cue}" sets the status, and a start may not; each step sets its own.`,
    );
  }
});

test('a scene with no start is given an empty one, as its layers and labels are', () => {
  const l = makeLesson();
  delete (unit(l).scene as { start?: unknown }).start;
  delete (unit(l).scene as { layers?: unknown }).layers;
  const { lesson } = validateLesson(l);
  expect([lesson.units[0]!.scene.start, lesson.units[0]!.scene.layers]).toEqual([[], []]);
});

test('scene layers must be layers the figure has', () => {
  const l = makeLesson();
  unit(l).scene.layers = ['web', 'pizza'];
  expect(issuesOf(l)).toEqual([expect.stringMatching(/layer "pizza"/)]);
});

test('a note carries a board only on a figure that has one', () => {
  const board = { addr: '192.168.1.10', who: 'Laptop', prefix: 24, pick: 'net' as const, third: { who: 'Printer', addr: '192.168.1.20', mode: 'cmp' as const } };
  const dhcp = makeLesson();
  ev(dhcp, 2, 1).board = board;
  expect(joined(dhcp)).toMatch(/board/);
  const subnet = makeLesson({ figure: 'subnet' });
  ev(subnet, 2, 1).board = board;
  expect(issuesOf(subnet)).toEqual([]);
});

// ---------------------------------------------------------------- log

test('every log key is a column of the unit’s log, and # and plain are never written', () => {
  const ok = makeLesson();
  ev(ok, 0, 0).log = {};
  expect(issuesOf(ok)).toEqual([]);
  const hash = makeLesson();
  ev(hash, 0, 0).log['#'] = '1';
  expect(joined(hash)).toMatch(/"#" is added by the console/);
  const plain = makeLesson();
  ev(plain, 2, 1).log.plain = 'Twice';
  expect(joined(plain)).toMatch(/note "n1".*"plain"/);
  const column = makeLesson();
  unit(column).scene.log.columns.push({ key: '#', label: '#' });
  expect(joined(column)).toMatch(/"#" is added by the console/);
});

test('a note may draw a message kind’s glyph, one the log’s legend explains in words', () => {
  // The fixture's legend explains a request, a reply, a lost message and a note.
  const sent = makeLesson();
  ev(sent, 2, 1).glyph = 'response';
  expect(issuesOf(sent)).toEqual([]);
  const unexplained = makeLesson();
  ev(unexplained, 2, 1).glyph = 'broadcast';
  expect(issuesOf(unexplained)).toEqual([expect.stringMatching(/note "n1" draws the broadcast glyph, which the unit's log legend does not explain/)]);
  const notAKind = makeLesson();
  ev(notAKind, 2, 1).glyph = 'blocked';
  expect(joined(notAKind)).toMatch(/glyph/);
});

test('a log column may be strong; a panel table’s may not', () => {
  const strong = makeLesson();
  unit(strong).scene.log.columns[0] = { ...unit(strong).scene.log.columns[0]!, strong: true };
  expect(issuesOf(strong)).toEqual([]);
  const table = makeLesson();
  (unit(table).scene.panel as any).table.columns[0].strong = true;
  expect(joined(table)).toMatch(/scene\.panel\.table\.columns\[0\]: .*Unrecognized key.*"strong"/);
});

// ---------------------------------------------------------------- outcomes, rules panel, tables, packets

test('dropped needs dropAt', () => {
  const l = makeLesson();
  delete ev(l, 3, 0).dropAt;
  expect(joined(l)).toMatch(/message "m3" is dropped, so it needs "dropAt"/);
  const blocked = makeLesson();
  ev(blocked, 3, 0).outcome = 'blocked';
  delete ev(blocked, 3, 0).dropAt;
  expect(issuesOf(blocked)).toEqual([]);
  const stray = makeLesson();
  ev(stray, 0, 0).dropAt = 0.4;
  expect(joined(stray)).toMatch(/message "m1" has "dropAt" but is not dropped/);
});

test('check names the rules table and known the conns table of a rules panel', () => {
  const ok = withRulesPanel();
  ev(ok, 0, 0).check = { table: 'rules', read: 2, match: 1, action: 'allow' };
  ev(ok, 1, 0).known = { table: 'conns', key: '203.0.113.50' };
  expect(issuesOf(ok)).toEqual([]);

  const swapped = withRulesPanel();
  ev(swapped, 0, 0).check = { table: 'conns', read: 1, match: null, action: 'deny' };
  ev(swapped, 1, 0).known = { table: 'rules', key: 'x' };
  expect(joined(swapped)).toMatch(/check names table "conns".*rules table "rules"/);
  expect(joined(swapped)).toMatch(/known names table "rules".*conns table "conns"/);

  const noRules = makeLesson();
  ev(noRules, 0, 0).check = { table: 'rules', read: 1, match: 1, action: 'allow' };
  expect(joined(noRules)).toMatch(/check.*rules panel/);
});

test('check reads at least one rule, and matches one or none', () => {
  const l = withRulesPanel();
  ev(l, 0, 0).check = { table: 'rules', read: 0, match: 0, action: 'allow' };
  const text = joined(l);
  expect(text).toMatch(/check\.read/);
  expect(text).toMatch(/check\.match/);
});

test('table events name a table of the unit’s panel', () => {
  const l = makeLesson();
  ev(l, 1, 1).table = 'nope';
  expect(joined(l)).toMatch(/table event "t-add" names table "nope"/);
  const none = makeLesson();
  unit(none).scene.panel = null;
  expect(joined(none)).toMatch(/"t-add"/);
  const rules = withRulesPanel();
  unit(rules).steps[0]!.events.push({ type: 'table', id: 'remember', table: 'conns', op: 'add', row: { who: 'Visitor' }, summary: 'Remembered.' });
  expect(issuesOf(rules)).toEqual([]);
});

test('table events carry the fields their op needs', () => {
  const table = (fields: Record<string, unknown>) => {
    const l = makeLesson();
    unit(l).steps[2]!.events = [{ type: 'table', id: 'x', table: 't', summary: 'S', ...fields } as never];
    return joined(l);
  };
  const row = { ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' };
  expect(table({ op: 'add' })).toMatch(/"row"/);
  expect(table({ op: 'add', row })).toBe('');
  expect(table({ op: 'update', row })).toMatch(/"key"/);
  expect(table({ op: 'update', key: '192.168.1.10' })).toMatch(/"row"/);
  expect(table({ op: 'update', key: '192.168.1.10', row })).toBe('');
  expect(table({ op: 'remove' })).toMatch(/"key"/);
  expect(table({ op: 'remove', key: '192.168.1.10' })).toBe('');
  expect(table({ op: 'match' })).toMatch(/"key"/);
  expect(table({ op: 'match', key: '' })).toBe('');
  expect(table({ op: 'replace' })).toMatch(/"rows"/);
  expect(table({ op: 'replace', rows: [] })).toBe('');
  expect(table({ op: 'clear' })).toBe('');
});

test('a table event marks its row as a miss only when it adds or changes that row', () => {
  const table = (fields: Record<string, unknown>) => {
    const l = makeLesson();
    unit(l).steps[2]!.events = [{ type: 'table', id: 'x', table: 't', summary: 'S', miss: true, ...fields } as never];
    return joined(l);
  };
  const row = { ip: '192.168.1.10', mac: '?' };
  expect(table({ op: 'add', row })).toBe('');
  expect(table({ op: 'update', key: '192.168.1.10', row })).toBe('');
  for (const op of [{ op: 'remove', key: '192.168.1.10' }, { op: 'match', key: '' }, { op: 'clear' }, { op: 'replace', rows: [] }]) {
    expect(table(op)).toMatch(new RegExp(`table event "x" \\(${op.op}\\) has "miss"`));
  }
  expect(table({ op: 'add', row, miss: 'yes' })).toMatch(/miss/);
});

test('a panel table’s key column is one of its columns, and a rules panel’s two tables differ', () => {
  const key = makeLesson();
  (unit(key).scene.panel as any).table.keyColumn = 'vlan';
  expect(joined(key)).toMatch(/table "t" key column "vlan" is not one of its columns\./);
  const same = withRulesPanel();
  (unit(same).scene.panel as any).conns.id = 'rules';
  expect(joined(same)).toMatch(/Duplicate table id "rules"/);
});

test('a table that says its key is hidden keys on a field every row carries and no column shows', () => {
  // For a table whose shown columns cannot tell its rows apart. Rows here start in the table or come with step 3.
  type Fields = { keyColumn: string; hiddenKey?: unknown; rows?: Record<string, string>[]; initialRows?: Record<string, string>[] };
  const keyed = ({ rows = [], ...def }: Fields) => {
    const l = makeLesson();
    Object.assign((unit(l).scene.panel as any).table, { initialRows: [], ...def });
    unit(l).steps[1]!.events = unit(l).steps[1]!.events.filter((e) => e.type !== 'table');
    unit(l).steps[2]!.events = rows.map((row, i) => ({ type: 'table', id: `x${i}`, table: 't', op: 'add', row, summary: 'S' }) as never);
    return joined(l);
  };
  const row = (id?: string) => ({ ...(id === undefined ? {} : { id }), ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' });
  expect(keyed({ keyColumn: 'id', hiddenKey: true, rows: [row('a'), row('b')] })).toBe('');
  expect(keyed({ keyColumn: 'id', hiddenKey: true, rows: [row('b')], initialRows: [row('a')] })).toBe('');
  // A row without it, whether a step adds it or the table starts with it.
  expect(keyed({ keyColumn: 'id', hiddenKey: true, rows: [row('a'), row()] })).toMatch(/table "t" hides its key column "id", and not every row carries it\./);
  expect(keyed({ keyColumn: 'id', hiddenKey: true, initialRows: [row()] })).toMatch(/table "t" hides its key column "id"/);
  // A hidden key is not one the table shows.
  expect(keyed({ keyColumn: 'ip', hiddenKey: true, rows: [row('a')] })).toMatch(/table "t" hides its key, and key column "ip" is one of its columns\./);
  // Without the flag a misspelt key fails, whatever the rows carry: here every row has a field by that name.
  expect(keyed({ keyColumn: 'id', rows: [row('a'), row('b')] })).toMatch(/table "t" key column "id" is not one of its columns\./);
  // The flag is only ever true.
  expect(keyed({ keyColumn: 'id', hiddenKey: false, rows: [row('a')] })).toMatch(/scene\.panel\.table\.hiddenKey/);
});

test('a column may be prose and have a width in px; any other key is still rejected', () => {
  const set = makeLesson();
  const columns = unit(set).scene.log.columns;
  columns[0] = { ...columns[0]!, width: 150 };
  columns[1] = { ...columns[1]!, prose: true };
  (unit(set).scene.panel as any).table.columns[0].prose = true;
  expect(issuesOf(set)).toEqual([]);

  const zero = makeLesson();
  (unit(zero).scene.log.columns[0] as any).width = 0;
  expect(joined(zero)).toMatch(/scene\.log\.columns\[0\]\.width/);

  const typo = makeLesson();
  (unit(typo).scene.log.columns[0] as any).widht = 150;
  (unit(typo).scene.panel as any).table.columns[0].wrap = true;
  const issues = joined(typo);
  expect(issues).toMatch(/scene\.log\.columns\[0\]: .*Unrecognized key.*"widht"/);
  expect(issues).toMatch(/scene\.panel\.table\.columns\[0\]: .*Unrecognized key.*"wrap"/);
});

test('packet names a packet whose size matches', () => {
  const unknown = makeLesson();
  ev(unknown, 0, 0).packet = 'p404';
  expect(joined(unknown)).toMatch(/unknown packet "p404"/);

  const size = makeLesson();
  ev(size, 0, 0).log.size = '99 B';
  expect(joined(size)).toMatch(/size "99 B" does not match packet "p1" \(34 B\)/);

  const layers = makeLesson();
  unit(layers).scene.packets!.p1!.size = 40;
  ev(layers, 0, 0).log.size = '40 B';
  expect(joined(layers)).toMatch(/Packet "p1" size 40 does not equal the sum of its layer sizes \(34\)/);

  const noSize = makeLesson();
  delete ev(noSize, 0, 0).log.size;
  expect(issuesOf(noSize)).toEqual([]);
});

// ---------------------------------------------------------------- scene

test('sequence view needs two parties', () => {
  const one = makeLesson();
  unit(one).scene.parties = unit(one).scene.parties.slice(0, 1);
  expect(joined(one)).toMatch(/Sequence view needs at least 2 parties; this scene has 1/);
  unit(one).scene.views = ['network'];
  expect(issuesOf(one)).toEqual([]);
});

test('net-map scene titles over 51 characters are rejected', () => {
  const at = (figure: LessonInput['figure'], length: number) => {
    const l = makeLesson({ figure });
    unit(l).scene.title = 'x'.repeat(length);
    return issuesOf(l);
  };
  expect(at('net-map', 51)).toEqual([]);
  expect(at('net-map', 52).join()).toMatch(/52 characters; the limit is 51/);
  expect(at('dhcp', 52)).toEqual([]);
});

// ---------------------------------------------------------------- length

test('a long lesson is not rejected for its length', () => {
  // Six steps of 120-word narratives, three questions with long feedback: far over the old 15 minutes.
  const long = makeLesson();
  const u = unit(long);
  u.steps.push({ ...structuredClone(u.steps[4]!), id: 'extra6', events: [] });
  for (const step of u.steps) step.narrative = words(120);
  u.overview.description = words(2500);
  for (const q of u.practice) for (const option of q.options) option.feedback = words(200);
  u.practice.push({ ...structuredClone(u.practice[0]!), id: 'q3' });
  expect(u.steps).toHaveLength(6);
  expect(u.practice).toHaveLength(3);
  expect(issuesOf(long)).toEqual([]);
});

test('a multi-unit lesson needs exactly 2 questions per unit', () => {
  const three = makeTwoUnitLesson();
  unit(three, 1).practice.push({ ...structuredClone(unit(three, 1).practice[0]!), id: 'q3' });
  expect(joined(three)).toMatch(/Unit "beta".*exactly 2 questions/);
});

// ---------------------------------------------------------------- defineLesson / defineTrack

test('defineLesson returns the validated lesson', () => {
  expect(defineLesson(makeLesson()).slug).toBe('fixture-lesson');
});

test('defineLesson throws LessonValidationError for a bad lesson', () => {
  const input = makeLesson();
  unit(input).steps = unit(input).steps.slice(0, 2);
  expect(() => defineLesson(input)).toThrow(LessonValidationError);
});

const trackOf = (parts: { id: string; slugs: string[] }[]) => ({
  id: 'demo',
  title: 'Demo',
  description: 'A demo track.',
  level: 'beginner' as const,
  parts: parts.map((p) => ({ id: p.id, title: p.id, lessons: p.slugs.map((slug) => ({ slug, title: slug })) })),
});

test('defineTrack returns a valid track', () => {
  const t = trackOf([
    { id: 'one', slugs: ['a', 'b'] },
    { id: 'two', slugs: ['c'] },
  ]);
  expect(defineTrack(t)).toEqual(t);
});

test('defineTrack rejects duplicate slugs, even across parts', () => {
  const t = trackOf([
    { id: 'one', slugs: ['a', 'b'] },
    { id: 'two', slugs: ['b'] },
  ]);
  expect(() => defineTrack(t)).toThrow(/duplicate.*"b"/i);
});

test('defineTrack rejects duplicate part ids, empty parts and bad slugs', () => {
  expect(() => defineTrack(trackOf([{ id: 'one', slugs: ['a'] }, { id: 'one', slugs: ['b'] }]))).toThrow(/part id "one"/i);
  expect(() => defineTrack(trackOf([{ id: 'one', slugs: [] }]))).toThrow(/lessons/);
  expect(() => defineTrack(trackOf([{ id: 'one', slugs: ['Bad Slug'] }]))).toThrow(/slug/);
  expect(() => defineTrack({ ...trackOf([{ id: 'one', slugs: ['a'] }]), level: 'expert' as never })).toThrow(/level/);
});
