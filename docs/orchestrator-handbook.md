# The orchestrator's handbook

Written 2026-11-12 by the session that ran job 7, for the orchestrator that takes over. Read `CLAUDE.md` first (its rules win over this file), then `docs/direction.md`, then this.

## 1. Who does what, and on which model

**The owner's rule, 2026-11-12:** "Opus 5.5 will be the new orchestrator and take over tasks previously done by the Fable model. Going forward no tasks should be done on the Fable model unless given permission."

- The main session, the orchestrator, runs on **Opus 5.5** (`claude-opus-5-5`). It plans, rules, hands out, checks and merges.
- Subagents keep the models in `.claude/agents/`: `scout` Haiku; `author` and `builder` Sonnet; `analyst`, `fact-checker` and `reviewer` Opus. `designer` inherits the orchestrator's model, so it is Opus now.
- Start no session and no agent on Fable, and pass no Fable model id, unless the owner says so for that task.
- The usage limit is shared. Job 7 reached it with six agents at once. Run **three heavy agents at a time** (analysts or fact-checkers), and tell every agent to write its report file in parts so a stop loses nothing. An agent stopped by the limit goes on from where it stopped when it is sent a message after the reset.

## 2. Where the project stands

- Phase 4 (every lesson cited and fact-checked) is done (2026-11-12, job 8): all of How the Internet Works and Networking's DHCP, Subnetting and Firewalls are checked, and the legacy list (`src/content/legacy.ts`) is empty. Its path is dead code, to remove in a unit of its own (`plan.md`, "After this job").
- Then Phase 5 (a Glossary of written, fact-checked definitions since 2026-11-13, direction 2.39, begun as a pilot; `plan.md`. It was the Practice page, now held), then "After the revamp" in `docs/direction.md` §3: Networking Concepts' 15 lessons still to write, CompTIA A+, the glossary.
- Everything is on branch `revamp`, local. **Nothing is pushed**; push, pull request, merge to `main` and deploy are the owner's.
- `plan.md` holds the last plan (job 7, done) and is the form to follow. `team.md` is the ledger; each job ends with "What to do differently next time". Read job 7's.

## 3. How a job runs

1. **A fresh session per plan, and per batch of three lessons** (section 6a says why). Read `CLAUDE.md`, this file, the phase's status in `docs/direction.md` §3 and the decisions this file names, `plan.md`, and `docs/content-model.md` §8. Open `team.md` only for the last job's "What to do differently next time"; this file already carries the earlier jobs' lessons.
2. **Scout first** (Haiku), before the plan: sizes of each lesson, its documents and whether they are registered, what tests and pages rest on its words and shape, what it shares with checked lessons, where branches collide. The form is `prototypes/s8-batch-4-facts.md`. Have it write its report to a file and save that in `prototypes/`.
3. **Write the plan** in `plan.md` (inputs, what the scout found, decisions, units, estimate, stops, what could go wrong), record it in `docs/direction.md`, start the job in `team.md`, commit on `revamp`, show the owner, **wait for the go**.
4. Carry it out (section 4), keep the ledger as units finish, and end with `npm test`, `npm run build` and the full `npm run e2e` on `revamp`.

Stops for the owner, as job 7 set them: a lesson past 1.6 million subagent tokens without an all-pass; a batch of three past 4.0 million; a claim that fails three checks; a Watch step whose story no allowed source backs; anything `CLAUDE.md` says the owner keeps. Everything else you decide, record in the direction doc, and report with the job's result.

## 4. Moving a lesson to the cited shape (three lessons side by side)

The briefs are in `docs/briefs/`; give each agent the path, plus a short prompt saying what is special about its lesson.

| Step | Who | Brief | Done when |
|---|---|---|---|
| a. Every idea the lesson teaches, with source, section, quoted passage and a verdict | `analyst`, one a lesson | `docs/briefs/analyst-report.md` | The report is in `.superpowers/analysis/<slug>/report.md` with its sources beside it; every passage found by script |
| b. Rulings | orchestrator | — | Each open question answered, written into the report's last section "Rulings" by the analyst; recorded in `docs/direction.md` |
| c. Registry | orchestrator | — | The batch's documents and any new host are in `src/content/sources.ts` and `sources.test.ts`, one commit on the batch's branch; `npm test` passes |
| d. The lesson | `author`, in its worktree | `docs/briefs/author-lesson.md` | The claim sheet prints; `npx astro check` clean; `npx vitest run --mode development` fails only `src/lib/checked.test.ts` |
| e. The read before the check | the lesson's analyst, continued | `docs/briefs/analyst-read-before-check.md` | Numbered rulings with exact words and citations; the author applies them |
| f. The fact-check | a fresh `fact-checker` | none: see below | `npm run fact-check -- <slug> --check` prints `Report OK` |
| g. The lesson's section of the report of changed sentences | the author, continued | `docs/briefs/author-track-section.md` | Written to `.superpowers/track-report/<slug>.md` |
| h. Merge | orchestrator | — | Lesson into the batch's branch, `npm test` after each; the batch's branch into `revamp` once |

Details that matter:

- **Branches and folders.** `git worktree add .superpowers/wt/batch-N -b batch/N revamp`, then for each lesson `git worktree add .superpowers/wt/<slug> -b lesson/<slug> batch/N`, and link `node_modules` into each. Keep the main folder on `revamp` and still while an end-to-end run is going. Remove a worktree once its lesson is merged and its author has written its section.
- **The fact-checker's prompt is exactly** `The lesson's slug: <slug>. Work in the folder: <the worktree's full path>` and nothing else. For a targeted re-check, put `Re-check. ` in front. It must never be told anything about the lesson.
- **After a check.** Verify with `--check` (or `--recheck --check`) yourself, run `npm test` in the worktree, commit the report. A failing report is committed as written before any fix. A near-pass (at most 3 items held back, none wrong) allows a targeted re-check of at most 12 items; `npm run fact-check -- <slug> --recheck` prints the sheet or refuses. More than 12 means a full check.
- **Fixes after a check.** When the checker's note names the fix (a trace, a few words), send it straight to the author. Otherwise the lesson's analyst rules it. To keep a re-check small: add a new Learn fact at the **end** of `learn.facts` and never widen a Learn part many items trace to.
- **A glossary group** runs the same steps (analyst brief `docs/briefs/analyst-glossary-group.md`, author brief `author-glossary-group.md`, the command `npm run fact-check -- glossary/<id>`). Its fact-checker's prompt is `The glossary group: <id>. Work in the folder: <path>`. Agents are loaded when a session starts: if `.claude/agents/` changed since, give the check to a general-purpose Opus agent told to follow `.claude/agents/fact-checker.md` from disk, then that line and nothing else (job 9).
- **Merging.** Three branches collide in `src/content/legacy.ts`, `legacy.test.ts`, the end of `sources.ts` and `sources.test.ts`. Print each conflict before resolving it, and keep each registry entry a separate object.
- **Reading a page yourself.** Some allowed sites refuse a command line (`www.cloudflare.com`, some Cisco and Baeldung pages). Read them in the built-in browser and put the exact passage and its heading in the rulings; the fact-checker reads them in the browser too.
- **Tokens.** An agent's figure is the size of its context. Where it was summarised, count from its transcript: `python3 scripts/team/tokens.py <transcript.jsonl>`. `scripts/team/registry_entries.py` pulls registry entries out of an analyst's report; `scripts/team/track_report.py <old-ref> <new-ref> <slug>...` checks the report sections' quotes against the lesson files and can join them (`--write <out> <intro>`).

## 5. What is settled (do not stop for these)

From `CLAUDE.md` and direction 2.23 to 2.32:

- A sentence true for a beginner in the ordinary case stays word for word; only what would leave a beginner believing something false changes. Keep the lesson's Watch words and grow Learn to carry them.
- A claim rests on one document that defines the thing, or on two publishers. No vendor page carries the defining marker. A product's or tool's own detail needs two publishers, or is reworded or cut. A source must be current: no drafts, no archived pages for retired products.
- Every phrase a Watch part shows must be stated by a Learn part on its traces, the unit's full name and its purpose line included.
- A lesson keeps its steps, events, tables, scene and questions. A mark on the figure changes only by your ruling: a page cue stays only where the story fetched what it draws.
- Message sizes with no source become a dash; example data (a file's own size, a made-up address) stays.
- An OSI badge names a layer only on two publishers' pages; otherwise it spans, unless a source the lesson cites places the protocol (then find the second publisher).
- A new host joins `SOURCE_HOSTS` when it is the publisher's own and no listed host states the idea; record why in the direction doc.
- One report of changed sentences at the end of a track, not one a lesson. `techconcepts.app` stays the example site where a lesson uses it.

## 6. What the last job cost, for estimates

A lesson of 110 to 150 claim-sheet items cost 0.77 to 1.23 million subagent tokens: analyst about half (report 290,000 to 410,000; the read before the check 75,000 to 195,000), author 230,000 to 290,000 plus 20,000 to 40,000 for its section, a full check 150,000 to 250,000, a re-check 30,000 to 65,000. A scout for three lessons is about 300,000 on Haiku.

## 6a. Where the tokens really go, and how to use fewer

**The ledger's figures are not usage.** A figure in `team.md` is the size an agent's context reached. Every request re-reads the whole context, so what an agent uses is its context summed over all its requests. `scripts/team/tokens.py <transcript>` prints both: "growth" (the ledger's figure) and "read in all". Job 7, measured from the transcripts:

| Role | Requests | Written | Re-read from cache | Ledger's figure |
|---|---|---|---|---|
| analyst (6, Opus) | 1,062 | 1.13 million | 185 million | 3.03 million |
| orchestrator (1) | 245 | 0.24 million | 114 million | not counted |
| author (6, Sonnet) | 293 | 0.41 million | 55 million | 1.64 million |
| fact-checker (12 runs, Opus) | 482 | 0.47 million | 52 million | 1.69 million |
| scout (2, Haiku) | 100 | 0.26 million | 15 million | 0.60 million |

About 420 million tokens were re-read from cache, 15 million written to it, and 2.5 million written as output. A cached re-read is charged at about a tenth of fresh input at API prices; how a subscription's usage limit weighs it is not visible from here.

**Writing the ledger cost about 9,200 tokens of the orchestrator's output in 15 writes: 3.9% of what it wrote, and far under 1% of the job.** Dropping it would save almost nothing. Keep it, and keep it short.

What saves most, in order:

1. **Analysts are 44% of the re-reading.** Each ran about 177 requests in one context that reached 370,000 tokens: the report, the rulings, the read before the check and the fixes. Earlier jobs kept one analyst going because a continued agent "spends less than a fresh one reading in"; that was judged by growth, the wrong measure. Batch 5 tried a fresh analyst for the read before the check on one lesson: it read more (7.45 million against 3.16 and 5.04) and its lesson was the only near-pass, so **keep the continued analyst for the read** (direction 2.36). Also tell analysts to search a saved source for the passage they need, not read it whole, and to do several commands in one request.
2. **One batch of three lessons a session** (the orchestrator is 27%). Its context grew from 82,000 to 734,000 tokens over two batches, and the second half of the session was 65% of its re-reading. A fresh session for batch 4 would have cut the orchestrator's total by roughly 40%. One plan and one go can still cover two batches.
3. **Ask every agent for a short reply:** the result, the counts, the path to its report file and its open questions, in 150 words or fewer. Job 7's 69 hand-backs came to about 105,000 tokens, each carried through every later request. Read from a report only the sections you must rule on.
4. **Read little at the start** (step 1 of section 3), and never read a whole lesson file, a whole report or a transcript yourself.
5. **One short ledger row a unit** (who, model, tries, both token figures, the result in a line), written when the unit ends. At the job's end add the totals by role and "What to do differently next time". Write the per-lesson cost table, the corrections table and the notes on simplifications only when the owner asks or a plan needs them.
6. **Say less while waiting.** A status line when something finishes is enough.

## 7. New lessons and new tracks

No new lesson has yet been written under this method; plan the first one as a pilot of one lesson, as Phase 4 began, and show the owner the plan. The same rules apply with these differences: there are no words to keep, so the analyst's report is an outline of what to teach with its sources, and the author writes from it (`docs/content-model.md` §3); anything new a reader sees on a screen (a scene, a figure, a layout) goes to `designer` and through the owner's design gate before it is built; glossary entries and objective mappings need a fact-check path built first (direction 2.16). Order of work is in `docs/direction.md` §3.

## 8. First task for the new orchestrator

Batch 5: `dhcp`, `subnetting`, `firewalls`. Networking's DHCP must agree with the checked What is DHCP (`docs/lesson-changes/what-is-dhcp.md` and that lesson's file). Note `src/content/factcheck/cli.defaults.test.ts` expects `dhcp` to be legacy, the About page reads `dhcp`'s sources, and each of the three has its own test file in `src/content/lessons/`. The comment in `src/content/legacy.ts` about the tour's fourteen lessons is out of date and goes with this job.
