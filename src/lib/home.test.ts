import { expect, test } from 'vitest';
import { getEntries, getLesson, trackTotals } from '../content/registry';
import { plannedTracks, tracks } from '../content/tracks';
import { homeDemo, homeQuestions, homeStops } from './home';
import { STATUS_WORDS } from './hub';

// ---------------------------------------------------------------- the lesson you can try on Home

test('the demo is the DHCP lesson: its first four Watch steps, in the lesson’s own words', () => {
  const demo = homeDemo();
  const unit = getLesson('dhcp')!.units[0]!;
  expect(demo.lesson).toMatchObject({ title: 'DHCP', fullName: 'Dynamic Host Configuration Protocol', url: '/networking/dhcp' });
  expect(demo.steps.map((s) => s.title)).toEqual(['DHCP Discover', 'DHCP Offer', 'DHCP Request', 'DHCP Acknowledge']);
  demo.steps.forEach((step, i) => {
    expect(step).toEqual({ n: i + 1, id: unit.steps[i]!.id, title: unit.steps[i]!.title, sub: unit.steps[i]!.sub, narrative: unit.steps[i]!.narrative });
  });
});

test('the demo’s Learn part is the lesson’s lead, its ideas with their names, and its sources', () => {
  const { learn } = homeDemo();
  const unit = getLesson('dhcp')!.units[0]!;
  expect(learn.lead).toBe(unit.learn.lead[0]!.text);
  expect(learn.terms.length).toBeGreaterThanOrEqual(4);
  expect(learn.terms).toEqual(unit.learn.terms.slice(0, learn.terms.length).map((t) => ({ idea: t.idea, name: t.name })));
  expect(learn.sources).toEqual(unit.references.map((r) => ({ label: r.label, url: r.url })));
  expect(learn.sources.every((s) => s.url.startsWith('https://'))).toBe(true);
});

test('the demo’s Practice part is the lesson’s first question, with exactly one right answer', () => {
  const { practice } = homeDemo();
  const question = getLesson('dhcp')!.units[0]!.practice[0]!;
  expect(practice.prompt).toBe(question.prompt);
  expect(practice.options.map((o) => o.text)).toEqual(question.options.map((o) => o.text));
  expect(practice.options.filter((o) => o.right)).toHaveLength(1);
  expect(practice.options.findIndex((o) => o.right)).toBe(question.answer);
  // Every choice explains itself, right or wrong.
  expect(practice.options.every((o) => o.feedback.length > 20)).toBe(true);
});

test('the demo’s scene is the lesson’s own drawing, and each step’s message tag has a place on it', () => {
  const demo = homeDemo();
  expect(demo.scene).toMatch(/^<svg data-figure="dhcp"/);
  expect(demo.scene).toMatch(/ role="img" aria-label="[^"]{40,}"/);
  expect(demo.tags.map((t) => t.step)).toEqual([1, 2, 3, 4]);
  for (const tag of demo.tags) {
    // The tag is a part the scene really has.
    expect(demo.scene).toContain(`id="dh-tag-${tag.id}"`);
    expect(Number.isFinite(tag.x) && Number.isFinite(tag.y)).toBe(true);
  }
  // In flight the tags are up in the air (above the plate: a negative y on screen); the last has landed lower, at the laptop.
  expect(demo.tags[0]!.y).toBeLessThan(demo.tags[3]!.y);
  expect(new Set(demo.tags.map((t) => t.id)).size).toBe(4);
});

test('the demo links into the full lesson at its start, its Learn part and its Practice part', () => {
  const { parts } = homeDemo();
  expect(parts.watch).toMatch(/^\/networking\/dhcp\?step=\d+$/);
  expect(parts.learn).toMatch(/^\/networking\/dhcp\?step=\d+$/);
  expect(parts.practice).toMatch(/^\/networking\/dhcp\?step=\d+$/);
  expect(new Set(Object.values(parts)).size).toBe(3);
});

// ---------------------------------------------------------------- questions that open a lesson

test('each question on Home opens a ready lesson of the first track, named as the track names it', () => {
  const questions = homeQuestions();
  const entries = getEntries(tracks[0]!.id);
  expect(questions).toHaveLength(4);
  for (const q of questions) {
    expect(q.question).toMatch(/\?$/);
    const entry = entries.find((e) => e.available && e.url === q.url);
    expect(entry, q.question).toBeDefined();
    expect(q.name).toBe(entry!.title);
    expect(q.number).toBe(String(entry!.number).padStart(2, '0'));
    expect(q.purpose.length).toBeGreaterThan(5);
  }
  expect(new Set(questions.map((q) => q.url)).size).toBe(4);
});

// ---------------------------------------------------------------- the tracks, in order

test('Home’s stops are every track with lessons, in the site’s order, then the planned ones', () => {
  const stops = homeStops();
  expect(stops.map((s) => s.id)).toEqual([...tracks.map((t) => t.id), ...plannedTracks.map((t) => t.id)]);
  expect(stops.map((s) => s.href)).toEqual(stops.map((s) => `/tracks#${s.id}`));
});

test('a stop counts its lessons from the content, and a planned track says it is not ready', () => {
  const stops = homeStops();
  tracks.forEach((track, i) => {
    const { available, planned } = trackTotals(getEntries(track.id));
    expect(stops[i]).toMatchObject({ title: track.title, ready: true, lessons: { ready: available, planned } });
    expect(stops[i]!.count).toBe(available === planned ? `${planned} lessons` : `${available} of ${planned} lessons ready`);
    expect(stops[i]!.cover).toBeTruthy();
  });
  for (const stop of stops.slice(tracks.length)) {
    expect(stop).toMatchObject({ ready: false, count: STATUS_WORDS['not-ready'], lessons: { ready: 0, planned: 0 } });
  }
  // The first is where a beginner starts, and only the first says so.
  expect(stops.map((s) => s.order)).toEqual(['Start here', 'Then go deeper', 'For the exam']);
});
