/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { init } from '../util';

export interface Props {
  onClick?: () => void;
  enabled?: boolean;
  border?: boolean;
  src?: string;
  width?: number;
  height?: number;
}

export const defaultProps: Props = {
  enabled: true,
  border: false,
};

export const style = ({ width, height, border }: Required<Props>) => css`
  box-sizing: border-box;
  user-select: none;
  display: inline-block;
  vertical-align: middle;
  width: ${width !== undefined ? `${width}px` : 'auto'};
  height: ${height !== undefined ? `${height}px` : 'auto'};
  border: ${border ? '1px outset #9c9c9c' : 'none'};
`;

export function Icon(props: Props) {
  const [{ src, enabled, onClick }, css] = init(props, defaultProps, style);
  const iconPath =
    src.indexOf('#') === 0 ? `img/icons/${src.replace('#', '')}.svg` : src;
  return (
    <img
      src={iconPath}
      css={css}
      className="icon"
      draggable={false}
      onClick={enabled ? onClick : undefined}
    />
  );
}
