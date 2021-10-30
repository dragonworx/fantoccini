import {
  AbstractToggleButton,
  Props as AbstractButtonProps,
} from './abstractToggleButton';

export type Props = Omit<AbstractButtonProps, 'style'>;

export function RadioButton(props: Props) {
  return AbstractToggleButton({
    ...props,
    style: 'circle',
  });
}
