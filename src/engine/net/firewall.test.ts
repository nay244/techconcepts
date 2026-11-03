import { expect, test } from 'vitest';
import { validateLesson } from '../../content/define';
import type { FlowScene, LessonInput, MessageEvent, SceneEvent, TableEvent } from '../../content/schema';
import { fixtureLesson } from '../../content/test-fixtures';
import { deriveState } from '../timeline';
import { evaluateRules, FIREWALL_COLUMNS, firewallScenario, ruleRows, type FirewallRule, type Probe } from './firewall';

const rules: FirewallRule[] = [
  { id: 'r1', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' },
  { id: 'r2', action: 'allow', protocol: 'tcp', port: 22, source: '198.51.100.7/32', note: 'Admin SSH' },
  { id: 'r3', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' },
];

test.each([
  ['203.0.113.50', 'tcp', 443, 'r1', 'allow'],
  ['203.0.113.50', 'tcp', 22, 'r3', 'deny'],
  ['198.51.100.7', 'tcp', 22, 'r2', 'allow'],
  ['203.0.113.50', 'udp', 53, 'r3', 'deny'],
])('%s %s/%i → %s %s', (sourceIp, protocol, port, ruleId, action) =>
  expect(evaluateRules(rules, { sourceIp, protocol: protocol as 'tcp', port })).toEqual({ ruleId, action }),
);

test('first match wins when deny-all is first', () =>
  expect(evaluateRules([rules[2]!, rules[0]!], { sourceIp: '203.0.113.50', protocol: 'tcp', port: 443 }).action).toBe('deny'));

test('no rules → implicit deny', () =>
  expect(evaluateRules([], { sourceIp: '1.2.3.4', protocol: 'tcp', port: 80 })).toEqual({ ruleId: null, action: 'deny' }));

test('no matching rule → implicit deny with no rule id', () =>
  expect(evaluateRules([rules[0]!], { sourceIp: '203.0.113.50', protocol: 'tcp', port: 22 })).toEqual({ ruleId: null, action: 'deny' }));

test('a protocol or port that differs from the rule does not match', () => {
  const https = rules[0]!;
  expect(evaluateRules([https], { sourceIp: '203.0.113.50', protocol: 'udp', port: 443 }).ruleId).toBeNull();
  expect(evaluateRules([https], { sourceIp: '203.0.113.50', protocol: 'tcp', port: 80 }).ruleId).toBeNull();
});

test('a CIDR source matches only addresses inside it', () => {
  const lan: FirewallRule = { id: 'lan', action: 'allow', protocol: 'any', port: 'any', source: '203.0.113.0/24', note: 'Branch office' };
  expect(evaluateRules([lan], { sourceIp: '203.0.113.200', protocol: 'tcp', port: 1 }).ruleId).toBe('lan');
  expect(evaluateRules([lan], { sourceIp: '203.0.114.1', protocol: 'tcp', port: 1 }).ruleId).toBeNull();
});

test('an invalid CIDR source throws so a bad lesson fails loudly', () => {
  const bad: FirewallRule = { ...rules[1]!, source: '198.51.100.7' };
  expect(() => evaluateRules([bad], { sourceIp: '198.51.100.7', protocol: 'tcp', port: 22 })).toThrow(/Invalid CIDR/);
});

test('columns', () =>
  expect(FIREWALL_COLUMNS).toEqual([
    { key: '#', label: '#' },
    { key: 'action', label: 'Action' },
    { key: 'protocol', label: 'Protocol' },
    { key: 'port', label: 'Port' },
    { key: 'source', label: 'Source' },
    { key: 'note', label: "What it's for" },
  ]));

test('ruleRows numbers rules from 1 and shows action and protocol in capitals', () => {
  expect(ruleRows(rules)).toEqual([
    { '#': '1', action: 'ALLOW', protocol: 'TCP', port: '443', source: 'any', note: 'Website (HTTPS)' },
    { '#': '2', action: 'ALLOW', protocol: 'TCP', port: '22', source: '198.51.100.7/32', note: 'Admin SSH' },
    { '#': '3', action: 'DENY', protocol: 'ANY', port: 'any', source: 'any', note: 'Block everything else' },
  ]);
  expect(ruleRows([])).toEqual([]);
});

const probe = (id: string, sourceIp: string, port: number, extra: Partial<Probe> = {}): Probe => ({
  id,
  label: `TCP ${port}`,
  from: 'visitor',
  to: 'web',
  sourceIp,
  destIp: '10.0.0.10',
  protocol: 'tcp',
  port,
  time: 1,
  size: 60,
  summary: 's',
  ...extra,
});

const asMessage = (e: SceneEvent | undefined): MessageEvent => {
  if (e?.type !== 'message') throw new Error('expected a message event');
  return e;
};
const asTable = (e: SceneEvent | undefined): TableEvent => {
  if (e?.type !== 'table') throw new Error('expected a table event');
  return e;
};

test('allowed probe → in, match, out', () => {
  const ev = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('https', '203.0.113.50', 443)] });
  expect(ev.map((e) => e.id)).toEqual(['https-in', 'https-match', 'https-out']);
  expect(asTable(ev[1]).key).toBe('1');
});

test('denied probe → dropped in, match', () => {
  const ev = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('ssh', '203.0.113.50', 22)] });
  expect(ev.map((e) => e.id)).toEqual(['ssh-in', 'ssh-match']);
  expect(asMessage(ev[0]).outcome).toBe('dropped');
  expect(asTable(ev[1]).key).toBe('3');
});

test('the in message is a request from the sender to the firewall', () => {
  const [inbound] = firewallScenario({
    firewall: 'fw',
    table: 'rules',
    rules,
    probes: [probe('https', '203.0.113.50', 443, { packet: 'p1', via: ['internet'] })],
  });
  expect(asMessage(inbound)).toEqual({
    type: 'message',
    id: 'https-in',
    from: 'visitor',
    to: ['fw'],
    via: ['internet'],
    src: '203.0.113.50',
    dst: '10.0.0.10:443',
    protocol: 'TCP',
    kind: 'request',
    label: 'TCP 443',
    summary: 's',
    size: 60,
    time: 1,
    outcome: 'delivered',
    packet: 'p1',
  });
});

test('UDP probes say UDP', () => {
  const [inbound] = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('dns', '203.0.113.50', 53, { protocol: 'udp' })] });
  expect(asMessage(inbound).protocol).toBe('UDP');
});

test('the out message goes from the firewall straight to the target, a moment later, without via', () => {
  const ev = firewallScenario({
    firewall: 'fw',
    table: 'rules',
    rules,
    probes: [probe('https', '203.0.113.50', 443, { via: ['internet'], packet: 'p1' })],
  });
  const out = asMessage(ev[2]);
  expect(out).toMatchObject({
    from: 'fw',
    to: ['web'],
    src: '203.0.113.50',
    dst: '10.0.0.10:443',
    protocol: 'TCP',
    kind: 'request',
    size: 60,
    time: 1.001,
    outcome: 'delivered',
    packet: 'p1',
  });
  expect(out.via).toBeUndefined();
});

test('omits via and packet when the probe has none', () => {
  const [inbound] = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('https', '203.0.113.50', 443)] });
  expect(asMessage(inbound)).not.toHaveProperty('via');
  expect(asMessage(inbound)).not.toHaveProperty('packet');
});

test('match summaries name the rule and its verdict', () => {
  const ev = firewallScenario({
    firewall: 'fw',
    table: 'rules',
    rules,
    probes: [probe('https', '203.0.113.50', 443), probe('ssh', '203.0.113.50', 22), probe('admin', '198.51.100.7', 22)],
  });
  const matches = ev.filter((e) => e.id.endsWith('-match')).map((e) => asTable(e));
  expect(matches.map((e) => e.summary)).toEqual(['Rule 1 → ALLOW', 'Rule 3 → DENY', 'Rule 2 → ALLOW']);
  expect(matches.every((e) => e.op === 'match' && e.table === 'rules')).toBe(true);
});

test('when no rule matches, the match key is empty and the verdict is deny', () => {
  const ev = firewallScenario({ firewall: 'fw', table: 'rules', rules: [rules[0]!], probes: [probe('ssh', '203.0.113.50', 22)] });
  expect(ev.map((e) => e.id)).toEqual(['ssh-in', 'ssh-match']);
  expect(asMessage(ev[0]).outcome).toBe('dropped');
  expect(asTable(ev[1])).toMatchObject({ op: 'match', key: '', summary: 'No rule matched → DENY' });
});

test('probes play in the order given', () => {
  const ev = firewallScenario({
    firewall: 'fw',
    table: 'rules',
    rules,
    probes: [probe('a', '203.0.113.50', 443), probe('b', '203.0.113.50', 22)],
  });
  expect(ev.map((e) => e.id)).toEqual(['a-in', 'a-match', 'a-out', 'b-in', 'b-match']);
});

test('replaceRules prepends a replace event', () =>
  expect(firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [], replaceRules: true })[0]).toMatchObject({
    op: 'replace',
    rows: ruleRows(rules),
  }));

test('the replace event is named for the table, says the rules changed and comes before the probes', () => {
  const ev = firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [probe('https', '203.0.113.50', 443)], replaceRules: true });
  expect(ev.map((e) => e.id)).toEqual(['rules-replace', 'https-in', 'https-match', 'https-out']);
  expect(asTable(ev[0])).toMatchObject({ type: 'table', table: 'rules', op: 'replace', summary: 'Rules updated' });
});

test('no replace event unless asked', () =>
  expect(firewallScenario({ firewall: 'fw', table: 'rules', rules, probes: [] })).toEqual([]));

// ---------------------------------------------------------------- inside a lesson

/**
 * A fixture lesson whose scene is a visitor, the internet, a firewall and a web
 * server, with every event generated by firewallScenario. It proves the
 * generated events satisfy the lesson schema and its cross-field rules
 * (known actors and tables, unique ids, packet sizes), and that the rows the
 * match events point at are the rows the table holds.
 *
 * Only the Try it choice replaces the rules: a replace event is always named
 * `${table}-replace`, so a step and a choice that both replaced the same table
 * would reuse an id the validator forbids.
 */
function firewallLesson(ruleSet: FirewallRule[] = rules): LessonInput {
  const base = fixtureLesson();
  const scene = base.scene as FlowScene;
  const visitorProbe = (id: string, sourceIp: string, port: number, extra: Partial<Probe> = {}) =>
    probe(id, sourceIp, port, { via: ['internet'], ...extra });
  const scenario = (probes: Probe[], rulesNow = ruleSet, replaceRules = false) =>
    firewallScenario({ firewall: 'fw', table: 'rules', rules: rulesNow, probes, replaceRules });

  const stepEvents = [
    // fixtureLesson's packet p1 is 34 bytes, so a probe that points at it must be too.
    scenario([visitorProbe('https', '203.0.113.50', 443, { packet: 'p1', size: 34 })]),
    scenario([visitorProbe('ssh', '203.0.113.50', 22)]),
    scenario([visitorProbe('admin', '198.51.100.7', 22)]),
    scenario([visitorProbe('dns', '203.0.113.50', 53, { protocol: 'udp' })]),
  ];

  return {
    ...base,
    scene: {
      ...scene,
      actors: [
        { id: 'visitor', kind: 'laptop', label: 'Visitor', addresses: ['203.0.113.50'], x: 100, y: 300 },
        { id: 'internet', kind: 'internet', label: 'Internet', addresses: [], x: 330, y: 300 },
        { id: 'fw', kind: 'firewall', label: 'Firewall', addresses: ['192.0.2.1', '10.0.0.1'], x: 560, y: 300 },
        { id: 'web', kind: 'server', label: 'Web server', addresses: ['10.0.0.10'], x: 860, y: 300 },
      ],
      links: [
        { id: 'visitor-internet', from: 'visitor', to: 'internet', medium: 'wired' },
        { id: 'internet-fw', from: 'internet', to: 'fw', medium: 'wired' },
        { id: 'fw-web', from: 'fw', to: 'web', medium: 'wired' },
      ],
      tables: [
        { id: 'rules', actor: 'fw', title: 'Rules', columns: [...FIREWALL_COLUMNS], keyColumn: '#', initialRows: ruleRows(ruleSet) },
      ],
    },
    steps: base.steps.map((step, i) => ({ ...step, events: stepEvents[i]! })),
    tryIt: {
      mode: 'choices',
      prompt: 'Which rule should go first?',
      choices: [
        {
          id: 'allow-first',
          label: 'Keep the order',
          // A choice may reuse a step's probe, but its event ids must not collide with the steps' ids.
          events: scenario([visitorProbe('allow-first-https', '203.0.113.50', 443)]),
          explanation: 'The allow rule is checked first, so the visit gets through.',
        },
        {
          id: 'deny-first',
          label: 'Reverse the order',
          events: scenario([visitorProbe('deny-first-https', '203.0.113.50', 443)], [...ruleSet].reverse(), true),
          explanation: 'The last rule is now checked first, so the rules after it may never be reached.',
        },
      ],
    },
  };
}

// Step positions in the lesson above: 1 https, 2 ssh, 3 admin, 4 dns, then 5 is Try it.
const TRY_IT = 5;

test('generated events pass lesson validation, in steps and in Try it choices', () => {
  expect(() => validateLesson(firewallLesson())).not.toThrow();
  expect(() => validateLesson(firewallLesson([rules[0]!, rules[1]!]))).not.toThrow();
});

test('the match event highlights the rule it names in the lesson timeline', () => {
  const { lesson } = validateLesson(firewallLesson());
  const highlightAfter = (position: number, events: number) => deriveState(lesson, position, events, null).tables.rules!.highlight;
  expect(highlightAfter(1, 2)).toEqual({ key: '1', type: 'matched' });
  expect(highlightAfter(2, 2)).toEqual({ key: '3', type: 'matched' });
  expect(highlightAfter(3, 2)).toEqual({ key: '2', type: 'matched' });
});

test('a dropped probe logs only its in message, and an allowed one logs both legs', () => {
  const { lesson } = validateLesson(firewallLesson());
  const logOf = (position: number) =>
    deriveState(lesson, position, 3, null).log.map((row) => [row.eventId, row.from, row.to, row.outcome]);
  expect(logOf(1)).toEqual([
    ['https-in', 'visitor', ['fw'], 'delivered'],
    ['https-out', 'fw', ['web'], 'delivered'],
  ]);
  // Step 2's log also holds step 1's two messages.
  expect(logOf(2).slice(2)).toEqual([['ssh-in', 'visitor', ['fw'], 'dropped']]);
});

test('Try it can reorder the rules: the replace swaps the rows and the match points into the new order', () => {
  const { lesson } = validateLesson(firewallLesson());
  const state = deriveState(lesson, TRY_IT, 3, 'deny-first').tables.rules!;
  expect(state.rows.map((row) => row.action)).toEqual(['DENY', 'ALLOW', 'ALLOW']);
  expect(state.highlight).toEqual({ key: '1', type: 'matched' });
  // The other choice leaves the table alone and matches the HTTPS rule.
  expect(deriveState(lesson, TRY_IT, 2, 'allow-first').tables.rules!.highlight).toEqual({ key: '1', type: 'matched' });
});

test('an unmatched probe highlights no row: its key names none', () => {
  const { lesson } = validateLesson(firewallLesson([rules[0]!, rules[1]!]));
  const state = deriveState(lesson, 2, 2, null).tables.rules!;
  expect(state.highlight).toEqual({ key: '', type: 'matched' });
  expect(state.rows.some((row) => row['#'] === state.highlight?.key)).toBe(false);
});
