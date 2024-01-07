import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useViewStore } from '#/store/view';

export const cameraPositions = {
  topView: { x: 0, y: 30, z: 0 },
  initial: { x: 0, y: 10, z: 20 },
};

type Direction = 'up' | 'down' | 'left' | 'right';
const NAVIGATION_KEYS: Record<Direction, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

export function Camera() {
  const activeView = useViewStore(state => state.activeView);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);
  const cameraLastPosition = useViewStore(state => state.cameraLastPosition);
  const setCameraLastPosition = useViewStore(state => state.setCameraLastPosition);
  const { camera } = useThree();

  const [direction, setDirection] = useState<Direction>(null);

  useFrame(() => {
    TWEEN.update();
    updateCamera();
  });

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      Object.keys(NAVIGATION_KEYS).forEach((key: Direction) => {
        if (event.key === NAVIGATION_KEYS[key]) {
          setDirection(key);
        }
      })
    };
    const keyupHandler = () => {
      setDirection(null);
    };
    const pointerDonwHandler = () => {
      setDisableOrbitControls(false);
    }
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
    window.addEventListener('pointerdown', pointerDonwHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('keyup', keyupHandler);
      window.removeEventListener('pointerdown', pointerDonwHandler);
    };
  },[]);

  useEffect(() => {
    if (direction) {
      goToEyeLevelView();
      camera.up = new THREE.Vector3(0, 1, 0);
    }
  }, [direction]);

  // switch to eye level view when moving around
  const goToEyeLevelView = () => {
    const eyeLevelHeight = 1.7;
    camera.position.y = eyeLevelHeight;
  }

  const updateCamera = async() => {
    const acceleration = 0.5;
    const speed = 0.7;
    const rotationSpeed = 0.08;
    if (!direction) return;
    setDisableOrbitControls(!!direction);
    goToEyeLevelView();
    
    const worldQ = camera.getWorldQuaternion(new THREE.Quaternion());
    const rotationOnWorldAxisY = new THREE.Euler().setFromQuaternion(worldQ, 'YXZ').y;
    switch (direction) {
      case 'up':
        camera.position.z -= speed * acceleration * Math.sin(Math.PI / 2 + rotationOnWorldAxisY);
        camera.position.x += speed * acceleration * Math.cos(Math.PI / 2 + rotationOnWorldAxisY);
        break;
      case 'down':
        camera.position.z += speed * acceleration * Math.sin(Math.PI / 2 + rotationOnWorldAxisY);
        camera.position.x -= speed * acceleration * Math.cos(Math.PI / 2 + rotationOnWorldAxisY);
        break;
      case 'left':
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotationSpeed);
        break;
      case 'right':
        camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -rotationSpeed);
        break;
      default:
        break;
    }
    camera.updateMatrixWorld();
  };

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
        .to(cameraLastPosition || cameraPositions.initial, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onStart(() => setDisableOrbitControls(true))
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .onComplete(() => setDisableOrbitControls(false))
        .start();
    }
  }, [activeView, camera]);

  return null;
}