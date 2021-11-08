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

export const highlightColor = '#2fb7eb';

export const outline = css`
  outline: 1px solid ${highlightColor};
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
      ${enabled ? '#222' : '#333'} 0,
      ${enabled ? '#2f343c' : '#444'} 100%
    );
  `;

export const boxBorder = css`
  border: 1px solid #999;
  border-left-color: #555;
  border-right-color: #555;
  border-bottom-color: #444;
`;

export const menuBorder = css`
  border: 1px solid #666;
  border-bottom-color: #222;
`;

export const buttonShadow = css`
  box-shadow: 2px 2px 4px 0px rgb(0 0 0 / 25%);
`;

export const buttonShadowInset = css`
  box-shadow: inset 2px 2px 4px 0px rgb(0 0 0 / 25%);
`;
