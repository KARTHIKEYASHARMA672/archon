import { FloorPlan, MaterialOption, CostAssumptions } from '../types/architecture';

export const ARCHITECTURAL_MATERIALS: MaterialOption[] = [
  // Facade Materials
  {
    id: 'facade_terracotta',
    name: 'Fired Terracotta Baguette',
    category: 'facade',
    colorHex: '#A84E3A',
    roughness: 0.72,
    metalness: 0.05,
    textureScale: 1.0,
    costMultiplier: 1.25,
    description: 'Extruded hollow-core terracotta louvers providing solar shading and warm, tactile thermal mass.',
    tactileLabel: 'Earth-fired, matte, striated grain'
  },
  {
    id: 'facade_travertine',
    name: 'Honed Roman Travertine',
    category: 'facade',
    colorHex: '#E2D5C3',
    roughness: 0.65,
    metalness: 0.02,
    textureScale: 1.2,
    costMultiplier: 1.55,
    description: 'Cross-cut unfilled travertine stone with natural sedimentary veining and monolithic thermal resilience.',
    tactileLabel: 'Silky honed stone, warm porous limestone'
  },
  {
    id: 'facade_cedar',
    name: 'Weathered Western Red Cedar',
    category: 'facade',
    colorHex: '#8C6C52',
    roughness: 0.82,
    metalness: 0.01,
    textureScale: 0.8,
    costMultiplier: 1.15,
    description: 'Vertically oriented tongue-and-groove cedar cladding treated with natural bio-pigments for silver-gray patina.',
    tactileLabel: 'Aromatic wood grain, organic warmth'
  },
  {
    id: 'facade_concrete',
    name: 'Board-Formed Concrete',
    category: 'facade',
    colorHex: '#B2ACA2',
    roughness: 0.85,
    metalness: 0.08,
    textureScale: 1.5,
    costMultiplier: 1.20,
    description: 'High-strength structural concrete cast against rough-sawn Douglas fir boards, expressing tactile wood grain.',
    tactileLabel: 'Monolithic, textured timber-relief concrete'
  },
  {
    id: 'facade_lime_plaster',
    name: 'Off-White Mineral Lime Plaster',
    category: 'facade',
    colorHex: '#F2EDE4',
    roughness: 0.90,
    metalness: 0.01,
    textureScale: 0.5,
    costMultiplier: 1.00,
    description: 'Vapor-permeable natural slaked lime plaster with marble dust aggregate for soft diffused daylight reflection.',
    tactileLabel: 'Chalky, breathable Mediterranean vellum'
  },

  // Flooring Materials
  {
    id: 'floor_oak_herringbone',
    name: 'White Oak Herringbone Parquet',
    category: 'flooring',
    colorHex: '#D1B48C',
    roughness: 0.45,
    metalness: 0.02,
    textureScale: 0.9,
    costMultiplier: 1.30,
    description: 'Quarter-sawn European white oak laid in classic 90-degree herringbone with a matte Danish oil finish.',
    tactileLabel: 'Warm, low-sheen organic timber underfoot'
  },
  {
    id: 'floor_terrazzo',
    name: 'Honed Venetian Terrazzo',
    category: 'flooring',
    colorHex: '#ECE4D8',
    roughness: 0.35,
    metalness: 0.06,
    textureScale: 1.4,
    costMultiplier: 1.40,
    description: 'Poured-in-place terrazzo with Carrara marble chips and river pebbles, ground flat and satin-honed.',
    tactileLabel: 'Cool, seamless, aggregate mosaic'
  },
  {
    id: 'floor_microcement',
    name: 'Poured Architectural Microcement',
    category: 'flooring',
    colorHex: '#C5BCB2',
    roughness: 0.40,
    metalness: 0.04,
    textureScale: 0.6,
    costMultiplier: 1.10,
    description: 'Continuous polymer-modified cementitious screed with subtle hand-troweled clouding and satin sealant.',
    tactileLabel: 'Seamless, contemporary mineral surface'
  },

  // Mullions & Fenestration
  {
    id: 'mullion_bronze',
    name: 'Dark Patinated Bronze',
    category: 'mullions',
    colorHex: '#4A3B32',
    roughness: 0.38,
    metalness: 0.70,
    textureScale: 0.5,
    costMultiplier: 1.35,
    description: 'Thermally-broken extruded bronze window sections with hand-rubbed statuary patina.',
    tactileLabel: 'Substantial, burnished metal with rich depth'
  },
  {
    id: 'mullion_steel_black',
    name: 'Matte Black Structural Steel',
    category: 'mullions',
    colorHex: '#222224',
    roughness: 0.50,
    metalness: 0.40,
    textureScale: 0.5,
    costMultiplier: 1.15,
    description: 'Ultra-slim Swiss-profile structural steel glazing frames with matte architectural powder coat.',
    tactileLabel: 'Crisp, razor-thin architectural profile'
  },
  {
    id: 'mullion_oak',
    name: 'Natural Quarter-Sawn Oak',
    category: 'mullions',
    colorHex: '#BC9E76',
    roughness: 0.60,
    metalness: 0.01,
    textureScale: 0.7,
    costMultiplier: 1.20,
    description: 'Timber-curtain-wall mullions crafted from laminated solid oak with concealed stainless steel fasteners.',
    tactileLabel: 'Tactile natural timber casing'
  },

  // Roof Assemblies
  {
    id: 'roof_zinc',
    name: 'Anthracite Standing-Seam Zinc',
    category: 'roof',
    colorHex: '#3D444A',
    roughness: 0.45,
    metalness: 0.55,
    textureScale: 1.0,
    costMultiplier: 1.35,
    description: 'Pre-weathered titanium-zinc panels with double-lock standing seams for 100-year water-shedding performance.',
    tactileLabel: 'Crisp metallic rhythm, velvety dark slate hue'
  },
  {
    id: 'roof_sedum',
    name: 'Living Sedum Green Roof',
    category: 'roof',
    colorHex: '#526A4A',
    roughness: 0.95,
    metalness: 0.00,
    textureScale: 2.0,
    costMultiplier: 1.45,
    description: 'Extensive multi-species succulent carpet over drainage matrix, providing storm attenuation and passive cooling.',
    tactileLabel: 'Lush living biophilic canopy'
  },
  {
    id: 'roof_timber_rafters',
    name: 'Douglas Fir Exposed Rafters',
    category: 'roof',
    colorHex: '#9E6B48',
    roughness: 0.70,
    metalness: 0.02,
    textureScale: 1.0,
    costMultiplier: 1.25,
    description: 'Heavy mass-timber roof plane with tongue-and-groove decking extending into deep solar overhangs.',
    tactileLabel: 'Deep protective timber eaves'
  }
];

export const PRESET_FLOOR_PLANS: FloorPlan[] = [
  {
    id: 'plan_sandalwood_hillside',
    title: 'Sandalwood Hillside Residence',
    typology: 'hillside_pavilion',
    tagline: 'Terracotta & cedar pavilion embracing southern solar exposure and tiered topography',
    description: 'Designed around a central meditative courtyard lightwell with 3 en-suite bedrooms, open-concept double-height living salon, floating cantilevered dining gallery, and expansive travertine terrace.',
    grossAreaSqM: 316,
    grossAreaSqFt: 3401,
    footprintWidth: 26,
    footprintLength: 17,
    levels: 1,
    orientationDegrees: 180, // Facing South
    climateZone: 'Mediterranean / Temperate Csa',
    rooms: [
      {
        id: 'r_entry',
        name: 'Vestibule & Entry Gallery',
        type: 'entry_gallery',
        zone: 'circulation',
        x: 0,
        y: 6,
        width: 4.5,
        length: 5,
        ceilingHeight: 3.2,
        color: '#E8DED1',
        daylightExposure: 'medium',
        doors: [
          { id: 'd_main', wall: 'west', offset: 1.5, width: 1.2, swingDirection: 'inward_right' },
          { id: 'd_hall', wall: 'east', offset: 2.0, width: 1.8, swingDirection: 'inward_left', connectsToRoomId: 'r_great_room' }
        ],
        windows: [
          { id: 'w_entry_n', wall: 'north', offset: 1.0, width: 1.8, height: 2.4, sillHeight: 0.4 }
        ]
      },
      {
        id: 'r_great_room',
        name: 'Double-Height Living Salon',
        type: 'great_room',
        zone: 'public',
        x: 4.5,
        y: 4.5,
        width: 9.5,
        length: 7.5,
        ceilingHeight: 4.2,
        color: '#F4ECE1',
        daylightExposure: 'high',
        doors: [
          { id: 'd_patio_s', wall: 'south', offset: 2.5, width: 4.0, swingDirection: 'outward' },
          { id: 'd_dining', wall: 'east', offset: 2.0, width: 2.4, swingDirection: 'inward_left', connectsToRoomId: 'r_dining' }
        ],
        windows: [
          { id: 'w_salon_s1', wall: 'south', offset: 1.0, width: 3.2, height: 3.4, sillHeight: 0.1 },
          { id: 'w_salon_s2', wall: 'south', offset: 5.5, width: 3.2, height: 3.4, sillHeight: 0.1 }
        ]
      },
      {
        id: 'r_dining',
        name: 'Dining Gallery & Wine Cellar',
        type: 'dining',
        zone: 'public',
        x: 14.0,
        y: 5.5,
        width: 5.5,
        length: 6.5,
        ceilingHeight: 3.4,
        color: '#EFE7DA',
        daylightExposure: 'high',
        doors: [
          { id: 'd_kitchen', wall: 'east', offset: 1.5, width: 1.6, swingDirection: 'inward_right', connectsToRoomId: 'r_kitchen' }
        ],
        windows: [
          { id: 'w_dining_s', wall: 'south', offset: 1.0, width: 3.5, height: 2.8, sillHeight: 0.3 }
        ]
      },
      {
        id: 'r_kitchen',
        name: 'Culinary Kitchen & Scullery',
        type: 'kitchen',
        zone: 'service',
        x: 19.5,
        y: 5.5,
        width: 6.5,
        length: 6.5,
        ceilingHeight: 3.2,
        color: '#E8DED1',
        daylightExposure: 'medium',
        doors: [
          { id: 'd_pantry_e', wall: 'east', offset: 2.0, width: 1.0, swingDirection: 'inward_left' }
        ],
        windows: [
          { id: 'w_kitch_e', wall: 'east', offset: 1.5, width: 2.5, height: 1.6, sillHeight: 1.0 }
        ]
      },
      {
        id: 'r_courtyard',
        name: 'Central Courtyard Lightwell',
        type: 'courtyard',
        zone: 'outdoor',
        x: 9.0,
        y: 0,
        width: 5.0,
        length: 4.5,
        ceilingHeight: 0,
        color: '#DCE4D6',
        daylightExposure: 'high',
        doors: [
          { id: 'd_court_s', wall: 'south', offset: 1.5, width: 2.0, swingDirection: 'outward', connectsToRoomId: 'r_great_room' }
        ],
        windows: []
      },
      {
        id: 'r_primary_suite',
        name: 'Primary Suite Sanctuary',
        type: 'primary_suite',
        zone: 'private',
        x: 0,
        y: 11.0,
        width: 7.5,
        length: 6.0,
        ceilingHeight: 3.4,
        color: '#F2E8DC',
        daylightExposure: 'high',
        doors: [
          { id: 'd_primary_bath', wall: 'east', offset: 2.0, width: 1.0, swingDirection: 'inward_right', connectsToRoomId: 'r_primary_bath' }
        ],
        windows: [
          { id: 'w_suite_s', wall: 'south', offset: 1.0, width: 3.5, height: 2.8, sillHeight: 0.2 },
          { id: 'w_suite_w', wall: 'west', offset: 1.5, width: 2.4, height: 2.0, sillHeight: 0.8 }
        ]
      },
      {
        id: 'r_primary_bath',
        name: 'Ensuite Stone Bath & Dressing',
        type: 'bathroom',
        zone: 'service',
        x: 7.5,
        y: 12.0,
        width: 4.5,
        length: 5.0,
        ceilingHeight: 3.0,
        color: '#E4DAD0',
        daylightExposure: 'medium',
        doors: [],
        windows: [
          { id: 'w_bath_s', wall: 'south', offset: 1.5, width: 1.8, height: 1.5, sillHeight: 1.2 }
        ]
      },
      {
        id: 'r_study',
        name: 'Architectural Library & Study',
        type: 'study_library',
        zone: 'private',
        x: 0,
        y: 0,
        width: 5.5,
        length: 6.0,
        ceilingHeight: 3.2,
        color: '#EDE3D5',
        daylightExposure: 'medium',
        doors: [
          { id: 'd_study_entry', wall: 'south', offset: 2.5, width: 1.0, swingDirection: 'inward_left', connectsToRoomId: 'r_entry' }
        ],
        windows: [
          { id: 'w_study_n', wall: 'north', offset: 1.0, width: 3.0, height: 2.2, sillHeight: 0.8 }
        ]
      },
      {
        id: 'r_guest_bed_1',
        name: 'Guest Suite East',
        type: 'guest_bedroom',
        zone: 'private',
        x: 16.0,
        y: 0,
        width: 5.0,
        length: 5.5,
        ceilingHeight: 3.0,
        color: '#F0E7DB',
        daylightExposure: 'medium',
        doors: [
          { id: 'd_guest1', wall: 'south', offset: 1.5, width: 0.9, swingDirection: 'inward_right', connectsToRoomId: 'r_dining' }
        ],
        windows: [
          { id: 'w_guest1_n', wall: 'north', offset: 1.0, width: 2.5, height: 2.0, sillHeight: 0.8 }
        ]
      },
      {
        id: 'r_terrace',
        name: 'Covered Travertine Loggia & Terrace',
        type: 'terrace',
        zone: 'outdoor',
        x: 4.5,
        y: 12.0,
        width: 15.0,
        length: 5.0,
        ceilingHeight: 0,
        color: '#EFE8DD',
        daylightExposure: 'high',
        doors: [],
        windows: []
      }
    ],
    exteriorWalls: [
      { x1: 0, y1: 0, x2: 26, y2: 0, thickness: 0.30 },
      { x1: 26, y1: 0, x2: 26, y2: 17, thickness: 0.30 },
      { x1: 26, y1: 17, x2: 0, y2: 17, thickness: 0.30 },
      { x1: 0, y1: 17, x2: 0, y2: 0, thickness: 0.30 }
    ]
  },
  {
    id: 'plan_nordic_timber',
    title: 'Nordic Mass-Timber Atelier',
    typology: 'mass_timber_residence',
    tagline: 'Glulam structural portal frames with biophilic living roof and cedar envelope',
    description: 'Zero-carbon mass-timber residence featuring an open double-height salon, attached architectural design workshop, cedar sauna wellness suite, and solar clerestory.',
    grossAreaSqM: 255,
    grossAreaSqFt: 2745,
    footprintWidth: 22,
    footprintLength: 15,
    levels: 1,
    orientationDegrees: 180,
    climateZone: 'Sub-Alpine / Cold Oceanic Cfb',
    rooms: [
      {
        id: 'r_timber_salon',
        name: 'Great Room & Glulam Hearth',
        type: 'great_room',
        zone: 'public',
        x: 4.0,
        y: 4.0,
        width: 9.0,
        length: 7.0,
        ceilingHeight: 4.5,
        color: '#F4ECE1',
        daylightExposure: 'high',
        doors: [
          { id: 'd_t_patio', wall: 'south', offset: 2.0, width: 3.5, swingDirection: 'outward' }
        ],
        windows: [
          { id: 'w_t_s1', wall: 'south', offset: 1.0, width: 3.0, height: 3.8, sillHeight: 0.1 }
        ]
      },
      {
        id: 'r_timber_atelier',
        name: 'Architectural Workshop & Lab',
        type: 'study_library',
        zone: 'public',
        x: 13.0,
        y: 4.0,
        width: 6.5,
        length: 7.0,
        ceilingHeight: 3.8,
        color: '#EDE3D5',
        daylightExposure: 'high',
        doors: [],
        windows: [
          { id: 'w_t_e1', wall: 'east', offset: 1.5, width: 3.5, height: 2.8, sillHeight: 0.4 }
        ]
      },
      {
        id: 'r_timber_primary',
        name: 'Primary Timber Suite',
        type: 'primary_suite',
        zone: 'private',
        x: 0,
        y: 8.0,
        width: 6.5,
        length: 6.0,
        ceilingHeight: 3.2,
        color: '#F2E8DC',
        daylightExposure: 'medium',
        doors: [],
        windows: [
          { id: 'w_t_w1', wall: 'west', offset: 1.0, width: 2.8, height: 2.4, sillHeight: 0.6 }
        ]
      },
      {
        id: 'r_timber_kitchen',
        name: 'Nordic Oak Kitchen',
        type: 'kitchen',
        zone: 'service',
        x: 4.0,
        y: 0,
        width: 7.0,
        length: 4.0,
        ceilingHeight: 3.0,
        color: '#E8DED1',
        daylightExposure: 'medium',
        doors: [],
        windows: [
          { id: 'w_t_n1', wall: 'north', offset: 1.5, width: 2.5, height: 1.8, sillHeight: 1.0 }
        ]
      }
    ],
    exteriorWalls: [
      { x1: 0, y1: 0, x2: 22, y2: 0, thickness: 0.32 },
      { x1: 22, y1: 0, x2: 22, y2: 15, thickness: 0.32 },
      { x1: 22, y1: 15, x2: 0, y2: 15, thickness: 0.32 },
      { x1: 0, y1: 15, x2: 0, y2: 0, thickness: 0.32 }
    ]
  },
  {
    id: 'plan_travertine_monolith',
    title: 'Travertine Monolith Villa',
    typology: 'travertine_courtyard_villa',
    tagline: 'Monumental cross-cut travertine massing centered on quiet reflection pool',
    description: 'Peristyle courtyard residence crafted with cross-cut Roman travertine, high-mass concrete envelopes, floor-to-ceiling bronze apertures, and shaded outdoor loggias.',
    grossAreaSqM: 395,
    grossAreaSqFt: 4252,
    footprintWidth: 28,
    footprintLength: 19,
    levels: 1,
    orientationDegrees: 180,
    climateZone: 'Arid / Semi-Arid BSh',
    rooms: [
      {
        id: 'r_trav_salon',
        name: 'Monolithic Living Hall',
        type: 'great_room',
        zone: 'public',
        x: 6.0,
        y: 6.0,
        width: 11.0,
        length: 7.0,
        ceilingHeight: 4.6,
        color: '#F4ECE1',
        daylightExposure: 'high',
        doors: [],
        windows: [
          { id: 'w_tr_s1', wall: 'south', offset: 2.0, width: 4.5, height: 3.6, sillHeight: 0.1 }
        ]
      },
      {
        id: 'r_trav_court',
        name: 'Peristyle Water Courtyard',
        type: 'courtyard',
        zone: 'outdoor',
        x: 9.0,
        y: 0,
        width: 8.0,
        length: 6.0,
        ceilingHeight: 0,
        color: '#DCE4D6',
        daylightExposure: 'high',
        doors: [],
        windows: []
      },
      {
        id: 'r_trav_primary',
        name: 'Master Sanctuary Wing',
        type: 'primary_suite',
        zone: 'private',
        x: 0,
        y: 10.0,
        width: 8.0,
        length: 8.0,
        ceilingHeight: 3.6,
        color: '#F2E8DC',
        daylightExposure: 'high',
        doors: [],
        windows: [
          { id: 'w_tr_w1', wall: 'west', offset: 1.5, width: 3.2, height: 2.8, sillHeight: 0.2 }
        ]
      }
    ],
    exteriorWalls: [
      { x1: 0, y1: 0, x2: 28, y2: 0, thickness: 0.35 },
      { x1: 28, y1: 0, x2: 28, y2: 19, thickness: 0.35 },
      { x1: 28, y1: 19, x2: 0, y2: 19, thickness: 0.35 },
      { x1: 0, y1: 19, x2: 0, y2: 0, thickness: 0.35 }
    ]
  }
];

export const DEFAULT_COST_ASSUMPTIONS: CostAssumptions = {
  structuralSystem: 'mass_timber',
  finishTier: 'executive',
  siteTopography: 'sloped',
  sustainabilityStandard: 'leed_gold',
  regionalCostIndex: 1.15, // 15% above national baseline (typical for high-craft studio architecture)
  laborMultiplier: 1.10,
  contingencyPercent: 10,
  mepHvacAllowancePerSqM: 420, // $420 / sq.m for radiant heating, ERV, and concealed VRF
  contractorMarginPercent: 12
};