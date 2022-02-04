import { Ticker } from "src/core/ticker";
import { Scene, SceneDescriptor } from "src/core/scene";
import Renderer from "src/core/renderer";
import { SerialisableObject, DataDescriptor } from "src/core/serialise";

export interface ProjectDescriptor extends DataDescriptor {
  title: string;
  fps: number;
  width: number;
  height: number;
  scenes: SceneDescriptor[];
  currentScene: string;
}

export class Project extends SerialisableObject<ProjectDescriptor> {
  title: string = Project.defaults.title;
  fps: number = Project.defaults.fps;
  width: number = Project.defaults.width;
  height: number = Project.defaults.height;
  scenes: Scene[];
  currentScene: Scene;
  ticker: Ticker;
  renderer: Renderer;

  static readonly defaults: Partial<ProjectDescriptor> = {
    title: "Untitled",
    fps: 24,
    width: 640,
    height: 480,
  };

  constructor() {
    super();

    const defaultScene = new Scene();
    this.scenes = [defaultScene];
    this.currentScene = defaultScene;
    this.ticker = new Ticker(this.fps);
    this.renderer = new Renderer(this);
  }

  toDescriptor(): ProjectDescriptor {
    return {
      ...super.toDescriptor(),
      title: this.title,
      fps: this.fps,
      width: this.width,
      height: this.height,
      scenes: this.scenes.map(scene => scene.toDescriptor()),
      currentScene: this.currentScene.id,
    };
  }

  fromDescriptor(descriptor: ProjectDescriptor) {
    const { title, fps, width, height } = descriptor;

    super.fromDescriptor(descriptor);

    this.title = title;
    this.fps = fps;
    this.width = width;
    this.height = height;

    if (descriptor.scenes && descriptor.currentScene) {
      const [scenes, idMap] = this.deserialiseDescriptorArray<
        SceneDescriptor,
        Scene
      >(descriptor.scenes, Scene);
      const currentScene = idMap.get(descriptor.currentScene);

      if (scenes && currentScene) {
        this.scenes = scenes;
        this.currentScene = currentScene;
      }
    }

    this.ticker.setFps(this.fps);
  }
}
