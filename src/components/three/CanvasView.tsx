import { Canvas, useThree } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';
import { css } from '@emotion/css';

import { Lightings } from '#/components/three/Lightings';
import { FloorPlane, FloorPlaneBaseGrid } from '#/components/three/FloorPlane';
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
  const activeView = useViewStore(state => state.activeView);
  const { camera } = useThree();

  if (activeView === 'topView') {
    camera.position.set(0, 20, 20);
    camera.rotation.set(-Math.PI / 2, 0, 0);
  } else {
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
  }

  return (
    <>
      <Lightings />
      <FloorPlane />
      <FloorPlaneBaseGrid />
      <OrbitControls />
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
