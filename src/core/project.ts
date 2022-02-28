import { Timeline } from 'src/core/animation/timeline';
import { Scene } from 'src/core/scene';
import { Renderer } from 'src/core/renderer';
import { ID } from 'src/core/util';
import hub from 'src/core/hub';
import { Duration, ProjectDescriptor } from './format';

export const defaults: Partial<ProjectDescriptor> = {
  title: 'Untitled',
  fps: 24,
  width: 640,
  height: 480,
  duration: {
    hours: 0,
    minutes: 1,
    seconds: 0,
  },
};

export class Project {
  title: string;
  fps: number;
  width: number;
  height: number;
  duration: Duration;

  currentScene: ID;

  readonly renderer: Renderer;
  readonly timeline: Timeline;
  readonly scenes: Map<ID, Scene>;

  constructor() {
    this.title = defaults.title;
    this.fps = defaults.fps;
    this.width = defaults.width;
    this.height = defaults.height;
    this.duration = { ...defaults.duration };

    this.timeline = new Timeline(this.fps);
    this.renderer = new Renderer(this.width, this.height);

    this.scenes = new Map();
  }

  init() {
    hub.on('frame.tick', this.tick);
  }

  tick = (deltaMs: number, frameIndex: number) => {
    this.renderer.render();
  };
}
