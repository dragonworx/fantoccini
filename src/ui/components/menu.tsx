/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { HBoxLayout } from '../layout/box';
import { init } from './util';
import { highlightColor, menuBorder } from './theme';

export interface MenuOption {
  enabled?: boolean;
  icon?: string;
  label?: string;
  value: any;
}

export const isOptionEnabled = (option: MenuOption) => option.enabled !== false;

export type PopupPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  options: MenuOption[];
  selectedIndex?: number;
  position?: PopupPosition;
  isOpen: boolean;
  onSelect?: (selectedIndex: number) => void;
  onBlur?: () => void;
}

export const defaultProps: Props = {
  enabled: true,
  position: 'bottom',
  isOpen: false,
  options: [],
  selectedIndex: -1,
};

export const style = ({ isOpen }: Required<Props>) => {
  return css`
    position: relative;

    & .menucontent {
      ${menuBorder}
      position: absolute;
      display: ${isOpen ? 'block' : 'none'};
      opacity: 0;
      transition: opacity 0.4s;
      background: linear-gradient(180deg, #24282f 0, #2f343c 100%);
      margin: 0;
      padding: 0;
      list-style: none;
      box-shadow: 1px 5px 9px 0px rgb(0 0 0 / 25%);

      & li {
        margin: 0;
        align-items: center;
        justify-content: start;
        padding: 5px 5px;

        &:not(.selected):hover {
          background-color: black;
        }

        &.disabled:hover {
          background-color: transparent;
          & label {
            text-shadow: none;
          }
        }

        &.selected {
          background-color: ${highlightColor};

          & label {
            color: black;
            text-shadow: none;
          }
        }

        &.selected:hover {
          background-color: ${highlightColor};
        }
      }
    }
  `;
};

export function Menu(props: Props) {
  const [
    {
      children,
      enabled,
      isOpen,
      options,
      selectedIndex,
      position,
      onSelect,
      onBlur,
    },
    css,
  ] = init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const current = ref.current;

  const onWheelHandler = (e: WheelEvent) => e.preventDefault();

  const onMouseDownHandler = (e: MouseEvent) => {
    const isMenuEvent =
      e.target === current?.parentNode ||
      current?.contains(e.target as Element);
    if (!isMenuEvent) {
      onBlur && onBlur();
    }
  };

  useEffect(() => {
    if (current) {
      const targetElement = current.querySelector(':scope > *')! as HTMLElement;
      const menuContentElement = current.querySelector(
        ':scope > .menucontent'
      )! as HTMLElement;
      if (isOpen && !hasOpened) {
        // open
        const viewPortWidth = document.documentElement.clientWidth;
        const viewPortHeight = document.documentElement.clientHeight;
        const menuContentRect = menuContentElement.getBoundingClientRect();
        const targetElementRect = targetElement.getBoundingClientRect();

        let left = Math.min(
          0,
          (targetElementRect.width - menuContentRect.width) / 2
        );
        let top = 0;

        if (position === 'bottom') {
          top = targetElementRect.height;
          if (
            targetElementRect.bottom + menuContentRect.height >
            viewPortHeight
          ) {
            top = menuContentRect.height * -1;
          }
        }

        menuContentElement.style.cssText = `
          left: ${left}px;
          top: ${top}px;
          min-width: ${targetElementRect.width}px;
          opacity: 1;
        `;

        current.addEventListener('wheel', onWheelHandler, { passive: false });
        window.addEventListener('mousedown', onMouseDownHandler);

        setHasOpened(true);
      }

      if (hasOpened && !isOpen) {
        // close
        menuContentElement.style.opacity = '0';
        current.removeEventListener('wheel', onWheelHandler);
        window.removeEventListener('mousedown', onMouseDownHandler);
        setHasOpened(false);
      }
    }
  });

  const onOptionClickHandler = (index: number) => () => {
    options[index].enabled !== false && onSelect && onSelect(index);
  };

  return (
    <div ref={ref} css={css} className="menu">
      {children}
      <ul className="menucontent">
        {options.map((option, index) => (
          <li
            onClick={onOptionClickHandler(index)}
            className={
              isOptionEnabled(option)
                ? index === selectedIndex
                  ? 'selected'
                  : ''
                : 'disabled'
            }
          >
            <Label
              enabled={isOptionEnabled(option)}
              text={option.label || String(option.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
