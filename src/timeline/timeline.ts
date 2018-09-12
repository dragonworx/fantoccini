import { Project } from '../project';
import { Channel } from './channel';
import { TimelineElement } from './element';

export class Timeline {
  private project: Project;
  private seekTime: number;
  private playStartTime: number;
  private channels: any[];
  private elements: TimelineElement[];
  private isPlaying: boolean;

  constructor (project: Project) {
    this.project = project;
    this.project.addTicker(this.onTick);
    this.channels = [];
    this.elements = [];
    this.isPlaying = false;
    this.seekTime = 0;
  }

  get timeMs (): number {
    let seekTime = this.seekTime;
    if (this.isPlaying) {
      seekTime = seekTime + (Date.now() - this.playStartTime);
    }
    return seekTime;
  }

  onTick = delta => {
    const timeMs = this.timeMs;
    const elements = this.elements;
    const l = elements.length;
    for (let i = 0; i < l; i++) {
      elements[i].update();
    }
  };

  addChannel<T>(channel: Channel<T>) {
    this.channels.push(channel);
  }

  addElement(element: TimelineElement) {
    if (this.elements.indexOf(element) === -1) {
      this.elements.push(element);
    }
  }

  play () {
    this.isPlaying = true;
    this.playStartTime = Date.now();
  }
}