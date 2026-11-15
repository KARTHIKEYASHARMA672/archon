import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  Camera, 
  Rotate3d, 
  Eye, 
  Scissors, 
  Download, 
  Check, 
  Layers,
  Sun
} from 'lucide-react';
import { FloorPlan, ActiveMaterialSelection, SunState } from '../types/architecture';
import { ARCHITECTURAL_MATERIALS } from '../data/presetProjects';

interface ThreeStudioProps {
  plan: FloorPlan;
  materials: ActiveMaterialSelection;
  sunState: SunState;
  selectedRoomId: string | null;
  onSelectRoom: (id: string | null) => void;
  unitSystem: 'imperial' | 'metric';
}

export type CameraPreset = 'dollhouse' | 'orbit' | 'walk' | 'section';

export const ThreeStudio: React.FC<ThreeStudioProps> = ({
  plan,
  materials,
  sunState,
  selectedRoomId
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('dollhouse');
  const [showRoof, setShowRoof] = useState(false);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const buildingGroupRef = useRef<THREE.Group | null>(null);
  const roofMeshRef = useRef<THREE.Mesh | null>(null);
  const sectionPlaneRef = useRef<THREE.Plane | null>(null);

  // Interaction orbit state
  const isPointerDownRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({
    radius: 38,
    theta: Math.PI / 4, // azimuth
    phi: Math.PI / 3.2   // elevation
  });
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Initialize Scene, Renderer, and Lighting
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5EFEB); // Warm drafting vellum backdrop
    scene.fog = new THREE.FogExp2(0xF5EFEB, 0.007);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xFFF9F0, 0x5C4D43, 0.65);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xFFF0D6, 1.4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 5. Ground Plane & Contextual Site
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xEDE5DA,
      roughness: 0.9,
      metalness: 0.05
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Subtle architectural grid on ground
    const gridHelper = new THREE.GridHelper(90, 45, 0xC4B5A5, 0xDFD5C7);
    gridHelper.position.y = -0.02;
    scene.add(gridHelper);

    // Section Clipping Plane
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
    sectionPlaneRef.current = clipPlane;
    renderer.clippingPlanes = [];

    // Building Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);
    buildingGroupRef.current = buildingGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (cameraRef.current) {
        // Calculate camera position from spherical coordinates
        const { radius, theta, phi } = sphericalRef.current;
        const target = targetLookAtRef.current;

        cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
        cameraRef.current.position.y = target.y + radius * Math.cos(phi);
        cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
        cameraRef.current.lookAt(target);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Dynamic Sun Lighting
  useEffect(() => {
    if (!dirLightRef.current || !hemiLightRef.current || !sceneRef.current) return;

    const { altitudeDeg, azimuthDeg, colorTemperatureK, lightIntensity } = sunState;

    // Convert altitude and azimuth to Cartesian coordinates
    const altRad = (altitudeDeg * Math.PI) / 180;
    const azRad = (azimuthDeg * Math.PI) / 180;
    const sunDist = 55;

    const sunX = sunDist * Math.cos(altRad) * Math.sin(azRad);
    const sunY = Math.max(2, sunDist * Math.sin(altRad));
    const sunZ = sunDist * Math.cos(altRad) * Math.cos(azRad);

    dirLightRef.current.position.set(sunX, sunY, sunZ);
    dirLightRef.current.intensity = lightIntensity * 1.5;

    // Color shift based on color temperature (golden hour vs noon)
    if (colorTemperatureK < 4000) {
      dirLightRef.current.color.setHex(0xFFB878); // Golden hour amber
      hemiLightRef.current.color.setHex(0xFFE4D1);
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(0xF8E6D8);
        (sceneRef.current.fog as THREE.FogExp2).color.setHex(0xF8E6D8);
      }
    } else {
      dirLightRef.current.color.setHex(0xFFF4E5); // High noon warm architectural daylight
      hemiLightRef.current.color.setHex(0xFDFBF7);
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(0xF5EFEB);
        (sceneRef.current.fog as THREE.FogExp2).color.setHex(0xF5EFEB);
      }
    }
  }, [sunState]);

  // Rebuild 3D Procedural Architecture when Plan or Materials Change
  useEffect(() => {
    if (!buildingGroupRef.current || !sceneRef.current) return;
    const group = buildingGroupRef.current;
    
    // Clear previous geometries
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    const facadeMatDef = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.facade) || ARCHITECTURAL_MATERIALS[0];
    const floorMatDef = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.flooring) || ARCHITECTURAL_MATERIALS[5];
    const mullionMatDef = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.mullions) || ARCHITECTURAL_MATERIALS[8];
    const roofMatDef = ARCHITECTURAL_MATERIALS.find(m => m.id === materials.roof) || ARCHITECTURAL_MATERIALS[11];

    // Create Three.js PBR Materials
    const facadeThreeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(facadeMatDef.colorHex),
      roughness: facadeMatDef.roughness,
      metalness: facadeMatDef.metalness
    });

    const interiorWallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EBE3D7'),
      roughness: 0.85,
      metalness: 0.02
    });

    const floorThreeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(floorMatDef.colorHex),
      roughness: floorMatDef.roughness,
      metalness: floorMatDef.metalness
    });

    const glassThreeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C9E2F2'),
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });

    const mullionThreeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(mullionMatDef.colorHex),
      roughness: mullionMatDef.roughness,
      metalness: mullionMatDef.metalness
    });

    const roofThreeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(roofMatDef.colorHex),
      roughness: roofMatDef.roughness,
      metalness: roofMatDef.metalness
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3A6372'),
      roughness: 0.15,
      metalness: 0.3
    });

    // Center offset so building sits around (0,0,0)
    const centerX = plan.footprintWidth / 2;
    const centerZ = plan.footprintLength / 2;
    targetLookAtRef.current.set(0, 1.8, 0);

    // 1. Build Plinth / Substructure Slab
    const plinthGeo = new THREE.BoxGeometry(plan.footprintWidth + 4, 0.4, plan.footprintLength + 4);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0xDDD4C7, roughness: 0.8 });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.set(0, 0.2, 0);
    plinthMesh.receiveShadow = true;
    plinthMesh.castShadow = true;
    group.add(plinthMesh);

    // 2. Build Each Room (Floors & Walls)
    plan.rooms.forEach((room) => {
      const rx = (room.x + room.width / 2) - centerX;
      const rz = (room.y + room.length / 2) - centerZ;
      const rw = room.width;
      const rl = room.length;
      const wallH = room.ceilingHeight > 0 ? room.ceilingHeight : 0.4;
      const isSelected = room.id === selectedRoomId;

      // Room Floor Slab
      const isCourtyard = room.type === 'courtyard';
      
      const rFloorGeo = new THREE.BoxGeometry(rw - 0.1, 0.08, rl - 0.1);
      const activeFloorMat = isCourtyard 
        ? waterMat 
        : (isSelected ? new THREE.MeshStandardMaterial({ color: 0xE87D65, roughness: 0.5 }) : floorThreeMat);

      const rFloorMesh = new THREE.Mesh(rFloorGeo, activeFloorMat);
      rFloorMesh.position.set(rx, 0.44, rz);
      rFloorMesh.receiveShadow = true;
      group.add(rFloorMesh);

      // If courtyard, add reflection pool stone border
      if (isCourtyard) {
        const borderGeo = new THREE.BoxGeometry(rw, 0.2, rl);
        const borderMat = new THREE.MeshStandardMaterial({ color: 0xC5B8A8, roughness: 0.7 });
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        borderMesh.position.set(rx, 0.45, rz);
        group.add(borderMesh);
        return; // Courtyard has no roof or full solid walls
      }

      // Walls Around Room
      const wallThickness = 0.22;

      // North Wall
      const northWGeo = new THREE.BoxGeometry(rw, wallH, wallThickness);
      const northMesh = new THREE.Mesh(northWGeo, facadeThreeMat);
      northMesh.position.set(rx, 0.4 + wallH / 2, rz - rl / 2);
      northMesh.castShadow = true;
      northMesh.receiveShadow = true;
      group.add(northMesh);

      // South Wall
      const southWGeo = new THREE.BoxGeometry(rw, wallH, wallThickness);
      const southMesh = new THREE.Mesh(southWGeo, facadeThreeMat);
      southMesh.position.set(rx, 0.4 + wallH / 2, rz + rl / 2);
      southMesh.castShadow = true;
      southMesh.receiveShadow = true;
      group.add(southMesh);

      // West Wall
      const westWGeo = new THREE.BoxGeometry(wallThickness, wallH, rl);
      const westMesh = new THREE.Mesh(westWGeo, interiorWallMat);
      westMesh.position.set(rx - rw / 2, 0.4 + wallH / 2, rz);
      westMesh.castShadow = true;
      westMesh.receiveShadow = true;
      group.add(westMesh);

      // East Wall
      const eastWGeo = new THREE.BoxGeometry(wallThickness, wallH, rl);
      const eastMesh = new THREE.Mesh(eastWGeo, interiorWallMat);
      eastMesh.position.set(rx + rw / 2, 0.4 + wallH / 2, rz);
      eastMesh.castShadow = true;
      eastMesh.receiveShadow = true;
      group.add(eastMesh);

      // Windows
      room.windows.forEach((win) => {
        const winGeo = new THREE.BoxGeometry(win.width, win.height, 0.08);
        const winMesh = new THREE.Mesh(winGeo, glassThreeMat);

        let wx = rx;
        let wz = rz;
        if (win.wall === 'south') {
          wx = (room.x + win.offset + win.width / 2) - centerX;
          wz = rz + rl / 2;
        } else if (win.wall === 'north') {
          wx = (room.x + win.offset + win.width / 2) - centerX;
          wz = rz - rl / 2;
        } else if (win.wall === 'west') {
          wx = rx - rw / 2;
          wz = (room.y + win.offset + win.width / 2) - centerZ;
          winMesh.rotation.y = Math.PI / 2;
        } else if (win.wall === 'east') {
          wx = rx + rw / 2;
          wz = (room.y + win.offset + win.width / 2) - centerZ;
          winMesh.rotation.y = Math.PI / 2;
        }

        winMesh.position.set(wx, 0.4 + win.sillHeight + win.height / 2, wz);
        group.add(winMesh);

        // Mullion Frame Outline
        const frameGeo = new THREE.BoxGeometry(win.width + 0.06, win.height + 0.06, 0.12);
        const frameMesh = new THREE.Mesh(frameGeo, mullionThreeMat);
        frameMesh.position.copy(winMesh.position);
        frameMesh.rotation.copy(winMesh.rotation);
        group.add(frameMesh);
      });
    });

    // 3. Cantilevered Roof Slab with Eaves
    const maxH = Math.max(...plan.rooms.map(r => r.ceilingHeight || 3.2));
    const roofGeo = new THREE.BoxGeometry(plan.footprintWidth + 4, 0.35, plan.footprintLength + 4);
    const roofMesh = new THREE.Mesh(roofGeo, roofThreeMat);
    roofMesh.position.set(0, 0.4 + maxH + 0.18, 0);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.visible = showRoof;
    group.add(roofMesh);
    roofMeshRef.current = roofMesh;

    // 4. Specimen Architectural Vegetation & Landscaping
    const addArchitecturalTree = (x: number, z: number, scale: number) => {
      const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 2.5 * scale, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A3728, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, (2.5 * scale) / 2, z);
      trunk.castShadow = true;
      group.add(trunk);

      const canopyGeo = new THREE.ConeGeometry(1.6 * scale, 4.2 * scale, 7);
      const canopyMat = new THREE.MeshStandardMaterial({ color: 0x364835, roughness: 0.85 });
      const canopy = new THREE.Mesh(canopyGeo, canopyMat);
      canopy.position.set(x, (2.5 * scale) + (2.1 * scale), z);
      canopy.castShadow = true;
      group.add(canopy);
    };

    addArchitecturalTree(-centerX - 4.5, -centerZ - 2.5, 1.3);
    addArchitecturalTree(-centerX - 6.5, centerZ + 3.0, 1.1);
    addArchitecturalTree(centerX + 5.0, -centerZ - 3.5, 1.4);
    addArchitecturalTree(centerX + 6.0, centerZ + 4.5, 0.9);

  }, [plan, materials, showRoof, selectedRoomId]);

  // Handle Camera Presets
  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);

    if (preset === 'dollhouse') {
      setShowRoof(false);
      sphericalRef.current = { radius: 38, theta: Math.PI / 4, phi: Math.PI / 3.4 };
      if (rendererRef.current) rendererRef.current.clippingPlanes = [];
    } else if (preset === 'orbit') {
      setShowRoof(true);
      sphericalRef.current = { radius: 45, theta: Math.PI / 3, phi: Math.PI / 2.3 };
      if (rendererRef.current) rendererRef.current.clippingPlanes = [];
    } else if (preset === 'walk') {
      setShowRoof(false);
      sphericalRef.current = { radius: 14, theta: Math.PI / 2.1, phi: Math.PI / 2.05 };
      if (rendererRef.current) rendererRef.current.clippingPlanes = [];
    } else if (preset === 'section') {
      setShowRoof(true);
      sphericalRef.current = { radius: 36, theta: 0, phi: Math.PI / 2.1 };
      if (rendererRef.current && sectionPlaneRef.current) {
        sectionPlaneRef.current.constant = 2.4; // Slice mid-wall
        rendererRef.current.clippingPlanes = [sectionPlaneRef.current];
      }
    }
  };

  // Mouse Drag Orbit Controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - previousPointerPositionRef.current.x;
    const deltaY = e.clientY - previousPointerPositionRef.current.y;

    sphericalRef.current.theta -= deltaX * 0.007;
    sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.02, sphericalRef.current.phi + deltaY * 0.007));

    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(10, Math.min(80, sphericalRef.current.radius + e.deltaY * 0.03));
  };

  // High-Resolution Snapshot Capture
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    setIsSnapshotting(true);

    setTimeout(() => {
      const dataUrl = rendererRef.current!.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${plan.title.replace(/\s+/g, '_')}_3D_Render.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSnapshotting(false);
      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 2500);
    }, 150);
  };

  return (
    <div 
      className="relative w-full h-full min-h-[520px] overflow-hidden select-none border border-linen-deep rounded-lg bg-[#F5EFEB]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Camera Presets & HUD in Top Left */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-alabaster/90 backdrop-blur-md px-3 py-2 rounded-lg border border-linen-deep shadow-tactile text-xs">
        
        <span className="font-mono text-[10px] uppercase text-graphite-muted font-bold mr-1">
          Camera:
        </span>

        <button
          onClick={() => applyCameraPreset('dollhouse')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            cameraPreset === 'dollhouse' ? 'bg-terracotta text-alabaster shadow-sm font-semibold' : 'hover:bg-linen text-graphite'
          }`}
          title="Isometric Dollhouse Cutaway"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Dollhouse</span>
        </button>

        <button
          onClick={() => applyCameraPreset('orbit')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            cameraPreset === 'orbit' ? 'bg-terracotta text-alabaster shadow-sm font-semibold' : 'hover:bg-linen text-graphite'
          }`}
          title="360° Exterior Orbit"
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>Orbit 360°</span>
        </button>

        <button
          onClick={() => applyCameraPreset('walk')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            cameraPreset === 'walk' ? 'bg-terracotta text-alabaster shadow-sm font-semibold' : 'hover:bg-linen text-graphite'
          }`}
          title="Eye-Level Perspective"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Eye-Level</span>
        </button>

        <button
          onClick={() => applyCameraPreset('section')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            cameraPreset === 'section' ? 'bg-terracotta text-alabaster shadow-sm font-semibold' : 'hover:bg-linen text-graphite'
          }`}
          title="Cross-Section Cutaway Plane"
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Section Cut</span>
        </button>

        <div className="h-4 w-[1px] bg-linen-deep mx-1" />

        {/* Roof Toggle */}
        <button
          onClick={() => setShowRoof(!showRoof)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
            showRoof ? 'bg-alabaster text-graphite border border-linen-deep font-semibold' : 'text-graphite-muted hover:text-graphite'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Roof {showRoof ? 'On' : 'Off'}</span>
        </button>

        <div className="h-4 w-[1px] bg-linen-deep mx-1" />

        {/* Capture Snapshot */}
        <button
          onClick={handleCaptureSnapshot}
          disabled={isSnapshotting}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-linen-dark hover:bg-linen-deep text-graphite text-[11px] font-medium transition-colors border border-linen-deep"
          title="Capture High-Res PNG 3D Snapshot"
        >
          {snapshotSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Snapshot Saved</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Snapshot</span>
            </>
          )}
        </button>
      </div>

      {/* Current Sun Telemetry Floating HUD */}
      <div className="absolute bottom-4 left-4 z-20 bg-alabaster/85 backdrop-blur-md px-3 py-2 rounded-lg border border-linen-deep shadow-sm text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-graphite font-semibold">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>Solar Time: {Math.floor(sunState.timeOfDayHours).toString().padStart(2, '0')}:{Math.round((sunState.timeOfDayHours % 1) * 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-graphite-muted">
          <span>Altitude: {Math.round(sunState.altitudeDeg)}°</span>
          <span>Azimuth: {Math.round(sunState.azimuthDeg)}°</span>
          <span>Temp: {sunState.colorTemperatureK}K</span>
        </div>
      </div>

      {/* Orbit Tip in Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none bg-alabaster/75 backdrop-blur-sm px-2.5 py-1 rounded border border-linen-deep text-[10px] font-mono text-graphite-muted">
        Drag to Orbit · Scroll to Zoom
      </div>

    </div>
  );
};
