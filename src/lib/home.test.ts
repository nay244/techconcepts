// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { afterEach, expect, test, vi } from 'vitest';
import { getEntries, getLesson, trackTotals } from '../content/registry';
import { SOURCES } from '../content/sources';
import { tracks } from '../content/tracks';
import type { Lesson } from '../content/schema';
import { CAFE_OPEN, groupsOf, PHONE_OPEN } from '../test/svg-groups';
import { numberedSources } from '../lesson/sourceNumbers';
import { lessonStamp } from './checked';
import { CROP, cropCss, demoCss, foldSources, homeDemo, homeStops, leadText, litSteps, readKey, sourceName, viewBoxOf } from './home';

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

test('Home says 14 lessons and 20 lessons, every Networking lesson ready', () => {
  expect(homeStops().map((s) => s.count)).toEqual(['14 lessons', '20 lessons']);
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
  // The same cues, moved to step 4 (a lesson that draws its page a step earlier, as POP3's does).
  swapIn('what-is-http', (u) => {
    const cues = u.steps[4]!.events.flatMap((e) => ('cues' in e ? e.cues ?? [] : [])).filter((c) => c.cue === 'page');
    u.steps[4]!.events.forEach((e) => { if ('cues' in e && e.cues !== undefined) e.cues = e.cues.filter((c) => c.cue !== 'page'); });
    const sent = u.steps[3]!.events.find((e) => e.type === 'message')!;
    (sent as { cues?: unknown[] }).cues = [...((sent as { cues?: unknown[] }).cues ?? []), ...cues];
  });
  expect(homeDemo().page).toEqual({ words: 4, pictures: 4 });
});

test('a lesson whose map has no “Web server” callout cannot be Home’s demo: its page cues are read first, then the key throws, naming the callout (POP3 draws a mail server)', () => {
  expect(() => homeDemo('what-is-pop3', 'what-is-tcp')).toThrow(/no "Web server" callout/);
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

// ---------------------------------------------------------------- the Card stack look: no colour value but tokens (B20, case 15)

/** What D5's rules matched, and the named colours too: transparent and currentColor are the only names allowed. */
const NAMED = ('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan ' +
  'darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
  'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender ' +
  'lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue ' +
  'lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose ' +
  'moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue ' +
  'saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' ');
const NAMED_RE = new RegExp(`(?<![\\w-])(${NAMED.join('|')})(?![\\w-])`, 'i');
const HEX_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|hwb\(|lab\(|lch\(|oklab\(|oklch\(/;

/** The colour values in some CSS or script: a hex, a colour function, or a named colour. Comments are not read. */
function colourValues(text: string): string[] {
  const bare = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
  return bare.split('\n').flatMap((line) => [HEX_RE.exec(line)?.[0], NAMED_RE.exec(line)?.[1]].filter((v): v is string => v !== undefined));
}

/** The page's own text, with the two blocks that are allowed to hold colour values (the figure tint, the token block) cut out. */
function pageWithoutBlocks(page: string): { rest: string; tokens: string; tint: string } {
  const cut = (from: string, to: string): [string, string] => {
    const a = page.indexOf(from);
    const b = page.indexOf(to);
    expect(a, `${from} opens the block`).toBeGreaterThan(-1);
    expect(b, `${to} closes it`).toBeGreaterThan(a);
    return [page.slice(a, b), page.slice(0, a) + page.slice(b + to.length)];
  };
  const [tokens, withoutTokens] = cut('TOKENS BEGIN', 'TOKENS END */');
  const [tint, rest] = ((): [string, string] => {
    const a = withoutTokens.indexOf('FIGURE TINT BEGIN');
    const b = withoutTokens.indexOf('FIGURE TINT END */');
    expect(a, 'the tint block opens').toBeGreaterThan(-1);
    expect(b, 'and closes').toBeGreaterThan(a);
    return [withoutTokens.slice(a, b), withoutTokens.slice(0, a) + withoutTokens.slice(b + 'FIGURE TINT END */'.length)];
  })();
  return { rest, tokens, tint };
}

test('Home’s stylesheet and its generated rules hold no colour value outside the token block and the figures’ tint block (case 15)', () => {
  const page = readFileSync('src/pages/index.astro', 'utf8');
  const { rest, tokens, tint } = pageWithoutBlocks(page);
  // The template's words are not CSS: only the frontmatter and the styles are read.
  const code = rest.slice(0, rest.indexOf('<BaseLayout')) + rest.slice(rest.indexOf('<style>'));
  expect(colourValues(code)).toEqual([]);
  expect(colourValues(demoCss(homeDemo()))).toEqual([]);
  // The two blocks are not empty: the tokens are all var(--…) (variant A adds no colour value to the site), the tint holds the figures' hexes.
  expect(tokens).toContain('--cs-edge');
  expect(colourValues(tokens)).toEqual([]);
  expect(tint).toMatch(/--anatomy-hi: #12171b/);
  expect(tint).toMatch(/--anatomy-hi: #f3f5f6/);
  // Links are ink: Patch's blue link has no place on Home, and so the page holds none.
  expect(page).not.toContain('var(--link)');
  expect(demoCss(homeDemo())).not.toContain('var(--link)');
});

test('the colour-value scan can fail: a hex in a rule, a named colour, or a string in the generated rules is found', () => {
  const page = readFileSync('src/pages/index.astro', 'utf8');
  const seeded = (text: string): string[] => {
    const { rest } = pageWithoutBlocks(text);
    return colourValues(rest.slice(0, rest.indexOf('<BaseLayout')) + rest.slice(rest.indexOf('<style>')));
  };
  expect(seeded(page.replace('.leg {', '.leg {\n    color: #fff;'))).toEqual(['#fff']);
  expect(seeded(page.replace('.leg {', '.leg {\n    color: rebeccapurple;'))).toEqual(['rebeccapurple']);
  expect(seeded(page.replace("const css = demoCss(demo);", "const css = demoCss(demo) + 'a{color:rgb(1,2,3)}';"))).toEqual(['rgb(']);
  expect(colourValues(`${demoCss(homeDemo())}\n.x{background:hsl(0 0% 0%)}`)).toEqual(['hsl(']);
  // transparent and currentColor are not colours the scan objects to.
  expect(colourValues('a{border-color:transparent;fill:currentColor}')).toEqual([]);
});

// ---------------------------------------------------------------- the generated state rules (B20)

test('the right answer’s ring is filled by the data, not by the first label: the rule names the option that is right', () => {
  const rightId = (css: string): string[] => [...css.matchAll(/#(demo-a\d):checked ~ \.demo__ui \.demo__pick\[for="demo-a\d"\]::before\{border-color:var\(--cs-done\)/g)].map((m) => m[1]!);
  const dotId = (css: string): string[] => [...css.matchAll(/#(demo-a\d):checked ~ \.demo__ui \.demo__pick\[for="demo-a\d"\]::after\{left:20px/g)].map((m) => m[1]!);
  const real = demoCss(homeDemo());
  expect(rightId(real)).toEqual(['demo-a1']);
  expect(dotId(real)).toEqual(['demo-a2', 'demo-a3']);
  swapIn('what-is-http', (u) => { u.practice[0]!.answer = 2; });
  const swappedCss = demoCss(homeDemo());
  expect(rightId(swappedCss)).toEqual(['demo-a3']);
  expect(dotId(swappedCss)).toEqual(['demo-a1', 'demo-a2']);
});

test('a group whose part is not on show is hidden by the generated rules, and the step on show is edged, the steps behind it ticked', () => {
  const css = demoCss(homeDemo());
  expect(css).toContain('#demo-watch:checked ~ .demo__in--answer,#demo-learn:checked ~ .demo__in--step,#demo-learn:checked ~ .demo__in--answer,#demo-practice:checked ~ .demo__in--step{visibility:hidden}');
  // The tab on show, and the keyboard ring inside it.
  expect(css).toContain('#demo-learn:checked ~ .demo__ui .demo__parts label[for="demo-learn"]{z-index:1;height:calc(var(--tab) + 2px);border-bottom:0;background:var(--cs-card);color:var(--ink-strong);font-weight:700}');
  expect(css).toContain('#demo-learn:focus-visible ~ .demo__ui label[for="demo-learn"]{outline:2px solid var(--focus);outline-offset:-7px}');
  // Step 3 on show: steps 1 and 2 are ticked and step 3 is not (a step is done when it is before the one on show).
  const ticks = (n: number): string[] => [...css.matchAll(new RegExp(`#demo-s${n}:checked ~ \\.demo__ui \\.demo__row\\[for="demo-s(\\d)"\\] \\.demo__n::after\\{display:block\\}`, 'g'))].map((m) => m[1]!);
  expect(ticks(1)).toEqual([]);
  expect(ticks(3)).toEqual(['1', '2']);
  expect(ticks(5)).toEqual(['1', '2', '3', '4']);
  // The step on show sets the tile's own fill, so the order of two rules decides nothing.
  expect(css).toContain('#demo-s2:checked ~ .demo__ui .demo__row[for="demo-s2"] .demo__n{--tile-bg:var(--cs-here);background:var(--cs-here);color:var(--cs-here-ink);border-color:var(--cs-edge)}');
});

// ---------------------------------------------------------------- the phone's key, crop and leaders (D16 §2.2, built in B20)

/** The words of the four callouts as the drawing has them, by their first line, skipping empty texts. */
function drawnCalls(svg: string): Map<string, string[]> {
  const calls = new Map<string, string[]>();
  for (const g of svg.matchAll(/<g class="nm-call">(.*?)<\/g>/g)) {
    const texts = [...g[1]!.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((t) => t[1]!).filter((t) => t !== '');
    if (texts.length > 0) calls.set(texts[0]!, texts);
  }
  return calls;
}

test('the key is the drawing’s four callouts, word for word and in the bands of D16 §2.2.3, read from the drawn SVG', () => {
  const { key, scene } = homeDemo();
  const drawn = drawnCalls(scene);
  const flat = (calls: { name: string; lines: { text: string }[] }[]): string[][] => calls.map((c) => [c.name, ...c.lines.map((l) => l.text)]);
  expect(flat(key.above)).toEqual([drawn.get('Your laptop')!, drawn.get('DNS resolver')!]);
  expect(flat(key.below)).toEqual([drawn.get('The internet')!, drawn.get('Web server')!]);
  expect(key.above.map((c) => c.end)).toEqual([false, false]);
  expect(key.below.map((c) => c.end)).toEqual([true, true]);
  // The laptop's state is the lesson's own words, written into the drawing before the key reads it.
  expect(drawn.get('Your laptop')).toContain('Wants example.net');
  expect([...flat(key.above), ...flat(key.below)].flat()).toHaveLength(10);
  expect(key.above[0]!.lines.map((l) => l.kind)).toEqual(['addr', 'state']);
  expect(key.above[1]!.lines.map((l) => l.kind)).toEqual(['sub', 'addr']);
});

test('a drawing without one of the four callouts makes the key throw, naming it; the drawing’s own frame is unchanged', () => {
  const { scene } = homeDemo();
  for (const name of ['Your laptop', 'DNS resolver', 'The internet', 'Web server']) {
    const without = scene.replace(new RegExp(`<g class="nm-call">(?:(?!</g>).)*>${name}</text>(?:(?!</g>).)*</g>`), '');
    expect(without, `${name}'s callout was cut out`).not.toBe(scene);
    expect(() => readKey(without), name).toThrow(new RegExp(`"${name}" callout`));
  }
  expect(() => readKey(scene)).not.toThrow();
  // The frame the crop is measured against: net-map.test.ts pins it as well.
  expect(viewBoxOf(scene)).toEqual({ x: -98, y: -60, w: 685, h: 378 });
  expect(scene).toContain('viewBox="-98 -60 685 378"');
});

test('the crop holds every point of every lit way and every lead dot of lesson 1', () => {
  const { scene, crop } = homeDemo();
  expect(crop).toEqual({ x: -78, y: -22, w: 604, h: 232, view: { x: -98, y: -60, w: 685, h: 378 } });
  expect(CROP).toEqual({ x: -78, y: -22, w: 604, h: 232 });
  const inside = (x: number, y: number): boolean => x >= CROP.x && x <= CROP.x + CROP.w && y >= CROP.y && y <= CROP.y + CROP.h;
  const trails = [...scene.matchAll(/<polyline class="nm-trail home-trail"[^>]* points="([^"]+)"/g)];
  expect(trails).toHaveLength(4);
  for (const t of trails) for (const pt of t[1]!.split(' ')) {
    const [x, y] = pt.split(',').map(Number) as [number, number];
    expect(inside(x, y), `trail point ${pt}`).toBe(true);
  }
  const dots = [...scene.matchAll(/<circle class="nm-lead-dot" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
  expect(dots.length).toBeGreaterThanOrEqual(4);
  const keyed = readKey(scene).dots;
  for (const { cx, cy } of keyed) expect(inside(cx, cy), `lead dot ${cx},${cy}`).toBe(true);
});

test('the scene carries one set of leaders: four paths from each callout’s lead dot to the crop’s edge, and four dots', () => {
  const { scene } = homeDemo();
  expect(scene.match(/<g class="home-leads" aria-hidden="true">/g)).toHaveLength(1);
  const leads = /<g class="home-leads" aria-hidden="true">(.*?)<\/g>/.exec(scene)![1]!;
  const paths = [...leads.matchAll(/<path d="M(-?[\d.]+) (-?[\d.]+)V(-?[\d.]+)"\/>/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]), to: Number(m[3]) }));
  const circles = [...leads.matchAll(/<circle cx="(-?[\d.]+)" cy="(-?[\d.]+)" r="3"\/>/g)].map((m) => [Number(m[1]), Number(m[2])]);
  expect(paths).toHaveLength(4);
  expect(circles).toHaveLength(4);
  // Each starts at its own callout's dot (the laptop's and the resolver's end at the crop's top, the others at its foot).
  const dotOf = (name: string): [number, number] => {
    const g = [...scene.matchAll(/<g class="nm-call">(.*?)<\/g>/g)].find((c) => c[1]!.includes(`>${name}</text>`))![1]!;
    const m = /class="nm-lead-dot" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/.exec(g)!;
    return [Number(m[1]), Number(m[2])];
  };
  const want: [string, number][] = [['Your laptop', -22], ['DNS resolver', -22], ['The internet', 210], ['Web server', 210]];
  want.forEach(([name, to], i) => {
    const [cx, cy] = dotOf(name);
    expect(paths[i]!.x, `${name} x`).toBeCloseTo(cx, 1);
    expect(paths[i]!.y, `${name} y`).toBeCloseTo(cy, 1);
    expect(paths[i]!.to, `${name} ends at the crop's edge`).toBe(to);
    expect(circles[i]).toEqual([paths[i]!.x, paths[i]!.y]);
  });
});

test('the crop’s CSS is the crop’s numbers: its shape, the drawing wider than it, and shifted by the crop’s offset in the frame', () => {
  const css = cropCss(homeDemo().crop);
  expect(css).toContain('aspect-ratio:604 / 232');
  expect(css).toContain('width:calc(100% * 685 / 604)');
  expect(css).toContain('margin:calc(-100% * 38 / 604) 0 0 calc(-100% * 20 / 604)');
  // Another crop gives other numbers: nothing in the rule is fixed but what the crop says.
  expect(cropCss({ x: -50, y: 0, w: 500, h: 200, view: { x: -98, y: -60, w: 685, h: 378 } })).toContain('margin:calc(-100% * 60 / 500) 0 0 calc(-100% * 48 / 500)');
});

test('Home’s still map shows no name strip, no DROPPED mark and every part of the resolver (Router’s additions stay off other lessons)', () => {
  const { scene } = homeDemo();
  expect([...scene.matchAll(/<g class="nm-strip"[^>]*>/g)].every((m) => m[0].includes('display="none"'))).toBe(true);
  expect(scene).toMatch(/id="nm-discard" style="opacity:0"/);
  // The phone (D11) and the café (D15b) are the parts drawn hidden: their groups, and nothing else.
  const { groups, rest } = groupsOf(scene, PHONE_OPEN);
  expect(groups).toHaveLength(2);
  const cafe = groupsOf(rest, CAFE_OPEN);
  expect(cafe.groups).toHaveLength(3);
  expect(cafe.rest).not.toContain('data-hidden');
  expect(scene).toContain('<g data-base="resolver">');
});
