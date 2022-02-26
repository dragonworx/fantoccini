import { Project } from 'src/core/project';
import { Hub, Event } from 'src/app/eventHub';
import {
  deserialiseProject,
  ProjectDescriptor,
  serialiseProject,
} from 'src/core/format';

const projectStorageKey = 'fantoccini.project';

export class Application {
  project: Project;

  static instance: Application;

  constructor() {
    Application.instance = this;
    this.initEvents();
    this.autoLoadProject();
  }

  initEvents() {
    Hub.on(Event.Project_Create, descriptor => {
      const project = deserialiseProject(descriptor);
      this.project = project;
      Hub.emit(Event.Project_Init, project);
      console.log('project created', this.project);
    }).on(Event.Project_Save, () => {
      this.saveProject();
    });
  }

  saveProject() {
    Hub.emit(Event.Project_Save_Begin);

    const descriptor = serialiseProject(this.project);
    const data = JSON.stringify(descriptor, null, 4);

    localStorage.setItem(projectStorageKey, data);
    console.log('project saved', data);

    Hub.emit(Event.Project_Save_Complete);
  }

  autoLoadProject() {
    const data = localStorage.getItem(projectStorageKey);
    if (data !== null) {
      this.loadProject(data);
    }
  }

  loadProject(data: string) {
    Hub.emit(Event.Project_Open_Begin);

    const descriptor = JSON.parse(data) as ProjectDescriptor;
    Hub.emit(Event.Project_Create, descriptor);

    Hub.emit(Event.Project_Open_Complete);
  }
}
