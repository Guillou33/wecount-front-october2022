import {forwardRef } from 'react';
import styles from '@styles/helpers/mobile/burgerMenuIcon.module.scss';
import cx from 'classnames';

interface Props {
  open: boolean;
  onClick?: () => void;
  width: number;
  height: number;
  strokeWidth?: number;
  colorClosed?: string;
  colorOpen?: string;
  className?: string;
  forceOpen?: boolean;
}

const BurgerMenuIcon = forwardRef<HTMLDivElement, Props>((props, ref) => {

  const strokeWidth = props.strokeWidth ?? 2;
  const renderSpan = (numberClass: string) => {
    return (
      <span 
        style={{
          width: props.width,
          marginBottom: (props.height - 3 * strokeWidth) / 2,
          height: strokeWidth,
          background: props.open ? (props.colorOpen ?? 'white') : (props.colorClosed ?? 'white'),
        }}
        className={numberClass}
      ></span>
    )
  };
  return (
    <div ref={ref} onClick={() => {!props.onClick ? null : props.onClick()}} className={cx(styles.main, {["burger-open"]: props.open}, {[styles.open]: props.open}, props.className)}>
      {renderSpan(styles.first)}
      {renderSpan(styles.second)}
      {renderSpan(styles.third)}
    </div>
  )
});

export default BurgerMenuIcon;