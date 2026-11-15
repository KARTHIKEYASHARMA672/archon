import React, { useState } from 'react';
import { Sparkles, Wand2, Compass, Home, MapPin, Maximize2, ArrowRight } from 'lucide-react';
import { parseNaturalLanguageBrief, generateFloorPlanFromBrief } from '../services/planGenerator';
import { FloorPlan } from '../types/architecture';

interface PromptEngineProps {
  onPlanGenerated: (plan: FloorPlan) => void;
  unitSystem: 'imperial' | 'metric';
}

const SAMPLE_BRIEFS = [
  "Design a 3,400 sq.ft contemporary hillside pavilion with 3 en-suite bedrooms, double-height south-facing living salon, mass timber structure, and central meditative courtyard lightwell",
  "Design a 2,800 sq.ft Nordic mass-timber residence with integrated architectural workshop studio, sauna wet-suite, glulam beams, and green living roof",
  "Design a 4,200 sq.ft monolithic travertine villa with reflection pool courtyard, culinary chef kitchen, shaded loggia, and bronze mullions",
  "Design a 1,650 sq.ft urban infill micro-atelier with vertical light core, mezzanine library overlooking sunken salon, and rooftop cedar deck"
];

export const PromptEngine: React.FC<PromptEngineProps> = ({ onPlanGenerated, unitSystem }) => {
  const [promptText, setPromptText] = useState(
    "Design a 3,400 sq.ft contemporary hillside pavilion with 3 en-suite bedrooms, double-height south-facing living salon, mass timber structure, and central meditative courtyard lightwell"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Live parsed telemetry
  const parsed = parseNaturalLanguageBrief(promptText);

  const handleSynthesize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const newPlan = generateFloorPlanFromBrief(promptText);
      onPlanGenerated(newPlan);
      setIsGenerating(false);
    }, 450);
  };

  return (
    <div className="bg-alabaster border-b border-linen-deep px-4 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Main Input Bar */}
        <form onSubmit={handleSynthesize} className="relative flex flex-col md:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-terracotta">
              <Wand2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your architectural design requirements (e.g. 3,500 sq.ft hillside pavilion with 3 bedrooms, mass timber structure, and central courtyard)..."
              className="w-full pl-10 pr-4 py-2.5 bg-linen border border-linen-deep rounded-lg text-sm text-graphite placeholder-graphite-subtle focus:outline-none focus:ring-1 focus:ring-terracotta focus:border-terracotta transition-all shadow-inner font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-terracotta hover:bg-terracotta-hover text-alabaster rounded-lg text-xs font-semibold tracking-wide uppercase transition-all shadow-tactile disabled:opacity-50 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-alabaster border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Concept...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesize Concept</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Live Parsed Telemetry Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 border-t border-linen-deep/60">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[11px] uppercase tracking-wider text-graphite-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse inline-block" />
              AI Parametric Extractor:
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-linen border border-linen-deep text-graphite font-mono font-medium">
              <Maximize2 className="w-3 h-3 text-terracotta" />
              {unitSystem === 'imperial'
                ? `${parsed.intendedGIA_SqFt.toLocaleString()} sq.ft GIA`
                : `${Math.round(parsed.intendedGIA_SqFt * 0.092903)} m² GIA`}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-linen border border-linen-deep text-graphite font-mono font-medium">
              <Home className="w-3 h-3 text-terracotta" />
              {parsed.bedroomCount} Beds / {parsed.bathroomCount} Baths
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-linen border border-linen-deep text-graphite font-mono font-medium">
              <Compass className="w-3 h-3 text-terracotta" />
              Oriented {parsed.primaryOrientation}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-linen border border-linen-deep text-graphite font-mono font-medium">
              <MapPin className="w-3 h-3 text-terracotta" />
              {parsed.recommendedTypology.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          {/* Quick Prompt Ideas */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-graphite-muted">
            <span className="font-editorial italic">Try atelier preset:</span>
            {SAMPLE_BRIEFS.slice(1, 3).map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptText(sample);
                  setTimeout(() => {
                    const newPlan = generateFloorPlanFromBrief(sample);
                    onPlanGenerated(newPlan);
                  }, 100);
                }}
                className="px-2 py-0.5 rounded bg-linen-dark hover:bg-linen-deep text-graphite text-[11px] truncate max-w-[200px] transition-colors border border-linen-deep"
              >
                {sample.split('with')[0]}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
