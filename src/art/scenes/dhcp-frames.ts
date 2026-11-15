/**
 * The words and names of the DHCP plate's frames setup (MAC Address), shared by the figure's build-time form
 * (`framesSetup` in dhcp.ts) and its driver, which must say the same things. Kept out of dhcp.ts so the driver does
 * not take the drawing's code into the page.
 */

/** The figure's description in the frames setup. */
export const FRAMES_DESCRIPTION =
  'A home Wi-Fi network on one plate: a laptop, a phone and a TV, and the router at the back. Beside each, its name and its MAC address.';

/** The laptop's address once the frames setup has it online from the start. */
export const FRAMES_LAPTOP_IP = '192.168.1.100';
