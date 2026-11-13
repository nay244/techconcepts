# S10: facts for job 9 (the Practice page and the legacy path)

The scout's report (Haiku, 2026-11-12), saved by the orchestrator from the scout's reply: the scout's own rules keep it from writing files. Paths are repo-relative unless they begin with `.superpowers/`.

SUMMARY (for the orchestrator; the full report follows)
- Counts: 40 Practice questions in 18 lessons (4 Networking lessons at 3 each, 14 How the Internet Works lessons at 2 each). 39 questions have 3 options, one (osi-model layer-4) has 4. Every lesson is one unit.
- Not written to prototypes/s10-job-9-facts.md. The scout rules bar report .md files, so this handback is the report. Nothing in the repo was changed.
- Surprising: the 4 skipped vitest tests are all `skipIf(LISTED === undefined)`. Three more legacy-list tests pass vacuously on the empty list (registry.test.ts:247-262, 435, 439). The legacy validator is also the test-fixture path for about 27 files (test-fixtures.ts:321-358). `tourLesson` in helpers/tour.ts has no callers. The "Not checked yet" stamp is still reachable in `astro dev` (registry.ts:305-314). The "option 3" list is not in any repo doc. Only the labels appear (docs/direction.md:36, 129).
- Unresolved: the owner's Practice-page design (not in repo); "option 3" definition.

=====================================================
1. THE PRACTICE QUESTIONS

Where they live
- Field `practice` on each unit: src/content/schema.ts:393 (`practice: z.array(questionSchema),`), inside unitSchema (schema.ts:372-396).
- Type: src/content/schema.ts:357-364 `questionSchema = z.strictObject({ id: text, prompt: text, options: z.array(z.strictObject({ text, feedback: text, cite: z.array(citationSchema).default([]) })), answer: z.number().int() })`. Comment at :360: "Each option's feedback explains the answer, so it cites." :362: "Index of the right option, from 0."
- Validation: src/content/define.ts:276 (duplicate question id within a unit), :277-280 (answer must be in range).
- Per-track limits: practiceQuestions {min 2, max 3} and optionsPerQuestion {min 2, max 4} at src/content/tracks/networking.ts:18-19. How the Internet Works copies them: src/content/tracks/how-the-internet-works.ts:16 (structuredClone). Enforced by src/content/limits.ts:110-116.

Count per lesson (file -> slug -> question ids; practice block line)
- src/content/lessons/dhcp.ts:579 -> dhcp: 3 (why-shout, no-repeats, when-renew)
- src/content/lessons/firewalls.ts:611 -> firewalls: 3 (port-8080, two-rules, why-reply)
- src/content/lessons/osi-model.ts:614 -> osi-model: 3 (going-down, router-layers, layer-4; layer-4 has 4 options at :660-669)
- src/content/lessons/subnetting.ts:841 -> subnetting: 3 (usable-26, via-router, why-30)
- what-is-dhcp.ts:905 (2: broadcast-discover, renewal); what-is-dns.ts:761 (2: root-referral, cached); what-is-ftp.ts:818 (2: second-connection, wifi-login); what-is-http.ts:761 (2: status-404, more-files); what-is-https.ts:918 (2: cafe-wifi, padlock); what-is-icmp.ts:786 (2: traceroute, no-reply); what-is-imap.ts:1029 (2: phone-shows, idle); what-is-ip.ts:650 (2: source-swap, loops); what-is-pop3.ts:768 (2: phone-inbox, when-deleted); what-is-smtp.ts:1219 (2: find-server, queued); what-is-ssh.ts:1172 (2: host-key-changed, what-crosses); what-is-tcp.ts:1030 (2: what-is-resent, handshake-for); what-is-tls.ts:803 (2: same-secret, certificate-proves); what-is-udp.ts:635 (2: lost-packet, why-udp). All under src/content/lessons/.
- Total: 4x3 + 14x2 = 40. Each file has one `units: [` entry and one `practice: [` block.

Shape
- Each question: id, prompt, options (each: text, feedback, cite), answer (0-based index). Nothing else (strictObject).
- Feedback convention: a right option opens "Right." and a wrong one "Not quite." (example src/content/lessons/dhcp.ts:584-585; Practice.tsx:15-28 reads these leads, and a wrong pick always shows "Not quite." even if the author's feedback does not).

Stable ids
- Hand-written slugs in source, unique within a unit (define.ts:276), not generated, not global. They key the picks (src/lesson/Practice.tsx:31, `Picks = Record<questionId, number>`), and the fact-check keys (src/content/factcheck/sheet.ts:164-166 `units[i].practice[j].prompt (question "id")`; src/content/factcheck/recheck.ts:51-52, 75; src/content/cited.ts:79-80).

How a lesson shows them now (src/lesson/)
- Practice.tsx (105 lines): `Practice` component at :47-103 (props questions, picked, onPick, numbers, :33-39). `questionsTitle(count)` at :10-13 ("Two questions"). Doc comment at :41-46: "Picking an option shows its feedback at once ... nothing is scored, counted, stored or sent anywhere." Marks from ./Marks at :3 and :96.
- Explanation.tsx:339-341: h2 `questionsTitle(unit.practice.length)`, p.explain__sub "Just for you. Nothing is scored or saved." (:340), then `<Practice ...>` (:341).
- Outline.tsx:228-230 (one-unit sidebar group "Practice"): item title `questionsTitle(unit.practice.length)`, sub "Just for you, nothing is scored" (:230). Multi-unit variant "Learn & Practice" at :216.
- "Unscored" in code: no score, count or storage code. Only copy strings: Explanation.tsx:340, Outline.tsx:230, about.astro:119, index.astro:260 ("Nothing is scored."). Test Practice.test.tsx:58-59 asserts no "score" text.
- State and what is kept per visit: LessonConsole.tsx:185-191 `picks` useState keyed by unit.id, in memory only; `pick()` sets one question's option. Comments at :97 ("Practice is never saved") and :103-106 ("Two things live in memory only ... the Practice picks, per unit, so a visit elsewhere does not clear them"). Passed to Explanation at :299-300. Reload clears them (Practice.tsx:44-45).
- Feedback after a pick: Practice.tsx:86-97 (live region `.practice__say` aria-live="polite" holds the words only; marks from `Marks` with the option's `cite`).
- Numbers: src/lesson/sourceNumbers.ts:23-30 `numberedSources`.
- Styles: src/lesson/console.css:998-1030 (`.practice*` rules).
- Tests: src/lesson/Practice.test.tsx (tests at :31 "nothing is saved", :61 "Not quite", :94 and :116 OSI marks, :128 uncited lesson shows no link, :139 live region). src/lesson/LessonConsole.test.tsx:204 (walk to Practice), :540-560 (picks survive a visit elsewhere, gone on reload, setItem only for PROGRESS_KEY). src/lesson/Outline.test.tsx:41-91. src/lesson/Explanation.test.tsx:237, 245 (kicker "Alpha · Practice").
- Home's demo uses one of these questions: src/lib/home.ts:130 `unit.practice[0]` (What is HTTP), :192 (demo object), src/pages/index.astro:235-260 (Practice pane). Changing what-is-http question 0 changes Home.

e2e specs that exercise Practice (line refs)
- e2e/lesson.spec.ts:71 (walk through Practice), :263-266 (click an option, feedback not empty).
- e2e/reading.spec.ts:5-6 (header), :26-32 (openAt 'practice'), :45-48 (fit), :57-60 (words column), :143-155 (feedback takes no room; marks 11.2px), :157-162 (phone marks '1','3','4'), :168-199 (log folded), :215-260 (fold button, tablet).
- e2e/site.spec.ts:64-70 (finishLesson walks to Practice), :192-214 (Home demo Practice), :215 and :223 ("Nothing is scored." on Home), :439 (header has no Practice link), :462 (Tracks outro "Every lesson is Watch, Learn, then Practice."), :824 (About row "Your Practice answers ... Not saved at all"), :918-919 and :1646-1652 (demo part label 'Practice'), :1061-1068 (goTo 'practice'), :1337-1358 (Learn and Practice loop with the stamp).
- e2e/visual.spec.ts:25-47 (PLACES incl. practice; screenshots only, no comparison).
- e2e/tablet.spec.ts:240 (comment on Learn and Practice).

=====================================================
2. THE PRIVATE MISSED-QUESTIONS LIST

First direction document in .superpowers/original/: ".superpowers/original/Claude outputs/2026-11-07-techconcepts-direction.md" (title "TechConcepts: Direction after the Redesign", dated 2026-11-07). The repo copy is docs/superpowers/specs/2026-11-07-techconcepts-direction.md (same text at :168-172).

§6.6 quoted exactly (file lines 149-153):
- 149: "### 6.6 Practice review list (owner, Q28)"
- 151: "- Practice stays **unscored**."
- 152: "- Add a private **\"missed questions\" review list**, stored only in the browser through `createSafeStorage()`. No score, streak, XP or anything else gamified."
- 153: "- This changes the launch spec's \"Check yourself is never scored or saved\". It is still never scored. Only the missed list is saved."
Nearby:
- 36: "| **Practice** answer explanations | **Required** |"
- 112: "3. **Watch** and **Practice** derived from Learn (Watch adds no claims)."
- 189: "| Launch spec: Check yourself never scored or saved | Still never scored. A private \"missed questions\" list is saved in the browser | Q28 |"
- 206: "7. **Site and UX changes** (§6.1, §6.2, §6.4, §6.5, §6.6, §3.3): ... Practice review list, console declutter."

Other original file: .superpowers/original/2026-11-09-site-layouts-design.original.md:31-33: "- **Practice.** The owner made it its own project (2026-11-09): a standalone page of knowledge-check quizzes, not tied to any track, with new questions written for it, each cited and fact-checked, plus the missed-questions list (§6.6). It needs its own design. Until its first quiz ships, the header has **no Practice link**." (Repo copy: docs/superpowers/specs/2026-11-09-site-layouts-design.md:31-33, and :72-73 for the mockup nav "Questions (Home's FAQ)" with "No Practice link until Practice ships".)

Option 3: not defined in any repo or original file I searched. The only uses are the label: docs/direction.md:36 ("**Direction options taken: 1, 2, 3, 4 and 5.** ... design the Practice page; ...") and docs/direction.md:129 ("Design and build the standalone Practice page (option 3) over the 40 existing questions, with the private missed-questions list from the earlier direction doc §6.6.").

Current docs/direction.md, Practice, unscored, saved progress:
- :36 (2.6, above); :67 (2.10: "Leaned on unchanged: ... Watch › Learn › Practice with Practice unscored; no Continue on Home or in the header; ... no accounts, gamification or site search.")
- :110 ("A cited lesson's Practice questions are on its claim sheet already.")
- :127-129 (Phase 5: the Practice page — TODO; text above).
- :133 ("... then Networking Concepts ... Finish Networking Concepts (15 lessons to write), CompTIA A+, the glossary and concept links, exporting saved progress, and the multi-unit dead code the audit listed.") The only mention of saved-progress export.
- :204-205 (sidebar: three named groups Watch, Learn, Practice; "All 19 lessons" at the foot), :253, :256-262 (Practice feedback marks, reading layout), :333 ("Nothing is scored" in the demo), :334 (Watch, Learn and Practice cards).
- docs/direction.md has no mention of "missed" and no "check yourself" text, and nothing on the missed list beyond the §6.6 pointer at :129.

=====================================================
3. ROUTES AND NAVIGATION

Pages (src/pages/)
- 404.astro, index.astro, about.astro, tracks.astro, [track]/index.astro, [track]/[lesson].astro (6 files).
- Dynamic: [track]/index.astro:23-27 (getStaticPaths per track). [track]/[lesson].astro:13-27 (one page per available lesson). Tracks: src/content/tracks/index.ts:12 `tracks = [internetTrack, networkingTrack]`; planned: src/content/tracks/index.ts:25-34 (CompTIA A+, no page).
- No /practice page exists.

Header and footer
- src/components/SiteHeader.astro:8 `current?: 'tracks' | 'how' | 'about'`; :16-21 links: Tracks /tracks, How a lesson works /#try, Sources /#sources, About /about; :47 and :55 "Start learning" to /tracks unless current is 'tracks'; :53-56 mobile menu uses the same links.
- src/layouts/BaseLayout.astro:25 `current?: 'tracks' | 'how' | 'about'` (same union); :33 canonical prop; :90 canonical link.
- src/components/SiteFooter.astro:20-25 (Learn: How the Internet Works /how-the-internet-works, Networking Concepts /networking, All tracks /tracks, How a lesson works /#try); :31 About /about; :35 "Your progress is saved only in this browser."

Tracks page: src/pages/tracks.astro:25 (BaseLayout current="tracks"); :17-20 cards from trackCards; :70-73 outro with "Every lesson is Watch, Learn, then Practice." and #how-the-internet-works, #networking anchors.

Track page: src/pages/[track]/index.astro:68 (current="tracks"), :35-38 CROSS_LINKS, :70-75 breadcrumb (Tracks /tracks), :93 SiteFooter.

Lesson page: src/pages/[track]/[lesson].astro:43 (BaseLayout chrome={false}), :50 `total={entries.length}`. Sidebar "All N lessons": src/lesson/Outline.tsx:280-283 (`All ${entries.length} lessons`), dialog h2 at :155. N is the track's planned entries (Networking 19 at src/content/tracks/networking.ts:31-79; How the Internet Works 14). Sidebar Practice group: Outline.tsx:228-230 (see section 1).

Home: src/pages/index.astro:83 (BaseLayout), :93 "See the tracks" to /tracks, :305 About link. No Practice link.

404: src/pages/404.astro:13 (canonical null), :20-21 (links "/" and "/tracks").

About: src/pages/about.astro:43 (BaseLayout), :114-119 Practice card ("3 Practice / Check yourself / A few questions, just for you. Each answer says why it’s right or not. Nothing is scored or saved.").

Sitemap or route lists
- No sitemap: astro.config.mjs:6-11 (no sitemap integration; redirect at :10), no sitemap file in src/ or public/ (public/: _headers, favicon.svg, og-default.png), no sitemap in package.json.
- wrangler.jsonc assets: not_found_handling "404-page" (route-agnostic). public/_headers: only /_astro/* cache rule (route-agnostic).
- scripts/check-budgets.mjs:71-86 listPages(dist) derives routes from built HTML; its tests use synthetic fixtures (scripts/check-budgets.test.mjs:75-82, 97-105), not the real site.
- e2e page list: e2e/support.ts:50-57 SITE_PAGES = home /, tracks /tracks, track-internet /how-the-internet-works, track /networking, about /about, 404 /does-not-exist. Used by site.spec.ts (see section 6) and visual.spec.ts:89.
- e2e/global-setup.ts:16 `page.goto('/tracks')` finds track paths from `main article.panel h2 a`.
- Unit tests that name routes: src/lesson/LessonConsole.test.tsx:437 (topbar Tracks link). No unit test lists every page.

What a /practice page would touch (facts)
- SiteHeader.astro:8 and BaseLayout.astro:25 (current union), :16-21 (links; the header test requires the exact four links, see section 6), SiteFooter.astro:20-25, e2e/support.ts:50-57 (SITE_PAGES), and site.spec.ts's loops (section 6).

=====================================================
4. SAVED PROGRESS

- Module: src/progress/store.ts. Storage door: src/lib/storage.ts:6-13 (SafeStorage), :20 createSafeStorage (the only door, storage.ts:1-5).
- Keys: `PROGRESS_KEY = 'techconcepts:v2'` (store.ts:5); `LEGACY_PROGRESS_KEY = 'techconcepts:v1'` (store.ts:7). Theme key `techconcepts:theme` (src/lib/theme.ts:3), separate.
- Shape: store.ts:9-18 LessonProgress {status: 'in-progress'|'finished', furthestPosition: int, lastOpened: ISO string}; store.ts:20-27 ProgressData {version: 2, lessons: Record<slug, LessonProgress>, lastLesson: string|null, lastTrack: string|null}.
- Versioning: parseProgress (store.ts:70-80) reads anything not version 2 as empty; malformed lesson records dropped alone (:37-54). migrateV1 (store.ts:108-123) reads v1 (`track/slug` keys become slugs). combineProgress (:148-151), mergeRecords (:133-142), splitInternet (src/progress/internet-split.ts) applied in loadProgress (store.ts:240-242). saveProgress (store.ts:248-252) removes v1 only after a successful v2 write; clearProgress (:254-257).
- Practice answers are not stored: Practice.tsx:44-45; LessonConsole.tsx:97 and :103-106; LessonConsole.test.tsx:556-560 (setItem only for PROGRESS_KEY, no pick text); Practice.test.tsx:31-60 (`setItem` not called; localStorage length 0). About says so: src/pages/about.astro:201-202 (row "Your Practice answers" / "Not saved at all"). about.astro:183-184 ("They are saved only in this browser ... never sent to a server").
- "Export saved progress": no export code (grep for Blob, download, createObjectURL, export found none in src, e2e, scripts). The only mention is docs/direction.md:133 (after-revamp list).
- Reset: src/components/ResetProgress.tsx (clears via clearProgress); About text src/pages/about.astro:207 "To start fresh, reset it here."
- Tests: src/progress/store.test.ts (608 lines; LEGACY_PROGRESS_KEY at :43), src/progress/useProgress.test.tsx (253 lines; v1 at :176-192, :231-234), src/progress/internet-split.test.ts (94 lines); src/test/progress.ts:16-22 (seedProgress, seedV1Progress). Component tests: src/components/hub/TrackPanelProgress.test.tsx, src/components/progress-islands.test.tsx.
- e2e: site.spec.ts:690 (finish DHCP; reset on About), :741 (v1 record still shows; seeds 'techconcepts:v1' at :749; checks v2 at :756), :764 (a visitor partway keeps place), :810 (About says where progress lives), :31 (HOME_FACTS "Your progress stays in this browser.").

=====================================================
5. THE LEGACY PATH

Definition and status
- src/content/legacy.ts: `LEGACY_LESSONS = [] as const` (:28); comment :24-27 "Closed, and empty since batch 5 (job 8, 2026-11-12) ... Removing the legacy path, this file with it, is a unit of its own (`plan.md`, "After this job")." Legacy schemas :33-97 (incl. legacyQuestionSchema :60-66); liftUnit :106-123; liftLegacy :130-132 (origin 'legacy', overrides []); checkLegacyRules :139-150 (references >= 1; exactly 2 practice in a multi-unit lesson); validateLegacyLesson :156-161 (markDefined 'legacy'); defineLegacyLesson :164-172 (refuses unlisted slugs).
- plan.md:93-95 ("After this job": "Remove the legacy path: ... `defineLegacyLesson`, `src/content/legacy.ts`, the "Unchecked" stamp and the tests on them are dead code. A unit of its own").
- docs/content-model.md:171-173 ("## 4. The legacy list" ... "stays until a unit of its own removes it"), :219, :232.

Code that touches the legacy path (not only tests)
- src/content/define.ts:313-332 (WeakMap of 'legacy' vs registry; markDefined; definedWith). 
- src/content/registry.ts:9 (import LEGACY_LESSONS); :134-139 comment; :147-155 (accepts 'legacy' origin); :209-231 checkLegacyList (called at :251 `checkLegacyList(Object.values(lessonsBySlug))`); :305-314 checkedOn (returns null for non-cited; null when report missing; comment :305-306 "or in `astro dev` a cited one whose report is missing"); :289-294 refuseOrWarn (throws outside development).
- src/content/schema.ts:24 (comment), :487-488 (`Lesson` type `origin: 'cited' | 'legacy'`).
- src/content/cited.ts:8 (comment), :169-172 (Rule 1: "A cited lesson has exactly one unit", comment "Lessons of several units exist only on the legacy path.").
- src/content/factcheck/cli.ts:103-104 (refuses origin 'legacy').
- src/content/factcheck/gate.ts:11-13 (comment), :212 (checks only cited lessons).
- src/lib/checked.ts:13 (`origin === 'cited'` counts); :16-23 lessonStamp.
- src/lesson/sourceNumbers.ts:20-23 (comment "A legacy lesson's claims carry no citations"; branch :23 returns an unnumbered list when a reference has no `source` id; schema.ts:42 `source: slugSchema.optional()`).
- src/content/helpers/tour.ts:1, 8 `tourLesson(unit: LegacyUnitInput): LegacyLessonInput`. No importers found (grep of src, scripts, e2e).
- src/content/test-fixtures.ts:3, :321-358 (makeLesson typed LegacyLessonInput; liftedFixture = liftLegacy(legacyLessonSchema.parse(...)) at :357-358). Imported by 36 test files; liftedFixture is used by 27 files (incl. define.ts, registry.ts, test-fixtures.ts), e.g. src/lesson/Explanation.test.tsx (7), src/content/limits.test.ts (12), src/content/define.test.ts (15).
- Files importing src/content/legacy directly: e2e/support.ts:2; src/content/define.test.ts:3; src/content/factcheck/cli.defaults.test.ts:2; src/content/helpers/tour.ts:1; src/content/legacy.test.ts:3; src/content/limits.test.ts:3; src/content/registry.test.ts:4; src/content/registry.ts:9; src/content/test-fixtures.ts:3; src/content/tracks/how-the-internet-works.test.ts:12; src/engine/timeline.test.ts:2; src/lib/checked.test.ts:5; src/lib/home.test.ts:4.

The "Unchecked" / "Not checked yet" stamp
- src/components/Stamp.tsx:12-21: comment ":13 'a dashed ring and "Not checked yet"'"; :17 `checked = stamp.checked !== null`; :21 `strokeDasharray={checked ? undefined : '2.3 2.2'}` (the dashed ring is an SVG attribute; no dashed CSS rule). :27 `data-checked`.
- src/components/site.css:191-192 (comment), :193-222 (.stamp rules), :213-218 (.stamp[data-checked] colours).
- src/lesson/console.css:213-220 (top bar stamp), :667 (Overview lead stamp hidden), :1762, :1826 (phone and tablet stamp).
- src/lib/stamp.ts:4-9 (LessonStamp.checked null "when it has not been checked yet"), :22-28 (words "Not checked yet").
- Tests: src/components/Stamp.test.tsx:13-18; src/lib/stamp.test.ts:8-10, :15; src/lesson/TopBar.test.ts:55; src/lesson/Explanation.test.tsx:92-93, :127, :272-276; src/components/hub/TrackRoute.test.tsx:50-52 (else branch 'Not checked yet'); src/lib/track.test.ts:122-125; src/lib/checked.test.ts:17-32 (uses LEGACY_LESSONS at :22); src/lib/home.test.ts:97-100.
- Reachable today? Production: refuseOrWarn throws outside development (registry.ts:289-294), so a missing report fails the build; the not-checked state is reached only by a cited lesson in `astro dev` without a report (registry.ts:305-314). With the list empty, every ready lesson is cited.
- False positives for the search string "Not checked yet": src/content/lessons/what-is-pop3.ts:82 and src/content/tracks/how-the-internet-works.test.ts:563 (POP3's empty-log text, lesson content, not the stamp).

LISTED stand-ins and skips
- src/content/define.test.ts:553 `LISTED`; :555 and :560 `test.skipIf(LISTED === undefined)`; :572 `makeLesson({ slug: LISTED ?? 'dhcp' })` (fallback slug 'dhcp').
- src/content/legacy.test.ts:7 `LISTED`; :77 `test.skipIf(LISTED === undefined)('a listed lesson is still checked in full')`.
- src/content/factcheck/cli.defaults.test.ts:8-9 `LISTED`; :11 `test.skipIf(LISTED === undefined)('a legacy lesson is refused')`.
- The 4 skipped vitest tests in `npm test`: define.test.ts:555, define.test.ts:560, legacy.test.ts:77, cli.defaults.test.ts:11. All four skip because the list is empty.
- One more skipped test, in e2e: e2e/site.spec.ts:346 `test.skip(unchecked === undefined, 'No ready lesson is on the legacy list ...')`, inside the test at :344-356.
- Vacuous passes (not skipped; they pass without checking anything on the empty list): src/content/legacy.test.ts:9-11 (asserts the list is empty); src/content/registry.test.ts:247-262 (early `return` at :258 when `moved` is undefined); src/content/registry.test.ts:435-437 and :439-445 (loop over LEGACY_LESSONS; their names say "the four real lessons").
- src/content/registry.test.ts:38-39 (`definedFor` uses validateLegacyLesson as the fixture path); :233-244 (legacy list vs ready lessons).
- src/content/tracks/how-the-internet-works.test.ts:22 `isLegacy`, branches at :130, :749, :774 (legacy-only expectations).
- src/lib/home.test.ts:15-16 (vi.mock of the registry), :97-100 (the "And HTTPS?" lesson is not on the legacy list).

Tests that exist only for the legacy path (by name)
- src/content/legacy.test.ts (all cases: :9 empty list, :13 lifting, :22 changed fields, :47 osiLayers spans, :54 only listed slugs, :58 no overrides, :63 list checked first, :77 listed lesson checked in full).
- src/content/define.test.ts:8 comment and :16 (validateLegacyLesson), :540-548 (multi-unit legacy lesson needs exactly 2 questions), :550-575 (defineLegacyLesson, definedWith 'legacy', throws).
- src/content/registry.test.ts:231-262 (closed legacy list), :304-306 (legacy lesson passes), :318-319 (legacy lesson lifted without checks is refused).
- src/content/factcheck/cli.test.ts:135-141 (legacy refused), src/content/factcheck/cli.recheck.test.ts:88-96 ("stamp 5: ... a legacy lesson is refused"), src/content/factcheck/gate.test.ts:91 ("legacy lessons need no report"), src/content/factcheck/cli.defaults.test.ts:11-16.
- Multi-unit paths (exist for many-unit lessons, which only the legacy path had; no current lesson has more than one unit): src/lesson/Outline.tsx:193-232 and :240-277 (protocol rows, filters, "Learn & Practice" :216), src/content/registry.ts:31-35 and :99 (LessonSummary.units), src/lesson/Outline.test.tsx Alpha/Beta fixture (:16). Current lessons: 18 files, each with one `units: [` entry (grep count 18) and one `practice: [` block.

E2E specs that would change if the legacy path and the not-checked stamp were removed
- e2e/support.ts:2 (import LEGACY_LESSONS), :7-14 (ReadyLesson.checked), :17-18 (isChecked from the list). Would change.
- e2e/global-setup.ts:6 (comment), :33 (stamp text read), :36-42 (checks that each stop agrees with the legacy list: "is ${checked ? 'off' : 'on'} the legacy list but its stop says ..."). Would change.
- e2e/site.spec.ts:344-356 (test "a lesson not checked yet says so ..."; skipped at :346; delete or rewrite). :345 uses `!l.checked`.
- e2e/site.spec.ts:590-600 (track page: "every ready stop says whether its lesson is checked"; ternary `lesson.checked ? ... : 'Not checked yet'` at :594-596). Would change.
- e2e/site.spec.ts:1344-1358 (regex at :1356 accepts "Not checked yet"). Would change (regex only).
- Unaffected: e2e/site.spec.ts:318-327, :1047-1052, :1402-1432 (checked lessons only); e2e/tablet.spec.ts:124-376 (stamp placement, not wording); e2e/visual.spec.ts (screenshots).
- Unit tests that would change with the stamp's not-checked state: src/components/Stamp.test.tsx:13-18; src/lib/stamp.test.ts:8-10, :15; src/lesson/TopBar.test.ts:55; src/lesson/Explanation.test.tsx:92-93, :272-276; src/components/hub/TrackRoute.test.tsx:50-52; src/lib/track.test.ts:125; src/lib/checked.test.ts:17-32.

Other "legacy" mentions (not the legacy path): src/progress/store.ts:7 and tests (LEGACY_PROGRESS_KEY is the v1 progress record, a different thing).

=====================================================
6. E2E SPECS THAT A PRACTICE PAGE WOULD TOUCH

Specs that name Practice, the header/nav, routes or the page list
- site.spec.ts: SITE_PAGES import (:3) and ALL_PAGES (:26; SITE_PAGES plus every ready lesson).
  - :361-373 skip link on ALL_PAGES.
  - :375-380 time figures on /, /tracks, track pages, /about (fixed list).
  - :382-396 header Tracks link and footer "All tracks" on every SITE_PAGES page; `aria-current` expected null for any path other than /tracks, /networking, /how-the-internet-works (:389-391).
  - :398-414 Start learning on SITE_PAGES except /tracks, /networking, /how-the-internet-works (:399 hasNoStart); footer order HTIW above Networking.
  - :433-441 header links exactly ['Tracks','How a lesson works','Sources','About'] and no link named Practice (:439) on every SITE_PAGES page.
  - :844-860 /does-not-exist 404 page with header and footer.
  - :862-868 no analytics script on ALL_PAGES.
  - :869-878 no sideways scroll on ALL_PAGES.
  - :879-889 (no JS) theme toggle hidden on SITE_PAGES.
  - :924-931 phone project: every SITE_PAGES page loads with status 200 (404 for '/does-not-exist'), no errors, scrolls.
  - :1618 Home has two scripts (not route-related).
- visual.spec.ts:89-95 screenshots every SITE_PAGES entry (outputs only, no baseline).
- lesson.spec.ts:414 (outline "This lesson" or "N protocols" nav count 0 in some slots).
- global-setup.ts:16-19 (Tracks page panels to find track paths).
- Specs on the Tracks page and track page that count "19": site.spec.ts:490, :548 (19 stops), :602 (How the Internet Works 14 stops).

Playwright config (playwright.config.ts)
- :26 `const PORT = Number(nodeEnv.E2E_PORT) || 4471;` (env var from e2e/support.ts:27 `nodeEnv`).
- :35 globalSetup './e2e/global-setup.ts'; :37 baseURL `http://localhost:${PORT}`; :43-45 webServer command `npm run build && npm run preview -- --port ${PORT} --ignore-lock`, port PORT, reuseExistingServer false.
- :49-59 projects: d1280 (:50), d1366 (:51), d1440-dark (:52), d1440-light (:53), d1920 (:54), reduced-motion (:55), phone (:57, testMatch site.spec.ts, grep @phone), tablet (:59, tablet.spec.ts). notVisual excludes visual/tablet/og-image (:19-20 comments; :23-24 const).
- package.json "e2e": "playwright test --grep-invert @visual"; "e2e:visual": "playwright test --grep @visual".
- No e2e spec uses toHaveScreenshot or toMatchSnapshot (grep).

Unit test config: vitest.config.ts:5-9 (include src/**/*.test.* and scripts/**/*.test.*).
