// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createSafeStorage } from './storage';

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('works with a real backing store', () => {
  const s = createSafeStorage(() => window.localStorage);
  expect(s.set('k', 'v')).toBe(true);
  expect(s.get('k')).toBe('v');
  expect(s.available).toBe(true);
});

test('never throws when storage is blocked', () => {
  const s = createSafeStorage(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  expect(s.available).toBe(false);
  expect(s.get('k')).toBeNull();
  expect(s.set('k', 'v')).toBe(false);
  expect(() => s.remove('k')).not.toThrow();
});

test('set returns false when storage is full', () => {
  const full = {
    getItem: () => null,
    setItem: () => {
      throw new DOMException('full', 'QuotaExceededError');
    },
    removeItem() {},
  } as unknown as Storage;
  const s = createSafeStorage(() => full);
  expect(s.set('k', 'v')).toBe(false);
  expect(s.available).toBe(false);
});

test('get returns null for a missing key and after remove', () => {
  const s = createSafeStorage(() => window.localStorage);
  expect(s.get('missing')).toBeNull();
  s.set('k', 'v');
  s.remove('k');
  expect(s.get('k')).toBeNull();
});

test('get returns null when reading throws', () => {
  const broken = {
    getItem: () => {
      throw new DOMException('denied', 'SecurityError');
    },
    setItem() {},
    removeItem() {},
  } as unknown as Storage;
  const s = createSafeStorage(() => broken);
  expect(s.get('k')).toBeNull();
  expect(s.available).toBe(false);
});

test('is unavailable when there is no backing store', () => {
  const s = createSafeStorage(() => undefined);
  expect(s.available).toBe(false);
  expect(s.get('k')).toBeNull();
  expect(s.set('k', 'v')).toBe(false);
  expect(() => s.remove('k')).not.toThrow();
});

test('the default backing is window.localStorage, evaluated lazily', () => {
  const s = createSafeStorage();
  expect(s.set('k', 'v')).toBe(true);
  expect(window.localStorage.getItem('k')).toBe('v');
});

test('survives a window.localStorage getter that throws', () => {
  const spy = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('blocked', 'SecurityError');
  });
  const s = createSafeStorage();
  expect(s.available).toBe(false);
  expect(s.get('k')).toBeNull();
  expect(s.set('k', 'v')).toBe(false);
  expect(() => s.remove('k')).not.toThrow();
  expect(spy).toHaveBeenCalled();
});
