# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, and job 9's first plan, the Practice page, at 8fd2947.

**Status: the owner said go on the re-plan** (2026-11-13, "Go", on the plan as shown), which approves the twelve decisions below. D8 and A1 are under way; the build waits for the design gate. At the design gate for the Practice page the owner changed the page: "Let's turn the practice page into a simple glossary. This page will contain concept terms used in the Tracks." The Practice page's designs (D6, D7) were not approved and are set aside. (Direction 2.38.)

## Inputs

| | |
|---|---|
| **The job** | Job 9, Phase 5, as the owner now sets it: a **simple Glossary page** of the concept terms the tracks' lessons teach. With it, as before, the removal of the legacy path as a build unit of its own with no design. |
| **Done means** | A reader can open `/glossary` from every page's header and footer, find any term a ready lesson teaches, read it in that lesson's own checked words, and go to the lesson. The page works with JavaScript off. No word on it is new lesson content. The legacy path is gone and `npm test` skips nothing. The page matches its approved prototype at 375px and 1440px in both themes. `npm test`, `npm run build` and the full `npm run e2e` pass on `revamp`, with their output in `team.md`. Nothing is pushed. |
| **Budget** | Not set by the owner. The estimate is 1.4 to 2.1 million subagent tokens after the go (below); the stops are under "When the work stops for the owner". |
| **Design refs** | `docs/direction.md` §6 (Patch), §7 (Learn's terms, the marks), §8, §9 to §11; `src/styles/tokens.ts`; `src/lesson/Explanation.tsx:303-310` and its styles (a term as a lesson draws it today); `prototypes/d7-practice-site.md` §2 (the header with five links and the menu from 960px down: measured there, to be measured again for the new word); the standing rules for words in `.claude/agents/designer.md`. |

## What is in the repo (the orchestrator's own look, 2026-11-13; S10 is `prototypes/s10-job-9-facts.md`)

- **Every lesson already teaches named terms.** Learn's `terms` (`src/content/schema.ts:332-338`) are `{ id, idea, name, cite }`: "everyday idea first, then its name". The 18 ready lessons hold **152 terms, 135 different names**, 6 to 10 a lesson. Each is cited, is a row of its lesson's claim sheet, and has passed its lesson's fact-check. An idea runs from 6 to 104 characters, 36 in the middle.
- **Fourteen names are taught by more than one lesson, most in different words**, because each lesson says what the term means in its own story: TTL is "How long an answer may be kept: its time to live" in DNS and "The hop counter that stops loops" in IP; "IP address" is taught by four lessons; "User, pass" is "Log in" in both FTP and POP3.
- **Some ideas lean on their lesson.** "Discover" in What is DHCP is "“Can anyone give me an address?”"; "Offer" is "“You can have this one”". They are true where the lesson says them and thin on their own.
- **A fuller glossary is already provided for, and is empty.** `defineGlossary` (`src/content/glossary.ts`, `docs/content-model.md` §6) holds entries with definitions written and cited for the glossary itself. None exists, and the build refuses any until a fact-check path is built for that kind (direction 2.16). Direction §3 lists "the glossary and concept links" for after the revamp.
- **Routes, header and footer** are as S10 found them. D7 measured that five header links with "Start learning" need 912px, so the menu button must take over below 960px.
- **The legacy path** is as S10 found it; nothing about it changes with this re-plan.

## Decisions in this plan (the go approves them)

1. **(owner, 2026-11-13) The page of Phase 5 is a simple glossary, not the Practice page.** The standalone Practice page and the list of missed questions are not built in this job. D6 and D7 stay in `prototypes/` as designs that were not approved, for the day the owner reopens them. The lessons' own Practice stays exactly as it is, and so does every sentence that says nothing is scored or saved: all of them stay true.
2. **The glossary shows the terms the lessons teach, in the lessons' words.** The page reads every ready lesson's Learn terms from the registry when the site is built: the name, the idea, the lesson it is from and that lesson's citations. It keeps no copy and changes no word. So every sentence on it has already passed a fact-check, and the accuracy rule is met without a new kind of check. This is what "simple" buys. The other way, definitions written for the glossary, needs the fact-check path of 2.16 built first and an analyst, an author and a fact-checker for 135 entries; it stays where direction §3 has it, after the revamp.
3. **Every idea is shown with the lesson that says it,** and leads to that lesson's Learn part. A term that several lessons teach is one entry that gives each lesson's words under that lesson's name; where two lessons use the same words, the words show once with both lessons named. The page never calls an idea a definition: its own words say that each term is given as its lesson puts it.
4. **A read of the terms out of their lessons, before anything is built** (unit A1). An idea was checked inside its lesson. On a glossary page it stands with only its name and its lesson's title beside it. An `analyst` reads all 152 as the page will show them and lists any that would leave a beginner believing something false when read that way. A listed term comes to the owner with the choices (leave it, or change the lesson's own words through that lesson's re-check, which is a job of its own); the page never rewords a term and never leaves one out on its own judgment.
5. **The page is `/glossary`, linked as "Glossary" from the header and the footer of every page.** The design says where the link sits and confirms the width at which the menu button takes over.
6. **No script is needed, and none is added for the page's content.** The terms are in the page's HTML, in A to Z order, with a way to jump to a letter. There is no search box: the site has no site search (direction 2.10), and the browser's own find-in-page reaches every term because nothing is folded away.
7. **No saved state.** The page reads no progress and stores nothing. About's table of what the site remembers does not change.
8. **The Lesson page does not change.** Turning the terms in a lesson's words into links to the glossary is "concept links", which stays after the revamp.
9. **One design unit, D8,** with a prototype and a spec: the Glossary page at 375px and 1440px in both themes, with the header and footer carrying the new link, shown on the other page types too. At most two variants. The design's questions to settle: how an entry reads (the name, then each lesson's idea); how a term with four lessons reads beside a term with one; the A to Z jump on a phone; whether the lesson's source marks show beside an idea or the link to the lesson is enough; whether the tracks show (a term's lesson belongs to a track; DHCP is a lesson in both); the page's heading and opening words, which must not promise definitions.
10. **The legacy path goes, in a unit of its own (B7), with no design,** exactly as job 9's first plan set it. Out: `src/content/legacy.ts` and its test, `helpers/tour.ts`, the `origin` field and every branch on it, the tests that exist only for the legacy path, the four skipped unit tests, the three that pass on an empty list (removed, or rewritten over the ready lessons), the skipped end-to-end test, and the legacy list's part in `e2e/support.ts` and `e2e/global-setup.ts`; `docs/content-model.md` §4 and the handbook's §2 say so. Three things stay: the stamp's "Not checked yet" state with its tests, which a lesson being written shows in `astro dev`; the code for lessons of several units; and `LEGACY_PROGRESS_KEY`, the v1 progress record. The fixtures' terse shape and its lift move into `src/content/test-fixtures.ts` as test-only code under names with no "legacy" in them.
11. **Models.** The owner's word for Fable ("Have Fable 5.2 design and plan out our practice page", 2026-11-12) was for planning and designing this page. The owner changed the page's subject in the same session, which runs on Fable 5.2, so this plan and D8 are made on Fable 5.2 too; the owner can say otherwise at the go. Everything else keeps its usual model: `analyst` and `reviewer` on Opus, `builder` on Sonnet, and the build's orchestrator on Opus 5.5 in a fresh session. This session ends at the design gate.
12. **Order.** At the go: D8 (this session) and A1 side by side, since A1 reads only the lessons. B7 needs no design and may start at the go in a session on Opus 5.5, in its own worktree. After the owner approves D8: B8, the glossary's list and its page, one unit, from B7's branch or after B7 has merged, because both change `e2e/support.ts` and `e2e/site.spec.ts`. Each build unit has a spec review first; B7's cases are saved under its unit here and B8's in `prototypes/d8-cases.md`. The ledger is short, every agent replies in 150 words or fewer, and at most three heavy agents run at once.

## Units

| Unit | Phase | Owner (model) | What | Implements | Check |
|---|---|---|---|---|---|
| S10 | scout | scout (Haiku) | Routes, header and footer, the legacy path and the end-to-end specs each touches. Done; its Practice sections are no longer needed. | | Every fact has a `path:line`. |
| D6, D7 | design | designer (Fable 5.2) | The Practice page and what the rest of the site would change for it. Made and shown; **not approved, set aside** (decision 1). | | |
| D8 | design | designer (Fable 5.2) | **The Glossary page:** `prototypes/d8-glossary.html` and `.md`. Every one of the 152 terms, printed from the registry. States: the whole list; a term taught by one lesson, by two in different words, by two in the same words, by four; the jump to a letter; a letter with no term; JavaScript off (the same page). The header and footer with the new link on each page type, at 375, 768, 960 and 1440. Decisions 2, 3 and 5 to 9. | | Opened in the browser at 375 and 1440 in both themes; no sideways scroll; the spec's acceptance checks can each be tried on the prototype. |
| A1 | check | analyst (Opus) | **The terms read out of their lessons** (decision 4): all 152, each as name, idea and lesson title; a list of any that would leave a beginner believing something false, with the reason and the source. Changes no file but its report, `docs/glossary-read.md`. | | Every one of the 152 has a verdict; each listed term names what a beginner would wrongly believe. |
| Gate | | the owner | D8's prototype and spec, with A1's list. Approval freezes the design. | | |
| B7 | build | builder (Sonnet), spec review and build review by reviewer (Opus) | **Remove the legacy path** (decision 10). No design. Worktree `.superpowers/wt/b7-legacy`, branch `b7/legacy`, `E2E_PORT=4481`. | none | `grep -rni legacy src e2e scripts` finds only the v1 progress key's lines. `npm test` passes with **no skipped test**; every test removed is named in the report with the reason. `npx astro check` clean; `npm run build`; `e2e/site.spec.ts` and `e2e/lesson.spec.ts` pass on the unit's port. A lesson with no report still shows "Not checked yet" in a development-mode test and still fails a build-mode one. |
| B8 | build | builder (Sonnet), reviews by reviewer (Opus) | **The glossary:** a pure, build-time list (every ready lesson's terms, joined by name without regard to case, A to Z, each idea with its lesson, the lesson's Learn address and its source numbers); `src/pages/glossary.astro` as D8 draws it; the header and footer link and the `current` value for it; `/glossary` in the end-to-end page list; `e2e/glossary.spec.ts`; the header checks in `e2e/site.spec.ts`. | D8 | Matches the prototype at 375 and 1440 in both themes; each acceptance check and attack case is a test, among them that every term of every ready lesson is on the page word for word and that the page shows the same with JavaScript off; `npm test`; `npm run build` within the page budget; `e2e/glossary.spec.ts` and `e2e/site.spec.ts` pass on the unit's port. |
| F9 | end | orchestrator (Opus 5.5) | Merge each passed unit into `revamp`; then `npm test`, `npm run build` and the full `npm run e2e` in the background, lid open. The ledger, the direction document's Phase 5 status, the errata from the spec reviews for the owner. | | The three outputs are in `team.md`. |

## Estimate

| Role | Model | Units | Tokens (growth), roughly |
|---|---|---|---|
| scout | Haiku | S10 | 246,512 (spent) |
| designer | Fable 5.2 | D6, D7 (set aside) | 410,922 (spent; 16.6 million read in all) |
| designer | Fable 5.2 | D8 | 250,000 to 400,000 |
| analyst | Opus | A1 | 150,000 to 250,000 |
| reviewer | Opus | two spec reviews, two build reviews | 350,000 to 500,000 |
| builder | Sonnet | B7, B8, with fixes | 650,000 to 950,000 |

That is 1.4 to 2.1 million after the go, about a million under the Practice plan: one page with no script and no saved state, one design unit, one build unit beside B7.

## When the work stops for the owner

- **The design gate:** D8 and A1's list shown, nothing built from them until the owner approves.
- A term A1 lists as misleading out of its lesson (decision 4).
- A design change after approval.
- A design or a build that needs a lesson's words changed.
- The job passes 3.0 million subagent tokens after the go.
- Anything the owner keeps (`CLAUDE.md`, Ownership).

A unit that fails two build reviews comes back to the orchestrator with both reports. Everything else the orchestrator decides, records in the direction document and reports with the job's result.

## What could go wrong

- **An idea reads wrong without its lesson.** A1 exists for this, and decision 3 keeps the lesson's name beside every idea. If many terms are listed, the simple glossary is the wrong tool and the owner hears that before anything is built.
- **The page is taken for a dictionary.** "IP address: Where to send it: the server's number" is how the HTTP lesson puts it, not a definition. The page's opening words say what a reader is looking at, and D8's spec holds them.
- **A term's name is not a concept.** "User, pass" and "Discover" are message names; the lessons teach them as terms, so they are on the page. Choosing which of the 152 "count" would be an editorial list to keep in step by hand; the page shows what the lessons teach.
- **B7 breaks the fixtures.** 27 test files build lessons through the legacy lift. The unit moves the lift into the fixtures file first, runs `npm test`, and only then removes the path.
- **B7 and B8 meet in the same end-to-end files.** B7 merges first, or B8 starts from B7's branch.
- **The header at mid widths.** Five links do not fit beside "Start learning" under about 912px. D8 measures it with the word "Glossary" and sets the menu's breakpoint for every page.
- **Two lessons named DHCP.** Networking Concepts and How the Internet Works each have one; an entry that names only "DHCP" twice tells the reader nothing. D8 settles how a lesson is named when its title is not enough.

## After this job

- **The revamp goes live** (the owner's: push, pull request, merge, deploy).
- **Networking Concepts' new lessons,** starting with a pilot of one (handbook §7). Each new lesson's terms reach the glossary by themselves when it is ready.
- **Held, for the owner to reopen:** the standalone Practice page and the list of missed questions (D6 and D7 are its designs); a glossary with its own cited definitions, and concept links from a lesson's words to it; About's sources box; the registry addresses that moved.
- The code for lessons of several units, exporting saved progress (direction §3, "After the revamp").

## Not in this plan

- The Practice page, the missed list, or any change to a lesson's Practice or to About's words about it.
- A new or reworded term, a definition written for the glossary, or anything in `src/content/glossary.ts`.
- Links from lesson words to the glossary; a search box.
- A change to the Lesson page.
- Anything that leaves this machine.
