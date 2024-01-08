import { css, cx } from '@emotion/css';

const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  `,
  toggle: css`
    position: relative;
    background: #333;
    color: white;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
    height: 40px;
    border-radius: 40px;
    display: flex;
    span {
      margin: 1px;
      background: white;
      border-radius: 38px;
      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
      pointer-events: none;
      position: absolute;
      transition: left 0.2s ease;
    }
  `,
  toggleButton: css`
    cursor: pointer;
    color: #fff;
    font-size: 14px;
    text-align: center;
    transition: all 0.2s ease;
    &.active {
      color: #333;
    }
    z-index: 1;
  `
};

interface Props {
  options: { label: string, value: string}[];
  selected: string;
  onChange: (value: string) => void;
  buttonSize?: 'small' | 'medium' | 'large';
  className?: string;
}

export function ToggleButtons({
  options,
  selected,
  onChange,
  buttonSize = 'medium',
  className,
}: Props) {
  const activeIndex = Math.max(0, options.findIndex(({ value }) => value === selected));

  const buttonWidth = buttonSize === 'small' ? 40 : buttonSize === 'medium' ? 88 : 120;
  const buttonHeight = buttonSize === 'small' ? 30 : buttonSize === 'medium' ? 40 : 50;
  const fontSize = buttonSize === 'small' ? 12 : 14;

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.toggle} style={{ height: buttonHeight }}>
        <span className={css`
          left: ${buttonWidth * activeIndex}px;
          width: ${buttonWidth - 2}px;
          height: ${buttonHeight - 2}px;
          z-index: 0;
        `}/>
        {options?.map(({ label, value }, i) => (
          <div
            className={cx(styles.toggleButton, i === activeIndex ? 'active' : '')}
            style={{ width: buttonWidth, height: buttonHeight, lineHeight: `${buttonHeight}px`, fontSize, }}
            key={value}
            onClick={() => {
              if (value !== selected) {
                onChange(value);
              }
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}