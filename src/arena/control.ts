export abstract class Control<RootElement extends HTMLElement> {
  element: RootElement;

  constructor() {
    this.createElement();
  }

  protected abstract createElement();
}
