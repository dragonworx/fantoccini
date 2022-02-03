import { Project } from "../core/project";
import { Hub, Event } from "./eventHub";

export class Application {
  project: Project;

  constructor() {
    Hub.on(Event.Project_Create, (settings) => {
      this.project = new Project(settings);
      Hub.emit(Event.Project_Init);
    });
  }
}

const app = new Application();

export default app;
