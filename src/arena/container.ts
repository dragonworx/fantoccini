import "./scss/container.scss";
import { Control, BaseEvents } from "./control";

export interface Props {
  width?: string | number;
  height?: string | number;
}

export const defaultProps: Props = {};

export class Container extends Control<Props, HTMLDivElement, BaseEvents> {
  constructor(props: Props = defaultProps) {
    super(props);
  }

  protected html() {
    return `<div></div>`;
  }

  protected controlType(): string[] {
    return ["container"];
  }
}
