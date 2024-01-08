import { useEffect, useRef, useState } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { USDZInstance } from 'three-usdz-loader/lib/USDZInstance';

import { checkStatus } from '#/utils/checkStatus';
import { useViewStore } from '#/store/view';

// cached models
const cached = {};

const loadUSDZ = async (url: string, name: string, group): Promise<USDZInstance> => {
  try {
    const response = await fetch(url).then(checkStatus);
    const blob = await response.blob();
    const loader = new USDZLoader();
    return loader.loadFile(new File([blob], `${name}.usdz`), group);
  } catch (error) {
    console.error('Failed to load USDZ', error);
  }
};

export const useUSDZ = (url: string, name: string): [boolean, THREE.Group] => {
  // TODO: usdz loader that supports mobile view.
  const usdzSupported = useViewStore(state => !state.isMobileView);

  const parentRef = useRef<THREE.Group>(new THREE.Group());
  const [loaded, setLoaded] = useState(false);

  const assignUniqueMeshId = (group: THREE.Group) => {
    group.userData.meshId = `${group.uuid}_${String(new Date().getTime())}`;
  };

  useEffect(() => {
    if (cached[name]) {
      parentRef.current.copy(cached[name]);
      parentRef.current.name = name;
      assignUniqueMeshId(parentRef.current);
      setLoaded(true);
      return;
    }
    if (!usdzSupported) {
      const loader = new GLTFLoader();
      loader.load(url.replace('usdz', 'gltf'), gltf => {
        cached[name] = gltf.scene.clone();
        parentRef.current = gltf.scene;
        parentRef.current.name = name;
        assignUniqueMeshId(parentRef.current);
        setLoaded(true);
      });
      return;  
    }
    loadUSDZ(url, name, parentRef.current).then(() => {
      cached[name] = parentRef.current.clone();
      parentRef.current.name = name;
      assignUniqueMeshId(parentRef.current);
      setLoaded(true);
    });
  }, []);

  return [loaded, parentRef.current];
};
