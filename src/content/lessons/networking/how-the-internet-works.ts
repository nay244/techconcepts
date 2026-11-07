import { defineLegacyLesson } from '../../legacy';
import dhcp from './how-the-internet-works/dhcp';
import dns from './how-the-internet-works/dns';
import ftp from './how-the-internet-works/ftp';
import http from './how-the-internet-works/http';
import https from './how-the-internet-works/https';
import icmp from './how-the-internet-works/icmp';
import imap from './how-the-internet-works/imap';
import ip from './how-the-internet-works/ip';
import pop3 from './how-the-internet-works/pop3';
import smtp from './how-the-internet-works/smtp';
import ssh from './how-the-internet-works/ssh';
import tcp from './how-the-internet-works/tcp';
import tls from './how-the-internet-works/tls';
import udp from './how-the-internet-works/udp';

/**
 * How the Internet Works, lesson 1 of 20: the 14 protocols the internet runs on, on one network map, each with its
 * own short walkthrough (a unit of the lesson). Each protocol lives in its own file beside this one, ported from the
 * approved mockup (internet-v2.html).
 */

/** The protocols in the order the lesson teaches them, the order of Protocol Explorer's list. */
export const UNIT_ORDER = ['http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'icmp', 'smtp', 'pop3', 'imap', 'ftp', 'ssh', 'tls'] as const;

export default defineLegacyLesson({
  slug: 'how-the-internet-works',
  title: 'How the Internet Works',
  subtitle: 'The protocols behind every page',
  level: 'beginner',
  certTags: ['a-plus', 'network-plus', 'security-plus', 'ccna', 'helpdesk'],
  summary:
    'Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS. Each one gets its own short walkthrough of what it does.',
  figure: 'net-map',
  // In UNIT_ORDER (the lesson's test holds them to it).
  units: [http, https, tcp, udp, ip, dns, dhcp, icmp, smtp, pop3, imap, ftp, ssh, tls],
});
