// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { arpFixture, natFixture, portsFixture } from '../../content/batch1-fixtures';
import type { Lesson } from '../../content/schema';
import { deriveState } from '../../engine/timeline';
import { LogPanel } from '../LogPanel';
import { TablePanel } from './TablePanel';

// D11 / B13, attack cases 16 to 18 and 20 to 23 (prototypes/d11-cases.md), on each fixture's settled panel and log.
// A position is a slot: 0 is the Overview, then one for each step, counted from 1.

const panel = (lesson: Lesson, step: number, played: number) => {
  const unit = lesson.units[0]!;
  const def = unit.scene.panel!.type === 'table' ? unit.scene.panel!.table : (() => { throw new Error('a table panel'); })();
  const state = deriveState(lesson, step, played).tables[def.id]!;
  const { container } = render(<TablePanel def={def} state={state} />);
  const rows = [...container.querySelectorAll<HTMLElement>('tbody tr')];
  return {
    container,
    /** Each row's first cell and highlight, the empty text and no-match row by their classes. */
    summary: rows.map((r) => (r.classList.contains('tpanel__nomatch') ? 'nomatch' : r.querySelector('.tpanel__empty') !== null ? 'empty' : `${r.querySelectorAll('td')[def.columns.findIndex((c) => c.key === def.keyColumn)]!.textContent!.replace(/ \((new|matched|changed)\)$/, '')}${r.getAttribute('data-highlight') === null ? '' : `:${r.getAttribute('data-highlight')}`}`)),
    nomatch: container.querySelector<HTMLElement>('tr.tpanel__nomatch'),
    label: container.querySelector('.tpanel')!.getAttribute('aria-label'),
  };
};
const lastOf = (lesson: Lesson, step: number): number => lesson.units[0]!.steps[step - 1]!.events.length;

test('ARP: the empty text, then the no-match row; step 2 starts with no no-match row; the row is on screen until the remove, and the add ends the no-match row', () => {
  const arp = arpFixture();
  const miss = panel(arp, 1, 1);
  expect(miss.summary).toEqual(['empty', 'nomatch']);
  expect(miss.nomatch!.textContent).toContain('Nothing for 192.168.1.1 in the cache.');
  expect(panel(arp, 2, 0).summary).toEqual(['empty']);
  expect(panel(arp, 3, 1).summary).toEqual(['192.168.1.1:added']);
  expect(panel(arp, 5, 0).summary).toEqual(['192.168.1.1']);
  // The remove has played: the row is gone and the empty text is back. The no-match row follows its match.
  expect(panel(arp, 5, 1).summary).toEqual(['empty']);
  expect(panel(arp, 5, 2).summary).toEqual(['empty', 'nomatch']);
  const end = panel(arp, 5, lastOf(arp, 5));
  expect(end.summary).toEqual(['192.168.1.1:added']);
  expect(end.nomatch).toBeNull();
  // A hit shows the row matched; a step 4 start shows one row, no highlight.
  expect(panel(arp, 4, 0).summary).toEqual(['192.168.1.1']);
  expect(panel(arp, 4, 1).summary).toEqual(['192.168.1.1:matched']);
});

test('Ports: three rows at the Overview, the no-match row under them at step 4’s end, and a fourth row matched at step 5’s end', () => {
  const ports = portsFixture();
  expect(panel(ports, 0, 0).summary).toEqual(['TCP 22', 'TCP 80', 'TCP 443']);
  expect(panel(ports, 4, 0).summary).toEqual(['TCP 22', 'TCP 80', 'TCP 443']);
  const refused = panel(ports, 4, lastOf(ports, 4));
  expect(refused.summary).toEqual(['TCP 22', 'TCP 80', 'TCP 443', 'nomatch']);
  expect(refused.container.querySelector('[data-highlight]')).toBeNull();
  expect(panel(ports, 5, 0).summary).toEqual(['TCP 22', 'TCP 80', 'TCP 443']);
  const open = panel(ports, 5, lastOf(ports, 5));
  expect(open.summary).toEqual(['TCP 22', 'TCP 80', 'TCP 443', 'TCP 3389:matched']);
  expect(open.nomatch).toBeNull();
});

test('NAT: two rows and the no-match row at step 5’s end; each match highlights its own row; no replace sets a by-line, so the label is the title', () => {
  const nat = natFixture();
  const end = panel(nat, 5, lastOf(nat, 5));
  expect(end.summary).toEqual(['61023', '63847', 'nomatch']);
  expect(end.label).toBe('NAT table');
  expect(panel(nat, 2, 2).summary).toEqual(['61023:matched']);
  // Step 4: the phone's match, then the laptop's second match.
  expect(panel(nat, 4, 2).summary).toEqual(['61023', '63847:matched']);
  expect(panel(nat, 4, 5).summary).toEqual(['61023:matched', '63847']);
  expect(panel(nat, 0, 0).summary).toEqual(['empty']);
});

test('the legends are §3’s, in order, and every message kind a fixture uses has an entry', () => {
  const legends = (l: Lesson) => l.units[0]!.scene.log.legend;
  expect(legends(arpFixture())).toEqual([
    { kind: 'broadcast', label: 'Broadcast to everyone' },
    { kind: 'response', label: 'Reply' },
    { kind: 'request', label: 'Packet' },
  ]);
  expect(legends(portsFixture())).toEqual([
    { kind: 'request', label: 'Request' },
    { kind: 'response', label: 'Reply' },
    { kind: 'control', label: 'Reset' },
  ]);
  expect(legends(natFixture())).toEqual([
    { kind: 'request', label: 'Packet' },
    { kind: 'response', label: 'Reply' },
  ]);
  for (const lesson of [arpFixture(), portsFixture(), natFixture()]) {
    const explained = new Set(legends(lesson).map((e) => e.kind));
    for (const e of lesson.units[0]!.steps.flatMap((s) => s.events)) if (e.type === 'message') expect(explained.has(e.kind), `${lesson.slug} ${e.id}`).toBe(true);
  }
});

test('Ports’ step 4 adds a request row, then a control row from 203.0.113.80:3389, and nothing is blocked or dropped', () => {
  const ports = portsFixture();
  const before = deriveState(ports, 4, 0).log.length;
  const state = deriveState(ports, 4, lastOf(ports, 4));
  const added = state.log.slice(before);
  expect(added.map((r) => r.kind)).toEqual(['request', 'control']);
  expect(added[1]!.cells.source).toBe('203.0.113.80:3389');
  expect(state.log.every((r) => r.outcome === 'delivered')).toBe(true);
  const { container } = render(<LogPanel log={ports.units[0]!.scene.log} rows={added} idle="x" />);
  expect([...container.querySelectorAll('tbody [data-glyph]')].map((g) => g.getAttribute('data-glyph'))).toEqual(['request', 'control']);
  // Nothing is lost: the figure's drop mark and its lost trail stay off.
  expect(ports.units[0]!.steps.flatMap((s) => s.events).some((e) => e.type === 'message' && e.outcome !== undefined)).toBe(false);
  expect(JSON.stringify(ports)).not.toMatch(/"drop"|"dropped"|"blocked"/);
});

test('NAT’s step 5 adds exactly one log row, from 192.0.2.66:51200, and nothing leaves the router, drops or is noted as dropped', () => {
  const nat = natFixture();
  const before = deriveState(nat, 5, 0).log.length;
  const state = deriveState(nat, 5, lastOf(nat, 5));
  expect(state.log).toHaveLength(before + 1);
  expect(state.log.at(-1)!.cells.source).toBe('192.0.2.66:51200');
  const events = nat.units[0]!.steps[4]!.events;
  expect(events.some((e) => e.type === 'message' && e.from === 'router')).toBe(false);
  expect(JSON.stringify(events)).not.toMatch(/"cue":"drop"|"dropped"/);
});

test('NAT: no event of steps 3 to 5 carries a status cue, and the line ends at “Reply received”, done; no step of any fixture sets a status', () => {
  const nat = natFixture();
  const cues = (step: number) => nat.units[0]!.steps[step - 1]!.events.flatMap((e) => (e.type === 'table' ? [] : (e.cues ?? []).map((c) => c.cue)));
  for (const step of [3, 4, 5]) expect(cues(step).filter((c) => c.startsWith('status')), `step ${step}`).toEqual([]);
  // Step 2 sets "Reply received", done; steps 3 to 5 keep it.
  const status = nat.units[0]!.steps[1]!.events.flatMap((e) => (e.type === 'table' ? [] : (e.cues ?? [])));
  expect(status).toEqual([{ cue: 'status', arg: 'Reply received' }, { cue: 'status-done' }]);
  for (const lesson of [arpFixture(), portsFixture(), nat]) for (const step of lesson.units[0]!.steps) expect(step.status, `${lesson.slug} ${step.id}`).toBeUndefined();
});

test('Ports and NAT carry no `over` on any message; ARP’s all say Ethernet', () => {
  const overs = (l: Lesson) => l.units[0]!.steps.flatMap((s) => s.events).flatMap((e) => (e.type === 'message' ? [e.over] : []));
  expect(overs(portsFixture()).every((o) => o === undefined)).toBe(true);
  expect(overs(natFixture()).every((o) => o === undefined)).toBe(true);
  expect(new Set(overs(arpFixture()))).toEqual(new Set(['Ethernet']));
});
