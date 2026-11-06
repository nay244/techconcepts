// The server plates How the Internet Works draws on its network map (src/art/scenes/net-map.ts), one layer per
// protocol and server, keyed `<protocol>:<site>`. Each is the `scene.servers` entry of its protocol in the approved
// mockup's FIGS/protocols.mjs, protocols-core.mjs and protocols-apps.mjs, word for word. The map draws every layer,
// hidden; a unit's `scene.layers` names the ones it shows. This file is data only, so the lesson validator can read
// the map's places and layers (parts.ts) without drawing it.

/** A line of a server's callout: its name, or an address. */
export interface CalloutLine {
  cls: 'nm-name' | 'nm-addr';
  text: string;
}

interface PlateBase {
  /** Where the plate stands: E for one big plate right of the internet, SE for a smaller one in front of it. */
  slot: 'E' | 'SE';
  /** The words engraved on the plate's front edge. */
  label: string;
  /** The callout under the plate, or where `at` puts it. */
  lines: CalloutLine[];
  /** Where the callout's first line starts, on the figure, when it is not under the right-hand plate. */
  at?: [number, number];
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
  | (PlateBase & { kind: 'names' });

/** The root servers, the servers for .app, and the site's own name server, as the names plate draws them. */
export const NAME_SERVER_SITES = ['root', 'tld', 'auth'];

/** The places every protocol's map has: home (the laptop and its router), the resolver, and the internet's five routers. */
export const NET_MAP_BASE_PLACES = ['laptop', 'router', 'resolver', 'isp', 'a', 'b', 'c', 'd'];

/** The places a message can stop on a plate. */
export function plateSites(plate: ServerPlate): string[] {
  return plate.kind === 'names' ? NAME_SERVER_SITES : [plate.site];
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
};
