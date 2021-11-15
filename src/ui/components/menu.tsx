/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Label } from './label';
import { Icon } from './icon';
import { init, multiFire } from './util';
import { highlightColor, menuBorder, noSelect } from './theme';

export type MenuItemType = 'checked' | 'separator';

export interface MenuItem {
  enabled?: boolean;
  icon?: string;
  label?: string;
  value?: any;
  type?: MenuItemType;
  shortCut?: string;
}

export const isItemEnabled = ({ enabled, type }: MenuItem) =>
  enabled !== false && type !== 'separator';
export type PopupPosition = 'left' | 'right' | 'top' | 'bottom';
export type ItemUpdateHandler = (items: MenuItem[]) => MenuItem[] | void;

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  items: MenuItem[];
  selectedIndex?: number;
  position?: PopupPosition;
  isOpen: boolean;
  onSelect?: (selectedIndex: number) => void;
  onBlur?: () => void;
  onBeforeOpen?: ItemUpdateHandler;
}

export const defaultProps: Props = {
  enabled: true,
  position: 'bottom',
  isOpen: false,
  items: [],
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
        padding: 5px 5px;
        display: flex;
        justify-content: start;
        align-items: end;
        transition: background-color 0.1s;

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

        & > .label {
          flex-grow: 2;
        }

        .separator {
          width: 100%;
          border-top: 2px solid #242424;
          border-bottom: 1px solid #505050;
        }

        .iconGutter {
          width: 16px;
          height: 16px;
        }

        .shortcut {
          ${noSelect}
          min-width: 16px;
          height: 16px;
          color: white;
          text-align: right;
          cursor: default;
          margin: 0 3px;
        }
      }
    }
  `;
};

export const itemSelectBlinkInterval = 100;
export const itemSelectBlinkRepeat = 2;

export function Menu(props: Props) {
  const [
    {
      children,
      isOpen,
      items: defaultItems,
      selectedIndex,
      position,
      onSelect,
      onBlur,
      onBeforeOpen,
    },
    css,
  ] = init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const current = ref.current;

  const [hasOpened, setHasOpened] = useState(false);
  const [items, setItems] = useState(defaultItems);

  const onWheelHandler = (e: WheelEvent) => e.preventDefault();

  const onMouseDownHandler = (e: MouseEvent) => {
    const isMenuEvent =
      e.target === current?.parentNode ||
      current?.contains(e.target as Element);
    if (!isMenuEvent) {
      onBlur && onBlur();
    }
  };

  useEffect(() => setItems(defaultItems), [defaultItems]);

  useEffect(() => {
    if (current) {
      const targetElement = current.querySelector(':scope > *')! as HTMLElement;
      const menuContentElement = current.querySelector(
        ':scope > .menucontent'
      )! as HTMLElement;
      if (isOpen && !hasOpened) {
        // open
        if (onBeforeOpen) {
          const updatedItem = onBeforeOpen(items);
          if (Array.isArray(updatedItem)) {
            setItems(updatedItem);
          }
        }
        const viewPortWidth = document.documentElement.clientWidth;
        const viewPortHeight = document.documentElement.clientHeight;
        const menuContentRect = menuContentElement.getBoundingClientRect();
        const targetElementRect = targetElement.getBoundingClientRect();

        let left = Math.min(
          0,
          viewPortWidth - (targetElementRect.left + menuContentRect.width)
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

  const onItemClickHandler = (index: number) => () => {
    const current = ref.current;
    const item = items[index];
    if (item.enabled !== false && onSelect && current) {
      const selectedLI = current.querySelector(
        `li[data-index="${selectedIndex}"`
      ) as HTMLLIElement;
      selectedLI && selectedLI.classList.remove('selected');
      const li = current.querySelector(
        `li[data-index="${index}"`
      ) as HTMLLIElement;
      multiFire(
        (done) => {
          li.classList.add('selected');
          setTimeout(() => {
            li.classList.remove('selected');
            done();
          }, itemSelectBlinkInterval);
        },
        itemSelectBlinkRepeat,
        itemSelectBlinkInterval
      ).then(() => {
        if (item.type === 'checked') {
          item.value = !item.value;
          setItems(items);
        }
        onSelect(index);
      });
    }
  };

  const hasIcon = !!items.find(
    (item) => !!(item.icon || item.type === 'checked')
  );
  const hasShortcut = !!items.find((item) => !!item.shortCut);

  const getItem = (item: MenuItem) => {
    const { label, value, type, shortCut } = item;
    const labelEl = (
      <Label enabled={isItemEnabled(item)} text={label || String(value)} />
    );
    const shortCutEl = hasShortcut ? (
      <div className="shortcut">{shortCut}</div>
    ) : null;
    if (type === 'separator') {
      return <div className="separator" />;
    } else if (type === 'checked' && value === true) {
      return [<Icon src="#tick" width={16} />, labelEl, shortCutEl];
    }
    return [
      hasIcon ? <div className="iconGutter" /> : null,
      labelEl,
      shortCutEl,
    ];
  };

  const getLIClassName = (item: MenuItem, index: number) =>
    isItemEnabled(item)
      ? index === selectedIndex
        ? 'selected'
        : ''
      : 'disabled';

  return (
    <div ref={ref} css={css} className="menu">
      {children}
      <ul className="menucontent">
        {items.map((item, index) => (
          <li
            data-index={index}
            onMouseUp={onItemClickHandler(index)}
            className={getLIClassName(item, index)}
          >
            {getItem(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}
