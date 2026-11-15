import React from 'react';
import { 
  Calculator, 
  X, 
  Sliders 
} from 'lucide-react';
import { 
  FloorPlan, 
  CostAssumptions, 
  ActiveMaterialSelection, 
  StructuralSystem, 
  FinishTier, 
  SiteTopography, 
  SustainabilityStandard 
} from '../types/architecture';
import { calculateCostEstimate } from '../services/costEstimator';

interface CostEstimatorModalProps {
  plan: FloorPlan;
  assumptions: CostAssumptions;
  onChangeAssumptions: (newAssumptions: CostAssumptions) => void;
  materials: ActiveMaterialSelection;
  unitSystem: 'imperial' | 'metric';
  onClose: () => void;
}

export const CostEstimatorModal: React.FC<CostEstimatorModalProps> = ({
  plan,
  assumptions,
  onChangeAssumptions,
  materials,
  unitSystem,
  onClose
}) => {
  const estimate = calculateCostEstimate(plan, assumptions, materials);

  const updateField = <K extends keyof CostAssumptions>(key: K, value: CostAssumptions[K]) => {
    onChangeAssumptions({
      ...assumptions,
      [key]: value
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-graphite/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-alabaster border border-linen-deep rounded-xl shadow-tactile-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-linen-deep flex items-center justify-between bg-alabaster sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-terracotta/10 border border-terracotta/20 flex items-center justify-center text-terracotta">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-graphite tracking-wide">
                PARAMETRIC COST ESTIMATION & FINANCIAL MODEL
              </h3>
              <p className="text-xs font-editorial italic text-graphite-muted">
                Adjustable architectural structural, material, regional, and contingency parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-linen-deep hover:bg-linen text-graphite transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Total Estimated Cost */}
            <div className="p-4 rounded-xl bg-terracotta text-alabaster shadow-tactile">
              <span className="text-[11px] font-mono uppercase tracking-wider text-alabaster/80 block mb-1">
                Total Estimated Construction
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold">
                ${estimate.totalCostUSD.toLocaleString()}
              </div>
              <span className="text-xs text-alabaster/80 mt-1 block">
                Includes MEP, contractor margin & {assumptions.contingencyPercent}% contingency
              </span>
            </div>

            {/* Cost Per Unit Area */}
            <div className="p-4 rounded-xl bg-linen border border-linen-deep">
              <span className="text-[11px] font-mono uppercase tracking-wider text-graphite-muted block mb-1">
                Unit Construction Rate
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-graphite">
                {unitSystem === 'imperial'
                  ? `$${estimate.costPerSqFt.toLocaleString()}`
                  : `$${estimate.costPerSqM.toLocaleString()}`}
                <span className="text-sm font-normal text-graphite-muted ml-1">
                  {unitSystem === 'imperial' ? '/ sq.ft' : '/ m²'}
                </span>
              </div>
              <span className="text-xs text-graphite-muted mt-1 block">
                GIA: {unitSystem === 'imperial' ? `${plan.grossAreaSqFt.toLocaleString()} sq.ft` : `${plan.grossAreaSqM} m²`}
              </span>
            </div>

            {/* Material & Quality Tier */}
            <div className="p-4 rounded-xl bg-linen border border-linen-deep">
              <span className="text-[11px] font-mono uppercase tracking-wider text-graphite-muted block mb-1">
                Specification Baseline
              </span>
              <div className="text-lg font-display font-bold text-terracotta capitalize">
                {assumptions.finishTier.replace('_', ' ')}
              </div>
              <span className="text-xs text-graphite-muted mt-1 block">
                Structure: {assumptions.structuralSystem.replace('_', ' ').toUpperCase()} · {assumptions.sustainabilityStandard.replace('_', ' ').toUpperCase()}
              </span>
            </div>

          </div>

          {/* Interactive Assumption Controls Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-linen-deep pb-2">
              <Sliders className="w-4 h-4 text-terracotta" />
              <h4 className="font-display font-bold text-sm text-graphite uppercase tracking-wide">
                Adjustable Architectural Assumptions
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Structural System */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-graphite block">
                  Structural System
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['mass_timber', 'hybrid_steel', 'concrete_frame'] as StructuralSystem[]).map((sys) => (
                    <button
                      key={sys}
                      onClick={() => updateField('structuralSystem', sys)}
                      className={`py-2 px-2 rounded text-xs font-medium border text-center transition-all ${
                        assumptions.structuralSystem === sys
                          ? 'bg-alabaster border-terracotta text-terracotta font-semibold shadow-sm'
                          : 'bg-linen border-linen-deep text-graphite hover:border-linen-dark'
                      }`}
                    >
                      {sys === 'mass_timber' ? 'Mass Timber (+14%)' : sys === 'hybrid_steel' ? 'Hybrid Steel (+8%)' : 'Concrete (Base)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Finish & Material Tier */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-graphite block">
                  Artisanal Finish Tier
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['standard', 'executive', 'haute_bespoke'] as FinishTier[]).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => updateField('finishTier', tier)}
                      className={`py-2 px-2 rounded text-xs font-medium border text-center transition-all ${
                        assumptions.finishTier === tier
                          ? 'bg-alabaster border-terracotta text-terracotta font-semibold shadow-sm'
                          : 'bg-linen border-linen-deep text-graphite hover:border-linen-dark'
                      }`}
                    >
                      {tier === 'standard' ? 'Standard' : tier === 'executive' ? 'Executive (1.35×)' : 'Haute Bespoke (1.75×)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Site Topography */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-graphite block">
                  Site Topography & Grade
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['flat', 'sloped', 'complex_hillside'] as SiteTopography[]).map((topo) => (
                    <button
                      key={topo}
                      onClick={() => updateField('siteTopography', topo)}
                      className={`py-2 px-2 rounded text-xs font-medium border text-center transition-all ${
                        assumptions.siteTopography === topo
                          ? 'bg-alabaster border-terracotta text-terracotta font-semibold shadow-sm'
                          : 'bg-linen border-linen-deep text-graphite hover:border-linen-dark'
                      }`}
                    >
                      {topo === 'flat' ? 'Flat Grade' : topo === 'sloped' ? 'Sloped (+9%)' : 'Hillside (+22%)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Sustainability Standard */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-graphite block">
                  Sustainability Target
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['code_minimum', 'leed_gold', 'passive_house'] as SustainabilityStandard[]).map((sus) => (
                    <button
                      key={sus}
                      onClick={() => updateField('sustainabilityStandard', sus)}
                      className={`py-2 px-2 rounded text-xs font-medium border text-center transition-all ${
                        assumptions.sustainabilityStandard === sus
                          ? 'bg-alabaster border-terracotta text-terracotta font-semibold shadow-sm'
                          : 'bg-linen border-linen-deep text-graphite hover:border-linen-dark'
                      }`}
                    >
                      {sus === 'code_minimum' ? 'Code Baseline' : sus === 'leed_gold' ? 'LEED Gold (+7%)' : 'Passive House (+16%)'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Slider Assumptions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Regional Cost Index */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-graphite font-bold">Regional Index</span>
                  <span className="text-xs font-mono font-bold text-terracotta">{assumptions.regionalCostIndex.toFixed(2)}×</span>
                </div>
                <input
                  type="range"
                  min={0.85}
                  max={1.50}
                  step={0.05}
                  value={assumptions.regionalCostIndex}
                  onChange={(e) => updateField('regionalCostIndex', parseFloat(e.target.value))}
                  className="w-full cursor-pointer h-1.5 bg-linen-dark rounded-lg appearance-none"
                />
                <span className="text-[10px] text-graphite-muted block">0.85 (Low cost) to 1.50 (High-metro / island)</span>
              </div>

              {/* Contingency Buffer */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-graphite font-bold">Risk Contingency</span>
                  <span className="text-xs font-mono font-bold text-terracotta">{assumptions.contingencyPercent}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  step={1}
                  value={assumptions.contingencyPercent}
                  onChange={(e) => updateField('contingencyPercent', parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer h-1.5 bg-linen-dark rounded-lg appearance-none"
                />
                <span className="text-[10px] text-graphite-muted block">5% (Tight) to 20% (Conservative reserve)</span>
              </div>

              {/* MEP & HVAC Allowance */}
              <div className="p-3.5 rounded-lg bg-linen border border-linen-deep space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-graphite font-bold">MEP / HVAC Rate</span>
                  <span className="text-xs font-mono font-bold text-terracotta">${assumptions.mepHvacAllowancePerSqM}/m²</span>
                </div>
                <input
                  type="range"
                  min={250}
                  max={650}
                  step={25}
                  value={assumptions.mepHvacAllowancePerSqM}
                  onChange={(e) => updateField('mepHvacAllowancePerSqM', parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer h-1.5 bg-linen-dark rounded-lg appearance-none"
                />
                <span className="text-[10px] text-graphite-muted block">Radiant heating, VRF, ERV & solar microinverters</span>
              </div>

            </div>
          </div>

          {/* Itemized Cost Breakdown Schedule */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-linen-deep pb-2">
              <h4 className="font-display font-bold text-sm text-graphite uppercase tracking-wide">
                Itemized Construction Schedule
              </h4>
              <span className="text-xs font-mono text-graphite-muted">
                7 Trade Packages
              </span>
            </div>

            <div className="border border-linen-deep rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-linen-dark text-graphite-muted font-mono uppercase text-[11px] border-b border-linen-deep">
                  <tr>
                    <th className="py-2.5 px-4">Trade Category & Description</th>
                    <th className="py-2.5 px-3 text-right">Share (%)</th>
                    <th className="py-2.5 px-4 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen-deep">
                  {estimate.breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-linen/60 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="font-semibold text-graphite block">{item.category}</span>
                        <span className="text-[11px] text-graphite-muted">{item.description}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-graphite font-medium">
                        {item.percentageOfTotal}%
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-graphite">
                        ${item.amountUSD.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-linen font-bold text-sm border-t-2 border-linen-deep">
                    <td className="py-3 px-4 text-graphite font-display">
                      TOTAL ALLOCATED BUDGET
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-graphite">
                      100%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-terracotta text-base">
                      ${estimate.totalCostUSD.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-linen-deep bg-linen flex items-center justify-between sticky bottom-0">
          <span className="text-xs font-editorial italic text-graphite-muted">
            Parametric estimations calibrated against RSMeans & luxury custom residential cost indices.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-terracotta hover:bg-terracotta-hover text-alabaster rounded-lg text-xs font-semibold tracking-wide transition-colors shadow-tactile"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
