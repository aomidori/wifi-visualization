import { useViewStore } from '#/store/view';
import { ToggleButtons } from './elements/ToggleButtons';

const VIEW_TOGGLE_OPTIONS: { label: string, value: SceneActiveView}[] = [
  { label: 'ground', value: 'idle' },
  { label: 'top', value: 'topView' },
];

export function TopViewToggle() {
  const activeView = useViewStore(state => state.activeView);
  const setActiveView = useViewStore(state => state.setActiveView);

  return (
    <ToggleButtons
      options={VIEW_TOGGLE_OPTIONS}
      selected={activeView === 'navigationView' ? 'idle' : activeView}
      onChange={setActiveView}
      buttonSize="medium"
    />
  );
}