import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served as the GitHub Pages organization site at the domain root
// (repo enot-theme.github.io); default directory-style URLs.
export default defineConfig({
  site: 'https://enot-theme.github.io',
  integrations: [sitemap()],
});
