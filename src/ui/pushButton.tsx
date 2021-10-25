/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';

export interface Props {
  label?: string;
  icon?: string;
  iconWidth?: number;
  enabled?: boolean;
  onClick?: () => void;
}

export const defaultProps: Props = {
  enabled: true,
};

export function PushButton(props: Props) {
  const { label, icon, iconWidth, enabled, onClick } = {
    ...defaultProps,
    ...props,
  };
  return (
    <AbstractButton enabled={enabled} onClick={onClick}>
      {icon !== undefined ? <Icon src={icon} width={iconWidth} /> : null}
      {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
    </AbstractButton>
  );
}
