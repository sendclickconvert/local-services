# Environmental Forest Products — Website

Astro + Tailwind build for [eforestproducts.com](https://eforestproducts.com).

## Stack
- **Framework:** Astro 4 (hybrid output)
- **CSS:** Tailwind CSS 3
- **Adapter:** @astrojs/node (standalone)
- **Hosting:** Replit (dev) → production TBD

## Commands
```bash
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:4321
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Structure
```
src/
  pages/
    services/     # 9 service pages
    locations/    # 6 county hubs + 118 town pages (dynamic)
    guides/       # Pillar guide content
    lp/           # Landing pages (PPC/direct mail)
  components/
    layout/       # Header, Footer, BaseHead
    ui/           # Reusable content components
    schema/       # JSON-LD schema components
    forms/        # EstimateForm
  data/
    client.config.ts   # NAP, phone, email — source of truth
    locations.ts       # All 6 counties + 118 towns
    services.ts        # 9 services
  content/
    guides/       # Markdown pillar guides
```

## Pre-Launch Checklist
- [ ] Confirm street address with Henry → update `client.config.ts`
- [ ] Add GBP URL → `client.config.ts`
- [ ] Complete `src/data/schema/organization.ts` (manual-only file)
- [ ] Wire `src/api/submit-form.ts` to GHL form endpoint
- [ ] GSC verification tag → `BaseHead.astro`
- [ ] GA4 measurement ID → `BaseHead.astro`

## ⚠️ Manual-Only Files
Do not auto-edit these files:
- `src/data/schema/organization.ts`
- `src/data/schema/website.ts`
- `src/api/submit-form.ts`
- Canonical tags, redirect logic, analytics wiring
