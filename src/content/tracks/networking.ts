import { defineTrack } from '../define';

/**
 * Titles and order follow the launch catalog (launch spec §8), with How the
 * Internet Works added as lesson 1 (redesign spec §3, §7.5).
 */
export const networkingTrack = defineTrack({
  id: 'networking',
  title: 'Networking Concepts',
  description:
    'How devices find each other and talk: addresses, switches and routers, the web, and the tools that protect and scale it. Visual lessons at your own pace: stop anywhere and pick up where you left off.',
  level: 'beginner',
  parts: [
    {
      id: 'big-picture',
      title: 'The big picture',
      lessons: [
        { slug: 'how-the-internet-works', title: 'How the Internet Works' },
        { slug: 'osi-model', title: 'OSI Model' },
        { slug: 'packets', title: 'Packets' },
      ],
    },
    {
      id: 'local-network',
      title: 'Addresses & the local network',
      lessons: [
        { slug: 'ip-address', title: 'IP Address' },
        { slug: 'mac-address', title: 'MAC Address' },
        { slug: 'switch', title: 'Switch' },
        { slug: 'arp', title: 'ARP' },
      ],
    },
    {
      id: 'between-networks',
      title: 'Getting between networks',
      lessons: [
        { slug: 'subnetting', title: 'Subnetting' },
        { slug: 'router', title: 'Router' },
        { slug: 'dhcp', title: 'DHCP' },
      ],
    },
    {
      id: 'across-internet',
      title: 'Talking across the internet',
      lessons: [
        { slug: 'ports', title: 'Ports' },
        { slug: 'tcp-udp', title: 'TCP/UDP' },
        { slug: 'nat', title: 'NAT' },
        { slug: 'dns', title: 'DNS' },
      ],
    },
    {
      id: 'web',
      title: 'The web',
      lessons: [
        { slug: 'http-https', title: 'HTTP/HTTPS' },
        { slug: 'tls', title: 'TLS' },
      ],
    },
    {
      id: 'protect-scale',
      title: 'Protecting & scaling traffic',
      lessons: [
        { slug: 'firewalls', title: 'Firewalls' },
        { slug: 'proxies', title: 'Proxies' },
        { slug: 'load-balancers', title: 'Load Balancers' },
        { slug: 'vpn', title: 'VPN' },
      ],
    },
  ],
});
