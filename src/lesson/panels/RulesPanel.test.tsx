// @vitest-environment jsdom
// @ts-expect-error - no @types/node in this project; vitest runs under node
import { readFileSync } from 'node:fs';
import { render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import firewalls from '../../content/lessons/networking/firewalls';
import type { MessageEvent, Panel, SceneEvent } from '../../content/schema';
import { deriveState, positionOf, stepEvents } from '../../engine/timeline';
import { contrastRatio, hexToRgb } from '../../lib/contrast';
import { landedEvent, type PanelMark } from '../../scenes/driver';
import { tokens } from '../../styles/tokens';
import { RulesPanel } from './RulesPanel';

const unit = firewalls.units[0]!;
const panel = unit.scene.panel as Extract<Panel, { type: 'rules' }>;
// Read from the project root: under jsdom import.meta.url is not a file URL.
const rulesCss: string = readFileSync('src/lesson/panels/rules.css', 'utf8');

/** The derived moment at step `n` once its first `played` events have been applied (all of them when left out). */
function at(n: number, played?: number) {
  const p = positionOf(firewalls, 0, 'step', n);
  return deriveState(firewalls, p, played ?? stepEvents(firewalls, p).length);
}

function panelAt(n: number, o: { played?: number; marks?: PanelMark[]; active?: SceneEvent | null; moved?: boolean } = {}) {
  const derived = at(n, o.played);
  return <RulesPanel panel={panel} tables={derived.tables} marks={o.marks ?? []} active={o.active === undefined ? landedEvent(derived) : o.active} moved={o.moved} />;
}

const ruleRows = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('tbody tr')];
/** Each row's Check cell, as a learner reads it. */
const checks = (container: HTMLElement) => ruleRows(container).map((tr) => tr.querySelector('td:last-child')!.textContent);
const states = (container: HTMLElement) => ruleRows(container).map((tr) => tr.dataset.state ?? '');

test('RulesPanel shows the rule list with its own words, and a Check column after the lesson’s columns', () => {
  const { container } = render(panelAt(1, { played: 0 }));
  const region = screen.getByRole('region', { name: 'Rule list' });
  expect(region).toHaveAttribute('tabindex', '0');
  expect(within(region).getByText('Rule list')).toBeInTheDocument();
  expect(within(region).getByText('read from the top, first match wins')).toBeInTheDocument();
  expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['#', 'Action', 'Port', 'Source', 'For', 'Check']);
  expect(ruleRows(container).map((tr) => [...tr.querySelectorAll('td')].slice(0, 5).map((td) => td.textContent))).toEqual([
    ['1', 'ALLOW', 'TCP 443', 'Any', 'Website (HTTPS)'],
    ['2', 'ALLOW', 'TCP 22', '198.51.100.7/32', 'Admin login (SSH)'],
    ['3', 'DENY', 'Any', 'Any', 'Block everything else'],
  ]);
  // Each action keeps its colour in a mark beside its word, so the word itself can stay in ink on any row.
  expect([...container.querySelectorAll<HTMLElement>('[data-action]')].map((el) => el.dataset.action)).toEqual(['allow', 'allow', 'deny']);
  // Nothing has been read yet.
  expect(checks(container)).toEqual(['', '', '']);
  expect(states(container)).toEqual(['', '', '']);
});

test('RulesPanel shows Checking…, Doesn’t fit and Fits → deny as marks arrive, and the same marks once applied', () => {
  // Step 4: the Telnet visit reads all three rules, and the last one turns it away.
  const { container, rerender } = render(panelAt(4, { played: 0, marks: [{ row: 0, state: 'check' }] }));
  expect(checks(container)).toEqual(['Checking…', '', '']);
  expect(states(container)).toEqual(['check', '', '']);
  // The row being read is the current one.
  expect(ruleRows(container)[0]).toHaveAttribute('aria-current', 'true');

  rerender(panelAt(4, { played: 0, marks: [{ row: 0, state: 'check' }, { row: 0, state: 'miss' }, { row: 1, state: 'check' }] }));
  expect(checks(container)).toEqual(['Doesn’t fit', 'Checking…', '']);
  expect(ruleRows(container)[0]).not.toHaveAttribute('aria-current');

  const all: PanelMark[] = [
    { row: 0, state: 'check' },
    { row: 0, state: 'miss' },
    { row: 1, state: 'check' },
    { row: 1, state: 'miss' },
    { row: 2, state: 'check' },
    { row: 2, state: 'deny' },
  ];
  rerender(panelAt(4, { played: 0, marks: all }));
  expect(checks(container)).toEqual(['Doesn’t fit', 'Doesn’t fit', 'Fits → deny']);
  const playing = [checks(container), states(container)];

  // Applied: no marks any more, and the same words worked out from the visit's check.
  rerender(panelAt(4));
  expect([checks(container), states(container)]).toEqual(playing);
  expect(states(container)).toEqual(['miss', 'miss', 'deny']);
});

test('an allowed visit fits its rule, and the rules below it are never read', () => {
  const { container } = render(panelAt(3));
  expect(checks(container)).toEqual(['Doesn’t fit', 'Fits → allow', '']);
  expect(states(container)).toEqual(['miss', 'allow', '']);
});

test('while a visit plays, the rows show only its own marks, not the visit before', () => {
  // Step 6, its visit playing after the change: the change left nothing read.
  const { container } = render(panelAt(6, { played: 3, active: null, marks: [{ row: 0, state: 'check' }] }));
  expect(checks(container)).toEqual(['Checking…', '', '']);
});

test('the connections it remembers: none, then one chip per visit it let in, the newest pulsing', () => {
  const { container, rerender } = render(panelAt(1, { played: 0 }));
  const remembered = () => container.querySelector<HTMLElement>('.rpanel__conns')!;
  expect(within(remembered()).getByText('Connections it remembers')).toBeInTheDocument();
  expect(within(remembered()).getByText('None yet. Each allowed visit is remembered here.')).toBeInTheDocument();

  rerender(panelAt(1));
  const chips = () => [...remembered().querySelectorAll<HTMLElement>('.rpanel__chip')];
  expect(chips().map((c) => c.textContent)).toEqual(['Visitor → port 443 rule 1, from 203.0.113.50:50432 to 10.0.0.10:443']);
  expect(chips()[0]).toHaveAttribute('title', '203.0.113.50:50432 → 10.0.0.10:443');
  // The full addresses are for a screen reader; sighted learners have the title.
  expect(chips()[0]!.querySelector('.sr-only')).toHaveTextContent(', from 203.0.113.50:50432 to 10.0.0.10:443');
  expect(chips()[0]).toHaveAttribute('data-new');

  // The admin's login is remembered too; only the newest chip pulses.
  rerender(panelAt(3));
  expect(chips().map((c) => c.firstChild!.textContent)).toEqual(['Visitor → port 443', 'Admin → port 22']);
  expect(chips().map((c) => c.hasAttribute('data-new'))).toEqual([false, true]);
  // A step later, nothing is new.
  rerender(panelAt(4));
  expect(chips().map((c) => c.hasAttribute('data-new'))).toEqual([false, false]);
});

test('the chip a reply uses pulses, and says the reply was let through', () => {
  const { container, rerender } = render(panelAt(5, { played: 0 }));
  const chips = () => [...container.querySelectorAll<HTMLElement>('.rpanel__chip')];
  expect(chips().map((c) => c.hasAttribute('data-known'))).toEqual([false, false]);
  rerender(panelAt(5));
  expect((landedEvent(at(5)) as MessageEvent).known).toEqual({ table: 'conns', key: 'visitor:443' });
  expect(chips().map((c) => c.hasAttribute('data-known'))).toEqual([true, false]);
  expect(chips()[0]).toHaveTextContent('Known: reply allowed');
  // No rule is read for a reply.
  expect(checks(container)).toEqual(['', '', '']);
});

test('after the change the rows come in once in their new order, and no connection is remembered', () => {
  const { container, rerender } = render(panelAt(6, { played: 3, moved: true }));
  expect(ruleRows(container).map((tr) => tr.querySelector('td:nth-child(2)')!.textContent)).toEqual(['DENY', 'ALLOW', 'ALLOW']);
  expect(container.querySelector('tbody')).toHaveAttribute('data-moved');
  expect(container.querySelector('.rpanel__chip')).toBeNull();
  expect(screen.getByText('None yet. Each allowed visit is remembered here.')).toBeInTheDocument();
  // Moved is how the panel came in: the rows came in once, and a later render does not bring them in again.
  rerender(panelAt(6, { played: 3, moved: false }));
  expect(container.querySelector('tbody')).toHaveAttribute('data-moved');
  rerender(panelAt(6, { played: 4, moved: true }));
  // A panel that came in settled never moves.
  const settled = render(panelAt(6, { played: 3 }));
  expect(settled.container.querySelector('tbody')).not.toHaveAttribute('data-moved');
});

// ---------------------------------------------------------------- styling

/** What color-mix(in srgb, fg share%, transparent) paints over bg, as a hex colour. */
function mix(fg: string, bg: string, share: number): string {
  const [f, b] = [hexToRgb(fg), hexToRgb(bg)];
  const channel = (i: number) => Math.round(f[i]! * (share / 100) + b[i]! * (1 - share / 100));
  return `#${[0, 1, 2].map((i) => channel(i).toString(16).padStart(2, '0')).join('')}`;
}

/** The declarations of the first rule in rules.css whose selector is exactly `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const found = new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]*)\\}`).exec(rulesCss);
  if (found === null) throw new Error(`No rule for ${selector} in rules.css.`);
  return found[1]!;
}

test('the colours sit where the CSS puts them: words in ink, colour in tints and marks, marigold only for the row being read', () => {
  // A row's tint is its state's colour at 12% over the card, with a 3px bar of it down the left edge.
  for (const [state, token] of [['check', 'here'], ['allow', 'allowed'], ['deny', 'blocked']] as const) {
    expect(rule(`.rpanel tr[data-state='${state}']`)).toMatch(new RegExp(`--state:\\s*var\\(--${token}\\)`));
  }
  expect(rule('.rpanel tr[data-state]')).toMatch(/background:\s*color-mix\(in srgb, var\(--state\) 12%, transparent\)/);
  expect(rule('.rpanel tr[data-state]')).toMatch(/box-shadow:\s*inset 3px 0 0 var\(--state\)/);
  // The words stay in ink; a rule that was read and did not fit is muted, never faded.
  expect(rule('.rpanel__check')).toMatch(/color:\s*var\(--ink-strong\)/);
  expect(rule('.rpanel__act')).toMatch(/color:\s*var\(--ink-strong\)/);
  expect(rule(".rpanel tr[data-state='miss'] td")).toMatch(/color:\s*var\(--muted\)/);
  expect(rulesCss).not.toMatch(/opacity:\s*0?\.\d/);
  // The marks carry the colours beside the words.
  expect(rule(".rpanel__act[data-action='allow']")).toMatch(/--mark:\s*var\(--allowed\)/);
  expect(rule(".rpanel__act[data-action='deny']")).toMatch(/--mark:\s*var\(--blocked\)/);
  expect(rulesCss.match(/var\(--here\)/g)).toHaveLength(1);
  // Positioned, so the visually hidden words in it scroll with it.
  expect(rule('.rpanel')).toMatch(/position:\s*relative/);
});

test.each(['light', 'dark'] as const)('every word on the rule list reaches 4.5:1 and every mark 3:1 on what it sits on, in the %s theme', (theme) => {
  const t = tokens[theme];
  const grounds = { none: t.card, check: mix(t.here, t.card, 12), allow: mix(t.allowed, t.card, 12), deny: mix(t.blocked, t.card, 12) };
  for (const [name, ground] of Object.entries(grounds)) {
    // The rule's words, its Action and Check words, the header and a missed row's muted words.
    for (const word of ['ink', 'ink-strong', 'muted'] as const) expect(contrastRatio(t[word], ground), `${word} on ${name}`).toBeGreaterThanOrEqual(4.5);
    // The marks: the row's bar and the action's square.
    for (const mark of ['here', 'allowed', 'blocked'] as const) expect(contrastRatio(t[mark], ground), `${mark} mark on ${name}`).toBeGreaterThanOrEqual(3);
  }
  // A chip sits on the second card colour; a known chip's tint is the allowed colour at 12% over it.
  for (const ground of [t['card-2'], mix(t.allowed, t['card-2'], 12)]) {
    expect(contrastRatio(t['ink-strong'], ground)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(t.muted, ground)).toBeGreaterThanOrEqual(4.5);
  }
  expect(contrastRatio(t.allowed, t['card-2'])).toBeGreaterThanOrEqual(3);
});
