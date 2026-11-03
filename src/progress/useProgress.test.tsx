// @vitest-environment jsdom
import { act, render, renderHook, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { createSafeStorage } from '../lib/storage';
import { PROGRESS_KEY, emptyProgress, recordVisit } from './store';
import type { ProgressData } from './store';
import { useProgress } from './useProgress';

const now = new Date('2026-11-03T12:00:00Z');
const known = { 'networking/dhcp': 8, 'networking/arp': 6 };

function saved(): ProgressData | null {
  const raw = window.localStorage.getItem(PROGRESS_KEY);
  return raw === null ? null : (JSON.parse(raw) as ProgressData);
}

/** What another tab does: write the record, then the browser tells this tab. */
function writeFromAnotherTab(data: ProgressData): void {
  const value = JSON.stringify(data);
  window.localStorage.setItem(PROGRESS_KEY, value);
  window.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_KEY, newValue: value }));
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('ready is false in the server render and true once mounted', () => {
  function Probe() {
    const { ready } = useProgress(known);
    return <p data-testid="state">{ready ? 'ready' : 'not ready'}</p>;
  }
  expect(renderToString(<Probe />)).toContain('not ready');

  render(<Probe />);
  expect(screen.getByTestId('state')).toHaveTextContent('ready');
});

test('starts empty when nothing is saved', () => {
  const { result } = renderHook(() => useProgress(known));
  expect(result.current.ready).toBe(true);
  expect(result.current.available).toBe(true);
  expect(result.current.data).toEqual(emptyProgress());
});

test('loads saved progress, dropping unknown lessons and clamping positions', () => {
  const stored = recordVisit(recordVisit(emptyProgress(), 'networking/dhcp', 99, 99, now), 'gone/x', 2, 5, now);
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored));

  const { result } = renderHook(() => useProgress(known));
  expect(Object.keys(result.current.data.lessons)).toEqual(['networking/dhcp']);
  expect(result.current.data.lessons['networking/dhcp'].furthestPosition).toBe(8);
  expect(result.current.data.lastLesson).toBeNull();
});

test('blocked storage: available is false and nothing throws', () => {
  const blocked = createSafeStorage(() => {
    throw new Error('blocked');
  });
  const { result } = renderHook(() => useProgress(known, blocked));
  expect(result.current.ready).toBe(true);
  expect(result.current.available).toBe(false);
  expect(result.current.data).toEqual(emptyProgress());

  expect(() => act(() => result.current.update((d) => recordVisit(d, 'networking/dhcp', 3, 8, now)))).not.toThrow();
  expect(() => act(() => result.current.reset())).not.toThrow();
  expect(result.current.available).toBe(false);
});

test('a write that storage refuses makes progress unavailable', () => {
  const readOnly = {
    getItem: () => null,
    setItem: () => {
      throw new DOMException('full', 'QuotaExceededError');
    },
    removeItem() {},
  } as unknown as Storage;
  const full = createSafeStorage(() => readOnly);
  const { result } = renderHook(() => useProgress(known, full));
  expect(result.current.available).toBe(true);

  act(() => result.current.update((d) => recordVisit(d, 'networking/dhcp', 3, 8, now)));
  expect(result.current.available).toBe(false);
});

test('update saves the new record and shows it', () => {
  const { result } = renderHook(() => useProgress(known));
  act(() => result.current.update((d) => recordVisit(d, 'networking/dhcp', 3, 8, now)));

  expect(result.current.data.lastLesson).toBe('networking/dhcp');
  expect(result.current.data.lessons['networking/dhcp']).toMatchObject({ status: 'in-progress', furthestPosition: 3 });
  expect(saved()).toEqual(result.current.data);
});

test('update builds on what is saved now, not on a stale copy', () => {
  const { result } = renderHook(() => useProgress(known));
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(recordVisit(emptyProgress(), 'networking/arp', 6, 6, now)));

  act(() => result.current.update((d) => recordVisit(d, 'networking/dhcp', 2, 8, now)));
  expect(Object.keys(saved()?.lessons ?? {}).sort()).toEqual(['networking/arp', 'networking/dhcp']);
});

test('a storage event for the progress key reloads the data', () => {
  const { result } = renderHook(() => useProgress(known));
  expect(result.current.data).toEqual(emptyProgress());

  const fromOtherTab = recordVisit(emptyProgress(), 'networking/dhcp', 5, 8, now);
  act(() => writeFromAnotherTab(fromOtherTab));
  expect(result.current.data).toEqual(fromOtherTab);
});

test('clearing storage in another tab reloads the data too', () => {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(recordVisit(emptyProgress(), 'networking/dhcp', 5, 8, now)));
  const { result } = renderHook(() => useProgress(known));
  expect(result.current.data.lastLesson).toBe('networking/dhcp');

  act(() => {
    window.localStorage.clear();
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
  });
  expect(result.current.data).toEqual(emptyProgress());
});

test('storage events for other keys are ignored', () => {
  const { result } = renderHook(() => useProgress(known));
  act(() => {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(recordVisit(emptyProgress(), 'networking/dhcp', 5, 8, now)));
    window.dispatchEvent(new StorageEvent('storage', { key: 'techconcepts:theme', newValue: 'dark' }));
  });
  expect(result.current.data).toEqual(emptyProgress());
});

test('reset clears the key and the data', () => {
  const { result } = renderHook(() => useProgress(known));
  act(() => result.current.update((d) => recordVisit(d, 'networking/dhcp', 3, 8, now)));
  expect(window.localStorage.getItem(PROGRESS_KEY)).not.toBeNull();

  act(() => result.current.reset());
  expect(window.localStorage.getItem(PROGRESS_KEY)).toBeNull();
  expect(result.current.data).toEqual(emptyProgress());
  expect(result.current.ready).toBe(true);
});

test('stops listening for storage events after unmount', () => {
  const remove = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useProgress(known));
  unmount();
  expect(remove).toHaveBeenCalledWith('storage', expect.any(Function));
});

test('update and reset keep the same identity across renders', () => {
  const { result, rerender } = renderHook(() => useProgress({ ...known }));
  const { update, reset } = result.current;
  rerender();
  expect(result.current.update).toBe(update);
  expect(result.current.reset).toBe(reset);
});
