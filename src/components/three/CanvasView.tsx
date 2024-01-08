import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { css } from '@emotion/css';
import { useEffect } from 'react';

import { Lightings } from '#/components/three/Lightings';
import { Camera } from '#/components/three/Camera';
import { FloorPlane, FloorPlaneBaseGrid } from '#/components/three/FloorPlane';
import { GroundVisualization } from '#/components/three/GroundVisualization';
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
  const { gl } = useThree();

  useEffect(() => {
    const resizeHandler = () => {
      gl.setSize(window.innerWidth, window.innerHeight);
      gl.setPixelRatio(window.devicePixelRatio);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <>
      <Lightings />
      <FloorPlane />
      <FloorPlaneBaseGrid />
      <GroundVisualization />
      <OrbitControls
        enabled={!isOrbitControlsDisabled}
        maxPolarAngle={Math.PI / 2}
      />
      <Camera />
      {/* <Stats /> */}
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
