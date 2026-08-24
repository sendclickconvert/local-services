/**
 * patch-entry.mjs — Post-build security header injector.
 *
 * Run automatically via `npm run build` (postbuild hook).
 *
 * WHY: @astrojs/node in standalone+hybrid mode serves prerendered HTML pages
 * via a static-file handler that runs BEFORE Astro's middleware pipeline, so
 * headers set in src/middleware.ts never reach those responses. This script
 * renames the built dist/server/entry.mjs → dist/server/entry-astro.mjs,
 * then writes a new dist/server/entry.mjs that patches
 * http.ServerResponse.prototype.writeHead to inject security headers on every
 * response (static or SSR) before booting the original Astro server.
 *
 * The production run command (node ./dist/server/entry.mjs) stays unchanged.
 */

import { readFileSync, writeFileSync, renameSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const distServer = join(__dir, '..', 'dist', 'server');
const original = join(distServer, 'entry.mjs');
const renamed  = join(distServer, 'entry-astro.mjs');

renameSync(original, renamed);
console.log('[patch-entry] Renamed entry.mjs → entry-astro.mjs');

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://*.leadconnectorhq.com",
  "img-src 'self' data: https://assets.cdn.filesafe.space https://widgets.leadconnectorhq.com",
  "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net https://stcdn.leadconnectorhq.com",
  "script-src 'self' https://backend.leadconnectorhq.com https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://services.leadconnectorhq.com https://challenges.cloudflare.com https://*.googletagmanager.com https://*.google-analytics.com",
  "connect-src 'self' https://services.leadconnectorhq.com https://backend.leadconnectorhq.com https://widgets.leadconnectorhq.com https://services.msgsndr.com https://*.googletagmanager.com https://*.google-analytics.com",
  "frame-src https://www.google.com https://maps.google.com https://widgets.leadconnectorhq.com https://challenges.cloudflare.com",
  "upgrade-insecure-requests",
].join('; ');

const wrapper = `import http from 'http';

const _SECURITY_HEADERS = {
  'Content-Security-Policy': ${JSON.stringify(CSP)},
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const _origWriteHead = http.ServerResponse.prototype.writeHead;
http.ServerResponse.prototype.writeHead = function (statusCode, statusMessage, headers) {
  for (const [name, value] of Object.entries(_SECURITY_HEADERS)) {
    if (!this.hasHeader(name)) {
      this.setHeader(name, value);
    }
  }
  return _origWriteHead.call(this, statusCode, statusMessage, headers);
};

// Boot the Astro server (renamed from entry.mjs by scripts/patch-entry.mjs).
// Do NOT set Strict-Transport-Security here — the edge handles includeSubDomains.
await import('./entry-astro.mjs');
`;

writeFileSync(original, wrapper, 'utf8');
console.log('[patch-entry] Wrote patched entry.mjs (writeHead wrapper + Astro boot)');
