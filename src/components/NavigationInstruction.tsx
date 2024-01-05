import { css, keyframes } from '@emotion/css';

const blinking = keyframes`
  0% {
    opacity: 0.5;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

const styles = {
  container: css`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 24px 24px 0;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: ${blinking} 1.6s linear infinite;
  `,
  image: css`
    aspect-ratio: auto 16 / 9;
    width: 160px;
  `
};

export function NavigationInstruction() {
  return (
    <div className={styles.container}>
      <img className={styles.image} src="/assets/images/icon_navigation.svg" />
      {/* <p>Use the mouse to rotate the camera.</p>
      <p>Use the mouse wheel to zoom in and out.</p>
      <p>Use the arrow keys to move the camera.</p>
      <p>Use the shift key to move faster.</p> */}
      <p>navigate use arrow keys</p>
    </div>
  );
}