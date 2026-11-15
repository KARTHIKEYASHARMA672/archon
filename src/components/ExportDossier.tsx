import React from 'react';
import { 
  Printer, 
  X, 
  Building2 
} from 'lucide-react';
import { FloorPlan, ActiveMaterialSelection, CostAssumptions } from '../types/architecture';
import { ARCHITECTURAL_MATERIALS } from '../data/presetProjects';
import { calculateCostEstimate } from '../services/costEstimator';
import { calculateSpaceAnalytics } from '../services/analyticsEngine';

interface ExportDossierProps {
  plan: FloorPlan;
  materials: ActiveMaterialSelection;
  assumptions: CostAssumptions;
  unitSystem: 'imperial' | 'metric';
  onClose: () => void;
}

export const ExportDossier: React.FC<ExportDossierProps> = ({
  plan,
  materials,
  assumptions,
  unitSystem,
  onClose
}) => {
  const estimate = calculateCostEstimate(plan, assumptions, materials);
  const analytics = calculateSpaceAnalytics(plan);

  const facadeMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.facade);
  const floorMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.flooring);
  const mullionMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.mullions);
  const roofMat = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.roof);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-graphite/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-alabaster border border-linen-deep rounded-xl shadow-tactile-lg max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-linen-deep flex items-center justify-between bg-alabaster sticky top-0 z-10 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-terracotta text-alabaster flex items-center justify-center shadow-tactile">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-graphite tracking-wide">
                ARCHITECTURAL SPECIFICATION DOSSIER
              </h3>
              <p className="text-xs font-editorial italic text-graphite-muted">
                Executive Design Package & Construction Schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-alabaster text-xs font-semibold tracking-wide transition-colors shadow-tactile"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-linen-deep hover:bg-linen text-graphite transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div className="p-8 overflow-y-auto space-y-8 bg-[#FFFAF4]" id="architectural-dossier-print-content">
          
          {/* Dossier Header Title Block */}
          <div className="border-b-2 border-graphite pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-terracotta font-bold">
                ARCHON ATELIER · CONCEPT DOSSIER
              </span>
              <span className="font-mono text-xs text-graphite-muted">
                DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl text-graphite tracking-wide">
              {plan.title}
            </h1>
            <p className="text-base font-editorial italic text-graphite-muted">
              {plan.tagline}
            </p>
            <p className="text-xs text-graphite leading-relaxed pt-1">
              {plan.description}
            </p>
          </div>

          {/* Project Metadata Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-linen border border-linen-deep">
            <div>
              <span className="text-[10px] font-mono uppercase text-graphite-muted block">Gross Internal Area</span>
              <span className="font-mono text-base font-bold text-graphite">
                {unitSystem === 'imperial' ? `${plan.grossAreaSqFt.toLocaleString()} sq.ft` : `${plan.grossAreaSqM} m²`}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-graphite-muted block">Program Efficiency</span>
              <span className="font-mono text-base font-bold text-emerald-800">
                {Math.round(analytics.efficiencyRatio * 100)}% (Net: {analytics.netUsableAreaSqM} m²)
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-graphite-muted block">Estimated Investment</span>
              <span className="font-mono text-base font-bold text-terracotta">
                ${estimate.totalCostUSD.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-graphite-muted block">Unit Investment Rate</span>
              <span className="font-mono text-base font-bold text-graphite">
                {unitSystem === 'imperial' ? `$${estimate.costPerSqFt}/sq.ft` : `$${estimate.costPerSqM}/m²`}
              </span>
            </div>
          </div>

          {/* Material Assembly Specifications */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-graphite uppercase tracking-wider border-b border-linen-deep pb-1.5">
              1. Tactile Material Assemblies
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-linen border border-linen-deep space-y-1">
                <span className="font-mono text-[10px] uppercase text-graphite-muted block font-bold">
                  Exterior Facade Cladding
                </span>
                <span className="font-display font-semibold text-graphite text-sm block">
                  {facadeMat?.name}
                </span>
                <p className="text-[11px] text-graphite-muted">
                  {facadeMat?.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-linen border border-linen-deep space-y-1">
                <span className="font-mono text-[10px] uppercase text-graphite-muted block font-bold">
                  Interior Flooring & Slabs
                </span>
                <span className="font-display font-semibold text-graphite text-sm block">
                  {floorMat?.name}
                </span>
                <p className="text-[11px] text-graphite-muted">
                  {floorMat?.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-linen border border-linen-deep space-y-1">
                <span className="font-mono text-[10px] uppercase text-graphite-muted block font-bold">
                  Fenestration & Mullions
                </span>
                <span className="font-display font-semibold text-graphite text-sm block">
                  {mullionMat?.name}
                </span>
                <p className="text-[11px] text-graphite-muted">
                  {mullionMat?.description}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-linen border border-linen-deep space-y-1">
                <span className="font-mono text-[10px] uppercase text-graphite-muted block font-bold">
                  Roof Structure & Overhangs
                </span>
                <span className="font-display font-semibold text-graphite text-sm block">
                  {roofMat?.name}
                </span>
                <p className="text-[11px] text-graphite-muted">
                  {roofMat?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Room Schedule Table */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-graphite uppercase tracking-wider border-b border-linen-deep pb-1.5">
              2. Programmatic Room Schedule
            </h3>

            <div className="border border-linen-deep rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-linen-dark font-mono uppercase text-[10px] text-graphite-muted border-b border-linen-deep">
                  <tr>
                    <th className="py-2 px-3">Room Name</th>
                    <th className="py-2 px-3">Zone</th>
                    <th className="py-2 px-3">Dimensions</th>
                    <th className="py-2 px-3 text-right">Area</th>
                    <th className="py-2 px-3">Daylight Exposure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen-deep">
                  {plan.rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-linen/40">
                      <td className="py-2 px-3 font-semibold text-graphite">{room.name}</td>
                      <td className="py-2 px-3 font-mono text-[11px] capitalize text-graphite-muted">{room.zone}</td>
                      <td className="py-2 px-3 font-mono text-graphite">{room.width}m × {room.length}m</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-graphite">
                        {unitSystem === 'imperial'
                          ? `${Math.round(room.width * room.length * 10.7639)} sq.ft`
                          : `${Math.round(room.width * room.length * 10) / 10} m²`}
                      </td>
                      <td className="py-2 px-3 capitalize font-mono text-graphite-muted">{room.daylightExposure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Construction Cost Breakdown Schedule */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-graphite uppercase tracking-wider border-b border-linen-deep pb-1.5">
              3. Parametric Investment Breakdown
            </h3>

            <div className="border border-linen-deep rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-linen-dark font-mono uppercase text-[10px] text-graphite-muted border-b border-linen-deep">
                  <tr>
                    <th className="py-2 px-3">Trade Scope</th>
                    <th className="py-2 px-3 text-right">Share (%)</th>
                    <th className="py-2 px-3 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen-deep">
                  {estimate.breakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium text-graphite">{item.category}</td>
                      <td className="py-2 px-3 text-right font-mono text-graphite-muted">{item.percentageOfTotal}%</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-graphite">${item.amountUSD.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-linen font-bold text-sm border-t-2 border-linen-deep">
                    <td className="py-2.5 px-3 font-display text-graphite">TOTAL ESTIMATED BUDGET</td>
                    <td className="py-2.5 px-3 text-right font-mono text-graphite">100%</td>
                    <td className="py-2.5 px-3 text-right font-mono text-terracotta">${estimate.totalCostUSD.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signoff / Seal Block */}
          <div className="pt-6 border-t-2 border-linen-deep flex items-end justify-between text-xs text-graphite-muted font-mono">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-graphite font-bold">
                ARCHON DESIGN INTELLIGENCE ATELIER
              </span>
              <span>VERIFIED COMPUTATIONAL ARCHITECTURE RECORD</span>
            </div>
            <div className="text-right">
              <div className="w-40 border-b border-graphite mb-1" />
              <span className="text-[10px] uppercase">Principal Architect Stamp / Date</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
