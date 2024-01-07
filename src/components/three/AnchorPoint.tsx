import { useSettingsStore } from '#/store/settings';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  color?: number;
  size?: number;
  onPointerDown?: (event: THREE.Event) => void;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3  u_inner_color;
  uniform vec3  u_stroke_color;
  uniform float u_radius;
  uniform vec3  u_resolution;

  varying vec2  vUv;

  void main() {
    float d = distance(vUv, vec2(u_resolution.x * 0.5, u_resolution.y * 0.5));
    if (d <= u_radius) {
      gl_FragColor = vec4(u_inner_color, 1.0);
    } else if (d > u_radius && d < 0.5) {
      gl_FragColor = vec4(u_stroke_color, 1.0);
    } else {
      discard;
    }
  }
`;

export function AnchorPoint({
  position,
  color,
  size = 0.8,
  onPointerDown,
}: Props) {
  const geoRef = useRef<THREE.PlaneGeometry>();
  const matRef = useRef<THREE.ShaderMaterial>();
  const accent = useSettingsStore(state => state.accent);

  useEffect(() => {
    geoRef.current?.rotateX(-Math.PI / 2);

    return () => {
      geoRef.current?.dispose();
      matRef.current?.dispose();
    };
  }, []);

  return (
    <mesh position={position} onPointerDown={onPointerDown}>
      <shaderMaterial
        attach="material"
        ref={matRef}
        args={[{
          uniforms: {
            u_inner_color: { value: new THREE.Color(color || accent) },
            u_stroke_color: { value: new THREE.Color(0xffffff) },
            u_radius: { value: (size / 2.0) * 0.8 },
            u_resolution: { value: new THREE.Vector2(1, 1) },
          },
          vertexShader,
          fragmentShader,
        }]}
      />
      <planeGeometry attach="geometry" ref={geoRef} args={[size, size]}/>
    </mesh>
  );
}