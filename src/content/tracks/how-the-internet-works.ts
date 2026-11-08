import { defineTrack } from '../define';
import { networkingTrack } from './networking';

/**
 * How the Internet Works, the beginner entry (direction doc §4.5): the 14 protocols that were lesson 1 of Networking,
 * one short lesson each, in the order lesson 1 taught them. It is the tour, what each protocol is for; Networking
 * Concepts is the depth. Its limits start as Networking's, which every protocol already fit.
 */
export const internetTrack = defineTrack({
  id: 'how-the-internet-works',
  type: 'concept',
  title: 'How the Internet Works',
  description:
    'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each. Start here if you are new to IT: Networking Concepts goes deeper.',
  level: 'beginner',
  limits: structuredClone(networkingTrack.limits),
  parts: [
    {
      id: 'web-page',
      title: 'Loading a web page',
      lessons: [
        { slug: 'what-is-http', title: 'HTTP' },
        { slug: 'what-is-https', title: 'HTTPS' },
      ],
    },
    {
      id: 'getting-there',
      title: 'Getting the data there',
      lessons: [
        { slug: 'what-is-tcp', title: 'TCP' },
        { slug: 'what-is-udp', title: 'UDP' },
        { slug: 'what-is-ip', title: 'IP' },
      ],
    },
    {
      id: 'behind-the-scenes',
      title: 'Behind the scenes',
      lessons: [
        { slug: 'what-is-dns', title: 'DNS' },
        { slug: 'what-is-dhcp', title: 'DHCP' },
        { slug: 'what-is-icmp', title: 'ICMP' },
      ],
    },
    {
      id: 'email',
      title: 'Email',
      lessons: [
        { slug: 'what-is-smtp', title: 'SMTP' },
        { slug: 'what-is-pop3', title: 'POP3' },
        { slug: 'what-is-imap', title: 'IMAP' },
      ],
    },
    {
      id: 'files-remote',
      title: 'Files and remote control',
      lessons: [
        { slug: 'what-is-ftp', title: 'FTP' },
        { slug: 'what-is-ssh', title: 'SSH' },
      ],
    },
    {
      id: 'the-seal',
      title: 'The seal',
      lessons: [{ slug: 'what-is-tls', title: 'TLS/SSL' }],
    },
  ],
});
