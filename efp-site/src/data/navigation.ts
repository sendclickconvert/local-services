// ============================================================
// EFP NAVIGATION DATA
// Drives Header nav links and Footer column links.
// Change nav structure here — never hardcode links in components.
// ============================================================

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Services",  href: "/services"   },
  { label: "Locations", href: "/locations"  },
  { label: "Guides",    href: "/guides"     },
  { label: "About",     href: "/about"      },
  { label: "Contact",   href: "/contact"    },
];

export const footerServiceLinks: NavLink[] = [
  { label: "480-a Forest Tax Law",      href: "/services/480a-forest-tax-law"       },
  { label: "Land Clearing",             href: "/services/land-clearing"             },
  { label: "Timber Harvesting",         href: "/services/timber-harvesting"         },
  { label: "Sell Standing Timber",      href: "/services/sell-standing-timber"      },
  { label: "Woodlot Management",        href: "/services/woodlot-management"        },
  { label: "Wildlife Habitat",          href: "/services/wildlife-habitat-management" },
  { label: "Stump Grinding",            href: "/services/stump-grinding"            },
  { label: "Tree Planting",             href: "/services/tree-planting"             },
];

export const footerResourceLinks: NavLink[] = [
  { label: "480-a Program Guide",       href: "/guides/480a-forest-tax-law-new-york" },
  { label: "About Henry",               href: "/about"                               },
  { label: "Contact / Free Assessment", href: "/contact"                             },
];
