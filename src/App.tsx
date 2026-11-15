import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptEngine } from './components/PromptEngine';
import { ViewportContainer } from './components/ViewportContainer';
import { MaterialPalette } from './components/MaterialPalette';
import { SpaceAnalytics } from './components/SpaceAnalytics';
import { CostEstimatorModal } from './components/CostEstimatorModal';
import { ExportDossier } from './components/ExportDossier';
import { PRESET_FLOOR_PLANS, DEFAULT_COST_ASSUMPTIONS } from './data/presetProjects';
import { 
  FloorPlan, 
  ActiveMaterialSelection, 
  CostAssumptions, 
  SunState 
} from './types/architecture';
import { Palette, BarChart3 } from 'lucide-react';

export const App: React.FC = () => {
  // Core Floor Plan State
  const [currentPlan, setCurrentPlan] = useState<FloorPlan>(PRESET_FLOOR_PLANS[0]);
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'split'>('split');
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Material Selection State
  const [materials, setMaterials] = useState<ActiveMaterialSelection>({
    facade: 'facade_terracotta',
    flooring: 'floor_oak_herringbone',
    mullions: 'mullion_bronze',
    roof: 'roof_zinc',
    wallAccent: 'facade_lime_plaster'
  });

  // Cost Assumptions State
  const [assumptions, setAssumptions] = useState<CostAssumptions>(DEFAULT_COST_ASSUMPTIONS);

  // Dynamic Sun & Solar Shadows State
  const [sunState, setSunState] = useState<SunState>({
    timeOfDayHours: 14.5, // 2:30 PM afternoon sun
    season: 'summer_solstice',
    latitudeDeg: 34,
    altitudeDeg: 58,
    azimuthDeg: 215,
    lightIntensity: 1.4,
    colorTemperatureK: 5200,
    shadowSharpness: 0.8
  });

  // UI Modal States
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isSunPanelOpen, setIsSunPanelOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'materials' | 'analytics' | 'collapsed'>('materials');

  const handleSelectPlanById = (id: string) => {
    const found = PRESET_FLOOR_PLANS.find(p => p.id === id);
    if (found) {
      setCurrentPlan(found);
      setSelectedRoomId(null);
    }
  };

  const handlePlanGenerated = (newPlan: FloorPlan) => {
    setCurrentPlan(newPlan);
    setSelectedRoomId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linen text-graphite font-sans">
      
      {/* Atelier Brand Header */}
      <Header
        currentPlanId={currentPlan.id}
        onSelectPlan={handleSelectPlanById}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        unitSystem={unitSystem}
        onToggleUnit={() => setUnitSystem(u => u === 'imperial' ? 'metric' : 'imperial')}
        onOpenCostModal={() => setIsCostModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onToggleSunPanel={() => setIsSunPanelOpen(!isSunPanelOpen)}
        isSunPanelOpen={isSunPanelOpen}
      />

      {/* AI Architectural Requirement Prompt Engine */}
      <PromptEngine
        onPlanGenerated={handlePlanGenerated}
        unitSystem={unitSystem}
      />

      {/* Main Interactive Architectural Viewport */}
      <main className="flex-1 flex flex-col">
        <ViewportContainer
          plan={currentPlan}
          viewMode={viewMode}
          materials={materials}
          onChangeMaterials={setMaterials}
          sunState={sunState}
          onChangeSunState={setSunState}
          isSunPanelOpen={isSunPanelOpen}
          onCloseSunPanel={() => setIsSunPanelOpen(false)}
          unitSystem={unitSystem}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
        />

        {/* Lower Atelier Workspace Tabs (Materials & Space Analytics) */}
        <section className="px-4 py-3 max-w-7xl mx-auto w-full space-y-3">
          
          {/* Tab Selector Bar */}
          <div className="flex items-center justify-between border-b border-linen-deep pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'materials' ? 'collapsed' : 'materials')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeBottomTab === 'materials'
                    ? 'bg-terracotta text-alabaster shadow-tactile'
                    : 'bg-alabaster border border-linen-deep text-graphite hover:border-terracotta'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Tactile Material Customizer</span>
              </button>

              <button
                onClick={() => setActiveBottomTab(activeBottomTab === 'analytics' ? 'collapsed' : 'analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeBottomTab === 'analytics'
                    ? 'bg-terracotta text-alabaster shadow-tactile'
                    : 'bg-alabaster border border-linen-deep text-graphite hover:border-terracotta'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Space Utilization Analytics</span>
              </button>
            </div>

            <span className="text-xs font-mono text-graphite-muted hidden md:inline">
              ARCHON COMPUTATIONAL STUDIO · {currentPlan.grossAreaSqFt.toLocaleString()} SQ.FT · {currentPlan.typology.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          {/* Active Tab Panel */}
          {activeBottomTab === 'materials' && (
            <div className="animate-in fade-in duration-150">
              <MaterialPalette
                materials={materials}
                onChangeMaterials={setMaterials}
              />
            </div>
          )}

          {activeBottomTab === 'analytics' && (
            <div className="animate-in fade-in duration-150">
              <SpaceAnalytics
                plan={currentPlan}
                unitSystem={unitSystem}
                onClose={() => setActiveBottomTab('collapsed')}
              />
            </div>
          )}

        </section>
      </main>

      {/* Atelier Footer */}
      <footer className="bg-alabaster border-t border-linen-deep py-3 px-4 mt-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-graphite-muted">
          <div className="flex items-center gap-2">
            <span className="font-bold text-graphite">ARCHON</span>
            <span>·</span>
            <span>AI Architecture Design Intelligence Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Palette: Terracotta & Linen</span>
            <span>Three.js PBR WebGL</span>
            <span>1:100 Metric Precision</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isCostModalOpen && (
        <CostEstimatorModal
          plan={currentPlan}
          assumptions={assumptions}
          onChangeAssumptions={setAssumptions}
          materials={materials}
          unitSystem={unitSystem}
          onClose={() => setIsCostModalOpen(false)}
        />
      )}

      {isAnalyticsModalOpen && (
        <div className="fixed inset-0 z-50 bg-graphite/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full">
            <SpaceAnalytics
              plan={currentPlan}
              unitSystem={unitSystem}
              onClose={() => setIsAnalyticsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isDossierOpen && (
        <ExportDossier
          plan={currentPlan}
          materials={materials}
          assumptions={assumptions}
          unitSystem={unitSystem}
          onClose={() => setIsDossierOpen(false)}
        />
      )}

    </div>
  );
};