import { useEffect } from 'react';

import { useViewStore } from './store/view';
import { VisualizeToggle } from './components/VisualizeToggle';

import { InstructionInfo } from '#/components/InstructionInfo';
import { TweakPane } from '#/components/TweakPane';
import { TopViewToggle } from '#/components/TopViewToggle';
import { CanvasView } from '#/components/three/CanvasView';
import { Products } from '#/components/Products';

function App() {
  const setIsMobileView = useViewStore(state => state.setIsMobileView);

  useEffect(() => {
    const resizeHandler = () => {
      const mobileCheck = /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
      if (window.innerWidth < 768 || mobileCheck) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);
  
  return (
    <>
      <CanvasView />
      <TopViewToggle />
      <VisualizeToggle />
      <InstructionInfo />
      <Products />
      <TweakPane />
    </>
  );
}
export default App;
