// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { buildEntries, neighbors, type AvailableSummary } from '../content/registry';
import type { Lesson, SceneEvent } from '../content/schema';
import { liftedFixture, makeLesson, makeUnit } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { createPlaybackReducer, initialPlayback } from '../engine/playback';
import { buildStamp } from '../lib/build-stamp';
import LessonConsole, { LessonConsole as Console } from './LessonConsole';
import { lessonLine } from './useLessonChange';

// B44, the lesson change in place: what the console does when it is handed another lesson (E70, the three-unit fixture), the
// marks of a wait, and the host's press and fetch. The end-to-end spec (`e2e/lesson-change.spec.ts`) holds the rest.
const still = vi.hoisted(() => ({
  create: () => ({ show() {}, play: async () => {}, destroy() {} }),
  duration: vi.fn((_event: SceneEvent): number => 1000),
}));
vi.mock('../scenes/drivers', () => ({ DRIVERS: { dhcp: still, subnet: still, firewall: still, 'net-map': still } }));

const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const MAC: Lesson = liftedFixture(makeLesson({ slug: 'mac-address', title: 'MAC Address' }));
/** Three units each, as lessons 1 and 2 of How the Internet Works (net-map in the map). */
const threeUnits = (slug: string, title: string): Lesson =>
  liftedFixture(
    makeLesson({
      slug,
      title,
      units: [makeUnit('alpha', { name: 'Alpha', group: 'core' }), makeUnit('beta', { name: 'Beta', group: 'app' }), makeUnit('gamma', { name: 'Gamma', group: 'security' })],
    }),
  );
const HTTP = threeUnits('what-is-http', 'HTTP');
const HTTPS = threeUnits('what-is-https', 'HTTPS');
const TWO_NETWORKING = buildEntries(networkingTrack, { dhcp: DHCP, 'mac-address': MAC }, () => 'networking');
const TWO_TOUR = buildEntries(internetTrack, { 'what-is-http': HTTP, 'what-is-https': HTTPS }, () => 'how-the-internet-works');

function props(lesson: Lesson, entries = lesson === HTTP || lesson === HTTPS ? TWO_TOUR : TWO_NETWORKING) {
  const track = entries === TWO_TOUR ? internetTrack : networkingTrack;
  const entry = entries.find((e): e is AvailableSummary => e.available && e.slug === lesson.slug)!;
  return { trackId: track.id, trackTitle: track.title, lesson, entry, total: entries.length, next: neighbors(entries, lesson.slug).next, nextFigure: null, entries, navigate: vi.fn() };
}

const region = () => document.querySelector('[data-announce]')!.textContent;

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/networking/dhcp');
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('the reducer: "load" is an idle cursor at the Overview, and the reader\'s speed stays (decision 5, D26 section 7)', () => {
  const reduce = createPlaybackReducer(DHCP);
  const moved = reduce(reduce(initialPlayback(), { type: 'cycleSpeed' }), { type: 'go', position: 4 });
  expect(moved).toMatchObject({ position: 4, speed: 1.5 });
  expect(reduce(moved, { type: 'toggle' }).mode).toBe('run');
  expect(reduce(reduce(moved, { type: 'toggle' }), { type: 'load' })).toStrictEqual({ position: 0, eventIndex: 0, mode: 'idle', speed: 1.5 });
});

test('the lesson line: the title, the lesson\'s number of the track\'s total, and the first unit\'s Overview (D-19, E70)', () => {
  const one = props(DHCP);
  expect(lessonLine(one, 20)).toBe(`DHCP. Lesson ${one.entry.number} of 20. Overview.`);
  const many = props(HTTP);
  expect(lessonLine(many, 14)).toBe('HTTP. Lesson 1 of 14. Alpha, Overview.');
});

test('a lesson handed in is opened as a load opens it: position 0, unit 1 only ticked seen, the filter All, no picks, Explain, the line first (E70, B44-4.5, 4.4, 5.3)', async () => {
  const user = userEvent.setup();
  const first = props(HTTP);
  const { rerender } = render(<Console {...first} />);
  // Open unit 3, filter to Apps, choose the Log tab.
  await user.click(screen.getByRole('button', { name: /Gamma/ }));
  expect(document.querySelector('.outline__unit[data-state="current"]')!.textContent).toContain('Gamma');
  await user.click(screen.getByRole('button', { name: 'Apps' }));
  await user.click(screen.getByRole('button', { name: 'Log', exact: true }));
  // Another three-unit lesson of the same drawing, as the host hands it over.
  const second = props(HTTPS);
  rerender(<Console {...second} arrived={{ text: lessonLine(second, 14), id: 1 }} />);
  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  const marks = [...document.querySelectorAll('.outline__unit')].map((el) => el.getAttribute('data-state'));
  expect(marks).toStrictEqual(['current', undefined, undefined].map((m) => m ?? null));
  expect(screen.getByRole('button', { name: 'Explain', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(region()).toBe('HTTPS. Lesson 2 of 14. Alpha, Overview.');
  expect(document.querySelector('.console__explain .explain__kicker')!.textContent).toMatch(/Overview/);
  // The next move says what it does today, and the line does not come back at the Overview.
  await user.click(document.querySelector('.cbtn--go')!);
  expect(region()).not.toMatch(/Lesson 2 of 14/);
  await user.click(screen.getByRole('button', { name: 'Previous step' }));
  expect(region()).not.toMatch(/Lesson 2 of 14/);
});

test('the marks of a wait: the row going, the signal from 100 ms, the tape and "Opening" from 400 ms, all out of the accessibility tree except the words (D-2, D-3, D-7)', () => {
  const p = props(DHCP);
  const { rerender } = render(<Console {...p} wait={{ going: 'mac-address', phase: 'idle', title: 'MAC Address' }} />);
  const link = document.querySelector('a.outline__lesson[href$="mac-address"]')!;
  expect(link).toHaveAttribute('data-going', '');
  expect(link).not.toHaveAttribute('aria-current');
  expect(document.querySelector('a.outline__lesson[aria-current="page"]')!.getAttribute('href')).toBe('/networking/dhcp');
  expect(document.querySelector('.signal, .tape')).toBeNull();
  rerender(<Console {...p} wait={{ going: 'mac-address', phase: 'signal', title: 'MAC Address' }} />);
  expect(document.querySelector('.signal')).toHaveAttribute('aria-hidden', 'true');
  expect(document.querySelector('.tape')).toBeNull();
  expect(region()).not.toMatch(/Opening/);
  rerender(<Console {...p} wait={{ going: 'mac-address', phase: 'tape', title: 'MAC Address' }} />);
  expect(document.querySelector('.tape')).toHaveAttribute('aria-hidden', 'true');
  expect(document.querySelector('.tape')!.textContent).toBe('Opening MAC Address');
  expect(region()).toBe('Opening MAC Address.');
  expect(document.querySelectorAll('.console [aria-live]')).toHaveLength(1);
  rerender(<Console {...p} wait={null} />);
  expect(document.querySelector('.signal, .tape, [data-going]')).toBeNull();
});

test('the host: a plain click on a row of the same drawing fetches the lesson\'s data and shows it in place; the address moves; a stamp of another build is refused (decisions 5, 6, 8)', async () => {
  const user = userEvent.setup();
  const target = TWO_NETWORKING.find((e): e is AvailableSummary => e.available && e.slug === 'mac-address')!;
  const file = { lesson: MAC, entry: target, next: neighbors(TWO_NETWORKING, 'mac-address').next, nextFigure: null, definitions: {}, stamp: buildStamp };
  const fetchMock = vi.fn(async () => ({ status: 200, json: async () => file }));
  vi.stubGlobal('fetch', fetchMock);
  const p = props(DHCP);
  render(<LessonConsole {...p} />);
  const length = window.history.length;
  await user.click(document.querySelector('a.outline__lesson[href$="mac-address"]')!);
  await waitFor(() => expect(window.location.pathname).toBe('/networking/mac-address'));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0]![0]).toBe('/networking/mac-address.json');
  expect(window.history.length).toBe(length + 1);
  expect(document.title).toBe('MAC Address · TechConcepts');
  expect(screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent)).toContain('MAC Address');
  expect(region()).toMatch(/^MAC Address\. Lesson \d+ of 20\. Overview\.$/);
  expect(p.navigate).not.toHaveBeenCalled();
  expect(document.querySelector('a.outline__lesson[aria-current="page"]')!.getAttribute('href')).toBe('/networking/mac-address');
});

test('the host leaves a press to the browser: another drawing (Firewalls), a modified click, the current lesson and a link outside the lessons', async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  render(<LessonConsole {...props(DHCP)} />);
  const prevented: boolean[] = [];
  document.addEventListener('click', (e) => prevented.push(e.defaultPrevented));
  // jsdom does not navigate on a link click; the host must not have prevented the default for any of these.
  const mac = document.querySelector('a.outline__lesson[href$="mac-address"]')!;
  await user.keyboard('{Shift>}');
  await user.click(mac);
  await user.keyboard('{/Shift}');
  fireEvent.click(mac, { ctrlKey: true });
  fireEvent.click(mac, { metaKey: true });
  fireEvent.click(mac, { altKey: true });
  fireEvent.click(mac, { button: 1 });
  await user.click(document.querySelector('a.outline__lesson[aria-current="page"]')!);
  expect(prevented.every((p) => !p)).toBe(true);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('"Next lesson" to a lesson of another drawing calls navigate, not the host (B44-0.3, the flow test\'s Firewalls case)', async () => {
  const user = userEvent.setup();
  // DHCP (dhcp) to Firewalls (firewall in the map): the fixtures draw 'dhcp', the map is the rule.
  const entries = buildEntries(networkingTrack, { dhcp: DHCP, firewalls: liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls' })) }, () => 'networking');
  const p = props(DHCP, entries);
  vi.stubGlobal('fetch', vi.fn());
  render(<LessonConsole {...p} />);
  const forward = () => document.querySelector('.cbtn--go') as HTMLElement;
  for (let i = 0; i < 12 && !forward().textContent?.startsWith('Next lesson'); i += 1) await user.click(forward());
  await user.click(forward());
  expect(p.navigate).toHaveBeenCalledExactlyOnceWith('/networking/firewalls');
  expect(fetch).not.toHaveBeenCalled();
});
