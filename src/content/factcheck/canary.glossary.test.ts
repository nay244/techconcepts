import { expect, test } from 'vitest';
import { GLOSSARY, GLOSSARY_GROUPS, checkGlossaryGroups } from '../glossary';
import { CANARY_GROUP } from './canary/glossary';
import { CANARY_LESSON, CANARY_SOURCES } from './canary/lesson';
import { CANARY_GROUP_ID, DEFAULT_DEPS, canaryGroupReportPath, runFactCheck } from './cli';
import { parseReport } from './report';
import { groupSheet } from './sheet';

// The canary glossary group (docs/glossary-path-spec.md §7): a true DHCP and HTTP group with five planted faults, citing
// real sources. The real fact-checker's report on it must flag every fault and pass everything else. The faults are
// listed here, not in the group's file, so the checker never sees which items they are.
//
// Every correct statement was checked against its cited section when the canary was written (2026-11-13), by grep in
// the saved RFC texts from rfc-editor.org:
// - RFC 2131 §1 (Introduction): "The Dynamic Host Configuration Protocol (DHCP) provides configuration parameters to
//   Internet hosts." (dhcp statement 1, which also gives the name, so the first spelling is given by it);
// - RFC 2131 §4.1: "DHCP uses UDP as its transport protocol. DHCP messages from a client to a server are sent to the
//   'DHCP server' port (67), and DHCP messages from a server to a client are sent to the 'DHCP client' port (68)."
//   (dhcp statement 2);
// - RFC 2131 §3.1, Table 2: "DHCPDISCOVER - Client broadcast to locate available servers." (discover, and the client's
//   broadcast in "request");
// - RFC 2131 §3.1, step 2: "Each server may respond with a DHCPOFFER message that includes an available network address
//   in the 'yiaddr' field" (offer);
// - RFC 2131 §3.1, step 3: "The client broadcasts a DHCPREQUEST message that MUST include the 'server identifier' option"
//   and "The 'requested IP address' option MUST be set to the value of 'yiaddr' in the DHCPOFFER message from the
//   server." (request in DHCP, which RFC 9110 does not state);
// - RFC 9110 §9.3.1: "The GET method requests transfer of a current selected representation for the target resource."
//   (request in HTTP, statement 1);
// - RFC 2131 §1.1 and §3.3 give a lease its meaning as an address lent for a time the server chooses; no section gives 24
//   hours (the lease statement, a planted fault, which still gives the name "lease").
//   RFC 2616 is obsoleted by RFC 9110 (the second HTTP statement, a planted fault).

/** Each planted fault's claim-sheet key, and what is wrong with it. Every other item is correct. */
const CANARY_GROUP_FAULTS: Record<string, string> = {
  'entry "dhcp": names': 'The second spelling, "Dynamic Host Control Protocol", is given by no statement of the entry: it is not the protocol\'s name.',
  'entry "offer": lessons': 'It ties the lesson term that names the whole protocol (term-dhcp), another thing than a DHCPOFFER message.',
  'entry "lease": statement "lease-1"': 'No source gives a fixed 24 hours; the lease time is the server\'s choice.',
  'entry "request", sense "dhcp": statement "request-dhcp-1"': 'The second source, RFC 9110 §9.3.1, is about HTTP GET and does not state that the client broadcasts DHCPREQUEST.',
  'entry "request", sense "http": statement "request-http-2"': 'It cites RFC 2616 as the defining standard, but RFC 2616 is obsoleted; RFC 9110 now defines GET.',
};

const sheet = () => groupSheet(CANARY_GROUP, CANARY_SOURCES, [CANARY_LESSON]);

test('A8.1 the canary group is valid under every in-group rule, and is in no glossary', () => {
  expect(CANARY_GROUP.id).toBe(CANARY_GROUP_ID);
  expect(GLOSSARY_GROUPS.some((g) => g.id === CANARY_GROUP_ID)).toBe(false);
  expect(GLOSSARY.some((e) => ['dhcp', 'discover', 'offer', 'lease', 'request'].includes(e.id) && CANARY_GROUP.entries.includes(e))).toBe(false);
  expect(checkGlossaryGroups([CANARY_GROUP])).toEqual([]);
});

test('A8.2 every planted fault is a key of its sheet, and the group\'s file names none of them', () => {
  const keys = sheet().items.map((i) => i.key);
  expect(Object.keys(CANARY_GROUP_FAULTS)).toHaveLength(5);
  for (const key of Object.keys(CANARY_GROUP_FAULTS)) expect(keys).toContain(key);
  expect(keys).toHaveLength(17);
  expect(Object.values(import.meta.glob<string>('./canary/glossary.ts', { query: '?raw', import: 'default', eager: true }))[0]!).not.toMatch(/fault|wrong|planted/i);
});

test('A8.3 its ties name real terms of the canary lesson', () => {
  const terms = CANARY_LESSON.units[0]!.learn.terms.map((t) => t.id);
  expect(terms).toEqual(expect.arrayContaining(['term-1', 'term-dhcp']));
  const ties = sheet().items.filter((i) => i.kind === 'tie');
  expect(ties.map((i) => i.key)).toEqual(['entry "discover": lessons', 'entry "offer": lessons']);
});

test('the command prints the canary group\'s sheet and points to its own report', async () => {
  const run = await runFactCheck(['glossary/fact-check-canary']);
  expect(run.code, run.out).toBe(0);
  expect(run.out).toContain(`Hash: \`${sheet().hash}\``);
  expect(run.out.endsWith(`Write your report to: ${canaryGroupReportPath}`)).toBe(true);
});

test('A8.4 the canary report matches the group and flags every planted fault', () => {
  const raw = DEFAULT_DEPS.readFile(canaryGroupReportPath);
  expect(raw, `no report at ${canaryGroupReportPath}; dispatch the fact-checker with "The glossary group: ${CANARY_GROUP_ID}."`).toBeDefined();
  const { header, issues } = parseReport(raw!);
  expect(issues).toEqual([]);
  expect(header!.slug).toBe(`glossary/${CANARY_GROUP_ID}`);
  expect(header!.hash).toBe(sheet().hash);
  for (const item of sheet().items) {
    const verdict = header!.verdicts[item.key];
    if (Object.hasOwn(CANARY_GROUP_FAULTS, item.key)) expect(verdict, `planted fault: ${CANARY_GROUP_FAULTS[item.key]}`).not.toBe('✅');
    else expect(verdict, `a correct item: ${item.key}`).toBe('✅');
  }
});
