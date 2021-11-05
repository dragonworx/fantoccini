/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton, Props as AbstractButtonProps } from './abstractButton';
import {
  HBoxLayout,
  defaultProps as boxLayoutDefaultProps,
} from '../layout/box';
import { getProps } from './util';

export type Props = {
  label?: string;
  icon?: string;
  iconWidth?: number;
  iconBorder?: boolean;
  spacing?: number;
  margin?: number;
} & Omit<AbstractButtonProps, 'children'>;

export const defaultProps: Props = {
  enabled: true,
  margin: boxLayoutDefaultProps.margin,
  spacing: boxLayoutDefaultProps.spacing,
};

export function PushButton(props: Props) {
  const {
    label,
    icon,
    iconWidth,
    iconBorder,
    enabled,
    isRound,
    canToggle,
    isToggled,
    spacing,
    margin,
    fixedSize,
    width,
    height,
    radius,
    onClick,
    onToggled,
  } = getProps(props, defaultProps);

  const abstractButtonProps: Partial<AbstractButtonProps> = {
    enabled,
    isRound,
    canToggle,
    isToggled,
    fixedSize,
    width,
    height,
    radius,
    onClick,
    onToggled,
  };

  return (
    <AbstractButton {...abstractButtonProps}>
      <HBoxLayout spacing={spacing} margin={margin}>
        {icon !== undefined ? (
          <Icon src={icon} width={iconWidth} border={iconBorder} />
        ) : null}
        {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
      </HBoxLayout>
    </AbstractButton>
  );
}
