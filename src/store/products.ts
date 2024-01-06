import { create } from 'zustand';

import { products } from '#/data/products';

export type SceneActiveView = 'idle' | 'topView';

interface ProductsStoreState {
  products: typeof products;
  activeProduct?: string;
  setActiveProduct: (id: string) => void;
}

export const useProductsStore = create<ProductsStoreState>()(set => ({
  products,
  setActiveProduct: (id) => set({ activeProduct: id }),
}));