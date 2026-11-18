# S23: what the Glossary and About pages are made of, and what pins them

Scout report for job 22 (Card stack for Glossary and About). Read-only: no source file, build, dev server or Playwright run.

**Checkout.** The worktree is at `fb02521` on `claude/vibrant-mirzakhani-d38081`, clean at the start. The brief names `c336e82` (`docs: the ledger, B25 review's path`), which is a descendant of `fb02521`, not an ancestor. Among the files this report reads, the only difference is one comment line in `src/styles/card-stack.css` (see Part 3). The files were not diffed one by one beyond that.

Paths below are relative to the worktree root `/Users/naaay/Developer/WebProjects/TechConcept/.claude/worktrees/vibrant-mirzakhani-d38081`.

## Part 1: each page's code

### Glossary (`src/pages/glossary.astro`, `/glossary`, 152 lines)

- **Frontmatter** (`glossary.astro:1-15`). Imports `GlossaryEntry`, `GlossaryKeys`, `GlossaryStamp` (`:4-6`), `BaseLayout` (`:7`), `siteGlossary` from `../lib/glossary-site` (`:8`), and `../components/site.css` (`:9`). Calls `const { letters, keys, stamp } = siteGlossary();` (`:11`). Two constants: `LEAD` (`:12`, "Definitions written for this site, each one checked against its sources.", 11 words) and `NOTE` (`:13-14`, 38 words: "Under each definition are the sources it was checked against and the tracks whose lessons describe the term. A term with two meanings has a definition for each. New definitions are added once they pass the same check.").
- **Layout** (`:17`). `<BaseLayout title="Glossary" current="glossary" description={LEAD}>`. No `chrome`, `main`, `split` or `footer` prop, so the page gets the site header, its own `<main id="main">`, and the footer.
- **Markup, in order** (`:18-41`):
  1. `div.wrap.gl` (`:18`) holding `div.gl-head` (`:19-24`): `h1.disp` "Glossary" (`:20`); `p.gl-lead` = LEAD (`:21`); `p.gl-note` = NOTE (`:22`); `<GlossaryStamp stamp={stamp} />` (`:23`).
  2. `<GlossaryKeys keys={keys} />` (`:26`): the `nav#letters.gl-az` "Jump to a letter" (aria-label only).
  3. One `section.gl-letter#letter-x` per letter with items (`:29-39`): `div.gl-bar` with `h2` (the letter, `:32`) and `a.gl-up` "All letters" → `#letters` (`:33`); then `dl.gl-list` holding one `<GlossaryEntry item={item} />` per item (`:35-37`).
- **Visible words written into this page** (not counting the data): "Glossary" (`:20`), LEAD and NOTE (`:21-22`), and "All letters" once per letter (`:33`). Words from components: the stamp's line, built by `stampLine` in `src/lib/glossary.ts:125-127` ("105 terms checked, the latest on 14 Nov 2026", computed); "Also called", "See", "Sources", "Described in" (`src/components/GlossaryEntry.astro:20, 29, 42, 49`); ", no terms" (screen reader only, `src/components/GlossaryKeys.astro:24`).
- **Own `<style is:global>`** (`:44-152`). Line map:
  - base page: `.gl` (`:45`); `.gl-head h1` 64px (`:46`); `.gl-lead` (`:47`); `.gl-note` (`:48`); `.gl-stamp` and `.gl-stamp .stamp` min-height 44px (`:49-51`).
  - keys: `.gl-az` (`:54`), `.gl-az ul` 13 columns (`:55`), `.gl-key` 44px tile (`:56`), hover and active (`:57-59`), `.gl-key--none` dashed (`:60`).
  - letter bar: `.gl-letter` (`:63`), `.gl-bar` sticky `top: 68px` z 5 with `margin-inline: -32px` (`:64`), `.gl-bar h2` ink tile (`:65`), rule (`:66`), `.gl-up` (`:67`).
  - entry: `.gl-list` (`:70`), `.gl-entry` (`:71-72`), `.gl-entry dt` (`:73`), `.gl-name` label tape (`:74`), `.gl-also` (`:76-77`), `.gl-entry dd` and `dd + dd` (`:79-80`), `.gl-sense` (`:81`), `.gl-def` 27px line (`:82`), `.gl-foot` (`:84`), `.gl-row` (`:85-87`), `a.gl-src` in `--link` (`:88`), `.gl-see a` (`:89`), `.gl-row--tracks` (`:91`), `.gl-tracks` (`:92`), `.gl-name--see` dashed pointer tape (`:94`), `.gl-entry--see` (`:95-96`), `.gl-entry:target` tint (`:98`).
  - media rules: see Part 5.
- **Tokens it reads.** `--ground` (`:64`, `:134`), `--card` (`:56`, `:74`), `--line`, `--line-strong` (`:56`, `:64`, `:66`, `:74`, `:80`), `--ink-strong` (`:47`, `:56`, `:65`, `:67`, `:74`, `:81`, `:82`, `:89`), `--ink` (`:77`, `:92`), `--muted` (`:48`, `:60`, `:76`, `:85`), `--bg-soft` (`:58`), `--here-soft`, `--here` (`:98`), `--link` (`:88`), `--display` (many), `--r-tile` (`:56`, `:65`). Global tokens come from `src/styles/global.css:13-40` and colour from `src/styles/tokens.ts`.
- **Script**: none. The file has no `<script>`, and none of the three components has one. **Islands**: none. **Browser reads**: none; the page is static HTML and CSS. The only in-page motion is `a.gl-key:active` scale (`:59`) and a 150ms background transition (`:57`).
- **Components and their props**:
  - `GlossaryStamp` (`src/components/GlossaryStamp.astro`): prop `stamp` (`GlossaryData['stamp']`). Renders nothing when `stamp` is null (`:13`). Otherwise `p.gl-stamp` with `a.stamp[data-checked]` to `/about#facts` (`:15`), a 14px check-circle SVG (`:16-19`), and the line (`:20`).
  - `GlossaryKeys` (`src/components/GlossaryKeys.astro`): prop `keys`. Live letter: `a.gl-key href="#letter-x"` (`:18`). Empty letter: `span.gl-key.gl-key--none` with an aria-hidden letter and a `.sr-only` "X, no terms" (`:22-24`).
  - `GlossaryEntry` (`src/components/GlossaryEntry.astro`): prop `item` (`GlossaryItem`). Pointer (`:13-23`): `div.gl-entry.gl-entry--see#id`, `span.gl-name.gl-name--see`, `p.gl-row.gl-see` "See" + `a href="#entryId"` (`:20`). Entry (`:24-56`): `div.gl-entry#id`, `span.gl-name`, optional `p.gl-also` "Also called" (`:28-32`), then one `dd` per definition (`:34-54`) with optional `p.gl-sense`, `p.gl-def`, `div.gl-foot` with "Sources" links (`a.gl-src`, `target="_blank" rel="noopener"`, `title` and `aria-label` with "(opens in a new tab)", `:43-45`), and "Described in" `p.gl-row--tracks` when tracks exist (`:47-51`). `div.gl-body` (`:36`) has no rule.

### About (`src/pages/about.astro`, `/about`, 602 lines)

- **Frontmatter** (`about.astro:1-42`). Comment `:2-5`. Imports: `pageFigure` from `../art/figures/pages` (`:6`), `spot` from `../art/figures/spots` (`:7`), `getLesson` from `../content/registry` (`:8`), type `Lesson` (`:9`), `comingSoonTracks, plannedTracks, tracks` from `../content/tracks` (`:10`), `comingTracksSentence, factCheckSentence, sourceRows` from `../lib/about` (`:11`), `lessonCheckCounts` from `../lib/checked` (`:12`), `analyticsToken` from `../lib/analytics` (`:13`), `BaseLayout` (`:14`), `ResetProgress` from `../components/ResetProgress` (`:15`), and `../components/site.css` (`:16`).
  - `track = tracks[0]!` (`:19`), the first track.
  - `readyLesson('dhcp')` (`:22-26`) throws by name if the lesson is missing.
  - `tracksPlanned = tracks.length + plannedTracks.length + comingSoonTracks.length` (`:30`).
  - `coming` (`:34`) is `comingTracksSentence` over the planned and coming-soon titles.
  - `dhcp = readyLesson('dhcp')` (`:35`); `sources = sourceRows(dhcp.units.flatMap((u) => u.references))` (`:36`).
  - `checks = lessonCheckCounts()` (`:38`); `lessonsReady = checks.total` (`:40`); `factCheck = factCheckSentence(checks.checked, checks.total)` (`:41`).
- **Layout** (`:44-48`). `<BaseLayout title="About" current="about" description="What TechConcepts is, how its lessons are made, who inspired it, and how it keeps your progress private.">`. Default chrome, so the same header, `<main id="main">` and footer as the Glossary.
- **Markup, in order** (`:49-213`):
  1. `section.wrap.a-open[aria-labelledby=about-title]` (`:49-68`).
     - `nav.a-crumbs` "Home / About" (`:50-55`).
     - `h1#about-title` "Watch it happen, then learn its name." (`:56`).
     - `div.a-open__row` (`:57`): `p.a-lede` (`:58-61`, about 33 words: "TechConcepts is a free site of short, visual lessons on how technology works. You watch a real process play out one step at a time, then read what it was, in plain words."). `dl.stats` (`:62-66`): "tracks planned" `{tracksPlanned}`, "lessons ready" `{lessonsReady}`, "accounts needed" `0` (hard-coded, `:65`).
  2. `div.wrap.a-body` (`:70`).
     - `nav.a-toc[aria-label="On this page"]` (`:71-80`): `p.toc-h` "On this page", then five links: "What it is" `#what`, "How a lesson works" `#lessons`, "Where the facts come from" `#facts`, "Credits" `#credits`, "Your progress" `#privacy` (`:74-78`).
     - A `div` (`:82`) holding five `section.a-sec` in this order:
       - `#what` (`:83-93`). h2 "What TechConcepts is" (`:84`). Paragraphs: `:85-88` (about 40 words, "TechConcepts teaches how technology works by showing it…"); `:89-91` "The first track, {track.title}, is written for anyone starting out, including people studying for entry-level IT certifications. {coming}" (`coming` is computed, `src/lib/about.ts:12-17`); `:92` "You don’t need an account, and you can open any lesson in any order." About 70 words in all.
       - `#lessons` (`:95-139`). h2 "How a lesson works" (`:96`); p `:97` "Every lesson has the same three parts, so you always know where you are."; `ol.a-steps` (`:98-123`) of three `li.card`s, each with `div.art` `set:html={spot(...)}` (`:100` watch, `:108` learn, `:116` practice), `span.n` ("1 Watch", "2 Learn", "3 Practice", `:102, 110, 118`), `h3` ("See it happen", "Get the idea, then the name", "Check yourself", `:103, 111, 119`), and a `p` (`:104, 112, 120`). `div.a-note` (`:124-137`): an inline clock SVG (`:125-133`, `aria-hidden`), and `p` with `b` "Lessons are self-paced." then "Take as long as you need. This browser remembers where you stopped, so you can pick up where you left off." (`:134-136`). Final `p` (`:138`) "The example networks use addresses set aside for documentation and private use, so nothing in a lesson points at a real machine." Section total about 165 words.
       - `#facts` (`:141-162`). h2 "Where the facts come from" (`:142`). `div.a-facts` (`:143-148`): `p` "Each lesson lists the standards it draws on under Sources at the end of Learn. {factCheck}" (`:144-146`), and `div.a-facts__art[aria-hidden=true]` with `set:html={pageFigure('sources')}` (`:147`). `div.card.a-src` (`:149-161`): `h3` "Sources in the {dhcp.title} lesson" (`:150`), and a `ul` of `li` with `span` (standard) and `a` (title, `href` = source URL) (`:151-160`). About 30 words of prose.
       - `#credits` (`:164-179`). h2 "Credits" (`:165`). `p` (`:166-169`): "Protocol Explorer and TryHackMe inspired TechConcepts: the first for the idea of watching a protocol work, the second for its friendly, guided way of teaching. They are inspiration only. TechConcepts is not affiliated with, endorsed by, or built from either of them." `dl.a-credits` (`:170-178`): "Figures" with "Drawn for TechConcepts with Anatomy, an open-source isometric kit by wheresryan22, used under the MIT licence." and "Type" with "Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono, from the Braille Institute, made to be easy to read. Headings are set in Barlow Semi Condensed, by the Barlow Project Authors." About 90 words.
       - `#privacy` (`:181-210`). h2 "Your progress stays with you" (`:182`). `p` (`:183-186`): "TechConcepts remembers a few things so you can pick up where you left off. They are saved only in this browser, on this device, and never sent to a server. There are no accounts." `table.a-saved` (`:187-206`) with caption "What the site remembers" and three rows: "Which lessons you started and finished" / "This browser only" (`:193-196`); "Light or dark theme" / "This browser only" (`:197-200`); "Your Practice answers" / "Not saved at all" (`:201-204`, dot `.off`). Line `:207` renders "The site counts page views with privacy-friendly analytics that use no cookies and know nothing about your progress." only when `analyticsToken?.trim()` is set. `p` (`:208`) "To start fresh, reset it here. Clearing your browser data does the same." Then `<ResetProgress client:load />` (`:209`). About 80 words of prose outside the table.
- **Own `<style is:global>`** (`:223-602`), line map:
  - `html { scroll-behavior: smooth }`, reduced-motion `auto` (`:224-231`).
  - opening: `.a-open` (`:234-237`); `.a-crumbs ol`, `li + li::before`, `a`, `[aria-current]` (`:238-260`); `.a-open h1` clamp 44 to 104px, line-height 0.92 (`:261-268`); `.a-open__row` grid with 2px ink top rule (`:269-277`); `.a-lede` 19px (`:278-284`); `.stats` and its `div`, `dd`, `dt` (`:285-306`).
  - body: `.a-body` grid `200px minmax(0, 46rem)` (`:309-315`); `.a-toc` sticky `top: 96px` (`:316-319`); `.a-toc ol`, `a`, `a:hover`, `a[aria-current]` (`:320-342`); `.a-sec` with `scroll-margin-top: 92px` (`:343-347`); `.a-sec + .a-sec` rule (`:348-351`); `.a-sec:last-child` (`:352-354`); `.a-sec h2`, `p`, `p:last-child`, `a` (`:355-370`, the link is `var(--link)`, `:369`).
  - `.a-steps` (`:373-412`), `.a-note` (`:413-433`), `.a-facts` (`:436-447`), `.a-src` (`:448-475`), `.a-credits` (`:476-494`), `.a-saved` and its parts (`:497-542`), `.a-reset` (`:543-561`).
  - media (`max-width: 860px`, `:563-601`): see Part 5.
- **Tokens it reads.** `--ink-strong`, `--ink`, `--muted`, `--line`, `--line-strong`, `--card` (`:420`), `--here` (`:339`, `:402`, `:590`), `--here-soft` (`:340`), `--link` (`:369`), `--fig-bg` (`:391`), `--display`, `--mono` (`:473`), `--allowed-text` (`:559`). Not read: `--bg-soft`, `--card-2`, `--shadow-sm`.
- **Script** (`:215-221`): `import { followSections } from '../scripts/about-toc'`; on `document.querySelector('.a-toc')`, calls `followSections(nav)`. The module is `src/scripts/about-toc.ts`: `READING_LINE = 140` (`:8`), `BOTTOM_SLACK = 4` (`:11`); `markSectionInView` sets `aria-current="location"` on the link whose section is being read (`:22-41`, mark written at `:37`); `followSections` throws if a link names no section (`:54`) and listens to `window` `scroll` passively (`:62`).
- **Islands**: one, `<ResetProgress client:load />` (`:209`), from `src/components/ResetProgress.tsx`. It reads progress through `useProgress` (`:2, :18`). Its buttons use the shared `.btn btn--small` classes (`:38, :55, :67`). A `role="group"` confirm (`:49`) and a `role="status"` live span (`:77`).
- **Browser reads**: the About script reads `getBoundingClientRect` for each section, `window.innerHeight`, `scrollY` and `document.documentElement.scrollHeight` on each scroll (`about-toc.ts:30, 32`). The island reads storage (through `useProgress`). The header's own script runs on every page (`src/components/SiteHeader.astro:61-91`): menu, theme toggle, and `solidOnScroll` only for `.site-head[data-over-hero]` (`:85-86`), which these pages lack.

## Part 2: each page's data

### Glossary data

- **Source.** `siteGlossary()` (`src/lib/glossary-site.ts:21-30`) calls `glossaryData` (`src/lib/glossary.ts:166-238`) with `GLOSSARY_GROUPS` (`src/content/glossary.ts:69-72`, a glob of `src/content/glossary-groups/*.ts` minus `*.test.ts`; `glossary-groups/old/` is not matched, `loading.test.ts:1-10`), the ready lessons (`readyLessons()`, `glossary-site.ts:10-17`), the track titles, `SOURCES`, and each group's check date from `glossaryCheckedOn` (`src/content/registry.ts:349-356`). It is built once per build (`glossary-site.ts:19-29`).
- **Groups and entry counts** (`src/content/glossary-groups/`, counted by the 6-space `term:` line at entry level): filtering 12, layers 12, leases 11, naming 9, packets 12, pilot 10, security 10, subnets 10, transport 9, web 10. **Total 105 entries.** The stamp's count is `entries.length` (`src/lib/glossary.ts:236`), so it reads 105.
- **Senses.** Five entries have two senses each, so 110 definitions: Header (packets.ts), TTL (pilot.ts), Plain text (security.ts), Network address (subnets.ts), ACK (transport.ts). Pilot's TTL gives the 11 `Described in` rows that `e2e/glossary.spec.ts:238` counts.
- **Spellings.** 42 `also:` lines hold 48 spellings (counted over the group files). Each becomes a pointer row (`src/lib/glossary.ts:197-199`). Rows on the page: 105 entries plus 48 pointers, 153 `dt`s.
- **Letters.** Filed by the first letter of the term or spelling (`src/lib/glossary.ts:105-111`). Twenty letters hold items: A B C D E F H I J K L M N O P R S T U W. No entry starts with a digit, so there is no "0–9" group. Since 20 ≥ 13 (`FULL_ALPHABET_FROM = 13`, `src/lib/glossary.ts:93`), the keys are the whole alphabet, and the six empty letters are dashed: **G, Q, V, X, Y, Z** (`glossary.ts:228-231`).
- **Last letter.** W holds one row only: the spelling "Web address", a pointer to URL (`src/content/glossary-groups/web.ts:88-90`, `also: ['Uniform Resource Locator', 'Web address']`). This is the section named in Part 4.
- **Fact-check status shown.** One line, from `GlossaryStamp`: "{count} terms checked, the latest on {date}" (`src/lib/glossary.ts:124-127`), and the link to `/about#facts`. Date = the latest group date (`src/lib/glossary.ts:233-236`). Each group's date is its report's `checked` header, or the later of that and its re-check when both pass (`src/content/registry.ts:349-356`, `src/content/factcheck/gate.ts:198-204`). Reports: ten full reports in `docs/fact-checks/glossary/` (filtering, layers, leases, naming, packets, pilot, security, subnets, transport, web) and two re-checks (`naming.recheck.md`, `web.recheck.md`). Headers: `"checked": "2026-11-13"` for most, `2026-11-14` for naming, security and web (for example `docs/fact-checks/glossary/naming.md:5`, `web.md:5`, `security.md:5`). The latest is **14 Nov 2026**. Expected line: "105 terms checked, the latest on 14 Nov 2026" (computed, not run).
- **What each definition shows.** Its text (the statements joined by a space, `src/lib/glossary.ts:185`), "Sources" as short names with the first citation's URL (`:130-150`, `:145` `places` joined by "; "), and "Described in" as track titles from the tied lessons, in track order (`:150-163`). Lesson ties are kept in `lessonMap` (`:188-194`) and read by `definitionsFor` (`:242-245`) for the lesson's Learn (`src/pages/[track]/[lesson].astro:11, 59`). No page links from a lesson to the glossary; `e2e/glossary.spec.ts:479-493` checks it.
- **Figures and SVGs in the HTML.** None from `src/art`. The only SVG is the 14px stamp check icon (`src/components/GlossaryStamp.astro:16-19`). The page imports no art module.

### About data

- **Counts.**
  - "tracks planned" = `tracks.length + plannedTracks.length + comingSoonTracks.length` (`about.astro:30`) = 2 + 1 + 4 = **7**. The two tracks are `src/content/tracks/index.ts:12` (How the Internet Works, Networking). `plannedTracks` is CompTIA A+ (`index.ts:25-27`). `comingSoonTracks` is Cryptography, AI Concepts, Privilege Escalation and Threat & Vulnerability Management (`index.ts:40-60`).
  - "lessons ready" = `lessonCheckCounts().total` (`src/lib/checked.ts:11-14`): distinct available slugs over the tracks. **30** per `e2e/site.spec.ts:727-730` and `src/scripts/about-page.test.ts:42`. The second is hard-coded at 30.
  - "accounts needed" = literal `0` (`about.astro:65`).
- **Coming-tracks sentence** (`src/lib/about.ts:12-17`): five planned and coming-soon titles, in order, joined by `Intl.ListFormat` with the count as a word: "Five more tracks are on the way: CompTIA A+, Cryptography, AI Concepts, Privilege Escalation, and Threat & Vulnerability Management." Built from the code's format, not run.
- **Fact-check sentence** (`src/lib/about.ts:25-31`). Counts come from `lessonCheckCounts` (`src/lib/checked.ts:11-14`) through `checkedOn` (`src/content/registry.ts:335-341`). Lesson reports: 30 non-re-check files in `docs/fact-checks/` (arp, dhcp, firewalls, ip-address, load-balancers, mac-address, nat, osi-model, packets, ports, proxies, router, subnetting, switch, tcp-udp, vpn, what-is-dhcp, what-is-dns, what-is-ftp, what-is-http, what-is-https, what-is-icmp, what-is-imap, what-is-ip, what-is-pop3, what-is-smtp, what-is-ssh, what-is-tcp, what-is-tls, what-is-udp), and 13 `*.recheck.md`. With 30 reports for 30 ready lessons, the sentence is probably the "Every lesson has also been through an independent check of every claim against those sources." branch (`src/lib/about.ts:27`). Inference from the file counts; the build was not run, and `about.test.ts` covers the wording branches.
- **Sources list.** `sourceRows(dhcp.units.flatMap((u) => u.references))` (`about.astro:36`; `src/lib/about.ts:46-51`). Each label is split at its first ": " into standard and title. Rows are the DHCP lesson's references. **Count not measured.**
- **Figures and SVGs in the HTML.**
  - Three lesson spot figures, `spot('watch')`, `spot('learn')`, `spot('practice')` (`about.astro:100, 108, 116`). Each is a `figure()` call in `src/art/figures/spots.ts`: watch (`:46`, plate label "WATCH · STEP 2 OF 4", `:62-63`), learn (`:66`, label "LEARN · PLAIN WORDS", `:86`), practice (`:90`, label "PRACTICE · 3 QUESTIONS", `:102`). Each is built by `figure()` (`spots.ts:12-15`), which sets `className: lm-svg lm-<id>` and an aria-label on the SVG. The `div.art` wrappers are not aria-hidden (`about.astro:100, 108, 116`).
  - One page figure, `pageFigure('sources')` (`about.astro:147`), wrapped in `div.a-facts__art[aria-hidden=true]`. The function is `sources()` in `src/art/figures/pages.ts:94-`, its plate label "CHECKED · 2 SOURCES" (`pages.ts:146`, inside the `figure(` call). The label is written into the drawing and is visible; the count is in the drawing, not computed.
  - One inline clock SVG in `.a-note` (`about.astro:125-133`), `aria-hidden` on the root `svg.t`.
  - No SVG from `ResetProgress`.

## Part 3: what each page shares

- **`src/components/site.css`** (imported by `glossary.astro:9` and `about.astro:16`; also by the header, `SiteHeader.astro:4`, and by `ResetProgress.tsx:3`). The rules these two pages use:
  - `.disp` (`site.css:69-78`): the Glossary h1 class (`glossary.astro:20`).
  - `.stamp`, `.stamp svg`, `a.stamp:hover` (`site.css:193-222`): the Glossary stamp (`GlossaryStamp.astro:15`).
  - `.card` (`site.css:122-126`): About's `li.card` (`about.astro:99, 107, 115`) and `.a-src` (`:149`).
  - `.toc-h` (`site.css:181-187`): About's `p.toc-h` (`about.astro:72`).
  - `.btn`, `.btn--small`, `.btn--primary` (`site.css:3-35`, `min-height: 40px` for `.btn--small`, `:36-40`): About's Reset buttons (`ResetProgress.tsx:38, 55, 67`).
  - Unused by both: `.eyebrow`, `.label`, `.lift`, `.badge`, `.h-chip`, `.segbar`, `.name-tile`.
  - The file's own comment (`site.css:66-67`) says its `.disp`, `.label` and `.h-chip` names are global on every page that loads it.
- **`src/styles/global.css`** (`BaseLayout.astro:2`). Type, colour tokens, `.wrap` (`global.css:155-159`, used by both), `.sr-only` (`:143-153`, used by `GlossaryKeys.astro:24`), the `:focus-visible` outline (`:137-141`), the reduced-motion block (`:179-188`), and `main { flex: 1 }` (`:66-68`). Global `a` is ink with an underline (`:98-107`); the Glossary's `a.gl-src` and About's `.a-sec a` set `--link` on top.
- **`src/components/hub/hub.css`**: not imported by either page. It is imported by `tracks.astro:14` and `[track]/index.astro:21`.
- **`page-hero.css`**: the file no longer exists. `find` and a repo-wide search for `page-hero` find it only in `docs/direction.md:497` ("`src/components/page-hero.css`, which only this page still used, is deleted"), `docs/superpowers/plans/2026-11-07-tracks-page.md:199` and in no source file.
- **`src/styles/card-stack.css`**: imported by `index.astro:21` and `tracks.astro:15` only. Neither page imports it. Its scoping:
  - Tokens on `:root` (`card-stack.css:9-31`), dark ink override (`:33-35`), `prefers-color-scheme` dark (`:36-40`), `--cs-stack` 4px at 860px and below (`:41-45`). The file's header comment says the header and footer read only Patch's tokens (`:6-8`).
  - `main .btn` (`:50-82`): 2px edge, offset edge at `--cs-off` 3px, `min-height: 48px`, `padding: 0 22px`, pressed translate, `main .btn--primary`. A button inside `main` gets these, the header's "Start learning" does not (comment `:48-49`). **On About the Reset buttons are inside `main`** (`ResetProgress` is in `about.astro:209`). With the file imported, `main .btn` (specificity 0,1,1) would beat `.btn--small` (0,1,0) for min-height and padding.
  - Figure tint (`:84-143`): `main, .lm-defs` sets `--fig-bg: var(--cs-card)` and the lit colours (`:87-94`); `#main .lm-svg` sets the anatomy palette (`:95-109`); dark and system-dark palettes (`:110-135`); `#main .lm-led.on` (`:136-138`); `#main .lm-orbit { display: none }` (`:140-142`). Without the file the figures use `src/art/lumen.css:196-201` (`--fig-bg: #eef1f1` light, `#0d1012` dark).
  - Opt-in classes, none used by these two pages: `.cs-card` (`:146-151`), `--beneath` (`:153-157`), `--soon` (`:159-161`), `.cs-card:has(> .cs-tab)` (`:163-165`), `.cs-tab` (`:166-184`), `--soon > .cs-tab` (`:185-188`), `.cs-tab--here::before` (`:189-196`).
  - **Comment discrepancy.** At `c336e82` the file's header says it is "Imported by Home ... the Tracks page ... and the track page (`src/pages/[track]/index.astro`) only" (its `-` line in `git diff c336e82 HEAD`). At `fb02521` it says Home and Tracks only, and `src/pages/[track]/index.astro:20-21` imports `site.css` and `hub.css`, not `card-stack.css`. The HEAD version matches the HEAD imports.
- **`src/art/lumen.css`**: `--fig-bg`, lit colours and pool values per theme (`:196-201`). `BaseLayout.astro:3` imports it on every page.
- **Glossary components** (`GlossaryEntry`, `GlossaryKeys`, `GlossaryStamp`) are imported only by `glossary.astro:4-6`. No other page or lesson imports them.
- **Glossary data in lessons.** `definitionsFor(siteGlossary().lessonMap, slug)` (`src/pages/[track]/[lesson].astro:11-12, 59`) feeds `Explanation` (`src/lesson/Explanation.tsx:7, 38`). A term opens its definition in place as a button, not a link. No lesson links to `/glossary`: `e2e/glossary.spec.ts:479-493` checks every lesson link after all nine definitions are opened.
- **Links into these pages** (all found by `grep` over `src/`):
  - Header nav: `SiteHeader.astro:17-21` lists `/tracks`, `/glossary`, `/#try`, `/#sources`, `/about`. The header renders on every page with `current` (`:8`), and `current="glossary"` / `"about"` set `aria-current` on the matching link.
  - Footer: `SiteFooter.astro:25` (`/glossary`) and `:32` (`/about`).
  - The Glossary stamp: `GlossaryStamp.astro:15` links to `/about#facts`. The `#facts` anchor is About's `section#facts` (`about.astro:141`).
  - Home: `index.astro:310`, `<a href="/about#facts">How a lesson is made and checked</a>`. Home's own `section#sources` (`index.astro:302`) is the header's "Sources" target, and About has no `#sources`.
  - Glossary-internal anchors: `#letters` (`GlossaryKeys.astro:12`, `glossary.astro:33`), `#letter-x` (`glossary.astro:30`, `GlossaryKeys.astro:18`), entry ids (`GlossaryEntry.astro:14, 25`), pointer rows to `#<entry id>` (`GlossaryEntry.astro:20`). No other file links to `/glossary#…`.
  - About-internal: `#what`, `#lessons`, `#facts`, `#credits`, `#privacy` (`about.astro:74-78`). Only `#facts` is linked from outside (above).
- **`scroll-padding-top`**: `tracks.astro:115` sets 80px for `/tracks`. A lesson page gives 69px (`tracks-card-stack.spec.ts:619`). `tracks-card-stack.spec.ts:618` asserts `auto` on `/about` and `/glossary`.
- **Header and footer on About.** `e2e/tracks-card-stack.spec.ts:751-772` asserts that the header and footer computed styles on `/tracks` equal those on `/about`, at each viewport and scheme. Changing About's own look alone does not touch those rules, since the header and footer are unscoped to About.

## Part 4: tests that pin each page

### Unit (Vitest)

- `src/lib/glossary-page.test.ts`: **21 tests in 8 `describe` blocks** (`:31-245`). Renders `glossary.astro` with `AstroContainer` and parses it with jsdom (`:1-29`). Covers the head words (`:31-38`), the stamp link to `/about#facts` and its count and date (`:40-49`), unique ids (`:51-57`), entry markup and `.gl-def` text (`:59-97`), source links (`:99-133`), no lesson or track links (`:135-173`), keys (`:175-205`), a fixture with no tracks and a fixture with no date (`:207-227`), and words, no time figure (`:234`) and no island or script in `main` (`:241`).
- `src/lib/glossary-site.test.ts`: **1 test** (`:4`), the real glossary reads each ready lesson once, with its tracks.
- `src/lib/glossary.test.ts`: **37 `it`/`test` in 11 `describe` blocks**. The data function `glossaryData` and `stampLine`, not the page. Not read line by line.
- `src/lib/about.test.ts`: **9 tests in 3 `describe` blocks** (`:6-79`): `comingTracksSentence` (`:6-22`), `factCheckSentence` (`:24-43`), `sourceRows` (`:45-79`, including the colon-in-title case and the no-colon error).
- `src/scripts/about-page.test.ts`: **5 tests** (`:33-79`). Renders `about.astro` with `AstroContainer` and parses it with jsdom (`:25-29`). Covers the stats (`:33-45`: 7 planned by the formula, 30 ready, "accounts needed" 0), the coming-tracks sentence (`:47-52`), the facts section (`:54-63`), the pace note (`:65-70`) and the analytics sentence, shown only with a token (`:72-79`). **Line 42 hard-codes `'30'`.**
- `src/scripts/about-toc.test.ts`: **8 tests** on `about-toc.ts` (`READING_LINE`, `markSectionInView`, `followSections`). Counted only; not read line by line.
- `src/styles/green-text.test.ts`: reads `about.astro` (`:21`) and pins `.a-reset [role='status']` against `tokens.bg` (`:88-89`).
- `src/lib/checked.test.ts` (4 tests) and `src/lib/checked.counts.test.ts` (1 test) cover `lessonCheckCounts`, which both About and Home use. Counted only.
- `src/content/glossary-groups/loading.test.ts` (1 test, `:4-9`): the glob takes group files only, not tests or `old/` (`decoy.ts`).
- `src/lib/home.test.ts:330-340`: the colour scan of `card-stack.css` (Home's case 15). It asserts `card-stack.css` contains no `var(--link)` and no colour value outside its two blocks. It does not read About.

### End-to-end (Playwright)

- **`e2e/glossary.spec.ts`: 33 `test(` calls** in four groups (`:38`, `:203`, `:342`, plus the lesson tests). `beforeEach` (`:30-33`) runs only `d1440-light` and `d1440-dark`. Page tests:
  - `:39-49` 200, title "Glossary · TechConcepts", one h1, stamp href `/about#facts`, text `^N terms checked, the latest on D Mon 20YY$` where N is the page's own entry count.
  - `:51-71` no `main` link reaches `/tracks` or a track; "Described in" rows hold no links; "Taught in" absent; more than 40 `main` links.
  - `:73-82` "See TTL" lands `#ttl` below the sticky foot, at 375 and 1440.
  - `:98-110` landing on `#ttl` is below the foot, inside the first screen, and tinted (`inset` box-shadow).
  - `:112-141` keys are the letter sections; dashed count `26 - alphabet` (`:120`); a key puts the bar at 68 to 80px (375); Tab from the bar reaches "All letters"; at 1440 the bar sits below the keys (`:132-140`).
  - `:143-154` **the held failure**, below.
  - `:156-164` no sideways scroll at 320, 375, 768, 959, 960, 1280 and 1440, at the top and the foot.
  - `:166-169` no time figure.
  - `:171-201` layout: stacked at 375 (`:176-181`), name beside the definition at 768 (`:182-186`), three columns at 1440 (`:187-193`, `def.width <= 612.5`), 220px `dt` at 960 (`:194-195`), 280px `dt` and 300px `.gl-foot` at 1200 (`:196-200`).
  - `:203-262` touch, `hasTouch` and `isMobile`: rows, stamp and "All letters" are 44px or more and no two link boxes overlap at 375 and 768 (`:206-223`); each "Described in" row is 26px for one line plus 20px per line, with no link (`:225-248`); at 1024 links keep 44px (`:249-253`); keys are at least 44px at 375 (`:254-261`).
  - `:264-269` with a mouse at 1440, links are 26px and TTL's is 34px.
  - `:271-287` at 1440 with a mouse, "Described in" is 26px (46px for IP address), 4px under Sources, `--ink`, 600 weight, no underline.
  - `:289-314` without JavaScript: `main` HTML is equal to the JS-on HTML, has no `astro-island` or `<script`, and keys and `#ttl` work.
  - `:316-322` loading the Glossary leaves `localStorage` unchanged.
  - The rest of the file (`:325-570`) tests the lesson's Learn definitions, not the page.
- **`e2e/site.spec.ts`** (inside the `desktop` describe unless noted):
  - `:80-83` the og:image:alt test, which includes About.
  - `:288-291` Home's "How a lesson is made and checked" links to `/about#facts`.
  - `:365-370` no time figure on `/about` and `/glossary`.
  - `:390-424` "Start learning" opens `/tracks` on Home, About and 404 (`:422` opens `/about`).
  - `:427-437` the header's five links and hrefs on each listed page (`:431-437` assert them on `/glossary`).
  - `:441-448` Glossary is `aria-current="page"` only on `/glossary`.
  - `:450-460` the footer lists Glossary and opens `/glossary`.
  - `:481-483` at 959px on `/glossary` the menu lists the five plus "Start learning".
  - `:727-730` **About says 30 lessons ready** (a lesson two tracks list counts once).
  - `:788-822` Reset progress on `/about` clears progress (`:822` opens `/about`).
  - `:907-935` About states where progress lives, credits, and the reset flow (`:913-935`), including the table text (`:916-921`) and the analytics sentence absent with no token (`:922-923`).
  - `:1021-1035` phone project (`@phone`): every `SITE_PAGES` entry loads and scrolls with no errors, including `/about` and `/glossary`.
  - `:1823-1851` (B20 describe): header is the same on `/` and `/about` (`:1829`).
- **`e2e/tracks-card-stack.spec.ts`**:
  - `:612-620` `scroll-padding-top` is `auto` on `/about` and `/glossary` (`:618`).
  - `:751-772` header and footer computed styles equal on `/tracks` and `/about`.
  - `:793-799` `/about` and `/glossary` do **not** read the Card stack's names: `--cs-edge` must be empty there. This test will need to change when either page takes the look.
- **`e2e/visual.spec.ts:54-100`** (`@visual`): screenshots of every `SITE_PAGES` entry, which includes `about` and `glossary` (`support.ts:49-50`), at each size and both themes, saved as `test-results/visual/*.png`. The test asserts only `data-theme`, `animationsDone`, and no console errors. There is no `toHaveScreenshot` in `e2e/`, so no pixel comparison. `playwright.config.ts:28` leaves the file out of every project but `d1440-dark`.
- **`e2e/support.ts`**: `SITE_PAGES` (`:44-52`) includes `{ name: 'about', path: '/about' }` and `{ name: 'glossary', path: '/glossary' }`. Helpers used by the Glossary spec: `hydrated`, `open` (`:57-65`), `settledFrame` (`:83-86`), `pageOverflow` (`:93-100`), `kicker` (`:104-105`). `transitionsDone` (`:88-91`) is not used by the Glossary spec.
- **`e2e/global-setup.ts`**: no glossary or About reference. It reads the ready lessons from `/tracks` and the track pages (`:16-43`), and checks that each stop says "Checked" (`:38-40`).

### The held failure: `e2e/glossary.spec.ts:143-154`

- **Test name:** "scrolled into the middle of the last letter at 375, its bar sticks at 68px and "All letters" brings the keys back". The brief names `:143`, which is where the test starts. The direction doc (`docs/direction.md:195, 197`) refers to it as `:141`, from an older numbering.
- **What it asserts.** At 375×812, it scrolls the window so the midpoint of the last `section.gl-letter` is at the top of the viewport (`:146-148`). After `settledFrame`, it expects the last letter's `.gl-bar` to be within 1px of y = 68 (`:150-151`). It then clicks "All letters" in that bar and expects `#letters` in the viewport (`:152-153`).
- **Why it might fail.**
  - The last letter is **W**, which holds one row: the pointer "Web address" (`src/content/glossary-groups/web.ts:88-90`). Its section is a name tape and one "See URL" line, with no definition.
  - The bar is `position: sticky; top: 68px` (`glossary.astro:64`), and a sticky element stays only while its containing block, here `section.gl-letter`, extends below it. Scrolled to the midpoint, the section's bottom is only about half its height below the top of the window. A short section cannot keep the bar at 68px while the bar is still inside it.
  - The page does not end at W: the footer follows `main`, so the scroll is not clamped by the document's end. The shortfall comes from the section, not the page.
  - The header is 68px high plus a 1px border (`SiteHeader.astro:94-107`), so the bar at 68 sits 1px under the border. The test's 1px tolerance covers that.
  - I have not measured the W section's height. The direction doc records the failure as "the page's end is too short" (`docs/direction.md:195, 197`). The mechanism above is my reading of the CSS, not a measured result.

## Part 5: narrow screens

### Glossary media queries (`glossary.astro`)

- Base (no query): h1 64px (`:46`), lead 20px (`:47`), note 16px (`:48`), stamp 44px tall with `white-space: normal` (`:51`). Keys `.gl-az ul` 13 columns (`:55`).
- `(max-width: 599px)` (`:143-148`): h1 44px, lead 18px, keys margin `-16px`, 7 columns, 5px gap.
- `(max-width: 359px)` (`:149-151`): keys 6 columns.
- `(min-width: 640px)` (`:102-108`): entry becomes a grid, name column 180px, definition beside it (`:103-106`).
- `(min-width: 640px)` (`:117-119`): `.gl-entry--see` padding.
- `(min-width: 960px)` (`:109-116`): ledger, 220px `dt` column, `dd` with a 220px sources column (`:112`), `.gl-foot` top margin 0 (`:114`).
- `(min-width: 1200px)` (`:120-123`): 280px `dt`, 300px sources column.
- `(min-width: 960px) and (pointer: fine)` (`:125-130`): link padding 3px, so links are 26px.
- `(min-width: 1280px)` (`:133-140`): `.gl-az` becomes sticky at `top: 68px`, z 6, 26 columns (`:134-135`); `.gl-bar` becomes static (`:136`); `.gl-up` is hidden (`:137`); scroll margins change (`:138-139`).

**Sticky elements.** Below 1280px, only `.gl-bar` sticks (`:64`, `top: 68px`, z 5), to its own section. From 1280px, `.gl-az` also sticks (`:134`) and `.gl-bar` does not (`:136`). Between 640 and 1279 the keys scroll away. No sticky element is tied to a phone-only rule.

**Phone-design comments.** `glossary.astro:49` says the stamp's "words stay one line down to 320px". No comment on the Glossary or About says a phone layout is not designed. The only "not designed yet" comment in the area is `src/pages/[track]/index.astro:205`, which is the track page, not these pages.

### About media queries (`about.astro`)

- `(max-width: 860px)` (`:563-601`), the only query on About:
  - `.a-open__row` one column, top aligned (`:564-567`).
  - `.a-body` one column (`:568-570`).
  - `.a-toc` static, not sticky (`:572-574`). The comment at `:571` says: "On a phone the list of sections is a row to swipe, under the opening and no longer stuck."
  - `.a-toc .toc-h` hidden (`:575-577`).
  - `.a-toc ol` a horizontal scroll row (`:578-583`); `.a-toc a` bordered, 4px radius, nowrap (`:584-588`); `[aria-current]` border red (`:589-591`).
  - `.a-steps li` 110px art column instead of 220px (`:592-594`).
  - `.a-facts` one column (`:595-597`); `.a-facts__art` max 300px (`:598-600`).
- Sticky: `.a-toc` is sticky at `top: 96px` only above 860px (`:316-319`).
- `.a-open h1` uses `clamp(44px, 7.4vw, 104px)` (`:264`) with no query.

### Card stack

- `card-stack.css` has one query, `(max-width: 860px)` (`:41-45`), which sets `--cs-stack` to 4px. Its comment at `:6-8` and `:48-49` covers scope, and nothing mentions a phone layout.

## Part 6: leftovers

- **Glossary.** Every class in `glossary.astro`'s styles appears in a component or the page. One markup class has no rule: `div.gl-body` (`GlossaryEntry.astro:36`). There are no dead rules I could find. Repeated declarations, not dead ones: `.gl-entry--see dd { padding-top: 0 }` appears at `:96` and `:107`; the `(min-width: 640px)` `.gl-entry--see` padding (`:118`) overrides `:95`.
- **About.** Every class in `about.astro`'s styles is used in the markup or by the island (`.a-reset .q` `ResetProgress.tsx:50`, `.a-reset [role='group']` `:49`, `.a-reset [role='status']` `:77`). `.a-toc .toc-h` duplicates `site.css:181-187`, and the page's `html { scroll-behavior: smooth }` (`:224-226`) is overridden to `auto` by `global.css:179-188` under reduced motion (`about.astro:227-231` does the same).
- **Tokens that paint nothing.** `--shadow-sm` and `--btn-shadow` are zero-size transparent shadows (`src/styles/tokens.ts:47-49, 84, 86`). Neither page reads them. `site.css:225-235` `.lift` uses `--shadow-sm`, and neither page uses `.lift`.
- **Stale files and references.** `page-hero.css` is gone (`docs/direction.md:497`). One historical plan still names it: `docs/superpowers/plans/2026-11-07-tracks-page.md:199`. The 2026-11-09 site-layouts plan does not. `src/content/glossary-groups/old/decoy.ts` sits in a folder that the glob does not read (it is a fixture, `loading.test.ts`).
- **Comments naming old designs.** `glossary.astro:100-101` ("D8 set two columns of stacked entries here"), `glossary.astro:49` ("NEW: the page's stamp"), `glossary.astro:75`, `:78`, `:83`, `:93` ("NEW:"). These are dated annotations, not dead code.
- **Unused exports or helpers used by these pages.** None found. `definitionsFor` is used by the lesson route. `DIGITS`, `FULL_ALPHABET_FROM`, `stampLine` and `glossaryData` are used by the page.

## Part 7: what `docs/direction.md` says about each page

### About

- **§11 "The track page, About and 404 (built 2026-11-10)"** (`docs/direction.md:480-499`).
  - "About: plain, and the same words." Every sentence and section of the old page is kept; the layout is new (`:486-487`).
  - The opening is the line set large, the one-paragraph description, and three counts: tracks planned, lessons ready, accounts needed. The eyebrow chip, accent half-headline and "How the web works" plate are gone.
  - The list of sections stays beside a reading column; on a phone it is a row to swipe.
  - "How a lesson works" is three rows in order, each with its small figure.
  - "Where the facts come from" has the `sources` figure beside the count of checked lessons.
  - Credits names Barlow Semi Condensed.
  - `src/components/page-hero.css` is deleted (`:497`).
  - Measured (`:499`): "The page is 5,179px tall at 390 wide, from 6,377px."
- **§6** (`:224`): "Patch is the Lesson page's look and the header's and footer's; every other page moves to Card stack (§9), one job at a time. Until a page has moved, it keeps Patch."
- **§3 roadmap, item 6** (`:168`): "Home, the track page, About and 404. DONE 2026-11-10." About's layout was rebuilt in plain Patch.

### Glossary

- **Phase 5 "the Glossary — PAUSED 2026-11-14 (the owner)"** (`docs/direction.md:191-197`). Read in order:
  - D9 (`prototypes/d9-glossary`): the Glossary page with each definition, its sources by name and the lessons that teach it; a term in Learn opens its definition (`:193`).
  - Batches 1 to 3 merged: "105 entries are live in all" (`:195`).
  - "**Stopped for the owner:** with the new last letter W, `e2e/glossary.spec.ts:141` fails at 375 (the page's end is too short), which B10a as drawn does not fix; the page's end goes to the designer and the owner's design gate before batch 4" (`:195`).
  - "**Paused by the owner on 2026-11-14** (decision 2.48)" (`:197`): the page's end at 375 is still held, and "goes to the designer and the design gate when the glossary resumes".
- **Decisions**:
  - 2.37 (`:66`): Phase 5 as the Practice page (superseded).
  - 2.38 (`:67`): "a simple glossary"; "concept terms used in the Tracks".
  - 2.39 (`:68`): written definitions with citations.
  - 2.40 (`:69`): the check path for groups.
  - 2.41 (`:70`): how the page is built: data from one pure function; "Without JavaScript a lesson serves only its Overview".
  - 2.42 (`:71`): the list of 113 terms, all approved.
  - 2.43 (`:72`): **the Glossary is a page of its own**. A definition names the tracks as plain text ("Described in"), and neither the Glossary nor a lesson links to the other. The lesson's Learn still opens a term's definition in place.
  - 2.44 to 2.47 (`:73-76`): job 10's plan and batches.
  - 2.48 (`:77`): paused; the page's end at 375 is held (`e2e/glossary.spec.ts:141`, red on `revamp`).
- **Later decisions that name the Glossary's or About's look.** Only 2.84 (`:111`): "Card stack replaces Patch on every page but the Lesson page"; "the pages move one job at a time … Tracks first (job 18, 2.85), then the track page, About, the Glossary and 404, in an order set when each is planned." The header and footer keep their present style (2.84, 2.81). Later decisions 2.89 (`:116`, Tracks built in Card stack), 2.95 (`:122`, header onto the Lesson page), and 2.102 (`:129`) do not name the Glossary's or About's layout.
- **Header and sticky heights.** `docs/direction.md:272` says the header is 69px at every width, which matches `SiteHeader.astro:94-107`.

## Part 8: measured (the orchestrator)


Built on `revamp` c336e82 (`npm run build`, "Every page is within budget (42 pages)"), served from `dist/`, headless Chromium, light scheme, fonts loaded.

| | `/glossary` | `/about` |
|---|---|---|
| 1440 × 900 | 20,847px | 4,826px |
| 390 × 844 | 48,737px | 6,483px |
| 375 × 812 | 50,158px | 6,883px |
| 320 × 640 | 57,255px | 8,466px |
| Sideways scroll | none | **at 320 to 356px wide the page is 357px wide**: the opening's three counts (`dl`, its third `div` "accounts needed" / "0") end at x 357; none from 360 |
| HTML gzipped (the build's table) | 34.6 KB | 51.6 KB |
| HTML raw | 213,197 bytes | 233,559 bytes |
| `<script>` elements in the page | 2 | 5 |
| A box that scrolls inside the page | none | none |
