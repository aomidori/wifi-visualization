import { checkStatus } from '#/utils/checkStatus';
import { useEffect, useRef } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';

const loadUSDZ = async (url: string, name: string, group): Promise<void> => {
  try {
    const response = await fetch(url).then(checkStatus);
    const filename = `${name}.usdz`;
    const blob = await response.blob();
    
    const loader = new USDZLoader();
    await loader.loadFile(new File([blob], filename), group);
  } catch (error) {
    console.error('Failed to load USDZ', error);
  }
};

export function ProductMesh({
  productModelUrl,
  name,
  scale = [1, 1, 1],
  position= [0, 0, 0],
}: {
  productModelUrl: string,
  name?: string,
  scale?: [number, number, number],
  position?: [number, number, number],
}) {
  const groupRef = useRef<THREE.Group>();

  useEffect(() => {
    if (productModelUrl) {
      const meshGroup = groupRef.current;
      loadUSDZ(productModelUrl, name, meshGroup).then(() => {
        meshGroup.name = name;
        meshGroup.children.forEach((child: THREE.Mesh) => {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            child.material.color.set(0x00ff00);
            child.material.needsUpdate = true;
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
    />
  );
}