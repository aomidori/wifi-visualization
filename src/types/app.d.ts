type SceneActiveView = 'idle' | 'topView' | 'navigationView';

interface ProductData {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl: string;
  modelUrl: string;
  markerColor: string;
}

type InstructionName = 'productPlaceholder' | 'editingProduct';