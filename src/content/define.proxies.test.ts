import { expect, test } from 'vitest';
import { checkStructure } from './define';
import { proxiesFixture } from './proxies-fixture';
import { routerFixture } from './router-fixture';
import type { Cue, Lesson, MessageEvent, SceneEvent } from './schema';
import { stepSchema } from './schema';
import { parseConn } from '../scenes/drivers/net-map';

// D15a / B18a (prototypes/d15-proxies.md §5.5, checks 18 and 19; prototypes/d15-proxies-cases.md, 18a to 18n, 19a to 19c,
// with E4 to E8, E12 and E13), against the real figure parts and the Proxies fixture (src/content/proxies-fixture.ts).

const issues = (mutate: (l: Lesson) => void = () => {}): string[] => {
  const lesson = proxiesFixture();
  mutate(lesson);
  return checkStructure(lesson);
};
const unit = (l: Lesson) => l.units[0]!;
const step = (l: Lesson, n: number) => unit(l).steps[n - 1]!;
const events = (l: Lesson): SceneEvent[] => unit(l).steps.flatMap((s) => s.events);
const message = (l: Lesson, id: string): MessageEvent => events(l).find((e) => e.id === id) as MessageEvent;
const start = (l: Lesson, n: number): Cue[] => (step(l, n).start ??= []);

test('18n: the real Proxies fixture validates with no issue', () => {
  expect(issues()).toEqual([]);
});

test('18a: a step’s start is for the network map: DHCP (which takes a scene start) and the switch each get one issue for it, and nothing about a start that “takes none”', () => {
  for (const figure of ['dhcp', 'switch'] as const) {
    const found = issues((l) => {
      l.figure = figure;
      unit(l).scene.start = [];
      for (const s of unit(l).steps) delete s.start;
      start(l, 2).push({ cue: 'fresh' });
    }).filter((i) => /step-2"?: the step's start/.test(i) || i.includes('the step\'s start'));
    expect(found, figure).toHaveLength(1);
    expect(found[0], figure).toContain('takes no step start');
    expect(found[0], figure).not.toContain('takes none');
  }
});

test('18b: a step’s start may not set the status; a url is fine', () => {
  for (const q of [{ cue: 'status', arg: 'Waiting' }, { cue: 'status-known' }, { cue: 'status-done' }] as Cue[]) {
    expect(issues((l) => start(l, 3).push(q)).join('\n'), q.cue).toContain(`cue "${q.cue}" sets the status`);
  }
  expect(issues((l) => start(l, 3).push({ cue: 'url', arg: 'techconcepts.app' }))).toEqual([]);
});

test('18c: a step’s start cannot drop a packet or park a tag; hiding the resolver is fine', () => {
  expect(issues((l) => start(l, 3).push({ cue: 'drop', arg: 'a' })).join('\n')).toContain('cue "drop" is for an event');
  expect(issues((l) => start(l, 3).push({ cue: 'park', arg: 'laptop 1 GET' })).join('\n')).toContain('"park" and "unpark" are for an event');
  expect(issues((l) => start(l, 3).push({ cue: 'unpark', arg: 'laptop' })).join('\n')).toContain('"park" and "unpark" are for an event');
  expect(issues((l) => start(l, 3).push({ cue: 'hide', arg: 'resolver' }))).toEqual([]);
});

test('18d: a scene that draws the forward proxy hides the resolver in its start', () => {
  expect(issues((l) => (unit(l).scene.start = [])).join('\n')).toContain('"proxies:proxy" stands where the resolver does');
  expect(issues()).toEqual([]);
  // The site alone leaves the resolver where it is.
  expect(issues((l) => {
    unit(l).scene.layers = ['proxies:site'];
    unit(l).scene.start = [];
    for (const s of unit(l).steps) delete s.start;
    start(l, 4).push({ cue: 'hide', arg: 'direct' }, { cue: 'show', arg: 'reverse' });
    start(l, 5);
    l.units[0]!.steps = l.units[0]!.steps.slice(3);
    for (const e of events(l)) if (e.type === 'message') e.from = e.from === 'proxy' ? 'laptop' : e.from;
  }).join('\n')).not.toContain('stands where the resolver does');
});

test('18e: show proxy and hide proxy need the layer of the forward proxy; show reverse and hide direct need the site’s', () => {
  const without = (layer: string) => (l: Lesson) => {
    unit(l).scene.layers = unit(l).scene.layers.filter((x) => x !== layer);
    unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }];
  };
  const proxy = issues(without('proxies:proxy')).join('\n');
  expect(proxy).toContain('cue "show proxy" needs the layer "proxies:proxy"');
  expect(proxy).toContain('cue "hide proxy" needs the layer "proxies:proxy"');
  const site = issues(without('proxies:site')).join('\n');
  expect(site).toContain('cue "show reverse" needs the layer "proxies:site"');
  expect(site).toContain('cue "hide direct" needs the layer "proxies:site"');
});

test('18f: a message to the proxy needs it shown by the step’s start or an earlier one, and not hidden since', () => {
  const early = (l: Lesson) => {
    message(l, 's1-get').to = 'proxy';
  };
  expect(issues(early).join('\n')).toContain('"proxy", which no start has shown by this step');
  // Step 2's own start shows it: its messages pass; step 3 carries it over.
  expect(issues()).toEqual([]);
  expect(message(proxiesFixture(), 's3-in').to).toBe('proxy');
  // Step 4 hides it: a message to it there is refused.
  expect(issues((l) => (message(l, 's4-get').to = 'proxy')).join('\n')).toContain('"proxy", which no start has shown by this step');
  // The rule reads the starts of earlier steps, not only the step's own: dropping step 2's `show` fails step 3's messages too.
  const lost = issues((l) => (step(l, 2).start = [{ cue: 'fresh' }])).join('\n');
  expect(lost).toContain('step "step-3"');
});

test('18g: a message to the reverse proxy needs `show reverse` before it', () => {
  expect(issues((l) => (message(l, 's3-in').to = 'reverse')).join('\n')).toContain('"reverse", which no start has shown by this step');
  expect(message(proxiesFixture(), 's5-get').from).toBe('reverse');
  expect(issues()).toEqual([]);
});

test('18h: a conn through a place needs real places, the middle neither end, and its parts shown by then', () => {
  const conn = (arg: string, n = 2) => (l: Lesson) => (step(l, n).start ??= []).push({ cue: 'conn', arg });
  expect(issues(conn('open laptop>moon>origin')).join('\n')).toContain('"laptop", "moon" and "origin" all to be places');
  expect(issues(conn('open laptop>laptop>origin')).join('\n')).toContain('runs through "laptop", which is one of its two ends');
  expect(issues(conn('open laptop>origin>origin')).join('\n')).toContain('runs through "origin", which is one of its two ends');
  expect(issues(conn('open laptop>proxy>origin'))).toEqual([]);
  expect(issues(conn('open laptop>proxy>origin', 1)).join('\n')).toContain('runs through "proxy", which no start has shown by this step');
  // A protocol of the scene's layers draws both ends: a place of another protocol is not on this map.
  expect(issues(conn('open laptop>web>origin')).join('\n')).toContain('"laptop", "web" and "origin" all to be places');
  // The reverse proxy as an end must be shown too (a two-place conn is not read).
  expect(issues(conn('open laptop>reverse>origin', 3)).join('\n')).toContain('"reverse", which no start has shown by this step');
});

test('18i: the cues hide and show take only their parts, and the messages say which', () => {
  const found = (cue: Cue) => issues((l) => (unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }, cue])).join('\n');
  expect(found({ cue: 'hide', arg: 'laptop' })).toContain('cue "hide" takes "resolver", "proxy" or "direct", not "laptop"');
  expect(found({ cue: 'show', arg: 'resolver' })).toContain('cue "show" takes "phone", "proxy", "reverse" or "cafe", not "resolver"');
  expect(found({ cue: 'show', arg: 'direct' })).toContain('cue "show" takes "phone", "proxy", "reverse" or "cafe", not "direct"');
  expect(found({ cue: 'hide', arg: 'reverse' })).toContain('cue "hide" takes "resolver", "proxy" or "direct", not "reverse"');
});

test('18j: the reverse proxy and the web server’s own callout stand on one spot: show reverse hides direct, and hide direct needs reverse', () => {
  const noDirect = issues((l) => (step(l, 4).start = step(l, 4).start!.filter((q) => !(q.cue === 'hide' && q.arg === 'direct')))).join('\n');
  expect(noDirect).toContain('cue "show reverse" draws the reverse proxy\'s callout where the web server\'s own stands');
  const noReverse = issues((l) => (step(l, 4).start = step(l, 4).start!.filter((q) => !(q.cue === 'show' && q.arg === 'reverse')))).join('\n');
  expect(noReverse).toContain('cue "hide direct" takes the web server\'s own callout away');
  // A hide of direct in an earlier start pairs with a later show.
  expect(
    issues((l) => {
      start(l, 3).push({ cue: 'hide', arg: 'direct' }, { cue: 'show', arg: 'reverse' });
    }).filter((i) => i.includes('direct') && i.includes('step-3')),
  ).toEqual([]);
});

test('18k: a part hidden after it was shown stays hidden even when a later start shows it again', () => {
  const again = issues((l) => {
    step(l, 3).start!.push({ cue: 'hide', arg: 'proxy' });
    start(l, 4).push({ cue: 'show', arg: 'proxy' });
    message(l, 's4-get').to = 'proxy';
  }).join('\n');
  expect(again).toContain('step "step-4"');
  expect(again).toContain('"proxy", which no start has shown by this step, or one has hidden it since');
});

test('18l: the phone and the resolver follow the steps’ starts too', () => {
  const phone = issues((l) => {
    start(l, 1).push({ cue: 'show', arg: 'phone' });
    message(l, 's2-connect').from = 'phone';
  }).join('\n');
  expect(phone).not.toContain('"phone", which a start');
  expect(issues((l) => (message(l, 's2-connect').from = 'phone')).join('\n')).toContain('"phone", which a start does not show (cue "show phone")');
  // The scene's start hides no resolver here, so only the step 2 start that hides it can refuse the message in step 3.
  const resolver = issues((l) => {
    unit(l).scene.start = [];
    start(l, 2).push({ cue: 'hide', arg: 'resolver' });
    message(l, 's3-in').from = 'resolver';
  }).join('\n');
  expect(resolver).toContain('"resolver", which a start hides');
  expect(resolver).not.toContain('"resolver", which the scene');
  // The laptop's column: a step 2 start that shows the phone, then a park in the laptop's bay 1 in step 3.
  const column = issues((l) => {
    start(l, 2).push({ cue: 'show', arg: 'phone' });
    ((message(l, 's3-in').cues ??= []) as Cue[]).push({ cue: 'park', arg: 'laptop 1 GET' });
  }).join('\n');
  expect(column).toContain('the laptop\'s column lies where the phone does, and a start shows the phone.');
  expect(issues((l) => ((message(l, 's3-in').cues ??= []) as Cue[]).push({ cue: 'park', arg: 'laptop 1 GET' })).join('\n')).not.toContain('the laptop\'s column lies where the phone does');
  // Before the step that hides a part that no scene start hid, a message there is not refused.
  expect(
    issues((l) => {
      unit(l).scene.start = [{ cue: 'hide', arg: 'resolver' }];
      start(l, 5).push({ cue: 'hide', arg: 'resolver' });
    }),
  ).toEqual([]);
});

test('18m: `fresh` is a flag and takes no arg', () => {
  expect(issues((l) => (step(l, 2).start![0] = { cue: 'fresh', arg: 'now' })).join('\n')).toContain('cue "fresh" is a flag and takes no arg');
});

test('18m2: a step carries `start` in the schema, and a lesson of another figure refuses it', () => {
  const s = structuredClone(step(proxiesFixture(), 2));
  expect(stepSchema.safeParse(s).success).toBe(true);
  expect(stepSchema.safeParse({ ...s, start: 'fresh' }).success).toBe(false);
});

test('19a: parseConn reads a place on the way, and a two-place conn has no via key', () => {
  expect(parseConn('open laptop>proxy>origin')).toEqual({ action: 'open', from: 'laptop', via: 'proxy', to: 'origin', data: false, tunnel: false });
  expect('via' in parseConn('open laptop>web')).toBe(false);
});

test('19b: a sealed through-line reads with its via and data flag; four places throw', () => {
  expect(parseConn('seal laptop>proxy>origin data')).toEqual({ action: 'seal', from: 'laptop', via: 'proxy', to: 'origin', data: true, tunnel: false });
  expect(() => parseConn('open a>b>c>d')).toThrow('<from>>[<via>>]<to>');
});

test('the Router fixture is unaffected by the new rules', () => {
  expect(checkStructure(routerFixture())).toEqual([]);
});
