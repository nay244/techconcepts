import type { CoverId } from '../../art/figures/covers';
import type { Track } from '../schema';
import { internetTrack } from './how-the-internet-works';
import { networkingTrack } from './networking';

export { internetTrack, networkingTrack };

/**
 * Every track that has lessons, in the order the site lists them: How the Internet Works, the beginner entry, first
 * (direction doc §6.1). The first track is where the site's Start buttons lead.
 */
export const tracks: Track[] = [internetTrack, networkingTrack];

/** A track the Tracks page lists before it has any lessons: what it will be, and the cover it wears meanwhile. */
export interface PlannedTrack {
  id: string;
  title: string;
  type: Track['type'];
  level: Track['level'];
  blurb: string;
  cover: CoverId;
}

/** The Tracks page's "Being written" cards, after the tracks that have lessons. Not clickable: nothing is behind them yet. */
export const plannedTracks: PlannedTrack[] = [
  {
    id: 'comptia-a-plus',
    title: 'CompTIA A+',
    type: 'certification',
    level: 'beginner',
    blurb: 'Hardware, operating systems, networking and troubleshooting, mapped to the A+ exam objectives.',
    cover: 'aplus',
  },
];

/**
 * Roadmap cards on Home (spec §10.1), after the How the Internet Works and Networking cards. Not clickable: there is
 * nothing behind them yet. Each wears its approved cover, still, under the kind of track it is (the Networking card
 * wears the `networking` cover, and How the Internet Works the `web` one).
 */
export const comingSoonTracks: { title: string; blurb: string; kind: string; cover: CoverId }[] = [
  {
    title: 'Cryptography',
    blurb: 'Hashes, keys and signatures, explained by watching them work.',
    kind: 'Security',
    cover: 'crypto',
  },
  {
    title: 'AI Concepts',
    blurb: 'What models, training and prompts actually are, without the hype.',
    kind: 'AI',
    cover: 'ai',
  },
  {
    title: 'Privilege Escalation',
    blurb: 'How someone ends up with more access than intended, and how defenders notice.',
    kind: 'Security',
    cover: 'privesc',
  },
  {
    title: 'Threat & Vulnerability Management',
    blurb: 'Finding, ranking and fixing weaknesses before they turn into incidents.',
    kind: 'Security',
    cover: 'tvm',
  },
];
