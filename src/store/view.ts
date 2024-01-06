import { create } from 'zustand';

export type SceneActiveView = 'idle' | 'topView';
interface ViewState {
  activeView: SceneActiveView;
  activeInstructionName: InstructionName;
  cameraLastPosition?: THREE.Vector3;
  isOrbitControlsDisabled?: boolean;
  setActiveView: (activeView: SceneActiveView) => void;
  setActiveInstructionName: (name: InstructionName) => void;
  setDisableOrbitControls: (value: boolean) => void;
  setCameraLastPosition: (position: THREE.Vector3) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  activeInstructionName: 'productPlaceholder',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
  setActiveInstructionName: (activeInstructionName: InstructionName) => set({ activeInstructionName }),
  setDisableOrbitControls: (value: boolean) => set({ isOrbitControlsDisabled: value }),
  setCameraLastPosition: (position: THREE.Vector3) => set({ cameraLastPosition: position }),
}));