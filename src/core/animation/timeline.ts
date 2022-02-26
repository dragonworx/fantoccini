import { Property, PropertyType } from 'src/core/animation/property';
import { Project } from 'src/core/project';
import { Hub, Event } from 'src/editor/eventHub';

export class Timeline {
  project: Project;
  properties: Property<PropertyType>[];
  frameCount: number;

  constructor(project: Project) {
    this.project = project;

    Hub.on(Event.Transport_Tick, this.onTick);
  }

  private onTick = (frameIndex: number) => {};
}
