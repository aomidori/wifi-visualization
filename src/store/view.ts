import { create } from 'zustand';

export type SceneActiveView = 'idle' | 'topView';

interface ViewState {
  activeView: SceneActiveView;
  isOrbitControlsDisabled?: boolean;
  setActiveView: (activeView: SceneActiveView) => void;
  setDisableOrbitControls: (value: boolean) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
  setDisableOrbitControls: (value: boolean) => set({ isOrbitControlsDisabled: value }),
}));