// ⚠️ MANUAL-ONLY — do not edit with Agent
// This is a live sitewide ranking signal.
// Only Bryan Collins edits this file.
//
// ─── PRE-LAUNCH CHECKLIST — ALL FIELDS BELOW MUST BE RESOLVED BEFORE GO-LIVE ──
// ☐ business.address.street — confirm exact mailing address with Henry
// ☐ business.address.zip — confirm zip code
// ☐ business.email — confirm contact email
// ☐ business.foundedYear — confirm year
// ☐ business.coordinates — verify lat/lng in Google Maps (current value is approximate)
// ☐ business.gbpUrl — add after GBP optimization is complete
// ☐ organizationSchema.description — write 150-200 word keyword-rich description (factual tone)
// ☐ organizationSchema.areaServed — populate with all 6 county objects
// ☐ organizationSchema.sameAs — add GBP URL, SAF profile, NYFOA profile, woodproducts.ny.gov
// ☐ author.sameAs — add all directory profile URLs as they are claimed
//
// DO NOT publish this file with any [TBD] placeholder still present.
// ────────────────────────────────────────────────────────────────────────────────

import { business, author } from '../client.config';

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": `${business.domain}/#organization`,
  "name": business.name,
  "url": business.domain,
  "telephone": business.phone,
  "email": business.email,
  "founder": {
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.title,
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": business.address.street,
    "addressLocality": business.address.city,
    "addressRegion": business.address.stateAbbr,
    "postalCode": business.address.zip,
    "addressCountry": business.address.country,
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": business.coordinates.lat,
    "longitude": business.coordinates.lng,
  },
  "areaServed": [
    // [TBD] Populate with full county + state objects before launch
    // Example: { "@type": "AdministrativeArea", "name": "Sullivan County, NY" }
  ],
  "sameAs": [
    // [TBD] Add GBP URL, SAF profile, NYFOA profile, woodproducts.ny.gov listing
    ...author.sameAs,
  ],
  "image": business.domain + "/images/og/efp-default.jpg",
  "priceRange": "$$",
  // description: [TBD] — keyword-rich description, 150-200 words, factual tone
  "description": "[TBD — keyword-rich LocalBusiness description]",
};
