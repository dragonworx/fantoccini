import { Project } from 'src/core/project';
import { Hub, Event } from 'src/app/eventHub';
import {
  deserialiseProject,
  ProjectDescriptor,
  serialiseProject,
} from 'src/core/format';
import { DataWriter, DataReader } from 'src/core/serialisation';

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
    const writer = new DataWriter();
    writer.serialise(descriptor);
    const base64 = writer.toBase64();
    localStorage.setItem(projectStorageKey, base64);

    console.log('project saved', descriptor, base64);

    Hub.emit(Event.Project_Save_Complete);
  }

  autoLoadProject() {
    const base64 = localStorage.getItem(projectStorageKey);
    if (base64 !== null) {
      const reader = new DataReader();
      reader.deserialise<ProjectDescriptor>(base64).then(descriptor => {
        this.loadProject(descriptor);
      });
    }
  }

  loadProject(descriptor: ProjectDescriptor) {
    Hub.emit(Event.Project_Open_Begin);
    Hub.emit(Event.Project_Create, descriptor);
    Hub.emit(Event.Project_Open_Complete);
  }
}
