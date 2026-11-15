import { FloorPlan, SpaceAnalyticsResult, RoomZone } from '../types/architecture';

export function calculateSpaceAnalytics(plan: FloorPlan): SpaceAnalyticsResult {
  const indoorRooms = plan.rooms.filter(r => r.type !== 'courtyard' && r.type !== 'terrace');
  const outdoorRooms = plan.rooms.filter(r => r.type === 'courtyard' || r.type === 'terrace');

  // Net usable area (indoor rooms minus circulation)
  const functionalRooms = indoorRooms.filter(r => r.zone !== 'circulation');
  const netUsableAreaSqM = functionalRooms.reduce((acc, r) => acc + (r.width * r.length), 0);

  // Outdoor area
  const outdoorAreaSqM = outdoorRooms.reduce((acc, r) => acc + (r.width * r.length), 0);

  // Efficiency ratio (Net Usable Area / GIA)
  const efficiencyRatio = Math.min(0.92, Math.max(0.70, netUsableAreaSqM / plan.grossAreaSqM));
  const circulationRatio = 1.0 - efficiencyRatio;

  // Glazing calculation
  const totalGlazingArea = plan.rooms.reduce((acc, r) => {
    const roomGlazing = r.windows.reduce((wAcc, w) => wAcc + (w.width * w.height), 0);
    return acc + roomGlazing;
  }, 0);

  const estimatedPerimeter = 2 * (plan.footprintWidth + plan.footprintLength);
  const estimatedAverageWallHeight = 3.6;
  const estimatedGrossWallArea = estimatedPerimeter * estimatedAverageWallHeight;
  const glazingToWallRatio = Math.min(0.65, Math.max(0.18, totalGlazingArea / Math.max(100, estimatedGrossWallArea)));

  // Average daylight factor (%)
  // Based on glazing ratio, orientation, and courtyard lightwells
  const hasCourtyard = plan.rooms.some(r => r.type === 'courtyard');
  const orientationBonus = plan.orientationDegrees >= 150 && plan.orientationDegrees <= 210 ? 1.2 : 1.0;
  const averageDaylightFactor = Math.round((glazingToWallRatio * 14 * orientationBonus + (hasCourtyard ? 1.8 : 0)) * 10) / 10;

  // Acoustic isolation score (0 - 100)
  // Evaluates spatial separation between public great room and primary suite
  const greatRoom = plan.rooms.find(r => r.type === 'great_room');
  const primarySuite = plan.rooms.find(r => r.type === 'primary_suite');
  let acousticScore = 78;
  if (greatRoom && primarySuite) {
    const dx = Math.abs(greatRoom.x - primarySuite.x);
    const dy = Math.abs(greatRoom.y - primarySuite.y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Larger distance means higher acoustic isolation
    acousticScore = Math.min(95, Math.max(65, Math.round(65 + distance * 1.8)));
  }

  // Zone breakdown
  const zoneColors: Record<RoomZone, string> = {
    public: '#E87D65',      // Terracotta coral
    private: '#6888A8',     // Architectural slate
    service: '#C89B72',     // Brass ochre
    circulation: '#8C7A70', // Graphite taupe
    outdoor: '#526A4A'      // Living green
  };

  const zoneMap = new Map<RoomZone, number>();
  (['public', 'private', 'service', 'circulation', 'outdoor'] as RoomZone[]).forEach(z => zoneMap.set(z, 0));

  plan.rooms.forEach(r => {
    const area = r.width * r.length;
    zoneMap.set(r.zone, (zoneMap.get(r.zone) || 0) + area);
  });

  const totalCalculatedArea = Array.from(zoneMap.values()).reduce((a, b) => a + b, 0);

  const zoneBreakdown = Array.from(zoneMap.entries()).map(([zone, area]) => ({
    zone,
    areaSqM: Math.round(area * 10) / 10,
    percentage: Math.round((area / Math.max(1, totalCalculatedArea)) * 100),
    color: zoneColors[zone]
  }));

  return {
    grossInternalAreaSqM: plan.grossAreaSqM,
    netUsableAreaSqM: Math.round(netUsableAreaSqM * 10) / 10,
    efficiencyRatio: Math.round(efficiencyRatio * 100) / 100,
    circulationRatio: Math.round(circulationRatio * 100) / 100,
    outdoorAreaSqM: Math.round(outdoorAreaSqM * 10) / 10,
    glazingToWallRatio: Math.round(glazingToWallRatio * 100) / 100,
    averageDaylightFactor,
    acousticIsolationScore: acousticScore,
    zoneBreakdown
  };
}