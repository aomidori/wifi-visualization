import { checkStatus } from '#/utils/checkStatus';
import { useEffect, useRef } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';

// cached blobs
const cached = {};

const loadUSDZ = async (url: string, name: string, group): Promise<void> => {
  try {
    let blob: Blob;
    if (cached[name]) {
      blob = cached[name];
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

export function ProductMesh({
  productModelUrl,
  name,
  color,
  scale = [1, 1, 1],
  position= [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  productModelUrl: string,
  color?: string,
  name?: string,
  scale?: [number, number, number],
  position?: [number, number, number],
  rotation?: [number, number, number],
}) {
  const groupRef = useRef<THREE.Group>();

  useEffect(() => {
    if (productModelUrl) {
      const meshGroup = groupRef.current;
      loadUSDZ(productModelUrl, name, meshGroup).then(() => {
        meshGroup.name = name;
        meshGroup.children.forEach((child: THREE.Mesh) => {
          if (color) {
            child.material['color']?.set(color || 0x00ff00).lerp(new THREE.Color(0x00eeff), 0.5);
          }
        });
      });
    }
  }, [productModelUrl]);

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}
