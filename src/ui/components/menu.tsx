/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { HBoxLayout } from '../layout/box';
import { init, multiFire } from './util';
import { highlightColor, menuBorder } from './theme';

export type MenuOptionType = 'checked' | 'separator';

export interface MenuOption {
  enabled?: boolean;
  icon?: string;
  label?: string;
  value?: any;
  type?: MenuOptionType;
  shortCut?: string;
}

export const isOptionEnabled = ({ enabled, type }: MenuOption) =>
  enabled !== false && type !== 'separator';
export type PopupPosition = 'left' | 'right' | 'top' | 'bottom';
export type OptionUpdateHandler = (
  options: MenuOption[]
) => MenuOption[] | void;

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  options: MenuOption[];
  selectedIndex?: number;
  position?: PopupPosition;
  isOpen: boolean;
  onSelect?: (selectedIndex: number) => void;
  onBlur?: () => void;
  onBeforeOpen?: OptionUpdateHandler;
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

        & > * {
          flex-grow: 1;
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
          min-width: 16px;
          height: 16px;
          color: white;
          text-align: right;
        }
      }
    }
  `;
};

export const optionSelectBlinkInterval = 100;
export const optionSelectBlinkRepeat = 2;

export function Menu(props: Props) {
  const [
    {
      children,
      isOpen,
      options: defaultOptions,
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
  const [options, setOptions] = useState(defaultOptions);

  const onWheelHandler = (e: WheelEvent) => e.preventDefault();

  const onMouseDownHandler = (e: MouseEvent) => {
    const isMenuEvent =
      e.target === current?.parentNode ||
      current?.contains(e.target as Element);
    if (!isMenuEvent) {
      onBlur && onBlur();
    }
  };

  useEffect(() => setOptions(defaultOptions), [defaultOptions]);

  useEffect(() => {
    if (current) {
      const targetElement = current.querySelector(':scope > *')! as HTMLElement;
      const menuContentElement = current.querySelector(
        ':scope > .menucontent'
      )! as HTMLElement;
      if (isOpen && !hasOpened) {
        // open
        if (onBeforeOpen) {
          const updatedOption = onBeforeOpen(options);
          if (Array.isArray(updatedOption)) {
            setOptions(updatedOption);
          }
        }
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
    const option = options[index];
    if (option.enabled !== false && onSelect) {
      multiFire(
        (done) => {
          if (ref.current) {
            const li = ref.current.querySelector(
              `li[data-index="${index}"`
            ) as HTMLLIElement;
            li.classList.add('selected');
            setTimeout(() => {
              li.classList.remove('selected');
              done();
            }, optionSelectBlinkInterval);
          }
        },
        optionSelectBlinkRepeat,
        optionSelectBlinkInterval
      ).then(() => {
        if (option.type === 'checked') {
          option.value = !option.value;
          setOptions(options);
        }
        onSelect(index);
      });
    }
  };

  const hasIcon = !!options.find(
    (option) => !!(option.icon || option.type === 'checked')
  );
  const hasShortcut = !!options.find((option) => !!option.shortCut);

  const getOption = (option: MenuOption) => {
    const { label, value, type, shortCut } = option;
    const labelEl = (
      <Label enabled={isOptionEnabled(option)} text={label || String(value)} />
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

  const getLIClassName = (option: MenuOption, index: number) =>
    isOptionEnabled(option)
      ? index === selectedIndex
        ? 'selected'
        : ''
      : 'disabled';

  return (
    <div ref={ref} css={css} className="menu">
      {children}
      <ul className="menucontent">
        {options.map((option, index) => (
          <li
            data-index={index}
            onClick={onOptionClickHandler(index)}
            className={getLIClassName(option, index)}
          >
            {getOption(option)}
          </li>
        ))}
      </ul>
    </div>
  );
}
