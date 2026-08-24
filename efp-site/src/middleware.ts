import { defineMiddleware } from 'astro:middleware';

// All 301 redirect logic lives here so it works identically in dev and production.
// Astro's astro.config.mjs `redirects` map is NOT processed by the production
// Node.js server in Replit deployments — middleware is the reliable path.

// Security headers (CSP + X-Frame-Options + X-Content-Type-Options etc.) are
// injected at the raw Node.js level by scripts/patch-entry.mjs (postbuild).
// That patch wraps http.ServerResponse.prototype.writeHead so ALL responses —
// including prerendered static pages served before Astro's middleware runs —
// carry the headers. Do NOT duplicate them here.

// ── 410 Gone — pre-migration WordPress spam paths ────────────────────────────
// Exact-path Set covers known slugs. Regex patterns below catch all locale/suffix
// variants (e.g. /spinanga-de/, /superbet-uk/) so Google doesn't index stragglers.
const SPAM_PATTERNS: RegExp[] = [
  /^\/tlcasino(\/|-|$)/i,
  /^\/william-hill(\/|-|$)/i,
  /^\/superbet(\/|-|$)/i,
  /^\/hitnspin(\/|-|$)/i,
  /^\/spinanga(\/|-|$)/i,
  /^\/sportaza(\/|-|$)/i,
  /^\/spinmama(\/|-|$)/i,
  /^\/eurojackpot(\/|-|$)/i,
  /^\/n1-casino(\/|-|$)/i,
  /^\/verde-casino(\/|-|$)/i,
  /^\/stake-casino(\/|-|$)/i,
  /^\/efortuna(\/|-|$)/i,
  /^\/betclic(\/|-|$)/i,
  /^\/mrbit(\/|-|$)/i,
  /^\/goldbet(\/|-|$)/i,
  /^\/admiralbet(\/|-|$)/i,
  /^\/bison-casino(\/|-|$)/i,
  /^\/mafia-casino(\/|-|$)/i,
  /^\/vavada(\/|-|$)/i,
  /^\/galabet(\/|-|$)/i,
  /^\/bwin(\/|-|$)/i,
  /^\/betasus(\/|-|$)/i,
  /^\/22bet(\/|-|$)/i,
  /^\/20bet(\/|-|$)/i,
];

const GONE_PATHS = new Set([
  // Original 13 already present
  '/tlcasino',
  '/william-hill-uk',
  '/superbet-fr',
  '/spinanga-italia',
  '/22bet-casino',
  '/hitnspin',
  '/vavada-slovenija',
  '/efortuna-pl',
  '/efortuna-pl-2',
  '/n1-casino-gr',
  '/verde-casino-de',
  '/bison-casino-logowanie',
  '/stake-casino-france',
  // Additional casino/gambling hack URLs (~20 gap slugs from GSC audit)
  '/mrbit-casino',
  '/eurojackpot-nl',
  '/eurojackpot-it',
  '/eurojackpot-no',
  '/eurojackpot-greece',
  '/sportaza-italia',
  '/spinmama-espana',
  '/spinmama-italia',
  '/betclic-fr',
  '/galabet-mobil',
  '/superbet-uk',
  '/superbet-de',
  '/goldbet-app',
  '/mafia-casino-en-ligne',
  '/admiralbet-es',
  '/bwin-login',
  '/stake-casino-fi',
  '/efortuna-logowanie',
  '/20bet-app',
  '/betasus',
  // Hacker-injected author archive
  '/author/alice-tulaeva',
]);

// ── Redirect map (old path → new path, no trailing slashes) ──────────────────
const REDIRECTS: Record<string, string> = {
  '/about-us':                          '/about',
  '/category/forestry-management':      '/guides',
  '/blog':                              'https://blog.eforestproducts.com',
  '/contact-us':                        '/contact',
  '/forestry-services':                 '/services',
  '/land-clearing-services':            '/services/land-clearing',
  '/new-komatsu-equipment':             '/gallery',
  '/nys-tax-breaks':                    '/services/480a-forest-tax-law',
  '/nys-480-a-forest-tax-law':          '/services/480a-forest-tax-law',
  '/privacy-policy':                    '/privacy',
  '/services-offered':                  '/services',
  '/services/forestry-mulching':        '/services',
  '/sustainable-wood-logging':          '/services/timber-harvesting',
  '/timber-harvesting-logging':         '/services/timber-harvesting',
  '/timber-marketing':                  '/services/sell-standing-timber',
  '/tree-work-services':                '/services/tree-removal',
  '/woodlot-management':                '/services/woodlot-management',
  // Town-name alias
  '/locations/ulster-county-ny/highland': '/locations/ulster-county-ny/lloyd',
  // Land clearing county pages → /locations — July 2026
  // County targeting belongs at /locations/[county]. These six earned 0 clicks / 20 impressions in 90 days.
  '/services/land-clearing/sullivan-county-ny': '/locations/sullivan-county-ny',
  '/services/land-clearing/orange-county-ny':   '/locations/orange-county-ny',
  '/services/land-clearing/ulster-county-ny':   '/locations/ulster-county-ny',
  '/services/land-clearing/pike-county-pa':     '/locations/pike-county-pa',
  '/services/land-clearing/wayne-county-pa':    '/locations/wayne-county-pa',
  '/services/land-clearing/sussex-county-nj':   '/locations/sussex-county-nj',
  // Duplicated slug guard
  '/services/sell-standing-timber/sell-standing-timber': '/services/sell-standing-timber',
};

function isSpam(pathname: string): boolean {
  return GONE_PATHS.has(pathname) || SPAM_PATTERNS.some(re => re.test(pathname));
}

export const onRequest = defineMiddleware(async (context, next) => {
  let { pathname } = context.url;
  const search = context.url.search;

  // Step 1: strip trailing slash (but never redirect root "/" to "")
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);

    // Check 410 block on the stripped path (exact Set + regex wildcards)
    if (isSpam(pathname)) {
      return new Response(null, { status: 410 });
    }

    // After stripping, check if there's a redirect for the cleaned path.
    // If yes, go straight to the final destination in one hop.
    const destination = REDIRECTS[pathname];
    if (destination) {
      return context.redirect(destination + search, 301);
    }
    // No redirect — just strip the slash.
    return context.redirect(pathname + search, 301);
  }

  // Step 2: check no-slash path against 410 block, then redirect map
  if (isSpam(pathname)) {
    return new Response(null, { status: 410 });
  }

  const destination = REDIRECTS[pathname];
  if (destination) {
    return context.redirect(destination + search, 301);
  }

  return next();
});
