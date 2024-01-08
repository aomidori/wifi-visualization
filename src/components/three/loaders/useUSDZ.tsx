import { useEffect, useRef, useState } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';

import { checkStatus } from '#/utils/checkStatus';
import { useViewStore } from '#/store/view';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// cached blobs
const cachedBlobs = {};

const loadUSDZ = async (url: string, name: string, group): Promise<void> => {
  try {
    let blob: Blob;
    if (cachedBlobs[name]) {
      blob = cachedBlobs[name];
    } else {
      const response = await fetch(url).then(checkStatus);
      blob = await response.blob();
    }
    const loader = new USDZLoader();
    await loader.loadFile(new File([blob], `${name}.usdz`), group);
  } catch (error) {
    console.error('Failed to load USDZ', error);
  }
};

export const useUSDZ = (url: string, name: string): [boolean, THREE.Group] => {
  // TODO: usdz loader that supports mobile view.
  const usdzSupported = useViewStore(state => !state.isMobileView);

  const parentRef = useRef<THREE.Group>(new THREE.Group());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!usdzSupported) {
      const loader = new GLTFLoader();
      loader.load(url.replace('usdz', 'gltf'), gltf => {
        parentRef.current = gltf.scene;
        console.log('gltf', parentRef.current);
        setLoaded(true);
      });
      return;  
    }
    loadUSDZ(url, name, parentRef.current).then(() => {
      parentRef.current.name = name;
      setLoaded(true);
    });
  }, []);

  return [loaded, parentRef.current];
};
