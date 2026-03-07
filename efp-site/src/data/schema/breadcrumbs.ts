// ⚠️ MANUAL-ONLY — do not edit with Agent
// This is a sitewide schema component.
// Only Bryan Collins edits this file.
//
// Contains: buildBreadcrumbs() factory function
// Used in: Breadcrumb.astro and all schema components that need BreadcrumbList
//
// CRITICAL RULE: Visual Breadcrumb.astro and BreadcrumbList JSON-LD
// MUST consume the same crumbs array from this function.
// Never maintain breadcrumb data in two places.

import { business } from '../client.config';

export interface Crumb {
  label: string;
  href: string;  // Relative path, e.g. "/services/480a-forest-tax-law"
}

/**
 * Builds a BreadcrumbList JSON-LD object from a crumbs array.
 *
 * Usage:
 * const crumbs: Crumb[] = [
 *   { label: "Home", href: "/" },
 *   { label: "Services", href: "/services" },
 *   { label: "480-a Forest Tax Law", href: "/services/480a-forest-tax-law" },
 * ];
 *
 * Pass crumbs to both:
 *   <Breadcrumb crumbs={crumbs} />           ← visual trail
 *   buildBreadcrumbs(crumbs)                  ← JSON-LD for schema injection
 *
 * One source. Two outputs. Never separately maintained.
 */
export function buildBreadcrumbs(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": `${business.domain}${crumb.href}`,
    })),
  };
}
