# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947 and its second (the glossary in the lessons' own words) at 93b5b4f.

**Status: re-planned a second time, waiting for the owner's go** (2026-11-13). At the design gate for the glossary in the lessons' own words (D8) the owner asked for real definitions: "Going over these glossary terms I feel like we need to make major adjustments to terms", with Ping ("The tool that sends those") and IP address as the examples, and then: "Yes, replan the glossary and also if these are the definitions used in the lessons we need to revisit well". D8 was not approved. The go approves the fourteen decisions below (direction 2.39).

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
