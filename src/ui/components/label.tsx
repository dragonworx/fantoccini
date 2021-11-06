/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { KeyboardEvent, useRef, ReactNode } from 'react';
import Color from 'color';
import { BoxLayout, Alignment, Justification } from '../layout/box';
import { init } from './util';
import { reset, noSelect } from './theme';

export type LabelPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Props {
  children?: ReactNode;
  text: string;
  enabled?: boolean;
  link?: boolean;
  position?: LabelPosition;
  align?: Alignment;
  justify?: Justification;
  onClick?: () => void;
}

export const defaultProps: Props = {
  text: 'Label',
  enabled: true,
  link: false,
  position: 'right',
  align: 'center',
};

export const style = ({ enabled, link, onClick }: Required<Props>) => {
  const shadowColor = enabled ? '#080808' : '#383838';
  const textColor = Color(link && enabled ? '#57b1ff' : '#bdbec0');
  const isInteractive = !!(link || onClick) && enabled;

  return css`
    ${reset}
    ${noSelect}
    text-shadow: 1px 1px 1px ${shadowColor};
    color: ${enabled ? textColor.hex() : textColor.darken(0.25).hex()};
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
  const [{ children, enabled, position, align, justify, onClick }, css] = init(
    props,
    defaultProps,
    style
  );
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

  return (
    <div className={'label'}>
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
