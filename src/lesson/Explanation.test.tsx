// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { buildEntries, getEntries, getLesson, neighbors } from '../content/registry';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { positionOf, slotsFor } from '../engine/timeline';
import { Explanation } from './Explanation';
import { Rich } from './Rich';

const DHCP: Lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
const FIREWALLS: Lesson = liftedFixture(makeLesson({ slug: 'firewalls', title: 'Firewalls' }));
// No ready lesson has many units since the split, so a two-unit fixture stands in as HTTP, lesson 1 of How the
// Internet Works, with HTTPS after it.
const TWO: Lesson = liftedFixture(makeTwoUnitLesson({ slug: 'what-is-http', title: 'HTTP' }));
const HTTPS: Lesson = liftedFixture(makeLesson({ slug: 'what-is-https', title: 'HTTPS' }));
const TLS: Lesson = liftedFixture(makeLesson({ slug: 'what-is-tls', title: 'TLS/SSL' }));
const NETWORKING = buildEntries(networkingTrack, { dhcp: DHCP, firewalls: FIREWALLS }, () => 'networking');
const TOUR = buildEntries(internetTrack, { 'what-is-http': TWO, 'what-is-https': HTTPS, 'what-is-tls': TLS }, () => 'how-the-internet-works');

/** Shows a lesson as its own track's page does: numbered among, and leading on to, that track's lessons. */
function show(position: number, lesson: Lesson = DHCP, onGo = vi.fn()) {
  const tour = TOUR.some((e) => e.slug === lesson.slug);
  const entries = tour ? TOUR : NETWORKING;
  const entry = entries.find((e) => e.slug === lesson.slug)!;
  const slot = slotsFor(lesson)[position]!;
  return render(
    <Explanation
      lesson={lesson}
      position={position}
      slot={slot}
      unit={lesson.units[slot.unit]!}
      picked={{}}
      onPick={vi.fn()}
      next={neighbors(entries, lesson.slug).next}
      nextFigure={neighbors(entries, lesson.slug).next === null ? null : '<svg class="stub-figure" viewBox="0 0 4 3"></svg>'}
      number={entry.number}
      total={entries.length}
      trackUrl={tour ? '/how-the-internet-works' : '/networking'}
      stamp={{ checked: null, sources: lesson.units[slot.unit]!.references.length }}
      onGo={onGo}
    />,
  );
}

const deeper = () => screen.getByText('Go deeper').closest('details')!;

test('Rich renders **x** as bold and never as HTML', () => {
  const { container } = render(<Rich text={'A **hello** to <img src=x onerror=alert(1)> & **the router**, and a stray ** too'} />);
  expect([...container.querySelectorAll('b')].map((b) => b.textContent)).toEqual(['hello', 'the router']);
  expect(container.querySelector('img')).toBeNull();
  expect(container).toHaveTextContent('A hello to <img src=x onerror=alert(1)> & the router, and a stray ** too');
});

test('the Overview shows the kicker, name, full name, hook, description and facts', () => {
  show(0);
  expect(screen.getByText('Overview')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Neighbor table' })).toBeInTheDocument();
  expect(screen.getByText('Neighbor table (a demonstration)')).toBeInTheDocument();
  expect(screen.getByText(/^Think of a front desk/)).toBeInTheDocument();
  expect(screen.getByText(/^A router keeps a short list/)).toBeInTheDocument();
  expect(screen.getByText('Example address')).toBeInTheDocument();
  expect(screen.queryByText('Go deeper')).toBeNull();
});

test('Go deeper is closed by default on steps and Learn', async () => {
  const { unmount } = show(1);
  expect(screen.getByText('Watch · Step 1 of 5')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Neighbor Hello' })).toBeInTheDocument();
  expect(screen.getByText('The laptop speaks first')).toBeInTheDocument();
  // The narrative's **hello** is bold.
  expect(screen.getByText('hello', { selector: 'b' })).toBeInTheDocument();
  expect(deeper()).not.toHaveAttribute('open');
  expect(within(deeper()).getByText('the technical details')).toBeInTheDocument();
  expect(within(deeper()).getByText(/^A real neighbor protocol/)).toBeInTheDocument();
  expect(within(deeper()).getByText('34 bytes')).toBeInTheDocument();
  await userEvent.click(screen.getByText('Go deeper'));
  expect(deeper()).toHaveAttribute('open');
  unmount();

  show(6);
  expect(screen.getByRole('heading', { level: 2, name: 'What happened and why' })).toBeInTheDocument();
  expect(deeper()).not.toHaveAttribute('open');
});

test('Learn ends with its sources, in view without opening Go deeper; a lesson that cites nothing yet says it is not checked', () => {
  show(6);
  const foot = screen.getByRole('heading', { level: 3, name: 'Sources' }).parentElement!;
  expect(deeper().contains(foot)).toBe(false);
  // Not checked yet: said where a checked lesson says when, and the list has no numbers for claims to point at.
  expect(within(foot).getByRole('link', { name: 'Not checked yet' })).toHaveAttribute('href', '/about#facts');
  const list = within(foot).getByRole('list');
  expect(list.tagName).toBe('UL');
  const sources = within(list).getAllByRole('link');
  expect(sources.at(-1)).toHaveAccessibleName(/^RFC 826: An Ethernet Address Resolution Protocol/);
  expect(sources.at(-1)).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc826');
  expect(sources.at(-1)).toHaveAttribute('target', '_blank');
  expect(screen.queryByRole('link', { name: /^Source \d/ })).toBeNull();
});

test('a cited lesson numbers its sources, and each claim in Learn links the exact places it rests on', () => {
  const osi = getLesson('osi-model')!;
  const unit = osi.units[0]!;
  const entries = getEntries('networking');
  const entry = entries.find((e) => e.slug === 'osi-model')!;
  const learn = positionOf(osi, 0, 'learn');
  render(
    <Explanation
      lesson={osi}
      position={learn}
      slot={slotsFor(osi)[learn]!}
      unit={unit}
      picked={{}}
      onPick={vi.fn()}
      next={null}
      nextFigure={null}
      number={entry.number}
      total={entries.length}
      trackUrl="/networking"
      stamp={{ checked: '2026-11-08', sources: unit.references.length }}
      onGo={vi.fn()}
    />,
  );
  const foot = screen.getByRole('heading', { level: 3, name: 'Sources' }).parentElement!;
  expect(within(foot).getByRole('link', { name: 'Checked 8 Nov 2026' })).toHaveAttribute('href', '/about#facts');
  const list = within(foot).getByRole('list');
  expect(list.tagName).toBe('OL');
  const listed = within(list).getAllByRole('link');
  expect(listed).toHaveLength(unit.references.length);
  // Source 1 is the first one Learn cites: the standard that defines the model.
  expect(listed[0]).toHaveAccessibleName(/^ITU-T X\.200: /);

  // The first statement rests on one place in it, and its number opens exactly that place.
  const first = unit.learn.lead[0]!.cite[0]!;
  const marks = screen.getAllByRole('link', { name: /^Source \d/ });
  expect(marks[0]).toHaveTextContent(/^1$/);
  expect(marks[0]).toHaveAccessibleName(`Source 1: ${first.label} (opens in a new tab)`);
  expect(marks[0]).toHaveAttribute('href', first.url);
  expect(marks[0]).toHaveAttribute('target', '_blank');
  // No mark points at a number the list does not have.
  for (const mark of marks) expect(Number(mark.textContent)).toBeLessThanOrEqual(listed.length);
  // An analogy cites nothing, so nothing follows it; every other part of Learn carries at least one number.
  const cited = [...unit.learn.lead, ...unit.learn.terms, unit.learn.pattern, ...unit.learn.why, ...unit.learn.deep, ...unit.learn.facts];
  expect(marks.length).toBeGreaterThanOrEqual(cited.filter((part) => part.cite.length > 0).length);
});

test('Learn shows the lead, the idea → name pairs and the pattern box', () => {
  show(6);
  expect(screen.getByText('In plain words, then the names')).toBeInTheDocument();
  const terms = screen.getByRole('list', { name: 'Terms' });
  const first = within(terms).getAllByRole('listitem')[0]!;
  expect(first).toHaveTextContent('Saying who you are');
  expect(within(first).getByText('Hello')).toBeInTheDocument();
  const pattern = screen.getByText('Say hello, get an answer, then look it up next time.').closest('div')!;
  expect(within(pattern).getByText('Neighbor Hello')).toBeInTheDocument();
  expect(within(pattern).getByText('Table Lookup')).toBeInTheDocument();
});

/** The `<p>` whose words, bold marks aside, are exactly `text`. */
const paragraph = (text: string): HTMLElement => screen.getByText((_, el) => el?.tagName === 'P' && el.textContent === text);

test('Learn joins its statements into one paragraph; Go deeper gives each paragraph its own', () => {
  const lesson = liftedFixture(makeLesson({ slug: 'dhcp', title: 'DHCP' }));
  const { learn, steps } = lesson.units[0]!;
  learn.lead = [
    { id: 'lead-1', text: 'A **router** keeps a list.', cite: [] },
    { id: 'lead-2', text: 'It asks only once.', cite: [] },
  ];
  learn.why = [
    { id: 'why-1', text: 'Helpdesk staff read it.', cite: [] },
    { id: 'why-2', text: 'So do **you**.', cite: [] },
  ];
  learn.deep = [
    { id: 'deep-1', text: 'Learn, first paragraph.', cite: [] },
    { id: 'deep-2', text: 'Learn, second paragraph.', cite: [] },
  ];
  steps[0]!.deep = [
    { text: 'Step, first paragraph.', cite: [] },
    { text: 'Step, second **paragraph**.', cite: [] },
  ];

  const { unmount } = show(6, lesson);
  const lead = paragraph('A router keeps a list. It asks only once.');
  expect(within(lead).getByText('router', { selector: 'b' })).toBeInTheDocument();
  expect(within(paragraph('Helpdesk staff read it. So do you.')).getByText('you', { selector: 'b' })).toBeInTheDocument();
  const learnDeep = [paragraph('Learn, first paragraph.'), paragraph('Learn, second paragraph.')];
  for (const p of learnDeep) expect(deeper()).toContainElement(p);
  expect(learnDeep[0]).not.toBe(learnDeep[1]);
  unmount();

  show(1, lesson);
  const stepDeep = [paragraph('Step, first paragraph.'), paragraph('Step, second paragraph.')];
  for (const p of stepDeep) expect(deeper()).toContainElement(p);
  expect(within(stepDeep[1]!).getByText('paragraph', { selector: 'b' })).toBeInTheDocument();
});

test('a lifted lesson renders the same Learn words as its legacy text', () => {
  const input = makeLesson({ slug: 'dhcp', title: 'DHCP' });
  const lesson = liftedFixture(input);
  const plain = (text: string) => text.replaceAll('**', '');
  const { learn, steps } = input.units[0]!;

  const { unmount } = show(6, lesson);
  for (const text of [learn.lead, learn.why]) expect(paragraph(plain(text))).toHaveClass('explain__narr');
  expect(deeper()).toContainElement(paragraph(plain(learn.deep)));
  unmount();

  show(1, lesson);
  expect(deeper()).toContainElement(paragraph(plain(steps[0]!.deep)));
});

test('the end row names the next ready lesson, or says the last ready one for now', () => {
  const { unmount } = show(7);
  expect(screen.getByText('That’s the whole lesson.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^Up next Firewalls/ })).toHaveAttribute('href', '/networking/firewalls');
  unmount();

  show(7, FIREWALLS);
  expect(screen.getByText(/last ready one/)).toHaveTextContent(
    'That’s the whole lesson, and the last ready one for now. Lessons 17 to 19 are coming soon.',
  );
  expect(screen.getByRole('link', { name: 'Back to the track' })).toHaveAttribute('href', '/networking');
});

test('the end row of a track’s last lesson says the track ends there, not that more is coming', () => {
  show(7, TLS);
  expect(screen.getByText(/whole lesson/)).toHaveTextContent('That’s the whole lesson, and the last lesson of this track.');
  expect(screen.queryByText(/for now|coming soon/)).toBeNull();
  expect(screen.getByRole('link', { name: 'Back to the track' })).toHaveAttribute('href', '/how-the-internet-works');
});

test('in a lesson of many units, a unit’s end row leads to the next unit', async () => {
  const onGo = vi.fn();
  const { unmount } = show(7, TWO, onGo);
  expect(screen.getByText('Alpha · Practice')).toBeInTheDocument();
  expect(screen.getByText(/^Next:/)).toHaveTextContent('Next: Beta, how a router remembers who it has heard from.');
  await userEvent.click(screen.getByRole('button', { name: 'Go to Beta' }));
  expect(onGo).toHaveBeenCalledWith(8);
  unmount();

  // The last unit's end row is the lesson's.
  show(15, TWO);
  expect(screen.getByText('Beta · Practice')).toBeInTheDocument();
  expect(screen.getByText('That’s the whole lesson.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^Up next HTTPS/ })).toHaveAttribute('href', '/how-the-internet-works/what-is-https');
});

test('the Up next card shows the next lesson’s number and subtitle, and its art is decorative', () => {
  const { container } = show(7);
  const card = screen.getByRole('link', { name: /^Up next Firewalls/ });
  expect(card).toHaveClass('upnext', 'lift');
  const next = neighbors(NETWORKING, 'dhcp').next!;
  expect(card).toHaveTextContent(`Lesson ${String(next.number).padStart(2, '0')} · ${next.subtitle}`);
  expect(card.querySelector('.upnext__art')).toHaveAttribute('aria-hidden', 'true');
  expect(container.querySelector('.upnext__art .stub-figure')).not.toBeNull();
});

test('kickers name the unit in a lesson of many units', () => {
  const { unmount } = show(9, TWO);
  expect(screen.getByText('Beta · Step 1 of 5')).toBeInTheDocument();
  unmount();
  show(8, TWO);
  expect(screen.getByText('Beta · Overview')).toBeInTheDocument();
});
