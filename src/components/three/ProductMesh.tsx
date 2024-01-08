import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { useUSDZ } from './loaders/useUSDZ';

import { useProductsStore } from '#/store/products';
import { useViewStore } from '#/store/view';
import { useSettingsStore } from '#/store/settings';
import { dispose } from '#/utils/helpers';
import { debounce } from 'lodash';


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
  const matRef = useRef<THREE.MeshPhysicalMaterial>(new THREE.MeshPhysicalMaterial());
  const [loaded, usdz] = useUSDZ(productModelUrl, productId);

  const editingColor = useSettingsStore(state => state.editing);
  const editingProduct = useProductsStore(state => state.editingProduct);
  const hoveringProduct = useProductsStore(state => state.hoveringProduct);
  const setEditingProduct = useProductsStore(state => state.setEditingProduct);
  const setHoveringProduct = useProductsStore(state => state.setHoveringProduct);
  const updateAnchoredProduct = useProductsStore(state => state.updateAnchoredProduct);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);
  const setDisableVisualization = useViewStore(state => state.setDisableVisualization);

  useFrame(() => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.02;
    }
  });

  useEffect(() => {
    return () => {
      if (groupRef.current) {
        dispose(groupRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    updateAnchoredProduct(index, { meshId: groupRef.current.userData.meshId });
    groupRef.current?.children.forEach((child: THREE.Mesh) => {
      if (child.isMesh) {
        (child.material as THREE.Material).dispose();
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
      if (color) {
        setMeshColor(color);
      }
    }
  }, [loaded, color, editingProduct]);

  useEffect(() => {
    const hovering = hoveringProduct?.meshId === groupRef.current?.userData.meshId;
    const removeCurrentProduct = () => {
      groupRef.current.parent?.remove(groupRef.current);
      dispose(groupRef.current);
      updateAnchoredProduct(index, { removed: true });
    };
    const keydownHandler = (e) => {
      if (e.key.toLowerCase() === 'x' && hovering) {
        removeCurrentProduct();
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
  }, [hoveringProduct]);

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
      setDisableVisualization(true);
    }
  };

  const pointerUpHandler = (e) => {
    if (!anchored) {
      return;
    }
    setEditingProduct(null);
    setDisableOrbitControls(false);
    setDisableVisualization(false);
    updateAnchoredProduct(index, { position: groupRef.current.position });
  };

  const pointerEnterHandler = debounce((e) => {
    if (!anchored) {
      return;
    }
    if (onHover) {
      onHover();
    }
    setHoveringProduct({id: productId, meshId: groupRef.current.userData.meshId});
  }, 50);

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
