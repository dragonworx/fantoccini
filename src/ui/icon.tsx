/** @jsx jsx */
import { css, jsx } from '@emotion/react';

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

export const style = (props: Props) => {
  const { width, height, border } = props;
  return css`
    box-sizing: border-box;
    user-select: none;
    display: inline-block;
    vertical-align: middle;
    width: ${width !== undefined ? `${width}px` : 'auto'};
    height: ${height !== undefined ? `${height}px` : 'auto'};
    border: ${border ? '1px outset #9c9c9c' : 'none'};
  `;
};

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
