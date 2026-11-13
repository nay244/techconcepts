# B9: the fact-check path for glossary entries (spec)

Written 2026-11-13 by the orchestrator (Opus 5.5) from `prototypes/s11-glossary-facts.md` (S11), for unit B9 of `plan.md` (decisions 6 to 8). No screen: nothing here is shown to a reader yet (B8 builds the page). Line numbers are S11's, from before B7; B7 changes `gate.ts`, `cli.ts` and `registry.ts`, so read the code as it is after B7.

The idea in one line: **a glossary group is checked exactly as a lesson is**, by the same claim sheet, hash, report, quote record, near-pass, re-check and gate; only what makes up its sheet, and three item kinds, are new. Every lesson's report passes as it is, byte for byte.

## 1. The group file

- A group is a file `src/content/glossary-groups/<group>.ts`; its default export is `defineGlossaryGroup({ id, entries })`. The file name is the group's `id` (a slug), as a lesson's file name is its slug. A file in a folder under `glossary-groups/`, or a test file, is not a group.
- `src/content/glossary.ts` loads every group with `import.meta.glob` (eager, as `registry.ts` loads lessons), checks the rules that span groups (section 2, "across the glossary") and exports `GLOSSARY_GROUPS` (the groups) and `GLOSSARY` (every entry of every group, in group then file order). With no group file, both are empty and valid.
- The old shape `{ id, term, definition }` with analogy statements goes: `defineGlossary` is replaced, and its tests are rewritten for the new rules or named as removed with the reason.

### An entry

```ts
// Invented example: no id, section or claim here is a checked citation.
{
  id: 'ttl',                          // slug, unique across the glossary
  term: 'TTL',                        // the name the page lists it under
  also: ['Time to Live'],             // other spellings, optional; a full name only where a cited statement gives it
  senses: [                           // either `definition` (one sense) or `senses` (two or more), never both
    { id: 'ip', label: 'In IP', definition: [ /* statements */ ], lessons: [{ lesson: 'what-is-ip', term: 'term-ttl' }] },
    { id: 'dns', label: 'In DNS', definition: [ /* statements */ ], lessons: [{ lesson: 'what-is-dns', term: 'term-ttl' }] },
  ],
}
// one sense: { id, term, also?, definition: [ ... ], lessons?: [ ... ] }
```

A statement is `{ id, text, cite }`, as a lesson's, but every statement cites: no `analogy` in a glossary entry (decision 6: "each cited under the two-source rule").

## 2. The rules (each one a test, and the build refuses a break with a message naming the group, the entry and the part)

In one group (`defineGlossaryGroup`, every issue reported at once, as `defineLesson` does):

1. The shape is strict: no unknown key. `id`, entry `id`, sense `id` and statement `id` are slugs.
2. An entry has exactly one of `definition` and `senses`; `senses` has at least 2 items.
3. A definition (an entry's, or each sense's) has **1 to 3 statements**.
4. Every statement cites, and follows the two-source rule (two independent sources, or one citation marked `defining`); every citation is one `cite()` builds, of a source in `SOURCES` that may back content (as `checkCitation(c, sources, 'content')`).
5. **Word limit: a definition is at most 60 words** (`GLOSSARY_DEFINITION_WORDS = 60`, one constant): the words of all its statements together, a word being a run of non-space characters. Each sense counts on its own. There is no override: a definition over the limit is trimmed (CLAUDE.md, "a limit is met by trimming"). The pilot may move the number once, recorded in the direction doc.
6. Text is plain: no `**` in a term, a spelling, a label or a statement.
7. A sense's `label` is at most 6 words; labels are unique in their entry, ignoring case. Sense ids are unique in their entry.
8. Statement ids are unique in the group. Entry ids are unique in the group.
9. A spelling in `also` is not the entry's own term, and an entry's `also` has no repeats, ignoring case.
10. `lessons`, where given, is a non-empty list of `{ lesson, term }` (both slugs), with no pair twice. An entry with `senses` carries `lessons` on its senses, never on itself.

Across the glossary (`glossary.ts`, at load):

11. Group ids, and entry ids, are unique across groups.
12. Every name (each entry's `term` and every `also`) is unique across the glossary, ignoring case and outer spaces.

Against the lessons (in `registry.ts`, after lessons load; through `refuseOrWarn`, so `astro dev` warns and the build and tests throw):

13. Each `{ lesson, term }` names a lesson in the registry and an id in that lesson's Learn `terms`.
14. A lesson's term is tied to at most one entry or sense across the glossary.

No lesson file changes for a tie, and a tie moves no lesson's claim-sheet hash: it is made from the glossary's side only.

## 3. The claim sheet of a group

`groupSheet(group, sources, lessons)` returns a `ClaimSheet` like `claimSheet`'s, with `slug` = `glossary/<group id>`, and its hash made by the same function from `{ slug, items, sources, overrides: [] }`. Keys name ids, not positions (an entry's place in the file, and a page sorted A to Z, mean nothing), in this form:

| Key | Kind | Content | Cites |
|---|---|---|---|
| `entry "<id>": names` | `unbacked` | the term, then each spelling in order | nothing |
| `entry "<id>": statement "<sid>"` | `claim` | the text, and its place in its definition (1, 2 or 3) | its citations |
| `entry "<id>": lessons` | `tie` (new) | each tied lesson term as `{ lesson, term, name, idea }`, in the order written | nothing |
| `entry "<id>", sense "<sid>": label` | `unbacked` | the label | nothing |
| `entry "<id>", sense "<sid>": statement "<sid>"` | `claim` | as above | its citations |
| `entry "<id>", sense "<sid>": lessons` | `tie` | as above | nothing |

- Items run entry by entry in file order: names, then (for one sense) statements and lessons, or (for senses) each sense's label, statements and lessons. An entry or sense with no `lessons` has no `lessons` item.
- `sources` is every cited source's registry entry, sorted by id, as for a lesson. Display-only settings stay out of the hash as `DISPLAY_ONLY` says.
- The tie's content holds the lesson term's `name` and `idea` as the lesson has them now, so changing a tied term's words in its lesson makes the group's report stale (its tie item changes). The lesson's title is not in it.
- The printed sheet (`renderSheet`) prints a `tie` item's lesson terms one a line: `` `<lesson>` term `<term>`: <name> — <idea> ``. It ends with `Write your report to: docs/fact-checks/glossary/<id>.md`.
- **Lessons' sheets are untouched**: adding the `tie` kind and `groupSheet` changes no byte of any lesson's items or hash.

## 4. The command

`npm run fact-check -- glossary/<id>` and every form a lesson has: `--check`, `--quotes <folder>`, `--stamp`, `--recheck`, `--recheck --quotes <folder>`, `--recheck --check`. Unknown group: `No glossary group "<id>".` The usage text and `scripts/fact-check.mjs`'s header name the form. A lesson slug works as before; no lesson slug may start with `glossary/` (it cannot: a slug has no `/`).

Report paths: `docs/fact-checks/glossary/<id>.md` and `docs/fact-checks/glossary/<id>.recheck.md` (`reportPath` and `recheckPath` of `glossary/<id>`). The report's header is a lesson report's header with `"slug": "glossary/<id>"` and `"overrides": []`; `--stamp` and the quote check write `items` and `limits` (the hash of `[]`) as for a lesson.

## 5. The gate

- The registry reads `docs/fact-checks/glossary/*.md` (not `*.recheck.md`) and `docs/fact-checks/glossary/*.recheck.md` by globs of their own, and checks every group through `checkReport`, or `checkPair` when a re-check is there, with its group sheet: every rule a lesson's report meets (missing, unreadable, other slug, stale hash, a missing or unknown key, a verdict not ✅, a source not listed or not current, the quote record and its rules, a passing cited item with no quote). A report or re-check in that folder with no group is refused, as a lesson's is.
- Messages that today say "lesson" for a lesson stay byte for byte; the same message for a group names the group (`glossary group "<id>"`).
- `checkUnpathedKinds` refuses objective mappings only; the glossary sentence of its refusal goes, and its glossary tests are rewritten: a glossary entry with a passing report builds; one with none, a stale one or a failing one fails a build-mode test.
- The lesson gate's own globs (`docs/fact-checks/*.md`, depth 1) do not change, and still never read `canary/` or `glossary/`.

## 6. The targeted re-check of a group

Near-pass and the cap of 12 are the lesson's. What a re-check judges: every item `matchItems` finds changed, plus **the whole entry** (every item whose key begins `entry "<id>"`) when any item of that entry changed or was taken out. The lesson rules (traces, questions, the unbacked items when a Learn part changed) do not apply to a group and must not fire on one; the entry rule must not fire on a lesson. A group adds no context section to the re-check sheet: an entry is judged whole.

## 7. The canary group

`src/content/factcheck/canary/glossary.ts` exports a group `fact-check-canary`, checked against `CANARY_SOURCES` (not `SOURCES`, never in `GLOSSARY`), reached as `npm run fact-check -- glossary/fact-check-canary`, with its report at `docs/fact-checks/canary/glossary-fact-check-canary.md`, which the gate never reads. Its planted faults are listed in a test file, not in the canary's file, as `canary.test.ts` does for the lesson canary. Its ties name real lesson terms; they are not subject to rule 14.

Before writing it, fetch RFC 2131 and RFC 9110 from rfc-editor.org and confirm by `grep` that each correct statement's cited section states it; put the passage in the test file's comment, as `canary.test.ts` does. If a correct statement below is not stated as written, reword it to what the section says and say so in your report.

| Entry | Item | Words (the author's; reword only to match the section) | Cites | Planted |
|---|---|---|---|---|
| `dhcp` | names | term `DHCP`, also `Dynamic Host Configuration Protocol`, `Dynamic Host Control Protocol` | | **fault**: no statement gives the second spelling |
| | statement 1 | The Dynamic Host Configuration Protocol (DHCP) passes configuration information, such as a network address, to hosts on a TCP/IP network. | rfc-2131 §1, defining | correct |
| | statement 2 | DHCP messages travel over UDP: a client sends to the server port, 67, and a server answers on the client port, 68. | rfc-2131 §4.1, defining | correct |
| `discover` | names | term `Discover`, also `DHCPDISCOVER` | | correct |
| | statement 1 | A client looking for an address broadcasts a discover message, DHCPDISCOVER, to find the servers that can give it one. | rfc-2131 §3.1, defining | correct |
| | lessons | `dhcp` `term-discover` | | correct |
| `offer` | names | term `Offer`, also `DHCPOFFER` | | correct |
| | statement 1 | Each server that receives a discover message may answer with an offer message, DHCPOFFER, that holds an address it can give. | rfc-2131 §3.1, defining | correct |
| | lessons | `dhcp` `term-broadcast` | | **fault**: the lesson's term is Broadcast, another thing |
| `lease` | names | term `Lease` | | correct |
| | statement 1 | A DHCP server always lends an address for exactly 24 hours. | rfc-2131 §1, defining | **fault**: no source gives a fixed 24 hours; the lease time is the server's choice |
| `request` | names | term `Request` | | correct |
| | sense `dhcp`, label | In DHCP | | correct |
| | sense `dhcp`, statement 1 | After choosing one offer, the client broadcasts a request message, DHCPREQUEST, asking for the offered address. | rfc-2131 §3.1 and rfc-9110 §9.3.1, neither defining | **fault**: RFC 9110 §9.3.1 is about HTTP GET and does not state it |
| | sense `http`, label | In HTTP | | correct |
| | sense `http`, statement 1 | A GET request asks for a current representation of the resource it names. | rfc-9110 §9.3.1, defining | correct |
| | sense `http`, statement 2 | GET is the method a browser uses to fetch a page. | rfc-2616 §9.3, defining | **fault**: RFC 2616 is obsoleted; RFC 9110 now defines GET |

Five faults, the rest correct. Tests: the canary group is valid and outside the glossary; every planted key is a key of its sheet; and its report, once it exists, matches the sheet's hash and flags every fault and passes every other item. The orchestrator runs a fresh fact-checker on it in the B9 worktree before the build review; until then that one test may fail, and only it.

## 8. The docs and the agents' instructions

- `docs/content-model.md` §6 is rewritten for sections 1 and 2 above (the invented example kept invented); §8 gains a subsection "A glossary group" saying what differs from a lesson: the command's target, the paths, the three kinds of item (names, label, tie) and how each is judged, `"overrides": []`, and the entry rule of the re-check. The refusal paragraph keeps only objective mappings.
- `.claude/agents/fact-checker.md` gains a section "A glossary group", and every lesson-only line stays as it is. It says:
  - the prompt is `The glossary group: <id>. Work in the folder: <path>` (or `Re-check. The glossary group: ...`), and nothing else; the commands use `glossary/<id>`; the header's `slug` is `glossary/<id>` and `overrides` is `[]`; the group's file, like a lesson's, is not to be read;
  - a **claim** is judged as a lesson's, read alone: a definition stands on its own, so "unique", "any", "every", "always", "stands for" and the like pass only where the cited section says as much; a full name passes only where a cited section gives it;
  - **names** (`unbacked`): every name shown is given, as a name of this thing, by one of this entry's own cited statements; a name none gives is ⚠️, a wrong name ❌;
  - a **label** (`unbacked`): it names where this sense applies, and the sense's statements are about that;
  - a **tie** (`tie`): each listed lesson term names the same thing, in the same sense, as this entry's definition, and its idea line does not contradict the definition. A line plainer or thinner than the definition passes; a term that names another thing or another sense, or says what the definition contradicts, is ❌. A tie cites and quotes nothing;
  - the absolute rule reads "something another entry of this group or a tied lesson term states" where it reads "another part of this lesson".
- `.claude/agents/author.md` gains a section "A glossary group": the brief is `docs/briefs/author-glossary-group.md`; rules 1 to 10 in plain words; "the six faults" apply to statements; the report lists every entry and statement written.
- `.claude/agents/analyst.md` gains one line: the question may be a glossary group instead of a lesson; then the brief is `docs/briefs/analyst-glossary-group.md`.
- New `docs/briefs/analyst-glossary-group.md`: for each entry of the group, what its definition must say (what the thing is and what it is for), each point with source, section and the passage found by script in the saved source; the full name only where a source gives it; for a word with two senses, each sense and where it applies; anything a common definition says that no allowed source backs; each tied lesson term's line beside the definition, marked agrees, thin or at odds; the registry entries any new source needs. Sources saved in `.superpowers/analysis/glossary-<id>/sources/`, the report at `.superpowers/analysis/glossary-<id>/report.md`, written in parts, the reply in 150 words or fewer.
- New `docs/briefs/author-glossary-group.md`: write the group file once from the analyst's report and the orchestrator's rulings in it, in the lessons' voice (plain words a beginner reads easily, no claim wider than its source); done when `npm run fact-check -- glossary/<id>` prints the sheet, `npx astro check` is clean, and `npx vitest run --mode development` fails only on the group's missing report.
- `docs/briefs/analyst-read-before-check.md` gains one line: for a group, run `npm run fact-check -- glossary/<id>` and read every item as the fact-checker will, ties included.

## 9. Acceptance checks

1. Every one of the eighteen lesson reports and six re-checks passes with no byte of `docs/fact-checks/*.md` changed (`git diff revamp...b9/glossary-path -- docs/fact-checks` lists only new files under `glossary/` or `canary/`), and a test asserts that each cited lesson's sheet hash equals its report's (or re-check's) `hash`.
2. Each rule of section 2 has a test that breaks it and one that keeps it.
3. The group sheet's keys, kinds, content and hash are as section 3 says; a change to a tied lesson term's words changes the group's hash; adding a group changes no lesson's hash.
4. Each command form of section 4 works for a group, tested through `runFactCheck` as the lesson forms are.
5. The gate: a group with no report, a stale report, a failing verdict, a bad quote record or an orphan report in `docs/fact-checks/glossary/` fails a build-mode test; a group with a passing report passes; a passing re-check pair for a group passes.
6. The re-check judges a whole entry when one of its items changed, and no lesson rule fires on a group nor the entry rule on a lesson.
7. Objective mappings are still refused.
8. The canary group as section 7.
9. `npm test`, `npx astro check` and `npm run build` pass (with section 7's one exception until the canary's report is committed).
