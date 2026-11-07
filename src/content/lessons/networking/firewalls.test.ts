// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { drawFirewall } from '../../../art/scenes/firewall';
import { evaluateRules } from '../../../engine/net/firewall';
import { cidrContains } from '../../../engine/net/ipv4';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../../engine/timeline';
import { sceneViewOf } from '../../../scenes/driver';
import { firewallDriver } from '../../../scenes/drivers/firewall';
import { lessonNumbers, misnamedLessons, textsOf } from '../../../test/lesson-references';
import { showSweep } from '../../../test/show-sweep';
import { validateLesson } from '../../define';
import { checkResults, RULES, RULESETS } from '../../helpers/firewall-events';
import type { Lesson, MessageEvent, NoteEvent, Panel, SceneEvent, TableEvent } from '../../schema';
import firewalls from './firewalls';

afterEach(() => {
  document.body.innerHTML = '';
});

const unit = firewalls.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');
const byId = (id: string): SceneEvent => events.find((e) => e.id === id)!;
const checkOf = (id: string) => (byId(id) as MessageEvent).check;

/**
 * Each message and note's decision, worked out again by the engine: a visit is read against the rules in force (the
 * base order, or the one the latest change put in), from the source, the port and the protocol its log row shows.
 */
function engineDecisions(lesson: Lesson): string[] {
  let set: keyof typeof RULESETS = 'base';
  return lesson.units[0]!.steps.flatMap((s) => s.events).flatMap((e): string[] => {
    if (e.type === 'table') return [];
    if (e.type === 'note') {
      const arg = e.cues?.find((c) => c.cue === 'rules')?.arg as keyof typeof RULESETS;
      set = arg;
      return ['change'];
    }
    if (e.known !== undefined) return ['reply'];
    const rules = RULESETS[set].map((id) => RULES[id]);
    const sourceIp = e.log.source!.split(':')[0]!;
    const port = Number(e.log.destination!.split(':')[1]);
    const protocol = e.log.service!.split(' ')[0]!.toLowerCase() as 'tcp';
    const { ruleId, action } = evaluateRules(rules, { sourceIp, protocol, port });
    return [`${action} ${rules.findIndex((r) => r.id === ruleId) + 1}`];
  });
}

/** The panel's tables once step `n` has played its first `played` events (all of them when left out). */
function tablesAt(n: number, played?: number) {
  const p = positionOf(firewalls, 0, 'step', n);
  return deriveState(firewalls, p, played ?? stepEvents(firewalls, p).length).tables;
}

// ---------------------------------------------------------------- the lesson

test('Firewalls validates', () => {
  expect(() => validateLesson(firewalls)).not.toThrow();
  expect(firewalls.units).toHaveLength(1);
  expect(unit.steps).toHaveLength(6);
  expect(unit.practice).toHaveLength(3);
});

test('the lesson’s own words: title, subtitle, cert tags, summary, unit and reference', () => {
  expect(firewalls).toMatchObject({
    slug: 'firewalls',
    title: 'Firewalls',
    subtitle: 'Deciding what gets in',
    level: 'beginner',
    certTags: ['network-plus', 'security-plus', 'ccna', 'soc-analyst'],
    summary: 'Watch a firewall check each connection against its list of rules, from the top down, and see why the order of the rules matters.',
    figure: 'firewall',
  });
  expect(unit).toMatchObject({ id: 'firewalls', name: 'Firewall', fullName: 'Network firewall', purpose: 'A guard for your network', osiLayers: [3, 4] });
  expect(unit.references).toEqual([
    { label: 'NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy', url: 'https://csrc.nist.gov/pubs/sp/800/41/r1/final' },
  ]);
});

test('step titles are the technical terms, in order, and Learn’s pattern names four of them', () => {
  expect(unit.steps.map((s) => s.title)).toEqual(['Rule Evaluation', 'First-Match Rule', 'Source Filtering', 'Default Deny', 'Stateful Inspection', 'Rule Shadowing']);
  expect(unit.learn.pattern.names).toEqual(['Rule Evaluation', 'First-Match Rule', 'Default Deny', 'Stateful Inspection']);
  expect(unit.learn.terms.map((t) => t.name)).toEqual(['Firewall', 'Rule', 'Port', 'Source', 'First match', 'Default deny', 'Stateful', 'Shadowed rule']);
  expect(unit.practice.map((q) => q.answer)).toEqual([0, 0, 1]);
});

// ---------------------------------------------------------------- the decisions

test('the decisions are allow 1, deny 3, allow 2, deny 3, the reply, the change, deny 1', () => {
  const expected = ['allow 1', 'deny 3', 'allow 2', 'deny 3', 'reply', 'change', 'deny 1'];
  expect(engineDecisions(firewalls)).toEqual(expected);
  // The events say the same as the engine: each visit's check, where it ends, and its log row.
  const said = events.flatMap((e): string[] =>
    e.type === 'table' ? [] : e.type === 'note' ? ['change'] : e.check === undefined ? ['reply'] : [`${e.check.action} ${e.check.match}`],
  );
  expect(said).toEqual(expected);
  for (const m of messages.filter((e) => e.check !== undefined)) {
    const allowed = m.check!.action === 'allow';
    expect([m.to, m.outcome ?? 'delivered'], m.id).toEqual(allowed ? ['web', 'delivered'] : ['firewall', 'blocked']);
    expect(m.log.decision, m.id).toBe(`${allowed ? 'Allowed' : 'Denied'} · rule ${m.check!.match}`);
  }
});

test('each step’s Result fact agrees with the decision the engine makes', () => {
  const decisions = engineDecisions(firewalls);
  let i = 0;
  const results: [string, string][] = [];
  for (const step of unit.steps) {
    const own = step.events.filter((e) => e.type !== 'table').map(() => decisions[i++]!);
    const result = step.facts.find((f) => f.label === 'Result');
    if (result === undefined) continue;
    const [action, n] = own.at(-1)!.split(' ');
    expect(result.value, step.id).toMatch(new RegExp(`^${action === 'allow' ? 'Allowed' : 'Denied'} by .*\\brule ${n}$`));
    results.push([step.id, result.value]);
  }
  expect(results.map(([, value]) => value)).toEqual(['Allowed by rule 1', 'Denied by rule 3', 'Allowed by rule 2', 'Denied by rule 3', 'Denied by the new rule 1']);
});

test('a visit reads rules until the first fit: read 3 for the Telnet visit', () => {
  expect(checkOf('visit-telnet')).toEqual({ table: 'rules', read: 3, match: 3, action: 'deny' });
  expect(messages.filter((m) => m.check !== undefined).map((m) => [m.id, m.check!.read])).toEqual([
    ['visit-website', 1],
    ['visit-login', 3],
    ['admin-login', 2],
    ['visit-telnet', 3],
    ['visit-website-again', 1],
  ]);
  // A reply reads no rules: it belongs to a connection the firewall remembers.
  expect(byId('reply-website')).toMatchObject({ known: { table: 'conns', key: 'visitor:443' } });
  expect((byId('reply-website') as MessageEvent).check).toBeUndefined();
});

test('the firewall remembers each visit it let in, and the reply uses the website visit’s connection', () => {
  expect(tablesAt(1).conns!.rows.map((r) => r.key)).toEqual(['visitor:443']);
  expect(tablesAt(2).conns!.rows.map((r) => r.key)).toEqual(['visitor:443']);
  expect(tablesAt(4).conns!.rows).toEqual([
    { key: 'visitor:443', who: 'Visitor', port: '443', rule: '1', from: '203.0.113.50:50432', to: '10.0.0.10:443' },
    { key: 'admin:22', who: 'Admin', port: '22', rule: '2', from: '198.51.100.7:51876', to: '10.0.0.10:22' },
  ]);
});

test('after the change the rule list is DENY, ALLOW 443, ALLOW 22, and no connections are remembered', () => {
  // Step 6 starts with both connections remembered and the base order.
  const before = tablesAt(6, 0);
  expect(before.rules!.rows.map((r) => `${r.action} ${r.port}`)).toEqual(['ALLOW TCP 443', 'ALLOW TCP 22', 'DENY Any']);
  expect(before.conns!.rows).toHaveLength(2);
  // The change: its two table events and its note.
  const after = tablesAt(6, 3);
  expect(after.rules!.rows.map((r) => [r['#'], r.action, r.port, r.source])).toEqual([
    ['1', 'DENY', 'Any', 'Any'],
    ['2', 'ALLOW', 'TCP 443', 'Any'],
    ['3', 'ALLOW', 'TCP 22', '198.51.100.7/32'],
  ]);
  expect(after.conns!.rows).toEqual([]);
  expect(byId('move-catch-all')).toMatchObject({ type: 'note', cues: [{ cue: 'rules', arg: 'shadow' }], log: { decision: 'Rules changed' } });
});

// ---------------------------------------------------------------- checkResults (§7.4)

/** A copy of the lesson to break. */
const copy = (): Lesson => structuredClone(firewalls) as Lesson;
const stepOf = (l: Lesson, id: string) => l.units[0]!.steps.find((s) => s.id === id)!;
const eventOf = (l: Lesson, id: string) => l.units[0]!.steps.flatMap((s) => s.events).find((e) => e.id === id)!;

test('checkResults passes on the lesson as written', () => {
  expect(() => checkResults(firewalls)).not.toThrow();
});

test('checkResults throws on a copy whose Result fact says allowed for a denied visit', () => {
  const l = copy();
  stepOf(l, 'first-match').facts.find((f) => f.label === 'Result')!.value = 'Allowed by rule 3';
  expect(() => checkResults(l)).toThrow(/first-match.*Result.*“Allowed by rule 3”.*denied by rule 3/s);
});

test('checkResults throws when the rules in force are reordered, though every word stays the same', () => {
  // The change puts the base order back, in the rule list and in its cue: the last visit would now be allowed by rule 1.
  const l = copy();
  const rows = eventOf(l, 'move-catch-all-rules') as TableEvent;
  rows.rows = structuredClone((l.units[0]!.scene.panel as Extract<Panel, { type: 'rules' }>).rules.initialRows);
  (eventOf(l, 'move-catch-all') as NoteEvent).cues = [{ cue: 'rules', arg: 'base' }];
  expect(() => checkResults(l)).toThrow(/visit-website-again.*allow.*rule 1/s);
});

test('checkResults throws when a visit’s port is swapped, or its rule number is off', () => {
  // The visitor's login visit asks for port 443 instead: rule 1 would let it in.
  const port = copy();
  (eventOf(port, 'visit-login') as MessageEvent).log.destination = '10.0.0.10:443';
  expect(() => checkResults(port)).toThrow(/visit-login.*allowed by rule 1/s);

  const rule = copy();
  stepOf(rule, 'default-deny').facts.find((f) => f.label === 'Result')!.value = 'Denied by rule 2';
  expect(() => checkResults(rule)).toThrow(/default-deny.*“Denied by rule 2”/s);

  const read = copy();
  stepOf(read, 'rule-evaluation').facts.find((f) => f.label === 'Rules read')!.value = '2 of 3';
  expect(() => checkResults(read)).toThrow(/rule-evaluation.*Rules read.*“1 of 3”/s);
});

test('checkResults throws when the rule list shows other rules than the ones the decisions are worked out from', () => {
  const l = copy();
  (eventOf(l, 'move-catch-all') as NoteEvent).cues = [{ cue: 'rules', arg: 'base' }];
  expect(() => checkResults(l)).toThrow(/rule list.*base/s);
});

test('checkResults throws when a reply answers a connection the firewall does not remember', () => {
  const l = copy();
  (eventOf(l, 'reply-website') as MessageEvent).known = { table: 'conns', key: 'visitor:22' };
  expect(() => checkResults(l)).toThrow(/reply-website.*visitor:22.*not remember/s);
});

// ---------------------------------------------------------------- the scene

test('the panel holds the rule list and the connections it remembers, as the mockup shows them', () => {
  const panel = unit.scene.panel;
  expect(panel?.type).toBe('rules');
  if (panel?.type !== 'rules') return;
  expect(panel.rules).toMatchObject({ id: 'rules', title: 'Rule list', by: 'read from the top, first match wins', keyColumn: '#' });
  expect(panel.rules.columns.map((c) => [c.key, c.label, c.width ?? null, c.prose ?? false])).toEqual([
    ['#', '#', 28, false],
    ['action', 'Action', 64, false],
    ['port', 'Port', 76, false],
    ['source', 'Source', 132, false],
    ['note', 'For', null, true],
  ]);
  expect(panel.rules.initialRows.map((r) => r.note)).toEqual(['Website (HTTPS)', 'Admin login (SSH)', 'Block everything else']);
  expect(panel.conns).toMatchObject({
    id: 'conns',
    title: 'Connections it remembers',
    keyColumn: 'key',
    hiddenKey: true,
    initialRows: [],
    empty: 'None yet. Each allowed visit is remembered here.',
  });
  expect(panel.conns.columns.map((c) => c.label)).toEqual(['Who', 'Port', 'Let in by', 'From', 'To']);
});

test('the log is the firewall’s, with the mockup’s columns at the widths it draws them at 1280 px', () => {
  const { log } = unit.scene;
  expect(log.title).toBe('Firewall log');
  // The decision is the row's main words, set strong as the mockup's .log td.dec.
  expect(log.columns.map((c) => [c.key, c.label, c.width ?? null, c.prose ?? false, c.strong ?? false])).toEqual([
    ['source', 'Source', 168, false, false],
    ['destination', 'Destination', 168, false, false],
    ['service', 'Service', 146, false, false],
    ['decision', 'Decision', 234, false, true],
    ['plain', 'In plain words', null, true, false],
  ]);
  expect(log.legend).toEqual([
    { kind: 'request', label: 'Visit' },
    { kind: 'response', label: 'Reply' },
    { kind: 'blocked', label: 'Blocked' },
    { kind: 'change', label: 'Rule change' },
  ]);
});

test('the scene: its title, both views, and the four parties with their addresses', () => {
  expect(unit.scene.title).toBe('Office firewall · web server 10.0.0.10');
  expect(unit.scene.views).toEqual(['network', 'sequence']);
  expect(unit.scene.parties).toEqual([
    { place: 'visitor', label: 'Visitor', addr: '203.0.113.50' },
    { place: 'admin', label: 'Admin', addr: '198.51.100.7' },
    { place: 'firewall', label: 'Firewall', addr: 'rule list' },
    { place: 'web', label: 'Web server', addr: '10.0.0.10' },
  ]);
  // The empty log speaks for the whole lesson, from the Overview on, as the mockup's does.
  expect(unit.scene.log.idle).toBe('Nothing has reached the firewall yet. Press Play, or pick a step.');
  expect(unit.steps.filter((s) => s.idle !== undefined)).toEqual([]);
});

test('every message rides a tag the figure draws, with the figure’s own words', () => {
  const { svg } = drawFirewall();
  const words = [...svg.matchAll(/<text class="fw-tag-t"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  expect(messages.map((m) => m.tag)).toEqual(['HTTPS 443', 'SSH 22', 'SSH 22', 'TELNET 23', 'REPLY 443', 'HTTPS 443']);
  for (const m of messages) expect(words, m.id).toContain(m.tag);
});

test('every address is a documentation or private one', () => {
  const documentation = ['192.0.2.0/24', '198.51.100.0/24', '203.0.113.0/24'];
  const own = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];
  const addresses = [...new Set(textsOf(firewalls).flatMap((t) => t.match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g) ?? []))];
  expect(addresses.sort()).toEqual(['10.0.0.10', '198.51.100.7', '203.0.113.50']);
  for (const a of addresses) expect([...documentation, ...own].some((net) => cidrContains(net, a)), a).toBe(true);
  // No MAC addresses: the lesson works at layers 3 and 4.
  expect(textsOf(firewalls).join(' ')).not.toMatch(/\b[0-9a-f]{2}(?::[0-9a-f]{2}){5}\b/i);
});

/** The words a sentence uses for each lesson it may point at. */
const TOPIC: Record<string, string> = {
  'tcp-udp': 'SYN',
  'http-https': 'HTTPS',
  nat: 'NAT',
  subnetting: 'slash',
  vpn: 'VPN',
};

test('every “lesson N” in the text names the lesson its sentence is about, in the track’s numbering', () => {
  expect(lessonNumbers(firewalls).map((x) => x.n)).toEqual([12, 15, 13, 8, 20]);
  expect(misnamedLessons(firewalls, TOPIC)).toEqual([]);
});

// ---------------------------------------------------------------- the figure, as the console shows it

/** The figure on the page, and its driver. */
function mount() {
  const { svg, data } = drawFirewall();
  const host = document.createElement('div');
  host.innerHTML = svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="firewall"]')!;
  return { root, driver: firewallDriver.create(root, data) };
}

/** The view at position `p` once `n` of its events have played (all of them when `n` is left out). */
function viewAt(p: number, n = stepEvents(firewalls, p).length) {
  return sceneViewOf(unit, deriveState(firewalls, p, n));
}

/** What show leaves on the figure: the board, the marks, the lights, where each tag is, and the trail. */
function figureState(root: SVGSVGElement) {
  const q = (id: string) => root.querySelector<SVGElement>(`#${id}`)!;
  return {
    board: [0, 1, 2].map((i) => [q(`fw-brow-t-${i}`).textContent, q(`fw-brow-${i}`).getAttribute('class')]),
    bar: q('fw-bar').getAttribute('class'),
    arms: [q('fw-arms-down').style.opacity, q('fw-arms-up').style.opacity],
    stop: q('fw-stop').style.opacity,
    lit: [...root.querySelectorAll('.on')].map((el) => el.id).filter((id) => !id.startsWith('fw-sled')),
    tags: ['https', 'ssh', 'telnet', 'reply'].map((t) => [q(`fw-tag-${t}`).style.opacity, q(`fw-tag-${t}`).parentElement!.id]),
    trail: [q('fw-trail').getAttribute('class'), q('fw-trail').style.opacity],
  };
}

test('show draws every moment of the lesson, forwards, backwards and jumping, as a fresh driver draws it', () => {
  // Each position (the Overview, 6 steps, Learn, Practice) and each event of each step once more.
  expect(showSweep(firewalls)).toBe(slotsFor(firewalls).length + events.length);
});

test('the first position shows the base list on the board, the gate shut, and nothing lit or on its way', () => {
  const { root, driver } = mount();
  driver.show(viewAt(0, 0));
  expect(figureState(root)).toEqual({
    board: [
      ['1  ALLOW 443  ANY', 'fw-brow'],
      ['2  ALLOW 22   ADMIN', 'fw-brow'],
      ['3  DENY  ALL', 'fw-brow'],
    ],
    bar: 'fw-bar',
    arms: ['1', '0'],
    stop: '0',
    lit: [],
    tags: [
      ['0', 'fw-layer-front'],
      ['0', 'fw-layer-front'],
      ['0', 'fw-layer-front'],
      ['0', 'fw-layer-front'],
    ],
    trail: ['fw-trail', '0'],
  });
});

test('the end of each step shows where its last visit or reply ended up, and the rule that decided', () => {
  const { root, driver } = mount();
  const at = (n: number) => {
    driver.show(viewAt(positionOf(firewalls, 0, 'step', n)));
    return figureState(root);
  };
  // Step 1: let in by rule 1, the tag on top of the server behind the wall, the server busy.
  expect(at(1)).toMatchObject({ board: [['1  ALLOW 443  ANY', 'fw-brow allow'], ['2  ALLOW 22   ADMIN', 'fw-brow'], ['3  DENY  ALL', 'fw-brow']], bar: 'fw-bar allow', arms: ['0', '1'], stop: '0', lit: ['fw-busy-server'] });
  expect(at(1).tags[0]).toEqual(['1', 'fw-layer-behind']);
  // Step 2: turned away by rule 3 at the gate, in front of the wall, under the stop mark, its trail red.
  expect(at(2)).toMatchObject({ board: [['1  ALLOW 443  ANY', 'fw-brow miss'], ['2  ALLOW 22   ADMIN', 'fw-brow miss'], ['3  DENY  ALL', 'fw-brow deny']], bar: 'fw-bar deny', arms: ['1', '0'], stop: '1', trail: ['fw-trail deny', '0.9'] });
  expect(at(2).tags[1]).toEqual(['1', 'fw-layer-front']);
  // Step 5: the reply back at the visitor's laptop, whose screen glows; the gate open, no rule read.
  expect(at(5)).toMatchObject({ bar: 'fw-bar allow', arms: ['0', '1'], lit: ['fw-glow-visitor'], board: [['1  ALLOW 443  ANY', 'fw-brow'], ['2  ALLOW 22   ADMIN', 'fw-brow'], ['3  DENY  ALL', 'fw-brow']] });
  expect(at(5).tags[3]).toEqual(['1', 'fw-layer-front']);
  // Step 6: the new order on the board, and the website visit turned away by the new rule 1.
  expect(at(6).board).toEqual([['1  DENY  ALL', 'fw-brow deny'], ['2  ALLOW 443  ANY', 'fw-brow'], ['3  ALLOW 22   ADMIN', 'fw-brow']]);
});
