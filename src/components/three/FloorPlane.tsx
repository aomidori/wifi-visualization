import { useGLTF } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';

const FLOOR_PLANE_POSITION: Vector3 = [0, 0, 0];

const hideCeiling = (scene: THREE.Group<THREE.Object3DEventMap>) => {
  scene?.traverse((child) => {
    if (child.name === 'CeilingNode') {
      child.visible = false;
    }
  });
};

export function FloorPlane() {
  const gltf = useGLTF('/assets/models/floor_plan/scan.gltf', true);

  const scene = gltf.scene || gltf.scenes[0];
  hideCeiling(scene);

  return (
    <primitive
      object={scene} 
      position={FLOOR_PLANE_POSITION}
      scale={[1, 1, 1]}
    />
  );
}

export function FloorPlaneBaseGrid() {
  return (
    <gridHelper
      args={[40, 80, 0xe3e3e3, 0xe3e3e3]}
      position={FLOOR_PLANE_POSITION}
    />
  );
}