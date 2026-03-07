// ============================================================
// SEO UTILITY — src/lib/seo.ts
//
// This is the ONLY place canonical URLs, title strings, OG images,
// and noindex directives are formed. Never inline these in page files.
//
// ⚠️ REPEATABLE SYSTEM NOTE: This file is universal scaffold.
// It reads from client.config.ts — update the config, not this file.
// ============================================================

import { business, seo } from '../data/client.config';

/**
 * Compose the full <title> tag value for a page.
 * Appends seo.titleSuffix from config. Trims whitespace.
 *
 * Usage: buildTitle("480-a Forest Tax Law Consulting")
 * Returns: "480-a Forest Tax Law Consulting | Environmental Forest Products"
 */
export function buildTitle(pageTitle: string): string {
  return `${pageTitle.trim()}${seo.titleSuffix}`;
}

/**
 * Build an absolute canonical URL for a given pathname.
 *
 * Rules:
 * - Always absolute (prepends business.domain)
 * - No trailing slash (matches trailingSlash: 'never' in astro.config.mjs)
 * - No query strings
 * - This is the ONLY function that should produce canonical URLs
 *
 * Usage: buildCanonical("/services/480a-forest-tax-law")
 * Returns: "https://eforestproducts.com/services/480a-forest-tax-law"
 */
export function buildCanonical(pathname: string): string {
  // Strip trailing slash if present
  const clean = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;

  // Strip any query string
  const withoutQuery = clean.split('?')[0];

  return `${business.domain}${withoutQuery}`;
}

/**
 * Return the absolute OG image URL for a page.
 * Open Graph requires absolute URLs — relative paths will not work with
 * Facebook, Twitter, or Google rich result scrapers.
 *
 * Slug-specific convention: /images/og/{slug}.jpg
 *
 * Usage: buildOgImage("480a-forest-tax-law-new-york")
 * Returns: "https://eforestproducts.com/images/og/480a-forest-tax-law-new-york.jpg"
 * Fallback: "https://eforestproducts.com/images/og/efp-default.jpg"
 *
 * NOTE: File presence is enforced by the deploy checklist, not at runtime.
 */
export function buildOgImage(slug?: string): string {
  if (!slug) return `${business.domain}${seo.ogImageDefault}`;
  return `${business.domain}/images/og/${slug}.jpg`;
}

/**
 * Return the meta description for a page.
 * Uses override if provided, falls back to seo.defaultDescription.
 *
 * Usage: buildDescription("Learn how 480-a reduces property taxes...")
 */
export function buildDescription(override?: string): string {
  if (override && override.trim().length > 0) {
    return override.trim();
  }
  return seo.defaultDescription;
}

/**
 * Return the robots meta content string for pages that should not be indexed.
 * Returns undefined for pages that should be indexed (no robots tag needed).
 *
 * Usage: noindex(Astro.url.pathname.startsWith('/lp/'))
 * On /lp/ pages: returns "noindex, nofollow"
 * On all other pages: returns undefined (no tag rendered)
 *
 * NOTE: /lp/ pages are not currently set to noindex by default —
 * the decision to noindex a specific landing page must be explicit.
 * This function provides the mechanism; the caller sets the condition.
 */
export function noindex(condition: boolean): string | undefined {
  return condition ? 'noindex, nofollow' : undefined;
}

/**
 * BlogPosting schema requires images in all three aspect ratios.
 * Returns absolute URLs — required for Google rich results eligibility.
 *
 * Usage: buildSchemaImages("480a-forest-tax-law-new-york")
 *
 * ⚠️ All three image files must exist before page is published:
 *    /images/og/{slug}-16x9.jpg
 *    /images/og/{slug}-4x3.jpg
 *    /images/og/{slug}-1x1.jpg
 */
export function buildSchemaImages(slug: string): string[] {
  const base = `${business.domain}/images/og/${slug}`;
  return [
    `${base}-16x9.jpg`,
    `${base}-4x3.jpg`,
    `${base}-1x1.jpg`,
  ];
}
