// scripts/fetch-stock-photos.mjs
//
// Fills the service cards that have no real EFP photograph with Pexels imagery.
// Only the 7 services below lack a genuine photo — every other card already uses
// a real job-site image from /images/uploads/ and MUST NOT be touched.
//
// Usage:
//   PEXELS_API_KEY=xxx node scripts/fetch-stock-photos.mjs --dry-run   # list picks only
//   PEXELS_API_KEY=xxx node scripts/fetch-stock-photos.mjs             # download + optimize
//
// Output:
//   public/images/uploads/stock/<slug>.jpg
//   public/images/uploads/optimized/stock/<slug>-{480,800,1200}.webp
//   public/images/uploads/optimized/stock/<slug>-1200.jpg
//   public/images/uploads/stock/ATTRIBUTION.json
//
// The optimized/ paths mirror what OptimizedImage.astro derives at render time:
//   src.replace('/images/uploads/', '/images/uploads/optimized/') + '-<w>.webp'

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.PEXELS_API_KEY;
const DRY = process.argv.includes('--dry-run');

if (!KEY) {
  console.error('PEXELS_API_KEY is not set. Export it and re-run.');
  process.exit(1);
}

// ⚠️ eab and hwa are pest-identification pages. Stock imagery cannot be trusted
// to show the correct species, region, or damage stage — Henry must confirm both
// before publish, or they stay on icons.
const TARGETS = [
  { slug: '480a-forest-tax-law',        query: 'autumn hardwood forest standing trees', needsReview: false },
  { slug: 'wildlife-habitat',           query: 'white tailed deer in forest',           needsReview: false },
  { slug: 'forest-stewardship-planning',query: 'birch forest path autumn',              needsReview: false },

  // These two are PINNED BY PEXELS ID, not fetched by query. Keyword search for
  // them is unreliable — earlier passes returned a wildfire scene for EAB and a
  // pine close-up for hemlock. Both IDs below were inspected visually and
  // confirmed before pinning. Do not swap them for query-based lookups.
  //   36541588 — verified eastern hemlock: short flat two-ranked needles, small
  //              pendant cones, fine branchlets. Not pine, not spruce.
  //   13220277 — standing dead snags amid living summer foliage, Northampton MA;
  //              the stand-level dieback pattern, in the EAB-affected Northeast.
  { slug: 'hemlock-woolly-adelgid',     id: 36541588, needsReview: true },
  { slug: 'emerald-ash-borer',          id: 13220277, needsReview: true },
  { slug: 'stump-grinding',             query: 'freshly cut tree stump',                needsReview: false },
  { slug: 'tree-planting',              query: 'tree seedling reforestation forest',    needsReview: false },

  // Wide landscape plates used as PageHero backgrounds behind a dark overlay.
  // These are scenery, not job-site documentation — alt text is decorative.
  // 36397149 pinned: rounded fully-forested Appalachian ridges in autumn (Great
  // Smoky Mtns). Query-based lookup returned the French Alps — alpine peaks read
  // wrong for the Catskills. Verified visually before pinning.
  { slug: 'hero-woodland',              id: 36397149, needsReview: false },
  { slug: 'hero-forest-path',           query: 'misty forest morning sunlight landscape',   needsReview: false },
];

const ROOT     = path.resolve(process.cwd(), 'public/images/uploads');
const STOCK    = path.join(ROOT, 'stock');
const OPTIMIZED= path.join(ROOT, 'optimized', 'stock');
const WIDTHS   = [480, 800, 1200];

async function search(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}`
            + `&per_page=5&orientation=landscape&size=large`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  const json = await res.json();
  if (!json.photos?.length) throw new Error(`no results for "${query}"`);
  return json.photos[0];
}

async function byId(id) {
  const res = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
    headers: { Authorization: KEY },
  });
  if (!res.ok) throw new Error(`Pexels ${res.status} for id ${id}`);
  return res.json();
}

async function main() {
  if (!DRY) {
    await fs.mkdir(STOCK, { recursive: true });
    await fs.mkdir(OPTIMIZED, { recursive: true });
  }

  const attribution = [];

  for (const t of TARGETS) {
    let photo;
    try {
      photo = t.id ? await byId(t.id) : await search(t.query);
    } catch (err) {
      console.error(`  ✗ ${t.slug}: ${err.message}`);
      continue;
    }

    const flag = t.needsReview ? '  ⚠️ NEEDS HENRY REVIEW' : '';
    console.log(`  ${t.slug}`);
    console.log(`      source: ${t.id ? 'pinned id ' + t.id : 'query "' + t.query + '"'}`);
    console.log(`      photo : ${photo.url}`);
    console.log(`      by    : ${photo.photographer} (${photo.photographer_url})`);
    console.log(`      alt   : ${photo.alt || '(none supplied by Pexels)'}${flag}`);

    attribution.push({
      slug: t.slug,
      query: t.query ?? null,
      pinnedId: t.id ?? null,
      pexelsId: photo.id,
      pexelsUrl: photo.url,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      pexelsAlt: photo.alt || null,
      needsReview: t.needsReview,
    });

    if (DRY) continue;

    const src = photo.src.original;
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    await fs.writeFile(path.join(STOCK, `${t.slug}.jpg`), buf);

    for (const w of WIDTHS) {
      await sharp(buf).resize({ width: w })
        .webp({ quality: 82 })
        .toFile(path.join(OPTIMIZED, `${t.slug}-${w}.webp`));
    }
    await sharp(buf).resize({ width: 1200 })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OPTIMIZED, `${t.slug}-1200.jpg`));
  }

  if (!DRY) {
    await fs.writeFile(
      path.join(STOCK, 'ATTRIBUTION.json'),
      JSON.stringify(attribution, null, 2)
    );
    console.log(`\nWrote ${attribution.length} photo sets + ATTRIBUTION.json`);
  } else {
    console.log('\n(dry run — nothing written)');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
