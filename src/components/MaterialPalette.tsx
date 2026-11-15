import React from 'react';
import { Palette, Check } from 'lucide-react';
import { ActiveMaterialSelection, MaterialOption } from '../types/architecture';
import { ARCHITECTURAL_MATERIALS } from '../data/presetProjects';

interface MaterialPaletteProps {
  materials: ActiveMaterialSelection;
  onChangeMaterials: (materials: ActiveMaterialSelection) => void;
}

export const MaterialPalette: React.FC<MaterialPaletteProps> = ({
  materials,
  onChangeMaterials
}) => {
  const facades = ARCHITECTURAL_MATERIALS.filter(m => m.category === 'facade');
  const floorings = ARCHITECTURAL_MATERIALS.filter(m => m.category === 'flooring');
  const mullions = ARCHITECTURAL_MATERIALS.filter(m => m.category === 'mullions');
  const roofs = ARCHITECTURAL_MATERIALS.filter(m => m.category === 'roof');

  const handleSelect = (category: keyof ActiveMaterialSelection, id: string) => {
    onChangeMaterials({
      ...materials,
      [category]: id
    });
  };

  const renderSection = (
    title: string,
    categoryKey: keyof ActiveMaterialSelection,
    items: MaterialOption[],
    selectedId: string
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-graphite-muted font-bold">
            {title}
          </span>
          <span className="text-[11px] font-editorial italic text-terracotta">
            {items.find(i => i.id === selectedId)?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map((mat) => {
            const isSelected = mat.id === selectedId;
            return (
              <button
                key={mat.id}
                onClick={() => handleSelect(categoryKey, mat.id)}
                className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-alabaster border-terracotta shadow-tactile ring-1 ring-terracotta'
                    : 'bg-linen hover:bg-alabaster border-linen-deep hover:border-linen-dark'
                }`}
              >
                {/* Header Swatch & Name */}
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-5 h-5 rounded-full border border-black/15 shadow-inner flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: mat.colorHex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white drop-shadow-sm stroke-[3]" />}
                  </div>
                  <span className="text-xs font-display font-semibold text-graphite truncate">
                    {mat.name}
                  </span>
                </div>

                {/* Tactile Description */}
                <p className="text-[10px] text-graphite-muted line-clamp-2 leading-tight mb-2">
                  {mat.tactileLabel}
                </p>

                {/* Cost Multiplier Tag */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-linen-deep/60">
                  <span className="text-graphite-subtle">Rate Impact</span>
                  <span className={`font-semibold ${mat.costMultiplier > 1.2 ? 'text-amber-800' : 'text-emerald-800'}`}>
                    {mat.costMultiplier === 1.0 ? 'Baseline (1.0×)' : `${mat.costMultiplier.toFixed(2)}×`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-alabaster border border-linen-deep rounded-lg p-4 shadow-tactile space-y-5">
      <div className="flex items-center justify-between border-b border-linen-deep pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-terracotta" />
          <h3 className="font-display font-bold text-sm text-graphite tracking-wide">
            TACTILE MATERIAL & SPECIFICATION ATELIER
          </h3>
        </div>
        <span className="text-xs font-editorial italic text-graphite-muted">
          PBR Procedural Shaders & Material Assemblies
        </span>
      </div>

      <div className="space-y-4">
        {renderSection('Exterior Facade Cladding', 'facade', facades, materials.facade)}
        <div className="border-t border-linen-deep/80" />
        {renderSection('Interior Flooring & Surfaces', 'flooring', floorings, materials.flooring)}
        <div className="border-t border-linen-deep/80" />
        {renderSection('Fenestration & Architectural Mullions', 'mullions', mullions, materials.mullions)}
        <div className="border-t border-linen-deep/80" />
        {renderSection('Roof Assembly & Overhang Structure', 'roof', roofs, materials.roof)}
      </div>
    </div>
  );
};
