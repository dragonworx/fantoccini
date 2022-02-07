import { Project, ProjectDescriptor } from '../core/project';
import { Hub, Event } from './eventHub';

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
      const project = (this.project = new Project());
      project.fromDescriptor(descriptor);
      Hub.emit(Event.Project_Init);
      console.log('project created', this.project);
    }).on(Event.Project_Save, () => {
      this.saveProject();
    });
  }

  saveProject() {
    Hub.emit(Event.Project_Save_Begin);

    const descriptor = this.project.toDescriptor();
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

    const descriptor: ProjectDescriptor = JSON.parse(data) as ProjectDescriptor;
    Hub.emit(Event.Project_Create, descriptor);

    Hub.emit(Event.Project_Open_Complete);
  }
}
