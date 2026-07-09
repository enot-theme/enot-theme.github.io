import { defineConfig } from 'astro/config';

// Served as a GitHub Pages project site at enot-theme.github.io/site/.
// build.format 'file' keeps the flat .html URLs the old site published,
// so inbound links (vim.html, ...) and llms.txt keep resolving.
export default defineConfig({
  site: 'https://enot-theme.github.io',
  base: '/site',
  build: { format: 'file' },
  trailingSlash: 'ignore',
});
