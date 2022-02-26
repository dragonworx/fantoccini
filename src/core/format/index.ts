import { ID } from 'src/core/util';

export * from './serialise';
export * from './deserialise';

export interface FileFormat {
  project: ProjectDescriptor;
}

export interface ProjectDescriptor {
  title: string;
  fps: number;
  width: number;
  height: number;
  scenes: Array<SceneDescriptor>;
  currentScene: ID;
}

export interface SceneDescriptor {
  id: ID;
}
