# The author's brief: one lesson to the cited shape

Your standing instructions (`.claude/agents/author.md`) hold. This file adds what the jobs so far have settled; your prompt names the lesson, its worktree and its branch.

## Where you work

- Only in the worktree your prompt names. Every path below is inside it. `node_modules` is linked. Run no dev server and no end-to-end spec.
- Commit on the worktree's branch only. Never push, never touch another branch.
- **Run no formatter** on any file. Change only the lines your change needs; keep the file's layout as you found it.

## What you write from

- The analyst's report: `<the main folder>/.superpowers/analysis/<slug>/report.md` (your prompt gives the full path). It has a row for every idea in the lesson, with the source, the deepest section, the quoted passage and a verdict, and at its end a section **"Rulings"** from the orchestrator. **A ruling wins over a row** where they differ.
- The analyst's saved sources are in the `sources/` folder beside the report, under the ids that are registered. The analyst's quoted passages were found in those files by script, so you need not read those passages again. **Read for yourself every section you cite that the report does not quote**, from the saved file, or fetched from the publisher into the same folder if it is not there.
- The batch's documents are registered in `src/content/sources.ts` already. Add an entry only for a document the analyst missed, and say so in your report.

## What must stay

- **The lesson's shape:** its Watch steps and their order, every event, every table and row, the scene (title, labels, parties, layers, start), and the two questions with their option counts and answers. Tests and saved progress rest on them. If a source would add, remove or reorder a step or an event, or change a mark on the figure beyond what the rulings say, **stop and report it**; do not decide it.
- **Words a test holds** (step titles, pattern names, table cells, parties, scene title and labels, and any pointer to another lesson such as "The TLS/SSL lesson covers the handshake.") stay word for word unless a ruling changes them.
- Verdict **stays** means word for word, cited to the section given. Do not tighten it.
- A **shared idea** (the rulings list them) uses the ruled words and citations exactly: two other lessons are using the same ones.

## Which files you change

- The lesson's file: `defineLesson`, in the form of `src/content/lessons/what-is-icmp.ts` and `what-is-dhcp.ts` (the newest checked tour lessons; read one whole).
- `src/content/legacy.ts`: your slug's line goes. `src/content/legacy.test.ts`: the count in the title and your unit id in the filter.
- `src/content/tracks/how-the-internet-works.test.ts`: only your lesson's rows, and only where your change makes one false.
- `src/content/sources.ts` and `sources.test.ts`: only for a document the analyst missed.
- **Never:** Home's files (`src/lib/home*`, `src/pages/`), `e2e/`, `src/art/`, `src/scenes/`, another lesson's file or rows, any file under `docs/` (the fact-checker alone writes the report). If one of these must change for your lesson to be true, stop and report it.

## Before you hand over

- The six-fault sweep of your standing instructions, item by item on the printed claim sheet. The two tests the checker applies, which the analyst will apply to your sheet next:
  1. **A traced item** (a step's text, a fact, an event, a log field, a status): everything it shows, each protocol, port, command, reply code, term and condition, is stated by a Learn part on its own `traces` list.
  2. **A claim:** every part of it, each item of a list included, is in a quoted passage of a document that defines the thing, or in passages of two publishers. No vendor page carries the defining marker.
- `npm run fact-check -- <slug>` prints the sheet with no error; `npx astro check` reports no error. `npm test` cannot be green yet (no passing report): run it and say which tests fail and why each is expected.
- Commit. Then report as your standing instructions say: every reader-visible sentence you changed (before, after, source and section), sources added, doubts (each with the passage you relied on), overrides (there should be none: a limit is met by trimming), and the commit.

Keep your working notes: after the lesson passes its check you will be asked for its section of the track's report of changed sentences.

## What batch 3 taught (added for batch 4)

- **A new Learn fact goes at the end of `learn.facts`.** Sheet keys go by position; a later fix can then be re-checked without every other fact counting as changed.
- **The unit's full name needs a Learn part.** The unit's own `backing` shows the protocol's full name and its purpose line: a Learn part on its traces must state the expansion (a fact "Stands for": the full name, citing the standard's title or abstract) and another must state the purpose in so many words. Two of three first checks failed on this.
- **Read each traced item clause by clause against the exact words of the parts it traces.** The other failures were: an Overview fact saying a thing is kept on the server, traced to parts that say it of something else; a step's narrative naming an idea or a contrast no Learn part states; a port number in a cited sentence that is in the document but not in the cited sections.
- **To run the tests that hold your lesson's words before a report exists:** `npx vitest run --mode development` (the gate only warns there). Only `src/lib/checked.test.ts` should fail. Other heavy jobs may be running on this machine: if a playback or animation test fails once, run that file again alone before believing it.
