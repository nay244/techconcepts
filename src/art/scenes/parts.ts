import { NET_MAP_BASE_PLACES, NET_MAP_LAYERS, plateSites } from './net-map-layers';
import type { FigureId, FigureParts } from './types';

/**
 * The places, cues and layers each scene figure supports, and whether it takes
 * a board or a scene's start. Each list names only what its figure draws and
 * its driver handles, so the validator only accepts what the figure can show.
 */
export const FIGURE_PARTS: Record<FigureId, FigureParts> = {
  dhcp: { places: ['laptop', 'router', 'phone'], cues: {}, layers: [], board: false, start: false },
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
    },
    layers: Object.keys(NET_MAP_LAYERS),
    board: false,
    // Its driver settles a unit's start under the cues that have played.
    start: true,
  },
};
