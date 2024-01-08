import * as THREE from 'three';

import { useProductsStore } from '#/store/products';
import { useViewStore } from '#/store/view';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3  u_strong_color;
  uniform vec3  u_weak_color;
  uniform float u_range_level;
  uniform vec3  u_resolution;

  varying vec2  vUv;

  void main() {
    float d = distance(vUv, vec2(u_resolution.x * 0.5, u_resolution.y * 0.5));
    float opacity = 0.5;
    float gradiant = 0.0;
    vec3 color = vec3(0.0);

    if (d <= u_range_level) {
      gradiant = smoothstep(0.0, u_range_level, d);
      color = mix(u_strong_color, u_weak_color, gradiant);
      gl_FragColor = vec4(color, opacity);
    } else if (d > u_range_level && d <= 0.5) {
      gradiant = smoothstep(u_range_level, 0.5, d);
      color = mix(u_weak_color, vec3(1.0, 1.0, 1.0), gradiant);
      float alpha = mix(opacity, 0.0, gradiant);
      gl_FragColor = vec4(color, alpha);
    } else {
      discard;
    }
  }
`;

export function GroundVisualization() {
  const showVisualization = useViewStore(state => state.showVisualization);
  const disableVisualization = useViewStore(state => state.disableVisualization);
  const anchoredProducts = useProductsStore(state => state.anchoredProducts);
  const products = useProductsStore(state => state.products);

  return (
    <group name="ground" visible={anchoredProducts.length && showVisualization && !disableVisualization}>
      {
        anchoredProducts?.map((product, index) => {
          if (product.removed) {
            return null;
          }
          const productData = products.find(p => p.id === product.productId);
          const geoSize = productData.wifiRangeRadius * 2;
          const yOffset = - 0.01 * index; // avoid overlapping glitches
          return (
            <mesh
              key={index}
              name={`visualization_${product.meshId}`}
              position={[product.position.x, 0.1 + yOffset, product.position.z]}
              rotation={[-Math.PI / 2, 0, 0]}
              castShadow={false}
              receiveShadow={false}
            >
              <planeGeometry args={[geoSize, geoSize]} />
              <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                depthTest
                depthWrite={false}
                uniforms={{
                  u_strong_color: { value: new THREE.Color(0x6199DB) },
                  u_weak_color: { value: new THREE.Color(0xDCF8CD) },
                  u_range_level: { value: 0.4 },
                  u_resolution: { value: new THREE.Vector2(1, 1) },
                }}
                transparent
                alphaTest={0.5}
                blending={THREE.NormalBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })
      }
    </group>
  );
}
