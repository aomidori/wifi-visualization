import { create } from 'zustand';

import { products } from '#/data/products';

type AnchordProduct = {
  productId: string;
  position: THREE.Vector3;
  meshId?: string;
};

interface ProductsStoreState {
  products: typeof products;
  // product to be installed on the ceiling
  activeProduct?: string;
  // products that are already installed on the ceiling
  anchoredProducts?: AnchordProduct[];
  // hovered product on the ceiling
  hoveringProduct?: { id: string; meshId: string };
  // selected product that's already installed on the ceiling
  editingProduct?: { id: string; meshId: string };
  getActiveProductData?: () => ProductData;
  setActiveProduct: (id: string) => void;
  addAnchoredProduct: (productId: string, position: THREE.Vector3) => void;
  removeAnchoredProduct: (index: number) => void;
  updateAnchoredProducts: (products: AnchordProduct[]) => void;
  setEditingProduct: (data: {id: string, meshId}) => void;
  setHoveringProduct: (data: {id: string, meshId}) => void;
}

export const useProductsStore = create<ProductsStoreState>()((set, get) => ({
  products,
  activeProduct: undefined,
  anchoredProducts: [],
  getActiveProductData: () => get().products.find(product => product.id === get().activeProduct),
  setActiveProduct: (id) => set({ activeProduct: id }),
  addAnchoredProduct: (productId, position) => set({ anchoredProducts: [...get().anchoredProducts, {productId, position}] }),
  removeAnchoredProduct: (index) => set(
    { anchoredProducts: get().anchoredProducts.filter((_, i) => i !== index) }),
  updateAnchoredProducts: (products) => set({ anchoredProducts: products }),
  setEditingProduct: (data) => set({ editingProduct: data }),
  setHoveringProduct: (data) => set({ hoveringProduct: data }),
}));