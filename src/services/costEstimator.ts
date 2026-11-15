import { FloorPlan, CostAssumptions, CostEstimateResult, ActiveMaterialSelection } from '../types/architecture';
import { ARCHITECTURAL_MATERIALS } from '../data/presetProjects';

export function calculateCostEstimate(
  plan: FloorPlan,
  assumptions: CostAssumptions,
  materials?: ActiveMaterialSelection
): CostEstimateResult {
  // Base high-craft architectural construction rate ($ / sq.m)
  const baseRatePerSqM = 2450;

  // 1. Structural system multiplier
  let structMult = 1.0;
  if (assumptions.structuralSystem === 'mass_timber') structMult = 1.14;
  else if (assumptions.structuralSystem === 'hybrid_steel') structMult = 1.08;
  else if (assumptions.structuralSystem === 'concrete_frame') structMult = 1.00;

  // 2. Finish tier multiplier
  let finishMult = 1.0;
  if (assumptions.finishTier === 'standard') finishMult = 1.00;
  else if (assumptions.finishTier === 'executive') finishMult = 1.35;
  else if (assumptions.finishTier === 'haute_bespoke') finishMult = 1.75;

  // 3. Topography multiplier
  let topoMult = 1.0;
  if (assumptions.siteTopography === 'flat') topoMult = 1.00;
  else if (assumptions.siteTopography === 'sloped') topoMult = 1.09;
  else if (assumptions.siteTopography === 'complex_hillside') topoMult = 1.22;

  // 4. Sustainability standard multiplier
  let sustainMult = 1.0;
  if (assumptions.sustainabilityStandard === 'code_minimum') sustainMult = 1.00;
  else if (assumptions.sustainabilityStandard === 'leed_gold') sustainMult = 1.07;
  else if (assumptions.sustainabilityStandard === 'passive_house') sustainMult = 1.16;

  // 5. Material selection adjustment
  let materialMult = 1.0;
  if (materials) {
    const facadeMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.facade);
    const floorMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.flooring);
    const mullionMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.mullions);
    const roofMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.roof);

    const fCost = facadeMat ? facadeMat.costMultiplier : 1.0;
    const flCost = floorMat ? floorMat.costMultiplier : 1.0;
    const mCost = mullionMat ? mullionMat.costMultiplier : 1.0;
    const rCost = roofMat ? roofMat.costMultiplier : 1.0;

    // Weighted material influence (facade 40%, flooring 25%, mullions 20%, roof 15%)
    materialMult = (fCost * 0.40) + (flCost * 0.25) + (mCost * 0.20) + (rCost * 0.15);
  }

  // Adjusted unit cost per sq.m before MEP, margin, and contingency
  const directBuildingRate = baseRatePerSqM * structMult * finishMult * topoMult * sustainMult * materialMult * assumptions.regionalCostIndex * assumptions.laborMultiplier;

  const grossArea = plan.grossAreaSqM;
  const directBuildTotal = directBuildingRate * grossArea;

  // Dedicated MEP / HVAC component
  const mepTotal = assumptions.mepHvacAllowancePerSqM * grossArea * assumptions.regionalCostIndex;

  // Subtotal before soft costs & contingency
  const subtotalConstruction = directBuildTotal + mepTotal;

  // Contractor margin & overhead
  const contractorFee = subtotalConstruction * (assumptions.contractorMarginPercent / 100);

  // Contingency buffer
  const contingencyBuffer = subtotalConstruction * (assumptions.contingencyPercent / 100);

  // Total project cost USD
  const totalCostUSD = Math.round(subtotalConstruction + contractorFee + contingencyBuffer);
  const costPerSqM = Math.round(totalCostUSD / grossArea);
  const costPerSqFt = Math.round(totalCostUSD / (grossArea * 10.7639));

  // Itemized breakdown
  const substructure = Math.round(subtotalConstruction * 0.12 * topoMult);
  const superstructure = Math.round(subtotalConstruction * 0.23 * structMult);
  const envelope = Math.round(subtotalConstruction * 0.24 * materialMult);
  const interiorFinishes = Math.round(subtotalConstruction * 0.21 * finishMult);
  const mepHvac = Math.round(mepTotal);
  const generalRequirements = Math.round(contractorFee);
  const contingency = Math.round(contingencyBuffer);

  const calculatedSum = substructure + superstructure + envelope + interiorFinishes + mepHvac + generalRequirements + contingency;

  const breakdown = [
    {
      category: 'Substructure & Foundation',
      amountUSD: substructure,
      percentageOfTotal: Math.round((substructure / calculatedSum) * 100),
      description: `Engineered grade beams, stepped footings, and seismic tie-backs (${assumptions.siteTopography} site conditions).`
    },
    {
      category: 'Superstructure & Frame',
      amountUSD: superstructure,
      percentageOfTotal: Math.round((superstructure / calculatedSum) * 100),
      description: `${assumptions.structuralSystem.replace('_', ' ').toUpperCase()} primary structural portal frames, cantilevers, and load-bearing timber/concrete.`
    },
    {
      category: 'High-Performance Envelope & Glazing',
      amountUSD: envelope,
      percentageOfTotal: Math.round((envelope / calculatedSum) * 100),
      description: `Curtain-wall fenestration, rainscreen facade assemblies, weatherproofing membranes, and standing-seam roof.`
    },
    {
      category: 'Interior Finishes & Architectural Joinery',
      amountUSD: interiorFinishes,
      percentageOfTotal: Math.round((interiorFinishes / calculatedSum) * 100),
      description: `Artisanal millwork, architectural plaster, acoustic ceilings, and ${assumptions.finishTier} finish package.`
    },
    {
      category: 'MEP, Radiant & Climate Systems',
      amountUSD: mepHvac,
      percentageOfTotal: Math.round((mepHvac / calculatedSum) * 100),
      description: `Concealed VRF heat pumps, hydronic radiant flooring, ERV ventilation, and integrated architectural low-voltage lighting.`
    },
    {
      category: 'General Contractor Fee & Site Preliminaries',
      amountUSD: generalRequirements,
      percentageOfTotal: Math.round((generalRequirements / calculatedSum) * 100),
      description: `Project superintendence, cranes, scaffolding, insurance, and contractor margin (${assumptions.contractorMarginPercent}%).`
    },
    {
      category: 'Owner Contingency & Risk Reserve',
      amountUSD: contingency,
      percentageOfTotal: Math.round((contingency / calculatedSum) * 100),
      description: `Unforeseen geotechnical and procurement escalation buffer (${assumptions.contingencyPercent}%).`
    }
  ];

  return {
    totalCostUSD,
    costPerSqFt,
    costPerSqM,
    breakdown,
    assumptionsUsed: assumptions,
    baseRatePerSqM
  };
}