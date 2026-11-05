import { expect, test } from 'vitest';
import { evaluateRules, ruleRows, type FirewallRule } from './firewall';

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

test('a mistyped source in a rule that never matches still throws, wherever the rules are used', () => {
  const bad: FirewallRule = { id: 'typo', action: 'deny', protocol: 'tcp', port: 9999, source: '198.51.100.7', note: 'No slash' };
  const list = [rules[0]!, bad];
  // The first rule decides this visit, so the bad rule is never reached by matching.
  expect(() => evaluateRules(list, { sourceIp: '203.0.113.50', protocol: 'tcp', port: 443 })).toThrow(/Invalid CIDR "198.51.100.7"/);
  expect(() => ruleRows(list)).toThrow(/Invalid CIDR/);
});

test('ruleRows numbers rules from 1 and shows action and protocol in capitals', () => {
  expect(ruleRows(rules)).toEqual([
    { '#': '1', action: 'ALLOW', protocol: 'TCP', port: '443', source: 'any', note: 'Website (HTTPS)' },
    { '#': '2', action: 'ALLOW', protocol: 'TCP', port: '22', source: '198.51.100.7/32', note: 'Admin SSH' },
    { '#': '3', action: 'DENY', protocol: 'ANY', port: 'any', source: 'any', note: 'Block everything else' },
  ]);
  expect(ruleRows([])).toEqual([]);
});
