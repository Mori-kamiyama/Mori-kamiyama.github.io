import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mori-kamiyama.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: page => !['/404/', '/404.html', '/1/'].includes(new URL(page).pathname) })],
});
