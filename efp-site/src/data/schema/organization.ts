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
// ✅ organizationSchema.description — filled April 2026
// ✅ organizationSchema.areaServed — populated with 6 county objects April 2026
// ☐ organizationSchema.sameAs — add GBP URL, SAF profile, NYFOA profile, woodproducts.ny.gov
// ☐ author.sameAs — add all directory profile URLs as they are claimed
//
// DO NOT publish with streetAddress still [TBD].
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
    { "@type": "AdministrativeArea", "name": "Sullivan County, NY" },
    { "@type": "AdministrativeArea", "name": "Orange County, NY" },
    { "@type": "AdministrativeArea", "name": "Ulster County, NY" },
    { "@type": "AdministrativeArea", "name": "Pike County, PA" },
    { "@type": "AdministrativeArea", "name": "Wayne County, PA" },
    { "@type": "AdministrativeArea", "name": "Sussex County, NJ" },
  ],
  "sameAs": [
    business.gbpUrl,
    "https://www.facebook.com/EForestProducts/",
    "https://www.instagram.com/eforestproducts/",
    "https://x.com/EForestproducts",
    "https://www.youtube.com/@EForestProducts",
    "https://www.yelp.com/biz/environmental-forest-products-westbrookville-2",
    "https://www.manta.com/c/mm7yg9p/environmental-forest-products",
    "https://nextdoor.com/pages/environmental-forest-products",
    "https://www.showmelocal.com/38716657-environmental-forest-products-westbrookville",
    "https://ezlocal.com/ny/westbrookville/forestry-services/0919047631",
    "https://pro.porch.com/westbrookville-ny/landscapers/environmental-forest-products/pp",
    "https://www.dnb.com/business-directory/company-profiles.environmental_forest_products_llc.",
    // ☐ Add SAF profile, NYFOA profile, woodproducts.ny.gov listing when available
    ...author.sameAs,
  ],
  "image": business.domain + "/images/og/efp-default.jpg",
  "priceRange": "$$",
  "description": "Environmental Forest Products is a professional forestry service led by consulting forester Henry Kowalec, serving landowners across Sullivan County, Orange County, and Ulster County, NY since 1991. We specialize in sustainable timber harvesting, land clearing for development, woodlot management plans, and 480-a Forest Tax Law enrollment. Our approach prioritizes forest health, landowner profitability, and responsible land stewardship. Whether you own 10 acres or 1,000, we provide certified forestry expertise that protects your land's long-term value while meeting your immediate goals. Services extend into Pike and Wayne counties in Pennsylvania and Sussex County in New Jersey.",
};
