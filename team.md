# Team ledger

The job in `plan.md` now is the first batch of three lessons, What is HTTPS, What is TCP and What is DNS: its rows are under "Job 5" at the end. Job 1 was the Lesson page (Phase 2), job 2 was Phase 3, one fact-check path, job 3 was the Phase 4 pilot and job 4 was What is HTTP alone; all four are done.

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

# Job 5: three lessons side by side (batch 1 of 5)

Planned on 2026-11-11; the owner said go that day. What is HTTPS, What is TCP and What is DNS, each in its own worktree, under the rules of direction 2.24 and 2.25.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S5 | scout | Haiku | 1 | 250,966 | Done before the go. The three lessons' sizes and documents, what rests on their words and shape, and the five files where three branches collide: `prototypes/s5-batch-1-facts.md`, every fact with a `path:line`. It also sized the other twelve. |
| L3-a | analyst | Opus | 1, then the rulings | 363,483 | What is HTTPS: 138 ideas, each with its source and section: 90 stated, 26 stay word for word, 13 change, 9 have no source. 125 quoted passages, all found by script in 52 saved sources. RFC 8446 is obsolete (RFC 9846, July 2026) and so is RFC 2818. The lead Home quotes stands word for word. No step changes; two page cues do (direction 2.26). The report was 352,411; writing the orchestrator's rulings into it, 11,072. |
| L4-a | analyst | Opus | 1, then the rulings | 314,600 | What is TCP: 75 stated, 41 stay, 12 false or misleading, 3 with no source; 15 new Learn parts for the Watch tab to trace to. 115 passages, all found. No step changes; the page cue at step 5 goes (direction 2.26). The report was 312,377; the rulings, 2,223. |
| L5-a | analyst | Opus | 1, then the rulings and two searches | 293,311 | What is DNS: 101 rows: 44 stated, 40 stay, 3 false or misleading, 8 message sizes with no source; five new Learn facts and one Go deeper paragraph. 101 passages, all found. No step or mark changes. The report was 279,387; the rulings and the searches for two second sources, 13,924 (it found ICANN's page for the root servers' copies and no second page for the OSI badge; the orchestrator found Microsoft's Traffic Manager page). |
| R1 | orchestrator | Fable | 1 | not counted | `batch/1` made from `revamp`; the registry holds the three lessons' 54 documents and five new hosts (`c9ec4a0`; direction 2.26). The test that expected no internet-registry host was rewritten for a listed and an unlisted one. `npm test` 119 files, 1,698 passed; `astro check` 0 errors. Three worktrees made from it, `node_modules` linked. |
| L3-b | author | Sonnet | 2 passes | 262,994 | What is HTTPS in the cited shape (`5f1be4f`), in its worktree: 117 items, 39 sources, no override; 13 corrections, the six steps, 20 events and two questions in their shape, the lead Home quotes word for word. It handed over nine doubts. Pass 2 (`c7204ab`, 10,607) applied the analyst's 13 rulings; 118 items. |
| L3-p | analyst (the read before the check) | Opus | 1 | 116,225 | The same analyst, continued: the sheet judged as the checker will, 103 of 117 items sound, 13 rulings (four are traces only, two more add a trace with a Learn change), each with words, citations and the passage. The orchestrator ruled the term's name "HTTPS (HTTP Secure)" and the step fact "X25519 with ML-KEM". Its context was summarised during the pass, so the figure is counted from its transcript. |
| L4-b | author | Sonnet | 2 passes | 236,358 | What is TCP in the cited shape (`ba8ecf4`): 123 items, 21 sources, no override; 11 corrections, 15 new Learn facts, the page cue gone from step 5. Thirteen doubts. Pass 2 (`283a0e0`, 16,576) applied the analyst's 13 rulings. |
| L4-p | analyst (the read before the check) | Opus | 1 | 143,821 | The same analyst, continued: 107 of 123 items sound, 13 rulings (four for traces, nine that add citations or set defining markers). The orchestrator kept "one round trip before any data" as written, with a fallback ready. Counted from its transcript, as above. |
| L5-b | author | Sonnet | 2 passes | 210,516 | What is DNS in the cited shape (`6f84c96`): 89 items, 29 sources, no override; 3 corrections, 8 sizes to dashes, five new Learn facts and one Go deeper paragraph. Seven doubts. Pass 2 (`20d2304`, 8,810) applied the analyst's six rulings. |
| L5-p | analyst (the read before the check) | Opus | 1 | 48,425 | The same analyst, continued: 83 of 89 items sound, six rulings (two traces, three Learn parts widened for what a Watch item shows, one citation). |
| L5-c | fact-checker | Opus | full check 1 | 161,936 | **Passed: all 89 items** (`b7d0fbb`), on the first full check. 134 quotes confirmed in 29 sources, all current. `npm run fact-check -- what-is-dns --check`: `Report OK`. `npm test` in the worktree: 1,698 passed. It passed the example site by name, with a note: `techconcepts.app` is a real domain and a real lookup answers differently. |
| L5-d | author | Sonnet | 1 | 29,099 | `docs/lesson-changes/what-is-dns.md` (`8bc3754`): 3 corrections, 8 removals, 7 additions, 5 rewordings; 2 sources became 29. Counted by script. |
| L4-c | fact-checker | Opus | full check 1 | 187,479 | **Passed: all 123 items** (`3b52838`), on the first full check. 153 quotes confirmed in 22 sources, all current. `Report OK`. `npm test` in the worktree: one failure, Home's sample of TCP's page cue (H2's). |
| L4-d | author | Sonnet | 1 | 23,557 | `docs/lesson-changes/what-is-tcp.md` (`bc84025`): 11 corrections, 3 removals, 17 additions, 2 rewordings; 1 source became 22. Counted by script. |
| M1 | orchestrator | Fable | 1 | not counted | What is DNS merged into `batch/1` (`fe74a9f`): no conflict, `npm test` 1,698 passed. What is TCP merged (`d24cfde`): one conflict, the legacy list's test, reconciled to hold both moves (13 lessons, 10 of the tour); `npm test` 1,697 passed, 1 failed (Home's sample, as allowed). Both worktrees removed. |
| L3-c | fact-checker | Opus | full check 1 | 215,417 | Not passed: 114 of 118 pass, 4 imprecise, none wrong (`3cf0939`, as written). All four say what a watcher can see (addresses, ports, the TCP handshake) and rest on RFC 9849 §1 alone. One over a near-pass, so the next check is full. 208 quotes confirmed in 39 sources. |
| L3-c | analyst (the failed items) | Opus | 1 | 43,505 | The same analyst, continued: two documents that state it (RFC 8404 §3.1.1 and §2.1.2, RFC 9065 §1 and §2.3.2), five rulings, no word changed, and a sweep of 17 other places that say what a watcher sees, all carried. |
| L3-c | author (fixes) | Sonnet | pass 3 | 9,589 | The five rulings applied as written and the two documents registered on the lesson's branch (`02ee4c7`): 118 items, 41 sources. |
| L3-c | fact-checker | Opus | full check 2 | 234,710 | **Passed: all 118 items** (`03639a0`). 219 quotes confirmed in 41 sources, all current. `Report OK`. `npm test` in the worktree: two failures, both Home's samples (H2's). No re-check was needed. |
| L3-d | author | Sonnet | 1 | 21,101 | `docs/lesson-changes/what-is-https.md` (`b2760ae`): 16 corrections, 12 removals, 21 additions, 2 rewordings; 2 sources became 41. Counted by script; the orchestrator checked each quoted before and after against the two versions of the lesson's file. |
| M1 | orchestrator | Fable | 1 | not counted | What is HTTPS merged into `batch/1` (`8b99fe6`): two conflicts, the legacy list and its test, reconciled to hold all three moves (12 lessons left, nine of the tour). `npm test` 1,696 passed, 2 failed (Home's two samples, as allowed). Its worktree removed. |
| H2 | orchestrator | Fable | 1 | not counted | H2's spec written into `plan.md` once What is TCP was on `batch/1` (`978d50a`): no word on Home changes, three samples in Home's tests used the lessons as they were. |
| H2 | reviewer (spec review) | Opus, high | 1 | 84,925 | Before the build, measured in a throwaway copy: five holes, each with one right answer (a break to a lesson's content fails at the registry's gate, not at a test; "citations taken out" had three readings and one works; the real and the swapped lesson cannot both be read after a swap; the legacy-list assertion can never be the one that goes red; the only sample with pictures after words was lost), closed by the orchestrator as errata, and 13 attack cases. Under the unit in `plan.md` (`ffbe7c1`). |
| H2 | builder | Sonnet | 1 | 104,666 | `5604d7e`: `src/lib/home.test.ts` only. The uncited sample makes its own lesson, What is HTTPS and What is TCP are the first real lessons behind the two page-cue errors, the sealed box's two sentences are held as a literal, and the lesson Home points to must be off the legacy list with a dated stamp. Twelve of the 13 cases listed with a break and its failure. `npm test` 1,702 passed; build within budget; `e2e/site.spec.ts` 549 passed. |
| H2 | reviewer (build review) | Opus, high | 1 | 58,342 | **PASS**: no blockers, no fixes. It made all 13 breaks in a copy and each turned a test red for the reason its case names, case 13 included (the one the builder's table left out). Nothing outside `src/lib/home.test.ts` changed. Three notes: the literal is a test of its own; one test's name says "step 6" and nothing asserts it; a message that never prints when a stamp is missing (the test still goes red). |
| Final | orchestrator | Fable | 1 | not counted | One merge into `revamp` (`17461e4`). On it: `npm test` 119 files, 1,702 tests passed; `npm run build` "Every page is within budget (25 pages)."; `npm run e2e` 1,191 passed, 256 skipped, none failed (18.5 minutes, lid open, exit 0). The three built pages say "Checked 11 Nov 2026" with 41, 22 and 29 sources. Merged branches left in place; nothing pushed. |

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 250,966 |
| author, builder | Sonnet | 897,880 |
| analyst, fact-checker, reviewer | Opus | 2,266,179 |
| **All subagents** | | **3,415,025** |

After the go (without the scout): 3,164,059. The plan's stop was 3.6 million for the batch and 1.5 million for one lesson; neither was reached. No designer in this job.

## What each lesson cost, against the estimate

The estimate was 0.85 to 1.0 million a lesson, 2.6 to 3.0 million for the three.

| | What is HTTPS | What is TCP | What is DNS |
|---|---|---|---|
| Analyst: the report and the rulings | 363,483 | 314,600 | 293,311 |
| Analyst: the read before the check | 116,225 | 143,821 | 48,425 |
| Analyst: words for failed items | 43,505 | none | none |
| Author: the lesson and the rulings | 272,583 | 236,358 | 210,516 |
| Author: the list of changed sentences | 21,101 | 23,557 | 29,099 |
| Fact-checker | 450,127 (two full checks) | 187,479 (one) | 161,936 (one) |
| **The lesson** | **1,267,024** | **905,815** | **743,287** |
| Items, sources | 118, 41 | 123, 22 | 89, 29 |

The three: **2,916,126**, inside the estimate. Home's unit: 247,933 against about 0.2 million.

- **Two of three passed on the first full check, and none needed a re-check.** What is UDP took five full checks and a re-check; What is HTTP two. The read before the check found 6, 13 and 13 rulings, 10 of the 32 for traces; no first check failed on a trace.
- **What is HTTPS failed four items on one idea**, what a watcher on the network can see, cited to one document that states part of it. Four is one over a near-pass, so the second check was a full one: 234,710 where a re-check costs about 90,000.
- **The analysts cost 1,323,370 against 800,000 to 950,000.** A report ran 280,000 to 350,000 where What is HTTP's was 236,000, and the read before the check 48,000 to 144,000 where the plan had 30,000 to 70,000: it reads the whole sheet again. Two analysts' contexts were summarised during that read.
- **The authors cost 793,214 against 1.0 to 1.15 million.** Each wrote once from a report with rulings in it and applied rulings in passes of 9,000 to 17,000.

## Corrections, against What is HTTP's 41

| Lesson | Corrections | Removals | Additions | Rewordings | Sources |
|---|---|---|---|---|---|
| What is HTTP (the old rule) | 41 | 7 | 12 | 3 | 2 became 20 |
| What is HTTPS | 16 | 12 | 21 | 2 | 2 became 41 |
| What is TCP | 11 | 3 | 17 | 2 | 1 became 22 |
| What is DNS | 3 | 8 | 7 | 5 | 2 became 29 |

Corrections fell to between a fourteenth and two fifths of What is HTTP's. Most removals are message sizes turned to dashes (8 of DNS's 8, 9 of HTTPS's 12; TCP's 14 are one row). The additions are almost all Learn parts added so a Watch item has something to trace to: the looser rule cut corrections, and the trace rule moved the work into additions.

## What the checkers passed as a simplification (decision 8)

Every note is in the lesson's list of changed sentences, under "Passed with a note" (What is HTTPS, 15), "What the checker passed as a simplification" (What is TCP, 20) and "Passed as a simplification, with a note" (What is DNS, 24), taken from the `Note:` lines of the three reports. The orchestrator read all of them. Most say what a general word leaves out ("many sites", "a few months", "usually up to 1460 bytes", "hundreds of copies" where ICANN counts more than 1,500, "most sites have at least two name servers" where the standard asks it of every zone, "hide your lookups from the network" where the resolver still sees them, "one round trip before any data" without TCP Fast Open). None gives a wrong cause, number, name or order.

Two are for the owner before batch 2:

1. **`techconcepts.app` is the example site of What is HTTPS and What is DNS.** It is this site's real domain, and the lessons give it made-up records (198.51.100.7, `ns1.techconcepts.app`). All three checks passed it: the rule's words are "example names like `example.com`", and each checker read the name as clearly the lesson's own example, with documentation addresses. Two of the three said so and asked for the call. A beginner who looks the name up gets other answers than the lesson's. Keeping it is direction 2.26; changing it to a reserved name changes the scene's labels, DNS's `.app` steps and plate, their tests, and both reports. **The owner's answer, 2026-11-11: "Keep it."**
2. **What is TCP, step 4: "the laptop had already sent ACK 1461", and the animation has no row for that first ACK.** The words are true and follow from the numbers; the reader is told of a message the log never showed. Adding the row is a new event, which decision 3 kept out of this job. **The owner's answer, 2026-11-11: "Leave it as is."**

## Could go one model lower next time

- **Applying a list of exact rulings** (seven passes, 8,810 to 16,576 each, 55,582 in all): Haiku, as job 4 said.
- **The list of changed sentences** (73,757 for three): a script for the comparison and Haiku for the reasons.
- **The build review of a tests-only unit with named cases** (58,342 on Opus): Sonnet at high effort. The spec review stays on Opus: its five holes were the unit.
- Nothing else. The analyst's read before the check is what made the first checks pass.

## What to do differently next time

- **Name the checker's test for a claim, too, in the read before the check.** The brief named it for a traced item and no check failed on a trace. What is HTTPS failed on a sentence whose one cited passage states part of it ("addresses" where the passage has the server's address, and no ports). The test to name: every part of a claim, each item of a list included, is in a quoted passage of a defining document or of two publishers.
- **Plan about 450,000 for the analyst of a lesson**, not 300,000, or narrow the read before the check to the traced items, the new Learn parts and the author's doubts.
- **Four items on one missing citation is not a near-pass.** The rule (direction 2.19) counts items, so one idea said in four places cost a full check. It is the owner's rule; this is the first case against it.
- **An agent's token figure falls when its context is summarised.** The figure is the size of its context, so the difference between two passes is wrong after a summary. Count the growth between requests from the agent's transcript, as the two reads marked above were.
- **Authors took the analyst's passages as found**; two said so, though their instructions say to read each. No check failed for it, since the analyst's quotes are found by script and the checker reads the sections. Say in the brief which the author must read: the sections it cites on its own.
- **Tell an author not to run a formatter.** The repo has no formatter settings, and two lesson files were restyled twice.
- **A wait loop on `pgrep -f "playwright test"` matches itself.** The builder left three behind. Wait on the log's `EXIT` line.
- **A page cue stays only where the story fetched what it draws.** What is IMAP and What is TLS carry `page: 'full'` and What is POP3 and What is SSH both cues; rule it for each from its analyst's report, as here.
- **What is POP3's sample in Home's tests goes stale in batch 3**, as What is HTTPS's did (H2's erratum 7).
- **Errata that came to the owner with this job:** direction 2.26 (five new hosts; the page no longer drawn in What is TCP and drawn as words at step 6 in What is HTTPS; one Go deeper paragraph added to What is DNS; `techconcepts.app` kept), and the seven to H2's spec (`plan.md`).

# Job 6: three lessons side by side (batch 2 of 5)

Planned on 2026-11-12, after the owner's "Start batch 2"; the owner said go on the plan that day. What is IP, What is DHCP and What is ICMP, under direction 2.27.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S6 | scout | Haiku | 1 | 251,670 | Done before the go. The three lessons' sizes, documents, example names and addresses, what rests on their words and shape (nothing on Home; two named end-to-end checks, neither on words), the two DHCP lessons (nothing keys on the shared unit id), and the five files where three branches collide: `prototypes/s6-batch-2-facts.md`, every fact with a `path:line`. |
| L6-a | analyst | Opus | 1, then the rulings and a lookup | 353,825 | What is IP: 73 rows, 141 judgements: 84 stated, 28 stay word for word, 8 false or misleading, 11 with no source, 10 example data; ten new Learn parts for the Watch tab to trace to. 144 quoted passages, all found by script. No step, event or mark changes. The report was 341,575; the rulings and a lookup for a second publisher (`route print` found on Cisco's page, `arp -a` not), 12,250. |
| L7-a | analyst | Opus | 1, then the rulings and a lookup | 387,302 | What is DHCP: 107 rows: 74 stated, 22 stay, 2 false or misleading, 9 with no source; 2 new terms and 9 new facts. 149 passages, all found. No step, event or mark changes. It lists what Networking's DHCP lesson will have to agree with (its section 6). The report was 353,659; the rulings and a lookup on Cisco's pages (no page places DHCP at an OSI layer; `ip helper-address` and "scope" found; DORA on Microsoft's and Canonical's), 33,643. Its context was summarised, so the figures are counted from its transcript. |
| L8-a | analyst | Opus | 1, then the rulings and a lookup | 340,269 | What is ICMP: 98 rows: 32 stated, 29 stay, 11 false or misleading (six are message sizes), 15 with no source. 109 passages, all found. Every step's story has an allowed source; no step, event or mark changes. The report was 319,058; the rulings, the TTL words made the same as What is IP's, and a lookup (Cisco's page says Windows' tracert probes with ICMP echo requests), 21,211. |
| R2 | orchestrator | Fable | 1 | not counted | The orchestrator's rulings on what the three reports left open (direction 2.28); `batch/2` made from `revamp`; the registry holds the three lessons' 54 documents and two new hosts, `www.cloudflare.com` and `canonical.com`. The test that expected no community host was rewritten for a listed and an unlisted one. `npm test` 119 files, 1,702 passed; `astro check` 0 errors. Three worktrees made from it, `node_modules` linked. |
| L6-b | author | Sonnet | 2 passes | 214,611 | What is IP in the cited shape (`42c5016`), in its worktree: 97 items, 28 sources, no override; 8 corrections, 3 removals and 7 sizes to dashes, 10 new Learn parts; the five steps, 12 events and two questions in their shape. Six doubts. Pass 2 (`d439e9a`, 9,010) applied the analyst's eleven rulings. |
| L6-p | analyst (the read before the check) | Opus | 1 | 122,178 | The same analyst, continued: every item judged by the two named tests, 81 of 97 sound, eleven rulings touching 16 items (three are traces only; the rest add a citation, take a defining marker off, or cut six words only one publisher states). Counted from its transcript: its context was summarised. |
| L7-b | author | Sonnet | 2 passes | 237,892 | What is DHCP in the cited shape (`be68421`): 118 items, 25 sources, no override, the badge spanning layers; 2 corrections, 1 rewording, 6 sizes to dashes, 2 new terms and 10 new facts (one its own, `fact-same`). Eleven doubts, and three headings in the analyst's report corrected from the saved pages. Pass 2 (`383cac0`, 9,995) applied the eight rulings. |
| L7-p | analyst (the read before the check) | Opus | 1 | 91,768 | The same analyst, continued: 104 of 118 sound, eight rulings for the other 14 (one trace added to five items, two Learn parts widened, the full name, two citations, two defining markers moved or removed). All 34 text fragments found on their pages. Counted from its transcript. |
| L8-b | author | Sonnet | 2 passes | 221,061 | What is ICMP in the cited shape (`5f67a2b`): 118 items, 22 sources, no override; 6 corrections, 5 removals, 9 rewordings, 14 sizes to dashes, new Learn parts for every trace. Seven doubts. Pass 2 (`6ca07da`, 6,924) applied the eight rulings. |
| L8-p | analyst (the read before the check) | Opus | 1 | 119,228 | The same analyst, continued: 110 of 118 sound, eight rulings (one trace, one Learn value widened, three word changes, three citation fixes). Counted from its transcript. |
| L7-c | fact-checker | Opus | full check 1 | 185,487 | **Passed: all 118 items** (`3167b21`), on the first full check. 177 quotes confirmed in 25 sources, all current. `npm run fact-check -- what-is-dhcp --check`: `Report OK`. `npm test` in the worktree: 1,702 passed. |
| L7-d | author | Sonnet | 1 | 23,619 | `docs/lesson-changes/what-is-dhcp.md` (`b4faa1c`): 4 corrections, 3 removals, 12 additions, 2 rewordings; 1 source became 25. Counted by script; the orchestrator's script found each quoted before and after in the two versions of the lesson's file. |
| L8-c | fact-checker | Opus | full check 1 | 178,916 | **Passed: all 118 items** (`3a37993`), on the first full check. 171 quotes confirmed in 22 sources, all current; it read Cloudflare's page in the built-in browser. `Report OK`. `npm test` in the worktree: 1,702 passed. |
| L8-d | author | Sonnet | 1 | 22,738 | `docs/lesson-changes/what-is-icmp.md` (`ccd0163`): 16 corrections, 8 removals, 11 additions, 1 rewording; 1 source became 22. Counted and checked by script, as above. |
| L6-c | fact-checker | Opus | full check 1 | 196,408 | **Passed: all 97 items** (`456b731`), on the first full check. 164 quotes confirmed in 28 sources, all current. `Report OK`. `npm test` in the worktree: 1,702 passed. Its closest call, noted: the lesson shows one address translation and leaves out a provider's second one. |
| L6-d | author | Sonnet | 1 | 25,884 | `docs/lesson-changes/what-is-ip.md` (`396b660`): 10 corrections, 5 removals, 11 additions, 2 rewordings; 1 source became 28. Counted and checked by script, as above. |
| M2 | orchestrator | Fable | 1 | not counted | Merged into `batch/2`: What is DHCP (`34ce47a`, no conflict), What is ICMP (`054d88d`) and What is IP (`ba38c55`), the last two with the legacy list and its test reconciled to hold every move (nine lessons left, six of the tour). `npm test` 1,702 passed after each. The three worktrees removed. |
| Rule | orchestrator | Fable | 1 | not counted | The owner's decision of 2026-11-12 (direction 2.29): the fact-check stays inside each batch, and the changed sentences become one report at the end of a track. In `CLAUDE.md` and `docs/direction.md` (`698f511`). |
| Final | orchestrator | Fable | 1 | not counted | One merge into `revamp` (`4f36a0b`). On it: `npm test` 119 files, 1,702 tests passed; `npm run build` "Every page is within budget (25 pages)."; `npm run e2e` 1,191 passed, 256 skipped, none failed (17.8 minutes, lid open, exit 0). The three built pages say "Checked 12 Nov 2026" with 28, 25 and 22 sources. Merged branches left in place; nothing pushed. |

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 251,670 |
| author | Sonnet | 745,805 |
| analyst, fact-checker | Opus | 1,975,381 |
| **All subagents** | | **2,972,856** |

After the go (without the scout): 2,721,186. The plan's stop was 3.6 million for the batch and 1.5 million for one lesson; neither was reached. No designer, builder or reviewer in this job: nothing on Home rested on these lessons.

## What each lesson cost, against the estimate

The estimate was 0.75 to 1.25 million a lesson, 2.5 to 3.0 million for the three.

| | What is IP | What is DHCP | What is ICMP |
|---|---|---|---|
| Analyst: the report, the rulings and a lookup | 353,825 | 387,302 | 340,269 |
| Analyst: the read before the check | 122,178 | 91,768 | 119,228 |
| Author: the lesson and the rulings | 214,611 | 237,892 | 221,061 |
| Author: the list of changed sentences | 25,884 | 23,619 | 22,738 |
| Fact-checker | 196,408 (one full check) | 185,487 (one) | 178,916 (one) |
| **The lesson** | **912,906** | **926,068** | **882,212** |
| Items, sources | 97, 28 | 118, 25 | 118, 22 |

The three: **2,721,186**, inside the estimate, and 195,000 under batch 1's three.

- **All three passed on the first full check, and none needed a re-check.** Batch 1 had two of three. The read before the check named two tests this time, for a traced item and for a claim, and gave 11, 8 and 8 rulings; five of the 27 were traces, and the rest citations, defining markers and a few words.
- **The analysts are just over half of a lesson's cost** (1,414,570 of 2,721,186, against 1.1 to 1.4 million planned). All three had their context summarised.
- **The authors came in under their estimate again** (745,805 against 750,000 to 850,000).
- **The fact-checkers cost 560,811**, the bottom of 550,000 to 800,000, since no lesson needed a second check.

## Corrections, beside batch 1's

| Lesson | Corrections | Removals | Additions | Rewordings | Sources |
|---|---|---|---|---|---|
| What is HTTP (the old rule) | 41 | 7 | 12 | 3 | 2 became 20 |
| What is HTTPS | 16 | 12 | 21 | 2 | 2 became 41 |
| What is TCP | 11 | 3 | 17 | 2 | 1 became 22 |
| What is DNS | 3 | 8 | 7 | 5 | 2 became 29 |
| What is IP | 10 | 5 | 11 | 2 | 1 became 28 |
| What is DHCP | 4 | 3 | 12 | 2 | 1 became 25 |
| What is ICMP | 16 | 8 | 11 | 1 | 1 became 22 |

What is ICMP's 16 are mostly details of tools (ping's count, what Linux and macOS probe with, mtr) that no two publishers state, reworded or cut under direction 2.28. The lists do not count alike: one author files a reworded detail as a correction and another as a rewording.

## What the checkers passed as a simplification (decision 11)

Every note is in the lesson's list of changed sentences, in its section on what the checker passed, taken from the `Note:` lines of the three reports. The orchestrator read all of them. Most say what a general word leaves out: "64 by default" for a starting TTL, a 169.254 address a device "may" give itself, renewal at half and at seven eighths of a lease as defaults a server can change, a server that "should" hold an offered address, "20 bytes" for an IPv4 header with no options. None gives a wrong cause, number, name or order.

One is for the owner, not as a stop: **What is IP shows one address translation, at the home router, and says the routers on the way "only forward"**. Many providers run a second translation (carrier-grade NAT; RFC 4864 §2.6), and on a phone's mobile data that is the usual case. The checker called it its closest call and passed it as the home case the lesson draws. The orchestrator left it as it is. A short "unless your provider translates too" in one Go deeper would settle it, at the cost of a targeted re-check.

Also worth knowing: What is ICMP's Traceroute step shows Windows' tracert (echo-request probes, an echo reply at the end); Learn says so, and says the classic traceroute probes with UDP.

## Could go one model lower next time

- **The one report of changed sentences at the end of a track** (direction 2.29): a script for the before and after of each sentence and Haiku for the reasons, since the authors who made the changes will be gone by then.
- **Applying a list of exact rulings** stays with the continued author: 6,924 to 9,995 tokens a pass, less than a fresh agent would spend reading in.
- Nothing else. The analyst and the fact-checker are what Opus is for.

## What to do differently next time

- **Keep both named tests in the read before the check.** Batch 1 named one and a check failed on the other; batch 2 named both and none failed.
- **Have the analyst settle the badge.** The orchestrator found the second OSI source for What is DNS and for What is ICMP itself. The brief should ask for two vendors' pages that place the protocol, or a plain "none, so it spans".
- **Tell the analysts how the allowed sites answer.** `www.cisco.com` answers a plain request and refuses an invented browser name; `www.cloudflare.com` refuses a command line and reads in a browser, which only the orchestrator, the author and the fact-checker have. One analyst wrote Cisco off as unreadable until told.
- **A vendor's detail needs two publishers** (direction 2.28). Say it in the first brief, not in the rulings: it would have saved the three lookups.
- **The scratchpad is emptied overnight.** Batch 1's saved sources and the token-counting script were gone the next day. Nothing in the repo depended on them, but a batch should finish in the day it starts or keep its sources somewhere that lasts.
- **A session cannot be started while the owner is on Remote Control.** This batch ran in batch 1's session on the owner's word. A batch's first session is started in the desktop app.
- **The owner wants fewer stops and less waiting** (direction 2.29). For the next plan: batches 3 and 4 planned together with one go and one scout, run one after the other in one fresh session; a note for the owner goes in the batch's report, not in a question, unless it is one of the plan's stops; and the lists wait for the track's end.
- **Errata that came to the owner with this job:** direction 2.28 (two new hosts; What is DHCP's badge spans layers and its Overview fact "OSI layer: 7, application" is cut; no defining marker on a vendor page, so `arp -a` is cut; What is IP's step 3 reworded) and 2.29.

# Job 7: the last six tour lessons, two batches in one job (batches 3 and 4 of 5)

Planned on 2026-11-12 in a fresh session, from the brief job 6's session left; direction 2.30. What is SMTP, What is POP3 and What is IMAP, then What is FTP, What is SSH and What is TLS. The owner said go that day.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S7 | scout | Haiku | 1 | 275,677 | Done before the go. Batch 3's three lessons: sizes, documents (RFC 1939 and RFC 9051 are not registered), page cues and what the story has fetched at each, what rests on their words and shape (one line of Home's tests reads What is POP3's page cues; no end-to-end check names them), what the three share and say about each other, and the five files where three branches collide: `prototypes/s7-batch-3-facts.md`, every fact with a `path:line`. |
| S8 | scout | Haiku | 1 | 328,332 | Done before the go, beside S7. Batch 4's three lessons, in the same form, with What is TLS beside What is HTTPS idea by idea (six differences), the `uncited` exception for What is SSH, and the two tests outside a lesson's files that hold What is TLS's full name: `prototypes/s8-batch-4-facts.md`. |
| L9-a | analyst | Opus | 1, then the rulings | 411,866 | What is SMTP: 165 rows: 97 stated (and 7 Watch rows stated through a trace), 40 stay, 5 change, 1 with no source, 10 example data, 2 analogies; 11 more rows change in the log only, 32 sizes become dashes, and 11 Learn facts are added for the Watch tab to trace to. 143 quoted passages, all found by script (Cloudflare's two were read by the orchestrator in a browser). No step or event changes; step 6 gains a sentence. The report was 364,084; the rulings 47,782. Its context was summarised, so the figures are counted from its transcript. |
| L10-a | analyst | Opus | 1, then the rulings | 287,813 | What is POP3: about 94 stated, 29 stay, 4 change, 2 with no source (both the OSI layer), 18 example data, 1 analogy; four Learn facts and two widenings. 214 passages, all found. No step, event or mark changes; the second letter gains "with a picture inside" so its page cue is true. The report was 269,217; the rulings and a read of Google's page for "OAuth", 18,596. |
| L11-a | analyst | Opus | 1, then the rulings | 318,303 | What is IMAP: 142 rows: 108 stated, 12 stay, 10 change, 3 with no source, 5 example data, 2 analogies; 22 sizes become dashes and nine Learn facts are added. 115 passages, all found. No step or event changes; the page cue becomes words only. The report was 305,198; the rulings, 13,105. |
| R3 | orchestrator | Fable | 1 | not counted | The orchestrator's rulings on what the three reports left open (direction 2.31), written back into each report; it read Cloudflare's and Palo Alto's layer 7 pages in a browser for the badge. `batch/3` made from `revamp`; the registry holds the three lessons' 34 documents and two new hosts (`51be9ad`). `npm test` 119 files, 1,702 passed; `astro check` 0 errors. Three worktrees made from it, `node_modules` linked. |
| L9-b | author | Sonnet | 2 passes | 252,963 | What is SMTP in the cited shape (`ba0372d`), in its worktree: 143 items, no override, no source added; 11 changes to words and the log, 32 sizes to dashes, 21 Learn facts added (the eleven ruled, the badge's, and two of its own for traces). The six steps, 34 messages and two questions in their shape; the track's test passes with the gate set to warn. Eight doubts. Pass 2 (`04a48b7`, 14,923) applied the analyst's nine rulings; 145 items. |
| L9-p | analyst (the read before the check) | Opus | 1 | 114,283 | The same analyst, continued: 128 of 143 items sound, nine rulings for the other 15 (two Learn facts added, one widened, "home networks" to "networks", one log line, four citations added or marked). All 163 passages found. Counted from its transcript. |
| L10-b | author | Sonnet | 2 passes | 233,073 | What is POP3 in the cited shape (`069454d`): 113 items, no override, no source added; four sentences corrected, the badge spanning, both page cues where they were, sizes to dashes, four Learn facts. Three doubts. Pass 2 (`2f14229`, 8,377) applied the nine rulings. |
| L10-p | analyst (the read before the check) | Opus | 1 | 73,937 | The same analyst, continued: 102 of 113 sound, nine rulings (TOP's words, "no read or unread" cut, three Learn parts widened so Watch sentences stay as written, citations for the pattern's list). All 235 passages found. |
| L11-b | author | Sonnet | 2 passes | 202,879 | What is IMAP in the cited shape (`3f61f10`): 119 items, no override, no source added; ten changes as ruled, the badge spanning, the page cue to words, 22 sizes to dashes, nine Learn facts. Six doubts. Pass 2 (`15b7d2f`, 7,116) applied the nine rulings, one changed by the orchestrator ("within seconds" stays word for word, with a trace added). |
| L11-p | analyst (the read before the check) | Opus | 1 | 121,912 | The same analyst, continued: 110 of 119 sound, nine rulings (citations for each name in the pattern's list, traces for the version in the greeting, two Learn parts widened, "usually the inbox" trimmed to what two publishers state). All 123 passages found. Counted from its transcript. |
| L10-c | fact-checker | Opus | full check 1 | 150,100 | **Passed: all 113 items** (`c968a2c`), on the first full check. 108 quotes confirmed in 19 sources, all current. `npm run fact-check -- what-is-pop3 --check`: `Report OK`. `npm test` in the worktree: 1,702 passed. |
| L10-d | author | Sonnet | 1 | 22,249 | What is POP3's section of the track's report (`.superpowers/track-report/what-is-pop3.md`, outside git until the track's end): 5 corrections, 4 removals, 8 additions, 3 rewordings, 49 checker's notes; 1 source became 19. |
| L11-c | fact-checker | Opus | full check 1 | 160,090 | Not passed: 116 of 119 pass, 3 imprecise, none wrong (`2ceda36`, as written): the unit's full name in no Learn part; an Overview fact saying folders are kept on the server, traced to parts about read marks; a step naming "push" and polling that no Learn part states. A near-pass. 173 quotes confirmed in 17 sources. |
| L11-c | analyst, then author (fixes) | Opus, Sonnet | 1 each | 28,261 and 12,976 | The same analyst: three rulings that change no Watch word (one trace; two new Learn facts placed last so no other key moves; RFC 5550 for the word "push"), sized for a re-check of 9 items. The author applied them and registered RFC 5550 (`27c3b7a`). |
| L11-c | fact-checker | Opus | re-check 1 | 53,717 | Not passed: 8 of 9 (`5ba7921`, as written). The unit's purpose, "Email kept in sync", said more than its traced parts; the first check had flagged the same item for its full name only. The author added two traces (`38ddb20`, 2,113). |
| L11-c | fact-checker | Opus | re-check 2 | 47,413 | **Passed: all 9** (`f794799`). `--recheck --check`: `Report OK` for both files. `npm test` in the worktree: 1,702 passed. |
| L11-d | author | Sonnet | 1 | 39,422 | What is IMAP's section of the track's report: 14 corrections (the badge and the page cue among them), 3 removals, 13 additions, 2 rewordings, 88 checker's notes; 1 source became 18. |
| L9-c | fact-checker | Opus | full check 1 | 253,298 | Not passed: 142 of 145 pass, 3 imprecise, none wrong (`77e72a5`, as written): port 587 not in either cited section; the unit's full name in no Learn part; "the server lists what it can do" stated by no traced part. A near-pass. 167 quotes confirmed in 28 sources; it read Cloudflare's page in the built-in browser. It was stopped by the usage limit while writing its report and went on when the limit reset. |
| L9-c | analyst, then author (fixes) | Opus, Sonnet | 1 each | 17,362 and 10,221 | The same analyst: one citation and two new Learn facts placed last. The author applied them (`52d3b73`). |
| L9-c | fact-checker | Opus | re-check 1 | 48,702 | **Passed: all 9** (`7021c79`). `--recheck --check`: `Report OK` for both files. `npm test` in the worktree: 1,702 passed. |
| L9-d | author | Sonnet | 1 | 31,178 | What is SMTP's section of the track's report: 9 corrections, 12 removals, 19 additions, no rewording, 71 checker's notes; 1 source became 28. |
| M3 | orchestrator | Fable | 1 | not counted | Merged into `batch/3`: What is POP3 (`f8c57cc`, no conflict), What is SMTP (`e7050fd`) and What is IMAP (`bd43aa1`), the last two with the legacy list and its test reconciled to hold every move (six lessons left, three of the tour). `npm test` 1,702 passed after each. The three worktrees removed. |
| Limit | orchestrator | Fable | 1 | not counted | The owner's usage limit was reached once, with six agents running (two checkers, an author and batch 4's three analysts). Four agents stopped; each went on from where it stopped when the limit reset, and none lost work. Batch 4's analysts had written nothing to their report files by then, against their brief; they were told again to write in parts. |
| L12-a | analyst | Opus | 1, then the rulings | 300,006 | What is FTP: 116 rows: 64 stated, 28 stay, 6 change, 3 with no source, 10 example data, 1 analogy; 19 sizes become dashes, four Learn facts and two widenings. 108 passages, all found. No step, event or cue changes. The report was 286,586; the rulings (the badge back to layer 7 on a page the orchestrator read), 13,420. Stopped once by the usage limit. |
| L13-a | analyst | Opus | 1, then the rulings and a lookup | 373,551 | What is SSH: 154 rows: 93 stated, 5 stated by trace, 25 stay, 15 change, 10 example data, 1 analogy; all 25 sizes become dashes. 149 passages, all found. Every step's story has an allowed source, so nothing came to the owner. No step or event changes; one page cue goes. The report was 335,200; the rulings, 17,659; a lookup for a second publisher on Telnet's plain text (two NIST publications), 20,692. Stopped once by the usage limit; its context was summarised, so the figures are counted from its transcript. |
| L14-a | analyst | Opus | 1, then the rulings | 410,603 | What is TLS: 128 rows: 80 stated, 21 stay, 13 change, 5 example data, 1 analogy, 1 with no source, 7 event rows mixed; eight sizes become dashes, 15 Learn parts added or widened. 170 passages, all found. It read What is HTTPS whole and covers the six differences; nothing in the checked lesson is shown wrong. No step or event changes; the page cue goes. The report was 356,047; the rulings, 54,556. Stopped once by the usage limit; counted from its transcript. |
| R4 | orchestrator | Fable | 1 | not counted | The orchestrator's rulings on what the three reports left open (direction 2.32), written back into each report; it read Cloudflare's "What is SSH?" in a browser, which gave What is FTP its second vendor for layer 7. `batch/4` made from `revamp` in a worktree of its own, since the end-to-end run had the main folder; the registry holds the three lessons' 64 documents and one new host (`b01bc9d`). `astro check` 0 errors. `npm test` had 7 failures in playback tests while the end-to-end run was using the machine; the four files pass alone (69 tests), and the full run is repeated once the machine is free. Three worktrees made from it. |
| F3 | orchestrator | Fable | 1 | not counted | One merge of `batch/3` into `revamp` (`cf83742`). On it: `npm test` 119 files, 1,702 tests passed; `npm run build` "Every page is within budget (25 pages)."; `npm run e2e` 1,191 passed, 256 skipped, none failed (18.5 minutes, exit 0), run in the background while batch 4's rulings and registry were done in a worktree. The three lessons cost 1,139,873 (What is SMTP), 767,172 (What is POP3) and 987,086 (What is IMAP): 2,894,131 for the batch, against 2.8 to 3.4 million. Merged branches left in place; nothing pushed. |
| L12-b | author | Sonnet | 2 passes | 207,024 | What is FTP in the cited shape (`5d17e8a`), in its worktree: 122 items, no override; eight sentences changed as ruled, 19 sizes to dashes, six Learn facts (the four ruled, the badge's, and one of its own for the full name), RFC 959's subsections cited by page. The six steps, 20 messages, the table and the connection cues in their shape. Pass 2 (`f8c3cc9`, 15,244) applied the analyst's ten rulings and registered one document. |
| L12-p | analyst (the read before the check) | Opus | 1 | 161,935 | The same analyst, continued, with batch 3's four kinds of failure to look for by name: 105 of 122 sound, ten rulings for the other 17 (two Learn parts widened so a table row and the hook stay as written, five section names corrected to the pages' own headings, two fragments shortened, the Overview description marked an analogy, four citations for a port number). All 131 passages found. Counted from its transcript. |
| L13-b | author | Sonnet | 2 passes | 278,557 | What is SSH in the cited shape (`7a4633c`): 136 items, no override, no source added; 24 changes as ruled, the badge spanning, one page cue removed, 25 sizes to dashes, fourteen Learn facts (ten ruled, four of its own for traces), the test's last `uncited` exception gone. Eight doubts. Pass 2 (`3c31cbe`, 15,924) applied the analyst's rulings; 137 items. |
| L13-p | analyst (the read before the check) | Opus | 1 | 195,766 | The same analyst, continued: 110 of 136 sound, fifteen rulings for the other 26 (one Learn fact added and four widened, three phrases shortened to what a source states, eight citations added or moved to the section that states the thing). The orchestrator kept Telnet's port 23, cited to IANA's registry as What is TCP cites it. All 183 passages found. Counted from its transcript. |
| L14-b | author | Sonnet | 2 passes | 225,426 | What is TLS in the cited shape (`e800147`): 115 items, no override, no source added; the key exchange as What is HTTPS has it (one test's cell follows), RFC 9846, the badge spanning, the page cue removed, eight sizes to dashes, and two Learn facts of its own for the name and purpose. Pass 2 (`8317f4a`, 19,219) applied the analyst's seventeen rulings and registered one document; 120 items. |
| L14-p | analyst (the read before the check) | Opus | 1 | 163,948 | The same analyst, continued: 98 of 115 sound, seventeen rulings (five Learn facts added so Watch sentences stay as written, two narrative sentences changed, a citation removed that gave another year than its sentence, a second publisher for "VPNs" and for "SSL is its old name"). It found the lesson agrees with What is HTTPS throughout. All 209 passages found. Counted from its transcript. |
| L14-c | fact-checker | Opus | full check 1, re-check 1 | 248,545 and 32,139 | Full check: 119 of 120 pass, 1 imprecise, none wrong (`4f90d49`, as written): "From this message on, everything the server sends is already encrypted" reads as if the ServerHello itself were. 193 quotes confirmed in 34 sources. The author changed the sentence as the checker suggested (`e32e199`, 3,650). Re-check of that one item: **passed** (`f89d54e`); `--recheck --check`: `Report OK`. `npm test` in the worktree: 1,702 passed. |
| L14-d | author | Sonnet | 1 | 35,374 | What is TLS's section of the track's report: 19 corrections, 2 removals, 22 additions, 1 rewording, 82 checker's notes; 1 source became 34. |
| L12-c | fact-checker | Opus | full check 1, full check 2 | 173,185 and 223,185 | Full check 1: 121 of 122 pass, 1 imprecise, none wrong (`37019e5`, as written): "Safer: SFTP (22), FTPS (990)" gives FTPS only its implicit port, where standard FTPS starts on 21. It also noted, without failing an item, that three citations name the wrong heading of RFC 1579. The analyst ruled both (13,214) and the author applied them (`f848241`, 4,150); the heading fix put 23 items on a re-check sheet, over the 12 allowed, so the second check was a full one. Full check 2: **passed, all 122** (`e9fb438`), 163 quotes in 28 sources. `npm test` in the worktree: 1,702 passed. |
| L12-d | author | Sonnet | 1 | 41,392 | What is FTP's section of the track's report: 9 corrections, 1 removal, 9 additions, no rewording, 58 checker's notes; 1 source became 28. |
| L13-c | fact-checker | Opus | full check 1, re-check 1 | 236,327 and 64,979 | Full check: 135 of 137 pass, 2 imprecise, none wrong (`f0ff8f2`, as written): the badge that spans layers, when Cloudflare's page, which the lesson cites, says most sources call SSH layer 7; and a sentence that says the integrity check is built into both ciphers it names, when the sources state it of AES-GCM only. 212 quotes in 31 sources. The analyst looked for a second vendor for layer 7 on every allowed host and found none (40,297); the orchestrator read a community tutorial page in a browser and allowed its host. The author applied both fixes (`50c6ead`, 8,116). Re-check of the two items: **passed** (`96b886e`); `Report OK` for both files. `npm test` in the worktree: 1,702 passed. |
| L13-d | author | Sonnet | 1 | 28,997 | What is SSH's section of the track's report: 19 corrections, 3 removals, 17 additions, 6 rewordings, 73 checker's notes; 2 sources became 32 with the badge's second page. |
| M4 | orchestrator | Fable | 1 | not counted | Merged into `batch/4`: What is TLS (`c1461eb`, no conflict), What is FTP (`9abb179`) and What is SSH (`8b7d504`), the last two with the legacy list's test, the registry and its test reconciled (the legacy list now holds only Networking's three). One slip of the orchestrator's own: its first reconciliation of the registry joined two new entries into one object, the tests refused it at once (an unknown source), and `b64e0ed` separates them. `npm test` 1,702 passed after each merge as corrected. The three worktrees removed. |
| T1 | orchestrator | Fable | 1 | not counted | `docs/lesson-changes/how-the-internet-works-lessons-9-to-14.md`: the six authors' sections joined under one opening. A script found every quoted before in each lesson's file at `b18acd9` and every after in the file as it passed: 200 table rows, 7 cells that are the authors' descriptions and not quotes, read by hand. The orchestrator read the checkers' notes on what they passed (about 420). |
| F4 | orchestrator | Fable | 1 | not counted | One merge of `batch/4` into `revamp` (`062176c`). On it: `npm test` 119 files, 1,702 tests passed; `npm run build` "Every page is within budget (25 pages)."; `npm run e2e` 1,191 passed, 256 skipped, none failed (18.3 minutes, exit 0). The six built pages say "Checked 12 Nov 2026" with 28, 19, 18, 28, 32 and 34 sources, and About says 15 of 18 lessons have been through an independent check. The report, the ledger and the direction doc followed in a second merge of documents only. Merged branches left in place; nothing pushed. |

## Spend by role

| Role | Model | Tokens |
|---|---|---|
| scout | Haiku | 604,009 |
| author | Sonnet | 1,639,760 |
| analyst, fact-checker | Opus | 4,724,737 |
| **All subagents** | | **6,968,506** |

After the go (without the two scouts): 6,364,497, against 5.5 to 6.7 million planned. The plan's stops were 1.6 million for one lesson without an all-pass and 4.0 million for a batch; neither was reached. No designer, builder or reviewer in this job: Home needed no unit.

## What each lesson cost, against the estimate

The estimate was 0.85 to 1.25 million a lesson, 2.8 to 3.4 million for batch 3 and 2.7 to 3.3 million for batch 4.

| | What is SMTP | What is POP3 | What is IMAP | What is FTP | What is SSH | What is TLS |
|---|---|---|---|---|---|---|
| Analyst: the report, the rulings, a lookup | 411,866 | 287,813 | 318,303 | 300,006 | 373,551 | 410,603 |
| Analyst: the read before the check | 114,283 | 73,937 | 121,912 | 161,935 | 195,766 | 163,948 |
| Analyst: words for held-back items | 17,362 | none | 28,261 | 13,214 | 40,297 | none |
| Author: the lesson, the rulings, the fixes | 263,184 | 233,073 | 217,968 | 211,174 | 286,673 | 229,076 |
| Author: its section of the report | 31,178 | 22,249 | 39,422 | 41,392 | 28,997 | 35,374 |
| Fact-checker | 302,000 (a full check, a re-check) | 150,100 (one full check) | 261,220 (a full check, two re-checks) | 396,370 (two full checks) | 301,306 (a full check, a re-check) | 280,684 (a full check, a re-check) |
| **The lesson** | **1,139,873** | **767,172** | **987,086** | **1,124,091** | **1,226,590** | **1,119,685** |
| Items, sources | 147, 28 | 113, 19 | 121, 18 | 122, 28 | 137, 32 | 120, 34 |

Batch 3: **2,894,131**, inside its estimate. Batch 4: **3,470,366**, about 170,000 over its estimate and under its stop.

- **One of six passed on the first full check** (What is POP3); batch 2 had three of three. The other five were near-passes, one to three items each, none wrong. Four of the five passed on a targeted re-check; What is IMAP needed a second re-check and What is FTP a second full check.
- **Batch 3's five held-back items were of one kind:** a Watch part or an Overview fact that says something small its traced Learn parts do not (a protocol's full name, a purpose line, "push", "lists what it can do"), and once a port number that is in the document but not in the cited section. Batch 4's reads were told to look for those kinds by name, cost 160,000 to 200,000 where batch 3's cost 74,000 to 122,000, and gave 17, 26 and 17 rulings; none of batch 4's first checks failed on those kinds.
- **Batch 4's four held-back items were of substance**, where batch 3's were bookkeeping: FTPS's port, a sentence that read as if the ServerHello were encrypted, a claim made of two ciphers and sourced for one, and the badge the orchestrator had ruled to span.
- **The analysts are just under half of a lesson's cost** (3,033,057 of 6,364,497), as in batch 2. Every analyst's context was summarised at least once.
- **The authors' sections cost 198,612 for six**, where batches 1 and 2 spent about 24,000 a list. They are longer: each carries every note of its lesson's checks.

## Corrections, beside the earlier batches'

| Lesson | Corrections | Removals | Additions | Rewordings | Sources |
|---|---|---|---|---|---|
| What is HTTP (the old rule) | 41 | 7 | 12 | 3 | 2 became 20 |
| Batch 1: What is HTTPS, What is TCP, What is DNS | 16, 11, 3 | 12, 3, 8 | 21, 17, 7 | 2, 2, 5 | to 41, 22, 29 |
| Batch 2: What is IP, What is DHCP, What is ICMP | 10, 4, 16 | 5, 3, 8 | 11, 12, 11 | 2, 2, 1 | to 28, 25, 22 |
| What is SMTP | 9 | 12 | 19 | 0 | 1 became 28 |
| What is POP3 | 5 | 4 | 8 | 3 | 1 became 19 |
| What is IMAP | 14 | 3 | 13 | 2 | 1 became 18 |
| What is FTP | 9 | 1 | 9 | 0 | 1 became 28 |
| What is SSH | 19 | 3 | 17 | 6 | 2 became 32 |
| What is TLS | 19 | 2 | 22 | 1 | 1 became 34 |

The lists do not count alike (one author files a widened Learn part as an addition, another as a rewording; "Removals" counts a lesson's message sizes as one row or as several). What is SSH's and What is TLS's 19 are mostly absolutes with no source ("most servers", "most apps", "43 characters") and, in What is TLS, the key exchange made to agree with What is HTTPS.

## What the checkers passed as a simplification

Every note is in the track's report, under each lesson's "What the checker passed as a simplification" (71, 49, 88, 58, 73 and 82 notes). The orchestrator read them. Each says what a general word leaves out: an optional command, a rarer mode, an exception a standard allows, a second address family. None gives a wrong cause, number, name or order.

For the owner, none as a stop (they are in the report's opening, "For the owner to know"): What is SSH shows the key exchange OpenSSH 9.9 chose first, and names the newer one in a Go deeper; "passwords included" went from the Telnet sentence for want of a current source; the shared-secret explanation in What is SSH and What is TLS describes the X25519 half of a hybrid exchange; "SSL is its old name" stays in What is TLS's full name.

## Could go one model lower next time

- **The fix after a near-pass, when the checker names it.** Twice the fix was a trace or a few words the checker's own note gave (What is IMAP's second fix, What is TLS's sentence): the orchestrator sent them straight to the author, with no analyst, and both passed.
- **Nothing else.** The reads before the check found 17 to 26 faults a lesson in batch 4, and the four items the checks still held back were ones no read had seen.

## What to do differently next time

- **Give the read before the check the list of what earlier checks failed on, from the first batch of a job.** `.superpowers/briefs/analyst-read-before-check.md` has it now; it should be in the repo beside the agents' instructions.
- **Tell an author, in its first brief, to state the unit's full name and its purpose in a Learn part.** Two of batch 3's first checks failed on it; batch 4's authors were told and none did.
- **A page the lesson cites can overrule a badge that spans.** The orchestrator ruled What is SSH's badge to span on a page that says "not strictly defined, but most sources describe it as layer 7"; the checker read the second half. Read the whole passage as a checker would before ruling.
- **Check a citation's section name against the page's own heading before the first check.** A wrong heading that the checker only notes still has to be fixed, and the fix cost What is FTP a second full check (23 items is over a re-check's 12).
- **The briefs kept outside the repo should be in it.** Seven files in `.superpowers/briefs/` and three scripts in `.superpowers/tools/` (token counts from a transcript, registry entries from a report, the check of the track's report) carried this job; the next session will not find them unless it is told. Moving them into the repo is a small unit of its own.
- **Keep the batch's branch in a worktree of its own.** It let batch 3's end-to-end run and batch 4's registry go on together. The full unit suite failed seven playback tests while the end-to-end run had the machine; it passes alone.
- **Reconcile a merge by reading the conflict first.** The orchestrator's first script for the registry joined the two sides blindly and made one entry of two; printing the conflict before resolving it, as it did for the next merge, costs a few lines.
- **Six agents at once reached the owner's usage limit** an hour and a half into batch 3's checks. Nothing was lost, since each agent goes on from its transcript, but agents that had not yet written their report files would have lost that work in a crash: the brief now says to write in parts.
- **`src/content/legacy.ts` still says in a comment that the tour's fourteen lessons keep their uncited words until their audit.** All fourteen have moved; the comment is for the job that moves Networking's three.
- **Errata that came to the owner with this job:** direction 2.31 and 2.32 (five new hosts; three page cues changed or removed; which badges show a layer and which span; What is TLS made to agree with What is HTTPS; the Telnet sentence; What is POP3's second letter given a picture), and the three corrections the checks themselves made, which open the track's report.

# Job 8: Networking's DHCP, Subnetting and Firewalls (batch 5 of 5)

Planned on 2026-11-12 in a fresh session, the first run by Opus 5.5 as orchestrator; direction 2.34, `plan.md`. Token figures are "growth" (the context an agent reached) and "read in all" (its context summed over every request), both from `scripts/team/tokens.py`.

| Unit | Agent | Model | Tries | Growth | Read in all | Result |
|---|---|---|---|---|---|---|
| S9 | scout | Haiku | 1 | 350,290 | 17,258,925 | Done before the go: `prototypes/s9-batch-5-facts.md`. Sizes, documents (RFC 950, RFC 3021, RFC 5737 and NIST SP 800-41 not registered), DHCP's four differences from What is DHCP, pointers to unwritten lessons, three tests that use `dhcp` as the legacy sample, About reading DHCP's references. |
| L15-a | analyst | Opus | 1 | 268,376 | 13,126,622 | DHCP: 76 stated, 27 stay, 10 change, 2 no source, 8 example, 1 analogy; 87 passages found. No new document. Badge spans; sizes dashes, so the packets go. |
| L16-a | analyst | Opus | 1 | 254,927 | 9,784,029 | Subnetting: 192 rows (140 stated, 17 stay, 14 change, 4 no source); 91 passages found; of 70 `STATED` numbers 42 facts, 27 worked examples. Eight new documents. Badge 3. |
| L17-a | analyst | Opus | 1 | 287,102 | 18,063,824 | Firewalls: 146 rows (102 stated, 17 stay, 17 change, 1 no source); 85 passages found. Nineteen new documents and one host. Badge 3 and 4. |
| R5 | orchestrator | Opus 5.5 | 1 | not counted | not counted | Rulings written into each report (direction 2.35); Cloudflare's firewall and subnet pages read in a browser. `batch/5` in its own worktree: the legacy-sample tests take a stand-in (`1164cbe`); 28 documents and one host registered (`a213b80`). `npm test`: 1,704 passed. |
| L15-b | author | Sonnet | 2 passes and the section | 244,943 | 7,881,194 | DHCP in the cited shape (`ef77bbe`, rulings `14d6bf3`): 92 items, no override, no source added; packets and `helpers/packets.ts` removed, sizes to dashes, both pointers cut. Section: 8 corrections, 6 removals, 11 additions, 2 rewordings, 57 notes. |
| L15-p | analyst (continued) | Opus | 1 | 44,988 | 3,159,451 | 71 of 92 sound; 11 rulings (five traces, "Gateway: 192.168.1.1 (the router)", three Learn parts widened, home-router citations, RFC 894 defining). |
| L15-c | fact-checker | Opus | full check 1 | 181,821 | 4,624,370 | **Passed: all 92 items** (`bd69372`). 177 quotes in 16 sources. `--check`: `Report OK`. `npm test` in the worktree: 1,630 passed (the packets helper's 74 tests went with it). Lesson: 740,128 growth. |
| M5 | orchestrator | Opus 5.5 | 1 of 3 | not counted | not counted | DHCP into `batch/5` (fast-forward, `bd69372`); `npm test` 1,630 passed. |
| L16-b | author | Sonnet | 2 passes and the section | 287,702 | 10,619,145 | Subnetting in the cited shape (`ce85939`, rulings `7a55810`): 107 items, no override, no source added; pointers cut, the cable claim cut, masks in Learn, `STATED` in step. Section: 13 corrections, 4 removals, 16 additions, 16 notes. |
| L16-p | analyst (continued) | Opus | 1 | 78,712 | 5,043,776 | 68 of 107 sound; 17 rulings (23 missing traces, defining markers dropped from address claims, second publishers, `term-mask` widened, RFC 950 cited by page). |
| L16-c | fact-checker | Opus | full check 1 | 188,796 | 5,036,029 | **Passed: all 107 items** (`54bff5f`). 172 quotes in 17 sources; badge 3 passed. `--check`: `Report OK`. `npm test` in the worktree: 1,704 passed. Lesson: 810,137 growth. |
| M5 | orchestrator | Opus 5.5 | 2 of 3 | not counted | not counted | Subnetting into `batch/5` (`bd47046`), the legacy list's conflict printed and resolved to `['firewalls']`; `npm test` 1,630 passed. |
| L17-b | author | Sonnet | 2 passes, a fix and the section | 256,697 | 9,704,952 | Firewalls in the cited shape (`71bf492`, rulings `0e64339`, fix `99d575b`): 106 items, no override, no source added; pointers to plain words, product names with one publisher cut, `why-1` and question 2 reworded, three Learn facts. Section: 12 corrections, 2 removals, 6 additions, 4 rewordings, 44 notes. |
| L17-p | analyst (fresh, the trial) | Opus | 1 | 197,192 | 7,448,505 | 96 of 105 sound; 8 rulings (traces for the scene, hook and two steps; one Learn fact; second publishers for three parts). The orchestrator added one trace (`fact-order` on the connections rows). |
| L17-c | fact-checker | Opus | full check 1, re-check 1 | 187,663 and 41,627 | 7,232,973 and 398,715 | Full check: 105 of 106, 1 imprecise, none wrong (`bd55164`, as written): "in real life the visit reaches it through NAT" rested on NIST alone. The author added RFC 3022 §2.2, words unchanged (`99d575b`). Re-check: **passed, the one item** (`a22ceec`). `--recheck --check`: `Report OK` for both files; `npm test` 1,704 passed. Lesson: 970,281 growth. |
| M5 | orchestrator | Opus 5.5 | 3 of 3 | not counted | not counted | Firewalls into `batch/5` (`fc5647c`), the conflict printed and resolved to an empty list; the list's comment, its test (now `[]`) and content-model §4 (`45382d3`). `npm test` 1,626 passed, 4 skipped (the legacy-sample cases, by design). |
| T2 | orchestrator | Opus 5.5 | 1 | not counted | not counted | `docs/lesson-changes/networking-dhcp-subnetting-firewalls.md`: the three sections joined under one opening; the script found every quoted cell in the two versions but four, each read by hand (a description, two values built in code, a sentence now split in two). |
| F5 | orchestrator | Opus 5.5 | 2 full runs | not counted | not counted | `npm test` 1,626 passed, 4 skipped; `npm run build` within budget. First full `npm run e2e` on `revamp`: 1,169 passed, 16 failed, all from specs holding batch 5's old words or shape (Home's "So far N of M" sentence, DHCP's log sizes on the phone, the tablet test reading DHCP's badge chips). Specs fixed (`911efba`); the 16 re-run passed, all of `tablet.spec.ts` 58 passed. Second full run on `revamp` (`911efba`): **1,185 passed, none failed**, 262 skipped (19.2 minutes). About at 375 and 1440: DHCP's 16 sources, no sideways scroll, but two short names ("Cisco DHCP troubleshooting", "Microsoft DHCP troubleshooting") overflow their column into the title at both widths: a design unit for the owner (decision 9). |

**Totals** (growth / read in all): analysts 1,131,297 / 56,626,207; authors 789,342 / 28,205,291; fact-checkers 599,907 / 17,292,087; scout 350,290 / 17,258,925. Subagents 2,870,836 / 119,382,510: DHCP 740,128, Subnetting 810,137, Firewalls 970,281, inside the 2.7 to 3.6 million estimate and under the 4.0 million stop. The orchestrator: 365,733 / about 40 million in one session (job 7: 734,000 / 114 million over two batches). Job 7 read about 307 million for six lessons; this job read about 120 million for three, 40 million a lesson against 51.

**The trial** (§6a item 1). The read before the check by a fresh analyst (Firewalls) read 7.45 million in all; the continued analysts read 3.16 million (DHCP) and 5.04 million (Subnetting). Both continued lessons passed their first full check; the fresh one's near-passed on one item resting on one publisher, a kind of hole the read exists to catch. A fresh analyst had to read the report, the rulings and the sources in again and found fewer holes for more tokens. Keep the continued analyst for the read.

**Could go one model lower next time.** Nothing that ran: the scout is already Haiku, authors Sonnet; analysts and fact-checkers carry the accuracy rule. The joined report (T2) is mechanical once the sections exist and could be a scout's.

**What to do differently next time**

- The scout lists every test and every end-to-end spec that holds a lesson's words, shape, badge or sizes, not only the unit tests. Three tests used `dhcp` as the legacy sample and three e2e specs held its sizes, badge or the checked count; all were found late.
- Keep the continued analyst for the read before the check (the trial above).
- The orchestrator writing the rulings straight into each report (R5) worked and cost less than a second analyst pass.
- Before the full e2e, run the specs that name the batch's lessons (`grep -l <slug> e2e/`) in the worktree: one 19-minute run would have been enough.
- A Learn part sourced from two publishers needs both found by the analyst; the one near-pass was a second publisher missing.

# Job 9: the Practice page (Phase 5), and the legacy path removed

Planned on 2026-11-12 in a fresh session; direction 2.37, `plan.md`. The plan and the design run on Fable 5.2 by the owner's word for this job ("Have Fable 5.2 design and plan out our practice page"); every other unit keeps its usual model. The session's first minutes, the reading in and the scout's brief, ran on Opus 5.5 before it was switched. Token figures are "growth" and "read in all", from `scripts/team/tokens.py`. The designer's spend is counted apart.

| Unit | Agent | Model | Tries | Growth | Read in all | Result |
|---|---|---|---|---|---|---|
| S10 | scout | Haiku | 1 | 246,512 | 9,563,194 | Done before the go: `prototypes/s10-job-9-facts.md`, saved by the orchestrator from the scout's reply (the scout does not write files). 40 questions in 18 lessons; §6.6 word for word; four places that promise nothing is saved; the legacy lift is what 27 test files build fixtures with; "Not checked yet" still shows in `astro dev`. |
| Plan | orchestrator | Fable 5.2 | 1 | not counted | not counted | `plan.md`: fifteen decisions, two design units (D6, D7), four build units (B7 to B10). The owner said "Go" on 2026-11-12 (`946d186`). |
| D6 | designer | Fable 5.2 | 1 | 286,210 | counted with D7 | `prototypes/d6-practice-page.html` and `.md`: two views, "All questions" (a row a lesson, opening to its questions) and "To try again" (the kept questions as cards). Variant A, rows folded (recommended), and B, all open. All 40 questions printed from the registry. 35 acceptance checks, 9 open questions. The orchestrator looked at 375 and 1440 in both themes: no sideways scroll, no target under 44px, the stored value keys only. |
| D7 | designer (continued) | Fable 5.2 | 1 | 410,922 for both | 16,612,763 for both | `prototypes/d7-practice-site.html` and `.md`: the header's fifth link and the menu from 960px down, the footer, the lesson's Practice part (its line, the kept line), About's card, two table rows and the reset's words. Every sentence about scoring or saving listed with "stays" or its new words. 7 open questions. Looked at by the orchestrator at 375 and 1440. |
| Gate | orchestrator | Fable 5.2 | | | | D6 and D7 shown to the owner on 2026-11-13. Nothing is built until the owner approves them. Screenshots are in `.superpowers/revamp/job-9/shots/`, on this machine only. |
| Re-plan | orchestrator | Fable 5.2 | 1 | not counted | not counted | The owner at the gate (2026-11-13): "Let's turn the practice page into a simple glossary. This page will contain concept terms used in the Tracks." D6 and D7 not approved, set aside. New `plan.md` (direction 2.38): the page shows Learn's 152 terms in the lessons' own words; D8 the design, A1 an analyst's read of the terms out of their lessons, B7 as before, B8 the page. The owner said "Go" on 2026-11-13 (`a9199bd`). |
| A1 | analyst | Opus | 1 | 33,243 | 134,432 | `docs/glossary-read.md` (saved by the orchestrator from the analyst's file; the analyst writes none in the repo): all 152 terms read as the page will show them. 120 fine, 32 lean on their lesson, **none misleads**. TTL is two things under one name (DNS against IP and ICMP), which D8 must show; the other shared names agree. |
| D8 | designer | Fable 5.2 | 1 | 329,846 | 11,808,528 | `prototypes/d8-glossary.html` and `.md`: one design. 135 entries from 152 terms, A to Z under letter keys; each entry is the name on label tape, then "In the DNS lesson" (the link to that lesson's Learn) and the lesson's idea, one block a wording. A ledger of three columns from 960px, two columns of stacked entries from 640px, one below. No script, no marks, no count. "Glossary" second in the header; the menu from 960px down (914px needed). The orchestrator looked at 375 and 1440 in both themes: no sideways scroll, 135 entries and 152 lesson links, keys 44px, a lesson line's target 44px. 5 open questions. |
| Gate | orchestrator | Fable 5.2 | | | | D8 and A1's list shown to the owner on 2026-11-13. Nothing is built until the owner approves D8. |
| Gate | the owner | | | | | 2026-11-13: D8 **not approved**. "Going over these glossary terms I feel like we need to make major adjustments to terms" (Ping, IP address), then "Yes, replan the glossary and also if these are the definitions used in the lessons we need to revisit well". |
| S11 | scout | Haiku | 1 | 232,919 | 8,281,630 | `prototypes/s11-glossary-facts.md`, saved by the orchestrator from the scout's file: the fact-check tooling takes a lesson only and refuses a report with no lesson; the glossary's slot is coded and empty, with no senses, no limit and no tie to a lesson's term; the lessons mark 110 words beyond Learn's 135 names; the pilot's sources are mostly registered; the first direction document's §6.5 already asked for cited definitions shared with the lessons. |
| Re-plan 2 | orchestrator | Fable 5.2 | 1 | not counted | not counted | New `plan.md` (direction 2.39): written definitions through a fact-check path built first, checked in groups; a pilot of ten entries (ICMP's terms and IP address); the list of terms and the pilot's entries come to the owner; D9 designs the page and a term's definition in Learn on real entries. The owner said "Go" on 2026-11-13 (`ad4f8a6`). The plan-and-design session stops here until D9; the path, the pilot and the build run in a session on Opus 5.5. |
| Start | orchestrator | Opus 5.5 | | not counted | not counted | 2026-11-13: the path, the pilot and the build, in a session of their own (started by the plan-and-design session). |
| B7 spec | reviewer | Opus | 1 | 69,733 | 635,773 | HOLES: 8, each with one right answer, closed as errata E1 to E8 in `plan.md` with 32 attack cases (the grep check's filter; a test-only validator; what counts as checked; the e2e truth for "Checked"). |
| G1 | analyst | Opus | 1 | 98,192 | 1,036,407 | `docs/glossary-terms.md`: all 245 candidates. 113 entries (21 borderline), 5 words with two senses, 25 spellings, 102 left in their lessons; 103 entries after the pilot, about 9 groups, roughly 2.3 to 2.9 million. Open: the protocols the lessons are named for have no entry. **Comes to the owner.** |
| B9 spec | orchestrator, then reviewer | Opus 5.5, Opus | 1 | 146,738 (reviewer) | 2,049,728 (reviewer) | `docs/glossary-path-spec.md` written by the orchestrator from S11. HOLES: 14, closed as errata E1 to E14 in its §10, attack cases under B9 in `plan.md`. Three were canary words a right checker would have failed (RFC 2131's Abstract quoted as §1; a name no statement gave); the canary now ties to its own frozen lesson. |
| P1-a | analyst | Opus | 1 | 176,875 | 7,983,815 | `.superpowers/analysis/glossary-pilot/report.md`: ten entries, 86 passages found by script (Cisco and Cloudflare refuse scripts). Ping has no sourced full name; Latency is not round-trip time; an IP address belongs to a connection and is unique within its network; Packet loss needs `rfc-7680`. 15 lesson lines: 4 thin, none at odds. |
| P1-r | orchestrator | Opus 5.5 | 1 | not counted | not counted | Twelve rulings in the report's §7 and direction 2.40. |
| B7 | builder | Sonnet | 1, and the fixes | 188,462 | 10,879,433 | The legacy path removed (`b95d8ca`): `legacy.ts`, `helpers/tour.ts`, `origin`, the legacy-only and vacuous tests (each named), a test-only validator in the fixtures. `npm test` 1,615 passed, 0 skipped; `astro check` clean; build passes; `site.spec.ts` and `lesson.spec.ts` pass on 4481 (141 skips, all project-scoped in `lesson.spec.ts` as on `revamp`). |
| B7 review | reviewer | Opus | 1 | 115,300 | 3,373,170 | PASS WITH FIXES: README's legacy lines, `markDefined` still exported. Both fixed by the builder (`5206c35`); the orchestrator ran both "fixed when" checks. |
| B9 | builder | Sonnet | 1, and the fixes | 331,837 | 18,052,658 | The path for glossary groups (`03382f6`): group files in `src/content/glossary-groups/`, `npm run fact-check -- glossary/<id>`, reports in `docs/fact-checks/glossary/`, keys by id, names, label and tie items, the whole-entry re-check, the canary group, the refusal kept for objective mappings only, content-model §6 and §8, the agents' sections and two briefs. 1,736 tests pass, lessons' hashes and all 24 lesson reports unchanged; 22 mutations red. |
| B9 review | reviewer | Opus | 1 | 155,787 | 3,543,196 | PASS WITH FIXES: five (an "empty glossary" test the first group breaks; the wiring test tied to test mode; the author's done line, erratum E15; the tie check untested; three rules missing from author.md). All fixed (`efeb8b5`); the orchestrator ran the checks for fixes 2, 4 and 5. |
| Canary, try 1 | fact-checker | Opus | 1 | 68,726 | 892,215 | Not a glossary check: the agent's instructions are read from the main folder, which did not yet have B9's group section, so it checked the lesson canary (all five faults flagged, as recorded). Its report was put back as committed. **Lesson:** a change to an agent's instructions is live only once it is in the main folder; B9 was merged before its canary check for that reason. |
| Canary, try 2 | fact-checker | Opus | 1 | 68,441 | 970,236 | The same again after B9 was merged: the agent definitions are loaded when the session starts, so this session's fact-checker still had no group section and ran `npm run fact-check -- fact-check-canary` (the lesson canary; five faults flagged). Report put back. From here the glossary checks run as a general-purpose Opus agent told only to follow `.claude/agents/fact-checker.md` from disk, then the group and the folder. |
| P1-b | author | Sonnet | 1 | 138,618 | 2,172,474 | `src/content/glossary-groups/pilot.ts` (`3da0634` on `glossary/pilot`): ten entries, eleven definitions of 33 to 55 words, 15 ties. Sheet prints; `astro check` clean; dev-mode vitest fails only the canary's report test. Design session told (D9). |
| Canary, try 3 | general-purpose, as fact-checker | Opus | 1 | 90,395 | 1,163,321 | `docs/fact-checks/canary/glossary-fact-check-canary.md` (`cdb154f`): 17 items, every planted fault flagged (4 ❌, 1 ⚠️, `rfc-2616` not current), every correct item ✅; quotes OK. B9 done: `npm test` 1,737 passed, `npm run build` passes, on `revamp`. |
| P1-p | analyst (continued) | Opus | 1 | 231,029 with P1-a | 11,105,016 with P1-a | The read before the check: 48 items read, 36 pass as written, twelve rulings (report §8; "normally" for routers that answer traceroute, Latency's one-way statement rewritten, IPv6's Hop Limit as "the field that does this job"). The author applied them (`fbbdc88`), with a non-Cisco pair for traceroute's rising TTL. |
| P1-c | general-purpose, as fact-checker | Opus | 1 | 187,497 | 6,679,450 | `docs/fact-checks/glossary/pilot.md`: **all 48 items pass on the first full check** (25 claims, 10 names, 2 labels, 11 ties); 71 quotes in 16 sources; Cisco read in the browser. Two B9 tests had used the id `pilot` as a fixture and broke once the real report existed; fixed by the B9 builder (`77bca1d`). Merged (`1e14b05`): `npm test` 1,737 passed, `Report OK`, build passes. |
| D9 | designer | Fable 5.2 | 1 | 349,848 | 14,901,962 | `prototypes/d9-glossary.html` and `.md`, made in the design session on the ten entries as merged and passed. The page: A to Z under D8's keys; an entry is the name on label tape, its definition, a "Sources" line of short names linked to the exact place, and "Taught in"; a term with two meanings has a definition under each label; one stamp, "10 terms checked, the latest on 13 Nov 2026". The lesson: variant B (recommended), a term's name is a button that opens its definition under the row (Learn 2,201px to 2,272px at 375 while closed); variant A, always open (4,008px). 38 acceptance checks, 8 open questions. The orchestrator of that session looked at 375 and 1440 in both themes: no sideways scroll on either screen. |
| Gate | orchestrator | Fable 5.2 | | | | D9, the ten checked entries, G1's list with its cost and the lesson question shown to the owner on 2026-11-13. B8 waits for the owner's approval of D9. **Approved** ("Approve D9", 2026-11-13): variant B in the lesson, the spec's section 17 answers as the designer gave them. |
| Start | orchestrator | Opus 5.5 | | not counted | not counted | 2026-11-13: B8 and F9, in a session of their own (started by the design session). |
| B8 spec | reviewer | Opus | 1 | 238,542 | 8,899,539 | HOLES: 11, each with one right answer, closed as errata E1 to E11 in `plan.md`; attack cases in `prototypes/d9-cases.md` (`c8dabfd`). Worst: a lesson without JavaScript serves only its Overview, so no definition can be in its HTML; the end-to-end specs cannot load the glossary, so its data checks run in a container render. |
| B8 | builder | Sonnet | 1, and the fixes | 306,421 | 20,234,469 | The Glossary page and a term's definition in Learn, variant B (`62a9115`, fixes `5db5b5b`): `src/pages/glossary.astro`, `src/lib/glossary.ts` (one pure function), `glossaryCheckedOn`, the header's Glossary link and the menu at 959px, the definitions through the lesson page to `Explanation.tsx`, `e2e/glossary.spec.ts`. `npm test` 1,819 passed; build passes; its e2e specs pass on 4481. The orchestrator looked at 375 and 1440 in both themes beside the prototype: they match. |
| B8 review | reviewer | Opus | 1 | 170,902 | 5,651,616 | PASS WITH FIXES, no blockers: a pointer spelling "Letter …" hung the id loop; four tests that could not fail (the landing's sticky foot at 375, the 44px target probe, the stamp's date, a tie to `dhcp` alone). All fixed; the orchestrator ran each "fixed when" check: each test red with its rule broken, green restored. |
| G1, the owner's answer | the owner | | | | | 2026-11-13: "All 113". The list is approved whole, borderline entries included (direction 2.42). The 103 remaining entries are job 10. |
| F9 | orchestrator | Opus 5.5 | 1 | not counted | not counted | B8 merged into `revamp` (`dabf636`), worktree removed. On `revamp`: `npm test` "Test Files 130 passed (130) / Tests 1819 passed (1819)"; `npm run build` "Every page is within budget (26 pages)."; the full `npm run e2e` "384 skipped / 1274 passed (18.3m)", exit 0 (log `.superpowers/revamp/job-9/f9-e2e.log`, on this machine only). |
| Owner | the owner | | | | | 2026-11-13, after F9: "The glossary should be a separate page independent of Tracks and Lessons…" Asked: Learn keeps its definitions without the link; "Build from my words" (direction 2.43). |
| D9a | designer | Opus 5.5 | 1 | 178,170 | 5,854,403 | `prototypes/d9a-glossary-independent.md`, drawn in `d9-glossary.html` (`02bc5bb`): "Described in" and the track titles as plain text in Tracks order; the note's new words; Learn's definition ends at Sources. |
| B8a spec | reviewer | Opus | 1 | 150,411 | 2,645,849 | HOLES: 8, each with one right answer, closed as errata (`plan.md`, `834b764`); cases `prototypes/d9a-cases.md`. |
| B8a | builder | Sonnet | 1, and the fix | 180,447 | 8,559,957 | `5f39c01`, fix `be5202c`: the lesson links and the glossary link gone, "Described in" with track titles. `npm test` 1,828 passed; build passes; its e2e specs pass on 4481. The orchestrator looked at 1440 dark and 375 light beside D9a: they match. |
| B8a review | reviewer | Opus | 1 | 103,679 | 2,795,531 | PASS WITH FIXES, one fix: E3's shape test ran on the fixture only. Fixed; the orchestrator ran the "fixed when" check (red with a `href` added, green without). |
| F9 again | orchestrator | Opus 5.5 | 1 | not counted | not counted | B8a merged (`02fe3f1`), worktree removed. On `revamp`: `npm test` "Test Files 130 passed (130) / Tests 1828 passed (1828)"; `npm run build` "Every page is within budget (26 pages)."; the full `npm run e2e` "400 skipped / 1282 passed (18.7m)", exit 0 (log `.superpowers/revamp/job-9/f9b-e2e.log`). D9a and B8a cost 612,707 growth, 19,855,740 read in all. |

**What the pilot cost.** An entry: the analyst, the author and the check of the pilot came to 568,392 tokens of growth (20,978,641 read in all) for ten entries and 48 checked items: **about 57,000 an entry, 11,800 a checked item**, at 4.8 items an entry (the plan guessed 3 items and 7,400 to 9,400 an item). At that rate G1's 103 further entries would be about 5.9 million, 82 without the borderline ones about 4.7 million; groups of a dozen may share some reading. **The job so far** (after the go, this session): 1,906,090 growth, 65,248,433 read in all, by role: analyst 329,221; reviewer 487,558; builder 524,386; author 149,866; fact-checker and canary 414,059 (three canary runs, two misdirected). Under the 4.5 million stop. **B8** (spec review, build with fixes, build review): 715,865 growth, 34,785,624 read in all. **The job after the go:** 2,621,955 growth, 100,034,057 read in all; reviewer 897,002, builder 830,807; the plan's estimate was 2.7 to 3.8 million.

**What to do differently next time.** (1) Agents are loaded when a session starts: a unit that changes `.claude/agents/` is live only in a later session, so run its first check by having a general-purpose agent read the file, or start the checks in a fresh session (two canary runs, 137,167 tokens, went to the lesson canary for this). (2) A test fixture must never take an id a real group or lesson may take. (3) The analyst's read before the check found twelve things; the check then found none: keep it. (4) A spec review is worth its cost on a screen: B8's found that a lesson without JavaScript never renders Learn and that the end-to-end specs cannot load the glossary, two checks no build could have passed. (5) Four of B8's tests could not fail; the build review found them by breaking the rule each guards. Ask the builder to list, for every test it adds, the one-line break that turns it red. (6) One model lower next time: nothing in B8. The two worst holes needed the reviewer on Opus, and the build needed Sonnet's judgment against a frozen design. The builder's five fixes were four test changes and one throw; a fix list that small could go to a Haiku builder, with the orchestrator's "fixed when" runs as the guard.

# Job 10: the glossary's remaining entries (Phase 5)

Planned on 2026-11-13 in a fresh session on Opus 5.5; direction 2.44, `plan.md`. Token figures are "growth" and "read in all", from `scripts/team/tokens.py` or the agent's usage line.

| Unit | Agent | Model | Tries | Growth | Read in all | Result |
|---|---|---|---|---|---|---|
| S12 | scout | Haiku | 1 | 246,828 | not measured | `prototypes/s12-job-10-facts.md`: 82 of 110 entries tie to 102 Learn terms, no double tie; 28 tie to nothing (the protocols, the layers, TCP, UDP, IP, TLS and others); every defining standard registered but none for Frame, Bit, Public address, Plain text's second sense; three tests count the pilot's 11 rows; four draft group ids were lesson slugs; `/glossary/` about 27 KB at 120 entries against 250 KB. |
| Plan | orchestrator | Opus 5.5 | 1 | not counted | not counted | `plan.md`: ten decisions, eleven groups in four batches, B10 first; the protocols recommended (+7). Estimate 6.4 to 7.1 million. |
| Go | the owner | | | | | 2026-11-13: "Go, with protocols". The plan approved, decision 1 accepted: 110 entries in this job, 120 in the glossary. |
| Start | orchestrator | Opus 5.5 | | not counted | not counted | 2026-11-13: batch 1 (B10, `packets`, `transport`, `leases`) in a session of its own, started by the planning session. |
| B10 spec | reviewer | Opus | 1 | 120,227 | 2,004,285 | 9 holes, 30 cases (`plan.md`, end). Twelve places in three test files, not three: the builder moved to Sonnet (erratum). |
| B10 | builder | Sonnet | 1, and 1 fix | 195,677 | 11,849,282 | Test files only. Stopped at H7 as specified: with a short-tailed scratch group, four `glossary.spec` landings go red (the page's end, not the tests). The fix: one describe title. |
| B10 review | reviewer | Opus | 1 | 49,740 | 566,896 | PASS WITH FIXES (one), fixed and checked; merged into `revamp` (a910102). |
| B10a design | designer | Opus 5.5 | 1 | 154,297 | 2,928,214 | D9's erratum §19 on `design/b10a` (707bab1): the glossary's footer reaches the window's foot; 27 key columns from 1280px for a "0–9" key. **Held, not built**: the real glossary passes H7's landings, and no approved entry starts with a digit. It goes to the owner's design gate only if a later batch turns those tests red. |
| G-packets | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 443,675 (214,434; 106,524; 122,717) | 13,806,713 | 12 entries, 13 definitions. Frame rests on the registered RFC 1122 §1.3.3. The read added 4 citations. **55 ✅ on the first check.** |
| G-transport | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 450,378 (222,368; 110,249; 117,761) | 15,708,328 | 9 entries, 10 definitions; the `what-is-udp` `term-no-resend` tie dropped (it names the absence of the thing). The read made 9 rulings. **47 ✅ on the first check.** |
| G-leases | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 532,478 (260,751; 131,209; 140,518) | 20,060,867 | 11 entries; `rfc-9542` and `microsoft-wifi-connect` registered for MAC address. The read fixed 5 citations. **53 ✅ on the first check.** |
| M-1 | orchestrator | Opus 5.5 | | not counted | not counted | Each group into `job10/batch-1` with `npm test`; the batch into `revamp` (c774575). On `revamp`: `npm test` 1828 passed, `npm run build` 26 pages in budget, `e2e/glossary.spec.ts` and `e2e/lesson.spec.ts` 627 passed, 285 skipped, none failed. **Batch 1: 1,946,472 growth, 66.9 million read in all** (estimate 1.8 to 2.0 million plus B10's 0.15 to 0.3). The tied lines' verdicts for F10 are in each analyst's report (§ the ties): 7 thin (Segment, Forwarding, Headers; dhcp `term-request`; what-is-ip `term-mac`, `term-arp`, `term-gateway`), none at odds. |
| Start 2 | orchestrator | Opus 5.5 | | not counted | not counted | 2026-11-13: batch 2 (`layers`, `subnets`, `filtering`) in a session of its own, started by batch 1's. |
| G-layers | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 473,049 (231,336; 111,744; 129,969) | 15,754,441 | 12 entries on X.200 (defining) with Microsoft, Palo Alto and RFC 1122; no new source, no Cisco. "Peer layer" keeps the lesson's name beside X.200's "peer entities". The read made 7 citation rulings. **49 ✅ on the first check.** |
| G-subnets | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 497,843 (231,413; 116,842; 149,588) | 15,202,338 | 10 entries, 11 definitions; Bit rests on `rfc-4949` and `nist-fips-197` (registered, hosts allowed). The read made 6 citation rulings. **50 ✅ on the first check.** |
| G-filtering | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 585,846 (303,435; 125,948; 156,463) | 24,537,840 | 12 entries; the "Port 21" and "Port 443" ties dropped (each names one port); Public address on RFC 1918 and RFC 3022; `paloalto-firewall-best-practices` registered in the read (Default deny's name). **54 ✅ on the first check.** |
| M-2 | orchestrator | Opus 5.5 | | not counted | not counted | Each group into `job10/batch-2` with `npm test`; the batch into `revamp` (065c9f9). On `revamp`: `npm test` 1828 passed, `npm run build` 26 pages in budget, `e2e/glossary.spec.ts` and `e2e/lesson.spec.ts` 627 passed, 285 skipped, none failed (B10a stays held). **Batch 2: 1,556,738 growth, 55.5 million read in all** (estimate 1.9 to 2.1 million); the job so far 3,503,210. For F10: thin lines what-is-ip `term-encapsulation`; subnetting `term-p2p` (narrower: the /30, passed on statement 2); firewalls `term-firewall`, `term-stateful`; what-is-udp `term-port`; what-is-ip `term-nat`. Not tied: what-is-ftp and what-is-https `term-port`. None at odds. |
| Start 3 | orchestrator | Opus 5.5 | | not counted | not counted | 2026-11-13: batch 3 (`naming`, `web`, `security`) in a session of its own, started from batch 2's card. The weekly usage limit stopped the three analysts once (HTTP 429); each was resumed after the reset with nothing lost. |
| G-naming | analyst, author, fact-checker (and re-check) | Opus, Sonnet, Opus | 1 each, 1 re-check | 490,073 (185,386; 108,474; 133,278; 62,935) | 13,046,083 | 9 entries on RFC 1034, RFC 9499 and IANA; Name server takes "Nameserver" and "DNS server". The read made 4 rulings. **42 ✅, 1 ⚠️ on the first check** (`top-level-domain-3`: ccTLDs and gTLDs on RFC 9499 alone); `iana-root-db` registered and cited; **re-check 5 ✅**. |
| G-web | analyst, author, fact-checker (and re-check) | Opus, Sonnet, Opus | 1 each, 1 re-check | 483,557 (223,086; 110,934; 104,594; 44,943) | 18,458,679 | 10 entries; the "DHCP client" tie dropped (one case of Client); Padlock on Microsoft and Cloudflare with Google, "browsers such as Microsoft Edge"; Rendering on the HTML standard alone. The read made 2 rulings. **45 ✅, 1 ⚠️ on the first check** (`html-1`: the full name on RFC 4949 alone); NIST SP 800-41r1 App. B added; **re-check 5 ✅**. |
| G-security | analyst, author, fact-checker | Opus, Sonnet, Opus | 1 each | 564,476 (273,132; 128,071; 163,273) | 25,585,957 | 10 entries, 11 definitions; Plain text's "written as text" sense on RFC 2046 (defining, `text/plain`) with RFC 9112 to 9114; Shared secret takes "Shared key". The read made 2 rulings. **51 ✅ on the first check.** |
| M-3 | orchestrator | Opus 5.5 | | not counted | not counted | Each group into `job10/batch-3` with `npm test`; the batch into `revamp` (fast-forward to ae7c4c5). On `revamp`: `npm test` 1828 passed, `npm run build` 26 pages in budget; `e2e/glossary.spec.ts` and `e2e/lesson.spec.ts` 625 passed, 285 skipped, **2 failed**: `glossary.spec.ts:141` in `d1440-dark` and `d1440-light`, failing the same way on a re-run alone. The new last letter W holds one row ("Web address", URL's pointer, 148px); at 375 by 812 the page ends 18px short of the scroll the test needs, so the letter's bar sits 36px from 68px. B10a as drawn does not reach it (its rule asks 464px of a 553px footer at 375). **A stop for the owner** (the held design question, B10a); batch 4 not started. **Batch 3: 1,538,106 growth, 57.1 million read in all** (estimate 1.65 to 1.8 million); the job so far 5,041,316. For F10: thin lines what-is-dns `term-auth`, `term-a`; what-is-https `term-https`. Not tied: what-is-dhcp `term-client`. Notes: what-is-ssh `term-kex` ("never sent" holds for Diffie-Hellman, not the KEM half of RFC 9941); what-is-https `term-key` agrees through "Shared key". None at odds. |

# Job 11: Networking Concepts' first new lesson, Router (the pilot)

Planned on 2026-11-14 in a fresh session on Opus 5.5, after the owner paused the glossary (direction 2.48); direction 2.49, `plan.md`. Token figures are "growth" and "read in all".

| Unit | Agent | Model | Tries | Growth | Read in all | Result |
|---|---|---|---|---|---|---|
| S13 | scout | Haiku | 1 | 336,994 | not measured | `prototypes/s13-networking-facts.md`: 19 planned, 4 live, 15 with no file or draft; four catalogue rows tell checked tour lessons' stories (DNS, TLS, HTTP, HTTPS); a lesson listed by two tracks is already supported; five figures built, none a "Device table" or "Playground"; IEEE 802 not registered; the count tests and e2e specs listed. |
| Plan | orchestrator | Opus 5.5 | 1 | not counted | not counted | `plan.md`: nine decisions, Router the pilot, four tour lessons shared (decision 2, for the owner). Estimate 2.0 to 3.4 million. Waiting for the go. |
| Go | the owner | | | | | 2026-11-14: "Go, share them". The plan approved, decision 2 accepted: Networking lists What is DNS, What is TLS, What is HTTP and What is HTTPS; 20 stops. |
| B11 spec | reviewer | Opus | 1 | 121,826 | not measured | 9 holes, each one right answer (errata E1–E9 in `plan.md`), and the attack cases. The worst: the shared lessons had no card art under Networking (the build would throw) and `visual.spec.ts` names tests by slug (32 duplicate titles). |
| L18-a | analyst | Opus | 1 | 249,892 | not measured | Router's outline (`.superpowers/analysis/router/report.md`): 25 ideas, 13 claims not to make, 33 lines that must agree (none at odds), five Watch steps on `net-map`; 112 of 112 passages found by script. 6 new documents, no new host. Badge 3. |
| L18-r | orchestrator | Opus 5.5 | 1 | not counted | not counted | Ten rulings in the report (five steps; NAT source shown; RFC 5508; no IANA citation; no IPv6); the six documents registered on `job11/router` (`dce9643`). |
| B11 | builder | Sonnet | 1, and 1 fix | 167,248 | not measured | Networking lists What is DNS, What is HTTP, What is HTTPS, What is TLS (20 stops, 8 ready); card art by the lesson's home track; About counts 18; e2e names by path. `npm test` 1,835 passed; build 30 pages in budget; d1440-dark site/lesson/glossary only the known glossary failure; `visual.spec` 761 passed. |
| B11 review | reviewer | Opus | 1 | 72,725 | not measured | PASS WITH FIXES: one false comment, three stale "of 19" headers, a dead test key. Fixed (`cf0e665`); the two "of 19" left are not counts (What is IP's "owner of 192…", a fixture of 19). `phone` 92 passed. Merged into `revamp` (`fc94311`): `npm test` 1,835 passed, build in budget. |
| D10 | designer | Opus 5.5 | 1, one variant | 147,871 | not measured | `prototypes/d10-router.html`, `d10-router.md`, `d10-scene-map.md`: Router's five steps on `net-map` with one table panel whose by-line names each table's owner, both matching rows lit before the winner, a DROPPED mark at router a, name strips on routers a–d, the resolver hidden; a new `router` spot; the card mix after B11 reads fine. Scene map: of the eleven, 2 small-to-medium on built figures, 4 medium, 5 large (new figures or a compare mode). **At the design gate.** |
| D10 gate | the owner | | | | | 2026-11-14: "Approve D10". The design frozen as drawn, the resolver hidden in Router's scene. |
| B12 spec | reviewer | Opus | 1 | 171,614 | not measured | 10 holes: 9 one right answer, 1 (the figure's text while the resolver is hidden) ruled by the orchestrator as accessibility; errata E1–E10 and the cases in `prototypes/d10-cases.md`. The count tests and the page checks move to B12b, after the lesson exists. |
| B12 | builder | Sonnet | 1 | 328,329 | not measured | Router's scene parts on `job11/router` (`33a65b9`..`d0f8e70`): `by`, `keys`, the no-match row, a `dropped` note glyph, name strips, the `drop` and `hide resolver` cues, table timing, `routerSpot`; a test-only fixture. `npm test` 1,883 passed; build in budget (net-map pages +0.4–0.5 KB); d1440-dark and phone `lesson`, `site`, `router` specs 317 passed, 6 skipped (`router.spec.ts` waits for the lesson). |
| L18-b | author | Sonnet | 1, and the read's 13 rulings | 198,280 | not measured | `src/content/lessons/router.ts` on `lesson/router` (`5f4a5cf`): 100 sheet items, 16 sources cited, none added, no override; `astro check` clean; development-mode tests fail only where a report or the counts are missing (13) and one flake. Four doubts sent to the read. |
| B12 review | reviewer | Opus | 1 | 138,069 | not measured | **FAIL**, one blocker: `routerSpot` was redrawn, not the prototype's art (ring, feet, an added arrow, LEDs, cables). Fixes: strips 0.1 off and a missing wrapper; the 2× timing untested. Every erratum and every other case met (each broken in a scratch copy and seen red). Back to the same builder. |
| L18-p | analyst (continued) | Opus | 1 | 58,155 | not measured | 87 of 100 sound; 13 rulings (citations, traces, two Practice options); ruling 6 changes a table cell's words, approved as D10 erratum E11. Applied by the author (`7537e5b`). The analyst's whole growth: 308,047. |
| B12 fix | builder (continued) | Sonnet | 2 | 407,971 (whole builder) | not measured | `8c62e2d`: `routerSpot` now the prototype's art tag for tag (a test reads `prototypes/d10-router.html`); strips unrounded with the `nm-names` wrapper; the 2× wait tested. The orchestrator ran each "fixed when": the spot test and a scratch diff of `drawNetMap(['ip:web'])` against the prototype both empty; the 2× test red with `/ speed` removed. `npm test` 1,885 passed; build in budget. **B12 passes.** |
| L18-c | fact-checker | Opus | full check 1 | 156,690 | not measured | 98 of 100, 2 ⚠️, none wrong (`fa11a93`, as written): `why-2` and `fact-home`'s default-route clause rest on Cisco alone. 111 quotes in 16 sources, "Quotes OK". A near-pass: the fix goes to the analyst, then a targeted re-check. |
| L18-f | analyst (continued) | Opus | 1 | 11,017 (whole analyst 319,064) | not measured | The fix after the check: RFC 1812 §5.2.4.3 and §7.5.2 as the second publisher for both held items, words unchanged; no new document. |
| L18-b fix | author (continued) | Sonnet | 1 | 3,084 (whole author 201,364) | not measured | `2a5ee78`: the two citations added. `--recheck` refused (15 items, more than 12): a full check. |
| L18-c2 | fact-checker (fresh) | Opus | full check 2 | 164,462 | not measured | **Passed: all 100 items** (`4f6dee9`): 41 claims, 1 badge, 52 traced, 1 example, 5 unbacked; 109 quotes in 16 sources; Cisco read in the browser. `--check`: Report OK. Six simplifications passed with notes. Merged into `job11/router` (`f0593ce`). **Router's content: about 0.84 million growth** (analyst 319,064, author 201,364, checks 156,690 and 164,462), under the 1.6 million stop. |
| B12b | builder (continued) | Sonnet | 1 | 446,994 (whole builder, B12 and its fix included) | not measured | `c0bf1e9`..`278b775`: counts for a ninth ready lesson in 8 unit specs and `site.spec`; `router.spec.ts` 5 of 5 against the real page, unedited; a screen-reader separator in the no-match cell; Router looked at beside the prototype (1440 light, 375 dark). The prototype's Network/Sequence switch is not built: the approved spec says `['network']` only (D10 §3), which wins. |
| M11 | orchestrator | Opus 5.5 | 1 | not counted | not counted | `job11/router` into `revamp` (`8585aef`): `npm test` 1,886 passed; build 31 pages in budget; `fact-check -- router --check` Report OK. |

| F11 | orchestrator | Opus 5.5 | 1 | not counted | not counted | Full `npm run e2e` on `revamp` (`8585aef`): **1,470 passed, 2 failed, 461 skipped** (29.0 minutes). The two failures are the one known test, `e2e/glossary.spec.ts:143` (the Glossary page's end at 375, held by the owner, 2.48), in d1440-dark and d1440-light; nothing else failed. Worktrees removed; branches kept. |

**Totals** (growth): scout 336,994; reviewers 504,234 (B11 spec 121,826, B11 build 72,725, B12 spec 171,614, B12 build 138,069); builders 614,242 (B11 167,248, B12 with its fix and B12b 446,994); designer 147,871; analyst 319,064; author 201,364; fact-checkers 321,152. **Subagents 2,444,921; after the go 2,107,927**, inside the 2.0 to 3.4 million estimate and under the 3.8 million stop. Router's content (analyst, author, two full checks) 841,580; its design and build (D10, B12 spec, build, fix, review, B12b) 904,548; the four shared lessons (B11) 361,799.

**What the pilot measured, for the other eleven.** A new lesson's content cost what a moved lesson's did (0.84 million against Phase 4's 0.74 to 1.23): the outline replaced the old words, and the read before the check found 13 things. Its scene cost as much again (0.90 million) though it used a built figure: a new panel ability, two cues and card art. The card art was redrawn by the builder instead of copied and failed review; the fix compares the build with the prototype's SVG tag for tag, which every later spot should do from the start.

**Could go one model lower next time.** B12b's count updates are mechanical once the lesson exists and could be a scout's script plus a Haiku builder.

**What to do differently next time**

- A builder copies a prototype's SVG for card art and figure parts and pins a test that reads the prototype; it never redraws.
- A Learn part many items trace to must have two publishers before the check: when one such part was held, the re-check grew past 12 items and a second full check was needed (about 0.16 million).
- Start the author on its own branch while the scene's build is reviewed: it saved a round of waiting and nothing collided.
- Ask the scout to list, for a new lesson, the tests that count ready lessons; B12b found them late.

# Job 12: Networking Concepts' batch 1, ARP, Ports and NAT

Planned on 2026-11-14 in a fresh session on Opus 5.5, under the owner's go on batch 1 without a design gate (direction 2.52, 2.53); `plan.md`. Token figures are growth.

| Unit | Agent | Model | Tries | Growth | Result |
|---|---|---|---|---|---|
| S14 | scout | Haiku | 1 | 240,824 | `prototypes/s14-batch-1-facts.md` (saved by the orchestrator; the scout writes no file): ARP stop 6, Ports 10, NAT 12, no files; RFC 2663, RFC 6146 and any vendor NAT or port page unregistered; agreement lines in What is IP, Router and every checked port line; eleven count specs and `site.spec.ts`. |
| Plan | orchestrator | Opus 5.5 | 1 | not counted | `plan.md`: ten decisions, one designer, one builder for the three scenes. Estimate 3.3 to 4.7 million. Under the owner's go (2.52). |

| L19-a | analyst | Opus | 1 | 231,652 | ARP's outline (`.superpowers/analysis/arp/report.md`): 25 ideas, 5 steps on net-map's home with no new part, 13 not to claim, 23 agreement lines; 112 of 112 passages found by script; 4 new documents. |
| L20-a | analyst | Opus | 1 | 269,654 | Ports' outline: 24 ideas, 5 steps (80, 443, 22, 3389 refused, then opened), 15 not to claim, 29 agreement lines; 117 of 117 passages; 11 new documents; `iana-ports` redirects and is paginated. |
| L21-a | analyst | Opus | 1 | 280,937 | NAT's outline: 22 ideas, 5 steps, 113 of 113 passages; 8 new documents proposed; needs a phone and a stranger plate on net-map; RFC 3022 has no `#abstract` id (What is IP's citation lands at the page's top). |
| L19-r, L20-r, L21-r | orchestrator | Opus 5.5 | 1 | not counted | Rulings in each report. ARP's badge layer 3 on Cisco and Cloudflare's "What is the network layer?" (read in the browser); NAT's `'spans'`; Ports' layer 4. IANA cited per number by a search URL; moved addresses left for the owner. 22 documents registered on `job12/batch` (`a63c603`, `paloalto-nat-rules` dropped, `microsoft-dynamic-ports` shared); `npm test` 1,886 passed. |
| D11 | designer | Opus 5.5 | 1 | 102,527 | `prototypes/d11-batch-1.md` with six SVG files (three spots; parts: a phone hidden unless a `show phone` cue, a `nat:stranger` plate in a new slot N, a `ports:server` plate "A server"), and a patch whose output is the SVGs. Five open questions ruled by the orchestrator as drawn (§11); committed `81a5dae`. |
| B13 spec | reviewer | Opus | 1 | 176,057 | `prototypes/d11-cases.md` (`6f9dd94`): 9 holes, 8 with one answer (errata E1–E3, E5–E9; the worst: five pinned tests §5.8 missed, Router's prototype test among them; the new message rules scoped to `net-map`; no step sets `step.status`), H4 (Ports' and NAT's carrier word) to the designer; 25 groups of attack cases. The patch's output equals the six SVGs byte for byte. |
| B13 | builder | Sonnet | 1 | 244,164 | `f214daa`..`8e417d5` on `job12/batch`: Appendix A's patch and §5 items 2–7 (layer `describe`, `show phone` cue, driver, validator, `remove` wait, `add` clears no-match, three cards), three fixtures (`batch1-fixtures.ts`), every attack case that needs no lesson page as a test, eleven mutation proofs. `npm test` 1,933 passed; build in budget; d1440-dark `lesson`/`site`/`router` 236 passed, phone 93. E4 from the designer (no `over` on Ports and NAT). |
| B13 review | reviewer | Opus | 1 | 116,167 | **PASS**, no blockers or fixes: Appendix A applied to `6f9dd94` equals the build's art (`net-map.ts`, `spots.ts` identical); 13 mutations each red; existing lessons' durations, Router's prototype test and every lesson's validation unchanged. 375/1440 and the browser cases move to B13b (E8). |
| L19-b | author | Sonnet | 1 | 215,813 | `src/content/lessons/arp.ts` on `lesson/arp` (`1d124c3`): 90 sheet items, no override, no document added; `astro check` clean; development tests fail on the 13 expected (report, counts) and D11's duration test, which globs every net-map lesson and now finds ARP's `remove` (for B13b: compare only lessons that existed before D11). Three doubts to the read. |
| L20-b | author | Sonnet | 1 | 222,687 | `src/content/lessons/ports.ts` on `lesson/ports` (`8ffa10d`): 94 items, 24 sources, none added; `astro check` clean; development tests fail on the expected 13 and D11's duration test. Ruling 5 changed: `cite()` refuses a per-citation IANA `?search=` URL, so port numbers rest on RFC 4253, RFC 9110, Microsoft and Cloudflare, IANA only for "Note" and ranges. Five doubts to the read. |
| L19-p | analyst (continued) | Opus | 1 | 58,959 (whole analyst 290,611) | 81 of 90 sound; 9 rulings (one new fact `fact-name` at the end; "doesn't have to ask again" → "…ask every time", which contradicted step 5; second publishers added); no scene words, no new document. 126 of 126 passages by script. A shared scratchpad clash with another analyst, redone in a private folder. |
| L19-b fix | author (continued) | Sonnet | 1 | 6,383 (whole author 222,196) | `e7cbd5c`: the read's 9 rulings applied as written; 91 items; `astro check` clean. |
| L21-b | author | Sonnet | 1 | 213,322 | `src/content/lessons/nat.ts` on `lesson/nat` (`9f7bfed`): 91 items, no override, no document added; `astro check` clean; development tests fail on the expected 13 and two `net-map.test.ts` sweeps of other net-map lessons that now find NAT (for B13b). Four doubts to the read. |
| L20-p | analyst (continued) | Opus | 1 | 70,045 (whole analyst 339,699) | 81 of 94 sound; 13 rulings (`fact-common` names each port's service with Palo Alto and Cloudflare so every number has two publishers; RFC 791 §1.1 for `lead-1`; OpenBSD `connect#ECONNREFUSED` for "refused"); no scene words, no new document (OpenBSD intro(2) offered, not registered). 135 of 135 passages. |
| L20-b fix | author (continued) | Sonnet | 1 | 9,137 (whole author 231,824) | `dff192f`: the read's 13 rulings applied as written; 94 items; `astro check` clean. |
| L21-p | analyst (continued) | Opus | 1 | 61,296 (whole analyst 342,233) | 82 of 91 sound; 9 rulings (`term-private` "private networks"; `fact-router`'s one-publisher clause cut; `fact-timeout` adds UDP's well-known-port exception, as What is UDP; step 3's Go deeper narrowed to "the same site" after RFC 7857); no scene words, no new document. 126 of 126 passages. |
| L21-b fix | author (continued) | Sonnet | 1 | 7,523 (whole author 220,845) | `aaeab30`: the read's 9 rulings applied as written; 91 items; `astro check` clean. |
| L19-c | fact-checker | Opus | full check 1 | 151,330 | **Passed: all 91 items** (`5568757`): "Quotes OK", 122 quotes in 17 sources; Cloudflare read in the browser; `--check` Report OK. Notes: the badge on two vendors; randomized MACs (RFC 9724) left out; "the others ignore it" holds as "does not answer". Merged into `job12/batch` (`3a3256a`); `npm test` there fails only the 8 count tests and D11's duration test (B13b). **ARP's content: 664,137** (analyst 290,611, author 222,196, check 151,330). |
| L20-c | fact-checker | Opus | full check 1 | 173,633 | 92 of 94, 2 ⚠️, none wrong (`9c0c6cb`, as written): the Overview description and its fact "Nothing listening" drop "TCP", which Learn keeps. "Quotes OK", 135 quotes in 26 sources. A near-pass: the checker named the fix, sent to the author; then a targeted re-check. |
| L20-b fix 2 | author (continued) | Sonnet | 1 | 1,801 (whole author 233,625) | `6e64b1c`: "a TCP connection request" and "Nothing listening (TCP)" in the Overview; `--recheck` printed 2 items. |
| L20-c2 | fact-checker (fresh) | Opus | re-check | 27,549 | **Passed: 2 of 2** (`01b902a`); `--recheck --check` Report OK for both reports (a re-checked lesson's plain `--check` names the change, as Firewalls' does on `revamp`). Merged into `job12/batch` (`bd46e91`). **Ports' content: 774,506** (analyst 339,699, author 233,625, checks 173,633 and 27,549). |
| L21-c | fact-checker | Opus | full check 1 | 188,609 | 90 of 91, 1 ⚠️, none wrong (`fe864ff`, as written): `fact-ports` read as every device using 49152–65535 (Linux defaults to 32768–60999). "Quotes OK", 124 quotes in 15 sources. A near-pass: the fix in the checked Ports lesson's words, to the author; then a targeted re-check. |
| L21-b fix 2 | author (continued) | Sonnet | 1 | 997 (whole author 221,842) | `1fba5bd`: `fact-ports` "often from … 49152 to 65535 (some systems use other ranges)". `--recheck` refused: 27 items trace to `fact-ports`, more than 12. A second full check. |
| L21-c2 | fact-checker (fresh) | Opus | full check 2 | 179,895 | 90 of 91, 1 ⚠️, none wrong (`5f81627`, as written): `fact-ports` now passes; `fact-defined`'s "its terms are in RFC 2663" rests on RFC 4787 §3 alone. "Quotes OK", 112 quotes in 15 sources. Fix: RFC 3022 §1 added (it sends readers to [NAT-TERM], RFC 2663), words unchanged. |
| L21-b fix 3 | author (continued) | Sonnet | 1 | 1,132 (whole author 222,974) | `14cef20`: RFC 3022 §1 added to `fact-defined`; `--recheck` printed 7 items. |
| L21-c3 | fact-checker (fresh) | Opus | re-check | 39,802 | **Passed: 7 of 7** (`0e53cc2`); `--recheck --check` Report OK for both reports. Merged into `job12/batch` (`513edb7`). **NAT's content: 973,513** (analyst 342,233, author 222,974, checks 188,609, 179,895 and 39,802), under the 1.6 million stop. |
| B13b | builder (continued) | Sonnet | 1 | 305,301 (whole builder, B13 included) | `738ebf0`..`0ffd37a`, tests only: the net-map sweeps compare only lessons before D11 and check the real NAT's phone; counts to 12 of 20 ready (22 lessons ready in all); `e2e/{arp,ports,nat}.spec.ts` with a shared `e2e/batch1.ts` (check 19, case 24, the browser cases); `NO_SEQUENCE`, `site.spec` counts and Up next. Orchestrator's check: `npm test` 1,936 passed; build 34 pages in budget; d1440-dark six specs 271 passed, 1 skipped; phone 96. Seen at 1440 light and 375 dark beside the SVGs. Found: the internet and router callouts already overlap by 1px on every net-map page (before this job). |
| M12 | orchestrator | Opus 5.5 | 1 | not counted | `job12/batch` into `revamp` (`7bf4377`): `npm test` 1,936 passed; build 34 pages in budget; the three reports Report OK (Ports and NAT with `--recheck --check`). Worktrees `arp`, `ports`, `nat` removed; branches kept. |

| F12 | orchestrator | Opus 5.5 | 1 | not counted | Full `npm run e2e` on `revamp` (`7bf4377`, `E2E_PORT=4485`): **1,586 passed, 2 failed, 558 skipped** (31.7 minutes). The two failures are the one known test, `e2e/glossary.spec.ts:143` (held by the owner, 2.48), in d1440-dark and d1440-light; nothing else failed. |

**Totals** (growth): scout 240,824; analysts 972,543 (ARP 290,611, Ports 339,699, NAT 342,233); designer 107,419; reviewers 292,224 (B13 spec 176,057, build 116,167); builder 305,301 (B13 and B13b); authors 678,795 (ARP 222,196, Ports 233,625, NAT 222,974); fact-checkers 760,818 (ARP 151,330; Ports 173,633 and 27,549; NAT 188,609, 179,895 and 39,802). **Subagents 3,357,924**, inside the 3.3 to 4.7 million estimate and under the 5.0 million stop. Content 2,412,156 (ARP 664,137, Ports 774,506, NAT 973,513, each under 1.6 million); the three scenes and card arts 704,944, against Router's 904,548 for one.

**Could go one model lower next time.** B13b's counts are mechanical once the lessons exist (a script plus a Haiku builder); the authors' fixes of a citation or a few words could be a Haiku edit from the checker's named fix.

**What to do differently next time**

- One designer, one spec review and one builder for a batch's scenes worked: the designer's patch whose output is the SVG files let the build pass its first review with no fixes. Keep it.
- Two publishers was not enough for a Learn fact many items trace to: NAT's `fact-ports` was held for a scope word ("from the range" read as every device), the re-check grew to 27 items and NAT needed a second full check (0.18 million). The read before the check should look for absolutes ("every", a single range, "only") in the facts most items trace to.
- Give each analyst a private scratch folder: two analysts overwrote each other's sheet and script in the shared scratchpad.
- Before ruling a citation form, check the helper accepts it: `cite()` refuses a `url` whose query differs from the document's, which undid Ports' ruling 5 at the author.
- The scout's own rules forbid writing files: ask it for the text and save it, as this job did.
- Run the full e2e with a port of its own: an `astro preview` left on 4471 stopped the first run.
