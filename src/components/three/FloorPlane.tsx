import { useProductsStore } from '#/store/products';
import { useSettingsStore } from '#/store/settings';
import { Text, useGLTF } from '@react-three/drei';
import { Vector3, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ProductMesh } from './ProductMesh';
import { AnchorPoint } from './AnchorPoint';
import { useViewStore } from '#/store/view';
import { dispose } from '#/utils/helpers';
import { useMaterials } from './materials/useMaterials';
import { debounce } from 'lodash';

const FLOOR_PLANE_POSITION: Vector3 = [0, 0, 0];
const FLOOR_HEIGHT = 3;

const INSTRUCTIONS = {
  productPlaceholder: 'choose a product to place on the ceiling',
  editingProduct: 'drag to move\n hover and press x to delete',
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
  const ref = useRef<THREE.Group>();
  const { camera } = useThree();
  
  useFrame(() => {
    ref.current?.lookAt(camera.position);
  });

  useEffect(() => {
    return () => dispose(ref.current);
  }, []);

  const lines = text.split('\n').map(l => l.trim());
  
  return text ? (
    <group ref={ref} position={position}>
      {
        lines?.map((line, index) => (
          <Text
            key={index}
            scale={[textSize, textSize, textSize]}
            color="#818181"
            position={[0, (lines.length - 1 - index) * 1.0, 0]}
          >
            {line}
          </Text>
        ))
      }
    </group>
  ) : null;
};

// floor plane 
export function FloorPlane() {
  const groupRef = useRef<THREE.Group>();
  const gltf = useGLTF('/assets/models/floor_plan/scan.gltf');
  const [ materials, setMaterialColor, resetMaterials ]= useMaterials();

  const accent = useSettingsStore(state => state.accent);
  const activeView = useViewStore(state => state.activeView);
  const isMobileView = useViewStore(state => state.isMobileView);
  const activeInstructionName = useViewStore(state => state.activeInstructionName);
  const setActiveInstructionName = useViewStore(state => state.setActiveInstructionName);
  const products = useProductsStore(state => state.products);
  const activeProduct = useProductsStore(state => state.activeProduct);
  const setActiveProduct = useProductsStore(state => state.setActiveProduct);
  const editingProduct = useProductsStore(state => state.editingProduct);
  const getActiveProductData = useProductsStore(state => state.getActiveProductData);
  const anchoredProducts = useProductsStore(state => state.anchoredProducts);
  const addAnchoredProduct = useProductsStore(state => state.addAnchoredProduct);

  const [anchorPoint, setAnchorPoint] = useState<THREE.Vector3>();
  const [productFloatHeight, setProductFloatHeight] = useState<number>(4);

  useEffect(() => {
    gltf.scene?.traverse((child) => {
      // hide ceiling by default
      if (child.name === 'CeilingNode') {
        child.visible = false;
      }
      // assign materials
      if (child.parent.name === 'CeilingNode' && child instanceof THREE.Mesh) {
        child.material = materials.ceilingMat;
      }
      if (child.parent.name === 'FloorNode' && child instanceof THREE.Mesh) {
        child.material = materials.floorMat;
      }
    });
  }, [gltf]);

  useEffect(() => {
    // show the transarent shape of the ceiling when pending to place a product
    // or when in navigation view
    const ceiling = gltf.scene?.getObjectByName('CeilingNode');
    if (activeProduct || activeView === 'navigationView') {
      ceiling.visible = true;
    } else {
      ceiling.visible = false;
    }
  }, [activeProduct, activeView]);

  useFrame(() => {
    setProductFloatHeight(Math.sin(Date.now() * 0.002) * 0.5 + 4);
  });

  const pointerMoveHandler = (e) => {
    resetMaterials();
    // find ceiling intersection
    const intersectionOnCeiling = e.intersections.find(o => o.object.name.startsWith('CeilingNode'));
    if (intersectionOnCeiling) {
      setAnchorPoint(intersectionOnCeiling.point);
      setMaterialColor('floorMat', accent);
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

  const pointerOutHandler = () => {
    resetMaterials();
    setAnchorPoint(null);
  };

  const onAnchorPointerDown = (e) => {
    if (activeProductData) {
      addAnchoredProduct(activeProductData.id, anchorPoint);
      setActiveProduct(null);
    }
  }

  const mobileTapHandler = debounce((e) => {
    const intersectionOnCeiling = e.intersections.find(o => o.object.name.startsWith('CeilingNode'));
    if (activeProductData) {
      addAnchoredProduct(activeProductData.id, intersectionOnCeiling.point);
      setActiveProduct(null);
    }
  }, 200);

  const activeProductData = getActiveProductData();

  return (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene} 
        position={FLOOR_PLANE_POSITION}
        scale={[1, 1, 1]}
        onPointerMove={pointerMoveHandler}
        onPointerOut={pointerOutHandler}
        onPointerDown={isMobileView ? mobileTapHandler : null}
      />
      {  // hovering active product
        !!activeProductData && (
          <ProductMesh
            productModelUrl={activeProductData.modelUrl}
            productId={activeProductData.id}
            autoRotate
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
            onPointerDown={isMobileView ? null : onAnchorPointerDown}
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
              index={index}
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
  );
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