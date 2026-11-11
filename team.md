# Team ledger

The job in `plan.md` now is the start of Phase 4, a pilot of two lessons: its rows are under "Job 3" at the end. Job 1 was the Lesson page (Phase 2) and job 2 was Phase 3, one fact-check path; both are done.

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

Waiting for the owner's go on `plan.md`.

| Unit | Agent | Model | Tries | Tokens | Result |
|---|---|---|---|---|---|
| S3 | scout | Haiku | 1 | 187,981 | Done 2026-11-11. What moving a lesson takes, what OSI Model took, and the size and sources of each of the 17, every fact with a `path:line`. Findings are summarised in `plan.md`. |

