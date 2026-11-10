import { describe, expect, test } from 'vitest';
import { createSafeStorage } from '../lib/storage';
import type { SafeStorage } from '../lib/storage';
import {
  PROGRESS_KEY,
  LEGACY_PROGRESS_KEY,
  clearProgress,
  combineProgress,
  emptyProgress,
  loadProgress,
  mergeProgress,
  mergeRecords,
  migrateV1,
  parseProgress,
  recordVisit,
  resumePosition,
  sanitizeProgress,
  saveProgress,
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
  expect(PROGRESS_KEY).toBe('techconcepts:v2');
  expect(LEGACY_PROGRESS_KEY).toBe('techconcepts:v1');
});

describe('parseProgress', () => {
  test.each([null, '', 'not json', '[]', 'null', '7', '{"version":1,"lessons":{}}', '{"version":2,"lessons":"x"}', '{"version":2,"lessons":[]}', '{"version":2}'])(
    'parseProgress(%j) is empty',
    (raw) => expect(parseProgress(raw)).toEqual(emptyProgress()),
  );

  test('reads a well-formed record back', () => {
    const data: ProgressData = {
      version: 2,
      lastLesson: 'dhcp',
      lastTrack: 'networking',
      lessons: {
        'dhcp': { status: 'in-progress', furthestPosition: 2, lastOpened: now.toISOString() },
        'arp': { status: 'finished', furthestPosition: 6, lastOpened: now.toISOString() },
      },
    };
    expect(parseProgress(JSON.stringify(data))).toEqual(data);
  });

  test('drops malformed lesson records', () => {
    const raw = JSON.stringify({
      version: 2,
      lastLesson: 'dhcp',
      lastTrack: 'networking',
      lessons: {
        'dhcp': { status: 'in-progress', furthestPosition: 2, lastOpened: now.toISOString() },
        bad: { status: 'x' },
      },
    });
    expect(Object.keys(parseProgress(raw).lessons)).toEqual(['dhcp']);
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
    const raw = JSON.stringify({ version: 2, lastLesson: null, lessons: { 'dhcp': lesson } });
    expect(parseProgress(raw).lessons).toEqual({});
  });

  test('keeps out-of-range positions for sanitize to clamp', () => {
    const raw = JSON.stringify({
      version: 2,
      lastLesson: null,
      lessons: { 'dhcp': { status: 'in-progress', furthestPosition: -4, lastOpened: '' } },
    });
    expect(parseProgress(raw).lessons['dhcp'].furthestPosition).toBe(-4);
  });

  test('a last lesson that is not text becomes null without losing the lessons', () => {
    const raw = JSON.stringify({
      version: 2,
      lastLesson: 7,
      lessons: { 'dhcp': { status: 'finished', furthestPosition: 8, lastOpened: '' } },
    });
    const parsed = parseProgress(raw);
    expect(parsed.lastLesson).toBeNull();
    expect(Object.keys(parsed.lessons)).toEqual(['dhcp']);
  });

  test('a lesson named __proto__ stays an ordinary entry', () => {
    const raw = '{"version":2,"lastLesson":null,"lessons":{"__proto__":{"status":"finished","furthestPosition":1,"lastOpened":""}}}';
    const lessons = parseProgress(raw).lessons;
    expect(Object.keys(lessons)).toEqual(['__proto__']);
    expect(Object.getPrototypeOf(lessons)).toBe(Object.prototype);
  });
});

describe('sanitizeProgress', () => {
  test('clamps known lessons, keeps unknown ones, and forgets an unknown last lesson', () => {
    const d = {
      version: 2 as const,
      lastLesson: 'gone-x',
      lastTrack: 'networking',
      lessons: {
        'dhcp': { status: 'in-progress' as const, furthestPosition: 999, lastOpened: '' },
        'gone-x': { status: 'finished' as const, furthestPosition: 3, lastOpened: '' },
        'subnetting': { status: 'in-progress' as const, furthestPosition: -4, lastOpened: '' },
      },
    };
    const s = sanitizeProgress(d, { 'dhcp': 8, 'subnetting': 9 });
    expect(s.lessons['dhcp'].furthestPosition).toBe(8);
    expect(s.lessons['subnetting'].furthestPosition).toBe(1);
    expect(s.lessons['gone-x']).toEqual(d.lessons['gone-x']);
    expect(s.lastLesson).toBeNull();
    expect(s.lastTrack).toBeNull();
  });

  test('keeps a known last lesson and a finished status', () => {
    const d = recordVisit(emptyProgress(), 'dhcp', 'networking', 8, 8, now);
    const s = sanitizeProgress(d, { 'dhcp': 5 });
    expect(s.lastLesson).toBe('dhcp');
    expect(s.lessons['dhcp']).toMatchObject({ status: 'finished', furthestPosition: 5 });
  });

  test('names that merely exist on every object are not known lessons, and are not a last lesson', () => {
    const lesson = { status: 'in-progress' as const, furthestPosition: 2, lastOpened: '' };
    const d = { version: 2 as const, lastLesson: 'toString', lastTrack: null, lessons: { toString: lesson, constructor: lesson } };
    const s = sanitizeProgress(d, {});
    expect(Object.keys(s.lessons).sort()).toEqual(['constructor', 'toString']);
    expect(s.lastLesson).toBeNull();
  });

  test('an old record past the new last position clamps to it and keeps finished', () => {
    // The live site's DHCP ran Overview, 5 steps, Try it, Check yourself and Recap: positions 0 to 8, finished at 8.
    // The new DHCP is Overview, 5 steps, Learn and Practice: positions 0 to 7.
    const raw = JSON.stringify({
      version: 2,
      lastLesson: 'dhcp',
      lastTrack: 'networking',
      lessons: {
        'dhcp': { status: 'finished', furthestPosition: 8, lastOpened: '2026-11-01T10:00:00.000Z' },
        // An in-progress record past the end clamps too, and stays in progress until Practice is reached again.
        'subnetting': { status: 'in-progress', furthestPosition: 9, lastOpened: '2026-11-01T10:00:00.000Z' },
      },
    });
    const s = sanitizeProgress(parseProgress(raw), { 'dhcp': 7, 'subnetting': 7 });
    expect(s.lessons['dhcp']).toEqual({ status: 'finished', furthestPosition: 7, lastOpened: '2026-11-01T10:00:00.000Z' });
    expect(s.lessons['subnetting']).toEqual({ status: 'in-progress', furthestPosition: 7, lastOpened: '2026-11-01T10:00:00.000Z' });
    expect(s.lastLesson).toBe('dhcp');
    expect(resumePosition(s, 'dhcp')).toBeNull();
    expect(resumePosition(s, 'subnetting')).toBe(7);

    // Opening the finished lesson again, anywhere, keeps it finished; reaching Practice finishes the other.
    const reopened = recordVisit(s, 'dhcp', 'networking', 2, 7, now);
    expect(reopened.lessons['dhcp']).toMatchObject({ status: 'finished', furthestPosition: 7 });
    expect(recordVisit(s, 'subnetting', 'networking', 7, 7, now).lessons['subnetting']!.status).toBe('finished');
  });

  test('does not change its input', () => {
    const d = recordVisit(emptyProgress(), 'dhcp', 'networking', 9, 9, now);
    const before = JSON.stringify(d);
    sanitizeProgress(d, {});
    expect(JSON.stringify(d)).toBe(before);
  });
});

describe('recordVisit', () => {
  test('visit lifecycle', () => {
    let d = recordVisit(emptyProgress(), 'dhcp', 'networking', 0, 8, now);
    expect(d.lastLesson).toBe('dhcp');
    expect(d.lessons['dhcp']).toBeUndefined();
    d = recordVisit(d, 'dhcp', 'networking', 3, 8, now);
    expect(resumePosition(d, 'dhcp')).toBe(3);
    d = recordVisit(d, 'dhcp', 'networking', 2, 8, now);
    expect(d.lessons['dhcp'].furthestPosition).toBe(3);
    d = recordVisit(d, 'dhcp', 'networking', 8, 8, now);
    expect(d.lessons['dhcp'].status).toBe('finished');
    d = recordVisit(d, 'dhcp', 'networking', 1, 8, now);
    expect(d.lessons['dhcp'].status).toBe('finished');
    expect(resumePosition(d, 'dhcp')).toBeNull();
  });

  test('moving past the Overview starts the lesson', () => {
    const d = recordVisit(emptyProgress(), 'dhcp', 'networking', 1, 8, now);
    expect(d.lessons['dhcp']).toEqual({ status: 'in-progress', furthestPosition: 1, lastOpened: now.toISOString() });
  });

  test('jumping straight to the last position (Practice) finishes the lesson', () => {
    const d = recordVisit(emptyProgress(), 'dhcp', 'networking', 8, 8, now);
    expect(d.lessons['dhcp']).toEqual({ status: 'finished', furthestPosition: 8, lastOpened: now.toISOString() });
  });

  test('reopening at the Overview only refreshes the date', () => {
    const later = new Date('2026-11-04T09:30:00Z');
    let d = recordVisit(emptyProgress(), 'dhcp', 'networking', 4, 8, now);
    d = recordVisit(d, 'dhcp', 'networking', 0, 8, later);
    expect(d.lessons['dhcp']).toEqual({ status: 'in-progress', furthestPosition: 4, lastOpened: later.toISOString() });
  });

  test('the last lesson follows the latest visit', () => {
    let d = recordVisit(emptyProgress(), 'dhcp', 'networking', 3, 8, now);
    d = recordVisit(d, 'arp', 'networking', 0, 6, now);
    expect(d.lastLesson).toBe('arp');
    expect(Object.keys(d.lessons)).toEqual(['dhcp']);
  });

  test('does not change its input', () => {
    const d = recordVisit(emptyProgress(), 'dhcp', 'networking', 3, 8, now);
    const before = JSON.stringify(d);
    recordVisit(d, 'dhcp', 'networking', 8, 8, now);
    recordVisit(d, 'arp', 'networking', 2, 6, now);
    expect(JSON.stringify(d)).toBe(before);
  });
});

describe('mergeProgress', () => {
  const known = { 'dhcp': 8, 'arp': 6 };
  const other = { status: 'finished' as const, furthestPosition: 40, lastOpened: 'earlier' };

  function stored(lastLesson: string | null): ProgressData {
    return {
      version: 2,
      lastLesson,
      lastTrack: lastLesson === null ? null : 'networking',
      lessons: {
        'ai-x': other,
        'dhcp': { status: 'in-progress', furthestPosition: 2, lastOpened: 'earlier' },
        'arp': { status: 'finished', furthestPosition: 6, lastOpened: 'earlier' },
      },
    };
  }

  test('lessons that are not known survive untouched', () => {
    const next = recordVisit(sanitizeProgress(stored(null), known), 'dhcp', 'networking', 5, 8, now);
    const merged = mergeProgress(stored(null), next, known);
    expect(merged.lessons['ai-x']).toEqual(other);
    expect(merged.lessons['dhcp']).toMatchObject({ furthestPosition: 5 });
  });

  test('known lessons come from the new data, so one that is gone from it is removed', () => {
    const { 'arp': _removed, ...rest } = sanitizeProgress(stored(null), known).lessons;
    const merged = mergeProgress(stored(null), { version: 2, lessons: rest, lastLesson: null, lastTrack: null }, known);
    expect(Object.keys(merged.lessons).sort()).toEqual(['ai-x', 'dhcp']);
  });

  test.each([
    ['takes the new last lesson when there is one', 'ai-x', 'arp', 'arp'],
    ['keeps a stored last lesson that is not known when the new one is null', 'ai-x', null, 'ai-x'],
    ['drops a stored last lesson that is known when the new one is null', 'dhcp', null, null],
    ['stays null when both are null', null, null, null],
  ])('last lesson: %s', (_label, storedLast, nextLast, expected) => {
    const next = { ...sanitizeProgress(stored(storedLast), known), lastLesson: nextLast };
    expect(mergeProgress(stored(storedLast), next, known).lastLesson).toBe(expected);
  });

  test('does not change its inputs', () => {
    const s = stored('ai-x');
    const next = sanitizeProgress(s, known);
    const before = JSON.stringify([s, next]);
    mergeProgress(s, next, known);
    expect(JSON.stringify([s, next])).toBe(before);
  });
});

describe('resumePosition', () => {
  test('resume only applies to lessons in progress', () => {
    let d = recordVisit(emptyProgress(), 'dhcp', 'networking', 3, 8, now);
    d = recordVisit(d, 'arp', 'networking', 6, 6, now);
    expect(resumePosition(d, 'dhcp')).toBe(3);
    expect(resumePosition(d, 'arp')).toBeNull();
    expect(resumePosition(d, 'never-opened')).toBeNull();
    expect(resumePosition(d, 'toString')).toBeNull();
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
    const d = recordVisit(emptyProgress(), 'dhcp', 'networking', 3, 8, now);
    expect(saveProgress(s, d)).toBe(true);
    expect(s.values.has(PROGRESS_KEY)).toBe(true);
    expect(loadProgress(s)).toEqual(d);
  });

  test('clear removes the record', () => {
    const s = memoryStorage();
    saveProgress(s, recordVisit(emptyProgress(), 'dhcp', 'networking', 3, 8, now));
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

const rec = (status: 'in-progress' | 'finished', furthestPosition: number, lastOpened: string) => ({ status, furthestPosition, lastOpened });

const V1 = JSON.stringify({
  version: 1,
  lastLesson: 'networking/subnetting',
  lessons: {
    'networking/dhcp': rec('finished', 7, '2026-11-06T10:00:00.000Z'),
    'networking/how-the-internet-works': rec('in-progress', 23, '2026-11-06T11:00:00.000Z'),
    'networking/subnetting': rec('in-progress', 3, '2026-11-07T09:00:00.000Z'),
    'networking/osi-model': rec('in-progress', 2, '2026-11-01T09:00:00.000Z'),
  },
});

/** A storage that works until `fail` is set, after which the named operations throw. */
function throwingStorage(fail: { get?: boolean; set?: boolean; remove?: boolean }) {
  const inner = memoryStorage();
  const raw = {
    getItem: (k: string) => {
      if (fail.get) throw new Error('read denied');
      return inner.values.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (fail.set) throw new DOMException('full', 'QuotaExceededError');
      inner.values.set(k, v);
    },
    removeItem: (k: string) => {
      if (fail.remove) throw new Error('remove denied');
      inner.values.delete(k);
    },
  } as unknown as Storage;
  return { values: inner.values, storage: createSafeStorage(() => raw) };
}

describe('migrateV1', () => {
  test('every v1 record carries over under its lesson slug', () => {
    expect(migrateV1(V1)).toEqual({
      version: 2,
      lastLesson: 'subnetting',
      lastTrack: 'networking',
      lessons: {
        dhcp: rec('finished', 7, '2026-11-06T10:00:00.000Z'),
        'how-the-internet-works': rec('in-progress', 23, '2026-11-06T11:00:00.000Z'),
        subnetting: rec('in-progress', 3, '2026-11-07T09:00:00.000Z'),
        'osi-model': rec('in-progress', 2, '2026-11-01T09:00:00.000Z'),
      },
    });
  });

  test('two tracks’ records of one lesson merge: finished wins, furthest and latest kept', () => {
    const raw = JSON.stringify({
      version: 1,
      lastLesson: null,
      lessons: {
        'networking/dhcp': rec('in-progress', 3, '2026-11-01T09:00:00.000Z'),
        'a-plus/dhcp': rec('finished', 7, '2026-10-01T09:00:00.000Z'),
      },
    });
    expect(migrateV1(raw).lessons).toEqual({ dhcp: rec('finished', 7, '2026-11-01T09:00:00.000Z') });
  });

  test.each([
    ['no slash', 'dhcp', 'dhcp'],
    ['more than one slash', 'a/b/dhcp', 'dhcp'],
  ])('a last lesson with %s keeps its slug and has no track', (_label, last, slug) => {
    const raw = JSON.stringify({ version: 1, lastLesson: last, lessons: { [last]: rec('in-progress', 2, '2026-11-01T09:00:00.000Z') } });
    const d = migrateV1(raw);
    expect(d.lastLesson).toBe(slug);
    expect(d.lastTrack).toBeNull();
    expect(Object.keys(d.lessons)).toEqual([slug]);
  });

  test('a key with nothing after its slash is kept whole rather than lost', () => {
    const raw = JSON.stringify({ version: 1, lastLesson: null, lessons: { 'networking/': rec('finished', 2, '2026-11-01T09:00:00.000Z') } });
    expect(Object.keys(migrateV1(raw).lessons)).toEqual(['networking/']);
  });

  test('a lesson named __proto__ migrates as an ordinary entry', () => {
    const raw = '{"version":1,"lastLesson":null,"lessons":{"networking/__proto__":{"status":"finished","furthestPosition":1,"lastOpened":""}}}';
    const lessons = migrateV1(raw).lessons;
    expect(Object.keys(lessons)).toEqual(['__proto__']);
    expect(Object.getPrototypeOf(lessons)).toBe(Object.prototype);
  });

  test.each([null, '', 'not json', '[]', '{"version":2,"lessons":{}}', '{"version":1,"lessons":"x"}'])('migrateV1(%j) is empty', (raw) =>
    expect(migrateV1(raw)).toEqual(emptyProgress()),
  );

  test('a v1 with one malformed record keeps the valid ones', () => {
    const raw = JSON.stringify({
      version: 1,
      lastLesson: null,
      lessons: { 'networking/dhcp': rec('finished', 7, '2026-11-01T09:00:00.000Z'), 'networking/bad': { status: 'x' }, 'networking/arp': rec('in-progress', 2, '2026-11-02T09:00:00.000Z') },
    });
    expect(Object.keys(migrateV1(raw).lessons).sort()).toEqual(['arp', 'dhcp']);
  });
});

describe('mergeRecords', () => {
  test('finished if either is, the larger position, the later date', () => {
    expect(mergeRecords(rec('in-progress', 3, '2026-11-01T09:00:00.000Z'), rec('finished', 2, '2026-10-01T09:00:00.000Z'))).toEqual(
      rec('finished', 3, '2026-11-01T09:00:00.000Z'),
    );
  });

  test('dates compare as dates, not strings, and the stored text is kept', () => {
    // As text "…+05:00" sorts after "…Z" for the same hour, but 10:00+05:00 is 05:00Z, earlier than 06:00Z.
    const a = rec('in-progress', 1, '2026-11-01T10:00:00+05:00');
    const b = rec('in-progress', 1, '2026-11-01T06:00:00.000Z');
    expect(mergeRecords(a, b).lastOpened).toBe('2026-11-01T06:00:00.000Z');
    expect(mergeRecords(b, a).lastOpened).toBe('2026-11-01T06:00:00.000Z');
  });

  test('a date that does not parse yields to the one that does', () => {
    const good = rec('in-progress', 1, '2026-11-01T06:00:00.000Z');
    const bad = rec('in-progress', 1, 'yesterday');
    expect(mergeRecords(good, bad).lastOpened).toBe(good.lastOpened);
    expect(mergeRecords(bad, good).lastOpened).toBe(good.lastOpened);
  });
});

describe('combineProgress', () => {
  const a: ProgressData = { version: 2, lastLesson: 'dhcp', lastTrack: 'networking', lessons: { dhcp: rec('in-progress', 2, '2026-11-01T09:00:00.000Z') } };
  const b: ProgressData = {
    version: 2,
    lastLesson: 'subnetting',
    lastTrack: 'a-plus',
    lessons: { dhcp: rec('finished', 5, '2026-11-02T09:00:00.000Z'), subnetting: rec('in-progress', 1, '2026-11-02T09:00:00.000Z') },
  };

  test('has every lesson of both, collisions merged', () => {
    expect(combineProgress(a, b).lessons).toEqual({ dhcp: rec('finished', 5, '2026-11-02T09:00:00.000Z'), subnetting: rec('in-progress', 1, '2026-11-02T09:00:00.000Z') });
  });

  test('last lesson and last track come together from the primary', () => {
    expect(combineProgress(a, b)).toMatchObject({ lastLesson: 'dhcp', lastTrack: 'networking' });
  });

  test('the primary’s pair is skipped only when it has no last lesson, and then the other’s comes whole', () => {
    expect(combineProgress({ ...a, lastLesson: null, lastTrack: null }, b)).toMatchObject({ lastLesson: 'subnetting', lastTrack: 'a-plus' });
    expect(combineProgress({ ...a, lastLesson: 'dhcp', lastTrack: null }, b)).toMatchObject({ lastLesson: 'dhcp', lastTrack: null });
  });
});

describe('recordVisit sets the last track', () => {
  test('lastTrack follows the visit', () => {
    const d = recordVisit(emptyProgress(), 'dhcp', 'a-plus', 3, 8, now);
    expect(d).toMatchObject({ lastLesson: 'dhcp', lastTrack: 'a-plus' });
  });
});

describe('sanitizeProgress keeps lessons no track lists', () => {
  test('an unlisted record survives as stored; a listed one is clamped', () => {
    const unlisted = rec('finished', 99, '2026-11-01T09:00:00.000Z');
    const d: ProgressData = { version: 2, lastLesson: null, lastTrack: null, lessons: { 'osi-model': unlisted, dhcp: rec('in-progress', 99, '2026-11-01T09:00:00.000Z') } };
    const s = sanitizeProgress(d, { dhcp: 7 });
    expect(s.lessons['osi-model']).toEqual(unlisted);
    expect(s.lessons.dhcp!.furthestPosition).toBe(7);
  });

  test('last lesson and last track go together, both null when the lesson is unknown', () => {
    const d: ProgressData = { version: 2, lastLesson: 'osi-model', lastTrack: 'networking', lessons: {} };
    expect(sanitizeProgress(d, { dhcp: 7 })).toMatchObject({ lastLesson: null, lastTrack: null });
    expect(sanitizeProgress({ ...d, lastLesson: 'dhcp' }, { dhcp: 7 })).toMatchObject({ lastLesson: 'dhcp', lastTrack: 'networking' });
  });
});

describe('mergeProgress keeps the last track with the last lesson', () => {
  test('a stored unknown last lesson keeps its own track', () => {
    const stored: ProgressData = { version: 2, lastLesson: 'osi-model', lastTrack: 'networking', lessons: {} };
    const next: ProgressData = { version: 2, lastLesson: null, lastTrack: null, lessons: {} };
    expect(mergeProgress(stored, next, { dhcp: 7 })).toMatchObject({ lastLesson: 'osi-model', lastTrack: 'networking' });
  });
});

describe('progress storage across v1 and v2', () => {
  test('a save writes v2 and only then removes v1', () => {
    const s = memoryStorage();
    s.set(LEGACY_PROGRESS_KEY, V1);
    expect(saveProgress(s, recordVisit(loadProgress(s), 'dhcp', 'networking', 7, 7, now))).toBe(true);
    expect(s.values.has(PROGRESS_KEY)).toBe(true);
    expect(s.values.has(LEGACY_PROGRESS_KEY)).toBe(false);
  });

  test('a failed v2 write keeps v1, and a later load still has every record', () => {
    const t = throwingStorage({ set: true });
    t.values.set(LEGACY_PROGRESS_KEY, V1);
    const next = recordVisit(loadProgress(t.storage), 'dhcp', 'networking', 3, 7, now);
    expect(saveProgress(t.storage, next)).toBe(false);
    expect(t.values.get(LEGACY_PROGRESS_KEY)).toBe(V1);
    expect(t.values.has(PROGRESS_KEY)).toBe(false);
    // The old lesson 1 record (v1, at 23) loads as the How the Internet Works lessons it covered: HTTP and HTTPS
    // finished, TCP in progress at 6.
    const loaded = loadProgress(memoryStorageWith(t.values)).lessons;
    expect(Object.keys(loaded).sort()).toEqual(['dhcp', 'osi-model', 'subnetting', 'what-is-http', 'what-is-https', 'what-is-tcp']);
    expect([loaded['what-is-http']!.status, loaded['what-is-https']!.status]).toEqual(['finished', 'finished']);
    expect(loaded['what-is-tcp']).toMatchObject({ status: 'in-progress', furthestPosition: 6 });
  });

  test('v1 written after migration (an old tab) is merged on the next load', () => {
    const s = memoryStorage();
    s.set(PROGRESS_KEY, JSON.stringify({ version: 2, lastLesson: 'dhcp', lastTrack: 'networking', lessons: { dhcp: rec('finished', 7, '2026-11-06T10:00:00.000Z') } }));
    s.set(LEGACY_PROGRESS_KEY, JSON.stringify({ version: 1, lastLesson: 'networking/subnetting', lessons: { 'networking/subnetting': rec('in-progress', 3, '2026-11-07T09:00:00.000Z') } }));
    const d = loadProgress(s);
    expect(Object.keys(d.lessons).sort()).toEqual(['dhcp', 'subnetting']);
    expect(d).toMatchObject({ lastLesson: 'dhcp', lastTrack: 'networking' });
    saveProgress(s, d);
    expect(s.values.has(LEGACY_PROGRESS_KEY)).toBe(false);
    expect(Object.keys(parseProgress(s.get(PROGRESS_KEY)).lessons).sort()).toEqual(['dhcp', 'subnetting']);
  });

  test('a lesson no track lists yet survives migration and a later save of another lesson', () => {
    const s = memoryStorage();
    s.set(LEGACY_PROGRESS_KEY, V1);
    const known = { dhcp: 7 };
    const stored = loadProgress(s);
    const next = recordVisit(sanitizeProgress(stored, known), 'dhcp', 'networking', 4, 7, now);
    saveProgress(s, mergeProgress(stored, sanitizeProgress(next, known), known));
    expect(parseProgress(s.get(PROGRESS_KEY)).lessons['osi-model']).toEqual(rec('in-progress', 2, '2026-11-01T09:00:00.000Z'));
  });

  test('one malformed v1 record among valid ones: the valid ones and the new visit land in v2, v1 is gone', () => {
    const s = memoryStorage();
    s.set(
      LEGACY_PROGRESS_KEY,
      JSON.stringify({
        version: 1,
        lastLesson: null,
        lessons: { 'networking/dhcp': rec('finished', 7, '2026-11-01T09:00:00.000Z'), 'networking/bad': { nope: true }, 'networking/arp': rec('in-progress', 2, '2026-11-02T09:00:00.000Z') },
      }),
    );
    const d = recordVisit(loadProgress(s), 'subnetting', 'networking', 2, 7, now);
    expect(saveProgress(s, d)).toBe(true);
    expect(Object.keys(parseProgress(s.get(PROGRESS_KEY)).lessons).sort()).toEqual(['arp', 'dhcp', 'subnetting']);
    expect(s.values.has(LEGACY_PROGRESS_KEY)).toBe(false);
  });

  test('storage that throws on every call loads empty and never throws', () => {
    const t = throwingStorage({ get: true, set: true, remove: true });
    expect(loadProgress(t.storage)).toEqual(emptyProgress());
    expect(saveProgress(t.storage, emptyProgress())).toBe(false);
    expect(() => clearProgress(t.storage)).not.toThrow();
  });

  test('clearing removes both keys, even when one removal throws', () => {
    const values = new Map<string, string>([
      [PROGRESS_KEY, '{}'],
      [LEGACY_PROGRESS_KEY, V1],
    ]);
    let first = true;
    const raw = {
      getItem: (k: string) => values.get(k) ?? null,
      setItem: (k: string, v: string) => void values.set(k, v),
      removeItem: (k: string) => {
        if (first) {
          first = false;
          throw new Error('remove denied');
        }
        values.delete(k);
      },
    } as unknown as Storage;
    expect(() => clearProgress(createSafeStorage(() => raw))).not.toThrow();
    // The first removal (v2) threw; the old record is still removed.
    expect(values.has(LEGACY_PROGRESS_KEY)).toBe(false);
  });

  test('malformed v1 reads as nothing and leaves v2 alone', () => {
    const s = memoryStorage();
    const v2 = recordVisit(emptyProgress(), 'dhcp', 'networking', 3, 7, now);
    saveProgress(s, v2);
    s.set(LEGACY_PROGRESS_KEY, 'not json');
    expect(loadProgress(s)).toEqual(v2);
  });
});

function memoryStorageWith(values: Map<string, string>): SafeStorage {
  const s = memoryStorage();
  for (const [k, v] of values) s.values.set(k, v);
  return s;
}
