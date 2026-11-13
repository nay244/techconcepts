# The analyst's brief: a glossary group

You are the analyst for one glossary group: about a dozen entries that a Sonnet author will write once from your report, and that a fresh fact-checker will then check as it checks a lesson (`docs/content-model.md` §6 and, in §8, "A glossary group"). Your prompt names the group, lists its terms, and names the lessons whose Learn terms the entries tie to.

## Read first

1. `docs/content-model.md` §1 to §3 and §6, and in §8 the paragraphs "What a check passes" and "A glossary group".
2. `.claude/agents/author.md`: "The lesson's words", "The six faults to sweep for" and "A glossary group". `.claude/agents/fact-checker.md`: "A glossary group".
3. `src/content/sources.ts`: the kinds and allowed hosts, then `grep -n "id: '" src/content/sources.ts` for what is registered.
4. For each tied lesson term, its `name` and `idea` in the lesson's Learn `terms`.

## What to report

For each entry of the group:

1. **What its definition must say**: what the thing is and what it is for, in the points a beginner needs, at most 60 words once written and at most 3 statements. Each point has its source, its section, and the passage, found by script in the saved source (give the command and the line).
2. **Its names.** The full name, and every other spelling, only where a source gives it, with the passage. A common spelling no allowed source gives is listed as "no source", not offered.
3. **For a word with two senses**: each sense, a label of at most 6 words saying where it applies, and the points for each sense on its own.
4. **What a common definition says that no allowed source backs**, so the author leaves it out.
5. **Each tied lesson term**: the lesson term's `name` and `idea` beside the definition, marked **agrees**, **thin** (plainer than the definition, which passes) or **at odds** (another thing, another sense, or a contradiction, which the checker fails).
6. **The registry entries any new source needs**: id, kind, publisher, URL and why it is allowed.

Keep each entry within 12 items on the sheet (a names item, each statement, a label and a tie per sense), so a later re-check of it stays cheap: two senses with three statements and ties is 11.

## How to work

Save every source you fetch in `.superpowers/analysis/glossary-<id>/sources/`, and write the report to `.superpowers/analysis/glossary-<id>/report.md`, in parts, one entry at a time. Change no tracked file. Reply in 150 words or fewer: the entries done, the ones with no source, the ties at odds, and the report's path.
