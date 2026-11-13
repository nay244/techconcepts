# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4.

**Status: the owner said go** (2026-11-12, "Go", on the plan as shown), which approves the fifteen decisions below. **At the design gate** (2026-11-13): D6 and D7 are made and shown to the owner; no build unit that implements them starts before the owner approves them. The plan and the design are made on Fable 5.2 by the owner's word for this job ("Have Fable 5.2 design and plan out our practice page", 2026-11-12); everything else keeps the models in `.claude/agents/` (direction 2.37).

## Inputs

| | |
|---|---|
| **The job** | Job 9, Phase 5: the standalone **Practice page**, over the 40 questions the lessons already hold, with the private list of missed questions from the first direction document's §6.6. With it, as a build unit of its own with no design, the removal of the legacy path, which has been dead code since job 8 emptied its list. |
| **Done means** | A reader can open `/practice` from every page's header, answer any of the 40 questions with the feedback and source marks the lesson gives, and find the questions they missed kept for them, in their browser only, until they answer them right or remove them. Nothing is scored. Every word the site says about what Practice saves is true. The legacy path is gone and `npm test` skips nothing. The page matches its approved prototype at 375px and 1440px in both themes. `npm test`, `npm run build` and the full `npm run e2e` pass on `revamp`, with their output in `team.md`. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 2.4 to 3.5 million subagent tokens after the go (below); the stops are under "When the work stops for the owner". |
| **Design refs** | `docs/direction.md` §6 (Patch), §7 (the lesson's Practice part, the marks, the stamp), §8 (the figure family), §9 to §11 (Home, Tracks, the track page, About); `src/styles/tokens.ts`; `src/lesson/Practice.tsx` and `src/lesson/console.css:998-1030` (a question as a lesson shows it today); `docs/superpowers/specs/2026-11-07-techconcepts-direction.md` §6.6; the standing rules for words in `.claude/agents/designer.md`. |

## What the scout found (S10; `prototypes/s10-job-9-facts.md` has every `path:line`)

- **The questions.** 40 in 18 lessons: Networking's four ready lessons hold 3 each, How the Internet Works' fourteen hold 2 each. Each is a prompt, 3 options (one question has 4), the index of the right one, and for every option its own feedback with citations. A question's id is a hand-written slug, unique within its lesson and already the key of its row on the lesson's claim sheet. Every lesson is one unit.
- **How a lesson shows them.** `src/lesson/Practice.tsx`: picking an option shows its feedback at once, opening "Right." or "Not quite.", with the source marks of that option. The picks live in memory for the visit (`LessonConsole.tsx:185-191`) and a reload clears them. Nothing is counted or stored, and tests hold that (`Practice.test.tsx:31-60`, `LessonConsole.test.tsx:540-560`).
- **What the site promises today.** "Just for you. Nothing is scored or saved." in the lesson (`Explanation.tsx:340`) and on About's Practice card (`about.astro:119`); "Just for you, nothing is scored" in the sidebar (`Outline.tsx:230`); "Nothing is scored." on Home (`index.astro:260`); About's table row "Your Practice answers: Not saved at all" (`about.astro:201-202`). The missed list makes the words "or saved" and that row false.
- **§6.6, word for word** (the owner, Q28, 2026-11-07): "Practice stays **unscored**." "Add a private **"missed questions" review list**, stored only in the browser through `createSafeStorage()`. No score, streak, XP or anything else gamified." "This changes the launch spec's "Check yourself is never scored or saved". It is still never scored. Only the missed list is saved." It was written when Practice lived only inside a lesson.
- **An older idea this plan does not take.** On 2026-11-09 the owner made Practice "a standalone page of knowledge-check quizzes, not tied to any track, with new questions written for it", with no header link "until its first quiz ships" (`docs/superpowers/specs/2026-11-09-site-layouts-design.md:31-33`). The revamp's direction document replaced that with a page over the 40 existing questions (§3, Phase 5).
- **Routes.** Six page files; no `/practice`. The header's links are Tracks, How a lesson works, Sources and About (`SiteHeader.astro:16-21`), and an end-to-end test holds exactly those four and "no link named Practice" on every page (`e2e/site.spec.ts:433-441`). The pages the end-to-end loops walk are listed once (`e2e/support.ts:50-57`). There is no sitemap. The page-weight budget is 250 KB of HTML gzipped for any page (`scripts/check-budgets.mjs:17`).
- **Saved progress.** One record, `techconcepts:v2`, read and written through `createSafeStorage()` (`src/progress/store.ts`, `src/lib/storage.ts`), with a migration from v1. About's "Reset progress" clears it. No Practice answer is in it.
- **The legacy path reaches further than its own file.** `src/content/legacy.ts` (172 lines) and its test; the `origin: 'cited' | 'legacy'` field of every lesson and the branches on it in `define.ts`, `registry.ts`, `checked.ts`, the fact-check's `cli.ts` and `gate.ts`; `helpers/tour.ts`, which nothing imports; 13 files that import the list, `e2e/support.ts` among them; four unit tests that skip on the empty list and three more that pass without checking anything; one skipped end-to-end test. **The older, terse lesson shape is also what the test fixtures are written in:** `test-fixtures.ts:321-358` builds every fixture lesson through `liftLegacy`, and 27 test files use it.
- **"Not checked yet" is not dead.** With the list empty no built page can show it: a build refuses a cited lesson with no report. But `astro dev` shows it for a cited lesson whose report is not written yet (`registry.ts:305-314`), which is the state every new lesson will be in while it is written.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **The page is `/practice`, one static page, linked from the header and the footer of every page.** The rule "no Practice link until Practice ships" ends when the page does. The design says where the link sits and what the phone's menu does with five links.
2. **It shows the 40 questions as the lessons hold them, and no other.** The page reads each ready lesson's questions, options, feedback and citations from the registry when the site is built; it keeps no copy and changes no word. So nothing on it needs a fact-check of its own: every word of a question is already on a passed claim sheet, and a later change to a lesson's question reaches the page through that lesson's own check. The page's new words (headings, labels, empty states) say nothing about technology. A design that wants a question's words changed says so as an open question; it is not in this job.
3. **Never scored.** No score, percentage, tally of right answers, "x of 40", streak, timer, level or badge, on the page or in storage. The one number the design may show is how many questions are on the missed list, since that is the list's own length; whether it shows is the design's call and comes to the owner at the gate.
4. **The missed list: what joins and what leaves.** A question joins when the reader picks a wrong option for it, on the Practice page or in a lesson's Practice (§6.6 was written for the lesson). It leaves when the reader picks its right option, in either place, or removes it; the reader can empty the whole list; About's "Reset progress" empties it too. The design settles when a question answered right goes from view, so that it does not vanish under the reader's finger.
5. **What is stored, and where.** Only in the browser, through `createSafeStorage()`, under a key of its own (`techconcepts:missed:v1`), so the progress record and its migration do not change. The record is a version and an ordered list of question keys (`<lesson slug>/<question id>`), newest first: not the option picked, not a date, not a count of tries. On load, a key whose question no longer exists is dropped. Nothing is sent anywhere. When storage is blocked the list lasts for the visit and the page says so.
6. **Every sentence about what Practice saves is made true in the same job.** "Nothing is scored or saved" (the lesson, About's card) and About's row "Your Practice answers: Not saved at all" get new words from the design; "Nothing is scored." on Home stays, since it stays true. The tests that hold the old promise are rewritten to hold the new one: a wrong pick stores the question's key and nothing else.
7. **The Lesson page keeps its layout.** Only its Practice part changes: the line under its heading, a way to the Practice page, and recording a miss. This follows the owner's rule that the Lesson page stays close to what it is.
8. **Every question on the page leads back to its lesson.** A missed question is a reason to read the lesson again; the design says how the link reads and where it lands.
9. **With JavaScript off the page is not blank and promises nothing it cannot keep.** The design decides between questions that work without script (as Home's demo does) and a plain statement of what the page needs; it writes the words either way.
10. **Designed for 375px and 1440px together, in both themes, with Patch's tokens and no new one.** At most two variants. Any drawing comes from the figure family (§8). The design's questions to settle: how 40 questions in 18 lessons are arranged and chosen; one question at a time or several; where the missed list sits and how it reads when empty and when full; what a reader who has finished no lesson sees; the page's name in the header.
11. **Two design units, each with a prototype and a spec:** D6, the Practice page; D7, what the rest of the site changes (the header and footer on every page, the lesson's Practice part, About's card and table row). Each is one self-contained HTML file a builder can match. The owner sees both at the design gate, and no build unit that implements them starts before the owner approves them.
12. **The legacy path goes, in a unit of its own (B7), with no design.** Out: `src/content/legacy.ts` and its test, `helpers/tour.ts`, the `origin` field and every branch on it, the tests that exist only for the legacy path, the four skipped unit tests, the three that pass on an empty list (removed, or rewritten over the ready lessons), the skipped end-to-end test, and the legacy list's part in `e2e/support.ts` and `e2e/global-setup.ts`. `docs/content-model.md` §4 and the handbook's §2 say so. **Three things stay:** the stamp's "Not checked yet" state with its tests, because a lesson being written shows it in `astro dev` and a build still refuses such a lesson (this corrects job 8's note, which called the stamp dead code); the code for lessons of several units, which is on the list for after the revamp; and `LEGACY_PROGRESS_KEY`, which is the v1 progress record and has nothing to do with lessons. The fixtures' terse shape and its lift move into `src/content/test-fixtures.ts` as test-only code under names with no "legacy" in them, so 27 test files keep their fixtures and no module the site ships knows two kinds of lesson.
13. **Models.** The plan (this file) and the design units D6 and D7 are made on Fable 5.2, by the owner's word for this job and for nothing else. The scout ran on Haiku. The build runs in a fresh session with the orchestrator on Opus 5.5: `builder` on Sonnet, `reviewer` on Opus. This session ends at the design gate.
14. **Order of the build.** B7 needs no design, so it may start at the go, in its own worktree, in a session on Opus 5.5; this session does not run it. After the owner approves the designs: B8 (the missed list's store and the list of questions), then B9 (the page), then B10 (the rest of the site), one after another, because B9 and B10 both change `e2e/support.ts` and `e2e/site.spec.ts` and B10's header link needs B9's page. Each build unit has a spec review first (`CLAUDE.md`, Spec review): B7's cases are saved under its unit here; B8 and B9 share D6's (`prototypes/d6-cases.md`); B10 has D7's (`prototypes/d7-cases.md`).
15. **The ledger is short** (handbook §6a): one row a unit with its model, written when the unit ends, the designer's spend counted apart; every agent replies in 150 words or fewer; at most three heavy agents at once.

## Units

Design units first. Each build unit names the design unit it implements.

| Unit | Phase | Owner (model) | What | Implements | Check |
|---|---|---|---|---|---|
| S10 | scout | scout (Haiku) | The questions, §6.6, routes, saved progress, the legacy path and the end-to-end specs each touches. Done. | | Every fact has a `path:line`. |
| D6 | design | designer (Fable 5.2) | **The Practice page:** `prototypes/d6-practice-page.html` and `.md`. Every state: first visit; a question unanswered, answered right, answered wrong, with its marks; the missed list empty, with one question, with many; a missed question answered right; the list emptied; storage blocked; JavaScript off. The header and footer with the new link, as part of the page. Decisions 1 to 5 and 8 to 10. | | Opened in the browser at 375 and 1440 in both themes, every state clicked; no sideways scroll; the spec's acceptance checks can each be tried on the prototype. |
| D7 | design | designer (Fable 5.2) | **What the rest of the site changes:** `prototypes/d7-practice-site.html` and `.md`. The header with five links at 375, 768 and 1440, and the phone's menu; the footer; the lesson's Practice part (its words, the way to the Practice page, what a wrong pick says about being kept); About's Practice card and its table row; every changed sentence listed with its old words. Decisions 1, 6 and 7. | | The same, and every sentence in the scout's list of promises is either kept as true or given new words. |
| Gate | | the owner | The prototypes and specs of D6 and D7. Approval freezes them. | | |
| B7 | build | builder (Sonnet), spec review and build review by reviewer (Opus) | **Remove the legacy path** (decision 12). No design. Worktree `.superpowers/wt/b7-legacy`, branch `b7/legacy`, `E2E_PORT=4481`. | none | `grep -rni legacy src e2e scripts` finds only the v1 progress key's lines. `npm test` passes with **no skipped test**; every test removed is named in the report with the reason. `npx astro check` clean; `npm run build`; `e2e/site.spec.ts` and `e2e/lesson.spec.ts` pass on the unit's port. A lesson file with no report still shows "Not checked yet" in a development-mode test and still fails a build-mode one. |
| B8 | build | builder (Sonnet), reviews by reviewer (Opus) | **The missed list's store and the list of questions:** a pure module over `createSafeStorage()` (load, add, remove, clear, drop unknown keys, blocked storage) and a build-time list of every ready lesson's questions with its track, lesson, address and source numbers. No screen. | D6 (its data section) | Unit tests for each of the spec's cases and each attack case; `npm test`; `npm run build`. |
| B9 | build | builder (Sonnet), reviews by reviewer (Opus) | **The Practice page:** `src/pages/practice.astro` and its parts, as D6 draws it; `e2e/practice.spec.ts`. | D6 | Matches the prototype at 375 and 1440 in both themes; each acceptance check and attack case is a test; `npm test`; `npm run build` within the page budget; its own spec passes. |
| B10 | build | builder (Sonnet), reviews by reviewer (Opus) | **The rest of the site:** the header and footer link and the `current` value for it; `/practice` in the end-to-end page list; the lesson's Practice part recording misses, with its new words; About's card and row; "Reset progress" emptying the list; the tests and end-to-end checks that hold the old words. | D7 | Matches the prototype; `npm test`; `npm run build`; `e2e/site.spec.ts`, `e2e/lesson.spec.ts`, `e2e/reading.spec.ts`, `e2e/tablet.spec.ts` and `e2e/practice.spec.ts` pass on the unit's port. |
| F9 | end | orchestrator (Opus 5.5) | Merge each passed unit into `revamp`; then `npm test`, `npm run build` and the full `npm run e2e` in the background, lid open. The ledger, the direction document's Phase 5 status, the errata from the spec reviews for the owner. | | The three outputs are in `team.md`. |

## Estimate

| Role | Model | Units | Tokens (growth), roughly |
|---|---|---|---|
| scout | Haiku | S10 | 246,512 (spent; 9.6 million read in all) |
| designer | Fable 5.2 | D6, D7 | 500,000 to 800,000 |
| reviewer | Opus | three spec reviews, four build reviews | 600,000 to 900,000 |
| builder | Sonnet | B7 to B10, with fixes | 1,100,000 to 1,600,000 |

That is 2.4 to 3.5 million after the go. B7 is the least certain: it touches about forty files, most of them tests. No lesson's words change, so there is no analyst, author or fact-checker in this job.

## When the work stops for the owner

- **The design gate:** D6 and D7 shown, nothing built from them until the owner approves.
- A design change after approval (it goes back to `designer`, then to the owner).
- A design or a build that needs a question's words changed, or any other lesson content.
- The job passes 4.0 million subagent tokens after the go.
- A page over its weight budget that only an override would pass.
- Anything the owner keeps (`CLAUDE.md`, Ownership).

A unit that fails two build reviews comes back to the orchestrator with both reports, as `CLAUDE.md` says. Everything else the orchestrator decides, records in the direction document and reports with the job's result.

## What could go wrong

- **The missed list reads as a score.** A count of misses, a red mark beside a question or a list that only grows would turn "never scored" into a tally of failures. Decision 3 allows one number; the design has to make the list feel like the reader's own notes, and the owner judges that at the gate.
- **A sentence about saving is left false.** Four places promise today that nothing is saved. The scout's list is D7's checklist, and B10's reviewer gets it as attack cases.
- **B7 breaks the fixtures.** 27 test files build lessons through the legacy lift. The unit moves the lift into the fixtures file first, runs `npm test`, and only then removes the path, so a failure names its cause.
- **B7 and the page meet in the same files.** `e2e/support.ts` and `e2e/site.spec.ts` are changed by B7, B9 and B10. B7 merges before B9 starts, or B9 starts from B7's branch.
- **A question's id changes later.** The stored key is a lesson's slug and a question's id. A renamed id drops that question from a reader's list without a word; the loss is small and the alternative (a migration table) is not worth building until an id is in fact renamed.
- **The page is heavy.** 40 questions carry about 120 feedback texts and their citations. It should sit far under 250 KB gzipped; the build's budget check says so, and B9 reports the figure.
- **The lesson's Practice and the page disagree.** Both draw a question. B9 uses the lesson's own component and marks wherever D6 allows, so one change reaches both.

## After this job

- **The revamp goes live** (the owner's: push, pull request, merge, deploy).
- **Networking Concepts' new lessons,** starting with a pilot of one (handbook §7).
- **Registry addresses that moved** (direction 2.35) and **About's sources box** (held: the owner's "Not now", 2026-11-12).
- The code for lessons of several units, exporting saved progress, the glossary (direction §3, "After the revamp").

## Not in this plan

- A new question, a changed question, or questions that belong to no lesson (the 2026-11-09 idea).
- A change to any lesson's words, steps or checked content.
- A change to the Lesson page's layout, or to Home beyond what the shared header and footer bring.
- About's sources box, and the three source addresses that moved.
- Anything that leaves this machine.
