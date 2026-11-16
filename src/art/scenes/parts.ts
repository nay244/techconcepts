import { NET_MAP_BASE_PLACES, NET_MAP_HIDEABLE, NET_MAP_LAYERS, NET_MAP_OPTIONAL, NET_MAP_ROUTERS, plateSites } from './net-map-layers';
import { OSI_CUE_ARGS, OSI_ROUTES, OSI_WORDS } from './osi-stacks';
import { SWITCH_PLACES, SWITCH_PLUG_ARGS, SWITCH_ROUTES } from './switch-parts';
import { POOL_PLACES, POOL_ROUTES, POOL_SERVERS } from './pool-parts';
import type { FigureId, FigureParts } from './types';

/**
 * The places, cues and layers each scene figure supports, and whether it takes
 * a board or a scene's start. Each list names only what its figure draws and
 * its driver handles, so the validator only accepts what the figure can show.
 */
export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
  // MAC Address's frames setup (D12): a TV that only listens, so no way to or from it (nor the phone) is drawn; the start's `frames` cue turns it on.
  dhcp: { places: ['laptop', 'router', 'phone', 'tv'], cues: { frames: 'flag' }, routes: ['laptop>router', 'router>laptop'], layers: [], board: false, start: true },
  subnet: {
    places: ['laptop', 'printer', 'pc', 'router', 'provider'],
    // The mockup's fx, by name: what lights, pulses, rides or spreads while a note plays (src/scenes/drivers/subnet.ts).
    cues: {
      glow: 'text',
      focus: 'text',
      'one-net': 'flag',
      cut: 'flag',
      link: 'flag',
      pulse: 'text',
      ring: 'text',
      route: 'text',
      busy: 'text',
    },
    layers: [],
    board: true,
    start: false,
  },
  firewall: {
    places: ['visitor', 'admin', 'firewall', 'web'],
    // A change to the rule list names the order it puts in (src/content/helpers/firewall-events.ts); the figure's board
    // reads the rule list itself, so the cue only says which order is in force.
    cues: { rules: 'text' },
    layers: [],
    board: false,
    start: false,
  },
  'net-map': {
    places: [...new Set([...NET_MAP_BASE_PLACES, ...Object.values(NET_MAP_LAYERS).flatMap(plateSites)])],
    // What a message leaves on the map once it lands (src/scenes/drivers/net-map.ts): the laptop's status line and its
    // style, an open connection, the page on its screen, the padlock, a letter on a tray, and its address texts.
    // A unit's scene may also start with some in place (`scene.start`): TLS's open line, POP3's and IMAP's letters.
    cues: {
      status: 'text',
      conn: 'text',
      page: 'text',
      lock: 'flag',
      tray: 'text',
      'status-known': 'flag',
      'status-done': 'flag',
      addr: 'text',
      url: 'text',
      // A router that threw a packet away keeps a DROPPED mark; a unit may start with the resolver left off the map.
      drop: 'text',
      hide: 'text',
      // A part the map leaves off until a unit's start shows it: the phone, or the café (VPN), in home's place.
      show: 'text',
      // With the café: what the one listening on its Wi-Fi makes out (VPN).
      listener: 'text',
      // A copy of the tag waits in a bay (`park <place> <bay> <TAG>`) until a message with its tag takes it, or `unpark laptop` sends the laptop's into its screen.
      park: 'text',
      unpark: 'text',
      // A new visit (Proxies, as a step begins): the page, the padlock and every lit connection go.
      fresh: 'flag',
    },
    args: { drop: NET_MAP_ROUTERS, hide: NET_MAP_HIDEABLE, show: NET_MAP_OPTIONAL, listener: ['reads', 'outside'] },
    layers: Object.keys(NET_MAP_LAYERS),
    board: false,
    // Its driver settles a unit's start under the cues that have played.
    start: true,
  },
  osi: {
    places: ['laptop', 'router', 'server'],
    // `layer` lights one block, `<place>:<n>`; `peer` lights layer `<n>` in every stack that has it and shows its
    // peer lines (src/scenes/drivers/osi.ts). Each takes only what the figure draws: the router has three layers.
    cues: { layer: 'text', peer: 'text' },
    args: OSI_CUE_ARGS,
    // A message rides the cable from the laptop to the router, or from the router to the server.
    routes: OSI_ROUTES,
    // Every word on the figure comes from the unit's `scene.labels`, so the fact-checker checks it.
    words: OSI_WORDS,
    layers: [],
    board: false,
    start: false,
    labels: true,
  },
  // Switch (D13b): four devices on one switch. A frame rides from one device to another, or to `all` (a broadcast).
  // `flood` sends a frame for one device out of every other port (no match in the table); a broadcast floods by
  // itself. `plug` moves the laptop's cable to port 5 before its frame is sent (src/scenes/drivers/switch.ts).
  switch: {
    places: SWITCH_PLACES,
    cues: { flood: 'flag', plug: 'text' },
    args: { plug: SWITCH_PLUG_ARGS },
    routes: SWITCH_ROUTES,
    layers: [],
    board: false,
    start: false,
  },
  pool: {
    places: POOL_PLACES,
    // A request rides through the balancer to a server; a check rides from the balancer to a server, its answer back
    // (src/scenes/drivers/pool.ts). `skip` names a server the balancer passes over on a request; `no-answer`, on a
    // note, the server that did not answer a check in time.
    cues: { skip: 'text', 'no-answer': 'text' },
    args: { skip: POOL_SERVERS, 'no-answer': POOL_SERVERS },
    routes: POOL_ROUTES,
    layers: [],
    board: false,
    start: false,
  },
};
