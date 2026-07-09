import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served as a GitHub Pages project site at enot-theme.github.io/site/.
// build.format 'file' keeps the flat .html URLs the old site published,
// so inbound links (vim.html, ...) and llms.txt keep resolving.
export default defineConfig({
  site: 'https://enot-theme.github.io',
  base: '/site',
  build: { format: 'file' },
  trailingSlash: 'ignore',
  // Emit the same flat .html URLs the pages declare as canonical, so the
  // sitemap and the canonical tags never disagree on a page's identity.
  integrations: [
    sitemap({
      serialize(item) {
        const root = 'https://enot-theme.github.io/site';
        item.url =
          item.url === root || item.url === `${root}/`
            ? `${root}/`
            : `${item.url.replace(/\/$/, '')}.html`;
        return item;
      },
    }),
  ],
});
