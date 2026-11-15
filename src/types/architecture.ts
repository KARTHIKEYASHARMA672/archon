export type RoomZone = 'public' | 'private' | 'service' | 'circulation' | 'outdoor';

export type RoomType = 
  | 'great_room'
  | 'dining'
  | 'kitchen'
  | 'primary_suite'
  | 'guest_bedroom'
  | 'bathroom'
  | 'powder_room'
  | 'study_library'
  | 'courtyard'
  | 'terrace'
  | 'entry_gallery'
  | 'circulation_corridor';

export interface RoomWindow {
  id: string;
  wall: 'north' | 'south' | 'east' | 'west';
  offset: number; // distance from wall start in meters
  width: number;  // window width in meters
  height: number;
  sillHeight: number;
}

export interface RoomDoor {
  id: string;
  wall: 'north' | 'south' | 'east' | 'west';
  offset: number; // distance from wall start in meters
  width: number;
  swingDirection: 'inward_left' | 'inward_right' | 'outward';
  connectsToRoomId?: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  zone: RoomZone;
  x: number; // meters from origin
  y: number; // meters from origin
  width: number; // meters
  length: number; // meters (height along Y in 2D plan)
  ceilingHeight: number; // meters
  doors: RoomDoor[];
  windows: RoomWindow[];
  color: string;
  daylightExposure: 'high' | 'medium' | 'low' | 'none';
  targetTempC?: number;
}

export type BuildingTypology = 
  | 'hillside_pavilion'
  | 'mass_timber_residence'
  | 'travertine_courtyard_villa'
  | 'urban_infill_atelier'
  | 'desert_monolith';

export interface ExteriorWall {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number; // meters (e.g. 0.28m)
}

export interface FloorPlan {
  id: string;
  title: string;
  typology: BuildingTypology;
  tagline: string;
  description: string;
  grossAreaSqM: number;
  grossAreaSqFt: number;
  footprintWidth: number; // meters
  footprintLength: number; // meters
  levels: number;
  rooms: Room[];
  exteriorWalls: ExteriorWall[];
  orientationDegrees: number; // 0 = North
  climateZone: string;
}

// Material definitions
export interface MaterialOption {
  id: string;
  name: string;
  category: 'facade' | 'flooring' | 'mullions' | 'roof';
  colorHex: string;
  roughness: number;
  metalness: number;
  textureScale: number;
  costMultiplier: number;
  description: string;
  tactileLabel: string;
}

export interface ActiveMaterialSelection {
  facade: string;     // material id
  flooring: string;   // material id
  mullions: string;   // material id
  roof: string;       // material id
  wallAccent: string; // material id
}

// Cost assumptions & breakdown
export type StructuralSystem = 'mass_timber' | 'concrete_frame' | 'hybrid_steel';
export type FinishTier = 'standard' | 'executive' | 'haute_bespoke';
export type SiteTopography = 'flat' | 'sloped' | 'complex_hillside';
export type SustainabilityStandard = 'code_minimum' | 'leed_gold' | 'passive_house';

export interface CostAssumptions {
  structuralSystem: StructuralSystem;
  finishTier: FinishTier;
  siteTopography: SiteTopography;
  sustainabilityStandard: SustainabilityStandard;
  regionalCostIndex: number; // 0.85 to 1.50 (1.0 = US national baseline)
  laborMultiplier: number;   // 0.90 to 1.40
  contingencyPercent: number;// 5% to 20%
  mepHvacAllowancePerSqM: number; // $ / sq.m
  contractorMarginPercent: number; // 8% to 18%
}

export interface CostBreakdownItem {
  category: string;
  amountUSD: number;
  percentageOfTotal: number;
  description: string;
}

export interface CostEstimateResult {
  totalCostUSD: number;
  costPerSqFt: number;
  costPerSqM: number;
  breakdown: CostBreakdownItem[];
  assumptionsUsed: CostAssumptions;
  baseRatePerSqM: number;
}

// Space utilization analytics
export interface SpaceAnalyticsResult {
  grossInternalAreaSqM: number;
  netUsableAreaSqM: number;
  efficiencyRatio: number; // e.g. 0.86 (86%)
  circulationRatio: number; // e.g. 0.14 (14%)
  outdoorAreaSqM: number;
  glazingToWallRatio: number; // e.g. 0.38 (38%)
  averageDaylightFactor: number; // %
  acousticIsolationScore: number; // 0 - 100
  zoneBreakdown: {
    zone: RoomZone;
    areaSqM: number;
    percentage: number;
    color: string;
  }[];
}

// Sun study state
export interface SunState {
  timeOfDayHours: number; // 6.0 to 18.0 (e.g. 14.5 = 2:30 PM)
  season: 'summer_solstice' | 'equinox' | 'winter_solstice';
  latitudeDeg: number;
  altitudeDeg: number;
  azimuthDeg: number;
  lightIntensity: number;
  colorTemperatureK: number;
  shadowSharpness: number;
}

// Client prompt analysis
export interface ParsedRequirement {
  intendedGIA_SqFt: number;
  bedroomCount: number;
  bathroomCount: number;
  stories: number;
  primaryOrientation: 'South' | 'North' | 'East' | 'West';
  aestheticKeywords: string[];
  climateConstraint: string;
  recommendedTypology: BuildingTypology;
}