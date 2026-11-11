import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import type { SourceRegistry } from '../sources';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { itemsToJudge, renderRecheck } from './recheck';
import { claimSheet, itemHashes } from './sheet';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

// G4, second try: the plan's amended rule (plan.md, "Which items a re-check judges"). Each scenario is a lesson changed
// in one way since a full check, and the items a re-check must judge.

const lesson = (): Lesson => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const unit = (l: Lesson) => l.units[0]!;
const sheetOf = (l: Lesson, sources: SourceRegistry = FIXTURE_SOURCES) => claimSheet(l, sources);
const base = () => itemHashes(sheetOf(lesson()));
function judging(edit: (l: Lesson) => void, sources?: SourceRegistry) {
  const l = lesson();
  edit(l);
  return itemsToJudge(base(), sheetOf(l, sources));
}

const sorted = (a: readonly string[]) => [...a].sort();
const Q1 = 'units[0].practice[0].prompt (question "q1")';
const Q2 = 'units[0].practice[1].prompt (question "q2")';
const opt = (q: number, n: number) => `units[0].practice[${q}].options[${n}] (question "q${q + 1}")`;
const Q1_ALL = [Q1, opt(0, 0), opt(0, 1), opt(0, 2)];
const Q2_ALL = [Q2, opt(1, 0), opt(1, 1)];
const TITLE = 'title';
const NAME = 'units[0].name';

describe('B1: a question is one unit', () => {
  test('B1a: a reworded prompt judges the prompt and every one of its options, and no other question', () => {
    const j = judging((l) => { unit(l).practice[1]!.prompt = 'When does a device give its address back?'; });
    expect(sorted(j.judge)).toEqual(sorted(Q2_ALL));
    expect(j.changed).toEqual([Q2]);
  });

  test('B1b: an option\'s text changed judges the prompt and all options', () => {
    expect(sorted(judging((l) => { unit(l).practice[0]!.options[1]!.text += '!'; }).judge)).toEqual(sorted(Q1_ALL));
  });

  test('B1c: an option\'s feedback changed judges the prompt and all options', () => {
    expect(sorted(judging((l) => { unit(l).practice[0]!.options[2]!.feedback += '!'; }).judge)).toEqual(sorted(Q1_ALL));
  });

  test('B1d: the answer moved (an option\'s right flag changed) judges the prompt and all options', () => {
    expect(sorted(judging((l) => { unit(l).practice[0]!.answer = 1; }).judge)).toEqual(sorted(Q1_ALL));
  });

  test('B1e: an option\'s citation changed judges the prompt and all options', () => {
    expect(sorted(judging((l) => { unit(l).practice[1]!.options[1]!.cite[0]!.section = '9.9'; }).judge)).toEqual(sorted(Q2_ALL));
  });

  test('B1f: an option taken out judges the question that is left', () => {
    expect(sorted(judging((l) => { unit(l).practice[1]!.options.pop(); }).judge)).toEqual(sorted([Q2, opt(1, 0)]));
  });

  test('B1g: a Learn part changed judges the title, the unit\'s name and every prompt, and what traces to it, but no option', () => {
    const j = judging((l) => { unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; });
    expect(j.changed).toEqual(['units[0].learn.lead[0] ("lead-1")']);
    for (const key of [TITLE, NAME, Q1, Q2]) expect(j.judge, key).toContain(key);
    for (const key of [...Q1_ALL.slice(1), ...Q2_ALL.slice(1)]) expect(j.judge, key).not.toContain(key);
    expect(j.judge).toContain('units[0].steps[1] (step "grant")');
    expect(j.judge).toContain('units[0].scene.backing (the scene)');
    expect(j.judge).not.toContain('units[0].steps[2] (step "lookup")');
  });

  test('B1h: a change outside Learn that is not a question leaves the title, the name and the prompts alone', () => {
    const j = judging((l) => { unit(l).steps[0]!.facts[1]!.value = 'Nobody'; });
    expect(j.judge).toEqual(['units[0].steps[0].facts[1] (step "request", fact "Sent to")']);
  });

  test('B1i: the title changed is judged and is not itself a Learn change', () => {
    const j = judging((l) => { l.title = 'Another title'; });
    expect(j.judge).toEqual([TITLE]);
  });

  describe('the re-check sheet', () => {
    const render = (edit: (l: Lesson) => void) => {
      const l = lesson();
      edit(l);
      const sheet = sheetOf(l);
      return renderRecheck(sheet, 'b'.repeat(64), itemsToJudge(base(), sheet), 'docs/fact-checks/cited-lesson.recheck.md');
    };
    const HEADING = '## Learn parts, as context (no verdict)';

    test('B1j: when an unbacked item is judged, every cited Learn part is printed once as context under a heading', () => {
      const text = render((l) => { l.title = 'Another title'; });
      expect(text).toContain(HEADING);
      const section = text.slice(text.indexOf(HEADING));
      const learn = sheetOf(lesson()).items.filter((i) => /\.learn\./.test(i.key) && i.cite.length > 0).map((i) => i.key);
      expect(learn.length).toBeGreaterThan(5);
      for (const key of learn) expect(section.split(`Context (no verdict): ${key}`).length - 1, key).toBe(1);
      expect(text).not.toMatch(/^### units\[0\]\.learn/m);
    });

    test('B1k: when none is judged the section is not there', () => {
      expect(render((l) => { unit(l).steps[0]!.facts[1]!.value = 'Nobody'; })).not.toContain(HEADING);
    });

    test('B1l: the fact-checker\'s instructions say context is read and not judged, Learn parts included', () => {
      const text = Object.values(import.meta.glob<string>('../../../.claude/agents/fact-checker.md', { query: '?raw', import: 'default', eager: true }))[0]!;
      const section = text.slice(text.indexOf('## A targeted re-check'));
      expect(section).toContain('Learn parts, as context (no verdict)');
      expect(section).toMatch(/read them.*no verdict/is);
    });
  });
});

describe('B2: an item that moved is changed', () => {
  const EVENT = 'units[0].steps[1].events[1] (event "t-add")';

  test('B2a: an event moved from one step to another is changed', () => {
    const j = judging((l) => { const [e] = unit(l).steps[1]!.events.splice(1, 1); unit(l).steps[0]!.events.push(e!); });
    expect(j.changed).toEqual(['units[0].steps[0].events[1] (event "t-add")']);
  });

  test('B2b: an event moved to the front of another step is changed, and the events it pushed down are not', () => {
    const j = judging((l) => { const [e] = unit(l).steps[1]!.events.splice(1, 1); unit(l).steps[0]!.events.unshift(e!); });
    expect(j.changed).toEqual(['units[0].steps[0].events[0] (event "t-add")']);
  });

  test('B2c: a fact moved under another step is changed', () => {
    const j = judging((l) => { const [f] = unit(l).steps[3]!.facts.splice(0, 1); unit(l).steps[2]!.facts.push(f!); });
    expect(j.changed).toEqual(['units[0].steps[2].facts[2] (step "lookup", fact "When")']);
  });

  test('B2d: two steps swapped: one of them is judged', () => {
    const j = judging((l) => { const s = unit(l).steps; [s[0], s[1]] = [s[1]!, s[0]!]; });
    expect(j.changed.length).toBeGreaterThan(0);
    expect(j.changed.some((k) => /^units\[0\]\.steps\[[01]\] \(step "(request|grant)"\)$/.test(k))).toBe(true);
  });

  test('B2e: two Learn statements reordered: one of them is judged', () => {
    const j = judging((l) => { const s = unit(l).learn.lead; [s[0], s[1]] = [s[1]!, s[0]!]; });
    expect(j.changed).toHaveLength(1);
    expect(j.changed[0]).toMatch(/^units\[0\]\.learn\.lead\[[01]\] \("lead-[12]"\)$/);
  });

  test('B2f: two options reordered judges the whole question, since a question is one unit', () => {
    const j = judging((l) => { const o = unit(l).practice[0]!.options; [o[0], o[1]] = [o[1]!, o[0]!]; });
    expect(sorted(j.judge)).toEqual(sorted(Q1_ALL));
  });

  test('B2g: two questions swapped: both prompts moved, so both questions are judged', () => {
    const j = judging((l) => { const p = unit(l).practice; [p[0], p[1]] = [p[1]!, p[0]!]; });
    expect(j.judge).toHaveLength(7);
    expect(j.judge.filter((k) => k.includes('question "q1"'))).toHaveLength(4);
    expect(j.judge.filter((k) => k.includes('question "q2"'))).toHaveLength(3);
  });

  test('B2h: a statement inserted before others, and an event inserted before others, leave the later ones unchanged', () => {
    const j = judging((l) => {
      const first = unit(l).learn.lead[0]!;
      unit(l).learn.lead.unshift({ id: 'lead-0', text: 'Addresses are lent, not owned.', cite: structuredClone(first.cite) });
      unit(l).steps[3]!.events.unshift({ ...structuredClone(unit(l).steps[3]!.events[0]!), id: 'm-new' });
    });
    expect(sorted(j.changed)).toEqual(sorted(['units[0].learn.lead[0] ("lead-0")', 'units[0].steps[3].events[0] (event "m-new")']));
  });

  test('B2i: a statement taken out leaves the later ones unchanged', () => {
    const j = judging((l) => { unit(l).learn.terms.splice(1, 1); });
    expect(j.changed).toEqual([]);
    expect(EVENT).toBeDefined();
  });
});

describe('B3: a cited source\'s registry entry is part of an item\'s hash', () => {
  const citing = () => sheetOf(lesson()).items.filter((i) => i.cite.some((c) => c.source === 'rfc-example')).map((i) => i.key);
  const edits: [string, Record<string, unknown>][] = [
    ['title', { title: 'Example Protocol, revised' }],
    ['version', { version: 'draft 7' }],
    ['kind', { kind: 'ietf' }],
    ['publisher', { publisher: 'Another body' }],
    ['url', { url: 'https://www.rfc-editor.org/rfc/rfc9998.html' }],
  ];
  for (const [what, change] of edits) {
    test(`B3: a source's ${what} changed marks every item that cites it as changed, and no other`, () => {
      const sources = { ...FIXTURE_SOURCES, 'rfc-example': { ...FIXTURE_SOURCES['rfc-example']!, ...change } } as SourceRegistry;
      const j = judging(() => {}, sources);
      expect(j.changed).toEqual(citing());
      expect(j.changed.length).toBeGreaterThan(5);
    });
  }
});

describe('D2: nothing to judge', () => {
  test('D2: the sheet says no item changed, and does not say that parts were taken out', () => {
    const l = lesson();
    unit(l).steps[1]!.events.splice(1, 1);
    const sheet = sheetOf(l);
    const text = renderRecheck(sheet, 'b'.repeat(64), itemsToJudge(base(), sheet), 'docs/fact-checks/cited-lesson.recheck.md');
    expect(text).toContain('No item on the sheet changed since the full check');
    // The opening line names a Learn part taken out as a reason to judge; the message here must not claim what changed.
    expect(text.slice(text.indexOf('## Items to judge'))).not.toMatch(/taken out/);
  });
});

// After the second review: a moved item is judged in its place, and a Learn part taken out re-opens what rested on it.
describe('after the second review', () => {
  const sheetFor = (edit: (l: Lesson) => void) => {
    const l = lesson();
    edit(l);
    const sheet = sheetOf(l);
    return { sheet, text: renderRecheck(sheet, 'b'.repeat(64), itemsToJudge(base(), sheet), 'docs/fact-checks/x.recheck.md') };
  };

  test('an event moved to another step is shown in its place: the step it is now in, with its words, and that step’s events in their order', () => {
    const { sheet, text } = sheetFor((l) => {
      const steps = unit(l).steps;
      steps[0]!.events.unshift(steps[1]!.events.pop()!);
    });
    const step = sheet.items.find((i) => /^units\[0\]\.steps\[0\] \(step "/.test(i.key))!;
    const events = sheet.items.filter((i) => i.key.startsWith('units[0].steps[0].events['));
    expect(text).toContain('## Where the items to judge sit, as context (no verdict)');
    const place = text.slice(text.indexOf('## Where the items to judge sit'));
    // The parent step, with its words, then every event of that step in the order it now has.
    expect(place).toContain(step.key);
    expect(place).toContain(JSON.stringify(step.content, null, 2));
    const at = events.map((e) => place.indexOf(e.key));
    expect(at.every((n) => n > 0)).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
    expect(place).toContain(`${events[0]!.key} (to judge)`);
  });

  test('two steps swapped: the steps are listed in the order they now have', () => {
    const { sheet, text } = sheetFor((l) => {
      const steps = unit(l).steps;
      [steps[0], steps[1]] = [steps[1]!, steps[0]!];
    });
    const place = text.slice(text.indexOf('## Where the items to judge sit'));
    const steps = sheet.items.filter((i) => /^units\[0\]\.steps\[\d+\] \(step "/.test(i.key));
    const at = steps.map((s) => place.indexOf(s.key));
    expect(at.every((n) => n > 0)).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });

  test('no list to show when what is judged is in no list: a reworded title alone', () => {
    const { text } = sheetFor((l) => { l.title += '!'; });
    expect(text).not.toContain('## Where the items to judge sit');
  });

  test('a Learn part taken out judges the title, the unit’s name and every prompt: what they rested on is gone', () => {
    const j = judging((l) => { unit(l).learn.terms.pop(); });
    for (const key of [TITLE, NAME, Q1, Q2]) expect(j.judge, key).toContain(key);
    // And no option comes with a prompt judged for that reason alone.
    expect(j.judge.filter((k) => /options\[/.test(k))).toEqual([]);
  });

  test('the sheet says what it lists: changed items, what traces to them, whole questions, and what rests on the whole lesson', () => {
    const { text } = sheetFor((l) => { unit(l).practice[1]!.prompt += '?'; });
    expect(text).toMatch(/whole question/);
    expect(text).toMatch(/rest on the whole lesson/);
    expect(text).toMatch(/in its place/);
  });
});
