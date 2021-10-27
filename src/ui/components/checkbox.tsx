import {
  AbstractToggleButton,
  Props as AbstractButtonProps,
  CheckBoxStyle,
} from './abstractToggleButton';

export type CheckBoxProps = Omit<AbstractButtonProps, 'style'> & {
  style?: CheckBoxStyle;
};

export function CheckBox(props: CheckBoxProps) {
  return AbstractToggleButton(props);
}
