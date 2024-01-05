import { NavigationInstruction } from '#/components/NavigationInstruction';
import { TweakPane } from './components/TweakPane';
import { TopViewToggle } from './components/TopViewToggle';
import { CanvasView } from './components/three/CanvasView';

function App() {
  return (
    <>
      <CanvasView />
      <TopViewToggle />
      <NavigationInstruction />
      <TweakPane />
    </>
  );
}
export default App;
