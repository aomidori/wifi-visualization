import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { css } from '@emotion/css';

import { Lightings } from '#/components/three/Lightings';
import { FloorPlane, FloorPlaneBaseGrid } from '#/components/three/FloorPlane';
import { Camera } from './Camera';
import { useViewStore } from '#/store/view';

const styles = {
  canvasContainer: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `,
};

function Scene() {
  const isOrbitControlsDisabled = useViewStore(state => state.isOrbitControlsDisabled);
  return (
    <>
      <Lightings />
      <FloorPlane />
      <FloorPlaneBaseGrid />
      <OrbitControls
        enabled={!isOrbitControlsDisabled}
        maxPolarAngle={Math.PI / 2}
      />
      <Camera />
      <Stats />
    </>
  );
}

export function CanvasView() {
  return (
    <div className={styles.canvasContainer}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
