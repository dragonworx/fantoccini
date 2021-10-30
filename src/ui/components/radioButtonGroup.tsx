/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import { BoxLayout, Direction } from '../layout/box';
import { getProps, getCss } from './util';
import { RadioButton } from './radioButton';
import { LabelPosition, onToggledHandler } from './abstractToggleButton';

export interface Option {
  name: string;
  label: string;
  value: any;
}

export interface Props {
  options: Option[];
  selectedValue: any;
  enabled?: boolean;
  direction?: Direction;
  labelPosition?: LabelPosition;
  onToggled?: onToggledHandler;
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
    onToggled,
  } = getProps(props, defaultProps);

  const [currentValue, setCurrentValue] = useState(selectedValue);

  const onToggledCallback = (isToggled: boolean, name: string, value: any) => {
    setCurrentValue(value);
  };

  return (
    <BoxLayout direction={direction}>
      {options.map(({ name, label, value }) => (
        <RadioButton
          enabled={enabled}
          name={name}
          label={label}
          value={value}
          isToggled={value === currentValue}
          onToggled={onToggledCallback}
        />
      ))}
    </BoxLayout>
  );
}
