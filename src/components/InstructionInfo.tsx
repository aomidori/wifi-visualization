import { css, keyframes } from '@emotion/css';

import { useViewStore } from '#/store/view';

const animations = {
  fadeOut: keyframes`
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  `,
  fadeIn: keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `,
  blinking: keyframes`
    0% {
      opacity: 0.5;
    }
    60% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  `,
};

const styles = {
  container: css`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 24px 24px 0;
    user-select: none;
    animation: ${animations.blinking} 1.6s linear infinite;
    p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
      color: #818181;
    }
  `,
  navigationInstruction: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  image: css`
    aspect-ratio: auto 16 / 9;
    width: 160px;
    margin-bottom: 16px;
  `
};

export function InstructionInfo() {
  const isMobileView = useViewStore(state => state.isMobileView);
  const showNavigationInstruction = useViewStore(state => state.showNavigationInstruction);

  const fadeIn = `${animations.fadeIn} 0.3s ease 0s 1 normal forwards`;
  const fadeOut = `${animations.fadeOut} 0.3s ease 0s 1 normal forwards`;
  
  if (isMobileView) {
    return (
      <div className={styles.container}>
        <p>use a bigger screen for better experience</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <p style={{ animation: showNavigationInstruction ? fadeOut: fadeIn }}>
          click anywhere on the screen to exit the navigation
        </p>
      </div>
      <div className={styles.container}>
        <div
          className={styles.navigationInstruction}
          style={{ animation: showNavigationInstruction ? fadeIn: fadeOut}}
        >
          <img className={styles.image} src="/assets/images/icon_navigation.svg" />
          <p>use arrow keys to navigate</p>
          <p>Use the mouse to rotate the camera.</p>
        </div>
      </div>
    </>
  );
}