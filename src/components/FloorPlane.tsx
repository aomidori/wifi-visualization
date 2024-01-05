import { useGLTF } from '@react-three/drei';

export function FloorPlane() {
  const gltf = useGLTF('/assets/floor_plan/scan.gltf');
  return (
    <primitive
      object={gltf.scenes[0]} 
      position={[0, 0, -10]}
      scale={[1, 1, 1]}
    />
  );
}
