import * as PIXI from 'pixi.js';
import { color } from '../index';
import { TimelineElement } from '../timeline';
import { NumericProperty, DynamicPropertyTarget } from '../property';
import { Scene } from '../scene';
import { degToRad } from '../geom';

function defaultValue (defaults, key, value) {
  return defaults.hasOwnProperty(key) ? defaults[key] : value;
}

export class Sprite implements TimelineElement, DynamicPropertyTarget {
  private scene: Scene;
  private children: Sprite[];
  public container: PIXI.Container;
  private graphics: PIXI.Graphics;
  public x: NumericProperty;
  public y: NumericProperty;
  public width: NumericProperty;
  public height: NumericProperty;
  public rotation: NumericProperty;
  public bgFill: NumericProperty;
  public opacity: NumericProperty;

  constructor (scene, defaults = {}) {
    this.scene = scene;
    this.scene.addSprite(this);
    this.children = [];
    this.container = new PIXI.Container();
    this.container.cursor = 'pointer';
    this.container.interactive = true;
    
    // setup dynamic properties
    const timeline = scene.project.timeline;
    this.x = new NumericProperty(this, 'x', defaultValue(defaults, 'x', 0), timeline);
    this.y = new NumericProperty(this, 'y', defaultValue(defaults, 'y', 0), timeline);
    this.width = new NumericProperty(this, 'width', defaultValue(defaults, 'width', 100), timeline);
    this.height = new NumericProperty(this, 'height', defaultValue(defaults, 'height', 100), timeline);
    this.rotation = new NumericProperty(this, 'rotation', defaultValue(defaults, 'rotation', 0), timeline);
    this.bgFill = new NumericProperty(this, 'bgFill', defaultValue(defaults, 'bgFill', color(0, 0, 255)), timeline);
    this.opacity = new NumericProperty(this, 'opacity', defaultValue(defaults, 'opacity', 1), timeline);

    // create graphics for bgFill
    const graphics = new PIXI.Graphics();
    this.graphics = graphics;
    this.container.addChild(graphics);
  }

  update () {
    const { container, graphics, x, y, width, height, rotation, bgFill, opacity } = this;
    graphics.beginFill(bgFill.value);
    graphics.drawRect(0, 0, 1, 1);
    graphics.endFill();
    container.x = x.value;
    container.y = y.value;
    graphics.width = width.value;
    graphics.height = height.value;
    container.rotation = degToRad(rotation.value);
    container.alpha = opacity.value;

    // cascade
    const children = this.children;
    const l = children.length;
    for (let i = 0; i < l; i++) {
      children[i].update();
    }
  }

  onChange (propertyName: string, newValue: any, oldValue: any) {

  }
}