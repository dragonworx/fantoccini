import { Project } from 'src/core/project';
import {
  deserialiseProject,
  ProjectDescriptor,
  serialiseProject,
} from 'src/core/format';
import { DataWriter, DataReader } from 'src/core/serialisation';
import hub from 'src/core/hub';

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
    hub
      .on('project.create', descriptor => {
        const project = deserialiseProject(descriptor);
        this.project = project;
        project.init();
        hub.emit('project.init', project);
        console.log('project created', this.project);
      })
      .on('menu.file.save', () => {
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
        hub.emit('project.create', descriptor);
      });
    }
  }
}
