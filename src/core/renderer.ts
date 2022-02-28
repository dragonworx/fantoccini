import * as PIXI from 'pixi.js';

export class Renderer {
  pixi: PIXI.Application;

  constructor(width: number, height: number) {
    this.pixi = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
    });
  }

  get view() {
    return this.pixi.renderer.view;
  }

  render() {}
}
