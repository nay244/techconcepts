// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { OSI_WORDS } from '../../art/scenes/osi-stacks';
import { showSweep } from '../../test/show-sweep';
import { citationsOf } from '../cited';
import { checkStructure } from '../define';
import { checkLimits } from '../limits';
import type { Backing, Lesson, MessageEvent, MessageLabels, SceneEvent } from '../schema';
// `src/test/lesson-references.ts` re-exports `textsOf` from here, but it also loads the registry, whose fact-check gate
// refuses this lesson until its report exists; the function is the same.
import { textsOf } from '../texts';
import { networkingTrack } from '../tracks';
import osiModel from './osi-model';

afterEach(() => {
  document.body.innerHTML = '';
});

const unit = osiModel.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');

/** Layers `n` up to 7: the headers a message carries once layer `n` has added its own. */
const from = (n: number): number[] => Array.from({ length: 8 - n }, (_, i) => n + i);

test('the lesson keeps the Networking limits', () => {
  expect(checkLimits(osiModel, networkingTrack.limits)).toEqual([]);
});

test('the lesson is what the spec says', () => {
  expect(osiModel.figure).toBe('osi');
  expect(osiModel.level).toBe('beginner');
  expect(osiModel.certTags).toEqual(['a-plus', 'network-plus', 'ccna']);
  expect(unit.osi).toBe('spans');
  expect(unit.scene.views).toEqual(['network']);
  expect(unit.scene.panel).toEqual({ type: 'labels' });
  expect(Object.keys(unit.scene.labels).sort()).toEqual([...OSI_WORDS].sort());
  expect(unit.steps.map((s) => s.title)).toEqual(['Application Layer', 'Encapsulation', 'Physical Layer', 'Relay', 'Decapsulation', 'Peer Layers']);
});

test('each step plays the cues the spec lists', () => {
  const cues = unit.steps.map((s) => s.events.flatMap((e) => (e.type === 'table' ? [] : (e.cues ?? [])).map((c) => `${c.cue} ${c.arg}`)));
  expect(cues).toEqual([
    ['layer laptop:7'],
    ['layer laptop:6', 'layer laptop:5', 'layer laptop:4', 'layer laptop:3', 'layer laptop:2'],
    ['layer laptop:1'],
    ['layer router:1', 'layer router:2', 'layer router:3', 'layer router:2', 'layer router:1'],
    ['layer server:1', 'layer server:2', 'layer server:3', 'layer server:4', 'layer server:5', 'layer server:6', 'layer server:7'],
    ['peer 7', 'peer 6', 'peer 5', 'peer 4', 'peer 3', 'peer 2', 'peer 1'],
  ]);
});

test('the headers go on outermost-last going down and come off going up', () => {
  const pairs = (step: number) =>
    unit.steps[step]!.events.map((e) => {
      const labels: MessageLabels | undefined = e.type === 'table' ? undefined : e.labels;
      return labels?.mark === undefined ? [labels?.list] : [labels.list, labels.mark];
    });
  // Layer 7 adds the first header; each layer below adds its own in front, as the outermost.
  expect(pairs(0)).toEqual([[[7], { n: 7, kind: 'new' }]]);
  expect(pairs(1)).toEqual([6, 5, 4, 3, 2].map((n) => [from(n), { n, kind: 'new' }]));
  // Layer 1 adds none, and the bits carry all six.
  expect(pairs(2)).toEqual([[from(2)], [from(2)]]);
  // The router reads headers 2 and 3, and the message leaves it with the same six.
  expect(pairs(3)).toEqual([[from(2)], [from(2), { n: 2, kind: 'read' }], [from(2), { n: 3, kind: 'read' }], [from(2)], [from(2)], [from(2)]]);
  // The server's layer 1 takes the bits; each layer above reads its header, the outermost left, and it comes off.
  expect(pairs(4)).toEqual([[from(2)], ...[2, 3, 4, 5, 6, 7].map((n) => [from(n), { n, kind: 'read' }])]);
  expect(pairs(5)).toEqual(Array.from({ length: 7 }, () => [[]]));
});

test('the bits ride only the two cables, as 0101', () => {
  expect(messages.map((m) => [`${m.from}>${m.to}`, m.tag, m.kind])).toEqual([
    ['laptop>router', '0101', 'request'],
    ['router>server', '0101', 'request'],
  ]);
});

test('Learn has the spec’s ids', () => {
  const { learn } = unit;
  expect(learn.lead.map((s) => s.id)).toEqual(['lead-1', 'lead-2', 'lead-3', 'lead-4', 'lead-5', 'lead-6', 'lead-7']);
  expect(learn.lead.filter((s) => s.analogy === true).map((s) => s.id)).toEqual(['lead-7']);
  expect(learn.terms.map((t) => t.id)).toEqual(['term-layer', 'term-header', 'term-encap', 'term-decap', 'term-peer', 'term-relay']);
  expect(learn.pattern.id).toBe('pattern');
  expect(learn.pattern.names).toEqual(unit.steps.map((s) => s.title));
  expect(learn.why.map((s) => s.id)).toEqual(['why-1', 'why-2']);
  expect(learn.deep.map((p) => p.id)).toEqual(['deep-1', 'deep-2', 'deep-3']);
  // §5's fact-2 is two facts, Top and Bottom, and each fact has its own id.
  expect(learn.facts.map((f) => [f.id, f.label, f.value])).toEqual([
    ['fact-1', 'Layers', '7'],
    ['fact-2-top', 'Top', '7 Application'],
    ['fact-2-bottom', 'Bottom', '1 Physical'],
    ['fact-3', 'Defined in', 'ITU-T X.200, the same text as ISO/IEC 7498-1'],
  ]);
});

test('peer and router rest on the sections that say them, and RFC 1122 is cited by the page each section starts on', () => {
  const sections = (cites: { source: string; section: string }[]) => cites.map((c) => `${c.source} ${c.section}`);
  // X.200 5.2.1.3 defines peer-(N)-entities; RFC 1122 §1.1.1 names the machines joining networks "IP routers".
  expect(sections(unit.learn.terms.find((t) => t.id === 'term-peer')!.cite)).toEqual(['itu-x200 5.2.1.3', 'itu-x200 5.2.2.7']);
  expect(sections(unit.learn.lead.find((s) => s.id === 'lead-5')!.cite)).toContain('rfc-1122 1.1.1');
  // rfc1122.html has no id below the top-level sections, but it marks every page.
  const rfc1122 = [...new Map(citationsOf(unit).filter((c) => c.source === 'rfc-1122').map((c) => [c.section, c.url])).entries()].sort();
  const page = (n: number) => `https://www.rfc-editor.org/rfc/rfc1122.html#page-${n}`;
  expect(rfc1122).toEqual([
    ['1.1.1', page(6)],
    ['1.1.3', page(8)],
    ['1.3.3', page(17)],
  ]);
});

test('every X.200 link names a PDF page', () => {
  const x200 = citationsOf(unit).filter((c) => c.source === 'itu-x200');
  expect(x200.length).toBeGreaterThan(0);
  expect(x200.filter((c) => !/#page=\d+$/.test(c.url)).map((c) => `${c.section}: ${c.url}`)).toEqual([]);
});

const tracesOf = (backing: Backing | undefined): string[] => (backing !== undefined && 'traces' in backing ? backing.traces : []);

/** Each part of Watch and the scene: what it says, and the traces that back it (a step's fact or event takes its step's too). */
function watchParts(): { at: string; texts: string[]; traces: string[] }[] {
  const { scene, overview } = unit;
  return [
    { at: 'scene', texts: textsOf({ title: scene.title, labels: scene.labels, log: scene.log }), traces: tracesOf(scene.backing) },
    { at: 'overview hook', texts: [overview.hook], traces: tracesOf(overview.hookBacking) },
    { at: 'overview description', texts: [overview.description], traces: tracesOf(overview.backing) },
    ...overview.facts.map((f) => ({ at: `overview fact "${f.label}"`, texts: [f.label, f.value], traces: tracesOf(f.backing) })),
    ...unit.steps.flatMap((s) => {
      const own = tracesOf(s.backing);
      return [
        { at: `step "${s.id}"`, texts: [s.title, s.sub, s.narrative], traces: own },
        ...s.facts.map((f) => ({ at: `step "${s.id}" fact "${f.label}"`, texts: [f.label, f.value], traces: [...tracesOf(f.backing), ...own] })),
        ...s.events.map((e) => ({
          at: `step "${s.id}" event "${e.id}"`,
          texts: e.type === 'table' ? [e.summary] : textsOf({ log: e.log, plain: e.plain }),
          traces: [...tracesOf(e.backing), ...own],
        })),
      ];
    }),
  ];
}

/** Every Learn part a trace may name, by id, with all its words. */
function learnTexts(): Map<string, string> {
  const { learn } = unit;
  return new Map([
    ...[...learn.lead, ...learn.why, ...learn.deep].map((s) => [s.id, s.text] as const),
    ...learn.terms.map((t) => [t.id, `${t.idea} ${t.name}`] as const),
    [learn.pattern.id, [...learn.pattern.names, learn.pattern.note].join(' ')] as const,
    ...learn.facts.map((f) => [f.id, `${f.label} ${f.value}`] as const),
  ]);
}

test('Watch’s "cable" and "hop" rest on Learn statements that say them', () => {
  const learn = learnTexts();
  for (const word of [/\bcable\b/i, /\bhop\b/i]) {
    const saying = watchParts().filter((p) => p.texts.some((t) => word.test(t)));
    // Watch says each word somewhere, so the check below is not empty.
    expect(saying.length, String(word)).toBeGreaterThan(0);
    const unbacked = saying.filter((p) => !p.traces.some((id) => word.test(learn.get(id) ?? ''))).map((p) => `${p.at} (traces ${p.traces.join(', ')})`);
    expect(unbacked, String(word)).toEqual([]);
  }
});

/** A copy of the lesson with one change to the event `id`. */
function changed(id: string, change: (e: SceneEvent) => void): Lesson {
  const copy = structuredClone(osiModel);
  const event = copy.units[0]!.steps.flatMap((s) => s.events).find((e) => e.id === id);
  if (event === undefined) throw new Error(`No event "${id}"`);
  change(event);
  return copy;
}

const withCue = (id: string, cue: string, arg: string) =>
  changed(id, (e) => {
    if (e.type !== 'table') e.cues = [{ cue, arg }];
  });

test('the validator refuses what the figure cannot show', () => {
  expect(checkStructure(osiModel)).toEqual([]);
  const one = (lesson: Lesson, issue: string) => expect(checkStructure(lesson)).toEqual([expect.stringContaining(issue)]);
  // The router has only three layers, every stack stops at 7, and there is no phone.
  one(withCue('router-3', 'layer', 'router:4'), 'cue "layer" arg "router:4" is not one the osi figure can show');
  one(withCue('laptop-7', 'layer', 'laptop:8'), 'cue "layer" arg "laptop:8" is not one the osi figure can show');
  one(withCue('laptop-7', 'layer', 'phone:1'), 'cue "layer" arg "phone:1" is not one the osi figure can show');
  one(withCue('peer-1', 'peer', '0'), 'cue "peer" arg "0" is not one the osi figure can show');
  // The laptop's cable reaches the router, not the server.
  const skipping = changed('bits-to-router', (e) => {
    if (e.type === 'message') e.to = 'server';
  });
  one(skipping, 'rides from "laptop" to "server", a way the osi figure does not have');
});

/** Every string a reader sees: the lesson's names, the scene's words and log, Overview, Watch, Learn and Practice. */
function readerTexts(lesson: Lesson): string[] {
  return textsOf({
    title: lesson.title,
    subtitle: lesson.subtitle,
    summary: lesson.summary,
    units: lesson.units.map((u) => ({
      name: u.name,
      fullName: u.fullName,
      purpose: u.purpose,
      scene: { title: u.scene.title, labels: u.scene.labels, log: u.scene.log, parties: u.scene.parties },
      overview: { hook: u.overview.hook, description: u.overview.description, facts: u.overview.facts.map((f) => [f.label, f.value]) },
      steps: u.steps.map((s) => ({
        title: s.title,
        sub: s.sub,
        narrative: s.narrative,
        deep: s.deep.map((p) => p.text),
        facts: s.facts.map((f) => [f.label, f.value]),
        events: s.events.map((e) => (e.type === 'table' ? e.summary : { log: e.log, plain: e.plain })),
      })),
      learn: {
        lead: u.learn.lead.map((s) => s.text),
        terms: u.learn.terms.map((t) => [t.idea, t.name]),
        pattern: [...u.learn.pattern.names, u.learn.pattern.note],
        why: u.learn.why.map((s) => s.text),
        deep: u.learn.deep.map((p) => p.text),
        facts: u.learn.facts.map((f) => [f.label, f.value]),
      },
      practice: u.practice.map((q) => [q.prompt, ...q.options.flatMap((o) => [o.text, o.feedback])]),
    })),
  });
}

test('a reader sees "header", never "label"', () => {
  const texts = readerTexts(osiModel);
  // Every step's narrative, sub and events, Learn and Practice are in the list.
  expect(texts.length).toBeGreaterThan(150);
  expect(texts.filter((t) => /\blabels?\b/i.test(t))).toEqual([]);
  expect(texts.some((t) => /\bheaders?\b/.test(t))).toBe(true);
});

test('the figure shows the same thing however it is reached', () => {
  // 9 positions (the Overview, 6 steps, Learn, Practice) and each of the 28 events once more.
  expect(events).toHaveLength(28);
  expect(showSweep(osiModel)).toBe(37);
});
