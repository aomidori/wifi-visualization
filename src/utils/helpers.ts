import * as THREE from 'three';

export const dispose = (object: THREE.Group | THREE.Object3D | THREE.Scene) => {
  object?.traverse((node: THREE.Mesh) => {
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

export const lightenHexColor = (hex: string, percent: number) => {
  percent = Math.min(100, Math.max(0, percent));
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  r = Math.round(r + (255 - r) * percent);
  g = Math.round(g + (255 - g) * percent);
  b = Math.round(b + (255 - b) * percent);
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};