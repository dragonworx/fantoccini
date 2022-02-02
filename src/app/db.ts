import Dexie, { Table } from "dexie";

export interface Application {
  currentProject: number;
}

export interface Project {
  id?: number;
  title: string;
  fps: number;
}

export class FantocciniDatabase extends Dexie {
  application!: Table<Application>;
  projects!: Table<Project>;

  constructor() {
    super("fantoccini-database");

    this.version(1).stores({
      application: "++id",
      projects: "++id",
    });
  }
}

const db = new FantocciniDatabase();

export default db;
