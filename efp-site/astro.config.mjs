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
  // Redirects are handled entirely by src/middleware.ts.
  // Do NOT add redirects here — Astro's config-level redirects are not
  // processed by the production Node.js server in Replit deployments.
  redirects: {},
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/training'),
    }),
  ],
  server: { host: '0.0.0.0', port: 8080 },
  vite: {
    server: {
      allowedHosts: true,
      headers: process.env.NODE_ENV !== 'production' ? {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      } : {},
    },
  },
});
