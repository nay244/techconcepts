import { expect, test } from 'vitest';
import { analyticsBeacon } from './analytics';

test('no token (unset, empty or blank) means no beacon', () => {
  expect(analyticsBeacon(undefined)).toBeNull();
  expect(analyticsBeacon('')).toBeNull();
  expect(analyticsBeacon('   ')).toBeNull();
});

test('a token gives the cookieless Cloudflare beacon, deferred, with the token as JSON', () => {
  const beacon = analyticsBeacon('abc123');
  expect(beacon).not.toBeNull();
  expect(beacon!.src).toBe('https://static.cloudflareinsights.com/beacon.min.js');
  expect(beacon!.defer).toBe(true);
  expect(JSON.parse(beacon!['data-cf-beacon'])).toEqual({ token: 'abc123' });
});

test('the token is serialized, so quotes and markup cannot break out of the attribute', () => {
  const beacon = analyticsBeacon(' a"b\'<c> ');
  expect(JSON.parse(beacon!['data-cf-beacon'])).toEqual({ token: 'a"b\'<c>' });
});
