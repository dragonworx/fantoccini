import { Project } from "../core/project";
import { Hub, Event } from "./eventHub";

export class Application {
  project: Project;

  constructor() {
    this.initEvents();

    const data = localStorage.get("fantoccini.project");
    if (data !== null) {
      this.loadProject(JSON.parse(data));
    }
  }

  initEvents() {
    Hub.on(Event.Project_Create, (settings) => {
      this.project = new Project(settings);
      Hub.emit(Event.Project_Init);
    });
  }

  saveProject() {
    Hub.emit(Event.Project_Save_Begin);
    this.project.serialise().then((data) => {
      localStorage.set("fantoccini.project", data);
      Hub.emit(Event.Project_Save_Complete);
    });
  }

  loadProject(data: string) {
    Hub.emit(Event.Project_Open_Begin);
    this.project.deserialise(data).then(() => {
      Hub.emit(Event.Project_Open_Complete);
    });
  }
}

const app = new Application();

export default app;
