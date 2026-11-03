import type { Track } from '../schema';
import { networkingTrack } from './networking';

export { networkingTrack };

/** Every track that has lessons. The order is the order they appear on Home. */
export const tracks: Track[] = [networkingTrack];

/** Roadmap cards on Home (spec §10.1). Not clickable: there is nothing behind them yet. */
export const comingSoonTracks: { title: string; blurb: string }[] = [
  {
    title: 'How the Web Works',
    blurb: 'Follow a page from the address bar to your screen: browsers, servers, cookies and what sits between them.',
  },
  {
    title: 'Cryptography',
    blurb: 'Hashes, keys and signatures, explained by watching them work.',
  },
  {
    title: 'AI Concepts',
    blurb: 'What models, training and prompts actually are, without the hype.',
  },
  {
    title: 'Privilege Escalation',
    blurb: 'How someone ends up with more access than intended, and how defenders notice.',
  },
  {
    title: 'Threat & Vulnerability Management',
    blurb: 'Finding, ranking and fixing weaknesses before they turn into incidents.',
  },
];
