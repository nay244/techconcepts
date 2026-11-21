# B43 cases: the spec review of B43 (one data file a lesson page), job 30

The spec review of B43 and B44 by `reviewer` (Opus), 2026-11-21, read on `revamp` at `5d6756d` against `plan.md` (job 30, decision 3) and `prototypes/d26-lesson-change.md` (approved, variant A, direction 2.150). Verdict: HOLES, 2 for B43, both with one answer, closed below by the orchestrator (direction 2.151). B44's cases, its errata and the trial are in `prototypes/b44-cases.md`.

## Errata (the orchestrator, 2026-11-21)

- **E61. The build's stamp.** One module, `src/lib/build-stamp.ts`, exports one string, set once per build: the commit (`git rev-parse HEAD`), else the build's time when git is not there. The endpoint writes it into every file as `stamp`; B44 imports the same module into the console, so the open page's copy is compiled into the console's script (decision 2 lets its name change). Nothing goes into the HTML or BaseLayout. B43's check that every built HTML file is byte for byte `revamp`'s stands: B43 does not import the module anywhere the console's bundle reaches.
- **E62. "Equal to what the island is given"** means: revive the island's `props` attribute from Astro's `[type, value]` form (type 0 a value or an object of revived values, type 1 an array) and compare the file's five values with `toStrictEqual`. The file is plain JSON (`JSON.stringify` of `{ lesson, entry, next, nextFigure, definitions, stamp }`), never Astro's form. Measured: the props hold no `Date`, `Map`, `Set`, `URL`, typed array or `undefined` value; the only `null`s are real.
- **Notes for the builder:** the JSON is outside every budget (`scripts/check-budgets.mjs` counts scripts); none is added in this unit. A missing file on Cloudflare is the 404 page (an HTML body, status 404); that is B44's to handle.

## B43 cases

Decision 3 and B43's check (`plan.md`, Units). Each line: the setup, then what a right build does. "Revived" means the island's `props` attribute turned back from Astro's `[type, value]` form (B43-H2).

**Check 1: for all 34 lesson pages the file's five values equal the island's props in the built page**

- B43-1.1 For every `dist/<track>/<slug>/index.html` with an `astro-island`, read `dist/<track>/<slug>.json`: its `lesson`, `entry`, `next`, `nextFigure` and `definitions` are `toStrictEqual` to the revived island props of the same name; the test counts 34 pairs and fails on 33 or 35.
- B43-1.2 A lesson in two tracks: `/networking/what-is-tls.json` has `next.slug` `firewalls`, a `nextFigure` string, `entry.number` 16 and `entry.url` `/networking/what-is-tls`; `/how-the-internet-works/what-is-tls.json` has `next: null`, `nextFigure: null`, `entry.number` 14. Both have `entry.canonical` `/how-the-internet-works/what-is-tls`. A build that writes one file per slug, or reads the track from the lesson, fails here.
- B43-1.3 The same for DNS: `/networking/what-is-dns.json` `entry.number` 13 and `next.slug` `what-is-http`; `/how-the-internet-works/what-is-dns.json` `entry.number` 6 and `next.slug` `what-is-dhcp`.
- B43-1.4 A track's last lesson keeps its nulls: `/networking/vpn.json` and `/how-the-internet-works/what-is-tls.json` have the keys `next` and `nextFigure` present with value `null` (`'next' in data` is true), not left out.
- B43-1.5 A lesson with no glossary terms: `/how-the-internet-works/what-is-imap.json` (also POP3, SMTP, and Networking's ARP, NAT, Ports…) has `definitions` equal to what the island gets (an empty object), not missing and not `null`.
- B43-1.6 Real nulls inside the lesson survive: `/networking/subnetting.json` and `/networking/ip-address.json` have `board.prefix: null` where the island has it (8 places).
- B43-1.7 `entries`, `figureData`, `trackId`, `trackTitle` and `total` are not in any file (decision 3: they stay from the open page); a file carrying `figureData` (about 143 KB raw) is refused.
- B43-1.8 The file is plain JSON, not Astro's form: `JSON.parse(file).lesson.title` is a string (`"UDP"` for UDP), not `[0, "UDP"]`.
- B43-1.9 The stamp: present under one named key in every file, the same value in all 34 files of one build, and (per B43-H1's answer) the same for two builds of one commit, or different for every build.
- B43-1.10 No other `.json` is built: none for `/networking/how-the-internet-works` (the redirect, `astro.config.mjs:10`), none for a track page, none for `/tracks`, `/glossary`, `/about`, `/`. `find dist -name '*.json'` lists 34 files, each beside a lesson's folder.
- B43-1.11 The file's address follows from `entry.url`: for every page, `fetch(entry.url + '.json')` against `npm run preview` answers 200 with `content-type` `application/json` (the decision-3 address `/<track>/<slug>.json`, slash-less like the page).
- B43-1.12 A slug that does not exist (`/networking/nope.json`) answers 404 from `npm run preview`, so B44's "not a 200" fall-back can be tested on the real server.

**Check 2: every built HTML file byte for byte as `revamp`'s**

- B43-2.1 Build `revamp` and the branch into two folders; every `*.html` under `dist` is identical (`cmp`), including the 34 lesson pages and their island `component-url`. A build that imports the stamp module from the console, `BaseLayout.astro` or `[lesson].astro` changes a script name or the markup and goes red here.
- B43-2.2 The set of HTML files is the same (no page added or lost by the new route); `git diff revamp -- 'src/pages/[track]/[lesson].astro'` is empty.

**Check 3: the budgets**

- B43-3.1 `node scripts/check-budgets.mjs` still finds 42 pages and 34 lesson pages and passes; the JSON files are not taken for pages (`listPages` reads HTML files only, `scripts/check-budgets.mjs:71-80`). Nothing in the budget counts the files; the plan's "about 11 KB compressed" is a figure, not a check (see Notes).

**Checks 4 and 5: `npm test`, `npm run build`**

- B43-4.1 The guards stay green with no new grant: `src/lib/not-found-page.test.ts:58`, `src/scripts/about-page.test.ts:286`, `src/lib/glossary-page.test.ts:299` (the new route file is not one of the files they name).
- B43-4.2 `npm run dev`: `/networking/dhcp.json` answers JSON and `/networking/dhcp` still answers the page (the two routes do not shadow each other in dev).
