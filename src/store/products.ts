import { create } from 'zustand';

import { products } from '#/data/products';

export type SceneActiveView = 'idle' | 'topView';

interface ProductsStoreState {
  products: typeof products;
  activeProduct?: string;
  getActiveProductData?: () => ProductData;
  setActiveProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsStoreState>()((set, get) => ({
  products,
  getActiveProductData: () => get().products.find(product => product.id === get().activeProduct),
  setActiveProduct: (id) => set({ activeProduct: id }),
}));