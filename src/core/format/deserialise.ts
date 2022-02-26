import { Project } from 'src/core/project';
import { Scene } from 'src/core/scene';
import { ProjectDescriptor, SceneDescriptor } from 'src/core/format';

export function deserialiseProject({
  title,
  fps,
  width,
  height,
  scenes,
  currentScene,
}: ProjectDescriptor): Project {
  const project = new Project();
  project.title = title;
  project.fps = fps;
  project.width = width;
  project.height = height;
  if (scenes) {
    scenes.forEach(sceneDescriptor => {
      const scene = deserialiseScene(sceneDescriptor);
      project.scenes.set(scene.id, scene);
    });
    project.currentScene = currentScene;
  } else {
    const scene = new Scene();
    project.scenes.set(scene.id, scene);
    project.currentScene = scene.id;
  }
  return project;
}

export function deserialiseScene({ id }: SceneDescriptor): Scene {
  const scene = new Scene(id);
  return scene;
}
