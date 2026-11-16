# Plan, job 15

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. This file is job 15's plan and ledger while job 14 holds `plan.md` and writes `team.md` (direction 2.69). When job 14 closes, this plan moves into `plan.md` and its ledger rows into `team.md`.

# Job 15: the lesson's flow

**Status: D14 revised at the owner's word, back to the gate when done.** At the gate (2026-11-15) the owner said: "I like the idea of a one step a a time, however only keep \"Next Step\" and \"Next Lesson\", and \"Play All\"". The orchestrator reads it as variant A, with the controls' words cut to three: the forward button reads "Next step" at every slot inside the lesson (Overview, steps, the last step to Learn, Learn to Practice) and "Next lesson" at Practice; the play button reads "Play all" (from step 1) and "Pause" only while a run is going; "Watch step 1", "Go to Learn", "Go to Practice", "Replay step" and "Watch again" go. Variant B is dropped. The revised prototype comes back to the owner before the spec review; the owner's word goes into `docs/direction.md` as the next free row when this branch is merged into `revamp`. **The owner's go is given** (2026-11-15, direction 2.69): "Lesson flow", then "Design now". The design gate stays: D14 comes to the owner as a clickable prototype with its spec, and nothing is built until the owner approves one of its two Play variants. This plan covers what 2.69 sets and nothing more, so D14 starts without another go.

## Inputs

| | |
|---|---|
| **The job** | The Lesson page's flow, from the `impeccable critique` of 2026-11-15 (27 of 40): Play outruns reading, the primary button points back, the ending has no ending, a wrong answer reads as merely selected, the keys are invisible. Findings and the scout's facts: `prototypes/s17-lesson-flow-facts.md` (S17). |
| **Done means** | The owner has approved D14 (one Play variant, or neither); B17 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npm test`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass. HTTP's step 1 is not on screen for 2.8 s unasked; after the last step the primary button leads forward; Practice ends on Up next with Practice ticked; a wrong answer says so in words and an icon; the keys are named on screen. Nothing pushed. |
| **Budget** | 1.0 to 1.7 million subagent tokens of growth (estimate below). A stop for the owner at 2.0 million. |
| **References** | `docs/direction.md` 2.69, §6 (Patch), §7 (the Lesson page as built); `prototypes/s17-lesson-flow-facts.md`; the build spec's playback row (`docs/superpowers/specs/2026-11-05-techconcepts-redesign-build-design.md:41`, owner, 2026-11-05); `prototypes/d1-lesson-reading.md`, `d2-lesson-phone.md`, `d3-lesson-tablet.md`, `d7-practice-site.md` (the console's earlier specs); `src/engine/playback.ts`, `src/lesson/PlaybackControls.tsx`, `src/lesson/Explanation.tsx`, `src/lesson/Practice.tsx`, `src/lesson/console.css`, `src/lesson/useLessonShortcuts.ts`; `src/styles/tokens.ts`. |

## Decisions in this plan

1. **D14 is one designer, one file, two Play variants** (2.69). Variant **A**: Play plays the current step and stops on it; the primary button then reads "Next step"; after the last step it leads on to Learn; a separate "Play all" keeps today's run. Variant **B**: the run stays; the hold between steps is paced to each step's words and shown as a countdown the reader can stop. Each says what happens under reduced motion, at each of the four speeds, and when the reader moves by hand. Everything else in D14 is one design shared by both variants.
2. **What D14 also covers, one answer each:** a forward-facing primary button in place of "Replay" after the last step and "Watch again" in Learn and Practice, with replaying as a secondary action; the lesson's ending (a closing block, Practice marked done in the outline, Up next as the primary action) for all three end cases in `src/lesson/Explanation.tsx` (a next lesson, the track's last lesson, a following unit); a wrong answer that reads as wrong without an error colour (an icon, words, and a pointer to where Learn covers it; `console.css:1088` keeps the choice of no error colour); one line that names Space and the arrow keys; an answer for the Watch › Learn › Practice chips that look like buttons and are not.
3. **What stays** (the critique's "works"): the narration's voice, the stamp and the numbered sources, "Nothing is scored or saved", the phone's controls pinned in the thumb zone at 48px. The Lesson page stays close to its current design: restyle and relabel freely, rearrange only with a measured gain (direction §7 and the owner's rule of 2026-11-10).
4. **Earlier decisions.** The spec names, for each change, the decision it touches. Both variants reopen the owner's playback decision of 2026-11-05; it stands until the owner approves one. A change that touches another owner decision is shown as such at the gate.
5. **Lesson words are not changed.** The prototype copies the steps it shows from `src/content/` as they are (HTTP is the main example: its step 1 has 84 words). New interface words (button labels, the key line, the ending's words, the wrong answer's words) are the designer's; none states a fact about a protocol, so none goes to an analyst. If the ending's closing block would state a fact, it comes from the lesson's checked words.
6. **The `impeccable` skill does not make this design** (2.68): `designer` loads `frontend-design`. `impeccable critique` may be re-run on the built page after B17, not before.
7. **B17 waits for two things:** the owner's approval of D14, and job 14 merged into `revamp`. About a dozen test files pin the present run (S17 Part 2, item 9) and job 14 adds lesson specs that call `playToReplay` and friends; B17 updates them all once, after both.
8. **One spec review, one builder, one build review**, on a branch `job15/flow` cut from `revamp` after job 14's merge, in its own worktree with its own E2E port (4485). The builder keeps a progress file in parts so a stop loses nothing. Only the orchestrator numbers errata.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S17 | scout | scout (Haiku) | The playback code, controls, keys, ending, Practice, the decisions and the tests that pin them. Done (`prototypes/s17-lesson-flow-facts.md`, at `fa5db4a`). | Every fact has a `path:line`. |
| D14 | design | designer (Opus 5.5) | Decisions 1 to 5: `prototypes/d14-lesson-flow.html` (one self-contained clickable file, 375 and 1440, light and dark, variant switch A/B, playable through a whole lesson) and `prototypes/d14-lesson-flow.md` (the spec: each change with the decision it touches, every state and word, sizes, reduced motion, speeds, hand moves, the three end cases, acceptance checks). | The designer's own look at both sizes and themes, with before/after measurements; then the orchestrator plays each variant through a whole lesson at 375 and 1440 in both themes and records what it saw here. |
| **Gate** | design | **the owner** | Approves variant A, variant B, or neither. | The owner's words, recorded in the direction doc. |
| B17 spec | build | reviewer (Opus) | Holes and attack cases for `d14-lesson-flow.md` with the approved variant: `prototypes/d14-cases.md`. | Holes with one right answer closed as errata; taste goes back to `designer`. |
| B17 | build | builder (Sonnet) | The approved D14 in `src/engine/playback.ts`, `src/lesson/*` and the tests and specs that pin the present run (S17 item 9 and job 14's). | Each case a test; `npm test`; `npm run build`; `e2e/lesson.spec.ts`, `reading.spec.ts`, `site.spec.ts` and the lesson specs at d1440-dark and phone. |
| B17 review | build | reviewer (Opus) | The diff against the spec, the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F15 | end | orchestrator | `job15/flow` into `revamp`; CI's end-to-end pass; the ledger into `team.md`, the direction row, the owner's result with errata. | `npm test`, `npm run build`, CI's e2e pass on `revamp`. |

Order: D14; the orchestrator's look; **the gate**; (job 14 merged); the spec review; B17; its review; F15.

## Estimate

From jobs 12 to 14: a designer's clickable prototype of three scenes cost 0.19 to 0.29 million each in job 14 and 0.72 million for one designer in job 13; a spec review 0.1 to 0.2 million; a builder 0.3 to 0.6 million.

| Part | Growth, roughly |
|---|---|
| D14: one designer, two variants, the ending, Practice, keys | 0.3 to 0.5 million |
| B17 spec review | 0.1 to 0.2 million |
| B17: the engine, the controls, the ending, Practice, a dozen test files | 0.45 to 0.75 million |
| B17 review, and the fixes | 0.15 to 0.25 million |
| **Total** | **1.0 to 1.7 million** |

## When the work stops for the owner

- **The design gate**, after D14 and the orchestrator's look.
- A change D14 needs that touches an owner decision beyond the playback row of 2026-11-05.
- The job past 2.0 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps: push, merge to `main`, deploy, sign-ins, installs.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **Variant B's pacing has no honest number.** Reading speed varies; a countdown paced at 200 words a minute is too slow for some and still too fast for others. The countdown must be stoppable and its pace visible, or B only hides the problem.
- **Variant A changes what Play means** to every reader who learned it. The label must say what it does ("Play step", "Play all"), and Space must do one thing that the key line names.
- **The phone's control row has no room.** Back, Play, Next and speed fill 375px at 48px; a fifth control (Play all, or a countdown's stop) must fit or fold.
- **The ending crowds the Practice column** on a phone, where the words already scroll inside a tab.
- **Tests pin the present labels in a dozen files** (S17 item 9), and job 14 adds more; B17 updates them only after job 14's merge.
- **Reduced motion.** Today a run keeps its pace under reduced motion (`playback.ts:143-144`); each variant states what it does there.

## Not in this job

The phone figures' legibility and Subnetting's hidden bits board (the critique's second group), every other page, and any change under `src/` before the gate.

# Ledger

| Unit | Who (model) | Tries | Growth | Result |
|---|---|---|---|---|
| S17 | scout (Haiku), in the session that ran the critique | 1 | not counted here | Facts saved at `fa5db4a`. |
| D14 | designer (Opus 5.5) | 1 (stopped once by the usage limit, continued with its context) | 347,229 (the agent's reported total) | `prototypes/d14-lesson-flow.html` and `.md` (16 sections, 30 acceptance checks). Recommends A. HTTP step 1 at 1×: today 2.8 s; A waits for the reader (Play all 2.7 s); B 22.1 s, a countdown from 21 s. Phone bar stays four controls at 48px, the forward button 183×48 where › was. Open for the owner: `see` pointers on every question (an author's task), three lessons' idle words that say "Press Play", A's Play all at B's pace. |
| D14 look | orchestrator (Opus 5.5) | 1 | not counted | Played headless (Playwright, `file://`) at 1440×900 and 375×812, light and dark, both variants: Overview, five steps by the forward button, Learn, Practice, one right and one wrong answer, the end. No page errors, no sideways scroll in any of the eight runs. Forward button at each slot as the spec's §3 table (A: Watch step 1, Next step ×4, Go to Learn, Go to Practice, Next lesson; B: Play the steps, then the same with a countdown). A: step 1 still on screen 8 s after arriving, nothing moved. B: step 1's countdown ran 21 s to 1 s, one second a second, then step 2 started at 17 s. Wrong answer: ✕ "Not this one" on the option with a hatch, ✕ before "Not quite.", "Back to Learn: Status code"; right keeps its green with ✓ "Right". Practice ticked in the outline once both questions had picks. The four end cases at 1440 dark read as the spec's §7 table; "Back to the track" shows twice at 1440 (block and bar) as specified, once on a phone. The key line shows in the log head at 1440. Feedback words match `what-is-http.ts`. |
