import { create } from 'zustand';

interface Settings {
  accent: string;
}

interface SettingsState extends Settings {
  initialized: boolean;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setInitialized: (initialized: boolean) => void;
}

export const usetSettingsStore = create<SettingsState>()(set => ({
  initialized: false,
  accent: '#98CAE2',
  setInitialized: (initialized) => set({ initialized }),
  setSetting: (key, value) => set({ [key]: value }),
}));