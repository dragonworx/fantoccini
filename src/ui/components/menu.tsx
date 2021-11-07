/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { HBoxLayout } from '../layout/box';
import { init } from './util';

export interface MenuOption {
  icon?: string;
  label?: string;
  value: any;
}

export type PopupPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  options: MenuOption[];
  position?: PopupPosition;
  isOpen: boolean;
  onSelect?: (selectedIndex: number) => void;
}

export const defaultProps: Props = {
  enabled: true,
  position: 'bottom',
  isOpen: false,
  options: [],
};

export const style = ({ isOpen }: Required<Props>) => {
  return css`
    position: relative;

    & .menucontent {
      position: absolute;
      display: ${isOpen ? 'block' : 'none'};
      visibility: hidden;
      background: linear-gradient(180deg, #24282f 0, #2f343c 100%);
      margin: 0;
      padding: 0;
      list-style: none;

      & li {
        margin: 0;
        align-items: center;
        justify-content: start;
        padding: 5px 5px;

        &:hover {
          background: linear-gradient(180deg, #000 0, #111 100%);
        }
      }
    }
  `;
};

const setPosition = (
  menuContentElement: HTMLElement,
  targeElement: HTMLElement,
  position: PopupPosition
) => {
  const viewPortWidth = document.documentElement.clientWidth;
  const viewPortHeight = document.documentElement.clientHeight;
  const { width: menuContentWidth, height: menuContentHeight } =
    menuContentElement.getBoundingClientRect();
  const targetElementRect = targeElement.getBoundingClientRect();

  console.log({
    menuContentWidth,
    menuContentHeight,
    targetElementRect,
    viewPortWidth,
    viewPortHeight,
  });

  let left = 0;
  let top = 0;

  if (position === 'bottom') {
    top = targetElementRect.height;
    if (targetElementRect.bottom + menuContentHeight > viewPortHeight) {
      top = menuContentHeight * -1;
    }
  }

  menuContentElement.style.cssText = `
    left: ${left}px;
    top: ${top}px;
    min-width: ${targetElementRect.width}px;
  `;

  setTimeout(() => (menuContentElement.style.visibility = 'visible'), 100);
};

export function Menu(props: Props) {
  const [{ children, enabled, isOpen, options, position, onSelect }, css] =
    init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const current = ref.current;

  if (current) {
    const menuContentElement = current.querySelector(
      ':scope > .menucontent'
    )! as HTMLElement;
    menuContentElement.style.visibility = 'hidden';
  }

  useEffect(() => {
    if (current) {
      const targetElement = current.querySelector(':scope > *')! as HTMLElement;
      const menuContentElement = current.querySelector(
        ':scope > .menucontent'
      )! as HTMLElement;
      setPosition(menuContentElement, targetElement, position);
    }
  });

  const onOptionClickHandler = (index: number) => () => {
    onSelect && onSelect(index);
  };

  return (
    <div ref={ref} css={css} className="menu">
      {children}
      <ul className="menucontent">
        {options.map((option, index) => (
          <li onClick={onOptionClickHandler(index)}>
            <Label text={option.label || String(option.value)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
