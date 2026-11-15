import React, { useRef, useState, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Download, 
  Check 
} from 'lucide-react';
import { FloorPlan } from '../types/architecture';

interface FloorPlanCanvasProps {
  plan: FloorPlan;
  unitSystem: 'imperial' | 'metric';
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  plan,
  unitSystem,
  selectedRoomId,
  onSelectRoom
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [styleMode, setStyleMode] = useState<'blueprint' | 'vellum'>('vellum');
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Auto-fit calculation
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Scale factor: pixels per meter
    const marginMeters = 6;
    const totalW = plan.footprintWidth + marginMeters;
    const totalH = plan.footprintLength + marginMeters;
    
    const scaleX = (width - 80) / (totalW * 26);
    const scaleY = (height - 80) / (totalH * 26);
    const fitScale = Math.min(1.2, Math.max(0.65, Math.min(scaleX, scaleY)));
    
    setZoom(fitScale);
    setPan({ x: 50, y: 50 });
  }, [plan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export SVG Floor Plan
  const handleExportSVG = () => {
    const svgElem = document.getElementById('archon-blueprint-svg');
    if (!svgElem) return;

    const svgData = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.title.replace(/\s+/g, '_')}_Vector_Blueprint.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const pixelsPerMeter = 26; // base drafting scale

  // Colors based on style mode
  const isBp = styleMode === 'blueprint';
  const bgClass = isBp ? 'bg-[#152438]' : 'bg-[#F8F4EE]';
  const gridLineColor = isBp ? 'rgba(255, 255, 255, 0.08)' : 'rgba(108, 93, 84, 0.12)';
  const majorGridColor = isBp ? 'rgba(255, 255, 255, 0.18)' : 'rgba(108, 93, 84, 0.25)';
  const wallStroke = isBp ? '#FFFFFF' : '#2B201C';
  const wallPoche = isBp ? '#253B55' : '#D1C2B0';
  const partitionStroke = isBp ? '#9FB3C8' : '#6C5D54';
  const textColor = isBp ? '#F0F4F8' : '#2B201C';
  const mutedTextColor = isBp ? '#829AB1' : '#6C5D54';
  const dimColor = isBp ? '#62B0E8' : '#A84E3A';
  const doorSwingColor = isBp ? '#486581' : '#C89B72';

  const selectedRoom = plan.rooms.find(r => r.id === selectedRoomId);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full min-h-[520px] overflow-hidden select-none border border-linen-deep rounded-lg ${bgClass} transition-colors duration-300`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Drafting Canvas Controls HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-alabaster/90 backdrop-blur-md px-3 py-2 rounded-lg border border-linen-deep shadow-tactile text-xs">
        
        {/* Style switcher */}
        <div className="flex items-center bg-linen-dark p-0.5 rounded border border-linen-deep">
          <button
            onClick={() => setStyleMode('vellum')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              styleMode === 'vellum' ? 'bg-alabaster text-terracotta shadow-sm font-semibold' : 'text-graphite-muted'
            }`}
          >
            Drafting Vellum
          </button>
          <button
            onClick={() => setStyleMode('blueprint')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              styleMode === 'blueprint' ? 'bg-[#152438] text-alabaster shadow-sm font-semibold' : 'text-graphite-muted'
            }`}
          >
            Cyan Blueprint
          </button>
        </div>

        <div className="h-4 w-[1px] bg-linen-deep mx-1" />

        {/* Zoom controls */}
        <button
          onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
          className="p-1.5 rounded hover:bg-linen text-graphite transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.4, z - 0.15))}
          className="p-1.5 rounded hover:bg-linen text-graphite transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setZoom(1.0); setPan({ x: 50, y: 50 }); }}
          className="p-1.5 rounded hover:bg-linen text-graphite transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-linen-deep mx-1" />

        {/* Toggle options */}
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
            showDimensions ? 'bg-terracotta/10 text-terracotta font-semibold' : 'text-graphite-muted hover:text-graphite'
          }`}
        >
          Dims
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
            showGrid ? 'bg-terracotta/10 text-terracotta font-semibold' : 'text-graphite-muted hover:text-graphite'
          }`}
        >
          Grid
        </button>

        <div className="h-4 w-[1px] bg-linen-deep mx-1" />

        {/* Download Vector SVG */}
        <button
          onClick={handleExportSVG}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-linen-dark hover:bg-linen-deep text-graphite text-[11px] font-medium transition-colors border border-linen-deep"
          title="Download Vector SVG Blueprint"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Saved SVG</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export SVG</span>
            </>
          )}
        </button>
      </div>

      {/* Selected Room Inspector Floating Tag */}
      {selectedRoom && (
        <div className="absolute bottom-4 left-4 z-20 bg-alabaster/95 backdrop-blur-md p-3.5 rounded-lg border border-terracotta shadow-tactile-md max-w-xs text-xs space-y-1.5">
          <div className="flex items-center justify-between border-b border-linen-deep pb-1.5">
            <span className="font-display font-bold text-sm text-graphite">
              {selectedRoom.name}
            </span>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-terracotta/10 text-terracotta font-semibold">
              {selectedRoom.zone}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-graphite-muted pt-1">
            <div>
              <span className="block text-[10px] font-mono uppercase text-graphite-subtle">Area</span>
              <span className="font-mono font-semibold text-graphite text-xs">
                {unitSystem === 'imperial'
                  ? `${Math.round(selectedRoom.width * selectedRoom.length * 10.7639)} sq.ft`
                  : `${Math.round(selectedRoom.width * selectedRoom.length * 10) / 10} m²`}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase text-graphite-subtle">Dimensions</span>
              <span className="font-mono text-xs text-graphite">
                {selectedRoom.width}m × {selectedRoom.length}m
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase text-graphite-subtle">Ceiling Height</span>
              <span className="font-mono text-xs text-graphite">
                {selectedRoom.ceilingHeight > 0 ? `${selectedRoom.ceilingHeight}m (${Math.round(selectedRoom.ceilingHeight * 3.28084)} ft)` : 'Open to Sky'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase text-graphite-subtle">Daylight Exposure</span>
              <span className="font-mono text-xs capitalize text-graphite">
                {selectedRoom.daylightExposure}
              </span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-graphite-subtle border-t border-linen-deep">
            <span>Apertures: {selectedRoom.windows.length} Windows · {selectedRoom.doors.length} Doors</span>
            <button 
              onClick={() => onSelectRoom(null)}
              className="text-terracotta hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Compass Rose & Scale in Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        {/* Compass Rose */}
        <div className="flex items-center gap-2 bg-alabaster/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-linen-deep shadow-sm">
          <div 
            className="w-6 h-6 flex items-center justify-center transition-transform duration-500"
            style={{ transform: `rotate(${plan.orientationDegrees}deg)` }}
          >
            <Compass className="w-5 h-5 text-terracotta" />
          </div>
          <span className="text-[11px] font-mono font-bold text-graphite">
            N {plan.orientationDegrees === 180 ? '▲ SOUTH FACING' : '▲ ORIENTED'}
          </span>
        </div>

        {/* Architectural Graphic Scale */}
        <div className="bg-alabaster/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-linen-deep shadow-sm flex flex-col items-center">
          <div className="w-24 h-1.5 border-b-2 border-l-2 border-r-2 border-graphite relative flex justify-between">
            <span className="absolute -top-3 left-0 text-[9px] font-mono text-graphite">0</span>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-graphite">5m</span>
            <span className="absolute -top-3 right-0 text-[9px] font-mono text-graphite">10m</span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-graphite-muted mt-1">
            Scale 1:100 (Metric)
          </span>
        </div>
      </div>

      {/* Main Vector SVG Drafting Canvas */}
      <div 
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <svg
          id="archon-blueprint-svg"
          width={(plan.footprintWidth + 10) * pixelsPerMeter}
          height={(plan.footprintLength + 10) * pixelsPerMeter}
          viewBox={`0 0 ${(plan.footprintWidth + 10) * pixelsPerMeter} ${(plan.footprintLength + 10) * pixelsPerMeter}`}
          className="overflow-visible"
        >
          <defs>
            {/* Wall Poché Pattern */}
            <pattern id="wall-poche-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={wallPoche} strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Architectural Coordinate Grid */}
          {showGrid && (
            <g id="drafting-grid" opacity={isBp ? 0.7 : 0.85}>
              {/* 1m minor grid */}
              {Array.from({ length: plan.footprintWidth + 8 }).map((_, i) => (
                <line
                  key={`vx-${i}`}
                  x1={i * pixelsPerMeter}
                  y1={0}
                  x2={i * pixelsPerMeter}
                  y2={(plan.footprintLength + 8) * pixelsPerMeter}
                  stroke={i % 5 === 0 ? majorGridColor : gridLineColor}
                  strokeWidth={i % 5 === 0 ? 1.0 : 0.5}
                  strokeDasharray={i % 5 === 0 ? undefined : '2,4'}
                />
              ))}
              {Array.from({ length: plan.footprintLength + 8 }).map((_, j) => (
                <line
                  key={`hy-${j}`}
                  x1={0}
                  y1={j * pixelsPerMeter}
                  x2={(plan.footprintWidth + 8) * pixelsPerMeter}
                  y2={j * pixelsPerMeter}
                  stroke={j % 5 === 0 ? majorGridColor : gridLineColor}
                  strokeWidth={j % 5 === 0 ? 1.0 : 0.5}
                  strokeDasharray={j % 5 === 0 ? undefined : '2,4'}
                />
              ))}
            </g>
          )}

          {/* Exterior Building Footprint Poché */}
          <g id="exterior-walls-poche">
            {plan.exteriorWalls.map((w, idx) => (
              <line
                key={`ext-wall-${idx}`}
                x1={w.x1 * pixelsPerMeter}
                y1={w.y1 * pixelsPerMeter}
                x2={w.x2 * pixelsPerMeter}
                y2={w.y2 * pixelsPerMeter}
                stroke="url(#wall-poche-pattern)"
                strokeWidth={w.thickness * pixelsPerMeter}
                strokeLinecap="square"
              />
            ))}
            {plan.exteriorWalls.map((w, idx) => (
              <line
                key={`ext-wall-line-${idx}`}
                x1={w.x1 * pixelsPerMeter}
                y1={w.y1 * pixelsPerMeter}
                x2={w.x2 * pixelsPerMeter}
                y2={w.y2 * pixelsPerMeter}
                stroke={wallStroke}
                strokeWidth={1.5}
                strokeLinecap="square"
              />
            ))}
          </g>

          {/* Rooms and Programmatic Zones */}
          <g id="rooms-group">
            {plan.rooms.map((room) => {
              const rx = room.x * pixelsPerMeter;
              const ry = room.y * pixelsPerMeter;
              const rw = room.width * pixelsPerMeter;
              const rh = room.length * pixelsPerMeter;
              const isSelected = room.id === selectedRoomId;

              // Zone tint styling
              const isOutdoor = room.type === 'courtyard' || room.type === 'terrace';
              const fillColor = isBp 
                ? (isSelected ? '#2A4365' : isOutdoor ? '#1A365D' : '#1E3A5F')
                : (isSelected ? '#F7DFC8' : room.color || '#F8F4EE');

              return (
                <g 
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRoom(room.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Room Floor Plane */}
                  <rect
                    x={rx}
                    y={ry}
                    width={rw}
                    height={rh}
                    fill={fillColor}
                    fillOpacity={isBp ? 0.45 : (isSelected ? 0.9 : 0.55)}
                    stroke={isSelected ? '#A84E3A' : partitionStroke}
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    className="transition-all duration-150 group-hover:fill-opacity-80"
                  />

                  {/* Room Label & Area Specs */}
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 - 8}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={Math.max(10, Math.min(13, rw / 14))}
                    fontFamily="Cinzel, serif"
                    fontWeight="600"
                    letterSpacing="0.05em"
                  >
                    {room.name}
                  </text>

                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 + 10}
                    textAnchor="middle"
                    fill={mutedTextColor}
                    fontSize="9.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="500"
                  >
                    {unitSystem === 'imperial'
                      ? `${Math.round(room.width * room.length * 10.7639)} sq.ft`
                      : `${Math.round(room.width * room.length * 10) / 10} m²`}
                    {room.ceilingHeight > 0 ? ` · H:${room.ceilingHeight}m` : ''}
                  </text>

                  {/* Room Dimensions tag */}
                  <text
                    x={rx + rw / 2}
                    y={ry + rh / 2 + 24}
                    textAnchor="middle"
                    fill={dimColor}
                    fontSize="8.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {room.width}m × {room.length}m
                  </text>

                  {/* Windows */}
                  {room.windows.map((win) => {
                    let wx1 = rx, wy1 = ry, wx2 = rx, wy2 = ry;
                    const offsetPx = win.offset * pixelsPerMeter;
                    const winWidthPx = win.width * pixelsPerMeter;

                    if (win.wall === 'north') {
                      wx1 = rx + offsetPx;
                      wy1 = ry;
                      wx2 = wx1 + winWidthPx;
                      wy2 = ry;
                    } else if (win.wall === 'south') {
                      wx1 = rx + offsetPx;
                      wy1 = ry + rh;
                      wx2 = wx1 + winWidthPx;
                      wy2 = ry + rh;
                    } else if (win.wall === 'west') {
                      wx1 = rx;
                      wy1 = ry + offsetPx;
                      wx2 = rx;
                      wy2 = wy1 + winWidthPx;
                    } else if (win.wall === 'east') {
                      wx1 = rx + rw;
                      wy1 = ry + offsetPx;
                      wx2 = rx + rw;
                      wy2 = wy1 + winWidthPx;
                    }

                    return (
                      <g key={win.id}>
                        {/* Cut out line */}
                        <line
                          x1={wx1}
                          y1={wy1}
                          x2={wx2}
                          y2={wy2}
                          stroke={isBp ? '#62B0E8' : '#C89B72'}
                          strokeWidth={4}
                        />
                        {/* Glazing double line */}
                        <line
                          x1={wx1}
                          y1={wy1}
                          x2={wx2}
                          y2={wy2}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                        />
                      </g>
                    );
                  })}

                  {/* Doors & Swing Arcs */}
                  {room.doors.map((door) => {
                    const dOffset = door.offset * pixelsPerMeter;
                    const dWidth = door.width * pixelsPerMeter;
                    let dx = rx + dOffset;
                    let dy = ry;

                    if (door.wall === 'south') {
                      dx = rx + dOffset;
                      dy = ry + rh;
                    } else if (door.wall === 'west') {
                      dx = rx;
                      dy = ry + dOffset;
                    } else if (door.wall === 'east') {
                      dx = rx + rw;
                      dy = ry + dOffset;
                    }

                    return (
                      <g key={door.id}>
                        {/* Door opening gap */}
                        <circle cx={dx} cy={dy} r={2} fill={doorSwingColor} />
                        {/* Door swing arc */}
                        <path
                          d={`M ${dx} ${dy} A ${dWidth} ${dWidth} 0 0 1 ${dx + dWidth} ${dy}`}
                          fill="none"
                          stroke={doorSwingColor}
                          strokeWidth={1}
                          strokeDasharray="2,2"
                        />
                        {/* Door Leaf */}
                        <line
                          x1={dx}
                          y1={dy}
                          x2={dx + dWidth * 0.7}
                          y2={dy - dWidth * 0.7}
                          stroke={wallStroke}
                          strokeWidth={1.8}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>

          {/* Exterior Dimension Strings */}
          {showDimensions && (
            <g id="dimension-chains" opacity={0.85}>
              {/* Top overall dimension */}
              <line
                x1={0}
                y1={-15}
                x2={plan.footprintWidth * pixelsPerMeter}
                y2={-15}
                stroke={dimColor}
                strokeWidth={1}
              />
              {/* Left slash tick */}
              <line x1={-4} y1={-11} x2={4} y2={-19} stroke={dimColor} strokeWidth={1.5} />
              {/* Right slash tick */}
              <line 
                x1={plan.footprintWidth * pixelsPerMeter - 4} 
                y1={-11} 
                x2={plan.footprintWidth * pixelsPerMeter + 4} 
                y2={-19} 
                stroke={dimColor} 
                strokeWidth={1.5} 
              />
              <text
                x={(plan.footprintWidth * pixelsPerMeter) / 2}
                y={-20}
                textAnchor="middle"
                fill={dimColor}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                {unitSystem === 'imperial'
                  ? `${Math.round(plan.footprintWidth * 3.28084)}'-0"`
                  : `${plan.footprintWidth}.00 m`}
              </text>

              {/* Left side overall dimension */}
              <line
                x1={-15}
                y1={0}
                x2={-15}
                y2={plan.footprintLength * pixelsPerMeter}
                stroke={dimColor}
                strokeWidth={1}
              />
              <line x1={-19} y1={-4} x2={-11} y2={4} stroke={dimColor} strokeWidth={1.5} />
              <line 
                x1={-19} 
                y1={plan.footprintLength * pixelsPerMeter - 4} 
                x2={-11} 
                y2={plan.footprintLength * pixelsPerMeter + 4} 
                stroke={dimColor} 
                strokeWidth={1.5} 
              />
              <text
                x={-22}
                y={(plan.footprintLength * pixelsPerMeter) / 2}
                textAnchor="middle"
                fill={dimColor}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
                transform={`rotate(-90, -22, ${(plan.footprintLength * pixelsPerMeter) / 2})`}
              >
                {unitSystem === 'imperial'
                  ? `${Math.round(plan.footprintLength * 3.28084)}'-0"`
                  : `${plan.footprintLength}.00 m`}
              </text>
            </g>
          )}

          {/* Architectural Drawing Title Block in SVG */}
          <g id="drawing-title-block" transform={`translate(0, ${(plan.footprintLength + 2.5) * pixelsPerMeter})`}>
            <text
              x={0}
              y={20}
              fill={textColor}
              fontSize="14"
              fontFamily="Cinzel, serif"
              fontWeight="700"
              letterSpacing="0.08em"
            >
              {plan.title.toUpperCase()}
            </text>
            <text
              x={0}
              y={36}
              fill={mutedTextColor}
              fontSize="10"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              LEVEL 01 FLOOR PLAN · GROSS INTERNAL AREA: {unitSystem === 'imperial' ? `${plan.grossAreaSqFt.toLocaleString()} SQ.FT` : `${plan.grossAreaSqM} M²`} · ARCHON STUDIO
            </text>
          </g>

        </svg>
      </div>

    </div>
  );
};
