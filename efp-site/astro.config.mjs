import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// ⚠️ LOCKED DOCTRINE — do not modify trailingSlash or sitemap settings
// trailingSlash: 'never' prevents duplicate URL / GSC indexing issues
// site URL is required for sitemap and canonical generation

export default defineConfig({
  site: 'https://eforestproducts.com',
  trailingSlash: 'never',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    sitemap(),
  ],
});
