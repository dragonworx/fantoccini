import { ID, newID } from './util';

export class Scene {
  readonly id: ID;

  constructor(id?: ID) {
    this.id = id || newID();
  }
}
