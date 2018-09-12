import * as PIXI from 'pixi.js';
import * as Color from 'color';
import { TimelineElement } from '../timeline';
import { NumericProperty } from '../property';
import { Project } from '../project';
import { degToRad } from '../geom';

export class Sprite implements TimelineElement {
  private project: Project;
  public container: PIXI.Container;
  private graphics: PIXI.Graphics;
  public x: NumericProperty;
  public y: NumericProperty;
  public width: NumericProperty;
  public height: NumericProperty;
  public rotation: NumericProperty;
  public bgFill: NumericProperty;
  public opacity: NumericProperty;

  constructor (project) {
    this.project = project;
    const timeline = project.timeline;
    this.container = new PIXI.Container();
    this.container.cursor = 'pointer';
    this.container.interactive = true;

    // setup dynamic properties
    this.x = new NumericProperty('x', 0, timeline);
    this.y = new NumericProperty('y', 0, timeline);
    this.width = new NumericProperty('width', 100, timeline);
    this.height = new NumericProperty('height', 100, timeline);
    this.rotation = new NumericProperty('rotation', 0, timeline);
    this.bgFill = new NumericProperty('bgFill', Color.rgb(0, 255, 0).rgbNumber(), timeline);
    this.opacity = new NumericProperty('opacity', 1, timeline);

    // register as element with timeline
    timeline.addElement(this);

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
  }
}