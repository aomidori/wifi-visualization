import { useProductsStore } from '#/store/products';
import { usetSettingsStore } from '#/store/settings';
import { Text, useGLTF } from '@react-three/drei';
import { Vector3, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductMesh } from './ProductMesh';
import { AnchorPoint } from './AnchorPoint';

const FLOOR_PLANE_POSITION: Vector3 = [0, 0, 0];
const FLOOR_HEIGHT = 3;

const materials = {
  activeMat: new THREE.MeshStandardMaterial({ color: 0x98CAE2 }),
  inactiveMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3 }),
  floorMat: new THREE.MeshStandardMaterial({ color: 0xc1c1c1 }),
  ceilingMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3, transparent: true, opacity: 0.2 }),
};

// floor plane 
export function FloorPlane() {
  const gltf = useGLTF('/assets/models/floor_plan/scan.gltf');
  const accent = usetSettingsStore(state => state.accent);
  const products = useProductsStore(state => state.products);
  const activeProduct = useProductsStore(state => state.activeProduct);
  const getActiveProductData = useProductsStore(state => state.getActiveProductData);
  const anchoredProducts = useProductsStore(state => state.anchoredProducts);
  const addAnchoredProduct = useProductsStore(state => state.addAnchoredProduct);

  const [anchorPoint, setAnchorPoint] = useState<THREE.Vector3>();
  const [productFloatHeight, setProductFloatHeight] = useState<number>(4);

  useEffect(() => {
    materials.activeMat.color.set(accent);
  }, [accent]);

  useEffect(() => {
    console.log(gltf);
    gltf.scene?.traverse((child) => {
      if (child.name === 'CeilingNode') {
        child.visible = false;
      }
      if (child.name.startsWith('FloorNode') && child instanceof THREE.Mesh) {
        child.material = materials.floorMat;
      }
    });
  }, [gltf]);

  useEffect(() => {
    const ceiling = gltf.scene?.getObjectByName('CeilingNode');
    if (activeProduct) {
      ceiling.visible = true;
      ceiling.children.forEach((child: THREE.Mesh) => {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material = materials.ceilingMat;
          child.material.needsUpdate = true;
        }
      });
    } else {
      ceiling.visible = false;
    }
  }, [activeProduct]);

  useFrame(() => {
    setProductFloatHeight(Math.sin(Date.now() * 0.002) * 0.5 + 4);
  });

  const pointerMoveHandler = (e) => {

    const intersection = e.object;

    const highlightGround = () => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.startsWith('FloorNode')) {
          child.material = materials.activeMat;
        }
      });
    };
    // reset materials of inactive meshes
    gltf.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.name !== intersection.name &&
        !child.name.startsWith('CeilingNode')) {
        child.material = child.name.startsWith('FloorNode') ?
          materials.floorMat : materials.inactiveMat;
      }
    });
    // find ceiling intersection
    const intersectionOnCeiling = e.intersections.find(o => o.object.name.startsWith('CeilingNode'));
    if (intersectionOnCeiling) {
      setAnchorPoint(intersectionOnCeiling.point);
      highlightGround();
    }
  };

  const resetMaterials = () => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.name.startsWith('FloorNode')
          ? materials.floorMat : child.name.startsWith('CeilingNode')
            ? materials.ceilingMat: materials.inactiveMat;
      }
    });
  };

  const activeProductData = getActiveProductData();

  return gltf.scene ? (
    <>
      <primitive
        object={gltf.scene} 
        position={FLOOR_PLANE_POSITION}
        scale={[1, 1, 1]}
        onPointerMove={pointerMoveHandler}
        onPointerOut={resetMaterials}
      />
      {  // Product
        !!activeProductData && (
          <ProductMesh
            productModelUrl={activeProductData.modelUrl}
            name={activeProductData.id}
            scale={[0.1, 0.1, 0.1]}
            position={anchorPoint ?
              [anchorPoint.x, anchorPoint.y + productFloatHeight, anchorPoint.z] :
              [0, FLOOR_HEIGHT + productFloatHeight, 0]}
          />
        )
      }
      {
        // Product Anchor Point on Ceiling
        !!anchorPoint && (
          <AnchorPoint
            position={[anchorPoint.x, anchorPoint.y, anchorPoint.z]}
            onPointerDown={() => {
              if (activeProductData) {
                const { x, y, z } = anchorPoint;
                addAnchoredProduct(activeProductData.id, anchorPoint);
                useProductsStore.getState().setActiveProduct(null);
              }
            }}
          />
        )
      }
      {
        // Instruction Text
        !!anchorPoint && !activeProductData && (
          <Text
            scale={[0.8, 0.8, 0.8]}
            position={[anchorPoint.x, anchorPoint.y + 3, anchorPoint.z]}
            rotation={[Math.PI, Math.PI, Math.PI]}
          >
            choose a product to place on the ceiling
          </Text>
        )
      }
      {
        // Anchored Products
        anchoredProducts?.map(({productId, position}, index) => (
          <ProductMesh
            key={index}
            productModelUrl={products.find(p => p.id === productId).modelUrl}
            name={productId}
            scale={[0.05, 0.05, 0.05]}
            rotation={[Math.PI / 2, 0, 0]}
            position={position.toArray()}
          />
        ))
      }
    </>
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