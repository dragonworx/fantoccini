import * as PIXI from 'pixi.js';
import { NumericProperty } from '../property';

export class Sprite {
  // private container: PIXI.Container;
  private x: NumericProperty;
  private y: NumericProperty;

  constructor () {
    // this.container = new PIXI.Container();

    this.x = new NumericProperty(this, 'pos.x', 0);
    this.y = new NumericProperty(this, 'pos.y', 0);
  }
}