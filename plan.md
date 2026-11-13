# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947 and its second (the glossary in the lessons' own words) at 93b5b4f.

**Status: the owner said go** (2026-11-13, "Go", on the plan as shown), which approves the fourteen decisions below. Next: B7 and G1, in a session on Opus 5.5. At the design gate for the glossary in the lessons' own words (D8) the owner asked for real definitions: "Going over these glossary terms I feel like we need to make major adjustments to terms", with Ping ("The tool that sends those") and IP address as the examples, and then: "Yes, replan the glossary and also if these are the definitions used in the lessons we need to revisit well". D8 was not approved. (Direction 2.39.)

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
