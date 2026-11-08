# How the Internet Works becomes its own track

- **Date:** 2026-11-08
- **Status:** For the owner's approval
- **Builds on:** the direction doc (`2026-11-07-techconcepts-direction.md`), §4.5 and the first half of §10 task 6. It decides everything not listed here.
- **Branch:** `feat/internet-track`, cut from `feat/tracks-page` (PR #6), because this change adds a card to the Tracks page. Its PR targets `main`. Until #6 merges, the PR also shows #6's commits.

## Why

The owner wants How the Internet Works to be its own basic track, an introduction to IT, instead of lesson 1 inside Networking Concepts (2026-11-08). The direction doc already plans the split (§4.5). It also keeps the overlap on purpose: How the Internet Works is the **tour** (what each protocol is for), and Networking is the **depth**.

## Decided by the owner (2026-11-08)

1. **The name stays "How the Internet Works".** Its card is listed first and marked as the place to start.
2. **Split now, audit later.** This PR is the split itself: the new track, saved progress carried over, the old address redirected and Networking renumbered to 19. The lesson text stays as it is today. Each of the 14 lessons is audited once the fact-checker exists (§10 tasks 3 to 5).
3. **Lesson cards use name tiles** (mockup option A): the protocol's name set large on the blueprint plate, a short rule in our blue under it, and its full name below.

## What changes

### The track

- A new concept track, id `how-the-internet-works`, titled **How the Internet Works**, level Beginner.
- It comes first in the track list, so it is **Track 1** and Networking becomes **Track 2**.
- Description *(my copy)*: "Meet the 14 protocols the internet runs on, from HTTP and DNS to email, SSH and TLS, one short lesson each. Start here if you are new to IT: Networking Concepts goes deeper."
- Limits: a copy of Networking's numbers. Every protocol section already passes them today.
- Six parts in today's teaching order *(my part titles, as in the mockup)*:
  1. **Loading a web page:** HTTP, HTTPS
  2. **Getting the data there:** TCP, UDP, IP
  3. **Behind the scenes:** DNS, DHCP, ICMP
  4. **Email:** SMTP, POP3, IMAP
  5. **Files and remote control:** FTP, SSH
  6. **The seal:** TLS/SSL

### The 14 lessons

Each protocol section of today's lesson becomes a lesson of one section, with every word kept. The lesson-level fields come from text the section already has:

| Field | Value |
|---|---|
| slug | `what-is-<protocol>`: `what-is-http` … `what-is-tls` |
| title | the section's name: HTTP … TLS/SSL |
| subtitle | the section's purpose line, e.g. "Getting an address" |
| summary | the section's opening hook |
| level | Beginner |
| exam tags | none until the audit maps them |
| figure | `net-map`, as today |

- **Why `what-is-…` slugs:** a slug is a lesson's identity everywhere, saved progress included. Networking already has `dhcp`, and plans `dns` and `tls`. Those are different (depth) lessons, so the tour lessons need slugs of their own.
- **Why no exam tags:** today's one lesson carries A+, Network+, Security+, CCNA and Helpdesk. Copying all five onto every protocol could claim an exam that doesn't cover it (for example POP3 on CCNA).
- **Text edits:** only where a sentence points at another part of the old lesson or at a lesson number. These are the only changes to lesson text:
  - DHCP's hook and its Go deeper paragraph end "The DHCP lesson, lesson 10, goes further." Both now read "Networking Concepts has a DHCP lesson that goes further."
  - Five sentences point at another protocol as a part of "this lesson". Each now names that protocol's lesson. For example, "The DNS part of this lesson shows how the resolver finds it" becomes "The DNS lesson shows how the resolver finds it". The five are:
    - two in HTTP (DNS, TCP);
    - two in HTTPS (DNS, TLS);
    - one in SMTP (TLS).
- **Files:** each section file moves (`git mv`) from `src/content/lessons/how-the-internet-works/<protocol>.ts` to `src/content/lessons/what-is-<protocol>.ts` and gains its lesson fields. The old lesson file and its folder go. The 14 slugs replace `how-the-internet-works` on the legacy list.

### Networking Concepts

- It loses its first lesson and has **19 lessons**, numbered again from 1. Part 1, "The big picture", keeps OSI Model and Packets, both coming soon.
- Lesson numbers written into lesson text drop by one, for example "(lesson 12)" becomes "(lesson 11)". Comments saying "of 20" now say "of 19".

### Saved progress

- Visitors who started the old lesson keep their place.
- When progress loads, an old `how-the-internet-works` record is split into the 14 new lessons by where its furthest step falls:
  - The old lesson was **finished:** all 14 are finished.
  - Otherwise, the protocols **before** the furthest step are finished.
  - The protocol **holding** it is in progress at the same step within its own lesson. If that step is the protocol's opening Overview, it gets no record; if it is the lesson's last step, it is finished.
  - The protocols **after** it get no record.
  - Every new record keeps the old "last opened" time.
- The old record is then removed. A "last lesson" that named the old lesson now names the protocol holding the furthest step, in the new track.
- Records saved under the older v1 key go through the same split after their existing migration.
- The section sizes the split needs live in a small table beside the progress code, so the browser doesn't load lesson data. A test holds that table to the real lessons.

### Addresses

- The track: `/how-the-internet-works`. The lessons: `/how-the-internet-works/what-is-http` and so on.
- `/networking/how-the-internet-works` redirects to `/how-the-internet-works` through Astro's `redirects` setting. On a static site that is a small page that forwards at once, and the e2e tests can check it.

### Pages

- **Track page:**
  - **Hero art:** the approved `web` cover (a laptop asking a server for a page), in the same plate frame as Networking's, with "Track 1" and "How the Internet Works" in its corners. It is a still picture: Networking's click-to-send-packets stays Networking's.
  - **Hero art per track:** each track names its hero art in one place. A track without any still stops the build, as now.
  - **Lesson cards:** name tiles. An empty exam list is no longer drawn.
- **Tracks page:**
  - How the Internet Works is the first card. It wears the `web` cover, reads "Concept track · Beginner" and "14 lessons · 14 ready", and has a **Start here** flag at top right.
  - The flag is the "Being written" pill's shape in our blue (`--accent` with `--accent-ink` text).
  - Networking's card reads "19 lessons · 3 ready".
- **Home** (only what the split needs; §10 task 7 redoes Home):
  - The hero button opens `/how-the-internet-works/what-is-http`.
  - The How the Internet Works card links to the track and shows track progress like the Networking card.
  - The hero's Continue covers lessons in both tracks.
  - The Networking card, the exams strip and the DHCP log sample name the Networking track directly instead of taking the first track.
- **Header and footer:**
  - The header's **Start learning** opens `/how-the-internet-works/what-is-http`.
  - The footer lists How the Internet Works above Networking Concepts.
- **About:** "lessons ready" is worked out from the tracks, so it becomes 17 (14 + 3) with no change.

## Not in this PR

- **The audit of the 14 lessons** and their **"Go deeper: Networking ›"** links. Both are §10 task 6's second half, after the fact-checker.
- **Exam tags** for the 14, mapped during the audit.
- **A drawing for each protocol.** If you want them, they can replace the name tiles as a later piece of work.
- **The full Home changes** (§10 task 7), including dropping the four roadmap cards.
- **Removing the console's support for lessons of many sections.** No lesson uses it after this PR. Tests that used How the Internet Works as their many-section example build one from the protocol sections instead.

## My calls, for the owner to check

1. The track description, the six part titles and the "Start here" flag.
2. `what-is-…` slugs.
3. No exam tags until the audit.
4. The progress split rule: a protocol moved past counts as finished. Old data can't tell a visitor who jumped ahead from one who went through in order.
5. Redirecting the old address to the track page instead of the HTTP lesson.
6. The wording of the DHCP sentence and of the five cross-references.
7. The web cover as the track's hero art.

## Left to the builder

- How tests are reorganised, and the many-section test example.
- The e2e changes.
- The name tile's exact drawing within the mockup's look.
