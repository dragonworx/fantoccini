/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, useRef } from 'react';
import Color from 'color';
import { init } from './util';
import { PushButton } from './pushButton';
import { borderRadius, outline, textFieldBg, borderDown } from './theme';

export interface Props {
  enabled?: boolean;
  text?: string;
  placeholder?: string;
  icon?: string;
  width?: number;
  height?: number;
  label?: string;
  onKeyFilter?: (key: string) => boolean;
  onKeyDown?: (key: string) => false | void;
  onKeyUp?: (key: string) => void;
  onChange?: (text: string) => void;
  onAccept?: (text: string) => void;
  onButtonClick?: () => void;
}

export const defaultProps: Props = {
  enabled: true,
};

export const style = ({ enabled, width, height }: Required<Props>) => {
  const shadowColor = enabled ? '#080808' : '#383838';
  const textColor = Color('#bdbec0');

  return css`
    box-sizing: border-box;
    user-select: none;
    width: ${width ? `${width}px` : '100%'};
    height: ${height ? `${height}px` : 'auto'};
    ${textFieldBg(enabled)}
    border-radius: ${borderRadius};
    ${borderDown}
    display: flex;
    align-items: center;
    justify-content: center;

    input[type='text'] {
      box-sizing: border-box;
      padding: 0px 3px;
      width: 100%;
      background-color: transparent;
      color: ${enabled ? textColor.hex() : textColor.darken(0.35).hex()};
      text-shadow: 1px 1px 1px ${shadowColor};
      border: none;
      font-family: inherit;
      font-size: inherit;
      border-radius: ${borderRadius};
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
      enabled,
      text,
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

  const onChangeHandler = () => {
    const { current } = ref;
    current && onChange && onChange(current.value);
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const { current } = ref;
    if (current) {
      const shouldCancel =
        (onKeyFilter && onKeyFilter(e.key) === false) ||
        (onKeyDown && onKeyDown(e.key) === false);
      if (shouldCancel) {
        e.preventDefault();
      }
    }
  };

  const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const { current } = ref;
    current && onKeyUp && onKeyUp(e.key);
    e.key === 'Enter' && current && current.blur();
  };

  const onBlurHandler = () => {
    const { current } = ref;
    current && onAccept && onAccept(current.value);
  };

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
      {icon ? (
        <PushButton
          icon={icon}
          iconWidth={16}
          height={30}
          fixedSize={true}
          onClick={onButtonClick}
        />
      ) : null}
    </div>
  );
}
