/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { init } from './util';
import { PushButton } from './pushButton';
import { TextField } from './textfield';
import { LabelPosition } from './label';
import { BoxLayout } from '../layout/box';

const textFieldWidth = 60;
const textFieldHeight = 25;
const buttonWidth = Math.round(textFieldHeight * 0.75);
const buttonHeight = Math.round(buttonWidth / 2);
const iconSize = 10;
const numericKeys = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  '-',
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
  'Delete',
  'Tab',
];

export const numericKeyFilter = (key: string, text: string) => {
  console.log(key);
  if (numericKeys.indexOf(key) === -1) {
    return false;
  }
  if (key === '.' && text.indexOf('.') > -1) {
    return false;
  }
  if (key === '-' && text.indexOf('-') > -1) {
    return false;
  }
  return true;
};

export interface Props {
  enabled?: boolean;
  value?: number;
  label?: string;
  labelPosition?: LabelPosition;
  onChange?: (value: number) => void;
  onAccept?: (value: number) => void;
}

export const defaultProps: Props = {
  enabled: true,
  labelPosition: 'left',
  value: 0,
};

export function NumericInput(props: Props) {
  const [{ enabled, value, label, labelPosition, onChange, onAccept }, css] =
    init(props, defaultProps);

  const onKeyDownHandler = (key: string, text: string) => {
    console.log('***', key, text);
    if (key === '-' && text.indexOf('-') === -1) {
      return `-${text}`;
    }
  };

  return (
    <TextField
      enabled={enabled}
      text={`${value}`}
      label={label}
      labelPosition={labelPosition}
      width={textFieldWidth}
      height={textFieldHeight}
      onKeyFilter={numericKeyFilter}
      onKeyDown={onKeyDownHandler}
    >
      <BoxLayout
        direction="vertical"
        height={textFieldHeight}
        margin={0}
        spacing={0}
      >
        <PushButton
          icon="img/icons/increment-up.svg"
          iconWidth={iconSize}
          width={buttonWidth}
          height={buttonHeight}
          fixedSize={true}
          radius={0}
        />
        <PushButton
          icon="img/icons/increment-down.svg"
          iconWidth={iconSize}
          width={buttonWidth}
          height={buttonHeight}
          fixedSize={true}
          radius={0}
        />
      </BoxLayout>
    </TextField>
  );
}
