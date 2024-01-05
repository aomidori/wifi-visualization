import { usetSettingsStore } from "#/store/settings";
import { useEffect } from "react";
import { Pane } from "tweakpane";

const pane = new Pane();

export function TweakPane() {
  const settings = usetSettingsStore(state => state);
  
  if (!settings.initialized) {
    pane.addBinding(settings, 'color').on('change', (event) => {
      settings.setSetting('color', event.value);
    });
    settings.setInitialized(true);
  }
  
  return null;
}