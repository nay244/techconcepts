// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest';
import { drawNetMap } from '../../art/scenes/net-map';
import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, plateSites } from '../../art/scenes/net-map-layers';
import { FIGURE_PARTS } from '../../art/scenes/parts';
import { deriveState, positionOf, slotsFor, stepEvents } from '../../engine/timeline';
import { sceneViewOf } from '../../scenes/driver';
import { netMapDriver } from '../../scenes/drivers/net-map';
import { lessonNumbers, lessonTitles, misnamedLessons, textsOf } from '../../test/lesson-references';
import { showSweep } from '../../test/show-sweep';
import { checkStructure } from '../define';
import { getEntries, getLesson } from '../registry';
import type { MessageEvent, Unit } from '../schema';
import internet, { UNIT_ORDER } from './how-the-internet-works';

afterEach(() => {
  document.body.innerHTML = '';
});

const unitById = (id: string): Unit => internet.units.find((u) => u.id === id)!;
const indexOf = (id: string): number => internet.units.findIndex((u) => u.id === id);
const messagesOf = (u: Unit): MessageEvent[] => u.steps.flatMap((s) => s.events).filter((e): e is MessageEvent => e.type === 'message');
// Read from the project root: under jsdom import.meta.url is not a file URL.

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

test('all 14 protocols are present, in UNIT_ORDER', () => {
  // Protocol Explorer's order (owner): its structure and order only.
  expect(UNIT_ORDER).toEqual(['http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh', 'tls']);
  expect(internet.units.map((u) => u.id)).toEqual([...UNIT_ORDER]);
});

test('78 Watch steps in all, 28 questions', () => {
  expect(internet.units.reduce((n, u) => n + u.steps.length, 0)).toBe(78);
  expect(internet.units.reduce((n, u) => n + u.practice.length, 0)).toBe(28);
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
    units: 14,
    stepCount: 78,
  });
  expect(internet.units.map((u) => [u.name, u.fullName, u.purpose, u.group, u.osi])).toEqual([
    ['HTTP', 'HyperText Transfer Protocol', 'Asking for web pages', 'app', { layers: [7], cite: [] }],
    ['HTTPS', 'HTTP Secure', 'Web pages, sealed', 'security', { layers: [7], cite: [] }],
    ['TCP', 'Transmission Control Protocol', 'Delivery you can count on', 'core', { layers: [4], cite: [] }],
    ['UDP', 'User Datagram Protocol', 'Quick, no checking', 'core', { layers: [4], cite: [] }],
    ['IP', 'Internet Protocol', 'Addresses and routes', 'core', { layers: [3], cite: [] }],
    ['DNS', 'Domain Name System', 'Names into numbers', 'app', { layers: [7], cite: [] }],
    ['DHCP', 'Dynamic Host Configuration Protocol', 'Getting an address', 'app', { layers: [7], cite: [] }],
    ['ICMP', 'Internet Control Message Protocol', 'Network check-ups', 'core', { layers: [3], cite: [] }],
    ['SMTP', 'Simple Mail Transfer Protocol', 'Sending email', 'app', { layers: [7], cite: [] }],
    ['POP3', 'Post Office Protocol, version 3', 'Downloading email', 'app', { layers: [7], cite: [] }],
    ['IMAP', 'Internet Message Access Protocol', 'Email kept in sync', 'app', { layers: [7], cite: [] }],
    ['FTP', 'File Transfer Protocol', 'Moving files', 'app', { layers: [7], cite: [] }],
    ['SSH', 'Secure Shell', 'Remote control, sealed', 'security', { layers: [7], cite: [] }],
    ['TLS/SSL', 'Transport Layer Security (SSL is its old name)', 'The seal itself', 'security', { layers: [6], cite: [] }],
  ]);
});

test('the protocol files are parts of the lesson, not lessons of their own', () => {
  // The registry reads lessons/<slug>.ts only, so lessons/how-the-internet-works/*.ts stay out.
  // (DNS, DHCP and TLS also have lessons of their own, 14, 10 and 16, under the same slugs as their units here.)
  const available = getEntries('networking').filter((e) => e.available).map((e) => e.slug);
  expect(available).toContain('how-the-internet-works');
  for (const id of ['http', 'https', 'tcp', 'udp', 'ip', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh']) {
    expect(getLesson(id), id).toBeUndefined();
  }
  expect(getLesson('how-the-internet-works')).toBe(internet);
});

test('the DHCP part and lesson 10, DHCP, both call their unit "dhcp", and each validates under its own lesson key and figure', () => {
  // Their overlap stays as it is (owner: deferred). Sharing the unit id is safe because nothing keys on a unit id
  // across lessons: progress is kept by lesson key, ?step= counts positions, and Practice picks live in each
  // page's own console.
  const lesson10 = getLesson('dhcp')!;
  const part = unitById('dhcp');
  expect(getEntries('networking').find((e) => e.slug === 'dhcp')).toMatchObject({ number: 10, available: true, key: 'dhcp' });
  expect(getEntries('networking').find((e) => e.slug === 'how-the-internet-works')).toMatchObject({ key: 'how-the-internet-works' });
  expect(checkStructure(lesson10)).toEqual([]);
  expect(checkStructure(internet)).toEqual([]);
  expect([lesson10.units.map((u) => u.id), part.id]).toEqual([['dhcp'], 'dhcp']);
  expect(lesson10.figure).toBe('dhcp');
  // The part plays on the network map, at home, with no server plate of its own.
  expect([internet.figure, part.scene.layers]).toEqual(['net-map', []]);
});

test('each protocol validates, has 5–6 steps and 2 questions', () => {
  expect(checkStructure(internet)).toEqual([]);
  for (const u of internet.units) {
    expect(u.steps.length, u.id).toBeGreaterThanOrEqual(5);
    expect(u.steps.length, u.id).toBeLessThanOrEqual(6);
    expect(u.practice, u.id).toHaveLength(2);
  }
  expect(internet.units.map((u) => [u.id, u.steps.length])).toEqual([
    ['http', 5], ['https', 6], ['tcp', 6], ['udp', 5], ['ip', 5], ['dns', 5], ['dhcp', 6],
    ['icmp', 6], ['smtp', 6], ['pop3', 5], ['imap', 5], ['ftp', 6], ['ssh', 6], ['tls', 6],
  ]);
});

test('HTTP: step titles are Client Request, DNS Resolution, TCP Connection, HTTP Exchange, Render Page', () => {
  const titles = (id: string) => unitById(id).steps.map((s) => s.title);
  expect(titles('http')).toEqual(['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render Page']);
  expect(titles('https')).toEqual([
    'Client Request',
    'DNS Resolution',
    'TCP Connection',
    'TLS Handshake',
    'Encrypted HTTP Exchange',
    'Secure Session',
  ]);
  expect(titles('udp')).toEqual([
    'Connectionless Send',
    'Datagram Stream',
    'Packet Loss, No Retransmission',
    'Two-Way Datagrams',
    'Application-Level Recovery',
  ]);
  expect(titles('ip')).toEqual(['Routing Decision', 'ARP Resolution', 'IP Encapsulation', 'NAT and Forwarding', 'Return Routing']);
  expect(titles('dhcp')).toEqual([
    'Client Initialization',
    'DHCP Discover',
    'DHCP Offer',
    'DHCP Request',
    'DHCP Acknowledge',
    'Lease Renewal',
  ]);
  expect(titles('icmp')).toEqual([
    'Echo Request',
    'Echo Reply',
    'Time Exceeded, Hop 1',
    'Time Exceeded, Hop 2',
    'Traceroute',
    'Destination Unreachable',
  ]);
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
  expect(titles('pop3')).toEqual(['TLS Connection', 'Authentication', 'Mailbox Status', 'Message Retrieval', 'Delete and Quit']);
  expect(titles('imap')).toEqual(['TLS Connection', 'Authentication', 'Folder Selection', 'Fetch and Flag', 'IDLE Push']);
  expect(titles('ftp')).toEqual([
    'Control Connection',
    'Plaintext Login',
    'Passive Mode',
    'Data Connection',
    'File Transfer',
    'Session Close',
  ]);
  expect(titles('ssh')).toEqual([
    'Version Exchange',
    'Algorithm Negotiation',
    'Key Exchange and Host Key Check',
    'Public-Key Authentication',
    'Channel Open',
    'Interactive Session',
  ]);
  expect(titles('tls')).toEqual([
    'ClientHello',
    'ServerHello',
    'Certificate Verification',
    'Handshake Finished',
    'Encrypted Application Data',
    'Close Notify',
  ]);
  // Learn's pattern box, in Title Case (the box sets it in capitals). Commands stay as written: SMTP's and a reply
  // code, POP3's and IMAP's, and FTP's PASV and QUIT. TLS's messages are spelt as its step titles spell them.
  expect(internet.units.map((u) => u.learn.pattern.names)).toEqual([
    ['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render'],
    ['DNS Resolution', 'TCP Connection', 'TLS Handshake', 'Encrypted HTTP'],
    ['Handshake', 'Sequence', 'Acknowledge', 'Retransmit', 'Teardown'],
    ['Connectionless Send', 'Datagram Stream', 'No Retransmission', 'App Recovery'],
    ['Routing Decision', 'ARP Resolution', 'Encapsulation', 'NAT', 'Forwarding'],
    ['Recursive Query', 'Root', 'TLD', 'Authoritative', 'Cache'],
    ['Discover', 'Offer', 'Request', 'Acknowledge'],
    ['Echo Request', 'Echo Reply', 'Time Exceeded', 'Unreachable'],
    ['EHLO', 'MAIL FROM', 'RCPT TO', 'DATA', '250'],
    ['USER', 'PASS', 'STAT', 'RETR', 'DELE', 'QUIT'],
    ['LOGIN', 'SELECT', 'FETCH', 'STORE', 'IDLE'],
    ['Control Connection', 'Login', 'PASV', 'Data Connection', 'Transfer', 'QUIT'],
    ['Version Exchange', 'Negotiation', 'Key Exchange', 'Authentication', 'Channel'],
    ['ClientHello', 'ServerHello', 'Certificate', 'Finished', 'Application Data'],
  ]);
});

test('a step with no messages says what the laptop is doing, and why the log is still empty', () => {
  const quiet = internet.units.flatMap((u) => u.steps.filter((s) => s.events.length === 0).map((s) => [u.id, s.title, s.status, s.idle]));
  expect(quiet).toEqual([
    ['http', 'Client Request', 'Preparing a request', 'Nothing on the network yet. The browser is still getting ready.'],
    ['https', 'Client Request', 'Preparing a secure request', 'Nothing on the network yet. The browser is still getting ready.'],
    ['ip', 'Routing Decision', 'Not local: send to the router', 'Nothing on the network yet. The laptop is working out where to send the packet.'],
    ['dhcp', 'Client Initialization', 'On the Wi-Fi, can’t talk yet', 'Nothing on the network yet. The laptop has no address to send from.'],
  ]);
  // Only those steps set a status of their own; every other status comes with a message.
  expect(internet.units.flatMap((u) => u.steps.filter((s) => s.status !== undefined || s.idle !== undefined)).length).toBe(quiet.length);
});

test('every message names places the map has, and every unit’s layers exist', () => {
  const parts = FIGURE_PARTS['net-map'];
  const { data } = drawNetMap();
  expect(internet.units.map((u) => u.scene.layers)).toEqual([
    ['http:web'],
    ['https:web'],
    ['tcp:web'],
    ['udp:call'],
    ['ip:web'],
    ['dns:names'],
    // DHCP stays at home: the laptop and its router.
    [],
    ['icmp:web'],
    ['smtp:out', 'smtp:in'],
    ['pop3:mail'],
    ['imap:mail'],
    ['ftp:files'],
    ['ssh:host'],
    ['tls:web'],
  ]);
  for (const u of internet.units) {
    for (const layer of u.scene.layers) expect(parts.layers, `${u.id}: ${layer}`).toContain(layer);
    // The places this unit's map shows: home, the internet and the resolver, and its own server plates.
    const shown = new Set([...NET_MAP_BASE_PLACES, ...u.scene.layers.flatMap((layer) => plateSites(NET_MAP_LAYERS[layer]!))]);
    const parties = new Set(u.scene.parties.map((p) => p.place));
    for (const m of messagesOf(u)) {
      expect(shown.has(m.from) && shown.has(m.to), `${u.id}: ${m.id} ${m.from}>${m.to}`).toBe(true);
      // A route joins them, so the message can ride it.
      expect(() => netMapDriver.duration(m, data), `${u.id}: ${m.id}`).not.toThrow();
      // Both ends are parties, so the Sequence view has a lifeline for each (the mockup names every end).
      expect(parties.has(m.from) && parties.has(m.to), `${u.id}: ${m.id} ${m.from}>${m.to} parties`).toBe(true);
    }
    for (const party of u.scene.parties) expect(shown.has(party.place), `${u.id}: ${party.place}`).toBe(true);
  }
  expect(internet.units.map((u) => messagesOf(u).length)).toEqual([11, 13, 14, 11, 7, 8, 6, 14, 34, 24, 24, 20, 25, 10]);
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

test('UDP’s lost packet is dropped and never sent again; its row stays a miss while the app copes', () => {
  const udp = unitById('udp');
  const lost = messagesOf(udp).filter((m) => m.outcome === 'dropped');
  expect(lost.map((m) => [m.tag, m.dropAt, m.log.info])).toEqual([['VOICE 5', 0.5, 'RTP over UDP, seq 5 (lost)']]);
  expect(udp.scene.log.legend).toContainEqual({ kind: 'dropped', label: 'Lost on the way' });
  // Nobody resends it: no other message carries packet 5.
  expect(messagesOf(udp).filter((m) => m.tag === 'VOICE 5')).toHaveLength(1);
  const packet = (state: ReturnType<typeof tableAfter>, key: string) => state.rows.find((row) => row.id === key);
  const afterLoss = tableAfter('udp', 'voice', 3);
  expect([packet(afterLoss, 'y5'), afterLoss.missed]).toEqual([{ id: 'y5', packet: '5', way: 'You → server', status: 'Lost' }, ['y5']]);
  // The report changes its row in place, and the mark stays: the packet is still lost.
  const atLearn = tableAfter('udp', 'voice');
  expect([packet(atLearn, 'y5'), atLearn.missed]).toEqual([
    { id: 'y5', packet: '5', way: 'You → server', status: 'Lost, gap filled by Sam’s app' },
    ['y5'],
  ]);
});

test('each protocol’s table ends with the mockup’s rows', () => {
  // Each row's cells, in the order the table shows its columns (UDP's rows also carry a key no column shows).
  const cells = (id: string, table: string) => {
    const panel = unitById(id).scene.panel;
    const columns = panel?.type === 'table' ? panel.table.columns : [];
    return tableAfter(id, table).rows.map((row) => columns.map((c) => row[c.key]));
  };
  expect(cells('http', 'files')).toEqual([
    ['/', 'text/html', '200 OK', '18 KB'],
    ['/style.css', 'text/css', '200 OK', '6 KB'],
    ['/logo.png', 'image/png', '200 OK', '9 KB'],
  ]);
  expect(cells('https', 'seen')).toEqual([
    ['DNS lookup', 'the name techconcepts.app, and its number'],
    ['TCP connection', 'both addresses, and port 443'],
    ['TLS hello', 'the name techconcepts.app'],
    ['The keys', 'nothing: they never crossed'],
    ['The request', 'encrypted data, about 440 bytes'],
    ['The reply', 'encrypted data, about 18 KB'],
    ['The page itself', 'nothing: it’s sealed'],
  ]);
  // Both ways count from 1, so two rows can show the same packet number.
  expect(cells('udp', 'voice')).toEqual([
    ['1', 'You → server', 'Arrived'],
    ['2', 'You → server', 'Arrived'],
    ['3', 'You → server', 'Arrived'],
    ['4', 'You → server', 'Arrived'],
    ['5', 'You → server', 'Lost, gap filled by Sam’s app'],
    ['6', 'You → server', 'Arrived'],
    ['1', 'Server → you', 'Arrived'],
    ['2', 'Server → you', 'Arrived'],
    ['3', 'Server → you', 'Arrived'],
    ['7', 'You → server', 'Arrived'],
  ]);
  expect(cells('ip', 'written')).toEqual([
    ['Leaving the laptop', '192.168.1.100', '203.0.113.80', '64'],
    ['Leaving your router', '198.51.100.23', '203.0.113.80', '63'],
    ['Arriving at example.net', '198.51.100.23', '203.0.113.80', '60'],
    ['Reply, at your router', '203.0.113.80', '198.51.100.23', '61'],
    ['Reply, at the laptop', '203.0.113.80', '192.168.1.100', '60'],
  ]);
  expect(cells('dhcp', 'settings')).toEqual([
    ['Address', '192.168.1.100', 'In use'],
    ['Mask', '255.255.255.0', 'In use'],
    ['Router', '192.168.1.1', 'In use'],
    ['DNS', '192.0.2.53', 'In use'],
    ['Lease', '24 hours, renewed', 'In use'],
  ]);
  expect(cells('icmp', 'answers')).toEqual([
    ['ping', '203.0.113.80', 'Echo reply', '31 ms'],
    ['TTL 1', '192.168.1.1', 'Time exceeded', '1 ms'],
    ['TTL 2', '198.51.100.1', 'Time exceeded', '9 ms'],
    ['TTL 3', '198.51.100.129', 'Time exceeded', '18 ms'],
    ['TTL 4', '203.0.113.1', 'Time exceeded', '27 ms'],
    ['TTL 5', '203.0.113.80', 'Echo reply', '31 ms'],
    ['ping .99', '203.0.113.1', 'Unreachable', '3 s'],
  ]);
  // Nobody at .99: a miss, in words and the neutral style.
  expect(tableAfter('icmp', 'answers').missed).toEqual(['ping .99']);
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
  // Deleted at QUIT: POP3 leaves the mailbox empty, and its letters on the laptop.
  expect(cells('pop3', 'mailbox')).toEqual([
    ['1', '4.1 KB', 'Deleted'],
    ['2', '18 KB', 'Deleted'],
  ]);
  expect(cells('imap', 'inbox')).toEqual([
    ['1', 'news@example.com', 'This week’s tips', '\\Seen'],
    ['2', 'sam@example.org', 'Re: Saturday?', '\\Seen'],
    ['3', 'jo@example.org', 'Photos from Saturday', 'unread'],
  ]);
  expect(cells('ftp', 'readable')).toEqual([
    ['Greeting', 'the server’s name and software'],
    ['USER', 'your user name: alex'],
    ['PASS', 'your password: sunflower7'],
    ['227 reply', 'the data port, 50000'],
    ['STOR', 'the file’s name: report.pdf'],
    ['The file', 'all of report.pdf'],
  ]);
  // The mockup marks the password and the file: look here. They are exposed, not missing, and the table says so.
  expect(tableAfter('ftp', 'readable').missed).toEqual(['PASS', 'The file']);
  const marked = internet.units.flatMap((u) => (u.scene.panel?.type === 'table' && u.scene.panel.table.markLabel !== undefined ? [u.scene.panel.table] : []));
  expect(marked.map((t) => [t.id, t.markLabel])).toEqual([['readable', 'exposed']]);
  expect(cells('ssh', 'agreed')).toEqual([
    ['Version', 'SSH 2.0'],
    ['Key exchange', 'sntrup761x25519-sha512'],
    ['Cipher', 'chacha20-poly1305'],
    ['Host key', 'ssh-ed25519, matches known_hosts'],
    ['Login', 'alex, with a key'],
    ['Channel', 'session 0, a shell'],
  ]);
  expect(cells('tls', 'handshake')).toEqual([
    ['Name asked for', 'techconcepts.app'],
    ['Version', 'TLS 1.3'],
    ['Cipher suite', 'TLS_AES_128_GCM_SHA256'],
    ['Key exchange', 'X25519'],
    ['Name on certificate', 'techconcepts.app ✓'],
    ['Signed by', 'a CA the laptop trusts ✓'],
    ['Server owns that key', 'yes ✓'],
    ['Handshake', 'complete and untouched ✓'],
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
      'seen',
      'What someone watching can see',
      'between you and the site',
      'message',
      [['Message', false], ['They can see', true]],
      'Nothing yet. Nothing has been sent.',
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
      'voice',
      'Voice packets',
      'in both directions',
      // Both ways count from 1, so no column it shows tells its rows apart: it hides its key, a field none shows.
      'id',
      [['Packet', false], ['Way', true], ['Status', true]],
      'Nothing yet. The call hasn’t started.',
    ],
    [
      'written',
      'What’s written on the packet',
      'as it travels',
      'where',
      [['Where', false], ['From', false], ['To', false], ['TTL', false]],
      'No packet yet. The laptop is deciding where to send it.',
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
      'settings',
      'Your laptop’s settings',
      'from the router',
      'setting',
      [['Setting', false], ['Value', false], ['Status', true]],
      'Nothing yet. The laptop has no settings for this network.',
    ],
    [
      'answers',
      'What came back',
      'for each probe',
      'probe',
      [['Probe', false], ['From', false], ['Answer', true], ['Time', false]],
      'Nothing yet. No probe has been sent.',
    ],
    [
      'trip',
      'The letter’s trip',
      'one handover at a time',
      'leg',
      [['Leg', false], ['From', true], ['To', true], ['Result', false]],
      'Not sent yet. The letter is still on the laptop.',
    ],
    [
      'mailbox',
      'Your mailbox on the server',
      'as POP3 sees it',
      'letter',
      [['Letter', false], ['Size', false], ['Status', true]],
      'Not checked yet. The app hasn’t asked what’s there.',
    ],
    [
      'inbox',
      'Your inbox, on the server',
      'the same from every device',
      'number',
      [['#', false], ['From', true], ['Subject', true], ['Flags', true]],
      'Not opened yet. The app hasn’t looked in the inbox.',
    ],
    [
      'readable',
      'What someone watching can read',
      'FTP has no seal',
      'message',
      [['Message', false], ['They can read', true]],
      'Nothing yet. Nothing has been sent.',
    ],
    [
      'agreed',
      'What the two sides agreed',
      'for this session',
      'item',
      [['Item', false], ['Agreed', false]],
      'Nothing yet. The two sides haven’t spoken.',
    ],
    [
      'handshake',
      'The handshake so far',
      'what each side has said and checked',
      'item',
      [['Item', false], ['Value', true]],
      'Nothing yet. The TCP line is open, but neither side has said hello.',
    ],
  ]);
  // Only UDP's says its key is hidden; every other table keys on a column it shows.
  expect(tables.filter((t) => t?.hiddenKey === true).map((t) => t!.id)).toEqual(['voice']);
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
    ['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Web server 198.51.100.7'],
    ['Laptop 192.168.1.100', 'Web server 203.0.113.80'],
    ['Laptop 192.168.1.100', 'Voice server 203.0.113.90'],
    // The provider's router is the one ICMP finds at hop 2: IP's own messages never name its address.
    ['Laptop 192.168.1.100', 'Your router 192.168.1.1', 'Provider’s router 198.51.100.1', 'example.net 203.0.113.80'],
    ['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Root server 192.0.2.10', '.app server 192.0.2.20', 'ns1.techconcepts.app 198.51.100.40'],
    // The laptop has no IP address until the end, so it goes by its MAC, as in lesson 10.
    ['Laptop 00:00:5E:00:53:10', 'Your router 192.168.1.1'],
    [
      'Laptop 192.168.1.100',
      'Your router 192.168.1.1',
      'Provider’s router 198.51.100.1',
      'Core router 198.51.100.129',
      'example.net’s router 203.0.113.1',
      'example.net 203.0.113.80',
    ],
    ['Laptop 192.168.1.100', 'DNS resolver 192.0.2.53', 'Your mail server 203.0.113.60', 'Sam’s mail server 198.51.100.88'],
    ['Laptop 192.168.1.100', 'Your mailbox 203.0.113.70'],
    // The new letter comes in from the internet, from the address its delivery is logged from.
    ['Laptop 192.168.1.100', 'Your mailbox 203.0.113.70', 'The internet 198.51.100.88'],
    ['Laptop 192.168.1.100', 'File server 203.0.113.21'],
    ['Laptop 192.168.1.100', 'Server 203.0.113.22'],
    ['Laptop 192.168.1.100', 'Web server 198.51.100.7'],
  ]);
  expect(internet.units.map((u) => [u.scene.title, u.scene.labels])).toEqual([
    ['Your browser asks a web server for a page', { laptop: 'Wants example.net', url: 'example.net' }],
    ['The same asking and answering, sealed on the way', { laptop: 'Wants techconcepts.app', url: 'techconcepts.app' }],
    ['A page arrives whole, though a piece got lost', { laptop: 'Wants a page', url: 'example.net' }],
    ['Your voice goes out in small packets, unchecked', { laptop: 'In a call with Sam', url: 'Call' }],
    [
      'One packet, passed from router to router',
      { laptop: 'Sending a packet', url: 'example.net', router: '192.168.1.1 inside\n198.51.100.23 outside' },
    ],
    ['The resolver asks its way down the name', { laptop: 'Wants techconcepts.app', url: 'techconcepts.app' }],
    [
      'Your laptop joins the network and gets an address',
      { laptop: 'Joining the Wi-Fi', laptopAddr: 'no address yet', url: 'No network', router: '192.168.1.1\nhands out addresses' },
    ],
    ['Ping and traceroute check the way to example.net', { laptop: 'Running ping', url: 'Terminal' }],
    ['Your letter goes to your mail server, then to Sam’s', { laptop: 'Sending to sam@example.org', url: 'Mail' }],
    ['Your mail app empties the mailbox onto your laptop', { laptop: 'Checking mail', url: 'Mail' }],
    ['Your mail stays on the server, in sync', { laptop: 'Checking mail', url: 'Mail' }],
    ['One line for commands, another for the file', { laptop: 'Uploading report.pdf', url: 'Files' }],
    ['A sealed line for typing on a faraway server', { laptop: 'Opening a terminal', url: 'Terminal' }],
    ['The handshake that seals a line, step by step', { laptop: 'Wants a sealed line', url: 'techconcepts.app' }],
  ]);
});

test('every glyph the log shows has a word in its legend: a lost message, a broadcast', () => {
  // The log draws a message's outcome when it did not get through, else its kind; colour is never the only signal.
  for (const u of internet.units) {
    const shown = new Set(messagesOf(u).map((m) => (m.outcome === 'dropped' ? 'dropped' : m.kind)));
    const explained = new Set(u.scene.log.legend.map((l) => l.kind));
    for (const kind of shown) expect(explained.has(kind), `${u.id}: ${kind}`).toBe(true);
  }
  expect(internet.units.map((u) => u.scene.log.legend.slice(2))).toEqual([
    [],
    [],
    [{ kind: 'dropped', label: 'Lost on the way' }],
    [{ kind: 'dropped', label: 'Lost on the way' }],
    // ARP's call to everyone, and DHCP's Discover and Request, are broadcasts.
    [{ kind: 'broadcast', label: 'Broadcast to everyone' }],
    [],
    [{ kind: 'broadcast', label: 'Broadcast to everyone' }],
    [],
    [],
    // POP3, IMAP, FTP, SSH and TLS send only requests and replies.
    [],
    [],
    [],
    [],
    [],
  ]);
});

test('example hardware addresses are the documentation range, 00:00:5E:00:53:xx, or everyone’s', () => {
  // The mockup's IP and DHCP use 02:1a:2b:3c:4d:5e and 02:aa:bb:cc:dd:01; every lesson uses RFC 7042's range
  // instead (launch §5), as lesson 10 does for the same laptop and router.
  const macs = textsOf(internet).flatMap((text) => text.match(/\b[0-9a-f]{2}(?::[0-9a-f]{2}){5}\b/gi) ?? []);
  expect(new Set(macs)).toEqual(new Set(['00:00:5E:00:53:10', '00:00:5E:00:53:01', 'ff:ff:ff:ff:ff:ff']));
  expect(textsOf(internet).join(' ')).not.toMatch(/02:1a:2b|02:aa:bb/);
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
    [
      { label: 'RFC 2818: HTTP Over TLS', url: 'https://www.rfc-editor.org/rfc/rfc2818' },
      { label: 'RFC 9110: HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
    ],
    [{ label: 'RFC 9293: Transmission Control Protocol (TCP)', url: 'https://www.rfc-editor.org/rfc/rfc9293' }],
    [{ label: 'RFC 768: User Datagram Protocol', url: 'https://www.rfc-editor.org/rfc/rfc768' }],
    [{ label: 'RFC 791: Internet Protocol', url: 'https://www.rfc-editor.org/rfc/rfc791' }],
    [
      { label: 'RFC 1034: Domain Names, Concepts and Facilities', url: 'https://www.rfc-editor.org/rfc/rfc1034' },
      { label: 'RFC 1035: Domain Names, Implementation and Specification', url: 'https://www.rfc-editor.org/rfc/rfc1035' },
    ],
    [{ label: 'RFC 2131: Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' }],
    [{ label: 'RFC 792: Internet Control Message Protocol', url: 'https://www.rfc-editor.org/rfc/rfc792' }],
    [{ label: 'RFC 5321: Simple Mail Transfer Protocol', url: 'https://www.rfc-editor.org/rfc/rfc5321' }],
    [{ label: 'RFC 1939: Post Office Protocol, Version 3', url: 'https://www.rfc-editor.org/rfc/rfc1939' }],
    [{ label: 'RFC 9051: Internet Message Access Protocol (IMAP), Version 4rev2', url: 'https://www.rfc-editor.org/rfc/rfc9051' }],
    [{ label: 'RFC 959: File Transfer Protocol', url: 'https://www.rfc-editor.org/rfc/rfc959' }],
    [
      { label: 'RFC 4251: The Secure Shell (SSH) Protocol Architecture', url: 'https://www.rfc-editor.org/rfc/rfc4251' },
      { label: 'RFC 4253: The Secure Shell (SSH) Transport Layer Protocol', url: 'https://www.rfc-editor.org/rfc/rfc4253' },
    ],
    [{ label: 'RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446' }],
  ]);
  // Some RFCs the facts name are not among the sources the plan drafted: HTTPS's RFC 8446 (TLS 1.3, the TLS part's
  // own source), IP's RFC 8200 (IPv6), and the two of SSH's "RFC 4251 to 4254" it does not cite, 4252 (logging in)
  // and 4254 (channels). The owner reviews the sources with the built lesson.
  const uncited: Record<string, string[]> = { https: ['RFC 8446'], ip: ['RFC 8200'], ssh: ['RFC 4252', 'RFC 4254'] };
  /** Each RFC a fact names, a range ("RFC 4251 to 4254") one by one. */
  const rfcsIn = (value: string) =>
    [...value.matchAll(/RFC (\d+)(?: to (\d+))?/g)].flatMap(([, from, to = from]) =>
      Array.from({ length: Number(to) - Number(from) + 1 }, (_, i) => `RFC ${Number(from) + i}`),
    );
  expect(rfcsIn('RFC 4251 to 4254, RFC 9110')).toEqual(['RFC 4251', 'RFC 4252', 'RFC 4253', 'RFC 4254', 'RFC 9110']);
  for (const u of internet.units) {
    const named = rfcsIn(u.learn.facts.find((f) => f.label === 'Defined in')!.value);
    expect(named.length, u.id).toBeGreaterThan(0);
    const missing = named.filter((rfc) => !u.references.some((r) => r.label.startsWith(`${rfc}:`)));
    expect(missing, u.id).toEqual(uncited[u.id] ?? []);
  }
});

test('each “lesson N” and lesson title names a lesson of the track, and each “The X part” is a protocol of this lesson', () => {
  // DHCP points at lesson 10, DHCP, twice, in its overview and its Go deeper; IP at the Subnetting lesson.
  expect(lessonNumbers(internet).map(({ n }) => n)).toEqual([10, 10]);
  expect(misnamedLessons(internet, { dhcp: 'DHCP' })).toEqual([]);
  expect(lessonTitles(internet)).toEqual(['Subnetting', 'DHCP', 'DHCP']);
  const titles = getEntries('networking').map((e) => e.title);
  for (const title of lessonTitles(internet)) expect(titles).toContain(title);
  const parts = textsOf(internet).flatMap((text) => [...text.matchAll(/\bThe (\w+) part\b/g)].map((m) => m[1]!.toLowerCase()));
  expect(parts).toEqual(['dns', 'tcp', 'dns', 'tls', 'tls']);
  for (const id of parts) expect(UNIT_ORDER).toContain(id);
});

test('no prose is left with the mockup’s markup: bold is **term**, and no tag or entity is left', () => {
  for (const text of textsOf(internet)) {
    expect(text, text).not.toMatch(/<\/?(b|span|i|em)\b|&(lt|gt|amp|quot|#\d+);/);
  }
});

// ---------------------------------------------------------------- the map, as the console shows it

// The sweep shows the map about 1,100 times and compares it with a fresh copy at 198 moments: some 8 s under jsdom.
test('show draws every moment of the lesson, forwards, backwards and jumping, as a fresh driver draws it', { timeout: 60_000 }, () => {
  // Every position (each unit's steps, plus its Overview, Learn and Practice) and every event of every step once more.
  const events = internet.units.reduce((sum, u) => sum + u.steps.reduce((n, s) => n + s.events.length, 0), 0);
  expect(showSweep(internet)).toBe(slotsFor(internet).length + events);
});

/** The view at position `p` once `n` of its events have played (all of them when `n` is left out). */
function viewAt(p: number, n = stepEvents(internet, p).length) {
  return sceneViewOf(internet.units[slotsFor(internet)[p]!.unit]!, deriveState(internet, p, n));
}

/** What show leaves on the map: the layers shown, the trays and padlock lit, the lines, and the laptop's words. */
function mapState(root: SVGSVGElement) {
  return {
    // Each layer is drawn in a group per slot of the figure (under the cables, the bodies, the callouts).
    layers: [...new Set([...root.querySelectorAll<SVGElement>('[data-layer]')].filter((g) => g.getAttribute('display') !== 'none').map((g) => g.dataset.layer))],
    lit: [...root.querySelectorAll<SVGElement>('.nm-hold.on')].map((el) => el.id),
    conns: [...root.querySelector('#nm-conns')!.children].map((line) => [line.getAttribute('class'), line.getAttribute('points')]),
    status: [root.querySelector('#nm-lapState')!.textContent, root.querySelector('#nm-lapState')!.getAttribute('class')],
    addr: root.querySelector('#nm-lapAddr')!.textContent,
    url: root.querySelector('#nm-url')!.textContent,
    // The home router's callout: hidden unless the unit gives it lines (IP and DHCP).
    router: [
      root.querySelector('#nm-router')!.getAttribute('display'),
      ...['#nm-router-1', '#nm-router-2'].map((id) => [root.querySelector(id)!.textContent, root.querySelector(id)!.getAttribute('class')]),
    ],
  };
}

test('the first position shows HTTP alone, and the last TLS closed; each unit’s Overview shows its own start', () => {
  const { root, driver } = mountMap();
  const positions = slotsFor(internet).length;

  // The first position, as a driver that has shown nothing else draws it.
  const fresh = mountMap();
  fresh.driver.show(viewAt(0, 0));
  const first = mapState(fresh.root);
  expect(first).toMatchObject({ layers: ['http:web'], lit: [], conns: [], status: ['Wants example.net', 'nm-state'] });
  expect(first.router[0]).toBe('none');

  // TLS's Practice, the last position, shows its own layer, its page, and its line closed after close_notify.
  driver.show(viewAt(positions - 1));
  const last = mapState(root);
  expect(last).toMatchObject({ layers: ['tls:web'], conns: [], status: ['Closed safely', 'nm-state done'] });
  expect(last).not.toEqual(first);
  // Straight back to the first position: the same map as the fresh driver's (the sweep compares the markup).
  driver.show(viewAt(0, 0));
  expect(mapState(root)).toEqual(first);

  // Each unit's Overview shows its own start and nothing else, whichever position was shown before it: letters
  // waiting for POP3 and IMAP, TLS's open line, and nothing for the other eleven.
  const starts = internet.units.map((u, i) => {
    const overview = positionOf(internet, i, 'overview');
    const seen = [overview - 1, positions - 1, 0].filter((p) => p >= 0).map((before) => {
      driver.show(viewAt(before));
      driver.show(viewAt(overview, 0));
      return { lit: shownLit(root), conns: mapState(root).conns.map(([cls]) => cls) };
    });
    fresh.driver.show(viewAt(overview, 0));
    expect(seen, u.id).toEqual(seen.map(() => ({ lit: shownLit(fresh.root), conns: mapState(fresh.root).conns.map(([cls]) => cls) })));
    return [u.id, seen[0]];
  });
  expect(Object.fromEntries(starts.filter(([, s]) => JSON.stringify(s) !== JSON.stringify({ lit: [], conns: [] })))).toEqual({
    pop3: { lit: ['nm-pop3-hold-mail'], conns: [] },
    imap: { lit: ['nm-imap-hold-mail'], conns: [] },
    tls: { lit: [], conns: ['nm-conn'] },
  });
});

/** The trays and padlock lit on the plates the map shows (a hidden layer's tray may share a lit site). */
const shownLit = (root: SVGSVGElement): string[] =>
  [...root.querySelectorAll<SVGElement>('.nm-hold.on')].filter((el) => el.closest('[data-layer][display="none"]') === null).map((el) => el.id);

/** How many of position `p`'s events have played once its first message tagged `tag` has. */
function playedThrough(p: number, tag: string): number {
  const at = stepEvents(internet, p).findIndex((e) => e.type === 'message' && e.tag === tag);
  if (at === -1) throw new Error(`No message "${tag}" at position ${p}.`);
  return at + 1;
}

test('POP3 and IMAP start with letters waiting, and TLS with its line open, from the Overview on; leaving clears them', () => {
  const { root, driver } = mountMap();
  const showAt = (id: string, kind: 'overview' | 'step' | 'learn' | 'practice', step = 1, through?: string) => {
    const p = positionOf(internet, indexOf(id), kind, step);
    const view = sceneViewOf(unitById(id), deriveState(internet, p, through === undefined ? 0 : playedThrough(p, through)));
    driver.show(view);
    return view;
  };
  const conns = () => mapState(root).conns.map(([cls]) => cls);
  // The mockup's hold0 and conn0, as each scene's start; no other unit has one.
  expect(internet.units.filter((u) => u.scene.start.length > 0).map((u) => [u.id, u.scene.start])).toEqual([
    ['pop3', [{ cue: 'tray', arg: 'mail on' }]],
    ['imap', [{ cue: 'tray', arg: 'mail on' }]],
    ['tls', [{ cue: 'conn', arg: 'open laptop>web' }]],
  ]);

  // At the Overview nothing has played, so what the map shows is the start alone.
  for (const id of ['pop3', 'imap']) {
    const view = showAt(id, 'overview');
    expect([view.cues, view.start], id).toEqual([[], [{ cue: 'tray', arg: 'mail on' }]]);
    expect(shownLit(root), id).toEqual([`nm-${id}-hold-mail`]);
  }
  // POP3's letters wait, marked for deleting, until the server's goodbye after QUIT; IMAP's stay on the server.
  showAt('pop3', 'step', 5, 'QUIT');
  expect(shownLit(root)).toEqual(['nm-pop3-hold-mail']);
  showAt('pop3', 'step', 5, '+OK BYE');
  expect(shownLit(root)).toEqual([]);
  showAt('pop3', 'learn');
  expect(shownLit(root)).toEqual([]);
  showAt('imap', 'practice');
  expect(shownLit(root)).toEqual(['nm-imap-hold-mail']);
  // FTP, next, has no letters.
  showAt('ftp', 'overview');
  expect(root.querySelectorAll('.nm-hold.on')).toHaveLength(0);

  // TLS's line is open before its ClientHello, unsealed.
  expect(showAt('tls', 'overview').cues).toEqual([]);
  expect(conns()).toEqual(['nm-conn']);
  showAt('tls', 'step', 1, 'CLIENT HELLO');
  expect(conns()).toEqual(['nm-conn']);
  // Its seal needs no open of its own: the start opened the line.
  expect(deriveState(internet, positionOf(internet, indexOf('tls'), 'learn'), 0).cues.filter((c) => c.cue === 'conn').map((c) => c.arg)).toEqual([
    'seal laptop>web',
    'close laptop>web',
  ]);
  // SSH, before it, and HTTP, the first, start with no line.
  showAt('ssh', 'overview');
  expect(conns()).toEqual([]);
  showAt('tls', 'step', 1);
  driver.show(viewAt(0, 0));
  expect(conns()).toEqual([]);
});

test('FTP draws its data line dashed and closes it; SSH and TLS seal their connections', () => {
  const { root, driver } = mountMap();
  /** The conn cues the derived state has applied, through the message tagged `through` (all the step's, by default), once shown. */
  const applied = (id: string, kind: 'step' | 'learn', step = 1, through?: string) => {
    const p = positionOf(internet, indexOf(id), kind, step);
    const derived = deriveState(internet, p, through === undefined ? stepEvents(internet, p).length : playedThrough(p, through));
    driver.show(sceneViewOf(unitById(id), derived));
    return derived.cues.filter((c) => c.cue === 'conn').map((c) => c.arg);
  };
  /** The lit lines: each one's classes, and whether it is drawn above the cable. */
  const lines = () => [...root.querySelector('#nm-conns')!.children].map((line) => [line.getAttribute('class'), line.getAttribute('transform')]);
  // The data line's class is the dashed one (net-map.test.ts holds the CSS to it).
  // FTP: the control line, then a second, data line beside it, dashed and drawn just above.
  expect(applied('ftp', 'step', 1)).toEqual(['open laptop>files']);
  expect(lines()).toEqual([['nm-conn', null]]);
  expect(applied('ftp', 'step', 4)).toEqual(['open laptop>files', 'open laptop>files data']);
  expect(lines()).toEqual([
    ['nm-conn', null],
    ['nm-conn alt', 'translate(0 -6)'],
  ]);
  // The file crosses, and closing the data line marks its end: the control line stays for the 226.
  expect(applied('ftp', 'step', 5, 'FILE')).toEqual(['open laptop>files', 'open laptop>files data']);
  expect(lines()).toHaveLength(2);
  expect(applied('ftp', 'step', 5, 'FIN').at(-1)).toBe('close laptop>files data');
  expect(lines()).toEqual([['nm-conn', null]]);
  // QUIT closes the control line too.
  expect(applied('ftp', 'learn').at(-1)).toBe('close laptop>files');
  expect(lines()).toEqual([]);

  // SSH: open from the TCP hello; the laptop's NEWKEYS leaves it as it is, the server's seals it, and it stays sealed.
  expect(applied('ssh', 'step', 3, 'NEWKEYS')).toEqual(['open laptop>host']);
  expect(lines()).toEqual([['nm-conn', null]]);
  expect(applied('ssh', 'step', 3)).toEqual(['open laptop>host', 'seal laptop>host']);
  expect(lines()).toEqual([['nm-conn sealed', null]]);
  expect(applied('ssh', 'learn')).toEqual(['open laptop>host', 'seal laptop>host']);
  expect(lines()).toEqual([['nm-conn sealed', null]]);

  // TLS: the line it starts with is sealed by the browser's Finished, stays sealed for the page, and closes after
  // close_notify both ways.
  expect(applied('tls', 'step', 4, 'FINISHED')).toEqual([]);
  expect(lines()).toEqual([['nm-conn', null]]);
  expect(applied('tls', 'step', 4)).toEqual(['seal laptop>web']);
  expect(lines()).toEqual([['nm-conn sealed', null]]);
  expect(applied('tls', 'step', 5)).toEqual(['seal laptop>web']);
  expect(lines()).toEqual([['nm-conn sealed', null]]);
  expect(applied('tls', 'learn')).toEqual(['seal laptop>web', 'close laptop>web']);
  expect(lines()).toEqual([]);
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

test('HTTPS ends with the padlock on: its last event leaves the lock cue applied, and show lights the padlock', () => {
  const { root, driver } = mountMap();
  const https = unitById('https');
  const padlock = () => root.querySelector('#nm-hold-lock')!.classList.contains('on');
  const lastStep = positionOf(internet, indexOf('https'), 'step', https.steps.length);
  const events = stepEvents(internet, lastStep);
  const locks = (n: number) => deriveState(internet, lastStep, n).cues.filter((c) => c.cue === 'lock');
  // Once the last event has played, the padlock's cue is among those applied: once, from the stylesheet's arrival.
  expect(events.at(-1)).toMatchObject({ type: 'message', tag: 'TICKET' });
  expect(locks(events.length)).toEqual([{ cue: 'lock', eventId: 'm12', current: true }]);
  driver.show(sceneViewOf(https, deriveState(internet, lastStep, events.length)));
  expect(padlock()).toBe(true);
  // It stays on through Learn and Practice.
  for (const kind of ['learn', 'practice'] as const) {
    driver.show(sceneViewOf(https, deriveState(internet, positionOf(internet, indexOf('https'), kind), 0)));
    expect(padlock(), kind).toBe(true);
  }
  // Not before: the line is sealed from the TLS handshake on, but the padlock waits until the page has loaded.
  expect(locks(0)).toEqual([]);
  driver.show(sceneViewOf(https, deriveState(internet, lastStep, 0)));
  expect(padlock()).toBe(false);
  // And the next protocol starts without it.
  driver.show(viewAt(slotsFor(internet).findIndex((s) => s.unit === indexOf('tcp'))));
  expect(padlock()).toBe(false);
});

test('ICMP: each probe that stops on a router lights that router as it lands, and only that one', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  try {
    const { root, driver } = mountMap();
    const icmp = unitById('icmp');
    // The internet's routers, and your own at home, where traceroute's first probe stops.
    const routers = NET_MAP_BASE_PLACES.filter((p) => p !== 'laptop' && p !== 'resolver');
    const lit = () => routers.filter((r) => root.querySelector(`#nm-busy-${r}`)!.classList.contains('on'));
    const stops: string[] = [];
    for (let step = 1; step <= icmp.steps.length; step++) {
      const p = positionOf(internet, indexOf('icmp'), 'step', step);
      for (const [n, event] of stepEvents(internet, p).entries()) {
        if (event.type !== 'message' || !routers.includes(event.to)) continue;
        const at = `${event.tag} > ${event.to}`;
        stops.push(at);
        const before = viewAt(p, n);
        driver.show(before);
        expect(lit(), at).toEqual([]);
        // Under reduced motion the tag lands at once, then rests there as long as the mockup rests.
        const played = driver.play(event, before, { speed: 1, reducedMotion: true, signal: new AbortController().signal });
        await vi.advanceTimersByTimeAsync(0);
        expect(lit(), at).toEqual([event.to]);
        await vi.runAllTimersAsync();
        await played;
        expect(lit(), at).toEqual([]);
      }
    }
    // Hop by hop: your router, your provider's, the core, example.net's; then the ping to .99 stops at example.net's.
    expect(stops).toEqual(['TTL 1 > router', 'TTL 2 > isp', 'TTL 3 > b', 'TTL 4 > c', 'ECHO REQUEST > c']);
  } finally {
    vi.useRealTimers();
  }
});

test('ICMP in motion: a probe’s router lights when the probe lands there, not as it sets off or on the way', async () => {
  // Animation frames and the clock they read are faked with the timers, so the tween and the rest keep one time.
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  try {
    const { root, data, driver } = mountMap();
    const p = positionOf(internet, indexOf('icmp'), 'step', 5);
    const n = stepEvents(internet, p).findIndex((e) => e.type === 'message' && e.tag === 'TTL 3');
    const probe = stepEvents(internet, p)[n] as MessageEvent;
    expect(`${probe.tag} > ${probe.to}`).toBe('TTL 3 > b');
    const lit = () => root.querySelector(`#nm-busy-${probe.to}`)!.classList.contains('on');
    const total = netMapDriver.duration(probe, data);
    const before = viewAt(p, n);
    driver.show(before);
    const played = driver.play(probe, before, { speed: 1, reducedMotion: false, signal: new AbortController().signal });
    expect(lit()).toBe(false);
    // Halfway through its time the probe is still on the cables: its rest at the far end is under half of it.
    await vi.advanceTimersByTimeAsync(total / 2);
    expect(lit()).toBe(false);
    // By the end of its time it has landed, and its router is lit for the rest.
    await vi.advanceTimersByTimeAsync(total / 2 - 1);
    expect(lit()).toBe(true);
    // Then the rest is over, a frame or so later, and the map lets go.
    await vi.advanceTimersByTimeAsync(20);
    await played;
    expect(lit()).toBe(false);
  } finally {
    vi.useRealTimers();
  }
});

test('IP and DHCP give the home router its callout, and DHCP’s laptop has no address until the router lends it one', () => {
  const { root, driver } = mountMap();
  const router = () => mapState(root).router;
  const at = (id: string, kind: 'overview' | 'step' | 'learn', step = 1, played = 0) =>
    driver.show(sceneViewOf(unitById(id), deriveState(internet, positionOf(internet, indexOf(id), kind, step), played)));
  // The mockup's lines under "Your router": a line with a number is an address, a line of words a note.
  at('ip', 'overview');
  expect(router()).toEqual([null, ['192.168.1.1 inside', 'nm-addr'], ['198.51.100.23 outside', 'nm-addr']]);
  at('dhcp', 'overview');
  expect(router()).toEqual([null, ['192.168.1.1', 'nm-addr'], ['hands out addresses', 'nm-sub']]);
  expect(mapState(root)).toMatchObject({ addr: 'no address yet', url: 'No network', status: ['Joining the Wi-Fi', 'nm-state'] });
  // An offer is not yet a gift: the address comes with the router's ACK.
  at('dhcp', 'step', 4, 1);
  expect(mapState(root)).toMatchObject({ addr: 'no address yet', url: 'No network' });
  at('dhcp', 'step', 5, 1);
  expect(mapState(root)).toMatchObject({ addr: '192.168.1.100', url: 'Connected', status: ['On the network', 'nm-state done'] });
  // The units that give no lines hide the callout again.
  at('icmp', 'overview');
  expect(router()[0]).toBe('none');
});
