/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';

export interface Props {
  children?: ReactNode;
}
export function Button(props: Props) {
  return (
    <div css={style}>
      <div>{props.children}</div>
    </div>
  );
}

export const style = css`
  background: linear-gradient(0deg, #24282f 0, #2f343c 100%);
  border-radius: 5px;
  border: 1px solid #030c17;
  width: 80px;
  height: 30px;
  cursor: pointer;

  &:hover {
    background: linear-gradient(180deg, #24282f 0, #2f343c 100%);
  }

  & > div {
    color: #bdbec0;
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
    padding: 3px 0px;
    position: relative;
  }

  & > div:hover {
    color: #fff;
    border-color: #999;
  }
`;
