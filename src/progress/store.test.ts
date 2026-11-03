import { describe, expect, test } from 'vitest';
import { createSafeStorage } from '../lib/storage';
import type { SafeStorage } from '../lib/storage';
import {
  PROGRESS_KEY,
  clearProgress,
  emptyProgress,
  loadProgress,
  parseProgress,
  recordVisit,
  resumePosition,
  sanitizeProgress,
  saveProgress,
  trackCompletion,
} from './store';
import type { ProgressData } from './store';

const now = new Date('2026-11-03T12:00:00Z');

/** A working in-memory SafeStorage, so round trips need no browser. */
function memoryStorage(): SafeStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();
  return {
    values,
    available: true,
    get: (key) => values.get(key) ?? null,
    set: (key, value) => {
      values.set(key, value);
      return true;
    },
    remove: (key) => {
      values.delete(key);
    },
  };
}

test('the storage key is versioned', () => {
  expect(PROGRESS_KEY).toBe('techconcepts:v1');
});

describe('parseProgress', () => {
  test.each([null, '', 'not json', '[]', 'null', '7', '{"version":2,"lessons":{}}', '{"version":1,"lessons":"x"}', '{"version":1,"lessons":[]}', '{"version":1}'])(
    'parseProgress(%j) is empty',
    (raw) => expect(parseProgress(raw)).toEqual(emptyProgress()),
  );

  test('reads a well-formed record back', () => {
    const data: ProgressData = {
      version: 1,
      lastLesson: 'networking/dhcp',
      lessons: {
        'networking/dhcp': { status: 'in-progress', furthestPosition: 2, lastOpened: now.toISOString() },
        'networking/arp': { status: 'finished', furthestPosition: 6, lastOpened: now.toISOString() },
      },
    };
    expect(parseProgress(JSON.stringify(data))).toEqual(data);
  });

  test('drops malformed lesson records', () => {
    const raw = JSON.stringify({
      version: 1,
      lastLesson: 'networking/dhcp',
      lessons: {
        'networking/dhcp': { status: 'in-progress', furthestPosition: 2, lastOpened: now.toISOString() },
        bad: { status: 'x' },
      },
    });
    expect(Object.keys(parseProgress(raw).lessons)).toEqual(['networking/dhcp']);
  });

  test.each([
    ['an unknown status', { status: 'done', furthestPosition: 2, lastOpened: 'x' }],
    ['a missing position', { status: 'in-progress', lastOpened: 'x' }],
    ['a text position', { status: 'in-progress', furthestPosition: '2', lastOpened: 'x' }],
    ['a fractional position', { status: 'in-progress', furthestPosition: 2.5, lastOpened: 'x' }],
    ['a missing date', { status: 'in-progress', furthestPosition: 2 }],
    ['a null record', null],
    ['a list', []],
    ['a number', 4],
  ])('drops a lesson record with %s', (_label, lesson) => {
    const raw = JSON.stringify({ version: 1, lastLesson: null, lessons: { 'networking/dhcp': lesson } });
    expect(parseProgress(raw).lessons).toEqual({});
  });

  test('keeps out-of-range positions for sanitize to clamp', () => {
    const raw = JSON.stringify({
      version: 1,
      lastLesson: null,
      lessons: { 'networking/dhcp': { status: 'in-progress', furthestPosition: -4, lastOpened: '' } },
    });
    expect(parseProgress(raw).lessons['networking/dhcp'].furthestPosition).toBe(-4);
  });

  test('a last lesson that is not text becomes null without losing the lessons', () => {
    const raw = JSON.stringify({
      version: 1,
      lastLesson: 7,
      lessons: { 'networking/dhcp': { status: 'finished', furthestPosition: 8, lastOpened: '' } },
    });
    const parsed = parseProgress(raw);
    expect(parsed.lastLesson).toBeNull();
    expect(Object.keys(parsed.lessons)).toEqual(['networking/dhcp']);
  });

  test('a lesson named __proto__ stays an ordinary entry', () => {
    const raw = '{"version":1,"lastLesson":null,"lessons":{"__proto__":{"status":"finished","furthestPosition":1,"lastOpened":""}}}';
    const lessons = parseProgress(raw).lessons;
    expect(Object.keys(lessons)).toEqual(['__proto__']);
    expect(Object.getPrototypeOf(lessons)).toBe(Object.prototype);
  });
});

describe('sanitizeProgress', () => {
  test('clamps and ignores unknown', () => {
    const d = {
      version: 1 as const,
      lastLesson: 'gone/x',
      lessons: {
        'networking/dhcp': { status: 'in-progress' as const, furthestPosition: 999, lastOpened: '' },
        'gone/x': { status: 'finished' as const, furthestPosition: 3, lastOpened: '' },
        'networking/subnetting': { status: 'in-progress' as const, furthestPosition: -4, lastOpened: '' },
      },
    };
    const s = sanitizeProgress(d, { 'networking/dhcp': 8, 'networking/subnetting': 9 });
    expect(s.lessons['networking/dhcp'].furthestPosition).toBe(8);
    expect(s.lessons['networking/subnetting'].furthestPosition).toBe(1);
    expect(s.lessons['gone/x']).toBeUndefined();
    expect(s.lastLesson).toBeNull();
  });

  test('keeps a known last lesson and a finished status', () => {
    const d = recordVisit(emptyProgress(), 'networking/dhcp', 8, 8, now);
    const s = sanitizeProgress(d, { 'networking/dhcp': 5 });
    expect(s.lastLesson).toBe('networking/dhcp');
    expect(s.lessons['networking/dhcp']).toMatchObject({ status: 'finished', furthestPosition: 5 });
  });

  test('names that merely exist on every object are not lessons', () => {
    const lesson = { status: 'in-progress' as const, furthestPosition: 2, lastOpened: '' };
    const d = { version: 1 as const, lastLesson: 'toString', lessons: { toString: lesson, constructor: lesson } };
    const s = sanitizeProgress(d, {});
    expect(Object.keys(s.lessons)).toEqual([]);
    expect(s.lastLesson).toBeNull();
  });

  test('does not change its input', () => {
    const d = recordVisit(emptyProgress(), 'networking/dhcp', 9, 9, now);
    const before = JSON.stringify(d);
    sanitizeProgress(d, {});
    expect(JSON.stringify(d)).toBe(before);
  });
});

describe('recordVisit', () => {
  test('visit lifecycle', () => {
    let d = recordVisit(emptyProgress(), 'networking/dhcp', 0, 8, now);
    expect(d.lastLesson).toBe('networking/dhcp');
    expect(d.lessons['networking/dhcp']).toBeUndefined();
    d = recordVisit(d, 'networking/dhcp', 3, 8, now);
    expect(resumePosition(d, 'networking/dhcp')).toBe(3);
    d = recordVisit(d, 'networking/dhcp', 2, 8, now);
    expect(d.lessons['networking/dhcp'].furthestPosition).toBe(3);
    d = recordVisit(d, 'networking/dhcp', 8, 8, now);
    expect(d.lessons['networking/dhcp'].status).toBe('finished');
    d = recordVisit(d, 'networking/dhcp', 1, 8, now);
    expect(d.lessons['networking/dhcp'].status).toBe('finished');
    expect(resumePosition(d, 'networking/dhcp')).toBeNull();
    expect(trackCompletion(d, ['networking/dhcp', 'networking/arp'])).toEqual({ finished: 1, inProgress: 0 });
  });

  test('moving past the Overview starts the lesson', () => {
    const d = recordVisit(emptyProgress(), 'networking/dhcp', 1, 8, now);
    expect(d.lessons['networking/dhcp']).toEqual({ status: 'in-progress', furthestPosition: 1, lastOpened: now.toISOString() });
  });

  test('jumping straight to the Recap finishes the lesson', () => {
    const d = recordVisit(emptyProgress(), 'networking/dhcp', 8, 8, now);
    expect(d.lessons['networking/dhcp']).toEqual({ status: 'finished', furthestPosition: 8, lastOpened: now.toISOString() });
  });

  test('reopening at the Overview only refreshes the date', () => {
    const later = new Date('2026-11-04T09:30:00Z');
    let d = recordVisit(emptyProgress(), 'networking/dhcp', 4, 8, now);
    d = recordVisit(d, 'networking/dhcp', 0, 8, later);
    expect(d.lessons['networking/dhcp']).toEqual({ status: 'in-progress', furthestPosition: 4, lastOpened: later.toISOString() });
  });

  test('the last lesson follows the latest visit', () => {
    let d = recordVisit(emptyProgress(), 'networking/dhcp', 3, 8, now);
    d = recordVisit(d, 'networking/arp', 0, 6, now);
    expect(d.lastLesson).toBe('networking/arp');
    expect(Object.keys(d.lessons)).toEqual(['networking/dhcp']);
  });

  test('does not change its input', () => {
    const d = recordVisit(emptyProgress(), 'networking/dhcp', 3, 8, now);
    const before = JSON.stringify(d);
    recordVisit(d, 'networking/dhcp', 8, 8, now);
    recordVisit(d, 'networking/arp', 2, 6, now);
    expect(JSON.stringify(d)).toBe(before);
  });
});

describe('resumePosition and trackCompletion', () => {
  test('resume only applies to lessons in progress', () => {
    let d = recordVisit(emptyProgress(), 'networking/dhcp', 3, 8, now);
    d = recordVisit(d, 'networking/arp', 6, 6, now);
    expect(resumePosition(d, 'networking/dhcp')).toBe(3);
    expect(resumePosition(d, 'networking/arp')).toBeNull();
    expect(resumePosition(d, 'networking/never-opened')).toBeNull();
    expect(resumePosition(d, 'toString')).toBeNull();
  });

  test('counts finished and in-progress lessons within the given keys', () => {
    let d = recordVisit(emptyProgress(), 'networking/dhcp', 3, 8, now);
    d = recordVisit(d, 'networking/arp', 6, 6, now);
    d = recordVisit(d, 'security/tls', 2, 5, now);
    expect(trackCompletion(d, ['networking/dhcp', 'networking/arp', 'networking/dns'])).toEqual({ finished: 1, inProgress: 1 });
    expect(trackCompletion(d, [])).toEqual({ finished: 0, inProgress: 0 });
  });
});

describe('storage', () => {
  test('blocked storage: load is empty, save is false', () => {
    const s = createSafeStorage(() => {
      throw new Error('blocked');
    });
    expect(loadProgress(s)).toEqual(emptyProgress());
    expect(saveProgress(s, emptyProgress())).toBe(false);
  });

  test('saves under the versioned key and loads it back', () => {
    const s = memoryStorage();
    const d = recordVisit(emptyProgress(), 'networking/dhcp', 3, 8, now);
    expect(saveProgress(s, d)).toBe(true);
    expect(s.values.has(PROGRESS_KEY)).toBe(true);
    expect(loadProgress(s)).toEqual(d);
  });

  test('clear removes the record', () => {
    const s = memoryStorage();
    saveProgress(s, recordVisit(emptyProgress(), 'networking/dhcp', 3, 8, now));
    clearProgress(s);
    expect(s.values.has(PROGRESS_KEY)).toBe(false);
    expect(loadProgress(s)).toEqual(emptyProgress());
  });

  test('foreign data under the key loads as empty', () => {
    const s = memoryStorage();
    s.set(PROGRESS_KEY, '{"version":99,"lessons":{"networking/dhcp":{}}}');
    expect(loadProgress(s)).toEqual(emptyProgress());
  });
});
