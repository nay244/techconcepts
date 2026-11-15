// The art on a lesson's card, chosen in one place so every page that shows a lesson shows the same figure.
import { nameTile } from '../art/figures/name-tile';
import { spot } from '../art/figures/spots';
import { getLesson, tracksOf, type AvailableSummary } from '../content/registry';
import { internetTrack } from '../content/tracks';

const FIGURES: Record<string, () => string> = {
  'osi-model': () => spot('osi'),
  subnetting: () => spot('subnet'),
  dhcp: () => spot('dhcp'),
  firewalls: () => spot('firewall'),
  router: () => spot('router'),
};

/**
 * A lesson whose home track is How the Internet Works shows its protocol's name tile, from the lesson's one unit, on
 * every track that lists it; others their figure. The home track, not the page's, decides, so a shared lesson's card
 * looks the same wherever it is shown.
 */
export function lessonFigure(entry: AvailableSummary): string {
  if (tracksOf(entry.slug)[0]?.id === internetTrack.id) {
    const lesson = getLesson(entry.slug);
    // An available entry is built from its lesson, so this cannot happen.
    if (lesson === undefined) throw new Error(`No lesson file for ${entry.key}.`);
    const unit = lesson.units[0]!;
    return nameTile(unit.name, unit.fullName);
  }
  const draw = FIGURES[entry.slug];
  if (draw === undefined) throw new Error(`The ${entry.key} lesson is ready and has no figure for its card.`);
  return draw();
}
