// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Profiler, useLayoutEffect, useMemo } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { buildEntries, neighbors, type AvailableSummary } from '../content/registry';
import firewalls from '../content/lessons/firewalls';
import osi from '../content/lessons/osi-model';
import subnetting from '../content/lessons/subnetting';
import type { Lesson, LogDef, SceneEvent } from '../content/schema';
import { liftedFixture, makeLesson } from '../content/test-fixtures';
import { networkingTrack } from '../content/tracks';
import type { PlaybackState } from '../engine/playback';
import { deriveState, positionOf, slotsFor, type LogRow } from '../engine/timeline';
import type { PlayOptions } from '../scenes/driver';
import { Explanation } from './Explanation';
import LessonConsole from './LessonConsole';
import { LogPanel } from './LogPanel';
import { MARKED_ROW, ScenePanel } from './ScenePanel';
import consoleSource from './LessonConsole.tsx?raw';
import sceneSource from './ScenePanel.tsx?raw';

const fake = vi.hoisted(() => {
  const driver = { show: vi.fn(), play: vi.fn(async () => {}), destroy: vi.fn() };
  return { driver, module: { create: vi.fn(() => driver), duration: vi.fn((_e: SceneEvent) => 1000) } };
});
vi.mock('../scenes/drivers', () => ({ DRIVERS: { dhcp: fake.module, subnet: fake.module, firewall: fake.module, 'net-map': fake.module } }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

// ---------------------------------------------------------------- P1 log
const LOG: LogDef = { title: 'Log', columns: [{ key: 'plain', label: 'In plain words' }], legend: [] };
const row = (n: number): LogRow => ({ n, eventId: `e${n}`, type: 'note', kind: null, outcome: null, from: null, to: null, tag: null, cells: {}, plain: `r${n}` });

test('P1 the log is at its last row in the commit that adds it', () => {
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('log__scroll') ? 100 * this.querySelectorAll('tbody tr').length : 0;
  });
  const seen: number[] = [];
  function Probe() {
    useLayoutEffect(() => {
      seen.push(document.querySelector<HTMLElement>('.log__scroll')!.scrollTop);
    });
    return null;
  }
  const fold = { open: false, onToggle() {} };
  const view = (n: number, open = false) => (
    <>
      <LogPanel log={LOG} rows={Array.from({ length: n }, (_, i) => row(i + 1))} idle="idle" fold={{ ...fold, open }} />
      <Probe />
    </>
  );
  const { rerender } = render(view(1));
  expect(seen.at(-1)).toBe(100);
  document.querySelector<HTMLElement>('.log__scroll')!.scrollTop = 0;
  rerender(view(3));
  expect(seen.at(-1)).toBe(300);
  document.querySelector<HTMLElement>('.log__scroll')!.scrollTop = 0;
  rerender(view(3, true));
  expect(seen.at(-1)).toBe(300);
});

// ---------------------------------------------------------------- P2 explanation
const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const FW: Lesson = liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls' }));
const NETWORKING = buildEntries(networkingTrack, { dhcp: DHCP, firewalls: FW }, () => 'networking');

test('P2 the explanation is at its top in the commit that changes the position', () => {
  const entry = NETWORKING.find((e): e is AvailableSummary => e.available && e.slug === 'dhcp')!;
  const seen: number[] = [];
  function Probe() {
    useLayoutEffect(() => {
      seen.push(screen.getByRole('region', { name: 'Explanation' }).scrollTop);
    });
    return null;
  }
  const view = (position: number) => {
    const slot = slotsFor(DHCP)[position]!;
    return (
      <>
        <Explanation lesson={DHCP} position={position} slot={slot} unit={DHCP.units[slot.unit]!} picked={{}} onPick={() => {}} next={neighbors(NETWORKING, 'dhcp').next} nextFigure={null} number={entry.number} total={NETWORKING.length} trackUrl="/networking" onGo={() => {}} />
        <Probe />
      </>
    );
  };
  const { rerender } = render(view(1));
  screen.getByRole('region', { name: 'Explanation' }).scrollTop = 300;
  rerender(view(2));
  expect(seen.at(-1)).toBe(0);
});

// ---------------------------------------------------------------- console helpers
function stubMedia(match: (q: string) => boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: match(q), media: q, addEventListener() {}, removeEventListener() {} }));
}
function consoleFor(lesson: Lesson) {
  const entry = NETWORKING.find((e): e is AvailableSummary => e.available && e.slug === lesson.slug)!;
  return <LessonConsole trackId="networking" trackTitle="Networking" lesson={lesson} entry={entry} total={NETWORKING.length} next={neighbors(NETWORKING, lesson.slug).next} nextFigure={null} entries={NETWORKING} navigate={() => {}} />;
}
async function wait(ms: number) {
  for (let left = ms; left > 0; left -= 50) await act(async () => void vi.advanceTimersByTime(Math.min(50, left)));
}

// ---------------------------------------------------------------- P3 table tab
test('P3 the Table tab brings the marked row into view in the commit that marks it', { timeout: 60000 }, async () => {
  vi.useFakeTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/networking/dhcp');
  stubMedia((q) => q === '(max-width: 760px)' || q.startsWith('(max-width: 760px),'));
  const into = vi.fn();
  Element.prototype.scrollIntoView = into;
  const log: { calls: number; mark: string | null }[] = [];
  const onRender = () => log.push({ calls: into.mock.calls.length, mark: document.querySelector('.tpanel [data-highlight]')?.textContent ?? null });
  render(<Profiler id="p" onRender={onRender}>{consoleFor(DHCP)}</Profiler>);
  fireEvent.click(screen.getByRole('button', { name: 'Table' }));
  fireEvent.click(document.querySelector<HTMLButtonElement>('.console__controls .cbtn--alt')!); // Play all
  await wait(12000);
  const changes = log.filter((r, i) => i > 0 && r.mark !== null && r.mark !== log[i - 1]!.mark).map((r) => ({ r, before: log[log.indexOf(r) - 1]! }));
  expect(changes.length).toBeGreaterThan(0);
  for (const { r, before } of changes) expect(r.calls, JSON.stringify({ r, before })).toBeGreaterThan(before.calls);
  // @ts-expect-error cleanup
  delete Element.prototype.scrollIntoView;
});

// ---------------------------------------------------------------- P4 guide table
/** Boxes as a browser lays them out: the panel 100 to 200, each body row 40 tall from 140, shifted by the panel's scroll. */
function stubBoxes() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const box = (top: number, h: number) => ({ top, bottom: top + h, left: 0, right: 100, width: 100, height: h, x: 0, y: top, toJSON() {} }) as DOMRect;
    if (this.matches('.tpanel, .rpanel')) return box(100, 100);
    const p = this.closest<HTMLElement>('.tpanel, .rpanel');
    const st = p?.scrollTop ?? 0;
    if (this.matches('tbody tr')) return box(240 + 40 * [...this.parentElement!.children].indexOf(this) - st, 40);
    if (this.matches('.rpanel__chip')) return box(400 - st, 30);
    return box(0, 0);
  });
}

function inside(row: Element | null): boolean | null {
  if (row === null) return null;
  const p = row.closest('.tpanel, .rpanel')!.getBoundingClientRect();
  const r = row.getBoundingClientRect();
  return r.top >= p.top && r.bottom <= p.bottom;
}
const FWP = (n: number) => positionOf(firewalls, 0, 'step', n);
function Harness({ s, home }: { s: PlaybackState; home: HTMLElement | null }) {
  const derived = useMemo(() => deriveState(firewalls, s.position, s.eventIndex), [s.position, s.eventIndex]);
  return <ScenePanel unit={firewalls.units[0]!} figure={<svg data-figure="dhcp" />} figureData={{}} derived={derived} playback={s} reducedMotion={false} panelHome={home} />;
}

test('P4a the guide table brings the deciding rule into view in the commit of the mark (Firewalls step 2)', () => {
  stubBoxes();
  const home = document.body.appendChild(document.createElement('div'));
  const log: { st: number; deny: boolean; inside: boolean | null }[] = [];
  const onRender = () => {
    const p = home.querySelector<HTMLElement>('.rpanel');
    const deny = home.querySelector('.rpanel [data-state="deny"]');
    log.push({ st: p?.scrollTop ?? -1, deny: deny !== null, inside: inside(deny) });
  };
  render(<Profiler id="p" onRender={onRender}><Harness s={{ position: FWP(2), eventIndex: 0, mode: 'step', speed: 1 }} home={home} /></Profiler>);
  const { onMark } = (fake.driver.play.mock.calls.at(-1) as unknown as [unknown, unknown, PlayOptions])[2];
  act(() => onMark!({ row: 0, state: 'check' }));
  act(() => onMark!({ row: 0, state: 'miss' }));
  act(() => onMark!({ row: 1, state: 'check' }));
  act(() => onMark!({ row: 1, state: 'miss' }));
  act(() => onMark!({ row: 2, state: 'check' }));
  act(() => onMark!({ row: 2, state: 'deny' }));
  const first = log.find((r) => r.deny)!;
  expect(first, JSON.stringify(log)).toMatchObject({ inside: true });
});

test('P4b the guide table brings the marked row into view in the commit of a timer tick (console, 1100 x 890)', { timeout: 60000 }, async () => {
  vi.useFakeTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/networking/dhcp');
  stubBoxes();
  stubMedia((q) => q === '(min-width: 1100px) and (min-height: 890px)');
  const log: { st: number; mark: string | null; inside: boolean | null }[] = [];
  const onRender = () => {
    const p = document.querySelector<HTMLElement>('.guide__table .tpanel');
    const marked = document.querySelector<HTMLElement>('.guide__table .tpanel [data-highlight]');
    log.push({ st: p?.scrollTop ?? -1, mark: marked?.textContent ?? null, inside: inside(marked) });
  };
  render(<Profiler id="p" onRender={onRender}>{consoleFor(DHCP)}</Profiler>);
  expect(document.querySelector('.guide__table .tpanel')).not.toBeNull();
  fireEvent.click(document.querySelector<HTMLButtonElement>('.console__controls .cbtn--alt')!);
  await wait(12000);
  const firsts = log.filter((r, i) => i > 0 && r.mark !== null && r.mark !== log[i - 1]!.mark);
  expect(firsts.length).toBeGreaterThan(0);
  for (const r of firsts) expect(r.inside, JSON.stringify(firsts)).toBe(true);
});

// ---------------------------------------------------------------- extra attack cases
test('X1 under the scene (no panelHome) nothing scrolls', () => {
  stubBoxes();
  const into = vi.fn();
  Element.prototype.scrollIntoView = into;
  const { container } = render(<Harness s={{ position: FWP(2), eventIndex: 0, mode: 'step', speed: 1 }} home={null} />);
  const { onMark } = (fake.driver.play.mock.calls.at(-1) as unknown as [unknown, unknown, PlayOptions])[2];
  act(() => onMark!({ row: 2, state: 'deny' }));
  expect(container.querySelector('.rpanel [data-state="deny"]')).not.toBeNull();
  expect(container.querySelector<HTMLElement>('.rpanel')!.scrollTop).toBe(0);
  expect(into).not.toHaveBeenCalled();
  // @ts-expect-error cleanup
  delete Element.prototype.scrollIntoView;
});

test('C9 the known chip at step 5, once the event has landed, is brought into the box', () => {
  stubBoxes();
  const home = document.body.appendChild(document.createElement('div'));
  // Step 5: the reply is known, the chip is marked once the event has landed.
  const p5 = FWP(5);
  const { rerender } = render(<Harness s={{ position: p5, eventIndex: 0, mode: 'step', speed: 1 }} home={home} />);
  rerender(<Harness s={{ position: p5, eventIndex: 99, mode: 'step', speed: 1 }} home={home} />);
  const chip = home.querySelector('.rpanel__chip[data-known]');
  expect(chip === null ? null : inside(chip)).toBe(true);
});

test('X3 the explanation keeps the reader’s scroll at the same position (an event, a pick)', () => {
  const entry = NETWORKING.find((e): e is AvailableSummary => e.available && e.slug === 'dhcp')!;
  const view = (position: number, picked = {}) => {
    const slot = slotsFor(DHCP)[position]!;
    return <Explanation lesson={DHCP} position={position} slot={slot} unit={DHCP.units[slot.unit]!} picked={picked} onPick={() => {}} next={null} nextFigure={null} number={entry.number} total={NETWORKING.length} trackUrl="/networking" onGo={() => {}} />;
  };
  const { rerender } = render(view(2));
  screen.getByRole('region', { name: 'Explanation' }).scrollTop = 300;
  rerender(view(2, {}));
  expect(screen.getByRole('region', { name: 'Explanation' }).scrollTop).toBe(300);
});

test('X4 the log keeps the reader’s scroll when the rows do not change (fresh, idle)', () => {
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(500);
  const rows = [row(1), row(2)];
  const { rerender } = render(<LogPanel log={LOG} rows={rows} idle="a" fresh={null} />);
  document.querySelector<HTMLElement>('.log__scroll')!.scrollTop = 0;
  rerender(<LogPanel log={LOG} rows={[...rows]} idle="b" fresh="e2" />);
  expect(document.querySelector<HTMLElement>('.log__scroll')!.scrollTop).toBe(0);
});

// ---------------------------------------------------------------- the rest of the attack cases (C2, C5, C10-C14, C16, C18, C21)
function rowsOf(n: number) {
  return Array.from({ length: n }, (_, i) => row(i + 1));
}
const home = () => document.body.appendChild(document.createElement('div'));
const deny = (h: HTMLElement) => h.querySelector<HTMLElement>('.rpanel [data-state="deny"]');
function fireMarks(marks: { row: number; state: string }[]) {
  const { onMark } = (fake.driver.play.mock.calls.at(-1) as unknown as [unknown, unknown, PlayOptions])[2];
  for (const m of marks) act(() => onMark!(m as never));
}
const ALLOW_DENY = [{ row: 2, state: 'deny' }];

test('C2 the log is at its bottom in the commit where only the fold opens', () => {
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('log__scroll') ? 100 * this.querySelectorAll('tbody tr').length : 0;
  });
  const seen: number[] = [];
  function Probe() {
    useLayoutEffect(() => {
      seen.push(document.querySelector<HTMLElement>('.log__scroll')!.scrollTop);
    });
    return null;
  }
  const view = (open: boolean) => (
    <>
      <LogPanel log={LOG} rows={rowsOf(3)} idle="idle" fold={{ open, onToggle() {} }} />
      <Probe />
    </>
  );
  const { rerender } = render(view(false));
  document.querySelector<HTMLElement>('.log__scroll')!.scrollTop = 0;
  rerender(view(true));
  expect(seen.at(-1)).toBe(300);
});

test('C18 the log is at its bottom in the commit where the row count drops (a step back)', () => {
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('log__scroll') ? 100 * this.querySelectorAll('tbody tr').length : 0;
  });
  const seen: number[] = [];
  function Probe() {
    useLayoutEffect(() => {
      seen.push(document.querySelector<HTMLElement>('.log__scroll')!.scrollTop);
    });
    return null;
  }
  const view = (n: number) => (
    <>
      <LogPanel log={LOG} rows={rowsOf(n)} idle="idle" />
      <Probe />
    </>
  );
  const { rerender } = render(view(3));
  document.querySelector<HTMLElement>('.log__scroll')!.scrollTop = 0;
  rerender(view(1));
  expect(seen.at(-1)).toBe(100);
});

test('C5 the Table tab scrolls the marked row itself, in the commit that marks it', { timeout: 60000 }, async () => {
  vi.useFakeTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/networking/dhcp');
  stubMedia((q) => q === '(max-width: 760px)' || q.startsWith('(max-width: 760px),'));
  const into = vi.fn();
  Element.prototype.scrollIntoView = into;
  let ok = 0;
  let prior = 0;
  const onRender = () => {
    const marked = document.querySelector('.tpanel [data-highlight]');
    if (marked !== null && into.mock.calls.length > prior) {
      prior = into.mock.calls.length;
      if (into.mock.contexts.at(-1) === marked) ok += 1;
    }
  };
  render(<Profiler id="p" onRender={onRender}>{consoleFor(DHCP)}</Profiler>);
  fireEvent.click(screen.getByRole('button', { name: 'Table' }));
  fireEvent.click(document.querySelector<HTMLButtonElement>('.console__controls .cbtn--alt')!);
  await wait(12000);
  expect(into).toHaveBeenCalled();
  expect(ok).toBeGreaterThan(0);
  // @ts-expect-error cleanup
  delete Element.prototype.scrollIntoView;
});

test('C21 the Table tab does not scroll while the Explain tab is shown', { timeout: 60000 }, async () => {
  vi.useFakeTimers();
  window.localStorage.clear();
  window.history.replaceState({}, '', '/networking/dhcp');
  stubMedia((q) => q === '(max-width: 760px)' || q.startsWith('(max-width: 760px),'));
  const into = vi.fn();
  Element.prototype.scrollIntoView = into;
  render(consoleFor(DHCP));
  fireEvent.click(document.querySelector<HTMLButtonElement>('.console__controls .cbtn--alt')!);
  await wait(12000);
  expect(into).not.toHaveBeenCalled();
  // @ts-expect-error cleanup
  delete Element.prototype.scrollIntoView;
});

test('C10 a row above the box is brought to 4px under its top', () => {
  stubBoxes();
  const h = home();
  render(<Harness s={{ position: FWP(2), eventIndex: 0, mode: 'step', speed: 1 }} home={h} />);
  h.querySelector<HTMLElement>('.rpanel')!.scrollTop = 300;
  fireMarks(ALLOW_DENY);
  const r = deny(h)!;
  expect(r.getBoundingClientRect().top - h.querySelector('.rpanel')!.getBoundingClientRect().top).toBe(4);
});

test('C11 a row already inside does not creep, render after render', () => {
  stubBoxes();
  const h = home();
  const s: PlaybackState = { position: FWP(2), eventIndex: 0, mode: 'step', speed: 1 };
  const { rerender } = render(<Harness s={s} home={h} />);
  h.querySelector<HTMLElement>('.rpanel')!.scrollTop = 200;
  fireMarks(ALLOW_DENY);
  expect(inside(deny(h))).toBe(true);
  expect(h.querySelector<HTMLElement>('.rpanel')!.scrollTop).toBe(200);
  const before = h.querySelector<HTMLElement>('.rpanel')!.scrollTop;
  for (let i = 0; i < 3; i++) rerender(<Harness s={s} home={h} />);
  expect(h.querySelector<HTMLElement>('.rpanel')!.scrollTop).toBe(before);
});

test('C12 only the panel box moves: the guide, the window and scrollIntoView are untouched', () => {
  stubBoxes();
  const into = vi.fn();
  Element.prototype.scrollIntoView = into;
  const guide = document.body.appendChild(document.createElement('div'));
  guide.className = 'console__guide';
  guide.scrollTop = 50;
  const h = guide.appendChild(document.createElement('div'));
  const y = window.scrollY;
  render(<Harness s={{ position: FWP(2), eventIndex: 0, mode: 'step', speed: 1 }} home={h} />);
  fireMarks(ALLOW_DENY);
  expect(h.querySelector<HTMLElement>('.rpanel')!.scrollTop).toBeGreaterThan(0);
  expect(guide.scrollTop).toBe(50);
  expect(window.scrollY).toBe(y);
  expect(into).not.toHaveBeenCalled();
  // @ts-expect-error cleanup
  delete Element.prototype.scrollIntoView;
});

test('C13 labels and bits panels in the guide: no row, nothing scrolls, nothing throws', () => {
  stubBoxes();
  for (const slug of ['osi-model', 'subnetting'] as const) {
    const lesson = slug === 'osi-model' ? osi : subnetting;
    const unit = lesson.units.find((u) => u.scene.panel?.type === (slug === 'osi-model' ? 'labels' : 'bits'))!;
    const index = lesson.units.indexOf(unit);
    const h = home();
    const s: PlaybackState = { position: positionOf(lesson, index, 'step', 1), eventIndex: 0, mode: 'step', speed: 1 };
    const derived = deriveState(lesson, s.position, s.eventIndex);
    const { container, unmount } = render(<ScenePanel unit={unit} figure={<svg />} figureData={{}} derived={derived} playback={s} reducedMotion={false} panelHome={h} />);
    expect(container.querySelector(MARKED_ROW)).toBeNull();
    expect(h.querySelector<HTMLElement>('.tpanel, .rpanel')?.scrollTop ?? 0).toBe(0);
    unmount();
  }
});

test('C14 a rule being read (check) out of view does not scroll; the selector is kept', () => {
  stubBoxes();
  const h = home();
  render(<Harness s={{ position: FWP(2), eventIndex: 0, mode: 'step', speed: 1 }} home={h} />);
  fireMarks([{ row: 2, state: 'check' }]);
  expect(h.querySelector('.rpanel [data-state="check"]')).not.toBeNull();
  expect(h.querySelector<HTMLElement>('.rpanel')!.scrollTop).toBe(0);
});

test('C16 MARKED_ROW is defined once, in ScenePanel, which does not import LessonConsole', () => {
  expect(MARKED_ROW).toContain('[data-highlight]');
  expect(consoleSource).not.toMatch(/const MARKED_ROW/);
  expect(consoleSource).not.toMatch(/getBoundingClientRect/);
  expect(sceneSource).not.toMatch(/from '\.\/LessonConsole'/);
});
