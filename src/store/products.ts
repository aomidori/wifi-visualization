import { create } from 'zustand';
import * as THREE from 'three';

import { products } from '#/data/products';
import { loadUSDZ } from '#/components/three/loaders/useUSDZ';

type AnchoredProduct = {
  productId: string;
  position: THREE.Vector3;
  meshId?: string;
  removed?: boolean;
};

interface ProductsStoreState {
  products: typeof products;
  // product to be installed on the ceiling
  activeProduct?: string;
  // products that are already installed on the ceiling
  anchoredProducts?: AnchoredProduct[];
  // hovered product on the ceiling
  hoveringProduct?: { id: string; meshId: string };
  // selected product that's already installed on the ceiling
  editingProduct?: { id: string; meshId: string };
  getActiveProductData?: () => ProductData;
  setActiveProduct: (id: string) => void;
  addAnchoredProduct: (productId: string, position: THREE.Vector3) => void;
  updateAnchoredProduct: (index: number, data: Partial<AnchoredProduct>) => void;
  setEditingProduct: (data: {id: string, meshId}) => void;
  setHoveringProduct: (data: {id: string, meshId}) => void;
  preloadProductModels: () => void;
}

export const useProductsStore = create<ProductsStoreState>()((set, get) => ({
  products,
  activeProduct: undefined,
  anchoredProducts: [],
  getActiveProductData: () => get().products.find(product => product.id === get().activeProduct),
  setActiveProduct: (id) => set({ activeProduct: id }),
  addAnchoredProduct: (productId, position) => set({ anchoredProducts: [...get().anchoredProducts, {productId, position}] }),
  setEditingProduct: (data) => set({ editingProduct: data }),
  setHoveringProduct: (data) => set({ hoveringProduct: data }),
  updateAnchoredProduct: (index, data) => set({
    anchoredProducts: get().anchoredProducts.map((p, i) => i === index ? { ...p, ...data } : p),
  }),
  preloadProductModels: () => {
    const { products } = get();
    try {
      for (const product of products) {
        const ref = new THREE.Group();
        loadUSDZ(product.modelUrl, product.id, ref);
      }
    } catch (error) {
      console.error(error);
    }
  },
}));