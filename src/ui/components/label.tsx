/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, useRef, ReactNode } from 'react';
import Color from 'color';
import { BoxLayout, Alignment, Justification } from '../layout/box';
import { init } from '../util';
import { reset, noSelect } from './theme';
import { Appearance } from './abstractButton';

export type LabelPosition = 'left' | 'right' | 'top' | 'bottom' | 'hidden';

export interface Props {
  children?: ReactNode;
  text: string;
  enabled?: boolean;
  link?: boolean;
  position?: LabelPosition;
  align?: Alignment;
  justify?: Justification;
  appearance?: Appearance;
  onClick?: () => void;
}

export const defaultProps: Props = {
  text: 'Label',
  enabled: true,
  link: false,
  position: 'right',
  align: 'center',
  appearance: 'full',
};

export const style = ({
  enabled,
  link,
  appearance,
  align,
  position,
  onClick,
}: Required<Props>) => {
  const shadowColor = enabled ? '#080808' : '#383838';
  const textColor = Color(link && enabled ? '#57b1ff' : '#bdbec0');
  const isInteractive = !!(link || onClick) && enabled;

  return css`
    ${reset}
    ${noSelect}
    flex-grow: 1;
    margin: ${appearance === 'bare' ? '0 10px !important' : 'auto'};
    text-shadow: 1px 1px 1px ${shadowColor};
    color: ${enabled ? textColor.hex() : textColor.darken(0.35).hex()};
    text-decoration: ${link ? 'underline' : 'normal'};
    cursor: ${isInteractive ? 'pointer' : 'inherit'};
    white-space: nowrap;
    &:active,
    &.active {
      ${isInteractive ? 'color:' + textColor.lighten(0.2).hex() : ''}
    }
  `;
};

export function Label(props: Props) {
  const [
    { children, enabled, position, align, justify, appearance, onClick },
    css,
  ] = init(props, defaultProps, style);
  const ref = useRef<HTMLLabelElement>(null);
  const isInteractive = !!(enabled && onClick);

  const onKeyDownHandler = (e: KeyboardEvent<HTMLLabelElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && isInteractive) {
      ref.current?.classList.add('active');
      setTimeout(() => {
        onClick();
        setTimeout(() => ref.current?.classList.remove('active'), 150);
      }, 0);
    }
  };

  if (appearance === 'bare') {
    return (
      <div className={`label ${enabled ? '' : 'disabled'}`}>
        {children}
        <label
          ref={ref}
          css={css}
          tabIndex={isInteractive ? 0 : undefined}
          onClick={isInteractive ? onClick : undefined}
          onKeyDown={onKeyDownHandler}
        >
          {position !== 'hidden' ? props.text : null}
        </label>
      </div>
    );
  }

  return (
    <div className={`label ${enabled ? '' : 'disabled'}`}>
      <BoxLayout
        margin={0}
        direction={
          position === 'left' || position === 'right'
            ? 'horizontal'
            : 'vertical'
        }
        align={align}
        justify={justify}
        reversed={position === 'left' || position === 'top'}
      >
        {children}
        <label
          ref={ref}
          css={css}
          tabIndex={isInteractive ? 0 : undefined}
          onClick={isInteractive ? onClick : undefined}
          onKeyDown={onKeyDownHandler}
        >
          {props.text}
        </label>
      </BoxLayout>
    </div>
  );
}
