/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';
import { Label } from './label';
import { MenuBar, MenuBarItem } from './menuBar';
import { borderRadius, boxBorder, panelBorder, reset } from './theme';
import { init } from '../util';

export interface Props {
  children?: ReactNode;
  width?: number;
  height?: number;
  title?: string;
  menu?: MenuBarItem[];
}

export const defaultProps: Props = {};

export const style = ({ width, height }: Props) => css`
  ${borderRadius}
  ${reset}
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${width ? `${width}px` : '100%'};
  height: ${height ? `${height}px` : '100%'};
  background: linear-gradient(0deg, #515254 0, #49494c 100%);
  padding: 5px;

  .panel-title {
    background: linear-gradient(0deg, #47515a 0, #2c2f34 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    ${panelBorder}
  }

  .panel-inner {
    ${boxBorder}
    ${borderRadius}
    flex-grow: 1;
    width: 100%;
    height: 100%;
    padding: 5px;
    min-height: 20px;
  }
`;

export function Panel(props: Props) {
  const [{ children, title, menu }, css] = init(props, defaultProps, style);

  return (
    <div css={css} className="panel">
      {title ? (
        <div className="panel-title">
          <Label text={title} />
        </div>
      ) : null}
      {menu ? <MenuBar items={menu}></MenuBar> : null}
      <div className="panel-inner">{children}</div>
    </div>
  );
}
