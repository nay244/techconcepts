import { describe, expect, it } from 'vitest';
import type { AvailableSummary, LessonSummary } from '../content/registry';
import { emptyProgress, type LessonProgress, type ProgressData } from '../progress/store';
import { STATUS_WORDS, UP_NEXT_KICKER, actionLabel, lessonHref, lessonLine, lessonStatus, stripStates, stripWords, upNext } from './hub';

function ready(key: string, n: number, maxPosition = 12): AvailableSummary {
  return {
    available: true,
    key,
    trackId: 't',
    slug: key,
    url: `/t/${key}`,
    canonical: `/t/${key}`,
    number: n,
    title: key,
    subtitle: '',
    partTitle: 'P',
    summary: '',
    certTags: [],
    stepCount: 5,
    units: 1,
    maxPosition,
  };
}
function notReady(key: string, n: number): LessonSummary {
  return { available: false, key, trackId: 't', slug: key, number: n, title: key, partTitle: 'P' };
}
function data(records: Record<string, Partial<LessonProgress>>): ProgressData {
  const d = emptyProgress();
  for (const [k, r] of Object.entries(records)) {
    d.lessons[k] = { status: 'in-progress', furthestPosition: 1, lastOpened: '2026-01-01T00:00:00.000Z', ...r };
  }
  return d;
}

describe('lessonStatus', () => {
  it('covers each state', () => {
    expect(lessonStatus(notReady('x', 1), data({ x: { status: 'finished' } }))).toBe('not-ready');
    expect(lessonStatus(ready('a', 1), emptyProgress())).toBe('not-started');
    expect(lessonStatus(ready('a', 1), data({ a: {} }))).toBe('in-progress');
    expect(lessonStatus(ready('a', 1), data({ a: { status: 'finished' } }))).toBe('done');
  });
  it('does not treat an inherited key as a record', () => {
    expect(lessonStatus(ready('constructor', 1), emptyProgress())).toBe('not-started');
  });
});

describe('upNext', () => {
  const entries = [ready('a', 1), notReady('b', 2), ready('c', 3), ready('d', 4)];
  it('starts at the first ready entry with no progress', () => {
    const r = upNext(entries, emptyProgress());
    expect(r?.entry.key).toBe('a');
    expect(r?.kind).toBe('start');
  });
  it('prefers the in-progress lesson opened last', () => {
    const d = data({
      a: { lastOpened: '2026-02-01T00:00:00.000Z' },
      d: { lastOpened: '2026-03-01T00:00:00.000Z' },
    });
    const r = upNext(entries, d);
    expect(r?.entry.key).toBe('d');
    expect(r?.kind).toBe('next');
  });
  it('takes the first unfinished ready entry after a finished one', () => {
    const r = upNext(entries, data({ a: { status: 'finished' } }));
    expect(r?.entry.key).toBe('c');
    expect(r?.kind).toBe('next');
  });
  it('falls back to the last ready entry when all are finished', () => {
    const d = data({ a: { status: 'finished' }, c: { status: 'finished' }, d: { status: 'finished' } });
    const r = upNext(entries, d);
    expect(r?.entry.key).toBe('d');
    expect(r?.kind).toBe('done-so-far');
  });
  it('ignores records for unavailable or unlisted lessons', () => {
    const r = upNext(entries, data({ b: {}, zzz: {} }));
    expect(r?.entry.key).toBe('a');
    expect(r?.kind).toBe('start');
  });
  it('is null when nothing is ready', () => {
    expect(upNext([notReady('a', 1)], emptyProgress())).toBeNull();
    expect(upNext([], emptyProgress())).toBeNull();
  });
});

describe('stripStates', () => {
  it('maps each entry', () => {
    const entries = [ready('a', 1), ready('b', 2), ready('c', 3), notReady('d', 4)];
    const d = data({ a: { status: 'finished' } });
    expect(stripStates(entries, d, 'b')).toEqual(['done', 'current', 'ready', '']);
    expect(stripStates(entries, d, 'a')).toEqual(['done', 'ready', 'ready', '']);
    expect(stripStates(entries, d, null)).toEqual(['done', 'ready', 'ready', '']);
  });
});

describe('stripWords', () => {
  it('adds the ready count when some are not ready', () => {
    const entries = [
      ...[1, 2, 3, 4].map((n) => ready(`r${n}`, n)),
      ...Array.from({ length: 15 }, (_, i) => notReady(`n${i}`, i + 5)),
    ];
    expect(stripWords(entries, data({ r1: { status: 'finished' } }))).toBe('1 of 19 lessons done · 4 ready');
  });
  it('omits it when all are ready', () => {
    const entries = Array.from({ length: 14 }, (_, i) => ready(`r${i}`, i + 1));
    expect(stripWords(entries, emptyProgress())).toBe('0 of 14 lessons done');
  });
});

describe('lessonHref', () => {
  const e = ready('a', 1, 12);
  it('is the bare url without a record or when finished', () => {
    expect(lessonHref(e, emptyProgress())).toBe('/t/a');
    expect(lessonHref(e, data({ a: { status: 'finished', furthestPosition: 6 } }))).toBe('/t/a');
  });
  it('resumes in progress, clamped to maxPosition', () => {
    expect(lessonHref(e, data({ a: { furthestPosition: 6 } }))).toBe('/t/a?step=6');
    expect(lessonHref(e, data({ a: { furthestPosition: 99 } }))).toBe('/t/a?step=12');
    expect(lessonHref(e, data({ a: { furthestPosition: 0 } }))).toBe('/t/a');
  });
});

describe('actionLabel', () => {
  it('maps status to a verb', () => {
    expect(actionLabel('not-started')).toBe('Start');
    expect(actionLabel('in-progress')).toBe('Continue');
    expect(actionLabel('done')).toBe('Watch again');
  });
});

it('pins the status words and the up-next kickers', () => {
  expect(STATUS_WORDS).toEqual({ 'not-started': 'Not started', 'in-progress': 'In progress', done: '✓ Done', 'not-ready': 'Not ready yet' });
  expect(UP_NEXT_KICKER).toEqual({ start: 'Start here', next: 'Up next', 'done-so-far': '✓ Done so far' });
});

describe('lessonLine', () => {
  it('is the two-digit lesson number and the subtitle', () => {
    expect(lessonLine({ ...ready('a', 9), subtitle: 'Getting an address automatically' })).toBe('Lesson 09 · Getting an address automatically');
    expect(lessonLine({ ...ready('b', 12), subtitle: 'x' })).toBe('Lesson 12 · x');
  });
});
