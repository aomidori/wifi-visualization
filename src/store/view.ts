import { create } from 'zustand';

interface ViewState {
  activeView: SceneActiveView;
  // scene navigation instruction;
  showNavigationInstruction?: boolean;
  // instruction 3D hover text
  activeInstructionName: InstructionName;
  // save camera position when switching between ground/top views
  cameraLastState?: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
  };
  isOrbitControlsDisabled?: boolean;
  setActiveView: (activeView: SceneActiveView) => void;
  setActiveInstructionName: (name: InstructionName) => void;
  setDisableOrbitControls: (value: boolean) => void;
  setCameraLastState: (data: { position: THREE.Vector3, rotation: THREE.Euler }) => void;
  setShowNavigationInstruction: (value: boolean) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  showNavigationInstruction: true,
  activeInstructionName: 'productPlaceholder',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
  setActiveInstructionName: (activeInstructionName: InstructionName) => set({ activeInstructionName }),
  setDisableOrbitControls: (value) => set({ isOrbitControlsDisabled: value }),
  setCameraLastState: (data) => set({ cameraLastState: data }),
  setShowNavigationInstruction: (value) => set({ showNavigationInstruction: value }),
}));