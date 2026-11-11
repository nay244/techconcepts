import { describe, expect, test } from 'vitest';
import { getEntries, getLesson } from '../content/registry';
import { comingSoonTracks, tracks } from '../content/tracks';
import { comingTracksSentence, factCheckSentence, sourceRows } from './about';

describe('comingTracksSentence', () => {
  test('names the tracks still to come, in order, in one sentence (about-v1)', () => {
    expect(comingTracksSentence(comingSoonTracks.map((t) => t.title))).toBe(
      'Four more tracks are on the way: Cryptography, AI Concepts, Privilege Escalation, and Threat & Vulnerability Management.',
    );
  });

  test('counts in words, and reads right for one track or two', () => {
    expect(comingTracksSentence(['Cryptography'])).toBe('One more track is on the way: Cryptography.');
    expect(comingTracksSentence(['Cryptography', 'AI Concepts'])).toBe('Two more tracks are on the way: Cryptography and AI Concepts.');
    expect(comingTracksSentence(Array.from({ length: 12 }, (_, i) => `T${i + 1}`))).toMatch(/^12 more tracks are on the way: T1, T2, .*, and T12\.$/);
  });

  test('says nothing when no track is still to come', () => {
    expect(comingTracksSentence([])).toBe('');
  });
});

describe('factCheckSentence', () => {
  // The count of ready lessons, as the registry has it: the sentence's total is never a typed number.
  const TOTAL = new Set(tracks.flatMap((t) => getEntries(t.id)).flatMap((e) => (e.available ? [e.slug] : []))).size;

  test('says how many lessons have been checked so far, and that the others wait', () => {
    expect(factCheckSentence(1, TOTAL)).toBe(
      `So far 1 of ${TOTAL} lessons has also been through an independent check of every claim against those sources. The others are waiting for theirs.`,
    );
    expect(factCheckSentence(5, TOTAL)).toMatch(new RegExp(`^So far 5 of ${TOTAL} lessons have also been through `));
    expect(factCheckSentence(0, TOTAL)).toMatch(new RegExp(`^So far 0 of ${TOTAL} lessons have also been through `));
  });

  test('says every lesson has been checked once they all have', () => {
    expect(factCheckSentence(TOTAL, TOTAL)).toBe('Every lesson has also been through an independent check of every claim against those sources.');
  });

  test('says nothing when there is no ready lesson', () => {
    expect(factCheckSentence(0, 0)).toBe('');
  });
});

describe('sourceRows', () => {
  test('splits each source into its standard and its title, as About lists the DHCP lesson’s', () => {
    const dhcp = getLesson('dhcp')!;
    expect(sourceRows(dhcp.units.flatMap((u) => u.references))).toEqual([
      { standard: 'RFC 2131', title: 'Dynamic Host Configuration Protocol', url: 'https://www.rfc-editor.org/rfc/rfc2131' },
      { standard: 'RFC 2132', title: 'DHCP Options and BOOTP Vendor Extensions', url: 'https://www.rfc-editor.org/rfc/rfc2132' },
    ]);
  });

  test('a title may hold a colon of its own; only the first one splits', () => {
    expect(sourceRows([{ label: 'RFC 9110: HTTP Semantics: Methods', url: 'https://www.rfc-editor.org/rfc/rfc9110' }])).toEqual([
      { standard: 'RFC 9110', title: 'HTTP Semantics: Methods', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
    ]);
  });

  test('a source with no "<standard>: <title>" label is named', () => {
    expect(() => sourceRows([{ label: 'Some page', url: 'https://example.org/' }])).toThrow(
      'The source "Some page" has no "<standard>: <title>" label, which About’s list needs.',
    );
  });
});
