// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import type { Lesson } from '../content/schema';
import { fixtureLesson } from '../content/test-fixtures';
import type { LogRow } from '../engine/timeline';
import { useInspector } from './useInspector';

const L: Lesson = validateLesson(fixtureLesson()).lesson;

const row = (n: number): LogRow => ({
  n,
  eventId: `e${n}`,
  time: n,
  from: 'a',
  to: ['b'],
  src: '192.168.1.10',
  dst: '192.168.1.20',
  protocol: 'Demo',
  label: `Row ${n}`,
  summary: `Row ${n}`,
  size: 34,
  kind: 'request',
  outcome: 'delivered',
  packet: 'p1',
});

interface HarnessProps {
  position: number;
  /** Whether the two "Open" buttons, the inspector's openers, are on the page. */
  openers?: boolean;
}

/** Just enough page for the hook: two openers, an explanation to fall back to, and the inspector's box. */
function Harness({ position, openers = true }: HarnessProps) {
  const explanation = useRef<HTMLElement>(null);
  const inspector = useInspector({ lesson: L, position, log: [row(1), row(2)], dispatch: vi.fn(), fallbackFocus: explanation });
  return (
    <>
      <section ref={explanation} aria-label="Explanation" tabIndex={0} />
      {openers ? (
        <>
          <button type="button" onClick={() => inspector.openPacket('p1', 1)}>
            Open 1
          </button>
          <button type="button" onClick={() => inspector.openPacket('p1', 2)}>
            Open 2
          </button>
        </>
      ) : null}
      {inspector.open !== null ? (
        <div ref={inspector.boxRef}>
          <section className="inspector" aria-label="Packet inspector">
            <p>Row {inspector.open.n}</p>
            <div className="inspector__actions">
              <button type="button" onClick={inspector.close}>
                Close inspector
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

const inspector = () => screen.queryByRole('region', { name: 'Packet inspector' });

test('opening moves focus into the inspector, and closing it returns focus to the opener', async () => {
  const user = userEvent.setup();
  render(<Harness position={1} />);
  await user.click(screen.getByRole('button', { name: 'Open 1' }));
  expect(document.activeElement).toBe(inspector());
  await user.click(screen.getByRole('button', { name: 'Close inspector' }));
  expect(inspector()).not.toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open 1' }));
});

// M1
test('a move to another position closes it, and focus that was inside goes back to the opener', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Harness position={1} />);
  await user.click(screen.getByRole('button', { name: 'Open 1' }));
  expect(inspector()).toContainElement(document.activeElement as HTMLElement);

  rerender(<Harness position={2} />);
  expect(inspector()).not.toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open 1' }));
});

test('a move to another position, with the opener gone, sends focus to the explanation instead of the page', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Harness position={1} />);
  await user.click(screen.getByRole('button', { name: 'Open 1' }));
  rerender(<Harness position={1} openers={false} />);
  expect(inspector()).toContainElement(document.activeElement as HTMLElement);

  rerender(<Harness position={2} openers={false} />);
  expect(inspector()).not.toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByRole('region', { name: 'Explanation' }));
});

test('closing while focus is elsewhere leaves focus where it is', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Harness position={1} />);
  await user.click(screen.getByRole('button', { name: 'Open 1' }));
  screen.getByRole('region', { name: 'Explanation' }).focus();

  rerender(<Harness position={2} />);
  expect(inspector()).not.toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByRole('region', { name: 'Explanation' }));
});

// M2
test('opening another packet while one is on show keeps the first opener', async () => {
  const user = userEvent.setup();
  render(<Harness position={1} />);
  await user.click(screen.getByRole('button', { name: 'Open 1' }));
  await user.click(screen.getByRole('button', { name: 'Open 2' }));
  expect(screen.getByText('Row 2')).toBeInTheDocument();
  expect(document.activeElement).toBe(inspector());

  await user.click(screen.getByRole('button', { name: 'Close inspector' }));
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open 1' }));
});

test('an unknown packet opens nothing', async () => {
  function Unknown() {
    const explanation = useRef<HTMLElement>(null);
    const inspector = useInspector({ lesson: L, position: 1, log: [], dispatch: vi.fn(), fallbackFocus: explanation });
    return (
      <>
        <button type="button" onClick={() => inspector.openPacket('nope', 1)}>
          Open
        </button>
        <p>{inspector.open === null ? 'closed' : 'open'}</p>
      </>
    );
  }
  const user = userEvent.setup();
  render(<Unknown />);
  await user.click(screen.getByRole('button', { name: 'Open' }));
  expect(screen.getByText('closed')).toBeInTheDocument();
});
