/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useState } from 'react';
import { Alignment, BoxLayout, Direction } from '../layout/box';
import { getProps } from './util';
import { RadioButton } from './radioButton';
import { LabelPosition } from './label';

export interface Option {
  name: string;
  label: string;
  value: any;
}

export type onChangeHandler = (value: any) => void;

export interface Props {
  options: Option[];
  selectedValue?: any;
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

const getAlign = (
  direction: Direction,
  labelPosition: LabelPosition
): Alignment => {
  if (direction === 'vertical') {
    if (labelPosition === 'left') {
      return 'end';
    } else if (labelPosition === 'right') {
      return 'start';
    }
    return 'center';
  } else {
    return 'center';
  }
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

  const onToggledCallback = (
    _isToggled: boolean,
    _name: string,
    value: any
  ) => {
    setCurrentValue(value);
    onChange && onChange(value);
  };

  return (
    <div className="radioButtonGroup">
      <BoxLayout
        direction={direction}
        align={getAlign(direction, labelPosition)}
        justify="space-evenly"
      >
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
    </div>
  );
}
