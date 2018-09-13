import { Camera } from '../camera';
import { Project } from '../project';
import { StringProperty, DynamicPropertyTarget } from '../property'
import { Sprite } from '../sprite';

interface CameraMap { [ name: string ]: Camera; };

export class Scene implements DynamicPropertyTarget {
  private project: Project;
  private cameras: CameraMap;
  public currentCameraName: StringProperty;
  public name: string;
  public sprites: Sprite[];

  constructor (name: string, project: Project) {
    this.name = name || 'default';
    this.project = project;
    this.cameras = {};
    this.currentCameraName = new StringProperty(this, 'currentCameraName', 'default', project.timeline);
    this.sprites = [];
    project.addScene(this);
  }

  addSprite (sprite: Sprite) {
    this.sprites.push(sprite);
  }

  update () {
    const sprites = this.sprites;
    const l = sprites.length;
    for (let i = 0; i < l; i++) {
      sprites[i].update();
    }
  }

  enter () {
    const sprites = this.sprites;
    const l = sprites.length;
    for (let i = 0; i < l; i++) {
      const sprite = sprites[i];
      this.project.app.stage.addChild(sprite.container);
      sprite.update();
    }
  }

  leave () {
    const sprites = this.sprites;
    const l = sprites.length;
    for (let i = 0; i < l; i++) {
      const sprite = sprites[i];
      this.project.app.stage.removeChild(sprite.container);
    }
  }

  onChange (propertyName: string, newValue: any, oldValue: any) {
    
  }
}