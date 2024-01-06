import { NavigationInstruction } from '#/components/NavigationInstruction';
import { TweakPane } from '#/components/TweakPane';
import { TopViewToggle } from '#/components/TopViewToggle';
import { CanvasView } from '#/components/three/CanvasView';
import { Products } from '#/components/Products';

function App() {
  return (
    <>
      <CanvasView />
      <TopViewToggle />
      <NavigationInstruction />
      <Products />
      <TweakPane />
    </>
  );
}
export default App;
