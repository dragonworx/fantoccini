import { DisplayObject } from 'src/core/display/displayObject';
import { DataBlock } from 'src/core/animation/datablock';

/**
 * Types:
 * Numeric
 * StringEnum
 * NumericEnum
 * Boolean
 */

export type PropertyType = number | string | boolean;

export class Property<T extends PropertyType> {
  target: DisplayObject;
  dataBlocks: DataBlock[];

  constructor(target: DisplayObject) {
    this.target = target;
  }

  get(frameIndex: number) {}
}
