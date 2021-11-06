import { css } from '@emotion/react';

export const reset = css`
  box-sizing: border-box;

  & * {
    box-sizing: border-box;
  }
`;

export const noSelect = css`
  user-select: none;
`;

export const borderRadiusSize = 5;

export const borderRadius = css`
  border-radius: ${borderRadiusSize}px;
`;

export const outline = css`
  outline: 1px solid #2fb7eb;
`;

export const borderDown = css`
  border: 1px solid #444;
  border-left-color: #555;
  border-right-color: #555;
  border-bottom-color: #999;
`;

export const textFieldBg = (enabled: boolean) =>
  css`
    background: linear-gradient(
      180deg,
      ${enabled ? '#000' : '#333'} 0,
      #2f343c 100%
    );
  `;
