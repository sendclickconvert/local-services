// ============================================================
// CONTENT COLLECTION CONFIG — src/content/config.ts
//
// Defines the Zod schema for the guides content collection.
// All 480-a hub articles and future editorial content live in
// src/content/guides/ and are rendered via guides/[...slug].astro.
//
// SLUG CONVENTION: Slug is derived from filename only.
// No frontmatter slug field. No overrides.
// File: 480a-eligibility-requirements-ny.md → slug: 480a-eligibility-requirements-ny
// ============================================================

import { defineCollection, z } from 'astro:content';

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    // ─── Required fields ─────────────────────────────────
    title: z.string(),
    // titleFull: when set, used as-is for the <title> tag (no suffix appended).
    // Use for pages where title + " | Environmental Forest Products" exceeds ~60 chars.
    titleFull: z.string().optional(),
    description: z.string(),
    datePublished: z.string(),   // ISO 8601: "2025-01-15"
    dateModified: z.string(),    // ISO 8601: "2025-01-15" — update on every edit

    // ─── Hub / spoke architecture ─────────────────────────
    // isPillar: true on the main pillar page only
    // hubSlug: spoke articles set this to the pillar's filename slug
    isPillar: z.boolean().default(false),
    hubSlug: z.string().optional(),   // e.g. "480a-forest-tax-law-new-york"
    // spokeLinks: pillar pages list any static-page spokes not in the collection
    spokeLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional(),

    // ─── Internal linking ─────────────────────────────────
    // Slugs of related service pages and county location pages.
    // Used by RelatedLinks.astro to render hub/spoke link blocks.
    relatedServices: z.array(z.string()).default([]),
    relatedLocations: z.array(z.string()).default([]),

    // ─── Content components ───────────────────────────────
    // FAQs rendered in FAQSection.astro AND FAQSchema.astro
    // — same array, two outputs (visible HTML + JSON-LD)
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).default([]),

    // keyTakeaway: 1-2 sentence answer for KeyTakeaway.astro
    // Primary AI Overview citation target — keep factual, not promotional
    keyTakeaway: z.string().optional(),

    // ─── Schema / OG ──────────────────────────────────────
    // ogImage: slug used to build image paths via buildOgImage() and buildSchemaImages()
    // If omitted, falls back to seo.ogImageDefault
    ogImageSlug: z.string().optional(),

    // ─── Indexing override ────────────────────────────────
    // Only set to true for pages explicitly decided not to index.
    // Default: false (all guides are indexed)
    noindex: z.boolean().default(false),
  }),
});

// ─── ARTICLES — Service cluster articles ──────────────────
// Rendered at /services/[service]/[slug]
// Each article belongs to exactly one parent service pillar.
// Word count: pillar-support articles 1,500-2,500w | supporting 800-1,100w
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    // ─── Required ──────────────────────────────────────────
    title: z.string(),
    // titleFull: when set, used as-is for the <title> tag (no suffix appended).
    // Use for pages where title + " | Environmental Forest Products" exceeds ~60 chars.
    titleFull: z.string().optional(),
    description: z.string(),
    datePublished: z.string(),   // ISO 8601
    dateModified: z.string(),    // ISO 8601 — update on every edit
    service: z.string(),         // Parent service slug: "tree-removal", "land-clearing", etc.

    // ─── Content components ───────────────────────────────
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).default([]),
    keyTakeaway: z.string().optional(),

    // ─── Schema / linking ─────────────────────────────────
    ogImageSlug: z.string().optional(),
    relatedArticles: z.array(z.string()).default([]),  // sibling article slugs
    noindex: z.boolean().default(false),
  }),
});

export const collections = { guides, articles };
