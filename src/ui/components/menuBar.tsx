/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Label } from './label';
import { Icon } from './icon';
import { init, multiFire } from './util';
import { highlightColor, menuBorder, noSelect } from './theme';
import { MenuItem } from './menu';

export interface MenuBarItem {
  label: string;
  menu: MenuItem;
}

export interface Props {}

export const defaultProps: Props = {
  enabled: true,
  position: 'bottom',
  isOpen: false,
  items: [],
  selectedIndex: -1,
};

export const style = ({}: Required<Props>) => {
  return css``;
};

export function MenuBar(props: Props) {
  const [{}, css] = init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const current = ref.current;

  return <div ref={ref} css={css} className="menubar"></div>;
}
