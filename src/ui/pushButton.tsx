/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton, Props as AbstractButtonProps } from './abstractButton';

export type Props = {
  label?: string;
  icon?: string;
  iconWidth?: number;
  iconBorder?: boolean;
} & Pick<AbstractButtonProps, 'enabled' | 'toggle' | 'onClick' | 'onToggled'>;

export const defaultProps: Props = {
  enabled: true,
};

export function PushButton(props: Props) {
  const {
    label,
    icon,
    iconWidth,
    iconBorder,
    enabled,
    toggle,
    onClick,
    onToggled,
  } = {
    ...defaultProps,
    ...props,
  };
  const abstractButtonProps: Partial<AbstractButtonProps> = {
    enabled,
    toggle,
    onClick,
    onToggled,
  };
  return (
    <AbstractButton {...abstractButtonProps}>
      {icon !== undefined ? (
        <Icon src={icon} width={iconWidth} border={iconBorder} />
      ) : null}
      {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
    </AbstractButton>
  );
}
