import React from 'react';
import { Sun, Sunset, Sunrise, Clock } from 'lucide-react';
import { SunState } from '../types/architecture';

interface SunPathControlsProps {
  sunState: SunState;
  onChangeSunState: (newState: SunState) => void;
  onClose?: () => void;
}

export const SunPathControls: React.FC<SunPathControlsProps> = ({
  sunState,
  onChangeSunState,
  onClose
}) => {
  const calculateSolarAngles = (hours: number, season: 'summer_solstice' | 'equinox' | 'winter_solstice') => {
    // Approximate solar calculation for latitude 34°N (Temperate Mediterranean)
    const hourAngle = (hours - 12) * 15; // deg from solar noon
    const declination = season === 'summer_solstice' ? 23.45 : season === 'winter_solstice' ? -23.45 : 0;
    const latRad = (34 * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;
    const haRad = (hourAngle * Math.PI) / 180;

    // Solar altitude
    const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
    const altitude = Math.max(2, (Math.asin(sinAlt) * 180) / Math.PI);

    // Solar azimuth (approx from South)
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
    let azimuth = (Math.acos(Math.min(1, Math.max(-1, cosAz))) * 180) / Math.PI;
    if (hourAngle > 0) azimuth = 360 - azimuth; // Afternoon

    // Color temperature & intensity
    let colorTemp = 5500;
    let intensity = 1.4;
    if (hours < 8 || hours > 17) {
      colorTemp = 3200; // Warm amber golden hour
      intensity = 0.9;
    } else if (hours < 10 || hours > 15) {
      colorTemp = 4500;
      intensity = 1.2;
    }

    return {
      altitudeDeg: Math.round(altitude),
      azimuthDeg: Math.round(azimuth),
      colorTemperatureK: colorTemp,
      lightIntensity: intensity
    };
  };

  const handleTimeChange = (hours: number) => {
    const { altitudeDeg, azimuthDeg, colorTemperatureK, lightIntensity } = calculateSolarAngles(hours, sunState.season);
    onChangeSunState({
      ...sunState,
      timeOfDayHours: hours,
      altitudeDeg,
      azimuthDeg,
      colorTemperatureK,
      lightIntensity
    });
  };

  const handleSeasonChange = (season: 'summer_solstice' | 'equinox' | 'winter_solstice') => {
    const { altitudeDeg, azimuthDeg, colorTemperatureK, lightIntensity } = calculateSolarAngles(sunState.timeOfDayHours, season);
    onChangeSunState({
      ...sunState,
      season,
      altitudeDeg,
      azimuthDeg,
      colorTemperatureK,
      lightIntensity
    });
  };

  const formatHours = (h: number) => {
    const hours = Math.floor(h);
    const mins = Math.round((h % 1) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayH = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayH}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="bg-alabaster border border-linen-deep rounded-lg p-4 shadow-tactile space-y-4">
      <div className="flex items-center justify-between border-b border-linen-deep pb-2.5">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-600" />
          <h4 className="font-display font-bold text-sm text-graphite tracking-wide">
            SOLAR PATH & SHADOW STUDY
          </h4>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs font-mono text-graphite-muted hover:text-graphite px-2 py-0.5 rounded border border-linen-deep"
          >
            Close
          </button>
        )}
      </div>

      {/* Time of Day Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-graphite-muted flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-terracotta" />
            Time of Day:
          </span>
          <span className="text-xs font-mono font-bold text-terracotta px-2 py-0.5 rounded bg-terracotta/10">
            {formatHours(sunState.timeOfDayHours)}
          </span>
        </div>

        <input
          type="range"
          min={6.0}
          max={19.0}
          step={0.25}
          value={sunState.timeOfDayHours}
          onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
          className="w-full cursor-pointer h-1.5 bg-linen-dark rounded-lg appearance-none"
        />

        {/* Quick Presets */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            onClick={() => handleTimeChange(7.0)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1 ${
              Math.abs(sunState.timeOfDayHours - 7.0) < 0.3 ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'bg-linen border-linen-deep text-graphite-muted'
            }`}
          >
            <Sunrise className="w-3 h-3" />
            <span>Dawn (07:00)</span>
          </button>
          <button
            onClick={() => handleTimeChange(12.0)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1 ${
              Math.abs(sunState.timeOfDayHours - 12.0) < 0.3 ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'bg-linen border-linen-deep text-graphite-muted'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Noon (12:00)</span>
          </button>
          <button
            onClick={() => handleTimeChange(17.5)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1 ${
              Math.abs(sunState.timeOfDayHours - 17.5) < 0.3 ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'bg-linen border-linen-deep text-graphite-muted'
            }`}
          >
            <Sunset className="w-3 h-3" />
            <span>Gold (17:30)</span>
          </button>
          <button
            onClick={() => handleTimeChange(19.0)}
            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all flex items-center justify-center gap-1 ${
              Math.abs(sunState.timeOfDayHours - 19.0) < 0.3 ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold' : 'bg-linen border-linen-deep text-graphite-muted'
            }`}
          >
            <Sunset className="w-3 h-3" />
            <span>Dusk (19:00)</span>
          </button>
        </div>
      </div>

      {/* Season Selector */}
      <div className="space-y-1.5 pt-2 border-t border-linen-deep">
        <span className="text-xs font-mono uppercase text-graphite-muted block">
          Seasonal Altitude Preset:
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(['summer_solstice', 'equinox', 'winter_solstice'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleSeasonChange(s)}
              className={`px-2.5 py-1.5 rounded text-xs font-medium border text-center transition-all ${
                sunState.season === s
                  ? 'bg-alabaster border-terracotta text-terracotta font-semibold shadow-sm'
                  : 'bg-linen border-linen-deep text-graphite hover:border-linen-dark'
              }`}
            >
              {s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Live Calculated Solar Geometry */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-linen-deep text-center">
        <div className="p-2 rounded bg-linen border border-linen-deep">
          <span className="block text-[10px] font-mono uppercase text-graphite-muted">Solar Altitude</span>
          <span className="font-mono text-xs font-bold text-graphite">{sunState.altitudeDeg}°</span>
        </div>
        <div className="p-2 rounded bg-linen border border-linen-deep">
          <span className="block text-[10px] font-mono uppercase text-graphite-muted">Solar Azimuth</span>
          <span className="font-mono text-xs font-bold text-graphite">{sunState.azimuthDeg}°</span>
        </div>
        <div className="p-2 rounded bg-linen border border-linen-deep">
          <span className="block text-[10px] font-mono uppercase text-graphite-muted">Color Temp</span>
          <span className="font-mono text-xs font-bold text-amber-800">{sunState.colorTemperatureK}K</span>
        </div>
      </div>

    </div>
  );
};
