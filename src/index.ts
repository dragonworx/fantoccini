import * as Color from 'color';

export function color (red: number, green: number, blue: number): number {
  return Color.rgb(red, green, blue).rgbNumber();
}

export { Project } from './project';
export { Scene } from './scene';
export { Camera } from './camera';
export { Sprite } from './sprite';