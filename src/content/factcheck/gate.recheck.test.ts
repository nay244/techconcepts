import { describe, expect, test, vi } from 'vitest';
import { validateLesson } from '../define';
import type { Lesson } from '../schema';
import { FIXTURE_SOURCES, makeCitedLesson } from '../test-fixtures';
import { checkFactChecks, checkPair, checkedDate } from './gate';
import { itemsToJudge, recheckPath } from './recheck';
import { claimSheet, itemHashes } from './sheet';
import { recheckReportFor, stampedReportFor, type LooseHeader } from './test-helpers';

vi.mock('../../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('../test-fixtures')).FIXTURE_PARTS }));

// G4, plan.md "Targeted re-checks", "What the build requires": one test for each numbered rule and each refusal.

const FULL = 'docs/fact-checks/cited-lesson.md';
const RE = recheckPath('cited-lesson');
const FULL_GLOB = '../../docs/fact-checks/cited-lesson.md';
const RE_GLOB = '../../docs/fact-checks/cited-lesson.recheck.md';

const lessonA = (): Lesson => validateLesson(makeCitedLesson(), FIXTURE_SOURCES);
const unit = (l: Lesson) => l.units[0]!;
const FACT3 = 'units[0].learn.facts[2] ("fact-3")';
/** The usual fix: one Learn fact reworded. */
const reword = (l: Lesson) => { unit(l).learn.facts[2]!.value = 'A single device on the local network'; };

interface Options {
  /** What changed in the lesson since the full check. */
  edit?: (l: Lesson) => void;
  fullEdit?: (h: LooseHeader) => void;
  recheckEdit?: (h: LooseHeader) => void;
  /** The keys the re-check judged; by default what the script says to judge. */
  judged?: (all: string[]) => string[];
}

/** A full check of the fixture as it was, the lesson as it is now, and a re-check made for it. */
function scenario(o: Options = {}) {
  const sheetA = claimSheet(lessonA(), FIXTURE_SOURCES);
  const lessonB = lessonA();
  (o.edit ?? reword)(lessonB);
  const sheetB = claimSheet(lessonB, FIXTURE_SOURCES);
  const full = stampedReportFor(sheetA, o.fullEdit);
  const should = itemsToJudge(JSON.parse(/```json fact-check\n([\s\S]*?)\n```/.exec(full)![1]!).items ?? itemHashes(sheetA), sheetB).judge;
  const judged = o.judged === undefined ? should : o.judged(should);
  const fullHash = sheetA.hash;
  const recheck = recheckReportFor(sheetB, fullHash, judged, o.recheckEdit);
  return { sheetA, sheetB, lessonB, full, recheck, should, judged, fullHash };
}

const gate = (s: ReturnType<typeof scenario>, files: { full?: string | undefined; recheck?: string | undefined } = {}) => {
  const full = 'full' in files ? files.full : s.full;
  const recheck = 'recheck' in files ? files.recheck : s.recheck;
  return checkFactChecks([s.lessonB], { ...(full === undefined ? {} : { [FULL_GLOB]: full }) }, FIXTURE_SOURCES, { ...(recheck === undefined ? {} : { [RE_GLOB]: recheck }) });
};

test('pair 1: a full check, a fix and a re-check of what changed pass the gate', () => {
  const s = scenario();
  expect(s.judged.length).toBeGreaterThan(1);
  expect(gate(s)).toEqual([]);
  expect(checkPair(s.sheetB, s.full, s.recheck, FULL, RE)).toEqual([]);
});

test('pair 2: a lesson with no re-check file is judged as before: a changed lesson needs a new check', () => {
  const s = scenario();
  expect(gate(s, { recheck: undefined })).toEqual([expect.stringContaining('changed since it was checked')]);
});

test('pair 3: the fix of a near-pass\'s failing item passes once the re-check judges it ✅', () => {
  const lead = 'units[0].learn.lead[0] ("lead-1")';
  const s = scenario({ edit: (l) => { unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; }, fullEdit: (h) => { h.verdicts[lead] = '⚠️'; } });
  expect(s.judged).toContain(lead);
  expect(gate(s)).toEqual([]);
});

test('pair 4: an inserted Learn statement, which shifts later keys, passes with a re-check of the one new item', () => {
  const s = scenario({ edit: (l) => { unit(l).learn.lead.unshift({ id: 'lead-0', text: 'Addresses are lent, not owned.', cite: structuredClone(unit(l).learn.lead[0]!.cite) }); } });
  expect(s.judged).toEqual(['units[0].learn.lead[0] ("lead-0")']);
  expect(gate(s)).toEqual([]);
});

describe('rule 1: the re-check belongs to this lesson and this full report', () => {
  test('rule 1a: the re-check\'s hash is the sheet\'s hash, or the lesson changed since it was re-checked', () => {
    const s = scenario({ recheckEdit: (h) => { h.hash = 'e'.repeat(64); } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: the lesson changed since it was re-checked`)]);
  });

  test('rule 1b: a second fix after the re-check stales it, and a re-check of everything changed since the full check is needed', () => {
    const first = scenario();
    const second = scenario({ edit: (l) => { reword(l); unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; } });
    const stale = checkFactChecks([second.lessonB], { [FULL_GLOB]: first.full }, FIXTURE_SOURCES, { [RE_GLOB]: first.recheck });
    expect(stale).toEqual([expect.stringContaining('the lesson changed since it was re-checked')]);
    expect(gate(second)).toEqual([]);
  });

  test('rule 1c: a second re-check that judges only the second fix misses what the first fix changed', () => {
    const second = scenario({ edit: (l) => { reword(l); unit(l).learn.lead[0]!.text = 'A lease is an address lent for a while.'; } });
    const partial = second.judged.filter((k) => k !== 'units[0].learn.lead[0] ("lead-1")');
    const issues = gate(second, { recheck: recheckReportFor(second.sheetB, second.fullHash, partial) });
    expect(issues).toEqual([expect.stringContaining('no verdict for units[0].learn.lead[0] ("lead-1")')]);
  });

  test('rule 1d: a re-check whose base is not the full report\'s hash does not belong, and is refused', () => {
    const s = scenario({ recheckEdit: (h) => { h.base = 'd'.repeat(64); } });
    const issues = gate(s);
    expect(issues).toEqual([expect.stringContaining(`${RE}: does not belong to ${FULL}`)]);
    expect(issues[0]).toContain('remove it');
  });

  test('rule 1e: a re-check beside a full report whose hash is the sheet\'s is refused, however recent (a stale re-check once a new full report exists)', () => {
    const s = scenario();
    // A new full check of the lesson as it is now.
    const fresh = stampedReportFor(s.sheetB);
    const issues = gate(s, { full: fresh });
    expect(issues).toEqual([expect.stringContaining(`${RE}: sits beside a full report that is current`)]);
    expect(issues[0]).toContain('remove it');
  });

  test('rule 1f: a stale re-check beside a current full report that also fails reports both', () => {
    const s = scenario();
    const fresh = stampedReportFor(s.sheetB, (h) => { h.verdicts[Object.keys(h.verdicts)[0]!] = '⚠️'; });
    const issues = gate(s, { full: fresh });
    expect(issues).toHaveLength(2);
    expect(issues.join('\n')).toContain('did not pass');
    expect(issues.join('\n')).toContain('remove it');
  });

  test('rule 1g: a re-check for another slug, or one that cannot be read, is named', () => {
    const s = scenario({ recheckEdit: (h) => { h.slug = 'another-lesson'; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: is the re-check for "another-lesson", not "cited-lesson"`)]);
    expect(gate(scenario(), { recheck: '# nothing' })).toEqual([expect.stringContaining(`${RE}: cannot be read`)]);
  });

  test('rule 1h: a re-check with no full report beside it says so, and the full report is still asked for', () => {
    const issues = gate(scenario(), { full: undefined });
    expect(issues).toHaveLength(2);
    expect(issues[0]).toContain(`no fact-check report at ${FULL}`);
    expect(issues[1]).toContain('needs the full report');
  });

  test('rule 1i: a full report that cannot be read is named, as without a re-check', () => {
    const issues = gate(scenario(), { full: '# nothing' });
    expect(issues[0]).toContain(`${FULL}: cannot be read`);
  });
});

describe('rule 2: the full report has an items record and was a near-pass', () => {
  test('rule 2a: no items record', () => {
    const s = scenario({ fullEdit: (h) => { delete h.items; } });
    const issues = gate(s);
    expect(issues).toEqual([expect.stringContaining(`${FULL}: has no items record`)]);
    expect(issues[0]).toContain('--stamp');
    expect(issues[0]).toContain('full check');
  });

  test('rule 2b: four items not passing is not a near-pass, and three is', () => {
    const keys = () => claimSheet(lessonA(), FIXTURE_SOURCES).items.slice(0, 4).map((i) => i.key);
    const four = scenario({ fullEdit: (h) => { for (const k of keys()) h.verdicts[k] = '⚠️'; } });
    const issues = gate(four);
    expect(issues.join('\n')).toContain('was not a near-pass');
    expect(issues.join('\n')).toContain('4 items did not pass');
    const three = scenario({ fullEdit: (h) => { for (const k of keys().slice(0, 3)) h.verdicts[k] = '⚠️'; } });
    expect(gate(three).join('\n')).not.toContain('near-pass');
  });

  test('rule 2c: one ❌ is not a near-pass', () => {
    const s = scenario({ fullEdit: (h) => { h.verdicts['title'] = '❌'; } });
    const issues = gate(s);
    expect(issues.join('\n')).toContain('was not a near-pass');
    expect(issues.join('\n')).toContain('1 wrong (❌)');
  });
});

describe('rule 3: the re-check judges exactly the items to judge, at most 12', () => {
  test('rule 3a: a verdict key missing, and the message names it', () => {
    const s = scenario({ judged: (all) => all.slice(1) });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: no verdict for ${s.should[0]}, an item to judge`)]);
  });

  test('rule 3b: an extra verdict key, one that is on the sheet but not to be judged', () => {
    const s = scenario({ judged: (all) => [...all, 'title'] });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: a verdict for title, which is not an item to judge`)]);
  });

  test('rule 3c: an extra verdict key that is not on the sheet at all', () => {
    const s = scenario({ recheckEdit: (h) => { h.verdicts['units[9].nowhere'] = '✅'; } });
    expect(gate(s)).toEqual([expect.stringContaining('a verdict for units[9].nowhere, which is not an item to judge')]);
  });

  test('rule 3d: more than 12 items to judge needs a full check, whatever the re-check says', () => {
    const s = scenario({
      edit: (l) => { for (const t of unit(l).learn.terms) t.idea += '!'; for (const f of unit(l).learn.facts) f.value += '!'; for (const x of unit(l).learn.lead) x.text += '!'; unit(l).learn.why[0]!.text += '!'; },
    });
    expect(s.should.length).toBeGreaterThan(12);
    const issues = gate(s);
    expect(issues).toEqual([expect.stringContaining(`${s.should.length} items to judge, more than 12`)]);
    expect(issues[0]).toContain('full check');
  });

  test('rule 3e: exactly 12 items to judge is allowed', () => {
    // Twelve changed parts that nothing traces to: a term, the pattern, a Go deeper, four step paragraphs, five options.
    const s = scenario({
      edit: (l) => {
        const u = unit(l);
        u.learn.terms[1]!.idea += '!';
        u.learn.pattern.note += '!';
        u.learn.deep[0]!.text += '!';
        for (const step of u.steps) step.deep[0]!.text += '!';
        for (const q of u.practice) for (const o of q.options) o.text += '!';
      },
    });
    expect(s.should).toHaveLength(12);
    expect(gate(s)).toEqual([]);
  });
});

describe('rule 4: every re-check verdict passes, and every other item passed the full check', () => {
  test('rule 4a: a re-check verdict that is ⚠️ or ❌ names the key', () => {
    for (const verdict of ['⚠️', '❌']) {
      const s = scenario({ recheckEdit: (h) => { h.verdicts[FACT3] = verdict; } });
      const issues = gate(s);
      expect(issues.join('\n'), verdict).toContain(`${RE}: 1 item(s) did not pass: ${verdict} ${FACT3}`);
      expect(issues.join('\n'), verdict).toContain('re-check again');
    }
  });

  test('rule 4b: an item that did not pass the full check and has not changed since still blocks the pair', () => {
    const s = scenario({ fullEdit: (h) => { h.verdicts['units[0].learn.terms[1] ("term-2")'] = '⚠️'; } });
    const issues = gate(s);
    expect(issues).toEqual([expect.stringContaining(`${FULL}: units[0].learn.terms[1] ("term-2") did not pass the full check (⚠️) and has not changed since`)]);
    expect(issues[0]).toContain('fix it');
  });

  test('rule 4c: an item the full report has no verdict for, and the re-check did not judge, is named', () => {
    const s = scenario({ fullEdit: (h) => { delete h.verdicts['units[0].name']; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${FULL}: no verdict for units[0].name`)]);
  });
});

describe('rule 5: the lesson\'s limit overrides are what the full report lists', () => {
  test('rule 5a: overrides added since the full check', () => {
    const s = scenario({ edit: (l) => { reword(l); l.overrides = [{ limit: 'steps' as const, max: 12, reason: 'Two units are one idea.' }]; } });
    const issues = gate(s);
    expect(issues).toEqual([expect.stringContaining(`${RE}: the lesson's limit overrides are not those of the full report`)]);
    expect(issues[0]).toContain('full check');
  });

  test('rule 5b: overrides that the full report lists and the lesson still has pass', () => {
    const ov = [{ limit: 'steps' as const, max: 12, reason: 'Two units are one idea.' }];
    const s = scenario({ edit: (l) => { reword(l); l.overrides = structuredClone(ov); }, fullEdit: () => {} });
    // The full report was made when the lesson already had them.
    const sheetA = claimSheet({ ...lessonA(), overrides: ov }, FIXTURE_SOURCES);
    const full = stampedReportFor(sheetA);
    const lessonB = lessonA();
    reword(lessonB);
    lessonB.overrides = ov;
    const sheetB = claimSheet(lessonB, FIXTURE_SOURCES);
    const judged = itemsToJudge(JSON.parse(/```json fact-check\n([\s\S]*?)\n```/.exec(full)![1]!).items, sheetB).judge;
    expect(checkPair(sheetB, full, recheckReportFor(sheetB, sheetA.hash, judged), FULL, RE)).toEqual([]);
    expect(s.sheetB.overrides).toEqual(ov);
  });

  test('rule 5c: a re-check that carries overrides cannot be read', () => {
    const s = scenario({ recheckEdit: (h) => { h.overrides = []; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: cannot be read: its header has "overrides"`)]);
  });
});

describe('rule 6: every source on the sheet is current, in the re-check if a re-checked item cites it, else in the full report', () => {
  test('rule 6a: a source a re-checked item cites that the re-check does not list', () => {
    const s = scenario({ recheckEdit: (h) => { h.sources = []; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: does not say whether source "rfc-example" is current`)]);
  });

  test('rule 6b: the full report\'s listing of that source does not stand in for the re-check\'s', () => {
    const s = scenario({ recheckEdit: (h) => { h.sources = h.sources.filter((x) => x.id !== 'rfc-example'); } });
    expect(s.full).toContain('"id": "rfc-example"');
    expect(gate(s)).not.toEqual([]);
  });

  test('rule 6c: a source the re-check lists as not current', () => {
    const s = scenario({ recheckEdit: (h) => { h.sources[0]!.current = false; h.sources[0]!.note = 'Obsoleted.'; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: source "rfc-example" is not current (Obsoleted.)`)]);
  });

  test('rule 6d: a source no re-checked item cites is taken from the full report, and not current there blocks', () => {
    const s = scenario({ fullEdit: (h) => { h.sources.find((x) => x.id === 'vendor-example')!.current = false; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${FULL}: source "vendor-example" is not current`)]);
  });

  test('rule 6e: a source no re-checked item cites, missing from the full report', () => {
    const s = scenario({ fullEdit: (h) => { h.sources = h.sources.filter((x) => x.id !== 'vendor-example'); } });
    expect(gate(s)).toEqual([expect.stringContaining(`${FULL}: does not say whether source "vendor-example" is current`)]);
  });
});

describe('rule 7: the re-check\'s quotes', () => {
  const quoteLine = (verdict = '✅') => `\n### ${FACT3} — ${verdict}\n\n- \`rfc-example\` §3.1\n  > Filler words.\n`;

  test('rule 7a: quotes that cannot be read', () => {
    const s = scenario();
    expect(gate(s, { recheck: s.recheck + '\n> a stray line\n' })).toEqual([expect.stringContaining(`${RE}: its quotes cannot be read`)]);
  });

  test('rule 7b: a quote under a key the re-check did not judge', () => {
    const s = scenario();
    const other = s.sheetB.items.find((i) => i.cite.length > 0 && !s.judged.includes(i.key))!;
    const raw = s.recheck + `\n### ${other.key} — ✅\n\n- \`${other.cite[0]!.source}\` §${other.cite[0]!.section}\n  > Filler words.\n`;
    expect(gate(s, { recheck: raw }).join('\n')).toContain(`"${other.key}" is not an item this re-check judged`);
  });

  test('rule 7c: no quotes record', () => {
    const s = scenario({ recheckEdit: (h) => { delete h.quotes; } });
    const issues = gate(s);
    expect(issues).toEqual([expect.stringContaining(`${RE}: the quotes have not been confirmed against the sources`)]);
    expect(issues[0]).toContain('--recheck --quotes <folder of the sources>');
  });

  test('rule 7d: a quote changed after the quote check', () => {
    const s = scenario();
    expect(gate(s, { recheck: s.recheck.replace('> Filler words.', '> Other words.') })).toEqual([expect.stringContaining(`${RE}: a quote changed after the quote check last passed`)]);
  });

  test('rule 7e: the record\'s files are not the sources the quotes name', () => {
    const s = scenario({ recheckEdit: (h) => { (h.quotes as { files: Record<string, string> }).files = {}; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: the quote record's files do not match`)]);
  });

  test('rule 7f: the quote check dated before the re-check', () => {
    const s = scenario({ recheckEdit: (h) => { (h.quotes as { checked: string }).checked = '2026-11-10'; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${RE}: the quote check was last run on 2026-11-10, before the report was checked on 2026-11-11`)]);
  });

  test('rule 7g: a judged item that cites and passes, with no quote', () => {
    const s = scenario();
    const raw = s.recheck.replace(quoteLine(), '\n');
    expect(raw).not.toBe(s.recheck);
    const issues = gate(s, { recheck: raw });
    expect(issues.join('\n')).toContain(`${RE}: 1 item(s) that pass have no quote: ${FACT3}`);
  });

  test('rule 7h: a judged item that does not pass needs no quote', () => {
    const s = scenario({ recheckEdit: (h) => { h.verdicts[FACT3] = '⚠️'; } });
    const issues = gate(s, { recheck: s.recheck.replace(quoteLine('⚠️'), '\n') });
    expect(issues.join('\n')).not.toContain('have no quote');
  });
});

describe('rule 8: the full report\'s own quotes still match its record', () => {
  test('rule 8a: a quote of the full report edited after the fact, and the message names the full report', () => {
    const s = scenario();
    const issues = gate(s, { full: s.full.replace('> Filler words.', '> Edited after the fact.') });
    expect(issues).toEqual([expect.stringContaining(`${FULL}: a quote changed after the quote check last passed`)]);
  });

  test('rule 8b: no quotes record on the full report', () => {
    const s = scenario({ fullEdit: (h) => { delete h.quotes; } });
    expect(gate(s)).toEqual([expect.stringContaining(`${FULL}: the quotes have not been confirmed against the sources`)]);
  });

  test('rule 8c: the full report\'s quotes are not held to the lesson as it is now', () => {
    // pair 4 passes though the full report quotes under keys the lesson has since moved.
    const s = scenario({ edit: (l) => { unit(l).learn.lead.unshift({ id: 'lead-0', text: 'x', cite: structuredClone(unit(l).learn.lead[0]!.cite) }); } });
    expect(s.sheetB.items.map((i) => i.key)).not.toContain('units[0].learn.lead[1] ("lead-1")'.replace('lead[1] ("lead-1")', 'lead[0] ("lead-1")'));
    expect(gate(s)).toEqual([]);
  });
});

describe('the gate\'s other duties with re-checks', () => {
  test('gate 1: a re-check file is not a report with no lesson, and one with no cited lesson is named', () => {
    const s = scenario();
    const orphan = checkFactChecks([s.lessonB], { [FULL_GLOB]: s.full }, FIXTURE_SOURCES, { [RE_GLOB]: s.recheck, '../../docs/fact-checks/no-such-lesson.recheck.md': s.recheck });
    expect(orphan).toEqual([`docs/fact-checks/no-such-lesson.recheck.md: a re-check report with no cited lesson "no-such-lesson"; delete it, or fix its file name.`]);
  });

  test('gate 2: checkedOn is the later of the two dates when the pair passes', () => {
    const s = scenario();
    expect(checkedDate(s.sheetB, s.full, s.recheck)).toBe('2026-11-11');
    const earlier = scenario({ recheckEdit: (h) => { h.checked = '2026-11-01'; (h.quotes as { checked: string }).checked = '2026-11-01'; } });
    expect(checkedDate(earlier.sheetB, earlier.full, earlier.recheck)).toBe('2026-11-08');
  });

  test('gate 3: when the pair does not pass, checkedOn is the full report\'s date, and with no re-check it is as before', () => {
    const s = scenario({ recheckEdit: (h) => { h.verdicts[FACT3] = '⚠️'; } });
    expect(checkedDate(s.sheetB, s.full, s.recheck)).toBe('2026-11-08');
    expect(checkedDate(s.sheetA, s.full, undefined)).toBe('2026-11-08');
    expect(checkedDate(s.sheetA, undefined, undefined)).toBeNull();
  });

  test('gate 4: a re-check beside a current full report does not move the date', () => {
    const s = scenario();
    expect(checkedDate(s.sheetA, s.full, s.recheck)).toBe('2026-11-08');
  });
});
