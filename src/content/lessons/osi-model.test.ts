// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { OSI_WORDS } from '../../art/scenes/osi-stacks';
import { showSweep } from '../../test/show-sweep';
import { type CitedPart, citationsOf, citedPartsOf } from '../cited';
import { checkStructure } from '../define';
import { checkLimits } from '../limits';
import type { Backing, Lesson, MessageEvent, MessageLabels, SceneEvent } from '../schema';
import type { Citation } from '../sources';
// `src/test/lesson-references.ts` re-exports `textsOf` from here, but it also loads the registry, whose fact-check gate
// refuses this lesson until its report exists; the function is the same.
import { textsAt, textsOf } from '../texts';
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

const stepNamed = (id: string) => {
  const step = unit.steps.find((s) => s.id === id);
  if (step === undefined) throw new Error(`No step "${id}"`);
  return step;
};

/** The steps for layers 6 to 2 on the laptop, each with its layer. */
const LAYER_STEPS: [string, number][] = [
  ['presentation', 6],
  ['session', 5],
  ['transport', 4],
  ['network', 3],
  ['data-link', 2],
];

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
  expect(unit.steps.map((s) => s.title)).toEqual([
    'Application Layer',
    'Presentation Layer',
    'Session Layer',
    'Transport Layer',
    'Network Layer',
    'Data Link Layer',
    'Physical Layer',
    'Relay',
    'Decapsulation',
    'Peer Layers',
  ]);
  // One step for each layer on the way down, so the lesson is over the track's six (owner, 2026-11-08).
  expect(osiModel.overrides).toEqual([{ limit: 'steps', max: 10, reason: expect.any(String) }]);
});

test('each step plays the cues the spec lists', () => {
  const cues = unit.steps.map((s) => s.events.flatMap((e) => (e.type === 'table' ? [] : (e.cues ?? [])).map((c) => `${c.cue} ${c.arg}`)));
  expect(cues).toEqual([
    ['layer laptop:7'],
    ['layer laptop:6'],
    ['layer laptop:5'],
    ['layer laptop:4'],
    ['layer laptop:3'],
    ['layer laptop:2'],
    ['layer laptop:1'],
    ['layer router:1', 'layer router:2', 'layer router:3', 'layer router:2', 'layer router:1'],
    ['layer server:1', 'layer server:2', 'layer server:3', 'layer server:4', 'layer server:5', 'layer server:6', 'layer server:7'],
    ['peer 7', 'peer 6', 'peer 5', 'peer 4', 'peer 3', 'peer 2', 'peer 1'],
  ]);
});

test('the headers go on outermost-last going down and come off going up', () => {
  const pairs = (id: string) =>
    stepNamed(id).events.map((e) => {
      const labels: MessageLabels | undefined = e.type === 'table' ? undefined : e.labels;
      return labels?.mark === undefined ? [labels?.list] : [labels.list, labels.mark];
    });
  // Layer 7 adds the first header; each layer below adds its own in front, as the outermost.
  expect(pairs('application')).toEqual([[[7], { n: 7, kind: 'new' }]]);
  for (const [id, n] of LAYER_STEPS) expect(pairs(id), id).toEqual([[from(n), { n, kind: 'new' }]]);
  // Layer 1 adds none, and the bits carry all six.
  expect(pairs('physical')).toEqual([[from(2)], [from(2)]]);
  // The router's layer 2 reads header 2 and passes the rest up, so layer 3 sees five (lead-6). Going back down, layer 2
  // adds its own header 2 for the next hop (lead-3, lead-5), and the message leaves with six again.
  expect(pairs('relay')).toEqual([
    [from(2)],
    [from(2), { n: 2, kind: 'read' }],
    [from(3), { n: 3, kind: 'read' }],
    [from(2), { n: 2, kind: 'new' }],
    [from(2)],
    [from(2)],
  ]);
  // The server's layer 1 takes the bits; each layer above reads its header, the outermost left, and it comes off.
  expect(pairs('decapsulation')).toEqual([[from(2)], ...[2, 3, 4, 5, 6, 7].map((n) => [from(n), { n, kind: 'read' }])]);
  expect(pairs('peer-layers')).toEqual(Array.from({ length: 7 }, () => [[]]));
});

test('the bits ride only the two cables, as 0101', () => {
  expect(messages.map((m) => [`${m.from}>${m.to}`, m.tag, m.kind])).toEqual([
    ['laptop>router', '0101', 'request'],
    ['router>server', '0101', 'request'],
  ]);
});

test('Learn has the spec’s ids', () => {
  const { learn } = unit;
  expect(learn.lead.map((s) => s.id)).toEqual(['lead-1', 'lead-2', 'job-6', 'job-5', 'job-4', 'job-3', 'job-2', 'lead-3', 'lead-4', 'lead-5', 'lead-6', 'lead-7']);
  expect(learn.lead.filter((s) => s.analogy === true).map((s) => s.id)).toEqual(['lead-7']);
  expect(learn.terms.map((t) => t.id)).toEqual(['term-layer', 'term-header', 'term-encap', 'term-decap', 'term-peer', 'term-relay']);
  expect(learn.pattern.id).toBe('pattern');
  // Down, across, up: the three moves the pattern's note names, each a step title or a term.
  expect(learn.pattern.names).toEqual(['Encapsulation', 'Relay', 'Decapsulation']);
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
  // 6.1.3's Figure 11 draws the peer protocol between two open systems: the twin is on another machine.
  expect(sections(unit.learn.terms.find((t) => t.id === 'term-peer')!.cite)).toEqual(['itu-x200 5.2.1.3', 'itu-x200 5.2.2.7', 'itu-x200 6.1.3']);
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

/**
 * Each part of Watch and the scene: what it says, and the traces that back it. A step's fact or event is judged by its
 * own traces, as the fact-checker reads its Traces line; the step's narrative, title and sub by the step's.
 */
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
        ...s.facts.map((f) => ({ at: `step "${s.id}" fact "${f.label}"`, texts: [f.label, f.value], traces: tracesOf(f.backing) })),
        ...s.events.map((e) => ({
          at: `step "${s.id}" event "${e.id}"`,
          texts: e.type === 'table' ? [e.summary] : textsOf({ log: e.log, plain: e.plain }),
          traces: tracesOf(e.backing),
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

/** The Watch parts that say `word` but trace no Learn part that says it. */
function unbackedFor(word: RegExp): string[] {
  const learn = learnTexts();
  const saying = watchParts().filter((p) => p.texts.some((t) => word.test(t)));
  // Watch says each word somewhere, so the check is not empty.
  expect(saying.length, String(word)).toBeGreaterThan(0);
  return saying.filter((p) => !p.traces.some((id) => word.test(learn.get(id) ?? ''))).map((p) => `${p.at} (traces ${p.traces.join(', ')})`);
}

test('Watch’s "cable" and "hop" rest on Learn statements that say them', () => {
  for (const word of [/\bcable\b/i, /\bhop\b/i]) expect(unbackedFor(word), String(word)).toEqual([]);
});

test('Watch’s bits, reading, adding, jobs and reference model rest on Learn statements that say them', () => {
  // The router's events and facts, and the scene's plate and legend, were the parts the first fact-check found tracing
  // Learn statements that don't say these.
  for (const word of [/\bbits\b/i, /\breads?\b/i, /\badds?\b/i, /\bjobs?\b/i, /\breference model\b/i]) {
    expect(unbackedFor(word), String(word)).toEqual([]);
  }
  // Going back down, the router's layer 2 adds a header of its own: nothing says it replaces one.
  expect(readerTexts(osiModel).filter((t) => /\breplac/i.test(t))).toEqual([]);
});

/** What a cited part says, without its citations. */
const saidBy = (p: CitedPart): string[] =>
  textsAt(p.value)
    .filter((t) => !t.path.startsWith('cite'))
    .map((t) => t.text);

test('every part that gives a layer’s number cites X.200 6.1.2, the one section that numbers the layers', () => {
  const numbering = citedPartsOf(osiModel).filter((p) => saidBy(p).some((t) => /\blayers? [1-7]\b/i.test(t)));
  expect(numbering.length).toBeGreaterThan(6);
  expect(numbering.filter((p) => !p.cite.some((c) => c.source === 'itu-x200' && c.section === '6.1.2')).map((p) => p.at)).toEqual([]);
});

test('each clause the first fact-check found on one source cites an X.200 section that states it', () => {
  const { learn } = unit;
  const statement = (id: string): Citation[] => [...learn.lead, ...learn.terms, ...learn.why, learn.pattern].find((s) => s.id === id)!.cite;
  const option = (q: string, i: number): Citation[] => unit.practice.find((p) => p.id === q)!.options[i]!.cite;
  const wanted: [string, Citation[], string[]][] = [
    // The expansion of OSI (1.2) and the Reference Model's name (1.1); each layer's own functions (5.2.2.5, 6.2.1 c and d).
    ['lead-2', statement('lead-2'), ['1.1', '1.2', '5.2.2.5', '6.2.1']],
    // Each layer above the lowest works through the one below, so at the far end the bundle comes back up layer by layer.
    ['lead-4', statement('lead-4'), ['5.2.2.4']],
    ['term-layer', statement('term-layer'), ['5.2.2.5', '6.2.1']],
    ['pattern', statement('pattern'), ['5.2.2.4']],
    // Principle f: a layer can be redesigned without changing the services the layers beside it expect; 7.4.2.1 and
    // 7.5.2.3 say the same of the Transport and Network Layers.
    ['why-1', statement('why-1'), ['6.2.1', '7.4.2.1', '7.5.2.3']],
    // A system that only passes data on need not contain the higher layers (5.2.2.3's NOTE, 6.1.6's Figure 12), and any
    // relaying is in the Network Layer or below (7.5.2.4).
    ['why-2', statement('why-2'), ['5.2.2.3', '6.1.2', '6.1.6', '7.4.2.3', '7.5.2.4']],
    ['router-layers, the right option', option('router-layers', 0), ['6.1.2', '6.1.6', '7.5.2.1']],
    ['going-down, "Sends it straight to the cable"', option('going-down', 2), ['5.2.2.3', '5.2.2.4']],
  ];
  for (const [at, cites, sections] of wanted) {
    expect(
      cites.filter((c) => c.source === 'itu-x200').map((c) => c.section),
      at,
    ).toEqual(expect.arrayContaining(sections));
  }
});

test('nothing said in X.200’s name uses "header", a word X.200 never uses', () => {
  const inX200sName = citedPartsOf(osiModel).filter((p) => saidBy(p).some((t) => /\bX\.200\b/.test(t)));
  expect(inX200sName.length).toBeGreaterThan(4);
  expect(inX200sName.filter((p) => saidBy(p).some((t) => /\bheaders?\b/i.test(t))).map((p) => p.at)).toEqual([]);
});

test('Learn and Practice say a layer’s control information is usually a header in front, not always', () => {
  const lead = (id: string) => unit.learn.lead.find((s) => s.id === id)!.text;
  const right = unit.practice.find((q) => q.id === 'going-down')!.options[0]!;
  // X.200 sets no position for it (Figure 9, Note 2), and NIST says only "typically" a header.
  for (const text of [lead('lead-3'), lead('lead-6'), right.text, right.feedback]) expect(text).toMatch(/\busually\b/);
  // Layer 1 adds no header in Watch, so lead-3 does not say each or every layer does.
  expect(lead('lead-3')).not.toMatch(/\b(each|every) layer\b/i);
});

test('the first fact-check’s precision fixes hold', () => {
  const going = unit.practice.find((q) => q.id === 'going-down')!.options;
  // A layer may split what the layer above handed it (segmenting, X.200 5.8.1.9), so nothing says it stays whole.
  expect(going[1]!.feedback).not.toMatch(/\bwhole\b/);
  // The lowest layer has no layer below to serve it (X.200 5.2.2.4).
  expect(going[2]!.feedback).toMatch(/\babove the lowest\b/);
  // RFC 1122 §1.3.3: a packet may be a whole datagram or a fragment of one.
  const deep3 = unit.learn.deep.find((p) => p.id === 'deep-3')!.text;
  expect(deep3).not.toMatch(/datagram\*\*, or \*\*packet/);
  expect(deep3).toMatch(/\bfragment/);
  // Step 6 says what its traces say: a header is written for its twin and read there, not that a layer works only with it.
  expect(stepNamed('peer-layers').narrative).not.toMatch(/\bonly ever\b/);
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
  // 13 positions (the Overview, 10 steps, Learn, Practice) and each of the 28 events once more.
  expect(events).toHaveLength(28);
  expect(showSweep(osiModel)).toBe(41);
});

test('layers 6 to 2 each have a step of their own, saying their own job', () => {
  const { learn } = unit;
  // The X.200 section that gives each layer's purpose, which its job statement must cite.
  const purpose: Record<number, string> = { 6: '7.2.2.2', 5: '7.3.2.1', 4: '7.4.2.1', 3: '7.5.4.2.1', 2: '7.6.2.2' };
  const plains: string[] = [];
  for (const [id, n] of LAYER_STEPS) {
    const step = stepNamed(id);
    expect(step.title, id).toBe(`${['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation'][n]} Layer`);
    // The step lights its layer once, and says more than that a header went on.
    expect(step.events.map((e) => (e.type === 'table' ? '' : e.cues?.map((c) => c.arg).join())), id).toEqual([`laptop:${n}`]);
    const plain = step.events[0]!.type === 'table' ? '' : step.events[0]!.plain;
    expect(plain.replace(/,? and adds header \d( in front)?\.$/, '').length, id).toBeGreaterThan(20);
    plains.push(plain);
    // Its job is a Learn statement, which the step and its event trace and which cites X.200 at that layer's purpose.
    const job = learn.lead.find((s) => s.id === `job-${n}`);
    expect(job, id).toBeDefined();
    expect(tracesOf(step.backing), id).toContain(`job-${n}`);
    expect(tracesOf(step.events[0]!.backing), id).toContain(`job-${n}`);
    expect(
      job!.cite.filter((c) => c.source === 'itu-x200').map((c) => c.section),
      id,
    ).toEqual(expect.arrayContaining(['6.1.2', purpose[n]!]));
  }
  expect(new Set(plains).size).toBe(plains.length);
  expect(new Set(LAYER_STEPS.map(([id]) => stepNamed(id).narrative)).size).toBe(LAYER_STEPS.length);
});

test('the layers say only what their sources say', () => {
  const job = (n: number) => unit.learn.lead.find((s) => s.id === `job-${n}`)!.text;
  // NIST: the Transport Layer "can optionally assure the reliability"; UDP is unreliable. So layer 4 can, not does.
  expect(job(4)).toMatch(/\bcan\b/);
  expect(job(4)).not.toMatch(/\b(always|guarantees?|ensures?|makes sure)\b/i);
  // Explainers put encryption and compression at layer 6; X.200 does not, so the lesson does not either.
  expect(readerTexts(osiModel).filter((t) => /\b(encrypt|compress)/i.test(t))).toEqual([]);
});

test('framing is said only of connection mode, where X.200 7.6.4 lists it', () => {
  // X.200 7.6.4: error detection is a Data Link function in both modes; delimiting and synchronization (framing,
  // 7.6.4.5) is one of those "also performed" in connection-mode only.
  const framing = citedPartsOf(osiModel).filter((p) => saidBy(p).some((t) => /\bframing\b/i.test(t)));
  expect(framing.length).toBeGreaterThan(0);
  for (const p of framing) {
    expect(saidBy(p).join(' '), p.at).toMatch(/\bin connection mode\b/i);
    expect(p.cite.filter((c) => c.source === 'itu-x200').map((c) => c.section), p.at).toContain('7.6.4');
  }
});
