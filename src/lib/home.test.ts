import { expect, test } from 'vitest';
import { getEntries, getLesson, trackTotals } from '../content/registry';
import { tracks } from '../content/tracks';
import { homeDemo, homeStops, leadText } from './home';

const HTTP = () => getLesson('what-is-http')!.units[0]!;

// ---------------------------------------------------------------- the lesson you can try on Home

test('the demo is lesson 1, HTTP: every Watch step of how a web page arrives, in the lesson’s own words', () => {
  const demo = homeDemo();
  const unit = HTTP();
  expect(demo.lesson).toMatchObject({ title: 'HTTP', fullName: 'HyperText Transfer Protocol', url: '/how-the-internet-works/what-is-http', number: 1, track: 'How the Internet Works' });
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
  // Today the lead is one statement, so nothing about Home changes.
  expect(unit.learn.lead).toHaveLength(1);
  expect(learn.lead).toBe(unit.learn.lead[0]!.text);
  expect(learn.terms.length).toBeGreaterThanOrEqual(4);
  expect(learn.terms).toEqual(unit.learn.terms.slice(0, learn.terms.length).map((t) => ({ idea: t.idea, name: t.name })));
  expect(learn.sources).toEqual(unit.references.map((r) => ({ label: r.label, url: r.url })));
  expect(learn.sources.every((s) => s.url.startsWith('https://'))).toBe(true);
});

test('Learn ends on the sealed version: HTTPS, the next lesson, in that lesson’s own words', () => {
  const { sealed } = homeDemo();
  const https = getLesson('what-is-https')!;
  expect(sealed).toEqual({ title: 'HTTPS', lead: https.units[0]!.learn.lead.map((s) => s.text).join(' '), url: '/how-the-internet-works/what-is-https', number: 2 });
  expect(sealed.lead).toContain('seal the line');
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
