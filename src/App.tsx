import { InstructionInfo } from '#/components/InstructionInfo';
import { TweakPane } from '#/components/TweakPane';
import { TopViewToggle } from '#/components/TopViewToggle';
import { CanvasView } from '#/components/three/CanvasView';
import { Products } from '#/components/Products';

function App() {
  return (
    <>
      <CanvasView />
      <TopViewToggle />
      <InstructionInfo />
      <Products />
      <TweakPane />
    </>
  );
}
export default App;
