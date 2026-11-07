import type { FigureId, FigureParts } from '../art/scenes/types';
import { legacyLessonSchema, liftLegacy, type LegacyLessonInput, type LegacyUnitInput } from './legacy';
import type { Lesson } from './schema';

/**
 * Valid lessons for tests, written in the legacy authoring shape. Every call
 * builds a fresh object, so a test can change any part of it without affecting
 * the next test. A test that needs a runtime `Lesson` lifts one with
 * `liftedFixture` (below), which needs no figure mock.
 *
 * The real `FIGURE_PARTS` only holds what each figure built so far can show,
 * so a test that validates these fixtures swaps in `FIXTURE_PARTS`:
 *
 *   vi.mock('../art/scenes/parts', async () => ({ FIGURE_PARTS: (await import('./test-fixtures')).FIXTURE_PARTS }));
 *
 * Shape that other tests rely on, per unit (figure 'dhcp'): places `laptop`,
 * `router` and `phone`; parties Laptop and Router, so both views show; a table
 * panel with table `t` (keyed on `ip`, starting empty); five steps whose events
 * are `m1` (with packet `p1` and a `glow` cue), `m2` + `t-add`, `t-match` + note
 * `n1` (a `status` cue), `m3` (dropped) and `m4`; two Practice questions.
 */

/**
 * A stand-in for `FIGURE_PARTS`: every figure has the fixture's places, a flag
 * cue (`glow`), a text cue (`status`) and two layers; only `subnet` takes a
 * board, and only `net-map` a scene's start, as in the real figures.
 */
export const FIXTURE_PARTS: Record<FigureId, FigureParts> = {
  dhcp: fixtureParts({ board: false, start: false }),
  subnet: fixtureParts({ board: true, start: false }),
  firewall: fixtureParts({ board: false, start: false }),
  'net-map': fixtureParts({ board: false, start: true }),
};

function fixtureParts({ board, start }: { board: boolean; start: boolean }): FigureParts {
  return { places: ['laptop', 'router', 'phone'], cues: { glow: 'flag', status: 'text' }, layers: ['web', 'mail'], board, start };
}

/** One valid unit: an overview, five Watch steps, Learn and two questions. */
export function makeUnit(id = 'neighbors', overrides: Partial<LegacyUnitInput> = {}): LegacyUnitInput {
  const unit: LegacyUnitInput = {
    id,
    name: 'Neighbor table',
    fullName: 'Neighbor table (a demonstration)',
    purpose: 'How a router remembers who it has heard from.',
    osiLayers: [2],
    references: [{ label: 'RFC 826: An Ethernet Address Resolution Protocol', url: 'https://www.rfc-editor.org/rfc/rfc826' }],
    scene: {
      title: 'Home network',
      views: ['network', 'sequence'],
      layers: [],
      labels: {},
      start: [],
      panel: {
        type: 'table',
        table: {
          id: 't',
          title: 'Neighbor table',
          by: 'kept by the router',
          columns: [
            { key: 'ip', label: 'IP address' },
            { key: 'mac', label: 'MAC address' },
          ],
          keyColumn: 'ip',
          initialRows: [],
          empty: 'Empty. The router has not heard from anyone yet.',
        },
      },
      log: {
        title: 'Event log',
        columns: [
          { key: 'source', label: 'Source' },
          { key: 'destination', label: 'Destination' },
          { key: 'size', label: 'Size' },
          { key: 'plain', label: 'In plain words' },
        ],
        legend: [
          { kind: 'request', label: 'Request' },
          { kind: 'response', label: 'Reply' },
          { kind: 'dropped', label: 'Lost on the way' },
          { kind: 'note', label: 'Note' },
        ],
      },
      parties: [
        { place: 'laptop', label: 'Laptop', addr: '192.168.1.10' },
        { place: 'router', label: 'Router', addr: '192.168.1.1' },
      ],
      packets: {
        p1: {
          name: 'Hello frame',
          summary: 'A small frame carrying a hello from the laptop to the router.',
          size: 34,
          layers: [
            {
              name: 'Ethernet',
              size: 14,
              summary: 'Delivers the frame to one device on the local network.',
              fields: [
                { name: 'Destination MAC', value: '00:00:5E:00:53:01', explain: 'The router.' },
                { name: 'Source MAC', value: '00:00:5E:00:53:0A', explain: 'The laptop.' },
                { name: 'EtherType', value: '0x0800', explain: 'An IPv4 packet follows.' },
              ],
            },
            {
              name: 'IPv4',
              size: 20,
              summary: 'Names the sender and the receiver by IP address.',
              fields: [
                { name: 'Source IP', value: '192.168.1.10' },
                { name: 'Destination IP', value: '192.168.1.1' },
              ],
            },
          ],
        },
      },
    },
    overview: {
      hook: 'Think of a front desk that writes down every visitor it sees. The next time that visitor returns, nobody has to ask who they are.',
      description:
        'A router keeps a short list of the devices it has heard from. Using the list saves it from asking the same question twice.',
      facts: [
        { label: 'OSI layer', value: '2 (data link)' },
        { label: 'Example address', value: '192.168.1.10' },
      ],
    },
    steps: [
      {
        id: 'hello',
        title: 'Neighbor Hello',
        sub: 'The laptop speaks first',
        narrative: 'The laptop sends a small **hello** to the router. The frame carries both addresses, so the router knows who sent it.',
        deep: 'A real neighbor protocol repeats its hello on a timer, so a silent device is noticed and forgotten.',
        facts: [
          { label: 'Sender', value: 'Laptop' },
          { label: 'Size', value: '34 bytes' },
        ],
        idle: 'Nothing has happened yet. Press Play to start.',
        events: [
          {
            type: 'message',
            id: 'm1',
            from: 'laptop',
            to: 'router',
            tag: 'Hello',
            kind: 'request',
            packet: 'p1',
            log: { source: '192.168.1.10', destination: '192.168.1.1', size: '34 B' },
            plain: 'The laptop says hello to the router.',
            cues: [{ cue: 'glow' }],
          },
        ],
      },
      {
        id: 'answer',
        title: 'Neighbor Reply',
        sub: 'The router replies and takes notes',
        narrative: 'The router answers, then writes the laptop into its **neighbor table**. The table now has a row to point at.',
        deep: 'Entries usually age out after a few minutes without traffic, so the table only lists devices that are still around.',
        facts: [
          { label: 'Replies', value: '1' },
          { label: 'Table rows', value: '1' },
        ],
        events: [
          {
            type: 'message',
            id: 'm2',
            from: 'router',
            to: 'laptop',
            tag: 'Hello back',
            kind: 'response',
            log: { source: '192.168.1.1', destination: '192.168.1.10', size: '60 B' },
            plain: 'The router answers the laptop.',
          },
          {
            type: 'table',
            id: 't-add',
            table: 't',
            op: 'add',
            row: { ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' },
            summary: 'The router remembers the laptop.',
          },
        ],
      },
      {
        id: 'reuse',
        title: 'Table Lookup',
        sub: 'A second visit needs no question',
        narrative: 'When the laptop comes back, the router finds its row at once. Looking up a known neighbor is quick, and it saves a round trip.',
        deep: 'A lookup reads the table without changing it, which is why nothing new is added here.',
        facts: [
          { label: 'Lookup', value: 'Hit' },
          { label: 'Question asked', value: 'None' },
        ],
        events: [
          { type: 'table', id: 't-match', table: 't', op: 'match', key: '192.168.1.10', summary: 'The router finds the laptop in its table.' },
          {
            type: 'note',
            id: 'n1',
            log: { source: '192.168.1.1' },
            plain: 'The router already knows the laptop.',
            cues: [{ cue: 'status', arg: 'Known neighbor' }],
          },
        ],
      },
      {
        id: 'lost',
        title: 'Lost Message',
        sub: 'A message that never arrives',
        narrative: 'Sometimes a message is lost on the way. The sender gets no reply, and the lesson marks the missing answer as **dropped**.',
        deep: 'Lost frames are normal on a busy network; the protocols above notice and send them again.',
        facts: [
          { label: 'Outcome', value: 'Dropped' },
          { label: 'Reply', value: 'None' },
        ],
        events: [
          {
            type: 'message',
            id: 'm3',
            from: 'laptop',
            to: 'router',
            tag: 'Hello',
            kind: 'request',
            outcome: 'dropped',
            dropAt: 0.5,
            log: { source: '192.168.1.10', destination: '192.168.1.1', size: '34 B' },
            plain: 'This hello never reaches the router.',
          },
        ],
      },
      {
        id: 'retry',
        title: 'Retransmission',
        sub: 'The laptop tries again',
        narrative: 'With no answer, the laptop simply sends its hello again. This time it arrives, and the router already has its row.',
        deep: 'Senders wait a little longer after each miss, so a busy network is not flooded with repeats.',
        facts: [
          { label: 'Attempts', value: '2' },
          { label: 'Outcome', value: 'Delivered' },
        ],
        events: [
          {
            type: 'message',
            id: 'm4',
            from: 'laptop',
            to: 'router',
            tag: 'Hello again',
            kind: 'request',
            over: 'Wi-Fi',
            log: { source: '192.168.1.10', destination: '192.168.1.1', size: '34 B' },
            plain: 'The laptop tries again, and the hello arrives.',
          },
        ],
      },
    ],
    learn: {
      lead: 'A router keeps a list of the devices it has heard from, so it does not have to ask twice.',
      terms: [
        { idea: 'Saying who you are', name: 'Hello' },
        { idea: 'The list of who is nearby', name: 'Neighbor table' },
        { idea: 'Sending it again after silence', name: 'Retransmission' },
      ],
      pattern: { names: ['Neighbor Hello', 'Neighbor Reply', 'Table Lookup'], note: 'Say hello, get an answer, then look it up next time.' },
      why: 'Helpdesk staff read tables like this one to see which devices a router knows about.',
      deep: 'Real tables also record when each row was last refreshed.',
      facts: [
        { label: 'Lives on', value: 'The router' },
        { label: 'Rows', value: 'One per neighbor' },
      ],
    },
    practice: [
      {
        id: 'q1',
        prompt: 'What does the router store in its neighbor table?',
        options: [
          { text: 'Every message it receives', feedback: 'Not quite. It keeps one row per neighbor, not a copy of each message.' },
          { text: 'A row for each neighbor it has heard from', feedback: 'Right. One row per neighbor.' },
          { text: 'Nothing at all', feedback: 'Not quite. The table fills as neighbors say hello.' },
        ],
        answer: 1,
      },
      {
        id: 'q2',
        prompt: 'Why keep a table at all?',
        options: [
          { text: 'It avoids asking the same question twice', feedback: 'Right. A known neighbor is found at once.' },
          { text: 'It makes messages larger', feedback: 'Not quite. The messages stay the same size.' },
        ],
        answer: 0,
      },
    ],
  };
  return { ...unit, ...overrides };
}

/**
 * The fixture unit with two table changes in a row in two of its steps. Neighbor Reply plays `m2`, `t-add`, then
 * `t-check`. Table Lookup plays `t-match`, `t-recheck`, then note `n1`. `t-check`'s summary has no full stop at its end.
 */
export function makeUnitWithTwoTableChanges(id = 'neighbors', overrides: Partial<LegacyUnitInput> = {}): LegacyUnitInput {
  const unit = makeUnit(id, overrides);
  const answer = unit.steps.find((s) => s.id === 'answer')!;
  const reuse = unit.steps.find((s) => s.id === 'reuse')!;
  answer.events.push({ type: 'table', id: 't-check', table: 't', op: 'match', key: '192.168.1.10', summary: 'The router checks the row it wrote' });
  reuse.events.splice(1, 0, { type: 'table', id: 't-recheck', table: 't', op: 'match', key: '192.168.1.10', summary: 'The row is still there.' });
  return unit;
}

/** A valid one-unit lesson on figure 'dhcp'. */
export function makeLesson(overrides: Partial<LegacyLessonInput> = {}): LegacyLessonInput {
  const lesson: LegacyLessonInput = {
    slug: 'fixture-lesson',
    title: 'Fixture lesson',
    subtitle: 'A small lesson used only by tests',
    level: 'beginner',
    certTags: ['network-plus'],
    summary: 'A laptop says hello, and the router learns who it is.',
    figure: 'dhcp',
    units: [makeUnit()],
  };
  return { ...lesson, ...overrides };
}

/** A valid lesson of two units, `alpha` (core) and `beta` (app), each with five steps and two questions. */
export function makeTwoUnitLesson(overrides: Partial<LegacyLessonInput> = {}): LegacyLessonInput {
  return makeLesson({
    units: [makeUnit('alpha', { name: 'Alpha', group: 'core' }), makeUnit('beta', { name: 'Beta', group: 'app' })],
    ...overrides,
  });
}

/** A fixture lifted into the runtime shape, as the legacy path lifts the ready lessons. Checks only the shape. */
export function liftedFixture(input: LegacyLessonInput = makeLesson()): Lesson {
  return liftLegacy(legacyLessonSchema.parse(input));
}
