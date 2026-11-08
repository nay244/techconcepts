import { expect, test } from 'vitest';
import { getEntries } from '../content/registry';
import { INTERNET_SPLIT, INTERNET_TRACK, OLD_INTERNET_KEY, splitInternet } from './internet-split';
import type { ProgressData } from './store';

const rec = (status: 'in-progress' | 'finished', furthestPosition: number, lastOpened: string) => ({ status, furthestPosition, lastOpened });
const AT = '2026-11-06T11:00:00.000Z';
const OTHER = '2026-11-07T09:00:00.000Z';

const data = (lessons: ProgressData['lessons'], lastLesson: string | null = null, lastTrack: string | null = null): ProgressData => ({
  version: 2,
  lessons,
  lastLesson,
  lastTrack,
});
const old = (status: 'in-progress' | 'finished', furthest: number) => data({ [OLD_INTERNET_KEY]: rec(status, furthest, AT) });

test('the table is the track’s lessons and their sizes', () => {
  const entries = getEntries(INTERNET_TRACK);
  expect(INTERNET_SPLIT).toEqual(entries.map((e) => [e.slug, e.available ? e.maxPosition + 1 : 0]));
  expect(INTERNET_SPLIT.map(([, size]) => size)).toEqual([8, 9, 9, 8, 8, 8, 9, 9, 9, 8, 8, 9, 9, 9]);
  expect(INTERNET_SPLIT.reduce((sum, [, size]) => sum + size, 0)).toBe(120);
});

test('data without the old lesson is returned as it is', () => {
  const d = data({ dhcp: rec('finished', 7, AT) }, 'dhcp', 'networking');
  expect(splitInternet(d)).toBe(d);
});

test('a finished old lesson finishes all 14, at each one’s last step, keeping its time', () => {
  const out = splitInternet(old('finished', 119));
  expect(out.lessons).toEqual(Object.fromEntries(INTERNET_SPLIT.map(([slug, size]) => [slug, rec('finished', size - 1, AT)])));
});

test('partway: protocols before the furthest step are finished, the one holding it is in progress at the same step, later ones have no record', () => {
  // 30 is past HTTP (0–7), HTTPS (8–16) and TCP (17–25), and is step 4 of UDP (26–33).
  const out = splitInternet(old('in-progress', 30));
  expect(out.lessons).toEqual({
    'what-is-http': rec('finished', 7, AT),
    'what-is-https': rec('finished', 8, AT),
    'what-is-tcp': rec('finished', 8, AT),
    'what-is-udp': rec('in-progress', 4, AT),
  });
  expect(Object.hasOwn(out.lessons, 'what-is-ip')).toBe(false);
  expect(Object.hasOwn(out.lessons, OLD_INTERNET_KEY)).toBe(false);
});

test('a furthest step on a protocol’s Overview gives it no record', () => {
  const out = splitInternet(old('in-progress', 17));
  expect(out.lessons).toEqual({ 'what-is-http': rec('finished', 7, AT), 'what-is-https': rec('finished', 8, AT) });
});

test('a furthest step on a protocol’s last step finishes it', () => {
  const out = splitInternet(old('in-progress', 25));
  expect(out.lessons['what-is-tcp']).toEqual(rec('finished', 8, AT));
  expect(Object.keys(out.lessons)).toEqual(['what-is-http', 'what-is-https', 'what-is-tcp']);
});

test('a furthest step past the end counts as the last step', () => {
  const out = splitInternet(old('in-progress', 500));
  expect(out.lessons).toEqual(Object.fromEntries(INTERNET_SPLIT.map(([slug, size]) => [slug, rec('finished', size - 1, AT)])));
});

test('the last lesson follows the furthest step, into the new track', () => {
  const out = splitInternet(data({ [OLD_INTERNET_KEY]: rec('in-progress', 30, AT) }, OLD_INTERNET_KEY, 'networking'));
  expect([out.lastLesson, out.lastTrack]).toEqual(['what-is-udp', 'how-the-internet-works']);
});

test('a last lesson that names the old lesson with no record points at HTTP', () => {
  const out = splitInternet(data({ dhcp: rec('finished', 7, AT) }, OLD_INTERNET_KEY, 'networking'));
  expect([out.lastLesson, out.lastTrack]).toEqual(['what-is-http', 'how-the-internet-works']);
  expect(out.lessons).toEqual({ dhcp: rec('finished', 7, AT) });
});

test('a last lesson elsewhere is left alone', () => {
  const out = splitInternet(data({ [OLD_INTERNET_KEY]: rec('in-progress', 30, AT), dhcp: rec('finished', 7, AT) }, 'dhcp', 'networking'));
  expect([out.lastLesson, out.lastTrack]).toEqual(['dhcp', 'networking']);
  expect(out.lessons.dhcp).toEqual(rec('finished', 7, AT));
});

test('an old record that turns up again merges into the new ones; finished stays finished', () => {
  // An old tab can write v1 after the split: its old record meets the new ones.
  const out = splitInternet(
    data({
      'what-is-http': rec('finished', 7, OTHER),
      'what-is-https': rec('in-progress', 2, OTHER),
      [OLD_INTERNET_KEY]: rec('in-progress', 10, AT),
    }),
  );
  expect(out.lessons).toEqual({
    'what-is-http': rec('finished', 7, OTHER),
    'what-is-https': rec('in-progress', Math.max(2, 10 - 8), OTHER),
  });
});
