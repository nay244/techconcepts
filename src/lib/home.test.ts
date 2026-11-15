// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, expect, test, vi } from 'vitest';
import { getEntries, getLesson, trackTotals } from '../content/registry';
import { SOURCES } from '../content/sources';
import { tracks } from '../content/tracks';
import type { Lesson } from '../content/schema';
import { numberedSources } from '../lesson/sourceNumbers';
import { lessonStamp } from './checked';
import { foldSources, homeDemo, homeStops, leadText, litSteps, sourceName } from './home';

// Lessons the registry hands out in place of the real ones, by slug; empty unless a test sets one.
const swapped = vi.hoisted(() => new Map<string, unknown>());
vi.mock('../content/registry', async (original) => {
  const real = await original<typeof import('../content/registry')>();
  return { ...real, getLesson: (slug: string) => swapped.get(slug) ?? real.getLesson(slug) };
});
afterEach(() => swapped.clear());

const HTTP = () => getLesson('what-is-http')!.units[0]!;

// ---------------------------------------------------------------- the lesson you can try on Home

test('the demo is lesson 1, HTTP: every Watch step of how a web page arrives, in the lesson’s own words', () => {
  const demo = homeDemo();
  const unit = HTTP();
  expect(demo.lesson).toMatchObject({ title: 'HTTP', fullName: 'Hypertext Transfer Protocol', url: '/how-the-internet-works/what-is-http', number: 1, track: 'How the Internet Works' });
  expect(demo.steps.map((s) => s.title)).toEqual(['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render Page']);
  demo.steps.forEach((step, i) => {
    expect(step).toMatchObject({ n: i + 1, id: unit.steps[i]!.id, title: unit.steps[i]!.title, sub: unit.steps[i]!.sub, narrative: unit.steps[i]!.narrative });
  });
});

test('each step lists the messages it sends, between the scene’s own parties', () => {
  const demo = homeDemo();
  const unit = HTTP();
  const labels = new Set(unit.scene.parties.map((p) => p.label));
  // Typing the address sends nothing; every step after it sends at least a question and its answer.
  expect(demo.steps[0]!.messages).toEqual([]);
  demo.steps.slice(1).forEach((step, i) => {
    const sent = unit.steps[i + 1]!.events.filter((e) => e.type === 'message');
    expect(step.messages.map((m) => m.tag), step.title).toEqual(sent.map((e) => e.tag));
    expect(step.messages.length, step.title).toBeGreaterThanOrEqual(2);
    for (const m of step.messages) {
      expect(labels.has(m.from) && labels.has(m.to), `${m.from} → ${m.to}`).toBe(true);
      expect(['request', 'response']).toContain(m.kind);
    }
  });
  expect(demo.steps[1]!.messages[0]).toMatchObject({ from: 'Laptop', to: 'DNS resolver', tag: 'LOOKUP' });
  expect(demo.steps[3]!.messages.map((m) => m.tag)).toEqual(['GET /', '200 OK']);
});

test('the demo’s scene is the lesson’s map with only its own layer, and each step lights a real way across it', () => {
  const demo = homeDemo();
  expect(demo.scene).toMatch(/^<svg data-figure="net-map"/);
  expect(demo.scene).toMatch(/ role="img" aria-label="[^"]{40,}"/);
  expect([...demo.scene.matchAll(/data-layer="([^"]+)"/g)].every((m) => m[1] === 'http:web')).toBe(true);
  expect(demo.scene).not.toContain('display="none"><g data-layer');
  // The lesson's labels are filled in: the address the visitor types.
  expect(demo.scene).toContain('example.net');
  // One lit way per step that sends something, drawn in the scene itself, hidden until its step.
  expect(demo.steps[0]!.lights).toEqual({ trail: false, busy: ['nm-busy-laptop'] });
  for (const step of demo.steps.slice(1)) {
    expect(step.lights.trail, step.title).toBe(true);
    expect(demo.scene).toMatch(new RegExp(`<polyline class="nm-trail home-trail" data-step="${step.n}" points="[-\\d. ,]{20,}"`));
    for (const id of step.lights.busy) expect(demo.scene, id).toContain(`id="${id}"`);
  }
  expect(demo.steps[1]!.lights.busy).toEqual(['nm-busy-laptop', 'nm-busy-resolver']);
  expect(demo.steps[3]!.lights.busy).toEqual(['nm-busy-laptop', 'nm-http-busy-web']);
  expect(demo.scene.match(/class="nm-trail home-trail"/g)).toHaveLength(demo.steps.length - 1);
});

test('the demo’s Learn part is the lesson’s lead, its ideas with their names, and its sources', () => {
  const { learn } = homeDemo();
  const unit = HTTP();
  expect(learn.lead).toBe(unit.learn.lead.map((s) => s.text).join(' '));
  expect(learn.terms.length).toBeGreaterThanOrEqual(4);
  expect(learn.terms).toEqual(unit.learn.terms.slice(0, learn.terms.length).map((t) => ({ idea: t.idea, name: t.name })));
  expect(learn.sources.map(({ label, url }) => ({ label, url }))).toEqual(numberedSources(unit).list.map((r) => ({ label: r.label, url: r.url })));
  expect(learn.sources.every((s) => s.url.startsWith('https://'))).toBe(true);
});

test('Learn ends on the sealed version: HTTPS, the next lesson, in that lesson’s own words', () => {
  const { sealed } = homeDemo();
  const https = getLesson('what-is-https')!;
  expect(sealed).toEqual({ title: 'HTTPS', lead: https.units[0]!.learn.lead.map((s) => s.text).join(' '), url: '/how-the-internet-works/what-is-https', number: 2 });
  expect(sealed.lead).toContain('seal the line');
});

test('the sealed box reads the checked lead, word for word: two statements, one space between', () => {
  expect(homeDemo().sealed.lead).toBe(
    'HTTPS is HTTP with one extra job before the asking: seal the line. After that the conversation is the same, but only the two ends can read it.',
  );
});

test('the lesson Home’s “And HTTPS?” points to is a checked one, with the day it passed', () => {
  const slug = homeDemo().sealed.url.split('/').at(-1)!;
  expect(lessonStamp(getLesson(slug)!).checked, `${slug} has no check date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test('the demo’s Practice part is the lesson’s first question, with exactly one right answer', () => {
  const { practice } = homeDemo();
  const question = HTTP().practice[0]!;
  expect(practice.prompt).toBe(question.prompt);
  expect(practice.options.map((o) => o.text)).toEqual(question.options.map((o) => o.text));
  expect(practice.options.filter((o) => o.right)).toHaveLength(1);
  expect(practice.options.findIndex((o) => o.right)).toBe(question.answer);
  expect(practice.options.every((o) => o.feedback.length > 20)).toBe(true);
});

test('the demo links into the full lesson at its start, its Learn part and its Practice part', () => {
  const { parts } = homeDemo();
  for (const url of Object.values(parts)) expect(url).toMatch(/^\/how-the-internet-works\/what-is-http\?step=\d+$/);
  expect(new Set(Object.values(parts)).size).toBe(3);
});

// ---------------------------------------------------------------- the basics, in order

test('Home’s stops are the tracks that have lessons, in the site’s order, and no planned track', () => {
  const stops = homeStops();
  expect(stops.map((s) => s.id)).toEqual(tracks.map((t) => t.id));
  expect(stops.map((s) => s.title)).toEqual(['How the Internet Works', 'Networking Concepts']);
  expect(stops.map((s) => s.href)).toEqual(stops.map((s) => `/tracks#${s.id}`));
  expect(stops.map((s) => s.order)).toEqual(['Start here', 'Then go deeper']);
});

test('Home says 14 lessons and 8 of 20 lessons ready', () => {
  expect(homeStops().map((s) => s.count)).toEqual(['14 lessons', '8 of 20 lessons ready']);
});

test('a stop counts its lessons from the content', () => {
  const stops = homeStops();
  tracks.forEach((track, i) => {
    const { available, planned } = trackTotals(getEntries(track.id));
    expect(stops[i]).toMatchObject({ title: track.title, lessons: { ready: available, planned } });
    expect(stops[i]!.count).toBe(available === planned ? `${planned} lessons` : `${available} of ${planned} lessons ready`);
    expect(stops[i]!.cover).toBeTruthy();
  });
});

test('a lead of several statements reads as the lesson’s Learn part shows it: every text, one space between', () => {
  const lead = [
    { id: 'a', text: 'First idea.', cite: [] },
    { id: 'b', text: 'Second idea.', cite: [] },
    { id: 'c', text: 'Third idea.', cite: [] },
  ];
  expect(leadText(lead)).toBe('First idea. Second idea. Third idea.');
  expect(leadText(lead.slice(0, 1))).toBe('First idea.');
});

/** A copy of a real lesson with its first unit changed by `change`, standing in for it in the registry. */
function swapIn(slug: string, change: (unit: Lesson['units'][number]) => void): void {
  const lesson = structuredClone(getLesson(slug)!);
  change(lesson.units[0]!);
  swapped.set(slug, lesson);
}

const threeStatements = (name: string) => [1, 2, 3].map((n) => ({ id: `lead-${n}`, text: `${name} statement ${n}.`, cite: [] }));

test('a lesson with a lead of three statements shows all three on Home, for the demo and for the sealed lesson', () => {
  swapIn('what-is-http', (u) => { u.learn.lead = threeStatements('HTTP'); });
  swapIn('what-is-https', (u) => { u.learn.lead = threeStatements('HTTPS'); });
  const demo = homeDemo();
  expect(demo.learn.lead).toBe('HTTP statement 1. HTTP statement 2. HTTP statement 3.');
  expect(demo.sealed.lead).toBe('HTTPS statement 1. HTTPS statement 2. HTTPS statement 3.');
});

test('the demo lists the sources in the order the Lesson page numbers them: the one Learn cites first leads', () => {
  swapIn('what-is-http', (u) => {
    const [a, b] = u.references;
    u.references = [{ ...a!, source: 'src-a' }, { ...b!, source: 'src-b' }];
    for (const part of [...u.learn.lead, ...u.learn.terms, ...u.learn.why, ...u.learn.deep, ...u.learn.facts, u.learn.pattern]) part.cite = [];
    u.learn.lead[0]!.cite = [{ source: 'src-b', label: 'Section 1', url: b!.url } as never];
  });
  const unit = getLesson('what-is-http')!.units[0]!;
  const raw = unit.references.map((r) => r.label);
  expect(homeDemo().learn.sources.map((s) => s.label)).toEqual([raw[1], raw[0]]);
});

// ---------------------------------------------------------------- the sources block (D5, variant A)

const items = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

test('a list of 6 sources or fewer is shown whole; nothing is folded', () => {
  for (const n of [0, 1, 2, 6]) expect(foldSources(items(n)), `${n} sources`).toEqual({ shown: items(n), folded: [] });
});

test('a list of 7 or more shows the first 3 and folds the rest, in the order given', () => {
  for (const [n, folded] of [[7, 4], [12, 9], [31, 28]] as const) {
    const out = foldSources(items(n));
    expect(out.shown, `${n} shown`).toEqual([1, 2, 3]);
    expect(out.folded.length, `${n} folded`).toBe(folded);
    expect(out.folded[0], `${n}: the fourth source leads the fold`).toBe(4);
    expect(out.folded.at(-1)).toBe(n);
  }
});

test('a source’s name is its label up to the first “: ”, and a label without one is whole', () => {
  expect(sourceName('RFC 3550: RTP: A Transport Protocol for Real-Time Applications')).toBe('RFC 3550');
  expect(sourceName('RFC 9110:HTTP')).toBe('RFC 9110:HTTP');
  expect(sourceName('Plain label')).toBe('Plain label');
});

test('the demo lists all 20 sources of lesson 1 in the lesson’s order, each named as the registry names it', () => {
  const { sources } = homeDemo().learn;
  expect(sources).toHaveLength(20);
  expect(sources.slice(0, 4).map((s) => s.name)).toEqual(['RFC 9114', 'RFC 9110', 'RFC 3986', 'RFC 791']);
  expect(sources[19]!.name).toBe('RFC 6335');
  const listed = numberedSources(HTTP()).list;
  sources.forEach((s, i) => {
    expect(s.label, s.name).toBe(listed[i]!.label);
    expect(s.label).toContain(': ');
    expect(s.url).toBe(listed[i]!.url);
    expect(s.name).toBe(SOURCES[listed[i]!.source!]!.short);
  });
});

test('the demo carries the lesson’s stamp, and says its sources are numbered', () => {
  const { learn } = homeDemo();
  expect(learn.stamp).toEqual({ checked: '2026-11-11', sources: 20 });
  expect(learn.numbered).toBe(true);
});

test('a lesson that cites nothing yet has no numbers on Home either', () => {
  const cited = homeDemo().learn.numbered; // read before the swap, which lasts until the test ends
  // What is HTTP with every reference's source taken away: its references stay, and none can be numbered.
  swapIn('what-is-http', (u) => { u.references = u.references.map(({ source: _source, ...rest }) => rest as never); });
  expect(homeDemo().learn.numbered).toBe(false);
  expect(cited).toBe(true);
});

test('a stamp that counts differently from the list makes the demo throw, naming the lesson and both counts', () => {
  swapIn('what-is-http', (u) => { u.references[1] = { ...u.references[1]!, url: u.references[0]!.url }; });
  expect(() => homeDemo()).toThrow(/(?=.*what-is-http)(?=.*\b19\b)(?=.*\b20\b)/);
});

// ---------------------------------------------------------------- the page on the laptop follows the lesson's cues

test('the page’s words and pictures come from the lesson’s own cues', () => {
  expect(homeDemo('what-is-http').page).toEqual({ words: 5, pictures: 5 });
  expect(homeDemo('what-is-pop3', 'what-is-tcp').page).toEqual({ words: 4, pictures: 4 });
});

test('What is HTTPS draws its words at step 6 and has no “full” cue, so it cannot be Home’s demo; the error names it', () => {
  expect(() => homeDemo('what-is-https', 'what-is-tcp')).toThrow(/what-is-https has no page: 'full' cue/);
});

test('What is TCP has no page cue, so it cannot be Home’s demo; the error names it', () => {
  expect(() => homeDemo('what-is-tcp', 'what-is-https')).toThrow(/what-is-tcp has no page cue/);
});

test('a lesson with no page cue cannot be Home’s demo, and the error names it', () => {
  expect(() => homeDemo('what-is-udp', 'what-is-tcp')).toThrow(/what-is-udp has no page cue/);
});

test('a lesson whose page never shows its pictures cannot be Home’s demo either, and the error names it', () => {
  swapIn('what-is-http', (u) => {
    for (const step of u.steps) for (const e of step.events) if ('cues' in e && e.cues !== undefined) e.cues = e.cues.filter((c) => !(c.cue === 'page' && c.arg === 'full'));
  });
  expect(() => homeDemo()).toThrow(/what-is-http has no page: 'full' cue/);
});

test('a page cue on a note counts as much as one on a message', () => {
  swapIn('what-is-http', (u) => {
    const step = u.steps[3]!;
    const note = { type: 'note' as const, id: 'moved', log: {}, plain: 'The words arrive.', cues: [{ cue: 'page', arg: 'text' }] };
    u.steps[4]!.events.forEach((e) => { if ('cues' in e && e.cues !== undefined) e.cues = e.cues.filter((c) => !(c.cue === 'page' && c.arg === 'text')); });
    step.events.push(note as never);
  });
  expect(homeDemo().page).toEqual({ words: 4, pictures: 5 });
});

test('the page stays once drawn: lit from its step on, not at that step only, and through Learn and Practice', () => {
  expect(litSteps({ words: 5, pictures: 6 }, 6)).toEqual({
    words: { steps: [5, 6], parts: ['learn', 'practice'] },
    pictures: { steps: [6], parts: ['learn', 'practice'] },
  });
});

test('D5’s rules on Home hold no colour value other than a token', () => {
  const page = readFileSync('src/pages/index.astro', 'utf8');
  const open = page.indexOf("/* ---- D5: Learn's foot");
  const close = page.indexOf('/* ---- end of D5: Learn');
  expect(open, 'the comment that opens D5’s rules').toBeGreaterThan(-1);
  expect(close, 'the comment that closes them').toBeGreaterThan(open);
  const rules = page.slice(open, close);
  expect(rules).toContain('var(--link)');
  expect(rules).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
});

test('Home’s still map shows no name strip, no DROPPED mark and every part of the resolver (Router’s additions stay off other lessons)', () => {
  const { scene } = homeDemo();
  expect([...scene.matchAll(/<g class="nm-strip"[^>]*>/g)].every((m) => m[0].includes('display="none"'))).toBe(true);
  expect(scene).toMatch(/id="nm-discard" style="opacity:0"/);
  expect(scene).not.toContain('data-hidden');
  expect(scene).toContain('<g data-base="resolver">');
});
