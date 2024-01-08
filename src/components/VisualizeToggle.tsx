import { css } from '@emotion/css';

import { ToggleButtons } from './elements/ToggleButtons';

import { useViewStore } from '#/store/view';
import { useProductsStore } from '#/store/products';

const styles = {
  container: css`
    position: absolute;
    bottom: 24px;
    left: 24px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    user-select: none;
    label {
      margin: 12px 0 0 0;
      font-size: 12px;
    }
  `,
};

export function VisualizeToggle() {
  const showVisualization = useViewStore(state => state.showVisualization);
  const setShowVisualization = useViewStore(state => state.setShowVisualization);

  const anchoredProducts = useProductsStore(state => state.anchoredProducts);

  if (!anchoredProducts.length) return null;
  
  return (
    <div className={styles.container}>
      <ToggleButtons
        options={[
          { label: 'on', value: 'on' },
          { label: 'off', value: 'off' },
        ]}
        selected={showVisualization ? 'on' : 'off'}
        onChange={() => setShowVisualization(!showVisualization)}
        buttonSize="small"
      />
      <label>{`Turn ${showVisualization ? 'off' : 'on'} Wi-Fi visualization`}</label>
    </div>
  );
}
