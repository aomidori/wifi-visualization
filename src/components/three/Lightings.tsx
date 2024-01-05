export function Lightings() {
  return (
    <>
      <hemisphereLight color={0xFFDDBF} groundColor={0x0169F3} intensity={Math.PI / 2} />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.45} penumbra={1} decay={0} intensity={Math.PI / 2} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    </>
  );
}