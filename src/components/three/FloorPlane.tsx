import { useProductsStore } from '#/store/products';
import { useSettingsStore } from '#/store/settings';
import { Text, useGLTF } from '@react-three/drei';
import { Vector3, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductMesh } from './ProductMesh';
import { AnchorPoint } from './AnchorPoint';
import { useViewStore } from '#/store/view';

const FLOOR_PLANE_POSITION: Vector3 = [0, 0, 0];
const FLOOR_HEIGHT = 3;

const INSTRUCTIONS = {
  // TODO(Hanyue): center the text in the Text component
  productPlaceholder: 'choose a product to place on the ceiling\n        or edit an existing product',
  editingProduct: '   drag to move\n press x to delete',
};

const materials = {
  activeMat: new THREE.MeshStandardMaterial({ color: 0x98CAE2 }),
  inactiveMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3 }),
  floorMat: new THREE.MeshStandardMaterial({ color: 0xc1c1c1 }),
  ceilingMat: new THREE.MeshStandardMaterial({ color: 0xe3e3e3, transparent: true, opacity: 0.2 }),
};

const InstructionText = ({
  position,
  text,
  textSize = 0.7,
}: {
  position: Vector3,
  text: string,
  textSize?: number,
}) => {
  const ref = useRef<THREE.Object3D>();
  const { camera } = useThree();
  
  useFrame(() => {
    ref.current?.lookAt(camera.position);
  });
  
  return text ? (
    <Text
      ref={ref}
      scale={[textSize, textSize, textSize]}
      color="#818181"
      position={position}
    >
      {text}
    </Text>
  ) : null;
};

// floor plane 
export function FloorPlane() {
  const groupRef = useRef<THREE.Group>();
  const gltf = useGLTF('/assets/models/floor_plan/scan.gltf');
  const accent = useSettingsStore(state => state.accent);
  const editing = useSettingsStore(state => state.editing);
  const activeInstructionName = useViewStore(state => state.activeInstructionName);
  const setActiveInstructionName = useViewStore(state => state.setActiveInstructionName);
  const products = useProductsStore(state => state.products);
  const activeProduct = useProductsStore(state => state.activeProduct);
  const editingProduct = useProductsStore(state => state.editingProduct);
  const getActiveProductData = useProductsStore(state => state.getActiveProductData);
  const anchoredProducts = useProductsStore(state => state.anchoredProducts);
  const addAnchoredProduct = useProductsStore(state => state.addAnchoredProduct);

  const [anchorPoint, setAnchorPoint] = useState<THREE.Vector3>();
  const [productFloatHeight, setProductFloatHeight] = useState<number>(4);

  useEffect(() => {
    gltf.scene?.traverse((child) => {
      if (child.name === 'CeilingNode') {
        child.visible = false;
      }
      if (child.name.startsWith('FloorNode') && child instanceof THREE.Mesh) {
        child.material = materials.floorMat;
      }
    });
  }, [gltf]);

  useEffect(() => {
    materials.activeMat.color.set(accent);
  }, [accent]);

  useEffect(() => {
    const ceiling = gltf.scene?.getObjectByName('CeilingNode');
    if (activeProduct) {
      ceiling.visible = true;
      ceiling.children.forEach((child: THREE.Mesh) => {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material = materials.ceilingMat;
          child.material.needsUpdate = true;
        }
      });
    } else {
      ceiling.visible = false;
    }
  }, [activeProduct]);

  useFrame(() => {
    setProductFloatHeight(Math.sin(Date.now() * 0.002) * 0.5 + 4);
  });

  const pointerMoveHandler = (e) => {
    const intersection = e.object;

    const highlightGround = () => {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name.startsWith('FloorNode')) {
          child.material = materials.activeMat;
        }
      });
    };
    // reset materials of inactive meshes
    gltf.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.name !== intersection.name &&
        !child.name.startsWith('CeilingNode')) {
        child.material = child.name.startsWith('FloorNode') ?
          materials.floorMat : materials.inactiveMat;
      }
    });
    // find ceiling intersection
    const intersectionOnCeiling = e.intersections.find(o => o.object.name.startsWith('CeilingNode'));
    if (intersectionOnCeiling) {
      setAnchorPoint(intersectionOnCeiling.point);
      highlightGround();
      // drag product if it's in editing mode
      if (editingProduct) {
        groupRef.current?.traverse((child) => {
          if (child.name === editingProduct.id && child.uuid === editingProduct.meshId) {
            const point = intersectionOnCeiling.point;
            child.position.set(point.x, point.y, point.z);
          }
        });
      }
    }
  };

  const resetMaterials = () => {
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.name.startsWith('FloorNode')
          ? materials.floorMat : child.name.startsWith('CeilingNode')
            ? materials.ceilingMat: materials.inactiveMat;
      }
    });
  };

  const activeProductData = getActiveProductData();

  return gltf.scene ? (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene} 
        position={FLOOR_PLANE_POSITION}
        scale={[1, 1, 1]}
        onPointerMove={pointerMoveHandler}
        onPointerOut={resetMaterials}
      />
      {  // hovering active product
        !!activeProductData && (
          <ProductMesh
            productModelUrl={activeProductData.modelUrl}
            productId={activeProductData.id}
            scale={[0.1, 0.1, 0.1]}
            position={anchorPoint ?
              [anchorPoint.x, anchorPoint.y + productFloatHeight, anchorPoint.z] :
              [0, FLOOR_HEIGHT + productFloatHeight, 0]}
          />
        )
      }
      {
        // product anchor point on ceiling
        !!anchorPoint && !editingProduct && (
          <AnchorPoint
            position={[anchorPoint.x, anchorPoint.y, anchorPoint.z]}
            onPointerDown={() => {
              if (activeProductData) {
                addAnchoredProduct(activeProductData.id, anchorPoint);
                useProductsStore.getState().setActiveProduct(null);
              }
            }}
          />
        )
      }
      {
        // instruction text
        !!anchorPoint && !activeProduct && !editingProduct && INSTRUCTIONS[activeInstructionName] && (
          <InstructionText
            text={INSTRUCTIONS[activeInstructionName]}
            position={[anchorPoint.x, anchorPoint.y + 3, anchorPoint.z]}
          />
        )
      }
      {
        // anchored products
        anchoredProducts?.map(({productId, position}, index) => {
          const product = products.find(p => p.id === productId);
          return product && (
            <ProductMesh
              key={index}
              productModelUrl={product.modelUrl}
              productId={productId}
              anchored
              color={product.markerColor}
              scale={[0.03, 0.03, 0.03]}
              rotation={[Math.PI / 2, 0, 0]}
              position={position.toArray()}
              onHover={() => setActiveInstructionName('editingProduct')}
              onBlur={() => setActiveInstructionName('productPlaceholder')}
            />
          );
        })
      }
    </group>
  ) : null;
}

// floor plane ground helper grid
export function FloorPlaneBaseGrid() {
  return (
    <gridHelper
      args={[80, 80 * 2, 0xe3e3e3, 0xe3e3e3]}
      position={FLOOR_PLANE_POSITION}
    />
  );
}