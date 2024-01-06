import { checkStatus } from '#/utils/checkStatus';
import { useEffect, useRef, useState } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';
import { useProductsStore } from '#/store/products';
import { useViewStore } from '#/store/view';

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
  productId,
  color,
  anchored,
  scale = [1, 1, 1],
  position= [0, 0, 0],
  rotation = [0, 0, 0],
  onHover,
  onBlur,
}: {
  productModelUrl: string,
  productId?: string,
  color?: string,
  anchored?: boolean,
  scale?: [number, number, number],
  position?: [number, number, number],
  rotation?: [number, number, number],
  onHover?: () => void,
  onBlur?: () => void,
}) {
  const groupRef = useRef<THREE.Group>();

  const editingProduct = useProductsStore(state => state.editingProduct);
  const setEditingProduct = useProductsStore(state => state.setEditingProduct);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);

  useEffect(() => {
    if (productModelUrl) {
      const meshGroup = groupRef.current;
      loadUSDZ(productModelUrl, productId, meshGroup).then(() => {
        meshGroup.name = productId;
        setMeshColor(color);
      });
    }
  }, [productModelUrl]);

  useEffect(() => {
    setMeshColor(color);
  }, [color]);

  const setMeshColor = (color: string) => {
    if (!color) {
      return;
    }
    const meshGroup = groupRef.current;
    meshGroup?.children.forEach((child: THREE.Mesh) => {
      child.material['color']?.set(color);
    });
  };

  const pointerDownHandler = (e) => {
    if (!anchored) {
      return;
    }
    if (editingProduct !== productId) {
      setEditingProduct(productId);
      setDisableOrbitControls(true);
    }
  };

  const pointerUpHandler = (e) => {
    if (!anchored) {
      return;
    }
    setEditingProduct(null);
    setDisableOrbitControls(false);
  };

  const pointerEnterHandler = (e) => {
    if (!anchored) {
      return;
    }
    if (onHover) {
      onHover();
    }
  };

  const pointerLeaveHandler = (e) => {
    if (!anchored) {
      return;
    }
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <group
      ref={groupRef}
      scale={scale}
      position={position}
      rotation={rotation}
      onPointerEnter={pointerEnterHandler}
      onPointerLeave={pointerLeaveHandler}
      onPointerDown={pointerDownHandler}
      onPointerUp={pointerUpHandler}
    />
  );
}
