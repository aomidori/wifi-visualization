import { useEffect, useRef, useState } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';

import { checkStatus } from '#/utils/checkStatus';

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
  const parentRef = useRef<THREE.Group>(new THREE.Group());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadUSDZ(url, name, parentRef.current).then(() => {
      parentRef.current.name = name;
      setLoaded(true);
    });
  }, []);

  return [loaded, parentRef.current];
};
