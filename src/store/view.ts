import { create } from 'zustand';

interface ViewState {
  activeView: SceneActiveView;
  // scene navigation instruction;
  showNavigationInstruction?: boolean;
  // instruction 3D hover text
  activeInstructionName: InstructionName;
  // save camera position when switching between ground/top views
  cameraLastPosition?: THREE.Vector3;
  isOrbitControlsDisabled?: boolean;
  setActiveView: (activeView: SceneActiveView) => void;
  setActiveInstructionName: (name: InstructionName) => void;
  setDisableOrbitControls: (value: boolean) => void;
  setCameraLastPosition: (position: THREE.Vector3) => void;
  setShowNavigationInstruction: (value: boolean) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  showNavigationInstruction: true,
  activeInstructionName: 'productPlaceholder',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
  setActiveInstructionName: (activeInstructionName: InstructionName) => set({ activeInstructionName }),
  setDisableOrbitControls: (value) => set({ isOrbitControlsDisabled: value }),
  setCameraLastPosition: (position) => set({ cameraLastPosition: position }),
  setShowNavigationInstruction: (value) => set({ showNavigationInstruction: value }),
}));