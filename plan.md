# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1, and job 23's (404 in the Card stack look, with its result) at a6589ba.


# Job 24: the header and footer in the Card stack look

**Status: D23 approved and frozen (2026-11-19; 2.124): variant A, the Tracks fix in, the Lesson page's skip link a unit after. Go (2.123): the layout kept, the Lesson page's header in Patch with the styles in `card-stack.css`, D23 on Fable 5.2.** Planned under 2.122. The owner, at job 23's end, to whether the header and footer join Card stack: "Yes, plan it as a job" (2.121). Numbers claimed on `revamp` (a6589ba, checked free): job 24, direction rows from 2.122, S25, D23, B29, F24.

## Inputs

| | |
|---|---|
| **The job** | The site's header (`src/components/SiteHeader.astro`, with `ThemeToggle.css` and Start learning's `site.css` buttons) and footer (`SiteFooter.astro`) in the Card stack look (§9, `src/styles/card-stack.css`) on Home, Tracks, the track pages, About, the Glossary and 404, on phone and desktop, light and dark, the menu below 960px closed and open; the Lesson page by the owner's answer at the go (decision 2). |
| **Done means** | The owner has approved D23 at the design gate; B29 is merged into `revamp` with a build review of PASS (or PASS WITH FIXES, each "fixed when" run); on `revamp`, `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass (`npx playwright test --grep-invert @visual --project=d1440-dark --project=phone`) pass, the specs B29 touches also at `reduced-motion`; every page's `main` builds byte-identical before and after (the islands' random ids aside), and the Lesson page whole if it keeps Patch, checked by a command at merge time, not a test in the suite; heights and weight measured before and after; `docs/direction.md` §6 and §9 updated; the ledger written. Nothing pushed. |
| **Budget** | 0.85 to 1.45 million subagent tokens of growth (estimate below), plus S25's 0.24 million. A stop for the owner at 1.8 million. |
| **References** | `docs/direction.md` 2.81 ("Keep our current top navbar style and add a few color's"), 2.84, 2.89 (focus under the sticky header), 2.95 and 2.96 (the header on the Lesson page), 2.121, §6 (Patch, still the header's and footer's), §7 (the Lesson page), §9 (Card stack); `prototypes/s25-header-footer-facts.md`; `prototypes/d17-*`, `d18-*`, `d21-*`, `d22-*` and their cases (the same move for the pages); `src/styles/card-stack.css`. |

## What the scout found (S25), and what was measured

- **The header** (219 lines): the brand, a pill nav of five links (Tracks, Glossary, How a lesson works, Sources, About), the theme button, Start learning (`/tracks`; not on Tracks, the track pages or the Lesson page) and, below 960px, a menu button whose panel lists the five links and Start learning. Sticky, z-index 20, 68px plus a 1px rule, a translucent ground with blur. 15 rule blocks and 7 in its one media query; its script runs the menu (Escape closes it and returns focus; without JavaScript the panel stays hidden) and the theme button. The skip link is `BaseLayout`'s, before the header. Words: 7 a reader sees, 5 names for assistive technology.
- **The footer** (96 lines): the brand and its line, Learn (five links), Site (About), and "Your progress is saved only in this browser."; three columns, two below 720px; no script; 11 words or phrases. Its `.brand` rules live in the header.
- **Both read only Patch's tokens** (12 names and 5); neither reads a `--cs-*` name, and `card-stack.css` targets neither (its buttons, tint and cards are scoped to `main` or `cs-` classes, by design).
- **Only `BaseLayout` renders them.** The Lesson page has the same header (`current="tracks"`, no Start learning) and **no footer**, and leans on the header's 69px: `console.css:31` sizes the lesson to `calc(100vh - 69px)`, `:42-53` sets its scroll padding and lays the open menu over the lesson.
- **Pages lean on the header's heights**: scroll padding 80px on five pages, 403px with the menu open on About, the Glossary and 404, 341px on the track page; the Glossary's sticky bars at `top: 68px`; Home's sections `scroll-margin-top: 88px`.
- **Pinned by** about 65 end-to-end and 45 unit tests. Most compare pages with each other and stay green when all six pages change together. **Absolute pins:** `site.spec.ts:1884-1885` (Start learning has no shadow and a 1px edge), `:1911` (the header's ground within one channel of the page's), `:470-473` (nav links 32px, Start learning at least 122px wide); 69px closed (`lesson-layout*.spec.ts`, the track page), 391px open (`not-found`, `about`, `glossary` specs) and 329 (the track page); the scroll paddings above. **Guards pinned to old commits** that go red on any header or footer edit: `not-found-page.test.ts:54-80`, `about-page.test.ts:252-265`, `glossary-page.test.ts:276-287`, `track-page-render.test.ts:206-212`, `tracks-render.test.ts:197-215`; and `home.test.ts:328-346` (no colour in `card-stack.css` outside two blocks).
- **Dead code found, not this job's:** no page passes `overHero`, so `.site-head[data-over-hero]` (`SiteHeader.astro:164-185`) and `src/scripts/site-head.ts` are unused; `ThemeToggle.tsx` and `LogoMark.tsx` have no importer but their tests; `SiteFooter.astro:4-6`'s comment is stale; §8 line 425 says the lesson's top bar uses `LogoMark.tsx`.
- **Measured on `revamp` a6589ba** (built, headless Chromium, fonts loaded; light and dark the same): the header 69px on every page at 320, 375 and 1440; open, 391px (329 without Start learning; on the Lesson page the panel lies over the lesson and the header stays 69); the footer 600 / 553 / 371px at 320 / 375 / 1440. S25 Part 8 has the table; screenshots in `.superpowers/job24/look/` (untracked).

## Decisions in this plan

1. **The look is Card stack, colour variant A**, as on the six pages that wear it: hard ink edges, offset-edge buttons, index tabs where they mean "where you are", Patch's own colours one job each (orange for here and do this), the ground Patch's. How the nav, the theme and menu buttons, Start learning, the menu panel and the footer take it is D23's to draw. 2.81's "Keep our current top navbar style" is answered by 2.121; its "add a few colours so that it is not simply black and white" still holds.
2. **The Lesson page: the owner's choice at the go.** Recommended: **its header keeps Patch**, unchanged, because 2.84's words were "Site-wide excluding our current Lesson's page", the Lesson page is sized to one screen around the header's 69px and lays the menu over itself, and an untouched Lesson page can be proved byte-identical. Its cost: the header changes look when a reader opens a lesson. If the Lesson page joins, D23 draws its header too and the Lesson page's own specs join the build's runs.
3. **Where the header's and footer's Card stack styles live: decided with 2.** Recommended, with the Lesson page in Patch: **in `card-stack.css`, in a block of its own scoped to `.site-head` and `.site-foot`**: the six pages already import it and the Lesson page does not, so the Lesson page keeps Patch with no new prop, and one file holds the look. Its opening comment's rule ("reaches neither the header, nor the footer") is rewritten, and the components' Patch styles stay as the base the block restyles. The other way: the components carry both looks, chosen by a prop `BaseLayout` passes. If the Lesson page joins, neither is needed: the components' own styles change in place and Patch leaves the header and footer.
4. **The layout: the owner's choice at the go.** Recommended: **kept**: the same parts in the same order, the breakpoints (960px, 720px), the header 69px closed and 391 / 329 open, so no page's scroll padding, the Glossary's sticky bars or the Lesson page's sizing moves; restyled only. The footer's height may change, ruled and measured. If open, D23 draws a second layout (about 0.15 million more) and every height it moves is listed with the rules and tests that follow it.
5. **No new words without the owner's yes.** Every word and every name for assistive technology is kept; a word new, changed or removed is listed in D23's spec for the owner at the gate. No fact is stated, so no fact-check runs.
6. **The designer: on the orchestrator's model (Opus 5.5) unless the owner says Fable 5.2 for this task** (the rule of 2026-11-12; asked at the go). One designer, one prototype (`prototypes/d23-header-footer.html` and `.md`): the header and footer over a page that wears Card stack (About, the longest with Start learning) and over Tracks (without it), at 320, 375, 960 and 1440, light and dark, the menu closed and open, focus rings shown, with "For the builder" and acceptance checks as D22's spec has, heights and weight ruled and measured, and the Lesson page's header drawn as decision 2 sets. The orchestrator looks at it in the browser before the gate.
7. **Kept for the rest of the site:** what the header and footer do (the menu and its script, Escape, the panel without JavaScript, the theme button and its storage, the skip link, `aria-current`, sticky, z-index 20), their links and Start learning's place; no new `<script>`. Start learning is 40px today (§9, "Not done"); D23 may make it 44px inside the 68px row.
8. **Keyboard and motion, as in jobs 18 to 23.** The spec review names Tab and Shift+Tab walks at 320, 375, 390, 959, 960 and 1440 with the menu closed and open, focus never under the sticky header; the builder runs its specs at `reduced-motion` before review, uses `transitionsDone` for any read after a state, scroll or focus change, and proves each wait with `--trace=off --repeat-each=10`. Every agent writes its report in parts. After sending fixes the orchestrator checks the branch's commits within the hour.
9. **Tests changed on purpose, never loosened past the grant.** The guards pinned to old commits (S25 Part 6) allow exactly the files this job grants (`card-stack.css`'s new block and its opening comment, `SiteHeader.astro`, `SiteFooter.astro`, `ThemeToggle.css` and `site.css` if D23 needs them) and keep every other file pinned; `site.spec.ts:1884-1885` and `:1911` take the approved values; the comparisons between pages stay as they are. The spec review lists every other test that pins the header or footer in Patch, changed once in the build. "Nothing else changed" is a command run at merge time (job 23's lesson), not a test in the suite.
10. **One build unit**, B29 (`.superpowers/wt/b29`, branch `job24/b29`, `E2E_PORT=4502`, review on 4503; ports checked free with `lsof` before the brief), since the header, footer and `card-stack.css` are restyled together.
11. **A base run before the design:** the specs B29 will touch (`site`, `not-found`, `about`, `glossary`, `tracks-card-stack`, `track-page-card-stack`, `card-stack-home`, `lesson-layout`, `lesson-layout-small`, `tablet`) at `reduced-motion` on `revamp`, in the main folder, so an old flake is known before the end (job 22's lesson).

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S25 | scout | scout (Haiku), 0.24 million | Done: `prototypes/s25-header-footer-facts.md`, with the orchestrator's measures in its Part 8. | |
| Base | before | orchestrator (Opus 5.5) | Decision 11's run. | Its counts in the ledger. |
| D23 | design | designer (the owner's model at the go) | `prototypes/d23-header-footer.html` and `.md`: the look of decision 1, the Lesson page of decision 2, the layout(s) of decision 4, the widths and states of decision 6, heights and weight ruled, every word listed. | The orchestrator looks at it in the browser at 320, 375, 960 and 1440, light and dark, the menu open; heights against S25's. |
| Gate | design | the owner | D23's prototype and spec. | The owner's words. |
| B29 spec | build | reviewer (Opus) | Holes and attack cases, the walks of decision 8, the tests of decision 9: `prototypes/d23-cases.md`. | Holes with one answer closed as errata; taste back to `designer`. |
| B29 | build | builder (Sonnet) | The header and footer as approved; the tests of decision 9; each case a test. | `npm test`; `npm run build`; its specs at d1440-dark, phone and reduced-motion; heights and weight; the merge-time command of decision 9. |
| B29 review | build | reviewer (Opus) | The diff against the prototype and the cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| F24 | end | orchestrator (Opus 5.5) | Into `revamp`; CI's end-to-end pass; the touched specs at `reduced-motion`; every `main` unchanged; heights and weight; §6 and §9 updated; the ledger. | As "Done means". |

Order: the go; the base run; D23; the gate; the spec review; B29; its review; F24.

## Estimate

| Part | Growth, roughly |
|---|---|
| D23 (one layout; 0.15 million more for two; 0.1 more if the Lesson page joins) | 0.25 to 0.4 million |
| Spec review | 0.15 to 0.25 million |
| B29 | 0.3 to 0.5 million |
| Review and fixes | 0.15 to 0.3 million |
| **Total** | **0.85 to 1.45 million** (two layouts: 1.0 to 1.6) |

## When the work stops for the owner

- The go: the Lesson page and where the styles live, the layout open or kept, the designer's model.
- The design gate.
- A design that changes a word, the header's heights under decision 4 as kept, what the header or footer does, `card-stack.css` outside its new block and comment, or how any page's `main` looks.
- A hole in the approved spec that needs taste and would change what the owner approved.
- The job past 1.8 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

A build unit that fails two reviews comes back to the orchestrator with both reports.

## What could go wrong

- **Specificity**: the components' scoped styles carry Astro's attribute; a block in `card-stack.css` must win by its selectors, not by `!important`, and the build review checks each part's computed style.
- **The header's height moves by a pixel** (a 2px edge for a 1px rule) and with it ten scroll paddings, the Glossary's sticky bars and the Lesson page's sizing; decision 4 as kept forbids it, and the cases measure 69, 391 and 329.
- **The translucent ground with blur** sits under a hard-edged look; whether it stays is D23's, and `site.spec.ts:1911` follows the approved ground.
- **The menu panel on the Lesson page** is laid out by `console.css`; if the Lesson page keeps Patch it must not change, and if it joins, the panel's look there is drawn.
- **Guards pinned to old commits** must be granted the job's files only, and the grant written into each, not the pin deleted.

## Not in this job

The Lesson page's skip link under its header (2.124: a small unit after this job); the Lesson page's own look (2.84); the dead code above (`overHero`, `site-head.ts`, `ThemeToggle.tsx`, `LogoMark.tsx`, the footer's stale comment), a cleanup unit of its own after this job; any lesson's or page's words; the Glossary's paused entries (Phase 5); Tracks' `:371` read without `transitionsDone` (2.120).
