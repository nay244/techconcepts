# Plan

How the work is divided is in `CLAUDE.md` (Team); how a job runs is in `docs/orchestrator-handbook.md`. The results are in `team.md`. Earlier plans are in this file's history: Phase 2 at commit f419637, Phase 3 at d9a0545, the Phase 4 pilot at 5664519, What is HTTP alone at 667f7f3, batch 1 at 13b222b, batch 2 at b18acd9, batches 3 and 4 at e8ea005, batch 5 at 1a1fbb4, job 9's first plan (the Practice page) at 8fd2947, its second (the glossary in the lessons' own words) at 93b5b4f, its third (written definitions, the pilot, the page) at 92506f4, job 10's (the glossary's remaining entries, paused after batch 3) at ea144eb, job 11's (Router, the pilot; with the proposal for the other eleven in four batches) at 84cef62, job 12's (batch 1: ARP, Ports, NAT) at 77c72a8, and job 13's (batch 2: IP Address, MAC Address, TCP/UDP, with its result) at a783282, job 14's (batch 3: Packets, Switch, Load Balancers, with its result) at bc70815, and job 15's (the lesson's flow, with its result) at 070cce6, and job 16's (batch 4: Proxies and VPN, with its result) at 71fa034, and job 17's (Home in the Card stack look, with its result) at 1cba05e, job 18's (the Tracks page in the Card stack look, with its result) at aa6d838, and job 19's (the Lesson page's layout) and job 20's (the reduced-motion failures), each with its result, at fb02521, and job 21's (the track page in the Card stack look, with its result) at c336e82, and job 22's (the Glossary and About in the Card stack look, with its result) at b14f4d1, and job 23's (404 in the Card stack look, with its result) at a6589ba, and job 24's (the header and footer in the Card stack look, with its result) at 1009fae, and job 25's (the Lesson page's skip link over its header, with its result) at 7cd51b4, and job 26's (two flaky end-to-end tests, with its result) at 0d94b6c, and job 27's (the other one-frame lags during Play all, with its result) at 246e33a, and job 28's (two more flaky end-to-end tests, with its result and B35) at e9d0fe2, and job 29's (the open items of jobs 24 to 28, with its result) at 3341203.

# Job 30: a lesson change without a page load

**Status: the owner's go, 2026-11-21 (2.149): "Go, on Opus 5.5". Carried out by a fresh session on Opus 5.5, starting with D26.. D26 approved, variant A (2.150).** Planned under 2.148. Asked by the owner on 2026-11-21: "navigating between the different lessons, TCP, UDP, IP, etc.. causes a reload to a new page. However, for Protocol Explorer each of their topics are all under one page with no reload between each topic", then "Plan it using Fable 5.2". Planned in the main folder on Fable 5.2 by that word. Numbers claimed on `revamp` (3341203, checked free): job 30, direction rows from 2.148, S27, D26, B43, B44, F30.

## Inputs

| | |
|---|---|
| **The job** | Moving from one lesson to another inside a track happens in the page: the drawing stays where it is, only the lesson's own data is fetched, and the address still changes to the new lesson's. |
| **Done means** | On a change between two lessons that share a drawing: no page load, the drawing's node is the one that was there, no filmed frame has an empty stage, and the console is the same as that lesson loaded fresh. Every lesson keeps its address, its built page and its Overview without JavaScript. On `revamp` `npx vitest run --maxWorkers=3`, `npm run build` and CI's end-to-end pass green with 0 failed; the measurement below repeated and reported; the ledger and the direction doc updated. Nothing pushed. |
| **Budget** | 1.6 to 2.5 million subagent tokens of growth with the scout's 0.22 (design 0.3 to 0.5; one spec review 0.2 to 0.35; builds 0.6 to 1.0; build reviews 0.25 to 0.4). A stop for the owner at 3.2 million. |
| **References** | `prototypes/s27-job-30-facts.md` (the scout); the orchestrator's measurement, its scripts, log and sample frames in `.superpowers/job30/` (git-ignored: `serve.mjs`, `measure.mjs`, `film.mjs`, `measure.log`, `frames/`); `docs/research/2026-11-03-reference-research.md` (Protocol Explorer); `docs/direction.md` §7 and 2.123. |
| **Models** | scout Haiku, builder Sonnet, reviewer Opus, as `.claude/agents/` has them. `designer` takes the session's model, and this session is on Fable by the owner's word for the plan only, so the designer is started with Opus 5.5 named. The job is carried out by a fresh session on Opus 5.5 (the owner at the go, 2.149); nothing in it runs on Fable. |

## What the measurement found

**Protocol Explorer is one document that holds every topic** (read in the browser, 2026-11-21). Its HTML is 2.5 KB, an empty `div#app`; one script of 172 KB compressed (506 KB) carries every topic's data and draws the diagram; with 17 KB of CSS and 465 KB of fonts a first visit is about 657 KB. Choosing another topic made 0 requests in the same document. What that costs it: the address and the title stay the same for every topic, and without JavaScript the page is a notice.

**Our first visit is lighter, and every lesson change is a new document** (the build of 3341203, served compressed with the deploy's cache headers; `measure.log`, medians of 5). A first visit is 400 KB. A change from What is TCP to What is UDP fetches a new 152 KB page (1.34 MB), of which 122 KB is the same `net-map` drawing; scripts, styles and fonts come from the cache.

| | Next lesson today, click to controls live | The lesson's data alone, fetched and parsed |
|---|---|---|
| Phone, slow 4G, CPU 4× slower | 966 ms, 152 KB | 243 ms, 18 KB |
| Phone, fast 4G, CPU 4× slower | 257 ms | 83 ms |
| Desktop, no throttle | 51 ms | 4 ms |

**The reload a reader sees is not the download: it is the page starting again** (`film.mjs`, every frame Chrome presents from the click until the page is still; three runs each, the same every run). At 1440 × 900 with no throttle a lesson change shows 36 frames that are neither the old lesson nor the new one as it ends, over 600 ms: the first, 61 ms after the click, has an empty stage and the packet table under it (`frames/today-d1440/001-mid-61ms.png`), then the drawing comes in and the table moves into the guide when the island hydrates (`useMediaQuery` says false until it mounts, `src/lesson/useMediaQuery.ts:8`); the page is still at 680 ms. On the phone at fast 4G: 37 or 38 such frames, still at 724 to 768 ms.

**The browser's own cross-fade between pages does not remove it** (a trial: `@view-transition { navigation: auto }` injected into every lesson page, alone and with rendering held until the whole page is parsed). 36 or 37 in-between frames over 583 to 600 ms, as today; on the phone the held variant was still later (851 to 871 ms). So the cheap option is not built.

**What the scout found** (S27). All 14 lessons of How the Internet Works draw `net-map`, so every change in that track can swap. In Networking 12 of 20 lessons draw `net-map`; 6 of its 19 next-lesson steps keep the drawing and 13 change it (C1, C2). Two lessons that share a drawing get equal `figureData` and an equal SVG, byte for byte (B3). React never re-renders the slotted drawing (`StaticHtml` is memoised to never update, B1), and every scene driver's `show` clears what a play left and repaints from the view (B4), so the drawing can stay while the lesson under it changes. A lesson's own props are `lesson`, `entry`, `next`, `nextFigure` and `definitions`, about 11 KB compressed together; `entries` and the track's fields are the same for the whole track (H3, H4). The console holds about a dozen pieces of state that a new lesson would inherit unless told otherwise: the playback position (set only at mount), `seen`, `picks`, `deepLinked`, the tab, the chosen view, open definitions, the lessons sheet, the outline's filter and scroll (A3). The address is only ever read (A4). The forward button's "Next lesson" is the one place the console itself navigates (`LessonConsole.tsx:245`); the outline's rows and the Up next card are plain links (E). No end-to-end spec moves from one lesson to another today (G1). Three git-diff guards expect `src/pages/[track]/[lesson].astro` unchanged since their base (G2). The budget script counts scripts, not data a page fetches (G3).

## Decisions in this plan

1. **The lesson console swaps the lesson in place** when the new lesson is in the same track and draws the same figure. Any other change (another drawing, another track, the track page, a modified click, a new tab) is the browser's own page load, as today. Protocol Explorer's way, one document for everything, is not taken: it would cost each lesson its address, its title and its Overview without JavaScript.
2. **Nothing a first visit gets changes.** Every lesson's page is still built; its HTML is the same byte for byte but for the name of the console's script; the links stay plain links, so without JavaScript, and until the island is listening, a click loads a page as today.
3. **One data file a lesson page** (B43): `src/pages/[track]/[lesson].json.ts` builds `/<track>/<slug>.json` holding `lesson`, `entry`, `next`, `nextFigure`, `definitions` and the build's stamp, each equal to what that page's island is given. `entries`, `figureData` and the track's fields stay from the open page.
4. **The drawing's node is never made again on a swap**: the `svg[data-figure]` element after the change is the element before it, and its driver is told the new lesson through `show`. This is the gain the job is for, so it is checked by identity and on film.
5. **A swapped lesson is the same as a loaded one.** After a swap the console's markup, the address, the title, the description, the canonical link and the Open Graph title, description and address equal those of the lesson's own page loaded fresh, at the Overview and after walking to its last position. Which pieces of the reader's own state carry over (the speed, the chosen view, the tab, the outline's filter) and which start again is D26's table; `seen`, `picks`, the position, open definitions and `deepLinked` start again.
6. **The address moves with `history.pushState`**, and Back and Forward swap in place too. Progress is recorded for the new lesson as a load records it.
7. **Three controls swap**: the outline's lesson rows (the column and the sheet), the Up next card, and the forward button's "Next lesson". Only a plain primary click or Enter; the browser keeps every other kind.
8. **When in doubt, a page load.** The data does not arrive, is not a 200, carries another build's stamp (a deploy since the page was opened), or is later than D26's limit: the console goes to the lesson's address the old way.
9. **No fetching ahead in this job.** The data alone takes 243 ms on slow 4G; a prefetch spends a reader's data on a guess and can be added once the swap is measured.
10. **What a reader sees, hears and can reach is a design question** (D26): where focus goes, what is announced, whether anything moves and what reduced motion gets, the slow case, the lessons sheet on a phone, the reader's own row, and the words for all of it. Two variants at most, then the owner's design gate.
11. **Reviews**: one spec review for B43 and B44 after the gate, with a trial of decision 4 on the built site. B43 is reviewed on its own before B44 is built on it (job 29's lesson). B44's review also reads the film.

## Units

| Unit | Phase | Owner (model) | What | Check |
|---|---|---|---|---|
| S27 | scout | scout (Haiku) | Done: `prototypes/s27-job-30-facts.md`. | 192 facts with `path:line`; nothing tracked changed. |
| D26 | design | designer (Opus 5.5) | Decision 10, starting from the Lesson page as built (§7): a lesson change at 1440 and at 375, What is TCP to What is UDP and Back, by the outline, the Up next card and "Next lesson"; the slow case; the table of what carries over. `prototypes/d26-lesson-change.html` and `.md`. | The prototype plays each change in both themes and under reduced motion; both widths looked at in the browser; focus and the announcement read with the keyboard; the owner's design gate. |
| B43–B44 spec | build | reviewer (Opus) | After the gate: holes and attack cases for decisions 1 to 9 and D26, with a trial of decision 4. Settles from the code: which guard files take a grant (G2), whether unit ids repeat across lessons (`picks`), what plays for 600 ms as a lesson opens. Settles from Cloudflare's own documentation whether its beacon counts an address changed by `pushState`. | Holes with one answer closed as errata; cases in `prototypes/b43-cases.md` and `b44-cases.md`. |
| B43 | build | builder (Sonnet) | Decision 3. `.superpowers/wt/b43`, `job30/b43`, `E2E_PORT=4541`. | For all 34 lesson pages the file's five values equal the island's props in the built page; every built HTML file byte for byte as `revamp`'s; the budgets; `npm test`; `npm run build`. |
| B43 review | build | reviewer (Opus) | The diff against decision 3 and its cases. | PASS, or PASS WITH FIXES with each "fixed when" run. |
| B44 | build | builder (Sonnet, B43's continued) | Decisions 1, 2 and 4 to 8 and D26 as approved, after B43 merges. `.superpowers/wt/b44`, `job30/b44`, `E2E_PORT=4542`. | A new `e2e/lesson-change.spec.ts`, sizes set in it, in `d1440-dark` and `reduced-motion`: the same document and the same `svg` node; decision 5's equality along all 14 lessons of How the Internet Works by "Next lesson" and across Networking's 12 `net-map` lessons by the outline; Back, Forward and a reload at the new address; progress; each fall-back of decision 8 and a change of drawing load a page; a modified click is left alone; D26's focus and announcement; a film probe, red on `revamp`, that sees no frame with an empty stage and the table in one place. The lesson's own specs (`lesson`, `lesson-layout`, `lesson-layout-small`, `controls`, `reading`, `site`, `tablet`) and the unit suite, `LessonConsole.flow.test.tsx`'s `navigate` cases changed on purpose; built HTML as `revamp`'s but for the script's name; `npm test`; `npm run build`. |
| B44 review | build | reviewer (Opus) | The diff against D26, this section and the cases; the film. | PASS, or PASS WITH FIXES. |
| F30 | end | orchestrator | Into `job30/int`, then `revamp`; `measure.mjs` and `film.mjs` run again on the result; vitest, build, CI's end-to-end pass with the machine quiet. | As "Done means". |

## When the work stops for the owner

- The plan (this section), before D26.
- D26's design gate, before the spec review and any build.
- Page views would stop being counted on a swap, or counting them needs a setting in Cloudflare's dashboard.
- The job past 3.2 million tokens of growth.
- Anything `CLAUDE.md` says the owner keeps.

## What could go wrong

- **One lesson's state shows in the next.** Decision 5's equality along every lesson is the guard; the cases must seed each piece of state the scout lists (A3) before a swap.
- **A keyboard or screen-reader user loses their place**, since a page load's fresh start is what told them the page changed. D26 rules it and the reviewer attacks it.
- **Networking gets both behaviours**: 6 of its 19 next-lesson steps swap and 13 load a page. D26 looks at that track too; swapping across drawings is named below.
- **The film probe flakes.** It follows 2.130's rule and job 29's lesson: made after hydration, counting frames a reader sees, never waiting to hide one.
- **The guards.** `[lesson].astro` should not need to change (the data's address follows from `entry.url`); if it must, it takes a grant in job 24's form.

## Not in this job

A change to a lesson with another drawing (it stays a page load; it needs the drawing fetched and its driver made again); the first visit's own start, the empty stage and the table's move before the island hydrates (job 29 left it for the owner, and a swap never shows it); fetching the next lesson ahead; the page's weight (1.34 MB of HTML, 1.06 MB of it the drawing); WebKit and Firefox (2.126).
