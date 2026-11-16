/**
 * The Switch figure's names and numbers, shared by its drawing (switch.ts), its driver and the lesson validator, which
 * must agree on them. Kept out of switch.ts so the driver does not take the drawing's code into the page.
 */

/** The devices on the figure, each with the MAC address its callout draws: the MAC Address lesson's example addresses. */
export const SWITCH_DEVICES = {
  router: '00:00:5E:00:53:01',
  laptop: '00:00:5E:00:53:10',
  tv: '00:00:5E:00:53:12',
  printer: '00:00:5E:00:53:13',
} as const;
export type SwitchDevice = keyof typeof SWITCH_DEVICES;

/** The port each device is plugged into as a unit starts. Port 5 is free. */
export const SWITCH_PLUGS: Readonly<Record<SwitchDevice, number>> = { router: 1, laptop: 2, tv: 3, printer: 4 };

/** The figure's places: the four devices, and `all`, where a broadcast is addressed (to everyone). */
export const SWITCH_PLACES = [...Object.keys(SWITCH_DEVICES), 'all'] as const;

/** The only re-plug the figure draws: the laptop's cable from port 2 to port 5 (the `plug` cue's one arg). */
export const SWITCH_PLUG_ARGS = ['laptop 5'] as const;

/** The ways a frame rides: from any device to any other, or to everyone (`all`). Nothing is sent from `all`. */
const DEVICES = Object.keys(SWITCH_DEVICES) as SwitchDevice[];
export const SWITCH_ROUTES = [...DEVICES.flatMap((a) => DEVICES.filter((b) => b !== a).map((b) => `${a}>${b}`)), ...DEVICES.map((a) => `${a}>all`)];

/** The figure's description, for screen readers. */
export const SWITCH_DESCRIPTION =
  'A wired home network on one plate: a switch with five numbered ports along its front, and a router, a laptop, a TV and a printer, each plugged into one port by its own cable. Beside each device, its name, its port and its MAC address.';
