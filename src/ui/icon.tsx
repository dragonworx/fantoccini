/** @jsx jsx */
import { css, jsx } from '@emotion/react';

export interface Props {
  onClick?: () => void;
  enabled?: boolean;
  src?: string;
  width?: number;
  height?: number;
}

export const defaultProps: Props = {
  enabled: true,
};

export const style = (props: Props) => css`
  box-sizing: border-box;
  user-select: none;
  display: inline-block;
  vertical-align: middle;
  width: ${props.width !== undefined ? `${props.width}px` : 'auto'};
  height: ${props.height !== undefined ? `${props.height}px` : 'auto'};
  border: 1px outset #9c9c9c;
`;

export function Icon(props: Props) {
  props = { ...defaultProps, ...props };
  return (
    <img
      src={props.src}
      css={style(props)}
      draggable={false}
      onClick={props.enabled ? props.onClick : undefined}
    />
  );
}
