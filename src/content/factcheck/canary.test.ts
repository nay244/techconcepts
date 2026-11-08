import { expect, test } from 'vitest';
import { getLesson } from '../registry';
import { CANARY_LESSON, CANARY_SOURCES } from './canary/lesson';
import { CANARY_SLUG, DEFAULT_DEPS, canaryReportPath } from './cli';
import { parseReport } from './report';
import { claimSheet } from './sheet';

// The canary (fact-checker design §9): a true DHCP lesson with five planted faults, citing real sources. The real
// fact-checker's report on it must flag every fault and pass everything else. The faults are listed here, not in the
// lesson's file, so the checker never sees which items they are.
//
// Every correct claim was checked against its cited section when the canary was written (2026-11-08):
// - RFC 2131 §3.1: the client broadcasts DHCPDISCOVER, each server may answer with DHCPOFFER, then DHCPREQUEST and
//   DHCPACK;
// - RFC 2131 §4.1: DHCP uses UDP; client to server goes to port 67, server to client to port 68;
// - RFC 2131 §1: the protocol's name.

const at = 'units[0]';

/** Each planted fault's claim-sheet key, and what is wrong with it. Every other item is correct. */
const CANARY_FAULTS: Record<string, string> = {
  [`${at}.learn.lead[2] ("lead-3")`]: 'Neither cited source says a server always offers a 24-hour lease; the lease time is the server’s choice.',
  [`${at}.learn.facts[2] ("fact-3")`]: 'It cites RFC 2616 as the defining standard, but RFC 2616 is obsoleted; RFC 9110 now defines GET.',
  [`${at}.learn.why[0] ("why-1")`]: 'The second source, RFC 9110 §9.3.1, is about HTTP GET and does not state that the client broadcasts DHCPDISCOVER.',
  [`${at}.practice[0].options[1] (question "q1")`]: 'It marks RFC 2131 §4.1 as the defining standard for HTTPS on TCP port 443; RFC 2131 defines DHCP, not HTTPS.',
  [`${at}.steps[1].facts[1] (step "offer", fact "Lease time")`]: 'Watch adds a value: the fact it traces names the four messages and says nothing of an 8-day lease.',
};

const sheet = () => claimSheet(CANARY_LESSON, CANARY_SOURCES);

test('the canary is a valid cited lesson outside the site', () => {
  expect(CANARY_LESSON.slug).toBe(CANARY_SLUG);
  expect(CANARY_LESSON.origin).toBe('cited');
  expect(getLesson(CANARY_SLUG)).toBeUndefined();
});

test('every planted fault is a key of its sheet', () => {
  const keys = sheet().items.map((i) => i.key);
  expect(Object.keys(CANARY_FAULTS)).toHaveLength(5);
  for (const key of Object.keys(CANARY_FAULTS)) expect(keys).toContain(key);
});

test('the canary report matches the canary and flags every planted fault', () => {
  const raw = DEFAULT_DEPS.readFile(canaryReportPath);
  expect(raw, `no report at ${canaryReportPath}; dispatch the fact-checker with "Check lesson ${CANARY_SLUG}."`).toBeDefined();
  const { header, issues } = parseReport(raw!);
  expect(issues).toEqual([]);
  expect(header!.hash).toBe(sheet().hash);
  for (const item of sheet().items) {
    const verdict = header!.verdicts[item.key];
    if (Object.hasOwn(CANARY_FAULTS, item.key)) expect(verdict, `planted fault: ${CANARY_FAULTS[item.key]}`).not.toBe('✅');
    else expect(verdict, `a correct item: ${item.key}`).toBe('✅');
  }
});
