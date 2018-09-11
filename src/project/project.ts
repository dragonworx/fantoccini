import * as PIXI from 'pixi.js';
import { Scene } from '../scene';
import { StringProperty } from '../property';
import { Timeline } from '../timeline';
import { ProjectOptions, SceneMap } from './types';
import {
  DEFAULT_PROJECT_BACKGROUND_COLOR,
  DEFAULT_PROJECT_HEIGHT,
  DEFAULT_PROJECT_OPTIONS,
  DEFAULT_PROJECT_WIDTH,
} from './const';

export class Project {
  private app: PIXI.Application;
  private scenes: SceneMap;
  private currentSceneName: StringProperty;
  private timeline: Timeline;

  constructor (options: ProjectOptions = DEFAULT_PROJECT_OPTIONS) {
    // startup, test for WebGL
    PIXI.utils.sayHello(`fantoccini ~ ${PIXI.utils.isWebGLSupported() ? 'WebGL' : 'Canvas'}`);

    // setup pixi app
    this.app = new PIXI.Application({
      width: options.width || DEFAULT_PROJECT_WIDTH,
      height: options.height || DEFAULT_PROJECT_HEIGHT,
      backgroundColor: options.backgroundColor || DEFAULT_PROJECT_BACKGROUND_COLOR,
    });

    // set default scene
    this.currentSceneName = new StringProperty(this, 'currentSceneName', 'default');
  }

  addScene (scene: Scene) {
    this.scenes[scene.name]
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
}