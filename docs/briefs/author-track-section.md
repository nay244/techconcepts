# Your lesson's section of the track's report

Your lesson has passed its fact-check. The owner reads one report of every changed sentence of the six lessons of batches 3 and 4. Write your lesson's section of it now, while you know each change's reason.

- Write it to `<the main folder>/.superpowers/track-report/<slug>.md` (your prompt gives the full path). That folder is outside git; commit nothing for it.
- Compare the lesson as it was (`git show revamp:src/content/lessons/<slug>.ts`) with the lesson as it passed (the file in your worktree at its last commit).
- The form is `docs/lesson-changes/what-is-icmp.md`, one level down, since yours is a section: start with `## <Lesson title>`, then a paragraph (sources before and after, the date it passed, on which check), then `### The changes to look at first` (the few a reader should see, in plain words), `### Corrections`, `### Removed`, `### Added`, `### Reworded, same meaning` (tables: #, where, before, after, source and section), `### What the checker passed as a simplification` (every `Note:` line of the passing report, `docs/fact-checks/<slug>.md` in your worktree, on an item it passed, with the item), and `### Counts`.
- **Quote exactly.** Every "before" is found word for word in the old file and every "after" in the new one; a script will check each. Where a sentence was changed in part, quote the whole sentence both times.
- A correction is a change to something false or unsourced; a rewording keeps the meaning. Count each sentence once.

Reply with the counts and the path.
