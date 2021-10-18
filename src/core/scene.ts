import { Sprite } from './sprite';

export class Scene {
  sprites: Sprite[];

  constructor() {
    this.sprites = [];
  }

  tick(frameIndex: number) {
    const { sprites } = this;
    const l = sprites.length;
    for (let i = 0; i < l; i++) {
      sprites[i].tick(frameIndex);
    }
  }
}
