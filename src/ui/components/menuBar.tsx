/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode } from 'react';
import { Label } from './label';
import { Icon } from './icon';
import { init, multiFire } from './util';
import { highlightColor, menuBorder, noSelect } from './theme';
import { MenuItem } from './menu';
import { Select } from './select';

export interface MenuBarItem {
  label: string;
  menu: MenuItem[];
}

export interface Props {
  enabled?: boolean;
  items: MenuBarItem[];
}

export const defaultProps: Props = {
  enabled: true,
  items: [],
};

export const style = ({}: Required<Props>) => {
  return css`
    display: flex;
    height: 24px;
  `;
};

export function MenuBar(props: Props) {
  const [{ items }, css] = init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const current = ref.current;

  return (
    <div ref={ref} css={css} className="menubar">
      {items.map((menuItem) => (
        <Select
          label={menuItem.label}
          options={menuItem.menu}
          appearance="bare"
        />
      ))}
    </div>
  );
}
