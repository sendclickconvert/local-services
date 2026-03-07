// ============================================================
// EFP MEDIA MANIFEST
// All confirmed job-site photos from Henry — mapped to pages.
//
// Usage: import mediaManifest from './media-manifest'
// Then reference manifest.pages.timberHarvesting.hero etc.
//
// ALT TEXT RULE: describe what is actually happening + location.
// Do not write generic "logging equipment" — be specific.
// Google image search and AI alt-text parsing reward specificity.
// ============================================================

export const mediaManifest = {

  // ─── HOMEPAGE ────────────────────────────────────────────────────────────
  homepage: {
    hero: {
      src: "/images/uploads/land-clearing-forestburgh-ny-komatsu.jpg",
      alt: "Two Komatsu excavators clearing land at a project in Forestburgh, NY — Environmental Forest Products",
      credit: "EFP job site, Forestburgh, Sullivan County NY",
    },
    videoPoster: {
      src: "/images/uploads/spruce-timber-harvest-millbrook-ny.jpg",
      alt: "Spruce timber harvest at a property in Millbrook, NY — selective harvesting by Environmental Forest Products",
      credit: "Spruce harvest, Millbrook NY",
    },
    equipmentFeature: {
      src: "/images/uploads/efp-new-timbermatic-harvester-equipment.jpg",
      alt: "Environmental Forest Products new Timbermatic wheeled harvester with grapple — forestry equipment fleet",
      credit: "New equipment acquisition, Westbrookville NY",
    },
  },

  // ─── TIMBER HARVESTING PAGE ──────────────────────────────────────────────
  timberHarvesting: {
    hero: {
      src: "/images/uploads/komatsu-feller-buncher-timber-harvest-1-ny.jpg",
      alt: "Komatsu XT445L tracked feller buncher working a timber harvest in New York — Environmental Forest Products",
      credit: "Komatsu feller buncher, NY timber harvest",
    },
    supporting: [
      {
        src: "/images/uploads/timberjack-forwarder-nyc-dep-carmel-ny.jpg",
        alt: "Timberjack 1010B forwarder picking up large hardwood logs on an NYC DEP project in Carmel, NY",
        credit: "NYC DEP forestry project, Carmel NY",
        note: "E-E-A-T GOLD — government project proof",
      },
      {
        src: "/images/uploads/hand-felling-trees-nyc-dep-carmel-ny.jpg",
        alt: "Forester hand-felling trees with chainsaw on an NYC DEP timber project in Carmel, NY",
        credit: "NYC DEP project, Carmel NY",
        note: "Human element + government project — strong trust signal",
      },
      {
        src: "/images/uploads/spruce-timber-harvest-millbrook-ny.jpg",
        alt: "Spruce timber harvest in Millbrook, NY — selective logging preserving woodland character",
        credit: "Spruce harvest, Millbrook NY",
      },
      {
        src: "/images/uploads/forwarder-hardwood-logs-westbrookville-ny.jpg",
        alt: "Forwarder moving hardwood logs off a mountain in Westbrookville, NY — Sullivan County timber harvesting",
        credit: "Hardwood forwarding, Westbrookville NY",
      },
      {
        src: "/images/uploads/komatsu-feller-buncher-timber-harvest-2-ny.jpg",
        alt: "Komatsu tracked feller buncher with Secutian harvesting head — selective timber harvesting in New York",
        credit: "Komatsu feller buncher series",
      },
      {
        src: "/images/uploads/komatsu-feller-buncher-selective-harvest-ny.jpg",
        alt: "Komatsu feller buncher working beneath a full green summer canopy — sustainable selective harvesting NY",
        credit: "Summer harvest operation, NY",
      },
    ],
  },

  // ─── SELL STANDING TIMBER PAGE ───────────────────────────────────────────
  sellStandingTimber: {
    hero: {
      src: "/images/uploads/log-truck-hardwood-timber-sparta-nj.jpg",
      alt: "Red log truck loaded with large hardwood timber logs from a project in Sparta, NJ — Environmental Forest Products",
      credit: "Timber haul, Sparta NJ",
    },
    supporting: [
      {
        src: "/images/uploads/efp-log-truck-pup-trailer-environmental-forest-products.jpg",
        alt: "Environmental Forest Products branded log truck with pup logging trailer — (845) 754-8242",
        credit: "EFP branded truck fleet",
        note: "Phone number visible on door — brand reinforcement",
      },
      {
        src: "/images/uploads/log-trucks-timber-export-hudson-valley-ny.jpg",
        alt: "Log trucks loaded with fresh-cut timber for export to Canada — Hudson Valley timber marketing",
        credit: "Timber export, Hudson Valley NY",
        note: "Shows logs have international market reach — strong for Sell Standing Timber page",
      },
    ],
  },

  // ─── LAND CLEARING PAGE ───────────────────────────────────────────────────
  landClearing: {
    hero: {
      src: "/images/uploads/land-clearing-forestburgh-ny-komatsu.jpg",
      alt: "Land clearing project in Forestburgh, NY — two Komatsu excavators with EFP crew on site",
      credit: "Land clearing, Forestburgh Sullivan County NY",
    },
  },

  // ─── STUMP GRINDING PAGE ─────────────────────────────────────────────────
  stumpGrinding: {
    // ⚠️ No dedicated stump grinding photos in this set — use land clearing as fallback
    // Request: Henry to photograph the stump grinder in action
    hero: {
      src: "/images/uploads/land-clearing-forestburgh-ny-komatsu.jpg",
      alt: "Site clearing and stump removal in Forestburgh, NY — Environmental Forest Products Sullivan County",
      credit: "Site clearing, Forestburgh NY",
      note: "⚠️ Placeholder — request dedicated stump grinding photos from Henry",
    },
  },

  // ─── EQUIPMENT SECTION (Homepage + About) ────────────────────────────────
  equipment: [
    {
      src: "/images/uploads/efp-new-timbermatic-harvester-equipment.jpg",
      alt: "Environmental Forest Products new Timbermatic 1270 wheeled harvester with grapple — Westbrookville NY yard",
      credit: "New equipment acquisition",
    },
    {
      src: "/images/uploads/komatsu-harvester-transport-kingston-ny.jpg",
      alt: "Komatsu XT445L feller buncher on lowboy trailer being transported to Kingston, NY job site",
      credit: "Equipment transport, Kingston NY",
    },
    {
      src: "/images/uploads/efp-wheeled-harvester-transport-ny.jpg",
      alt: "Large wheeled harvester on lowboy transport trailer — EFP equipment fleet New York",
      credit: "Equipment fleet, NY",
    },
  ],

  // ─── GBP UPLOAD QUEUE ────────────────────────────────────────────────────
  // These are ready to upload directly to Google Business Profile
  gbpUploadReady: [
    "land-clearing-forestburgh-ny-komatsu.jpg",
    "komatsu-feller-buncher-timber-harvest-1-ny.jpg",
    "timberjack-forwarder-nyc-dep-carmel-ny.jpg",
    "hand-felling-trees-nyc-dep-carmel-ny.jpg",
    "efp-log-truck-pup-trailer-environmental-forest-products.jpg",
    "log-truck-hardwood-timber-sparta-nj.jpg",
    "efp-new-timbermatic-harvester-equipment.jpg",
    "spruce-timber-harvest-millbrook-ny.jpg",
    "komatsu-harvester-transport-kingston-ny.jpg",
  ],

  // ─── NEEDS ACTION ────────────────────────────────────────────────────────
  needsAction: [
    {
      file: "forwarder-hardwood-logs-westbrookville-ny.jpg",
      note: "Cropped from iPhone screenshot — usable but not ideal. Ask Henry for original file.",
    },
    {
      file: "MISSING: stump grinding photo",
      note: "No dedicated stump grinder photos provided. Request from Henry for stump-grinding service page.",
    },
    {
      file: "MISSING: 480-a management plan or forest walk photo",
      note: "Henry on site with landowner, reviewing trees/marking timber. Critical for 480-a page E-E-A-T.",
    },
    {
      file: "MISSING: Henry portrait / headshot",
      note: "Needed for About page, AuthorByline component, and Google Business Profile.",
    },
  ],
};
