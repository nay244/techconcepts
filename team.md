# Team ledger

The job in `plan.md` now is What is HTTP, the second lesson of Phase 4, alone: its rows are under "Job 4" at the end. Job 1 was the Lesson page (Phase 2), job 2 was Phase 3, one fact-check path, and job 3 was the Phase 4 pilot; all three are done.

One row per unit of `plan.md`, added when the unit ends. Tokens are the subagent's total for the unit, all tries together.

## Units

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S1 | scout | Haiku | 1 | 137,061 | Done 2026-11-10. `prototypes/s1-lesson-facts.md`, 229 lines, every fact with a `path:line`; three spot-checked by the orchestrator. |
| D1 | designer | Fable | 1 | 315,291 | Done 2026-11-10. Two variants; check run at 1440×900 and 1280×720; photographed offline by the orchestrator. Approved 2026-11-10. |
| D2 | designer | Fable | 1 | 369,814 | Done 2026-11-10. Two variants for the table's place, one design for the other three fixes; check run at 375×812 and 390×844. Approved 2026-11-10. |
| D3 | designer | Fable | 1 | 259,496 | Done 2026-11-10. Two variants; check run at 768×1024 and 1024×768; photographed offline by the orchestrator. Approved 2026-11-10. |
| D4 | designer | Fable | 1 | 193,973 | Done 2026-11-10. One layout on two grounds; check run at 1200×630, 600×315 and 300×158. Approved 2026-11-10. |
| B1 | builder | Sonnet | 1 | 165,335 | Done 2026-11-10, implements D1 variant B. `npm test` 1,387 passed; build within budget; `npm run e2e` 835 passed, 231 skipped; `e2e/reading.spec.ts` 18 passed, line length 62 to 70 characters at 1440 and 52 to 60 at 1280. |
| B1 | reviewer | Opus, high | 1 | 124,073 | PASS: no blockers, no drift, all 16 acceptance checks traced to a test. Merged into `revamp`. |
| B2 | builder | Sonnet | 2 | 326,589 | Implements D2 variant A. Try 1: built, all checks green. Try 2: the six review points fixed; `npm run e2e` 890 passed. |
| B2 | designer (errata) | Fable | 1 | 156,489 | Ruled on two places where D2's spec contradicted itself (the scene's clip, the tab's changed name); spec and prototype corrected. |
| B2 | reviewer | Opus, high | 2 | 231,778 | FAIL, then FAIL. First: four drifts, two weak tests. Second: one bug from the approved CSS (ICMP's "miss" tag in the name column) and three tests that could not fail. |
| B2 | orchestrator | Fable | 1 | not counted | After two failed reviews: the tag placed under its value (erratum 3), the three tests made able to fail. `npm test` 1,392 passed; `npm run e2e` 894 passed, 231 skipped. Merged into `revamp` 2026-11-11. |
| B3 | builder | Sonnet | 2 | 259,085 | Implements D3 variant A. Try 1: built; one stale test changed. Try 2: the eight review points fixed; `npm test` 1,392 passed; `npm run e2e` 952 passed, 231 skipped. |
| B3 | reviewer | Opus, high | 2 | 178,890 | FAIL, then PASS. First: the tabs' focus ring clipped, and gaps in the tests. Second: no blockers, no drift, all 22 checks traced. Merged into `revamp` 2026-11-11. |
| B4 | builder | Sonnet | 2 | 184,408 | Implements D4 variant A. Try 1: the image is byte for byte the approved card. Try 2: `npm test` runs with no browser (1,397 passed); `npm run e2e` 958 passed, 231 skipped. |
| B4 | reviewer | Opus, high | 2 | 87,530 | FAIL, then FAIL. First: the unit tests needed a browser that CI's check job does not install. Second: the moved tests measured a copy of the script's page, and the words' colour was untested. No drift either time. |
| B4 | orchestrator | Fable | 1 | not counted | After two failed reviews: the spec uses the script's own opener and checks the words' colour. Its 6 tests and the 5 unit tests pass. Merged into `revamp` 2026-11-11. |
| Final | orchestrator | Fable | 1 | not counted | On `revamp` after the last merge: `npm test` 1,397 passed; `npm run build` within budget (25 pages). `npm run e2e` 958 passed, 231 skipped, 0 failed (17.2 minutes, on commit 7b3c932, lid open). Two earlier attempts overnight were broken by the Mac sleeping with its lid closed (36 and 86 play-through tests timed out) and are not counted. |
| B6 | builder | Sonnet | 1 | 68,447 | Done 2026-11-11: every page's share image has its description (`og:image:alt`). One correction from the orchestrator, whose brief had asked for a unit test that read the built site; it moved to the end-to-end suite. |
| B5 | builder | Sonnet | 2 | 149,896 | Done 2026-11-11: on a tablet on its side, Learn and Practice get D1's reading layout. A first builder stopped on a sign-in error before changing anything. Try 1: built, `npm run e2e` 967 passed; one follow-up after the orchestrator corrected its own spec line (the folded log is 62px there, not 52px). Try 2: the two tests the review named, each shown failing against a broken build. |
| B5, B6 | reviewer | Opus, high | 2 | 88,232 | One review for both, then one of B5's fix. B6: PASS. B5: FAIL (a test that could not fail, and a missing test), then PASS. No drift in either. The second review continued the same reviewer and cost about 10,000 tokens. Both merged into `revamp`. |
| Final 2 | orchestrator | Fable | 1 | not counted | On `revamp` after B5 and B6: `npm test` 1,398 passed; `npm run build` within budget (25 pages); `npm run e2e` 969 passed, 256 skipped, 0 failed (17.9 minutes, on commit 088d286, lid open). |

The four agent types were added mid-session and were not loaded, so each unit ran as a general agent on its assigned model, told to follow its file in `.claude/agents/`. The designer's skill was loaded by instruction, and the scout's read-only limit was by instruction, not by its tool list.

## Designer spend

The designer runs on the orchestrator's model, the dearest on the team, so its spend is counted on its own.

| Unit | Variants | Tokens | Approved by the owner |
|---|---|---|---|
| D1 | 2 | 315,291 | 2026-11-10 |
| D2 | 2 | 369,814 | 2026-11-10 |
| D3 | 2 | 259,496 | 2026-11-10 |
| D4 | 2 | 193,973 | 2026-11-10 |

| D2 errata | 0 | 156,489 | 2026-11-11, with all the errata to D2 and D3 |

**Total:** 1,295,063 tokens: 1,138,574 for the four screens and 156,489 for one round of errata.

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 137,061 |
| designer | Fable | 1,295,063 |
| builder | Sonnet | 1,153,760 |
| reviewer | Opus | 710,503 |
| **All subagents** | | **3,296,387** |

The orchestrator's own tokens are not in this table.

## Could go one model lower next time

- **Errata rulings on a spec that contradicts itself** (D2's round, 156,489 Fable tokens). Both points had one right answer once measured. Next time the orchestrator rules and records it, as it did for D3's two errata at no extra cost, or an Opus agent measures and reports.
- **Reviews of a small, non-visual diff** (B4: a script, a test file and one image; 87,530 Opus tokens over two reviews). Sonnet at high effort is enough for a diff that size.
- **A builder's second try that is a named list of test fixes** (B3's eight points, B4's move of tests between two files; 183,949 Sonnet tokens). Haiku could take the list first, with Sonnet only if it fails.
- **D4, the share image** (193,973 Fable tokens). One layout assembled from parts the site already has, judged by measurement. Opus could design it.

What should stay where it is: the first review of a visual unit on Opus. B2's second review found a reader-visible bug in the approved CSS that the first had missed, and B3's first found a keyboard focus ring cut off.

## What to do differently next time

- **Designs for one screen were drawn in parallel, each against the page as it was.** D1, D2 and D3 all change the Lesson page, so D3's spec could not know about D2's fourth tab or D1's reading layout, and the orchestrator had to rule on four overlaps. Next time designs that touch one screen go in order, or the later brief names the earlier design.
- **A spec's acceptance checks were not all tried on a built page.** Two of D2's checks could not pass with the markup the spec gave. A designer should say which checks can only be tried on the build.
- **Builders left processes behind**: eighteen wait loops after B1, a preview server after B2's review. `builder.md` now says how to wait for the end-to-end run.
- **A follow-up to the same agent is far cheaper than a fresh one.** B5's second review continued the first reviewer and cost about 10,000 tokens, where a fresh second review cost 45,000 to 110,000. A builder's fix after a ruling was the same. The reviewer still sees only the diff and its own earlier report. Use a fresh agent for a first review and a continued one for checking named fixes.
- **The orchestrator's own spec lines need the same care as a designer's.** In B5's spec it gave the folded log the desktop's 52px without checking the tablet's taller controls; the builder caught it.
- **Two failed reviews happened on B2 and B4 over tests, not over the build.** Every blocker in those four reviews but one was a test that could not fail or a check without a test. The builder's brief should ask for each new test to be shown failing first.

# Job 2: Phase 3, one fact-check path

Done on 2026-11-11. The owner said go on the plan that day.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S2 | scout | Haiku | 1 | 119,488 | Done. How fact-checking covers each kind of content, every fact with a `path:line`. |
| B1 | builder | Sonnet | 2 | 115,734 | Quotes as data: the parser, the header's optional record, the checker's instructions and `docs/content-model.md` §8. Try 2 took the nine review points and the amended formats. |
| B1 | reviewer | Opus, high | 2 | 129,085 | FAIL, then FAIL. First: badly written quotes dropped in silence, a spec conflict (an OSI badge that cites nothing), and an instruction that contradicted its neighbours. Second: a passage line without its mark dropped, and a PDF's saved text overwritten page by page. |
| B1 | orchestrator | Fable | 1 | not counted | After two failed reviews: the last parser cases named, the instructions corrected. `npm test` 1,426 passed. Merged. |
| B2 | builder | Sonnet | 2 | 161,026 | The quote check: `npm run fact-check -- <slug> --quotes <folder>`. Try 2 rewrote the search to the amended rules and reads pages with `jsdom`. |
| B2 | reviewer | Opus, high | 2 | 165,604 | FAIL, then FAIL. First: a part matched inside a word, hyphens joined for the whole text, attribute text leaked, forty entities known. Second: a number cut at its decimal point, a superscript run into its base, a dash at a line's end taken for a hyphen, a long passage crashing the search. |
| B2 | orchestrator | Fable | 1 | not counted | After two failed reviews: those four fixed with tests first, and the smaller gaps. `npm test` 1,473 passed. Merged. |
| B3 | builder | Sonnet | 1 | 151,082 | OSI Model's report converted by script, with proof; six sources fetched; 152 of 160 quotes found, the other 8 reported with the source text around them, none fixed. |
| B3 | orchestrator | Fable | 1 | not counted | Checked the conversion against the original: header, 127 verdicts and hash unchanged, all 160 passages word for word. The 8 were extraction effects: six lost line-end hyphens (cured by `pdftotext -raw`, now in the checker's instructions) and two page breaks (an omission mark added at each, with a note). `Quotes OK: 160 quotes in 6 sources`. Merged. |
| B4 | builder | Sonnet | 2 | 119,215 | The gate reads the quote record (six rules), and the build refuses glossary entries and objective mappings. |
| B4 | reviewer | Opus, high | 2 | 102,531 | FAIL, then FAIL. First: a dev warning that was untrue for the guard, a rule with no test of its own, a stale roadmap line; no way past the gate found. Second: the orchestrator's own date rule followed any future date. |
| B4 | orchestrator | Fable | 1 | not counted | The record follows the report's date only when it is exactly one day ahead. `npm test` 1,489 passed. Merged. |
| B5 | fact-checker | Opus | 2 | 186,358 | The canary checked by the changed fact-checker (a general agent told to follow the instruction file on disk, since the loaded agent type predates today's edits). Run 1: the form, the quote check and the record all worked; every planted fault was caught; the OSI badge that spans layers was marked partial for citing nothing, against its own unchanged rule. One sentence added to the instructions. Run 2: 29 passing, 1 partial, 4 failing; the same 29 items pass and the same 5 fail as on record; one planted fault is judged failing where the record had partial. 22 quotes confirmed. |
| Final | orchestrator | Fable | 1 | not counted | On `revamp` after the last merge: `npm test` 1,489 passed; `npm run build` within budget (25 pages); `npm run e2e` 969 passed, 256 skipped, 0 failed (17.6 minutes, on commit a6f059f, lid open). |

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 119,488 |
| builder | Sonnet | 547,057 |
| reviewer | Opus | 397,220 |
| fact-checker | Opus | 186,358 |
| designer | Fable | 0 |
| **All subagents** | | **1,250,123** |

The estimate in the plan was about 1,500,000.

## Could go one model lower next time

- **B3, the conversion.** A script, a proof and six downloads: Haiku could try it first, with the orchestrator's check of the result unchanged.
- **Second tries that are a numbered list of fixes** (B1's nine points, B4's five): the same as job 1. Haiku first.
- Nothing else. Every first review here found a real fault in the thing that decides whether a quote is true, and the two fact-check runs are what Opus is for.

## What to do differently next time

- **The spec was written before the edge cases were known, and three reviews in a row turned on that.** The formats section changed after B1's first review, B2's first and B2's second. For a job that is a format or a matching rule, the first unit should be the test cases: the reviewer's probes, written before the code.
- **All three reviewed units failed two reviews and came back to the orchestrator**, each time for a short list. A third builder round would have cost more than fixing a few lines; the rule worked as intended here.
- **The orchestrator's own additions were the source of two blockers** (the folded log's height in job 1, the date rule in this one). A change the orchestrator adds to a brief gets the same test-first treatment as anyone's.
- **An agent type holds the instructions it was loaded with.** After editing a file in `.claude/agents/`, either restart the session or have a general agent read the file from disk, as B5 did.
- **The fact-checker's partial and failing verdicts are not stable between runs** on one canary item (a traced part that adds a value of its own): partial on record and in run 1, failing in run 2. Both block a lesson. If the difference ever matters, the rule that separates them needs sharpening, and that is a change to a judgment rule, so it needs the owner.

# Job 3: Phase 4, the pilot

The owner said go on 2026-11-11. It ends with one lesson, What is UDP, cited, checked and merged, and with targeted re-checks built. What is HTTP has not started: the pilot stopped for the owner twice (the scale of rewording; then the cost of full re-checks), and its numbers are below.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S3 | scout | Haiku | 1 | 187,981 | Done. What moving a lesson takes, what OSI Model took, and the size and sources of each of the 17. |
| G1, G2, G3 | builder | Sonnet | 2 | 182,657 | Done and merged. A cited lesson needs no exam tag; Home's demo reads a lesson's whole lead and lists its sources in the lesson's numbered order; tests take an unchecked or a checked lesson from the registry and the closed list. |
| G1, G2, G3 | reviewer | Opus, high | 2 | 167,550 | G1 PASS. G2 and G3 FAIL, then PASS. First: nothing proved the change through Home's own code; the end-to-end tests learned "checked" from the page under test. |
| G4 | builder | Sonnet | 2 | 347,467 | Targeted re-checks (the owner's decision): the items record and `--stamp`, the re-check sheet, the second report file, the gate for the pair. About 190 tests, written before the code. |
| G4 | reviewer | Opus, high | 2 | 192,479 | FAIL, then FAIL. First: three changed lessons passed with nothing re-judged (a question's prompt apart from its options; steps swapped and an event moved; a source's registry entry changed), two of them through the spec's own rule. Second: a moved item was judged with nothing beside it to show where it sat; a Learn part taken out left old verdicts standing. |
| G4 | orchestrator | Fable | 1 | not counted | After two failed reviews: a judged list item is shown in its place, and a Learn part taken out re-opens what rests on the whole lesson. `npm test` 1,685 passed. Merged. |
| L1 | author | Sonnet | 8 passes | 416,824 | What is UDP. Pass 1 kept only what it found stated and cut much of the lesson's teaching; pass 2 restored it from the analyst's sources (the owner's decision); passes 3 to 8 fixed what each check found, the last a single citation. Then the list of every changed sentence, `docs/lesson-changes/what-is-udp.md`. |
| L1 | analyst | Opus | 1 | 153,198 | Sources for most of the cut ideas, and five claims of the original shown to be wrong or unsupported. |
| L1 | rehearsal | Sonnet | 1 | 231,357 | The fact-checker's instructions run once on Sonnet, report thrown away: 14 items partial, all fixed. The first real run then found 13 others: it did not save a run. Dropped from here on. |
| L1 | fact-checker | Opus | 5 full runs, 1 re-check | 1,219,351 | Full runs: 13, 9, 1, 1 and 1 of 101 items not passing (1,130,728 tokens, about 226,000 a run). The targeted re-check judged the one changed item and passed it (88,623). Every quote in every run was confirmed by the script. |
| L1 | orchestrator | Fable | 1 | not counted | Looked at the built lesson: "Checked 11 Nov 2026, 31 sources", OSI layer 4, numbered sources, the track card and Home's count. Merged. |
| Final | orchestrator | Fable | 1 | not counted | On `revamp`: `npm test` 1,685 passed; `npm run build` within budget (25 pages); `npm run e2e` 969 passed, 256 skipped, none failed (17.7 minutes, lid open, on `dbfac6c`). |

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 187,981 |
| builder, author, rehearsal | Sonnet | 1,178,305 |
| reviewer, analyst, fact-checker | Opus | 1,732,578 |
| designer | Fable | 0 |
| **All subagents** | | **3,098,864** |

The plan's estimate was 2 to 3 million for two lessons. This is one lesson and the re-check tooling.

## What one lesson cost, and what the next should

What is UDP: 2,020,730 tokens. Author 416,824 (with the list of changed sentences); analyst 153,198; rehearsal 231,357; fact-checks 1,219,351.

| | As it ran | With what the pilot taught |
|---|---|---|
| Analyst | after the author had cut half the lesson | first, so the author writes once (saves a pass, about 70,000) |
| Rehearsal on Sonnet | 231,357 | dropped |
| Full checks on Opus | 5 (1,130,728) | 3: the third was the near-pass (about 690,000) |
| Targeted re-checks | 1 (88,623) | 2 or 3 (about 180,000 to 270,000) |
| **A lesson** | **about 2.0 million** | **about 1.3 to 1.5 million** |

Sixteen lessons are left. At 1.3 to 1.5 million each that is roughly 21 to 24 million tokens. The cost is mostly three full reads on Opus, and the pilot showed why they are needed: runs 2, 3 and 4 each found a real fault in an item the fixes had not touched.

## What the pilot found

- **Moving a lesson is rewriting it.** What is UDP differs from the original in 34 corrections, 15 removals, 20 additions and 9 rewordings (`docs/lesson-changes/what-is-udp.md`). It went from 1 source to 31.
- **The original was wrong in places.** A jitter buffer's size, the loss a call tolerates, how long a router remembers a port pair, "late is as bad as lost" for lookups and games, a recorded delivery that resends.
- **An author on Sonnet keeps only what it finds stated.** Without the analyst the lesson lost its central idea. With the analyst's sources, most of the teaching came back.
- **A fresh checker finds a different handful every time.** Nothing it found in the last three runs was a false fact about UDP: a citation one section off, a word too strong, a newer standard.
- **A targeted re-check costs about 40% of a full run and takes a minute and a half.**

## Could go one model lower next time

- **The author's last passes** (a single citation, a scope change): Haiku could make a one-line edit from an exact instruction.
- **The list of changed sentences**: a script and Haiku.
- Nothing else. The analyst and the checker are what Opus is for, by the owner's rule.

## What to do differently next time

- **Analyst before author**, with the lesson's ideas listed and a source for each before a word is rewritten.
- **No rehearsal.** The author sweeps for the five kinds of fault the checkers found (a statement outside the cited section; a defining marker on a document that does not define the thing; an absolute a newer standard breaks; a part that says more or less than what it rests on; a name no traced part gives).
- **Decide in advance** what the owner was asked mid-lesson: ideas come back wherever a source states them; a badge may rest on two vendors' pages.
- **A spec for a gate gets its attack cases first.** G4's spec was right about its rules and wrong about what they let through; both reviews found holes by trying to get a changed lesson past it. The reviewer's probe list should exist before the builder starts.
- **Side by side is proven, and needed one setting** (2026-11-11, after the pilot). A worktree under `.superpowers/wt/` with `node_modules` linked passes the fact-check gate, `npm test` (1,685) and `npm run build`. Two folders could not run end-to-end specs at once, since the server's port was fixed, so `E2E_PORT` now sets it: the main folder on 4471 and the worktree on 4481 ran `og-image` and `reading` at the same time, 29 passed in each; with 4471 held by another server the worktree's run passed on 4481 and refused without it. The orchestrator made this change itself, three lines found while proving the setup, with no builder or review.

# Job 4: What is HTTP, alone

The owner said go on 2026-11-11 (plan at `46afa6b`). One lesson under the order the pilot taught, with a spec review before the one build and a three-level build review.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S4 | scout | Haiku | 1 | 127,655 | Done before the go. What else in the repo rests on the lesson's words and shape, every fact with a `path:line`; it is `plan.md`'s "What the scout found". |
| D5 | designer | Fable | 1 | 282,223 | Done 2026-11-11, in its own worktree while the lesson ran. Two variants of Home's source list: the stamp, the first three sources, then the rest behind a control with no script (A) or a link to the lesson (B). Measured at 375 and 1440 in both themes, with 2, 12 and 31 sources and the edge counts. **Approved by the owner on 2026-11-11 in variant A** (open in place), with short source names, the stamp on Home and the phone's two-across list on an upright tablet. |
| L2-a | analyst | Opus | 1 | 235,921 | Done. 154 ideas, each with its source and section or "no source": 86 stated, 40 stated with a change, 8 wrong, 18 with no source. 164 of its 166 quoted passages found by script in the saved sources; the other two are background from a page the lesson does not cite. The five steps stand; two sources forced smaller changes (direction 2.23). |
| L2-b | orchestrator | Fable | 1 | not counted | The registry holds the lesson's 14 new documents and WHATWG's three hosts, before the author started (`eabe8e1`). One test that expected no standards-body host was rewritten for a listed and an unlisted host. `npm test` 1,685 passed. |
| L2-b | author | Sonnet | 2 passes | 330,252 | The lesson in the cited shape (`c6560ff`): 102 items on the claim sheet, 20 sources, no limit override, the five steps, 14 events and two questions in their shape. It handed over eleven doubts. Pass 2 (`fa5722a`) applied the analyst's rulings on them. |
| L2-b | analyst (the doubts) | Opus | 1 | 74,287 | The same analyst, continued: 3 doubts kept, 7 changed, 1 split, and 13 more changes from its own sweep of the sheet, each with words, citations and the passage. The orchestrator ruled the eight message sizes become dashes, as What is UDP did. |
| L2-c | fact-checker | Opus | full check 1 | 199,343 | Not passed: 83 of 102 pass, 19 imprecise, none wrong (`9503e20`, as written). 3 content claims; 16 traced items that name TCP, port 80, GET or 200 OK without tracing to the Learn part that states it. 174 quotes confirmed in 20 sources, all current. Not a near-pass, so the next check is full. |
| L2-c | analyst (the failed items) | Opus | 1 | 31,243 | The same analyst, continued: exact words and citations for the 3 content claims, and every traced item judged the way the checker had: 20 need a trace or a word, 4 of them not flagged by the check. |
| L2-c | author (fixes) | Sonnet | pass 3 | 16,779 | The 24 round-2 rulings applied as written, and one trace of its own (`1f8da51`). |
| L2-c | fact-checker | Opus | full check 2 | 205,479 | **Passed: all 102 items** (`d47db3f`). 154 quotes confirmed in 20 sources, all current. `npm run fact-check -- what-is-http --check`: `Report OK`. No re-check was needed. |
| L2-d | author | Sonnet | 1 | 31,500 | `docs/lesson-changes/what-is-http.md` (`fa36f27`): 41 corrections, 7 removals, 12 additions, 3 rewordings against the original; 2 sources became 20. Its counts were made by counting the rows. |
| Rules | orchestrator | Fable | 1 | not counted | The owner's two decisions after reading the changed sentences (direction 2.24): the fact-checker passes what is true for a beginner, and the author sweeps for a missing trace as a sixth fault. In `.claude/agents/fact-checker.md`, `.claude/agents/author.md`, `CLAUDE.md` and `docs/content-model.md` §8. |
| Rules | fact-checker (canary) | Opus | 1 | 96,842 | The canary on the changed checker (a general agent told to follow the instruction file on disk): all five planted faults flagged (4 wrong, 1 imprecise) and the other 29 items passed, the same 29 and 5 as on record. 21 quotes confirmed in 4 sources. The canary's test passes. It has no sentence that is merely less exact than its source, so it shows the new rule still catches faults, not that it lets a simplification through; the next lesson is the first test of that. |
| H1 | reviewer (spec review) | Opus, high | 1 | 104,234 | Before the build: eight holes in the spec, each with one right answer once measured (a lesson with only the `full` cue; cues on notes; "lit from" against "lit at"; a no-island check and a colour check that could not fail; test sizes that are not the projects'; a throw with no fixture; a fade read too early), closed by the orchestrator as errata, and 26 attack cases. `prototypes/d5-cases.md`. |
| H1 | builder | Sonnet | 1, then the review's three fixes | 189,571 | Implements D5 variant A and the errata (`6beb12f`, fixes `b88ff80`). Home's Learn part shows "Checked 11 Nov 2026, 20 sources", sources 1 to 3 and "Show the other 17"; the laptop's page is drawn from the lesson's own cues, at step 5. Each of the 26 cases has a test with a named break and its failure. `npm test` 1,698 passed; build within budget; `e2e/site.spec.ts` passed in all seven projects (77 in each desktop project, 87 on phone). |
| H1 | reviewer (build review) | Opus, high | 1 | 75,567 | **PASS WITH FIXES**: no blockers, no drift from variant A, the eight errata built as written, nothing under `src/content/` touched. 12 breaks of its own each turned a unit test red; the H1 end-to-end block passed 37 of 37. Three fixes, all tests too weak (one title of 20 asserted; any folded link accepted after Enter; the control measured closed only). |
| H1 | orchestrator | Fable | 1 | not counted | Ran the reviewer's "fixed when" check for each fix, with no second review: the title test goes red with the tooltip removed from the shown links (4 failed); the touch-target test goes red with the open control shrunk (`Expected: >= 44, Received: 19`); `'RFC 791'` is asserted in `keyboard()`; restored, the three pass (13 passed). Looked at the built Learn part at 375 and 1440 beside the prototype. |
| Final | orchestrator | Fable | 1 | not counted | One merge into `revamp` (`d4fbed9`). On it: `npm test` 119 files, 1,698 tests passed; `npm run build` "Every page is within budget (25 pages)."; `npm run e2e` 1,191 passed, 256 skipped, none failed (18.3 minutes, lid open, exit 0). |

## Designer spend

| Unit | Variants | Tokens | Approved by the owner |
|---|---|---|---|
| D5 | 2 | 282,223 | 2026-11-11, variant A |

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 127,655 |
| author, builder | Sonnet | 568,102 |
| analyst, fact-checker (the canary included), reviewer | Opus | 1,022,916 |
| designer | Fable | 282,223 |
| **All subagents** | | **2,000,896** |

The plan's estimate was about 2.0 to 2.2 million: 1.3 to 1.5 for the lesson, about 0.6 for Home, and the scout. The canary run (96,842) was not in the plan; it followed the owner's rule change.

## What the lesson cost, against the estimate

What is HTTP: **1,124,804 tokens**. The estimate was 1.3 to 1.5 million; What is UDP cost 2,020,730.

| | Estimate | As it ran |
|---|---|---|
| Analyst | 150,000 to 200,000 | 341,451: the report on every idea (235,921), rulings on the author's doubts (74,287), words for the failed items (31,243) |
| Author | 350,000 to 450,000 | 378,531: three passes (347,031) and the list of changed sentences (31,500) |
| Fact-checker | 800,000 to 850,000 (three full checks, two re-checks) | 404,822: two full checks, no re-check |
| **The lesson** | **1.3 to 1.5 million** | **1,124,804** |

- **The analyst cost more than planned and the checker half.** The analyst was called three times, not once, and each call replaced a guess the checker would have failed. The lesson passed on its second full check, where What is UDP took five and a re-check.
- **The first check failed on bookkeeping.** 16 of its 19 failures were a Watch item showing TCP, port 80, GET or "200 OK" with no trace to the Learn part that says so. The analyst's strict sweep before that check had judged words and citations and missed them; its second sweep, told to judge as the checker had, found those 16 and 4 more.
- **Moving the lesson was again mostly rewriting:** 41 corrections, 7 removals, 12 additions, 3 rewordings; 2 sources became 20. The owner read the list and found most of the originals fine: about 15 corrections fixed something false or misleading and about 26 tightened a sentence that was true for a beginner. The rule that forced those is changed (direction 2.24).
- **Home's rows: 651,595** against about 0.6 million: designer 282,223, reviewer 179,801 (spec review 104,234, build review 75,567), builder 189,571.

## What the two review rules saved or cost

H1 is the first unit with a spec review before its build and a three-level build review.

- **Cost:** one more Opus read before the build, 104,234 tokens.
- **What it found before a line was written:** eight holes, each with one right answer. Two would have been faults in the build (a lesson that carries only the "full page" cue had no step for the page's words; cues on notes were not read) and four were checks that could not fail as the spec wrote them.
- **What followed:** the build passed its first review with no blocker and no drift. Its three findings were weak tests; under the old rule any finding was a FAIL, a second builder round and a fresh second review (45,000 to 110,000 tokens in job 1). Here the same builder fixed them for 3,664 tokens and the orchestrator ran the reviewer's three checks.
- **For scale:** H1 took 369,372 tokens for its spec review, build and review, and one try each. Job 1's visual units took 290,000 to 715,000 and two tries each, and ten of the thirteen units reviewed before these rules failed their first review.
- **One unit is one data point.** It was a small unit with a designer's spec that already had 16 acceptance checks.

## Proposal for the other 15 lessons

1. **Expect about 0.85 to 0.95 million tokens a lesson, so about 13 to 14 million for the 15.** One analyst report (about 240,000) and one follow-up (30,000 to 70,000); the author (about 330,000); one full check (about 200,000) and, after a near-pass, a targeted re-check (about 90,000); the list of changed sentences (about 30,000). That assumes the first check is a pass or a near-pass, which the sixth fault and the looser rule are for. At What is HTTP's cost it would be about 17 million; at What is UDP's, about 30.
2. **Three lessons at a time, in worktrees.** The three analysts run together and change no file; the orchestrator registers the three lessons' documents in one commit on `revamp`; then three authors start, each in its own worktree on its own branch, and each lesson is checked and merged when it passes. Five jobs of three, a fresh session each.
3. **Order:** What is HTTPS first (Home shows its lead), with What is TCP and What is DNS, whose documents What is HTTP already registered; then the other nine tour lessons; then DHCP, Subnetting and Firewalls.
4. **The first batch tests the looser rule.** Count each lesson's corrections against What is HTTP's 41, and read the checker's notes on what it passed as a simplification; if a note names something a beginner would be misled by, the rule's wording is tightened before the second batch, with the owner's yes.
5. **Before the first check, the analyst reads the claim sheet once as the checker will**, the traced items included. On this lesson that read, done after the failure, found everything the second check then passed.
6. **Only What is HTTPS needs a Home unit**, and a small one: Home shows its lead, so a builder changes the tests that quote it.

## Could go one model lower next time

- **Applying a list of exact rulings** (the author's second and third passes, 33,951 tokens together): Haiku could apply "new words, these citations" line by line.
- **The list of changed sentences** (31,500): a script for the comparison and Haiku for the reasons, as job 3 said.
- **The build review of a unit whose spec review left cases** (75,567 on Opus): Sonnet at high effort could try named cases against a diff. Keep the spec review itself on Opus: its eight holes were the value.
- Nothing else. The analyst and the fact-checker are what Opus is for, by the owner's rule, and D5 needed taste.

## What to do differently next time

- **A sweep must be told what the checker judges.** "Be strict" found 13 faults in words and citations and none of the 16 in traces. The brief that worked named the checker's test for a traced item.
- **A resumed agent's token figure is its running total.** Record the difference for each pass, as this ledger does.
- **A dev server in a worktree with linked `node_modules` returns 403 for fonts and the lesson island.** The designer measured against a build written to a scratch folder; a brief should say so.
- **The owner's read of the changed-sentences list changed a rule.** The list is worth its tokens: show it before the next batch starts, not at the end of a job.
- **Errata that came to the owner with this job:** the eight to H1's spec (`prototypes/d5-cases.md`); the page on Home's laptop drawn at step 5, from the lesson's cues; and the lesson's three source-forced changes (direction 2.23).
