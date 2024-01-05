import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei';

import { Lightings } from './components/Lightings';
import { FloorPlane } from './components/FloorPlane';
import { css } from '@emotion/css';

const styles = {
  canvasContainer: css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `,
};

function App() {
  return (
    <div className={styles.canvasContainer}>
      <Canvas>
        <Lightings />
        <FloorPlane />
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}
export default App;
