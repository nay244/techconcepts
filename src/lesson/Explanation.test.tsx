// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { buildEntries, getEntries, getLesson, neighbors } from '../content/registry';
import type { Lesson } from '../content/schema';
import { liftedFixture, makeLesson, makeTwoUnitLesson } from '../content/test-fixtures';
import { internetTrack, networkingTrack } from '../content/tracks';
import { positionOf, slotsFor } from '../engine/timeline';
import { Explanation, type ExplanationProps } from './Explanation';
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
function show(position: number, lesson: Lesson = DHCP, onGo = vi.fn(), definitions?: ExplanationProps['definitions']) {
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
      definitions={definitions}
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

test('a lifted lesson renders the same Learn words as its terse fixture text', () => {
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

test('the Overview’s first line holds the kicker and the stamp, which links to where the facts come from; a step has no stamp there', () => {
  const { container, unmount } = show(0);
  const lead = container.querySelector('.explain__lead')!;
  expect(within(lead as HTMLElement).getByText('Overview')).toHaveClass('explain__kicker');
  expect(within(lead as HTMLElement).getByRole('link', { name: /^Not checked yet/ })).toHaveAttribute('href', '/about#facts');
  unmount();
  const step = show(1).container;
  expect(step.querySelector('.explain__lead')).toBeNull();
  expect(step.querySelector('.stamp')).toBeNull();
});

// A term's definition in Learn (prototypes/d9-glossary.md §10, checks 26 to 28, 31, 32, 34; attack cases 26 to 28, 31, 32, 34).
// The fixture lesson's Learn has three terms: Hello, Neighbor table, Retransmission.
const learnAt = () => slotsFor(DHCP).findIndex((s) => s.kind === 'learn');
const DEFS = {
  'term-1': { entryId: 'hello', entryTerm: 'Hello', text: 'A hello is the first message.', sources: ['RFC 9999', 'Example vendor'] },
  'term-3': { entryId: 'retry', entryTerm: 'Retry', label: 'In IP packets', text: 'A retry sends it again.', sources: ['RFC 9999'] },
};
const lis = () => [...document.querySelectorAll('ol.explain__terms > li')];
const nameButton = (name: string) => screen.getByRole('button', { name });

test('26: with a definition the hint stands right before the list; with none the list is today’s, no attribute, no button', () => {
  const { container } = show(learnAt(), DHCP, undefined, DEFS);
  const hint = container.querySelector('.explain__hint')!;
  expect(hint).toHaveTextContent('Press a name for its definition.');
  expect(container.querySelectorAll('.explain__hint')).toHaveLength(1);
  expect(hint.nextElementSibling).toBe(container.querySelector('ol.explain__terms'));
});
test('26: a lesson none of whose terms has an entry shows no hint, and each li holds only the idea and the name', () => {
  for (const defs of [undefined, {}]) {
    const { container, unmount } = show(learnAt(), DHCP, undefined, defs);
    expect(container.querySelector('.explain__hint')).toBeNull();
    for (const li of lis()) {
      expect(li.getAttributeNames()).toEqual([]);
      expect([...li.children].map((c) => c.className)).toEqual(['explain__idea', 'explain__term']);
      expect(li.querySelector('button')).toBeNull();
    }
    unmount();
  }
});
test('27: a term with an entry is a closed button whose definition is hidden; the others are as today, 32: no button, no data-def', () => {
  show(learnAt(), DHCP, undefined, DEFS);
  const hello = nameButton('Hello');
  expect(hello).toHaveAttribute('aria-expanded', 'false');
  const def = document.getElementById(hello.getAttribute('aria-controls')!)!;
  expect(def).toHaveAttribute('hidden');
  expect(def).not.toBeVisible();
  const [one, two, three] = lis();
  expect([one!.getAttribute('data-def'), two!.getAttribute('data-def'), three!.getAttribute('data-def')]).toEqual(['closed', null, 'closed']);
  expect(two!.querySelector('button')).toBeNull();
  expect(two!.querySelector('span.explain__term')).toHaveTextContent('Neighbor table');
  expect(two!.getAttributeNames()).toEqual([]);
});
test('28: pressing shows the definition, its sources named and not linked, and the glossary link; pressing again hides; each row is on its own', async () => {
  const user = userEvent.setup();
  show(learnAt(), DHCP, undefined, DEFS);
  const hello = nameButton('Hello');
  await user.click(hello);
  expect(hello).toHaveAttribute('aria-expanded', 'true');
  const def = document.getElementById(hello.getAttribute('aria-controls')!)!;
  expect(def).toBeVisible();
  expect(def.querySelector('.explain__def-text')).toHaveTextContent(/^A hello is the first message\.$/);
  expect(def.querySelector('.explain__def-src')).toHaveTextContent('Sources RFC 9999, Example vendor');
  expect(def.querySelector('.explain__def-src a')).toBeNull();
  expect(def.querySelector('.explain__def-sense')).toBeNull();
  const link = within(def).getByRole('link', { name: 'Hello in the glossary' });
  expect(link).toHaveAttribute('href', '/glossary#hello');
  expect(link).not.toHaveAttribute('target');
  expect(nameButton('Retransmission')).toHaveAttribute('aria-expanded', 'false');
  await user.click(nameButton('Retransmission'));
  expect(hello).toHaveAttribute('aria-expanded', 'true');
  expect(nameButton('Retransmission')).toHaveAttribute('aria-expanded', 'true');
  await user.click(hello);
  expect(hello).toHaveAttribute('aria-expanded', 'false');
  expect(def).not.toBeVisible();
  expect(nameButton('Retransmission')).toHaveAttribute('aria-expanded', 'true');
});
test('30: a sense’s label heads its definition', async () => {
  show(learnAt(), DHCP, undefined, DEFS);
  await userEvent.setup().click(nameButton('Retransmission'));
  const def = document.getElementById(nameButton('Retransmission').getAttribute('aria-controls')!)!;
  expect([...def.children].map((c) => c.className)).toEqual(['explain__def-sense', 'explain__def-text', 'explain__def-src', 'explain__def-more']);
  expect(def.querySelector('.explain__def-sense')).toHaveTextContent('In IP packets');
});
test('31: the tape keeps the lesson’s name; the link names the entry', async () => {
  show(learnAt(), DHCP, undefined, { 'term-2': { entryId: 'latency', entryTerm: 'Latency', text: 'x', sources: ['RFC 9999'] } });
  await userEvent.setup().click(nameButton('Neighbor table'));
  expect(screen.getByRole('link', { name: 'Latency in the glossary' })).toHaveAttribute('href', '/glossary#latency');
});
test('34: Enter and Space open it and focus stays on the button; closed, the glossary link is out of the tab order', async () => {
  const user = userEvent.setup();
  show(learnAt(), DHCP, undefined, DEFS);
  const hello = nameButton('Hello');
  hello.focus();
  await user.keyboard('{Enter}');
  expect(hello).toHaveAttribute('aria-expanded', 'true');
  expect(document.activeElement).toBe(hello);
  await user.tab();
  expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Hello in the glossary' }));
  await user.keyboard('{Shift>}{Tab}{/Shift}');
  await user.keyboard(' ');
  expect(hello).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('link', { name: 'Hello in the glossary' })).toBeNull();
});
test('28: what is open stays open when the reader goes to Practice and back', async () => {
  const user = userEvent.setup();
  const view = show(learnAt(), DHCP, undefined, DEFS);
  await user.click(nameButton('Hello'));
  const element = (position: number) => (
    <Explanation
      lesson={DHCP}
      position={position}
      slot={slotsFor(DHCP)[position]!}
      unit={DHCP.units[0]!}
      picked={{}}
      onPick={vi.fn()}
      next={null}
      nextFigure={null}
      number={1}
      total={1}
      trackUrl="/networking"
      stamp={{ checked: null, sources: 0 }}
      definitions={DEFS}
      onGo={vi.fn()}
    />
  );
  view.rerender(element(learnAt() + 1));
  expect(screen.queryByRole('button', { name: 'Hello' })).toBeNull();
  view.rerender(element(learnAt()));
  expect(nameButton('Hello')).toHaveAttribute('aria-expanded', 'true');
});
