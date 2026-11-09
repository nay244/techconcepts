# TechConcepts: Direction after the Redesign

- **Date:** 2026-11-07
- **Status:** Agreed with the owner, 2026-11-07, in a structured "grill-me" interview (Q1–Q39 below)
- **Builds on:** `2026-11-03-techconcepts-networking-launch-design.md` (launch spec) and `2026-11-05-techconcepts-redesign-build-design.md` (redesign spec). Both still hold **unless this document changes them**. §9 lists every change.
- **For:** the Claude Code session that builds the site. Read this whole document before starting work. §10 is the ordered task list.

As in the earlier specs, **(owner)** marks the owner's decision. Each one also cites its interview question, e.g. (owner, Q5).

---

## 1. State of the project on 2026-11-07

- Live on Cloudflare Workers as a **soft preview on the `.workers.dev` address**. `techconcepts.app` is not connected yet (owner, Q9).
- `origin/main` is at `e63a9c9` ("Merge pull request #2 from nay244/home-internet-works"). The redesign (PR #1) and "Home leads to How the Internet Works" (PR #2) are both live.
- Ready lessons: How the Internet Works (14 protocol units), Subnetting, DHCP, Firewalls. The other 16 Networking lessons are "Coming soon".
- The local checkout was synced to `origin/main`. The stale local branches `redesign` and `redesign-build` were deleted.
- A local branch, **`chore/remove-levelup`**, holds this document and the LevelUp clean-up (§8). It hasn't been pushed.

## 2. What TechConcepts is for (owner, Q1)

1. **A real product for a real audience.** Content must be **100% accurate and fact-checkable**. No misinformation in any lesson, on any topic. That outranks speed, lesson count and polish.
2. **The owner's own study tool** for certifications.
3. **The owner's practice in building a real web app with AI agents.** The way the agents work (§4, §5) is part of the product, not overhead.

TechConcepts is **not** a game. It has nothing to do with the owner's separate IT career sim game ("LevelUp"), and none of that project belongs here (owner, Q2). The launch spec's no-gamification rule still holds.

## 3. Accuracy system

### 3.1 What must cite a source (owner, Q5, Q10)

| Content | Citation |
|---|---|
| **Learn** statements (they explain what Watch showed) | **Required.** Each one is a verifiable fact with a source |
| **Go deeper** paragraphs | **Required** |
| **Practice** answer explanations | **Required** |
| Glossary definitions (§6.5) | **Required** |
| OSI layer badge (§6.4) | **Required**, or the badge says "Spans layers" |
| Exam objective mapping (§4.3) | **Required**: the official objectives document, version pinned |
| **Watch** steps and scene values | **No citation of their own**, but every Watch statement and every value in a scene (ports, flags, header values, table rows) **must trace to a cited Learn statement in the same lesson**. Watch simplifies, but it **never adds a claim** (owner, Q17). Example data (RFC 5737 / RFC 1918 addresses, `00:00:5E:00:53:xx` MACs) is labelled as an example and needs no backing |
| **Analogies** | No citation. Flagged `analogy` in the content data. The verifier still checks that each one doesn't mislead (owner, Q10) |

**Two sources per claim (owner, 2026-11-08).** Every claim is confirmed by a second, independent, allowed source: another document, not another page of the same vendor. The one exception is a claim whose source is its **defining standard**, the current document that defines the thing described, such as a field's exact size in its own RFC. That citation is marked as defining and may stand alone. Analogies and objective mappings are exempt. The schema enforces the count, and the fact-checker confirms that each source states the claim. Details: `docs/content-model.md` §3 and the fact-checker design, `docs/superpowers/specs/2026-11-08-fact-checker-design.md`.

### 3.2 Allowed sources (owner, Q11)

Primary references only, for every technical claim:
- IETF RFCs, IEEE standards, IANA registries, NIST publications
- ITU-T Recommendations, published free on `www.itu.int`. ITU-T X.200, the same text as ISO/IEC 7498-1, can be the defining standard for OSI model claims (owner, 2026-11-08)
- Four more groups, each from its own site (owner, 2026-11-08):
  - other standards bodies and industry groups: W3C, WHATWG, the Wi-Fi Alliance, ETSI, 3GPP, the Unicode Consortium, Ecma International, the Bluetooth SIG, USB-IF, the UEFI Forum and NVM Express
  - government security agencies besides NIST: CISA, the UK's NCSC and ENISA
  - security reference programmes: MITRE's CVE, CWE and ATT&CK, and FIRST's CVSS specification
  - internet registries: ICANN and the five regional internet registries (ARIN, RIPE NCC, APNIC, LACNIC and AFRINIC)
- Official vendor documentation (e.g. Cisco, Microsoft, Cloudflare, Palo Alto Networks docs)
  - and the vendor's own explainer pages, such as Cisco's "What is a firewall?" (owner, 2026-11-08). A vendor's blog, forum or partner content never counts
- Official certification objective documents (CompTIA, Cisco), for exam tags and objective mapping only

**Sources must be current** (owner, 2026-11-08): the version in force today, not an obsoleted RFC or a superseded or withdrawn standard. They must also be relevant: the cited section says what the claim says.

Never sources: blogs, Wikipedia, videos, forums, AI output, or secondary summaries, however reputable.

Each citation points to the **exact section** (e.g. RFC 2131 §3.1), not just the document.

### 3.3 Readers see the sources (owner, Q10, Q25)

- Citations show as small numbered links that open the exact section.
- Learn ends with a **Sources** list.
- Each lesson, and each lesson card on track pages, shows **"Verified [date] · N sources"**, taken from the fact-check report (§3.4). The stamp disappears whenever the content changes, until a new report passes.

### 3.4 The verifier: a blocking gate (owner, Q5, Q12)

- An **independent fact-checker agent** with a fresh context. It hasn't seen the authoring, so the work isn't grading itself.
- It runs on **every PR that changes lesson content**, glossary entries or objective mappings.
  - **Changed 2026-11-08 (owner):** it runs in the build session as a separate agent with a fresh context (`.claude/agents/fact-checker.md`), after a lesson is written and before its PR opens. It is dispatched with the lesson's slug only. There is no GitHub job and no API key.
- It checks every cited claim against the **exact passage** it cites. It also checks that every Watch item traces to Learn (§3.1), and that analogies don't mislead.
- It writes `docs/fact-checks/<track>/<lesson>.md`, with one verdict per claim: ✅ supported / ⚠️ imprecise / ❌ wrong. Each verdict quotes the passage the verifier relied on.
  - **Changed 2026-11-08 (owner):** the report path is `docs/fact-checks/<slug>.md`, by slug, because a lesson is shared between tracks.
- The report also lists **every limit override** (§4.4) for the owner to approve.
  - **Changed 2026-11-08 (owner):** overrides are listed, with their reasons, in the PR description. The owner's OK to merge approves them.
- **Any ⚠️ or ❌ blocks the merge.** The owner signs off by reading the report.
  - **Changed 2026-11-08 (owner):** the owner does not read reports. The fact-checker's all-pass verdict is the sign-off. A failing report is committed, the lesson is fixed, and a brand-new fact-checker checks it again. The workflow is in `docs/content-model.md` §8.
- The build fails if a lesson is missing a citation, or if its report doesn't match its current content (e.g. via a content hash stored in the report).
- **No "Report an error" link** for now (owner chose Q5 (a)+(b), not (c)).

## 4. Content model

### 4.1 Track types (owner, Q35)

| Type | Examples | Order | Exam data |
|---|---|---|---|
| **Concept track** | How the Internet Works, Networking Concepts | Taught in order, in parts | Cert/role tags only |
| **Certification track** | CompTIA A+ (later others) | By exam domain and objective | Every lesson mapped to a pinned objective number |
| **Role track** (future, not before launch) | Helpdesk, SOC Analyst | To be designed | To be designed |

### 4.2 Shared lessons (owner, Q22)

- A lesson exists **once** and can appear in several tracks. Tracks only reference lessons.
- **Progress follows the lesson**, not the track. Finishing DHCP counts in every track that contains it.
- The fact check is per lesson, so a shared lesson is checked once.

### 4.3 Exam objective mapping (owner, Q23)

- Certification tracks map every lesson to objective numbers (e.g. "Core 1 220-1201, objective 2.6").
- The source is CompTIA's official objectives document, with its **version pinned** in the track data. Before writing any A+ lesson, check on CompTIA's own site which exam version is current, and pin that one.
- Mappings go through the verifier like any other claim.
- This reverses the launch spec's "no objective numbers in v1" **for certification tracks only**. Concept tracks still show cert tags only.

### 4.4 Lessons are untimed; limits are set per track (owner, Q3, Q7, Q13, Q18)

- **Remove every time estimate**: the `estimate.ts` build check, the 12/15-minute warn and fail limits, lesson 1's exemption, and all minute figures in the UI and copy (Home "96 min", "124 min"; track page "124 minutes in all", "finish in one sitting"; the "10 min" chips on cards; the footer's "Short guided lessons"). Lessons are self-paced, pick up where you left off.
- **Untimed doesn't mean walls of text.** Steps and lessons must stay digestible.
- Limits (steps per lesson, facts per step, words per step, hook length, Go-deeper size) move from global constants into **per-track defaults** in each track file. Networking starts with today's numbers. Advanced topics get the room they need.
- A lesson may override a default only with a **one-line reason** in the lesson file. The verifier report lists every override for the owner to approve.

### 4.5 How the Internet Works becomes its own track (owner, Q24, Q33, Q34)

- It's a **concept track** of **14 lessons**, one per protocol: HTTP, HTTPS, TCP, UDP, IP, DNS, DHCP, ICMP, SMTP, POP3, IMAP, FTP, SSH, TLS/SSL. Each gets its own progress and its own fact-check report.
- **Networking Concepts goes back to 19 lessons.** Renumber them.
- **The overlap is deliberate.** How the Internet Works is the **tour**: what each protocol is for, and where it fits in a page load or an email. Networking is the **depth**: how each protocol works, field by field. Every tour lesson ends with "Go deeper: Networking › <lesson>" where that lesson exists.
- Both tracks take definitions from the **same cited glossary entries** (§6.5), so they can't contradict each other.

## 5. How each new lesson is made (owner, Q20)

1. **Research.** Collect the primary sources into the lesson's source list.
2. **Learn** content, every statement cited.
3. **Watch** and **Practice** derived from Learn (Watch adds no claims).
4. **Verifier** writes the fact-check report.
5. **Owner** reviews the report and the content.
   - **Changed 2026-11-08 (owner):** the owner approves the PR, not the report. The fact-checker's all-pass verdict signs off the content (§3.4).
6. **Build**, tests, then a PR to `main` (Cloudflare deploys `main`; pushes to `main` only with the owner's OK, as before).

**HTML mockups only when a lesson needs a scene type the engine doesn't have yet** (e.g. OSI Model's layer stack). Lessons that reuse existing scenes skip that step.

## 6. Site and UX changes

### 6.1 Home (owner, Q24, Q37)

- Show **only real tracks**, in this order: How the Internet Works (the beginner entry) → Networking Concepts → CompTIA A+ (marked "In progress" until done).
- Drop the duplicate "How the Internet Works" lesson card (it becomes the track card) and the four roadmap cards (Cryptography, AI Concepts, Privilege Escalation, Threat & Vulnerability Management) until work on them starts.
- The hero button opens the first lesson of How the Internet Works.
- Remove all time figures (§4.4).

### 6.2 Lesson console (owner, Q31)

- Move **track progress** (the 20-square strip) out of the console top bar onto the track page. The console keeps **lesson** progress only.
- Collapse the **event log** to one row until the first message plays, and give the scene that height.

### 6.3 Phone and tablet (owner, Q30)

- Design real phone and tablet layouts. Today the console stacks into one page about 2,350 px tall at 390 px wide, and the event log table runs off the right edge.
- Direction: on phones, tabs (**Scene / Explain / Log**) with the step controls pinned at the bottom.
- This is part of the launch bar (§7).

### 6.4 OSI layer badge (owner, Q26)

- The badge is a **claim**. Show a specific layer only when a primary source states it. Otherwise show **"Spans layers"**, with the explanation in Go deeper.

### 6.5 Glossary and concept links (owner, Q27)

- A **glossary** of terms, each with a cited definition.
- Terms inside lessons (e.g. "MAC address" in DHCP) link to that concept's lesson, or to its glossary entry.
- Each lesson shows **"Builds on"** and **"Leads to"**.

### 6.6 Practice review list (owner, Q28)

- Practice stays **unscored**.
- Add a private **"missed questions" review list**, stored only in the browser through `createSafeStorage()`. No score, streak, XP or anything else gamified.
- This changes the launch spec's "Check yourself is never scored or saved". It is still never scored. Only the missed list is saved.

### 6.7 Not doing

- **No site search** (owner, Q29).
- No accounts, no server state, no gamification (launch spec, unchanged).

## 7. Launch bar for `techconcepts.app` (owner, Q19, Q38)

Connect the domain (the deploy doc's "Plan 2") only when **all** of these hold:

1. **How the Internet Works**, **Networking Concepts** and **CompTIA A+** are complete.
2. Every lesson has passed the verifier with **zero ⚠️/❌**.
3. Phone and tablet layouts are done.

Until then the site stays a soft preview on `.workers.dev` and isn't promoted.

## 8. Repository hygiene

- **LevelUp is gone** (owner, Q2, Q8). Branch `chore/remove-levelup` removes the last traces: the folder-name note in the launch spec, and absolute `/LevelUp/` paths in the redesign plan, now written relative to the main checkout. After this session the owner renames the folder from `LevelUp` to `TechConcepts`. Never write absolute paths containing the folder name into tracked files.
- **Dead worktree** (owner, Q14). `.claude/worktrees/redesign-build` is on the merged branch `home-internet-works`, and its absolute path breaks once the folder is renamed. **Do this before the rename, on the owner's Mac:**
  1. Copy its git-ignored build records, `.superpowers/sdd/2026-11-05-techconcepts-redesign-build/`, into the main checkout's `.superpowers/sdd/`.
  2. `git worktree remove .claude/worktrees/redesign-build`
  3. Delete the merged `home-internet-works` branch, locally and on GitHub.
- **Commit `skills-lock.json` and `.claude/skills/`** (accessibility, design-review, emil-design-eng, frontend-design), so every session has the same skills (owner, Q15). `.claude/worktrees/` stays ignored.
  - **Changed in the build session, 2026-11-07 (owner):** the repository is public, so only skills whose licence allows republishing are committed: `frontend-design` (Apache 2.0, with its `LICENSE.txt`) and `accessibility` (MIT, with its `LICENSE` from `addyosmani/web-quality-skills`). `design-review` and `emil-design-eng` state no licence. They stay installed locally, `.gitignore` keeps them out, and `skills-lock.json` still lists all four with their sources.

## 9. What this changes in the earlier specs

| Earlier rule | Now | Source |
|---|---|---|
| Launch spec §2.2, §7.4: lessons ≤15 min, enforced at build | Untimed. Estimate check and all time UI removed. Limits set per track, with overrides per lesson | Q3, Q7, Q13, Q18 |
| Redesign spec §3: lesson 1 exempt at 96 min | Lesson 1 is now its own 14-lesson track. No exemptions needed | Q3, Q33 |
| Launch spec §6.1, redesign spec §3: Networking has 19, then 20 lessons, How the Internet Works is lesson 1 | How the Internet Works is its own concept track. Networking has 19 lessons | Q24, Q33 |
| Launch spec §6.1: no exam objective numbers in v1 | Certification tracks map every lesson to pinned objective numbers. Concept tracks keep tags only | Q23, Q35 |
| Launch spec §7.4: at least 1 reference per lesson | Every Learn statement, Go-deeper paragraph, Practice explanation, glossary definition, OSI badge and objective mapping cites a primary source. Watch traces to Learn | Q5, Q10, Q17, Q26 |
| Launch spec §6.1: paths deferred until there's more than one track | Track types (concept, certification, later role) over shared lessons | Q22, Q35 |
| Launch spec: Check yourself never scored or saved | Still never scored. A private "missed questions" list is saved in the browser | Q28 |
| Launch spec §10.1, redesign spec §6.1: Home shows the How the Internet Works card, the Networking card and 4 roadmap tracks | Only real tracks: How the Internet Works → Networking → A+ ("In progress") | Q24, Q37 |
| Redesign spec §3: desktop only for now | Phone and tablet layouts are part of the launch bar | Q30, Q38 |
| Redesign spec §6.3: console top bar holds track progress | Track progress moves to the track page. Event log collapses until the first message | Q31 |
| OSI layer shown for every lesson | Shown only when a primary source states it, otherwise "Spans layers" | Q26 |
| Deploy doc: domain connected at "Plan 2 / launch" | Launch bar is §7 | Q19, Q38 |

## 10. Ordered task list for the build session

Each numbered item is its own branch and PR, merged with the owner's OK.

**Order changed 2026-11-08 (owner):** task 3 (the verifier) comes next, then task 9 (finish Networking Concepts), so every new lesson ships checked. Tasks 4–8 wait. Task 4 below still says the owner reviews the first report closely; that predates the owner's decision not to read reports (§3.4), so ask the owner when task 4 starts.

1. **Hygiene** (§8): merge `chore/remove-levelup` (docs only), remove the dead worktree (after copying its records), delete `home-internet-works`, commit the skills.
2. **Content model** (§3.1, §4): source registry; citations on Learn, Go deeper, Practice and glossary; `analogy` flag; Watch-to-Learn traceability; track types; shared lessons with per-lesson progress (migrate existing saved progress without losing it); per-track limits with reasoned overrides; objective mapping for certification tracks; remove the estimate check. The schema rejects any cited field without a citation.
3. **Verifier** (§3.4): define the fact-checker agent (independent context) and the report format. Add the build check that every lesson has a current, all-✅ report.
4. **Migrate and audit DHCP** through the full pipeline. It proves the model, the verifier and the "Verified" stamp. The owner reviews the first report closely.
5. **Migrate and audit Subnetting and Firewalls.**
6. **Split How the Internet Works** into its own 14-lesson track, then migrate and audit each lesson, adding "Go deeper: Networking ›" links. Renumber Networking to 19.
7. **Site and UX changes** (§6.1, §6.2, §6.4, §6.5, §6.6, §3.3): Home, time removal everywhere, sources and Verified stamps, OSI badge rule, glossary and Builds on / Leads to, Practice review list, console declutter.
8. **Phone and tablet layouts** (§6.3).
9. **Finish Networking Concepts**, in track order (OSI Model next; it needs a new scene type, so mockup first).
10. **CompTIA A+**: pin the current objectives version from CompTIA's site, map the shared lessons, then write the A+-only lessons in objective order.
11. **Launch** (§7): connect `techconcepts.app` once the launch bar holds.

## 11. Later, not now

- Role tracks (Helpdesk, SOC Analyst, …) (owner, Q35).
- Other concept tracks: Cryptography, AI Concepts, Privilege Escalation, Threat & Vulnerability Management.
- Translations (the mocked-up language menu stays set aside).
- A "Report an error" link, if the owner revisits Q5 (c).
