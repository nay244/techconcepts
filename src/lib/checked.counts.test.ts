import { expect, test, vi } from 'vitest';
import { lessonCheckCounts } from './checked';

// A lesson counts as checked when it has a check date, the stamp's own truth: with one ready lesson's date taken away,
// the count drops by one and the total does not.
vi.mock('../content/registry', async (original) => {
  const real = await original<typeof import('../content/registry')>();
  return { ...real, checkedOn: (slug: string) => (slug === 'osi-model' ? null : real.checkedOn(slug)) };
});

test('a ready lesson with no check date is not counted as checked', async () => {
  const real = await vi.importActual<typeof import('../content/registry')>('../content/registry');
  expect(real.checkedOn('osi-model')).not.toBeNull();
  const { checked, total } = lessonCheckCounts();
  expect(total).toBeGreaterThan(1);
  expect(checked).toBe(total - 1);
});
