/** @jsx jsx */

import { css, jsx } from '@emotion/react';
import { TickerTest } from './core/ticker';

const style = css`
  fieldset {
    background-color: rgba(255, 255, 255, 0.1);
    margin-bottom: 5px;

    legend {
      color: #fff;
      font-weight: bold;
    }

    input {
      width: 40px;
      margin: 2px;
      border-radius: 5px;
      border: 1px solid grey;
      background-color: #333;
      color: white;
      padding: 3px;
      text-align: center;
    }

    button {
      border-radius: 5px;
      border: 1px solid #ccc;
      margin: 2px;
      border-style: outset;
      background-color: #555;
      color: #ccc;
      font-size: 12px;
      padding: 3px 6px;
    }

    label {
      display: inline-block;
      margin: 5px;
      font-weight: bold;

      span {
        display: inline-block;
        margin: 5px;
        color: white;
        min-width: 35px;
      }
    }
  }
`;

export function App() {
  return (
    <div css={style}>
      <TickerTest />
    </div>
  );
}
