// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { validateLesson } from '../content/define';
import type { AvailableSummary } from '../content/registry';
import type { FlowScene, Lesson } from '../content/schema';
import { fixtureLesson } from '../content/test-fixtures';
import { initialPlayback, type PlaybackState } from '../engine/playback';
import { deriveState, sectionsFor } from '../engine/timeline';
import { contrastRatio } from '../lib/contrast';
import { wrapAtDots } from '../lib/wrapAtDots';
import { tokens } from '../styles/tokens';
import CheckYourself from './CheckYourself';
import EventLog from './EventLog';
import ExplanationPanel from './ExplanationPanel';
import PlaybackControls from './PlaybackControls';
import RecapPanel from './RecapPanel';
import TryItPanel from './TryItPanel';

const L: Lesson = validateLesson(fixtureLesson()).lesson;
const scene = L.scene as FlowScene;
const sections = sectionsFor(L.steps.length);
const noop = () => undefined;

afterEach(() => {
  vi.restoreAllMocks();
});

// ------------------------------------------------------------ CheckYourself

test('CheckYourself: a wrong answer says "Not quite." and then explains', async () => {
  const user = userEvent.setup();
  render(<CheckYourself questions={L.check} />);
  await user.click(screen.getByRole('radio', { name: 'Nothing at all' }));
  expect(screen.getByText('Not quite.')).toBeInTheDocument();
  expect(screen.getByText(/The table holds one row per neighbor/)).toBeInTheDocument();
  expect(screen.queryByText('Correct.')).not.toBeInTheDocument();
});

test('CheckYourself: the right answer says "Correct." and then explains', async () => {
  const user = userEvent.setup();
  render(<CheckYourself questions={L.check} />);
  await user.click(screen.getByRole('radio', { name: 'A row for each neighbor it has heard from' }));
  expect(screen.getByText('Correct.')).toBeInTheDocument();
  expect(screen.getByText(/The table holds one row per neighbor/)).toBeInTheDocument();
  expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();
});

test('CheckYourself: stores nothing anywhere', async () => {
  const user = userEvent.setup();
  const setItem = vi.spyOn(Storage.prototype, 'setItem');
  render(<CheckYourself questions={L.check} />);
  await user.click(screen.getByRole('radio', { name: 'Nothing at all' }));
  await user.click(screen.getByRole('radio', { name: 'A row for each neighbor it has heard from' }));
  await user.click(screen.getByRole('radio', { name: 'It makes messages larger' }));
  expect(setItem).not.toHaveBeenCalled();
  expect(window.localStorage.length).toBe(0);
  expect(window.sessionStorage.length).toBe(0);
});

test('CheckYourself: every question is a labelled radio group', () => {
  render(<CheckYourself questions={L.check} />);
  const groups = screen.getAllByRole('radiogroup');
  expect(groups).toHaveLength(2);
  expect(screen.getByRole('radiogroup', { name: 'What does the server store in its neighbor table?' })).toBeInTheDocument();
  expect(within(groups[0]!).getAllByRole('radio')).toHaveLength(3);
  expect(within(groups[1]!).getAllByRole('radio')).toHaveLength(2);
});

test('CheckYourself: shows nothing until an answer is chosen', () => {
  render(<CheckYourself questions={L.check} />);
  expect(screen.queryByText('Correct.')).not.toBeInTheDocument();
  expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();
  expect(screen.queryAllByRole('radio', { checked: true })).toHaveLength(0);
});

test('CheckYourself: an answer can be changed', async () => {
  const user = userEvent.setup();
  render(<CheckYourself questions={L.check} />);
  await user.click(screen.getByRole('radio', { name: 'Nothing at all' }));
  expect(screen.getByText('Not quite.')).toBeInTheDocument();
  await user.click(screen.getByRole('radio', { name: 'A row for each neighbor it has heard from' }));
  expect(screen.getByText('Correct.')).toBeInTheDocument();
  expect(screen.queryByText('Not quite.')).not.toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'A row for each neighbor it has heard from' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Nothing at all' })).not.toBeChecked();
});

test('CheckYourself: questions are answered independently', async () => {
  const user = userEvent.setup();
  render(<CheckYourself questions={L.check} />);
  await user.click(screen.getByRole('radio', { name: 'It avoids asking the same question twice' }));
  expect(screen.getAllByText(/Correct\.|Not quite\./)).toHaveLength(1);
  expect(screen.getByText(/A known neighbor can be found at once/)).toBeInTheDocument();
  expect(screen.queryByText(/The table holds one row per neighbor/)).not.toBeInTheDocument();
});

test('CheckYourself: keeps score of nothing and says nothing about scoring', async () => {
  const user = userEvent.setup();
  const { container } = render(<CheckYourself questions={L.check} />);
  await user.click(screen.getByRole('radio', { name: 'Nothing at all' }));
  await user.click(screen.getByRole('radio', { name: 'It avoids asking the same question twice' }));
  expect(container).not.toHaveTextContent(/score|points|\d+ (of|out of) \d+|correct answers/i);
});

test('CheckYourself: feedback sits in a polite live region so it is announced', async () => {
  const user = userEvent.setup();
  const { container } = render(<CheckYourself questions={L.check} />);
  const regions = container.querySelectorAll('[aria-live="polite"]');
  expect(regions).toHaveLength(2);
  await user.click(screen.getByRole('radio', { name: 'Nothing at all' }));
  expect(regions[0]).toHaveTextContent('Not quite.');
  expect(regions[1]).toBeEmptyDOMElement();
});

// ------------------------------------------------------------ EventLog

const renderLog = (position: number, eventIndex: number, props: Partial<Parameters<typeof EventLog>[0]> = {}) =>
  render(
    <EventLog
      state={deriveState(L, position, eventIndex, null)}
      showTableColumn={false}
      legend={scene.legend}
      onOpenPacket={noop}
      {...props}
    />,
  );

test('EventLog: says what to do when nothing has happened yet', () => {
  renderLog(0, 0);
  expect(screen.getByText('Nothing has happened yet. Press Play to start.')).toBeInTheDocument();
});

test('EventLog: the empty message goes once rows appear', () => {
  renderLog(1, 1);
  expect(screen.queryByText('Nothing has happened yet. Press Play to start.')).not.toBeInTheDocument();
});

test('EventLog: is a real data table captioned "Event log"', () => {
  renderLog(1, 1);
  const table = screen.getByRole('table', { name: 'Event log' });
  expect(table).toHaveClass('data');
  const caption = table.querySelector('caption');
  expect(caption).toHaveTextContent('Event log');
  expect(caption).toHaveClass('sr-only');
});

test('EventLog: the columns are #, Time, Source, Destination, Protocol, Kind, Summary and Size', () => {
  renderLog(1, 1);
  const headers = screen.getAllByRole('columnheader');
  expect(headers.map((h) => h.textContent)).toEqual(['#', 'Time', 'Source', 'Destination', 'Protocol', 'Kind', 'Summary', 'Size']);
  expect(headers.every((h) => h.getAttribute('scope') === 'col')).toBe(true);
});

test('EventLog: the Table change header appears only when asked for', () => {
  const { unmount } = renderLog(2, 3);
  expect(screen.queryByRole('columnheader', { name: 'Table change' })).not.toBeInTheDocument();
  unmount();
  renderLog(2, 3, { showTableColumn: true });
  expect(screen.getByRole('columnheader', { name: 'Table change' })).toBeInTheDocument();
});

test('EventLog: a message that changed a table says so in the Table change column', () => {
  renderLog(2, 3, { showTableColumn: true });
  const rows = screen.getAllByRole('row').slice(1);
  expect(within(rows[2]!).getAllByRole('cell').at(-1)).toHaveTextContent('The server remembers the laptop.');
  expect(within(rows[0]!).getAllByRole('cell').at(-1)).toBeEmptyDOMElement();
});

test('EventLog: one row per message with its time, addresses, protocol and size', () => {
  renderLog(1, 1);
  const rows = screen.getAllByRole('row');
  expect(rows).toHaveLength(2);
  const cells = within(rows[1]!)
    .getAllByRole('cell')
    .map((c) => c.textContent);
  expect(cells).toEqual(['1', '0.000s', '192.168.1.10', '192.168.1.20', 'Demo', 'Request', 'The laptop says hello.Details', '34 B']);
});

test('EventLog: the Kind column says the kind in words, using the lesson legend', () => {
  renderLog(2, 2);
  const rows = screen.getAllByRole('row').slice(1);
  const kindOf = (row: HTMLElement) => within(row).getAllByRole('cell')[5]!;
  expect(kindOf(rows[0]!)).toHaveTextContent('Request');
  expect(kindOf(rows[1]!)).toHaveTextContent('Response');
});

test('EventLog: the Kind column uses the legend label, or a plain word when the legend has none', () => {
  renderLog(2, 2, { legend: [{ kind: 'request', label: 'Question' }] });
  const rows = screen.getAllByRole('row').slice(1);
  expect(within(rows[0]!).getAllByRole('cell')[5]).toHaveTextContent('Question');
  expect(within(rows[1]!).getAllByRole('cell')[5]).toHaveTextContent('Response');
});

test('EventLog: the Kind dot is decoration; the word carries the meaning', () => {
  const { container } = renderLog(1, 1);
  const dot = container.querySelector('tbody .kind-dot');
  expect(dot).toHaveAttribute('data-kind', 'request');
  expect(dot).toHaveAttribute('aria-hidden', 'true');
});

test('EventLog: a dropped message says "Dropped" in its summary', () => {
  renderLog(4, 1);
  const rows = screen.getAllByRole('row').slice(1);
  const dropped = rows.at(-1)!;
  expect(dropped).toHaveAttribute('data-outcome', 'dropped');
  expect(within(dropped).getByText('Dropped')).toBeInTheDocument();
  expect(dropped).toHaveTextContent('This message never arrives.');
  expect(within(rows[0]!).queryByText('Dropped')).not.toBeInTheDocument();
});

test('EventLog: Details opens the packet, passing the packet id and the message number', async () => {
  const user = userEvent.setup();
  const onOpenPacket = vi.fn();
  renderLog(1, 1, { onOpenPacket });
  await user.click(screen.getByRole('button', { name: 'Details' }));
  expect(onOpenPacket).toHaveBeenCalledTimes(1);
  expect(onOpenPacket).toHaveBeenCalledWith('p1', 1);
});

test('EventLog: clicking a row with a packet opens it, and Details opens it only once', async () => {
  const user = userEvent.setup();
  const onOpenPacket = vi.fn();
  renderLog(1, 1, { onOpenPacket });
  await user.click(screen.getByText('The laptop says hello.'));
  expect(onOpenPacket).toHaveBeenCalledTimes(1);
  expect(onOpenPacket).toHaveBeenLastCalledWith('p1', 1);
  // The button sits inside the row: its click must not reach the row as well.
  await user.click(screen.getByRole('button', { name: 'Details' }));
  expect(onOpenPacket).toHaveBeenCalledTimes(2);
});

test('EventLog: clicking a row without a packet does nothing', async () => {
  const user = userEvent.setup();
  const onOpenPacket = vi.fn();
  renderLog(2, 2, { onOpenPacket });
  await user.click(screen.getByText('The server answers.'));
  expect(onOpenPacket).not.toHaveBeenCalled();
});

test('EventLog: selecting text in a row does not open it', () => {
  const onOpenPacket = vi.fn();
  renderLog(1, 1, { onOpenPacket });
  const summary = screen.getByText('The laptop says hello.');
  window.getSelection()!.selectAllChildren(summary);
  // A real pointer would select by dragging; fireEvent keeps the selection user-event would reset.
  fireEvent.click(summary);
  expect(onOpenPacket).not.toHaveBeenCalled();
  window.getSelection()!.removeAllRanges();
});

test('EventLog: only rows with a packet get a Details button', () => {
  renderLog(2, 2);
  expect(screen.getAllByRole('row')).toHaveLength(4);
  expect(screen.getAllByRole('button', { name: 'Details' })).toHaveLength(1);
});

test('EventLog: a Details button is described by its row, so repeated buttons can be told apart', () => {
  renderLog(1, 1);
  expect(screen.getByRole('button', { name: 'Details' })).toHaveAccessibleDescription('The laptop says hello.');
});

test('EventLog: the legend sits above the table as dots with text', () => {
  const { container } = renderLog(1, 1);
  const legend = screen.getByRole('list', { name: 'Legend' });
  expect(
    within(legend)
      .getAllByRole('listitem')
      .map((li) => li.textContent),
  ).toEqual(['Request', 'Response', 'Dropped']);
  const dots = container.querySelectorAll('.kind-dot');
  const legendDots = legend.querySelectorAll('.kind-dot');
  expect(legendDots).toHaveLength(3);
  expect([...legendDots].map((d) => d.getAttribute('data-kind'))).toEqual(['request', 'response', 'dropped']);
  expect([...legendDots].every((d) => d.getAttribute('aria-hidden') === 'true')).toBe(true);
  expect(dots.length).toBeGreaterThan(3);
  const table = screen.getByRole('table');
  expect(legend.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('EventLog: shows no legend when the lesson has none', () => {
  renderLog(1, 1, { legend: [] });
  expect(screen.queryByRole('list', { name: 'Legend' })).not.toBeInTheDocument();
});

test('EventLog: a table wider than its box scrolls, and a keyboard user can reach it', () => {
  renderLog(1, 1);
  const region = screen.getByRole('region', { name: 'Event log' });
  expect(region).toHaveAttribute('tabindex', '0');
  expect(within(region).getByRole('table')).toBeInTheDocument();
});

// ------------------------------------------------------------ RecapPanel

const summary = (over: Partial<AvailableSummary> = {}): AvailableSummary => ({
  available: true,
  key: 'networking/other-lesson',
  trackId: 'networking',
  slug: 'other-lesson',
  url: '/networking/other-lesson',
  number: 2,
  title: 'Other lesson',
  partTitle: 'Part one',
  summary: 'Another lesson.',
  minutes: 8,
  certTags: [],
  stepCount: 4,
  maxPosition: 7,
  ...over,
});

const renderRecap = (props: Partial<Parameters<typeof RecapPanel>[0]> = {}) =>
  render(<RecapPanel lesson={L} prev={null} next={null} nextPlanned={false} trackUrl="/networking" {...props} />);

test('RecapPanel: shows the three takeaways', () => {
  renderRecap();
  expect(screen.getByRole('heading', { name: 'Recap' })).toBeInTheDocument();
  for (const takeaway of L.recap.takeaways) expect(screen.getByText(takeaway)).toBeInTheDocument();
});

test('RecapPanel: lists the certs and roles the lesson is relevant for', () => {
  renderRecap({ lesson: { ...L, certTags: ['network-plus', 'helpdesk'] } });
  expect(screen.getByText('Relevant for:')).toBeInTheDocument();
  expect(screen.getByText('CompTIA Network+')).toBeInTheDocument();
  expect(screen.getByText('Helpdesk')).toBeInTheDocument();
});

test('RecapPanel: leaves out "Relevant for:" when the lesson has no tags', () => {
  renderRecap({ lesson: { ...L, certTags: [] } });
  expect(screen.queryByText('Relevant for:')).not.toBeInTheDocument();
});

test('RecapPanel: references open in a new tab and say so', () => {
  renderRecap();
  expect(screen.getByRole('heading', { name: 'References' })).toBeInTheDocument();
  const link = screen.getByRole('link', { name: /RFC 826: An Ethernet Address Resolution Protocol/ });
  expect(link).toHaveAttribute('href', 'https://www.rfc-editor.org/rfc/rfc826');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener');
  expect(link).toHaveAccessibleName(/opens in a new tab/i);
});

test('RecapPanel: leaves out References when the lesson cites none', () => {
  renderRecap({ lesson: { ...L, references: [] } });
  expect(screen.queryByRole('heading', { name: 'References' })).not.toBeInTheDocument();
});

test('RecapPanel: links to the next lesson', () => {
  renderRecap({ next: summary({ title: 'Routing', url: '/networking/routing' }) });
  const link = screen.getByRole('link', { name: 'Next: Routing' });
  expect(link).toHaveAttribute('href', '/networking/routing');
  expect(screen.queryByText('Next lesson coming soon')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Back to the track' })).not.toBeInTheDocument();
});

test('RecapPanel: says "Next lesson coming soon" when the next lesson is planned but not written', () => {
  renderRecap({ next: null, nextPlanned: true });
  expect(screen.getByText('Next lesson coming soon')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Back to the track' })).not.toBeInTheDocument();
});

test('RecapPanel: with nothing after it, links back to the track', () => {
  renderRecap({ next: null, nextPlanned: false, trackUrl: '/networking' });
  const link = screen.getByRole('link', { name: 'Back to the track' });
  expect(link).toHaveAttribute('href', '/networking');
  expect(screen.queryByText('Next lesson coming soon')).not.toBeInTheDocument();
});

test('RecapPanel: links to the previous lesson when there is one', () => {
  renderRecap({ prev: summary({ title: 'Addressing', url: '/networking/addressing' }) });
  expect(screen.getByRole('link', { name: 'Previous: Addressing' })).toHaveAttribute('href', '/networking/addressing');
});

test('RecapPanel: has no previous link on the first lesson', () => {
  renderRecap({ prev: null });
  expect(screen.queryByRole('link', { name: /^Previous/ })).not.toBeInTheDocument();
});

// ------------------------------------------------------------ PlaybackControls

const stateWith = (over: Partial<PlaybackState> = {}): PlaybackState => ({ ...initialPlayback(), ...over });
const renderControls = (state: PlaybackState = stateWith(), hasEvents = true, dispatch = vi.fn()) => {
  render(<PlaybackControls state={state} hasEvents={hasEvents} dispatch={dispatch} />);
  return dispatch;
};

test('PlaybackControls: Play dispatches a toggle', async () => {
  const user = userEvent.setup();
  const dispatch = renderControls();
  await user.click(screen.getByRole('button', { name: 'Play (Space)' }));
  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith({ type: 'toggle' });
});

test('PlaybackControls: the play button becomes Pause while playing, and toggles back', async () => {
  const user = userEvent.setup();
  const dispatch = renderControls(stateWith({ playing: true }));
  expect(screen.queryByRole('button', { name: 'Play (Space)' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Pause (Space)' }));
  expect(dispatch).toHaveBeenCalledWith({ type: 'toggle' });
});

test('PlaybackControls: Previous step, Next step and Replay step dispatch prev, next and replay', async () => {
  const user = userEvent.setup();
  const dispatch = renderControls();
  await user.click(screen.getByRole('button', { name: 'Previous step' }));
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  await user.click(screen.getByRole('button', { name: 'Replay step' }));
  expect(dispatch.mock.calls).toEqual([[{ type: 'prev' }], [{ type: 'next' }], [{ type: 'replay' }]]);
});

test('PlaybackControls: offers 0.5×, 1× and 2×, with the current speed pressed', () => {
  renderControls(stateWith({ speed: 2 }));
  const group = screen.getByRole('group', { name: 'Speed' });
  const buttons = within(group).getAllByRole('button');
  expect(buttons.map((b) => b.textContent)).toEqual(['0.5×', '1×', '2×']);
  expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'true']);
});

test('PlaybackControls: choosing a speed dispatches it', async () => {
  const user = userEvent.setup();
  const dispatch = renderControls();
  expect(screen.getByRole('button', { name: '1×' })).toHaveAttribute('aria-pressed', 'true');
  await user.click(screen.getByRole('button', { name: '0.5×' }));
  await user.click(screen.getByRole('button', { name: '2×' }));
  expect(dispatch.mock.calls).toEqual([[{ type: 'speed', speed: 0.5 }], [{ type: 'speed', speed: 2 }]]);
});

test('PlaybackControls: Replay is off when the position has no events to replay', async () => {
  const user = userEvent.setup();
  const dispatch = renderControls(stateWith(), false);
  const replay = screen.getByRole('button', { name: 'Replay step' });
  expect(replay).toBeDisabled();
  await user.click(replay);
  expect(dispatch).not.toHaveBeenCalled();
  // Play still works there: it carries on to the next position.
  expect(screen.getByRole('button', { name: 'Play (Space)' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Next step' })).toBeEnabled();
});

test('PlaybackControls: the steps variant has Previous step and Next step only', async () => {
  const user = userEvent.setup();
  const dispatch = vi.fn();
  render(<PlaybackControls variant="steps" dispatch={dispatch} />);
  expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Previous step', 'Next step']);
  expect(screen.queryByRole('group', { name: 'Speed' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Previous step' }));
  await user.click(screen.getByRole('button', { name: 'Next step' }));
  expect(dispatch.mock.calls).toEqual([[{ type: 'prev' }], [{ type: 'next' }]]);
});

// ------------------------------------------------------------ ExplanationPanel

const actorLabel = (id: string) => scene.actors.find((a) => a.id === id)?.label ?? id;
const renderPanel = (position: number, eventIndex = 0, extra: Partial<Parameters<typeof ExplanationPanel>[0]> = {}) =>
  render(
    <ExplanationPanel
      lesson={L}
      sections={sections}
      position={position}
      state={deriveState(L, position, eventIndex, null)}
      actorLabel={actorLabel}
      {...extra}
    />,
  );

test('ExplanationPanel: the Overview gives the hook, the name, the full name and the description', () => {
  renderPanel(0);
  expect(screen.getByText(L.overview.hook)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Neighbor table' })).toBeInTheDocument();
  expect(screen.getByText('Neighbor table (a demonstration)')).toBeInTheDocument();
  expect(screen.getByText(L.overview.description)).toBeInTheDocument();
});

test('ExplanationPanel: the Overview lists its facts as a description list', () => {
  const { container } = renderPanel(0);
  const list = container.querySelector('dl');
  expect(list).not.toBeNull();
  expect([...list!.querySelectorAll('dt')].map((t) => t.textContent)).toEqual(['OSI layer', 'Example address']);
  expect([...list!.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['2 (data link)', '192.168.1.20']);
});

test('ExplanationPanel: a fact value may break the line after a dot and nowhere else, and reads the same', () => {
  const { container } = renderPanel(0);
  const value = [...container.querySelectorAll('dd')].find((d) => d.textContent === '192.168.1.20')!;
  expect(value.innerHTML).toBe('192.<wbr>168.<wbr>1.<wbr>20');
  // Only dots get a break point: a value with none is left whole.
  const plain = [...container.querySelectorAll('dd')].find((d) => d.textContent === '2 (data link)')!;
  expect(plain.querySelector('wbr')).toBeNull();
});

test('wrapAtDots: a break point follows every dot, including a binary mask, and the text is unchanged', () => {
  const mask = '11111111.11111111.11111111.00000000';
  const { container } = render(<dd>{wrapAtDots(mask)}</dd>);
  expect(container.textContent).toBe(mask);
  expect(container.querySelectorAll('wbr')).toHaveLength(3);
  expect(container.innerHTML).toBe('<dd>11111111.<wbr>11111111.<wbr>11111111.<wbr>00000000</dd>');
  const sentence = render(<dd>{wrapAtDots('192.168.1.10, in the subnet 192.168.1.0')}</dd>);
  expect(sentence.container.textContent).toBe('192.168.1.10, in the subnet 192.168.1.0');
  expect(sentence.container.querySelectorAll('wbr')).toHaveLength(6);
  const none = render(<dd>{wrapAtDots('/24 (24 ones)')}</dd>);
  expect(none.container.querySelectorAll('wbr')).toHaveLength(0);
});

test('ExplanationPanel: the Overview shows the resume slot, and only the Overview does', () => {
  const resume = <button type="button">Resume at step 2 of 4</button>;
  const { unmount } = renderPanel(0, 0, { resume });
  expect(screen.getByRole('button', { name: 'Resume at step 2 of 4' })).toBeInTheDocument();
  unmount();
  renderPanel(1, 0, { resume });
  expect(screen.queryByRole('button', { name: 'Resume at step 2 of 4' })).not.toBeInTheDocument();
});

test('ExplanationPanel: a step gives "STEP i OF n", its title, subtitle, narrative and facts', () => {
  const { container } = renderPanel(2, 0);
  expect(screen.getByText('STEP 2 OF 4')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Get an answer' })).toBeInTheDocument();
  expect(screen.getByText('The server replies and takes notes')).toBeInTheDocument();
  expect(screen.getByText(L.steps[1]!.narrative)).toBeInTheDocument();
  expect([...container.querySelectorAll('dt')].map((t) => t.textContent)).toEqual(['Replies', 'Table rows']);
  expect([...container.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['1', '1']);
  expect(screen.queryByText(L.overview.hook)).not.toBeInTheDocument();
});

test('ExplanationPanel: the narrative is in a polite live region', () => {
  const { container } = renderPanel(1, 0);
  const live = container.querySelector('[aria-live="polite"]');
  expect(live).not.toBeNull();
  expect(live).toHaveTextContent(L.steps[0]!.narrative);
});

test('ExplanationPanel: the live region stays the same element as the learner moves between steps', () => {
  const { container, rerender } = renderPanel(1, 0);
  const live = container.querySelector('[aria-live="polite"]');
  rerender(<ExplanationPanel lesson={L} sections={sections} position={2} state={deriveState(L, 2, 0, null)} actorLabel={actorLabel} />);
  expect(container.querySelector('[aria-live="polite"]')).toBe(live);
  expect(live).toHaveTextContent(L.steps[1]!.narrative);
});

test('ExplanationPanel: the event card appears once a message has played', () => {
  renderPanel(1, 1);
  const card = screen.getByRole('group', { name: 'Latest message' });
  expect(within(card).getByText('Hello')).toBeInTheDocument();
  expect(within(card).getByText('Laptop → Server')).toBeInTheDocument();
  expect(within(card).getByText('The laptop says hello.')).toBeInTheDocument();
  expect(within(card).getByText('Message 1 of 4 · Demo · 34 B')).toBeInTheDocument();
  expect(within(card).getByText('Request')).toBeInTheDocument();
  expect(within(card).queryByText('Dropped')).not.toBeInTheDocument();
});

test('ExplanationPanel: the event card names the kind with the lesson legend wording', () => {
  const lesson = validateLesson(
    fixtureLesson({
      scene: { ...(fixtureLesson().scene as FlowScene), legend: [{ kind: 'request', label: 'Question' }] },
    }),
  ).lesson;
  render(
    <ExplanationPanel lesson={lesson} sections={sections} position={1} state={deriveState(lesson, 1, 1, null)} actorLabel={actorLabel} />,
  );
  expect(within(screen.getByRole('group', { name: 'Latest message' })).getByText('Question')).toBeInTheDocument();
});

test('ExplanationPanel: the event card is left out before anything has played', () => {
  renderPanel(1, 0);
  expect(screen.queryByRole('group', { name: 'Latest message' })).not.toBeInTheDocument();
});

test('ExplanationPanel: a dropped message is labelled "Dropped" in the card', () => {
  renderPanel(4, 1);
  const card = screen.getByRole('group', { name: 'Latest message' });
  expect(card).toHaveAttribute('data-outcome', 'dropped');
  expect(within(card).getByText('Dropped')).toBeInTheDocument();
  expect(within(card).getByText('Lost hello')).toBeInTheDocument();
});

test('ExplanationPanel: Try it, Check yourself and the Recap show the children instead of a step', () => {
  for (const position of [sections.tryIt, sections.check, sections.recap]) {
    const { unmount } = renderPanel(position, 0, { children: <p>Panel body {position}</p> });
    expect(screen.getByText(`Panel body ${position}`)).toBeInTheDocument();
    expect(screen.queryByText(/^STEP /)).not.toBeInTheDocument();
    expect(screen.queryByText(L.overview.hook)).not.toBeInTheDocument();
    unmount();
  }
});

test('ExplanationPanel: ignores children on the Overview and on steps', () => {
  const { unmount } = renderPanel(0, 0, { children: <p>Stray child</p> });
  expect(screen.queryByText('Stray child')).not.toBeInTheDocument();
  unmount();
  renderPanel(1, 0, { children: <p>Stray child</p> });
  expect(screen.queryByText('Stray child')).not.toBeInTheDocument();
});

// ------------------------------------------------------------ TryItPanel

const choicesTryIt = L.tryIt;
if (choicesTryIt.mode !== 'choices') throw new Error('fixture changed: Try it should offer choices');
const freeTryIt = { mode: 'free', prompt: 'Change the prefix.', explanation: 'A longer prefix makes a smaller network.' } as const;

test('TryItPanel: shows the prompt and a button for every choice', () => {
  render(<TryItPanel tryIt={choicesTryIt} chosen={null} done={false} onChoose={noop} />);
  expect(screen.getByRole('heading', { name: 'Try it' })).toBeInTheDocument();
  expect(screen.getByText('Which address should the laptop send to?')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'The server' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'A device that is not there' })).toBeInTheDocument();
});

test('TryItPanel: the chosen choice is pressed', () => {
  render(<TryItPanel tryIt={choicesTryIt} chosen="c2" done={false} onChoose={noop} />);
  expect(screen.getByRole('button', { name: 'The server' })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: 'A device that is not there' })).toHaveAttribute('aria-pressed', 'true');
});

test('TryItPanel: nothing is pressed before a choice', () => {
  render(<TryItPanel tryIt={choicesTryIt} chosen={null} done={false} onChoose={noop} />);
  for (const button of screen.getAllByRole('button')) expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('TryItPanel: clicking a choice reports its id', async () => {
  const user = userEvent.setup();
  const onChoose = vi.fn();
  render(<TryItPanel tryIt={choicesTryIt} chosen={null} done={false} onChoose={onChoose} />);
  await user.click(screen.getByRole('button', { name: 'A device that is not there' }));
  expect(onChoose).toHaveBeenCalledTimes(1);
  expect(onChoose).toHaveBeenCalledWith('c2');
});

test('TryItPanel: the explanation waits until the choice has played out', () => {
  const { rerender } = render(<TryItPanel tryIt={choicesTryIt} chosen="c1" done={false} onChoose={noop} />);
  expect(screen.queryByText('The address matches the server, so the message arrives.')).not.toBeInTheDocument();
  rerender(<TryItPanel tryIt={choicesTryIt} chosen="c1" done={true} onChoose={noop} />);
  expect(screen.getByText('The address matches the server, so the message arrives.')).toBeInTheDocument();
  expect(screen.queryByText('No device owns that address, so the message is dropped.')).not.toBeInTheDocument();
});

test('TryItPanel: shows no explanation when done but nothing is chosen', () => {
  render(<TryItPanel tryIt={choicesTryIt} chosen={null} done={true} onChoose={noop} />);
  expect(screen.queryByText(/so the message/)).not.toBeInTheDocument();
});

test('TryItPanel: the explanation is announced when it appears', () => {
  const { container } = render(<TryItPanel tryIt={choicesTryIt} chosen="c1" done={true} onChoose={noop} />);
  expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('The address matches the server');
});

test('TryItPanel: free mode shows the prompt, with no choices', () => {
  render(<TryItPanel tryIt={freeTryIt} chosen={null} done={false} onChoose={noop} />);
  expect(screen.getByText('Change the prefix.')).toBeInTheDocument();
  expect(screen.queryAllByRole('button').filter((b) => b.getAttribute('aria-pressed') !== null)).toHaveLength(0);
});

test('TryItPanel: free mode shows the explanation under a "What to notice" disclosure that starts open and can be folded away', async () => {
  const user = userEvent.setup();
  const { container } = render(<TryItPanel tryIt={freeTryIt} chosen={null} done={false} onChoose={noop} />);
  const details = container.querySelector('details');
  expect(details).not.toBeNull();
  expect(details).toHaveAttribute('open');
  const summary = screen.getByText('What to notice');
  expect(summary.tagName).toBe('SUMMARY');
  expect(details).toContainElement(screen.getByText('A longer prefix makes a smaller network.'));
  expect(screen.getByText('A longer prefix makes a smaller network.')).toBeVisible();
  await user.click(summary);
  expect(details).not.toHaveAttribute('open');
  await user.click(summary);
  expect(details).toHaveAttribute('open');
});

test('TryItPanel: choices mode has no disclosure', () => {
  const { container } = render(<TryItPanel tryIt={choicesTryIt} chosen={null} done={false} onChoose={noop} />);
  expect(container.querySelector('details')).toBeNull();
});

// ------------------------------------------------------------ colour (see lesson.css)

// The Dropped pill is text on a solid --blocked fill drawn in --bg; the muted text sits on --card-2 in the event card and facts;
// the pressed speed button and the play button are --bg text on an --ink-strong fill.
test.each(['dark', 'light'] as const)('the text pairs lesson.css relies on reach 4.5:1 in the %s theme', (theme) => {
  const t = tokens[theme];
  expect(contrastRatio(t.bg, t.blocked)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(t['muted'], t['card-2'])).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(t.bg, t['ink-strong'])).toBeGreaterThanOrEqual(4.5);
});
