/** @jsx jsx */
import { css, jsx } from '@emotion/react';
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

export const style = () => {
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    & > * {
      margin: 5px 5px;
    }

    & > *:first-child {
      margin-left: 10px;
    }

    & > *:last-child {
      margin-right: 10px;
    }
  `;
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
      <div css={style()} className="pushbutton">
        {icon !== undefined ? (
          <Icon src={icon} width={iconWidth} border={iconBorder} />
        ) : null}
        {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
      </div>
    </AbstractButton>
  );
}
