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
| `npm run e2e` | Run the Playwright end-to-end tests (against a built site) |

## Layout

- `src/lib/` plain TypeScript with no framework: safe storage, theme logic, contrast maths
- `src/styles/` colour tokens (`tokens.ts`) and base CSS (`global.css`)
- `src/layouts/`, `src/components/`, `src/pages/` the site shell and pages

Unit and component tests sit next to their source as `*.test.ts(x)`. Component tests start with `// @vitest-environment jsdom`. Tests import `test`, `expect` and `vi` from `vitest` explicitly; there are no globals.

## Conventions worth knowing

- **Browser storage** is touched only through `createSafeStorage()` in `src/lib/storage.ts`. It never throws: reads give `null`, writes give `false`. The site must work fully when storage is blocked or full.
- **Colour** comes only from the semantic tokens in `src/styles/tokens.ts`, which meet WCAG AA in both themes. Colour is never the only signal: always add a label, icon or text.
- **Themes**: the root element's `data-theme` attribute selects light or dark. An inline boot script sets it before first paint; without JavaScript the page follows `prefers-color-scheme`.
