/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { init } from '../util';
import {
  useState,
  useEffect,
  MouseEvent as ReactMouseEvent,
  useRef,
  KeyboardEvent,
} from 'react';
import { PushButton } from './pushButton';
import { TextField, InputKeyEvent } from './textfield';
import { LabelPosition } from './label';
import { BoxLayout } from '../layout/box';

export interface Props {
  enabled?: boolean;
  value?: number;
  label?: string;
  labelPosition?: LabelPosition;
  allowDecimal?: boolean;
  incrementMinor?: number;
  incrementMajor?: number;
  onChange?: (value: number) => void;
  onAccept?: (value: number) => void;
}

export const defaultProps: Props = {
  enabled: true,
  labelPosition: 'left',
  value: 0,
  allowDecimal: false,
  incrementMinor: 1,
  incrementMajor: 10,
};

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
  'ArrowUp',
  'ArrowDown',
  'Delete',
  'Tab',
  'Enter',
];

export const preventDefault = (e: InputKeyEvent) => {
  e.preventDefault();
  return false;
};

export const numericKeyFilter = (e: InputKeyEvent) => {
  const { key, currentTarget } = e;
  const text = currentTarget.value;
  const { selectionStart } = currentTarget;
  if (numericKeys.indexOf(key) === -1) {
    return preventDefault(e);
  }
  if (key === '.' && text.indexOf('.') > -1) {
    return preventDefault(e);
  }
  if (
    key === '-' &&
    (text.indexOf('-') > -1 || (selectionStart && selectionStart > 0))
  ) {
    return preventDefault(e);
  }
  return true;
};

export const style = ({}: Required<Props>) => {
  return css`
    & .textfield > .boxlayout {
      padding-right: 0;
      left: 1px;
    }

    & .buttoncontent {
      & img {
        margin: 0;
      }
    }
  `;
};

export const longPressInitialDelay = 250;
export const longPressInitialInterval = 150;
export const longPressIntervalFactor = 0.9;
export const longPressIncrementFactor = 1.1;

export function NumericInput(props: Props) {
  const [
    {
      enabled,
      value,
      label,
      labelPosition,
      allowDecimal,
      incrementMinor,
      incrementMajor,
      onChange,
      onAccept,
    },
    css,
  ] = init(props, defaultProps, style);

  const ref = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState(`${value}`);

  useEffect(() => setCurrentValue(`${value}`), [value]);

  const onKeyDownHandler = (e: InputKeyEvent) => {
    const { key } = e;
    if (!allowDecimal && key === '.') {
      return e.preventDefault();
    }
    if (key === 'ArrowUp') {
      incrementBy(e.altKey ? incrementMajor : incrementMinor);
    } else if (key === 'ArrowDown') {
      incrementBy((e.altKey ? incrementMajor : incrementMinor) * -1);
    }
  };

  const onChangeHandler = (text: string) => {
    let value = text;
    console.log('!!!', value, value.length, currentValue);
    if (isNaN(parseFloat(value))) {
      value = '0';
    }
    if (value[0] === '0') {
      value = String(parseFloat(value));
    }
    setCurrentValue(value);
    onChange && onChange(parseFloat(value));
  };

  const onAcceptHandler = (text: string) =>
    onAccept && onAccept(parseFloat(text));

  const incrementBy = (amount: number) => {
    const newValue = parseFloat(currentValue) + amount;
    onChange && onChange(newValue);
    setCurrentValue(`${newValue}`);
  };

  const onMouseDownHandler =
    (incrementDirection: number) => (e: ReactMouseEvent) => {
      const onMouseUpHandler = () => {
        window.removeEventListener('mouseup', onMouseUpHandler);
        clearTimeout(timeout);
        clearInterval(interval);
      };
      window.addEventListener('mouseup', onMouseUpHandler);
      let inc =
        (e.shiftKey ? incrementMajor : incrementMinor) * incrementDirection;
      incrementBy(inc);
      let interval: number;
      let delay = longPressInitialInterval;
      const timeout = setTimeout(() => {
        if (ref.current) {
          const input = ref.current.querySelector(
            'input[type="text"]'
          ) as HTMLInputElement;
          interval = setInterval(() => {
            delay = Math.max(0, delay * longPressIntervalFactor);
            inc = inc * longPressIncrementFactor;
            const text = input.value;
            const newValue = parseFloat(text) + Math.round(inc);
            onChange && onChange(newValue);
            setCurrentValue(`${newValue}`);
          }, Math.round(delay));
        }
      }, longPressInitialDelay);
    };

  const onButtonKeyDownHandler =
    (incrementDirection: number) => (e: KeyboardEvent) => {
      let inc =
        (e.shiftKey ? incrementMajor : incrementMinor) * incrementDirection;
      console.log(inc);
      incrementBy(inc);
    };

  const onBlurHandler = () => {
    // console.log('blur');
  };

  return (
    <div css={css} className="numericInput" ref={ref}>
      <TextField
        enabled={enabled}
        text={`${currentValue}`}
        label={label}
        labelPosition={labelPosition}
        width={textFieldWidth}
        height={textFieldHeight}
        onKeyFilter={numericKeyFilter}
        onKeyDown={onKeyDownHandler}
        onChange={onChangeHandler}
        onAccept={onAcceptHandler}
        onBlur={onBlurHandler}
      >
        <BoxLayout
          direction="vertical"
          height={textFieldHeight}
          margin={1}
          spacing={1}
        >
          <PushButton
            enabled={enabled}
            icon="#increment-up"
            iconWidth={iconSize}
            width={buttonWidth}
            height={buttonHeight}
            fixedSize={true}
            radius={0}
            onMouseDown={onMouseDownHandler(1)}
            onKeyDown={onButtonKeyDownHandler(1)}
          />
          <PushButton
            enabled={enabled}
            icon="#increment-down"
            iconWidth={iconSize}
            width={buttonWidth}
            height={buttonHeight}
            fixedSize={true}
            radius={0}
            onMouseDown={onMouseDownHandler(-1)}
            onKeyDown={onButtonKeyDownHandler(-1)}
          />
        </BoxLayout>
      </TextField>
    </div>
  );
}
