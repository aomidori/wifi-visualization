import { create } from 'zustand';

import { products } from '#/data/products';

export type SceneActiveView = 'idle' | 'topView';

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
  editingProduct?: string;
  getActiveProductData?: () => ProductData;
  setActiveProduct: (id: string) => void;
  addAnchoredProduct: (productId: string, position: THREE.Vector3) => void;
  removeAnchoredProduct: (productId: string) => void;
  setEditingProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsStoreState>()((set, get) => ({
  products,
  activeProduct: undefined,
  anchoredProducts: [],
  getActiveProductData: () => get().products.find(product => product.id === get().activeProduct),
  setActiveProduct: (id) => set({ activeProduct: id }),
  addAnchoredProduct: (productId, position) => set({ anchoredProducts: [...get().anchoredProducts, { productId, position }] }),
  removeAnchoredProduct: (productId) => set({ anchoredProducts: get().anchoredProducts.filter(product => product.productId !== productId) }),
  setEditingProduct: (id) => set({ editingProduct: id }),
}));