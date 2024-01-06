import { create } from 'zustand';

interface Settings {
  accent: string;
  editing: string;
}

interface SettingsState extends Settings {
  initialized: boolean;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(set => ({
  initialized: false,
  accent: '#98CAE2',
  editing: '#ef1414',
  setInitialized: (initialized) => set({ initialized }),
  setSetting: (key, value) => set({ [key]: value }),
}));