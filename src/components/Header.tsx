import React from 'react';
import { 
  Building2, 
  Layers, 
  Box, 
  Columns, 
  Calculator, 
  BarChart3, 
  FileText, 
  Sun,
  Compass
} from 'lucide-react';
import { PRESET_FLOOR_PLANS } from '../data/presetProjects';

interface HeaderProps {
  currentPlanId: string;
  onSelectPlan: (id: string) => void;
  viewMode: '2d' | '3d' | 'split';
  onChangeViewMode: (mode: '2d' | '3d' | 'split') => void;
  unitSystem: 'imperial' | 'metric';
  onToggleUnit: () => void;
  onOpenCostModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenDossier: () => void;
  onToggleSunPanel: () => void;
  isSunPanelOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlanId,
  onSelectPlan,
  viewMode,
  onChangeViewMode,
  unitSystem,
  onToggleUnit,
  onOpenCostModal,
  onOpenAnalyticsModal,
  onOpenDossier,
  onToggleSunPanel,
  isSunPanelOpen
}) => {
  return (
    <header className="bg-alabaster border-b border-linen-deep px-4 py-3 sticky top-0 z-30 shadow-tactile">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Studio Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-terracotta flex items-center justify-center text-alabaster shadow-tactile-md">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-wider text-graphite">
                  ARCHON
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-linen-dark text-terracotta border border-linen-deep font-semibold">
                  Atelier v1.0
                </span>
              </div>
              <p className="text-xs font-editorial italic text-graphite-muted">
                AI Architecture Design Intelligence Studio
              </p>
            </div>
          </div>

          {/* Unit Toggle on Mobile */}
          <button
            onClick={onToggleUnit}
            className="md:hidden text-xs font-mono px-2.5 py-1 rounded border border-linen-deep bg-linen text-graphite hover:border-terracotta transition-colors"
          >
            {unitSystem === 'imperial' ? 'SQ.FT / $' : 'M² / $'}
          </button>
        </div>

        {/* Project Typology Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-mono uppercase tracking-wider text-graphite-muted hidden lg:inline-block">
            Concept:
          </span>
          <select
            value={currentPlanId}
            onChange={(e) => onSelectPlan(e.target.value)}
            className="bg-linen border border-linen-deep text-graphite text-xs font-medium rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-terracotta cursor-pointer w-full md:w-64"
          >
            {PRESET_FLOOR_PLANS.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title} ({plan.grossAreaSqFt.toLocaleString()} sq.ft)
              </option>
            ))}
            {!PRESET_FLOOR_PLANS.some(p => p.id === currentPlanId) && (
              <option value={currentPlanId}>
                Custom Synthesized Concept
              </option>
            )}
          </select>
        </div>

        {/* View Mode Switcher (2D / 3D / Split) */}
        <div className="flex items-center bg-linen-dark p-1 rounded-lg border border-linen-deep">
          <button
            onClick={() => onChangeViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === '2d' 
                ? 'bg-alabaster text-terracotta font-semibold shadow-tactile' 
                : 'text-graphite-muted hover:text-graphite'
            }`}
            title="2D Vector Blueprint Canvas"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Blueprint</span>
          </button>
          
          <button
            onClick={() => onChangeViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === '3d' 
                ? 'bg-alabaster text-terracotta font-semibold shadow-tactile' 
                : 'text-graphite-muted hover:text-graphite'
            }`}
            title="3D WebGL Architectural Visualizer"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Studio</span>
          </button>

          <button
            onClick={() => onChangeViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'split' 
                ? 'bg-alabaster text-terracotta font-semibold shadow-tactile' 
                : 'text-graphite-muted hover:text-graphite'
            }`}
            title="Side-by-Side Drafting & 3D Perspective"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
        </div>

        {/* Global Controls & Modals */}
        <div className="flex items-center gap-2">
          {/* Unit Toggle Desktop */}
          <button
            onClick={onToggleUnit}
            className="hidden md:flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-md border border-linen-deep bg-linen hover:border-terracotta text-graphite transition-colors"
            title="Toggle between Imperial (sq.ft) and Metric (m²)"
          >
            <Compass className="w-3.5 h-3.5 text-terracotta" />
            <span>{unitSystem === 'imperial' ? 'SQ.FT' : 'M²'}</span>
          </button>

          {/* Sun Study Toggle */}
          <button
            onClick={onToggleSunPanel}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all ${
              isSunPanelOpen
                ? 'bg-brass text-alabaster border-brass-dark shadow-tactile'
                : 'bg-linen border-linen-deep text-graphite hover:border-brass'
            }`}
            title="Sun-Path & Solar Shadows Simulation"
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Sun Study</span>
          </button>

          {/* Space Analytics */}
          <button
            onClick={onOpenAnalyticsModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-linen border border-linen-deep text-graphite hover:border-terracotta hover:text-terracotta transition-colors"
            title="Space Utilization & Circulation Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden lg:inline">Space Analytics</span>
          </button>

          {/* Cost Estimator */}
          <button
            onClick={onOpenCostModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-linen border border-linen-deep text-graphite hover:border-terracotta hover:text-terracotta transition-colors"
            title="Adjustable Cost Estimation Engine"
          >
            <Calculator className="w-3.5 h-3.5 text-terracotta" />
            <span>Cost Model</span>
          </button>

          {/* Export Dossier */}
          <button
            onClick={onOpenDossier}
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-terracotta text-alabaster hover:bg-terracotta-hover transition-colors shadow-tactile font-semibold"
            title="Export Architectural Dossier & Client Spec"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dossier</span>
          </button>
        </div>

      </div>
    </header>
  );
};
