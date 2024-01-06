import { checkStatus } from '#/utils/checkStatus';
import { useEffect, useRef, useState } from 'react';
import { USDZLoader } from 'three-usdz-loader';
import * as THREE from 'three';
import { useProductsStore } from '#/store/products';
import { useViewStore } from '#/store/view';
import { useSettingsStore } from '#/store/settings';
import { dispose } from '#/utils/helpers';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

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
  index,
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
  index?: number,
  anchored?: boolean,
  scale?: [number, number, number],
  position?: [number, number, number],
  rotation?: [number, number, number],
  onHover?: () => void,
  onBlur?: () => void,
}) {
  const groupRef = useRef<THREE.Group>();

  const editingColor = useSettingsStore(state => state.editing);
  const editingProduct = useProductsStore(state => state.editingProduct);
  const hoveringProduct = useProductsStore(state => state.hoveringProduct);
  const setEditingProduct = useProductsStore(state => state.setEditingProduct);
  const setHoveringProduct = useProductsStore(state => state.setHoveringProduct);
  const removeAnchoredProduct = useProductsStore(state => state.removeAnchoredProduct);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);

  const hovering = hoveringProduct?.meshId === groupRef.current?.uuid;

  useEffect(() => {
    return () => {
      // dispose product if removed from the scene
      if (groupRef.current) {
        groupRef.current.parent?.remove(groupRef.current);
        dispose(groupRef.current);
      }
    };
  }, []);

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
    if (editingProduct?.id === productId && editingProduct?.meshId === groupRef.current?.uuid) {
      setMeshColor(editingColor);
    } else {
      setMeshColor(color);
    }
  }, [color, editingProduct]);

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.key.toLowerCase() === 'x' && hovering) {
        removeAnchoredProduct(index);
        setEditingProduct(null);
        setHoveringProduct(null);
        setDisableOrbitControls(false);
        onBlur();
      }
    };
    if (hovering) {
      window.addEventListener('keydown', keydownHandler);
    } else {
      window.removeEventListener('keydown', keydownHandler);
    }
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [hovering]);

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
    if (editingProduct?.id !== productId && editingProduct?.meshId !== groupRef.current.uuid) {
      setEditingProduct({ id: productId, meshId: groupRef.current.uuid });
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
    setHoveringProduct({id: productId, meshId: groupRef.current.uuid});
  };

  const pointerLeaveHandler = (e) => {
    if (!anchored) {
      return;
    }
    if (onBlur) {
      onBlur();
    }
    setHoveringProduct({id: productId, meshId: groupRef.current.uuid});
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
