/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { getProps, getCss } from './util';

export type CheckBoxStyle = 'tick' | 'cross';
export type ToggleButtonStyle = CheckBoxStyle | 'circle';
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
  fixedSize?: boolean;
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
    enabled,
    label,
    labelPosition,
    name,
    value,
    style,
    isToggled,
    fixedSize,
    onToggled,
  } = getProps(props, defaultProps);

  const onToggledHandler = (isToggled: boolean) =>
    onToggled && onToggled(isToggled, name, value);

  return (
    <div
      css={getCss(cssStyle, props, defaultProps)}
      className={style === 'circle' ? 'radiobutton' : 'checkbox'}
    >
      <Label enabled={enabled} text={label} position={labelPosition}>
        <AbstractButton
          enabled={enabled}
          canToggle={true}
          toggleMode={style === 'circle' ? 'single' : 'binary'}
          isToggled={isToggled}
          isRound={style === 'circle'}
          fixedSize={fixedSize}
          onToggled={onToggledHandler}
        >
          <Icon src={`#${style}`} width={10} />
        </AbstractButton>
      </Label>
    </div>
  );
}
