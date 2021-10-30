/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState } from 'react';
import { BoxLayout, Direction } from '../layout/box';
import { getProps } from './util';
import { RadioButton } from './radioButton';
import { LabelPosition } from './abstractToggleButton';

export interface Option {
  name: string;
  label: string;
  value: any;
}

export type onChangeHandler = (name: string, value: any) => void;

export interface Props {
  options: Option[];
  selectedValue: any;
  enabled?: boolean;
  direction?: Direction;
  labelPosition?: LabelPosition;
  onChange?: onChangeHandler;
}

export const defaultProps: Props = {
  enabled: true,
  direction: 'vertical',
  labelPosition: 'right',
  options: [],
  selectedValue: undefined,
};

export function RadioButtonGroup(props: Props) {
  const {
    options,
    selectedValue,
    direction,
    enabled,
    labelPosition,
    onChange,
  } = getProps(props, defaultProps);

  const [currentValue, setCurrentValue] = useState(selectedValue);

  const onToggledCallback = (_isToggled: boolean, name: string, value: any) => {
    setCurrentValue(value);
    onChange && onChange(name, value);
  };

  return (
    <BoxLayout direction={direction}>
      {options.map(({ name, label, value }) => (
        <RadioButton
          enabled={enabled}
          name={name}
          label={label}
          value={value}
          labelPosition={labelPosition}
          isToggled={value === currentValue}
          onToggled={onToggledCallback}
        />
      ))}
    </BoxLayout>
  );
}
