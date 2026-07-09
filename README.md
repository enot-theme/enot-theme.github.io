# enot theme site

Astro source for the enot color scheme site, served via GitHub Pages at
https://enot-theme.github.io/site/ .

## Layout

- `src/data/site.json` - the data bundle from the enot pipeline (vision
  simulations, metrics, gates, the port registry). Generated, not edited
  by hand; synced in by `make deploy` in the enot repo.
- `src/data/install.ts`, `src/data/config.ts` - install prose and site
  config (analytics, favicon); the site owns the words, the pipeline owns
  the numbers.
- `src/layouts`, `src/components`, `src/pages`, `src/styles` - the Astro
  site. `apps.html` renders the coverage matrix from the port registry.
- `public/` - the downloadable scheme files, colors.json and llms*.txt,
  synced in from the pipeline.

## Build and deploy

`npm install` then `npm run build` (output in `dist/`). On push to main a
GitHub Actions workflow builds the site and deploys it to Pages; the
Pages source is set to GitHub Actions, not a branch.

The scheme files and data bundle are produced by the enot pipeline:
`make deploy` there regenerates the bundle, syncs it here and pushes.
