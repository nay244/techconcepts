import { afterEach, expect, test, vi } from 'vitest';
import { defineLesson, defineTrack, LessonValidationError, validateLesson } from './define';
import { fixtureLesson, fixturePlaygroundLesson } from './test-fixtures';

const issuesOf = (input: unknown): string[] => {
  try {
    validateLesson(input);
    return [];
  } catch (e) {
    if (e instanceof LessonValidationError) return e.issues;
    throw e;
  }
};

afterEach(() => {
  vi.restoreAllMocks();
});

// Shorthand for reaching into the fixture's flow scene and its events.
const flow = (l: ReturnType<typeof fixtureLesson>): any => l.scene;
const ev = (l: ReturnType<typeof fixtureLesson>, step: number, i: number): any => l.steps[step]!.events[i];

test('fixtures are valid', () => {
  expect(() => validateLesson(fixtureLesson())).not.toThrow();
  expect(() => validateLesson(fixturePlaygroundLesson())).not.toThrow();
});

test('fixtures give no warnings and a fresh copy every call', () => {
  expect(validateLesson(fixtureLesson()).warnings).toEqual([]);
  expect(validateLesson(fixturePlaygroundLesson()).warnings).toEqual([]);
  const a = fixtureLesson();
  a.steps[0]!.title = 'changed';
  a.check[0]!.options.push('extra');
  (flow(a).tables[0].initialRows as unknown[]).push({ ip: 'x', mac: 'y' });
  const b = fixtureLesson();
  expect(b.steps[0]!.title).not.toBe('changed');
  expect(b.check[0]!.options).not.toContain('extra');
  expect(flow(b).tables[0].initialRows).toEqual([]);
});

test('fixtureLesson applies overrides', () => {
  expect(fixtureLesson({ slug: 'dhcp', title: 'DHCP' })).toMatchObject({ slug: 'dhcp', title: 'DHCP' });
});

test('fixture shape that the engine tests rely on', () => {
  const l = fixtureLesson();
  expect(flow(l).actors.map((a: { id: string }) => a.id)).toEqual(['a', 'b']);
  expect(flow(l).links.map((x: { id: string }) => x.id)).toEqual(['a-b']);
  expect(flow(l).tables).toHaveLength(1);
  expect(flow(l).tables[0]).toMatchObject({ id: 't', actor: 'b', keyColumn: 'ip', initialRows: [] });
  expect(flow(l).packets.p1.size).toBe(34);
  expect(l.steps).toHaveLength(4);
  expect(l.steps.every((s) => s.facts.length === 2)).toBe(true);
  expect(ev(l, 0, 0)).toMatchObject({ type: 'message', id: 'm1', from: 'a', to: ['b'], packet: 'p1', size: 34 });
  expect(l.steps[1]!.events.map((e) => e.id)).toEqual(['m2', 'm3', 't-add']);
  expect(ev(l, 1, 2)).toMatchObject({ type: 'table', op: 'add', table: 't' });
  expect(ev(l, 2, 0)).toMatchObject({ type: 'table', op: 'match', table: 't' });
  expect(ev(l, 3, 0)).toMatchObject({ type: 'message', id: 'm4', outcome: 'dropped' });
  expect(l.tryIt.mode).toBe('choices');
  if (l.tryIt.mode === 'choices') {
    expect(l.tryIt.choices.map((c) => c.id)).toEqual(['c1', 'c2']);
    expect(l.tryIt.choices.every((c) => c.events.length >= 1)).toBe(true);
  }
  expect(l.check).toHaveLength(2);
  expect(l.recap.takeaways).toHaveLength(3);
});

test('fixturePlaygroundLesson has four preset steps', () => {
  const l = fixturePlaygroundLesson();
  expect(l.steps).toHaveLength(4);
  expect(l.steps.every((s) => s.preset && s.facts.length === 2 && s.events.length === 0)).toBe(true);
  expect(l.tryIt.mode).toBe('free');
});

// ---------------------------------------------------------------- shape

test('rejects input that is not an object, and names every shape problem', () => {
  expect(issuesOf(null).length).toBeGreaterThan(0);
  const l = fixtureLesson() as unknown as Record<string, unknown>;
  delete l.summary;
  l.level = 'expert';
  const issues = issuesOf(l);
  expect(issues.join('\n')).toMatch(/summary/);
  expect(issues.join('\n')).toMatch(/level/);
});

test('the error names the lesson and lists every issue', () => {
  const l = fixtureLesson();
  l.steps = l.steps.slice(0, 3);
  l.recap.takeaways = ['only one'];
  l.references = [];
  let caught: unknown;
  try {
    validateLesson(l);
  } catch (e) {
    caught = e;
  }
  expect(caught).toBeInstanceOf(LessonValidationError);
  const err = caught as LessonValidationError;
  expect(err.issues.length).toBeGreaterThanOrEqual(3);
  expect(err.message).toContain(l.slug);
  for (const issue of err.issues) expect(err.message).toContain(issue);
});

test('rejects an unknown cert tag and a non-https reference', () => {
  const a = fixtureLesson();
  (a.certTags as string[]).push('mcse');
  expect(issuesOf(a).join('\n')).toMatch(/certTags/);
  const b = fixtureLesson();
  b.references[0]!.url = 'http://www.rfc-editor.org/rfc/rfc826';
  expect(issuesOf(b).join('\n')).toMatch(/references/);
});

test('rejects a slug that is not URL-safe', () => {
  expect(issuesOf(fixtureLesson({ slug: 'Not A Slug' })).join('\n')).toMatch(/slug/);
});

// ---------------------------------------------------------------- general limits

test('rejects too few steps', () => {
  const l = fixtureLesson();
  l.steps = l.steps.slice(0, 3);
  expect(issuesOf(l).join()).toMatch(/4–6 steps/);
});

test('rejects too many steps and accepts six', () => {
  const six = fixtureLesson();
  const extra = (n: number) => ({
    id: `extra${n}`,
    title: `Extra ${n}`,
    subtitle: 'More',
    narrative: 'A short narrative.',
    facts: [
      { label: 'One', value: '1' },
      { label: 'Two', value: '2' },
    ],
    events: [
      {
        type: 'table' as const,
        id: `extra${n}-match`,
        table: 't',
        op: 'match' as const,
        key: '192.168.1.10',
        summary: 'Looks it up',
      },
    ],
  });
  six.steps.push(extra(5), extra(6));
  expect(issuesOf(six)).toEqual([]);
  six.steps.push(extra(7));
  expect(issuesOf(six).join()).toMatch(/4–6 steps/);
});

test('rejects duplicate step ids', () => {
  const l = fixtureLesson();
  l.steps[1]!.id = l.steps[0]!.id;
  expect(issuesOf(l).join()).toMatch(new RegExp(`step id "${l.steps[0]!.id}"`));
});

test('rejects a step with fewer than 2 or more than 4 facts', () => {
  const few = fixtureLesson();
  few.steps[0]!.facts = [{ label: 'One', value: '1' }];
  expect(issuesOf(few).join()).toMatch(/2–4 facts/);
  const many = fixtureLesson();
  many.steps[0]!.facts = Array.from({ length: 5 }, (_, i) => ({ label: `F${i}`, value: `${i}` }));
  expect(issuesOf(many).join()).toMatch(/2–4 facts/);
});

test('rejects long narrative', () => {
  const l = fixtureLesson();
  l.steps[0]!.narrative = 'word '.repeat(121);
  expect(issuesOf(l).join()).toMatch(/120 words/);
});

test('accepts a narrative of exactly 120 words and a hook of exactly 80', () => {
  const l = fixtureLesson();
  l.steps[0]!.narrative = 'word '.repeat(120);
  l.overview.hook = 'word '.repeat(80);
  expect(issuesOf(l)).toEqual([]);
});

test('rejects a long hook', () => {
  const l = fixtureLesson();
  l.overview.hook = 'word '.repeat(81);
  expect(issuesOf(l).join()).toMatch(/80 words/);
});

test('rejects the wrong number of questions', () => {
  const one = fixtureLesson();
  one.check = one.check.slice(0, 1);
  expect(issuesOf(one).join()).toMatch(/2–3 questions/);
  const four = fixtureLesson();
  four.check = [...four.check, { ...four.check[0]!, id: 'q3' }, { ...four.check[0]!, id: 'q4' }];
  expect(issuesOf(four).join()).toMatch(/2–3 questions/);
});

test('rejects duplicate question ids', () => {
  const l = fixtureLesson();
  l.check[1]!.id = l.check[0]!.id;
  expect(issuesOf(l).join()).toMatch(/question id/);
});

test('rejects a question with too few or too many options', () => {
  const few = fixtureLesson();
  few.check[0]!.options = ['Only one'];
  few.check[0]!.answer = 0;
  expect(issuesOf(few).join()).toMatch(/2–4 options/);
  const many = fixtureLesson();
  many.check[0]!.options = ['a', 'b', 'c', 'd', 'e'];
  expect(issuesOf(many).join()).toMatch(/2–4 options/);
});

test('rejects answer out of range', () => {
  const l = fixtureLesson();
  l.check[0]!.answer = 9;
  const issues = issuesOf(l);
  expect(issues.length).toBeGreaterThan(0);
  expect(issues.join()).toMatch(/answer/);
});

test('rejects a negative or fractional answer', () => {
  const neg = fixtureLesson();
  neg.check[0]!.answer = -1;
  expect(issuesOf(neg).join()).toMatch(/answer/);
  const frac = fixtureLesson();
  frac.check[0]!.answer = 0.5;
  expect(issuesOf(frac).join()).toMatch(/answer/);
});

test('requires exactly three takeaways', () => {
  const two = fixtureLesson();
  two.recap.takeaways = ['one', 'two'];
  expect(issuesOf(two).join()).toMatch(/3 takeaways/);
  const four = fixtureLesson();
  four.recap.takeaways = ['one', 'two', 'three', 'four'];
  expect(issuesOf(four).join()).toMatch(/3 takeaways/);
});

test('requires a reference and a cert tag', () => {
  const noRef = fixtureLesson();
  noRef.references = [];
  expect(issuesOf(noRef).join()).toMatch(/reference/);
  const noTag = fixtureLesson();
  noTag.certTags = [];
  expect(issuesOf(noTag).join()).toMatch(/cert tag/);
});

// ---------------------------------------------------------------- flow scenes

test('rejects duplicate actor, link and table ids', () => {
  const actor = fixtureLesson();
  flow(actor).actors[1].id = 'a';
  expect(issuesOf(actor).join()).toMatch(/actor id "a"/);
  const link = fixtureLesson();
  flow(link).links.push({ id: 'a-b', from: 'a', to: 'b', medium: 'wireless' });
  expect(issuesOf(link).join()).toMatch(/link id "a-b"/);
  const table = fixtureLesson();
  flow(table).tables.push({ ...flow(table).tables[0] });
  expect(issuesOf(table).join()).toMatch(/table id "t"/);
});

test('rejects a link to an unknown actor', () => {
  const l = fixtureLesson();
  flow(l).links[0].to = 'nowhere';
  expect(issuesOf(l).join()).toMatch(/nowhere/);
});

test('rejects a table on an unknown actor', () => {
  const l = fixtureLesson();
  flow(l).tables[0].actor = 'phantom';
  expect(issuesOf(l).join()).toMatch(/phantom/);
});

test('rejects a table whose key column is not one of its columns', () => {
  const l = fixtureLesson();
  flow(l).tables[0].keyColumn = 'vlan';
  expect(issuesOf(l).join()).toMatch(/vlan/);
});

test('rejects unknown actor in event', () => {
  const l = fixtureLesson();
  ev(l, 0, 0).to = ['ghost'];
  expect(issuesOf(l).join()).toMatch(/ghost/);
});

test('rejects unknown sender and unknown via actor', () => {
  const from = fixtureLesson();
  ev(from, 0, 0).from = 'sender-ghost';
  expect(issuesOf(from).join()).toMatch(/sender-ghost/);
  const via = fixtureLesson();
  ev(via, 0, 0).via = ['hop-ghost'];
  expect(issuesOf(via).join()).toMatch(/hop-ghost/);
});

test('rejects unknown table', () => {
  const l = fixtureLesson();
  ev(l, 1, 2).table = 'nope';
  expect(issuesOf(l).join()).toMatch(/nope/);
});

test('table events need the fields their op uses', () => {
  const table = (fields: Record<string, unknown>) => {
    const l = fixtureLesson();
    l.steps[2]!.events = [{ type: 'table', id: 'x', table: 't', summary: 'S', ...fields } as never];
    return issuesOf(l).join();
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
  expect(table({ op: 'match', key: '192.168.1.10' })).toBe('');
  expect(table({ op: 'replace' })).toMatch(/"rows"/);
  expect(table({ op: 'replace', rows: [] })).toBe('');
  expect(table({ op: 'clear' })).toBe('');
});

test('an empty-string key is a valid match (nothing matched)', () => {
  const l = fixtureLesson();
  ev(l, 2, 0).key = '';
  expect(issuesOf(l)).toEqual([]);
});

test('rejects duplicate event ids across steps', () => {
  const l = fixtureLesson();
  ev(l, 1, 0).id = 'm1';
  expect(issuesOf(l).join()).toMatch(/event id "m1"/);
});

test('rejects a message with no targets', () => {
  const l = fixtureLesson();
  ev(l, 0, 0).to = [];
  expect(issuesOf(l).length).toBeGreaterThan(0);
});

test('Try it choices: ids unique within a choice, free to repeat across choices', () => {
  const reuse = fixtureLesson();
  if (reuse.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  const [c1, c2] = reuse.tryIt.choices;
  c1!.events[0]!.id = 'shared';
  c2!.events[0]!.id = 'shared';
  expect(issuesOf(reuse)).toEqual([]);

  const dup = fixtureLesson();
  if (dup.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  const extra = { ...dup.tryIt.choices[0]!.events[0]! };
  dup.tryIt.choices[0]!.events.push(extra);
  expect(issuesOf(dup).join()).toMatch(/choice "c1"/);

  const clash = fixtureLesson();
  if (clash.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  clash.tryIt.choices[1]!.events[0]!.id = 'm1';
  expect(issuesOf(clash).join()).toMatch(/choice "c2".*"m1"/);
});

test('Try it choice events are checked against actors, tables and packets too', () => {
  const l = fixtureLesson();
  if (l.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  (l.tryIt.choices[0]!.events[0] as { to: string[] }).to = ['choice-ghost'];
  expect(issuesOf(l).join()).toMatch(/choice-ghost/);
});

test('rejects duplicate choice ids', () => {
  const l = fixtureLesson();
  if (l.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  l.tryIt.choices[1]!.id = 'c1';
  expect(issuesOf(l).join()).toMatch(/choice id "c1"/);
});

test('rejects an unknown packet', () => {
  const l = fixtureLesson();
  ev(l, 0, 0).packet = 'p404';
  expect(issuesOf(l).join()).toMatch(/p404/);
});

test('rejects packet size mismatch', () => {
  const l = fixtureLesson();
  ev(l, 0, 0).size = 99;
  expect(issuesOf(l).join()).toMatch(/size/);
});

test('rejects a packet whose size is not the sum of its layers', () => {
  const l = fixtureLesson();
  flow(l).packets.p1.size = 40;
  const text = issuesOf(l).join('\n');
  expect(text).toMatch(/Packet "p1"/);
  expect(text).toMatch(/size/);
});

test('a message that carries no packet may have any size', () => {
  const l = fixtureLesson();
  ev(l, 1, 0).size = 1500;
  expect(issuesOf(l)).toEqual([]);
});

test('rejects a flow step with no events', () => {
  const l = fixtureLesson();
  l.steps[2]!.events = [];
  expect(issuesOf(l).join()).toMatch(/at least one event/);
});

test('rejects a preset on a flow step', () => {
  const l = fixtureLesson();
  l.steps[0]!.preset = { address: '192.168.1.10', prefix: 24 };
  expect(issuesOf(l).join()).toMatch(/preset/);
});

test('flow lessons need a choices Try it with 2–4 choices', () => {
  const free = fixtureLesson({ tryIt: { mode: 'free', prompt: 'Try something.', explanation: 'It works.' } });
  expect(issuesOf(free).join()).toMatch(/choices/);
  const one = fixtureLesson();
  if (one.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  one.tryIt.choices = one.tryIt.choices.slice(0, 1);
  expect(issuesOf(one).join()).toMatch(/2–4 choices/);
  const five = fixtureLesson();
  if (five.tryIt.mode !== 'choices') throw new Error('fixture must use choices');
  const first = five.tryIt.choices[0]!;
  five.tryIt.choices = Array.from({ length: 5 }, (_, i) => ({ ...first, id: `c${i}` }));
  expect(issuesOf(five).join()).toMatch(/2–4 choices/);
});

// ---------------------------------------------------------------- playground scenes

test('rejects playground preset outside /16–/30', () => {
  const l = fixturePlaygroundLesson();
  l.steps[0]!.preset!.prefix = 31;
  expect(issuesOf(l).join()).toMatch(/16/);
  l.steps[0]!.preset!.prefix = 15;
  expect(issuesOf(l).join()).toMatch(/16/);
});

test('accepts the /16 and /30 limits', () => {
  const l = fixturePlaygroundLesson();
  l.steps[0]!.preset!.prefix = 16;
  l.steps[1]!.preset!.prefix = 30;
  expect(issuesOf(l)).toEqual([]);
});

test('rejects a preset prefix that is not a whole number', () => {
  const l = fixturePlaygroundLesson();
  l.steps[0]!.preset!.prefix = 24.5;
  expect(issuesOf(l).length).toBeGreaterThan(0);
});

test('rejects unparseable preset addresses', () => {
  const addr = fixturePlaygroundLesson();
  addr.steps[0]!.preset!.address = '192.168.1';
  expect(issuesOf(addr).join()).toMatch(/address/);
  const cmp = fixturePlaygroundLesson();
  cmp.steps[0]!.preset!.compare = '300.1.1.1';
  expect(issuesOf(cmp).join()).toMatch(/compare/);
});

test('rejects a playground step without a preset, or with events', () => {
  const none = fixturePlaygroundLesson();
  delete none.steps[1]!.preset;
  expect(issuesOf(none).join()).toMatch(/preset/);
  const events = fixturePlaygroundLesson();
  events.steps[1]!.events = fixtureLesson().steps[0]!.events;
  expect(issuesOf(events).join()).toMatch(/no events/);
});

test('playground lessons need a free Try it', () => {
  const l = fixturePlaygroundLesson();
  l.tryIt = fixtureLesson().tryIt;
  expect(issuesOf(l).join()).toMatch(/free/);
});

// ---------------------------------------------------------------- time budget

test('rejects a lesson over 15 minutes', () => {
  const l = fixtureLesson();
  l.check.forEach((q) => (q.explanation = 'word '.repeat(1000)));
  expect(issuesOf(l).join()).toMatch(/15 minutes/);
});

test('warns above 12 minutes', () => {
  const l = fixtureLesson();
  l.check[0]!.explanation = 'word '.repeat(1250);
  const { warnings } = validateLesson(l);
  expect(warnings.join()).toMatch(/12/);
  expect(warnings).toHaveLength(1);
});

// ---------------------------------------------------------------- defineLesson / defineTrack

test('defineLesson returns the validated lesson without warning when it is short', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const lesson = defineLesson(fixtureLesson());
  expect(lesson.slug).toBe(fixtureLesson().slug);
  expect(warn).not.toHaveBeenCalled();
});

test('defineLesson logs each warning, naming the lesson', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const input = fixtureLesson();
  input.check[0]!.explanation = 'word '.repeat(1250);
  defineLesson(input);
  expect(warn).toHaveBeenCalledTimes(1);
  expect(String(warn.mock.calls[0]![0])).toContain(input.slug);
  expect(String(warn.mock.calls[0]![0])).toMatch(/12/);
});

test('defineLesson throws LessonValidationError for a bad lesson', () => {
  const input = fixtureLesson();
  input.steps = input.steps.slice(0, 2);
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

test('rejects an unknown key in a step, an event, Try it or the lesson, naming where it is', () => {
  const step = fixtureLesson();
  (step.steps[0] as any).subtitel = 'typo';
  expect(issuesOf(step)).toContainEqual(expect.stringMatching(/^steps\[0\]: .*Unrecognized key.*"subtitel"/));

  const event = fixtureLesson();
  ev(event, 0, 0).outcom = 'dropped';
  expect(issuesOf(event)).toContainEqual(expect.stringMatching(/^steps\[0\]\.events\[0\]: .*Unrecognized key.*"outcom"/));

  const tryIt = fixtureLesson();
  (tryIt.tryIt as any).promt = 'typo';
  expect(issuesOf(tryIt)).toContainEqual(expect.stringMatching(/^tryIt: .*Unrecognized key.*"promt"/));

  const top = fixtureLesson();
  (top as any).sumary = 'typo';
  expect(issuesOf(top)).toContainEqual(expect.stringMatching(/Unrecognized key.*"sumary"/));
});
