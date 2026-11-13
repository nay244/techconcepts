# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947 and its second (the glossary in the lessons' own words) at 93b5b4f.

**Status: job 9 is done** (2026-11-13, on Opus 5.5). The owner said go (2026-11-13, "Go"), which approved the fourteen decisions below. B7, G1, B9, the pilot (P1), D9 (approved, "Approve D9", variant B), B8 and F9 are done (`team.md`). B8 passed its review with five fixes and is merged (`dabf636`); on `revamp` `npm test` (1,819), `npm run build` and the full `npm run e2e` (1,274 passed, 384 skipped) pass. The owner approved G1's list, all 113 (direction 2.42). Still the owner's: job 10 (the other 103 entries, about 5.9 million tokens); whether any lesson line is rewritten (decision 4); the errata of B7, B9 and B8 (below and in `docs/glossary-path-spec.md` §10); and anything that leaves the machine. Earlier, at the design gate for D8, the owner asked for real definitions (direction 2.39); D8 was not approved.

## Inputs

| | |
|---|---|
| **The job** | Job 9, Phase 5: a **Glossary of written definitions**, each sentence cited and fact-checked as a lesson's is, begun as a **pilot of about a dozen entries**; the lessons' own terms looked at again in the light of those definitions; and, as before, the removal of the legacy path as a build unit with no design. |
| **Done means (the pilot)** | The build accepts a glossary entry only with a passing fact-check, by a path that is built and tested. The list of terms the glossary will hold is approved by the owner. About a dozen entries, Ping and IP address among them, are written, cited and passed by a fresh fact-checker. The owner has seen them on a prototype of the Glossary page and inside a lesson's Learn, at 375px and 1440px, and has approved that design. The page is built to it and shows the checked entries. The owner has what is needed to decide the rest: the cost of an entry, and whether the lessons' own lines change. The legacy path is gone. `npm test`, `npm run build` and the full `npm run e2e` pass on `revamp`. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate for the pilot is 2.7 to 3.8 million subagent tokens after the go; the rest of the glossary, after the pilot, is roughly 3 to 4.5 million more for about a hundred entries (below). The stops are under "When the work stops for the owner". |
| **Design refs** | `docs/direction.md` §6, §7, §8; `docs/content-model.md` §3 (the two-source rule), §6 (the glossary), §8 (the fact-check); `docs/superpowers/specs/2026-11-07-techconcepts-direction.md` §6.5; `prototypes/d8-glossary.html` and `.md` for what carries over (the letter keys, the name on label tape, the header with five links, the menu from 960px down); `src/lesson/Explanation.tsx:303-310` (a term in Learn today). |

## What the scouts found (S11 is `prototypes/s11-glossary-facts.md`; S10 is `prototypes/s10-job-9-facts.md`)

- **A glossary of cited definitions was the owner's plan from the start.** The first direction document, §6.5 (owner, Q27): "A **glossary** of terms, each with a cited definition. Terms inside lessons ... link to that concept's lesson, or to its glossary entry." And: "Both tracks take definitions from the **same cited glossary entries**, so they can't contradict each other."
- **The slot exists and is empty.** `defineGlossary` (`src/content/glossary.ts`) takes entries of `{ id, term, definition }`, where a definition is a list of statements; each statement cites or is an analogy, at least one cites, and the two-source rule holds (the standard that defines the thing, or two independent publishers). There is no word limit, no way to give a term two senses, and no link between a lesson's term and an entry.
- **No fact-check path exists for an entry.** The claim sheet is built from a lesson only (`sheet.ts:146`); the command loads only `src/content/lessons/<slug>.ts`; a report in `docs/fact-checks/` that belongs to no lesson is refused (`gate.ts:219-221`); the report's header requires a lesson's overrides; and the build refuses every glossary entry outright (`checkUnpathedKinds`). The fact-checker's, author's and analyst's instructions and the four briefs are all written for a lesson.
- **What a lesson's term is.** Learn's terms are `{ idea, name }`, "everyday idea first, then its name" (`schema.ts:331`): a bridge from the story the reader has just watched to the technical word, which the lesson's own contents call "In plain words, then the names". "The tool that sends those" follows "“Are you there?”" (Echo request) and "“Yes, I’m here”" (Echo reply) in the ICMP lesson. They were written, and checked, as that bridge, not as definitions.
- **The lessons mark more terms than they list.** Beside the 135 names in Learn's term lists, the lessons' prose marks 204 different words and phrases in bold; 94 of those are term names and 110 are not. 41 term names are never marked in prose.
- **The sources for the pilot are mostly in the registry already** (289 sources). ICMP's nine terms cite RFC 792, RFC 1122, RFC 791, RFC 1812, RFC 2151 and pages of Microsoft and Cisco; IP address cites RFC 791; DNS's TTL cites RFC 1034 and RFC 8767.
- **`geeksforgeeks.org` is not an allowed host,** and no tutorial site of its kind is cited anywhere; `www.baeldung.com` is the one tutorial host allowed, as a second publisher.
- **The legacy path and the header** are as S10 and D8 found them.

## Decisions in this plan (the go approves them)

1. **(owner, 2026-11-13) The glossary holds definitions written for it.** A definition says what the thing is and what it is for, and stands on its own. The page of the lessons' own lines (D8) is not built; its letter keys, the name on label tape, the lesson links and the header work carry into the next design.
2. **A definition is our own words, from sources the site accepts, and fact-checked.** The owner's two examples set the depth to aim for. Their text is another publisher's and is not copied, and the site they come from is not added as a source: the registry's standards and vendor pages already state these things, and a definition must rest on the standard that defines the thing or on two independent publishers. What the examples say is checked like anything else: whether "Ping" stands for anything, and whether an IP address is "unique", are for the analyst and the fact-checker to settle from the sources, not for this plan.
3. **(owner) The lessons' terms are looked at again; how (the orchestrator's): one definition for each concept, shown in the glossary and in every lesson that teaches it.** A lesson's Learn keeps its plain line as the way from the story to the name, and gains the glossary's definition for that name. So a reader of the ICMP lesson sees "The tool that sends those" beside "Ping" as today, and Ping's definition with it. This is §6.5 as the owner first set it, and it needs no lesson rewritten and no lesson re-checked for it: the tie is made from the glossary's side (an entry names the lesson terms it stands for), so no lesson file changes.
4. **Whether a lesson's own line is also rewritten is the owner's call after the pilot, on the evidence.** The pilot's analyst sets each line of the pilot's lesson beside its new definition and says: agrees, thin, or at odds. The owner sees the lesson with its definitions in place at the design gate. A line that is to change goes through its lesson's re-check, as any change to a checked lesson does; nothing in a lesson changes in this job without that.
5. **The list of terms is proposed by an analyst and approved by the owner** (unit G1) before the entries beyond the pilot are written. It starts from the 135 names in Learn and the 110 other words the lessons mark. For each: an entry of its own; another spelling of an entry ("ACK", "Acknowledge", "Acknowledge (ACK)"); a word with two senses, each defined (TTL in IP and in DNS); or a message or command name that stays in its lesson and gets no entry ("USER, PASS", "+OK, -ERR"). The list's length is the job's largest cost, so it comes with a count and an estimate.
6. **The shape of an entry,** to be fixed by the pilot: the name; other spellings; one to three statements, each cited under the two-source rule; a full name for an abbreviation only where a source gives it; a word limit set from what the pilot's entries need and met by trimming; where a word has two senses, each sense defined and named by where it applies; and the lessons that teach it, worked out from the tie in decision 3. The voice is the lessons': plain words a beginner reads easily, no claim wider than its source.
7. **The fact-check path for entries is built first** (unit B9, direction 2.16). Entries are checked in **groups of about a dozen**, each group a file of its own with its own claim sheet, report, quote record and re-check, through the same machinery as a lesson: the same hash, the same verdicts, the same near-pass and twelve-item re-check, the same refusal by the build when a report is missing, stale or failing. Not one check an entry (a checker's run costs about the same whatever it reads) and not one sheet for the whole glossary (one changed entry would reopen everything). The refusal of 2.16 is lifted for glossary entries when the path's tests pass, and stays for objective mappings. The path gets a canary of its own: a planted fault a checker must catch.
8. **The agents' instructions gain what an entry needs** (`.claude/agents/fact-checker.md`, `author.md`, `analyst.md`, and a brief for each in `docs/briefs/`): today every line of them assumes a lesson. A fact-checker for a group is told the group and the folder and nothing else, as for a lesson.
9. **The pilot is one group: the ICMP lesson's nine terms, IP address, and DNS's sense of TTL** (Echo request, Echo reply, Ping, Latency, TTL, Time exceeded, Traceroute, Destination unreachable, Packet loss, IP address). It holds both of the owner's examples, a word with two senses, three tools, three message names and one measured quantity, so it tries every part of decision 6. It runs as a lesson does: an `analyst` first (what each definition must say, with source, section and passage; what is wrong or unsourced in the owner's two examples; each ICMP line beside its definition), the orchestrator's rulings, an `author` once from that report, the analyst's read before the check, then a fresh `fact-checker`. A failing report is committed as written before its fix.
10. **One design unit, D9,** when the pilot's entries are drafted, so the design is made on real definitions: the Glossary page (an entry with its definition, its source marks and where their list sits, its senses, the lessons that teach it, the letter keys) and a lesson's Learn with a term's definition in place, at 375px and 1440px in both themes, at most two variants. The Lesson page keeps its layout; the definition is an addition to the terms list, and the design says how it shows without pushing Learn's words down the page.
11. **After the pilot the owner decides the rest** with its result in hand: the entries as written, what an entry cost, the analyst's list, and the lesson question of decision 4. The remaining groups are a job of their own (job 10). Whether the page goes live with the checked entries and grows a group at a time, or waits for the whole list, is decided then.
12. **The legacy path goes, in a unit of its own (B7), with no design,** as the earlier plans set it: out go `src/content/legacy.ts` and its test, `helpers/tour.ts`, the `origin` field and its branches, the legacy-only tests, the four skipped unit tests and the three that pass on an empty list, the skipped end-to-end test and the list's part in `e2e/support.ts` and `e2e/global-setup.ts`; the stamp's "Not checked yet" state, the code for lessons of several units and the v1 progress key stay; the fixtures' terse shape moves into the test fixtures. **B7 merges before B9 starts,** since both change `gate.ts`, `cli.ts` and `registry.ts`.
13. **Models.** The plan and D9 are made on Fable 5.2: the owner's word (2026-11-12) was for planning and designing this page, and the owner has kept directing it in this session. Everything else keeps its usual model: the scouts ran on Haiku; `analyst`, `fact-checker` and `reviewer` on Opus; `author` and `builder` on Sonnet; and the orchestrator of the path, the pilot and the build on Opus 5.5, in a session of its own. This session stops at the go and takes up D9 when the pilot's entries are drafted.
14. **The working rules stand:** at most three heavy agents at once; every agent writes its report in parts and replies in 150 words or fewer; one short ledger row a unit; a spec review before each build unit, its cases saved beside the spec.

## Units

| Unit | Phase | Owner (model) | What | Implements | Check |
|---|---|---|---|---|---|
| S10, S11 | scout | scout (Haiku) | Routes, the header, the legacy path; the fact-check tooling, the glossary as coded, the lessons' marked terms, the pilot's sources. Done. | | Every fact has a `path:line`. |
| D6, D7, D8, A1 | | designer (Fable 5.2), analyst (Opus) | The Practice page and the glossary in the lessons' own lines, with the read of those lines. Made and shown; **not approved, set aside.** | | |
| B7 | build | builder (Sonnet); spec review and build review by reviewer (Opus) | **Remove the legacy path** (decision 12). Worktree `.superpowers/wt/b7-legacy`, branch `b7/legacy`, `E2E_PORT=4481`. | none | `grep -rni legacy src e2e scripts` finds only the v1 progress key's lines; `npm test` passes with no skipped test, every removed test named with its reason; `npx astro check` clean; `npm run build`; `e2e/site.spec.ts` and `e2e/lesson.spec.ts` pass on the unit's port. |
| G1 | list | analyst (Opus) | **The list of terms** (decision 5): every Learn name and every marked word, each as an entry, another spelling, a sense, or left in its lesson, with a line of reason. Report `docs/glossary-terms.md`. | | Every one of the 135 names and 110 marked words has a row; the count of entries and of senses is stated. **Comes to the owner.** |
| B9 | build | orchestrator (Opus 5.5) writes the spec from S11; builder (Sonnet); reviews by reviewer (Opus) | **The fact-check path for glossary entries** (decisions 6 to 8): the group file and its rules (other spellings, senses, a word limit, the tie to lessons' terms); the claim sheet, command, report, quote record, re-check and gate for a group; the canary; the refusal lifted for entries; `docs/content-model.md` §6 and §8; the agents' instructions and the briefs. No screen. | none | Each rule and each attack case is a test; the canary's planted fault fails the gate; an entry with no report, a stale report or a failing one fails a build-mode test; every lesson's report still passes unchanged; `npm test`; `npm run build`. |
| P1-a | pilot | analyst (Opus) | **The pilot group's report** (decision 9): for each of the ten entries, what the definition must say, with source, section and quoted passage; the two senses of TTL; what in the owner's two examples no source backs; each ICMP line beside its definition. | | Every passage found by script in its saved source. |
| P1-r | pilot | orchestrator (Opus 5.5) | Rulings, written into the report and recorded in the direction document; any new source registered in one commit. | | `npm test` passes. |
| P1-b | pilot | author (Sonnet) | **The ten entries,** written once from the report, in a worktree. | B9 | The group's claim sheet prints; `npx astro check` clean. |
| P1-p | pilot | the pilot's analyst, continued | The read before the check; the author applies it. | | Numbered rulings with exact words and citations, applied. |
| P1-c | pilot | a fresh fact-checker (Opus) | The group's fact-check; a targeted re-check after a near-pass. | | The command's `--check` for the group prints `Report OK`. |
| D9 | design | designer (Fable 5.2) | **The Glossary page and a term's definition in a lesson** (decision 10), on the pilot's entries as drafted: `prototypes/d9-glossary.html` and `.md`. | | Opened at 375 and 1440 in both themes; no sideways scroll; the Lesson page's layout measured unchanged; every acceptance check can be tried on the prototype. |
| Gate | | the owner | D9, the pilot's ten entries as checked, G1's list with its cost, and the lesson question (decision 4). | | |
| B8 | build | builder (Sonnet); reviews by reviewer (Opus) | **The page and the lesson's definitions,** as D9 draws them: `src/pages/glossary.astro`, the header and footer link, a term's definition in Learn, the end-to-end checks. | D9 | Matches the prototype at 375 and 1440 in both themes; each acceptance check and attack case is a test; `npm test`; `npm run build`; the end-to-end specs it touches pass on its port. |
| F9 | end | orchestrator (Opus 5.5) | Merge each passed unit into `revamp`; `npm test`, `npm run build`, the full `npm run e2e`; the ledger with the cost of an entry; the direction document; the pilot's result for the owner. | | The three outputs are in `team.md`. |

Order: at the go, B7 and G1 side by side. Then B9. Then the pilot (P1-a to P1-c), with D9 once P1-b has drafted the entries. Then the gate, then B8, then F9.

## Estimate

| Role | Model | Units | Tokens (growth), roughly |
|---|---|---|---|
| scout | Haiku | S10, S11 | 479,431 (spent) |
| designer | Fable 5.2 | D6, D7, D8 (set aside) | 739,941 (spent) |
| analyst | Opus | A1 (spent, 33,243); G1; the pilot's report and read | 400,000 to 650,000 |
| author | Sonnet | the ten entries | 120,000 to 200,000 |
| fact-checker | Opus | one full check, a re-check | 150,000 to 250,000 |
| designer | Fable 5.2 | D9 | 300,000 to 400,000 |
| reviewer | Opus | three spec reviews, three build reviews | 600,000 to 850,000 |
| builder | Sonnet | B7, B9, B8, with fixes | 1,100,000 to 1,500,000 |

That is 2.7 to 3.8 million for the pilot after the go. **The rest of the glossary** is not in this job: at a lesson's measured rate (7,400 to 9,400 tokens a checked item, job 7) and about three items an entry, a hundred more entries in eight or nine groups come to roughly 3 to 4.5 million. The pilot replaces that guess with a measured cost for an entry.

## When the work stops for the owner

- **G1's list:** which words get an entry, with the count and what it will cost.
- **The design gate:** D9 with the pilot's checked entries; nothing is built from it before approval.
- **The lesson question** (decision 4), at the gate.
- A definition that fails three checks, or an idea no allowed source backs that the owner's examples state.
- A new host proposed for the source list that is not the publisher's own.
- The pilot passes 4.5 million subagent tokens after the go.
- Anything the owner keeps (`CLAUDE.md`, Ownership).

A unit that fails two build reviews comes back to the orchestrator with both reports. Everything else the orchestrator decides, records in the direction document and reports with the job's result.

## What could go wrong

- **A definition says more than its sources.** "Unique", "any operating system", "stands for": the general words of a tutorial are the ones a check fails. The analyst's report lists what each definition may say before the author writes, and the two-source rule holds for every statement.
- **A definition and a lesson disagree.** The glossary's Ping and the ICMP lesson's Ping must not contradict each other. The pilot's analyst reads both; a real conflict is a fault in one of them and comes to the orchestrator as an item, the lesson's side through a re-check.
- **The path changes what lessons need.** B9 touches the gate every lesson passes. Its first test is that all eighteen reports still pass untouched.
- **The list grows.** 245 candidate words is far more than a beginner's glossary needs, and each entry is checked work. G1 gives the owner the count before any of it is written.
- **A word with two senses reads as one.** TTL is in the pilot so that the entry's shape for senses is tried, checked and designed before the rest.
- **The lesson's Learn grows too long.** Ten definitions under ten terms could double Learn's length on a phone. D9 measures it and may fold a definition behind its name.
- **Three plans in two days.** Each change of the page cost a design round. This plan puts the owner's eyes on real entries (ten of them) before the design is made and before the other hundred are written.

## After this job

- **Job 10: the rest of the glossary,** group by group, on the owner's go after the pilot.
- **The revamp goes live** (the owner's), then Networking Concepts' new lessons; a new lesson's terms join the glossary with it.
- **Held, for the owner to reopen:** the standalone Practice page and its missed list (D6, D7); About's sources box; the registry addresses that moved.
- The code for lessons of several units, exporting saved progress, objective mappings' own fact-check path (direction §3).

## Not in this plan

- The entries beyond the pilot's ten.
- A change to any lesson's words; a lesson's re-check.
- The Practice page, or any change to a lesson's Practice.
- A search box; copying another site's text; a new source host that is not a publisher's own.
- Anything that leaves this machine.

## B7: spec review (reviewer, Opus, 2026-11-13) and errata

The review found 8 holes; each has one right answer, closed by the orchestrator:

- **E1 (H1)** The check's command is `grep -rni legacy src e2e scripts | grep -v LEGACY_PROGRESS_KEY | grep -v 'nistpubs/Legacy/' | grep -v 'with%20legacy'`, which prints nothing (the NIST URLs and POP3's text fragment are content and stay); `git diff revamp...b7/legacy -- src/content/lessons src/content/sources.ts docs/fact-checks` is empty.
- **E2 (H2)** A test-only validator moves into `src/content/test-fixtures.ts`: it parses the terse fixture shape, lifts it, runs `checkStructure`, throws `LessonValidationError`, and never calls `markDefined`; `define.test.ts`'s `issuesOf` uses it. The registry tests get their defined lessons from `validateLesson({ ...makeCitedLesson(), slug, title }, FIXTURE_SOURCES)`, with `FIXTURE_SOURCES` passed to `lessonsFromModules`. `markDefined` stays private to the defining path.
- **E3 (H3)** `lessonCheckCounts` counts a lesson as checked when `checkedOn(slug) !== null`, the stamp's own truth.
- **E4 (H4)** `ReadyLesson.checked` goes; `e2e/global-setup.ts` throws on any ready stop whose stamp does not start `Checked`; `e2e/site.spec.ts:594-596` and `:1356` accept only `Checked d Mon yyyy`; the title at `:590` loses "a lesson not moved yet is not".
- **E5 (H5)** Both rules of `checkLegacyRules` go with `legacy.ts` (the multi-unit Practice rule is unreachable: `cited.ts` Rule 1 refuses a lesson of several units); their tests are named as removed.
- **E6 (H6)** `sourceNumbers.ts`'s unnumbered branch and `source` being optional stay; only the comment is reworded.
- **E7 (H7)** B7 rewrites `docs/content-model.md` §4 to one line (the legacy path was removed in job 9, B7) and its lines about `defineLegacyLesson` and the exemption. The agent files and briefs are B9's (decision 8); `plan.md` and the direction doc are the orchestrator's.
- **E8 (H8)** The three vacuous tests are `registry.test.ts:247-262`, `:435-437` and `:439-445`; they are deleted (retargeting them fails: lessons carry backings and one has an override).

### B7 attack cases, grouped under B7's check

The check has five parts; decision 12's "goes" and "stays" lists are tested under the part that would catch each.

#### Check 1: `grep -rni legacy src e2e scripts` finds only the v1 progress key's lines (blocked by H1)
- **A1.1** Refuse: the builder rewords the NIST URLs or POP3's text fragment to pass the grep. A right build leaves `src/content/lessons/*.ts`, `src/content/sources.ts` and `docs/fact-checks/` byte-identical: `git diff revamp...b7/legacy --stat -- src/content/lessons src/content/sources.ts docs/fact-checks` prints nothing.
- **A1.2** Refuse: `LegacyLessonInput`, `LegacyUnitInput`, `liftLegacy`, `legacyLessonSchema` survive by moving into `test-fixtures.ts` under their old names. A right build renames them (grep, with H1's filters, prints nothing).
- **A1.3** Refuse: test names and comments keep the word (`Explanation.test.tsx:199` "as its legacy text", `cited.test.ts:362` and `:450`, `Practice.test.tsx:84`, `sourceNumbers.test.ts:7`, `sourceNumbers.ts:20`, `schema.ts:24`, `:487`, `cited.ts:8`, `:169`, `gate.ts:12`, `timeline.test.ts:18`). A right build rewords each to what is true now.
- **A1.4** Accept: every `LEGACY_PROGRESS_KEY` line stays, including `src/test/progress.ts:1`, `:22`, `src/components/progress-islands.test.tsx:12`, `:83`, `src/progress/useProgress.ts:4`, `:67`, and their tests; `store.test.ts:43` still expects `'techconcepts:v1'`. A build that renames the constant fails.
- **A1.5** Refuse: a renamed survivor of the list, such as `UNCHECKED_LESSONS = []` or a `'fixture'` value of `origin`. A right build has no `origin` on `Lesson` (`schema.ts:488`): `grep -rn "\.origin\b\|origin: '" src e2e | grep -v "url\|location\|transform-origin\|iso-kit\|osi.ts"` prints nothing.

#### Check 2: `npm test` passes with no skipped test, every removed test named with its reason
- **A2.1** Refuse: the four `test.skipIf(LISTED === undefined)` cases (`define.test.ts:555`, `:560`, `legacy.test.ts:77`, `cli.defaults.test.ts:11`) turned into plain tests that pass on nothing, or into `test.todo`. A right build deletes them; vitest's summary shows `0 skipped` and no `todo`; `grep -rn "skipIf\|\.todo(" src` prints nothing.
- **A2.2** Refuse: removing a structural test along with the legacy ones. Every `define.test.ts` case that tests `checkStructure` survives and still fails on its fault (H2): with any one structural rule in `define.ts` disabled (say, the duplicate event id check at `:300`), `define.test.ts` goes red. The number of tests in `define.test.ts` drops by exactly the named removals.
- **A2.3** Refuse: `issuesOf` re-pointed at a helper that throws a ZodError or runs no `checkStructure`. A shape fault (`makeLesson()` with `units: []`, or a step with no `narrative`) still returns a `LessonValidationError` issue, not a crash, and a structural fault still returns its message.
- **A2.4** Refuse: a test helper that calls `markDefined`. With `definedFor` rewritten, `lessonsFromModules` still throws `NOT_DEFINED` for a hand-built lesson and for `{ ...defined }` (`registry.test.ts:310-326`), and throws the other-source-list error for a lesson checked against `FIXTURE_SOURCES` but loaded with the default `SOURCES`.
- **A2.5** Accept: every registry test that used `definedFor` (7 uses) still runs its scenario through a lesson `validateLesson` returned.
- **A2.6** The gate, `gate.ts:212`: refuse a build that keeps exempting some lessons. `checkFactChecks([liftedFixture()], {}, FIXTURE_SOURCES)` now returns an issue naming the missing report (the old "legacy lessons need no report", `gate.test.ts:91`, inverted, not just deleted); a report whose slug no lesson owns is still an issue.
- **A2.7** The CLI, `cli.ts:103-104`: accept any lesson the registry has; an unknown slug is still refused with its message (`cli.test.ts`). `cli.test.ts:135-141`, `cli.recheck.test.ts:88-96` ("stamp 5"), `cli.defaults.test.ts:11-16` are named as removed.
- **A2.8** `checkedOn`, `registry.ts:305-314`: a lesson with a report returns its date; a slug no lesson has returns null; a lesson with no report returns null (the dev path). Each is a test that goes red when `checkedOn` returns a constant.
- **A2.9** The stamp's not-checked state stays: `Stamp.test.tsx:13-18`, `stamp.test.ts:8-10`, `:15`, `TopBar.test.ts:55`, `Explanation.test.tsx:92-93`, `:272-276`, `TrackRoute.test.tsx:50-52`, `track.test.ts:122-125` all still run and pass; `checked.test.ts:17-28` keeps its "a lesson not checked yet carries none" assertion on `liftedFixture(makeLesson({ slug: 'a-lesson-not-checked' }))`, with `LEGACY_LESSONS` gone from it. With `strokeDasharray` in `Stamp.tsx:21` made unconditional, a test goes red.
- **A2.10** `lessonCheckCounts` (H3): whichever answer, a test pins it so that the other answer goes red (for `checkedOn`: with `checkedOn` mocked to null for one ready slug, `checked` is `total - 1`).
- **A2.11** `home.test.ts:97-100`: the "And HTTPS?" lesson still must have a check date; only its list assertion goes. Refuse deleting the whole test.
- **A2.12** `how-the-internet-works.test.ts:130`, `:749`, `:774`: the cited branch is kept unconditionally; the legacy branch and the data only it read (`rows[i]`'s `osi` column, `expectedReferences`, `uncited`) go. Refuse keeping the legacy branch's expectations: with a ready HIW lesson's `references` emptied, the test goes red.
- **A2.13** `cited.test.ts:450` ("a lesson in the legacy shape is rejected by the strict path, on its shape alone") is not legacy-only: it proves `defineLesson` refuses the terse fixture shape. Refuse deleting it; rename it.
- **A2.14** Multi-unit code stays (decision 12): `timeline.test.ts:31` `twoUnits`, `makeTwoUnitLesson`, `Outline.test.tsx`'s Alpha/Beta fixture and `Outline.tsx:193-277` still run and pass. Refuse deleting `Outline.tsx`'s protocol rows or `LessonSummary.units` as "legacy".
- **A2.15** The moved fixture schema still refuses a typo (`timeline.test.ts:18` relies on it): `liftedFixture({ ...makeLesson(), units: [{ ...makeUnit(), stepz: [] }] } as never)` throws. A `z.any()` or cast-only fixture passes it.
- **A2.16** The report names each removed test with its reason, one line each, and the names match `git diff` (every `test(`/`test.skipIf(` line removed appears in the list; none listed is still present).

#### Check 3: `npx astro check` clean
- **A3.1** Refuse: `as any` / `as never` / `@ts-expect-error` added to silence a removed `origin` or a renamed type. `git diff revamp...b7/legacy | grep -n "^+.*\(as any\|ts-expect-error\|ts-ignore\)"` prints nothing new beyond what A2.15 needs.
- **A3.2** `e2e/` is type-checked with the site's settings (`support.ts:24-26`): a dangling `ReadyLesson.checked` read (`site.spec.ts:345`, `:594`) is an error, not a runtime surprise.

#### Check 4: `npm run build`
- **A4.1** Refuse: `registry.ts` still calls a renamed `checkLegacyList`, or keeps a closed-list check over nothing. The build passes with `checkLegacyList` and its call at `:251` gone.
- **A4.2** Refuse: a production module importing `test-fixtures.ts` to reach the moved schema. `grep -rln "test-fixtures" src | grep -v "\.test\.\|test-fixtures.ts"` prints nothing (today it prints nothing).
- **A4.3** The error messages that named the legacy path (`registry.ts:150-155`: "or defineLegacyLesson ... legacy list") are reworded, and `registry.test.ts`'s `NOT_DEFINED` string matches the new words; a lesson file that is a plain object still fails the build naming `defineLesson`.
- **A4.4** With one report removed from `docs/fact-checks/` (in a scratch copy), `npm run build` still fails naming that lesson; `astro dev`'s warn path is unchanged (`refuseOrWarn`, `registry.ts:289-294`).

#### Check 5: `e2e/site.spec.ts` and `e2e/lesson.spec.ts` pass on port 4481 (shaped by H4)
- **A5.1** Refuse: `site.spec.ts:344-356` kept as a skipped or always-passing test. It is deleted (it needs a page with the not-checked stamp, which a build cannot have) and named as removed; the stamp's not-checked state is covered by the unit tests in A2.9.
- **A5.2** Refuse: `global-setup.ts` that no longer reads the stamp at all. A right build still fails the run when a ready stop's stamp does not say `Checked d Mon yyyy`: with the stamp text forced to "Not checked yet" in `TrackRoute.tsx`, global setup throws.
- **A5.3** `site.spec.ts:590-600` and `:1356`: with `Checked` replaced by "Not checked yet" for one lesson, both go red (under H4's answer).
- **A5.4** Accept: `e2e/tablet.spec.ts`, `e2e/visual.spec.ts` and `site.spec.ts:318-327`, `:1047-1052`, `:1402-1432` are untouched and their screenshots unchanged; the stamp's look and placement do not move.
- **A5.5** The run uses `E2E_PORT=4481`, so it cannot pick up a server from the main folder (4471); the report shows the port and the pass count, with 0 skipped from `site.spec.ts` (the remaining skips are the project-scoped ones in `lesson.spec.ts:45`, `:291`, which stay).

## B9: spec review (reviewer, Opus, 2026-11-13)

14 holes, each closed as errata E1 to E14 in `docs/glossary-path-spec.md` §10. The attack cases:


Each is one line: the setup, and what a right build does. "Refuse" cases are the nearest wrong input that is easy to let through; "accept" cases the nearest right input that is easy to refuse.

#### Check 1: every lesson report and re-check passes, no byte of `docs/fact-checks/*.md` changed

- **A1.1** For each of the 18 lessons, `claimSheet(lesson, SOURCES).hash` equals its re-check's `hash` where a `.recheck.md` exists (6), else its report's `hash` (12). Goes red if the build adds anything to the hashed body (a `kind`, a `group: undefined` turned into `null`, `overrides ?? []` serialised differently) or touches `canonical`.
- **A1.2** For each of the 12 lessons with no re-check whose report has an `items` record, `itemHashes(claimSheet(...))` equals that record exactly. Goes red if `itemHash` gains the key, the kind list, or anything else.
- **A1.3** For each of the 6 re-check pairs, `itemsToJudge(full.items, sheet).judge` equals the re-check's verdict keys, in order, after the entry rule is added; the entry rule adds no key to any lesson.
- **A1.4** `git diff --name-status revamp...b9/glossary-path -- docs/fact-checks` shows only `A` lines, each under `docs/fact-checks/glossary/` or `docs/fact-checks/canary/`; `docs/fact-checks/canary/fact-check-canary.md` is not among them.
- **A1.5** The lesson canary still passes `canary.test.ts`'s report test: its hash is unchanged even if `CANARY_SOURCES` moves to a shared file for the group canary.
- **A1.6** No test fixture report lands in `docs/fact-checks/glossary/` (it would be an orphan and fail the build): after the build, that folder is absent or empty.

#### Check 2: each rule of section 2 broken and kept

- **R1 refuse**: an unknown key on an entry (`note`), on a sense (`also` inside a sense), on a statement (`analogy: true` with a cite), on a tie (`{ lesson, term, sense }`); entry id `ttl_dns`, sense id `In-IP`, statement id `S1`, group id `Pilot`. **Accept**: `ttl-dns`, `dns`, `s-1`.
- **R2 refuse**: an entry with both `definition` and `senses`; with neither; `senses` of one item. **Accept**: two senses and no `definition`.
- **R3 refuse**: `definition: []`; four statements; one sense with four while the other has one. **Accept**: exactly 3, and exactly 1.
- **R4 refuse**: `cite: []` (the lesson `statementSchema` defaults it, `schema.ts:62`); one non-defining citation; two vendor pages of one publisher (count once, `cited.ts:102-110`); a `cert-objectives` source; a hand-built citation whose label or url differs from `cite()`'s; a source not in the registry passed. **Accept**: one citation marked `defining`; two different RFCs, neither defining; a group checked against a registry passed as an argument (the canary's `CANARY_SOURCES`).
- **R5 refuse**: one definition of 61 words across three statements, the message naming group, entry (and sense) and the count. **Accept**: exactly 60 across three; two senses of 60 each (not summed); `TCP/IP` counted as one word, a spaced ` — ` as one, double spaces and outer spaces as none, a tab or newline as a space. The limit is one exported constant, `GLOSSARY_DEFINITION_WORDS = 60`; no override key exists (`overrides` on a group is refused by R1).
- **R6 refuse**: `**` in a term, in one `also`, in a label, in a statement. **Accept**: a single `*` (`a * wildcard`); a tied lesson term's idea with `**bold**` (it is the lesson's text, not the group's, and must not be refused).
- **R7 refuse**: a 7-word label; labels `In IP` and `in ip` in one entry; two senses with id `ip` in one entry. **Accept**: a 6-word label; sense id `ip` in two different entries.
- **R8 refuse**: statement id `s-1` in two entries of one group; in an entry and in a sense of another entry; two entries with id `ttl` in one group. **Accept**: statement id `s-1` in two different groups.
- **R9 refuse**: `term: 'TTL', also: ['TTL']`; `also: ['Time to Live', 'time to live']`; per H13, `also: ['ttl']`, `also: ['TTL ']`, `also: []`. **Accept**: `term: 'TTL', also: ['Time to Live']`.
- **R10 refuse**: `lessons: []`; the same `{ lesson, term }` twice in one list; `lessons` on an entry that has `senses`; `{ lesson: 'What-is-ip', term: 'term-ttl' }`. **Accept**: one lesson with two different terms; `lessons` on each sense.
- **R11 refuse**: entry id `ttl` in group `a` and in group `b`, the message naming both groups. **Accept**: entry `ttl` and entry `ttl-dns`.
- **R12 refuse**: term `TTL` in group `a` and `also: [' ttl']` in group `b`; one entry's term equal to another's `also`, ignoring case. **Accept**: `IP address` and `IP-address` (different names).
- **R13 refuse** (`refuseOrWarn`: throws in `production` and `test`, warns in `development`): a tie to `what-is-nope`; to `what-is-icmp` with a term id that exists only in another lesson; to a Learn id that exists in the lesson but is not a term (`lead-1`, `fact-ports`). **Accept**: a real `{ lesson, term }`.
- **R14 refuse**: the same `{ lesson, term }` tied by entries in two groups; by two senses of one entry (rule 10 does not catch it). **Accept**: `{ what-is-ip, term-ttl }` on sense `ip` and `{ what-is-dns, term-ttl }` on sense `dns` (one term id in two lessons).
- **All at once**: a group breaking R3, R5 and R7 throws one error listing all three, each naming group, entry and part.
- **Loading**: with no group file, `GLOSSARY_GROUPS` and `GLOSSARY` are `[]`; a file in `glossary-groups/old/` and a `glossary-groups/x.test.ts` are not loaded; `GLOSSARY` is group then file order; per H11, file `pilot.ts` exporting id `pilot-1`, a plain object, or a group defined against fixture sources is refused naming the file.
- **Old shape gone**: `grep -rnw defineGlossary src` finds nothing; each removed `glossary.test.ts` test is rewritten or named with its reason.

#### Check 3: the group sheet's keys, kinds, content and hash

- **A3.1** A one-sense fixture with `also`, three statements and `lessons` gives exactly the keys, in order: `entry "ttl": names` (unbacked), `entry "ttl": statement "<s1>"`, `... "<s2>"`, `... "<s3>"` (claim), `entry "ttl": lessons` (tie). A two-sense fixture gives `entry "<id>": names`, then per sense `entry "<id>", sense "<sid>": label`, its statements, its `lessons`, sense by sense in file order.
- **A3.2** An entry or sense with no `lessons` has no `lessons` item (not an empty one); an entry with no `also` has a `names` item holding only the term.
- **A3.3** `sheet.slug` is `glossary/<id>`; `sheet.overrides` is `[]`; the test recomputes `sha256(canonical({ slug, items, sources, overrides: [] }))` and gets `sheet.hash`.
- **A3.4** Swapping statements 1 and 2 of one definition changes both claims' item hashes (place is content); renaming an entry's term changes only its `names` item hash.
- **A3.5** Changing a tied term's `idea` (or `name`) in its lesson changes the tie item's hash and the group hash; changing that lesson's title, or an untied term of the same lesson, changes neither.
- **A3.6** `sources` holds only cited sources, sorted by id; editing the registry entry of a cited source changes the hash, of an uncited one does not.
- **A3.7** A tie's content is `{ lesson, term, name, idea }` per tied term in the order written; `cite` and `traces` are `[]`; its kind prints `Kind: tie`.
- **A3.8** `renderSheet` prints each tie line exactly `` `what-is-icmp` term `term-ping`: Ping — The tool that sends those `` (em dash, idea as written, bold markers kept), and the CLI output ends `Write your report to: docs/fact-checks/glossary/<id>.md`.
- **A3.9** Adding a fixture group to the glossary leaves every lesson's `claimSheet(...).hash` as before (A1.1 run with a group present).
- **A3.10** Per H10: swapping two entries in the file: either the hash is unchanged (if sorted) or it changes and `itemsToJudge` returns `judge: []`; the test pins whichever is ruled.

#### Check 4: every command form, through `runFactCheck`

- **A4.1** `['glossary/pilot']` (fixture deps) prints the group sheet and `Write your report to: docs/fact-checks/glossary/pilot.md`, code 0.
- **A4.2** `['glossary/nope']` gives exactly `No glossary group "nope".`, code 1; `['glossary/']`, `['glossary/../dhcp']` and `['glossary/Pilot']` give code 1 and never load a lesson or a file outside `glossary-groups/`; `['glossary']` gives `No lesson "glossary".`; `['dhcp']` still prints the lesson sheet.
- **A4.3** `--check` on a passing fixture report: `Report OK: docs/fact-checks/glossary/pilot.md`; on a report whose header `slug` is `pilot` (no prefix): the slug-mismatch message, code 1.
- **A4.4** `--quotes <folder>` writes the record into `docs/fact-checks/glossary/pilot.md` with `items` (one per sheet key) and `limits` = `sha256("[]")`; a `- \`rfc-792\` §...` quote under the `names`, `label` or `lessons` heading is refused ("this item cites nothing").
- **A4.5** `--stamp` writes `items` and `limits` at the sheet's hash, and refuses at another hash.
- **A4.6** `--recheck` after one changed statement prints the re-check sheet with the whole entry, refuses when the full report is not a near-pass, when nothing changed, and when more than 12 items; `--recheck --quotes` writes the re-check's record; `--recheck --check` gives `Report OK: docs/fact-checks/glossary/pilot.md and docs/fact-checks/glossary/pilot.recheck.md`.
- **A4.7** `['glossary/fact-check-canary']` loads the canary group with `CANARY_SOURCES` and points to `docs/fact-checks/canary/glossary-fact-check-canary.md`; `['fact-check-canary']` still loads the canary lesson at its own path.
- **A4.8** Per H8: a tie to a missing lesson or term gives a message naming entry and pair, not a thrown TypeError; a broken group file does not stop `['glossary/other']` if one-file loading is ruled.
- **A4.9** `USAGE` and the header of `scripts/fact-check.mjs` name `glossary/<id>` (a look).

#### Check 5: the gate

- **A5.1 Refuse** (build-mode, i.e. `production` and `test` throw, `development` warns): a group with no report; a stale report (one statement edited); a ⚠️ verdict; a missing verdict key; a verdict for an unknown key; a cited source missing from `sources` or `current: false`; no `quotes` record; a quote edited after the record; a passing cited statement with no quote; header `slug` `pilot` instead of `glossary/pilot`.
- **A5.2 Refuse orphans**: `glossary/old.md` with no group `old`; `glossary/old.recheck.md` with no group; `glossary/pilot.recheck.md` is never read as the full report of a group `pilot.recheck`. Each message names `docs/fact-checks/glossary/<file>`, not `docs/fact-checks/<file>` (`slugOf`, `gate.ts:199-202`, drops the folder).
- **A5.3 Accept**: a group with a passing report; a passing near-pass pair; a pair whose re-check judges the whole changed entry.
- **A5.4** A group whose id equals a lesson slug (`dhcp`): the lesson reads `docs/fact-checks/dhcp.md` and the group reads `docs/fact-checks/glossary/dhcp.md`; neither is an orphan of the other (a build that merges both maps by `slugOf` fails this).
- **A5.5** The lesson gate's globs are unchanged and depth 1: a stale file in `glossary/` never yields "no cited lesson"; a failing `docs/fact-checks/canary/glossary-fact-check-canary.md` never reaches any gate.
- **A5.6** The wiring, per H5: the real registry, given one fixture group by mock, refuses for its missing report at `docs/fact-checks/glossary/<id>.md`.
- **A5.7** `checkUnpathedKinds` no longer names any glossary entry: a fixture glossary with a passing report gives no "has no fact-check path yet" line.

#### Check 6: the re-check judges a whole entry; no lesson rule on a group, no entry rule on a lesson

- **A6.1** Entry `a` (names, three statements, lessons), with entries `b` and `c`: editing `a`'s statement 2 gives `judge` = all five of `a`'s items, `changed` = that statement (and statement 3 if its place moved), `pulled` = the rest of `a`; nothing of `b` or `c`.
- **A6.2** Taking statement 3 out of `a` pulls `a`'s remaining items; the removed key is not judged.
- **A6.3** Prefix: entries `ttl` and `ttl-dns`; editing `ttl` does not pull `ttl-dns` (the prefix is `entry "ttl"` with its closing quote). Editing a sense of `request` pulls both senses, the label items and `names`.
- **A6.4** Editing a tied lesson term's idea makes that entry's (or sense's) tie changed and pulls its whole entry.
- **A6.5** Renaming entry `a` to `a2`: every `a2` item changed; nothing else pulled.
- **A6.6** No lesson rule on a group: a changed `names` item (unbacked) in `a` does not pull `b`'s and `c`'s `names` and `label` items (the lesson's "every unbacked item when a Learn part changed", `recheck.ts:168`, must not be generalised to "when anything changed").
- **A6.7** A three-sense entry with three statements each (16 items) changed in one statement: the CLI refuses with the "more than 12" message and the gate refuses a re-check of it.
- **A6.8** Editing the registry entry of a source cited by two entries pulls both entries whole.
- **A6.9** The group re-check sheet has no `## Learn parts, as context` heading and no `## Where the items to judge sit` section (H6); its intro states the entry rule.
- **A6.10** No entry rule on a lesson: A1.3 (the six real pairs) stays green, and a lesson fixture with one changed Learn part judges exactly what it judged before B9.

#### Check 7: objective mappings still refused

- **A7.1 Refuse**: a certification track lesson with objective `EX-101 2.6` gives the message ending `the build refuses objective mappings until one is built (docs/direction.md, decision 2.16)`, byte for byte as today (`gate.ts:242`).
- **A7.2 Accept**: a non-certification track with objectives yields nothing (as `gate.ts:239`); no tracks and no glossary yields `[]`.
- **A7.3** The rewritten `registry.test.ts:484-494` still shows `production` and `test` throwing and `development` warning for an objective mapping.

#### Check 8: the canary group

- **A8.1** `canary/glossary.ts` exports a group `fact-check-canary` valid under every in-group rule with `CANARY_SOURCES`; it is not in `GLOSSARY` or `GLOSSARY_GROUPS`, and no file under `glossary-groups/` defines it.
- **A8.2** The five planted keys are keys of its sheet: `entry "dhcp": names`, `entry "offer": lessons`, `entry "lease": statement "<id>"`, `entry "request", sense "dhcp": statement "<id>"`, `entry "request", sense "http": statement "<id>"`; the list is in the test file and `canary/glossary.ts` names no fault (grep for "fault", "wrong", "planted" finds nothing there).
- **A8.3** Its ties name real terms: the test asserts `dhcp` has `term-discover` and `term-broadcast` in its Learn terms (or the canary lesson's, per H4).
- **A8.4** The report test: the header's hash equals the sheet's; every planted key is not ✅; every other key is ✅. Until the report exists it fails with a message naming the path and the prompt to send, and it is the only failing test.
- **A8.5** The test file's comment quotes, for each correct statement, the passage found by grep: RFC 2131 §1 lines 89-93 (per H2), §3.1 Table 2 "DHCPDISCOVER - Client broadcast to locate available servers." and step 2 "Each server may respond with a DHCPOFFER message that includes an available network address", step 3 "The client broadcasts a DHCPREQUEST message" and "The 'requested IP address' option MUST be set to the value of 'yiaddr' in the DHCPOFFER message", §4.1 "DHCP uses UDP as its transport protocol. DHCP messages from a client to a server are sent to the 'DHCP server' port (67), and DHCP messages from a server to a client are sent to the 'DHCP client' port (68).", RFC 9110 §9.3.1 "The GET method requests transfer of a current selected representation for the target resource."
- **A8.6** Per H1-H3: the `lease` names item, and `dhcp` statements 1 and 2, are worded so a correct checker passes them; a run that marks any of the three not ✅ is a canary failure the build must not cause.

#### Check 9: `npm test`, `npx astro check`, `npm run build`

- **A9.1** `npx vitest run` fails exactly one test, the canary group's report test, until that report is committed; then none.
- **A9.2** `npx astro check` clean with `GlossaryEntry` (old) gone from `gate.ts:1` and `registry.ts:8`, and `ItemKind` gaining `'tie'` without a `switch` left non-exhaustive.
- **A9.3** `npm run build` passes with an empty glossary and no `docs/fact-checks/glossary/` folder.

## 4. Notes (nothing in B9 changes for them)

- The cap of 12 with the entry rule limits an entry to 12 items for a cheap re-check: two senses with three statements and ties is 11. Worth a word in the analyst's and author's briefs so the pilot stays re-checkable.
- `docs/direction.md` 2.16 and the Phase 3 lines (`direction.md:44, :112, :117`) still say glossary entries are refused; §8 updates `content-model.md:305` only. The orchestrator's to change with the merge.
- `checkedOn`/`checkedDate` have no group form yet; B8 will need one for a "checked on" mark.

## B8: spec review (reviewer, Opus, 2026-11-13) and errata

The review of D9's spec found 11 holes; each has one right answer, closed by the orchestrator (Opus 5.5). The spec file stays as approved; these errata are read with it. The attack cases are in `prototypes/d9-cases.md`.

- **E1 (H1)** Without JavaScript a lesson serves only its Overview (`LessonConsole.tsx:208`), so no term list and no definition is in any lesson's HTML. Check 37 becomes: every lesson's HTML has no `.explain__terms` and no `.explain__def`, and `no-script.test.ts` and `lesson.spec.ts`'s no-JavaScript test pass unchanged. §10's two `:root:not(.js)` rules are not added.
- **E2 (H2)** The end-to-end specs cannot load the glossary (`import.meta.glob`). The data-exact parts of checks 3, 11, 12, 13 and 19 run in a Vitest file that renders `glossary.astro` with Astro's container and jsdom, as `no-script.test.ts` does. `e2e/glossary.spec.ts` keeps what needs a browser, on the entries the spec names, and checks the stamp's count against the page's own entries.
- **E3 (H3)** D8's checks 15 and 23 run on the last letter that has an item, read from the keys (T in the pilot); at 1440 Tab focuses the first link inside that letter's `dl`. D8's check 21 reads `.gl-row a` where it says `.gl-from`.
- **E4 (H4)** Check 18's fixture of 13 letters runs on the keys' markup in a unit test (the keys drawn from the function's output). Check 32's markup half runs in `Explanation.test.tsx` with a `definitions` prop of three; its height half runs end to end on the DNS lesson (only `term-ttl` tied): untied rows have no `data-def`, no button, and the one-line row is 42.2px (±0.5) at 1440.
- **E5 (H5)** Check 33 opens the lesson at `…/what-is-icmp?step=7`, follows "Ping in the glossary" and goes Back to Learn. A reader who walked to Learn by Next comes Back to the Overview with "Resume at …": the console writes no position to the address, and the spec does not ask it to. **A note for the owner.**
- **E6 (H6)** Check 38 is `git diff --stat revamp...b8/glossary -- src/content/lessons src/content/glossary-groups src/content/sources.ts docs/fact-checks`, which prints nothing.
- **E7 (H7)** `registry.ts` gains `glossaryCheckedOn(groupId)`, the group twin of `checkedOn`. The pure function takes its inputs as arguments (groups, lessons with tracks and addresses, sources, a date per group); the pages pass the real ones.
- **E8 (H8)** An empty glossary, or `astro dev` with a group whose report is missing, does not throw: the latest date is taken over the groups that have one, and with none the page draws no `.gl-stamp`. One unit test pins "no group, no throw, no stamp".
- **E9 (H9)** Variant B only: no `data-def="shown"`; the bracketed halves of checks 26 and 27 are dropped.
- **E10 (H10)** The prototype's CSS stands: the "… in the glossary" link is 44px at `(max-width: 760px), (pointer: coarse)`, 26px otherwise; §11's "phone layout" reads "760px and below".
- **E11 (H11)** The "0–9" key counts as one of the 13: the rule is about how many keys are live (§16, "Twenty dashed keys over ten entries read as a broken page"). One unit test pins it.
