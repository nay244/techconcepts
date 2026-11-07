import { expect, test } from 'vitest';
import { evaluateRules } from '../../engine/net/firewall';
import type { MessageEvent, NoteEvent, TableEvent } from '../schema';
import { ADDR, RULES, RULESETS, change, ruleTableRows, visits } from './firewall-events';

const { visit, reply } = visits();

test('the addresses, the rules and the two orders are the mockup’s', () => {
  expect(ADDR).toEqual({ visitor: '203.0.113.50', admin: '198.51.100.7', web: '10.0.0.10' });
  expect(RULES).toEqual({
    https: { id: 'https', action: 'allow', protocol: 'tcp', port: 443, source: 'any', note: 'Website (HTTPS)' },
    ssh: { id: 'ssh', action: 'allow', protocol: 'tcp', port: 22, source: '198.51.100.7/32', note: 'Admin login (SSH)' },
    rest: { id: 'rest', action: 'deny', protocol: 'any', port: 'any', source: 'any', note: 'Block everything else' },
  });
  expect(RULESETS).toEqual({ base: ['https', 'ssh', 'rest'], shadow: ['rest', 'https', 'ssh'] });
});

test('the rule list’s rows say each rule as the panel shows it, with the words the figure’s board shows', () => {
  expect(ruleTableRows('base')).toEqual([
    { '#': '1', action: 'ALLOW', port: 'TCP 443', source: 'Any', note: 'Website (HTTPS)', board: 'ALLOW 443  ANY' },
    { '#': '2', action: 'ALLOW', port: 'TCP 22', source: '198.51.100.7/32', note: 'Admin login (SSH)', board: 'ALLOW 22   ADMIN' },
    { '#': '3', action: 'DENY', port: 'Any', source: 'Any', note: 'Block everything else', board: 'DENY  ALL' },
  ]);
  expect(ruleTableRows('shadow').map((r) => [r['#'], r.action, r.port])).toEqual([
    ['1', 'DENY', 'Any'],
    ['2', 'ALLOW', 'TCP 443'],
    ['3', 'ALLOW', 'TCP 22'],
  ]);
});

test('an allowed visit goes on to the web server with the rule that let it in, and is remembered', () => {
  const events = visit({ id: 'v1', who: 'visitor', tag: 'HTTPS 443', port: 443, svc: 'HTTPS', sport: 50432, rules: 'base', plain: 'In.' });
  expect(events).toHaveLength(2);
  const [message, remembered] = events as [MessageEvent, TableEvent];
  expect(message).toEqual({
    type: 'message',
    id: 'v1',
    from: 'visitor',
    to: 'web',
    tag: 'HTTPS 443',
    kind: 'request',
    check: { table: 'rules', read: 1, match: 1, action: 'allow' },
    log: { source: '203.0.113.50:50432', destination: '10.0.0.10:443', service: 'TCP 443 · HTTPS', decision: 'Allowed · rule 1' },
    plain: 'In.',
  });
  expect(remembered).toMatchObject({
    type: 'table',
    id: 'v1-conn',
    table: 'conns',
    op: 'add',
    row: { key: 'visitor:443', who: 'Visitor', port: '443', rule: '1', from: '203.0.113.50:50432', to: '10.0.0.10:443' },
  });
  expect(remembered.summary).not.toBe('');
});

test('a denied visit stops at the firewall, blocked, with the rule that turned it away, and is not remembered', () => {
  const events = visit({ id: 'v2', who: 'visitor', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 50433, rules: 'base', plain: 'Out.' });
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({
    to: 'firewall',
    outcome: 'blocked',
    check: { table: 'rules', read: 3, match: 3, action: 'deny' },
    log: { source: '203.0.113.50:50433', destination: '10.0.0.10:22', service: 'TCP 22 · SSH', decision: 'Denied · rule 3' },
  });
});

test('a visit reads the rules until the first that fits, in the order in force', () => {
  // Each visit has an id of its own.
  let made = 0;
  const read = (who: 'visitor' | 'admin', port: number, rules: 'base' | 'shadow') =>
    (visit({ id: `read-${(made += 1)}`, who, tag: 'T', port, svc: 'S', sport: 50000, rules, plain: 'p' })[0] as MessageEvent).check;
  expect(read('admin', 22, 'base')).toEqual({ table: 'rules', read: 2, match: 2, action: 'allow' });
  expect(read('visitor', 23, 'base')).toEqual({ table: 'rules', read: 3, match: 3, action: 'deny' });
  expect(read('visitor', 443, 'shadow')).toEqual({ table: 'rules', read: 1, match: 1, action: 'deny' });
  // The same decision as the engine's, for every visit and both orders.
  for (const rules of ['base', 'shadow'] as const)
    for (const [who, port] of [['visitor', 443], ['visitor', 22], ['admin', 22], ['visitor', 23]] as const) {
      const engine = evaluateRules(RULESETS[rules].map((id) => RULES[id]), { sourceIp: ADDR[who], protocol: 'tcp', port });
      expect(read(who, port, rules)).toMatchObject({ action: engine.action, match: RULESETS[rules].indexOf(engine.ruleId as never) + 1 });
    }
});

test('a reply goes back from the web server to the visitor, let through by the connection the firewall remembers', () => {
  visit({ id: 'web-1', who: 'visitor', tag: 'HTTPS 443', port: 443, svc: 'HTTPS', sport: 50432, rules: 'base', plain: 'In.' });
  expect(reply({ id: 'r1', of: 'web-1', tag: 'REPLY 443', plain: 'Back.' })).toEqual([
    {
      type: 'message',
      id: 'r1',
      from: 'web',
      to: 'visitor',
      tag: 'REPLY 443',
      kind: 'response',
      known: { table: 'conns', key: 'visitor:443' },
      log: { source: '10.0.0.10:443', destination: '203.0.113.50:50432', service: 'TCP 443 · HTTPS', decision: 'Allowed · known connection' },
      plain: 'Back.',
    },
  ]);
});

test('a reply needs a visit the firewall let in', () => {
  visit({ id: 'login-1', who: 'visitor', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 50433, rules: 'base', plain: 'Out.' });
  expect(() => reply({ id: 'r2', of: 'login-1', tag: 'REPLY 22', plain: 'p' })).toThrow(/"login-1".*was denied/);
  expect(() => reply({ id: 'r3', of: 'nothing', tag: 'REPLY 22', plain: 'p' })).toThrow(/"nothing", which is not a visit made yet/);
});

test('a reply written before its visit says to write the visit first', () => {
  expect(() => reply({ id: 'early-reply', of: 'late-visit', tag: 'REPLY 443', plain: 'p' })).toThrow(
    /The reply "early-reply" answers "late-visit", which is not a visit made yet: write visit\(\{ id: "late-visit", … \}\) before the reply\./,
  );
  // Once the visit is made, the same reply works.
  visit({ id: 'late-visit', who: 'visitor', tag: 'HTTPS 443', port: 443, svc: 'HTTPS', sport: 50432, rules: 'base', plain: 'In.' });
  expect(reply({ id: 'early-reply', of: 'late-visit', tag: 'REPLY 443', plain: 'p' })[0]).toMatchObject({ known: { table: 'conns', key: 'visitor:443' } });
});

test('a visit id is made once: a second visit with the same id throws, and the first one stands', () => {
  visit({ id: 'twice', who: 'admin', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 51876, rules: 'base', plain: 'In.' });
  expect(() => visit({ id: 'twice', who: 'visitor', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 50433, rules: 'base', plain: 'Out.' })).toThrow(
    /The visit "twice" is made twice: each visit needs an id of its own\./,
  );
  // The reply still answers the admin's visit, the one made first.
  expect(reply({ id: 'twice-reply', of: 'twice', tag: 'REPLY 22', plain: 'p' })[0]).toMatchObject({ to: 'admin', known: { key: 'admin:22' } });
});

test('each set of visits remembers its own: a lesson module that runs again, as the dev server runs it after an edit, makes its visits afresh', () => {
  const first = visits();
  first.visit({ id: 'again', who: 'visitor', tag: 'HTTPS 443', port: 443, svc: 'HTTPS', sport: 50432, rules: 'base', plain: 'In.' });
  const second = visits();
  // The second set has made no visit yet, so a reply waits for its own.
  expect(() => second.reply({ id: 'again-reply', of: 'again', tag: 'REPLY 443', plain: 'p' })).toThrow(/"again", which is not a visit made yet/);
  // The same id is made once in each.
  expect(() => second.visit({ id: 'again', who: 'admin', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 51876, rules: 'base', plain: 'In.' })).not.toThrow();
  expect(() => second.visit({ id: 'again', who: 'admin', tag: 'SSH 22', port: 22, svc: 'SSH', sport: 51876, rules: 'base', plain: 'In.' })).toThrow(/made twice/);
  expect(first.reply({ id: 'again-reply', of: 'again', tag: 'REPLY 443', plain: 'p' })[0]).toMatchObject({ to: 'visitor', known: { key: 'visitor:443' } });
  expect(second.reply({ id: 'again-reply', of: 'again', tag: 'REPLY 22', plain: 'p' })[0]).toMatchObject({ to: 'admin', known: { key: 'admin:22' } });
});

test('a change puts the new order in the rule list, forgets every connection, then says so in the log', () => {
  const events = change({ id: 'c1', rules: 'shadow', plain: 'Moved.' });
  expect(events.map((e) => e.type)).toEqual(['table', 'table', 'note']);
  const [rows, conns, note] = events as [TableEvent, TableEvent, NoteEvent];
  expect(rows).toMatchObject({ id: 'c1-rules', table: 'rules', op: 'replace', rows: ruleTableRows('shadow') });
  expect(conns).toMatchObject({ id: 'c1-conns', table: 'conns', op: 'clear' });
  expect(note).toEqual({
    type: 'note',
    id: 'c1',
    log: { source: '–', destination: '–', service: '–', decision: 'Rules changed' },
    plain: 'Moved.',
    cues: [{ cue: 'rules', arg: 'shadow' }],
  });
  expect(rows.summary).toBe('The rule list now reads: 1 Block everything else, 2 Website (HTTPS), 3 Admin login (SSH).');
});
