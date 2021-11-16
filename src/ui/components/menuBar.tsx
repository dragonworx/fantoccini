/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useRef, useState, useEffect, ReactNode, MouseEvent } from 'react';
import { Label } from './label';
import { Icon } from './icon';
import { init, multiFire } from './util';
import { buttonBg, buttonContentBorder } from './theme';
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

export const style = ({ enabled }: Required<Props>) => {
  return css`
    display: flex;
    height: 24px;
    width: 100%;

    ${buttonBg(enabled)}
    ${buttonContentBorder}
  `;
};

export function MenuBar(props: Props) {
  const [{ items }, css] = init(props, defaultProps, style);

  const [selected, setSelected] = useState(-1);
  const [isToggled, setIsToggled] = useState(false);

  const onMouseOverHandler = (i: number) => (e: MouseEvent) => {
    setSelected(i);
  };

  const onToggledHandler = (isCurrentlyToggled: boolean) => {
    setIsToggled(isCurrentlyToggled);
  };

  return (
    <div css={css} className="menubar">
      {items.map((menuItem, i) => (
        <Select
          label={menuItem.label}
          options={menuItem.menu}
          appearance="bare"
          isOpen={selected === i && isToggled}
          onMouseOver={onMouseOverHandler(i)}
          onToggled={onToggledHandler}
        />
      ))}
    </div>
  );
}
