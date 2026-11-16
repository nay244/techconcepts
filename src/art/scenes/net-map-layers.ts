// The server plates How the Internet Works draws on its network map (src/art/scenes/net-map.ts), one layer per
// protocol and server, keyed `<protocol>:<site>`. Each is the `scene.servers` entry of its protocol in the approved
// mockup's FIGS/protocols.mjs, protocols-core.mjs and protocols-apps.mjs, word for word. The map draws every layer,
// hidden; a unit's `scene.layers` names the ones it shows. This file is data only, so the lesson validator can read
// the map's places and layers (parts.ts), and the driver the few facts it shares with the drawing, without drawing it.

/** A line of a server's callout: its name, or an address. */
export interface CalloutLine {
  cls: 'nm-name' | 'nm-addr';
  text: string;
}

interface PlateBase {
  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it, N for a small one behind the internet, NW for one where the resolver stands (a map that shows it hides the resolver). */
  slot: 'E' | 'SE' | 'N' | 'NE' | 'NW';
  /** A part of the map the plate is drawn in, hidden until a `show` cue shows it (`NET_MAP_OPTIONAL`). */
  part?: string;
  /** The words engraved on the plate's front edge. */
  label: string;
  /** A sentence the figure's description adds while the layer is shown. It draws nothing. */
  describe?: string;
  /** The callout under the plate, or where `at` puts it. */
  lines: CalloutLine[];
  /** Where the callout's first line starts, on the figure, when it is not under the right-hand plate. */
  at?: [number, number];
  /** The callout's lines end at `at` rather than start there. */
  align?: 'end';
}

/**
 * A server plate. A web server, a mail server and any other host each have one site, the place a message stops on
 * it; the name servers have three, one for each server DNS asks in turn (`NAME_SERVER_SITES`).
 */
export type ServerPlate =
  | (PlateBase & { kind: 'web' | 'host'; site: string })
  | (PlateBase & {
      kind: 'mail';
      site: string;
      /** The internet router its cable runs to. */
      puck: 'c' | 'd';
      /** The callout points at the top of its rack, not the plate's front corner. */
      anchorTop?: boolean;
    })
  | (PlateBase & {
      kind: 'pc' | 'call';
      site: string;
      /** The internet router its cable runs to. */
      puck: 'a';
    })
  | (PlateBase & { kind: 'names' })
  | (PlateBase & {
      kind: 'proxy';
      site: string;
      /** The internet routers its two cables run to: in, from your side (isp), and out, toward the sites it reaches for you (c). */
      pucks: ['isp', 'c'];
    })
  | (PlateBase & {
      kind: 'site';
      /** The web server (its racks and the page's dock, as a web plate draws them), and the reverse proxy in front of it, on its cable in. */
      site: string;
      front: string;
      /** The callouts while the reverse proxy is shown: its own, and the web server's behind it. */
      behind: CalloutLine[][];
    });

/** The root servers, the servers for .app, and the site's own name server, as the names plate draws them. */
export const NAME_SERVER_SITES = ['root', 'tld', 'auth'];

/** The longest tag label the map has a tag for. A longer one rides on the widest tag. */
export const NET_MAP_TAG_MAX = 16;

/** The laptop's address as the map draws it, before a unit's labels or an `addr` cue change it. */
export const NET_MAP_LAPTOP_ADDR = '192.168.1.100';

/** The places every protocol's map has: home (the laptop, its router and the phone, which a unit shows), the resolver, and the internet's five routers. */
export const NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd', 'phone'];

/** The parts the map leaves off until a start shows them (`show phone`; Proxies' `show proxy` and `show reverse`). */
export const NET_MAP_OPTIONAL = ['phone', 'proxy', 'reverse'];

/** The parts a start may leave off the map (`hide`): the resolver, a shown forward proxy, and the web server's own callout. */
export const NET_MAP_HIDEABLE = ['resolver', 'proxy', 'direct'];

/** What the figure's description adds while an optional part is shown. */
export const NET_MAP_PART_SENTENCES: Record<string, string> = {
  proxy: 'Behind the internet, a forward proxy, with one cable in from the internet and one out.',
  reverse: 'In front of the web server, on its cable in, the site’s reverse proxy.',
};

/**
 * The grammar of a net-map `conn` cue's argument, read by the driver (`parseConn`) and the validator:
 * `<open|seal|close> <from>>[<via>>]<to>[ data]`. Groups: action, from, via, to, data.
 */
export const NET_MAP_CONN_GRAMMAR = /^(open|seal|close) ([a-z0-9-]+)>(?:([a-z0-9-]+)>)?([a-z0-9-]+)( data)?$/;

/** The phone's address as the map draws it. */
export const NET_MAP_PHONE_ADDR = '192.168.1.101';

/** The internet's five routers, which a unit's labels may name on a strip and a `drop` cue may mark. */
export const NET_MAP_ROUTERS = ['isp', 'a', 'b', 'c', 'd'];

/** The cables between the internet's routers. */
export const NET_MAP_LINKS: [string, string][] = [['isp', 'a'], ['isp', 'b'], ['isp', 'd'], ['a', 'b'], ['b', 'c'], ['b', 'd'], ['c', 'd']];

/** Where a tag can wait (`park`), and how many bays each place has: four at the laptop and on the web server, one on each internet router. */
export const NET_MAP_BAY_COUNTS: Record<string, number> = { laptop: 4, web: 4, isp: 1, a: 1, b: 1, c: 1, d: 1 };

/** The places a message can stop on a plate. */
export function plateSites(plate: ServerPlate): string[] {
  return plate.kind === 'names' ? NAME_SERVER_SITES : plate.kind === 'site' ? [plate.site, plate.front] : [plate.site];
}

const line = (cls: CalloutLine['cls'], text: string): CalloutLine => ({ cls, text });
// The mockup's proto-kit.mjs helpers: a web server, any other host, and your mailbox.
const web = (label: string, addr: string): ServerPlate => ({
  kind: 'web',
  slot: 'E',
  site: 'web',
  label,
  lines: [line('nm-name', 'Web server'), line('nm-addr', addr)],
});
const host = (site: string, label: string, name: string, addr: string): ServerPlate => ({
  kind: 'host',
  slot: 'E',
  site,
  label,
  lines: [line('nm-name', name), line('nm-addr', addr)],
});
const mailbox = (port: number): ServerPlate => ({
  kind: 'mail',
  slot: 'E',
  site: 'mail',
  puck: 'c',
  label: 'MAIL.EXAMPLE.NET',
  lines: [line('nm-name', 'Your mailbox'), line('nm-addr', 'mail.example.net'), line('nm-addr', `port ${port}`)],
});

/** Every protocol's server plates, in the lesson's order. DHCP has none: it stays at home. */
export const NET_MAP_LAYERS: Record<string, ServerPlate> = {
  'http:web': web('EXAMPLE.NET', '203.0.113.80 · port 80'),
  'https:web': web('TECHCONCEPTS.APP', '198.51.100.7 · port 443'),
  'tcp:web': web('EXAMPLE.NET', '203.0.113.80 · port 80'),
  'udp:call': host('call', 'CALL.EXAMPLE.NET', 'Voice server', '203.0.113.90 · UDP'),
  'ip:web': web('EXAMPLE.NET', '203.0.113.80'),
  'dns:names': {
    kind: 'names',
    slot: 'E',
    label: 'NAME SERVERS',
    lines: [
      line('nm-name', 'Name servers'),
      line('nm-addr', 'root · 192.0.2.10'),
      line('nm-addr', '.app · 192.0.2.20'),
      line('nm-addr', 'ns1 · 198.51.100.40'),
    ],
  },
  'icmp:web': web('EXAMPLE.NET', '203.0.113.80'),
  'smtp:out': {
    kind: 'mail',
    slot: 'E',
    site: 'out',
    puck: 'c',
    label: 'SMTP.EXAMPLE.NET',
    at: [380, 6],
    anchorTop: true,
    lines: [line('nm-name', 'Your mail server'), line('nm-addr', 'smtp.example.net')],
  },
  'smtp:in': {
    kind: 'mail',
    slot: 'SE',
    site: 'in',
    puck: 'd',
    label: 'MX.EXAMPLE.ORG',
    at: [220, 280],
    lines: [line('nm-name', 'Sam’s mail server'), line('nm-addr', 'mx.example.org')],
  },
  'pop3:mail': mailbox(995),
  'imap:mail': mailbox(993),
  'ftp:files': host('files', 'FILES.EXAMPLE.NET', 'File server', '203.0.113.21 · port 21'),
  'ssh:host': host('host', 'SRV.EXAMPLE.NET', 'A server', '203.0.113.22 · port 22'),
  'tls:web': web('TECHCONCEPTS.APP', '198.51.100.7 · port 443'),
  'ports:server': host('server', 'EXAMPLE.NET', 'A server', '203.0.113.80'),
  'nat:stranger': {
    kind: 'pc',
    slot: 'N',
    site: 'stranger',
    puck: 'a',
    label: 'ANOTHER NETWORK',
    describe: 'Behind the internet, someone else’s computer, on another network.',
    at: [420, -24],
    lines: [line('nm-name', 'Someone else'), line('nm-addr', '192.0.2.66')],
  },
  'tcp-udp:voice': {
    kind: 'call',
    slot: 'N',
    site: 'voice',
    puck: 'a',
    label: 'CALL.EXAMPLE.NET',
    describe: 'Behind the internet, the voice server the call goes through.',
    at: [290, -22],
    align: 'end',
    lines: [line('nm-name', 'Voice server'), line('nm-addr', '203.0.113.90 · port 16384')],
  },
  // Proxies: techconcepts.app's web server, which a reverse proxy can stand in front of (`show reverse`), and a
  // forward proxy behind the internet, drawn only once a step's start shows it (`show proxy`).
  'proxies:site': {
    kind: 'site',
    slot: 'E',
    site: 'origin',
    front: 'reverse',
    label: 'TECHCONCEPTS.APP',
    lines: [line('nm-name', 'Web server'), line('nm-addr', '198.51.100.7 · port 443')],
    behind: [
      [line('nm-name', 'Reverse proxy'), line('nm-addr', '198.51.100.7 · port 443')],
      [line('nm-name', 'Web server'), line('nm-addr', '10.0.0.20 · port 80')],
    ],
  },
  'proxies:proxy': {
    kind: 'proxy',
    slot: 'NW',
    part: 'proxy',
    site: 'proxy',
    pucks: ['isp', 'c'],
    label: 'PROXY.EXAMPLE.NET',
    at: [300, 0],
    lines: [line('nm-name', 'Forward proxy'), line('nm-addr', '203.0.113.30')],
  },
};
