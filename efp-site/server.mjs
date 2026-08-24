/**
 * server.mjs — Security-header wrapper for the Astro Node standalone server.
 *
 * WHY THIS EXISTS:
 * @astrojs/node in standalone mode serves prerendered (static) HTML pages via
 * a static-file handler that runs BEFORE Astro's middleware pipeline. Headers
 * set in src/middleware.ts are never applied to those responses. This wrapper
 * patches http.ServerResponse.prototype.writeHead at the raw Node level so
 * every response — static or SSR — carries the security headers.
 *
 * Do NOT set Strict-Transport-Security here; the edge handles includeSubDomains.
 */

import http from 'http';

const SECURITY_HEADERS = {
  'Content-Security-Policy': [
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
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const _writeHead = http.ServerResponse.prototype.writeHead;
http.ServerResponse.prototype.writeHead = function (statusCode, statusMessage, headers) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!this.hasHeader(name)) {
      this.setHeader(name, value);
    }
  }
  return _writeHead.call(this, statusCode, statusMessage, headers);
};

await import('./dist/server/entry.mjs');
