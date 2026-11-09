# The Fact-Checker: Design

Direction doc §10 task 3. Written 2026-11-08 from the owner's answers in the build session. Not yet approved.

## 1. Why

TechConcepts teaches beginners, so accuracy comes first (direction doc §3). The owner wants the 16 remaining Networking Concepts lessons written next. They decided the fact-checker comes first, so every new lesson ships checked (2026-11-08). Tasks 4–8 wait.

The owner will not read fact-check reports. They trust whatever the fact-checker passes. So the fact-checker has to be strict enough that its pass is a real sign-off: it must check every claim, against the real source, and never wave anything through.

## 2. What the owner decided (2026-11-08)

1. **Every factual claim names its source**, at the exact section, as direction doc §3.1 already requires.
2. **Sources must be current**: the version in force today.
3. **Sources must be relevant**: the cited section says what the claim says.
4. **Every claim is confirmed by a second, independent reliable source.** One exception: a claim may rest on a single source when that source is the **defining standard** for what the claim describes. For example, a field's exact size is defined only in its own RFC.
5. **The fact-checker runs in the build session as a separate agent with a fresh context**, after a lesson is written and before its pull request opens. There is no GitHub job and no API key.
6. **The owner does not read the reports.** The fact-checker's all-pass verdict is the sign-off. This replaces "the owner signs off by reading the report" in §3.4 and the report review in §5 step 5.
7. **Limit overrides** (§4.4) are listed with their reasons in the pull request description, and the owner's OK to merge approves them.
8. **Order:** this task first, then the Networking lessons (§10 task 9). Tasks 4–8 wait.
9. **Vendor explainer pages count as sources.** An allowed vendor's own explainer pages, such as Cisco's "What is a firewall?", count alongside its product documentation.
10. **ITU-T is an allowed source.** ITU-T Recommendations, published free on `www.itu.int`, become a source kind. ITU-T X.200, the same text as ISO/IEC 7498-1, can then be the defining standard for OSI model claims and every lesson's OSI badge.

The owner also accepted these points when they were played back in conversation: the fix-and-recheck loop (§4), a report per lesson that the build reads (§6), and the exemption for the lessons still on the legacy list (§7).

## 3. Goals, non-goals, anti-goals

**Goals**
- A fact-checker agent that any session can dispatch, defined in the repository.
- A report for each lesson, written only by the fact-checker, that the build can read.
- A build gate: a cited lesson builds only with a current report in which every claim passes.
- A content model that enforces the two-source rule before a lesson ever reaches the fact-checker.
- The direction doc and `docs/content-model.md` updated to the owner's new rules.

**Non-goals (now)**
- The "Verified [date] · N sources" stamp and the Sources list on pages. Both are §10 task 7. The report carries the data they will need.
- Auditing the 17 lessons now on the site. That is tasks 4–6.
- Checking glossary entries and objective mappings. Neither exists yet. The report format must extend to them, at task 7 for the glossary and task 10 for A+.
- Re-checking already-verified lessons on a schedule when their sources change later. This is noted for later.
- Any GitHub automation, API key or paid service.

**Anti-goals (a failure even if it runs)**
- **A checker that grades its own work.** The author never writes, edits or rewrites a report.
- **A pass through leniency.** "Close enough" is ⚠️, and ⚠️ blocks.
- **A skipped claim.** The checker gets the list of claims from code, not from reading the lesson, and the build confirms the report covers exactly that list.
- **A second source that isn't allowed.** Corroboration uses the same allowed sources as every citation:
  - RFCs, IEEE, IANA, NIST and ITU-T
  - an allowed vendor's own documentation and explainer pages
  - *Added 2026-11-08 (owner):* four more groups, listed in direction doc §3.2: other standards bodies and industry groups, government security agencies besides NIST, security reference programmes, and internet registries. Two pages from one publisher's site count once, as two pages of one vendor do.

  It never uses blogs (a vendor's blog included), Wikipedia, videos, forums, AI output, or anyone else's summary.
- **A verdict from memory.** Every passage is read from the source itself, in this run.

## 4. The flow for one lesson

1. **Write.** The author (the build session) writes the lesson in the cited shape. Every claim has its citations: two independent sources, or one marked as the defining standard (§5.2).
2. **List the claims.** A command prints the lesson's **claim sheet** (§6.1), which includes the content hash.
3. **Check.** The author dispatches the fact-checker agent with a fresh context. The dispatch gives it only the lesson's slug, never the author's notes, drafts or conversation. It reads the claim sheet, fetches every cited section from the source's own site, checks every item, and writes `docs/fact-checks/<slug>.md`.
4. **Gate.** The build reads the report (§7).
5. **Fix and recheck.** If any item is not ✅:
   - The author commits that failing report as it stands.
   - The author fixes the lesson: rewords the claim, re-cites it, or cuts it.
   - The author dispatches a brand-new fact-checker on the whole lesson.

   Repeat until every item passes. A report is replaced, never edited. The checker is never re-run on unchanged content to get a different answer. Every run's report is in the branch's history, so the pull request shows every run, failing ones included. Only the branch's final commit has to pass the build, and that is the one pushed.
6. **Pull request.** It holds the lesson, its report, and a description listing any limit overrides with their reasons. The owner's OK to merge is unchanged.

## 5. What the fact-checker checks

### 5.1 Each claim (every part that must cite)

The parts that must cite are the ones listed in `src/content/cited.ts`:
- Learn's lead, terms, pattern, why, Go deeper and facts
- every Watch step's Go deeper
- every Practice option's feedback
- the OSI badge

**A claim is one factual statement.** A part, such as a Go deeper paragraph or a Practice option's feedback, may make several claims. The checker checks every claim in every part. The verdict for a part is its worst claim's.

Each part gets one verdict: ✅ supported, ⚠️ imprecise, or ❌ wrong. It is ✅ only if all of these hold for every claim in it:

- **Relevant.** The cited section states the claim. The report quotes the passage relied on.
- **Accurate as worded.** Nothing is overstated or understated: an "always" where the source says "usually" fails, and so does a dropped condition. A beginner-friendly simplification is fine if it is not wrong.
- **Current**, by the kind of source:
  - **RFC:** the RFC Editor does not list it as obsoleted. If later RFCs update it, the checker reads the relevant updates and confirms the claim still holds.
  - **IEEE standard:** the current edition, not superseded or withdrawn.
  - **IANA registry:** the live registry.
  - **NIST publication:** not withdrawn or superseded by a newer revision.
  - **ITU-T Recommendation:** ITU-T lists it as in force, not superseded.
  - **Vendor documentation or explainer page:** the page is live and describes a current product or current practice.
  - **The claim itself:** it describes current practice, not a superseded one. For example, saying HTTPS runs over SSL fails.
  - The report records the date each source was checked.
- **Confirmed.** Either:
  - **Two independent sources.** Two of the part's citations each state the claim themselves, and the report quotes both. *Independent* means:
    - They are different documents, that is, different registry entries.
    - They are not two pages from the same vendor. A vendor page that restates an RFC counts, and so does a second RFC.
  - **A defining standard.** A citation marked as the defining standard states the claim, and the checker confirms it is the current document that defines this thing, such as its message format, field, value, procedure or layer. The report says what it defines.
- **Allowed.** Every cited source really is one of the allowed kinds, and its page comes from the publisher itself. The build checks only hosts, so the checker also rejects:
  - an Internet-Draft, a Microsoft Q&A page or a conference paper (`docs/content-model.md` §1)
  - a vendor's blog, community forum or partner content
  - any page the vendor didn't write

If a source cannot be fetched or read, the claim cannot be ✅.

### 5.2 Everything else in the lesson

These parts cite nothing of their own. Each gets ✅, ⚠️ or ❌:

- **Traced parts** (Watch steps, step facts, events, packets, scene, Overview, summaries): each says nothing beyond the Learn parts it traces to. Watch never adds a claim (§3.1).
- **Example parts:** they use only example data and are labelled as examples. Examples are RFC 5737 and RFC 1918 addresses, `00:00:5E:00:53:xx` MACs, and the like.
- **Analogies:** each one doesn't mislead about the thing it explains.
- **Question prompts:** none has a false premise.
- **OSI badge `'spans'`:** no source puts the topic at a single layer.

Task 2's review asked for every `example` and `analogy` flag and every question prompt to be listed and checked, because any Watch part can opt out of tracing by calling itself an example. This covers that.

### 5.3 The two-source rule in the content model

The build enforces what it can before the checker runs. The checker then checks each claim (§5.1).
- Every part that must cite has citations to **at least two different sources**, meaning different entries in `SOURCES`. Two sections of the same RFC count as one source.
- **Or** at least one of its citations is **marked as the defining standard**. The marker goes on the citation, not the part, so the report and readers' tools can tell which source defines the thing.
- Analogies stay as they are, with no citation. The two-source rule does not apply to them.
- Objective mappings (`cert-objectives`) are exempt: the official objectives document is by nature the only source for an objective number.
- Glossary statements follow the same rule as lesson claims.
- No cited lessons exist yet, so this breaks nothing today.

Readers see both citations. Showing them is §10 task 7, as with all citations.

## 6. The claim sheet and the report

### 6.1 The claim sheet

The claim sheet is a command run on a slug. Code builds it from the defined lesson, so it cannot miss a part. It lists:

- every claim: a stable key, its text, its citations with each source's registry entry, and its defining-standard marker
- every traced, example and analogy part, with its backing
- every question prompt
- the OSI badge
- the lesson's limit overrides and their reasons
- the **content hash**

**What the sheet covers.** Everything a reader can read, or see happen, in the lesson. That includes every text, every value in a scene, table, log or packet, and every message outcome such as dropped or blocked. Display-only settings stay off it: column widths, camera views, cue names and the figure id. If a reader can read it or watch it happen, it is on the sheet. If it is on the sheet, the checker checks it.

**Content hash.** A hash of exactly what the claim sheet shows: its items, their citations, and the registry entry of every cited source. So:
- Changing any checked text or value, or a cited source's entry, makes the report stale.
- A layout tweak, a comment, or a new schema field with a default does not, so later tasks don't force every lesson to be checked again.

**Stable keys.** Reuse the paths `cited.ts` already writes in its messages, such as `units[0].learn.lead[1] ("lead-2")`.

### 6.2 The report

- **Path:** `docs/fact-checks/<slug>.md`. It is keyed by lesson slug, because lessons are shared between tracks. Task 2 recommended this, and it changes §3.4's `<track>/<lesson>`.
- **Written only by the fact-checker agent.**
- **A machine-readable header** that the build reads:
  - the slug, the content hash, the date checked and the checker's model
  - verdict counts
  - every key with its verdict
  - every source with its currency result and check date. That is the "N sources" the stamp will show later.
  - the limit overrides
- **A readable body.** For each claim: its key and text, the verdict, each citation with the quoted passage (or "defining standard: what it defines"), and a currency note. Then the traced, example and analogy parts, the question prompts, the OSI badge and the overrides.

## 7. The build gate

The build fails, for any lesson in the cited shape, when:

- it has no report
- the report's hash differs from the lesson's current hash
- the report's keys differ from the claim sheet's: one is missing, or one is extra
- any verdict is not ✅
- the report cannot be read

A report with no matching lesson also fails, so stale reports don't pile up.

Lessons on the closed `LEGACY_LESSONS` list are exempt until tasks 4–6 move them across. Every new Networking lesson is cited, so it is gated from the start.

## 8. The agent

- **Where it lives:** `.claude/agents/fact-checker.md`, committed, so every session has the same checker. It is our own text, not a third-party skill, so the licence rule for committed skills doesn't apply.
- **Model:** the most capable available.
- **Tools:** read the repository, run the claim-sheet command, fetch web pages (and search, to find a source's current version), and write its report. Its instructions forbid changing anything else.
- **Independence:** it is dispatched with the slug alone, and every run starts from nothing. Written rules and the branch history keep this honest, not a technical lock. There is no hook blocking the author from `docs/fact-checks/`, because that would be committed configuration for little gain.
- **Strictness is in its instructions:** the rules of §5, the verdict meanings, "from the source, in this run, never from memory", and "when in doubt, ⚠️".

## 9. Proving it works before the pull request

- **Unit tests** for the two-source rule, the claim sheet, the hash, reading the report and every failure of the build gate, using fixture lessons and fixture reports.
- **One canary run of the real agent** on a test lesson citing real sources. The lesson holds correct claims plus planted faults:
  - a claim its cited section doesn't support
  - a citation to an obsoleted RFC
  - a second source that doesn't state the claim
  - a wrong defining-standard marker
  - a Watch step that adds a value not in Learn

  The agent must flag every planted fault and pass every correct claim. The canary's report goes in the pull request as evidence. The canary lesson never appears on the site.
- **This also confirms the agent can fetch pages** from RFC Editor, IEEE, IANA, NIST and vendor sites in this environment. If it can't, stop and tell the owner before going further.

## 10. Documents to update in this task

- **`src/content/sources.ts`:** a new `itu` source kind with host `www.itu.int`.
  - Explainer pages need no new kind: they are `vendor` sources.
  - When an explainer lives on a host not yet listed, such as `www.cloudflare.com`, that host is added with the lesson that first cites it, as `docs/content-model.md` §1 already requires.
- **Direction doc:**
  - §3.1 and §3.2: two sources per claim, the defining-standard exception, sources must be current, ITU-T allowed, and vendor explainer pages allowed.
  - §3.4: runs in the session before the pull request; the report path is by slug; the owner doesn't read reports and the all-pass verdict is the sign-off; overrides go in the pull request description.
  - §5 step 5: the owner approves the pull request, not the report.
  - §10: the new order.
  - Each change is marked with the date and "(owner)", as §8 already does.
- **`docs/content-model.md`:** the two-source rule, the defining-standard marker, and a new section on the fact-check workflow and the build gate.

## 11. Left to the builder

- Names: the command, the defining-standard marker, and the fields of the report header.
- The header's format, such as YAML front matter or a fenced JSON block, and the hash algorithm. It must be deterministic.
- Where the gate runs: in the registry when it loads, or a script in `npm run build`. Either way it must fail `npm run build`. It should fail `npx vitest run` too if that is cheap.
- How the canary lesson and its sources are kept out of the site and out of `SOURCES`.
- The wording of the agent's instructions, within §5 and §8.

## 12. Calls made in this design (for the owner to check)

1. The two-source rule is enforced by the schema as far as it can be: at least two sources per part, or a citation marked as the defining standard. That way a lesson can't reach the checker without a second source.
2. A claim is one factual statement, and the checker checks each one. A part's verdict is its worst claim's.
3. The defining-standard marker goes on the citation, not on the part.
4. Independent sources are two different registry entries, but not two pages from the same vendor. A vendor page restating an RFC counts as independent, and so does a second RFC.
5. Objective mappings are exempt from the two-source rule. Glossary statements are not.
6. Analogies keep no citation. The checker only confirms they don't mislead.
7. The report path is by slug, not by track.
8. The claim sheet covers everything a reader can read or watch happen, and the hash covers exactly the sheet. Layout settings and new schema defaults don't make reports stale.
9. An orphan report fails the build.
10. The agent file is committed to the repository.
11. Independence is kept by written rules and branch history, not a hook:
    - Every run's report is committed, failing ones included.
    - The checker is never re-run on unchanged content.
12. One canary run with planted faults is the acceptance test, and its report goes in the pull request.
13. "Current" includes the claim itself describing current practice, not only the source being current.
14. Explainer pages are `vendor` sources. A new explainer host is added with the first lesson that cites it.
