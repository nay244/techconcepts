# S21b: the Lesson page beside a reference site (job 19, 2026-11-17)

The owner asked for a comparison of our Lesson page with `designed-to-scale.vercel.app` ("System Design": a sidebar of topics, an animation in the middle, a column on the right describing it, a top bar with Learn, Practice, Design Lab, Cheatsheets and a search box). Looked at by the orchestrator in the built-in browser on 2026-11-17: their lesson "How a Request Travels" (step 1 and step 5 of 10) beside our DHCP (step 4 of 6) and Subnetting (step 2 of 6), at 1440×900 and 375×812. Measures are from the page's DOM. These are notes on layout, spacing and sections only; nothing of theirs is copied (`CLAUDE.md`: all art stays original).

## At 1440 × 900

| | The reference | Ours (DHCP, step 4) |
|---|---|---|
| Page | One screen, no page scroll (900px) | One screen, no page scroll (900px) |
| Top bar | 47px, the whole width: mark and name; Learn, Practice, Design Lab, Cheatsheets as tabs (Learn lit); search box with ⌘K; language; theme; a credit | 68px, a panel: mark, Tracks / track / lesson crumbs, "Lesson 7 of 14", the step segments, "Step 4 of 6", the stamp, OSI chips, theme |
| Left column | 255px, no panel, on the page ground. The whole course as a tree: 9 numbered modules, each with a coloured folder, a done count ("0/3"); the open module lists its lessons, the current one lit. "Progress 0 / 40" pinned at the foot | 268px panel: this lesson's outline only (Overview, Watch steps with subtitles, Learn, Practice) in the three named groups; "All 14 lessons" at the foot |
| Middle | One 860px sheet (14px corners): crumb ("01. Foundations / Lesson 1 of 3"), a 30px title, a one-line subtitle, three chips (10 min, Beginner, 10 steps); then the stage card, 830×617, and under it the step timeline card, 830×92 | Scene panel 735×550: Network/Sequence switch, the scene 733×288, the lesson's table (Your laptop's settings) under it; the event log spans the middle and right, 1136×234, under both |
| Stage | A row of five running counters across the top (DNS lookup 20 ms, Connect 60 ms, Request + server 55 ms, Download, Total 135 ms) that fill in as the steps pass; Replay and Pause at its top right; the canvas 804×536; a legend (request, response, handshake) at the foot | The figure in its 685-unit frame, 733×288; legend in the log's head |
| Steps | A horizontal timeline card under the stage: ten numbered circles with a short label each ("Hit Enter", "Find address", … "Recap"), "Step 5 of 10" | The outline in the left column; the segments in the top bar |
| Right column | 300px. The guide card (649px): "Step 5 / 10", a tag naming the kind of step (Problem, Technique), a 19px title, the body, a tinted callout ("Key idea", "Good to know"), "What changed" (two lines); Back and "Next: Response" (the next step's name) at its foot; a key line under them (← → step, R replay, Space pause). Under it a second card, "You'll learn": five objectives as checkboxes that tick as the steps pass | 389px words panel: "Watch · Step 4 of 6", title, subtitle, the words, Go deeper. Controls (1×, back, Play all, replay, Next step) sit in the log's head |
| Type | One family, JetBrains Mono, everywhere. Body 12.8px on 21px lines, about 35 characters a line; title 19px/800; h1 30px | Atkinson Hyperlegible Next 16.5px body; Barlow Semi Condensed headings; mono for data only |
| Shape and spacing | Warm paper ground; cards with 12–14px corners, a 1px warm line and a soft drop shadow plus an inset highlight; gutters about 11–16px; card padding 10–16px | Faceplate grey; panels 3px corners, 1px strong line, no shadow; 12px gutters |
| Figure | Few, large nodes (laptop, DNS, web server, database), each in its own colour; labels as small pills beside them; the figure fills the canvas | Many devices on one board, mono callouts on leader lines; orange for the lit part |
| Labels on the figure | — | 2.5 to 13.9px rendered at 1440 |

## At 375 × 812

| | The reference | Ours |
|---|---|---|
| Page | Scrolls: 1,378px. Bar 54px (menu, mark, search, theme); title block; the stage card 333×300 with the counters, the canvas 315×198 and Replay, Pause and a full-screen button; the timeline as ten dots with the current label under them; then the guide card (447px), then "You'll learn". Back and "Next: Response" pinned at the bottom | One screen, no page scroll: bar 52px, the scene pinned (a third of the screen), tabs Explain / Steps / Log / (Table, Rules or Bits), the words scroll inside; 1×, back, play, replay and Next step pinned at the bottom |
| Labels on the figure | 7.5 to 10.1px (8 labels) | 1.3 to 7.1px on DHCP (17 labels) |
| Full screen | The button opens the stage at the full height; the drawing does not grow (it stays the width of the screen), so labels stay the same size | None |
| Menu | A drawer: the four sections, then the course tree and progress, the language and the credit | None in the lesson: the bar keeps the mark, the lesson's name, "Step 2 of 6" and theme |

## What it does that we do not

1. **The course in the sidebar.** Every module and lesson, with done counts and progress, one click away from inside a lesson. Ours shows this lesson's outline only and links to the track. (Against the owner's rule of 2026-11-09 for the Tracks page, not for the Lesson page.)
2. **A step timeline under the scene,** with a short label a step, instead of an outline in a side column.
3. **The Next button names where it goes** ("Next: Response"). Ours reads "Next step".
4. **A key line** under the controls (← → step, R replay, Space pause). The critique of 2026-11-15 found ours invisible (heuristic 6 and 10, still open).
5. **Running counters on the stage** that fill as the story goes (their lesson is about time; ours have the event log and the lesson's table for the same job).
6. **"You'll learn" objectives** that tick as the steps pass.
7. **A kind tag on each step** (Problem, Technique) and a tinted "Key idea" callout.
8. **A figure drawn for the stage's size:** four big nodes, so the phone labels stay 7.5px and up. Ours draws a whole network in a 685-unit frame for every protocol.
9. **Search** across lessons and concepts in the top bar; **site sections** (Learn, Practice, Design Lab, Cheatsheets) as tabs. In the build looked at, Practice, Design Lab and Cheatsheets did nothing when pressed (no route change).

## What we do that it does not

1. **The phone fits one screen** (scene pinned, tabs, controls pinned); theirs is a 1,378px stack where the words start 653px down.
2. **Reading type:** a 16.5px reading face against their 12.8px monospace at about 35 characters a line.
3. **An event log** of every message with addresses, ports, protocol and size, and the lesson's own table (leases, rules, bits).
4. **Network and Sequence views** of the same story.
5. **Trust signals:** the dated "Checked" stamp, numbered sources on every claim, Learn and Practice in the lesson.
6. **More on the figure at 1440** (733×288 within a 735×550 panel that also holds the table), at the cost of empty room under a short step's words (direction §7).

## Readings for job 19

The reference supports three of the critique's open findings with a working example: a phone figure drawn for its box, the keys on screen, and a forward button that names the next place. It also shows two layout moves our page has not tried: the step outline as a timeline under the scene (freeing the left column for the track), and a right column that is the step's guide card with its own Back and Next. Whether either is worth a rearrangement is the owner's standing test: "restyle the current Lesson page and rearrange only with a measured gain".
