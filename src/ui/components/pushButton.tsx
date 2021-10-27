/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton, Props as AbstractButtonProps } from './abstractButton';
import { HBoxLayout } from '../layout/box';
import { getProps } from './util';

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
  } = getProps(props, defaultProps);

  const abstractButtonProps: Partial<AbstractButtonProps> = {
    enabled,
    toggle,
    onClick,
    onToggled,
  };

  return (
    <AbstractButton {...abstractButtonProps}>
      <HBoxLayout>
        {icon !== undefined ? (
          <Icon src={icon} width={iconWidth} border={iconBorder} />
        ) : null}
        {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
      </HBoxLayout>
    </AbstractButton>
  );
}
