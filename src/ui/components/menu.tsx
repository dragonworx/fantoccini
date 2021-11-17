/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEvent as ReactMouseEvent,
} from 'react';
import { Label } from './label';
import { Icon } from './icon';
import { findFirstParent, init, multiFire } from './util';
import { highlightColor, menuBorder, noSelect } from './theme';

export type MenuItemType = 'checked' | 'separator' | 'menu';

export interface MenuItem {
  enabled?: boolean;
  icon?: string;
  label?: string;
  value?: any;
  type?: MenuItemType;
  shortCut?: string;
  onSelect?: (value: any) => void;
}

export const isItemEnabled = ({ enabled, type }: MenuItem) =>
  enabled !== false && type !== 'separator';
export type PopupPosition = 'dropdown' | 'submenu';
export type ItemUpdateHandler = (items: MenuItem[]) => MenuItem[] | void;

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  items: MenuItem[];
  selectedIndex?: number;
  position?: PopupPosition;
  isOpen: boolean;
  isSubMenu?: boolean;
  onSelect?: (item: MenuItem) => void;
  onBlur?: () => void;
  onBeforeOpen?: ItemUpdateHandler;
  onClosed?: () => void;
}

export const defaultProps: Props = {
  enabled: true,
  position: 'dropdown',
  isOpen: false,
  items: [],
  selectedIndex: -1,
  isSubMenu: false,
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
      z-index: 1;

      & li {
        margin: 0;
        padding: 5px 5px;
        display: flex;
        transition: background-color 0.1s;

        &:not(.selected):hover {
          background-color: black;
        }

        &.disabled label {
          text-shadow: none;
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
          position: relative;
          top: 2px;
        }

        .separator {
          width: 100%;
          border-top: 2px solid #242424;
          border-bottom: 1px solid #505050;
        }

        .iconGutter {
          width: 16px;
          height: 16px;
          margin-right: 3px;
        }

        .shortcut {
          ${noSelect}
          min-width: 16px;
          height: 16px;
          color: white;
          text-align: right;
          cursor: default;
          margin: 0 5px;
          margin-right: 0px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .icon {
            position: relative;
            left: 6px;
          }
        }

        .iconGutter .icon {
          position: relative;
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
      isSubMenu,
      onSelect,
      onBlur,
      onBeforeOpen,
      onClosed,
    },
    css,
  ] = init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const current = ref.current;

  const [hasOpened, setHasOpened] = useState(false);
  const [items, setItems] = useState(defaultItems);
  const [subMenu, setSubMenu] = useState(-1);

  const onWheelHandler = (e: WheelEvent) => e.preventDefault();

  const onMouseDownHandler = (e: MouseEvent) => {
    const isMenuEvent =
      e.target === current?.parentNode ||
      current?.contains(e.target as Element);
    if (!isMenuEvent) {
      onBlur && onBlur();
    }
  };

  const close = () => {
    if (current) {
      const menuContentElement = current.querySelector(
        ':scope > .menucontent'
      )! as HTMLElement;
      menuContentElement.style.opacity = '0';
      current.removeEventListener('wheel', onWheelHandler);
      window.removeEventListener('mousedown', onMouseDownHandler);
      setHasOpened(false);
      setSubMenu(-1);
      onClosed && onClosed();
      clearIds();
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

        if (position === 'dropdown') {
          top = targetElementRect.height;
        } else if (position === 'submenu') {
          top = -6;
          left = 26;
        }

        // viewport bounds check
        if (
          targetElementRect.bottom + menuContentRect.height >
          viewPortHeight
        ) {
          top = menuContentRect.height * -1;
        }

        if (menuContentRect.left + menuContentRect.width > viewPortWidth) {
          const overflow =
            menuContentRect.left + menuContentRect.width - viewPortWidth;
          left = -overflow;
        }

        menuContentElement.style.cssText = `
          top: ${top}px;
          left: ${left}px;
          min-width: ${targetElementRect.width}px;
          opacity: 1;
        `;

        current.addEventListener('wheel', onWheelHandler, { passive: false });
        window.addEventListener('mousedown', onMouseDownHandler);

        setHasOpened(true);
      }

      if (hasOpened && !isOpen) {
        // close
        close();
      }
    }
    if (isSubMenu && isOpen && !hasOpened) {
      setItems([...items]);
    }
  }, [isOpen, hasOpened, isSubMenu, items]);

  const onItemClickHandler = (index: number) => (e: ReactMouseEvent) => {
    e.stopPropagation();
    const current = ref.current;
    if (current) {
      const selectedLI = current.querySelector(
        `li[data-index="${selectedIndex}"`
      ) as HTMLLIElement;
      selectedLI && selectedLI.classList.remove('selected');
      const rootLi = current.querySelector(
        `li[data-index="${index}"`
      ) as HTMLLIElement;
      const li = findFirstParent(
        e.target as HTMLElement,
        'LI'
      ) as HTMLLIElement;
      const item = getItemById(li.getAttribute('data-id')!);
      if (item.type === 'menu' && rootLi === li) {
        return;
      }
      if (item.enabled !== false) {
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
          onSelect && onSelect(item);
          item.onSelect && item.onSelect(item.value);
        });
      }
    }
  };

  const getLIChildElements = (item: MenuItem, index: number) => {
    const { label, value, type, shortCut } = item;
    const labelEl = (
      <Label enabled={isItemEnabled(item)} text={label || String(value)} />
    );
    const shortCutEl = <div className="shortcut">{shortCut}</div>;
    if (type === 'separator') {
      return <div className="separator" />;
    } else if (type === 'menu') {
      const menuIcon = (
        <div className="shortcut">
          <Icon src="#play" width={12} />
        </div>
      );
      return [
        <div className="iconGutter" />,
        labelEl,
        index === subMenu ? (
          <Menu
            isOpen={subMenu > -1}
            items={value}
            isSubMenu={true}
            position="submenu"
            onSelect={() => close()}
            onClosed={() => close()}
          >
            {menuIcon}
          </Menu>
        ) : (
          menuIcon
        ),
      ];
    } else if (type === 'checked' && value === true) {
      return [
        <div className="iconGutter">
          <Icon src="#tick" width={16} />
        </div>,
        labelEl,
        shortCutEl,
      ];
    }
    return [<div className="iconGutter" />, labelEl, shortCutEl];
  };

  const getLIClassName = (item: MenuItem, index: number) =>
    isItemEnabled(item)
      ? index === selectedIndex
        ? 'selected'
        : ''
      : 'disabled';

  const onLIMouseOverHandler = (index: number) => (e: ReactMouseEvent) => {
    setSubMenu(index);
  };

  return (
    <div ref={ref} css={css} className="menu">
      {children}
      <ul className="menucontent">
        {items.map((item, index) => (
          <li
            data-index={index}
            data-id={itemId(item)}
            onMouseOver={onLIMouseOverHandler(index)}
            onMouseUp={onItemClickHandler(index)}
            className={getLIClassName(item, index)}
          >
            {getLIChildElements(item, index)}
          </li>
        ))}
      </ul>
    </div>
  );
}

let id = 0;
const itemById: Map<string, MenuItem> = new Map();
const idByItem: Map<MenuItem, string> = new Map();

const itemId = (item: MenuItem) => {
  if (idByItem.has(item)) {
    return idByItem.get(item);
  }
  id++;
  const idStr = String(id);
  itemById.set(idStr, item);
  idByItem.set(item, idStr);
  return idStr;
};

const clearIds = () => {
  itemById.clear();
  idByItem.clear();
  id = 0;
};

const getItemById = (id: string) => {
  return itemById.get(id) as MenuItem;
};
