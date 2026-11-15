import { eventLog } from './helpers/internet-events';
import whatIsIp from './lessons/what-is-ip';
import type { Lesson, MessageEvent, SceneEvent, TableEvent, Unit } from './schema';

/**
 * Switch's unit as the design spec writes it (prototypes/d13-switch.md §3), for the tests of what the build adds: What
 * is IP's lesson with this unit swapped in, so the figure's parts, the driver, the panel and the log are all driven by
 * the same scene. Every word is the spec's placeholder; the lesson itself (src/content/lessons/switch.ts) is the
 * author's. Test-only: nothing imports it into the site.
 */

export const MAC = { router: '00:00:5E:00:53:01', laptop: '00:00:5E:00:53:10', tv: '00:00:5E:00:53:12', printer: '00:00:5E:00:53:13' };
const ALL = 'ff:ff:ff:ff:ff:ff';
type Device = keyof typeof MAC;

const frame = (id: string, from: Device, to: Device | 'all', o: Partial<MessageEvent> = {}): MessageEvent => ({
  type: 'message',
  id,
  from,
  to,
  tag: to === 'all' ? 'TO ALL' : 'FRAME',
  kind: to === 'all' ? 'broadcast' : 'request',
  log: { time: '—', source: MAC[from], destination: to === 'all' ? ALL : MAC[to], protocol: 'Ethernet', info: `Frame ${id}`, size: '—' },
  plain: `Frame ${id}.`,
  ...o,
});
const table = (id: string, o: Partial<TableEvent>): TableEvent => ({ type: 'table', id, table: 'mac-table', op: 'match', summary: `Table ${id}.`, ...o }) as TableEvent;

const STEPS: SceneEvent[][] = [
  [frame('s1-frame', 'laptop', 'printer', { cues: [{ cue: 'flood' }] }), table('s1-match', { key: '' })],
  [table('s2-add', { op: 'add', row: { port: '2', mac: MAC.laptop } })],
  [frame('s3-frame', 'printer', 'laptop', { kind: 'response' }), table('s3-add', { op: 'add', row: { port: '4', mac: MAC.printer } }), table('s3-match', { key: MAC.laptop })],
  [frame('s4-frame', 'router', 'all'), table('s4-add', { op: 'add', row: { port: '1', mac: MAC.router } })],
  [frame('s5-frame', 'laptop', 'router', { cues: [{ cue: 'plug', arg: 'laptop 5' }] }), table('s5-update', { op: 'update', key: MAC.laptop, row: { port: '5' } }), table('s5-match', { key: MAC.router })],
];

const scene = (): Unit['scene'] => ({
  title: 'Four devices on one switch',
  views: ['network'],
  layers: [],
  labels: {},
  start: [],
  panel: {
    type: 'table',
    table: {
      id: 'mac-table',
      title: 'MAC table',
      by: 'kept by the switch',
      columns: [{ key: 'port', label: 'Port', width: 64 }, { key: 'mac', label: 'MAC address' }],
      keyColumn: 'mac',
      initialRows: [],
      empty: 'Empty: the switch hasn’t learned any address yet',
    },
  },
  log: {
    ...eventLog(),
    legend: [
      { kind: 'request', label: 'Frame for one device' },
      { kind: 'broadcast', label: 'Frame for everyone' },
      { kind: 'response', label: 'The reply' },
    ],
  },
  parties: [],
});

export function switchFixture(): Lesson {
  const lesson = structuredClone(whatIsIp);
  const unit = lesson.units[0]!;
  const template = unit.steps[0]!;
  lesson.slug = 'switch-fixture';
  lesson.figure = 'switch';
  unit.scene = scene();
  unit.steps = STEPS.map((events, i) => ({ ...structuredClone(template), id: `step-${i + 1}`, title: `Step ${i + 1}`, events: structuredClone(events) }));
  for (const step of unit.steps) delete step.status;
  return lesson;
}
