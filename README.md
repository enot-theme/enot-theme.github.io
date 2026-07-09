# enot theme site

Astro source for the enot color scheme site, served via GitHub Pages at
https://enot-theme.github.io/ (this repo is the organization site, so it
lives at the domain root with directory-style URLs).

## Layout

- `src/data/site.json` - the data bundle from the enot pipeline (vision
  simulations, metrics, gates, the port registry). Generated, not edited
  by hand; synced in by `make deploy` in the enot repo.
- `src/data/install.ts`, `src/data/config.ts` - install prose and site
  config (analytics); the site owns the words, the pipeline owns the
  numbers.
- `src/lib/` - `site.ts` (bundle types and the shared link base),
  `switcher.mjs` (pure theme/vision switcher logic), `metrics.mjs`
  (invariant labels and the flooring helpers the consistency test uses).
- `src/assets/mascot/` - the mascot originals (anime raccoon, dark and
  light); everything mascot-derived in `public/` (hero art, header mark,
  favicon, og card) is regenerated from them by `scripts/make-mascot.mjs`
  (`npm run mascot`).
- `src/layouts`, `src/components`, `src/pages`, `src/styles` - the Astro
  site. `/apps/` renders the coverage matrix from the port registry.
- `public/` - the downloadable scheme files, colors.json and llms*.txt,
  synced in from the pipeline, plus the generated mascot assets.

## Build and deploy

`npm install` then `npm run build` (output in `dist/`). On push to main a
GitHub Actions workflow builds the site and deploys it to Pages; the
Pages source is set to GitHub Actions, not a branch.

The scheme files and data bundle are produced by the enot pipeline:
`make deploy` there regenerates the bundle, syncs it here and pushes.

## Checks

- `npm run check` - `astro check`, types the `site.json` contract so a
  page reading a dropped field fails the build.
- `npm test` - builds, then runs the `node:test` suite: bundle
  consistency (gates hold, advertised numbers are floored, not rounded
  up), the switcher logic and that every built link, download and nav
  anchor resolves.

The deploy workflow runs check and test before building; either failing
blocks the deploy.
