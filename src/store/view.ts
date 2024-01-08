import { create } from 'zustand';

interface CameraState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  worldQuaternion: THREE.Quaternion;
}

interface ViewState {
  activeView: SceneActiveView;
  // scene navigation instruction;
  showNavigationInstruction?: boolean;
  // instruction 3D hover text
  activeInstructionName: InstructionName;
  // save camera position when switching between ground/top views
  cameraLastState?: CameraState
  // product effect visualization
  showVisualization?: boolean;
  isOrbitControlsDisabled?: boolean;
  isMobileView?: boolean;
  setActiveView: (activeView: SceneActiveView) => void;
  setActiveInstructionName: (name: InstructionName) => void;
  setDisableOrbitControls: (value: boolean) => void;
  setCameraLastState: (data: CameraState) => void;
  setShowNavigationInstruction: (value: boolean) => void;
  setIsMobileView: (value: boolean) => void;
  setShowVisualization: (value: boolean) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  showNavigationInstruction: true,
  showVisualization: true,
  activeInstructionName: 'productPlaceholder',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
  setActiveInstructionName: (activeInstructionName: InstructionName) => set({ activeInstructionName }),
  setDisableOrbitControls: (value) => set({ isOrbitControlsDisabled: value }),
  setCameraLastState: (data) => set({ cameraLastState: data }),
  setShowNavigationInstruction: (value) => set({ showNavigationInstruction: value }),
  setIsMobileView: (value) => set({ isMobileView: value }),
  setShowVisualization: (value) => set({ showVisualization: value }),
}));