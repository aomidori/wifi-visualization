import { create } from 'zustand';

import { products } from '#/data/products';

interface ProductsStoreState {
  products: typeof products;
  // product to be installed on the ceiling
  activeProduct?: string;
  // products that are already installed on the ceiling
  anchoredProducts?: {
    productId: string;
    position: THREE.Vector3;
  }[];
  // selected product that's already installed on the ceiling
  editingProduct?: { id: string; meshId: string };
  getActiveProductData?: () => ProductData;
  setActiveProduct: (id: string) => void;
  addAnchoredProduct: (productId: string, position: THREE.Vector3) => void;
  removeAnchoredProduct: (productId: string) => void;
  setEditingProduct: (data: {id: string, meshId}) => void;
}

export const useProductsStore = create<ProductsStoreState>()((set, get) => ({
  products,
  activeProduct: undefined,
  anchoredProducts: [],
  getActiveProductData: () => get().products.find(product => product.id === get().activeProduct),
  setActiveProduct: (id) => set({ activeProduct: id }),
  addAnchoredProduct: (productId, position) => set({ anchoredProducts: [...get().anchoredProducts, {productId, position}] }),
  removeAnchoredProduct: (productId) => set(
    { anchoredProducts: get().anchoredProducts.filter(product => product.productId !== productId) }),
  setEditingProduct: (data) => set({ editingProduct: data }),
}));