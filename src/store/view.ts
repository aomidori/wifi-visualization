import { create } from 'zustand';

export type SceneActiveView = 'idle' | 'topView';

interface ViewState {
  activeView: SceneActiveView;
  cameraLastPosition?: THREE.Vector3;
  isOrbitControlsDisabled?: boolean;
  setActiveView: (activeView: SceneActiveView) => void;
  setDisableOrbitControls: (value: boolean) => void;
  setCameraLastPosition: (position: THREE.Vector3) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
  setDisableOrbitControls: (value: boolean) => set({ isOrbitControlsDisabled: value }),
  setCameraLastPosition: (position: THREE.Vector3) => set({ cameraLastPosition: position }),
}));