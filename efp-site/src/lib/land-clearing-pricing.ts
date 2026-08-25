// land-clearing-pricing.ts
//
// SINGLE SOURCE OF TRUTH for land clearing pricing.
//
// Consumed by:
//   - src/pages/services/land-clearing/land-clearing-cost-calculator.astro
//       (full 4-input calculator, including disposal method)
//   - src/components/ui/LandClearingCalculator.astro
//       (homepage quick calculator, 3 inputs + timber question)
//
// ⚠️ These are the Sullivan / Orange / Ulster County, NY ranges dated April 2026,
// lifted verbatim from the original calculator. Do not edit the numbers without
// client confirmation — they are published pricing claims.

export type VegType     = 'brush' | 'mixed' | 'woodland' | 'heavy';
export type TerrainType = 'flat' | 'rolling' | 'steep';
export type Disposal    = 'chip' | 'pile' | 'haul';

/** Base cost per acre [low, high] by vegetation type. */
export const BASE_COST: Record<VegType, [number, number]> = {
  brush:    [1500,  3000],
  mixed:    [2800,  5500],
  woodland: [4500,  8500],
  heavy:    [7000, 14000],
};

/** Terrain multipliers [low, high]. */
export const TERRAIN_MULT: Record<TerrainType, [number, number]> = {
  flat:    [1.00, 1.00],
  rolling: [1.15, 1.25],
  steep:   [1.35, 1.55],
};

/** Disposal add-on per acre [low, high]. */
export const DISPOSAL_ADDER: Record<Disposal, [number, number]> = {
  chip: [0,    0],
  pile: [200,  500],
  haul: [600, 1400],
};

/** Vegetation types where merchantable timber is likely to be present. */
export const TIMBER_VEG: VegType[] = ['woodland', 'heavy'];

/**
 * The full calculator states that on wooded lots with quality hardwoods the
 * timber credit "can reduce your net clearing cost by 20–80%". That published
 * range is the ONLY timber figure anywhere in the repo, so the homepage
 * net-after-timber numbers are derived from it rather than invented.
 */
export const TIMBER_CREDIT_PCT: [number, number] = [0.20, 0.80];

export const VEG_LABELS: Record<VegType, string> = {
  brush:    'light brush & scrub',
  mixed:    'mixed growth',
  woodland: 'established woodland',
  heavy:    'heavy timber',
};

export const TERRAIN_LABELS: Record<TerrainType, string> = {
  flat:    'flat / gentle slope',
  rolling: 'rolling terrain',
  steep:   'steep / rocky',
};

export const DISPOSAL_LABELS: Record<Disposal, string> = {
  chip: 'chip & spread on-site',
  pile: 'pile & burn on-site',
  haul: 'haul debris off-site',
};

export interface EstimateInput {
  acres: number;
  vegType: VegType;
  terrain: TerrainType;
  /** The homepage calculator does not ask about disposal and passes 'chip',
   *  the zero-adder base case, so its figure stays conservative. */
  disposal: Disposal;
}

export interface EstimateResult {
  perAcreLow: number;
  perAcreHigh: number;
  totalLow: number;
  totalHigh: number;
  midpoint: number;
  showTimberCredit: boolean;
}

export function estimate({ acres, vegType, terrain, disposal }: EstimateInput): EstimateResult {
  const [baseLow, baseHigh] = BASE_COST[vegType];
  const [multLow, multHigh] = TERRAIN_MULT[terrain];
  const [dispLow, dispHigh] = DISPOSAL_ADDER[disposal];

  const perAcreLow  = baseLow  * multLow  + dispLow;
  const perAcreHigh = baseHigh * multHigh + dispHigh;

  const totalLow  = acres * perAcreLow;
  const totalHigh = acres * perAcreHigh;

  return {
    perAcreLow,
    perAcreHigh,
    totalLow,
    totalHigh,
    midpoint: (totalLow + totalHigh) / 2,
    showTimberCredit: TIMBER_VEG.indexOf(vegType) !== -1,
  };
}

export interface TimberOffset {
  /** Credit range, anchored on the midpoint estimate. */
  creditLow: number;
  creditHigh: number;
  /** Lowest plausible net cost — midpoint less the top of the credit band. */
  netFloor: number;
}

/**
 * Derived from TIMBER_CREDIT_PCT — see the note on that constant.
 *
 * Both figures are anchored on the MIDPOINT estimate, not on the low/high
 * bounds. Anchoring the credit on the low bound and the net on the high bound
 * makes the two ranges numerically identical (1 − 0.80 === 0.20), which reads
 * as a bug even though it is correct. The net is therefore reported as a single
 * floor rather than a mirrored range.
 */
export function timberOffset(midpoint: number): TimberOffset {
  const [pctLow, pctHigh] = TIMBER_CREDIT_PCT;
  return {
    creditLow:  midpoint * pctLow,
    creditHigh: midpoint * pctHigh,
    netFloor:   midpoint * (1 - pctHigh),
  };
}

export function fmt(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US');
}
