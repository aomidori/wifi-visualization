import { css } from '@emotion/css';

import { ToggleButtons } from './elements/ToggleButtons';

import { useViewStore } from '#/store/view';

const VIEW_TOGGLE_OPTIONS: { label: string, value: SceneActiveView}[] = [
  { label: 'ground', value: 'idle' },
  { label: 'top', value: 'topView' },
];

const styles = {
  topViewToggle: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  `,
};

export function TopViewToggle() {
  const activeView = useViewStore(state => state.activeView);
  const setActiveView = useViewStore(state => state.setActiveView);

  return (
    <ToggleButtons
      className={styles.topViewToggle}
      options={VIEW_TOGGLE_OPTIONS}
      selected={activeView === 'navigationView' ? 'idle' : activeView}
      onChange={setActiveView}
      buttonSize="medium"
    />
  );
}