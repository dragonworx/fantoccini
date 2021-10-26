/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';
import Color from 'color';

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

export const style = (props: Props) => {
  const { enabled, link, onClick } = props;
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
    &:active {
      ${isInteractive ? 'color:' + textColor.lighten(0.2).hex() : ''};
    }
  `;
};

export function Label(props: Props) {
  props = {
    ...defaultProps,
    ...props,
  };
  const { enabled, onClick } = props;
  return (
    <label
      css={style(props)}
      className="label"
      onClick={enabled ? onClick : undefined}
      tabIndex={enabled && onClick ? 0 : undefined}
    >
      {props.text}
    </label>
  );
}
