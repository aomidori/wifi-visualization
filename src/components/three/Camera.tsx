import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import { useEffect } from 'react';
import * as THREE from 'three';

import { useViewStore } from '#/store/view';

export const cameraPositions = {
  topView: { x: 0, y: 30, z: 0 },
  initial: { x: 0, y: 10, z: 20 },
};

export function Camera() {
  const activeView = useViewStore(state => state.activeView);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);
  const setCameraLastPosition = useViewStore(state => state.setCameraLastPosition);
  const { camera } = useThree();

  useFrame(() => {
    TWEEN.update();
  });

  useEffect(() => {
    if (!camera) return;
    if (activeView === 'topView') {
      setCameraLastPosition(new THREE.Vector3().copy(camera.position));
      new TWEEN.Tween(camera.position)
        .to(cameraPositions.topView, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onStart(() => setDisableOrbitControls(true))
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .onComplete(() => setDisableOrbitControls(false))
        .start();
    } else {
      new TWEEN.Tween(camera.position)
        .to(cameraPositions.initial, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onStart(() => setDisableOrbitControls(true))
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .onComplete(() => setDisableOrbitControls(false))
        .start();
    }
  }, [activeView, camera]);

  return null;
}