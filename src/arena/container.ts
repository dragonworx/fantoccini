import { div } from "./util";
import { Control } from "./control";

export class Container extends Control<HTMLDivElement> {
  protected createElement() {
    this.element = div();
  }
}
