import { useViewStore } from "#/store/view";
import { useFrame, useThree } from "@react-three/fiber";
import TWEEN from "@tweenjs/tween.js";

export const cameraPositions = {
  topView: { x: 0, y: 30, z: 0 },
  initial: { x: 0, y: 10, z: 20 },
};

export function Camera() {
  const activeView = useViewStore(state => state.activeView);
  const setDisableOrbitControls = useViewStore(state => state.setDisableOrbitControls);
  const { camera } = useThree();

  useFrame(() => {
    TWEEN.update();
  });

  if (activeView === 'topView') {
    new TWEEN.Tween(camera.position)
      .to(cameraPositions.topView, 600)
      .start()
      .onStart(() => setDisableOrbitControls(true))
      .onUpdate(() => camera.lookAt(0, 0, 0))
      .onComplete(() => setDisableOrbitControls(false));
  } else {
    new TWEEN.Tween(camera.position)
      .to(cameraPositions.initial, 600)
      .start()
      .onStart(() => setDisableOrbitControls(true))
      .onUpdate(() => camera.lookAt(0, 0, 0))
      .onComplete(() => setDisableOrbitControls(false));
  }
  
  return null;
}