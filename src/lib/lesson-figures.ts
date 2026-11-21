/**
 * Which drawing each lesson uses, by the lesson's key: only ids, no lesson content, so the console can tell without
 * fetching whether a change of lesson keeps the drawing (the change then happens in the page) or not (the browser
 * loads the page). `lesson-figures.test.ts` holds it equal to every lesson file's `figure`.
 */
export const LESSON_FIGURES: Readonly<Record<string, string>> = {
  arp: 'net-map',
  dhcp: 'dhcp',
  firewalls: 'firewall',
  'ip-address': 'subnet',
  'load-balancers': 'pool',
  'mac-address': 'dhcp',
  nat: 'net-map',
  'osi-model': 'osi',
  packets: 'net-map',
  ports: 'net-map',
  proxies: 'net-map',
  router: 'net-map',
  subnetting: 'subnet',
  switch: 'switch',
  'tcp-udp': 'net-map',
  vpn: 'net-map',
  'what-is-dhcp': 'net-map',
  'what-is-dns': 'net-map',
  'what-is-ftp': 'net-map',
  'what-is-http': 'net-map',
  'what-is-https': 'net-map',
  'what-is-icmp': 'net-map',
  'what-is-imap': 'net-map',
  'what-is-ip': 'net-map',
  'what-is-pop3': 'net-map',
  'what-is-smtp': 'net-map',
  'what-is-ssh': 'net-map',
  'what-is-tcp': 'net-map',
  'what-is-tls': 'net-map',
  'what-is-udp': 'net-map',
};

/** The drawing the lesson with this key uses, or undefined for a key the map does not know. */
export function figureOfKey(key: string): string | undefined {
  return Object.hasOwn(LESSON_FIGURES, key) ? LESSON_FIGURES[key] : undefined;
}
