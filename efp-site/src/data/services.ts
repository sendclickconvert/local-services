// ============================================================
// EFP SERVICES DATA
// Single source of truth for all service definitions.
// Used by: Header nav, Footer links, Services index, ServiceCard grids,
// county pages, town pages, schema areaServed, and sitemap generation.
// ============================================================

export interface Service {
  name: string;
  slug: string;
  excerpt: string;
  icon: string;
  iconImage?: string;
  isPrimary: boolean;
}

export const services: Service[] = [
  {
    name: "480-a Forest Tax Law",
    slug: "480a-forest-tax-law",
    excerpt: "Reduce your property taxes with NY's 480-a program. Henry is one of a small number of certified foresters in the region qualified to write the required management plans.",
    icon: "🌲",
    iconImage: "/images/icons/480a-tax-law.png",
    isPrimary: true,
  },
  {
    name: "Land Clearing",
    slug: "land-clearing",
    excerpt: "Residential and commercial site preparation across Sullivan, Orange, and Ulster counties — clearing expertise grounded in forestry, not just excavation.",
    icon: "🚜",
    iconImage: "/images/icons/land-clearing.png",
    isPrimary: true,
  },
  {
    name: "Timber Harvesting",
    slug: "timber-harvesting",
    excerpt: "Selective, sustainable logging services. A consulting forester plans and oversees every harvest to protect your woodland and maximize what the timber is worth.",
    icon: "🪵",
    iconImage: "/images/icons/timber-harvesting.png",
    isPrimary: true,
  },
  {
    name: "Sell Standing Timber",
    slug: "sell-standing-timber",
    excerpt: "Timber appraisal, competitive bidding, and sale management. Find out what your timber is actually worth before you accept any offer.",
    icon: "💰",
    iconImage: "/images/icons/sell-standing-timber.png",
    isPrimary: false,
  },
  {
    name: "Woodlot Management",
    slug: "woodlot-management",
    excerpt: "Forest management plans for private landowners — required for 480-a enrollment and the foundation of any long-term woodland stewardship program.",
    icon: "🗺️",
    iconImage: "/images/icons/woodlot-management.png",
    isPrimary: true,
  },
  {
    name: "Wildlife Habitat Management",
    slug: "wildlife-habitat-management",
    excerpt: "Targeted forestry practices that improve habitat for deer, turkey, grouse, and native wildlife — fully compatible with 480-a and timber objectives.",
    icon: "🦌",
    iconImage: "/images/icons/wildlife-habitat.png",
    isPrimary: false,
  },
  {
    name: "Tree Removal",
    slug: "tree-removal",
    excerpt: "Safe, professional tree removal for residential and rural properties in Sullivan, Orange, and Ulster counties — with timber value assessment before the saw starts.",
    icon: "🪚",
    iconImage: "/images/icons/tree-removal.png",
    isPrimary: false,
  },
  {
    name: "Stump Grinding",
    slug: "stump-grinding",
    excerpt: "Complete stump removal after tree work, land clearing, or timber harvesting — leaving the site clean and ready for its next use.",
    icon: "⚙️",
    iconImage: "/images/icons/stump-grinding.png",
    isPrimary: false,
  },
  {
    name: "Tree Planting",
    slug: "tree-planting",
    excerpt: "Reforestation and species improvement planting — restoring woodland character and supporting long-term forest health.",
    icon: "🌱",
    iconImage: "/images/icons/tree-planting.png",
    isPrimary: false,
  },
];

export const primaryServices = services.filter(s => s.isPrimary);

export function getService(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}
