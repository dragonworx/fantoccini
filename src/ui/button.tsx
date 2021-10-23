/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';

export interface Props {
  children?: ReactNode;
  onClick?: () => void;
  enabled?: boolean;
}

export const defaultProps: Props = {
  enabled: true,
};

export const style = (props: Props) => css`
  box-sizing: border-box;
  background: linear-gradient(0deg, #24282f 0, #2f343c 100%);
  border-radius: 5px;
  border: 1px solid #030c17;
  min-width: 30px;
  min-height: 30px;
  cursor: pointer;
  color: ${props.enabled ? '#bdbec0' : '#808080'};
  display: inline-block;

  &:hover {
    background: linear-gradient(180deg, #24282f 0, #2f343c 100%);
  }

  &:active {
    background: linear-gradient(180deg, #1a1d22 0, #2f343c 100%);
    color: ${props.enabled ? '#dbdcdf' : '#808080'};

    & > div {
      border: 1px solid #444;
      border-left-color: #555;
      border-right-color: #555;
      border-bottom-color: #999;
      top: 1px;
      left: 1px;
    }
  }

  & > div {
    text-shadow: 1px 1px 1px #080808;
    border-radius: 5px;
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid #999;
    border-left-color: #555;
    border-right-color: #555;
    border-bottom-color: #444;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px 10px;
    position: relative;
    user-select: none;

    & > * {
      margin-right: 5px;
    }

    & > *:last-child {
      margin-right: 0;
    }
  }
`;

export function Button(props: Props) {
  props = { ...defaultProps, ...props };
  return (
    <div css={style(props)} onClick={props.enabled ? props.onClick : undefined}>
      <div>{props.children}</div>
    </div>
  );
}
