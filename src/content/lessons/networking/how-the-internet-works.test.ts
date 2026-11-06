// @vitest-environment jsdom
import { afterEach, expect, test } from 'vitest';
import { drawNetMap } from '../../../art/scenes/net-map';
import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, plateSites } from '../../../art/scenes/net-map-layers';
import { FIGURE_PARTS } from '../../../art/scenes/parts';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../../engine/timeline';
import { sceneViewOf } from '../../../scenes/driver';
import { netMapDriver } from '../../../scenes/drivers/net-map';
import { lessonNumbers, lessonTitles, misnamedLessons, textsOf } from '../../../test/lesson-references';
import { validateLesson } from '../../define';
import { countUnitWords, estimateMinutes, estimateUnitMinutes, MAX_MINUTES, PRACTICE_MINUTES_PER_UNIT } from '../../estimate';
import { getEntries, getLesson } from '../../registry';
import type { MessageEvent, Unit } from '../../schema';
import internet, { UNIT_ORDER } from './how-the-internet-works';

afterEach(() => {
  document.body.innerHTML = '';
});

const unitById = (id: string): Unit => internet.units.find((u) => u.id === id)!;
const indexOf = (id: string): number => internet.units.findIndex((u) => u.id === id);
const messagesOf = (u: Unit): MessageEvent[] => u.steps.flatMap((s) => s.events).filter((e): e is MessageEvent => e.type === 'message');
const minutesOf = (u: Unit): number => estimateUnitMinutes(u, PRACTICE_MINUTES_PER_UNIT);

/** A unit's table once its step `n` has played in full (or, without `n`, at its Learn). */
function tableAfter(id: string, table: string, n?: number) {
  const p = n === undefined ? positionOf(internet, indexOf(id), 'learn') : positionOf(internet, indexOf(id), 'step', n);
  return deriveState(internet, p, stepEvents(internet, p).length).tables[table]!;
}

/** The network map on the page, and its driver. */
function mountMap() {
  const { svg, data } = drawNetMap();
  const host = document.createElement('div');
  host.innerHTML = svg;
  document.body.append(host);
  const root = host.querySelector<SVGSVGElement>('svg[data-figure="net-map"]')!;
  return { root, data, driver: netMapDriver.create(root, data) };
}

test('units follow UNIT_ORDER', () => {
  // Protocol Explorer's order (owner): its structure and order only.
  expect(UNIT_ORDER).toEqual(['http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh', 'tls']);
  // Only the protocols written so far, in that order.
  expect(internet.units.map((u) => u.id)).toEqual(['http', 'tcp', 'dns', 'smtp']);
});

test('the lesson is lesson 1, How the Internet Works, on the network map', () => {
  expect(internet).toMatchObject({
    slug: 'how-the-internet-works',
    title: 'How the Internet Works',
    subtitle: 'The protocols behind every page',
    level: 'beginner',
    certTags: ['a-plus', 'network-plus', 'security-plus', 'ccna', 'helpdesk'],
    summary:
      'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS. Each one gets its own short walkthrough of what it does.',
    figure: 'net-map',
  });
  expect(getEntries('networking').find((e) => e.slug === 'how-the-internet-works')).toMatchObject({
    number: 1,
    available: true,
    units: 4,
    stepCount: 22,
    minutes: estimateMinutes(internet),
  });
  expect(internet.units.map((u) => [u.name, u.fullName, u.purpose, u.group, u.osiLayers])).toEqual([
    ['HTTP', 'HyperText Transfer Protocol', 'Asking for web pages', 'app', [7]],
    ['TCP', 'Transmission Control Protocol', 'Delivery you can count on', 'core', [4]],
    ['DNS', 'Domain Name System', 'Names into numbers', 'app', [7]],
    ['SMTP', 'Simple Mail Transfer Protocol', 'Sending email', 'app', [7]],
  ]);
});

test('the protocol files are parts of the lesson, not lessons of their own', () => {
  // The registry reads lessons/<track>/<slug>.ts only, so lessons/networking/how-the-internet-works/*.ts stay out.
  // (DNS, DHCP and TLS also have lessons of their own, 14, 10 and 16, under the same slugs as their units here.)
  const available = getEntries('networking').filter((e) => e.available).map((e) => e.slug);
  expect(available).toContain('how-the-internet-works');
  for (const id of ['http', 'tcp', 'smtp']) expect(getLesson('networking', id), id).toBeUndefined();
  expect(getLesson('networking', 'how-the-internet-works')).toBe(internet);
});

test('each protocol validates, has 5–6 steps and 2 questions, and takes at most 15 minutes', () => {
  expect(() => validateLesson(internet)).not.toThrow();
  for (const u of internet.units) {
    expect(u.steps.length, u.id).toBeGreaterThanOrEqual(5);
    expect(u.steps.length, u.id).toBeLessThanOrEqual(6);
    expect(u.practice, u.id).toHaveLength(2);
    expect(minutesOf(u), u.id).toBeLessThanOrEqual(MAX_MINUTES);
  }
  // The mockup's words, all of them: steps, words read and minutes. FIGS/minutes.mjs counts 737, 680, 636 and 685 words:
  // it turns each <b> tag into a space, so the punctuation after a bold term ("**client**,") counts as a word of its own.
  // The site counts the same words as below. Each protocol takes 7 minutes, and the four together 27.
  expect(internet.units.map((u) => [u.id, u.steps.length, countUnitWords(u), minutesOf(u)])).toEqual([
    ['http', 5, 723, 7],
    ['tcp', 6, 670, 7],
    ['dns', 5, 627, 7],
    ['smtp', 6, 675, 7],
  ]);
  expect(estimateMinutes(internet)).toBe(27);
});

test('HTTP: step titles are Client Request, DNS Resolution, TCP Connection, HTTP Exchange, Render Page', () => {
  const titles = (id: string) => unitById(id).steps.map((s) => s.title);
  expect(titles('http')).toEqual(['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render Page']);
  expect(titles('tcp')).toEqual([
    'Three-Way Handshake',
    'Sequence and Acknowledgement',
    'Packet Loss',
    'Duplicate ACK and SACK',
    'Retransmission',
    'Connection Teardown',
  ]);
  expect(titles('dns')).toEqual(['Recursive Query', 'Root Referral', 'TLD Referral', 'Authoritative Answer', 'Response and Caching']);
  expect(titles('smtp')).toEqual([
    'TCP and TLS Handshake',
    'EHLO and Authentication',
    'Message Submission',
    'MX Lookup',
    'Server Relay and STARTTLS',
    'Message Delivery',
  ]);
  // Learn's pattern box, in Title Case (the box sets it in capitals). SMTP's are its commands and a reply code, as written.
  expect(internet.units.map((u) => u.learn.pattern.names)).toEqual([
    ['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render'],
    ['Handshake', 'Sequence', 'Acknowledge', 'Retransmit', 'Teardown'],
    ['Recursive Query', 'Root', 'TLD', 'Authoritative', 'Cache'],
    ['EHLO', 'MAIL FROM', 'RCPT TO', 'DATA', '250'],
  ]);
});

test('every message names places the map has, and every unit’s layers exist', () => {
  const parts = FIGURE_PARTS['net-map'];
  const { data } = drawNetMap();
  expect(internet.units.map((u) => u.scene.layers)).toEqual([['http:web'], ['tcp:web'], ['dns:names'], ['smtp:out', 'smtp:in']]);
  for (const u of internet.units) {
    for (const layer of u.scene.layers) expect(parts.layers, `${u.id}: ${layer}`).toContain(layer);
    // The places this unit's map shows: home, the internet and the resolver, and its own server plates.
    const shown = new Set([...NET_MAP_BASE_PLACES, ...u.scene.layers.flatMap((layer) => plateSites(NET_MAP_LAYERS[layer]!))]);
    for (const m of messagesOf(u)) {
      expect(shown.has(m.from) && shown.has(m.to), `${u.id}: ${m.id} ${m.from}>${m.to}`).toBe(true);
      // A route joins them, so the message can ride it.
      expect(() => netMapDriver.duration(m, data), `${u.id}: ${m.id}`).not.toThrow();
    }
    for (const party of u.scene.parties) expect(shown.has(party.place), `${u.id}: ${party.place}`).toBe(true);
  }
  expect(internet.units.map((u) => messagesOf(u).length)).toEqual([11, 14, 8, 34]);
});

test('TCP’s lost piece is dropped with dropAt, and its row is marked missing', () => {
  const tcp = unitById('tcp');
  const lost = messagesOf(tcp).filter((m) => m.outcome === 'dropped');
  expect(lost.map((m) => [m.tag, m.dropAt, m.log.info])).toEqual([['PIECE 2', 0.55, 'seq 1461, 1460 bytes (lost)']]);
  // Its log row says so in words, in the blocked colour, and the legend explains its glyph.
  expect(tcp.scene.log.legend).toContainEqual({ kind: 'dropped', label: 'Lost on the way' });
  const p = positionOf(internet, indexOf('tcp'), 'step', 3);
  expect(deriveState(internet, p, stepEvents(internet, p).length).log.find((r) => r.tag === 'PIECE 2')).toMatchObject({ outcome: 'dropped' });

  // Piece 2 is missing once piece 3 arrives, and stays missing while the laptop asks for it again.
  const held = [
    { piece: '1', bytes: '1–1460', status: 'Arrived' },
    { piece: '2', bytes: '1461–2920', status: 'Missing' },
    { piece: '3', bytes: '2921–4380', status: 'Arrived, held' },
  ];
  expect(tableAfter('tcp', 'pieces', 3)).toMatchObject({ rows: held, missed: ['2'] });
  expect(tableAfter('tcp', 'pieces', 4)).toMatchObject({ rows: held, missed: ['2'] });
  // Sent again, it arrives: the row is filled in, and the mark goes.
  expect(tableAfter('tcp', 'pieces', 5)).toMatchObject({
    rows: [
      { piece: '1', bytes: '1–1460', status: 'Arrived' },
      { piece: '2', bytes: '1461–2920', status: 'Arrived (resent)' },
      { piece: '3', bytes: '2921–4380', status: 'Arrived' },
    ],
    missed: [],
  });
});

test('each protocol’s table ends with the mockup’s rows', () => {
  const cells = (id: string, table: string) => tableAfter(id, table).rows.map((row) => Object.values(row));
  expect(cells('http', 'files')).toEqual([
    ['/', 'text/html', '200 OK', '18 KB'],
    ['/style.css', 'text/css', '200 OK', '6 KB'],
    ['/logo.png', 'image/png', '200 OK', '9 KB'],
  ]);
  expect(cells('dns', 'learned')).toEqual([
    ['.app', 'ask 192.0.2.20', 'root', '2 days'],
    ['techconcepts.app', 'ask ns1, 198.51.100.40', '.app servers', '1 day'],
    ['techconcepts.app', '198.51.100.7', 'ns1', '5 min'],
  ]);
  expect(cells('smtp', 'trip')).toEqual([
    ['1', 'Your laptop', 'smtp.example.net', '250 queued'],
    ['Lookup', 'smtp.example.net', 'DNS resolver', 'MX: mx.example.org'],
    ['2', 'smtp.example.net', 'mx.example.org', '250 delivered'],
  ]);
});

test('each table takes the mockup’s words: its title, who keeps it, its columns, and words where its cells are words', () => {
  const tables = internet.units.map((u) => (u.scene.panel?.type === 'table' ? u.scene.panel.table : null));
  // internet-v2.html sets a cell in the sans face when it is not the first and holds no digit; each column here
  // takes what most of its cells are.
  expect(tables.map((t) => t && [t.id, t.title, t.by, t.keyColumn, t.columns.map((c) => [c.label, c.prose ?? false]), t.empty])).toEqual([
    [
      'files',
      'Files the browser has',
      'for this page so far',
      'path',
      [['Path', false], ['Type', true], ['Status', false], ['Size', false]],
      'None yet. The browser hasn’t asked for anything.',
    ],
    [
      'pieces',
      'What the laptop has',
      'pieces of the page',
      'piece',
      [['Piece', false], ['Bytes', false], ['Status', true]],
      'Nothing yet. No data has arrived.',
    ],
    [
      'learned',
      'What the resolver learned',
      'and how long it may keep it',
      // Two rows name techconcepts.app, so the table is keyed on who answered: each server is asked once.
      'from',
      [['Name', false], ['Answer', false], ['From', true], ['Keeps for', false]],
      'Nothing yet. The resolver hasn’t asked anyone.',
    ],
    [
      'trip',
      'The letter’s trip',
      'one handover at a time',
      'leg',
      [['Leg', false], ['From', true], ['To', true], ['Result', false]],
      'Not sent yet. The letter is still on the laptop.',
    ],
  ]);
});

test('the log is the packet log of internet-v2.html, with its widths, and the parties are each map’s places', () => {
  for (const u of internet.units) {
    expect(u.scene.log.title).toBe('Event log');
    expect(u.scene.log.columns.map((c) => [c.key, c.label, c.width ?? null, c.prose ?? false])).toEqual([
      ['time', 'Time', 100, false],
      ['source', 'Source', 176, false],
      ['destination', 'Destination', 176, false],
      ['protocol', 'Protocol', 84, false],
      ['info', 'Info', null, true],
      ['size', 'Size', 76, false],
    ]);
    expect(u.scene.views).toEqual(['network', 'sequence']);
    // No unit carries packets, so no log size has a packet to match (DHCP's rule): each is the mockup's own.
    expect(u.scene.packets).toBeUndefined();
    expect(messagesOf(u).every((m) => m.packet === undefined)).toBe(true);
  }
  expect(internet.units.map((u) => u.scene.parties.map((p) => `${p.label} ${p.addr}`))).toEqual([
    ['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Web server 203.0.113.80'],
    ['Laptop 192.168.1.100', 'Web server 203.0.113.80'],
    ['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Root server 192.0.2.10', '.app server 192.0.2.20', 'ns1.techconcepts.app 198.51.100.40'],
    ['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Your mail server 203.0.113.60', 'Sam’s mail server 198.51.100.88'],
  ]);
  expect(internet.units.map((u) => [u.scene.title, u.scene.labels])).toEqual([
    ['Your browser asks a web server for a page', { laptop: 'Wants example.net', url: 'example.net' }],
    ['A page arrives whole, though a piece got lost', { laptop: 'Wants a page', url: 'example.net' }],
    ['The resolver asks its way down the name', { laptop: 'Wants techconcepts.app', url: 'techconcepts.app' }],
    ['Your letter goes to your mail server, then to Sam’s', { laptop: 'Sending to sam@example.org', url: 'Mail' }],
  ]);
});

test('every log cell in a column of figures fits its width at 1280 px, as the mockup’s do', () => {
  // A mono log cell does not wrap: 13 px Atkinson Hyperlegible Mono is under 0.6 em a character, inside 10 px of
  // padding each side. A column that clips its address runs it into the next one.
  const CHAR_PX = 0.6 * 13;
  const PADDING_PX = 20;
  for (const u of internet.units) {
    for (const column of u.scene.log.columns.filter((c) => c.width !== undefined && c.prose !== true)) {
      for (const m of messagesOf(u)) {
        const value = m.log[column.key] ?? '';
        expect([...value].length * CHAR_PX + PADDING_PX, `${u.id}: ${m.id} ${column.key} "${value}"`).toBeLessThanOrEqual(column.width!);
      }
    }
  }
});

test('each protocol’s sources are the RFCs its facts name', () => {
  expect(internet.units.map((u) => u.references)).toEqual([
    [
      { label: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
      { label: 'RFC 9112: HTTP/1.1', url: 'https://www.rfc-editor.org/rfc/rfc9112' },
    ],
    [{ label: 'RFC 9293: Transmission Control Protocol (TCP)', url: 'https://www.rfc-editor.org/rfc/rfc9293' }],
    [
      { label: 'RFC 1034: Domain Names, Concepts and Facilities', url: 'https://www.rfc-editor.org/rfc/rfc1034' },
      { label: 'RFC 1035: Domain Names, Implementation and Specification', url: 'https://www.rfc-editor.org/rfc/rfc1035' },
    ],
    [{ label: 'RFC 5321: Simple Mail Transfer Protocol', url: 'https://www.rfc-editor.org/rfc/rfc5321' }],
  ]);
  for (const u of internet.units) {
    const named = u.learn.facts.find((f) => f.label === 'Defined in')!.value.match(/RFC \d+/g)!;
    for (const rfc of named) expect(u.references.some((r) => r.label.startsWith(`${rfc}:`)), `${u.id}: ${rfc}`).toBe(true);
  }
});

test('the words name no other lesson by number or title, and each “The X part” is a protocol of this lesson', () => {
  expect(lessonNumbers(internet)).toEqual([]);
  expect(misnamedLessons(internet, {})).toEqual([]);
  expect(lessonTitles(internet)).toEqual([]);
  const parts = textsOf(internet).flatMap((text) => [...text.matchAll(/\bThe (\w+) part\b/g)].map((m) => m[1]!.toLowerCase()));
  expect(parts).toEqual(['dns', 'tcp', 'tls']);
  for (const id of parts) expect(UNIT_ORDER).toContain(id);
});

test('no prose is left with the mockup’s markup: bold is **term**, and no tag or entity is left', () => {
  for (const text of textsOf(internet)) {
    expect(text, text).not.toMatch(/<\/?(b|span|i|em)\b|&(lt|gt|amp|quot|#\d+);/);
  }
});

// ---------------------------------------------------------------- the map, as the console shows it

test('show draws every position of the lesson, at every event of its step, without throwing', () => {
  const { driver } = mountMap();
  let shown = 0;
  slotsFor(internet).forEach((slot, p) => {
    const unit = internet.units[slot.unit]!;
    for (let n = 0; n <= stepEvents(internet, p).length; n++) {
      expect(() => driver.show(sceneViewOf(unit, deriveState(internet, p, n))), `${unit.id} position ${p}, event ${n}`).not.toThrow();
      shown++;
    }
  });
  // Every position (4 × (steps + 3)) and every event of every step once more.
  const events = internet.units.reduce((sum, u) => sum + u.steps.reduce((n, s) => n + s.events.length, 0), 0);
  expect(shown).toBe(slotsFor(internet).length + events);
});

test('HTTP’s laptop says what it is doing from the first step, until a message says more', () => {
  const { root, driver } = mountMap();
  const http = unitById('http');
  const status = () => root.querySelector('#nm-lapState')!.textContent;
  const showAt = (kind: 'overview' | 'step' | 'learn', step = 1, played = 0) =>
    driver.show(sceneViewOf(http, deriveState(internet, positionOf(internet, indexOf('http'), kind, step), played)));
  showAt('overview');
  expect(status()).toBe('Wants example.net');
  showAt('step', 1);
  expect(status()).toBe('Preparing a request');
  expect(http.steps[0]!.idle).toBe('Nothing on the network yet. The browser is still getting ready.');
  // Step 2 starts as step 1 left it, before its lookup has played.
  showAt('step', 2);
  expect(status()).toBe('Preparing a request');
  showAt('step', 2, 1);
  expect(status()).toBe('Looking up example.net');
  showAt('learn');
  expect(status()).toBe('Page loaded');
  expect(root.querySelector('#nm-lapState')!.getAttribute('class')).toBe('nm-state done');
});
