import { checkStatus } from '#/utils/checkStatus';
import { Vector3 } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { USDZLoader } from 'three-usdz-loader';

const loadUSDZ = async (url: string, name: string, group) => {
  const response = await fetch(url).then(checkStatus);
  const filename = `${name}.usdz`;
  const blob = await response.blob();
  
  const loader = new USDZLoader();
  loader.loadFile(new File([blob], filename), group);
};

export function ProductMesh({
  productModelUrl,
  name,
  scale,
  position,
}: {
  productModelUrl: string,
  name?: string,
  scale?: Vector3,
  position?: Vector3,
}) {
  const groupRef = useRef<THREE.Group>();

  useEffect(() => {
    if (parent && productModelUrl) {
      loadUSDZ(productModelUrl, name, groupRef.current);
    }
  }, [parent, productModelUrl]);

  return (
    <group ref={groupRef}/>
  );
}