/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';
import { noSelect, reset } from '../components/theme';
import { init } from '../util';
import { BoxLayout, Props as BoxLayoutProps } from './box';

export type Props = {
  children: ReactNode;
  title: string;
} & BoxLayoutProps;

export const defaultProps: Props = {
  children: null,
  title: 'Untitled',
  direction: 'horizontal',
  spacing: 3,
};

export const style = ({}: Props) => {
  return css`
    ${reset}
    ${noSelect}

    padding: 5px 10px;
    border-radius: 5px;
    border: 1px inset #7f7f7f8a;
    background-color: rgba(0, 0, 0, 0.05);
    margin-bottom: 5px;
    padding-bottom: 10px !important;

    > * {
      margin-right: 5px;
    }

    > *:last-child {
      margin-right: 0;
    }

    legend {
      color: #a8e9f3;
      padding: 2px 5px;
      border-radius: 5px;
      border-bottom: 1px solid #666666;
      border-top: 1px solid #9c9c9c;
      background-color: #545454;
      font-size: 11px;
      text-shadow: 1px 1px 1px #080808;
    }
  `;
};

export function Section(props: Props) {
  const [
    {
      children,
      title,
      align,
      direction,
      height,
      justify,
      margin,
      reversed,
      spacing,
      width,
    },
    css,
  ] = init(props, defaultProps, style);
  const boxLayoutProps = {
    align,
    direction,
    height,
    justify,
    margin,
    reversed,
    spacing,
    width,
  };
  return (
    <fieldset css={css} className="section">
      <legend>{title}</legend>
      <BoxLayout {...boxLayoutProps}>{children}</BoxLayout>
    </fieldset>
  );
}
