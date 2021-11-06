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
import { reset, noSelect, borderRadiusSize, outline } from './theme';

export type ToggleMode = 'binary' | 'single';

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  canToggle?: boolean;
  toggleMode?: ToggleMode;
  isToggled?: boolean;
  width?: number;
  height?: number;
  isRound?: boolean;
  radius?: number;
  fixedSize?: boolean;
  onClick?: (e: MouseEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onToggled?: (isToggled: boolean) => void;
}

export const defaultProps: Props = {
  enabled: true,
  canToggle: false,
  toggleMode: 'binary',
  isToggled: false,
  width: 20,
  height: 20,
  isRound: false,
  fixedSize: false,
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
  }: Required<Props>) => {
    const darkColor = enabled ? '#24282f' : '#363c47';

    const activeStyle = css`
      background: linear-gradient(
        180deg,
        ${Color(darkColor)
            .darken(enabled ? 0.3 : 0.1)
            .hex()}
          0,
        #2f343c 100%
      );

      & > .button-content {
        border: 1px solid #444;
        border-left-color: #555;
        border-right-color: #555;
        border-bottom-color: #999;
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
      background: linear-gradient(0deg, ${darkColor} 0, #2f343c 100%);
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
        background: linear-gradient(180deg, ${darkColor} 0, #3b424c 100%);
      }

      &:active,
      &.active {
        ${activeStyle}
      }

      & > .button-content {
        ${borderRadius}
        ${noSelect}
        width: 100%;
        height: 100%;
        border: 1px solid #999;
        border-left-color: #555;
        border-right-color: #555;
        border-bottom-color: #444;
        display: flex;
        align-items: center;
        justify-content: center;
        position: ${isRound && toggleMode === 'single'
          ? 'absolute'
          : 'relative'};

        & > .box-layout {
          flex-grow: 1;
        }
      }

      ${isCurrentlyToggled ? activeStyle : undefined}

      ${!isCurrentlyToggled && toggleMode === 'single'
        ? css`
            & > .button-content img {
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
    isToggled,
    onClick,
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
      if (canToggle) {
        if (isRound && toggleMode === 'single' && isCurrentlyToggled) {
          return;
        }
        const newValue = !isCurrentlyToggled;
        setIsCurrentlyToggled(newValue);
        onToggled && onToggled(newValue);
      }
      onClick && onClick(e);
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      ref.current?.classList.add('active');
      setTimeout(() => {
        onClickHandler(e as any as MouseEvent);
        setTimeout(() => ref.current?.classList.remove('active'), 150);
      }, 0);
    }
  };

  const onFocusHandler = (e: FocusEvent<HTMLDivElement>) => {
    enabled && onFocus && onFocus(e);
  };

  const onBlurHandler = (e: FocusEvent<HTMLDivElement>) => {
    enabled && onBlur && onBlur(e);
  };

  return (
    <div
      ref={ref}
      className="abstract-button"
      css={getCss(cssStyle(isCurrentlyToggled), props, defaultProps)}
      tabIndex={enabled ? 0 : undefined}
      onClick={onClickHandler}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      onKeyDown={onKeyDownHandler}
    >
      <div className="button-content">{children}</div>
    </div>
  );
}
