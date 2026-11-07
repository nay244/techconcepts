import type { CoverId } from '../../art/figures/covers';
import type { Track } from '../schema';
import { networkingTrack } from './networking';

export { networkingTrack };

/** Every track that has lessons. The order is the order they appear on Home. */
export const tracks: Track[] = [networkingTrack];

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
