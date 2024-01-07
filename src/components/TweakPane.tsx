import { useSettingsStore } from '#/store/settings';
import { useViewStore } from '#/store/view';
import { useEffect } from 'react';
import { Pane } from 'tweakpane';

const pane = new Pane();

export function TweakPane() {
  const settings = useSettingsStore(state => state);
  const isMobileView = useViewStore(state => state.isMobileView);

  useEffect(() => {
    if (isMobileView) {
      pane.hidden = true;
    } else {
      pane.hidden = false;
    }
  }, [isMobileView]);
  
  if (!settings.initialized) {
    pane.addBinding(settings, 'accent').on('change', (event) => {
      settings.setSetting('accent', event.value);
    });
    pane.addBinding(settings, 'editing').on('change', (event) => {
      settings.setSetting('editing', event.value);
    });
    if (window.innerWidth < 768) {
      pane.hidden = true;
    }
    settings.setInitialized(true);
  }

  return null;
}