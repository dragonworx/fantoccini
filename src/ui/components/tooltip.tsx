/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode, useRef, useState, useEffect, MouseEvent } from 'react';
import { borderRadius, noSelect, reset } from './theme';
import { init } from '../util';

export interface Props {
  children?: ReactNode;
  text: string;
  position?: 'below' | 'left' | 'right' | 'above';
}

export const defaultProps: Props = {
  text: 'tooltip',
  position: 'below',
};

const color = '#273b74';
const arrowSize = 5;
const spacing = 5;

export const style = ({}: Props) => {
  return css`
    ${reset}

    position: relative;

    .tip {
      ${borderRadius}
      ${noSelect}
      position: absolute;
      display: flex;
      flex-direction: column;
      background: ${color};
      color: white;
      padding: 5px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 1s;
      cursor: default;
      z-index: 1;
      visibility: hidden;
      box-shadow: 2px 5px 5px 0px rgb(0 0 0 / 30%);
      border-top: 1px solid #888;

      &.hover {
        opacity: 1;
        visibility: visible;
      }

      &::before {
        content: '';
        position: absolute;
        display: block;
        width: 0px;
        border: ${arrowSize}px solid transparent;
      }

      &.below::before {
        left: 50%;
        top: 0;
        border: ${arrowSize}px solid transparent;
        border-top: 0;
        border-bottom: ${arrowSize}px solid ${color};
        transform: translate(-50%, calc(-100% - 0px));
      }

      &.above::before {
        left: 50%;
        bottom: 0;
        border: ${arrowSize}px solid transparent;
        border-bottom: 0;
        border-top: ${arrowSize}px solid ${color};
        transform: translate(-50%, calc(100% + 0px));
      }

      &.left::before {
        right: 0;
        top: 50%;
        border: ${arrowSize}px solid transparent;
        border-right: 0;
        border-left: ${arrowSize}px solid ${color};
        transform: translate(calc(100% + 0px), -50%);
      }

      &.right::before {
        left: 0;
        top: 50%;
        border: ${arrowSize}px solid transparent;
        border-left: 0;
        border-right: ${arrowSize}px solid ${color};
        transform: translate(calc(-100% - 0px), -50%);
      }
    }
  `;
};

export function ToolTip(props: Props) {
  const [{ children, text, position }, css] = init(props, defaultProps, style);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const tip = tipRef.current;
    if (!tip) {
      return;
    }
    if (root) {
      const child = root.querySelector('*');
      if (child) {
        const childBounds = child.getBoundingClientRect();
        const tipBounds = tip.getBoundingClientRect();
        let left: number = 0;
        let top: number = 0;
        if (position === 'below') {
          left = Math.round(childBounds.width * -0.5);
          top = childBounds.height + arrowSize + spacing;
        } else if (position === 'above') {
          left = Math.round(childBounds.width * -0.5);
          top = (tipBounds.height + arrowSize + spacing) * -1;
        } else if (position === 'left') {
          top = Math.round(childBounds.height * -0.5);
          left = (tipBounds.width + arrowSize + spacing) * -1;
        } else if (position === 'right') {
          top = Math.round(childBounds.height * -0.5);
          left = childBounds.width + arrowSize + spacing;
        }
        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
      }
    }
    if (isOpen) {
      tip.classList.add('hover');
    } else {
      tip.classList.remove('hover');
    }
  }, [isOpen]);

  const onMouseHandler = (isOpen: boolean) => () => setIsOpen(isOpen);

  return (
    <div
      ref={rootRef}
      css={css}
      className="tooltip"
      onMouseOver={onMouseHandler(true)}
      onMouseOut={onMouseHandler(false)}
    >
      {children}
      <div ref={tipRef} className={`tip ${position}`}>
        {text}
      </div>
    </div>
  );
}
