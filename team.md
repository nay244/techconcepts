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
