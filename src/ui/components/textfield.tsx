/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, useRef } from 'react';
import Color from 'color';
import { init } from './util';
import { PushButton } from './pushButton';
import { Label } from './label';
import { BoxLayout } from '../layout/box';
import { LabelPosition } from './abstractToggleButton';
import { borderRadius, outline, outlineColor, borderDown } from './theme';

export interface Props {
  enabled?: boolean;
  text?: string;
  placeholder?: string;
  icon?: string;
  width?: number;
  label?: string;
}

export const defaultProps: Props = {
  enabled: true,
};

export const style = ({ enabled, width }: Required<Props>) => {
  const shadowColor = enabled ? '#080808' : '#383838';
  const textColor = Color('#bdbec0');

  return css`
    box-sizing: border-box;
    user-select: none;
    width: ${typeof width === 'number' ? `${width}px` : '100%'};
    max-width: 200px;
    background: linear-gradient(180deg, #000 0, #2f343c 100%);
    border-radius: ${borderRadius};
    ${borderDown}
    display: flex;
    align-items: center;
    justify-content: center;

    input[type='text'] {
      box-sizing: border-box;
      padding: 3px 5px;
      width: 100%;
      background-color: transparent;
      color: #bdbec0;
      text-shadow: 1px 1px 1px #080808;
      border: none;
      font-family: inherit;
      font-size: inherit;
      border-radius: ${borderRadius};
      margin: 0 3px;
      flex-grow: 1;

      &:focus {
        outline: ${outline};
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
  const [{ enabled, text, placeholder, icon }, css] = init(
    props,
    defaultProps,
    style
  );
  const ref = useRef<HTMLInputElement>(null);

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
      />
      {icon ? <PushButton icon={icon} iconWidth={16} /> : null}
    </div>
  );
}
