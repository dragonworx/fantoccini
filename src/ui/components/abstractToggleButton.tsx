/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Label } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { BoxLayout } from '../layout/box';
import { getProps, getCss } from './util';

export type CheckBoxStyle = 'tick' | 'cross';
export type ToggleButtonStyle = CheckBoxStyle | 'circle';
export type LabelPosition = 'left' | 'right' | 'top' | 'bottom';
export type onToggledHandler = (
  isToggled: boolean,
  name: string,
  value: any
) => void;

export type Props = {
  name?: string;
  value?: any;
  label?: string;
  enabled?: boolean;
  labelPosition?: LabelPosition;
  style?: ToggleButtonStyle;
  isToggled?: boolean;
  onToggled?: onToggledHandler;
};

export const defaultProps: Props = {
  name: '',
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
  const {
    name,
    value,
    label,
    labelPosition,
    style,
    enabled,
    isToggled,
    onToggled,
  } = getProps(props, defaultProps);

  const onToggledHandler = (isToggled: boolean) =>
    onToggled && onToggled(isToggled, name, value);

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
          enabled={enabled}
          canToggle={true}
          toggleMode={style === 'circle' ? 'single' : 'binary'}
          isToggled={isToggled}
          isRound={style === 'circle'}
          onToggled={onToggledHandler}
        >
          <Icon src={`img/icons/${style}.svg`} width={10} />
        </AbstractButton>
        {label !== undefined ? <Label text={label} enabled={enabled} /> : null}
      </BoxLayout>
    </div>
  );
}
