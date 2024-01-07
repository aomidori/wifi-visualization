import { useViewStore } from '#/store/view';
import { css, keyframes } from '@emotion/css';
import { useEffect } from 'react';

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

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const styles = {
  container: css`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 24px 24px 0;
    width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: ${blinking} 1.6s linear infinite;
    user-select: none;
    p {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
      color: #818181;
    }
  `,
  image: css`
    aspect-ratio: auto 16 / 9;
    width: 160px;
    margin-bottom: 16px;
  `
};

export function NavigationInstruction() {
  const showNavigationInstruction = useViewStore(state => state.showNavigationInstruction);
  const setShowNavigationInstruction = useViewStore(state => state.setShowNavigationInstruction);

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.key.startsWith('Arrow')) {
        setTimeout(() => {
          setShowNavigationInstruction(false);
        }, 1000);
      }
    };
    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, []);
  
  return (
    <div
      className={styles.container}
      style={!showNavigationInstruction ? { animation: `${fadeOut} 0.3s ease 0s 1 normal forwards` } : {}}
    >
      <img className={styles.image} src="/assets/images/icon_navigation.svg" />
      <p>use arrow keys to navigate</p>
      <p>Use the mouse to rotate the camera.</p>
    </div>
  );
}