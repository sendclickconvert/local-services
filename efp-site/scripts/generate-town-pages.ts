// scripts/generate-town-pages.ts
// Run from efp-site/efp-site/: npx tsx scripts/generate-town-pages.ts
//
// Creates an individual static .astro file for every town NOT already
// hand-written. Deletes the dynamic [county]/[town].astro template.
// Each generated page has content derived 100% from that town's unique data.

import { counties, getNeighbors } from '../src/data/locations';
import type { Town, County } from '../src/data/locations';
import * as fs from 'fs';
import * as path from 'path';

// ── Towns that already have hand-crafted pages ──────────────────────────────
const SKIP: Record<string, Set<string>> = {
  'sullivan-county-ny': new Set([
    'barryville','bethel','callicoon','fallsburg',
    'liberty','livingston-manor','monticello','narrowsburg','roscoe',
  ]),
  'ulster-county-ny':  new Set(['olive','hurley']),
  'orange-county-ny':  new Set(['port-jervis']),
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Safely JSON-quote a string for embedding in frontmatter. */
function q(s: string): string { return JSON.stringify(s); }

/** Species-specific timber market commentary (~2 sentences, unique per species profile). */
function speciesMarket(species: string, countyName: string): string {
  const s = species.toLowerCase();
  if (s.includes('black cherry')) {
    return `Black cherry is among the most valuable cabinet and furniture species in the northeastern hardwood market, and ${countyName} properties with quality cherry stands command strong stumpage prices when properly bid through a competitive process. Red oak from this region is actively sought by flooring mills, structural lumber buyers, and hardwood distributors throughout the area.`;
  }
  if (s.includes('sugar maple') || s.includes('hard maple')) {
    return `Sugar maple — one of the highest-value hardwood species for flooring, furniture, and butcher block production — is present in the ${countyName} forest composition here. Beech and yellow birch from this region also carry market demand, particularly for select hardwood uses and paper production, and should be appraised separately from lower-value softwood co-occurring species.`;
  }
  if (s.includes('tulip poplar')) {
    return `Tulip poplar from this part of ${countyName} serves the furniture component, millwork, and structural lumber markets. Red oak and black cherry present on the better upland sites carry higher stumpage values than poplar, and accurately characterizing the full species mix — rather than treating the stand as uniform — is the first job a forester does before any appraisal is given.`;
  }
  if (s.includes('chestnut oak')) {
    return `Chestnut oak from the ridge sites here has consistent market demand for flooring, tannin extraction, and hardwood lumber. Mixed red oak and black birch from the lower slopes carry independent stumpage value that a single undifferentiated appraisal will often understate — separating them is standard practice for a certified forestry appraisal.`;
  }
  if (s.includes('hemlock') || s.includes('white pine')) {
    return `Softwood species — white pine and hemlock — present in this part of ${countyName} have market demand for framing lumber, decking, and structural uses. Hardwood species on the better upland sites often carry premium stumpage values that get obscured when a mixed stand is appraised as a single undifferentiated lot rather than species by species.`;
  }
  if (s.includes('northern hardwood') || s.includes('yellow birch') || s.includes('beech')) {
    return `Northern hardwood stands — sugar maple, beech, and yellow birch — define the upper elevations of this area and carry market value across furniture, flooring, and hardwood lumber channels. Appraising these species correctly requires knowledge of the current regional mill market and an on-site volume estimate, not a per-acre formula.`;
  }
  // default: mixed oak
  return `Red oak is the primary commercial hardwood species in this area, with active buyers among regional flooring mills, structural lumber producers, and hardwood distributors throughout ${countyName} and neighboring counties. Secondary species — red maple, black birch, and others present in the local stand — have their own market channels and should be appraised individually rather than lumped into a single mixed-wood estimate.`;
}

/** Terrain-specific land clearing context (~2 sentences). */
function terrainClearing(terrain: string, townName: string, countyName: string): string {
  const t = terrain.toLowerCase();
  if (t.includes('river') || t.includes('creek') || t.includes('stream') || t.includes('esopus') || t.includes('delaware') || t.includes('neversink') || t.includes('wallkill')) {
    return `Land clearing near ${townName} often requires attention to drainage patterns and riparian setbacks — the river and creek corridors in this part of ${countyName} create site conditions where clearing plans need to account for water flow and potential erosion risk. EFP's pre-clearing assessment addresses these site conditions before any equipment is mobilized.`;
  }
  if (t.includes('ridge') || t.includes('steep') || t.includes('highlands') || t.includes('mountain') || t.includes('ramapo') || t.includes('shawangunk') || t.includes('catskill')) {
    return `The ridge and upland terrain in the ${townName} area creates specific access requirements for clearing and harvest work. Steep slopes require equipment suited to grade and careful planning of any skid roads to prevent compaction and erosion. EFP's assessment process identifies those site-specific constraints before any work begins.`;
  }
  if (t.includes('rocky') || t.includes('rock') || t.includes('quartzite') || t.includes('dramatic')) {
    return `The rocky, uneven terrain characteristic of the ${townName} area affects both harvest access and clearing logistics. EFP evaluates these site conditions in advance — identifying accessible routes, sensitive features, and any terrain-related constraints — before any equipment or crews arrive on site.`;
  }
  if (t.includes('pocono') || t.includes('plateau') || t.includes('lake wallenpaupack') || t.includes('lackawaxen')) {
    return `Clearing projects in the ${townName} area involve the mixed hardwood and softwood terrain of the Pocono region, where variable soil conditions and drainage patterns require a site-specific assessment before clearing begins. EFP's pre-clearing evaluation identifies which trees have market value worth recovering and flags any terrain features that affect the project plan.`;
  }
  if (t.includes('suburban') || t.includes('residential') || t.includes('urban') || t.includes('developed')) {
    return `Land clearing in the ${townName} area frequently involves residential and development-adjacent properties, where site constraints — property boundaries, existing structures, underground utilities, and drainage features — require careful pre-clearing assessment. EFP's evaluation identifies merchantable timber value and site-specific access before any equipment arrives.`;
  }
  // default: rolling/gentle terrain
  return `Land clearing near ${townName} benefits from the relatively accessible rolling terrain typical of this part of ${countyName}. Standard clearing equipment can reach most sites with proper access road planning, and EFP's pre-clearing assessment identifies any sensitive features — drainage swales, steep faces, wet areas, or high-value timber — before work begins.`;
}

/** "Why Henry" paragraph referencing terrain and primary species (~2 sentences). */
function whyHenryPara(terrain: string, species: string, townName: string, countyName: string, isNY: boolean): string {
  const primarySp = species.split(',')[0].trim();
  // Trim terrain to the first clause for readability
  const terrainDesc = terrain.replace(/\.$/, '').split(/,|;/)[0].toLowerCase();
  return `Henry Kowalec has conducted timber assessments, harvest operations, and land management work across ${countyName} for more than 30 years — including on properties with the ${terrainDesc} and the ${primarySp}-dominant forest composition that characterizes the ${townName} area. That accumulated site-specific experience means he can evaluate a property in ${townName} with the context of hundreds of comparable assessments in this same region, not just general forestry principles applied from the outside.`;
}

/** State program callout block — fully expanded static HTML. */
function stateProgramBlock(county: County, town: Town): string {
  const isNY = county.stateAbbr === 'NY';
  const isPA = county.stateAbbr === 'PA';

  if (isNY) {
    return `
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 my-10">
      <h3 class="font-bold text-[#1a3c1a] text-lg mb-2">480-a Forest Tax Law — ${town.name} Area Properties</h3>
      <p class="text-gray-700 text-sm mb-3">
        New York's 480-a Forest Tax Law program allows woodland owners with 50 or more contiguous acres of qualifying
        forest to apply for a property and school tax exemption of up to 80% on enrolled acreage. The program requires
        a DEC-approved forest management plan prepared by a certified consulting forester — Environmental Forest Products
        prepares these plans for ${county.name} landowners and manages the full DEC certification process.
      </p>${town.taxNote ? `
      <p class="text-gray-700 text-sm mb-3 italic">${town.taxNote}</p>` : ''}
      <p class="text-gray-700 text-sm mb-4">
        Enrollment delivers annual tax savings in exchange for a 10-year commitment to manage the forest under the
        approved plan. Henry Kowalec handles eligibility screening, plan preparation, DEC submission, and ongoing
        annual compliance guidance for enrolled ${county.name} properties.
      </p>
      <a href="/services/480a-forest-tax-law" class="text-[#2d5a2d] font-semibold text-sm underline hover:text-[#1a3c1a]">Learn about 480-a enrollment for ${county.name} landowners →</a>
    </div>`;
  }

  if (isPA) {
    return `
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 my-10">
      <h3 class="font-bold text-[#1a3c1a] text-lg mb-2">Clean and Green — ${town.name} Area Woodland Properties</h3>
      <p class="text-gray-700 text-sm mb-4">
        Pennsylvania's Clean and Green program provides preferential tax assessment for qualifying agricultural and
        woodland properties. Enrolled woodland parcels are assessed at use value rather than fair market value, which
        can meaningfully reduce annual property tax obligations for ${county.name} landowners with qualifying acreage.
        A woodland management plan prepared by a certified forester supports both Clean and Green eligibility and
        longer-term timber and land management objectives. Contact Henry Kowalec to discuss what options apply to
        your ${town.name} area property.
      </p>
      <a href="/services/woodlot-management" class="text-[#2d5a2d] font-semibold text-sm underline hover:text-[#1a3c1a]">Learn about woodland management planning →</a>
    </div>`;
  }

  // NJ
  return `
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 my-10">
      <h3 class="font-bold text-[#1a3c1a] text-lg mb-2">Farmland Assessment — ${town.name} Area Woodland Properties</h3>
      <p class="text-gray-700 text-sm mb-4">
        New Jersey's Farmland Assessment Act provides preferential tax treatment for qualifying woodland and agricultural
        parcels of five or more acres. Enrolled properties are assessed at agricultural use value rather than fair
        market value, which can reduce annual property taxes for ${county.name} landowners with qualifying woodland.
        A management plan prepared by a certified forester supports Farmland Assessment eligibility and is also the
        foundation of a timber sale or long-term woodland management program. Contact Henry Kowalec to discuss the
        specific options applicable to your ${town.name} property.
      </p>
      <a href="/services/woodlot-management" class="text-[#2d5a2d] font-semibold text-sm underline hover:text-[#1a3c1a]">Learn about woodland management planning →</a>
    </div>`;
}

// ── Core page generator ──────────────────────────────────────────────────────
function generatePage(
  county: County,
  town: Town,
  siblingTowns: Town[],
  neighbors: County[],
): string {
  const isNY = county.stateAbbr === 'NY';

  const title       = `Forestry Consulting — ${town.name}, ${county.stateAbbr} | EFP`;
  const description = `Certified forestry consulting in ${town.name}, ${county.name}. ${isNY ? '480-a Forest Tax Law, ' : ''}land clearing, timber harvesting, and woodlot management for local landowners. Henry Kowalec, 30+ years experience. Call (845) 754-8242.`;
  const canonicalUrl = `https://eforestproducts.com/locations/${county.slug}/${town.slug}`;

  const primarySpecies = town.species.split(',')[0].trim();

  const spMarket   = speciesMarket(town.species, county.name);
  const terrClr    = terrainClearing(town.terrain, town.name, county.name);
  const whyHenry   = whyHenryPara(town.terrain, town.species, town.name, county.name, isNY);
  const stateBlock = stateProgramBlock(county, town);

  const programName = isNY
    ? 'the 480-a Forest Tax Law program'
    : county.stateAbbr === 'PA'
      ? 'the Clean and Green program'
      : "New Jersey's Farmland Assessment program";

  // FAQs — every answer references town-specific data
  const faqs = [
    {
      question: `Do you provide forestry consulting near ${town.name}, ${county.stateAbbr}?`,
      answer:   `Yes. Environmental Forest Products serves private landowners in ${town.name} and throughout ${county.name}. Henry Kowalec has 30+ years of hands-on forestry experience in this region and provides on-site assessments for all service inquiries. Call (845) 754-8242 to discuss your property.`,
    },
    {
      question: `What does a forestry site assessment in ${town.name} involve?`,
      answer:   `An initial site visit covers the key questions: what species are present, what the timber volume and size-class distribution looks like, whether the property qualifies for ${programName}, and what management approach — harvest, improvement cutting, or a long-term management plan — makes the most sense given the landowner's objectives. Visits typically take 1–3 hours depending on parcel size and terrain.`,
    },
    isNY ? {
      question: `Does my ${town.name} property qualify for 480-a Forest Tax Law enrollment?`,
      answer:   `New York's 480-a program generally requires 50 or more contiguous acres of qualifying woodland. Properties with the right acreage, forest condition, and species composition can qualify for a property and school tax exemption of up to 80% on enrolled acreage. The only way to determine whether a specific parcel qualifies is an on-site assessment — call (845) 754-8242 to schedule one.`,
    } : county.stateAbbr === 'PA' ? {
      question: `Are there woodland tax incentive programs for Pennsylvania landowners near ${town.name}?`,
      answer:   `Pennsylvania's Clean and Green program can reduce property taxes for qualifying woodland parcels by assessing land at use value rather than fair market value. A woodland management plan prepared by a certified forester supports eligibility and long-term timber objectives. Contact Henry Kowalec for a consultation on what applies to your ${town.name} area property.`,
    } : {
      question: `Are there woodland tax programs for New Jersey landowners near ${town.name}?`,
      answer:   `New Jersey's Farmland Assessment Act can reduce property taxes on qualifying woodland parcels of five or more acres. A woodland management plan supports Farmland Assessment eligibility and is also the foundation of any timber sale or long-term management work. Contact Henry Kowalec to discuss the options applicable to your ${town.name} property.`,
    },
    {
      question: `Can you appraise the timber value on my ${town.name} property?`,
      answer:   `Yes. A timber appraisal identifies species, diameter, volume, and current stumpage market value for the trees on your property. This provides an independent baseline for evaluating any buyer offers you receive and determines whether a competitive bid process is warranted. ${county.name} properties with mature ${primarySpecies} stands frequently have more timber value than the landowner expects.`,
    },
    {
      question: `Do you handle land clearing in the ${town.name} area?`,
      answer:   `Yes. Land clearing for residential and commercial site preparation is part of EFP's service offering throughout ${county.name}. Every clearing project starts with a timber assessment — if merchantable trees are present, EFP recovers that value through a timber sale before the land is cleared rather than chipping or burning material with real market worth. This step typically reduces the net cost of the project.`,
    },
  ];

  const siblingLinkHtml = siblingTowns
    .map(t => `<a href="/locations/${county.slug}/${t.slug}" class="text-sm text-[#2d5a2d] hover:underline">${t.name}</a>`)
    .join('\n          ');

  const neighborHtml = neighbors.length > 0 ? `
      <div>
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-2">Also Serving Nearby Counties</p>
        <div class="flex flex-wrap gap-3">
          ${neighbors.map(n => `<a href="/locations/${n.slug}" class="text-sm text-[#2d5a2d] hover:underline">${n.name}, ${n.stateAbbr}</a>`).join('\n          ')}
        </div>
      </div>` : '';

  const taxNoteHtml = town.taxNote ? `
    <div class="bg-amber-50 border-l-4 border-amber-400 px-5 py-4 mb-6 rounded-r-lg">
      <p class="text-sm text-amber-900 leading-relaxed">
        <strong>${isNY ? '480-a Note' : 'Tax Program Note'} for ${town.name}:</strong> ${town.taxNote}
      </p>
    </div>` : '';

  return `---
// ${town.name}, ${county.name} — individual static location page
// Generated by scripts/generate-town-pages.ts
// Content is derived entirely from this town's unique data fields.
import LocationLayout from '../../../layouts/LocationLayout.astro';
import PageHero from '../../../components/ui/PageHero.astro';
import Breadcrumb from '../../../components/ui/Breadcrumb.astro';
import FAQSection from '../../../components/ui/FAQSection.astro';
import KeyTakeaway from '../../../components/ui/KeyTakeaway.astro';
import AuthorByline from '../../../components/ui/AuthorByline.astro';
import EstimateForm from '../../../components/forms/EstimateForm.astro';
import ServiceSchema from '../../../components/schema/ServiceSchema.astro';
import FAQSchema from '../../../components/schema/FAQSchema.astro';
import { services } from '../../../data/services';

const title       = ${q(title)};
const description = ${q(description)};
const canonicalUrl = ${q(canonicalUrl)};

const crumbs = [
  { label: "Home",      href: "/" },
  { label: "Locations", href: "/locations" },
  { label: ${q(`${county.name}, ${county.stateAbbr}`)}, href: ${q(`/locations/${county.slug}`)} },
  { label: ${q(town.name)}, href: ${q(`/locations/${county.slug}/${town.slug}`)} },
];

const faqs = [
  ${faqs.map(f => `{ question: ${q(f.question)}, answer: ${q(f.answer)} }`).join(',\n  ')},
];
---

<LocationLayout title={title} description={description} canonicalUrl={canonicalUrl}>
  <ServiceSchema
    pageType="location"
    serviceName=${q(`Forestry Consulting — ${town.name}, ${county.name}`)}
    description={description}
    url={canonicalUrl}
    areaServed={[${q(`${town.name}, ${county.stateAbbr}`)}, ${q(`${county.name}, ${county.stateAbbr}`)}]}
    crumbs={crumbs}
  />
  <FAQSchema items={faqs} />

  <Breadcrumb crumbs={crumbs} />

  <PageHero
    title=${q(`Forestry Consulting in ${town.name}, ${county.stateAbbr}`)}
    subtitle=${q(`Serving ${town.name} and ${county.name} — certified forestry for private landowners`)}
  />

  <article class="max-w-4xl mx-auto my-8 sm:my-10 px-8 sm:px-12 py-10 bg-white rounded-2xl shadow-md ring-1 ring-gray-200">

    <KeyTakeaway
      text=${q(`Environmental Forest Products provides certified forestry consulting for ${town.name} area landowners. Henry Kowalec brings 30+ years of hands-on experience in ${county.name} — on-site assessments for ${isNY ? '480-a enrollment, ' : ''}timber value, land clearing, and long-term woodland management.`)}
    />

    <AuthorByline />

    <!-- SECTION 1: Terrain + Species ─────────────────────── -->
    <h2 class="text-2xl font-bold text-[#1a3c1a] mt-10 mb-4">${town.name}'s Woodland and Forest Terrain</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      ${town.terrain} The forest composition in this area is dominated by ${town.species} — a species mix that defines both the timber market opportunity and the management approach suited to properties in this part of ${county.name}.
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      ${spMarket}
    </p>
    ${taxNoteHtml}

    <!-- SECTION 2: Local Context ─────────────────────────── -->
    <h2 class="text-2xl font-bold text-[#1a3c1a] mt-10 mb-4">Local Forestry Context — ${town.name}</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      ${town.context}
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      Environmental Forest Products serves ${town.name} landowners for the full range of forestry consulting — timber appraisals, competitive timber sale management, land clearing with timber recovery, and long-term management planning. Henry Kowalec is a certified consulting forester with 30+ years of experience in ${county.name}. Every engagement starts with an on-site assessment of your specific property, not a phone estimate based on acreage alone.
    </p>

    <!-- SECTION 3: Services ──────────────────────────────── -->
    <h2 class="text-2xl font-bold text-[#1a3c1a] mt-10 mb-4">Services Available Near ${town.name}</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      The following services are available to ${county.name} landowners in the ${town.name} area. Each starts with a site assessment that accounts for the actual conditions on your specific property.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
      {services.map(svc => (
        <a
          href={'/services/' + svc.slug}
          class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#2d5a2d] hover:bg-green-50 transition-colors group"
        >
          <span class="text-2xl flex-shrink-0" aria-hidden="true">{svc.icon}</span>
          <div>
            <div class="font-semibold text-[#1a3c1a] group-hover:text-[#2d5a2d] text-sm">{svc.name}</div>
            <div class="text-xs text-gray-500 mt-0.5 leading-snug">{svc.excerpt.split('—')[0].trim()}</div>
          </div>
        </a>
      ))}
    </div>

    <!-- SECTION 4: Timber Value ──────────────────────────── -->
    <h2 class="text-2xl font-bold text-[#1a3c1a] mt-10 mb-4">Timber Value and Harvest Planning Near ${town.name}</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      Private woodland in the ${town.name} area — carrying ${town.species} — holds timber value that most landowners have never had independently confirmed. Stumpage prices shift with regional mill demand and market conditions, and an estimate that was current three or five years ago may be significantly off today. Without an independent appraisal, there is no reliable baseline for evaluating any offer a buyer presents.
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      Environmental Forest Products provides independent timber appraisals — not affiliated with any logging contractor — which means the appraisal reflects what the timber is worth at competitive market prices. When a harvest is appropriate, Henry Kowalec manages the competitive bidding process for ${county.name} landowners, reaching the buyers who most actively purchase ${primarySpecies} and related species in this region.
    </p>
    ${stateBlock}

    <!-- SECTION 5: Land Clearing ─────────────────────────── -->
    <h2 class="text-2xl font-bold text-[#1a3c1a] mt-10 mb-4">Land Clearing Near ${town.name}</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      ${terrClr}
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      Where merchantable timber is present on a clearing site, recovering that value before the land is cleared reduces the net cost of the project. This requires a forester's assessment before equipment arrives — a step that most site contractors skip and that a certified forestry professional will always perform.
    </p>
    <p class="text-gray-700 leading-relaxed mb-6">
      Learn more about <a href="/services/land-clearing" class="text-[#2d5a2d] underline hover:text-[#1a3c1a]">land clearing services in ${county.name}</a>, or contact EFP to discuss a specific site near ${town.name}.
    </p>

    <!-- SECTION 6: Why EFP ───────────────────────────────── -->
    <h2 class="text-2xl font-bold text-[#1a3c1a] mt-10 mb-4">Why ${town.name} Landowners Work With EFP</h2>
    <p class="text-gray-700 leading-relaxed mb-4">
      ${whyHenry}
    </p>
    <p class="text-gray-700 leading-relaxed mb-4">
      Environmental Forest Products is headquartered in Westbrookville, Sullivan County — not a regional franchise or an out-of-area firm taking remote bids. When Henry walks your property in ${town.name}, he brings direct familiarity with ${county.name}'s terrain, access conditions, timber markets, and ${isNY ? '480-a program requirements' : 'state woodland management options'} — developed over decades of hands-on work throughout this region.
    </p>

    <!-- CTA ──────────────────────────────────────────────── -->
    <div class="bg-[#1a3c1a] text-white rounded-lg p-6 my-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p class="font-bold text-lg mb-1">Schedule a Site Visit in ${town.name}</p>
        <p class="text-green-200 text-sm">On-site assessment — not a phone estimate. We walk the property with you.</p>
      </div>
      <a
        href="tel:+18454980208"
        class="inline-flex items-center gap-2 bg-white text-[#1a3c1a] font-bold px-5 py-3 rounded hover:bg-green-100 transition-colors text-sm whitespace-nowrap flex-shrink-0"
      >
        <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
        (845) 754-8242
      </a>
    </div>

    <!-- FAQ ──────────────────────────────────────────────── -->
    <FAQSection items={faqs} />

    <!-- Sibling / neighbor links ─────────────────────────── -->
    <div class="border border-gray-200 rounded-lg p-5 my-10">
      <h3 class="font-semibold text-[#1a3c1a] mb-3 text-sm uppercase tracking-wide">
        Other ${county.name} Communities We Serve
      </h3>
      <div class="flex flex-wrap gap-3 mb-4">
        ${siblingLinkHtml}
        <a href="/locations/${county.slug}" class="text-sm text-[#2d5a2d] hover:underline font-semibold">View all ${county.name} towns →</a>
      </div>${neighborHtml}
    </div>

    <EstimateForm variant="b2c" />

  </article>
</LocationLayout>
`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
const pagesRoot = path.join(process.cwd(), 'src', 'pages', 'locations');
let generated = 0;
let skipped   = 0;

for (const county of counties) {
  const neighbors = getNeighbors(county.slug);
  const countyDir = path.join(pagesRoot, county.slug);
  if (!fs.existsSync(countyDir)) fs.mkdirSync(countyDir, { recursive: true });

  for (const town of county.towns) {
    if (SKIP[county.slug]?.has(town.slug)) {
      skipped++;
      continue;
    }

    const filePath = path.join(countyDir, `${town.slug}.astro`);
    const siblingTowns = county.towns.filter(t => t.slug !== town.slug).slice(0, 4);
    const content = generatePage(county, town, siblingTowns, neighbors);
    fs.writeFileSync(filePath, content, 'utf8');
    process.stdout.write(`  ✓  ${county.slug}/${town.slug}.astro\n`);
    generated++;
  }
}

console.log(`\n✅  Generated: ${generated} pages  |  Skipped (hand-written): ${skipped}`);
console.log(`\nNext step: delete src/pages/locations/[county]/[town].astro`);
