# Plan

How the work is divided is in `CLAUDE.md` (Team). The results are in `team.md`. The plan before this one (the Lesson page, Phase 2) is done; it is in this file's history at commit f419637.

**Status: the owner said go on 2026-11-11 ("Go with phase 3 plan as written"). The build units are running, in order.**

## Inputs

| | |
|---|---|
| **The job** | Phase 3 of the revamp (`docs/direction.md` §3): one fact-check path. Every passage a fact-check report quotes is confirmed, by a script, to be in the source it was read from; and the build refuses any cited content that has no current, passing report, whatever its kind. |
| **Done means** | The build fails for a report whose quotes have not been confirmed, and for a glossary entry or an objective mapping, which have no path yet. OSI Model's report passes the new gate. The changed fact-checker gives the canary lesson the verdicts it gave before. `npm test`, `npm run build` and `npm run e2e` pass on `revamp`, with their output in `team.md`. Nothing is pushed. |
| **Budget** | Not set by the owner. The orchestrator's estimate is about 1.5 million subagent tokens, none of it the designer's (table below). Two builder tries and two reviews per unit at most. |
| **Design refs** | No screen changes in this job. The references are `docs/content-model.md` §8 (the workflow), `.claude/agents/fact-checker.md`, and the fact-checker's design in `docs/superpowers/specs/2026-11-08-fact-checker-design.md`. |

## What the scout found (S2)

- One lesson is cited and checked: OSI Model. Its claim sheet already lists its Practice questions, and its report has a verdict for each. The other 17 lessons are legacy and exempt; Phase 4 moves them over one by one.
- The glossary has no entries and no page shows it. No objective mapping exists: both tracks are concept tracks.
- A report quotes its passages in prose under each claim, with the checker's own shorthand for the source ("X.200 6.1.2"). Nothing a script can tie to a source. The checker fetches each source into a temporary folder outside the repo and throws it away.

## Decisions in this plan (the orchestrator's; the go approves them)

1. **Glossary entries and objective mappings get a guard, not a path.** There is nothing of either kind to check, and a path built for content that does not exist could not be tried on anything. The build will refuse a glossary entry or an objective mapping outright, with a message saying its fact-check path is still to build. That meets the roadmap's bar (no cited content ships unchecked, whatever its kind) and leaves the path to the job that first needs it.
2. **Practice needs nothing new.** A cited lesson's questions are already on its claim sheet. A legacy lesson's are covered when Phase 4 cites the lesson.
3. **Quotes become data.** Under each claim the report lists its quotes in one fixed form: the source's id from the registry, the section, and the passage. A parser reads them.
4. **The quote check reads the checker's own fetched files.** The checker already saves each source as text. It will name each file by the source's id, and the script looks for every passage in the file for its source: whitespace, line-break hyphens and quote marks evened out, and a passage with an ellipsis matched as its parts in order. Sources are not committed: several are copyrighted and the repo is public.
5. **The gate checks a record, offline.** When every quote is found, the script writes a record into the report's header: the date, how many quotes, and a digest of them. The build needs that record, needs it to match the report's quotes, and needs every passing claim to have at least one quote. A quote edited afterwards breaks the digest.
6. **OSI Model's report is converted, not judged again.** Its quotes are rewritten into the new form with their words untouched, its six sources are fetched again, and the script checks them. A passage the script cannot find is reported to the orchestrator, not fixed. Only those claims would go back to a fact-checker.
7. **The canary proves the changed checker.** The fact-checker's instructions change (how to name its files, how to write quotes, to run the script). The canary lesson exists to test the checker: it is run again and must give the verdicts on record, 29 passing, 2 partial, 3 failing, now with confirmed quotes.

## The formats (the spec the build units share)

**A quote in a report.** Under a claim's heading (`### <key> — <verdict>`), each quote is a bullet naming the source and the section, then the passage as one or more quoted lines:

```
- `itu-x200` §6.1.2 (defining standard)
  > The Reference Model contains seven layers: a) the Application Layer (layer 7); … g) the Physical Layer (layer 1).
```

- The id in backticks is the source's id in the registry. The section follows `§` and runs to the end of the line or to an optional note in parentheses.
- The passage is every following line that starts with `>`, joined by spaces. `…` marks words left out.
- The source and section must be one of that item's own citations on the claim sheet.
- Any other bullet under a claim's heading must begin `Note:`. Anything else is a problem the parser names, so a badly written quote cannot pass as a comment.

**The record in the header**, written by the script and never by hand:

```
"quotes": { "checked": "2026-11-11", "count": 214, "digest": "<64 hex>", "files": { "itu-x200": "<64 hex>", "rfc-1122": "<64 hex>" } }
```

`digest` is the SHA-256 of the report's quotes in order (key, source, section, passage with its whitespace evened out). `files` is the SHA-256 of each source text the passages were found in.

**Finding a passage.** Both the passage and the source text are evened out the same way before the search: Unicode compatibility forms (so a ligature is its letters), every run of whitespace one space, soft hyphens removed, curly quotes and apostrophes straightened, every dash a hyphen. A word broken by a hyphen at a line's end is tried joined and unjoined. A passage with `…` is found when its parts are found in order. Letter case must match.

**Which items need a quote.** Every item of kind `claim` or `osi` whose verdict is passing needs at least one. Traced, example, analogy and unbacked items quote nothing.

## Units

There is no design phase: nothing a reader sees changes, and the formats and messages are specified here. Units run in this order, one at a time.

| Unit | Owner | What | Check, beside `npm test` and `npm run build` |
|---|---|---|---|
| S2 | scout | How fact-checking covers each kind of content today. Done. | Every fact has a `path:line`. |
| B1 | builder, reviewer | **Quotes as data.** The report's quote form and its parser (`src/content/factcheck/`): for each claim key, its quotes as source id, section and passage; a report whose quotes cannot be read gives named problems. The header takes an optional quote record. The fact-checker's instructions and `docs/content-model.md` §8 describe the new form and the file names. | Unit tests: a well-formed report parses to the expected quotes; each malformed case gives its message. The gate's behaviour is unchanged, so the build still passes with today's OSI Model report. |
| B2 | builder, reviewer | **The quote check.** `npm run fact-check -- <slug> --quotes <folder>`: looks for every passage in the file for its source, prints each one it cannot find with its claim key, and when all are found writes the record into the header. | Unit tests on fixture sources: a passage found across a line break, with a line-break hyphen, with curly quotes, with an ellipsis; a passage not found; a missing source file; a record written, and not written when one quote fails. |
| B3 | builder (one lower: Sonnet at its usual effort), orchestrator checks | **OSI Model's report in the new form.** Convert its quotes without changing a word, fetch its six sources into a temporary folder, run the quote check. | The script's output is in the report. The orchestrator compares the report before and after: verdicts, hash and every quoted passage unchanged. Passages not found are listed, not fixed. |
| B4 | builder, reviewer | **The gate and the guard.** The build fails for a cited lesson whose report has no quote record, a record that does not match its quotes, or a passing claim with no quote; and for any glossary entry or objective mapping. `docs/content-model.md` §8 and `docs/direction.md` say so. | Unit tests for each failure and its message, and for dev mode, which warns. The build passes with the converted OSI Model report. |
| B5 | fact-checker, orchestrator checks | **The canary, checked again** by the changed fact-checker, given its slug and nothing else. | Its verdicts are the ones on record: 29, 2 and 3. Its report is in the new form and the quote check passes on it. |
| Final | orchestrator | On `revamp` after the last merge. | `npm test`, `npm run build`, `npm run e2e`. |

B4 comes after B3 so the build never needs a record that OSI Model's report does not have yet.

## Estimate

| Role | Model | Units | Tokens, roughly |
|---|---|---|---|
| scout | Haiku | S2 | 120,000 |
| builder | Sonnet | B1, B2, B3, B4 | 650,000 |
| reviewer | Opus | B1, B2, B4 | 350,000 |
| fact-checker | Opus | B5 | 300,000 |

## What could go wrong

- **A quote in OSI Model's report is not in its source.** That is what this job is for. The claim goes to a fresh fact-checker, and if the lesson's words have to change, the lesson's whole check runs again (`docs/content-model.md` §8).
- **A source will not fetch as text** (the ITU standard is a PDF behind a redirect). The fact-checker fetched all six on 2026-11-08, so its own instructions say how; B3 follows them.
- **The canary's verdicts move.** Then the checker's new instructions changed its judgment, not only its form, and the instructions go back to B1.

## Not in this job

- A fact-check path for glossary entries or objective mappings (decision 1).
- Citing and checking the 17 legacy lessons: Phase 4.
- Anything that leaves this machine.
