import { useProductsStore } from '#/store/products';
import { usetSettingsStore } from '#/store/settings';
import { useGLTF } from '@react-three/drei';
import { Vector3, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ProductMesh } from './ProductMesh';

const FLOOR_PLANE_POSITION: Vector3 = [0, 0, 0];
const FLOOR_HEIGHT = 3;

const materials = {
  activeMat: new THREE.MeshStandardMaterial({ color: 0x98CAE2 }),
  inactiveMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3 }),
  floorMat: new THREE.MeshStandardMaterial({ color: 0xc1c1c1 }),
};

// floor plane 
export function FloorPlane() {
  const gltf = useGLTF('/assets/models/floor_plan/scan.gltf');
  const accent = usetSettingsStore(state => state.accent);
  const activeProductData = useProductsStore(state => state.getActiveProductData());

  useEffect(() => {
    materials.activeMat.color.set(accent);
  }, [accent]);

  useEffect(() => {
    console.log(gltf);
    gltf.scene?.traverse((child) => {
      if (child.name === 'CeilingNode') {
        child.visible = false;
      }
      if (child.name.includes('Floor') && child instanceof THREE.Mesh) {
        child.material = materials.floorMat;
      }
    });
  }, [gltf]);

  const pointerMoveHandler = (e) => {
    const intersection = e.object;
    // reset materials of inactive meshes
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name !== intersection.name) {
        child.material = child.name.includes('Floor') ? materials.floorMat : materials.inactiveMat;
      }
    });
    // highlight active mesh
    if (intersection && intersection instanceof THREE.Mesh) {
      intersection.material = materials.activeMat;
    }
  };

  const resetMaterials = () => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.name.includes('Floor') ? materials.floorMat : materials.inactiveMat;
      }
    });
  };

  return gltf.scene ? (
    <group>
      <primitive
        object={gltf.scene} 
        position={FLOOR_PLANE_POSITION}
        scale={[1, 1, 1]}
        onPointerMove={pointerMoveHandler}
        onPointerOut={resetMaterials}
      />
      {
        activeProductData && (
          <ProductMesh
            productModelUrl={activeProductData.modelUrl}
            name={activeProductData.name}
            position={[0, 0, FLOOR_HEIGHT]}
          />
        )
      }
    </group>
  ) : null;
}

// floor plane ground helper grid
export function FloorPlaneBaseGrid() {
  return (
    <gridHelper
      args={[80, 80 * 2, 0xe3e3e3, 0xe3e3e3]}
      position={FLOOR_PLANE_POSITION}
    />
  );
}