import { css } from '@emotion/react';

// const
export const borderRadius = '5px';
export const outlineColor = '#2fb7eb';

// css
export const outline = css`
  outline: 1px solid ${outlineColor};
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
