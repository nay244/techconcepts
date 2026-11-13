# The author's brief: a glossary group

Write one glossary group, once, from the analyst's report (`.superpowers/analysis/glossary-<id>/report.md`) and the orchestrator's rulings in it. The group is the file `src/content/glossary-groups/<id>.ts`, whose default export is `defineGlossaryGroup({ id, entries })` from `../glossary-group` (a file name that is not the group's id, or an export not made with it, fails the build).

## Voice and rules

- Write in the lessons' voice: plain words a beginner reads easily, no claim wider than its source. Use the analyst's passages; where a source is more exact than a beginner needs, keep the plain word if it is true in the ordinary case (`.claude/agents/author.md`, "The lesson's words").
- Follow the rules in `docs/content-model.md` §6, all ten of them, and `.claude/agents/author.md`, "A glossary group". Sweep each statement for the six faults.
- A full name goes in `also` only where a cited statement of the entry gives it. A tie names a lesson term that means the same thing in the same sense; the lesson file is not changed, and a term the analyst marked "at odds" is not tied.
- Cite with `cite(source, section, { defining: true })` where a document defines the thing; otherwise two independent sources. Every source is in `SOURCES`; one the analyst says is missing is registered first by the orchestrator, not by you.
- Keep each entry within 12 items on the sheet.

## Done when

- `npm run fact-check -- glossary/<id>` prints the claim sheet (it runs every rule of the group and the ties).
- `npx astro check` is clean.
- `npx vitest run --mode development` fails only on the group's missing report (the gate asks for it).
- Committed on the branch, locally: `type: a sentence saying what is now true`, with the co-author line the history uses.

Your report lists every entry and every statement you wrote, with the source and section each rests on, every doubt, and the tail of each command.
