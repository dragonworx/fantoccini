/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton, Props as AbstractButtonProps } from './abstractButton';

export type CheckBoxStyle = 'tick' | 'cross';

export type Props = {
  label?: string;
  style?: CheckBoxStyle;
} & Pick<AbstractButtonProps, 'enabled' | 'onToggled'>;

export const defaultProps: Props = {
  enabled: true,
  style: 'cross',
};

export const cssStyle = () => {
  return css`
    width: 20px;
    height: 20px;

    & .button-content {
      position: absolute;
    }
  `;
};

export function CheckBox(props: Props) {
  const { label, style, enabled, onToggled } = {
    ...defaultProps,
    ...props,
  };
  const abstractButtonProps: Partial<AbstractButtonProps> = {
    enabled,
    onToggled,
  };
  return (
    <div css={cssStyle()} className="checkbox">
      <AbstractButton {...abstractButtonProps} toggle={true}>
        <Icon src={`img/icons/${style}.svg`} width={10} />
      </AbstractButton>
      {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
    </div>
  );
}
