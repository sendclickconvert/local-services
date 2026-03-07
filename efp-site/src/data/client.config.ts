// ============================================================
// EFP CLIENT CONFIG — Environmental Forest Products
// All client-specific values live here.
// Universal components consume this file — never hardcode client
// data anywhere else in the codebase.
//
// ⚠️ REPEATABLE SYSTEM NOTE: When cloning this scaffold for a
// new client, replace only this file and src/data/services.ts,
// src/data/locations.ts, src/data/navigation.ts, and src/content/.
// Universal components and layouts require zero changes.
// ============================================================

// ─── BUSINESS ─────────────────────────────────────────────
export const business = {
  name: "Environmental Forest Products",
  shortName: "EFP",
  tagline: "Certified Forestry Consulting for the Hudson Valley & Catskills",
  owner: "Henry Kowalec",
  ownerTitle: "Consulting Forester",
  ownerExperience: "30+ years",
  combinedExperience: "nearly 100 years", // Team combined experience per company copy
  phone: "(845) 754-8242",
  phoneRaw: "+18457548242",
  address: {
    street: "[TBD — confirm mailing address with Henry before launch]",
    city: "Westbrookville",
    state: "NY",
    stateAbbr: "NY",
    zip: "12785",
    country: "US",
  },
  coordinates: {
    // Westbrookville, NY approximate — confirm exact coords before launch
    lat: 41.5651,
    lng: -74.5632,
  },
  domain: "https://eforestproducts.com",
  email: "henry@eforestproducts.com",
  gbpUrl: "[TBD — paste full GBP URL after claiming/optimizing]",
  foundedYear: "1991",
} as const;

// ─── INTEGRATIONS ─────────────────────────────────────────
// All values pulled from environment variables — never hardcoded
export const integrations = {
  ga4MeasurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
  ghlLocationId:    import.meta.env.PUBLIC_GHL_LOCATION_ID,
  ghlApiBase:       import.meta.env.PUBLIC_GHL_API_BASE,
  trackingScriptId: import.meta.env.PUBLIC_TRACKING_SCRIPT_ID,
  // ⚠️ MANUAL-ONLY — GHL (CRST Web) webhook. Do not edit with Agent.
  formEndpoint: "/api/submit-form",
} as const;

// ─── SERVICE AREA ─────────────────────────────────────────
// Each county entry includes all fields needed for title tags,
// schema, breadcrumbs, and GSC consistency across NY/PA/NJ pages.
export const serviceArea = {
  primary: [
    { name: "Sullivan County", stateAbbr: "NY", stateFull: "New York",      slug: "sullivan-county-ny" },
    { name: "Orange County",   stateAbbr: "NY", stateFull: "New York",      slug: "orange-county-ny"   },
    { name: "Ulster County",   stateAbbr: "NY", stateFull: "New York",      slug: "ulster-county-ny"   },
  ],
  secondary: [
    { name: "Pike County",   stateAbbr: "PA", stateFull: "Pennsylvania", slug: "pike-county-pa"   },
    { name: "Wayne County",  stateAbbr: "PA", stateFull: "Pennsylvania", slug: "wayne-county-pa"  },
    { name: "Sussex County", stateAbbr: "NJ", stateFull: "New Jersey",   slug: "sussex-county-nj" },
  ],
  statesCovered: ["New York", "Pennsylvania", "New Jersey"],
  all() {
    return [...this.primary, ...this.secondary];
  },
} as const;

// ─── CTA ──────────────────────────────────────────────────
// b2c: private landowners and property owners
// b2b: developers, land investors, commercial contractors
export const cta = {
  b2c: {
    primary: {
      label: "Call for a Free Consultation",
      href:  `tel:${business.phoneRaw}`,
    },
    secondary: {
      label: "Request a Property Assessment",
      href:  "#contact-form",
    },
  },
  b2b: {
    primary: {
      label: "Schedule a Timber Appraisal",
      href:  `tel:${business.phoneRaw}`,
    },
    secondary: {
      label: "Request a Commercial Quote",
      href:  "#contact-form",
    },
  },
} as const;

// ─── SEO DEFAULTS ─────────────────────────────────────────
// Page-level overrides always win. These are the fallbacks only.
// All canonical URL logic lives in src/lib/seo.ts — not here.
export const seo = {
  titleSuffix: " | Environmental Forest Products",
  defaultDescription:
    "Certified forestry consulting in the Hudson Valley and Catskills. " +
    "480-a Forest Tax Law, land clearing, timber harvesting, and woodlot management. " +
    "Serving Sullivan, Orange, and Ulster counties, NY.",
  ogImageDefault: "/images/og/efp-default.jpg",
} as const;

// ─── AUTHOR / E-E-A-T ─────────────────────────────────────
// Used in AuthorByline.astro and ArticleSchema.astro
// sameAs array should be expanded as directory profiles are claimed
export const author = {
  name:       "Henry Kowalec",
  title:      "Consulting Forester",
  experience: "30+ years",
  bio:
    "Henry Kowalec founded Environmental Forest Products in 1991. He and his team bring nearly 100 years " +
    "of combined forestry experience to timber harvesting, 480-a Forest Tax Law management plans, land " +
    "clearing, and woodland management across the Hudson Valley, Catskills, and Tri-State area. Henry is " +
    "certified to write DEC-approved 480-a management plans under New York State law.",
  phone:    "(845) 754-8242",
  phoneRaw: "+18457548242",
  sameAs: [
    "https://eforestproducts.com/about",
    // "[TBD] SAF member directory profile URL",
    // "[TBD] NYFOA member profile URL",
    // "[TBD] NY woodproducts.ny.gov forester directory URL",
  ],
} as const;
