// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { drawPool } from '../../art/scenes/pool';
import { POOL_HEALTH_WORDS } from '../../art/scenes/pool-parts';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import type { MessageEvent, TableEvent } from '../schema';
import loadBalancers from './load-balancers';

const unit = loadBalancers.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');
const tables = events.filter((e): e is TableEvent => e.type === 'table');
const ADDRESS: Record<string, string> = { a: '10.0.0.11', b: '10.0.0.12', c: '10.0.0.13' };

test('Load Balancers validates on the pool figure, with 5 steps and 2 questions', () => {
  expect(checkStructure(loadBalancers)).toEqual([]);
  expect(loadBalancers.figure).toBe('pool');
  expect(unit.steps.map((s) => s.title)).toEqual(['One Address, Three Servers', 'Spread Across the Pool', 'A Health Check Fails', 'Skipped While Unhealthy', 'Healthy Again']);
  expect(unit.practice.map((q) => q.options.length)).toEqual([3, 2]);
});

test('the pool table is the one the figure reads: keyed on server, four columns, three servers to start', () => {
  const panel = unit.scene.panel;
  expect(panel?.type).toBe('table');
  if (panel?.type !== 'table') return;
  expect(panel.table.id).toBe('pool');
  expect(panel.table.keyColumn).toBe('server');
  expect(panel.table.columns.map((c) => c.key)).toEqual(['server', 'address', 'health', 'requests']);
  expect(panel.table.initialRows?.map((r) => [r.server, r.address])).toEqual([['A', '10.0.0.11'], ['B', '10.0.0.12'], ['C', '10.0.0.13']]);
});

test('every health word is one the figure knows, every count a whole number to 4, every tag one it draws', () => {
  for (const t of tables) {
    expect(Object.keys(POOL_HEALTH_WORDS)).toContain(t.row?.health);
    expect(Number(t.row?.requests)).toBeGreaterThanOrEqual(0);
    expect(Number(t.row?.requests)).toBeLessThanOrEqual(4);
  }
  for (const m of messages) expect(['request', 'check', 'ok']).toContain(m.tag.toLowerCase());
});

test('the log’s addresses are the figure’s callouts: requests go to 203.0.113.80:80, checks and answers use the server’s address and port 80', () => {
  const { svg } = drawPool();
  expect(svg).toContain('203.0.113.80');
  for (const a of Object.values(ADDRESS)) expect(svg).toContain(a);
  for (const m of messages) {
    if (m.tag === 'REQUEST') expect(m.log.destination).toBe('203.0.113.80:80');
    if (m.tag === 'CHECK') expect(m.log.destination).toBe(`${ADDRESS[m.to]}:80`);
    if (m.tag === 'OK') expect(m.log.source).toBe(`${ADDRESS[m.from]}:80`);
  }
});

test('no source states a time or a size for these messages, so each is a dash', () => {
  for (const e of events.filter((x) => x.type !== 'table')) {
    if (e.type === 'table') continue;
    expect(e.log.time).toBe('—');
    expect(e.log.size).toBe('—');
  }
});

test('B stays marked unhealthy at "1 check passed" and comes back only with Healthy', () => {
  const b = tables.filter((t) => t.key === 'B').map((t) => [t.row?.health, t.miss === true]);
  expect(b).toEqual([['Healthy', false], ['1 check missed', false], ['Unhealthy', true], ['1 check passed', true], ['Healthy', false], ['Healthy', false]]);
});

test('the lesson never says proxy, nor least connections', () => {
  // The words a reader sees, not the citations or the reference list (one source's title has the word in it).
  const words = JSON.stringify(loadBalancers, (key, value) => (key === 'cite' || key === 'references' ? undefined : value));
  expect(words).not.toMatch(/proxy|least connection/i);
});

test('the figure’s show sweep passes for every moment of the lesson', () => {
  expect(showSweep(loadBalancers)).toBeGreaterThan(0);
});

test('every reader’s request is followed directly by its own server’s table row, and no step ends on a request', () => {
  for (const step of unit.steps) {
    step.events.forEach((e, i) => {
      if (e.type !== 'message' || e.tag !== 'REQUEST') return;
      const next = step.events[i + 1];
      expect(next?.type).toBe('table');
      if (next?.type === 'table') expect(next.key).toBe(e.to.toUpperCase());
    });
  }
});
