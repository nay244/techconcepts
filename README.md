# TechConcepts

Short guided simulations that teach how technology works, starting with networking. A fully static [Astro](https://astro.build) site with React islands for the interactive scenes, served at `techconcepts.app` (HTTPS only).

Node 22 or newer is required (`.node-version` pins 24).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `http://localhost:4321` |
| `npm run build` | Type-check (`astro check`), then build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm test` | Run the Vitest unit and component tests once |
| `npm run e2e` | Run the Playwright end-to-end tests (it builds and previews the site itself) |
| `npm run deploy` | Deploy `dist/` with `wrangler deploy` (build first) |

## Layout

- `src/engine/` the framework-free lesson engine: playback, the timeline that turns a position into scene state, and `net/` (IPv4 and subnet maths, the firewall rule evaluator)
- `src/content/` lessons and tracks: `schema.ts` and `define.ts` (validation), `estimate.ts`, `registry.ts`, `tracks/`, `lessons/<track>/<slug>.ts` and `helpers/` (packet builders)
- `src/scenes/` what a lesson draws: `flow/` (network and sequence views), `table/`, `inspector/`, `playground/subnet/`
- `src/lesson/` the lesson console: outline, explanation, Try it, Check yourself, Recap, playback controls and keyboard shortcuts
- `src/progress/` saved progress (`techconcepts:v1`) and the hooks that read it
- `src/lib/` plain TypeScript with no framework: safe storage, theme logic, contrast maths, analytics, entry helpers
- `src/styles/` colour tokens (`tokens.ts`) and base CSS (`global.css`)
- `src/layouts/`, `src/components/`, `src/pages/` the site shell and pages
- `e2e/` Playwright tests; `scripts/` one-off tools (the social image); `docs/deploy.md` deploying to Cloudflare

Unit and component tests sit next to their source as `*.test.ts(x)`. Component tests start with `// @vitest-environment jsdom`. Tests import `test`, `expect` and `vi` from `vitest` explicitly; there are no globals.

## Adding a lesson

1. Plan it in the track, `src/content/tracks/networking.ts`; until its file exists it shows as "Coming soon".
2. Create `src/content/lessons/<track>/<slug>.ts`. The file name must equal the lesson's `slug`, and the default export is `defineLesson({ ... })`. Copy a pilot (`dhcp.ts`, `firewalls.ts` or `subnetting.ts`) and its `*.test.ts`. The schema rejects unknown keys, so a typo such as `outcom:` fails the build.
3. Add the lesson to the `LESSONS` list at the top of `e2e/lesson.spec.ts`.

Limits (`defineLesson` fails the build on a breach):

- 4 to 6 steps, each with 2 to 4 facts and a narrative of at most 120 words
- an overview hook of at most 80 words
- 2 to 3 Check yourself questions, 2 to 4 options each
- exactly 3 recap takeaways, at least 1 reference and 1 cert tag
- the estimate, `ceil(words / 200 + 0.5 x steps + 2 + 1)` minutes, warns above 12 and fails above 15

Example data (spec section 5): "public" hosts use `192.0.2.0/24`, `198.51.100.0/24` or `203.0.113.0/24`; private networks use RFC 1918 ranges; MAC addresses use `00:00:5E:00:53:xx`; `8.8.8.8` may appear by name.

Voice (section 7.2 of the spec in `docs/superpowers/specs/`): second person and warm; the analogy first, then the precise term; one new idea per step; no gamified words. Check yourself is never scored or saved.

## Conventions worth knowing

- **Browser storage** is touched only through `createSafeStorage()` in `src/lib/storage.ts`. It never throws: reads give `null`, writes give `false`. The site must work fully when storage is blocked or full.
- **Colour** comes only from the semantic tokens in `src/styles/tokens.ts`, which meet WCAG AA in both themes. Colour is never the only signal: always add a label, icon or text.
- **Themes**: the root element's `data-theme` attribute selects light or dark. An inline boot script sets it before first paint; without JavaScript the page follows `prefers-color-scheme`.

## Deploying and analytics

`npm run deploy` runs `wrangler deploy` (Cloudflare Workers with static assets, set up in `wrangler.jsonc`) and expects `npm run build` to have run. `docs/deploy.md` has the dashboard steps. If the build variable `PUBLIC_CF_WEB_ANALYTICS_TOKEN` is set, every page includes Cloudflare's cookieless Web Analytics beacon and the About page says so; leave it unset for no analytics.
