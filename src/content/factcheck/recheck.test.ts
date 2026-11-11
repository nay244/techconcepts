import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { RECHECK_MAX_ITEMS, NEAR_PASS_MAX_FAILING, itemsToJudge, nearPass, recheckPath, renderRecheck } from './recheck';
import { claimSheet, itemHashes, type ClaimSheet, type SheetItem } from './sheet';

// The real FIGURE_PARTS is empty until each figure is built; the stand-in has the fixture's places and cues.
vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

// G4, plan.md "Targeted re-checks": which items a re-check judges, what the re-check sheet prints, and the near-pass rule.

const lesson = (): Lesson => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const sheetOf = (l: Lesson = lesson()) => claimSheet(l, FIXTURE_SOURCES);
const unit = (l: Lesson) => l.units[0]!;
/** The fixture with one change made to it. */
function changed(edit: (l: Lesson) => void): Lesson {
  const l = structuredClone(lesson());
  edit(l);
  return l;
}
/** The full report's items record at the fixture as written, and the judging of a changed lesson against it. */
const base = () => itemHashes(sheetOf());
const judging = (edit: (l: Lesson) => void) => itemsToJudge(base(), sheetOf(changed(edit)));

const FACT3 = 'units[0].learn.facts[2] ("fact-3")';
const PROMPTS = ['units[0].practice[0].prompt (question "q1")', 'units[0].practice[1].prompt (question "q2")'];
const FACT3_TRACED = [
  'units[0].scene.packets.p1 (packet "p1")',
  'units[0].steps[0] (step "request")',
  'units[0].steps[0].facts[1] (step "request", fact "Sent to")',
];

describe('which items are judged', () => {
  test('judge 1: a lesson that has not changed has nothing to judge', () => {
    expect(itemsToJudge(base(), sheetOf())).toEqual({ changed: [], pulled: [], judge: [] });
  });

  test('judge 2: an item whose words changed is changed, and judged', () => {
    const j = judging((l) => { unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; });
    expect(j.changed).toEqual(['units[0].learn.lead[0] ("lead-1")']);
    expect(j.judge).toContain('units[0].learn.lead[0] ("lead-1")');
  });

  test('judge 3: an item whose citation changed is changed, even when its words did not', () => {
    const j = judging((l) => { unit(l).learn.facts[0]!.cite[0]!.section = '9.9'; });
    expect(j.changed).toEqual(['units[0].learn.facts[0] ("fact-1")']);
  });

  test('judge 4: a changed Learn part pulls in every Watch part that traces to it, and only those', () => {
    const j = judging((l) => { unit(l).learn.facts[2]!.value = 'A single device on the local network'; });
    expect(j.changed).toEqual([FACT3]);
    // A Learn part changed, so the items that rest on the whole lesson are judged too (B1 in recheck.amended.test.ts).
    expect(j.pulled).toEqual(['title', 'units[0].name', ...FACT3_TRACED, ...PROMPTS]);
    expect(j.judge).toEqual(['title', 'units[0].name', ...FACT3_TRACED, FACT3, ...PROMPTS]);
  });

  test('judge 5: a pulled item is not changed, and a changed traced item pulls nothing', () => {
    const j = judging((l) => { unit(l).steps[0]!.facts[1]!.value = 'Nobody'; });
    expect(j.changed).toEqual(['units[0].steps[0].facts[1] (step "request", fact "Sent to")']);
    expect(j.pulled).toEqual([]);
    expect(j.judge).toEqual(j.changed);
  });

  test('judge 6: a change to a traced part that names another Learn id is its own change', () => {
    const j = judging((l) => { unit(l).steps[0]!.facts[1]!.backing = { traces: ['term-1'] }; });
    expect(j.changed).toEqual(['units[0].steps[0].facts[1] (step "request", fact "Sent to")']);
  });

  test('judge 7: an inserted Learn statement shifts the keys after it, and only it is judged (the index-shift case)', () => {
    const j = judging((l) => {
      const first = unit(l).learn.lead[0]!;
      unit(l).learn.lead.unshift({ id: 'lead-0', text: 'Addresses are lent, not owned.', cite: structuredClone(first.cite) });
    });
    expect(j.changed).toEqual(['units[0].learn.lead[0] ("lead-0")']);
    expect(j.pulled).toEqual(['title', 'units[0].name', ...PROMPTS]);
  });

  test('judge 8: an inserted statement and an edit to a later one: the new one, the edited one, and what traces to the edited one', () => {
    const j = judging((l) => {
      const first = unit(l).learn.lead[0]!;
      unit(l).learn.lead.unshift({ id: 'lead-0', text: 'Addresses are lent, not owned.', cite: structuredClone(first.cite) });
      unit(l).learn.lead[2]!.text = 'Before the time runs out, the device asks the router to extend it.';
    });
    expect(j.changed).toEqual(['units[0].learn.lead[0] ("lead-0")', 'units[0].learn.lead[2] ("lead-2")']);
    expect(j.pulled).toContain('units[0].steps[3] (step "renew")');
    expect(j.pulled).not.toContain('units[0].steps[2] (step "lookup")');
  });

  test('judge 9: a removed part that shifts later keys makes none of them changed; a Learn part taken out re-opens only what rests on the whole lesson', () => {
    // term-2 is traced by nothing; term-3 moves from terms[2] to terms[1] and is as it was.
    const j = judging((l) => { unit(l).learn.terms.splice(1, 1); });
    expect(j.changed).toEqual([]);
    expect(j.judge.length).toBeGreaterThan(0);
    // The title, the unit's name and the prompts: nothing with words of its own that changed, and no option.
    expect(j.judge.every((key) => key === 'title' || /^units\[0\]\.name$/.test(key) || /\.prompt \(question "/.test(key))).toBe(true);
    expect(j.pulled).toEqual(j.judge);
  });

  test('judge 9b: an event taken out, which nothing rests on, leaves nothing to judge', () => {
    expect(judging((l) => { unit(l).steps[1]!.events.splice(1, 1); })).toEqual({ changed: [], pulled: [], judge: [] });
  });

  test('judge 10: the same hash under a key that differs in more than its numbers is changed', () => {
    const keyed = (key: string, text = 'Same words.'): SheetItem => ({ key, kind: 'claim', content: { text }, cite: [], traces: [] });
    const make = (items: SheetItem[]) => ({ slug: 's', items, sources: [], overrides: [], hash: '0'.repeat(64) }) as ClaimSheet;
    const before = make([keyed('units[0].learn.lead[0] ("a")')]);
    const after = make([keyed('units[0].learn.lead[0] ("b")')]);
    expect(itemsToJudge(itemHashes(before), after).changed).toEqual(['units[0].learn.lead[0] ("b")']);
  });

  test('judge 11: the same key with another hash is changed', () => {
    const keyed = (text: string): SheetItem => ({ key: 'title', kind: 'unbacked', content: { title: text }, cite: [], traces: [] });
    const make = (items: SheetItem[]) => ({ slug: 's', items, sources: [], overrides: [], hash: '0'.repeat(64) }) as ClaimSheet;
    expect(itemsToJudge(itemHashes(make([keyed('A')])), make([keyed('B')])).changed).toEqual(['title']);
  });

  describe('two base items with the same id and hash in one list', () => {
    const keyed = (n: number): SheetItem => ({ key: `units[0].learn.lead[${n}] ("same")`, kind: 'claim', content: { text: 'Same.' }, cite: [], traces: [] });
    const make = (...ns: number[]) => ({ slug: 's', items: ns.map(keyed), sources: [], overrides: [], hash: '0'.repeat(64) }) as ClaimSheet;

    test('judge 12: each base item matches at most one current item, so a third copy is new', () => {
      expect(itemsToJudge(itemHashes(make(0, 1)), make(0, 1, 2)).changed).toEqual([keyed(2).key]);
    });

    test('judge 13: the earlier copies of each side pair first, so taking one out changes nothing, and a copy put in is the last one', () => {
      expect(itemsToJudge(itemHashes(make(0, 1, 2)), make(0, 1)).changed).toEqual([]);
      expect(itemsToJudge(itemHashes(make(1, 2)), make(0, 1)).changed).toEqual([]);
      expect(itemsToJudge(itemHashes(make(1, 2)), make(0, 1, 2)).changed).toEqual([keyed(2).key]);
    });
  });

  test('judge 15: a second fix is judged against the same full check: everything changed since then', () => {
    const one = (l: Lesson) => { unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; };
    const two = (l: Lesson) => { one(l); unit(l).learn.facts[2]!.value = 'A single device on the local network'; };
    const first = itemsToJudge(base(), sheetOf(changed(one)));
    const second = itemsToJudge(base(), sheetOf(changed(two)));
    expect(second.changed).toEqual(['units[0].learn.lead[0] ("lead-1")', FACT3]);
    for (const key of first.judge) expect(second.judge).toContain(key);
    expect(second.judge.length).toBeGreaterThan(first.judge.length);
  });

  test('judge 16: the result is in the sheet\'s order, and every key is on the sheet', () => {
    const j = judging((l) => { unit(l).learn.facts[2]!.value = 'x'; unit(l).learn.lead[0]!.text = 'y'; });
    const order = sheetOf(changed(() => {})).items.map((i) => i.key);
    expect(j.judge.map((k) => order.indexOf(k))).toEqual([...j.judge.map((k) => order.indexOf(k))].sort((a, b) => a - b));
    for (const key of j.judge) expect(order).toContain(key);
  });
});

describe('the near-pass rule', () => {
  const verdicts = (...v: string[]) => Object.fromEntries(v.map((x, i) => [`k${i}`, x]));

  test('near-pass 1: the limits are 3 items not passing and 12 to judge', () => {
    expect(NEAR_PASS_MAX_FAILING).toBe(3);
    expect(RECHECK_MAX_ITEMS).toBe(12);
  });

  test('near-pass 2: all passing, and up to 3 not passing with none wrong, is a near-pass', () => {
    expect(nearPass(verdicts('✅', '✅')).ok).toBe(true);
    expect(nearPass(verdicts('✅', '⚠️', '⚠️', '⚠️')).ok).toBe(true);
  });

  test('near-pass 3: 4 not passing is not a near-pass, and the count is returned', () => {
    const n = nearPass(verdicts('✅', '⚠️', '⚠️', '⚠️', '⚠️'));
    expect(n.ok).toBe(false);
    expect(n.notPassing).toBe(4);
  });

  test('near-pass 4: one ❌ is not a near-pass, however few', () => {
    const n = nearPass(verdicts('✅', '❌'));
    expect(n).toMatchObject({ ok: false, notPassing: 1, wrong: 1 });
  });

  test('near-pass 5: a verdict that is none of the three counts as not passing', () => {
    expect(nearPass(verdicts('ok', 'ok', 'ok', 'ok')).ok).toBe(false);
  });
});

describe('the re-check sheet', () => {
  const edit = (l: Lesson) => { unit(l).learn.facts[2]!.value = 'A single device on the local network'; };
  const after = () => sheetOf(changed(edit));
  const text = () => renderRecheck(after(), 'b'.repeat(64), itemsToJudge(base(), after()), 'docs/fact-checks/cited-lesson.recheck.md');

  test('sheet 1: the re-check path is by slug, next to the full report', () => {
    expect(recheckPath('cited-lesson')).toBe('docs/fact-checks/cited-lesson.recheck.md');
  });

  test('sheet 2: it prints the lesson\'s hash, the full report\'s hash as base, and the path to write', () => {
    expect(text()).toContain(`Hash: \`${after().hash}\``);
    expect(text()).toContain(`Base: \`${'b'.repeat(64)}\``);
    expect(text()).toContain('Write your report to: docs/fact-checks/cited-lesson.recheck.md');
  });

  test('sheet 3: every item to judge is in the sheet\'s usual form, under a ### heading with its key', () => {
    const t = text();
    for (const key of itemsToJudge(base(), after()).judge) expect(t).toContain(`\n### ${key}\n`);
    expect(t).toContain('Kind: claim');
    expect(t).toMatch(/Citations:\n- `rfc-example` §3\.1\n {2}.+: https?:\/\//);
  });

  test('sheet 4: an item that is not judged has no heading, so the checker gives it no verdict', () => {
    const t = text();
    expect(t).not.toContain('### units[0].learn.lead[0] ("lead-1")');
    expect(t.match(/^### /gm)).toHaveLength(itemsToJudge(base(), after()).judge.length);
  });

  test('sheet 5: under a traced item, the words of each part it traces to, as context, with whether that part changed', () => {
    const t = text();
    const step = t.slice(t.indexOf('### units[0].steps[0] (step "request")'));
    const section = step.slice(0, step.indexOf('\n### ', 5) < 0 ? undefined : step.indexOf('\n### ', 5));
    expect(section).toContain('Traces: term-1, fact-3');
    expect(section).toMatch(/Context \(no verdict\): units\[0\]\.learn\.terms\[0\] \("term-1"\) \(not changed since the full check\)/);
    expect(section).toMatch(/Context \(no verdict\): units\[0\]\.learn\.facts\[2\] \("fact-3"\) \(changed since the full check\)/);
    expect(section).toContain('A single device on the local network');
    expect(section).toContain('Lease request');
  });

  test('sheet 6: context is not a heading and an item with no traces has none', () => {
    const t = text();
    expect(t).not.toMatch(/^#+ Context/m);
    const from = t.indexOf(`### ${'units[0].learn.facts[2] ("fact-3")'}`);
    const own = t.slice(from, t.indexOf('\n#', from + 5));
    expect(own).not.toContain('Context (no verdict)');
  });

  test('sheet 7: the sources are those the items to judge cite, and nothing else', () => {
    const t = text();
    expect(t).toContain('- `rfc-example`');
    expect(t).not.toContain('- `vendor-example`');
  });

  test('sheet 8: it says the limit overrides are not part of a re-check', () => {
    expect(text()).toMatch(/overrides/i);
    expect(text()).not.toContain('## Limit overrides');
  });
});
