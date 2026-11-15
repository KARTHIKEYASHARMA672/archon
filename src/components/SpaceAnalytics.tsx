import React from 'react';
import { BarChart3, Maximize2, Shield, Sun, Activity, PieChart } from 'lucide-react';
import { FloorPlan, SpaceAnalyticsResult } from '../types/architecture';
import { calculateSpaceAnalytics } from '../services/analyticsEngine';

interface SpaceAnalyticsProps {
  plan: FloorPlan;
  unitSystem: 'imperial' | 'metric';
  onClose?: () => void;
}

export const SpaceAnalytics: React.FC<SpaceAnalyticsProps> = ({
  plan,
  unitSystem,
  onClose
}) => {
  const analytics: SpaceAnalyticsResult = calculateSpaceAnalytics(plan);

  return (
    <div className="bg-alabaster border border-linen-deep rounded-lg p-5 shadow-tactile space-y-5">
      <div className="flex items-center justify-between border-b border-linen-deep pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-terracotta" />
          <div>
            <h3 className="font-display font-bold text-base text-graphite tracking-wide">
              SPACE UTILIZATION & PROGRAMMATIC ANALYTICS
            </h3>
            <p className="text-xs font-editorial italic text-graphite-muted">
              Spatial efficiency, circulation ratios, and daylight factor telemetry
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs font-mono text-graphite-muted hover:text-graphite px-2.5 py-1 rounded border border-linen-deep"
          >
            Close
          </button>
        )}
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Gross Internal Area */}
        <div className="p-3 rounded-lg bg-linen border border-linen-deep">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-graphite-muted">Gross Internal Area</span>
            <Maximize2 className="w-3.5 h-3.5 text-terracotta" />
          </div>
          <span className="font-mono text-base font-bold text-graphite">
            {unitSystem === 'imperial'
              ? `${plan.grossAreaSqFt.toLocaleString()} sq.ft`
              : `${plan.grossAreaSqM} m²`}
          </span>
          <span className="block text-[10px] text-graphite-subtle mt-0.5">Total enclosed footprint</span>
        </div>

        {/* Net Usable Area */}
        <div className="p-3 rounded-lg bg-linen border border-linen-deep">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-graphite-muted">Net Usable Area</span>
            <Activity className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <span className="font-mono text-base font-bold text-emerald-800">
            {unitSystem === 'imperial'
              ? `${Math.round(analytics.netUsableAreaSqM * 10.7639).toLocaleString()} sq.ft`
              : `${analytics.netUsableAreaSqM} m²`}
          </span>
          <span className="block text-[10px] text-graphite-subtle mt-0.5">Primary functional rooms</span>
        </div>

        {/* Space Efficiency Ratio */}
        <div className="p-3 rounded-lg bg-linen border border-linen-deep">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-graphite-muted">Efficiency Rating</span>
            <PieChart className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <span className="font-mono text-base font-bold text-blue-900">
            {Math.round(analytics.efficiencyRatio * 100)}%
          </span>
          <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">
            {analytics.efficiencyRatio >= 0.82 ? 'Optimal atelier standard' : 'Acceptable'}
          </span>
        </div>

        {/* Daylight Autonomy */}
        <div className="p-3 rounded-lg bg-linen border border-linen-deep">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-graphite-muted">Daylight Autonomy</span>
            <Sun className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="font-mono text-base font-bold text-amber-900">
            {analytics.averageDaylightFactor}% DF
          </span>
          <span className="block text-[10px] text-graphite-subtle mt-0.5">
            Glazing ratio: {Math.round(analytics.glazingToWallRatio * 100)}%
          </span>
        </div>
      </div>

      {/* Programmatic Zone Distribution */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-graphite-muted font-bold">
            Programmatic Zoning Breakdown
          </span>
          <span className="text-xs font-mono text-graphite-muted">
            Circulation Factor: {Math.round(analytics.circulationRatio * 100)}%
          </span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-linen-dark border border-linen-deep">
          {analytics.zoneBreakdown.map((z, idx) => (
            <div
              key={idx}
              style={{
                width: `${z.percentage}%`,
                backgroundColor: z.color
              }}
              className="h-full transition-all duration-300 relative group"
              title={`${z.zone.toUpperCase()}: ${z.percentage}%`}
            />
          ))}
        </div>

        {/* Zone Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {analytics.zoneBreakdown.map((z, idx) => (
            <div key={idx} className="p-2.5 rounded-lg border border-linen-deep bg-linen text-left">
              <div className="flex items-center gap-1.5 mb-1">
                <div 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: z.color }} 
                />
                <span className="text-[11px] font-mono uppercase font-semibold text-graphite truncate">
                  {z.zone}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-graphite block">
                {unitSystem === 'imperial'
                  ? `${Math.round(z.areaSqM * 10.7639)} sq.ft`
                  : `${z.areaSqM} m²`}
              </span>
              <span className="text-[10px] font-mono text-graphite-muted">
                {z.percentage}% of program
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spatial Health & Acoustic Comfort Index */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-linen-deep">
        <div className="p-3 rounded-lg bg-linen border border-linen-deep flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 flex-shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-display font-bold text-graphite block">
              Acoustic Isolation Rating: {analytics.acousticIsolationScore}/100
            </span>
            <p className="text-[11px] text-graphite-muted mt-0.5 leading-snug">
              Buffer zones and courtyard separation mitigate noise transfer between active public salons and primary sleeping sanctuaries.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-linen border border-linen-deep flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 flex-shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-display font-bold text-graphite block">
              Passive Solar Orientation: {plan.orientationDegrees === 180 ? 'South (Optimal)' : `${plan.orientationDegrees}°`}
            </span>
            <p className="text-[11px] text-graphite-muted mt-0.5 leading-snug">
              Primary living apertures face the solar trajectory, optimizing winter solar thermal heat gains and daylight penetration.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
