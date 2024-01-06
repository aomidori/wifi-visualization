import * as THREE from 'three';

export const dispose = (object: THREE.Group | THREE.Object3D | THREE.Scene) => {
  object.traverse((node: THREE.Mesh) => {
    if (node.isMesh) {
      node.geometry?.dispose();
      if (node.material instanceof THREE.Material) {
        node.material.dispose();
      } else if (node.material instanceof Array){
        for (const material of node.material) {
          material.dispose();
        }
      }
    }
  });
};