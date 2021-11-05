/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, useState, useRef, ReactNode } from 'react';
import Color from 'color';
import { init } from './util';
import { PushButton } from './pushButton';
import { Label, LabelPosition } from './label';
import { Alignment } from '../layout/box';
import {
  reset,
  noSelect,
  borderRadius,
  outline,
  textFieldBg,
  borderDown,
} from './theme';

export interface Props {
  children?: ReactNode;
  enabled?: boolean;
  text?: string;
  placeholder?: string;
  icon?: string;
  width?: number;
  height?: number;
  label?: string;
  labelPosition?: LabelPosition;
  onKeyFilter?: (key: string, text: string) => boolean;
  onKeyDown?: (key: string, text: string) => false | string | void;
  onKeyUp?: (key: string, text: string) => void;
  onChange?: (text: string) => void;
  onAccept?: (text: string) => void;
  onButtonClick?: () => void;
}

export const defaultProps: Props = {
  enabled: true,
  labelPosition: 'left',
};

export const style = ({ enabled, width, height }: Required<Props>) => {
  const shadowColor = enabled ? '#080808' : '#383838';
  const textColor = Color('#bdbec0');

  return css`
    ${reset}
    ${noSelect}
    ${borderRadius}
    ${borderDown}
    ${textFieldBg(enabled)}
    width: ${width ? `${width}px` : '100%'};
    height: ${height ? `${height}px` : 'auto'};
    display: flex;
    align-items: center;
    justify-content: center;

    input[type='text'] {
      ${borderRadius}
      padding: 0px 3px;
      width: 100%;
      background-color: transparent;
      color: ${enabled ? textColor.hex() : textColor.darken(0.35).hex()};
      text-shadow: 1px 1px 1px ${shadowColor};
      border: none;
      font-family: inherit;
      font-size: inherit;
      margin: 0 3px;
      flex-grow: 1;

      &:focus {
        ${outline};
      }

      &::selection {
        background: #eee;
        color: #2f343c;
        text-shadow: none;
      }
    }

    &:active {
      color: ${textColor.lighten(0.2).hex()};
    }
  `;
};

export function TextField(props: Props) {
  const [
    {
      children,
      enabled,
      text,
      label,
      labelPosition,
      placeholder,
      icon,
      onKeyFilter,
      onChange,
      onAccept,
      onKeyDown,
      onKeyUp,
      onButtonClick,
    },
    css,
  ] = init(props, defaultProps, style);

  const ref = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useState(text);

  const onChangeHandler = () => {
    const { current } = ref;
    current && onChange && onChange(current.value);
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const { current } = ref;
    if (current) {
      if (onKeyFilter && onKeyFilter(e.key, current.value) === false) {
        e.preventDefault();
      }
      if (onKeyDown) {
        const result = onKeyDown(e.key, current.value);
        console.log('@@@', result);
        if (result === false) {
          e.preventDefault();
        }
        if (typeof result === 'string') {
          console.log('!!!', result);
          setCurrentValue(result);
        }
      }
    }
  };

  const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const { current } = ref;
    current && onKeyUp && onKeyUp(e.key, current.value);
    e.key === 'Enter' && current && current.blur();
  };

  const onBlurHandler = () => {
    const { current } = ref;
    current && onAccept && onAccept(current.value);
  };

  const button = children ? (
    children
  ) : icon ? (
    <PushButton
      icon={icon}
      iconWidth={16}
      height={30}
      fixedSize={true}
      onClick={onButtonClick}
    />
  ) : null;

  if (label) {
    const align: Alignment =
      labelPosition === 'top' || labelPosition === 'bottom'
        ? 'start'
        : 'center';
    return (
      <Label text={label} position={labelPosition} align={align}>
        <div css={css} className="textfield">
          <input
            ref={ref}
            type="text"
            // defaultValue={text}
            value={currentValue}
            disabled={!enabled}
            tabIndex={0}
            placeholder={placeholder}
            spellCheck={false}
            onChange={onChangeHandler}
            onKeyUp={onKeyUpHandler}
            onKeyDown={onKeyDownHandler}
            onBlur={onBlurHandler}
          />
          {button}
        </div>
      </Label>
    );
  } else {
    return (
      <div css={css} className="textfield">
        <input
          ref={ref}
          type="text"
          defaultValue={text}
          disabled={!enabled}
          tabIndex={0}
          placeholder={placeholder}
          spellCheck={false}
          onChange={onChangeHandler}
          onKeyUp={onKeyUpHandler}
          onKeyDown={onKeyDownHandler}
          onBlur={onBlurHandler}
        />
        {button}
      </div>
    );
  }
}
