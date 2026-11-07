// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import firewalls from '../content/lessons/firewalls';
import type { Party } from '../content/schema';
import { deriveState, positionOf, type LogRow } from '../engine/timeline';
import { ROW_H, SequenceView } from './SequenceView';

const PARTIES: Party[] = [
  { place: 'visitor', label: 'Visitor', addr: '203.0.113.50' },
  { place: 'admin', label: 'Admin', addr: '198.51.100.7' },
  { place: 'firewall', label: 'Firewall', addr: 'rule list' },
  { place: 'web', label: 'Web server', addr: '10.0.0.10' },
];

function message(
  n: number,
  id: string,
  from: string,
  to: string,
  tag: string,
  kind: 'request' | 'response' = 'request',
  outcome: LogRow['outcome'] = 'delivered',
  cells: LogRow['cells'] = {},
): LogRow {
  return { n, eventId: id, type: 'message', kind, outcome, from, to, tag, cells, plain: `${tag} in plain words.` };
}

const ROWS: LogRow[] = [
  message(1, 'm1', 'visitor', 'web', 'HTTPS 443', 'request', 'delivered', { decision: 'Allowed · rule 1' }),
  message(2, 'm2', 'visitor', 'firewall', 'SSH 22', 'request', 'blocked', { decision: 'Denied · rule 3' }),
  message(3, 'm3', 'web', 'visitor', 'Reply', 'response'),
  { n: 4, eventId: 'n1', type: 'note', kind: null, outcome: null, from: null, to: null, tag: null, cells: {}, plain: 'Block everything else moves to the top.' },
  message(5, 'm4', 'admin', 'firewall', 'TELNET 23', 'request', 'blocked'),
  message(6, 'm5', 'visitor', 'web', 'HTTPS 443', 'request', 'dropped'),
];

/** Each party's lifeline x, read from the header. */
function lifelines(container: HTMLElement): Record<string, number> {
  return Object.fromEntries(
    [...container.querySelectorAll<SVGLineElement>('[data-party]')].map((line) => [line.dataset.party!, Number(line.getAttribute('x1'))]),
  );
}

const row = (container: HTMLElement, id: string) => container.querySelector<SVGGElement>(`[data-row="${id}"]`)!;

test('SequenceView draws one row per log row, in order, blocked rows ending in ✕ with their decision text', () => {
  const { container } = render(<SequenceView parties={PARTIES} rows={ROWS} current={null} />);
  expect(screen.getByRole('img', { name: 'The messages so far, as a sequence' })).toBeInTheDocument();

  // One row per log row, in order, a row height apart.
  const drawn = [...container.querySelectorAll<SVGGElement>('[data-row]')];
  expect(drawn.map((g) => g.dataset.row)).toEqual(['m1', 'm2', 'm3', 'n1', 'm4', 'm5']);
  const ys = drawn.map((g) => Number(/^translate\(0 ([\d.]+)\)$/.exec(g.getAttribute('transform')!)![1]));
  expect(ys.slice(1).map((y, i) => y - ys[i]!)).toEqual([ROW_H, ROW_H, ROW_H, ROW_H, ROW_H]);

  // Lifelines evenly spaced across the 720-wide view.
  const x = lifelines(container);
  expect(Object.keys(x)).toEqual(['visitor', 'admin', 'firewall', 'web']);
  const gaps = [x.admin! - x.visitor!, x.firewall! - x.admin!, x.web! - x.firewall!];
  expect(new Set(gaps).size).toBe(1);
  expect(x.visitor).toBeGreaterThan(0);
  expect(x.web).toBeLessThan(720);

  // A blocked visit stops at the party it was sent to, with a ✕ and its decision in words.
  const denied = row(container, 'm2');
  const deniedLine = denied.querySelector('line')!;
  expect(Number(deniedLine.getAttribute('x1'))).toBe(x.visitor);
  expect(Number(deniedLine.getAttribute('x2'))).toBeLessThan(x.firewall!);
  expect(Number(deniedLine.getAttribute('x2'))).toBeGreaterThan(x.firewall! - 20);
  expect(Number(denied.querySelector('[data-stop] circle')!.getAttribute('cx'))).toBe(x.firewall);
  expect(denied).toHaveTextContent('SSH 22');
  expect(denied).toHaveTextContent('Denied · rule 3');
  expect(denied.querySelector('[data-head]')).toBeNull();
  // With no decision written, it still says so in words.
  expect(row(container, 'm4').querySelector('[data-stop]')).not.toBeNull();
  expect(row(container, 'm4')).toHaveTextContent('Blocked');

  // A lost message stops halfway, with a ✕ and the word.
  const lost = row(container, 'm5');
  expect(Number(lost.querySelector('[data-stop] circle')!.getAttribute('cx'))).toBe((x.visitor! + x.web!) / 2);
  expect(lost).toHaveTextContent('Dropped');

  // A delivered message is an arrow from party to party, labelled with its tag.
  const allowed = row(container, 'm1');
  expect(Number(allowed.querySelector('line')!.getAttribute('x1'))).toBe(x.visitor);
  expect(allowed.querySelector('[data-head]')).not.toBeNull();
  expect(allowed.querySelector('[data-stop]')).toBeNull();
  expect(allowed).toHaveTextContent('HTTPS 443');
  expect(allowed).toHaveTextContent('Allowed · rule 1');
  const reply = row(container, 'm3');
  expect(Number(reply.querySelector('line')!.getAttribute('x1'))).toBe(x.web);
  expect(reply.querySelector('[data-head]')).not.toBeNull();

  // A note is a box across the middle lifeline.
  const note = row(container, 'n1');
  const box = note.querySelector('rect')!;
  expect(Number(box.getAttribute('x')) + Number(box.getAttribute('width')) / 2).toBe(x.firewall);
  expect(note).toHaveTextContent('Block everything else moves to the top.');
});

test('the header names every party with its address, and stays out of the scrolling rows', () => {
  const { container } = render(<SequenceView parties={PARTIES} rows={ROWS} current={null} />);
  const head = container.querySelector('svg[aria-hidden="true"]')!;
  for (const p of PARTIES) {
    expect(head).toHaveTextContent(p.label);
    expect(head).toHaveTextContent(p.addr);
  }
  expect(head.querySelector('[data-row]')).toBeNull();
  expect(screen.getByRole('region', { name: 'Sequence view' })).toHaveAttribute('tabindex', '0');
});

test('only the current row is marked to draw in', () => {
  const { container, rerender } = render(<SequenceView parties={PARTIES} rows={ROWS.slice(0, 2)} current={ROWS[1]!} />);
  expect([...container.querySelectorAll('[data-current]')].map((g) => g.getAttribute('data-row'))).toEqual(['m2']);
  rerender(<SequenceView parties={PARTIES} rows={ROWS.slice(0, 2)} current={null} />);
  expect(container.querySelector('[data-current]')).toBeNull();
});

test('with no rows it still draws the lifelines', () => {
  const { container } = render(<SequenceView parties={PARTIES} rows={[]} current={null} />);
  expect(container.querySelector('[data-row]')).toBeNull();
  expect(container.querySelectorAll('[data-party]')).toHaveLength(4);
});

test('a long note is cut to fit its box, and the whole sentence stays with it', () => {
  const plain =
    'The firewall reads its rules from the top, stops at the first one that matches, and that rule alone decides what happens to the visit.';
  expect(plain.length).toBeGreaterThan(130);
  const note: LogRow = { n: 1, eventId: 'n9', type: 'note', kind: null, outcome: null, from: null, to: null, tag: null, cells: {}, plain };
  const { container } = render(<SequenceView parties={PARTIES} rows={[note]} current={null} />);
  const box = row(container, 'n9').querySelector('rect')!;
  const [x, width] = [Number(box.getAttribute('x')), Number(box.getAttribute('width'))];
  // The box stays inside the 720-wide view, clear of the row numbers.
  expect(x).toBeGreaterThan(28);
  expect(x + width).toBeLessThanOrEqual(720);
  // Its words fit inside it: at about 6.6 units a character, with room at each end.
  const words = row(container, 'n9').querySelector('text.seq__note-text')!.textContent!;
  expect(words.endsWith('…')).toBe(true);
  expect(words.length * 6.6 + 24).toBeLessThanOrEqual(width);
  expect(plain.startsWith(words.slice(0, -1).trimEnd())).toBe(true);
  // The whole sentence is the box's title (the log under the scene has it too).
  expect(row(container, 'n9').querySelector('title')).toHaveTextContent(plain);
  // A short note is not cut.
  expect(row(render(<SequenceView parties={PARTIES} rows={ROWS} current={null} />).container, 'n1')).toHaveTextContent(
    'Block everything else moves to the top.',
  );
});

test('the Sequence view stops denied visits at the firewall with their rule', () => {
  // The Firewalls lesson as it stands at Learn: every visit, the reply and the change.
  const unit = firewalls.units[0]!;
  const { log } = deriveState(firewalls, positionOf(firewalls, 0, 'learn'), 0);
  const { container } = render(<SequenceView parties={unit.scene.parties} rows={log} current={null} />);
  const x = lifelines(container);
  expect(Object.keys(x)).toEqual(['visitor', 'admin', 'firewall', 'web']);

  const denied = ['visit-login', 'visit-telnet', 'visit-website-again'];
  expect(log.filter((r) => r.outcome === 'blocked').map((r) => r.eventId)).toEqual(denied);
  for (const [id, words] of [['visit-login', 'Denied · rule 3'], ['visit-telnet', 'Denied · rule 3'], ['visit-website-again', 'Denied · rule 1']] as const) {
    const drawn = row(container, id);
    expect(drawn.dataset.outcome, id).toBe('blocked');
    // It stops at the firewall's lifeline with a ✕, short of the web server, and says which rule turned it away.
    expect(Number(drawn.querySelector('[data-stop] circle')!.getAttribute('cx')), id).toBe(x.firewall);
    expect(Number(drawn.querySelector('line')!.getAttribute('x2')), id).toBeLessThan(x.firewall!);
    expect(drawn.querySelector('[data-head]'), id).toBeNull();
    expect(drawn.querySelector('.seq__decision'), id).toHaveTextContent(words);
  }
  // The visits let in go on to the web server, with their rule.
  for (const [id, from, words] of [['visit-website', 'visitor', 'Allowed · rule 1'], ['admin-login', 'admin', 'Allowed · rule 2']] as const) {
    const drawn = row(container, id);
    expect(Number(drawn.querySelector('line')!.getAttribute('x1')), id).toBe(x[from]);
    expect(drawn.querySelector('[data-head]'), id).not.toBeNull();
    expect(drawn.querySelector('.seq__decision'), id).toHaveTextContent(words);
  }
  // The reply goes back from the web server to the visitor; the change is a note across the firewall.
  expect(row(container, 'reply-website').dataset.dir).toBe('left');
  expect(row(container, 'reply-website').querySelector('.seq__decision')).toHaveTextContent('Allowed · known connection');
  const note = row(container, 'move-catch-all').querySelector('rect')!;
  expect(Number(note.getAttribute('x')) + Number(note.getAttribute('width')) / 2).toBe(x.firewall);
  expect(row(container, 'move-catch-all')).toHaveTextContent('Block everything else moves to the top.');
});
