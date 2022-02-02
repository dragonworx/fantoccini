import { Property } from './property';

export class Sprite {
  x: Property<number>;
  y: Property<number>;
  width: Property<number>;
  height: Property<number>;
  scaleX: Property<number>;
  scaleY: Property<number>;
  rotation: Property<number>;
  alpha: Property<number>;

  constructor() {
    this.x = new Property(0);
    this.y = new Property(0);
    this.width = new Property(0);
    this.height = new Property(0);
    this.scaleX = new Property(1);
    this.scaleY = new Property(1);
    this.rotation = new Property(0);
    this.alpha = new Property(1);
  }

  tick(frameIndex: number) {
    // if PLAYING...
    // this graphics object.x = this.x.get(frameIndex)
    // ...
    // if RECORDING...
    // newValue = inputChain.currentValue;
    // this.x.set(frameIndex, newValue);
    // this graphics object.x = this.x.get(frameIndex)
  }
}
