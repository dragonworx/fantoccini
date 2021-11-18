/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { ReactNode } from 'react';
import { reset } from '../components/theme';
import { init } from '../util';

export interface Props {
  children: ReactNode;
  title: string;
}

export const defaultProps: Props = {
  children: null,
  title: 'Untitled',
};

export const style = ({}: Props) => {
  return css`
    ${reset}

    padding: 5px 10px;
    display: flex;
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
      color: #bcbcbc;
      padding: 2px 5px;
      border-radius: 5px;
      border-bottom: 1px solid #090e0e;
      border-top: 1px solid #9c9c9c;
      background-color: #41484e;
      font-size: 11px;
      text-shadow: 1px 1px 1px #080808;
    }
  `;
};

export function Section(props: Props) {
  const [{ children, title }, css] = init(props, defaultProps, style);
  return (
    <fieldset css={css} className="section">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
