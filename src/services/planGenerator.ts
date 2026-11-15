import { FloorPlan, Room, BuildingTypology, ParsedRequirement } from '../types/architecture';
import { PRESET_FLOOR_PLANS } from '../data/presetProjects';

export function parseNaturalLanguageBrief(prompt: string): ParsedRequirement {
  const lower = prompt.toLowerCase();

  // Area detection
  let areaSqFt = 3200;
  const areaMatch = lower.match(/(\d{3,5})\s*(?:sq\.?\s*ft|sqft|square\s*feet|sf)/i);
  if (areaMatch) {
    areaSqFt = parseInt(areaMatch[1], 10);
  } else {
    const sqMMatch = lower.match(/(\d{2,4})\s*(?:sq\.?\s*m|sqm|square\s*meters?|m2)/i);
    if (sqMMatch) {
      areaSqFt = Math.round(parseInt(sqMMatch[1], 10) * 10.7639);
    }
  }

  // Bedroom detection
  let bedrooms = 3;
  const bedMatch = lower.match(/(\d+)\s*(?:bed|bedroom|br)/i);
  if (bedMatch) {
    bedrooms = Math.max(1, Math.min(6, parseInt(bedMatch[1], 10)));
  }

  // Bathroom detection
  let bathrooms = Math.max(2, bedrooms);
  const bathMatch = lower.match(/(\d+)\s*(?:bath|bathroom|ba)/i);
  if (bathMatch) {
    bathrooms = Math.max(1, Math.min(6, parseInt(bathMatch[1], 10)));
  }

  // Orientation
  let orientation: 'South' | 'North' | 'East' | 'West' = 'South';
  if (lower.includes('north')) orientation = 'North';
  else if (lower.includes('east')) orientation = 'East';
  else if (lower.includes('west')) orientation = 'West';

  // Typology recommendation
  let typology: BuildingTypology = 'hillside_pavilion';
  if (lower.includes('timber') || lower.includes('wood') || lower.includes('nordic') || lower.includes('glulam')) {
    typology = 'mass_timber_residence';
  } else if (lower.includes('travertine') || lower.includes('stone') || lower.includes('monolith') || lower.includes('courtyard')) {
    typology = 'travertine_courtyard_villa';
  } else if (lower.includes('urban') || lower.includes('compact') || lower.includes('micro') || lower.includes('infill')) {
    typology = 'urban_infill_atelier';
  } else if (lower.includes('desert') || lower.includes('rammed earth') || lower.includes('adobe')) {
    typology = 'desert_monolith';
  }

  // Keywords extraction
  const keywords: string[] = [];
  if (lower.includes('cantilever')) keywords.push('Dramatic Cantilever');
  if (lower.includes('courtyard')) keywords.push('Central Lightwell');
  if (lower.includes('clerestory') || lower.includes('double-height')) keywords.push('Double-Height Salon');
  if (lower.includes('terrace') || lower.includes('deck')) keywords.push('Covered Travertine Terrace');
  if (lower.includes('minimal') || lower.includes('clean')) keywords.push('Minimalist Detailing');
  if (lower.includes('sustainable') || lower.includes('green') || lower.includes('solar')) keywords.push('Passive Solar Architecture');
  if (keywords.length === 0) keywords.push('Bespoke Architectural Atelier', 'Tactile Materials');

  return {
    intendedGIA_SqFt: areaSqFt,
    bedroomCount: bedrooms,
    bathroomCount: bathrooms,
    stories: lower.includes('2 story') || lower.includes('two story') || lower.includes('second floor') ? 2 : 1,
    primaryOrientation: orientation,
    aestheticKeywords: keywords,
    climateConstraint: lower.includes('cold') ? 'Alpine / Cold' : lower.includes('desert') ? 'Arid / High-Sun' : 'Temperate Mediterranean',
    recommendedTypology: typology
  };
}

export function generateFloorPlanFromBrief(prompt: string): FloorPlan {
  const parsed = parseNaturalLanguageBrief(prompt);
  const targetAreaSqM = Math.round(parsed.intendedGIA_SqFt * 0.092903);
  
  // Choose base typology or generate layout
  const id = `plan_gen_${Date.now()}`;
  const widthM = Math.round(Math.sqrt(targetAreaSqM * 1.5));
  const lengthM = Math.round(targetAreaSqM / widthM);

  const rooms: Room[] = [];

  // 1. Great room (approx 25% of area)
  const salonWidth = Math.round(widthM * 0.45 * 10) / 10;
  const salonLength = Math.round(lengthM * 0.45 * 10) / 10;
  rooms.push({
    id: 'r_gen_great_room',
    name: 'Vaulted Living & Reception Salon',
    type: 'great_room',
    zone: 'public',
    x: 4.5,
    y: 4.0,
    width: salonWidth,
    length: salonLength,
    ceilingHeight: 4.2,
    color: '#F4ECE1',
    daylightExposure: 'high',
    doors: [
      { id: 'd_gr_out', wall: 'south', offset: 2.0, width: 3.5, swingDirection: 'outward' }
    ],
    windows: [
      { id: 'w_gr_1', wall: 'south', offset: 1.0, width: 3.0, height: 3.4, sillHeight: 0.1 },
      { id: 'w_gr_2', wall: 'south', offset: 5.0, width: 3.0, height: 3.4, sillHeight: 0.1 }
    ]
  });

  // 2. Dining Gallery
  const diningWidth = Math.round(widthM * 0.25 * 10) / 10;
  rooms.push({
    id: 'r_gen_dining',
    name: 'Dining Gallery',
    type: 'dining',
    zone: 'public',
    x: 4.5 + salonWidth,
    y: 4.0,
    width: diningWidth,
    length: salonLength,
    ceilingHeight: 3.4,
    color: '#EFE7DA',
    daylightExposure: 'high',
    doors: [],
    windows: [
      { id: 'w_din_1', wall: 'south', offset: 1.0, width: 2.8, height: 2.8, sillHeight: 0.3 }
    ]
  });

  // 3. Culinary Kitchen
  const kitchenWidth = Math.max(4.0, Math.round((widthM - salonWidth - diningWidth - 4.5) * 10) / 10);
  rooms.push({
    id: 'r_gen_kitchen',
    name: 'Culinary Kitchen & Pantry',
    type: 'kitchen',
    zone: 'service',
    x: 4.5 + salonWidth + diningWidth,
    y: 4.0,
    width: kitchenWidth,
    length: salonLength,
    ceilingHeight: 3.2,
    color: '#E8DED1',
    daylightExposure: 'medium',
    doors: [],
    windows: [
      { id: 'w_kit_1', wall: 'east', offset: 1.5, width: 2.4, height: 1.6, sillHeight: 1.0 }
    ]
  });

  // 4. Primary Suite (Private Wing)
  rooms.push({
    id: 'r_gen_primary',
    name: 'Primary Suite Sanctuary',
    type: 'primary_suite',
    zone: 'private',
    x: 0,
    y: 4.0 + salonLength,
    width: 7.5,
    length: Math.max(5.5, lengthM - salonLength - 4.0),
    ceilingHeight: 3.4,
    color: '#F2E8DC',
    daylightExposure: 'high',
    doors: [],
    windows: [
      { id: 'w_prim_s', wall: 'south', offset: 1.5, width: 3.2, height: 2.6, sillHeight: 0.2 },
      { id: 'w_prim_w', wall: 'west', offset: 1.0, width: 2.0, height: 2.0, sillHeight: 0.8 }
    ]
  });

  // 5. Ensuite Bathroom
  rooms.push({
    id: 'r_gen_bath_primary',
    name: 'Primary Stone Spa Bath',
    type: 'bathroom',
    zone: 'service',
    x: 7.5,
    y: 4.0 + salonLength,
    width: 4.5,
    length: 5.0,
    ceilingHeight: 3.0,
    color: '#E4DAD0',
    daylightExposure: 'medium',
    doors: [],
    windows: [
      { id: 'w_bp_1', wall: 'south', offset: 1.0, width: 1.6, height: 1.4, sillHeight: 1.2 }
    ]
  });

  // 6. Courtyard Lightwell
  rooms.push({
    id: 'r_gen_court',
    name: 'Internal Meditative Courtyard',
    type: 'courtyard',
    zone: 'outdoor',
    x: 6.0,
    y: 0,
    width: 5.5,
    length: 4.0,
    ceilingHeight: 0,
    color: '#DCE4D6',
    daylightExposure: 'high',
    doors: [],
    windows: []
  });

  // 7. Architectural Library / Study
  rooms.push({
    id: 'r_gen_study',
    name: 'Architectural Library & Study',
    type: 'study_library',
    zone: 'private',
    x: 0,
    y: 0,
    width: 6.0,
    length: 4.0,
    ceilingHeight: 3.2,
    color: '#EDE3D5',
    daylightExposure: 'medium',
    doors: [],
    windows: [
      { id: 'w_st_n', wall: 'north', offset: 1.0, width: 2.8, height: 2.2, sillHeight: 0.8 }
    ]
  });

  // 8. Guest bedroom suites
  for (let i = 1; i <= Math.min(3, parsed.bedroomCount - 1); i++) {
    const gx = 11.5 + (i - 1) * 5.0;
    rooms.push({
      id: `r_gen_guest_${i}`,
      name: `Guest Bedroom Suite ${i}`,
      type: 'guest_bedroom',
      zone: 'private',
      x: gx,
      y: 0,
      width: 4.8,
      length: 4.0,
      ceilingHeight: 3.0,
      color: '#F0E7DB',
      daylightExposure: 'medium',
      doors: [],
      windows: [
        { id: `w_g_${i}`, wall: 'north', offset: 1.0, width: 2.2, height: 1.8, sillHeight: 0.9 }
      ]
    });
  }

  // 9. Covered Outdoor Terrace Loggia
  rooms.push({
    id: 'r_gen_terrace',
    name: 'Cantilevered Sunset Terrace',
    type: 'terrace',
    zone: 'outdoor',
    x: 12.0,
    y: 4.0 + salonLength,
    width: widthM - 12.0,
    length: Math.max(5.0, lengthM - salonLength - 4.0),
    ceilingHeight: 0,
    color: '#EFE8DD',
    daylightExposure: 'high',
    doors: [],
    windows: []
  });

  // Calculate actual total area
  const totalAreaSqM = rooms
    .filter(r => r.type !== 'courtyard' && r.type !== 'terrace')
    .reduce((sum, r) => sum + (r.width * r.length), 0);

  const titleWords = parsed.aestheticKeywords.length > 0 ? parsed.aestheticKeywords[0] : 'Contemporary';

  return {
    id,
    title: `${titleWords} Design Concept`,
    typology: parsed.recommendedTypology,
    tagline: `Generative conceptual architecture tailored for ${parsed.intendedGIA_SqFt.toLocaleString()} sq.ft with ${parsed.bedroomCount} bedrooms`,
    description: `Synthesized from brief: "${prompt}". Configured with ${parsed.bedroomCount} bedrooms, ${parsed.bathroomCount} baths, oriented ${parsed.primaryOrientation}, and optimized for passive solar thermal comfort.`,
    grossAreaSqM: Math.round(totalAreaSqM * 1.12), // accounts for wall thicknesses and perimeter
    grossAreaSqFt: Math.round(totalAreaSqM * 1.12 * 10.7639),
    footprintWidth: widthM,
    footprintLength: lengthM,
    levels: parsed.stories,
    orientationDegrees: parsed.primaryOrientation === 'South' ? 180 : parsed.primaryOrientation === 'North' ? 0 : parsed.primaryOrientation === 'East' ? 90 : 270,
    climateZone: parsed.climateConstraint,
    rooms,
    exteriorWalls: [
      { x1: 0, y1: 0, x2: widthM, y2: 0, thickness: 0.30 },
      { x1: widthM, y1: 0, x2: widthM, y2: lengthM, thickness: 0.30 },
      { x1: widthM, y1: lengthM, x2: 0, y2: lengthM, thickness: 0.30 },
      { x1: 0, y1: lengthM, x2: 0, y2: 0, thickness: 0.30 }
    ]
  };
}

export function getPresetPlan(id: string): FloorPlan {
  const found = PRESET_FLOOR_PLANS.find(p => p.id === id);
  return found || PRESET_FLOOR_PLANS[0];
}