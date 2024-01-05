import { create } from 'zustand';

export type SceneActiveView = 'idle' | 'topView';

interface ViewState {
  activeView: SceneActiveView;
  setActiveView: (activeView: SceneActiveView) => void;
}

export const useViewStore = create<ViewState>()(set => ({
  activeView: 'idle',
  setActiveView: (activeView: SceneActiveView) => set({ activeView }),
}));