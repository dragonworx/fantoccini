/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, useRef } from 'react';
import Color from 'color';
import { init } from './util';

export interface Props {
  text: string;
  enabled?: boolean;
  link?: boolean;
  onClick?: () => void;
}

export const defaultProps: Props = {
  text: 'Label',
  enabled: true,
  link: false,
};

export const style = ({ enabled, link, onClick }: Required<Props>) => {
  const shadowColor = enabled ? '#080808' : '#383838';
  const textColor = Color(link && enabled ? '#57b1ff' : '#bdbec0');
  const isInteractive = !!(link || onClick) && enabled;

  return css`
    box-sizing: border-box;
    user-select: none;
    text-shadow: 1px 1px 1px ${shadowColor};
    color: ${enabled ? textColor.hex() : textColor.darken(0.35).hex()};
    text-decoration: ${link ? 'underline' : 'normal'};
    cursor: ${isInteractive ? 'pointer' : 'inherit'};

    &:active,
    &.active {
      ${isInteractive ? 'color:' + textColor.lighten(0.2).hex() : ''}
    }
  `;
};

export function Label(props: Props) {
  const [{ enabled, onClick }, css] = init(props, defaultProps, style);
  const ref = useRef<HTMLLabelElement>(null);
  const isInteractive = !!(enabled && onClick);

  const onKeyDownHandler = (e: KeyboardEvent<HTMLLabelElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && isInteractive) {
      ref.current?.classList.add('active');
      setTimeout(() => {
        onClick();
        setTimeout(() => ref.current?.classList.remove('active'), 150);
      }, 0);
    }
  };

  return (
    <label
      ref={ref}
      css={css}
      className="label"
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={onKeyDownHandler}
    >
      {props.text}
    </label>
  );
}
