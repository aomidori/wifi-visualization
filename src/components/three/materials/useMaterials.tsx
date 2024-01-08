import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useSettingsStore } from '#/store/settings';
import { useProductsStore } from '#/store/products';

const getMaterials = () => ({
  activeMat: new THREE.MeshStandardMaterial({ color: 0x98CAE2 }),
  inactiveMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3 }),
  floorMat: new THREE.MeshStandardMaterial({ color: 0xc1c1c1 }),
  ceilingMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3, transparent: true, opacity: 0.3 }),
  editingMat: new THREE.MeshStandardMaterial({ color: 0x98CAE2 }),
});

type Materials = ReturnType<typeof getMaterials>;
export type MaterialName = keyof Materials;

export const useMaterials = (): [
  Materials,
  (name: MaterialName, hex: string) => void,
  () => void,
] => {
  const materialsRef = useRef(getMaterials());
  const accent = useSettingsStore(state => state.accent);
  const editing = useSettingsStore(state => state.editing);
  const hoveringProduct = useProductsStore(state => state.hoveringProduct);

  useEffect(() => {
    setMaterialColor('activeMat', accent);
    materialsRef.current.activeMat.color.set(accent);
  }, [accent]);

  useEffect(() => {
    if (editing) {
      setMaterialColor('editingMat', editing);
      setMaterialColor('floorMat', accent);
    } else {
      setMaterialColor('floorMat', '#c1c1c1');
    }
  }, [editing]);

  useEffect(() => {
    if (hoveringProduct) {
      setMaterialColor('floorMat', accent);
    } else {
      setMaterialColor('floorMat', '#c1c1c1');
    }
  }, [hoveringProduct]);

  const setMaterialColor = (name: MaterialName, hex: string) => {
    materialsRef.current[name].color.set(hex);
  };

  const resetMaterials = () => {
    setMaterialColor('activeMat', accent);
    setMaterialColor('inactiveMat', '#e3e3e3');
    setMaterialColor('floorMat', '#c1c1c1');
    setMaterialColor('ceilingMat', '#e3e3e3');
    setMaterialColor('editingMat', editing);
  };
  
  return [
    materialsRef.current,
    setMaterialColor,
    resetMaterials,
  ];
};