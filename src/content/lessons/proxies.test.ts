// @vitest-environment jsdom
import { expect, test } from 'vitest';
import { drawNetMap, type NetMapData } from '../../art/scenes/net-map';
import { netMapDriver } from '../../scenes/drivers/net-map';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import type { MessageEvent, NoteEvent, TableEvent } from '../schema';
import proxies from './proxies';
import { proxiesSteps } from '../proxies-fixture';

const unit = proxies.units[0]!;
const events = unit.steps.flatMap((s) => s.events);
const messages = events.filter((e): e is MessageEvent => e.type === 'message');
const notes = events.filter((e): e is NoteEvent => e.type === 'note');
const tables = events.filter((e): e is TableEvent => e.type === 'table');

test('Proxies validates on the net map, with 5 steps, 17 events and 2 questions', () => {
  expect(checkStructure(proxies)).toEqual([]);
  expect(proxies.figure).toBe('net-map');
  expect(unit.steps.map((s) => s.title)).toEqual(['Straight to the Site', 'Set to Use a Proxy', 'A Tunnel It Can’t Read', 'A Proxy for the Site', 'Passed to the Server']);
  expect(events).toHaveLength(17);
  expect(messages).toHaveLength(13);
  expect(notes).toHaveLength(1);
  expect(tables).toHaveLength(3);
  expect(unit.practice.map((q) => q.options.length)).toEqual([3, 2]);
});

test('the scene is the built fixture’s: its steps’ starts, events, routes, tags and addresses', () => {
  expect(unit.steps.map((s) => s.start)).toEqual(proxiesSteps.map((s) => s.start));
  const wanted = proxiesSteps.flatMap((s) => s.events);
  expect(events.map((e) => e.id)).toEqual(wanted.map((e) => e.id));
  for (const [i, e] of events.entries()) {
    const w = wanted[i]!;
    expect(e.type).toBe(w.type);
    expect('cues' in e ? e.cues : undefined).toEqual('cues' in w ? w.cues : undefined);
    if (e.type === 'message' && w.type === 'message') {
      expect([e.from, e.to, e.tag, e.kind, e.fast]).toEqual([w.from, w.to, w.tag, w.kind, w.fast]);
      expect(e.log).toEqual(w.log);
    }
    if (e.type === 'note' && w.type === 'note') expect(e.log).toEqual(w.log);
    if (e.type === 'table' && w.type === 'table') expect(e.row).toEqual(w.row);
  }
  expect(unit.scene.layers).toEqual(['proxies:site', 'proxies:proxy']);
  expect(unit.scene.labels).toEqual({ laptop: 'Wants techconcepts.app', url: 'techconcepts.app', router: '198.51.100.23 outside' });
});

test('no source states a time or a size, so each is a dash; the proxy’s own address has no port; the note names no sender', () => {
  for (const e of events.filter((x) => x.type !== 'table')) {
    expect(e.log.time).toBe('—');
    expect(e.log.size).toBe('—');
  }
  for (const m of messages) {
    if (m.from === 'proxy') expect(m.log.source).toMatch(/^203\.0\.113\.30(:41500)?$/);
    if (m.to === 'proxy') expect(m.log.destination).toMatch(/^203\.0\.113\.30(:41500)?$/);
    if (m.from === 'laptop' && m.to === 'proxy') expect(m.log.destination).toBe('203.0.113.30');
  }
  expect(notes[0]!.log).toMatchObject({ protocol: '—', source: '—', destination: '—' });
});

test('the table gains one row per way, in order', () => {
  expect(tables.map((t) => t.row?.way)).toEqual(['Straight', 'Forward proxy', 'Reverse proxy']);
  const panel = unit.scene.panel;
  expect(panel?.type).toBe('table');
  if (panel?.type !== 'table') return;
  expect(panel.table.title).toBe('What the server sees');
  expect(panel.table.columns.map((c) => c.label)).toEqual(['Way', 'Connection from', 'Your address', 'Who can read the request']);
  expect(panel.table.initialRows).toEqual([]);
});

test('each event’s duration, rounded, is the design’s (check 17); table rows and the note take none', () => {
  const data = drawNetMap().data as NetMapData;
  const ms: Record<string, number> = {
    's1-get': 2071,
    's1-page': 2071,
    's2-connect': 1974,
    's2-tcp': 1930,
    's2-ok': 1974,
    's3-in': 1974,
    's3-out': 1930,
    's3-back': 1159,
    's3-page': 1974,
    's4-get': 1956,
    's5-get': 1046,
    's5-ok': 673,
    's5-page': 1956,
  };
  for (const e of events) {
    const got = Math.round(netMapDriver.duration(e, data));
    if (e.type === 'message') expect(got, e.id).toBe(ms[e.id]);
    else expect(got, e.id).toBe(0);
  }
});

test('the lesson never says "gateway" (the glossary’s gateway is the router)', () => {
  const words = JSON.stringify(proxies, (key, value) => (key === 'cite' || key === 'references' ? undefined : value));
  expect(words).not.toMatch(/gateway/i);
});

test('the figure’s show sweep passes for every moment of the lesson', () => {
  expect(showSweep(proxies)).toBeGreaterThan(0);
});
