// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import type { TableDef } from '../content/schema';
import { vpnFixture } from '../content/vpn-fixture';
import { TablePanel } from '../lesson/panels/TablePanel';
import { deriveState, positionOf } from './timeline';

// D15b / B18b, attack cases 23 and 24 (prototypes/d15-vpn-cases.md, with E23): the log and the table of the VPN fixture.

const lesson = vpnFixture();
const def = (lesson.units[0]!.scene.panel as { table: TableDef }).table;
const at = (step: number, n: number) => deriveState(lesson, positionOf(lesson, 0, 'step', step), n).tables['who-reads']!;
const rowOf = (step: number, n: number, who: string) => at(step, n).rows.find((r) => r.who === who)!;
const CAFE = 'On the café’s Wi-Fi';
const SERVER = 'The VPN server';
const AFTER = 'After the VPN server';

test('23: at Learn the log has 14 rows, the infos in the spec’s order, the protocols as given, and no time or size', () => {
  const log = deriveState(lesson, positionOf(lesson, 0, 'learn'), 0).log;
  expect(log).toHaveLength(14);
  expect(log.every((r) => r.type === 'message')).toBe(true);
  expect(log.map((r) => r.cells.info)).toEqual([
    'Plain HTTP: anyone on the way could read it',
    'The page, in plain HTTP',
    'Let’s agree on keys',
    'Keys agreed; there’s a NAT in the way, so carry on at port 4500',
    'Encrypted: who I am, and may I have an address?',
    'Encrypted: who I am; your address is 203.0.113.41',
    'Outside: to the VPN server. Inside, sealed: GET / to example.net',
    'Unwrapped: plain HTTP again, from the VPN’s address',
    'The page, to the VPN’s address',
    'Outside: from the VPN server. Inside, sealed: the page',
    'Outside: to the VPN server. Inside, sealed twice: an HTTPS request',
    'Still sealed by HTTPS: the VPN server can’t read it',
    'The page, sealed by HTTPS',
    'Outside: from the VPN server. Inside, sealed twice: the page',
  ]);
  expect(log.map((r) => r.cells.protocol)).toEqual(['HTTP', 'HTTP', 'IKE', 'IKE', 'IKE', 'IKE', 'ESP', 'HTTP', 'HTTP', 'ESP', 'ESP', 'HTTPS', 'HTTPS', 'ESP']);
  for (const r of log) expect([r.cells.time, r.cells.size], r.eventId).toEqual(['—', '—']);
});

test('24: the table has three rows, each "—", at 1.0', () => {
  expect(at(1, 0).rows).toEqual([CAFE, SERVER, AFTER].map((who) => ({ who, to: '—', read: '—' })));
  expect(at(1, 0).missed).toEqual([]);
});

test('24: each update sets its row and its mark as the spec’s table gives them', () => {
  expect(rowOf(1, 2, CAFE)).toEqual({ who: CAFE, to: 'example.net', read: 'Yes: the request and the page' });
  expect(at(1, 2).missed).toEqual([CAFE]);
  expect(rowOf(3, 2, CAFE)).toEqual({ who: CAFE, to: '203.0.113.40, the VPN server', read: 'No: sealed' });
  expect(at(3, 2).missed).toEqual([]);
  expect(at(4, 1).missed).toEqual([SERVER]);
  expect(rowOf(4, 1, SERVER).read).toBe('Yes, once it unwraps it');
  expect(at(4, 3).missed).toEqual([SERVER, AFTER]);
  expect(rowOf(4, 3, AFTER).read).toBe('Yes: plain HTTP again');
  expect(at(5, 2).missed).toEqual([AFTER]);
  expect(rowOf(5, 2, SERVER).read).toBe('No: sealed by HTTPS');
  expect(at(5, 4).missed).toEqual([]);
  expect(rowOf(5, 4, AFTER).read).toBe('No: sealed by HTTPS');
});

test('24: a row’s mark clears whether the update says `miss: false` or leaves `miss` out', () => {
  for (const clear of ['false', 'absent'] as const) {
    const copy = vpnFixture();
    const row = copy.units[0]!.steps[2]!.events.find((e) => e.type === 'table')!;
    if (row.type === 'table') {
      if (clear === 'absent') delete row.miss;
      else row.miss = false;
    }
    expect(deriveState(copy, positionOf(copy, 0, 'step', 3), 2).tables['who-reads']!.missed, clear).toEqual([]);
  }
});

test('24: the panel marks a readable row with the word "readable", and a sealed row with none', () => {
  const readable = render(<TablePanel def={def} state={at(4, 3)} />);
  expect([...readable.container.querySelectorAll('.tpanel__miss')].map((el) => el.textContent)).toEqual(['readable', 'readable']);
  readable.unmount();
  const sealed = render(<TablePanel def={def} state={at(5, 4)} />);
  expect(sealed.container.querySelectorAll('.tpanel__miss')).toHaveLength(0);
});
