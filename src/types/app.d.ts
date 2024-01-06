type SceneActiveView = 'idle' | 'topView';

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