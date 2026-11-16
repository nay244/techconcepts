# S18: Home's demo, facts for the Home design job (2026-11-15)

Scout's report (Haiku 5.5), read-only, in the worktree `objective-taussig-eb7520` (branch `claude/objective-taussig-eb7520`). Paths are repo-relative. Every fact is path:line from the files as they stand. Nothing was edited, built or run. Pixel figures marked "computed" come from the CSS and the viewBox in the source, not from a browser.

## Part 1: the demo's structure (Q1)

**Where the radios are declared.** All three groups are inside `<div class="demo">` (`src/pages/index.astro:107`), before the panel `<div class="demo__ui">` (`index.astro:117`), so they are the panel's preceding siblings. Each is a `class="demo__in" type="radio"`:

| Group | Declared at | ids | name | aria-label |
|---|---|---|---|---|
| Part (Watch / Learn / Practice) | `index.astro:109` | `demo-watch`, `demo-learn`, `demo-practice`; `checked` on the first | `demo-part` | "Watch part", "Learn part", "Practice part" |
| Step | `index.astro:110-114` | `demo-s1` ... `demo-s5` (`demo-s${step.n}`); `checked` on step 1 | `demo-step` | "Watch, step N of 5: <title>" |
| Answer | `index.astro:115` | `demo-a1` ... `demo-a3` (one per option, no default) | `demo-answer` | "Answer: <option text>" |

The count of steps and answers comes from the content (`demo.steps`, `demo.practice.options`), not from a fixed list.

**Labels that act as controls.** All are `<label for=...>`:
- Part tabs: `index.astro:118-120`. The container `<div class="demo__parts" aria-hidden="true">` hides them from the accessibility tree; the radios' own aria-labels carry the names.
- Step rows (the "steps"): `index.astro:127` `<ol class="demo__rows" aria-hidden="true">`, each row `<label class="demo__row" for="demo-sN">` at `index.astro:131`.
- "Next step" and "Go to Learn" (Watch): `index.astro:165-179`. Container `aria-hidden="true"` at `index.astro:165`; "Next step" is `for="demo-s${n+1}"` (`index.astro:169`); the last step's button reads "Go to Learn" and points at `for="demo-learn"` (`index.astro:171-175`).
- "Go to Practice" (Learn): `index.astro:234-236`, container `aria-hidden="true"`, `for="demo-practice"`.
- Answers: `index.astro:241` `<div class="demo__picks" aria-hidden="true">`, each `<label class="demo__pick" for="demo-aN">` at `index.astro:244`.
- There is no "Back" control anywhere in the demo. The only way back is a part tab, a step row, or the arrow keys (the radios are one group each).

**Which elements are aria-hidden.** `index.astro:118` (part tabs), `:127` (step list), `:165` (Next buttons), `:234` (Learn's Next button), `:241` (answer labels). The narration `aria-live="polite"` is `index.astro:142`; the feedback `aria-live="polite"` is `index.astro:250`. The figure `<figure class="demo__scene">` (`index.astro:122-124`) has no aria-hidden. The Learn part's Sources list `<List ... aria-label="Sources">` is `index.astro:205` and the folded list `index.astro:222`.

**How CSS shows and hides the parts, steps and answers.** The CSS is generated in the frontmatter, not written in `<style>`, and inserted by `<style is:inline set:html={css.join('\n')}>` at `index.astro:108`:
- Helper: `when(...ids)` builds `#id:checked ~ ... ~ .demo__ui` (`index.astro:41`). The focus ring helper `focus(id)` is at `index.astro:42`.
- Before any choice: `.home-trail{opacity:0}` and `.demo__ui #nm-page [data-part]{opacity:0}` (`index.astro:45`).
- Parts: for each part, `${when('demo-'+part)} .demo__pane--${part}{display:block}` (`index.astro:47`); the active tab's label gets the lit style (`index.astro:48`); focus outline (`index.astro:49`).
- Steps: `${when(stepId)} .demo__say--N{display:block}` (`index.astro:53`); "Next" for that step `.demo__next--N{display:inline-flex}` (`index.astro:54`); the active row's border and fill (`:55-56`); earlier rows show a done state (`:58-60`); the trail and busy-part lights (`:63-64`).
- Answers: `${when(answerId)} .demo__why--N{display:block}` (`index.astro:77`), the picked answer's border (`:78`), focus (`:79`).
- Static rules that set the base state: `.demo__pane{display:none}` (`index.astro:460-466`), `.demo__say, .demo__why{display:none}` (`index.astro:511-518`), `.demo__next{display:none}` and `.demo__next--on{display:inline-flex}` (`index.astro:569-574`).
- The pane for Learn and Practice is `display:none` unless its part is checked (the same `.demo__pane` rule plus the generated `when()` rule). The Watch pane's Next labels are per step.

**Are the radios and labels reachable by Tab when hidden?** The radios themselves are never `display:none`. `.demo__in` (`index.astro:404-412`) is `position:absolute; width:1px; height:1px; opacity:0; pointer-events:none` and sits before the panel, so it stays in the DOM and in the tab order. Nothing sets `visibility:hidden` or `hidden` on them.
- A hidden part's panes are `display:none` (`index.astro:460-466`). Their labels (the step rows at `index.astro:131`, the answer labels at `index.astro:244`) disappear with them, but the radios they belong to do not. So the answer radios `demo-a1..a3` and the step radios are still focusable while Watch is shown, and the answer radios while Learn is shown, with no visible focus ring (the focus ring rule styles a label inside `.demo__ui`, `index.astro:42`).
- The browser's radio-group rule (standard HTML behaviour, not checked by a test here): within one `name` group Tab stops on the checked radio only. Under that rule, Tab reaches the part group, the step group and the answer group once each, and the answer group's stop is on a radio with no visible label while Watch is shown. Arrow keys move within a group. No test in the repo pins the Tab stops (see Part 7).

## Part 2: the phone view at 375px (Q2)

**Breakpoint and rules.** The demo's phone rules are one block, `@media (max-width: 860px)` at `src/pages/index.astro:824`. The part that matters for the demo:
- `.demo__ui` becomes one column with areas `'parts' 'scene' 'pane'` (`index.astro:829-833`). Order on the phone: part tabs, then the figure, then the panel (step rows, narration with its messages, then the Next control at the foot of the panel, `index.astro:126-180`).
- `.demo__scene` loses its right border, gains a bottom border, and has `padding: 6px` (`index.astro:834-838`).
- `.demo__pane{min-height:0}` (`index.astro:839-841`). On a phone the panel has no minimum height.
- Desktop-only rules: `.demo__ui` two columns `minmax(0,1.5fr) minmax(300px,1fr)` with areas `'scene parts' 'scene pane'` (`index.astro:415-417`), `.demo__pane` min-height 452px (`index.astro:463-464`).
- The rules at `index.astro:666-674` are the Learn sources' phone rules (44px rows); they are not the figure's.

**The figure's size and scaling.**
- The figure is `<figure class="demo__scene">` (`index.astro:122`) holding the SVG from `demo.scene` (`index.astro:123`). The SVG is `<svg data-figure="net-map" class="lm-svg nm" viewBox="-98 -60 685 378" ...>` (the viewBox is pinned by `src/art/scenes/net-map.test.ts:155` and `:188`).
- The viewBox is computed for the whole map, not for one layer: `src/art/scenes/net-map.ts:469` makes one frame "for every protocol", and `drawNetMap(only)` keeps that frame when it draws only some layers (`net-map.ts:509-513`; the test at `src/art/scenes/net-map.test.ts:269` checks the part and whole share a viewBox).
- The width rule is `.demo__scene :global(svg){width:100%; max-height:100%}` (`index.astro:451-454`). The base SVG rule `.lm-svg{display:block; width:100%; height:auto; overflow:visible}` (`src/art/lumen.css:123-131`) makes the height follow the width. Nothing sets a height on the phone, so the figure is sized by its width alone.
- Computed, not measured: the content box is 375 minus `.wrap` padding of 32px on each side (`src/styles/global.css:155-159`; no phone override found in that file) = 311px. Minus the panel's 1px border on each side (`index.astro:418`) = 309px. Minus the figure's 6px padding on each side (`index.astro:837`) = 297px wide for the SVG. Scale = 297 / 685 = about 0.43 px per viewBox unit. The figure is about 164px tall (297 x 378 / 685).
- Effect on the labels: the map's text is set in viewBox units (for example the call names at 11.5px, `src/art/scenes/net-map.css:6`, and the sub-lines at 13px, `:7`), so at about 0.43 scale an 11.5-unit label is about 5px on screen. This is the same drawing the Lesson page uses.

**Where the narration sits relative to the scene and the Next control.** On a phone, narration (`.demo__says`, `index.astro:142`) and its messages sit below the figure, inside the panel. The Next control (`.demo__nexts`, `index.astro:165`) sits below the narration and the message list, at the bottom of the panel. The figure is above both. Nothing is fixed or sticky; the demo has no sticky control.

**The critique's pointer at index.astro:829-838.** That block is the phone grid and figure rules (`.demo__ui` 829-833, `.demo__scene` 834-838). The figure there is the single-column `svg` at 100% width described above.

**How the map is drawn.**
- Home's figure: `src/lib/home.ts:133` calls `drawNetMap(unit.scene.layers)`. For lesson 1 `unit.scene.layers` is `['http:web']` (`src/content/lessons/what-is-http.ts:105`), so the call is effectively `drawNetMap(['http:web'])`. The function is `drawNetMap` in `src/art/scenes/net-map.ts:509`, built on `mapSvg(only)` at `:461`.
- Home's still copy has no driver. Its words are written at build time (`src/lib/home.ts:173`, using `write()` at `:99`), and its trails are drawn as `<polyline class="nm-trail home-trail">` from the map's own routes (`src/lib/home.ts:141-150`).
- The Lesson page's phone figure: the lesson names `figure: 'net-map'` (`src/content/lessons/what-is-http.ts:89`), which the registry draws with the same function (`src/art/scenes/index.ts:15-18`, `'net-map': drawNetMap`). The lesson's driver then moves the parts (`src/scenes/drivers/net-map.ts`, header comment at `:9`). So the Lesson page's SVG is the same drawing, the same viewBox, and the same label sizes as Home's; only the layers shown differ (all of them, hidden until driven, on the Lesson page).

**Lesson page phone sizing (for the comparison).**
- The phone stage height is `--ph-stage: 34dvh` (reading: `18dvh`) at `src/lesson/console.css:1384-1400` (the phone media block starts at `:1384`).
- `.stage__figure{position:absolute; inset:0}` (`src/lesson/console.css:629-631`), and its SVG is `position:absolute; inset:0; width:100%; height:100%; max-width:940px; max-height:440px` (`:638-646`). The default `preserveAspectRatio` (meet) fits the viewBox inside that box.
- Computed: at 375 wide, a full-width stage gives about 375 / 685 = 0.55 scale; the height limit (34dvh of 812px, about 276px, over 378 units) allows 0.73, so the width limits it. The Lesson's map is therefore about 0.55 per unit and Home's about 0.43. Same drawing, same cause (a 685-unit-wide frame on a 375px screen), a different container width. Neither is measured in a browser here.

## Part 3: what sets the demo frame's height (Q3)

- **Desktop (861px and up).** The panel `.demo__pane` has `min-height: 452px` (`src/pages/index.astro:460-466`, the value at `:464`). Its comment says the minimum is "Tall enough for the longest part, so the scene beside it keeps its size as the parts change" (`index.astro:463`). The panel's padding is `16px 18px 18px` (`index.astro:465`). The frame is a two-column grid: the figure spans both rows (`grid-template-areas: 'scene parts' 'scene pane'`, `index.astro:415-417`, rows `auto 1fr` at `:416`). The part tabs are `min-height: 48px` (`index.astro:433`). So desktop frame height = tabs (about 48px) + the taller of the panel's content and 452px, plus borders. A part whose content is taller than 452px makes the frame taller; nothing caps it.
- **Phone (860px and down).** `.demo__pane{min-height:0}` (`index.astro:839-841`). Nothing else sets a height: `.demo` (`index.astro:401-403`) and `.demo__ui` (`:413-422`) have no height. On a phone the frame height is the tabs, plus the figure's height (its width drives it, see Part 2), plus the panel's content for the current part. Each part changes that height.
- **The figure itself has no min-height and no max-height on the frame.** `.demo__scene` padding is `12px` on desktop (`index.astro:442-450`, padding at `:447`) and `6px` on a phone (`:837`). The SVG has `max-height:100%` (`index.astro:451-454`), which resolves against an auto row and so does nothing on the phone.
- **What each part contains (what drives its height).** Watch: five step rows (`index.astro:127-141`), then the narration and its message list (`:142-164`), then the Next control (`:165-179`). Learn: the lead, the six terms, the HTTPS pointer, the stamp and sources, the Go to Practice control (`:182-237`). Practice: the lead, three answers, the feedback paragraphs, the closing line (`:239-262`). Learn's sources are folded by default (`index.astro:215-232`); opened, they add rows.
- **Tests on the heights.** None pins the demo frame's height. The only height assertions for Home's demo are for the Learn sources block: block at most 115px on a phone and 99px on a desktop, and the summary control at least 44px (`e2e/site.spec.ts:1647-1657`, the block's own bound at `:1651`). The e2e spec's `452` match is in `e2e/tablet.spec.ts:186` and belongs to the lesson's stage, not Home.

## Part 4: shared code with the lesson console (Q4)

**No.** Neither `src/pages/index.astro` nor `src/lib/home.ts` imports `src/engine/playback.ts`, `src/lesson/PlaybackControls.tsx` or `src/lesson/console.css`. The only files that import those are the console itself: `src/lesson/LessonConsole.tsx:5` (`../engine/playback`), `:17` (`./PlaybackControls`) and `:24` (`./console.css`). `src/lesson/ScenePanel.tsx:4` imports only a type from `engine/playback`.

**Imports of `src/pages/index.astro`** (`index.astro:7-18`):

| Line | Import | What it is for Home |
|---|---|---|
| 7 | `../art/figures/covers` (`coverStill`, `CoverId`) | Track cover art (art module) |
| 8 | `../art/figures/pages` (`pageFigure`) | The `sources` and `inside` figures |
| 9 | `../art/ids` (`cropViewBox`) | Crops the cover art |
| 10 | `../lib/about` (`factCheckSentence`) | The "where the facts come from" sentence |
| 11 | `../lib/checked` (`lessonCheckCounts`) | Checked-lesson counts |
| 12 | `../lib/home` (`foldSources`, `homeDemo`, `homeStops`, `litSteps`) | The demo's content, see below |
| 13 | `../lib/start` (`startLesson`) | The first lesson, for the Start buttons |
| 14 | `../lesson/Rich` (`Rich`) | Renders `**bold**` in lesson text. `src/lesson/Rich.tsx:1` imports only `react`'s `Fragment` and holds no console code |
| 15 | `../components/Stamp` | The "Checked ..." stamp. `src/components/Stamp.tsx:1-2` imports `../lib/stamp` and `./site.css` |
| 16 | `../layouts/BaseLayout.astro` | The page shell |
| 17 | `../art/scenes/net-map.css` | The map's CSS (the demo's SVG) |
| 18 | `../components/site.css` | Site styles |

`BaseLayout.astro:2-10` imports `styles/global.css`, `art/lumen.css`, `LumenDefs.astro`, `SiteHeader.astro`, `SiteFooter.astro`, `lib/analytics`, `lib/theme`, `lib/url`, `styles/tokens`. None of them is a lesson-console file.

**Imports of `src/lib/home.ts`** (the demo's builder): `art/figures/covers` (type, line 4), `art/scenes/net-map` (`drawNetMap`, line 5), `content/registry` (line 6), `content/tracks` (line 7), `engine/timeline` (`positionOf`, line 8; `src/engine/timeline.ts:1-2` imports `content/schema` and `./tables`, not `playback`), `lesson/sourceNumbers` (`numberedSources`, line 9; `src/lesson/sourceNumbers.ts:1-2` imports types only), `lib/checked` (line 10), `lib/stamp` (type, line 11), `lib/text` (line 12), `lib/tracks-page` (line 13).

**Shared with the console:** no code from `playback.ts`, `PlaybackControls.tsx` or `console.css`. Two modules in `src/lesson/` are shared with the lesson page, but neither is console code: `src/lesson/Rich.tsx`, which `src/lesson/Explanation.tsx` and `src/lesson/Practice.tsx` also import, and `src/lesson/sourceNumbers.ts`, which `src/lesson/Explanation.tsx:16` and `src/lesson/Marks.tsx:2` also import. Home also takes `positionOf` from `engine/timeline` for its deep links (`src/lib/home.ts:180`).

## Part 5: where the demo's words come from (Q5)

The demo is built at build time by `homeDemo()` (`src/lib/home.ts:118`), called from `src/pages/index.astro:21`. It defaults to `slug = 'what-is-http'` and `sealedSlug = 'what-is-https'` (`home.ts:118`). It reads the registry's entries and lesson objects (`home.ts:119-127`, `getEntries`, `getLesson`), and throws at build time if either lesson is not ready (`home.ts:118-126`), is not on the network map (`home.ts:128`), has no page cue (`home.ts:168`), or has a stamp whose source count differs from its list (`home.ts:177-179`).

| Demo part | Source field | Where Home reads it |
|---|---|---|
| Watch: five steps, titles, subtitles, narration | `unit.steps` in `src/content/lessons/what-is-http.ts:132` (`steps: [`); `title`, `sub`, `narrative` per step | `src/lib/home.ts:142-163` (the `steps` map; the narration is `narrative`, `:160`) |
| Watch: messages each step sends | `step.events` filtered to `type === 'message'` (`home.ts:143`); `from`, `to`, `tag`, `kind`; names from `unit.scene.parties` (`home.ts:135-136`) | `home.ts:143`, `:161` |
| Watch: lit ways and busy parts | the first message's route in the map's own `routes` (`home.ts:145-150`) | `home.ts:141-151` |
| Watch: the page on the laptop (words and pictures) | events' `cues` with `cue === 'page'`; `page: 'full'` marks the pictures (`src/content/lessons/what-is-http.ts:524`) | `home.ts:166-167` (`cued`), `src/lib/home.ts:166-167` (the same cue, read as `e.cues`) |
| Scene (the map) | `unit.scene.layers` (`what-is-http.ts:105`, `['http:web']`), `unit.scene.parties` (`:110`), `unit.scene.labels` (`:106`) | `home.ts:133` (`drawNetMap`), `:172-173` (labels written into `nm-lapState` and `nm-url`) |
| Learn: the lead | `unit.learn.lead` (`what-is-http.ts:531`, `learn: {`) joined by `leadText()` | `home.ts:185` (`lead: leadText(unit.learn.lead)`), `leadText` at `home.ts:106-108` |
| Learn: terms | `unit.learn.terms`, first six (`TERMS = 6`, `home.ts:111`) | `home.ts:186` |
| Learn: sources | `numberedSources(unit)` (`home.ts:175`, from `src/lesson/sourceNumbers.ts`) | `home.ts:187` |
| Learn: stamp | `lessonStamp(lesson)` (`home.ts:176`, from `src/lib/checked.ts`) | `home.ts:189` (`stamp`) |
| Learn: the sealed pointer (HTTPS) | `getLesson('what-is-https')`, its `units[0].learn.lead` and its entry's URL and number | `home.ts:127`, `:191` |
| Practice: prompt and options | `unit.practice[0]` (`home.ts:130`); `prompt`, `options` with `text`, `feedback`, and `answer` index (`what-is-http.ts:761`, `practice: [`) | `home.ts:192-193` |
| Deep links into the full lesson | `positionOf(lesson, 0, kind)` (`src/engine/timeline.ts`, imported at `home.ts:8`) | `home.ts:180` |
| Stops on the cable (tracks, lesson counts) | `homeStops()` (`home.ts:222`) | `index.astro:22`, `:272-292` |

**Home's own words (not from a lesson file).** These are typed in `index.astro` and do not follow the lesson:
- The hero: "See how technology really works." (`index.astro:88`), its subtitle (`:90`), "Start with lesson 1: {start.title}" (`:92`), and "See the tracks" (`:93`).
- The demo's intro "A browser asks a web server for a page." (`:102-103`).
- The part names "Watch", "Learn", "Practice" (`index.astro:27`, from `PART_WORDS`), and the aria-labels "Watch part" etc. (`:109`).
- The control labels "Next step" (`index.astro:170`), "Go to Learn" (`:174`), "Go to Practice" (`:235`).
- "And {sealed.title}?" and "Lesson N: title" (`index.astro:195-198`).
- Learn's source control labels "Show the other N" / "Hide the other N" (`index.astro:219-220`) and the aria-label "Sources" (`:205`).
- Practice's "Nothing is scored." (`index.astro:260`).
- The track copy and the facts sentence (`index.astro:304`, `:314`).
- Note: the lesson words Home shows are quoted by its tests (`e2e/site.spec.ts:1699-1708`), and the Learn lead's wording is checked by `src/lib/home.test.ts:74-84`.

## Part 6: decisions and specs (Q6)

**`docs/direction.md` §2 rows that touch Home (numbered rows):**
- Row 1.2 (`docs/direction.md:20`): the revamp changes "the look and the layouts of the whole site", with Home getting "new layouts", and the Tracks and Lesson pages as starting points.
- Row 2.10 (`:101`): carried over: "no Continue on Home or in the header", "Watch › Learn › Practice with Practice unscored", "original art", and the 2026-11-09 Home layout "see 1.2".
- Row 2.22 (`:50`): "Home's demo lists every source of this lesson in one line ... so that list goes to the designer and the owner's gate"; "The Watch tab keeps its five steps unless a source forces a change, since progress positions and Home rest on them."
- Row 2.23 (`:51`): WHATWG sources; the first line "In HTTP/1.1, getting a web page is a conversation in plain text"; "The page is drawn when the stylesheet arrives"; "Home's demo follows the lesson."
- Row 2.26 (`:54`): "Home's page is unchanged; three samples in Home's tests follow (H2)."
- Row 2.27 (`:55`): "There is no unit for Home" for batch 2.
- Row 2.30 (`:59`): "Home gets a unit only if a ruling moves What is POP3's `full` page cue."
- Row 2.31 (`:60`): "What is POP3 keeps both page cues ... so Home's sample holds and Home needs no unit."
- Row 2.69 (`:96`) is job 15 (Lesson flow); it says D14 changes only `prototypes/` and "Not in this job: ... every other page", so Home is out of scope.

**`docs/direction.md` §9 "Home" (lines 345-381):**
- `:347` "Adopted by the owner, 2026-11-10, with the three changes listed below."
- `:355-359` the section table: "Try one, right here ... Watch has the lesson's five steps".
- `:367` "How the demo works": "It has no script. Three groups of radio buttons (the part, the step, the answer) come before its panel, and CSS shows, hides and lights things from which are checked ... from the keyboard (arrow keys move between steps), and adds nothing to the page's 1.3 KB of script."
- `:369-373` "What went" and the header change: "The header's 'How it works' and 'Questions' links are now 'How a lesson works' (the demo) and 'Sources'." (The live header links are at `src/components/SiteHeader.astro:19-20`.)
- `:375` "Measured, 1440×900 and 375×812 ... every control in the demo is at least 44px tall." (this is a claim the design job should check against the current build).
- `:379` the D5 paragraph: Learn's foot; "`prototypes/d5-home-sources.md` is the spec and `prototypes/d5-cases.md` its errata."
- `:381` "Not done: ... The header's small Start learning button is 40px tall, as before."
- `:138` (§1): "6. Home, the track page, About and 404. DONE 2026-11-10. Home is an original page (§9)."
- `:228` (§ "Next", a list item): "The Home header that sits clear over the hero until the page scrolls."

**Prototype specs in `prototypes/`:**
- `prototypes/d5-home-sources.md` (the spec for build unit H1; the owner approved variant A, `direction.md:379`). Its "Stays" line (`:38`) says the demo's radio buttons and generated state CSS stay. "Sizes" (`:125-143`) sets the 860px breakpoint and the 44px rows on a phone. "Keyboard, assistive tech, no script" (`:144-149`) sets the Learn foot's Tab order and the `<summary>` control. Its file is `prototypes/d5-home-sources.html`.
- `prototypes/d5-cases.md`: the errata and attack cases for D5 (not read in full here).
- `prototypes/d4-share-image.md`: the share image, not the page.
- The demo's own radio and keyboard rules are not in a prototype spec. The 2026-11-10 owner decision to adopt this page is in `docs/direction.md:385` (and `:347`), and the behaviour is the built code (`src/pages/index.astro:40-80`).

**Earlier Home specs (superseded in parts):**
- `docs/superpowers/specs/2026-11-09-site-layouts-design.md:118-135` (§6.1 "Home"): a three-track cable, an OSI-lesson sheet, a "Watch, learn, then practice" card set, and an FAQ. Its own text says the hero "opens How the Internet Works lesson 1 (owner, 2026-11-09)" (`:120-123`), but the 2026-11-10 owner decision replaced the demo (`direction.md:347-365`). Treat this section as superseded for Home's content.
- `docs/superpowers/specs/2026-11-09-site-layouts-design.md:74`: "Start learning goes to /tracks on every page (owner, 2026-11-09), and is hidden on /tracks and the track pages."
- `docs/superpowers/specs/2026-11-08-how-the-internet-works-track-design.md:97`: "The header's Start learning opens /how-the-internet-works/what-is-http." This was overruled by the 2026-11-09 rule above; the code and the tests follow the 2026-11-09 rule.
- `docs/superpowers/specs/2026-11-05-techconcepts-redesign-build-design.md:95` (the header list including "Start learning").

**Header "Start learning" (`src/components/SiteHeader.astro`):** the desktop button is at line 48 (`{showStart && <a class="btn btn--primary btn--small" href="/tracks">Start learning</a>}`), not 47. The mobile menu's copy is at line 56. `showStart` is false on the Tracks and track pages (`SiteHeader.astro:14-15`, `current !== 'tracks'`). The link goes to `/tracks`, per the 2026-11-09 owner decision (`docs/superpowers/specs/2026-11-09-site-layouts-design.md:74`).

## Part 7: tests that pin Home and its demo (Q7)

**Unit tests**
- `src/lib/home.test.ts` (the demo's builder and stops). Test names and lines: `:25` demo is lesson 1, every Watch step in the lesson's own words; `:35` each step lists the messages it sends; `:54` the scene is the map with only its own layer and each step lights a real way; `:74` Learn's lead, ideas and names, and sources; `:84` and `:91` the sealed pointer and its checked lead; `:102` Practice has one right answer; `:112` links into the full lesson at its start, Learn and Practice; `:120` and `:128` stops are the tracks with lessons, "Home says 14 lessons and 18 of 20 lessons ready"; `:169` sources in the order the Lesson page numbers them; `:185` six or fewer shown; `:189` seven or more show the first three; `:199` a source's name is the label up to ": "; `:205` the demo lists all 20 sources of lesson 1; `:219` the stamp; `:225` no numbers when nothing is cited; `:233` a stamp that miscounts makes the demo throw; `:240-279` the page's words and pictures from the lesson's cues, including the errors for lessons with no page cue (`:245`, `:249`, `:253`, `:257`) and the "stays once drawn" test (`:274`); `:281` reads `src/pages/index.astro` (`:282`) and checks that the D5 rules hold no colour value except tokens (`:286-287`: no `#hex`, `rgb(`, `hsl(`); `:292` the still map has no name strip and no DROPPED mark.
- Other unit files that touch Home's helpers (not read in full here): `src/lib/tracks-page.test.ts`, `src/lib/about.test.ts`, `src/lib/glossary.test.ts`, `src/art/scenes/net-map.test.ts` (`:155` and `:188` pin the map's viewBox `-98 -60 685 378`).

**E2E: `e2e/site.spec.ts`** (desktop projects, unless tagged `@phone`; `playwright.config.ts:27`, `:50-59`):
- `:88-110` Home: one h1 "See how technology really works." (`:88`), the facts line (`:95`, `HOME_FACTS` at `:33`), the hero button "Start with lesson 1: HTTP" with href `START_PATH` (`:96-97`, `HERO_START` at `:34`), "See the tracks" with href `/tracks` (`:98`), the section h2s (`:100-105`), and the hero button opens `/how-the-internet-works/what-is-http` (`:107-110`).
- `:112-140` "How a lesson works" (`#try`) and "Sources" (`#sources`) land their h2 below the sticky header.
- `:142-191` the demo steps: five row titles `['Client Request', 'DNS Resolution', 'TCP Connection', 'HTTP Exchange', 'Render Page']` (`:148`); narration and message lists (`:154-156`, `:163`, `:175`); trail opacity per step (`:157`, `:164`, `:169-170`); Next and "Go to Learn" (`:161-190`); row click (`:183-188`).
- `:193-231` Learn part: lead text (`:199`), terms `['Client', 'URL', 'IP address']` (`:200`), sealed box (`:202-206`), stamp "Checked 11 Nov 2026, 20 sources" (`:208`), sources (`:209-212`), "Go to Practice" (`:213-214`), the Practice question (`:215`), the two answers' feedback "Not quite." and "Right." (`:217-223`), "Nothing is scored." (`:224`), and the link "Open the whole lesson" to `START_PATH` (`:226-229`).
- `:234-251` keyboard: `#demo-s1` focus and ArrowRight to `#demo-s2` (`:239-241`), the focused row's outline is not `none` (`:245`), `#demo-watch` focus and ArrowRight to `#demo-learn` (`:246-248`), three answer radios named `/^Answer: /` (`:250`).
- `:253-271` the two tracks: two `main .cable > li.leg` cards (`:253-255`), titles, no "CompTIA" (`:256-257`), "Start here" and "Then go deeper" (`:258`), links `/tracks#how-the-internet-works` and `/tracks#networking` (`:259-262`), counts "14 lessons" and "18 of 20 lessons ready" (`:263`), and no exam tags or progress (`:267-269`).
- `:277-287` the facts line and "How a lesson is made and checked" link to `/about#facts` (`:280-285`; the sentence regex at `:282`).
- `:289-305` no Continue or resume link on Home; after a visit to a lesson, Home's demo starts over (`:304`, `#demo-s1` checked).
- `:382-392` Start learning: `main` header and menu link `href="/tracks"` on Home, About and 404 (the list is `SITE_PAGES`, `e2e/support.ts:44-52`); absent on `/tracks`, `/networking`, `/how-the-internet-works`; the footer lists How the Internet Works above Networking.
- `:969-1012` "without JavaScript": the demo steps, shows Learn and answers a question with scripts off (`:1001-1011`); the page has no theme toggle (`:972-978`).
- `:1492-1660` Learn's foot (H1, D5) at 375×812 and 1440×900 in light and dark: the stamp and sources (`:1505-1542`), the fold (`:1592-1607`), numbering and links (`:1607-1631`), keyboard order (`:1632-1636`), no sideways scroll (`:1637`), the block's height (`:1647-1651`: at most 115px on a phone, 99px on a desktop), the control at least 44px (`:1654`), and the rows at least 44px on a phone (`:1658-1659`).
- `:1665-1681` scripts off at the same two sizes.
- `:1683-1694` the source columns: three across, and two across when folded on a phone (`:1691`, width 860 or less).
- `:1699-1708` the lesson's words quoted as the lesson has them: "You type http://example.net and press Enter" (`:1702`), "In HTTP/1.1, getting a web page is a conversation in plain text." (`:1704`), and no "HyperText" in the demo (`:1706`).
- `:1710-1714` "Home has no island, and as many script elements as before H1 (two)": no `astro-island`, and exactly two `<script` tags in `/`.
- `:1716-1760` the page on the laptop at 1440×900: empty through step 4, drawn at step 5, empty again going back to step 4 (`:1720-1736`); Learn from step 1 keeps it drawn, through Practice (`:1738-1760`). These read `svg[data-figure="net-map"] #nm-page [data-part=...]` opacity (`:1718`).
- `e2e/site.spec.ts:1500`: `summary` and `src` selectors on `main .demo .demo__src`.
- `e2e/og-image.spec.ts:44-46`: Home's h1 (`#home-title`) equals the share image's hero line text.

**Visual snapshots (`@visual`):** `e2e/visual.spec.ts` (tag `@visual`, `:54`) takes full-page screenshots of `SITE_PAGES`, which include `/` (`e2e/support.ts:45`), at sizes `1280×800`, `1366×768`, `1440×900`, `1920×1080` (`e2e/visual.spec.ts:13-18`) and in both themes (`THEMES`, `:19`). It writes PNGs to `<outputDir>/visual/` (`:78`) and has no `toHaveScreenshot` (count 0). No phone size is in the visual run. These are output images for review, not pixel comparisons.

**Phone project:** `playwright.config.ts:57` runs `@phone`-tagged tests of `site.spec.ts` at 390×844 (`:57`). The Home demo's phone tests in `site.spec.ts` are the `:1644-1660` block, which sets its own viewport (375×812) inside the desktop project. `site.spec.ts:1014`'s `@phone` block loads every site page and checks scroll, not the demo's layout.

**No test pins:** the demo's radio ids or arrow-key handling beyond `:239-249`; the demo frame's height per part; the figure's size in pixels on a phone; the header blur or opacity; the footer text "Guided visual lessons"; the closing CTA label; the 40×40 icon button size; the side-tab 3px rules.

## Part 8: minor items (Q8)

- **Header opacity and blur:** `src/components/SiteHeader.astro:99` (`background: color-mix(in srgb, var(--ground) 88%, transparent)`), `:100-101` (`backdrop-filter: blur(10px)`), within `.site-head` at `:94`. Over the hero (`data-over-hero`): transparent, no blur at `:164-170`; the "solid" state (after scroll, or while the menu is open) returns to 88% and blur at `:173-178`. The icon-button tint over the hero is at `:181`.
- **Footer text "Guided visual lessons on how technology works.":** `src/components/SiteFooter.astro:17`. No test reads it.
- **Header icon buttons, 40×40:** the shared rule is `src/components/ThemeToggle.css:2-6` (`.icon-btn`: `width: 40px; height: 40px`), with the icon at 18×18 (`:23-26`). They are the theme button (`src/components/SiteHeader.astro:39`) and the menu button (`:49`). No test pins 40px for these buttons.
- **Closing CTA label:** `src/pages/index.astro:315` "Start with lesson 1: {start.title}" (href `start.url`), under the heading "Lift the lid" (`:313`) and the line "Lesson 1 is {start.title}..." (`:314`). The test at `e2e/site.spec.ts:104` checks only the h2 "Lift the lid" in the section list.
- **Side-tab 3px rules:**
  - `src/pages/index.astro:536`: `.demo__msgs li { border-left: 3px solid var(--request); }` (the blue request mark).
  - `src/pages/index.astro:551`: `.demo__sealed { border-left: 3px solid var(--encrypted); }` (the sealed box).
  - `src/pages/index.astro:696`: `.demo__why { border-left: 3px solid var(--line-strong); }` (the answer's feedback).
  - `:541` (`.demo__msgs li[data-kind='response']`) changes only the colour; `:700-702` changes the colour of a right answer's feedback. No test reads these rules.

## Open questions and things I could not settle

1. The phone scale figures in Part 2 are computed from CSS and the viewBox, not measured. A browser run at 375px would settle the label sizes on Home and on the Lesson page.
2. Tab behaviour on the hidden answer radios is standard HTML radio-group behaviour, not checked by a test here. Whether a browser lands focus on a hidden radio with no visible ring is a question for a browser check.
3. The 452px desktop minimum is the builder's own choice (`index.astro:463-464`). No measured longest-part height is recorded in the repo for it.
4. `src/lib/home.ts:133` draws the map with `unit.scene.layers`. The lesson's own layer list is `['http:web']` (`src/content/lessons/what-is-http.ts:105`); a change of layer in the lesson changes Home's map too.
5. `docs/superpowers/specs/2026-11-09-site-layouts-design.md` §6.1 still describes an earlier Home (three tracks, an OSI sheet, an FAQ). The direction doc §9 is the decision that replaced it for the demo (2026-11-10).
6. `prototypes/d5-cases.md` was not read in full; its errata may alter the sizes or the keyboard rules recorded in `d5-home-sources.md`.
