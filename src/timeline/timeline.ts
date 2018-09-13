import { Project } from '../project';

export class Timeline {
  private project: Project;
  private seekTime: number;
  private playStartTime: number;
  private isPlaying: boolean;
  public elapsedTime: number;

  constructor (project: Project) {
    this.project = project;
    this.isPlaying = false;
    this.seekTime = 0;
    this.elapsedTime = 0;
  }

  get timeMs (): number {
    let seekTime = this.seekTime;
    if (this.isPlaying) {
      seekTime = seekTime + (Date.now() - this.playStartTime);
    }
    return seekTime;
  }

  play () {
    this.isPlaying = true;
    this.playStartTime = Date.now();
  }

  update () {
    this.elapsedTime = this.timeMs;
  }
}