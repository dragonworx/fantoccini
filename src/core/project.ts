import { Ticker } from 'src/core/animation/ticker';
import { Timeline } from 'src/core/animation/timeline';
import { Scene } from 'src/core/scene';
import { Renderer } from 'src/core/renderer';
import { ID } from 'src/core/util';
import hub from 'src/core/hub';

export const defaults = {
  title: 'Untitled',
  fps: 24,
  width: 640,
  height: 480,
};

export class Project {
  private _title: string;
  private _fps: number;
  private _width: number;
  private _height: number;
  private _currentScene: ID;

  readonly ticker: Ticker;
  readonly renderer: Renderer;
  readonly timeline: Timeline;
  readonly scenes: Map<ID, Scene>;

  constructor() {
    this._title = defaults.title;
    this._fps = defaults.fps;
    this._width = defaults.width;
    this._height = defaults.height;

    this.ticker = new Ticker(this._fps);
    this.renderer = new Renderer(this._width, this._height);
    this.timeline = new Timeline();

    this.scenes = new Map();
  }

  get title() {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get fps() {
    return this._fps;
  }

  set fps(value: number) {
    this._fps = value;
    this.ticker.setFps(value);
  }

  get width() {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get currentScene() {
    return this._currentScene;
  }

  set currentScene(value: number) {
    this._currentScene = value;
  }

  init() {
    hub.on('frame.tick', this.tick);

    this.ticker.start();
  }

  tick = (deltaMs: number, frameIndex: number) => {
    // console.log(deltaMs, frameIndex);
    this.timeline.tick(deltaMs, frameIndex);
    this.renderer.render();
  };
}
