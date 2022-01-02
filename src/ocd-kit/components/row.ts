import { Control, html, css } from '../core';

export class Row extends Control<HTMLDivElement>() {
  protected template() {
    return html`<div></div>`;
  }

  protected style() {
    return css`
      div {
        display: flex;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.05);
        margin-bottom: 5px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    `;
  }
}
