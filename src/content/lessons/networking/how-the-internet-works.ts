import { defineLesson } from '../../define';
import type { Unit } from '../../schema';
import dns from './how-the-internet-works/dns';
import http from './how-the-internet-works/http';
import smtp from './how-the-internet-works/smtp';
import tcp from './how-the-internet-works/tcp';

/**
 * How the Internet Works, lesson 1 of 20: the 14 protocols the internet runs on, on one network map, each with its
 * own short walkthrough (a unit of the lesson). Each protocol lives in its own file beside this one, ported from the
 * approved mockup (internet-v2.html).
 */

/** The protocols in the order the lesson teaches them, the order of Protocol Explorer's list. */
export const UNIT_ORDER = ['http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh', 'tls'] as const;

/** The protocols written so far. The lesson shows those, in UNIT_ORDER. */
const written: Unit[] = [http, dns, tcp, smtp];

const order = (u: Unit): number => {
  const at = (UNIT_ORDER as readonly string[]).indexOf(u.id);
  if (at === -1) throw new Error(`Protocol "${u.id}" is not in UNIT_ORDER.`);
  return at;
};

export default defineLesson({
  slug: 'how-the-internet-works',
  title: 'How the Internet Works',
  subtitle: 'The protocols behind every page',
  level: 'beginner',
  certTags: ['a-plus', 'network-plus', 'security-plus', 'ccna', 'helpdesk'],
  summary:
    'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS. Each one gets its own short walkthrough of what it does.',
  figure: 'net-map',
  units: [...written].sort((a, b) => order(a) - order(b)),
});
