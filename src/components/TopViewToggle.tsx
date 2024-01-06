import { css, cx } from "@emotion/css";

import { SceneActiveView, useViewStore } from "#/store/view";

const BUTTON_SIZE = 88;

const styles = {
  container: css`
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
  toggle: css`
    position: relative;
    background: #333;
    color: white;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
    height: 40px;
    border-radius: 40px;
    display: flex;
    span {
      width: ${BUTTON_SIZE - 2}px;
      height: 38px;
      margin: 1px;
      background: white;
      border-radius: 38px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
      pointer-events: none;
      position: absolute;
      transition: left 0.2s ease;
    }
  `,
  toggleButton: css`
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    line-height: 40px;
    width: ${BUTTON_SIZE}px;
    text-align: center;
    transition: all 0.2s ease;
    &.active {
      color: #333;
    }
    z-index: 1;
  `
};

const VIEW_TOGGLE_OPTIONS: { label: string, value: SceneActiveView}[] = [
  { label: 'ground', value: 'idle' },
  { label: 'top', value: 'topView' },
];

export function TopViewToggle() {
  const activeView = useViewStore(state => state.activeView);
  const setActiveView = useViewStore(state => state.setActiveView);

  const activeIndex = VIEW_TOGGLE_OPTIONS.findIndex(({ value }) => value === activeView);

  return (
    <div className={styles.container}>
      <div className={styles.toggle}>
        <span className={css`
          left: ${BUTTON_SIZE * activeIndex}px;
          
        `}/>
        {VIEW_TOGGLE_OPTIONS.map(({ label, value }) => (
          <div
            className={cx(styles.toggleButton, value === activeView ? 'active' : '')}
            key={value}
            onClick={() => {
              if (value !== activeView) {
                setActiveView(value);
              }
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}