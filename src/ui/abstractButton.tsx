/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, ReactNode, useState, useRef } from 'react';
import Color from 'color';

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  toggle?: boolean;
  isToggled?: boolean;
  onClick?: () => void;
  onToggled?: (isToggled: boolean) => void;
}

export const defaultProps: Props = {
  enabled: true,
};

const isInteractive = ({ enabled, toggle, onClick }: Props) =>
  !!(enabled && (onClick || toggle));

export const style = (props: Props, toggled: boolean) => {
  const { enabled } = props;

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

  return css`
    box-sizing: border-box;
    background: linear-gradient(0deg, ${darkColor} 0, #2f343c 100%);
    border-radius: 5px;
    border: 1px solid #030c17;
    min-width: 20px;
    min-height: 20px;
    cursor: ${isInteractive(props) ? 'pointer' : 'inherit'};
    color: ${enabled ? '#bdbec0' : '#808080'};
    display: inline-block;
    position: relative;

    &:focus {
      outline: 1px outset #ccc;
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
      border-radius: 5px;
      width: 100%;
      height: 100%;
      border: 1px solid #999;
      border-left-color: #555;
      border-right-color: #555;
      border-bottom-color: #444;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      user-select: none;
    }

    ${toggled ? activeStyle : undefined}
  `;
};

export function AbstractButton(props: Props) {
  props = { ...defaultProps, ...props };
  const { children, enabled, toggle, isToggled, onClick, onToggled } = props;
  const [toggled, setToggled] = useState(!!isToggled);
  const ref = useRef<HTMLDivElement>(null);

  const onClickHandler = () => {
    if (isInteractive(props)) {
      if (toggle) {
        const newValue = !toggled;
        setToggled(newValue);
        onToggled && onToggled(newValue);
      }
      onClick && onClick();
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      ref.current?.classList.add('active');
      setTimeout(() => {
        onClickHandler();
        setTimeout(() => ref.current?.classList.remove('active'), 150);
      }, 0);
    }
  };

  return (
    <div
      ref={ref}
      className="abstract-button"
      css={style(props, toggled)}
      tabIndex={enabled ? 0 : undefined}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
    >
      <div className="button-content">{children}</div>
    </div>
  );
}
