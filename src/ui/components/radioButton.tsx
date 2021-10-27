import {
  AbstractToggleButton,
  Props as AbstractButtonProps,
} from './abstractToggleButton';

export type RadioButtonProps = Omit<AbstractButtonProps, 'style'>;

export function RadioButton(props: RadioButtonProps) {
  return AbstractToggleButton({
    ...props,
    style: 'circle',
  });
}
