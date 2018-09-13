import * as PIXI from 'pixi.js';
import { Scene } from '../scene';
import { StringProperty, DynamicPropertyTarget } from '../property';
import { Timeline } from '../timeline';
import { ProjectOptions, SceneMap } from './types';
import {
  DEFAULT_PROJECT_BACKGROUND_COLOR,
  DEFAULT_PROJECT_HEIGHT,
  DEFAULT_PROJECT_OPTIONS,
  DEFAULT_PROJECT_WIDTH,
} from './const';

export class Project implements DynamicPropertyTarget {
  private scenes: SceneMap = {};
  public app: PIXI.Application;
  public currentSceneName: StringProperty;
  public timeline: Timeline;

  constructor (options: ProjectOptions = DEFAULT_PROJECT_OPTIONS) {
    PIXI.utils.sayHello(`fantoccini ~ ${PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas'}`);

    this.app = new PIXI.Application({
      width: options.width || DEFAULT_PROJECT_WIDTH,
      height: options.height || DEFAULT_PROJECT_HEIGHT,
      backgroundColor: options.backgroundColor || DEFAULT_PROJECT_BACKGROUND_COLOR,
    });

    this.timeline = new Timeline(this);

    this.currentSceneName = new StringProperty(this, 'currentSceneName', null, this.timeline);

    document.body.appendChild(this.view);

    this.app.ticker.add(this.onTick);
  }

  getScene (name: string): Scene {
    return this.scenes[name];
  }

  get view () {
    return this.app.view;
  }

  get width () {
    return this.app.renderer.width;
  }

  get height () {
    return this.app.renderer.width;
  }

  get scene (): Scene {
    return this.scenes[this.currentSceneName.value];
  }

  onTick = () => {
    this.timeline.update();
    if (this.scene) {
      this.scene.update();
    }
  };

  onChange (propertyName: string, newValue: any, oldValue: any) {
    if (propertyName === 'currentSceneName') {
      const newSceneName = newValue as string;
      const oldSceneName = oldValue as string;
      const oldScene = this.scenes[oldSceneName];
      const newScene = this.scenes[newSceneName];
      if (oldScene) {
        console.log('leave ' + oldScene.name);
        oldScene.leave();
      }
      if (newScene) {
        console.log('enter ' + newScene.name);
        newScene.enter();
      }
    }
  }

  addScene (scene: Scene) {
    if (this.scenes[scene.name]) {
      throw new Error(`Scene names must be unique, "${scene.name}" already exists`);
    }
    this.scenes[scene.name] = scene;
  }
}