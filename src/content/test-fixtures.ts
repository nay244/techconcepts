import type { FigureId, FigureParts } from '../art/scenes/types';
import type { LessonInput } from './define';
import { legacyLessonSchema, liftLegacy, type LegacyLessonInput, type LegacyUnitInput } from './legacy';
import type { Limits } from './limits';
import type { CertificationTrack, Lesson } from './schema';
import { cite, defineSources, type SourceRegistry } from './sources';

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
 *
 * `makeCitedLesson` (below) is the one fixture in the cited shape, for the strict path (`validateLesson`).
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

/** A valid one-unit lesson at the top of every limit: six steps of 120-word narratives, three questions, and a very long description and feedback. */
export function makeLongLesson(): LegacyLessonInput {
  const long = makeLesson();
  const u = long.units[0]!;
  const words = (n: number) => 'word '.repeat(n).trim();
  u.steps.push({ ...structuredClone(u.steps[4]!), id: 'extra6', events: [] });
  for (const step of u.steps) step.narrative = words(120);
  u.overview.description = words(2500);
  for (const q of u.practice) for (const option of q.options) option.feedback = words(200);
  u.practice.push({ ...structuredClone(u.practice[0]!), id: 'q3' });
  return long;
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

/** Networking's limits: what the ready lessons fit without overrides. */
export const FIXTURE_LIMITS: Limits = {
  steps: { min: 4, max: 6 },
  factsPerStep: { min: 2, max: 4 },
  practiceQuestions: { min: 2, max: 3 },
  optionsPerQuestion: { min: 2, max: 4 },
  learnTerms: { min: 3, max: 10 },
  patternNames: { min: 2, max: 6 },
  narrativeWords: 120,
  hookWords: 80,
  deepWords: 90,
};

/** The whole-document URL of `example-objectives`, which an objective citation may use. */
export const OBJ_URL = 'https://partners.comptia.org/example-objectives.pdf';

/**
 * A small registry of invented sources, one of each kind a test needs. Tests pass it by name to `validateLesson`,
 * `lessonsFromModules`, `defineTrack` and `checkTracks`. The registry accepts only lessons and tracks checked against
 * the real `SOURCES`, so nothing checked against this list reaches the site.
 */
export const FIXTURE_SOURCES: SourceRegistry = defineSources([
  {
    id: 'rfc-example',
    kind: 'rfc',
    short: 'RFC 9999',
    title: 'Example Protocol',
    publisher: 'IETF',
    url: 'https://www.rfc-editor.org/rfc/rfc9999.html',
    anchor: 'https://www.rfc-editor.org/rfc/rfc9999.html#section-{n}',
  },
  {
    id: 'vendor-example',
    kind: 'vendor',
    short: 'Example vendor',
    title: 'Example page',
    publisher: 'Microsoft',
    url: 'https://learn.microsoft.com/example',
  },
  {
    id: 'example-objectives',
    kind: 'cert-objectives',
    short: 'Example objectives',
    title: 'Example certification exam objectives',
    publisher: 'CompTIA',
    url: OBJ_URL,
    version: 'V1',
  },
]);

/** `rfc-example` at a numbered section, linked through the registry's anchor. */
const rfc = (section: string) => cite('rfc-example', section, { sources: FIXTURE_SOURCES });
/** `vendor-example` at a named section: the page plus a fragment, since a content citation points at the section. */
const vendor = (section: string, fragment: string) =>
  cite('vendor-example', section, { sources: FIXTURE_SOURCES, url: `https://learn.microsoft.com/example#${fragment}` });

/**
 * A valid lesson in the cited shape (figure 'dhcp'), against `FIXTURE_SOURCES`; it fits `FIXTURE_LIMITS`. It shows
 * the shape only: its sources are invented, so a real lesson's sources go into `SOURCES`, and `defineLesson`, which
 * checks against `SOURCES`, rejects this one.
 *
 * One unit, `leases`: a laptop borrows an address from the router for a set time, then renews it. Every Learn
 * statement, Go-deeper paragraph and Practice option cites; the OSI layer cites `rfc-example` first, so the derived
 * sources read RFC 9999, then the vendor page. Every Watch part has a backing: most trace to Learn ids (`lead-1`,
 * `lead-2`, `term-1`…`term-3`, `pattern`, `why-1`, `deep-1`, `fact-1`…`fact-3`), the hook is an analogy, and the
 * addresses that stand alone (RFC 5737's 192.0.2.0/24, RFC 7042's 00:00:5E:00:53:xx) are example data. Four steps:
 * `request` (message `m1`, packet `p1`), `grant` (`m2`, table add `t-add`), `lookup` (table match `t-match`, note
 * `n1`) and `renew` (`m3`, `m4`, table update `t-renew`); two Practice questions, `q1` (three options) and `q2` (two).
 */
export function makeCitedLesson(): LessonInput {
  return {
    slug: 'cited-lesson',
    title: 'Cited lesson',
    subtitle: 'How a laptop borrows an address, and keeps it',
    level: 'beginner',
    certTags: ['network-plus'],
    summary: 'A laptop borrows an address from the router for a set time, then asks to keep it.',
    figure: 'dhcp',
    backing: { traces: ['lead-1', 'lead-2'] },
    units: [
      {
        id: 'leases',
        name: 'Address lease',
        fullName: 'Address lease (Example Protocol)',
        purpose: 'How a device borrows an address for a set time.',
        osi: { layers: [7], cite: [rfc('1.2')] },
        backing: { traces: ['lead-1'] },
        scene: {
          title: 'Home network',
          views: ['network', 'sequence'],
          panel: {
            type: 'table',
            table: {
              id: 'leases',
              title: 'Lease table',
              by: 'kept by the router',
              columns: [
                { key: 'ip', label: 'Address' },
                { key: 'holder', label: 'Lent to' },
                { key: 'state', label: 'State' },
              ],
              keyColumn: 'ip',
              initialRows: [],
              empty: 'Empty. The router has not lent any address yet.',
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
              { kind: 'broadcast', label: 'To every device' },
              { kind: 'request', label: 'Request' },
              { kind: 'response', label: 'Reply' },
              { kind: 'change', label: 'Table change' },
              { kind: 'note', label: 'Note' },
            ],
          },
          parties: [
            { place: 'laptop', label: 'Laptop', addr: '192.0.2.10' },
            { place: 'router', label: 'Router', addr: '192.0.2.1' },
          ],
          packets: {
            p1: {
              name: 'Lease request',
              summary: 'The laptop asks for an address, sent to every device on the local network.',
              size: 34,
              layers: [
                {
                  name: 'Ethernet',
                  size: 14,
                  summary: 'Carries the frame to every device on the local network.',
                  fields: [
                    { name: 'Destination MAC', value: 'FF:FF:FF:FF:FF:FF', explain: 'Every device on the local network.' },
                    { name: 'Source MAC', value: '00:00:5E:00:53:0A', explain: 'The laptop.', example: true },
                  ],
                },
                {
                  name: 'Example Protocol',
                  size: 20,
                  summary: 'Asks for an address to borrow.',
                  fields: [
                    { name: 'Message', value: 'Lease request' },
                    { name: 'Hardware address', value: '00:00:5E:00:53:0A', explain: 'Who is asking.', example: true },
                  ],
                },
              ],
              backing: { traces: ['term-1', 'fact-3'] },
            },
          },
          backing: { traces: ['lead-1'] },
        },
        overview: {
          hook: 'Think of a library book. You may keep it for a few weeks, and you can ask to keep it longer before it is due.',
          hookBacking: { analogy: true },
          description: 'A router lends each device an address for a set time, called a **lease**. Before the time runs out, the device asks to keep it.',
          backing: { traces: ['lead-1', 'lead-2'] },
          facts: [
            { label: 'Example address', value: '192.0.2.10', backing: { example: true } },
            { label: 'Lease time', value: 'Set by the router', backing: { traces: ['fact-1'] } },
          ],
        },
        steps: [
          {
            id: 'request',
            title: 'Lease Request',
            sub: 'The laptop asks for an address',
            narrative: 'The laptop has no address yet, so it sends a **lease request** to every device on the local network.',
            deep: [
              {
                text: 'The request goes to every device on the local network, because the laptop does not yet know which one lends addresses.',
                cite: [rfc('3.1')],
              },
            ],
            facts: [
              { label: 'Sender', value: 'Laptop', backing: { traces: ['term-1'] } },
              { label: 'Sent to', value: 'Every device nearby', backing: { traces: ['fact-3'] } },
            ],
            idle: 'Nothing has happened yet. Press Play to start.',
            events: [
              {
                type: 'message',
                id: 'm1',
                from: 'laptop',
                to: 'router',
                tag: 'Lease request',
                kind: 'broadcast',
                packet: 'p1',
                log: { source: 'Laptop', destination: 'Every device', size: '34 B' },
                plain: 'The laptop asks for an address.',
                cues: [{ cue: 'glow' }],
                backing: { traces: ['term-1'] },
              },
            ],
            backing: { traces: ['term-1', 'fact-3'] },
          },
          {
            id: 'grant',
            title: 'Lease Grant',
            sub: 'The router lends an address',
            narrative: 'The router lends the laptop a free address for a set time, and writes the **lease** into its table.',
            deep: [{ text: 'The router chooses how long the lease lasts, and says so in its reply.', cite: [rfc('2.2')] }],
            facts: [
              { label: 'Address', value: '192.0.2.10', backing: { example: true } },
              { label: 'Lease time', value: 'Set by the router', backing: { traces: ['fact-1'] } },
            ],
            events: [
              {
                type: 'message',
                id: 'm2',
                from: 'router',
                to: 'laptop',
                tag: 'Lease grant',
                kind: 'response',
                log: { source: '192.0.2.1', destination: 'Laptop' },
                plain: 'The router lends the laptop an address.',
                backing: { traces: ['lead-1', 'fact-1'] },
              },
              {
                type: 'table',
                id: 't-add',
                table: 'leases',
                op: 'add',
                row: { ip: '192.0.2.10', holder: 'Laptop', state: 'Lent' },
                summary: 'The router writes down the lease.',
                backing: { traces: ['lead-1'] },
              },
            ],
            backing: { traces: ['lead-1', 'fact-1'] },
          },
          {
            id: 'lookup',
            title: 'Lease Lookup',
            sub: 'The router checks what it has lent',
            narrative: 'The router reads its table: the address is lent to the laptop, so it lends it to no other device.',
            deep: [{ text: 'One row per lent address lets the router tell at once which addresses are still free.', cite: [rfc('2.3')] }],
            facts: [
              { label: 'Lookup', value: 'Found', backing: { traces: ['why-1'] } },
              { label: 'Lent to', value: 'Laptop', backing: { traces: ['why-1'] } },
            ],
            events: [
              {
                type: 'table',
                id: 't-match',
                table: 'leases',
                op: 'match',
                key: '192.0.2.10',
                summary: 'The router finds the laptop’s lease.',
                backing: { traces: ['why-1'] },
              },
              {
                type: 'note',
                id: 'n1',
                log: { source: '192.0.2.1' },
                plain: 'The address stays with the laptop.',
                cues: [{ cue: 'status', arg: 'Lent' }],
                backing: { traces: ['why-1'] },
              },
            ],
            backing: { traces: ['why-1'] },
          },
          {
            id: 'renew',
            title: 'Lease Renewal',
            sub: 'The laptop asks to keep it',
            narrative: 'Halfway through the lease, the laptop asks to keep its address. The router agrees, and the lease starts again.',
            deep: [{ text: 'A device asks to renew when half of its lease time has passed.', cite: [vendor('Lease renewal', 'lease-renewal')] }],
            facts: [
              { label: 'When', value: 'Halfway through', backing: { traces: ['fact-2'] } },
              { label: 'Address', value: 'Unchanged', backing: { traces: ['lead-2'] } },
            ],
            events: [
              {
                type: 'message',
                id: 'm3',
                from: 'laptop',
                to: 'router',
                tag: 'Renew',
                kind: 'request',
                log: { source: '192.0.2.10', destination: '192.0.2.1' },
                plain: 'The laptop asks to keep its address.',
                backing: { traces: ['term-3', 'fact-2'] },
              },
              {
                type: 'message',
                id: 'm4',
                from: 'router',
                to: 'laptop',
                tag: 'Renewed',
                kind: 'response',
                log: { source: '192.0.2.1', destination: '192.0.2.10' },
                plain: 'The router extends the lease.',
                backing: { traces: ['lead-2'] },
              },
              {
                type: 'table',
                id: 't-renew',
                table: 'leases',
                op: 'update',
                key: '192.0.2.10',
                row: { ip: '192.0.2.10', holder: 'Laptop', state: 'Renewed' },
                summary: 'The router starts the laptop’s lease again.',
                backing: { traces: ['lead-2'] },
              },
            ],
            backing: { traces: ['lead-2', 'fact-2'] },
          },
        ],
        learn: {
          lead: [
            { id: 'lead-1', text: 'A **lease** is an address the router lends a device for a set time.', cite: [rfc('2.1')] },
            { id: 'lead-2', text: 'Before the time runs out, the device asks to keep the address, and the router extends the lease.', cite: [rfc('4.1')] },
          ],
          terms: [
            { id: 'term-1', idea: 'Asking for an address', name: 'Lease request', cite: [rfc('3.1')] },
            { id: 'term-2', idea: 'An address lent for a set time', name: 'Lease', cite: [rfc('2.1')] },
            { id: 'term-3', idea: 'Asking to keep it longer', name: 'Renewal', cite: [vendor('Lease renewal', 'lease-renewal')] },
          ],
          pattern: {
            id: 'pattern',
            names: ['Lease Request', 'Lease Grant', 'Lease Renewal'],
            note: 'Ask, receive, then renew before the time runs out.',
            cite: [rfc('3')],
          },
          why: [
            {
              id: 'why-1',
              text: 'While a lease lasts, the router lends that address to no other device, so no two devices share one.',
              cite: [rfc('2.3')],
            },
          ],
          deep: [
            {
              id: 'deep-1',
              text: 'The router chooses the lease time. A device renews at half of it, so a lost reply still leaves time to try again.',
              cite: [rfc('4.2'), vendor('Lease renewal', 'lease-renewal')],
            },
          ],
          facts: [
            { id: 'fact-1', label: 'Lease time', value: 'Chosen by the router', cite: [rfc('2.2')] },
            { id: 'fact-2', label: 'Renewal', value: 'At half the lease time', cite: [vendor('Lease renewal', 'lease-renewal')] },
            { id: 'fact-3', label: 'Request sent to', value: 'Every device on the local network', cite: [rfc('3.1')] },
          ],
        },
        practice: [
          {
            id: 'q1',
            prompt: 'What is a lease?',
            options: [
              { text: 'An address lent for a set time', feedback: 'Right. The router lends the address, and the lease says for how long.', cite: [rfc('2.1')] },
              { text: 'An address a device keeps forever', feedback: 'Not quite. A lease ends unless the device renews it.', cite: [rfc('4.1')] },
              {
                text: 'A list of every device on the network',
                feedback: 'Not quite. The router keeps a table of its leases; a lease is one address lent to one device.',
                cite: [rfc('2.3')],
              },
            ],
            answer: 0,
          },
          {
            id: 'q2',
            prompt: 'When does a device ask to keep its address?',
            options: [
              {
                text: 'When half of its lease time has passed',
                feedback: 'Right. Renewing halfway leaves time to try again if a reply is lost.',
                cite: [vendor('Lease renewal', 'lease-renewal')],
              },
              { text: 'Only after the lease has run out', feedback: 'Not quite. By then the address is no longer lent to it.', cite: [rfc('4.1')] },
            ],
            answer: 0,
          },
        ],
      },
    ],
  };
}

/**
 * A certification track of two lessons, each mapped to one objective of the pinned `example-objectives` (V1). It is
 * valid against `FIXTURE_SOURCES` only; the registry's check against `SOURCES` (`checkTracks`) rejects it.
 */
export function makeCertTrack(): CertificationTrack {
  const objective = (section: string) => ({
    exam: 'EX-101',
    objective: section,
    cite: cite('example-objectives', section, { sources: FIXTURE_SOURCES, url: OBJ_URL }),
  });
  return {
    id: 'example-cert',
    type: 'certification',
    title: 'Example cert',
    description: 'A certification track used only by tests.',
    level: 'intermediate',
    limits: structuredClone(FIXTURE_LIMITS),
    exam: { title: 'Example cert', codes: ['EX-101'], version: 'V1', source: 'example-objectives' },
    parts: [
      {
        id: 'domain-2',
        title: 'Domain 2',
        lessons: [
          { slug: 'lesson-a', title: 'Lesson A', objectives: [objective('2.6')] },
          { slug: 'lesson-b', title: 'Lesson B', objectives: [objective('2.7')] },
        ],
      },
    ],
  };
}
