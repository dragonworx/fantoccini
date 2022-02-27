import { Project } from 'src/core/project';
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

  async saveProject() {
    const descriptor = serialiseProject(this.project);
    const writer = new DataWriter();
    await writer.serialise(descriptor);
    const base64 = writer.toBase64();
    localStorage.setItem(projectStorageKey, base64);

    console.log('project saved', descriptor, base64);
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
    Hub.emit(Event.Project_Create, descriptor);
  }
}
