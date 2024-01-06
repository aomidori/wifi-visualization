import { useSettingsStore } from '#/store/settings';
import { useEffect } from 'react';
import { Pane } from 'tweakpane';

const pane = new Pane();

export function TweakPane() {
  const settings = useSettingsStore(state => state);
  
  if (!settings.initialized) {
    pane.addBinding(settings, 'accent').on('change', (event) => {
      settings.setSetting('accent', event.value);
    });
    pane.addBinding(settings, 'editing').on('change', (event) => {
      settings.setSetting('editing', event.value);
    });
    settings.setInitialized(true);
  }
  
  return null;
}