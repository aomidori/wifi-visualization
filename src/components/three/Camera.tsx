import { useFrame, useThree } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useViewStore } from '#/store/view';

export const cameraPositions = {
  topView: { x: 0, y: 30, z: 0 },
  initial: { x: 0, y: 10, z: 20 },
};

const eyeLevelHeight = 2;

type Direction = 'up' | 'down' | 'left' | 'right';
const NAVIGATION_KEYS: Record<Direction, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

export function Camera() {
  const activeView = useViewStore(state => state.activeView);
  const setActiveView = useViewStore(state => state.setActiveView);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);
  const cameraLastState = useViewStore(state => state.cameraLastState);
  const setCameraLastState = useViewStore(state => state.setCameraLastState);
  const { camera } = useThree();

  const [direction, setDirection] = useState<Direction>(null);

  useFrame(() => {
    TWEEN.update();
    updateCamera();
  });

  // switch to eye level view when moving around
  const goToEyeLevelView = (resetRotationOnAxisX?: boolean) => {
    camera.position.y = eyeLevelHeight;
    if (resetRotationOnAxisX) {
      camera.rotation.x = 0;
      camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    }
  }

  const updateCamera = () => {
    if (!direction || activeView !== 'navigationView') return;
    const acceleration = 0.5;
    const speed = 0.2;
    const rotationSpeed = 0.08;
    goToEyeLevelView();
    
    const worldQ = camera.getWorldQuaternion(new THREE.Quaternion());
    const rotationOnAxisY = new THREE.Euler().setFromQuaternion(worldQ, 'YXZ').y;
    switch (direction) {
      case 'up':
        camera.position.z -= speed * acceleration * Math.sin(Math.PI / 2 + rotationOnAxisY);
        camera.position.x += speed * acceleration * Math.cos(Math.PI / 2 + rotationOnAxisY);
        break;
      case 'down':
        camera.position.z += speed * acceleration * Math.sin(Math.PI / 2 + rotationOnAxisY);
        camera.position.x -= speed * acceleration * Math.cos(Math.PI / 2 + rotationOnAxisY);
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

    // keyboard event listeners;
    let keydownStart = 0;
    let keydownSinceStart = 0;
    let recordingKeydownSinceStart = false;

    const recordKeydownSinceStart = () => {
      keydownSinceStart = Date.now() - keydownStart;
      requestAnimationFrame(recordKeydownSinceStart);
    }

    const keydownHandler = (event: KeyboardEvent) => {
      recordKeydownSinceStart();
      Object.keys(NAVIGATION_KEYS).forEach((key: Direction) => {
        if (!keydownStart) {
          keydownStart = Date.now();
        }
        if (!recordingKeydownSinceStart) {
          recordKeydownSinceStart();
        }
        // prevent too short keydown
        if (keydownSinceStart < 10) return;
        if (event.key === NAVIGATION_KEYS[key]) {
          if (activeView !== 'navigationView') {
            setActiveView('navigationView');
          } else {
            setDirection(key);
            setDisableOrbitControls(true);
          }
        }
      })
    };
    const keyupHandler = () => {
      keydownStart = 0;
      keydownSinceStart = 0;
      recordingKeydownSinceStart = false;
      setDirection(null);
    };
    const pointerDonwHandler = () => {
      setDisableOrbitControls(false);
    }
    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
    window.addEventListener('pointerdown', pointerDonwHandler);

    // camera state handler
    if (activeView === 'topView') {
      // top view
      setCameraLastState({
        position: new THREE.Vector3().copy(camera.position),
        quaternion: new THREE.Quaternion().copy(camera.quaternion),
        worldQuaternion: new THREE.Quaternion().copy(camera.getWorldQuaternion(new THREE.Quaternion())),
      });
      new TWEEN.Tween(camera.position)
        .to(cameraPositions.topView, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onStart(() => setDisableOrbitControls(true))
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .onComplete(() => setDisableOrbitControls(false))
        .start();
    } else if (activeView === 'navigationView') {
      // ground navigation view activated
      goToEyeLevelView(true);
      camera.up = new THREE.Vector3(0, 1, 0);
      setDisableOrbitControls(true);
    } else {
      // ground view navigation view inactive
      new TWEEN.Tween(camera.position)
        .to(cameraLastState?.position || cameraPositions.initial, 1200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onStart(() => setDisableOrbitControls(true))
        .onUpdate(() => camera.lookAt(0, 0, 0))
        .onComplete(() => setDisableOrbitControls(false))
        .start();
      if (cameraLastState) {
        camera.quaternion.copy(cameraLastState.quaternion);
        camera.setRotationFromQuaternion(cameraLastState.worldQuaternion);
      }
    }

    return () => {
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('keyup', keyupHandler);
      window.removeEventListener('pointerdown', pointerDonwHandler);
    };
  }, [activeView]);

  return null;
}