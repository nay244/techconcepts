// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import firewalls from '../../content/lessons/networking/firewalls';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import type { PanelMark } from '../../scenes/driver';
import { UnitPanel } from './UnitPanel';

const unit = firewalls.units[0]!;

function at(n: number, played?: number) {
  const p = positionOf(firewalls, 0, 'step', n);
  return deriveState(firewalls, p, played ?? stepEvents(firewalls, p).length);
}
const checks = (container: HTMLElement) => [...container.querySelectorAll('tbody tr')].map((tr) => tr.querySelector('td:last-child')!.textContent);

test('a rules panel shows the rule list, with the marks of the visit that played or the one that landed', () => {
  const marks: PanelMark[] = [{ row: 0, state: 'check' }];
  // While the Telnet visit plays, the driver's marks.
  const { container, rerender } = render(<UnitPanel panel={unit.scene.panel} derived={at(4, 0)} marks={marks} playing={unit.steps[3]!.events[0]!} />);
  expect(container.querySelector('[data-panel="rules"]')).not.toBeNull();
  expect(checks(container)).toEqual(['Checking', '', '']);
  // Once it has landed, the marks its check works out.
  rerender(<UnitPanel panel={unit.scene.panel} derived={at(4)} marks={[]} playing={null} />);
  expect(checks(container)).toEqual(['Doesn’t fit', 'Doesn’t fit', 'Fits → deny']);
});

test('while the table event a visit brings lands, its marks stay; while the next visit plays, they go', () => {
  // Step 1: the visit has landed, and the connection it brings is about to be remembered.
  const remembered = unit.steps[0]!.events[1]!;
  expect(remembered).toMatchObject({ type: 'table', id: 'visit-website-conn', table: 'conns', op: 'add' });
  const { container, rerender } = render(<UnitPanel panel={unit.scene.panel} derived={at(1, 1)} marks={[]} playing={remembered} />);
  expect(checks(container)).toEqual(['Fits → allow', '', '']);
  // Step 6: the change has landed and the visit after it plays, with no mark yet.
  const next = unit.steps[5]!.events[3]!;
  expect(next).toMatchObject({ type: 'message', id: 'visit-website-again' });
  rerender(<UnitPanel panel={unit.scene.panel} derived={at(6, 3)} marks={[]} playing={next} />);
  expect(checks(container)).toEqual(['', '', '']);
});

test('the rule list’s rows come in once when a change replaces them while the step plays, and not when the learner lands there', () => {
  // The change's note plays just after its table events have replaced the rows.
  const { container, rerender } = render(<UnitPanel panel={unit.scene.panel} derived={at(6, 2)} marks={[]} playing={unit.steps[5]!.events[2]!} />);
  expect(container.querySelector('tbody')).toHaveAttribute('data-moved');
  const rows = container.querySelector('tbody tr');
  // The same rows to the end of the step: they came in once, and are not made again.
  rerender(<UnitPanel panel={unit.scene.panel} derived={at(6)} marks={[]} playing={null} />);
  expect(container.querySelector('tbody tr')).toBe(rows);
  // Landing on the step by hand, settled, nothing moves.
  const settled = render(<UnitPanel panel={unit.scene.panel} derived={at(6)} marks={[]} playing={null} />);
  expect(settled.container.querySelector('tbody')).not.toHaveAttribute('data-moved');
});
