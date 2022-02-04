import { v4 as uuid } from "uuid";

export interface DataDescriptor {
  id: string;
}

export abstract class SerialisableObject<Descriptor extends DataDescriptor> {
  id: string;

  constructor() {
    this.id = uuid();
  }

  toDescriptor(): Descriptor {
    return {
      id: this.id,
    } as unknown as Descriptor;
  }

  fromDescriptor(descriptor: Descriptor) {
    this.id = descriptor.id;
  }

  deserialiseDescriptorArray<
    T extends DataDescriptor,
    K extends SerialisableObject<T>
  >(a: T[], type: { new (): K }): [K[], Map<string, K>] {
    const idMap: Map<string, K> = new Map();
    const array: K[] = a.map(descriptor => {
      const obj = new type();
      obj.fromDescriptor(descriptor);
      idMap.set(obj.id, obj);
      return obj;
    });
    return [array, idMap];
  }
}
