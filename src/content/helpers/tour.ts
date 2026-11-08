import type { LegacyLessonInput, LegacyUnitInput } from '../legacy';

/**
 * A How the Internet Works lesson from its one protocol section (direction doc §4.5): every lesson-level field comes
 * from words the section already has, so splitting the old lesson 1 adds no claim. No exam tags until each lesson's
 * audit maps them: today's lesson-wide tags would claim exams that do not cover every protocol.
 */
export function tourLesson(unit: LegacyUnitInput): LegacyLessonInput {
  return {
    slug: `what-is-${unit.id}`,
    title: unit.name,
    subtitle: unit.purpose,
    level: 'beginner',
    certTags: [],
    summary: unit.overview.hook,
    figure: 'net-map',
    units: [unit],
  };
}
