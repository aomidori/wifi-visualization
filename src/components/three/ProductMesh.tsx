import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useProductsStore } from '#/store/products';
import { useViewStore } from '#/store/view';
import { useSettingsStore } from '#/store/settings';
import { dispose } from '#/utils/helpers';

import { useUSDZ } from './loaders/useUSDZ';
import { useFrame } from '@react-three/fiber';

interface Props {
  productModelUrl: string;
  productId?: string;
  color?: string;
  index?: number;
  anchored?: boolean;
  scale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
  onHover?: () => void;
  onBlur?: () => void;
}

export function ProductMesh({
  productModelUrl,
  productId,
  index,
  color,
  anchored,
  scale = [1, 1, 1],
  position= [0, 0, 0],
  rotation = [0, 0, 0],
  autoRotate,
  onHover,
  onBlur,
}: Props) {
  const groupRef = useRef<THREE.Group>();
  const matRef = useRef<THREE.MeshBasicMaterial>(new THREE.MeshBasicMaterial());
  const [loaded, usdz] = useUSDZ(productModelUrl, productId);

  const editingColor = useSettingsStore(state => state.editing);
  const editingProduct = useProductsStore(state => state.editingProduct);
  const hoveringProduct = useProductsStore(state => state.hoveringProduct);
  const setEditingProduct = useProductsStore(state => state.setEditingProduct);
  const setHoveringProduct = useProductsStore(state => state.setHoveringProduct);
  const removeAnchoredProduct = useProductsStore(state => state.removeAnchoredProduct);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);

  const hovering = hoveringProduct?.meshId === groupRef.current?.userData.meshId;

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.02;
    }
  });

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
    if (!loaded) {
      return;
    }
    groupRef.current?.children.forEach((child: THREE.Mesh) => {
      if (child.isMesh) {
        child.material = matRef.current;
      }
    });
  }, [loaded]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (editingProduct?.id === productId && editingProduct?.meshId === groupRef.current?.userData.meshId) {
      setMeshColor(editingColor);
    } else {
      setMeshColor(color);
    }
  }, [loaded, color, editingProduct]);

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
      child?.material['color']?.set(color);
    });
  };

  const pointerDownHandler = (e) => {
    if (!anchored) {
      return;
    }
    if (editingProduct?.id !== productId && editingProduct?.meshId !== groupRef.current.userData.meshId) {
      setEditingProduct({ id: productId, meshId: groupRef.current.userData.meshId });
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
    setHoveringProduct({id: productId, meshId: groupRef.current.userData.meshId});
  };

  const pointerLeaveHandler = (e) => {
    if (!anchored) {
      return;
    }
    if (onBlur) {
      onBlur();
    }
    setHoveringProduct({id: productId, meshId: groupRef.current.userData.meshId});
  };

  if (!loaded) {
    return null;
  }
  
  return (
    <primitive
      ref={groupRef}
      object={usdz}
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
