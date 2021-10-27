/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton, Props as AbstractButtonProps } from './abstractButton';
import { BoxLayout } from '../layout/box';
import { getProps, getCss } from './util';

export type CheckBoxStyle = 'tick' | 'cross';
export type ToggleButtonStyle = CheckBoxStyle | 'circle';

export type Props = {
  label?: string;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  style?: ToggleButtonStyle;
} & Pick<AbstractButtonProps, 'enabled' | 'onToggled'>;

export const defaultProps: Props = {
  enabled: true,
  labelPosition: 'right',
  style: 'cross',
};

export const cssStyle = ({ enabled }: Required<Props>) => css`
  & .button-content {
    position: absolute;
    opacity: ${enabled ? 1 : 0.5};
  }
`;

export function AbstractToggleButton(props: Props) {
  const { label, labelPosition, style, enabled, onToggled } = getProps(
    props,
    defaultProps
  );
  const abstractButtonProps: Pick<
    AbstractButtonProps,
    'enabled' | 'onToggled'
  > = {
    enabled,
    onToggled,
  };
  return (
    <div css={getCss(cssStyle, props, defaultProps)} className="checkbox">
      <BoxLayout
        margin={0}
        direction={
          labelPosition === 'left' || labelPosition === 'right'
            ? 'horizontal'
            : 'vertical'
        }
        reversed={labelPosition === 'left' || labelPosition === 'top'}
      >
        <AbstractButton
          {...abstractButtonProps}
          toggle={true}
          round={style === 'circle'}
        >
          <Icon src={`img/icons/${style}.svg`} width={10} />
        </AbstractButton>
        {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
      </BoxLayout>
    </div>
  );
}
