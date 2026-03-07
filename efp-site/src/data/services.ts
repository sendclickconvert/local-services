// ============================================================
// EFP SERVICES DATA
// Single source of truth for all service definitions.
// Used by: Header nav, Footer links, Services index, ServiceCard grids,
// county pages, town pages, schema areaServed, and sitemap generation.
// ============================================================

export interface Service {
  name: string;
  slug: string;
  excerpt: string;      // Used in ServiceCard and service grids
  icon: string;         // Emoji icon for cards
  isPrimary: boolean;   // Primary services appear in nav + hero grids
}

export const services: Service[] = [
  {
    name: "480-a Forest Tax Law",
    slug: "480a-forest-tax-law",
    excerpt: "Reduce property taxes on qualifying wooded land through New York's 480-a program — Henry is one of a small number of certified foresters in the region qualified to write the required management plans.",
    icon: "🌲",
    isPrimary: true,
  },
  {
    name: "Land Clearing",
    slug: "land-clearing",
    excerpt: "Residential and commercial site preparation across Sullivan, Orange, and Ulster counties — clearing expertise grounded in forestry, not just excavation.",
    icon: "🚜",
    isPrimary: true,
  },
  {
    name: "Timber Harvesting",
    slug: "timber-harvesting",
    excerpt: "Selective, sustainable logging services. A consulting forester plans and oversees every harvest to protect your woodland and maximize what the timber is worth.",
    icon: "🪵",
    isPrimary: true,
  },
  {
    name: "Sell Standing Timber",
    slug: "sell-standing-timber",
    excerpt: "Timber appraisal, competitive bidding, and sale management. Find out what your timber is actually worth before you accept any offer.",
    icon: "💰",
    isPrimary: true,
  },
  {
    name: "Woodlot Management",
    slug: "woodlot-management",
    excerpt: "Forest management plans for private landowners — required for 480-a enrollment and the foundation of any long-term woodland stewardship program.",
    icon: "🗺️",
    isPrimary: true,
  },
  {
    name: "Wildlife Habitat Management",
    slug: "wildlife-habitat-management",
    excerpt: "Targeted forestry practices that improve habitat for deer, turkey, grouse, and native wildlife — fully compatible with 480-a and timber objectives.",
    icon: "🦌",
    isPrimary: false,
  },
  {
    name: "Stump Grinding",
    slug: "stump-grinding",
    excerpt: "Complete stump removal after tree work, land clearing, or timber harvesting — leaving the site clean and ready for its next use.",
    icon: "⚙️",
    isPrimary: false,
  },
  {
    name: "Tree Planting",
    slug: "tree-planting",
    excerpt: "Reforestation and species improvement planting — restoring woodland character and supporting long-term forest health.",
    icon: "🌱",
    isPrimary: false,
  },
];

/** Primary services only — for nav and hero service grids */
export const primaryServices = services.filter(s => s.isPrimary);

/** Get a service by slug */
export function getService(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
