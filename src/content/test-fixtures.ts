import type { LessonInput } from './schema';

/**
 * Valid lessons for tests. Every call builds a fresh object, so a test can
 * change any part of it without affecting the next test.
 *
 * Shape that other tests rely on: actors `a` and `b` joined by link `a-b`;
 * table `t` on `b` starts empty; message `m1` goes to a single target; every
 * Try it choice has at least one event.
 *
 * The prose is deliberately short but realistic (272 counted words), so
 * "a lesson over 12 or 15 minutes" tests can add words to a lesson that is
 * otherwise comfortably inside the budget.
 */
export function fixtureLesson(overrides: Partial<LessonInput> = {}): LessonInput {
  const lesson: LessonInput = {
    slug: 'fixture-lesson',
    title: 'Fixture lesson',
    subtitle: 'A small lesson used only by tests',
    level: 'beginner',
    osiLayers: [2],
    certTags: ['network-plus'],
    summary: 'Two devices exchange messages, and one of them learns who the other is.',
    references: [{ label: 'RFC 826: An Ethernet Address Resolution Protocol', url: 'https://www.rfc-editor.org/rfc/rfc826' }],
    overview: {
      hook: 'Think of a front desk that writes down every visitor it sees. The next time that visitor returns, nobody has to ask who they are.',
      name: 'Neighbor table',
      fullName: 'Neighbor table (a demonstration)',
      description:
        'A device keeps a short list of the neighbors it has heard from. Using the list saves it from asking the same question twice.',
      facts: [
        { label: 'OSI layer', value: '2 (data link)' },
        { label: 'Example address', value: '192.168.1.20' },
      ],
    },
    scene: {
      type: 'flow',
      views: ['network', 'sequence'],
      actors: [
        { id: 'a', kind: 'laptop', label: 'Laptop', addresses: ['192.168.1.10', '00:00:5E:00:53:0A'], x: 200, y: 300 },
        { id: 'b', kind: 'server', label: 'Server', addresses: ['192.168.1.20', '00:00:5E:00:53:14'], x: 800, y: 300 },
      ],
      links: [{ id: 'a-b', from: 'a', to: 'b', medium: 'wired' }],
      tables: [
        {
          id: 't',
          actor: 'b',
          title: 'Neighbor table',
          columns: [
            { key: 'ip', label: 'IP address' },
            { key: 'mac', label: 'MAC address' },
          ],
          keyColumn: 'ip',
          initialRows: [],
        },
      ],
      packets: {
        p1: {
          name: 'Hello frame',
          summary: 'A small frame carrying a hello from the laptop to the server.',
          size: 34,
          layers: [
            {
              name: 'Ethernet',
              size: 14,
              summary: 'Delivers the frame to one device on the local network.',
              fields: [
                { name: 'Destination MAC', value: '00:00:5E:00:53:14', explain: 'The server.' },
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
                { name: 'Destination IP', value: '192.168.1.20' },
              ],
            },
          ],
        },
      },
      legend: [
        { kind: 'request', label: 'Request' },
        { kind: 'response', label: 'Response' },
        { kind: 'dropped', label: 'Dropped' },
      ],
    },
    steps: [
      {
        id: 'hello',
        title: 'Say hello',
        subtitle: 'The laptop speaks first',
        narrative:
          'The laptop sends a small hello to the server. The frame carries both addresses, so every device along the way knows where it came from and where it is going.',
        facts: [
          { label: 'Sender', value: 'Laptop' },
          { label: 'Size', value: '34 bytes' },
        ],
        events: [
          {
            type: 'message',
            id: 'm1',
            from: 'a',
            to: ['b'],
            src: '192.168.1.10',
            dst: '192.168.1.20',
            protocol: 'Demo',
            kind: 'request',
            label: 'Hello',
            summary: 'The laptop says hello.',
            size: 34,
            time: 0,
            packet: 'p1',
          },
        ],
      },
      {
        id: 'answer',
        title: 'Get an answer',
        subtitle: 'The server replies and takes notes',
        narrative:
          'The server answers, then writes the laptop into its neighbor table. A second message follows, and the table now has a row to point at.',
        facts: [
          { label: 'Replies', value: '1' },
          { label: 'Table rows', value: '1' },
        ],
        events: [
          {
            type: 'message',
            id: 'm2',
            from: 'b',
            to: ['a'],
            src: '192.168.1.20',
            dst: '192.168.1.10',
            protocol: 'Demo',
            kind: 'response',
            label: 'Hello back',
            summary: 'The server answers.',
            size: 60,
            time: 1,
          },
          {
            type: 'message',
            id: 'm3',
            from: 'a',
            to: ['b'],
            src: '192.168.1.10',
            dst: '192.168.1.20',
            protocol: 'Demo',
            kind: 'request',
            label: 'Thanks',
            summary: 'The laptop acknowledges.',
            size: 60,
            time: 2,
          },
          {
            type: 'table',
            id: 't-add',
            table: 't',
            op: 'add',
            row: { ip: '192.168.1.10', mac: '00:00:5E:00:53:0A' },
            summary: 'The server remembers the laptop.',
          },
        ],
      },
      {
        id: 'reuse',
        title: 'Use the table',
        subtitle: 'A second visit needs no question',
        narrative:
          'When the laptop comes back, the server finds its row at once. Looking up a known neighbor is quick, and it saves a round trip.',
        facts: [
          { label: 'Lookup', value: 'Hit' },
          { label: 'Question asked', value: 'None' },
        ],
        events: [
          {
            type: 'table',
            id: 't-match',
            table: 't',
            op: 'match',
            key: '192.168.1.10',
            summary: 'The server finds the laptop in its table.',
          },
        ],
      },
      {
        id: 'lost',
        title: 'When it goes wrong',
        subtitle: 'A message that never arrives',
        narrative:
          'Sometimes a message is lost on the way. The sender gets no reply, and the lesson shows that missing answer as a dropped message.',
        facts: [
          { label: 'Outcome', value: 'Dropped' },
          { label: 'Reply', value: 'None' },
        ],
        events: [
          {
            type: 'message',
            id: 'm4',
            from: 'a',
            to: ['b'],
            src: '192.168.1.10',
            dst: '192.168.1.20',
            protocol: 'Demo',
            kind: 'request',
            label: 'Lost hello',
            summary: 'This message never arrives.',
            size: 34,
            time: 5,
            outcome: 'dropped',
          },
        ],
      },
    ],
    tryIt: {
      mode: 'choices',
      prompt: 'Which address should the laptop send to?',
      choices: [
        {
          id: 'c1',
          label: 'The server',
          events: [
            {
              type: 'message',
              id: 'c1-hello',
              from: 'a',
              to: ['b'],
              src: '192.168.1.10',
              dst: '192.168.1.20',
              protocol: 'Demo',
              kind: 'request',
              label: 'Hello',
              summary: 'Delivered to the server.',
              size: 34,
              time: 0,
            },
          ],
          explanation: 'The address matches the server, so the message arrives.',
        },
        {
          id: 'c2',
          label: 'A device that is not there',
          events: [
            {
              type: 'message',
              id: 'c2-hello',
              from: 'a',
              to: ['b'],
              src: '192.168.1.10',
              dst: '192.168.1.99',
              protocol: 'Demo',
              kind: 'request',
              label: 'Hello',
              summary: 'Nobody has this address.',
              size: 34,
              time: 0,
              outcome: 'dropped',
            },
          ],
          explanation: 'No device owns that address, so the message is dropped.',
        },
      ],
    },
    check: [
      {
        id: 'q1',
        prompt: 'What does the server store in its neighbor table?',
        options: ['Every message it receives', 'A row for each neighbor it has heard from', 'Nothing at all'],
        answer: 1,
        explanation: 'The table holds one row per neighbor, not a copy of each message.',
      },
      {
        id: 'q2',
        prompt: 'Why keep a table at all?',
        options: ['It avoids asking the same question twice', 'It makes messages larger'],
        answer: 0,
        explanation: 'A known neighbor can be found at once, with no extra round trip.',
      },
    ],
    recap: {
      takeaways: [
        'A device writes down the neighbors it hears from.',
        'A known neighbor can be found without asking again.',
        'A lost message simply gets no answer.',
      ],
    },
  };
  return { ...lesson, ...overrides };
}

/** A valid playground lesson: four preset steps and a free-form Try it. */
export function fixturePlaygroundLesson(): LessonInput {
  const step = (id: string, title: string, address: string, prefix: number, compare?: string) => ({
    id,
    title,
    subtitle: `${title}, step by step`,
    narrative: `This step shows ${address} with a prefix of ${prefix}. The mask decides how many leading bits name the network.`,
    facts: [
      { label: 'Address', value: address },
      { label: 'Prefix', value: `/${prefix}` },
    ],
    events: [],
    preset: { address, prefix, ...(compare === undefined ? {} : { compare }) },
  });

  return {
    slug: 'fixture-playground',
    title: 'Fixture playground',
    subtitle: 'A small playground lesson used only by tests',
    level: 'beginner',
    osiLayers: [3],
    certTags: ['network-plus', 'ccna'],
    summary: 'Slide the prefix and watch an address split into network and host bits.',
    references: [{ label: 'RFC 4632: Classless Inter-domain Routing', url: 'https://www.rfc-editor.org/rfc/rfc4632' }],
    overview: {
      hook: 'A street address has a street and a house number. An IP address has the same two parts.',
      name: 'Prefix',
      fullName: 'Network prefix length (a demonstration)',
      description: 'The prefix tells you how many leading bits name the network and how many name the host.',
      facts: [
        { label: 'OSI layer', value: '3 (network)' },
        { label: 'Example network', value: '192.168.1.0/24' },
      ],
    },
    scene: { type: 'playground', playground: 'subnet' },
    steps: [
      step('whole', 'The whole address', '192.168.1.10', 24),
      step('split', 'Where it splits', '192.168.1.10', 26),
      step('compare', 'Same subnet?', '192.168.1.10', 24, '192.168.1.200'),
      step('wide', 'A wider network', '172.16.5.4', 16),
    ],
    tryIt: {
      mode: 'free',
      prompt: 'Change the prefix and check which addresses share a subnet.',
      explanation: 'A longer prefix makes the network smaller, so fewer addresses share it.',
    },
    check: [
      {
        id: 'q1',
        prompt: 'What does a longer prefix do?',
        options: ['Makes the network smaller', 'Makes the network larger'],
        answer: 0,
        explanation: 'More bits name the network, so fewer bits are left for hosts.',
      },
      {
        id: 'q2',
        prompt: 'Which prefix gives the most hosts?',
        options: ['/16', '/24', '/30'],
        answer: 0,
        explanation: 'A /16 leaves 16 bits for hosts.',
      },
    ],
    recap: {
      takeaways: [
        'An address has a network part and a host part.',
        'The prefix says where the split is.',
        'A longer prefix means fewer hosts.',
      ],
    },
  };
}
