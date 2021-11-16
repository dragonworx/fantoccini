/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useState,
  useRef,
  useEffect,
  FocusEvent,
} from 'react';
import Color from 'color';
import { getProps, getCss } from './util';
import {
  reset,
  noSelect,
  borderRadiusSize,
  outline,
  boxBorder,
  buttonShadow,
  buttonShadowInset,
  buttonBg,
  buttonBgHover,
  buttonContentBorder,
} from './theme';

export type ToggleMode = 'binary' | 'single';
export type Appearance = 'full' | 'bare';

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  canToggle?: boolean;
  toggleMode?: ToggleMode;
  toggleOnDown?: boolean;
  isToggled?: boolean;
  width?: number;
  height?: number;
  isRound?: boolean;
  radius?: number;
  fixedSize?: boolean;
  appearance?: Appearance;
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseOut?: (e: MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void | false;
  onKeyUp?: (e: KeyboardEvent) => void | false;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onToggled?: (isToggled: boolean) => void;
}

export const defaultProps: Props = {
  enabled: true,
  canToggle: false,
  toggleMode: 'binary',
  toggleOnDown: false,
  isToggled: false,
  width: 20,
  height: 20,
  isRound: false,
  fixedSize: false,
  appearance: 'full',
};

const isInteractive = (
  enabled: boolean,
  canToggle: boolean,
  onClick: (e: MouseEvent) => void
) => !!(enabled && (onClick || canToggle));

export const cssStyle =
  (isCurrentlyToggled: boolean) =>
  ({
    enabled,
    toggleMode,
    width,
    height,
    isRound,
    fixedSize,
    radius,
    appearance,
  }: Required<Props>) => {
    if (appearance === 'bare') {
      return css``;
    }

    const activeStyle = css`
      ${buttonBg(enabled, true)}

      & > .buttoncontent {
        ${buttonContentBorder}
        top: 1px;
        left: 1px;
      }
    `;

    const borderRadius = css`
      border-radius: ${radius !== undefined
        ? radius
        : isRound
        ? Number.MAX_SAFE_INTEGER
        : borderRadiusSize}px;
    `;

    return css`
      ${reset}
      ${borderRadius}
      ${noSelect}
      ${isCurrentlyToggled ? buttonShadowInset : buttonShadow}
      ${buttonBg(enabled)}
      border: 1px solid #030c17;
      min-width: ${width}px;
      min-height: ${height}px;
      width: ${fixedSize ? `${width}px` : '100%'};
      height: ${fixedSize ? `${height}px` : 'auto'};
      color: ${enabled ? '#bdbec0' : '#808080'};
      display: inline-block;
      position: relative;

      &:focus {
        ${outline};
      }

      & * {
        box-sizing: border-box;
      }

      &:hover {
        ${buttonBgHover(enabled, isCurrentlyToggled)}
      }

      &:active,
      &.active {
        ${activeStyle}
      }

      & > .buttoncontent {
        ${borderRadius}
        ${noSelect}
        ${boxBorder}
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        position: ${isRound && toggleMode === 'single'
          ? 'absolute'
          : 'relative'};

        & > .boxlayout {
          flex-grow: 1;
        }
      }

      ${isCurrentlyToggled ? activeStyle : undefined}

      ${!isCurrentlyToggled && toggleMode === 'single'
        ? css`
            & > .buttoncontent img {
              display: none;
            }
          `
        : undefined}
    `;
  };

export function AbstractButton(props: Props) {
  const {
    children,
    enabled,
    canToggle,
    isRound,
    toggleMode,
    toggleOnDown,
    isToggled,
    onClick,
    onMouseDown,
    onMouseUp,
    onMouseOver,
    onMouseOut,
    onKeyDown,
    onKeyUp,
    onFocus,
    onBlur,
    onToggled,
  } = getProps(props, defaultProps);
  const [isCurrentlyToggled, setIsCurrentlyToggled] = useState(!!isToggled);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCurrentlyToggled(isToggled);
  }, [isToggled]);

  const onClickHandler = (e: MouseEvent) => {
    if (isInteractive(enabled, canToggle, onClick)) {
      if (!toggleOnDown) {
        onToggleHandler();
      }
      onClick && onClick(e);
    }
  };

  const onToggleHandler = () => {
    if (canToggle) {
      if (isRound && toggleMode === 'single' && isCurrentlyToggled) {
        return;
      }
      const newValue = !isCurrentlyToggled;
      setIsCurrentlyToggled(newValue);
      onToggled && onToggled(newValue);
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      ref.current?.classList.add('active');
      e.preventDefault();
      setTimeout(() => {
        onClickHandler(e as any as MouseEvent);
        setTimeout(() => {
          ref.current?.classList.remove('active');
          if (toggleOnDown && !isToggled) {
            onToggleHandler();
          }
        }, 150);
      }, 0);
    }
    onKeyDown && onKeyDown(e);
  };

  const onKeyUpHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const result = onKeyUp && onKeyUp(e);
      if (result === false) {
        return;
      }
    } else {
      onKeyUp && onKeyUp(e);
    }
  };

  const onFocusHandler = (e: FocusEvent<HTMLDivElement>) => {
    enabled && onFocus && onFocus(e);
  };

  const onBlurHandler = (e: FocusEvent<HTMLDivElement>) => {
    enabled && onBlur && onBlur(e);
  };

  const onMouseDownHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (enabled && toggleOnDown) {
      onToggleHandler();
    }
    enabled && onMouseDown && onMouseDown(e);
  };

  const onMouseUpHandler = (e: MouseEvent<HTMLDivElement>) => {
    enabled && onMouseUp && onMouseUp(e);
  };

  const onMouseOverHandler = (e: MouseEvent<HTMLDivElement>) => {
    enabled && onMouseOver && onMouseOver(e);
  };

  const onMouseOutHandler = (e: MouseEvent<HTMLDivElement>) => {
    enabled && onMouseOut && onMouseOut(e);
  };

  return (
    <div
      ref={ref}
      className="abstract-button"
      css={getCss(cssStyle(isCurrentlyToggled), props, defaultProps)}
      tabIndex={enabled ? 0 : undefined}
      onClick={onClickHandler}
      onMouseDown={onMouseDownHandler}
      onMouseUp={onMouseUpHandler}
      onMouseOver={onMouseOverHandler}
      onMouseOut={onMouseOutHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      onKeyDown={onKeyDownHandler}
      onKeyUp={onKeyUpHandler}
    >
      <div className="buttoncontent">{children}</div>
    </div>
  );
}
