import { SerialisableObject, DataDescriptor } from "src/core/serialise";

export interface SceneDescriptor extends DataDescriptor {}

export class Scene extends SerialisableObject<SceneDescriptor> {}
