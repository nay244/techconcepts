# The read before the check

The author has moved your lesson to the cited shape in its worktree. A fresh fact-checker, who has seen nothing but the lesson, will now judge every item on its claim sheet. Read the sheet first, exactly as that checker will, so the first check passes.

Your prompt gives the worktree's path and the author's doubts.

1. In the worktree, run `npm run fact-check -- <slug>` and read the whole sheet, item by item, against your saved sources (`.superpowers/analysis/<slug>/sources/` in the main folder). Read `.claude/agents/fact-checker.md` for how the checker judges, if you have not.
2. Judge **every item** by the checker's two tests:
   - **A traced item** (a step's text, a fact, an event, a log field, a status, an option's feedback): everything it shows, each protocol, port, command, reply code, term, number and condition, is stated by a Learn part on its own traces list, and it says no more and no less than that part.
   - **A claim** (an item that cites): every part of it, each item of a list included, is in a passage of the section it cites; it rests on a document that defines the thing, marked defining, or on two publishers; no vendor page carries the defining marker; the section named is the one that states it, not just the page.
   And by what a check passes (`docs/content-model.md` §8): true for a beginner in the ordinary case passes; a wrong cause, number, name, order or outcome, or an absolute that rules out something common, fails.
3. Rule on each of the author's doubts.
4. For every item that would not pass, write a **ruling**: the item's key from the sheet, what is wrong, and the exact fix: the new words, or the citation to add (source id, section, and the passage, found in your saved file), or the trace to add (the key of the Learn part), or the defining marker to remove. A ruling the author can apply without deciding anything.
5. Check the fixes do not break the lesson's shape or a shared wording the orchestrator ruled.

Append the rulings to your report under "Read before the check", check each new passage by script as before, and reply with: how many items are sound, the numbered rulings in full, and anything you want the orchestrator to decide. Change no tracked file.

## What batch 3's first checks failed on (check each of these by name)

Two of three lessons were a near-pass with three items each. Every one was of these kinds, and a read that had looked for them would have caught all six:

1. **The unit's full name.** The item `units[0].backing` shows the protocol's full name ("Simple Mail Transfer Protocol"). A Learn part on its traces must state that expansion. If none does, rule a new Learn fact ("Stands for": the full name, citing the standard's title or abstract), placed at the end of `learn.facts`.
2. **An Overview fact or a step that says a thing is kept, sent or listed somewhere**, when its traced parts say it only of something else ("folders are kept on the server" traced to parts about read marks; "the server lists what it can do" traced to parts that do not say the reply lists extensions). Read each traced item's every clause against the exact words of each part on its traces list.
3. **A step's narrative that explains by contrast or names an idea** ("without IDLE an app asks every few minutes", "that's push"): the contrast and the name each need a Learn part.
4. **A number or port in a cited sentence** ("Port 587 … STARTTLS") that is not in the passage of any section the item cites, though it is elsewhere in the same document. Check each number against the cited sections' own words.

## Since job 13 (check these too)

5. **Every `defining: true`.** Read what the document actually defines. A document that maps or uses a thing (RFC 894 maps IP's broadcast onto Ethernet's) does not define it: rule the marker off and name a second publisher.
6. **Every Go deeper sentence and every clause the author added** rests on a defining document or on two publishers. A clause on one publisher is ruled: a second publisher, or the clause cut.
7. **The absolutes in the facts most items trace to:** "every", "only", one range, one number. Rule "often", "usually" or the second range where the sources say so.

For a glossary group, run `npm run fact-check -- glossary/<id>` and read every item as the fact-checker will, ties included.
