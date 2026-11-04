import { expect, test } from 'vitest';
import { evaluateRules, FIREWALL_COLUMNS } from '../../../engine/net/firewall';
import { deriveState } from '../../../engine/timeline';
import { countWords, estimateMinutes } from '../../estimate';
import { getEntries } from '../../registry';
import type { FlowScene, MessageEvent, Packet, SceneEvent, TableEvent, TryIt } from '../../schema';
import fw from './firewalls';

const outcomes = (events: SceneEvent[]) =>
  events.filter((e) => e.type === 'message' && e.id.endsWith('-in')).map((e) => (e as MessageEvent).outcome ?? 'delivered');
const flow = () => fw.scene as FlowScene;
const choices = () => (fw.tryIt as Extract<TryIt, { mode: 'choices' }>).choices;
const choice = (id: string) => choices().find((x) => x.id === id)!;
const step = (id: string) => fw.steps.find((s) => s.id === id)!;
const messages = (events: SceneEvent[]) => events.filter((e): e is MessageEvent => e.type === 'message');
const tables = (events: SceneEvent[]) => events.filter((e): e is TableEvent => e.type === 'table');
const fieldOf = (p: Packet, layer: string, field: string) => p.layers.find((l) => l.name === layer)!.fields.find((f) => f.name === field)?.value;

// ------------------------------------------------------------ the brief's tests

test('budget', () => expect(estimateMinutes(fw)).toBeLessThanOrEqual(15));
test('stays under the 12-minute warning', () => expect(estimateMinutes(fw)).toBeLessThanOrEqual(12));

test('step outcomes', () => expect(fw.steps.slice(0, 4).map((s) => outcomes(s.events)[0])).toEqual(['delivered', 'dropped', 'delivered', 'dropped']));

test('deny-first blocks everything', () => {
  expect(outcomes(choice('deny-first').events)).toHaveLength(4);
  expect(outcomes(choice('deny-first').events).every((o) => o === 'dropped')).toBe(true);
});

test('remove-admin denies admin SSH', () => {
  const admin = choice('remove-admin').events.find((e) => e.type === 'message' && (e as MessageEvent).from === 'admin') as MessageEvent;
  expect(admin.outcome).toBe('dropped');
});

test('only documentation or private addresses', () => {
  const addrs = flow().actors.flatMap((a) => a.addresses);
  expect(addrs.every((a) => /^(203\.0\.113|198\.51\.100|192\.0\.2|10\.)/.test(a))).toBe(true);
});

// ------------------------------------------------------------ meta and overview

test('meta follows the brief, with the NIST title and csrc.nist.gov address', () => {
  expect(fw).toMatchObject({ slug: 'firewalls', title: 'Firewalls', subtitle: 'Deciding what gets in', level: 'beginner', osiLayers: [3, 4] });
  expect(fw.certTags).toEqual(['network-plus', 'security-plus', 'ccna', 'soc-analyst']);
  expect(fw.references).toEqual([
    { label: 'NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy', url: 'https://csrc.nist.gov/pubs/sp/800/41/r1/final' },
  ]);
});

test('track entry is available as lesson 16', () =>
  expect(getEntries('networking').find((e) => e.slug === 'firewalls')).toMatchObject({ available: true, number: 16 }));

test('overview facts: default deny is worded as a recommendation, not a claim about every firewall', () => {
  expect(fw.overview.facts).toEqual([
    { label: 'Works with', value: 'Addresses and ports (layers 3–4)' },
    { label: 'Reads rules', value: 'Top to bottom, first match wins' },
    { label: 'Recommended default', value: 'Block anything not allowed' },
    { label: 'Common types', value: 'Packet filter, stateful, next-generation' },
  ]);
});

test('the overview tells the three types apart, and says a stateful firewall remembers the connections it allowed', () => {
  const d = fw.overview.description;
  expect(d).toMatch(/packet filter judges each packet on its own/i);
  expect(d).toMatch(/stateful firewall also remembers the connections it has allowed/i);
  expect(d).toMatch(/next-generation/i);
  expect(d).toMatch(/some products use other orders/);
});

// ------------------------------------------------------------ the scene

test('the scene: five actors, four wired links, views, and the rule table', () => {
  const scene = flow();
  expect(scene.views).toEqual(['network', 'sequence']);
  expect(scene.actors.map((a) => [a.id, a.label, a.addresses])).toEqual([
    ['visitor', 'Visitor', ['203.0.113.50']],
    ['admin', 'Admin laptop', ['198.51.100.7']],
    ['internet', 'The internet', []],
    ['fw', 'Firewall', []],
    ['web', 'Web server', ['10.0.0.10']],
  ]);
  expect(scene.links.map((l) => [l.from, l.to, l.medium])).toEqual([
    ['visitor', 'internet', 'wired'],
    ['admin', 'internet', 'wired'],
    ['internet', 'fw', 'wired'],
    ['fw', 'web', 'wired'],
  ]);
  const rules = scene.tables[0]!;
  expect(rules).toMatchObject({ id: 'rules', actor: 'fw', keyColumn: '#', columns: FIREWALL_COLUMNS });
  expect(rules.initialRows).toEqual([
    { '#': '1', action: 'ALLOW', protocol: 'TCP', port: '443', source: 'any', note: 'Website (HTTPS)' },
    { '#': '2', action: 'ALLOW', protocol: 'TCP', port: '22', source: '198.51.100.7/32', note: 'Admin SSH' },
    { '#': '3', action: 'DENY', protocol: 'ANY', port: 'any', source: 'any', note: 'Block everything else' },
  ]);
});

test('actors keep clear of the canvas edges so labels do not clip or overlap', () => {
  for (const a of flow().actors) {
    expect(a.y, a.id).toBeLessThanOrEqual(480);
    expect(a.x, a.id).toBeGreaterThanOrEqual(100);
  }
});

// ------------------------------------------------------------ the steps

const STEP_PROBES = [
  { id: 'https', from: 'visitor', src: '203.0.113.50', port: 443, rule: '1', verdict: 'ALLOW' },
  { id: 'ssh', from: 'visitor', src: '203.0.113.50', port: 22, rule: '3', verdict: 'DENY' },
  { id: 'admin-ssh', from: 'admin', src: '198.51.100.7', port: 22, rule: '2', verdict: 'ALLOW' },
  { id: 'telnet', from: 'visitor', src: '203.0.113.50', port: 23, rule: '3', verdict: 'DENY' },
];

test('the steps follow the brief: titles, one probe each, matched rule and verdict', () => {
  expect(fw.steps.map((s) => s.title)).toEqual([
    'Rules are read top to bottom',
    'The first match wins',
    'Rules can name a source',
    'Everything else is blocked',
    'Replies get through',
  ]);
  STEP_PROBES.forEach((p, i) => {
    const events = fw.steps[i]!.events;
    const inbound = messages(events)[0]!;
    expect(inbound).toMatchObject({ id: `${p.id}-in`, from: p.from, to: ['fw'], via: ['internet'], src: p.src, dst: `10.0.0.10:${p.port}`, protocol: 'TCP', kind: 'request' });
    expect(tables(events)[0]).toMatchObject({ op: 'match', key: p.rule, summary: `Rule ${p.rule} → ${p.verdict}` });
    // An allowed probe is passed on to the web server; a denied one stops at the firewall.
    expect(messages(events).map((m) => m.id)).toEqual(p.verdict === 'ALLOW' ? [`${p.id}-in`, `${p.id}-out`] : [`${p.id}-in`]);
  });
});

test('the engine agrees with every outcome the narratives state', () => {
  const rules = flow().tables[0]!.initialRows;
  const verdict = (src: string, port: number) => {
    const decided = evaluateRules(
      [
        { id: '1', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: '' },
        { id: '2', action: 'allow', protocol: 'tcp', port: 22, source: '198.51.100.7/32', note: '' },
        { id: '3', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: '' },
      ],
      { sourceIp: src, protocol: 'tcp', port },
    );
    return `${decided.ruleId}:${decided.action}`;
  };
  expect(rules).toHaveLength(3);
  expect(STEP_PROBES.map((p) => verdict(p.src, p.port))).toEqual(['1:allow', '3:deny', '2:allow', '3:deny']);
});

test('step 5 is one reply from the web server through the firewall and the internet, with no table event', () => {
  const events = step('replies').events;
  expect(events).toHaveLength(1);
  const reply = events[0] as MessageEvent;
  expect(reply).toMatchObject({
    type: 'message',
    from: 'web',
    to: ['visitor'],
    via: ['fw', 'internet'],
    kind: 'response',
    summary: 'HTTPS reply (part of an allowed connection)',
    protocol: 'TCP',
    src: '10.0.0.10:443',
  });
  expect(step('replies').id).toBe('replies');
});

test('the reply answers the step 1 connection: same visitor port, acknowledging the visitor\'s sequence number plus 1', () => {
  const reply = flow().packets['https-reply']!;
  const request = flow().packets['https']!;
  const port = fieldOf(request, 'TCP', 'Source port')!;
  expect((step('replies').events[0] as MessageEvent).dst).toBe(`203.0.113.50:${port}`);
  expect(fieldOf(reply, 'TCP', 'Destination port')).toBe(port);
  expect(fieldOf(reply, 'TCP', 'Source port')).toBe('443 (HTTPS)');
  expect(Number(fieldOf(reply, 'TCP', 'Acknowledgment number'))).toBe(Number(fieldOf(request, 'TCP', 'Sequence number')) + 1);
  expect(fieldOf(reply, 'TCP', 'Flags')).toBe('0x012 (SYN, ACK)');
});

test('times only move forward through the steps, so the log never runs backwards', () => {
  const times = fw.steps.flatMap((s) => messages(s.events).map((m) => m.time));
  expect(times).toEqual([...times].sort((a, b) => a - b));
});

test('step events never collide with each other; Try it events never collide with a step', () => {
  const stepIds = fw.steps.flatMap((s) => s.events.map((e) => e.id));
  expect(new Set(stepIds).size).toBe(stepIds.length);
  for (const c of choices()) {
    const ids = c.events.map((e) => e.id);
    expect(new Set(ids).size, c.id).toBe(ids.length);
    for (const id of ids) {
      expect(id === 'rules-replace' || id.startsWith(`${c.id}-`), id).toBe(true);
      expect(stepIds).not.toContain(id);
    }
  }
});

// ------------------------------------------------------------ the packets

test('every message has a TCP packet of IPv4 + TCP, 44 bytes, matching its event', () => {
  const all = [...fw.steps.flatMap((s) => s.events), ...choices().flatMap((c) => c.events)].flatMap((e) => (e.type === 'message' ? [e] : []));
  expect(all.length).toBeGreaterThan(0);
  for (const m of all) {
    const p = flow().packets[m.packet!]!;
    expect(p, m.id).toBeDefined();
    expect(p.size).toBe(44);
    expect(m.size).toBe(44);
    expect(p.layers.map((l) => l.name)).toEqual(['IPv4', 'TCP']);
    expect(fieldOf(p, 'IPv4', 'Source IP address'), m.id).toBe(m.src.split(':')[0]);
    expect(fieldOf(p, 'IPv4', 'Destination IP address'), m.id).toBe(m.dst.split(':')[0]);
    const dstPort = m.dst.split(':')[1]!;
    expect(fieldOf(p, 'TCP', 'Destination port'), m.id).toMatch(new RegExp(`^${dstPort}\\b`));
    expect(p.seenAt, m.id).toMatch(/^[A-Z].*\.$/);
  }
});

test('every packet has its own identification, and every request its own source port and sequence number', () => {
  const ps = Object.entries(flow().packets);
  const ids = ps.map(([, p]) => fieldOf(p, 'IPv4', 'Identification'));
  expect(new Set(ids).size).toBe(ps.length);
  const requests = ps.filter(([id]) => !id.endsWith('reply')).map(([, p]) => p);
  expect(new Set(requests.map((p) => fieldOf(p, 'TCP', 'Source port'))).size).toBe(requests.length);
  expect(new Set(requests.map((p) => fieldOf(p, 'TCP', 'Sequence number'))).size).toBe(requests.length);
  for (const p of requests) {
    const port = Number(fieldOf(p, 'TCP', 'Source port'));
    expect(port).toBeGreaterThanOrEqual(49152);
    expect(port).toBeLessThanOrEqual(65535);
  }
});

// ------------------------------------------------------------ Try it

test('Try it offers the three brief choices', () =>
  expect(choices().map((c) => [c.id, c.label])).toEqual([
    ['deny-first', "Move 'Block everything else' to the top"],
    ['allow-http', "Add 'Allow TCP 80' above the last rule"],
    ['remove-admin', 'Remove the admin SSH rule'],
  ]));

const replacedRows = (id: string) => (tables(choice(id).events)[0] as TableEvent).rows!;

test('every choice starts by replacing the rules, and the rows are the new order', () => {
  for (const c of choices()) expect(tables(c.events)[0]).toMatchObject({ id: 'rules-replace', op: 'replace' });
  expect(replacedRows('deny-first').map((r) => [r['#'], r.action, r.port])).toEqual([['1', 'DENY', 'any'], ['2', 'ALLOW', '443'], ['3', 'ALLOW', '22']]);
  expect(replacedRows('allow-http').map((r) => [r['#'], r.action, r.port, r.note])).toEqual([
    ['1', 'ALLOW', '443', 'Website (HTTPS)'],
    ['2', 'ALLOW', '22', 'Admin SSH'],
    ['3', 'ALLOW', '80', 'Website (HTTP)'],
    ['4', 'DENY', 'any', 'Block everything else'],
  ]);
  expect(replacedRows('remove-admin').map((r) => [r['#'], r.action, r.port])).toEqual([['1', 'ALLOW', '443'], ['2', 'DENY', 'any']]);
});

test('the same four probes run in every choice, in the step order, with allow-http adding visitor TCP 80', () => {
  const dsts = (id: string) => messages(choice(id).events).filter((m) => m.id.endsWith('-in')).map((m) => [m.from, m.dst]);
  const four = [['visitor', '10.0.0.10:443'], ['visitor', '10.0.0.10:22'], ['admin', '10.0.0.10:22'], ['visitor', '10.0.0.10:23']];
  expect(dsts('deny-first')).toEqual(four);
  expect(dsts('remove-admin')).toEqual(four);
  expect(dsts('allow-http')).toEqual([...four, ['visitor', '10.0.0.10:80']]);
});

test('outcomes in each choice', () => {
  expect(outcomes(choice('allow-http').events)).toEqual(['delivered', 'dropped', 'delivered', 'dropped', 'delivered']);
  expect(outcomes(choice('remove-admin').events)).toEqual(['delivered', 'dropped', 'dropped', 'dropped']);
});

test('the match events name the rule numbers in the new list', () => {
  const keys = (id: string) => tables(choice(id).events).filter((t) => t.op === 'match').map((t) => t.key);
  expect(keys('deny-first')).toEqual(['1', '1', '1', '1']);
  expect(keys('allow-http')).toEqual(['1', '4', '2', '4', '3']);
  expect(keys('remove-admin')).toEqual(['1', '2', '2', '2']);
});

test('at Try it the table shows the edited rules, and the port 80 visit highlights rule 3', () => {
  const state = deriveState(fw, 6, choice('allow-http').events.length, 'allow-http').tables.rules!;
  expect(state.rows).toHaveLength(4);
  expect(state.highlight).toEqual({ key: '3', type: 'matched' });
});

test('explanations say what each outcome was and why', () => {
  expect(choice('deny-first').explanation).toMatch(/all four visits are blocked/i);
  expect(choice('allow-http').explanation).toMatch(/port 80/);
  expect(choice('allow-http').explanation).toMatch(/lesson 14/);
  expect(choice('remove-admin').explanation).toMatch(/admin/);
});

// ------------------------------------------------------------ narrative facts

test('step 1 teaches the rule list and points ahead to ports, TCP and IP addresses; where 10.0.0.10 fits is a fact, not a second idea', () => {
  const n = step('rules-top-down').narrative;
  expect(n).toMatch(/lesson 11/);
  expect(n).toMatch(/lesson 10/);
  expect(n).toMatch(/lesson 3/);
  expect(n).toMatch(/TCP, the reliable way most connections travel; lesson 11/);
  expect(n).not.toMatch(/10\.0\.0\.10|NAT/);
  const web = step('rules-top-down').facts.find((f) => f.label === 'Web server')!;
  expect(web.value).toBe('10.0.0.10 is private, so in real life NAT passes visits on to it (lesson 12)');
  expect(n).toMatch(/port 443/);
});

test('step 2 walks the list: rule 1 is port 443, rule 2 is port 22 from 198.51.100.7, rule 3 covers everything', () => {
  const n = step('first-match').narrative;
  expect(n).toMatch(/Rule 1 covers port 443/);
  expect(n).toMatch(/Rule 2 covers port 22, but only for one address, 198\.51\.100\.7/);
  expect(n).toMatch(/Rule 3 covers everything/);
  expect(n).toMatch(/port 22/);
});

test('step 3 says /32 is exactly one address and points to lesson 7', () => {
  const n = step('named-source').narrative;
  expect(n).toMatch(/\/32 on the end means exactly that one address/);
  expect(n).toMatch(/lesson 7/);
});

test('step 4 names Telnet on port 23 as unencrypted, calls default deny a recommendation, and does not claim every firewall does it', () => {
  const n = step('everything-else').narrative;
  expect(n).toMatch(/port 23, Telnet/);
  expect(n).toMatch(/readable text/);
  expect(n).toMatch(/default deny/);
  expect(n).toMatch(/NIST/);
  expect(n).toMatch(/Not every firewall blocks by default/);
});

test('step 5 is precise about stateful and packet filters', () => {
  const n = step('replies').narrative;
  expect(n).toMatch(/stateful firewall keeps a table of the connections it has allowed/);
  expect(n).toMatch(/packet filter, which judges every packet alone, would need a rule of its own for replies/);
});

test('narratives obey the limits and the voice', () => {
  for (const s of fw.steps) expect(countWords(s.narrative), s.id).toBeLessThanOrEqual(120);
  expect(countWords(fw.overview.hook)).toBeLessThanOrEqual(80);
  expect(fw.steps).toHaveLength(5);
  expect(fw.check.length).toBeGreaterThanOrEqual(2);
  expect(fw.check.length).toBeLessThanOrEqual(3);
  expect(fw.recap.takeaways).toHaveLength(3);
});

test('the overview analogy is one guard at one front door, and steps stay with it', () => {
  expect(fw.overview.hook).toMatch(/guard at the front door/);
  for (const s of fw.steps) expect(s.narrative, s.id).toMatch(/\bguard\b|\bclipboard\b/);
  expect(step('everything-else').narrative).toMatch(/^The guard's clipboard/);
});

// ------------------------------------------------------------ check yourself

test('Check yourself asks the three brief questions with the right answers', () => {
  expect(fw.check).toHaveLength(3);
  const right = (i: number) => fw.check[i]!.options[fw.check[i]!.answer];
  expect(fw.check[0]!.prompt).toBe("A packet matches none of the rules in this lesson's list. What happens to it?");
  expect(right(0)).toBe('It is blocked, because no rule allows it');
  expect(fw.check[1]!.prompt).toMatch(/Rule 1: allow TCP 22 from any source\. Rule 2: deny TCP 22 from 203\.0\.113\.50/);
  expect(right(1)).toBe('Allowed, because rule 1 fits first');
  expect(right(2)).toBe("Rule 2, because it names the admin's address");
});

test('the correct answers are not always in the same place, nor always the longest', () => {
  expect(new Set(fw.check.map((q) => q.answer)).size).toBeGreaterThan(1);
  const longest = fw.check.map((q) => q.options[q.answer]!.length === Math.max(...q.options.map((o) => o.length)));
  expect(longest.every(Boolean)).toBe(false);
});

test('the rule-order question is right under first-match', () => {
  const decided = evaluateRules(
    [
      { id: 'a', action: 'allow', protocol: 'tcp', port: 22, source: 'any', note: '' },
      { id: 'b', action: 'deny', protocol: 'tcp', port: 22, source: '203.0.113.50/32', note: '' },
    ],
    { sourceIp: '203.0.113.50', protocol: 'tcp', port: 22 },
  );
  expect(decided).toEqual({ ruleId: 'a', action: 'allow' });
});

test('recap says what is recommended, not that every firewall blocks by default', () => {
  const text = fw.recap.takeaways.join(' ');
  expect(text).toMatch(/recommended policy is default deny/);
  expect(fw.recap.takeaways[1]).toMatch(/put the most specific rules first and the catch-all last/);
  expect(text).toMatch(/stateful firewall also remembers the connections it allowed/);
});

test('no gamification language anywhere in the lesson', () => {
  const text = JSON.stringify(fw.steps) + JSON.stringify(fw.tryIt) + JSON.stringify(fw.check) + JSON.stringify(fw.recap);
  expect(text.match(/\b(points|scores?|scored|badges?|streaks?|mission complete|xp)\b/i)?.[0]).toBeUndefined();
});

test('"Rules updated" lands on the first visit of each Try it choice, not on the last step\'s reply', () => {
  for (const c of choices()) {
    const log = deriveState(fw, 6, c.events.length, c.id).log;
    expect(log.find((row) => row.eventId === 'https-reply')!.tableChange, c.id).toBeUndefined();
    expect(log.find((row) => row.eventId === `${c.id}-https-in`)!.tableChange, c.id).toMatch(/^Rules updated; Rule \d → (ALLOW|DENY)$/);
    expect(log.filter((row) => row.tableChange?.includes('Rules updated')), c.id).toHaveLength(1);
  }
});
