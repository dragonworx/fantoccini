import { Property, PropertyType } from 'src/core/animation/property';
import { Project } from 'src/core/project';
import { ITick } from 'src/core/animation/ticker';

export class Timeline implements ITick {
  project: Project;
  properties: Property<PropertyType>[];
  frameCount: number;

  constructor(project: Project) {
    this.project = project;
  }

  onTick = (frameIndex: number) => {};
}
