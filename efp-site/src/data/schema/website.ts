// ⚠️ MANUAL-ONLY — do not edit with Agent
// This is a live sitewide ranking signal.
// Only Bryan Collins edits this file.
//
// ─── PRE-LAUNCH CHECKLIST ──────────────────────────────────────────────────────
// ☐ websiteSchema.description — must match homepage meta description exactly
// ☐ Confirm SearchAction urlTemplate if site adds search functionality
// DO NOT publish with any [TBD] placeholder still present.
// ────────────────────────────────────────────────────────────────────────────────

import { business } from '../client.config';

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${business.domain}/#website`,
  "url": business.domain,
  "name": business.name,
  "description": "Environmental Forest Products provides timber harvesting, land clearing, woodlot management, and 480-a tax consulting across Sullivan, Orange, and Ulster counties in NY. Professional forestry services since 1991. Call (845) 754-8242.",
  "publisher": {
    "@id": `${business.domain}/#organization`,
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${business.domain}/?s={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};
