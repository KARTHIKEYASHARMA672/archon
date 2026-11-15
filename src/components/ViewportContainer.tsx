import React from 'react';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { ThreeStudio } from './ThreeStudio';
import { SunPathControls } from './SunPathControls';
import { FloorPlan, ActiveMaterialSelection, SunState } from '../types/architecture';

interface ViewportContainerProps {
  plan: FloorPlan;
  viewMode: '2d' | '3d' | 'split';
  materials: ActiveMaterialSelection;
  onChangeMaterials?: (materials: ActiveMaterialSelection) => void;
  sunState: SunState;
  onChangeSunState: (sunState: SunState) => void;
  isSunPanelOpen: boolean;
  onCloseSunPanel: () => void;
  unitSystem: 'imperial' | 'metric';
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string | null) => void;
}

export const ViewportContainer: React.FC<ViewportContainerProps> = ({
  plan,
  viewMode,
  materials,
  sunState,
  onChangeSunState,
  isSunPanelOpen,
  onCloseSunPanel,
  unitSystem,
  selectedRoomId,
  onSelectRoom
}) => {
  return (
    <div className="relative w-full flex-1 flex flex-col min-h-0">
      
      {/* Persistent Viewport Grid (Avoids WebGL Context churn) */}
      <div className={`relative flex-1 w-full min-h-[560px] p-3 sm:p-4 gap-3 sm:gap-4 overflow-hidden ${
        viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2' : 'flex'
      }`}>
        
        {/* 2D Vector Blueprint Canvas */}
        <div className={`w-full h-full min-h-[520px] ${
          viewMode === '2d' ? 'flex-1 block' : viewMode === 'split' ? 'block' : 'hidden'
        }`}>
          <FloorPlanCanvas
            plan={plan}
            unitSystem={unitSystem}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
          />
        </div>

        {/* 3D WebGL Studio */}
        <div className={`w-full h-full min-h-[520px] ${
          viewMode === '3d' ? 'flex-1 block' : viewMode === 'split' ? 'block' : 'hidden'
        }`}>
          <ThreeStudio
            plan={plan}
            materials={materials}
            sunState={sunState}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            unitSystem={unitSystem}
          />
        </div>

      </div>

      {/* Floating Solar Simulation Drawer */}
      {isSunPanelOpen && (
        <div className="absolute top-6 right-6 z-30 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <SunPathControls
            sunState={sunState}
            onChangeSunState={onChangeSunState}
            onClose={onCloseSunPanel}
          />
        </div>
      )}

    </div>
  );
};
