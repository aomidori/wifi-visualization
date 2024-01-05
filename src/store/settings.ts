import { create } from 'zustand';

interface Settings {
  color: string;
}

interface SettingsState extends Settings {
  initialized: boolean;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setInitialized: (initialized: boolean) => void;
}

export const usetSettingsStore = create<SettingsState>()(set => ({
  initialized: false,
  color: '#ff0055',
  setInitialized: (initialized) => set({ initialized }),
  setSetting: (key, value) => set({ [key]: value }),
}));