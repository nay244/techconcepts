# Deploying TechConcepts to a Cloudflare preview

TechConcepts is a fully static site: `npm run build` writes everything to `dist/`, and there is no server code. This page covers the preview deployment (Plan 1). Connecting `techconcepts.app` comes later (Plan 2).

## Which Cloudflare product, and why

**Choice: Cloudflare Workers with static assets** (no Worker code, just the `dist/` files).

- Cloudflare's current Astro guide, [Deploy an Astro site on Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), is written for Workers and shows a static site as a `wrangler.jsonc` with only an `assets` block. Its Pages guide ([Deploy an Astro site on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)) still exists and is not marked deprecated, but the Workers guide is the one Cloudflare's Astro documentation leads with, so a new site starts there.
- The settings live in the repository (`wrangler.jsonc`), so the dashboard needs very little.
- Astro's Cloudflare adapter is not needed for a static site.

Facts from the docs that matter here:

- **The 404 page.** `"not_found_handling": "404-page"` makes Workers serve the nearest `404.html` with a 404 status when no file matches ([static site generation](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)). Astro builds `src/pages/404.astro` to `dist/404.html`, so unknown addresses show the TechConcepts 404 page.
- **Node version.** The docs ask for Node 22.12 or newer for Astro 6 and 7. The repository has a `.node-version` file containing `24`. The Workers Builds documentation ([configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)) does not say whether it reads that file, so as a precaution set the build variable `NODE_VERSION=24` (step 2 below). It is harmless if the file is read anyway.
- **Analytics.** Cloudflare's [Web Analytics page](https://developers.cloudflare.com/web-analytics/get-started/) documents automatic enabling for **Pages** projects (Metrics, then Enable) and for sites proxied through Cloudflare. It does not document it for a Workers project. So the site includes its own switch: if the build variable `PUBLIC_CF_WEB_ANALYTICS_TOKEN` is set, every page gets Cloudflare's cookieless beacon (`static.cloudflareinsights.com/beacon.min.js`), and the About page says so. If a dashboard toggle ever turns analytics on automatically for this project, the token is redundant: leave it unset so the page is not counted twice and the About page makes no analytics claim.

## Steps for the owner

You do these once. Nothing here needs a password pasted into any tool; you sign in to GitHub and Cloudflare yourself.

1. **Put the code on GitHub.** Create a new GitHub repository (private is fine). The work currently lives on the branch `feat/foundation-pilots`, so it is merged into `main` first (your assistant will arrange that with you). Then push `main` to the new repository. Cloudflare builds from `main`.
2. **Create the Cloudflare project.** In the Cloudflare dashboard open **Workers & Pages**, choose **Create application**, then **Import a repository** (connect GitHub when asked), and pick the repository. Use these settings:
   - Project name: `techconcepts` (it must match `name` in `wrangler.jsonc`)
   - Production branch: `main`
   - Build command: `npm run build`
   - Deploy command: `npm run deploy` (it runs the `wrangler` pinned in `package.json`, which Workers Builds installs with the other dependencies; the dashboard's default `npx wrangler deploy` would also use that local copy)
   - Root directory: leave empty
   - Build variable: `NODE_VERSION` = `24`

   Save and deploy. Cloudflare gives the site a preview address ending in `.workers.dev`. Send that address to your assistant.
3. **Optional: turn on page-view counting.** In the dashboard open **Web Analytics**, choose **Add a site**, enter the preview hostname, and finish. Then open **Manage site** and copy the **token** from the snippet it shows (the value after `"token":`). Back in your Worker, go to **Settings**, then **Build**, then **Variables and secrets**, and add `PUBLIC_CF_WEB_ANALYTICS_TOKEN` with that token. Redeploy. The token is a public identifier, not a secret, but keep it out of the repository. Skip this step if you do not want analytics yet; the site works the same without it.
4. **Leave `techconcepts.app` alone.** Do not connect the domain to this project until launch (Plan 2).

## What to check on the preview

- The `https://` address loads Home, `/networking`, all three lessons (Subnetting, DHCP, Firewalls), `/about`, and a made-up address such as `/nothing-here` shows the 404 page.
- On a phone-sized screen, stepping through DHCP all the way to the Recap works.
- The browser console shows no errors.
- If you set the analytics token: the About page has the sentence about privacy-friendly page-view counts. If you did not, it does not.
